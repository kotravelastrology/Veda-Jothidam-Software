'use client';

import { useState } from 'react';
import { computeDailyMuhurta, type DayQuery } from './actions';

const POINT_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
  Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி',
};
const Q_CLASS: Record<string, string> = { good: 'text-teal', neutral: 'text-ink-soft', bad: 'text-rose' };

function SlotTable({ title, rows, render }: { title: string; rows: any[]; render: (r: any) => React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-ink-soft mb-1">{title}</p>
      <table className="w-full text-xs">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/40">
              <td className="py-1 pr-2 text-ink-soft whitespace-nowrap">{r.from}–{r.to}</td>
              <td className="py-1">{render(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NallaNeramView() {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  const [date, setDate] = useState(`${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`);
  const [lat, setLat] = useState('13.0827');
  const [lng, setLng] = useState('80.2707');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'chog' | 'gowri' | 'hora'>('gowri');

  const run = async () => {
    setLoading(true);
    try {
      const [Y, M, D] = date.split('-').map(Number);
      const q: DayQuery = { year: Y, month: M, day: D, latitude: parseFloat(lat), longitude: parseFloat(lng), utcOffsetMinutes: 330 };
      setResult(await computeDailyMuhurta(q));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Nalla Neram</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">நல்ல நேரம்</h1>
        <p className="text-sm text-ink-soft mt-1">
          கௌரி பஞ்சாங்கம் · சோகதியா · ஹோரை — சூரிய உதயம்/அஸ்தமனம் அடிப்படையில் 8+8 (ஹோரை 12+12) பகுதிகள்.
        </p>
      </header>

      <div className="bg-surface border border-line rounded-2xl p-5 mb-6 grid sm:grid-cols-4 gap-3 text-sm">
        <label><span className="block text-ink-soft mb-1">தேதி</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" /></label>
        <label><span className="block text-ink-soft mb-1">அட்சரேகை</span>
          <input value={lat} onChange={(e) => setLat(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" /></label>
        <label><span className="block text-ink-soft mb-1">தீர்க்கரேகை</span>
          <input value={lng} onChange={(e) => setLng(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" /></label>
        <button onClick={run} disabled={loading} className="px-4 py-1.5 bg-saffron text-ink rounded font-medium disabled:opacity-50 self-end">
          {loading ? '…' : 'கணக்கிடு'}
        </button>
      </div>

      {result?.available && (
        <div className="bg-surface border border-line rounded-2xl p-5">
          <p className="text-sm text-ink-soft mb-3">சூரிய உதயம் {result.sunrise} · அஸ்தமனம் {result.sunset}</p>

          {result.panchakaRahitam && (
            <div className="mb-4 grid sm:grid-cols-3 gap-3 text-sm">
              <div className="border border-line rounded-lg p-3">
                <p className="text-xs text-ink-soft mb-1">பஞ்சகம் (சந்திரன்)</p>
                <p className={result.panchaka.active ? (result.panchaka.type?.severity === 'good' ? 'text-teal font-medium' : 'text-rose font-medium') : 'text-ink-soft'}>
                  {result.panchaka.active ? result.panchaka.type?.name : 'இல்லை'}
                </p>
                {result.panchaka.active && <p className="text-[11px] text-ink-soft mt-1">{result.panchaka.type?.note}</p>}
              </div>
              <div className="border border-line rounded-lg p-3">
                <p className="text-xs text-ink-soft mb-1">நக்ஷத்திர கர்மம்</p>
                <p className="font-medium">{result.nakshatraKarma.nameTa}</p>
                <p className="text-[11px] text-ink-soft mt-1">{result.nakshatraKarma.suitable}</p>
              </div>
              <div className="border border-line rounded-lg p-3">
                <p className="text-xs text-ink-soft mb-1">பஞ்சக ரஹிதம் (லக்ன சுத்தி) — மீதி {result.panchakaRahitam.remainder}</p>
                <p className={result.panchakaRahitam.ok ? 'text-teal font-medium' : 'text-rose font-medium'}>{result.panchakaRahitam.ta}</p>
                <p className="text-[11px] text-ink-soft mt-1">{result.panchakaRahitam.effect}</p>
              </div>
            </div>
          )}
          <div className="flex gap-1 mb-3 text-xs">
            {([['gowri', 'கௌரி'], ['chog', 'சோகதியா'], ['hora', 'ஹோரை']] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-2 py-1 rounded ${tab === k ? 'bg-saffron text-ink' : 'bg-surface border border-line text-ink-soft'}`}>{l}</button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {tab === 'gowri' && <>
              <SlotTable title="பகல்" rows={result.gowri.day} render={(r) => (
                <span className={r.auspicious ? 'text-teal' : 'text-rose'}>{r.nameTa}</span>
              )} />
              <SlotTable title="இரவு" rows={result.gowri.night} render={(r) => (
                <span className={r.auspicious ? 'text-teal' : 'text-rose'}>{r.nameTa}</span>
              )} />
            </>}
            {tab === 'chog' && <>
              <SlotTable title="பகல்" rows={result.choghadiya.day} render={(r) => (
                <span className={Q_CLASS[r.quality]}>{r.nameTa} <span className="text-ink-soft">({POINT_TA[r.lord] ?? r.lord})</span></span>
              )} />
              <SlotTable title="இரவு" rows={result.choghadiya.night} render={(r) => (
                <span className={Q_CLASS[r.quality]}>{r.nameTa} <span className="text-ink-soft">({POINT_TA[r.lord] ?? r.lord})</span></span>
              )} />
            </>}
            {tab === 'hora' && <>
              <SlotTable title="பகல்" rows={result.hora.day} render={(r) => (
                <span className={Q_CLASS[r.quality]}>{POINT_TA[r.lord] ?? r.lord} <span className="text-ink-soft text-[10px]">{r.note}</span></span>
              )} />
              <SlotTable title="இரவு" rows={result.hora.night} render={(r) => (
                <span className={Q_CLASS[r.quality]}>{POINT_TA[r.lord] ?? r.lord}</span>
              )} />
            </>}
          </div>
          <p className="text-[11px] text-ink-soft mt-3">
            கௌரி: ஜாதக அலங்காரம் + அகத்தியர் கௌரி · சோகதியா: F03 doctrine · ஹோரை: Chaldean வரிசை.
            முந்தைய AstrologicLab timing suite-லிருந்து port.
          </p>
        </div>
      )}
    </main>
  );
}
