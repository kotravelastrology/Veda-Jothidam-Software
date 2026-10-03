'use client';

import { useState } from 'react';
import { computeReturns, type ReturnQuery } from './actions';

/**
 * Solar returns — annual, monthly and daily, at the birthplace and at where
 * the native lives now.
 *
 * PL9 prints these as eighteen worksheets. They are one calculation with three
 * step sizes and two sets of coordinates, so this is one page with a step
 * selector and an optional second place.
 *
 * The step convention for the monthly and daily series is stated on screen,
 * not buried: it is the part that comes from a text rather than from the sky,
 * and nobody has checked it against one yet.
 */
export default function SolarReturnsView() {
  const [birth, setBirth] = useState({
    date: '1990-05-15', time: '10:30', place: 'சென்னை',
    latitude: '13.0827', longitude: '80.2707', offset: '330',
  });
  const [local, setLocal] = useState({
    enabled: false, name: 'London', latitude: '51.5072', longitude: '-0.1276', offset: '60',
  });
  const [kind, setKind] = useState<'annual' | 'monthly' | 'daily'>('monthly');
  const [years, setYears] = useState('35');
  const [count, setCount] = useState('12');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setError(null);
    try {
      const [y, m, d] = birth.date.split('-').map(Number);
      const [hh, mm] = birth.time.split(':').map(Number);
      const q: ReturnQuery = {
        birth: {
          year: y, month: m, day: d, hour: hh, minute: mm,
          latitude: parseFloat(birth.latitude), longitude: parseFloat(birth.longitude),
          utcOffsetMinutes: parseInt(birth.offset, 10), placeName: birth.place,
        },
        local: local.enabled ? {
          name: local.name, latitude: parseFloat(local.latitude),
          longitude: parseFloat(local.longitude), utcOffsetMinutes: parseInt(local.offset, 10),
        } : null,
        yearsElapsed: parseInt(years, 10),
        kind,
        count: parseInt(count, 10),
      };
      setResult(await computeReturns(q));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const set = (o: any, f: any, k: string) => (e: any) => f({ ...o, [k]: e.target.value });
  const field = 'w-full px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';
  const deg = (d: number) => `${Math.floor(d)}°${String(Math.floor((d % 1) * 60)).padStart(2, '0')}'`;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Solar returns</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          வருஷ · மாத · தின பிரவேசம்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          சூரியன் ஜனன நீள்கோட்டை அடையும் தருணங்கள். ஒரே தருணத்தை இரு இடங்களில்
          அமைத்துப் பார்க்கலாம் — கிரகங்கள் ஒரே இடத்தில் இருக்கும், லக்னமும்
          பாவங்களும் மாறும்.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-ink mb-2">பிறப்பு விவரம்</h2>
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm mb-3">
          <label><span className="block text-ink-soft text-xs mb-1">தேதி</span>
            <input type="date" value={birth.date} onChange={set(birth, setBirth, 'date')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">நேரம்</span>
            <input type="time" value={birth.time} onChange={set(birth, setBirth, 'time')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">இடம்</span>
            <input value={birth.place} onChange={set(birth, setBirth, 'place')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">அட்சரேகை</span>
            <input value={birth.latitude} onChange={set(birth, setBirth, 'latitude')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">தீர்க்கரேகை</span>
            <input value={birth.longitude} onChange={set(birth, setBirth, 'longitude')} className={field} /></label>
          <label><span className="block text-ink-soft text-xs mb-1">UTC (நிமிடம்)</span>
            <input value={birth.offset} onChange={set(birth, setBirth, 'offset')} className={field} /></label>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink mb-2 cursor-pointer">
          <input type="checkbox" checked={local.enabled}
            onChange={(e) => setLocal({ ...local, enabled: e.target.checked })} />
          தற்போது வசிக்கும் இடத்திலும் அமைக்கவும்
        </label>
        {local.enabled && (
          <div className="grid sm:grid-cols-4 gap-3 text-sm mb-3">
            <label><span className="block text-ink-soft text-xs mb-1">இடம்</span>
              <input value={local.name} onChange={set(local, setLocal, 'name')} className={field} /></label>
            <label><span className="block text-ink-soft text-xs mb-1">அட்சரேகை</span>
              <input value={local.latitude} onChange={set(local, setLocal, 'latitude')} className={field} /></label>
            <label><span className="block text-ink-soft text-xs mb-1">தீர்க்கரேகை</span>
              <input value={local.longitude} onChange={set(local, setLocal, 'longitude')} className={field} /></label>
            <label><span className="block text-ink-soft text-xs mb-1">UTC (நிமிடம்)</span>
              <input value={local.offset} onChange={set(local, setLocal, 'offset')} className={field} /></label>
          </div>
        )}

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex gap-1">
            {([['annual', 'வருஷ'], ['monthly', 'மாத'], ['daily', 'தின']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => setKind(k)}
                className={`px-3 py-1.5 text-sm rounded-lg ${kind === k ? 'bg-saffron text-white' : 'bg-surface border border-line text-ink-soft'}`}>
                {l}
              </button>
            ))}
          </div>
          <label className="text-sm"><span className="block text-ink-soft text-xs mb-1">வயது (ஆண்டு)</span>
            <input value={years} onChange={(e) => setYears(e.target.value)} className={`${field} w-24`} /></label>
          {kind !== 'annual' && (
            <label className="text-sm"><span className="block text-ink-soft text-xs mb-1">எத்தனை</span>
              <input value={count} onChange={(e) => setCount(e.target.value)} className={`${field} w-24`} /></label>
          )}
          <button type="button" onClick={run} disabled={loading}
            className="px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold disabled:opacity-40">
            {loading ? 'கணக்கிடப்படுகிறது…' : 'கணக்கிடு'}
          </button>
        </div>
      </section>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <div className={`text-xs rounded-xl p-3 mb-4 border ${
            result.sourceStatus === 'VERIFIED'
              ? 'bg-teal-soft/40 border-teal/30 text-teal'
              : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <strong>{result.kindNameTa}</strong> — படி அளவு {result.stepDegrees.toFixed(6)}°.
            <br />{result.convention}
            {result.sourceStatus !== 'VERIFIED' && (
              <><br /><strong>எனவே:</strong> இது வாடிக்கையாளர் அறிக்கையில் தானாகச்
                சேர்க்கப்படாது. நூலுடன் ஒப்பிட்ட பிறகே.</>
            )}
          </div>

          <p className="text-xs text-ink-soft mb-3 font-mono">
            வருஷ ஆரம்பம் {result.yearStart.slice(0, 16)}Z · ஜனன சூரியன் {result.natalSunLongitude.toFixed(4)}°
          </p>

          <div className="overflow-x-auto border border-line rounded-2xl bg-surface">
            <table className="w-full text-xs" style={{ minWidth: result.hasLocalPlace ? 760 : 520 }}>
              <thead>
                <tr className="text-ink-soft border-b border-line bg-ink-soft/5">
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">சூரிய நிலை</th>
                  <th className="text-left py-2 px-3" colSpan={2}>பிறந்த இடம்</th>
                  {result.hasLocalPlace && <th className="text-left py-2 px-3" colSpan={2}>வசிக்கும் இடம்</th>}
                  {result.hasLocalPlace && <th className="text-left py-2 px-3">பாவம் மாறியவை</th>}
                </tr>
              </thead>
              <tbody>
                {result.charts.map((c: any, i: number) => (
                  <tr key={c.step} className="border-b border-line/40">
                    <td className="py-1.5 px-3 text-ink-soft">{c.step + 1}</td>
                    <td className="py-1.5 px-3 font-mono text-ink-soft" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {c.targetLongitude.toFixed(3)}°
                    </td>
                    <td className="py-1.5 px-3 text-ink whitespace-nowrap">{c.natal.date} {c.natal.time}</td>
                    <td className="py-1.5 px-3 text-ink-soft">{c.natal.lagna} {deg(c.natal.lagnaDegree)}</td>
                    {result.hasLocalPlace && (
                      <>
                        <td className="py-1.5 px-3 text-ink whitespace-nowrap">{c.local.date} {c.local.time}</td>
                        <td className="py-1.5 px-3 text-ink-soft">{c.local.lagna} {deg(c.local.lagnaDegree)}</td>
                        <td className="py-1.5 px-3 text-ink-soft">
                          {c.housesMoved.length ? `${c.housesMoved.length} கிரகம்` : '—'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result.gapsDays.length > 1 && (
            <p className="text-xs text-ink-soft mt-3">
              இடைவெளிகள் {Math.min(...result.gapsDays).toFixed(2)} – {Math.max(...result.gapsDays).toFixed(2)} நாட்கள்.
              {result.kind === 'monthly' && ' சூரியன் ஒரே வேகத்தில் நகர்வதில்லை — அதனால் சூரிய மாதங்கள் சமமானவை அல்ல.'}
              {result.kind === 'daily' && ' படி அளவு சூரியனின் சராசரி நகர்வு, அதனால் ஒவ்வொரு "நாளும்" சரியாக 24 மணி நேரம் அல்ல.'}
            </p>
          )}

          {result.hasLocalPlace && (
            <p className="text-xs text-ink-soft mt-2">
              இரு இடத்திலும் கிரகங்களின் நீள்கோடு ஒன்றுதான் — தருணம் ஒன்றே.
              மாறுவது லக்னமும், அதனால் பாவங்களும் மட்டுமே.
            </p>
          )}
        </>
      )}
    </main>
  );
}
