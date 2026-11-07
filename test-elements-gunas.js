/**
 * BPHS ch.76-77 (src/report/elementsGunas.js, fixture bphs-76-77.json): the fixture's shape, the planets' elements and gunas, and the reading of strengths worked by hand.
 */
const assert = require('node:assert/strict');
const E = require('./src/report/elementsGunas');

assert.ok(E.DATA.source.title && E.DATA.source.pageLocus && E.DATA.scope && E.DATA.strength.ta.length > 60 && E.DATA.job.ta.length > 30);
assert.deepEqual(Object.keys(E.DATA.element).sort(), [...E.PLANETS].sort());
assert.deepEqual(Object.keys(E.DATA.guna).sort(), [...E.PLANETS].sort());
assert.deepEqual(Object.keys(E.DATA.elements), ['fire', 'earth', 'ether', 'water', 'air']);
for (const [k, d] of Object.entries(E.DATA.elements)) {
  const [a, b] = d.page.split('-').map(Number);
  assert.ok(a >= 929 && (b ?? a) <= 931 && d.temperament.length > 30 && d.predominant.length > 30 && d.name && d.verses, k);
}
assert.deepEqual(Object.keys(E.DATA.classes), ['sattva', 'rajas', 'tamas', 'equal']);
for (const c of Object.values(E.DATA.classes)) assert.ok(c.ta.length > 20 && c.page === '933' && c.name);

// the elements of v.2, v.5 and v.11-14
assert.deepEqual(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => E.DATA.element[p]), ['fire', 'water', 'fire', 'earth', 'ether', 'water', 'air']);
// the gunas of v.1-4
assert.deepEqual(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => E.DATA.guna[p]), ['sattva', 'sattva', 'tamas', 'rajas', 'sattva', 'rajas', 'tamas']);

const flat = (x) => Object.fromEntries(E.PLANETS.map((p) => [p, x]));
// one planet leads
let s = { ...flat(1), Jupiter: 5 };
assert.deepEqual(E.leaders(s), ['Jupiter']);
assert.deepEqual(E.elementOf(s), { leaders: ['Jupiter'], element: 'ether' });
assert.equal(E.gunaOfLeader(s), 'sattva');
// two planets of one element tie: still that element (fire: Sun and Mars)
s = { ...flat(1), Sun: 5, Mars: 5 };
assert.deepEqual(E.elementOf(s), { leaders: ['Sun', 'Mars'], element: 'fire' });
assert.equal(E.gunaOfLeader(s), 'equal', 'the Sun is sattva and Mars tamas');
// planets of different elements tie: mixed (v.3-4)
s = { ...flat(1), Mars: 5, Saturn: 5 };
assert.equal(E.elementOf(s).element, 'mixed');
assert.equal(E.gunaOfLeader(s), 'tamas');
// all equal: mixed, and all gunas equal (v.3-4, v.10)
assert.equal(E.elementOf(flat(3)).element, 'mixed');
assert.equal(E.gunaOfLeader(flat(3)), 'equal');

// guna totals and the guna that exceeds the others (v.10)
s = { Sun: 1, Moon: 2, Mars: 3, Mercury: 4, Jupiter: 5, Venus: 6, Saturn: 7 };
assert.deepEqual(E.gunaTotals(s), { sattva: 8, rajas: 10, tamas: 10 });
assert.equal(E.gunaLeading(E.gunaTotals(s)), 'equal', 'rajas and tamas tie');
assert.equal(E.gunaLeading({ sattva: 8, rajas: 10, tamas: 9 }), 'rajas');
assert.equal(E.gunaLeading({ sattva: 1, rajas: 1, tamas: 1 }), 'equal');

// debilitation (v.17): Sun in Libra, Moon in Scorpio, Mars in Cancer, Mercury in Pisces, Jupiter in Capricorn, Venus in Virgo, Saturn in Aries
assert.ok(E.debilitated('Sun', 6) && E.debilitated('Moon', 7) && E.debilitated('Mars', 3) && E.debilitated('Mercury', 11) && E.debilitated('Jupiter', 9) && E.debilitated('Venus', 5) && E.debilitated('Saturn', 0));
assert.ok(!E.debilitated('Sun', 0) && !E.debilitated('Venus', 11));
console.log('test-elements-gunas: all assertions passed');
