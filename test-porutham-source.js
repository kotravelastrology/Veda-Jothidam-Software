/**
 * The ten poruthams against two primary texts.
 *
 * VJ-018 could only say the tables had no source. Kalaprakasika and Sudamani
 * Ullamudaiyan have since been read page by page, and this file pins what the
 * comparison found and what was done about it.
 *
 * Four kinds of assertion:
 *
 *  1. The FIXTURES are internally consistent (partitions add up), because a
 *     transcription that does not would make every comparison built on it
 *     meaningless — and the runtime tables equal the fixture, entry for entry.
 *  2. The CODE agrees with Kalaprakasika on every input, and with Sudamani
 *     exactly where the two books agree with each other.
 *  3. The HISTORICAL behaviour — a frozen copy of the port that was corrected —
 *     did have the faults the record claims. Each "fixed" statement shown to a
 *     user is checked against it, so a correction cannot be described falsely.
 *  4. The STATUSES the app shows are derived from the live comparison, so none
 *     can drift from what is true.
 */
const assert = require('node:assert/strict');

const cmp = require('./src/report/poruthamSourceComparison');
const { calcPorutham, calculateTamilPorutham } = require('./src/report/tamilPorutham');
const T = require('./src/report/poruthamTables');
const { SOURCE_COMPARISON, sourceStatusOf, KALAPRAKASIKA } = require('./src/report/poruthamFactors');
const { assertRuleEvidence } = require('./src/contracts/ruleEvidence');
const { resolveByTitle } = require('./src/sources/registry');

const S = cmp.loadSudamani();
const K = cmp.loadKalaprakasika();
const range = (n) => Array.from({ length: n }, (_, i) => i);
const sorted = (a) => [...a].sort((x, y) => x - y);
const ALL27 = range(27);
const same = (a, b) => assert.deepEqual(sorted(a), sorted(b));

// ══════════════════════════════════════════════ 1. the fixtures are sound ══

for (const [name, book] of [['Kalaprakasika', K], ['Sudamani', S]]) {
  const gana = [...book.GANA.deva, ...book.GANA.manushya, ...book.GANA.rakshasa];
  assert.deepEqual(sorted(gana), ALL27, `${name}: the three gana partition the 27 stars`);
  for (const g of ['deva', 'manushya', 'rakshasa']) {
    assert.equal(book.GANA[g].length, 9, `${name}: ${g} holds nine stars (the classical 9/9/9)`);
  }
  const bands = Object.values(book.RAJJU.bands);
  assert.deepEqual(bands.map((b) => b.stars.length), [6, 6, 6, 6, 3], `${name}: rajju band sizes`);
  assert.deepEqual(sorted(bands.flatMap((b) => b.stars)), ALL27, `${name}: rajju bands partition the stars`);

  const pairStars = book.VEDHA.pairs.flat();
  assert.equal(new Set(pairStars).size, pairStars.length, `${name}: no star in two vedha pairs`);
  assert.equal(pairStars.length + book.VEDHA.triple.length, 27, `${name}: vedha accounts for all 27 stars`);
}
// Kalaprakasika's Manushya list is genuinely truncated in print; the four
// missing stars are inferred by elimination, and that is recorded, not hidden.
assert.equal(K.GANA.manushyaPrinted.length, 5);
assert.deepEqual(sorted([...K.GANA.manushyaPrinted, ...K.GANA.manushyaByElimination]), sorted(K.GANA.manushya));

// Kalaprakasika's same-star grading: 8 excellent, 11 neutral, 8 unsuitable.
const ss = K.DINA.sameStar;
assert.deepEqual([ss.excellent.length, ss.neutral.length, ss.unsuitable.length], [8, 11, 8]);
assert.deepEqual(sorted([...ss.excellent, ...ss.neutral, ...ss.unsuitable]), ALL27);

// Yoni: thirteen kinds, every star exactly once.
assert.equal(Object.keys(K.YONI.yonis).length, 13);
assert.deepEqual(sorted(Object.values(K.YONI.yonis).flat()), ALL27);

// Every entry names its page and says how it was verified.
for (const key of ['DINA', 'GANA', 'MAHENDRA', 'STREE_DEERGHA', 'YONI', 'RASI', 'RASI_ADHIPATHI', 'VASYA', 'RAJJU', 'VEDHA']) {
  assert.equal(K[key].verified, 'VISUAL', `Kalaprakasika ${key}: nothing here is OCR-only`);
  assert.ok(K[key].printedPages, `Kalaprakasika ${key}: names its pages`);
  assert.equal(S[key].verified, 'VISUAL', `Sudamani ${key}: nothing here is OCR-only`);
}

