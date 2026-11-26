'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from './navigationContext';
import { BOTTOM_NAV, isActiveTab } from './bottomNavItems';

/**
 * The phone's navigation: five fixed tabs under the thumb (home, the worksheet, the dasha, the calendar and the ☰ menu with every
 * page). It is shown below the `md` width only; on a larger screen the menus, the toolbar and the status bar do this job.
 * The bar keeps clear of the home indicator (`env(safe-area-inset-bottom)`), is hidden when printing, and marks the current tab
 * with `aria-current` as well as colour.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useNavigation();

  const tab = 'relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 pt-1.5 pb-1 text-[11px] leading-tight transition-colors';
  return (
    <nav
      aria-label="முதன்மை வழிசெலுத்தல்"
      data-testid="bottom-nav"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_-8px_rgb(43_27_18/0.25)] backdrop-blur md:hidden print:hidden"
    >
      {BOTTOM_NAV.map((t) => {
        const active = isActiveTab(t.route, pathname);
        return (
          <Link
            key={t.key}
            href={t.route}
            aria-current={active ? 'page' : undefined}
            className={`${tab} ${active ? 'font-semibold text-saffron' : 'text-ink-soft active:text-ink'}`}
          >
            {active && <span aria-hidden className="absolute inset-x-4 top-0 h-0.5 rounded-b bg-saffron" />}
            <span aria-hidden className="text-xl leading-none">{t.icon}</span>
            <span>{t.ta}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-expanded={sidebarOpen}
        aria-label="மெனுவைத் திற"
        className={`${tab} ${sidebarOpen ? 'font-semibold text-saffron' : 'text-ink-soft active:text-ink'}`}
      >
        <span aria-hidden className="text-xl leading-none">☰</span>
        <span>மெனு</span>
      </button>
    </nav>
  );
}
