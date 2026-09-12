const assert = require('node:assert/strict');
const { DASHA_BORDER_SEQUENCE, dashaOf, calculateDashaChakra } = require('./src/chart/dashaChakra');

// --- Border sequence sanity ---
// Dasha Chakra: 28 nakshatras arranged by Vimshottari Dasha sequence
// Border placement follows Vimshottari lord order (Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury)
assert.equal(DASHA_BORDER_SEQUENCE.length, 28, 'grid has 27 nakshatras + Abhijit = 28 border cells');

// Verify Dasha lord assignment for each border nakshatra
const ketu = dashaOf('Ashwini');
assert.ok(ketu.dashaLord, 'Ashwini has a Dasha lord');
assert.equal(ketu.dashaLord, 'Ketu', 'Ashwini is ruled by Ketu in Vimshottari');

const venus = dashaOf('Bharani');
assert.ok(venus.dashaLord, 'Bharani has a Dasha lord');
assert.equal(venus.dashaLord, 'Venus', 'Bharani is ruled by Venus in Vimshottari');

const sun = dashaOf('Krittika');
assert.ok(sun.dashaLord, 'Krittika has a Dasha lord');
assert.equal(sun.dashaLord, 'Sun', 'Krittika is ruled by Sun in Vimshottari');

// Every border nakshatra must have a Dasha lord assignment (grid is fully consistent)
for (const name of DASHA_BORDER_SEQUENCE) {
  const d = dashaOf(name);
  assert.ok(d.dashaLord, `${name} has a valid Dasha lord assignment`);
}

// --- Natal application ---
// Moon in Krittika (27.5 deg), Lagna in Bharani (14 deg)
// Current Mahadasha: Sun (for example: birth JD = 2450000, Sun lord placed at center)
// Test that Dasha Chakra grid renders with current Mahadasha in center and grahas on border
const result = calculateDashaChakra(
  {
    Sun: 10, Moon: 27.5, Mars: 206, Mercury: 10, Jupiter: 100, Venus: 40, Saturn: 280, Rahu: 60, Ketu: 240,
  },
  15,
  'Sun' // Current Mahadasha lord
);

assert.ok(result.grid, 'Dasha Chakra grid is generated');
assert.equal(result.grid.length, 28, 'grid has 28 positions (nakshatras)');
assert.ok(result.grahaNakshatra, 'graha nakshatra mapping is provided');
assert.ok(result.lagnaNakshatra, 'lagna nakshatra is identified');
assert.ok(result.janmaNakshatra, 'janma (moon) nakshatra is identified');
assert.equal(result.janmaNakshatra, 'Krittika', 'Moon in Krittika');
assert.equal(result.currentMahadashaLord, 'Sun', 'current Mahadasha lord is Sun');
assert.ok(result.source.title, 'source attribution present');

// Verify center position has the current Mahadasha lord visualization
assert.ok(result.centerCell, 'center cell data exists');
assert.equal(result.centerCell.dashaLord, 'Sun', 'center displays current Mahadasha lord');

console.log(JSON.stringify({
  pass: true,
  borderLength: DASHA_BORDER_SEQUENCE.length,
  janmaNakshatra: result.janmaNakshatra,
  lagnaNakshatra: result.lagnaNakshatra,
  currentMahadashaLord: result.currentMahadashaLord,
  dashaLordAssignments: {
    ashwini: dashaOf('Ashwini').dashaLord,
    bharani: dashaOf('Bharani').dashaLord,
    krittika: dashaOf('Krittika').dashaLord,
    revati: dashaOf('Revati').dashaLord
  },
}, null, 2));
