'use client';

import { useEffect, useState } from 'react';
import { computeKpHorary, loadKpHoraryTables } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * KP horary (K.S. Krishnamurti, Reader VI): the number 1-249 fixes the ascendant (the start of its sub); the other cusps are those of the moment that ascendant rises at the
 * place; the planets are those of the time of judgment; the ruling planets are the day lord and the Moon's and the ascendant's sign and star lords. No answer is given:
 * for a question the book names houses for, the page shows which planets signify them.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const SIGN_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const FACTOR_TA: Record<string, string> = { 'Day Lord': 'நாள் அதிபதி', 'Moon Sign Lord': 'சந்திர ராசி அதிபதி', 'Moon Star Lord': 'சந்திர நட்சத்திர அதிபதி', 'Asc Sign Lord': 'லக்ன ராசி அதிபதி', 'Asc Star Lord': 'லக்ன நட்சத்திர அதிபதி' };
const pt = (x: string) => PLANET_TA[x] ?? x;
const list = (l: string[]) => (l && l.length ? l.map(pt).join(', ') : '—');
const nums = (l: number[]) => (l && l.length ? l.join(', ') : '—');
const pad = (n: number) => String(n).padStart(2, '0');
const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';

/** Degrees, minutes and seconds in the sign, with the seconds carried properly. */
function dms(lon: number, boundary = false) {
  let t = Math.round((((lon % 360) + 360) % 360 % 30) * 3600);
  if (boundary && t === 0) t = 108000;
  return `${Math.floor(t / 3600)}°${pad(Math.floor((t % 3600) / 60))}′${pad(t % 60)}″`;
}

function nowParts() {
  const d = new Date();
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}

