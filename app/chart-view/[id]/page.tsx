'use client';

/**
 * Chart View Page - Complete Birth Chart Display
 *
 * Integrates all visualization components:
 * - ChartWheel (birth chart)
 * - PlanetaryStrengthGraph (Shadbala)
 * - HouseStrengthGraph (Bhava strength)
 * - DashaTable (period timeline)
 * - Birth information
 * - Interpretations
 */

import React, { useState, useMemo } from 'react';
import ChartWheel from '@/app/components/ChartWheel';
import PlanetaryStrengthGraph from '@/app/components/PlanetaryStrengthGraph';
import HouseStrengthGraph from '@/app/components/HouseStrengthGraph';
import DashaTable from '@/app/components/DashaTable';

// Sample data for demonstration
const SAMPLE_CHART = {
  name: 'Ravi Kumar',
  birth_date: '1990-05-15',
  birth_time: '10:30:00',
  birth_location: 'Chennai, India',
  latitude: 13.0827,
  longitude: 80.2707,
  timezone: 'Asia/Kolkata',
  ayanamsa: 'Lahiri',
};

const SAMPLE_WHEEL_DATA = {
  ascendant: { name: 'Ascendant', degree: 120, isAscendant: true },
  planets: [
    { name: 'Sun', degree: 45, symbol: '☉', retrograde: false },
    { name: 'Moon', degree: 120, symbol: '☽', retrograde: false },
    { name: 'Mars', degree: 210, symbol: '♂', retrograde: false },
    { name: 'Mercury', degree: 75, symbol: '☿', retrograde: true },
    { name: 'Jupiter', degree: 285, symbol: '♃', retrograde: false },
    { name: 'Venus', degree: 30, symbol: '♀', retrograde: false },
    { name: 'Saturn', degree: 330, symbol: '♄', retrograde: false },
    { name: 'Rahu', degree: 150, symbol: '☢', retrograde: false },
    { name: 'Ketu', degree: 330, symbol: '☬', retrograde: false },
  ],
  houses: Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    degree: (i * 30 + 120) % 360,
  })),
};

const SAMPLE_PLANETARY_STRENGTH = [
  { name: 'Sun', strength: 82, dignity: 'own' as const, aspectValue: 7, burnStatus: 'normal' as const },
  { name: 'Moon', strength: 75, dignity: 'friendly' as const, aspectValue: 6, burnStatus: 'normal' as const },
  { name: 'Mars', strength: 68, dignity: 'exalted' as const, aspectValue: 6, burnStatus: 'normal' as const },
  { name: 'Mercury', strength: 55, dignity: 'neutral' as const, aspectValue: 4, burnStatus: 'combust' as const, retrograde: true },
  { name: 'Jupiter', strength: 85, dignity: 'own' as const, aspectValue: 8, burnStatus: 'normal' as const },
  { name: 'Venus', strength: 72, dignity: 'exalted' as const, aspectValue: 7, burnStatus: 'normal' as const },
  { name: 'Saturn', strength: 45, dignity: 'debilitated' as const, aspectValue: 3, burnStatus: 'normal' as const, retrograde: true },
  { name: 'Rahu', strength: 58, dignity: 'neutral' as const, aspectValue: 5, burnStatus: 'normal' as const },
  { name: 'Ketu', strength: 52, dignity: 'neutral' as const, aspectValue: 4, burnStatus: 'normal' as const },
];

