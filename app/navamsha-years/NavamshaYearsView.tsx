'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeNavamshaYears } from './actions';
import { citeTa } from '@/src/sources/citeTa';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/**
 * Navamsha counts ("Navamsha Ages"): the 108 navamshas of 3d20' round the zodiac from Aries; the count from the
 * ascendant's navamsha to each planet's (ascendant = 1, the number PL9 shows) and from each planet's to the ascendant's, both ends
 * included. Each book's own reading is quoted by source; neither is made a prediction here.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };

export default function NavamshaYearsView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeNavamshaYears(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Navamsha counts" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">நவாம்ச எண்ணிக்கை (நவாம்ச வயது)</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-2xl">
          ராசி மண்டலத்தின் 108 நவாம்சங்களை (ஒவ்வொன்றும் 3°20′) மேஷத்திலிருந்து எண்ணி, லக்ன நவாம்சத்திலிருந்து ஒவ்வொரு கிரகத்தின் நவாம்சம் வரை இரு முனையும் சேர்த்து எண்ணுவது (லக்னம் = 1 — PL9 காட்டும் எண்); அதேபோல் கிரகத்திலிருந்து லக்னம் வரை.
          ஒரு நவாம்சம் ஒரு வயது என்று நூல்கள் எடுக்கின்றன. எந்த நூல் எதைச் சொல்கிறது என்பது கீழே; இங்கே பலன் சொல்லப்படவில்லை.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · {result.native.date} {result.native.time} · {result.native.placeName ?? '—'}</h2>
            <p className="text-xs text-ink-soft">{result.native.method.ayanamsha} அயனாம்சம் · லக்ன நவாம்சம்: {result.lagna.signTa} ராசியின் {result.lagna.place}-ஆவது (எண் {result.lagna.index + 1})</p>
            <table className="w-full text-xs mt-3">
              <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">நவாம்சம்</th><th className="py-1 pr-2">லக்னத்திலிருந்து</th><th className="py-1 pr-2">கிரகத்திலிருந்து லக்னம் வரை</th></tr></thead>
              <tbody>
                {result.planets.map((p: any) => (
                  <tr key={p.planet} className="border-b border-line/40" style={num}>
                    <td className="py-1.5 pr-2 font-semibold text-ink">{p.planetTa}</td>
                    <td className="py-1.5 pr-2">{p.signTa} {p.place}-ஆவது (எண் {p.index + 1})</td>
                    <td className="py-1.5 pr-2 font-mono">{p.fromLagna}</td>
                    <td className="py-1.5 pr-2 font-mono">{p.toLagna}{p.group === 'MALEFIC' ? ' · தீய ஆண்டு (ஹோரா சாரா, பட்டேல்)' : p.group === 'BENEFIC' ? ' · நல்ல ஆண்டு (ஹோரா சாரா, பட்டேல்)' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 text-sm">
            <h2 className="font-semibold text-ink mb-2">நூல்கள் என்ன சொல்கின்றன</h2>
            <p className="text-ink mb-2">
              <strong>ப்ரஸ்ன மார்கம்</strong> — லக்ன நவாம்சத்திலிருந்து மிகத் தீய கிரகத்தின் (சூரியன், செவ்வாய், சனி, ராகு, குளிகன் முதலியவை) நவாம்சம் வரை உள்ள எண்ணிக்கை, துன்பத்தின் அளவுக்கு ஏற்ப நாட்கள், மாதங்கள் அல்லது ஆண்டுகள்; அதற்குள் கேள்வி கேட்பவரின் மரணம் நிகழலாம்.
              இது கேள்வி (ப்ரஸ்ன) சாஸ்திர முறை, மரணத்துக்கு மட்டும். <span className="text-[11px] text-ink-soft">{citeTa(result.sources.prasnaMarga)}</span>
            </p>
            <p className="text-ink mb-2">
              <strong>ஹோரா சாரா (சி. பட்டேல் தரும் வடிவில்)</strong> — சனி, ராகு, செவ்வாயின் நவாம்சத்திலிருந்து லக்ன நவாம்சம் வரை இரு முனையும் சேர்த்த எண்ணிக்கை = காயம், துன்பம் நேரும் ஆண்டு; சந்திரன், புதன், குரு, சுக்கிரனிலிருந்து எண்ணினால் மக்கள், செல்வம், மகிழ்ச்சி தரும் ஆண்டு.
              பட்டேல்: "ஒரு நவாம்சம் ஒரு வயது"; பிறப்பு லக்னம் ஒரு நவாம்சம் (சுமார் 13 நிமிடம் 20 விநாடி) கூடினால் ஒவ்வொரு கிரகத்தின் ஆண்டும் ஒன்று கூடும். <span className="text-[11px] text-ink-soft">{citeTa(result.sources.horaSaraPatel)}</span>
            </p>
            <p className="text-[11px] text-rose">ஒரு முரண்பாடு: நம்மிடம் உள்ள ஹோரா சாரா வடிவம் (பகத் தட்டச்சுப் பிரதி, ப.60) இதே இடத்தில் "சனி, லக்னத்தின் நவாம்சங்களைக் கூட்டு" என்று சொல்கிறது; பட்டேலின் மொழிபெயர்ப்பு "எண்ணுக" என்கிறது. ஸ்லோகத்தின் சமஸ்கிருத மூலம் நம்மிடம் இல்லாததால் எது சரி என்று இங்கே தீர்மானிக்கப்படவில்லை; இரண்டும் குறிக்கப்பட்டுள்ளன. பட்டேல் ஒரு நவீன நூல்.</p>
          </section>
        </>
      )}
    </main>
  );
}
