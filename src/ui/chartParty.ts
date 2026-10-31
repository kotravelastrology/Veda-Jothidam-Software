'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Party } from './PartyChooser';
import { getChartLibrary, type SavedChart } from '../portal/ChartLibraryManager';
import { useWorkspace } from '../workspace/workspaceContext';
import type { BirthFormInput } from '@/app/report/actions';

/**
 * Whose chart a page opens on. The worksheet and the pages that follow it share this, so a chart opened once stays the chart
 * on every page: a chart opened from the menu (`?load=`), else the workspace's active profile, else the last chart worked
 * on (the stash File > Save, Print and Notes read). `?new=1` is File > New: a blank birth-details form, not the last chart.
 */

export const STASH_KEY = 'kotravel_current_chart';

/** A chart saved in the browser (File > Save, Open) as the form input the calculations take. */
export function inputFromSaved(bd: SavedChart['birthData'], gender = 'male'): BirthFormInput {
  const [year, month, day] = bd.dateOfBirth.split('-').map(Number);
  const [hour, minute] = bd.timeOfBirth.split(':').map(Number);
  return {
    name: bd.name, gender, year, month, day, hour, minute: minute ?? 0, placeName: bd.place,
    latitude: Number(bd.latitude), longitude: Number(bd.longitude), utcOffsetMinutes: Number(bd.utcOffset), ianaTimeZone: 'Asia/Kolkata',
  };
}

export function readStash(): ({ birthData?: SavedChart['birthData'] } & Record<string, unknown>) | null {
  try {
    const raw = localStorage.getItem(STASH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Makes the person on screen the chart the menus (Save, Print, Notes, Events) act on, keeping that chart's notes and events. */
export function writeStash(b: { name: string; gender: string; year: number; month: number; day: number; hour: number; minute: number; placeName: string; latitude: number; longitude: number; utcOffsetMinutes: number }) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const birthData = {
    name: b.name, gender: b.gender, dateOfBirth: `${b.year}-${pad(b.month)}-${pad(b.day)}`, timeOfBirth: `${pad(b.hour)}:${pad(b.minute)}`,
    place: b.placeName, latitude: b.latitude, longitude: b.longitude, utcOffset: b.utcOffsetMinutes,
  };
  try {
    const prior = readStash();
    const same = prior?.birthData && prior.birthData.name === birthData.name && prior.birthData.dateOfBirth === birthData.dateOfBirth
      && prior.birthData.timeOfBirth === birthData.timeOfBirth;
    localStorage.setItem(STASH_KEY, JSON.stringify({ ...(same ? prior : {}), birthData, selectedChartId: 'D1-rasi' }));
  } catch { /* the menus then ask for a chart, as before */ }
}

export function useChartParty() {
  const params = useSearchParams();
  const { activeProfile, restored } = useWorkspace();
  const [party, setParty] = useState<Party | null>(null);
  const [resolved, setResolved] = useState(false);
  const [recent, setRecent] = useState<SavedChart[]>([]);
  const loadId = params.get('load');
  const isNew = params.get('new') === '1';

  useEffect(() => {
    try { setRecent(getChartLibrary().getAllCharts().slice(0, 6)); } catch { /* no saved charts */ }
  }, []);

  useEffect(() => {
    if (resolved || !restored) return;
    setResolved(true);
    if (isNew) return;
    if (loadId) {
      const saved = getChartLibrary().getChart(loadId);
      if (saved) { setParty({ kind: 'form', input: inputFromSaved(saved.birthData), label: saved.name }); return; }
    }
    if (activeProfile) {
      setParty({ kind: 'profile', profileId: activeProfile.profileId, revision: activeProfile.revision, label: activeProfile.name });
      return;
    }
    const stash = readStash();
    if (stash?.birthData) setParty({ kind: 'form', input: inputFromSaved(stash.birthData), label: stash.birthData.name });
  }, [resolved, restored, loadId, isNew, activeProfile]);

  return { party, setParty, recent, isNew };
}
