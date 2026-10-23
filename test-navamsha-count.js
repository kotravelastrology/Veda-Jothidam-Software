const assert = require('assert');
const N = require('./src/chart/navamshaCount');
const NAVAMSHA = N.NAVAMSHA;

assert.strictEqual(N.indexOf(0), 0);
assert.strictEqual(N.indexOf(3.34), 1);
assert.strictEqual(N.indexOf(359.99), 107);
assert.strictEqual(N.countBetween(5, 5), 1, 'both ends included');
assert.strictEqual(N.countBetween(107, 0), 2);

// PL9's "Navamsha ages" screen (Aniruddha, 5 Oct 1990, Chennai): Leo ascendant 25d03'02"; Sun 167d43'34", Moon 353d56'35", Mars
// 49d05'25". The screen numbers the navamshas from the ascendant's navamsha = 1: As 1, Sun 8, Moon 64, Mars 80.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const asc = 120 + dms(25, 3, 2);
const c = N.navamshaCounts(asc, { Sun: dms(167, 43, 34), Moon: dms(353, 56, 35), Mars: dms(49, 5, 25) });
const by = Object.fromEntries(c.planets.map((p) => [p.planet, p]));
assert.strictEqual(by.Sun.fromLagna, 8);
assert.strictEqual(by.Moon.fromLagna, 64);
assert.strictEqual(by.Mars.fromLagna, 80);
// the two directions add to 110 (108 and both ends counted twice), or 2 when they share a navamsha
for (const q of c.planets) assert.strictEqual(q.fromLagna + q.toLagna, q.index === c.lagnaIndex ? 2 : 110);

// C. Patel's worked example (Navamsa in Astrology printed p.101): the ascendant is the 3rd navamsha of Cancer; Saturn stands in the
// 7th navamsha of Gemini, so from Saturn's navamsha to the ascendant's, both included, is 3 + 3 = 6 (the 6th year). Rahu is in the 6th
// navamsha of Capricorn: 4 + 9x5 + 3 = 52 (the 52nd year).
const ascP = 90 + 2 * NAVAMSHA + 1;               // Cancer, 3rd navamsha
const satP = 60 + 6 * NAVAMSHA + 1;               // Gemini, 7th navamsha
const rahuP = 270 + 5 * NAVAMSHA + 1;             // Capricorn, 6th navamsha
const p = N.navamshaCounts(ascP, { Saturn: satP, Rahu: rahuP });
assert.strictEqual(p.planets.find((x) => x.planet === 'Saturn').toLagna, 6);
assert.strictEqual(p.planets.find((x) => x.planet === 'Rahu').toLagna, 52);
assert.strictEqual(p.planets.find((x) => x.planet === 'Rahu').group, 'MALEFIC');
assert.deepStrictEqual(N.navamshaCounts(0, {}).planets, []);
console.log('test-navamsha-count ok');
