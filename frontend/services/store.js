/**
 * Simple State Management Store
 *
 * Provides:
 * - Centralized state management
 * - Subscriber/observer pattern
 * - State persistence to localStorage
 * - State mutations via actions
 */

class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.subscribers = new Set();
        this.listeners = new Map();
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.defaultCacheTTL = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Get current state
     */
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    /**
     * Get specific state slice
     */
    get(path) {
        return this._getNestedValue(this.state, path);
    }

    /**
     * Set state (triggers subscribers)
     */
    setState(path, value) {
        const oldValue = this._getNestedValue(this.state, path);

        if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
            this._setNestedValue(this.state, path, value);
            this._notifySubscribers(path, value, oldValue);
        }
    }

    /**
     * Update state with merge
     */
    updateState(path, updates) {
        const current = this._getNestedValue(this.state, path) || {};
        const merged = { ...current, ...updates };
        this.setState(path, merged);
    }

    /**
     * Subscribe to state changes
     */
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, new Set());
        }
        this.listeners.get(path).add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.get(path).delete(callback);
        };
    }

    /**
     * Subscribe to any state change
     */
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    /**
     * Cache data with TTL
     */
    setCache(key, value, ttl = this.defaultCacheTTL) {
        this.cache.set(key, value);

        if (this.cacheExpiry.has(key)) {
            clearTimeout(this.cacheExpiry.get(key));
        }

        const timeout = setTimeout(() => {
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
        }, ttl);

        this.cacheExpiry.set(key, timeout);
    }

    /**
     * Get cached data
     */
    getCache(key) {
        return this.cache.get(key);
    }

    /**
     * Clear cache
     */
    clearCache(key = null) {
        if (key) {
            this.cache.delete(key);
            if (this.cacheExpiry.has(key)) {
                clearTimeout(this.cacheExpiry.get(key));
                this.cacheExpiry.delete(key);
            }
        } else {
            this.cache.clear();
            this.cacheExpiry.forEach(timeout => clearTimeout(timeout));
            this.cacheExpiry.clear();
        }
    }

    /**
     * Reset to initial state
     */
    reset() {
        this.state = {};
        this.cache.clear();
        this.cacheExpiry.forEach(timeout => clearTimeout(timeout));
        this.cacheExpiry.clear();
        this._notifySubscribers('*', this.state, {});
    }

    /**
     * Persist state to localStorage
     */
    persistToStorage(key) {
        localStorage.setItem(`store_${key}`, JSON.stringify(this.state));
    }

    /**
     * Load state from localStorage
     */
    loadFromStorage(key) {
        const stored = localStorage.getItem(`store_${key}`);
        if (stored) {
            this.state = JSON.parse(stored);
        }
    }

    /**
     * Helper: Get nested value from object
     */
    _getNestedValue(obj, path) {
        if (!path) return obj;

        return path.split('.').reduce((current, part) => {
            return current?.[part];
        }, obj);
    }

    /**
     * Helper: Set nested value in object
     */
    _setNestedValue(obj, path, value) {
        if (!path) {
            Object.assign(obj, value);
            return;
        }

        const parts = path.split('.');
        const last = parts.pop();
        let current = obj;

        parts.forEach(part => {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        });

        current[last] = value;
    }

    /**
     * Helper: Notify subscribers
     */
    _notifySubscribers(path, newValue, oldValue) {
        // Notify path-specific listeners
        if (path !== '*' && this.listeners.has(path)) {
            this.listeners.get(path).forEach(callback => {
                callback(newValue, oldValue);
            });
        }

        // Notify global subscribers
        this.subscribers.forEach(callback => {
            callback({ path, newValue, oldValue });
        });
    }
}

// Create global app store
const appStore = new Store({
    // Authentication state
    auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
    },

    // Chart state
    charts: {
        list: [],
        current: null,
        loading: false,
        error: null,
        pagination: {
            page: 1,
            perPage: 10,
            total: 0,
        },
    },

    // Consultation state
    consultations: {
        list: [],
        current: null,
        loading: false,
        error: null,
        booking: {
            isOpen: false,
            loading: false,
            error: null,
        },
    },

    // Astrologer state
    astrologers: {
        list: [],
        loading: false,
        error: null,
    },

    // Dashboard state
    dashboard: {
        overview: null,
        activity: [],
        stats: null,
        recommendations: [],
        loading: false,
        error: null,
    },

    // UI state
    ui: {
        theme: localStorage.getItem('theme') || 'light',
        language: localStorage.getItem('language') || 'en',
        notifications: [],
        loading: false,
        modal: {
            isOpen: false,
            type: null,
            data: null,
        },
    },

    // Interpretation state
    interpretations: {
        results: null,
        loading: false,
        error: null,
    },
});

/**
 * Helper: Add notification
 */
function addNotification(message, type = 'info', duration = 5000) {
    const notification = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        type,
        timestamp: Date.now(),
    };

    const notifications = appStore.get('ui.notifications') || [];
    appStore.setState('ui.notifications', [...notifications, notification]);

    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification.id);
        }, duration);
    }

    return notification.id;
}

/**
 * Helper: Remove notification
 */
function removeNotification(id) {
    const notifications = appStore.get('ui.notifications') || [];
    appStore.setState('ui.notifications', notifications.filter(n => n.id !== id));
}

/**
 * Helper: Show success notification
 */
function showSuccess(message) {
    return addNotification(message, 'success');
}

/**
 * Helper: Show error notification
 */
function showError(message) {
    return addNotification(message, 'error', 7000);
}

/**
 * Helper: Show info notification
 */
function showInfo(message) {
    return addNotification(message, 'info');
}

/**
 * Helper: Show warning notification
 */
function showWarning(message) {
    return addNotification(message, 'warning', 7000);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Store,
        appStore,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
    };
}
