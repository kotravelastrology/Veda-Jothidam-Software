'use client';

/**
 * ChartWheel Component - Vedic Astrology Chart Visualization
 *
 * Renders a complete birth chart wheel showing:
 * - Zodiac signs with Tamil names
 * - Houses with dividing lines
 * - Planets at their calculated positions
 * - Ascendant marker
 * - Retrograde indicators
 */

import React, { useMemo, useState } from 'react';

interface PlanetPosition {
  name: string;
  degree: number;
  sign?: number; // 0-11 (Aries to Pisces)
  symbol?: string;
  speed?: number;
  retrograde?: boolean;
  isAscendant?: boolean;
}

interface HousePosition {
  number: number;
  degree: number;
}

interface ChartData {
  ascendant: PlanetPosition;
  planets: PlanetPosition[];
  houses: HousePosition[];
}

interface ChartWheelProps {
  chartData: ChartData;
  size?: number;
  interactive?: boolean;
  title?: string;
  onPlanetClick?: (planet: PlanetPosition) => void;
}

const ZODIAC_SIGNS = [
  { index: 0, name: 'Aries', tamil: 'மேஷம்', symbol: '♈', ruler: 'Mars', tamil_ruler: 'செவ்வாய்' },
  { index: 1, name: 'Taurus', tamil: 'ரிஷபம்', symbol: '♉', ruler: 'Venus', tamil_ruler: 'சுக்கிரன்' },
  { index: 2, name: 'Gemini', tamil: 'மிதுனம்', symbol: '♊', ruler: 'Mercury', tamil_ruler: 'புதன்' },
  { index: 3, name: 'Cancer', tamil: 'கர்கடகம்', symbol: '♋', ruler: 'Moon', tamil_ruler: 'சந்திரன்' },
  { index: 4, name: 'Leo', tamil: 'சிம்ஹம்', symbol: '♌', ruler: 'Sun', tamil_ruler: 'சூரியன்' },
  { index: 5, name: 'Virgo', tamil: 'கன்னர', symbol: '♍', ruler: 'Mercury', tamil_ruler: 'புதன்' },
  { index: 6, name: 'Libra', tamil: 'துலாம்', symbol: '♎', ruler: 'Venus', tamil_ruler: 'சுக்கிரன்' },
  { index: 7, name: 'Scorpio', tamil: 'விருச்சிகம்', symbol: '♏', ruler: 'Mars', tamil_ruler: 'செவ்வாய்' },
  { index: 8, name: 'Sagittarius', tamil: 'தனுஷ்', symbol: '♐', ruler: 'Jupiter', tamil_ruler: 'குரு' },
  { index: 9, name: 'Capricorn', tamil: 'மகரம்', symbol: '♑', ruler: 'Saturn', tamil_ruler: 'சனி' },
  { index: 10, name: 'Aquarius', tamil: 'கும்பம்', symbol: '♒', ruler: 'Saturn', tamil_ruler: 'சனி' },
  { index: 11, name: 'Pisces', tamil: 'மீனம்', symbol: '♓', ruler: 'Jupiter', tamil_ruler: 'குரு' },
];

const PLANET_SYMBOLS: Record<string, string> = {
  'Sun': '☉',
  'Moon': '☽',
  'Mars': '♂',
  'Mercury': '☿',
  'Jupiter': '♃',
  'Venus': '♀',
  'Saturn': '♄',
  'Rahu': '☢',
  'Ketu': '☬',
};

const PLANET_COLORS: Record<string, string> = {
  'Sun': '#FF6B35',       // Red-orange
  'Moon': '#FFB347',      // Light orange
  'Mars': '#DC143C',      // Crimson
  'Mercury': '#7CB342',   // Green
  'Jupiter': '#FFC107',   // Amber
  'Venus': '#FF1493',     // Deep pink
  'Saturn': '#696969',    // Dark gray
  'Rahu': '#8B4513',      // Saddle brown
  'Ketu': '#4B0082',      // Indigo
};

