const assert = require('assert');
const { PLANET_IN_HOUSE } = require('./src/report/bhriguPlanetInHouse');

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// nine planets, in each of the twelve lagnas, in houses 1 to 8: each once, except Sun in Gemini's 5th house, which the book does not print
assert.equal(PLANET_IN_HOUSE.length, 863);
const keys = new Set(PLANET_IN_HOUSE.map((e) => `${e.house}|${e.lagna}|${e.planet}`));
assert.equal(keys.size, 863);
for (const h of [1, 2, 3, 4, 5, 6, 7, 8]) for (const s of SIGNS) for (const p of PLANETS) {
  if (h === 5 && s === 'Gemini' && p === 'Sun') continue;
  assert.ok(keys.has(`${h}|${s}|${p}`), `${p} in house ${h} of ${s}`);
}
assert.ok(!keys.has('5|Gemini|Sun'));

// every entry has its book text, a Tamil summary and a printed page inside the book
for (const e of PLANET_IN_HOUSE) {
  assert.ok(e.en.length > 30, `${e.planet} ${e.lagna} house ${e.house} text`);
  assert.ok(e.ta.length > 10, `${e.planet} ${e.lagna} house ${e.house} Tamil`);
  assert.ok(Number.isInteger(e.page) && e.page >= 21 && e.page <= 280, `${e.planet} ${e.lagna} page ${e.page}`);
}

// the sign the planet stands in is the lagna for house 1, and the sign that many places on for houses 2 to 8
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
assert.equal(at(5, 'Aries', 'Mars').page, 25);
assert.equal(at(5, 'Aries', 'Mars').planetSign, 'Leo');
assert.equal(at(5, 'Aquarius', 'Ketu').planetSign, 'Gemini');
assert.equal(at(5, 'Gemini', 'Jupiter').planetSign, 'Libra');
assert.equal(at(6, 'Aries', 'Sun').planetSign, 'Virgo');
assert.equal(at(6, 'Gemini', 'Sun').planetSign, 'Scorpio');
assert.equal(at(6, 'Gemini', 'Sun').page, 62);
assert.equal(at(7, 'Aries', 'Sun').planetSign, 'Libra');
assert.equal(at(7, 'Pisces', 'Ketu').page, 271);
assert.equal(at(8, 'Taurus', 'Jupiter').planetSign, 'Sagittarius');
assert.equal(at(8, 'Aries', 'Sun').planetSign, 'Scorpio');

console.log('test-bhrigu-planet-in-house ok');
