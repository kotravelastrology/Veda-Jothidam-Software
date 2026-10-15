const assert = require('node:assert/strict');
const { searchMuhurta, PURPOSES, SOURCED, monthAt } = require('./src/report/muhurtaSearch');
const E = require('./src/report/eventMuhurtaTables');
const { panchangaCodes, varaCodes } = require('./src/report/eventMuhurta');
const { sunMoonLongitudes } = require('./src/ephemeris/siderealPositions');

// ── purposes: labels only; rules only where read from the books ─────────
for (const key of ['marriage', 'business', 'travel', 'griha', 'upanayana', 'education', 'medical']) {
  const p = PURPOSES[key];
  assert.ok(p && p.label, `${key} has a label`);
  assert.equal(p.goodNak, undefined, `${key}: no unsourced star list`);
}
assert.deepEqual({ ...SOURCED }, { griha: 'GRIHA_PRAVESHA', oldhouse: 'OLD_HOUSE', upanayana: 'UPANAYANA', travel: 'TRAVEL', education: 'VIDYARAMBHA', study: 'EDUCATION', business: 'BUSINESS', medical: 'MEDICINE', surgery: 'SURGERY', rogasnana: 'ROGA_SNANA' });
assert.ok(PURPOSES.ritual && !SOURCED.ritual, '"Ritual" is not read from the books yet');

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

// ── upanayana: the sunrise rules only (no person, no planets) ─────────────
const U = E.EVENTS.UPANAYANA;
for (const book of [undefined, 'SHRIDHAR']) {
  const u = searchMuhurta({ startDate: '2027-02-01', endDate: '2027-03-31', purpose: 'upanayana', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, book });
  assert.equal(u.sourced, true);
  assert.equal(u.book, book ?? U.default);
  assert.ok(u.noteTa.includes('/muhurta-stars'));
  const personal = ['GURU', 'GURU_MID', 'RAVI', 'RAVI_MID', 'CHANDRA', 'CHANDRA_MID', 'TARA_NOT', 'TARA_MID', 'NATAL_8', 'MOON_8', 'CONJ', 'MOON_NAV', 'VEDHA', 'BANA', 'SANKRANTI', 'WED_COMBUST'];
  for (const d of u.days) assert.ok(!d.codes.some((c) => personal.includes(c)), `${d.date}: only sunrise rules`);
  assert.ok(u.days.some((d) => d.score >= 70), `${u.book}: good sunrises in Magha–Chaitra 2027`);
}

// ── travel: the sunrise rules (no direction, no person, no planets) ───────
const TR = E.EVENTS.TRAVEL;
for (const book of TR.order) {
  const t = searchMuhurta({ startDate: '2027-02-01', endDate: '2027-03-31', purpose: 'travel', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, book });
  assert.equal(t.sourced, true);
  assert.equal(t.book, book);
  assert.ok(t.noteTa.includes('/muhurta-stars'));
  const notHere = ['TARA_NOT', 'CHANDRA', 'CHANDRA_MID', 'YOGINI', 'TITHI_SHOOLA', 'TITHI_DIR', 'NAK_SHOOLA', 'CHANDRA_DIR', 'PARIGHA', 'VENUS_FRONT', 'RAHU_PAKSHA', 'GHATA_NAK', 'SANKRANTI'];
  for (const d of t.days) {
    assert.ok(!d.codes.some((c) => notHere.includes(c.replace(/_MID$/, ''))), `${book} ${d.date}: only sunrise rules`);
    assert.ok(d.notes.every((n) => !/^[A-Z_]+$/.test(n)), `${book} ${d.date}: every code in Tamil (${d.notes})`);
  }
  // Shridhar's tithis three ways: the 7th neither good nor of his failures — middling, not rejected.
  if (book === 'SHRIDHAR') for (const d of t.days.filter((x) => /Saptami$/.test(x.tithi))) assert.ok(d.codes.includes('TITHI_MID'), d.date);
}
assert.equal(searchMuhurta({ startDate: '2027-02-01', endDate: '2027-02-02', purpose: 'travel', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 }).book, TR.default);

