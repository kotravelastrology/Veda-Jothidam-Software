const assert = require('assert');
const { buildPage12 } = require('./src/report/horoscopeBook/aspectPage');

// Sample birth, PL9 aniruddha_HC4 page 12: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};
const NOT_BUILT = 'கட்டப்படவில்லை';
const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

async function main() {
  const page = await buildPage12({ name: 'aniruddha', birth });
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), 'no undefined, NaN or null on page 12');
  assert.deepStrictEqual(page.blocks.map((b) => b.heading), ['Aspects on Planets', 'Aspects on Bhavas']);

  const [planets, bhavas] = page.blocks;
  assert.deepStrictEqual(planets.columns, ['', 'Degree', ...GRAHAS]);
  assert.strictEqual(planets.rows.length, 9);
  assert.strictEqual(bhavas.rows.length, 12);

  // Column index of each aspecting graha in the table (0 = label, 1 = degree).
  const col = (name) => 2 + GRAHAS.indexOf(name);
  const cell = (table, rowLabel, colName) => {
    const row = table.rows.find((r) => r[0] === rowLabel);
    assert.ok(row, `${rowLabel} row exists`);
    return row[col(colName)];
  };

  // Degrees as PL9 prints them (aspected grahas' longitudes).
  assert.strictEqual(planets.rows.find((r) => r[0] === 'Sun')[1], '167:44');
  assert.strictEqual(planets.rows.find((r) => r[0] === 'Moon')[1], '353:57');
  assert.strictEqual(planets.rows.find((r) => r[0] === 'Ketu')[1], '100:04');

  // Aspects on planets, PL9 page 12 cells (aspecting graha in the column, aspected graha in the row).
  assert.strictEqual(cell(planets, 'Sun', 'Moon'), '4/4 (47)');
  assert.strictEqual(cell(planets, 'Sun', 'Mars'), '1/2 (31)');
  assert.strictEqual(cell(planets, 'Sun', 'Jupiter'), '1/4 (17)');
  assert.strictEqual(cell(planets, 'Sun', 'Saturn'), '4/4 (52)');
  assert.strictEqual(cell(planets, 'Moon', 'Sun'), '4/4 (56)');
  assert.strictEqual(cell(planets, 'Moon', 'Jupiter'), '4/4 (51)');
  assert.strictEqual(cell(planets, 'Saturn', 'Sun'), '3/4 (41)');
  assert.strictEqual(cell(planets, 'Saturn', 'Mars'), '4/4 (54)');
  assert.strictEqual(cell(planets, 'Mercury', 'Saturn'), '4/4 (39)');
  assert.strictEqual(cell(planets, 'Venus', 'Saturn'), '4/4 (45)');
  assert.strictEqual(cell(planets, 'Rahu', 'Sun'), '1/2 (33)');
  assert.strictEqual(cell(planets, 'Ketu', 'Saturn'), '3/4 (52)');
  // Pinned: PL9 prints a value of 5 on Saturn to Mars, a house BPHS gives no aspect.
  assert.strictEqual(cell(planets, 'Mars', 'Saturn'), '-', 'PL9 prints 5 here, a non-aspect house');

  // The aspecting nodes are not built, in every row.
  for (const row of planets.rows) {
    assert.strictEqual(row[col('Rahu')], NOT_BUILT, `${row[0]} Rahu column is not built`);
    assert.strictEqual(row[col('Ketu')], NOT_BUILT, `${row[0]} Ketu column is not built`);
  }

  // Aspects on bhavas, PL9 page 12 (values only, bhava points at the Ascendant and each thirty degrees on).
  assert.strictEqual(cell(bhavas, 'I', 'Mars'), '54');
  assert.strictEqual(cell(bhavas, 'I', 'Saturn'), '30');
  assert.strictEqual(cell(bhavas, 'II', 'Moon'), '59');
  assert.strictEqual(cell(bhavas, 'IV', 'Mars'), '60');
  assert.strictEqual(cell(bhavas, 'V', 'Saturn'), '-');
  assert.strictEqual(cell(bhavas, 'XII', 'Mars'), '23');
  // Pinned: the seventh bhava point lies within 0.1 degree of Saturn's 60-degree boundary; PL9 gives 59, ours 14.
  assert.strictEqual(cell(bhavas, 'VII', 'Saturn'), '14', 'PL9 prints 59 here (boundary case)');

  console.log('test-horoscope-book-aspect-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
