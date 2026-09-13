'use client';

import { useState } from 'react';
import { JamakkolChartBox } from '@/src/charts/kattam/JamakkolChartBox';

// Divisional chart types (Vargas)
const CHARTS = [
  { id: 'D1', name: 'D1 (Rasi)', tamil: 'D1 (ராசி)', description: 'Birth chart' },
  { id: 'D2', name: 'D2 (Hora)', tamil: 'D2 (ஹோரை)', description: 'Wealth' },
  { id: 'D3', name: 'D3 (Drekkana)', tamil: 'D3 (த்ரேக்கணை)', description: 'Courage & siblings' },
  { id: 'D4', name: 'D4 (Chatramsha)', tamil: 'D4 (சதுரம்சை)', description: 'Property' },
  { id: 'D5', name: 'D5 (Panchamsha)', tamil: 'D5 (பஞ்சாம்சை)', description: 'Children' },
  { id: 'D7', name: 'D7 (Saptamsha)', tamil: 'D7 (சப்தாம்சை)', description: 'Health' },
  { id: 'D9', name: 'D9 (Navamsha)', tamil: 'D9 (நவாம்சை)', description: 'Marriage & partner' },
  { id: 'D10', name: 'D10 (Dashamsha)', tamil: 'D10 (தசாம்சை)', description: 'Career & reputation' },
  { id: 'D12', name: 'D12 (Dwadashamsha)', tamil: 'D12 (த்வாத்தசாம்சை)', description: 'Parents & inheritance' },
  { id: 'D16', name: 'D16 (Shodasamsha)', tamil: 'D16 (சோடசாம்சை)', description: 'Vehicles & comforts' },
  { id: 'D20', name: 'D20 (Vimshamsha)', tamil: 'D20 (விம்சாம்சை)', description: 'Spiritual practice' },
  { id: 'D24', name: 'D24 (Chaturvimshamsha)', tamil: 'D24 (சதுர்விம்சாம்சை)', description: 'Education' },
  { id: 'D27', name: 'D27 (Nakshatraamsha)', tamil: 'D27 (நக்ஷத்ராம்சை)', description: 'Nakshatra details' },
  { id: 'D30', name: 'D30 (Trimshamsha)', tamil: 'D30 (த்ரிம்சாம்சை)', description: 'Misfortunes' },
  { id: 'D40', name: 'D40 (Khavedamsha)', tamil: 'D40 (க்ஷவேதாம்சை)', description: 'Longevity' },
  { id: 'D60', name: 'D60 (Shashtyamsha)', tamil: 'D60 (சஷ்ட்யாம்சை)', description: 'Ultimate results' },
];

const IMPORTANT_CHARTS = ['D1', 'D9', 'D10', 'D20'];

interface ChartData {
  chartId: string;
  points: Array<{
    label: string;
    rasiName: string;
    deg: number;
    kp: { signLord: string; starLord: string; sub: string; subSub: string };
  }>;
  lagnaRasiIndex: number;
}

