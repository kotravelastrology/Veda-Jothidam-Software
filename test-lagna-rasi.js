const assert = require('assert');
const L = require('./src/report/lagnaRasi');

const book = L.BOOKS[0];
assert.ok(book.source.title && book.source.author && book.source.pageLocus && book.scope);
assert.deepStrictEqual(Object.keys(book.cells), Array.from({ length: 12 }, (_, i) => String(i + 1)));
// Saravali ch.48: verses 3-49 in order, four or three verses a sign, printed pages 767-775 never going backward
let nextVerse = 3;
let last = 0;
for (let s = 1; s <= 12; s += 1) {
  const c = book.cells[String(s)];
  const [a, b] = c.verses.split('-').map(Number);
  assert.strictEqual(a, nextVerse, `sign ${s} starts at verse ${nextVerse}`);
  nextVerse = b + 1;
  assert.ok(c.page >= 767 && c.page <= 775 && c.page >= last, `sign ${s} page ${c.page}`);
  assert.ok(c.ta.length > 150, `sign ${s}`);
  last = c.page;
}
assert.strictEqual(nextVerse, 50);
assert.ok(/சத்யாசாரியர்/.test(book.cells['11'].ta), 'Aquarius keeps the book\'s note on the ascendant');
assert.strictEqual(L.readings(10)[0].verses, '42-45');
assert.strictEqual(L.readings(0)[0].page, 767);
assert.strictEqual(L.readings(11)[0].verses, '46-49');
console.log('test-lagna-rasi ok');
