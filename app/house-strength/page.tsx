'use client';

/**
 * House Strength Display Page - Demo
 * Shows Bhava (house) strength visualization
 */

import React from 'react';
import HouseStrengthGraph from '@/app/components/HouseStrengthGraph';

// Sample house strength data for all 12 houses
const SAMPLE_HOUSE_STRENGTH = [
  {
    number: 1,
    sign: 'Leo',
    strength: 82,
    lordPlanet: 'Sun',
    lordStrength: 85,
    planets: ['Sun', 'Mercury'],
    karakaValue: 100,
    maraka: false,
    dusthana: false,
  },
  {
    number: 2,
    sign: 'Virgo',
    strength: 68,
    lordPlanet: 'Mercury',
    lordStrength: 55,
    planets: [],
    karakaValue: 85,
    maraka: false,
    dusthana: false,
  },
  {
    number: 3,
    sign: 'Libra',
    strength: 75,
    lordPlanet: 'Venus',
    lordStrength: 72,
    planets: ['Mars'],
    karakaValue: 75,
    maraka: false,
    dusthana: false,
  },
  {
    number: 4,
    sign: 'Scorpio',
    strength: 58,
    lordPlanet: 'Mars',
    lordStrength: 68,
    planets: ['Moon'],
    karakaValue: 90,
    maraka: false,
    dusthana: false,
  },
  {
    number: 5,
    sign: 'Sagittarius',
    strength: 88,
    lordPlanet: 'Jupiter',
    lordStrength: 85,
    planets: ['Jupiter'],
    karakaValue: 95,
    maraka: false,
    dusthana: false,
  },
  {
    number: 6,
    sign: 'Capricorn',
    strength: 42,
    lordPlanet: 'Saturn',
    lordStrength: 45,
    planets: ['Rahu'],
    karakaValue: 40,
    maraka: false,
    dusthana: true,
  },
  {
    number: 7,
    sign: 'Aquarius',
    strength: 71,
    lordPlanet: 'Saturn',
    lordStrength: 45,
    planets: ['Venus'],
    karakaValue: 95,
    maraka: false,
    dusthana: false,
  },
  {
    number: 8,
    sign: 'Pisces',
    strength: 35,
    lordPlanet: 'Jupiter',
    lordStrength: 85,
    planets: ['Ketu'],
    karakaValue: 60,
    maraka: true,
    dusthana: true,
  },
  {
    number: 9,
    sign: 'Aries',
    strength: 79,
    lordPlanet: 'Mars',
    lordStrength: 68,
    planets: [],
    karakaValue: 90,
    maraka: false,
    dusthana: false,
  },
  {
    number: 10,
    sign: 'Taurus',
    strength: 85,
    lordPlanet: 'Venus',
    lordStrength: 72,
    planets: ['Saturn'],
    karakaValue: 100,
    maraka: false,
    dusthana: false,
  },
  {
    number: 11,
    sign: 'Gemini',
    strength: 76,
    lordPlanet: 'Mercury',
    lordStrength: 55,
    planets: [],
    karakaValue: 85,
    maraka: false,
    dusthana: false,
  },
  {
    number: 12,
    sign: 'Cancer',
    strength: 38,
    lordPlanet: 'Moon',
    lordStrength: 75,
    planets: [],
    karakaValue: 50,
    maraka: true,
    dusthana: true,
  },
];

