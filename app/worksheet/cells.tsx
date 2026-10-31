'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { fromVargas } from '@/src/charts/kattam/rasiNames';
import { ABBR, currentPeriodIndex, dashaWindow } from '@/src/worksheet/dashaList';
import { WorksheetChart, type ChartEntry, type HouseBadge } from './WorksheetChart';
import { DIGNITY_TA, PLANET_COLOR, PLANET_TA, TONE_CLASS, VARGA_OPTIONS } from './worksheetStyle';

/**
 * The cells of the worksheet. Each is a card with a title and, where the cell can show more than one thing, a drop-down to
 * change what it shows (PL9: "double click the field and pick another item"). The choice is remembered by the page.
 */

export interface WorksheetData {
  native: { name: string | null; date: string; time: string; placeName: string | null };
  birth: { name: string; gender: string; year: number; month: number; day: number; hour: number; minute: number; placeName: string; latitude: number; longitude: number; utcOffsetMinutes: number };
  engine: { ayanamsha: string; houseSystem: string; nodeType: string };
  lagnaRasiIndex: number;
  planets: {
    id: string; abbr: string; rasiIndex: number; degreeInSign: number; degreeText: string; nakshatra: string;
    nakshatraAbbr: string; pada: number; lords: string[]; lordsText: string;
  }[];
  strength: {
    id: string; abbr: string; dignity: string; shadbalaTotal: number; shadbalaRatio: number; shadbalaMinimum: number;
    vimshopaka: number | null; ownSignBindus: number; jagradadi: string; baladi: string;
  }[];
  /** Gulika, drawn in the charts; null when there is none. */
  gulika: { abbr: string; rasiIndex: number; degreeText: string; nakshatraAbbr: string } | null;
  houses: { house: number; rasiIndex: number; sav: number }[];
  vargas: Record<string, Record<string, { signIndex?: number }>>;
  sarva: number[];
  periods: { md: string; ad: string; startLocal: string }[];
  dashaYearDays: number;
  balance: 'degree' | 'time';
}

interface DashaRow {
  index: number; md: string; ad: string; mdAbbr: string; adAbbr: string; date: string; weekday: string; startLocal: string; isCurrent: boolean;
}

export type CellId = 'main' | 'side' | 'dasha' | 'planets' | 'strength' | 'graph';
export type CellChoices = Record<CellId, string>;
export const DEFAULT_CHOICES: CellChoices = { main: 'D1', side: 'D9', dasha: 'vimshottari', planets: 'planets', strength: 'strength', graph: 'shadbala' };

export const CELL_OPTIONS: Record<CellId, { value: string; label: string }[]> = {
  main: VARGA_OPTIONS,
  side: VARGA_OPTIONS,
  dasha: [{ value: 'vimshottari', label: 'விம்சோத்தரி தசை' }],
  planets: [{ value: 'planets', label: 'கிரக விவரம்' }],
  strength: [{ value: 'strength', label: 'கிரக நிலை & பலம்' }],
  graph: [
    { value: 'shadbala', label: 'சட்பலம்' },
    { value: 'sav', label: 'சர்வாஷ்டகவர்க்கம் — பாவம் வாரியாக' },
  ],
};

/** A card: title, an optional switcher for what it shows, and the content. */
export function CellFrame({ id, choice, onChoice, children, className = '', extra }: {
  id: CellId; choice: string; onChoice: (value: string) => void; children: ReactNode; className?: string; extra?: ReactNode;
}) {
  const options = CELL_OPTIONS[id];
  const current = options.find((o) => o.value === choice) ?? options[0];
  return (
    <section className={`bg-surface border border-line rounded-2xl overflow-hidden shadow-sm flex flex-col ${className}`}>
      <header className="flex items-center justify-between gap-2 px-3 py-2 border-b border-line bg-gradient-to-r from-saffron/20 via-saffron/5 to-transparent">
        {options.length > 1 ? (
          <label className="flex items-center gap-1 min-w-0">
            <span className="sr-only">{current.label} — உள்ளடக்கத்தை மாற்று</span>
            <select
              value={current.value}
              onChange={(e) => onChoice(e.target.value)}
              className="bg-transparent font-[family-name:var(--font-tamil-serif)] text-sm font-semibold text-ink cursor-pointer max-w-full truncate focus:outline-none focus:ring-1 focus:ring-saffron rounded"
            >
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        ) : (
          <h2 className="font-[family-name:var(--font-tamil-serif)] text-sm font-semibold text-ink truncate">{current.label}</h2>
        )}
        {extra}
      </header>
      <div className="p-3 flex-1 min-h-0">{children}</div>
    </section>
  );
}

