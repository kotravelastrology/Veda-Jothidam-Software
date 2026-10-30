const assert = require('assert');
const { houseSignificators } = require('./src/report/kpHouseSignificators');
const { evaluateKpMarriage, periodSignificators, twelfthFrom, eighthFrom } = require('./src/report/kpMarriage');
const { calculateKpSystem } = require('./src/report/kpSystem');

const NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const SIGN_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];

/** A KP chart from a compact spec: planets {house, starLord, sub, sign}, cusps {n: {signLord, starLord, sub}}. */
function mk({ planets = {}, cusps = {}, dbas = ['Sun', 'Moon', 'Mars', 'Rahu'] }) {
  const positions = NAMES.map((name) => ({ name, house: 1, starLord: 'Sun', sub: 'Sun', sign: 'Taurus', ...(planets[name] || {}) }));
  const cuspList = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1, signLord: SIGN_LORDS[i], starLord: 'Sun', sub: 'Sun', sign: 'Aries', ...(cusps[i + 1] || {}),
  }));
  const kp = { available: true, positions, cusps: cuspList, dbas };
  kp.houseSignificators = houseSignificators({ positions, cusps: cuspList.map((c) => ({ number: c.number, signLord: c.signLord })) });
  return kp;
}
const byId = (r, id) => r.rules.find((x) => x.id === id);

// shorthand helpers the book uses ("12 to 5", "8 to 5", "12 to 11", "8 to 11")
assert.deepStrictEqual([twelfthFrom(5), eighthFrom(5), twelfthFrom(11), eighthFrom(11), twelfthFrom(1), eighthFrom(1)], [4, 12, 10, 6, 12, 8]);

// Second marriage (printed p.181): the sub-lord of the 7th cusp is Rahu in Dhanus, a dual sign.
let kp = mk({ planets: { Rahu: { sign: 'Sagittarius', house: 2 } }, cusps: { 7: { sub: 'Rahu', signLord: 'Saturn' } } });
let r = evaluateKpMarriage(kp);
assert.strictEqual(byId(r, 'M_SECOND_7').status, 'HELD');
// Mercury as sub-lord is a dual planet whatever its sign (printed p.182)
kp = mk({ planets: { Mercury: { sign: 'Taurus' }, Rahu: { sign: 'Taurus' } }, cusps: { 7: { sub: 'Mercury' } } });
assert.strictEqual(byId(evaluateKpMarriage(kp), 'M_SECOND_7').status, 'HELD');
// no dual sign, no Mercury: not held; and the 6th-cusp variant is reported separately as printed
kp = mk({ planets: { Venus: { sign: 'Taurus' }, Sun: { sign: 'Taurus' } }, cusps: { 7: { sub: 'Venus' }, 6: { sub: 'Venus' } } });
r = evaluateKpMarriage(kp);
assert.strictEqual(byId(r, 'M_SECOND_7').status, 'NOT_HELD');
assert.strictEqual(byId(r, 'M_SECOND_6_AS_PRINTED').printedContradiction, true);

// Marriage promised (printed pp.106, 121): the 7th sub-lord Venus owns the 7th (a cusp it rules) so it signifies 7
kp = mk({ cusps: { 7: { sub: 'Venus', signLord: 'Venus' } }, planets: { Venus: { house: 5, starLord: 'Mars', sub: 'Mars' } } });
r = evaluateKpMarriage(kp);
assert.ok(byId(r, 'M_PROMISE').evidence.signifies.includes(7), 'owner of the 7th signifies it');
assert.strictEqual(byId(r, 'M_PROMISE').status, 'HELD');

// Denial (printed p.106): the 7th sub-lord is connected with 4, 6, 10. Rahu in the 6th (occupies 6).
kp = mk({ planets: { Rahu: { house: 6, starLord: 'Rahu', sub: 'Rahu' } }, cusps: { 7: { sub: 'Rahu' } } });
r = evaluateKpMarriage(kp);
assert.strictEqual(byId(r, 'M_DENIAL').status, 'HELD');
assert.ok(byId(r, 'M_DENIAL').evidence.matching.includes(6));

