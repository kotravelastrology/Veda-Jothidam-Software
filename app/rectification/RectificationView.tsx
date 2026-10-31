'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { usePartyInput } from '@/src/ui/chartParty';
import { VedicChartBox } from '@/src/charts/kattam/VedicChartBox';
import { fromParashariChart } from '@/src/charts/kattam/rasiNames';
import { computeRectification } from './actions';

type R = any;

function Verdict({ ok }: { ok: boolean }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded ${ok ? 'bg-teal-soft text-teal' : 'bg-rose-soft text-rose'}`}>
      {ok ? '✓ agrees' : '✗ disagrees'}
    </span>
  );
}

export default function RectificationView() {
  const [party, setParty] = useState<Party | null>(null);
  const { input, loading: inputLoading } = usePartyInput(party);
  const [result, setResult] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The person chosen (or the open chart, chosen by itself) is computed at once
  useEffect(() => {
    if (!input) { setResult(null); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    computeRectification(input)
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [input]);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Birth-Time Rectification</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஜனன கால திருத்தம்</h1>
        <p className="text-sm text-ink-soft mt-1">
          Three classical cross-checks on a recorded birth time — Prāṇa/Deha daśā, Kunda Siddhānta (×81),
          and Tattwa / Antar-Tattwa.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading || inputLoading} />
      {error && <p className="text-rose text-sm mb-4">⚠️ {error}</p>}

      {result && (
        <div className="space-y-6">
          {/* பதிவு செய்யப்பட்ட நேரத்தின் ராசி கட்டம் — 3 சோதனைகளும் இதை அடிப்படையாகக் கொண்டவை */}
          <section className="bg-surface-soft rounded-lg p-5 border border-line flex flex-col items-center">
            <h2 className="font-semibold text-ink mb-3 self-start">பதிவு நேர ராசி கட்டம் (D1)</h2>
            <VedicChartBox {...fromParashariChart(result.chart)} />
          </section>

          {/* ① Prāṇa / Deha */}
          <section className="bg-surface-soft rounded-lg p-5 border border-line">
            <h2 className="font-semibold text-ink mb-3">① பிராண / தேக தசை (Prāṇa / Deha daśā at birth)</h2>
            <div className="overflow-x-auto mb-3">
              <table className="text-sm w-full">
                <tbody>
                  {result.pranaDeha.chain.map((l: any, i: number) => (
                    <tr key={i} className={i === 5 ? 'font-bold text-ink' : 'text-ink-soft'}>
                      <td className="py-1 pr-4">{l.level}</td>
                      <td className="py-1">{l.lordTamil} ({l.lord})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-sm space-y-1">
              <p>
                Deha lord <strong>{result.pranaDeha.deha.lordTamil}</strong> — gender {result.pranaDeha.dehaGender.gender}{' '}
                <Verdict ok={result.pranaDeha.dehaGender.matches} /> vs stated {result.pranaDeha.genderStated}
              </p>
              {result.pranaDeha.dehaConditionIndicative && (
                <p className="text-ink-soft">Indicative birth condition: {result.pranaDeha.dehaConditionIndicative}</p>
              )}
            </div>
            <p className="text-xs text-ink-soft mt-2">{result.pranaDeha.disclaimer}</p>
          </section>

          {/* ② Kunda */}
          <section className="bg-surface-soft rounded-lg p-5 border border-line">
            <h2 className="font-semibold text-ink mb-3">② குண்ட சித்தாந்தம் ×81 (Kunda Siddhānta)</h2>
            <div className="text-sm space-y-1">
              <p>Lagna {result.kunda.lagnaLongitude}° · Janma nakṣatra <strong>{result.kunda.janmaNakshatra}</strong> (lord {result.kunda.janmaLord})</p>
              <p>Kunda point {result.kunda.kundaLongitude}° → <strong>{result.kunda.kundaNakshatra}</strong> pāda {result.kunda.kundaPada} (lord {result.kunda.kundaLord})</p>
              <p>Same nakṣatra-lord group? <Verdict ok={result.kunda.matches} /></p>
            </div>
          </section>

          {/* ③ Tattwa */}
          <section className="bg-surface-soft rounded-lg p-5 border border-line">
            <h2 className="font-semibold text-ink mb-3">③ தத்துவம் / அந்தர தத்துவம் (Tattwa / Antar-Tattwa)</h2>
            <div className="text-sm space-y-1">
              <p>Sunrise {result.tattwa.sunriseLocal} · {result.tattwa.minutesSinceSunrise} min after sunrise · round {result.tattwa.round} ({result.tattwa.direction})</p>
              <p>Main <strong>{result.tattwa.mainTattwa}</strong> · Antar <strong>{result.tattwa.antarTattwa}</strong> (gender {result.tattwa.antarGender})</p>
              <p>Antar-gender vs stated {result.tattwa.genderStated}: <Verdict ok={result.tattwa.matches} /></p>
              {!result.tattwa.matches && result.tattwa.suggestedShiftSeconds !== 0 && (
                <p className="text-ink">
                  Suggested nudge: <strong>{result.tattwa.suggestedShiftSeconds > 0 ? '+' : ''}{result.tattwa.suggestedShiftSeconds}s</strong>
                  {' '}→ Antar {result.tattwa.adjustedAntarTattwa}
                </p>
              )}
            </div>
            <p className="text-xs text-ink-soft mt-2">{result.tattwa.disclaimer}</p>
          </section>

          <p className="text-xs text-ink-soft">
            These are corroborating cross-checks, not an automatic rectifier. A time that clears all three is well-supported;
            disagreements mark a candidate window to test against known life events (see Charts → Rectification).
          </p>
        </div>
      )}
    </main>
  );
}
