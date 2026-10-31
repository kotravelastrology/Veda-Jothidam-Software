'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useNavigation } from './navigationContext';
import { useWorkspace } from '../workspace/workspaceContext';
import { PANELS, titleOfRoute, allEntries } from './toolbarPanels';
import { CHARTS_MENU } from './pl9Menus';
import { useScreenPrefs, useOpenChart } from '../ui/useScreenPrefs';
import { clearStash } from '../ui/openChartStore';
import { ToolDialogs, type ToolView } from './ToolDialogs';

/**
 * The worksheet toolbar: the row of icons under the menu that Parashara's Light 9 shows once a chart is open (screen recording of PL9
 * 9.0, 2026-10-31). Each icon opens a panel of the worksheets and reports of one kind (src/navigation/toolbarPanels.js); the wrench
 * opens the tools (screen, worksheet, colours, time tool …); ⭐ lists the Charts menu, 🕘 the pages visited last, ✕ closes the chart.
 */

interface Entry {
  key: string;
  label: string;
  status: string;
  target: { route?: string; pending?: string; items?: Entry[] };
}
interface Column { title: string; ta: string; items: Entry[] }
interface Panel { key: string; icon: string; label: string; ta: string; ours?: boolean; columns: Column[] }

const panels = PANELS as unknown as Panel[];
const RECENT_KEY = 'kotravel-recent-routes';
const RECENT_MAX = 10;
const KNOWN_ROUTES = new Set((allEntries() as unknown as Entry[]).map((e) => e.target.route).filter(Boolean) as string[]);

/** The Charts menu as a flat list for the ⭐ panel; the Interpretations flyout's entries are listed in place of the flyout. */
const FAVORITES: Column[] = [{
  title: 'Charts', ta: 'கட்டங்கள் பட்டி',
  items: (CHARTS_MENU as unknown as Entry[]).flatMap((e) => (e.target.items ? e.target.items : [e])),
}];

const SIZE = {
  small: { button: 'min-w-9 h-9 text-base', label: 'text-[10px]' },
  medium: { button: 'min-w-11 h-11 text-xl', label: 'text-[11px]' },
  large: { button: 'min-w-14 h-14 text-3xl', label: 'text-xs' },
} as const;

function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((r) => typeof r === 'string').slice(0, RECENT_MAX) : [];
  } catch { return []; }
}

