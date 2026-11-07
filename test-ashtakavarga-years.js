/**
 * The rest of BPHS ch.70 (src/report/ashtakavargaYears.js, fixture bphs-70-rest.json): the book's worked example of v.37-40 and the other rules on charts worked by hand.
 */
const assert = require('node:assert/strict');
const Y = require('./src/report/ashtakavargaYears');
const { withBirth } = require('./src/report/horoscopeBook/charts');
const { calculateBhinnashtakavarga } = require('./src/chart/ashtakavarga');

const D = Y.DATA;
assert.ok(D.source.title && D.source.pageLocus && D.scope.length > 800);
for (const k of ['years', 'father', 'sun', 'moon']) assert.ok(D[k].ta.length > 80 && D[k].verses && D[k].page, k);
assert.equal(D.father.succession.verses, '15');
assert.equal(D.years.page, '893');

// the book's example (p.893): Aquarius Lagna, Saturn in Scorpio, Saturn's rekhas by sign from Aries: 30 to Saturn, 16 from it, 46 in all
const ex = D.yearsExample;
assert.equal(ex.rekhas.reduce((a, b) => a + b, 0), 39, 'Saturn\'s Bhinnashtakavarga holds 39 rekhas');
assert.deepEqual(Y.saturnYears(ex.rekhas, ex.lagnaSign, ex.saturnSign), { toSaturn: ex.toSaturn, fromSaturn: ex.fromSaturn, total: ex.total });
assert.deepEqual(Y.saturnYears(ex.rekhas, 10, 7), { toSaturn: 30, fromSaturn: 16, total: 46 });
// both signs count: the sum of the two is the 39 rekhas and the two end signs again
assert.equal(Y.saturnYears(ex.rekhas, 10, 7).total, 39 + ex.rekhas[10] + ex.rekhas[7]);
// the Ascendant and Saturn in one sign: that sign's rekhas twice
assert.deepEqual(Y.saturnYears([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 4, 4), { toSaturn: 5, fromSaturn: 5, total: 10 });
// Saturn just before the Lagna: from the Lagna round the whole zodiac to Saturn is all but nothing back
assert.deepEqual(Y.saturnYears([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 5, 4), { toSaturn: 12, fromSaturn: 2, total: 14 });
assert.deepEqual(Y.saturnYears([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 4, 5), { toSaturn: 2, fromSaturn: 12, total: 14 });

assert.deepEqual(Y.extremes([4, 5, 6, 5, 1, 3, 6, 2, 4, 5, 5, 4]), { most: [2, 6], fewest: [4], top: 6, low: 1 });
assert.deepEqual(Y.extremes([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]).most.length, 12);

// the father's yogas by hand, Aries Lagna: the 4th lord is the Moon (Cancer), the 10th lord Saturn (Capricorn)
const signs = (over) => ({ Sun: 0, Moon: 5, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 9, ...over });
let f = Y.fatherYogas({ signs: signs({}), lagnaSign: 0 });
assert.deepEqual([f.lord4, f.lord10, f.lord4House, f.lord4HouseFromMoon, f.obedient, f.tenthLordInLagna], ['Moon', 'Saturn', 6, 1, false, false]);
f = Y.fatherYogas({ signs: signs({ Moon: 10 }), lagnaSign: 0 });
assert.equal(f.obedient, true, 'the 4th lord, the Moon, in the 11th');
assert.equal(f.lord4HouseFromMoon, 1);
f = Y.fatherYogas({ signs: signs({ Moon: 0 }), lagnaSign: 0 });
assert.equal(f.obedient, true, 'the 4th lord in the Lagna');
// the 4th lord not the Moon: Taurus Lagna, the 4th Leo (the Sun), the 10th Aquarius (Saturn)
f = Y.fatherYogas({ signs: signs({ Sun: 4, Moon: 7 }), lagnaSign: 1 });
assert.deepEqual([f.lord4, f.lord10, f.lord4House, f.lord4HouseFromMoon, f.obedient], ['Sun', 'Saturn', 4, 10, true], 'Leo is the 10th from Scorpio');
f = Y.fatherYogas({ signs: signs({ Sun: 4, Moon: 6 }), lagnaSign: 1 });
assert.deepEqual([f.lord4HouseFromMoon, f.obedient], [11, true], 'Leo is the 11th from Libra');
f = Y.fatherYogas({ signs: signs({ Sun: 4, Moon: 5 }), lagnaSign: 1 });
assert.deepEqual([f.lord4House, f.lord4HouseFromMoon, f.obedient], [4, 12, false], 'Leo is the 12th from Virgo');
f = Y.fatherYogas({ signs: signs({ Saturn: 0 }), lagnaSign: 0 });
assert.equal(f.tenthLordInLagna, true, 'the 10th lord Saturn in the Aries Lagna');

// a real chart: the 5 October 1990 sample; Saturn's years from its own Bhinnashtakavarga
const birth = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai' };
(async () => {
  await withBirth(birth, ({ chart }) => {
    const rasi = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'].map((c) => [c, Math.floor((c === 'Lagna' ? chart.lagna : chart.grahas[c]).longitude / 30)]));
    const bav = calculateBhinnashtakavarga('Saturn', rasi);
    const y = Y.saturnYears(bav, rasi.Lagna, rasi.Saturn);
    assert.equal(y.total, bav.reduce((a, b) => a + b, 0) + bav[rasi.Lagna] + bav[rasi.Saturn]);
    assert.ok(y.toSaturn >= 1 && y.fromSaturn >= 1 && y.total <= 39 + 16);
  });
  console.log('test-ashtakavarga-years: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
