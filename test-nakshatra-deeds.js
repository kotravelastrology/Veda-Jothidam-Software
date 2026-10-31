const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/nakshatraDeedsTables');
const { deedsTable, searchDeeds, wordPattern } = require('./src/report/nakshatraDeeds');
const { citeTa } = require('./src/sources/citeTa');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/nakshatra-deeds/books.json'), 'utf8'));
const byName = (n) => T.STARS.find((s) => s.nameEn === n);
const plain = (o) => JSON.parse(JSON.stringify(o));

// ----------------------------------------------------------------------- the 28 entries ---
assert.equal(T.STARS.length, 28);
assert.deepEqual(T.STARS.map((s) => s.index), Array.from({ length: 28 }, (_, i) => i));
assert.equal(T.STARS[27].nameEn, 'Abhijit');
assert.equal(T.NAMES_TA.length, 28);
T.STARS.forEach((s) => assert.ok(s.nameTa && /[஀-௿]/.test(s.nameTa), s.nameEn));
assert.equal(T.STARS[0].nameTa, 'அசுவினி');
assert.equal(T.STARS[22].nameTa, 'அவிட்டம்');

// ------------------------------------------------------------ the seven kinds, as the book prints them ---
for (const [k, names] of Object.entries(FIX.classes)) {
  const have = T.STARS.filter((s) => s.classKey === k).map((s) => s.nameEn).sort();
  assert.deepEqual(have, [...names].sort(), `kind ${k}`);
  assert.equal(T.CLASSES[k].vara, FIX.weekdays[k], `weekday of ${k}`);
}
assert.deepEqual(Object.keys(T.CLASSES), ['STHIRA', 'CHARA', 'MISRA', 'UGRA', 'KSHIPRA', 'MRIDU', 'TEEKSHNA']);
assert.equal(Object.values(T.CLASSES).reduce((n, c) => n + c.stars.length, 0), 27);
// Each star's introduction names the kind whose deeds it may also take; Teekshna names none.
for (const s of T.STARS) {
  const want = FIX.borrows[s.classKey];
  if (want) assert.equal(s.borrows, want, `${s.nameEn} borrows from`);
  else assert.equal(s.borrows, null, `${s.nameEn} borrows from nothing`);
}

// ---------------------------------------------------------------------- mukha and kula ---
for (const [k, names] of Object.entries(FIX.mukha)) {
  assert.equal(names.length, 9, k);
  assert.deepEqual(T.STARS.filter((s) => s.mukhaKey === k).map((s) => s.nameEn).sort(), [...names].sort(), `mukha ${k}`);
}
assert.equal(byName('Abhijit').mukhaKey, null);
for (const [k, names] of Object.entries(FIX.kula)) assert.deepEqual(T.STARS.filter((s) => s.kula === k).map((s) => s.nameEn).sort(), [...names].sort(), `kula ${k}`);
assert.equal(T.STARS.filter((s) => s.kula === 'AKULA').length, 12);
assert.equal(byName('Abhijit').kula, null);

// ------------------------------------------------------------------------ the deeds ---
const LONG_OK = ['Dharmashastras', 'Kumbhabhishekam', 'Navagrahapooja', 'Navagrahasaanthi', 'Shudramanatras', 'correspondence', 'correspondences', 'establishments'];
for (const s of T.STARS) {
  const abhijit = s.nameEn === 'Abhijit';
  assert.ok(s.good.length >= (abhijit ? 2 : 20) && s.also.length >= (abhijit ? 3 : 20), `${s.nameEn}: ${s.good.length} / ${s.also.length}`);
  for (const d of [...s.good, ...s.also]) {
    assert.ok(d.length >= 3 && d === d.trim() && !/\s{2,}/.test(d), `${s.nameEn}: "${d}"`);
    assert.ok(!/Sangraha|Muhoortha|Suitable deeds|undefined|[~|{}^_]/.test(d), `${s.nameEn}: header or noise in "${d}"`);
    assert.ok(!/[,;.\-]$/.test(d), `${s.nameEn}: "${d}" ends in punctuation`);
    assert.ok(!/[^\x20-\x7e]/.test(d), `${s.nameEn}: non-ASCII in "${d}"`);
    for (const w of d.match(/[A-Za-z]{14,}/g) ?? []) assert.ok(LONG_OK.includes(w), `${s.nameEn}: run-together word ${w}`);
  }
  assert.ok(s.introEn.length > 80, s.nameEn);
}
// The also-lists are alphabetical (the book prints them that way): the first letters hardly ever go backwards.
for (const s of T.STARS.filter((x) => x.index < 27)) {
  let prev = '';
  let backs = 0;
  for (const d of s.also) { const c = d[0].toLowerCase(); if (c < prev) backs += 1; prev = c; }
  assert.ok(backs <= 3, `${s.nameEn}: also-list not alphabetical (${backs})`);
}

