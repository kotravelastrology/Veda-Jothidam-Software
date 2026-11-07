const assert = require('node:assert/strict');
const { calcPorutham, calculateTamilPorutham, moonToStar } = require('./src/report/tamilPorutham');

// ── moonToStar ──────────────────────────────────────────────────────────
assert.deepEqual(moonToStar(0), { nakshatraIndex: 0, rasiIndex: 0, nakshatra: 'Ashwini' });
assert.equal(moonToStar(268.31).nakshatra, 'Uttara Ashadha'); // nak 20
assert.equal(moonToStar(268.31).rasiIndex, 8);                 // Sagittarius

// ── calcPorutham: 10 rows, known asymmetric rules ──────────────────────
// girl Ashwini(0)/Aries(0), boy Rohini(3)/Taurus(1):
//   Dhinam count = ((3-0+27)%27)+1 = 4 -> the 4th is Kshema, GOOD in both
//     Kalaprakasika (p.69) and Sudamani (p.78)
//   Mahendram count 4 -> in [4,7,10,...] -> PASS
//   Stree Deergham 4 -> < 13 -> FAIL
//
// This comment used to read "Dhinam count 4 -> in [2,4,6,8,9] -> FAIL" and the
// assertion below asserted it. That inverted rule was recorded as intended, in
// a test, which is how it survived: both books list 2, 4, 6, 8, 9 as the GOOD
// counts. The full evidence is in test-porutham-source.js.
const rows = calcPorutham(0, 3, 0, 1);
assert.equal(rows.length, 10);
const byName = Object.fromEntries(rows.map((r) => [r.name, r]));
assert.equal(byName['தினம்'].result, true, 'Dhinam count 4 is good');
assert.equal(byName['மகேந்திரம்'].result, true, 'Mahendram count 4 passes');
assert.equal(byName['ஸ்திரீ தீர்க்கம்'].result, false, 'Stree Deergham 4 < 13 fails');
// Rajju: Ashwini is Padha (கால்), Rohini is Kanta (கழுத்து) -> different -> PASS
assert.equal(byName['ரஜ்ஜு'].result, true);
// Vedha: Ashwini pairs with Jyeshtha, Rohini with Swathi -> 0 & 3 is no pair -> PASS
assert.equal(byName['வேதை'].result, true);
// Gana: Ashwini is Deva, Rohini is Manushya (it used to be Deva) -> acceptable
assert.equal(byName['கணம்'].note, 'பெண்: தேவர், ஆண்: மனிதர்');

// Same star, same rasi -> Rajju must FAIL (same group). Dhinam is graded by the
// star itself: Ardra is one of the eight excellent common janma nakshatras.
const same = Object.fromEntries(calcPorutham(5, 5, 4, 4).map((r) => [r.name, r]));
assert.equal(same['ரஜ்ஜு'].result, false, 'same nakshatra -> same Rajju group -> fail');
// the Rasi-lord factor is withheld: shown, not counted, and the same lord is a friend of itself
assert.equal(same['ராசி அதிபதி'].result, null, 'same rasi -> withheld, not a verdict');
assert.equal(same['ராசி அதிபதி'].withheld, true);
assert.equal(same['ராசி அதிபதி'].measure.friends, true, 'a lord is friends with itself');

// Rasi lords' friendship, read in either direction (Kalaprakasika pp.74-75), by rasi index
const lordsFriends = (girlRasi, boyRasi) =>
  calcPorutham(5, 5, girlRasi, boyRasi).find((x) => x.name === 'ராசி அதிபதி').measure.friends;
assert.equal(lordsFriends(4, 8), true, 'Sun (Leo) and Jupiter (Sagittarius): Jupiter is the Sun\'s only friend');
assert.equal(lordsFriends(0, 1), true, 'Mars (Aries) and Venus (Taurus): Mars names Venus');
assert.equal(lordsFriends(0, 3), false, 'Mars (Aries) and Moon (Cancer): neither names the other');
assert.equal(lordsFriends(4, 0), false, 'Sun (Leo) and Mars (Aries)');
assert.equal(lordsFriends(9, 8), true, 'Saturn (Capricorn) and Jupiter: Jupiter names Saturn; Saturn names only his enemy');
assert.equal(lordsFriends(9, 2), true, 'Saturn (Capricorn) and Mercury (Gemini): Mercury names all save the Sun');
assert.equal(same['தினம்'].result, true, 'Ardra as a common janma nakshatra is excellent');

// ── Full result ─────────────────────────────────────────────────────────
const r = calculateTamilPorutham(
  { nakshatraIndex: 20, rasiIndex: 8 },  // bride: Uttara Ashadha / Sagittarius
  { nakshatraIndex: 3, rasiIndex: 1 },   // groom: Rohini / Taurus
);
assert.equal(r.rows.length, 10);
assert.equal(r.total, 9, 'the withheld Rasi-lord factor is not counted');
assert.ok(r.passed >= 0 && r.passed <= 9);
assert.ok(['உத்தமம்', 'மத்திமம்', 'சாதாரணம்', 'குறைவு'].includes(r.level));
assert.equal(r.girl.nakshatra, 'Uttara Ashadha');
assert.equal(r.boy.nakshatra, 'Rohini');

console.log(JSON.stringify({
  pass: true, passed: r.passed, level: r.level,
  dhinam: byName['தினம்'].result, mahendram: byName['மகேந்திரம்'].result,
}, null, 2));
