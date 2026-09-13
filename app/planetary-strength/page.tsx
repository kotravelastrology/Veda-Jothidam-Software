'use client';

/**
 * Planetary Strength Display Page - Demo
 * Shows Shadbala calculation and visualization
 */

import React from 'react';
import PlanetaryStrengthGraph from '@/app/components/PlanetaryStrengthGraph';

// Sample planetary strength data
const SAMPLE_PLANETARY_STRENGTH = [
  {
    name: 'Sun',
    strength: 82,
    dignity: 'own' as const,
    aspectValue: 7,
    burnStatus: 'normal' as const,
    retrograde: false,
  },
  {
    name: 'Moon',
    strength: 75,
    dignity: 'friendly' as const,
    aspectValue: 6,
    burnStatus: 'normal' as const,
    retrograde: false,
  },
  {
    name: 'Mars',
    strength: 68,
    dignity: 'exalted' as const,
    aspectValue: 6,
    burnStatus: 'normal' as const,
    retrograde: false,
  },
  {
    name: 'Mercury',
    strength: 55,
    dignity: 'neutral' as const,
    aspectValue: 4,
    burnStatus: 'combust' as const,
    retrograde: true,
  },
  {
    name: 'Jupiter',
    strength: 85,
    dignity: 'own' as const,
    aspectValue: 8,
    burnStatus: 'normal' as const,
    retrograde: false,
  },
  {
    name: 'Venus',
    strength: 72,
    dignity: 'exalted' as const,
    aspectValue: 7,
    burnStatus: 'normal' as const,
    retrograde: false,
  },
  {
    name: 'Saturn',
    strength: 45,
    dignity: 'debilitated' as const,
    aspectValue: 3,
    burnStatus: 'normal' as const,
    retrograde: true,
  },
  {
    name: 'Rahu',
    strength: 58,
    dignity: 'neutral' as const,
    aspectValue: 5,
    burnStatus: 'normal' as const,
    retrograde: false,
  },
  {
    name: 'Ketu',
    strength: 52,
    dignity: 'neutral' as const,
    aspectValue: 4,
    burnStatus: 'normal' as const,
    retrograde: false,
  },
];

