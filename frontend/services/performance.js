/**
 * Performance Service
 *
 * Track and optimize:
 * - Page load metrics (LCP, CLS, FID)
 * - API response times
 * - Memory usage
 * - Resource timing
 */

class PerformanceService {
    constructor() {
        this.metrics = new Map();
        this.timings = new Map();
        this.observers = new Set();
        this.listeners = new Set();
        this.maxMetrics = 100;
    }

    /**
     * Initialize performance monitoring
     */
    init() {
        // Measure Web Vitals
        this.measureWebVitals();

        // Monitor navigation timing
        this.measureNavigationTiming();

        // Monitor resource timing
        this.measureResourceTiming();

        // Monitor performance observer
        this.initPerformanceObserver();

        console.log('Performance monitoring initialized');
    }

    /**
     * Measure Core Web Vitals
     */
    measureWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.recordMetric('LCP', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.add(lcpObserver);
            } catch (error) {
                console.warn('LCP observer not supported:', error);
            }

            // Cumulative Layout Shift (CLS)
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            this.recordMetric('CLS', clsValue);
                        }
                    }
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.add(clsObserver);
            } catch (error) {
                console.warn('CLS observer not supported:', error);
            }

            // First Input Delay (FID) / Interaction to Next Paint (INP)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordMetric('FID', entry.processingDuration);
                    }
                });
                fidObserver.observe({ entryTypes: ['first-input', 'event'] });
                this.observers.add(fidObserver);
            } catch (error) {
                console.warn('FID observer not supported:', error);
            }
        }
    }

    /**
     * Measure navigation timing
     */
    measureNavigationTiming() {
        if ('PerformanceNavigationTiming' in window) {
            const perfData = window.performance.getEntriesByType('navigation')[0];
            if (perfData) {
                this.recordMetric('DNS', perfData.domainLookupEnd - perfData.domainLookupStart);
                this.recordMetric('TCP', perfData.connectEnd - perfData.connectStart);
                this.recordMetric('TTFB', perfData.responseStart - perfData.requestStart);
                this.recordMetric('DOMLoad', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
                this.recordMetric('Load', perfData.loadEventEnd - perfData.loadEventStart);
                this.recordMetric('PageLoad', perfData.loadEventEnd - perfData.fetchStart);
            }
        }
    }

    /**
     * Measure resource timing
     */
    measureResourceTiming() {
        if ('PerformanceResourceTiming' in window) {
            const resources = window.performance.getEntriesByType('resource');
            const timing = {
                total: resources.length,
                byType: {},
                avgDuration: 0,
            };

            let totalDuration = 0;

            resources.forEach(resource => {
                const type = resource.initiatorType || 'other';
                if (!timing.byType[type]) {
                    timing.byType[type] = { count: 0, totalDuration: 0 };
                }
                timing.byType[type].count++;
                timing.byType[type].totalDuration += resource.duration;
                totalDuration += resource.duration;
            });

            timing.avgDuration = resources.length > 0 ? totalDuration / resources.length : 0;
            this.recordMetric('Resources', timing);
        }
    }

    /**
     * Initialize Performance Observer for long tasks
     */
    initPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        console.warn('Long task detected:', entry.duration, 'ms');
                        this.recordMetric('LongTask', entry.duration);
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
                this.observers.add(observer);
            } catch (error) {
                console.warn('Long task observer not supported:', error);
            }
        }
    }

    /**
     * Record timing for operation
     */
    startTimer(label) {
        const start = performance.now();
        return () => {
            const duration = performance.now() - start;
            this.recordTiming(label, duration);
            return duration;
        };
    }

    /**
     * Record metric
     */
    recordMetric(name, value) {
        if (this.metrics.size >= this.maxMetrics) {
            const firstKey = this.metrics.keys().next().value;
            this.metrics.delete(firstKey);
        }

        this.metrics.set(name, {
            name,
            value,
            timestamp: Date.now(),
        });

        this.notifyListeners();
    }

    /**
     * Record timing
     */
    recordTiming(label, duration) {
        if (!this.timings.has(label)) {
            this.timings.set(label, []);
        }

        const timings = this.timings.get(label);
        timings.push({
            duration,
            timestamp: Date.now(),
        });

        // Keep only last 100 entries
        if (timings.length > 100) {
            timings.shift();
        }

        this.notifyListeners();
    }

    /**
     * Get average timing
     */
    getAverageTiming(label) {
        const timings = this.timings.get(label) || [];
        if (timings.length === 0) return 0;

        const sum = timings.reduce((acc, t) => acc + t.duration, 0);
        return sum / timings.length;
    }

    /**
     * Get metric
     */
    getMetric(name) {
        return this.metrics.get(name);
    }

    /**
     * Get all metrics
     */
    getMetrics() {
        return Array.from(this.metrics.values());
    }

    /**
     * Get all timings
     */
    getTimings(label = null) {
        if (label) {
            return this.timings.get(label) || [];
        }
        return Object.fromEntries(this.timings);
    }

    /**
     * Get performance summary
     */
    getSummary() {
        return {
            metrics: this.getMetrics(),
            webVitals: {
                LCP: this.metrics.get('LCP')?.value,
                CLS: this.metrics.get('CLS')?.value,
                FID: this.metrics.get('FID')?.value,
            },
            timings: {
                DNS: this.metrics.get('DNS')?.value,
                TCP: this.metrics.get('TCP')?.value,
                TTFB: this.metrics.get('TTFB')?.value,
                PageLoad: this.metrics.get('PageLoad')?.value,
            },
            resources: this.metrics.get('Resources')?.value,
        };
    }

    /**
     * Report metrics to analytics
     */
    reportMetrics(endpoint = '/api/metrics') {
        const summary = this.getSummary();

        // Send asynchronously
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(summary),
            keepalive: true, // Send even if page unloads
        }).catch(error => {
            console.warn('Failed to report metrics:', error);
        });
    }

    /**
     * Subscribe to changes
     */
    subscribe(listener) {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Notify listeners
     */
    notifyListeners() {
        const summary = this.getSummary();
        this.listeners.forEach(listener => {
            try {
                listener(summary);
            } catch (error) {
                console.error('Error in performance listener:', error);
            }
        });
    }

    /**
     * Clean up observers
     */
    destroy() {
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                console.warn('Error disconnecting observer:', error);
            }
        });
        this.observers.clear();
        this.listeners.clear();
    }
}

// Create singleton instance
const performanceService = new PerformanceService();

// Initialize on load
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            performanceService.init();
        });
    } else {
        performanceService.init();
    }
}

// Report metrics before page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        performanceService.reportMetrics();
    });
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = performanceService;
}
