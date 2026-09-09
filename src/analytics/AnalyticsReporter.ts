// Analytics Reporter
// Generates comprehensive analytics reports and summaries

import { AnalyticsEngine, DailyMetrics } from './AnalyticsEngine';
import { UserBehaviorTracker } from './UserBehavior';
import { PerformanceMonitor } from './PerformanceMonitor';

export interface AnalyticsReport {
  generatedAt: string;
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  executive_summary: {
    totalEvents: number;
    uniqueUsers: number;
    uniqueSessions: number;
    avgSessionDuration: number;
    errorRate: number;
  };
  feature_analytics: {
    topFeatures: Array<{ name: string; usageCount: number; adoptionRate: number }>;
    featureGrowth: Array<{ date: string; featureUsage: number }>;
  };
  performance_metrics: {
    pageLoad: { avg: number; min: number; max: number };
    chartRendering: { avg: number; min: number; max: number };
    reportGeneration: { avg: number; min: number; max: number };
    coreWebVitals: Record<string, number>;
  };
  user_behavior: {
    commonFlows: Array<{ path: string[]; count: number }>;
    funnelConversion: Record<string, number>;
    retention: Record<string, number>;
  };
  daily_breakdown: DailyMetrics[];
}

/**
 * Analytics Reporter
 * Generates comprehensive reports from collected analytics data
 */
export class AnalyticsReporter {
  constructor(
    private analytics: AnalyticsEngine,
    private behaviorTracker: UserBehaviorTracker,
    private performanceMonitor: PerformanceMonitor
  ) {}

  /**
   * Generate comprehensive analytics report
   */
  async generateReport(startDate?: string, endDate?: string): Promise<AnalyticsReport> {
    const reportStart = startDate || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const reportEnd = endDate || new Date().toISOString().split('T')[0];

    return {
      generatedAt: new Date().toISOString(),
      reportPeriod: {
        startDate: reportStart,
        endDate: reportEnd,
      },
      executive_summary: this.generateExecutiveSummary(),
      feature_analytics: await this.generateFeatureAnalytics(),
      performance_metrics: await this.generatePerformanceMetrics(),
      user_behavior: this.generateUserBehaviorAnalytics(),
      daily_breakdown: this.generateDailyBreakdown(reportStart, reportEnd),
    };
  }

  /**
   * Export report as JSON
   */
  async exportAsJSON(startDate?: string, endDate?: string): Promise<string> {
    const report = await this.generateReport(startDate, endDate);
    return JSON.stringify(report, null, 2);
  }

  /**
   * Export report as HTML
   */
  async exportAsHTML(startDate?: string, endDate?: string): Promise<string> {
    const report = await this.generateReport(startDate, endDate);
    return this.generateHTMLReport(report);
  }

  /**
   * Export report as CSV
   */
  async exportAsCSV(startDate?: string, endDate?: string): Promise<string> {
    const report = await this.generateReport(startDate, endDate);
    return this.generateCSVReport(report);
  }

  // ==================== PRIVATE METHODS ====================

  private generateExecutiveSummary() {
    const aggregates = this.analytics.getAggregates();
    const totalEvents = aggregates.reduce((sum, a) => sum + a.count, 0);
    const errorEvents = aggregates.filter(a => a.eventType === 'error').reduce((sum, a) => sum + a.count, 0);

    const dailyMetrics = this.analytics.getDailyMetrics();

    return {
      totalEvents,
      uniqueUsers: dailyMetrics.activeUsers,
      uniqueSessions: dailyMetrics.totalSessions,
      avgSessionDuration: dailyMetrics.avgSessionDuration,
      errorRate: totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0,
    };
  }

  private async generateFeatureAnalytics() {
    const adoption = this.analytics.getFeatureAdoption();
    const topFeatures = adoption.slice(0, 10).map(f => ({
      name: f.feature,
      usageCount: f.usageCount,
      adoptionRate: f.adoptionRate,
    }));

    // Simulate feature growth over time
    const featureGrowth = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const dailyMetrics = this.analytics.getDailyMetrics(date);
      featureGrowth.push({
        date,
        featureUsage: dailyMetrics.topFeatures.reduce((sum, f) => sum + f.count, 0),
      });
    }

