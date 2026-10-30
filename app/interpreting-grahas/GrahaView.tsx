'use client';

import { useEffect, useState } from 'react';
import { useActiveBirthInput } from '@/src/workspace/useActiveBirthInput';
import { interpretGrahas } from './actions';

interface GrahaRow {
  planet: string;
  rasi: string;
  degreeInSign: number;
  house: number;
  housesOwned: number[];
  relation: string;
  exaltation: string | null;
  jagradadi: string;
  baladi: string;
  deeptadi: string;
  shadbala: { sthana: unknown; dig: unknown; kaala: unknown; naisargika: unknown; cheshta: unknown; drik: unknown };
}

interface GrahaData {
  lagnaRasi: string;
  rows: GrahaRow[];
  notBuilt: { column: string; reason: string }[];
}

const SHADBALA_PARTS: { key: keyof GrahaRow['shadbala']; label: string }[] = [
  { key: 'sthana', label: 'Sthana' },
  { key: 'dig', label: 'Dig' },
  { key: 'kaala', label: 'Kaala' },
  { key: 'naisargika', label: 'Naisargika' },
  { key: 'cheshta', label: 'Cheshta' },
  { key: 'drik', label: 'Drik' },
];

const show = (v: unknown) => (typeof v === 'number' ? v.toFixed(2) : '—');

export default function GrahaView() {
  const { input: profileInput } = useActiveBirthInput();
  const [data, setData] = useState<GrahaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileInput) return;
    setLoading(true);
    setError(null);
    interpretGrahas(profileInput)
      .then((result: GrahaData) => setData(result))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [profileInput]);

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Worksheet 020</p>
        <h1 className="text-3xl font-bold text-ink">கிரகங்களின் விளக்கம் (Interpreting Grahas)</h1>
        <p className="text-sm text-ink-soft mt-1">
          Each graha&apos;s place, dignity, avasthas and the parts of Shadbala for the open chart.
        </p>
      </header>

      {!profileInput && (
        <p className="text-sm text-ink-soft">Open a saved chart (File → Open) to see its grahas.</p>
      )}
      {loading && <p className="text-sm text-ink-soft">Calculating…</p>}
      {error && <p className="text-sm text-rose">{error}</p>}

      {data && (
        <>
          <p className="text-sm text-ink-soft mb-3">Lagna: {data.lagnaRasi}</p>
          <div className="overflow-x-auto bg-surface border border-line rounded-2xl">
            <table className="w-full text-sm">
              <thead className="text-left text-ink-soft">
                <tr>
                  <th className="p-2">Graha</th>
                  <th className="p-2">Rasi</th>
                  <th className="p-2">Degree</th>
                  <th className="p-2">House</th>
                  <th className="p-2">Owns</th>
                  <th className="p-2">Relation (Saptavargaja)</th>
                  <th className="p-2">Exaltation</th>
                  <th className="p-2">Jagradadi</th>
                  <th className="p-2">Baladi</th>
                  <th className="p-2">Deeptadi</th>
                  {SHADBALA_PARTS.map((part) => (
                    <th key={part.key} className="p-2">{part.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.planet} className="border-t border-line">
                    <td className="p-2 font-semibold text-ink">{r.planet}</td>
                    <td className="p-2">{r.rasi}</td>
                    <td className="p-2 tabular-nums">{r.degreeInSign.toFixed(2)}°</td>
                    <td className="p-2">{r.house}</td>
                    <td className="p-2">{r.housesOwned.join(', ')}</td>
                    <td className="p-2">{r.relation}</td>
                    <td className="p-2">{r.exaltation ?? '—'}</td>
                    <td className="p-2">{r.jagradadi}</td>
                    <td className="p-2">{r.baladi}</td>
                    <td className="p-2">{r.deeptadi}</td>
                    {SHADBALA_PARTS.map((part) => (
                      <td key={part.key} className="p-2 tabular-nums">{show(r.shadbala[part.key])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="mt-6">
            <h2 className="text-base font-semibold text-ink mb-2">Not shown yet</h2>
            <ul className="text-sm text-ink-soft space-y-1 list-disc list-inside">
              {data.notBuilt.map((x) => (
                <li key={x.column}>
                  <strong className="text-ink">{x.column}:</strong> {x.reason}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
