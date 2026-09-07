'use client';

import React, { useMemo } from 'react';

interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  duration: number; // in years
  subPeriods?: DashaPeriod[];
}

interface DashaTimeline {
  currentDasha: DashaPeriod;
  nextDasha: DashaPeriod;
  upcomingPeriods: DashaPeriod[];
}

interface DashaOverlapReport {
  nativeChart: {
    name: string;
    dasha: DashaTimeline;
  };
  comparisonChart: {
    name: string;
    dasha: DashaTimeline;
  };
  overlappingPeriods?: Array<{
    startDate: string;
    endDate: string;
    nativePlanet: string;
    comparisonPlanet: string;
    compatibility: 'harmonious' | 'challenging' | 'neutral';
  }>;
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

const DASHA_YEARS = {
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Mercury: 17,
  Jupiter: 16,
  Venus: 20,
  Saturn: 19,
};

export function DashaOverlapAnalysis({ report }: { report: DashaOverlapReport }) {
  const nativeChart = report?.nativeChart;
  const comparisonChart = report?.comparisonChart;
  const overlappingPeriods = report?.overlappingPeriods || [];

  // Calculate next 5 years of dasha periods
  const generateDashaTimeline = (startDate: string, count: number = 5) => {
    const periods = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < count; i++) {
      const planet = Object.keys(PLANET_DATA)[i % 7];
      const duration = DASHA_YEARS[planet as keyof typeof DASHA_YEARS];
      const endDate = new Date(currentDate);
      endDate.setFullYear(endDate.getFullYear() + duration);

      periods.push({
        planet,
        startDate: currentDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        duration,
      });

      currentDate = endDate;
    }
    return periods;
  };

  // Calculate timeline compatibility
  const timelineCompatibility = useMemo(() => {
    const nativePeriods = generateDashaTimeline(nativeChart?.dasha?.currentDasha?.startDate || new Date().toISOString());
    const comparisonPeriods = generateDashaTimeline(
      comparisonChart?.dasha?.currentDasha?.startDate || new Date().toISOString(),
    );

    const harmonious = ['Jupiter-Jupiter', 'Venus-Venus', 'Mercury-Mercury'];
    const challenging = ['Mars-Saturn', 'Saturn-Mars', 'Mars-Mars', 'Saturn-Saturn'];

    const overlaps: Array<{
      period: string;
      nativePlanet: string;
      comparisonPlanet: string;
      compatibility: 'harmonious' | 'challenging' | 'neutral';
    }> = [];

    nativePeriods.forEach((np) => {
      comparisonPeriods.forEach((cp) => {
        const npStart = new Date(np.startDate).getTime();
        const npEnd = new Date(np.endDate).getTime();
        const cpStart = new Date(cp.startDate).getTime();
        const cpEnd = new Date(cp.endDate).getTime();

        if (npStart < cpEnd && cpStart < npEnd) {
          const overlapStart = new Date(Math.max(npStart, cpStart)).toISOString().split('T')[0];
          const overlapEnd = new Date(Math.min(npEnd, cpEnd)).toISOString().split('T')[0];
          const combinationKey = `${np.planet}-${cp.planet}`;

          let compatibility: 'harmonious' | 'challenging' | 'neutral' = 'neutral';
          if (harmonious.includes(combinationKey)) compatibility = 'harmonious';
          if (challenging.includes(combinationKey)) compatibility = 'challenging';

          overlaps.push({
            period: `${overlapStart} to ${overlapEnd}`,
            nativePlanet: np.planet,
            comparisonPlanet: cp.planet,
            compatibility,
          });
        }
      });
    });

    return overlaps;
  }, [nativeChart, comparisonChart]);

  const getCompatibilityColor = (compatibility: string): string => {
    switch (compatibility) {
      case 'harmonious':
        return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300';
      case 'challenging':
        return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300';
    }
  };

  const getCurrentDasha = (dasha: DashaTimeline) => dasha?.currentDasha;
  const getNextDasha = (dasha: DashaTimeline) => dasha?.nextDasha;

  const nativeCurrentDasha = getCurrentDasha(nativeChart?.dasha);
  const comparisonCurrentDasha = getCurrentDasha(comparisonChart?.dasha);
  const nativeNextDasha = getNextDasha(nativeChart?.dasha);
  const comparisonNextDasha = getNextDasha(comparisonChart?.dasha);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-xl font-semibold text-ink mb-2">Dasha Period Overlap Analysis</h3>
        <p className="text-sm text-ink-soft">
          Timeline comparison showing concurrent Dasha periods and their compatibility for <strong>{nativeChart?.name}</strong> and{' '}
          <strong>{comparisonChart?.name}</strong>
        </p>
      </div>