export function WorksheetToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const { uiActions } = useNavigation();
  const { setActiveProfile, setCommandPaletteOpen } = useWorkspace();
  const { prefs, setPrefs } = useScreenPrefs();
  const chart = useOpenChart();

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ label: string; reason: string } | null>(null);
  const [tool, setTool] = useState<ToolView>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const wrap = useRef<HTMLDivElement>(null);

  const query = search.toString();
  const here = query ? `${pathname}?${query}` : pathname;
  const isCurrent = useCallback((route?: string) => !!route && (route.includes('?') ? route === here : route === pathname), [here, pathname]);

  // The pages visited last, newest first
  useEffect(() => {
    const route = KNOWN_ROUTES.has(here) ? here : KNOWN_ROUTES.has(pathname) ? pathname : null;
    setRecent(readRecent());
    if (!route) return;
    const next = [route, ...readRecent().filter((r) => r !== route)].slice(0, RECENT_MAX);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
    setRecent(next);
  }, [here, pathname]);

  // A panel closes on a click outside, on Escape and when the page changes
  useEffect(() => { setOpenPanel(null); setNotice(null); }, [here]);
  useEffect(() => {
    if (!openPanel) return;
    const onDown = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpenPanel(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenPanel(null); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [openPanel]);

  const pick = (e: Entry) => {
    if (e.target.route) { setOpenPanel(null); setNotice(null); router.push(e.target.route); return; }
    setNotice({ label: e.label, reason: e.target.pending ?? 'Not built yet.' });
  };

  const toggle = (key: string) => {
    if (!chart) { uiActions.openChartDialog('all'); return; }
    setNotice(null);
    setOpenPanel((p) => (p === key ? null : key));
  };

  const closeChart = () => {
    if (!chart) return;
    if (!confirm(`${chart.name} — ஜாதகத்தை மூடவா? (Close this chart?)`)) return;
    clearStash();
    setActiveProfile(null);
    setOpenPanel(null);
    router.push('/worksheet');
  };

  const size = SIZE[prefs.iconSize as keyof typeof SIZE] ?? SIZE.medium;
  const hint = (ta: string, label: string) => (prefs.toolbarHints ? `${ta} — ${label}` : undefined);
  const worksheetTitle = prefs.worksheetTitle || titleOfRoute(here) || titleOfRoute(pathname) || '';

  const recentColumn: Column[] = useMemo(() => [{
    title: 'Recent', ta: 'சமீபத்தியவை',
    items: recent.map((route) => ({ key: `recent-${route}`, label: titleOfRoute(route) ?? route, status: 'have', target: { route } })),
  }], [recent]);

  if (!prefs.showToolbar) {
    return (
      <div className="print:hidden border-b border-line bg-surface/60 px-3 py-0.5 text-right">
        <button type="button" onClick={() => setPrefs({ showToolbar: true })} className="text-[11px] text-ink-soft hover:text-ink" title="கருவிப்பட்டியைக் காட்டு">▾ கருவிப்பட்டி (Toolbar)</button>
      </div>
    );
  }

  const iconButton = (key: string, icon: string, ta: string, label: string, onClick: () => void, opts: { active?: boolean; needsChart?: boolean } = {}) => {
    const off = opts.needsChart && !chart;
    return (
      <button
        key={key}
        type="button"
        onClick={onClick}
        title={hint(ta, label)}
        aria-label={`${ta} (${label})`}
        aria-expanded={opts.active}
        data-toolbar={key}
        className={`${size.button} shrink-0 px-1.5 rounded-lg flex flex-col items-center justify-center leading-none transition-colors ${opts.active ? 'bg-saffron/25 ring-1 ring-saffron' : 'hover:bg-saffron/15'} ${off ? 'opacity-45' : ''}`}
      >
        <span aria-hidden>{icon}</span>
        {!prefs.compactNavigation && <span className={`${size.label} mt-0.5 text-ink-soft whitespace-nowrap`}>{ta}</span>}
      </button>
    );
  };

  const shown: Column[] | null = openPanel === 'favorites' ? FAVORITES : openPanel === 'recent' ? recentColumn : (panels.find((p) => p.key === openPanel)?.columns ?? null);
  const shownPanel = panels.find((p) => p.key === openPanel);
  const wide = shownPanel && shownPanel.columns.length >= 4;

  return (
    <div ref={wrap} className="relative print:hidden border-b border-line bg-surface" data-testid="worksheet-toolbar">
      <div className="flex items-center gap-0.5 overflow-x-auto px-2 py-1">
        {iconButton('tools', '🔧', 'கருவிகள்', 'Tools', () => { setOpenPanel(null); setTool('tiles'); })}
        <span className="mx-1 h-7 w-px bg-line shrink-0" aria-hidden />
        {panels.map((p) => iconButton(p.key, p.icon, p.ta, p.label, () => toggle(p.key), { active: openPanel === p.key, needsChart: true }))}
        <span className="mx-1 h-7 w-px bg-line shrink-0" aria-hidden />
        {iconButton('favorites', '⭐', 'விருப்பம்', 'Favorites: the Charts menu', () => toggle('favorites'), { active: openPanel === 'favorites', needsChart: true })}
        {iconButton('recent', '🕘', 'சமீபத்தியவை', 'Recent pages', () => toggle('recent'), { active: openPanel === 'recent', needsChart: true })}
        <span className="mx-1 h-7 w-px bg-line shrink-0" aria-hidden />
        {iconButton('time', '🕰️', 'நேரம்', 'Time Tool', () => { if (!chart) uiActions.openChartDialog('all'); else setTool('time'); }, { needsChart: true })}
        {iconButton('close', '✕', 'மூடு', 'Close the chart', closeChart, { needsChart: true })}
        <button
          type="button"
          onClick={() => setPrefs({ showToolbar: false })}
          className="ml-auto shrink-0 px-2 text-[11px] text-ink-soft hover:text-ink"
          title="கருவிப்பட்டியை மறை (Screen options)"
        >▴</button>
      </div>

      {/* The one line that says which chart is open (the old profile bar under it no longer repeats it) */}
      {prefs.nameAndBirthdata && (chart ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-t border-line/60 bg-bg px-3 py-1 text-xs" data-testid="open-chart-line">
          <span className="rounded-t-md bg-saffron/25 px-2 py-0.5 font-semibold text-ink">{chart.name}</span>
          <span className="text-ink-soft">{chart.line}</span>
          <button type="button" onClick={() => setCommandPaletteOpen(true)} className="text-ink-soft hover:text-saffron" title="வேறு ஜாதகம் (Ctrl+K)">மாற்று</button>
          {worksheetTitle && <span className="ml-auto text-ink-soft">{worksheetTitle}</span>}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-t border-line/60 bg-bg px-3 py-1 text-xs" data-testid="no-chart-line">
          <span className="text-ink-soft">ஜாதகம் எதுவும் திறக்கப்படவில்லை</span>
          <button type="button" onClick={() => uiActions.openChartDialog('all')} className="text-saffron hover:underline">📂 திற</button>
          <button type="button" onClick={() => router.push('/worksheet?new=1')} className="text-saffron hover:underline">➕ புதியது</button>
          <button type="button" onClick={() => setCommandPaletteOpen(true)} className="text-ink-soft hover:text-ink">தேடு <kbd className="font-mono text-[10px]">Ctrl+K</kbd></button>
        </div>
      ))}

      {shown && (
        <div className="absolute left-0 right-0 top-full z-40 max-h-[70vh] overflow-y-auto border-b border-line bg-surface shadow-lg" role="dialog" aria-label={shownPanel?.label ?? 'Menu'}>
          <div className={`grid gap-x-4 gap-y-3 p-3 grid-cols-1 sm:grid-cols-2 ${wide ? 'lg:grid-cols-5' : shown.length === 2 ? 'lg:grid-cols-2' : ''}`}>
            {shown.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="mb-1 border-b border-line pb-0.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">{col.title} <span className="font-normal normal-case">· {col.ta}</span></h3>
                {col.items.length === 0 && <p className="text-xs text-ink-soft">இன்னும் எதுவும் இல்லை.</p>}
                <ul className="space-y-0.5">
                  {col.items.map((e) => (
                    <li key={e.key}>
                      <button
                        type="button"
                        onClick={() => pick(e)}
                        className={`w-full rounded px-2 py-1 text-left text-sm hover:bg-saffron/15 ${isCurrent(e.target.route) ? 'bg-saffron/25 font-semibold' : ''} ${e.status === 'pending' ? 'italic text-ink-soft' : 'text-ink'}`}
                      >
                        {e.status === 'partial' && <span className="mr-1 text-ink-soft" title="The nearest page we have">≈</span>}
                        {e.label}
                        {e.status === 'pending' && <span className="ml-1 text-[10px] not-italic text-rose">விரைவில்</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-line bg-bg px-3 py-1.5 text-[11px] text-ink-soft">
            {notice
              ? <span><strong className="text-ink">{notice.label}</strong> — {notice.reason}</span>
              : <span>≈ அருகிலுள்ள பக்கம் (nearest page) · விரைவில் = இன்னும் கட்டப்படவில்லை (not built yet){shownPanel?.ours ? ' · இந்தத் தொகுப்பு நம்முடையது' : ''}</span>}
          </div>
        </div>
      )}

      <ToolDialogs view={tool} setView={setTool} openSettingsAt={(id) => {
        uiActions.openSettings();
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 120);
      }} />
    </div>
  );
}
