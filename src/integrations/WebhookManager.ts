// Webhook Manager
// Manages outbound webhook subscriptions and delivery

export type WebhookEvent =
  | 'chart.created' | 'chart.updated' | 'chart.deleted'
  | 'report.generated' | 'report.exported'
  | 'subscription.upgraded' | 'subscription.cancelled'
  | 'team.member_added' | 'team.member_removed'
  | 'user.created' | 'user.login';

export interface WebhookSubscription {
  id: string;
  teamId: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  lastDeliveryAt?: number;
  failureCount: number;
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  event: WebhookEvent;
  payload: Record<string, any>;
  status: 'pending' | 'success' | 'failed';
  statusCode?: number;
  attempts: number;
  createdAt: number;
  deliveredAt?: number;
  nextRetryAt?: number;
}

/**
 * Webhook Manager
 * Manages webhook subscriptions and reliable event delivery
 */
export class WebhookManager {
  private subscriptions: Map<string, WebhookSubscription> = new Map();
  private deliveries: WebhookDelivery[] = [];
  private storageKey = 'kotravel_webhooks';
  private deliveriesKey = 'kotravel_webhook_deliveries';
  private maxRetries = 5;
  private maxDeliveryHistory = 1000;

  constructor() {
    this.loadSubscriptions();
    this.loadDeliveries();
  }

