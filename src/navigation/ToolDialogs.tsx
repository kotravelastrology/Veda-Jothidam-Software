'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { TOOL_TILES, BIRTH } from './toolbarPanels';
import { useScreenPrefs, useTimeTool, useOpenChart, openChartPlace } from '../ui/useScreenPrefs';
import { PLANET_KEYS } from '../ui/screenPrefsStore';
import * as TimeTool from '../ui/timeToolStore';
import { loadChartStyle, saveChartStyle, type ChartStyle } from '../charts/kattam/rasiNames';
import { PLANET_COLOR } from '../../app/worksheet/worksheetStyle';
import { stepTransitMoment } from '../../app/animated-transits/actions';

/**
 * The dialogs behind the toolbar's wrench (PL9's "Tools" panel, screen recording 2026-10-31): a grid of tiles, each opening a small dialog
 * of its own, and the Time Tool, which stays on screen beside the page. Language, locale, fonts, calculations and dashas are the Settings
 * panel at the right section; the Place Tool (the lagna map of the world) is not built yet and says so.
 */

export type ToolView = null | 'tiles' | 'worksheet' | 'screen' | 'chartstyle' | 'colors' | 'time' | 'place';

const CHOICES_KEY = 'kotravel-worksheet-cells';

function Shell({ title, ta, onClose, children, wide }: { title: string; ta: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-3" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-label={title} className={`max-h-[90vh] w-full overflow-y-auto rounded-xl border border-line bg-surface shadow-xl ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <h2 className="text-base font-semibold text-ink">{title} <span className="text-sm font-normal text-ink-soft">· {ta}</span></h2>
          <button type="button" onClick={onClose} className="text-xl leading-none text-ink-soft hover:text-ink" aria-label="மூடு">✕</button>
        </div>
        <div className="space-y-4 p-4">{children}</div>
      </div>
    </div>
  );
}

const Check = ({ label, ta, checked, onChange }: { label: string; ta: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-saffron" />
    <span>{label} <span className="text-ink-soft">· {ta}</span></span>
  </label>
);

function Choice<T extends string>({ name, value, options, onChange }: { name: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {options.map((o) => (
        <label key={o.value} className="flex cursor-pointer items-center gap-1.5 text-sm text-ink">
          <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} className="accent-saffron" />
          {o.label}
        </label>
      ))}
    </div>
  );
}

const Fieldset = ({ legend, children }: { legend: string; children: ReactNode }) => (
  <fieldset className="space-y-2 rounded-lg border border-line p-3">
    <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">{legend}</legend>
    {children}
  </fieldset>
);

const doneButton = 'rounded-lg bg-saffron px-4 py-1.5 text-sm font-semibold text-ink hover:brightness-105';
const plainButton = 'rounded-lg border border-line px-3 py-1.5 text-sm text-ink hover:bg-saffron/15';

/** The pages the "use as home screen" choice offers: the birth-chart panel's worksheets, one entry per page. */
const HOME_CHOICES = (() => {
  const seen = new Set<string>();
  const out: { route: string; label: string }[] = [];
  for (const col of BIRTH.columns) for (const e of col.items) {
    const route = (e.target as { route?: string }).route;
    if (route && !seen.has(route) && /^\/[a-z0-9\-/]*(\?[^\s]*)?$/i.test(route)) { seen.add(route); out.push({ route, label: e.label }); }
  }
  return out;
})();

