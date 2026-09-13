'use client';

/**
 * DashaTable Component - Vimshottari Dasha Period Display
 *
 * Displays hierarchical dasha periods:
 * - Mahadasha (major 9-year periods)
 * - Bhukti (sub-periods within mahadasha)
 * - Antara (sub-sub-periods within bhukti)
 * - Suksma (finest divisions)
 */

import React, { useState, useMemo } from 'react';

interface SukshmaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
}

interface AntaraPeriod {
  planet: string;
  planetTamil?: string;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  sukshmaPeriods?: SukshmaPeriod[];
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

interface DashaTableProps {
  dashaPeriods: DashaPeriod[];
  title?: string;
  showAntaraDetails?: boolean;
}

const TAMIL_PLANET_NAMES: Record<string, string> = {
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

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const getDurationString = (years: number = 0, months: number = 0, days: number = 0): string => {
  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  if (days > 0) parts.push(`${days}d`);
  return parts.join(' ') || '0d';
};

const getStatusColor = (status: string): { bg: string; badge: string; text: string } => {
  switch (status) {
    case 'past':
      return { bg: 'bg-gray-50', badge: 'bg-gray-300 text-gray-800', text: '⭕ கடந்தது' };
    case 'current':
      return { bg: 'bg-yellow-50', badge: 'bg-yellow-400 text-gray-900', text: '🔵 நிகழ்வு' };
    case 'future':
      return { bg: 'bg-green-50', badge: 'bg-green-400 text-gray-900', text: '🟢 பிற்பாடு' };
    default:
      return { bg: '', badge: '', text: '' };
  }
};

export default function DashaTable({
  dashaPeriods,
  title = 'Vimshottari Dasha Timeline',
  showAntaraDetails = true,
}: DashaTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (rowKey: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowKey)) {
      newExpanded.delete(rowKey);
    } else {
      newExpanded.add(rowKey);
    }
    setExpandedRows(newExpanded);
  };

  const currentDate = new Date();

  const enrichedDashas = useMemo(() => {
    return dashaPeriods.map((dasha) => ({
      ...dasha,
      planetTamil: dasha.planetTamil || TAMIL_PLANET_NAMES[dasha.planet] || dasha.planet,
    }));
  }, [dashaPeriods]);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      {title && (
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>
          <p className="text-orange-100 text-sm mt-1">
            தாசாபுக்தి கால தொடர் (Mahadasha • Bhukti • Antara • Suksma)
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left font-semibold text-gray-800 w-32">
                தாசா (Dasha)
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-800 w-32">
                தொடக்க நாள் (Start)
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-800 w-32">
                முடிவு நாள் (End)
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-800 w-28">
                கால ஆயுதம் (Duration)
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-800 w-24">
                நிலை (Status)
              </th>
            </tr>
          </thead>

          <tbody>
            {enrichedDashas.map((dasha, dashaIdx) => {
              const dashaKey = `dasha-${dashaIdx}`;
              const isExpanded = expandedRows.has(dashaKey);
              const colors = getStatusColor(dasha.status);

              return (
                <React.Fragment key={dashaKey}>
                  {/* Main Dasha Row */}
                  <tr
                    className={`${colors.bg} border-b border-gray-200 hover:bg-orange-50 cursor-pointer transition`}
                    onClick={() => toggleRow(dashaKey)}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      <span className="inline-block mr-2 text-orange-600 font-bold">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      <span>{dasha.planetTamil}</span>
                      <span className="text-gray-600 ml-2 text-xs">({dasha.planet})</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(dasha.startDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(dasha.endDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-mono">
                      {getDurationString(dasha.durationYears, dasha.durationMonths, dasha.durationDays)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                        {colors.text}
                      </span>
                    </td>
                  </tr>

                  {/* Bhukti Sub-rows */}
                  {isExpanded && dasha.bhuktiPeriods && (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <table className="w-full">
                          <tbody>
                            {dasha.bhuktiPeriods.map((bhukti, bhuktiIdx) => {
                              const bhuktiKey = `${dashaKey}-bhukti-${bhuktiIdx}`;
                              const bhuktiExpanded = expandedRows.has(bhuktiKey);

                              return (
                                <React.Fragment key={bhuktiKey}>
                                  {/* Bhukti Row */}
                                  <tr
                                    className="bg-orange-50 border-b border-gray-200 hover:bg-orange-100 cursor-pointer transition"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleRow(bhuktiKey);
                                    }}
                                  >
                                    <td className="px-4 py-2 pl-8 text-gray-900 font-medium">
                                      <span className="inline-block mr-2 text-orange-600">
                                        {bhuktiExpanded ? '▼' : '▶'}
                                      </span>
                                      <span className="text-orange-700">└─ भुक्ति:</span>
                                      <span className="ml-2">{bhukti.planetTamil || TAMIL_PLANET_NAMES[bhukti.planet] || bhukti.planet}</span>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                      {formatDate(bhukti.startDate)}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                      {formatDate(bhukti.endDate)}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700 font-mono">
                                      {getDurationString(bhukti.durationYears, bhukti.durationMonths)}
                                    </td>
                                    <td className="px-4 py-2"></td>
                                  </tr>

                                  {/* Antara Sub-rows */}
                                  {bhuktiExpanded && bhukti.antaraPeriods && showAntaraDetails && (
                                    <tr>
                                      <td colSpan={5} className="p-0 bg-gray-50">
                                        <table className="w-full">
                                          <tbody>
                                            {bhukti.antaraPeriods.map((antara, antaraIdx) => (
                                              <tr
                                                key={`${bhuktiKey}-antara-${antaraIdx}`}
                                                className="border-b border-gray-200 hover:bg-gray-100 transition"
                                              >
                                                <td className="px-4 py-2 pl-12 text-sm text-gray-800">
                                                  <span className="text-orange-600">└─ अंतर:</span>
                                                  <span className="ml-2">{antara.planetTamil || TAMIL_PLANET_NAMES[antara.planet] || antara.planet}</span>
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                  {formatDate(antara.startDate)}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                  {formatDate(antara.endDate)}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-700 font-mono">
                                                  {getDurationString(0, antara.durationMonths)}
                                                </td>
                                                <td className="px-4 py-2"></td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm">Legend:</h3>
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-700">
          <div>
            <span className="inline-block w-3 h-3 bg-gray-300 rounded mr-2"></span>
            <span>⭕ Past (முடிந்தது)</span>
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-yellow-400 rounded mr-2"></span>
            <span>🔵 Current (நிகழ்வு)</span>
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-green-400 rounded mr-2"></span>
            <span>🟢 Future (பிற்பாடு)</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          Click on Mahadasha or Bhukti rows to expand and view sub-periods
        </p>
      </div>
    </div>
  );
}
