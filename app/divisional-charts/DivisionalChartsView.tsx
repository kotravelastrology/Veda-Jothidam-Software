'use client';

import { useState } from 'react';
import { useSettings, toEngineOptions } from '@/src/ui/SettingsPanel';
import { VedicChartBox } from '@/src/charts/kattam/VedicChartBox';
import type { ChartGraha } from '@/src/charts/kattam/rasiNames';
import { computeDivisionalCharts } from './actions';

const VARGA_INFO: Record<string, { tamil: string; purpose: string }> = {
  D1: { tamil: 'ராசி', purpose: 'Birth chart — body, life as a whole' },
  D2: { tamil: 'ஹோரை', purpose: 'Wealth (lord-based, not a rasi chart)' },
  D3: { tamil: 'த்ரேக்காணம்', purpose: 'Siblings, courage' },
  D4: { tamil: 'சதுர்த்தாம்சம்', purpose: 'Property, fortune' },
  D7: { tamil: 'சப்தாம்சம்', purpose: 'Children, progeny' },
  D9: { tamil: 'நவாம்சம்', purpose: 'Spouse, dharma, overall strength' },
  D10: { tamil: 'தசாம்சம்', purpose: 'Profession, status' },
  D12: { tamil: 'த்வாதசாம்சம்', purpose: 'Parents, ancestry' },
  D16: { tamil: 'ஷோடசாம்சம்', purpose: 'Vehicles, comforts' },
  D20: { tamil: 'விம்சாம்சம்', purpose: 'Spiritual practice' },
  D24: { tamil: 'சதுர்விம்சாம்சம்', purpose: 'Learning, education' },
  D27: { tamil: 'நக்ஷத்ராம்சம்', purpose: 'Strengths and weaknesses' },
  D30: { tamil: 'த்ரிம்சாம்சம்', purpose: 'Misfortunes, evils' },
  D40: { tamil: 'கவேதாம்சம்', purpose: 'Maternal legacy' },
  D45: { tamil: 'அக்ஷவேதாம்சம்', purpose: 'Paternal legacy, conduct' },
  D60: { tamil: 'ஷஷ்டியம்சம்', purpose: 'All past-karma results' },
};

const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

interface VargaChart {
  key: string;
  lagnaRasiIndex: number;
  grahas: ChartGraha[];
  rows: Array<{ id: string; sign: string }>;
}