// ── the runtime tables equal the fixture ────────────────────────────────────
// Data that decides a client's result is embedded in code, not read from the
// JSON at runtime (the Next bundler's __dirname trap). This is what stops the
// two from drifting.
same(T.GANA.deva, K.GANA.deva); same(T.GANA.manushya, K.GANA.manushya); same(T.GANA.rakshasa, K.GANA.rakshasa);
same(T.MAHENDRA_COUNTS, K.MAHENDRA.acceptedCounts);
assert.equal(T.STREE_DEERGHA_MINIMUM, K.STREE_DEERGHA.minimumCount);
for (const [kind, stars] of Object.entries(K.YONI.yonis)) same(T.YONIS[kind], stars);
assert.deepEqual(T.YONI_HOSTILE.map((p) => [...p]), K.YONI.hostilePairsAsPrinted);
same(T.RASI_GOOD_COUNTS, K.RASI.goodCounts); same(T.RASI_BAD_COUNTS, K.RASI.badCounts);
for (const [r, list] of Object.entries(K.VASYA.concordantTo)) same(T.VASYA[r], list);
for (const [name, band] of Object.entries(K.RAJJU.bands)) same(T.RAJJU_BANDS[name], band.stars);
assert.deepEqual(T.VEDHA_PAIRS.map((p) => [...p]), K.VEDHA.pairs);
same(T.VEDHA_TRIPLE, K.VEDHA.triple);
same(T.DINA.cycleGoodPositions, K.DINA.cycleGoodPositions); same(T.DINA.cycleBadPositions, K.DINA.cycleBadPositions);
same(T.DINA.avoidCounts, K.DINA.avoidCounts);
same(T.DINA.sameStar.excellent, ss.excellent); same(T.DINA.sameStar.neutral, ss.neutral);
same(T.DINA.sameStar.unsuitable, ss.unsuitable);

// ══════════════════════════════════════ 2. the code against both books ══

const vsK = cmp.compareToKalaprakasika(K);
const vsS = cmp.compareToSudamani(S);
const books = cmp.compareBooks(S, K);

// Kalaprakasika is the authority: identical on every input, for every factor
// the book gives a rule for.
for (const id of [...cmp.STAR_FACTORS, ...cmp.RASI_FACTORS]) {
  if (id === 'RASI_ADHIPATHI') continue;
  assert.equal(vsK[id].comparable, true, id);
  assert.equal(vsK[id].disagreements.length, 0,
    `${id}: the code differs from Kalaprakasika on ${vsK[id].disagreements.length} inputs, e.g. ${JSON.stringify(vsK[id].disagreements[0])}`);
}
// Rasi Adhipathi: the book lists each planet's friends but states no rule, so
// there is nothing to compare — and the app must say so rather than imply a match.
assert.equal(vsK.RASI_ADHIPATHI.comparable, false);
assert.match(K.RASI_ADHIPATHI.rule, /^NOT STATED/);

// Sudamani agrees with the code exactly where it agrees with Kalaprakasika.
const agreedByBoth = ['GANA', 'STREE_DEERGHA', 'RASI', 'RAJJU'];
for (const id of agreedByBoth) {
  assert.equal(vsS[id].disagreements.length, 0, `${id}: both books agree, so the code agrees with Sudamani too`);
  assert.equal(books[id].agree, books[id].total, `${id}: the two books agree with each other`);
}
for (const id of ['DINA', 'MAHENDRA', 'VEDHA', 'VASYA', 'RASI_ADHIPATHI']) {
  assert.ok(vsS[id].disagreements.length > 0, `${id}: Sudamani differs`);
}
assert.equal(vsS.YONI.comparable, false, 'Sudamani\'s yoni is a different model (animals with sex)');

