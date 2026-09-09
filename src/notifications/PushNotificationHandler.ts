// Push Notification Handler
// Manages device push notifications, permissions, and delivery

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface PushSubscription {
  endpoint: string;
  auth: string;
  p256dh: string;
}

/**
 * Push Notification Handler
 * Manages browser and mobile push notifications
 */
export class PushNotificationHandler {
  private serviceWorkerReady = false;
  private pushSubscription: PushSubscription | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize push notification system
   */
  private async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      this.serviceWorkerReady = true;
      console.log('Service Worker registered');

      // Listen for push messages
      if ('controller' in navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', (event: any) => {
          if (event.data && event.data.type === 'PUSH_RECEIVED') {
            console.log('Push notification received:', event.data);
          }
        });
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  /**
   * Request push notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return 'denied';
  }

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'Notification' in window &&
      'PushManager' in window
    );
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.serviceWorkerReady) {
      console.warn('Service Worker not ready');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      const subscribeOptions: PushSubscriptionOptionsInit = {
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey) as any,
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);

      // Extract subscription details
      const subData = subscription.toJSON() as any;
      this.pushSubscription = {
        endpoint: subscription.endpoint,
        auth: subData.keys.auth,
        p256dh: subData.keys.p256dh,
      };

      // Save subscription to server
      await this.savePushSubscription(this.pushSubscription);

      return this.pushSubscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        this.pushSubscription = null;

        // Notify server
        await this.removePushSubscription();

        return true;
      }

      return false;
    } catch (error) {
      console.error('Unsubscribe failed:', error);
      return false;
    }
  }

  /**
   * Send local push notification (Web API)
   */
  async sendLocalNotification(payload: PushNotificationPayload): Promise<Notification | null> {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    if (!this.serviceWorkerReady) {
      console.warn('Service Worker not ready');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // Show notification through Service Worker
      const notificationOptions: any = {
        body: payload.body,
        icon: payload.icon || '/icon-192.png',
        badge: payload.badge || '/badge-72.png',
        tag: payload.tag || 'kotravel-notification',
        requireInteraction: payload.requireInteraction || false,
        data: payload.data || {},
      };

      // Actions is not supported in all browsers
      if (payload.actions && 'actions' in Notification.prototype) {
        notificationOptions.actions = payload.actions;
      }

      await registration.showNotification(payload.title, notificationOptions);

      return null; // Notification shown through SW
    } catch (error) {
      console.error('Send notification failed:', error);
      return null;
    }
  }

  /**
   * Send server push notification
   */
  async sendServerPushNotification(
    payload: PushNotificationPayload,
    recipientId?: string
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: recipientId,
          notification: payload,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Server push failed:', error);
      return false;
    }
  }

  /**
   * Send batch push notifications
   */
  async sendBatchNotifications(
    recipients: string[],
    payload: PushNotificationPayload
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const recipientId of recipients) {
      results[recipientId] = await this.sendServerPushNotification(payload, recipientId);
    }

    return results;
  }

  /**
   * Check notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  /**
   * Enable notification sounds
   */
  playNotificationSound(): void {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  /**
   * Test notification delivery
   */
  async testNotification(): Promise<void> {
    const payload: PushNotificationPayload = {
      title: 'Kotravel Notification Test',
      body: 'This is a test notification from Kotravel',
      icon: '/icon-192.png',
      data: {
        timestamp: Date.now(),
        type: 'test',
      },
    };

    await this.sendLocalNotification(payload);
  }

  // ==================== PRIVATE METHODS ====================

  private async savePushSubscription(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Save subscription error:', error);
    }
  }

  private async removePushSubscription(): Promise<void> {
    try {
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Remove subscription error:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray as Uint8Array;
  }
}

/**
 * Predefined push notification templates
 */
export const PushTemplates = {
  transitAlert: (planet: string, sign: string): PushNotificationPayload => ({
    title: `${planet} Transit Alert`,
    body: `${planet} has entered ${sign}. This transit may affect your chart.`,
    icon: '/icons/transit.png',
    tag: `transit_${planet}`,
    data: { type: 'transit', planet, sign },
  }),

  dashaReminder: (lord: string, startDate: string): PushNotificationPayload => ({
    title: 'Dasha Period Starting',
    body: `${lord} Dasha begins on ${startDate}. Check your predictions.`,
    icon: '/icons/dasha.png',
    tag: `dasha_${lord}`,
    data: { type: 'dasha', lord, startDate },
  }),

  muhurtaAlert: (time: string, activity: string): PushNotificationPayload => ({
    title: 'Auspicious Time Alert',
    body: `${activity} is auspicious at ${time}. Don't miss this opportunity!`,
    icon: '/icons/muhurta.png',
    tag: 'muhurta_alert',
    data: { type: 'muhurta', time, activity },
    requireInteraction: true,
  }),

  systemUpdate: (version: string): PushNotificationPayload => ({
    title: 'Kotravel Updated',
    body: `Version ${version} is now available. Check new features!`,
    icon: '/icons/update.png',
    tag: 'system_update',
    data: { type: 'system', version },
  }),
};
