// Launch Checklist
// Tracks production readiness across all phases for beta/GA launch gating

export type ChecklistCategory =
  | 'infrastructure' | 'security' | 'performance' | 'compliance'
  | 'documentation' | 'testing' | 'monitoring' | 'business';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  isCompleted: boolean;
  isCritical: boolean; // blocks launch if incomplete
  completedAt?: number;
  completedBy?: string;
  notes?: string;
}

export interface LaunchReadiness {
  totalItems: number;
  completedItems: number;
  criticalItems: number;
  criticalCompleted: number;
  readinessPercent: number;
  isReadyForLaunch: boolean;
  blockers: ChecklistItem[];
}

/**
 * Launch Checklist Manager
 * Tracks and validates production launch readiness
 */
export class LaunchChecklistManager {
  private items: Map<string, ChecklistItem> = new Map();
  private storageKey = 'kotravel_launch_checklist';

  constructor() {
    this.initializeChecklist();
    this.loadState();
  }

  /**
   * Mark item complete
   */
  completeItem(id: string, completedBy: string, notes?: string): boolean {
    const item = this.items.get(id);
    if (!item) return false;

    item.isCompleted = true;
    item.completedAt = Date.now();
    item.completedBy = completedBy;
    item.notes = notes;
    this.persistState();
    return true;
  }

  /**
   * Mark item incomplete (revert)
   */
  reopenItem(id: string): boolean {
    const item = this.items.get(id);
    if (!item) return false;

    item.isCompleted = false;
    item.completedAt = undefined;
    item.completedBy = undefined;
    this.persistState();
    return true;
  }

  /**
   * Get items by category
   */
  getByCategory(category: ChecklistCategory): ChecklistItem[] {
    return Array.from(this.items.values()).filter(i => i.category === category);
  }

  /**
   * Get all items
   */
  getAllItems(): ChecklistItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Calculate launch readiness
   */
  getReadiness(): LaunchReadiness {
    const allItems = this.getAllItems();
    const criticalItems = allItems.filter(i => i.isCritical);
    const completedItems = allItems.filter(i => i.isCompleted);
    const criticalCompleted = criticalItems.filter(i => i.isCompleted);
    const blockers = criticalItems.filter(i => !i.isCompleted);

    return {
      totalItems: allItems.length,
      completedItems: completedItems.length,
      criticalItems: criticalItems.length,
      criticalCompleted: criticalCompleted.length,
      readinessPercent: allItems.length > 0 ? (completedItems.length / allItems.length) * 100 : 0,
      isReadyForLaunch: blockers.length === 0,
      blockers,
    };
  }

  /**
   * Get readiness by category
   */
  getCategoryReadiness(): Record<ChecklistCategory, { completed: number; total: number; percent: number }> {
    const categories: ChecklistCategory[] = [
      'infrastructure', 'security', 'performance', 'compliance',
      'documentation', 'testing', 'monitoring', 'business',
    ];

    const result: any = {};
    categories.forEach(cat => {
      const items = this.getByCategory(cat);
      const completed = items.filter(i => i.isCompleted).length;
      result[cat] = {
        completed,
        total: items.length,
        percent: items.length > 0 ? (completed / items.length) * 100 : 0,
      };
    });

    return result;
  }

  /**
   * Export readiness report
   */
  exportReport(): string {
    return JSON.stringify({
      readiness: this.getReadiness(),
      categoryBreakdown: this.getCategoryReadiness(),
      items: this.getAllItems(),
      generatedAt: new Date().toISOString(),
    }, null, 2);
  }

  // ==================== PRIVATE METHODS ====================

