'use client';

import { useEffect, useMemo, useState } from 'react';
import { childrenOf, chainAt, localText, MAX_LEVELS } from '@/src/dasha/dashaDrill';
import { DASHA_LEVEL_TA } from '@/src/sources/tamilNames';
import { ABBR } from '@/src/worksheet/dashaList';
import { PLANET_COLOR, PLANET_TA } from '../worksheet/worksheetStyle';

/**
 * The dasha periods to five levels, one tap at a time: a tap on a period opens the nine inside it (தசை → புக்தி → அந்தரம் →
 * சூட்சமம் → பிராணன்), each with the date and time it begins and the date and time it ends, in the birth place's time.
 * The division is src/dasha/dashaDrill.js's, which the tests hold to the Vimshottari engine's; nothing is calculated here
 * beyond it. The periods running at `nowJd` are open to begin with.
 */

export interface TreePeriod { lord: string; startJd: number; endJd: number; fullStartJd?: number }

/** 'YYYY-MM-DD HH:mm' as 'dd-mm-yyyy HH:mm'. */
export const dmyHm = (text: string) => {
  const [date, time] = text.split(' ');
  const [y, m, d] = date.split('-');
  return `${d}-${m}-${y} ${time}`;
};

/** A length of time in the largest units that say it: years, months and days; days and hours; hours and minutes. */
export function spanText(days: number): string {
  const minutes = Math.round(days * 1440);
  if (days >= 365.25 * 0.995) {
    let y = Math.floor(days / 365.25);
    const rest = days - y * 365.25;
    let m = Math.floor(rest / 30.4375);
    let d = Math.round(rest - m * 30.4375);
    if (d >= 30) { d -= 30; m += 1; }
    if (m >= 12) { m -= 12; y += 1; }
    return `${y} ஆண்டு ${m} மாதம் ${d} நாள்`;
  }
  if (days >= 30.4375 * 0.995) {
    let m = Math.floor(days / 30.4375);
    let d = Math.round(days - m * 30.4375);
    if (d >= 30) { d -= 30; m += 1; }
    return `${m} மாதம் ${d} நாள்`;
  }
  if (minutes >= 1440) return `${Math.floor(minutes / 1440)} நாள் ${Math.round((minutes % 1440) / 60)} மணி`;
  return `${Math.floor(minutes / 60)} மணி ${minutes % 60} நிமிடம்`;
}

const LEVEL_TONE = ['border-saffron', 'border-teal', 'border-indigo', 'border-rose', 'border-ink-soft'];

interface NodeProps {
  period: TreePeriod;
  level: number;
  path: string;
  open: Set<string>;
  toggle: (path: string) => void;
  nowJd: number;
  offset: number;
}

function Node({ period, level, path, open, toggle, nowJd, offset }: NodeProps) {
  const isOpen = open.has(path);
  const leaf = level >= MAX_LEVELS;
  const running = period.startJd <= nowJd && nowJd < period.endJd;
  const color = PLANET_COLOR[ABBR[period.lord]];
  const kids = isOpen && !leaf ? childrenOf(period) : [];
  const started = period.fullStartJd !== undefined;
  return (
    <li>
      <button
        type="button"
        onClick={() => !leaf && toggle(path)}
        aria-expanded={leaf ? undefined : isOpen}
        disabled={leaf}
        className={`w-full rounded-xl border border-l-4 px-3 py-2 text-left transition ${LEVEL_TONE[level - 1]} ${running ? 'bg-saffron/15 shadow-sm' : 'bg-surface hover:bg-saffron/10'} ${leaf ? 'cursor-default' : ''}`}
      >
        <span className="flex items-center gap-2">
          <span className="w-4 shrink-0 text-center text-xs text-ink-soft" aria-hidden>{leaf ? '•' : isOpen ? '▾' : '▸'}</span>
          <span className="text-[15px] font-bold" style={{ color }}>{PLANET_TA[period.lord]}</span>
          <span className="text-[11px] font-semibold text-ink-soft">{DASHA_LEVEL_TA[level - 1]}</span>
          {running && <span className="rounded-full bg-rose/15 px-2 text-[10px] font-semibold text-rose">நடப்பு</span>}
          {started && level === 1 && <span className="rounded-full bg-ink/10 px-2 text-[10px] text-ink-soft">பிறப்பில் இருப்பு</span>}
          <span className="ml-auto hidden text-[11px] text-ink-soft sm:inline">{spanText(period.endJd - period.startJd)}</span>
        </span>
        <span className="mt-0.5 block pl-6 text-xs tabular-nums text-ink">
          {dmyHm(localText(period.startJd, offset))} <span className="text-ink-soft">→</span> {dmyHm(localText(period.endJd, offset))}
        </span>
        <span className="block pl-6 text-[11px] text-ink-soft sm:hidden">{spanText(period.endJd - period.startJd)}</span>
      </button>
      {isOpen && !leaf && (
        <ul className="ml-3 mt-1.5 space-y-1.5 border-l-2 border-line/70 pl-2 sm:ml-5 sm:pl-3">
          {kids.map((kid) => (
            <Node key={`${kid.lord}-${kid.startJd}`} period={kid} level={level + 1} path={`${path}/${kid.lord}`} open={open} toggle={toggle} nowJd={nowJd} offset={offset} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DashaTree({ mahadashas, nowJd, offset }: { mahadashas: TreePeriod[]; nowJd: number; offset: number }) {
  // The running chain, down to the fourth level: its children (the fifth) show without a tap
  const runningPaths = useMemo(() => {
    const chain = chainAt(mahadashas, nowJd, MAX_LEVELS);
    const paths: string[] = [];
    let path = '';
    for (const p of chain.slice(0, MAX_LEVELS - 1)) { path = path ? `${path}/${p.lord}` : p.lord; paths.push(path); }
    return paths;
  }, [mahadashas, nowJd]);

  const [open, setOpen] = useState<Set<string>>(() => new Set(runningPaths));
  useEffect(() => { setOpen(new Set(runningPaths)); }, [runningPaths]);

  const toggle = (path: string) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(path)) {
      // closing a period closes what was open inside it
      for (const p of prev) if (p === path || p.startsWith(`${path}/`)) next.delete(p);
    } else next.add(path);
    return next;
  });

  const pill = 'px-3 py-1 rounded-full border border-line bg-surface text-xs text-ink hover:border-saffron hover:bg-saffron/10 transition';
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button type="button" className={pill} onClick={() => setOpen(new Set(runningPaths))}>⏱ நடப்புக் காலத்தைத் திற</button>
        <button type="button" className={pill} onClick={() => setOpen(new Set())}>அனைத்தையும் மூடு</button>
        <span className="text-[11px] text-ink-soft">ஒரு காலத்தைத் தொட்டால் அதற்குள் உள்ள அடுத்த நிலை திறக்கும்.</span>
      </div>
      <ul className="space-y-1.5">
        {mahadashas.map((m) => (
          <Node key={`${m.lord}-${m.startJd}`} period={m} level={1} path={m.lord} open={open} toggle={toggle} nowJd={nowJd} offset={offset} />
        ))}
      </ul>
    </div>
  );
}
