'use client';

import { RASI_SHORT, POINT_LABEL, RASI_FULL } from './chartConstants';

interface VargaChakraRendererProps {
  report: any;
}

const VARGAS = [
  { name: 'D1', tamil: 'ராசி', order: 1, significance: 'Birth Chart' },
  { name: 'D2', tamil: 'ஹோரா', order: 2, significance: 'Wealth' },
  { name: 'D3', tamil: 'த்ரிம்ச', order: 3, significance: 'Siblings' },
  { name: 'D4', tamil: 'சதுர்த்যாம்ச', order: 4, significance: 'Property' },
  { name: 'D7', tamil: 'சப்தாம்ச', order: 7, significance: 'Children' },
  { name: 'D9', tamil: 'நவாம்ச', order: 9, significance: 'Marriage' },
  { name: 'D10', tamil: 'தசாம்ச', order: 10, significance: 'Career' },
  { name: 'D12', tamil: 'த்வாதசாம்ச', order: 12, significance: 'Parents' },
  { name: 'D16', tamil: 'ஷோடசாம்ச', order: 16, significance: 'Vehicles' },
  { name: 'D20', tamil: 'விம்ச', order: 20, significance: 'Spiritual' },
  { name: 'D24', tamil: 'சতுர்வி', order: 24, significance: 'Education' },
  { name: 'D27', tamil: 'சப்தவி', order: 27, significance: 'Strength' },
  { name: 'D30', tamil: 'த்രிம்சத', order: 30, significance: 'Misfortune' },
  { name: 'D40', tamil: 'சதுர்த்வி', order: 40, significance: 'Penance' },
  { name: 'D45', tamil: 'பஞ்சவி', order: 45, significance: 'Gandanta' },
  { name: 'D60', tamil: 'ஷஷ்டி', order: 60, significance: 'Ultimate Truth' },
];

