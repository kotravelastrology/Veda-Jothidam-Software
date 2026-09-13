'use client';

/**
 * Chart Display Page - Demo of ChartWheel Component
 * Shows a sample birth chart visualization
 */

import React, { useState } from 'react';
import ChartWheel from '@/app/components/ChartWheel';

interface PlanetPosition {
  name: string;
  degree: number;
  sign?: number;
  symbol?: string;
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

// Sample chart data for demonstration
const SAMPLE_CHART_DATA: ChartData = {
  ascendant: {
    name: 'Ascendant',
    degree: 120,
    isAscendant: true,
  },
  planets: [
    { name: 'Sun', degree: 45, retrograde: false },
    { name: 'Moon', degree: 120, retrograde: false },
    { name: 'Mars', degree: 210, retrograde: false },
    { name: 'Mercury', degree: 75, retrograde: true },
    { name: 'Jupiter', degree: 285, retrograde: false },
    { name: 'Venus', degree: 30, retrograde: false },
    { name: 'Saturn', degree: 330, retrograde: false },
    { name: 'Rahu', degree: 150, retrograde: false },
    { name: 'Ketu', degree: 330, retrograde: false },
  ],
  houses: [
    { number: 1, degree: 120 },   // Ascendant
    { number: 2, degree: 150 },
    { number: 3, degree: 180 },
    { number: 4, degree: 210 },
    { number: 5, degree: 240 },
    { number: 6, degree: 270 },
    { number: 7, degree: 300 },   // Descendant
    { number: 8, degree: 330 },
    { number: 9, degree: 0 },
    { number: 10, degree: 30 },
    { number: 11, degree: 60 },
    { number: 12, degree: 90 },
  ],
};

export default function ChartDisplayPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);

  const handlePlanetClick = (planet: PlanetPosition) => {
    setSelectedPlanet(planet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          ஜாதக விளக்கம் (Birth Chart Display)
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Vedic Astrology Chart Visualization - Demo
        </p>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Column */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ChartWheel
                chartData={SAMPLE_CHART_DATA}
                size={500}
                interactive={true}
                title="Birth Chart - Ravi (Sample)"
                onPlanetClick={handlePlanetClick}
              />
            </div>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            {/* Chart Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Chart Information</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-orange-600">Name (பெயர்)</p>
                  <p>Ravi Kumar</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Birth Date (பிறந்த தேதி)</p>
                  <p>January 15, 2000</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Birth Time (பிறந்த நேரம்)</p>
                  <p>02:30 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Birth Place (பிறந்த இடம்)</p>
                  <p>Chennai, India</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Ascendant (ராசி)</p>
                  <p>Leo (சிம்ஹம்)</p>
                </div>
              </div>
            </div>

            {/* Selected Planet Info */}
            {selectedPlanet && (
              <div className="bg-orange-50 rounded-lg shadow p-6 border-l-4 border-orange-500">
                <h2 className="text-xl font-bold text-orange-700 mb-4">
                  {selectedPlanet.name} (Planet Details)
                </h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">Degree (கோணம்)</p>
                    <p>{selectedPlanet.degree}°</p>
                  </div>
                  {selectedPlanet.retrograde && (
                    <div className="bg-red-100 border border-red-300 rounded p-2 text-red-700 font-semibold">
                      ⚠️ Retrograde Motion (வஸ்திக்கால நிலை)
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-semibold transition"
                >
                  Clear Selection
                </button>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-blue-800 mb-3">💡 How to Use</h3>
              <ul className="text-xs text-blue-700 space-y-2">
                <li>• Hover over planets to see their names</li>
                <li>• Click on planets for detailed information</li>
                <li>• Golden triangle marks the Ascendant (Lagna)</li>
                <li>• Numbers show the 12 houses</li>
                <li>• Outer ring shows zodiac signs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Planet Legend */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Planets Legend (கிரக விளக்கம்)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Sun', tamil: 'சூரியன்', symbol: '☉' },
              { name: 'Moon', tamil: 'சந்திரன்', symbol: '☽' },
              { name: 'Mars', tamil: 'செவ்வாய்', symbol: '♂' },
              { name: 'Mercury', tamil: 'புதன்', symbol: '☿' },
              { name: 'Jupiter', tamil: 'குரு', symbol: '♃' },
              { name: 'Venus', tamil: 'சுக்கிரன்', symbol: '♀' },
              { name: 'Saturn', tamil: 'சனி', symbol: '♄' },
              { name: 'Rahu', tamil: 'ராகு', symbol: '☢' },
              { name: 'Ketu', tamil: 'கேது', symbol: '☬' },
            ].map((planet) => (
              <div
                key={planet.name}
                className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition"
              >
                <div className="text-3xl mb-2">{planet.symbol}</div>
                <div className="font-semibold text-gray-800">{planet.name}</div>
                <div className="text-sm text-gray-600 font-tamil">{planet.tamil}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Zodiac Signs Legend */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Zodiac Signs (ராசிக்கள்)</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Aries', tamil: 'மேஷம்', symbol: '♈' },
              { name: 'Taurus', tamil: 'ரிஷபம்', symbol: '♉' },
              { name: 'Gemini', tamil: 'மிதுனம்', symbol: '♊' },
              { name: 'Cancer', tamil: 'கர்கடகம்', symbol: '♋' },
              { name: 'Leo', tamil: 'சிம்ஹம்', symbol: '♌' },
              { name: 'Virgo', tamil: 'கன்னர', symbol: '♍' },
              { name: 'Libra', tamil: 'துலாம்', symbol: '♎' },
              { name: 'Scorpio', tamil: 'விருச்சிகம்', symbol: '♏' },
              { name: 'Sagittarius', tamil: 'தனுஷ்', symbol: '♐' },
              { name: 'Capricorn', tamil: 'மகரம்', symbol: '♑' },
              { name: 'Aquarius', tamil: 'கும்பம்', symbol: '♒' },
              { name: 'Pisces', tamil: 'மீனம்', symbol: '♓' },
            ].map((sign) => (
              <div
                key={sign.name}
                className="p-3 border border-gray-200 rounded-lg text-center hover:bg-orange-50 transition"
              >
                <div className="text-2xl mb-1">{sign.symbol}</div>
                <div className="text-xs font-semibold text-gray-700">{sign.name}</div>
                <div className="text-xs text-gray-500 font-tamil">{sign.tamil}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
