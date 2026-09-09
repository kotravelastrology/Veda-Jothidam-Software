'use client';

import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  maxVisible?: number;
}

/**
 * Notification Center Component
 * Displays real-time notifications with history and actions
 */
export function NotificationCenter({
  notifications = [],
  onMarkAsRead,
  onDismiss,
  maxVisible = 5,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setDisplayedNotifications(notifications.slice(0, maxVisible));
  }, [notifications, maxVisible]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-surface transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-surface rounded-lg shadow-lg border border-line z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-surface-soft border-b border-line px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-ink">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  notifications
                    .filter(n => !n.read)
                    .forEach(n => onMarkAsRead?.(n.id));
                }}
                className="text-sm text-saffron hover:text-saffron/80"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          {displayedNotifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-ink-soft">
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {displayedNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-l-4 ${getTypeStyles(notification.type)} cursor-pointer hover:bg-opacity-50 transition-all`}
                  onClick={() => !notification.read && onMarkAsRead?.(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <span className="text-lg mt-0.5">{getTypeIcon(notification.type)}</span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-saffron flex-shrink-0 mt-1"></div>
                        )}
                      </div>

                      <p className="text-sm text-ink-soft mb-2">{notification.message}</p>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-ink-soft">{formatTime(notification.timestamp)}</span>

                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-xs text-saffron hover:text-saffron/80 font-semibold"
                            onClick={e => e.stopPropagation()}
                          >
                            {notification.actionLabel || 'View'}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Dismiss Button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDismiss?.(notification.id);
                      }}
                      className="text-ink-soft hover:text-ink flex-shrink-0 mt-0.5"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {notifications.length > maxVisible && (
            <div className="sticky bottom-0 bg-surface-soft border-t border-line px-4 py-2 text-center">
              <button className="text-sm text-saffron hover:text-saffron/80 font-semibold">
                View all {notifications.length} notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Toast Notification Component
 * Displays temporary notifications at the top/bottom of screen
 */
export function ToastNotification({
  notification,
  onDismiss,
  duration = 5000,
}: {
  notification: Notification;
  onDismiss: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div
      className={`
        ${typeStyles[notification.type]}
        px-6 py-4 rounded-lg shadow-lg
        flex items-center justify-between gap-4
        animate-in fade-in slide-in-from-top-4 duration-300
      `}
    >
      <div className="flex-1">
        <p className="font-semibold">{notification.title}</p>
        <p className="text-sm opacity-90">{notification.message}</p>
      </div>

      <button
        onClick={onDismiss}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}
