// Performance Module
// Export all performance optimization functionality

export {
  CacheManager,
  getChartCache,
  getReportCache,
  type CacheEntry,
  type CacheStrategy,
} from './CacheManager';

export {
  BundleAnalyzer,
  getBundleAnalyzer,
  type BundleStats,
  type ModuleStats,
} from './BundleAnalyzer';

export {
  ImageOptimizer,
  getImageOptimizer,
  type ImageOptimizationConfig,
} from './ImageOptimizer';

export {
  QueryOptimizer,
  getQueryOptimizer,
  type BatchedRequest,
} from './QueryOptimizer';
