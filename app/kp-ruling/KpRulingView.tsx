'use client';

import { useState } from 'react';
import { computeKpRuling, type KpRulingMode } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * KP ruling planets (K.S. Krishnamurti, Reader VI printed pp.123-142): the ruling planets of the moment of judgment, the zodiac positions whose sign, star, sub (and sub-sub) lords
 * are all among them, and when the ascendant (minutes, hours), the Moon (days), the Sun (months) or Jupiter (years) reaches them; or, for a birth time, the positions that rose within
 * the window the birth is known to lie in. The book's further conditions (significators of the houses of the matter) are on /kp-horary; nothing here is an answer.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const FACTOR_TA: Record<string, string> = { 'Day Lord': 'நாள் அதிபதி', 'Moon Sign Lord': 'சந்திர ராசி அதிபதி', 'Moon Star Lord': 'சந்திர நட்சத்திர அதிபதி', 'Asc Sign Lord': 'லக்ன ராசி அதிபதி', 'Asc Star Lord': 'லக்ன நட்சத்திர அதிபதி' };
const MODES: [KpRulingMode, string, string][] = [
  ['ASCENDANT', 'லக்னம் — நிமிடங்கள் / மணிகள்', 'மணி'],
  ['MOON', 'சந்திரன் — நாட்கள் (ஒரு மாதத்துக்குள்)', 'நாள்'],
  ['SUN', 'சூரியன் — மாதங்கள்', 'நாள்'],
  ['JUPITER', 'குரு — ஆண்டுகள்', 'நாள்'],
  ['BIRTH', 'பிறந்த நேரம் — நேர வரம்புக்குள்', ''],
];
const pt = (x: string) => PLANET_TA[x] ?? x;
const pad = (n: number) => String(n).padStart(2, '0');
const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';

function dms(lon: number) {
  const norm = ((lon % 360) + 360) % 360;
  const t = Math.round((norm % 30) * 3600);
  return `${SIGN_TA[Math.floor(norm / 30)]} ${Math.floor(t / 3600)}°${pad(Math.floor((t % 3600) / 60))}′${pad(t % 60)}″`;
}
const when = (c: any) => (c ? `${c.text}${c.dayOffset ? ` (+${c.dayOffset} நாள்)` : ''}` : '…');

function nowParts() {
  const d = new Date();
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}

