'use client';

import { POINT_LABEL, RASI_FULL } from './chartConstants';

interface AspectMatrixRendererProps {
  report: any;
}

const ASPECT_TYPES = {
  conjunction: { symbol: '☌', tamil: 'சங்கமம்', description: 'Same sign (0°)' },
  sextile: { symbol: '⚹', tamil: 'ஷோடசாம்ச', description: 'Benefic aspect (60°)' },
  square: { symbol: '☐', tamil: 'சதுரசாம்ச', description: 'Challenging (90°)' },
  trine: { symbol: '△', tamil: 'त्रिकोण', description: 'Benefic (120°)' },
  opposition: { symbol: '☍', tamil: 'விரோதம்', description: 'Opposing (180°)' },
};

const getAspectColor = (type: string): { bg: string; text: string; border: string } => {
  switch (type) {
    case 'conjunction':
      return { bg: 'bg-yellow-100', text: 'text-yellow-900', border: 'border-yellow-300' };
    case 'sextile':
      return { bg: 'bg-green-100', text: 'text-green-900', border: 'border-green-300' };
    case 'square':
      return { bg: 'bg-red-100', text: 'text-red-900', border: 'border-red-300' };
    case 'trine':
      return { bg: 'bg-green-100', text: 'text-green-900', border: 'border-green-300' };
    case 'opposition':
      return { bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-300' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-300' };
  }
};

