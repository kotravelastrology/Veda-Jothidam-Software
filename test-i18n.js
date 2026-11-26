/**
 * The English interface (src/i18n): the translator, the catalogue src/i18n/en.json and its build (scripts/i18n/), and the wiring.
 *  1. the translator: exact texts, patterns (English word order), ordinals, a word's sense from the page's context and from the word
 *     after it, segments, Tamil words inside other text, the space before a Tamil suffix's English, an element's texts read together;
 *  2. en.json is what scripts/i18n/build.js makes from the source today (after changing a Tamil text: node scripts/i18n/build.js);
 *  3. no English holds Tamil, and each pattern's English has the same {0}, {1}... as its Tamil;
 *  4. every Tamil text of the interface (app/, src/**.tsx) has English, wholly and not in part; the books' statements whose English
 *     the data does not keep are not the interface and stay in Tamil (src/i18n/translate.js);
 *  5. the wiring: the boot script, the Translator in the layout, the switch kept out of translation, the chart's short names.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildTranslator, ordinals, fixLeadingOrdinal, suffix } = require('./src/i18n/translate');
const { buildCatalogue, missing, TA } = require('./scripts/i18n/build');

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
let checks = 0;
function check(name, fn) {
  try { fn(); checks += 1; } catch (e) { e.message = `${name}: ${e.message}`; throw e; }
}

// 1. the translator, on a small catalogue
const tiny = buildTranslator({
  exact: {
    சூரியன்: 'Sun', செவ்வாய்: 'Mars', 'weekday::செவ்வாய்': 'Tuesday', குரு: 'Jupiter', 'abbr::குரு': 'Ju', அசுவினி: 'Ashwini',
    சித்திரை: 'Chitra', 'month::சித்திரை': 'Chithirai', '-இலிருந்து': 'from', '-ஆம் வீடு': 'th house', 'நாள் மீதம்': 'days left',
  },
  patterns: [
    ['{0} தசை', '{0} Dasha'],
    ['{0}-ஆம் வீடு', '{0}th house'],
    ['{0}-இலிருந்து {1}-ஆவது நட்சத்திரம்', '{1}th nakshatra from {0}'],
    ['{0} · {1}கிழமை', '{0} · {1}'],
    ['{0} · {1} மாதம்', '{0} · {1}'],
    ['சூரிய உதயத்துக்கு முன் (நாள்: {0})', 'Before sunrise (day: {0})'],
    ['({0} வரை)', '(until {0})'],
  ],
});

check('exact, with the text\'s own spaces', () => {
  assert.equal(tiny.translate('சூரியன்'), 'Sun');
  assert.equal(tiny.translate(' சூரியன் '), ' Sun ');
  assert.equal(tiny.translate('Sun'), null);
  assert.equal(tiny.translate('தெரியாத சொல்'), null);
});
check('a pattern, its Tamil part looked up', () => {
  assert.equal(tiny.translate('குரு தசை'), 'Jupiter Dasha');
  assert.equal(tiny.translate('அசுவினி-இலிருந்து 5-ஆவது நட்சத்திரம்'), '5th nakshatra from Ashwini');
});
check('ordinals', () => {
  assert.equal(tiny.translate('3-ஆம் வீடு'), '3rd house');
  assert.equal(tiny.translate('11-ஆம் வீடு'), '11th house');
  assert.equal(tiny.translate('22-ஆம் வீடு'), '22nd house');
  assert.equal(ordinals('1th, 2th, 3th, 4th, 11th, 12th, 13th, 21th, 102th, v1.2th'), '1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st, 102nd, v1.2th');
  assert.equal(fixLeadingOrdinal('3', 'th house'), 'rd house');
  assert.equal(fixLeadingOrdinal('12', 'th house'), 'th house');
  assert.equal(fixLeadingOrdinal('சூரியன்', 'th house'), 'th house');
  assert.equal(suffix(101), 'st');
});
check('a word\'s sense from the page\'s context (data-i18n-ctx)', () => {
  assert.equal(tiny.translate('செவ்வாய்'), 'Mars');
  assert.equal(tiny.translate('செவ்வாய்', 'weekday'), 'Tuesday');
  assert.equal(tiny.translate('குரு', 'abbr'), 'Ju');
  assert.equal(tiny.translate('சூரியன்', 'weekday'), 'Sun', 'a word without a sense in that context keeps its own');
  assert.equal(tiny.translate('சூரிய உதயத்துக்கு முன் (நாள்: செவ்வாய்)', 'weekday'), 'Before sunrise (day: Tuesday)', 'the context reaches a pattern\'s parts');
});
check('a word\'s sense from the word after it', () => {
  assert.equal(tiny.translate('12-03-2026 · செவ்வாய்கிழமை'), '12-03-2026 · Tuesday');
  assert.equal(tiny.translate('தசமி · சித்திரை மாதம்'), 'தசமி · Chithirai', 'a part with no English stays as it is');
});
check('segments and words inside other text', () => {
  assert.equal(tiny.translate('சூரியன் · செவ்வாய்'), 'Sun · Mars');
  assert.equal(tiny.translate('10:30 (செவ்வாய்)', 'weekday'), '10:30 (Tuesday)');
  assert.equal(tiny.translate('10:30 (செவ்வாய்)'), '10:30 (Mars)');
  assert.equal(tiny.translate('10:30 (தெரியாதது)'), null);
});
check('a Tamil suffix written onto the text before it', () => {
  assert.equal(tiny.translate('-இலிருந்து'), ' from', 'its English is a word of its own');
  assert.equal(tiny.translate('-ஆம் வீடு'), 'th house', 'an ordinal stays on its number');
  assert.equal(tiny.translate('நாள் மீதம்'), 'days left');
});
check('the texts of one element, read together', () => {
  assert.deepEqual(tiny.translateParts(['(', '06:57', ' வரை)']), ['(until 06:57)', '', '']);
  assert.equal(tiny.translateParts(['06:57', ' 07:10']), null);
});

// 2-4. the catalogue
const { catalogue, extracted } = buildCatalogue(ROOT);
const onDisk = JSON.parse(read('src/i18n/en.json'));
check('en.json is what the build makes today', () => {
  assert.deepEqual(onDisk, JSON.parse(JSON.stringify(catalogue)), 'src/i18n/en.json is stale: run node scripts/i18n/build.js');
});
check('no English holds Tamil; a pattern\'s placeholders match', () => {
  for (const [ta, en] of Object.entries(catalogue.exact)) assert.ok(!TA.test(en), `Tamil in the English of "${ta}": ${en}`);
  const ph = (s) => (s.match(/\{\d+\}/g) || []).sort().join();
  for (const [ta, en] of catalogue.patterns) {
    assert.ok(!TA.test(en), `Tamil in the English of "${ta}": ${en}`);
    assert.equal(ph(en), ph(ta), `placeholders of "${ta}"`);
  }
});
check('every Tamil text of the interface has English, wholly', () => {
  const ui = extracted.keys.filter((e) => e.kind === 'ui');
  assert.ok(ui.length > 4000, `only ${ui.length} interface texts found: is the extraction broken?`);
  const left = missing(catalogue, extracted).filter((e) => e.kind === 'ui').map((e) => `${e.k}  (${e.files[0]})`);
  assert.deepEqual(left, [], 'interface texts without English: add them to src/i18n/catalog/*.json, then node scripts/i18n/build.js');
});
const tr = buildTranslator(onDisk);
check('the real catalogue on texts of the pages', () => {
  assert.equal(tr.translate('⚙️ அமைப்புகள்'), '⚙️ Settings');
  assert.equal(tr.translate('வளர்பிறை திரயோதசி'), 'Shukla Trayodashi');
  assert.equal(tr.translate('தேய்பிறை அமாவாசை'), 'Krishna Amavasya');
  assert.equal(tr.translate('செவ்வாய்கிழமை'), 'Tuesday');
  assert.equal(tr.translate('செவ்வாய்', 'weekday'), 'Tuesday');
  assert.equal(tr.translate('செவ்வாய்'), 'Mars');
  assert.equal(tr.translate('சித்திரை', 'month'), 'Chithirai');
  assert.equal(tr.translate('குரு', 'abbr'), 'Ju');
  assert.equal(tr.translate('ராசிக்கு 3-ஆம் வீடு'), '3rd house from the Moon sign');
});

// 5. the wiring
check('boot script, translator, switch', () => {
  const layout = read('app/layout.tsx');
  assert.match(layout, /LANG_BOOT_SCRIPT/);
  assert.match(layout, /suppressHydrationWarning/);
  assert.match(read('src/navigation/MainLayout.tsx'), /<Translator \/>/);
  assert.match(read('src/i18n/LangToggle.tsx'), /data-no-translate/);
  assert.match(read('src/i18n/lang.ts'), /LANG_KEY = 'kotravel-lang'/);
  assert.match(read('src/i18n/lang.ts'), /data-translated/, 'the boot script must uncover the page even if the translator never runs');
  assert.match(read('app/globals.css'), /html\[data-lang='en'\]:not\(\[data-translated\]\) body/);
  const t = read('src/i18n/Translator.tsx');
  for (const s of ["'TEXTAREA'", "'INPUT'", "'CODE'", 'data-no-translate', 'isContentEditable']) assert.ok(t.includes(s), `Translator must skip ${s}`);
});
check('every short planet name of the worksheet chart has its two letters', () => {
  const src = read('app/worksheet/WorksheetChart.tsx');
  assert.match(src, /data-i18n-ctx="abbr"/);
  const names = [...src.match(/As: 'லக்'[^\n]*/)[0].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  assert.ok(names.length >= 11);
  for (const ta of names) assert.ok(onDisk.exact[`abbr::${ta}`], `abbr::${ta}`);
});
check('weekdays are marked where a bare weekday is shown', () => {
  assert.match(read('app/HomeView.tsx'), /data-i18n-ctx="weekday">\{today\.weekdayTa\}/);
  assert.match(read('app/worksheet/BirthDetails.tsx'), /data-i18n-ctx="weekday">\{p\.weekdayTa\}/);
  assert.match(read('app/book/BookView.tsx'), /data-i18n-ctx=\{k === 'கிழமை' \? 'weekday'/);
});

const ui = extracted.keys.filter((e) => e.kind === 'ui').length;
console.log(`i18n: ${checks} checks passed · ${Object.keys(onDisk.exact).length} entries, ${onDisk.patterns.length} patterns · ${ui} interface texts, all in English`);
