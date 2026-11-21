'use client';

import { useSyncExternalStore } from 'react';

/**
 * What the browser tells the page about being an installed app and about the network. Kept in one small store so that the status bar,
 * the home page and the settings can read the same facts without each registering its own listeners.
 *
 *  - `online`: navigator.onLine (it only knows whether there is a network, not whether the server answers).
 *  - `installable`: the browser fired `beforeinstallprompt` and the page is not already running as an app (Chrome, Edge, Android).
 *  - `installed`: the page runs as an installed app (`display-mode: standalone`, or iOS's `navigator.standalone`).
 *  - `iosHint`: Safari on an iPhone or iPad, which has no install prompt: the user adds the app from the Share sheet.
 */
export interface PwaState {
  online: boolean;
  installable: boolean;
  installed: boolean;
  iosHint: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const SERVER_STATE: PwaState = { online: true, installable: false, installed: false, iosHint: false };
let state: PwaState = SERVER_STATE;
let deferred: BeforeInstallPromptEvent | null = null;
let started = false;
const listeners = new Set<() => void>();

function set(next: Partial<PwaState>) {
  const merged = { ...state, ...next };
  if (merged.online === state.online && merged.installable === state.installable && merged.installed === state.installed && merged.iosHint === state.iosHint) return;
  state = merged;
  listeners.forEach((l) => l());
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia?.('(display-mode: standalone)').matches === true || nav.standalone === true;
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

/** Starts the listeners once, on the first read in the browser. */
function start() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const standalone = isStandalone();
  state = { online: navigator.onLine, installable: false, installed: standalone, iosHint: !standalone && isIosSafari() };
  window.addEventListener('online', () => set({ online: true }));
  window.addEventListener('offline', () => set({ online: false }));
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    set({ installable: !isStandalone() });
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    set({ installable: false, installed: true, iosHint: false });
  });
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function usePwa(): PwaState {
  return useSyncExternalStore(subscribe, () => { start(); return state; }, () => SERVER_STATE);
}

/** Shows the browser's install dialog; true when the person accepted. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const event = deferred;
  deferred = null;
  set({ installable: false });
  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome === 'accepted';
}
