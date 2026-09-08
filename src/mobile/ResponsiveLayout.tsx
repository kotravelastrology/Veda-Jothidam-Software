'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  topBar?: ReactNode;
  bottomNav?: ReactNode;
  isMobile?: boolean;
}

interface ViewportSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Mobile-first responsive layout wrapper
 * Handles safe areas, viewport sizing, and adaptive layouts
 */
export function ResponsiveLayout({
  children,
  showBottomNav = true,
  topBar,
  bottomNav,
  isMobile: forceMobile,
}: ResponsiveLayoutProps) {
  const [viewport, setViewport] = useState<ViewportSize>({
    width: 0,
    height: 0,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  });

  const [isClient, setIsClient] = useState(false);

  // Detect viewport size on client
  useEffect(() => {
    setIsClient(true);

    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Breakpoints: mobile < 768, tablet 768-1024, desktop > 1024
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      setViewport({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
      });
    };

    // Initial calculation
    updateViewport();

    // Listen for resize
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  const isMobileView = forceMobile ?? viewport.isMobile;

  if (!isClient) {
    return <div className="bg-surface-soft">{children}</div>;
  }

  return (
    <div
      className="flex flex-col h-screen w-screen bg-surface-soft overflow-hidden"
      data-viewport={isMobileView ? 'mobile' : viewport.isTablet ? 'tablet' : 'desktop'}
    >
      {/* Top Bar */}
      {topBar && <div className="flex-shrink-0">{topBar}</div>}

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto overflow-x-hidden ${
          showBottomNav && isMobileView ? 'pb-20' : ''
        }`}
        style={{
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        }}
      >
        <div className="w-full h-full">
          {isMobileView ? (
            // Mobile-optimized layout
            <div className="px-4 py-4 pb-8 max-w-full">
              {children}
            </div>
          ) : viewport.isTablet ? (
            // Tablet-optimized layout
            <div className="px-6 py-6 max-w-4xl mx-auto">
              {children}
            </div>
          ) : (
            // Desktop layout
            <div className="px-8 py-8 max-w-6xl mx-auto">
              {children}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && isMobileView && bottomNav && (
        <div className="flex-shrink-0">{bottomNav}</div>
      )}

      {/* Safe area for notch devices */}
      {isMobileView && (
        <div
          className="pointer-events-none h-safe-bottom"
          style={{ height: 'env(safe-area-inset-bottom)' }}
        ></div>
      )}
    </div>
  );
}

/**
 * Hook for accessing viewport information
 */
export function useViewport(): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>({
    width: 0,
    height: 0,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      setViewport({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
      });
    };

    updateViewport();

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
}

/**
 * Utility for safe area calculations
 */
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const getSafeAreaInsets = () => {
      const root = document.documentElement;
      return {
        top: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-top')) || 0,
        bottom: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-bottom')) || 0,
        left: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-left')) || 0,
        right: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-right')) || 0,
      };
    };

    setInsets(getSafeAreaInsets());

    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => setInsets(getSafeAreaInsets()), 100);
    });

    return () => {
      window.removeEventListener('orientationchange', () => {});
    };
  }, []);

  return insets;
}

/**
 * Container for mobile-safe spacing
 */
export function MobileSafeContainer({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <div
      style={{
        paddingTop: `${insets.top}px`,
        paddingBottom: `${insets.bottom}px`,
        paddingLeft: `${insets.left}px`,
        paddingRight: `${insets.right}px`,
      }}
    >
      {children}
    </div>
  );
}
