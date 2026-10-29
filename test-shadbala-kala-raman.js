const assert = require('assert');
const { calculateShadbala, ramanKranti, ayanaBalaRaman, equationOfTimeDays } = require('./src/chart/shadbala');
const { withEphemeris } = require('./src/ephemeris/isolation');
const swe = require('./node_modules/@swisseph/node');

// Raman, Graha and Bhava Balas, Standard Horoscope (Chapter V, Example 35, PDF p.67-68): the total Kala Bala of each planet.
// Raman adds his own ayanamsha (21d16') to the nirayana longitudes for the sayana ones (Art.72, Example 32), so the test
// passes that value explicitly; the app's own ayanamsha is used everywhere else.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const longitudes = {
  Sun: dms(180, 53, 55), Moon: dms(311, 17, 19), Mars: dms(229, 30, 34), Mercury: dms(181, 31, 34),
  Jupiter: dms(84, 0, 49), Venus: dms(171, 9, 56), Saturn: dms(124, 22, 41),
};
const ascendant = dms(298, 27, 0);
const mc = dms(216, 30, 0);
const utcOffsetMinutes = 5 * 60 + 10 + 20 / 60;
const birthJd = swe.julianDay(1918, 10, 16, (14 * 60 + 6 + 16 / 60) / 60 - utcOffsetMinutes / 60);
const RAMAN_RAMAN_AYANAMSHA = 21 + 16 / 60;
const RAMAN_KALA_TOTAL = {
  Sun: 102.98, Moon: 202.04, Mars: 30.06, Mercury: 192.79, Jupiter: 211.18, Venus: 115.53, Saturn: 116.97,
};

