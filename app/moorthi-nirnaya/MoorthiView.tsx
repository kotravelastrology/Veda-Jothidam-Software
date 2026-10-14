'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeMoorthi } from './actions';

/**
 * Moorthi Nirnaya: the form a planet takes when it enters a sign, from the
 * transit Moon's house counted from the natal Moon. All six books give the same
 * four groups; their grades differ, and Pulippani alone reverses them for
 * malefics. Pulippani explains most and is shown first.
 */

const FORM_CLS: Record<string, string> = {
  SWARNA: 'text-amber-700', RAJATA: 'text-slate-500', TAMRA: 'text-orange-700', LOHA: 'text-ink',
};
const CONV: Record<string, { ta: string; cls: string }> = {
  GOOD: { ta: 'நல்ல இடம்', cls: 'text-teal' },
  BAD: { ta: 'தீய இடம்', cls: 'text-rose' },
};
const NATURE_TA: Record<string, string> = { BENEFIC: 'சுபர்', MALEFIC: 'பாபர்' };
const num = { fontVariantNumeric: 'tabular-nums' as const };
const day = (iso: string) => iso.slice(0, 10);
const cite = (s: any) => `${s.title} — ${String(s.pageLocus).split(':')[0]}`;
const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);
const q = (x: number) => String(x);

