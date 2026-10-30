const assert = require('assert');
const fs = require('fs');
const T = require('./src/report/varshaInterpretationTables');
const I = require('./src/report/varshaInterpretation');
const V = require('./src/report/varshaphala');

// the embedded table is the fixture
assert.deepStrictEqual(T, JSON.parse(fs.readFileSync('./fixtures/varshaphala/tajika-bhushana.json', 'utf8')));
// verse numbers: Muntha in the bhavas are v.11-22 in order; the planets with the Muntha v.5-9; the year lords v.4-24 in threes
for (let h = 1; h <= 12; h += 1) assert.strictEqual(T.munthaHouse[String(h)].verse, `v.${10 + h}`);
assert.deepStrictEqual(Object.values(T.munthaWithPlanet).map((x) => x.verse), ['v.5', 'v.6', 'v.7', 'v.8', 'v.9']);
const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
order.forEach((p, i) => assert.deepStrictEqual(T.yearLord[p].map((x) => x.verse), [0, 1, 2].map((k) => `v.${4 + i * 3 + k}`), p));
for (const p of order) assert.deepStrictEqual(T.yearLord[p].map((x) => x.tier), ['STRONG', 'MIDDLE', 'WEAK']);
// chapter 5: eight planets, twelve bhavas each, verses numbered in order from v.2 (Sun) to v.98 (Rahu); the Sun's first verse is v.2, the Moon's v.15
const base = { Sun: 2, Moon: 15, Mars: 27, Mercury: 39, Jupiter: 51, Venus: 63, Saturn: 75, Rahu: 87 };
for (const [p, b] of Object.entries(base)) {
  assert.strictEqual(Object.keys(T.bhavaPhala[p]).length, 12, p);
  for (let h = 1; h <= 12; h += 1) assert.strictEqual(T.bhavaPhala[p][String(h)].verse, `v.${b + h - 1}`, `${p} ${h}`);
}
assert.strictEqual(T.moonGeneral.verse, 'v.14');
// printed pages in chapter 5 never run backwards through the verses of a planet or from planet to planet
let last = 0;
for (const p of Object.keys(base)) for (let h = 1; h <= 12; h += 1) { const n = Number(String(T.bhavaPhala[p][String(h)].printedPage).split('-')[0]); assert.ok(n >= last, `${p} ${h} page ${n} < ${last}`); last = n; }
assert.strictEqual(last, 63);
// Mudda dasha (chapters 8-9): seven planets x four grades, verses in order; 42 antardasha verses v.2-43 in the book's own order of the six other planets
const grades = ['STRONG', 'MIDDLE', 'WEAK', 'DESTROYED'];
const firstVerse = { Sun: 1, Moon: 6, Mars: 11, Mercury: 16, Jupiter: 21, Venus: 26, Saturn: 31 };
for (const [p, b] of Object.entries(firstVerse)) {
  assert.deepStrictEqual(T.muddaDasha.dasaPhala[p].map((e) => e.tier), grades, p);
  assert.deepStrictEqual(T.muddaDasha.dasaPhala[p].map((e) => e.verse), [0, 1, 2, 3].map((k) => `v.${b + k}`), p);
  assert.strictEqual(T.muddaDasha.dasaRule[p].verse, `v.${b + 4}`, `${p} rule`);
}
const antar = Object.entries(T.muddaDasha.antarDasha);
assert.strictEqual(antar.length, 42);
assert.deepStrictEqual(antar.map(([, e]) => e.verse), Array.from({ length: 42 }, (_, i) => `v.${i + 2}`));
for (const p of Object.keys(firstVerse)) assert.strictEqual(antar.filter(([k]) => k.startsWith(`${p}|`)).length, 6, p);
for (const [k] of antar) { const [a, b] = k.split('|'); assert.notStrictEqual(a, b); assert.ok(a in firstVerse && b in firstVerse); }
// printed pages never run backwards through the verses
const pages = [];
for (let h = 1; h <= 12; h += 1) pages.push(Number(T.munthaHouse[String(h)].printedPage));
assert.deepStrictEqual([...pages].sort((a, b) => a - b), pages);

