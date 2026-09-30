/**
 * The ten poruthams against the Sudamani Ullamudaiyan edition.
 *
 * VJ-018 could only say the tables had no source. There is now a primary text,
 * and this file pins what comparing against it found.
 *
 * Two kinds of assertion:
 *
 *  - The FIXTURE is checked for internal consistency, because a transcription
 *    that does not add up (a star in two gana, a rajju band of the wrong size)
 *    would make every comparison built on it meaningless.
 *  - The FINDINGS are asserted as exact facts about this code. They are meant
 *    to fail when someone corrects a table: the failure is the prompt to update
 *    `SOURCE_COMPARISON`, so the app's claim about each factor cannot drift
 *    from what is true of it.
 *
 * A finding that our code differs from this book is not proof the code is
 * wrong — it is one Tamil text. The one exception is asserted separately: the
 * Gana table, which contradicts the 9/9/9 split as well.
 */
const assert = require('node:assert/strict');

const { compareAll, tableDifferences, vedhaPairDifferences, loadBook, starCount } = require('./src/report/poruthamSourceComparison');
const { calcPorutham, calculateTamilPorutham } = require('./src/report/tamilPorutham');
const { SOURCE_COMPARISON } = require('./src/report/poruthamFactors');
const { assertRuleEvidence } = require('./src/contracts/ruleEvidence');

const book = loadBook();
const range = (n) => Array.from({ length: n }, (_, i) => i);
const sorted = (a) => [...a].sort((x, y) => x - y);

// -------------------------------------------- the transcription is sound ---

const ALL27 = range(27);

// Gana: nine stars each, together all twenty-seven, no star twice.
for (const g of ['manushya', 'deva', 'rakshasa']) {
  assert.equal(book.GANA[g].length, 9, `${g} must hold nine stars`);
}
assert.deepEqual(sorted([...book.GANA.manushya, ...book.GANA.deva, ...book.GANA.rakshasa]), ALL27,
  'the three gana partition the 27 stars exactly');

// Rajju: five bands of 6, 6, 6, 6 and 3 stars, partitioning the 27.
const bands = Object.values(book.RAJJU.bands);
assert.deepEqual(bands.map((b) => b.stars.length), [6, 6, 6, 6, 3]);
assert.deepEqual(sorted(bands.flatMap((b) => b.stars)), ALL27, 'the rajju bands partition the 27 stars');

// Dina same-star groups: 9 + 8 + 10, partitioning the 27.
const d = book.DINA.sameStar;
assert.deepEqual([d.madhyama.length, d.uttama.length, d.notAccepted.length], [9, 8, 10]);
assert.deepEqual(sorted([...d.madhyama, ...d.uttama, ...d.notAccepted]), ALL27);

// Vedha: twelve pairs plus a triple; no star appears in two pairs; the triple
// stars are in no pair. A vedha "pair" reused would mean a transcription slip.
const pairStars = book.VEDHA.pairs.flat();
assert.equal(new Set(pairStars).size, pairStars.length, 'no star is in two vedha pairs');
assert.ok(book.VEDHA.triple.every((s) => !pairStars.includes(s)), 'the triple is separate from the pairs');
assert.equal(pairStars.length + book.VEDHA.triple.length, 27, 'pairs and triple account for all 27 stars');

// Vasya and adhipathi are keyed on all twelve rasis.
assert.equal(Object.keys(book.VASYA.vasya).length, 12);
assert.equal(Object.keys(book.RASI_ADHIPATHI.friendsOfWomansRasi).length, 12);

// Every entry says where in the book it came from, and how it was verified.
for (const key of ['DINA', 'GANA', 'MAHENDRA', 'STREE_DEERGHA', 'YONI', 'RASI', 'RASI_ADHIPATHI', 'VASYA', 'RAJJU', 'VEDHA']) {
  assert.ok(book[key].verses, `${key}: verse numbers`);
  assert.equal(book[key].scanPage, book[key].printedPage + 25, `${key}: scan page = printed + 25`);
  assert.equal(book[key].verified, 'VISUAL', `${key}: nothing here is OCR-only`);
}

// ------------------------------------------------------------ findings -----

const cmp = compareAll(book);

