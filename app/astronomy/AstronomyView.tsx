'use client';

import { useState } from 'react';
import { computeSky, type SkyQuery } from './actions';

/**
 * The astronomy behind a chart.
 *
 * PL9 devotes eight report pages to this — a details page and one per classical
 * graha — and this software had none, despite `calculateChart` already
 * computing celestial latitude, distance and longitude speed for all seven and
 * `calculateParashariChart` discarding them.
 *
 * So this page shows figures that exist nowhere else in the product, chiefly
 * retrogression, which is read from the sign of the longitude speed rather
 * than looked up.
 */
export default function AstronomyView() {
  const [form, setForm] = useState({
    date: '1990-05-15', time: '10:30', place: 'சென்னை',
    latitude: '13.0827', longitude: '80.2707', offset: '330', ayanamsha: 'Lahiri',
  });
  const [sky, setSky] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setError(null);
    try {
      const [year, month, day] = form.date.split('-').map(Number);
      const [hour, minute] = form.time.split(':').map(Number);
      const q: SkyQuery = {
        year, month, day, hour, minute,
        latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude),
        utcOffsetMinutes: parseInt(form.offset, 10),
        placeName: form.place, ayanamsha: form.ayanamsha,
      };
      setSky(await computeSky(q));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  const field = 'w-full px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Astronomy</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          வானியல் விவரம்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          ஜாதகத்தின் பின்னால் உள்ள வானியல் அளவுகள் — நீள்கோடு, வான் அட்சரேகை,
          தூரம், நாளொன்றுக்கான நகர்வு. வக்ரம் (retrograde) நகர்வின் குறியிலிருந்து
          நேரடியாகக் கணிக்கப்படுகிறது.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm mb-3">
          <label><span className="block text-ink-soft text-xs mb-1">தேதி</span>
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
        </div>
        <button type="button" onClick={run} disabled={loading}
          className="px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold disabled:opacity-40">
          {loading ? 'கணக்கிடப்படுகிறது…' : 'கணக்கிடு'}
        </button>
      </section>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {sky && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">விவரம்</h2>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <div className="flex justify-between gap-3 border-b border-line/40 py-0.5">
                <dt className="text-ink-soft">நாள் / நேரம்</dt>
                <dd className="text-ink">{sky.moment.date} · {sky.moment.time} (UTC{sky.place.utcOffsetMinutes >= 0 ? '+' : ''}{(sky.place.utcOffsetMinutes / 60).toFixed(2)})</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/40 py-0.5">
                <dt className="text-ink-soft">இடம்</dt>
                <dd className="text-ink">{sky.place.name} · {sky.place.latitude}, {sky.place.longitude}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/40 py-0.5">
                <dt className="text-ink-soft">சூரிய உதயம் / அஸ்தமனம்</dt>
                <dd className="text-ink">{sky.moment.sunrise ?? '—'} / {sky.moment.sunset ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/40 py-0.5">
                <dt className="text-ink-soft">ஜூலியன் நாள்</dt>
                <dd className="text-ink font-mono">{sky.julianDay.toFixed(6)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/40 py-0.5">
                <dt className="text-ink-soft">அயனாம்சம் / பாவ முறை</dt>
                <dd className="text-ink">{sky.settings.ayanamsha} · {sky.angles.houseSystem}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/40 py-0.5">
                <dt className="text-ink-soft">engine</dt>
                <dd className="text-ink font-mono">{sky.engine} {sky.engineVersion}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/40 py-0.5">
                <dt className="text-ink-soft">லக்னம் / MC</dt>
                <dd className="text-ink font-mono">{sky.angles.ascendant} / {sky.angles.mc}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/40 py-0.5">
                <dt className="text-ink-soft">ARMC / Vertex</dt>
                <dd className="text-ink font-mono">{sky.angles.armc} / {sky.angles.vertex}</dd>
              </div>
            </dl>
          </section>

          <section className="mb-4">
            <h2 className="text-sm font-semibold text-ink mb-2">கிரகங்கள்</h2>
            <div className="overflow-x-auto border border-line rounded-2xl bg-surface">
              <table className="w-full text-xs" style={{ minWidth: 640 }}>
                <thead>
                  <tr className="text-ink-soft border-b border-line bg-ink-soft/5">
                    <th className="text-left py-2 px-3">கிரகம்</th>
                    <th className="text-left py-2 px-3">நீள்கோடு</th>
                    <th className="text-left py-2 px-3">ராசி</th>
                    <th className="text-left py-2 px-3">நட்சத்திரம்</th>
                    <th className="text-right py-2 px-3">நகர்வு / நாள்</th>
                    <th className="text-right py-2 px-3">தூரம் (AU)</th>
                  </tr>
                </thead>
                <tbody>
                  {sky.bodies.map((b: any) => (
                    <tr key={b.id}
                      onClick={() => setOpen(open === b.id ? null : b.id)}
                      className="border-b border-line/40 cursor-pointer hover:bg-ink-soft/5">
                      <td className="py-1.5 px-3 text-ink">
                        {b.nameTa}
                        {b.retrograde && (
                          <span className="ml-1.5 text-[10px] px-1 py-0.5 rounded bg-rose-soft text-rose font-semibold">
                            வக்ரம்
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-ink">{b.longitudeDms}</td>
                      <td className="py-1.5 px-3 text-ink-soft">{b.rasi} {b.degreeInSign}</td>
                      <td className="py-1.5 px-3 text-ink-soft">{b.nakshatra} · பாதம் {b.pada}</td>
                      <td className={`py-1.5 px-3 text-right font-mono ${b.retrograde ? 'text-rose' : 'text-ink-soft'}`}
                        style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {b.speedPerDay.toFixed(5)}°
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-ink-soft"
                        style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {b.distanceAu.toFixed(6)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {open && (() => {
              const b = sky.bodies.find((x: any) => x.id === open);
              return b ? (
                <div className="mt-2 border border-line rounded-xl bg-surface p-4 text-xs">
                  <h3 className="text-sm font-semibold text-ink mb-2">{b.nameTa} <span className="text-ink-soft font-normal">{b.id}</span></h3>
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                    {([
                      ['சாயன நீள்கோடு (நிரயன)', b.longitudeDms],
                      ['ராசியில் பாகை', `${b.rasi} ${b.degreeInSign}`],
                      ['நட்சத்திரம் / பாதம்', `${b.nakshatra} · ${b.pada}`],
                      ['வான் அட்சரேகை', b.celestialLatitudeDms],
                      ['தூரம்', `${b.distanceAu.toFixed(8)} AU`],
                      ['நீள்கோட்டு நகர்வு', `${b.speedPerDay.toFixed(6)}° / நாள்`],
                      ['அட்சரேகை நகர்வு', `${b.latitudeSpeed.toFixed(6)}° / நாள்`],
                      ['கதி', b.retrograde ? 'வக்ரம் (பின்னோக்கி)' : 'நேர்கதி'],
                    ] as const).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 border-b border-line/40 py-0.5">
                        <dt className="text-ink-soft">{k}</dt><dd className="text-ink font-mono">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {b.retrograde && (
                    <p className="text-ink-soft mt-2">
                      நகர்வு எதிர்மறை — அதாவது ராசிச் சக்கரத்தில் பின்னோக்கி நகர்கிறது.
                      வக்ரம் என்பது இதுவே; தனியாக ஒரு அட்டவணையிலிருந்து
                      எடுக்கப்படவில்லை.
                    </p>
                  )}
                </div>
              ) : null;
            })()}
            <p className="text-[11px] text-ink-soft mt-2">ஒரு வரியை அழுத்தினால் முழு விவரம்.</p>
          </section>

          <section className="mb-4">
            <h2 className="text-sm font-semibold text-ink mb-2">பாவ எல்லைகள்</h2>
            <div className="overflow-x-auto border border-line rounded-2xl bg-surface">
              <table className="w-full text-xs" style={{ minWidth: 420 }}>
                <tbody>
                  {sky.cusps.map((c: any) => (
                    <tr key={c.house} className="border-b border-line/40">
                      <td className="py-1 px-3 text-ink-soft">{c.house}</td>
                      <td className="py-1 px-3 font-mono text-ink">{c.longitude}</td>
                      <td className="py-1 px-3 text-ink-soft">{c.rasi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3">
            <strong>இங்கே காட்டப்படாதவை:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              {sky.notComputed.map((n: string) => <li key={n}>{n}</li>)}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
