const assert = require('assert');
const { buildPage14 } = require('./src/report/horoscopeBook/ashtakavargaPage');
const { EXPECTED_TOTAL } = require('./src/chart/ashtakavarga');

// Sample birth, PL9 aniruddha_HC4 page 14: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

// PL9 page 14, transcribed from the sample's text layer (pymupdf word positions). Signs run from the planet's own sign,
// as PL9 prints them; each row is the 12 marks in that order, then the row total. Totals row: bindus per sign, then the total.
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
};
const ROW_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Lagna'];

async function main() {
  const page = await buildPage14({ name: 'aniruddha', birth });
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), 'no undefined, NaN or null on page 14');
  assert.deepStrictEqual(page.blocks.map((b) => b.kind), Array(4).fill(['table', 'signGrid']).flat());
  assert.deepStrictEqual(page.blocks.filter((b) => b.kind === 'table').map((b) => b.heading), [
    'Sun Bhinnashtakavarga', 'Moon Bhinnashtakavarga', 'Mars Bhinnashtakavarga', 'Mercury Bhinnashtakavarga',
  ]);

  for (let i = 0; i < 4; i += 1) {
    const planet = ['Sun', 'Moon', 'Mars', 'Mercury'][i];
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

    // Total row: the bindus of each sign, the grand total and the printed grand total.
    const totalRow = table.rows[8];
    assert.deepStrictEqual(totalRow.slice(1, 13), expected.totals.map(String), `${planet} sign totals`);
    assert.strictEqual(totalRow[13], String(expected.grand), `${planet} grand total`);
    assert.strictEqual(expected.grand, EXPECTED_TOTAL[planet], `${planet} grand total matches the engine's expected total`);

    // The chart: the bindus by sign, in the usual sign order (cell 0 = Aries).
    assert.strictEqual(grid.cells.length, 12);
    expected.signs.forEach((sign, j) => {
      assert.deepStrictEqual(grid.cells[sign - 1], [String(expected.totals[j])], `${planet} chart sign ${sign}`);
    });
  }

  console.log('test-horoscope-book-ashtakavarga-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
