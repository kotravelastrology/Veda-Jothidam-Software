const assert = require('assert');
const J = require('./src/dasha/jaiminiShoola');

// Rangacharya's worked chart (Jaimini Sutramritam printed p.127): Scorpio lagna with Ketu; Sagittarius Saturn; Pisces
// Venus; Aries Sun, Mercury, Mars; Taurus Rahu; Cancer Jupiter; Virgo Moon. Degrees are not printed; mid-sign values
// are used, with Mars in Aries inside its moolatrikona range as the book says.
const signs = { Sun: 0, Mercury: 0, Mars: 0, Venus: 11, Saturn: 8, Rahu: 1, Ketu: 7, Jupiter: 3, Moon: 5 };
const degrees = { Sun: 15, Mercury: 15, Mars: 5, Venus: 15, Saturn: 15, Rahu: 15, Ketu: 15, Jupiter: 15, Moon: 15 };
const chart = { signs, degrees, lagnaSign: 7 };

// Mars (lagna lord) in his moolatrikona, Venus (7th lord) exalted: the 7th, Taurus, is stronger.
assert.strictEqual(J.dignity('Venus', 11, 15, signs), 6);
assert.strictEqual(J.dignity('Mars', 0, 5, signs), 5);
const r = J.niryanaShoola(chart);
assert.strictEqual(r.start, 1, 'Taurus');
assert.strictEqual(r.forward, false, 'Taurus is an even sign: backward');
assert.deepStrictEqual(r.periods.map((p) => p.sign), [1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
assert.ok(r.periods.every((p) => p.years === 9));
assert.deepStrictEqual(r.detail.shoolaSigns, [1, 9, 5], 'Taurus, Capricorn, Virgo: 1st, 5th and 9th from the start, counted in its direction');
assert.strictEqual(r.detail.lagnaStronger, false);

// The ladder's first steps: a sign with a planet beats a vacant one, more planets beat fewer.
const c2 = { signs: { ...signs, Ketu: 2 }, degrees, lagnaSign: 7 }; // Scorpio vacant, Taurus holds Rahu
const o = J.strongerOfPair(7, 1, c2);
assert.strictEqual(o.winner, 1);
assert.strictEqual(o.step, 'occupied against vacant');
const c3 = { signs: { ...signs, Ketu: 1 }, degrees, lagnaSign: 7 }; // Taurus holds Rahu and Ketu, Scorpio none
assert.strictEqual(J.strongerOfPair(7, 1, c3).winner, 1);
assert.strictEqual(J.strongerOfPair(7, 1, { signs: { ...signs, Ketu: 7, Rahu: 7, Mars: 1 }, degrees, lagnaSign: 7 }).step, 'more planets');

console.log('test-jaimini-shoola ok');