export default function DivisionalChartsView() {
  const [birthData, setBirthData] = useState({
    date: '1990-05-15',
    time: '10:30:00',
    latitude: '13.0827',
    longitude: '80.2707',
  });
  const { settings } = useSettings();
  const [charts, setCharts] = useState<VargaChart[]>([]);
  const [hora, setHora] = useState<Array<{ id: string; lord: string }>>([]);
  const [activeKey, setActiveKey] = useState('D1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compute = async () => {
    setLoading(true);
    setError(null);
    try {
      const [year, month, day] = birthData.date.split('-').map(Number);
      const timeParts = birthData.time.split(':').map(Number);

      const result = await computeDivisionalCharts({
        name: '',
        gender: 'male',
        year, month, day,
        hour: timeParts[0],
        minute: timeParts[1] || 0,
        ianaTimeZone: 'Asia/Kolkata',
        utcOffsetMinutes: 330,
        latitude: parseFloat(birthData.latitude),
        longitude: parseFloat(birthData.longitude),
        placeName: '',
        ...toEngineOptions(settings),
      });

      // D2 (Hora) yields a lord, not a rasi, so it cannot go in a rasi grid.
      const vargaKeys = Object.keys(result.vargas.Lagna)
        .filter(k => k !== 'source' && k !== 'D2')
        .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

      const present = ALL_GRAHAS.filter(p => result.vargas[p]);

      const built: VargaChart[] = vargaKeys.map(key => {
        const grahas: ChartGraha[] = present.map(id => ({
          id,
          rasiIndex: result.vargas[id][key].signIndex,
          // Only D1 has a meaningful degree within its sign; a varga placement
          // is a whole-sign result, so no degree is shown for D3+.
          degreeInSign: key === 'D1' ? result.grahas[id].degreeInSign : undefined,
        }));
        return {
          key,
          lagnaRasiIndex: result.vargas.Lagna[key].signIndex,
          grahas,
          rows: [
            { id: 'Lagna', sign: result.vargas.Lagna[key].sign },
            ...present.map(id => ({ id, sign: result.vargas[id][key].sign })),
          ],
        };
      });

      setCharts(built);
      setHora([
        { id: 'Lagna', lord: result.vargas.Lagna.D2.lord },
        ...present.map(id => ({ id, lord: result.vargas[id].D2.lord })),
      ]);
      setActiveKey(built.some(c => c.key === 'D1') ? 'D1' : built[0]?.key ?? 'D1');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const active = charts.find(c => c.key === activeKey);
  const info = VARGA_INFO[activeKey];

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Divisional Charts
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          வர்க கட்டங்கள் (Divisional Charts)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Swiss Ephemeris நிலைகளிலிருந்து BPHS Ch.6 விதிகளின்படி கணக்கிடப்பட்ட வர்கங்கள்.
        </p>
      </header>

      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த தேதி</span>
            <input type="date" value={birthData.date}
              onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded" />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த நேரம்</span>
            <input type="time" step="1" value={birthData.time}
              onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded" />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">அட்சரேகை</span>
            <input type="number" step="0.0001" value={birthData.latitude}
              onChange={(e) => setBirthData({ ...birthData, latitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded" />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">தீர்க்கரேகை</span>
            <input type="number" step="0.0001" value={birthData.longitude}
              onChange={(e) => setBirthData({ ...birthData, longitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded" />
          </label>
        </div>
        <button onClick={compute} disabled={loading}
          className="w-full px-4 py-2 bg-saffron text-ink rounded font-medium disabled:opacity-50 hover:bg-saffron/90">
          {loading ? 'Swiss Ephemeris கணக்கிடுகிறது…' : 'வர்க கணக்கிடு'}
        </button>
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">{error}</div>
      )}

      {charts.length > 0 && (
        <>
          <div className="mb-6 border-b border-line">
            <div className="flex gap-1 overflow-x-auto pb-2">
              {charts.map(c => (
                <button key={c.key} onClick={() => setActiveKey(c.key)}
                  className={`px-3 py-2 whitespace-nowrap border-b-2 transition ${
                    activeKey === c.key
                      ? 'border-saffron text-saffron'
                      : 'border-transparent text-ink-soft hover:text-ink'
                  }`}>
                  <span className="block text-[10px] text-ink-soft">{VARGA_INFO[c.key]?.tamil ?? ''}</span>
                  <span className="text-sm font-medium">{c.key}</span>
                </button>
              ))}
            </div>
          </div>

          {active && (
            <div className="space-y-6">
              <div className="bg-info/10 border border-info rounded-lg p-4">
                <h2 className="font-semibold text-ink">
                  {active.key} — {info?.tamil}
                </h2>
                <p className="text-sm text-ink-soft mt-1">{info?.purpose}</p>
              </div>

              <div className="bg-surface border border-line rounded-2xl p-6 flex justify-center">
                <VedicChartBox
                  lagnaRasiIndex={active.lagnaRasiIndex}
                  grahas={active.grahas}
                  title={`${active.key} — ${info?.tamil ?? ''}`}
                />
              </div>

              <div className="bg-surface border border-line rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-ink mb-4">
                  {active.key} ராசி நிலைகள்
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line text-ink-soft text-xs uppercase">
                        <th className="text-left py-2 pr-4 font-semibold">கிரகம்</th>
                        <th className="text-left py-2 font-semibold">ராசி</th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.rows.map(row => (
                        <tr key={row.id} className="border-b border-line/40">
                          <td className="py-2 pr-4 font-medium text-ink">{row.id}</td>
                          <td className="py-2 text-ink-soft">{row.sign}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-surface border border-line rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-ink mb-1">D2 (ஹோரை) — {VARGA_INFO.D2.tamil}</h3>
            <p className="text-xs text-ink-soft mb-4">
              ஹோரை ஒரு ராசியை அல்ல, அதிபதியை (சூரியன்/சந்திரன்) தருகிறது — எனவே கட்டமாக காட்டப்படவில்லை.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              {hora.map(h => (
                <div key={h.id} className="p-2 rounded border border-line/40">
                  <p className="font-medium text-ink">{h.id}</p>
                  <p className="text-xs text-ink-soft">{h.lord}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {charts.length === 0 && !loading && (
        <div className="text-center py-12 text-ink-soft">
          <p className="text-sm">வர்க கட்டங்களைப் பார்க்க மேலே பொத்தான் கிளிக் செய்யுங்கள்.</p>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>BPHS Ch.6 — வர்க பிரிவு விதிகள்; D30 மற்றும் D60 சம பிரிவு அல்லாத சிறப்பு விதிகளைப் பின்பற்றுகின்றன.</p>
      </footer>
    </main>
  );
}
