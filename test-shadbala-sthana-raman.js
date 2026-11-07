const assert = require('assert');
const { calculateShadbala } = require('./src/chart/shadbala');
const { withEphemeris } = require('./src/ephemeris/isolation');
const swe = require('./node_modules/@swisseph/node');

// Raman, Graha and Bhava Balas, Standard Horoscope (Chapter I para 6-7; Example 13 table, PDF p.28-29): the Nirayana
// longitudes, the Udaya Lagna 298°27′ and the birth at 2h 6m 16s p.m. LMT on 16 October 1918 at 13°N 5h 10m 20s E.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const longitudes = {
  Sun: dms(180, 53, 55), Moon: dms(311, 17, 19), Mars: dms(229, 30, 34), Mercury: dms(181, 31, 34),
  Jupiter: dms(84, 0, 49), Venus: dms(171, 9, 56), Saturn: dms(124, 22, 41),
};
const ascendant = dms(298, 27, 0);
const mc = dms(216, 30, 0);
const utcOffsetMinutes = 5 * 60 + 10 + 20 / 60;
const birthJd = swe.julianDay(1918, 10, 16, (14 * 60 + 6 + 16 / 60) / 60 - utcOffsetMinutes / 60);

// Raman's Sthana Bala totals (Example 13, PDF p.28-29): Ravi 198.000, Chandra 126.500, Kuja 172.060, Budha 279.500,
// Guru 157.580, Sukra 178.200, Sani 177.300.
const RAMAN_STHANA = { Sun: 198.0, Moon: 126.5, Mars: 172.06, Mercury: 279.5, Jupiter: 157.58, Venus: 178.2, Saturn: 177.3 };

async function main() {
await withEphemeris({ ayanamsha: 'Lahiri' }, () => {
  const r = calculateShadbala({
    longitudes, lagnaRasiIndex: Math.floor(ascendant / 30), ascendant, mc, birthJd, latitude: 13, longitude: dms(77, 35, 0),
    year: 1918, month: 10, day: 16, utcOffsetMinutes, drikMethod: 'raman', sthanaMethod: 'raman',
  });
  for (const [planet, expected] of Object.entries(RAMAN_STHANA)) {
    const got = r.perPlanet[planet].sthanaBala;
    // Ochcha, Ojhayugma and Kendra are the engine's own values, within 0.1 of Raman's; the total is within 0.2.
    assert.ok(Math.abs(got - expected) < 0.2, `${planet} Sthana ${got.toFixed(2)} vs Raman ${expected}`);
  }
});

assert.throws(() => calculateShadbala({ longitudes, lagnaRasiIndex: 0, ascendant, mc, birthJd, latitude: 13, longitude: 77, year: 1918, month: 10, day: 16, utcOffsetMinutes, sthanaMethod: 'no-such' }), /unknown sthana method/);
console.log('test-shadbala-sthana-raman: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
