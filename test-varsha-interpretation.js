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
  // every reading carries a printed page and text
  for (const r of o.readings) assert.ok(r.printedPage && r.text.length > 20 && r.verse.startsWith('v.'), r.id);
}
// the Muntha moves a sign a year: age 36 and 37 are one house apart
const a = I.interpretVarsha(V.calculateVarshaphala(birth, 36));
const b = I.interpretVarsha(V.calculateVarshaphala(birth, 37));
assert.notStrictEqual(a.facts.munthaSign, b.facts.munthaSign);
console.log('test-varsha-interpretation ok');
