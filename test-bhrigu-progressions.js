const assert = require('node:assert/strict');
const {
  calculateBhriguProgressions, runningYear, cycleRuler, jeevaRows,
} = require('./src/report/bhriguProgressions');

// ── runningYear (BCP): 1-based year of life ───────────────────────────────
assert.equal(runningYear('1990-05-15', '1990-05-15'), 1, 'birth day = year 1');
assert.equal(runningYear('1990-05-15', '1991-05-14'), 1, 'day before 1st anniversary still year 1');
assert.equal(runningYear('1990-05-15', '1991-05-15'), 2, '1st anniversary = year 2');
assert.equal(runningYear('1990-05-15', '2026-09-10'), 37);
assert.equal(runningYear('1990-05-15', '1989-01-01'), null, 'before birth');

// ── cycleRuler: 12-year blocks over 108 years ────────────────────────────
assert.equal(cycleRuler(1), 'Moon');
assert.equal(cycleRuler(12), 'Moon');
assert.equal(cycleRuler(13), 'Mercury');
assert.equal(cycleRuler(37), 'Sun');    // years 37-48 -> block index 3 -> Sun
assert.equal(cycleRuler(109), null);

// ── jeevaRows ────────────────────────────────────────────────────────────
// Sun at sidereal 30.27° -> star index floor(30.27*27/360)=2 -> star lord Sun (index 2%9).
const grahas = [
  { id: 'Sun', sign: 1, longitude: 30.2685 },
  { id: 'Moon', sign: 8, longitude: 268.31 },
  { id: 'Mars', sign: 9, longitude: 294.30 },
  { id: 'Mercury', sign: 0, longitude: 14.34 },
  { id: 'Jupiter', sign: 2, longitude: 75.74 },
  { id: 'Venus', sign: 11, longitude: 348.62 },
  { id: 'Saturn', sign: 9, longitude: 271.53 },
  { id: 'Rahu', sign: 9, longitude: 287.64 },
  { id: 'Ketu', sign: 3, longitude: 107.64 },
];
const jr = jeevaRows(grahas);
assert.equal(jr.length, 9);
const sunJ = jr.find((r) => r.id === 'Sun');
assert.equal(sunJ.jeeva, 'Sun');
assert.equal(sunJ.own, true);
assert.equal(sunJ.sharira, 'Venus'); // own star -> sign lord of Vrishabha (index 1) = Venus

// ── Full block ───────────────────────────────────────────────────────────
const bp = calculateBhriguProgressions({
  grahas, birthISO: '1990-05-15', asOfISO: '2026-09-10', mahadashaLord: 'Rahu',
});
assert.equal(bp.available, true);
assert.equal(bp.runningYear, 37);
assert.equal(bp.bcpHouse, ((37 - 1) % 12) + 1); // = 1
assert.equal(bp.bcpCycleRuler, 'Sun');
assert.equal(bp.bcpTable.length, 7);
assert.ok(bp.bcpTable.some((r) => r.current && r.year === 37));

// Dasha-BCP focus: Rahu sign (9) + (37-1) mod 12 -> (9 + 36) % 12 = 9 -> lord Saturn.
assert.equal(bp.dashaBcpFocus.focusSign, 9);
assert.equal(bp.dashaBcpFocus.focusSignLord, 'Saturn');

// BSP: rule no.6 (Mars, age 27) target sign = Mars.sign(9) + 10 - 1 = 18 % 12 = 6.
const rule6 = bp.bsp.find((r) => r.no === 6);
assert.equal(rule6.targetSign, 6);
assert.equal(rule6.active, false); // running year is 37, not 27
assert.equal(bp.bsp.length, 6);

console.log(JSON.stringify({
  pass: true, runningYear: bp.runningYear, bcpHouse: bp.bcpHouse,
  cycleRuler: bp.bcpCycleRuler, focus: bp.dashaBcpFocus.focusSignLord,
}, null, 2));
