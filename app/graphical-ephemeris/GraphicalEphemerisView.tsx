'use client';

import { useState } from 'react';
import { computeGraphicalEphemeris } from './actions';

/**
 * Sidereal longitude against time for the slow and middle planets. Pure astronomy (Swiss Ephemeris), so no book is cited; the
 * ayanamsha and the node model are the reader's choice and are named on the chart. A line leaves the top of the chart and returns
 * at the bottom when a planet crosses 0 degrees Aries; the line is broken there, not joined across.
 */

const PLANETS = ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
/** Eight hues told apart in both themes by hue and by the dash pattern. */
const STYLE: Record<string, { color: string; dash?: string }> = {
  Sun: { color: '#d97706' }, Mars: { color: '#dc2626' }, Mercury: { color: '#16a34a' }, Jupiter: { color: '#ca8a04', dash: '6 3' },
  Venus: { color: '#db2777' }, Saturn: { color: '#2563eb' }, Rahu: { color: '#7c3aed', dash: '2 3' }, Ketu: { color: '#0891b2', dash: '2 3' },
};
const KIND_TA: Record<string, string> = { RETROGRADE: 'வக்ரம் தொடக்கம்', DIRECT: 'வக்ர நிவர்த்தி' };

export default function GraphicalEphemerisView() {
  const now = new Date();
  const [form, setForm] = useState({ year: String(now.getFullYear()), month: '1', years: '1', ayanamsha: 'Lahiri', nodeType: 'mean', offset: '330' });
  const [planets, setPlanets] = useState<string[]>(['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setError(null);
    try {
      setData(await computeGraphicalEphemeris({
        year: parseInt(form.year, 10), month: parseInt(form.month, 10), years: parseInt(form.years, 10), planets,
        ayanamsha: form.ayanamsha, nodeType: form.nodeType as 'mean' | 'true', utcOffsetMinutes: parseInt(form.offset, 10),
      }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setLoading(false); }
  };
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Graphical ephemeris</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">வரைபட எபிமெரிஸ்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          கிரகங்களின் நிரயன நீள்கோடு காலத்தோடு எப்படி நகர்கிறது என்பதை வரைபடமாகக் காட்டுகிறது; ராசி மாற்றங்களும் வக்ரம், வக்ர நிவர்த்தி நாட்களும் கீழே பட்டியலாக.
          இது வானியல் கணக்கு (Swiss Ephemeris) — எந்த நூலின் விதியும் இல்லை; அயனாம்சமும் ராகு-கேது வகையும் நீங்கள் தேர்வது.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <label className="text-xs text-ink-soft">தொடக்க ஆண்டு<br /><input className={`${field} w-24`} value={form.year} onChange={set('year')} /></label>
          <label className="text-xs text-ink-soft">மாதம்<br /><select className={field} value={form.month} onChange={set('month')}>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label>
          <label className="text-xs text-ink-soft">காலம்<br /><select className={field} value={form.years} onChange={set('years')}>{[1, 2, 5, 10].map((y) => <option key={y} value={y}>{y} ஆண்டு</option>)}</select></label>
          <label className="text-xs text-ink-soft">அயனாம்சம்<br /><select className={field} value={form.ayanamsha} onChange={set('ayanamsha')}>{['Lahiri', 'Raman', 'Krishnamurti'].map((a) => <option key={a}>{a}</option>)}</select></label>
          <label className="text-xs text-ink-soft">ராகு-கேது<br /><select className={field} value={form.nodeType} onChange={set('nodeType')}><option value="mean">சராசரி</option><option value="true">உண்மை</option></select></label>
          <label className="text-xs text-ink-soft">நேர மண்டலம் (நிமிடம்)<br /><input className={`${field} w-20`} value={form.offset} onChange={set('offset')} /></label>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {PLANETS.map((p) => (
            <label key={p} className="flex items-center gap-1 text-xs">
              <input type="checkbox" checked={planets.includes(p)} onChange={(e) => setPlanets(e.target.checked ? [...planets, p] : planets.filter((x) => x !== p))} />
              <span style={{ color: STYLE[p].color }}>■</span> {PLANET_TA[p]}
            </label>
          ))}
        </div>
        <button type="button" onClick={run} disabled={loading || planets.length === 0} className="mt-3 px-3 py-1.5 rounded bg-saffron text-ink text-sm disabled:opacity-50">
          {loading ? 'கணக்கிடுகிறது…' : 'வரைபடம் காட்டு'}
        </button>
        {error && <p className="text-rose text-sm mt-2">⚠️ {error}</p>}
      </section>

      {data && <Chart data={data} ayanamsha={form.ayanamsha} nodeType={form.nodeType} />}
      {data && <EventTable data={data} />}
    </main>
  );
}

function Chart({ data, ayanamsha, nodeType }: { data: any; ayanamsha: string; nodeType: string }) {
  const W = 900; const H = 560; const L = 70; const R = 12; const T = 12; const B = 34;
  const x = (day: number) => L + (day / data.days) * (W - L - R);
  const y = (lon: number) => T + (1 - lon / 360) * (H - T - B);
  const start = new Date(`${data.startLabel}T00:00:00Z`);
  const ticks: { day: number; label: string }[] = [];
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  const stepMonths = data.days > 1500 ? 12 : data.days > 800 ? 3 : 1;
  while ((cursor.getTime() - start.getTime()) / 86400000 <= data.days) {
    const day = (cursor.getTime() - start.getTime()) / 86400000;
    if (day >= 0) ticks.push({ day, label: stepMonths >= 12 || cursor.getUTCMonth() === 0 ? String(cursor.getUTCFullYear()) : `${cursor.getUTCMonth() + 1}`});
    cursor.setUTCMonth(cursor.getUTCMonth() + stepMonths);
  }
  return (
    <section className="bg-surface border border-line rounded-2xl p-3 mb-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Graphical ephemeris">
        {SIGN_TA.map((s, i) => (
          <g key={s}>
            <rect x={L} y={y((i + 1) * 30)} width={W - L - R} height={y(i * 30) - y((i + 1) * 30)} fill={i % 2 ? 'transparent' : 'currentColor'} opacity={0.04} />
            <line x1={L} x2={W - R} y1={y(i * 30)} y2={y(i * 30)} stroke="currentColor" opacity={0.2} />
            <text x={L - 6} y={y(i * 30 + 15) + 4} textAnchor="end" fontSize="11" fill="currentColor" opacity={0.75}>{s}</text>
          </g>
        ))}
        <line x1={L} x2={W - R} y1={y(360)} y2={y(360)} stroke="currentColor" opacity={0.2} />
        {ticks.map((t) => (
          <g key={t.day}>
            <line x1={x(t.day)} x2={x(t.day)} y1={T} y2={H - B} stroke="currentColor" opacity={0.12} />
            <text x={x(t.day)} y={H - B + 15} textAnchor="middle" fontSize="11" fill="currentColor" opacity={0.75}>{t.label}</text>
          </g>
        ))}
        {Object.entries(data.series).map(([p, pts]: [string, any]) => {
          const segs: string[] = [];
          let cur = '';
          pts.forEach(([day, lon]: number[], i: number) => {
            const prev = i > 0 ? pts[i - 1][1] : lon;
            if (i === 0 || Math.abs(lon - prev) > 180) { if (cur) segs.push(cur); cur = `M${x(day).toFixed(1)},${y(lon).toFixed(1)}`; } else cur += `L${x(day).toFixed(1)},${y(lon).toFixed(1)}`;
          });
          if (cur) segs.push(cur);
          return <path key={p} d={segs.join('')} fill="none" stroke={STYLE[p].color} strokeWidth={1.6} strokeDasharray={STYLE[p].dash} />;
        })}
        {data.events.filter((e: any) => e.kind !== 'INGRESS' && data.series[e.planet]).map((e: any, i: number) => {
          const lon = e.signTa ? ((SIGN_TA.indexOf(e.signTa) * 30) + e.degree) : 0;
          return <circle key={i} cx={x(e.day)} cy={y(lon)} r={3} fill={STYLE[e.planet].color} stroke="white" strokeWidth={0.8}><title>{`${e.planetTa} ${KIND_TA[e.kind]} · ${e.when}`}</title></circle>;
        })}
      </svg>
      <p className="text-[11px] text-ink-soft mt-1">
        {ayanamsha} அயனாம்சம் · ராகு-கேது {nodeType === 'true' ? 'உண்மை' : 'சராசரி'} · புள்ளிகள் = வக்ரம் அல்லது வக்ர நிவர்த்தி நாள்.
      </p>
    </section>
  );
}

function EventTable({ data }: { data: any }) {
  const [only, setOnly] = useState<'ALL' | 'INGRESS' | 'STATION'>('ALL');
  const rows = data.events.filter((e: any) => only === 'ALL' || (only === 'INGRESS' ? e.kind === 'INGRESS' : e.kind !== 'INGRESS'));
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 text-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-ink">ராசி மாற்றங்களும் வக்ர நாட்களும் ({rows.length})</h2>
        <div className="flex gap-1 text-xs">
          {([['ALL', 'எல்லாம்'], ['INGRESS', 'ராசி மாற்றம்'], ['STATION', 'வக்ரம்']] as const).map(([k, l]) => (
            <button key={k} type="button" onClick={() => setOnly(k)} className={`px-2 py-1 rounded border ${only === k ? 'bg-ink text-surface border-ink' : 'border-line text-ink'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-surface"><tr className="text-left text-ink-soft"><th className="py-1 pr-2">தேதி-நேரம்</th><th className="pr-2">கிரகம்</th><th className="pr-2">நிகழ்வு</th><th>இடம்</th></tr></thead>
          <tbody>
            {rows.map((e: any, i: number) => (
              <tr key={i} className="border-t border-line/40" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <td className="py-1 pr-2">{e.when}</td>
                <td className="pr-2"><span style={{ color: STYLE[e.planet].color }}>■</span> {e.planetTa}</td>
                <td className="pr-2">{e.kind === 'INGRESS' ? `${e.signTa} ராசிக்குள் நுழைகிறது${e.backward ? ' (பின்னோக்கி)' : ''}` : KIND_TA[e.kind]}</td>
                <td>{e.kind === 'INGRESS' ? `${e.signTa} ${e.backward ? '30°' : '0°'}` : `${e.signTa} ${e.degree.toFixed(2)}°`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
