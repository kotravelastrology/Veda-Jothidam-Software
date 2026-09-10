const assert = require('node:assert/strict');
const {
  buildTamilCalendar, resolveAllFestivals, tamilDate, panchangaAtJd, FESTIVAL_RULES, SAMVATSARA,
} = require('./src/report/tamilCalendar');
const { julianDay } = require('@swisseph/node');

// Chennai
const LAT = 13.0827;
const LON = 80.2707;

// ── 60-year Samvatsara cycle ─────────────────────────────────────────
assert.equal(SAMVATSARA.length, 60);
assert.equal(SAMVATSARA[0], 'Prabhava');
assert.equal(SAMVATSARA[59], 'Akshaya');
// indexed from Prabhava = Tamil year beginning Chittirai 1987
assert.equal(SAMVATSARA[((2025 - 1987) % 60)], 'Vishvavasu');   // 2025-26 Tamil year
assert.equal(SAMVATSARA[((2026 - 1987) % 60)], 'Parabhava');    // 2026-27

// ── panchangaAtJd sanity: tithi 0-29, nakshatra 0-26, signs 0-11 ─────
const p = panchangaAtJd(julianDay(2026, 9, 10, 6), 'Lahiri');
assert.ok(p.tithiIndex >= 0 && p.tithiIndex < 30);
assert.ok(p.nakshatraIndex >= 0 && p.nakshatraIndex < 27);
assert.ok(p.sunSign >= 0 && p.sunSign < 12);

// ── today's Tamil date ──────────────────────────────────────────────
const td = tamilDate(Date.UTC(2026, 8, 10, 6, 0), LAT, LON, 'Lahiri');
assert.equal(td.gregorian, '2026-09-10');
assert.equal(td.month.en, 'Aavani');                 // Sun in Simha in mid-Sep
assert.equal(td.samvatsara.name, 'Parabhava');
assert.equal(td.ayana.en, 'Dakṣiṇāyana');            // Simha → southern course
assert.equal(td.vaara.name, 'வியாழன்');              // 2026-09-10 is a Thursday
assert.ok(td.tithi.name && td.nakshatra.name);

// ── festival resolution for 2026 (dṛk vs Drik Panchang) ─────────────
const fests = resolveAllFestivals(2026, LAT, LON, 'Lahiri');
const byKey = Object.fromEntries(fests.map((f) => [f.rule.key, f.dateStr]));
assert.equal(byKey['thai-pongal'], '2026-01-14');       // Makara sankrānti 2026
assert.equal(byKey['puthandu'], '2026-04-14');          // Meṣa sankrānti 2026
assert.equal(byKey['maha-shivaratri'], '2026-02-15');
assert.equal(byKey['deepavali'], '2026-11-08');
assert.equal(byKey['vinayagar-chaturthi'], '2026-09-14');
assert.equal(byKey['vijayadasami'], '2026-10-20');
assert.equal(byKey['vaikunta-ekadashi'], '2026-12-20');
assert.equal(byKey['aadi-pooram'], '2026-08-14');       // matches AstrologicLab's own note

// every resolved festival: a real ISO date in 2026, sorted, and rules carry a label
let prev = '';
for (const f of fests) {
  assert.match(f.dateStr, /^2026-\d{2}-\d{2}$/);
  assert.ok(f.dateStr >= prev, 'festivals sorted by date');
  prev = f.dateStr;
  assert.ok(f.rule.ta && f.rule.en && f.rule.note);
  // non-reference rules must cite a source
  if (!f.rule.reference) assert.ok(f.rule.source, `${f.rule.key} cites a source`);
}
assert.ok(fests.length >= 18, `resolved ${fests.length} festivals`);

// ── orchestrator ───────────────────────────────────────────────────
const cal = buildTamilCalendar({ year: 2026, latitude: LAT, longitude: LON, todayMs: Date.UTC(2026, 8, 10, 6, 0) });
assert.equal(cal.available, true);
assert.equal(cal.year, 2026);
assert.equal(cal.today.month.en, 'Aavani');
assert.equal(cal.festivals.length, fests.length);
assert.ok(cal.festivals[0].weekday && cal.festivals[0].date);
assert.ok(cal.festivals.some((f) => f.reference));       // aadi-pooram / sri-jayanti flagged

console.log(JSON.stringify({
  pass: true,
  samvatsara: cal.today.samvatsara.name,
  todayMonth: cal.today.month.en,
  todayTithi: cal.today.tithi.name,
  festivals: cal.festivals.length,
  pongal: byKey['thai-pongal'],
  deepavali: byKey['deepavali'],
}, null, 2));
