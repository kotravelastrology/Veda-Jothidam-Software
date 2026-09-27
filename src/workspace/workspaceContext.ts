import { createContext, useContext } from 'react';

/** The person whose chart the whole workspace is currently working on. */
export interface ActiveProfile {
  profileId: string;
  revision: number;
  name: string;
  birthDate: string | null;
  placeName: string | null;
}

/** Layout choices that should outlive a restart (VJ-015 "saved layouts"). */
export interface WorkspaceLayout {
  sidebarOpen: boolean;
  density: 'comfortable' | 'compact';
}

export interface WorkspaceContextType {
  activeProfile: ActiveProfile | null;
  /** Null clears the context, which is how "work on nobody" is expressed. */
  setActiveProfile: (profile: ActiveProfile | null) => void;
  layout: WorkspaceLayout;
  updateLayout: (patch: Partial<WorkspaceLayout>) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  /** False until the persisted state has been read, so the first paint does
   *  not flash a default layout over the user's saved one. */
  restored: boolean;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
}

export const DEFAULT_LAYOUT: WorkspaceLayout = { sidebarOpen: true, density: 'comfortable' };
export const WORKSPACE_STORAGE_KEY = 'kotravel-workspace';
