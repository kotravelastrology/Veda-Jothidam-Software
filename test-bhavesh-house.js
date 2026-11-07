const assert = require('assert');
const B = require('./src/report/bhaveshHouse');

// BPHS chapter 24: 12 lords x 12 houses, verse = (lord - 1) x 12 + house, printed pages 189-235, never going backward.
const book = B.BOOKS[0];
assert.ok(book.source.title && book.source.author && book.source.pageLocus);
assert.deepStrictEqual(Object.keys(book.cells), Array.from({ length: 12 }, (_, i) => String(i + 1)));
let last = 0;
for (let lord = 1; lord <= 12; lord += 1) {
  const row = book.cells[String(lord)];
  assert.deepStrictEqual(Object.keys(row), Array.from({ length: 12 }, (_, i) => String(i + 1)));
  for (let house = 1; house <= 12; house += 1) {
    const c = row[String(house)];
    assert.strictEqual(c.verse, (lord - 1) * 12 + house);
    assert.ok(c.page >= 189 && c.page <= 235 && c.page >= last, `verse ${c.verse} page ${c.page}`);
    assert.ok(c.ta.length > 15, `verse ${c.verse}`);
    last = c.page;
  }
}

// Spot checks against the printed pages (read from the scan): 5th lord in the 6th (verse 54, p.204), 11th lord in the 3rd (123, p.229).
assert.strictEqual(book.cells['5']['6'].verse, 54);
assert.strictEqual(book.cells['5']['6'].page, 204);
assert.strictEqual(book.cells['11']['3'].page, 229);

// A chart: Leo lagna (4), Sun, Moon, Mercury, Jupiter, Venus in Leo, Mars in Virgo, Saturn in Gemini, Rahu in Cancer.
const signs = { Sun: 4, Moon: 4, Mars: 5, Mercury: 4, Jupiter: 4, Venus: 4, Saturn: 2, Rahu: 3, Ketu: 9 };
const r = B.bhaveshReadings({ lagnaSign: 4, signs });
assert.strictEqual(r.length, 12);
assert.strictEqual(r[0].lord, 'Sun');
assert.strictEqual(r[0].lordHouse, 1);
assert.strictEqual(r[0].readings[0].verse, 1, 'lagna lord in the lagna');
// 2nd house is Virgo, lord Mercury, in Leo = the 1st house: 2nd lord in the ascendant (verse 13).
assert.strictEqual(r[1].lord, 'Mercury');
assert.strictEqual(r[1].readings[0].verse, 13);
// 7th house is Aquarius, lord Saturn, in Gemini = the 11th house: 7th lord in the 11th (verse 83).
assert.strictEqual(r[6].lord, 'Saturn');
assert.strictEqual(r[6].lordHouse, 11);
assert.strictEqual(r[6].readings[0].verse, 83);
// 8th house is Pisces, lord Jupiter, in Leo = the 1st: 8th lord in the ascendant (verse 85).
assert.strictEqual(r[7].readings[0].verse, 85);

console.log('test-bhavesh-house ok');
