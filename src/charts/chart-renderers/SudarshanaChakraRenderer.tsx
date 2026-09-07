'use client';

interface SudarshanaChakraRendererProps {
  report: any;
}

const NAKSHATRAS = [
  { name: 'Ashwini', tamil: 'அश்வினி', lord: 'Ketu', element: 'Fire' },
  { name: 'Bharani', tamil: 'பரணி', lord: 'Venus', element: 'Earth' },
  { name: 'Krittika', tamil: 'கிருத்திகை', lord: 'Sun', element: 'Fire' },
  { name: 'Rohini', tamil: 'ரோகிணி', lord: 'Moon', element: 'Earth' },
  { name: 'Mrigashirsha', tamil: 'மிருகசீரிஷ', lord: 'Mars', element: 'Air' },
  { name: 'Ardra', tamil: 'ஆர்த்திரை', lord: 'Rahu', element: 'Water' },
  { name: 'Punarvasu', tamil: 'புனர்வசு', lord: 'Jupiter', element: 'Water' },
  { name: 'Pushya', tamil: 'புஷ்ய', lord: 'Saturn', element: 'Earth' },
  { name: 'Ashlesha', tamil: 'ஆஸ்லேஷை', lord: 'Mercury', element: 'Water' },
  { name: 'Magha', tamil: 'மகை', lord: 'Ketu', element: 'Fire' },
  { name: 'Purva Phalguni', tamil: 'பூர்வ பல்குனி', lord: 'Venus', element: 'Fire' },
  { name: 'Uttara Phalguni', tamil: 'உத்திர பல்குனி', lord: 'Sun', element: 'Fire' },
  { name: 'Hasta', tamil: 'கச', lord: 'Moon', element: 'Earth' },
  { name: 'Chitra', tamil: 'சித்திரை', lord: 'Mars', element: 'Fire' },
  { name: 'Swati', tamil: 'சுவாதி', lord: 'Rahu', element: 'Air' },
  { name: 'Vishakha', tamil: 'விசாகம்', lord: 'Jupiter', element: 'Fire' },
  { name: 'Anuradha', tamil: 'அனுராதம்', lord: 'Saturn', element: 'Air' },
  { name: 'Jyeshtha', tamil: 'ஜ்யேஷ்டை', lord: 'Mercury', element: 'Air' },
  { name: 'Mula', tamil: 'மூலம்', lord: 'Ketu', element: 'Earth' },
  { name: 'Purva Ashadha', tamil: 'பூர்வ ஆஷாடம்', lord: 'Venus', element: 'Fire' },
  { name: 'Uttara Ashadha', tamil: 'உத்திர ஆஷாடம்', lord: 'Sun', element: 'Earth' },
  { name: 'Shravana', tamil: 'திருவோணம்', lord: 'Moon', element: 'Air' },
  { name: 'Dhanishta', tamil: 'தனிஷ்டை', lord: 'Mars', element: 'Air' },
  { name: 'Shatabhisha', tamil: 'சதயம்', lord: 'Rahu', element: 'Air' },
  { name: 'Purva Bhadrapada', tamil: 'பூர்வ பட்டாபதம்', lord: 'Jupiter', element: 'Water' },
  { name: 'Uttara Bhadrapada', tamil: 'உத்திர பட்டாபதம்', lord: 'Saturn', element: 'Water' },
  { name: 'Revati', tamil: 'ரேவதி', lord: 'Mercury', element: 'Water' },
];

const getNakshatraColor = (element: string): string => {
  switch (element) {
    case 'Fire': return 'bg-red-500/20 border-red-500/50';
    case 'Earth': return 'bg-amber-500/20 border-amber-500/50';
    case 'Air': return 'bg-cyan-500/20 border-cyan-500/50';
    case 'Water': return 'bg-blue-500/20 border-blue-500/50';
    default: return 'bg-surface-soft border-line';
  }
};

