'use client';

import { useMemo, useState } from 'react';
import { TransitCalculator } from '@/src/analysis/TransitCalculator';

interface EphemerisRendererProps {
  report: any;
}

const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'] as const;
const PLANET_GLYPH: Record<string, string> = {
  Sun: '☉', Moon: '☾', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};

const INTERVALS = [
  { label: 'Daily', days: 1, rows: 31 },
  { label: 'Weekly', days: 7, rows: 27 },
  { label: 'Monthly', days: 30, rows: 24 },
];

export function EphemerisRenderer({ report }: EphemerisRendererProps) {
  const birthDob: string | undefined =
    report?.input?.dateOfBirth ||
    (report?.input?.year
      ? `${report.input.year}-${String(report.input.month).padStart(2, '0')}-${String(report.input.day).padStart(2, '0')}`
      : undefined);

  const [startDate, setStartDate] = useState<string>(
    birthDob || new Date().toISOString().split('T')[0],
  );
  const [intervalIdx, setIntervalIdx] = useState(0);

  const interval = INTERVALS[intervalIdx];

  const rows = useMemo(() => {
    const base = new Date(startDate + 'T12:00:00');
    if (isNaN(base.getTime())) return [];
    return Array.from({ length: interval.rows }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i * interval.days);
      const transit = TransitCalculator.calculateTransits(d);
      const byPlanet: Record<string, { sign: string; degree: number; retro: boolean }> = {};
      transit.planets.forEach((p) => {
        byPlanet[p.planet] = {
          sign: p.sign ?? '',
          degree: Number.isFinite(p.degree) ? p.degree : 0,
          retro: !!p.isRetrograde,
        };
      });
      return { date: d, byPlanet };
    });
  }, [startDate, interval]);

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-indigo-soft/30 to-blue-soft/30 rounded-lg p-6 border-l-4 border-indigo">
        <h3 className="text-xl font-bold text-ink mb-2">பஞ்சாங்க கிரக நிலைகள் (Ephemeris)</h3>
        <p className="text-sm text-ink-soft">
          Sidereal planetary longitudes over time — sign and degree for each graha, with ℞ marking retrograde motion.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 bg-surface-soft rounded-lg p-4 border border-line print:hidden">
        <label className="text-sm">
          <span className="block text-ink-soft mb-1">Start date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1 bg-surface border border-line rounded text-ink"
          />
        </label>
        <label className="text-sm">
          <span className="block text-ink-soft mb-1">Interval</span>
          <select
            value={intervalIdx}
            onChange={(e) => setIntervalIdx(Number(e.target.value))}
            className="px-2 py-1 bg-surface border border-line rounded text-ink"
          >
            {INTERVALS.map((iv, i) => (
              <option key={iv.label} value={i}>{iv.label} · {iv.rows} rows</option>
            ))}
          </select>
        </label>
        {birthDob && (
          <button
            type="button"
            onClick={() => setStartDate(birthDob)}
            className="px-3 py-1 text-sm bg-surface border border-line rounded hover:bg-saffron/10 text-ink"
          >
            Jump to birth date
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-line rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-soft text-ink-soft">
              <th className="px-3 py-2 text-left sticky left-0 bg-surface-soft">Date</th>
              {PLANETS.map((p) => (
                <th key={p} className="px-3 py-2 text-center whitespace-nowrap" title={p}>
                  {PLANET_GLYPH[p]} {p.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-line even:bg-surface-soft/40">
                <td className="px-3 py-2 whitespace-nowrap font-medium text-ink sticky left-0 bg-inherit">
                  {row.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}
                </td>
                {PLANETS.map((p) => {
                  const pos = row.byPlanet[p];
                  const label = String(pos?.sign ?? '').slice(0, 3);
                  if (!pos || !label) {
                    return <td key={p} className="px-3 py-2 text-center text-ink-soft">–</td>;
                  }
                  return (
                    <td key={p} className="px-3 py-2 text-center whitespace-nowrap text-ink">
                      <span className="font-semibold text-indigo">{label}</span>
                      <span className="text-ink-soft"> {pos.degree}°</span>
                      {pos.retro && <span className="text-rose font-bold"> ℞</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-ink-soft">
        Positions use the Phase 35 sidereal transit model (mean motion). For precise ephemeris work, cross-check against a
        Swiss-ephemeris table.
      </p>
    </div>
  );
}
