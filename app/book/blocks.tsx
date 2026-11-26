'use client';

/**
 * The pieces a page of the horoscope book is made of (a table, a South Indian chart, a chart with its figures, the Sudarshana Chakra, a note), shared by the
 * book (BookView.tsx) and by the screens that show a page of it on its own (the Ashtakavarga screen, ...), so a page looks the same wherever it is shown.
 */
export type Tone = 'saffron' | 'indigo' | 'teal' | 'rose';
export const TONE: Record<Tone, { bar: string; chip: string; soft: string; text: string }> = {
  saffron: { bar: 'bg-saffron', chip: 'icon-chip-saffron', soft: 'bg-saffron/10', text: 'text-saffron' },
  indigo: { bar: 'bg-indigo', chip: 'icon-chip-indigo', soft: 'bg-indigo/10', text: 'text-indigo' },
  teal: { bar: 'bg-teal', chip: 'icon-chip-teal', soft: 'bg-teal/10', text: 'text-teal' },
  rose: { bar: 'bg-rose', chip: 'icon-chip-rose', soft: 'bg-rose/10', text: 'text-rose' },
};

// South-Indian grid: the sign in each cell; -1 is the centre, which spans four cells.
const GRID_SIGNS = [[11, 0, 1, 2], [10, -1, -1, 3], [9, -1, -1, 4], [8, 7, 6, 5]];

export function SignGrid({ cells, title }: { cells: string[][]; title: string }) {
  return (
    <div className="w-full max-w-[22rem] break-inside-avoid">
      <div className="grid grid-cols-4 overflow-hidden rounded-xl border-2 border-ink/70 bg-surface print:rounded-none print:border-black">
        {GRID_SIGNS.flatMap((row, r) => row.map((sign, c) => {
          if (sign < 0) {
            return r === 1 && c === 1 ? (
              <div key={`${r}${c}`} className="col-span-2 row-span-2 grid place-items-center border border-ink/20 bg-saffron/5 p-2 text-center text-[11px] font-semibold text-ink-soft print:border-black/40">{title}</div>
            ) : null;
          }
          return (
            <div key={`${r}${c}`} className="min-h-16 border border-ink/20 p-1.5 text-[13px] font-bold leading-tight text-ink print:border-black/40 print:text-black">
              {cells[sign].map((label, i) => <div key={i}>{label}</div>)}
            </div>
          );
        }))}
      </div>
    </div>
  );
}

