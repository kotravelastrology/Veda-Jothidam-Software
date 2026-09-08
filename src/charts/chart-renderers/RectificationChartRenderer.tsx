'use client';

import { useState } from 'react';
import { RasiChartRenderer } from './RasiChartRenderer';

interface RectificationChartRendererProps {
  report: any;
  onTimeAdjustment?: (adjustedMinutes: number) => void;
}

export function RectificationChartRenderer({
  report,
  onTimeAdjustment,
}: RectificationChartRendererProps) {
  const [adjustedMinutes, setAdjustedMinutes] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const events = [
    { name: 'Birth', time: 'Base Time', verified: true },
    { name: 'First Child Birth', time: 'Known Time', verified: false },
    { name: 'Marriage', time: 'Known Time', verified: false },
    { name: 'Career Start', time: 'Approximate', verified: false },
    { name: 'Major Health Event', time: 'Approximate', verified: false },
  ];

  const handleAdjustment = (minutes: number) => {
    setAdjustedMinutes(minutes);
    onTimeAdjustment?.(minutes);
  };

  const handleEventVerification = (eventName: string) => {
    setSelectedEvent(selectedEvent === eventName ? null : eventName);
  };

  const getDashaRelevance = (eventName: string): string => {
    const dashaInfo: Record<string, string> = {
      'First Child Birth': 'Check Ruling Dasha: 5th House, 5th Lord',
      'Marriage': 'Check Ruling Dasha: 7th House, 7th Lord',
      'Career Start': 'Check Ruling Dasha: 10th House, MC',
      'Major Health Event': 'Check Ruling Dasha: 6th House, Lagna Lord',
    };
    return dashaInfo[eventName] || '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-soft/30 to-amber-soft/30 rounded-lg p-6 border-l-4 border-orange">
        <h3 className="text-xl font-bold text-ink mb-2">जन्म समय सुधार (Birth Time Rectification)</h3>
        <p className="text-sm text-ink-soft">
          Refine your birth time by comparing known life events with Dasha periods. Adjust birth time in 5-minute increments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Chart Display */}
        <div className="space-y-4">
          <div className="bg-surface-soft rounded-lg p-6 border border-line">
            <h4 className="font-semibold text-ink mb-4">Rectified Birth Chart</h4>
            <div className="bg-surface rounded-lg p-4 min-h-96 flex items-center justify-center">
              {report?.chart ? (
                <RasiChartRenderer report={report} />
              ) : (
                <p className="text-ink-soft text-center">Loading chart...</p>
              )}
            </div>
            <div className="mt-4 p-3 bg-saffron/10 rounded border border-saffron/30">
              <p className="text-xs text-ink-soft">
                <strong>Current Adjustment:</strong> {adjustedMinutes > 0 ? '+' : ''}{adjustedMinutes} minutes
              </p>
            </div>
          </div>
        </div>

        {/* Right: Rectification Controls & Events */}
        <div className="space-y-4">
          {/* Time Adjustment Slider */}
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-3">
                Adjust Birth Time (Minutes)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="-120"
                  max="120"
                  step="5"
                  value={adjustedMinutes}
                  onChange={(e) => handleAdjustment(parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="text-center min-w-24">
                  <div className="text-2xl font-bold text-saffron">
                    {adjustedMinutes > 0 ? '+' : ''}{adjustedMinutes}
                  </div>
                  <div className="text-xs text-ink-soft">minutes</div>
                </div>
              </div>
              <p className="text-xs text-ink-soft mt-2">
                Adjust in 5-minute increments. Positive = Later birth time, Negative = Earlier birth time.
              </p>
            </div>
          </div>

          {/* Life Events Verification */}
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-4">
            <h5 className="font-semibold text-ink mb-4">जीवन घटनाएं (Life Events)</h5>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <button
                  key={event.name}
                  onClick={() => handleEventVerification(event.name)}
                  className={`w-full text-left p-3 rounded border transition-all ${
                    selectedEvent === event.name
                      ? 'bg-blue-500/20 border-blue-500'
                      : 'bg-surface border-line hover:border-saffron'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink text-sm">{event.name}</p>
                      <p className="text-xs text-ink-soft">{event.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.verified && <span className="text-green-500 font-bold">✓</span>}
                      <span className="text-xs text-ink-soft">{selectedEvent === event.name ? '▼' : '▶'}</span>
                    </div>
                  </div>

                  {/* Expanded Event Details */}
                  {selectedEvent === event.name && event.name !== 'Birth' && (
                    <div className="mt-3 pt-3 border-t border-line space-y-2">
                      <p className="text-xs text-ink-soft">
                        <strong>Dasha Check:</strong> {getDashaRelevance(event.name)}
                      </p>
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 bg-green-500/20 text-green-600 rounded border border-green-500 hover:bg-green-500/30">
                          ✓ Matches
                        </button>
                        <button className="text-xs px-2 py-1 bg-orange-500/20 text-orange-600 rounded border border-orange-500 hover:bg-orange-500/30">
                          ⚠ Adjust
                        </button>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Rectification Tips */}
          <div className="bg-amber/10 rounded-lg p-4 border border-amber/30 space-y-2">
            <p className="text-xs font-semibold text-amber-900">💡 Rectification Tips:</p>
            <ul className="text-xs text-amber-900 space-y-1">
              <li>• Start with verified events (marriage, child birth)</li>
              <li>• Check if adjusted chart matches event dashas</li>
              <li>• Compare multiple events for accuracy</li>
              <li>• Look for major dasha transitions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
