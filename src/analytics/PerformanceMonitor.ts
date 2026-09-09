// Performance Monitor
// Tracks and analyzes application performance metrics

import { getAnalytics } from './AnalyticsEngine';

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * Performance Monitor
 * Measures page load, rendering, and operation performance
 */
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private navigationStart: number = performance.now();

  constructor() {
    this.captureNavigationTiming();
  }

  /**
   * Start measuring a performance metric
   */
  startMeasure(name: string, metadata?: Record<string, any>): string {
    const id = `${name}_${Date.now()}`;
    this.metrics.set(id, {
      name,
      startTime: performance.now(),
      metadata,
    });
    return id;
  }

  /**
   * End measuring and log the metric
   */
  endMeasure(id: string): PerformanceMetric | null {
    const metric = this.metrics.get(id);
    if (!metric) {
      console.warn(`Metric ${id} not found`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    const analytics = getAnalytics();
    analytics.trackPerformance(metric.name, metric.duration);

    return metric;
  }

  /**
   * Measure operation duration
   */
  async measureAsync<T>(
    operationName: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const id = this.startMeasure(operationName, metadata);
    try {
      return await operation();
    } finally {
      this.endMeasure(id);
    }
  }

  /**
   * Measure synchronous operation
   */
  measureSync<T>(
    operationName: string,
    operation: () => T,
    metadata?: Record<string, any>
  ): T {
    const id = this.startMeasure(operationName, metadata);
    try {
      return operation();
    } finally {
      this.endMeasure(id);
    }
  }

  /**
   * Get page load metrics
   */
  getPageLoadMetrics(): Record<string, number> {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as any;
    if (!navigationTiming) {
      return {};
    }

    const navStart = navigationTiming.startTime || 0;
    return {
      dnsLookup: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
      tcpConnection: navigationTiming.connectEnd - navigationTiming.connectStart,
      timeToFirstByte: navigationTiming.responseStart - navigationTiming.requestStart,
      responseTime: navigationTiming.responseEnd - navigationTiming.responseStart,
      domInteractive: navigationTiming.domInteractive - navStart,
      domComplete: navigationTiming.domComplete - navStart,
      loadComplete: navigationTiming.loadEventEnd - navStart,
    };
  }

  /**
   * Get Core Web Vitals
   */
  async getCoreWebVitals(): Promise<Record<string, number>> {
    const vitals: Record<string, any> = {};

    // Largest Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint').pop() as PerformanceEntry;
    if (lcpEntry) {
      vitals.lcp = lcpEntry.startTime;
    }

    // First Input Delay
    const fid = await this.measureFirstInputDelay();
    if (fid) vitals.fid = fid;

    // Cumulative Layout Shift
    const cls = await this.measureCumulativeLayoutShift();
    if (cls !== null && cls !== undefined) vitals.cls = cls;

    return vitals;
  }

  /**
   * Get metric summary
   */
  getMetricsSummary(): Record<string, { count: number; avg: number; min: number; max: number }> {
    const summary: Record<string, number[]> = {};

    this.metrics.forEach(metric => {
      if (metric.duration !== undefined) {
        if (!summary[metric.name]) {
          summary[metric.name] = [];
        }
        summary[metric.name].push(metric.duration);
      }
    });

    const result: Record<string, { count: number; avg: number; min: number; max: number }> = {};
    Object.entries(summary).forEach(([name, durations]) => {
      const sorted = durations.sort((a, b) => a - b);
      result[name] = {
        count: durations.length,
        avg: durations.reduce((a, b) => a + b, 0) / durations.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
      };
    });

    return result;
  }

  /**
   * Monitor memory usage (if available)
   */
  getMemoryUsage(): Record<string, number> | null {
    if (!(performance as any).memory) {
      return null;
    }

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      heapUsagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }

  /**
   * Observe performance entries
   */
  observePerformanceEntries(callback: (entries: PerformanceEntryList) => void): PerformanceObserver | null {
    if (!('PerformanceObserver' in window)) {
      return null;
    }

    const observer = new PerformanceObserver(list => {
      callback(list.getEntries());
    });

    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'resource', 'paint', 'largest-contentful-paint'] });
      return observer;
    } catch (e) {
      console.warn('PerformanceObserver error:', e);
      return null;
    }
  }

  // ==================== PRIVATE METHODS ====================

  private captureNavigationTiming(): void {
    const analytics = getAnalytics();
    const metrics = this.getPageLoadMetrics();

    if (Object.keys(metrics).length > 0) {
      analytics.trackPerformance('pageLoad', metrics.loadComplete || 0);
      analytics.trackPerformance('domInteractive', metrics.domInteractive || 0);
      analytics.trackPerformance('domComplete', metrics.domComplete || 0);
    }
  }

  private async measureFirstInputDelay(): Promise<number | null> {
    return new Promise(resolve => {
      if (!('PerformanceObserver' in window)) {
        resolve(null);
        return;
      }

      try {
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const firstInput = entries[0];
          if (firstInput) {
            const fid = (firstInput as any).processingStart - firstInput.startTime;
            observer.disconnect();
            resolve(fid);
          }
        });

        observer.observe({ entryTypes: ['first-input'] });
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 5000);
      } catch (e) {
        resolve(null);
      }
    });
  }

  private async measureCumulativeLayoutShift(): Promise<number | null> {
    return new Promise(resolve => {
      if (!('PerformanceObserver' in window)) {
        resolve(null);
        return;
      }

      let cls = 0;
      try {
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value || 0;
            }
          });
        });

        observer.observe({ entryTypes: ['layout-shift'] });
        setTimeout(() => {
          observer.disconnect();
          resolve(cls > 0 ? cls : null);
        }, 5000);
      } catch (e) {
        resolve(null);
      }
    });
  }
}

// Global performance monitor instance
let performanceMonitor: PerformanceMonitor | null = null;

export function initializePerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}
