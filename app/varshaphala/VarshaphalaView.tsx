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
  varsheshaSelection: {
    tier: string;
    candidates: Array<{ planet: string; roles: string[]; pvb: number; lagnaAspect: string | null }>;
  };
  patyayiniDasha: Array<{ lord: string; days: number; start: string; end: string }>;
  sahams: Array<{ key: string; name: string; longitude: number; rasi: string; degreeInSign: number; corrected: boolean }>;
  tajikaYogas: Array<{ planetA: string; planetB: string; aspectAngle: number; phase: string; orb: number; kambool: boolean; manau: string | null }>;
  extendedTajikaYogas: Array<{ name: string; planets: string[]; nature: string; note: string }>;
}

const NATURE_STYLE: Record<string, string> = {
  benefic: 'bg-teal-soft text-teal',
  malefic: 'bg-rose-soft text-rose',
  neutral: 'bg-surface-soft text-ink-soft',
};

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

          {/* Varshesha candidates + classical selection */}
          <section className="bg-surface-soft rounded-lg p-5 border border-line">
            <h3 className="font-semibold text-ink mb-1">Panchadhikari candidates &amp; selection</h3>
            <ul className="text-sm space-y-0.5 text-ink-soft mb-3">
              <li>1. Varsha-Lagna lord — {result.varsheshaRoles.varshaLagnaLord}</li>
              <li>2. Natal-Lagna lord — {result.varsheshaRoles.natalLagnaLord}</li>
              <li>3. Trirasi lord (Varsha-Lagna rasi) — {result.varsheshaRoles.trirasiLord}</li>
              <li>4. Muntha-rasi lord — {result.varsheshaRoles.munthaLord}</li>
              <li>5. Day → Sun&apos;s rasi lord / night → Moon&apos;s — {result.varsheshaRoles.luminaryRasiLord}</li>
            </ul>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-ink-soft border-b border-line">
                    <th className="px-2 py-1.5 text-left">Candidate</th>
                    <th className="px-2 py-1.5 text-left">Fills roles</th>
                    <th className="px-2 py-1.5 text-right">PVB</th>
                    <th className="px-2 py-1.5 text-left">Lagna aspect</th>
                  </tr>
                </thead>
                <tbody>
                  {result.varsheshaSelection.candidates.map((c) => (
                    <tr key={c.planet} className={`border-b border-line ${c.planet === result.varshesha ? 'bg-saffron/10 font-semibold' : ''}`}>
                      <td className="px-2 py-1.5 text-ink">{c.planet}{c.planet === result.varshesha ? ' ★' : ''}</td>
                      <td className="px-2 py-1.5 text-ink-soft text-xs">{c.roles.length}</td>
                      <td className="px-2 py-1.5 text-right text-ink">{c.pvb.toFixed(2)}</td>
                      <td className="px-2 py-1.5">
                        {c.lagnaAspect
                          ? <span className={`text-xs px-1.5 py-0.5 rounded ${c.lagnaAspect === 'benefic' ? 'bg-teal-soft text-teal' : 'bg-rose-soft text-rose'}`}>{c.lagnaAspect}</span>
                          : <span className="text-xs text-ink-soft">none</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-soft mt-2">
              Selected via: <strong>{result.varsheshaSelection.tier}</strong> (Integrated Approach ch.28.6 fallback chain;
              Varsha-Lagna lord breaks a final tie).
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

          {/* Tajika Yogas */}
          <section className="bg-surface border border-line rounded-lg p-5">
            <h3 className="font-semibold text-ink mb-1">தாஜிக யோகங்கள் (Tajika Yogas — pair aspects)</h3>
            <p className="text-xs text-ink-soft mb-3">
              Ithāsāla (applying) / Īsarpha (separating) between graha pairs, with Kambool (Moon involved)
              and Manau (Mars/Saturn obstructing) riders. Extended named yogas not yet ported.
            </p>
            {result.tajikaYogas.length === 0 ? (
              <p className="text-sm text-ink-soft">No pair is within orb of a Tajika aspect this year.</p>
            ) : (
              <ul className="text-sm space-y-1">
                {result.tajikaYogas.map((y, i) => (
                  <li key={i} className="text-ink">
                    <strong>{y.planetA}–{y.planetB}</strong> · {y.aspectAngle}° · {y.phase} <span className="text-ink-soft">(orb {y.orb}°)</span>
                    {y.kambool && <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-teal-soft text-teal">Kambool</span>}
                    {y.manau && <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-rose-soft text-rose">Manau: {y.manau}</span>}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Extended named Tajika yogas */}
          <section className="bg-surface border border-line rounded-lg p-5">
            <h3 className="font-semibold text-ink mb-1">தாஜிக யோகங்கள் — பெயரிடப்பட்டவை (Named Tajika Yogas)</h3>
            <p className="text-xs text-ink-soft mb-3">
              Radda · Duhphali-Kutta · Durupha · Duttota · Kamboola · Nakta / Yamaya · Khallasara · Kutta ·
              Thambira / Gairi-Kamboola · Ishkavala / Induvara — via Pancha-Vargeeya-Bala strength.
            </p>
            {result.extendedTajikaYogas.length === 0 ? (
              <p className="text-sm text-ink-soft">No named Tajika yoga forms in this year&apos;s chart.</p>
            ) : (
              <ul className="space-y-2">
                {result.extendedTajikaYogas.map((y, i) => (
                  <li key={i} className="text-sm">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${NATURE_STYLE[y.nature] || NATURE_STYLE.neutral}`}>
                      {y.name}
                    </span>
                    {y.planets.length > 0 && <span className="text-ink-soft ml-2">{y.planets.join(', ')}</span>}
                    <p className="text-ink-soft mt-0.5">{y.note}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Sahams */}
          <section className="bg-surface border border-line rounded-lg p-5">
            <h3 className="font-semibold text-ink mb-1">தஜக சகங்கள் (Sahams — {result.sahams.length} sensitive points)</h3>
            <p className="text-xs text-ink-soft mb-3">
              Saham = A − B + C (day birth) / B − A + C (night birth), +30° when C is outside the B→A arc (marked ✚).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-ink-soft border-b border-line">
                    <th className="px-3 py-2 text-left">Saham</th>
                    <th className="px-3 py-2 text-right">Longitude</th>
                    <th className="px-3 py-2 text-left">Rasi</th>
                    <th className="px-3 py-2 text-right">°</th>
                    <th className="px-3 py-2 text-center">±30</th>
                  </tr>
                </thead>
                <tbody>
                  {result.sahams.map((s) => (
                    <tr key={s.key} className="border-b border-line even:bg-surface-soft/40">
                      <td className="px-3 py-1.5 text-ink">{s.name}</td>
                      <td className="px-3 py-1.5 text-right text-ink-soft">{s.longitude.toFixed(2)}°</td>
                      <td className="px-3 py-1.5 text-indigo font-medium">{s.rasi}</td>
                      <td className="px-3 py-1.5 text-right text-ink-soft">{s.degreeInSign.toFixed(1)}</td>
                      <td className="px-3 py-1.5 text-center">{s.corrected ? '✚' : ''}</td>
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
