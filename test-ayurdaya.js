const assert = require('node:assert/strict');
const {
  calculateAyurdaya, pindayuBasic, nisargayuBasic, amsayuBasic, classifyLifespan,
} = require('./src/report/ayurdaya');

// ── Rule-of-three: full years at deep exaltation, half at deep debilitation ──
// Sun deep exaltation = Aries 10° (10°); Pindayu full = 19.
assert.ok(Math.abs(pindayuBasic('Sun', 10) - 19) < 1e-6, 'Sun at deep exaltation -> full 19');
// deep debilitation = Libra 10° (190°): d = 180 -> c = d·f/360 = 19·180/360 = 9.5
assert.ok(Math.abs(pindayuBasic('Sun', 190) - 9.5) < 1e-6, 'Sun at deep debilitation -> half 9.5');
// Naisargayu Saturn full = 50 at Libra 20°.
assert.ok(Math.abs(nisargayuBasic('Saturn', 6 * 30 + 20) - 50) < 1e-6);

// ── Amsayu: longitude x 108, sign-count + deg/30 ────────────────────────
// 0° -> 0 years; 1°6.667' * 108 = ~120° -> Cancer -> 3 years, etc. Just shape:
assert.equal(amsayuBasic(0), 0);
assert.ok(amsayuBasic(15) >= 0 && amsayuBasic(15) < 12);

// ── Lifespan categories ───────────────────────────────────────────────
assert.equal(classifyLifespan(5), 'பாலாரிஷ்டம் (Bālāriṣṭa)');
assert.equal(classifyLifespan(30), 'அல்பாயுள் (Alpāyu)');
assert.equal(classifyLifespan(70), 'பூர்ணாயுள் (Pūrṇāyu)');
assert.equal(classifyLifespan(5000), 'அமிதாயுள் (Amitāyu)');

// ── Full block ────────────────────────────────────────────────────────
const grahas = [
  { planet: 'Sun', longitude: 30.27, retrograde: false, houseFromLagna: 1 },
  { planet: 'Moon', longitude: 268.31, retrograde: false, houseFromLagna: 8 },
  { planet: 'Mars', longitude: 294.30, retrograde: false, houseFromLagna: 10 },
  { planet: 'Mercury', longitude: 14.34, retrograde: false, houseFromLagna: 12 },
  { planet: 'Jupiter', longitude: 75.74, retrograde: false, houseFromLagna: 2 },
  { planet: 'Venus', longitude: 348.62, retrograde: false, houseFromLagna: 11 },
  { planet: 'Saturn', longitude: 271.53, retrograde: false, houseFromLagna: 9 },
];
const a = calculateAyurdaya({
  grahas, sunLongitude: 30.27, ascendantLongitude: 52.55, lagnaRasi0: 1, ascBeneficAspect: false,
});
assert.equal(a.available, true);
assert.ok(['pindayu', 'nisargayu', 'amsayu'].includes(a.system));
assert.equal(a.contributions.length, 7);
for (const c of a.contributions) {
  assert.ok(c.netYears <= c.basicYears + 1e-9, `${c.planet} net <= basic`);
  assert.ok(c.netYears >= 0);
  assert.ok(typeof c.reason === 'string');
}
// total = Σ net + ascendant contribution, then x Savana->Saura.
const sumNet = a.contributions.reduce((s, c) => s + c.netYears, 0) + a.ascendantYears;
assert.ok(Math.abs(a.totalSavana - Math.round(sumNet * 100) / 100) < 0.02);
assert.ok(a.totalSaura < a.totalSavana); // Saura is 0.9856 x Savana
assert.ok(typeof a.category === 'string' && a.category.length > 0);

// Venus/Saturn are combustion-exempt: a Venus right on the Sun keeps its years
// against Astangata (may still lose to Vyayadi, but never the combust reason).
const vExempt = calculateAyurdaya({
  grahas: grahas.map((g) => (g.planet === 'Venus' ? { ...g, longitude: 31, houseFromLagna: 3 } : g)),
  sunLongitude: 30.27, ascendantLongitude: 52.55, lagnaRasi0: 1,
});
assert.ok(!/அஸ்தங்கத/.test(vExempt.contributions.find((c) => c.planet === 'Venus').reason), 'Venus exempt from combustion Harana');

console.log(JSON.stringify({
  pass: true, system: a.systemTa, totalSaura: a.totalSaura, category: a.category,
}, null, 2));
