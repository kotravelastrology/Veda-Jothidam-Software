// Analytics Module
// Export all analytics functionality

export {
  AnalyticsEngine,
  initializeAnalytics,
  getAnalytics,
  type AnalyticsEvent,
  type EventAggregate,
  type SessionMetrics,
  type DailyMetrics,
} from './AnalyticsEngine';

export {
  AnalyticsDashboard,
} from './AnalyticsDashboard';

export {
  PerformanceMonitor,
  initializePerformanceMonitor,
  getPerformanceMonitor,
  type PerformanceMetric,
} from './PerformanceMonitor';

export {
  UserBehaviorTracker,
  initializeUserBehaviorTracker,
  getUserBehaviorTracker,
  type UserJourney,
  type UserInteraction,
  type BehaviorPattern,
} from './UserBehavior';

export {
  AnalyticsReporter,
  type AnalyticsReport,
} from './AnalyticsReporter';
