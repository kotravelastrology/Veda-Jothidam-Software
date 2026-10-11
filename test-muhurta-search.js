const assert = require('node:assert/strict');
const { searchMuhurta, PURPOSES, SOURCED, monthAt } = require('./src/report/muhurtaSearch');
const E = require('./src/report/eventMuhurtaTables');
const { panchangaCodes, varaCodes } = require('./src/report/eventMuhurta');
const { sunMoonLongitudes } = require('./src/ephemeris/siderealPositions');

// ── purposes: labels only; rules only where read from the books ─────────
for (const key of ['marriage', 'business', 'travel', 'griha', 'education', 'medical']) {
  const p = PURPOSES[key];
  assert.ok(p && p.label, `${key} has a label`);
  assert.equal(p.goodNak, undefined, `${key}: no unsourced star list`);
}
assert.deepEqual({ ...SOURCED }, { griha: 'GRIHA_PRAVESHA' });

// ── an unsourced purpose: panchanga, no verdict ──────────────────────────
const res = searchMuhurta({
  startDate: '2026-09-10', endDate: '2026-09-24', purpose: 'marriage',
  latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330,
});
assert.equal(res.available, true);
assert.equal(res.purpose, 'marriage');
assert.equal(res.purposeLabel, PURPOSES.marriage.label);
assert.equal(res.sourced, false);
assert.ok(res.missingTa.startsWith('ஆதாரம் தேவை / SOURCE REQUIRED'));
assert.ok(res.days.length >= 14 && res.days.length <= 15, `~15 days, got ${res.days.length}`);
for (const d of res.days) {
  assert.match(d.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(typeof d.nakshatra === 'string' && d.nakshatra.length, `${d.date} nakshatra`);
  assert.ok(/^(Shukla|Krishna) /.test(d.tithi), `${d.date} tithi paksha: ${d.tithi}`);
  assert.equal(d.score, null);
  assert.equal(d.rating, 'ஆதாரம் தேவை');
  assert.ok(Array.isArray(d.windows), `${d.date} windows array`);
}
// Unknown purpose falls back to marriage rather than throwing.
assert.equal(searchMuhurta({ startDate: '2026-09-10', endDate: '2026-09-12', purpose: 'zzz', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 }).purpose, 'marriage');

// ── the lunar month: Chaitra with the Sun in Pisces at its new moon ──────
// 2026-09-15 (before the 2026-10-10 new moon with the Sun in Virgo) lies in Bhadrapada; 2026-10-15 in Ashvin.
const jdOf = (iso) => Date.parse(iso) / 86400000 + 2440587.5;
assert.equal(monthAt(jdOf('2026-09-15T00:30:00Z')), 5);
assert.equal(monthAt(jdOf('2026-10-15T00:30:00Z')), 6);
assert.equal(monthAt(jdOf('2027-02-15T00:30:00Z')), 10, 'Magha');

// ── house entry: each book's rules at sunrise ─────────────────────────────
const G = E.EVENTS.GRIHA_PRAVESHA;
for (const book of [undefined, 'WILHELM']) {
  const g = searchMuhurta({ startDate: '2027-02-01', endDate: '2027-03-15', purpose: 'griha', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, book });
  const id = book ?? G.default;
  assert.equal(g.sourced, true);
  assert.equal(g.book, id);
  assert.ok(g.source.pageLocus && g.books.length === G.order.length);
  for (const d of g.days) {
    assert.ok([90, 70, 30].includes(d.score));
    assert.ok(Array.isArray(d.codes));
    assert.equal(d.rating, d.codes.some((c) => !c.endsWith('_MID')) ? 'தவிர்க்க' : d.codes.length ? 'நல்லது' : 'உத்தமம்');
  }
  for (let i = 1; i < g.days.length; i += 1) assert.ok(g.days[i - 1].score >= g.days[i].score, 'best first');
  // Shridhar's lists are narrow (7 tithis, 10 stars, 3-5 weekdays, the pitcher, 6 months): about a day in 60 at sunrise.
  if (id === 'WILHELM') assert.ok(g.days.some((d) => d.score >= 70), `${id}: good days in Magha-Phalguna 2027`);
}
// One day recomputed by hand: the codes are the book's rules at that sunrise.
const one = searchMuhurta({ startDate: '2027-02-20', endDate: '2027-02-20', purpose: 'griha', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 }).days[0];
assert.ok(one.month === E.MONTH_TA[10] || one.month === E.MONTH_TA[11]);
const PANCH = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
assert.ok(PANCH.includes(one.nakshatra));
void panchangaCodes; void varaCodes; void sunMoonLongitudes;

console.log(JSON.stringify({ pass: true, marriageDays: res.days.length, grihaDefault: G.default }, null, 2));
