/**
 * The screen preferences, without React: what PL9's Screen Options, Worksheet Properties and Colors dialogs set (screen recording of
 * PL9 9.0, 2026-10-31). Kept in the browser's localStorage under one key. `sanitize` keeps only known keys with values of the right
 * kind, so a damaged or old entry never breaks a page: anything else falls back to the default.
 */

const KEY = 'kotravel-screen-prefs';
/** The browser event sent when the preferences change, so every part of the screen that shows them can follow. */
const CHANGE_EVENT = 'kotravel:screen-prefs';

const ICON_SIZES = ['small', 'medium', 'large'];
const LAYOUTS = ['standard', 'single', 'compact'];
const PLANET_KEYS = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke', 'As', 'Gk'];

const DEFAULTS = Object.freeze({
  /** Show the toolbar under the menu. */
  showToolbar: true,
  iconSize: 'medium',
  /** Hints (the title text) when the pointer is over a toolbar icon. */
  toolbarHints: true,
  /** Icons only, without the name under each. */
  compactNavigation: false,
  /** The line under the toolbar: the open chart's name, birth date, time and place. */
  nameAndBirthdata: true,
  /** The worksheet's arrangement: the standard one, one column, or compact. */
  worksheetLayout: 'standard',
  /** A title the worksheet shows instead of its own name; empty is the default. */
  worksheetTitle: '',
  /** Keep the time tool open with the worksheet. */
  alwaysShowTimeTool: false,
  /** The page File > Open lands on. */
  homeRoute: '/worksheet',
  /** The degrees and nakshatra beside each planet of the worksheet's main chart. */
  chartDegrees: true,
  /** Planet colours by two-letter name, over the defaults. */
  planetColors: Object.freeze({}),
});

const isHex = (v) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);

/** A stored (or patched) object reduced to known keys of the right kind; the rest is the default. */
function sanitize(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const colors = {};
  if (r.planetColors && typeof r.planetColors === 'object') {
    for (const k of PLANET_KEYS) if (isHex(r.planetColors[k])) colors[k] = r.planetColors[k].toLowerCase();
  }
  return {
    showToolbar: typeof r.showToolbar === 'boolean' ? r.showToolbar : DEFAULTS.showToolbar,
    iconSize: ICON_SIZES.includes(r.iconSize) ? r.iconSize : DEFAULTS.iconSize,
    toolbarHints: typeof r.toolbarHints === 'boolean' ? r.toolbarHints : DEFAULTS.toolbarHints,
    compactNavigation: typeof r.compactNavigation === 'boolean' ? r.compactNavigation : DEFAULTS.compactNavigation,
    nameAndBirthdata: typeof r.nameAndBirthdata === 'boolean' ? r.nameAndBirthdata : DEFAULTS.nameAndBirthdata,
    worksheetLayout: LAYOUTS.includes(r.worksheetLayout) ? r.worksheetLayout : DEFAULTS.worksheetLayout,
    worksheetTitle: typeof r.worksheetTitle === 'string' ? r.worksheetTitle.slice(0, 60) : DEFAULTS.worksheetTitle,
    alwaysShowTimeTool: typeof r.alwaysShowTimeTool === 'boolean' ? r.alwaysShowTimeTool : DEFAULTS.alwaysShowTimeTool,
    homeRoute: typeof r.homeRoute === 'string' && /^\/[a-z0-9\-/]*(\?[^\s]*)?$/i.test(r.homeRoute) ? r.homeRoute : DEFAULTS.homeRoute,
    chartDegrees: typeof r.chartDegrees === 'boolean' ? r.chartDegrees : DEFAULTS.chartDegrees,
    planetColors: colors,
  };
}

/** The stored preferences, completed with the defaults. */
function readPrefs() {
  try {
    const raw = globalThis.localStorage.getItem(KEY);
    return sanitize(raw ? JSON.parse(raw) : null);
  } catch {
    return sanitize(null);
  }
}

/** Saves a change (merged over what is stored) and returns the preferences now in force. */
function writePrefs(patch) {
  const next = sanitize({ ...readPrefs(), ...patch });
  try { globalThis.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* not saved, still applied for this page */ }
  try {
    if (typeof globalThis.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') globalThis.dispatchEvent(new globalThis.CustomEvent(CHANGE_EVENT));
  } catch { /* nothing is listening */ }
  return next;
}

/** A planet's colour: the user's if set, else the default. */
function planetColor(prefs, abbr, fallback) {
  return prefs.planetColors[abbr] ?? fallback;
}

module.exports = { KEY, CHANGE_EVENT, DEFAULTS, ICON_SIZES, LAYOUTS, PLANET_KEYS, sanitize, readPrefs, writePrefs, planetColor };
