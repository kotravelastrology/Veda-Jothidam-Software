'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computePada88 } from './actions';

/**
 * The 88th nakshatra pada: 87 quarters on from the natal Moon's. Raj Kumar and
 * Vishnu Bhaskar read every planet's transit of it; Kalaprakasika and
 * Shubhakaran treat the time the Moon is there as one to avoid. The book that
 * explains most (Raj Kumar) comes first.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const day = (iso: string) => iso.slice(0, 10);
const cite = (s: any) => `${s.title} — ${String(s.pageLocus).split(' — ')[0]}`;
const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);
const JUP_TA: Record<string, string> = { ALL: 'குருவின் பார்வை உண்டு', PART: 'குருவின் பார்வை ஒரு பகுதி காலம்', NONE: 'குருவின் பார்வை இல்லை' };
const dms = (deg: number) => { const d = Math.floor(deg % 30); const m = Math.round(((deg % 30) - d) * 60); return m === 60 ? `${d + 1}°00′` : `${d}°${String(m).padStart(2, '0')}′`; };

export default function Pada88View() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computePada88(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  const off = result?.displayOffsetMinutes ?? 0;
  const zone = `UTC${off < 0 ? '−' : '+'}${Math.floor(Math.abs(off) / 60)}:${String(Math.abs(off) % 60).padStart(2, '0')}`;
  const local = (iso: string) => new Date(Date.parse(iso) + off * 60000).toISOString().slice(0, 16).replace('T', ' ');
  const at = result ? Date.parse(result.atUtc) : 0;
  const span = (w: any) => (w.days < 4 ? `${local(w.fromUtc)} – ${local(w.toUtc)}` : `${day(w.fromUtc)} – ${day(w.toUtc)}`);
  const of = (p: string) => (result?.windows ?? []).filter((w: any) => w.planet === p);
  const next = (ws: any[], n: number) => ws.filter((w) => Date.parse(w.toUtc) > at).slice(0, n);
  const last = (ws: any[]) => ws.filter((w) => Date.parse(w.toUtc) <= at).slice(-1)[0];
  const s = result?.statements;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">88th Nakshatra Pada</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">88-வது நட்சத்திர பாதம்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          பிறப்பில் சந்திரன் இருந்த பாதத்திலிருந்து (அதுவே 1) 88-வது பாதம் — ஒரு கிரகம் அதைக் கடக்கும் காலம், சந்திரன் அதில் இருக்கும் நேரம்.
          காலங்கள் வானியல் கணக்கு; பலன்கள் நூல்களின் கூற்று — இந்த மென்பொருளின் முன்கணிப்பு அல்ல.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · பிறப்பு: {result.natal.starTa} {result.natal.pada}-ஆம் பாதம்</h2>
            <p className="text-xs text-ink-soft">{result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · நேரங்கள் {zone} · இப்போது {day(result.atUtc)}</p>
            <p className="text-base text-ink mt-2">
              88-வது பாதம்: <strong>{result.target.starTa} {result.target.pada}-ஆம் பாதம்</strong>
              <span className="text-ink-soft"> — {result.target.signTa} {dms(result.target.fromDeg)} – {dms(result.target.toDeg)}</span>
            </p>
            <p className="text-[11px] text-ink-soft mt-2">நூல்களின் வரிசை: அதிக விளக்கம் உள்ள நூல் முதலில் — {result.rank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">கிரகங்கள் 88-வது பாதத்தைக் கடக்கும் காலம் (கோசாரம்)</h2>
            <p className="text-[11px] text-ink-soft mb-1"><strong>{result.bookTa.RAJ_KUMAR}:</strong> {s.RAJ_KUMAR.textTa}</p>
            <p className="text-[11px] text-ink-soft mb-2"><strong>{result.bookTa.VISHNU_BHASKAR}:</strong> {s.VISHNU_BHASKAR.textTa}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 760 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">இன்று</th><th className="py-1 pr-2">காலம் ({zone})</th><th className="py-1">ராஜ் குமார் (அட்டவணை 21)</th>
                </tr></thead>
                <tbody className="align-top">
                  {result.today.map((x: any) => {
                    const ws = of(x.planet);
                    const nx = next(ws, x.planet === 'Moon' ? 3 : 2);
                    const ls = last(ws);
                    return (
                      <tr key={x.planet} className={`border-b border-line/40 ${x.inPada ? 'bg-rose-soft' : ''}`}>
                        <td className="py-1.5 pr-2 font-semibold text-ink">{x.planetTa}</td>
                        <td className="py-1.5 pr-2 text-ink">{x.starTa} {x.pada}{x.inPada && <span className="block text-rose font-semibold">88-வது பாதத்தில்</span>}</td>
                        <td className="py-1.5 pr-2 text-ink whitespace-nowrap" style={num}>
                          {nx.map((w: any) => (
                            <span key={w.fromUtc} className={`block ${w.current ? 'text-rose font-semibold' : ''}`}>
                              <span className="font-mono">{span(w)}</span>{w.current ? ' ← இப்போது' : ''}
                              {w.jupiterAspect && <span className="block font-sans text-[11px] text-ink-soft">{JUP_TA[w.jupiterAspect]}</span>}
                            </span>
                          ))}
                          {nx.length === 0 && <span className="block text-ink-soft">கணக்குக் காலத்துக்குள் இல்லை (வரை {day(result.spans[x.planet].toUtc)})</span>}
                          {ls && <span className="block text-ink-soft">கடைசியாக: {span(ls)}</span>}
                        </td>
                        <td className="py-1.5 text-ink">{result.rajKumarEffects[x.planet]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Cites list={[...s.RAJ_KUMAR.sources, ...s.VISHNU_BHASKAR.sources]} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">ஒரே நேரத்தில் பல கிரகங்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">ராஜ் குமார்: தீமையின் அளவு அந்தப் பாதத்தில் உள்ள கிரகங்களின் எண்ணிக்கையையும் பொறுத்தது.</p>
            {result.together.length === 0 ? <p className="text-xs text-ink-soft">கணக்குக் காலத்துக்குள் இல்லை.</p> : (
              <ul className="text-xs space-y-0.5" style={num}>
                {result.together.map((c: any) => (
                  <li key={c.fromUtc} className={c.current ? 'text-rose font-semibold' : 'text-ink'}>
                    <span className="font-mono">{local(c.fromUtc)} – {local(c.toUtc)}</span> · {c.planets.map((p: string) => result.today.find((x: any) => x.planet === p)?.planetTa ?? p).join(' + ')}{c.current ? ' ← இப்போது' : ''}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-ink-soft mt-1">சந்திரன் அடுத்த 12 மாதங்களுக்கு மட்டும் கணிக்கப்படுவதால் அதனுடனான சேர்க்கைகளும் அதுவரை மட்டுமே.</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">நேரத்தின் தரம் — சந்திரன் 88-வது பாதத்தில் (அடுத்த 12 மாதங்கள்)</h2>
            <ul className="text-[11px] text-ink-soft mb-2 space-y-0.5">
              {s.KALAPRAKASIKA.items.map((i: any) => <li key={i.id}><strong>{result.bookTa.KALAPRAKASIKA}:</strong> {i.textTa}</li>)}
              <li><strong>{result.bookTa.SHUBHAKARAN}:</strong> {s.SHUBHAKARAN.textTa}</li>
            </ul>
            <ul className="text-xs space-y-0.5" style={num}>
              {of('Moon').filter((w: any) => Date.parse(w.toUtc) > at).map((w: any) => (
                <li key={w.fromUtc} className={w.current ? 'text-rose font-semibold' : 'text-ink'}><span className="font-mono">{local(w.fromUtc)} – {local(w.toUtc)}</span>{w.current ? ' ← இப்போது' : ''}</li>
              ))}
            </ul>
            <Cites list={[...s.KALAPRAKASIKA.items.map((i: any) => i.source), ...s.SHUBHAKARAN.sources]} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-2">வேறுபாடுகள், வாசிப்புகள்</h2>
            <ul className="list-disc ml-5 space-y-1">{result.differences.map((d: any) => <li key={d.id} className="text-ink">{d.textTa}</li>)}</ul>
            <p className="font-semibold text-ink mt-3">இந்தப் பக்கத்தின் வாசிப்புகள்</p>
            <ul className="list-disc ml-5 space-y-1 text-ink-soft">{result.ourReadingsTa.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
            <Cites list={[result.countSources.RAJ_KUMAR, result.countSources.VISHNU_BHASKAR]} />
          </section>
        </>
      )}
    </main>
  );
}
