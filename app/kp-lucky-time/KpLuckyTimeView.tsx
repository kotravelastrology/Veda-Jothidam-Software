'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeKpLuckyTime, loadKpLuckyTopics } from './actions';
import { citeTa } from '@/src/sources/citeTa';
import { RASI_TA as SIGN_TA } from '@/src/sources/tamilNames';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/**
 * KP lucky timings (Reader V, K.S. Krishnamurti, printed pp.219-234): for a matter the book names the houses to take (and sometimes to avoid); the planets that signify them
 * give the period (a dasa-bhukti-anthra of such planets), the day and hours (the Moon in the star and sub of such planets) and the minute (the ascendant in a sign, star and sub of
 * such planets). The page lists these conditions for the chart; it does not say that the matter will succeed.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const pt = (x: string) => PLANET_TA[x] ?? x;
const pad = (n: number) => String(n).padStart(2, '0');
const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';
const when = (c: any) => (c ? `${c.text}${c.dayOffset ? ` (+${c.dayOffset} நாள்)` : ''}` : '…');

function dms(lon: number) {
  const norm = ((lon % 360) + 360) % 360;
  const t = Math.round((norm % 30) * 3600);
  return `${SIGN_TA[Math.floor(norm / 30)]} ${Math.floor(t / 3600)}°${pad(Math.floor((t % 3600) / 60))}′${pad(t % 60)}″`;
}
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function KpLuckyTimeView() {
  const [tables, setTables] = useState<any>(null);
  const [party, setParty] = useState<Party | null>(null);
  const [topicId, setTopicId] = useState('COURT_FILING');
  const [date, setDate] = useState(today());
  const [periodYears, setPeriodYears] = useState('5');
  const [here, setHere] = useState({ use: false, latitude: '13.0827', longitude: '80.2707', offset: '330' });
  const [onlyBoth, setOnlyBoth] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadKpLuckyTopics().then(setTables).catch(() => undefined); }, []);
  const topic = tables?.topics.find((t: any) => t.id === topicId);

  const run = async () => {
    if (!party) return;
    setLoading(true); setError(null);
    try {
      const [year, month, day] = date.split('-').map(Number);
      setResult(await computeKpLuckyTime({
        ...(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input }),
        topicId, on: { year, month, day }, periodDays: Math.round(parseFloat(periodYears) * 365.25),
        ...(here.use ? { place: { latitude: parseFloat(here.latitude), longitude: parseFloat(here.longitude), utcOffsetMinutes: parseInt(here.offset, 10) } } : {}),
      }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } finally { setLoading(false); }
  };

  const asc = result?.ascendant ? result.ascendant.filter((a: any) => !onlyBoth || !result.moon || a.withinMoonWindow) : null;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="KP · Reader V · lucky timings" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">KP நல்ல நேரம் — தொடங்க வேண்டிய தருணம்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒரு செயலுக்கு நூல் சொல்லும் வீடுகளைக் குறிக்கும் கிரகங்களே (நூல் தவிர்க்கச் சொல்லும் வீடுகளைக் குறிக்காதவை) காலத்தைத் தருகின்றன: தசை-புக்தி-அந்தரம் அவர்களாக இருக்கும் காலம்; சந்திரன் அவர்களின் நட்சத்திரம்-உபத்தில் செல்லும் நாளும் மணிகளும்;
          லக்னம் அவர்களின் ராசி-நட்சத்திரம்-உபத்தில் எழும் நிமிடங்கள் (நூல் ப.219-234). இங்கு இந்த நிபந்தனைகள் மட்டும் பட்டியலிடப்படுகின்றன; செயல் வெற்றி பெறும் என்று சொல்வதில்லை — நூலே "ஜாதகம் அனுமதித்தால் மட்டும்" என்கிறது.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); setResult(null); }} loading={loading} />

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-3 items-end text-xs text-ink-soft">
          <label>செயல்<br />
            <select className={`${field} w-80`} value={topicId} onChange={(e) => { setTopicId(e.target.value); setResult(null); }}>
              {tables?.topics.map((t: any) => <option key={t.id} value={t.id}>ப.{t.page} · {t.titleTa} ({t.take.join(',')}{t.avoid.length ? ` ✕${t.avoid.join(',')}` : ''})</option>)}
            </select>
          </label>
          <label>நாள் (சந்திரன், லக்னம்)<br /><input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label>தசை-புக்தி காலம் (ஆண்டு)<br /><input className={`${field} w-16`} value={periodYears} onChange={(e) => setPeriodYears(e.target.value)} /></label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={here.use} onChange={(e) => setHere({ ...here, use: e.target.checked })} />லக்னத்துக்கு வேறு இடம் (இல்லையேல் பிறந்த ஊர்)</label>
          {here.use && (<>
            <label>அட்சம்<br /><input className={`${field} w-24`} value={here.latitude} onChange={(e) => setHere({ ...here, latitude: e.target.value })} /></label>
            <label>தீர்க்கம்<br /><input className={`${field} w-24`} value={here.longitude} onChange={(e) => setHere({ ...here, longitude: e.target.value })} /></label>
            <label>மண்டலம் (நிமிடம்)<br /><input className={`${field} w-20`} value={here.offset} onChange={(e) => setHere({ ...here, offset: e.target.value })} /></label>
          </>)}
          <button type="button" onClick={run} disabled={!party || loading} className="px-4 py-1.5 rounded bg-saffron text-ink text-sm disabled:opacity-50">{loading ? 'கணக்கிடுகிறது…' : 'கணக்கிடு'}</button>
        </div>
        {topic?.noteTa && <p className="text-xs text-ink mt-2">நூல் குறிப்பு: {topic.noteTa}</p>}
        {!party && <p className="text-[11px] text-ink-soft mt-2">முதலில் மேலே யாருடைய ஜாதகம் என்பதைத் தேர்வு செய்யுங்கள். (நன்கொடை கேட்பதற்கு கொடுப்பவரின் ஜாதகத்தை எடுக்க.)</p>}
        {error && <p className="text-rose text-sm mt-2">⚠️ {error}</p>}
      </section>

      {result && (
        <>
          <p className="text-xs text-ink-soft mb-3">{result.native?.name ?? ''} · {citeTa(result.source)}</p>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">{result.topic.titleTa} — வீடுகள் {result.topic.take.join(', ')}{result.topic.avoid.length ? `; தவிர்க்க ${result.topic.avoid.join(', ')}` : ''} (ப.{result.topic.page})</h2>
            <p className="text-xs text-ink-soft mb-1">தகுதியுள்ள கிரகங்கள் (குறிக்கும் வீடுகள்):</p>
            <p className="text-sm text-ink" style={num}>{result.eligible.length ? result.eligible.map((e: any) => `${pt(e.name)} (${e.houses.join(',')})`).join(' · ') : 'எந்தக் கிரகமும் இல்லை.'}</p>
          </section>

          {result.periods && (
            <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="font-semibold text-ink mb-1">தசை-புக்தி-அந்தரம் மூவரும் தகுதியுள்ளவர் (இந்தக் காலத்தில்)</h2>
              {result.periods.length === 0 ? <p className="text-xs text-ink-soft">இந்தக் காலத்தில் இல்லை — காலத்தை நீட்டிக் காணலாம்.</p> : (
                <table className="w-full text-xs" style={num}>
                  <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">தசை · புக்தி · அந்தரம்</th><th>முதல் – வரை</th></tr></thead>
                  <tbody>{result.periods.slice(0, 80).map((p: any, i: number) => <tr key={i} className="border-t border-line/40"><td className="py-0.5 pr-2">{p.lords.map(pt).join(' · ')}</td><td>{p.from} – {p.to}</td></tr>)}</tbody>
                </table>
              )}
            </section>
          )}

          {result.moon && (
            <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="font-semibold text-ink mb-1">அந்த நாளில் சந்திரன் தகுதியுள்ளவரின் நட்சத்திரம்-உபத்தில்</h2>
              {result.moon.length === 0 ? <p className="text-xs text-ink-soft">அந்த நாளில் இல்லை.</p> : (
                <table className="w-full text-xs" style={num}>
                  <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">நட்சத்திர அதிபதி · உப அதிபதி</th><th>எப்போது</th></tr></thead>
                  <tbody>{result.moon.map((m: any, i: number) => <tr key={i} className="border-t border-line/40"><td className="py-0.5 pr-2">{pt(m.starLord)} · {pt(m.subLord)}</td><td>{when(m.start)} – {when(m.end)}</td></tr>)}</tbody>
                </table>
              )}
            </section>
          )}

          {asc && (
            <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="font-semibold text-ink mb-1">அந்த நாளில் லக்னம் தகுதியுள்ளவரின் ராசி-நட்சத்திரம்-உபத்தில்</h2>
              {result.moon && <label className="flex items-center gap-1 text-xs text-ink-soft mb-2"><input type="checkbox" checked={onlyBoth} onChange={(e) => setOnlyBoth(e.target.checked)} />சந்திரனின் தகுதி நேரத்துக்குள் வருபவை மட்டும்</label>}
              {asc.length === 0 ? <p className="text-xs text-ink-soft">அத்தகைய நிமிடங்கள் இல்லை.</p> : (
                <table className="w-full text-xs" style={num}>
                  <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">ராசி · நட்சத்திரம் · உப</th><th className="pr-2">தொடக்கம்</th><th>எப்போது</th></tr></thead>
                  <tbody>{asc.slice(0, 80).map((a: any, i: number) => <tr key={i} className="border-t border-line/40"><td className="py-0.5 pr-2">{[a.signLord, a.starLord, a.subLord].map(pt).join(' · ')}</td><td className="pr-2">{dms(a.from)}</td><td>{when(a.start)} – {when(a.end)}</td></tr>)}</tbody>
                </table>
              )}
            </section>
          )}
          <p className="text-[11px] text-ink-soft">நூல்: இதே நேரம் மற்றவருக்கும் நல்லதாகாது — அவரவர் ஜாதகத்தின் குறிகாட்டிகளே (ப.229).</p>
        </>
      )}
    </main>
  );
}
