'use client';

import { ReactNode, Suspense } from 'react';
import { TopMenuBar } from './TopMenuBar';
import { WorksheetToolbar } from './WorksheetToolbar';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';
import { PwaRegistrar } from '../pwa/PwaRegistrar';
import { Translator } from '../i18n/Translator';
import { ActiveProfileBar } from '../workspace/ActiveProfileBar';
import { CommandPalette } from '../workspace/CommandPalette';
import { useApplyAppearance } from '../ui/SettingsPanel';

export function MainLayout({ children }: { children: ReactNode }) {
  // Settings > Theme and Font size, on every page
  useApplyAppearance();

  return (
    <div className="relative isolate flex flex-col h-dvh">
      {/* For the keyboard and screen readers: the first Tab goes to this link, which skips the menus and the toolbar */}
      <a href="#main-content" className="skip-link">உள்ளடக்கத்துக்குச் செல்</a>
      {/* A faint zodiac wheel and South Indian chart behind every page (globals.css) */}
      <div aria-hidden className="kotravel-watermark" />
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
          {/* On a phone the bottom bar (BottomNav) takes the place of the status bar, so the page keeps clear of it */}
          <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto pb-8 max-md:pb-[calc(4.5rem+env(safe-area-inset-bottom))] focus:outline-none">
            {children}
          </main>
        </div>
      </div>

      {/* Status Bar (larger screens) and the bottom tabs (phones) */}
      <StatusBar />
      <BottomNav />

      {/* Ctrl+K command search (VJ-015) */}
      <CommandPalette />

      {/* The service worker and the install prompt (production only) */}
      <PwaRegistrar />

      {/* English mode: replaces the Tamil text as it is drawn (src/i18n/translate.js); in Tamil mode it does nothing */}
      <Translator />
    </div>
  );
}
