'use client';

import { useState, useEffect } from 'react';
import { getChartLibrary, ChartEvent } from '../portal/ChartLibraryManager';

interface ChartAnnotationsDialogProps {
  kind: 'none' | 'notes' | 'events';
  onClose: () => void;
}

interface CurrentChart {
  birthData?: { name?: string };
  selectedChartId?: string;
  savedAt?: number;
  notes?: string;
  events?: ChartEvent[];
  libraryId?: string;
}

function readCurrent(): CurrentChart | null {
  try {
    const raw = localStorage.getItem('kotravel_current_chart');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCurrent(next: CurrentChart) {
  try {
    localStorage.setItem('kotravel_current_chart', JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  // If this working chart is also in the library, keep it in sync
  if (next.libraryId) {
    try {
      getChartLibrary().updateChart(next.libraryId, { notes: next.notes, events: next.events });
    } catch {
      /* not in library / limit — non-fatal */
    }
  }
}

export function ChartAnnotationsDialog({ kind, onClose }: ChartAnnotationsDialogProps) {
  const [current, setCurrent] = useState<CurrentChart | null>(null);
  const [notes, setNotes] = useState('');
  const [events, setEvents] = useState<ChartEvent[]>([]);

  useEffect(() => {
    if (kind === 'none') return;
    const c = readCurrent();
    setCurrent(c);
    setNotes(c?.notes ?? '');
    setEvents(c?.events ?? []);
  }, [kind]);

  if (kind === 'none') return null;

  const chartName = current?.birthData?.name?.trim() || 'this chart';
  const hasChart = !!current?.birthData;

  const save = () => {
    if (!current) return;
    writeCurrent({ ...current, notes, events });
    onClose();
  };

  const addEvent = () => {
    setEvents((e) => [
      ...e,
      { id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, date: '', description: '' },
    ]);
  };
  const updateEvent = (id: string, patch: Partial<ChartEvent>) => {
    setEvents((e) => e.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)));
  };
  const removeEvent = (id: string) => {
    setEvents((e) => e.filter((ev) => ev.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-line">
          <h2 className="text-lg font-bold text-ink">
            {kind === 'notes' ? 'Chart Notes' : 'Life Events'}
            <span className="text-ink-soft font-normal text-sm"> — {chartName}</span>
          </h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink text-xl font-bold" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {!hasChart ? (
            <p className="text-ink-soft text-center py-10">
              No chart is open. Calculate a chart on the report page first (File → New Chart).
            </p>
          ) : kind === 'notes' ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={12}
              placeholder="Observations, interpretation notes, questions to research…"
              className="w-full px-3 py-2 text-sm bg-surface-soft border border-line rounded resize-y text-ink"
            />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-ink-soft">
                Record dated life events to correlate with dashas and transits.
              </p>
              {events.length === 0 && (
                <p className="text-ink-soft text-sm">No events yet.</p>
              )}
              {events.map((ev) => (
                <div key={ev.id} className="flex gap-2 items-start">
                  <input
                    type="date"
                    value={ev.date}
                    onChange={(e) => updateEvent(ev.id, { date: e.target.value })}
                    className="px-2 py-1 text-sm bg-surface-soft border border-line rounded text-ink"
                  />
                  <input
                    type="text"
                    value={ev.description}
                    onChange={(e) => updateEvent(ev.id, { description: e.target.value })}
                    placeholder="e.g. Marriage, job change, relocation"
                    className="flex-1 px-2 py-1 text-sm bg-surface-soft border border-line rounded text-ink"
                  />
                  <button
                    onClick={() => removeEvent(ev.id)}
                    className="text-xs text-rose hover:underline mt-1.5 flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addEvent}
                className="px-3 py-1 text-sm bg-surface-soft border border-line rounded hover:bg-saffron/10 text-ink"
              >
                + Add event
              </button>
            </div>
          )}
        </div>

        {hasChart && (
          <div className="p-4 border-t border-line flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-1.5 text-sm border border-line rounded text-ink hover:bg-surface-soft">
              Cancel
            </button>
            <button onClick={save} className="px-4 py-1.5 text-sm bg-saffron text-white rounded hover:bg-saffron/90">
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
