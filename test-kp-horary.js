const assert = require('assert');
const H = require('./src/report/kpHorary');
const T = require('./src/report/kpHoraryTopics');

// the 249 subs: contiguous from 0 to 360, none crossing a sign, each row's lords by kpLords
assert.strictEqual(H.TABLE.length, 249);
assert.strictEqual(H.TABLE[0].from, 0);
assert.ok(Math.abs(H.TABLE[248].to - 360) < 1e-9);
for (let i = 1; i < 249; i += 1) assert.ok(Math.abs(H.TABLE[i].from - H.TABLE[i - 1].to) < 1e-9, `row ${i + 1} follows row ${i}`);
for (const r of H.TABLE) assert.strictEqual(Math.floor((r.from + 1e-9) / 30), Math.floor((r.to - 1e-9) / 30), `row ${r.number} stays in one sign`);
// the number of subs in each sign: 22 + 20 + ... (the three sign-boundary stars are cut)
const perSign = Array.from({ length: 12 }, (_, s) => H.TABLE.filter((r) => r.sign === s).length);
assert.strictEqual(perSign.reduce((a, b) => a + b, 0), 249);
assert.strictEqual(perSign[0], 22);   // numbers 1-22 are Aries (printed p.90: rows 1 to 22, then "Taurus-Rishaba" from 23)
const sec = (r) => [r.from, r.to].map((x) => Math.round(x * 3600) / 3600);
// printed pp.89-90 (page images): 1 Mars-Ketu-Ketu 0.00.00-0.46.40; 2 Venus 0.46.40-3.00.00; 17 Mercury 24.00.00-25.53.20; 22 Rahu 29.13.20-30.00.00; 23 Taurus Sun-Rahu 0-1.13.20
const t = H.TABLE;
assert.deepStrictEqual([t[0].signLord, t[0].starLord, t[0].subLord], ['Mars', 'Ketu', 'Ketu']);
assert.ok(Math.abs(t[0].to - (46 + 40 / 60) / 60) < 1e-9);
assert.strictEqual(t[1].subLord, 'Venus');
assert.deepStrictEqual([t[16].subLord, +(t[16].from).toFixed(6), +(t[16].to).toFixed(6)], ['Mercury', 24, +(25 + 53 / 60 + 20 / 3600).toFixed(6)]);
assert.deepStrictEqual([t[21].subLord, t[21].to], ['Rahu', 30]);
assert.deepStrictEqual([t[22].sign, t[22].signLord, t[22].starLord, t[22].subLord, t[22].from], [1, 'Venus', 'Sun', 'Rahu', 30]);
assert.deepStrictEqual(sec(t[9]), [13 + 20 / 60, 15 + 33 / 60 + 20 / 3600].map((x) => Math.round(x * 3600) / 3600), 'row 10 Venus sub 13.20.00-15.33.20');

// the ascendant of a number is the start of its sub
assert.strictEqual(H.ascendantOfNumber(1), 0);
assert.ok(Math.abs(H.ascendantOfNumber(77) - (90 + 19 + 20 / 60)) < 1e-9, 'number 77 is Cancer 19 20 (Moon-Mercury-Venus)');
assert.throws(() => H.ascendantOfNumber(250), /1 to 249/);
assert.throws(() => H.ascendantOfNumber(1.5), /1 to 249/);

// the cusps are those of the moment that ascendant rises at the place: opposite cusps are 180 apart, the first is the number's own
const c = H.horaryChart({ number: 77, year: 2026, month: 9, day: 18, hour: 8, minute: 0, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707 });
const cu = c.kp.cusps;
assert.ok(Math.abs(cu[0].longitude - H.ascendantOfNumber(77)) < 1e-9);
assert.ok(Math.abs(((cu[6].longitude - cu[0].longitude + 360) % 360) - 180) < 1e-6);
assert.ok(Math.abs(((cu[9].longitude - cu[3].longitude + 360) % 360) - 180) < 1e-6);
for (let i = 1; i < 12; i += 1) assert.ok(((cu[i].longitude - cu[i - 1].longitude + 360) % 360) < 90, 'cusps run forward');
// the planets are those of the time of judgment, not of the ascendant's instant: the Sun on 18 Sep 2026 is in Virgo whatever the number
const c2 = H.horaryChart({ number: 200, year: 2026, month: 9, day: 18, hour: 8, minute: 0, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707 });
assert.strictEqual(c.kp.positions[0].sign, 'Virgo');
assert.ok(Math.abs(c.kp.positions[0].longitude - c2.kp.positions[0].longitude) < 1e-9);
assert.notStrictEqual(c.kp.cusps[0].sign, c2.kp.cusps[0].sign);
// ruling planets (printed p.123): Friday is Venus; the Moon's sign and star lords, the ascendant's sign and star lords
assert.strictEqual(c.ruling.factors[0][1], 'Venus');
assert.deepStrictEqual(c.ruling.factors.map((f) => f[0]), ['Day Lord', 'Moon Sign Lord', 'Moon Star Lord', 'Asc Sign Lord', 'Asc Star Lord']);
// a node standing in a sign of a ruling planet is added
const fake = { positions: [{ name: 'Rahu', signLord: 'Mercury', starLord: 'Mars', retrograde: true }, { name: 'Ketu', signLord: 'Mars', starLord: 'Mars', retrograde: true }, { name: 'Mars', signLord: 'Mars', starLord: 'Rahu', retrograde: true }, { name: 'Mercury', signLord: 'Mercury', starLord: 'Mars', retrograde: false }],
  rulingPlanets: { factors: [['Day Lord', 'Mercury'], ['Moon Sign Lord', 'Mars'], ['Moon Star Lord', 'Mercury'], ['Asc Sign Lord', 'Mars'], ['Asc Star Lord', 'Mercury']] } };
const rp = H.horaryRulingPlanets(fake);
assert.deepStrictEqual(rp.nodesAdded.map((x) => [x.node, x.forLord]), [['Rahu', 'Mercury'], ['Ketu', 'Mars']]);
assert.strictEqual(rp.planets.find((p) => p.planet === 'Mercury').inRetrogradeStar, true, 'Mercury stands in the star of retrograde Mars');

// the question catalogue: houses stated in the book, with the page
for (const q of T.TOPICS) {
  assert.ok(q.houses.length >= 2 && q.houses.every((h) => h >= 1 && h <= 12), q.id);
  assert.ok(q.page >= 86 && q.page <= 312 && q.reasonTa.length > 5, q.id);
}
assert.deepStrictEqual(T.BY_ID.TRUNK_CALL.houses, [3, 9, 11]);
assert.deepStrictEqual(T.BY_ID.OVERSEAS.houses, [3, 9, 12]);
assert.deepStrictEqual(T.BY_ID.BUILD_HOUSE.houses, [4, 11, 12]);
const a = T.analyseTopic(c.kp, c.ruling, 'TRUNK_CALL');
assert.deepStrictEqual(a.cusps.map((x) => x.house), [3, 9, 11]);
assert.strictEqual(a.extra.length, 3);
assert.ok(a.significators.every((s) => s.topicHouses.length > 0));
assert.strictEqual(T.analyseTopic(c.kp, c.ruling, 'MARRIAGE').extra.length, 0);
console.log('test-kp-horary ok');
