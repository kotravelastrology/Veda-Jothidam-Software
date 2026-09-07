'use client';

interface DashaTimelineRendererProps {
  report: any;
}

const DASHA_NAMES: Record<string, { tamil: string; color: string }> = {
  Sun: { tamil: 'சூரியன்', color: 'bg-yellow-500' },
  Moon: { tamil: 'சந்திரன்', color: 'bg-blue-400' },
  Mars: { tamil: 'செவ்வாய்', color: 'bg-red-500' },
  Mercury: { tamil: 'புதன்', color: 'bg-green-500' },
  Jupiter: { tamil: 'குரு', color: 'bg-yellow-600' },
  Venus: { tamil: 'சுக்கிரன்', color: 'bg-white' },
  Saturn: { tamil: 'சனி', color: 'bg-gray-700' },
  Rahu: { tamil: 'ராகு', color: 'bg-purple-600' },
  Ketu: { tamil: 'கேது', color: 'bg-indigo-600' },
};

export function DashaTimelineRenderer({ report }: DashaTimelineRendererProps) {
  const dasha = report.dasha;

  if (!dasha || !dasha.periods) {
    return (
      <div className="bg-surface-soft rounded-lg p-6 text-center text-ink-soft">
        Dasha calculation in progress...
      </div>
    );
  }

  const currentDate = new Date();
  const periods = dasha.periods || [];

  const getCurrentPeriod = () => {
    return periods.find((p: any) => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return currentDate >= start && currentDate <= end;
    });
  };

  const currentPeriod = getCurrentPeriod();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDaysRemaining = (endDateStr: string) => {
    const endDate = new Date(endDateStr);
    const daysMs = endDate.getTime() - currentDate.getTime();
    const days = Math.ceil(daysMs / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-soft/30 to-indigo-soft/30 rounded-lg p-6 border-l-4 border-purple">
        <h3 className="text-xl font-bold text-ink mb-2">விம்சோத்தரி தசா (Vimshottari Dasha)</h3>
        <p className="text-sm text-ink-soft">
          120-year planetary period cycle showing major life phases. Each Dasha period reveals life themes and growth opportunities.
        </p>
      </div>

      {/* Current Dasha Highlight */}
      {currentPeriod && (
        <div className="bg-gradient-to-r from-purple/10 to-indigo/10 rounded-lg p-6 border-2 border-purple/30">
          <div className="mb-3">
            <div className="text-sm text-ink-soft mb-1">Current Dasha Period</div>
            <div className="text-2xl font-bold text-ink">
              {DASHA_NAMES[currentPeriod.lord]?.tamil} - {currentPeriod.lord}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface rounded p-3">
              <div className="text-xs text-ink-soft mb-1">Started</div>
              <div className="font-semibold text-ink">{formatDate(currentPeriod.startDate)}</div>
            </div>
            <div className="bg-surface rounded p-3">
              <div className="text-xs text-ink-soft mb-1">Ends</div>
              <div className="font-semibold text-ink">{formatDate(currentPeriod.endDate)}</div>
            </div>
            <div className="bg-surface rounded p-3">
              <div className="text-xs text-ink-soft mb-1">Remaining</div>
              <div className="font-semibold text-purple">{getDaysRemaining(currentPeriod.endDate)} days</div>
            </div>
            <div className="bg-surface rounded p-3">
              <div className="text-xs text-ink-soft mb-1">Duration</div>
              <div className="font-semibold text-ink">{currentPeriod.years} years</div>
            </div>
          </div>
        </div>
      )}

      {/* Dasha Timeline */}
      <div>
        <h4 className="font-semibold text-ink mb-4">தசாகாலம் விபரம் (Dasha Periods Timeline)</h4>
        <div className="space-y-2">
          {periods.slice(0, 10).map((period: any, idx: number) => {
            const isCurrent = currentPeriod?.lord === period.lord &&
                            currentPeriod?.startDate === period.startDate;
            const isPast = new Date(period.endDate) < currentDate;
            const isFuture = new Date(period.startDate) > currentDate;

            return (
              <div
                key={idx}
                className={`rounded-lg p-4 border-2 transition-all ${
                  isCurrent
                    ? 'bg-purple/20 border-purple'
                    : isPast
                    ? 'bg-surface-soft border-line opacity-60'
                    : 'bg-surface border-line hover:border-purple/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-2 h-12 rounded-full ${DASHA_NAMES[period.lord]?.color || 'bg-gray-400'}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-ink">
                        {DASHA_NAMES[period.lord]?.tamil} - {period.lord}
                        {isCurrent && <span className="ml-2 text-xs bg-purple text-white px-2 py-1 rounded">CURRENT</span>}
                      </div>
                      <div className="text-sm text-ink-soft">
                        {formatDate(period.startDate)} to {formatDate(period.endDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-ink">{period.years} yrs</div>
                    <div className="text-xs text-ink-soft">
                      {isCurrent && <span className="text-purple">Active</span>}
                      {isPast && <span className="text-ink-soft">Completed</span>}
                      {isFuture && <span className="text-ink-soft">Future</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {periods.length > 10 && (
          <div className="text-center text-sm text-ink-soft mt-4">
            + {periods.length - 10} more periods
          </div>
        )}
      </div>

      {/* Dasha Interpretation */}
      <div className="bg-gradient-to-r from-blue-soft/10 to-purple-soft/10 rounded-lg p-4 border-l-4 border-blue">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">📖 Understanding Dasha Periods</div>
          <div className="text-ink-soft space-y-2">
            <p>• Each Dasha represents a 120-year cycle divided into 9 planetary periods</p>
            <p>• Current Dasha lord influences life themes, challenges, and opportunities</p>
            <p>• Benefic planets in Dasha timing bring favorable results</p>
            <p>• Malefic planets require extra caution and conscious planning</p>
            <p>• Sub-periods (Bhukti) within each Dasha show finer time divisions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
