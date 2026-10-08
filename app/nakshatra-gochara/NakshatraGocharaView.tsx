'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeNakshatraGochara } from './actions';

/**
 * Nakshatra gochara: each planet's star counted from the natal star. The
 * taras, the per-planet good and bad stars and the combination rules are
 * Pulippani's; the limbs (anga phala) come from four books, the one that
 * explains most (Bhat) first.
 */

const BOOK_TA: Record<string, string> = { BHAT: 'பட்', PULIPPANI: 'புலிப்பாணி', SUDAMANI: 'சூடாமணி', GOUR: 'கௌர்' };
const CLASS: Record<string, { ta: string; cls: string }> = {
  GOOD: { ta: 'நல்ல நட்சத்திரம்', cls: 'text-teal' },
  BAD: { ta: 'தீய நட்சத்திரம்', cls: 'text-rose' },
  NONE: { ta: 'பலன் இல்லை', cls: 'text-ink-soft' },
};
const NATURE_TA: Record<string, string> = { BENEFIC: 'சுபர்', MALEFIC: 'பாபர்', UNDETERMINED: 'தீர்மானிக்கவில்லை' };
const day = (iso: string) => iso.slice(0, 10);
const num = { fontVariantNumeric: 'tabular-nums' as const };
const cite = (s: any) => `${s.title} — ${String(s.pageLocus).split(':')[0]}`;
const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);

function Anga({ p, stay, book, only }: { p: any; stay: any; book: string; only?: boolean }) {
  const idx = stay.anga[book];
  if (idx === null) return <span className="text-ink-soft">{only ? 'இந்த நூலில் இல்லை' : null}</span>;
  return <>{idx.map((i: number) => { const a = p.angaTables[book][i]; return <span key={i} className="block">{a.limbTa} — {a.resultTa}</span>; })}</>;
}

