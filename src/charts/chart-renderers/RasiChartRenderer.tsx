'use client';

import { RASI_SHORT, POINT_LABEL } from './chartConstants';

interface RasiChartRendererProps {
  report: any;
}

export function RasiChartRenderer({ report }: RasiChartRendererProps) {
  const lagna = report.chart.lagna;
  const grahas = report.chart.grahas;

  return (
    <div className="space-y-6">
      {/* Lagna Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-saffron/20 to-saffron/5 rounded-lg p-6 border-2 border-saffron">
          <div className="text-sm text-ink-soft mb-2">லக்னம் (Ascendant/Lagna)</div>
          <div className="text-4xl font-bold text-saffron mb-2">
            {RASI_SHORT[lagna.rasi] || lagna.rasi}
          </div>
          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-ink-soft">Degree:</span>
              <span className="ml-2 font-mono font-semibold">{lagna.degreeInSign.toFixed(2)}°</span>
            </div>
            <div className="text-sm">
              <span className="text-ink-soft">Nakshatra:</span>
              <span className="ml-2 font-semibold">
                {report.chart.lagnaDetails?.nakshatra || 'Calculated'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-2">
          <div className="bg-surface-soft rounded p-4 border border-line">
            <div className="text-xs text-ink-soft mb-1">Birth Details</div>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-ink-soft">Date:</span>
                <span className="ml-2 font-mono">
                  {report.input.year}-{String(report.input.month).padStart(2, '0')}-
                  {String(report.input.day).padStart(2, '0')}
                </span>
              </div>
              <div>
                <span className="text-ink-soft">Time:</span>
                <span className="ml-2 font-mono">
                  {String(report.input.hour).padStart(2, '0')}:{String(report.input.minute).padStart(2, '0')}
                </span>
              </div>
              <div>
                <span className="text-ink-soft">Place:</span>
                <span className="ml-2">{report.input.placeName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Positions */}
      <div>
        <h4 className="font-semibold text-ink mb-4">கிரக நிலைகள் (Planetary Positions)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(grahas).map(([planet, data]: any) => (
            <div key={planet} className="bg-surface-soft rounded-lg p-4 border border-line hover:border-saffron/50 transition-colors">
              <div className="text-xs text-ink-soft mb-2 font-semibold uppercase">
                {POINT_LABEL[planet] || planet}
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-indigo">
                    {RASI_SHORT[data.rasi] || data.rasi}
                  </span>
                  <span className="text-xs text-ink-soft">{data.rasi}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-ink-soft">Degree</div>
                    <div className="font-mono text-sm">{data.degreeInSign.toFixed(2)}°</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ink-soft">House</div>
                    <div className="font-semibold text-saffron text-sm">{data.house}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-blue-soft/20 rounded-lg p-4 border border-blue-soft text-sm text-ink-soft">
        <div className="mb-2 font-semibold text-ink">ℹ️ Note</div>
        <div>House calculation: Sripati Paddhati · Rahu/Ketu: Mean Node</div>
      </div>
    </div>
  );
}
