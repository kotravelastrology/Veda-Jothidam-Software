const assert = require('node:assert/strict');
const {
  calculateKpSystem, kpChain, obstructionHouses, rulingPlanets, houseForLongitude,
} = require('./src/report/kpSystem');

// ── kpChain: 5-level Vimshottari subdivision + nakshatra + pada ───────────
const c0 = kpChain(0); // 0° Aries
assert.equal(c0.nakshatra, 'Ashwini');
assert.equal(c0.pada, 1);
assert.equal(c0.signLord, 'Mars');
assert.equal(c0.starLord, 'Ketu');   // Ashwini
assert.equal(c0.sub, 'Ketu');        // first sub of its own star
assert.deepEqual([c0.signLord, c0.starLord, c0.sub, c0.subSub, c0.subSubSub].length, 5);
assert.equal(kpChain(359.999).nakshatra, 'Revati');
assert.equal(kpChain(12.5).pada, 4);        // Ashwini pada 4 (10°00'-13°20')
assert.equal(kpChain(13.4).nakshatra, 'Bharani'); // just past the Ashwini boundary
assert.equal(kpChain(13.4).pada, 1);

// ── obstructionHouses: Badhaka by Ascendant modality ────────────────────
assert.equal(obstructionHouses([{ longitude: 15 }]).badhaka, 11);   // Aries -> Movable
assert.equal(obstructionHouses([{ longitude: 45 }]).badhaka, 9);    // Taurus -> Fixed
assert.equal(obstructionHouses([{ longitude: 75 }]).badhaka, 7);    // Gemini -> Dual
assert.deepEqual(obstructionHouses([{ longitude: 45 }]).maraka, [2, 7]);

// ── houseForLongitude: Placidus arc containment ─────────────────────────
const cusps = Array.from({ length: 12 }, (_, i) => ({ number: i + 1, longitude: (i * 30 + 10) % 360 }));
assert.equal(houseForLongitude(15, cusps), 1);   // just after cusp 1 (10°)
assert.equal(houseForLongitude(5, cusps), 12);   // before cusp 1, wraps

// ── Full block: 1990-05-15 07:30 IST Erode (a Tuesday), Krishnamurti ────
const r = calculateKpSystem(
  { year: 1990, month: 5, day: 15, hour: 7, minute: 30, latitude: 11.34, longitude: 77.72, utcOffsetMinutes: 330 },
  { nodeType: 'mean' },
);
assert.equal(r.available, true);
assert.equal(r.ayanamsha, 'Krishnamurti');
assert.ok(Math.abs(r.ascendant - 52.64) < 0.1, `ascendant ${r.ascendant}`);
assert.equal(r.positions.length, 9);
assert.equal(r.cusps.length, 12);

// Day Lord: 1990-05-15 is a Tuesday -> Mars.
assert.equal(r.rulingPlanets.factors[0][1], 'Mars');
// Ascendant is Taurus (Fixed) -> Badhaka 9.
assert.equal(r.obstruction.ascendantSign, 'Taurus');
assert.equal(r.obstruction.badhaka, 9);

// Sun's KP chain matches the independently-ported PRSSS (nadiCombinations.kpLords).
const sun = r.positions.find((p) => p.name === 'Sun');
assert.deepEqual([sun.signLord, sun.starLord, sun.sub, sun.subSub, sun.subSubSub],
  ['Venus', 'Sun', 'Rahu', 'Mercury', 'Saturn']);
assert.equal(sun.house, 12);

// Significators: every entry has a 4-fold total, and it is the sorted union of
// self-occupied / self-owned / star-occupied / star-owned.
for (const s of r.significators) {
  assert.ok(Array.isArray(s.total));
  const expected = [...new Set([s.occupied, ...s.owned, s.starOccupied, ...s.starOwned].filter((x) => x != null))].sort((a, b) => a - b);
  assert.deepEqual(s.total, expected, `${s.name} total`);
}

console.log(JSON.stringify({
  pass: true, ascendant: Number(r.ascendant.toFixed(2)),
  dayLord: r.rulingPlanets.factors[0][1], badhaka: r.obstruction.badhaka,
  rpUnique: r.rulingPlanets.unique.join(','),
  sunChain: [sun.signLord, sun.starLord, sun.sub, sun.subSub, sun.subSubSub].join(':'),
}, null, 2));
