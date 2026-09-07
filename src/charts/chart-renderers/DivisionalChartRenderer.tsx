'use client';

import { RASI_SHORT, POINT_LABEL, RASI_FULL } from './chartConstants';

interface DivisionalChartRendererProps {
  report: any;
  chartId: string;
}

const DIVISIONAL_CHARTS = {
  'D2-hora': {
    name: 'ஹோரா (Hora - D2)',
    tamil: 'ஹோரா',
    theme: 'amber',
    description: 'Wealth, finances, and material prosperity',
    significance: 'Shows financial gains, resources, and material comforts',
    keywords: ['Wealth', 'Money', 'Finances', 'Resources'],
  },
  'D7-saptamsha': {
    name: 'சப்தாம்ச (Saptamsha - D7)',
    tamil: 'சப்தாம்ச',
    theme: 'pink',
    description: 'Children, progeny, and family expansion',
    significance: 'Indicates children, fertility, and family blessings',
    keywords: ['Children', 'Progeny', 'Fertility', 'Family'],
  },
  'D10-dasamsha': {
    name: 'தசாம்ச (Dasamsha - D10)',
    tamil: 'தசாம்ச',
    theme: 'blue',
    description: 'Career, profession, and public reputation',
    significance: 'Shows career achievements, profession, and public image',
    keywords: ['Career', 'Profession', 'Reputation', 'Success'],
  },
  'D12-dwadashamsha': {
    name: 'த்வாதசாம்ச (Dwadashamsha - D12)',
    tamil: 'த்வாதசாம்ச',
    theme: 'green',
    description: 'Parents, ancestors, and inherited traits',
    significance: 'Represents parents, heritage, and ancestral influences',
    keywords: ['Parents', 'Ancestors', 'Heritage', 'Inheritance'],
  },
};

const THEME_COLORS = {
  amber: {
    bg: 'from-amber-soft/30 to-orange-soft/30',
    border: 'border-amber',
    text: 'text-amber',
    lightBg: 'bg-amber-soft/20',
    lightBorder: 'border-amber/30',
  },
  pink: {
    bg: 'from-pink-soft/30 to-rose-soft/30',
    border: 'border-pink',
    text: 'text-pink',
    lightBg: 'bg-pink-soft/20',
    lightBorder: 'border-pink/30',
  },
  blue: {
    bg: 'from-blue-soft/30 to-indigo-soft/30',
    border: 'border-blue',
    text: 'text-blue',
    lightBg: 'bg-blue-soft/20',
    lightBorder: 'border-blue/30',
  },
  green: {
    bg: 'from-green-soft/30 to-teal-soft/30',
    border: 'border-green',
    text: 'text-green',
    lightBg: 'bg-green-soft/20',
    lightBorder: 'border-green/30',
  },
};

export function DivisionalChartRenderer({ report, chartId }: DivisionalChartRendererProps) {
  const chartInfo = DIVISIONAL_CHARTS[chartId as keyof typeof DIVISIONAL_CHARTS];
  const vargaKey = chartId.split('-')[0].toUpperCase(); // D2, D7, D10, D12

  if (!chartInfo) {
    return <div className="text-center text-ink-soft">Chart not found</div>;
  }

  const theme = THEME_COLORS[chartInfo.theme as keyof typeof THEME_COLORS];

  // Get D-chart positions from vargas
  const lagnaD = report.vargas.Lagna?.[vargaKey];
  const grahasD = Object.fromEntries(
    Object.entries(report.vargas).map(([planet, vargas]: any) => [
      planet,
      vargas?.[vargaKey],
    ]).filter(([, d]) => d)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${theme.bg} rounded-lg p-6 border-l-4 ${theme.border}`}>
        <h3 className="text-xl font-bold text-ink mb-2">{chartInfo.name}</h3>
        <p className="text-sm text-ink-soft mb-3">{chartInfo.description}</p>
        <div className="flex flex-wrap gap-2">
          {chartInfo.keywords.map(kw => (
            <span key={kw} className={`text-xs px-2 py-1 rounded ${theme.lightBg} text-ink`}>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Lagna Section */}
      <div>
        <h4 className={`font-semibold ${theme.text} mb-3`}>D-Chart Lagna</h4>
        <div className={`${theme.lightBg} rounded-lg p-6 border-2 ${theme.lightBorder}`}>
          <div className="flex items-end gap-6">
            <div>
              <div className="text-sm text-ink-soft mb-1">Lagna Sign</div>
              <div className={`text-4xl font-bold ${theme.text} mb-2`}>
                {RASI_SHORT[lagnaD] || lagnaD}
              </div>
              <div className="text-sm text-ink-soft">{RASI_FULL[lagnaD] || lagnaD}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-ink-soft mb-2">Significance</div>
              <p className="text-sm text-ink">{chartInfo.significance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Positions */}
      <div>
        <h4 className="font-semibold text-ink mb-4">கிரக நிலைகள் (Planetary Positions)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(grahasD).map(([planet, dSign]: any) => (
            <div key={planet} className={`${theme.lightBg} rounded-lg p-4 border ${theme.lightBorder} hover:border-opacity-100 transition-colors`}>
              <div className="text-xs font-semibold text-ink-soft mb-2 uppercase">
                {POINT_LABEL[planet] || planet}
              </div>
              <div className={`text-2xl font-bold ${theme.text} mb-1`}>
                {RASI_SHORT[dSign] || dSign}
              </div>
              <div className="text-xs text-ink-soft">
                {RASI_FULL[dSign] || dSign}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className={`${theme.lightBg} rounded-lg p-4 border-l-4 ${theme.border}`}>
        <div className="text-sm">
          <div className={`font-semibold ${theme.text} mb-2`}>💡 Interpretation Guide</div>
          <div className="text-ink-soft space-y-1">
            {chartId === 'D2-hora' && (
              <>
                <p>• Strong placements in D2 indicate financial prosperity and wealth accumulation</p>
                <p>• Benefic planets (Jupiter, Venus) strengthen financial prospects</p>
                <p>• 2nd and 11th house lords in D2 are crucial for wealth</p>
              </>
            )}
            {chartId === 'D7-saptamsha' && (
              <>
                <p>• D7 strength determines fertility and children blessings</p>
                <p>• Jupiter and Venus placement crucial for progeny</p>
                <p>• 5th house lord position determines children-related matters</p>
              </>
            )}
            {chartId === 'D10-dasamsha' && (
              <>
                <p>• D10 shows true career potential and professional achievement</p>
                <p>• 10th house lord strength is paramount for career success</p>
                <p>• Benefic placements indicate recognition and authority</p>
              </>
            )}
            {chartId === 'D12-dwadashamsha' && (
              <>
                <p>• D12 reveals ancestral influences and inherited traits</p>
                <p>• Relationship with parents shown through planetary placements</p>
                <p>• Inherited wealth and family legacy indicators</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compare with D1 */}
      <div className="bg-gradient-to-r from-indigo-soft/10 to-purple-soft/10 rounded-lg p-4 border-l-4 border-indigo">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">📊 Comparison Tip</div>
          <p className="text-ink-soft">
            Compare {chartInfo.tamil} (D-chart) placements with Birth Chart (D1) positions. Strong D-chart indicators show natural aptitude in that area, while weak indicators suggest need for conscious development.
          </p>
        </div>
      </div>
    </div>
  );
}
