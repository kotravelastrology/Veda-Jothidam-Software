'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { slotRange, eventListRow } from '@/src/report/eventList';
import { VedicChartBox } from '@/src/charts/kattam/VedicChartBox';
import { fromParashariChart } from '@/src/charts/kattam/rasiNames';
import { computeEvents, indianToCivil, type EventInput } from './actions';
import { saveEvent, listSavedEvents, updateSavedEvent, deleteSavedEvent } from '../library/actions';
import { RASI_TA as SIGN_TA } from '@/src/sources/tamilNames';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/** An event on this page; `eventId` is present once it is saved against a profile. */
type Ev = EventInput & { eventId?: string; description?: string };

/**
 * PL9's event worksheets (Events 1-10 and Events 11-20 in the Charts menu: ?range=1-10 and ?range=11-20): a list of the events, one row
 * each, with the dashas of every system running at that moment to five levels, then a card for each of those events. Any moment set
 * against the birth chart. Every event shows its own chart, the Kakshas of its planets over the
 * birth Ashtakavarga (by sign), gochara facts (Tara, Chandra, tithi, yoga, karana), the dashas running at that moment from the birth
 * chart, and the Vimshopaka of the event chart. Nothing is a verdict; PL9's one-line glosses are not used because no source is held for them.
 */

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது', Lagna: 'லக்னம்' };
const LEVEL_TA: Record<string, string> = { Dasha: 'தசை', Bhukti: 'புக்தி', Antara: 'அந்தரம்', Sookshma: 'சூக்ஷ்மம்', Prana: 'பிராணன்' };
const TITHI_TA: Record<string, string> = { SHUKLA: 'சுக்ல', KRISHNA: 'கிருஷ்ண' };
const num = { fontVariantNumeric: 'tabular-nums' as const };

