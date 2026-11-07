'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  WorkspaceContext, ActiveProfile, WorkspaceLayout,
  DEFAULT_LAYOUT, WORKSPACE_STORAGE_KEY,
} from './workspaceContext';
import { readJson, writeJson, StoreFailure } from './persistentStore';

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
  const [storageFailure, setStorageFailure] = useState<StoreFailure | null>(null);

  // Read once on mount. localStorage is unavailable during SSR and can throw
  // in a private window, so a failure falls back to defaults rather than
  // taking the app down.
  useEffect(() => {
    const { value, failure } = readJson<any>(WORKSPACE_STORAGE_KEY, null);
    if (value?.activeProfile?.profileId) setActiveProfileState(value.activeProfile);
    if (value?.layout) setLayout({ ...DEFAULT_LAYOUT, ...value.layout });
    if (failure) setStorageFailure(failure);
    setRestored(true);
  }, []);

  // A failed write is reported, not swallowed: otherwise the user keeps
  // working, nothing persists, and they only find out after a restart.
  useEffect(() => {
    if (!restored) return;
    const result = writeJson(WORKSPACE_STORAGE_KEY, { activeProfile, layout });
    setStorageFailure(result.ok ? null : result.failure);
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
    storageFailure,
    dismissStorageFailure: () => setStorageFailure(null),
  }), [activeProfile, setActiveProfile, layout, updateLayout, commandPaletteOpen, restored, storageFailure]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
