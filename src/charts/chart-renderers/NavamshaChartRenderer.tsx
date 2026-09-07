'use client';

import { RASI_SHORT, POINT_LABEL, RASI_FULL } from './chartConstants';

interface NavamshaChartRendererProps {
  report: any;
}

export function NavamshaChartRenderer({ report }: NavamshaChartRendererProps) {
  const lagnaD9 = report.vargas.Lagna?.D9;
  const grahasD9 = Object.fromEntries(
    Object.entries(report.vargas).map(([planet, vargas]: any) => [
      planet,
      vargas?.D9,
    ]).filter(([, d9]) => d9)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-soft/30 to-indigo-soft/30 rounded-lg p-6 border-l-4 border-indigo">
        <h3 className="text-xl font-bold text-ink mb-2">நவாംச (Navamsha - D9)</h3>
        <p className="text-sm text-ink-soft">
          One-ninth divisional chart showing Marriage, partnership, and spouse characteristics
        </p>
      </div>

      {/* D9 Lagna */}
      <div>
        <h4 className="font-semibold text-ink mb-3">D9 லக்னம் (Navamsha Ascendant)</h4>
        <div className="bg-surface-soft rounded-lg p-6 border-2 border-indigo/30">
          <div className="flex items-end gap-4">
            <div>
              <div className="text-xs text-ink-soft mb-1">Navamsha Sign</div>
              <div className="text-4xl font-bold text-indigo mb-2">{RASI_SHORT[lagnaD9] || lagnaD9}</div>
              <div className="text-sm text-ink-soft">{RASI_FULL[lagnaD9] || lagnaD9}</div>
            </div>
            <div className="flex-1 bg-gradient-to-r from-indigo/20 to-purple/20 rounded p-4">
              <div className="text-xs text-ink-soft mb-2">Significance</div>
              <ul className="text-sm space-y-1 text-ink">
                <li>• Marriage & Partnership quality</li>
                <li>• Spouse characteristics</li>
                <li>• Marital harmony indicators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* D9 Planetary Positions */}
      <div>
        <h4 className="font-semibold text-ink mb-4">கிரக நிலைகள் (Planetary Positions in D9)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(grahasD9).map(([planet, d9Sign]: any) => (
            <div key={planet} className="bg-surface-soft rounded-lg p-4 border border-indigo/30 hover:border-indigo/60 transition-colors">
              <div className="text-xs font-semibold text-ink-soft mb-2 uppercase">
                {POINT_LABEL[planet] || planet}
              </div>
              <div className="text-2xl font-bold text-indigo mb-1">
                {RASI_SHORT[d9Sign] || d9Sign}
              </div>
              <div className="text-xs text-ink-soft">
                {RASI_FULL[d9Sign] || d9Sign}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marriage Analysis Section */}
      <div className="bg-surface border border-line rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-ink">திருமண பகுப்பாய்வு (Marriage Analysis)</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Venus in D9 */}
          <div className="bg-pink-soft/20 rounded p-4 border border-pink-soft/50">
            <div className="text-sm text-ink-soft mb-2">சுக்கிரன் D9 (Venus in Navamsha)</div>
            <div className="text-lg font-semibold text-ink">
              {grahasD9['Venus'] ? `${RASI_SHORT[grahasD9['Venus']]} (${grahasD9['Venus']})` : 'Analysis pending'}
            </div>
            <div className="text-xs text-ink-soft mt-1">
              Indicates spouse's romantic nature and relationship approach
            </div>
          </div>

          {/* 7th House Lord */}
          <div className="bg-rose-soft/20 rounded p-4 border border-rose-soft/50">
            <div className="text-sm text-ink-soft mb-2">7வது பாவ குரு (7th Lord)</div>
            <div className="text-lg font-semibold text-ink">
              Calculated in reports
            </div>
            <div className="text-xs text-ink-soft mt-1">
              Determines marriage timing and spouse characteristics
            </div>
          </div>
        </div>
      </div>

      {/* Comparison with D1 */}
      <div className="bg-gradient-to-r from-indigo-soft/20 to-purple-soft/20 rounded-lg p-4 border-l-4 border-indigo">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">💡 Tip</div>
          <p className="text-ink-soft">
            Compare Navamsha placements with Birth Chart (D1) to understand marriage dynamics.
            Harmonious aspects between D1 and D9 charts indicate successful partnerships.
          </p>
        </div>
      </div>
    </div>
  );
}
