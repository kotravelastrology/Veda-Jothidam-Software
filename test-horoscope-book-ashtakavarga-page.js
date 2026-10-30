const assert = require('assert');
const { buildPage14, buildPage15 } = require('./src/report/horoscopeBook/ashtakavargaPage');
const { EXPECTED_TOTAL, LAGNA_EXPECTED_TOTAL } = require('./src/chart/ashtakavarga');

// Sample birth, PL9 aniruddha_HC4 pages 14 and 15: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

// PL9 pages 14 and 15, transcribed from the sample's text layer (pymupdf word positions). Signs run from the planet's own
// sign, as PL9 prints them. Each row: the 12 marks in that order and the row total. Totals: bindus per sign and the grand total.
const PL9 = {
  Sun: {
    signs: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5],
    rows: {
      Saturn: ['110110100111', 8], Jupiter: ['001100101000', 4], Mars: ['001111101101', 8], Sun: ['110100111110', 8],
      Venus: ['000001100001', 3], Mercury: ['001011001111', 7], Moon: ['000110001001', 4], Lagna: ['011010001110', 6],
    },
    totals: [2, 3, 4, 5, 5, 3, 5, 1, 6, 5, 4, 5], grand: 48,
  },
  Moon: {
    signs: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    rows: {
      Saturn: ['011000010001', 4], Jupiter: ['011110010011', 7], Mars: ['100110110011', 7], Sun: ['110110001001', 6],
      Venus: ['101110001110', 7], Mercury: ['110110101110', 8], Moon: ['101001100110', 6], Lagna: ['001100010010', 4],
    },
    totals: [5, 4, 5, 6, 5, 1, 3, 4, 3, 3, 6, 4], grand: 49,
  },
  Mars: {
    signs: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1],
    rows: {
      Saturn: ['011111010010', 7], Jupiter: ['110000010001', 4], Mars: ['110100110110', 7], Sun: ['011000101100', 5],
      Venus: ['001100000101', 4], Mercury: ['001000101100', 4], Moon: ['100100001000', 3], Lagna: ['110101001000', 5],
    },
    totals: [4, 5, 4, 5, 1, 2, 3, 3, 4, 4, 2, 2], grand: 39,
  },
  Mercury: {
    signs: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5],
    rows: {
      Saturn: ['110110100111', 8], Jupiter: ['000101001100', 4], Mars: ['001111101101', 8], Sun: ['000011001011', 5],
      Venus: ['111110011010', 8], Mercury: ['101011001111', 8], Moon: ['010110010101', 6], Lagna: ['101010101101', 7],
    },
    totals: [4, 3, 4, 5, 7, 4, 3, 2, 6, 6, 4, 6], grand: 54,
  },
  Jupiter: {
    signs: [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3],
    rows: {
      Saturn: ['000010010110', 4], Jupiter: ['111100110110', 8], Mars: ['010011011011', 7], Sun: ['101111001111', 9],
      Venus: ['100100110011', 6], Mercury: ['101101110011', 8], Moon: ['101010100100', 5], Lagna: ['011011110111', 9],
    },
    totals: [5, 3, 5, 4, 5, 4, 5, 6, 2, 5, 7, 5], grand: 56,
  },
  Venus: {
    signs: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5],
    rows: {
      Saturn: ['110001110011', 7], Jupiter: ['001001111000', 5], Mars: ['110010110010', 6], Sun: ['000000010011', 3],
      Venus: ['111110011110', 9], Mercury: ['001011001010', 5], Moon: ['011011111110', 9], Lagna: ['111100110101', 8],
    },
    totals: [4, 5, 5, 2, 4, 4, 5, 7, 4, 3, 6, 3], grand: 52,
  },
  Saturn: {
    signs: [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8],
    rows: {
      Saturn: ['001011000010', 4], Jupiter: ['100001100001', 4], Mars: ['001110010110', 6], Sun: ['100110110110', 7],
      Venus: ['001000011000', 3], Mercury: ['001011111000', 6], Moon: ['010001001000', 3], Lagna: ['010001101011', 6],
    },
    totals: [2, 2, 4, 2, 4, 5, 4, 4, 4, 2, 4, 2], grand: 39,
  },
  Lagna: {
    signs: [5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4],
    rows: {
      Saturn: ['011010110100', 6], Jupiter: ['101111011101', 9], Mars: ['001000110101', 5], Sun: ['100110100011', 6],
      Venus: ['011111001100', 7], Mercury: ['011010101011', 7], Moon: ['100011100100', 5], Lagna: ['001001000110', 4],
    },
    totals: [3, 3, 6, 3, 6, 4, 5, 3, 3, 6, 3, 4], grand: 49,
  },
};
const ROW_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Lagna'];

