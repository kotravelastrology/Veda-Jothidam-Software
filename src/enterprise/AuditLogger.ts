// Audit Logger
// Logs and tracks all user actions for compliance and security

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, { before: any; after: any }>;
  status: 'success' | 'failure';
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
  details?: string;
}

/**
 * Audit Logger
 * Tracks user actions, changes, and security events
 */
export class AuditLogger {
  private logs: AuditLog[] = [];
  private storageKey = 'kotravel_audit_logs';
  private maxLogs = 50000;
  private retentionDays = 90;

  constructor() {
    this.loadLogs();
    this.cleanOldLogs();
  }

  /**
   * Log action
   */
  logAction(data: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const log: AuditLog = {
      ...data,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    this.logs.push(log);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.persistLogs();
    return log;
  }

  /**
   * Get logs for user
   */
  getUserLogs(userId: string, limit: number = 100): AuditLog[] {
    return this.logs
      .filter(l => l.userId === userId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get logs for resource
   */
  getResourceLogs(resourceType: string, resourceId: string): AuditLog[] {
    return this.logs
      .filter(l => l.resourceType === resourceType && l.resourceId === resourceId)
      .reverse();
  }

  /**
   * Search logs
   */
  searchLogs(query: string): AuditLog[] {
    const lowerQuery = query.toLowerCase();
    return this.logs.filter(
      l => l.action.toLowerCase().includes(lowerQuery) ||
           l.userId.toLowerCase().includes(lowerQuery) ||
           l.resourceId.toLowerCase().includes(lowerQuery)
    ).reverse();
  }

  /**
   * Get logs by date range
   */
  getLogsByDateRange(startDate: number, endDate: number): AuditLog[] {
    return this.logs.filter(
      l => l.timestamp >= startDate && l.timestamp <= endDate
    ).reverse();
  }

  /**
   * Get action statistics
   */
  getActionStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.logs.forEach(log => {
      stats[log.action] = (stats[log.action] || 0) + 1;
    });
    return stats;
  }

  /**
   * Get failure logs
   */
  getFailureLogs(limit: number = 100): AuditLog[] {
    return this.logs
      .filter(l => l.status === 'failure')
      .slice(-limit)
      .reverse();
  }

  /**
   * Export audit logs
   */
  exportLogs(startDate?: number, endDate?: number): string {
    let filtered = this.logs;

    if (startDate && endDate) {
      filtered = this.getLogsByDateRange(startDate, endDate);
    }

    return JSON.stringify({
      logs: filtered,
      exportedAt: new Date().toISOString(),
      count: filtered.length,
    }, null, 2);
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(): any {
    const stats = this.getActionStats();
    const failureLogs = this.getFailureLogs();
    const userActions: Record<string, number> = {};

    this.logs.forEach(log => {
      userActions[log.userId] = (userActions[log.userId] || 0) + 1;
    });

    return {
      generatedAt: new Date().toISOString(),
      totalLogs: this.logs.length,
      dateRange: {
        from: new Date(this.logs[0]?.timestamp || Date.now()).toISOString(),
        to: new Date(this.logs[this.logs.length - 1]?.timestamp || Date.now()).toISOString(),
      },
      actionStats: stats,
      failureCount: failureLogs.length,
      topUsers: Object.entries(userActions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([user, count]) => ({ user, count })),
      recommendations: this.generateRecommendations(failureLogs),
    };
  }

  // ==================== PRIVATE METHODS ====================

  private cleanOldLogs(): void {
    const cutoffDate = Date.now() - (this.retentionDays * 86400000);
    this.logs = this.logs.filter(l => l.timestamp > cutoffDate);
    this.persistLogs();
  }

  private generateRecommendations(failureLogs: AuditLog[]): string[] {
    const recommendations: string[] = [];

    if (failureLogs.length > 10) {
      recommendations.push('High failure rate detected - investigate security events');
    }

    const suspiciousUsers = new Set(failureLogs.map(l => l.userId));
    if (suspiciousUsers.size > 5) {
      recommendations.push('Multiple users with failed actions - monitor accounts');
    }

    return recommendations;
  }

  private persistLogs(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs.slice(-10000)));
    } catch (error) {
      console.error('Failed to save audit logs:', error);
    }
  }

  private loadLogs(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.logs = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
  }
}

let auditLogger: AuditLogger | null = null;

export function initializeAuditLogger(): AuditLogger {
  if (!auditLogger) {
    auditLogger = new AuditLogger();
  }
  return auditLogger;
}

export function getAuditLogger(): AuditLogger {
  if (!auditLogger) {
    auditLogger = new AuditLogger();
  }
  return auditLogger;
}
