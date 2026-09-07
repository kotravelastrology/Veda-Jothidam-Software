'use client';

import { RASI_SHORT, POINT_LABEL } from './chartConstants';

interface TransitChartRendererProps {
  report: any;
}

export function TransitChartRenderer({ report }: TransitChartRendererProps) {
  const birthRasiPositions = Object.fromEntries(
    ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map(planet => [
      planet,
      report.chart.grahas[planet]?.rasiIndex || 0,
    ])
  );

  const transitRasiPositions = report.transit?.transitRasiPositions || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-soft/30 to-cyan-soft/30 rounded-lg p-6 border-l-4 border-teal">
        <h3 className="text-xl font-bold text-ink mb-2">இன்றைய கோசரம் (Current Transits - Gochara)</h3>
        <p className="text-sm text-ink-soft">
          Present planetary positions and their influence on your birth chart. Updated for today's date.
        </p>
      </div>

      {/* Today's Date & Time */}
      <div className="bg-surface-soft rounded-lg p-4 border border-teal/30">
        <div className="text-sm text-ink-soft mb-1">Calculation Date</div>
        <div className="text-lg font-semibold text-ink">
          {new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </div>
      </div>

      {/* Transit Analysis Grid */}
      <div>
        <h4 className="font-semibold text-ink mb-4">கிரக கோசர நிலைகள் (Transit Positions)</h4>
        <div className="space-y-3">
          {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map(planet => {
            const birthRasi = birthRasiPositions[planet];
            const transitRasi = transitRasiPositions[planet];
            const isSameRasi = birthRasi === transitRasi;

            return (
              <div
                key={planet}
                className={`rounded-lg p-4 border-2 transition-colors ${
                  isSameRasi
                    ? 'bg-teal-soft/20 border-teal/50'
                    : 'bg-surface-soft border-line hover:border-teal/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16">
                      <div className="text-xs text-ink-soft mb-1">{POINT_LABEL[planet]}</div>
                      <div className="font-bold text-ink">{planet}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-xs text-ink-soft mb-1">Birth</div>
                        <div className="text-sm font-semibold text-ink-soft">
                          Rasi {birthRasi + 1}
                        </div>
                      </div>
                      <div className="text-ink-soft">→</div>
                      <div className="text-center">
                        <div className="text-xs text-ink-soft mb-1">Transit</div>
                        <div className="text-sm font-bold text-teal">
                          Rasi {transitRasi + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {isSameRasi && (
                      <div className="text-xs bg-teal text-white px-3 py-1 rounded-full font-semibold">
                        Current position
                      </div>
                    )}
                  </div>
                </div>

                {/* Transit Effect Summary */}
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

      {/* Interpretation Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-teal-soft/10 rounded-lg p-4 border border-teal/30">
          <div className="font-semibold text-ink mb-2">🟢 Beneficial Transit</div>
          <div className="text-sm text-ink-soft">
            When transit planet is in same sign as birth placement or in harmonious aspect, expect favorable results in that area.
          </div>
        </div>

        <div className="bg-rose-soft/10 rounded-lg p-4 border border-rose/30">
          <div className="font-semibold text-ink mb-2">🔴 Challenging Transit</div>
          <div className="text-sm text-ink-soft">
            When transit planet aspects birth planets unfavorably, expect challenges requiring extra effort and wisdom.
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-gradient-to-r from-blue-soft/10 to-teal-soft/10 rounded-lg p-4 border-l-4 border-blue">
        <div className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">ℹ️ Note:</span> Transit analysis is most accurate when combined with birth chart strength (Shadbala)
          and current dasha periods. For personalized predictions, consult with a Vedic astrologer.
        </div>
      </div>
    </div>
  );
}