    return {
      topFeatures,
      featureGrowth,
    };
  }

  private async generatePerformanceMetrics() {
    const perfMetrics = this.analytics.getPerformanceMetrics();

    const pageLoadMetric = perfMetrics['pageLoad'] || { avg: 0, min: 0, max: 0 };
    const chartRenderMetric = perfMetrics['chartRender'] || { avg: 0, min: 0, max: 0 };
    const reportGenMetric = perfMetrics['reportGen'] || { avg: 0, min: 0, max: 0 };

    let coreWebVitals: Record<string, number> = {};
    try {
      coreWebVitals = await this.performanceMonitor.getCoreWebVitals();
    } catch (e) {
      console.warn('Failed to get core web vitals:', e);
    }

    return {
      pageLoad: {
        avg: pageLoadMetric.avg,
        min: pageLoadMetric.min,
        max: pageLoadMetric.max,
      },
      chartRendering: {
        avg: chartRenderMetric.avg,
        min: chartRenderMetric.min,
        max: chartRenderMetric.max,
      },
      reportGeneration: {
        avg: reportGenMetric.avg,
        min: reportGenMetric.min,
        max: reportGenMetric.max,
      },
      coreWebVitals,
    };
  }

  private generateUserBehaviorAnalytics() {
    const commonFlows = this.behaviorTracker.getCommonFlows(2);
    const funnelMetrics = this.behaviorTracker.getFunnelMetrics(['view_chart', 'generate_chart', 'export_report']);
    const retention = this.behaviorTracker.getRetentionMetrics();

    return {
      commonFlows,
      funnelConversion: funnelMetrics,
      retention,
    };
  }

  private generateDailyBreakdown(startDate: string, endDate: string): DailyMetrics[] {
    const dailyMetrics: DailyMetrics[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyMetrics.push(this.analytics.getDailyMetrics(dateStr));
    }

    return dailyMetrics;
  }

  private generateHTMLReport(report: AnalyticsReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-bottom: 10px; font-size: 28px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 30px; }
    h2 { color: #d4713d; margin-top: 30px; margin-bottom: 15px; font-size: 20px; border-bottom: 2px solid #d4713d; padding-bottom: 10px; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
    .metric { background: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #d4713d; }
    .metric-label { font-size: 12px; color: #999; text-transform: uppercase; }
    .metric-value { font-size: 24px; font-weight: bold; color: #d4713d; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f9f9f9; font-weight: 600; color: #333; }
    tr:hover { background: #fafafa; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Analytics Report</h1>
    <div class="meta">
      Generated: ${new Date(report.generatedAt).toLocaleString()}<br>
      Period: ${report.reportPeriod.startDate} to ${report.reportPeriod.endDate}
    </div>

    <h2>Executive Summary</h2>
    <div class="metrics">
      <div class="metric">
        <div class="metric-label">Total Events</div>
        <div class="metric-value">${report.executive_summary.totalEvents.toLocaleString()}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Active Users</div>
        <div class="metric-value">${report.executive_summary.uniqueUsers.toLocaleString()}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Sessions</div>
        <div class="metric-value">${report.executive_summary.uniqueSessions.toLocaleString()}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Avg Session Duration</div>
        <div class="metric-value">${Math.round(report.executive_summary.avgSessionDuration / 1000)}s</div>
      </div>
      <div class="metric">
        <div class="metric-label">Error Rate</div>
        <div class="metric-value">${report.executive_summary.errorRate.toFixed(2)}%</div>
      </div>
    </div>

    <h2>Top Features</h2>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Usage Count</th>
          <th>Adoption Rate</th>
        </tr>
      </thead>
      <tbody>
        ${report.feature_analytics.topFeatures.map(f => `
          <tr>
            <td>${f.name}</td>
            <td>${f.usageCount}</td>
            <td>${f.adoptionRate.toFixed(2)}%</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>Performance Metrics</h2>
    <div class="metrics">
      <div class="metric">
        <div class="metric-label">Avg Page Load</div>
        <div class="metric-value">${report.performance_metrics.pageLoad.avg.toFixed(0)}ms</div>
      </div>
      <div class="metric">
        <div class="metric-label">Avg Chart Rendering</div>
        <div class="metric-value">${report.performance_metrics.chartRendering.avg.toFixed(0)}ms</div>
      </div>
      <div class="metric">
        <div class="metric-label">Avg Report Generation</div>
        <div class="metric-value">${report.performance_metrics.reportGeneration.avg.toFixed(0)}ms</div>
      </div>
    </div>

    <h2>User Behavior</h2>
    <h3 style="font-size: 16px; margin-top: 20px; color: #666;">Retention Metrics</h3>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(report.user_behavior.retention).map(([key, value]) => `
          <tr>
            <td>${key.replace(/_/g, ' ')}</td>
            <td>${typeof value === 'number' && value < 100 ? value.toFixed(2) : value}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
    `;
  }

  private generateCSVReport(report: AnalyticsReport): string {
    let csv = 'Analytics Report\n';
    csv += `Generated,${report.generatedAt}\n`;
    csv += `Period,${report.reportPeriod.startDate} to ${report.reportPeriod.endDate}\n\n`;

    csv += 'Executive Summary\n';
    csv += 'Metric,Value\n';
    csv += `Total Events,${report.executive_summary.totalEvents}\n`;
    csv += `Active Users,${report.executive_summary.uniqueUsers}\n`;
    csv += `Sessions,${report.executive_summary.uniqueSessions}\n`;
    csv += `Avg Session Duration,${report.executive_summary.avgSessionDuration}\n`;
    csv += `Error Rate,${report.executive_summary.errorRate.toFixed(2)}%\n\n`;

    csv += 'Top Features\n';
    csv += 'Feature,Usage Count,Adoption Rate\n';
    report.feature_analytics.topFeatures.forEach(f => {
      csv += `${f.name},${f.usageCount},${f.adoptionRate.toFixed(2)}%\n`;
    });

    return csv;
  }
}
