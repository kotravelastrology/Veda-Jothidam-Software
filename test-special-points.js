/**
 * Page 7's special points (Indu Lagna, Beeja / Kshetra Sphuta, Yogi group, 64th Navamsha, 22nd Drekkana, Sarpa Dreshkana) against the Parashara's Light
 * printouts of Arjun (12 May 1983 15:05 Bengalooru) and Kotravel (15 Nov 1973 08:15:41 Erode), and the rules on their own.
 */
const assert = require('assert');
const SP = require('./src/report/specialPoints');
const { withBirth } = require('./src/report/horoscopeBook/charts');
const { buildSubPlanets } = require('./src/report/horoscopeBook/subPlanetsPage');

const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const SIGN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const BIRTHS = {
  arjun: { year: 1983, month: 5, day: 12, hour: 15, minute: 5, second: 0, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 12 + 59 / 60, longitude: 77 + 35 / 60, placeName: 'Bengalooru' },
  kotravel: { year: 1973, month: 11, day: 15, hour: 8, minute: 15, second: 41, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 11 + 21 / 60, longitude: 77 + 44 / 60, placeName: 'Erode' },
};
// what PL9 prints: Indu sign, Beeja sign and degree (seconds), Yogi point sign and degree, Yogi, Avayogi/Duplicate Yogi, 64th Navamsha (Mo/As), 22nd Dreshkana (As/Mo), Sarpa planets
const PL9 = {
  arjun: { indu: 'Capricorn', beeja: ['Aquarius', 21 * 3600 + 31 * 60 + 32], yogiPoint: ['Leo', 23 * 3600 + 2 * 60 + 5], yogi: 'Venus', avayogi: 'Jupiter', duplicate: 'Sun', n64: ['Capricorn', 'Gemini'], d22: ['Aries', 'Cancer'], sarpa: ['Jupiter'] },
  kotravel: { indu: 'Leo', beeja: ['Aries', 27 * 3600 + 35 * 60 + 20], yogiPoint: ['Taurus', 3 * 3600 + 12 * 60 + 49], yogi: 'Sun', avayogi: 'Saturn', duplicate: 'Venus', n64: ['Libra', 'Taurus'], d22: ['Aquarius', 'Aquarius'], sarpa: [] },
};

