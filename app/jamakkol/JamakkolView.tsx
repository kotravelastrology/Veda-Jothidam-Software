'use client';

import { useState } from 'react';
import { computeJamakkol, type JamakkolQuery } from './actions';

const POINT_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
  Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const hm = (h: number) => {
  const H = Math.floor(((h % 24) + 24) % 24);
  const M = Math.round((h - Math.floor(h)) * 60) % 60;
  return `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`;
};

export default function JamakkolView() {
  const now = new Date();
  const [dt, setDt] = useState(() => {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}T${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
  });
  const [lat, setLat] = useState('13.0827');
  const [lng, setLng] = useState('80.2707');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const [datePart, timePart] = dt.split('T');
      const [Y, Mo, D] = datePart.split('-').map(Number);
      const [h, mi, s] = timePart.split(':').map(Number);
      const q: JamakkolQuery = {
        year: Y, month: Mo, day: D, hour: h, minute: mi, second: s || 0,
        latitude: parseFloat(lat), longitude: parseFloat(lng), utcOffsetMinutes: 330,
      };
      setResult(await computeJamakkol(q));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Jamakkol Prasnam</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஜாமக்கோள் ப்ரசன்னம்</h1>
        <p className="text-sm text-ink-soft mt-1">
          சூரிய உதயத்தை அடிப்படையாகக் கொண்ட தமிழ் ப்ரசன்னம் — கேள்வி நேரம் + இடம் மட்டும் தேவை.
          உதயம் / ஆரூடம் / கவிப்பு, 8 ஜாமக் கிரகங்கள், நோக்கி வரும் கோள் %.
        </p>
      </header>

      <div className="bg-surface border border-line rounded-2xl p-5 mb-6 grid sm:grid-cols-3 gap-3 text-sm">
        <label className="sm:col-span-1">
          <span className="block text-ink-soft mb-1">கேள்வி நேரம்</span>
          <input type="datetime-local" step={1} value={dt} onChange={(e) => setDt(e.target.value)}
            className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" />
        </label>
        <label>
          <span className="block text-ink-soft mb-1">அட்சரேகை</span>
          <input value={lat} onChange={(e) => setLat(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" />
        </label>
        <label>
          <span className="block text-ink-soft mb-1">தீர்க்கரேகை</span>
          <input value={lng} onChange={(e) => setLng(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" />
        </label>
        <button onClick={run} disabled={loading}
          className="sm:col-span-3 px-4 py-2 bg-saffron text-ink rounded font-medium disabled:opacity-50">
          {loading ? 'கணக்கிடுகிறது…' : 'கணக்கிடு'}
        </button>
      </div>
      {error && <p className="text-rose text-sm mb-4">⚠️ {error}</p>}

      {result?.available && (
        <div className="space-y-6">
          <div className="text-sm text-ink-soft">
            சூரிய உதயம் {hm(result.sunriseHr)} · அஸ்தமனம் {hm(result.sunsetHr)} · {result.isNight ? 'இரவு' : 'பகல்'} · நடப்பு ஜாமம் {result.activeJama}
          </div>

          <div className="bg-surface border border-line rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-ink mb-2">முக்கிய புள்ளிகள்</h2>
            <table className="w-full text-sm">
              <thead><tr className="text-ink-soft border-b border-line">
                <th className="text-left py-1">புள்ளி</th><th className="text-left py-1">ராசி</th><th className="text-right py-1">பாகை</th>
                <th className="text-left py-1 pl-3">KP</th><th className="text-left py-1 pl-3">நோக்கி வரும் கோள்</th>
              </tr></thead>
              <tbody>
                {result.points.map((p: any) => (
                  <tr key={p.label} className="border-b border-line/40">
                    <td className="py-1.5">{p.label}</td>
                    <td className="py-1.5">{p.rasiName}</td>
                    <td className="py-1.5 text-right tabular-nums">{p.deg.toFixed(2)}°</td>
                    <td className="py-1.5 pl-3 text-xs text-ink-soft">
                      {[p.kp.signLord, p.kp.starLord, p.kp.sub, p.kp.subSub].map((x: string) => POINT_TA[x] ?? x).join(':')}
                    </td>
                    <td className="py-1.5 pl-3">
                      <span className="text-ink">{p.nokki.lord}</span> <span className="text-saffron font-medium">{p.nokki.pct}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-ink-soft mt-2">கவிப்பு: {result.kavippu.vithiName}</p>
          </div>

          <div className="bg-surface border border-line rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-ink mb-2">8 ஜாமக் கிரகங்கள்</h2>
            <table className="w-full text-sm">
              <thead><tr className="text-ink-soft border-b border-line">
                <th className="text-left py-1">#</th><th className="text-left py-1">கிரகம்</th><th className="text-left py-1">ராசி</th>
                <th className="text-right py-1">பாகை</th><th className="text-left py-1 pl-3">நேரம்</th>
              </tr></thead>
              <tbody>
                {result.jamas.map((j: any) => (
                  <tr key={j.jamaNum} className={`border-b border-line/40 ${j.active ? 'bg-saffron/10 font-semibold' : ''}`}>
                    <td className="py-1.5">{j.jamaNum}{j.active ? ' ·நடப்பு' : ''}</td>
                    <td className="py-1.5">{j.lordTa}</td>
                    <td className="py-1.5">{j.rasiName}</td>
                    <td className="py-1.5 text-right tabular-nums">{j.degInRasi.toFixed(2)}°</td>
                    <td className="py-1.5 pl-3 text-ink-soft">{hm(j.startHr)}–{hm(j.endHr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-ink-soft">
            முந்தைய ஜாமக்கோள் native app-ன் engine-லிருந்து port · சூரிய நிலை Swiss Ephemeris-ல் இருந்து · உதயம்/ஆரூடம்/கவிப்பு/ஜாம கணிதம் மாற்றமில்லை.
          </p>
        </div>
      )}
    </main>
  );
}
