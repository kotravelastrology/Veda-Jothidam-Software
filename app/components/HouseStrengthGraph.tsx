'use client';

/**
 * HouseStrengthGraph Component - Bhava Strength Visualization
 *
 * Displays 12-house strength analysis with:
 * - Circular arrangement of 12 houses
 * - House strength percentage (0-100)
 * - Zodiac signs and lord planets
 * - Planets in each house
 * - Karaka (significance) values
 * - Maraka and Dusthana indicators
 * - Bilingual labels (English/Tamil)
 * - Interactive tooltips
 */

import React, { useState, useMemo } from 'react';

interface HouseStrength {
  number: number;                    // 1-12
  sign: string;                      // Zodiac sign name
  signTamil?: string;                // Tamil sign name
  signSymbol?: string;               // Zodiac symbol
  strength: number;                  // 0-100
  lordPlanet: string;                // Sign lord
  lordStrength: number;              // Lord's strength (0-100)
  planets: string[];                 // Planets in this house
  karakaValue: number;               // 0-100 house significance
  maraka?: boolean;                  // Death-indicating house (8, 12)
  dusthana?: boolean;                // Difficult house (6, 8, 12)
  significance?: string;             // House meaning
}

interface HouseStrengthGraphProps {
  houses: HouseStrength[];
  title?: string;
  titleTamil?: string;
  showDetails?: boolean;
  interactive?: boolean;
  size?: number;
}

const ZODIAC_SIGNS: Record<string, { tamil: string; symbol: string }> = {
  'Aries': { tamil: 'மேஷம்', symbol: '♈' },
  'Taurus': { tamil: 'ரிஷபம்', symbol: '♉' },
  'Gemini': { tamil: 'மிதுனம்', symbol: '♊' },
  'Cancer': { tamil: 'கர்கடகம்', symbol: '♋' },
  'Leo': { tamil: 'சிம்ஹம்', symbol: '♌' },
  'Virgo': { tamil: 'கன்னர', symbol: '♍' },
  'Libra': { tamil: 'துலாம்', symbol: '♎' },
  'Scorpio': { tamil: 'விருச்சிகம்', symbol: '♏' },
  'Sagittarius': { tamil: 'தனுஷ்', symbol: '♐' },
  'Capricorn': { tamil: 'மகரம்', symbol: '♑' },
  'Aquarius': { tamil: 'கும்பம்', symbol: '♒' },
  'Pisces': { tamil: 'மீனம்', symbol: '♓' },
};

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

const HOUSE_MEANINGS: Record<number, string> = {
  1: 'Self, Personality, Body',
  2: 'Wealth, Speech, Food',
  3: 'Courage, Siblings, Communication',
  4: 'Home, Mother, Property, Vehicles',
  5: 'Children, Education, Creativity, Romance',
  6: 'Health, Enemies, Debts, Service',
  7: 'Marriage, Partnerships, Business',
  8: 'Longevity, Inheritance, Transformation',
  9: 'Luck, Father, Religion, Travel',
  10: 'Career, Reputation, Authority, Government',
  11: 'Gains, Friendships, Aspirations',
  12: 'Losses, Isolation, Moksha, Foreign Travel',
};

const getStrengthColor = (strength: number): string => {
  if (strength >= 75) return '#10B981';      // Green
  if (strength >= 50) return '#F59E0B';      // Amber
  if (strength >= 25) return '#EF4444';      // Red
  return '#9CA3AF';                          // Gray
};

