const assert = require('assert');
const { lagnaLordInLagna, RASI_ORDER } = require('./src/report/lagnaLordNature');
const { OWN_SIGNS } = require('./src/chart/shadbala');

// twelve rasis, in order
assert.deepStrictEqual(RASI_ORDER, ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']);

// the lagna lord is the planet whose own-sign table holds the lagna, and it is the planet the entry names
for (let i = 0; i < 12; i += 1) {
  const e = lagnaLordInLagna(i);
  assert.ok(OWN_SIGNS[e.planet].includes(i), `${e.planet} owns ${RASI_ORDER[i]}`);
  assert.equal(e.sign, RASI_ORDER[i]);
}

// the lagna lord as printed: Libra lagna has Venus in the 1st house (Libra), printed page 156
const libra = lagnaLordInLagna(6);
assert.equal(libra.planet, 'Venus');
assert.equal(libra.page, 156);
assert.ok(libra.en.startsWith('Gets non-cooperation in his progress'));
assert.ok(libra.en.includes('is a diplomat'));
assert.ok(libra.ta.length > 0);
assert.ok(libra.citation.includes('Bhrigu Samhita'), libra.citation);
assert.ok(libra.citation.includes('T.M. Rao'), libra.citation);
assert.ok(libra.citation.includes('ப.156'), libra.citation);

// Leo: the printed page is 104 (the scan's page 99 is the chapter opener)
assert.equal(lagnaLordInLagna(4).page, 104);
assert.equal(lagnaLordInLagna(4).planet, 'Sun');

// Aries: Mars in the 1st house, printed page 25
assert.equal(lagnaLordInLagna(0).planet, 'Mars');
assert.equal(lagnaLordInLagna(0).page, 25);

// Virgo: Mercury in the 1st house, printed page 131 (the scan's page 126)
assert.equal(lagnaLordInLagna(5).planet, 'Mercury');
assert.equal(lagnaLordInLagna(5).page, 131);

// every lagna has its text, Tamil summary, a page and a citation
for (let i = 0; i < 12; i += 1) {
  const e = lagnaLordInLagna(i);
  assert.ok(e.en.length > 40, `${e.sign} text`);
  assert.ok(e.ta.length > 10, `${e.sign} Tamil`);
  assert.ok(e.page >= 25 && e.page <= 261, `${e.sign} page`);
  assert.ok(e.citation.includes('ப.'), `${e.sign} citation page`);
}

// out of range is refused
assert.throws(() => lagnaLordInLagna(12), /out of range/);

console.log('test-nature-temperament ok');
