const assert = require('node:assert/strict');
const { buildYoginiDasha, buildAshtottariDasha, yoginiStartIndex, currentPeriod } = require('./src/dasha/altDashas');

// ── Yogini start index: (nakIdx0 + 3) mod 8 (BPHS Uttara) ────────────────
assert.equal(yoginiStartIndex(0), 3);   // Ashwini -> Bhramari
assert.equal(yoginiStartIndex(20), 7);  // Uttara Ashadha -> Sankata
assert.equal(yoginiStartIndex(5), 0);   // Ardra -> Mangala

const birthMs = Date.UTC(1990, 4, 15, 7, 30) - 330 * 60000;
const moonLon = 268.31; // Dhanu 28.31 (Uttara Ashadha), Lahiri

// ── Yogini ──────────────────────────────────────────────────────────────
const y = buildYoginiDasha(moonLon, birthMs);
assert.equal(y.system, 'Yogini');
assert.equal(y.cycleYears, 36);
assert.equal(y.startYogini, 'Sankata');
assert.equal(y.periods[0].lord, 'Rahu');            // Sankata -> Rahu
assert.ok(y.periods[0].years > 6 && y.periods[0].years <= 8, 'first period partial'); // 8*(1-frac)
assert.equal(y.periods[1].yogini, 'Mangala');
assert.equal(y.periods[1].lord, 'Moon');
assert.equal(y.periods[1].years, 1);
// 8 Yoginis, years 1..8 sum to 36; a full cycle of the 8 after the first.
const cycleSum = y.periods.slice(1, 9).reduce((s, p) => s + p.years, 0);
assert.equal(cycleSum, 36);
// Sub-periods of any period sum to the parent's length.
const p0 = y.periods[0];
const subSum = p0.subs.reduce((s, x) => s + x.years, 0);
assert.ok(Math.abs(subSum - p0.years) < 0.05, `yogini subs sum to parent (${subSum} vs ${p0.years})`);
assert.equal(p0.subs.length, 8);
// Enough periods that "now" (a living native) is covered.
const curY = currentPeriod(y.periods);
assert.ok(curY, 'a Yogini period is running now');
assert.ok(currentPeriod(curY.subs), 'a Yogini sub-period is running now');

// ── Ashtottari ──────────────────────────────────────────────────────────
const a = buildAshtottariDasha(moonLon, birthMs);
assert.equal(a.system, 'Ashtottari');
assert.equal(a.cycleYears, 108);
assert.equal(a.startLord, 'Saturn');   // Uttara Ashadha is in the Saturn group (from Ardra: Sun4 Moon3 Mars4 Mercury3 Saturn4...)
assert.equal(a.periods.length, 8);
const aSum = a.periods.slice(1).reduce((s, p) => s + p.years, 0)
  + a.periods[0].years; // first is partial
assert.ok(aSum > 100 && aSum <= 108, `ashtottari total ~108, got ${aSum}`);
const full = a.periods.slice(1).reduce((s, p) => s + p.years, 0);
assert.equal(full, 108 - 10, 'the 7 full periods sum to 108 minus Saturn (10)'); // Saturn is the partial first
const aP1 = a.periods[1];
assert.ok(Math.abs(aP1.subs.reduce((s, x) => s + x.years, 0) - aP1.years) < 0.05, 'ashtottari subs sum to parent');
const curA = currentPeriod(a.periods);
assert.ok(curA, 'an Ashtottari period is running now');

console.log(JSON.stringify({
  pass: true, yoginiStart: y.startYogini, yoginiFirstLord: y.periods[0].lord,
  ashtottariStart: a.startLord, yoginiNow: curY.yogini, ashtottariNow: curA.lord,
}, null, 2));
