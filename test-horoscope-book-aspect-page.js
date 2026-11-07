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
  assert.deepStrictEqual(page.blocks.map((b) => b.heading), [
    'Aspects on Planets', 'Aspects on Bhavas (equal houses)', 'Aspects on Bhavas (Sripati)',
  ]);

  const [planets, bhavas, sripati] = page.blocks;
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
  assert.strictEqual(planets.rows.find((r) => r[0] === 'Sun')[1], '167:43');
  assert.strictEqual(planets.rows.find((r) => r[0] === 'Moon')[1], '353:56');
  assert.strictEqual(planets.rows.find((r) => r[0] === 'Ketu')[1], '100:03');

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
  // PL9 prints the value under a dash for a point off the slab houses (Saturn to Mars: 5)
  assert.strictEqual(cell(planets, 'Mars', 'Saturn'), '- (5)', 'a value off the slab houses is printed under a dash');

  // The aspecting nodes aspect as Jupiter does (as PL9 prints them): Rahu and Ketu are opposite, a full aspect each way
  assert.strictEqual(cell(planets, 'Ketu', 'Rahu'), '4/4 (60)');
  assert.strictEqual(cell(planets, 'Rahu', 'Ketu'), '4/4 (60)');
  for (const row of planets.rows) {
    assert.notStrictEqual(row[col('Rahu')], NOT_BUILT, `${row[0]} Rahu column is built`);
    assert.notStrictEqual(row[col('Ketu')], NOT_BUILT, `${row[0]} Ketu column is built`);
  }

  // Aspects on bhavas, PL9 page 12 (values only, bhava points at the Ascendant and each thirty degrees on).
  assert.strictEqual(cell(bhavas, 'I', 'Mars'), '54');
  assert.strictEqual(cell(bhavas, 'I', 'Saturn'), '30');
  assert.strictEqual(cell(bhavas, 'II', 'Moon'), '59');
  assert.strictEqual(cell(bhavas, 'IV', 'Mars'), '60');
  assert.strictEqual(cell(bhavas, 'V', 'Saturn'), '-');
  assert.strictEqual(cell(bhavas, 'XII', 'Mars'), '23');
  // Saturn's 3rd and 10th (twice the degrees from the boundary, aspectTables.js) gives PL9's 59 at the seventh bhava, which the general rule put at 14.
  assert.strictEqual(cell(bhavas, 'VII', 'Saturn'), '59');

  // Aspects on bhavas, Sripati bhava madhyas (page 3's convention). Not in PL9; these are regression pins of the same rules.
  assert.strictEqual(sripati.rows.length, 12);
  assert.deepStrictEqual(sripati.rows[0].slice(1), bhavas.rows[0].slice(1), 'house I is the Ascendant in both readings');
  assert.strictEqual(cell(sripati, 'II', 'Mars'), '23');
  assert.strictEqual(cell(sripati, 'IV', 'Mars'), '60');
  assert.strictEqual(cell(sripati, 'V', 'Saturn'), '-');
  assert.strictEqual(cell(sripati, 'VII', 'Saturn'), '59');
  assert.notStrictEqual(sripati.rows[1][1], bhavas.rows[1][1], 'house II differs: Sripati is not thirty degrees on');

  console.log('test-horoscope-book-aspect-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
