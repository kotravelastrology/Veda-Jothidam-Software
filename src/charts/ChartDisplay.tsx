'use client';

import { getChartById } from './chartTypes';

type ReportData = any;

interface ChartDisplayProps {
  chartId: string;
  report: ReportData;
}

export function ChartDisplay({ chartId, report }: ChartDisplayProps) {
  const chartType = getChartById(chartId);

  if (!chartType) {
    return (
      <div className="bg-surface border border-line rounded-lg p-8 text-center">
        <p className="text-ink-soft">Chart not found</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-line rounded-lg p-6">
      {/* Chart Header */}
      <div className="mb-6 pb-4 border-b border-line">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{chartType.icon}</span>
          <div>
            <h3 className="text-2xl font-semibold text-ink">{chartType.label}</h3>
            <p className="text-sm text-ink-soft font-[family-name:var(--font-tamil-serif)]">
              {chartType.labelTamil}
            </p>
          </div>
        </div>
        <p className="text-sm text-ink-soft">{chartType.description}</p>
      </div>

      {/* Chart Content Area */}
      <div className="space-y-6">
        {/* TODO: Render chart based on type */}
        {chartId === 'D1-rasi' && <RasiChartDisplay report={report} />}
        {chartId === 'D9-navamsha' && <NavamshaChartDisplay report={report} />}
        {chartId === 'transit' && <TransitChartDisplay report={report} />}
        {chartId === 'ashtakavarga' && <AshtakavargaDisplay report={report} />}
        {chartId === 'shadbala' && <ShadBalaDisplay report={report} />}

        {/* Default placeholder for unimplemented charts */}
        {!['D1-rasi', 'D9-navamsha', 'transit', 'ashtakavarga', 'shadbala'].includes(chartId) && (
          <ChartPlaceholder chartType={chartType} />
        )}
      </div>
    </div>
  );
}

function RasiChartDisplay({ report }: { report: ReportData }) {
  return (
    <div>
      <h4 className="font-semibold text-ink mb-4">ஜாதக ராசி (Birth Chart)</h4>
      <div className="grid grid-cols-2 gap-4">
        {/* Lagna */}
        <div className="bg-surface-soft rounded p-3 border border-line">
          <div className="text-xs text-ink-soft mb-1">லக்னம் (Lagna)</div>
          <div className="font-semibold text-saffron text-lg">{report.chart.lagna.rasi}</div>
          <div className="text-xs text-ink-soft">{report.chart.lagna.degreeInSign.toFixed(2)}°</div>
        </div>

        {/* Grahas */}
        {Object.entries(report.chart.grahas).map(([planet, data]: any) => (
          <div key={planet} className="bg-surface-soft rounded p-3 border border-line">
            <div className="text-xs text-ink-soft mb-1">{planet}</div>
            <div className="font-semibold text-indigo text-lg">{data.rasi}</div>
            <div className="text-xs text-ink-soft">{data.degreeInSign.toFixed(2)}° House {data.house}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NavamshaChartDisplay({ report }: { report: ReportData }) {
  return (
    <div>
      <h4 className="font-semibold text-ink mb-4">நவாംश (Navamsha - D9)</h4>
      <div className="grid grid-cols-2 gap-4">
        {report.vargas.Lagna && (
          <div className="bg-surface-soft rounded p-3 border border-line">
            <div className="text-xs text-ink-soft mb-1">லக்னம் (Lagna)</div>
            <div className="font-semibold text-saffron text-lg">{report.vargas.Lagna.D9}</div>
          </div>
        )}
        {Object.entries(report.vargas).map(([planet, vargas]: any) => (
          vargas.D9 && planet !== 'Lagna' && (
            <div key={planet} className="bg-surface-soft rounded p-3 border border-line">
              <div className="text-xs text-ink-soft mb-1">{planet}</div>
              <div className="font-semibold text-indigo text-lg">{vargas.D9}</div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

function TransitChartDisplay({ report }: { report: ReportData }) {
  return (
    <div>
      <h4 className="font-semibold text-ink mb-4">இன்றைய கோசரம் (Current Transits)</h4>
      <div className="bg-surface-soft rounded p-4 border border-line text-sm text-ink-soft">
        <p className="mb-3">Current planetary positions and influence on your chart:</p>
        {report.transit ? (
          <div className="space-y-2">
            <p>Transit Rasi positions calculated for today</p>
            <p className="text-xs">Benefic/Malefic analysis: {report.transit.summary || 'Calculated'}</p>
          </div>
        ) : (
          <p>Transit data not available</p>
        )}
      </div>
    </div>
  );
}

function AshtakavargaDisplay({ report }: { report: ReportData }) {
  return (
    <div>
      <h4 className="font-semibold text-ink mb-4">அஷ்டகவர்க்கம் (Ashtakavarga)</h4>
      <div className="grid grid-cols-3 gap-2 text-sm">
        {['Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'].map((rasi, idx) => (
          <div key={rasi} className="bg-surface-soft rounded p-2 border border-line text-center">
            <div className="text-xs text-ink-soft">{rasi}</div>
            <div className="font-semibold text-indigo">
              {report.ashtakavarga?.bhinnaAshtakavarga?.[idx + 1]?.total || '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShadBalaDisplay({ report }: { report: ReportData }) {
  return (
    <div>
      <h4 className="font-semibold text-ink mb-4">சட்பலம் (Shadbala - Six Strengths)</h4>
      <div className="space-y-3">
        {report.shadbala && Object.entries(report.shadbala).slice(0, 7).map(([planet, strength]: any) => (
          <div key={planet} className="flex items-center gap-3 bg-surface-soft rounded p-3 border border-line">
            <div className="w-24 font-semibold text-sm text-ink">{planet}</div>
            <div className="flex-1 bg-line rounded h-2 overflow-hidden">
              <div
                className="bg-saffron h-full transition-all"
                style={{ width: `${Math.min((strength?.total || 0) / 6, 100)}%` }}
              />
            </div>
            <div className="text-sm font-mono text-ink-soft w-16 text-right">
              {typeof strength === 'object' ? strength.total?.toFixed(1) : strength?.toFixed(1) || '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartPlaceholder({ chartType }: { chartType: any }) {
  return (
    <div className="bg-gradient-to-br from-saffron/10 to-indigo/10 rounded-lg p-8 border border-dashed border-line text-center">
      <div className="text-5xl mb-4">{chartType.icon}</div>
      <h4 className="font-semibold text-ink mb-2">{chartType.label}</h4>
      <p className="text-sm text-ink-soft mb-4">{chartType.description}</p>
      <p className="text-xs text-ink-soft/60">
        ⭐ Chart rendering for {chartType.labelTamil} coming in next phase
      </p>
    </div>
  );
}
