'use client';

import { useEffect, useState } from 'react';
import { computeTamilCalendar } from './actions';

const PLACES: Record<string, { lat: number; lon: number }> = {
  'சென்னை (Chennai)': { lat: 13.0827, lon: 80.2707 },
  'மதுரை (Madurai)': { lat: 9.9252, lon: 78.1198 },
  'கோயம்புத்தூர் (Coimbatore)': { lat: 11.0168, lon: 76.9558 },
  'திருச்சி (Trichy)': { lat: 10.7905, lon: 78.7047 },
  'பெங்களூரு (Bengaluru)': { lat: 12.9716, lon: 77.5946 },
};

export default function TamilCalendarView() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [place, setPlace] = useState('சென்னை (Chennai)');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (y: number, pl: string) => {
    setLoading(true);
    setError(null);
    try {
      const { lat, lon } = PLACES[pl];
      setData(await computeTamilCalendar({ year: y, latitude: lat, longitude: lon }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(year, place); /* eslint-disable-next-line */ }, []);

  const t = data?.today;
  const todayStr = now.toISOString().slice(0, 10);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Tamil calendar</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">தமிழ் நாட்காட்டி</h1>
        <p className="text-sm text-ink-soft mt-1">
          தமிழ் சௌரமான மாதம் · 60 வருட சம்வத்சரம் · அயனம் / ருது · இன்றைய பஞ்சாங்கம், மற்றும்
          இந்த ஆண்டின் பண்டிகைகள். தேதிகள் திருக்கணித சுவிஸ் எபிமெரிஸிலிருந்து குறிப்பிட்ட
          காலவிதி மூலம் கணக்கிடப்படுகின்றன.
        </p>
      </header>

      <div className="flex gap-2 mb-6">
        <select value={place} onChange={(e) => { setPlace(e.target.value); load(year, e.target.value); }}
          className="px-3 py-2 rounded border border-line bg-surface text-ink text-sm">
          {Object.keys(PLACES).map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={year} onChange={(e) => { const y = Number(e.target.value); setYear(y); load(y, place); }}
          className="px-3 py-2 rounded border border-line bg-surface text-ink text-sm">
          {Array.from({ length: 7 }, (_, i) => now.getFullYear() - 2 + i).map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading && <p className="text-sm text-ink-soft">கணக்கிடுகிறது…</p>}
      {error && <p className="text-rose-700 text-sm">⚠️ {error}</p>}

      {t && (
        <section className="mb-8 bg-surface-soft border border-line rounded-lg p-5">
          <h2 className="font-semibold text-ink mb-3">இன்று — {t.gregorian}</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt className="text-ink-soft text-xs uppercase">வருடம்</dt><dd className="text-ink">{t.samvatsara.ta || t.samvatsara.name} ({t.samvatsara.name})</dd></div>
            <div><dt className="text-ink-soft text-xs uppercase">மாதம்</dt><dd className="text-ink">{t.month.ta} ({t.month.en})</dd></div>
            <div><dt className="text-ink-soft text-xs uppercase">அயனம் / ருது</dt><dd className="text-ink">{t.ayana.ta} · {t.ritu.ta}</dd></div>
            <div><dt className="text-ink-soft text-xs uppercase">பக்ஷம் / திதி</dt><dd className="text-ink">{t.paksha.ta} {t.tithi.name}</dd></div>
            <div><dt className="text-ink-soft text-xs uppercase">நட்சத்திரம்</dt><dd className="text-ink">{t.nakshatra.name}</dd></div>
            <div><dt className="text-ink-soft text-xs uppercase">வாரம்</dt><dd className="text-ink">{t.vaara.name}</dd></div>
          </dl>
        </section>
      )}

      {data?.festivals && (
        <section>
          <h2 className="font-semibold text-ink mb-3">{year} பண்டிகைகள் ({data.festivals.length})</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ink-soft border-b border-line">
                <th className="px-2 py-2 text-left">தேதி</th>
                <th className="px-2 py-2 text-left">பண்டிகை</th>
                <th className="px-2 py-2 text-left">விதி</th>
              </tr>
            </thead>
            <tbody>
              {data.festivals.map((f: any) => {
                const isToday = f.date === todayStr;
                return (
                  <tr key={f.key} className={`border-b border-line/40 ${isToday ? 'bg-saffron/10 font-semibold' : ''}`}>
                    <td className="px-2 py-2 whitespace-nowrap text-ink-soft">{f.date}<span className="block text-xs">{f.weekday}</span></td>
                    <td className="px-2 py-2">
                      <span className="text-ink">{f.ta}</span> <span className="text-ink-soft text-xs">{f.en}</span>
                      {f.reference && <span className="ml-1 text-[10px] px-1 rounded bg-amber-100 text-amber-800">reference</span>}
                    </td>
                    <td className="px-2 py-2 text-ink-soft text-xs">
                      {f.note}{f.kala ? ` · ${f.kala}` : ''}
                      {f.source && <span className="block opacity-70">{f.source}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-[11px] text-ink-soft mt-3">
            சங்க்ராந்தி விதி: புதிய ராசி அன்றைய சூரிய அஸ்தமனத்தில் இருந்தால் அன்று, இல்லையேல் மறுநாள்.
            திதி/நட்சத்திர விதி: குறிப்பிட்ட காலத்தில் நிலவும் திதி/நட்சத்திரம் (வ்யாபினி).
            &ldquo;reference&rdquo; = பாரம்பரியங்கள் வேறுபடும் பண்டிகையின் ஒரு கணக்கீடு, சான்று மேற்கோள் இல்லை.
            முந்தைய AstrologicLab festival resolver-லிருந்து port.
          </p>
        </section>
      )}
    </main>
  );
}
