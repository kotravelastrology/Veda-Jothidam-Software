'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeSripatiBhava } from './actions';
import { citeTa } from '@/src/sources/citeTa';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/**
 * Sripatipaddhati I.6-11: the trisected points are the bhavas themselves (their middles), half the sum of two contiguous bhavas is
 * their Sandhi, and a planet short of a Sandhi gives the effect of the bhava before it. The planet's effect in its bhava is the
 * distance to the nearer Sandhi over the Bhavamsa (bhava point to that Sandhi). The chart pages of the app take the same points
 * as the beginnings of the houses; both placements are shown, with no choice made for the reader.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const dms = (p: any) => `${p.d}°${String(p.m).padStart(2, '0')}′${String(p.s).padStart(2, '0')}″ ${p.signTa}`;

export default function SripatiBhavaView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeSripatiBhava(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Sripati bhava · Sripatipaddhati I.6-11" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஸ்ரீபதி பாவம் — பாவ மையங்கள், சந்திகள், கிரக பலன் அளவு</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          லக்னம், 4, 7, 10 ஆகியவற்றின் இடையே மூன்றில் ஒரு பங்கு, மூன்றில் இரண்டு பங்கு சேர்த்துப் பெறும் பன்னிரண்டு புள்ளிகளே பாவங்கள் (அவற்றின் நடுவு); இரண்டு அடுத்த பாவங்களின் கூட்டுத்தொகையின் பாதி சந்தி.
          சந்திக்கு முன் உள்ள கிரகம் முந்தைய பாவத்தின் பலனையும், சந்தியைக் கடந்தால் அடுத்த பாவத்தின் பலனையும் தரும்; பாவ நடுவில் முழுப் பலன், சந்தியை நோக்கிக் குறையும் (மூன்றின் விதி).
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · {result.native.date} {result.native.time} · {result.native.placeName ?? '—'}</h2>
            <p className="text-[11px] text-ink-soft mt-1">{citeTa(result.source)}</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm overflow-x-auto">
            <h3 className="font-semibold text-ink mb-2">பாவங்கள் மற்றும் சந்திகள்</h3>
            <table className="w-full text-xs">
              <thead><tr className="text-left text-ink-soft"><th className="pr-2">பாவம்</th><th className="pr-2">தொடக்க சந்தி</th><th className="pr-2">பாவ மையம்</th><th>முடிவு சந்தி</th></tr></thead>
              <tbody>
                {result.rows.map((r: any) => (
                  <tr key={r.bhava} className="border-t border-line" style={num}>
                    <td className="py-1 pr-2">{r.bhava}</td><td className="pr-2">{dms(r.start)}</td><td className="pr-2">{dms(r.point)}</td><td>{dms(r.end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm overflow-x-auto">
            <h3 className="font-semibold text-ink mb-2">கிரகங்கள்</h3>
            <table className="w-full text-xs">
              <thead><tr className="text-left text-ink-soft"><th className="pr-2">கிரகம்</th><th className="pr-2">தீர்க்கம்</th><th className="pr-2">ஸ்ரீபதி பாவம்</th><th className="pr-2">பலன் அளவு</th><th className="pr-2">நிலை</th><th>புள்ளியைத் தொடக்கமாக எடுக்கும் பக்கங்களில்</th></tr></thead>
              <tbody>
                {result.planets.map((p: any) => (
                  <tr key={p.name} className="border-t border-line" style={num}>
                    <td className="py-1 pr-2">{p.nameTa}</td>
                    <td className="pr-2">{dms(p.position)}</td>
                    <td className="pr-2">{p.bhava}</td>
                    <td className="pr-2">{p.fraction.toFixed(4)}</td>
                    <td className="pr-2">{p.phase === 'aroha' ? 'ஆரோஹ (ஏறுகிறது)' : 'அவரோஹ (இறங்குகிறது)'}</td>
                    <td className={p.cuspHouse === p.bhava ? '' : 'text-rose'}>{p.cuspHouse}{p.cuspHouse === p.bhava ? '' : ' (வேறுபடுகிறது)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-ink-soft mt-2">ஆரோஹ = கிரகம் பாவ மையத்துக்கு முன் (பலன் கூடுகிறது); அவரோஹ = பின் (குறைகிறது). நூலின் அட்டவணையில் சுக்கிரனின் அளவு (.9653) இந்த விதியின் .9702-உடன் மட்டும் ஒத்துப்போகவில்லை; மற்ற ஆறும் ஒத்துப்போகின்றன — docs/SRIPATI-BHAVA.md.</p>
          </section>
        </>
      )}
    </main>
  );
}
