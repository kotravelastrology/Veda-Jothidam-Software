'use client';

import { useState, useEffect } from 'react';
import { AnalyticsEngine, SessionMetrics, DailyMetrics } from './AnalyticsEngine';

interface AnalyticsDashboardProps {
  analytics: AnalyticsEngine;
}

/**
 * Analytics Dashboard Component
 * Displays comprehensive analytics visualization and metrics
 */
export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'performance' | 'sessions'>('overview');
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics | null>(null);
  const [featureAdoption, setFeatureAdoption] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({});
  const [currentSession, setCurrentSession] = useState<SessionMetrics | null>(null);

  useEffect(() => {
    refreshMetrics();
  }, []);

  const refreshMetrics = () => {
    setDailyMetrics(analytics.getDailyMetrics());
    setFeatureAdoption(analytics.getFeatureAdoption());
    setPerformanceMetrics(analytics.getPerformanceMetrics());
    setCurrentSession(analytics.getSessionMetrics());
  };

  const exportAnalytics = () => {
    const data = analytics.exportAsJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-surface rounded-lg border border-line">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-ink">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={refreshMetrics}
            className="px-4 py-2 bg-saffron text-white rounded hover:bg-saffron/90 text-sm font-medium"
          >
            Refresh
          </button>
          <button
            onClick={exportAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-line">
        {(['overview', 'features', 'performance', 'sessions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
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
      {activeTab === 'overview' && dailyMetrics && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            label="Active Users"
            value={dailyMetrics.activeUsers}
            icon="👥"
          />
          <MetricCard
            label="Total Sessions"
            value={dailyMetrics.totalSessions}
            icon="📊"
          />
          <MetricCard
            label="Charts Generated"
            value={dailyMetrics.chartUsage}
            icon="📈"
          />
          <MetricCard
            label="Reports Exported"
            value={dailyMetrics.reportUsage}
            icon="📄"
          />
          <MetricCard
            label="Total Events"
            value={dailyMetrics.totalEvents}
            icon="🎯"
          />
          <MetricCard
            label="Avg Session Duration"
            value={`${Math.round(dailyMetrics.avgSessionDuration / 1000)}s`}
            icon="⏱️"
          />
          <MetricCard
            label="Error Rate"
            value={`${(dailyMetrics.errorRate * 100).toFixed(2)}%`}
            icon="⚠️"
          />
          <MetricCard
            label="Date"
            value={dailyMetrics.date}
            icon="📅"
          />

          {/* Top Features */}
          <div className="col-span-2 md:col-span-4 mt-4 p-4 bg-surface-soft rounded border border-line">
            <h3 className="font-semibold mb-3 text-ink">Top Features Used</h3>
            <div className="space-y-2">
              {dailyMetrics.topFeatures.map((feature, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-ink-soft">{feature.feature}</span>
                  <span className="font-medium text-saffron">{feature.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-ink">Feature Adoption Rate</h3>
          <div className="grid grid-cols-1 gap-3">
            {featureAdoption.map((feature, i) => (
              <div key={i} className="p-4 bg-surface-soft rounded border border-line">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-ink">{feature.feature}</span>
                  <span className="text-sm text-saffron font-bold">
                    {feature.adoptionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-line rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-saffron to-orange-400 h-2 rounded-full transition-all"
                    style={{ width: `${feature.adoptionRate}%` }}
                  />
                </div>
                <p className="text-xs text-ink-soft mt-1">
                  Used {feature.usageCount} times
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-ink">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(performanceMetrics).map(([metric, data]: any) => (
              <div key={metric} className="p-4 bg-surface-soft rounded border border-line">
                <h4 className="font-medium text-ink mb-3">{metric}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Avg:</span>
                    <span className="font-semibold text-saffron">
                      {data.avg.toFixed(2)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Min:</span>
                    <span className="font-semibold">{data.min.toFixed(2)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Max:</span>
                    <span className="font-semibold">{data.max.toFixed(2)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Count:</span>
                    <span className="font-semibold">{data.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && currentSession && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-ink">Current Session Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SessionMetricCard label="Session ID" value={currentSession.sessionId} />
            <SessionMetricCard
              label="Duration"
              value={`${Math.round((currentSession.duration || 0) / 1000)}s`}
            />
            <SessionMetricCard label="Total Events" value={currentSession.eventCount} />
            <SessionMetricCard label="Page Views" value={currentSession.pageViews} />
            <SessionMetricCard label="Charts Generated" value={currentSession.chartsGenerated} />
            <SessionMetricCard label="Reports Exported" value={currentSession.reportsExported} />
            <SessionMetricCard label="Errors" value={currentSession.errors} />
            <SessionMetricCard
              label="Avg Page Load"
              value={`${currentSession.performanceMetrics.avgPageLoadTime.toFixed(0)}ms`}
            />

            {/* Feature Usage */}
            <div className="md:col-span-2 p-4 bg-surface-soft rounded border border-line">
              <h4 className="font-medium text-ink mb-3">Features Used</h4>
              <div className="space-y-2">
                {Object.entries(currentSession.featureUsage).map(([feature, count]) => (
                  <div key={feature} className="flex justify-between text-sm">
                    <span className="text-ink-soft">{feature}</span>
                    <span className="font-semibold text-saffron">{count}</span>
                  </div>
                ))}
                {Object.keys(currentSession.featureUsage).length === 0 && (
                  <p className="text-ink-soft text-sm">No features used yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="p-4 bg-surface-soft rounded border border-line">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <p className="text-sm text-ink-soft">{label}</p>
      </div>
      <p className="text-2xl font-bold text-saffron">{value}</p>
    </div>
  );
}

interface SessionMetricCardProps {
  label: string;
  value: string | number;
}

function SessionMetricCard({ label, value }: SessionMetricCardProps) {
  return (
    <div className="p-3 bg-surface-soft rounded border border-line">
      <p className="text-xs text-ink-soft mb-1">{label}</p>
      <p className="text-lg font-semibold text-saffron">{value}</p>
    </div>
  );
}