(async () => {
  for (const [key, birth] of Object.entries(BIRTHS)) {
    const want = PL9[key];
    await withBirth(birth, ({ chart }) => {
      const lon = Object.fromEntries(GRAHAS.map((g) => [g, chart.grahas[g].longitude]));
      const lagna = chart.lagna.longitude;
      assert.strictEqual(SIGN[SP.indu({ lagnaLongitude: lagna, moonLongitude: lon.Moon }).sign], want.indu, `${key} Indu Lagna`);
      const seed = SP.beeja({ longitudes: lon });
      assert.strictEqual(SIGN[seed.sign], want.beeja[0], `${key} Beeja sign`);
      assert.ok(Math.abs(Math.round((seed.longitude % 30) * 3600) - want.beeja[1]) <= 1, `${key} Beeja degree within a second of PL9`);
      assert.strictEqual(seed.outcome, 'certain', `${key} Beeja odd/odd`);
      const y = SP.yogi({ sunLongitude: lon.Sun, moonLongitude: lon.Moon });
      assert.strictEqual(SIGN[SP.signOf(y.longitude)], want.yogiPoint[0], `${key} Yogi point sign`);
      assert.ok(Math.abs(Math.round((y.longitude % 30) * 3600) - want.yogiPoint[1]) <= 1, `${key} Yogi point degree`);
      assert.deepStrictEqual([y.yogi, y.avayogi, y.duplicateYogi], [want.yogi, want.avayogi, want.duplicate], `${key} Yogi, Avayogi, Duplicate Yogi`);
      assert.deepStrictEqual([SIGN[SP.navamsha64(lon.Moon)], SIGN[SP.navamsha64(lagna)]], want.n64, `${key} 64th Navamsha`);
      assert.deepStrictEqual([SIGN[SP.drekkana22(lagna)], SIGN[SP.drekkana22(lon.Moon)]], want.d22, `${key} 22nd Dreshkana`);
      assert.deepStrictEqual(SP.sarpaDreshkana(lon), want.sarpa, `${key} Sarpa Dreshkana`);
    });
  }

  // the rules on their own
  const at = (sign, degree) => sign * 30 + degree;
  // Indu: Lagna Aries (9th = Sag, Jupiter 10), Moon Cancer (9th = Pis, Jupiter 10): 20 mod 12 = 8, the 8th from Cancer is Aquarius
  assert.strictEqual(SP.indu({ lagnaLongitude: at(0, 5), moonLongitude: at(3, 5) }).sign, 10);
  // a remainder of 0 is 12: Lagna Leo (9th Aries, Mars 6) and Moon Leo: 12 mod 12 = 0 -> 12, the 12th from Leo is Cancer
  assert.strictEqual(SP.indu({ lagnaLongitude: at(4, 5), moonLongitude: at(4, 5) }).sign, 3);
  // Beeja for a woman is Moon + Mars + Jupiter, and a woman wants even and even
  const f = SP.beeja({ female: true, longitudes: { Moon: at(1, 0), Mars: at(0, 0), Jupiter: at(0, 15) } }); // Taurus 15, an even sign
  assert.deepStrictEqual([f.name, f.parts, f.signOdd], ['Kshetra Sphuta', ['Moon', 'Mars', 'Jupiter'], false]);
  assert.strictEqual(SP.beeja({ longitudes: { Sun: at(0, 0), Venus: at(0, 0), Jupiter: at(0, 3) } }).outcome, 'certain'); // Aries 3: odd sign, odd Navamsha
  assert.strictEqual(SP.beeja({ longitudes: { Sun: at(1, 0), Venus: at(0, 0), Jupiter: at(0, 10) } }).outcome, 'delayed'); // Taurus 10: even sign, Aries Navamsha (odd)
  assert.strictEqual(SP.beeja({ longitudes: { Sun: at(1, 0), Venus: at(0, 0), Jupiter: at(0, 3) } }).outcome, 'none'); // Taurus 3: even sign, Capricorn Navamsha (even)
  // the Avayogi is the 6th Nakshatra counting the Yogi's as the first
  assert.strictEqual(SP.yogi({ sunLongitude: at(0, 0), moonLongitude: 360 - 93 - 20 / 60 + 1 }).avayogi, 'Rahu'); // the point is in Ashwini (Ketu); its 6th Nakshatra is Ardra
  // Sarpa Dreshkana: Cancer 2nd and 3rd, Scorpio 1st and 2nd, Pisces 3rd; Taurus and Cancer 1st are not
  assert.deepStrictEqual(SP.sarpaDreshkana({ A: at(3, 12), B: at(3, 25), C: at(3, 5), D: at(7, 15), E: at(7, 25), F: at(11, 25), G: at(1, 25), H: at(11, 5) }), ['A', 'B', 'D', 'F']);

  // the page: a man's page carries Beeja Sphuta, a woman's Kshetra Sphuta
  const page = await buildSubPlanets({ name: 'T', birth: BIRTHS.arjun });
  const points = page.blocks.find((b) => b.heading === 'Special Points');
  assert.deepStrictEqual(points.rows[0], ['Beeja Sphuta', 'Aqu', '21:31:31']);
  assert.deepStrictEqual(points.rows[1], ['Beeja Sphuta: birth chart / Navamsha', 'odd/odd', '100% (good)']);
  assert.deepStrictEqual(points.rows.slice(2).map((r) => r.slice(0, 2)), [['Yogi Point', 'Leo'], ['Yogi', 'Ven'], ['Avayogi / Duplicate Yogi', 'Jup/Sun'], ['64th Navamsha (Mo/As)', 'Capricorn/Gemini'], ['22nd Dreshkana (As/Mo)', 'Aries/Cancer'], ['Sarpa Dreshkana', 'Jup']]);
  const lagnas = page.blocks.find((b) => b.heading === 'Special Lagnas and Points');
  assert.deepStrictEqual(lagnas.rows[3], ['Indu Lagna', 'Cap', '15:00:00']);
  const woman = await buildSubPlanets({ name: 'T', birth: { ...BIRTHS.arjun, gender: 'female' } });
  assert.strictEqual(woman.blocks.find((b) => b.heading === 'Special Points').rows[0][0], 'Kshetra Sphuta');

  console.log('test-special-points: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
