/**
 * Service Worker
 *
 * Provides:
 * - Offline support
 * - Cache management
 * - Background sync
 * - Push notifications
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `veda-jothidam-${CACHE_VERSION}`;

// Files to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/pages/dashboard.html',
    '/pages/auth/login.html',
    '/pages/auth/register.html',
    '/pages/charts/create.html',
    '/pages/consultations/book.html',
    '/styles/global.css',
    '/services/api.js',
    '/services/auth.js',
    '/services/data.js',
    '/services/store.js',
    '/services/utils.js',
];

// API endpoints that can be cached
const CACHEABLE_ENDPOINTS = [
    '/api/auth/health',
    '/api/astrologers/available',
    '/api/charts/stats',
    '/api/consultations/stats',
];

// ============ INSTALL ============

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(error => {
                console.error('Failed to cache assets:', error);
                // Continue even if some assets fail
                return Promise.resolve();
            });
        }).then(() => {
            self.skipWaiting(); // Activate immediately
        })
    );
});

// ============ ACTIVATE ============

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            return self.clients.claim(); // Take control immediately
        })
    );
});

// ============ FETCH ============

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle API requests differently
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(handleApiRequest(request));
        return;
    }

    // Handle page requests (cache first, fallback to network)
    if (request.mode === 'navigate') {
        event.respondWith(handlePageRequest(request));
        return;
    }

    // Handle asset requests (cache first, fallback to network)
    event.respondWith(handleAssetRequest(request));
});

/**
 * Handle API requests (network first, fallback to cache)
 */
async function handleApiRequest(request) {
    try {
        // Try network first
        const response = await fetch(request);

        // Cache successful responses
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }

        return response;

    } catch (error) {
        // Fallback to cache
        console.log('API request failed, trying cache:', request.url);
        const cached = await caches.match(request);

        if (cached) {
            return cached;
        }

        // Return offline response
        return new Response(
            JSON.stringify({
                error: 'Offline - cached data unavailable',
                offline: true,
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

/**
 * Handle page requests (cache first, fallback to network)
 */
async function handlePageRequest(request) {
    try {
        // Try cache first
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }

        // Fallback to network
        const response = await fetch(request);

        // Cache successful responses
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }

        return response;

    } catch (error) {
        // Return offline page
        console.log('Page request failed, showing offline page:', request.url);
        return caches.match('/offline.html') || new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
        });
    }
}

/**
 * Handle asset requests (cache first, fallback to network)
 */
async function handleAssetRequest(request) {
    try {
        // Try cache first
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }

        // Fallback to network
        const response = await fetch(request);

        // Cache successful responses
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }

        return response;

    } catch (error) {
        // Return placeholder or error
        console.log('Asset request failed:', request.url);
        return new Response('Asset not available', {
            status: 404,
            statusText: 'Not Found',
        });
    }
}

// ============ BACKGROUND SYNC ============

self.addEventListener('sync', (event) => {
    console.log('Background sync event:', event.tag);

    if (event.tag === 'sync-consultations') {
        event.waitUntil(syncConsultations());
    } else if (event.tag === 'sync-charts') {
        event.waitUntil(syncCharts());
    }
});

/**
 * Sync pending consultations
 */
async function syncConsultations() {
    try {
        // Get pending consultations from IndexedDB
        const pending = await getPendingConsultations();

        // Send each to server
        for (const consultation of pending) {
            const response = await fetch('/api/consultations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getAuthToken()}`,
                },
                body: JSON.stringify(consultation),
            });

            if (response.ok) {
                // Remove from pending
                await removePendingConsultation(consultation.id);
            } else {
                throw new Error('Sync failed');
            }
        }

        console.log('Consultations synced successfully');

    } catch (error) {
        console.error('Failed to sync consultations:', error);
        throw error; // Retry
    }
}

/**
 * Sync pending charts
 */
async function syncCharts() {
    try {
        // Get pending charts from IndexedDB
        const pending = await getPendingCharts();

        // Send each to server
        for (const chart of pending) {
            const response = await fetch('/api/charts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getAuthToken()}`,
                },
                body: JSON.stringify(chart),
            });

            if (response.ok) {
                // Remove from pending
                await removePendingChart(chart.id);
            } else {
                throw new Error('Sync failed');
            }
        }

        console.log('Charts synced successfully');

    } catch (error) {
        console.error('Failed to sync charts:', error);
        throw error; // Retry
    }
}

// ============ PUSH NOTIFICATIONS ============

self.addEventListener('push', (event) => {
    console.log('Push notification received');

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Veda Jothidam';
    const options = {
        body: data.message,
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        data: data,
        tag: data.tag || 'notification',
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked');

    event.notification.close();

    // Handle different notification types
    const data = event.notification.data;

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // Try to find existing window
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise, open new window
            if (data.url) {
                return clients.openWindow(data.url);
            }
            return clients.openWindow('/');
        })
    );
});

// ============ MESSAGE HANDLING ============

self.addEventListener('message', (event) => {
    console.log('Message from client:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// ============ UTILITY FUNCTIONS ============

/**
 * Get auth token from storage
 */
async function getAuthToken() {
    // In a real app, get from IndexedDB or localStorage
    return localStorage.getItem('access_token') || '';
}

/**
 * Get pending consultations
 */
async function getPendingConsultations() {
    // Get from IndexedDB
    return [];
}

/**
 * Remove pending consultation
 */
async function removePendingConsultation(id) {
    // Remove from IndexedDB
}

/**
 * Get pending charts
 */
async function getPendingCharts() {
    // Get from IndexedDB
    return [];
}

/**
 * Remove pending chart
 */
async function removePendingChart(id) {
    // Remove from IndexedDB
}

console.log('Service Worker loaded');
