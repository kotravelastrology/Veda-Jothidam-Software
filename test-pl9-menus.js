const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { FILE_MENU, EDIT_MENU, CHARTS_MENU, INTERPRETATIONS, ITEM_BY_KEY } = require('./src/navigation/pl9Menus');

const entries = (menu) => menu.filter((e) => !e.divider);
const pl9Entries = (menu) => entries(menu).filter((e) => e.status !== 'extra');
const labels = (menu) => pl9Entries(menu).map((e) => e.label);

// The three PL9 menus, as the screenshots list them (File, Edit, Charts), in order.
assert.deepStrictEqual(labels(FILE_MENU), [
  'New', 'Open...', 'File Manager...', 'Save', 'Save As...', 'Save To', 'Close', 'Model Printing',
  'Print screen...', 'Printer Setup', 'Copy screen to Clipboard', 'Language', 'Exit',
]);
assert.deepStrictEqual(labels(EDIT_MENU), [
  'Birth data', 'Anka value', 'Chart Notes', 'Events', "Native's current location",
  "Astrologer's location", 'Astrologer specific settings', 'Cover page text',
]);
assert.deepStrictEqual(labels(CHARTS_MENU), [
  'Birth chart I', 'Vargas I', 'Sudarshan Chakra', 'Lordships', 'Interpreting Grahas', 'Planetary deities',
  'Aspects on planets', 'Dashas - Nakshatra based', 'Calendar', 'Navamsha ages', 'Animated transits I',
  'Animated Transits - Partner', 'Graphical Ephemeris', 'Ashtakavarga - Samudaya', 'Events 1-10', 'Events 11-20',
  'Muhurta', 'Varshaphala I', 'Compatibility - Composite', 'Dasha Effects Browser', 'Dasha and Transit timelines',
  'Sun in house', 'Rectification', 'Chart tutor', 'Tithi Pravesh', 'Graphical ephemeris - 3 month overview',
  'Yearly transit overview (South Indian)', 'Sarvatobhadra Chakra', 'Interpretations',
]);
assert.strictEqual(CHARTS_MENU.length, 29, 'the Charts menu has 29 entries');

// Keys are unique across the menus and the flyout.
const all = [...entries(FILE_MENU), ...entries(EDIT_MENU), ...entries(CHARTS_MENU), ...INTERPRETATIONS];
assert.strictEqual(new Set(all.map((e) => e.key)).size, all.length, 'unique keys');
assert.strictEqual(Object.keys(ITEM_BY_KEY).length, all.length, 'ITEM_BY_KEY holds every entry');

// Each entry goes exactly one way, with a known status; a pending entry has a reason and the status says so.
const STATUSES = ['have', 'partial', 'pending', 'extra'];
const SHAPES = ['route', 'action', 'pending', 'items'];
for (const e of all) {
  assert.ok(STATUSES.includes(e.status), `${e.key}: status`);
  const set = SHAPES.filter((s) => e.target && e.target[s] !== undefined);
  assert.strictEqual(set.length, 1, `${e.key}: one target`);
  if (e.target.pending) {
    assert.ok(e.target.pending.length >= 30, `${e.key}: a real reason`);
    assert.strictEqual(e.status, 'pending', `${e.key}: pending status`);
  } else {
    assert.notStrictEqual(e.status, 'pending', `${e.key}: only pending entries are marked pending`);
  }
}
assert.strictEqual(CHARTS_MENU.find((e) => e.target.items).target.items, INTERPRETATIONS);

// A route reaches something real: an app page, a chart id from chartTypes, or a section id of the report builder.
const appDir = path.join(__dirname, 'app');
const chartTypes = fs.readFileSync(path.join(__dirname, 'src/charts/chartTypes.ts'), 'utf8');
const reportBuilder = fs.readFileSync(path.join(__dirname, 'app/report/ReportBuilder.tsx'), 'utf8');
for (const e of all.filter((x) => x.target.route)) {
  const [pathname, query] = e.target.route.split('?');
  const segment = pathname.split('/')[1];
  assert.ok(fs.existsSync(path.join(appDir, segment, 'page.tsx')), `${e.key}: no page at app/${segment}`);
  const params = new URLSearchParams(query || '');
  if (params.get('chart')) assert.ok(chartTypes.includes(`id: '${params.get('chart')}'`), `${e.key}: unknown chart ${params.get('chart')}`);
  if (params.get('section')) assert.ok(reportBuilder.includes(`{ id: '${params.get('section')}'`), `${e.key}: unknown section ${params.get('section')}`);
}

// An action has a handler in TopMenuBar.
const menuBar = fs.readFileSync(path.join(__dirname, 'src/navigation/TopMenuBar.tsx'), 'utf8');
for (const e of all.filter((x) => x.target.action)) {
  assert.ok(menuBar.includes(`case '${e.target.action}':`), `${e.key}: TopMenuBar has no case '${e.target.action}'`);
}

// The pages added for the Charts menu.
assert.strictEqual(ITEM_BY_KEY['chart-lordships'].target.route, '/lordships');
assert.strictEqual(ITEM_BY_KEY['chart-calendar'].target.route, '/dasha-calendar');

// Counts, for the record (also in docs/PL9-menu-inventory.md).
const count = (status) => all.filter((e) => e.status === status).length;
console.log(`pl9 menus: have ${count('have')}, partial ${count('partial')}, pending ${count('pending')}, extra ${count('extra')}`);
console.log('test-pl9-menus: all assertions passed');