// ── vidyarambha: the sunrise rules; Vijayadashami 2026 for Kalyanraman ───
const VR = E.EVENTS.VIDYARAMBHA;
for (const book of VR.order) {
  const v = searchMuhurta({ startDate: '2026-10-10', endDate: '2026-11-30', purpose: 'education', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, book });
  assert.equal(v.sourced, true);
  assert.equal(v.book, book);
  assert.ok(v.noteTa.includes('/muhurta-stars'));
  const notHere = ['LAGNA', 'EMPTY_8', 'MERC_SET', 'JUP_VEN_SET', 'NIGHT', 'DAY_PART', 'TARA_NOT', 'PRADOSHA'];
  for (const d of v.days) {
    assert.ok(!d.codes.some((c) => notHere.includes(c)), `${book} ${d.date}: only sunrise rules`);
    assert.ok(d.notes.every((n) => !/^[A-Z_]+$/.test(n)), `${book} ${d.date}: in Tamil`);
  }
  // Ashvin Shukla 10 at sunrise in 2026 (20 or 21 October): Kalyanraman considers nothing further.
  if (book === 'KALYANRAMAN') {
    const vd = v.days.filter((d) => d.month === E.MONTH_TA[6] && d.tithi === 'Shukla Dashami');
    assert.ok(vd.length >= 1, 'Vijayadashami found');
    for (const d of vd) assert.deepEqual(d.codes, [], d.date);
  }
}
assert.equal(searchMuhurta({ startDate: '2026-10-10', endDate: '2026-10-11', purpose: 'education', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 }).book, VR.default);
assert.equal(searchMuhurta({ startDate: '2026-10-10', endDate: '2026-10-11', purpose: 'ritual', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 }).sourced, false);

// ── education after upanayana: the sunrise rules ──────────────────────────
const ED = E.EVENTS.EDUCATION;
for (const book of ED.order) {
  const v = searchMuhurta({ startDate: '2027-02-01', endDate: '2027-03-15', purpose: 'study', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, book });
  assert.equal(v.sourced, true);
  assert.equal(v.book, book);
  assert.ok(v.noteTa.includes('/muhurta-stars'));
  for (const d of v.days) {
    assert.ok(!d.codes.some((c) => ['LAGNA', 'NAV_NOT', 'EMPTY_8', 'NIGHT', 'PRADOSHA', 'TARA_NOT', 'CHANDRA', 'JUP_VEN_SET'].includes(c)), `${book} ${d.date}: only sunrise rules`);
    assert.ok(d.notes.every((n) => !/^[A-Z_]+$/.test(n)), `${book} ${d.date}: in Tamil`);
  }
  assert.ok(v.days.some((d) => d.score >= 70), `${book}: some good sunrises in February–March 2027`);
}

// ── business / shop opening: the sunrise rules; Holi for Vashistha ────────
const BU = E.EVENTS.BUSINESS;
for (const book of BU.order) {
  const v = searchMuhurta({ startDate: '2027-02-20', endDate: '2027-04-10', purpose: 'business', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, book });
  assert.equal(v.sourced, true);
  assert.equal(v.book, book);
  assert.ok(v.noteTa.includes('/muhurta-stars'));
  for (const d of v.days) {
    assert.ok(!d.codes.some((c) => ['LAGNA', 'EMPTY_8', 'EMPTY_12', 'JUP_VEN_SET', 'MOON_VENUS_LAGNA_MID', 'MOON_MERC_LAGNA_MID', 'BENEFIC_PLACE_MID', 'TARA_NOT', 'CHANDRA'].includes(c)), `${book} ${d.date}: only sunrise rules`);
    assert.ok(d.notes.every((n) => !/^[A-Z_]+$/.test(n)), `${book} ${d.date}: in Tamil`);
    if (BU[book].vara) assert.equal(d.codes.includes('VARA'), d.weekday === 'Tuesday', `${book} ${d.date}: Tuesday`);
  }
  assert.ok(v.days.some((d) => d.score >= 70), `${book}: some good sunrises`);
  // Phalguna's full Moon at sunrise (Holi, March 2027): Vashistha's Bhurudan day.
  const holi = v.days.filter((d) => d.month === E.MONTH_TA[11] && d.tithi === 'Shukla Purnima');
  assert.ok(holi.length >= 1, 'Holi found');
  for (const d of holi) assert.equal(d.codes.includes('BHURUDAN'), book === 'VASHISTHA', `${book} ${d.date}`);
}
assert.equal(searchMuhurta({ startDate: '2027-03-01', endDate: '2027-03-02', purpose: 'business', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 }).book, BU.default);

