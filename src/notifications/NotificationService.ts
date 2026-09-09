// Notification Service
// Handles event streaming, subscriptions, and real-time delivery

import { WebSocketManager } from './WebSocketManager';

export interface NotificationEvent {
  id: string;
  type: 'transit' | 'dasha' | 'muhurta' | 'compatibility' | 'system' | 'alert';
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  data?: Record<string, any>;
  timestamp: number;
  targetUser?: string;
}

export interface NotificationSubscription {
  eventType: string;
  handler: (event: NotificationEvent) => void;
  filters?: Record<string, any>;
}

export interface EventStream {
  name: string;
  active: boolean;
  events: NotificationEvent[];
  subscriberCount: number;
}

/**
 * Notification Service
 * Manages real-time event streaming and notification delivery
 */
export class NotificationService {
  private wsManager: WebSocketManager | null = null;
  private subscriptions: Map<string, NotificationSubscription[]> = new Map();
  private eventStreams: Map<string, EventStream> = new Map();
  private eventBuffer: NotificationEvent[] = [];
  private bufferSize: number = 100;

  constructor(wsUrl?: string) {
    if (wsUrl) {
      this.wsManager = new WebSocketManager({
        url: wsUrl,
        autoReconnect: true,
        reconnectInterval: 3000,
        maxReconnectAttempts: 10,
        heartbeatInterval: 30000,
        messageQueueLimit: 500,
      });

      this.setupWebSocketHandlers();
    }
  }

  /**
   * Connect to notification server
   */
  async connect(): Promise<void> {
    if (this.wsManager) {
      await this.wsManager.connect();
      console.log('Notification service connected');
    }
  }

