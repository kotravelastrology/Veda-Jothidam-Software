'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeRogaArambha, computeRogaArambhaTable } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * The onset of an illness: eight books' statements for all 27 stars side by side, and, for the moment an
 * illness began, what each says — the length for the Moon's star, the star lists, and the combinations of
 * weekday, tithi, karana and the patient's birth star. The book that explains most (Wilhelm) comes first;
 * every book stays in the table, and one can be shown alone.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const cite = (s: any) => citeTa(s);
const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);
const KIND_STYLE: Record<string, string> = {
  DEATH: 'text-rose font-semibold', HARD: 'text-rose', DANGER: 'text-rose', LONG: 'text-ink-soft', DEVELOP: 'text-ink', CURE: 'text-ink', QUICK: 'text-ink',
};
const SEVERITY_TA: Record<string, string> = {
  DEATH: 'மரணம்', DISASTER: 'பேரிழப்பு', HARM: 'பெருந்தீங்கு', TROUBLE: 'தொல்லை', DISTRESS: 'துன்பம்', REMOTE: 'குணம் தொலைவில்', TREATMENT: 'சிகிச்சை அவசியம்',
};
const PART_TA: Record<string, string> = { STAR: 'நட்சத்திரம்', VARA: 'கிழமை', TITHI: 'திதி', KARANA: 'கரணம்', TARA: 'தாரை', NADI: 'நாடி' };
const SHORT_TA: Record<string, string> = { WILHELM: 'வில்ஹெல்ம்', SHRIDHAR: 'ஸ்ரீதர்', KALAPRAKASIKA: 'காலப்பிரகாசிகை', MC: 'மு.சிந்தாமணி', KR: 'கல்யாணராமன்', JOSHI: 'ஜோஷி', RAMAN: 'ராமன்', RANGACHARYA: 'ரங்காச்சார்யா' };

const input = 'px-2 py-1 bg-surface-2 border border-line rounded text-ink';

