const assert = require('node:assert/strict');
const { NADI_BORDER_SEQUENCE, nadiOf, calculateNadiChakra } = require('./src/chart/nadiChakra');

// --- Border sequence sanity ---
// Nadi Chakra: 28 nakshatras arranged by Nadi classification (Ida/Pingala/Sushumna)
// Border placement follows Nadi Chakra classical geometry (source: IJATET 2022 paper)
assert.equal(NADI_BORDER_SEQUENCE.length, 28, 'grid has 27 nakshatras + Abhijit = 28 border cells');

// Verify all 28 standard nakshatras are present
const allNakshatras = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Abhijit', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
];

for (const nakshatra of allNakshatras) {
  assert.ok(
    NADI_BORDER_SEQUENCE.includes(nakshatra),
    `${nakshatra} is on the Nadi Chakra border`
  );
}

// --- Nadi classification (Ida/Pingala/Sushumna) ---
// Each nakshatra belongs to one of three Nadis, which affects its position and properties
const ashwini = nadiOf('Ashwini');
assert.ok(ashwini.nadi, `Ashwini has a Nadi classification`);
assert.ok(['Ida', 'Pingala', 'Sushumna'].includes(ashwini.nadi), `Nadi is one of Ida/Pingala/Sushumna`);

// Verify Nadi assignments for key nakshatras
const krittika = nadiOf('Krittika');
const swati = nadiOf('Swati');
const revati = nadiOf('Revati');

assert.ok(krittika.nadi, 'Krittika has Nadi assignment');
assert.ok(swati.nadi, 'Swati has Nadi assignment');
assert.ok(revati.nadi, 'Revati has Nadi assignment');

// Every border nakshatra must resolve a non-null Nadi (grid is fully self-consistent)
for (const name of NADI_BORDER_SEQUENCE) {
  const n = nadiOf(name);
  assert.ok(n.nadi, `${name} has a valid Nadi classification`);
}

// --- Natal application ---
// Moon in Krittika (27.5 deg), Lagna in Bharani (14 deg)
// Test that Nadi Chakra grid renders correctly with grahas positioned by nakshatra
const result = calculateNadiChakra({
  Sun: 10, Moon: 27.5, Mars: 206, Mercury: 10, Jupiter: 100, Venus: 40, Saturn: 280, Rahu: 60, Ketu: 240,
}, 15);

assert.ok(result.grid, 'Nadi Chakra grid is generated');
assert.equal(result.grid.length, 28, 'grid has 28 positions (nakshatras)');
assert.ok(result.grahaNakshatra, 'graha nakshatra mapping is provided');
assert.ok(result.lagnaNakshatra, 'lagna nakshatra is identified');
assert.ok(result.janmaNakshatra, 'janma (moon) nakshatra is identified');
assert.equal(result.janmaNakshatra, 'Krittika', 'Moon in Krittika');
assert.equal(result.source.title, 'Nadi Chakra in Astrology', 'source attribution present');

console.log(JSON.stringify({
  pass: true,
  borderLength: NADI_BORDER_SEQUENCE.length,
  janmaNakshatra: result.janmaNakshatra,
  lagnaNakshatra: result.lagnaNakshatra,
  nadiClassifications: {
    ashwini: nadiOf('Ashwini').nadi,
    krittika: nadiOf('Krittika').nadi,
    swati: nadiOf('Swati').nadi,
    revati: nadiOf('Revati').nadi
  },
}, null, 2));
