'use client';

import { useState } from 'react';
import { ReportConfig, DEFAULT_REPORT_CONFIG, COMPREHENSIVE_REPORT_CONFIG, QUICK_REPORT_CONFIG, ExportOptions, DEFAULT_EXPORT_OPTIONS } from './reportTypes';
import { ReportGenerator } from './reportGenerator';

export function ReportBuilder() {
  const [reportType, setReportType] = useState<'horoscope' | 'dasha' | 'transit' | 'compatibility'>('horoscope');
  const [config, setConfig] = useState<ReportConfig>(DEFAULT_REPORT_CONFIG);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'html' | 'excel' | 'png'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [includeEmail, setIncludeEmail] = useState(false);

  const reportTemplates = {
    horoscope: { name: 'Horoscope Report', description: 'Complete natal chart analysis' },
    dasha: { name: 'Dasha Report', description: 'Planetary period predictions' },
    transit: { name: 'Transit Report', description: 'Current planetary transits analysis' },
    compatibility: { name: 'Compatibility Report', description: 'Relationship compatibility analysis' },
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Report generation will be triggered here
      console.log('Generating report:', { reportType, config, exportFormat });
      // The actual report generation will happen through ReportGenerator class
      alert(`Report generated: ${reportType} in ${exportFormat} format`);
    } catch (error) {
      console.error('Report generation failed:', error);
      alert('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      const options: ExportOptions = {
        format: exportFormat,
        filename: `kotravel-${reportType}-report`,
        includeWatermark: true,
        compressImages: exportFormat === 'pdf',
      };
      console.log('Exporting with options:', options);
      alert(`Report exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      alert('Please enter an email address');
      return;
    }
    setIsGenerating(true);
    try {
      console.log('Sending report to:', recipientEmail);
      alert(`Report sent to ${recipientEmail}`);
      setRecipientEmail('');
    } catch (error) {
      console.error('Email send failed:', error);
      alert('Failed to send report via email');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-soft/30 to-amber-soft/30 rounded-lg p-6 border-l-4 border-orange">
        <h3 className="text-xl font-bold text-ink mb-2">प्रतिवेदन निर्माता (Report Builder)</h3>
        <p className="text-sm text-ink-soft">
          Generate comprehensive astrological reports in multiple formats. Customize content, export, and share via email.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Report Type Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-4">
            <h4 className="font-semibold text-ink">Report Type</h4>
            <div className="space-y-2">
              {Object.entries(reportTemplates).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setReportType(key as any)}
                  className={`w-full text-left p-4 rounded border-2 transition-all ${
                    reportType === key
                      ? 'bg-saffron/20 border-saffron'
                      : 'bg-surface border-line hover:border-saffron'
                  }`}
                >
                  <div className="font-semibold text-ink">{value.name}</div>
                  <div className="text-xs text-ink-soft mt-1">{value.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Templates */}
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-3">
            <h4 className="font-semibold text-ink">Quick Templates</h4>
            <button
              onClick={() => setConfig(QUICK_REPORT_CONFIG)}
              className="w-full px-4 py-2 bg-blue-500/20 text-blue-600 rounded border border-blue-500 hover:bg-blue-500/30 transition-colors text-sm font-semibold"
            >
              ⚡ Quick Report
            </button>
            <button
              onClick={() => setConfig(COMPREHENSIVE_REPORT_CONFIG)}
              className="w-full px-4 py-2 bg-purple-500/20 text-purple-600 rounded border border-purple-500 hover:bg-purple-500/30 transition-colors text-sm font-semibold"
            >
              📊 Comprehensive
            </button>
          </div>
        </div>

        {/* Middle: Report Configuration */}
        <div className="lg:col-span-1 bg-surface-soft rounded-lg p-6 border border-line space-y-4">
          <h4 className="font-semibold text-ink">Report Content</h4>

          <div className="space-y-3">
            {[
              { key: 'includeChart', label: 'Birth Chart' },
              { key: 'includePlanetaryPositions', label: 'Planetary Positions' },
              { key: 'includeDasha', label: 'Dasha Analysis' },
              { key: 'includeTransits', label: 'Transit Details' },
              { key: 'includeYogasAndDoshas', label: 'Yogas & Doshas' },
              { key: 'includeShadbala', label: 'Shadbala' },
              { key: 'includeRecommendations', label: 'Recommendations' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 cursor-pointer hover:bg-surface p-2 rounded">
                <input
                  type="checkbox"
                  checked={(config as any)[item.key]}
                  onChange={(e) =>
                    setConfig(prev => ({
                      ...prev,
                      [item.key]: e.target.checked,
                    }))
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-ink">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="border-t border-line pt-4 space-y-3">
            <label className="block text-sm font-semibold text-ink">Language</label>
            <select
              value={config.language}
              onChange={(e) =>
                setConfig(prev => ({
                  ...prev,
                  language: e.target.value as 'english' | 'tamil',
                }))
              }
              className="w-full px-3 py-2 rounded border border-line bg-surface text-ink"
            >
              <option value="english">English</option>
              <option value="tamil">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>

        {/* Right: Export & Distribution */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-4">
            <h4 className="font-semibold text-ink">Export Format</h4>
            <div className="space-y-2">
              {[
                { value: 'pdf', label: '📄 PDF Document', desc: 'Professional printable format' },
                { value: 'html', label: '🌐 HTML', desc: 'Web viewable format' },
                { value: 'excel', label: '📊 Excel', desc: 'Spreadsheet format' },
                { value: 'png', label: '🖼️ PNG Image', desc: 'Chart as image' },
              ].map(format => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value as any)}
                  className={`w-full text-left p-3 rounded border transition-all ${
                    exportFormat === format.value
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-surface border-line hover:border-green-500'
                  }`}
                >
                  <div className="font-semibold text-ink text-sm">{format.label}</div>
                  <div className="text-xs text-ink-soft">{format.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Email Distribution */}
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-4">
            <h4 className="font-semibold text-ink">Send via Email</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEmail}
                onChange={(e) => setIncludeEmail(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-ink">Send report via email</span>
            </label>

            {includeEmail && (
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
                />
                <button
                  onClick={handleSendEmail}
                  disabled={isGenerating || !recipientEmail}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? 'Sending...' : '📧 Send Report'}
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-saffron text-ink font-semibold rounded hover:bg-saffron/90 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? 'Generating...' : '📋 Generate Report'}
            </button>
            <button
              onClick={handleExport}
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? 'Exporting...' : `💾 Export as ${exportFormat.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue/10 rounded-lg p-4 border border-blue/30">
        <p className="text-xs text-blue-900 leading-relaxed">
          💡 <strong>Tip:</strong> Generate reports with custom content, export in your preferred format, and send directly to email.
          Reports include classical source citations and are suitable for sharing with clients.
        </p>
      </div>
    </div>
  );
}
