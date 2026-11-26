const assert = require('assert');
const R = require('./src/report/janmaRasi');

const PAGES = { 'hora-sara-29': [98, 99], 'brihat-jataka-17': [131, 136] };
for (const book of R.BOOKS) {
  assert.ok(book.source.title && book.source.author && book.source.pageLocus && book.scope);
  assert.deepStrictEqual(Object.keys(book.cells), Array.from({ length: 12 }, (_, i) => String(i + 1)));
  const [lo, hi] = PAGES[book.id];
  let last = 0;
  for (let s = 1; s <= 12; s += 1) {
    const c = book.cells[String(s)];
    assert.ok(c.page >= lo && c.page <= hi && c.page >= last, `${book.id} sign ${s}`);
    assert.ok(c.ta.length > 40, `${book.id} sign ${s}`);
    last = c.page;
  }
}
const bj = R.BOOKS.find((b) => b.id === 'brihat-jataka-17');
assert.deepStrictEqual(Array.from({ length: 12 }, (_, i) => bj.cells[String(i + 1)].stanza), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

const signs = { Sun: 4, Moon: 7, Mars: 7, Mercury: 4, Jupiter: 4, Venus: 4, Saturn: 2, Rahu: 3, Ketu: 9 };
const r = R.janmaRasi(signs);
assert.strictEqual(r.sign, 7);
assert.deepStrictEqual(r.joined, ['Mars']);
assert.strictEqual(r.readings.length, 2);
assert.ok(/தேன்|கண்/.test(r.readings[0].ta));
assert.deepStrictEqual(R.janmaRasi({ ...signs, Mars: 0 }).joined, []);
console.log('test-janma-rasi ok');
