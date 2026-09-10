const assert = require('node:assert/strict');
const {
  chaldeanNameNumber, moolankFromDay, bhagyankFromDate,
  moolankBhagyankCompatibility, friendlyNumbers, calculateNumerology,
} = require('./src/report/numerology');

// Chaldean: "Abc" = a1 + b2 + c3 = 6.
assert.deepEqual(chaldeanNameNumber('Abc'), { compound: 6, single: 6 });
// Non-letters stripped, case-insensitive; "R. K. Narayan" letters only.
assert.equal(chaldeanNameNumber('R. K.').compound, 2 + 2); // r2 + k2
assert.equal(chaldeanNameNumber('   ---   '), null);
// Compound reduces to a single digit.
const big = chaldeanNameNumber('Krishnamurti');
assert.ok(big.single >= 1 && big.single <= 9 && big.compound > 9);

// Moolank = day of month reduced: 15 -> 1+5 = 6.
assert.deepEqual(moolankFromDay(15), { day: 15, single: 6 });
assert.deepEqual(moolankFromDay(9), { day: 9, single: 9 });
assert.deepEqual(moolankFromDay(29), { day: 29, single: 2 }); // 2+9=11 -> 2

// Bhagyank = every digit of YYYYMMDD summed + reduced.
// 1990-05-15 -> 1+9+9+0+0+5+1+5 = 30 -> 3.
assert.deepEqual(bhagyankFromDate(1990, 5, 15), { compound: 30, single: 3 });

// Compatibility: friend table + self.
assert.equal(moolankBhagyankCompatibility(6, 3).friendly, true);  // 3 in NUM_FRIEND[6]
assert.equal(moolankBhagyankCompatibility(8, 3).friendly, false); // 3 not in NUM_FRIEND[8]
assert.equal(moolankBhagyankCompatibility(5, 5).friendly, true);  // self
assert.ok(!friendlyNumbers(6).includes(6), 'friendlyNumbers excludes self');

// Full block.
const n = calculateNumerology({ name: 'Krishnamurti', year: 1990, month: 5, day: 15 });
assert.equal(n.moolank.single, 6);
assert.equal(n.bhagyank.single, 3);
assert.equal(n.compatibility.friendly, true);
assert.equal(n.moolankDetail.planet, 'சுக்கிரன்');      // 6 -> Venus
assert.ok(n.moolankDetail.lucky.stone.length > 0);
assert.equal(n.bhagyankDetail.planet, 'வியாழன்');       // 3 -> Jupiter
assert.ok(n.nameDetail && n.nameDetail.single === n.nameNumber.single);

console.log(JSON.stringify({
  pass: true, moolank: n.moolank.single, bhagyank: n.bhagyank.single,
  name: n.nameNumber, verdict: n.compatibility.verdict,
}, null, 2));
