/**
 * The book catalogue (src/report/horoscopeBook/bookCatalogue.js) lists every page of PL9's 88-page sample once, in order, and marks as
 * built exactly the pages the registry (bookSections.js) can build.
 */
const assert = require('node:assert/strict');
const { bookCatalogue } = require('./src/report/horoscopeBook/bookCatalogue');
const { BOOK_SECTIONS } = require('./src/report/horoscopeBook/bookSections');

const families = bookCatalogue();
const items = families.flatMap((f) => f.items);

// every page of the sample, 1 to 88, once and in order, then the extra pages (89 on) that follow it
let next = 1;
for (const i of items) {
  assert.equal(i.from, next, `${i.ta}: starts at page ${i.from}, expected ${next}`);
  assert.ok(i.to >= i.from);
  assert.equal(i.pages, i.to - i.from + 1);
  next = i.to + 1;
}
const EXTRA = 4; // pages 89-92: the Mangala dosha, the Sadhesati with remedies, the gemstones, the dasha results
assert.equal(next, 89 + EXTRA, 'the catalogue ends after the extra pages');
assert.equal(items.reduce((n, i) => n + i.pages, 0), 88 + EXTRA);

// ids are unique, every item has a Tamil and an English title, and the pages built are exactly the registry's
assert.equal(new Set(items.map((i) => i.id)).size, items.length);
for (const i of items) { assert.ok(/[஀-௿]/.test(i.ta), `${i.id}: a Tamil title`); assert.ok(i.en); }
const builtPages = items.flatMap((i) => i.sections);
assert.deepEqual(builtPages, BOOK_SECTIONS.map((s) => s.id), 'the pages built are the registry, in the book order');
for (const i of items) {
  assert.equal(i.built, i.sections.length > 0);
  assert.equal(i.complete, i.sections.length === i.pages);
  for (const sec of i.sections) { const n = Number(sec.slice(1)); assert.ok(n >= i.from && n <= i.to, `${sec} inside ${i.id}`); }
}
for (const f of families) assert.ok(['saffron', 'indigo', 'teal', 'rose'].includes(f.tone));

console.log(`test-book-catalogue: ${builtPages.length} of ${88 + EXTRA} pages built; all assertions passed`);
