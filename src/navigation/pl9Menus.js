/**
 * The File, Edit and Charts menus as Parashara's Light 9 lists them (the three menu screenshots, and the user guide's
 * menu reference, chapter 20). Every PL9 entry appears, in PL9's order. An entry's `target` says where it goes:
 *
 *   { route }    opens that page of the app
 *   { action }   runs the named handler in TopMenuBar (its `case` label)
 *   { pending }  not built yet; the reason is shown when the entry is clicked
 *   { items }    a flyout of more entries (Charts > Interpretations)
 *
 * `status` says how close the destination is to the PL9 screen: 'have' (does the PL9 job), 'partial' (a nearby page, not
 * the same worksheet), 'pending' (nothing yet) or 'extra' (ours, not in PL9). Dividers are { divider: true } and sit where
 * PL9's menus have a separator. TopMenuBar renders these lists; test-pl9-menus.js checks them.
 */

const divider = (n) => ({ key: `divider-${n}`, divider: true });

const FILE_MENU = [
  { key: 'file-new', label: 'New', status: 'have', target: { route: '/worksheet?new=1' } },
  { key: 'open', label: 'Open...', status: 'have', target: { action: 'open' } },
  { key: 'file-manager', label: 'File Manager...', status: 'partial', target: { action: 'file-manager' } },
  { key: 'save', label: 'Save', status: 'have', target: { action: 'save' } },
  { key: 'saveas', label: 'Save As...', status: 'have', target: { action: 'saveas' } },
  {
    key: 'file-saveto', label: 'Save To', status: 'pending',
    target: { pending: 'Not built: the chart library has no groups yet, so there is nothing to save a chart into.' },
  },
  { key: 'close', label: 'Close', status: 'have', target: { action: 'close' } },
  divider(1),
  { key: 'file-model-printing', label: 'Model Printing', status: 'partial', target: { route: '/print' } },
  divider(2),
  { key: 'print', label: 'Print screen...', status: 'partial', target: { action: 'print' } },
  { key: 'printer-setup', label: 'Printer Setup', status: 'partial', target: { action: 'printer-setup' } },
  {
    key: 'file-copy-clipboard', label: 'Copy screen to Clipboard', status: 'pending',
    target: { pending: 'Not built: copying the screen as an image is not supported yet.' },
  },
  divider(3),
  { key: 'language', label: 'Language', status: 'partial', target: { action: 'language' } },
  divider(4),
  { key: 'exit', label: 'Exit', status: 'have', target: { action: 'exit' } },
  divider(5),
  { key: 'recent', label: 'Recent Charts', status: 'extra', target: { action: 'recent' } },
  { key: 'export_submenu', label: 'Export', status: 'extra', target: { action: 'export_submenu' } },
];

const EDIT_MENU = [
  { key: 'edit-birthdata', label: 'Birth data', status: 'have', target: { route: '/report' } },
  {
    key: 'edit-anka', label: 'Anka value', status: 'pending',
    target: { pending: 'Not built: the Anka sound table needs a cited source (user guide ch.2: the first two sounds of the first name, used by Shayanadi Avasthas and Sarvatobhadra).' },
  },
  { key: 'notes', label: 'Chart Notes', status: 'have', target: { action: 'notes' } },
  { key: 'events', label: 'Events', status: 'have', target: { action: 'events' } },
  {
    key: 'edit-native-location', label: "Native's current location", status: 'pending',
    target: { pending: "Not built: no stored current location for the localised Varshaphala and today's events yet. Tools > Location Finder gives a place meanwhile." },
  },
  divider(1),
  {
    key: 'edit-astrologer-location', label: "Astrologer's location", status: 'pending',
    target: { pending: 'Not built: no stored astrologer location for the Prashna yet.' },
  },
  {
    key: 'edit-astrologer-settings', label: 'Astrologer specific settings', status: 'pending',
    target: { pending: "Not built: the astrologer's name, address and preferences are not stored or used in printouts yet." },
  },
  divider(2),
  {
    key: 'edit-cover-page', label: 'Cover page text', status: 'pending',
    target: { pending: 'Not built: no cover page or footer text setting for the printouts yet.' },
  },
  divider(3),
  { key: 'preferences', label: 'Preferences', status: 'extra', target: { action: 'preferences' } },
];

/** Charts > Interpretations: PL9's flyout; the nearest report section or page for each. */
const INTERPRETATIONS = [
  { key: 'chart-interp-lagna', label: 'Lagna', status: 'partial', target: { route: '/report?section=lagnaGraha' } },
  { key: 'chart-interp-rashi', label: 'Rashi', status: 'partial', target: { route: '/report?section=rashiChakra' } },
  { key: 'chart-interp-nakshatra', label: 'Nakshatra', status: 'partial', target: { route: '/report?section=nakshatraExtras' } },
  { key: 'chart-interp-planets-houses', label: 'Planets in houses', status: 'have', target: { route: '/planet-house' } },
  { key: 'chart-interp-transits', label: 'Transits', status: 'have', target: { route: '/report?section=transit' } },
];

