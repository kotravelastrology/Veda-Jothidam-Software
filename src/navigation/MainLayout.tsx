'use client';

import { ReactNode } from 'react';
import { TopMenuBar } from './TopMenuBar';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';
import { StatusBar } from './StatusBar';
import { useNavigation } from './navigationContext';
import { ActiveProfileBar } from '../workspace/ActiveProfileBar';
import { CommandPalette } from '../workspace/CommandPalette';

export function MainLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useNavigation();

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Top Menu Bar */}
      <TopMenuBar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Which person the workspace is working on (VJ-015) */}
          <ActiveProfileBar />

          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto pb-8">
            <div className={`${sidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>{children}</div>
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
