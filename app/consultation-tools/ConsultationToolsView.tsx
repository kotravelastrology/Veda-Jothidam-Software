'use client';

import { useState } from 'react';

export default function ConsultationToolsView() {
  const [activeTab, setActiveTab] = useState<'notes' | 'recommendations' | 'remedies'>('notes');
  const [consultation, setConsultation] = useState({
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    duration: '30',
    consultationNotes: '',
    recommendations: '',
    remedies: '',
    followUpDate: '',
  });

  const [savedConsultations, setSavedConsultations] = useState<typeof consultation[]>([]);

  const handleSave = () => {
    if (consultation.clientName && consultation.consultationNotes) {
      setSavedConsultations([...savedConsultations, { ...consultation }]);
      setConsultation({
        clientName: '',
        date: new Date().toISOString().split('T')[0],
        duration: '30',
        consultationNotes: '',
        recommendations: '',
        remedies: '',
        followUpDate: '',
      });
    }
  };

  const handleDelete = (index: number) => {
    setSavedConsultations(savedConsultations.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Consultation Tools
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          ஆலோசனை கருவிகள் (Consultation Tools)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          ஆலோசனை குறிப்பு மற்றும் பரிந்துரைகள் பதிவு. Record consultation notes and recommendations.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <div className="bg-surface border border-line rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-ink mb-4">ஆலோசனை விவரம்</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">Client Name *</span>
                <input
                  type="text"
                  value={consultation.clientName}
                  onChange={(e) => setConsultation({ ...consultation, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">Consultation Date</span>
                <input
                  type="date"
                  value={consultation.date}
                  onChange={(e) => setConsultation({ ...consultation, date: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">Duration (minutes)</span>
                <input
                  type="number"
                  value={consultation.duration}
                  onChange={(e) => setConsultation({ ...consultation, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">Follow-up Date</span>
                <input
                  type="date"
                  value={consultation.followUpDate}
                  onChange={(e) => setConsultation({ ...consultation, followUpDate: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-surface border border-line rounded-2xl">
            <div className="flex border-b border-line">
              {(['notes', 'recommendations', 'remedies'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 font-medium transition border-b-2 ${
                    activeTab === tab
                      ? 'border-saffron text-saffron'
                      : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  {tab === 'notes' && '📝 Consultation Notes'}
                  {tab === 'recommendations' && '💡 Recommendations'}
                  {tab === 'remedies' && '✨ Remedies'}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === 'notes' && (
                <div>
                  <label>
                    <span className="block text-sm font-medium text-ink-soft mb-2">Consultation Notes *</span>
                    <textarea
                      value={consultation.consultationNotes}
                      onChange={(e) =>
                        setConsultation({ ...consultation, consultationNotes: e.target.value })
                      }
                      rows={6}
                      placeholder="Record key points from consultation, client concerns, chart observations..."
                      className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                    />
                  </label>
                  <p className="text-xs text-ink-soft/60 mt-2">
                    💡 Tip: Note significant planetary placements, current dasha effects, and client questions.
                  </p>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div>
                  <label>
                    <span className="block text-sm font-medium text-ink-soft mb-2">Recommendations</span>
                    <textarea
                      value={consultation.recommendations}
                      onChange={(e) =>
                        setConsultation({ ...consultation, recommendations: e.target.value })
                      }
                      rows={6}
                      placeholder="Suggest follow-up actions, lifestyle changes, timing for important decisions..."
                      className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                    />
                  </label>
                  <p className="text-xs text-ink-soft/60 mt-2">
                    💡 Tip: Include specific recommendations based on dasha timing and planetary strengths.
                  </p>
                </div>
              )}

              {activeTab === 'remedies' && (
                <div>
                  <label>
                    <span className="block text-sm font-medium text-ink-soft mb-2">Astrological Remedies</span>
                    <textarea
                      value={consultation.remedies}
                      onChange={(e) => setConsultation({ ...consultation, remedies: e.target.value })}
                      rows={6}
                      placeholder="Recommend mantras, gemstones, rituals, charity suggestions, puja timing..."
                      className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                    />
                  </label>
                  <p className="text-xs text-ink-soft/60 mt-2">
                    💡 Tip: Provide remedies aligned with weak planets and benefic yogas.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full px-4 py-3 bg-saffron text-ink rounded-lg font-semibold hover:bg-saffron/90 transition"
          >
            💾 Save Consultation
          </button>
        </div>

        {/* Side Panel - Consultation History */}
        <div className="bg-surface border border-line rounded-2xl p-5 h-fit">
          <h3 className="font-semibold text-ink mb-4">📋 Consultation History</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedConsultations.length > 0 ? (
              savedConsultations.map((cons, index) => (
                <div key={index} className="p-3 bg-info/5 border border-info/20 rounded">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-ink text-sm">{cons.clientName}</p>
                      <p className="text-xs text-ink-soft">{cons.date}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-rose hover:text-rose/80 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex gap-2 text-xs text-ink-soft/60 flex-wrap">
                    <span>⏱ {cons.duration}m</span>
                    {cons.followUpDate && <span>📅 Follow: {cons.followUpDate}</span>}
                  </div>
                  <p className="text-xs text-ink-soft mt-2 line-clamp-2">{cons.consultationNotes}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-ink-soft text-center py-6">No consultations saved yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <div className="bg-green/10 border border-green rounded-lg p-4">
          <p className="text-sm font-semibold text-green mb-2">✓ Best Practices</p>
          <ul className="text-xs text-ink-soft space-y-1 list-disc list-inside">
            <li>Always record current dasha/antardasha</li>
            <li>Note transit effects</li>
            <li>Reference chart weaknesses</li>
            <li>Suggest timeline for actions</li>
          </ul>
        </div>
        <div className="bg-info/10 border border-info rounded-lg p-4">
          <p className="text-sm font-semibold text-info mb-2">📊 Follow-up Tips</p>
          <ul className="text-xs text-ink-soft space-y-1 list-disc list-inside">
            <li>Schedule 3-6 month review</li>
            <li>Check dasha change timing</li>
            <li>Verify remedy compliance</li>
            <li>Assess life changes</li>
          </ul>
        </div>
        <div className="bg-orange/10 border border-orange rounded-lg p-4">
          <p className="text-sm font-semibold text-orange mb-2">🎯 Key Areas</p>
          <ul className="text-xs text-ink-soft space-y-1 list-disc list-inside">
            <li>Career & finances</li>
            <li>Marriage & relationships</li>
            <li>Health & longevity</li>
            <li>Spiritual growth</li>
          </ul>
        </div>
      </div>

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          ஆலோசனை கருவிகள் — ஒவ்வொரு ஆலோசனையின் முக்கிய புள்ளிகள் பதிவு செய்யவும் மற்றும் ஈவாலுவேட் செய்யவும்.
        </p>
      </footer>
    </main>
  );
}
