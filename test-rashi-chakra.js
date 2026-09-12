const assert = require('node:assert/strict');
const { RASHI_BORDER_SEQUENCE, rashiOf, getRashiElement, calculateRashiChakra } = require('./src/chart/rashiChakra');

// --- Border sequence sanity ---
// Rashi Chakra: 12 signs/houses arranged around 9×9 grid border
// Classical order: Aries → Taurus → ... → Pisces (clockwise)
assert.equal(RASHI_BORDER_SEQUENCE.length, 12, 'grid has 12 houses/signs');
assert.equal(RASHI_BORDER_SEQUENCE[0], 'Aries', 'sequence starts at Aries (East)');
assert.equal(RASHI_BORDER_SEQUENCE[6], 'Libra', 'Libra is at position 7 (opposite Aries)');

// Verify Rashi element classification
const aries = rashiOf('Aries');
assert.ok(aries.element, 'Aries has an element');
assert.equal(aries.element, 'Fire', 'Aries is Fire sign');

const taurus = rashiOf('Taurus');
assert.equal(taurus.element, 'Earth', 'Taurus is Earth sign');

const gemini = rashiOf('Gemini');
assert.equal(gemini.element, 'Air', 'Gemini is Air sign');

const cancer = rashiOf('Cancer');
assert.equal(cancer.element, 'Water', 'Cancer is Water sign');

// Verify Rashi lord (planetary ruler)
assert.ok(aries.lord, 'Aries has a Rashi lord');
assert.equal(aries.lord, 'Mars', 'Aries is ruled by Mars');
assert.equal(taurus.lord, 'Venus', 'Taurus is ruled by Venus');

// Every rashi must have element and lord (grid is fully consistent)
for (const name of RASHI_BORDER_SEQUENCE) {
  const r = rashiOf(name);
  assert.ok(r.element, `${name} has a valid element`);
  assert.ok(r.lord, `${name} has a valid lord`);
}

// --- Natal application ---
// Lagna at 15 degrees (Aries)
// Sun at 10 degrees (Aries), Moon at 40 degrees (Taurus), Mars at 206 degrees (Libra)
const result = calculateRashiChakra(
  {
    Sun: 10, Moon: 40, Mars: 206, Mercury: 10, Jupiter: 100, Venus: 40, Saturn: 280, Rahu: 60, Ketu: 240,
  },
  15 // Lagna in Aries
);

assert.ok(result.grid, 'Rashi Chakra grid is generated');
assert.equal(result.grid.length, 12, 'grid has 12 positions (signs)');
assert.ok(result.grahaRashi, 'graha rashi mapping is provided');
assert.ok(result.lagnaRashi, 'lagna rashi is identified');
assert.equal(result.lagnaRashi, 'Aries', 'Lagna in Aries');
assert.ok(result.source.title, 'source attribution present');

// Verify grahas are in correct rashis
assert.equal(result.grahaRashi.Sun, 'Aries', 'Sun in Aries');
assert.equal(result.grahaRashi.Moon, 'Taurus', 'Moon in Taurus');
assert.equal(result.grahaRashi.Mars, 'Libra', 'Mars in Libra');

console.log(JSON.stringify({
  pass: true,
  borderLength: RASHI_BORDER_SEQUENCE.length,
  lagnaRashi: result.lagnaRashi,
  grahaRashis: result.grahaRashi,
  rashiElements: {
    aries: rashiOf('Aries').element,
    taurus: rashiOf('Taurus').element,
    gemini: rashiOf('Gemini').element,
    cancer: rashiOf('Cancer').element,
    libra: rashiOf('Libra').element,
    pisces: rashiOf('Pisces').element
  },
  rashiLords: {
    aries: rashiOf('Aries').lord,
    taurus: rashiOf('Taurus').lord,
    leo: rashiOf('Leo').lord,
    scorpio: rashiOf('Scorpio').lord
  }
}, null, 2));
