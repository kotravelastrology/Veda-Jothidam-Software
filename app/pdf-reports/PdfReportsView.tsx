'use client';

import { useState } from 'react';

interface ReportConfig {
  includeChart: boolean;
  includePlanetaryStrengths: boolean;
  includeHouseAnalysis: boolean;
  includeDashaTimeline: boolean;
  includeYogaAnalysis: boolean;
  includePredictions: boolean;
  includeRemedies: boolean;
  includeChartComparison: boolean;
  clientName: string;
  consultantName: string;
  consultationDate: string;
}

export default function PdfReportsView() {
  const [birthData, setBirthData] = useState({
    date: '1990-05-15',
    time: '10:30:00',
    location: 'Chennai, India',
    latitude: '13.0827',
    longitude: '80.2707',
  });

  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    includeChart: true,
    includePlanetaryStrengths: true,
    includeHouseAnalysis: true,
    includeDashaTimeline: true,
    includeYogaAnalysis: true,
    includePredictions: true,
    includeRemedies: true,
    includeChartComparison: false,
    clientName: 'John Doe',
    consultantName: 'Astrologer Name',
    consultationDate: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedFile, setGeneratedFile] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/charts/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthData,
          reportConfig,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedFile(url);

      // Auto-download
      const a = document.createElement('a');
      a.href = url;
      a.download = `astrology-report-${reportConfig.clientName}-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const getTotalSections = (): number => {
    let count = 1; // Birth details always included
    if (reportConfig.includeChart) count++;
    if (reportConfig.includePlanetaryStrengths) count++;
    if (reportConfig.includeHouseAnalysis) count++;
    if (reportConfig.includeDashaTimeline) count++;
    if (reportConfig.includeYogaAnalysis) count++;
    if (reportConfig.includePredictions) count++;
    if (reportConfig.includeRemedies) count++;
    if (reportConfig.includeChartComparison) count++;
    return count;
  };

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          PDF Reports
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          அறிக்கை உருவாக்கம் (Report Generator)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          தனிப்பயன் PDF அறிக்கை உருவாக்க. Create customizable PDF reports for clients.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Birth Data Section */}
          <div className="bg-surface border border-line rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-ink mb-4">பிறப்பு தரவு</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த தேதி</span>
                <input
                  type="date"
                  value={birthData.date}
                  onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த நேரம்</span>
                <input
                  type="time"
                  step="1"
                  value={birthData.time}
                  onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="block text-sm font-medium text-ink-soft mb-2">இடம்</span>
                <input
                  type="text"
                  value={birthData.location}
                  onChange={(e) => setBirthData({ ...birthData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">அட்சரேகை</span>
                <input
                  type="number"
                  step="0.0001"
                  value={birthData.latitude}
                  onChange={(e) => setBirthData({ ...birthData, latitude: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">தீர்க்கரேகை</span>
                <input
                  type="number"
                  step="0.0001"
                  value={birthData.longitude}
                  onChange={(e) => setBirthData({ ...birthData, longitude: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
            </div>
          </div>

          {/* Client Info Section */}
          <div className="bg-surface border border-line rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-ink mb-4">வாடிக்கையாளர் விவரம்</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">Client Name</span>
                <input
                  type="text"
                  value={reportConfig.clientName}
                  onChange={(e) =>
                    setReportConfig({ ...reportConfig, clientName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
              <label>
                <span className="block text-sm font-medium text-ink-soft mb-2">Consultant Name</span>
                <input
                  type="text"
                  value={reportConfig.consultantName}
                  onChange={(e) =>
                    setReportConfig({ ...reportConfig, consultantName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="block text-sm font-medium text-ink-soft mb-2">Consultation Date</span>
                <input
                  type="date"
                  value={reportConfig.consultationDate}
                  onChange={(e) =>
                    setReportConfig({ ...reportConfig, consultationDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </label>
            </div>
          </div>

          {/* Report Sections */}
          <div className="bg-surface border border-line rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-ink mb-4">அறிக்கை பிரிவுகள்</h2>
            <div className="space-y-3">
              {[
                { key: 'includeChart', label: 'Birth Chart (D1)', desc: 'Natal chart wheel' },
                { key: 'includePlanetaryStrengths', label: 'Planetary Strengths', desc: 'Shadbala analysis' },
                { key: 'includeHouseAnalysis', label: 'House Analysis', desc: 'Bhava Bala interpretation' },
                { key: 'includeDashaTimeline', label: 'Dasha Timeline', desc: 'Vimshottari Dasha periods' },
                { key: 'includeYogaAnalysis', label: 'Yoga Analysis', desc: 'Benefic/malefic yogas' },
                { key: 'includePredictions', label: 'Predictions', desc: 'Future period insights' },
                { key: 'includeRemedies', label: 'Remedies', desc: 'Astrological remedies' },
                { key: 'includeChartComparison', label: 'Chart Comparison', desc: 'Synastry (if available)' },
              ].map((section) => (
                <label key={section.key} className="flex items-start gap-3 p-3 rounded-lg hover:bg-info/5 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={reportConfig[section.key as keyof ReportConfig] as boolean}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        [section.key]: e.target.checked,
                      })
                    }
                    className="mt-1 w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">{section.label}</p>
                    <p className="text-xs text-ink-soft">{section.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-rose/10 border border-rose rounded-lg p-4 text-sm text-rose">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={generateReport}
            disabled={loading}
            className="w-full px-4 py-3 bg-saffron text-ink rounded-lg font-semibold disabled:opacity-50 hover:bg-saffron/90 transition"
          >
            {loading ? 'அறிக்கை உருவாக்குகிறது…' : '📄 PDF அறிக்கை உருவாக்கு'}
          </button>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Report Preview */}
          <div className="bg-info/10 border border-info rounded-2xl p-5">
            <h3 className="font-semibold text-info mb-4">📊 Report Summary</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-info/60 uppercase mb-1">Total Sections</p>
                <p className="text-2xl font-bold text-info">{getTotalSections()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-info/60 uppercase mb-1">Est. Pages</p>
                <p className="text-2xl font-bold text-info">{Math.ceil(getTotalSections() * 1.5)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-info/60 uppercase mb-1">Format</p>
                <p className="font-medium text-ink">PDF (A4)</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-green/10 border border-green rounded-2xl p-5">
            <h3 className="font-semibold text-green mb-4">✨ Features</h3>
            <ul className="space-y-2 text-xs text-ink-soft">
              <li className="flex gap-2">
                <span className="text-green">✓</span>
                <span>Professional layout</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green">✓</span>
                <span>Color-coded charts</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green">✓</span>
                <span>Tamil & English text</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green">✓</span>
                <span>Detailed interpretations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green">✓</span>
                <span>High-quality printing</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green">✓</span>
                <span>Client customization</span>
              </li>
            </ul>
          </div>

          {/* Tips */}
          <div className="bg-orange/10 border border-orange rounded-2xl p-5">
            <h3 className="font-semibold text-orange mb-4">💡 Tips</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Select sections most relevant to your client. Complete reports with all sections typically print 8-12 pages.
              Add personal notes or recommendations before sending.
            </p>
          </div>

          {/* Generated Files */}
          {generatedFile && (
            <div className="bg-green/10 border border-green rounded-2xl p-5">
              <h3 className="font-semibold text-green mb-3">✅ Report Generated</h3>
              <a
                href={generatedFile}
                download
                className="block px-3 py-2 bg-green text-white rounded text-center font-medium text-sm hover:bg-green/90 transition"
              >
                📥 Download PDF
              </a>
              <p className="text-xs text-ink-soft mt-2">
                Report has been generated and should start downloading automatically.
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          PDF அறிக்கை உருவாக்கம் — தொழிலாளர் அளவிலான ஆஸ்திர பகுப்பாய்வு அறிக்கை.
          Professional PDF reports for astrology consultations.
        </p>
      </footer>
    </main>
  );
}
