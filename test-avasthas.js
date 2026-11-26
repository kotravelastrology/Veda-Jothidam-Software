const assert = require('node:assert/strict');
const {
  calculateAvasthas, jagradadi, baladi, deeptadi, shayanadi, lajjitadi, DEEPTADI, LAJJITADI,
} = require('./src/report/avasthas');

// ── Baladi: 5 states, 6deg each; odd (1-indexed) signs Bala->Mrita, even reverse ──
assert.equal(baladi(0, 3), 'பால (குழந்தை)');        // Aries (odd), first 6deg
assert.equal(baladi(0, 27), 'ம்ருத (இறந்த)');       // Aries, last 6deg
assert.equal(baladi(1, 3), 'ம்ருத (இறந்த)');        // Taurus (even) reverses -> first 6deg = Mrita
assert.equal(baladi(1, 27), 'பால (குழந்தை)');

// ── Jagradadi: exalted/own/MT -> awake; debilitated/enemy -> asleep ──────
assert.equal(jagradadi('Sun', 4), 'ஜாக்ரத் (விழிப்பு)');   // Sun in Leo (own)
assert.equal(jagradadi('Sun', 6), 'சுஷுப்தி (உறக்கம்)');   // Sun in Libra (debilitation)
assert.equal(jagradadi('Mars', 9), 'ஜாக்ரத் (விழிப்பு)');  // Mars in Capricorn (exaltation)

// ── Deeptadi: exalted -> Deepta, debilitated -> Khala, combust -> Vikala ──
const PL = { Sun: 30.27, Moon: 268.31, Mars: 294.30, Mercury: 14.34, Jupiter: 75.74, Venus: 348.62, Saturn: 271.53 };
assert.equal(deeptadi('Mars', PL), 'தீப்த (உச்சம்)');    // Mars in Capricorn 24deg -> exalted
assert.equal(deeptadi('Venus', PL), 'தீப்த (உச்சம்)');   // Venus in Pisces -> exalted
assert.equal(deeptadi('Saturn', PL), 'ஸ்வஸ்த (சொந்த வீடு)'); // Saturn in Capricorn -> own
// combust: Mercury within 10deg of Sun in the same sign
assert.equal(deeptadi('Mercury', { ...PL, Sun: 20, Mercury: 22 }), 'விகல (அஸ்தமனம்)');
// debilitation before combustion: Venus in Virgo (debilitated), 7deg from the Sun
assert.equal(deeptadi('Venus', { ...PL, Sun: 167.73, Venus: 160.57 }), DEEPTADI.khala);
// the nodes have no exaltation or own sign in BPHS ch.45, so no Deeptadi
assert.equal(deeptadi('Rahu', { ...PL, Rahu: 280.06 }), null);
// war-defeat: two tara-grahas in the same sign within 1deg, the further one loses
assert.equal(deeptadi('Jupiter', { ...PL, Jupiter: 100.5, Venus: 100.0 }), 'நிபீடித (கிரக யுத்தம்)');

// ── Full block (3 families only, no Shayana opts) ─────────────────────
const a = calculateAvasthas(PL);
assert.equal(a.available, true);
assert.equal(a.rows.length, 7);
assert.equal(a.hasFullSet, false);
for (const r of a.rows) {
  assert.ok(r.jagradadi && r.baladi && r.deeptadi, `${r.planet} states`);
  assert.equal(r.shayanadi, undefined);
}

// ── Full 5-family block ──────────────────────────────────────────────

// Shayanadi is deterministic given S,P,c,A,G,R.
const s1 = shayanadi('Sun', 30.27, 20, 15, 3); // arbitrary but fixed inputs
assert.ok(s1.index >= 1 && s1.index <= 12);
assert.ok(typeof s1.name === 'string' && s1.name.length > 0);
// Lajjitadi: an exalted planet with no affliction -> Garvit.
assert.ok(lajjitadi('Mars', PL, 1).includes(LAJJITADI.garvit)); // Mars in Capricorn (exalted)
// Shayanadi (BPHS v.30-37), the Sun of the sample birth: S 13, P 1, navamsha 6; Moon 27; ghatis 56.33 rounded up to 57; lagna 5
assert.equal(shayanadi('Sun', 167.726, 27, 56.33, 5).index, 11);

const full = calculateAvasthas(PL, { moonNakSerial: 20, ghatisSinceSunrise: 15, lagnaRasi0: 1 });
assert.equal(full.hasFullSet, true);
for (const r of full.rows) {
  assert.ok(r.shayanadi && typeof r.lajjitadi === 'string', `${r.planet} full states`);
}

console.log(JSON.stringify({
  pass: true,
  mars: a.rows.find((r) => r.planet === 'Mars').deeptadi,
  saturn: a.rows.find((r) => r.planet === 'Saturn').deeptadi,
  venusLajjitadi: full.rows.find((r) => r.planet === 'Venus').lajjitadi,
}, null, 2));