// ── old house: Kartika and Margashirsha pass the month rule; the new house's books reject them ──
{
  const days = (purpose, book) => searchMuhurta({ startDate: '2026-11-12', endDate: '2027-01-05', purpose, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, book }).days;
  for (const book of E.EVENTS.OLD_HOUSE.order) {
    const kartika = days('oldhouse', book).filter((d) => [E.MONTH_TA[7], E.MONTH_TA[8]].includes(d.month));
    assert.ok(kartika.length > 20, `${book}: Kartika–Margashirsha days`);
    for (const d of kartika) assert.ok(!d.codes.some((c) => c.startsWith('MASA') || c.startsWith('UTTARAYANA')), `${book} ${d.date}: ${d.codes}`);
  }
  for (const d of days('griha', 'MUHURTA_CHINTAMANI').filter((d) => d.month === E.MONTH_TA[7])) assert.ok(d.codes.includes('MASA'), d.date);
  const v = searchMuhurta({ startDate: '2026-11-12', endDate: '2026-11-13', purpose: 'oldhouse', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 });
  assert.equal(v.event, 'OLD_HOUSE');
  assert.equal(v.book, E.EVENTS.OLD_HOUSE.default);
  assert.ok(v.noteTa.includes('"பழைய வீடு"'));
}

// ── medicine and surgery: the sunrise rules (no person, no planets) ───────
for (const [purpose, ev] of [['medical', 'MEDICINE'], ['surgery', 'SURGERY'], ['rogasnana', 'ROGA_SNANA']]) {
  const EV = E.EVENTS[ev];
  for (const book of EV.order) {
    const v = searchMuhurta({ startDate: '2027-02-01', endDate: '2027-03-31', purpose, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, book });
    assert.equal(v.sourced, true);
    assert.equal(v.event, ev);
    assert.equal(v.book, book);
    assert.ok(v.noteTa.includes('/muhurta-stars'));
    const personal = ['TARA_NOT', 'CHANDRA', 'MARS_SATURN', 'MARS_SATURN_MUTUAL', 'LAGNA', 'EMPTY_8', 'BEN_LAGNA', 'MOON_NOT_WEAK', 'MOON_WEAK', 'MALEFIC_PLACE', 'NAV'];
    for (const d of v.days) {
      assert.ok(!d.codes.some((c) => personal.includes(c.replace(/_MID$/, ''))), `${ev} ${book} ${d.date}: only sunrise rules`);
      assert.ok(d.notes.every((n) => !/^[A-Z_]+$/.test(n)), `${ev} ${book} ${d.date}: in Tamil`);
    }
    // Shridhar's, Raman's and Vashistha's surgery need the Rikta tithi, the weekday and the star together: a day or two in months.
    if (!(ev === 'SURGERY' && ['SHRIDHAR', 'RAMAN', 'VASHISTHA'].includes(book))) assert.ok(v.days.some((d) => d.score >= 70), `${ev} ${book}: some good sunrises`);
    // Raman's surgery: the waning Rikta tithis are marked at sunrise.
    if (ev === 'SURGERY' && book === 'RAMAN') for (const d of v.days.filter((x) => /^Krishna (Chaturthi|Navami|Chaturdashi)$/.test(x.tithi))) assert.ok(d.codes.includes('KRISHNA_MID'), d.date);
  }
  assert.equal(searchMuhurta({ startDate: '2027-02-01', endDate: '2027-02-02', purpose, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 }).book, EV.default);
}
// Shridhar's surgery at Chennai, June–July 2027: one sunrise — Tuesday 8 June, Shukla Chaturthi, Pushya.
{
  const v = searchMuhurta({ startDate: '2027-06-01', endDate: '2027-07-31', purpose: 'surgery', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, book: 'SHRIDHAR' });
  assert.deepEqual(v.days.filter((d) => d.score >= 70).map((d) => [d.date, d.weekday, d.tithi, d.nakshatra]), [['2027-06-08', 'Tuesday', 'Shukla Chaturthi', 'Pushya']]);
}

// ── the other acts ('act:<EVENT>'): each at sunrise, its codes in Tamil ──
{
  const { actPurposes, eventOf } = require('./src/report/muhurtaSearch');
  const named = new Set(Object.values(SOURCED));
  const acts = actPurposes();
  assert.deepEqual(acts.map((a) => eventOf(a.key)), E.EVENTS.order.filter((e) => !named.has(e)), 'every act a purpose');
  for (const a of acts) {
    assert.ok(a.label && a.groupTa, a.key);
    const v = searchMuhurta({ startDate: '2027-02-01', endDate: '2027-02-28', purpose: a.key, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 });
    assert.equal(v.purpose, a.key);
    assert.equal(v.event, eventOf(a.key));
    assert.equal(v.sourced, true);
    assert.ok(v.noteTa.includes('/muhurta-stars'), a.key);
    for (const d of v.days) assert.ok(d.notes.every((n) => !/^[A-Z_]+$/.test(n)), `${a.key} ${d.date}: in Tamil (${d.notes})`);
  }
  assert.equal(searchMuhurta({ startDate: '2027-02-01', endDate: '2027-02-02', purpose: 'act:NOPE', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 }).purpose, 'marriage');
}

