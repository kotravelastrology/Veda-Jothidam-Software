/**
 * BPHS ch.70 on Saturn's transit and the Ashtakavarga (src/report/ashtakavargaEffects.js, fixture bphs-70.json): the fixture's shape, the seven worked examples of the
 * book reproduced from the rekhas and Yoga Pindas it gives, and the rule on a real chart.
 */
const assert = require('node:assert/strict');
const A = require('./src/report/ashtakavargaEffects');
const { withBirth } = require('./src/report/horoscopeBook/charts');
const { calculateBhinnashtakavarga, CONTRIBUTORS } = require('./src/chart/ashtakavarga');
const { trikonaReduction, ekadhipatyaReduction, shodhyaPinda } = require('./src/chart/ashtakavargaReductions');

assert.ok(A.DATA.source.title && A.DATA.source.pageLocus && A.DATA.scope && A.DATA.method.ta.length > 50 && A.DATA.matters.ta.length > 50);
assert.deepEqual(Object.keys(A.DATA.planets), A.PLANETS);
assert.deepEqual(A.PLANETS.map((p) => A.DATA.planets[p].house), [9, 4, 3, 4, 5, 7, 8]);
for (const p of A.PLANETS) {
  const d = A.DATA.planets[p];
  const [a, b] = d.page.split('-').map(Number);
  assert.ok(a >= 881 && (b ?? a) <= 894 && d.ta.length > 40 && d.matter && d.verses, p);
}

// the seven examples (the rekhas of the book's house times the Yoga Pinda it states, and the remainders the book states): [rekhas, yoga pinda, nakshatra, sign]
const examples = {
  Sun: [2, 148, 26, 8], // Uttarabhadra and Scorpio (v.7-11, p.883-884)
  Moon: [4, 158, 11, 8], // Purvaphalguni and Scorpio (p.887)
  Mars: [5, 113, 25, 1], // Purvabhadra and Aries (p.888)
  Mercury: [5, 154, 14, 2], // Chitra and Taurus (p.889)
  Jupiter: [4, 115, 1, 4], // Ashwini and Cancer (p.891)
  Venus: [3, 72, 27, 12], // Revati and Pisces: both remainders 0 (p.892)
  Saturn: [1, 197, 8, 5], // Pushyami and Leo (p.894)
};
for (const [p, [rekhas, pinda, n, r]] of Object.entries(examples)) {
  const t = A.saturnTargets(rekhas, pinda);
  assert.equal(t.nakshatra, n, `${p}: nakshatra`);
  assert.equal(t.rasi, r, `${p}: sign`);
}
// the trinal ones the book names: the Sun's Uttarabhadra with Pushyami and Anuradha (p.883), the Moon's Scorpio with Pisces and Cancer (p.884-887),
// Jupiter's Ashwini with Makha and Moola, Cancer with Scorpio and Pisces (p.891), Venus's Revati with Ashlesha and Jyeshtha, Pisces with Cancer and Scorpio (p.892), Saturn's Pushyami with Anuradha and Uttarabhadra (p.894)
assert.deepEqual(A.saturnTargets(2, 148).nakshatras.slice().sort((a, b) => a - b), [8, 17, 26]);
assert.deepEqual(A.saturnTargets(2, 148).rasis.slice().sort((a, b) => a - b), [4, 8, 12]);
assert.deepEqual(A.saturnTargets(4, 115).nakshatras.slice().sort((a, b) => a - b), [1, 10, 19]);
assert.deepEqual(A.saturnTargets(4, 115).rasis.slice().sort((a, b) => a - b), [4, 8, 12]);
assert.deepEqual(A.saturnTargets(3, 72).nakshatras.slice().sort((a, b) => a - b), [9, 18, 27]);
assert.deepEqual(A.saturnTargets(1, 197).nakshatras.slice().sort((a, b) => a - b), [8, 17, 26]);
// a house with no rekha gives nothing
assert.deepEqual(A.saturnTargets(0, 100), { product: 0, nakshatra: null, rasi: null, nakshatras: [], rasis: [] });

// a real chart: the 5 October 1990 sample; each planet's house, rekhas and pindas agree with the engines the book pages use
const birth = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai' };
(async () => {
  await withBirth(birth, ({ chart }) => {
    const eff = A.chartEffects(chart);
    const rasi = Object.fromEntries(CONTRIBUTORS.map((c) => [c, Math.floor((c === 'Lagna' ? chart.lagna : chart.grahas[c]).longitude / 30)]));
    const grahaSigns = new Set([...A.PLANETS.map((p) => rasi[p]), rasi.Lagna]);
    for (const p of A.PLANETS) {
      const e = eff[p];
      const before = calculateBhinnashtakavarga(p, rasi);
      assert.equal(e.sign, (rasi[p] + A.DATA.planets[p].house - 1) % 12, `${p}: the book's house`);
      assert.equal(e.rekhas, before[e.sign], `${p}: the rekhas of that sign before reduction`);
      assert.equal(e.yogaPinda, shodhyaPinda(ekadhipatyaReduction(trikonaReduction(before), grahaSigns), rasi), `${p}: the Yoga Pinda`);
      assert.equal(e.yogaPinda, e.rashiPinda + e.grahaPinda, p);
      assert.deepEqual(e.targets, A.saturnTargets(e.rekhas, e.yogaPinda), p);
      assert.ok(e.rekhas >= 0 && e.rekhas <= 8, p);
      if (e.targets.nakshatra) assert.ok(e.targets.nakshatra >= 1 && e.targets.nakshatra <= 27 && e.targets.rasi >= 1 && e.targets.rasi <= 12, p);
    }
  });
  console.log('test-ashtakavarga-effects: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
