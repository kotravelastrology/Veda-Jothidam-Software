'use client';

import { useEffect, useState } from 'react';
import { RASI_TA_SHORT, GRAHA_TA_SHORT, fmtDegMin, loadChartStyle, saveChartStyle, type ChartStyle } from './rasiNames';

interface RefPoint { label: string; rasi: number; deg: number; nokki?: { lord: string; pct: number }; }
interface JamaItem {
  jamaNum: number; lord: string; lordTa: string; rasi: number; degInRasi: number; active: boolean;
  nakLordTa?: string; grahaKadir?: number | null; rasiKadir?: number;
}
interface TransitPlanet { id: string; rasiIndex: number; degreeInSign: number; retrograde?: boolean; }

interface Props {
  points: RefPoint[];          // உதயம்/ஆரூடம்/கவிப்பு/குளிகன்/ராகுகாலம்/எமகண்டம்/ம்ருத்யு/லக்னம்
  jamas: JamaItem[];           // the 8 jama grahas
  transitPlanets: TransitPlanet[];
  lagnaRasiIndex: number;
  title?: string;
}

const REF_POINT_SHORT: Record<string, string> = {
  உதயம்: 'உத', ஆரூடம்: 'ஆரு', கவிப்பு: 'கவி', 'குளிகன் (மாந்தி)': 'குளி',
  'ராகு காலம்': 'ரா.கா', எமகண்டம்: 'எம', ம்ருத்யு: 'ம்ரு', லக்னம்: 'லக்',
};

// Fixed South Indian layout, rāśi never rotates (see SouthIndianChart.tsx).
const CELLS: { rasiIndex: number; row: number; col: number }[] = [
  { rasiIndex: 11, row: 1, col: 1 }, { rasiIndex: 0, row: 1, col: 2 }, { rasiIndex: 1, row: 1, col: 3 }, { rasiIndex: 2, row: 1, col: 4 },
  { rasiIndex: 10, row: 2, col: 1 }, { rasiIndex: 3, row: 2, col: 4 },
  { rasiIndex: 9, row: 3, col: 1 }, { rasiIndex: 4, row: 3, col: 4 },
  { rasiIndex: 8, row: 4, col: 1 }, { rasiIndex: 7, row: 4, col: 2 }, { rasiIndex: 6, row: 4, col: 3 }, { rasiIndex: 5, row: 4, col: 4 },
];

function InnerLabels({ points, transits, rasiIndex }: { points: RefPoint[]; transits: TransitPlanet[]; rasiIndex: number }) {
  const here = points.filter((p) => p.rasi === rasiIndex && p.label !== 'லக்னம்');
  const transitHere = transits.filter((t) => t.rasiIndex === rasiIndex);
  if (!here.length && !transitHere.length) return null;
  return (
    <div className="flex flex-col gap-[1px] mt-3">
      {here.map((p, i) => (
        <div key={`p-${i}`} className="text-[9px] leading-tight font-bold text-indigo">
          {REF_POINT_SHORT[p.label] ?? p.label}
          <span className="font-normal text-[7px] text-ink-soft ml-0.5">{fmtDegMin(p.deg)}</span>
        </div>
      ))}
      {transitHere.map((t, i) => (
        <div key={`t-${i}`} className="text-[9px] leading-tight font-semibold text-ink">
          {GRAHA_TA_SHORT[t.id] ?? t.id.slice(0, 2)}{t.retrograde ? '(வ)' : ''}
          <span className="font-normal text-[7px] text-ink-soft ml-0.5">{fmtDegMin(t.degreeInSign)}</span>
        </div>
      ))}
    </div>
  );
}

function OuterJama({ items, udayamPct }: { items: JamaItem[]; udayamPct?: number }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col items-center leading-tight">
      {items.map((j) => (
        <div key={j.jamaNum} className={`text-[9px] whitespace-nowrap rounded px-1 mb-0.5 text-center ${j.active ? 'bg-saffron text-white font-bold' : 'border border-saffron/50 text-saffron'}`}>
          <div>{j.jamaNum}.{j.lordTa} <span className={j.active ? 'text-white/80' : 'text-ink-soft'}>{fmtDegMin(j.degInRasi)}</span></div>
          {(j.nakLordTa || j.grahaKadir != null) && (
            <div className={`text-[7px] font-normal ${j.active ? 'text-white/70' : 'text-indigo'}`}>
              {j.nakLordTa}{j.grahaKadir != null && <> ✳{j.grahaKadir} ◆{j.rasiKadir}</>}
            </div>
          )}
          {udayamPct != null && (
            <div className={`text-[7px] font-semibold ${j.active ? 'text-white/80' : 'text-ink-soft'}`}>{udayamPct.toFixed(1)}%</div>
          )}
        </div>
      ))}
    </div>
  );
}

