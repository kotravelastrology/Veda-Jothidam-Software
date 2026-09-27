'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  WorkspaceContext, ActiveProfile, WorkspaceLayout,
  DEFAULT_LAYOUT, WORKSPACE_STORAGE_KEY,
} from './workspaceContext';

/**
 * VJ-015 — the workspace shell's state.
 *
 * Holds the profile the whole app is working on, and the layout choices that
 * should survive a restart. Persisted to localStorage rather than the chart
 * library: this is per-machine UI preference, not user data, and it must not
 * end up in a VJ-012 backup where restoring someone else's archive would drag
 * their sidebar state along.
 */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfileState] = useState<ActiveProfile | null>(null);
  const [layout, setLayout] = useState<WorkspaceLayout>(DEFAULT_LAYOUT);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [restored, setRestored] = useState(false);

  // Read once on mount. localStorage is unavailable during SSR and can throw
  // in a private window, so a failure falls back to defaults rather than
  // taking the app down.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.activeProfile?.profileId) setActiveProfileState(saved.activeProfile);
        if (saved.layout) setLayout({ ...DEFAULT_LAYOUT, ...saved.layout });
      }
    } catch { /* defaults are fine */ }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify({ activeProfile, layout }));
    } catch { /* a full or blocked store must not break the workspace */ }
  }, [activeProfile, layout, restored]);

  const setActiveProfile = useCallback((profile: ActiveProfile | null) => {
    setActiveProfileState(profile);
  }, []);

  const updateLayout = useCallback((patch: Partial<WorkspaceLayout>) => {
    setLayout((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(() => ({
    activeProfile, setActiveProfile,
    layout, updateLayout,
    commandPaletteOpen, setCommandPaletteOpen,
    restored,
  }), [activeProfile, setActiveProfile, layout, updateLayout, commandPaletteOpen, restored]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
