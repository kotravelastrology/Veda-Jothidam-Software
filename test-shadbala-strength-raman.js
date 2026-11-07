const assert = require('assert');
const { calculateShadbala, ramanShadbalaPinda, ramanStrengthVsMinimum, RAMAN_MINIMUM_RUPAS } = require('./src/chart/shadbala');
const { withEphemeris } = require('./src/ephemeris/isolation');
const swe = require('./node_modules/@swisseph/node');

// Raman, Graha and Bhava Balas, Standard Horoscope, Example 57 (PDF pp.90-91): each planet's Shadbala Pinda in rupas over
// its minimum (Art.122). Raman's strengths: Ravi 1.42 (I), Chandra 1.08 (VI), Kuja 0.99 (VII), Budha 1.26 (III), Guru
// 1.11 (V), Sukra 1.14 (IV), Sani 1.30 (II). Budha's 1.26 is his printed 8.85 rupas over 7; his own Example 56 components
// give 537.02 Shashtiamsas, 8.95 rupas, so 1.28 here. Ranking is by strength, largest first.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const longitudes = {
  Sun: dms(180, 53, 55), Moon: dms(311, 17, 19), Mars: dms(229, 30, 34), Mercury: dms(181, 31, 34),
  Jupiter: dms(84, 0, 49), Venus: dms(171, 9, 56), Saturn: dms(124, 22, 41),
};
const ascendant = dms(298, 27, 0);
const mc = dms(216, 30, 0);
const utcOffsetMinutes = 5 * 60 + 10 + 20 / 60;
const birthJd = swe.julianDay(1918, 10, 16, (14 * 60 + 6 + 16 / 60) / 60 - utcOffsetMinutes / 60);
const RAMAN_STRENGTH = {
  Sun: 1.42, Moon: 1.08, Mars: 0.99, Mercury: 1.28, Jupiter: 1.11, Venus: 1.14, Saturn: 1.30,
};
const RAMAN_ORDER = ['Sun', 'Saturn', 'Mercury', 'Venus', 'Jupiter', 'Moon', 'Mars'];

async function main() {
  // Raman's minimums, as Art.122 gives them.
  assert.deepStrictEqual(RAMAN_MINIMUM_RUPAS, {
    Sun: 5, Moon: 6, Mars: 5, Mercury: 7, Jupiter: 6.5, Venus: 5.5, Saturn: 5,
  });

  await withEphemeris({ ayanamsha: 'Lahiri' }, () => {
    const r = calculateShadbala({
      longitudes, lagnaRasiIndex: Math.floor(ascendant / 30), ascendant, mc, birthJd, latitude: 13, longitude: dms(77, 35, 0),
      year: 1918, month: 10, day: 16, utcOffsetMinutes, drikMethod: 'raman', sthanaMethod: 'raman', kalaMethod: 'raman',
      chestaMethod: 'raman', ayanamsaDegrees: 21 + 16 / 60,
    });
    const strength = Object.fromEntries(Object.keys(RAMAN_STRENGTH).map((planet) => [
      planet, ramanStrengthVsMinimum(planet, ramanShadbalaPinda(r.perPlanet[planet])),
    ]));

    for (const [planet, expected] of Object.entries(RAMAN_STRENGTH)) {
      assert.ok(Math.abs(strength[planet] - expected) < 0.01,
        `${planet} strength ${strength[planet].toFixed(3)} vs Raman ${expected}`);
    }

    const order = Object.keys(strength).sort((a, b) => strength[b] - strength[a]);
    assert.deepStrictEqual(order, RAMAN_ORDER, `ranking by strength ${order.join(', ')}`);

    // Powerful: a strength of 1 or more. Raman's Example 57 finds Kuja short of her minimum; the rest are powerful.
    const powerful = Object.keys(strength).filter((planet) => strength[planet] >= 1).sort();
    assert.deepStrictEqual(powerful, ['Jupiter', 'Mercury', 'Saturn', 'Sun', 'Venus', 'Moon'].sort());
    assert.ok(strength.Mars < 1, 'Kuja falls short of 5 rupas');
  });

  console.log('test-shadbala-strength-raman: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
