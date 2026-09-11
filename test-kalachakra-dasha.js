const assert = require('node:assert/strict');
const {
  calculateKalachakraDasha, runningKalachakraPeriod, nakshatraPada, nakshatraRole,
  RASI_YEARS, SAVYA_BHUKTI, APASAVYA_BHUKTI,
} = require('./src/report/kalachakraDasha');

// ── source-table sanity ─────────────────────────────────────────────
// The 12 rāśi-years sum to 118 (the source's own Paramāyuṣ groups total this).
assert.equal(RASI_YEARS.reduce((a, b) => a + b, 0), 118);
assert.deepEqual(RASI_YEARS, [7, 16, 9, 21, 5, 9, 16, 7, 10, 4, 4, 10]);

// ── nakshatraRole: the source's own explicit worked lists (p.2-3) ─────
// Savya-muthal: Ashwini, Punarvasu, Hastham, Moolam, Poorattathi (0,6,12,18,24)
for (const nak0 of [0, 6, 12, 18, 24]) {
  const r = nakshatraRole(nak0);
  assert.equal(r.savya, true, `nak${nak0} savya`);
  assert.equal(r.role, 'muthal', `nak${nak0} muthal`);
}
// Savya-kadai: Krittika, Ashlesha, Swati, Uttarashada, Revati (2,8,14,20,26)
for (const nak0 of [2, 8, 14, 20, 26]) {
  const r = nakshatraRole(nak0);
  assert.equal(r.savya, true, `nak${nak0} savya`);
  assert.equal(r.role, 'kadai', `nak${nak0} kadai`);
}
// Apasavya-muthal: Rohini, Magha, Vishakha, Shravana (3,9,15,21)
for (const nak0 of [3, 9, 15, 21]) {
  const r = nakshatraRole(nak0);
  assert.equal(r.savya, false, `nak${nak0} apasavya`);
  assert.equal(r.role, 'muthal', `nak${nak0} muthal`);
}

// ── nakshatraPada boundaries ────────────────────────────────────────
assert.deepEqual(nakshatraPada(0), { nakshatraIndex: 0, pada: 1 });
assert.deepEqual(nakshatraPada(3.4), { nakshatraIndex: 0, pada: 2 });

// ── Bhukti walks: transcribed sequences (p.7-10), each 9 rāśis ───────
assert.deepEqual(SAVYA_BHUKTI[0], [0, 1, 2, 3, 4, 5, 6, 7, 8]);            // Mesha: straight run
assert.deepEqual(SAVYA_BHUKTI[3], [3, 4, 5, 6, 7, 8, 9, 10, 11]);          // Karka: straight run
assert.deepEqual(SAVYA_BHUKTI[7], [3, 4, 2, 1, 0, 11, 10, 9, 8]);          // Vrischika: cross-verified p.9-10 & p.11-12
for (const seq of SAVYA_BHUKTI) assert.equal(seq.length, 9);
// reused verbatim (p.10-11 "Mesha's method belongs to Dhanus too", etc.) --
// NOT rotated; a literal copy is the only reading that keeps every trine
// partner's Paramayush identity (sum of rasi-years over its own walk) exact.
assert.deepEqual(SAVYA_BHUKTI[8], SAVYA_BHUKTI[0]);    // Dhanus reuses Mesha's list
assert.deepEqual(SAVYA_BHUKTI[9], SAVYA_BHUKTI[1]);    // Makara reuses Vrishabha's list
assert.deepEqual(SAVYA_BHUKTI[10], SAVYA_BHUKTI[2]);   // Kumbha reuses Mithuna's list
assert.deepEqual(SAVYA_BHUKTI[11], SAVYA_BHUKTI[3]);   // Meena reuses Karka's list
// Paramayush identity: for every rasi, summing RASI_YEARS over its own
// Bhukti walk (repeats counted each time) equals that rasi's own trine
// Paramayush exactly -- this is what makes bhukti-years sum back to the
// maha's own years, and is the check that ruled out a rotated derivation.
const PARAMAYUSH_BY_TRINE_LOCAL = [100, 85, 83, 86];
for (let rasi0 = 0; rasi0 < 12; rasi0++) {
  const sum = SAVYA_BHUKTI[rasi0].reduce((s, r) => s + RASI_YEARS[r], 0);
  assert.equal(sum, PARAMAYUSH_BY_TRINE_LOCAL[rasi0 % 4], `rasi${rasi0} paramayush identity`);
}

