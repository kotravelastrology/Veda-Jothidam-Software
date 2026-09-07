const assert = require('node:assert/strict');
const { calculateAshtakavarga } = require('./src/chart/ashtakavarga');
const {
  calculateTransitContext, evaluateTransit, classifyBhinnaBindus, classifySarvaBindus, BHINNA_BINDU_LABELS,
} = require('./src/chart/ashtakavargaTransit');

// Bhinnashtakavarga classification (Ch.3 item 9): every one of the 9 named tiers, 0-8.
assert.equal(BHINNA_BINDU_LABELS.length, 9);
assert.equal(classifyBhinnaBindus(0), 'Calamitous');
assert.equal(classifyBhinnaBindus(4), 'Average');
assert.equal(classifyBhinnaBindus(8), 'Magnificent');
assert.equal(classifyBhinnaBindus(5), 'Advantageous');
assert.equal(classifyBhinnaBindus(3), 'Tolerable');

// Sarvashtakavarga classification (Ch.3 items 1 & 3): <21 very inauspicious,
// 21-24 inauspicious, 25-30 average, >30 auspicious.
assert.equal(classifySarvaBindus(20), 'Very inauspicious');
assert.equal(classifySarvaBindus(21), 'Inauspicious');
assert.equal(classifySarvaBindus(24), 'Inauspicious');
assert.equal(classifySarvaBindus(25), 'Average');
assert.equal(classifySarvaBindus(28), 'Average');
assert.equal(classifySarvaBindus(30), 'Average');
assert.equal(classifySarvaBindus(31), 'Auspicious');
assert.equal(classifySarvaBindus(37), 'Auspicious');

// evaluateTransit: uses a real natal Ashtakavarga (from S9) and looks up the
// exact bindu counts for the transiting sign.
const natalChart = { Sun: 0, Moon: 3, Mars: 7, Mercury: 5, Jupiter: 8, Venus: 6, Saturn: 9, Lagna: 4 };
const natalAshtakavarga = calculateAshtakavarga(natalChart);
const reading = evaluateTransit('Saturn', 2, natalAshtakavarga);
assert.equal(reading.bhinnaBindus, natalAshtakavarga.bhinna.Saturn[2]);
assert.equal(reading.sarvaBindus, natalAshtakavarga.sarva[2]);
assert.equal(reading.bhinnaClassification, classifyBhinnaBindus(reading.bhinnaBindus));
assert.equal(reading.sarvaClassification, classifySarvaBindus(reading.sarvaBindus));

// calculateTransitContext: full integration across all 7 classical grahas transiting.
const transitPositions = {
  Sun: 4, Moon: 9, Mars: 1, Mercury: 11, Jupiter: 2, Venus: 6, Saturn: 8,
};
const context = calculateTransitContext(transitPositions, natalAshtakavarga);
assert.equal(Object.keys(context.perPlanet).length, 7);
for (const planet of Object.keys(transitPositions)) {
  assert.equal(context.perPlanet[planet].rasiIndex, transitPositions[planet]);
}
assert.equal(context.source.title, 'Practical Ashtakavarga');

// A planet missing from the transit input is simply skipped, not fabricated.
const partial = calculateTransitContext({ Sun: 0 }, natalAshtakavarga);
assert.deepEqual(Object.keys(partial.perPlanet), ['Sun']);

console.log(JSON.stringify({ pass: true, saturnTransitInGemini: reading }, null, 2));
