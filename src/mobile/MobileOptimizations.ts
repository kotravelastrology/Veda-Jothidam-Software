// Mobile Performance Optimizations and Utilities

/**
 * Detect device type and capabilities
 */
export const DeviceDetection = {
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    return /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  isTablet: (): boolean => {
    if (typeof window === 'undefined') return false;
    return /(iPad|Android(?!.*Mobile)|Tablet)/i.test(navigator.userAgent);
  },

  isIOS: (): boolean => {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },

  isAndroid: (): boolean => {
    if (typeof window === 'undefined') return false;
    return /Android/i.test(navigator.userAgent);
  },

  hasNotchSupport: (): boolean => {
    if (typeof window === 'undefined') return false;
    return CSS.supports('padding: max(0px)');
  },

  supportsWebP: (): Promise<boolean> => {
    return new Promise(resolve => {
      const webp = new Image();
      webp.onload = webp.onerror = () => resolve(webp.height === 2);
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAAA';
    });
  },

  supportsWebGL: (): boolean => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  },

  getNetworkStatus: (): 'fast' | 'slow' | '4g' | '3g' | 'unknown' => {
    if (typeof navigator === 'undefined') return 'unknown';
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!connection) return 'unknown';

    const effectiveType = connection.effectiveType;
    if (effectiveType === '4g') return '4g';
    if (effectiveType === '3g') return '3g';
    if (effectiveType === '2g') return 'slow';
    return effectiveType === '4g' ? 'fast' : 'slow';
  },
};

/**
 * Performance optimization utilities
 */
export const PerformanceOptimization = {
  // Debounce function for scroll/resize events
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  // Throttle function for frequent events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let lastRun = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun >= limit) {
        func(...args);
        lastRun = now;
      }
    };
  },

  // RequestAnimationFrame wrapper
  rafThrottle: <T extends (...args: any[]) => any>(
    func: T
  ): ((...args: Parameters<T>) => void) => {
    let rafId: number | null = null;
    return (...args: Parameters<T>) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    };
  },

  // Lazy load images
  lazyLoadImage: (element: HTMLImageElement, src: string) => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            element.src = src;
            element.classList.add('loaded');
            obs.unobserve(element);
          }
        });
      });
      observer.observe(element);
    } else {
      // Fallback for older browsers
      element.src = src;
    }
  },

  // Batch DOM updates
  batchDOMUpdates: (updates: (() => void)[]) => {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  },
};

/**
 * Storage optimization for mobile
 */
export const MobileStorage = {
  // Set item with size limit
  setItem: (key: string, value: string, maxSize: number = 5242880): boolean => {
    try {
      if (localStorage.length * 1024 > maxSize) {
        // Clear old data if approaching limit
        localStorage.clear();
      }
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('LocalStorage quota exceeded');
      return false;
    }
  },

  // Get item safely
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },

  // Clear old cached data
  clearOldCache: (maxAge: number = 7 * 24 * 60 * 60 * 1000) => {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('_cached_')) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const { timestamp } = JSON.parse(item);
            if (now - timestamp > maxAge) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Skip invalid entries
          }
        }
      }
    }
  },
};

/**
 * Safe area calculations for notch devices
 */
export const SafeArea = {
  // Get safe area insets
  getInsets: (): { top: number; bottom: number; left: number; right: number } => {
    if (typeof window === 'undefined') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    return {
      top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top')) || 0,
      bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom')) || 0,
      left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left')) || 0,
      right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right')) || 0,
    };
  },

  // Apply safe area padding to element
  applySafeAreaPadding: (element: HTMLElement) => {
    const insets = SafeArea.getInsets();
    element.style.paddingTop = `${insets.top}px`;
    element.style.paddingBottom = `${insets.bottom}px`;
    element.style.paddingLeft = `${insets.left}px`;
    element.style.paddingRight = `${insets.right}px`;
  },
};

/**
 * Haptic feedback for mobile interactions
 */
export const Haptics = {
  vibrate: (duration: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      (navigator as any).vibrate(duration);
    }
  },

  tap: () => {
    Haptics.vibrate(10);
  },

  impact: () => {
    Haptics.vibrate(20);
  },

  success: () => {
    Haptics.vibrate([10, 10, 10]);
  },

  error: () => {
    Haptics.vibrate([20, 10, 20]);
  },
};

/**
 * Orientation and fullscreen utilities
 */
export const ScreenUtilities = {
  // Request fullscreen
  requestFullscreen: (element: HTMLElement = document.documentElement) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      (element as any).mozRequestFullScreen();
    }
  },

  // Exit fullscreen
  exitFullscreen: () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    }
  },

  // Lock orientation
  lockOrientation: (orientation: 'portrait' | 'landscape') => {
    if (screen.orientation && (screen.orientation as any).lock) {
      (screen.orientation as any).lock(orientation).catch(() => {
        console.warn('Screen orientation lock not supported');
      });
    }
  },

  // Get screen orientation
  getOrientation: (): 'portrait' | 'landscape' => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  },

  // Prevent sleep
  preventSleep: async () => {
    if ('wakeLock' in navigator) {
      try {
        const wakeLock = await (navigator as any).wakeLock.request('screen');
        return wakeLock;
      } catch (e) {
        console.warn('Wake lock not available');
      }
    }
  },
};

/**
 * Accessibility utilities for mobile
 */
export const A11yMobile = {
  // Announce to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  // Ensure touch targets are at least 44x44px
  validateTouchTarget: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  },

  // Set focus management for mobile
  setFocusManagement: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    container.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },
};
