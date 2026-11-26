/**
 * Notifications (src/notify/): the words of the messages, the coming dasha changes, the checks on what a browser hands the server, the
 * store, the minute-by-minute clock with a fixed time and a sender that only records, the sender's handling of the push service's
 * answers, and the service worker's handlers. Nothing is sent anywhere.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const T = require('./src/notify/notifyText');
const { upcomingDashaChanges } = require('./src/notify/dashaChanges');
const S = require('./src/notify/scheduler');
const { openNotifyStore, MAX_SUBSCRIPTIONS } = require('./src/notify/notifyStore');
const { YEARS, CYCLE } = require('./src/dasha/dashaDrill');

const DAY = 86400000;
const EPOCH_JD = 2440587.5;
const toJd = (ms) => ms / DAY + EPOCH_JD;

// ------------------------------------------------------------------ the words
const today = {
  date: '2026-11-21', placeName: 'Chennai', weekdayTa: 'சனி', sunrise: '06:11',
  tithi: { paksha: 'வளர்பிறை', name: 'ஏகாதசி', until: '08:01' }, nakshatra: { name: 'உத்திரட்டாதி', until: '07:57' },
  yoga: { name: 'வஜ்ரம்', until: '04:12 (22/11)' }, karana: { name: 'பவம்', until: '08:01' },
  rahuKalam: '09:02–10:28', yamagandam: '13:21–14:47', gulikaKalam: '06:11–07:37',
};
const daily = T.dailyMessage(today);
assert.equal(daily.title, '🗓️ இன்றைய பஞ்சாங்கம் — சனி, 21 நவம்பர் 2026');
assert.equal(daily.body, [
  '📍 Chennai · 🌅 உதயம் 06:11',
  'திதி: வளர்பிறை ஏகாதசி (08:01 வரை)',
  'நட்சத்திரம்: உத்திரட்டாதி (07:57 வரை) · யோகம்: வஜ்ரம்',
  'ராகு காலம்: 09:02–10:28 · எமகண்டம்: 13:21–14:47',
].join('\n'));
assert.equal(daily.url, '/');
assert.equal(daily.tag, 'panchangam-2026-11-21', 'one message a day replaces the earlier one with the same tag');
for (const word of ['நல்ல', 'கெட்ட', 'அதிர்ஷ்ட', 'good', 'bad']) assert.ok(!daily.title.includes(word) && !daily.body.includes(word), 'no verdict in the message');

assert.deepEqual(T.localParts(Date.UTC(2026, 10, 21, 0, 30), 'Asia/Kolkata'), { date: '2026-11-21', hm: '06:00' });
assert.deepEqual(T.localParts(Date.UTC(2026, 10, 20, 23, 59), 'Asia/Kolkata'), { date: '2026-11-21', hm: '05:29' });
assert.deepEqual(T.localParts(Date.UTC(2026, 6, 1, 4, 0), 'Europe/Oslo'), { date: '2026-07-01', hm: '06:00' }, 'summer time');
// the morning of the day of a change, in the reader's zone
assert.equal(T.noticeTime(Date.UTC(2026, 10, 21, 8, 0), 'Asia/Kolkata', '06:00'), Date.UTC(2026, 10, 21, 0, 30));
assert.equal(T.noticeTime(Date.UTC(2026, 10, 20, 21, 0), 'Asia/Kolkata', '06:00'), Date.UTC(2026, 10, 21, 0, 30), '02:30 IST on the 21st is told at 06:00 on the 21st');
assert.equal(T.noticeTime(Date.UTC(2026, 0, 15, 12, 0), 'Europe/Oslo', '07:00'), Date.UTC(2026, 0, 15, 6, 0), 'winter: UTC+1');
assert.equal(T.noticeTime(Date.UTC(2026, 6, 15, 12, 0), 'Europe/Oslo', '07:00'), Date.UTC(2026, 6, 15, 5, 0), 'summer: UTC+2');

const dm = T.dashaMessage({ name: 'Meera', change: { atMs: Date.UTC(2027, 2, 3, 9, 15), level: 2, chain: [{ lord: 'Sun' }, { lord: 'Moon' }] }, timeZone: 'Asia/Kolkata' });
assert.equal(dm.title, '⏳ Meera: சந்திரன் புக்தி தொடக்கம்');
assert.equal(dm.body, '3 மார்ச் 2027 14:45 முதல் (உங்கள் நேரப்படி): சூரியன் தசை – சந்திரன் புக்தி.\nவிம்சோத்தரி தசை · விவரம் தசைப் பக்கத்தில்.');
assert.equal(dm.url, '/dasha-timeline');
assert.ok(T.TEST_MESSAGE.title && T.TEST_MESSAGE.url === '/settings');

// ------------------------------------------------------------------ the coming dasha changes (nine mahadashas from Sun, 1 Jan 2026)
const start = Date.UTC(2026, 0, 1);
const order = [...CYCLE.slice(CYCLE.indexOf('Sun')), ...CYCLE.slice(0, CYCLE.indexOf('Sun'))];
let cursor = toJd(start);
const mahadashas = order.map((lord) => {
  const p = { lord, startJd: cursor, endJd: cursor + YEARS[lord] * 365.25 };
  cursor = p.endJd;
  return p;
});
const atDays = (ms) => Math.round(((ms - start) / DAY) * 1000) / 1000;
{
  const md = upcomingDashaChanges({ mahadashas, fromMs: start + DAY, untilMs: start + 30 * 365.25 * DAY, levels: 1 });
  assert.deepEqual(md.map((c) => [c.level, c.chain.map((p) => p.lord).join('/')]), [[1, 'Moon'], [1, 'Mars'], [1, 'Rahu']]);
  assert.deepEqual(md.map((c) => atDays(c.atMs)), [6 * 365.25, 16 * 365.25, 23 * 365.25]);

  const bh = upcomingDashaChanges({ mahadashas, fromMs: start + DAY, untilMs: start + 365.25 * DAY, levels: 2 });
  assert.deepEqual(bh.map((c) => [c.level, c.chain.map((p) => p.lord).join('/')]), [[2, 'Sun/Moon'], [2, 'Sun/Mars']]);
  assert.deepEqual(bh.map((c) => atDays(c.atMs)), [109.575, 292.2], 'Sun bhukti 0.3 y, Moon bhukti 0.5 y of the 6-year dasha');

  const sunEnd = start + 6 * 365.25 * DAY;
  const across = upcomingDashaChanges({ mahadashas, fromMs: sunEnd - 10 * DAY, untilMs: sunEnd + 30 * DAY, levels: 2 });
  assert.equal(across.length, 1);
  assert.deepEqual([across[0].level, across[0].chain.map((p) => p.lord).join('/')], [1, 'Moon/Moon'], 'a new dasha is a level-1 change');

  const antara = upcomingDashaChanges({ mahadashas, fromMs: start + DAY, untilMs: start + 120 * DAY, levels: 3, max: 5 });
  assert.equal(antara.length, 5, 'max holds');
  assert.ok(antara.every((c, i) => c.chain.length === 3 && (i === 0 || c.atMs > antara[i - 1].atMs)));
  assert.deepEqual(upcomingDashaChanges({ mahadashas: [], fromMs: 0, untilMs: 1 }), []);
  const end = toJd(start) + 120 * 365.25;
  assert.deepEqual(upcomingDashaChanges({ mahadashas, fromMs: (end - EPOCH_JD) * DAY + DAY, untilMs: (end - EPOCH_JD) * DAY + 400 * DAY }), [], 'nothing after the 120 years');
}

// ------------------------------------------------------------------ what a browser may hand the server
const P256 = 'B'.padEnd(87, 'A');
const AUTH = 'x'.repeat(22);
assert.equal(S.isPushEndpoint('https://fcm.googleapis.com/fcm/send/abc'), true);
assert.equal(S.isPushEndpoint('https://updates.push.services.mozilla.com/wpush/v2/abc'), true);
assert.equal(S.isPushEndpoint('https://web.push.apple.com/QGabc'), true);
assert.equal(S.isPushEndpoint('https://wns2-bl2p.notify.windows.com/w/?token=abc'), true);
for (const bad of ['http://fcm.googleapis.com/x', 'https://localhost/x', 'https://127.0.0.1/x', 'https://169.254.169.254/latest', 'https://fcm.googleapis.com.evil.example/x',
  'https://fcm.googleapis.com:8443/x', 'https://user:pw@fcm.googleapis.com/x', 'https://evilnotify.windows.com.example/x', 'not a url', '']) {
  assert.equal(S.isPushEndpoint(bad), false, `refused: ${bad}`);
}
assert.deepEqual(S.sanitizeSubscription({ endpoint: 'https://fcm.googleapis.com/fcm/send/abc', keys: { p256dh: P256, auth: AUTH } }),
  { endpoint: 'https://fcm.googleapis.com/fcm/send/abc', p256dh: P256, auth: AUTH });
assert.throws(() => S.sanitizeSubscription({ endpoint: 'https://example.com/push', keys: { p256dh: P256, auth: AUTH } }), RangeError);
assert.throws(() => S.sanitizeSubscription({ endpoint: 'https://fcm.googleapis.com/x', keys: { p256dh: 'short', auth: AUTH } }), RangeError);
assert.throws(() => S.sanitizeSubscription({ endpoint: 'https://fcm.googleapis.com/x', keys: { p256dh: P256, auth: 'a/b' } }), RangeError);
assert.throws(() => S.sanitizeSubscription(null), RangeError);

const chennai = { latitude: 13.08, longitude: 80.27, timeZone: 'Asia/Kolkata', placeName: 'Chennai<script>' };
assert.deepEqual(S.sanitizePrefs({ timeZone: 'Asia/Kolkata', daily: { on: true, time: '6am', place: chennai }, dasha: { on: true, name: '', levels: 9, extra: 1 }, x: 1 }), {
  timeZone: 'Asia/Kolkata',
  daily: { on: true, time: '06:00', place: { latitude: 13.08, longitude: 80.27, timeZone: 'Asia/Kolkata', placeName: 'Chennai script' } },
  dasha: { on: true, name: 'ஜாதகம்', levels: 2, until: null },
});
assert.deepEqual(S.sanitizePrefs({ timeZone: 'Mars/Olympus' }), { timeZone: 'Asia/Kolkata', daily: { on: false }, dasha: { on: false } });
assert.throws(() => S.sanitizePrefs({ daily: { on: true, place: { ...chennai, latitude: 95 } } }), RangeError);
assert.throws(() => S.sanitizePrefs({ daily: { on: true, place: { ...chennai, timeZone: 'Nowhere/Town' } } }), RangeError);
assert.equal(S.inDailyWindow('06:00', '06:00'), true);
assert.equal(S.inDailyWindow('05:59', '06:00'), false);
assert.equal(S.inDailyWindow('11:59', '06:00'), true);
assert.equal(S.inDailyWindow('12:00', '06:00'), false, 'six hours after the chosen time, not later');
assert.equal(S.inDailyWindow('23:30', '21:00'), true, 'an evening time runs to midnight');

// ------------------------------------------------------------------ the store
{
  const st = openNotifyStore(':memory:');
  let made = 0;
  const gen = () => { made += 1; return { publicKey: `pub${made}`, privateKey: `priv${made}` }; };
  assert.deepEqual(st.vapidKeys(gen, {}), { publicKey: 'pub1', privateKey: 'priv1' });
  assert.deepEqual(st.vapidKeys(gen, {}), { publicKey: 'pub1', privateKey: 'priv1' }, 'made once, then kept');
  assert.deepEqual(st.vapidKeys(gen, { VAPID_PUBLIC_KEY: 'E', VAPID_PRIVATE_KEY: 'F' }), { publicKey: 'E', privateKey: 'F' }, 'the environment wins');
  for (let i = 0; i < MAX_SUBSCRIPTIONS; i += 1) assert.equal(st.saveSubscription({ endpoint: `https://fcm.googleapis.com/${i}`, p256dh: P256, auth: AUTH }, { daily: { on: false } }), true);
  assert.equal(st.saveSubscription({ endpoint: 'https://fcm.googleapis.com/one-more', p256dh: P256, auth: AUTH }, {}), false, 'the store is full for a new browser');
  assert.equal(st.saveSubscription({ endpoint: 'https://fcm.googleapis.com/7', p256dh: P256, auth: AUTH }, { daily: { on: false }, v: 2 }), true, 'a known browser may still update');
  assert.equal(st.getSubscription('https://fcm.googleapis.com/7').prefs.v, 2);
  st.close();
}

// ------------------------------------------------------------------ the clock, minute by minute
(async () => {
  const st = openNotifyStore(':memory:');
  const A = 'https://fcm.googleapis.com/fcm/send/A';
  const B = 'https://updates.push.services.mozilla.com/wpush/v2/B';
  st.saveSubscription({ endpoint: A, p256dh: P256, auth: AUTH }, S.sanitizePrefs({ timeZone: 'Asia/Kolkata', daily: { on: true, time: '06:00', place: chennai } }));
  st.saveSubscription({ endpoint: B, p256dh: P256, auth: AUTH }, S.sanitizePrefs({ timeZone: 'Asia/Kolkata' }));
  const sent = [];
  let answer = { ok: true };
  const send = async (sub, msg) => { sent.push([sub.endpoint, msg.tag]); return answer; };
  const todayFor = async (place) => ({ ...today, placeName: place.placeName });
  const tick = (ms) => S.runTick({ nowMs: ms, store: st, today: todayFor, send });
  const ist = (d, h, m) => Date.UTC(2026, 10, d, h, m) - 330 * 60000;

  assert.deepEqual(await tick(ist(21, 5, 59)), { sent: 0, dropped: 0, gone: 0, failed: 0 });
  assert.deepEqual(await tick(ist(21, 6, 0)), { sent: 1, dropped: 0, gone: 0, failed: 0 });
  assert.deepEqual(sent, [[A, 'panchangam-2026-11-21']]);
  assert.equal((await tick(ist(21, 6, 1))).sent, 0, 'once a day');
  assert.equal(st.getSubscription(A).lastDaily, '2026-11-21');

  answer = { ok: false, status: 503 };
  assert.deepEqual(await tick(ist(22, 6, 0)), { sent: 0, dropped: 0, gone: 0, failed: 1 });
  assert.equal(st.getSubscription(A).lastDaily, '2026-11-21', 'a failed send is put back');
  answer = { ok: true };
  assert.equal((await tick(ist(22, 6, 1))).sent, 1, 'and tried again the next minute');
  assert.equal((await tick(ist(23, 13, 0))).sent, 0, 'a server that was off all morning does not send it in the afternoon');

  // dated messages
  st.replaceNotices(B, 'dasha', [
    { atMs: ist(24, 7, 0), title: 't1', body: 'b', url: '/dasha-timeline', tag: 'dasha-1' },
    { atMs: ist(30, 7, 0), title: 't2', body: 'b', url: '/dasha-timeline', tag: 'dasha-2' },
  ]);
  assert.deepEqual(st.pendingNotices(B, 'dasha').map((n) => n.title), ['t1', 't2']);
  sent.length = 0;
  await tick(ist(24, 6, 59));
  assert.deepEqual(sent.filter(([e]) => e === B), [], 'not before its time');
  await tick(ist(24, 7, 0));
  assert.deepEqual(sent.filter(([e]) => e === B), [[B, 'dasha-1']]);
  await tick(ist(24, 7, 1));
  assert.equal(sent.filter(([e]) => e === B).length, 1, 'sent once');
  assert.deepEqual(st.pendingNotices(B, 'dasha').map((n) => n.title), ['t2']);
  st.replaceNotices(B, 'dasha', [{ atMs: ist(24, 7, 0), title: 'late', body: 'b', url: '/', tag: 'late' }]);
  assert.deepEqual(await tick(ist(26, 8, 0)), { sent: 1, dropped: 1, gone: 0, failed: 0 }, 'two days late: dropped, not sent as news (A gets its morning message)');

  // a browser the push service no longer knows is removed
  answer = { ok: false, gone: true, status: 410 };
  assert.deepEqual(await tick(ist(27, 6, 0)), { sent: 0, dropped: 0, gone: 1, failed: 0 });
  assert.equal(st.getSubscription(A), null);
  st.close();

  // two server processes on one file: only one claims a message
  const file = path.join(os.tmpdir(), `kotravel-notify-${process.pid}-${Date.now()}.db`);
  const one = openNotifyStore(file);
  const two = openNotifyStore(file);
  one.saveSubscription({ endpoint: A, p256dh: P256, auth: AUTH }, S.sanitizePrefs({ daily: { on: true, time: '06:00', place: chennai } }));
  const c1 = one.claimDaily(A, '2026-12-01');
  const c2 = two.claimDaily(A, '2026-12-01');
  assert.deepEqual([c1.claimed, c2.claimed], [true, false]);
  one.replaceNotices(A, 'dasha', [{ atMs: 1, title: 't', body: 'b', url: '/', tag: 'x' }]);
  const [due] = two.dueNotices(10);
  assert.deepEqual([one.claimNotice(due.id), two.claimNotice(due.id)], [true, false]);
  one.close();
  two.close();
  fs.rmSync(file, { force: true });

  // ------------------------------------------------------------------ the sender reads the push service's answer
  const webpush = require('web-push');
  const { makeSender, generateVapidKeys, vapidSubject } = require('./src/notify/pushSender');
  const keys = generateVapidKeys();
  assert.match(keys.publicKey, /^[A-Za-z0-9_-]{87}$/, 'an uncompressed P-256 point, base64url');
  assert.match(keys.privateKey, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(vapidSubject({}), 'mailto:notifications@kotravel.invalid');
  assert.equal(vapidSubject({ VAPID_SUBJECT: 'https://example.org' }), 'https://example.org');
  assert.equal(vapidSubject({ VAPID_SUBJECT: 'me' }), 'mailto:notifications@kotravel.invalid');
  const real = webpush.sendNotification;
  const calls = [];
  const send2 = makeSender({ ...keys, subject: 'mailto:test@example.org' });
  try {
    webpush.sendNotification = async (sub, payload, opts) => { calls.push({ sub, payload: JSON.parse(payload), opts }); return { statusCode: 201 }; };
    assert.deepEqual(await send2({ endpoint: A, p256dh: P256, auth: AUTH }, daily), { ok: true, status: 201 });
    assert.deepEqual(calls[0].sub, { endpoint: A, keys: { p256dh: P256, auth: AUTH } });
    assert.equal(calls[0].payload.tag, 'panchangam-2026-11-21');
    assert.equal(calls[0].opts.TTL, 6 * 3600);
    assert.equal(calls[0].opts.vapidDetails.subject, 'mailto:test@example.org');
    webpush.sendNotification = async () => { throw Object.assign(new Error('gone'), { statusCode: 410 }); };
    assert.deepEqual(await send2({ endpoint: A, p256dh: P256, auth: AUTH }, daily), { ok: false, gone: true, status: 410 });
    webpush.sendNotification = async () => { throw Object.assign(new Error('busy'), { statusCode: 500, body: 'try later' }); };
    assert.deepEqual(await send2({ endpoint: A, p256dh: P256, auth: AUTH }, daily), { ok: false, status: 500, error: 'try later' });
  } finally {
    webpush.sendNotification = real;
  }

  // ------------------------------------------------------------------ the service worker shows them and opens only this app's pages
  const sw = fs.readFileSync(path.join(__dirname, 'public/sw.js'), 'utf8');
  assert.ok(/addEventListener\('push'/.test(sw) && /showNotification\(/.test(sw) && /addEventListener\('notificationclick'/.test(sw));
  const appPath = new Function(`${sw.match(/function appPath\(url\) \{[\s\S]*?\n\}/)[0]}; return appPath;`)();
  assert.equal(appPath('/dasha-timeline'), '/dasha-timeline');
  for (const bad of ['//evil.example/x', 'https://evil.example/', 'javascript:alert(1)', undefined, 5]) assert.equal(appPath(bad), '/', `refused: ${bad}`);

  console.log('test-notify: all assertions passed');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
