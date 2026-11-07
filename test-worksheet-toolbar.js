const assert = require('assert');
const fs = require('fs');
const path = require('path');
const T = require('./src/navigation/toolbarPanels');

const labels = (col) => col.items.map((i) => i.label);
const col = (panel, title) => panel.columns.find((c) => c.title === title);

// --- the icons, in PL9's order after the wrench (the recording): Birth chart, Varshaphala, Compatibility, Transits, Krishnamurti, Reports
assert.deepStrictEqual(T.PANELS.map((p) => p.key), ['birth', 'varsha', 'compat', 'transits', 'kp', 'reports']);

// --- the Birth chart panel, as the recording shows it: five columns
assert.deepStrictEqual(T.BIRTH.columns.map((c) => c.title), ['Charts', 'Basic Calculations', 'Advanced Calculations', 'General reports', 'Tools']);
assert.deepStrictEqual(labels(col(T.BIRTH, 'Charts')), [
  'Birth chart I', 'Birth chart II', 'Vargas I', 'Vargas II', 'Vargas III', 'Vargas IV', 'Vargas V', 'Sunrise chart', 'Special Lagnas',
  'Navamsha ages', 'Sudarshan Chakra', 'Alternate Lagnas',
]);
assert.deepStrictEqual(labels(col(T.BIRTH, 'Basic Calculations')), [
  'Lordships', 'Compound relations', 'Signs in all vargas', 'Vargavimshopaka', 'Shadbala', 'Bhava Bala', 'Interpreting Grahas',
  'Aspects on planets', 'Aspects from planets', 'Aspects on Houses 1-3', 'Aspects on Houses 4-6', 'Aspects on Houses 7-9',
  'Aspects on Houses 10-12', 'Jaimini karakas and aspects', 'Jaimini padas and lagnas',
]);
assert.deepStrictEqual(labels(col(T.BIRTH, 'Advanced Calculations')), [
  'Dashas - Nakshatra based', 'Dashas - Rashi based', 'Auspiciousness graph', 'Declination', 'Nakshatra spatial matrix', 'Planetary deities',
  'Panch Pakshi', 'Yogas',
]);
assert.deepStrictEqual(labels(col(T.BIRTH, 'General reports')), [
  'Nature and Temperament', 'Physical Characteristics', 'Lucky Points',
  'Sun in house', 'Moon in house', 'Mars in house', 'Mercury in house', 'Jupiter in house', 'Venus in house', 'Saturn in house', 'Rahu in house', 'Ketu in house',
  '1st and 2nd House lords', '3rd and 4th House lords', '5th and 6th House lords', '7th and 8th House lords', '9th and 10th House lords', '11th and 12th House lords',
]);
assert.deepStrictEqual(labels(col(T.BIRTH, 'Tools')), ['Rectification', 'Chart tutor', 'Dasha Effects Browser']);

// --- the Varshaphala panel: three columns
assert.deepStrictEqual(T.VARSHA.columns.map((c) => c.title), ['Charts', 'Basic Calculations', 'General reports']);
assert.deepStrictEqual(labels(col(T.VARSHA, 'Charts')), [
  'Varshaphala I', 'Varshaphala II', 'Varshaphala III', 'Varshaphala I (L)', 'Varshaphala II (L)', 'Varshaphala III (L)',
  'Varshaphala 8 years overview', 'Varshaphala (local) 8 years overview', 'Tithi Pravesh', 'Tithi Pravesh (L)', 'Sahams',
]);
assert.strictEqual(col(T.VARSHA, 'Basic Calculations').items.length, 15);
assert.deepStrictEqual(labels(col(T.VARSHA, 'Basic Calculations')).slice(0, 3), ['Monthly Solar Ret. I', 'Monthly Solar Ret. II', 'Monthly Solar Ret. III']);
assert.deepStrictEqual(labels(col(T.VARSHA, 'Basic Calculations')).slice(-3), ['Monthly Solar Return 3 month overview', 'Daily Solar Return 3 day overview', 'Varshaphala Dashas']);
assert.deepStrictEqual(labels(col(T.VARSHA, 'General reports')), ['Tajika Yogas Summary', 'Tripataki Chakra', 'Chart Interpretations']);

