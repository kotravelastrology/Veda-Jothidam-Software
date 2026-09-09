// Query Optimizer
// Optimizes data fetching, batching, and computation-heavy operations

export interface BatchedRequest<T> {
  id: string;
  resolve: (value: T) => void;
  reject: (error: any) => void;
}

/**
 * Query Optimizer
 * Batches requests, memoizes expensive calculations, debounces queries
 */
export class QueryOptimizer {
  private pendingBatches: Map<string, BatchedRequest<any>[]> = new Map();
  private batchTimers: Map<string, NodeJS.Timeout> = new Map();
  private memoCache: Map<string, { value: any; timestamp: number }> = new Map();
  private batchDelayMs = 50;
  private memoTTLMs = 60000;

  /**
   * Batch multiple requests into a single call
   */
  batchRequest<T>(
    batchKey: string,
    requestId: string,
    executor: (ids: string[]) => Promise<Record<string, T>>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.pendingBatches.has(batchKey)) {
        this.pendingBatches.set(batchKey, []);
      }

      this.pendingBatches.get(batchKey)!.push({ id: requestId, resolve, reject });

      if (this.batchTimers.has(batchKey)) {
        clearTimeout(this.batchTimers.get(batchKey));
      }

      const timer = setTimeout(async () => {
        const batch = this.pendingBatches.get(batchKey) || [];
        this.pendingBatches.delete(batchKey);
        this.batchTimers.delete(batchKey);

        const ids = batch.map(b => b.id);
        try {
          const results = await executor(ids);
          batch.forEach(req => {
            if (results[req.id] !== undefined) {
              req.resolve(results[req.id]);
            } else {
              req.reject(new Error(`No result for ${req.id}`));
            }
          });
        } catch (error) {
          batch.forEach(req => req.reject(error));
        }
      }, this.batchDelayMs);

      this.batchTimers.set(batchKey, timer);
    });
  }

  /**
   * Memoize expensive calculation with TTL
   */
  memoize<T>(key: string, calculator: () => T): T {
    const cached = this.memoCache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.memoTTLMs) {
      return cached.value;
    }

    const value = calculator();
    this.memoCache.set(key, { value, timestamp: now });
    return value;
  }

  /**
   * Memoize async calculation
   */
  async memoizeAsync<T>(key: string, calculator: () => Promise<T>): Promise<T> {
    const cached = this.memoCache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.memoTTLMs) {
      return cached.value;
    }

    const value = await calculator();
    this.memoCache.set(key, { value, timestamp: now });
    return value;
  }

  /**
   * Debounce function calls
   */
  debounce<F extends (...args: any[]) => any>(
    func: F,
    delayMs: number
  ): (...args: Parameters<F>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delayMs);
    };
  }

  /**
   * Throttle function calls
   */
  throttle<F extends (...args: any[]) => any>(
    func: F,
    limitMs: number
  ): (...args: Parameters<F>) => void {
    let inThrottle = false;
    return (...args: Parameters<F>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limitMs);
      }
    };
  }

  /**
   * Clear memoization cache
   */
  clearMemoCache(keyPrefix?: string): void {
    if (keyPrefix) {
      Array.from(this.memoCache.keys())
        .filter(k => k.startsWith(keyPrefix))
        .forEach(k => this.memoCache.delete(k));
    } else {
      this.memoCache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { totalEntries: number; expiredEntries: number } {
    const now = Date.now();
    let expired = 0;

    this.memoCache.forEach(entry => {
      if ((now - entry.timestamp) >= this.memoTTLMs) {
        expired++;
      }
    });

    return {
      totalEntries: this.memoCache.size,
      expiredEntries: expired,
    };
  }

  /**
   * Prefetch data for anticipated navigation
   */
  async prefetch<T>(key: string, fetcher: () => Promise<T>): Promise<void> {
    if (!this.memoCache.has(key)) {
      try {
        const value = await fetcher();
        this.memoCache.set(key, { value, timestamp: Date.now() });
      } catch (e) {
        console.warn(`Prefetch failed for ${key}:`, e);
      }
    }
  }
}

let queryOptimizer: QueryOptimizer | null = null;

export function getQueryOptimizer(): QueryOptimizer {
  if (!queryOptimizer) {
    queryOptimizer = new QueryOptimizer();
  }
  return queryOptimizer;
}
