const assert = require('assert');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const J = require('./src/dasha/jaiminiSthira');
const RS = require('./src/dasha/bphsRashiDashas');

// replacement table, Rath 2.1.50 note: Saturn -> Mars, Rahu -> Mercury, Ketu -> Jupiter
assert.deepStrictEqual({ ...J.REPLACEMENT }, { Saturn: 'Mars', Rahu: 'Mercury', Ketu: 'Jupiter' });

// audit chart (5 Oct 1990 04:30 Chennai): the stronger reference is Aquarius, Saturn qualifies and is replaced by Mars (Taurus);
// Taurus is an even sign so the signs run backward from it, as BPHS; Parashara's Light prints Capricorn at 18 Sep 2026
const ctx = createChartContext({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, calendarMode: 'tirukanita' });
const c = calculateParashariChart(ctx);
const ALL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const facts = {
  signs: Object.fromEntries(ALL.map((p) => [p, c.grahas[p].rasiIndex])),
  degrees: Object.fromEntries(ALL.map((p) => [p, c.grahas[p].longitude % 30])),
  lagnaSign: c.lagna.rasiIndex, lagnaLongitude: c.lagna.longitude, moonFraction: 0,
};
const b = J.brahmaRath(facts);
assert.strictEqual(b.reference, 10, 'reference Aquarius');
assert.strictEqual(b.replacedFrom, 'Saturn');
assert.strictEqual(b.brahma, 'Mars');
assert.strictEqual(b.sign, 1);
const d = J.jaiminiSthira(facts);
assert.strictEqual(d.forward, false);
assert.strictEqual(d.periods.length, 12);
assert.deepStrictEqual(d.periods.slice(0, 3).map((p) => [p.sign, p.years]), [[1, 8], [0, 7], [11, 9]]);
assert.strictEqual(d.periods.reduce((s, p) => s + p.years, 0), 96, 'four signs each of 7, 8 and 9 years');

// registered beside the BPHS Sthira, which is kept
assert.ok(RS.SYSTEMS['jaimini-sthira'] && RS.SYSTEMS.sthira && RS.SOURCES['jaimini-sthira']);
assert.notStrictEqual(RS.SYSTEMS.sthira(facts).start, d.start, 'the two readings differ for this chart and both are shown');

// Rath's printed example (Chart 48, p.226) runs the Sthira dasas in zodiacal order whatever the sign: the audit chart then starts in Taurus and reaches Virgo in 2022
const z = J.jaiminiSthira(facts, { zodiacal: true });
assert.strictEqual(z.forward, true);
assert.deepStrictEqual(z.periods.slice(0, 3).map((p) => p.sign), [1, 2, 3]);
assert.ok(RS.SYSTEMS['jaimini-sthira-zodiacal']);

// sub-period order, Rath 2.4.31-34: starts at the lord's sign; odd sign forward, even sign reversed; Saturn in the dasa sign forward, Ketu reversed
const F = require('./src/dasha/fiveLevel');
const base = { signs: { Sun: 5, Moon: 0, Mars: 6, Mercury: 6, Jupiter: 3, Venus: 4, Saturn: 8, Rahu: 10, Ketu: 4 }, degrees: Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((p) => [p, 10])), lagnaSign: 4 };
const so = (sign, over) => F.subOrder(sign, { ...base, signs: { ...base.signs, ...over } });
assert.deepStrictEqual(so(11, {}).order.slice(0, 3), [3, 2, 1], 'Pisces: Jupiter in Cancer (even sign), reversed');
assert.deepStrictEqual(so(11, { Jupiter: 2 }).order.slice(0, 3), [2, 3, 4], 'Jupiter in Gemini (odd sign), zodiacal');
assert.strictEqual(so(11, { Saturn: 11 }).forward, true, 'Saturn in Pisces: zodiacal');
assert.strictEqual(so(11, { Jupiter: 2, Ketu: 11 }).forward, false, 'Ketu in Pisces: reversed');
console.log('test-jaimini-sthira ok');
