'use client';

import React, { useMemo } from 'react';

interface PlanetaryShadbala {
  planet: string;
  sthana: number;
  driga: number;
  cheshta: number;
  kala: number;
  ayana: number;
  yuddha: number;
  total: number;
}

interface ComparisonReport {
  nativeChart: {
    name: string;
    shadbala: Record<string, PlanetaryShadbala>;
  };
  comparisonChart: {
    name: string;
    shadbala: Record<string, PlanetaryShadbala>;
  };
  comparisonType: 'transit' | 'synastry' | 'varshaphala' | 'historical';
}

const PLANET_DATA = {
  Sun: { tamil: 'சூரியன்', icon: '☀️', color: '#FFA500' },
  Moon: { tamil: 'சந்திரன்', icon: '🌙', color: '#87CEEB' },
  Mars: { tamil: 'செவ்வாய்', icon: '🔴', color: '#DC143C' },
  Mercury: { tamil: 'புதன்', icon: '💚', color: '#32CD32' },
  Jupiter: { tamil: 'குரு', icon: '🟡', color: '#FFD700' },
  Venus: { tamil: 'சுக்கிரன்', icon: '♀️', color: '#FF69B4' },
  Saturn: { tamil: 'சனி', icon: '⭐', color: '#696969' },
};

const COMPONENTS = [
  { key: 'sthana', label: 'Sthana', tamil: 'ஸ்தான', desc: 'Position' },
  { key: 'driga', label: 'Driga', tamil: 'திரிக', desc: 'Aspect' },
  { key: 'cheshta', label: 'Cheshta', tamil: 'சேஷ்ட', desc: 'Motion' },
  { key: 'kala', label: 'Kala', tamil: 'கால', desc: 'Time' },
  { key: 'ayana', label: 'Ayana', tamil: 'ஆயன', desc: 'Solstice' },
  { key: 'yuddha', label: 'Yuddha', tamil: 'யுத்த', desc: 'War' },
];

