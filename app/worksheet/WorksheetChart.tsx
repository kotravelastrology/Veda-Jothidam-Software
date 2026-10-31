'use client';

import type { ReactNode } from 'react';
import { RASI_TA_SHORT } from '@/src/charts/kattam/rasiNames';
import { PLANET_COLOR } from './worksheetStyle';

/**
 * A South Indian chart for the worksheet: the signs stay where they are and the ascendant's house is marked. Each planet is
 * one line (its abbreviation and, in the Rasi, its degrees and nakshatra, as PL9 writes it "Mo 23:56 Rev"). In the Rasi
 * the house number and the Sarvashtakavarga points of the house are written in the corner of its cell, as PL9 writes them on
 * the chart's edge. The centre is free for a name.
 */

export interface ChartEntry {
  abbr: string;
  /** Degrees and nakshatra, shown after the abbreviation when there is room. */
  detail?: string;
}

export interface HouseBadge {
  house: number;
  /** Sarvashtakavarga points of the house. */
  sav?: number;
}

// Clockwise from the top left: Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius.
const CELLS: { rasiIndex: number; row: number; col: number }[] = [
  { rasiIndex: 11, row: 1, col: 1 }, { rasiIndex: 0, row: 1, col: 2 }, { rasiIndex: 1, row: 1, col: 3 }, { rasiIndex: 2, row: 1, col: 4 },
  { rasiIndex: 10, row: 2, col: 1 }, { rasiIndex: 3, row: 2, col: 4 },
  { rasiIndex: 9, row: 3, col: 1 }, { rasiIndex: 4, row: 3, col: 4 },
  { rasiIndex: 8, row: 4, col: 1 }, { rasiIndex: 7, row: 4, col: 2 }, { rasiIndex: 6, row: 4, col: 3 }, { rasiIndex: 5, row: 4, col: 4 },
];

export function WorksheetChart({ lagnaRasiIndex, entriesByRasi, badges, center, dense = false }: {
  lagnaRasiIndex: number;
  /** Twelve lists, one per sign (0 = Aries). */
  entriesByRasi: ChartEntry[][];
  /** Twelve badges, one per sign (0 = Aries), for the Rasi chart. */
  badges?: HouseBadge[];
  center?: ReactNode;
  /** Smaller text, for the side chart. */
  dense?: boolean;
}) {
  return (
    <div
      className="grid w-full aspect-square rounded-xl overflow-hidden border-2 border-ink/60 bg-surface"
      style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)' }}
    >
      {CELLS.map(({ rasiIndex, row, col }) => {
        const isLagna = rasiIndex === lagnaRasiIndex;
        const badge = badges?.[rasiIndex];
        return (
          <div
            key={rasiIndex}
            className={`relative border border-ink/25 p-1 overflow-hidden flex flex-col ${isLagna ? 'bg-saffron/15' : ''}`}
            style={{ gridColumn: col, gridRow: row }}
          >
            <div className="flex items-start justify-between leading-none">
              <span className={`${dense ? 'text-[8px]' : 'text-[10px]'} text-ink-soft/80`}>{RASI_TA_SHORT[rasiIndex]}</span>
              {badge && (
                <span className={`flex items-center gap-0.5 ${dense ? 'text-[9px]' : 'text-[11px]'} text-ink-soft tabular-nums`}>
                  <span>{badge.house}</span>
                  {badge.sav != null && (
                    <span className={`rounded-full bg-ink/8 px-1 py-px ${dense ? 'text-[8px]' : 'text-[10px]'} font-semibold text-ink`} title="சர்வாஷ்டகவர்க்க பிந்துக்கள்">{badge.sav}</span>
                  )}
                </span>
              )}
            </div>
            {isLagna && <span className={`absolute right-1 bottom-0.5 ${dense ? 'text-[8px]' : 'text-[11px]'} font-bold text-saffron`}>லக்</span>}
            <div className={`mt-0.5 flex ${dense ? 'flex-row flex-wrap gap-x-1.5' : 'flex-col'} gap-y-px`}>
              {entriesByRasi[rasiIndex].map((e, i) => (
                <span key={`${e.abbr}-${i}`} className={`${dense ? 'text-[11px]' : 'text-[13px] sm:text-[16px]'} font-semibold leading-tight whitespace-nowrap`} style={{ color: PLANET_COLOR[e.abbr] }}>
                  {e.abbr}
                  {e.detail && <span className="ml-1 font-normal text-[10px] sm:text-[11px] text-ink-soft tabular-nums">{e.detail}</span>}
                </span>
              ))}
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-center text-center px-2 border border-ink/15" style={{ gridColumn: '2 / span 2', gridRow: '2 / span 2' }}>
        {center}
      </div>
    </div>
  );
}
