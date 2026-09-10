const assert = require('node:assert/strict');
const {
  suggestNames, nakshatraPada, NAKSHATRA_TA, PADA_SYLLABLES_TA, BABY_NAMES,
} = require('./src/report/babyNames');

// ── tables ───────────────────────────────────────────────────────────
assert.equal(NAKSHATRA_TA.length, 27);
assert.equal(PADA_SYLLABLES_TA.length, 27);
for (const row of PADA_SYLLABLES_TA) assert.equal(row.length, 4);
assert.deepEqual(PADA_SYLLABLES_TA[0], ['சு', 'ச', 'சீ', 'ஸ்']);  // Ashwini
assert.deepEqual(PADA_SYLLABLES_TA[26], ['தே', 'தோ', 'ச', 'சி']); // Revati

// ── nakshatraPada from a Moon longitude ─────────────────────────────
// 0° = Ashwini pada 1
assert.deepEqual(nakshatraPada(0), { nakshatraIndex: 0, pada: 1 });
// each pada spans 3°20' = 3.3333°; 3.4° into Ashwini → pada 2
assert.deepEqual(nakshatraPada(3.4), { nakshatraIndex: 0, pada: 2 });
// 268.31° → Uttara Ashadha (index 20) pada 1
const up = nakshatraPada(268.31);
assert.equal(up.nakshatraIndex, 20);
assert.ok(up.pada >= 1 && up.pada <= 4);
// wraps
assert.deepEqual(nakshatraPada(360), { nakshatraIndex: 0, pada: 1 });

// ── suggestNames ───────────────────────────────────────────────────
const r = suggestNames({ nakshatraIndex: 0, pada: 2, gender: 'both' });
assert.equal(r.nakshatra, 'அஸ்வினி');
assert.equal(r.pada, 2);
assert.equal(r.syllable, 'ச');
assert.equal(r.count, r.names.length);
assert.ok(r.count > 0, 'ச has names');
assert.ok(r.names.every((n) => n.name.startsWith('ச') || n.name.includes('ச')));
assert.ok(r.names.some((n) => n.gender === 'boy') && r.names.some((n) => n.gender === 'girl'));

// gender filter
const boys = suggestNames({ nakshatraIndex: 0, pada: 2, gender: 'boy' });
assert.ok(boys.names.every((n) => n.gender === 'boy'));
assert.ok(boys.count < r.count);

// search filter
const s = suggestNames({ nakshatraIndex: 0, pada: 2, gender: 'both', search: 'சர' });
assert.ok(s.count >= 1 && s.names.every((n) => n.name.includes('சர')));

// a syllable with no bank entry returns an empty, well-formed result
const empty = suggestNames({ nakshatraIndex: 5, pada: 4, gender: 'both' }); // 'ஓ'
assert.equal(empty.count, 0);
assert.deepEqual(empty.names, []);
assert.ok(empty.syllable);

// clamping
const clamp = suggestNames({ nakshatraIndex: 99, pada: 9, gender: 'x' });
assert.equal(clamp.nakshatraIndex, 26);
assert.equal(clamp.pada, 4);

// ── name bank integrity ────────────────────────────────────────────
for (const [syl, v] of Object.entries(BABY_NAMES)) {
  assert.ok(Array.isArray(v.boy) && Array.isArray(v.girl), `${syl} shape`);
  assert.ok(v.boy.length + v.girl.length > 0, `${syl} non-empty`);
}

console.log(JSON.stringify({
  pass: true,
  syllableKeys: Object.keys(BABY_NAMES).length,
  totalNames: Object.values(BABY_NAMES).reduce((a, v) => a + v.boy.length + v.girl.length, 0),
  ashwiniP2: r.syllable,
  ashwiniP2Count: r.count,
}, null, 2));
