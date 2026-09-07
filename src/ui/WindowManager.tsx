'use client';

import { useState } from 'react';

export interface ChartWindow {
  id: string;
  title: string;
  chartType: string;
  minimized: boolean;
  active: boolean;
}

interface WindowManagerProps {
  layout: 'single' | 'sidebyside' | 'cascade' | 'tile';
  windows: ChartWindow[];
  onWindowSelect: (id: string) => void;
  onWindowClose: (id: string) => void;
  onWindowMinimize: (id: string) => void;
  onLayoutChange: (layout: 'single' | 'sidebyside' | 'cascade' | 'tile') => void;
}

export function WindowManager({
  layout,
  windows,
  onWindowSelect,
  onWindowClose,
  onWindowMinimize,
  onLayoutChange,
}: WindowManagerProps) {
  const [cascade, setCascade] = useState({ x: 0, y: 0 });

  const activeWindow = windows.find((w) => w.active);
  const visibleWindows = windows.filter((w) => !w.minimized);

  const handleCascade = () => {
    let x = 0,
      y = 0;
    visibleWindows.forEach((w, i) => {
      x = (i * 20) % 200;
      y = (i * 20) % 200;
    });
    setCascade({ x, y });
  };

  const handleTile = () => {
    const cols = Math.ceil(Math.sqrt(visibleWindows.length));
    const rows = Math.ceil(visibleWindows.length / cols);
    // Calculate grid positions for tiling
  };

  return (
    <div className="flex gap-2 p-3 border-b border-line bg-surface">
      {/* Layout buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => onLayoutChange('single')}
          title="Single window"
          className={`px-2 py-1 text-xs rounded transition-colors ${
            layout === 'single'
              ? 'bg-saffron text-ink'
              : 'bg-ink-soft/10 text-ink hover:bg-ink-soft/20'
          }`}
        >
          ⊡
        </button>
        <button
          onClick={() => onLayoutChange('sidebyside')}
          title="Side by side"
          className={`px-2 py-1 text-xs rounded transition-colors ${
            layout === 'sidebyside'
              ? 'bg-saffron text-ink'
              : 'bg-ink-soft/10 text-ink hover:bg-ink-soft/20'
          }`}
        >
          ⊕
        </button>
        <button
          onClick={() => {
            onLayoutChange('cascade');
            handleCascade();
          }}
          title="Cascade"
          className={`px-2 py-1 text-xs rounded transition-colors ${
            layout === 'cascade'
              ? 'bg-saffron text-ink'
              : 'bg-ink-soft/10 text-ink hover:bg-ink-soft/20'
          }`}
        >
          ≣
        </button>
        <button
          onClick={() => {
            onLayoutChange('tile');
            handleTile();
          }}
          title="Tile"
          className={`px-2 py-1 text-xs rounded transition-colors ${
            layout === 'tile' ? 'bg-saffron text-ink' : 'bg-ink-soft/10 text-ink hover:bg-ink-soft/20'
          }`}
        >
          ⊞
        </button>
      </div>

      {/* Window tabs */}
      <div className="flex gap-1 flex-1 overflow-x-auto">
        {windows.map((window) => (
          <div key={window.id} className="flex items-center">
            <button
              onClick={() => onWindowSelect(window.id)}
              className={`px-3 py-1 text-xs rounded-l transition-colors ${
                window.active
                  ? 'bg-saffron text-ink'
                  : 'bg-ink-soft/10 text-ink hover:bg-ink-soft/20'
              } ${window.minimized ? 'opacity-50' : ''}`}
            >
              {window.minimized ? '⊟ ' : ''} {window.title}
            </button>
            <div className="flex gap-1 px-1">
              <button
                onClick={() => onWindowMinimize(window.id)}
                title={window.minimized ? 'Restore' : 'Minimize'}
                className="text-xs px-1 hover:text-saffron transition-colors"
              >
                {window.minimized ? '+' : '_'}
              </button>
              <button
                onClick={() => onWindowClose(window.id)}
                title="Close"
                className="text-xs px-1 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Window count */}
      <div className="text-xs text-ink-soft px-2 py-1 whitespace-nowrap">
        {visibleWindows.length} of {windows.length} windows
      </div>
    </div>
  );
}

// Window state hook
export function useWindowManager() {
  const [windows, setWindows] = useState<ChartWindow[]>([]);
  const [layout, setLayout] = useState<'single' | 'sidebyside' | 'cascade' | 'tile'>('single');

  const addWindow = (chartType: string, title: string) => {
    const id = Date.now().toString();
    setWindows((prev) => [
      ...prev.map((w) => ({ ...w, active: false })),
      {
        id,
        title,
        chartType,
        minimized: false,
        active: true,
      },
    ]);
    return id;
  };

  const removeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const selectWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => ({
        ...w,
        active: w.id === id,
      }))
    );
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, minimized: !w.minimized }
          : { ...w, active: w.minimized ? false : w.active }
      )
    );
  };

  return {
    windows,
    layout,
    setLayout,
    addWindow,
    removeWindow,
    selectWindow,
    minimizeWindow,
  };
}
