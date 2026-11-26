const assert = require('assert');
const T = require('./src/report/kpJudgeTables');
const { describeJudge } = require('./src/report/kpJudge');
const { calculateKpSystem } = require('./src/report/kpSystem');
const { evaluateKpMarriage } = require('./src/report/kpMarriage');

// five sign-keyed categories of twelve, the sign classes, the twelve houses; pages within printed 107-121
assert.deepStrictEqual(Object.keys(T.CATEGORIES), ['APPEARANCE', 'CHARACTER', 'HEALTH', 'FINANCE', 'ROMANCE']);
assert.deepStrictEqual(Object.values(T.CATEGORIES).map((c) => c.cusp), [1, 1, 6, 2, 5]);
for (const c of Object.values(T.CATEGORIES)) {
  assert.strictEqual(c.rows.length, 12);
  let last = 0;
  for (const r of c.rows) { assert.ok(r.en.length > 30 && r.ta.length > 30); assert.ok(r.page >= 107 && r.page <= 115 && r.page >= last); last = r.page; }
}
assert.strictEqual(T.CLASSES.length, 24);
assert.strictEqual(T.HOUSES.length, 12);
assert.deepStrictEqual(T.HOUSES.map((h) => h.house), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
assert.ok(T.HOUSES.every((h) => h.page >= 116 && h.page <= 121));
// spot checks against the page images
assert.ok(T.CATEGORIES.APPEARANCE.rows[0].en.startsWith('Middle stature; lean, muscular'));
assert.ok(T.CATEGORIES.HEALTH.rows[4].en.includes('sunstroke'));
assert.ok(T.CATEGORIES.FINANCE.rows[0].en.includes('start in a flash, end in a crash'));
assert.ok(T.CATEGORIES.ROMANCE.rows[6].en.startsWith('Most lovable'));
assert.ok(T.HOUSES[5].en.startsWith("'House of sickness'"));
assert.ok(T.HOUSES[7].en.includes('House of death'));

// engine on the audit chart (5 Oct 1990 04:30 Chennai)
const kp = calculateKpSystem({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, ianaTimeZone: 'Asia/Kolkata' });
const j = describeJudge(kp);
assert.strictEqual(j.readings.length, 6);
for (const r of j.readings) {
  const sub = kp.cusps.find((c) => c.number === r.cusp).sub;
  assert.strictEqual(r.subLord, sub);
  const star = kp.positions.find((p) => p.name === sub).starLord;
  assert.strictEqual(r.starLord, star);
  if (r.entry) {
    const sign = kp.positions.find((p) => p.name === star).sign;
    assert.strictEqual(r.sign, sign);
    assert.strictEqual(r.entry.en, T.CATEGORIES[r.id].rows[T.SIGNS.indexOf(sign)].en);
  } else assert.ok(['Rahu', 'Ketu'].includes(star));
}
assert.strictEqual(evaluateKpMarriage(kp).judge.available, true);
console.log('test-kp-judge ok');
