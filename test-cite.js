/**
 * The citation line every page shows: book, author, section and the page in that book.
 * The owner's rule (2026-10-20): no PDF number is ever shown; where a book's scan has no
 * printed page numbers the scan's page is shown and marked as such.
 */
const assert = require('node:assert/strict');
const { citeTa, bookTa, citeWith } = require('./src/sources/citeTa');
const E = require('./src/report/eventMuhurtaTables');

(() => {

  // A printed page, with the section kept and the PDF number dropped.
  assert.equal(
    citeTa({
      title: 'Hindu Electional Astrology', author: 'V.K. Shridhar',
      pageLocus: '§25.13 "Leather works", printed p.687 (PDF 722): "Leather work is prescribed in …"',
    }),
    'Hindu Electional Astrology, V.K. Shridhar — §25.13 "Leather works", ப.687',
  );
  // A page range.
  assert.equal(
    citeTa({
      title: 'Classical Muhurta', author: 'Ernst Wilhelm',
      pageLocus: '"Livestock / Animals - Cows, buying, selling & milking", printed pp.250-251 (PDF 258-259): "Nakshatra: …"',
    }),
    'Classical Muhurta, Ernst Wilhelm — "Livestock / Animals - Cows, buying, selling & milking", ப.250-251',
  );
  // A translator's name in the title and a second name in the author are both trimmed.
  assert.equal(
    bookTa({
      title: 'Muhurta Chintamani (Girish Chand Sharma)',
      author: 'Daivagya Acharya Shriram; Girish Chand Sharma (translation and notes)',
    }),
    'Muhurta Chintamani, Daivagya Acharya Shriram',
  );
  // Raman's scan carries no printed numbers, so its own page is shown and marked.
  assert.equal(
    citeTa({ title: 'Muhurtha (Electional Astrology)', author: 'B.V. Raman', pageLocus: 'Chapter XIII, PDF p.49: "Buying or Selling Cows. - …"' }),
    'Muhurtha, B.V. Raman — Chapter XIII, ப.49 (ஸ்கேன்)',
  );
  // A page may keep its own Tamil name for a book.
  assert.equal(
    citeWith({ title: 'Practical Ashtakavarga', author: 'Vinay Aditya', pageLocus: 'Ch.5, printed p.88: "…"' }, 'வினய் ஆதித்யா, Practical Ashtakavarga'),
    'வினய் ஆதித்யா, Practical Ashtakavarga — Ch.5, ப.88',
  );
  // Nothing is shown when there is nothing to show.
  assert.equal(citeTa(null), '');
  assert.equal(citeTa({ title: 'Some Book' }), 'Some Book');

  // No reading in the muhurta tables may show a PDF number, and every one must name a page.
  let checked = 0;
  const noPage = [];
  for (const ev of Object.keys(E.SOURCES)) {
    const per = E.SOURCES[ev];
    if (!per || typeof per !== 'object' || typeof per.pageLocus === 'string') continue;  // VISHTI is a single source
    for (const [b, s] of Object.entries(per)) {
      if (!s || typeof s.pageLocus !== 'string') continue;
      const line = citeTa(s);
      assert.ok(!/PDF/i.test(line), `${ev}/${b}: a PDF number reached the citation — ${line}`);
      assert.ok(line.startsWith(bookTa(s)), `${ev}/${b}: the book and author open the line`);
      if (!/ப\./.test(line)) noPage.push(`${ev}/${b}`);
      checked++;
    }
  }
  assert.ok(checked > 300, `expected the whole table, checked ${checked}`);
  assert.deepEqual(noPage, [], `every reading names a page; these do not: ${noPage.join(', ')}`);

  console.log(`test-cite: all checks passed (${checked} readings)`);
})();
