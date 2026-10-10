'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeMuhurtaStars } from './actions';

/**
 * The star of a muhurta over a period, for one person: Latta (a planet kicks
 * the Moon's star) for anyone, and the person's birth star, 88th and 108th
 * padas and Vainashika. Every reading the books give is computed; the switches
 * choose which one marks a time as rejected. The books are listed by how much
 * they explain, and the default is the first book's.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const cite = (s: any) => `${s.title} — ${String(s.pageLocus).split(/: "| — /)[0]}`;
const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);
const DIR_TA: Record<number, string> = { 1: 'முன்னோக்கி', [-1]: 'பின்னோக்கி' };
const PERSONAL_TA: Record<string, string> = { JANMA: 'ஜன்ம நட்சத்திரம்', PADA_88: '88-வது பாதம்', PADA_108: '108-வது பாதம்' };
const PLANET_NAME_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
type Show = 'ALL' | 'CLEAR' | 'BLOCKED';

function Switch({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-[11px] mr-3 mb-1">
      <span className="text-ink-soft">{label}:</span>
      {options.map(([id, ta]) => (
        <button key={id} type="button" onClick={() => onChange(id)}
          className={`px-2 py-0.5 rounded-full border ${value === id ? 'border-saffron bg-saffron/10 text-ink font-semibold' : 'border-line text-ink-soft'}`}>
          {ta}
        </button>
      ))}
    </span>
  );
}

export default function MuhurtaStarsView() {
  const [party, setParty] = useState<Party | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [days, setDays] = useState(30);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rahu, setRahu] = useState('BACKWARD');
  const [padaRule, setPadaRule] = useState('WHOLE');
  const [vainashika, setVainashika] = useState('STAR_23');
  const [taraBad, setTaraBad] = useState('T1357');
  const [taraCycle, setTaraCycle] = useState('QUARTERS');
  const [chandraReading, setChandraReading] = useState('GOOD_LIST');
  const [show, setShow] = useState<Show>('ALL');

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    const who = party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input };
    computeMuhurtaStars({ ...who, fromDate: fromDate || undefined, days })
      .then((r) => {
        if (cancelled) return;
        setResult(r);
        setRahu(r.books.rahu.default); setPadaRule(r.books.padaRules.default); setVainashika(r.books.vainashika.default);
        setTaraBad(r.books.taraBad.default); setTaraCycle(r.books.taraCycles.default); setChandraReading(r.books.chandraReadings.default);
        if (!fromDate) setFromDate(r.fromDate);
      })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party, fromDate, days]);

  const off = result?.displayOffsetMinutes ?? 0;
  const zone = `UTC${off < 0 ? '−' : '+'}${Math.floor(Math.abs(off) / 60)}:${String(Math.abs(off) % 60).padStart(2, '0')}`;
  const local = (iso: string) => new Date(Date.parse(iso) + off * 60000).toISOString().slice(0, 16).replace('T', ' ');
  const hm = (iso: string) => local(iso).slice(11);
  const B = result?.books;

  /** What rejects a segment under the chosen readings. */
  const judge = (s: any) => {
    const kicks = s.latta.filter((h: any) => h.rahu === null || h.rahu === rahu);
    const counted = kicks.filter((h: any) => padaRule === 'WHOLE' || (padaRule === 'SAME_QUARTER' ? h.sameQuarter : h.jvQuarter));
    const personal = [
      s.personal.JANMA && 'JANMA', s.personal.PADA_88 && 'PADA_88', s.personal.PADA_108 && 'PADA_108',
    ].filter(Boolean) as string[];
    const vain = s.personal.VAINASHIKA[vainashika];
    const tara = s.taraVerdicts[taraBad][taraCycle] as 'REJECT' | 'CAUTION' | null;
    const chandra = s.chandraBala[chandraReading] as boolean;
    return { kicks, counted, personal, vain, tara, chandra, clear: counted.length === 0 && personal.length === 0 && !vain && tara !== 'REJECT' && chandra };
  };
  const PAKSHA_TA: Record<string, string> = { SHUKLA: 'வளர்பிறை', KRISHNA: 'தேய்பிறை' };

  const rows = (result?.segments ?? []).map((s: any) => ({ s, j: judge(s) }))
    .filter(({ j }: any) => show === 'ALL' || (show === 'CLEAR' ? j.clear : !j.clear));
  const byDay: [string, any[]][] = [];
  for (const r of rows) {
    const d = local(r.s.fromUtc).slice(0, 10);
    if (!byDay.length || byDay[byDay.length - 1][0] !== d) byDay.push([d, []]);
    byDay[byDay.length - 1][1].push(r);
  }

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Muhurta star</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">முகூர்த்த நட்சத்திரம் — லத்தை, தாரா பலம், சந்திர பலம், வைநாசிகம், 88/108-வது பாதம்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          முகூர்த்த நட்சத்திரம் என்பது அந்த நேரத்தில் சந்திரன் நிற்கும் நட்சத்திரம். ஒரு கிரகம் அதை "உதைத்தால்" (லத்தை) யாருக்கும் விலக்கு;
          இவருக்கு — தாரா பலம் (ஜன்ம நட்சத்திரத்திலிருந்து), சந்திர பலம் (ஜன்ம ராசியிலிருந்து), ஜன்ம நட்சத்திரம், 88-வது, 108-வது பாதம், வைநாசிகம்.
          நூல்கள் வேறுபடும் இடங்களில் எல்லா வாசிப்புகளும் கணிக்கப்படுகின்றன; அதிகம் விளக்கும் நூலின் வாசிப்பு இயல்பு.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-ink mb-2">யாருக்கு?</h2>
        <PartyChooser party={party} setParty={setParty} loading={loading} />
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
          <label className="text-ink-soft">முதல் நாள் <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="ml-1 px-2 py-1 bg-surface-2 border border-line rounded text-ink" /></label>
          <label className="text-ink-soft">நாட்கள்
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="ml-1 px-2 py-1 bg-surface-2 border border-line rounded text-ink">
              {[7, 15, 30, 60, 90].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>
      </section>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · ஜன்ம நட்சத்திரம் {result.janma.starTa} {result.janma.pada}-ஆம் பாதம்</h2>
            <p className="text-xs text-ink-soft">{result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · நேரங்கள் {zone}</p>
            <ul className="text-xs text-ink mt-2 space-y-0.5">
              <li>88-வது பாதம்: <strong>{result.janma.pada88.starTa} {result.janma.pada88.pada}</strong> · 108-வது பாதம்: <strong>{result.janma.pada108.starTa} {result.janma.pada108.pada}</strong></li>
              <li>வைநாசிகம்: {B.vainashika.order.map((id: string) => `${B.vainashika[id].labelTa} — ${result.janma.vainashika[id].starTa}`).join(' · ')}
                {result.janma.vainashika.STAR_22.wilhelmExempt && <span className="text-ink-soft"> (வில்ஹெல்ம்: இந்த ஜன்ம நட்சத்திரத்துக்கு 22-வது கேடில்லை)</span>}
              </li>
            </ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">நேரங்கள் — {local(result.fromUtc).slice(0, 10)} முதல் {result.days} நாள்</h2>
            <div className="mb-2">
              <Switch label="ராகுவின் உதை" value={rahu} onChange={setRahu}
                options={B.rahu.order.map((id: string) => [id, `${B.rahu[id].labelTa}${id === B.rahu.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="லத்தை — எந்தப் பாதம்" value={padaRule} onChange={setPadaRule}
                options={B.padaRules.order.map((id: string) => [id, `${B.padaRules[id].labelTa}${id === B.padaRules.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="வைநாசிகம்" value={vainashika} onChange={setVainashika}
                options={B.vainashika.order.map((id: string) => [id, `${B.vainashika[id].labelTa}${id === B.vainashika.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="தீய தாரைகள்" value={taraBad} onChange={setTaraBad}
                options={B.taraBad.order.map((id: string) => [id, `${B.taraBad[id].labelTa}${id === B.taraBad.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="தாரை — சுற்று விதி" value={taraCycle} onChange={setTaraCycle}
                options={B.taraCycles.order.map((id: string) => [id, `${B.taraCycles[id].labelTa}${id === B.taraCycles.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="சந்திர பலம்" value={chandraReading} onChange={setChandraReading}
                options={B.chandraReadings.order.map((id: string) => [id, `${B.chandraReadings[id].labelTa}${id === B.chandraReadings.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="காட்டு" value={show} onChange={(v) => setShow(v as Show)}
                options={[['ALL', 'எல்லாம்'], ['CLEAR', 'தடை இல்லாதவை'], ['BLOCKED', 'தடை உள்ளவை']]} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 760 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">நேரம்</th><th className="py-1 pr-2">நட்சத்திரம் · பாதம்</th><th className="py-1 pr-2">லத்தை</th><th className="py-1 pr-2">தாரை · சந்திரன்</th><th className="py-1">இவருக்கு</th>
                </tr></thead>
                {byDay.map(([d, list]) => (
                  <tbody key={d} className="align-top">
                    <tr><td colSpan={5} className="pt-2 pb-0.5 font-semibold text-ink">{d}</td></tr>
                    {list.map(({ s, j }: any) => (
                      <tr key={s.fromUtc} className={`border-b border-line/40 ${s.current ? 'bg-amber-50' : ''}`}>
                        <td className="py-1 pr-2 font-mono whitespace-nowrap" style={num}>
                          {hm(s.fromUtc)} – {local(s.toUtc).slice(0, 10) === d ? hm(s.toUtc) : local(s.toUtc).slice(5)}
                          {s.current && <span className="block font-sans text-amber-800">இப்போது</span>}
                        </td>
                        <td className={`py-1 pr-2 ${j.clear ? 'text-teal' : 'text-ink'}`}>{s.starTa} {s.pada}{j.clear && <span className="block text-[11px]">தடை இல்லை</span>}</td>
                        <td className="py-1 pr-2">
                          {j.kicks.length === 0 && <span className="text-ink-soft">—</span>}
                          {j.kicks.map((h: any) => {
                            const on = j.counted.includes(h);
                            const dir = h.rahu ? B.rahu[h.rahu].dir : B.kicks[h.planet].dir;
                            return (
                              <span key={`${h.planet}${h.rahu}`} className={`block ${on ? 'text-rose' : 'text-ink-soft'}`}>
                                {h.planetTa} ({h.kickerStarTa} {h.kickerPada}, {DIR_TA[dir]} {B.kicks[h.planet].count})
                                {h.sameQuarter && ' · அதே பாதம்'}{h.jvQuarter && ` · ${dir > 0 ? 'முதல்' : 'கடைசி'} பாதம்`}
                                {!on && ' — இந்தப் பாத விதியில் தடை இல்லை'}
                              </span>
                            );
                          })}
                        </td>
                        <td className="py-1 pr-2">
                          <span className={`block ${j.tara === 'REJECT' ? 'text-rose' : j.tara === 'CAUTION' ? 'text-amber-700' : 'text-ink'}`}>
                            {B.taraNamesTa[s.tara.n - 1]} ({s.tara.count}, {s.tara.cycle}-ஆம் சுற்று){j.tara === 'REJECT' ? ' — தாரா பலம் இல்லை' : j.tara === 'CAUTION' ? ' — கவனம்' : ''}
                          </span>
                          <span className={`block ${j.chandra ? 'text-ink' : 'text-rose'}`}>
                            சந்திரன் {s.chandra.house}-ல் · {PAKSHA_TA[s.chandra.paksha]}{j.chandra ? '' : ' — சந்திர பலம் இல்லை'}
                            {s.chandra.vedhaBy.length > 0 && <span className="text-ink-soft"> (வேதை: {s.chandra.vedhaHouse}-ல் {s.chandra.vedhaBy.map((p: string) => PLANET_NAME_TA[p] ?? p).join(', ')})</span>}
                          </span>
                          {s.chandra.chandrashtama && (
                            <span className={`block text-[11px] ${B.chandrashtamaKinds[s.chandra.chandrashtama]?.harmless ? 'text-teal' : 'text-rose'}`}>
                              சந்திராஷ்டமம்{B.chandrashtamaKinds[s.chandra.chandrashtama] ? ` — ${B.chandrashtamaKinds[s.chandra.chandrashtama].ta} (வில்ஹெல்ம்)` : ''}
                            </span>
                          )}
                        </td>
                        <td className="py-1">
                          {j.personal.map((k: string) => <span key={k} className="block text-rose">{PERSONAL_TA[k]}{k === 'JANMA' && s.personal.JANMA_PADA ? ' — ஜன்ம பாதமும்' : ''}</span>)}
                          {j.vain && <span className="block text-rose">வைநாசிகம் ({B.vainashika[vainashika].labelTa})</span>}
                          {!j.vain && B.vainashika.order.filter((id: string) => id !== vainashika && s.personal.VAINASHIKA[id]).map((id: string) => (
                            <span key={id} className="block text-ink-soft">வைநாசிகம் — {B.vainashika[id].labelTa} வாசிப்பில் மட்டும்</span>
                          ))}
                          {s.remedy88 && (
                            <span className="block text-[11px] text-ink-soft">
                              லக்னாதிபதி / 10-ஆம் அதிபதி நண்பர்கள் (தீமை நீங்கும்): {s.remedy88.filter((x: any) => x.friends).map((x: any) => `${hm(x.fromUtc)}–${hm(x.toUtc)} ${x.lagnaTa}`).join(', ') || 'இந்த நேரத்தில் இல்லை'}
                            </span>
                          )}
                          {j.personal.length === 0 && !j.vain && <span className="text-ink-soft">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
            <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-3 space-y-0.5">{B.notesTa.map((t: string) => <li key={t}>{t}</li>)}</ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">லத்தை — நூல்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">வரிசை: அதிக விளக்கம் உள்ள நூல் முதலில் — {B.lattaRank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.</p>
            <p className="text-xs text-ink">
              உதைகள்: {Object.entries(B.kicks).map(([p, k]: [string, any]) => `${k.planetTa} ${k.count}-வது ${DIR_TA[k.dir]}`).join(', ')} (உதைக்கும் கிரகம் நிற்கும் நட்சத்திரம் 1). எல்லா நூல்களிலும் இதே எண்ணிக்கை.
            </p>
            <p className="text-xs font-semibold text-ink mt-2">ராகுவின் திசை</p>
            <ul className="text-xs space-y-0.5">{B.rahu.order.map((id: string) => <li key={id}><strong>{B.rahu[id].labelTa}{id === B.rahu.default ? ' (இயல்பு)' : ''}:</strong> {B.rahu[id].booksTa}</li>)}</ul>
            <p className="text-xs font-semibold text-ink mt-2">எந்தப் பாதம்</p>
            <ul className="text-xs space-y-0.5">{B.padaRules.order.map((id: string) => <li key={id}><strong>{B.padaRules[id].labelTa}{id === B.padaRules.default ? ' (இயல்பு)' : ''}:</strong> {B.padaRules[id].textTa}</li>)}</ul>
            <Cites list={B.lattaRank.order.map((b: string) => B.lattaSources[b]).concat([B.lattaSources.SHRIDHAR_PADAS, B.lattaSources.MUHURTA_CHINTAMANI_64])} />
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer text-ink-soft">உதைக்கு நூல்கள் சொல்லும் பலன் (நூல்களின் கூற்று — இந்த மென்பொருளின் முன்கணிப்பு அல்ல)</summary>
              <table className="w-full mt-1" style={{ minWidth: 560 }}>
                <thead><tr className="text-ink-soft text-left"><th className="pr-2">நூல்</th>{Object.keys(B.kicks).map((p) => <th key={p} className="pr-2">{B.kicks[p].planetTa}</th>)}</tr></thead>
                <tbody>
                  {Object.entries(B.lattaEffects).map(([id, e]: [string, any]) => (
                    <tr key={id} className="border-t border-line/40 align-top">
                      <td className="pr-2 text-ink">{e.labelTa}</td>
                      {Object.keys(B.kicks).map((p) => <td key={p} className="pr-2 text-ink-soft">{e.byPlanet[p]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Cites list={Object.values(B.lattaEffects).map((e: any) => e.source)} />
            </details>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">இவருக்கு மட்டும் — நூல்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">வரிசை: {B.personalRank.measureTa}</p>
            <ul className="text-xs space-y-2">
              {Object.entries(B.personal).map(([id, c]: [string, any]) => (
                <li key={id}><strong>{c.labelTa}:</strong> {c.textTa}<Cites list={c.sources} /></li>
              ))}
              {B.vainashika.order.map((id: string) => (
                <li key={id}><strong>வைநாசிகம் — {B.vainashika[id].labelTa}{id === B.vainashika.default ? ' (இயல்பு)' : ''}:</strong> {B.vainashika[id].textTa}<Cites list={B.vainashika[id].sources} /></li>
              ))}
              <li><strong>88-வது பாதத்துக்குப் பரிகாரம்:</strong> {B.remedy88.textTa} <span className="text-ink-soft">{B.remedy88.readingTa}</span><Cites list={B.remedy88.sources} /></li>
            </ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">தாரா பலம் — நூல்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">வரிசை: {B.taraRank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.</p>
            <p className="text-xs text-ink">
              ஜன்ம நட்சத்திரத்திலிருந்து (அது 1) முகூர்த்த நட்சத்திரம் வரை எண்ணி 9-ஆல் வகுத்த மீதி தாரை (0 = 9): {B.taraNamesTa.map((t: string, i: number) => `${i + 1} ${t}`).join(', ')}. 27 நட்சத்திரங்கள் மூன்று சுற்று (பர்யாயம்).
            </p>
            <p className="text-xs font-semibold text-ink mt-2">தீய தாரைகள்</p>
            <ul className="text-xs space-y-0.5">{B.taraBad.order.map((id: string) => <li key={id}><strong>{B.taraBad[id].labelTa}{id === B.taraBad.default ? ' (இயல்பு)' : ''}:</strong> {B.taraBad[id].booksTa}</li>)}</ul>
            <p className="text-xs font-semibold text-ink mt-2">சுற்று விதி</p>
            <ul className="text-xs space-y-0.5">{B.taraCycles.order.map((id: string) => <li key={id}><strong>{B.taraCycles[id].labelTa}{id === B.taraCycles.default ? ' (இயல்பு)' : ''}:</strong> {B.taraCycles[id].textTa}</li>)}</ul>
            <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-2 space-y-0.5">{B.taraNotesTa.map((t: string) => <li key={t}>{t}</li>)}</ul>
            <Cites list={B.taraRank.order.map((b: string) => B.taraSources[b]).concat([B.taraSources.KALYANRAMAN_2])} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">சந்திர பலம் — நூல்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">வரிசை: {B.chandraRank.measureTa}</p>
            <p className="text-xs text-ink">
              சந்திரன் நிற்கும் ராசி ஜன்ம ராசியிலிருந்து (இவருக்கு {result.janma.signTa}) எத்தனையாவது. 8-ஆம் இடம் (சந்திராஷ்டமம்) எல்லா நூலிலும் தீயது;
              வில்ஹெல்ம் அதைத் தாரையைக் கொண்டு ஆறு வகையாக்குகிறார் — சோபன, அமல, சித்த தீமையற்றவை.
              இவருக்கு ஜன்ம ராசி அதிபதி {PLANET_NAME_TA[result.janma.chandrashtamaLords.natalLord]}, 8-ஆம் அதிபதி {PLANET_NAME_TA[result.janma.chandrashtamaLords.eighthLord]} —
              {result.janma.chandrashtamaLords.friends ? ' நண்பர்கள்: வில்ஹெல்மின்படி சந்திராஷ்டமம் தீமை செய்யாது.' : ' நண்பர்கள் அல்ல.'}
            </p>
            <ul className="text-xs space-y-1 mt-2">{B.chandraReadings.order.map((id: string) => (
              <li key={id}><strong>{B.chandraReadings[id].labelTa}{id === B.chandraReadings.default ? ' (இயல்பு)' : ''}:</strong> {B.chandraReadings[id].textTa} <span className="text-ink-soft">({B.chandraReadings[id].booksTa})</span></li>
            ))}</ul>
            <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-2 space-y-0.5">{B.chandraNotesTa.map((t: string) => <li key={t}>{t}</li>)}</ul>
            <Cites list={B.chandraRank.order.map((b: string) => B.chandraSources[b])} />
          </section>
        </>
      )}
    </main>
  );
}
