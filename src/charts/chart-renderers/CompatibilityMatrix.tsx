'use client';

import React, { useMemo } from 'react';

interface Chart {
  name: string;
  rashi: number; // 0-11 (sign)
  nakshatra: number; // 0-26
  nakshataraFootName: string;
  moon: {
    sign: number;
    degree: number;
  };
}

interface CompatibilityData {
  chart1: Chart;
  chart2: Chart;
}

// Guna Milan components - traditional 36-point scale
const GUNA_COMPONENTS = [
  {
    name: 'Varna Guna',
    tamil: 'வர்ண குணம்',
    maxPoints: 1,
    description: 'Caste/Temperament harmony',
  },
  {
    name: 'Vasya Guna',
    tamil: 'வஸ்ய குணம்',
    maxPoints: 2,
    description: 'Control and dominance',
  },
  {
    name: 'Tara Guna',
    tamil: 'தார குணம்',
    maxPoints: 3,
    description: 'Nakshatra (star) compatibility',
  },
  {
    name: 'Yoni Guna',
    tamil: 'யோனி குணம்',
    maxPoints: 4,
    description: 'Sexual and physical compatibility',
  },
  {
    name: 'Graha Maitri',
    tamil: 'கிரக மைத்திரம்',
    maxPoints: 5,
    description: 'Planetary friendship',
  },
  {
    name: 'Gana Guna',
    tamil: 'கண குணம்',
    maxPoints: 6,
    description: 'Nature and temperament',
  },
  {
    name: 'Bhakuta Guna',
    tamil: 'பக்குடா குணம்',
    maxPoints: 7,
    description: 'Health and vitality',
  },
  {
    name: 'Nadi Guna',
    tamil: 'நாடி குணம்',
    maxPoints: 8,
    description: 'Health and progeny',
  },
];

const TOTAL_GUNA_POINTS = 36;

