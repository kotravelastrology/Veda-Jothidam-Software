'use client';

import { useEffect, useState } from 'react';
import { listKpEvents, computeKpTimeScan } from './actions';

const CH = { lat: 13.0827, lon: 80.2707 };

const GRADE_STYLE: Record<string, string> = {
  DARK_GREEN: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  GREEN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function todayISO(hh = '06:00') {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)}T${hh}`;
}

export default function KpTimeScanView() {
  const [events, setEvents] = useState<{ key: string; name: string; nameTa: string }[]>([]);
  const [eventKey, setEventKey] = useState('001');
  const [startISO, setStartISO] = useState(todayISO('06:00'));
  const [endISO, setEndISO] = useState(todayISO('20:00'));
  const [stepMinutes, setStepMinutes] = useState(1);
  const [monetaryGain, setMonetaryGain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showRows, setShowRows] = useState(false);

  useEffect(() => { listKpEvents().then((evs) => { setEvents(evs); if (evs[0]) setEventKey(evs[0].key); }); }, []);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await computeKpTimeScan({
        eventKey, startISO, endISO, latitude: CH.lat, longitude: CH.lon, utcOffsetMinutes: 330,
        stepMinutes, monetaryGain,
      });
      if (!res.available) { setError(res.error || 'கணக்கிட முடியவில்லை'); setResult(null); }
      else setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const isAward = events.find((e) => e.key === eventKey)?.name === 'Apply for Getting an Award/Prize';

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">KP Muhurta time scan</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">KP முகூர்த்த நேரம் தேடல்</h1>
        <p className="text-sm text-ink-soft mt-1">
          தேர்ந்த நிகழ்விற்கு, தேதி வரம்பில் லக்ன துணை-அதிபதி மாறும் ஒவ்வொரு துல்லியமான நேர இடைவெளியையும்
          (விநாடி வரை) கணக்கிட்டு, நிகழ்வு விதிகள் + சிறப்பு நிபந்தனைகள் + பாதக/மாரக தடையின்றி இருக்கும்
          சிறந்த நேரங்களைத் தரவரிசைப்படுத்துகிறது. (சென்னை; அதிகபட்சம் 4 நாட்கள்)
        </p>
      </header>

      <div className="space-y-3 mb-4">
        <label className="block text-sm">
          <span className="block text-xs text-ink-soft mb-1">நிகழ்வு</span>
          <select value={eventKey} onChange={(e) => setEventKey(e.target.value)}
            className="w-full px-2 py-1.5 rounded border border-line bg-surface text-ink text-sm">
            {events.map((e) => <option key={e.key} value={e.key}>{e.nameTa || e.name} ({e.name})</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="block text-xs text-ink-soft mb-1">தொடக்கம்</span>
            <input type="datetime-local" value={startISO} onChange={(e) => setStartISO(e.target.value)}
              className="w-full px-2 py-1.5 rounded border border-line bg-surface text-ink text-sm" />
          </label>
          <label className="text-sm">
            <span className="block text-xs text-ink-soft mb-1">முடிவு</span>
            <input type="datetime-local" value={endISO} onChange={(e) => setEndISO(e.target.value)}
              className="w-full px-2 py-1.5 rounded border border-line bg-surface text-ink text-sm" />
          </label>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <span className="text-xs text-ink-soft">துல்லியம் (நிமிடம்)</span>
            <select value={stepMinutes} onChange={(e) => setStepMinutes(Number(e.target.value))}
              className="px-2 py-1 rounded border border-line bg-surface text-ink text-sm">
              {[1, 2, 5].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          {isAward && (
            <label className="flex items-center gap-1.5 text-xs text-ink-soft">
              <input type="checkbox" checked={monetaryGain} onChange={(e) => setMonetaryGain(e.target.checked)} />
              பணம் சார்ந்த பரிசு (house 2 சேர்க்கப்படும்)
            </label>
          )}
        </div>
        <button onClick={run} disabled={loading}
          className="px-4 py-2 bg-saffron text-ink font-semibold rounded hover:bg-saffron/90 disabled:opacity-50">
          {loading ? 'தேடுகிறது…' : '🔍 தேடு'}
        </button>
      </div>

      {error && <p className="text-rose-700 text-sm mb-4">⚠️ {error}</p>}

      {result && (
        <section>
          <p className="text-sm text-ink-soft mb-2">
            {result.eventNameTa || result.eventName} — {result.scannedIntervals} துணை-அதிபதி இடைவெளிகள் ஆராயப்பட்டன,
            {' '}{result.windows.length} சாதகமான நேரம் கிடைத்தது.
          </p>
          {result.windows.length === 0 && (
            <p className="text-sm text-ink-soft bg-surface-soft border border-line rounded p-3">
              இந்த வரம்பில் எந்த நேரமும் ஏற்றதாக இல்லை (GREEN/DARK_GREEN + தடையின்றி).
            </p>
          )}
          <div className="space-y-2">
            {result.windows.map((w: any) => (
              <div key={w.rank} className={`border rounded-lg p-3 ${GRADE_STYLE[w.code] || 'border-line bg-surface'}`}>
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">#{w.rank} {w.start} – {w.end}</span>
                  <span className="text-xs font-bold">{w.labelTa}</span>
                </div>
                <p className="text-xs mt-1">பரிந்துரைக்கப்பட்ட நேரம்: <b>{w.recommendedTime}</b> · கால அளவு {w.duration}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setShowRows((v) => !v)} className="text-xs text-ink-soft underline mt-4">
            {showRows ? 'எல்லா இடைவெளிகளையும் மறை' : `எல்லா ${result.rows.length} இடைவெளிகளையும் காட்டு`}
          </button>
          {showRows && (
            <table className="w-full text-xs mt-2">
              <thead><tr className="text-ink-soft border-b border-line">
                <th className="text-left py-1">நேரம்</th><th className="text-left py-1">துணை அதிபதி</th>
                <th className="text-left py-1">தடை</th><th className="text-left py-1">தரம்</th>
              </tr></thead>
              <tbody>
                {result.rows.map((r: any, i: number) => (
                  <tr key={i} className="border-b border-line/30">
                    <td className="py-0.5">{r.start}–{r.end}</td>
                    <td className="py-0.5">{r.signLord}/{r.starLord}/{r.subLord}</td>
                    <td className={`py-0.5 ${r.eligible ? 'text-emerald-700' : 'text-rose-700'}`}>{r.eligible ? 'இல்லை' : r.obstructionHits.join(',')}</td>
                    <td className="py-0.5">{r.grade.labelTa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      <p className="text-[11px] text-ink-soft mt-6">முந்தைய kp-muhurat-workspace sub_level_analysis / search_candidate_windows-லிருந்து port.</p>
    </main>
  );
}
