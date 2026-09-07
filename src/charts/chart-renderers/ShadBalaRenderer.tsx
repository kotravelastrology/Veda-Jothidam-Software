'use client';

import React from 'react';

interface ShadBalaComponent {
  name: string;
  nameTamil: string;
  value: number;
  maxValue: number;
  percentage: number;
  description: string;
}

interface PlanetaryShadbala {
  planet: string;
  planetTamil: string;
  icon: string;
  totalScore: number;
  maxScore: number;
  totalPercentage: number;
  components: ShadBalaComponent[];
}

interface ShadBalaReport {
  planets?: PlanetaryShadbala[];
  shadbala?: {
    planets: Record<string, {
      sthana: number;
      driga: number;
      cheshta: number;
      kala: number;
      ayana: number;
      yuddha: number;
      total: number;
    }>;
  };
}

const PLANET_DATA = {
  Sun: { tamilvназвание: 'சூரியன்', icon: '☀️', color: '#FFA500' },
  Moon: { tamilvназвание: 'சந்திரன்', icon: '🌙', color: '#87CEEB' },
  Mars: { tamilvназвание: 'செவ்வாய்', icon: '🔴', color: '#DC143C' },
  Mercury: { tamilvназвание: 'புதன்', icon: '💚', color: '#32CD32' },
  Jupiter: { tamilvназвание: 'குரு', icon: '🟡', color: '#FFD700' },
  Venus: { tamilvназвание: 'சுக்கிரன்', icon: '♀️', color: '#FF69B4' },
  Saturn: { tamilvназвание: 'சனி', icon: '⭐', color: '#696969' },
};

const COMPONENT_LABELS = {
  sthana: { en: 'Sthana Bala', ta: 'ஸ்தான பலம்', desc: 'Positional Strength' },
  driga: { en: 'Driga Bala', ta: 'திரிக பலம்', desc: 'Aspecting Strength' },
  cheshta: { en: 'Cheshta Bala', ta: 'சேஷ்ட பலம்', desc: 'Motion Strength' },
  kala: { en: 'Kala Bala', ta: 'கால பலம்', desc: 'Temporal Strength' },
  ayana: { en: 'Ayana Bala', ta: 'ஆயன பலம்', desc: 'Solstice Strength' },
  yuddha: { en: 'Yuddha Bala', ta: 'யுத்த பலம்', desc: 'Planetary War Strength' },
};

export function ShadBalaRenderer({ report }: { report: ShadBalaReport }) {
  const shadbalaData = report?.shadbala?.planets || {};

  // Transform raw shadbala data into structured format
  const planetaryData = Object.entries(shadbalaData).map(([planet, values]: [string, any]) => ({
    planet,
    totalScore: values.total || 0,
    maxScore: 60, // Each component maxes at 10, so total is 60
    components: [
      {
        name: COMPONENT_LABELS.sthana.en,
        nameTamil: COMPONENT_LABELS.sthana.ta,
        value: values.sthana || 0,
        maxValue: 10,
        percentage: ((values.sthana || 0) / 10) * 100,
      },
      {
        name: COMPONENT_LABELS.driga.en,
        nameTamil: COMPONENT_LABELS.driga.ta,
        value: values.driga || 0,
        maxValue: 10,
        percentage: ((values.driga || 0) / 10) * 100,
      },
      {
        name: COMPONENT_LABELS.cheshta.en,
        nameTamil: COMPONENT_LABELS.cheshta.ta,
        value: values.cheshta || 0,
        maxValue: 10,
        percentage: ((values.cheshta || 0) / 10) * 100,
      },
      {
        name: COMPONENT_LABELS.kala.en,
        nameTamil: COMPONENT_LABELS.kala.ta,
        value: values.kala || 0,
        maxValue: 10,
        percentage: ((values.kala || 0) / 10) * 100,
      },
      {
        name: COMPONENT_LABELS.ayana.en,
        nameTamil: COMPONENT_LABELS.ayana.ta,
        value: values.ayana || 0,
        maxValue: 10,
        percentage: ((values.ayana || 0) / 10) * 100,
      },
      {
        name: COMPONENT_LABELS.yuddha.en,
        nameTamil: COMPONENT_LABELS.yuddha.ta,
        value: values.yuddha || 0,
        maxValue: 10,
        percentage: ((values.yuddha || 0) / 10) * 100,
      },
    ],
  }));

  const getStrengthLevel = (percentage: number): string => {
    if (percentage >= 80) return 'Very Strong';
    if (percentage >= 60) return 'Strong';
    if (percentage >= 40) return 'Moderate';
    if (percentage >= 20) return 'Weak';
    return 'Very Weak';
  };

  const getStrengthColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getComponentColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-green-500';
    if (percentage >= 40) return 'text-yellow-600';
    if (percentage >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Overall Strength Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-xl font-semibold text-ink mb-4">Shadbala Overview</h3>
        <p className="text-sm text-ink-soft mb-6">
          The Six-fold Strength (Shadbala) system evaluates planetary strength across six dimensions.
          Each planet is rated 0-10 points per dimension, for a total of 0-60 points.
        </p>
      </div>

      {/* Planetary Strength Grid */}
      <div className="grid grid-cols-1 gap-6">
        {planetaryData.map((planet) => {
          const planetInfo = PLANET_DATA[planet.planet as keyof typeof PLANET_DATA] || {
            tamilvClassName: planet.planet,
            icon: '🪐',
            color: '#999',
          };
          const totalPercentage = (planet.totalScore / planet.maxScore) * 100;

          return (
            <div
              key={planet.planet}
              className="bg-surface border border-line rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Planet Header */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-line">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{planetInfo.icon}</span>
                    <div>
                      <p className="font-semibold text-ink">{planet.planet}</p>
                      <p className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                        {planetInfo.tamilvClassName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-ink">
                      {planet.totalScore.toFixed(1)}/{planet.maxScore}
                    </div>
                    <div className={`text-sm font-semibold ${getComponentColor(totalPercentage)}`}>
                      {getStrengthLevel(totalPercentage)} ({totalPercentage.toFixed(0)}%)
                    </div>
                  </div>
                </div>

                {/* Overall Strength Bar */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-ink-soft">Overall Strength</span>
                    <span className="text-xs font-bold text-ink">{totalPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-line rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor(totalPercentage)} transition-all duration-300`}
                      style={{ width: `${totalPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Components Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {planet.components.map((component) => (
                    <div
                      key={component.name}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-line"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm text-ink">{component.name}</p>
                          <p className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                            {component.nameTamil}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getComponentColor(component.percentage)}`}>
                            {component.value.toFixed(1)}
                          </div>
                          <p className="text-xs text-ink-soft">{component.percentage.toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* Component Progress Bar */}
                      <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${getStrengthColor(component.percentage)} transition-all duration-300`}
                          style={{ width: `${component.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Component Explanations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-ink mb-4">Shadbala Components Explained</h3>
        <div className="space-y-3">
          {Object.entries(COMPONENT_LABELS).map(([key, label]) => (
            <div key={key} className="flex gap-3">
              <div className="flex-shrink-0 w-24 font-semibold text-ink text-sm">{label.en}</div>
              <div className="text-sm text-ink-soft">
                <p className="font-[family-name:var(--font-tamil-serif)] text-ink mb-1">{label.ta}</p>
                <p>{label.desc} — Reflects the planet's position, aspects, and temporal factors.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classical Reference */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-ink-soft">
          <strong>Source:</strong> Brihat Parashara Hora Shastra (BPHS), Chapter 27, Verse 1-70
          — Complete six-fold strength evaluation system for all planets.
        </p>
      </div>
    </div>
  );
}
