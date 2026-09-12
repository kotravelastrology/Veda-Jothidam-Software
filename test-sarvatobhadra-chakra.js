const assert = require('node:assert/strict');
const { BORDER_SEQUENCE, vedhaOf, calculateSarvatobhadraChakra } = require('./src/chart/sarvatobhadraChakra');

// --- Border sequence sanity ---
assert.equal(BORDER_SEQUENCE.length, 28, 'grid has 27 nakshatras + Abhijit = 28 border cells');
assert.equal(BORDER_SEQUENCE[0], 'Krittika', 'sequence starts at Krittika (East)');
assert.ok(BORDER_SEQUENCE.includes('Abhijit'), 'Abhijit is on the border');
const uaIdx = BORDER_SEQUENCE.indexOf('Uttara Ashadha');
assert.equal(BORDER_SEQUENCE[uaIdx + 1], 'Abhijit', 'Abhijit sits right after Uttara Ashadha');
assert.equal(BORDER_SEQUENCE[uaIdx + 2], 'Shravana', 'and right before Shravana');

// --- Vedha rules, cross-checked against IJATET Vol.7 Issue.1 p.48-49's own
// worked examples (see sarvatobhadraChakra.js header for exact quotes) ---
const krittika = vedhaOf('Krittika');
assert.equal(krittika.direct, 'Shravana');
assert.equal(krittika.forward, 'Vishakha');
assert.equal(krittika.backward, 'Bharani');

const ashwini = vedhaOf('Ashwini');
assert.equal(ashwini.direct, 'Purva Phalguni');
assert.equal(ashwini.forward, 'Rohini');
assert.equal(ashwini.backward, 'Jyeshtha');

const swati = vedhaOf('Swati');
assert.equal(swati.direct, 'Shatabhisha');
assert.equal(swati.forward, 'Jyeshtha');
assert.equal(swati.backward, 'Rohini');

const purvashadha = vedhaOf('Purva Ashadha');
assert.equal(purvashadha.direct, 'Ardra');
assert.equal(purvashadha.forward, 'Uttara Bhadrapada');
assert.equal(purvashadha.backward, 'Hasta');

// Every border nakshatra must resolve a full, non-null Vedha triple (grid is
// fully self-consistent with no dangling references).
for (const name of BORDER_SEQUENCE) {
  const v = vedhaOf(name);
  assert.ok(v.direct && v.forward && v.backward, `${name} has a complete Vedha triple`);
}

// --- Natal application ---
// Moon in Krittika (27.5 deg, safely inside Krittika's 26:40-40:00 span),
// Mars sitting on Krittika's forward-Vedha partner (Vishakha, ~206 deg).
const result = calculateSarvatobhadraChakra({
  Sun: 10, Moon: 27.5, Mars: 206, Mercury: 10, Jupiter: 100, Venus: 40, Saturn: 280, Rahu: 60, Ketu: 240,
}, 15);
assert.equal(result.janmaNakshatra, 'Krittika');
assert.equal(result.janmaVedha.forward.nakshatra, 'Vishakha');
assert.ok(result.janmaVedha.forward.grahas.includes('Mars'), 'Mars in Vishakha shows up as a forward-Vedha affliction on Janma nakshatra');
assert.ok(result.janmaVedha.forward.malefic.includes('Mars'));
assert.equal(result.source.title, 'Saravatobhadra Chakra in Astrology');

console.log(JSON.stringify({
  pass: true,
  borderLength: BORDER_SEQUENCE.length,
  janmaNakshatra: result.janmaNakshatra,
  janmaForwardVedha: result.janmaVedha.forward,
}, null, 2));
