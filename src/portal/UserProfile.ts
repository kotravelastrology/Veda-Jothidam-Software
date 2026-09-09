// User Profile Management
// Handles user profile data, preferences, and account management

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  avatar?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  language: 'en' | 'ta';
  createdAt: number;
  lastLoginAt?: number;
  isActive: boolean;
  verificationStatus: 'unverified' | 'verified' | 'suspended';
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  emailDigest: 'daily' | 'weekly' | 'monthly' | 'never';
  chartViewDefault: 'rasi' | 'navamsha' | 'divisional';
  autoSaveCharts: boolean;
  maxRecentCharts: number;
  showAnalytics: boolean;
  privacyLevel: 'public' | 'friends' | 'private';
  twoFactorEnabled: boolean;
}

export interface UserSubscription {
  subscriptionId: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  startDate: number;
  endDate?: number;
  renewalDate?: number;
  chartsLimit: number;
  reportsLimit: number;
  storageGBLimit: number;
  apiCallsPerMonth: number;
  prioritySupport: boolean;
  customBranding: boolean;
  features: string[];
}

export interface UserStatistics {
  userId: string;
  totalCharts: number;
  totalReports: number;
  totalCalculations: number;
  storageUsedMB: number;
  lastActivityAt?: number;
  loginCount: number;
  averageSessionDurationSeconds: number;
}

/**
 * User Profile Manager
 * Manages user account, preferences, and subscription information
 */
export class UserProfileManager {
  private profile: UserProfile | null = null;
  private preferences: UserPreferences | null = null;
  private subscription: UserSubscription | null = null;
  private statistics: UserStatistics | null = null;
  private storageKey = 'kotravel_user_profile';
  private preferencesKey = 'kotravel_user_preferences';
  private subscriptionKey = 'kotravel_user_subscription';
  private statsKey = 'kotravel_user_statistics';

  constructor(userId?: string) {
    if (userId) {
      this.loadProfile(userId);
      this.loadPreferences();
      this.loadSubscription();
      this.loadStatistics();
    }
  }

  /**
   * Create new user profile
   */
  createProfile(data: Omit<UserProfile, 'createdAt' | 'isActive'>): UserProfile {
    const profile: UserProfile = {
      ...data,
      createdAt: Date.now(),
      isActive: true,
      verificationStatus: 'unverified',
    };
    this.profile = profile;
    this.saveProfile();
    return profile;
  }

  /**
   * Get current user profile
   */
  getProfile(): UserProfile | null {
    return this.profile;
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<UserProfile>): UserProfile | null {
    if (!this.profile) return null;
    this.profile = { ...this.profile, ...updates };
    this.saveProfile();
    return this.profile;
  }

  /**
   * Get user preferences
   */
  getPreferences(): UserPreferences | null {
    return this.preferences;
  }

  /**
   * Update user preferences
   */
  updatePreferences(updates: Partial<UserPreferences>): UserPreferences | null {
    if (!this.preferences) return null;
    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
    return this.preferences;
  }

  /**
   * Get subscription information
   */
  getSubscription(): UserSubscription | null {
    return this.subscription;
  }

  /**
   * Update subscription
   */
  updateSubscription(updates: Partial<UserSubscription>): UserSubscription | null {
    if (!this.subscription) return null;
    this.subscription = { ...this.subscription, ...updates };
    this.saveSubscription();
    return this.subscription;
  }

  /**
   * Get user statistics
   */
  getStatistics(): UserStatistics | null {
    return this.statistics;
  }

  /**
   * Update statistics
   */
  updateStatistics(updates: Partial<UserStatistics>): UserStatistics | null {
    if (!this.statistics) return null;
    this.statistics = { ...this.statistics, ...updates };
    this.saveStatistics();
    return this.statistics;
  }

  /**
   * Increment chart count
   */
  incrementChartCount(): void {
    if (this.statistics) {
      this.statistics.totalCharts++;
      this.saveStatistics();
    }
  }

  /**
   * Increment report count
   */
  incrementReportCount(): void {
    if (this.statistics) {
      this.statistics.totalReports++;
      this.saveStatistics();
    }
  }

  /**
   * Update storage usage
   */
  updateStorageUsage(bytes: number): void {
    if (this.statistics) {
      this.statistics.storageUsedMB = bytes / (1024 * 1024);
      this.saveStatistics();
    }
  }

  /**
   * Check subscription feature availability
   */
  hasFeature(featureName: string): boolean {
    if (!this.subscription) return false;
    return this.subscription.features.includes(featureName);
  }

