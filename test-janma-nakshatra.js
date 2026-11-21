const assert = require('assert');
const J = require('./src/report/janmaNakshatra');

const PAGES = { 'hora-sara-28': [95, 97], 'brihat-jataka-16': [396, 399], 'mansagari-1': [62, 73], 'jatakabharanam-8': [64, 107] };

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

// Maansagari ch.1: one verse each; Abhijit is the book's 22nd verse (pp.70-71), left out, so the stars after Uttara Ashada are one verse higher (Shravana 23 ... Revati 28);
// the books in order of the words of their summaries (most explained first): Jatakabharanam, Hora Sara, Maansagari, Brihat Jataka
assert.deepStrictEqual(J.BOOKS.map((b) => b.id), ['jatakabharanam-8', 'hora-sara-28', 'mansagari-1', 'brihat-jataka-16']);
const words = (b) => Object.values(b.cells).reduce((n, c) => n + c.ta.split(/\s+/).filter(Boolean).length, 0);
for (let i = 1; i < J.BOOKS.length; i += 1) assert.ok(words(J.BOOKS[i - 1]) > words(J.BOOKS[i]), `${J.BOOKS[i - 1].id} is explained more than ${J.BOOKS[i].id}`);
const ms = J.BOOKS.find((b) => b.id === 'mansagari-1');
assert.deepStrictEqual(Array.from({ length: 27 }, (_, i) => ms.cells[String(i + 1)].verses), [...Array.from({ length: 21 }, (_, i) => String(i + 1)), ...Array.from({ length: 6 }, (_, i) => String(i + 23))]);
assert.ok(/Chapter 1/.test(ms.source.pageLocus) && /printed pp\.62-73/.test(ms.source.pageLocus));
assert.deepStrictEqual([ms.cells['2'].page, ms.cells['2'].pageEnd], [63, 64]); // Bharani: the verse ends p.63, its English is at the top of p.64
// Punarvasu, verse 7 on p.65: the verse PL9's printout of this software's sample quotes from Maansagari
assert.deepStrictEqual([ms.cells['7'].verses, ms.cells['7'].page], ['7', 65]);
assert.ok(/அமைதி/.test(ms.cells['7'].ta) && /பிள்ளைகளும் நண்பர்களும்/.test(ms.cells['7'].ta));

// Jatakabharanam ch.8 (Girish Chand Sharma): the verse of each star at the page its heading is on; Ashwini's is on the chapter's unnumbered opening page, a statement that runs over to
// the next page has `pageEnd`; the scan lacks printed p.65 (Bharani is on p.64, Krittika on p.67)
const jb = J.BOOKS.find((b) => b.id === 'jatakabharanam-8');
assert.deepStrictEqual(Array.from({ length: 27 }, (_, i) => jb.cells[String(i + 1)].page), [64, 64, 67, 68, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 80, 82, 82, 98, 98, 99, 101, 102, 103, 104, 106, 107]);
assert.deepStrictEqual(Object.entries(jb.cells).filter(([, c]) => c.pageEnd).map(([s, c]) => [Number(s), c.page, c.pageEnd]), [[4, 68, 69], [16, 80, 81], [18, 82, 83], [22, 101, 102], [24, 103, 104], [25, 104, 105]]);
assert.ok(/அத்தியாயத்தின் முதற் பக்கம்/.test(jb.cells['1'].pageNote) && Object.keys(jb.cells).filter((s) => jb.cells[s].pageNote).length === 1);
assert.ok(/Chapter 8/.test(jb.source.pageLocus) && /printed pp\.64-107/.test(jb.source.pageLocus) && /Dhundiraja/.test(jb.source.author));
// Punarvasu, p.72: friends, the shastras, gems and gold jewels, bountiful, lands and wealth (the verse PL9 quotes from Jatakabharana)
assert.ok(/பல நண்பர்கள்/.test(jb.cells['7'].ta) && /சாஸ்திரங்களைக் கற்பவன்/.test(jb.cells['7'].ta) && /நிலமும் செல்வமும்/.test(jb.cells['7'].ta));

// Star from longitude: Ashwini 0-13d20m, Bharani next, Revati the last.
assert.strictEqual(J.starOf(0), 1);
assert.strictEqual(J.starOf(13.34), 2);
assert.strictEqual(J.starOf(359.9), 27);
assert.strictEqual(J.starOf(-0.1), 27);
const r = J.janmaNakshatra(80.5); // 80 degrees is the start of Punarvasu (7th star)
assert.strictEqual(r.star, 7);
assert.strictEqual(r.pada, 1);
assert.strictEqual(r.readings.length, 4);
assert.strictEqual(J.janmaNakshatra(92.9).pada, 4);

console.log('test-janma-nakshatra ok');
