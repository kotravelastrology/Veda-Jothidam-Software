'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Party } from './PartyChooser';
import { getChartLibrary, type SavedChart } from '../portal/ChartLibraryManager';
import { useWorkspace } from '../workspace/workspaceContext';
import type { BirthFormInput } from '@/app/report/actions';
import { openChart } from '@/app/library/actions';

/**
 * The chart that is open. A chart chosen once (File > New, File > Open, a saved chart in a list, Ctrl+K) stays the open chart on every
 * page, so no page asks for the name, place, date and time again. It is kept in one place, the stash (`kotravel_current_chart`) that
 * File > Save, Print, Notes and Events already read: the birth details of a chart entered by hand or opened from the browser's library,
 * or the saved profile's id (a profile is read with the settings it was saved with). The workspace's active profile follows it.
 *
 * `?new=1` on a page is File > New: a blank birth-details form, not the open chart. `?load=` is a chart opened from the menu.
 */

export { STASH_KEY, inputFromSaved, readStash, writeStash, writeStashProfile, resolveOpenParty } from './openChartStore';
import { inputFromSaved, writeStash, writeStashProfile, resolveOpenParty } from './openChartStore';

/** The saved profile that is open (the fields the workspace's active-profile bar shows). */
export interface OpenProfile { profileId: string; revision: number; name: string; birthDate: string | null; placeName: string | null }

/** Records the person just chosen as the open chart, and keeps the workspace's active profile in step. */
export function useRememberParty() {
  const { setActiveProfile } = useWorkspace();
  return useCallback((p: Party) => {
    if (p.kind === 'profile') {
      const profile: OpenProfile = { profileId: p.profileId, revision: p.revision, name: p.name ?? p.label, birthDate: p.birthDate ?? null, placeName: p.placeName ?? null };
      writeStashProfile(profile);
      setActiveProfile(profile);
    } else {
      writeStash(p.input);
      setActiveProfile(null);
    }
  }, [setActiveProfile]);
}

/** Saved charts in the browser's library, newest first: a quick pick when a second person is needed. */
export function useRecentCharts(count = 6) {
  const [recent, setRecent] = useState<SavedChart[]>([]);
  useEffect(() => {
    try { setRecent(getChartLibrary().getAllCharts().slice(0, count)); } catch { /* no saved charts */ }
  }, [count]);
  return recent;
}

/** Whose chart a page opens on (see the top of this file). For pages that show the person in their own header. */
export function useChartParty() {
  const params = useSearchParams();
  const { activeProfile, restored } = useWorkspace();
  const remember = useRememberParty();
  const [party, setPartyState] = useState<Party | null>(null);
  const [resolved, setResolved] = useState(false);
  const recent = useRecentCharts();
  const loadId = params.get('load');
  const isNew = params.get('new') === '1';

  const setParty = useCallback((p: Party | null) => {
    if (p) remember(p);
    setPartyState(p);
  }, [remember]);

  useEffect(() => {
    if (resolved || !restored) return;
    setResolved(true);
    if (isNew) return;
    if (loadId) {
      const saved = getChartLibrary().getChart(loadId);
      if (saved) { setParty({ kind: 'form', input: inputFromSaved(saved.birthData), label: saved.name }); return; }
    }
    const open = resolveOpenParty(activeProfile);
    if (open) setPartyState(open);
  }, [resolved, restored, loadId, isNew, activeProfile, setParty]);

  return { party, setParty, recent, isNew };
}

/**
 * The birth input of a chosen person, for the pages whose calculation takes one: the form's own, or a saved profile's with the
 * settings it was saved with (read from the library).
 */
export function usePartyInput(party: Party | null) {
  const [input, setInput] = useState<BirthFormInput | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!party) { setInput(null); return; }
    if (party.kind === 'form') { setInput(party.input); return; }
    let cancelled = false;
    setLoading(true);
    openChart(party.profileId, party.revision)
      .then((p: any) => { if (!cancelled) setInput(p?.input ? { ...p.input, ...p.settings } : null); })
      .catch(() => { if (!cancelled) setInput(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);
  return { input, loading };
}
