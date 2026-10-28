const assert = require('assert');
const { PLANET_IN_HOUSE } = require('./src/report/bhriguPlanetInHouse');

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// nine planets, in each of the twelve lagnas, in houses 1 to 4: each once
assert.equal(PLANET_IN_HOUSE.length, 432);
const keys = new Set(PLANET_IN_HOUSE.map((e) => `${e.house}|${e.lagna}|${e.planet}`));
assert.equal(keys.size, 432);
for (const h of [1, 2, 3, 4]) for (const s of SIGNS) for (const p of PLANETS) assert.ok(keys.has(`${h}|${s}|${p}`), `${p} in house ${h} of ${s}`);

// every entry has its book text, a Tamil summary and a printed page inside the book
for (const e of PLANET_IN_HOUSE) {
  assert.ok(e.en.length > 30, `${e.planet} ${e.lagna} house ${e.house} text`);
  assert.ok(e.ta.length > 10, `${e.planet} ${e.lagna} house ${e.house} Tamil`);
  assert.ok(Number.isInteger(e.page) && e.page >= 21 && e.page <= 270, `${e.planet} ${e.lagna} page ${e.page}`);
}

// the sign the planet stands in is the lagna for house 1, and the sign that many places on for houses 2 to 4
for (const e of PLANET_IN_HOUSE) {
  const i = SIGNS.indexOf(e.lagna);
  const want = SIGNS[(i + e.house - 1) % 12];
  assert.equal(e.planetSign, want, `${e.planet} ${e.lagna} house ${e.house}`);
}

// pages rise with the chapters
const firstPage = (s) => Math.min(...PLANET_IN_HOUSE.filter((e) => e.lagna === s).map((e) => e.page));
for (let i = 1; i < SIGNS.length; i += 1) {
  assert.ok(firstPage(SIGNS[i]) > firstPage(SIGNS[i - 1]), `${SIGNS[i]} after ${SIGNS[i - 1]}`);
}

// spot checks against the scan
const at = (h, s, p) => PLANET_IN_HOUSE.find((e) => e.house === h && e.lagna === s && e.planet === p);
assert.equal(at(1, 'Aries', 'Sun').page, 21);
assert.equal(at(1, 'Pisces', 'Ketu').page, 270);
assert.ok(at(1, 'Cancer', 'Jupiter').en.includes('likes justice and truth'));
assert.ok(at(1, 'Libra', 'Ketu').en.startsWith('Some weakness in body'));
assert.equal(at(2, 'Libra', 'Venus').planetSign, 'Scorpio');
assert.ok(at(2, 'Libra', 'Venus').en.startsWith('Gets advantage of wealth'));
assert.equal(at(2, 'Aries', 'Venus').page, 31);
assert.equal(at(3, 'Capricorn', 'Rahu').planetSign, 'Pisces');
assert.equal(at(3, 'Capricorn', 'Rahu').page, 224);
assert.equal(at(4, 'Gemini', 'Jupiter').planetSign, 'Virgo');
assert.ok(!at(4, 'Gemini', 'Jupiter').en.includes('Vth House'));
assert.ok(!at(4, 'Aries', 'Mars').en.includes('Vth House'));

console.log('test-bhrigu-planet-in-house ok');
