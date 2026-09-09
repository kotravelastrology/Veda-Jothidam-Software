// Subscription Manager
// Manages subscription plans, billing, and licensing

export interface SubscriptionPlan {
  planId: string;
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  monthlyPrice: number;
  yearlyPrice: number;
  chartsLimit: number;
  reportsLimit: number;
  storageGBLimit: number;
  apiCallsPerMonth: number;
  prioritySupport: boolean;
  customBranding: boolean;
  features: string[];
  description: string;
}

export interface BillingInfo {
  subscriptionId: string;
  planId: string;
  customerId: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'stripe';
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: number;
  status: 'active' | 'past_due' | 'cancelled' | 'paused';
  autoRenew: boolean;
}

/**
 * Subscription Manager
 * Manages subscription plans, upgrades, cancellations, and billing
 */
export class SubscriptionManager {
  private plans: Map<string, SubscriptionPlan> = new Map();
  private storageKey = 'kotravel_subscription_plans';

  constructor() {
    this.initializeDefaultPlans();
  }

  /**
   * Get all available plans
   */
  getAvailablePlans(): SubscriptionPlan[] {
    return Array.from(this.plans.values());
  }

  /**
   * Get plan by ID
   */
  getPlan(planId: string): SubscriptionPlan | null {
    return this.plans.get(planId) || null;
  }

  /**
   * Get free plan
   */
  getFreePlan(): SubscriptionPlan | null {
    return Array.from(this.plans.values()).find(p => p.tier === 'free') || null;
  }

  /**
   * Get pro plan
   */
  getProPlan(): SubscriptionPlan | null {
    return Array.from(this.plans.values()).find(p => p.tier === 'pro') || null;
  }

  /**
   * Get enterprise plan
   */
  getEnterprisePlan(): SubscriptionPlan | null {
    return Array.from(this.plans.values()).find(p => p.tier === 'enterprise') || null;
  }

  /**
   * Calculate plan cost
   */
  calculateCost(planId: string, billingCycle: 'monthly' | 'yearly'): number {
    const plan = this.plans.get(planId);
    if (!plan) return 0;
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  }

  /**
   * Calculate yearly savings for annual billing
   */
  calculateYearlySavings(planId: string): number {
    const plan = this.plans.get(planId);
    if (!plan) return 0;
    const monthlyCost = plan.monthlyPrice * 12;
    return monthlyCost - plan.yearlyPrice;
  }

