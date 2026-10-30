const assert = require('assert');
const { houseSignificators } = require('./src/report/kpHouseSignificators');

// The book's own example (p.149): Aries ascendant, Moon in Mrigashira (Mars's star), Mars the lone occupant of the 4th: the Moon is
// the strongest significator of the 4th. The rest are placed so the other levels can be seen.
const cusps = Array.from({ length: 12 }, (_, i) => ({ number: i + 1, signLord: ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'][i] }));
const positions = [
  { name: 'Mars', house: 4, starLord: 'Moon' },
  { name: 'Moon', house: 2, starLord: 'Mars' },
  { name: 'Sun', house: 7, starLord: 'Venus' },
  { name: 'Venus', house: 7, starLord: 'Jupiter' },
  { name: 'Jupiter', house: 9, starLord: 'Saturn' },
  { name: 'Mercury', house: 7, starLord: 'Mars' },
];
const h = houseSignificators({ positions, cusps });
const h4 = h[3];
assert.deepStrictEqual(h4.level2, ['Mars']);
assert.deepStrictEqual(h4.level1.sort(), ['Mercury', 'Moon'], 'the Moon (and Mercury) are in the star of the occupant Mars');
assert.strictEqual(h4.owner, 'Moon');
assert.deepStrictEqual(h4.level3, ['Mars'], 'in the Moon\'s star: Mars');
// the 7th: Sun, Venus and Mercury occupy; the Sun is in the star of an occupant (Venus)
const h7 = h[6];
assert.deepStrictEqual(h7.level2.sort(), ['Mercury', 'Sun', 'Venus']);
assert.deepStrictEqual(h7.level1, ['Sun']);
// an empty house: the 1st has no planet; planets in the star of its owner (Mars) are strong; the owner only if none is
const h1 = h[0];
assert.deepStrictEqual(h1.level2, []);
assert.strictEqual(h1.level3Strong, true);
assert.deepStrictEqual(h1.level3.sort(), ['Mercury', 'Moon'], 'in the star of Mars');
assert.strictEqual(h1.level4Strong, false);
// the 3rd: empty, owner Mercury, no planet in Mercury's star: the owner is a strong significator
const h3 = h[2];
assert.deepStrictEqual(h3.level3, []);
assert.strictEqual(h3.level4Strong, true);
// golden rule: three or more from levels 1 and 2
assert.strictEqual(h7.goldenRuleStop, true);
assert.strictEqual(h4.goldenRuleStop, true);
assert.strictEqual(h1.goldenRuleStop, false);
console.log('test-kp-house-significators ok');