const CHARTS_MENU = [
  { key: 'chart-birth', label: 'Birth chart I', status: 'have', target: { route: '/worksheet' } },
  { key: 'chart-vargas', label: 'Vargas I', status: 'have', target: { route: '/divisional-charts' } },
  { key: 'chart-sudarshan', label: 'Sudarshan Chakra', status: 'have', target: { route: '/report?chart=sudarshan-chakra' } },
  { key: 'chart-lordships', label: 'Lordships', status: 'have', target: { route: '/lordships' } },
  { key: 'chart-interpreting-grahas', label: 'Interpreting Grahas', status: 'have', target: { route: '/interpreting-grahas' } },
  {
    key: 'chart-deities', label: 'Planetary deities', status: 'pending',
    target: { pending: 'Not built: the user guide does not describe this worksheet, and the library has no cited source for the planets\' deities yet.' },
  },
  { key: 'chart-aspects', label: 'Aspects on planets', status: 'have', target: { route: '/report?chart=aspect-matrix' } },
  { key: 'chart-dashas-nakshatra', label: 'Dashas - Nakshatra based', status: 'have', target: { route: '/report?chart=dasha-vimsottari' } },
  { key: 'chart-calendar', label: 'Calendar', status: 'have', target: { route: '/dasha-calendar' } },
  { key: 'chart-navamsha-ages', label: 'Navamsha ages', status: 'have', target: { route: '/navamsha-years' } },
  { key: 'chart-animated-transits', label: 'Animated transits I', status: 'have', target: { route: '/animated-transits' } },
  { key: 'chart-animated-partner', label: 'Animated Transits - Partner', status: 'have', target: { route: '/animated-transits?partner=1' } },
  { key: 'chart-graphical-ephemeris', label: 'Graphical Ephemeris', status: 'have', target: { route: '/graphical-ephemeris' } },
  { key: 'chart-ashtakavarga', label: 'Ashtakavarga - Samudaya', status: 'have', target: { route: '/report?chart=ashtakavarga' } },
  { key: 'chart-events-1', label: 'Events 1-10', status: 'partial', target: { route: '/events' } },
  { key: 'chart-events-2', label: 'Events 11-20', status: 'partial', target: { route: '/events' } },
  { key: 'chart-muhurta', label: 'Muhurta', status: 'have', target: { route: '/muhurta' } },
  { key: 'chart-varshaphala', label: 'Varshaphala I', status: 'have', target: { route: '/varshaphala' } },
  { key: 'chart-composite', label: 'Compatibility - Composite', status: 'have', target: { route: '/report?chart=compatibility' } },
  { key: 'chart-dasha-effects', label: 'Dasha Effects Browser', status: 'partial', target: { route: '/dasha-effects' } },
  { key: 'chart-dasha-transit-timelines', label: 'Dasha and Transit timelines', status: 'have', target: { route: '/dasha-timeline' } },
  {
    key: 'chart-sun-in-house', label: 'Sun in house', status: 'pending',
    target: { pending: 'Not built: the user guide does not describe this worksheet; it needs the PL9 screen or a cited definition.' },
  },
  { key: 'chart-rectification', label: 'Rectification', status: 'have', target: { route: '/rectification' } },
  { key: 'chart-tutor', label: 'Chart tutor', status: 'partial', target: { route: '/learning-resources' } },
  {
    key: 'chart-tithi-pravesh', label: 'Tithi Pravesh', status: 'pending',
    target: { pending: 'Not built: the user guide names Tithi Pravesh as a chart base but does not define it; it needs a cited definition.' },
  },
  { key: 'chart-graphical-3m', label: 'Graphical ephemeris - 3 month overview', status: 'partial', target: { route: '/graphical-ephemeris' } },
  { key: 'chart-yearly-transit', label: 'Yearly transit overview (South Indian)', status: 'have', target: { route: '/yearly-transit' } },
  { key: 'chart-sarvatobhadra', label: 'Sarvatobhadra Chakra', status: 'have', target: { route: '/report?section=sarvatobhadra' } },
  { key: 'chart-interpretations', label: 'Interpretations', status: 'partial', target: { items: INTERPRETATIONS } },
];

/**
 * Every entry by key, the flyout's included, for the click handler.
 * @type {Record<string, any>}
 */
const ITEM_BY_KEY = {};
for (const item of [...FILE_MENU, ...EDIT_MENU, ...CHARTS_MENU, ...INTERPRETATIONS]) {
  if (!item.divider) ITEM_BY_KEY[item.key] = item;
}

module.exports = { FILE_MENU, EDIT_MENU, CHARTS_MENU, INTERPRETATIONS, ITEM_BY_KEY };
