'use client';

/**
 * Dasha Display Page - Demo of DashaTable Component
 * Shows a sample Vimshottari Dasha timeline
 */

import React from 'react';
import DashaTable from '@/app/components/DashaTable';

interface DashaPeriod {
  planet: string;
  planetTamil?: string;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  durationMonths: number;
  durationDays?: number;
  status: 'past' | 'current' | 'future';
  bhuktiPeriods?: BhuktiPeriod[];
}

interface BhuktiPeriod {
  planet: string;
  planetTamil?: string;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  durationMonths: number;
  antaraPeriods?: AntaraPeriod[];
}

interface AntaraPeriod {
  planet: string;
  planetTamil?: string;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  sukshmaPeriods?: SukshmaPeriod[];
}

interface SukshmaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
}

// Sample Vimshottari Dasha data (starting from Moon Dasha)
const SAMPLE_DASHA_PERIODS: DashaPeriod[] = [
  {
    planet: 'Moon',
    planetTamil: 'சந்திரன்',
    startDate: new Date('2005-01-15'),
    endDate: new Date('2015-01-15'),
    durationYears: 10,
    durationMonths: 0,
    status: 'past',
    bhuktiPeriods: [
      {
        planet: 'Moon',
        planetTamil: 'சந்திரன்',
        startDate: new Date('2005-01-15'),
        endDate: new Date('2007-03-15'),
        durationYears: 2,
        durationMonths: 2,
        antaraPeriods: [
          {
            planet: 'Moon',
            planetTamil: 'சந்திரன்',
            startDate: new Date('2005-01-15'),
            endDate: new Date('2005-07-15'),
            durationMonths: 6,
          },
          {
            planet: 'Mars',
            planetTamil: 'செவ்வாய்',
            startDate: new Date('2005-07-15'),
            endDate: new Date('2005-11-15'),
            durationMonths: 4,
          },
          {
            planet: 'Mercury',
            planetTamil: 'புதன்',
            startDate: new Date('2005-11-15'),
            endDate: new Date('2006-02-15'),
            durationMonths: 3,
          },
        ],
      },
      {
        planet: 'Mars',
        planetTamil: 'செவ்வாய்',
        startDate: new Date('2007-03-15'),
        endDate: new Date('2008-06-15'),
        durationYears: 1,
        durationMonths: 3,
        antaraPeriods: [
          {
            planet: 'Mars',
            planetTamil: 'செவ்வாய்',
            startDate: new Date('2007-03-15'),
            endDate: new Date('2007-07-15'),
            durationMonths: 4,
          },
          {
            planet: 'Mercury',
            planetTamil: 'புதன்',
            startDate: new Date('2007-07-15'),
            endDate: new Date('2007-10-15'),
            durationMonths: 3,
          },
        ],
      },
      {
        planet: 'Mercury',
        planetTamil: 'புதன்',
        startDate: new Date('2008-06-15'),
        endDate: new Date('2010-11-15'),
        durationYears: 2,
        durationMonths: 5,
        antaraPeriods: [
          {
            planet: 'Mercury',
            planetTamil: 'புதன்',
            startDate: new Date('2008-06-15'),
            endDate: new Date('2008-11-15'),
            durationMonths: 5,
          },
          {
            planet: 'Jupiter',
            planetTamil: 'குரு',
            startDate: new Date('2008-11-15'),
            endDate: new Date('2009-04-15'),
            durationMonths: 5,
          },
        ],
      },
    ],
  },
  {
    planet: 'Mars',
    planetTamil: 'செவ்வாய்',
    startDate: new Date('2015-01-15'),
    endDate: new Date('2022-01-15'),
    durationYears: 7,
    durationMonths: 0,
    status: 'past',
    bhuktiPeriods: [
      {
        planet: 'Mars',
        planetTamil: 'செவ்வாய்',
        startDate: new Date('2015-01-15'),
        endDate: new Date('2015-10-15'),
        durationYears: 0,
        durationMonths: 9,
        antaraPeriods: [
          {
            planet: 'Mars',
            planetTamil: 'செவ்வாய்',
            startDate: new Date('2015-01-15'),
            endDate: new Date('2015-04-15'),
            durationMonths: 3,
          },
          {
            planet: 'Mercury',
            planetTamil: 'புதன்',
            startDate: new Date('2015-04-15'),
            endDate: new Date('2015-07-15'),
            durationMonths: 3,
          },
        ],
      },
      {
        planet: 'Mercury',
        planetTamil: 'புதன்',
        startDate: new Date('2015-10-15'),
        endDate: new Date('2017-12-15'),
        durationYears: 2,
        durationMonths: 2,
        antaraPeriods: [
          {
            planet: 'Mercury',
            planetTamil: 'புதன்',
            startDate: new Date('2015-10-15'),
            endDate: new Date('2016-03-15'),
            durationMonths: 5,
          },
          {
            planet: 'Jupiter',
            planetTamil: 'குரு',
            startDate: new Date('2016-03-15'),
            endDate: new Date('2016-10-15'),
            durationMonths: 7,
          },
        ],
      },
    ],
  },
  {
    planet: 'Mercury',
    planetTamil: 'புதன்',
    startDate: new Date('2022-01-15'),
    endDate: new Date('2041-01-15'),
    durationYears: 17,
    durationMonths: 0,
    status: 'current',
    bhuktiPeriods: [
      {
        planet: 'Mercury',
        planetTamil: 'புதன்',
        startDate: new Date('2022-01-15'),
        endDate: new Date('2024-08-15'),
        durationYears: 2,
        durationMonths: 7,
        antaraPeriods: [
          {
            planet: 'Mercury',
            planetTamil: 'புதன்',
            startDate: new Date('2022-01-15'),
            endDate: new Date('2022-07-15'),
            durationMonths: 6,
          },
          {
            planet: 'Jupiter',
            planetTamil: 'குரு',
            startDate: new Date('2022-07-15'),
            endDate: new Date('2023-02-15'),
            durationMonths: 7,
          },
          {
            planet: 'Venus',
            planetTamil: 'சுக்கிரன்',
            startDate: new Date('2023-02-15'),
            endDate: new Date('2023-09-15'),
            durationMonths: 7,
          },
          {
            planet: 'Saturn',
            planetTamil: 'சனி',
            startDate: new Date('2023-09-15'),
            endDate: new Date('2024-08-15'),
            durationMonths: 11,
          },
        ],
      },
      {
        planet: 'Jupiter',
        planetTamil: 'குரு',
        startDate: new Date('2024-08-15'),
        endDate: new Date('2027-06-15'),
        durationYears: 2,
        durationMonths: 10,
        antaraPeriods: [
          {
            planet: 'Jupiter',
            planetTamil: 'குரு',
            startDate: new Date('2024-08-15'),
            endDate: new Date('2025-04-15'),
            durationMonths: 8,
          },
          {
            planet: 'Venus',
            planetTamil: 'சுக்கிரன்',
            startDate: new Date('2025-04-15'),
            endDate: new Date('2026-01-15'),
            durationMonths: 9,
          },
          {
            planet: 'Saturn',
            planetTamil: 'சனி',
            startDate: new Date('2026-01-15'),
            endDate: new Date('2027-06-15'),
            durationMonths: 17,
          },
        ],
      },
      {
        planet: 'Venus',
        planetTamil: 'சுக்கிரன்',
        startDate: new Date('2027-06-15'),
        endDate: new Date('2030-09-15'),
        durationYears: 3,
        durationMonths: 3,
        antaraPeriods: [
          {
            planet: 'Venus',
            planetTamil: 'சுக்கிரன்',
            startDate: new Date('2027-06-15'),
            endDate: new Date('2028-04-15'),
            durationMonths: 10,
          },
        ],
      },
    ],
  },
  {
    planet: 'Saturn',
    planetTamil: 'சனி',
    startDate: new Date('2041-01-15'),
    endDate: new Date('2060-01-15'),
    durationYears: 19,
    durationMonths: 0,
    status: 'future',
    bhuktiPeriods: [
      {
        planet: 'Saturn',
        planetTamil: 'சனி',
        startDate: new Date('2041-01-15'),
        endDate: new Date('2043-10-15'),
        durationYears: 2,
        durationMonths: 9,
      },
      {
        planet: 'Mercury',
        planetTamil: 'புதன்',
        startDate: new Date('2043-10-15'),
        endDate: new Date('2046-05-15'),
        durationYears: 2,
        durationMonths: 7,
      },
    ],
  },
  {
    planet: 'Mercury',
    planetTamil: 'புதன்',
    startDate: new Date('2060-01-15'),
    endDate: new Date('2079-01-15'),
    durationYears: 17,
    durationMonths: 0,
    status: 'future',
    bhuktiPeriods: [
      {
        planet: 'Mercury',
        planetTamil: 'புதன்',
        startDate: new Date('2060-01-15'),
        endDate: new Date('2062-08-15'),
        durationYears: 2,
        durationMonths: 7,
      },
    ],
  },
];

