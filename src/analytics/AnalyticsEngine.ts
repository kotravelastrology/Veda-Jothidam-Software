// Analytics Engine
// Core analytics tracking, aggregation, and storage system

export interface AnalyticsEvent {
  id: string;
  eventType: 'page_view' | 'feature_usage' | 'chart_generated' | 'report_exported' | 'search' | 'error' | 'performance';
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface EventAggregate {
  eventType: string;
  category: string;
  action: string;
  count: number;
  lastOccurred: number;
  avgValue?: number;
  minValue?: number;
  maxValue?: number;
}

export interface SessionMetrics {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  eventCount: number;
  pageViews: number;
  featureUsage: Record<string, number>;
  chartsGenerated: number;
  reportsExported: number;
  errors: number;
  performanceMetrics: {
    avgPageLoadTime: number;
    avgChartRenderTime: number;
    avgReportGenTime: number;
  };
}

export interface DailyMetrics {
  date: string;
  activeUsers: number;
  totalSessions: number;
  totalEvents: number;
  topFeatures: Array<{ feature: string; count: number }>;
  chartUsage: number;
  reportUsage: number;
  avgSessionDuration: number;
  errorRate: number;
}

/**
 * Analytics Engine
 * Tracks, aggregates, and analyzes user behavior and system performance
 */
export class AnalyticsEngine {
  private events: AnalyticsEvent[] = [];
  private sessions: Map<string, SessionMetrics> = new Map();
  private aggregates: Map<string, EventAggregate> = new Map();
  private currentSessionId: string;
  private currentUserId?: string;
  private storageKey = 'kotravel_analytics_events';
  private sessionStorageKey = 'kotravel_analytics_session';
  private maxStoredEvents = 10000;

  constructor(userId?: string) {
    this.currentUserId = userId;
    this.currentSessionId = this.generateSessionId();
    this.initializeSession();
    this.loadEvents();
  }

  /**
   * Track analytics event
   */
  trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId' | 'userId'>): void {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: this.currentSessionId,
      userId: this.currentUserId,
    };

    this.events.push(analyticsEvent);
    this.updateAggregate(analyticsEvent);
    this.updateSession(analyticsEvent);

    // Trim old events if exceeding limit
    if (this.events.length > this.maxStoredEvents) {
      this.events = this.events.slice(-this.maxStoredEvents);
    }

