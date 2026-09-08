'use client';

import { useState, useCallback } from 'react';
import { useNavigation } from './navigationContext';
import { useUIManager } from '../ui/useUIManager';
import { SettingsPanel } from '../ui/SettingsPanel';
import { ToolsPanel } from '../ui/ToolsPanel';
import { HelpPanel } from '../ui/HelpPanel';
import { useKeyboardShortcuts } from '../ui/useKeyboardShortcuts';

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
  const [uiState, uiActions] = useUIManager();

  const menus: MenuItem[] = [
    {
      label: 'File',
      key: 'file',
      submenu: [
        { label: 'New Chart', key: 'new' },
        { label: 'Open...', key: 'open' },
        { label: 'Recent Charts', key: 'recent' },
        { label: '', key: 'divider1' },
        { label: 'Save', key: 'save' },
        { label: 'Save As...', key: 'saveas' },
        { label: '', key: 'divider2' },
        { label: 'Export', key: 'export_submenu' },
        { label: 'Print', key: 'print' },
        { label: '', key: 'divider3' },
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
        { label: '', key: 'divider' },
        { label: 'Preferences', key: 'preferences' },
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
        { label: 'Location Finder', key: 'changeloc' },
        { label: 'Time Zone Converter', key: 'changetime' },
        { label: 'Ayanamsha Calculator', key: 'ayanamsha' },
        { label: 'Date Converter', key: 'dateconverter' },
        { label: '', key: 'divider1' },
        { label: 'Muhurta Finder', key: 'muhurta' },
        { label: 'Transit Finder', key: 'transit_finder' },
        { label: 'Rectification Tool', key: 'rectification_tool' },
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
        { label: 'Keyboard Shortcuts', key: 'shortcuts' },
        { label: 'About', key: 'about' },
        { label: '', key: 'divider' },
        { label: 'Contact Support', key: 'contact' },
      ],
    },
  ];

  const handleMenuClick = (menuKey: string) => {
    setCurrentMenu(menuKey as any);
    setBreadcrumb(['Home', menuKey.charAt(0).toUpperCase() + menuKey.slice(1)]);
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  };

  const handleSubmenuClick = useCallback((submenuKey: string) => {
    setOpenMenu(null);

    switch (submenuKey) {
      // File Menu
      case 'new':
        // Navigate to home to start new chart
        break;
      case 'open':
        // Handle: Open Chart dialog
        alert('Open Chart - Coming in Phase 31.1');
        break;
      case 'recent':
        // Handle: Recent Charts menu
        alert('Recent Charts - Coming in Phase 31.1');
        break;
      case 'save':
        // Handle: Save Chart
        alert('Save Chart - Coming in Phase 31.1');
        break;
      case 'saveas':
        // Handle: Save As dialog
        alert('Save As - Coming in Phase 31.1');
        break;
      case 'export_submenu':
        // Handle: Export submenu (PDF, PNG, SVG, Excel)
        alert('Export options - Coming in Phase 34');
        break;
      case 'print':
        // Handle: Print Chart
        window.print();
        break;
      case 'exit':
        // Handle: Exit application
        if (confirm('Exit Kotravel?')) {
          window.close();
        }
        break;

      // Edit Menu
      case 'birthdata':
        // Open birth data form - Coming in Phase 31.2
        alert('Birth Data Editor - Coming in Phase 31.2');
        break;
      case 'notes':
        alert('Chart Notes - Coming in Phase 31.2');
        break;
      case 'events':
        alert('Events - Coming in Phase 31.2');
        break;
      case 'preferences':
        uiActions.openSettings();
        break;

      // Settings/Options
      case 'settings':
        uiActions.openSettings();
        break;
      case 'preferences':
        uiActions.openSettings();
        break;

      // Help Menu
      case 'contents':
        uiActions.openHelp('help');
        break;
      case 'shortcuts':
        uiActions.openHelp('shortcuts');
        break;
      case 'about':
        uiActions.openHelp('about');
        break;
      case 'contact':
        // Handle: Contact Support
        alert('Support contact: gvkotravel@gmail.com');
        break;

      // Tools Menu
      case 'changeloc':
      case 'changetime':
      case 'ayanamsha':
      case 'dateconverter':
        uiActions.openTools();
        break;
      case 'muhurta':
        alert('Muhurta Finder - Coming in Phase 35');
        break;
      case 'transit_finder':
        alert('Transit Finder - Coming in Phase 35');
        break;
      case 'rectification_tool':
        alert('Rectification Tool - Coming in Phase 35');
        break;

      // Windows Menu
      case 'cascade':
        uiActions.setWindowLayout('cascade');
        break;
      case 'tileh':
      case 'tilev':
        uiActions.setWindowLayout('tile');
        break;

      default:
        break;
    }
  }, [uiActions, setCurrentMenu]);

  useKeyboardShortcuts({
    onSettings: uiActions.openSettings,
    onTools: uiActions.openTools,
    onHelp: () => uiActions.openHelp('help'),
    onClose: uiActions.closeAllPanels,
  });

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
                  <div className="absolute left-0 mt-0 w-56 bg-surface border border-line shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 py-1 z-50">
                    {menu.submenu.map((submenu) =>
                      submenu.key === 'divider' ? (
                        <div key="divider" className="h-px bg-line my-1" />
                      ) : (
                        <button
                          key={submenu.key}
                          onClick={() => handleSubmenuClick(submenu.key)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-saffron/10 text-ink transition-colors"
                        >
                          <span>{submenu.label}</span>
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side: Quick Actions */}
          <div className="flex gap-2 ml-auto">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 text-xs rounded bg-ink-soft/10 border border-ink-soft/20 text-surface placeholder-ink-soft/50 focus:outline-none focus:border-saffron/50 w-40"
            />
            <button
              onClick={uiActions.openTools}
              className="p-1 hover:bg-ink-soft/10 rounded text-sm"
              title="Tools (Ctrl+T)"
            >
              🛠️
            </button>
            <button
              onClick={uiActions.openSettings}
              className="p-1 hover:bg-ink-soft/10 rounded text-sm"
              title="Settings (Ctrl+,)"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* Panels */}
      <SettingsPanel
        isOpen={uiState.settingsOpen}
        onClose={uiActions.closeSettings}
      />
      <ToolsPanel
        isOpen={uiState.toolsOpen}
        onClose={uiActions.closeTools}
      />
      <HelpPanel
        isOpen={uiState.helpOpen}
        onClose={uiActions.closeHelp}
        tab={uiState.helpTab}
      />
    </>
  );
}
