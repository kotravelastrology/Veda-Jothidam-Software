// Notification History and Persistence Layer
// Manages notification storage, retrieval, and preferences

export interface StoredNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'transit' | 'dasha' | 'muhurta' | 'compatibility' | 'system';
  severity?: string;
  timestamp: number;
  read: boolean;
  archived: boolean;
  pinned: boolean;
  tags?: string[];
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  enabledTypes: string[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
  maxNotificationsPerDay: number;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  archivedCount: number;
  byType: Record<string, number>;
  lastRead: number;
}

/**
 * Notification History Manager
 * Handles storage, retrieval, and management of notification data
 */
export class NotificationHistory {
  private storageKey = 'kotravel_notifications';
  private preferencesKey = 'kotravel_notification_preferences';
  private notifications: StoredNotification[] = [];
  private preferences: NotificationPreferences;
  private maxStoredNotifications = 500;

  constructor() {
    this.preferences = this.loadPreferences();
    this.notifications = this.loadNotifications();
  }

  /**
   * Add notification to history
   */
  addNotification(notification: Omit<StoredNotification, 'read' | 'archived' | 'pinned'>): StoredNotification {
    const stored: StoredNotification = {
      ...notification,
      read: false,
      archived: false,
      pinned: false,
    };

    this.notifications.unshift(stored);

    // Trim old notifications if exceeding limit
    if (this.notifications.length > this.maxStoredNotifications) {
      this.notifications = this.notifications.slice(0, this.maxStoredNotifications);
    }

    this.saveNotifications();
    return stored;
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  /**
   * Mark multiple notifications as read
   */
  markMultipleAsRead(ids: string[]): void {
    ids.forEach(id => this.markAsRead(id));
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => (n.read = true));
    this.saveNotifications();
  }

  /**
   * Archive notification
   */
  archiveNotification(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.archived = true;
      this.saveNotifications();
    }
  }

  /**
   * Pin notification
   */
  pinNotification(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.pinned = true;
      this.saveNotifications();
    }
  }

  /**
   * Unpin notification
   */
  unpinNotification(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.pinned = false;
      this.saveNotifications();
    }
  }

  /**
   * Delete notification
   */
  deleteNotification(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
    }
  }

  /**
   * Get all notifications
   */
  getAll(includeArchived: boolean = false): StoredNotification[] {
    return this.notifications.filter(n => includeArchived || !n.archived);
  }

  /**
   * Get unread notifications
   */
  getUnread(): StoredNotification[] {
    return this.notifications.filter(n => !n.read && !n.archived);
  }

  /**
   * Get pinned notifications
   */
  getPinned(): StoredNotification[] {
    return this.notifications.filter(n => n.pinned && !n.archived);
  }

  /**
   * Get notifications by type
   */
  getByType(type: string): StoredNotification[] {
    return this.notifications.filter(n => n.type === type && !n.archived);
  }

  /**
   * Search notifications
   */
  search(query: string, fields: string[] = ['title', 'message']): StoredNotification[] {
    const lowerQuery = query.toLowerCase();
    return this.notifications.filter(n => {
      return fields.some(field => {
        const value = (n as any)[field];
        return typeof value === 'string' && value.toLowerCase().includes(lowerQuery);
      });
    });
  }

  /**
   * Get notifications within date range
   */
  getByDateRange(startTime: number, endTime: number): StoredNotification[] {
    return this.notifications.filter(n => n.timestamp >= startTime && n.timestamp <= endTime);
  }

  /**
   * Get notification statistics
   */
  getStats(): NotificationStats {
    const unread = this.notifications.filter(n => !n.read);
    const read = this.notifications.filter(n => n.read);
    const archived = this.notifications.filter(n => n.archived);
    const byType: Record<string, number> = {};

    this.notifications.forEach(n => {
      byType[n.type] = (byType[n.type] || 0) + 1;
    });

    return {
      totalNotifications: this.notifications.length,
      unreadCount: unread.length,
      readCount: read.length,
      archivedCount: archived.length,
      byType,
      lastRead: Math.max(...this.notifications.map(n => n.timestamp), 0),
    };
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = [];
    this.saveNotifications();
  }

  /**
   * Clear archived notifications
   */
  clearArchived(): void {
    this.notifications = this.notifications.filter(n => !n.archived);
    this.saveNotifications();
  }

  /**
   * Update preferences
   */
  setPreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.savePreferences();
  }

  /**
   * Get preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  /**
   * Check if type is enabled
   */
  isTypeEnabled(type: string): boolean {
    return this.preferences.enabledTypes.includes(type) || this.preferences.enabledTypes.includes('*');
  }

  /**
   * Check if in quiet hours
   */
  isInQuietHours(): boolean {
    if (!this.preferences.quietHoursStart || !this.preferences.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return currentTime >= this.preferences.quietHoursStart && currentTime < this.preferences.quietHoursEnd;
  }

  /**
   * Export notifications as JSON
   */
  exportAsJSON(): string {
    return JSON.stringify({
      notifications: this.notifications,
      preferences: this.preferences,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Import notifications from JSON
   */
  importFromJSON(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.notifications && Array.isArray(data.notifications)) {
        this.notifications = data.notifications;
        if (data.preferences) {
          this.preferences = { ...this.preferences, ...data.preferences };
        }
        this.saveNotifications();
        this.savePreferences();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  // ==================== PRIVATE METHODS ====================

  private saveNotifications(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  private loadNotifications(): StoredNotification[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load notifications:', error);
      return [];
    }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.preferencesKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  private loadPreferences(): NotificationPreferences {
    try {
      const data = localStorage.getItem(this.preferencesKey);
      return data
        ? JSON.parse(data)
        : {
            emailNotifications: true,
            pushNotifications: true,
            soundEnabled: true,
            enabledTypes: ['*'],
            maxNotificationsPerDay: 100,
          };
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return {
        emailNotifications: true,
        pushNotifications: true,
        soundEnabled: true,
        enabledTypes: ['*'],
        maxNotificationsPerDay: 100,
      };
    }
  }
}
