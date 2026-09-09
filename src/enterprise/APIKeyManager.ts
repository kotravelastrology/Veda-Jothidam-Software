// API Key Manager
// Manages API keys, permissions, and rate limiting

export interface APIKey {
  id: string;
  key: string; // hashed
  maskedKey: string; // last 4 chars visible
  name: string;
  teamId: string;
  createdBy: string;
  permissions: string[];
  rateLimitPerMinute: number;
  rateLimitPerDay: number;
  isActive: boolean;
  lastUsedAt?: number;
  expiresAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface RateLimitStatus {
  minuteLimit: number;
  minuteUsed: number;
  dayLimit: number;
  dayUsed: number;
  resetTime: number;
}

/**
 * API Key Manager
 * Manages API keys, permissions, and rate limiting
 */
export class APIKeyManager {
  private apiKeys: Map<string, APIKey> = new Map();
  private rateLimits: Map<string, RateLimitStatus> = new Map();
  private storageKey = 'kotravel_api_keys';
  private maxKeysPerTeam = 10;

  constructor() {
    this.loadAPIKeys();
  }

  /**
   * Create API key
   */
  createAPIKey(data: Omit<APIKey, 'id' | 'key' | 'maskedKey' | 'createdAt' | 'updatedAt'>): APIKey {
    const teamKeys = Array.from(this.apiKeys.values()).filter(k => k.teamId === data.teamId);
    if (teamKeys.length >= this.maxKeysPerTeam) {
      throw new Error(`API key limit reached (${this.maxKeysPerTeam})`);
    }

    const key = this.generateKey();
    const maskedKey = key.slice(-4);

    const apiKey: APIKey = {
      ...data,
      id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key: this.hashKey(key),
      maskedKey,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.apiKeys.set(apiKey.id, apiKey);
    this.initializeRateLimit(apiKey.id, apiKey.rateLimitPerMinute, apiKey.rateLimitPerDay);
    this.persistAPIKeys();

    // Return key only once
    return { ...apiKey, key } as any;
  }

  /**
   * Get API key (masked)
   */
  getAPIKey(keyId: string): APIKey | null {
    return this.apiKeys.get(keyId) || null;
  }

  /**
   * Get team API keys
   */
  getTeamAPIKeys(teamId: string): APIKey[] {
    return Array.from(this.apiKeys.values())
      .filter(k => k.teamId === teamId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Validate API key
   */
  validateAPIKey(keyHash: string): APIKey | null {
    for (const apiKey of this.apiKeys.values()) {
      if (apiKey.key === keyHash && apiKey.isActive) {
        if (apiKey.expiresAt && apiKey.expiresAt < Date.now()) {
          return null;
        }
        return apiKey;
      }
    }
    return null;
  }

  /**
   * Check rate limit
   */
  checkRateLimit(keyId: string): { allowed: boolean; remaining: number; resetTime: number } {
    const apiKey = this.apiKeys.get(keyId);
    if (!apiKey) return { allowed: false, remaining: 0, resetTime: 0 };

    const status = this.rateLimits.get(keyId);
    if (!status) return { allowed: false, remaining: 0, resetTime: 0 };

    const now = Date.now();
    const allowed = status.minuteUsed < status.minuteLimit && status.dayUsed < status.dayLimit;

    if (allowed) {
      status.minuteUsed++;
      status.dayUsed++;
    }

    return {
      allowed,
      remaining: Math.max(0, status.minuteLimit - status.minuteUsed),
      resetTime: status.resetTime,
    };
  }

  /**
   * Revoke API key
   */
  revokeAPIKey(keyId: string): boolean {
    const apiKey = this.apiKeys.get(keyId);
    if (!apiKey) return false;

    apiKey.isActive = false;
    apiKey.updatedAt = Date.now();
    this.persistAPIKeys();
    return true;
  }

  /**
   * Update API key
   */
  updateAPIKey(keyId: string, updates: Partial<APIKey>): APIKey | null {
    const apiKey = this.apiKeys.get(keyId);
    if (!apiKey) return null;

    Object.assign(apiKey, updates);
    apiKey.updatedAt = Date.now();
    this.persistAPIKeys();
    return apiKey;
  }

  /**
   * Record API key usage
   */
  recordUsage(keyId: string): void {
    const apiKey = this.apiKeys.get(keyId);
    if (apiKey) {
      apiKey.lastUsedAt = Date.now();
      this.persistAPIKeys();
    }
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(keyId: string): RateLimitStatus | null {
    return this.rateLimits.get(keyId) || null;
  }

  /**
   * Reset rate limits
   */
  resetRateLimits(keyId: string): boolean {
    const apiKey = this.apiKeys.get(keyId);
    if (!apiKey) return false;

    this.initializeRateLimit(keyId, apiKey.rateLimitPerMinute, apiKey.rateLimitPerDay);
    return true;
  }

  // ==================== PRIVATE METHODS ====================

  private generateKey(): string {
    return `kt_${Date.now()}_${Math.random().toString(36).substr(2, 32)}`;
  }

  private hashKey(key: string): string {
    // Simple hash - in production use proper crypto
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private initializeRateLimit(keyId: string, minuteLimit: number, dayLimit: number): void {
    const now = Date.now();
    this.rateLimits.set(keyId, {
      minuteLimit,
      minuteUsed: 0,
      dayLimit,
      dayUsed: 0,
      resetTime: now + 60000,
    });
  }

  private persistAPIKeys(): void {
    try {
      const keys = Array.from(this.apiKeys.values());
      localStorage.setItem(this.storageKey, JSON.stringify(keys));
    } catch (error) {
      console.error('Failed to save API keys:', error);
    }
  }

  private loadAPIKeys(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const keys = JSON.parse(data) as APIKey[];
        keys.forEach(key => {
          this.apiKeys.set(key.id, key);
          this.initializeRateLimit(key.id, key.rateLimitPerMinute, key.rateLimitPerDay);
        });
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  }
}

let apiKeyManager: APIKeyManager | null = null;

export function initializeAPIKeyManager(): APIKeyManager {
  if (!apiKeyManager) {
    apiKeyManager = new APIKeyManager();
  }
  return apiKeyManager;
}

export function getAPIKeyManager(): APIKeyManager {
  if (!apiKeyManager) {
    apiKeyManager = new APIKeyManager();
  }
  return apiKeyManager;
}
