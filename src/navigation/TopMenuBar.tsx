'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigation } from './navigationContext';
import { getChartLibrary } from '../portal/ChartLibraryManager';

/** The last chart calculated on /report, stashed by ReportBuilder for the menu bar. */
function readCurrentChart(): { birthData: any; selectedChartId?: string; notes?: string; events?: any[]; libraryId?: string } | null {
  try {
    const raw = localStorage.getItem('kotravel_current_chart');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
import { useUIManager } from '../ui/useUIManager';
import { SettingsPanel } from '../ui/SettingsPanel';
import { ToolsPanel } from '../ui/ToolsPanel';
import { HelpPanel } from '../ui/HelpPanel';
import { OpenChartDialog } from '../ui/OpenChartDialog';
import { ChartAnnotationsDialog } from '../ui/ChartAnnotationsDialog';
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
  const router = useRouter();
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Click-outside-to-close: the dropdown is driven by `openMenu` state (click-based),
  // not CSS :hover, so it works reliably with mouse, touch, and automated testing.
  useEffect(() => {
    if (!openMenu) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  // Maps Charts-menu keys to real chart ids from src/charts/chartTypes.ts
  const CHART_KEY_TO_ID: Record<string, string> = {
    rasi: 'D1-rasi',
    navamsha: 'D9-navamsha',
    divisional: 'D9-navamsha',
    varga: 'varga-chakra',
    sudarshan: 'sudarshan-chakra',
    dasha: 'dasha-vimsottari',
    transit: 'transit',
    ashtakavarga: 'ashtakavarga',
    ephemeris: 'ephemeris',
    rectification: 'rectification',
    composite: 'compatibility', // Synastry chart doubles as the composite/relationship view
  };
  const CHARTS_NOT_YET_BUILT = new Set<string>([]);

  // Reports-menu keys → report builder deep links (section anchors or a chart type)
  const REPORT_KEY_TO_PATH: Record<string, string> = {
    horoscope: '/report',
    calculations: '/report?section=lagnaGraha',
    interpretations: '/report?section=nabhasaYoga',
    dashas: '/report?section=dasha',
    transits: '/report?section=transit',
    varshaphala: '/varshaphala',
    compatibility: '/porutham',
    astronomy: '/report?section=grahaBala',
  };
  const REPORTS_NOT_YET_BUILT = new Set<string>([]);

  // Classical References-menu keys → /references, with an optional category filter
  const REFERENCE_KEY_TO_PATH: Record<string, string> = {
    bphs: '/references',
    saravali: '/references',
    horasara: '/references',
    gargahora: '/references',
    karakas: '/references?category=planet',
    nakshatras: '/references?category=nakshatra',
    yogas: '/references?category=yoga',
  };

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
        { label: 'Jamakkol Prasnam', key: 'jamakkol' },
        { label: 'Nalla Neram (Gowri/Hora)', key: 'nallaneram' },
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

    // Charts menu — navigate straight to the report builder with the chart pre-selected
    if (CHART_KEY_TO_ID[submenuKey]) {
      router.push(`/report?chart=${CHART_KEY_TO_ID[submenuKey]}`);
      return;
    }
    if (CHARTS_NOT_YET_BUILT.has(submenuKey)) {
      alert('This chart type is not implemented yet — coming in a future phase.');
      return;
    }

    // Reports menu — deep-link into the report builder
    if (REPORT_KEY_TO_PATH[submenuKey]) {
      router.push(REPORT_KEY_TO_PATH[submenuKey]);
      return;
    }
    if (REPORTS_NOT_YET_BUILT.has(submenuKey)) {
      alert('Varshaphala (annual chart) report is not implemented yet — coming in a future phase.');
      return;
    }

    // Classical References menu — open the reference browser
    if (REFERENCE_KEY_TO_PATH[submenuKey]) {
      router.push(REFERENCE_KEY_TO_PATH[submenuKey]);
      return;
    }

    switch (submenuKey) {
      // File Menu
      case 'new':
        router.push('/report');
        break;
      case 'open':
        uiActions.openChartDialog('all');
        break;
      case 'recent':
        uiActions.openChartDialog('recent');
        break;
      case 'save':
      case 'saveas': {
        const current = readCurrentChart();
        if (!current?.birthData) {
          alert('No chart to save yet. Open File → New Chart, enter birth details and calculate first.');
          break;
        }
        const bd = current.birthData;
        const defaultName = bd.name?.trim() || 'Untitled chart';
        const chartName = submenuKey === 'saveas'
          ? (prompt('Save chart as:', defaultName) || '').trim()
          : defaultName;
        if (submenuKey === 'saveas' && !chartName) break; // user cancelled
        try {
          const saved = getChartLibrary().saveChart({
            userId: 'local',
            name: chartName,
            birthData: {
              name: bd.name ?? '',
              dateOfBirth: bd.dateOfBirth ?? '',
              timeOfBirth: bd.timeOfBirth ?? '',
              place: bd.place ?? '',
              latitude: Number(bd.latitude) || 0,
              longitude: Number(bd.longitude) || 0,
              utcOffset: Number(bd.utcOffset) || 0,
            },
            chartTypes: current.selectedChartId ? [current.selectedChartId] : ['D1-rasi'],
            tags: [],
            isFavorite: false,
            isShared: false,
            notes: current.notes,
            events: current.events,
          });
          // Link the working chart to its library entry so later Notes/Events edits sync
          try {
            localStorage.setItem('kotravel_current_chart', JSON.stringify({ ...current, libraryId: saved.id }));
          } catch { /* non-fatal */ }
          alert(`Saved "${chartName}" to your chart library.`);
        } catch (e) {
          alert('Could not save chart: ' + (e instanceof Error ? e.message : String(e)));
        }
        break;
      }
      case 'export_submenu': {
        const current = readCurrentChart();
        if (!current?.birthData) {
          alert('Nothing to export yet. Open File → New Chart, enter birth details and calculate first.');
          break;
        }
        const safeName = (current.birthData.name?.trim() || 'chart').replace(/[^\w-]+/g, '_');
        downloadJson(`kotravel_${safeName}_${new Date().toISOString().split('T')[0]}.json`, {
          exportedAt: new Date().toISOString(),
          birthData: current.birthData,
          selectedChart: current.selectedChartId ?? null,
        });
        break;
      }
      case 'print': {
        // Only the report page has a print stylesheet worth printing.
        if (window.location.pathname === '/report') {
          window.print();
          break;
        }
        const cur = readCurrentChart();
        if (cur?.birthData) {
          const q = cur.libraryId ? `load=${encodeURIComponent(cur.libraryId)}&print=1` : 'print=1';
          router.push(`/report?${q}`); // ReportBuilder auto-prints once the report renders
        } else {
          alert('Nothing to print yet. Open a chart (File → New Chart or Open…), then Print.');
        }
        break;
      }
      case 'exit': {
        if (!confirm('Exit Kotravel? Your saved charts and notes stay in this browser.')) break;
        uiActions.closeAllPanels();
        setOpenMenu(null);
        try { window.close(); } catch { /* not a script-opened window */ }
        // window.close() is a no-op for the main tab — return to the home screen instead
        router.push('/');
        break;
      }

      // Edit Menu
      case 'birthdata':
        router.push('/report');
        break;
      case 'notes':
        uiActions.openAnnotations('notes');
        break;
      case 'events':
        uiActions.openAnnotations('events');
        break;

      // Options / Settings — Preferences, Chart Style, Colors & Fonts and Language
      // are all controlled from the Settings panel's Display section
      case 'settings':
      case 'preferences':
      case 'chartstyle':
      case 'colors':
      case 'language':
        uiActions.openSettings();
        break;
      // Calculator — the astrology calculators/converters live in the Tools panel
      case 'calculator':
        uiActions.openTools();
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
        router.push('/muhurta');
        break;
      case 'transit_finder':
        router.push('/report?chart=transit');
        break;
      case 'rectification_tool':
        router.push('/rectification');
        break;
      case 'jamakkol':
        router.push('/jamakkol');
        break;
      case 'nallaneram':
        router.push('/nallaneram');
        break;

      // Windows Menu — there is no MDI window system on the web, so these repurpose
      // as report-layout density presets applied to the /report analysis sections.
      case 'cascade':
      case 'tileh':
      case 'tilev': {
        const mode = submenuKey === 'cascade' ? 'single' : submenuKey === 'tileh' ? 'two' : 'three';
        uiActions.setWindowLayout(submenuKey === 'cascade' ? 'cascade' : 'tile');
        try {
          localStorage.setItem('kotravel_report_layout', mode);
        } catch { /* storage unavailable */ }
        window.dispatchEvent(new CustomEvent('kotravel:report-layout', { detail: mode }));
        if (window.location.pathname !== '/report') {
          const label = mode === 'single' ? 'single column' : mode === 'two' ? '2 columns' : '3 columns';
          alert(`Report layout set to ${label}. Open a chart report to see it.`);
        }
        break;
      }

      default:
        break;
    }
  }, [uiActions, setCurrentMenu, router]);

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
          <div ref={menuBarRef} className="flex gap-1 ml-4 flex-1">
            {menus.map((menu) => (
              <div key={menu.key} className="relative group">
                <button
                  onClick={() => handleMenuClick(menu.key)}
                  aria-expanded={openMenu === menu.key}
                  className={`px-3 py-2 text-sm font-medium rounded hover:bg-ink-soft/10 transition-colors ${
                    currentMenu === menu.key ? 'bg-saffron text-ink' : ''
                  }`}
                >
                  {menu.label}
                </button>

                {/* Dropdown Submenu — visibility driven by click state (openMenu),
                    with :hover as a bonus for mouse users who hover across the bar */}
                {menu.submenu && (
                  <div
                    className={`absolute left-0 mt-0 w-56 bg-surface border border-line shadow-lg rounded-md transition-all duration-150 py-1 z-50 group-hover:opacity-100 group-hover:visible ${
                      openMenu === menu.key ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                  >
                    {menu.submenu.map((submenu) =>
                      submenu.key.startsWith('divider') ? (
                        <div key={submenu.key} className="h-px bg-line my-1" />
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
      <OpenChartDialog
        isOpen={uiState.chartDialogOpen}
        mode={uiState.chartDialogMode}
        onClose={uiActions.closeChartDialog}
      />
      <ChartAnnotationsDialog
        kind={uiState.annotationDialog}
        onClose={uiActions.closeAnnotations}
      />
    </>
  );
}
