'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeKakshyaTransit } from './actions';
import { citeTa } from '@/src/sources/citeTa';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/**
 * The seven planets' transit by Kakshya (C.S. Patel and Subramania Aiyar, Ashtakavarga ch. V): for each planet the bhava
 * and Kakshya it is in, the Kakshya's lord, and whether that lord gave a bindu in the planet's own Ashtakavarga; Patel's
 * rule for several planets together; and the dated windows around the moment.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const input = 'px-2 py-1 bg-surface-2 border border-line rounded text-ink';
const Cite = ({ s }: { s: any }) => <span className="block text-[11px] text-ink-soft mt-1">{citeTa(s)}</span>;
const STANDING_TA: Record<string, string> = { BINDU: 'பிந்து — நன்மை', VOID: 'பிந்து இல்லை', SORROW: 'பிந்து, ஆனால் துன்ப நிலை' };
const STANDING_STYLE: Record<string, string> = { BINDU: 'text-ink', VOID: 'text-ink-soft', SORROW: 'text-rose font-semibold' };
const REASON_TA: Record<string, string> = { DEBILITATED: 'நீசம்', ENEMY_SIGN: 'பகை வீடு', COMBUST: 'அஸ்தங்கம்' };
const METHODS = [{ id: 'PATEL_BHAVA', ta: 'பாவ முறை (படேல்)' }, { id: 'SIGN', ta: 'ராசி முறை' }];

export default function KakshyaTransitView() {
  const [party, setParty] = useState<Party | null>(null);
  const [method, setMethod] = useState('PATEL_BHAVA');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeKakshyaTransit({
      ...(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input }),
      method, ...(date ? { date, time: time || '12:00' } : {}),
    })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party, method, date, time]);

  const off = result?.displayOffsetMinutes ?? 0;
  const local = (iso: string) => new Date(Date.parse(iso) + off * 60000).toISOString().slice(0, 16).replace('T', ' ');
  const zone = `UTC${off < 0 ? '−' : '+'}${Math.floor(Math.abs(off) / 60)}:${String(Math.abs(off) % 60).padStart(2, '0')}`;
  const tg = result?.together;
  const dc = result?.doctrine;
  const order = result ? result.planets.map((p: any) => p.planet) : [];

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Kakshya Transit" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">கோசாரக் காக்ஷ்யா</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒவ்வொரு கிரகமும் ஒரு பாவத்தின் எட்டு காக்ஷ்யைகளில் ஒன்றைக் கடக்கிறது. அந்தக் காக்ஷ்யையின் அதிபதி கிரகத்தின் சொந்த அஷ்டகவர்க்கத்தில் அந்தப் பாவத்தில் பிந்து தந்திருந்தால் நன்மை; இல்லாவிட்டால் பயன் இல்லை (படேல் அத்.V).
          சனிக்கு இது `/saturn-transit` இல் உள்ளது; இங்கே ஏழு கிரகங்களும் ஒன்றாக. நூலின் கூற்று — இந்த மென்பொருளின் முன்கணிப்பு அல்ல.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs flex flex-wrap gap-3 items-end">
        <label className="text-ink-soft">முறை
          <select value={method} onChange={(e) => setMethod(e.target.value)} className={`ml-1 ${input}`}>
            {METHODS.map((m) => <option key={m.id} value={m.id}>{m.ta}</option>)}
          </select>
        </label>
        <label className="text-ink-soft">தேதி <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`ml-1 ${input}`} /></label>
        <label className="text-ink-soft">நேரம் <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`ml-1 ${input}`} /></label>
        {date && <button type="button" onClick={() => { setDate(''); setTime(''); }} className="px-2 py-1 text-ink-soft underline">இப்போது</button>}
        <span className="text-[11px] text-ink-soft">தேதி கொடுக்காவிட்டால் இப்போதைய நிலை.</span>
      </section>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · {local(result.atUtc)} ({zone})</h2>
            <p className="text-xs text-ink-soft">{result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · {result.method.labelTa}</p>
            <p className="text-[11px] text-ink-soft mt-1">{result.method.explainTa}</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">ஏழு கிரகங்களும் இப்போது</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 720 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">ராசி</th><th className="py-1 pr-2">{result.method.division === 'BHAVA' ? 'பாவம்' : 'ராசி (அலகு)'}</th>
                  <th className="py-1 pr-2">காக்ஷ்யா · அதிபதி</th><th className="py-1 pr-2">நிலை</th><th className="py-1 pr-2">பாவ பிந்து</th><th className="py-1">குறிப்பு</th>
                </tr></thead>
                <tbody className="align-top">
                  {result.planets.map((p: any) => (
                    <tr key={p.planet} className="border-b border-line/40">
                      <td className="py-1.5 pr-2 font-semibold text-ink">{p.planetTa}{p.retrograde && <span className="text-rose font-normal"> (வ)</span>}</td>
                      <td className="py-1.5 pr-2 text-ink">{p.rasiTa}</td>
                      <td className="py-1.5 pr-2 text-ink">{p.unitTa}</td>
                      <td className="py-1.5 pr-2 text-ink" style={num}>{p.kakshya} · {p.lordTa}</td>
                      <td className={`py-1.5 pr-2 ${STANDING_STYLE[p.standing]}`}>{STANDING_TA[p.standing]}</td>
                      <td className="py-1.5 pr-2 text-ink" style={num}>{p.bhavaBindus}{p.noBinduAtAll && <span className="text-rose"> · பிந்து இல்லை</span>}{p.allBindus && <span> · எட்டும்</span>}</td>
                      <td className="py-1.5 text-ink-soft">{p.affliction.reasons.length ? p.affliction.reasons.map((r: string) => REASON_TA[r]).join(', ') : ''}{p.affliction.exalted ? 'உச்சம்' : ''}{p.affliction.own ? ' சொந்த வீடு' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-soft mt-2">{dc.sloka5.BINDU} {dc.sloka5.VOID} {dc.sloka5.SORROW}</p>
            <Cite s={dc.sources.SLOKA_5} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">நூல் சொல்லும் பலன் — கிரகம் வாரியாக (படேல் அத்.VI-XII)</h2>
            <p className="text-[11px] text-ink-soft mb-2">ஒவ்வொரு கிரகமும் தன் சொந்த அஷ்டகவர்க்கத்தில் நிற்கும் பாவத்தின் பிந்து எண்ணிக்கைக்கான பலன் (ஸ்லோகம் 1), மற்றும் இப்போதைய காக்ஷ்யையில் பிந்து இருந்தால் / இல்லாவிட்டால் பலன் (ஸ்லோகம் 2 / 3).</p>
            <ul className="space-y-2 text-xs">
              {result.planets.map((p: any) => (
                <li key={p.planet} className="border-b border-line/40 pb-2">
                  <strong className="text-ink">{p.planetTa}</strong> <span className="text-ink-soft" style={num}>· {p.unitTa} · {p.bhavaBindus} பிந்து · காக்ஷ்யா {p.kakshya} ({p.lordTa}) {p.bindu ? '— பிந்து உண்டு' : '— பிந்து இல்லை'}</span>
                  <span className="block text-ink">பாவம்: {p.texts.bhava}</span>
                  {p.texts.bhavaOthers && <span className="block text-ink-soft">மற்ற ஆசிரியர்கள்: {p.texts.bhavaOthers}</span>}
                  <span className={`block ${p.bindu ? 'text-ink' : 'text-rose'}`}>காக்ஷ்யா: {p.texts.kakshya}</span>
                  {p.standing === 'SORROW' && <span className="block text-rose">பிந்து இருந்தும் {p.affliction.reasons.map((r: string) => REASON_TA[r]).join(', ')} — ஸ்லோகம் 5: பெரும் துன்பம்.</span>}
                  {dc.resultSources[p.planet].map((s: any, i: number) => <Cite key={i} s={s} />)}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">பலர் சேர்ந்து (ஸ்லோகம் 6-10)</h2>
            <p className="text-base text-ink" style={num}>பிந்து உள்ள காக்ஷ்யையில் <strong>{tg.binduCount}</strong> · இல்லாதவற்றில் <strong>{tg.voidCount}</strong> (ஏழில்)</p>
            {tg.binduText && <p className="text-sm text-ink mt-1">{tg.binduCount} கிரகம் பிந்து உள்ள காக்ஷ்யையில்: <strong>{tg.binduText}</strong></p>}
            {tg.voidText && <p className="text-sm text-rose mt-1">{tg.voidCount} கிரகம் பிந்து இல்லாத காக்ஷ்யையில்: <strong>{tg.voidText}</strong></p>}
            {tg.moreThanThree && <p className="text-[11px] text-ink-soft mt-1">{dc.together.MORE_THAN_THREE_TA}</p>}
            {tg.deathCertain && <p className="text-[11px] text-rose mt-1">{dc.together.DEATH_CERTAIN_TA}</p>}
            {!tg.binduText && !tg.voidText && <p className="text-xs text-ink-soft mt-1">நான்கு அல்லது அதற்கு மேல் இல்லாததால் நூல் எந்தப் பலனும் சொல்லவில்லை.</p>}
            <ul className="text-[11px] text-ink-soft mt-2 space-y-0.5">
              <li>பிந்து: {Object.entries(dc.together.BINDU).map(([k, v]) => `${k} → ${v}`).join(' · ')}</li>
              <li>இல்லை: {Object.entries(dc.together.VOID).map(([k, v]) => `${k} → ${v}`).join(' · ')}</li>
              <li>கிரகங்களின் இயல்பு வலிமை வரிசை: {dc.strengthOrder.map((p: string) => result.planets.find((x: any) => x.planet === p)?.planetTa ?? p).join(', ')}</li>
            </ul>
            <Cite s={dc.sources.SLOKAS_6_10} />
            <h3 className="text-xs font-semibold text-ink mt-3">பாவத்தின் பிந்து எண்ணிக்கை (ஸ்லோகம் 11)</h3>
            <ul className="text-[11px] text-ink-soft space-y-0.5">{Object.entries(dc.bhavaExtremes).map(([k, v]) => <li key={k}><strong>{k}:</strong> {v as string}</li>)}</ul>
            <Cite s={dc.sources.SLOKA_11} />
            <p className="text-[11px] text-ink-soft mt-2">{dc.sloka14}</p>
            <Cite s={dc.sources.SLOKA_14} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">காக்ஷ்யா காலங்கள் ({zone})</h2>
            {order.map((planet: string) => {
              const w = result.windows[planet];
              const p = result.planets.find((x: any) => x.planet === planet);
              return (
                <details key={planet} className="mb-2" open={planet === 'Sun'}>
                  <summary className="cursor-pointer text-xs text-ink"><strong>{p.planetTa}</strong> — சராசரி {w.meanDays != null ? (w.meanDays < 1 ? `${Math.round(w.meanDays * 240) / 10} மணி` : `${Math.round(w.meanDays * 10) / 10} நாள்`) : '—'} (நூல்: {dc.average.ta[planet]})</summary>
                  <table className="w-full text-[11px] mt-1" style={{ minWidth: 560 }}>
                    <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-0.5 pr-2">தொடக்கம்</th><th className="py-0.5 pr-2">முடிவு</th><th className="py-0.5 pr-2">{result.method.division === 'BHAVA' ? 'பாவம்' : 'ராசி'}</th><th className="py-0.5 pr-2">காக்ஷ்யா · அதிபதி</th><th className="py-0.5">நிலை</th></tr></thead>
                    <tbody>
                      {w.list.map((x: any, i: number) => (
                        <tr key={i} className={`border-b border-line/30 ${x.current ? 'bg-rose-soft' : ''}`} style={num}>
                          <td className="py-0.5 pr-2 font-mono">{x.openStart ? '…' : local(x.fromUtc)}</td>
                          <td className="py-0.5 pr-2 font-mono">{x.openEnd ? '…' : local(x.toUtc)}</td>
                          <td className="py-0.5 pr-2 text-ink">{x.unitTa}</td>
                          <td className="py-0.5 pr-2 text-ink">{x.kakshya} · {x.lordTa}</td>
                          <td className={`py-0.5 ${STANDING_STYLE[x.standing]}`}>{STANDING_TA[x.standing]}{x.current ? ' ← இப்போது' : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              );
            })}
            <p className="text-[11px] text-ink-soft mt-1">பாவ முறையில் காக்ஷ்யாக்கள் சம அளவு அல்ல (பாவ அகலத்தைப் பொறுத்து), அதனால் சராசரி நூலின் 3¾ நாள் போன்றவற்றிலிருந்து சற்று மாறும். நூலின் சராசரிகள்: {Object.keys(dc.average.ta).map((k) => `${result.planets.find((x: any) => x.planet === k)?.planetTa} ${dc.average.ta[k]}`).join(' · ')}.</p>
            <Cite s={dc.sources.AVERAGE} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-2">இந்தப் பக்கத்தின் வாசிப்புகள்</h2>
            <ul className="list-disc ml-5 space-y-1 text-ink-soft">{dc.ourReadingsTa.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
            {result.method.sources.map((s: any, i: number) => <Cite key={i} s={s} />)}
          </section>
        </>
      )}
    </main>
  );
}
