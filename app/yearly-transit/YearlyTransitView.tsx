'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { VedicChartBox } from '@/src/charts/kattam/VedicChartBox';
import { fromParashariChart } from '@/src/charts/kattam/rasiNames';
import { computeYearlyTransit } from './actions';

/**
 * PL9's "Yearly transit overview (South Indian)": the birth chart in the middle, and around it, beside the sign it belongs to, the stays
 * of each planet in that sign through the calendar year. The 4 x 4 grid mirrors the South Indian sign positions; the middle 2 x 2 holds the chart.
 * An entry is cut only at a sign ingress; R marks a planet that is retrograde as its stay begins and (D) one that turns direct inside it.
 * Pure astronomy, no book; the stations inside each stay are in the entry's tooltip.
 */

/** [row, col] of each sign (0 Aries .. 11 Pisces) in the South Indian layout. */
const POS: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 3], [3, 2], [3, 1], [3, 0], [2, 0], [1, 0], [0, 0]];
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

export default function YearlyTransitView() {
  const [party, setParty] = useState<Party | null>(null);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [basis, setBasis] = useState<'UT' | 'LOCAL'>('LOCAL');
  const [pl9, setPl9] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeYearlyTransit({
      ...(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input }),
      year: parseInt(year, 10) || new Date().getFullYear(), dateBasis: basis, pl9Marks: pl9,
    })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party, year, basis, pl9]);

  const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';
  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Yearly transit overview · South Indian</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஆண்டு கோசாரம் — தென்னிந்திய கட்டம்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          நடுவில் ஜன்ம ராசிக் கட்டம்; சுற்றிலும் ஒவ்வொரு ராசிக்கும் அருகில், அந்த ஆண்டில் கிரகங்கள் அந்த ராசியில் இருக்கும் காலங்கள்.
          ஒரு வரி = ஒரு ராசித் தங்கல் (ராசி மாற்றத்தில் மட்டுமே பிரிகிறது). வ = தங்கல் தொடங்கும்போது வக்ரம்; (நே) = அந்தத் தங்கலுக்குள் நேர்கதிக்குத் திரும்புகிறது.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <label className="text-xs text-ink-soft">ஆண்டு<br /><input className={`${field} w-24`} value={year} onChange={(e) => setYear(e.target.value)} /></label>
          <label className="text-xs text-ink-soft">தேதிகள்<br />
            <select className={field} value={basis} onChange={(e) => setBasis(e.target.value as 'UT' | 'LOCAL')}>
              <option value="LOCAL">பிறந்த இடத்தின் நேரம்</option>
              <option value="UT">UT (PL9 அச்சிடும் நாள்)</option>
            </select>
          </label>
          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={pl9} onChange={(e) => setPl9(e.target.checked)} /> PL9 போல் (வக்ரக் குறி: செவ், புதன், சுக்கிரன், ராகு-கேது மட்டும்)</label>
        </div>
        <p className="text-[11px] text-ink-soft mt-2">PL9 நாட்களை UT-யில் அச்சிடுகிறது; சென்னை நேரத்தில் ஒரு நாள் பின்னால் தெரியலாம். குரு, சனியின் வக்ரம் PL9-இல் குறிக்கப்படுவதில்லை — இங்கே இயல்பாக எல்லா கிரகங்களுக்கும் குறிக்கப்படும்.</p>
      </section>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <section className="bg-surface border border-line rounded-2xl p-4">
          <h2 className="font-semibold text-ink text-sm mb-3">{result.native.name ?? '(பெயர் இல்லை)'} · {result.year}</h2>
          <div className="grid grid-cols-4 gap-2 text-[11px] leading-snug" style={{ gridTemplateRows: 'repeat(4, auto)' }}>
            {result.cells.map((stays: any[], sign: number) => (
              <div key={sign} style={{ gridRow: POS[sign][0] + 1, gridColumn: POS[sign][1] + 1 }} className="min-w-0 p-1.5 rounded border border-line/60 bg-surface-2/40">
                <div className="text-ink-soft font-semibold mb-0.5">{SIGN_TA[sign]}</div>
                {stays.map((s, i) => (
                  <div key={i} title={s.stations.join(' · ')} className={s.retrograde ? 'text-rose' : 'text-ink'} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {s.text.replace('(D)', '(நே)').replace(/^(\S+?)R/, '$1 வ')}
                  </div>
                ))}
              </div>
            ))}
            <div style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }} className="flex items-center justify-center">
              <VedicChartBox {...fromParashariChart(result.chart)} title="ஜன்ம ராசி" size={300} />
            </div>
          </div>
          <p className="text-[11px] text-ink-soft mt-3">வரிக்கு மேல் சுட்டியை வைத்தால் அந்தத் தங்கலுக்குள் நடக்கும் வக்ரம்/நேர்கதி நாட்கள் தெரியும். தேதிகள்: {result.dateBasis === 'UT' ? 'UT' : 'பிறந்த இடத்தின் நேரம்'}.</p>
        </section>
      )}
    </main>
  );
}
