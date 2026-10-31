'use client';

import { ReactNode, Suspense } from 'react';
import { TopMenuBar } from './TopMenuBar';
import { WorksheetToolbar } from './WorksheetToolbar';
import { StatusBar } from './StatusBar';
import { ActiveProfileBar } from '../workspace/ActiveProfileBar';
import { CommandPalette } from '../workspace/CommandPalette';
import { useApplyAppearance } from '../ui/SettingsPanel';

export function MainLayout({ children }: { children: ReactNode }) {
  // Settings > Theme and Font size, on every page
  useApplyAppearance();

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Top Menu Bar */}
      <TopMenuBar />

      {/* The icon toolbar of the open chart (PL9's top toolbar) */}
      <Suspense fallback={null}>
        <WorksheetToolbar />
      </Suspense>

      {/* Main Content Area (the menus are in the drawer the ☰ button opens, see TopMenuBar) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Which person the workspace is working on (VJ-015) */}
          <ActiveProfileBar />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Ctrl+K command search (VJ-015) */}
      <CommandPalette />
    </div>
  );
}