async function main() {
await withEphemeris({ ayanamsha: 'Lahiri' }, () => {
  // Equation of time on 16 October 1918: Raman's Example 17 converts 2-6 p.m. LMT to 2-20 p.m. LAT (14 minutes).
  const eotMinutes = equationOfTimeDays(birthJd) * 1440;
  assert.ok(Math.abs(eotMinutes - 14) < 1, `equation of time ${eotMinutes.toFixed(2)} min is about Raman's 14`);

  // Raman's Kranti (Art.74, north positive), in his printed decimal notation: Ravi 8.75 S, Chandra 10.75 S, Kuja 22.45 S,
  // Budha 9.0 S, Guru 23.5 N, Sukra 4.96 S, Sani 13.03 N. The table itself gives 8.75, 10.75, 22.43, 8.99, 23.09, 5.00 and
  // 13.15: Guru and Sani differ from his printed figures (see the totals below), the rest agree.
  const sayana = (p) => (longitudes[p] + RAMAN_RAMAN_AYANAMSHA) % 360;
  const expectedKranti = {
    Sun: -8.75, Moon: -10.75, Mars: -22.43, Mercury: -8.98, Jupiter: 23.09, Venus: -4.96, Saturn: 13.15,
  };
  for (const [planet, deg] of Object.entries(expectedKranti)) {
    const k = ramanKranti(sayana(planet));
    assert.ok(Math.abs(k - deg) < 0.05, `${planet} Kranti ${k.toFixed(2)} vs ${deg}`);
  }

  const r = calculateShadbala({
    longitudes, lagnaRasiIndex: Math.floor(ascendant / 30), ascendant, mc, birthJd, latitude: 13, longitude: dms(77, 35, 0),
    year: 1918, month: 10, day: 16, utcOffsetMinutes, drikMethod: 'raman', sthanaMethod: 'raman',
    kalaMethod: 'raman', ayanamsaDegrees: RAMAN_RAMAN_AYANAMSHA,
  });
  const kala = (p) => r.perPlanet[p].kaala;

  // Components that reproduce Raman's figures exactly (to the printed paisa).
  assert.ok(Math.abs(kala('Sun').nathonnataBala - 48.32) < 0.05, 'Ravi Nathonnata (Diva) 48.32');
  assert.ok(Math.abs(kala('Moon').nathonnataBala - 11.68) < 0.05, 'Chandra Nathonnata (Ratri) 11.68');
  assert.ok(Math.abs(kala('Mercury').nathonnataBala - 60) < 1e-9, 'Budha always 60');
  assert.ok(Math.abs(kala('Sun').pakshaBala - 16.54) < 0.01, 'Ravi Paksha 16.54');
  assert.ok(Math.abs(kala('Moon').pakshaBala - 86.92) < 0.05, 'Chandra Paksha doubled 86.92');
  assert.ok(Math.abs(kala('Mercury').pakshaBala - 16.54) < 0.01, 'Budha afflicted (Sun within 1 degree): papa 16.54');
  assert.ok(Math.abs(kala('Jupiter').pakshaBala - 43.46) < 0.01, 'Guru subha 43.46');
  assert.ok(Math.abs(kala('Venus').pakshaBala - 43.46) < 0.01, 'Sukra subha 43.46');
  assert.ok(Math.abs(kala('Sun').ayanaBala - 38.12) < 0.05, 'Ravi Ayana doubled 38.12');
  assert.ok(Math.abs(kala('Moon').ayanaBala - 43.44) < 0.01, 'Chandra Ayana 43.44');
  assert.ok(Math.abs(kala('Mercury').ayanaBala - 41.25) < 0.05, 'Budha Ayana 41.25');
  assert.ok(Math.abs(kala('Venus').ayanaBala - 23.75) < 0.01, 'Sukra Ayana 23.75');
  assert.strictEqual(kala('Moon').varshaMasaDinaHoraBala, 60, 'Hora lord Chandra 60');
  assert.strictEqual(kala('Mercury').varshaMasaDinaHoraBala, 75, 'Masa 30 + Vara 45 to Budha');
  assert.strictEqual(kala('Saturn').varshaMasaDinaHoraBala, 15, 'Abda lord Sani 15');
  assert.strictEqual(kala('Jupiter').tribhagaBala, 60);
  assert.strictEqual(kala('Saturn').tribhagaBala, 60);

  // Totals (Example 35). The residuals are in Raman's printed Ayana figures, not in the table: his Kuja Kranti 22.45 gives
  // 1.94 (he prints 1.84, and the table gives 1.96); his Guru Kranti 23.5 gives 59.4 (the table gives 23.09, Ayana 58.86);
  // his Sani Kranti 13.03 gives 13.71 (the table gives 13.15, Ayana 13.55, he prints 13.75). The tolerance covers them.
  for (const [planet, expected] of Object.entries(RAMAN_KALA_TOTAL)) {
    const total = r.perPlanet[planet].kaalaBala;
    assert.ok(Math.abs(total - expected) < 0.6, `${planet} Kala Bala ${total.toFixed(2)} vs Raman ${expected}`);
  }
  assert.ok(Math.abs(r.perPlanet.Sun.kaalaBala - 102.98) < 0.1, 'Ravi total 102.98');
  assert.ok(Math.abs(r.perPlanet.Mercury.kaalaBala - 192.79) < 0.1, 'Budha total 192.79');
  assert.ok(Math.abs(r.perPlanet.Moon.kaalaBala - 202.04) < 0.1, 'Chandra total 202.04');
});

// The method guard: an unknown Kala reading is refused, not silently treated as BPHS.
assert.throws(() => calculateShadbala({
  longitudes, lagnaRasiIndex: 0, ascendant, mc, birthJd, latitude: 13, longitude: 77, year: 1918, month: 10, day: 16,
  utcOffsetMinutes, kalaMethod: 'nonsense',
}), /unknown kala method/);

// Raman's Ayana formula at the equator (sayana 0, Kranti 0): every planet gets 24/48 x 60 = 30 Virupas, the Sun's doubled.
assert.ok(Math.abs(ayanaBalaRaman('Mercury', 0) - 30) < 1e-9, 'Budha at the equator: 24/48 x 60 = 30');
assert.ok(Math.abs(ayanaBalaRaman('Sun', 0) - 60) < 1e-9, 'Ravi at the equator: doubled');

console.log('test-shadbala-kala-raman: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
