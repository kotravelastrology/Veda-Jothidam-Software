const assert = require('assert');
const { FIRST_HOUSE } = require('./src/report/bhriguFirstHouse');

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// nine planets in each of the twelve lagnas, each once
assert.equal(FIRST_HOUSE.length, 108);
const keys = new Set(FIRST_HOUSE.map((e) => `${e.sign}|${e.planet}`));
assert.equal(keys.size, 108);
for (const s of SIGNS) for (const p of PLANETS) assert.ok(keys.has(`${s}|${p}`), `${p} in ${s}`);

// every entry has its book text, a Tamil summary and a printed page inside the book (25..270)
for (const e of FIRST_HOUSE) {
  assert.ok(e.en.length > 30, `${e.planet} ${e.sign} text`);
  assert.ok(e.ta.length > 10, `${e.planet} ${e.sign} Tamil`);
  assert.ok(Number.isInteger(e.page) && e.page >= 21 && e.page <= 270, `${e.planet} ${e.sign} page ${e.page}`);
}

// pages rise with the chapters: each lagna starts after the one before it
const firstPage = (s) => Math.min(...FIRST_HOUSE.filter((e) => e.sign === s).map((e) => e.page));
for (let i = 1; i < SIGNS.length; i += 1) {
  assert.ok(firstPage(SIGNS[i]) > firstPage(SIGNS[i - 1]), `${SIGNS[i]} after ${SIGNS[i - 1]}`);
}

// spot checks against the scan (the Aries Sun entry is on p.21; Pisces Ketu on p.270)
const at = (s, p) => FIRST_HOUSE.find((e) => e.sign === s && e.planet === p);
assert.equal(at('Aries', 'Sun').page, 21);
assert.equal(at('Pisces', 'Ketu').page, 270);
assert.ok(at('Cancer', 'Jupiter').en.includes('likes justice and truth'));
assert.ok(at('Libra', 'Ketu').en.startsWith('Some weakness in body'));

console.log('test-bhrigu-first-house ok');
