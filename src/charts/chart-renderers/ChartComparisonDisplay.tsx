'use client';

import React, { useState } from 'react';
import { DualShadBalaComparison } from './DualShadBalaComparison';
import { AspectOverlayRenderer } from './AspectOverlayRenderer';
import { CompatibilityMatrix } from './CompatibilityMatrix';

interface ChartComparisonReport {
  nativeChart: {
    name: string;
    dob: string;
    location: string;
    shadbala?: Record<string, any>;
  };
  comparisonChart: {
    name: string;
    dob: string;
    location: string;
    shadbala?: Record<string, any>;
  };
  comparisonType: 'transit' | 'synastry' | 'varshaphala' | 'historical';
  compatibilityScore?: number;
  analysisDate?: string;
}

type ComparisonTab = 'shadbala' | 'aspects' | 'compatibility' | 'dasha' | 'insights';

export function ChartComparisonDisplay({ report }: { report: ChartComparisonReport }) {
  const [activeTab, setActiveTab] = useState<ComparisonTab>('shadbala');

  const tabs: { id: ComparisonTab; label: string; icon: string }[] = [
    { id: 'shadbala', label: 'Strength Comparison', icon: '⚖️' },
    { id: 'aspects', label: 'Aspect Overlays', icon: '🔄' },
    { id: 'compatibility', label: 'Compatibility', icon: '💫' },
    { id: 'dasha', label: 'Dasha Overlap', icon: '📅' },
    { id: 'insights', label: 'Insights', icon: '💡' },
  ];

  return (
    <div className="space-y-6">
      {/* Comparison Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Chart Comparison</h2>
          <div className="text-right">
            <p className="text-indigo-100 text-sm">Analysis Date: {report.analysisDate || new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <p className="text-indigo-100">
          {report.nativeChart.name} ⇄ {report.comparisonChart.name}
        </p>
      </div>

      {/* Chart Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Native Chart Card */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-2">Native Chart</p>
          <p className="text-xl font-bold text-ink mb-3">{report.nativeChart.name}</p>
          <div className="space-y-2 text-sm text-ink-soft">
            <p>📅 DOB: {report.nativeChart.dob}</p>
            <p>📍 Location: {report.nativeChart.location}</p>
          </div>
        </div>

        {/* Comparison Chart Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase mb-2">
            {getComparisonTypeLabel(report.comparisonType)}
          </p>
          <p className="text-xl font-bold text-ink mb-3">{report.comparisonChart.name}</p>
          <div className="space-y-2 text-sm text-ink-soft">
            <p>📅 DOB: {report.comparisonChart.dob}</p>
            <p>📍 Location: {report.comparisonChart.location}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-line overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'shadbala' && (
          <DualShadBalaComparison
            report={{
              nativeChart: report.nativeChart,
              comparisonChart: report.comparisonChart,
              comparisonType: report.comparisonType,
            }}
          />
        )}

        {activeTab === 'aspects' && (
          <AspectOverlayRenderer
            report={{
              nativeChart: { name: report.nativeChart.name, planets: report.nativeChart as any },
              comparisonChart: { name: report.comparisonChart.name, planets: report.comparisonChart as any },
              aspects: report.aspects || [],
              comparisonType: report.comparisonType,
            }}
          />
        )}

        {activeTab === 'compatibility' && (
          <CompatibilityMatrix
            report={{
              chart1: { name: report.nativeChart.name, rashi: 0, nakshatra: 0, nakshataraFootName: '', moon: { sign: 0, degree: 0 } },
              chart2: { name: report.comparisonChart.name, rashi: 0, nakshatra: 0, nakshataraFootName: '', moon: { sign: 0, degree: 0 } },
            }}
          />
        )}

        {activeTab === 'dasha' && (
          <div className="bg-surface border border-line rounded-lg p-6">
            <h3 className="text-xl font-semibold text-ink mb-4">Dasha Period Overlap</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-ink-soft">
                  Timeline comparison showing Dasha/Bhukti periods for both natives,
                  identifying concurrent periods and their combined strength.
                </p>
              </div>
              <div className="text-center py-8 text-ink-soft">
                <p className="mb-2">📅 Dasha Timeline Comparison</p>
                <p className="text-sm">Coming in Phase 30.9.3</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="bg-surface border border-line rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-ink mb-4">Comparison Insights</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">✓ Harmonious Aspects</p>
                <p className="text-sm text-ink-soft">Areas of strength and compatibility</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">⚠️ Challenging Aspects</p>
                <p className="text-sm text-ink-soft">Areas requiring attention and understanding</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-ink-soft">
                Detailed interpretations of:
              </p>
              <ul className="text-sm text-ink-soft list-disc list-inside mt-2 space-y-1">
                <li>Planetary strength differentials</li>
                <li>Aspect configuration impact</li>
                <li>Dasha period predictions</li>
                <li>Growth and challenge periods</li>
                <li>Remedial suggestions</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Classical Reference */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-ink-soft">
          <strong>Sources:</strong> BPHS Ch.27 (Shadbala), Ch.39 (Synastry), Hora Sara Ch.34 (Varshaphala)
        </p>
      </div>
    </div>
  );
}

function getComparisonTypeLabel(type: string): string {
  const labels = {
    transit: 'Current Transits',
    synastry: 'Partner Chart',
    varshaphala: 'Annual Chart',
    historical: 'Historical Chart',
  };
  return labels[type as keyof typeof labels] || type;
}
