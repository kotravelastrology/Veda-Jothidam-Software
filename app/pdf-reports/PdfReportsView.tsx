'use client';

import { useEffect, useRef, useState } from 'react';
import { buildPrintableReport, type ReportRequest } from './actions';
import { useActiveBirthInput } from '@/src/workspace/useActiveBirthInput';

/**
 * The report, built here and printed from here.
 *
 * This page used to POST to a Flask service and hope a PDF came back. VJ-019
 * built the whole pipeline in this repository — ChartSnapshot → ReportDocument
 * → printable HTML, with a real PDF proved out of it (valid bytes, three
 * embedded Tamil font subsets, no clipped tables) — and nothing in the UI ever
 * called it. Now the button calls it.
 *
 * What the iframe shows is the print input itself, not a rendering of it.
 * There is no second renderer between what the practitioner approves and what
 * the client receives.
 */
export default function PdfReportsView() {
  const { profile, input: activeInput } = useActiveBirthInput();

  const [form, setForm] = useState({
    name: '', date: '1990-05-15', time: '10:30',
    place: 'சென்னை', latitude: '13.0827', longitude: '80.2707', offset: '330',
    ayanamsha: 'Lahiri', houseSystem: 'Porphyrius',
  });
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  // The workspace's active profile fills the form, so arriving from another
  // page does not mean typing the birth details again.
  useEffect(() => {
    if (!activeInput || !profile) return;
    const p = (n: number) => String(n).padStart(2, '0');
    setForm((f) => ({
      ...f,
      name: f.name || profile.name || '',
      date: `${activeInput.year}-${p(activeInput.month)}-${p(activeInput.day)}`,
      time: `${p(activeInput.hour)}:${p(activeInput.minute ?? 0)}`,
      place: activeInput.placeName ?? f.place,
      latitude: String(activeInput.latitude),
      longitude: String(activeInput.longitude),
      offset: String(activeInput.utcOffsetMinutes ?? 330),
      ayanamsha: activeInput.ayanamsha ?? f.ayanamsha,
      houseSystem: activeInput.houseSystem ?? f.houseSystem,
    }));
  }, [activeInput, profile]);

  const build = async () => {
    setLoading(true); setError(null);
    try {
      const [year, month, day] = form.date.split('-').map(Number);
      const [hour, minute] = form.time.split(':').map(Number);
      const req: ReportRequest = {
        name: form.name, year, month, day, hour, minute,
        latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude),
        utcOffsetMinutes: parseInt(form.offset, 10),
        placeName: form.place, ayanamsha: form.ayanamsha, houseSystem: form.houseSystem,
      };
      setReport(await buildPrintableReport(req));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  /** Prints the iframe's own document, which is the report itself. */
  const print = () => {
    const win = frame.current?.contentWindow;
    if (!win) { setError('அச்சுப் பலகத்தைத் திறக்க முடியவில்லை'); return; }
    win.focus();
    win.print();
  };

  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  const field = 'w-full px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Report</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          அறிக்கை
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          கீழே காணும் அறிக்கையே அச்சிடப்படுவது — அதன் ஒரு நகல் அல்ல.
          நீங்கள் பார்த்து ஒப்புக்கொள்வதுதான் வாடிக்கையாளருக்குச் செல்லும்.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm mb-3">
          <label className="lg:col-span-2"><span className="block text-ink-soft text-xs mb-1">பெயர்</span>
            <input value={form.name} onChange={set('name')} placeholder="வாடிக்கையாளர் பெயர்" className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">பிறந்த தேதி</span>
            <input type="date" value={form.date} onChange={set('date')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">நேரம்</span>
            <input type="time" value={form.time} onChange={set('time')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">இடம்</span>
            <input value={form.place} onChange={set('place')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">அட்சரேகை</span>
            <input value={form.latitude} onChange={set('latitude')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">தீர்க்கரேகை</span>
            <input value={form.longitude} onChange={set('longitude')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">UTC (நிமிடம்)</span>
            <input value={form.offset} onChange={set('offset')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">அயனாம்சம்</span>
            <select value={form.ayanamsha} onChange={set('ayanamsha')} className={field}>
              {['Lahiri', 'Raman', 'KP'].map((a) => <option key={a} value={a}>{a}</option>)}
            </select></label>
          <label><span className="block text-ink-soft text-xs mb-1">பாவ முறை</span>
            <select value={form.houseSystem} onChange={set('houseSystem')} className={field}>
              {['Porphyrius', 'WholeSign', 'Placidus'].map((h) => <option key={h} value={h}>{h}</option>)}
            </select></label>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button type="button" onClick={build} disabled={loading || !form.name.trim()}
            className="px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold disabled:opacity-40">
            {loading ? 'உருவாக்கப்படுகிறது…' : 'அறிக்கையை உருவாக்கு'}
          </button>
          {report && (
            <button type="button" onClick={print}
              className="px-4 py-2 rounded-xl border border-line text-ink text-sm font-semibold hover:border-saffron">
              அச்சிடு / PDF ஆகச் சேமி
            </button>
          )}
          {!form.name.trim() && <span className="text-xs text-ink-soft">பெயர் இட்ட பிறகு உருவாக்கலாம்.</span>}
        </div>
      </section>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {report && (
        <>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft mb-2 font-mono">
            <span>snapshot {report.snapshotId.slice(0, 16)}</span>
            <span>engine {report.engineVersion}</span>
            <span>{report.settings.ayanamsha} · {report.settings.houseSystem}</span>
            <span>{report.sections.length} பகுதிகள்</span>
          </div>

          <p className="text-xs text-ink-soft mb-3">
            அச்சிடும்போது உலாவியின் &ldquo;Save as PDF&rdquo; தேர்வு தமிழ் எழுத்துருவை
            உள்ளடக்கிய உண்மையான PDF-ஐத் தரும். இந்த snapshot எண் அறிக்கையின்
            அடிப்பகுதியிலும் அச்சாகும் — பிறகு பிறந்த நேரம் திருத்தப்பட்டாலும்,
            கையில் உள்ள அறிக்கை எந்த ஜாதகத்திலிருந்து வந்தது என்பதைச் சொல்ல.
          </p>

          <div className="border border-line rounded-2xl overflow-hidden bg-white">
            <iframe
              ref={frame}
              title="அறிக்கை முன்னோட்டம்"
              srcDoc={report.html}
              className="w-full"
              style={{ height: '78vh', border: 0 }}
            />
          </div>
        </>
      )}
    </main>
  );
}
