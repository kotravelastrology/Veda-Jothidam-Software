'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeDeclination } from './actions';

/**
 * Declination (kranti) of the seven planets: the angular distance north or south of the celestial equator at birth.
 * It is an astronomical quantity from the ephemeris (equatorial mode), independent of the ayanamsha. It is the same
 * Kranti the classical Ayana Bala reads (BPHS chapter 27 vv.15-17); no result is given here.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };

export default function DeclinationView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeDeclination(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Declination</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">கிராந்தி — கிரகங்களின் சாய்வு</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-2xl">
          பிறந்த நேரத்தில் ஒவ்வொரு கிரகமும் வான நடுக்கோட்டுக்கு வடக்கே (+) அல்லது தெற்கே (−) எத்தனை டிகிரி என்பது. இது வானியல் அளவு — அயனாம்சத்தைச் சார்ந்ததல்ல; ஈஃபெமெரிஸிலிருந்து எடுக்கப்படுகிறது.
          ஆயன பலம் (BPHS அத்.27 பா.15-17) படிக்கும் அதே கிராந்தி இதுவே. இங்கே பலன் எதுவும் சொல்லப்படவில்லை.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
          <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · {result.native.date} {result.native.time} · {result.native.placeName ?? '—'}</h2>
          <table className="w-full text-xs mt-3">
            <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">கிராந்தி</th><th className="py-1 pr-2">திசை</th><th className="py-1">டிகிரி</th></tr></thead>
            <tbody>
              {result.rows.map((r: any) => (
                <tr key={r.planet} className="border-b border-line/40" style={num}>
                  <td className="py-1.5 pr-2 font-semibold text-ink">{r.planetTa}</td>
                  <td className="py-1.5 pr-2 font-mono">{r.declination < 0 ? '−' : '+'}{r.dms.d}°{String(r.dms.m).padStart(2, '0')}′{String(r.dms.s).padStart(2, '0')}″</td>
                  <td className="py-1.5 pr-2">{r.hemisphere === 'N' ? 'வடக்கு' : 'தெற்கு'}</td>
                  <td className="py-1.5 font-mono text-ink-soft">{r.declination.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-ink-soft mt-2">ராகு, கேது, யுரேனஸ், நெப்டியூன், புளூட்டோ இங்கே இல்லை (பாரம்பரிய ஏழு கிரகங்கள் மட்டும்).</p>
        </section>
      )}
    </main>
  );
}
