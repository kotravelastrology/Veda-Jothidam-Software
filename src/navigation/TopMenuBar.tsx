'use client';

import { useState } from 'react';
import { useNavigation } from './navigationContext';

interface MenuItem {
  label: string;
  key: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  key: string;
  action?: () => void;
}

export function TopMenuBar() {
  const { currentMenu, setCurrentMenu, setBreadcrumb, setSidebarOpen, sidebarOpen } = useNavigation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menus: MenuItem[] = [
    {
      label: 'File',
      key: 'file',
      submenu: [
        { label: 'New Chart', key: 'new' },
        { label: 'Open...', key: 'open' },
        { label: 'Save', key: 'save' },
        { label: 'Save As...', key: 'saveas' },
        { label: '', key: 'divider' },
        { label: 'Print', key: 'print' },
        { label: 'Exit', key: 'exit' },
      ],
    },
    {
      label: 'Edit',
      key: 'edit',
      submenu: [
        { label: 'Birth Data', key: 'birthdata' },
        { label: 'Chart Notes', key: 'notes' },
        { label: 'Events', key: 'events' },
      ],
    },
    {
      label: 'Charts',
      key: 'charts',
      submenu: [
        { label: 'Birth Chart (Rasi)', key: 'rasi' },
        { label: 'Navamsha (D9)', key: 'navamsha' },
        { label: 'Divisional Charts', key: 'divisional' },
        { label: 'Varga Chakra', key: 'varga' },
        { label: 'Sudarshan Chakra', key: 'sudarshan' },
        { label: 'Dasha Charts', key: 'dasha' },
        { label: 'Transit Charts', key: 'transit' },
        { label: 'Ashtakavarga Charts', key: 'ashtakavarga' },
        { label: 'Ephemeris', key: 'ephemeris' },
        { label: 'Rectification', key: 'rectification' },
        { label: 'Composite/Synastry', key: 'composite' },
      ],
    },
    {
      label: 'Reports',
      key: 'reports',
      submenu: [
        { label: 'Horoscope', key: 'horoscope' },
        { label: 'Calculations', key: 'calculations' },
        { label: 'Interpretations', key: 'interpretations' },
        { label: 'Dashas', key: 'dashas' },
        { label: 'Transits', key: 'transits' },
        { label: 'Varshaphala', key: 'varshaphala' },
        { label: 'Compatibility', key: 'compatibility' },
        { label: 'Astronomy', key: 'astronomy' },
      ],
    },
    {
      label: 'Classical References',
      key: 'references',
      submenu: [
        { label: 'BPHS (Brihat Parashara Hora Shastra)', key: 'bphs' },
        { label: 'Saravali', key: 'saravali' },
        { label: 'Hora Sara', key: 'horasara' },
        { label: 'Garga Hora', key: 'gargahora' },
        { label: 'Planetary Significations', key: 'karakas' },
        { label: 'Nakshatra Descriptions', key: 'nakshatras' },
        { label: 'Yogas Dictionary', key: 'yogas' },
      ],
    },
    {
      label: 'Options',
      key: 'options',
      submenu: [
        { label: 'Settings', key: 'settings' },
        { label: 'Chart Style', key: 'chartstyle' },
        { label: 'Colors & Fonts', key: 'colors' },
        { label: 'Language', key: 'language' },
        { label: 'Calculator', key: 'calculator' },
      ],
    },
    {
      label: 'Tools',
      key: 'tools',
      submenu: [
        { label: 'Change Location', key: 'changeloc' },
        { label: 'Change Time', key: 'changetime' },
        { label: 'Chart Notes', key: 'chartnotes' },
        { label: 'Worksheet', key: 'worksheet' },
        { label: 'Chart Navigator', key: 'navigator' },
      ],
    },
    {
      label: 'Windows',
      key: 'windows',
      submenu: [
        { label: 'Cascade', key: 'cascade' },
        { label: 'Tile Horizontally', key: 'tileh' },
        { label: 'Tile Vertically', key: 'tilev' },
      ],
    },
    {
      label: 'Help',
      key: 'help',
      submenu: [
        { label: 'Help Contents', key: 'contents' },
        { label: 'About', key: 'about' },
      ],
    },
  ];

  const handleMenuClick = (menuKey: string) => {
    setCurrentMenu(menuKey as any);
    setBreadcrumb(['Home', menuKey.charAt(0).toUpperCase() + menuKey.slice(1)]);
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  };

  const handleSubmenuClick = (submenuKey: string) => {
    // Handle submenu navigation
    setOpenMenu(null);
  };

  return (
    <>
      {/* Top Menu Bar */}
      <div className="bg-ink text-surface border-b border-ink-soft/20 sticky top-0 z-50">
        <div className="flex items-center h-10 px-4 gap-4">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-ink-soft/10 rounded text-sm font-semibold"
            title="Toggle Sidebar"
          >
            ☰
          </button>

          {/* Logo/Brand */}
          <span className="font-[family-name:var(--font-tamil-serif)] font-bold text-sm text-saffron">
            Kotravel
          </span>

          {/* Menu Items */}
          <div className="flex gap-1 ml-4 flex-1">
            {menus.map((menu) => (
              <div key={menu.key} className="relative group">
                <button
                  onClick={() => handleMenuClick(menu.key)}
                  className={`px-3 py-2 text-sm font-medium rounded hover:bg-ink-soft/10 transition-colors ${
                    currentMenu === menu.key ? 'bg-saffron text-ink' : ''
                  }`}
                >
                  {menu.label}
                </button>

                {/* Dropdown Submenu */}
                {menu.submenu && (
                  <div className="absolute left-0 mt-0 w-48 bg-surface border border-line shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 py-1 z-50">
                    {menu.submenu.map((submenu) =>
                      submenu.key === 'divider' ? (
                        <div key="divider" className="h-px bg-line my-1" />
                      ) : (
                        <button
                          key={submenu.key}
                          onClick={() => handleSubmenuClick(submenu.key)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-saffron/10 text-ink transition-colors"
                        >
                          {submenu.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side: Search/Settings */}
          <div className="flex gap-2 ml-auto">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 text-xs rounded bg-ink-soft/10 border border-ink-soft/20 text-surface placeholder-ink-soft/50 focus:outline-none focus:border-saffron/50 w-40"
            />
            <button className="p-1 hover:bg-ink-soft/10 rounded text-sm">⚙️</button>
          </div>
        </div>
      </div>
    </>
  );
}