export default function MoorthiView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planet, setPlanet] = useState('Jupiter');
  const [all, setAll] = useState(false);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeMoorthi(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  const off = result?.displayOffsetMinutes ?? 0;
  const zone = `UTC${off < 0 ? '−' : '+'}${Math.floor(Math.abs(off) / 60)}:${String(Math.abs(off) % 60).padStart(2, '0')}`;
  const local = (iso: string) => new Date(Date.parse(iso) + off * 60000).toISOString().slice(0, 16).replace('T', ' ');
  const formTa = (id: string) => result.moorthis.find((m: any) => m.id === id);
  const Form = ({ id }: { id: string }) => { const m = formTa(id); return <span className={`font-semibold ${FORM_CLS[id]}`}>{m.ta} ({m.metalTa})</span>; };
  const Pulippani = ({ list }: { list: any[] }) => (
    <>{list.map((x: any) => (
      <span key={x.nature} className="block">
        {list.length > 1 && <span className="text-ink-soft">{NATURE_TA[x.nature]} எனில்: </span>}
        {x.fractionTa} · <span style={num}>{q(x.total.TABLE)}</span> <span className="text-ink-soft">/ <span style={num}>{q(x.total.LIST)}</span></span>
      </span>
    ))}</>
  );
  const Close = ({ e }: { e: any }) => (e.close ? (
    <span className="block text-[11px] text-amber-800 bg-amber-50 rounded px-1.5 py-0.5 mt-1">
      நெருக்கம்: {e.neighbour.side === 'EARLIER' ? `சந்திரன் இந்த ராசிக்கு வந்து ${e.neighbour.hours} மணி நேரமே ஆகிறது` : `சந்திரன் ${e.neighbour.hours} மணி நேரத்தில் அடுத்த ராசிக்குச் செல்லும்`};
      {' '}அந்த நேரத்தில் கிரகம் {e.marginArcmin}′ மட்டுமே நகரும். ஒரு பஞ்சாங்கம் நுழைவை அதைவிட {e.neighbour.side === 'EARLIER' ? 'முன்னதாக' : 'பின்னதாக'} வைத்தால் சந்திரன் {e.neighbour.moonSignTa} ({e.neighbour.moonHouse}) → <Form id={e.neighbour.moorthi} />.
    </span>
  ) : null);
  const statements = (e: any) => result.combinations[e.conventional][e.moorthi].filter((s: any) => !s.benefic || e.nature !== 'MALEFIC');

  const at = result ? Date.parse(result.atUtc) : 0;
  const p = result?.planets[planet];
  const keep = (es: any[]) => (all ? es : es.filter((e) => e.current || (Date.parse(e.utc) > at - 30 * 86400000 && Date.parse(e.utc) < at + 2 * 365.25 * 86400000)));

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Moorthi Nirnaya</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">மூர்த்தி நிர்ணயம் — பொன், வெள்ளி, செம்பு, இரும்பு</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒரு கிரகம் புதிய ராசியில் நுழையும் நேரத்தில் கோசாரச் சந்திரன் ஜன்ம ராசியிலிருந்து எத்தனையாவது இடத்தில் இருக்கிறது என்பதைக் கொண்டு, அந்த ராசியில் அதன் பயணம் முழுவதற்குமான
          "மூர்த்தி". நுழைவு நேரம் வானியல் கணக்கு; பலன்கள் நூல்களின் கூற்று — இந்த மென்பொருளின் முன்கணிப்பு அல்ல.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && p && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · ஜன்ம ராசி {result.moonRasi.rasiTa}</h2>
            <p className="text-xs text-ink-soft">{result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · நேரங்கள் {zone} · இப்போது {day(result.atUtc)}</p>
            <p className="text-[11px] text-ink-soft mt-2">நூல்களின் வரிசை: அதிக விளக்கம் உள்ள நூல் முதலில் — {result.rank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">இப்போது — எட்டு கிரகங்களின் மூர்த்தி</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 860 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">ராசி · இடம்</th><th className="py-1 pr-2">நுழைந்தபோது சந்திரன்</th>
                  <th className="py-1 pr-2">மூர்த்தி</th><th className="py-1 pr-2">புலிப்பாணி</th><th className="py-1">மற்ற நூல்கள்</th>
                </tr></thead>
                <tbody className="align-top">
                  {Object.values(result.planets).map((x: any) => {
                    const e = x.now;
                    if (!e) return <tr key={x.planet}><td className="py-1.5 pr-2 font-semibold text-ink">{x.planetTa}</td><td colSpan={5} className="text-ink-soft">இப்போதைய ராசியின் நுழைவு கணக்குக் காலத்துக்கு முன்.</td></tr>;
                    return (
                      <tr key={x.planet} className="border-b border-line/40">
                        <td className="py-1.5 pr-2 font-semibold text-ink">{x.planetTa}</td>
                        <td className="py-1.5 pr-2 text-ink">{e.signTa} · {e.house} <span className={`block ${CONV[e.conventional].cls}`}>{CONV[e.conventional].ta}</span></td>
                        <td className="py-1.5 pr-2 text-ink"><span className="font-mono" style={num}>{local(e.utc)}</span><span className="block">{e.moon.signTa} {e.moon.degree}° · {e.moon.house}-ஆம் இடம்</span></td>
                        <td className="py-1.5 pr-2"><Form id={e.moorthi} /><Close e={e} /></td>
                        <td className="py-1.5 pr-2 text-ink">
                          {e.nature !== 'UNDETERMINED' && <span className="text-ink-soft">{NATURE_TA[e.nature]} · </span>}
                          <Pulippani list={e.pulippani} />
                          {statements(e).filter((s: any) => s.book === 'PULIPPANI').map((s: any, i: number) => <span key={i} className="block text-ink-soft">{e.nature === 'UNDETERMINED' ? 'சுபர் எனில்: ' : ''}{s.textTa}</span>)}
                        </td>
                        <td className="py-1.5 text-ink-soft">
                          {result.rank.order.filter((b: string) => b !== 'PULIPPANI').map((b: string) => {
                            const g = result.grades[b][e.moorthi];
                            const st = statements(e).filter((s: any) => s.book === b);
                            if (!g && st.length === 0) return null;
                            return <span key={b} className="block"><strong>{result.bookTa[b]}:</strong> {g ?? '—'}{st.map((s: any) => ` · ${s.textTa}`).join('')}</span>;
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-soft mt-2">
              புலிப்பாணியின் அளவு: வழக்கமான நல்ல இடம் 0.5, தீய இடம் 0 — அதனுடன் மூர்த்தியின் பங்கு; முதல் எண் {result.pulippani.quanta.seriesTa.TABLE}; இரண்டாவது {result.pulippani.quanta.seriesTa.LIST}.
              நல்ல / தீய இடம் புலிப்பாணியின் கோசார அட்டவணைப்படி (அத்.22).
            </p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">ஒவ்வொரு கிரகமும் — ராசி நுழைவுகள்</h2>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {Object.values(result.planets).map((x: any) => (
                <button key={x.planet} type="button" onClick={() => setPlanet(x.planet)}
                  className={`text-xs px-2 py-1 rounded border ${x.planet === planet ? 'border-saffron bg-amber-50 text-ink font-semibold' : 'border-line text-ink-soft'}`}>{x.planetTa}</button>
              ))}
            </div>
            <p className="text-[11px] text-ink-soft mb-1">புலிப்பாணியின் நல்ல இடங்கள் ({p.planetTa}): {p.good.join(', ')}</p>
            <label className="flex items-center gap-2 text-xs text-ink-soft mb-2 cursor-pointer">
              <input type="checkbox" checked={all} onChange={(ev) => setAll(ev.target.checked)} />
              முழுக் காலமும் ({day(p.span.fromUtc)} – {day(p.span.toUtc)}); இல்லையெனில் இப்போதைய ராசியும் அடுத்த 2 ஆண்டுகளும்
            </label>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 760 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">நுழைவு ({zone})</th><th className="py-1 pr-2">ராசி · இடம்</th><th className="py-1 pr-2">சந்திரன்</th><th className="py-1 pr-2">மூர்த்தி</th><th className="py-1">புலிப்பாணி</th>
                </tr></thead>
                <tbody className="align-top">
                  {keep(p.entries).map((e: any) => (
                    <tr key={e.utc} className={`border-b border-line/40 ${e.current ? 'bg-amber-50' : ''}`}>
                      <td className="py-1 pr-2 font-mono whitespace-nowrap text-ink" style={num}>{local(e.utc)}
                        <span className="block font-sans text-ink-soft">{day(e.utc)} – {day(e.toUtc)}</span></td>
                      <td className="py-1 pr-2 text-ink">{e.fromSignTa} → {e.signTa} · {e.house}
                        {e.backward && planet !== 'Rahu' && planet !== 'Ketu' && <span className="block text-ink-soft">வக்கிரத்தில் திரும்பிய நுழைவு</span>}
                        <span className={`block ${CONV[e.conventional].cls}`}>{CONV[e.conventional].ta}</span></td>
                      <td className="py-1 pr-2 text-ink">{e.moon.signTa} {e.moon.degree}° · {e.moon.house}</td>
                      <td className="py-1 pr-2"><Form id={e.moorthi} /><Close e={e} /></td>
                      <td className="py-1 text-ink"><Pulippani list={e.pulippani} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {p.now && (
              <>
                <h3 className="text-xs font-semibold text-ink mt-4 mb-1">
                  இப்போதைய நுழைவு ({p.planetTa} → {p.now.signTa}, {local(p.now.utc)}, சந்திரன் {p.now.moon.signTa}) — பன்னிரண்டு ஜன்ம ராசிகளுக்கும் (புலிப்பாணியின் அட்டவணை 17 போல)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" style={{ minWidth: 560 }}>
                    <thead><tr className="text-ink-soft border-b border-line text-left">
                      <th className="py-1 pr-2">ஜன்ம ராசி</th><th className="py-1 pr-2">இடம்</th><th className="py-1 pr-2">மூர்த்தி</th><th className="py-1">புலிப்பாணி: பங்கு · மொத்தம் (அட்டவணை / பட்டியல்)</th>
                    </tr></thead>
                    <tbody>
                      {p.nowAllRasis.map((r: any) => (
                        <tr key={r.rasi} className={`border-b border-line/40 ${r.rasi === result.moonRasi.rasiIndex ? 'bg-amber-50' : ''}`}>
                          <td className="py-1 pr-2 text-ink">{r.rasiTa}</td>
                          <td className={`py-1 pr-2 ${CONV[r.conventional].cls}`} style={num}>{r.house} · {CONV[r.conventional].ta}</td>
                          <td className="py-1 pr-2"><Form id={r.moorthi} /></td>
                          <td className="py-1 text-ink"><Pulippani list={r.pulippani} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-2">நூல்கள் — மூர்த்தியும் அதன் பலனும்</h2>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 820 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">சந்திரன் இருக்கும் இடம்</th><th className="py-1 pr-2">மூர்த்தி</th>
                  <th className="py-1 pr-2">புலிப்பாணி — சுபர்</th><th className="py-1 pr-2">புலிப்பாணி — பாபர்</th>
                  {result.rank.order.filter((b: string) => b !== 'PULIPPANI').map((b: string) => <th key={b} className="py-1 pr-2">{result.bookTa[b]}</th>)}
                </tr></thead>
                <tbody className="align-top">
                  {result.moorthis.map((m: any) => (
                    <tr key={m.id} className="border-b border-line/40">
                      <td className="py-1 pr-2 text-ink" style={num}>{m.houses.join(', ')}</td>
                      <td className="py-1 pr-2"><Form id={m.id} /></td>
                      <td className="py-1 pr-2 text-ink">{result.pulippani.fractionTa[result.pulippani.order.BENEFIC.indexOf(m.id)]}</td>
                      <td className="py-1 pr-2 text-ink">{result.pulippani.fractionTa[result.pulippani.order.MALEFIC.indexOf(m.id)]}</td>
                      {result.rank.order.filter((b: string) => b !== 'PULIPPANI').map((b: string) => <td key={b} className="py-1 pr-2 text-ink">{result.grades[b][m.id] ?? <span className="text-ink-soft">சொல்லவில்லை</span>}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-2 space-y-0.5 text-ink-soft">
              {result.rank.order.filter((b: string) => b !== 'PULIPPANI').map((b: string) => <li key={b}><strong className="text-ink">{result.bookTa[b]}:</strong> {result.grades[b].noteTa}</li>)}
            </ul>
            <Cites list={result.rank.order.map((b: string) => result.groupSources[b]).concat([result.groupSources.RAJ_KUMAR_DH, result.pulippani.maleficSource])} />

            <p className="font-semibold text-ink mt-4 mb-1">நல்ல / தீய இடத்துடன் சேரும்போது — நூல்கள் சொல்வது</p>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 640 }}>
                <tbody className="align-top">
                  {['GOOD', 'BAD'].flatMap((c) => result.moorthis.map((m: any) => (
                    <tr key={c + m.id} className="border-b border-line/40">
                      <td className={`py-1 pr-2 whitespace-nowrap ${CONV[c].cls}`}>{CONV[c].ta}</td>
                      <td className="py-1 pr-2 whitespace-nowrap"><Form id={m.id} /></td>
                      <td className="py-1 text-ink">
                        {result.combinations[c][m.id].length === 0 && <span className="text-ink-soft">எந்த நூலும் தனியாகச் சொல்லவில்லை</span>}
                        {result.combinations[c][m.id].map((s: any, i: number) => (
                          <span key={i} className="block"><strong>{result.bookTa[s.book]}{s.benefic ? ' (சுபர்)' : ''}:</strong> {s.textTa}{s.whereTa && <span className="text-ink-soft"> — குருவின் உதாரணங்களில் ஜன்ம ராசி, இடம்: {s.whereTa}</span>}</span>
                        ))}
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
            <Cites list={result.pulippani.quanta.sources} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-2">வேறுபாடுகள், அச்சுப் பிழைகள்</h2>
            <ul className="list-disc ml-5 space-y-1">{result.differences.map((d: any) => <li key={d.id} className="text-ink">{d.textTa}</li>)}</ul>
            <p className="font-semibold text-ink mt-3">இந்தப் பக்கத்தின் வாசிப்புகள்</p>
            <ul className="list-disc ml-5 space-y-1 text-ink-soft">{result.ourReadingsTa.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
            <Cites list={[result.conventionalSource]} />
          </section>
        </>
      )}
    </main>
  );
}