export default function DivisionalChartsView() {
  const [chartId, setChartId] = useState<string>('D1');
  const [birthData, setBirthData] = useState({
    date: '1990-05-15',
    time: '10:30:00',
    latitude: '13.0827',
    longitude: '80.2707',
  });
  const [charts, setCharts] = useState<Map<string, ChartData>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compute = async () => {
    setLoading(true);
    setError(null);
    try {
      // Generate mock chart data locally for demonstration
      const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna', 'Rahu', 'Ketu'];
      const rasies = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

      const newCharts = new Map<string, ChartData>();

      IMPORTANT_CHARTS.forEach(chartId => {
        const division = parseInt(chartId.substring(1));
        const points = planets.map((planet, i) => {
          const baseDeg = (i * 30 + division * 5) % 360;
          const rasiIndex = Math.floor(baseDeg / 30) % 12;

          return {
            label: planet,
            rasiName: rasies[rasiIndex],
            deg: baseDeg,
            kp: {
              signLord: rasies[rasiIndex % 12],
              starLord: planets[(i + 1) % planets.length],
              sub: planets[(i + 2) % planets.length],
              subSub: rasies[(i + 3) % rasies.length],
            },
          };
        });

        newCharts.set(chartId, {
          chartId,
          points,
          lagnaRasiIndex: 0,
        });
      });

      setCharts(newCharts);
      if (!newCharts.has(chartId)) {
        setChartId(IMPORTANT_CHARTS[0]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const currentChart = charts.get(chartId);
  const chartInfo = CHARTS.find(c => c.id === chartId);

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Divisional Charts
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          வர்கோத்தமம் (Vargottamsha)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          ஜாதக வெளிப்பாட்டுக்குத் தாளிய பெரிய பகுப்பாய்வுக்கான 16 வர்கங்கள்.
          D9 (திருமணம்), D10 (வேலை), D20 (ஆன்மீக).
        </p>
      </header>

      {/* Input Section */}
      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த தேதி</span>
            <input
              type="date"
              value={birthData.date}
              onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த நேரம்</span>
            <input
              type="time"
              step="1"
              value={birthData.time}
              onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">அட்சரேகை</span>
            <input
              type="number"
              step="0.0001"
              value={birthData.latitude}
              onChange={(e) => setBirthData({ ...birthData, latitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">தீர்க்கரேகை</span>
            <input
              type="number"
              step="0.0001"
              value={birthData.longitude}
              onChange={(e) => setBirthData({ ...birthData, longitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
        </div>
        <button
          onClick={compute}
          disabled={loading}
          className="w-full px-4 py-2 bg-saffron text-ink rounded font-medium disabled:opacity-50 hover:bg-saffron/90"
        >
          {loading ? 'கணக்கிடுகிறது…' : 'வர்க கணக்கிடு'}
        </button>
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">
          ⚠️ {error}
        </div>
      )}

      {charts.size > 0 && (
        <>
          {/* Chart Tabs */}
          <div className="mb-6 border-b border-line">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {IMPORTANT_CHARTS.map((cid) => {
                const info = CHARTS.find(c => c.id === cid);
                return (
                  <button
                    key={cid}
                    onClick={() => setChartId(cid)}
                    className={`px-4 py-2 whitespace-nowrap font-medium border-b-2 transition ${
                      chartId === cid
                        ? 'border-saffron text-saffron'
                        : 'border-transparent text-ink-soft hover:text-ink'
                    }`}
                  >
                    <span className="block text-xs text-ink-soft">{info?.tamil}</span>
                    <span className="text-sm">{cid}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Chart */}
          {currentChart && chartInfo && (
            <div className="space-y-6">
              {/* Chart Info */}
              <div className="bg-info/10 border border-info rounded-lg p-4">
                <h2 className="font-semibold text-ink mb-2">{chartInfo.tamil} - {chartInfo.name}</h2>
                <p className="text-sm text-ink-soft">{chartInfo.description}</p>
              </div>

              {/* Chart Display */}
              <div className="bg-surface border border-line rounded-2xl p-6">
                <JamakkolChartBox
                  points={currentChart.points}
                  jamas={[]}
                  transitPlanets={[]}
                  lagnaRasiIndex={currentChart.lagnaRasiIndex}
                  title={`${chartInfo.tamil} (${chartInfo.name})`}
                />
              </div>

              {/* Points Table */}
              <div className="bg-surface border border-line rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-ink mb-4">கிரহங்கள் நிலை</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line text-ink-soft">
                        <th className="text-left py-2 px-2">கிரகம்</th>
                        <th className="text-left py-2 px-2">ராசி</th>
                        <th className="text-right py-2 px-2">பாகை</th>
                        <th className="text-left py-2 px-2">KP (S:St:Su)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentChart.points.map((point) => (
                        <tr key={point.label} className="border-b border-line/40">
                          <td className="py-2 px-2 font-medium">{point.label}</td>
                          <td className="py-2 px-2">{point.rasiName}</td>
                          <td className="py-2 px-2 text-right tabular-nums">{point.deg.toFixed(2)}°</td>
                          <td className="py-2 px-2 text-xs text-ink-soft">
                            {point.kp.signLord}:{point.kp.starLord}:{point.kp.sub}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {CHARTS.filter(c => IMPORTANT_CHARTS.includes(c.id)).map((chart) => (
                  <div key={chart.id} className="bg-surface border border-line rounded p-3">
                    <p className="font-mono font-semibold text-saffron">{chart.id}</p>
                    <p className="text-ink-soft mt-1">{chart.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Chart Message */}
          {charts.size === 0 && !loading && (
            <div className="text-center py-12 text-ink-soft">
              <p className="text-sm">வர்க கணக்கீட்டு முடிந்ததும் வர்க பட்டியை பாருங்கள்.</p>
            </div>
          )}
        </>
      )}

      {/* All Charts Reference */}
      <div className="mt-12 pt-6 border-t border-line">
        <h3 className="font-semibold text-ink mb-4">அனைத்து வர்கங்கள் (16 Vargas)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CHARTS.map((chart) => (
            <div key={chart.id} className="text-xs p-2 rounded border border-line/40">
              <p className="font-mono font-semibold text-saffron">{chart.id}</p>
              <p className="text-ink-soft">{chart.tamil}</p>
              <p className="text-ink-soft/60 text-[10px]">{chart.description}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-8 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>வர்கோत்தமம் — கிரகம் அதாவது தனியின் ராசி அதே ப்ரஸ்தரத்தில் பொருள் பெற்றிருக்கும் போது.</p>
      </footer>
    </main>
  );
}
