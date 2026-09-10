'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getChartLibrary, SavedChart } from '../portal/ChartLibraryManager';

interface OpenChartDialogProps {
  isOpen: boolean;
  mode: 'all' | 'recent';
  onClose: () => void;
}

export function OpenChartDialog({ isOpen, mode, onClose }: OpenChartDialogProps) {
  const router = useRouter();
  const [charts, setCharts] = useState<SavedChart[]>([]);

  const refresh = useCallback(() => {
    const all = getChartLibrary().getAllCharts(); // already sorted newest-first
    setCharts(mode === 'recent' ? all.slice(0, 5) : all);
  }, [mode]);

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen, refresh]);

  if (!isOpen) return null;

  const openChart = (id: string) => {
    onClose();
    router.push(`/report?load=${encodeURIComponent(id)}`);
  };

  const removeChart = (id: string) => {
    if (!confirm('Delete this saved chart? This cannot be undone.')) return;
    getChartLibrary().deleteChart(id);
    refresh();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-line">
          <h2 className="text-lg font-bold text-ink">
            {mode === 'recent' ? 'Recent Charts' : 'Open Chart'}
          </h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink text-xl font-bold" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {charts.length === 0 ? (
            <p className="text-ink-soft text-center py-10">
              No saved charts yet. Calculate a chart, then use File → Save.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {charts.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <button
                    onClick={() => openChart(c.id)}
                    className="flex-1 text-left hover:bg-saffron/5 rounded px-2 py-1 -mx-2 transition-colors"
                  >
                    <div className="font-semibold text-ink">{c.name || 'Untitled chart'}</div>
                    <div className="text-sm text-ink-soft">
                      {c.birthData.dateOfBirth} {c.birthData.timeOfBirth}
                      {c.birthData.place ? ` · ${c.birthData.place}` : ''}
                    </div>
                    <div className="text-xs text-ink-soft/70">
                      Saved {new Date(c.updatedAt).toLocaleString()}
                    </div>
                  </button>
                  <button
                    onClick={() => removeChart(c.id)}
                    className="text-xs text-rose hover:underline flex-shrink-0"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
