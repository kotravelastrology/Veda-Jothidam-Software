const assert = require('node:assert/strict');
const { calculateVarshaphala } = require('./src/report/varshaphala');

const r = calculateVarshaphala(
  { name: 'V', year: 1990, month: 5, day: 15, hour: 7, minute: 30, latitude: 11.34, longitude: 77.72, utcOffsetMinutes: 330, ianaTimeZone: 'Asia/Kolkata' },
  34,
);

// ── Tripataki Chakra ──────────────────────────────────────────────────
assert.ok(Array.isArray(r.tripataki));
assert.equal(r.tripataki.length, 9);
const tByP = Object.fromEntries(r.tripataki.map((t) => [t.planet, t]));
// D = (yearsElapsed - 1) + 1 = 34.  rem9 = 34 % 9 = 7 ; Moon natal Dhanu(8)
// advanced forward (7-1)=6 signs -> (8 + 6) % 12 = 2 (Mithuna).
assert.equal(tByP.Moon.natalRasiIndex, 8);
assert.equal(tByP.Moon.tripatakiRasiIndex, 2);
// Ketu is always the 7th from Tripataki-Rahu.
assert.equal(tByP.Ketu.tripatakiRasiIndex, (tByP.Rahu.tripatakiRasiIndex + 6) % 12);
for (const t of r.tripataki) assert.ok(t.tripatakiRasiIndex >= 0 && t.tripatakiRasiIndex < 12);

// year N+1 shifts Moon's Tripataki by one sign (D increments -> rem9 +1).
const r2 = calculateVarshaphala(
  { name: 'V', year: 1990, month: 5, day: 15, hour: 7, minute: 30, latitude: 11.34, longitude: 77.72, utcOffsetMinutes: 330, ianaTimeZone: 'Asia/Kolkata' },
  35,
);
const moon2 = r2.tripataki.find((t) => t.planet === 'Moon').tripatakiRasiIndex;
assert.equal(moon2, (tByP.Moon.tripatakiRasiIndex + 1) % 12);

// ── Harsha Bala ──────────────────────────────────────────────────────
assert.ok(Array.isArray(r.harshaBala));
assert.equal(r.harshaBala.length, 7);
for (const h of r.harshaBala) {
  for (const k of ['sthana', 'uchcha', 'striPurusha', 'dinaRatri']) assert.ok(h[k] === 0 || h[k] === 5, `${h.planet}.${k} all-or-nothing`);
  assert.equal(h.total, h.sthana + h.uchcha + h.striPurusha + h.dinaRatri);
  assert.ok(h.total >= 0 && h.total <= 20);
}
// A masculine planet cannot score BOTH stri-purusha (masc house) AND fail
// dina-ratri consistently — just sanity that Saturn (feminine, own Capricorn
// in this chart) picks up the uchcha 5.
const sat = r.harshaBala.find((h) => h.planet === 'Saturn');
assert.equal(sat.uchcha, 5);

console.log(JSON.stringify({
  pass: true,
  moonTripataki: tByP.Moon.tripatakiRasi,
  saturnHarsha: sat.total,
}, null, 2));