const degreeToCoordinates = (
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

export default function HouseStrengthGraph({
  houses,
  title = 'House Strength Analysis',
  titleTamil = 'भाव शक्ति विश्लेषण',
  showDetails = true,
  interactive = true,
  size = 600,
}: HouseStrengthGraphProps) {
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const enrichedHouses = useMemo(() => {
    return houses.map((house) => ({
      ...house,
      signTamil: house.signTamil || ZODIAC_SIGNS[house.sign]?.tamil || house.sign,
      signSymbol: house.signSymbol || ZODIAC_SIGNS[house.sign]?.symbol || '?',
      significance: house.significance || HOUSE_MEANINGS[house.number] || '',
    }));
  }, [houses]);

  const radius = size / 2 - 40;
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = radius * 1.2;
  const innerRadius = radius * 0.3;

  // SVG Rendering
  const renderCircularChart = () => {
    const angleSlice = (360 / 12) * (Math.PI / 180);

    return (
      <svg width={size} height={size} className="mx-auto bg-gradient-to-b from-gray-50 to-white rounded-lg">
        <defs>
          <style>{`
            .house-circle { cursor: pointer; transition: all 0.3s; }
            .house-label { font-size: 14px; font-weight: bold; }
            .house-number { font-size: 24px; font-weight: bold; }
          `}</style>
        </defs>

        {/* Background circles */}
        <circle cx={centerX} cy={centerY} r={radius + 20} fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />

        {/* House rings */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((ratio, idx) => (
          <circle
            key={`ring-${idx}`}
            cx={centerX}
            cy={centerY}
            r={radius * ratio}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}

        {/* Strength percentage labels */}
        {[20, 40, 60, 80, 100].map((percent, idx) => (
          <text
            key={`percent-${idx}`}
            x={centerX}
            y={centerY - (radius * (1 - idx * 0.2)) - 5}
            textAnchor="middle"
            fontSize="10"
            fill="#9ca3af"
          >
            {percent}%
          </text>
        ))}

        {/* Houses */}
        {enrichedHouses.map((house, index) => {
          const startAngle = index * angleSlice - Math.PI / 2;
          const endAngle = (index + 1) * angleSlice - Math.PI / 2;
          const midAngle = (startAngle + endAngle) / 2;

          // House positions
          const startPos = degreeToCoordinates(index * 30, outerRadius, centerX, centerY);
          const endPos = degreeToCoordinates((index + 1) * 30, outerRadius, centerX, centerY);
          const strengthRadius = (house.strength / 100) * radius;
          const strengthPos = degreeToCoordinates(index * 30 + 15, strengthRadius, centerX, centerY);
          const labelPos = degreeToCoordinates(index * 30 + 15, radius + 35, centerX, centerY);
          const innerPos = degreeToCoordinates(index * 30 + 15, innerRadius, centerX, centerY);

          const color = getStrengthColor(house.strength);
          const isHovered = interactive && hoveredHouse === house.number;
          const isSelected = selectedHouse === house.number;

          return (
            <g
              key={`house-${house.number}`}
              className="house-circle"
              onMouseEnter={() => interactive && setHoveredHouse(house.number)}
              onMouseLeave={() => interactive && setHoveredHouse(null)}
              onClick={() => setSelectedHouse(isSelected ? null : house.number)}
            >
              {/* House sector arc */}
              <path
                d={`
                  M ${startPos.x} ${startPos.y}
                  A ${outerRadius} ${outerRadius} 0 0 1 ${endPos.x} ${endPos.y}
                  L ${centerX} ${centerY}
                  Z
                `}
                fill={color}
                opacity={isHovered || isSelected ? 0.3 : 0.15}
                stroke={color}
                strokeWidth={isHovered ? 3 : 1}
              />

              {/* Strength indicator bar */}
              <path
                d={`
                  M ${degreeToCoordinates(index * 30, innerRadius, centerX, centerY).x}
                    ${degreeToCoordinates(index * 30, innerRadius, centerX, centerY).y}
                  L ${degreeToCoordinates(index * 30, strengthRadius, centerX, centerY).x}
                    ${degreeToCoordinates(index * 30, strengthRadius, centerX, centerY).y}
                `}
                stroke={color}
                strokeWidth={3}
                opacity={0.8}
              />

              {/* House number circle */}
              <circle cx={innerPos.x} cy={innerPos.y} r="18" fill={color} opacity="0.9" />
              <text
                x={innerPos.x}
                y={innerPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="house-number"
                fill="white"
              >
                {house.number}
              </text>

              {/* House label (outside) */}
              <text
                x={labelPos.x}
                y={labelPos.y - 8}
                textAnchor="middle"
                className="house-label"
                fill="#1f2937"
              >
                H{house.number}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 8}
                textAnchor="middle"
                fontSize="11"
                fill="#6b7280"
              >
                {house.strength}%
              </text>

              {/* Tooltip on hover */}
              {(isHovered || isSelected) && (
                <g>
                  {/* Tooltip background */}
                  <rect
                    x={labelPos.x - 60}
                    y={labelPos.y - 60}
                    width="120"
                    height="80"
                    fill="#1f2937"
                    rx="6"
                    opacity="0.95"
                  />
                  {/* Tooltip text */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y - 40}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    House {house.number}
                  </text>
                  <text
                    x={labelPos.x}
                    y={labelPos.y - 25}
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {house.sign}
                  </text>
                  <text
                    x={labelPos.x}
                    y={labelPos.y - 10}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    Strength: {house.strength}%
                  </text>
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    Lord: {house.lordPlanet}
                  </text>
                </g>
              )}

              {/* Maraka indicator */}
              {house.maraka && (
                <text
                  x={labelPos.x}
                  y={labelPos.y + 20}
                  textAnchor="middle"
                  fontSize="16"
                  title="Maraka House"
                >
                  ⚠️
                </text>
              )}

              {/* Dusthana indicator */}
              {house.dusthana && !house.maraka && (
                <text
                  x={labelPos.x}
                  y={labelPos.y + 20}
                  textAnchor="middle"
                  fontSize="16"
                  title="Dusthana House"
                >
                  ⛔
                </text>
              )}
            </g>
          );
        })}

        {/* Center circle */}
        <circle cx={centerX} cy={centerY} r="25" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#1f2937"
        >
          12
        </text>
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="#6b7280"
        >
          Houses
        </text>
      </svg>
    );
  };

  // Details Table
  const renderDetailsTable = () => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-orange-100 border-b-2 border-orange-300">
            <th className="px-4 py-2 text-left font-semibold">House</th>
            <th className="px-4 py-2 text-left font-semibold">Sign</th>
            <th className="px-4 py-2 text-center font-semibold">Strength</th>
            <th className="px-4 py-2 text-left font-semibold">Lord</th>
            <th className="px-4 py-2 text-center font-semibold">Planets</th>
            <th className="px-4 py-2 text-center font-semibold">Karaka</th>
            <th className="px-4 py-2 text-center font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {enrichedHouses.map((house, index) => {
            const color = getStrengthColor(house.strength);
            const lordColor = getStrengthColor(house.lordStrength);
            return (
              <tr
                key={`row-${index}`}
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  selectedHouse === house.number ? 'bg-orange-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
                onClick={() => setSelectedHouse(selectedHouse === house.number ? null : house.number)}
              >
                <td className="px-4 py-2 font-bold text-gray-900">
                  <div>House {house.number}</div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{house.signSymbol}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{house.sign}</div>
                      <div className="text-xs text-gray-600 font-tamil">{house.signTamil}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-16 h-3 rounded-full border border-gray-300"
                      style={{
                        background: `linear-gradient(to right, ${color} ${house.strength}%, #e5e7eb ${house.strength}%)`,
                      }}
                    />
                    <span className="font-bold text-gray-900 min-w-12">{house.strength}%</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="font-semibold text-gray-900">{house.lordPlanet}</div>
                  <div className="text-xs">
                    <span
                      className="inline-block px-2 py-1 rounded text-white font-bold"
                      style={{ backgroundColor: lordColor }}
                    >
                      {house.lordStrength}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-1">
                    {house.planets.length > 0 ? (
                      house.planets.map((planet) => (
                        <span key={planet} title={planet} className="text-lg">
                          {PLANET_SYMBOLS[planet] || '●'}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">None</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-center font-mono font-bold text-gray-900">
                  {house.karakaValue}%
                </td>
                <td className="px-4 py-2 text-center">
                  {house.maraka && (
                    <span className="text-lg" title="Maraka House">
                      ⚠️
                    </span>
                  )}
                  {house.dusthana && !house.maraka && (
                    <span className="text-lg" title="Dusthana House">
                      ⛔
                    </span>
                  )}
                  {!house.maraka && !house.dusthana && <span className="text-gray-400">-</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Selected House Details
  const renderSelectedHouseDetails = () => {
    if (!selectedHouse) return null;

    const house = enrichedHouses.find((h) => h.number === selectedHouse);
    if (!house) return null;

    return (
      <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">House {house.number} Details</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 mb-1">Sign</p>
            <p className="text-lg font-bold text-gray-900">{house.sign}</p>
            <p className="text-sm text-gray-600 font-tamil">{house.signTamil}</p>
          </div>

          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 mb-1">Strength</p>
            <p className="text-lg font-bold" style={{ color: getStrengthColor(house.strength) }}>
              {house.strength}%
            </p>
          </div>

          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 mb-1">Lord Planet</p>
            <p className="text-lg font-bold text-gray-900">{house.lordPlanet}</p>
            <p className="text-sm" style={{ color: getStrengthColor(house.lordStrength) }}>
              {house.lordStrength}% strength
            </p>
          </div>

          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 mb-1">Karaka Value</p>
            <p className="text-lg font-bold text-gray-900">{house.karakaValue}%</p>
          </div>
        </div>

        <div className="bg-white rounded p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Significance</h4>
          <p className="text-sm text-gray-700">{house.significance}</p>
        </div>

        {house.planets.length > 0 && (
          <div className="bg-white rounded p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Planets in This House</h4>
            <div className="flex gap-2">
              {house.planets.map((planet) => (
                <span key={planet} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {PLANET_SYMBOLS[planet]} {planet}
                </span>
              ))}
            </div>
          </div>
        )}

        {(house.maraka || house.dusthana) && (
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Special Indicators</h4>
            <div className="space-y-2">
              {house.maraka && (
                <p className="text-sm text-orange-700 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <strong>Maraka House:</strong> Associated with death-indicating influences
                </p>
              )}
              {house.dusthana && (
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <span className="text-lg">⛔</span>
                  <strong>Dusthana House:</strong> Difficult house with challenging influences
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-blue-100 text-sm mt-1">भाव शक्ति - House Strength Analysis</p>
      </div>

      {/* Chart */}
      <div className="px-6 py-6">{renderCircularChart()}</div>

      {/* Details */}
      {showDetails && (
        <>
          {renderSelectedHouseDetails()}
          {renderDetailsTable()}
        </>
      )}

      {/* Legend */}
      <div className="px-6 py-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <span className="text-sm text-gray-700">Maraka (Houses 8, 12)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">⛔</span>
          <span className="text-sm text-gray-700">Dusthana (Houses 6, 8, 12)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-700">Strong (75-100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span className="text-sm text-gray-700">Moderate (50-74%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-700">Weak (25-49%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-sm text-gray-700">Very Weak (&lt;25%)</span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-xs text-gray-600">
        <p>
          <strong>Bhava Strength:</strong> Measures the overall strength and influence of each house based on
          zodiac sign, lord planet strength, planets present, and specific house karaka values.
        </p>
      </div>
    </div>
  );
}
