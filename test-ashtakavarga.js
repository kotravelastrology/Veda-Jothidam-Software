const assert = require('node:assert/strict');
const {
  calculateAshtakavarga, calculateBhinnashtakavarga, BINDU_TABLE,
  EXPECTED_TOTAL, EXPECTED_GRAND_TOTAL, TARGET_PLANETS,
} = require('./src/chart/ashtakavarga');

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

// Every published total in Table-1 (file page 12) is reproduced exactly by
// summing that planet's row across all 8 contributors -- an internal
// arithmetic cross-check of the transcribed table itself, independent of
// any chart.
for (const [planet, table] of Object.entries(BINDU_TABLE)) {
  const total = Object.values(table).reduce((acc, offsets) => acc + offsets.length, 0);
  assert.equal(total, EXPECTED_TOTAL[planet], `${planet} table total`);
}
assert.equal(Object.values(EXPECTED_TOTAL).reduce((a, b) => a + b, 0), EXPECTED_GRAND_TOTAL);

// Every planet's Bhinnashtakavarga bindu total is chart-independent: moving
// where the 8 contributors sit only relocates bindus between signs, it
// never changes how many there are in total.
const chartA = { Sun: 0, Moon: 3, Mars: 7, Mercury: 5, Jupiter: 8, Venus: 6, Saturn: 9, Lagna: 4 };
const chartB = { Sun: 11, Moon: 11, Mars: 11, Mercury: 11, Jupiter: 11, Venus: 11, Saturn: 11, Lagna: 11 };
for (const planet of TARGET_PLANETS) {
  assert.equal(sum(calculateBhinnashtakavarga(planet, chartA)), EXPECTED_TOTAL[planet], `${planet} total, chart A`);
  assert.equal(sum(calculateBhinnashtakavarga(planet, chartB)), EXPECTED_TOTAL[planet], `${planet} total, chart B`);
}

// Hand-computed synthetic case: every contributor at Aries (rasi 0). The
// Sun and Moon Bhinnashtakavarga bindu-per-sign arrays below were computed
// by hand directly from Table-1's own offset lists (see S9 stage record).
const allAtAries = { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Lagna: 0 };
assert.deepEqual(
  calculateBhinnashtakavarga('Sun', allAtAries),
  [3, 3, 3, 4, 2, 5, 4, 3, 5, 6, 7, 3],
);
assert.deepEqual(
  calculateBhinnashtakavarga('Moon', allAtAries),
  [3, 1, 7, 3, 4, 5, 5, 3, 2, 7, 8, 1],
);

// Rotational symmetry: shifting every contributor by the same number of
// signs must rotate every Bhinnashtakavarga's bindu array by the same amount.
const shifted = Object.fromEntries(Object.entries(allAtAries).map(([k, v]) => [k, (v + 5) % 12]));
const base = calculateBhinnashtakavarga('Jupiter', allAtAries);
const rotated = calculateBhinnashtakavarga('Jupiter', shifted);
const expectedRotated = [...base.slice(12 - 5), ...base.slice(0, 12 - 5)];
assert.deepEqual(rotated, expectedRotated);

// Full calculateAshtakavarga: Sarvashtakavarga is the sum of all 7
// Bhinnashtakavargas and totals 337 (the book's own "337 bindu system" name).
const full = calculateAshtakavarga(chartA);
assert.equal(sum(full.sarva), EXPECTED_GRAND_TOTAL);
let recomputedSarva = new Array(12).fill(0);
for (const planet of TARGET_PLANETS) {
  full.bhinna[planet].forEach((v, i) => { recomputedSarva[i] += v; });
}
assert.deepEqual(full.sarva, recomputedSarva);
assert.equal(full.source.title, 'Practical Ashtakavarga');

// Missing a required contributor is rejected rather than silently defaulted.
assert.throws(() => calculateBhinnashtakavarga('Sun', { ...chartA, Lagna: undefined }), TypeError);
assert.throws(() => calculateBhinnashtakavarga('Rahu', chartA), RangeError);

console.log(JSON.stringify({ pass: true, sarvaTotal: sum(full.sarva), sunBhinna: full.bhinna.Sun }, null, 2));
