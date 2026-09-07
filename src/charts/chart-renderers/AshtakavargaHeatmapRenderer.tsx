'use client';

import { RASI_FULL, RASI_SHORT } from './chartConstants';

interface AshtakavargaHeatmapRendererProps {
  report: any;
}

const RASI_ORDER = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karkataka',
  'Simha', 'Kanya', 'Tula', 'Vrischika',
  'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

const getStrengthColor = (bindu: number): { bg: string; text: string; label: string } => {
  if (bindu >= 30) return { bg: 'bg-green-600', text: 'text-white', label: 'Auspicious' };
  if (bindu >= 25) return { bg: 'bg-green-500', text: 'text-white', label: 'Very Good' };
  if (bindu >= 20) return { bg: 'bg-yellow-500', text: 'text-white', label: 'Good' };
  if (bindu >= 15) return { bg: 'bg-orange-500', text: 'text-white', label: 'Average' };
  if (bindu >= 10) return { bg: 'bg-orange-600', text: 'text-white', label: 'Weak' };
  return { bg: 'bg-red-600', text: 'text-white', label: 'Adverse' };
};

export function AshtakavargaHeatmapRenderer({ report }: AshtakavargaHeatmapRendererProps) {
  const ashtakavarga = report.ashtakavarga;

  if (!ashtakavarga) {
    return (
      <div className="bg-surface-soft rounded-lg p-6 text-center text-ink-soft">
        Ashtakavarga calculation in progress...
      </div>
    );
  }

  const bhinnaAV = ashtakavarga.bhinnaAshtakavarga || {};
  const sarvaAV = ashtakavarga.sarvaAshtakavarga || {};

  // Calculate totals for each rasi
  const rasiTotals = RASI_ORDER.map((rasi, idx) => ({
    rasi,
    index: idx + 1,
    total: sarvaAV[idx + 1]?.total || 0,
    bindu: sarvaAV[idx + 1]?.bindu || 0,
  }));

  const overallStats = {
    total: rasiTotals.reduce((sum, r) => sum + r.total, 0),
    average: Math.round(rasiTotals.reduce((sum, r) => sum + r.total, 0) / 12),
    max: Math.max(...rasiTotals.map(r => r.total)),
    min: Math.min(...rasiTotals.map(r => r.total)),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-soft/30 to-cyan-soft/30 rounded-lg p-6 border-l-4 border-teal">
        <h3 className="text-xl font-bold text-ink mb-2">அஷ்டகவர்க்கம் உஷ்ணசக்திப்படம் (Ashtakavarga Heatmap)</h3>
        <p className="text-sm text-ink-soft">
          Benefic point distribution across zodiac signs. Shows favorable periods and auspicious timing for various activities.
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface-soft rounded-lg p-4 border border-teal/30">
          <div className="text-xs text-ink-soft mb-1">Total Bindu</div>
          <div className="text-3xl font-bold text-teal">{overallStats.total}</div>
          <div className="text-xs text-ink-soft mt-1">out of 360</div>
        </div>
        <div className="bg-surface-soft rounded-lg p-4 border border-cyan/30">
          <div className="text-xs text-ink-soft mb-1">Average</div>
          <div className="text-3xl font-bold text-cyan">{overallStats.average}</div>
          <div className="text-xs text-ink-soft mt-1">per rasi</div>
        </div>
        <div className="bg-green-soft/20 rounded-lg p-4 border border-green-soft/50">
          <div className="text-xs text-ink-soft mb-1">Strongest</div>
          <div className="text-2xl font-bold text-green">{overallStats.max}</div>
          <div className="text-xs text-ink-soft mt-1">max bindu</div>
        </div>
        <div className="bg-red-soft/20 rounded-lg p-4 border border-red-soft/50">
          <div className="text-xs text-ink-soft mb-1">Weakest</div>
          <div className="text-2xl font-bold text-red">{overallStats.min}</div>
          <div className="text-xs text-ink-soft mt-1">min bindu</div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div>
        <h4 className="font-semibold text-ink mb-4">ராசி பிந்து விவரம் (Rasi-wise Bindu Distribution)</h4>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {rasiTotals.map((item) => {
            const strength = getStrengthColor(item.total);
            return (
              <div
                key={item.rasi}
                className={`${strength.bg} ${strength.text} rounded-lg p-3 text-center transition-transform hover:scale-105 cursor-pointer`}
              >
                <div className="font-bold text-sm">{RASI_SHORT[item.rasi]}</div>
                <div className="text-lg font-bold">{item.total}</div>
                <div className="text-xs opacity-90">{strength.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Legend */}
      <div>
        <h4 className="font-semibold text-ink mb-3">பிந்து வலிமை நிலை (Bindu Strength Levels)</h4>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <div className="bg-red-600 text-white rounded p-3 text-center text-sm font-semibold">
            <div className="text-lg">0-9</div>
            <div className="text-xs">Adverse</div>
          </div>
          <div className="bg-orange-600 text-white rounded p-3 text-center text-sm font-semibold">
            <div className="text-lg">10-14</div>
            <div className="text-xs">Weak</div>
          </div>
          <div className="bg-orange-500 text-white rounded p-3 text-center text-sm font-semibold">
            <div className="text-lg">15-19</div>
            <div className="text-xs">Average</div>
          </div>
          <div className="bg-yellow-500 text-white rounded p-3 text-center text-sm font-semibold">
            <div className="text-lg">20-24</div>
            <div className="text-xs">Good</div>
          </div>
          <div className="bg-green-500 text-white rounded p-3 text-center text-sm font-semibold">
            <div className="text-lg">25-29</div>
            <div className="text-xs">Very Good</div>
          </div>
          <div className="bg-green-600 text-white rounded p-3 text-center text-sm font-semibold">
            <div className="text-lg">30+</div>
            <div className="text-xs">Auspicious</div>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-gradient-to-r from-blue-soft/10 to-teal-soft/10 rounded-lg p-4 border-l-4 border-blue">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">💡 Understanding Ashtakavarga</div>
          <div className="text-ink-soft space-y-2">
            <p>• High bindu (30+) = Auspicious periods for starting new ventures, travel, ceremonies</p>
            <p>• Low bindu (0-9) = Avoid important decisions, medical procedures, major expenses</p>
            <p>• Average bindu (15-19) = Neutral; proceed with caution or additional planning</p>
            <p>• Use strongest rasis for auspicious activities, weakest for introspection/consolidation</p>
            <p>• Combine with current dasha and transit for precise timing recommendations</p>
          </div>
        </div>
      </div>

      {/* Technical Note */}
      <div className="bg-surface-soft rounded-lg p-3 border border-line text-xs text-ink-soft">
        <div className="font-semibold text-ink mb-1">ℹ️ Technical Note</div>
        <p>Ashtakavarga calculated from 8 divisional charts (D1-D8). Each chart contributes 0-8 benefic points per rasi based on planetary placements and strengths.</p>
      </div>
    </div>
  );
}
