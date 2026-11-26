import type { TodayPlace } from '../panchangam/todayPanchangam';
import type { BirthFormInput } from '../../app/report/actions';
import type { DashaOptions } from '../calc/chartRuns';

/**
 * Calculation on the device when the server cannot be reached. The same calculation modules the server actions call
 * (src/panchangam/todayPanchangam.ts, src/calc/chartRuns.ts) run here, with @swisseph/node resolved to the WebAssembly build of the same
 * Swiss Ephemeris and the same .se1 files (src/ephemeris/browserSwisseph.js; next.config.mjs), so the results are the server's
 * (test-offline-ephemeris.js). Everything is loaded on first use, or ahead of time by warmLocalEngine() so that the service worker keeps
 * it for the day there is no connection.
 *
 * Settings > "இணையம் இல்லாமலும் கணக்கிடு" turns it off (OFFLINE_CALC_KEY = 'off'); it is on otherwise.
 */
export const OFFLINE_CALC_KEY = 'kotravel-offline-calc';
export const EPHE_FILES = ['sepl_18.se1', 'semo_18.se1', 'seas_18.se1'];

export function offlineCalcEnabled(): boolean {
  try {
    return localStorage.getItem(OFFLINE_CALC_KEY) !== 'off';
  } catch {
    return true;
  }
}

let ready: Promise<void> | null = null;

/** Loads the WebAssembly ephemeris and its files once. */
export function ensureLocalEngine(): Promise<void> {
  ready ??= (async () => {
    const mod: any = await import('../ephemeris/browserSwisseph');
    const api = mod.initBrowserSwisseph ? mod : mod.default;
    await api.initBrowserSwisseph({ files: EPHE_FILES.map((name) => ({ name, url: `/ephe/${name}` })) });
  })().catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

/**
 * Fetches everything the device needs to calculate without a connection (the WebAssembly module, the ephemeris files and the
 * calculation code), so the service worker keeps it. Called once the app is idle, in the production build, when switched on.
 */
export async function warmLocalEngine(): Promise<void> {
  await ensureLocalEngine();
  await Promise.all([import('../panchangam/todayPanchangam'), import('../calc/chartRuns')]);
}

export async function localToday(place: TodayPlace) {
  await ensureLocalEngine();
  const { todayPanchangam } = await import('../panchangam/todayPanchangam');
  return todayPanchangam(place);
}

export async function localPersonalToday(input: BirthFormInput, dashaOptions?: DashaOptions) {
  await ensureLocalEngine();
  const { personalTodayRun } = await import('../calc/chartRuns');
  return personalTodayRun(input, dashaOptions, Date.now());
}

export async function localDashaTimeline(input: BirthFormInput, dashaOptions?: DashaOptions) {
  await ensureLocalEngine();
  const { dashaTimelineRun } = await import('../calc/chartRuns');
  return dashaTimelineRun(input, dashaOptions);
}

export async function localWorksheet(input: BirthFormInput, dashaOptions?: DashaOptions) {
  await ensureLocalEngine();
  const { worksheetRun } = await import('../calc/chartRuns');
  return worksheetRun(input, dashaOptions, null);
}

/** A failure to reach the server (no network, server down), not an error of the calculation. */
export function isNetworkFailure(e: unknown): boolean {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
  const message = String((e as { message?: unknown })?.message ?? e);
  return e instanceof TypeError || /fetch|network|load failed|connection|offline|unexpected response/i.test(message);
}

/**
 * Asks the server; when the server cannot be reached and calculation on the device is on, calculates here instead.
 * `local` says which one answered, so the page can say so.
 */
export async function withLocalFallback<T>(server: () => Promise<T>, local: () => Promise<T>): Promise<{ value: T; local: boolean }> {
  try {
    return { value: await server(), local: false };
  } catch (e) {
    if (!offlineCalcEnabled() || !isNetworkFailure(e)) throw e;
    return { value: await local(), local: true };
  }
}
