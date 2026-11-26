const assert = require('assert');
const fs = require('fs');
const T = require('./src/report/varshaInterpretationTables');
const M = require('./src/report/masaPravesha');
const V = require('./src/report/varshaphala');
const { calculateParashariChart } = require('./src/chart/parashariChart');

// the embedded table is the fixture
assert.deepStrictEqual(T, JSON.parse(fs.readFileSync('./fixtures/varshaphala/tajika-bhushana.json', 'utf8')));
// the month lords' verses: Sun v.6, Moon v.7, Mars v.8, Mercury v.9, Jupiter v.10, Venus v.11, Saturn v.12
const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
order.forEach((p, i) => assert.strictEqual(T.masaPravesha.masaLordPhala[p].verse, `v.${6 + i}`, p));
assert.strictEqual(T.masaPravesha.strength.verse, 'v.13');
assert.strictEqual(T.masaPravesha.method.verse, 'v.1-2');

const birth = { name: 'A', year: 1990, month: 10, day: 5, hour: 4, minute: 30, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, ianaTimeZone: 'Asia/Kolkata', placeName: 'Chennai', calendarMode: 'tirukanita' };
const natalSun = calculateParashariChart({ input: birth, ayanamsha: 'Lahiri', houseSystem: 'Placidus' }).grahas.Sun.longitude;
for (const age of [20, 36]) {
  const v = V.calculateVarshaphala(birth, age);
  const o = M.masaPravesha(birth, v);
  assert.strictEqual(o.months.length, 12);
  o.months.forEach((m, k) => {
    // v.2: the Sun at the birth Sun plus k signs
    const want = (natalSun + 30 * k) % 360;
    assert.ok(Math.abs(((m.sunLongitude - want + 540) % 360) - 180) < 0.001, `month ${k} Sun ${m.sunLongitude} vs ${want}`);
    assert.strictEqual(m.sunSign, Math.floor(want / 30));
    if (k > 0) {
      const gap = (m.utcMs - o.months[k - 1].utcMs) / 86400000;
      assert.ok(gap > 29 && gap < 32, `month ${k} gap ${gap}`);
    }
    // v.5: two candidates; the leading one has the larger Pancha-Vargeeya figure, or none when equal
    assert.strictEqual(m.candidates.length, 2);
    const [a, b] = m.candidates;
    if (m.sameCandidate) assert.strictEqual(m.leading, a.planet);
    else if (a.pvb === b.pvb) assert.strictEqual(m.leading, null);
    else assert.strictEqual(m.leading, a.pvb > b.pvb ? a.planet : b.planet);
    // results: one per distinct candidate, each the verse of that planet
    assert.strictEqual(m.results.length, m.sameCandidate ? 1 : new Set([a.planet, b.planet]).size);
    for (const r of m.results) assert.strictEqual(r.verse, T.masaPravesha.masaLordPhala[r.planet].verse);
  });
  // the first month's entry is the varsha entry
  assert.strictEqual(o.months[0].local.slice(0, 10), v.solarReturn.date);
  assert.strictEqual(o.months[0].local.slice(11, 16), v.solarReturn.time);
  // the twelve entries lie inside the year after the varsha entry
  assert.ok((o.months[11].utcMs - o.months[0].utcMs) / 86400000 < 345);
}
// a month's entry reaches the Sun exactly: whenSunAt then sunLon returns the target
const t = M.whenSunAt(100.5, Date.UTC(2026, 6, 10));
assert.ok(Math.abs(M.sunLon(t) - 100.5) < 1e-4);
console.log('test-masa-pravesha ok');
