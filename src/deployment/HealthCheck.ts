// Health Check System
// Application health monitoring for load balancers and uptime monitors

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  responseTimeMs: number;
  message?: string;
  lastCheckedAt: number;
}

export interface SystemHealthReport {
  overallStatus: HealthStatus;
  components: ComponentHealth[];
  uptime: number;
  version: string;
  timestamp: number;
}

/**
 * Health Check Manager
 * Monitors application component health for /api/health endpoint
 */
export class HealthCheckManager {
  private startTime: number = Date.now();
  private componentCheckers: Map<string, () => Promise<ComponentHealth>> = new Map();
  private lastReport: SystemHealthReport | null = null;
  private appVersion = '1.0.0';

  constructor() {
    this.registerDefaultCheckers();
  }

  /**
   * Register a component health checker
   */
  registerChecker(name: string, checker: () => Promise<ComponentHealth>): void {
    this.componentCheckers.set(name, checker);
  }

  /**
   * Run all health checks and produce report
   */
  async runHealthCheck(): Promise<SystemHealthReport> {
    const components: ComponentHealth[] = [];

    for (const [name, checker] of this.componentCheckers) {
      try {
        const result = await this.withTimeout(checker(), 5000, name);
        components.push(result);
      } catch (error) {
        components.push({
          name,
          status: 'unhealthy',
          responseTimeMs: 5000,
          message: String(error),
          lastCheckedAt: Date.now(),
        });
      }
    }

    const overallStatus = this.calculateOverallStatus(components);

    const report: SystemHealthReport = {
      overallStatus,
      components,
      uptime: Date.now() - this.startTime,
      version: this.appVersion,
      timestamp: Date.now(),
    };

    this.lastReport = report;
    return report;
  }

  /**
   * Get last cached health report (for quick liveness checks)
   */
  getLastReport(): SystemHealthReport | null {
    return this.lastReport;
  }

  /**
   * Simple liveness check (is the process running)
   */
  isAlive(): boolean {
    return true;
  }

  /**
   * Readiness check (is the app ready to serve traffic)
   */
  async isReady(): Promise<boolean> {
    const report = await this.runHealthCheck();
    return report.overallStatus !== 'unhealthy';
  }

  /**
   * Get uptime in human-readable format
   */
  getUptimeFormatted(): string {
    const uptimeMs = Date.now() - this.startTime;
    const days = Math.floor(uptimeMs / 86400000);
    const hours = Math.floor((uptimeMs % 86400000) / 3600000);
    const minutes = Math.floor((uptimeMs % 3600000) / 60000);
    return `${days}d ${hours}h ${minutes}m`;
  }

  // ==================== PRIVATE METHODS ====================

  private registerDefaultCheckers(): void {
    this.registerChecker('localStorage', async () => {
      const start = performance.now();
      let status: HealthStatus = 'healthy';
      let message: string | undefined;

      try {
        const testKey = '__health_check__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
      } catch (e) {
        status = 'degraded';
        message = 'localStorage unavailable';
      }

      return {
        name: 'localStorage',
        status,
        responseTimeMs: performance.now() - start,
        message,
        lastCheckedAt: Date.now(),
      };
    });

    this.registerChecker('memory', async () => {
      const start = performance.now();
      let status: HealthStatus = 'healthy';
      let message: string | undefined;

      const memory = (performance as any).memory;
      if (memory) {
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        if (usagePercent > 90) {
          status = 'unhealthy';
          message = `Memory usage critical: ${usagePercent.toFixed(1)}%`;
        } else if (usagePercent > 75) {
          status = 'degraded';
          message = `Memory usage high: ${usagePercent.toFixed(1)}%`;
        }
      }

      return {
        name: 'memory',
        status,
        responseTimeMs: performance.now() - start,
        message,
        lastCheckedAt: Date.now(),
      };
    });
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number, name: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`${name} health check timed out`)), ms);
      promise
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  private calculateOverallStatus(components: ComponentHealth[]): HealthStatus {
    if (components.some(c => c.status === 'unhealthy')) return 'unhealthy';
    if (components.some(c => c.status === 'degraded')) return 'degraded';
    return 'healthy';
  }
}

let healthCheckManager: HealthCheckManager | null = null;

export function getHealthCheckManager(): HealthCheckManager {
  if (!healthCheckManager) {
    healthCheckManager = new HealthCheckManager();
  }
  return healthCheckManager;
}