export default function KpHoraryView() {
  const [tables, setTables] = useState<any>(null);
  const [form, setForm] = useState({ number: '77', ...nowParts(), place: 'சென்னை', latitude: '13.0827', longitude: '80.2707', offset: '330', topic: '' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => { loadKpHoraryTables().then(setTables).catch(() => undefined); }, []);
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  const sub = tables && form.number ? tables.subs[parseInt(form.number, 10) - 1] : null;

  const run = async () => {
    setLoading(true); setError(null);
    try {
      const [year, month, day] = form.date.split('-').map(Number);
      const [hour, minute] = form.time.split(':').map(Number);
      setResult(await computeKpHorary({
        number: parseInt(form.number, 10), year, month, day, hour, minute, utcOffsetMinutes: parseInt(form.offset, 10), latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), placeName: form.place,
        topic: form.topic || undefined,
      }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } finally { setLoading(false); }
  };

  const a = result?.analysis;
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">KP horary · Reader VI</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">KP பிரச்னம் — எண் 1 முதல் 249</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          கேட்பவர் சொல்லும் எண் 1-249 ஒவ்வொன்றும் ஒரு ராசி-நட்சத்திரம்-உப அதிபதி; அந்த உபத்தின் தொடக்கமே லக்னம் (நூல் ப.88). மற்ற கஸ்ப்கள் அந்த லக்னம் அந்த ஊரில் உதிக்கும் நேரத்தினுடையவை;
          கிரகங்கள் "தீர்ப்பு சொல்லத் தொடங்கும் நேரத்தினுடையவை" (ப.87), நிலையான நேரத்தில். தீர்ப்போ பதிலோ இல்லை: கேள்விக்கு நூல் சொல்லும் வீடுகளை எந்தக் கிரகங்கள் குறிக்கின்றன என்று மட்டும் காட்டுகிறது.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-3 items-end text-xs text-ink-soft">
          <label>எண் (1-249)<br /><input className={`${field} w-20`} value={form.number} onChange={set('number')} /></label>
          <label>தேதி<br /><input type="date" className={field} value={form.date} onChange={set('date')} /></label>
          <label>நேரம் (தீர்ப்பு)<br /><input type="time" className={field} value={form.time} onChange={set('time')} /></label>
          <label>இடம்<br /><input className={`${field} w-28`} value={form.place} onChange={set('place')} /></label>
          <label>அட்சம்<br /><input className={`${field} w-24`} value={form.latitude} onChange={set('latitude')} /></label>
          <label>தீர்க்கம்<br /><input className={`${field} w-24`} value={form.longitude} onChange={set('longitude')} /></label>
          <label>நேர மண்டலம் (நிமிடம்)<br /><input className={`${field} w-20`} value={form.offset} onChange={set('offset')} /></label>
          <label>கேள்வி<br />
            <select className={`${field} w-64`} value={form.topic} onChange={set('topic')}>
              <option value="">— தேர்வு இல்லை —</option>
              {tables?.topics.slice().sort((x: any, y: any) => x.page - y.page).map((t: any) => <option key={t.id} value={t.id}>{t.citation ? 'KP-Ezine · ' : ''}ப.{t.page} · {t.titleTa} ({t.houses.join(', ')})</option>)}
            </select>
          </label>
          <button type="button" onClick={run} disabled={loading} className="px-4 py-1.5 rounded bg-saffron text-ink text-sm disabled:opacity-50">{loading ? 'கணக்கிடுகிறது…' : 'கணக்கிடு'}</button>
        </div>
        {sub && <p className="text-xs text-ink mt-2" style={num}>எண் {form.number}: {SIGN_TA[sub.sign]} · ராசி அதிபதி {pt(sub.signLord)} · நட்சத்திர அதிபதி {pt(sub.starLord)} · உப அதிபதி {pt(sub.subLord)} · {dms(sub.from)} – {dms(sub.to, true)}</p>}
        {error && <p className="text-rose text-sm mt-2">⚠️ {error}</p>}
        <p className="text-[11px] text-ink-soft mt-2">தீர்ப்பு நேரத்தையே எடுக்க வேண்டும் (கேட்கும் நேரம் அல்ல) — நூல் ப.87.</p>
      </section>

      {result && (
        <>
          <p className="text-xs text-ink-soft mb-3">{citeTa(result.source)}</p>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm grid md:grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold text-ink mb-1">கஸ்ப்கள்</h2>
              <table className="w-full text-xs" style={num}>
                <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">வீடு</th><th className="pr-2">தீர்க்கம்</th><th className="pr-2">ராசி</th><th className="pr-2">நட்சத்திரம்</th><th className="pr-2">உப</th></tr></thead>
                <tbody>
                  {result.kp.cusps.map((c: any) => (
                    <tr key={c.number} className="border-t border-line/40"><td className="py-0.5 pr-2">{c.number}</td><td className="pr-2">{SIGN_TA[SIGN_EN.indexOf(c.sign)]} {dms(c.longitude)}</td><td className="pr-2">{pt(c.signLord)}</td><td className="pr-2">{pt(c.starLord)}</td><td>{pt(c.sub)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="font-semibold text-ink mb-1">கிரகங்கள் (தீர்ப்பு நேரத்தில்)</h2>
              <table className="w-full text-xs" style={num}>
                <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">கிரகம்</th><th className="pr-2">தீர்க்கம்</th><th className="pr-2">வீடு</th><th className="pr-2">நட்சத்திரம்</th><th className="pr-2">உப</th></tr></thead>
                <tbody>
                  {result.kp.positions.map((p: any) => (
                    <tr key={p.name} className="border-t border-line/40"><td className="py-0.5 pr-2">{pt(p.name)}{p.retrograde ? ' (வ)' : ''}</td><td className="pr-2">{SIGN_TA[SIGN_EN.indexOf(p.sign)]} {dms(p.longitude)}</td><td className="pr-2">{p.house}</td><td className="pr-2">{pt(p.starLord)}</td><td>{pt(p.sub)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">ஆளும் கிரகங்கள் (நூல் ப.123)</h2>
            <p className="text-xs text-ink-soft mb-2">{result.ruling.factors.map((f: any) => `${FACTOR_TA[f[0]] ?? f[0]}: ${pt(f[1])}`).join(' · ')}. ராகு-கேது தாம் நிற்கும் ராசியின் அதிபதியின் முகவர்; அந்த அதிபதி ஆளும் கிரகமாக இருந்தால் சேர்க்கப்படுகிறார்கள். "வக்ர கிரகத்தின் நட்சத்திரத்தில் நிற்பவை நிராகரிக்கப்பட வேண்டும்" என்று நூல் சொல்வதால் அவை குறிக்கப்படுகின்றன (✱).</p>
            <p className="text-sm text-ink">{result.ruling.planets.map((r: any) => `${pt(r.planet)}${r.inRetrogradeStar ? ' ✱' : ''}${r.retrograde ? ' (வக்ரம்)' : ''}`).join(' · ')}</p>
            {result.ruling.nodesAdded.length > 0 && <p className="text-xs text-ink-soft mt-1">சேர்க்கப்பட்ட முனைகள்: {result.ruling.nodesAdded.map((n: any) => `${pt(n.node)} (${pt(n.forLord)}-இன் முகவர்)`).join(', ')}</p>}
          </section>

          {result.rising && (
            <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="font-semibold text-ink mb-1">ஆளும் கிரகங்களால் ஆளப்படும் உதய நிலைகள் — அடுத்த {result.rising.hours} மணி (நூல் ப.126-130)</h2>
              <p className="text-xs text-ink-soft mb-2">நிமிடங்களிலோ மணிகளிலோ நடக்கும் நிகழ்வுக்கு நூல் தசை எடுக்காது; ஆளும் கிரகங்களே ராசி, நட்சத்திரம், உப அதிபதிகளாக உள்ள இராசிப் புள்ளி கிழக்கே எழும் நேரத்தைப் பார்க்கிறது. கீழே அத்தகைய புள்ளிகள் உள்ளன; நூல் தரும் குறிகாட்டி நிபந்தனைகள் இங்கு பொருத்தப்படவில்லை. நூல் கணக்கு அட்டவணை நேரத்தால் செய்யப்பட்டது; இங்கு துல்லியக் கணக்கு, அதனால் சில நொடிகள்-ஒரு நிமிடம் வேறுபடலாம். {citeTa(result.rising.source)}</p>
              <table className="w-full text-xs" style={num}>
                <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">ராசி-நட்சத்திரம்-உப-உப உப</th><th className="pr-2">தீர்க்கம்</th><th>எழும் நேரம்</th></tr></thead>
                <tbody>
                  {result.rising.bySubSub.slice(0, 60).map((r: any, i: number) => (
                    <tr key={i} className="border-t border-line/40"><td className="py-0.5 pr-2">{[r.signLord, r.starLord, r.subLord, r.subSubLord].map(pt).join(' · ')}</td><td className="pr-2">{dms(r.from % 30)} {SIGN_TA[Math.floor(r.from / 30)]}</td><td>{r.times.map((t: any) => `${t.start.text}${t.start.dayOffset ? ` (+${t.start.dayOffset} நாள்)` : ''} – ${t.end.text}`).join('; ')}</td></tr>
                  ))}
                </tbody>
              </table>
              {result.rising.bySubSub.length === 0 && <p className="text-xs text-ink-soft">இந்தக் காலத்தில் அத்தகைய புள்ளி இல்லை.</p>}
            </section>
          )}

          {a && (
            <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="font-semibold text-ink mb-1">{a.topic.titleTa} — வீடுகள் {a.topic.houses.join(', ')} ({a.topic.citation ?? `நூல் ப.${a.topic.page}`})</h2>
              <p className="text-xs text-ink-soft mb-3">{a.topic.reasonTa}</p>
              <h3 className="text-xs font-semibold text-ink mb-1">அந்த வீடுகளின் கஸ்ப் உப அதிபதிகள்</h3>
              <table className="w-full text-xs mb-3" style={num}>
                <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">வீடு</th><th className="pr-2">உப அதிபதி</th><th className="pr-2">அவர் குறிக்கும் வீடுகள்</th><th>கேள்வியின் வீடுகளில்</th></tr></thead>
                <tbody>{a.cusps.map((c: any) => <tr key={c.house} className="border-t border-line/40"><td className="py-0.5 pr-2">{c.house}</td><td className="pr-2">{pt(c.subLord)}</td><td className="pr-2">{nums(c.subLordSignifies)}</td><td>{nums(c.signifiesTopic)}</td></tr>)}</tbody>
              </table>
              <h3 className="text-xs font-semibold text-ink mb-1">குறிகாட்டிகள் (அந்த வீடுகளைக் குறிக்கும் கிரகங்கள்)</h3>
              <table className="w-full text-xs mb-3" style={num}>
                <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">கிரகம்</th><th className="pr-2">குறிக்கும் வீடுகள்</th><th className="pr-2">கேள்வியின் வீடுகள்</th><th>6, 8, 12</th></tr></thead>
                <tbody>{a.significators.map((s: any) => <tr key={s.planet} className="border-t border-line/40"><td className="py-0.5 pr-2">{pt(s.planet)}</td><td className="pr-2">{nums(s.houses)}</td><td className="pr-2">{nums(s.topicHouses)}</td><td>{nums(s.badHouses)}</td></tr>)}</tbody>
              </table>
              <h3 className="text-xs font-semibold text-ink mb-1">ஆளும் கிரகங்களில் குறிகாட்டிகள்</h3>
              <p className="text-xs text-ink-soft mb-2">{a.ruling.filter((r: any) => r.topicHouses.length).map((r: any) => `${pt(r.planet)} (${nums(r.topicHouses)})${r.inRetrogradeStar ? ' ✱' : ''}`).join(' · ') || '—'}</p>
              {a.rules && a.rules.length > 0 && (
                <div className="mb-2">
                  <h3 className="text-xs font-semibold text-ink mb-1">நூல் சொல்லும் நிபந்தனைகள் (ஒவ்வொன்றும் "உள்ளது/இல்லை" மட்டும்)</h3>
                  <ul className="text-xs list-disc pl-4">
                    {a.rules.map((r: any, i: number) => (
                      <li key={i}><span className={r.status === 'HELD' ? 'text-rose' : 'text-ink-soft'}>{r.status === 'HELD' ? 'உள்ளது' : 'இல்லை'}</span> — {r.textTa} <span className="text-ink-soft">[{r.via === 'STAR' ? `உப அதிபதி ${pt(r.subLord)} நிற்கும் நட்சத்திர அதிபதி ${pt(r.starLord)}` : `உப அதிபதி ${pt(r.subLord)}`}: குறிக்கும் வீடுகள் {nums(r.houses)}]</span></li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-ink-soft mt-1">நூல் "மற்றும்" என்றால் இரண்டும், "அல்லது" என்றால் ஏதேனும் ஒன்று என்றே படிக்கப்படுகிறது. இவை நூலின் வாக்கியங்கள்; இங்கே பதில் அல்ல.</p>
                </div>
              )}
              {a.extra.length > 0 && (
                <ul className="text-xs list-disc pl-4">
                  {a.extra.map((e: any) => <li key={e.id}><span className={e.status === 'HELD' ? 'text-rose' : 'text-ink-soft'}>{e.status === 'HELD' ? 'உள்ளது' : 'இல்லை'}</span> — {e.textTa}</li>)}
                </ul>
              )}
            </section>
          )}
        </>
      )}

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <button type="button" onClick={() => setShowTable(!showTable)} className="font-semibold text-ink underline">{showTable ? '249 உபங்களின் அட்டவணையை மூடு' : '249 உபங்களின் அட்டவணையைக் காட்டு (நூல் ப.89-106)'}</button>
        {showTable && tables && (
          <div className="overflow-x-auto mt-2 max-h-96 overflow-y-auto">
            <table className="w-full text-xs" style={num}>
              <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">எண்</th><th className="pr-2">ராசி</th><th className="pr-2">ராசி அதிபதி</th><th className="pr-2">நட்சத்திர அதிபதி</th><th className="pr-2">உப அதிபதி</th><th className="pr-2">முதல்</th><th>வரை</th></tr></thead>
              <tbody>{tables.subs.map((s: any) => <tr key={s.number} className="border-t border-line/40"><td className="py-0.5 pr-2">{s.number}</td><td className="pr-2">{SIGN_TA[s.sign]}</td><td className="pr-2">{pt(s.signLord)}</td><td className="pr-2">{pt(s.starLord)}</td><td className="pr-2">{pt(s.subLord)}</td><td className="pr-2">{dms(s.from)}</td><td>{dms(s.to, true)}</td></tr>)}</tbody>
            </table>
          </div>
        )}
        <p className="text-[11px] text-ink-soft mt-2">கணக்கிடப்பட்ட அட்டவணை நூலின் அட்டவணையுடன் ஒப்பிடப்பட்டது: எண் 10-41 பக்கப் படத்தில்; மற்றவை நூலின் உரை அடுக்கில் (243 மதிப்புகளில் 207 நேரடியாகப் பொருந்தின, மீதி எழுத்துணர்வுப் பிழைகள்). நூலின் சுமார் 110 கேள்விகளில் வீடுகளை உரையில் சொல்பவை (74) சேர்க்கப்பட்டுள்ளன; மற்றவை (உறவினரின் லக்னத்திலிருந்து எண்ணுபவை போன்ற சிக்கலானவை) இல்லை.</p>
      </section>
    </main>
  );
}
