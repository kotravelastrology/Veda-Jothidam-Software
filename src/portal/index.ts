// Portal Module
// Export all client portal functionality

export {
  UserProfileManager,
  initializeUserProfile,
  getUserProfile,
  type UserProfile,
  type UserPreferences,
  type UserSubscription,
  type UserStatistics,
} from './UserProfile';

export {
  ClientPortalDashboard,
} from './ClientPortalDashboard';

export {
  ChartLibraryManager,
  initializeChartLibrary,
  getChartLibrary,
  type SavedChart,
  type ChartCollection,
} from './ChartLibraryManager';

export {
  ReportLibraryManager,
  initializeReportLibrary,
  getReportLibrary,
  type SavedReport,
  type ReportTemplate,
} from './ReportLibraryManager';

export {
  SubscriptionManager,
  initializeSubscriptionManager,
  getSubscriptionManager,
  type SubscriptionPlan,
  type BillingInfo,
} from './SubscriptionManager';