export default function HouseStrengthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          भाव शक्ति विश्लेषण (House Strength Analysis)
        </h1>
        <p className="text-center text-gray-600 mb-8">
          12-House Strength and Significance Analysis
        </p>

        {/* Main Component */}
        <div className="mb-12">
          <HouseStrengthGraph
            houses={SAMPLE_HOUSE_STRENGTH}
            title="House Strength - Bhava Analysis"
            titleTamil="भाव शक्ति विश्लेषण"
            showDetails={true}
            interactive={true}
          />
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* About Bhava */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              About Bhava (House) Strength (भाव शक्ति)
            </h2>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <strong>Bhava</strong> means "house" in Vedic astrology. The 12 houses represent different areas
                of life. The strength of each house determines how well that area of life will flourish.
              </p>

              <p>
                House strength is determined by several factors:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">🏠 House Position</h3>
                  <p>The natural position and function of the house.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">♀ Zodiac Sign</h3>
                  <p>The sign occupying the house cusp provides inherent nature.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">☽ Lord Planet Strength</h3>
                  <p>The planet ruling the sign determines house strength significantly.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">✦ Planets Present</h3>
                  <p>Planets occupying the house modify its natural significations.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">🎯 Karaka (Significator)</h3>
                  <p>Each house has a natural significator planet that indicates its strength.</p>
                </div>
              </div>
            </div>
          </div>

          {/* House Meanings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              The 12 Houses (भाव)
            </h2>
            <div className="space-y-2 text-sm">
              {[
                { num: 1, name: 'Self, Personality, Body' },
                { num: 2, name: 'Wealth, Speech, Food' },
                { num: 3, name: 'Courage, Siblings, Communication' },
                { num: 4, name: 'Home, Mother, Property, Vehicles' },
                { num: 5, name: 'Children, Education, Creativity' },
                { num: 6, name: 'Health, Enemies, Debts (Dusthana)' },
                { num: 7, name: 'Marriage, Partnerships, Business' },
                { num: 8, name: 'Longevity, Inheritance (Maraka)' },
                { num: 9, name: 'Luck, Father, Religion, Travel' },
                { num: 10, name: 'Career, Reputation, Government' },
                { num: 11, name: 'Gains, Friendships, Aspirations' },
                { num: 12, name: 'Losses, Isolation, Moksha (Maraka)' },
              ].map((house) => (
                <div key={house.num} className="p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                  <span className="font-bold text-blue-900">House {house.num}:</span>
                  <span className="text-gray-700 ml-2">{house.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Special Houses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Maraka Houses */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">⚠️</span>
              <h2 className="text-2xl font-bold text-gray-800">Maraka Houses</h2>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              "Maraka" means "death-inflicting" in Sanskrit. These houses relate to longevity and life-ending
              influences:
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 rounded">
                <h3 className="font-bold text-orange-900 mb-1">House 8 (Eighth House)</h3>
                <p className="text-sm text-orange-700">
                  Longevity, inheritance, transformation, secret matters, death.
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <h3 className="font-bold text-orange-900 mb-1">House 12 (Twelfth House)</h3>
                <p className="text-sm text-orange-700">
                  Losses, isolation, foreign travel, moksha (liberation), ending of life.
                </p>
              </div>
            </div>
          </div>

          {/* Dusthana Houses */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">⛔</span>
              <h2 className="text-2xl font-bold text-gray-800">Dusthana Houses</h2>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              "Dusthana" means "difficult" or "house of bad fortune". These houses present challenges:
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded">
                <h3 className="font-bold text-red-900 mb-1">House 6 (Sixth House)</h3>
                <p className="text-sm text-red-700">
                  Health issues, enemies, debts, lawsuits, obstacles, competitors.
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <h3 className="font-bold text-red-900 mb-1">Houses 8 & 12 (Also Dusthana)</h3>
                <p className="text-sm text-red-700">
                  These combine difficulties with life-ending influences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Strength Interpretation */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            House Strength Interpretation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-500">
              <div className="text-3xl font-bold text-green-600 mb-2">75-100%</div>
              <h3 className="font-semibold text-green-900 mb-2">Very Strong</h3>
              <p className="text-xs text-green-700">
                House significations manifest powerfully and positively in life.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-500">
              <div className="text-3xl font-bold text-amber-600 mb-2">50-74%</div>
              <h3 className="font-semibold text-amber-900 mb-2">Moderate</h3>
              <p className="text-xs text-amber-700">
                House shows balanced influence. Results depend on other planetary factors.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-500">
              <div className="text-3xl font-bold text-orange-600 mb-2">25-49%</div>
              <h3 className="font-semibold text-orange-900 mb-2">Weak</h3>
              <p className="text-xs text-orange-700">
                House significations are limited. Challenges may arise in this area.
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-500">
              <div className="text-3xl font-bold text-red-600 mb-2">0-24%</div>
              <h3 className="font-semibold text-red-900 mb-2">Very Weak</h3>
              <p className="text-xs text-red-700">
                House shows severe weakness. Major difficulties in this life area.
              </p>
            </div>
          </div>
        </div>

        {/* House Karaka Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            House Karakas (Natural Significators)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { house: 1, karaka: 'Sun', meaning: 'Self' },
              { house: 2, karaka: 'Jupiter', meaning: 'Wealth' },
              { house: 3, karaka: 'Mercury', meaning: 'Siblings' },
              { house: 4, karaka: 'Moon', meaning: 'Mother' },
              { house: 5, karaka: 'Sun/Jupiter', meaning: 'Children' },
              { house: 6, karaka: 'Mars', meaning: 'Health' },
              { house: 7, karaka: 'Venus', meaning: 'Spouse' },
              { house: 8, karaka: 'Saturn', meaning: 'Longevity' },
              { house: 9, karaka: 'Jupiter', meaning: 'Father' },
              { house: 10, karaka: 'Saturn', meaning: 'Career' },
              { house: 11, karaka: 'Jupiter', meaning: 'Gains' },
              { house: 12, karaka: 'Saturn', meaning: 'Losses' },
            ].map((item) => (
              <div
                key={item.house}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-lg transition"
              >
                <div className="text-2xl font-bold text-blue-600 mb-2">H{item.house}</div>
                <p className="font-semibold text-gray-900 text-sm">{item.meaning}</p>
                <p className="text-xs text-gray-600 mt-1">Karaka: {item.karaka}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