// Punarphoo (printed p.78): Saturn in the star of Moon and sub of Saturn, Saturn in a listed house
kp = mk({ planets: { Saturn: { house: 7, starLord: 'Moon', sub: 'Saturn' } } });
assert.strictEqual(byId(evaluateKpMarriage(kp), 'M_PUNARPHOO').status, 'HELD');
kp = mk({ planets: { Saturn: { house: 2, starLord: 'Moon', sub: 'Saturn' } } });
assert.strictEqual(byId(evaluateKpMarriage(kp), 'M_PUNARPHOO').status, 'NOT_HELD', 'Saturn must stand in 1, 3, 6, 7 or 10');
kp = mk({ planets: { Moon: { house: 3, starLord: 'Saturn', sub: 'Moon' }, Saturn: { house: 10 } } });
assert.strictEqual(byId(evaluateKpMarriage(kp), 'M_PUNARPHOO').status, 'HELD');

// Separation (printed pp.191-192): a significator of 2/7/11 that also signifies 6 or 12
kp = mk({ planets: { Mars: { house: 7, starLord: 'Mars', sub: 'Mars' }, Moon: { house: 6, starLord: 'Mars', sub: 'Moon' } } });
r = evaluateKpMarriage(kp);
assert.strictEqual(byId(r, 'D_SEPARATION').status, 'HELD');
assert.ok(byId(r, 'D_SEPARATION').evidence.both.includes('Moon'), 'Moon stands in the star of Mars, an occupant of 7, and occupies 6');

// Children (printed pp.224, 228): the 11th cusp sub-lord in a barren sign and Kethu as the star lord -> abortive
kp = mk({ planets: { Sun: { sign: 'Leo', house: 10, starLord: 'Ketu' }, Ketu: { house: 6, starLord: 'Ketu', sub: 'Ketu' } }, cusps: { 11: { sub: 'Sun', starLord: 'Saturn' } } });
r = evaluateKpMarriage(kp);
assert.strictEqual(byId(r, 'C_MALE_11_BARREN').status, 'HELD');
kp = mk({ planets: { Sun: { sign: 'Leo', house: 10, starLord: 'Ketu' } }, cusps: { 11: { sub: 'Sun' } } });
assert.strictEqual(byId(evaluateKpMarriage(kp), 'C_MALE_11_AGAINST').evidence.abortiveNode, true, 'the star lord of the sub-lord is Kethu');
// the sub-lord signifying the 12th from the 5th (house 4) counts against; this is the derived shorthand
kp = mk({ planets: { Venus: { house: 4, starLord: 'Venus', sub: 'Venus' } }, cusps: { 5: { sub: 'Venus', signLord: 'Sun' } } });
r = evaluateKpMarriage(kp);
assert.ok(byId(r, 'C_5_AGAINST').evidence.matching.includes(4));
assert.strictEqual(byId(r, 'C_5_AGAINST').derivedShorthand, true);

// First issue (printed p.242): Saturn in the ascendant whose sub-lord occupies the 4th
kp = mk({ planets: { Saturn: { house: 1, sub: 'Venus' }, Venus: { house: 4 } } });
assert.strictEqual(byId(evaluateKpMarriage(kp), 'C_FIRST_ISSUE').status, 'HELD');
assert.strictEqual(byId(evaluateKpMarriage(mk({ planets: { Saturn: { house: 7 }, Rahu: { house: 7 }, Ketu: { house: 7 } } })), 'C_FIRST_ISSUE').status, 'NOT_HELD');

// Periods: which running lords signify the houses of the event
kp = mk({ planets: { Moon: { house: 2, starLord: 'Moon' } }, dbas: ['Moon', 'Sun'] });
const per = periodSignificators(kp, [2, 7, 11]);
assert.strictEqual(per[0].connected, true);
assert.deepStrictEqual(per.map((p) => p.level), ['தசை', 'புக்தி']);

// A real chart: every rule has a unique id, a valid status, printed pages and Tamil text
const real = calculateKpSystem({ year: 1990, month: 5, day: 15, hour: 7, minute: 30, latitude: 11.34, longitude: 77.72, utcOffsetMinutes: 330 });
const res = evaluateKpMarriage(real);
assert.strictEqual(res.available, true);
const ids = res.rules.map((x) => x.id);
assert.strictEqual(new Set(ids).size, ids.length);
for (const x of res.rules) {
  assert.ok(['HELD', 'NOT_HELD', 'INFO'].includes(x.status), x.id);
  assert.ok(x.printedPages && x.detailTa.length > 20, x.id);
}
assert.strictEqual(res.periods.marriage.length, 4);
assert.strictEqual(evaluateKpMarriage({ available: false }).available, false);
console.log('test-kp-marriage ok');
