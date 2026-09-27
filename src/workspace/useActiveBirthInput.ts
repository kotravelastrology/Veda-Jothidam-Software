'use client';

import { useEffect, useState } from 'react';
import { useWorkspace } from './workspaceContext';
import { openChart } from '../../app/library/actions';

export interface BirthFormFields {
  date: string;
  time: string;
  latitude: string;
  longitude: string;
}

/**
 * VJ-015 follow-up — lets a page use the workspace's active profile instead
 * of asking for birth details it has already been told.
 *
 * Returns both shapes on purpose:
 *
 * - `fields` fills the page's own form, so the values are visible and the
 *   practitioner can still override them for a one-off calculation.
 * - `input` is the *stored* birth input, carrying the time zone and the
 *   ayanamsha / house system the profile was saved with. Pages compute from
 *   this rather than re-deriving from `fields`, which would silently drop
 *   those settings back to defaults.
 *
 * Loads the profile's current revision, so correcting a birth time updates
 * every page that reads it.
 */
export function useActiveBirthInput() {
  const { activeProfile } = useWorkspace();
  const [input, setInput] = useState<any>(null);
  const [fields, setFields] = useState<BirthFormFields | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeProfile) {
      setInput(null);
      setFields(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    openChart(activeProfile.profileId, activeProfile.revision)
      .then((profile: any) => {
        if (cancelled || !profile?.input) return;
        const i = profile.input;
        const pad = (n: number) => String(n).padStart(2, '0');
        setInput({ ...i, ...profile.settings });
        setFields({
          date: `${i.year}-${pad(i.month)}-${pad(i.day)}`,
          time: `${pad(i.hour)}:${pad(i.minute ?? 0)}:00`,
          latitude: String(i.latitude),
          longitude: String(i.longitude),
        });
      })
      .catch(() => { /* a page stays usable with its own form */ })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [activeProfile]);

  return { profile: activeProfile, input, fields, loading };
}