// --- Compatibility and Krishnamurti
assert.deepStrictEqual(labels(T.COMPAT.columns[0]), [
  'Compatibility - Composite', 'Compatibility - Kutas', 'Animated Transits - Partner', 'Mangal Dosha Consideration', 'Mangal Dosha Cancellation', 'Dash-Koota Compatibility',
]);
assert.deepStrictEqual(labels(T.KP.columns[0]), ['Krishnamurti', 'Krishnamurti II', 'Krishnamurti Prashna']);

// --- the two panels the recording does not show are ours, and say so
assert.deepStrictEqual(T.PANELS.filter((p) => p.ours).map((p) => p.key), ['transits', 'reports']);
assert.ok(T.PANELS.filter((p) => !p.ours).every((p) => !p.ours));

// --- the wrench's tiles, in the recording's order
assert.deepStrictEqual(T.TOOL_TILES.map((t) => t.label), [
  'Worksheet', 'Screen', 'Language', 'Locale', 'Fonts', 'Chart style', 'Colors', 'Calculations', 'Dashas', 'Time Tool', 'Place Tool',
]);
const OPENS = /^(worksheet|screen|chartstyle|colors|time|place|settings:(display|calculations|dashas))$/;
assert.ok(T.TOOL_TILES.every((t) => OPENS.test(t.opens)), 'every tile opens something we know');

// --- every entry goes one way, with a known status; pending ones say why
const entries = T.allEntries();
assert.strictEqual(new Set(entries.map((e) => e.key)).size, entries.length, 'unique keys');
for (const e of entries) {
  assert.ok(['have', 'partial', 'pending'].includes(e.status), `${e.key}: status`);
  assert.strictEqual(Object.keys(e.target).length, 1, `${e.key}: one target`);
  if (e.target.pending) { assert.strictEqual(e.status, 'pending', e.key); assert.ok(e.target.pending.length >= 15, `${e.key}: a reason`); } else assert.notStrictEqual(e.status, 'pending', e.key);
}

// --- a route reaches something real: an app page, a chart id, a report section
const chartTypes = fs.readFileSync(path.join(__dirname, 'src/charts/chartTypes.ts'), 'utf8');
const reportBuilder = fs.readFileSync(path.join(__dirname, 'app/report/ReportBuilder.tsx'), 'utf8');
for (const e of entries.filter((x) => x.target.route)) {
  const [pathname, query] = e.target.route.split('?');
  const segment = pathname.split('/')[1];
  assert.ok(fs.existsSync(path.join(__dirname, 'app', segment, 'page.tsx')), `${e.key}: no page at app/${segment}`);
  const params = new URLSearchParams(query || '');
  if (params.get('chart')) assert.ok(chartTypes.includes(`id: '${params.get('chart')}'`), `${e.key}: unknown chart ${params.get('chart')}`);
  if (params.get('section')) assert.ok(reportBuilder.includes(`{ id: '${params.get('section')}'`), `${e.key}: unknown section ${params.get('section')}`);
}

// --- the info line's worksheet title
assert.strictEqual(T.titleOfRoute('/worksheet'), 'Birth chart I');
assert.strictEqual(T.titleOfRoute('/lordships'), 'Lordships');
assert.strictEqual(T.titleOfRoute('/no-such-page'), null);

const count = (s) => entries.filter((e) => e.status === s).length;
console.log(`worksheet toolbar: ${entries.length} entries, have ${count('have')}, partial ${count('partial')}, pending ${count('pending')}`);
console.log('test-worksheet-toolbar: all assertions passed');
