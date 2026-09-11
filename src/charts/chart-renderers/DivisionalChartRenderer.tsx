'use client';

import { VedicChartBox } from '../kattam/VedicChartBox';
import { fromVargas, RASI_TA_FULL, GRAHA_TA_FULL } from '../kattam/rasiNames';

interface DivisionalChartRendererProps {
  report: any;
  chartId: string;
}

/**
 * One real South/North Indian chart box for any equal-division varga
 * (D3, D4, D7, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60 — D9 has
 * its own NavamshaChartRenderer, and D2 Hora is a Sun/Moon lord split with
 * no rāśi of its own, handled below without a chart box).
 */
export function DivisionalChartRenderer({ report, chartId }: DivisionalChartRendererProps) {
  const vargaKey = chartId.split('-')[0].toUpperCase(); // e.g. 'D2-hora' -> 'D2'

  if (vargaKey === 'D2') {
    const lagnaHora = report.vargas.Lagna?.D2?.lord;
    return (
      <div className="space-y-4">
        <p className="text-sm text-ink-soft">
          ஹோரா (D2) ராசியை அளிக்காது — ஒவ்வொரு ராசியும் இரு 15° பாதிகளாகப் பிரிந்து சூரிய ஹோரை / சந்திர ஹோரை என
          கிரக அதிபதி மட்டுமே அளிக்கப்படும் (BPHS 6.5-6). எனவே இதற்கு கட்டம் இடப்படாது — அதிபதி அட்டவணை மட்டும்.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-surface-soft rounded-lg p-4 border border-line">
            <div className="text-xs text-ink-soft mb-1 font-semibold uppercase">லக்னம்</div>
            <div className="text-lg font-bold text-indigo">{lagnaHora ? PLANET_TA[lagnaHora] ?? lagnaHora : '—'}</div>
          </div>
          {Object.entries(report.vargas)
            .filter(([planet]) => planet !== 'Lagna')
            .map(([planet, byVarga]: any) => (
              <div key={planet} className="bg-surface-soft rounded-lg p-4 border border-line">
                <div className="text-xs text-ink-soft mb-1 font-semibold uppercase">{GRAHA_TA_FULL[planet] ?? planet}</div>
                <div className="text-lg font-bold text-indigo">
                  {byVarga?.D2?.lord ? (PLANET_TA[byVarga.D2.lord] ?? byVarga.D2.lord) : '—'}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  const box = fromVargas(report.vargas, vargaKey);
  if (!box) return <div className="text-center text-ink-soft">{vargaKey} தரவு கிடைக்கவில்லை.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <VedicChartBox {...box} title={`${vargaKey} கட்டம்`} />
      </div>

      <div>
        <h4 className="font-semibold text-ink mb-4">கிரக நிலைகள் ({vargaKey})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {box.grahas.map((g) => (
            <div key={g.id} className="bg-surface-soft rounded-lg p-4 border border-line hover:border-saffron/50 transition-colors">
              <div className="text-xs font-semibold text-ink-soft mb-2 uppercase">{GRAHA_TA_FULL[g.id] ?? g.id}</div>
              <div className="text-2xl font-bold text-indigo">{RASI_TA_FULL[g.rasiIndex]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-soft/10 to-purple-soft/10 rounded-lg p-4 border-l-4 border-indigo">
        <p className="text-sm text-ink-soft">
          D1 (ஜாதக ராசி) நிலைகளுடன் {vargaKey}-ஐ ஒப்பிட்டு பார்க்கவும் — D-chart-ல் பலமான நிலை அந்தக் காரகத்துவத்தில்
          இயல்பான திறனைக் காட்டும்.
        </p>
      </div>
    </div>
  );
}

const PLANET_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்',
};