const SAMPLE_HOUSE_STRENGTH = [
  { number: 1, sign: 'Leo', strength: 82, lordPlanet: 'Sun', lordStrength: 85, planets: ['Sun', 'Mercury'], karakaValue: 100 },
  { number: 2, sign: 'Virgo', strength: 68, lordPlanet: 'Mercury', lordStrength: 55, planets: [], karakaValue: 85 },
  { number: 3, sign: 'Libra', strength: 75, lordPlanet: 'Venus', lordStrength: 72, planets: ['Mars'], karakaValue: 75 },
  { number: 4, sign: 'Scorpio', strength: 58, lordPlanet: 'Mars', lordStrength: 68, planets: ['Moon'], karakaValue: 90 },
  { number: 5, sign: 'Sagittarius', strength: 88, lordPlanet: 'Jupiter', lordStrength: 85, planets: ['Jupiter'], karakaValue: 95 },
  { number: 6, sign: 'Capricorn', strength: 42, lordPlanet: 'Saturn', lordStrength: 45, planets: ['Rahu'], karakaValue: 40, dusthana: true },
  { number: 7, sign: 'Aquarius', strength: 71, lordPlanet: 'Saturn', lordStrength: 45, planets: ['Venus'], karakaValue: 95 },
  { number: 8, sign: 'Pisces', strength: 35, lordPlanet: 'Jupiter', lordStrength: 85, planets: ['Ketu'], karakaValue: 60, maraka: true, dusthana: true },
  { number: 9, sign: 'Aries', strength: 79, lordPlanet: 'Mars', lordStrength: 68, planets: [], karakaValue: 90 },
  { number: 10, sign: 'Taurus', strength: 85, lordPlanet: 'Venus', lordStrength: 72, planets: ['Saturn'], karakaValue: 100 },
  { number: 11, sign: 'Gemini', strength: 76, lordPlanet: 'Mercury', lordStrength: 55, planets: [], karakaValue: 85 },
  { number: 12, sign: 'Cancer', strength: 38, lordPlanet: 'Moon', lordStrength: 75, planets: [], karakaValue: 50, maraka: true, dusthana: true },
];

const SAMPLE_DASHA = [
  {
    planet: 'Mercury',
    startDate: new Date('2022-01-15'),
    endDate: new Date('2041-01-15'),
    durationYears: 17,
    durationMonths: 0,
    status: 'current' as const,
    bhuktiPeriods: [
      {
        planet: 'Mercury',
        startDate: new Date('2022-01-15'),
        endDate: new Date('2024-08-15'),
        durationYears: 2,
        durationMonths: 7,
        antaraPeriods: [
          { planet: 'Mercury', startDate: new Date('2022-01-15'), endDate: new Date('2022-07-15'), durationMonths: 6 },
          { planet: 'Jupiter', startDate: new Date('2022-07-15'), endDate: new Date('2023-02-15'), durationMonths: 7 },
        ],
      },
    ],
  },
];

interface TabType {
  id: 'strength' | 'houses' | 'dasha' | 'interpretations';
  label: string;
  icon: string;
}

const TABS: TabType[] = [
  { id: 'strength', label: 'Planetary Strength', icon: '⭐' },
  { id: 'houses', label: 'House Strength', icon: '🏠' },
  { id: 'dasha', label: 'Dasha Timeline', icon: '📅' },
  { id: 'interpretations', label: 'Interpretations', icon: '📖' },
];

