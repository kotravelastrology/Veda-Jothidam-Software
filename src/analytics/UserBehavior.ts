// User Behavior Tracking
// Analyzes user interaction patterns and behavior flows

import { getAnalytics } from './AnalyticsEngine';

export interface UserJourney {
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  path: string[];
  interactions: UserInteraction[];
  completedGoals: string[];
  abandonedGoals: string[];
}

export interface UserInteraction {
  timestamp: number;
  type: 'click' | 'input' | 'scroll' | 'navigation' | 'error';
  element: string;
  data?: any;
}

export interface BehaviorPattern {
  pattern: string;
  occurrences: number;
  averageDuration: number;
  conversionRate: number;
}

/**
 * User Behavior Tracker
 * Monitors and analyzes user interaction patterns and conversion flows
 */
export class UserBehaviorTracker {
  private journeys: Map<string, UserJourney> = new Map();
  private currentJourneyId: string | null = null;
  private currentPath: string[] = [];
  private interactions: UserInteraction[] = [];
  private goalStack: string[] = [];
  private storageKey = 'kotravel_user_journeys';

  constructor(userId?: string) {
    this.startNewJourney(userId);
    this.attachEventListeners();
  }

  /**
   * Start tracking new user journey
   */
  startNewJourney(userId?: string): string {
    const journeyId = `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.currentJourneyId = journeyId;
    this.currentPath = [];
    this.interactions = [];
    this.goalStack = [];

    const journey: UserJourney = {
      userId,
      startTime: Date.now(),
      path: [],
      interactions: [],
      completedGoals: [],
      abandonedGoals: [],
    };

    this.journeys.set(journeyId, journey);
    return journeyId;
  }

  /**
   * Track page navigation
   */
  trackNavigation(page: string): void {
    if (!this.currentJourneyId) return;

    this.currentPath.push(page);
    const journey = this.journeys.get(this.currentJourneyId);
    if (journey) {
      journey.path.push(page);
    }

    this.recordInteraction('navigation', page);
    getAnalytics().trackPageView(page);
  }

  /**
   * Start tracking a goal/funnel step
   */
  pushGoal(goalName: string): void {
    this.goalStack.push(goalName);
    getAnalytics().trackEvent({
      eventType: 'feature_usage',
      category: 'goals',
      action: 'goal_started',
      label: goalName,
    });
  }

  /**
   * Complete a goal
   */
  completeGoal(goalName: string): void {
    const journey = this.journeys.get(this.currentJourneyId!);
    if (!journey) return;

    const index = this.goalStack.indexOf(goalName);
    if (index > -1) {
      this.goalStack.splice(index, 1);
    }
    journey.completedGoals.push(goalName);

    getAnalytics().trackEvent({
      eventType: 'feature_usage',
      category: 'goals',
      action: 'goal_completed',
      label: goalName,
    });
  }

  /**
   * Abandon a goal
   */
  abandonGoal(goalName: string): void {
    const journey = this.journeys.get(this.currentJourneyId!);
    if (!journey) return;

    const index = this.goalStack.indexOf(goalName);
    if (index > -1) {
      this.goalStack.splice(index, 1);
    }
    journey.abandonedGoals.push(goalName);

    getAnalytics().trackEvent({
      eventType: 'feature_usage',
      category: 'goals',
      action: 'goal_abandoned',
      label: goalName,
    });
  }

  /**
   * Record user interaction
   */
  recordInteraction(type: UserInteraction['type'], element: string, data?: any): void {
    if (!this.currentJourneyId) return;

    const journey = this.journeys.get(this.currentJourneyId);
    if (!journey) return;

    const interaction: UserInteraction = {
      timestamp: Date.now(),
      type,
      element,
      data,
    };

    journey.interactions.push(interaction);
  }

  /**
   * Analyze behavior patterns
   */
  analyzeBehaviorPatterns(): BehaviorPattern[] {
    const patterns: Record<string, BehaviorPattern> = {};

    this.journeys.forEach(journey => {
      if (journey.path.length > 1) {
        for (let i = 0; i < journey.path.length - 1; i++) {
          const pattern = `${journey.path[i]} -> ${journey.path[i + 1]}`;
          if (!patterns[pattern]) {
            patterns[pattern] = {
              pattern,
              occurrences: 0,
              averageDuration: 0,
              conversionRate: journey.completedGoals.length > 0 ? 1 : 0,
            };
          }
          patterns[pattern].occurrences++;
        }
      }
    });

    return Object.values(patterns).sort((a, b) => b.occurrences - a.occurrences);
  }

  /**
   * Get common user flows
   */
  getCommonFlows(minOccurrences: number = 2): Array<{ path: string[]; count: number }> {
    const flows: Record<string, number> = {};

    this.journeys.forEach(journey => {
      const pathStr = JSON.stringify(journey.path);
      flows[pathStr] = (flows[pathStr] || 0) + 1;
    });

    return Object.entries(flows)
      .filter(([_, count]) => count >= minOccurrences)
      .map(([path, count]) => ({
        path: JSON.parse(path),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get funnel metrics
   */
  getFunnelMetrics(goalSequence: string[]): Record<string, number> {
    const metrics: Record<string, number> = {};

    let stepCount = 0;
    goalSequence.forEach((goal, index) => {
      const journeysCompleting = Array.from(this.journeys.values()).filter(j =>
        j.completedGoals.includes(goal)
      ).length;

      stepCount = journeysCompleting;
      metrics[`step_${index}_${goal}`] = journeysCompleting;
    });

    // Calculate conversion rates
    const totalJourneys = this.journeys.size;
    Object.entries(metrics).forEach(([key, value]) => {
      const rate = totalJourneys > 0 ? (value / totalJourneys) * 100 : 0;
      metrics[`${key}_rate`] = parseFloat(rate.toFixed(2));
    });

    return metrics;
  }

  /**
   * Get user retention metrics
   */
  getRetentionMetrics(): Record<string, number> {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const todaysJourneys = Array.from(this.journeys.values()).filter(j => {
      const date = new Date(j.startTime).toISOString().split('T')[0];
      return date === today;
    });

    const yesterdaysUsers = new Set(
      Array.from(this.journeys.values())
        .filter(j => {
          const date = new Date(j.startTime).toISOString().split('T')[0];
          return date === yesterday;
        })
        .map(j => j.userId)
    );

    const todaysUsers = new Set(todaysJourneys.map(j => j.userId));
    const returningUsers = Array.from(yesterdaysUsers).filter(u => todaysUsers.has(u)).length;

    return {
      totalTodayUsers: todaysUsers.size,
      returningUsers,
      retentionRate: yesterdaysUsers.size > 0 ? (returningUsers / yesterdaysUsers.size) * 100 : 0,
      newUsers: todaysUsers.size - returningUsers,
    };
  }

  /**
   * End current journey and return metrics
   */
  endCurrentJourney(): UserJourney | null {
    if (!this.currentJourneyId) return null;

    const journey = this.journeys.get(this.currentJourneyId);
    if (journey) {
      journey.endTime = Date.now();
      journey.duration = journey.endTime - journey.startTime;
    }

    this.saveJourneys();
    return journey || null;
  }

  /**
   * Get all journeys
   */
  getAllJourneys(): UserJourney[] {
    return Array.from(this.journeys.values());
  }

  // ==================== PRIVATE METHODS ====================

  private attachEventListeners(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      this.recordInteraction('click', target.id || target.className || 'unknown');
    }, true);

    document.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLElement;
      this.recordInteraction('input', target.id || target.className || 'unknown');
    }, true);
  }

  private saveJourneys(): void {
    try {
      const journeysArray = Array.from(this.journeys.values()).slice(-100);
      localStorage.setItem(this.storageKey, JSON.stringify(journeysArray));
    } catch (error) {
      console.error('Failed to save journeys:', error);
    }
  }
}

// Global user behavior tracker instance
let behaviorTracker: UserBehaviorTracker | null = null;

export function initializeUserBehaviorTracker(userId?: string): UserBehaviorTracker {
  if (!behaviorTracker) {
    behaviorTracker = new UserBehaviorTracker(userId);
  }
  return behaviorTracker;
}

export function getUserBehaviorTracker(): UserBehaviorTracker {
  if (!behaviorTracker) {
    behaviorTracker = new UserBehaviorTracker();
  }
  return behaviorTracker;
}
