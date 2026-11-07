const assert = require('assert');
const J = require('./src/report/janmaNakshatra');

const PAGES = { 'hora-sara-28': [95, 97], 'brihat-jataka-16': [396, 399] };

for (const book of J.BOOKS) {
  assert.ok(book.source.title && book.source.author && book.source.pageLocus);
  assert.deepStrictEqual(Object.keys(book.cells), Array.from({ length: 27 }, (_, i) => String(i + 1)));
  const [lo, hi] = PAGES[book.id];
  let last = 0;
  for (let s = 1; s <= 27; s += 1) {
    const c = book.cells[String(s)];
    assert.ok(c.page >= lo && c.page <= hi && c.page >= last, `${book.id} star ${s} page ${c.page}`);
    assert.ok(c.ta.length > 15, `${book.id} star ${s}`);
    last = c.page;
  }
}

// Brihat Jataka: fourteen stanzas, two stars each except stanza 4 (Punarvasu alone), in order.
const bj = J.BOOKS.find((b) => b.id === 'brihat-jataka-16');
const st = Array.from({ length: 27 }, (_, i) => bj.cells[String(i + 1)].stanza);
assert.deepStrictEqual([...new Set(st)], Array.from({ length: 14 }, (_, i) => i + 1));
assert.deepStrictEqual(st.slice(0, 8), [1, 1, 2, 2, 3, 3, 4, 5]);

// Star from longitude: Ashwini 0-13d20m, Bharani next, Revati the last.
assert.strictEqual(J.starOf(0), 1);
assert.strictEqual(J.starOf(13.34), 2);
assert.strictEqual(J.starOf(359.9), 27);
assert.strictEqual(J.starOf(-0.1), 27);
const r = J.janmaNakshatra(80.5); // 80 degrees is the start of Punarvasu (7th star)
assert.strictEqual(r.star, 7);
assert.strictEqual(r.pada, 1);
assert.strictEqual(r.readings.length, 2);
assert.strictEqual(J.janmaNakshatra(92.9).pada, 4);

console.log('test-janma-nakshatra ok');