export function Table({ columns, rows, compact = false }: { columns: string[]; rows: string[][]; compact?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line print:overflow-visible print:rounded-none print:border-black/40">
      <table className={`w-full border-collapse print:text-[10px] ${compact ? 'text-[11px]' : 'text-[12px]'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
        <thead>
          <tr className="bg-ink/[0.06] text-left text-ink print:bg-gray-200 print:text-black">
            {columns.map((c, i) => <th key={`${c}-${i}`} className="px-2.5 py-1.5 font-bold">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="break-inside-avoid border-t border-line/60 odd:bg-transparent even:bg-saffron/[0.05] print:border-gray-300 print:even:bg-gray-50">
              {r.map((c, ci) => <td key={ci} className={`px-2.5 py-1 align-top ${ci === 0 ? 'font-semibold text-ink' : 'text-ink'} print:text-black`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The Sudarshana Chakra: three rings of twelve houses, the Sun chart outside, the Moon chart in the middle and the birth chart inside. */
export function Sudarshana({ rings }: { rings: { label: string; houses: string[][] }[] }) {
  const cx = 230; const cy = 230;
  const radii = [215, 170, 125, 80];
  const point = (r: number, deg: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)] as const;
  const sector = (r1: number, r2: number, a1: number, a2: number) => {
    const [x1, y1] = point(r1, a1); const [x2, y2] = point(r1, a2); const [x3, y3] = point(r2, a2); const [x4, y4] = point(r2, a1);
    return `M${x1} ${y1} A${r1} ${r1} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r2} ${r2} 0 0 0 ${x4} ${y4} Z`;
  };
  return (
    <svg viewBox="0 0 460 460" className="mx-auto w-full max-w-[34rem]" role="img" aria-label="சுதர்சன சக்கரம்">
      {rings.map((ring, ri) => ring.houses.map((marks, h) => {
        const a1 = 180 + h * 30; const a2 = a1 + 30; const mid = a1 + 15;
        const r1 = radii[ri]; const r2 = radii[ri + 1];
        const [tx, ty] = point((r1 + r2) / 2, mid);
        const [nx, ny] = point(r1 - 9, mid);
        return (
          <g key={`${ri}-${h}`}>
            <path d={sector(r1, r2, a1, a2)} fill={ri === 2 ? 'rgba(201,106,18,0.06)' : 'none'} stroke="currentColor" strokeOpacity="0.45" />
            <text x={nx} y={ny} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="currentColor" opacity="0.55">{h + 1}</text>
            {marks.map((m, i) => <text key={m} x={tx} y={ty + (i - (marks.length - 1) / 2) * 12} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill="currentColor">{m}</text>)}
          </g>
        );
      }))}
      <circle cx={cx} cy={cy} r={radii[3]} fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="40" fill="#c96a12">ॐ</text>
    </svg>
  );
}

/** Consecutive tiles (small period tables) and charts are laid out side by side, as the sample prints them; any other block stands alone. */
export function groupBlocks(blocks: any[]) {
  const groups: { grid: boolean; blocks: any[] }[] = [];
  for (const b of blocks) {
    const tile = b.tile || b.kind === 'signGrid' || b.kind === 'chartCard';
    const last = groups[groups.length - 1];
    if (tile && last?.grid) last.blocks.push(b);
    else groups.push({ grid: Boolean(tile), blocks: [b] });
  }
  return groups;
}

export function BlockView({ b, bar, compact = false }: { b: any; bar: string; compact?: boolean }) {
  return (
    <div className="min-w-0 break-inside-avoid">
      {b.heading && b.kind !== 'chartCard' && (
        <h4 className="mb-1.5 flex items-baseline gap-2 text-sm font-bold text-ink print:text-black">
          <span className={`inline-block h-4 w-1 self-center rounded ${bar}`} aria-hidden />
          <span className="min-w-0">{b.heading}</span>
          {b.aside && <span className="ml-auto shrink-0 text-[11px] font-semibold text-ink-soft tabular-nums print:text-black">{b.aside}</span>}
        </h4>
      )}
      {b.kind === 'chartCard' && <h4 className="mb-1 text-[12px] font-bold text-ink print:text-black">{b.heading}</h4>}
      {b.kind === 'table' ? <Table columns={b.columns} rows={b.rows} compact={compact} />
        : b.kind === 'signGrid' ? <SignGrid cells={b.cells} title={b.heading ?? ''} />
        : b.kind === 'sudarshana' ? <Sudarshana rings={b.rings} />
        : b.kind === 'chartCard' ? (
          <div className="space-y-1.5">
            <SignGrid cells={b.cells} title="" />
            <div className="max-w-[22rem] overflow-hidden rounded-lg border border-line text-[11px] tabular-nums print:border-black/40">
              {b.rows.map((r: string[], ri: number) => (
                <div key={ri} className="grid grid-cols-6 gap-x-1 border-t border-line/60 px-1.5 py-0.5 first:border-0 odd:bg-saffron/[0.05]">
                  {r.map((c, ci) => <span key={ci} className={ci % 2 === 0 ? 'font-bold text-ink' : 'text-ink'}>{c}</span>)}
                </div>
              ))}
            </div>
          </div>
        )
        : <p className="text-sm text-ink print:text-black">{b.text}</p>}
      {b.note && <p className="mt-1 text-[11px] text-ink-soft print:text-black">{b.note}</p>}
    </div>
  );
}

