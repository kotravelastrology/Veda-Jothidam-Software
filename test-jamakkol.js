const assert = require('node:assert/strict');
const { calculateJamakkol, jkComputeArudam, jkComputeKavippu, jkSunVithi } = require('./src/report/jamakkol');

// ── Arudam: pure function of the query wall-clock minutes+seconds ────────
// 39m 20s -> totalMin 39.333 -> rasi floor(39.333/5)%12 = 7 (Scorpio),
// within = 39.333 - 35 = 4.333, deg = 4.333/5*30 = 26.
const ar = jkComputeArudam(39, 20);
assert.equal(ar.rasi, 7);
assert.ok(Math.abs(ar.deg - 26) < 1e-6, `arudam deg ${ar.deg}`);
assert.equal(jkComputeArudam(0, 0).rasi, 0);
assert.equal(jkComputeArudam(60, 0).rasi, 0); // wraps at 60 min

// ── Sun veedhi ─────────────────────────────────────────────────────────
assert.equal(jkSunVithi(0), 1);   // Mesha -> Rishaba veedhi
assert.equal(jkSunVithi(8), 2);   // Dhanu -> Mithuna veedhi
assert.equal(jkSunVithi(2), 0);   // Mithuna -> Mesha veedhi

// ── Kavippu casting ────────────────────────────────────────────────────
// arudam Scorpio(7) deg 26, udayam Taurus(1), sun Leo(4 -> veedhi 0 -> target 0):
//   n = ((0 - 7 + 12) % 12) + 1 = 6 ;  rasi = (1 + 6 - 1) % 12 = 6 ; deg = 30 - 26 = 4
const kv = jkComputeKavippu(7, 1, 4, 26);
assert.equal(kv.n, 6);
assert.equal(kv.rasi, 6);
assert.ok(Math.abs(kv.deg - 4) < 1e-6);

// ── Full reading (2026-09-10 14:39:20 IST Chennai, a Thursday) ──────────
const r = calculateJamakkol({
  year: 2026, month: 9, day: 10, hour: 14, minute: 39, second: 20,
  latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330,
});
assert.equal(r.available, true);
assert.equal(r.weekday, 4);        // Thursday
assert.equal(r.isNight, false);    // 14:39 is daytime
assert.ok(r.sunLongitude > 143 && r.sunLongitude < 144, `sidereal Sun ${r.sunLongitude}`); // early-Sep Leo
assert.equal(r.points.length, 8);
assert.equal(r.jamas.length, 8);
assert.ok(r.jamas.some((j) => j.active), 'one jama active');
assert.equal(r.activeJama, r.jamas.findIndex((j) => j.active) + 1);

// Jama-degree formula: weekday-lord Jupiter -> seqIdx 2 -> BASE 630;
// jama 1 (seqIdx 2) at nowHr 14.6556 -> norm(630 - 30*14.6556 - 90) = 100.33 -> Cancer 10.33.
const j1 = r.jamas[0];
assert.ok(Math.abs(j1.degInRasi - 10.33) < 0.05, `jama1 deg ${j1.degInRasi}`);
assert.equal(j1.rasi, 3); // Cancer

// The Arudam point in the full reading matches the standalone Arudam.
const arPoint = r.points.find((p) => p.label === 'ஆரூடம்');
assert.equal(arPoint.rasi, 7);
assert.ok(Math.abs(arPoint.deg - 26) < 1e-6);

// Every point carries a KP chain and a "nokki varum" planet + %.
for (const p of r.points) {
  assert.ok(p.kp && p.kp.signLord && p.kp.starLord, `${p.label} kp`);
  assert.ok(p.nokki.pct >= 0 && p.nokki.pct <= 100, `${p.label} nokki pct`);
}

// ── Today's transiting grahas (for the chart box) ────────────────────
assert.equal(r.transitPlanets.length, 9);
const ids = r.transitPlanets.map((p) => p.id);
for (const id of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
  assert.ok(ids.includes(id), `transitPlanets has ${id}`);
}
for (const p of r.transitPlanets) {
  assert.ok(p.rasiIndex >= 0 && p.rasiIndex < 12, `${p.id} rasiIndex in range`);
  assert.ok(p.degreeInSign >= 0 && p.degreeInSign < 30, `${p.id} degreeInSign in range`);
  assert.equal(typeof p.retrograde, 'boolean');
}
// Rahu/Ketu are always exactly opposite.
const rahu = r.transitPlanets.find((p) => p.id === 'Rahu');
const ketu = r.transitPlanets.find((p) => p.id === 'Ketu');
assert.equal((rahu.rasiIndex + 6) % 12, ketu.rasiIndex);
assert.equal(r.lagnaRasiIndex, r.points.find((p) => p.label === 'லக்னம்').rasi);

console.log(JSON.stringify({
  pass: true, weekday: r.weekday, sunrise: Number(r.sunriseHr.toFixed(2)),
  activeJama: r.activeJama, arudam: `${arPoint.rasi}/${arPoint.deg.toFixed(1)}`,
  jama1: `${j1.rasi}/${j1.degInRasi.toFixed(2)}`,
}, null, 2));