export default function NakshatraGocharaView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planet, setPlanet] = useState('Saturn');
  const [book, setBook] = useState('BHAT');
  const [all, setAll] = useState(false);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeNakshatraGochara(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  const at = result ? Date.parse(result.atUtc) : 0;
  const keep = (ws: any[]) => (all ? ws : ws.filter((w) => Date.parse(w.toUtc) > at && Date.parse(w.fromUtc) < at + 2 * 365.25 * 86400000));
  const p = result?.planets[planet];

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Nakshatra Gochara</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">நட்சத்திரக் கோசாரம் — தாரை, அங்க பலன்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒவ்வொரு கிரகமும் இருக்கும் நட்சத்திரம், ஜன்ம நட்சத்திரத்திலிருந்து எண்ணி: தாரை, புலிப்பாணியின் நல்ல/தீய நட்சத்திரம், உடலின் எந்த உறுப்பில் என்பது (நான்கு நூல்கள்),
          ஜன்ம நட்சத்திரம் வரும் கிழமை. காலங்கள் வானியல் கணக்கு; பலன்கள் நூல்களின் கூற்று — இந்த மென்பொருளின் முன்கணிப்பு அல்ல.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && p && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · ஜன்ம நட்சத்திரம் {result.janma.starTa} · ஜன்ம ராசி {result.moonRasi.rasiTa}</h2>
            <p className="text-xs text-ink-soft">{result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · இப்போது {day(result.atUtc)}</p>
            <p className="text-[11px] text-ink-soft mt-2">அங்க பலன் வரிசை: அதிக விளக்கம் உள்ள நூல் முதலில் — {result.anga.rank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">இப்போது — ஒன்பது கிரகங்களும்</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 820 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">நட்சத்திரம் · எண்ணிக்கை · தாரை</th>
                  <th className="py-1 pr-2">புலிப்பாணி</th><th className="py-1 pr-2">அங்கம் — {BOOK_TA.BHAT}</th><th className="py-1">மற்ற நூல்கள்</th>
                </tr></thead>
                <tbody className="align-top">
                  {Object.values(result.planets).map((q: any) => {
                    const n = q.now;
                    if (!n) return null;
                    const tara = result.taras[n.tara - 1];
                    return (
                      <tr key={q.planet} className="border-b border-line/40">
                        <td className="py-1.5 pr-2 font-semibold text-ink">{q.planetTa}</td>
                        <td className="py-1.5 pr-2 text-ink">{n.starTa} · {n.count} · {tara.pulippaniTa} ({tara.pulippaniResultTa}){tara.bhatTa !== tara.pulippaniTa && <span className="text-ink-soft"> / பட்: {tara.bhatTa}</span>}</td>
                        <td className="py-1.5 pr-2">
                          <span className={CLASS[n.starClass].cls}>{CLASS[n.starClass].ta}</span>
                          <span className="block text-ink-soft">{n.rasisTa.join(' / ')} · {n.houses.join(' / ')}-ஆம் இடம் · {NATURE_TA[n.nature]}</span>
                          {n.combination.map((c: any) => <span key={c.id + c.house} className="block text-ink">{c.house}-ல்: {c.textTa}</span>)}
                        </td>
                        <td className="py-1.5 pr-2 text-ink"><Anga p={q} stay={n} book="BHAT" only /></td>
                        <td className="py-1.5 text-ink-soft">
                          {result.anga.order.filter((b: string) => b !== 'BHAT').map((b: string) => n.anga[b] && (
                            <span key={b} className="block"><strong>{BOOK_TA[b]}:</strong> {n.anga[b].map((i: number) => { const a = q.angaTables[b][i]; return `${a.limbTa} — ${a.resultTa}`; }).join('; ')}</span>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-soft mt-2">{result.combinedTa}</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">ஒவ்வொரு கிரகமும் — காலங்கள்</h2>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {Object.values(result.planets).map((q: any) => (
                <button key={q.planet} type="button" onClick={() => setPlanet(q.planet)}
                  className={`text-xs px-2 py-1 rounded border ${q.planet === planet ? 'border-saffron bg-amber-50 text-ink font-semibold' : 'border-line text-ink-soft'}`}>{q.planetTa}</button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mb-2 text-xs">
              <span className="text-ink-soft">அங்கம்:</span>
              {result.anga.order.map((b: string) => (
                <button key={b} type="button" onClick={() => setBook(b)}
                  className={`px-2 py-0.5 rounded border ${b === book ? 'border-saffron bg-amber-50 text-ink font-semibold' : 'border-line text-ink-soft'}`}>{BOOK_TA[b]}</button>
              ))}
            </div>
            <p className="text-[11px] text-ink-soft mb-1">
              புலிப்பாணியின் நல்ல நட்சத்திரங்கள்: {p.starClass.good.join(', ') || '—'} · தீயவை: {p.starClass.bad.join(', ') || '—'} (மற்றவற்றில் பலன் இல்லை)
            </p>
            {planet !== 'Moon' && (
              <label className="flex items-center gap-2 text-xs text-ink-soft mb-2 cursor-pointer">
                <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />
                முழுக் காலமும் ({day(p.span.fromUtc)} – {day(p.span.toUtc)}); இல்லையெனில் இன்றிலிருந்து 2 ஆண்டுகள்
              </label>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 760 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">காலம்</th><th className="py-1 pr-2">நட்சத்திரம் · எண் · தாரை</th><th className="py-1 pr-2">புலிப்பாணி</th><th className="py-1">அங்கம் — {BOOK_TA[book]}</th>
                </tr></thead>
                <tbody className="align-top">
                  {(planet === 'Moon' ? p.stays : keep(p.stays)).map((s: any) => (
                    <tr key={s.fromUtc} className={`border-b border-line/40 ${s.current ? 'bg-amber-50' : ''}`}>
                      <td className="py-1 pr-2 font-mono whitespace-nowrap text-ink" style={num}>{planet === 'Moon' ? `${s.fromUtc.slice(0, 16).replace('T', ' ')} UTC` : `${day(s.fromUtc)} – ${day(s.toUtc)}`}</td>
                      <td className="py-1 pr-2 text-ink">{s.starTa} · {s.count} · {s.taraTa}</td>
                      <td className="py-1 pr-2"><span className={CLASS[s.starClass].cls}>{CLASS[s.starClass].ta}</span>
                        {s.combination.map((c: any) => <span key={c.id + c.house} className="block text-ink">{c.house}-ல்: {c.textTa}</span>)}
                      </td>
                      <td className="py-1 text-ink"><Anga p={p} stay={s} book={book} only /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">ஜன்ம நட்சத்திரம் வரும் கிழமை — அடுத்த 12 மாதங்கள் (புலிப்பாணி)</h2>
            <p className="text-[11px] text-ink-soft mb-2">{result.weekday.readingTa}</p>
            <ul className="text-xs space-y-0.5" style={num}>
              {result.weekday.list.map((w: any) => (
                <li key={w.dateLocal} className="text-ink"><span className="font-mono">{w.dateLocal}</span> · {w.weekdayTa} — {w.resultTa}</li>
              ))}
            </ul>
            <Cites list={[result.weekday.source]} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-2">நூல்கள், வேறுபாடுகள்</h2>
            <p className="font-semibold text-ink">தாரைகள்</p>
            <ul className="mb-1" style={num}>
              {result.taras.map((t: any) => <li key={t.n} className="text-ink">{t.n}, {t.n + 9}, {t.n + 18} — {t.pulippaniTa} ({t.pulippaniResultTa}){t.bhatTa !== t.pulippaniTa ? ` · பட்: ${t.bhatTa} (${t.bhatMeaningTa})` : ` · பட்: ${t.bhatMeaningTa}`}</li>)}
            </ul>
            <Cites list={result.taraSources} />
            <p className="font-semibold text-ink mt-3">புலிப்பாணியின் சேர்க்கை விதிகள்</p>
            <ul className="list-disc ml-5">{result.combination.rules.map((r: any) => (
              <li key={r.id} className="text-ink">{NATURE_TA[r.nature]} · {r.houses.join(', ')}-ஆம் இடம் · {CLASS[r.star].ta} → {r.textTa}</li>
            ))}</ul>
            <p className="text-ink-soft mt-1">{result.combination.readingTa}</p>
            <p className="text-ink-soft mt-1">{result.combination.alsoTa}</p>
            <Cites list={[result.starClassSource, result.combination.source]} />
            <p className="font-semibold text-ink mt-3">அங்க பலன் — நூல்கள் வேறுபடும் இடங்கள்</p>
            <ul className="list-disc ml-5 space-y-0.5">{result.anga.differences.map((d: any) => <li key={d.id} className="text-ink">{d.textTa}</li>)}</ul>
            <Cites list={result.anga.order.map((b: string) => result.anga.books[b].source)} />
          </section>
        </>
      )}
    </main>
  );
}
