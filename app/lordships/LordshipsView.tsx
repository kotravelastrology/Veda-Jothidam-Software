'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeLordships } from './actions';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/**
 * PL9's Lordships worksheet: for each of the twelve houses, the sign it holds, that sign's lord and the house the lord
 * sits in. An exchange (two lords in each other's houses) is marked with * on both houses, as PL9 prints it
 * ("3 - Me in 4 *"). Three tables: the birth chart (Rasi), the Navamsha (D9) and the Dashamsha (D10).
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };

const TABLES: { key: 'rasi' | 'navamsha' | 'dashamsha'; title: string }[] = [
  { key: 'rasi', title: 'ராசி (D1) — பிறப்பு ஜாதகம்' },
  { key: 'navamsha', title: 'நவாம்சம் (D9)' },
  { key: 'dashamsha', title: 'தசாம்சம் (D10)' },
];

export default function LordshipsView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeLordships(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Lordships" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">பாவாதிபதிகள் (Lordships)</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-2xl">
          ஒவ்வொரு பாவமும் எந்த ராசியைக் கொண்டுள்ளது, அந்த ராசியின் அதிபதி எந்தப் பாவத்தில் இருக்கிறார் என்பது.
          இரு அதிபதிகளும் ஒருவர் வீட்டில் ஒருவர் இருந்தால் (பரிவர்த்தனை) இரு பாவங்களிலும் * குறி இடப்படும் (PL9 வடிவம்: "3 - Me in 4 *").
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <p className="text-sm font-semibold text-ink mb-3">{result.native.name ?? '(பெயர் இல்லை)'} · {result.native.date} {result.native.time} · {result.native.placeName ?? '—'}</p>
          {TABLES.map((t) => (
            <section key={t.key} className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="font-semibold text-ink">{t.title}</h2>
              <table className="w-full text-xs mt-3">
                <thead>
                  <tr className="text-ink-soft border-b border-line text-left">
                    <th className="py-1 pr-2">பாவம்</th>
                    <th className="py-1 pr-2">ராசி</th>
                    <th className="py-1 pr-2">அதிபதி</th>
                    <th className="py-1 pr-2">அதிபதி இருக்கும் பாவம்</th>
                  </tr>
                </thead>
                <tbody>
                  {result[t.key].map((row: any) => (
                    <tr key={row.house} className="border-b border-line/40" style={num}>
                      <td className="py-1.5 pr-2 font-semibold text-ink">{row.house}</td>
                      <td className="py-1.5 pr-2">{row.signTa}</td>
                      <td className="py-1.5 pr-2">{row.lordTa}</td>
                      <td className="py-1.5 pr-2 font-mono">{row.lordHouse}{row.exchange ? ' *' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
          <p className="text-[11px] text-ink-soft">
            * = பரிவர்த்தனை (இரு அதிபதிகள் ஒருவர் வீட்டில் ஒருவர்). பாவங்கள் ராசி அடிப்படையில் (லக்னம் = 1).
          </p>
        </>
      )}
    </main>
  );
}
