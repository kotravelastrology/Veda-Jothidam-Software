/**
 * BPHS ch.64 and ch.65 on the Kalachakra dasha's results (src/report/kalachakraEffects.js, fixtures bphs-64.json and bphs-65.json): the shape of the two tables,
 * that ch.65's nine signs of each Amsa are the Savya sequence the engine runs, and that a mahadasha's Amsa is the Navamsha sign of the Moon's pada.
 */
const assert = require('node:assert/strict');
const K = require('./src/dasha/kalachakraBphs');
const E = require('./src/report/kalachakraEffects');
const { navamshaSign } = require('./src/report/specialPoints');

const LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const AMSAS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const range = (s) => { const [a, b] = String(s).replace(/½/g, '').split('-').map(Number); return [a, b ?? a]; };
const pageRange = (s) => { const [a, b] = String(s).split('-').map(Number); return [a, b ?? a]; };

for (const fx of [E.ANTARDASHA, E.DASHA]) {
  assert.ok(fx.source.title && fx.source.pageLocus && fx.scope);
  assert.deepEqual(Object.keys(fx.amsas), AMSAS);
}

// ch.65: the nine signs of each Amsa, in the book's order, are the Savya pada sequence of that Amsa; verses 1-31 follow on, pages 835-841
let nextVerse = 1;
let lastPage = 835;
AMSAS.forEach((name, amsa) => {
  const a = E.DASHA.amsas[name];
  assert.equal(a.entries.length, 9, name);
  const pads = [];
  for (let nak = 0; nak < 27; nak += 1) for (let pada = 1; pada <= 4; pada += 1) {
    if (K.GROUP_OF[nak].chakra === 'savya' && (nak * 4 + pada - 1) % 12 === amsa) pads.push(K.sequenceOf(nak, pada));
  }
  assert.ok(pads.length > 0, `${name}: some Savya pada has this Amsa`);
  for (const seq of pads) assert.deepEqual(a.entries.map((e) => e.sign), seq, `${name}: ch.65's signs are the engine's Savya sequence`);
  const [v1, v2] = range(a.verses);
  assert.equal(v1, nextVerse, `${name}: verses run on`);
  nextVerse = v2 + 1;
  const [p1, p2] = pageRange(a.page);
  assert.ok(p1 >= lastPage - 1 && p2 <= 841 && p1 <= p2, `${name}: pages`);
  lastPage = p1;
  assert.ok(a.entries.every((e) => e.ta.length > 5));
});
assert.equal(E.DASHA.general.remedy.verse, 32);

// ch.64: verses 2-55 in the Sanskrit numbering, the lords named are the seven, none twice in an Amsa but Saturn in the Capricorn one
let verse = 2;
for (const name of AMSAS) {
  const a = E.ANTARDASHA.amsas[name];
  const [v1, v2] = range(a.verses);
  assert.equal(v1, verse, `${name}: verses run on`);
  verse = v2 + 1;
  const named = a.entries.flatMap((e) => e.lords);
  assert.ok(named.every((l) => LORDS.includes(l)) && a.entries.every((e) => e.ta.length > 5), name);
  const twice = named.filter((l, i) => named.indexOf(l) !== i);
  assert.deepEqual(twice, name === 'Capricorn' ? ['Saturn'] : [], `${name}: lords named twice`);
  const [p1, p2] = pageRange(a.page);
  assert.ok(p1 >= 825 && p2 <= 833 && p1 <= p2, `${name}: pages`);
}
assert.equal(verse, 56, 'the effects end at verse 55');
assert.equal(E.ANTARDASHA.general.apsavya.verse, '56-58');
// the lords the book leaves out are left out: Saturn in the Aries Amsa, Saturn in the Sagittarius one, Moon and Sun in the Gemini one
const none = (amsa, lord) => E.antardashaEffect({ chakra: 'savya', amsa }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].find((s) => E.SIGN_LORD[s] === lord));
assert.deepEqual(none(0, 'Saturn').ta, []);
assert.deepEqual(none(8, 'Saturn').ta, []);
assert.deepEqual(none(2, 'Moon').ta, []);
assert.equal(none(9, 'Saturn').ta.length, 2, 'Saturn has two entries in the Capricorn Amsa');
assert.equal(E.antardashaEffect({ chakra: 'savya', amsa: 0 }, 0).lord, 'Mars');
assert.equal(E.antardashaEffect({ chakra: 'savya', amsa: 0 }, 7).ta[0], E.antardashaEffect({ chakra: 'savya', amsa: 0 }, 0).ta[0], 'Aries and Scorpio are both Mars');

// a mahadasha's Amsa is the Navamsha sign of the Moon, and the first Savya sign sits in its sequence at the stated place
for (const lon of [3.5, 41.2, 77.7, 101.1, 131.3, 166.6, 201.9, 252.4, 291.8, 332.2, 357.9, 52.5, 64.4, 93.3, 121.7]) {
  const k = K.kalachakraMahadashas(lon, 12);
  const m = k.mahas[0];
  assert.equal(m.amsa, navamshaSign(lon), `Moon at ${lon}: the Amsa is its Navamsha sign`);
  assert.equal(m.chakra, k.chakra);
  assert.ok(k.mahas.every((x) => x.position >= 1 && x.position <= 9 && x.amsa >= 0 && x.amsa < 12));
  if (m.chakra === 'savya') {
    const e = E.dashaEffect(m);
    assert.equal(e.sign, m.sign, `Moon at ${lon}: ch.65's sign for the place is the dasha's sign`);
    assert.ok(k.mahas.filter((x) => x.chakra === 'savya').every((x) => E.dashaEffect(x).sign === x.sign), `Moon at ${lon}: every Savya dasha reads its own sign`);
  } else {
    assert.equal(E.dashaEffect(m), null);
    assert.equal(E.antardashaEffect(m, 0), null);
  }
}
console.log('test-kalachakra-effects: all assertions passed');
