'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker (public/sw.js) in the production build only: the development server's hot reloading and a worker that
 * answers from a cache do not mix, and a worker left over from a development session would serve stale pages. In development any worker
 * registered earlier is removed.
 *
 * The worker keeps the app's static files (the scripts, styles, fonts and icons) and a Tamil "no connection" page; it never keeps a
 * chart, a calculation or a page's data, so a chart is never shown from an old copy.
 */
export function PwaRegistrar() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => undefined);
      return;
    }
    const register = () => navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => undefined);
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);
  return null;
}
