const assert = require('assert');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const { withEphemeris } = require('./src/ephemeris/isolation');
const { vimshopaka, METHODS, DEFAULT_METHOD } = require('./src/chart/vimshopaka');

// The two BPHS readings of the Vimshopaka weights, switchable; the verse order is the default.
assert.equal(DEFAULT_METHOD, 'bphs-verse');
assert.deepStrictEqual(Object.keys(METHODS), ['bphs-verse', 'bphs-printed']);
assert.deepStrictEqual(METHODS['bphs-verse'].schemes.saptavarga.weights, { D1: 5, D2: 2, D3: 3, D7: 2.5, D9: 4.5, D12: 2, D30: 1 });
assert.deepStrictEqual(METHODS['bphs-printed'].schemes.saptavarga.weights, { D1: 5, D2: 2, D3: 3, D7: 1, D9: 2.5, D12: 4.5, D30: 2 });
assert.deepStrictEqual(METHODS['bphs-printed'].schemes.shadvarga.weights, METHODS['bphs-verse'].schemes.shadvarga.weights, 'only Saptavarga differs');

// Sample birth (5 Oct 1990, 04:30 IST, Chennai): the Moon's Saptavarga under each reading. The verse order gives 11.7,
// the printed table 10.7 (PL9 prints 11).
const ctx = createChartContext({
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai', calendarMode: 'tirukanita',
});
withEphemeris({ ayanamsha: ctx.ayanamsha }, () => {
  const chart = calculateParashariChart(ctx);
  const signs = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => [p, chart.grahas[p].rasiIndex]));
  const moon = (method) => vimshopaka('Moon', signs.Moon, chart.grahas.Moon.degreeInSign, signs, 'saptavarga', method);
  assert.equal(moon().method, 'bphs-verse');
  assert.ok(Math.abs(moon().total - 11.7) < 1e-9, `verse order Moon ${moon().total}`);
  assert.equal(moon('bphs-printed').method, 'bphs-printed');
  assert.ok(Math.abs(moon('bphs-printed').total - 10.7) < 1e-9, `printed table Moon ${moon('bphs-printed').total}`);
  assert.throws(() => moon('no-such-method'), /unknown method/);
});

console.log('test-vimshopaka-methods: all assertions passed');