export function SudarshanaChakraRenderer({ report }: SudarshanaChakraRendererProps) {
  const moonNakshatra = report.chart?.moonNakshatra;
  const moonNakshatraIdx = moonNakshatra ? parseInt(moonNakshatra) - 1 : -1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-soft/30 to-indigo-soft/30 rounded-lg p-6 border-l-4 border-blue">
        <h3 className="text-xl font-bold text-ink mb-2">சுதர்சன சக்கிரம் (Sudarshana Chakra - Lunar Mansions)</h3>
        <p className="text-sm text-ink-soft">
          The 27 lunar mansions (Nakshatras) showing Moon's position and its influence on personality, emotions, and life path.
        </p>
      </div>

      {/* Moon's Current Nakshatra */}
      {moonNakshatraIdx >= 0 && (
        <div className="bg-gradient-to-r from-blue/10 to-indigo/10 rounded-lg p-6 border-2 border-blue/30">
          <div className="mb-3">
            <div className="text-sm text-ink-soft mb-1">Moon's Lunar Mansion</div>
            <div className="text-2xl font-bold text-ink">
              {NAKSHATRAS[moonNakshatraIdx]?.tamil} - {NAKSHATRAS[moonNakshatraIdx]?.name}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface rounded p-3">
              <div className="text-xs text-ink-soft mb-1">Nakshatra Lord</div>
              <div className="font-semibold text-ink">{NAKSHATRAS[moonNakshatraIdx]?.lord}</div>
            </div>
            <div className="bg-surface rounded p-3">
              <div className="text-xs text-ink-soft mb-1">Element</div>
              <div className="font-semibold text-ink">{NAKSHATRAS[moonNakshatraIdx]?.element}</div>
            </div>
            <div className="bg-surface rounded p-3">
              <div className="text-xs text-ink-soft mb-1">Moon Position</div>
              <div className="font-semibold text-blue">{moonNakshatraIdx + 1} of 27</div>
            </div>
          </div>
        </div>
      )}

      {/* Circular Nakshatra Arrangement */}
      <div className="flex justify-center">
        <svg viewBox="0 0 500 500" className="w-full max-w-2xl" xmlns="http://www.w3.org/2000/svg">
          {/* Background circle */}
          <circle cx="250" cy="250" r="240" fill="var(--color-surface-soft)" stroke="var(--color-line)" strokeWidth="2" />

          {/* Concentric circles for reference */}
          <circle cx="250" cy="250" r="80" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.3" />
          <circle cx="250" cy="250" r="150" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.3" />
          <circle cx="250" cy="250" r="220" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.3" />

          {/* Nakshatras arranged in circle */}
          {NAKSHATRAS.map((nakshatra, idx) => {
            const angle = (idx / 27) * 2 * Math.PI - Math.PI / 2;
            const radius = 200;
            const x = 250 + radius * Math.cos(angle);
            const y = 250 + radius * Math.sin(angle);
            const isMoonPosition = idx === moonNakshatraIdx;

            return (
              <g key={idx}>
                {/* Connection line to center */}
                <line
                  x1="250"
                  y1="250"
                  x2={x}
                  y2={y}
                  stroke="var(--color-line)"
                  strokeWidth="1"
                  opacity="0.2"
                />

                {/* Nakshatra circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isMoonPosition ? 20 : 16}
                  fill={isMoonPosition ? 'var(--color-blue)' : 'var(--color-surface)'}
                  stroke={isMoonPosition ? 'var(--color-blue)' : 'var(--color-line)'}
                  strokeWidth={isMoonPosition ? '3' : '1'}
                  opacity={isMoonPosition ? '1' : '0.8'}
                />

                {/* Nakshatra number */}
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize={isMoonPosition ? '12' : '10'}
                  fontWeight="bold"
                  fill={isMoonPosition ? 'white' : 'var(--color-ink)'}
                >
                  {idx + 1}
                </text>

                {/* Label near circle */}
                {isMoonPosition && (
                  <text
                    x={x}
                    y={y - 30}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="var(--color-blue)"
                  >
                    Moon Here
                  </text>
                )}
              </g>
            );
          })}

          {/* Center marker */}
          <circle cx="250" cy="250" r="15" fill="var(--color-blue)" opacity="0.3" />
        </svg>
      </div>

      {/* Nakshatras Grid */}
      <div>
        <h4 className="font-semibold text-ink mb-4">நட்சத්திர விபரம் (27 Lunar Mansions)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {NAKSHATRAS.map((nakshatra, idx) => {
            const isMoon = idx === moonNakshatraIdx;
            return (
              <div
                key={idx}
                className={`rounded-lg p-4 border-2 transition-all ${
                  isMoon
                    ? 'bg-blue/10 border-blue shadow-lg scale-105'
                    : getNakshatraColor(nakshatra.element) + ' hover:border-opacity-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-bold text-ink">{idx + 1}. {nakshatra.name}</div>
                    <div className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                      {nakshatra.tamil}
                    </div>
                  </div>
                  {isMoon && (
                    <div className="text-xl">🌙</div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-ink-soft">Lord: </span>
                    <span className="font-semibold text-ink">{nakshatra.lord}</span>
                  </div>
                  <div>
                    <span className="text-ink-soft">Element: </span>
                    <span className="font-semibold text-ink">{nakshatra.element}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Elements Legend */}
      <div>
        <h4 className="font-semibold text-ink mb-3">மூல பூத (Five Elements)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center text-sm">
            <div className="font-semibold text-ink">🔥 Fire</div>
            <div className="text-xs text-ink-soft">Aggressive, Dynamic</div>
          </div>
          <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 text-center text-sm">
            <div className="font-semibold text-ink">🌍 Earth</div>
            <div className="text-xs text-ink-soft">Stable, Practical</div>
          </div>
          <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-3 text-center text-sm">
            <div className="font-semibold text-ink">💨 Air</div>
            <div className="text-xs text-ink-soft">Mental, Communicative</div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-center text-sm">
            <div className="font-semibold text-ink">💧 Water</div>
            <div className="text-xs text-ink-soft">Emotional, Intuitive</div>
          </div>
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-gradient-to-r from-blue-soft/10 to-indigo-soft/10 rounded-lg p-4 border-l-4 border-blue">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">📖 Understanding Sudarshana Chakra</div>
          <div className="text-ink-soft space-y-2">
            <p>• Moon's Nakshatra reveals emotional nature, talents, and life themes</p>
            <p>• Each Nakshatra has unique characteristics and ruling planet (lord)</p>
            <p>• Element classification indicates psychological orientation (Fire/Earth/Air/Water)</p>
            <p>• Nakshatra lord's position and strength modifies Moon's effects</p>
            <p>• Moon Nakshatra is primary factor in predicting favorable timing (Muhurtha)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
