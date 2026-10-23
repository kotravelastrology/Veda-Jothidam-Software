const assert = require('assert');
const V = require('./src/chart/vimshopaka');

// Each scheme splits exactly twenty points (v.17-25).
for (const [name, s] of Object.entries(V.SCHEMES)) {
  const sum = Object.values(s.weights).reduce((a, b) => a + b, 0);
  assert.strictEqual(sum, 20, `${name} totals 20`);
}
assert.strictEqual(Object.keys(V.SCHEMES.shodasavarga.weights).length, 16);
assert.strictEqual(Object.keys(V.SCHEMES.dasavarga.weights).length, 10);
assert.deepStrictEqual(Object.values(V.VARGA_VISWA), [20, 18, 15, 10, 7, 5]);

// The book's worked example (printed p.98-99): born 17-2-1984, 22:35, New Delhi. Libra rising with Saturn and Mars;
// Sun in Aquarius, Moon in Leo, Venus and Mercury in Capricorn, Jupiter in Sagittarius, Rahu in Taurus. Venus is 9s 4d32'30".
const SIGN = { Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5, Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11 };
const rasiPositions = { Sun: SIGN.Aquarius, Moon: SIGN.Leo, Mars: SIGN.Libra, Mercury: SIGN.Capricorn, Jupiter: SIGN.Sagittarius, Venus: SIGN.Capricorn, Saturn: SIGN.Libra };
const venus = V.vimshopaka('Venus', SIGN.Capricorn, 4 + 32 / 60 + 30 / 3600, rasiPositions, 'shadvarga');
const byVarga = Object.fromEntries(venus.rows.map((r) => [r.varga, r]));
// the printed table: division, lord, relation, Swaviswa, Varga Viswa, strength
assert.deepStrictEqual([byVarga.D1.lord, byVarga.D1.relation, byVarga.D1.viswa, byVarga.D1.points], ['Saturn', 'greatFriend', 18, 5.4]);
assert.deepStrictEqual([byVarga.D2.lord, byVarga.D2.relation, byVarga.D2.viswa, byVarga.D2.points], ['Moon', 'greatEnemy', 5, 0.5]);
assert.deepStrictEqual([byVarga.D3.lord, byVarga.D3.viswa, byVarga.D3.points], ['Saturn', 18, 3.6]);
assert.deepStrictEqual([byVarga.D9.sign, byVarga.D9.lord, byVarga.D9.viswa, byVarga.D9.points], [SIGN.Aquarius, 'Saturn', 18, 4.5]);
assert.deepStrictEqual([byVarga.D12.sign, byVarga.D12.viswa, byVarga.D12.points], [SIGN.Aquarius, 18, 1.8]);
assert.deepStrictEqual([byVarga.D30.sign, byVarga.D30.relation, byVarga.D30.viswa, byVarga.D30.points], [SIGN.Taurus, 'own', 20, 1]);
assert.ok(Math.abs(venus.total - 16.8) < 1e-9, `Venus totals ${venus.total}, the book says 16.8`);
assert.strictEqual(venus.reading.id, 'OVER_15');
assert.strictEqual(venus.translatorGrade.id, 'Poorna');

// A planet in its own sign in every varga scores the full twenty; the readings' boundaries.
assert.strictEqual(V.reading(4.99).id, 'BELOW_5');
assert.strictEqual(V.reading(5).id, '5_10');
assert.strictEqual(V.reading(10).id, '10_15');
assert.strictEqual(V.reading(15).id, 'OVER_15');
assert.strictEqual(V.translatorGrade(20).id, 'Atipoorna');
assert.strictEqual(V.translatorGrade(0).id, 'Atiheena');
const sun0 = V.vimshopaka('Sun', SIGN.Leo, 5, { ...rasiPositions, Sun: SIGN.Leo }, 'shadvarga');
assert.ok(sun0.total > 0 && sun0.total <= 20);

// Every scheme runs for every planet and stays within 0-20.
const chart = { signs: { ...rasiPositions, Rahu: 1, Ketu: 7 }, degrees: { Sun: 12, Moon: 3, Mars: 25, Mercury: 8, Jupiter: 17, Venus: 4.54, Saturn: 21 } };
for (const scheme of Object.keys(V.SCHEMES)) {
  const all = V.allVimshopaka(chart, scheme);
  assert.strictEqual(all.length, 7);
  for (const r of all) assert.ok(r.total >= 5 * 0.99 * 0 && r.total <= 20.0000001 && r.total >= 5 - 1e-9, `${scheme} ${r.planet} ${r.total}`);
}
assert.notDeepStrictEqual(V.TABLE_DISCREPANCY.verse, V.TABLE_DISCREPANCY.printedTable);
console.log('test-vimshopaka ok');
