const assert = require('assert');
const L = require('./src/report/kpLagnaStars');

// as printed on pp.42-110, for every lagna: the houses each star lord owns (Reader V text, checked sign by sign)
const BOOK = {
  Aries: { Venus: [2, 7], Sun: [5], Moon: [4], Mars: [1, 8], Jupiter: [9, 12], Saturn: [10, 11], Mercury: [3, 6] },
  Taurus: { Venus: [1, 6], Sun: [4], Moon: [3], Mars: [7, 12], Jupiter: [8, 11], Saturn: [9, 10], Mercury: [2, 5] },
  Gemini: { Venus: [5, 12], Sun: [3], Moon: [2], Mars: [6, 11], Saturn: [8, 9], Mercury: [1, 4] },
  Cancer: { Venus: [4, 11], Sun: [2], Mercury: [3, 12], Jupiter: [6, 9], Saturn: [7, 8] },
  Leo: { Venus: [3, 10], Mars: [4, 9], Saturn: [6, 7], Mercury: [2, 11] },
  Virgo: { Venus: [2, 9], Mars: [3, 8], Saturn: [5, 6] },
  Libra: { Venus: [1, 8], Mars: [2, 7] },
  Scorpio: { Venus: [7, 12], Jupiter: [2, 5], Mercury: [8, 11] },
  Sagittarius: { Moon: [8], Saturn: [2, 3], Mercury: [7, 10] },
  Capricorn: { Venus: [5, 10], Sun: [8] },
  Aquarius: { Sun: [7], Moon: [6], Jupiter: [2, 11], Saturn: [1, 12], Mercury: [5, 8] },
  Pisces: { Venus: [3, 8], Mars: [2, 9], Mercury: [4, 7] },
};
for (const [sign, lords] of Object.entries(BOOK)) for (const [lord, houses] of Object.entries(lords)) assert.deepStrictEqual(L.housesOwned(sign, lord), houses, `${sign} ${lord}`);

// every lagna: the seven planets own the twelve houses exactly once between them, the Sun and Moon one each
for (const sign of L.SIGNS) {
  const all = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].flatMap((p) => L.housesOwned(sign, p)).sort((a, b) => a - b);
  assert.deepStrictEqual(all, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
}
// the table: nine groups of three stars, 27 in all, the nodes as agents
const t = L.lagnaStarTable('Aries');
assert.deepStrictEqual(t.map((r) => r.lord), ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']);
assert.strictEqual(t.flatMap((r) => r.stars).length, 27);
assert.deepStrictEqual(t.filter((r) => r.agent).map((r) => r.lord), ['Ketu', 'Rahu']);
assert.deepStrictEqual(t.find((r) => r.lord === 'Saturn').stars, ['Pushya', 'Anuradha', 'Uttara Bhadrapada']);
assert.throws(() => L.housesOwned('Nope', 'Sun'), RangeError);
console.log('test-kp-lagna-stars ok');
