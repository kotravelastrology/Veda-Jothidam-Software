/**
 * Notifications Service
 *
 * Centralized notification management:
 * - Toast notifications
 * - Push notifications
 * - In-app notifications
 * - Notification persistence
 */

class NotificationService {
    constructor() {
        this.notifications = [];
        this.listeners = new Set();
        this.maxNotifications = 5;
        this.defaultDuration = 4000; // ms
        this.swRegistration = null;
    }

    /**
     * Initialize service worker for push notifications
     */
    async init() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
            return;
        }

        try {
            this.swRegistration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registered');

            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                await Notification.requestPermission();
            }
        } catch (error) {
            console.error('Failed to register Service Worker:', error);
        }
    }

    /**
     * Show toast notification (in-app)
     */
    toast(message, type = 'info', duration = null) {
        const notification = {
            id: this.generateId(),
            message,
            type, // 'info', 'success', 'warning', 'error'
            duration: duration !== null ? duration : this.defaultDuration,
            timestamp: Date.now(),
            display: 'toast',
        };

        this.add(notification);
        return notification.id;
    }

    /**
     * Show success notification
     */
    success(message, duration = null) {
        return this.toast(message, 'success', duration || 3000);
    }

    /**
     * Show error notification
     */
    error(message, duration = null) {
        return this.toast(message, 'error', duration || 5000);
    }

    /**
     * Show warning notification
     */
    warning(message, duration = null) {
        return this.toast(message, 'warning', duration || 4000);
    }

    /**
     * Show info notification
     */
    info(message, duration = null) {
        return this.toast(message, 'info', duration || 4000);
    }

    /**
     * Send push notification
     */
    async pushNotification(title, options = {}) {
        if (!('Notification' in window)) {
            console.warn('Notifications not supported');
            return;
        }

        if (Notification.permission !== 'granted') {
            console.warn('Notification permission not granted');
            return;
        }

        try {
            if (this.swRegistration) {
                // Send via Service Worker
                await this.swRegistration.showNotification(title, {
                    icon: '/images/icon-192x192.png',
                    badge: '/images/badge-72x72.png',
                    ...options,
                });
            } else {
                // Fallback to native notification
                new Notification(title, options);
            }
        } catch (error) {
            console.error('Failed to show push notification:', error);
        }
    }

    /**
     * Request notification permission
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            return false;
        }
    }

    /**
     * Subscribe to notifications
     */
    subscribe(listener) {
        this.listeners.add(listener);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Add notification
     */
    add(notification) {
        // Limit concurrent notifications
        if (this.notifications.length >= this.maxNotifications) {
            this.remove(this.notifications[0].id);
        }

        this.notifications.push(notification);
        this.notifyListeners();

        // Auto-dismiss
        if (notification.duration > 0) {
            setTimeout(() => {
                this.remove(notification.id);
            }, notification.duration);
        }
    }

    /**
     * Remove notification
     */
    remove(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            this.notifications.splice(index, 1);
            this.notifyListeners();
        }
    }

    /**
     * Clear all notifications
     */
    clear() {
        this.notifications = [];
        this.notifyListeners();
    }

    /**
     * Get all notifications
     */
    getAll() {
        return [...this.notifications];
    }

    /**
     * Notify all listeners
     */
    notifyListeners() {
        const state = {
            notifications: this.getAll(),
            count: this.notifications.length,
        };

        this.listeners.forEach(listener => {
            try {
                listener(state);
            } catch (error) {
                console.error('Error in notification listener:', error);
            }
        });
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Create singleton instance
const notificationService = new NotificationService();

// Auto-initialize on load
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            notificationService.init();
        });
    } else {
        notificationService.init();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = notificationService;
}
