'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { KEY, CHANGE_EVENT, sanitize, writePrefs } from './screenPrefsStore';
import * as TimeTool from './timeToolStore';
import { CHANGE_EVENT as OPEN_CHART_EVENT, describeOpenChart, readStash } from './openChartStore';
import { useWorkspace } from '../workspace/workspaceContext';
import { loadChartStyle, type ChartStyle } from '../charts/kattam/rasiNames';

/** Hooks over the plain stores (screenPrefsStore.js, timeToolStore.js, openChartStore.js): a part of the screen that reads one re-renders when it changes. */

function subscribeTo(eventName: string) {
  return (callback: () => void) => {
    window.addEventListener(eventName, callback);
    window.addEventListener('storage', callback);
    return () => { window.removeEventListener(eventName, callback); window.removeEventListener('storage', callback); };
  };
}
const subscribePrefs = subscribeTo(CHANGE_EVENT);
const subscribeOpenChart = subscribeTo(OPEN_CHART_EVENT);

/** The screen preferences (toolbar, worksheet layout, colours) and a function to change them. */
export function useScreenPrefs() {
  const raw = useSyncExternalStore(
    subscribePrefs,
    () => { try { return localStorage.getItem(KEY) ?? ''; } catch { return ''; } },
    () => '',
  );
  const prefs = useMemo(() => {
    try { return sanitize(raw ? JSON.parse(raw) : null); } catch { return sanitize(null); }
  }, [raw]);
  const setPrefs = useCallback((patch: Partial<typeof prefs>) => writePrefs(patch), []);
  return { prefs, setPrefs };
}

/** A planet's colour (by its two-letter name): the user's choice in the Colors dialog, else `fallback`. */
export function usePlanetColor() {
  const { prefs } = useScreenPrefs();
  return useCallback((abbr: string, fallback?: string) => prefs.planetColors[abbr as keyof typeof prefs.planetColors] ?? fallback, [prefs.planetColors]);
}

/** The time tool's moment: null while it follows the clock, else the Unix time (ms) the user moved to. */
export function useTimeTool() {
  const atMs = useSyncExternalStore(TimeTool.subscribe, TimeTool.getAt, () => null);
  return { atMs, setAt: TimeTool.setAt };
}

/** The open chart as the toolbar's line shows it, or null when none is open. */
export function useOpenChart() {
  const { activeProfile } = useWorkspace();
  const stashRaw = useSyncExternalStore(
    subscribeOpenChart,
    () => { try { return localStorage.getItem('kotravel_current_chart') ?? ''; } catch { return ''; } },
    () => '',
  );
  const hydrated = useHydrated();
  return useMemo(() => {
    void stashRaw; // the stash is read again whenever its text changes
    // The server cannot see the browser's storage: until the page has hydrated, render as the server did (nothing open)
    return hydrated ? describeOpenChart(activeProfile) : null;
  }, [stashRaw, activeProfile, hydrated]);
}

const noSubscribe = () => () => {};
/** False while the page is being hydrated (and on the server), true after: for what only the browser can know. */
export function useHydrated() {
  return useSyncExternalStore(noSubscribe, () => true, () => false);
}

/** The open chart's birth place for the steps that need one (ascendant, navamsha): the stash's, else Chennai's. */
export function openChartPlace() {
  const bd = readStash()?.birthData;
  return bd
    ? { latitude: Number(bd.latitude), longitude: Number(bd.longitude), utcOffsetMinutes: Number(bd.utcOffset), placeName: bd.place }
    : { latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, placeName: 'சென்னை' };
}

/** The chart style the user chose (South or North Indian); follows the Chart style dialog without a reload. */
export function useChartStyle(): ChartStyle {
  return useSyncExternalStore(
    subscribeTo('kotravel:chart-style'),
    () => loadChartStyle(),
    () => 'south' as ChartStyle,
  );
}
