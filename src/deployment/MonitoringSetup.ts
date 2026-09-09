// Monitoring Setup
// Production error tracking, alerting rules, and incident management

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: Record<string, any>;
  userId?: string;
  timestamp: number;
  resolved: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq';
  threshold: number;
  windowMinutes: number;
  severity: 'warning' | 'critical';
  isActive: boolean;
  notifyChannels: string[]; // email, slack, sms
}

export interface Incident {
  id: string;
  title: string;
  severity: 'minor' | 'major' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  affectedComponents: string[];
  createdAt: number;
  resolvedAt?: number;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  timestamp: number;
  status: Incident['status'];
  message: string;
}

/**
 * Monitoring Manager
 * Error tracking, alert rule evaluation, and incident management
 */
export class MonitoringManager {
  private errors: ErrorReport[] = [];
  private alertRules: Map<string, AlertRule> = new Map();
  private incidents: Map<string, Incident> = new Map();
  private errorsKey = 'kotravel_error_reports';
  private alertsKey = 'kotravel_alert_rules';
  private incidentsKey = 'kotravel_incidents';
  private maxErrors = 5000;

  constructor() {
    this.loadErrors();
    this.loadAlertRules();
    this.loadIncidents();
    this.initializeDefaultAlertRules();
    this.attachGlobalErrorHandler();
  }

  /**
   * Report an error
   */
  reportError(data: Omit<ErrorReport, 'id' | 'timestamp' | 'resolved'>): ErrorReport {
    const error: ErrorReport = {
      ...data,
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      resolved: false,
    };

    this.errors.push(error);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
    this.persistErrors();

    if (error.severity === 'critical') {
      this.createIncidentFromError(error);
    }

    return error;
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 50): ErrorReport[] {
    return this.errors.slice(-limit).reverse();
  }

  /**
   * Get error rate (errors per minute) over window
   */
  getErrorRate(windowMinutes: number = 5): number {
    const cutoff = Date.now() - windowMinutes * 60000;
    const recentErrors = this.errors.filter(e => e.timestamp > cutoff);
    return recentErrors.length / windowMinutes;
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string): boolean {
    const error = this.errors.find(e => e.id === errorId);
    if (!error) return false;
    error.resolved = true;
    this.persistErrors();
    return true;
  }

  /**
   * Create alert rule
   */
  createAlertRule(data: Omit<AlertRule, 'id'>): AlertRule {
    const rule: AlertRule = {
      ...data,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.alertRules.set(rule.id, rule);
    this.persistAlertRules();
    return rule;
  }

  /**
   * Evaluate alert rules against current metrics
   */
  evaluateAlerts(currentMetrics: Record<string, number>): AlertRule[] {
    const triggered: AlertRule[] = [];

    this.alertRules.forEach(rule => {
      if (!rule.isActive) return;
      const value = currentMetrics[rule.metric];
      if (value === undefined) return;

      const isTriggered =
        (rule.condition === 'gt' && value > rule.threshold) ||
        (rule.condition === 'lt' && value < rule.threshold) ||
        (rule.condition === 'eq' && value === rule.threshold);

      if (isTriggered) {
        triggered.push(rule);
      }
    });

    return triggered;
  }

  /**
   * Create incident
   */
  createIncident(data: Omit<Incident, 'id' | 'createdAt' | 'updates'>): Incident {
    const incident: Incident = {
      ...data,
      id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updates: [{
        timestamp: Date.now(),
        status: data.status,
        message: 'Incident created',
      }],
    };
    this.incidents.set(incident.id, incident);
    this.persistIncidents();
    return incident;
  }

  /**
   * Update incident status
   */
  updateIncident(incidentId: string, status: Incident['status'], message: string): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    incident.status = status;
    incident.updates.push({ timestamp: Date.now(), status, message });

    if (status === 'resolved') {
      incident.resolvedAt = Date.now();
    }

    this.persistIncidents();
    return true;
  }

  /**
   * Get active incidents
   */
  getActiveIncidents(): Incident[] {
    return Array.from(this.incidents.values()).filter(i => i.status !== 'resolved');
  }

  /**
   * Get incident history
   */
  getAllIncidents(): Incident[] {
    return Array.from(this.incidents.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Get monitoring dashboard summary
   */
  getDashboardSummary(): {
    errorRate: number;
    unresolvedErrors: number;
    activeIncidents: number;
    criticalErrors24h: number;
  } {
    const dayAgo = Date.now() - 86400000;
    return {
      errorRate: this.getErrorRate(5),
      unresolvedErrors: this.errors.filter(e => !e.resolved).length,
      activeIncidents: this.getActiveIncidents().length,
      criticalErrors24h: this.errors.filter(e => e.severity === 'critical' && e.timestamp > dayAgo).length,
    };
  }

  // ==================== PRIVATE METHODS ====================

  private initializeDefaultAlertRules(): void {
    if (this.alertRules.size === 0) {
      this.createAlertRule({
        name: 'High Error Rate',
        metric: 'errorRate',
        condition: 'gt',
        threshold: 10,
        windowMinutes: 5,
        severity: 'critical',
        isActive: true,
        notifyChannels: ['email', 'slack'],
      });

      this.createAlertRule({
        name: 'Elevated Response Time',
        metric: 'avgResponseTimeMs',
        condition: 'gt',
        threshold: 2000,
        windowMinutes: 10,
        severity: 'warning',
        isActive: true,
        notifyChannels: ['slack'],
      });
    }
  }

  private createIncidentFromError(error: ErrorReport): void {
    this.createIncident({
      title: `Critical error: ${error.message.slice(0, 80)}`,
      severity: 'major',
      status: 'investigating',
      affectedComponents: [error.context.component || 'unknown'],
    });
  }

  private attachGlobalErrorHandler(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', event => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        severity: 'medium',
        context: { source: event.filename, line: event.lineno },
      });
    });

    window.addEventListener('unhandledrejection', event => {
      this.reportError({
        message: String(event.reason),
        severity: 'medium',
        context: { type: 'unhandledrejection' },
      });
    });
  }

  private persistErrors(): void {
    try {
      localStorage.setItem(this.errorsKey, JSON.stringify(this.errors.slice(-1000)));
    } catch (e) { /* noop */ }
  }

  private loadErrors(): void {
    try {
      const data = localStorage.getItem(this.errorsKey);
      if (data) this.errors = JSON.parse(data);
    } catch (e) { /* noop */ }
  }

  private persistAlertRules(): void {
    try {
      localStorage.setItem(this.alertsKey, JSON.stringify(Array.from(this.alertRules.values())));
    } catch (e) { /* noop */ }
  }

  private loadAlertRules(): void {
    try {
      const data = localStorage.getItem(this.alertsKey);
      if (data) {
        const rules = JSON.parse(data) as AlertRule[];
        rules.forEach(r => this.alertRules.set(r.id, r));
      }
    } catch (e) { /* noop */ }
  }

  private persistIncidents(): void {
    try {
      localStorage.setItem(this.incidentsKey, JSON.stringify(Array.from(this.incidents.values())));
    } catch (e) { /* noop */ }
  }

  private loadIncidents(): void {
    try {
      const data = localStorage.getItem(this.incidentsKey);
      if (data) {
        const incidents = JSON.parse(data) as Incident[];
        incidents.forEach(i => this.incidents.set(i.id, i));
      }
    } catch (e) { /* noop */ }
  }
}

let monitoringManager: MonitoringManager | null = null;

export function getMonitoringManager(): MonitoringManager {
  if (!monitoringManager) {
    monitoringManager = new MonitoringManager();
  }
  return monitoringManager;
}
