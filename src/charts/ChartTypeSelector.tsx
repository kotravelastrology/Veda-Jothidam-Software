'use client';

import { useState } from 'react';
import { CHART_TYPES, getChartsByCategory, type ChartType, type ChartCategory } from './chartTypes';

interface ChartTypeSelectorProps {
  selectedChartId?: string;
  onChartSelect: (chartId: string) => void;
}

const CATEGORIES: { value: ChartCategory; label: string; labelTamil: string }[] = [
  { value: 'standard', label: 'Standard Charts', labelTamil: 'சிறப்பு அட்டவணைகள்' },
  { value: 'divisional', label: 'Divisional Charts', labelTamil: 'வர்க்க அட்டவணைகள்' },
  { value: 'dasha', label: 'Dasha Charts', labelTamil: 'தசா அட்டவணைகள்' },
  { value: 'analysis', label: 'Analysis Charts', labelTamil: 'பகுப்பாய்வு அட்டவணைகள்' },
];

export function ChartTypeSelector({ selectedChartId, onChartSelect }: ChartTypeSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<ChartCategory>('standard');
  const chartsInCategory = getChartsByCategory(activeCategory);

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeCategory === cat.value
                ? 'bg-saffron text-ink'
                : 'bg-surface text-ink-soft hover:text-ink border border-line'
            }`}
          >
            <div className="text-sm">{cat.label}</div>
            <div className="text-xs font-normal">{cat.labelTamil}</div>
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {chartsInCategory.map((chart) => (
          <button
            key={chart.id}
            onClick={() => onChartSelect(chart.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedChartId === chart.id
                ? 'border-saffron bg-saffron/10'
                : 'border-line bg-surface hover:border-saffron/50 hover:bg-saffron/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{chart.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-ink">{chart.label}</div>
                <div className="text-sm text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                  {chart.labelTamil}
                </div>
                <div className="text-xs text-ink-soft/70 mt-1">{chart.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
