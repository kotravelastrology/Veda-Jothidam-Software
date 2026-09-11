'use client';

import { VedicChartBox } from '../kattam/VedicChartBox';
import { fromParashariChart, GRAHA_TA_FULL, type ChartGraha } from '../kattam/rasiNames';

interface TransitChartRendererProps {
  report: any;
}

const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

export function TransitChartRenderer({ report }: TransitChartRendererProps) {
  const natal = fromParashariChart(report.chart);
  const transitRasiPositions: Record<string, number> = report.transitRasiPositions || {};
  const transitGrahas: ChartGraha[] = Object.entries(transitRasiPositions)
    .filter(([planet]) => CLASSICAL.includes(planet))
    .map(([id, rasiIndex]) => ({ id, rasiIndex }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-soft/30 to-cyan-soft/30 rounded-lg p-6 border-l-4 border-teal">
        <h3 className="text-xl font-bold text-ink mb-2">இன்றைய கோசரம் (Current Transits - Gochara)</h3>
        <p className="text-sm text-ink-soft">
          {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })} —
          ஜாதக கிரகங்கள் (கருப்பு) மேல் இன்றைய கோசார கிரகங்கள் (சிவப்பு) அடுக்கப்பட்டு காட்டப்படுகிறது.
        </p>
      </div>

      {transitGrahas.length > 0 ? (
        <div className="flex justify-center">
          <VedicChartBox {...natal} transitGrahas={transitGrahas} />
        </div>
      ) : (
        <p className="text-sm text-ink-soft">இன்றைய கோசார தரவு கிடைக்கவில்லை.</p>
      )}

      {/* Transit Analysis Grid */}
      <div>
        <h4 className="font-semibold text-ink mb-4">கிரக கோசர நிலைகள் (Transit Positions)</h4>
        <div className="space-y-3">
          {CLASSICAL.map((planet) => {
            const birthRasi = report.chart.grahas[planet]?.rasiIndex;
            const transitRasi = transitRasiPositions[planet];
            const isSameRasi = birthRasi === transitRasi;

            return (
              <div
                key={planet}
                className={`rounded-lg p-4 border-2 transition-colors ${
                  isSameRasi ? 'bg-teal-soft/20 border-teal/50' : 'bg-surface-soft border-line hover:border-teal/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20">
                      <div className="font-bold text-ink">{GRAHA_TA_FULL[planet] ?? planet}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-xs text-ink-soft mb-1">ஜாதகம்</div>
                        <div className="text-sm font-semibold text-ink-soft">{birthRasi != null ? `Rasi ${birthRasi + 1}` : '—'}</div>
                      </div>
                      <div className="text-ink-soft">→</div>
                      <div className="text-center">
                        <div className="text-xs text-ink-soft mb-1">கோசாரம்</div>
                        <div className="text-sm font-bold text-teal">{transitRasi != null ? `Rasi ${transitRasi + 1}` : '—'}</div>
                      </div>
                    </div>
                  </div>
                  {isSameRasi && (
                    <div className="text-xs bg-teal text-white px-3 py-1 rounded-full font-semibold">Current position</div>
                  )}
                </div>

                <div className="mt-2 text-xs text-ink-soft">
                  {planet === 'Moon' && 'Moon transit changes daily — check lunar days (Tithi) for immediate effects'}
                  {planet === 'Mercury' && 'Mercury retrograde periods can cause communication delays'}
                  {planet === 'Venus' && 'Venus transits affect relationships and finances'}
                  {planet === 'Mars' && 'Mars transits indicate energy, conflicts, and initiation periods'}
                  {planet === 'Jupiter' && 'Jupiter transits last ~1 year per sign — major growth periods'}
                  {planet === 'Saturn' && 'Saturn transits last ~2.5 years per sign — important life lessons'}
                  {planet === 'Sun' && 'Sun transit changes monthly — affects vitality and identity'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div className="bg-gradient-to-r from-blue-soft/10 to-teal-soft/10 rounded-lg p-4 border-l-4 border-blue">
        <div className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">ℹ️ Note:</span> Transit analysis is most accurate when combined with
          birth chart strength (Shadbala) and current dasha periods.
        </div>
      </div>
    </div>
  );
}