// Where the books differ, the differences are the ones on the record.
// Mahendra: only counts 1 and 20.
const mahendraDiffCounts = [...new Set(vsS.MAHENDRA.disagreements.map(({ input: [g, b] }) => cmp.starCount(g, b)))].sort((a, b) => a - b);
assert.deepEqual(mahendraDiffCounts, [1, 20]);
// Vasya: the books differ on specific entries.
const vasyaDiffRasis = [...new Set(vsS.VASYA.disagreements.map(({ input }) => `${input[2]}-${input[3]}`))];
assert.ok(vasyaDiffRasis.length > 0);
// Vedha: the rate looks fine and is a trap, because most pairs pass under both.
// The pair sets are what matter, and they share nothing.
assert.ok(books.VEDHA.rate > 0.9, 'the vedha agreement rate looks fine — which is the trap');
const kPairs = cmp.vedhaPairs(cmp.kalaprakasikaVerdicts(K)._vedha);
const sPairs = cmp.vedhaPairs(cmp.sudamaniVerdicts(S)._vedha);
assert.deepEqual(kPairs.filter((p) => sPairs.includes(p)), [], 'the two books share no vedha pair');
assert.deepEqual(cmp.codeVedhaPairs(), kPairs, 'the code holds exactly Kalaprakasika\'s pairs');

// Dina: the books agree from 2 to 9 and differ beyond; the code follows
// Kalaprakasika. Pinned so the disagreement is visible, not glossed.
for (let count = 2; count <= 9; count += 1) {
  const k = calcPorutham(0, count - 1, 0, 1).find((r) => r.id === 'DINA').result;
  assert.equal(k, S.DINA.acceptedCounts.includes(count), `count ${count}: both books and the code agree`);
}
assert.equal(calcPorutham(0, 21, 0, 1).find((r) => r.id === 'DINA').result, false, 'count 22: Kalaprakasika avoids it');
assert.ok(S.DINA.acceptedCounts.includes(22), 'count 22: Sudamani accepts it — the two books disagree');

// ── the specific rules that were the bug, with concrete cases ───────────────
const dinaAt = (g, b, gr = 0, br = 1) => calcPorutham(g, b, gr, br).find((r) => r.id === 'DINA');
// Count 4 was rejected before (the old test asserted it FAILS). Both books say good.
assert.equal(dinaAt(0, 3).measure.count, 4);
assert.equal(dinaAt(0, 3).result, true, 'count 4 is good in both books');
assert.equal(dinaAt(0, 2).result, false, 'count 3 is bad in both books');
// Same star is graded by the star: Rohini excellent, Ashwini neutral, Bharani unsuitable.
assert.equal(dinaAt(3, 3).result, true);   assert.equal(dinaAt(3, 3).measure.grade, 'excellent');
assert.equal(dinaAt(0, 0).result, true);   assert.equal(dinaAt(0, 0).measure.grade, 'neutral');
assert.equal(dinaAt(1, 1).result, false);  assert.equal(dinaAt(1, 1).measure.grade, 'unsuitable');
// The 27th is avoided unless the two stars share a rasi.
assert.equal(dinaAt(5, 4, 0, 0).measure.count, 27);
assert.equal(dinaAt(5, 4, 0, 0).result, true,  '27th, same rasi: the harm is diminished');
assert.equal(dinaAt(5, 4, 0, 1).result, false, '27th, different rasi: bad');

// ═══════════════════════ 3. the historical behaviour really was faulty ═══

// A frozen copy of the port that was corrected. NOT used by the app; kept here
// as evidence, so that what the record says was wrong can be checked.
const LEGACY = (() => {
  const GANA = [0, 1, 2, 0, 0, 2, 0, 0, 2, 2, 1, 0, 0, 2, 0, 1, 2, 0, 2, 1, 0, 0, 2, 2, 1, 2, 0]; // 0 D, 1 M, 2 R
  const YONI = [0, 7, 0, 5, 5, 4, 3, 1, 2, 8, 6, 6, 5, 0, 8, 8, 4, 4, 7, 7, 6, 8, 3, 3, 1, 2, 7];
  const VEDHA = [[0, 17], [1, 23], [2, 11], [3, 10], [4, 9], [5, 24], [6, 25], [7, 26], [8, 14], [12, 13], [15, 20], [16, 19]];
  const VASYA = { 0: [3, 8], 1: [6, 11], 2: [5, 10], 3: [0, 7], 4: [9], 5: [2, 7], 6: [1, 8], 7: [3, 10], 8: [0, 5], 9: [4, 11], 10: [5], 11: [6, 9] };
  return {
    GANA, YONI, VEDHA, VASYA,
    dina: (g, b) => ![2, 4, 6, 8, 9].includes((((b - g + 27) % 27) + 1) % 9 || 9),
    stree: (g, b) => ((b - g + 27) % 27) + 1 >= 7,
    rasi: (g, b) => [1, 2, 5, 6, 7, 11].includes(((b - g + 12) % 12) + 1),
    yoni: (g, b) => YONI[g] === YONI[b] || Math.abs(YONI[g] - YONI[b]) <= 1,
  };
})();

