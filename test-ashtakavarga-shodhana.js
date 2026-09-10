const assert = require('node:assert/strict');
const { calculateAshtakavarga } = require('./src/chart/ashtakavarga');
const {
  calculateAshtakavargaShodhana, trikonaShodhana, ekadhipatyaShodhana, applyShodhana,
} = require('./src/report/ashtakavargaShodhana');

// ── Trikona Shodhana: lowest of each trine replaces all three ──────────
// trines: {0,4,8} {1,5,9} {2,6,10} {3,7,11}
assert.deepEqual(
  trikonaShodhana([5, 0, 0, 0, 3, 0, 0, 0, 7, 0, 0, 0]),
  [3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0], // trine {0,4,8}: min(5,3,7)=3
);
// two or more zeros in a trine -> all zero
assert.deepEqual(
  trikonaShodhana([0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0]),
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
);
// all equal in a trine -> all zero
assert.deepEqual(trikonaShodhana([4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0]).slice(0, 9).filter((_, i) => [0, 4, 8].includes(i)), [0, 0, 0]);

// ── Ekadhipatya Shodhana: own-sign pairs [0,7][1,6][2,5][8,11][9,10] ──
// pair [0,7]: 5 vs 3 -> 2, 0
assert.deepEqual(
  ekadhipatyaShodhana([5, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0]),
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
);
// equal -> both 0
assert.deepEqual(
  ekadhipatyaShodhana([4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0]).slice(0, 8),
  [0, 0, 0, 0, 0, 0, 0, 0],
);
// one is 0 -> untouched
assert.deepEqual(ekadhipatyaShodhana([6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])[0], 6);

// ── Full block off a real bhinnashtakavarga ────────────────────────────
const rp = { Sun: 1, Moon: 8, Mars: 9, Mercury: 0, Jupiter: 2, Venus: 11, Saturn: 9, Lagna: 1 };
const av = calculateAshtakavarga(rp);
const sh = calculateAshtakavargaShodhana(av.bhinna, rp);

assert.equal(sh.available, true);
const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
for (const p of planets) {
  assert.equal(sh.reduced[p].length, 12, `${p} reduced length`);
  // reduction never increases a bindu
  for (let i = 0; i < 12; i += 1) assert.ok(sh.reduced[p][i] <= av.bhinna[p][i], `${p}[${i}] not increased`);
  assert.ok(sh.pinda[p].sodhyaPinda === sh.pinda[p].rashiPinda + sh.pinda[p].grahaPinda, `${p} sodhya = rasi + graha`);
  assert.ok(sh.pinda[p].rashiPinda >= 0 && sh.pinda[p].grahaPinda >= 0);
}
// applyShodhana = ekadhipatya(trikona(x))
assert.deepEqual(applyShodhana(av.bhinna.Sun), ekadhipatyaShodhana(trikonaShodhana(av.bhinna.Sun)));

console.log(JSON.stringify({
  pass: true,
  sunReduced: sh.reduced.Sun.join(','),
  venusSodhya: sh.pinda.Venus.sodhyaPinda,
}, null, 2));
