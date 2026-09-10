const assert = require('node:assert/strict');
const { calcPorutham, calculateTamilPorutham, moonToStar } = require('./src/report/tamilPorutham');

// ── moonToStar ──────────────────────────────────────────────────────────
assert.deepEqual(moonToStar(0), { nakshatraIndex: 0, rasiIndex: 0, nakshatra: 'Ashwini' });
assert.equal(moonToStar(268.31).nakshatra, 'Uttara Ashadha'); // nak 20
assert.equal(moonToStar(268.31).rasiIndex, 8);                 // Sagittarius

// ── calcPorutham: 10 rows, known asymmetric rules ──────────────────────
// girl Ashwini(0)/Aries(0), boy Rohini(3)/Taurus(1):
//   Dhinam count = ((3-0+27)%27)+1 = 4 -> in [2,4,6,8,9] -> FAIL
//   Mahendram count 4 -> in [4,7,10,...] -> PASS
//   Stree Deergham 4 -> < 7 -> FAIL
const rows = calcPorutham(0, 3, 0, 1);
assert.equal(rows.length, 10);
const byName = Object.fromEntries(rows.map((r) => [r.name, r]));
assert.equal(byName['தினம்'].result, false, 'Dhinam count 4 fails');
assert.equal(byName['மகேந்திரம்'].result, true, 'Mahendram count 4 passes');
assert.equal(byName['ஸ்திரீ தீர்க்கம்'].result, false, 'Stree Deergham 4 < 7 fails');
// Rajju: Ashwini group 0 (கால்), Rohini group 3 (கழுத்து) -> different -> PASS
assert.equal(byName['ரஜ்ஜு'].result, true);
// Vedha: [3,10] is a pair; 0 & 3 is not -> no vedha -> PASS
assert.equal(byName['வேதை'].result, true);

// Same star, same rasi -> Rajju must FAIL (same group), Dhinam count 1 passes.
const same = Object.fromEntries(calcPorutham(5, 5, 4, 4).map((r) => [r.name, r]));
assert.equal(same['ரஜ்ஜு'].result, false, 'same nakshatra -> same Rajju group -> fail');
assert.equal(same['ராசி அதிபதி'].result, false, 'same rasi -> same lord -> fail');

// ── Full result ─────────────────────────────────────────────────────────
const r = calculateTamilPorutham(
  { nakshatraIndex: 20, rasiIndex: 8 },  // bride: Uttara Ashadha / Sagittarius
  { nakshatraIndex: 3, rasiIndex: 1 },   // groom: Rohini / Taurus
);
assert.equal(r.rows.length, 10);
assert.equal(r.total, 10);
assert.ok(r.passed >= 0 && r.passed <= 10);
assert.ok(['உத்தமம்', 'மத்திமம்', 'சாதாரணம்', 'குறைவு'].includes(r.level));
assert.equal(r.girl.nakshatra, 'Uttara Ashadha');
assert.equal(r.boy.nakshatra, 'Rohini');

console.log(JSON.stringify({
  pass: true, passed: r.passed, level: r.level,
  dhinam: byName['தினம்'].result, mahendram: byName['மகேந்திரம்'].result,
}, null, 2));
