const assert = require('assert');
const R = require('./src/report/readerIISigns');
const { calculateKpSystem } = require('./src/report/kpSystem');

const names = (list) => list.map((i) => R.SIGNS[i]).sort();
// signs whose class `key` is truthy (flags, and the strings of equinoctial, tropical, ascension), or equals `value` when one is given
const withClass = (key, value) => R.signClassTable().filter((c) => (value === undefined ? Boolean(c[key]) : c[key] === value)).map((c) => c.sign).sort();

// every list the book prints (Reader II, printed pp.97-116)
assert.deepStrictEqual(withClass('polarity', 'positive'), names([0, 2, 4, 6, 8, 10]), 'positive: odd signs');
assert.deepStrictEqual(withClass('polarity', 'negative'), names([1, 3, 5, 7, 9, 11]), 'negative: even signs');
assert.deepStrictEqual(withClass('hemisphere', 'northern'), names([0, 1, 2, 3, 4, 5]));
assert.deepStrictEqual(withClass('equinoctial'), ['Aries', 'Libra']);
assert.deepStrictEqual(R.signClassTable().find((c) => c.sign === 'Aries').equinoctial, 'vernal');
assert.deepStrictEqual(R.signClassTable().find((c) => c.sign === 'Libra').equinoctial, 'autumnal');
assert.deepStrictEqual(withClass('tropical'), ['Cancer', 'Capricorn']);
assert.deepStrictEqual(withClass('element', 'fire'), names([0, 4, 8]));
assert.deepStrictEqual(withClass('element', 'earth'), names([1, 5, 9]));
assert.deepStrictEqual(withClass('element', 'air'), names([2, 6, 10]));
assert.deepStrictEqual(withClass('element', 'water'), names([3, 7, 11]));
assert.deepStrictEqual(withClass('quality', 'movable'), names([0, 3, 6, 9]));
assert.deepStrictEqual(withClass('quality', 'fixed'), names([1, 4, 7, 10]));
assert.deepStrictEqual(withClass('quality', 'common'), names([2, 5, 8, 11]));
assert.deepStrictEqual(withClass('fruitfulness', 'fruitful'), names([3, 7, 11]));
assert.deepStrictEqual(withClass('fruitfulness', 'semi-fruitful'), names([1, 6, 9, 8]));
assert.deepStrictEqual(withClass('fruitfulness', 'barren'), names([0, 2, 4, 5]));
assert.deepStrictEqual(withClass('mute'), names([3, 7, 11]));
assert.deepStrictEqual(withClass('violent'), names([0, 7]));
assert.deepStrictEqual(withClass('voice'), names([2, 6, 10]));
assert.deepStrictEqual(withClass('dual'), names([2, 8, 11]));
assert.deepStrictEqual(withClass('ascension', 'short'), names([9, 10, 11, 0, 1, 2]));
assert.deepStrictEqual(withClass('ascension', 'long'), names([3, 4, 5, 6, 7, 8]));
// Libra is humane to some authors only; not human in the table
assert.ok(!R.classesOf('Libra').human && R.classesOf('Libra').humaneByAuthors);
assert.deepStrictEqual(withClass('humaneByAuthors'), ['Libra']);

// human and bestial and bicorporal depend on the halves of Sagittarius (first 15 degrees human and bicorporal, last 15 bestial)
const sag1 = R.classesOf('Sagittarius', 3), sag2 = R.classesOf('Sagittarius', 20);
assert.ok(sag1.human && sag1.bicorporal && !sag1.bestial && sag1.sagittariusHalf === 1);
assert.ok(!sag2.human && !sag2.bicorporal && sag2.bestial && sag2.sagittariusHalf === 2);
// without a degree Sagittarius is in neither half, so the sign table lists only the whole signs
assert.deepStrictEqual(withClass('human'), names([2, 5, 10]));
assert.deepStrictEqual(withClass('bicorporal'), names([2, 11]));
assert.deepStrictEqual(withClass('bestial'), names([0, 1, 4, 9]));

// each sign has one ascension and one polarity
for (const c of R.signClassTable()) {
  assert.ok(['short', 'long'].includes(c.ascension) && ['positive', 'negative'].includes(c.polarity) && c.element && c.quality, c.sign);
}

// the sections: 27 pieces, printed pp.97-116, unique ids, text and Tamil present, and every id a sign's lookup uses exists
const ids = R.SECTIONS.map((s) => s.id);
assert.strictEqual(R.SECTIONS.length, 27);
assert.strictEqual(new Set(ids).size, ids.length);
for (const s of R.SECTIONS) {
  assert.ok(s.pageFrom >= 97 && s.pageTo <= 116 && s.pageFrom <= s.pageTo, `${s.id} pages ${s.pageFrom}-${s.pageTo}`);
  assert.ok(s.en.length > 50 && s.ta.length > 30 && s.titleTa.length > 3, s.id);
}
for (const c of R.signClassTable()) for (const id of R.sectionsFor(c)) assert.ok(ids.includes(id), `${c.sign} -> ${id}`);
// spot checks against the page text
assert.ok(R.SECTIONS.find((s) => s.id === 'MOVABLE').en.startsWith('Movable signs represent movement'));
assert.ok(R.SECTIONS.find((s) => s.id === 'FIXED').en.startsWith('Fixed Signs'));
assert.ok(R.SECTIONS.find((s) => s.id === 'BICORPOREAL').en.startsWith('Bicorpora'));

// a chart: the classes of the cusps and the planets
const kp = calculateKpSystem({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, ianaTimeZone: 'Asia/Kolkata' });
const c = R.classifyChart(kp);
assert.strictEqual(c.available, true);
assert.strictEqual(c.cusps.length, 12);
assert.deepStrictEqual(c.cusps.map((x) => x.house), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
assert.strictEqual(Object.values(c.counts.element).reduce((a, b) => a + b, 0), 7);
assert.strictEqual(Object.values(c.counts.quality).reduce((a, b) => a + b, 0), 7);
assert.strictEqual(Object.values(c.counts.polarity).reduce((a, b) => a + b, 0), 7);
assert.ok(c.cusps.every((x) => x.sections.length >= 3 && x.sections.every((sec) => ids.includes(sec.id) && sec.ta.length > 30)));
assert.ok(c.cusps.every((x) => x.signTa && x.labelsTa.length >= 5));
assert.strictEqual(R.classifyChart({ available: false }).available, false);
console.log('test-reader-ii-signs ok');
