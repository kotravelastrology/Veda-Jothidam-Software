'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeLatta } from './actions';

/**
 * Latta: the star each transiting planet kicks, and when one kicks the natal
 * star (Phaladeepika XXVI.42-47) — or the lagna star, in Narasimha Rao's
 * reading. The counts are the same in every book but Kapoor's Rahu; the
 * effects differ and are shown book by book, the one that explains most first.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const day = (iso: string) => iso.slice(0, 10);
const cite = (s: any) => `${s.title} — ${String(s.pageLocus).split(' — ')[0]}`;
const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);
const DIR_TA: Record<number, string> = { 1: 'முன்னோக்கி', [-1]: 'பின்னோக்கி' };
const READING_NOTE: Record<string, string> = { Ketu: 'ராஜ் குமார், கௌர், புலிப்பாணி', 'Rahu-EIGHTH': 'கபூர்: 8-வது' };

export default function LattaView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeLatta(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  const off = result?.displayOffsetMinutes ?? 0;
  const zone = `UTC${off < 0 ? '−' : '+'}${Math.floor(Math.abs(off) / 60)}:${String(Math.abs(off) % 60).padStart(2, '0')}`;
  const local = (iso: string) => new Date(Date.parse(iso) + off * 60000).toISOString().slice(0, 16).replace('T', ' ');
  const at = result ? Date.parse(result.atUtc) : 0;
  const span = (w: any) => (w.planet === 'Moon' ? `${local(w.fromUtc)} – ${local(w.toUtc)}` : `${day(w.fromUtc)} – ${day(w.toUtc)}`);
  const windowsFor = (target: string, reading: string) => (result?.windows ?? []).filter((w: any) => w.target === target && w.reading === reading);
  const nextOf = (ws: any[]) => {
    const live = ws.filter((w) => Date.parse(w.toUtc) > at);
    return live.slice(0, ws[0]?.planet === 'Moon' ? 3 : 2);
  };
  const lastOf = (ws: any[]) => ws.filter((w) => Date.parse(w.toUtc) <= at).slice(-1)[0];
  const effectFor = (book: string, planet: string) => {
    const e = result.effects[book];
    return e.byPlanet[planet] ?? null;
  };
  const owns = (p: string) => {
    const r = result.rao?.[p];
    if (!r) return null;
    const parts = [];
    if (r.owns.length) parts.push(`${r.owns.join(', ')}-ஆம் வீட்டு அதிபதி`);
    if (r.occupies) parts.push(`${r.occupies}-ஆம் வீட்டில்`);
    return parts.join('; ');
  };

  const KickTable = ({ target }: { target: 'JANMA' | 'LAGNA' }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ minWidth: 820 }}>
        <thead><tr className="text-ink-soft border-b border-line text-left">
          <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">இந்த நட்சத்திரத்தில் இருக்கும்போது</th>
          <th className="py-1 pr-2">காலம் ({zone})</th>
          <th className="py-1">{target === 'JANMA' ? 'நூல்கள் சொல்லும் பலன்' : 'ராவ்: ஜாதகத்தில் இந்தக் கிரகம்'}</th>
        </tr></thead>
        <tbody className="align-top">
          {result.kickers[target].map((k: any) => {
            const ws = windowsFor(target, k.reading);
            const next = nextOf(ws);
            const last = lastOf(ws);
            return (
              <tr key={k.reading} className={`border-b border-line/40 ${next.some((w: any) => w.current) ? 'bg-rose-soft' : ''}`}>
                <td className="py-1.5 pr-2 font-semibold text-ink">{k.planetTa}{READING_NOTE[k.reading] && <span className="block font-normal text-ink-soft">{READING_NOTE[k.reading]}</span>}</td>
                <td className="py-1.5 pr-2 text-ink">{k.starTa}</td>
                <td className="py-1.5 pr-2 font-mono text-ink whitespace-nowrap" style={num}>
                  {next.map((w: any) => <span key={w.fromUtc} className={`block ${w.current ? 'text-rose font-semibold' : ''}`}>{span(w)}{w.current ? ' ← இப்போது' : ''}</span>)}
                  {next.length === 0 && <span className="block font-sans text-ink-soft">கணக்குக் காலத்துக்குள் இல்லை (வரை {day(result.spans[k.planet].toUtc)})</span>}
                  {last && <span className="block font-sans text-ink-soft">கடைசியாக: {span(last)}</span>}
                </td>
                <td className="py-1.5 text-ink">
                  {target === 'JANMA' ? result.rank.order.map((b: string) => {
                    const e = effectFor(b, k.planet);
                    if (b === 'RAO') return owns(k.planet) ? <span key={b} className="block"><strong>{result.bookTa[b]}:</strong> {owns(k.planet)} — அந்த விஷயங்களில் சாதகமற்ற பலன்</span> : null;
                    return e ? <span key={b} className="block"><strong>{result.bookTa[b]}:</strong> {e}</span> : null;
                  }) : <span>{owns(k.planet) ?? '—'}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Latta</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">லத்தை — கிரகங்களின் "உதை"</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          கோசாரத்தில் ஒவ்வொரு கிரகமும் தான் இருக்கும் நட்சத்திரத்திலிருந்து குறிப்பிட்ட எண்ணிக்கையில் உள்ள நட்சத்திரத்தை "உதைக்கிறது". அது ஜன்ம நட்சத்திரமானால் தீய பலன் என்கின்றன நூல்கள் (பலதீபிகை 26.42-47).
          காலங்கள் வானியல் கணக்கு; பலன்கள் நூல்களின் கூற்று — இந்த மென்பொருளின் முன்கணிப்பு அல்ல.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · ஜன்ம நட்சத்திரம் {result.janma.starTa}{result.lagna && ` · லக்ன நட்சத்திரம் ${result.lagna.starTa}`}</h2>
            <p className="text-xs text-ink-soft">{result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · நேரங்கள் {zone} · இப்போது {day(result.atUtc)}</p>
            <p className="text-[11px] text-ink-soft mt-2">நூல்களின் வரிசை: அதிக விளக்கம் உள்ள நூல் முதலில் — {result.rank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">இன்று — ஒவ்வொரு கிரகமும் உதைக்கும் நட்சத்திரம்</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 560 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">இருக்கும் நட்சத்திரம்</th><th className="py-1 pr-2">எண்ணிக்கை</th><th className="py-1 pr-2">உதைக்கும் நட்சத்திரம்</th><th className="py-1"></th>
                </tr></thead>
                <tbody>
                  {result.today.map((x: any) => (
                    <tr key={x.reading} className={`border-b border-line/40 ${x.onJanma || x.onLagna ? 'bg-rose-soft' : ''} ${x.primary ? '' : 'text-ink-soft'}`}>
                      <td className="py-1 pr-2 font-semibold">{x.planetTa}{READING_NOTE[x.reading] && <span className="font-normal text-ink-soft"> ({READING_NOTE[x.reading]})</span>}</td>
                      <td className="py-1 pr-2">{x.starTa}</td>
                      <td className="py-1 pr-2" style={num}>{x.count}-வது, {DIR_TA[x.dir]}</td>
                      <td className="py-1 pr-2">{x.kickedTa}</td>
                      <td className="py-1 text-rose font-semibold">{x.onJanma ? 'ஜன்ம நட்சத்திரம்' : ''}{x.onJanma && x.onLagna ? ' · ' : ''}{x.onLagna ? 'லக்ன நட்சத்திரம் (ராவ்)' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">ஜன்ம நட்சத்திரம் ({result.janma.starTa}) உதைபடும் காலங்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">
              ஒவ்வொரு கிரகமும் அட்டவணையில் உள்ள நட்சத்திரத்தில் இருக்கும் முழுக் காலமும். பொதுப் பலன் — {result.rank.order.filter((b: string) => b !== 'RAO').map((b: string) => `${result.bookTa[b]}: ${result.effects[b].generalTa}`).join(' · ')}
            </p>
            <KickTable target="JANMA" />
            <p className="text-[11px] text-ink-soft mt-2"><strong>{result.bookTa.RAO}:</strong> {result.effects.RAO.generalTa}</p>
          </section>

          {result.lagna && (
            <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="text-sm font-semibold text-ink mb-1">லக்ன நட்சத்திரம் ({result.lagna.starTa}) — நரசிம்ம ராவின் வாசிப்பு மட்டும்</h2>
              <p className="text-[11px] text-ink-soft mb-2">ராவ்: லக்ன நட்சத்திரத்தின் மீது விழும் லத்தையும் பார்க்க வேண்டும்; ஜன்ம நட்சத்திர லத்தையே அதிக முக்கியம். பலன் உதைக்கும் கிரகத்தின் ஜாதக வீடுகளைக் கொண்டு. பிறந்த நேரம் சரியாக இருந்தால் மட்டுமே பொருள்.</p>
              <KickTable target="LAGNA" />
            </section>
          )}

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">இரண்டுக்கு மேற்பட்ட லத்தைகள் சேரும் காலங்கள் (ஜன்ம நட்சத்திரம்)</h2>
            <ul className="text-[11px] text-ink-soft mb-2">
              {result.rank.order.filter((b: string) => result.effects[b].multipleTa).map((b: string) => <li key={b}><strong>{result.bookTa[b]}:</strong> {result.effects[b].multipleTa}</li>)}
            </ul>
            {result.together.length === 0 ? <p className="text-xs text-ink-soft">கணக்குக் காலத்துக்குள் இல்லை.</p> : (
              <ul className="text-xs space-y-0.5" style={num}>
                {result.together.map((c: any) => (
                  <li key={c.fromUtc} className={c.current ? 'text-rose font-semibold' : 'text-ink'}>
                    <span className="font-mono">{local(c.fromUtc)} – {local(c.toUtc)}</span> · {c.readings.map((r: string) => result.today.find((x: any) => x.reading === r)?.planetTa ?? r).join(' + ')}{c.current ? ' ← இப்போது' : ''}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-ink-soft mt-1">ராகுவின் 9-வது எண்ணிக்கையும், மூன்று நூல்களின் கேதுவும் சேர்த்து; சந்திரனின் லத்தை அடுத்த 12 மாதங்களுக்கு மட்டும் கணிக்கப்படுவதால் அதனுடனான சேர்க்கைகளும் அதுவரை மட்டுமே.</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-2">நூல்கள் — எண்ணிக்கையும் பலனும்</h2>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 900 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">எண்ணிக்கை</th>
                  {result.rank.order.filter((b: string) => b !== 'RAO').map((b: string) => <th key={b} className="py-1 pr-2">{result.bookTa[b]}</th>)}
                </tr></thead>
                <tbody className="align-top">
                  {Object.entries(result.kicks).map(([p, k]: [string, any]) => (
                    <tr key={p} className="border-b border-line/40">
                      <td className="py-1 pr-2 font-semibold text-ink">{result.today.find((x: any) => x.planet === p)?.planetTa}</td>
                      <td className="py-1 pr-2 text-ink whitespace-nowrap" style={num}>{p === 'Rahu' ? '9 (கபூர் 8)' : k.count}, {DIR_TA[k.dir]}{p === 'Ketu' ? ' *' : ''}</td>
                      {result.rank.order.filter((b: string) => b !== 'RAO').map((b: string) => <td key={b} className="py-1 pr-2 text-ink">{result.effects[b].byPlanet[p] ?? <span className="text-ink-soft">—</span>}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-ink-soft mt-1">* {result.ketu.ta}</p>
            <p className="text-ink-soft mt-1">"—" = அந்த நூல் அந்தக் கிரகத்துக்குத் தனிப் பலன் சொல்லவில்லை; அதன் பொதுப் பலன் மட்டும். நரசிம்ம ராவ் கிரகத்துக்கு நிலையான பலன் தருவதில்லை (மேலே).</p>
            <Cites list={[...result.rank.order.map((b: string) => result.countSources[b]), ...result.rank.order.flatMap((b: string) => result.effects[b].sources)]} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-2">வேறுபாடுகள்</h2>
            <ul className="list-disc ml-5 space-y-1">{result.differences.map((d: any) => <li key={d.id} className="text-ink">{d.textTa}</li>)}</ul>
            <p className="font-semibold text-ink mt-3">இந்தப் பக்கத்தின் வாசிப்புகள்</p>
            <ul className="list-disc ml-5 space-y-1 text-ink-soft">{result.ourReadingsTa.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
          </section>
        </>
      )}
    </main>
  );
}
