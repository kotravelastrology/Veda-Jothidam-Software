'use client';

import { GRAHA_TA_SHORT, RASI_TA_SHORT, fmtDegMin, type ChartGraha } from './rasiNames';

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
// Kataka, Simha, Kanya, Tula, Vrischika, Dhanu, Makara, Kumbha.
const CELLS: { rasiIndex: number; row: number; col: number }[] = [
  { rasiIndex: 11, row: 1, col: 1 }, { rasiIndex: 0, row: 1, col: 2 }, { rasiIndex: 1, row: 1, col: 3 }, { rasiIndex: 2, row: 1, col: 4 },
  { rasiIndex: 10, row: 2, col: 1 }, { rasiIndex: 3, row: 2, col: 4 },
  { rasiIndex: 9, row: 3, col: 1 }, { rasiIndex: 4, row: 3, col: 4 },
  { rasiIndex: 8, row: 4, col: 1 }, { rasiIndex: 7, row: 4, col: 2 }, { rasiIndex: 6, row: 4, col: 3 }, { rasiIndex: 5, row: 4, col: 4 },
];

function labelOf(g: ChartGraha) {
  return g.label ?? GRAHA_TA_SHORT[g.id] ?? g.id.slice(0, 2);
}

export function SouthIndianChart({ lagnaRasiIndex, grahas, transitGrahas, title, centerNote, size = 420 }: VedicChartProps) {
  const inCell = (rasiIndex: number) => grahas.filter((g) => g.rasiIndex === rasiIndex);
  const transitInCell = (rasiIndex: number) => (transitGrahas || []).filter((g) => g.rasiIndex === rasiIndex);

  return (
    <div className="flex flex-col items-center">
      {title && <p className="text-center text-sm font-semibold text-ink mb-2">{title}</p>}
      <div
        className="grid border-2 border-ink/70 bg-surface"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', width: size, height: size }}
      >
        {CELLS.map(({ rasiIndex, row, col }) => (
          <div
            key={rasiIndex}
            className="relative border border-ink/30 p-1 overflow-hidden flex flex-col"
            style={{ gridColumn: col, gridRow: row }}
          >
            <span className="absolute top-0.5 left-1 text-[9px] text-ink-soft/70">{RASI_TA_SHORT[rasiIndex]}</span>
            {rasiIndex === lagnaRasiIndex && (
              <span className="absolute top-0.5 right-1 text-[9px] font-bold text-saffron">லக்</span>
            )}
            <div className="mt-3 flex flex-wrap gap-x-1 gap-y-0.5 justify-center content-start flex-1">
              {inCell(rasiIndex).map((g, i) => (
                <span key={`${g.id}-${i}`} className={`text-[10px] leading-tight font-semibold ${g.colorClass ?? 'text-ink'} ${g.emphasis ? 'bg-saffron/30 rounded px-0.5' : ''}`}>
                  {labelOf(g)}{g.retrograde ? '(வ)' : ''}
                  {typeof g.degreeInSign === 'number' && <span className="font-normal text-[8px] text-ink-soft ml-0.5">{fmtDegMin(g.degreeInSign)}</span>}
                </span>
              ))}
              {transitInCell(rasiIndex).map((g, i) => (
                <span key={`t-${g.id}-${i}`} className="text-[9px] leading-tight font-medium text-rose">
                  {labelOf(g)}{g.retrograde ? '(வ)' : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div
          className="flex items-center justify-center text-center px-2 border border-ink/20"
          style={{ gridColumn: '2 / span 2', gridRow: '2 / span 2' }}
        >
          <span className="text-[10px] text-ink-soft leading-snug">{centerNote}</span>
        </div>
      </div>
      {transitGrahas && transitGrahas.length > 0 && (
        <p className="text-[10px] text-ink-soft mt-1">
          <span className="text-ink font-medium">கருப்பு</span> = ஜாதகம் · <span className="text-rose font-medium">சிவப்பு</span> = இன்றைய கோசாரம்
        </p>
      )}
    </div>
  );
}