    this.saveEvents();
  }

  /**
   * Track page view
   */
  trackPageView(page: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      eventType: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: page,
      metadata,
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      eventType: 'feature_usage',
      category: 'features',
      action: feature,
      metadata,
    });
  }

  /**
   * Track chart generation
   */
  trackChartGeneration(chartType: string, renderTime: number): void {
    this.trackEvent({
      eventType: 'chart_generated',
      category: 'charts',
      action: 'generate',
      label: chartType,
      value: renderTime,
    });
  }

  /**
   * Track report export
   */
  trackReportExport(reportType: string, format: string): void {
    this.trackEvent({
      eventType: 'report_exported',
      category: 'reports',
      action: 'export',
      label: `${reportType}_${format}`,
    });
  }

  /**
   * Track search event
   */
  trackSearch(query: string, resultCount: number): void {
    this.trackEvent({
      eventType: 'search',
      category: 'search',
      action: 'search',
      label: query,
      value: resultCount,
    });
  }

  /**
   * Track error
   */
  trackError(errorType: string, message: string, stack?: string): void {
    this.trackEvent({
      eventType: 'error',
      category: 'errors',
      action: errorType,
      label: message,
      metadata: { stack },
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metricName: string, duration: number): void {
    this.trackEvent({
      eventType: 'performance',
      category: 'performance',
      action: metricName,
      value: duration,
    });
  }

  /**
   * Get session metrics
   */
  getSessionMetrics(sessionId?: string): SessionMetrics | null {
    const id = sessionId || this.currentSessionId;
    return this.sessions.get(id) || null;
  }

  /**
   * Get all aggregates
   */
  getAggregates(): EventAggregate[] {
    return Array.from(this.aggregates.values());
  }

  /**
   * Get daily metrics
   */
  getDailyMetrics(date?: string): DailyMetrics {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const dayStart = new Date(targetDate).getTime();
    const dayEnd = dayStart + 86400000;

    const dayEvents = this.events.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd);
    const uniqueUsers = new Set(dayEvents.map(e => e.userId).filter(Boolean)).size;
    const uniqueSessions = new Set(dayEvents.map(e => e.sessionId)).size;

    const featureUsage = dayEvents.filter(e => e.eventType === 'feature_usage');
    const topFeatures = this.getTopFeatures(featureUsage, 5);

    const chartEvents = dayEvents.filter(e => e.eventType === 'chart_generated').length;
    const reportEvents = dayEvents.filter(e => e.eventType === 'report_exported').length;
    const errorEvents = dayEvents.filter(e => e.eventType === 'error').length;

    const sessionDurations = Array.from(this.sessions.values())
      .filter(s => {
        const sStart = s.startTime;
        return sStart >= dayStart && sStart < dayEnd;
      })
      .map(s => s.duration || 0);
    const avgSessionDuration = sessionDurations.length > 0
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
      : 0;

    return {
      date: targetDate,
      activeUsers: uniqueUsers,
      totalSessions: uniqueSessions,
      totalEvents: dayEvents.length,
      topFeatures,
      chartUsage: chartEvents,
      reportUsage: reportEvents,
      avgSessionDuration,
      errorRate: dayEvents.length > 0 ? errorEvents / dayEvents.length : 0,
    };
  }

  /**
   * Get feature adoption metrics
   */
  getFeatureAdoption(): Array<{ feature: string; adoptionRate: number; usageCount: number }> {
    const featureEvents = this.events.filter(e => e.eventType === 'feature_usage');
    const uniqueUsers = new Set(this.events.map(e => e.userId).filter(Boolean)).size;

    const featureMap: Record<string, Set<string>> = {};
    const featureCount: Record<string, number> = {};

    featureEvents.forEach(e => {
      const feature = e.label || e.action;
      if (!featureMap[feature]) {
        featureMap[feature] = new Set();
        featureCount[feature] = 0;
      }
      if (e.userId) {
        featureMap[feature].add(e.userId);
      }
      featureCount[feature]++;
    });

    return Object.entries(featureMap).map(([feature, users]) => ({
      feature,
      adoptionRate: uniqueUsers > 0 ? (users.size / uniqueUsers) * 100 : 0,
      usageCount: featureCount[feature],
    })).sort((a, b) => b.adoptionRate - a.adoptionRate);
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const perfEvents = this.events.filter(e => e.eventType === 'performance');
    const metrics: Record<string, number[]> = {};

    perfEvents.forEach(e => {
      const metricName = e.action;
      if (!metrics[metricName]) {
        metrics[metricName] = [];
      }
      if (e.value !== undefined) {
        metrics[metricName].push(e.value);
      }
    });

    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    Object.entries(metrics).forEach(([name, values]) => {
      const sorted = values.sort((a, b) => a - b);
      result[name] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        count: values.length,
      };
    });

    return result;
  }

  /**
   * Export analytics as JSON
   */
  exportAsJSON(): string {
    return JSON.stringify({
      events: this.events,
      sessions: Array.from(this.sessions.values()),
      aggregates: this.getAggregates(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * End current session
   */
  endSession(): void {
    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;
    }
    this.saveEvents();
  }

  // ==================== PRIVATE METHODS ====================

  private initializeSession(): void {
    const session: SessionMetrics = {
      sessionId: this.currentSessionId,
      userId: this.currentUserId,
      startTime: Date.now(),
      eventCount: 0,
      pageViews: 0,
      featureUsage: {},
      chartsGenerated: 0,
      reportsExported: 0,
      errors: 0,
      performanceMetrics: {
        avgPageLoadTime: 0,
        avgChartRenderTime: 0,
        avgReportGenTime: 0,
      },
    };
    this.sessions.set(this.currentSessionId, session);
  }

  private updateSession(event: AnalyticsEvent): void {
    const session = this.sessions.get(event.sessionId);
    if (!session) return;

    session.eventCount++;

    switch (event.eventType) {
      case 'page_view':
        session.pageViews++;
        break;
      case 'feature_usage':
        session.featureUsage[event.label || event.action] =
          (session.featureUsage[event.label || event.action] || 0) + 1;
        break;
      case 'chart_generated':
        session.chartsGenerated++;
        break;
      case 'report_exported':
        session.reportsExported++;
        break;
      case 'error':
        session.errors++;
        break;
      case 'performance':
        this.updatePerformanceMetrics(session, event);
        break;
    }
  }

  private updatePerformanceMetrics(session: SessionMetrics, event: AnalyticsEvent): void {
    if (!event.value) return;

    if (event.label?.includes('pageLoad')) {
      session.performanceMetrics.avgPageLoadTime = event.value;
    } else if (event.label?.includes('chartRender')) {
      session.performanceMetrics.avgChartRenderTime = event.value;
    } else if (event.label?.includes('reportGen')) {
      session.performanceMetrics.avgReportGenTime = event.value;
    }
  }

  private updateAggregate(event: AnalyticsEvent): void {
    const key = `${event.eventType}:${event.category}:${event.action}`;
    const existing = this.aggregates.get(key);

    if (existing) {
      existing.count++;
      existing.lastOccurred = event.timestamp;
      if (event.value !== undefined) {
        existing.avgValue = ((existing.avgValue || 0) * (existing.count - 1) + event.value) / existing.count;
        existing.minValue = Math.min(existing.minValue || event.value, event.value);
        existing.maxValue = Math.max(existing.maxValue || event.value, event.value);
      }
    } else {
      this.aggregates.set(key, {
        eventType: event.eventType,
        category: event.category,
        action: event.action,
        count: 1,
        lastOccurred: event.timestamp,
        avgValue: event.value,
        minValue: event.value,
        maxValue: event.value,
      });
    }
  }

  private getTopFeatures(events: AnalyticsEvent[], limit: number): Array<{ feature: string; count: number }> {
    const featureCounts: Record<string, number> = {};
    events.forEach(e => {
      const feature = e.label || e.action;
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
    });

    return Object.entries(featureCounts)
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveEvents(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.events.slice(-1000)));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  private loadEvents(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.events = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      this.events = [];
    }
  }
}

// Global analytics instance
let analyticsInstance: AnalyticsEngine | null = null;

export function initializeAnalytics(userId?: string): AnalyticsEngine {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsEngine(userId);
  }
  return analyticsInstance;
}

export function getAnalytics(): AnalyticsEngine {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsEngine();
  }
  return analyticsInstance;
}
