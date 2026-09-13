'use client';

/**
 * PlanetaryStrengthGraph Component - Shadbala Visualization
 *
 * Displays planetary strength (Shadbala) using bar/radar charts with:
 * - Strength percentage (0-100)
 * - Dignity status (exalted, own, friendly, neutral, enemy, debilitated)
 * - Aspect values (0-8 points)
 * - Retrograde and combust indicators
 * - Bilingual labels (English/Tamil)
 * - Interactive tooltips
 */

import React, { useState, useMemo } from 'react';

interface PlanetStrength {
  name: string;
  tamil?: string;
  strength: number;               // 0-100 (percentage)
  dignity: 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
  dignityTamil?: string;
  aspectValue: number;            // 0-8 points
  burnStatus?: 'combust' | 'normal';
  retrograde?: boolean;
  colour?: string;                // Custom color override
}

interface PlanetaryStrengthGraphProps {
  planets: PlanetStrength[];
  title?: string;
  titleTamil?: string;
  chartType?: 'bar' | 'radar';
  showDetails?: boolean;
  interactive?: boolean;
  size?: number;
}

const DEFAULT_PLANET_COLORS: Record<string, string> = {
  'Sun': '#FF6B35',
  'Moon': '#FFB347',
  'Mars': '#DC143C',
  'Mercury': '#7CB342',
  'Jupiter': '#FFC107',
  'Venus': '#FF1493',
  'Saturn': '#696969',
  'Rahu': '#8B4513',
  'Ketu': '#4B0082',
};

const TAMIL_NAMES: Record<string, string> = {
  'Sun': 'சூரியன்',
  'Moon': 'சந்திரன்',
  'Mars': 'செவ்வாய்',
  'Mercury': 'புதன்',
  'Jupiter': 'குரு',
  'Venus': 'சுக்கிரன்',
  'Saturn': 'சனி',
  'Rahu': 'ராகு',
  'Ketu': 'கேது',
};

const DIGNITY_SYMBOLS: Record<string, string> = {
  'exalted': '⬆️',
  'own': '➡️',
  'friendly': '↗️',
  'neutral': '⬌',
  'enemy': '↙️',
  'debilitated': '⬇️',
};

const DIGNITY_TAMIL: Record<string, string> = {
  'exalted': 'ஆட்சி',
  'own': 'உச்சம்',
  'friendly': 'நட்பு',
  'neutral': 'சம',
  'enemy': 'சத்ரு',
  'debilitated': 'நீசம்',
};

const getStrengthColor = (strength: number): string => {
  if (strength >= 75) return '#10B981';      // Green - Strong
  if (strength >= 50) return '#F59E0B';      // Amber - Moderate
  if (strength >= 25) return '#EF4444';      // Red - Weak
  return '#9CA3AF';                          // Gray - Very Weak
};

const getDegreeToCoordinates = (
  degree: number,
  radius: number,
  centerX: number,
  centerY: number
): { x: number; y: number } => {
  const angle = (degree - 90) * (Math.PI / 180);
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
};

