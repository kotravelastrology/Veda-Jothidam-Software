'use client';

import { Fragment, useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeVimshopaka } from './actions';
import { citeTa } from '@/src/sources/citeTa';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/**
 * Vimshopaka Bala: each planet's twenty points over a group of divisional charts. Every row shows the varga, the sign
 * (the Hora shows its lord only), the lord of that division, the planet's relation to that lord, the varga's share of the
 * twenty (Swaviswa), the Varga Viswa of that relation and the points. The sage's reading of the total is shown; the
 * translator's eight grades are shown apart, as his own assignment.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const n1 = (x: number) => (Math.round(x * 100) / 100).toString();
const READING_CLASS: Record<string, string> = { BELOW_5: 'text-rose', '5_10': 'text-ink', '10_15': 'text-ink', OVER_15: 'text-teal' };

export default function VimshopakaView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [scheme, setScheme] = useState('shadvarga');
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeVimshopaka(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  const current = result?.schemes.find((s: any) => s.scheme === scheme);

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Vimshopaka Bala" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">விம்சோபக பலம் — 20 புள்ளி வர்க்க பலம்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒரு கிரகம் வர்க்கச் சக்கரங்களில் எந்த நிலையில் உள்ளது என்பதை 20 புள்ளிகளில் அளக்கும் பராசரர் முறை (BPHS அத்.7). ஒவ்வொரு வர்க்கத்துக்கும் நூல் தரும் பங்கு (ஸ்வவிஸ்வ) × அந்த வர்க்க அதிபதியுடன் கிரகத்தின் உறவுக்கான புள்ளி (வர்க்க விஸ்வ: சொந்தம் 20, அதிமித்ரன் 18, மித்ரன் 15, சமன் 10, சத்ரு 7, அதிசத்ரு 5) ÷ 20.
          உறவு எப்போதும் பிறப்பு ராசி நிலையைக் கொண்ட பஞ்சதா மைத்ரி.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · {result.native.date} {result.native.time} · {result.native.placeName ?? '—'}</h2>
            <p className="text-xs text-ink-soft">{result.native.method.ayanamsha} அயனாம்சம்</p>
            <p className="text-[11px] text-ink-soft mt-1">{citeTa(result.source)}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {result.schemes.map((s: any) => (
                <button key={s.scheme} type="button" onClick={() => setScheme(s.scheme)}
                  className={`px-2 py-1 rounded border text-xs ${scheme === s.scheme ? 'bg-ink text-surface border-ink' : 'bg-surface-2 border-line text-ink'}`}>{s.nameTa}</button>
              ))}
            </div>
          </section>

          {current && (
            <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <table className="w-full text-xs" style={{ minWidth: 420 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">புள்ளி / 20</th><th className="py-1 pr-2">நூலின் கூற்று (பாடல் 26-27)</th><th className="py-1">உரையாசிரியர் தரம்</th></tr></thead>
                <tbody>
                  {current.planets.map((p: any) => (
                    <Fragment key={p.planet}>
                      <tr className="border-b border-line/40 cursor-pointer" onClick={() => setOpen(open === p.planet ? null : p.planet)} style={num}>
                        <td className="py-1.5 pr-2 font-semibold text-ink">{p.planetTa}</td>
                        <td className="py-1.5 pr-2 font-mono">{n1(p.total)}</td>
                        <td className={`py-1.5 pr-2 ${READING_CLASS[p.reading.id]}`}>{p.reading.ta}</td>
                        <td className="py-1.5 text-ink-soft">{p.translatorGrade.ta}</td>
                      </tr>
                      {open === p.planet && (
                        <tr><td colSpan={4} className="bg-surface-2 p-2">
                          <table className="w-full text-[11px]" style={num}>
                            <thead><tr className="text-ink-soft text-left"><th>வர்க்கம்</th><th>ராசி</th><th>அதிபதி</th><th>உறவு</th><th>ஸ்வவிஸ்வ</th><th>வர்க்க விஸ்வ</th><th>புள்ளி</th></tr></thead>
                            <tbody>
                              {p.rows.map((r: any) => (
                                <tr key={r.varga} className="border-t border-line/30">
                                  <td>{r.varga}</td><td>{r.signTa ?? '—'}</td><td>{r.lordTa}</td><td>{r.relationTa}</td><td>{n1(r.swaviswa)}</td><td>{r.viswa}</td><td className="font-mono">{n1(r.points)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td></tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-ink-soft mt-2">கிரகத்தை அழுத்தினால் வர்க்கம் வாரியான கணக்கு. 5-க்குக் கீழ்: நல்ல பலன் தர இயலாது; 5-10: சில நன்மை; 10-15: நடுத்தரம்; 15-க்கு மேல்: முழுவதும் நல்லது (நூல்). உரையாசிரியர் தரும் எட்டு தரங்கள் அவரது எண் ஒதுக்கீடு, முனிவரின் கூற்று அல்ல.</p>
              <p className="text-[11px] text-ink-soft mt-1">அச்சிட்ட குறிப்பு: உரையாசிரியர் ப.97-ன் சப்த வர்க்க அட்டவணையின் வரிசை பாடலின் வரிசையுடன் ஒத்துப்போகவில்லை (அட்டவணையில் நவாம்சம் 2½, துவாதசாம்சம் 4½, திரிம்சாம்சம் 2, சப்தாம்சம் 1; பாடலில் சப்தாம்சம் 2½, நவாம்சம் 4½, துவாதசாம்சம் 2, திரிம்சாம்சம் 1). பாடலின் வரிசை (வழக்கமானது) பயன்படுத்தப்பட்டுள்ளது.</p>
            </section>
          )}
        </>
      )}
    </main>
  );
}