  private initializeChecklist(): void {
    const defaultItems: Array<Omit<ChecklistItem, 'id' | 'isCompleted'>> = [
      // Infrastructure
      { category: 'infrastructure', title: 'Production hosting configured', description: 'Vercel/AWS production environment provisioned', isCritical: true },
      { category: 'infrastructure', title: 'CDN configured', description: 'Static assets served via CDN', isCritical: false },
      { category: 'infrastructure', title: 'Database backups automated', description: 'Daily automated backups with retention policy', isCritical: true },
      { category: 'infrastructure', title: 'CI/CD pipeline active', description: 'Automated build, test, deploy on merge to main', isCritical: true },
      { category: 'infrastructure', title: 'Rollback procedure documented', description: 'One-click rollback to previous deployment', isCritical: true },

      // Security
      { category: 'security', title: '2FA available for all accounts', description: 'TOTP-based two-factor authentication (Phase 44)', isCritical: true },
      { category: 'security', title: 'Data encryption at rest', description: 'AES-GCM encryption for sensitive fields (Phase 44)', isCritical: true },
      { category: 'security', title: 'Security headers configured', description: 'CSP, HSTS, X-Frame-Options deployed (Phase 44)', isCritical: true },
      { category: 'security', title: 'Penetration test completed', description: 'Third-party security audit passed', isCritical: false },
      { category: 'security', title: 'API rate limiting active', description: 'Per-key rate limits enforced (Phase 41)', isCritical: true },

      // Performance
      { category: 'performance', title: 'Caching strategy deployed', description: 'Multi-level cache for charts/reports (Phase 42)', isCritical: false },
      { category: 'performance', title: 'Bundle size optimized', description: 'Under 1MB gzipped main bundle (Phase 42)', isCritical: false },
      { category: 'performance', title: 'Core Web Vitals passing', description: 'LCP < 2.5s, FID < 100ms, CLS < 0.1', isCritical: true },
      { category: 'performance', title: 'Load testing completed', description: 'Verified for expected launch traffic', isCritical: true },

      // Compliance
      { category: 'compliance', title: 'Privacy policy published', description: 'GDPR/DPDP compliant privacy policy live', isCritical: true },
      { category: 'compliance', title: 'Terms of service published', description: 'Legal terms reviewed and published', isCritical: true },
      { category: 'compliance', title: 'Data anonymization ready', description: 'PII handling and erasure support (Phase 44)', isCritical: true },
      { category: 'compliance', title: 'Cookie consent implemented', description: 'Cookie banner with opt-in/out', isCritical: false },

      // Documentation
      { category: 'documentation', title: 'API documentation published', description: 'Public API docs for developers', isCritical: false },
      { category: 'documentation', title: 'User help center live', description: 'FAQ and help articles published', isCritical: false },
      { category: 'documentation', title: 'Onboarding flow documented', description: 'New user walkthrough complete', isCritical: false },

      // Testing
      { category: 'testing', title: 'Unit test coverage >80%', description: 'Core calculation engine fully tested (2,155+ tests)', isCritical: true },
      { category: 'testing', title: 'E2E tests passing', description: 'Critical user flows verified end-to-end', isCritical: true },
      { category: 'testing', title: 'Cross-browser testing done', description: 'Chrome, Safari, Firefox, Edge verified', isCritical: false },
      { category: 'testing', title: 'Mobile responsive testing done', description: 'iOS/Android viewport verification (Phase 36)', isCritical: true },

      // Monitoring
      { category: 'monitoring', title: 'Error tracking active', description: 'Global error handler + reporting (Phase 45)', isCritical: true },
      { category: 'monitoring', title: 'Health check endpoint live', description: '/api/health for uptime monitors (Phase 45)', isCritical: true },
      { category: 'monitoring', title: 'Alert rules configured', description: 'Error rate and latency alerting (Phase 45)', isCritical: true },
      { category: 'monitoring', title: 'Analytics dashboard live', description: 'User/feature analytics tracking (Phase 39)', isCritical: false },

      // Business
      { category: 'business', title: 'Pricing plans finalized', description: 'Free/Pro/Enterprise tiers confirmed (Phase 40)', isCritical: true },
      { category: 'business', title: 'Payment processing tested', description: 'Subscription billing flow verified', isCritical: true },
      { category: 'business', title: 'Support channel ready', description: 'Customer support process in place', isCritical: false },
      { category: 'business', title: 'Launch marketing prepared', description: 'Announcement and promotional materials ready', isCritical: false },
    ];

    defaultItems.forEach((item, index) => {
      const id = `check_${index}`;
      if (!this.items.has(id)) {
        this.items.set(id, { ...item, id, isCompleted: false });
      }
    });
  }

  private persistState(): void {
    try {
      const state = Array.from(this.items.entries()).reduce((acc, [id, item]) => {
        acc[id] = { isCompleted: item.isCompleted, completedAt: item.completedAt, completedBy: item.completedBy, notes: item.notes };
        return acc;
      }, {} as Record<string, any>);
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) { /* noop */ }
  }

  private loadState(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const state = JSON.parse(data);
        Object.entries(state).forEach(([id, saved]: [string, any]) => {
          const item = this.items.get(id);
          if (item) {
            Object.assign(item, saved);
          }
        });
      }
    } catch (e) { /* noop */ }
  }
}

let launchChecklist: LaunchChecklistManager | null = null;

export function getLaunchChecklist(): LaunchChecklistManager {
  if (!launchChecklist) {
    launchChecklist = new LaunchChecklistManager();
  }
  return launchChecklist;
}