// Apasavya = exact reverse of the same rāśi's savya walk (p.11-12).
for (let r = 0; r < 12; r++) assert.deepEqual(APASAVYA_BHUKTI[r], [...SAVYA_BHUKTI[r]].reverse());

// Deha (1st bhukti) / Jeeva (9th bhukti) swap between savya and apasavya for
// the same rasi -- falls out of the reversal automatically.
assert.equal(SAVYA_BHUKTI[7][0], APASAVYA_BHUKTI[7][8]);
assert.equal(SAVYA_BHUKTI[7][8], APASAVYA_BHUKTI[7][0]);

// ── a full calculation ──────────────────────────────────────────────
const birthMs = Date.UTC(1990, 4, 15, 2, 0);
const r = calculateKalachakraDasha({ moonLongitude: 268.31, birthMs });   // Uttarashada pada 1
assert.equal(r.available, true);
assert.equal(r.nakshatra, 'உத்திராடம்');
assert.equal(r.pada, 1);
assert.equal(r.direction, 'savya');       // Uttarashada is a savya-kadai star
assert.equal(r.role, 'kadai');
assert.equal(r.startRasi, 'தனுசு');       // savya-kadai pada1 -> Dhanusu (rasi index 8)
assert.equal(r.mahas.length, 12);
assert.equal(r.totalYears, 118);

// mahas are contiguous and each spans exactly its rasi-years
let cursor = birthMs;
for (const m of r.mahas) {
  assert.equal(m.startMs, cursor);
  assert.ok(Math.abs((m.endMs - m.startMs) / (365.25 * 86400000) - m.years) < 0.01, `${m.rasi} maha duration`);
  cursor = m.endMs;
  // 9 bhuktis, contiguous, summing to the maha's own years
  assert.equal(m.Bhukti.length, 9);
  let bcursor = m.startMs;
  let bsum = 0;
  for (const b of m.Bhukti) {
    assert.equal(b.startMs, bcursor);
    bcursor = b.endMs;
    bsum += b.years;
  }
  // b.years is rounded to 3 decimals per bhukti, so up to ~9*0.0005 can
  // accumulate across 9 bhuktis; the underlying ms math (checked above via
  // contiguous startMs/endMs) is exact.
  assert.ok(Math.abs(bsum - m.years) < 0.01, `${m.rasi} bhukti years sum to maha years (${bsum} vs ${m.years})`);
  assert.equal(m.dehaRasiIndex, m.Bhukti[0].rasiIndex);
  assert.equal(m.jeevaRasiIndex, m.Bhukti[8].rasiIndex);
}

// running period lookup
const running = runningKalachakraPeriod(r, r.mahas[2].startMs + 1000);
assert.equal(running.maha.rasi, r.mahas[2].rasi);
assert.ok(running.bhukti);

// an apasavya-born chart runs the mahas backward from its start rasi
const rIda = calculateKalachakraDasha({ moonLongitude: (3 + 0.1) * (360 / 27), birthMs }); // Rohini pada1
assert.equal(rIda.direction, 'apasavya');
assert.equal(rIda.startRasi, 'விருச்சிகம்');   // apasavya-muthal pada1 -> Vrischika
assert.equal(rIda.mahas[1].rasi, 'துலாம்');    // next maha backward from Vrischika -> Thula

console.log(JSON.stringify({
  pass: true,
  direction: r.direction, startRasi: r.startRasi, totalYears: r.totalYears,
  maha1: `${r.mahas[0].rasi} ${r.mahas[0].years}y ${r.mahas[0].start}->${r.mahas[0].end}`,
  deha: r.mahas[0].dehaRasi, jeeva: r.mahas[0].jeevaRasi,
}, null, 2));
