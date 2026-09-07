'use client';

import { useState } from 'react';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tab?: 'help' | 'about' | 'shortcuts';
}

function HelpContent() {
  return (
    <div className="space-y-4">
      <section>
        <h3 className="text-sm font-semibold text-ink mb-2">Getting Started</h3>
        <p className="text-sm text-ink-soft mb-3">
          Kotravel is a comprehensive Vedic astrology software based on classical texts including
          BPHS (Brihat Parashara Hora Shastra) and Saravali.
        </p>
        <ol className="text-sm text-ink-soft space-y-2 list-decimal list-inside">
          <li>Enter birth data (date, time, location) in the Birth Data form</li>
          <li>View your birth chart and divisional charts</li>
          <li>Analyze dasha periods, transits, and compatibility</li>
          <li>Generate detailed reports in various formats</li>
        </ol>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-ink mb-2">Main Features</h3>
        <div className="text-sm text-ink-soft space-y-2">
          <div>
            <strong>Charts:</strong> Rasi, Navamsha, divisional charts (D2, D3, D4, etc.),
            Varga Chakra, and more
          </div>
          <div>
            <strong>Analysis:</strong> Dasha timelines, transits, compatibility analysis,
            Shadbala strength, Ashtakavarga
          </div>
          <div>
            <strong>Reports:</strong> Horoscope, calculations, interpretations, dashas,
            transits, varshaphala
          </div>
          <div>
            <strong>Tools:</strong> Location finder, time zone converter, ayanamsha calculator,
            date converter
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-ink mb-2">Classical References</h3>
        <p className="text-sm text-ink-soft mb-2">
          All calculations are based on established classical texts:
        </p>
        <ul className="text-sm text-ink-soft space-y-1 list-disc list-inside">
          <li>BPHS (Brihat Parashara Hora Shastra)</li>
          <li>Saravali</li>
          <li>Hora Sara</li>
          <li>Phaladeepika</li>
          <li>Jataka Bharana</li>
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-ink mb-2">Need Help?</h3>
        <p className="text-sm text-ink-soft">
          See the Shortcuts tab for keyboard shortcuts, or check the About tab for version
          information and classical source citations.
        </p>
      </section>
    </div>
  );
}

function AboutContent() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-saffron mb-2">Kotravel</div>
        <div className="text-sm text-ink-soft">Vedic Astrology Software</div>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-ink mb-2">Version Information</h3>
        <div className="text-sm text-ink-soft space-y-1">
          <div>Version: <span className="text-saffron font-medium">9.0.0</span></div>
          <div>Release: <span className="text-saffron font-medium">Phase 30.10</span></div>
          <div>Build Date: <span className="text-saffron font-medium">2026-09-07</span></div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-ink mb-2">Classical Sources</h3>
        <div className="space-y-3">
          <div className="text-sm">
            <strong className="text-ink">Brihat Parashara Hora Shastra (BPHS)</strong>
            <p className="text-ink-soft">Ancient Vedic astrology compendium by Parashara Rishi</p>
          </div>
          <div className="text-sm">
            <strong className="text-ink">Saravali</strong>
            <p className="text-ink-soft">Comprehensive work by Kalyana Varma on Vedic astrology</p>
          </div>
          <div className="text-sm">
            <strong className="text-ink">Hora Sara</strong>
            <p className="text-ink-soft">Detailed text on birth chart interpretation and predictions</p>
          </div>
          <div className="text-sm">
            <strong className="text-ink">Phaladeepika</strong>
            <p className="text-ink-soft">Precise work on yogas and their effects by Mantreshwara</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-ink mb-2">Product Information</h3>
        <div className="text-sm text-ink-soft space-y-2">
          <p>
            Kotravel Vedic Astrology is a Tamil-first product designed for accurate calculations
            and classical interpretation of birth charts.
          </p>
          <p>
            The software follows the Parashari and Phaladeepika traditions with support for
            multiple calculation systems.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-ink mb-2">Technical</h3>
        <div className="text-sm text-ink-soft space-y-1">
          <div>Platform: Web Application (React/TypeScript)</div>
          <div>Ephemeris: Swiss Ephemeris</div>
          <div>Calculation Engine: Custom Vedic system</div>
          <div>Accessibility: WCAG 2.1 Level AA</div>
        </div>
      </section>
    </div>
  );
}

function ShortcutsContent() {
  const shortcuts = [
    { keys: 'Ctrl+N', action: 'New Chart' },
    { keys: 'Ctrl+O', action: 'Open Chart' },
    { keys: 'Ctrl+S', action: 'Save Chart' },
    { keys: 'Ctrl+P', action: 'Print' },
    { keys: 'Ctrl+Q', action: 'Exit' },
    { keys: 'Ctrl+H', action: 'Help' },
    { keys: 'Ctrl+,', action: 'Settings' },
    { keys: 'Ctrl+T', action: 'Tools' },
    { keys: 'Alt+1', action: 'Birth Chart (Rasi)' },
    { keys: 'Alt+2', action: 'Navamsha (D9)' },
    { keys: 'Alt+3', action: 'Divisional Charts' },
    { keys: 'Alt+D', action: 'Dasha Timeline' },
    { keys: 'Alt+T', action: 'Transits' },
    { keys: 'Tab', action: 'Next field/element' },
    { keys: 'Shift+Tab', action: 'Previous field/element' },
    { keys: 'Escape', action: 'Close dialog/panel' },
  ];

  return (
    <div className="space-y-4">
      <section>
        <h3 className="text-sm font-semibold text-ink mb-3">File Operations</h3>
        <div className="space-y-2">
          {shortcuts.slice(0, 5).map((sc, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-ink-soft">{sc.action}</span>
              <kbd className="px-2 py-1 bg-ink-soft/20 border border-line rounded text-xs font-mono">
                {sc.keys}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-ink mb-3">Navigation</h3>
        <div className="space-y-2">
          {shortcuts.slice(5, 11).map((sc, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-ink-soft">{sc.action}</span>
              <kbd className="px-2 py-1 bg-ink-soft/20 border border-line rounded text-xs font-mono">
                {sc.keys}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-ink mb-3">General</h3>
        <div className="space-y-2">
          {shortcuts.slice(11).map((sc, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-ink-soft">{sc.action}</span>
              <kbd className="px-2 py-1 bg-ink-soft/20 border border-line rounded text-xs font-mono">
                {sc.keys}
              </kbd>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function HelpPanel({ isOpen, onClose, tab = 'help' }: HelpPanelProps) {
  const [activeTab, setActiveTab] = useState(tab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-surface border border-line rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-line bg-surface">
          <h2 className="text-lg font-bold text-ink">Help & Information</h2>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-3 border-b border-line bg-surface">
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              activeTab === 'help'
                ? 'bg-saffron text-ink'
                : 'bg-ink-soft/10 text-ink hover:bg-ink-soft/20'
            }`}
          >
            Help
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              activeTab === 'about'
                ? 'bg-saffron text-ink'
                : 'bg-ink-soft/10 text-ink hover:bg-ink-soft/20'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              activeTab === 'shortcuts'
                ? 'bg-saffron text-ink'
                : 'bg-ink-soft/10 text-ink hover:bg-ink-soft/20'
            }`}
          >
            Keyboard Shortcuts
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'help' && <HelpContent />}
          {activeTab === 'about' && <AboutContent />}
          {activeTab === 'shortcuts' && <ShortcutsContent />}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-line bg-surface">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded bg-saffron text-ink hover:bg-saffron/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