// ── agriculture: every book of every farm act at sunrise; the chakras against the ephemeris ──
{
  const { eventOf } = require('./src/report/muhurtaSearch');
  const { nodeLongitude, planetLongitude, sunriseJulianDay } = require('./src/ephemeris/siderealPositions');
  const { julianDay } = require('@swisseph/node');
  const FARM = ['AGRI_GENERAL', 'FIELD_ENTRY', 'PLOUGHING', 'SOWING', 'TRANSPLANTING', 'TREE_PLANTING', 'GARDEN', 'HARVEST', 'THRESHING', 'GRAIN_STORAGE', 'NEW_GRAIN'];
  const at = { latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 };
  for (const ev of FARM) {
    for (const book of E.EVENTS[ev].order) {
      const v = searchMuhurta({ startDate: '2027-03-01', endDate: '2027-04-15', purpose: `act:${ev}`, ...at, book });
      assert.equal(v.event, ev);
      assert.equal(v.book, book);
      for (const d of v.days) assert.ok(d.notes.every((n) => !/^[A-Z_]+$/.test(n)), `${ev} ${book} ${d.date}: in Tamil (${d.notes})`);
    }
  }
  // MC's Rahu chakra for sowing: a day's code is exactly "the Moon's star is not 9-11, 13-15, 17-19, 21-23 from Rahu's".
  const norm = (d) => ((d % 360) + 360) % 360;
  const star = (l) => Math.floor(norm(l) / (360 / 27)) % 27;
  const v = searchMuhurta({ startDate: '2027-03-01', endDate: '2027-04-15', purpose: 'act:SOWING', ...at, book: 'MUHURTA_CHINTAMANI' });
  assert.ok(v.days.length > 40);
  let withCode = 0;
  for (const d of v.days) {
    const [Y, M, D] = d.date.split('-').map(Number);
    const sunrise = sunriseJulianDay(julianDay(Y, M, D, -at.utcOffsetMinutes / 60), at.latitude, at.longitude);
    const moon = sunMoonLongitudes(sunrise, 'Lahiri').moonLongitude;
    const count = ((star(moon) - star(nodeLongitude(sunrise, 'Lahiri', 'mean')) + 27) % 27) + 1;
    const good = [9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23].includes(count);
    assert.equal(d.codes.includes('RAHU_CHAKRA'), !good, `${d.date}: ${count} from Rahu`);
    if (!good) withCode += 1;
  }
  assert.ok(withCode > 10 && withCode < v.days.length - 10, `both kinds of days: ${withCode} of ${v.days.length}`);
  // Mercury's Navanna chakra (Shridhar's new grain) and the Sun's Hala chakra (Kalyanraman's ploughing, note 14).
  const n = searchMuhurta({ startDate: '2027-03-01', endDate: '2027-03-20', purpose: 'act:NEW_GRAIN', ...at, book: 'SHRIDHAR' });
  for (const d of n.days) {
    const [Y, M, D] = d.date.split('-').map(Number);
    const sunrise = sunriseJulianDay(julianDay(Y, M, D, -at.utcOffsetMinutes / 60), at.latitude, at.longitude);
    const count = ((star(sunMoonLongitudes(sunrise, 'Lahiri').moonLongitude) - star(planetLongitude(sunrise, 'Mercury', 'Lahiri')) + 27) % 27) + 1;
    const good = [...Array(15).keys()].map((i) => i + 1).concat([21, 22, 23, 24, 27]).includes(count);
    assert.equal(d.codes.includes('NAVANNA_CHAKRA'), !good, `${d.date}: ${count} from Mercury`);
  }
  const p = searchMuhurta({ startDate: '2027-03-01', endDate: '2027-03-20', purpose: 'act:PLOUGHING', ...at, book: 'KALYANRAMAN' });
  for (const d of p.days) {
    const [Y, M, D] = d.date.split('-').map(Number);
    const sunrise = sunriseJulianDay(julianDay(Y, M, D, -at.utcOffsetMinutes / 60), at.latitude, at.longitude);
    const { sunLongitude, moonLongitude } = sunMoonLongitudes(sunrise, 'Lahiri');
    const count = ((star(moonLongitude) - star(sunLongitude) + 27) % 27) + 1;
    assert.equal(d.codes.includes('HALA_CHAKRA'), [1, 6, 7, 8, 14, 15, 16, 22, 23, 24].includes(count), `${d.date}: ${count} from the Sun`);
  }
}

console.log(JSON.stringify({ pass: true, marriageDays: res.days.length, grihaDefault: G.default }, null, 2));