const emptyRasi = (): ChartEntry[][] => Array.from({ length: 12 }, () => []);

/** A chart cell: the Rasi with its house strengths and degrees, or any divisional chart. */
export function ChartCell({ data, which, variant }: { data: WorksheetData; which: string; variant: 'main' | 'side' }) {
  const view = useMemo(() => {
    const entries = emptyRasi();
    if (which === 'D1') {
      for (const p of data.planets) {
        entries[p.rasiIndex].push({ abbr: p.abbr, detail: variant === 'main' ? `${p.degreeText.slice(0, 5)} ${p.nakshatraAbbr}` : undefined });
      }
      if (data.gulika) {
        entries[data.gulika.rasiIndex].push({ abbr: data.gulika.abbr, detail: variant === 'main' ? `${data.gulika.degreeText.slice(0, 5)} ${data.gulika.nakshatraAbbr}` : undefined });
      }
      const badges: HouseBadge[] = Array.from({ length: 12 }, () => ({ house: 0 }));
      for (const h of data.houses) badges[h.rasiIndex] = { house: h.house, sav: variant === 'main' ? h.sav : undefined };
      return { lagna: data.lagnaRasiIndex, entries, badges };
    }
    const v = fromVargas(data.vargas, which);
    if (!v) return null;
    entries[v.lagnaRasiIndex].push({ abbr: 'As' });
    for (const g of v.grahas) entries[g.rasiIndex].push({ abbr: ABBR[g.id] ?? g.id.slice(0, 2) });
    const badges: HouseBadge[] = Array.from({ length: 12 }, (_, rasi) => ({ house: ((rasi - v.lagnaRasiIndex + 12) % 12) + 1 }));
    return { lagna: v.lagnaRasiIndex, entries, badges };
  }, [data, which, variant]);

  if (!view) return <p className="text-sm text-ink-soft">இந்த வர்க்கத்துக்குக் கட்டம் இல்லை.</p>;
  const title = VARGA_OPTIONS.find((o) => o.value === which)?.label ?? which;
  return (
    <div className={variant === 'main' ? 'max-w-[40rem] mx-auto' : 'max-w-[22rem] mx-auto'}>
      <WorksheetChart
        lagnaRasiIndex={view.lagna}
        entriesByRasi={view.entries}
        badges={view.badges}
        dense={variant === 'side'}
        center={
          <div className="leading-snug">
            <p className={`font-[family-name:var(--font-tamil-serif)] font-bold text-ink ${variant === 'main' ? 'text-base' : 'text-sm'}`}>{data.native.name ?? ''}</p>
            <p className="text-[10px] text-ink-soft tabular-nums">{data.native.date} · {data.native.time}</p>
            <p className="text-[10px] text-ink-soft">{variant === 'main' ? data.native.placeName : title}</p>
          </div>
        }
      />
      {which === 'D1' && variant === 'main' && (
        <p className="text-[10px] text-ink-soft mt-1.5 text-center">
          மூலையில்: பாவ எண், சர்வாஷ்டகவர்க்க பிந்துக்கள் (மொத்தம் 337) · கீழே ஒவ்வொரு கிரகத்தின் பாகை, நட்சத்திரம்
        </p>
      )}
    </div>
  );
}

const th = 'py-1 pr-2 text-left font-medium text-ink-soft whitespace-nowrap';
const td = 'py-1 pr-2 whitespace-nowrap tabular-nums';