export function AspectMatrixRenderer({ report }: AspectMatrixRendererProps) {
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  // Mock aspect data - will be replaced with actual computation
  const aspects: Array<{ from: string; to: string; type: string; orb: number }> = [
    { from: 'Sun', to: 'Moon', type: 'sextile', orb: 2 },
    { from: 'Moon', to: 'Venus', type: 'trine', orb: 5 },
    { from: 'Mars', to: 'Saturn', type: 'square', orb: 3 },
    { from: 'Mercury', to: 'Jupiter', type: 'conjunction', orb: 1 },
    { from: 'Venus', to: 'Jupiter', type: 'trine', orb: 4 },
  ];

  const beneficAspects = aspects.filter(a => ['sextile', 'trine'].includes(a.type));
  const challenging = aspects.filter(a => ['square', 'opposition'].includes(a.type));
  const conjunctions = aspects.filter(a => a.type === 'conjunction');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-soft/30 to-purple-soft/30 rounded-lg p-6 border-l-4 border-indigo">
        <h3 className="text-xl font-bold text-ink mb-2">பார்ப்பு மேட்ரிக்ஸ் (Aspect Matrix - Drishti)</h3>
        <p className="text-sm text-ink-soft">
          Planetary aspects showing angular relationships and their influence. Vedic drishti (aspects) reveal harmony and challenges in the chart.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-green-100 rounded-lg p-4 border border-green-300">
          <div className="text-xs text-green-900 mb-1">Benefic Aspects</div>
          <div className="text-3xl font-bold text-green">{beneficAspects.length}</div>
          <div className="text-xs text-green-900">Harmonic</div>
        </div>
        <div className="bg-red-100 rounded-lg p-4 border border-red-300">
          <div className="text-xs text-red-900 mb-1">Challenging</div>
          <div className="text-3xl font-bold text-red">{challenging.length}</div>
          <div className="text-xs text-red-900">Tense</div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-4 border border-yellow-300">
          <div className="text-xs text-yellow-900 mb-1">Conjunctions</div>
          <div className="text-3xl font-bold text-yellow">{conjunctions.length}</div>
          <div className="text-xs text-yellow-900">Same sign</div>
        </div>
        <div className="bg-indigo-100 rounded-lg p-4 border border-indigo-300">
          <div className="text-xs text-indigo-900 mb-1">Total Aspects</div>
          <div className="text-3xl font-bold text-indigo">{aspects.length}</div>
          <div className="text-xs text-indigo-900">Interactions</div>
        </div>
      </div>

      {/* Benefic Aspects */}
      <div>
        <h4 className="font-semibold text-green mb-3">🟢 Benefic Aspects (Harmonic)</h4>
        <div className="space-y-2">
          {beneficAspects.map((aspect, idx) => {
            const color = getAspectColor(aspect.type);
            const type = ASPECT_TYPES[aspect.type as keyof typeof ASPECT_TYPES];
            return (
              <div key={idx} className={`${color.bg} ${color.text} rounded-lg p-4 border-2 ${color.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{type?.symbol}</div>
                    <div>
                      <div className="font-semibold">{POINT_LABEL[aspect.from]} ↔ {POINT_LABEL[aspect.to]}</div>
                      <div className="text-sm opacity-90">{type?.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Orb: {aspect.orb}°</div>
                    <div className="text-xs">Precise</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenging Aspects */}
      <div>
        <h4 className="font-semibold text-red mb-3">🔴 Challenging Aspects (Tense)</h4>
        <div className="space-y-2">
          {challenging.map((aspect, idx) => {
            const color = getAspectColor(aspect.type);
            const type = ASPECT_TYPES[aspect.type as keyof typeof ASPECT_TYPES];
            return (
              <div key={idx} className={`${color.bg} ${color.text} rounded-lg p-4 border-2 ${color.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{type?.symbol}</div>
                    <div>
                      <div className="font-semibold">{POINT_LABEL[aspect.from]} ↔ {POINT_LABEL[aspect.to]}</div>
                      <div className="text-sm opacity-90">{type?.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Orb: {aspect.orb}°</div>
                    <div className="text-xs">Requires effort</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aspect Legend */}
      <div>
        <h4 className="font-semibold text-ink mb-3">பார்ப்பு வகைகள் (Aspect Types)</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(ASPECT_TYPES).map(([key, value]) => (
            <div key={key} className="bg-surface-soft rounded-lg p-3 border border-line text-center">
              <div className="text-3xl mb-1">{value.symbol}</div>
              <div className="text-xs font-semibold text-ink">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
              <div className="text-xs text-ink-soft">{value.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-gradient-to-r from-blue-soft/10 to-indigo-soft/10 rounded-lg p-4 border-l-4 border-blue">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">💡 Understanding Vedic Aspects</div>
          <div className="text-ink-soft space-y-2">
            <p>• Benefic aspects (60°, 120°) show harmony and cooperation between planets</p>
            <p>• Challenging aspects (90°, 180°) indicate tension requiring conscious effort</p>
            <p>• Conjunctions (0°) blend energies - can be benefic or challenging depending on planets</p>
            <p>• Tight orbs (under 3°) show precise, strong aspects</p>
            <p>• Planetary strength modifies aspect effects significantly</p>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div>
        <h4 className="font-semibold text-ink mb-3">கிரக பார்ப்பு அட्डணை (Aspect Matrix Grid)</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface-soft">
                <th className="border border-line p-2 text-left font-semibold">Planet 1</th>
                <th className="border border-line p-2 text-left font-semibold">Planet 2</th>
                <th className="border border-line p-2 text-left font-semibold">Type</th>
                <th className="border border-line p-2 text-left font-semibold">Orb</th>
                <th className="border border-line p-2 text-left font-semibold">Effect</th>
              </tr>
            </thead>
            <tbody>
              {aspects.map((aspect, idx) => {
                const color = getAspectColor(aspect.type);
                const type = ASPECT_TYPES[aspect.type as keyof typeof ASPECT_TYPES];
                return (
                  <tr key={idx} className={`${color.bg} border-t border-line`}>
                    <td className="border border-line p-2">{POINT_LABEL[aspect.from]}</td>
                    <td className="border border-line p-2">{POINT_LABEL[aspect.to]}</td>
                    <td className="border border-line p-2 font-semibold">{type?.description}</td>
                    <td className="border border-line p-2">{aspect.orb}°</td>
                    <td className="border border-line p-2">
                      {['sextile', 'trine'].includes(aspect.type) ? '✓ Harmonious' :
                       ['square', 'opposition'].includes(aspect.type) ? '✗ Challenging' : '◊ Neutral'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Note */}
      <div className="bg-surface-soft rounded-lg p-3 border border-line text-xs text-ink-soft">
        <div className="font-semibold text-ink mb-1">ℹ️ Vedic Drishti (Aspects)</div>
        <p>In Vedic astrology, planets aspect specific degrees ahead of their position. Inner planets aspect nearby signs, outer planets aspect farther signs. Conjunction aspects the same sign at any distance.</p>
      </div>
    </div>
  );
}