      {/* Current Dasha Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Native Chart Current Dasha */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-3">
            {nativeChart?.name} - Current Dasha
          </p>
          {nativeCurrentDasha && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {PLANET_DATA[nativeCurrentDasha.planet as keyof typeof PLANET_DATA]?.icon || '🪐'}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-ink">{nativeCurrentDasha.planet}</p>
                  <p className="text-xs text-ink-soft">
                    {PLANET_DATA[nativeCurrentDasha.planet as keyof typeof PLANET_DATA]?.tamil}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                <p className="text-ink-soft text-xs mb-1">Duration</p>
                <p className="font-semibold text-ink">{nativeCurrentDasha.duration} years</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                <p className="text-ink-soft text-xs mb-1">Period</p>
                <p className="font-mono text-xs text-ink">
                  {nativeCurrentDasha.startDate} to {nativeCurrentDasha.endDate}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Chart Current Dasha */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase mb-3">
            {comparisonChart?.name} - Current Dasha
          </p>
          {comparisonCurrentDasha && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {PLANET_DATA[comparisonCurrentDasha.planet as keyof typeof PLANET_DATA]?.icon || '🪐'}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-ink">{comparisonCurrentDasha.planet}</p>
                  <p className="text-xs text-ink-soft">
                    {PLANET_DATA[comparisonCurrentDasha.planet as keyof typeof PLANET_DATA]?.tamil}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                <p className="text-ink-soft text-xs mb-1">Duration</p>
                <p className="font-semibold text-ink">{comparisonCurrentDasha.duration} years</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                <p className="text-ink-soft text-xs mb-1">Period</p>
                <p className="font-mono text-xs text-ink">
                  {comparisonCurrentDasha.startDate} to {comparisonCurrentDasha.endDate}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Dasha Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Native Next Dasha */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-3">
            {nativeChart?.name} - Next Dasha
          </p>
          {nativeNextDasha && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">
                {PLANET_DATA[nativeNextDasha.planet as keyof typeof PLANET_DATA]?.icon || '🪐'}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-ink">{nativeNextDasha.planet}</p>
                <p className="text-xs text-ink-soft mb-2">
                  {PLANET_DATA[nativeNextDasha.planet as keyof typeof PLANET_DATA]?.tamil} ({nativeNextDasha.duration} yrs)
                </p>
                <p className="text-xs font-mono text-ink-soft">
                  {nativeNextDasha.startDate} to {nativeNextDasha.endDate}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Next Dasha */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase mb-3">
            {comparisonChart?.name} - Next Dasha
          </p>
          {comparisonNextDasha && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">
                {PLANET_DATA[comparisonNextDasha.planet as keyof typeof PLANET_DATA]?.icon || '🪐'}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-ink">{comparisonNextDasha.planet}</p>
                <p className="text-xs text-ink-soft mb-2">
                  {PLANET_DATA[comparisonNextDasha.planet as keyof typeof PLANET_DATA]?.tamil} (
                  {comparisonNextDasha.duration} yrs)
                </p>
                <p className="text-xs font-mono text-ink-soft">
                  {comparisonNextDasha.startDate} to {comparisonNextDasha.endDate}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Compatibility */}
      <div className="bg-surface border border-line rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-line">
          <h4 className="font-semibold text-ink">Overlapping Dasha Periods ({timelineCompatibility.length} found)</h4>
        </div>

        {timelineCompatibility.length > 0 ? (
          <div className="divide-y divide-line">
            {timelineCompatibility.slice(0, 10).map((overlap, idx) => {
              const nativePlanetInfo = PLANET_DATA[overlap.nativePlanet as keyof typeof PLANET_DATA] || {
                tamil: overlap.nativePlanet,
                icon: '🪐',
              };
              const comparisonPlanetInfo =
                PLANET_DATA[overlap.comparisonPlanet as keyof typeof PLANET_DATA] || {
                  tamil: overlap.comparisonPlanet,
                  icon: '🪐',
                };

              return (
                <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{nativePlanetInfo.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-ink">{overlap.nativePlanet}</p>
                        <p className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                          {nativePlanetInfo.tamil}
                        </p>
                      </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCompatibilityColor(overlap.compatibility)}`}>
                      {overlap.compatibility === 'harmonious' ? '✓ Harmonious' : overlap.compatibility === 'challenging' ? '⚠ Challenging' : '◌ Neutral'}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xl">{comparisonPlanetInfo.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-ink">{overlap.comparisonPlanet}</p>
                        <p className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                          {comparisonPlanetInfo.tamil}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-ink-soft">{overlap.period}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-ink-soft">
            <p className="mb-2">📅 No overlapping periods in next 5 years</p>
            <p className="text-xs">Charts transition through Dasha periods independently</p>
          </div>
        )}
      </div>

      {/* Timeline Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">✓ Harmonious Periods</p>
          <p className="text-xs text-ink-soft">Same planetary rulers or naturally compatible planets (Jupiter, Venus, Mercury)</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">⚠ Challenging Periods</p>
          <p className="text-xs text-ink-soft">Malefic combinations requiring careful management (Mars-Saturn, etc.)</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-2">◌ Neutral Periods</p>
          <p className="text-xs text-ink-soft">Mixed planetary influences requiring balance and awareness</p>
        </div>
      </div>

      {/* Dasha Duration Reference */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-ink mb-4">Vimshottari Dasha Cycle</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {Object.entries(DASHA_YEARS).map(([planet, years]) => {
            const planetInfo = PLANET_DATA[planet as keyof typeof PLANET_DATA] || {
              tamil: planet,
              icon: '🪐',
            };
            return (
              <div key={planet} className="bg-white dark:bg-gray-800 rounded p-3 border border-blue-100 dark:border-blue-900">
                <p className="text-xs font-semibold text-ink-soft mb-1">{planetInfo.icon} {planet}</p>
                <p className="font-bold text-ink">{years} years</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-ink-soft mt-4">
          Total 120-year cycle. Each planet rules a major period with subdivisions into sub-periods (Bhukti) and finer intervals.
        </p>
      </div>

      {/* Classical Reference */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-ink-soft">
          <strong>Source:</strong> Brihat Parashara Hora Shastra (BPHS), Chapters 41-46
          — Vimshottari Dasha system, period calculations, and timeline analysis.
        </p>
      </div>
    </div>
  );
}
