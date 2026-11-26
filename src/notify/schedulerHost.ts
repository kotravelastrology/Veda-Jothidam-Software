import { todayPanchangam } from '../panchangam/todayPanchangam';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openNotifyStore } = require('./notifyStore');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { runTick } = require('./scheduler');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { makeSender, generateVapidKeys } = require('./pushSender');

/**
 * The notification clock in the server process (started once by instrumentation.ts): every minute, src/notify/scheduler.js runTick.
 * Runs in the production server; in development only with KOTRAVEL_NOTIFY_SCHEDULER=on (a development page registers no service worker,
 * so it has no browser to send to). KOTRAVEL_NOTIFY_SCHEDULER=off stops it anywhere.
 */
const STARTED = Symbol.for('kotravel.notifyScheduler');
const TICK_MS = 60_000;
const WEEK_MS = 7 * 24 * 3600 * 1000;

export function startNotifyScheduler(): boolean {
  const g = globalThis as Record<symbol, unknown>;
  if (g[STARTED]) return false;
  const flag = process.env.KOTRAVEL_NOTIFY_SCHEDULER;
  if (flag === 'off') return false;
  if (process.env.NODE_ENV !== 'production' && flag !== 'on') return false;
  g[STARTED] = true;

  let store: any = null;
  let send: any = null;
  let running = false;
  let ticks = 0;

  const tick = async () => {
    if (running) return; // a slow minute is not overlapped by the next
    running = true;
    try {
      store ??= openNotifyStore();
      send ??= makeSender(store.vapidKeys(generateVapidKeys));
      const nowMs = Date.now();
      const tally = await runTick({
        nowMs,
        store,
        today: async (place: any, atMs: number) => todayPanchangam(place, atMs),
        send,
        log: (...a: unknown[]) => console.warn(...a),
      });
      if (tally.sent || tally.gone || tally.failed || tally.dropped) console.log('notify:', JSON.stringify(tally));
      ticks += 1;
      if (ticks % (24 * 60) === 1) store.pruneSent(nowMs - 4 * WEEK_MS);
    } catch (e) {
      console.error('notify: tick failed', e);
    } finally {
      running = false;
    }
  };

  setTimeout(tick, 15_000).unref?.();
  setInterval(tick, TICK_MS).unref?.();
  console.log('notify: scheduler started (every minute)');
  return true;
}