function SouthJamakkol({ points, jamas, transitPlanets, lagnaRasiIndex, title }: Props) {
  const outer = (rasiIndex: number) => jamas.filter((j) => j.rasi === rasiIndex);
  const udayamPct = points.find((p) => p.label === 'உதயம்')?.nokki?.pct;
  // 12 outer edge slots, one per rāśi, no overlaps: left{Meena,Kumbha,Makara,Dhanusu},
  // right{Mithuna,Kataka,Simha,Kanni}, top{Mesha,Vrishabha}, bottom{Vrischika,Tula}.
  const leftRasis = [11, 10, 9, 8], rightRasis = [2, 3, 4, 5], topRasis = [0, 1], bottomRasis = [7, 6];
  return (
    <div className="flex flex-col items-center">
      {title && <p className="text-center text-xs font-bold text-ink-soft mb-1">{title}</p>}
      <div className="grid" style={{ gridTemplateColumns: 'auto repeat(4, minmax(0,1fr)) auto', gridTemplateRows: 'auto repeat(4, minmax(0,1fr)) auto', width: '100%', maxWidth: 480 }}>
        <div /><div style={{ gridColumn: 3 }} className="flex items-end justify-center pb-0.5"><OuterJama items={outer(0)} udayamPct={udayamPct} /></div>
        <div style={{ gridColumn: 4 }} className="flex items-end justify-center pb-0.5"><OuterJama items={outer(1)} udayamPct={udayamPct} /></div><div /><div />

        <div className="border-2 border-ink/70 grid grid-cols-4 grid-rows-4" style={{ gridColumn: '2 / span 4', gridRow: '2 / span 4', aspectRatio: '1/1' }}>
          <div className="flex items-center justify-center text-center px-1" style={{ gridColumn: '2 / span 2', gridRow: '2 / span 2' }}>
            <span className="text-ink-soft text-[9px] font-bold">ஜாமக்கோள்<br />பிரசன்னம்</span>
          </div>
          {CELLS.map(({ rasiIndex, row, col }) => (
            <div key={rasiIndex} className="border border-ink/30 relative p-0.5 flex flex-col bg-surface" style={{ gridColumn: col, gridRow: row }}>
              <span className="text-[8px] text-ink-soft/70">{RASI_TA_SHORT[rasiIndex]}</span>
              {rasiIndex === lagnaRasiIndex && <span className="absolute top-0.5 right-1 text-[8px] font-bold text-saffron">லக்</span>}
              <InnerLabels points={points} transits={transitPlanets} rasiIndex={rasiIndex} />
            </div>
          ))}
        </div>

        <div style={{ gridColumn: 1, gridRow: 2 }} className="flex items-center justify-end pr-1"><OuterJama items={outer(leftRasis[0])} udayamPct={udayamPct} /></div>
        <div style={{ gridColumn: 1, gridRow: 3 }} className="flex items-center justify-end pr-1"><OuterJama items={outer(leftRasis[1])} udayamPct={udayamPct} /></div>
        <div style={{ gridColumn: 1, gridRow: 4 }} className="flex items-center justify-end pr-1"><OuterJama items={outer(leftRasis[2])} udayamPct={udayamPct} /></div>
        <div style={{ gridColumn: 1, gridRow: 5 }} className="flex items-center justify-end pr-1"><OuterJama items={outer(leftRasis[3])} udayamPct={udayamPct} /></div>

        <div style={{ gridColumn: 6, gridRow: 2 }} className="flex items-center justify-start pl-1"><OuterJama items={outer(rightRasis[0])} udayamPct={udayamPct} /></div>
        <div style={{ gridColumn: 6, gridRow: 3 }} className="flex items-center justify-start pl-1"><OuterJama items={outer(rightRasis[1])} udayamPct={udayamPct} /></div>
        <div style={{ gridColumn: 6, gridRow: 4 }} className="flex items-center justify-start pl-1"><OuterJama items={outer(rightRasis[2])} udayamPct={udayamPct} /></div>
        <div style={{ gridColumn: 6, gridRow: 5 }} className="flex items-center justify-start pl-1"><OuterJama items={outer(rightRasis[3])} udayamPct={udayamPct} /></div>

        <div /><div style={{ gridColumn: 3, gridRow: 6 }} className="flex items-start justify-center pt-0.5"><OuterJama items={outer(bottomRasis[0])} udayamPct={udayamPct} /></div>
        <div style={{ gridColumn: 4, gridRow: 6 }} className="flex items-start justify-center pt-0.5"><OuterJama items={outer(bottomRasis[1])} udayamPct={udayamPct} /></div><div />
      </div>
      <p className="text-[10px] text-ink-soft mt-1 text-center">
        <span className="font-bold text-ink">உள்ளே</span>: இன்றைய கோசார கிரகங்கள் + உதயம்/ஆரூடம்/கவிப்பு/ராகுகாலம்/எமகண்டம்/ம்ருத்யு/குளிகன் &nbsp;|&nbsp;
        <span className="font-bold text-saffron">வெளியே</span>: 8 ஜாமக்கோள் கிரகங்கள் + நட்சத்திர நாதன் + ✳கிரககதிர்/◆ராசிகதிர் + உதயம்-நெருக்கம் % (செயலில் உள்ளது தூரிதமாக)
      </p>
    </div>
  );
}