export default function ChartViewPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabType['id']>('strength');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ஜாதக விளக்கம் (Birth Chart Analysis)
          </h1>
          <p className="text-gray-600 mb-6">Complete Vedic Astrology Chart Interpretation</p>

          {/* Birth Information Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Name (பெயர்)</p>
              <p className="text-lg font-bold text-gray-900">{SAMPLE_CHART.name}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Birth Date (பிறந்த தேதி)</p>
              <p className="text-lg font-bold text-gray-900">May 15, 1990</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Birth Time (பிறந்த நேரம்)</p>
              <p className="text-lg font-bold text-gray-900">10:30 AM</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Birth Place (பிறந்த இடம்)</p>
              <p className="text-lg font-bold text-gray-900">Chennai, India</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Chart Wheel Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ChartWheel
                chartData={SAMPLE_WHEEL_DATA}
                size={500}
                interactive={true}
                title="Birth Chart - Ravi Kumar"
                onPlanetClick={(planet) => setSelectedPlanet(planet.name)}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Ascendant Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6 border-2 border-orange-300">
              <h3 className="text-xl font-bold text-orange-900 mb-2">Ascendant (Lagna)</h3>
              <p className="text-3xl font-bold text-orange-700 mb-2">♌ Leo</p>
              <div className="space-y-1 text-sm text-orange-800">
                <p><strong>Degree:</strong> 120°</p>
                <p><strong>Ruler:</strong> Sun</p>
                <p><strong>Strength:</strong> Very Strong</p>
              </div>
            </div>

            {/* Selected Planet Info */}
            {selectedPlanet && (
              <div className="bg-blue-50 rounded-lg shadow p-6 border-2 border-blue-300">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{selectedPlanet}</h3>
                <p className="text-sm text-blue-700 mb-3">Planet Details</p>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Position:</strong> See chart above</p>
                  <p><strong>Strength:</strong> Check Planetary tab</p>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition"
                >
                  Close
                </button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Strongest Planet:</span>
                  <span className="font-bold text-gray-900">Jupiter (85%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Strongest House:</span>
                  <span className="font-bold text-gray-900">House 10 (85%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Dasha:</span>
                  <span className="font-bold text-gray-900">Mercury (17y)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white border-b-4 border-orange-600'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'strength' && (
              <PlanetaryStrengthGraph
                planets={SAMPLE_PLANETARY_STRENGTH}
                title="Planetary Strength Analysis"
                chartType="bar"
                showDetails={true}
              />
            )}

            {activeTab === 'houses' && (
              <HouseStrengthGraph
                houses={SAMPLE_HOUSE_STRENGTH}
                title="House Strength Analysis"
                showDetails={true}
              />
            )}

            {activeTab === 'dasha' && (
              <DashaTable
                dashaPeriods={SAMPLE_DASHA}
                title="Vimshottari Dasha Timeline"
                showAntaraDetails={true}
              />
            )}

            {activeTab === 'interpretations' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <h3 className="text-xl font-bold text-red-900 mb-3">Personality & Temperament</h3>
                    <p className="text-sm text-red-800">
                      Leo Ascendant with strong Sun indicates a natural leader. You are confident, creative, and
                      ambitious. With Jupiter strong in the 5th house, you have excellent intellect and spiritual inclination.
                    </p>
                  </div>

                  <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <h3 className="text-xl font-bold text-green-900 mb-3">Career & Success</h3>
                    <p className="text-sm text-green-800">
                      Strong 10th house indicates success in career. Saturn in the 10th, though debilitated, teaches discipline.
                      Your 9th house strength indicates luck and fortune in professional ventures.
                    </p>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">Relationships & Marriage</h3>
                    <p className="text-sm text-blue-800">
                      Venus in the 7th house indicates a harmonious married life. The 7th house strength is good, promising
                      a supportive and loving partnership. Mars aspect on the 7th adds passion and dynamism.
                    </p>
                  </div>

                  <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <h3 className="text-xl font-bold text-purple-900 mb-3">Health & Longevity</h3>
                    <p className="text-sm text-purple-800">
                      The 8th house is weak but Jupiter's aspect provides some protection. Generally good health, though watch
                      for stress-related issues during Mercury-Saturn periods. Regular exercise and meditation recommended.
                    </p>
                  </div>

                  <div className="p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="text-xl font-bold text-yellow-900 mb-3">Spiritual Growth</h3>
                    <p className="text-sm text-yellow-800">
                      Jupiter in the 5th house is excellent for spiritual pursuits. The current Mercury Dasha offers good
                      opportunities for learning and intellectual growth. Meditation and yoga will be particularly beneficial.
                    </p>
                  </div>

                  <div className="p-6 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                    <h3 className="text-xl font-bold text-pink-900 mb-3">Financial Prospects</h3>
                    <p className="text-sm text-pink-800">
                      The 2nd house of wealth is moderately strong. 11th house indicates gains from networks and aspirations.
                      The weak 12th house suggests need for caution in foreign investments. Jupiter-ruled 5th brings prosperity.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Planetary Periods */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Planetary Period</h2>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-bold text-orange-900 mb-2">Mahadasha: Mercury (2022-2041)</h3>
                <p className="text-sm text-orange-700 mb-2">
                  17-year period focusing on communication, intellect, and commerce
                </p>
                <div className="text-xs text-orange-600">
                  <p><strong>Characteristics:</strong> Growth in knowledge, business expansion, networking</p>
                  <p><strong>Timing:</strong> 18 years remaining (until 2041)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Remedies & Suggestions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Remedies</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                <p><strong className="text-blue-900">For Jupiter Strengthening:</strong></p>
                <p className="text-blue-800">Wear yellow sapphire (Pukhraj). Chant Jupiter mantras on Thursdays.</p>
              </div>
              <div className="p-3 bg-gray-100 rounded border-l-4 border-gray-400">
                <p><strong className="text-gray-900">For Saturn Balance:</strong></p>
                <p className="text-gray-800">Wear blue sapphire (Neelam). Serve the underprivileged on Saturdays.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                <p><strong className="text-purple-900">General Practices:</strong></p>
                <p className="text-purple-800">Meditation, yoga, charity, and helping others will strengthen your chart.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition">
            📥 Download Chart
          </button>
          <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition">
            🖨️ Print Chart
          </button>
          <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition">
            💬 Get Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