  /**
   * Create webhook subscription
   */
  createSubscription(data: Omit<WebhookSubscription, 'id' | 'secret' | 'createdAt' | 'updatedAt' | 'failureCount'>): WebhookSubscription {
    const subscription: WebhookSubscription = {
      ...data,
      id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      secret: this.generateSecret(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      failureCount: 0,
    };

    this.subscriptions.set(subscription.id, subscription);
    this.persistSubscriptions();
    return subscription;
  }

  /**
   * Get subscription
   */
  getSubscription(id: string): WebhookSubscription | null {
    return this.subscriptions.get(id) || null;
  }

  /**
   * Get team subscriptions
   */
  getTeamSubscriptions(teamId: string): WebhookSubscription[] {
    return Array.from(this.subscriptions.values()).filter(s => s.teamId === teamId);
  }

  /**
   * Update subscription
   */
  updateSubscription(id: string, updates: Partial<WebhookSubscription>): WebhookSubscription | null {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return null;

    Object.assign(subscription, updates);
    subscription.updatedAt = Date.now();
    this.persistSubscriptions();
    return subscription;
  }

  /**
   * Delete subscription
   */
  deleteSubscription(id: string): boolean {
    const deleted = this.subscriptions.delete(id);
    if (deleted) {
      this.persistSubscriptions();
    }
    return deleted;
  }

  /**
   * Trigger webhook event
   */
  async triggerEvent(event: WebhookEvent, payload: Record<string, any>, teamId: string): Promise<void> {
    const relevantSubs = Array.from(this.subscriptions.values()).filter(
      s => s.teamId === teamId && s.isActive && s.events.includes(event)
    );

    for (const subscription of relevantSubs) {
      await this.deliverWebhook(subscription, event, payload);
    }
  }

  /**
   * Deliver webhook with retry logic
   */
  private async deliverWebhook(
    subscription: WebhookSubscription,
    event: WebhookEvent,
    payload: Record<string, any>
  ): Promise<WebhookDelivery> {
    const delivery: WebhookDelivery = {
      id: `delivery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subscriptionId: subscription.id,
      event,
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: Date.now(),
    };

    try {
      const signature = this.signPayload(payload, subscription.secret);
      const response = await fetch(subscription.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event,
        },
        body: JSON.stringify({ event, payload, timestamp: Date.now() }),
      });

      delivery.attempts = 1;
      delivery.statusCode = response.status;
      delivery.status = response.ok ? 'success' : 'failed';
      delivery.deliveredAt = Date.now();

      subscription.lastDeliveryAt = Date.now();
      if (!response.ok) {
        subscription.failureCount++;
        delivery.nextRetryAt = Date.now() + this.getRetryDelay(1);
      } else {
        subscription.failureCount = 0;
      }
    } catch (error) {
      delivery.status = 'failed';
      delivery.attempts = 1;
      delivery.nextRetryAt = Date.now() + this.getRetryDelay(1);
      subscription.failureCount++;
    }

    this.deliveries.push(delivery);
    if (this.deliveries.length > this.maxDeliveryHistory) {
      this.deliveries = this.deliveries.slice(-this.maxDeliveryHistory);
    }

    this.persistSubscriptions();
    this.persistDeliveries();
    return delivery;
  }

  /**
   * Retry failed deliveries
   */
  async retryFailedDeliveries(): Promise<number> {
    const now = Date.now();
    const toRetry = this.deliveries.filter(
      d => d.status === 'failed' && d.attempts < this.maxRetries && d.nextRetryAt && d.nextRetryAt <= now
    );

    let retried = 0;
    for (const delivery of toRetry) {
      const subscription = this.subscriptions.get(delivery.subscriptionId);
      if (subscription) {
        await this.deliverWebhook(subscription, delivery.event, delivery.payload);
        retried++;
      }
    }
    return retried;
  }

  /**
   * Get delivery history for subscription
   */
  getDeliveryHistory(subscriptionId: string, limit: number = 50): WebhookDelivery[] {
    return this.deliveries
      .filter(d => d.subscriptionId === subscriptionId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get delivery success rate
   */
  getSuccessRate(subscriptionId: string): number {
    const deliveries = this.deliveries.filter(d => d.subscriptionId === subscriptionId);
    if (deliveries.length === 0) return 100;

    const successful = deliveries.filter(d => d.status === 'success').length;
    return (successful / deliveries.length) * 100;
  }

  /**
   * Auto-disable subscriptions with high failure rate
   */
  autoDisableFailingSubscriptions(threshold: number = 10): string[] {
    const disabled: string[] = [];

    this.subscriptions.forEach(sub => {
      if (sub.failureCount >= threshold && sub.isActive) {
        sub.isActive = false;
        disabled.push(sub.id);
      }
    });

    if (disabled.length > 0) {
      this.persistSubscriptions();
    }
    return disabled;
  }

  /**
   * Verify webhook signature (for incoming validation)
   */
  verifySignature(payload: Record<string, any>, signature: string, secret: string): boolean {
    return this.signPayload(payload, secret) === signature;
  }

  // ==================== PRIVATE METHODS ====================

  private generateSecret(): string {
    return `whsec_${Math.random().toString(36).substr(2, 32)}`;
  }

  private signPayload(payload: Record<string, any>, secret: string): string {
    const str = JSON.stringify(payload) + secret;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private getRetryDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 3600000); // exponential backoff, max 1hr
  }

  private persistSubscriptions(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.subscriptions.values())));
    } catch (e) {
      console.warn('Webhook subscriptions persistence failed');
    }
  }

  private loadSubscriptions(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const subs = JSON.parse(data) as WebhookSubscription[];
        subs.forEach(sub => this.subscriptions.set(sub.id, sub));
      }
    } catch (e) {
      console.warn('Webhook subscriptions load failed');
    }
  }

  private persistDeliveries(): void {
    try {
      localStorage.setItem(this.deliveriesKey, JSON.stringify(this.deliveries.slice(-500)));
    } catch (e) {
      console.warn('Webhook deliveries persistence failed');
    }
  }

  private loadDeliveries(): void {
    try {
      const data = localStorage.getItem(this.deliveriesKey);
      if (data) {
        this.deliveries = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Webhook deliveries load failed');
    }
  }
}

let webhookManager: WebhookManager | null = null;

export function getWebhookManager(): WebhookManager {
  if (!webhookManager) {
    webhookManager = new WebhookManager();
  }
  return webhookManager;
}