// RAJJU — the one that matches, on every input, not on average.
assert.equal(cmp.RAJJU.agree, 729);
assert.equal(cmp.RAJJU.total, 729);
assert.equal(cmp.RAJJU.disagreements.length, 0);
assert.deepEqual(tableDifferences(book).rajjuDiffs, [], 'the grouping of all 27 stars is identical');

// GANA — the rule is the same as the book's, so every disagreement is a
// table entry. Eight stars, five of them Manushya in the book.
const gana = tableDifferences(book).ganaDiffs;
assert.equal(gana.length, 8);
assert.deepEqual(gana.map((g) => g.star), [3, 5, 11, 15, 16, 17, 20, 25]);
assert.equal(gana.filter((g) => g.book === 'மனிதர்').length, 5);
assert.equal(cmp.GANA.agree, 509);

// ...and this one is an error rather than a variant, because it does not
// depend on trusting the book: the classical split of 27 stars is 9/9/9, and
// this code produces 12/5/10.
const sizes = { 'தேவர்': 0, 'மனிதர்': 0, 'இராட்சதர்': 0 };
for (const s of ALL27) {
  const note = calcPorutham(s, s, 0, 0).find((r) => r.id === 'GANA').note;
  sizes[note.replace(/^பெண்: /, '').split(',')[0]] += 1;
}
assert.deepEqual([sizes['தேவர்'], sizes['மனிதர்'], sizes['இராட்சதர்']], [12, 5, 10]);
assert.notDeepEqual(Object.values(sizes), [9, 9, 9]);

// DINA — for counts 2 to 9 the two are an exact inversion: what the book
// accepts this code rejects, and the reverse.
const ourDinaAccepts = (count) => {
  // girl = 0, so the boy's index is count-1
  return calcPorutham(0, count - 1, 0, 0).find((r) => r.id === 'DINA').result;
};
for (let count = 2; count <= 9; count += 1) {
  const bookAccepts = book.DINA.acceptedCounts.includes(count);
  assert.equal(ourDinaAccepts(count), !bookAccepts,
    `count ${count}: the book ${bookAccepts ? 'accepts' : 'rejects'} it and this code does the opposite`);
}
assert.equal(cmp.DINA.agree, 422);

// MAHENDRA — differs only on counts 1 and 20.
const mahendraCounts = range(27).map((i) => i + 1).filter((c) => {
  const ours = calcPorutham(0, c - 1, 0, 0).find((r) => r.id === 'MAHENDRA').result;
  return ours !== book.MAHENDRA.acceptedCounts.includes(c);
});
assert.deepEqual(mahendraCounts, [1, 20]);

// STREE DEERGHA — thresholds 7 (ours) against 13 (book).
const ourStreeMin = range(27).map((i) => i + 1)
  .find((c) => calcPorutham(0, c - 1, 0, 0).find((r) => r.id === 'STREE_DEERGHA').result);
assert.equal(ourStreeMin, 7);
assert.equal(book.STREE_DEERGHA.minimumCount, 13);

// RASI — one in three, worse than chance.
assert.equal(cmp.RASI.agree, 48);
assert.equal(cmp.RASI.total, 144);
assert.ok(cmp.RASI.rate < 0.5, 'this code agrees with the book on fewer than half of the rasi pairs');

// VASYA and ADHIPATHI.
assert.equal(cmp.VASYA.agree, 106);
assert.equal(cmp.RASI_ADHIPATHI.agree, 94);

// VEDHA — the agreement RATE is 92.6% and completely misleading: nearly every
// pair passes under both, so agreeing on "compatible" inflates it. The pair
// sets are what matter, and they have nothing in common.
assert.ok(cmp.VEDHA.rate > 0.9, 'the rate looks fine — which is the trap');
const vedha = vedhaPairDifferences(book);
assert.equal(vedha.bookPairs.length, 15);
assert.equal(vedha.ourPairs.length, 12);
assert.deepEqual(vedha.shared, [], 'no vedha pair is common to both');
assert.equal(vedha.onlyInBook.length, 15);
assert.equal(vedha.onlyInOurs.length, 12);

// ------------------------- the app's claims match what was just measured ---

