const assert = require('assert');
const { calculateShadbala, ramanShadbalaPinda } = require('./src/chart/shadbala');
const { withEphemeris } = require('./src/ephemeris/isolation');
const swe = require('./node_modules/@swisseph/node');

// Raman, Graha and Bhava Balas, Standard Horoscope, Example 56 (PDF pp.89-90): the Shadbala Pinda of each planet in
// Shashtiamsas, from Sthana, Dik, Kala, Chesta and Naisargika Bala with Drik Bala added or subtracted (Art.121).
// Three of his printed totals do not add up to his own components, so they are corrected here: Ravi 424.24 prints
// against components that sum to 424.94 (his rupas 7.08 agree with 424.94); Kuja's Kala prints 33.06, which is 30.06
// (his Example 35 figure, and the only value that makes his printed total 298.14); Guru prints 433.71 against 433.77.
// Budha's components sum to 537.02 but his rupas print 8.85 (537.02 is 8.95), so Budha's rupas are not asserted.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const longitudes = {
  Sun: dms(180, 53, 55), Moon: dms(311, 17, 19), Mars: dms(229, 30, 34), Mercury: dms(181, 31, 34),
  Jupiter: dms(84, 0, 49), Venus: dms(171, 9, 56), Saturn: dms(124, 22, 41),
};
const ascendant = dms(298, 27, 0);
const mc = dms(216, 30, 0);
const utcOffsetMinutes = 5 * 60 + 10 + 20 / 60;
const birthJd = swe.julianDay(1918, 10, 16, (14 * 60 + 6 + 16 / 60) / 60 - utcOffsetMinutes / 60);
const RAMAN_PINDA = {
  Sun: { shashtiamsas: 424.94, rupas: 7.08 },
  Moon: { shashtiamsas: 389.80, rupas: 6.50 },
  Mars: { shashtiamsas: 298.14, rupas: 4.97 },
  Mercury: { shashtiamsas: 537.02, rupas: null },
  Jupiter: { shashtiamsas: 433.77, rupas: 7.23 },
  Venus: { shashtiamsas: 376.15, rupas: 6.27 },
  Saturn: { shashtiamsas: 389.21, rupas: 6.49 },
};

async function main() {
  await withEphemeris({ ayanamsha: 'Lahiri' }, () => {
    const r = calculateShadbala({
      longitudes, lagnaRasiIndex: Math.floor(ascendant / 30), ascendant, mc, birthJd, latitude: 13, longitude: dms(77, 35, 0),
      year: 1918, month: 10, day: 16, utcOffsetMinutes, drikMethod: 'raman', sthanaMethod: 'raman', kalaMethod: 'raman',
      chestaMethod: 'raman', ayanamsaDegrees: 21 + 16 / 60,
    });
    for (const [planet, expected] of Object.entries(RAMAN_PINDA)) {
      const pinda = ramanShadbalaPinda(r.perPlanet[planet]);
      // Within 0.6 Shashtiamsa (0.01 rupa). Jupiter's gap is the Ayana residual traced in test-shadbala-kala-raman.js (his
      // printed Guru Kranti 23.5 does not follow from his own table); the others are rounding in his Kala and Sthana rows.
      assert.ok(Math.abs(pinda - expected.shashtiamsas) < 0.6,
        `${planet} Shadbala Pinda ${pinda.toFixed(2)} vs Raman ${expected.shashtiamsas}`);
      if (expected.rupas !== null) {
        assert.ok(Math.abs(pinda / 60 - expected.rupas) < 0.02,
          `${planet} Pinda in rupas ${(pinda / 60).toFixed(3)} vs Raman ${expected.rupas}`);
      }
    }
  });

  console.log('test-shadbala-pinda-raman: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
