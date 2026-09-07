'use client';

import { RASI_SHORT, POINT_LABEL, RASI_FULL } from './chartConstants';

interface SynastryChartRendererProps {
  report: any;
}

interface CompatibilityAspect {
  planet: string;
  aspect: string;
  score: number;
  interpretation: string;
}

const getAspectColor = (score: number): { bg: string; text: string; label: string } => {
  if (score >= 80) return { bg: 'bg-green-600', text: 'text-white', label: 'Excellent' };
  if (score >= 60) return { bg: 'bg-green-500', text: 'text-white', label: 'Good' };
  if (score >= 40) return { bg: 'bg-yellow-500', text: 'text-white', label: 'Moderate' };
  if (score >= 20) return { bg: 'bg-orange-500', text: 'text-white', label: 'Challenging' };
  return { bg: 'bg-red-600', text: 'text-white', label: 'Difficult' };
};

export function SynastryChartRenderer({ report }: SynastryChartRendererProps) {
  // Mock synastry data - will be replaced with actual computation
  const partnerChart = report.partnerChart || {};
  const synastryAspects: CompatibilityAspect[] = [
    {
      planet: 'Moon',
      aspect: 'Emotional compatibility',
      score: 75,
      interpretation: 'Emotional understanding and nurturing support present',
    },
    {
      planet: 'Venus',
      aspect: 'Romantic connection',
      score: 82,
      interpretation: 'Strong romantic and affectionate feelings toward each other',
    },
    {
      planet: 'Mars',
      aspect: 'Physical chemistry',
      score: 68,
      interpretation: 'Good physical attraction and passion balance',
    },
    {
      planet: 'Mercury',
      aspect: 'Communication',
      score: 71,
      interpretation: 'Clear communication and mental understanding',
    },
    {
      planet: 'Jupiter',
      aspect: 'Growth together',
      score: 79,
      interpretation: 'Mutual growth and expansion in partnership',
    },
  ];

  const overallScore = Math.round(
    synastryAspects.reduce((sum, a) => sum + a.score, 0) / synastryAspects.length
  );

  const compatibilityLevel = getAspectColor(overallScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-soft/30 to-pink-soft/30 rounded-lg p-6 border-l-4 border-rose">
        <h3 className="text-xl font-bold text-ink mb-2">தம்பதி பொருந்தம் (Synastry - Relationship Analysis)</h3>
        <p className="text-sm text-ink-soft">
          Comparison of two birth charts to assess relationship compatibility, strengths, and growth potential.
        </p>
      </div>

      {/* Overall Compatibility Score */}
      <div className={`${compatibilityLevel.bg} ${compatibilityLevel.text} rounded-lg p-6`}>
        <div className="text-center">
          <div className="text-sm opacity-90 mb-1">Overall Relationship Compatibility</div>
          <div className="text-5xl font-bold mb-2">{overallScore}%</div>
          <div className="text-lg font-semibold">{compatibilityLevel.label}</div>
        </div>
      </div>

      {/* Compatibility Dimensions */}
      <div>
        <h4 className="font-semibold text-ink mb-4">தம்பதி பொருந்தம் பரிதி (Compatibility Dimensions)</h4>
        <div className="space-y-3">
          {synastryAspects.map((aspect, idx) => {
            const color = getAspectColor(aspect.score);
            return (
              <div key={idx} className="bg-surface-soft rounded-lg p-4 border border-line">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-ink">{aspect.planet}</div>
                    <div className="text-sm text-ink-soft">{aspect.aspect}</div>
                  </div>
                  <div className={`${color.bg} ${color.text} rounded-lg px-4 py-2 font-bold text-lg`}>
                    {aspect.score}%
                  </div>
                </div>
                <div className="w-full bg-line rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className={`${color.bg} h-full transition-all`}
                    style={{ width: `${aspect.score}%` }}
                  />
                </div>
                <p className="text-sm text-ink-soft">{aspect.interpretation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Comparison */}
      <div>
        <h4 className="font-semibold text-ink mb-4">ஆன்மா-ஆன்மா ஒற்றுமை (Soul-Level Compatibility)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-saffron-soft/20 rounded-lg p-4 border border-saffron/30">
            <div className="font-semibold text-ink mb-2">🔮 Spiritual Connection</div>
            <div className="text-sm text-ink-soft">
              <p className="mb-2">Both partners have significant nodal (Rahu/Ketu) placements suggesting karmic connection for mutual spiritual growth.</p>
              <p className="text-xs">• Shared life purpose and evolution</p>
              <p className="text-xs">• Lessons learned through partnership</p>
            </div>
          </div>

          <div className="bg-indigo-soft/20 rounded-lg p-4 border border-indigo/30">
            <div className="font-semibold text-ink mb-2">💑 Emotional Bonding</div>
            <div className="text-sm text-ink-soft">
              <p className="mb-2">Moon to Moon and Moon to Venus aspects create emotional resonance and nurturing support.</p>
              <p className="text-xs">• Emotional security and comfort</p>
              <p className="text-xs">• Mutual understanding of needs</p>
            </div>
          </div>

          <div className="bg-rose-soft/20 rounded-lg p-4 border border-rose/30">
            <div className="font-semibold text-ink mb-2">❤️ Romantic Harmony</div>
            <div className="text-sm text-ink-soft">
              <p className="mb-2">Venus aspects indicate romantic attraction and affectionate expression.</p>
              <p className="text-xs">• Physical attraction</p>
              <p className="text-xs">• Romantic gestures and appreciation</p>
            </div>
          </div>

          <div className="bg-red-soft/20 rounded-lg p-4 border border-red/30">
            <div className="font-semibold text-ink mb-2">⚡ Passion & Chemistry</div>
            <div className="text-sm text-ink-soft">
              <p className="mb-2">Mars and Pluto connections create physical attraction and passionate energy.</p>
              <p className="text-xs">• Sexual chemistry</p>
              <p className="text-xs">• Dynamic interaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Factors */}
      <div className="bg-gradient-to-r from-green-soft/10 to-teal-soft/10 rounded-lg p-4 border-l-4 border-green">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-3">✅ Strengths in This Pairing</div>
          <ul className="text-ink-soft space-y-2 text-xs">
            <li className="flex gap-2">
              <span>🌟</span>
              <span><span className="font-semibold text-ink">Mental Compatibility:</span> Similar intellectual interests promote engaging conversations</span>
            </li>
            <li className="flex gap-2">
              <span>🌟</span>
              <span><span className="font-semibold text-ink">Emotional Support:</span> Natural inclination to understand and support partner's feelings</span>
            </li>
            <li className="flex gap-2">
              <span>🌟</span>
              <span><span className="font-semibold text-ink">Shared Values:</span> Common life goals and spiritual interests create foundation</span>
            </li>
            <li className="flex gap-2">
              <span>🌟</span>
              <span><span className="font-semibold text-ink">Growth Potential:</span> Partnership stimulates mutual development and evolution</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Challenges and Solutions */}
      <div className="bg-gradient-to-r from-orange-soft/10 to-rose-soft/10 rounded-lg p-4 border-l-4 border-orange">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-3">⚠️ Areas Needing Work</div>
          <ul className="text-ink-soft space-y-2 text-xs">
            <li className="flex gap-2">
              <span>🔧</span>
              <span><span className="font-semibold text-ink">Communication Patterns:</span> Practice direct, compassionate conversation to prevent misunderstandings</span>
            </li>
            <li className="flex gap-2">
              <span>🔧</span>
              <span><span className="font-semibold text-ink">Expectation Management:</span> Align expectations about relationship pace and commitment</span>
            </li>
            <li className="flex gap-2">
              <span>🔧</span>
              <span><span className="font-semibold text-ink">Conflict Resolution:</span> Develop healthy ways to handle disagreements respectfully</span>
            </li>
            <li className="flex gap-2">
              <span>🔧</span>
              <span><span className="font-semibold text-ink">Independence Balance:</span> Maintain individual identity while building togetherness</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Timing Recommendations */}
      <div className="bg-gradient-to-r from-purple-soft/10 to-indigo-soft/10 rounded-lg p-4 border-l-4 border-purple">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">📅 Auspicious Periods</div>
          <div className="text-ink-soft text-xs space-y-2">
            <p>For major decisions (marriage, commitment, moving together):</p>
            <p className="font-semibold text-ink">• Avoid Saturn and Rahu transits through 7th house (relationships)</p>
            <p className="font-semibold text-ink">• Favorable during Jupiter transits through 5th/7th/11th houses</p>
            <p className="font-semibold text-ink">• Use Muhurtha consultation for precise timing of ceremonies</p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-surface-soft rounded-lg p-3 border border-line text-xs text-ink-soft">
        <div className="font-semibold text-ink mb-1">ℹ️ Important Note</div>
        <p>Synastry analysis requires complete and accurate birth data for both partners. For detailed relationship guidance, consult with a professional Vedic astrologer who can assess your complete charts, dasha periods, and current transits.</p>
      </div>
    </div>
  );
}