export default function PlanetaryStrengthGraph({
  planets,
  title = 'Planetary Strength Analysis',
  titleTamil = 'கிरह शक्ति विश्लेषण',
  chartType = 'bar',
  showDetails = true,
  interactive = true,
  size = 500,
}: PlanetaryStrengthGraphProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'radar'>(chartType);

  const enrichedPlanets = useMemo(() => {
    return planets.map((planet) => ({
      ...planet,
      tamil: planet.tamil || TAMIL_NAMES[planet.name] || planet.name,
      dignityTamil: planet.dignityTamil || DIGNITY_TAMIL[planet.dignity],
      colour: planet.colour || DEFAULT_PLANET_COLORS[planet.name] || '#999999',
    }));
  }, [planets]);

  const maxStrength = useMemo(() => {
    return Math.max(...enrichedPlanets.map((p) => p.strength), 100);
  }, [enrichedPlanets]);

  // Bar Chart Rendering
  const renderBarChart = () => {
    const chartHeight = 300;
    const chartWidth = 100;
    const barWidth = chartWidth / enrichedPlanets.length;
    const spacing = 2;

    return (
      <div className="flex items-end justify-center gap-1 h-80 bg-gradient-to-b from-gray-50 to-white rounded-lg p-6 border border-gray-200">
        {enrichedPlanets.map((planet, index) => {
          const barHeight = (planet.strength / maxStrength) * chartHeight;
          const color = getStrengthColor(planet.strength);
          const isHovered = interactive && hoveredPlanet === planet.name;

          return (
            <div
              key={`bar-${index}`}
              className="flex flex-col items-center"
              onMouseEnter={() => interactive && setHoveredPlanet(planet.name)}
              onMouseLeave={() => interactive && setHoveredPlanet(null)}
            >
              {/* Bar */}
              <div
                className="rounded-t-lg transition-all duration-200 hover:shadow-lg cursor-pointer"
                style={{
                  width: `${barWidth - spacing}px`,
                  height: `${barHeight}px`,
                  backgroundColor: color,
                  opacity: isHovered ? 1 : 0.8,
                  transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                }}
              >
                {/* Strength Value Label */}
                <div className="text-xs font-bold text-white text-center pt-1">
                  {planet.strength}%
                </div>
              </div>

              {/* Planet Name & Symbol */}
              <div className="text-center mt-2 min-w-max">
                <div className="text-xs font-bold text-gray-800">
                  {DIGNITY_SYMBOLS[planet.dignity]}
                </div>
                <div className="text-xs font-semibold text-gray-900">{planet.name}</div>
                <div className="text-xs text-gray-600 font-tamil">{planet.tamil}</div>

                {/* Retrograde & Combust Indicators */}
                <div className="flex justify-center gap-1 mt-1">
                  {planet.retrograde && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">R</span>
                  )}
                  {planet.burnStatus === 'combust' && (
                    <span className="text-xs bg-red-100 text-red-800 px-1 rounded">🔥</span>
                  )}
                </div>
              </div>

              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full mb-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-10 shadow-lg">
                  <div className="font-bold">{planet.name}</div>
                  <div>Strength: {planet.strength}%</div>
                  <div>Dignity: {planet.dignity}</div>
                  <div>Aspect: {planet.aspectValue}/8</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Radar Chart Rendering
  const renderRadarChart = () => {
    const radius = size / 2 - 40;
    const centerX = size / 2;
    const centerY = size / 2;
    const numPlanets = enrichedPlanets.length;
    const angleSlice = (360 / numPlanets) * (Math.PI / 180);

    // Grid circles
    const gridCircles = [20, 40, 60, 80, 100];

    // Calculate points for radar polygon
    const points = enrichedPlanets.map((planet, index) => {
      const angle = index * angleSlice - Math.PI / 2;
      const r = (planet.strength / 100) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return `${x},${y}`;
    });

    // Planet labels positions
    const labelPositions = enrichedPlanets.map((planet, index) => {
      const angle = index * angleSlice - Math.PI / 2;
      const r = radius + 50;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return { x, y, planet };
    });

    return (
      <svg width={size} height={size} className="mx-auto">
        <defs>
          <style>{`
            .radar-grid { stroke: #ddd; stroke-width: 1; }
            .radar-polygon { fill: #f0f9ff; stroke: #0ea5e9; stroke-width: 2; opacity: 0.7; }
            .radar-point { cursor: pointer; }
            .radar-label { font-size: 12px; text-anchor: middle; }
          `}</style>
        </defs>

        {/* Grid circles */}
        {gridCircles.map((grid, idx) => (
          <circle
            key={`grid-${idx}`}
            cx={centerX}
            cy={centerY}
            r={(grid / 100) * radius}
            className="radar-grid"
          />
        ))}

        {/* Axis lines */}
        {enrichedPlanets.map((planet, index) => {
          const angle = index * angleSlice - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={`axis-${index}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Radar polygon */}
        <polygon points={points.join(' ')} className="radar-polygon" />

        {/* Data points */}
        {enrichedPlanets.map((planet, index) => {
          const angle = index * angleSlice - Math.PI / 2;
          const r = (planet.strength / 100) * radius;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          const color = getStrengthColor(planet.strength);
          const isHovered = interactive && hoveredPlanet === planet.name;

          return (
            <g
              key={`point-${index}`}
              className="radar-point"
              onMouseEnter={() => interactive && setHoveredPlanet(planet.name)}
              onMouseLeave={() => interactive && setHoveredPlanet(null)}
            >
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 8 : 6}
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-200"
              />

              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 40}
                    y={y - 60}
                    width="80"
                    height="50"
                    fill="#1f2937"
                    rx="4"
                  />
                  <text
                    x={x}
                    y={y - 40}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {planet.name}
                  </text>
                  <text
                    x={x}
                    y={y - 25}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    {planet.strength}%
                  </text>
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    {planet.dignity}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Planet labels */}
        {labelPositions.map((pos, index) => (
          <g key={`label-${index}`}>
            <text
              x={pos.x}
              y={pos.y - 8}
              className="radar-label font-bold fill-gray-900"
            >
              {pos.planet.name}
            </text>
            <text
              x={pos.x}
              y={pos.y + 6}
              className="radar-label fill-gray-600 text-xs font-tamil"
            >
              {pos.planet.tamil}
            </text>
          </g>
        ))}

        {/* Center circle */}
        <circle cx={centerX} cy={centerY} r="4" fill="#1f2937" />
      </svg>
    );
  };

  // Details Table
  const renderDetailsTable = () => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-orange-100 border-b-2 border-orange-300">
            <th className="px-4 py-2 text-left font-semibold text-gray-800">
              ग्रह (Planet)
            </th>
            <th className="px-4 py-2 text-center font-semibold text-gray-800">
              शक्ति (Strength)
            </th>
            <th className="px-4 py-2 text-center font-semibold text-gray-800">
              अवस्था (Dignity)
            </th>
            <th className="px-4 py-2 text-center font-semibold text-gray-800">
              दृष्टि (Aspect)
            </th>
            <th className="px-4 py-2 text-center font-semibold text-gray-800">
              स्थिति (Status)
            </th>
          </tr>
        </thead>
        <tbody>
          {enrichedPlanets.map((planet, index) => {
            const color = getStrengthColor(planet.strength);
            return (
              <tr
                key={`row-${index}`}
                className={`border-b hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-2 font-semibold text-gray-900">
                  <div>{planet.name}</div>
                  <div className="text-xs text-gray-600 font-tamil">{planet.tamil}</div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-16 h-4 rounded-full border border-gray-300"
                      style={{
                        background: `linear-gradient(to right, ${color} ${planet.strength}%, #e5e7eb ${planet.strength}%)`,
                      }}
                    />
                    <span className="font-bold text-gray-900 min-w-12">
                      {planet.strength}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="text-lg">{DIGNITY_SYMBOLS[planet.dignity]}</div>
                  <div className="text-xs text-gray-600">{planet.dignity}</div>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className="font-mono font-bold text-gray-900">
                    {planet.aspectValue}/8
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-1">
                    {planet.retrograde && (
                      <span
                        className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-bold"
                        title="Retrograde"
                      >
                        R
                      </span>
                    )}
                    {planet.burnStatus === 'combust' && (
                      <span
                        className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold"
                        title="Combust"
                      >
                        🔥
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Strength Level Legend
  const renderLegend = () => (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-green-500 rounded"></div>
        <span className="text-sm text-gray-700">Strong (75-100%)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-amber-500 rounded"></div>
        <span className="text-sm text-gray-700">Moderate (50-74%)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-red-500 rounded"></div>
        <span className="text-sm text-gray-700">Weak (25-49%)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-400 rounded"></div>
        <span className="text-sm text-gray-700">Very Weak (&lt;25%)</span>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-orange-100 text-sm mt-1">शक्ति विश्लेषण - Strength Analysis</p>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-b border-gray-200 flex gap-4 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={selectedChartType === 'bar'}
            onChange={() => setSelectedChartType('bar')}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">Bar Chart</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={selectedChartType === 'radar'}
            onChange={() => setSelectedChartType('radar')}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">Radar Chart</span>
        </label>
      </div>

      {/* Chart */}
      <div className="px-6 py-6">
        {selectedChartType === 'bar' ? renderBarChart() : renderRadarChart()}
      </div>

      {/* Details */}
      {showDetails && (
        <>
          {renderDetailsTable()}
          {renderLegend()}
        </>
      )}

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-xs text-gray-600">
        <p>
          <strong>Shadbala (6-fold strength):</strong> Measures overall planetary strength based on
          position, direction, time, movement, natural strength, and aspects.
        </p>
      </div>
    </div>
  );
}
