const assert = require('assert');
const { BOOK_SECTIONS, bookSectionList, buildBookSections } = require('./src/report/horoscopeBook/bookSections');

// Sample birth, PL9 aniruddha_HC4: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

async function main() {
  // The registry: unique ids, in the book's order, and the list the print centre shows.
  const ids = BOOK_SECTIONS.map((s) => s.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'section ids are unique');
  // the pages built, in the sample's page order (the catalogue, bookCatalogue.js, lists all 88)
  const numbers = ids.map((id) => Number(id.slice(1)));
  assert.deepStrictEqual(numbers, [...numbers].sort((a, b) => a - b), 'in the order of the book');
  for (const n of [1, 2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) assert.ok(numbers.includes(n), `page ${n}`);
  assert.deepStrictEqual(bookSectionList().map((s) => s.id), ids);
  assert.ok(bookSectionList().every((s) => typeof s.title === 'string' && s.title.length > 0 && !('build' in s)));

  // Selected sections come back in the book's order, whatever order they are asked for.
  const built = await buildBookSections({ name: 'aniruddha', birth, ids: ['p12', 'p2'] });
  assert.deepStrictEqual(built.map((s) => s.id), ['p2', 'p12'], 'book order, not request order');
  for (const section of built) {
    assert.ok(section.doc.blocks.length > 0, `${section.id} has blocks`);
    assert.ok(!/undefined|NaN|null/.test(JSON.stringify(section.doc)), `${section.id} has no undefined, NaN or null`);
  }

  // Unknown ids are ignored, and an empty selection builds nothing.
  assert.deepStrictEqual((await buildBookSections({ name: '', birth, ids: ['nope'] })), []);

  console.log('test-horoscope-book-print: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
