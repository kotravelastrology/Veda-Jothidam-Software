const assert = require('assert');
const P = require('./src/report/planetHouse');

const PAGES = { 'saravali-ch30': [473, 534], 'brihat-jataka-20': [152, 155] };

// Every book: Sun to Saturn, all twelve houses; each cell has a verse, a printed page inside the chapter and either
// a Tamil summary or a pointer to another planet's cell (the book's "the rest as for ...").
for (const book of P.BOOKS) {
  assert.ok(book.source.title && book.source.author && book.source.pageLocus);
  assert.deepStrictEqual(Object.keys(book.cells), P.PLANETS);
  const [lo, hi] = PAGES[book.id];
  for (const planet of P.PLANETS) {
    const cells = book.cells[planet];
    assert.deepStrictEqual(Object.keys(cells), Array.from({ length: 12 }, (_, i) => String(i + 1)));
    for (const [h, c] of Object.entries(cells)) {
      assert.ok(Number.isInteger(c.verse) && Number.isInteger(c.page), `${book.id} ${planet} ${h}`);
      assert.ok(c.page >= lo && c.page <= hi, `${book.id} ${planet} ${h}: page ${c.page} outside the chapter`);
      assert.ok(c.sameAs ? P.PLANETS.includes(c.sameAs) && !c.ta : c.ta.length >= 3, `${book.id} ${planet} ${h}`);
      const r = P.resolve(book, planet, Number(h));
      assert.ok(r && r.ta.length >= 3, `${book.id} ${planet} ${h} does not resolve`);
    }
  }
}

// Saravali chapter 30: one verse per planet-house, in order from 2 (Sun in the ascendant) to 85 (Saturn in the 12th).
const sar = P.BOOKS.find((b) => b.id === 'saravali-ch30');
const verses = P.PLANETS.flatMap((p) => Array.from({ length: 12 }, (_, i) => sar.cells[p][String(i + 1)].verse));
assert.deepStrictEqual(verses, Array.from({ length: 84 }, (_, i) => i + 2));
const pages = P.PLANETS.flatMap((p) => Array.from({ length: 12 }, (_, i) => sar.cells[p][String(i + 1)].page));
assert.ok(pages.every((p, i) => i === 0 || p >= pages[i - 1]));
// the two places the printed book is faulty are flagged
assert.strictEqual(sar.cells.Venus['7'].misprint, true);
assert.strictEqual(sar.cells.Mars['2'].gloss, true);

// Brihat Jataka chapter 20: nine verses, in order; the "rest as for" cells.
const bj = P.BOOKS.find((b) => b.id === 'brihat-jataka-20');
const bjVerses = [...new Set(P.PLANETS.flatMap((p) => Array.from({ length: 12 }, (_, i) => bj.cells[p][String(i + 1)].verse)))];
assert.deepStrictEqual(bjVerses, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
assert.strictEqual(bj.cells.Mars['5'].sameAs, 'Sun');
assert.strictEqual(P.resolve(bj, 'Mars', 5).ta, bj.cells.Sun['5'].ta);
assert.strictEqual(P.resolve(bj, 'Mars', 5).from, 'Sun');
assert.strictEqual(bj.cells.Mars['9'].sameAs, undefined, 'Mars in the 9th is given outright');
assert.strictEqual(P.resolve(bj, 'Venus', 8).ta, bj.cells.Jupiter['8'].ta);
assert.strictEqual(P.resolve(bj, 'Venus', 12).from, null, 'Venus in the 12th is given outright');
assert.ok(bj.cells.Saturn['5'].caveat);

// Houses from the lagna.
assert.strictEqual(P.houseOf(4, 4), 1);
assert.strictEqual(P.houseOf(4, 3), 12);
assert.strictEqual(P.houseOf(10, 2), 5);

// A chart: Leo lagna (4), Sun, Moon, Mercury, Jupiter, Venus in Leo, Mars in Virgo, Saturn in Gemini, Rahu in Cancer.
const signs = { Sun: 4, Moon: 4, Mars: 5, Mercury: 4, Jupiter: 4, Venus: 4, Saturn: 2, Rahu: 3, Ketu: 9 };
const r = P.planetHouseReadings({ lagnaSign: 4, signs });
assert.strictEqual(r.length, 9);
const sat = r.find((x) => x.planet === 'Saturn');
assert.strictEqual(sat.house, 11);
assert.strictEqual(sat.readings.find((x) => x.bookId === 'saravali-ch30').verse, 84);
assert.strictEqual(sat.readings.find((x) => x.bookId === 'brihat-jataka-20').sameAs, 'Sun');
assert.strictEqual(r.find((x) => x.planet === 'Mars').readings[0].verse, 27, 'Virgo is the 2nd house of a Leo lagna');
assert.strictEqual(r.find((x) => x.planet === 'Rahu').readings.length, 0);

console.log('test-planet-house ok');
