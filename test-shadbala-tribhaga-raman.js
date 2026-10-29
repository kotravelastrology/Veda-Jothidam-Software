const assert = require('assert');
const { calculateShadbala } = require('./src/chart/shadbala');
const { withEphemeris } = require('./src/ephemeris/isolation');
const swe = require('./node_modules/@swisseph/node');

// Raman, Graha and Bhava Balas, Standard Horoscope (Chapter I para 6-7; Example 19, PDF p.46): birth 20 ghatis 32 palas
// after sunrise in a day of 29 ghatis 20 palas, so the birth is in the third Thribhaga, ruled by Sani; Guru always has 60.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const longitudes = {
  Sun: dms(180, 53, 55), Moon: dms(311, 17, 19), Mars: dms(229, 30, 34), Mercury: dms(181, 31, 34),
  Jupiter: dms(84, 0, 49), Venus: dms(171, 9, 56), Saturn: dms(124, 22, 41),
};
const ascendant = dms(298, 27, 0);
const mc = dms(216, 30, 0);
const utcOffsetMinutes = 5 * 60 + 10 + 20 / 60;
const birthJd = swe.julianDay(1918, 10, 16, (14 * 60 + 6 + 16 / 60) / 60 - utcOffsetMinutes / 60);

withEphemeris({ ayanamsha: 'Lahiri' }, () => {
  const r = calculateShadbala({
    longitudes, lagnaRasiIndex: Math.floor(ascendant / 30), ascendant, mc, birthJd, latitude: 13, longitude: dms(77, 35, 0),
    year: 1918, month: 10, day: 16, utcOffsetMinutes, drikMethod: 'raman', sthanaMethod: 'raman',
  });
  const tribhaga = Object.fromEntries(Object.keys(longitudes).map((p) => [p, r.perPlanet[p].kaala.tribhagaBala]));
  assert.deepStrictEqual(tribhaga, { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 60, Venus: 0, Saturn: 60 });
});

console.log('test-shadbala-tribhaga-raman: all assertions passed');