export function VargaChakraRenderer({ report }: VargaChakraRendererProps) {
  // report.vargas is keyed by planet (Lagna, Sun, ...), each holding { D1: {sign,...}, D9: {sign,...}, ... }.
  // This chakra shows the Lagna's sign per D-chart, so read report.vargas.Lagna and unwrap `.sign`.
  const lagnaVargas = report.vargas?.Lagna || {};
  const lagnaPositions = Object.fromEntries(
    Object.entries(lagnaVargas).map(([key, v]: any) => [key, v?.sign])
  );

  // Get all implemented vargas
  const implementedVargas = VARGAS.filter(v => lagnaPositions[v.name]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-soft/30 to-purple-soft/30 rounded-lg p-6 border-l-4 border-indigo">
        <h3 className="text-xl font-bold text-ink mb-2">வர்க চக்கிரம் (Varga Chakra - Divisional Chakra)</h3>
        <p className="text-sm text-ink-soft">
          Overview of all 16 divisional charts showing Lagna placements. Each chart reveals specific life dimensions and their strength.
        </p>
      </div>

      {/* Circular Varga Layout */}
      <div className="flex justify-center">
        <svg viewBox="0 0 500 500" className="w-full max-w-2xl" xmlns="http://www.w3.org/2000/svg">
          {/* Background circle */}
          <circle cx="250" cy="250" r="240" fill="var(--color-surface-soft)" stroke="var(--color-line)" strokeWidth="2" />

          {/* Central circle (D1 Rasi) */}
          <circle cx="250" cy="250" r="60" fill="var(--color-saffron)" opacity="0.2" stroke="var(--color-saffron)" strokeWidth="2" />

          {/* Varga circles arranged in spiral */}
          {VARGAS.map((varga, idx) => {
            const angle = (idx / VARGAS.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 150 + (idx % 4) * 30;
            const x = 250 + radius * Math.cos(angle);
            const y = 250 + radius * Math.sin(angle);
            const lagnaSign = lagnaPositions[varga.name];
            const isImplemented = lagnaSign !== undefined;

            return (
              <g key={varga.name}>
                {/* Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="28"
                  fill={isImplemented ? 'var(--color-surface)' : 'var(--color-surface-soft)'}
                  stroke={isImplemented ? 'var(--color-indigo)' : 'var(--color-line)'}
                  strokeWidth={isImplemented ? '2' : '1'}
                />

                {/* Varga name */}
                <text
                  x={x}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill={isImplemented ? 'var(--color-ink)' : 'var(--color-ink-soft)'}
                >
                  {varga.name}
                </text>

                {/* Lagna sign */}
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isImplemented ? 'var(--color-indigo)' : 'var(--color-ink-soft)'}
                >
                  {isImplemented ? (RASI_SHORT[lagnaSign] || '?') : '-'}
                </text>

                {/* Connection line to center */}
                {isImplemented && (
                  <line
                    x1="250"
                    y1="250"
                    x2={x}
                    y2={y}
                    stroke="var(--color-indigo)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                )}
              </g>
            );
          })}

          {/* Center D1 label */}
          <text x="250" y="260" textAnchor="middle" fontSize="14" fontWeight="bold" fill="var(--color-saffron)">
            D1-ராசி
          </text>
        </svg>
      </div>

      {/* Varga Grid Details */}
      <div>
        <h4 className="font-semibold text-ink mb-4">வர்க விபரம் (Detailed Varga Information)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {VARGAS.map((varga) => {
            const lagnaSign = lagnaPositions[varga.name];
            const isImplemented = lagnaSign !== undefined;

            return (
              <div
                key={varga.name}
                className={`rounded-lg p-4 border-2 transition-colors ${
                  isImplemented
                    ? 'bg-indigo-soft/10 border-indigo/50 hover:border-indigo'
                    : 'bg-surface-soft border-line opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-ink">{varga.name}</div>
                    <div className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                      {varga.tamil}
                    </div>
                  </div>
                  {isImplemented && (
                    <div className="text-2xl font-bold text-indigo">
                      {RASI_SHORT[lagnaSign] || '?'}
                    </div>
                  )}
                </div>
                <div className="text-xs text-ink-soft mb-2">
                  <span className="font-semibold text-ink">{varga.significance}</span>
                </div>
                {isImplemented && (
                  <div className="text-xs text-indigo">
                    Lagna: {RASI_FULL[lagnaSign] || lagnaSign}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Varga Significance Guide */}
      <div className="bg-gradient-to-r from-blue-soft/10 to-indigo-soft/10 rounded-lg p-4 border-l-4 border-blue">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-3">📚 Varga System Overview</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-ink-soft text-xs">
            <div>
              <p><span className="font-semibold text-ink">D1 (ராசி)</span> - Birth Chart (foundation of all analysis)</p>
              <p><span className="font-semibold text-ink">D2 (ஹோரா)</span> - Wealth and resources</p>
              <p><span className="font-semibold text-ink">D9 (நவாம்ச)</span> - Marriage and partnerships</p>
              <p><span className="font-semibold text-ink">D10 (தசாம்ச)</span> - Career and profession</p>
            </div>
            <div>
              <p><span className="font-semibold text-ink">D7 (சப்தாம்ச)</span> - Children and progeny</p>
              <p><span className="font-semibold text-ink">D12 (த்வாதசாம்ச)</span> - Parents and family</p>
              <p><span className="font-semibold text-ink">D20 (விம்ச)</span> - Spiritual growth</p>
              <p><span className="font-semibold text-ink">D60 (ஷஷ்டி)</span> - Ultimate truth and liberation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interpretation Tip */}
      <div className="bg-gradient-to-r from-teal-soft/10 to-cyan-soft/10 rounded-lg p-4 border-l-4 border-teal">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">💡 Reading Varga Chakra</div>
          <div className="text-ink-soft space-y-2">
            <p>• Strong Lagna in D-charts indicates natural aptitude in that area</p>
            <p>• Exalted planets in D-charts show exceptional talent</p>
            <p>• Weak D-chart Lagna suggests need for conscious development</p>
            <p>• Compare D-chart strength with D1 birth chart for holistic understanding</p>
            <p>• Use Varga Chakra for identifying life strengths and challenge areas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