  /**
   * Check if subscription is active
   */
  isSubscriptionActive(): boolean {
    if (!this.subscription) return false;
    const now = Date.now();
    return this.subscription.status === 'active' &&
      (!this.subscription.endDate || this.subscription.endDate > now);
  }

  /**
   * Check plan limits
   */
  canCreateChart(): boolean {
    if (!this.statistics || !this.subscription) return false;
    return this.statistics.totalCharts < this.subscription.chartsLimit;
  }

  canCreateReport(): boolean {
    if (!this.statistics || !this.subscription) return false;
    return this.statistics.totalReports < this.subscription.reportsLimit;
  }

  canAddStorage(bytes: number): boolean {
    if (!this.statistics || !this.subscription) return false;
    const totalGB = (this.statistics.storageUsedMB + bytes / (1024 * 1024)) / 1024;
    return totalGB <= this.subscription.storageGBLimit;
  }

  /**
   * Get subscription renewal info
   */
  getRenewalInfo(): { daysUntilRenewal: number; renewalDate: number } | null {
    if (!this.subscription?.renewalDate) return null;
    const daysUntilRenewal = Math.ceil((this.subscription.renewalDate - Date.now()) / 86400000);
    return {
      daysUntilRenewal,
      renewalDate: this.subscription.renewalDate,
    };
  }

  /**
   * Record login
   */
  recordLogin(): void {
    if (this.profile) {
      this.profile.lastLoginAt = Date.now();
      this.saveProfile();
    }
    if (this.statistics) {
      this.statistics.lastActivityAt = Date.now();
      this.statistics.loginCount++;
      this.saveStatistics();
    }
  }

  /**
   * Export profile data
   */
  exportData(): string {
    return JSON.stringify({
      profile: this.profile,
      preferences: this.preferences,
      subscription: this.subscription,
      statistics: this.statistics,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Import profile data
   */
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.profile) this.profile = data.profile;
      if (data.preferences) this.preferences = data.preferences;
      if (data.subscription) this.subscription = data.subscription;
      if (data.statistics) this.statistics = data.statistics;
      this.saveAll();
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  // ==================== PRIVATE METHODS ====================

  private loadProfile(userId: string): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.profile = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  }

  private loadPreferences(): void {
    try {
      const data = localStorage.getItem(this.preferencesKey);
      if (data) {
        this.preferences = JSON.parse(data);
      } else if (this.profile) {
        // Create default preferences
        this.preferences = {
          userId: this.profile.userId,
          theme: 'auto',
          notificationsEnabled: true,
          emailDigest: 'weekly',
          chartViewDefault: 'rasi',
          autoSaveCharts: true,
          maxRecentCharts: 10,
          showAnalytics: true,
          privacyLevel: 'private',
          twoFactorEnabled: false,
        };
        this.savePreferences();
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }

  private loadSubscription(): void {
    try {
      const data = localStorage.getItem(this.subscriptionKey);
      if (data) {
        this.subscription = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  }

  private loadStatistics(): void {
    try {
      const data = localStorage.getItem(this.statsKey);
      if (data) {
        this.statistics = JSON.parse(data);
      } else if (this.profile) {
        // Create default statistics
        this.statistics = {
          userId: this.profile.userId,
          totalCharts: 0,
          totalReports: 0,
          totalCalculations: 0,
          storageUsedMB: 0,
          loginCount: 0,
          averageSessionDurationSeconds: 0,
        };
        this.saveStatistics();
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }

  private saveProfile(): void {
    try {
      if (this.profile) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  }

  private savePreferences(): void {
    try {
      if (this.preferences) {
        localStorage.setItem(this.preferencesKey, JSON.stringify(this.preferences));
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  private saveSubscription(): void {
    try {
      if (this.subscription) {
        localStorage.setItem(this.subscriptionKey, JSON.stringify(this.subscription));
      }
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  }

  private saveStatistics(): void {
    try {
      if (this.statistics) {
        localStorage.setItem(this.statsKey, JSON.stringify(this.statistics));
      }
    } catch (error) {
      console.error('Failed to save statistics:', error);
    }
  }

  private saveAll(): void {
    this.saveProfile();
    this.savePreferences();
    this.saveSubscription();
    this.saveStatistics();
  }
}

// Global user profile instance
let profileManager: UserProfileManager | null = null;

export function initializeUserProfile(userId?: string): UserProfileManager {
  if (!profileManager) {
    profileManager = new UserProfileManager(userId);
  }
  return profileManager;
}

export function getUserProfile(): UserProfileManager {
  if (!profileManager) {
    profileManager = new UserProfileManager();
  }
  return profileManager;
}
