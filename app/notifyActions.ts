'use server';

import type { BirthFormInput } from './report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openNotifyStore } = require('../src/notify/notifyStore');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sanitizeSubscription, sanitizePrefs, isPushEndpoint } = require('../src/notify/scheduler');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { makeSender, generateVapidKeys } = require('../src/notify/pushSender');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dashaMessage, noticeTime, TEST_MESSAGE } = require('../src/notify/notifyText');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { upcomingDashaChanges } = require('../src/notify/dashaChanges');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { planetLongitude } = require('../src/ephemeris/siderealPositions');

/**
 * Notifications (src/notify/NotificationSettings.tsx is the card on the settings page; src/notify/scheduler.js sends): a browser
 * switches them on with its push subscription and its choices, may follow one chart's dasha changes, and can ask for a test message.
 * The browser's push address is checked to be a real push service's before anything is stored.
 */

export interface NotifyPlace { latitude: number; longitude: number; timeZone: string; placeName: string }
export interface NotifyPrefs {
  timeZone: string;
  daily: { on: boolean; time?: string; place?: NotifyPlace };
  dasha: { on: boolean; name?: string; levels?: number; until?: number | null };
}
export interface PendingNotice { atMs: number; title: string }
export type NotifyStatus =
  | { subscribed: false }
  | { subscribed: true; prefs: NotifyPrefs; pending: PendingNotice[] };

let store: any = null;
function getStore() {
  store ??= openNotifyStore();
  return store;
}
let sender: any = null;
function getSender() {
  sender ??= makeSender(getStore().vapidKeys(generateVapidKeys));
  return sender;
}

const TWO_YEARS_MS = 2 * 365.25 * 24 * 3600 * 1000;

function fail(e: unknown): { ok: false; error: string } {
  if (e instanceof RangeError) return { ok: false, error: `ஏற்க முடியாத விவரம்: ${e.message}` };
  console.error('notify action:', e);
  return { ok: false, error: 'அறிவிப்பு அமைப்பைச் சேமிக்க இயலவில்லை.' };
}

/** The server's VAPID public key, for the browser's pushManager.subscribe (made on first use and kept, see notifyStore.js). */
export async function pushPublicKey(): Promise<string> {
  return getStore().vapidKeys(generateVapidKeys).publicKey;
}

export async function pushStatus(endpoint: string): Promise<NotifyStatus> {
  if (!isPushEndpoint(endpoint)) return { subscribed: false };
  const sub = getStore().getSubscription(endpoint);
  if (!sub) return { subscribed: false };
  const pending = getStore().pendingNotices(endpoint, 'dasha').slice(0, 3).map((n: PendingNotice) => ({ atMs: n.atMs, title: n.title }));
  return { subscribed: true, prefs: sub.prefs, pending };
}

/** Stores (or updates) this browser's subscription and choices. Switching the dasha notices off drops the waiting ones. */
export async function savePush(subscription: unknown, prefs: unknown): Promise<{ ok: true; prefs: NotifyPrefs } | { ok: false; error: string }> {
  try {
    const s = sanitizeSubscription(subscription);
    const p = sanitizePrefs(prefs);
    if (!getStore().saveSubscription(s, p)) return { ok: false, error: 'சேவையகத்தின் அறிவிப்புப் பட்டியல் நிறைந்துவிட்டது.' };
    if (!p.dasha.on) getStore().replaceNotices(s.endpoint, 'dasha', []);
    return { ok: true, prefs: p };
  } catch (e) {
    return fail(e);
  }
}

export async function removePush(endpoint: string): Promise<{ ok: boolean }> {
  if (!isPushEndpoint(endpoint)) return { ok: false };
  return { ok: getStore().removeSubscription(endpoint) };
}

export async function testPush(endpoint: string): Promise<{ ok: boolean; error?: string }> {
  const sub = isPushEndpoint(endpoint) ? getStore().getSubscription(endpoint) : null;
  if (!sub) return { ok: false, error: 'இந்தச் சாதனம் பதிவில் இல்லை.' };
  const r = await getSender()(sub, TEST_MESSAGE);
  if (r.gone) getStore().removeSubscription(endpoint);
  return r.ok ? { ok: true } : { ok: false, error: r.gone ? 'உலாவி இந்தப் பதிவைக் கைவிட்டது; மீண்டும் இயக்கவும்.' : `அனுப்ப இயலவில்லை (${r.status || 'இணைப்பு'}).` };
}

/**
 * Follows one chart: the coming starts of its Vimshottari periods for two years (dasha and bhukti, or with antara too) become dated
 * messages for this browser, told on the morning of each day. The chart is computed as the dasha page computes it; only the finished
 * messages are kept, not the birth details.
 */
export async function followDasha(
  endpoint: string,
  input: BirthFormInput,
  name: string,
  levels: number,
  dashaOptions?: { yearDays: number; balance: 'degree' | 'time' },
): Promise<{ ok: true; count: number; until: number | null; next: PendingNotice | null } | { ok: false; error: string }> {
  try {
    const sub = isPushEndpoint(endpoint) ? getStore().getSubscription(endpoint) : null;
    if (!sub) return { ok: false, error: 'முதலில் இந்தச் சாதனத்தில் அறிவிப்புகளை இயக்கவும்.' };
    const prefs = sanitizePrefs({ ...sub.prefs, dasha: { on: true, name, levels } });
    const request = createCalculationRequest({
      input,
      settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
      outputs: ['parashariChart', 'vimshottari'],
    });
    const options = dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
    const mahadashas = await withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
      const chart = calculateParashariChart(request.chartContext);
      const dasha = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, input.utcOffsetMinutes, {
        depth: 1,
        yearDays: options.yearDays,
        balance: options.balance,
        moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', request.settings.ayanamsha),
      });
      return dasha.dashas.map((d: any) => ({
        lord: d.lord,
        startJd: d.startJulianDay,
        endJd: d.endJulianDay,
        ...(d.fullStartJulianDay !== undefined ? { fullStartJd: d.fullStartJulianDay } : {}),
      }));
    });
    const now = Date.now();
    const changes = upcomingDashaChanges({ mahadashas, fromMs: now, untilMs: now + TWO_YEARS_MS, levels: prefs.dasha.levels, max: 40 });
    const morning = prefs.daily.on ? prefs.daily.time : '07:00';
    const notices = changes.map((change: any) => ({
      ...dashaMessage({ name: prefs.dasha.name, change, timeZone: prefs.timeZone }),
      atMs: noticeTime(change.atMs, prefs.timeZone, morning),
    }));
    const until = changes.length ? changes[changes.length - 1].atMs : null;
    getStore().replaceNotices(endpoint, 'dasha', notices);
    getStore().updatePrefs(endpoint, { ...prefs, dasha: { ...prefs.dasha, until } });
    return { ok: true, count: notices.length, until, next: notices[0] ? { atMs: notices[0].atMs, title: notices[0].title } : null };
  } catch (e) {
    return fail(e);
  }
}

export async function unfollowDasha(endpoint: string): Promise<{ ok: boolean }> {
  const sub = isPushEndpoint(endpoint) ? getStore().getSubscription(endpoint) : null;
  if (!sub) return { ok: false };
  getStore().replaceNotices(endpoint, 'dasha', []);
  getStore().updatePrefs(endpoint, { ...sub.prefs, dasha: { on: false } });
  return { ok: true };
}
