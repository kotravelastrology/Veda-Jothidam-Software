const assert = require('assert');
const { buildReaderIIReport } = require('./src/report/readerIIReport');

// The Reader II block of the KP report: the Lagna and Moon signs, the twelve houses and the grahas for one chart
const chart = {
  lagna: { rasiIndex: 0 },
  grahas: {
    Sun: { rasiIndex: 4 }, Moon: { rasiIndex: 3 }, Mars: { rasiIndex: 1 }, Mercury: { rasiIndex: 5 },
    Jupiter: { rasiIndex: 8 }, Venus: { rasiIndex: 6 }, Saturn: { rasiIndex: 9 }, Rahu: { rasiIndex: 11 }, Ketu: { rasiIndex: 5 },
  },
};
const r = buildReaderIIReport(chart);

assert.strictEqual(r.available, true);
assert.strictEqual(r.lagna.sign, 'Aries');
assert.strictEqual(r.lagna.signTa, 'மேஷம்');
assert.strictEqual(r.lagna.pageFrom, 117);
assert.strictEqual(r.lagna.pageTo, 124);
assert.strictEqual(r.lagna.sections.length, 16);
assert.strictEqual(r.moon.sign, 'Cancer');
assert.strictEqual(r.moon.sections.length, 19);
assert.ok(r.moon.sections.every((s) => s.ta && s.en && s.titleTa), 'every sign section has text');

assert.strictEqual(r.houses.length, 12);
assert.strictEqual(r.houses[0].house, 1);
assert.strictEqual(r.houses[0].houseTa, 'முதல்');
assert.strictEqual(r.houses[11].houseTa, 'பன்னிரண்டாம்');
assert.ok(r.houses.every((h) => h.ta && h.en && h.titleTa && h.pageFrom && h.pageTo), 'every house has text and pages');

assert.strictEqual(r.planets.length, 9);
const byLabel = (label) => r.planets.find((p) => p.labelTa === label);
assert.strictEqual(byLabel('சூரியன்').sign, 'Leo');
assert.strictEqual(byLabel('சந்திரன்').signTa, 'கடகம்');
assert.strictEqual(byLabel('கேது').titleTa, byLabel('ராகு').titleTa, 'Ketu uses the nodes text');
assert.strictEqual(byLabel('கேது').sign, 'Virgo');
assert.ok(r.planets.every((p) => p.ta && p.en && p.titleTa), 'every planet has text');

// no chart: the signs are absent, the houses and grahas are still listed
const none = buildReaderIIReport(undefined);
assert.strictEqual(none.lagna, null);
assert.strictEqual(none.moon, null);
assert.strictEqual(none.houses.length, 12);
assert.ok(none.planets.every((p) => p.sign === null));

console.log('test-reader-ii-report ok');
