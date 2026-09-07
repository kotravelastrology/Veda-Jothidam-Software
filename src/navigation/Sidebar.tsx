'use client';

import Link from 'next/link';
import { useNavigation, ChartType, ReportType } from './navigationContext';

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
  const { sidebarOpen, setSidebarOpen, currentMenu, setCurrentMenu, setCurrentChart, setCurrentReport, setBreadcrumb } =
    useNavigation();

  const chartSections: SidebarSection[] = [
    {
      title: 'Standard Charts',
      items: [
        { label: 'Birth Chart (Rasi)', icon: '📊', action: () => setCurrentChart('rasi' as ChartType) },
        { label: 'Navamsha (D9)', icon: '📈', action: () => setCurrentChart('navamsha' as ChartType) },
        { label: 'Drekkana (D3)', icon: '🔷', action: () => setCurrentChart('d3' as ChartType) },
      ],
    },
    {
      title: 'Divisional Charts (Vargas)',
      items: [
        { label: 'D2 (Hora)', icon: '💰', action: () => setCurrentChart('d2' as ChartType) },
        { label: 'D4 (Chatushpad)', icon: '🏠', action: () => setCurrentChart('d4' as ChartType) },
        { label: 'D5 (Panchamsa)', icon: '👶', action: () => setCurrentChart('d5' as ChartType) },
        { label: 'D7 (Saptamsa)', icon: '👨‍👩‍👧‍👦', action: () => setCurrentChart('d7' as ChartType) },
        { label: 'D10 (Dasamsa)', icon: '💼', action: () => setCurrentChart('d10' as ChartType) },
        { label: 'D12 (Dwadasamsa)', icon: '👴', action: () => setCurrentChart('d12' as ChartType) },
      ],
    },
    {
      title: 'Analysis Charts',
      items: [
        { label: 'Sudarshan Chakra', icon: '🌀', action: () => setCurrentChart('sudarshan' as ChartType) },
        { label: 'Transits (Gochara)', icon: '🔄', action: () => setCurrentChart('transit' as ChartType) },
        { label: 'Ashtakavarga', icon: '📉', action: () => setCurrentChart('ashtakavarga' as ChartType) },
        { label: 'Ephemeris', icon: '📋', action: () => setCurrentChart('ephemeris' as ChartType) },
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
