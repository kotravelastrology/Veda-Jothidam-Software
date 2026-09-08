'use client';

import { useState } from 'react';

interface ChartData {
  lagna: string;
  moon: string;
  sun: string;
  planets: Record<string, string>;
}

interface MobileChartViewerProps {
  chart?: ChartData;
  chartType?: 'rasi' | 'navamsha' | 'dasamsha';
  enableZoom?: boolean;
  enableSwipe?: boolean;
}

/**
 * Mobile-optimized chart viewer with touch gestures
 */
export function MobileChartViewer({
  chart,
  chartType = 'rasi',
  enableZoom = true,
  enableSwipe = true,
}: MobileChartViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // Default chart data
  const defaultChart: ChartData = {
    lagna: 'Taurus 12°',
    moon: 'Libra 25°',
    sun: 'Leo 15°',
    planets: {
      Mercury: 'Gemini 8°',
      Venus: 'Cancer 20°',
      Mars: 'Scorpio 18°',
      Jupiter: 'Sagittarius 22°',
      Saturn: 'Capricorn 14°',
    },
  };

  const displayChart = chart || defaultChart;

  // Handle pinch zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!enableZoom) return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  // Handle touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipe || !touchStart || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - touchStart.x;
    if (Math.abs(deltaX) > 50) {
      // Rotate chart on horizontal swipe
      setRotation(prev => (prev + (deltaX > 0 ? 30 : -30)) % 360);
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <div className="space-y-4">
      {/* Chart Container */}
      <div className="relative bg-surface-soft rounded-lg p-4 border border-line overflow-hidden touch-none">
        {/* Chart Viewer */}
        <div
          className="flex items-center justify-center bg-white rounded-lg p-4 aspect-square overflow-hidden"
          style={{
            perspective: '1000px',
          }}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Actual Chart SVG - Simplified 9-box chart */}
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full"
            style={{
              transform: `scale(${scale}) rotateZ(${rotation}deg)`,
              transformOrigin: 'center',
              transition: 'transform 0.2s ease-out',
            }}
          >
            {/* Chart Grid (3x3 boxes) */}
            <g className="stroke-gray-300 stroke-1">
              {/* Vertical lines */}
              <line x1="100" y1="0" x2="100" y2="300" />
              <line x1="200" y1="0" x2="200" y2="300" />

              {/* Horizontal lines */}
              <line x1="0" y1="100" x2="300" y2="100" />
              <line x1="0" y1="200" x2="300" y2="200" />

              {/* Outer border */}
              <rect x="0" y="0" width="300" height="300" fill="none" stroke="black" strokeWidth="2" />
            </g>

            {/* House Labels */}
            <text x="50" y="30" textAnchor="middle" className="text-xs font-bold fill-gray-600">
              12
            </text>
            <text x="150" y="30" textAnchor="middle" className="text-xs font-bold fill-gray-600">
              1
            </text>
            <text x="250" y="30" textAnchor="middle" className="text-xs font-bold fill-gray-600">
              2
            </text>
            <text x="280" y="150" textAnchor="middle" className="text-xs font-bold fill-gray-600">
              3
            </text>
            <text x="250" y="280" textAnchor="middle" className="text-xs font-bold fill-gray-600">
              4
            </text>
            <text x="150" y="290" textAnchor="middle" className="text-xs font-bold fill-gray-600">
              5
            </text>
            <text x="50" y="280" textAnchor="middle" className="text-xs font-bold fill-gray-600">
              6
            </text>
            <text x="20" y="150" textAnchor="middle" className="text-xs font-bold fill-gray-600">
              9
            </text>
            <text x="50" y="30" textAnchor="middle" className="text-xs font-bold fill-gray-600">
              11
            </text>
            <text x="150" y="150" textAnchor="middle" className="text-sm font-bold fill-saffron">
              Lagna
            </text>

            {/* Planet Positions (simplified) */}
            <circle cx="150" cy="50" r="6" className="fill-saffron" />
            <text x="150" y="70" textAnchor="middle" className="text-xs font-semibold">
              ♈
            </text>

            <circle cx="250" cy="150" r="6" className="fill-blue-500" />
            <text x="270" y="155" className="text-xs font-semibold">
              ♀
            </text>

            <circle cx="150" cy="250" r="6" className="fill-red-500" />
            <text x="150" y="270" textAnchor="middle" className="text-xs font-semibold">
              ♂
            </text>

            <circle cx="50" cy="150" r="6" className="fill-green-500" />
            <text x="30" y="155" className="text-xs font-semibold">
              ♃
            </text>
          </svg>
        </div>

        {/* Chart Info */}
        <div className="mt-2 text-center text-xs text-ink-soft">
          {chartType === 'rasi' && 'Rasi Chart (D-1)'}
          {chartType === 'navamsha' && 'Navamsha Chart (D-9)'}
          {chartType === 'dasamsha' && 'Dasamsha Chart (D-10)'}
        </div>
      </div>

      {/* Quick Info Panel */}
      <div className="bg-surface-soft rounded-lg p-4 border border-line space-y-3">
        <h4 className="font-semibold text-ink text-sm">Chart Overview</h4>

        <div className="space-y-2">
          {/* Lagna */}
          <button
            onClick={() => setActiveInfo(activeInfo === 'lagna' ? null : 'lagna')}
            className={`w-full text-left p-3 rounded border transition-all text-sm ${
              activeInfo === 'lagna'
                ? 'bg-saffron/20 border-saffron'
                : 'bg-surface border-line'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-ink">Lagna</span>
              <span className="text-ink-soft">{displayChart.lagna}</span>
            </div>
            {activeInfo === 'lagna' && (
              <p className="text-xs text-ink-soft mt-2">
                Ascending sign at birth time. Represents personality and life path.
              </p>
            )}
          </button>

          {/* Moon Sign */}
          <button
            onClick={() => setActiveInfo(activeInfo === 'moon' ? null : 'moon')}
            className={`w-full text-left p-3 rounded border transition-all text-sm ${
              activeInfo === 'moon'
                ? 'bg-blue/20 border-blue'
                : 'bg-surface border-line'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-ink">Moon</span>
              <span className="text-ink-soft">{displayChart.moon}</span>
            </div>
            {activeInfo === 'moon' && (
              <p className="text-xs text-ink-soft mt-2">
                Emotional nature and inner mind. Rules the 4th house naturally.
              </p>
            )}
          </button>

          {/* Sun Sign */}
          <button
            onClick={() => setActiveInfo(activeInfo === 'sun' ? null : 'sun')}
            className={`w-full text-left p-3 rounded border transition-all text-sm ${
              activeInfo === 'sun'
                ? 'bg-yellow-200/50 border-yellow-400'
                : 'bg-surface border-line'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-ink">Sun</span>
              <span className="text-ink-soft">{displayChart.sun}</span>
            </div>
            {activeInfo === 'sun' && (
              <p className="text-xs text-ink-soft mt-2">
                Life force and consciousness. Rules the 5th house naturally.
              </p>
            )}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 bg-surface-soft rounded-lg p-4 border border-line">
        {enableZoom && (
          <>
            <button
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}
              className="flex-1 px-3 py-2 bg-surface border border-line rounded hover:bg-line transition-colors text-sm font-semibold"
            >
              🔍− Zoom Out
            </button>
            <button
              onClick={() => setScale(1)}
              className="flex-1 px-3 py-2 bg-surface border border-line rounded hover:bg-line transition-colors text-sm font-semibold"
            >
              Reset
            </button>
            <button
              onClick={() => setScale(prev => Math.min(3, prev + 0.2))}
              className="flex-1 px-3 py-2 bg-surface border border-line rounded hover:bg-line transition-colors text-sm font-semibold"
            >
              🔍+ Zoom In
            </button>
          </>
        )}
      </div>

      {/* Touch Tips */}
      {enableSwipe && (
        <div className="bg-blue/10 rounded-lg p-3 text-xs text-blue-900 border border-blue/20">
          💡 <strong>Touch Tips:</strong> Swipe horizontally to rotate • Pinch to zoom • Tap houses for details
        </div>
      )}
    </div>
  );
}
