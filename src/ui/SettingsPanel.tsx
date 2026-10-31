'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { PlaceSearchInput } from './PlaceSearchInput';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  ayanamsha: 'lahiri' | 'raman' | 'krishnamurti' | 'truecitra';
  houseSystem: 'porphyrius' | 'placidus' | 'whole' | 'equal' | 'koch';
  nodeType: 'mean' | 'true';
  /** Dasha Year (PL9 Options, Dasha Options): the length of a dasha year in days. */
  dashaYearDays: 360 | 365.25 | 327.85;
  /** Dasha Balance Method (PL9 Options, Dasha Options): the balance at birth by degree or by time. */
  dashaBalance: 'degree' | 'time';
  showHints: boolean;
  /** Which sunrise Gulika counts from: the visible one (upper limb, refraction) or the Hindu one (centre of the disc; PL9's). */
  sunrise: 'upper-limb' | 'disc-centre';
  /** Astrologer's location (PL9 Edit menu): today's panchangam on the home page, and the place a new chart starts at. */
  astrologerPlace: AstrologerPlace;
}

export interface AstrologerPlace {
  name: string;
  latitude: number;
  longitude: number;
  /** IANA zone; the offset of the day is read from it. */
  timeZone: string;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  fontSize: 'medium',
  ayanamsha: 'lahiri',
  houseSystem: 'porphyrius',
  nodeType: 'mean',
  dashaYearDays: 365.25,
  dashaBalance: 'degree',
  showHints: false,
  sunrise: 'upper-limb',
  astrologerPlace: { name: 'Chennai', latitude: 13.0827, longitude: 80.2707, timeZone: 'Asia/Kolkata' },
};

function isPlace(p: unknown): p is AstrologerPlace {
  const v = p as AstrologerPlace;
  return !!v && typeof v.name === 'string' && Number.isFinite(v.latitude) && Number.isFinite(v.longitude) && typeof v.timeZone === 'string';
}

const SETTINGS_CHANGED_EVENT = 'kotravel:settings-changed';

// Settings values (lowercase UI keys) → the governed chart-context names
// (@swisseph/node SiderealMode / HouseSystem keys) the engine expects.
const AYANAMSHA_MAP: Record<string, string> = {
  lahiri: 'Lahiri', raman: 'Raman', krishnamurti: 'Krishnamurti', truecitra: 'TrueCitra',
};
const HOUSE_SYSTEM_MAP: Record<string, string> = {
  porphyrius: 'Porphyrius', placidus: 'Placidus', whole: 'WholeSign', equal: 'Equal', koch: 'Koch',
};

/** The engine options every calculation entry point must pass, so a setting
 *  the user changed is never silently replaced by the engine's own default. */
export function toEngineOptions(settings: Settings): {
  ayanamsha: string;
  houseSystem: string;
  nodeType: 'mean' | 'true';
  sunrise: 'upper-limb' | 'disc-centre';
} {
  return {
    ayanamsha: AYANAMSHA_MAP[settings.ayanamsha] ?? 'Lahiri',
    houseSystem: HOUSE_SYSTEM_MAP[settings.houseSystem] ?? 'Porphyrius',
    nodeType: settings.nodeType === 'true' ? 'true' : 'mean',
    sunrise: settings.sunrise === 'disc-centre' ? 'disc-centre' : 'upper-limb',
  };
}

/** The dasha options the Vimshottari engine takes from the settings (the Dasha Options of PL9). */
export function toDashaOptions(settings: Settings): { yearDays: number; balance: 'degree' | 'time' } {
  return { yearDays: settings.dashaYearDays, balance: settings.dashaBalance };
}

