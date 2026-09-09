// Bundle Analyzer
// Analyzes and optimizes bundle size

export interface BundleStats {
  totalSize: number;
  gzipSize: number;
  modules: ModuleStats[];
  timestamp: number;
}

export interface ModuleStats {
  name: string;
  size: number;
  gzipSize: number;
  percentage: number;
}

/**
 * Bundle Analyzer
 * Tracks bundle size and identifies optimization opportunities
 */
export class BundleAnalyzer {
  private stats: BundleStats[] = [];
  private storageKey = 'kotravel_bundle_stats';
  private warningThreshold = 1024 * 1024; // 1MB

  constructor() {
    this.loadStats();
  }

  /**
   * Record bundle stats
   */
  recordStats(modules: ModuleStats[]): BundleStats {
    const totalSize = modules.reduce((sum, m) => sum + m.size, 0);
    const gzipSize = Math.round(totalSize * 0.3); // estimate

    const stats: BundleStats = {
      totalSize,
      gzipSize,
      modules: modules.map(m => ({
        ...m,
        percentage: (m.size / totalSize) * 100,
      })),
      timestamp: Date.now(),
    };

    this.stats.push(stats);
    this.persistStats();
    return stats;
  }

  /**
   * Get latest stats
   */
  getLatestStats(): BundleStats | null {
    return this.stats.length > 0 ? this.stats[this.stats.length - 1] : null;
  }

  /**
   * Get size trend
   */
  getSizeTrend(days: number = 7): Array<{ date: string; size: number }> {
    const cutoffTime = Date.now() - (days * 86400000);
    return this.stats
      .filter(s => s.timestamp > cutoffTime)
      .map(s => ({
        date: new Date(s.timestamp).toISOString().split('T')[0],
        size: s.totalSize,
      }));
  }

  /**
   * Get large modules (>50KB)
   */
  getLargeModules(): ModuleStats[] {
    const latest = this.getLatestStats();
    if (!latest) return [];
    return latest.modules
      .filter(m => m.size > 50 * 1024)
      .sort((a, b) => b.size - a.size);
  }

  /**
   * Check if bundle size increased
   */
  checkBundleGrowth(threshold: number = 0.05): { increased: boolean; percentChange: number } {
    if (this.stats.length < 2) {
      return { increased: false, percentChange: 0 };
    }

    const previous = this.stats[this.stats.length - 2];
    const latest = this.stats[this.stats.length - 1];
    const percentChange = ((latest.totalSize - previous.totalSize) / previous.totalSize) * 100;

    return {
      increased: percentChange > (threshold * 100),
      percentChange,
    };
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(): string[] {
    const latest = this.getLatestStats();
    if (!latest) return [];

    const recommendations: string[] = [];

    if (latest.totalSize > this.warningThreshold) {
      recommendations.push('Bundle size exceeds 1MB - consider code splitting');
    }

    const largeModules = this.getLargeModules();
    if (largeModules.length > 3) {
      recommendations.push('Multiple large modules detected - implement lazy loading');
    }

    const growth = this.checkBundleGrowth();
    if (growth.increased) {
      recommendations.push(`Bundle grew ${growth.percentChange.toFixed(1)}% - review recent additions`);
    }

    return recommendations;
  }

  private persistStats(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stats.slice(-30)));
    } catch (e) {
      console.warn('Bundle stats persistence failed');
    }
  }

  private loadStats(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.stats = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Bundle stats load failed');
    }
  }
}

let analyzer: BundleAnalyzer | null = null;

export function getBundleAnalyzer(): BundleAnalyzer {
  if (!analyzer) {
    analyzer = new BundleAnalyzer();
  }
  return analyzer;
}
