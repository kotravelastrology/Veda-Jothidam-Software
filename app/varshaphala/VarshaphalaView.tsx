'use client';

import { useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { RasiChartRenderer } from '@/src/charts/chart-renderers/RasiChartRenderer';
import { computeVarshaphala } from './actions';
import type { BirthFormInput } from '../report/actions';

interface VarshaResult {
  yearsElapsed: number;
  solarReturn: { date: string; time: string };
  natal: { sunLongitude: number; lagnaRasi: string; moonRasi: string };
  varshaChart: any;
  muntha: { rasi: string; lord: string; house: number };
  varshesha: string;
  varsheshaRoles: Record<string, string>;
  patyayiniDasha: Array<{ lord: string; days: number; start: string; end: string }>;
}

export default function VarshaphalaView() {
  const [age, setAge] = useState(30);
  const [result, setResult] = useState<VarshaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (bd: BirthData) => {
    setLoading(true);
    setError(null);
    try {
      const input: BirthFormInput = {
        name: bd.name,
        gender: bd.gender,
        year: parseInt(bd.dateOfBirth.split('-')[0]),
        month: parseInt(bd.dateOfBirth.split('-')[1]),
        day: parseInt(bd.dateOfBirth.split('-')[2]),
        hour: parseInt(bd.timeOfBirth.split(':')[0]),
        minute: parseInt(bd.timeOfBirth.split(':')[1]),
        placeName: bd.place,
        latitude: bd.latitude,
        longitude: bd.longitude,
        utcOffsetMinutes: bd.utcOffset,
        ianaTimeZone: 'Asia/Kolkata',
      };
      const r = await computeVarshaphala(input, age);
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Tajika · Annual Chart</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          வருஷபலன் (Varshaphala)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Solar-return chart for a chosen year: Muntha, Varshesha (year lord) and the Patyayini (Mudda) dasha.
        </p>
      </header>

      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <label className="block text-sm mb-4">
          <span className="text-ink-soft">Year of life (completed years since birth)</span>
          <input
            type="number"
            min={1}
            max={120}
            value={age}
            onChange={(e) => setAge(Math.max(1, Number(e.target.value) || 1))}
            className="ml-3 w-24 px-2 py-1 bg-surface-soft border border-line rounded text-ink"
          />
        </label>
        <BirthDataForm onSubmit={onSubmit} isLoading={loading} />
      </div>

      {error && <p className="text-rose text-sm mb-4">⚠️ {error}</p>}

      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <section className="bg-gradient-to-r from-saffron-soft/40 to-indigo-soft/40 rounded-lg p-6 border-l-4 border-saffron">
            <h2 className="text-lg font-bold text-ink mb-3">
              Year {result.yearsElapsed} · Varsha Pravesha {result.solarReturn.date} at {result.solarReturn.time} IST
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-ink-soft">Muntha</div>
                <div className="font-semibold text-ink">{result.muntha.rasi} · house {result.muntha.house}</div>
                <div className="text-xs text-ink-soft">lord {result.muntha.lord}</div>
              </div>
              <div>
                <div className="text-ink-soft">Varshesha (year lord)</div>
                <div className="font-semibold text-2xl text-saffron">{result.varshesha}</div>
              </div>
              <div>
                <div className="text-ink-soft">Natal reference</div>
                <div className="text-xs text-ink-soft">
                  Lagna {result.natal.lagnaRasi} · Moon {result.natal.moonRasi} · Sun {result.natal.sunLongitude}°
                </div>
              </div>
            </div>
          </section>

          {/* Varshesha candidate roles */}
          <section className="bg-surface-soft rounded-lg p-5 border border-line">
            <h3 className="font-semibold text-ink mb-3">Panchadhikari candidates</h3>
            <ul className="text-sm space-y-1 text-ink">
              <li>1. Varsha-Lagna lord — <strong>{result.varsheshaRoles.varshaLagnaLord}</strong></li>
              <li>2. Natal-Lagna lord — <strong>{result.varsheshaRoles.natalLagnaLord}</strong></li>
              <li>3. Muntha lord — <strong>{result.varsheshaRoles.munthaLord}</strong></li>
              <li>4. Day → Sun&apos;s rasi lord / night → Moon&apos;s — <strong>{result.varsheshaRoles.luminaryRasiLord}</strong></li>
              <li>5. Varsha-Moon rasi lord — <strong>{result.varsheshaRoles.moonRasiLord}</strong></li>
            </ul>
            <p className="text-xs text-ink-soft mt-2">
              Selection = candidate filling the most roles (Varsha-Lagna lord breaks ties). Full Pancha-Vargeeya-Bala
              + Tajika-aspect selection is not yet implemented.
            </p>
          </section>

          {/* Varsha Rasi chart */}
          <section className="bg-surface border border-line rounded-lg p-5">
            <h3 className="font-semibold text-ink mb-4">வருஷ ராசி (Varsha Rasi chart)</h3>
            <RasiChartRenderer
              report={{
                chart: result.varshaChart,
                input: {
                  year: Number(result.solarReturn.date.slice(0, 4)),
                  month: Number(result.solarReturn.date.slice(5, 7)),
                  day: Number(result.solarReturn.date.slice(8, 10)),
                  hour: Number(result.solarReturn.time.slice(0, 2)),
                  minute: Number(result.solarReturn.time.slice(3, 5)),
                  placeName: 'Varsha Pravesha',
                },
              }}
            />
          </section>

          {/* Patyayini dasha */}
          <section className="bg-surface border border-line rounded-lg p-5">
            <h3 className="font-semibold text-ink mb-4">பத்யாயினி தசை (Patyayini / Mudda Dasha)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-ink-soft border-b border-line">
                    <th className="px-3 py-2 text-left">Lord</th>
                    <th className="px-3 py-2 text-right">Days</th>
                    <th className="px-3 py-2 text-left">Start</th>
                    <th className="px-3 py-2 text-left">End</th>
                  </tr>
                </thead>
                <tbody>
                  {result.patyayiniDasha.map((d, i) => (
                    <tr key={i} className="border-b border-line even:bg-surface-soft/40">
                      <td className="px-3 py-2 font-medium text-indigo">{d.lord}</td>
                      <td className="px-3 py-2 text-right text-ink">{d.days}</td>
                      <td className="px-3 py-2 text-ink-soft">{d.start}</td>
                      <td className="px-3 py-2 text-ink-soft">{d.end}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