function NorthJamakkol({ points, jamas, transitPlanets, lagnaRasiIndex, title }: Props) {
  const BOX = 400;
  const udayamPct = points.find((p) => p.label === 'உதயம்')?.nokki?.pct;
  const HOUSE_LABEL_POS: [number, number][] = [
    [200, 100], [100, 50], [50, 100], [100, 200], [50, 300], [100, 350],
    [200, 300], [300, 350], [350, 300], [300, 200], [350, 100], [300, 50],
  ];
  const houseOfRasi = (r: number) => ((r - lagnaRasiIndex + 12) % 12) + 1;
  const rasiOfHouse = (h: number) => (lagnaRasiIndex + h - 1) % 12;

  return (
    <div className="flex flex-col items-center">
      {title && <p className="text-center text-xs font-bold text-ink-soft mb-1">{title}</p>}
      <svg viewBox={`0 0 ${BOX} ${BOX}`} width={420} height={420} className="border-2 border-ink/70 bg-surface">
        <path d={`M0 0 L${BOX} ${BOX} M${BOX} 0 L0 ${BOX} M${BOX / 2} 0 L${BOX} ${BOX / 2} L${BOX / 2} ${BOX} L0 ${BOX / 2} Z`}
          fill="none" stroke="currentColor" className="text-ink/50" strokeWidth={1.5} />
        {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
          const [cx, cy] = HOUSE_LABEL_POS[house - 1];
          const rasiIndex = rasiOfHouse(house);
          const here = points.filter((p) => p.rasi === rasiIndex && p.label !== 'லக்னம்');
          const transitHere = transitPlanets.filter((t) => t.rasiIndex === rasiIndex);
          return (
            <g key={house}>
              <text x={cx} y={cy - 26} textAnchor="middle" fontSize={9} className="fill-ink-soft/60">{RASI_TA_SHORT[rasiIndex]}</text>
              {house === 1 && <text x={cx} y={cy - 36} textAnchor="middle" fontSize={9} fontWeight="bold" className="fill-saffron">லக்</text>}
              {here.map((p, i) => (
                <text key={`p-${i}`} x={cx} y={cy - 12 + i * 11} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-indigo">
                  {REF_POINT_SHORT[p.label] ?? p.label} {fmtDegMin(p.deg)}
                </text>
              ))}
              {transitHere.map((t, i) => (
                <text key={`t-${i}`} x={cx} y={cy - 12 + (here.length + i) * 11} textAnchor="middle" fontSize={9} className="fill-ink">
                  {GRAHA_TA_SHORT[t.id] ?? t.id.slice(0, 2)}{t.retrograde ? '(வ)' : ''} {fmtDegMin(t.degreeInSign)}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 w-full max-w-[420px]">
        <p className="text-[10px] text-ink-soft mb-1">
          8 ஜாமக்கோள் கிரகங்கள் (வட இந்திய கட்டத்தில் ராசிக் கட்டங்களுக்கு வெளியே இணைக்க முடியாததால், பட்டியலாகக் காட்டப்படுகிறது):
        </p>
        <div className="flex flex-wrap gap-1">
          {jamas.map((j) => (
            <span key={j.jamaNum} className={`text-[10px] px-1.5 py-0.5 rounded leading-tight ${j.active ? 'bg-saffron text-white font-bold' : 'border border-saffron/50 text-saffron'}`}>
              {j.jamaNum}.{j.lordTa} {RASI_TA_SHORT[j.rasi]} {fmtDegMin(j.degInRasi)}
              {(j.nakLordTa || j.grahaKadir != null) && (
                <span className={`block text-[8px] font-normal ${j.active ? 'text-white/70' : 'text-indigo'}`}>
                  {j.nakLordTa}{j.grahaKadir != null && <> ✳{j.grahaKadir} ◆{j.rasiKadir}</>}{udayamPct != null && ` · ${udayamPct.toFixed(1)}%`}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function JamakkolChartBox(props: Props) {
  const [style, setStyle] = useState<ChartStyle>('south');
  useEffect(() => { setStyle(loadChartStyle()); }, []);
  const choose = (s: ChartStyle) => { setStyle(s); saveChartStyle(s); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1 mb-2 text-xs print:hidden">
        <button type="button" onClick={() => choose('south')}
          className={`px-2 py-1 rounded ${style === 'south' ? 'bg-saffron text-ink' : 'bg-surface-soft border border-line text-ink-soft'}`}>
          தென்னிந்திய கட்டம்
        </button>
        <button type="button" onClick={() => choose('north')}
          className={`px-2 py-1 rounded ${style === 'north' ? 'bg-saffron text-ink' : 'bg-surface-soft border border-line text-ink-soft'}`}>
          வட இந்திய கட்டம்
        </button>
      </div>
      {style === 'south' ? <SouthJamakkol {...props} /> : <NorthJamakkol {...props} />}
    </div>
  );
}
