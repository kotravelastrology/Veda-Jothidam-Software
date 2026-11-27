const assert = require('assert');
const { PLANETS, grahaDevataBooks, deitiesOf } = require('./src/report/grahaDevata');
const { resolveByTitle } = require('./src/sources/registry');

const books = grahaDevataBooks();
assert.deepEqual(books.map((b) => b.id), ['annamalai', 'bphs', 'hora-ratnam'], 'most explained first');
for (const b of books) assert.ok(resolveByTitle(b.source.title), `${b.id}: source in the registry`);

// Annamalai course book, §3-3-1..9, printed pp.32-40: nine planets, three deities each, one page a planet (read on the scan)
const a = books[0];
assert.deepEqual(a.rows.map((r) => r.planet), PLANETS);
assert.deepEqual(a.rows.map((r) => r.page), [32, 33, 34, 35, 36, 37, 38, 39, 40]);
for (const r of a.rows) for (const k of ['devata', 'adhi', 'pratyadhi']) assert.ok(r[k].ta && r[k].en, `${r.planet} ${k}`);
const at = (p) => a.rows.find((r) => r.planet === p);
assert.equal(at('Sun').devata.ta, 'சிவன்');
assert.equal(at('Sun').adhi.ta, 'நெருப்பு');
assert.equal(at('Mars').pratyadhi.ta, 'க்ஷேத்திராதிபதி');
assert.equal(at('Saturn').adhi.ta, 'பிரஜாபதி');
assert.equal(at('Rahu').devata.ta, 'பத்திரகாளி');
assert.equal(at('Ketu').pratyadhi.ta, 'சித்திரகுப்தன்');

// BPHS 3.18 and Hora Ratnam 1.115 (Saravali): seven planets, the same seven deities; no Rahu or Ketu
for (const b of books.slice(1)) {
  assert.deepEqual(b.rows.map((r) => r.planet), PLANETS.slice(0, 7), `${b.id}: Sun to Saturn only`);
  assert.ok(b.note);
}
assert.deepEqual(books[1].rows.map((r) => r.devata.en), books[2].rows.map((r) => r.devata.en));
assert.equal(books[1].rows[0].devata.en, 'Agni (Fire)');
assert.equal(books[1].rows[6].devata.en, 'Brahma');

// a planet's deities across the books leave out a book that names none
assert.equal(deitiesOf('Jupiter').length, 3);
assert.equal(deitiesOf('Rahu').length, 1);
assert.equal(deitiesOf('Rahu')[0].levels.length, 3);

console.log('test-graha-devata ok');
