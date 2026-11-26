'use strict';

/**
 * What the notification clock does each minute (src/notify/schedulerHost.ts runs it in the server process), and the checks on what a
 * browser hands the server. Pure but for the store, the panchangam and the sender, which are passed in, so test-notify.js runs it with
 * a store in memory, a fixed clock and a sender that only records.
 *
 * Each minute:
 *  1. dated messages whose time has come (the dasha notices) are sent; one more than 36 hours late is dropped, not sent as news;
 *  2. each browser that asked for the morning panchangam gets it once a local day, at its chosen time or within six hours after it
 *     (a server that was off at six still sends it at nine, not at eleven at night).
 * A message is claimed in the store before it is sent, so two server processes on one file never both send it; a failed send is put
 * back for the next minute; a browser the push service no longer knows (404/410) is removed.
 */
const { dailyMessage, localParts } = require('./notifyText');

const LATE_LIMIT_MS = 36 * 3600 * 1000;
const DAILY_WINDOW_MIN = 6 * 60;

/** Only the browsers' own push services: the server must not be made to post to any other address (an internal one, say). */
function isPushEndpoint(endpoint) {
  let u;
  try { u = new URL(String(endpoint)); } catch { return false; }
  if (u.protocol !== 'https:' || u.port !== '' || u.username || u.password) return false;
  const h = u.hostname.toLowerCase();
  return h === 'fcm.googleapis.com'
    || h === 'android.googleapis.com'
    || h === 'updates.push.services.mozilla.com'
    || h.endsWith('.push.services.mozilla.com')
    || h === 'web.push.apple.com'
    || h.endsWith('.push.apple.com')
    || h.endsWith('.notify.windows.com');
}

function validZone(zone) {
  if (typeof zone !== 'string' || zone.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: zone }).format(0);
    return true;
  } catch {
    return false;
  }
}

/** A PushSubscription's JSON as the browser gives it ({ endpoint, keys: { p256dh, auth } }), checked; throws RangeError otherwise. */
function sanitizeSubscription(sub) {
  const endpoint = String(sub?.endpoint ?? '');
  const p256dh = String(sub?.keys?.p256dh ?? '');
  const auth = String(sub?.keys?.auth ?? '');
  if (endpoint.length > 1000 || !isPushEndpoint(endpoint)) throw new RangeError('not a push service address');
  if (!/^[A-Za-z0-9_-]{86,87}=?$/.test(p256dh)) throw new RangeError('p256dh is not a P-256 public key');
  if (!/^[A-Za-z0-9_-]{22}(==)?$/.test(auth)) throw new RangeError('auth is not a 16-byte secret');
  return { endpoint, p256dh, auth };
}

function cleanText(s, max) {
  return String(s ?? '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function sanitizePlace(place) {
  const latitude = Number(place?.latitude);
  const longitude = Number(place?.longitude);
  if (!(Math.abs(latitude) <= 90) || !(Math.abs(longitude) <= 180)) throw new RangeError('place: latitude or longitude');
  if (!validZone(place?.timeZone)) throw new RangeError('place: time zone');
  return { latitude, longitude, timeZone: place.timeZone, placeName: cleanText(place?.placeName, 80) || 'இடம்' };
}

/**
 * A browser's choices: its own time zone; the morning panchangam (time and place); the dasha notices (whose chart, how deep, and up
 * to when they were set). Anything else is dropped.
 */
function sanitizePrefs(p) {
  const timeZone = validZone(p?.timeZone) ? p.timeZone : 'Asia/Kolkata';
  const daily = p?.daily?.on
    ? { on: true, time: /^([01]\d|2[0-3]):[0-5]\d$/.test(p.daily.time) ? p.daily.time : '06:00', place: sanitizePlace(p.daily.place) }
    : { on: false };
  const dasha = p?.dasha?.on
    ? {
      on: true,
      name: cleanText(p.dasha.name, 60) || 'ஜாதகம்',
      levels: [1, 2, 3].includes(p.dasha.levels) ? p.dasha.levels : 2,
      until: Number.isFinite(p.dasha.until) ? p.dasha.until : null,
    }
    : { on: false };
  return { timeZone, daily, dasha };
}

function minutes(hm) {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}

/** From the chosen time to six hours after it, the same local day. */
function inDailyWindow(hm, start) {
  const now = minutes(hm);
  const from = minutes(start);
  return now >= from && now < Math.min(from + DAILY_WINDOW_MIN, 24 * 60);
}

/**
 * @param {{ nowMs: number, store: any, today: (place: any, nowMs: number) => Promise<any>,
 *   send: (sub: { endpoint: string, p256dh: string, auth: string }, msg: { title: string, body: string, url: string, tag: string })
 *     => Promise<{ ok: boolean, gone?: boolean, status?: number }>, log?: (...a: any[]) => void }} deps
 */
async function runTick({ nowMs, store, today, send, log = () => {} }) {
  const nowIso = new Date(nowMs).toISOString();
  const tally = { sent: 0, dropped: 0, gone: 0, failed: 0 };
  const outcome = async (sub, msg, onFail) => {
    let r;
    try {
      r = await send(sub, msg);
    } catch (e) {
      r = { ok: false, error: e };
    }
    if (r.ok) tally.sent += 1;
    else if (r.gone) {
      store.removeSubscription(sub.endpoint);
      tally.gone += 1;
    } else {
      onFail();
      tally.failed += 1;
      log('notify: send failed', r.status ?? '', r.error ?? '');
    }
  };

  for (const n of store.dueNotices(nowMs)) {
    if (!store.claimNotice(n.id, nowIso)) continue;
    if (nowMs - n.atMs > LATE_LIMIT_MS) {
      tally.dropped += 1;
      continue;
    }
    await outcome({ endpoint: n.endpoint, p256dh: n.p256dh, auth: n.auth }, { title: n.title, body: n.body, url: n.url, tag: n.tag }, () => store.releaseNotice(n.id));
  }

  for (const sub of store.listSubscriptions()) {
    const d = sub.prefs?.daily;
    if (!d?.on) continue;
    const { date, hm } = localParts(nowMs, d.place.timeZone);
    if (sub.lastDaily === date || !inDailyWindow(hm, d.time)) continue;
    const claim = store.claimDaily(sub.endpoint, date);
    if (!claim.claimed) continue;
    let msg;
    try {
      msg = dailyMessage(await today(d.place, nowMs));
    } catch (e) {
      store.releaseDaily(sub.endpoint, claim.previous);
      tally.failed += 1;
      log('notify: panchangam failed', e);
      continue;
    }
    await outcome(sub, msg, () => store.releaseDaily(sub.endpoint, claim.previous));
  }
  return tally;
}

module.exports = { runTick, isPushEndpoint, sanitizeSubscription, sanitizePrefs, sanitizePlace, validZone, inDailyWindow, LATE_LIMIT_MS };