export default function DashaDisplayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          தாசா புக்தி (Dasha Timeline)
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Vimshottari Dasha Period Display - Vedic Astrology Timeline
        </p>

        {/* Main Content */}
        <div className="mb-12">
          <DashaTable
            dashaPeriods={SAMPLE_DASHA_PERIODS}
            title="Vimshottari Dasha Timeline"
            showAntaraDetails={true}
          />
        </div>

        {/* Information Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* About Dasha */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              About Dasha (தாசா பற்றி)
            </h2>
            <div className="text-sm text-gray-700 space-y-4">
              <p>
                <strong>Dasha</strong> is a planetary period system in Vedic astrology that determines the influence of planets on a person's life throughout their lifetime.
              </p>
              <p>
                The <strong>Vimshottari Dasha</strong> system divides a person's 120-year lifespan into nine periods, each ruled by a planet, starting from the Moon and progressing through Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 mb-2">Key Features:</h3>
                <ul className="text-blue-800 space-y-1 text-xs">
                  <li>• <strong>Mahadasha (தாசா)</strong>: Major period (7-19 years)</li>
                  <li>• <strong>Bhukti (புக்தி)</strong>: Sub-period within Mahadasha</li>
                  <li>• <strong>Antara (அந்தர)</strong>: Sub-period within Bhukti</li>
                  <li>• <strong>Suksma (சுக்ஷ்ம)</strong>: Finest divisions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 9 Planets Dasha */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              The 9 Planets (9 கிரக தாசா)
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Moon', tamil: 'சந்திரன்', years: '10 years' },
                { name: 'Mars', tamil: 'செவ்வாய்', years: '7 years' },
                { name: 'Mercury', tamil: 'புதன்', years: '17 years' },
                { name: 'Jupiter', tamil: 'குரு', years: '16 years' },
                { name: 'Venus', tamil: 'சுக்கிரன்', years: '20 years' },
                { name: 'Saturn', tamil: 'சனி', years: '19 years' },
                { name: 'Rahu', tamil: 'ராகு', years: '18 years' },
                { name: 'Ketu', tamil: 'கேது', years: '7 years' },
              ].map((planet) => (
                <div
                  key={planet.name}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <div>
                    <div className="font-semibold text-gray-800">{planet.name}</div>
                    <div className="text-sm text-gray-600 font-tamil">{planet.tamil}</div>
                  </div>
                  <div className="font-mono text-sm text-orange-600 font-bold">
                    {planet.years}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4 p-3 bg-gray-50 rounded">
              Total: 120 years (complete human lifespan in Vedic astrology)
            </p>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Status Legend (நிலை விளக்கம்)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-gray-400">
              <h3 className="font-bold text-gray-800 mb-2">⭕ Past (முடிந்தது)</h3>
              <p className="text-sm text-gray-700">
                Dasha periods that have already completed. The influence of these planets has already passed.
              </p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-bold text-yellow-900 mb-2">🔵 Current (நிகழ்வு)</h3>
              <p className="text-sm text-gray-700">
                The current active dasha period. This planet is having the strongest influence on your life now.
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h3 className="font-bold text-green-900 mb-2">🟢 Future (பிற்பாடு)</h3>
              <p className="text-sm text-gray-700">
                Upcoming dasha periods. The influence of these planets will manifest in the future.
              </p>
            </div>
          </div>
        </div>

        {/* How to Read */}
        <div className="mt-8 bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-900 mb-4">📖 How to Read This Table</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>
              <strong>Click on any Mahadasha (Major Period)</strong> to expand and see the Bhukti (sub-periods) within it
            </li>
            <li>
              <strong>Click on any Bhukti row</strong> to expand and see the Antara (further sub-periods)
            </li>
            <li>
              <strong>Duration shows</strong> the length of each period (years, months, days)
            </li>
            <li>
              <strong>Status indicator</strong> shows whether the period is past, current, or future
            </li>
            <li>
              <strong>Dates</strong> show the exact start and end dates of each period
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