export default function PlanetaryStrengthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          कிरह शक्ति विश्लेषण (Planetary Strength Analysis)
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Shadbala (6-fold Strength) Calculation and Visualization
        </p>

        {/* Main Component */}
        <div className="mb-12">
          <PlanetaryStrengthGraph
            planets={SAMPLE_PLANETARY_STRENGTH}
            title="Planetary Strength - Shadbala Analysis"
            titleTamil="கிரह शक्ति विश्लेषण"
            chartType="bar"
            showDetails={true}
            interactive={true}
          />
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* About Shadbala */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              About Shadbala (छड्बल)
            </h2>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <strong>Shadbala</strong> means "6-fold strength" in Vedic astrology. It measures the
                overall strength of each planet based on six different factors:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">1. Sthana Bala (Position Strength)</h3>
                  <p>Strength based on zodiac sign, house position, and other positional factors.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">2. Dik Bala (Directional Strength)</h3>
                  <p>Planets gain strength in specific directions (East, South, West, North).</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">3. Kala Bala (Time Strength)</h3>
                  <p>Strength varies by day of week, month, season, and year.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">4. Chesta Bala (Movement Strength)</h3>
                  <p>Based on planetary speed and retrograde motion.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">5. Naisargika Bala (Natural Strength)</h3>
                  <p>Inherent strength of each planet (Jupiter strongest, Moon weakest).</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">6. Drishti Bala (Aspect Strength)</h3>
                  <p>Strength gained from aspects of other planets.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dignity Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Dignity Status (अवस्था)
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                <div className="flex items-center gap-2 font-semibold text-green-900">
                  <span>⬆️</span> <span>Exalted (उच्च)</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Planet is extremely strong in this sign</p>
              </div>

              <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                <div className="flex items-center gap-2 font-semibold text-blue-900">
                  <span>➡️</span> <span>Own Sign (स्वराशि)</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">Planet rules this zodiac sign</p>
              </div>

              <div className="p-3 bg-cyan-50 rounded border-l-4 border-cyan-500">
                <div className="flex items-center gap-2 font-semibold text-cyan-900">
                  <span>↗️</span> <span>Friendly (मित्र)</span>
                </div>
                <p className="text-xs text-cyan-700 mt-1">Planet is in friendly sign</p>
              </div>

              <div className="p-3 bg-gray-100 rounded border-l-4 border-gray-400">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <span>⬌</span> <span>Neutral (समराशि)</span>
                </div>
                <p className="text-xs text-gray-700 mt-1">Planet has neutral relationship with sign</p>
              </div>

              <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                <div className="flex items-center gap-2 font-semibold text-orange-900">
                  <span>↙️</span> <span>Enemy (शत्रु)</span>
                </div>
                <p className="text-xs text-orange-700 mt-1">Planet is in enemy sign</p>
              </div>

              <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
                <div className="flex items-center gap-2 font-semibold text-red-900">
                  <span>⬇️</span> <span>Debilitated (नीच)</span>
                </div>
                <p className="text-xs text-red-700 mt-1">Planet is extremely weak in this sign</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strength Interpretation */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Strength Interpretation Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-500">
              <div className="text-3xl font-bold text-green-600 mb-2">75-100%</div>
              <h3 className="font-semibold text-green-900 mb-2">Very Strong</h3>
              <p className="text-xs text-green-700">
                Planet exercises strong positive influence. Results manifest favorably.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-500">
              <div className="text-3xl font-bold text-amber-600 mb-2">50-74%</div>
              <h3 className="font-semibold text-amber-900 mb-2">Moderate</h3>
              <p className="text-xs text-amber-700">
                Planet has balanced influence. Mixed results depending on other factors.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-500">
              <div className="text-3xl font-bold text-orange-600 mb-2">25-49%</div>
              <h3 className="font-semibold text-orange-900 mb-2">Weak</h3>
              <p className="text-xs text-orange-700">
                Planet's influence is limited. Requires support from other strong planets.
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-500">
              <div className="text-3xl font-bold text-red-600 mb-2">0-24%</div>
              <h3 className="font-semibold text-red-900 mb-2">Very Weak</h3>
              <p className="text-xs text-red-700">
                Planet is severely afflicted. Negative results may manifest.
              </p>
            </div>
          </div>
        </div>

        {/* Special Indicators */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Special Indicators
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔄</span>
                <h3 className="font-semibold text-orange-900">Retrograde (R)</h3>
              </div>
              <p className="text-sm text-orange-700">
                Planet appears to move backward in the sky. Effects are internalized and delayed, but often
                stronger when they manifest.
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <h3 className="font-semibold text-red-900">Combust</h3>
              </div>
              <p className="text-sm text-red-700">
                Planet is too close to the Sun and overwhelmed by its rays. Results are blocked or severely
                diminished until the planet moves away.
              </p>
            </div>
          </div>
        </div>

        {/* Planet Descriptions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            The 9 Planets (नवग्रह)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sun',
                tamil: 'சூரியன்',
                element: 'Fire',
                days: 'Sunday',
                color: '#FF6B35',
                role: 'Self, Authority, Father, Government',
              },
              {
                name: 'Moon',
                tamil: 'சந்திரன்',
                element: 'Water',
                days: 'Monday',
                color: '#FFB347',
                role: 'Mind, Emotions, Mother, Nurturing',
              },
              {
                name: 'Mars',
                tamil: 'செவ்வாய்',
                element: 'Fire',
                days: 'Tuesday',
                color: '#DC143C',
                role: 'Energy, Courage, Aggression, War',
              },
              {
                name: 'Mercury',
                tamil: 'புதன்',
                element: 'Earth',
                days: 'Wednesday',
                color: '#7CB342',
                role: 'Communication, Intellect, Trade, Commerce',
              },
              {
                name: 'Jupiter',
                tamil: 'குரு',
                element: 'Air',
                days: 'Thursday',
                color: '#FFC107',
                role: 'Wisdom, Growth, Spirituality, Expansion',
              },
              {
                name: 'Venus',
                tamil: 'சுக்கிரன்',
                element: 'Water',
                days: 'Friday',
                color: '#FF1493',
                role: 'Love, Beauty, Art, Pleasure, Luxury',
              },
              {
                name: 'Saturn',
                tamil: 'சனி',
                element: 'Air',
                days: 'Saturday',
                color: '#696969',
                role: 'Discipline, Karma, Lessons, Boundaries',
              },
              {
                name: 'Rahu',
                tamil: 'ராகு',
                element: 'Mixed',
                days: 'Monday/Tuesday',
                color: '#8B4513',
                role: 'Obsession, Shadow, Illusion, Innovation',
              },
              {
                name: 'Ketu',
                tamil: 'கேது',
                element: 'Mixed',
                days: 'Wednesday/Friday',
                color: '#4B0082',
                role: 'Detachment, Healing, Spiritual Growth',
              },
            ].map((planet) => (
              <div
                key={planet.name}
                className="p-4 rounded-lg border-l-4"
                style={{ borderColor: planet.color, backgroundColor: planet.color + '10' }}
              >
                <h3 className="font-bold text-lg text-gray-900">{planet.name}</h3>
                <p className="text-sm text-gray-600 font-tamil">{planet.tamil}</p>
                <div className="mt-3 space-y-1 text-xs text-gray-700">
                  <p>
                    <strong>Element:</strong> {planet.element}
                  </p>
                  <p>
                    <strong>Day:</strong> {planet.days}
                  </p>
                  <p>
                    <strong>Roles:</strong> {planet.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
