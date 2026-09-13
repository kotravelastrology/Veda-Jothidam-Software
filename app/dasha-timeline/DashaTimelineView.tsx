'use client';

import { useState } from 'react';

interface DashaPeriod {
  planet: string;
  tamil: string;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  duration: number;
  isActive: boolean;
  status: 'past' | 'current' | 'future';
  color: string;
}

const PLANETS_DATA: Record<string, { tamil: string; color: string }> = {
  Sun: { tamil: 'சூரியன்', color: '#FF6B35' },
  Moon: { tamil: 'சந்திரன்', color: '#F7B801' },
  Mars: { tamil: 'செவ்வாய்', color: '#E63946' },
  Mercury: { tamil: 'புதன்', color: '#457B9D' },
  Jupiter: { tamil: 'குரு', color: '#F4A261' },
  Venus: { tamil: 'சுக்ரன்', color: '#2A9D8F' },
  Saturn: { tamil: 'சனி', color: '#8B7355' },
  Rahu: { tamil: 'ராகு', color: '#6A4C93' },
  Ketu: { tamil: 'கேது', color: '#9B5DE5' },
};

export default function DashaTimelineView() {
  const [birthData, setBirthData] = useState({
    date: '1990-05-15',
    time: '10:30:00',
    latitude: '13.0827',
    longitude: '80.2707',
  });
  const [dashas, setDashas] = useState<DashaPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

  const calculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/charts/vimshottari-dasha/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: birthData.date,
          time: birthData.time,
          latitude: parseFloat(birthData.latitude),
          longitude: parseFloat(birthData.longitude),
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate dasha timeline');

      const result = await response.json();
      const dashasWithColors: DashaPeriod[] = (result.dashas || []).map((d: any) => ({
        ...d,
        isActive: d.status === 'current',
        color: PLANETS_DATA[d.planet]?.color || '#999999',
      }));

      setDashas(dashasWithColors);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const currentDasha = dashas.find(d => d.status === 'current');
  const totalDuration = dashas.reduce((sum, d) => sum + d.duration, 0);
  const pastDuration = dashas.filter(d => d.status === 'past').reduce((sum, d) => sum + d.duration, 0);

  const getMonthName = (month: number): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const getYearsDisplay = (startYear: number, startMonth: number, endYear: number, endMonth: number): string => {
    if (startYear === endYear) {
      return `${startYear}`;
    }
    return `${startYear}–${endYear}`;
  };

  const getPercentagePosition = (planet: DashaPeriod): { left: string; width: string } => {
    if (dashas.length === 0) return { left: '0%', width: '0%' };
    const leftPosition = (pastDuration / totalDuration) * 100;
    const width = (planet.duration / totalDuration) * 100;
    return { left: `${leftPosition + (dashas.filter(d => d.status === 'past').indexOf(planet) * 100 / totalDuration)}%`, width: `${width}%` };
  };

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Dasha Timeline
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          தசை கால நிர்ணயம் (Vimshottari Dasha)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          ஜீவன் சக்ரம் மற்றும் கிரகங்களின் ஆட்சிக் காலம். Life timeline showing planetary periods and their effects.
        </p>
      </header>

      {/* Input Section */}
      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த தேதி</span>
            <input
              type="date"
              value={birthData.date}
              onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த நேரம்</span>
            <input
              type="time"
              step="1"
              value={birthData.time}
              onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">அட்சரேகை</span>
            <input
              type="number"
              step="0.0001"
              value={birthData.latitude}
              onChange={(e) => setBirthData({ ...birthData, latitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">தீர்க்கரேகை</span>
            <input
              type="number"
              step="0.0001"
              value={birthData.longitude}
              onChange={(e) => setBirthData({ ...birthData, longitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
        </div>
        <button
          onClick={calculate}
          disabled={loading}
          className="w-full px-4 py-2 bg-saffron text-ink rounded font-medium disabled:opacity-50 hover:bg-saffron/90"
        >
          {loading ? 'கணக்கிடுகிறது…' : 'தசை கால கணக்கிடு'}
        </button>
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">
          ⚠️ {error}
        </div>
      )}

      {dashas.length > 0 && (
        <>
          {/* Current Dasha Info */}
          {currentDasha && (
            <div className="bg-info/10 border-2 border-info rounded-lg p-5 mb-6">
              <p className="text-xs font-semibold text-info uppercase mb-2">Current Dasha Period</p>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-ink">{currentDasha.planet} Dasha</h2>
                  <p className="text-sm text-ink-soft mt-1">
                    {getMonthName(currentDasha.startMonth)} {currentDasha.startYear} – {getMonthName(currentDasha.endMonth)} {currentDasha.endYear}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-info">{currentDasha.duration} years</p>
                  <p className="text-xs text-info/60 mt-1">Duration</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Bar */}
          <div className="bg-surface border border-line rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-ink mb-4">Life Timeline (120 Years)</h2>
            <div className="relative h-12 bg-line/20 rounded-lg overflow-hidden mb-4">
              {dashas.map((dasha, index) => (
                <div
                  key={index}
                  className="absolute h-full transition-all hover:opacity-80 cursor-pointer"
                  style={{
                    backgroundColor: dasha.color,
                    left: `${(dashas.slice(0, index).reduce((sum, d) => sum + d.duration, 0) / totalDuration) * 100}%`,
                    width: `${(dasha.duration / totalDuration) * 100}%`,
                    opacity: dasha.status === 'current' ? 1 : 0.7,
                  }}
                  title={`${dasha.planet} - ${dasha.duration} years`}
                >
                  {(dasha.duration / totalDuration) * 100 > 8 && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white mix-blend-multiply">{dasha.duration}y</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Timeline Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {dashas.map((dasha, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dasha.color }}
                  ></div>
                  <span className="text-ink-soft">{dasha.planet} ({dasha.duration}y)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dasha Periods List */}
          <div className="space-y-3">
            {dashas.map((dasha, index) => (
              <button
                key={index}
                onClick={() => setExpandedPlanet(expandedPlanet === dasha.planet ? null : dasha.planet)}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  dasha.status === 'current'
                    ? 'bg-info/10 border-info'
                    : dasha.status === 'past'
                      ? 'bg-gray/5 border-line/40'
                      : 'bg-surface border-line'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: dasha.color }}
                    ></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ink">{dasha.planet} Dasha</h3>
                        <span className="text-xs font-medium text-ink-soft">({dasha.tamil})</span>
                        {dasha.status === 'current' && (
                          <span className="px-2 py-0.5 bg-info text-white rounded text-xs font-semibold">CURRENT</span>
                        )}
                      </div>
                      <p className="text-sm text-ink-soft mt-1">
                        {getMonthName(dasha.startMonth)} {dasha.startYear} – {getMonthName(dasha.endMonth)} {dasha.endYear}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-ink">{dasha.duration}</div>
                    <div className="text-xs text-ink-soft">years</div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedPlanet === dasha.planet && (
                  <div className="mt-4 pt-4 border-t border-line/20 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-ink-soft uppercase mb-1">Start Date</p>
                        <p className="text-ink">{getMonthName(dasha.startMonth)} {dasha.startYear}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ink-soft uppercase mb-1">End Date</p>
                        <p className="text-ink">{getMonthName(dasha.endMonth)} {dasha.endYear}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-ink-soft uppercase mb-2">Strength Bar</p>
                      <div className="h-2 bg-line/20 rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            backgroundColor: dasha.color,
                            width: '100%',
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-info/5 border border-info/20 rounded p-3">
                      <p className="text-xs text-ink-soft">
                        <strong>{dasha.planet} Dasha</strong> is a period of {dasha.duration} years during which this planet's influence governs your life.
                        Results depend on the planet's natal position, aspects, and overall chart strength.
                      </p>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Dasha Interpretation Guide */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="bg-gray/5 border border-line/40 rounded-lg p-4">
              <p className="text-sm font-semibold text-ink mb-2">📋 Past Periods</p>
              <p className="text-xs text-ink-soft">
                Completed dasha periods have already influenced your life. Their effects remain through karmic imprints.
              </p>
            </div>
            <div className="bg-info/10 border border-info/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-info mb-2">⭐ Current Period</p>
              <p className="text-xs text-ink-soft">
                The active dasha period now influences major life events, opportunities, and challenges.
              </p>
            </div>
            <div className="bg-surface border border-line rounded-lg p-4">
              <p className="text-sm font-semibold text-ink mb-2">🔮 Future Periods</p>
              <p className="text-xs text-ink-soft">
                Upcoming dashas will bring their planetary influences. Plan accordingly for anticipated challenges.
              </p>
            </div>
          </div>

          {/* Sub-period Info */}
          <div className="mt-8 bg-info/10 border border-info rounded-lg p-5">
            <h3 className="font-semibold text-info mb-3">📊 Sub-periods (Antardasha)</h3>
            <p className="text-sm text-ink-soft mb-3">
              Each Dasha is further divided into 9 Sub-periods (Antardasha) corresponding to the 9 planets.
              The current sub-period can be calculated from your exact birth time and date.
            </p>
            <p className="text-xs text-ink-soft/60">
              For detailed sub-period calculations, consult with a professional astrologer or use specialized dasha software.
            </p>
          </div>
        </>
      )}

      {dashas.length === 0 && !loading && (
        <div className="text-center py-12 text-ink-soft">
          <p className="text-sm">தசை கால கணக்கிடு பொத்தான் கிளிக் செய்து உங்கள் ஜீவன் சக்ரம் பாருங்கள்.</p>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          விம்சோத்தரி தசை — 120 ஆண்டு சக்ரம், ஒவ்வொரு கிரக தசையும் குறிப்பிட்ட கால அளவுடன் வரும்.
          ஜீவிதத்தின் பல்வேறு கட்ட நிகழ்வுகளை முன்னறிய உதவும் முக்கியமான மற்றும் பயனுள்ள அறிய நூல்.
        </p>
      </footer>
    </main>
  );
}
