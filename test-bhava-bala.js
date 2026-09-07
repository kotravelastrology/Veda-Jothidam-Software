const assert = require('node:assert/strict');
const { calculateAshtakavarga } = require('./src/chart/ashtakavarga');
const { calculateBhavaBala, evaluateBhavaBala } = require('./src/chart/bhavaBala');

const natalChart = { Sun: 0, Moon: 3, Mars: 7, Mercury: 5, Jupiter: 8, Venus: 6, Saturn: 9, Lagna: 4 };
const ashtakavarga = calculateAshtakavarga(natalChart);

// evaluateBhavaBala for the 1st house (= Lagna's own rasi, Simha/Leo index 4): the
// house sign's Sarvashtakavarga bindus, the sign's lord (Sun, since Leo's lord is
// the Sun) at the Sun's own natal position, and the 1st house's Karaka (the Sun,
// per S8's Bhava Karaka table) -- so lord and karaka coincide here.
const first = evaluateBhavaBala(1, 4, natalChart, ashtakavarga);
assert.equal(first.rasiIndex, 4);
assert.equal(first.houseSarvaBindus, ashtakavarga.sarva[4]);
assert.equal(first.lord.planet, 'Sun');
assert.equal(first.karaka.planet, 'Sun');
assert.equal(first.lord.sarvaBindus, ashtakavarga.sarva[natalChart.Sun]);
assert.equal(first.lord.bhinnaBindus, ashtakavarga.bhinna.Sun[natalChart.Sun]);

// 4th house karaka is the Moon (S8 Bhava Karaka), lord is whoever rules the sign in the 4th house.
const fourth = evaluateBhavaBala(4, 4, natalChart, ashtakavarga);
assert.equal(fourth.karaka.planet, 'Moon');
assert.equal(fourth.karaka.bhinnaBindus, ashtakavarga.bhinna.Moon[natalChart.Moon]);

// Full calculateBhavaBala: all 12 houses present.
const full = calculateBhavaBala(4, natalChart, ashtakavarga);
assert.equal(Object.keys(full.houses).length, 12);
for (let h = 1; h <= 12; h += 1) {
  assert.ok(full.houses[h].houseSarvaBindus >= 0);
  assert.ok(full.houses[h].lord.planet);
  assert.ok(full.houses[h].karaka.planet);
}
assert.equal(full.source.title, 'Practical Ashtakavarga');

console.log(JSON.stringify({ pass: true, firstHouse: first, fourthHouse: fourth }, null, 2));
