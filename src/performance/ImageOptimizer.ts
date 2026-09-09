// Image Optimizer
// Handles image lazy loading, compression, and format optimization

export interface ImageOptimizationConfig {
  quality: number; // 0-100
  format: 'webp' | 'avif' | 'jpeg' | 'png' | 'auto';
  maxWidth?: number;
  maxHeight?: number;
  lazyLoad: boolean;
}

/**
 * Image Optimizer
 * Optimizes images for performance
 */
export class ImageOptimizer {
  private observedImages: Set<HTMLImageElement> = new Set();
  private intersectionObserver: IntersectionObserver | null = null;

  constructor() {
    this.setupLazyLoading();
  }

  /**
   * Setup Intersection Observer for lazy loading
   */
  private setupLazyLoading(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.intersectionObserver?.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );
  }

  /**
   * Register image for lazy loading
   */
  observeImage(img: HTMLImageElement): void {
    if (this.intersectionObserver && !this.observedImages.has(img)) {
      this.observedImages.add(img);
      this.intersectionObserver.observe(img);
    }
  }

  /**
   * Get optimal image format based on browser support
   */
  getOptimalFormat(): 'webp' | 'avif' | 'jpeg' {
    if (typeof window === 'undefined') return 'jpeg';

    const canvas = document.createElement('canvas');
    if (canvas.toDataURL('image/avif').indexOf('image/avif') === 5) {
      return 'avif';
    }
    if (canvas.toDataURL('image/webp').indexOf('image/webp') === 5) {
      return 'webp';
    }
    return 'jpeg';
  }

  /**
   * Generate responsive image srcset
   */
  generateSrcSet(baseUrl: string, widths: number[]): string {
    return widths
      .map(width => `${baseUrl}?w=${width} ${width}w`)
      .join(', ');
  }

  /**
   * Calculate optimal image dimensions
   */
  calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    containerWidth: number,
    devicePixelRatio: number = 1
  ): { width: number; height: number } {
    const aspectRatio = originalHeight / originalWidth;
    const targetWidth = Math.min(originalWidth, containerWidth * devicePixelRatio);
    const targetHeight = Math.round(targetWidth * aspectRatio);

    return { width: targetWidth, height: targetHeight };
  }

  /**
   * Preload critical images
   */
  preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Get image compression estimate
   */
  estimateCompressionSavings(originalSizeKB: number, format: string): number {
    const compressionRatios: Record<string, number> = {
      webp: 0.65,
      avif: 0.5,
      jpeg: 0.8,
      png: 0.9,
    };

    const ratio = compressionRatios[format] || 0.8;
    return originalSizeKB * (1 - ratio);
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }

  /**
   * Cleanup observer
   */
  disconnect(): void {
    this.intersectionObserver?.disconnect();
    this.observedImages.clear();
  }
}

let imageOptimizer: ImageOptimizer | null = null;

export function getImageOptimizer(): ImageOptimizer {
  if (!imageOptimizer) {
    imageOptimizer = new ImageOptimizer();
  }
  return imageOptimizer;
}
