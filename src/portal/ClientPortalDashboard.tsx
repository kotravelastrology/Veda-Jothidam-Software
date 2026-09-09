'use client';

import { useState, useEffect } from 'react';
import { UserProfileManager, UserProfile, UserSubscription, UserStatistics } from './UserProfile';

interface ClientPortalDashboardProps {
  profileManager: UserProfileManager;
}

/**
 * Client Portal Dashboard
 * Main user dashboard with account, charts, reports, and settings
 */
export function ClientPortalDashboard({ profileManager }: ClientPortalDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'reports' | 'settings' | 'subscription'>('overview');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    setLoading(true);
    setProfile(profileManager.getProfile());
    setSubscription(profileManager.getSubscription());
    setStatistics(profileManager.getStatistics());
    setLoading(false);
  };

  if (loading || !profile) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-surface rounded-lg border border-line">
        <p className="text-ink-soft">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 bg-gradient-to-r from-saffron to-orange-500 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{profile.displayName || 'Welcome'}</h1>
            <p className="text-white/90">{profile.email}</p>
            {subscription && (
              <p className="text-white/80 text-sm mt-2">
                Plan: <span className="font-semibold capitalize">{subscription.plan}</span>
              </p>
            )}
          </div>
          <div className="text-right">
            {profile.avatar && (
              <img src={profile.avatar} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white" />
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-line overflow-x-auto">
        {(['overview', 'charts', 'reports', 'settings', 'subscription'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'text-saffron border-b-2 border-saffron'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DashboardCard
              icon="📊"
              label="Total Charts"
              value={statistics?.totalCharts || 0}
              subtitle="Created"
            />
            <DashboardCard
              icon="📄"
              label="Total Reports"
              value={statistics?.totalReports || 0}
              subtitle="Generated"
            />
            <DashboardCard
              icon="💾"
              label="Storage Used"
              value={`${(statistics?.storageUsedMB || 0).toFixed(1)}MB`}
              subtitle={`of ${subscription?.storageGBLimit || 10}GB`}
            />
            <DashboardCard
              icon="📈"
              label="Calculations"
              value={statistics?.totalCalculations || 0}
              subtitle="This month"
            />
          </div>

          {/* Subscription Status */}
          {subscription && (
            <div className="p-6 bg-surface-soft rounded-lg border border-line">
              <h3 className="text-lg font-semibold text-ink mb-4">Subscription Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-ink-soft mb-1">Current Plan</p>
                  <p className="text-xl font-bold text-saffron capitalize">{subscription.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-soft mb-1">Status</p>
                  <p className={`text-xl font-bold ${
                    subscription.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-ink-soft mb-1">Renewal Date</p>
                  <p className="text-xl font-bold text-ink">
                    {subscription.renewalDate
                      ? new Date(subscription.renewalDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="p-6 bg-surface-soft rounded-lg border border-line">
            <h3 className="text-lg font-semibold text-ink mb-4">Account Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Member Since</span>
                <span className="font-medium text-ink">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Last Login</span>
                <span className="font-medium text-ink">
                  {profile.lastLoginAt
                    ? new Date(profile.lastLoginAt).toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Verification</span>
                <span className={`font-medium ${
                  profile.verificationStatus === 'verified' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Login Count</span>
                <span className="font-medium text-ink">{statistics?.loginCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="p-6 bg-surface-soft rounded-lg border border-line">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-ink">My Charts</h3>
            <button className="px-4 py-2 bg-saffron text-white rounded hover:bg-saffron/90 text-sm font-medium">
              ➕ Create New Chart
            </button>
          </div>
          <p className="text-ink-soft text-center py-8">
            Charts library UI implementation for Phase 40 continuation
          </p>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="p-6 bg-surface-soft rounded-lg border border-line">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-ink">My Reports</h3>
            <button className="px-4 py-2 bg-saffron text-white rounded hover:bg-saffron/90 text-sm font-medium">
              📄 Generate New Report
            </button>
          </div>
          <p className="text-ink-soft text-center py-8">
            Reports library UI implementation for Phase 40 continuation
          </p>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-6 bg-surface-soft rounded-lg border border-line">
            <h3 className="text-lg font-semibold text-ink mb-4">Profile Settings</h3>
            <div className="space-y-4">
              <SettingField label="Display Name" value={profile.displayName} />
              <SettingField label="Email" value={profile.email} />
              <SettingField label="Phone" value={profile.phone || 'Not set'} />
              <SettingField label="Location" value={profile.location || 'Not set'} />
              <SettingField label="Timezone" value={profile.timezone || 'Auto-detect'} />
            </div>
          </div>

          <div className="p-6 bg-surface-soft rounded-lg border border-line">
            <h3 className="text-lg font-semibold text-ink mb-4">Preferences</h3>
            <div className="space-y-3">
              <PreferenceToggle label="Email Notifications" defaultValue={true} />
              <PreferenceToggle label="Auto-save Charts" defaultValue={true} />
              <PreferenceToggle label="Show Analytics" defaultValue={true} />
            </div>
          </div>

          <div className="p-6 bg-surface-soft rounded-lg border border-line">
            <h3 className="text-lg font-semibold text-ink mb-4">Security</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
              🔒 Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && subscription && (
        <div className="space-y-4">
          <div className="p-6 bg-surface-soft rounded-lg border border-line">
            <h3 className="text-lg font-semibold text-ink mb-4">Plan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SubscriptionFeature
                label="Charts Limit"
                value={`${statistics?.totalCharts || 0} / ${subscription.chartsLimit}`}
              />
              <SubscriptionFeature
                label="Reports Limit"
                value={`${statistics?.totalReports || 0} / ${subscription.reportsLimit}`}
              />
              <SubscriptionFeature
                label="Storage"
                value={`${(statistics?.storageUsedMB || 0).toFixed(1)}MB / ${subscription.storageGBLimit}GB`}
              />
              <SubscriptionFeature
                label="API Calls/Month"
                value={`${subscription.apiCallsPerMonth}`}
              />
              <SubscriptionFeature
                label="Priority Support"
                value={subscription.prioritySupport ? '✅ Included' : '❌ Not included'}
              />
              <SubscriptionFeature
                label="Custom Branding"
                value={subscription.customBranding ? '✅ Included' : '❌ Not included'}
              />
            </div>
          </div>

          <div className="p-6 bg-surface-soft rounded-lg border border-line">
            <h3 className="text-lg font-semibold text-ink mb-4">Manage Subscription</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-saffron text-white rounded hover:bg-saffron/90 text-sm font-medium">
                💳 Upgrade Plan
              </button>
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm font-medium">
                ⏸️ Pause Subscription
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium">
                ❌ Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DashboardCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
}

function DashboardCard({ icon, label, value, subtitle }: DashboardCardProps) {
  return (
    <div className="p-4 bg-surface-soft rounded-lg border border-line">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-sm text-ink-soft">{label}</p>
      </div>
      <p className="text-2xl font-bold text-saffron mb-1">{value}</p>
      {subtitle && <p className="text-xs text-ink-soft">{subtitle}</p>}
    </div>
  );
}

interface SettingFieldProps {
  label: string;
  value: string;
}

function SettingField({ label, value }: SettingFieldProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-line last:border-b-0">
      <span className="text-ink-soft">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

interface PreferenceToggleProps {
  label: string;
  defaultValue?: boolean;
}

function PreferenceToggle({ label, defaultValue = false }: PreferenceToggleProps) {
  const [enabled, setEnabled] = useState(defaultValue);
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-ink-soft">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          enabled ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
        }`}
      >
        {enabled ? 'On' : 'Off'}
      </button>
    </div>
  );
}

interface SubscriptionFeatureProps {
  label: string;
  value: string;
}

function SubscriptionFeature({ label, value }: SubscriptionFeatureProps) {
  return (
    <div>
      <p className="text-sm text-ink-soft mb-1">{label}</p>
      <p className="text-lg font-bold text-saffron">{value}</p>
    </div>
  );
}
