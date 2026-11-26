'use client';

import { useEffect } from 'react';
import { offlineCalcEnabled, warmLocalEngine } from '../offline/localEngine';

/** The pages public/sw.js keeps a frame of (SHELL_PAGES there), fetched once ahead of time so they open without a connection. */
const SHELL_PAGES = ['/', '/worksheet', '/dasha-timeline'];

/**
 * Registers the service worker (public/sw.js) in the production build only: the development server's hot reloading and a worker that
 * answers from a cache do not mix, and a worker left over from a development session would serve stale pages. In development any worker
 * registered earlier is removed.
 *
 * Once the worker runs and the app is idle, and unless Settings turned it off, it fetches what calculation on the device needs (the
 * WebAssembly ephemeris, its data files and the calculation code: src/offline/localEngine.ts) and the three shell pages, so the worker
 * has them on the day there is no connection. The worker never keeps a chart or a calculation.
 */
export function PwaRegistrar() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => undefined);
      return;
    }
    const warm = () => {
      if (!navigator.onLine || !offlineCalcEnabled()) return;
      warmLocalEngine().catch(() => undefined);
      for (const page of SHELL_PAGES) fetch(page, { headers: { accept: 'text/html' }, credentials: 'same-origin' }).catch(() => undefined);
    };
    const register = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(() => navigator.serviceWorker.ready)
        .then(() => {
          const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
          if (idle) idle(warm);
          else setTimeout(warm, 3000);
        })
        .catch(() => undefined);
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);
  return null;
}
