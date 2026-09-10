const assert = require('node:assert/strict');
const { calculateNakshatraExtras, taraBala, PADA_SYLLABLES } = require('./src/report/nakshatraExtras');
const { shashtiamsaDeity } = require('./src/chart/vargaChart');

// ── Tara Bala: inclusive forward count -> 1-27 -> 9 categories ──────────
assert.deepEqual(
  { d: taraBala(5, 5).distance, c: taraBala(5, 5).category, n: taraBala(5, 5).name },
  { d: 1, c: 1, n: 'Janma' },
);
assert.equal(taraBala(0, 3).name, 'Kshema');     // distance 4 -> category 4
assert.equal(taraBala(0, 3).favorable, true);
assert.equal(taraBala(0, 1).name, 'Sampat');     // distance 2
assert.equal(taraBala(0, 2).favorable, false);   // Vipat
// distance wraps at 27, category cycles every 9
assert.equal(taraBala(26, 0).distance, 2);
assert.equal(taraBala(0, 26).distance, 27);
assert.equal(taraBala(0, 26).category, 9);        // Ati-Mitra

// ── 108-pada syllable table: 27 nakshatras x 4 padas ──────────────────
assert.equal(PADA_SYLLABLES.length, 27);
for (const row of PADA_SYLLABLES) assert.equal(row.length, 4);
assert.deepEqual(PADA_SYLLABLES[0], ['Chu', 'Che', 'Cho', 'La']); // Ashwini

// ── D60 deity: 60 entries, odd signs 1->60 direct, even 60->1 reverse ─
// 0deg-0.5deg of an odd sign -> #1 Ghora (malefic); of an even sign -> #60 (benefic).
assert.equal(shashtiamsaDeity(0).number, 1);
assert.equal(shashtiamsaDeity(0).name, 'Ghora');
assert.equal(shashtiamsaDeity(0).benefic, false);
assert.equal(shashtiamsaDeity(30).number, 60);      // start of Taurus (even)
assert.equal(shashtiamsaDeity(30).benefic, true);
assert.equal(shashtiamsaDeity(29.9).number, 60);    // end of Aries (odd) -> #60

// ── Full block ───────────────────────────────────────────────────────
const e = calculateNakshatraExtras(
  268.31,           // natal Moon -> Uttara Ashadha pada 1
  268.31 + 40,      // transit Moon 40deg ahead
  { Sun: 30.27, Moon: 268.31, Saturn: 271.53 },
);
assert.equal(e.available, true);
assert.equal(e.janmaNakshatra, 'Uttara Ashadha');
assert.equal(e.janmaPada, 1);
assert.equal(e.nameSyllable, 'Bhe');
assert.equal(e.nakshatraSyllables.length, 4);
assert.ok(e.todayNakshatra);
assert.ok(e.todayTaraBala && e.todayTaraBala.name);
assert.ok(e.shashtiamsa.Sun && typeof e.shashtiamsa.Sun.benefic === 'boolean');

console.log(JSON.stringify({
  pass: true, janma: e.janmaNakshatra, syllable: e.nameSyllable,
  todayTara: e.todayTaraBala.name, sunD60: e.shashtiamsa.Sun.name,
}, null, 2));
