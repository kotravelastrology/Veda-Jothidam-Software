'use client';

import Link from 'next/link';
import { useNavigation, ReportType } from './navigationContext';

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarItem {
  label: string;
  href?: string;
  action?: () => void;
  icon?: string;
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, currentMenu, setCurrentMenu, setCurrentReport, setBreadcrumb } =
    useNavigation();

  // Every href below is a real chart id from src/charts/chartTypes.ts, deep-linking
  // to /report's own chart-type selector (ReportBuilder.tsx reads ?chart= on mount).
  // Previously these were `action: () => setCurrentChart(...)` writing into
  // navigationContext's currentChart — a value nothing in the app ever reads, so
  // every click here was a dead no-op (and 'd5' / Panchamsa isn't a real chart at
  // all). Kept as a curated subset — same shape TopMenuBar's own Charts submenu
  // uses — rather than the full ~25-entry catalog, which /report's own selector
  // already lists in full.
  const chartSections: SidebarSection[] = [
    {
      title: 'Standard Charts',
      items: [
        { label: 'Birth Chart (Rasi)', icon: '📊', href: '/report?chart=D1-rasi' },
        { label: 'Navamsha (D9)', icon: '📈', href: '/report?chart=D9-navamsha' },
        { label: 'Drekkana (D3)', icon: '🔷', href: '/report?chart=D3-drekkana' },
      ],
    },
    {
      title: 'Divisional Charts (Vargas)',
      items: [
        { label: 'D2 (Hora)', icon: '💰', href: '/report?chart=D2-hora' },
        { label: 'D4 (Chaturthamsha)', icon: '🏠', href: '/report?chart=D4-chaturthamsha' },
        { label: 'D7 (Saptamsha)', icon: '👨‍👩‍👧‍👦', href: '/report?chart=D7-saptamsha' },
        { label: 'D10 (Dasamsha)', icon: '💼', href: '/report?chart=D10-dasamsha' },
        { label: 'D12 (Dwadashamsha)', icon: '👴', href: '/report?chart=D12-dwadashamsha' },
        { label: 'Varga Chakra (16-in-1)', icon: '🔄', href: '/report?chart=varga-chakra' },
      ],
    },
    {
      title: 'Analysis Charts',
      items: [
        { label: 'Sudarshan Chakra', icon: '🌀', href: '/report?chart=sudarshan-chakra' },
        { label: 'Transits (Gochara)', icon: '🔄', href: '/report?chart=transit' },
        { label: 'Ashtakavarga', icon: '📉', href: '/report?chart=ashtakavarga' },
        { label: 'Shadbala', icon: '💪', href: '/report?chart=shadbala' },
        { label: 'Yogas & Doshas', icon: '🌟', href: '/report?chart=yogas' },
        { label: 'Ephemeris', icon: '📋', href: '/report?chart=ephemeris' },
      ],
    },
  ];

  const reportSections: SidebarSection[] = [
    {
      title: 'Basic Reports',
      items: [
        { label: 'Shadbala (Planetary Strength)', icon: '💪', action: () => setCurrentReport('shadbala' as ReportType) },
        { label: 'Ashtakavarga (Bindu Analysis)', icon: '📊', action: () => setCurrentReport('ashtakavarga' as ReportType) },
        { label: 'Karakas (Significators)', icon: '🎯', action: () => setCurrentReport('karakas' as ReportType) },
      ],
    },
    {
      title: 'Advanced Analysis',
      items: [
        { label: 'Dasha Timeline', icon: '⏱️', action: () => setCurrentReport('dasha' as ReportType) },
        { label: 'Transit Analysis', icon: '🔄', action: () => setCurrentReport('transit' as ReportType) },
        { label: 'Varshaphala (Annual)', icon: '📅', action: () => setCurrentReport('varshaphala' as ReportType) },
      ],
    },
    {
      title: 'Special Reports',
      items: [
        { label: 'Horoscope', icon: '📖', action: () => setCurrentReport('horoscope' as ReportType) },
        { label: 'Yogas (Combinations)', icon: '✨', action: () => setCurrentReport('yogas' as ReportType) },
        { label: 'Compatibility', icon: '💕', action: () => setCurrentReport('compatibility' as ReportType) },
      ],
    },
  ];

  const toolSections: SidebarSection[] = [
    {
      title: 'Chart Tools',
      items: [
        { label: 'Change Location', icon: '📍', href: '/tools/location' },
        { label: 'Change Time', icon: '⏰', href: '/tools/time' },
        { label: 'Rectification', icon: '🔍', href: '/tools/rectification' },
      ],
    },
    {
      title: 'Reference Tools',
      items: [
        { label: 'Yoga Dictionary', icon: '📚', href: '/reference/yogas' },
        { label: 'Nakshatra Info', icon: '⭐', href: '/reference/nakshatras' },
        { label: 'Karana Meanings', icon: '📖', href: '/reference/karanas' },
      ],
    },
  ];

  let sections: SidebarSection[] = [];
  if (currentMenu === 'charts') sections = chartSections;
  else if (currentMenu === 'reports') sections = reportSections;
  else if (currentMenu === 'tools') sections = toolSections;

  return (
    <>
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 md:hidden z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 bg-surface border-r border-line h-[calc(100vh-40px)] overflow-y-auto transform transition-transform duration-200 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4">
          {/* Quick Actions */}
          <div className="mb-6 space-y-2">
            <button className="w-full px-4 py-2 bg-saffron text-ink rounded-lg font-semibold text-sm hover:bg-saffron/90 transition-colors">
              ➕ New Chart
            </button>
            <Link
              href="/report"
              className="block w-full px-4 py-2 bg-ink text-surface rounded-lg font-semibold text-sm hover:bg-ink/90 transition-colors text-center"
            >
              📊 Generate Report
            </Link>
          </div>

          {/* Navigation Sections */}
          {sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wide mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-saffron/10 text-sm transition-colors text-ink hover:text-saffron"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={item.action}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-saffron/10 text-sm transition-colors text-ink hover:text-saffron text-left"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-ink-soft">
              <p className="text-sm">Select a menu item above</p>
            </div>
          )}

          {/* Bottom Links */}
          <div className="border-t border-line pt-4 mt-6 space-y-2">
            <Link href="/" className="block px-3 py-2 rounded hover:bg-ink/5 text-sm text-ink">
              🏠 Home
            </Link>
            <Link href="/settings" className="block px-3 py-2 rounded hover:bg-ink/5 text-sm text-ink">
              ⚙️ Settings
            </Link>
            <Link href="/help" className="block px-3 py-2 rounded hover:bg-ink/5 text-sm text-ink">
              ❓ Help
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
