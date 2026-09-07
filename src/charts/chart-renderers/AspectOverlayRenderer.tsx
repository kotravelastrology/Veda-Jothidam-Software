'use client';

import React, { useMemo } from 'react';

interface PlanetPosition {
  planet: string;
  longitude: number;
  latitude: number;
  sign: number;
  degree: number;
  retrograde: boolean;
}

interface AspectData {
  planet1: string;
  planet2: string;
  aspectType: string;
  angle: number;
  orb: number;
  strength: number; // 0-100
  nature: 'benefic' | 'malefic' | 'neutral';
  isApplying: boolean;
  separating: boolean;
}

interface AspectOverlayReport {
  nativeChart: {
    name: string;
    planets: Record<string, PlanetPosition>;
  };
  comparisonChart: {
    name: string;
    planets: Record<string, PlanetPosition>;
  };
  aspects: AspectData[];
  comparisonType: string;
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

const ASPECT_TYPES = {
  conjunction: { symbol: '☌', angle: 0, orb: 8 },
  sextile: { symbol: '⬡', angle: 60, orb: 6 },
  square: { symbol: '□', angle: 90, orb: 8 },
  trine: { symbol: '△', angle: 120, orb: 8 },
  opposition: { symbol: '☍', angle: 180, orb: 8 },
  quincunx: { symbol: '⚻', angle: 150, orb: 4 },
};

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export function AspectOverlayRenderer({ report }: { report: AspectOverlayReport }) {
  const aspects = report?.aspects || [];
  const nativeChartName = report?.nativeChart?.name || 'Native';
  const comparisonChartName = report?.comparisonChart?.name || 'Comparison';

  // Organize aspects by type
  const aspectsByType = useMemo(() => {
    const grouped: Record<string, AspectData[]> = {};
    aspects.forEach((aspect) => {
      if (!grouped[aspect.aspectType]) {
        grouped[aspect.aspectType] = [];
      }
      grouped[aspect.aspectType].push(aspect);
    });
    return grouped;
  }, [aspects]);

  // Calculate aspect statistics
  const aspectStats = useMemo(() => {
    const benefic = aspects.filter((a) => a.nature === 'benefic').length;
    const malefic = aspects.filter((a) => a.nature === 'malefic').length;
    const neutral = aspects.filter((a) => a.nature === 'neutral').length;
    const avgStrength = aspects.length > 0 ? aspects.reduce((sum, a) => sum + a.strength, 0) / aspects.length : 0;

    return { benefic, malefic, neutral, avgStrength };
  }, [aspects]);

  const getNatureColor = (nature: string): string => {
    switch (nature) {
      case 'benefic':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300';
      case 'malefic':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300';
    }
  };

  const getStrengthColor = (strength: number): string => {
    if (strength >= 80) return 'text-green-600 dark:text-green-400 font-bold';
    if (strength >= 60) return 'text-green-500 dark:text-green-300';
    if (strength >= 40) return 'text-yellow-600 dark:text-yellow-400';
    if (strength >= 20) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getOrbColor = (orb: number): string => {
    if (orb < 2) return 'text-green-600 dark:text-green-400 font-bold';
    if (orb < 4) return 'text-green-500 dark:text-green-300';
    if (orb < 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
        <h3 className="text-xl font-semibold text-ink mb-2">Aspect Overlay Analysis</h3>
        <p className="text-sm text-ink-soft">
          Aspects from <strong>{comparisonChartName}</strong>'s planets to <strong>{nativeChartName}</strong>'s planets and houses
        </p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase mb-2">Benefic Aspects</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{aspectStats.benefic}</p>
          <p className="text-xs text-ink-soft mt-1">{((aspectStats.benefic / aspects.length) * 100).toFixed(0)}% of total</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase mb-2">Malefic Aspects</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{aspectStats.malefic}</p>
          <p className="text-xs text-ink-soft mt-1">{((aspectStats.malefic / aspects.length) * 100).toFixed(0)}% of total</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase mb-2">Neutral Aspects</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{aspectStats.neutral}</p>
          <p className="text-xs text-ink-soft mt-1">{((aspectStats.neutral / aspects.length) * 100).toFixed(0)}% of total</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-2">Avg Strength</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{aspectStats.avgStrength.toFixed(0)}%</p>
          <p className="text-xs text-ink-soft mt-1">Overall aspect intensity</p>
        </div>
      </div>

      {/* Aspects Organized by Type */}
      <div className="space-y-6">
        {Object.entries(ASPECT_TYPES).map(([typeKey, typeInfo]) => {
          const typeAspects = aspectsByType[typeKey] || [];
          if (typeAspects.length === 0) return null;

          return (
            <div key={typeKey} className="bg-surface border border-line rounded-lg overflow-hidden">
              {/* Type Header */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-line">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{typeInfo.symbol}</span>
                  <div>
                    <p className="font-semibold text-ink capitalize">{typeKey} ({typeAspects.length})</p>
                    <p className="text-xs text-ink-soft">{typeInfo.angle}° angle, {typeInfo.orb}° orb</p>
                  </div>
                </div>
              </div>

              {/* Aspects List */}
              <div className="divide-y divide-line">
                {typeAspects.map((aspect, idx) => {
                  const p1Info = PLANET_DATA[aspect.planet1 as keyof typeof PLANET_DATA] || { tamil: aspect.planet1, icon: '🪐' };
                  const p2Info = PLANET_DATA[aspect.planet2 as keyof typeof PLANET_DATA] || { tamil: aspect.planet2, icon: '🪐' };

                  return (
                    <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        {/* Planet 1 (Comparison Chart) */}
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{p1Info.icon}</span>
                          <div>
                            <p className="font-semibold text-sm text-ink">{aspect.planet1}</p>
                            <p className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">{p1Info.tamil}</p>
                            <p className="text-xs text-ink-soft">({comparisonChartName})</p>
                          </div>
                        </div>

                        {/* Aspect Symbol & Details */}
                        <div className="text-center">
                          <p className="text-2xl mb-1">{typeInfo.symbol}</p>
                          <p className={`text-xs font-semibold ${getNatureColor(aspect.nature)}`}>
                            {aspect.nature.toUpperCase()}
                          </p>
                        </div>

                        {/* Planet 2 (Native Chart) */}
                        <div className="flex items-center gap-2 text-right">
                          <div>
                            <p className="font-semibold text-sm text-ink">{aspect.planet2}</p>
                            <p className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">{p2Info.tamil}</p>
                            <p className="text-xs text-ink-soft">({nativeChartName})</p>
                          </div>
                          <span className="text-2xl">{p2Info.icon}</span>
                        </div>
                      </div>

                      {/* Aspect Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3 pt-3 border-t border-line">
                        <div>
                          <p className="text-xs text-ink-soft font-semibold mb-1">Angle</p>
                          <p className="text-sm font-mono font-bold text-ink">{aspect.angle.toFixed(1)}°</p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-soft font-semibold mb-1">Orb</p>
                          <p className={`text-sm font-mono font-bold ${getOrbColor(aspect.orb)}`}>
                            {aspect.orb.toFixed(2)}°
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-soft font-semibold mb-1">Strength</p>
                          <p className={`text-sm font-mono font-bold ${getStrengthColor(aspect.strength)}`}>
                            {aspect.strength.toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-soft font-semibold mb-1">Phase</p>
                          <p className="text-sm font-semibold text-ink">
                            {aspect.isApplying ? '📈 Applying' : aspect.separating ? '📉 Separating' : '◌ Exact'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-soft font-semibold mb-1">Effect</p>
                          <div className="w-full bg-line rounded-full h-2">
                            <div
                              className={`h-full rounded-full ${
                                aspect.nature === 'benefic' ? 'bg-green-500' : aspect.nature === 'malefic' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${aspect.strength}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Aspect Key Legend */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-ink mb-4">Aspect Interpretation Guide</h4>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">✓ Benefic Aspects</p>
            <p className="text-sm text-ink-soft">
              Harmonious aspects (Trine 120°, Sextile 60°) that bring ease, cooperation, and positive influence.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">⚠ Malefic Aspects</p>
            <p className="text-sm text-ink-soft">
              Challenging aspects (Square 90°, Opposition 180°) that create friction, tension, and require adjustment.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-1">◌ Neutral Aspects</p>
            <p className="text-sm text-ink-soft">
              Quincunx (150°) and Conjunction (0°) — effects depend on planets involved and context.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
            <p className="text-xs text-ink-soft">
              <strong>Orb:</strong> Tighter orbs (0-2°) indicate stronger, more precise aspects.
              <br />
              <strong>Phase:</strong> Applying aspects intensify, separating aspects fade, exact aspects peak.
            </p>
          </div>
        </div>
      </div>

      {/* Classical Reference */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-ink-soft">
          <strong>Source:</strong> Brihat Parashara Hora Shastra (BPHS), Chapter 6 & 39
          — Aspect rules and synastry interpretation principles.
        </p>
      </div>
    </div>
  );
}
