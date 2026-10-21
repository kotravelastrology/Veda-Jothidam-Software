const assert = require('assert');
const P = require('./src/report/planetHouse');

// Every planet from Sun to Saturn has all twelve houses, with a verse number, a printed page and a Tamil summary.
for (const book of P.BOOKS) {
  assert.ok(book.source.title && book.source.author && book.source.pageLocus);
  assert.deepStrictEqual(Object.keys(book.cells), P.PLANETS);
  for (const planet of P.PLANETS) {
    const cells = book.cells[planet];
    assert.deepStrictEqual(Object.keys(cells), Array.from({ length: 12 }, (_, i) => String(i + 1)));
    for (const [h, c] of Object.entries(cells)) {
      assert.ok(Number.isInteger(c.verse) && Number.isInteger(c.page) && c.ta.length > 20, `${planet} ${h}`);
      assert.ok(c.page >= 473 && c.page <= 534, `${planet} ${h}: page ${c.page} outside chapter 30`);
    }
  }
}

// Saravali chapter 30: one verse per planet-house, in order from 2 (Sun in the ascendant) to 85 (Saturn in the 12th).
const sar = P.BOOKS[0];
const verses = P.PLANETS.flatMap((p) => Array.from({ length: 12 }, (_, i) => sar.cells[p][String(i + 1)].verse));
assert.deepStrictEqual(verses, Array.from({ length: 84 }, (_, i) => i + 2));
// printed pages never go backward
const pages = P.PLANETS.flatMap((p) => Array.from({ length: 12 }, (_, i) => sar.cells[p][String(i + 1)].page));
assert.ok(pages.every((p, i) => i === 0 || p >= pages[i - 1]));
// the two places the printed book is faulty are flagged
assert.strictEqual(sar.cells.Venus['7'].misprint, true);
assert.strictEqual(sar.cells.Mars['2'].gloss, true);

// Houses from the lagna.
assert.strictEqual(P.houseOf(4, 4), 1);
assert.strictEqual(P.houseOf(4, 3), 12);
assert.strictEqual(P.houseOf(10, 2), 5);

// A chart: Leo lagna (4), Sun and Moon in Leo, Mars in Virgo, Saturn in Gemini (11th... 2 -> 11), Rahu in Cancer.
const signs = { Sun: 4, Moon: 4, Mars: 5, Mercury: 4, Jupiter: 4, Venus: 4, Saturn: 2, Rahu: 3, Ketu: 9 };
const r = P.planetHouseReadings({ lagnaSign: 4, signs });
assert.strictEqual(r.length, 9);
assert.strictEqual(r.find((x) => x.planet === 'Saturn').house, 11);
assert.strictEqual(r.find((x) => x.planet === 'Saturn').readings[0].verse, 84);
assert.strictEqual(r.find((x) => x.planet === 'Mars').readings[0].verse, 27, 'Virgo is the 2nd house of a Leo lagna: Mars in the 2nd');
console.log('test-planet-house ok');