export function CompatibilityMatrix({ report }: { report: CompatibilityData }) {
  const { chart1, chart2 } = report;

  // Calculate Guna Milan scores (simplified for demonstration)
  const calculateGunaScores = useMemo(() => {
    const scores: Record<string, number> = {};

    // Varna Guna (1 point) - simplified based on sign
    scores['Varna Guna'] = (chart1.rashi === chart2.rashi || Math.abs(chart1.rashi - chart2.rashi) === 6) ? 1 : 0;

    // Vasya Guna (2 points) - simplified based on moon sign
    const moonDiff = Math.abs(chart1.moon.sign - chart2.moon.sign);
    scores['Vasya Guna'] = moonDiff === 0 || moonDiff === 12 ? 2 : moonDiff % 4 === 0 ? 1 : 0;

    // Tara Guna (3 points) - based on nakshatra
    const nakshatraDiff = Math.abs(chart1.nakshatra - chart2.nakshatra);
    scores['Tara Guna'] = nakshatraDiff <= 5 || nakshatraDiff >= 22 ? 3 : nakshatraDiff <= 10 ? 2 : 1;

    // Yoni Guna (4 points) - symbolic compatibility
    scores['Yoni Guna'] = (chart1.rashi + chart2.rashi) % 3 === 0 ? 4 : (chart1.rashi + chart2.rashi) % 2 === 0 ? 2 : 1;

    // Graha Maitri (5 points) - planetary friendship
    const signDiff = Math.abs(chart1.rashi - chart2.rashi);
    scores['Graha Maitri'] = signDiff <= 2 || signDiff >= 10 ? 5 : signDiff <= 5 ? 3 : 1;

    // Gana Guna (6 points) - nature harmony
    scores['Gana Guna'] = (chart1.rashi + chart2.rashi) % 2 === 0 ? 5 : (chart1.rashi + chart2.rashi) % 3 === 0 ? 3 : 2;

    // Bhakuta Guna (7 points) - health and vitality
    scores['Bhakuta Guna'] = (chart1.nakshatra - chart2.nakshatra + 27) % 27 <= 5 ? 6 : (chart1.nakshatra - chart2.nakshatra + 27) % 27 >= 22 ? 3 : 2;

    // Nadi Guna (8 points) - progeny and health
    const nadiDiff = (chart1.nakshatra - chart2.nakshatra + 27) % 27;
    scores['Nadi Guna'] = nadiDiff === 0 ? 0 : nadiDiff <= 3 || nadiDiff >= 24 ? 8 : nadiDiff <= 9 ? 6 : 2;

    return scores;
  }, [chart1, chart2]);

  // Calculate totals
  const totalScore = useMemo(() => {
    return Object.values(calculateGunaScores).reduce((sum, score) => sum + score, 0);
  }, [calculateGunaScores]);

  const compatibilityPercentage = (totalScore / TOTAL_GUNA_POINTS) * 100;

  const getCompatibilityLevel = (percentage: number): string => {
    if (percentage >= 32) return 'Excellent';
    if (percentage >= 27) return 'Good';
    if (percentage >= 22) return 'Acceptable';
    if (percentage >= 18) return 'Fair';
    return 'Poor';
  };

  const getColorForLevel = (percentage: number): string => {
    if (percentage >= 32) return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300';
    if (percentage >= 27) return 'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300';
    if (percentage >= 22) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300';
    if (percentage >= 18) return 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300';
    return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-6 border border-pink-200 dark:border-pink-800">
        <h3 className="text-xl font-semibold text-ink mb-2">Guna Milan (Compatibility Score)</h3>
        <p className="text-sm text-ink-soft">
          Traditional 36-point compatibility evaluation between <strong>{chart1.name}</strong> and <strong>{chart2.name}</strong>
        </p>
      </div>

      {/* Overall Score Card */}
      <div className={`rounded-lg p-8 border-2 text-center ${getColorForLevel(compatibilityPercentage)}`}>
        <p className="text-sm font-semibold uppercase mb-2">Overall Guna Milan Score</p>
        <p className="text-5xl font-bold mb-3">{totalScore}/36</p>
        <p className="text-3xl font-bold mb-4">{compatibilityPercentage.toFixed(1)}%</p>
        <p className="text-xl font-semibold">{getCompatibilityLevel(compatibilityPercentage)}</p>
        <p className="text-xs mt-3 opacity-75">
          {totalScore >= 32
            ? 'Highly compatible - Excellent match for marriage'
            : totalScore >= 27
            ? 'Good compatibility - Favorable for relationship'
            : totalScore >= 22
            ? 'Acceptable compatibility - Can work with effort'
            : totalScore >= 18
            ? 'Fair compatibility - Requires understanding'
            : 'Low compatibility - Significant challenges'}
        </p>
      </div>

      {/* Component Breakdown Table */}
      <div className="bg-surface border border-line rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-line">
          <h4 className="font-semibold text-ink">Guna Component Scores</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left font-semibold text-ink-soft p-4 text-sm">Guna Component</th>
                <th className="text-center font-semibold text-ink-soft p-4 text-sm">Maximum Points</th>
                <th className="text-center font-semibold text-ink-soft p-4 text-sm">Actual Score</th>
                <th className="text-center font-semibold text-ink-soft p-4 text-sm">Achievement</th>
              </tr>
            </thead>
            <tbody>
              {GUNA_COMPONENTS.map((component) => {
                const actualScore = calculateGunaScores[component.name] || 0;
                const percentage = (actualScore / component.maxPoints) * 100;

                return (
                  <tr key={component.name} className="border-b border-line hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-ink text-sm">{component.name}</p>
                        <p className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)] mb-1">
                          {component.tamil}
                        </p>
                        <p className="text-xs text-ink-soft">{component.description}</p>
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-mono font-bold text-ink text-lg">{component.maxPoints}</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-mono font-bold text-ink text-lg">{actualScore}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-line rounded-full h-2 max-w-xs overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-ink w-12 text-right">{percentage.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {/* Total Row */}
              <tr className="bg-gray-100 dark:bg-gray-800 font-bold">
                <td className="p-4 text-ink">Total Score</td>
                <td className="text-center p-4 text-ink">{TOTAL_GUNA_POINTS}</td>
                <td className="text-center p-4 text-ink text-lg">{totalScore}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-line rounded-full h-3 max-w-xs overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all"
                        style={{ width: `${compatibilityPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-ink w-16 text-right">{compatibilityPercentage.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Score Ranges */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-ink mb-4">Guna Milan Scale</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-semibold text-ink">32-36 points: Excellent</p>
                <p className="text-xs text-ink-soft">Highly compatible match</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-ink">27-31 points: Good</p>
                <p className="text-xs text-ink-soft">Favorable compatibility</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div>
                <p className="text-sm font-semibold text-ink">22-26 points: Acceptable</p>
                <p className="text-xs text-ink-soft">Reasonable match with effort</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <div>
                <p className="text-sm font-semibold text-ink">18-21 points: Fair</p>
                <p className="text-xs text-ink-soft">Needs understanding</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div>
                <p className="text-sm font-semibold text-ink">Below 18: Poor</p>
                <p className="text-xs text-ink-soft">Significant challenges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Components */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-ink mb-4">Critical Components</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-ink mb-1">🌙 Tara Guna (3 pts)</p>
              <p className="text-xs text-ink-soft">Nakshatra compatibility - Important for emotional bonding</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink mb-1">⚡ Nadi Guna (8 pts)</p>
              <p className="text-xs text-ink-soft">Most important - Health, progeny, and physical compatibility</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink mb-1">🤝 Graha Maitri (5 pts)</p>
              <p className="text-xs text-ink-soft">Planetary friendship - Emotional and mental compatibility</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Interpretations */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
        <h4 className="font-semibold text-ink mb-4">Detailed Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-ink mb-2">Strengths</p>
            <ul className="text-ink-soft space-y-1 text-xs">
              {totalScore >= 27 && <li>✓ Strong compatibility foundation</li>}
              {calculateGunaScores['Graha Maitri'] >= 4 && <li>✓ Good planetary friendship</li>}
              {calculateGunaScores['Tara Guna'] >= 2 && <li>✓ Favorable star compatibility</li>}
              {calculateGunaScores['Yoni Guna'] >= 3 && <li>✓ Good physical compatibility</li>}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink mb-2">Areas to Watch</p>
            <ul className="text-ink-soft space-y-1 text-xs">
              {calculateGunaScores['Nadi Guna'] < 4 && <li>⚠ Health/progeny considerations needed</li>}
              {calculateGunaScores['Varna Guna'] < 1 && <li>⚠ Different temperamental natures</li>}
              {calculateGunaScores['Graha Maitri'] < 3 && <li>⚠ May need effort in understanding</li>}
              {totalScore < 27 && <li>⚠ Remedies may be beneficial</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Classical Reference */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-ink-soft">
          <strong>Source:</strong> Classical Vedic astrology texts including Brihat Samhita and traditional Guna Milan system.
          36-point scale used for assessing marriage compatibility and relationship harmony.
        </p>
      </div>
    </div>
  );
}
