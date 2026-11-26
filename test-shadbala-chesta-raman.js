const assert = require('assert');
const { calculateShadbala, ramanChestaInterval, ramanChesta } = require('./src/chart/shadbala');
const { withEphemeris } = require('./src/ephemeris/isolation');
const swe = require('./node_modules/@swisseph/node');

// Raman, Graha and Bhava Balas, Standard Horoscope (Chapter VI, Examples 39-51, PDF pp.70-84). The Seeghrochcha and
// mean longitudes are Raman's own (Art.87-104), built from his epoch and motion constants; the true longitudes are the
// nirayana ones of the Standard Horoscope. The Chesta kendra and Chesta Bala are then Art.105-107.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const longitudes = {
  Sun: dms(180, 53, 55), Moon: dms(311, 17, 19), Mars: dms(229, 30, 34), Mercury: dms(181, 31, 34),
  Jupiter: dms(84, 0, 49), Venus: dms(171, 9, 56), Saturn: dms(124, 22, 41),
};
const ascendant = dms(298, 27, 0);
const mc = dms(216, 30, 0);
const utcOffsetMinutes = 5 * 60 + 10 + 20 / 60;
const birthJd = swe.julianDay(1918, 10, 16, (14 * 60 + 6 + 16 / 60) / 60 - utcOffsetMinutes / 60);

// Raman's printed figures (Examples 46-51): the mean longitude, the Seeghrochcha, the reduced Chesta kendra and the Chesta Bala.
const RAMAN = {
  Mars: { mean: 266.34, seeghra: 181.23, kendra: 66.69, bala: 22.23 },
  Mercury: { mean: 181.23, seeghra: 174.49, kendra: 6.89, bala: 2.30 },
  Jupiter: { mean: 66.91, seeghra: 181.23, kendra: 105.77, bala: 35.26 },
  Venus: { mean: 181.23, seeghra: 158.35, kendra: 17.85, bala: 5.95 },
  Saturn: { mean: 111.23, seeghra: 181.23, kendra: 63.42, bala: 21.14 },
};

async function main() {
await withEphemeris({ ayanamsha: 'Lahiri' }, () => {
  // Art.89 interval: 6,862.58 days from the 1900 epoch (Ujjain mean midnight) to the birth (Example 39).
  const interval = ramanChestaInterval(birthJd);
  assert.ok(Math.abs(interval - 6862.58) < 0.02, `interval ${interval.toFixed(3)} days vs Raman's 6862.58`);

  for (const [planet, expected] of Object.entries(RAMAN)) {
    const got = ramanChesta(planet, longitudes[planet], birthJd, 1918);
    // Guru's mean: Raman's own Table VI rows disagree by about 0.1 (his 800-day row implies a slightly different daily
    // motion from his 6,000-day row), so Guru's mean tolerance is 0.1; the Chesta Bala is unaffected beyond 0.02.
    const meanTolerance = planet === 'Jupiter' ? 0.1 : 0.05;
    assert.ok(Math.abs(got.mean - expected.mean) < meanTolerance, `${planet} mean ${got.mean.toFixed(2)} vs ${expected.mean}`);
    // Budha's Seeghrochcha: Raman's rounded table entries sum to 174.49, the constants give 174.56 (0.07 degree, which moves
    // his kendra by 0.06 and his Chesta Bala by about 0.02 Virupa), so Budha's position tolerance is 0.1.
    const positionTolerance = planet === 'Mercury' ? 0.1 : 0.05;
    assert.ok(Math.abs(got.seeghra - expected.seeghra) < positionTolerance, `${planet} Seeghrochcha ${got.seeghra.toFixed(2)} vs ${expected.seeghra}`);
    assert.ok(Math.abs(got.kendra - expected.kendra) < positionTolerance, `${planet} reduced Chesta kendra ${got.kendra.toFixed(2)} vs ${expected.kendra}`);
    assert.ok(Math.abs(got.bala - expected.bala) < 0.05, `${planet} Chesta Bala ${got.bala.toFixed(2)} vs ${expected.bala}`);
  }

  // Through the Shadbala engine: Raman's Chesta method, with Sun and Moon at zero (Art.79: Chesta is for the five
  // planets; the Sun and the Moon have none).
  const r = calculateShadbala({
    longitudes, lagnaRasiIndex: Math.floor(ascendant / 30), ascendant, mc, birthJd, latitude: 13, longitude: dms(77, 35, 0),
    year: 1918, month: 10, day: 16, utcOffsetMinutes, drikMethod: 'raman', sthanaMethod: 'raman', kalaMethod: 'raman',
    ayanamsaDegrees: 21 + 16 / 60, chestaMethod: 'raman',
  });
  assert.strictEqual(r.perPlanet.Sun.cheshtaBala, 0, 'Sun has no Chesta Bala');
  assert.strictEqual(r.perPlanet.Moon.cheshtaBala, 0, 'Moon has no Chesta Bala');
  for (const [planet, expected] of Object.entries(RAMAN)) {
    assert.ok(Math.abs(r.perPlanet[planet].cheshtaBala - expected.bala) < 0.05, `${planet} engine Chesta ${r.perPlanet[planet].cheshtaBala}`);
  }
});

assert.throws(() => calculateShadbala({
  longitudes, lagnaRasiIndex: 0, ascendant, mc, birthJd, latitude: 13, longitude: 77, year: 1918, month: 10, day: 16,
  utcOffsetMinutes, chestaMethod: 'nonsense',
}), /unknown chesta method/);

console.log('test-shadbala-chesta-raman: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