export function DualShadBalaComparison({ report }: { report: ComparisonReport }) {
  const nativeShadbala = report?.nativeChart?.shadbala || {};
  const comparisonShadbala = report?.comparisonChart?.shadbala || {};

  // Calculate differentials for all planets
  const planetComparisons = useMemo(() => {
    return Object.keys(nativeShadbala).map((planet) => {
      const native = nativeShadbala[planet];
      const comparison = comparisonShadbala[planet] || {
        sthana: 0, driga: 0, cheshta: 0, kala: 0, ayana: 0, yuddha: 0, total: 0,
      };

      return {
        planet,
        native,
        comparison,
        differential: {
          sthana: native.sthana - comparison.sthana,
          driga: native.driga - comparison.driga,
          cheshta: native.cheshta - comparison.cheshta,
          kala: native.kala - comparison.kala,
          ayana: native.ayana - comparison.ayana,
          yuddha: native.yuddha - comparison.yuddha,
          total: native.total - comparison.total,
        },
      };
    });
  }, [nativeShadbala, comparisonShadbala]);

  const getStrengthColor = (value: number): string => {
    if (value > 5) return 'text-green-600 font-bold';
    if (value > 0) return 'text-green-500';
    if (value === 0) return 'text-gray-500';
    if (value > -5) return 'text-orange-500';
    return 'text-red-600 font-bold';
  };

  const getDifferentialColor = (diff: number): string => {
    if (diff > 2) return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    if (diff > 0) return 'bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400';
    if (diff === 0) return 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    if (diff > -2) return 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400';
    return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
  };

  const getComparisonTypeLabel = (type: string): string => {
    const labels = {
      transit: 'Native vs Current Transits',
      synastry: 'Partner Compatibility',
      varshaphala: 'Native vs Annual Chart',
      historical: 'Chart Rectification Comparison',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-8">
      {/* Comparison Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-ink">Chart Comparison</h3>
            <p className="text-sm text-ink-soft mt-1">{getComparisonTypeLabel(report.comparisonType)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-ink-soft uppercase">Comparison Type</p>
            <p className="text-lg font-semibold text-ink capitalize">{report.comparisonType}</p>
          </div>
        </div>
      </div>

      {/* Chart Names & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-ink-soft uppercase mb-2">Native Chart</p>
          <p className="text-lg font-semibold text-ink">{report.nativeChart.name}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-xs font-semibold text-ink-soft uppercase mb-2">Comparison Chart</p>
          <p className="text-lg font-semibold text-ink">{report.comparisonChart.name}</p>
        </div>
      </div>

      {/* Planetary Strength Comparison Grid */}
      <div className="space-y-6">
        {planetComparisons.map((comparison) => {
          const planetInfo = PLANET_DATA[comparison.planet as keyof typeof PLANET_DATA] || {
            tamil: comparison.planet,
            icon: '🪐',
            color: '#999',
          };

          return (
            <div key={comparison.planet} className="bg-surface border border-line rounded-lg overflow-hidden">
              {/* Planet Header */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-line">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{planetInfo.icon}</span>
                  <div>
                    <p className="font-semibold text-ink">{comparison.planet}</p>
                    <p className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                      {planetInfo.tamil}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-semibold text-ink">
                      {comparison.native.total.toFixed(1)} vs {comparison.comparison.total.toFixed(1)}
                    </p>
                    <p className={`text-sm font-semibold ${getStrengthColor(comparison.differential.total)}`}>
                      {comparison.differential.total > 0 ? '+' : ''}{comparison.differential.total.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Component Comparison Table */}
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line">
                        <th className="text-left font-semibold text-ink-soft py-2">Component</th>
                        <th className="text-center font-semibold text-ink-soft py-2">Native</th>
                        <th className="text-center font-semibold text-ink-soft py-2">Comparison</th>
                        <th className="text-center font-semibold text-ink-soft py-2">Differential</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPONENTS.map((component) => {
                        const key = component.key as keyof Omit<PlanetaryShadbala, 'planet'>;
                        const nativeVal = comparison.native[key];
                        const compVal = comparison.comparison[key];
                        const diff = comparison.differential[key];

                        return (
                          <tr key={component.key} className="border-b border-line hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-3">
                              <div>
                                <p className="font-semibold text-ink">{component.label}</p>
                                <p className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                                  {component.tamil}
                                </p>
                              </div>
                            </td>
                            <td className="text-center py-3">
                              <span className="font-mono font-semibold text-ink">
                                {typeof nativeVal === 'number' ? nativeVal.toFixed(1) : '-'}
                              </span>
                            </td>
                            <td className="text-center py-3">
                              <span className="font-mono font-semibold text-ink">
                                {typeof compVal === 'number' ? compVal.toFixed(1) : '-'}
                              </span>
                            </td>
                            <td className="text-center py-3">
                              <span className={`inline-block px-2 py-1 rounded font-mono font-semibold ${getDifferentialColor(diff)}`}>
                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {/* Total Row */}
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <td className="py-3 font-bold text-ink">Total</td>
                        <td className="text-center py-3">
                          <span className="font-mono font-bold text-ink">
                            {comparison.native.total.toFixed(1)}
                          </span>
                        </td>
                        <td className="text-center py-3">
                          <span className="font-mono font-bold text-ink">
                            {comparison.comparison.total.toFixed(1)}
                          </span>
                        </td>
                        <td className="text-center py-3">
                          <span className={`inline-block px-2 py-1 rounded font-mono font-bold ${getDifferentialColor(comparison.differential.total)}`}>
                            {comparison.differential.total > 0 ? '+' : ''}{comparison.differential.total.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strength Interpretation */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-line">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-ink-soft font-semibold mb-1">Native Strength</p>
                    <div className="w-full bg-line rounded h-2">
                      <div
                        className="bg-blue-500 h-full rounded"
                        style={{ width: `${Math.min((comparison.native.total / 60) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-ink mt-1 font-semibold">{((comparison.native.total / 60) * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-ink-soft font-semibold mb-1">Comparison Strength</p>
                    <div className="w-full bg-line rounded h-2">
                      <div
                        className="bg-purple-500 h-full rounded"
                        style={{ width: `${Math.min((comparison.comparison.total / 60) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-ink mt-1 font-semibold">{((comparison.comparison.total / 60) * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-ink-soft font-semibold mb-1">Differential</p>
                    <div className={`px-2 py-1 rounded text-center font-bold ${getDifferentialColor(comparison.differential.total)}`}>
                      {comparison.differential.total > 0 ? '+' : ''}{comparison.differential.total.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <p className="text-ink-soft font-semibold mb-1">Status</p>
                    <div className="text-center text-ink font-semibold">
                      {Math.abs(comparison.differential.total) > 5 ? '⚠️ High' : '✓ Balanced'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-ink mb-4">Comparison Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-blue-100 dark:border-blue-900">
            <p className="text-xs text-ink-soft font-semibold mb-1">Stronger Native Planets</p>
            <p className="text-lg font-bold text-ink">
              {planetComparisons.filter((p) => p.differential.total > 2).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-blue-100 dark:border-blue-900">
            <p className="text-xs text-ink-soft font-semibold mb-1">Average Differential</p>
            <p className="text-lg font-bold text-ink">
              {(planetComparisons.reduce((sum, p) => sum + Math.abs(p.differential.total), 0) / planetComparisons.length).toFixed(1)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-blue-100 dark:border-blue-900">
            <p className="text-xs text-ink-soft font-semibold mb-1">Total Native Strength</p>
            <p className="text-lg font-bold text-ink">
              {planetComparisons.reduce((sum, p) => sum + p.native.total, 0).toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Classical Reference */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-ink-soft">
          <strong>Source:</strong> Brihat Parashara Hora Shastra (BPHS), Chapter 27 & 39
          — Shadbala comparison for chart analysis and synastry evaluation.
        </p>
      </div>
    </div>
  );
}