  /**
   * Check feature availability
   */
  hasFeature(planId: string, featureName: string): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;
    return plan.features.includes(featureName);
  }

  /**
   * Get plan comparison
   */
  getComparison(): {
    chartsLimit: Array<{ tier: string; limit: number }>;
    reportsLimit: Array<{ tier: string; limit: number }>;
    storageLimit: Array<{ tier: string; limit: number }>;
    apiCalls: Array<{ tier: string; limit: number }>;
    support: Array<{ tier: string; included: boolean }>;
    branding: Array<{ tier: string; included: boolean }>;
  } {
    const plans = this.getAvailablePlans().sort((a, b) => {
      const tierOrder = { free: 0, pro: 1, enterprise: 2 };
      return tierOrder[a.tier] - tierOrder[b.tier];
    });

    return {
      chartsLimit: plans.map(p => ({ tier: p.tier, limit: p.chartsLimit })),
      reportsLimit: plans.map(p => ({ tier: p.tier, limit: p.reportsLimit })),
      storageLimit: plans.map(p => ({ tier: p.tier, limit: p.storageGBLimit })),
      apiCalls: plans.map(p => ({ tier: p.tier, limit: p.apiCallsPerMonth })),
      support: plans.map(p => ({ tier: p.tier, included: p.prioritySupport })),
      branding: plans.map(p => ({ tier: p.tier, included: p.customBranding })),
    };
  }

  /**
   * Get upgrade path
   */
  getUpgradeOptions(currentPlanId: string): SubscriptionPlan[] {
    const currentPlan = this.plans.get(currentPlanId);
    if (!currentPlan) return [];

    const tierOrder = { free: 0, pro: 1, enterprise: 2 };
    return this.getAvailablePlans().filter(
      p => tierOrder[p.tier] > tierOrder[currentPlan.tier]
    );
  }

  /**
   * Validate downgrade (check if usage is within limits)
   */
  validateDowngrade(currentStats: {
    chartsCount: number;
    reportsCount: number;
    storageUsedMB: number;
    apiCallsThisMonth: number;
  }, targetPlanId: string): { valid: boolean; issues: string[] } {
    const targetPlan = this.plans.get(targetPlanId);
    if (!targetPlan) return { valid: false, issues: ['Plan not found'] };

    const issues: string[] = [];

    if (currentStats.chartsCount > targetPlan.chartsLimit) {
      issues.push(`Chart count (${currentStats.chartsCount}) exceeds new limit (${targetPlan.chartsLimit})`);
    }

    if (currentStats.reportsCount > targetPlan.reportsLimit) {
      issues.push(`Report count (${currentStats.reportsCount}) exceeds new limit (${targetPlan.reportsLimit})`);
    }

    const storageUsedGB = currentStats.storageUsedMB / 1024;
    if (storageUsedGB > targetPlan.storageGBLimit) {
      issues.push(`Storage usage (${storageUsedGB.toFixed(1)}GB) exceeds new limit (${targetPlan.storageGBLimit}GB)`);
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  /**
   * Get free trial period (days)
   */
  getTrialPeriod(): number {
    return 14; // 14-day free trial
  }

  /**
   * Calculate refund (prorated)
   */
  calculateProratedRefund(
    planPrice: number,
    billingCycleStartDate: number,
    billingCycleEndDate: number,
    cancellationDate: number
  ): number {
    const totalCycleDays = (billingCycleEndDate - billingCycleStartDate) / 86400000;
    const remainingDays = Math.max(0, (billingCycleEndDate - cancellationDate) / 86400000);
    const dailyPrice = planPrice / totalCycleDays;
    return Math.round(dailyPrice * remainingDays * 100) / 100;
  }

  /**
   * Export subscription info as JSON
   */
  exportPlans(): string {
    const plans = this.getAvailablePlans();
    return JSON.stringify({
      plans,
      exportedAt: new Date().toISOString(),
      count: plans.length,
    }, null, 2);
  }

  // ==================== PRIVATE METHODS ====================

  private initializeDefaultPlans(): void {
    const defaultPlans: SubscriptionPlan[] = [
      {
        planId: 'plan_free',
        name: 'Free',
        tier: 'free',
        monthlyPrice: 0,
        yearlyPrice: 0,
        chartsLimit: 10,
        reportsLimit: 5,
        storageGBLimit: 1,
        apiCallsPerMonth: 100,
        prioritySupport: false,
        customBranding: false,
        features: ['basic-charts', 'birth-chart', 'read-only-reports'],
        description: 'Perfect for getting started with Vedic astrology',
      },
      {
        planId: 'plan_pro',
        name: 'Professional',
        tier: 'pro',
        monthlyPrice: 9.99,
        yearlyPrice: 99.99,
        chartsLimit: 100,
        reportsLimit: 50,
        storageGBLimit: 10,
        apiCallsPerMonth: 5000,
        prioritySupport: true,
        customBranding: false,
        features: [
          'all-charts',
          'divisional-charts',
          'dasha-analysis',
          'transit-analysis',
          'muhurta-finder',
          'compatibility-analysis',
          'custom-reports',
          'api-access',
          'email-support',
        ],
        description: 'For serious astrology enthusiasts and practitioners',
      },
      {
        planId: 'plan_enterprise',
        name: 'Enterprise',
        tier: 'enterprise',
        monthlyPrice: 49.99,
        yearlyPrice: 499.99,
        chartsLimit: 1000,
        reportsLimit: 500,
        storageGBLimit: 100,
        apiCallsPerMonth: 100000,
        prioritySupport: true,
        customBranding: true,
        features: [
          'all-features',
          'unlimited-api',
          'white-label',
          'team-collaboration',
          'advanced-analytics',
          'priority-support',
          'dedicated-support',
          'sso-integration',
          'custom-integrations',
        ],
        description: 'For organizations and professional services',
      },
    ];

    defaultPlans.forEach(plan => {
      this.plans.set(plan.planId, plan);
    });
  }
}

// Global subscription manager instance
let subscriptionManager: SubscriptionManager | null = null;

export function initializeSubscriptionManager(): SubscriptionManager {
  if (!subscriptionManager) {
    subscriptionManager = new SubscriptionManager();
  }
  return subscriptionManager;
}

export function getSubscriptionManager(): SubscriptionManager {
  if (!subscriptionManager) {
    subscriptionManager = new SubscriptionManager();
  }
  return subscriptionManager;
}
