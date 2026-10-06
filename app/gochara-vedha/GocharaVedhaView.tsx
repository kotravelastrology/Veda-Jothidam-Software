'use client';

import { useEffect, useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { listCharts, searchCharts } from '../library/actions';
import { computeVedha } from './actions';
import type { BirthFormInput } from '../report/actions';

/**
 * Gochara vedha for all nine planets.
 *
 * Five books print a vedha table; they agree on most cells and differ on a
 * few. Two print a complete table that reads without guessing, and those two
 * are computed — Pulippani by default, because his chapter explains most (the
 * owner's rule). The differences between all five are listed on the page with
 * their pages, and the dates are astronomy.
 */

interface LibraryRow {
  profileId: string; revision: number; name: string; birthDate: string; placeName: string | null;
}
type Party =
  | { kind: 'profile'; profileId: string; revision: number; label: string }
  | { kind: 'form'; input: BirthFormInput; label: string };

const KIND: Record<string, { ta: string; cls: string }> = {
  GOOD: { ta: 'நல்ல இடம்', cls: 'text-teal' },
  GOOD_UNPAIRED: { ta: 'நல்ல இடம் — வேதை இடம் இல்லை', cls: 'text-teal' },
  RELIEVABLE: { ta: 'தீய இடம் — விபரீத வேதை இடம் உண்டு', cls: 'text-amber-700' },
  NO_RELIEF: { ta: 'தீய இடம் — விபரீத வேதை இடம் இல்லை', cls: 'text-rose' },
  NOT_COVERED: { ta: 'இந்த நூலின் அட்டவணையில் இந்தக் கிரகம் இல்லை', cls: 'text-ink-soft' },
};
const STATUS_TA: Record<string, string> = { COUNTS: '', EXEMPT: ' (விலக்கு — கணக்கில் இல்லை)', NODE_PAIR: ' (எதிர்க் கணு — கணக்கில் இல்லை)' };
const BOOK_TA: Record<string, string> = {
  PULIPPANI: 'புலிப்பாணி', SANTHANAM: 'சந்தானம்', JATAKA_PARIJATA: 'ஜாதக பாரிஜாதம்', SUDAMANI: 'சூடாமணி', KALAPRAKASIKA: 'காலப்பிரகாசிகை', VISHNU_BHASKAR: 'விஷ்ணு பாஸ்கர்',
};
const houses = (hs: number[]) => hs.join(' / ');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const PLANET_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};

function toInput(bd: BirthData): BirthFormInput {
  return {
    name: bd.name, gender: bd.gender,
    year: parseInt(bd.dateOfBirth.split('-')[0]),
    month: parseInt(bd.dateOfBirth.split('-')[1]),
    day: parseInt(bd.dateOfBirth.split('-')[2]),
    hour: parseInt(bd.timeOfBirth.split(':')[0]),
    minute: parseInt(bd.timeOfBirth.split(':')[1]),
    placeName: bd.place, latitude: bd.latitude, longitude: bd.longitude,
    utcOffsetMinutes: bd.utcOffset, ianaTimeZone: 'Asia/Kolkata',
  };
}

const day = (iso: string) => iso.slice(0, 10);
const num = { fontVariantNumeric: 'tabular-nums' as const };
const cite = (s: any) => `${s.title} — ${String(s.pageLocus).split(':')[0]}`;
const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);

function verdict(now: any) {
  if (now.kind === 'GOOD') return now.active ? { ta: 'வேதை நடப்பில் — நல்ல பலன் தடைபடும்', cls: 'text-rose' } : { ta: 'நல்ல பலன் — தடை இல்லை', cls: 'text-teal' };
  if (now.kind === 'GOOD_UNPAIRED') return { ta: 'நல்ல பலன்', cls: 'text-teal' };
  if (now.kind === 'RELIEVABLE') return now.active ? { ta: 'விபரீத வேதை நடப்பில் — தீமை நீங்கும்', cls: 'text-teal' } : { ta: 'தீய பலன் — விடுவிக்கும் கிரகம் இப்போது இல்லை', cls: 'text-amber-700' };
  if (now.kind === 'NOT_COVERED') return { ta: '—', cls: 'text-ink-soft' };
  return { ta: 'தீய பலன்', cls: 'text-rose' };
}

