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
import { SettingsPanel, useSettings } from '../ui/SettingsPanel';
import { BalloonHelp } from '../ui/BalloonHelp';
import { deactivateThisComputerNow, type DeactivateResult } from '../sync/thisComputer';
import { ToolsPanel } from '../ui/ToolsPanel';
import { HelpPanel } from '../ui/HelpPanel';
import { OpenChartDialog } from '../ui/OpenChartDialog';
import { ChartAnnotationsDialog } from '../ui/ChartAnnotationsDialog';
import { useKeyboardShortcuts } from '../ui/useKeyboardShortcuts';
import { FILE_MENU, EDIT_MENU, CHARTS_MENU, ITEM_BY_KEY } from './pl9Menus';

interface MenuItem {
  label: string;
  key: string;
  submenu?: SubMenuItem[];
}

/** An entry of a dropdown. File, Edit and Charts come from pl9Menus.js, where `target` and `status` are described. */
interface SubMenuItem {
  label?: string;
  key: string;
  action?: () => void;
  status?: string;
  divider?: boolean;
  target?: { route?: string; action?: string; pending?: string; items?: SubMenuItem[] };
}

export function TopMenuBar() {
  const { currentMenu, setCurrentMenu, setBreadcrumb, setSidebarOpen, sidebarOpen, uiState, uiActions } =
    useNavigation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const router = useRouter();
  const menuBarRef = useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = useSettings();

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

  // Reports-menu keys → report builder deep links (section anchors or a chart type)
  const REPORT_KEY_TO_PATH: Record<string, string> = {
    horoscope: '/report',
    calculations: '/report?section=lagnaGraha',
    interpretations: '/report?section=nabhasaYoga',
    dashas: '/report?section=dasha',
    bphsDashas: '/bphs-dashas',
    bphsRashiDashas: '/bphs-rashi-dashas',
    vimshopaka: '/vimshopaka',
    declination: '/declination',
    specialLagnas: '/special-lagnas',
    printCenter: '/print',
    printEphemeris: '/print?kind=ephemeris',
    printPanchang: '/print?kind=panchang',
    printKp: '/print?kind=kp',
    printDashas: '/print?kind=dashas',
    printCompact: '/print?kind=compact',
    printTransit: '/print?kind=transit',
    printBook: '/print?kind=book',
    exportBirth: '/print?kind=birth-export',
    exportEphemeris: '/print?kind=ephemeris-csv',
    healthBphs: '/health',
    kpHorary: '/kp-horary',
    kpTransit: '/kp-transit',
    kpRuling: '/kp-ruling',
    kpLuckyTime: '/kp-lucky-time',
    sripatiBhava: '/sripati-bhava',
    graphicalEphemeris: '/graphical-ephemeris',
    yearlyTransit: '/yearly-transit',
    eventCharts: '/events',
    animatedTransits: '/animated-transits',
    kotaChakra: '/kota-chakra',
    navamshaYears: '/navamsha-years',
    transits: '/report?section=transit',
    varshaphala: '/varshaphala',
    saturn: '/saturn-transit',
    kakshyaTransit: '/kakshya-transit',
    vedha: '/gochara-vedha',
    nakshatraGochara: '/nakshatra-gochara',
    moorthi: '/moorthi-nirnaya',
    latta: '/latta',
    pada88: '/pada-88',
    rogaArambha: '/roga-arambha',
    bandYears: '/band-of-years',
    mangala: '/mangala-dosha',
    gems: '/gemstones',
    compatibility: '/porutham',
    kelvi: '/kelvi',
    astronomy: '/report?section=grahaBala',
  };
  const REPORTS_NOT_YET_BUILT = new Set<string>([]);

  // Research-menu keys → their pages (Search for Charts is handled below, it opens the chart dialog; Calculator is the Tools panel)
  const RESEARCH_KEY_TO_PATH: Record<string, string> = {
    research_stats: '/research',
    research_export_ephemeris: '/print?kind=ephemeris-csv',
    research_export_birth: '/print?kind=birth-export',
    research_transit_time: '/report?chart=transit',
  };

  // Classical References-menu keys → /references, with an optional category filter
  const REFERENCE_KEY_TO_PATH: Record<string, string> = {
    bphs: '/references',
    saravali: '/references',
    planetHouse: '/planet-house',
    horasara: '/references',
    gargahora: '/references',
    karakas: '/references?category=planet',
    nakshatras: '/references?category=nakshatra',
    yogas: '/references?category=yoga',
  };

  const menus: MenuItem[] = [
    // File, Edit and Charts follow Parashara's Light 9, entry for entry (pl9Menus.js)
    { label: 'File', key: 'file', submenu: FILE_MENU },
    { label: 'Edit', key: 'edit', submenu: EDIT_MENU },
    { label: 'Charts', key: 'charts', submenu: CHARTS_MENU },
    {
      label: 'Print',
      key: 'printMenu',
      submenu: [
        { label: 'Print Center (அச்சு மையம்)', key: 'printCenter' },
        { label: '', key: 'divider-p1' },
        { label: 'Ephemeris (எபிமெரிஸ்)', key: 'printEphemeris' },
        { label: 'Panchang (பஞ்சாங்கம்)', key: 'printPanchang' },
        { label: 'Krishnamurti (KP)', key: 'printKp' },
        { label: 'Dashas 1-5 levels (தசைகள்)', key: 'printDashas' },
        { label: 'Compact lifetime — 3 levels', key: 'printCompact' },
        { label: 'Transit / dasha report', key: 'printTransit' },
        { label: 'Horoscope book (ஜாதக புத்தகம்)', key: 'printBook' },
        { label: '', key: 'divider-p2' },
        { label: 'Export birth data', key: 'exportBirth' },
        { label: 'Export ephemeris (CSV)', key: 'exportEphemeris' },
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
        { label: 'BPHS Dashas (தசைகள் — பராசரர்)', key: 'bphsDashas' },
        { label: 'BPHS Rashi Dashas (ராசி தசைகள்)', key: 'bphsRashiDashas' },
        { label: 'Vimshopaka Bala (விம்சோபக பலம்)', key: 'vimshopaka' },
        { label: 'Declination (கிராந்தி)', key: 'declination' },
        { label: 'Special Lagnas (சிறப்பு லக்னங்கள்)', key: 'specialLagnas' },
        { label: 'Health (ஆரோக்கியம் — BPHS)', key: 'healthBphs' },
        { label: 'KP Horary (KP பிரச்னம் 1-249)', key: 'kpHorary' },
        { label: 'KP Transit (KP கோசாரம்)', key: 'kpTransit' },
        { label: 'KP Ruling Planets (ஆளும் கிரகங்கள் — நேரம்)', key: 'kpRuling' },
        { label: 'KP Lucky Timings (KP நல்ல நேரம்)', key: 'kpLuckyTime' },
        { label: 'Sripati Bhava (ஸ்ரீபதி பாவம்)', key: 'sripatiBhava' },
        { label: 'Graphical Ephemeris (வரைபட எபிமெரிஸ்)', key: 'graphicalEphemeris' },
        { label: 'Yearly Transit (ஆண்டு கோசாரம்)', key: 'yearlyTransit' },
        { label: 'Event Charts (நிகழ்வு ஜாதகங்கள்)', key: 'eventCharts' },
        { label: 'Animated Transits (அனிமேஷன் கோசாரம்)', key: 'animatedTransits' },
        { label: 'Kota & Sanghatta Chakra (கோட்டா, சங்கட்ட சக்கரம்)', key: 'kotaChakra' },
        { label: 'Navamsha Counts (நவாம்ச எண்ணிக்கை)', key: 'navamshaYears' },
        { label: 'Transits', key: 'transits' },
        { label: 'Varshaphala', key: 'varshaphala' },
        { label: 'Saturn Transit (ஏழரைச் சனி)', key: 'saturn' },
        { label: 'Kakshya Transit (கோசாரக் காக்ஷ்யா)', key: 'kakshyaTransit' },
        { label: 'Gochara Vedha (கோசார வேதை)', key: 'vedha' },
        { label: 'Nakshatra Gochara (நட்சத்திரக் கோசாரம்)', key: 'nakshatraGochara' },
        { label: 'Moorthi Nirnaya (மூர்த்தி நிர்ணயம்)', key: 'moorthi' },
        { label: 'Latta (லத்தை)', key: 'latta' },
        { label: '88th Pada (88-வது பாதம்)', key: 'pada88' },
        { label: 'Onset of Illness (நோய்த் தொடக்கம்)', key: 'rogaArambha' },
        { label: 'Band of Years (ஆண்டுப் பட்டை)', key: 'bandYears' },
        { label: 'Mangala Dosha (மங்கள தோஷம்)', key: 'mangala' },
        { label: 'Gemstones (ரத்தினங்கள்)', key: 'gems' },
        { label: 'Compatibility', key: 'compatibility' },
        { label: 'Prashna (கேள்வி–விடை)', key: 'kelvi' },
        { label: 'Astronomy', key: 'astronomy' },
      ],
    },
    {
      label: 'Classical References',
      key: 'references',
      submenu: [
        { label: 'BPHS (Brihat Parashara Hora Shastra)', key: 'bphs' },
        { label: 'Saravali', key: 'saravali' },
        { label: 'Planets in Houses (கிரகம் பாவத்தில்)', key: 'planetHouse' },
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
        { label: 'Muhurta Star (லத்தை / வைநாசிகம் / 88-108 பாதம்)', key: 'muhurtastars' },
        { label: 'Nakshatras and Deeds (நட்சத்திரமும் காரியமும்)', key: 'nakshatraDeeds' },
        { label: 'Transit Finder', key: 'transit_finder' },
        { label: 'Rectification Tool', key: 'rectification_tool' },
        { label: 'Jamakkol Prasnam', key: 'jamakkol' },
        { label: 'Nalla Neram (Gowri/Hora)', key: 'nallaneram' },
        { label: 'Tamil Calendar & Festivals', key: 'tamilcalendar' },
        { label: 'Baby Names (Nakshatra)', key: 'babynames' },
        { label: 'Classical Muhurta (Pancha-Pakshi / Yatra / Eclipse)', key: 'classicalmuhurta' },
        { label: 'KP Muhurta Time Scan', key: 'kptimescan' },
      ],
    },
    {
      label: 'Research',
      key: 'research',
      submenu: [
        { label: 'Search for Charts', key: 'research_search' },
        { label: 'Statistics on group of charts', key: 'research_stats' },
        { label: '', key: 'divider-r1' },
        { label: 'Export Ephemeris (CSV)', key: 'research_export_ephemeris' },
        { label: 'Export Birth Chart', key: 'research_export_birth' },
        { label: '', key: 'divider-r2' },
        { label: 'Time of transits (Transit Finder)', key: 'research_transit_time' },
        { label: 'Calculator', key: 'calculator' },
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
        { label: 'Vedic Astrology Tutorial', key: 'tutorial' },
        { label: 'Keyboard Shortcuts', key: 'shortcuts' },
        { label: settings.showHints ? 'Balloon Help ✓' : 'Balloon Help', key: 'balloon' },
        { label: 'Check for Updates', key: 'updates' },
        { label: 'About', key: 'about' },
        { label: 'Deactivate on this Computer', key: 'deactivate' },
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
    setOpenSub(null);

    // File, Edit and Charts entries (pl9Menus.js): a page, a handler below, or a "not built yet" notice with its reason
    const pl9 = ITEM_BY_KEY[submenuKey] as SubMenuItem | undefined;
    if (pl9?.target?.route) {
      router.push(pl9.target.route);
      return;
    }
    if (pl9?.target?.pending) {
      alert(`${pl9.label}\n\n${pl9.target.pending}`);
      return;
    }
    const actionKey = pl9?.target?.action ?? submenuKey;

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

    // Research menu — statistics, export and transit pages
    if (RESEARCH_KEY_TO_PATH[submenuKey]) {
      router.push(RESEARCH_KEY_TO_PATH[submenuKey]);
      return;
    }

    switch (actionKey) {
      // File Menu
      case 'new':
        router.push('/report');
        break;
      case 'open':
      case 'file-manager':
      case 'research_search':
        uiActions.openChartDialog('all');
        break;
      case 'close':
        // Closes the working chart: forget it, then show an empty report page
        try { localStorage.removeItem('kotravel_current_chart'); } catch { /* storage unavailable */ }
        router.push('/report');
        break;
      case 'printer-setup':
        // A web page cannot open the system's printer setup; the printer is chosen in the browser's print dialog
        alert('The printer is chosen in the browser\'s print dialog, which opens with File → Print screen.');
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
      case 'tutorial':
        uiActions.openHelp('tutorial');
        break;
      case 'updates':
        uiActions.openHelp('updates');
        break;
      case 'balloon':
        updateSettings({ showHints: !settings.showHints });
        break;
      case 'deactivate': {
        if (!confirm('Deactivate this computer for sync? Its sync device record is revoked. Your saved charts are not deleted.')) break;
        const messages: Record<DeactivateResult, string> = {
          revoked: 'This computer has been deactivated.',
          'not-registered': 'This computer is not registered for sync, so there is nothing to deactivate.',
        };
        deactivateThisComputerNow()
          .then((result) => alert(messages[result]))
          .catch((err) => alert(`Could not deactivate this computer: ${err?.message ?? err}`));
        break;
      }
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
      case 'muhurtastars':
        router.push('/muhurta-stars');
        break;
      case 'nakshatraDeeds':
        router.push('/nakshatra-deeds');
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
      case 'tamilcalendar':
        router.push('/tamil-calendar');
        break;
      case 'babynames':
        router.push('/baby-names');
        break;
      case 'classicalmuhurta':
        router.push('/classical-muhurta');
        break;
      case 'kptimescan':
        router.push('/kp-time-scan');
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
  }, [uiActions, setCurrentMenu, router, settings.showHints, updateSettings]);

  useKeyboardShortcuts({
    onSettings: uiActions.openSettings,
    onTools: uiActions.openTools,
    onHelp: () => uiActions.openHelp('help'),
    onClose: uiActions.closeAllPanels,
  });

  return (
    <>
      <BalloonHelp />

      {/* Top Menu Bar */}
      <div className="bg-ink text-surface border-b border-ink-soft/20 sticky top-0 z-50">
        <div className="flex items-center h-10 px-4 gap-4">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-ink-soft/10 rounded text-sm font-semibold"
            title="Toggle Sidebar"
            data-hint="Show or hide the sidebar"
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
                    className={`absolute left-0 mt-0 min-w-56 w-max max-w-sm max-h-[calc(100vh-3rem)] overflow-y-auto bg-surface border border-line shadow-lg rounded-md transition-all duration-150 py-1 z-50 group-hover:opacity-100 group-hover:visible ${
                      openMenu === menu.key ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                  >
                    {menu.submenu.map((submenu) =>
                      submenu.key.startsWith('divider') ? (
                        <div key={submenu.key} className="h-px bg-line my-1" />
                      ) : submenu.target?.items ? (
                        // A submenu (Charts > Interpretations): opens inline, so the scrolling dropdown never clips it
                        <div key={submenu.key}>
                          <button
                            onClick={() => setOpenSub(openSub === submenu.key ? null : submenu.key)}
                            aria-expanded={openSub === submenu.key}
                            className="w-full flex items-center justify-between gap-4 px-4 py-2 text-sm text-ink text-left hover:bg-saffron/10"
                          >
                            <span>{submenu.label}</span>
                            <span className="text-ink-soft">{openSub === submenu.key ? '▾' : '▸'}</span>
                          </button>
                          {openSub === submenu.key && submenu.target.items.map((item) => (
                            <button
                              key={item.key}
                              onClick={() => handleSubmenuClick(item.key)}
                              className="w-full text-left pl-8 pr-4 py-2 text-sm hover:bg-saffron/10 text-ink transition-colors"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          key={submenu.key}
                          onClick={() => handleSubmenuClick(submenu.key)}
                          title={submenu.target?.pending}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-saffron/10 transition-colors ${
                            submenu.target?.pending ? 'text-ink-soft italic' : 'text-ink'
                          }`}
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
              data-hint="Tools: location, time zone, ayanamsha and date converters (Ctrl+T)"
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