export default function KpRulingView() {
  const [form, setForm] = useState({ ...nowParts(), latitude: '13.0827', longitude: '80.2707', offset: '330', mode: 'ASCENDANT' as KpRulingMode, span: '6', reject: false,
    bDate: '1990-01-01', bFrom: '04:30', bTo: '05:30', bLat: '13.0827', bLon: '80.2707', bOffset: '330' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const mode = MODES.find((m) => m[0] === form.mode)!;

  const onMode = (e: any) => {
    const m = e.target.value as KpRulingMode;
    setForm({ ...form, mode: m, span: m === 'ASCENDANT' ? '6' : m === 'MOON' ? '30' : m === 'SUN' ? '365' : '1460' });
  };

  const run = async () => {
    setLoading(true); setError(null);
    try {
      const [year, month, day] = form.date.split('-').map(Number);
      const [hour, minute] = form.time.split(':').map(Number);
      const [by, bm, bd] = form.bDate.split('-').map(Number);
      const [fh, fm] = form.bFrom.split(':').map(Number);
      const [th, tm] = form.bTo.split(':').map(Number);
      setResult(await computeKpRuling({
        year, month, day, hour, minute, utcOffsetMinutes: parseInt(form.offset, 10), latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude),
        mode: form.mode, span: parseFloat(form.span), rejectRetrogradeStar: form.reject,
        birth: form.mode === 'BIRTH' ? { year: by, month: bm, day: bd, fromHour: fh, fromMinute: fm, toHour: th, toMinute: tm, utcOffsetMinutes: parseInt(form.bOffset, 10), latitude: parseFloat(form.bLat), longitude: parseFloat(form.bLon) } : undefined,
      }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } finally { setLoading(false); }
  };

  const table = (title: string, rows: any[], withSubSub: boolean) => (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="font-semibold text-ink mb-1">{title}</h2>
      {rows.length === 0 ? <p className="text-xs text-ink-soft">இந்தக் காலத்தில் அத்தகைய புள்ளி இல்லை.</p> : (
        <table className="w-full text-xs" style={num}>
          <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">{withSubSub ? 'ராசி · நட்சத்திரம் · உப · உப-உப' : 'ராசி · நட்சத்திரம் · உப'}</th><th className="pr-2">தொடக்கம்</th><th>எப்போது</th></tr></thead>
          <tbody>
            {rows.slice(0, 80).map((r: any, i: number) => (
              <tr key={i} className="border-t border-line/40">
                <td className="py-0.5 pr-2">{[r.signLord, r.starLord, r.subLord, withSubSub ? r.subSubLord : null].filter(Boolean).map(pt).join(' · ')}</td>
                <td className="pr-2">{dms(r.from)}</td>
                <td>{r.times.map((t: any) => `${when(t.start)} – ${when(t.end)}`).join('; ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">KP · Reader VI · ruling planets</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஆளும் கிரகங்கள் — நேரம் காணுதல்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          தீர்ப்பு நேரத்தின் ஆளும் கிரகங்களையே ராசி, நட்சத்திரம், உப அதிபதிகளாகக் கொண்ட இராசிப் புள்ளியை, நிகழ்வின் கால அளவுக்கேற்ப லக்னம் / சந்திரன் / சூரியன் / குரு எப்போது அடைகிறது என்று நூல் (ப.123-142) பார்க்கிறது.
          பிறந்த நேரம் தெரியாதபோது, தெரிந்த நேர வரம்புக்குள் எந்த லக்னப் புள்ளிகள் எழுந்தன என்றும் இதே முறையால் காணலாம். பதில் அல்ல; புள்ளிகளையும் நேரங்களையும் மட்டும் காட்டுகிறது.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-3 items-end text-xs text-ink-soft">
          <label>தீர்ப்பு தேதி<br /><input type="date" className={field} value={form.date} onChange={set('date')} /></label>
          <label>நேரம்<br /><input type="time" className={field} value={form.time} onChange={set('time')} /></label>
          <label>அட்சம்<br /><input className={`${field} w-24`} value={form.latitude} onChange={set('latitude')} /></label>
          <label>தீர்க்கம்<br /><input className={`${field} w-24`} value={form.longitude} onChange={set('longitude')} /></label>
          <label>மண்டலம் (நிமிடம்)<br /><input className={`${field} w-20`} value={form.offset} onChange={set('offset')} /></label>
          <label>எது நகர்கிறது<br />
            <select className={`${field} w-64`} value={form.mode} onChange={onMode}>{MODES.map((m) => <option key={m[0]} value={m[0]}>{m[1]}</option>)}</select>
          </label>
          {mode[2] && <label>{mode[2]} (வரம்பு)<br /><input className={`${field} w-20`} value={form.span} onChange={set('span')} /></label>}
          <label className="flex items-center gap-1"><input type="checkbox" checked={form.reject} onChange={set('reject')} /> வக்ர கிரக நட்சத்திரத்தில் நிற்பவரை நீக்கு (ப.123)</label>
        </div>
        {form.mode === 'BIRTH' && (
          <div className="flex flex-wrap gap-3 items-end text-xs text-ink-soft mt-3">
            <label>பிறந்த தேதி<br /><input type="date" className={field} value={form.bDate} onChange={set('bDate')} /></label>
            <label>நேரம் முதல்<br /><input type="time" className={field} value={form.bFrom} onChange={set('bFrom')} /></label>
            <label>நேரம் வரை<br /><input type="time" className={field} value={form.bTo} onChange={set('bTo')} /></label>
            <label>பிறந்த இட அட்சம்<br /><input className={`${field} w-24`} value={form.bLat} onChange={set('bLat')} /></label>
            <label>தீர்க்கம்<br /><input className={`${field} w-24`} value={form.bLon} onChange={set('bLon')} /></label>
            <label>மண்டலம் (நிமிடம்)<br /><input className={`${field} w-20`} value={form.bOffset} onChange={set('bOffset')} /></label>
          </div>
        )}
        <div className="mt-3"><button type="button" onClick={run} disabled={loading} className="px-4 py-1.5 rounded bg-saffron text-ink text-sm disabled:opacity-50">{loading ? 'கணக்கிடுகிறது…' : 'கணக்கிடு'}</button></div>
        {error && <p className="text-rose text-sm mt-2">⚠️ {error}</p>}
      </section>

      {result && (
        <>
          <p className="text-xs text-ink-soft mb-3">{citeTa(result.source)}</p>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">ஆளும் கிரகங்கள் (ப.123)</h2>
            <p className="text-xs text-ink-soft mb-1">{result.ruling.factors.map((f: any) => `${FACTOR_TA[f[0]] ?? f[0]}: ${pt(f[1])}`).join(' · ')}</p>
            <p className="text-sm text-ink">{result.ruling.planets.map((r: any) => `${pt(r.planet)}${r.inRetrogradeStar ? ' ✱' : ''}${r.retrograde ? ' (வக்ரம்)' : ''}`).join(' · ')}</p>
            <p className="text-xs text-ink-soft mt-1">✱ = வக்ர கிரகத்தின் நட்சத்திரத்தில் நிற்பவர் (நூல்: நிராகரிக்க). பயன்படுத்தியவை: {result.used.map(pt).join(', ')}.</p>
          </section>
          {table('உப அதிபதி வரை (ராசி · நட்சத்திரம் · உப)', result.bySub, false)}
          {result.bySubSub.length > 0 && table('உப-உப அதிபதி வரை (துல்லியம்)', result.bySubSub, true)}
          <p className="text-[11px] text-ink-soft">நூலின் நேரங்கள் அட்டவணைக் கணக்கால் வந்தவை; இங்கு துல்லியக் கணக்கு என்பதால் சில நொடிகள் முதல் ஓரிரு நிமிடம் வரை வேறுபடலாம். நூல் மேலும் கேட்கும் நிபந்தனைகளை (கேள்வியின் வீடுகளைக் குறிக்கும் கிரகங்கள்) <a className="underline" href="/kp-horary">KP பிரச்னம்</a> பக்கத்தில் காணலாம்.</p>
        </>
      )}
    </main>
  );
}
