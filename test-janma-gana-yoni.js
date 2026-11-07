const assert = require('assert');
const G = require('./src/report/janmaGanaYoni');
const T = require('./src/report/ashtakootaTables');

const B = G.BOOK;
assert.ok(B.source.title && B.source.author && B.source.pageLocus && /printed pp\.85-91/.test(B.source.pageLocus));

// the book's own lists of the stars of each gana (Table-3, p.85) agree with the software's table, star by star
const GANA_KEYS = ['deva', 'manushya', 'rakshasa'];
GANA_KEYS.forEach((key, index) => {
  assert.strictEqual(B.ganaStars[key].length, 9, key);
  for (const s of B.ganaStars[key]) assert.strictEqual(T.GANA_OF_STAR[s - 1], index, `star ${s} is ${key} in the book`);
});
assert.deepStrictEqual(GANA_KEYS.flatMap((k) => B.ganaStars[k]).sort((a, b) => a - b), Array.from({ length: 27 }, (_, i) => i + 1));

// and the book's fourteen yoni rows (Table-3A, p.87, in the book's order) agree with the software's table: Horse, Elephant, Goat-Sheep, Serpent, Dog, Rat, Cat, Cow, Buffalo, Deer, Tiger, Monkey, Lion, Mongoose
const SOFTWARE_YONI_OF_ROW = [0, 1, 2, 3, 4, 6, 5, 7, 8, 10, 9, 11, 13, 12];
assert.strictEqual(B.yoniStars.rows.length, 14);
B.yoniStars.rows.forEach((row, i) => {
  assert.ok(row.stars.length === 2 || (row.stars.length === 1 && row.alsoBook), row.bookName);
  for (const s of row.stars) assert.strictEqual(T.YONI_OF_STAR[s - 1], SOFTWARE_YONI_OF_ROW[i], `${row.bookName}: star ${s}`);
});
assert.deepStrictEqual(B.yoniStars.rows.flatMap((r) => r.stars).sort((a, b) => a - b), Array.from({ length: 27 }, (_, i) => i + 1));

// the statements: three for the ganas (verses 1-3, pp.85-86), fourteen for the yonis (verses 1-14, pp.88-91), in the software's order of gana and yoni
assert.deepStrictEqual(B.gana.map((g) => g.key), GANA_KEYS);
assert.deepStrictEqual(B.gana.map((g) => g.verses), ['1', '2', '3']);
assert.deepStrictEqual(B.gana.map((g) => g.page), [85, 86, 86]);
assert.strictEqual(B.gana[0].pageEnd, 86);
assert.strictEqual(B.yoni.length, 14);
assert.deepStrictEqual(B.yoni.map((y) => y.key), ['horse', 'elephant', 'sheep', 'serpent', 'dog', 'cat', 'rat', 'cow', 'buffalo', 'tiger', 'deer', 'monkey', 'mongoose', 'lion']);
assert.deepStrictEqual(B.yoni.map((y) => Number(y.verses)).sort((a, b) => a - b), Array.from({ length: 14 }, (_, i) => i + 1));
const byVerse = [...B.yoni].sort((a, b) => Number(a.verses) - Number(b.verses));
let last = 0;
for (const y of byVerse) {
  assert.ok(y.page >= 88 && y.page <= 91 && y.page >= last, `${y.key} page ${y.page}`);
  assert.ok(!y.pageEnd || y.pageEnd === y.page + 1);
  last = y.page;
}
for (const c of [...B.gana, ...B.yoni]) assert.ok(c.ta.length > 25 && c.bookName, c.key);

// reading a star
for (let s = 1; s <= 27; s += 1) {
  const r = G.ganaYoniOf(s);
  assert.strictEqual(r.gana.index, T.GANA_OF_STAR[s - 1]);
  assert.strictEqual(r.yoni.index, T.YONI_OF_STAR[s - 1]);
  assert.strictEqual(r.gana.nameTa, T.GANA_TA[r.gana.index]);
  assert.strictEqual(r.yoni.nameTa, T.YONI_TA[r.yoni.index]);
  assert.ok(r.gana.ta && r.yoni.ta && r.source.pageLocus);
}
// Punarvasu (the sample of the PL9 printout, 4th pada): Deva gana, Marjara (cat) yoni, verse 6 on p.89
const punarvasu = G.ganaYoniOf(7);
assert.deepStrictEqual([punarvasu.gana.key, punarvasu.gana.verses, punarvasu.gana.page], ['deva', '1', 85]);
assert.deepStrictEqual([punarvasu.yoni.key, punarvasu.yoni.verses, punarvasu.yoni.page], ['cat', '6', 89]);
assert.ok(/வீரம்/.test(punarvasu.yoni.ta) && /இனிப்பான உணவு/.test(punarvasu.yoni.ta) && /தீய இயல்பு/.test(punarvasu.yoni.ta));
// Shatabhisha: Rakshasa gana and Horse yoni (the book lists it with Ashwini); Uttara Ashada: Manushya and Mongoose (verse 14, the book pairs it with Abhijit)
assert.deepStrictEqual([G.ganaYoniOf(24).gana.key, G.ganaYoniOf(24).yoni.key], ['rakshasa', 'horse']);
assert.deepStrictEqual([G.ganaYoniOf(21).gana.key, G.ganaYoniOf(21).yoni.key, G.ganaYoniOf(21).yoni.verses], ['manushya', 'mongoose', '14']);
// the Deva gana line carries the note that the Sanskrit words differ from the English print
assert.ok(/சுந்தர/.test(G.ganaYoniOf(1).gana.note) && /பிடிவாதம்/.test(G.ganaYoniOf(1).gana.note));

console.log('test-janma-gana-yoni ok');
