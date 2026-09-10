'use client';

import { useState, useEffect } from 'react';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  language: 'en' | 'ta';
  ayanamsha: 'lahiri' | 'raman' | 'krishnamurti' | 'truecitra';
  houseSystem: 'porphyrius' | 'placidus' | 'whole' | 'equal' | 'koch';
  nodeType: 'mean' | 'true';
  dashaSystem: 'vimshottari' | 'ashtottari' | 'yogini' | 'kalachakra';
  reportFormat: 'detailed' | 'summary' | 'minimal';
  decimalPlaces: 2 | 3 | 4 | 5;
  autoSave: boolean;
  soundEnabled: boolean;
  showHints: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  fontSize: 'medium',
  language: 'en',
  ayanamsha: 'lahiri',
  houseSystem: 'porphyrius',
  nodeType: 'mean',
  dashaSystem: 'vimshottari',
  reportFormat: 'detailed',
  decimalPlaces: 2,
  autoSave: true,
  soundEnabled: true,
  showHints: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('kotravel-settings');
    if (stored) {
      try {
        // Merge over defaults so keys added in newer versions (e.g. nodeType)
        // are never left undefined for someone with older stored settings.
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    setLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('kotravel-settings', JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('kotravel-settings', JSON.stringify(DEFAULT_SETTINGS));
  };

  return { settings, updateSettings, resetSettings, loaded };
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-surface border border-line rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-4 border-b border-line bg-surface">
          <h2 className="text-lg font-bold text-ink">Settings</h2>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Display Settings */}
          <section>
            <h3 className="text-base font-semibold text-ink mb-3">Display</h3>
            <div className="space-y-3 pl-4 border-l border-line-soft">
              <div className="flex items-center justify-between">
                <label className="text-sm text-ink">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value as any })}
                  className="px-3 py-1 text-sm bg-ink-soft/10 border border-line rounded"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-ink">Font Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                  className="px-3 py-1 text-sm bg-ink-soft/10 border border-line rounded"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-ink">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as any })}
                  className="px-3 py-1 text-sm bg-ink-soft/10 border border-line rounded"
                >
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>
            </div>
          </section>

          {/* Calculation Settings */}
          <section>
            <h3 className="text-base font-semibold text-ink mb-3">Calculations</h3>
            <div className="space-y-3 pl-4 border-l border-line-soft">
              <div className="flex items-center justify-between">
                <label className="text-sm text-ink">Ayanamsha</label>
                <select
                  value={settings.ayanamsha}
                  onChange={(e) => updateSettings({ ayanamsha: e.target.value as any })}
                  className="px-3 py-1 text-sm bg-ink-soft/10 border border-line rounded"
                >
                  <option value="lahiri">Lahiri / Chitrapaksha (default)</option>
                  <option value="raman">Raman</option>
                  <option value="krishnamurti">Krishnamurti (KP)</option>
                  <option value="truecitra">True Chitrapaksha</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-ink">House System</label>
                <select
                  value={settings.houseSystem}
                  onChange={(e) => updateSettings({ houseSystem: e.target.value as any })}
                  className="px-3 py-1 text-sm bg-ink-soft/10 border border-line rounded"
                >
                  <option value="porphyrius">Porphyry / Sripati (default)</option>
                  <option value="placidus">Placidus</option>
                  <option value="whole">Whole Sign</option>
                  <option value="equal">Equal</option>
                  <option value="koch">Koch</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-ink">Lunar Node (Rahu/Ketu)</label>
                <select
                  value={settings.nodeType}
                  onChange={(e) => updateSettings({ nodeType: e.target.value as any })}
                  className="px-3 py-1 text-sm bg-ink-soft/10 border border-line rounded"
                >
                  <option value="mean">Mean node (default)</option>
                  <option value="true">True node</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-ink">Dasha System</label>
                <select
                  value={settings.dashaSystem}
                  onChange={(e) => updateSettings({ dashaSystem: e.target.value as any })}
                  className="px-3 py-1 text-sm bg-ink-soft/10 border border-line rounded"
                >
                  <option value="vimshottari">Vimshottari</option>
                  <option value="ashtottari">Ashtottari</option>
                  <option value="yogini">Yogini</option>
                  <option value="kalachakra">Kalachakra</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-ink">Decimal Places</label>
                <select
                  value={settings.decimalPlaces}
                  onChange={(e) => updateSettings({ decimalPlaces: parseInt(e.target.value) as any })}
                  className="px-3 py-1 text-sm bg-ink-soft/10 border border-line rounded"
                >
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>
          </section>

          {/* Report Settings */}
          <section>
            <h3 className="text-base font-semibold text-ink mb-3">Reports</h3>
            <div className="space-y-3 pl-4 border-l border-line-soft">
              <div className="flex items-center justify-between">
                <label className="text-sm text-ink">Report Format</label>
                <select
                  value={settings.reportFormat}
                  onChange={(e) => updateSettings({ reportFormat: e.target.value as any })}
                  className="px-3 py-1 text-sm bg-ink-soft/10 border border-line rounded"
                >
                  <option value="detailed">Detailed</option>
                  <option value="summary">Summary</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
            </div>
          </section>

          {/* Behavior Settings */}
          <section>
            <h3 className="text-base font-semibold text-ink mb-3">Behavior</h3>
            <div className="space-y-3 pl-4 border-l border-line-soft">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-ink">Auto-save charts</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-ink">Sound notifications</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showHints}
                  onChange={(e) => updateSettings({ showHints: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-ink">Show helpful hints</span>
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 p-4 border-t border-line bg-surface">
          <button
            onClick={resetSettings}
            className="px-4 py-2 text-sm font-medium rounded border border-line text-ink hover:bg-ink-soft/10 transition-colors"
          >
            Reset to Defaults
          </button>
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