/** Each planet's table and chart on a page, checked cell for cell against PL9. */
function assertPlanets(page, planets) {
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), 'no undefined, NaN or null on the page');
  assert.deepStrictEqual(page.blocks.map((b) => b.kind), Array(planets.length).fill(['table', 'signGrid']).flat());
  assert.deepStrictEqual(page.blocks.filter((b) => b.kind === 'table').map((b) => b.heading),
    planets.map((p) => `${p} Bhinnashtakavarga`));

  planets.forEach((planet, i) => {
    const expected = PL9[planet];
    const table = page.blocks[2 * i];
    const grid = page.blocks[2 * i + 1];

    // Header: the sign numbers from the planet's sign, then the total column.
    assert.deepStrictEqual(table.columns, ['Sign', ...expected.signs.map(String), 'Total'], `${planet} sign header`);
    assert.strictEqual(table.rows.length, 9, `${planet}: eight contributors and the total row`);

    // Each contributor row: the twelve marks and the row total, cell for cell as PL9 prints them.
    ROW_ORDER.forEach((c, r) => {
      const [marks, total] = expected.rows[c];
      assert.deepStrictEqual(table.rows[r].slice(0, 1), [c], `${planet} row label`);
      assert.strictEqual(table.rows[r].slice(1, 13).join(''), marks, `${planet} ${c} marks`);
      assert.strictEqual(table.rows[r][13], String(total), `${planet} ${c} row total`);
    });

    // Total row: the bindus of each sign and the grand total.
    const totalRow = table.rows[8];
    assert.deepStrictEqual(totalRow.slice(1, 13), expected.totals.map(String), `${planet} sign totals`);
    assert.strictEqual(totalRow[13], String(expected.grand), `${planet} grand total`);

    // The chart: the bindus by sign, in the usual sign order (cell 0 = Aries).
    assert.strictEqual(grid.cells.length, 12);
    expected.signs.forEach((sign, j) => {
      assert.deepStrictEqual(grid.cells[sign - 1], [String(expected.totals[j])], `${planet} chart sign ${sign}`);
    });
  });
}

async function main() {
  const page14 = await buildPage14({ name: 'aniruddha', birth });
  assertPlanets(page14, ['Sun', 'Moon', 'Mars', 'Mercury']);
  assert.strictEqual(PL9.Sun.grand, EXPECTED_TOTAL.Sun, 'Sun grand total matches the engine\'s expected total');
  assert.strictEqual(PL9.Moon.grand, EXPECTED_TOTAL.Moon, 'Moon grand total matches the engine\'s expected total');
  assert.strictEqual(PL9.Mars.grand, EXPECTED_TOTAL.Mars, 'Mars grand total matches the engine\'s expected total');
  assert.strictEqual(PL9.Mercury.grand, EXPECTED_TOTAL.Mercury, 'Mercury grand total matches the engine\'s expected total');

  const page15 = await buildPage15({ name: 'aniruddha', birth });
  assertPlanets(page15, ['Jupiter', 'Venus', 'Saturn', 'Lagna']);
  assert.strictEqual(PL9.Jupiter.grand, EXPECTED_TOTAL.Jupiter, 'Jupiter grand total matches the engine\'s expected total');
  assert.strictEqual(PL9.Venus.grand, EXPECTED_TOTAL.Venus, 'Venus grand total matches the engine\'s expected total');
  assert.strictEqual(PL9.Saturn.grand, EXPECTED_TOTAL.Saturn, 'Saturn grand total matches the engine\'s expected total');
  assert.strictEqual(PL9.Lagna.grand, LAGNA_EXPECTED_TOTAL, 'Lagna grand total matches Patel\'s 49');

  console.log('test-horoscope-book-ashtakavarga-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
