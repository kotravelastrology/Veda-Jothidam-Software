'use client';

import { VedicChartBox } from '../kattam/VedicChartBox';
import { fromVargas, RASI_TA_FULL } from '../kattam/rasiNames';

interface NavamshaChartRendererProps {
  report: any;
}

export function NavamshaChartRenderer({ report }: NavamshaChartRendererProps) {
  const box = fromVargas(report.vargas, 'D9');
  const venusD9 = report.vargas.Venus?.D9?.signIndex;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-soft/30 to-indigo-soft/30 rounded-lg p-6 border-l-4 border-indigo">
        <h3 className="text-xl font-bold text-ink mb-2">நவாம்ச (Navamsha - D9)</h3>
        <p className="text-sm text-ink-soft">
          One-ninth divisional chart showing Marriage, partnership, and spouse characteristics
        </p>
      </div>

      {box ? (
        <div className="flex justify-center">
          <VedicChartBox {...box} title="D9 நவாம்ச கட்டம்" />
        </div>
      ) : (
        <p className="text-sm text-ink-soft">D9 தரவு கிடைக்கவில்லை.</p>
      )}

      {/* Marriage Analysis Section */}
      <div className="bg-surface border border-line rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-ink">திருமண பகுப்பாய்வு (Marriage Analysis)</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Venus in D9 */}
          <div className="bg-pink-soft/20 rounded p-4 border border-pink-soft/50">
            <div className="text-sm text-ink-soft mb-2">சுக்கிரன் D9 (Venus in Navamsha)</div>
            <div className="text-lg font-semibold text-ink">
              {venusD9 != null ? RASI_TA_FULL[venusD9] : 'Analysis pending'}
            </div>
            <div className="text-xs text-ink-soft mt-1">
              Indicates spouse's romantic nature and relationship approach
            </div>
          </div>

          {/* 7th House Lord */}
          <div className="bg-rose-soft/20 rounded p-4 border border-rose-soft/50">
            <div className="text-sm text-ink-soft mb-2">7வது பாவ குரு (7th Lord)</div>
            <div className="text-lg font-semibold text-ink">Calculated in reports</div>
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
