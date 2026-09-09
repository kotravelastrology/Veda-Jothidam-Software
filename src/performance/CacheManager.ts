// Cache Manager
// Implements multi-level caching strategies

export interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: number;
  createdAt: number;
  hits: number;
}

export type CacheStrategy = 'memory' | 'localStorage' | 'indexedDB' | 'hybrid';

/**
 * Cache Manager
 * Handles in-memory, local storage, and IndexedDB caching
 */
export class CacheManager<T> {
  private memoryCache: Map<string, CacheEntry<T>> = new Map();
  private strategy: CacheStrategy;
  private ttl: number; // milliseconds
  private maxSize: number;

  constructor(strategy: CacheStrategy = 'hybrid', ttlSeconds: number = 3600) {
    this.strategy = strategy;
    this.ttl = ttlSeconds * 1000;
    this.maxSize = 100;
    this.cleanupExpired();
  }

  /**
   * Set cache entry
   */
  set(key: string, value: T): void {
    const entry: CacheEntry<T> = {
      key,
      value,
      expiresAt: Date.now() + this.ttl,
      createdAt: Date.now(),
      hits: 0,
    };

    this.memoryCache.set(key, entry);

    if (this.memoryCache.size > this.maxSize) {
      this.evictLRU();
    }

    if (this.strategy === 'localStorage' || this.strategy === 'hybrid') {
      try {
        localStorage.setItem(`cache:${key}`, JSON.stringify(entry));
      } catch (e) {
        console.warn('LocalStorage cache write failed');
      }
    }
  }

  /**
   * Get cache entry
   */
  get(key: string): T | null {
    let entry: CacheEntry<T> | undefined = this.memoryCache.get(key);

    if (!entry && (this.strategy === 'localStorage' || this.strategy === 'hybrid')) {
      try {
        const stored = localStorage.getItem(`cache:${key}`);
        if (stored) {
          const parsed: CacheEntry<T> = JSON.parse(stored);
          entry = parsed;
          this.memoryCache.set(key, parsed);
        }
      } catch (e) {
        console.warn('LocalStorage cache read failed');
      }
    }

    if (!entry || entry.expiresAt < Date.now()) {
      this.delete(key);
      return null;
    }

    entry.hits++;
    return entry.value;
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    if (this.strategy === 'localStorage' || this.strategy === 'hybrid') {
      localStorage.removeItem(`cache:${key}`);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear();
    if (this.strategy === 'localStorage' || this.strategy === 'hybrid') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache:')) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; hitRate: number; avgHits: number } {
    const entries = Array.from(this.memoryCache.values());
    const totalHits = entries.reduce((sum, e) => sum + e.hits, 0);
    return {
      size: entries.length,
      hitRate: totalHits > 0 ? totalHits / entries.length : 0,
      avgHits: entries.length > 0 ? totalHits / entries.length : 0,
    };
  }

  // ==================== PRIVATE METHODS ====================

  private evictLRU(): void {
    let lruEntry: CacheEntry<T> | null = null;
    let minHits = Infinity;

    this.memoryCache.forEach(entry => {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        lruEntry = entry;
      }
    });

    const evicted = lruEntry as CacheEntry<T> | null;
    if (evicted) {
      this.delete(evicted.key);
    }
  }

  private cleanupExpired(): void {
    const now = Date.now();
    this.memoryCache.forEach((entry, key) => {
      if (entry.expiresAt < now) {
        this.delete(key);
      }
    });
  }
}

let chartCache: CacheManager<any> | null = null;
let reportCache: CacheManager<any> | null = null;

export function getChartCache(): CacheManager<any> {
  if (!chartCache) {
    chartCache = new CacheManager('hybrid', 300); // 5 min
  }
  return chartCache;
}

export function getReportCache(): CacheManager<any> {
  if (!reportCache) {
    reportCache = new CacheManager('hybrid', 600); // 10 min
  }
  return reportCache;
}
