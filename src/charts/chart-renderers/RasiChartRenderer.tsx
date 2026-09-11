'use client';

import { VedicChartBox } from '../kattam/VedicChartBox';
import { fromParashariChart } from '../kattam/rasiNames';

interface RasiChartRendererProps {
  report: any;
}

/** The real D1 (Rāśi) South/North Indian chart box, plus a compact position table below it. */
export function RasiChartRenderer({ report }: RasiChartRendererProps) {
  const lagna = report.chart.lagna;
  const grahas = report.chart.grahas;

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <VedicChartBox {...fromParashariChart(report.chart)} centerNote={`லக்னம் ${lagna.rasi} ${lagna.degreeInSign.toFixed(2)}°`} />
      </div>

      <div>
        <h4 className="font-semibold text-ink mb-4">கிரக நிலைகள் (Planetary Positions)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(grahas).map(([planet, data]: any) => (
            <div key={planet} className="bg-surface-soft rounded-lg p-4 border border-line hover:border-saffron/50 transition-colors">
              <div className="text-xs text-ink-soft mb-2 font-semibold uppercase">{planet}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo">{data.rasi}</span>
              </div>
              <div className="flex justify-between items-end mt-2">
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
          ))}
        </div>
      </div>

      <div className="bg-blue-soft/20 rounded-lg p-4 border border-blue-soft text-sm text-ink-soft">
        <div className="mb-2 font-semibold text-ink">ℹ️ Note</div>
        <div>House calculation: Sripati Paddhati · Rahu/Ketu: Mean Node</div>
      </div>
    </div>
  );
}
