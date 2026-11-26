/**
 * KP Reader VI printed pp.154-159 (src/report/kpLongevity.js) on the book's own worked example, p.156-157: number 246 given at 5.30 P.M.
 * on 24-10-1967 (Madras). The book: Pisces lagna (common), so the 7th is badhaka and maraka; the sub-lord Mars is in the constellation of
 * Kethu, in the 7th — "the death is inevitable"; the second bhava is unoccupied, Mars its lord; the seventh holds the Sun, Kethu and
 * Mercury (R); Rahu, Mars and Jupiter are in Kethu's constellation; the ruling planets are Rahu, Mars, Mercury and Kethu.
 */
const assert = require('node:assert/strict');
const H = require('./src/report/kpHorary');
const L = require('./src/report/kpLongevity');

const chart = H.horaryChart({ number: 246, year: 1967, month: 10, day: 24, hour: 17, minute: 30, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707 });
const r = L.describeLongevity(chart.kp);
assert.ok(r.available);
assert.deepStrictEqual(r.ascendant, { sign: 'Pisces', modality: 'Dual', badhaka: 7, maraka: [2, 7] });
assert.strictEqual(r.subLord, 'Mars');
assert.strictEqual(r.starLord, 'Ketu');
assert.ok(r.starLordHouses.includes(7), 'Ketu occupies the 7th');
assert.strictEqual(r.life.find((x) => x.id === 'SHORT').status, 'HELD');
const h2 = r.deathSignificators.find((x) => x.house === 2);
const h7 = r.deathSignificators.find((x) => x.house === 7);
assert.deepStrictEqual(h2.occupants, [], 'the second bhava is unoccupied');
assert.deepStrictEqual(h2.lord, ['Mars']);
assert.deepStrictEqual([...h7.occupants].sort(), ['Ketu', 'Mercury', 'Sun']);
assert.deepStrictEqual([...h7.inOccupantsStars].sort(), ['Jupiter', 'Mars', 'Rahu']);
assert.deepStrictEqual([...chart.ruling.planets.map((p) => p.planet)].sort(), ['Ketu', 'Mars', 'Mercury', 'Rahu'], 'the ruling planets of the moment, p.156');

// badhaka by the sign: movable 11, fixed 9, common 7 (p.154)
assert.deepStrictEqual(L.BADHAKA, { Movable: 11, Fixed: 9, Dual: 7 });
for (const n of [1, 30, 100, 200]) {
  const x = L.describeLongevity(H.horaryChart({ number: n, year: 2026, month: 11, day: 25, hour: 10, minute: 0, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707 }).kp);
  for (const rule of [...x.life, ...x.ailment, ...x.accident.rules]) {
    assert.ok(['HELD', 'NOT_HELD'].includes(rule.status), rule.id);
    assert.ok(rule.en && rule.ta && rule.page >= 154 && rule.page <= 159, rule.id);
  }
}
assert.strictEqual(L.describeLongevity(null).available, false);
console.log('test-kp-longevity ok');
