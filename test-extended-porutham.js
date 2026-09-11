const assert = require('node:assert/strict');
const { calculateExtendedPorutham } = require('./src/report/extendedPorutham');

// ── shape ────────────────────────────────────────────────────────────
const girl = { nakshatraIndex: 3, rasiIndex: 1, moonLongitude: 33.5, sunLongitude: 20 };
const boy = { nakshatraIndex: 20, rasiIndex: 8, moonLongitude: 268.31, sunLongitude: 30.27 };
const r = calculateExtendedPorutham(girl, boy);
assert.equal(r.rows.length, 15);
assert.equal(r.total, 15);
const NAMES = [
  'ஏக தினம்', 'ராசி வர்ணம்', 'நட்சத்திர ஜாதி', 'நட்சத்திர கோத்திரம்', 'சந்திரயோக வர்க்கம்',
  'யோகினி பொருத்தம்', 'ஆய பொருத்தம்', 'விருட்ச பொருத்தம்', 'பஞ்சபட்சி பொருத்தம்', 'லிங்க பொருத்தம்',
  'விருத்தி பொருத்தம்', 'ஆயுள் பொருத்தம்', 'தசா சந்தி', 'நாடி பொருத்தம்', 'பஞ்சபூதம்',
];
assert.deepEqual(r.rows.map((x) => x.name), NAMES);
for (const row of r.rows) {
  assert.ok(['உத்தமம்', 'மத்திமம்', 'பொருந்தாதது'].includes(row.verdict), `${row.name} verdict`);
  assert.ok(row.note && row.note.length > 3, `${row.name} note`);
}
assert.equal(r.passed, r.rows.filter((x) => x.verdict === 'உத்தமம்').length);
assert.ok(['உத்தமம்', 'மத்திமம்', 'சாதாரணம்', 'குறைவு'].includes(r.level));

// ── Pancha-Pakshi bird enmity: traced by hand ──────────────────────
// girl Rohini(3) waxing -> Vulture; boy Uttara Ashadha(20) waning -> Owl
// (Śukla Cock at N20 reversed). Waning enemy table has [Vulture,Owl] ->
// enemies -> பொருந்தாதது.
const birdRow = r.rows.find((x) => x.name === 'பஞ்சபட்சி பொருத்தம்');
assert.match(birdRow.note, /வல்லூறு/);
assert.match(birdRow.note, /ஆந்தை/);
assert.equal(birdRow.verdict, 'பொருந்தாதது');

// ── same nakshatra, same rasi: many rules trivially satisfied ─────
const same = { nakshatraIndex: 5, rasiIndex: 1, moonLongitude: 65, sunLongitude: 50 };
const rs = calculateExtendedPorutham(same, same);
// நாடி and ராசி கோத்திரம் require the two to DIFFER -> fail when identical.
assert.equal(rs.rows.find((x) => x.name === 'நாடி பொருத்தம்').verdict, 'பொருந்தாதது');
assert.equal(rs.rows.find((x) => x.name === 'நட்சத்திர கோத்திரம்').verdict, 'பொருந்தாதது');
// distance-based ஆய பொருத்தம்: dist(same,same) = 27, never 24 -> passes.
assert.equal(rs.rows.find((x) => x.name === 'ஆய பொருத்தம்').verdict, 'உத்தமம்');
// யோகினி/லிங்க/பஞ்சபூதம் require sameness -> pass for identical nakshatras.
assert.equal(rs.rows.find((x) => x.name === 'யோகினி பொருத்தம்').verdict, 'உத்தமம்');
assert.equal(rs.rows.find((x) => x.name === 'லிங்க பொருத்தம்').verdict, 'உத்தமம்');
assert.equal(rs.rows.find((x) => x.name === 'பஞ்சபூதம்').verdict, 'உத்தமம்');

// ── ஆய பொருத்தம் genuinely fails at distance 24 ────────────────────
// girl nak 0, boy nak such that (boy-girl+27)%27+1 == 24 -> boy = 23.
const ayaFail = calculateExtendedPorutham(
  { nakshatraIndex: 0, rasiIndex: 0, moonLongitude: 2, sunLongitude: 1 },
  { nakshatraIndex: 23, rasiIndex: 0, moonLongitude: 306, sunLongitude: 300 },
);
assert.equal(ayaFail.rows.find((x) => x.name === 'ஆய பொருத்தம்').verdict, 'பொருந்தாதது');

console.log(JSON.stringify({
  pass: true, rows: r.rows.length, passed: r.passed, partial: r.partial, level: r.level,
}, null, 2));
