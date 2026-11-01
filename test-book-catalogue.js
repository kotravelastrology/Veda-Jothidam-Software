/**
 * The book catalogue (src/report/horoscopeBook/bookCatalogue.js) lists every page of PL9's 88-page sample once, in order, and marks as
 * built exactly the pages the registry (bookSections.js) can build.
 */
const assert = require('node:assert/strict');
const { bookCatalogue } = require('./src/report/horoscopeBook/bookCatalogue');
const { BOOK_SECTIONS } = require('./src/report/horoscopeBook/bookSections');

const families = bookCatalogue();
const items = families.flatMap((f) => f.items);

// every page of the sample, 1 to 88, once and in order
let next = 1;
for (const i of items) {
  assert.equal(i.from, next, `${i.ta}: starts at page ${i.from}, expected ${next}`);
  assert.ok(i.to >= i.from);
  assert.equal(i.pages, i.to - i.from + 1);
  next = i.to + 1;
}
assert.equal(next, 89, 'the catalogue ends at page 88');
assert.equal(items.reduce((n, i) => n + i.pages, 0), 88);

// ids are unique, every item has a Tamil and an English title, and the built ones are exactly the registry's
assert.equal(new Set(items.map((i) => i.id)).size, items.length);
for (const i of items) { assert.ok(/[஀-௿]/.test(i.ta), `${i.id}: a Tamil title`); assert.ok(i.en); }
const built = items.filter((i) => i.built).map((i) => i.id);
assert.deepEqual(built, BOOK_SECTIONS.map((s) => s.id), 'built = the registry, in the book order');
for (const i of items.filter((x) => !x.built)) assert.ok(i.id.startsWith('pages-'), `${i.id}: a page not built has a placeholder id`);
for (const f of families) assert.ok(['saffron', 'indigo', 'teal', 'rose'].includes(f.tone));

console.log(`test-book-catalogue: ${built.length} of ${items.length} items built; all assertions passed`);
