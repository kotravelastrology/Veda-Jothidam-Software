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
  const [place, setPlace] = useState('சென்னை');
  const [lat, setLat] = useState('13.0827');
  const [lng, setLng] = useState('80.2707');
  // The offset used to be fixed at +05:30 while the coordinates were free, so
  // any place outside India produced a full day of wrong clock times with
  // nothing on screen saying so. It is an input now, and it is displayed.
  const [offset, setOffset] = useState('330');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'chog' | 'gowri' | 'hora'>('gowri');

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const [Y, M, D] = date.split('-').map(Number);
      const q: DayQuery = {
        year: Y, month: M, day: D,
        latitude: parseFloat(lat), longitude: parseFloat(lng),
        utcOffsetMinutes: parseInt(offset, 10), placeName: place.trim() || undefined,
      };
      setResult(await computeDailyMuhurta(q));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
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

      <div className="bg-surface border border-line rounded-2xl p-5 mb-6 grid sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
        <label><span className="block text-ink-soft mb-1">தேதி</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" /></label>
        <label><span className="block text-ink-soft mb-1">இடம்</span>
          <input value={place} onChange={(e) => setPlace(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" /></label>
        <label><span className="block text-ink-soft mb-1">அட்சரேகை</span>
          <input value={lat} onChange={(e) => setLat(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" /></label>
        <label><span className="block text-ink-soft mb-1">தீர்க்கரேகை</span>
          <input value={lng} onChange={(e) => setLng(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" /></label>
        <label><span className="block text-ink-soft mb-1">UTC (நிமிடம்)</span>
          <input value={offset} onChange={(e) => setOffset(e.target.value)} className="w-full px-2 py-1 bg-ink-soft/10 border border-line rounded" /></label>
        <button onClick={run} disabled={loading} className="px-4 py-1.5 bg-saffron text-ink rounded font-medium disabled:opacity-50 self-end">
          {loading ? '…' : 'கணக்கிடு'}
        </button>
      </div>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result?.available && (
        <div className="bg-surface border border-line rounded-2xl p-5">
          {/* Which day, where, under what — every row below is a clock time cut
              from sunrise at these coordinates, so the table is unreadable
              without them. */}
          {result.context && (
            <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs border-b border-line pb-3">
              <dt className="text-ink-soft">நாள்</dt>
              <dd className="text-ink">
                {result.context.date} · {result.context.weekdayTa}
                <span className="text-ink-soft"> (அதிபதி {POINT_TA[result.context.weekdayLord] ?? result.context.weekdayLord} — மூன்று சுழற்சியும் இதிலிருந்தே தொடங்குகின்றன)</span>
              </dd>
              <dt className="text-ink-soft">இடம்</dt>
              <dd className="text-ink">
                {result.context.placeName ?? '—'} · {result.context.latitude}, {result.context.longitude} · UTC{result.context.utcOffset}
              </dd>
              <dt className="text-ink-soft">முறை</dt>
              <dd className="text-ink">
                {result.context.method.ayanamsha} அயனாம்சம் · நாள் தொடக்கம் {result.context.method.dayBoundary === 'sunrise' ? 'சூரிய உதயம்' : result.context.method.dayBoundary}
                <span className="block text-ink-soft">{result.context.method.division}</span>
              </dd>
            </dl>
          )}
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
          {/* What the chosen table is, and how its sequence was fixed for this
              day — the same "why", not only "what", the porutham factors
              carry. */}
          <p className="text-xs text-ink-soft bg-ink-soft/5 rounded-lg p-3 mb-3 leading-relaxed">
            {tab === 'gowri' && (
              <>
                <strong className="text-ink">கௌரி பஞ்சாங்கம்</strong> — பகலையும் இரவையும் தலா 8 பகுதிகளாகப்
                பிரித்து, உத்தி · அமுதம் · ரோகம் · சோரம் · இலாபம் · தனம் · விஷம் · சுகம் என்ற
                வரிசையில் பெயரிடுகிறது. இவற்றுள் உத்தி, அமுதம், இலாபம், தனம், சுகம் நல்லவை.
                {result.context && <> இந்த {result.context.weekdayTa} அன்று வரிசை எங்கு தொடங்குகிறது
                என்பதைக் கிழமையே தீர்மானிக்கிறது — எனவே வேறு நாளில் இதே நேரம் வேறு பெயரைப் பெறும்.</>}
              </>
            )}
            {tab === 'chog' && (
              <>
                <strong className="text-ink">சோகதியா</strong> — அதே 8+8 பிரிவு, ஆனால் ஒவ்வொரு
                பகுதியும் ஒரு கிரகத்திற்கு உரியது: அமிர்த · சுப · லாப நல்லவை, சல சமம்,
                உத்வேக · கால · ரோக தவிர்க்கத்தக்கவை.
                {result.context && <> தொடக்கப் புள்ளி {result.context.weekdayTa} கிழமையால் நிர்ணயிக்கப்படுகிறது.</>}
              </>
            )}
            {tab === 'hora' && (
              <>
                <strong className="text-ink">ஹோரை</strong> — பகலும் இரவும் தலா 12 பகுதிகள்.
                {result.context && <> {result.context.weekdayTa} கிழமையின் அதிபதி
                {' '}{POINT_TA[result.context.weekdayLord] ?? result.context.weekdayLord} முதல் ஹோரையை ஆள்கிறது;</>}
                {' '}அதிலிருந்து சனி · குரு · செவ்வாய் · சூரியன் · சுக்கிரன் · புதன் · சந்திரன் என்ற
                கல்தேய (Chaldean) வரிசையில் தொடர்கிறது.
              </>
            )}
          </p>

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
