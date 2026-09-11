'use client';

import { GRAHA_TA_SHORT, RASI_TA_SHORT, fmtDegMin, type ChartGraha } from './rasiNames';
import type { VedicChartProps } from './SouthIndianChart';

// Standard North Indian construction: a square + both diagonals + a diamond
// connecting the 4 edge-midpoints, giving 12 house regions. House 1 is
// ALWAYS the top-centre triangle; houses 2-12 follow clockwise. The rāśi
// shown in each house = (lagnaRasiIndex + houseNumber - 1) mod 12 — this is
// the part that rotates with Lagna (opposite of the South Indian chart).
const BOX = 400;
const HOUSE_LABEL_POS: [number, number][] = [
  [200, 100], [100, 50], [50, 100], [100, 200], [50, 300], [100, 350],
  [200, 300], [300, 350], [350, 300], [300, 200], [350, 100], [300, 50],
];

function labelOf(g: ChartGraha) {
  return g.label ?? GRAHA_TA_SHORT[g.id] ?? g.id.slice(0, 2);
}

export function NorthIndianChart({ lagnaRasiIndex, grahas, transitGrahas, title, centerNote, size = 420 }: VedicChartProps) {
  const houseOfRasi = (rasiIndex: number) => ((rasiIndex - lagnaRasiIndex + 12) % 12) + 1;
  const grahasInHouse = (house: number) => grahas.filter((g) => houseOfRasi(g.rasiIndex) === house);
  const transitInHouse = (house: number) => (transitGrahas || []).filter((g) => houseOfRasi(g.rasiIndex) === house);
  const rasiOfHouse = (house: number) => (lagnaRasiIndex + house - 1) % 12;

  return (
    <div className="flex flex-col items-center">
      {title && <p className="text-center text-sm font-semibold text-ink mb-2">{title}</p>}
      <svg viewBox={`0 0 ${BOX} ${BOX}`} width={size} height={size} className="border-2 border-ink/70 bg-surface">
        <rect x={0} y={0} width={BOX} height={BOX} fill="none" />
        <path d={`M0 0 L${BOX} ${BOX} M${BOX} 0 L0 ${BOX} M${BOX / 2} 0 L${BOX} ${BOX / 2} L${BOX / 2} ${BOX} L0 ${BOX / 2} Z`}
          fill="none" stroke="currentColor" className="text-ink/50" strokeWidth={1.5} />
        {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
          const [cx, cy] = HOUSE_LABEL_POS[house - 1];
          const rasiIndex = rasiOfHouse(house);
          const isLagna = house === 1;
          const items = grahasInHouse(house);
          const titems = transitInHouse(house);
          return (
            <g key={house}>
              <text x={cx} y={cy - 22} textAnchor="middle" fontSize={9} className="fill-ink-soft/60">{RASI_TA_SHORT[rasiIndex]}</text>
              {isLagna && <text x={cx} y={cy - 32} textAnchor="middle" fontSize={9} fontWeight="bold" className="fill-saffron">லக்</text>}
              {items.map((g, i) => (
                <text key={`${g.id}-${i}`} x={cx} y={cy - 8 + i * 12} textAnchor="middle" fontSize={10} fontWeight={600}
                  className={g.colorClass ?? 'fill-ink'}>
                  {labelOf(g)}{g.retrograde ? '(வ)' : ''}
                  {typeof g.degreeInSign === 'number' ? ` ${fmtDegMin(g.degreeInSign)}` : ''}
                </text>
              ))}
              {titems.map((g, i) => (
                <text key={`t-${g.id}-${i}`} x={cx} y={cy - 8 + (items.length + i) * 12} textAnchor="middle" fontSize={9}
                  className="fill-rose">
                  {labelOf(g)}{g.retrograde ? '(வ)' : ''}
                </text>
              ))}
            </g>
          );
        })}
        {centerNote && (
          <text x={BOX / 2} y={BOX - 6} textAnchor="middle" fontSize={9} className="fill-ink-soft">{centerNote}</text>
        )}
      </svg>
      {transitGrahas && transitGrahas.length > 0 && (
        <p className="text-[10px] text-ink-soft mt-1">
          <span className="text-ink font-medium">கருப்பு</span> = ஜாதகம் · <span className="text-rose font-medium">சிவப்பு</span> = இன்றைய கோசாரம்
        </p>
      )}
    </div>
  );
}