function readStoredSettings(): Settings {
  try {
    const stored = localStorage.getItem('kotravel-settings');
    // Merge over defaults so keys added in newer versions (e.g. nodeType)
    // are never left undefined for someone with older stored settings.
    if (!stored) return DEFAULT_SETTINGS;
    const merged = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    return isPlace(merged.astrologerPlace) ? merged : { ...merged, astrologerPlace: DEFAULT_SETTINGS.astrologerPlace };
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(readStoredSettings());
    setLoaded(true);

    // Every `useSettings()` call site (SettingsPanel, ReportBuilder, ...) owns
    // its own React state seeded from localStorage once on mount — with no
    // shared context, one instance saving a change never reached another
    // already-mounted instance. Concretely: open Settings, change Ayanamsha,
    // Close, then Calculate Chart without reloading the page — the report
    // silently used the ayanamsha ReportBuilder had at ITS mount time, not
    // the one just saved. Broadcasting on save and re-reading here on every
    // instance (mirroring the existing `kotravel:report-layout` custom-event
    // pattern already used for the Windows-menu layout toggle) keeps every
    // `useSettings()` instance in the same tab in sync without introducing a
    // new context/provider.
    const onChanged = () => setSettings(readStoredSettings());
    window.addEventListener(SETTINGS_CHANGED_EVENT, onChanged);
    return () => window.removeEventListener(SETTINGS_CHANGED_EVENT, onChanged);
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('kotravel-settings', JSON.stringify(updated));
    window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('kotravel-settings', JSON.stringify(DEFAULT_SETTINGS));
    window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
  };

  return { settings, updateSettings, resetSettings, loaded };
}

/** Applies Theme and Font size to the whole page (globals.css reads data-theme and data-font on the root element). */
export function useApplyAppearance() {
  const { settings } = useSettings();
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'system') delete root.dataset.theme;
    else root.dataset.theme = settings.theme;
    if (settings.fontSize === 'medium') delete root.dataset.font;
    else root.dataset.font = settings.fontSize;
  }, [settings.theme, settings.fontSize]);
}

const selectClass = 'px-3 py-1.5 text-sm bg-bg border border-line rounded-lg max-w-[60%]';

function Row({ label, en, children }: { label: string; en: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-ink">{label} <span className="text-xs text-ink-soft">· {en}</span></label>
      {children}
    </div>
  );
}

function Group({ id, title, en, children }: { id?: string; title: string; en: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-4">
      <h3 className="text-base font-semibold text-ink mb-3">{title} <span className="text-sm font-normal text-ink-soft">· {en}</span></h3>
      <div className="space-y-3 pl-4 border-l-2 border-saffron/30">{children}</div>
    </section>
  );
}

/** The astrologer's town, from the atlas: today's panchangam is read there and a new chart starts there. */
function AstrologerPlaceRow() {
  const { settings, updateSettings } = useSettings();
  const place = settings.astrologerPlace;
  const [text, setText] = useState(place.name);
  useEffect(() => setText(place.name), [place.name]);
  return (
    <div className="space-y-1.5">
      <PlaceSearchInput
        value={text}
        onText={setText}
        onPick={(p) => updateSettings({ astrologerPlace: { name: p.name, latitude: p.latitude, longitude: p.longitude, timeZone: p.timeZone } })}
        className="w-full px-3 py-1.5 text-sm bg-bg border border-line rounded-lg"
      />
      <p className="text-xs text-ink-soft tabular-nums">
        📍 {place.name} · {place.latitude.toFixed(4)}°, {place.longitude.toFixed(4)}° · {place.timeZone}
        <span className="block">இன்றைய பஞ்சாங்கம் இந்த ஊருக்கு; புதிய ஜாதகம் இந்த ஊரில் தொடங்கும்.</span>
      </p>
    </div>
  );
}

/**
 * Every setting of the program, in one form: the Settings panel (⚙️) and the /settings page both show it, so each setting has
 * one place. Only settings that something reads are here.
 */
