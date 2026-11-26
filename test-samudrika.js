/**
 * The signs of the body of BPHS ch.81-82 (src/report/samudrika.js, fixture bphs-81-82.json): the fixture's shape and the lookup.
 */
const assert = require('node:assert/strict');
const S = require('./src/report/samudrika');

assert.ok(S.DATA.source.title && S.DATA.source.pageLocus && S.DATA.scope.length > 400 && S.DATA.scopeTa.length > 300);
assert.equal(S.BOOKS.women.chapter, 81);
assert.equal(S.BOOKS.marks.chapter, 82);
assert.ok(S.BOOKS.women.applies.ta.length > 40 && S.BOOKS.marks.applies.ta.length > 40);

const KINDS = ['good', 'bad', 'neutral'];
const verseStart = (v) => Number(v.split('-')[0]);
for (const [which, chapter, lo, hi, firstVerse, lastVerse] of [['women', 81, 966, 981, 3, 85], ['marks', 82, 982, 984, 2, 15]]) {
  const sections = S.sections(which);
  assert.ok(sections.length > 10, which);
  assert.ok(sections.every((s) => s.chapter === chapter));
  // the sections follow the book's order of verses and pages
  let lastV = 0;
  let lastP = 0;
  for (const s of sections) {
    assert.ok(s.id && s.part && s.verses && s.page && s.items.length > 0, `${which} ${s.id}`);
    const [a, b] = s.page.split('-').map(Number);
    assert.ok(a >= lo && (b ?? a) <= hi && a >= lastP, `${which} ${s.id} page ${s.page}`);
    assert.ok(verseStart(s.verses) >= lastV, `${which} ${s.id} verse ${s.verses}`);
    lastV = verseStart(s.verses);
    lastP = a;
    for (const it of s.items) assert.ok(KINDS.includes(it.kind) && it.feature.length > 6 && it.effect.length > 3, `${which} ${s.id}`);
  }
  assert.equal(verseStart(sections[0].verses), firstVerse);
  assert.equal(Number(sections.at(-1).verses.split('-').pop()), lastVerse);
  const ids = sections.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, `${which}: section ids are unique`);
}
assert.equal(S.sections('women').length, 48);
assert.equal(S.sections('marks').length, 11);
assert.equal(S.sections('women').reduce((n, s) => n + s.items.length, 0) + S.sections('marks').reduce((n, s) => n + s.items.length, 0), 174);
assert.throws(() => S.sections('men'), RangeError);

// the lookup: no query gives everything; a word narrows by part, feature or effect; every word must match; a kind filters
const all = S.search('women');
assert.equal(all.length, S.sections('women').reduce((n, s) => n + s.items.length, 0));
assert.ok(all.every((h) => h.chapter === 81 && h.part && h.verses && h.page && h.kind && h.feature && h.effect));
const eyes = S.search('women', 'கண்கள்');
assert.ok(eyes.length >= 8 && eyes.some((h) => h.sectionId === 'eyes' && /குறுகிய ஆயுள்/.test(h.effect)));
assert.deepEqual(S.search('women', 'மலடு கழுத்து').map((h) => h.sectionId), ['neck']);
assert.deepEqual(S.search('women', 'மலடு').map((h) => h.sectionId), ['genital', 'neck', 'palate', 'eyes'], 'barrenness is named for four features');
assert.equal(S.search('women', 'ஸ்வஸ்திக').filter((h) => h.kind === 'good').length, 3, 'on the soles, the palm lines and the forehead');
assert.ok(S.search('women', '', 'bad').every((h) => h.kind === 'bad'));
assert.ok(S.search('women', '', 'neutral').length >= 5);
assert.equal(S.search('women', 'முற்றிலும் இல்லாத சொல்').length, 0);
assert.equal(S.search('women', 'KANNAM').length, 0, 'the lookup is for Tamil text');
const marks = S.search('marks', 'திரிசூல');
assert.deepEqual(marks.map((h) => h.kind), ['good', 'good']);
assert.ok(S.search('marks', 'ஆயுள்').some((h) => h.sectionId === 'marriage'));
// the hair verse follows the Sanskrit
const hair = S.sections('women').find((s) => s.id === 'hair');
assert.ok(hair.items[0].kind === 'good' && /சமஸ்கிருதம்/.test(hair.items[0].effect) && hair.items[1].kind === 'bad');
console.log('test-samudrika: all assertions passed');