const birth = { name: 'A', year: 1990, month: 10, day: 5, hour: 4, minute: 30, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, ianaTimeZone: 'Asia/Kolkata', placeName: 'Chennai', calendarMode: 'tirukanita' };
for (const age of [20, 30, 36, 41]) {
  const v = V.calculateVarshaphala(birth, age);
  const o = I.interpretVarsha(v);
  // the Muntha bhava reading is the verse of that bhava
  const mh = o.readings.find((r) => r.id === 'MUNTHA_HOUSE');
  assert.strictEqual(mh.verse, `v.${10 + v.muntha.house}`, `age ${age}`);
  assert.strictEqual(o.facts.munthaHouse, v.muntha.house);
  // the year lord has its three readings and its engine strength figure
  assert.strictEqual(o.yearLord.readings.length, 3);
  assert.strictEqual(o.yearLord.planet, v.varshesha);
  // a Munthesha reading is given only for the places the book names
  const mg = o.readings.find((r) => r.id === 'MUNTHESHA_GOOD');
  const mb = o.readings.find((r) => r.id === 'MUNTHESHA_BAD');
  assert.strictEqual(Boolean(mg), I.GOOD_MUNTHESHA.includes(o.facts.munthesheaHouse));
  assert.strictEqual(Boolean(mb), I.BAD_MUNTHESHA.includes(o.facts.munthesheaHouse));
  // planets in the Muntha's sign get their verse; Rahu and Ketu and Saturn have none
  for (const p of o.facts.planetsWithMuntha) assert.ok(o.readings.some((r) => r.id === `MUNTHA_WITH_${p.toUpperCase()}`));
  // chapter 5: one verse for each of the eight planets, the verse of the bhava it holds from the varsha lagna
  assert.strictEqual(o.bhavaPhala.length, 8);
  for (const b of o.bhavaPhala) {
    const house = ((v.varshaChart.grahas[b.planet].rasiIndex - v.varshaChart.lagna.rasiIndex + 12) % 12) + 1;
    assert.strictEqual(b.house, house, `${b.planet} age ${age}`);
    assert.strictEqual(b.verse, `v.${base[b.planet] + house - 1}`, b.planet);
    assert.strictEqual(Boolean(b.note), b.planet === 'Moon');
  }
  // every reading carries a printed page and text
  for (const r of o.readings) assert.ok(r.printedPage && r.text.length > 20 && r.verse.startsWith('v.'), r.id);
}
// Mudda dasha on the chart: one entry per dasha of the year, each lord's four grades and six antardasha results; the lagna dasha is graded by the drekkana
for (const age of [20, 36]) {
  const v = V.calculateVarshaphala(birth, age);
  const o = I.interpretVarsha(v);
  assert.strictEqual(o.mudda.length, v.patyayiniDasha.length);
  for (const d of o.mudda) {
    if (d.lord === 'Lagna') {
      assert.ok(['BEST', 'MIDDLE', 'HARD', 'INAUSPICIOUS', 'AUSPICIOUS'].includes(d.lagna.grade));
      const sign = v.varshaChart.lagna.rasiIndex % 3;
      const dr = Math.floor(v.varshaChart.lagna.degreeInSign / 10);
      const expect = [['BEST', 'MIDDLE', 'HARD'], ['INAUSPICIOUS', 'AUSPICIOUS', 'MIDDLE'], ['MIDDLE', 'INAUSPICIOUS', 'AUSPICIOUS']][sign][dr];
      assert.strictEqual(d.lagna.grade, expect);
    } else {
      assert.strictEqual(d.tiers.length, 4);
      assert.strictEqual(d.antar.length, 6);
      assert.ok(d.antar.every((a) => a.lord !== d.lord));
    }
  }
}
// the Muntha moves a sign a year: age 36 and 37 are one house apart
const a = I.interpretVarsha(V.calculateVarshaphala(birth, 36));
const b = I.interpretVarsha(V.calculateVarshaphala(birth, 37));
assert.notStrictEqual(a.facts.munthaSign, b.facts.munthaSign);
console.log('test-varsha-interpretation ok');
