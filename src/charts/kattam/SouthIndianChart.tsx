'use client';

import { GRAHA_TA_SHORT, fmtDegMin, type ChartGraha } from './rasiNames';

export interface VedicChartProps {
  lagnaRasiIndex: number;
  grahas: ChartGraha[];
  transitGrahas?: ChartGraha[];
  title?: string;
  centerNote?: string;
  /** px; the chart is a square, this sets its side. Default 420. */
  size?: number;
}

// Fixed South Indian layout — rāśi NEVER rotates with Lagna, only the "லக்"
// marker moves. Clockwise from top-left: Meena, Mesha, Vrishabha, Mithuna,
// Kataka, Simha, Kanya, Tula, Vrischika, Dhanu, Makara, Kumbha. The sign's
// place in the square says which sign it is, so no sign name is written in it.
const CELLS: { rasiIndex: number; row: number; col: number }[] = [
  { rasiIndex: 11, row: 1, col: 1 }, { rasiIndex: 0, row: 1, col: 2 }, { rasiIndex: 1, row: 1, col: 3 }, { rasiIndex: 2, row: 1, col: 4 },
  { rasiIndex: 10, row: 2, col: 1 }, { rasiIndex: 3, row: 2, col: 4 },
  { rasiIndex: 9, row: 3, col: 1 }, { rasiIndex: 4, row: 3, col: 4 },
  { rasiIndex: 8, row: 4, col: 1 }, { rasiIndex: 7, row: 4, col: 2 }, { rasiIndex: 6, row: 4, col: 3 }, { rasiIndex: 5, row: 4, col: 4 },
];

function labelOf(g: ChartGraha) {
  return g.label ?? GRAHA_TA_SHORT[g.id] ?? g.id.slice(0, 2);
}

/**
 * Text sizes follow the width the chart is drawn at (it is a size container; cqw = 1% of its width), not the size asked for: a
 * 420 px chart on a phone is drawn about 330 px wide. A planet's name in bold; its degree beside it (only where the caller gives
 * one: the Rasi), on the next line when the box is too narrow.
 */
const NAME_SIZE = { fontSize: 'clamp(11px, 3.4cqw, 15px)' };
const DEG_SIZE = { fontSize: 'clamp(9px, 2.6cqw, 11.5px)' };

export function SouthIndianChart({ lagnaRasiIndex, grahas, transitGrahas, title, centerNote, size = 420 }: VedicChartProps) {
  const inCell = (rasiIndex: number) => grahas.filter((g) => g.rasiIndex === rasiIndex);
  const transitInCell = (rasiIndex: number) => (transitGrahas || []).filter((g) => g.rasiIndex === rasiIndex);

  return (
    <div className="flex w-full flex-col items-center">
      {title && <p className="text-center text-sm font-semibold text-ink mb-2">{title}</p>}
      <div
        className="kattam grid rounded-lg border-2 border-ink/70 bg-surface shadow-sm overflow-hidden"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', width: '100%', maxWidth: size, aspectRatio: '1 / 1', containerType: 'inline-size' }}
      >
        {CELLS.map(({ rasiIndex, row, col }) => {
          const isLagna = rasiIndex === lagnaRasiIndex;
          return (
            <div
              key={rasiIndex}
              className={`relative border border-ink/25 px-1 py-1 overflow-hidden flex flex-col ${isLagna ? 'bg-saffron/10' : ''}`}
              style={{ gridColumn: col, gridRow: row }}
            >
              {isLagna && (
                <span className="absolute bottom-0.5 right-1 text-[10px] font-bold text-saffron">லக்</span>
              )}
              <div className="flex flex-col items-start gap-y-0.5 flex-1">
                {inCell(rasiIndex).map((g, i) => (
                  <span key={`${g.id}-${i}`} style={NAME_SIZE} className={`leading-tight font-bold flex flex-wrap items-baseline gap-x-1 ${g.colorClass ?? 'text-ink'} ${g.emphasis ? 'bg-saffron/30 rounded px-0.5' : ''}`}>
                    <span className="whitespace-nowrap">{labelOf(g)}{g.retrograde ? <span className="font-semibold">(வ)</span> : null}</span>
                    {typeof g.degreeInSign === 'number' && <span style={DEG_SIZE} className="font-semibold text-ink-soft tabular-nums whitespace-nowrap">{fmtDegMin(g.degreeInSign)}</span>}
                  </span>
                ))}
                {transitInCell(rasiIndex).map((g, i) => (
                  <span key={`t-${g.id}-${i}`} style={DEG_SIZE} className="leading-tight font-bold text-rose whitespace-nowrap">
                    {labelOf(g)}{g.retrograde ? '(வ)' : ''}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        <div
          className="flex items-center justify-center text-center px-2 border border-ink/15"
          style={{ gridColumn: '2 / span 2', gridRow: '2 / span 2' }}
        >
          <span className="text-[11px] text-ink-soft leading-snug">{centerNote}</span>
        </div>
      </div>
      {transitGrahas && transitGrahas.length > 0 && (
        <p className="text-[11px] text-ink-soft mt-1">
          <span className="text-ink font-semibold">கருப்பு</span> = ஜாதகம் · <span className="text-rose font-semibold">சிவப்பு</span> = இன்றைய கோசாரம்
        </p>
      )}
    </div>
  );
}