export function SettingsForm() {
  const { settings, updateSettings } = useSettings();
  return (
    <div className="space-y-6">
      <Group id="settings-display" title="தோற்றம்" en="Display">
        <Row label="நிறப் பின்னணி" en="Theme">
          <select value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value as Settings['theme'] })} className={selectClass}>
            <option value="system">கணினியைப் போல (System)</option>
            <option value="light">வெளிர் (Light)</option>
            <option value="dark">இருள் (Dark)</option>
          </select>
        </Row>
        <Row label="எழுத்தளவு" en="Font size">
          <select value={settings.fontSize} onChange={(e) => updateSettings({ fontSize: e.target.value as Settings['fontSize'] })} className={selectClass}>
            <option value="small">சிறியது (Small)</option>
            <option value="medium">நடுத்தரம் (Medium)</option>
            <option value="large">பெரியது (Large)</option>
          </select>
        </Row>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings.showHints} onChange={(e) => updateSettings({ showHints: e.target.checked })} className="size-4 accent-saffron" />
          <span className="text-sm text-ink">குறிப்பு உதவி <span className="text-xs text-ink-soft">· Balloon help (hover hints)</span></span>
        </label>
      </Group>

      <Group id="settings-location" title="ஜோதிடர் இருப்பிடம்" en="Astrologer's location">
        <AstrologerPlaceRow />
      </Group>

      <Group id="settings-calculations" title="கணக்கீடுகள்" en="Calculations">
        <Row label="அயனாம்சம்" en="Ayanamsha">
          <select
            value={settings.ayanamsha}
            data-hint="Default ayanamsha for new charts. Lahiri is the usual default; Krishnamurti is the K.P. system."
            onChange={(e) => updateSettings({ ayanamsha: e.target.value as Settings['ayanamsha'] })}
            className={selectClass}
          >
            <option value="lahiri">Lahiri / Chitrapaksha (default)</option>
            <option value="raman">Raman</option>
            <option value="krishnamurti">Krishnamurti (KP)</option>
            <option value="truecitra">True Chitrapaksha</option>
          </select>
        </Row>
        <Row label="பாவ முறை" en="House system">
          <select
            value={settings.houseSystem}
            data-hint="How the twelve houses are divided. Porphyry (Sripati) is the default."
            onChange={(e) => updateSettings({ houseSystem: e.target.value as Settings['houseSystem'] })}
            className={selectClass}
          >
            <option value="porphyrius">Porphyry / Sripati (default)</option>
            <option value="placidus">Placidus</option>
            <option value="whole">Whole Sign</option>
            <option value="equal">Equal</option>
            <option value="koch">Koch</option>
          </select>
        </Row>
        <Row label="ராகு / கேது" en="Lunar node">
          <select
            value={settings.nodeType}
            data-hint="Rahu and Ketu: the mean node moves at its average speed; the true node follows its actual motion."
            onChange={(e) => updateSettings({ nodeType: e.target.value as Settings['nodeType'] })}
            className={selectClass}
          >
            <option value="mean">Mean node (default)</option>
            <option value="true">True node</option>
          </select>
        </Row>
        <Row label="சூரிய உதயம்" en="Sunrise (Gulika)">
          <select
            value={settings.sunrise}
            data-hint="Visible sunrise: the Sun's upper edge, with refraction (K.S. Charak). Hindu sunrise: the centre of the disc, without refraction, about 3½ minutes later (G.K. Ojha, pp.35-36); Parashara's Light 9 counts Gulika from it."
            onChange={(e) => updateSettings({ sunrise: e.target.value as Settings['sunrise'] })}
            className={selectClass}
          >
            <option value="upper-limb">மேல் விளிம்பு · Upper limb (default)</option>
            <option value="disc-centre">வட்ட மையம் · Disc centre (Hindu, PL9)</option>
          </select>
        </Row>
      </Group>

      <Group id="settings-dashas" title="தசைகள்" en="Dasha options">
        <Row label="தசா ஆண்டு" en="Dasha year">
          <select value={settings.dashaYearDays} onChange={(e) => updateSettings({ dashaYearDays: parseFloat(e.target.value) as Settings['dashaYearDays'] })} className={selectClass}>
            <option value="360">360 நாட்கள்</option>
            <option value="365.25">365.25 நாட்கள் (default)</option>
            <option value="327.85">327.85 நாட்கள்</option>
          </select>
        </Row>
        <Row label="பிறப்பு இருப்பு" en="Balance method">
          <select value={settings.dashaBalance} onChange={(e) => updateSettings({ dashaBalance: e.target.value as Settings['dashaBalance'] })} className={selectClass}>
            <option value="degree">பாகைப்படி · By degree (default)</option>
            <option value="time">நேரப்படி · By time</option>
          </select>
        </Row>
      </Group>
    </div>
  );
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { resetSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-3" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-surface border border-line rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex justify-between items-center px-5 py-3 border-b border-line bg-surface">
          <h2 className="text-lg font-bold text-ink">⚙️ அமைப்புகள் <span className="text-sm font-normal text-ink-soft">· Settings</span></h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink text-xl font-bold" aria-label="மூடு">✕</button>
        </div>
        <div className="p-5">
          <SettingsForm />
        </div>
        <div className="sticky bottom-0 flex justify-end gap-3 px-5 py-3 border-t border-line bg-surface">
          <button onClick={resetSettings} className="px-4 py-2 text-sm font-medium rounded-lg border border-line text-ink hover:bg-ink-soft/10 transition-colors">
            இயல்புநிலை · Reset
          </button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg bg-saffron text-ink hover:brightness-105 transition">
            மூடு · Close
          </button>
        </div>
      </div>
    </div>
  );
}
