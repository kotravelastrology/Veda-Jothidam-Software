const assert = require('node:assert/strict');
const { calculateKarakas, calculateYogaKarakas, NAISARGIKA_KARAKA, BHAVA_KARAKA } = require('./src/chart/karaka');

// Naisargika Karaka: the book's own "standard literature" table (v.22-24), 7 classical grahas.
assert.equal(Object.keys(NAISARGIKA_KARAKA).length, 7);
assert.equal(NAISARGIKA_KARAKA.Sun, 'Father');
assert.equal(NAISARGIKA_KARAKA.Moon, 'Mother');
assert.equal(NAISARGIKA_KARAKA.Jupiter, 'Children');
assert.equal(NAISARGIKA_KARAKA.Saturn, 'Longevity');

// Bhava Karaka: 12 houses, v.31-34's own table.
assert.equal(Object.keys(BHAVA_KARAKA).length, 12);
assert.equal(BHAVA_KARAKA[1], 'Sun');
assert.equal(BHAVA_KARAKA[9], 'Jupiter');
assert.equal(BHAVA_KARAKA[10], 'Mercury');
assert.equal(BHAVA_KARAKA[12], 'Saturn');

// Yoga Karaka, Aries Lagna (rasi 0): Mars rules Aries, which is both a
// kendra (1st) and a trikona (1st) sign at once -- the classic "Mars is
// yoga karaka for Aries ascendant" case.
assert.deepEqual(calculateYogaKarakas(0), ['Mars']);

// Yoga Karaka, Taurus Lagna (rasi 1): Saturn rules Aquarius (10th, kendra)
// AND Capricorn (9th, trikona) -- two DIFFERENT signs, the classic
// "Saturn is yoga karaka for Taurus ascendant" case (not just self-overlap
// at the 1st house). Venus (ruling Taurus itself, both kendra and trikona
// via the 1st house) also qualifies.
const taurusYoga = calculateYogaKarakas(1);
assert.ok(taurusYoga.includes('Saturn'));
assert.ok(taurusYoga.includes('Venus'));
assert.equal(taurusYoga.length, 2);

// Full calculateKarakas: Chara Karaka stays an explicit refusal (Jaimini deferral).
const full = calculateKarakas(0);
assert.equal(full.charaKaraka.status, 'SOURCE_REQUIRED');
assert.deepEqual(full.yoga, ['Mars']);
assert.equal(full.naisargika.Moon, 'Mother');
assert.equal(full.bhava[7], 'Venus');
assert.equal(full.source.tradition, 'Parashari');

console.log(JSON.stringify({ pass: true, ariesYoga: calculateYogaKarakas(0), taurusYoga }, null, 2));
