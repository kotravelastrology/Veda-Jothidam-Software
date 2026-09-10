const assert = require('node:assert/strict');
const { calculateNadiCombinations, kpLords } = require('./src/report/nadiCombinations');

// 1990-05-15 07:30 IST Erode, Krishnamurti ayanamsha + mean node — the same
// birth the source "kottravel-Nadi-astrology-software" was validated with.
const r = calculateNadiCombinations(
  { year: 1990, month: 5, day: 15, hour: 7, minute: 30, latitude: 11.34, longitude: 77.72, utcOffsetMinutes: 330 },
  { ayanamsha: 'Krishnamurti', nodeType: 'mean' },
);

assert.equal(r.available, true);
assert.ok(Math.abs(r.ascendant - 52.64) < 0.05, `ascendant ${r.ascendant}`);
assert.equal(r.natal.length, 9);

// ── A: graha-pair combination, pattern 1·5·7·9, mode AP ───────────────────
const a = r.nadiCombinations['1579'].AP;
assert.equal(a.available, true);
assert.equal(a.rows.length, 9);
const sunRow = a.rows.find((x) => x.id === 'Sun');
// Parity with the source engine's output for this exact birth.
assert.equal(sunRow.remaining, 71);
assert.equal(sunRow.next, 'Jupiter');
assert.equal(sunRow.planets[0].id, 'Saturn');
assert.equal(sunRow.planets[0].percentage, 92.9);
assert.equal(sunRow.planets[1].id, 'Rahu');
assert.equal(sunRow.planets[1].percentage, 42.6);
// Rows sorted descending by percentage.
for (const row of a.rows) {
  for (let i = 1; i < row.planets.length; i += 1) {
    assert.ok(row.planets[i - 1].percentage >= row.planets[i].percentage, `${row.id} entries sorted`);
  }
}

// 3·11 and 10 patterns exclude the 180° / adjacent-node relations and use the
// 6° window — just assert they produce a valid shape.
for (const p of ['159', '311', '10']) {
  const d = r.nadiCombinations[p].BP;
  assert.equal(d.available, true, `${p} available`);
  assert.equal(d.rows.length, 9);
}

// ── B: bhava combination, house rows ─────────────────────────────────────
const b = r.bhavaCombinations['1579'].AP;
assert.equal(b.available, true);
assert.equal(b.rows.length, 12);
const h1 = b.rows[0];
assert.equal(h1.house, 1);
assert.equal(h1.planets[0].id, 'Rahu');
assert.equal(h1.planets[0].percentage, 92.5);
assert.equal(h1.planets[0].sourceHouse, 9);

// ── PRSSS (KP 5-level chain) ─────────────────────────────────────────────
assert.equal(r.prsss.length, 9);
const sunLords = r.prsss.find((p) => p.id === 'Sun').lords;
assert.deepEqual(sunLords, ['Venus', 'Sun', 'Rahu', 'Mercury', 'Saturn']);
assert.equal(kpLords(0).length, 5);            // 0° Aries
assert.equal(kpLords(359.9999).length, 5);     // near-360 boundary

// ── AP vs BP differ only when a Parivartana exists ───────────────────────
const apStr = JSON.stringify(r.nadiCombinations['1579'].AP.rows);
const bpStr = JSON.stringify(r.nadiCombinations['1579'].BP.rows);
// (this birth has no mutual exchange among the 7 -> AP == BP here)
assert.equal(b.exchanges.length, 0);
assert.equal(apStr, bpStr);

console.log(JSON.stringify({
  pass: true, ascendant: Number(r.ascendant.toFixed(2)),
  sunTop: `${sunRow.planets[0].id} ${sunRow.planets[0].percentage}%`,
  house1Top: `${h1.planets[0].id} ${h1.planets[0].percentage}%`,
  prsssSun: sunLords.join(':'),
}, null, 2));
