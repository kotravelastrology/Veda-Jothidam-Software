'use client';

import { useState, useEffect } from 'react';
import {
  getLaunchChecklist,
  ChecklistCategory,
  ChecklistItem,
  LaunchReadiness,
} from '@/src/deployment/LaunchChecklist';

const CATEGORY_LABELS: Record<ChecklistCategory, string> = {
  infrastructure: '🏗️ Infrastructure',
  security: '🔐 Security',
  performance: '⚡ Performance',
  compliance: '📋 Compliance',
  documentation: '📚 Documentation',
  testing: '🧪 Testing',
  monitoring: '📊 Monitoring',
  business: '💼 Business',
};

export default function LaunchChecklistView() {
  const [readiness, setReadiness] = useState<LaunchReadiness | null>(null);
  const [categoryReadiness, setCategoryReadiness] = useState<Record<string, any>>({});
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [manager] = useState(() => getLaunchChecklist());

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setReadiness(manager.getReadiness());
    setCategoryReadiness(manager.getCategoryReadiness());
    setItems(manager.getAllItems());
  };

  const toggleItem = (item: ChecklistItem) => {
    if (item.isCompleted) {
      manager.reopenItem(item.id);
    } else {
      manager.completeItem(item.id, 'ops-team');
    }
    refresh();
  };

  if (!readiness) {
    return <div className="p-8 text-center text-ink-soft">Loading checklist...</div>;
  }

  const categories = Object.keys(CATEGORY_LABELS) as ChecklistCategory[];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink mb-1">🚀 Launch Readiness Checklist</h1>
        <p className="text-ink-soft text-sm">Phase 45 — Go/No-Go tracker for production launch</p>
      </div>

      {/* Overall Readiness */}
      <div className={`p-6 rounded-lg border-2 ${
        readiness.isReadyForLaunch ? 'bg-green-50 border-green-400' : 'bg-amber-50 border-amber-400'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-semibold text-ink">
            {readiness.isReadyForLaunch ? '✅ Ready for Launch' : '⚠️ Not Ready — Blockers Remain'}
          </span>
          <span className="text-3xl font-bold text-saffron">
            {readiness.readinessPercent.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-white/50 rounded-full h-3 mb-3">
          <div
            className="bg-gradient-to-r from-saffron to-orange-500 h-3 rounded-full transition-all"
            style={{ width: `${readiness.readinessPercent}%` }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><span className="text-ink-soft">Total items:</span> <b>{readiness.totalItems}</b></div>
          <div><span className="text-ink-soft">Completed:</span> <b>{readiness.completedItems}</b></div>
          <div><span className="text-ink-soft">Critical items:</span> <b>{readiness.criticalItems}</b></div>
          <div><span className="text-ink-soft">Critical done:</span> <b>{readiness.criticalCompleted}</b></div>
        </div>
      </div>

      {/* Blockers */}
      {readiness.blockers.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">🚫 {readiness.blockers.length} Launch Blockers (critical, incomplete)</h3>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            {readiness.blockers.map(b => (
              <li key={b.id}>{b.title} <span className="text-red-500">({CATEGORY_LABELS[b.category]})</span></li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map(cat => {
          const stat = categoryReadiness[cat];
          if (!stat) return null;
          return (
            <div key={cat} className="p-3 bg-surface-soft rounded border border-line">
              <p className="text-xs text-ink-soft mb-1">{CATEGORY_LABELS[cat]}</p>
              <p className="text-lg font-bold text-saffron">{stat.completed}/{stat.total}</p>
              <div className="w-full bg-line rounded-full h-1.5 mt-1">
                <div className="bg-saffron h-1.5 rounded-full" style={{ width: `${stat.percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Item List by Category */}
      {categories.map(cat => {
        const catItems = items.filter(i => i.category === cat);
        if (catItems.length === 0) return null;
        return (
          <div key={cat} className="bg-surface-soft rounded-lg border border-line overflow-hidden">
            <div className="px-4 py-3 bg-surface font-semibold text-ink border-b border-line">
              {CATEGORY_LABELS[cat]}
            </div>
            <div className="divide-y divide-line">
              {catItems.map(item => (
                <div key={item.id} className="px-4 py-3 flex items-start gap-3">
                  <button
                    onClick={() => toggleItem(item)}
                    className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center text-xs ${
                      item.isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-line'
                    }`}
                  >
                    {item.isCompleted ? '✓' : ''}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${item.isCompleted ? 'text-ink-soft line-through' : 'text-ink'}`}>
                        {item.title}
                      </span>
                      {item.isCritical && (
                        <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-semibold">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-soft">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
