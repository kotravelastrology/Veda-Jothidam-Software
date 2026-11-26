const assert = require('assert');
const {
  uchchaBala, ramanSunChesta, ramanChestaFor, ishtaPhala, kashtaPhala,
} = require('./src/chart/shadbala');
const { withEphemeris } = require('./src/ephemeris/isolation');
const swe = require('./node_modules/@swisseph/node');

// Raman, Graha and Bhava Balas, Standard Horoscope (Chapter X, Examples 60-63, PDF pp.101-103). Ishta Phala is the square
// root of Ochcha x Chesta; Kashta Phala the square root of (60 - Ochcha) x (60 - Chesta). The Sun's Chesta is Art.136 (his
// sayana longitude plus 90 degrees) and the Moon's is Art.137 (her elongation from the Sun), both in Shashtiamsas.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const longitudes = {
  Sun: dms(180, 53, 55), Moon: dms(311, 17, 19), Mars: dms(229, 30, 34), Mercury: dms(181, 31, 34),
  Jupiter: dms(84, 0, 49), Venus: dms(171, 9, 56), Saturn: dms(124, 22, 41),
};
const utcOffsetMinutes = 5 * 60 + 10 + 20 / 60;
const birthJd = swe.julianDay(1918, 10, 16, (14 * 60 + 6 + 16 / 60) / 60 - utcOffsetMinutes / 60);
const RAMAN_AYANAMSHA = 21 + 16 / 60;
// Venus's printed Ishta (3.49) and Saturn's (27.00) do not follow from his inputs: sqrt(1.95 x 5.95) = 3.41 and
// sqrt(34.80 x 21.14) = 27.12. The formula values are pinned here.
const RAMAN_ISHTA = {
  Sun: 8.25, Moon: 37.73, Mars: 28.70, Mercury: 11.20, Jupiter: 44.57, Venus: 3.41, Saturn: 27.12,
};
// Mercury's and Jupiter's printed Kashta (49.16, 13.19) do not follow from Raman's own inputs: (60 - 54.50)(60 - 2.30)
// gives 17.82, and (60 - 56.33)(60 - 35.26) gives 9.53. The formula values are pinned here, and his other five agree.
const RAMAN_KASHTA = {
  Sun: 46.13, Moon: 21.23, Mars: 29.44, Mercury: 17.82, Jupiter: 9.53, Venus: 56.00, Saturn: 31.29,
};

async function main() {
  await withEphemeris({ ayanamsha: 'Lahiri' }, () => {
    // Art.136 example: the Sun's sayana 202d10' gives Chesta kendra 67d50' and Chesta Bala 22.6.
    assert.ok(Math.abs(ramanSunChesta(dms(202, 10, 0)) - 22.61) < 0.05, 'Sun Chesta by Art.136');

    for (const planet of Object.keys(RAMAN_ISHTA)) {
      const ochcha = uchchaBala(planet, longitudes[planet]);
      const chesta = ramanChestaFor(planet, longitudes, birthJd, 1918, RAMAN_AYANAMSHA);
      const ishta = ishtaPhala(ochcha, chesta);
      const kashta = kashtaPhala(ochcha, chesta);
      assert.ok(Math.abs(ishta - RAMAN_ISHTA[planet]) < 0.1,
        `${planet} Ishta Phala ${ishta.toFixed(2)} vs Raman ${RAMAN_ISHTA[planet]}`);
      assert.ok(Math.abs(kashta - RAMAN_KASHTA[planet]) < 0.1,
        `${planet} Kashta Phala ${kashta.toFixed(2)} vs Raman ${RAMAN_KASHTA[planet]}`);
    }
  });

  // A negative Chesta has no real square root: null, not NaN.
  assert.strictEqual(ishtaPhala(30, -11.6), null, 'negative product has no Ishta');
  assert.ok(Math.abs(kashtaPhala(30, -11.6) - Math.sqrt(30 * 71.6)) < 1e-9, 'Kashta is defined for a negative Chesta');

  console.log('test-shadbala-ishta-kashta-raman: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