// GANA — 12/5/10, and eight stars in the wrong class against BOTH books.
const legacyGana = { D: 0, M: 0, R: 0 };
for (const g of LEGACY.GANA) legacyGana[['D', 'M', 'R'][g]] += 1;
assert.deepEqual([legacyGana.D, legacyGana.M, legacyGana.R], [12, 5, 10]);
const bookGanaOf = cmp.kalaprakasikaVerdicts(K)._ganaOf;
const legacyWrong = ALL27.filter((s) => ['D', 'M', 'R'][LEGACY.GANA[s]] !== bookGanaOf.get(s));
assert.deepEqual(legacyWrong, [3, 5, 11, 15, 16, 17, 20, 25]);
const sudGanaOf = cmp.sudamaniVerdicts(S)._ganaOf;
assert.deepEqual(ALL27.filter((s) => ['D', 'M', 'R'][LEGACY.GANA[s]] !== sudGanaOf.get(s)), legacyWrong,
  'Sudamani finds the same eight, so this is an error and not a variant');
// ...and the corrected code splits 9/9/9.
const nowGana = cmp.codeGanaByStar().reduce((a, x) => ({ ...a, [x]: (a[x] ?? 0) + 1 }), {});
assert.deepEqual(Object.values(nowGana).sort(), [9, 9, 9]);

// DINA — an exact inversion for counts 2 to 9, against both books.
for (let count = 2; count <= 9; count += 1) {
  const book = K.DINA.cycleGoodPositions.includes(count);
  assert.equal(LEGACY.dina(0, count - 1), !book, `count ${count}: the old code did the opposite of both books`);
}

// RASI — one in three agreements with Sudamani, and it rejected what both accept.
const rasiPairs = range(12).flatMap((g) => range(12).map((b) => [g, b]));
const legacyRasiAgree = rasiPairs.filter(([g, b]) => LEGACY.rasi(g, b) === (cmp.rasiCount(g, b) >= 7)).length;
assert.equal(legacyRasiAgree, 48, 'the old rasi rule agreed with the 7th-to-12th rule on 48 of 144 pairs');
assert.equal(LEGACY.rasi(0, 8 - 1 + 0), LEGACY.rasi(0, 7), 'sanity');
for (const count of [8, 9, 10, 12]) assert.equal(LEGACY.rasi(0, count - 1), false, `the old rule rejected count ${count}, which both books accept`);
for (const count of [2, 5, 6]) assert.equal(LEGACY.rasi(0, count - 1), true, `the old rule accepted count ${count}, which both books reject`);

// STREE DEERGHA — the old threshold is the book's minority view.
const legacyStreeMin = range(27).map((i) => i + 1).find((c) => LEGACY.stree(0, c - 1));
assert.equal(legacyStreeMin, 7);
assert.equal(legacyStreeMin, K.STREE_DEERGHA.minorityMinimumCount);

// YONI — nine numeric groups: a construction found in neither book.
assert.equal(new Set(LEGACY.YONI).size, 9);
assert.equal(Object.keys(K.YONI.yonis).length, 13);

// VASYA — a table matching neither book.
assert.deepEqual(LEGACY.VASYA[0], [3, 8]);
assert.deepEqual(K.VASYA.concordantTo['0'], [4, 7]);
assert.deepEqual(S.VASYA.vasya['0'], [4, 7]);

// VEDHA — of twelve old pairs, only Ashwini-Jyeshtha appears in either book,
// and only in Kalaprakasika.
const legacyPairs = LEGACY.VEDHA.map(([a, b]) => `${a}-${b}`);
assert.deepEqual(legacyPairs.filter((p) => kPairs.includes(p)), ['0-17']);
assert.deepEqual(legacyPairs.filter((p) => sPairs.includes(p)), []);

// ═══════════════════════════════ 4. what the app shows is what is true ══

