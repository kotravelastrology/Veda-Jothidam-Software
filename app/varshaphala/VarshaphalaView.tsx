'use client';

import { Fragment, useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { VedicChartBox } from '@/src/charts/kattam/VedicChartBox';
import { fromParashariChart } from '@/src/charts/kattam/rasiNames';
import { computeVarshaphala } from './actions';
import type { BirthFormInput } from '../report/actions';
import { citeTa } from '@/src/sources/citeTa';

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
            <div className="flex justify-center">
              <VedicChartBox {...fromParashariChart(result.varshaChart)} title="வருஷப்ரவேச கட்டம்" />
            </div>
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

          {/* Varsha Vimsottari Dasa */}
          {(result as any).varshaVimsottariDasa && (
            <section className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-semibold text-ink mb-1">வர்ஷ விம்சோத்தரி தசை (Varsha Vimsottari / book&apos;s Mudda Dasa)</h3>
              <p className="text-xs text-ink-soft mb-3">
                ஜனன விம்சோத்தரி (நட்சத்திர) தசை ~360 சூரிய நாட்களாக சுருக்கப்பட்டது (ஆண்டு×3). தொடக்க அதிபதி:
                ஜனன தொடக்க அதிபதி {(result as any).varshaVimsottariDasa.natalStartLord} → {(result as any).varshaVimsottariDasa.startLord}.
                (Vedic Astrology: An Integrated Approach ch.30.4)
              </p>
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
                    {(result as any).varshaVimsottariDasa.periods.map((d: any, i: number) => (
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
          )}

          {/* Varsha Narayana Dasa */}
          {(result as any).varshaNarayanaDasa && (
            <section className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-semibold text-ink mb-1">வர்ஷ நாராயண தசை (Varsha Narayana Dasa)</h3>
              <p className="text-xs text-ink-soft mb-3">
                வர்ஷ சக்கரத்தின் கிரக நிலைகளில் சர (நாராயண) தசை, ஆனால் லக்னத்திற்குப் பதிலாக முந்தா
                ({(result as any).varshaNarayanaDasa.munthaRasi}) — திசை {(result as any).varshaNarayanaDasa.direction === 'direct' ? 'நேர்' : 'எதிர்'}.
                ராசி நீளம் ஆண்டு×3 நாட்கள். (ch.30.5 — “the best dasa for Tajaka annual charts”)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-ink-soft border-b border-line">
                      <th className="px-3 py-2 text-left">ராசி</th>
                      <th className="px-3 py-2 text-right">Days</th>
                      <th className="px-3 py-2 text-left">Start</th>
                      <th className="px-3 py-2 text-left">End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result as any).varshaNarayanaDasa.periods.map((d: any, i: number) => (
                      <tr key={i} className="border-b border-line even:bg-surface-soft/40">
                        <td className="px-3 py-2 font-medium text-indigo">{d.rasi}</td>
                        <td className="px-3 py-2 text-right text-ink">{d.days}</td>
                        <td className="px-3 py-2 text-ink-soft">{d.start}</td>
                        <td className="px-3 py-2 text-ink-soft">{d.end}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

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

          {/* Harsha Bala */}
          {(result as any).harshaBala && (
            <section className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-semibold text-ink mb-1">ஹர்ஷ பலம் (Harsha Bala — 0-20)</h3>
              <p className="text-xs text-ink-soft mb-3">4 காரணி × 5 புள்ளி (all-or-nothing): ஸ்தான · உச்ச-ஸ்வக்ஷேத்ர · ஸ்திரீ-புருஷ · தின-ராத்ரி (varsha லக்னத்திலிருந்து பாவம்).</p>
              <table className="w-full text-sm">
                <thead><tr className="text-ink-soft border-b border-line">
                  <th className="px-2 py-1 text-left">கிரகம்</th><th className="px-2 py-1 text-right">ஸ்தான</th>
                  <th className="px-2 py-1 text-right">உச்ச</th><th className="px-2 py-1 text-right">ஸ்திரீ-பு</th>
                  <th className="px-2 py-1 text-right">தின-ரா</th><th className="px-2 py-1 text-right">மொத்தம்</th>
                </tr></thead>
                <tbody>
                  {(result as any).harshaBala.map((h: any) => (
                    <tr key={h.planet} className="border-b border-line/50">
                      <td className="px-2 py-1">{h.planet}</td>
                      <td className="px-2 py-1 text-right">{h.sthana}</td>
                      <td className="px-2 py-1 text-right">{h.uchcha}</td>
                      <td className="px-2 py-1 text-right">{h.striPurusha}</td>
                      <td className="px-2 py-1 text-right">{h.dinaRatri}</td>
                      <td className="px-2 py-1 text-right font-semibold text-saffron">{h.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Interpretation: Tajika Bhushana's verses for this Muntha and year lord */}
          {(result as any).interpretation && <InterpretationSection it={(result as any).interpretation} />}

          {/* Arishta, yogas: Tajika Bhushana ch.6-7 and the yoga chapter */}
          {(result as any).yogas && <YogasSection y={(result as any).yogas} />}

          {/* Sahams as Tajika Bhushana gives them, beside the app's table */}
          {(result as any).bookSahams && <BookSahamsSection b={(result as any).bookSahams} />}

          {/* Monthly entry: Tajika Bhushana's last chapter */}
          {(result as any).masa && <MasaSection m={(result as any).masa} />}

          {/* Tripataki Chakra */}
          {(result as any).tripataki && (
            <section className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-semibold text-ink mb-1">திரிபதாகி சக்கரம் (Tripataki Chakra)</h3>
              <p className="text-xs text-ink-soft mb-3">D = முடிந்த ஆண்டு + 1. சந்திரன் D mod 9, சூரிய-குழு D mod 4, செவ்வாய் D mod 6 (முன்), ராகு D mod 6 (பின்).</p>
              <table className="w-full text-sm max-w-md">
                <thead><tr className="text-ink-soft border-b border-line">
                  <th className="px-2 py-1 text-left">கிரகம்</th><th className="px-2 py-1 text-left">ஜன்ம ராசி</th>
                  <th className="px-2 py-1 text-left">திரிபதாகி ராசி</th>
                </tr></thead>
                <tbody>
                  {(result as any).tripataki.map((t: any) => (
                    <tr key={t.planet} className="border-b border-line/50">
                      <td className="px-2 py-1">{t.planet}</td>
                      <td className="px-2 py-1 text-ink-soft">{['மேஷ', 'ரிஷப', 'மிது', 'கடக', 'சிம்', 'கன்னி', 'துலா', 'விரு', 'தனு', 'மகர', 'கும்ப', 'மீன'][t.natalRasiIndex]}</td>
                      <td className="px-2 py-1 font-medium">{['மேஷ', 'ரிஷப', 'மிது', 'கடக', 'சிம்', 'கன்னி', 'துலா', 'விரு', 'தனு', 'மகர', 'கும்ப', 'மீன'][t.tripatakiRasiIndex]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-ink-soft mt-2">முந்தைய AstrologicLab varshaphala engine-லிருந்து port.</p>
            </section>
          )}
        </div>
      )}
    </main>
  );
}

const PLANET_TA_V: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி' };

/** Tajika Bhushana's verses that apply to this year's Muntha, Munthesha and year lord. No verdict is drawn; the book's own rule is that the Munthesha's strength raises or lowers them (v.24). */
function InterpretationSection({ it }: { it: any }) {
  return (
    <section className="bg-surface border border-line rounded-lg p-5">
      <h3 className="font-semibold text-ink mb-1">வருஷபல விளக்கம் — தாஜிக பூஷணம் (கணேச தைவஜ்ஞர்)</h3>
      <p className="text-xs text-ink-soft mb-3">
        இந்த ஆண்டின் முந்தா, முந்தேசன், வர்ஷபதிக்குப் பொருந்தும் நூற்பாக்கள். எதுவும் தள்ளப்படவில்லை, கூட்டப்படவில்லை; முந்தேசனின் பலத்தால் இவை கூடிக் குறையும் என்பது நூலின் விதி (பா.24), எண் வரம்பு தரப்படவில்லை.
        {' '}{citeTa(it.source)}
      </p>
      <p className="text-xs text-ink-soft mb-3">
        முந்தா வர்ஷ லக்னத்திலிருந்து {it.facts.munthaHouse}-ஆம் வீடு, ஜன்ம லக்னத்திலிருந்து {it.facts.munthaHouseFromJanmaLagna}-ஆம் வீடு · முந்தேசன் {PLANET_TA_V[it.facts.munthesha]} வர்ஷ லக்னத்திலிருந்து {it.facts.munthesheaHouse}-ஆம் வீட்டில்.
      </p>
      <ul className="space-y-2 text-sm mb-4">
        {it.readings.map((r: any) => (
          <li key={r.id} className="border-b border-line/40 pb-2">
            <div className="font-medium text-ink">{r.titleTa} <span className="text-xs text-ink-soft">({r.verse}, ப.{r.printedPage})</span></div>
            <div className="text-ink-soft">{r.text}</div>
          </li>
        ))}
      </ul>
      <h4 className="text-sm font-semibold text-ink mb-1">வர்ஷபதி {it.yearLord.planetTa}{it.yearLord.pvb != null ? ` — இயந்திரம் கணித்த பஞ்சவர்கீய பலம் ${it.yearLord.pvb}` : ''}</h4>
      <p className="text-xs text-ink-soft mb-2">நூல் வலிமை, நடுநிலை, குறைவு என மூன்று பலன்களைத் தருகிறது; எந்த அளவு எந்த நிலை என்று இப்பாக்கள் கூறவில்லை, எனவே மூன்றும் காட்டப்படுகின்றன.</p>
      <ul className="space-y-1 text-sm mb-3">
        {it.yearLord.readings.map((r: any) => (
          <li key={r.id}><span className="font-medium text-ink">{r.tierTa}</span> <span className="text-xs text-ink-soft">({r.verse}, ப.{r.printedPage})</span>: <span className="text-ink-soft">{r.text}</span></li>
        ))}
      </ul>
      <h4 className="text-sm font-semibold text-ink mb-1">வர்ஷ ஜாதகத்தில் கிரகங்கள் நிற்கும் வீடுகளின் பலன் (அத்தியாயம் 5, ப.45-63)</h4>
      <p className="text-xs text-ink-soft mb-2">ஒவ்வொரு கிரகத்துக்கும் வர்ஷ லக்னத்திலிருந்து அது நிற்கும் வீட்டின் நூற்பா. நூல் கேதுவுக்குப் பலன் தரவில்லை. சந்திரனுக்கு: பாகையில் அதிகமாக (ஒளி கூடக் கூட) பலன் அதிக சுபம், குறையக் குறைய தீயது (பா.14) — அளவு தரப்படவில்லை.</p>
      <ul className="space-y-1.5 text-sm mb-4">
        {(it.bhavaPhala ?? []).map((b: any) => (
          <li key={b.planet}>
            <span className="font-medium text-ink">{b.planetTa} — {b.house}-ஆம் வீடு</span> <span className="text-xs text-ink-soft">({b.verse}, ப.{b.printedPage})</span>: <span className="text-ink-soft">{b.text}</span>
            {b.note && <span className="block text-xs text-ink-soft">({b.note.verse}, ப.{b.note.printedPage}) {b.note.text}</span>}
          </li>
        ))}
      </ul>
      <h4 className="text-sm font-semibold text-ink mb-1">முத்தா (பத்யாயினி) தசைகளின் பலன் — அத்தியாயங்கள் 8-9 (ப.73-90)</h4>
      <p className="text-xs text-ink-soft mb-2">ஒவ்வொரு தசைக்கும் நூல் நான்கு நிலைகளுக்குப் பலன் தருகிறது (முழு வலிமை, நடுநிலை, வலிமை குறைவு, பலம் அழிந்தது); எந்த நிலை என்பதற்கு எண் வரம்பு தரவில்லை, எனவே நான்கும் காட்டப்படுகின்றன. தேதிகள் இந்தப் பக்கத்தின் தசைக் கணக்கிலிருந்து (365.25 நாள் ஆண்டு); நூல் 360 நாள் ஆண்டைப் பகிர்கிறது (ப.75) — ஒத்துப்போகவில்லை. அந்தர தசைகளின் வரிசையும் நீளமும் நூற்பாவில் இல்லை.</p>
      <div className="space-y-2 mb-4">
        {(it.mudda ?? []).map((d: any, i: number) => (
          <details key={i} className="border border-line/50 rounded p-2 text-sm">
            <summary className="cursor-pointer text-ink">{d.lordTa} தசை <span className="text-xs text-ink-soft">({d.start} → {d.end}, {d.days} நாள்)</span></summary>
            {d.lagna ? (
              <div className="mt-2 text-ink-soft">
                <p>({d.lagna.verse}, ப.{d.lagna.printedPage}) {d.lagna.text}</p>
                <p className="text-xs mt-1">இந்த வர்ஷ லக்னம்: {({ MOVABLE: 'சர', FIXED: 'ஸ்திர', DUAL: 'உபய' } as any)[d.lagna.signType]} ராசி, {d.lagna.drekkana}-ஆம் திரேக்காணம் → {({ BEST: 'சிறப்பு', MIDDLE: 'நடுநிலை', HARD: 'கஷ்டம்', INAUSPICIOUS: 'அசுபம்', AUSPICIOUS: 'சுபம்' } as any)[d.lagna.grade]}. ({d.lagna.note.verse}, ப.{d.lagna.note.printedPage}) {d.lagna.note.text}</p>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <ul className="space-y-1">
                  {d.tiers.map((t: any) => <li key={t.tier}><span className="font-medium text-ink">{t.tierTa}</span> <span className="text-xs text-ink-soft">({t.verse}, ப.{t.printedPage})</span>: <span className="text-ink-soft">{t.text}</span></li>)}
                  {d.rule && <li className="text-xs text-ink-soft">({d.rule.verse}, ப.{d.rule.printedPage}) {d.rule.text}</li>}
                </ul>
                <div>
                  <div className="text-xs font-semibold text-ink">அந்தர தசைகள்</div>
                  <ul className="space-y-0.5 text-xs">
                    {d.antar.map((a: any) => <li key={a.lord}><span className="font-medium text-ink">{a.lordTa}</span> <span className="text-ink-soft">({a.verse}, ப.{a.printedPage}): {a.text}</span></li>)}
                  </ul>
                </div>
              </div>
            )}
          </details>
        ))}
      </div>
      <p className="text-[11px] text-ink-soft">கணக்கிடப்படாதவை: {it.notApplied.join(' · ')}.</p>
    </section>
  );
}

const YOGA_STATUS: Record<string, { label: string; cls: string }> = {
  HELD: { label: 'நிபந்தனை உள்ளது', cls: 'bg-teal-soft text-teal' },
  NOT_HELD: { label: 'இல்லை', cls: 'bg-surface-2 text-ink-soft' },
  UNKNOWN: { label: 'அறியப்படவில்லை', cls: 'bg-amber-100 text-amber-800' },
};
const YOGA_GROUPS: [string, string][] = [['arishta', 'அரிஷ்டம் (அத்.6)'], ['arishta-bhanga', 'அரிஷ்ட பங்கம் (அத்.7)'], ['yoga', 'யோகங்கள்'], ['raja-bhanga', 'ராஜ பங்கம்']];

/** Tajika Bhushana's arishta, arishta-bhanga and yoga conditions over this year's chart. No verdict: where the book says "arishta", this says the condition holds. */
function YogasSection({ y }: { y: any }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="bg-surface border border-line rounded-lg p-5">
      <h3 className="font-semibold text-ink mb-1">அரிஷ்டம், அரிஷ்ட பங்கம், யோகங்கள் — தாஜிக பூஷணம் (ப.64-68)</h3>
      <p className="text-xs text-ink-soft mb-3">
        நூல் கூறும் நிபந்தனைகள் இந்த வர்ஷ ஜாதகத்தில் உள்ளனவா என்று மட்டும் காட்டுகிறது; "அரிஷ்டம் நிகழும்" என்ற முடிவு தரப்படவில்லை.
        "அறியப்படவில்லை" = நூல் வரையறுக்காத ஒன்று (பார்வை, அஸ்தமன ஓர்ப், பலத்தின் தரம்) தேவை.
        {' '}{citeTa(y.source)}
      </p>
      <p className="text-xs text-ink-soft mb-3">உள்ளது {y.summary.held} · இல்லை {y.summary.notHeld} · அறியப்படவில்லை {y.summary.unknown}</p>
      {YOGA_GROUPS.map(([g, title]) => {
        const rows = y.rules.filter((r: any) => r.group === g);
        if (!rows.length) return null;
        return (
          <div key={g} className="mb-3">
            <h4 className="text-sm font-semibold text-ink mb-1">{title}</h4>
            <ul className="space-y-1 text-xs">
              {rows.map((r: any) => {
                const st = YOGA_STATUS[r.status];
                return (
                  <li key={r.id} className="border-b border-line/40 pb-1">
                    <button type="button" onClick={() => setOpen(open === r.id ? null : r.id)} className="text-left w-full">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded mr-2 ${st.cls}`}>{st.label}</span>
                      <span className="text-ink">{r.titleTa}</span> <span className="text-ink-soft">({r.verse}, ப.{r.printedPage})</span>
                    </button>
                    {open === r.id && <p className="mt-1 text-ink-soft leading-relaxed">{r.detail}</p>}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <p className="text-[11px] text-ink-soft">{y.conventions.join(' · ')}.</p>
    </section>
  );
}

/** The sahams of Tajika Bhushana (printed 68-71), computed over this annual chart and set beside the app's own table; where they differ, both stay. */
function BookSahamsSection({ b }: { b: any }) {
  return (
    <section className="bg-surface border border-line rounded-lg p-5">
      <h3 className="font-semibold text-ink mb-1">சஹமங்கள் — தாஜிக பூஷணம் (ப.68-71)</h3>
      <p className="text-xs text-ink-soft mb-2">
        நூல் தரும் 19 சூத்திரங்கள் (A − B + C), இந்த வர்ஷ ஜாதகத்தில் கணக்கிடப்பட்டவை ({b.isDay ? 'பகல்' : 'இரவு'} பிறப்பாகக் கொண்டு; நூல் பகல்-இரவை எப்படி முடிவு செய்வதென்று கூறவில்லை, இங்கே 6-18 மணி).
        பக்கத்தின் மேலே உள்ள சஹம அட்டவணை (தாஜிக நீலகண்டீயம்) தனி; இரண்டும் காட்டப்படுகின்றன. {citeTa(b.source)}
      </p>
      <p className="text-xs text-ink-soft mb-3">{b.reading.textTa} ({b.reading.verse}, ப.{b.reading.printedPage})</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>
          <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">சஹமம்</th><th className="pr-2">நூல்</th><th className="pr-2">தீர்க்கம்</th><th>பக்கத்தின் அட்டவணையுடன்</th></tr></thead>
          <tbody>
            {b.sahams.map((s: any) => (
              <tr key={s.key} className="border-t border-line/40 align-top">
                <td className="py-1 pr-2">{s.nameTa}</td>
                <td className="pr-2 text-ink-soft" title={s.textTa}>{s.verse}, ப.{s.printedPage}{s.when === 'DAY' ? (s.reversed ? ' (இரவு: தலைகீழ்)' : ' (பகல்)') : ' (இரவு-பகல் ஒன்றே)'}</td>
                <td className="pr-2">{s.longitude == null ? <span className="text-rose">{s.status === 'NIGHT_UNCLEAR' ? 'இரவு விதி தெளிவில்லை' : 'கணக்கிட முடியவில்லை'}</span> : `${SIGN_TA_V[s.signIndex]} ${s.degree.toFixed(2)}°`}</td>
                <td className="text-ink-soft">
                  {!s.app ? 'அட்டவணையில் இணை இல்லை' : s.app.same ? `ஒன்றே (${s.app.nameTa})` : s.app.onlyThe30 ? `30° மட்டுமே வேறு (${s.app.nameTa}: +30 திருத்தம்)` : `வேறு: ${s.app.nameTa} ${s.app.signTa} (${s.app.differenceDeg > 0 ? '+' : ''}${s.app.differenceDeg}°)`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-ink-soft mt-2">கணக்கிடப்படாதவை: {b.notApplied.join(' · ')}. {b.notes}</p>
    </section>
  );
}
const SIGN_TA_V = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

/** The monthly entries of the year (Tajika Bhushana printed 90-96): the instant the Sun is at the birth Sun plus k signs, the month's lagna, the month lord and its results. */
function MasaSection({ m }: { m: any }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="bg-surface border border-line rounded-lg p-5">
      <h3 className="font-semibold text-ink mb-1">மாத பிரவேசம் — தாஜிக பூஷணம் (ப.90-96)</h3>
      <p className="text-xs text-ink-soft mb-2">
        மாதம் k இன் பிரவேசம் = சூரியன் ஜன்ம சூரியனுடன் k ராசி கூட்டிய இடத்தை அடையும் கணம் ({m.method.verse}, ப.{m.method.printedPage}); அந்த நேரத்து லக்னம் மாத லக்னம் ({m.lagnaRule.verse}). மாதபதி = லக்னாதிபதியின் நவாம்ச அதிபதி, லக்னத்தின் நவாம்ச அதிபதி — இவ்விருவரில் பலசாலி ({m.lordRule.verse}).
        {' '}{m.lordRule.text.split('.').slice(-2).join('.')}
        {' '}{citeTa(m.source)}
      </p>
      <p className="text-xs text-ink-soft mb-3">{m.strength.text} ({m.strength.verse}, ப.{m.strength.printedPage})</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>
          <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">மாதம்</th><th className="pr-2">பிரவேசம் (பிறந்த இடத்தின் நேரம்)</th><th className="pr-2">சூரியன்</th><th className="pr-2">லக்னம்</th><th>மாதபதி (பலம்)</th></tr></thead>
          <tbody>
            {m.months.map((x: any) => (
              <Fragment key={x.index}>
                <tr className="border-t border-line/40 cursor-pointer" onClick={() => setOpen(open === x.index ? null : x.index)}>
                  <td className="py-1 pr-2">{x.index + 1}</td><td className="pr-2">{x.local}</td><td className="pr-2">{x.sunSignTa}</td><td className="pr-2">{x.lagnaSignTa}</td>
                  <td>{x.candidates.map((c: any) => `${c.planetTa} ${c.pvb}`).join(' / ')}{x.leading ? ` → ${x.candidates.find((c: any) => c.planet === x.leading).planetTa}` : x.sameCandidate ? '' : ' → சமம்'}</td>
                </tr>
                {open === x.index && (
                  <tr className="bg-surface-2/40"><td colSpan={5} className="p-2">
                    {x.results.map((r: any) => (
                      <p key={r.planet} className="mb-1"><span className="font-medium text-ink">{r.planetTa}{x.sameCandidate ? '' : r.leading ? ' (முன்னிலை)' : ' (மற்றவர்)'}</span> <span className="text-ink-soft">({r.verse}, ப.{r.printedPage}): {r.text}</span></p>
                    ))}
                  </td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <details className="mt-3 text-xs text-ink-soft">
        <summary className="cursor-pointer">தினசர்யா (தின பிரவேசம்) மற்றும் உணவு விதிகள் — பதிவு மட்டும்</summary>
        <p className="mt-1">{m.daily.text} ({m.daily.verse}, ப.{m.daily.printedPage})</p>
        <p className="mt-1">{m.food.text} ({m.food.verse}, ப.{m.food.printedPage})</p>
      </details>
      <p className="text-[11px] text-ink-soft mt-2">கணக்கிடப்படாதவை: {m.notApplied.join(' · ')}. பலம் எப்படி என்பதை நூல் கூறவில்லை; இங்கே பஞ்சவர்கீய பலம் காட்டப்பட்டு, அதிகமானது "முன்னிலை" என்று குறிக்கப்படுகிறது; சமமெனில் தேர்வு செய்யப்படவில்லை.</p>
    </section>
  );
}