/** Planets, with degrees, nakshatra, pada and the star, sub and sub-sub lords. */
export function PlanetsCell({ data }: { data: WorksheetData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-line"><th className={th}></th><th className={th}>பாகை</th><th className={th}>நட்சத்திரம்</th><th className={th} title="பாதம், நட்சத்திர / உப / உப-உப அதிபதிகள்">பாதம், அதிபதிகள்</th></tr>
        </thead>
        <tbody>
          {data.planets.map((p) => (
            <tr key={p.id} className="border-b border-line/40">
              <td className="py-1 pr-2 font-semibold" style={{ color: PLANET_COLOR[p.abbr] }} title={PLANET_TA[p.id]}>{p.abbr}</td>
              <td className={td}>{p.degreeText}</td>
              <td className={td}>{p.nakshatra}</td>
              <td className={`${td} font-mono`}>{p.lordsText}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The seven planets' dignity, Shad Bala share, Vimshopaka, own-sign Ashtakavarga and avasthas. */
export function StrengthCell({ data }: { data: WorksheetData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-line">
            <th className={th}></th><th className={th}>நிலை</th>
            <th className={th} title="சட்பலம், BPHS தேவையின் %">சட்</th>
            <th className={th} title="ஷட்வர்க்க விம்சோபக பலம் (20-க்கு)">விம்</th>
            <th className={th} title="தன் ராசியில் பிண்ணாஷ்டகவர்க்க பிந்துக்கள்">அஷ்ட</th>
            <th className={th}>ஜாக்ரதாதி</th><th className={th}>பாலாதி</th>
          </tr>
        </thead>
        <tbody>
          {data.strength.map((s) => {
            const d = DIGNITY_TA[s.dignity] ?? { label: s.dignity, tone: 'ok' as const };
            return (
              <tr key={s.id} className="border-b border-line/40">
                <td className="py-1 pr-2 font-semibold" style={{ color: PLANET_COLOR[s.abbr] }} title={PLANET_TA[s.id]}>{s.abbr}</td>
                <td className={`${td} ${TONE_CLASS[d.tone]}`}>{d.label}</td>
                <td className={`${td} ${s.shadbalaRatio >= 1 ? 'text-teal' : 'text-rose'}`}>{s.shadbalaRatio.toFixed(2)}</td>
                <td className={td}>{s.vimshopaka != null ? Math.round(s.vimshopaka) : '—'}</td>
                <td className={td}>{s.ownSignBindus}</td>
                <td className={td}>{s.jagradadi}</td>
                <td className={td}>{s.baladi}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-[10px] text-ink-soft mt-2">
        சட் = சட்பலம் ÷ BPHS குறைந்தபட்சம் (1 அல்லது மேல் = வலிமை; பச்சை/சிவப்பு) · விம் = ஷட்வர்க்க விம்சோபக பலம் · அஷ்ட = தன் ராசியில் உள்ள பிண்ணாஷ்டகவர்க்க பிந்து
      </p>
    </div>
  );
}

/** The Vimshottari list: the running period first, a click on a row moves the date to it. */
export function DashaCell({ data, asOf, onPick }: { data: WorksheetData; asOf: string; onPick: (date: string) => void }) {
  const [shift, setShift] = useState(0);
  const current = useMemo(() => currentPeriodIndex(data.periods, asOf), [data.periods, asOf]);
  const win = useMemo(
    () => dashaWindow(data.periods, asOf, current + shift, 10) as { current: number; first: number; rows: DashaRow[] },
    [data.periods, asOf, current, shift],
  );
  const atStart = win.first === 0;
  const atEnd = win.first + win.rows.length >= data.periods.length;
  const btn = 'px-2 py-0.5 rounded-full border border-line text-xs text-ink-soft hover:text-ink hover:bg-saffron/15 disabled:opacity-30 disabled:hover:bg-transparent';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] text-ink-soft">தசை ஆண்டு {data.dashaYearDays} நாள் · {data.balance === 'time' ? 'நேரம்' : 'பாகை'} சமன்</p>
        <div className="flex gap-1">
          <button type="button" className={btn} disabled={atStart} onClick={() => setShift((s) => s - 5)} aria-label="முந்தைய காலங்கள்">▲</button>
          <button type="button" className={btn} disabled={atEnd} onClick={() => setShift((s) => s + 5)} aria-label="அடுத்த காலங்கள்">▼</button>
          <button type="button" className={btn} disabled={shift === 0} onClick={() => setShift(0)}>நடப்பு</button>
        </div>
      </div>
      <ul className="text-xs divide-y divide-line/40">
        {win.rows.map((r) => (
          <li key={r.index}>
            <button
              type="button"
              onClick={() => onPick(r.startLocal.slice(0, 10))}
              className={`w-full grid grid-cols-[4.5rem_2.5rem_1fr] items-center gap-2 py-1 px-1.5 rounded text-left hover:bg-saffron/10 ${r.isCurrent ? 'bg-saffron/20 font-semibold ring-1 ring-saffron/50' : ''}`}
              title="இந்தத் தேதிக்கு மாற்று"
            >
              <span className="font-mono">
                <span style={{ color: PLANET_COLOR[r.mdAbbr] }}>{r.mdAbbr}</span>
                <span className="text-ink-soft">-</span>
                <span style={{ color: PLANET_COLOR[r.adAbbr] }}>{r.adAbbr}</span>
              </span>
              <span className="text-ink-soft">{r.weekday}</span>
              <span className="tabular-nums">{r.date}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Bars against a threshold line: green above it, red below, as PL9 draws the Shad Bala. */
function Bars({ items, max, threshold, format }: {
  items: { key: string; label: string; value: number; color?: string }[]; max: number; threshold: number; format: (v: number) => string;
}) {
  const line = (threshold / max) * 100;
  return (
    <div className="relative h-52 rounded-xl overflow-hidden border border-line bg-teal/30">
      <div className="absolute inset-x-0 bottom-0 bg-rose/35" style={{ height: `${line}%` }} />
      <div className="absolute inset-x-0 border-t border-dashed border-ink/40" style={{ bottom: `${line}%` }} />
      <div className="absolute inset-0 flex items-end gap-1 px-1.5 pb-1">
        {items.map((it) => (
          <div key={it.key} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
            <div
              className="w-full rounded-t-md bg-surface border border-ink/50 flex flex-col items-center justify-end pb-0.5 overflow-hidden"
              style={{ height: `${Math.min(100, (it.value / max) * 100)}%`, minHeight: '1.75rem' }}
              title={`${it.label}: ${format(it.value)}`}
            >
              <span className="text-[11px] font-bold leading-none" style={{ color: it.color }}>{it.label}</span>
              <span className="text-[9px] text-ink-soft leading-tight tabular-nums">{format(it.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The Shad Bala graph (each planet's strength against its BPHS minimum) or the Sarvashtakavarga points of each house. */
export function GraphCell({ data, which }: { data: WorksheetData; which: string }) {
  if (which === 'sav') {
    const items = data.houses.map((h) => ({ key: String(h.house), label: String(h.house), value: h.sav }));
    return (
      <>
        <Bars items={items} max={40} threshold={337 / 12} format={(v) => String(v)} />
        <p className="text-[10px] text-ink-soft mt-1.5">பாவம் 1–12 · கோடு = சராசரி 28 (337 ÷ 12) · மேலே பச்சை = சராசரிக்கு மேல்</p>
      </>
    );
  }
  const items = data.strength.map((s) => ({ key: s.id, label: s.abbr, value: s.shadbalaRatio, color: PLANET_COLOR[s.abbr] }));
  return (
    <>
      <Bars items={items} max={2} threshold={1} format={(v) => v.toFixed(2)} />
      <p className="text-[10px] text-ink-soft mt-1.5">
        சட்பலம் ÷ BPHS குறைந்தபட்சம். கோட்டுக்கு மேல் (பச்சை) = வலிமை, கீழ் (சிவப்பு) = குறைவு. Parashara&apos;s Light-இன் பணித்தாள் வேறு எண்களைக் காட்டுகிறது; இது ஜாதகப் புத்தகப் பக்கம் 11-இன் BPHS முறை.
      </p>
    </>
  );
}
