/**
 * Saturn's passages through given signs and nakshatras (src/report/saturnPassages.js): the run finder on a made-up classifier, then Saturn against the ephemeris itself.
 */
const assert = require('node:assert/strict');
const S = require('./src/report/saturnPassages');

// the run finder: key 'A' on days 10-20 and 40-50, 'B' on 20-30 (so A runs into B), nothing elsewhere
const classify = (jd) => (jd >= 10 && jd < 20 ? 'A' : jd >= 20 && jd < 30 ? 'B' : jd >= 40 && jd < 50 ? 'A' : null);
let r = S.runs(classify, 0, 60, 2);
assert.deepEqual(r.map((x) => x.key), ['A', 'B', 'A']);
assert.deepEqual(r.map((x) => [Math.round(x.fromJd * 1e6) / 1e6, Math.round(x.toJd * 1e6) / 1e6]), [[10, 20], [20, 30], [40, 50]]);
assert.ok(r.every((x) => !x.continuesBefore && !x.continuesAfter));
// a run open at the start or the end of the range says so, and ends at the range's ends
r = S.runs(classify, 12, 45, 2);
assert.deepEqual(r.map((x) => [x.key, x.continuesBefore, x.continuesAfter]), [['A', true, false], ['B', false, false], ['A', false, true]]);
assert.equal(r[0].fromJd, 12);
assert.equal(r.at(-1).toJd, 45);
assert.deepEqual(S.runs(() => null, 0, 100), []);
assert.deepEqual(S.runs(() => 'X', 0, 100).map((x) => [x.key, x.fromJd, x.toJd, x.continuesBefore, x.continuesAfter]), [['X', 0, 100, true, true]]);
// the end of a run is found between the steps (3.7 is not a multiple of the 2-day step)
r = S.runs((jd) => (jd < 3.7 ? 'A' : null), 0, 10, 2);
assert.ok(Math.abs(r[0].toJd - 3.7) < 1e-6);

// Saturn against the ephemeris: Pisces and Aries (sidereal Lahiri) from 2024 to 2032
const jdOf = (y, m, d) => Date.UTC(y, m - 1, d) / 86400000 + 2440587.5;
const iso = (jd) => new Date((jd - 2440587.5) * 86400000).toISOString().slice(0, 16);
const from = jdOf(2024, 1, 1);
const to = jdOf(2032, 1, 1);
const sign = S.signPassages([11, 0], from, to, 'Lahiri');
assert.deepEqual(sign.map((x) => [x.key, iso(x.fromJd), iso(x.toJd)]), [
  [11, '2025-03-29T16:15', '2027-06-02T23:58'],
  [0, '2027-06-02T23:58', '2027-10-20T01:42'],
  [11, '2027-10-20T01:42', '2028-02-23T13:53'],
  [0, '2028-02-23T13:53', '2029-08-08T07:01'],
  [0, '2029-10-05T11:22', '2030-04-17T03:37'],
], 'Saturn enters Pisces on 29 March 2025 and Aries on 2 June 2027 (sidereal), turns back into Pisces and out again');
// every boundary is where the sign changes, to the second
for (const x of sign) {
  assert.equal(S.signAt(x.fromJd + 1e-5, 'Lahiri'), x.key);
  assert.equal(S.signAt(x.toJd - 1e-5, 'Lahiri'), x.key);
  assert.notEqual(S.signAt(x.fromJd - 1e-5, 'Lahiri'), x.key);
  assert.notEqual(S.signAt(x.toJd + 1e-5, 'Lahiri'), x.key);
}
// the runs and the ephemeris agree on every third day
for (let jd = from; jd < to; jd += 3) {
  const s = S.signAt(jd, 'Lahiri');
  const inRun = sign.find((x) => x.fromJd <= jd && jd < x.toJd);
  assert.equal(inRun ? inRun.key : null, [11, 0].includes(s) ? s : null, iso(jd));
}
// the nakshatras Uttarabhadra, Revati and Purvabhadra (25-27)
const nak = S.nakshatraPassages([25, 26, 27], from, to, 'Lahiri');
for (let jd = from; jd < to; jd += 3) {
  const n = S.nakshatraAt(jd, 'Lahiri');
  const inRun = nak.find((x) => x.fromJd <= jd && jd < x.toJd);
  assert.equal(inRun ? inRun.key : null, [25, 26, 27].includes(n) ? n : null, iso(jd));
}
assert.deepEqual(nak.slice(0, 3).map((x) => [x.key, iso(x.fromJd), iso(x.toJd)]), [[25, '2024-04-06T08:40', '2024-10-03T09:26'], [25, '2024-12-27T14:52', '2025-04-28T00:51'], [26, '2025-04-28T00:51', '2025-10-03T18:11']]);
assert.ok(nak.every((x, i) => i === 0 || x.fromJd >= nak[i - 1].toJd - 1e-9), 'the runs are in order and do not overlap');
// no sign is left out: all twelve signs cover the whole range, one run after the other
const all = S.signPassages([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], from, to, 'Lahiri');
assert.ok(all[0].continuesBefore && all.at(-1).continuesAfter);
for (let i = 1; i < all.length; i += 1) assert.ok(Math.abs(all[i].fromJd - all[i - 1].toJd) < 1e-9);
console.log('test-saturn-passages: all assertions passed');
