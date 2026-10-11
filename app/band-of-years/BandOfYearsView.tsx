'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeBandOfYears } from './actions';

/**
 * The band of years: Lal Kitab's 35-year cycle of planets, each ruling a band
 * of a person's years. Raj Kumar (the most explained) puts Saturn first at
 * birth and progresses the ruler round the zodiac during its band; Gosvami and
 * Mahajan give Jupiter first as their example and split each band in three.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const day = (iso: string) => iso.slice(0, 10);
const cite = (s: any) => `${s.title} — ${String(s.pageLocus).split(': ')[0]}`;
const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);
const KIND_TA: Record<string, string> = { SIGN: 'அதன் ராசியில்', STAR: 'அதன் நட்சத்திரத்தில்', ASPECT: 'அதன் ராசியைப் பார்வை' };
const dms = (deg: number) => { const d = Math.floor(deg % 30); const m = Math.floor(((deg % 30) - d) * 60); return `${d}°${String(m).padStart(2, '0')}′`; };

function Switch({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="flex flex-wrap items-center gap-1 mb-1 text-xs">
      <span className="text-ink-soft mr-1">{label}:</span>
      {options.map(([id, text]) => (
        <button key={id} type="button" onClick={() => onChange(id)}
          className={`px-2 py-0.5 rounded-full border ${value === id ? 'bg-ink text-surface border-ink' : 'border-line text-ink hover:bg-line/40'}`}>{text}</button>
      ))}
    </div>
  );
}

export default function BandOfYearsView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState('SATURN_FIRST');

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeBandOfYears(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  const B = result?.books;
  const P = (p: string) => B?.planetTa[p] ?? p;
  const R = (s: number) => B?.rasiTa[s] ?? s;
  const O = result?.orders[order];
  const now = O?.now;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Band of Years</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஆண்டுப் பட்டை — 35 ஆண்டுச் சுற்று</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          லால் கிதாப்: ஒவ்வொரு கிரகமும் வாழ்க்கையின் சில ஆண்டுகளை ஆள்கிறது; ஒன்பது கிரகங்களும் சேர்ந்து 35 ஆண்டு, வாழ்நாளில் மூன்று சுற்று.
          காலங்கள் கணக்கு; பலன்கள் நூல்களின் கூற்று — இந்த மென்பொருளின் முன்கணிப்பு அல்ல.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · இப்போது {result.yearOfLife}-ஆம் ஆண்டு ({result.cycle}-ஆம் சுற்று)</h2>
            <p className="text-xs text-ink-soft">{result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · இன்று {day(result.atUtc)}</p>
            <div className="mt-2">
              <Switch label="வரிசை" value={order} onChange={setOrder}
                options={B.orders.order.map((id: string) => [id, `${B.orders[id].labelTa}${id === B.orders.default ? ' (இயல்பு)' : ''}`])} />
            </div>
            {now && (
              <div className="mt-2 text-ink">
                <p className="text-base">
                  ஆளும் கிரகம்: <strong>{P(now.band.planet)}</strong> — {now.band.fromYear}–{now.band.toYear}-ஆம் ஆண்டு
                  <span className="text-ink-soft text-sm" style={num}> ({day(now.band.fromUtc)} – {day(now.band.toUtc)})</span>
                </p>
                <p className="text-xs mt-1">
                  லால் கிதாப் மூன்று பகுதிகள் (கோஸ்வாமி, மகாஜன்): {now.thirds.map((t: any) => (
                    <span key={t.part} className={t.current ? 'font-semibold text-teal' : ''}>{B.partTa[t.part]} {P(t.planet)} ({day(t.fromUtc)} – {day(t.toUtc)}){t.current ? ' ← இப்போது' : ''}{t.part < 2 ? ' · ' : ''}</span>
                  ))}
                </p>
                <p className="text-xs mt-1">
                  பிறப்பில் {P(now.band.planet)}: {R(now.natal.sign)} ({B.starTa[now.natal.star]}){now.natal.house !== null && <> · லக்னத்துக்கு {now.natal.house}-ஆம் வீடு</>}
                  {now.natal.owns.length > 0 && <> · ஆளும் வீடுகள் {now.natal.owns.join(', ')}</>}
                </p>
              </div>
            )}
          </section>

          {now && (
            <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="text-sm font-semibold text-ink mb-1">{P(now.band.planet)} — முன்னேற்றம் (ராஜ் குமார், பத்தி 10.1)</h2>
              <p className="text-[11px] text-ink-soft mb-2">
                தன் காலத்தில் பிறப்பு நிலையிலிருந்து ராசிச் சக்கரத்தை ஒரு சுற்று; ஒவ்வொரு ராசியிலும் காலத்தின் 1/12; பிறந்த ராசியில் இரண்டு பகுதியாக.
                இப்போது முன்னேறிய நிலை: <strong>{R(Math.floor(now.progression.longitude / 30))} {dms(now.progression.longitude)}</strong>.
              </p>
              <table className="text-xs" style={num}>
                <thead><tr className="text-ink-soft text-left"><th className="pr-3">ராசி</th><th className="pr-3">காலம்</th><th>அங்கே பிறப்புக் கிரகங்கள்</th></tr></thead>
                <tbody>{now.progression.stages.map((s: any, i: number) => (
                  <tr key={i} className={`border-t border-line/40 ${s.current ? 'bg-amber-50 font-semibold' : ''}`}>
                    <td className="pr-3">{R(s.sign)}</td>
                    <td className="pr-3 font-mono">{day(s.fromUtc)} – {day(s.toUtc)}{s.current ? ' ← இப்போது' : ''}</td>
                    <td>{s.natalHere.map(P).join(', ') || '—'}</td>
                  </tr>
                ))}</tbody>
              </table>
              <p className="text-xs font-semibold text-ink mt-3 mb-1">பிறப்புக் கிரகங்களுடன் தொடர்பு</p>
              <ul className="text-xs space-y-0.5" style={num}>
                {now.progression.contacts.map((c: any, i: number) => (
                  <li key={i} className={c.current ? 'text-teal font-semibold' : 'text-ink'}>
                    <span className="font-mono">{day(c.fromUtc)} – {day(c.toUtc)}</span> · {P(c.planet)} — {KIND_TA[c.kind]}{c.current ? ' ← இப்போது' : ''}
                  </li>
                ))}
              </ul>
              <Cites list={[B.sources.RAJ_KUMAR[1]]} />
            </section>
          )}

          {now && (
            <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="text-sm font-semibold text-ink mb-1">{P(now.band.planet)} — இன்றைய கோசாரம் (ராஜ் குமார் §6.5)</h2>
              <p className="text-xs text-ink">
                {R(now.transit.sign)} {dms(now.transit.longitude)} ({B.starTa[now.transit.star]})
                {now.transit.houseFromLagna !== null && <> · பிறந்த லக்னத்துக்கு {now.transit.houseFromLagna}</>} · ஜன்ம ராசிக்கு {now.transit.houseFromMoon}
              </p>
              <ul className="text-xs mt-1 space-y-0.5">
                <li>பிறப்புக் கிரகங்களுடன் அதே ராசியில்: {now.transit.withNatal.map(P).join(', ') || '—'}</li>
                <li>பார்க்கும் பிறப்புக் கிரகங்கள்: {now.transit.aspectsNatal.map(P).join(', ') || '—'}</li>
                <li>கோசாரத்தில் உடன் இருப்பவை: {now.transit.withTransit.map(P).join(', ') || '—'}</li>
              </ul>
              <p className="text-[11px] text-ink-soft mt-1">ஆளும் கிரகம் பிறப்பிலும் கோசாரத்திலும் நிகழ்வின் காரகராக இருந்தால், தொடர்புடைய வீட்டைக் கடக்கும்போது நிகழ்வு — காரகம் எது என்பது நிகழ்வைப் பொறுத்தது; இங்கே தீர்ப்பு இல்லை.</p>
              <Cites list={[B.sources.RAJ_KUMAR[2]]} />
            </section>
          )}

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">எல்லாப் பட்டைகளும் — {B.orders[order].labelTa}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ ...num, minWidth: 620 }}>
                <thead><tr className="text-ink-soft text-left border-b border-line"><th className="pr-2">சுற்று</th><th className="pr-2">கிரகம்</th><th className="pr-2">ஆண்டுகள்</th><th className="pr-2">காலம்</th><th>மூன்று பகுதிகள் (லால் கிதாப்)</th></tr></thead>
                <tbody>{O.bands.map((b: any, i: number) => {
                  const cur = now && b.fromUtc === now.band.fromUtc;
                  return (
                    <tr key={i} className={`border-b border-line/40 ${cur ? 'bg-amber-50 font-semibold' : ''}`}>
                      <td className="pr-2">{b.cycle}</td>
                      <td className="pr-2">{P(b.planet)}</td>
                      <td className="pr-2">{b.fromYear}{b.toYear !== b.fromYear ? `–${b.toYear}` : ''}</td>
                      <td className="pr-2 font-mono">{day(b.fromUtc)} – {day(b.toUtc)}</td>
                      <td>{B.intervening[b.planet].map(P).join(' → ')}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-1">நூல்கள்</h2>
            <p className="text-[11px] text-ink-soft">வரிசை: {B.rank.measureTa}</p>
            <ul className="space-y-1 mt-2">{B.orders.order.map((id: string) => (
              <li key={id}><strong>{B.orders[id].labelTa}{id === B.orders.default ? ' (இயல்பு)' : ''}:</strong> {B.orders[id].textTa} <span className="text-ink-soft">({B.orders[id].booksTa})</span></li>
            ))}</ul>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-ink-soft">{B.notesTa.map((n: string) => <li key={n}>{n}</li>)}</ul>
            <Cites list={B.rank.order.flatMap((b: string) => B.sources[b])} />
          </section>
        </>
      )}
    </main>
  );
}
