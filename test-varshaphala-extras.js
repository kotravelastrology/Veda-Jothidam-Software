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

// ── Varsha Vimsottari Dasa ───────────────────────────────────────────
const vv = r.varshaVimsottariDasa;
assert.ok(vv && Array.isArray(vv.periods) && vv.periods.length >= 9);
const VV_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
assert.ok(VV_ORDER.includes(vv.startLord));
assert.ok(VV_ORDER.includes(vv.natalStartLord));
// after the (balance) first period, lords run in Vimshottari (Ketu-first cyclic) order
const i0 = VV_ORDER.indexOf(vv.periods[1].lord);
for (let k = 1; k < vv.periods.length; k++) {
  assert.equal(vv.periods[k].lord, VV_ORDER[(i0 + (k - 1)) % 9], `VV period ${k} in cyclic order`);
}
// full-period day counts match Table 76 (×3 of Vimshottari years)
const VV_DAYS = { Sun: 18, Moon: 30, Mars: 21, Rahu: 54, Jupiter: 48, Saturn: 57, Mercury: 51, Ketu: 21, Venus: 60 };
for (let k = 1; k < vv.periods.length - 1; k++) assert.equal(vv.periods[k].days, VV_DAYS[vv.periods[k].lord]);
assert.ok(vv.periods[0].days <= VV_DAYS[vv.periods[0].lord] + 0.05, 'first period is a balance');
// the sequence covers at least a full solar year
assert.ok(vv.periods.reduce((s, x) => s + x.days, 0) >= 365, 'VV spans a year');

// ── Varsha Narayana Dasa ────────────────────────────────────────────
const vn = r.varshaNarayanaDasa;
assert.ok(vn && Array.isArray(vn.periods));
assert.equal(vn.periods.length, 12);
assert.ok(['direct', 'indirect'].includes(vn.direction));
assert.ok(vn.munthaRasiIndex >= 0 && vn.munthaRasiIndex < 12);
// first rasi is the Muntha sign; days are each a positive ×3 compression (≤ 36)
assert.equal(vn.periods[0].rasiIndex, vn.munthaRasiIndex);
for (const p of vn.periods) assert.ok(p.days > 0 && p.days <= 36.05, `${p.rasi} days in range`);
// dates are contiguous
for (let k = 1; k < vn.periods.length; k++) assert.equal(vn.periods[k].start, vn.periods[k - 1].end);

console.log(JSON.stringify({
  varshaDashaPass: true,
  vvStart: vv.startLord, vvNatalStart: vv.natalStartLord, vvPeriods: vv.periods.length,
  vnDir: vn.direction, vnMuntha: vn.munthaRasi, vnDays: vn.periods.reduce((s, x) => s + x.days, 0),
}, null, 2));