export default function ChartWheel({
  chartData,
  size = 500,
  interactive = true,
  title = 'Birth Chart',
  onPlanetClick,
}: ChartWheelProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const radius = size / 2;
  const outerRadius = radius * 0.9;
  const signRadius = radius * 0.75;
  const houseRadius = radius * 0.6;
  const planetRadius = radius * 0.45;
  const centerRadius = radius * 0.08;

  // Convert degrees to radians (0° at top, clockwise)
  const degreeToRadians = (degree: number): number => {
    return ((degree - 90) * Math.PI) / 180;
  };

  // Convert degree and radius to SVG coordinates
  const degreeToCoordinates = (
    degree: number,
    r: number
  ): { x: number; y: number } => {
    const angle = degreeToRadians(degree);
    return {
      x: radius + r * Math.cos(angle),
      y: radius + r * Math.sin(angle),
    };
  };

  // Create SVG path for zodiac sign segment
  const createZodiacPath = (startDegree: number): string => {
    const start = degreeToCoordinates(startDegree, outerRadius);
    const end = degreeToCoordinates(startDegree + 30, outerRadius);
    const innerStart = degreeToCoordinates(startDegree, houseRadius);
    const innerEnd = degreeToCoordinates(startDegree + 30, houseRadius);

    return `
      M ${innerStart.x} ${innerStart.y}
      L ${start.x} ${start.y}
      A ${outerRadius} ${outerRadius} 0 0 1 ${end.x} ${end.y}
      L ${innerEnd.x} ${innerEnd.y}
      A ${houseRadius} ${houseRadius} 0 0 0 ${innerStart.x} ${innerStart.y}
      Z
    `;
  };

  // Render zodiac signs
  const renderZodiacSigns = () => {
    return ZODIAC_SIGNS.map((sign) => {
      const startDegree = sign.index * 30;
      const midDegree = startDegree + 15;
      const pos = degreeToCoordinates(midDegree, signRadius);
      const bgColor = sign.index % 2 === 0 ? '#FFF8DC' : '#FFE4B5';

      return (
        <g key={`sign-${sign.index}`}>
          {/* Sign segment background */}
          <path
            d={createZodiacPath(startDegree)}
            fill={bgColor}
            stroke="#333"
            strokeWidth="1"
          />

          {/* Sign symbol */}
          <text
            x={pos.x}
            y={pos.y - 8}
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#333"
          >
            {sign.symbol}
          </text>

          {/* Sign name (Tamil) */}
          <text
            x={pos.x}
            y={pos.y + 10}
            fontSize="11"
            textAnchor="middle"
            fill="#555"
            fontFamily="'Nirmala UI', Latha, sans-serif"
            fontWeight="500"
          >
            {sign.tamil}
          </text>
        </g>
      );
    });
  };

  // Render houses
  const renderHouses = () => {
    return chartData.houses.map((house) => {
      const pos = degreeToCoordinates(house.degree, houseRadius);
      const innerPos = degreeToCoordinates(house.degree, centerRadius);

      return (
        <g key={`house-${house.number}`}>
          {/* House dividing line */}
          <line
            x1={innerPos.x}
            y1={innerPos.y}
            x2={pos.x}
            y2={pos.y}
            stroke="#999"
            strokeWidth="1"
            opacity="0.7"
          />

          {/* House number circle */}
          <circle cx={pos.x} cy={pos.y} r="12" fill="white" stroke="#666" strokeWidth="1" />
          <text
            x={pos.x}
            y={pos.y}
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#333"
          >
            {house.number}
          </text>
        </g>
      );
    });
  };

  // Render planets
  const renderPlanets = () => {
    return chartData.planets
      .filter((p) => !p.isAscendant)
      .map((planet, index) => {
        const pos = degreeToCoordinates(planet.degree, planetRadius);
        const symbol = PLANET_SYMBOLS[planet.name] || '●';
        const color = PLANET_COLORS[planet.name] || '#666';
        const isHovered = interactive && hoveredPlanet === planet.name;

        return (
          <g
            key={`planet-${planet.name}-${index}`}
            className={interactive ? 'cursor-pointer transition-all' : ''}
            onMouseEnter={() => interactive && setHoveredPlanet(planet.name)}
            onMouseLeave={() => interactive && setHoveredPlanet(null)}
            onClick={() => onPlanetClick?.(planet)}
          >
            {/* Planet circle background */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isHovered ? 16 : 14}
              fill="#FFFACD"
              stroke={color}
              strokeWidth={isHovered ? 3 : 2}
              className={isHovered ? 'drop-shadow-lg' : ''}
            />

            {/* Planet symbol */}
            <text
              x={pos.x}
              y={pos.y}
              fontSize={isHovered ? '16' : '14'}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={color}
            >
              {symbol}
            </text>

            {/* Retrograde indicator */}
            {planet.retrograde && (
              <text
                x={pos.x + 10}
                y={pos.y - 12}
                fontSize="9"
                fill="#DC143C"
                fontWeight="bold"
              >
                R
              </text>
            )}

            {/* Planet name tooltip (on hover) */}
            {isHovered && interactive && (
              <g>
                <rect
                  x={pos.x - 25}
                  y={pos.y - 30}
                  width="50"
                  height="20"
                  fill="#333"
                  rx="4"
                />
                <text
                  x={pos.x}
                  y={pos.y - 16}
                  fontSize="9"
                  textAnchor="middle"
                  fill="white"
                  fontWeight="bold"
                >
                  {planet.name}
                </text>
              </g>
            )}
          </g>
        );
      });
  };

  // Render ascendant
  const renderAscendant = () => {
    const pos = degreeToCoordinates(chartData.ascendant.degree, houseRadius + 18);
    const ascSize = 12;

    return (
      <g key="ascendant">
        {/* Ascendant triangle (rising point marker) */}
        <polygon
          points={`${pos.x},${pos.y - ascSize} ${pos.x + ascSize},${pos.y + ascSize} ${pos.x - ascSize},${pos.y + ascSize}`}
          fill="#FFD700"
          stroke="#FF8C00"
          strokeWidth="2"
        />

        {/* Ascendant label */}
        <text
          x={pos.x}
          y={pos.y + 24}
          fontSize="10"
          textAnchor="middle"
          fill="#FF8C00"
          fontWeight="bold"
        >
          Asc
        </text>
      </g>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center bg-white p-4">
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h2>
      )}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="border-2 border-gray-400 rounded-lg bg-white shadow-lg"
      >
        {/* Define gradients */}
        <defs>
          <radialGradient id="chartGradient">
            <stop offset="0%" stopColor="#FFFEF0" />
            <stop offset="100%" stopColor="#FFF8DC" />
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={radius}
          cy={radius}
          r={outerRadius + 2}
          fill="url(#chartGradient)"
        />

        {/* Outer circle (chart boundary) */}
        <circle
          cx={radius}
          cy={radius}
          r={outerRadius}
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />

        {/* House circle (inner boundary) */}
        <circle
          cx={radius}
          cy={radius}
          r={houseRadius}
          fill="none"
          stroke="#CCC"
          strokeWidth="1"
        />

        {/* Center point */}
        <circle cx={radius} cy={radius} r="4" fill="#333" />

        {/* Render all components */}
        {renderZodiacSigns()}
        {renderHouses()}
        {renderAscendant()}
        {renderPlanets()}
      </svg>

      {/* Legend */}
      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>Left-click on planets for details • Golden triangle = Ascendant (Lagna)</p>
        <p>R = Retrograde motion</p>
      </div>
    </div>
  );
}
