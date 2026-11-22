/*
 * Kotravel service worker (registered by src/pwa/PwaRegistrar.tsx in the production build only).
 *
 * It keeps three kinds of thing and nothing else:
 *   - the build's own files (/_next/static/*: scripts, styles and the fonts, whose names change with their content, so a kept copy is
 *     never stale) and the app icons: answered from the cache first;
 *   - /offline.html, a Tamil "no connection" page: shown when a page is asked for and the network fails;
 *   - nothing of any chart, calculation or page data: pages and every server action go to the network, so what is shown is always
 *     computed now and never an old copy of a chart.
 *
 * It also shows the notifications the server sends (src/notify/scheduler.js: the morning panchangam, a dasha change, a test), and a tap
 * on one opens its page in the app.
 */
const VERSION = 'kotravel-v2';
const STATIC_CACHE = `${VERSION}-static`;
const PRECACHE = ['/offline.html', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return; // server actions and forms are never touched
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isBuildFile = url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/');
  if (isBuildFile) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      }),
    );
    return;
  }

  // A page: the network, and the "no connection" page when there is none (client-side route changes are not navigations and
  // are left to the browser)
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline.html')));
  }
});

/** A page of this app only ('/dasha-timeline'), never another site. */
function appPath(url) {
  return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') ? url : '/';
}

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  const options = {
    body: typeof data.body === 'string' ? data.body : '',
    icon: '/icons/icon-192.png',
    lang: 'ta',
    data: { url: appPath(data.url) },
  };
  if (typeof data.tag === 'string' && data.tag) options.tag = data.tag;
  event.waitUntil(self.registration.showNotification(typeof data.title === 'string' && data.title ? data.title : 'Kotravel', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(appPath(event.notification.data && event.notification.data.url), self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const exact = windows.find((w) => w.url === url);
    if (exact) return exact.focus();
    const ours = windows.find((w) => new URL(w.url).origin === self.location.origin);
    if (ours) {
      await ours.focus();
      return ours.navigate(url);
    }
    return self.clients.openWindow(url);
  })());
});