export default function RogaArambhaView() {
  const [table, setTable] = useState<any>(null);
  const [party, setParty] = useState<Party | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [offset, setOffset] = useState('330');
  const [place, setPlace] = useState({ name: 'சென்னை', latitude: '13.0827', longitude: '80.2707' });
  const [bite, setBite] = useState(false);
  const [oneBook, setOneBook] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { computeRogaArambhaTable().then(setTable).catch((e) => setError(String(e))); }, []);
  useEffect(() => {
    const now = new Date(Date.now() + 330 * 60000).toISOString();
    setDate(now.slice(0, 10)); setTime(now.slice(11, 16));
  }, []);

  const run = () => {
    setLoading(true); setError(null);
    computeRogaArambha({
      ...(party ? (party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input }) : {}),
      onset: { date, time, utcOffsetMinutes: Number(offset) },
      place: { latitude: Number(place.latitude), longitude: Number(place.longitude) },
      snakeBite: bite,
    })
      .then(setResult)
      .catch((e) => { setError(e instanceof Error ? e.message : String(e)); setResult(null); })
      .finally(() => setLoading(false));
  };

  const off = result?.displayOffsetMinutes ?? Number(offset) ?? 0;
  const local = (iso: string) => new Date(Date.parse(iso) + off * 60000).toISOString().slice(0, 16).replace('T', ' ');
  const day = (iso: string) => new Date(Date.parse(iso) + off * 60000).toISOString().slice(0, 10);
  const books: any[] = table ? table.books.filter((b: any) => !oneBook || b.key === oneBook) : [];
  const f = result?.facts;

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Onset of Illness</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">நோய்த் தொடக்கம்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          நோய் தொடங்கிய நேரம் அதன் முடிவைக் காட்டும் என்பது நூல்களின் கூற்று: அப்போது சந்திரன் இருக்கும் நட்சத்திரம், கிழமை, திதி, கரணம், நோயாளியின் ஜன்ம நட்சத்திரம்.
          எட்டு நூல்கள் அருகருகே — ஒவ்வொன்றும் அச்சில் உள்ளபடி. இது முன்கணிப்பு அல்ல; மருத்துவ ஆலோசனைக்கு மாற்றும் அல்ல.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <h2 className="text-sm font-semibold text-ink mb-2">நோய் தொடங்கிய கணம்</h2>
        <div className="flex flex-wrap gap-3 items-end text-xs">
          <label className="text-ink-soft">தேதி <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`ml-1 ${input}`} /></label>
          <label className="text-ink-soft">நேரம் <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`ml-1 ${input}`} /></label>
          <label className="text-ink-soft">இடம் <input value={place.name} onChange={(e) => setPlace({ ...place, name: e.target.value })} className={`ml-1 w-24 ${input}`} /></label>
          <label className="text-ink-soft">அட்சரேகை <input type="number" step="0.001" value={place.latitude} onChange={(e) => setPlace({ ...place, latitude: e.target.value })} className={`ml-1 w-20 ${input}`} /></label>
          <label className="text-ink-soft">தீர்க்கரேகை <input type="number" step="0.001" value={place.longitude} onChange={(e) => setPlace({ ...place, longitude: e.target.value })} className={`ml-1 w-20 ${input}`} /></label>
          <label className="text-ink-soft">UTC நிமிடம் <input type="number" step="30" value={offset} onChange={(e) => setOffset(e.target.value)} className={`ml-1 w-16 ${input}`} /></label>
          <label className="text-ink-soft"><input type="checkbox" checked={bite} onChange={(e) => setBite(e.target.checked)} className="mr-1" />பாம்பு / பூச்சிக்கடி</label>
          <button type="button" onClick={run} disabled={loading || !date || !time} className="px-3 py-1.5 rounded bg-ink text-surface font-semibold disabled:opacity-50">{loading ? 'கணக்கிடப்படுகிறது…' : 'பார்'}</button>
        </div>
        <p className="text-[11px] text-ink-soft mt-2">கிழமை சூரிய உதயத்தில் தொடங்குவதால் இடம் தேவை. நோயாளியைத் தேர்ந்தால் ஜன்ம நட்சத்திரத்தின் விதிகளும் (தாரை, திரி-நாடி) பார்க்கப்படும்; தேர்ந்தெடுக்காவிட்டால் அவை "தெரியவில்லை".</p>
        <div className="mt-3"><PartyChooser party={party} setParty={setParty} loading={loading} /></div>
      </section>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && f && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{local(result.atUtc)} · {result.varaTa}கிழமை</h2>
            <p className="text-base text-ink mt-1" style={num}>
              சந்திரன்: <strong>{f.starTa} {f.pada}-ஆம் பாதம்</strong> · திதி: <strong>{f.paksha === 'SHUKLA' ? 'வளர்பிறை' : 'தேய்பிறை'} {f.tithiTa}</strong> · கரணம்: <strong>{f.karanaTa}</strong>{f.karanaSthira ? ' (ஸ்திர / விஷ்டி)' : ''} · சூரியன்: {f.sunStarTa}
            </p>
            <p className="text-xs text-ink-soft mt-1">
              {result.native
                ? <>நோயாளி: {result.native.name ?? '(பெயர் இல்லை)'} · ஜன்ம நட்சத்திரம் {result.natal.starTa} · இன்றைய நட்சத்திரம் ஜன்மத்திலிருந்து {result.natal.tara}-ஆவது · நாடி {result.natal.nadiTa} (இப்போது சந்திரன் {result.nadiNowTa.moon}, சூரியன் {result.nadiNowTa.sun})</>
                : 'நோயாளி தேர்ந்தெடுக்கப்படவில்லை — ஜன்ம நட்சத்திர விதிகள் கணிக்கப்படவில்லை.'}
            </p>
            {result.crisisUtc && <p className="text-xs text-ink mt-1" style={num}>ராமன்: "14-ஆம் நாள் மிக நெருக்கடியான நாள் — சந்திரன் நோய் தொடங்கிய இடத்துக்கு எதிரே" → <span className="font-mono">{local(result.crisisUtc)}</span> (எங்கள் கணக்கு)</p>}
            <p className="text-[11px] text-ink-soft mt-2">{result.rank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">இந்த நட்சத்திரத்துக்கு நூல்கள் சொல்வது — {f.starTa}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 640 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">நூல்</th><th className="py-1 pr-2">நோயின் காலம் / முடிவு</th><th className="py-1 pr-2">எதிர்பார்க்கும் தேதி</th><th className="py-1">குறிப்பு</th></tr></thead>
                <tbody className="align-top">
                  {result.books.filter((b: any) => !oneBook || b.key === oneBook).map((b: any) => (
                    <tr key={b.key} className="border-b border-line/40">
                      <td className="py-1.5 pr-2 font-semibold text-ink">{b.bookTa}<Cites list={[b.source]} /></td>
                      <td className={`py-1.5 pr-2 ${KIND_STYLE[b.cell?.kind] ?? 'text-ink-soft'}`}>
                        {b.cell ? b.cell.textTa : 'நீளத்தைச் சொல்லவில்லை'}
                        {b.wilhelmMc && <span className="block text-[11px] text-ink-soft">முகூர்த்த சிந்தாமணி (வில்ஹெல்ம் கூற்று): {b.wilhelmMc.textTa}</span>}
                      </td>
                      <td className="py-1.5 pr-2 text-ink whitespace-nowrap" style={num}>
                        {b.cell?.expectedUtc ? b.cell.expectedUtc.map((u: string, i: number) => <span key={i} className="block font-mono">{day(u)}</span>) : '—'}
                      </td>
                      <td className="py-1.5 text-ink">
                        {b.flagsHere.map((x: any) => <span key={x.key} className="inline-block mr-1 px-1.5 py-0.5 rounded bg-rose-soft text-rose">{x.textTa}</span>)}
                        {b.listsStars && b.flagsHere.length === 0 && <span className="text-ink-soft">இந்த நட்சத்திரம் அவரது எச்சரிக்கைப் பட்டியலில் இல்லை</span>}
                        {b.quarter && (
                          <span className="block text-[11px] text-ink-soft">
                            அட்டவணை 22.2: {f.pada}-ஆம் கால் → <strong>{b.quarter.days}</strong> நாள் சிரமம் (நான்கு கால்: {b.quarter.all.join(' · ')}); தானம்: {b.quarter.donationTa}
                          </span>
                        )}
                        {b.key === 'SHRIDHAR' && !b.quarter && <span className="block text-[11px] text-ink-soft">இந்த நட்சத்திரத்துக்கு அட்டவணை 22.2 இல் வரிசை இல்லை</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-soft mt-1">"இரவு", "நாள்" இரண்டும் தேதிக்கு நாளாகவே எண்ணப்படுகின்றன; இரு மதிப்பு இருந்தால் இரண்டு தேதியும் காட்டப்படும்.</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-1">கிழமை, திதி, கரணம், தாரை சேர்க்கைகள்</h2>
            <ul className="space-y-1.5">
              {result.rules.filter((r: any) => !oneBook || r.book === oneBook).sort((a: any, b: any) => Number(b.met === true) - Number(a.met === true) || Number(b.met === null) - Number(a.met === null)).map((r: any) => (
                <li key={r.id} className={r.met === true ? 'bg-rose-soft rounded-lg p-2' : 'p-2 border-b border-line/40'}>
                  <span className={r.met === true ? 'font-semibold text-rose' : r.met === null ? 'text-ink-soft' : 'text-ink-soft'}>
                    {r.met === true ? '● பொருந்துகிறது' : r.met === null ? '○ தெரியவில்லை (ஜன்ம நட்சத்திரம் தேவை)' : '○ பொருந்தவில்லை'}
                  </span>
                  {' · '}<strong className="text-ink">{SHORT_TA[r.book]}</strong>
                  {r.met === true && <span className="ml-1 text-rose">[{SEVERITY_TA[r.severity]}]</span>}
                  <span className="block text-ink">{r.textTa}</span>
                  {r.parts.length > 0 && r.met !== true && (
                    <span className="block text-[11px] text-ink-soft">{r.alternative != null ? 'நெருங்கிய சேர்க்கை: ' : ''}{r.parts.map((p: any) => `${PART_TA[p.key]} ${p.ok ? '✓' : p.ok === false ? '✗' : '?'}`).join(' · ')}</span>
                  )}
                  {r.daysAssumed && <span className="block text-[11px] text-ink-soft">கிழமை: நூல் சொல்லவில்லை — ஞாயிறு, செவ்வாய், சனி என எடுத்தோம்.</span>}
                </li>
              ))}
            </ul>
            {!bite && <p className="text-[11px] text-ink-soft mt-2">பாம்பு / பூச்சிக்கடி விதிகள் மேலே "கடி" எனத் தேர்ந்தால் மட்டுமே சேரும்.</p>}
          </section>
        </>
      )}

      {table && (
        <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-sm font-semibold text-ink">27 நட்சத்திரங்கள் — எட்டு நூல்கள்</h2>
            <label className="text-xs text-ink-soft">ஒரே நூல்
              <select value={oneBook} onChange={(e) => setOneBook(e.target.value)} className={`ml-1 ${input}`}>
                <option value="">எல்லா நூல்களும்</option>
                {table.books.map((b: any) => <option key={b.key} value={b.key}>{SHORT_TA[b.key]}</option>)}
              </select>
            </label>
          </div>
          <p className="text-[11px] text-ink-soft mb-2">{table.rank.measureTa} அதிக விளக்கம் உள்ள நூல் முதலில். சிவப்பு = மரணம் / ஆபத்து; ராமன் நீளம் தராமல் "சிகிச்சை அவசியம்" பட்டியல் மட்டுமே தருகிறார்.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]" style={{ minWidth: oneBook ? 420 : 1280 }}>
              <thead><tr className="text-ink-soft border-b border-line text-left">
                <th className="py-1 pr-2 sticky left-0 bg-surface">நட்சத்திரம்</th>
                {books.map((b: any) => <th key={b.key} className="py-1 pr-2">{SHORT_TA[b.key]}<span className="block font-normal text-[10px]" style={num}>{b.words} சொல்</span></th>)}
              </tr></thead>
              <tbody className="align-top">
                {table.stars.map((s: any) => {
                  const here = f && f.star === s.index;
                  return (
                    <tr key={s.index} className={`border-b border-line/40 ${here ? 'bg-rose-soft' : ''}`}>
                      <td className="py-1 pr-2 font-semibold text-ink whitespace-nowrap sticky left-0 bg-surface" style={num}>{s.index + 1}. {s.nameTa}{here && <span className="block text-rose font-normal">இப்போது</span>}</td>
                      {books.map((b: any) => {
                        const c = b.cells[s.index];
                        const flags = Object.keys(b.flags).filter((k) => b.flags[k].includes(s.index));
                        return (
                          <td key={b.key} className={`py-1 pr-2 ${c ? KIND_STYLE[c.kind] : 'text-ink-soft'}`}>
                            {c ? c.textTa : b.key === 'RAMAN' ? '' : '—'}
                            {flags.map((k) => <span key={k} className="block text-[10px] text-rose">⚑ {table.flagTa[k]}</span>)}
                            {b.key === 'WILHELM' && table.wilhelmMc[s.index] && <span className="block text-[10px] text-ink-soft">மு.சி.: {table.wilhelmMc[s.index].textTa}</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Cites list={books.map((b: any) => b.source)} />
        </section>
      )}

      {table && (!oneBook || oneBook === 'SHRIDHAR') && (
        <details className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
          <summary className="cursor-pointer text-sm font-semibold text-ink">ஸ்ரீதரின் அட்டவணை 22.2 — கால் வாரியாகச் சிரம நாட்கள், தானம்</summary>
          <p className="text-[11px] text-ink-soft my-2">அச்சுப் படத்தில் பார்த்துப் பதிந்தவை (ஸ்கேனின் எழுத்து சிதைந்திருந்தது). அட்டவணையில் ரேவதி வரிசை இல்லை; 0-க்கு நூல் விளக்கம் தரவில்லை.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ minWidth: 560 }}>
              <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">நட்சத்திரம்</th><th className="py-1 pr-2">நோய் நாள்</th><th className="py-1 pr-2">1</th><th className="py-1 pr-2">2</th><th className="py-1 pr-2">3</th><th className="py-1 pr-2">4</th><th className="py-1">தானம்</th></tr></thead>
              <tbody>
                {table.stars.map((s: any) => {
                  const r = table.shridharTable[s.index];
                  const c = table.books.find((b: any) => b.key === 'SHRIDHAR').cells[s.index];
                  return (
                    <tr key={s.index} className={`border-b border-line/40 ${f && f.star === s.index ? 'bg-rose-soft' : ''}`} style={num}>
                      <td className="py-1 pr-2 font-semibold text-ink">{s.nameTa}</td>
                      <td className={`py-1 pr-2 ${KIND_STYLE[c?.kind] ?? ''}`}>{c ? c.textTa : '—'}</td>
                      {r ? r.quarters.map((q: number, i: number) => <td key={i} className={`py-1 pr-2 ${f && f.star === s.index && f.pada === i + 1 ? 'font-bold text-rose' : 'text-ink'}`}>{q}</td>) : <td colSpan={4} className="py-1 pr-2 text-ink-soft">அட்டவணையில் இல்லை</td>}
                      <td className="py-1 text-ink-soft">{r ? r.donationTa : ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Cites list={[table.shridharTableSource]} />
        </details>
      )}

      {table && (
        <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
          <h2 className="text-sm font-semibold text-ink mb-2">வேறுபாடுகள்</h2>
          <ul className="list-disc ml-5 space-y-1">{table.differences.map((d: any) => <li key={d.id} className="text-ink">{d.textTa}</li>)}</ul>
          <p className="font-semibold text-ink mt-3">இந்தப் பக்கத்தின் வாசிப்புகள்</p>
          <ul className="list-disc ml-5 space-y-1 text-ink-soft">{table.ourReadingsTa.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
        </section>
      )}
    </main>
  );
}