function NowTable({ r, method }: { r: any; method: string }) {
  const m = r.methods[method];
  const others = Object.keys(r.methods).filter((k) => k !== method);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ minWidth: 720 }}>
        <thead><tr className="text-ink-soft border-b border-line text-left">
          <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">ராசி · இடம்</th><th className="py-1 pr-2">வகை</th>
          <th className="py-1 pr-2">இணை இடம் · அங்கே இப்போது</th><th className="py-1">இப்போது</th>
        </tr></thead>
        <tbody className="align-top">
          {Object.values(m.planets).map((p: any) => {
            const n = p.now;
            const v = verdict(n);
            const differing = others.map((k) => ({ k, o: r.methods[k].planets[p.planet].now }))
              .filter(({ o }) => o.kind !== n.kind || houses(o.pairedHouses) !== houses(n.pairedHouses) || o.active !== n.active);
            return (
              <tr key={p.planet} className="border-b border-line/40">
                <td className="py-1.5 pr-2 font-semibold text-ink">{p.planetTa}</td>
                <td className="py-1.5 pr-2 text-ink">{n.rasi} · {n.house}</td>
                <td className={`py-1.5 pr-2 ${KIND[n.kind].cls}`}>{KIND[n.kind].ta}</td>
                <td className="py-1.5 pr-2 text-ink">
                  {n.pairedHouses.length ? <>{houses(n.pairedHouses)}-ஆம் இடம் · {n.planetsInPaired.length ? n.planetsInPaired.map((x: any) => `${x.planetTa}${STATUS_TA[x.status]}`).join(', ') : 'யாரும் இல்லை'}</> : '—'}
                </td>
                <td className={`py-1.5 ${v.cls}`}>
                  {v.ta}
                  {differing.map(({ k, o }) => (
                    <span key={k} className="block text-amber-800">
                      {BOOK_TA[k]} படி: {o.kind === 'NOT_COVERED' ? KIND.NOT_COVERED.ta : verdict(o).ta}{o.pairedHouses.length && houses(o.pairedHouses) !== houses(n.pairedHouses) ? ` (இணை ${houses(o.pairedHouses)})` : ''}
                    </span>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Timeline({ p }: { p: any }) {
  if (p.notCovered) return <p className="text-xs text-ink-soft">{KIND.NOT_COVERED.ta}.</p>;
  return (
    <div className="overflow-x-auto">
      <p className="text-[11px] text-ink-soft mb-1">
        காலம் {day(p.span.fromUtc)} – {day(p.span.toUtc)} · நல்ல இடங்கள் {p.good.join(', ')}
        {Object.keys(p.relievedBy).length > 0 && <> · விபரீத வேதை: {Object.entries(p.relievedBy).map(([b, g]) => `${b}→${houses(g as number[])}`).join(', ')}</>}
      </p>
      <table className="w-full text-xs" style={{ minWidth: 720 }}>
        <thead><tr className="text-ink-soft border-b border-line text-left">
          <th className="py-1 pr-2">காலம்</th><th className="py-1 pr-2">ராசி · இடம்</th><th className="py-1 pr-2">வகை</th>
          <th className="py-1 pr-2">இணை இடத்தில் கிரகங்கள்</th><th className="py-1">மொத்தம் · சந்திரன்</th>
        </tr></thead>
        <tbody className="align-top">
          {p.stays.map((s: any) => (
            <tr key={s.fromUtc} className={`border-b border-line/40 ${s.current ? 'bg-amber-50' : ''}`}>
              <td className="py-1.5 pr-2 font-mono text-ink whitespace-nowrap" style={num}>
                {day(s.fromUtc)} – {day(s.toUtc)}{s.current && <span className="block font-sans text-amber-800">இப்போது</span>}
              </td>
              <td className="py-1.5 pr-2 text-ink">{s.rasi} · {s.house}</td>
              <td className={`py-1.5 pr-2 ${KIND[s.kind].cls}`}>{KIND[s.kind].ta}{s.pairedHouses.length > 0 && <span className="block text-ink-soft">இணை: {houses(s.pairedHouses)}{s.pairedHouses.includes(s.house) ? ' (அதே இடம் = உடன் செல்லும் கிரகம்)' : ''}</span>}</td>
              <td className="py-1.5 pr-2 text-ink">
                {s.pairedHouses.length ? (
                  <>
                    {s.byPlanet.length === 0 && <span className="text-ink-soft">இல்லை</span>}
                    {s.byPlanet.map((b: any) => (
                      <span key={b.planet} className="block"><strong>{b.planetTa}</strong>{' '}
                        <span className="font-mono" style={num}>{b.windows.map((w: any) => `${day(w.fromUtc)}–${day(w.toUtc)}`).join(', ')}</span>
                      </span>
                    ))}
                    {s.exempt.map((b: any) => <span key={b.planet} className="block text-ink-soft">{b.planetTa} — விலக்கு, கணக்கில் இல்லை</span>)}
                    {s.nodePair && <span className="block text-ink-soft">{s.nodePair.planetTa} — எதிர்க் கணு, கணக்கில் இல்லை</span>}
                  </>
                ) : <span className="text-ink-soft">—</span>}
              </td>
              <td className="py-1.5 font-mono text-ink" style={num}>
                {s.pairedHouses.length ? `${Math.round(s.coveredDays)} / ${Math.round(s.days)} நாள்` : `${Math.round(s.days)} நாள்`}
                {s.moon && <span className="block font-sans text-ink-soft">சந்திரன் {s.moon.count} முறை</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NakshatraSection({ n }: { n: any }) {
  const [all, setAll] = useState(false);
  const at = Date.parse(n.atUtc);
  const horizon = at + 5 * 365.25 * 86400000;
  const shown = (ws: any[]) => (all ? ws : ws.filter((w) => Date.parse(w.toUtc) > at && Date.parse(w.fromUtc) < horizon));
  const upcoming = n.rows.flatMap((r: any) => r.windows.filter((w: any) => Date.parse(w.fromUtc) > at && w.planet !== 'Moon').map((w: any) => ({ ...w, row: r })))
    .sort((a: any, b: any) => Date.parse(a.fromUtc) - Date.parse(b.fromUtc)).slice(0, 6);
  const active = n.rows.filter((r: any) => r.activeNow.length);
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="text-sm font-semibold text-ink mb-1">நட்சத்திர வேதை — பிறப்பு நட்சத்திரங்களிலிருந்து (16 நிலைகள்)</h2>
      <p className="text-[11px] text-ink-soft mb-2">
        ராசி வேதை சந்திர ராசியிலிருந்து வீடுகளை எண்ணுகிறது; நட்சத்திர வேதை ஒவ்வொரு கிரகமும் பிறப்பில் நின்ற நட்சத்திரத்திலிருந்து நட்சத்திரங்களை எண்ணுகிறது.
        வரிசை: {n.rank.measureTa} {n.notes.countingTa}
      </p>
      <div className="border border-saffron rounded-xl p-3 mb-3 text-xs">
        {active.length
          ? active.map((r: any) => (
            <p key={r.id} className="text-rose">இப்போது: {r.activeNow.map((p: string) => PLANET_TA[p]).join(', ')} → {r.targetTa} நட்சத்திரம் (பிறப்பு {r.natalTa} நின்ற {r.natalNakshatraTa}விலிருந்து {r.count}-வது)</p>
          ))
          : <p className="text-ink">இப்போது ({day(n.atUtc)}) எந்த நட்சத்திர வேதையும் நடப்பில் இல்லை.</p>}
        {upcoming.length > 0 && (
          <p className="text-ink-soft mt-1">அடுத்து (சந்திரன் தவிர): {upcoming.map((u: any) => `${day(u.fromUtc)} ${u.planetTa} → ${u.row.targetTa} (பிறப்பு ${u.row.natalTa} நட்சத்திரத்திலிருந்து ${u.row.count}-வது)`).join(' · ')}</p>
        )}
      </div>
      <label className="flex items-center gap-2 text-xs text-ink-soft mb-2 cursor-pointer">
        <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />
        முழுக் காலமும் காட்டு ({day(n.window.fromUtc)} – {day(n.window.toUtc)}); இல்லையெனில் இன்றிலிருந்து 5 ஆண்டுகள்
      </label>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 760 }}>
          <thead><tr className="text-ink-soft border-b border-line text-left">
            <th className="py-1 pr-2">பிறப்பு கிரகம் · நட்சத்திரம்</th><th className="py-1 pr-2">எண்ணி · வேதை நட்சத்திரம்</th>
            <th className="py-1 pr-2">வேதை செய்யும் கிரகம்</th><th className="py-1">காலங்கள்</th>
          </tr></thead>
          <tbody className="align-top">
            {n.rows.map((r: any) => {
              const ws = shown(r.windows);
              return (
                <tr key={r.id} className={`border-b border-line/40 ${r.activeNow.length ? 'bg-amber-50' : ''}`}>
                  <td className="py-1.5 pr-2 text-ink">{r.natalTa}{r.countedFrom && <span className="text-ink-soft"> (ராகு/கேது வரி)</span>} · {r.natalNakshatraTa}</td>
                  <td className="py-1.5 pr-2 text-ink">{r.count}-வது · {r.targetTa}</td>
                  <td className="py-1.5 pr-2 text-ink">{r.byTa.join(' / ')}</td>
                  <td className="py-1.5 font-mono text-ink" style={num}>
                    {ws.length === 0 && <span className="font-sans text-ink-soft">இந்தக் காலத்தில் இல்லை</span>}
                    {ws.map((w: any) => (
                      <span key={`${w.planet}${w.fromUtc}`} className={`block ${w.current ? 'text-rose' : ''}`}>
                        {r.by.length > 1 && <span className="font-sans">{w.planetTa} </span>}{day(w.fromUtc)} – {day(w.toUtc)}{w.current ? ' · இப்போது' : ''}
                      </span>
                    ))}
                    {r.spanOfMoon && <span className="block font-sans text-ink-soft">சந்திரன்: {day(r.spanOfMoon.fromUtc)} – {day(r.spanOfMoon.toUtc)} மட்டும்</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 space-y-2 text-xs">
        <p className="font-semibold text-ink">நூல்கள் சொல்வது (அதிக விளக்கம் உள்ளது முதலில்)</p>
        {n.readings.map((b: any) => (
          <div key={b.book} className="border border-line rounded-lg p-2">
            <p className="font-semibold text-ink">{b.bookTa}</p>
            <ul className="list-disc ml-5 space-y-0.5">{b.items.map((it: any) => <li key={it.id} className="text-ink">{it.textTa}</li>)}</ul>
            <Cites list={[...new Map(b.items.map((it: any) => [it.source.pageLocus, it.source])).values()]} />
          </div>
        ))}
        <ul className="text-[11px] text-ink-soft list-disc ml-5 space-y-0.5">
          <li className="text-amber-800">{n.notes.readingsDifferTa}</li>
          <li>{n.notes.nodesNatalTa}</li>
          <li>{n.notes.nodesByTa}</li>
          <li>{n.notes.moonTa}</li>
          <li>{n.notes.directionalTa}</li>
        </ul>
      </div>
    </section>
  );
}

export default function GocharaVedhaView() {
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [query, setQuery] = useState('');
  const [party, setParty] = useState<Party | null>(null);
  const [manual, setManual] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState('PULIPPANI');
  const [planet, setPlanet] = useState('Jupiter');

  useEffect(() => {
    (query.trim() ? searchCharts(query.trim(), 25) : listCharts(50))
      .then((r: any) => setRows(r)).catch(() => setRows([]));
  }, [query]);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeVedha(party.kind === 'profile'
      ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) { setResult(r); setMethod(r.defaultMethod); } })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  const m = result?.methods[method];

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Gochara Vedha</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">கோசார வேதை — ஒன்பது கிரகங்களும்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஜன்ம சந்திரனிலிருந்து ஒரு கிரகம் நல்ல இடத்தில் இருக்கும்போது வேறொரு கிரகம் அதன் இணை இடத்தில் இருந்தால் நல்ல பலன் தடைபடும் (வேதை);
          தீய இடத்தில் இருக்கும்போது இணை இடத்தில் கிரகம் இருந்தால் தீமை நீங்கும் (விபரீத வேதை). காலங்கள் வானியல் கணக்கு; இணை இடங்கள் நூல்களுடையவை —
          ஐந்து நூல்கள் ஒப்பிடப்படுகின்றன, அதிகம் விளக்கும் நூல் இயல்பு.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-semibold text-ink">யாருக்கு?</h2>
          {party && <button type="button" onClick={() => { setParty(null); setResult(null); }} className="text-xs text-ink-soft hover:text-rose">மாற்று</button>}
        </div>
        {party ? <p className="text-sm text-teal">✓ {party.label}</p> : manual ? (
          <>
            <BirthDataForm isLoading={loading}
              onSubmit={(bd) => setParty({ kind: 'form', input: toInput(bd), label: bd.name || 'படிவ விவரம்' })} />
            <button type="button" onClick={() => setManual(false)} className="text-xs text-ink-soft mt-2 underline">சேமித்த சுயவிவரங்களிலிருந்து தேர்ந்தெடு</button>
          </>
        ) : (
          <>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="சேமித்த சுயவிவரங்களில் தேடு (பெயர் / இடம்)"
              className="w-full mb-2 px-3 py-2 text-sm bg-surface-2 border border-line rounded-xl text-ink" />
            <ul className="max-h-44 overflow-y-auto divide-y divide-line/40 mb-2">
              {rows.length === 0 && <li className="text-xs text-ink-soft py-2">சேமித்த சுயவிவரம் இல்லை.</li>}
              {rows.map((r) => (
                <li key={r.profileId}>
                  <button type="button" className="w-full text-left py-1.5 text-sm text-ink hover:text-saffron"
                    onClick={() => setParty({ kind: 'profile', profileId: r.profileId, revision: r.revision, label: `${r.name} · ${r.birthDate}${r.placeName ? ` · ${r.placeName}` : ''}` })}>
                    {r.name}<span className="text-xs text-ink-soft block">{r.birthDate}{r.placeName ? ` · ${r.placeName}` : ''}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setManual(true)} className="text-xs text-ink-soft underline">அல்லது பிறப்பு விவரத்தை நேரடியாக உள்ளிடு</button>
          </>
        )}
      </section>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && m && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · ஜன்ம சந்திரன் {result.moonRasi}</h2>
            <p className="text-xs text-ink-soft">
              {result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · இப்போது {day(result.atUtc)}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {result.rank.computable.map((id: string) => (
                <button key={id} type="button" onClick={() => setMethod(id)}
                  className={`text-xs px-2 py-1 rounded border ${id === method ? 'border-saffron bg-amber-50 text-ink font-semibold' : 'border-line text-ink-soft'}`}>
                  {result.methods[id].labelTa}{id === result.defaultMethod ? ' (இயல்பு)' : ''}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink-soft mt-2">
              வரிசை: அதிக விளக்கம் உள்ள நூல் முதலில் — {result.rank.measureTa} {result.rank.computableTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.
            </p>
            <p className="text-[11px] text-ink-soft mt-1">{m.exemptNoteTa}</p>
            <Cites list={m.sources} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">இப்போது — ஒன்பது கிரகங்களும்</h2>
            <NowTable r={result} method={method} />
            <ul className="text-[11px] text-ink-soft mt-2 list-disc ml-5 space-y-0.5">
              <li>{result.notes.moonTa}</li>
              <li>{result.notes.nodePairTa}</li>
            </ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">ஒவ்வொரு கிரகமும் — காலங்கள்</h2>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Object.values(m.planets).map((p: any) => (
                <button key={p.planet} type="button" onClick={() => setPlanet(p.planet)}
                  className={`text-xs px-2 py-1 rounded border ${p.planet === planet ? 'border-saffron bg-amber-50 text-ink font-semibold' : 'border-line text-ink-soft'}`}>
                  {p.planetTa}
                </button>
              ))}
            </div>
            <Timeline p={m.planets[planet]} />
            {planet === 'Saturn' && <p className="text-xs text-ink-soft mt-2">சனியின் ஏழரை, அஷ்டமம், அதன் வேதை விவரம் முழுவதும்: <a className="underline" href="/saturn-transit">/saturn-transit</a>.</p>}
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">நூல்கள் வேறுபடும் இடங்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">இவை தவிர மற்ற எல்லா இணைகளிலும் ஐந்து நூல்களும் ஒத்துப்போகின்றன.</p>
            <div className="space-y-2 text-xs">
              {result.comparison.differences.map((d: any) => (
                <div key={d.id} className="border border-line rounded-lg p-2">
                  <p className="text-ink">{d.textTa}</p>
                  <p className="text-ink-soft mt-1">
                    {result.rank.order.filter((b: string) => d.byBook[b] !== undefined).map((b: string) => `${BOOK_TA[b]}: ${d.byBook[b]}`).join(' · ')}
                  </p>
                </div>
              ))}
            </div>
            <details className="mt-3 text-xs">
              <summary className="cursor-pointer text-ink">காலப்பிரகாசிகையின் அட்டவணை (ஜாதக பாரிஜாதம் மறுபதிப்பு) — அச்சில் உள்ளபடி</summary>
              <div className="overflow-x-auto mt-2">
                <table className="text-xs" style={num}>
                  <thead><tr className="text-ink-soft"><th className="pr-2 text-left">கிரகம்</th>{ROMAN.map((x) => <th key={x} className="px-1">{x}</th>)}</tr></thead>
                  <tbody>
                    {Object.entries(result.comparison.kalaprakasikaTable).map(([pl, row]: [string, any]) => (
                      <tr key={pl}>
                        <td className="pr-2 text-ink">{PLANET_TA[pl]}</td>
                        {row.map((v: number, i: number) => {
                          const k1982 = (result.comparison.kalaprakasika1982Cells[pl] ?? []).find((c: any) => c[0] === i + 1);
                          return <td key={i} className={`px-1 text-center ${k1982 ? 'text-amber-800' : 'text-ink'}`} title={k1982 ? `1982 அச்சில் ${k1982[1]}` : ''}>{v}{k1982 ? '*' : ''}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-ink-soft mt-1">
                நெடுவரிசை = கிரகம் இருக்கும் இடம், எண் = வேதை இடம் என்று படித்தால், நல்ல இடங்களின் எல்லா இணைகளும் புலிப்பாணியுடன் பொருந்துகின்றன (புதன் X தவிர). இந்த வாசிப்பு எங்களுடையது.
                மற்ற நெடுவரிசைகளுக்கு நூலில் விதி இல்லை — பயன்படுத்தவில்லை. * = 1982 அச்சில் வேறு எழுத்து (மறுதட்டச்சுப் பிழை போல்: a, S, 6, 8).
              </p>
              <Cites list={result.comparison.kalaprakasikaSources} />
            </details>
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer text-ink">சூடாமணி — செய்யுள் 341-342 (தொகுப்புகள்)</summary>
              <ul className="mt-1 space-y-0.5">
                {Object.keys(result.comparison.sudamaniSets.good).map((pl) => (
                  <li key={pl} className="text-ink">
                    {PLANET_TA[pl]}: நல்ல இடம் {result.comparison.sudamaniSets.good[pl].join(', ')} · வேதை {result.comparison.sudamaniSets.vedha[pl]?.join(', ') ?? 'பிரிக்க முடியவில்லை'}
                  </li>
                ))}
              </ul>
              <Cites list={result.comparison.sudamaniSources} />
            </details>
            <p className="text-xs font-semibold text-ink mt-3">"தந்தை-மகன்" விலக்கு — மூன்று நூல்கள்</p>
            <Cites list={result.comparison.fatherSonSources} />
            <p className="text-[11px] text-ink-soft mt-2">{result.notes.sudamaniTimingTa}</p>
          </section>

          {result.nakshatra && <NakshatraSection n={result.nakshatra} />}
        </>
      )}
    </main>
  );
}
