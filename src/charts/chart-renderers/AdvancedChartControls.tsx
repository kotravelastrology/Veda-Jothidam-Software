'use client';

import { useState } from 'react';

interface AdvancedChartControlsProps {
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  onAnimationToggle?: (enabled: boolean) => void;
  onOverlayToggle?: (enabled: boolean) => void;
  chartType?: 'transit' | 'dasha' | 'harmonic' | 'rectification';
}

export function AdvancedChartControls({
  onDateRangeChange,
  onAnimationToggle,
  onOverlayToggle,
  chartType = 'transit',
}: AdvancedChartControlsProps) {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [overlayEnabled, setOverlayEnabled] = useState(false);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const handleAnimationToggle = () => {
    const newState = !animationEnabled;
    setAnimationEnabled(newState);
    onAnimationToggle?.(newState);
  };

  const handleOverlayToggle = () => {
    const newState = !overlayEnabled;
    setOverlayEnabled(newState);
    onOverlayToggle?.(newState);
  };

  const handleDateRangeChange = () => {
    try {
      onDateRangeChange?.(new Date(startDate), new Date(endDate));
    } catch (error) {
      console.error('Invalid date range:', error);
    }
  };

  return (
    <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-ink mb-2">Chart Controls</h3>
        <p className="text-sm text-ink-soft">
          {chartType === 'transit' && 'Adjust transit analysis range and visualization'}
          {chartType === 'dasha' && 'Configure dasha timeline display and animations'}
          {chartType === 'harmonic' && 'Explore harmonic chart series (D1-D60)'}
          {chartType === 'rectification' && 'Fine-tune birth time and adjust chart'}
        </p>
      </div>

      {/* Date Range Control (for Transit/Dasha) */}
      {(chartType === 'transit' || chartType === 'dasha') && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleDateRangeChange}
            className="w-full px-4 py-2 bg-saffron text-ink font-semibold rounded hover:bg-saffron/90 transition-colors"
          >
            Apply Date Range
          </button>
        </div>
      )}

      {/* Rectification Adjustment (for Rectification) */}
      {chartType === 'rectification' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Adjust Birth Time (minutes)
            </label>
            <div className="flex gap-2">
              <input
                type="range"
                min="-120"
                max="120"
                step="5"
                defaultValue="0"
                className="flex-1"
              />
              <span className="text-sm font-semibold text-ink min-w-12">0 min</span>
            </div>
            <p className="text-xs text-ink-soft mt-2">Adjust in 5-minute increments</p>
          </div>
        </div>
      )}

      {/* Display Options */}
      <div className="space-y-3 pt-4 border-t border-line">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-ink">
            {chartType === 'dasha' ? 'Animate Timeline' : 'Enable Animation'}
          </label>
          <button
            onClick={handleAnimationToggle}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              animationEnabled
                ? 'bg-green-500/20 text-green-600 border border-green-500'
                : 'bg-gray-500/20 text-gray-600 border border-gray-500'
            }`}
          >
            {animationEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {chartType !== 'rectification' && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ink">
              {chartType === 'transit' ? 'Overlay with Birth Chart' : 'Show Chart Overlay'}
            </label>
            <button
              onClick={handleOverlayToggle}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                overlayEnabled
                  ? 'bg-blue-500/20 text-blue-600 border border-blue-500'
                  : 'bg-gray-500/20 text-gray-600 border border-gray-500'
              }`}
            >
              {overlayEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-saffron/10 rounded p-4 border border-saffron/30">
        <p className="text-xs text-ink-soft leading-relaxed">
          {chartType === 'transit' &&
            '💡 Tip: Adjust the date range to forecast upcoming planetary transits and their impact.'}
          {chartType === 'dasha' &&
            '💡 Tip: Enable animation to smoothly visualize dasha periods and their transitions.'}
          {chartType === 'harmonic' &&
            '💡 Tip: Explore divisional charts (D2-D60) to gain deeper insight into specific life areas.'}
          {chartType === 'rectification' &&
            '💡 Tip: Fine-tune the birth time by adjusting in small increments until chart matches events.'}
        </p>
      </div>
    </div>
  );
}
