'use client';

import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

interface MobileBottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  items?: NavItem[];
}

export function MobileBottomNavigation({
  activeTab,
  onTabChange,
  items,
}: MobileBottomNavigationProps) {
  // Default navigation items
  const defaultItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'chart', label: 'Chart', icon: '📊' },
    { id: 'dasha', label: 'Dasha', icon: '⏱️' },
    { id: 'transits', label: 'Transits', icon: '🌍' },
    { id: 'menu', label: 'Menu', icon: '☰' },
  ];

  const navItems = items || defaultItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-surface border-t border-line z-40 safe-area-inset-bottom"
      role="tablist"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center h-16 max-w-full overflow-x-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            role="tab"
            aria-selected={activeTab === item.id}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center flex-1 min-w-max px-2 py-2 transition-all duration-200 relative ${
              activeTab === item.id
                ? 'text-saffron border-t-2 border-saffron'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {/* Icon */}
            <div className="text-2xl mb-1 relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className="text-xs font-semibold truncate max-w-[60px]">
              {item.label}
            </span>

            {/* Active indicator */}
            {activeTab === item.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

/**
 * Hook for managing mobile navigation state
 */
export function useMobileNavigation(defaultTab: string = 'home') {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return {
    activeTab,
    setActiveTab,
    handleTabChange: (tabId: string) => setActiveTab(tabId),
  };
}