const expected = {
  DINA: 'DIVERGES_FROM_SOURCE', GANA: 'DIVERGES_FROM_SOURCE', MAHENDRA: 'DIVERGES_FROM_SOURCE',
  STREE_DEERGHA: 'DIVERGES_FROM_SOURCE', YONI: 'DIFFERENT_MODEL', RASI: 'DIVERGES_FROM_SOURCE',
  RASI_ADHIPATHI: 'DIVERGES_FROM_SOURCE', VASYA: 'DIVERGES_FROM_SOURCE', RAJJU: 'MATCHES_SOURCE',
  VEDHA: 'DIVERGES_FROM_SOURCE',
};
for (const [id, status] of Object.entries(expected)) {
  assert.equal(SOURCE_COMPARISON[id].status, status, `${id}: what the app tells a client`);
}
// A factor may only claim MATCHES if it truly agrees on every input, and only
// claim DIVERGES if it truly disagrees somewhere. Derived, not restated.
for (const [id, c] of Object.entries(SOURCE_COMPARISON)) {
  if (id === 'YONI') continue; // structurally incomparable, no rate to derive
  const measured = cmp[id];
  const identical = measured.disagreements.length === 0;
  assert.equal(c.status === 'MATCHES_SOURCE', identical,
    `${id}: claims ${c.status} but the comparison found ${measured.disagreements.length} disagreements`);
}
// Gana is the only one marked as an outright error.
assert.deepEqual(Object.entries(SOURCE_COMPARISON).filter(([, c]) => c.isError).map(([id]) => id), ['GANA']);

// ------------------------------------------------------- what a client sees --

const match = calculateTamilPorutham(
  { nakshatraIndex: 3, rasiIndex: 1 }, { nakshatraIndex: 16, rasiIndex: 7 },
);
assert.deepEqual(match.sourceSummary, { matches: 1, diverges: 8, differentModel: 1, total: 10 });
assert.equal(match.sourceStatus, 'PARTIALLY_SOURCED');

for (const row of match.rows) {
  assert.ok(row.sourceComparison.summary.length > 30, `${row.id}: says what the book prints`);
  assert.ok(row.sourceComparison.verses, `${row.id}: names the verses`);
  assert.equal(row.sourceStatus, expected[row.id]);
}

// Rajju is the first porutham with evidence that is APPLIED, and it must carry
// a real locator; the other nine remain withheld and say why.
const evidenceById = Object.fromEntries(match.evidence.map((e) => [e.ruleId, e]));
const rajju = evidenceById.PORUTHAM_RAJJU;
assert.equal(rajju.status, 'APPLIED');
assertRuleEvidence(rajju, 'rajju');
assert.match(rajju.source.title, /சூடாமணி/);
assert.match(rajju.source.pageLocus, /82–83/);
assert.match(rajju.source.pageLocus, /\+ 25/, 'the page offset is stated so the page can be found');
assert.equal(typeof rajju.outcome.passed, 'boolean');

for (const [ruleId, e] of Object.entries(evidenceById)) {
  if (ruleId === 'PORUTHAM_RAJJU') continue;
  assert.equal(e.status, 'SOURCE_REQUIRED', ruleId);
  assert.equal(e.source, null, `${ruleId} must not claim a source it does not have`);
  assertRuleEvidence(e, ruleId);
}
// The withheld reasons now say what the book prints, not just "unsourced".
assert.match(evidenceById.PORUTHAM_STREE_DEERGHA.reason, /13/);
assert.match(evidenceById.PORUTHAM_YONI.reason, /ஒப்பிட முடியாது/);
assert.match(evidenceById.PORUTHAM_VEDHA.reason, /சூடாமணி/);

console.log(JSON.stringify({
  pass: true,
  agreement: Object.fromEntries(Object.entries(cmp).map(([k, v]) => [k, `${v.agree}/${v.total}`])),
  ganaErrors: gana.length,
  ganaSplit: [sizes['தேவர்'], sizes['மனிதர்'], sizes['இராட்சதர்']],
  dinaInvertedCounts: '2-9',
  vedhaSharedPairs: vedha.shared.length,
  summary: match.sourceSummary,
}, null, 2));
