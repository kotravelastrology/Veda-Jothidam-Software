const assert = require('node:assert/strict');
const { searchMuhurta, PURPOSES } = require('./src/report/muhurtaSearch');

// ── purpose table shape ──────────────────────────────────────────────
for (const key of ['marriage', 'business', 'travel', 'griha', 'education', 'medical']) {
  const p = PURPOSES[key];
  assert.ok(p && p.label, `${key} has a label`);
  assert.ok(Array.isArray(p.goodNak) && p.goodNak.length, `${key} goodNak`);
  assert.ok(Array.isArray(p.avoidNak), `${key} avoidNak`);
  assert.ok(Array.isArray(p.avoidTithi), `${key} avoidTithi`);
  assert.ok(Array.isArray(p.goodWeekday), `${key} goodWeekday`);
}

// ── a real scan over a fortnight (Chennai) ───────────────────────────
const res = searchMuhurta({
  startDate: '2026-09-10',
  endDate: '2026-09-24',
  purpose: 'marriage',
  latitude: 13.0827,
  longitude: 80.2707,
  utcOffsetMinutes: 330,
});
assert.equal(res.available, true);
assert.equal(res.purpose, 'marriage');
assert.equal(res.purposeLabel, PURPOSES.marriage.label);
assert.ok(res.days.length >= 14 && res.days.length <= 15, `~15 days, got ${res.days.length}`);

// every day carries real panchanga + a bounded score
for (const d of res.days) {
  assert.match(d.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(PURPOSES.marriage, 'purpose loaded');
  assert.ok(typeof d.nakshatra === 'string' && d.nakshatra.length, `${d.date} nakshatra`);
  assert.ok(/^(Shukla|Krishna) /.test(d.tithi), `${d.date} tithi paksha: ${d.tithi}`);
  assert.ok(d.score >= 0 && d.score <= 100, `${d.date} score in range`);
  assert.ok(['உத்தமம்', 'நல்லது', 'சாதாரணம்', 'தவிர்க்க'].includes(d.rating), `${d.date} rating`);
  assert.ok(Array.isArray(d.windows), `${d.date} windows array`);
}

// sorted best-first
for (let i = 1; i < res.days.length; i++) {
  assert.ok(res.days[i - 1].score >= res.days[i].score, 'sorted by score desc');
}

// a day whose Moon sits in an avoid-nakshatra must score below a plain day
const hasAvoid = res.days.find((d) => PURPOSES.marriage.avoidNak.includes(d.nakshatra));
if (hasAvoid) assert.ok(hasAvoid.score < 62, `avoid-nak day (${hasAvoid.nakshatra}) scored down`);

// unknown purpose falls back to marriage rather than throwing
const fb = searchMuhurta({
  startDate: '2026-09-10', endDate: '2026-09-12', purpose: 'zzz',
  latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330,
});
assert.equal(fb.purpose, 'marriage');

const top = res.days[0];
console.log(JSON.stringify({
  pass: true,
  scanned: res.days.length,
  topDay: top.date,
  topWeekday: top.weekday,
  topNak: top.nakshatra,
  topTithi: top.tithi,
  topScore: top.score,
  topRating: top.rating,
}, null, 2));
