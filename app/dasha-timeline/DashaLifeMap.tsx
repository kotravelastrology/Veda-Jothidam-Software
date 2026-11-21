'use client';

import { useEffect, useMemo, useState } from 'react';
import { childrenOf, localText } from '@/src/dasha/dashaDrill';
import { ABBR } from '@/src/worksheet/dashaList';
import { PLANET_COLOR, PLANET_TA } from '../worksheet/worksheetStyle';
import { dmyHm, spanText, type TreePeriod } from './DashaTree';

const YEAR_DAYS = 365.2425;

interface Seg { lord: string; startJd: number; endJd: number; fullStartJd?: number }

/** One bar of periods, each as wide as it is long, each a button; a marker where `markJd` falls. */
function Bar({ segs, spanStart, spanDays, markJd, markLabel, selected, onPick, offset, ageOf, height }: {
  segs: Seg[]; spanStart: number; spanDays: number; markJd: number; markLabel: string;
  selected: number | null; onPick?: (i: number) => void; offset: number; ageOf: (jd: number) => number; height: string;
}) {
  const markPct = ((markJd - spanStart) / spanDays) * 100;
  const inside = markPct >= 0 && markPct <= 100;
  return (
    <div className="relative pt-5">
      {inside && (
        <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: `${markPct}%` }} aria-hidden>
          <span className="absolute -top-0.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-1.5 py-px text-[10px] font-semibold text-bg">{markLabel}</span>
          <span className="absolute bottom-0 top-4 w-0.5 -translate-x-1/2 bg-ink" />
        </div>
      )}
      <div className={`flex ${height} overflow-hidden rounded-lg bg-line/20`} role="group">
        {segs.map((s, i) => {
          const widthPct = ((s.endJd - s.startJd) / spanDays) * 100;
          const here = s.startJd <= markJd && markJd < s.endJd;
          const abbr = ABBR[s.lord as keyof typeof ABBR];
          const label = `${PLANET_TA[s.lord]} ${dmyHm(localText(s.startJd, offset)).slice(0, 10)} முதல் ${dmyHm(localText(s.endJd, offset)).slice(0, 10)} வரை, வயது ${ageOf(s.startJd).toFixed(1)} முதல் ${ageOf(s.endJd).toFixed(1)} வரை`;
          return (
            <button
              key={`${s.lord}-${s.startJd}`}
              type="button"
              onClick={onPick ? () => onPick(i) : undefined}
              disabled={!onPick}
              aria-pressed={onPick ? selected === i : undefined}
              aria-label={label}
              title={label}
              className={`relative flex min-w-0 items-center justify-center overflow-hidden text-[11px] font-bold text-white transition-[opacity,filter] enabled:hover:brightness-110 disabled:cursor-default ${selected === i ? 'ring-2 ring-inset ring-ink' : ''}`}
              style={{ width: `${widthPct}%`, backgroundColor: PLANET_COLOR[abbr], opacity: here || selected === i ? 1 : 0.62 }}
            >
              <span className="truncate px-0.5">{widthPct > 6 ? PLANET_TA[s.lord] : widthPct > 3 ? abbr : ''}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The dasha life map: the nine mahadashas as one bar, each as wide as it is long, with the person's age along it and a marker for the
 * moment the page is read at. A tap on a mahadasha opens a bar of its nine bhuktis under it, with the same marker; the page's tree
 * below goes down to the other levels. The division of a period into its nine is src/dasha/dashaDrill.js's, which the tests hold to the
 * Vimshottari engine's; nothing is calculated here beyond it.
 */
export function DashaLifeMap({ mahadashas, birthJd, asOfJd, offset, asOfLabel }: {
  mahadashas: TreePeriod[]; birthJd: number; asOfJd: number; offset: number; asOfLabel: string;
}) {
  const runningIndex = useMemo(() => {
    const i = mahadashas.findIndex((m) => m.startJd <= asOfJd && asOfJd < m.endJd);
    return i >= 0 ? i : null;
  }, [mahadashas, asOfJd]);
  const [picked, setPicked] = useState<number | null>(null);
  // The running mahadasha is open to begin with, and again when the moment changes into another one
  useEffect(() => { setPicked(runningIndex); }, [runningIndex, mahadashas]);

  const spanStart = mahadashas[0]?.startJd ?? birthJd;
  const spanDays = Math.max(1, (mahadashas.at(-1)?.endJd ?? spanStart + 1) - spanStart);
  const ageOf = (jd: number) => (jd - birthJd) / YEAR_DAYS;
  const sel = picked != null ? mahadashas[picked] : null;
  const subs = useMemo(() => (sel ? (childrenOf(sel) as Seg[]) : []), [sel]);
  const subStart = subs[0]?.startJd ?? 0;
  const subDays = Math.max(1, (subs.at(-1)?.endJd ?? 1) - subStart);

  const ticks = useMemo(() => {
    const out: { pct: number; age: number }[] = [];
    for (let age = 0; ; age += 10) {
      const pct = ((birthJd + age * YEAR_DAYS - spanStart) / spanDays) * 100;
      if (pct > 100.01) break;
      if (pct >= 0) out.push({ pct, age });
    }
    return out;
  }, [birthJd, spanStart, spanDays]);

  const ageNow = ageOf(asOfJd);
  const markLabel = `${asOfLabel} · வயது ${ageNow.toFixed(1)}`;

  return (
    <section className="mb-4 rounded-2xl border border-line bg-surface p-3 shadow-sm sm:p-4" aria-label="தசைகளின் வாழ்க்கை வரைபடம்" data-testid="dasha-life-map">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
        <h2 className="font-[family-name:var(--font-tamil-serif)] text-base font-bold text-ink">வாழ்க்கை வரைபடம் — 120 ஆண்டு</h2>
        <span className="text-[11px] text-ink-soft">ஒரு தசையைத் தொட்டால் அதன் புக்திகள் கீழே</span>
      </div>

      <Bar segs={mahadashas} spanStart={spanStart} spanDays={spanDays} markJd={asOfJd} markLabel={markLabel} selected={picked} onPick={setPicked} offset={offset} ageOf={ageOf} height="h-11" />
      <div className="relative mt-1 h-4 text-[10px] tabular-nums text-ink-soft" aria-hidden>
        {ticks.map((t) => (
          <span key={t.age} className="absolute -translate-x-1/2" style={{ left: `${t.pct}%` }}>{t.age}</span>
        ))}
      </div>
      <p className="text-right text-[10px] text-ink-soft">வயது (ஆண்டு)</p>

      {sel && subs.length > 0 && (
        <div className="mt-2 rounded-xl border border-line bg-surface-2/40 p-2.5" data-testid="dasha-life-map-detail">
          <p className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 text-xs text-ink">
            <span><strong style={{ color: PLANET_COLOR[ABBR[sel.lord as keyof typeof ABBR]] }}>{PLANET_TA[sel.lord]} தசை</strong> · {dmyHm(localText(sel.startJd, offset)).slice(0, 10)} → {dmyHm(localText(sel.endJd, offset)).slice(0, 10)}</span>
            <span className="tabular-nums text-ink-soft">வயது {ageOf(sel.startJd).toFixed(1)} – {ageOf(sel.endJd).toFixed(1)} · {spanText(sel.endJd - sel.startJd)}</span>
          </p>
          <Bar segs={subs} spanStart={subStart} spanDays={subDays} markJd={asOfJd} markLabel={asOfLabel} selected={null} offset={offset} ageOf={ageOf} height="h-8" />
          <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] tabular-nums text-ink-soft sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {subs.map((s) => (
              <span key={`${s.lord}-${s.startJd}`} className={`whitespace-nowrap ${s.startJd <= asOfJd && asOfJd < s.endJd ? 'font-semibold text-ink' : ''}`}>
                <span style={{ color: PLANET_COLOR[ABBR[s.lord as keyof typeof ABBR]] }}>●</span> {PLANET_TA[s.lord]} {dmyHm(localText(s.startJd, offset)).slice(3, 10)}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