  /**
   * Subscribe to notification events
   */
  subscribe(
    eventType: string,
    handler: (event: NotificationEvent) => void,
    filters?: Record<string, any>
  ): () => void {
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    const subscription: NotificationSubscription = {
      eventType,
      handler,
      filters,
    };

    this.subscriptions.get(eventType)!.push(subscription);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(eventType);
      if (subs) {
        const index = subs.indexOf(subscription);
        if (index > -1) {
          subs.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit notification event
   */
  emit(event: NotificationEvent): void {
    // Add to buffer
    this.bufferEvent(event);

    // Get subscribers for event type
    const subscribers = this.subscriptions.get(event.type) || [];
    const wildcardSubscribers = this.subscriptions.get('*') || [];

    // Call all matching subscribers
    [...subscribers, ...wildcardSubscribers].forEach(sub => {
      if (!sub.filters || this.matchesFilters(event, sub.filters)) {
        try {
          sub.handler(event);
        } catch (error) {
          console.error('Subscription handler error:', error);
        }
      }
    });

    // Send via WebSocket if connected
    if (this.wsManager?.isConnected()) {
      this.wsManager.send({
        type: 'notification',
        payload: event,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Create event stream for batch notifications
   */
  createEventStream(name: string): EventStream {
    const stream: EventStream = {
      name,
      active: true,
      events: [],
      subscriberCount: 0,
    };

    this.eventStreams.set(name, stream);
    return stream;
  }

  /**
   * Add event to stream
   */
  addToStream(streamName: string, event: NotificationEvent): void {
    const stream = this.eventStreams.get(streamName);
    if (stream) {
      stream.events.push(event);
      this.emit(event);
    }
  }

  /**
   * Get stream events
   */
  getStreamEvents(streamName: string): NotificationEvent[] {
    const stream = this.eventStreams.get(streamName);
    return stream ? [...stream.events] : [];
  }

  /**
   * Close event stream
   */
  closeStream(streamName: string): void {
    const stream = this.eventStreams.get(streamName);
    if (stream) {
      stream.active = false;
      this.eventStreams.delete(streamName);
    }
  }

  /**
   * Get event history
   */
  getEventHistory(limit: number = 50): NotificationEvent[] {
    return this.eventBuffer.slice(-limit);
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventBuffer = [];
  }

  /**
   * Get subscription count for event type
   */
  getSubscriberCount(eventType: string): number {
    const subs = this.subscriptions.get(eventType);
    return subs ? subs.length : 0;
  }

  /**
   * Disconnect from notification server
   */
  disconnect(): void {
    if (this.wsManager) {
      this.wsManager.disconnect();
    }
    this.subscriptions.clear();
    this.eventStreams.clear();
  }

  // ==================== PRIVATE METHODS ====================

  private setupWebSocketHandlers(): void {
    if (!this.wsManager) return;

    this.wsManager.on('notification', (event: NotificationEvent) => {
      this.emit(event);
    });

    this.wsManager.on('transit_alert', (data: any) => {
      this.emit({
        id: `transit_${Date.now()}`,
        type: 'transit',
        title: 'Transit Alert',
        message: data.message,
        severity: 'info',
        data,
        timestamp: Date.now(),
      });
    });

    this.wsManager.on('dasha_period_change', (data: any) => {
      this.emit({
        id: `dasha_${Date.now()}`,
        type: 'dasha',
        title: 'Dasha Period Change',
        message: `Entering ${data.lord} Dasha`,
        severity: 'info',
        data,
        timestamp: Date.now(),
      });
    });

    this.wsManager.on('muhurta_alert', (data: any) => {
      this.emit({
        id: `muhurta_${Date.now()}`,
        type: 'muhurta',
        title: 'Auspicious Time Alert',
        message: data.message,
        severity: 'success',
        data,
        timestamp: Date.now(),
      });
    });

    this.wsManager.on('system', (data: any) => {
      this.emit({
        id: `system_${Date.now()}`,
        type: 'system',
        title: 'System Notification',
        message: data.message,
        severity: 'info',
        data,
        timestamp: Date.now(),
      });
    });
  }

  private bufferEvent(event: NotificationEvent): void {
    this.eventBuffer.push(event);

    // Keep buffer size limited
    if (this.eventBuffer.length > this.bufferSize) {
      this.eventBuffer.shift();
    }
  }

  private matchesFilters(event: NotificationEvent, filters: Record<string, any>): boolean {
    return Object.entries(filters).every(([key, value]) => {
      if (key === 'types' && Array.isArray(value)) {
        return value.includes(event.type);
      }
      if (key === 'severities' && Array.isArray(value)) {
        return value.includes(event.severity);
      }
      if (key in event) {
        return (event as any)[key] === value;
      }
      if (key in (event.data || {})) {
        return event.data![key] === value;
      }
      return true;
    });
  }
}

/**
 * Predefined event templates for common notifications
 */
export const NotificationTemplates = {
  transitAlert: (planet: string, sign: string, effect: string): NotificationEvent => ({
    id: `transit_${Date.now()}`,
    type: 'transit',
    title: `${planet} Transit`,
    message: `${planet} has entered ${sign}. ${effect}`,
    severity: 'info',
    timestamp: Date.now(),
    data: { planet, sign, effect },
  }),

  dashaChange: (lord: string, startDate: string, endDate: string): NotificationEvent => ({
    id: `dasha_${Date.now()}`,
    type: 'dasha',
    title: 'Dasha Period Started',
    message: `${lord} Dasha begins (${startDate} - ${endDate})`,
    severity: 'info',
    timestamp: Date.now(),
    data: { lord, startDate, endDate },
  }),

  muhurtaReminder: (muhurta: string, time: string): NotificationEvent => ({
    id: `muhurta_${Date.now()}`,
    type: 'muhurta',
    title: 'Auspicious Time Reminder',
    message: `${muhurta} at ${time} is approaching`,
    severity: 'success',
    timestamp: Date.now(),
    data: { muhurta, time },
  }),

  compatibilityScore: (score: number, message: string): NotificationEvent => ({
    id: `compat_${Date.now()}`,
    type: 'compatibility',
    title: 'Compatibility Analysis',
    message: `Guna Score: ${score}/36. ${message}`,
    severity: 'info',
    timestamp: Date.now(),
    data: { score, message },
  }),

  systemAlert: (message: string): NotificationEvent => ({
    id: `system_${Date.now()}`,
    type: 'system',
    title: 'System Alert',
    message,
    severity: 'warning',
    timestamp: Date.now(),
  }),

  error: (message: string, errorCode?: string): NotificationEvent => ({
    id: `error_${Date.now()}`,
    type: 'system',
    title: 'Error',
    message,
    severity: 'error',
    timestamp: Date.now(),
    data: { errorCode },
  }),
};