const LUNAR_MONTH_TA = ['சைத்ரம்', 'வைசாகம்', 'ஜ்யேஷ்டம்', 'ஆஷாடம்', 'ஸ்ராவணம்', 'பாத்ரபதம்', 'ஆஸ்வினம்', 'கார்த்திகம்', 'மார்கசீர்ஷம்', 'பௌஷம்', 'மாகம்', 'பால்குனம்'];
const TITHI_NAME_TA = ['பிரதமை', 'துவிதியை', 'திருதியை', 'சதுர்த்தி', 'பஞ்சமி', 'சஷ்டி', 'சப்தமி', 'அஷ்டமி', 'நவமி', 'தசமி', 'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்த்தசி'];
const tithiLabel = (n: number) => (n === 15 ? 'பௌர்ணமி' : n === 30 ? 'அமாவாசை' : TITHI_NAME_TA[(n - 1) % 15]);
const pad = (n: number) => String(n).padStart(2, '0');
const nowParts = () => { const d = new Date(); return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` }; };

export default function EventsView() {
  const range = useSearchParams().get('range');
  const [party, setParty] = useState<Party | null>(null);
  const [form, setForm] = useState({ name: 'நிகழ்வு', ...nowParts(), place: 'சென்னை', latitude: '13.0827', longitude: '80.2707', offset: '330', description: '' });
  const [events, setEvents] = useState<Ev[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cal, setCal] = useState({ method: 'PURNIMANTA' as 'AMANTA' | 'PURNIMANTA', vs: String(new Date().getFullYear() + 57), month: '0', tithi: '1', adhika: false, vriddhi: false, ghati: '0', pala: '0', vipala: '0' });
  const [calNote, setCalNote] = useState<string | null>(null);

  const run = async (list: Ev[], who: Party | null = party) => {
    if (!who || list.length === 0) { setResult(null); return; }
    setLoading(true); setError(null);
    try {
      setResult(await computeEvents({ ...(who.kind === 'profile' ? { profile: { profileId: who.profileId, revision: who.revision } } : { form: who.input }), events: list }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } finally { setLoading(false); }
  };
  const choose = async (x: Party | null) => {
    setParty(x);
    if (!x) { setResult(null); return; }
    if (x.kind === 'profile') {
      try {
        const saved: Ev[] = await listSavedEvents(x.profileId);
        const next = [...saved, ...events.filter((e) => !e.eventId)].slice(0, 20);
        setEvents(next); run(next, x);
        return;
      } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    }
    const next = events.filter((e) => !e.eventId);
    setEvents(next); run(next, x);
  };
  const save = async (i: number) => {
    if (!party || party.kind !== 'profile') return;
    const { eventId: _id, ...e } = events[i];
    try {
      const { eventId } = await saveEvent({ profileId: party.profileId, ...e });
      setEvents(events.map((x, k) => (k === i ? { ...x, eventId } : x)));
    } catch (err) { setError(err instanceof Error ? err.message : String(err)); }
  };
  const describe = async (i: number) => {
    const e = events[i];
    if (!e.eventId) return;
    const text = window.prompt('நிகழ்வின் விளக்கம்', e.description ?? '');
    if (text === null) return;
    await updateSavedEvent(e.eventId, { description: text });
    setEvents(events.map((x, k) => (k === i ? { ...x, description: text } : x)));
  };
  const add = () => {
    const [year, month, day] = form.date.split('-').map(Number);
    const [hour, minute, second] = form.time.split(':').map(Number);
    const ev: Ev = { description: form.description || undefined, name: form.name || 'நிகழ்வு', year, month, day, hour, minute, second: second || 0, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), utcOffsetMinutes: parseInt(form.offset, 10), placeName: form.place };
    const next = [...events, ev].slice(0, 20);
    setEvents(next); run(next);
  };
  const remove = async (i: number) => {
    const e = events[i];
    if (e.eventId) {
      if (!window.confirm(`"${e.name}" என்ற சேமித்த நிகழ்வை நிரந்தரமாக நீக்கவா?`)) return;
      try { await deleteSavedEvent(e.eventId); } catch (err) { setError(err instanceof Error ? err.message : String(err)); return; }
    }
    const next = events.filter((_, k) => k !== i); setEvents(next); run(next);
  };
  const sortEvents = () => {
    const key = (e: Ev) => Date.UTC(e.year, e.month - 1, e.day, e.hour, e.minute, e.second ?? 0) - e.utcOffsetMinutes * 60000;
    const next = [...events].sort((a, b) => key(a) - key(b));
    setEvents(next); run(next);
  };
  /** PL9's "Indian Calendar" box: fill the date and time from a Vikram Samvat date at the place entered below. */
  const fromCalendar = async () => {
    setCalNote(null);
    const r = await indianToCivil({
      vikramSamvat: parseInt(cal.vs, 10), month: parseInt(cal.month, 10), tithi: parseInt(cal.tithi, 10), method: cal.method, adhika: cal.adhika, vriddhi: cal.vriddhi,
      ghati: parseInt(cal.ghati, 10) || 0, pala: parseInt(cal.pala, 10) || 0, vipala: parseInt(cal.vipala, 10) || 0,
      latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), utcOffsetMinutes: parseInt(form.offset, 10),
    });
    if (!r.ok) { setCalNote(r.reasonTa); return; }
    const d = r.date;
    setForm({ ...form, date: `${d.year}-${pad(d.month)}-${pad(d.day)}`, time: `${pad(d.hour)}:${pad(d.minute)}:${pad(d.second)}` });
    setCalNote(`${d.year}-${pad(d.month)}-${pad(d.day)} ${pad(d.hour)}:${pad(d.minute)}:${pad(d.second)}${r.adhika ? ' (அதிக மாதம்)' : ''}${r.vriddhiDays > 1 ? ' · இந்த திதி இரண்டு நாள் உதயத்தில் உள்ளது (விருத்தி)' : ''}`);
  };
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Events · worksheets 116-123" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">நிகழ்வு ஜாதகங்கள்{range === '1-10' ? ' — நிகழ்வுகள் 1–10' : range === '11-20' ? ' — நிகழ்வுகள் 11–20' : ''}</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒரு தேதி-நேரம்-இடத்தை (நிகழ்வு) ஜன்ம ஜாதகத்துடன் வைத்துப் பார்க்கிறது: நிகழ்வு ஜாதகம், ஜன்ம அஷ்டகவர்க்கத்தில் நிகழ்வு கிரகங்களின் காக்ஷ்யா,
          கோசார விவரங்கள், அந்த நேரத்தில் ஜன்ம ஜாதகத்தின் தசைகள், நிகழ்வு ஜாதகத்தின் விம்சோபகம். இதில் தீர்ப்பு எதுவும் இல்லை.
        </p>
      </header>

      <PartyChooser party={party} setParty={choose} loading={loading} />

      <nav className="flex flex-wrap gap-1.5 mb-4" aria-label="நிகழ்வுப் பட்டியலின் பகுதி">
        {([[null, 'அனைத்தும்'], ['1-10', 'நிகழ்வுகள் 1–10'], ['11-20', 'நிகழ்வுகள் 11–20']] as const).map(([r, label]) => (
          <Link
            key={label}
            href={r ? `/events?range=${r}` : '/events'}
            aria-current={range === r ? 'page' : undefined}
            className={`px-3 py-1 rounded-full border text-xs ${range === r ? 'bg-saffron text-ink border-saffron font-semibold' : 'border-line bg-surface text-ink hover:border-saffron'}`}
          >{label}</Link>
        ))}
      </nav>

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
          <label className="text-xs text-ink-soft">விளக்கம்<br /><input className={`${field} w-44`} value={form.description} onChange={set('description')} /></label>
          <button type="button" onClick={add} disabled={!party || loading || events.length >= 20} className="px-3 py-1.5 rounded bg-saffron text-ink text-sm disabled:opacity-50">நிகழ்வைச் சேர்</button>
        </div>
        <div className="mt-3 border-t border-line pt-3">
          <h3 className="text-xs font-semibold text-ink mb-1">இந்திய நாட்காட்டியிலிருந்து தேதி (மேலே உள்ள இடத்துக்கு)</h3>
          <div className="flex flex-wrap gap-3 items-end text-xs text-ink-soft">
            <label>முறை<br /><select className={field} value={cal.method} onChange={(e) => setCal({ ...cal, method: e.target.value as 'AMANTA' | 'PURNIMANTA' })}><option value="PURNIMANTA">கிருஷ்ணாதி (பூர்ணிமாந்தம்)</option><option value="AMANTA">சுக்லாதி (அமாந்தம்)</option></select></label>
            <label>விக்ரம சம்வத்<br /><input className={`${field} w-20`} value={cal.vs} onChange={(e) => setCal({ ...cal, vs: e.target.value })} /></label>
            <label>மாதம்<br /><select className={field} value={cal.month} onChange={(e) => setCal({ ...cal, month: e.target.value })}>{LUNAR_MONTH_TA.map((m, i) => <option key={m} value={i}>{m}</option>)}</select></label>
            <label>திதி<br /><select className={field} value={cal.tithi} onChange={(e) => setCal({ ...cal, tithi: e.target.value })}>{Array.from({ length: 30 }, (_, i) => <option key={i} value={i + 1}>{i < 15 ? 'சுக்ல' : 'கிருஷ்ண'} {tithiLabel(i + 1)}</option>)}</select></label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={cal.adhika} onChange={(e) => setCal({ ...cal, adhika: e.target.checked })} />அதிக மாதம்</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={cal.vriddhi} onChange={(e) => setCal({ ...cal, vriddhi: e.target.checked })} />விருத்தி (2-ஆம் நாள்)</label>
            <label>சூரிய உதயத்துக்குப் பின் (நாழிகை : விநாடி : தற்பரை)<br /><span className="flex gap-1"><input className={`${field} w-12`} value={cal.ghati} onChange={(e) => setCal({ ...cal, ghati: e.target.value })} /><input className={`${field} w-12`} value={cal.pala} onChange={(e) => setCal({ ...cal, pala: e.target.value })} /><input className={`${field} w-12`} value={cal.vipala} onChange={(e) => setCal({ ...cal, vipala: e.target.value })} /></span></label>
            <button type="button" onClick={fromCalendar} className="px-3 py-1.5 rounded border border-line text-ink text-sm">தேதியாக மாற்று</button>
            {events.length > 1 && <button type="button" onClick={sortEvents} className="px-3 py-1.5 rounded border border-line text-ink text-sm">நிகழ்வுகளை தேதிப்படி வரிசைப்படுத்து</button>}
          </div>
          {calNote && <p className="text-xs text-ink mt-1">{calNote}</p>}
          <p className="text-[11px] text-ink-soft mt-1">சூரிய உதய நேரத்தில் உள்ள திதியே அந்த நாளின் திதி (சிவெல், இந்தியன் க்ரோனோகிராபி §64, §72); மாதப் பெயர் புதுநிலவில் சூரியன் நிற்கும் ராசியால்; சூரிய சங்கிரமணம் இல்லாத மாதம் அதிகம் (§97). சித்தாந்த எண்கணிதம் அல்ல, உண்மைக் கணக்கு.</p>
        </div>
        {!party && <p className="text-[11px] text-ink-soft mt-2">முதலில் மேலே யாருடைய ஜாதகம் என்பதைத் தேர்வு செய்யுங்கள்.</p>}
        {events.length > 0 && (
          <ul className="mt-3 text-xs flex flex-wrap gap-2">
            {events.map((e, i) => (
              <li key={i} className="border border-line rounded px-2 py-1 bg-surface-2">
                <span className="text-ink-soft tabular-nums">{i + 1}. </span>{e.eventId && <span title="சேமிக்கப்பட்டது">💾 </span>}{e.name} · {e.year}-{pad(e.month)}-{pad(e.day)} {pad(e.hour)}:{pad(e.minute)}
                {e.description && <span className="text-ink-soft"> — {e.description}</span>}
                {party?.kind === 'profile' && !e.eventId && <button type="button" onClick={() => save(i)} className="ml-2 text-teal">சேமி</button>}
                {e.eventId && <button type="button" onClick={() => describe(i)} className="ml-2 text-ink-soft" title="விளக்கம் மாற்று">✎</button>}
                <button type="button" onClick={() => remove(i)} className="ml-2 text-rose" title={e.eventId ? 'நிரந்தரமாக நீக்கு' : 'பட்டியலிலிருந்து நீக்கு'}>✕</button>
              </li>
            ))}
          </ul>
        )}
        {error && <p className="text-rose text-sm mt-2">⚠️ {error}</p>}
      </section>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {result && (() => {
        const { from, to } = slotRange(range, result.events.length);
        const shown = result.events.slice(from, to);
        if (shown.length === 0) {
          return <p className="text-sm text-ink-soft mb-4">இந்த வரம்பில் நிகழ்வு இல்லை{range === '11-20' ? ' — 11-ஆவது நிகழ்வு பத்தை நிரப்பிய பின் இங்கே வரும்.' : '.'}</p>;
        }
        return (
          <>
            <EventList events={shown} first={from} />
            {shown.map((ev: any, i: number) => <EventCard key={from + i} ev={ev} native={result.native} slot={from + i + 1} />)}
          </>
        );
      })()}
    </main>
  );
}

const SYSTEMS: [string, string][] = [
  ['vimshottari', 'விம்சோத்தரி'], ['yogini', 'யோகினி'], ['chara', 'சர'], ['ashtottari', 'அஷ்டோத்தரி'],
  ['sthira', 'ஸ்திர'], ['shatabdika', 'சதாப்திகா'], ['kalachakra', 'காலச்சக்கரம்'],
];

/** PL9's event list: a row per event, the dashas of every system running at that moment (five levels, main period first). */
function EventList({ events, first }: { events: any[]; first: number }) {
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm overflow-x-auto">
      <h2 className="font-semibold text-ink mb-2">நிகழ்வுப் பட்டியல் — அந்த நேரத்தில் ஓடும் தசைகள்</h2>
      <table className="w-full text-xs" style={num}>
        <thead>
          <tr className="text-left text-ink-soft border-b border-line">
            <th className="py-1 pr-2">#</th><th className="py-1 pr-3">நிகழ்வு</th>
            {SYSTEMS.map(([, ta]) => <th key={ta} className="py-1 pr-3 whitespace-nowrap">{ta}</th>)}
          </tr>
        </thead>
        <tbody>
          {events.map((ev, i) => {
            const row = eventListRow(ev);
            return (
              <tr key={first + i} className="border-b border-line/40 align-top">
                <td className="py-1.5 pr-2 text-ink-soft">{first + i + 1}</td>
                <td className="py-1.5 pr-3 whitespace-nowrap">
                  <a href={`#event-${first + i + 1}`} className="font-semibold text-ink hover:text-saffron">{ev.name}</a>
                  <span className="block text-ink-soft">{ev.event.year}-{pad(ev.event.month)}-{pad(ev.event.day)} {pad(ev.event.hour)}:{pad(ev.event.minute)}</span>
                </td>
                {SYSTEMS.map(([key, ta]) => {
                  const parts: string[] = (row as any)[key];
                  return (
                    <td key={key} className="py-1.5 pr-3 font-mono whitespace-nowrap" title={ta}>
                      {parts.length > 0 ? parts.join('-') : <span className="text-ink-soft">—</span>}
                      {key === 'shatabdika' && parts.length > 0 && !row.shatabdikaApplies && <span className="text-ink-soft" title="லக்னம் வர்கோத்தமம் அல்ல — நூலின் நிபந்தனை இல்லை"> *</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-[11px] text-ink-soft mt-2">
        கிரகங்கள் இரண்டு எழுத்துப் பெயரில் (Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke); சர, ஸ்திர, காலச்சக்கரம் ராசிகள் தமிழில். ஐந்து நிலைகள்: தசை-புக்தி-அந்தரம்-சூக்ஷ்மம்-பிராணம் (காலச்சக்கரம் நூலில் புக்தி வரை மட்டும்; சர, ஸ்திர தசைக்கு ஒரு நிலை).
        * = லக்னம் வர்கோத்தமம் அல்ல, சதாப்திகாவுக்கு நூல் வைக்கும் நிபந்தனை இல்லை. ஒவ்வொரு நிகழ்வின் முழு விவரம் கீழே.
      </p>
    </section>
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

const asChart = (b: any) => fromParashariChart({
  lagna: { rasiIndex: b.lagnaSign },
  grahas: Object.fromEntries(b.planets.map((p: any) => [p.planet, { rasiIndex: p.sign, degreeInSign: p.degree }])),
});

/** PL9's "Progression (n)" pair: the solar-return chart of the year the event falls in, for the birth place and for the event place. */
function VarshaPair({ v }: { v: any }) {
  const t = (b: any) => `${b.local.year}-${pad(b.local.month)}-${pad(b.local.day)} ${pad(b.local.hour)}:${pad(b.local.minute)}:${pad(b.local.second)}`;
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-ink mb-1">வருஷபல கட்டம் — வயது {v.age} (நிகழ்வு நடக்கும் ஆண்டு) · முந்தா (Muntha): {SIGN_TA[v.munthaSign]}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[['பிறந்த இடம்', v.birthPlace], ['நிகழ்வு இடம்', v.eventPlace]].map(([label, b]: any) => (
          <div key={label} className="flex flex-col items-center">
            <VedicChartBox {...asChart(b)} title={`${label}${b.placeName ? ' — ' + b.placeName : ''} · ${t(b)}`} size={280} />
            <p className="text-[11px] text-ink-soft mt-1">லக்னம் {SIGN_TA[b.lagnaSign]} · முந்தா {SIGN_TA[b.munthaSign]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventCard({ ev, native, slot }: { ev: any; native: any; slot: number }) {
  const g = ev.gochara;
  return (
    <section id={`event-${slot}`} className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm scroll-mt-4">
      <h2 className="font-semibold text-ink"><span className="text-ink-soft tabular-nums">{slot}. </span>{ev.name} — {ev.event.year}-{pad(ev.event.month)}-{pad(ev.event.day)} {pad(ev.event.hour)}:{pad(ev.event.minute)} · {ev.placeName || '—'}</h2>
      <p className="text-xs text-ink-soft mb-3">{native.name ?? '(பெயர் இல்லை)'} ஜாதகத்துடன் · {ev.event.ayanamsha} அயனாம்சம்{ev.event.description ? ` · ${ev.event.description}` : ''}</p>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="flex justify-center"><VedicChartBox {...fromParashariChart(ev.raw.chart)} title="நிகழ்வு ராசி கட்டம்" size={280} /></div>
        <Houses rows={ev.chart.fromLagna} title={`லக்னத்திலிருந்து (லக்னம் ${SIGN_TA[ev.chart.lagnaSign]})`} />
        <Houses rows={ev.chart.fromMoon} title={`சந்திரனிலிருந்து (${SIGN_TA[ev.chart.moonSign]})`} />
      </div>

      {ev.varsha && <VarshaPair v={ev.varsha} />}

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
            {g.indian && <><dt className="text-ink-soft">இந்திய நாட்காட்டி</dt><dd>விக்ரம சம்வத் {g.indian.vikramSamvat} · {g.indian.adhika ? 'அதிக ' : ''}{LUNAR_MONTH_TA[g.indian.amantaMonth]} (அமாந்தம்){g.indian.paksha === 'KRISHNA' ? `, ${LUNAR_MONTH_TA[g.indian.purnimantaMonth]} (பூர்ணிமாந்தம்)` : ''} · {g.indian.paksha === 'SHUKLA' ? 'சுக்ல' : 'கிருஷ்ண'} {tithiLabel(g.indian.tithi)}</dd></>}
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
              {ev.dashas.sthira && <tr className="border-t border-line/40"><td className="py-0.5 pr-2 text-ink-soft">ஸ்திர தசை (BPHS, சந்தானம்)</td><td className="pr-2">{SIGN_TA[ev.dashas.sthira.sign]}</td><td className="text-ink-soft">{new Date(ev.dashas.sthira.startMs).toISOString().slice(0, 10)} → {new Date(ev.dashas.sthira.endMs).toISOString().slice(0, 10)}</td></tr>}
              {ev.dashas.jaiminiSthira && <tr className="border-t border-line/40"><td className="py-0.5 pr-2 text-ink-soft">ஸ்திர தசை (ஜைமினி, ராத்)</td><td className="pr-2">{SIGN_TA[ev.dashas.jaiminiSthira.sign]}</td><td className="text-ink-soft">{new Date(ev.dashas.jaiminiSthira.startMs).toISOString().slice(0, 10)} → {new Date(ev.dashas.jaiminiSthira.endMs).toISOString().slice(0, 10)}</td></tr>}
              {ev.dashas.jaiminiSthiraZodiacal && <tr className="border-t border-line/40"><td className="py-0.5 pr-2 text-ink-soft">ஸ்திர தசை (ராத், ராசி வரிசை)</td><td className="pr-2">{SIGN_TA[ev.dashas.jaiminiSthiraZodiacal.sign]}</td><td className="text-ink-soft">{new Date(ev.dashas.jaiminiSthiraZodiacal.startMs).toISOString().slice(0, 10)} → {new Date(ev.dashas.jaiminiSthiraZodiacal.endMs).toISOString().slice(0, 10)}</td></tr>}
            </tbody>
          </table>
          <h4 className="text-xs font-semibold text-ink mt-3 mb-1">ஐந்து நிலைகள் (தசை-புக்தி-அந்தரம்-சூக்ஷ்மம்-பிராணம்)</h4>
          <ul className="text-xs" style={num}>
            {[['விம்சோத்தரி', ev.dashas.vimshottari.map((d: any) => PLANET_TA[d.lord])],
              ['யோகினி', (ev.dashas.yogini5 ?? []).map((d: any) => PLANET_TA[d.lord])],
              ['அஷ்டோத்தரி', (ev.dashas.ashtottari5 ?? []).map((d: any) => PLANET_TA[d.lord])],
              ['நாராயண (ராத் 2.4.31-34)', (ev.dashas.narayana5 ?? []).map((d: any) => SIGN_TA[d.sign])],
              ['ஸ்திர (ஜைமினி, ராத் — BPHS திசை)', (ev.dashas.jaiminiSthira5 ?? []).map((d: any) => SIGN_TA[d.sign])],
              [`சதாப்திகா (${ev.dashas.shatabdika5?.applies?.applies ? 'லக்னம் வர்கோத்தமம் — நிபந்தனை உண்டு' : 'லக்னம் வர்கோத்தமம் அல்ல — நிபந்தனை இல்லை'})`, (ev.dashas.shatabdika5?.chain ?? []).map((d: any) => PLANET_TA[d.lord])],
              [`காலச்சக்கரம் (${ev.dashas.kalachakra?.directionTa ?? ''}, மகா – புக்தி)`, ev.dashas.kalachakra ? [SIGN_TA[ev.dashas.kalachakra.maha.rasiIndex], ...(ev.dashas.kalachakra.bhukti ? [SIGN_TA[ev.dashas.kalachakra.bhukti.rasiIndex]] : [])] : []]].map(([label, xs]: any) => xs.length > 0 && (
              <li key={label} className="border-t border-line/40 py-0.5"><span className="text-ink-soft">{label}: </span>{xs.join(' – ')}</li>
            ))}
          </ul>
          <p className="text-[11px] text-ink-soft mt-1">சதாப்திகா: BPHS அத்.46 (ரேவதியிலிருந்து எண்ணி 7-ஆல் வகுத்து; 5, 5, 10, 10, 20, 20, 30 ஆண்டுகள்); நிபந்தனை லக்னம் வர்கோத்தமம் — இங்கே குறிப்பாக மட்டும், விம்சோத்தரியே பொது தசை. காலச்சக்கரம் (தில்லைநாயகப் புலவர் நூல்): மகா தசை {ev.dashas.kalachakra ? `${SIGN_TA[ev.dashas.kalachakra.maha.rasiIndex]} ${new Date(ev.dashas.kalachakra.maha.startMs).toISOString().slice(0, 10)} → ${new Date(ev.dashas.kalachakra.maha.endMs).toISOString().slice(0, 10)}` : '—'}{ev.dashas.kalachakra?.bhukti ? `; புக்தி ${new Date(ev.dashas.kalachakra.bhukti.startMs).toISOString().slice(0, 10)} → ${new Date(ev.dashas.kalachakra.bhukti.endMs).toISOString().slice(0, 10)}` : ''}; நூலில் புக்தி வரை மட்டுமே. இந்த இரண்டுக்கும் PL9 நிகழ்வுப் பலகையில் மதிப்பு இல்லை.</p>
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
