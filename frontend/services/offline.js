/**
 * Offline Support Module
 *
 * Handles offline data sync, queue management, and offline detection
 */

class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.queue = new Map();
        this.listeners = new Set();
        this.dbName = 'veda-offline-db';
        this.db = null;
    }

    /**
     * Initialize offline manager
     */
    async init() {
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        // Initialize IndexedDB
        await this.initDB();

        console.log('Offline manager initialized');
    }

    /**
     * Initialize IndexedDB
     */
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => {
                console.error('Failed to open IndexedDB');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                if (!db.objectStoreNames.contains('pending-requests')) {
                    db.createObjectStore('pending-requests', { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains('cached-data')) {
                    db.createObjectStore('cached-data', { keyPath: 'key' });
                }
            };
        });
    }

    /**
     * Handle coming online
     */
    handleOnline() {
        this.isOnline = true;
        console.log('Back online');
        this.emit('online');
        this.syncQueue();
    }

    /**
     * Handle going offline
     */
    handleOffline() {
        this.isOnline = false;
        console.log('Went offline');
        this.emit('offline');
    }

    /**
     * Queue request for later sync
     */
    async queueRequest(method, url, data = null, options = {}) {
        if (!this.db) {
            console.warn('IndexedDB not initialized');
            return null;
        }

        const id = this.generateId();
        const request = {
            id,
            method,
            url,
            data,
            options,
            timestamp: Date.now(),
            retries: 0,
            maxRetries: 3,
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['pending-requests'], 'readwrite');
            const store = transaction.objectStore('pending-requests');
            const dbRequest = store.add(request);

            dbRequest.onsuccess = () => {
                console.log('Request queued:', id);
                this.queue.set(id, request);
                resolve(id);
            };

            dbRequest.onerror = () => {
                reject(dbRequest.error);
            };
        });
    }

    /**
     * Sync queued requests
     */
    async syncQueue() {
        if (!this.isOnline || !this.db) {
            return;
        }

        console.log('Syncing offline queue...');

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['pending-requests'], 'readonly');
            const store = transaction.objectStore('pending-requests');
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = async () => {
                const requests = getAllRequest.result;
                let synced = 0;
                let failed = 0;

                for (const req of requests) {
                    try {
                        const response = await fetch(req.url, {
                            method: req.method,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.getAuthToken()}`,
                            },
                            body: req.data ? JSON.stringify(req.data) : null,
                        });

                        if (response.ok) {
                            // Remove from queue
                            await this.removeQueuedRequest(req.id);
                            synced++;
                            console.log('Synced:', req.id);
                        } else {
                            failed++;
                            // Increment retry count
                            if (req.retries < req.maxRetries) {
                                req.retries++;
                                await this.updateQueuedRequest(req);
                            } else {
                                // Max retries reached
                                await this.removeQueuedRequest(req.id);
                                this.emit('sync-error', {
                                    id: req.id,
                                    error: 'Max retries reached',
                                });
                            }
                        }
                    } catch (error) {
                        console.error('Error syncing request:', error);
                        failed++;
                    }
                }

                console.log(`Sync complete: ${synced} synced, ${failed} failed`);
                this.emit('sync-complete', { synced, failed });
                resolve({ synced, failed });
            };

            getAllRequest.onerror = () => {
                reject(getAllRequest.error);
            };
        });
    }

    /**
     * Remove queued request
     */
    async removeQueuedRequest(id) {
        if (!this.db) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['pending-requests'], 'readwrite');
            const store = transaction.objectStore('pending-requests');
            const request = store.delete(id);

            request.onsuccess = () => {
                this.queue.delete(id);
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Update queued request
     */
    async updateQueuedRequest(req) {
        if (!this.db) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['pending-requests'], 'readwrite');
            const store = transaction.objectStore('pending-requests');
            const request = store.put(req);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Cache data
     */
    async cacheData(key, data, ttl = null) {
        if (!this.db) return;

        const cacheEntry = {
            key,
            data,
            timestamp: Date.now(),
            ttl,
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cached-data'], 'readwrite');
            const store = transaction.objectStore('cached-data');
            const request = store.put(cacheEntry);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Get cached data
     */
    async getCachedData(key) {
        if (!this.db) return null;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cached-data'], 'readonly');
            const store = transaction.objectStore('cached-data');
            const request = store.get(key);

            request.onsuccess = () => {
                const entry = request.result;

                if (!entry) {
                    resolve(null);
                    return;
                }

                // Check TTL
                if (entry.ttl) {
                    const age = Date.now() - entry.timestamp;
                    if (age > entry.ttl) {
                        // Expired
                        resolve(null);
                        return;
                    }
                }

                resolve(entry.data);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Get queued requests
     */
    async getQueuedRequests() {
        if (!this.db) return [];

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['pending-requests'], 'readonly');
            const store = transaction.objectStore('pending-requests');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Get offline status
     */
    getStatus() {
        return {
            isOnline: this.isOnline,
            queueSize: this.queue.size,
            dbReady: this.db !== null,
        };
    }

    /**
     * Subscribe to offline events
     */
    subscribe(listener) {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Emit event
     */
    emit(event, data = null) {
        this.listeners.forEach(listener => {
            try {
                listener({ event, data });
            } catch (error) {
                console.error('Error in offline listener:', error);
            }
        });
    }

    /**
     * Get auth token
     */
    getAuthToken() {
        return localStorage.getItem('access_token') || '';
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Create singleton instance
const offlineManager = new OfflineManager();

// Initialize on load
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            offlineManager.init();
        });
    } else {
        offlineManager.init();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = offlineManager;
}