function WorksheetDialog({ onClose }: { onClose: () => void }) {
  const { prefs, setPrefs } = useScreenPrefs();
  const [restored, setRestored] = useState(false);
  return (
    <Shell title="Worksheet properties" ta="பணித்தாள் அமைப்பு" onClose={onClose}>
      <label className="block text-sm text-ink">
        Title <span className="text-ink-soft">· தலைப்பு (blank = the page's own name)</span>
        <input value={prefs.worksheetTitle} maxLength={60} onChange={(e) => setPrefs({ worksheetTitle: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-sm" />
      </label>
      <Fieldset legend="Layout · அமைப்பு">
        <Choice name="layout" value={prefs.worksheetLayout} onChange={(v) => setPrefs({ worksheetLayout: v })} options={[
          { value: 'standard', label: 'Standard · வழக்கமான' },
          { value: 'single', label: 'One column · ஒரே வரிசை' },
          { value: 'compact', label: 'Compact · சிறியது' },
        ]} />
      </Fieldset>
      <Check label="Always show the time tool" ta="நேரக் கருவி எப்போதும்" checked={prefs.alwaysShowTimeTool} onChange={(v) => setPrefs({ alwaysShowTimeTool: v })} />
      <label className="block text-sm text-ink">
        Use as the home screen <span className="text-ink-soft">· முகப்புத் திரை (the page File &gt; Open lands on)</span>
        <select value={prefs.homeRoute} onChange={(e) => setPrefs({ homeRoute: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-sm">
          {HOME_CHOICES.map((c) => <option key={c.route} value={c.route}>{c.label}</option>)}
        </select>
      </label>
      <div className="flex items-center gap-3">
        <button type="button" className={plainButton} onClick={() => {
          try { localStorage.removeItem(CHOICES_KEY); } catch { /* storage unavailable */ }
          setPrefs({ worksheetTitle: '', worksheetLayout: 'standard', homeRoute: '/worksheet' });
          setRestored(true);
        }}>Restore the defaults · இயல்புநிலை</button>
        {restored && <span className="text-xs text-teal">மீட்டமைக்கப்பட்டது — பணித்தாளை மீண்டும் திற</span>}
      </div>
      <div className="text-right"><button type="button" className={doneButton} onClick={onClose}>OK</button></div>
    </Shell>
  );
}

function ScreenDialog({ onClose }: { onClose: () => void }) {
  const { prefs, setPrefs } = useScreenPrefs();
  return (
    <Shell title="Screen options" ta="திரை அமைப்பு" onClose={onClose}>
      <Check label="Show the toolbar" ta="கருவிப்பட்டியைக் காட்டு" checked={prefs.showToolbar} onChange={(v) => setPrefs({ showToolbar: v })} />
      <Fieldset legend="Icon size · படக்குறி அளவு">
        <Choice name="iconsize" value={prefs.iconSize} onChange={(v) => setPrefs({ iconSize: v })} options={[
          { value: 'small', label: 'Small · சிறியது' },
          { value: 'medium', label: 'Medium · நடுத்தரம்' },
          { value: 'large', label: 'Large · பெரியது' },
        ]} />
      </Fieldset>
      <Check label="Hints on the icons" ta="குறிப்புகள்" checked={prefs.toolbarHints} onChange={(v) => setPrefs({ toolbarHints: v })} />
      <Check label="Compact navigation (icons only)" ta="பெயரின்றி படக்குறி மட்டும்" checked={prefs.compactNavigation} onChange={(v) => setPrefs({ compactNavigation: v })} />
      <Check label="Name and birth data under the toolbar" ta="பெயர், பிறப்பு விவரம்" checked={prefs.nameAndBirthdata} onChange={(v) => setPrefs({ nameAndBirthdata: v })} />
      <div className="text-right"><button type="button" className={doneButton} onClick={onClose}>OK</button></div>
    </Shell>
  );
}

function ChartStyleDialog({ onClose }: { onClose: () => void }) {
  const { prefs, setPrefs } = useScreenPrefs();
  const [style, setStyle] = useState<ChartStyle>('south');
  useEffect(() => setStyle(loadChartStyle()), []);
  const choose = (s: ChartStyle) => { setStyle(s); saveChartStyle(s); window.dispatchEvent(new CustomEvent('kotravel:chart-style', { detail: s })); };
  return (
    <Shell title="Chart style" ta="கட்ட வடிவம்" onClose={onClose}>
      <Fieldset legend="Style · வடிவம்">
        <Choice name="chartstyle" value={style} onChange={choose} options={[
          { value: 'south', label: 'South Indian · தென்னிந்திய' },
          { value: 'north', label: 'North Indian · வட இந்திய' },
        ]} />
      </Fieldset>
      <Check label="Degrees and nakshatra beside the planets" ta="கிரகத்தின் அருகே பாகை, நட்சத்திரம்" checked={prefs.chartDegrees} onChange={(v) => setPrefs({ chartDegrees: v })} />
      <div className="text-right"><button type="button" className={doneButton} onClick={onClose}>OK</button></div>
    </Shell>
  );
}

const COLOR_NAMES: Record<string, string> = {
  Su: 'Sun · சூரியன்', Mo: 'Moon · சந்திரன்', Ma: 'Mars · செவ்வாய்', Me: 'Mercury · புதன்', Ju: 'Jupiter · குரு', Ve: 'Venus · சுக்கிரன்',
  Sa: 'Saturn · சனி', Ra: 'Rahu · ராகு', Ke: 'Ketu · கேது', As: 'Ascendant · லக்னம்', Gk: 'Gulika · குளிகன்',
};

function ColorsDialog({ onClose }: { onClose: () => void }) {
  const { prefs, setPrefs } = useScreenPrefs();
  return (
    <Shell title="Colors" ta="நிறங்கள்" onClose={onClose}>
      <p className="text-xs text-ink-soft">The colour of each planet's name in the worksheet's charts and tables.</p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {(PLANET_KEYS as string[]).map((k) => {
          const value = prefs.planetColors[k as keyof typeof prefs.planetColors] ?? PLANET_COLOR[k];
          return (
            <label key={k} className="flex items-center justify-between gap-2 text-sm text-ink">
              <span><span className="font-semibold" style={{ color: value }}>{k}</span> <span className="text-ink-soft">{COLOR_NAMES[k]}</span></span>
              <input
                type="color"
                value={value}
                aria-label={COLOR_NAMES[k]}
                onChange={(e) => setPrefs({ planetColors: { ...prefs.planetColors, [k]: e.target.value } })}
                className="h-7 w-10 cursor-pointer rounded border border-line bg-bg"
              />
            </label>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <button type="button" className={plainButton} onClick={() => setPrefs({ planetColors: {} })}>Reset the colours · இயல்பு நிறங்கள்</button>
        <button type="button" className={doneButton} onClick={onClose}>OK</button>
      </div>
    </Shell>
  );
}

function PlaceDialog({ onClose }: { onClose: () => void }) {
  return (
    <Shell title="Place Tool" ta="இடக் கருவி" onClose={onClose}>
      <p className="text-sm text-ink">PL9's Place Tool shows the ascendant at every place of the world (a map of lagna) for the moment of the time tool, and moves the chart to a place picked on the map.</p>
      <p className="rounded-lg bg-rose/10 p-3 text-sm text-ink"><strong>இன்னும் கட்டப்படவில்லை (not built yet).</strong> Until it is, change the place with File &gt; Open (a saved chart) or the birth-data form; the Time Tool already uses the open chart's place.</p>
      <div className="text-right"><button type="button" className={doneButton} onClick={onClose}>OK</button></div>
    </Shell>
  );
}

/** PL9's twelve steps, with a Tamil name each. */
const UNITS: { unit: string; ta: string }[] = [
  { unit: '10 Years', ta: '10 ஆண்டுகள்' }, { unit: 'Year', ta: 'ஆண்டு' }, { unit: 'Month', ta: 'மாதம்' }, { unit: 'Week', ta: 'வாரம்' },
  { unit: 'Day', ta: 'நாள்' }, { unit: 'Ascendant', ta: 'லக்னம்' }, { unit: 'Navamsha', ta: 'நவாம்சம்' }, { unit: 'Hours', ta: 'மணி' },
  { unit: '10 Minutes', ta: '10 நிமிடங்கள்' }, { unit: 'Minutes', ta: 'நிமிடம்' }, { unit: '10 Seconds', ta: '10 விநாடிகள்' }, { unit: 'Seconds', ta: 'விநாடி' },
];
const PICKS_KEY = 'kotravel-time-picks';
const PICKS_MAX = 10;

function readPicks(): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(PICKS_KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((n) => Number.isFinite(n)).slice(0, PICKS_MAX) : [];
  } catch { return []; }
}

/** The Time Tool: stays beside the page and moves the moment the open chart is read at (the worksheet's dasha list follows). */
function TimeToolPanel({ onClose }: { onClose: () => void }) {
  const chart = useOpenChart();
  const { atMs, setAt } = useTimeTool();
  const [now, setNow] = useState(() => Date.now());
  const [unit, setUnit] = useState('Day');
  const [busy, setBusy] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [picks, setPicks] = useState<number[]>([]);
  const [error, setError] = useState('');
  const place = openChartPlace();
  const offset = place.utcOffsetMinutes;
  const ms = TimeTool.currentMs(now);
  const msRef = useRef(ms);
  msRef.current = ms;
  const unitRef = useRef(unit);
  unitRef.current = unit;

  useEffect(() => { setPicks(readPicks()); }, []);
  useEffect(() => {
    if (atMs != null) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [atMs]);

  const step = async (direction: 1 | -1, u = unitRef.current) => {
    setBusy(true); setError('');
    try {
      const next = await stepTransitMoment({ atMs: msRef.current, unit: u, direction, place: { latitude: place.latitude, longitude: place.longitude, utcOffsetMinutes: offset } as never });
      setAt(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'நகர்த்த முடியவில்லை');
      setAnimating(false);
    } finally { setBusy(false); }
  };

  // Animate: one step forward every moment, until stopped
  useEffect(() => {
    if (!animating) return;
    const t = setInterval(() => { void step(1); }, 900);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animating]);

  const setDate = (d: string) => { const v = TimeTool.dateTextToMs(d, offset, TimeTool.localTimeText(msRef.current, offset)); if (v != null) setAt(v); };
  const setTime = (t: string) => { const v = TimeTool.dateTextToMs(TimeTool.localDateText(msRef.current, offset), offset, t.length === 5 ? `${t}:00` : t); if (v != null) setAt(v); };
  const savePick = () => {
    const next = [ms, ...picks.filter((p) => p !== ms)].slice(0, PICKS_MAX);
    try { localStorage.setItem(PICKS_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
    setPicks(next);
  };
  const label = (m: number) => `${TimeTool.localDateText(m, offset)} ${TimeTool.localTimeText(m, offset)}`;

  return (
    <div className="fixed bottom-10 right-3 z-[55] w-80 max-w-[calc(100vw-1.5rem)] rounded-xl border border-line bg-surface shadow-xl" role="dialog" aria-label="Time Tool" data-testid="time-tool">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
        <h2 className="text-sm font-semibold text-ink">🕰️ Time Tool <span className="font-normal text-ink-soft">· நேரக் கருவி</span></h2>
        <button type="button" onClick={() => { setAnimating(false); onClose(); }} className="text-lg leading-none text-ink-soft hover:text-ink" aria-label="மூடு">✕</button>
      </div>
      <div className="space-y-2 p-3">
        <p className="text-[11px] text-ink-soft">{chart ? `${chart.name} · ${place.placeName ?? ''}` : 'திறந்த ஜாதகம் இல்லை'}</p>
        <div className="flex gap-2">
          <input type="date" value={TimeTool.localDateText(ms, offset)} onChange={(e) => e.target.value && setDate(e.target.value)} aria-label="Date" className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-2 py-1 text-sm" />
          <input type="time" step={1} value={TimeTool.localTimeText(ms, offset)} onChange={(e) => e.target.value && setTime(e.target.value)} aria-label="Time" className="w-28 rounded-lg border border-line bg-bg px-2 py-1 text-sm" />
        </div>
        <p className="text-xs font-semibold text-ink" aria-live="polite">{atMs == null ? 'இப்போது · Real time' : label(ms)}</p>
        <div className="grid grid-cols-2 gap-1">
          {UNITS.map((u) => (
            <div key={u.unit} className={`flex items-stretch overflow-hidden rounded border ${unit === u.unit ? 'border-saffron bg-saffron/15' : 'border-line'}`}>
              <button type="button" disabled={busy} onClick={() => void step(-1, u.unit)} className="px-1.5 text-sm text-ink-soft hover:bg-saffron/20 disabled:opacity-40" aria-label={`${u.unit} back`}>−</button>
              <button type="button" onClick={() => setUnit(u.unit)} className="flex-1 truncate px-0.5 py-1 text-[11px] leading-tight text-ink" title={u.ta}>{u.unit}</button>
              <button type="button" disabled={busy} onClick={() => void step(1, u.unit)} className="px-1.5 text-sm text-ink-soft hover:bg-saffron/20 disabled:opacity-40" aria-label={`${u.unit} forward`}>+</button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className={plainButton} onClick={() => setAnimating((a) => !a)}>{animating ? '⏸ Stop' : `▶ Animate (${unit})`}</button>
          <button type="button" className={plainButton} onClick={() => { setAnimating(false); setAt(null); }}>⏱ Real time</button>
          <button type="button" className={plainButton} onClick={savePick}>＋ Save</button>
        </div>
        {picks.length > 0 && (
          <select value="" onChange={(e) => e.target.value && setAt(Number(e.target.value))} className="w-full rounded-lg border border-line bg-bg px-2 py-1 text-xs" aria-label="Saved moments">
            <option value="">Saved moments · சேமித்த நேரங்கள்</option>
            {picks.map((p) => <option key={p} value={p}>{label(p)}</option>)}
          </select>
        )}
        {error && <p className="text-xs text-rose">{error}</p>}
      </div>
    </div>
  );
}

export function ToolDialogs({ view, setView, openSettingsAt }: { view: ToolView; setView: (v: ToolView) => void; openSettingsAt: (sectionId: string) => void }) {
  const close = () => setView(null);
  const { prefs } = useScreenPrefs();
  const chart = useOpenChart();
  const [dismissed, setDismissed] = useState(false);
  const alwaysOn = prefs.alwaysShowTimeTool && !!chart && !dismissed;

  if (view === 'worksheet') return <WorksheetDialog onClose={close} />;
  if (view === 'screen') return <ScreenDialog onClose={close} />;
  if (view === 'chartstyle') return <ChartStyleDialog onClose={close} />;
  if (view === 'colors') return <ColorsDialog onClose={close} />;
  if (view === 'place') return <PlaceDialog onClose={close} />;
  if (view === 'time' || alwaysOn) return <TimeToolPanel onClose={() => { close(); setDismissed(true); }} />;

  if (view === 'tiles') {
    const open = (opens: string) => {
      if (opens.startsWith('settings:')) { close(); openSettingsAt(`settings-${opens.slice('settings:'.length)}`); return; }
      setView(opens as ToolView);
    };
    return (
      <Shell title="Tools" ta="கருவிகள்" onClose={close} wide>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {TOOL_TILES.map((t) => (
            <button key={t.key} type="button" onClick={() => open(t.opens)} data-tile={t.key}
              className="flex flex-col items-center gap-1 rounded-xl border border-line bg-bg px-2 py-3 text-center hover:border-saffron hover:bg-saffron/10">
              <span className="text-2xl" aria-hidden>{t.icon}</span>
              <span className="text-sm font-semibold text-ink">{t.label}</span>
              <span className="text-xs text-ink-soft">{t.ta}</span>
              {t.opens === 'place' && <span className="text-[10px] text-rose">விரைவில்</span>}
            </button>
          ))}
        </div>
        <div className="text-right"><button type="button" className={plainButton} onClick={close}>Cancel · ரத்து</button></div>
      </Shell>
    );
  }
  return null;
}
