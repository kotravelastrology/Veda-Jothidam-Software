'use client';

import { useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { VedicChartBox } from '@/src/charts/kattam/VedicChartBox';
import { fromParashariChart } from '@/src/charts/kattam/rasiNames';
import { computeEvents, type EventInput } from './actions';

/**
 * PL9's event worksheets: any moment set against the birth chart. Every event shows its own chart, the Kakshas of its planets over the
 * birth Ashtakavarga (by sign), gochara facts (Tara, Chandra, tithi, yoga, karana), the dashas running at that moment from the birth
 * chart, and the Vimshopaka of the event chart. Nothing is a verdict; PL9's one-line glosses are not used because no source is held for them.
 */

const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது', Lagna: 'லக்னம்' };
const LEVEL_TA: Record<string, string> = { Dasha: 'தசை', Bhukti: 'புக்தி', Antara: 'அந்தரம்', Sookshma: 'சூக்ஷ்மம்', Prana: 'பிராணன்' };
const TITHI_TA: Record<string, string> = { SHUKLA: 'சுக்ல', KRISHNA: 'கிருஷ்ண' };
const num = { fontVariantNumeric: 'tabular-nums' as const };

const pad = (n: number) => String(n).padStart(2, '0');
const nowParts = () => { const d = new Date(); return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` }; };

export default function EventsView() {
  const [party, setParty] = useState<Party | null>(null);
  const [form, setForm] = useState({ name: 'நிகழ்வு', ...nowParts(), place: 'சென்னை', latitude: '13.0827', longitude: '80.2707', offset: '330' });
  const [events, setEvents] = useState<EventInput[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (list: EventInput[], who: Party | null = party) => {
    if (!who || list.length === 0) { setResult(null); return; }
    setLoading(true); setError(null);
    try {
      setResult(await computeEvents({ ...(who.kind === 'profile' ? { profile: { profileId: who.profileId, revision: who.revision } } : { form: who.input }), events: list }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } finally { setLoading(false); }
  };
  const add = () => {
    const [year, month, day] = form.date.split('-').map(Number);
    const [hour, minute, second] = form.time.split(':').map(Number);
    const ev: EventInput = { name: form.name || 'நிகழ்வு', year, month, day, hour, minute, second: second || 0, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), utcOffsetMinutes: parseInt(form.offset, 10), placeName: form.place };
    const next = [...events, ev].slice(0, 20);
    setEvents(next); run(next);
  };
  const remove = (i: number) => { const next = events.filter((_, k) => k !== i); setEvents(next); run(next); };
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Events · worksheets 116-123</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">நிகழ்வு ஜாதகங்கள்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒரு தேதி-நேரம்-இடத்தை (நிகழ்வு) ஜன்ம ஜாதகத்துடன் வைத்துப் பார்க்கிறது: நிகழ்வு ஜாதகம், ஜன்ம அஷ்டகவர்க்கத்தில் நிகழ்வு கிரகங்களின் காக்ஷ்யா,
          கோசார விவரங்கள், அந்த நேரத்தில் ஜன்ம ஜாதகத்தின் தசைகள், நிகழ்வு ஜாதகத்தின் விம்சோபகம். இதில் தீர்ப்பு எதுவும் இல்லை.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (x) run(events, x); else setResult(null); }} loading={loading} />

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <h2 className="font-semibold text-ink mb-2">புதிய நிகழ்வு</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="text-xs text-ink-soft">பெயர்<br /><input className={`${field} w-36`} value={form.name} onChange={set('name')} /></label>
          <label className="text-xs text-ink-soft">தேதி<br /><input type="date" className={field} value={form.date} onChange={set('date')} /></label>
          <label className="text-xs text-ink-soft">நேரம்<br /><input type="time" step={1} className={field} value={form.time} onChange={set('time')} /></label>
          <label className="text-xs text-ink-soft">இடம்<br /><input className={`${field} w-32`} value={form.place} onChange={set('place')} /></label>
          <label className="text-xs text-ink-soft">அட்சம்<br /><input className={`${field} w-24`} value={form.latitude} onChange={set('latitude')} /></label>
          <label className="text-xs text-ink-soft">தீர்க்கம்<br /><input className={`${field} w-24`} value={form.longitude} onChange={set('longitude')} /></label>
          <label className="text-xs text-ink-soft">நேர மண்டலம் (நிமிடம்)<br /><input className={`${field} w-20`} value={form.offset} onChange={set('offset')} /></label>
          <button type="button" onClick={add} disabled={!party || loading || events.length >= 20} className="px-3 py-1.5 rounded bg-saffron text-ink text-sm disabled:opacity-50">நிகழ்வைச் சேர்</button>
        </div>
        {!party && <p className="text-[11px] text-ink-soft mt-2">முதலில் மேலே யாருடைய ஜாதகம் என்பதைத் தேர்வு செய்யுங்கள்.</p>}
        {events.length > 0 && (
          <ul className="mt-3 text-xs flex flex-wrap gap-2">
            {events.map((e, i) => (
              <li key={i} className="border border-line rounded px-2 py-1 bg-surface-2">
                {e.name} · {e.year}-{pad(e.month)}-{pad(e.day)} {pad(e.hour)}:{pad(e.minute)}
                <button type="button" onClick={() => remove(i)} className="ml-2 text-rose">✕</button>
              </li>
            ))}
          </ul>
        )}
        {error && <p className="text-rose text-sm mt-2">⚠️ {error}</p>}
      </section>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {result && result.events.map((ev: any, i: number) => <EventCard key={i} ev={ev} native={result.native} />)}
    </main>
  );
}

function Houses({ rows, title }: { rows: any[]; title: string }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-ink mb-1">{title}</h4>
      <div className="grid grid-cols-4 gap-1 text-[11px]">
        {rows.map((h) => (
          <div key={h.house} className="border border-line rounded p-1 bg-surface-2">
            <div className="text-ink-soft">{h.house} · {SIGN_TA[h.sign]}</div>
            <div className="text-ink min-h-[1rem]">{h.planets.map((p: string) => PLANET_TA[p]).join(', ') || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventCard({ ev, native }: { ev: any; native: any }) {
  const g = ev.gochara;
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="font-semibold text-ink">{ev.name} — {ev.event.year}-{pad(ev.event.month)}-{pad(ev.event.day)} {pad(ev.event.hour)}:{pad(ev.event.minute)} · {ev.placeName || '—'}</h2>
      <p className="text-xs text-ink-soft mb-3">{native.name ?? '(பெயர் இல்லை)'} ஜாதகத்துடன் · {ev.event.ayanamsha} அயனாம்சம்</p>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="flex justify-center"><VedicChartBox {...fromParashariChart(ev.raw.chart)} title="நிகழ்வு ராசி கட்டம்" size={280} /></div>
        <Houses rows={ev.chart.fromLagna} title={`லக்னத்திலிருந்து (லக்னம் ${SIGN_TA[ev.chart.lagnaSign]})`} />
        <Houses rows={ev.chart.fromMoon} title={`சந்திரனிலிருந்து (${SIGN_TA[ev.chart.moonSign]})`} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold text-ink mb-1">காக்ஷ்யா — ஜன்ம அஷ்டகவர்க்கத்தில் (ராசி வகை)</h3>
          <table className="w-full text-xs" style={num}>
            <thead><tr className="text-left text-ink-soft"><th>கிரகம்</th><th>ராசி</th><th>காக்ஷ்யா</th><th>அதிபதி</th><th>பிந்து</th><th>பின்ன</th><th>சர்வ</th></tr></thead>
            <tbody>
              {ev.kakshas.map((k: any) => (
                <tr key={k.planet} className="border-t border-line/40">
                  <td className="py-0.5">{PLANET_TA[k.planet]}</td><td>{SIGN_TA[k.sign]}</td><td>{k.kakshya}</td><td>{PLANET_TA[k.lord]}</td>
                  <td className={k.bindu ? 'text-teal' : 'text-rose'}>{k.bindu ? '1' : '0'}</td><td>{k.bhinna}</td><td>{k.sarva}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-ink mb-1">கோசார விவரங்கள்</h3>
          <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-0.5 text-xs">
            <dt className="text-ink-soft">தாரை</dt><dd>{g.tara.nameTa} (ஜென்ம நட்சத்திரத்திலிருந்து {g.tara.count}-ஆவது)</dd>
            <dt className="text-ink-soft">சந்திரன்</dt><dd>ஜென்ம சந்திரனிலிருந்து {g.chandraFromBirthMoon}-ஆம் ராசி; ஜென்ம லக்னத்திலிருந்து {g.chandraFromBirthLagna}-ஆம்</dd>
            <dt className="text-ink-soft">திதி</dt><dd>{TITHI_TA[g.tithi.paksha]} {g.tithi.name}</dd>
            <dt className="text-ink-soft">நட்சத்திரம்</dt><dd>{g.nakshatra.name}</dd>
            <dt className="text-ink-soft">யோகம்</dt><dd>{g.yoga.name}</dd>
            <dt className="text-ink-soft">கரணம்</dt><dd>{g.karana.name}</dd>
          </dl>
          <p className="text-[11px] text-ink-soft mt-1">தாரை, சந்திர பலனுக்கான விதிகள், தீர்ப்புகள் <a className="underline" href="/muhurta-stars">/muhurta-stars</a> பக்கத்தில் நூல் ஆதாரத்துடன்.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <h3 className="text-xs font-semibold text-ink mb-1">அந்த நேரத்தில் ஓடும் தசைகள் (ஜன்ம ஜாதகத்திலிருந்து)</h3>
          <table className="w-full text-xs" style={num}>
            <tbody>
              {ev.dashas.vimshottari.map((d: any) => (
                <tr key={d.level} className="border-t border-line/40"><td className="py-0.5 pr-2 text-ink-soft">விம்சோத்தரி {LEVEL_TA[d.level]}</td><td className="pr-2">{PLANET_TA[d.lord]}</td><td className="text-ink-soft">{d.startLocal} → {d.endLocal}</td></tr>
              ))}
              {ev.dashas.yogini && <tr className="border-t border-line/40"><td className="py-0.5 pr-2 text-ink-soft">யோகினி</td><td className="pr-2">{ev.dashas.yogini.yoginiTa} ({PLANET_TA[ev.dashas.yogini.lord]})</td><td className="text-ink-soft">{ev.dashas.yogini.start} → {ev.dashas.yogini.end}</td></tr>}
              {ev.dashas.ashtottari && <tr className="border-t border-line/40"><td className="py-0.5 pr-2 text-ink-soft">அஷ்டோத்தரி</td><td className="pr-2">{PLANET_TA[ev.dashas.ashtottari.lord]}</td><td className="text-ink-soft">{ev.dashas.ashtottari.start} → {ev.dashas.ashtottari.end}</td></tr>}
              {ev.dashas.chara && <tr className="border-t border-line/40"><td className="py-0.5 pr-2 text-ink-soft">சர தசை (லக்னம்)</td><td className="pr-2">{SIGN_TA[ev.dashas.chara.sign]}</td><td className="text-ink-soft">{new Date(ev.dashas.chara.startMs).toISOString().slice(0, 10)} → {new Date(ev.dashas.chara.endMs).toISOString().slice(0, 10)}</td></tr>}
              {ev.dashas.sthira && <tr className="border-t border-line/40"><td className="py-0.5 pr-2 text-ink-soft">ஸ்திர தசை (லக்னம்)</td><td className="pr-2">{SIGN_TA[ev.dashas.sthira.sign]}</td><td className="text-ink-soft">{new Date(ev.dashas.sthira.startMs).toISOString().slice(0, 10)} → {new Date(ev.dashas.sthira.endMs).toISOString().slice(0, 10)}</td></tr>}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-ink mb-1">நிகழ்வு ஜாதகத்தின் விம்சோபகம் ({ev.vimshopaka.scheme === 'shadvarga' ? 'ஷட்வர்க்கம்' : ev.vimshopaka.scheme})</h3>
          <ul className="grid grid-cols-2 gap-x-3 text-xs" style={num}>
            {ev.vimshopaka.planets.map((p: any) => <li key={p.planet}>{PLANET_TA[p.planet]}: {p.total.toFixed(1)} <span className="text-ink-soft">({p.reading?.ta})</span></li>)}
          </ul>
          <p className="text-[11px] text-ink-soft mt-1">ஷட்பலம்: முழுக்கூட்டுக்கு ஆதாரம் இல்லை (அயன பலம்); அதன் பகுதிகள் அறிக்கையின் "கிரக பலம்" பகுதியில்.</p>
        </div>
      </div>
    </section>
  );
}
