'use client';

import { useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeKpTransit } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * KP transit (Reader V, K.S. Krishnamurti): the stars with the houses their lords signify in this chart; the reading of the transiting planets (the star lord's houses are the matter,
 * the planet's own houses the source, the sub lord's houses the outcome); and the sensitive points of the running dasa, bhukti and anthra with the instants the Sun, the Moon and the ascendant
 * reach them. Nothing is predicted.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const SIGN_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const pt = (x: string) => PLANET_TA[x] ?? x;
const pad = (n: number) => String(n).padStart(2, '0');
const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';
const nums = (l: number[]) => (l && l.length ? l.join(', ') : '—');

function dms(lon: number, boundary = false) {
  const x = ((lon % 360) + 360) % 360;
  let t = Math.round((x % 30) * 3600);
  if (boundary && t === 0) t = 108000;
  return `${Math.floor(t / 3600)}°${pad(Math.floor((t % 3600) / 60))}′${pad(t % 60)}″`;
}
const signOf = (lon: number) => SIGN_TA[Math.floor((((lon % 360) + 360) % 360) / 30)];
function when(jd: number, offsetMinutes: number) {
  const d = new Date((jd - 2440587.5) * 86400000 + offsetMinutes * 60000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}
function nowParts() {
  const d = new Date();
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}

export default function KpTransitView() {
  const [party, setParty] = useState<Party | null>(null);
  const [on, setOn] = useState(nowParts());
  const [days, setDays] = useState('30');
  const [here, setHere] = useState({ use: false, latitude: '13.0827', longitude: '80.2707', offset: '330' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!party) return;
    setLoading(true); setError(null);
    try {
      const [year, month, day] = on.date.split('-').map(Number);
      const [hour, minute] = on.time.split(':').map(Number);
      setResult(await computeKpTransit({
        ...(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input }),
        on: { year, month, day, hour, minute }, days: parseInt(days, 10),
        ...(here.use ? { place: { latitude: parseFloat(here.latitude), longitude: parseFloat(here.longitude), utcOffsetMinutes: parseInt(here.offset, 10) } } : {}),
      }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } finally { setLoading(false); }
  };
  const off = result?.place?.utcOffsetMinutes ?? 0;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">KP transit · Reader V</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">KP கோசாரம் — கோசாரபல நிர்ணயம்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          நட்சத்திர அதிபதி ஜாதகத்தில் குறிக்கும் வீடுகளே கோசாரத்தில் அந்த நட்சத்திரத்தில் செல்லும் கிரகம் தரும் விஷயம்; செல்லும் கிரகத்தின் சொந்த வீடுகள் அது வரும் வழி; உப அதிபதியின் வீடுகள் அது நிறைவேறுமா என்பதைக் காட்டும் (நூல் ப.157-161).
          நடக்கும் தசை-புக்தி-அந்தர அதிபதிகள் மூவரும் ராசி-நட்சத்திர-உப அதிபதிகளாக அமையும் இடங்களே உணர்திறன் புள்ளிகள்; அவற்றை சூரியன், சந்திரன், லக்னம் கடக்கும் நேரங்கள் (ப.161-163). தீர்ப்பு இல்லை.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); setResult(null); }} loading={loading} />

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-3 items-end text-xs text-ink-soft">
          <label>தேதி<br /><input type="date" className={field} value={on.date} onChange={(e) => setOn({ ...on, date: e.target.value })} /></label>
          <label>நேரம்<br /><input type="time" className={field} value={on.time} onChange={(e) => setOn({ ...on, time: e.target.value })} /></label>
          <label>நாட்கள் (சூரிய, சந்திர நுழைவு)<br /><input className={`${field} w-16`} value={days} onChange={(e) => setDays(e.target.value)} /></label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={here.use} onChange={(e) => setHere({ ...here, use: e.target.checked })} />லக்னத்துக்கு வேறு இடம் (இல்லையேல் பிறந்த ஊர்)</label>
          {here.use && (<>
            <label>அட்சம்<br /><input className={`${field} w-24`} value={here.latitude} onChange={(e) => setHere({ ...here, latitude: e.target.value })} /></label>
            <label>தீர்க்கம்<br /><input className={`${field} w-24`} value={here.longitude} onChange={(e) => setHere({ ...here, longitude: e.target.value })} /></label>
            <label>நேர மண்டலம் (நிமிடம்)<br /><input className={`${field} w-20`} value={here.offset} onChange={(e) => setHere({ ...here, offset: e.target.value })} /></label>
          </>)}
          <button type="button" onClick={run} disabled={!party || loading} className="px-4 py-1.5 rounded bg-saffron text-ink text-sm disabled:opacity-50">{loading ? 'கணக்கிடுகிறது…' : 'கணக்கிடு'}</button>
        </div>
        {!party && <p className="text-[11px] text-ink-soft mt-2">முதலில் மேலே யாருடைய ஜாதகம் என்பதைத் தேர்வு செய்யுங்கள்.</p>}
        {error && <p className="text-rose text-sm mt-2">⚠️ {error}</p>}
        <p className="text-[11px] text-ink-soft mt-2">நூல்: லக்னத்தை எப்போதும் பிறந்த ஊருக்குக் கணக்கிடக் கூடாது; ஜாதகர் இப்போது இருக்கும் ஊருக்கே (ப.162).</p>
      </section>

      {result && (
        <>
          <p className="text-xs text-ink-soft mb-3">{result.native?.name ?? ''} · {citeTa(result.source)}</p>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">கோசாரக் கிரகங்கள் — விஷயம், வழி, முடிவு</h2>
            <p className="text-xs text-ink-soft mb-2">{result.positionsNote}. விஷயம் = நட்சத்திர அதிபதி குறிக்கும் வீடுகள்; வழி = கிரகம் தானே குறிக்கும் வீடுகள்; முடிவு = உப அதிபதி குறிக்கும் வீடுகள்.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={num}>
                <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">கிரகம்</th><th className="pr-2">தீர்க்கம்</th><th className="pr-2">நட்சத்திர அதிபதி</th><th className="pr-2">உப அதிபதி</th><th className="pr-2">விஷயம்</th><th className="pr-2">வழி</th><th>முடிவு</th></tr></thead>
                <tbody>
                  {result.reading.map((r: any) => (
                    <tr key={r.planet} className="border-t border-line/40">
                      <td className="py-0.5 pr-2">{pt(r.planet)}</td><td className="pr-2">{SIGN_TA[SIGN_EN.indexOf(r.sign)]} {dms(r.longitude)}</td><td className="pr-2">{pt(r.starLord)}</td><td className="pr-2">{pt(r.subLord)}</td>
                      <td className="pr-2">{nums(r.matterHouses)}</td><td className="pr-2">{nums(r.sourceHouses)}</td><td>{nums(r.subHouses)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">நடக்கும் தசை-புக்தி-அந்தரம்: {result.dba.map(pt).join(' – ')}</h2>
            <p className="text-xs text-ink-soft mb-2">ராசி, நட்சத்திரம், உப அதிபதிகள் இவர்களே (எந்த வரிசையிலும்) அமையும் இடங்கள் (ப.161-163). நட்சத்திரம்-உபம்-உப-உபம் என்று படிப்பதற்கான {result.points.byStarCount} புள்ளிகளும் உண்டு. ராகு/கேதுவுக்கு அவர்களுடன் சேர்ந்த கிரகம், நிற்கும் நட்சத்திர அதிபதி, அல்லது ராசி அதிபதி பலன் தரும் என்று நூல் சொல்கிறது.</p>
            <table className="w-full text-xs mb-3" style={num}>
              <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">ராசி</th><th className="pr-2">ராசி-நட்சத்திர-உப அதிபதிகள்</th><th>முதல் – வரை</th></tr></thead>
              <tbody>
                {result.points.byLords.map((r: any) => (
                  <tr key={r.number} className="border-t border-line/40"><td className="py-0.5 pr-2">{SIGN_TA[r.sign]}</td><td className="pr-2">{pt(r.signLord)} · {pt(r.starLord)} · {pt(r.subLord)}</td><td>{dms(r.from)} – {dms(r.to, true)}</td></tr>
                ))}
                {result.points.byLords.length === 0 && <tr><td colSpan={3} className="py-1 text-ink-soft">இந்த மூன்று அதிபதிகளுக்கு இத்தகைய புள்ளி இல்லை.</td></tr>}
              </tbody>
            </table>
            {result.windows.map((w: any) => (
              <div key={w.body} className="mb-2">
                <h3 className="text-xs font-semibold text-ink mb-1">{pt(w.body)} இந்தப் புள்ளிகளுக்குள் வரும் நேரங்கள்</h3>
                <p className="text-xs text-ink-soft" style={num}>{w.entries.length ? w.entries.map((e: any) => `${when(e.enterJd, off)} → ${e.leaveJd ? when(e.leaveJd, off).slice(11) : '…'} (${dms(e.point.from)})`).join(' · ') : 'இந்தக் காலத்தில் இல்லை'}</p>
              </div>
            ))}
            <h3 className="text-xs font-semibold text-ink mb-1">லக்னம் ({result.place.placeName ?? 'பிறந்த ஊர்'}) இந்தப் புள்ளிகளின் தொடக்கத்தை அடையும் நேரம், அடுத்த 24 மணி</h3>
            <p className="text-xs text-ink-soft" style={num}>{result.ascendant.length ? result.ascendant.map((a: any) => `${when(a.jd, off)} (${SIGN_TA[a.point.sign]} ${dms(a.point.from)})`).join(' · ') : '—'}</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">நட்சத்திரங்களின் குறிப்பு அட்டவணை (நூல் ப.156-160)</h2>
            <p className="text-xs text-ink-soft mb-2">ஒவ்வொரு நட்சத்திரத்துக்கும் அதன் அதிபதி இந்த ஜாதகத்தில் குறிக்கும் வீடுகள்; எந்த கிரகம் அந்த நட்சத்திரத்தில் கோசாரத்தில் சென்றாலும் அந்த விஷயங்களைத் தரும்.</p>
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-xs" style={num}>
                <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">எண்</th><th className="pr-2">நட்சத்திரம்</th><th className="pr-2">முதல் – வரை</th><th className="pr-2">அதிபதி</th><th>குறிக்கும் வீடுகள்</th></tr></thead>
                <tbody>
                  {result.reckoner.map((s: any) => (
                    <tr key={s.number} className="border-t border-line/40"><td className="py-0.5 pr-2">{s.number}</td><td className="pr-2">{s.name}</td><td className="pr-2">{signOf(s.from)} {dms(s.from)} – {dms(s.to, true)}</td><td className="pr-2">{pt(s.lord)}</td><td>{nums(s.houses)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