// Each status is derived from the live comparison, not restated.
for (const [id, c] of Object.entries(SOURCE_COMPARISON)) {
  const k = vsK[id];
  const expectK = !k.comparable ? 'RULE_NOT_STATED' : k.disagreements.length === 0 ? 'MATCHES' : 'DIVERGES';
  assert.equal(c.kalaprakasika.status, expectK, `${id}: Kalaprakasika status`);

  const s = vsS[id];
  const expectS = !s.comparable ? 'DIFFERENT_MODEL' : s.disagreements.length === 0 ? 'MATCHES' : 'DIVERGES';
  assert.equal(c.sudamani.status, expectS, `${id}: Sudamani status`);
}

const expectedRow = {
  DINA: 'FOLLOWS_KALAPRAKASIKA', GANA: 'AGREED_BY_BOTH', MAHENDRA: 'FOLLOWS_KALAPRAKASIKA',
  STREE_DEERGHA: 'AGREED_BY_BOTH', YONI: 'FOLLOWS_KALAPRAKASIKA', RASI: 'AGREED_BY_BOTH',
  RASI_ADHIPATHI: 'NOT_SOURCED', VASYA: 'FOLLOWS_KALAPRAKASIKA', RAJJU: 'AGREED_BY_BOTH',
  VEDHA: 'FOLLOWS_KALAPRAKASIKA',
};
for (const [id, status] of Object.entries(expectedRow)) assert.equal(sourceStatusOf(SOURCE_COMPARISON[id]), status, id);

// The corrections a user is told about are the corrections that happened.
assert.ok(SOURCE_COMPARISON.GANA.fixed && SOURCE_COMPARISON.DINA.fixed);
for (const id of ['MAHENDRA', 'RAJJU', 'RASI_ADHIPATHI']) {
  assert.equal(SOURCE_COMPARISON[id].fixed, null, `${id} was not changed, so it claims no correction`);
}

const match = calculateTamilPorutham({ nakshatraIndex: 3, rasiIndex: 1 }, { nakshatraIndex: 16, rasiIndex: 7 });
assert.deepEqual(match.sourceSummary, { agreedByBoth: 4, followsKalaprakasika: 5, notSourced: 1, total: 10 });
assert.equal(match.sourceStatus, 'PARTIALLY_SOURCED');
for (const row of match.rows) {
  assert.equal(row.sourceStatus, expectedRow[row.id]);
  assert.ok(row.sourceComparison.sudamani.summary.length > 15, `${row.id}: says what the second book prints`);
}

// Nine factors carry evidence that is actually applied, with a real locator;
// Rasi Adhipathi stays withheld and claims no source.
const byRule = Object.fromEntries(match.evidence.map((e) => [e.ruleId, e]));
for (const [id, status] of Object.entries(expectedRow)) {
  const e = byRule[`PORUTHAM_${id}`];
  assertRuleEvidence(e, id);
  if (status === 'NOT_SOURCED') {
    assert.equal(e.status, 'SOURCE_REQUIRED', id);
    assert.equal(e.source, null, `${id}: must not claim a source it lacks`);
    assert.match(e.reason, /ஆதாரம் இல்லை/);
  } else {
    assert.equal(e.status, 'APPLIED', id);
    assert.equal(e.source.title, KALAPRAKASIKA.title);
    assert.match(e.source.pageLocus, /அச்சுப் பக்கம்/);
    assert.match(e.source.pageLocus, /\+ 30/, `${id}: the page offset is stated so the page can be found`);
    assert.ok(e.notes && /சூடாமணி/.test(e.notes), `${id}: the cross-check with the second book is recorded`);
  }
}
// The cited source is registered, with its rights.
const registered = resolveByTitle(KALAPRAKASIKA.title);
assert.ok(registered, 'Kalaprakasika is in the source registry');
assert.equal(registered.rights.mayShip, false);

console.log(JSON.stringify({
  pass: true,
  codeVsKalaprakasika: Object.fromEntries(Object.entries(vsK).map(([k, v]) => [k, v.comparable ? `${v.agree}/${v.total}` : 'no rule stated'])),
  codeVsSudamani: Object.fromEntries(Object.entries(vsS).map(([k, v]) => [k, v.comparable ? `${v.agree}/${v.total}` : 'different model'])),
  booksAgreeOn: agreedByBoth,
  legacyGanaSplit: [legacyGana.D, legacyGana.M, legacyGana.R],
  legacyRasiAgreement: `${legacyRasiAgree}/144`,
  summary: match.sourceSummary,
}, null, 2));