// Anchors: the first and last deed of each list, the counts and the pages, from the extraction proofread against the pages.
for (const [n, a] of Object.entries(FIX.anchors)) {
  const s = byName(n);
  assert.equal(s.good[0], a.good[0], `${n}: first good`);
  assert.equal(s.good[s.good.length - 1], a.good[1], `${n}: last good`);
  assert.equal(s.also[0], a.also[0], `${n}: first also`);
  assert.equal(s.also[s.also.length - 1], a.also[1], `${n}: last also`);
  assert.deepEqual([s.pageFrom, s.pageTo], a.pages, `${n}: pages`);
  assert.deepEqual([s.good.length, s.also.length], a.counts, `${n}: counts`);
}
// The start page of nine entries, read from the page images.
for (const [n, p] of Object.entries(FIX.startPages)) assert.equal(byName(n).pageFrom, p, `${n} starts on printed p.${p}`);
assert.equal(T.STARS[0].pageFrom, 144);
assert.equal(T.STARS[26].pageTo, 215);
for (let i = 1; i < 27; i += 1) assert.ok(T.STARS[i].pageFrom >= T.STARS[i - 1].pageFrom, `page order at ${T.STARS[i].nameEn}`);

// Facts seen on the pages.
assert.ok(byName('Bharani').good.includes('Causing deceit'), 'the scan prints it run together; the page reads "Causing deceit"');
assert.equal(byName('Chitra').good[0], 'Doing spinning', 'the scan prints "Moingspinning"; read as the other lists read it');
assert.ok(byName('Abhijit').also.includes('indulging in sex'));
assert.ok(byName('Ashwini').good.some((d) => /mangalya/.test(d)));
assert.match(byName('Rohini').introEn, /married woman/);
assert.match(byName('Revati').introEn, /Panch\s*aka/i);

// ------------------------------------------------------------------------ citations ---
for (const s of T.STARS) {
  const line = citeTa(s.source);
  assert.ok(!/PDF/.test(line), line);
  assert.match(line, /Muhoortha Sangraha, Vol\. 1, V\.S\. Kalyanraman/);
  assert.ok(line.includes(`ப.${s.pageFrom}-${s.pageTo}`), line);
}
assert.match(citeTa(T.SOURCE), /ப\.140-215/);

// ------------------------------------------------------------------------------ search ---
const names = (q) => searchDeeds(q).stars.map((s) => s.nameEn);
const mar = searchDeeds('marriage');
assert.ok(mar.stars.length >= 15, 'marriage is listed under most stars');
assert.ok(mar.stars.every((s) => [...s.good, ...s.also].every((d) => /marriage/i.test(d))));
// Tamil: the stem, the case ending, and "marriage hall" is a building, not a marriage.
assert.deepEqual(names('திருமணம்'), names('திருமணத்துக்கு'));
const total = (r) => r.stars.reduce((n, s) => n + s.count, 0);
assert.ok(total(searchDeeds('திருமணம்')) < total(mar), 'halls dropped');
assert.ok(!searchDeeds('திருமணம்').stars.some((s) => [...s.good, ...s.also].some((d) => /marriage[- ]?halls?/i.test(d) && !/marriage(?![- ]?halls?)/i.test(d))));
// Several words: every word must be in the one deed.
const both = searchDeeds('வாகனம் purchasing');
assert.ok(both.stars.length > 0 && both.stars.every((s) => [...s.good, ...s.also].every((d) => /vehicle|conveyance/i.test(d) && /purchasing/i.test(d))));
assert.deepEqual(searchDeeds('வாகனம் வாங்குதல்').unknown, ['வாங்குதல்'], 'an unknown Tamil word is named, not guessed');
assert.deepEqual(searchDeeds('').stars, []);
assert.deepEqual(searchDeeds('   ').stars, []);
assert.deepEqual(searchDeeds('zzzzqq').stars, []);
for (let i = 1; i < mar.stars.length; i += 1) assert.ok(mar.stars[i - 1].count >= mar.stars[i].count, 'most places first');
// Plain text is not read as a pattern.
assert.deepEqual(searchDeeds('a(b').stars, []);
for (const [k, v] of Object.entries(T.SYNONYMS)) assert.doesNotThrow(() => new RegExp(v, 'i'), k);
assert.ok(wordPattern('கடன்') instanceof RegExp);

// ------------------------------------------------------------------------------ table ---
const table = deedsTable();
assert.equal(table.stars.length, 28);
assert.deepEqual(plain(table.counts), { stars: 28, good: T.STARS.reduce((n, s) => n + s.good.length, 0), also: T.STARS.reduce((n, s) => n + s.also.length, 0) });
assert.ok(table.counts.good + table.counts.also > 2500);
assert.ok(table.differences.length >= 2 && table.ourReadingsTa.length >= 4);
for (const t of [...table.ourReadingsTa, ...table.differences.map((d) => d.textTa), ...Object.values(T.CLASSES).map((c) => c.suitsTa), ...Object.values(T.MUKHA).map((m) => m.suitsTa)]) assert.ok(/[஀-௿]/.test(t));
assert.ok(!/\bundefined\b/.test(JSON.stringify(table)));

console.log('nakshatra-deeds: ok');
