const assert = require('assert');
const { buildPage17 } = require('./src/report/horoscopeBook/ashtakavargaPage');
const {
  trikonaReduction, ekadhipatyaReduction, rashiPinda, grahaPinda, shodhyaPinda,
} = require('./src/chart/ashtakavargaReductions');

// Sample birth, PL9 aniruddha_HC4 page 17: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

// PL9 page 17, transcribed from the sample's text layer (cell positions in the four grids). Arrays run from sign 1 (Aries).
const PL9 = {
  Sun: {
    before: [1, 6, 5, 4, 5, 2, 3, 4, 5, 5, 3, 5], trikona: [0, 4, 2, 0, 4, 0, 0, 0, 4, 3, 0, 1],
    ekadh: [0, 4, 2, 0, 4, 0, 0, 0, 4, 3, 0, 1], pinda: [159, 57, 216],
  },
  Moon: {
    before: [4, 5, 6, 5, 1, 3, 4, 3, 3, 6, 4, 5], trikona: [3, 2, 2, 2, 0, 0, 0, 0, 2, 3, 0, 2],
    ekadh: [3, 2, 2, 2, 0, 0, 0, 0, 2, 3, 0, 2], pinda: [122, 56, 178],
  },
  Mars: {
    before: [2, 4, 5, 4, 5, 1, 2, 3, 3, 4, 4, 2], trikona: [0, 3, 3, 2, 3, 0, 0, 1, 1, 3, 2, 0],
    ekadh: [0, 3, 3, 2, 3, 0, 0, 1, 1, 2, 2, 0], pinda: [141, 49, 190],
  },
  Mercury: {
    before: [2, 6, 6, 4, 6, 4, 3, 4, 5, 7, 4, 3], trikona: [0, 2, 3, 1, 4, 0, 0, 1, 3, 3, 1, 0],
    ekadh: [0, 2, 3, 1, 4, 0, 0, 1, 3, 1, 1, 0], pinda: [139, 41, 180],
  },
  Jupiter: {
    before: [5, 7, 5, 5, 3, 5, 4, 5, 4, 5, 6, 2], trikona: [2, 2, 1, 3, 0, 0, 0, 3, 1, 0, 2, 0],
    ekadh: [2, 2, 1, 3, 0, 0, 0, 2, 1, 0, 2, 0], pinda: [101, 51, 152],
  },
  Venus: {
    before: [7, 4, 3, 6, 3, 4, 5, 5, 2, 4, 4, 5], trikona: [5, 0, 0, 1, 1, 0, 2, 0, 0, 0, 1, 0],
    ekadh: [5, 0, 0, 1, 1, 0, 2, 0, 0, 0, 1, 0], pinda: [74, 10, 84],
  },
  Saturn: {
    before: [4, 5, 4, 4, 4, 2, 4, 2, 2, 2, 4, 2], trikona: [2, 3, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    ekadh: [2, 3, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0], pinda: [72, 44, 116],
  },
  Lagna: {
    before: [3, 6, 3, 4, 3, 3, 6, 3, 6, 4, 5, 3], trikona: [0, 3, 0, 1, 0, 0, 3, 0, 3, 1, 2, 0],
    ekadh: [0, 3, 0, 1, 0, 0, 0, 0, 3, 1, 1, 0], pinda: [77, 49, 126],
  },
};
const BODY_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'];

/** Engine checks, one per branch of the Ekadhipatya rule, on bindus that isolate it. */
function assertRules() {
  // Trikona: the smallest of each trinal group comes off all three. Input 1..12: each group leaves 0, 4, 8.
  assert.deepStrictEqual(trikonaReduction([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), [0, 0, 0, 0, 4, 4, 4, 4, 8, 8, 8, 8]);

  const none = new Set();
  // A zero in either sign of a pair: no reduction (Mars's pair, Aries 0 and Scorpio 7).
  const zeroInOne = [0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0];
  assert.deepStrictEqual(ekadhipatyaReduction(zeroInOne, none), zeroInOne);
  // A graha in both signs of a pair: no reduction (Jupiter's pair Sagittarius 8 and Pisces 11, with Saturn and the Moon).
  const both = new Set([8, 11]);
  const bothInPair = [0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1];
  assert.deepStrictEqual(ekadhipatyaReduction(bothInPair, both), bothInPair);
  // A graha in one sign: the other goes to zero when it has no more bindus, else to the difference.
  // Venus's pair Taurus (1) and Libra (6), with a graha in Taurus.
  const withOne = new Set([1]);
  const equalToGraha = [0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0];
  assert.strictEqual(ekadhipatyaReduction(equalToGraha, withOne)[6], 0, 'equal to the graha sign: the other goes to zero');
  const aboveGraha = [0, 2, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0];
  assert.strictEqual(ekadhipatyaReduction(aboveGraha, withOne)[6], 3, 'above the graha sign: the difference');
  // No graha: the larger goes to the smaller (the PL9 reading), and equal signs both go to zero.
  // Saturn's pair Capricorn 9 and Aquarius 10.
  const larger = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0];
  assert.strictEqual(ekadhipatyaReduction(larger, none)[10], 1, 'the larger goes to the smaller');
  const equal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0];
  const equalOut = ekadhipatyaReduction(equal, none);
  assert.deepStrictEqual([equalOut[9], equalOut[10]], [0, 0], 'equal signs go to zero');

  // Pindas on a single sign: the multiplier of that sign (Libra 7), or the graha multiplier of the graha in it.
  const unit = Array(12).fill(0);
  unit[6] = 2;
  assert.strictEqual(rashiPinda(unit), 14, 'Libra multiplier 7 times 2');
  const grahaSign = { Sun: 6, Moon: 0, Mars: 1, Mercury: 2, Jupiter: 3, Venus: 4, Saturn: 5 };
  const oneSign = Array(12).fill(0);
  oneSign[6] = 1;
  assert.strictEqual(grahaPinda(oneSign, grahaSign), 5, 'Sun\'s sign holds one bindu; the Sun\'s multiplier is 5');
  assert.strictEqual(shodhyaPinda(oneSign, grahaSign), 7 + 5, 'Shodhya = Rashi + Graha');
}

async function main() {
  assertRules();

  const page = await buildPage17({ name: 'aniruddha', birth });
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), 'no undefined, NaN or null on page 17');
  assert.strictEqual(page.blocks.length, 32, 'four blocks for each of the eight bodies');

  BODY_ORDER.forEach((body, i) => {
    const [before, trikona, ekadh, pindaTable] = page.blocks.slice(4 * i, 4 * i + 4);
    const expected = PL9[body];
    assert.strictEqual(before.heading, `${body} — before reduction`);
    assert.deepStrictEqual(before.cells.map((c) => Number(c[0])), expected.before, `${body} before reduction`);
    assert.deepStrictEqual(trikona.cells.map((c) => Number(c[0])), expected.trikona, `${body} Trikona reduction`);
    assert.deepStrictEqual(ekadh.cells.map((c) => Number(c[0])), expected.ekadh, `${body} Ekadhipatya reduction`);
    assert.strictEqual(pindaTable.heading, `${body} pindas`);
    assert.deepStrictEqual(pindaTable.rows.map((r) => Number(r[1])), expected.pinda, `${body} Rashi, Graha and Sodhya Pinda`);
    assert.deepStrictEqual(pindaTable.rows.map((r) => r[0]), ['Rashi Pinda', 'Graha Pinda', 'Sodhya Pinda']);
  });

  console.log('test-horoscope-book-reductions-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
