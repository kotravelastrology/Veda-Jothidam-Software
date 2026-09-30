const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const S = require('./src/report/saturnTransit');
const T = require('./src/report/saturnTransitTables');
const { resolveByTitle } = require('./src/sources/registry');
const { assertRuleEvidence } = require('./src/contracts/ruleEvidence');

const { DAY_MS, YEAR_MS } = S;
const utc = (y, m, d, h = 0) => Date.UTC(y, m - 1, d, h);
const range = (n) => Array.from({ length: n }, (_, i) => i);
const FIXTURE = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/saturn-transit/definitions.json'), 'utf8'));

// ---------------------------------------------------------------- doctrine --
// The embedded tables must say what the transcription record says. The record
// was made from the page images; the tables are what the engine runs on.

assert.deepEqual(T.DEFINITIONS.SADE_SATI.houses, FIXTURE.conditions.SADE_SATI.houses);
assert.deepEqual(T.DEFINITIONS.ARDHASHTAMA.houses, FIXTURE.conditions.ARDHASHTAMA.houses);
assert.deepEqual(T.DEFINITIONS.ASHTAMA.houses, FIXTURE.conditions.ASHTAMA.houses);
assert.deepEqual(T.DEFINITIONS.SADE_SATI.houses, [12, 1, 2]);

for (const id of ['PARASHARAS_LIGHT', 'VISHNU_BHASKAR', 'PULIPPANI', 'RATH']) {
  assert.deepEqual(T.KANTAKA_CONVENTIONS[id].houses, FIXTURE.kantaka[id].houses, `Kantaka houses for ${id}`);
}
assert.equal(T.DEFAULT_KANTAKA, FIXTURE.kantaka.default);

// The default is justified by a count, and the count is checked rather than
// asserted in prose: 4 and 7 are the only houses named by at least three of
// the four sources, which is exactly the default.
const named = {};
for (const c of Object.values(T.KANTAKA_CONVENTIONS)) for (const h of c.houses) named[h] = (named[h] ?? 0) + 1;
const byThree = Object.keys(named).map(Number).filter((h) => named[h] >= 3).sort((a, b) => a - b);
assert.deepEqual(byThree, T.KANTAKA_CONVENTIONS[T.DEFAULT_KANTAKA].houses);
assert.deepEqual(named, { 4: 3, 7: 3, 8: 2, 10: 2, 1: 1 });

for (const [house, ph] of Object.entries(FIXTURE.sadeSatiPhases)) {
  assert.equal(T.SADE_SATI_PHASES[house].phase, ph.phase);
  assert.deepEqual([...T.SADE_SATI_PHASES[house].book.aspects], ph.aspects);
}
assert.deepEqual(T.ARISHTA_BY_MOON_SIGN.map((r) => r.printed), FIXTURE.arishtaBySign.map((r) => r.printed));
assert.equal(T.ARISHTA_BY_MOON_SIGN.length, 12);
assert.equal(T.NOMINAL_DURATION.cycleMonths, FIXTURE.nominalDuration.cycleMonths);
assert.equal(T.NOMINAL_DURATION.dhaiyaMonths * 3, T.NOMINAL_DURATION.cycleMonths);

// The arishta reading: every phase named is a real phase, "especially" is a
// subset of "phases", and exactly the five rows we flagged as ambiguous are the
// ones with a second clause in print.
for (const row of T.ARISHTA_BY_MOON_SIGN) {
  for (const p of [...row.phases, ...row.especially]) assert.ok(S.PHASE_ORDER.includes(p));
  for (const p of row.especially) assert.ok(row.phases.includes(p), `sign ${row.rasi}: especially ⊆ phases`);
  assert.equal(row.readingUncertain, /–/.test(row.printed) && /bad/.test(row.printed),
    `sign ${row.rasi}: readingUncertain marks the printed second clause`);
}
assert.equal(T.ARISHTA_BY_MOON_SIGN.filter((r) => r.readingUncertain).length, 5);

// Tables cannot be edited at run time.
assert.throws(() => { T.DEFINITIONS.SADE_SATI.houses.push(3); }, TypeError);
assert.ok(Object.isFrozen(T.KANTAKA_CONVENTIONS.RATH.houses) && Object.isFrozen(T.KANTAKA_CONVENTIONS.RATH));

// Every source a page shows resolves to a registered one, with its rights stated.
for (const src of Object.values(T.SOURCES)) {
  const reg = resolveByTitle(src.title);
  assert.ok(reg, `${src.title} is registered`);
  assert.equal(reg.rights.status, 'RESTRICTED', `${src.title} is cite-only`);
  assert.ok(!reg.rights.mayShip);
}

// -------------------------------------------------------------- arithmetic --
assert.equal(S.houseFromMoon(0, 0), 1);
assert.equal(S.houseFromMoon(1, 0), 2);
assert.equal(S.houseFromMoon(11, 0), 12);
assert.equal(S.houseFromMoon(0, 11), 2, 'Aries is the 2nd from Pisces');
assert.equal(S.houseFromMoon(8, 9), 12, 'Sagittarius is the 12th from Capricorn');
for (const moon of range(12)) {
  assert.deepEqual(
    range(12).map((r) => S.houseFromMoon(r, moon)).sort((a, b) => a - b),
    range(12).map((i) => i + 1), 'a permutation of 1..12',
  );
}

// ---------------------------------------------------------------- astronomy --
// Independent check: ask the ephemeris where Saturn is at each boundary the
// scanner reports. The scanner found it by bisection on the sign; this asks a
// different question — is Saturn actually at a multiple of 30° there?

const WINDOW = { fromMs: utc(1900, 1, 1), toMs: utc(2025, 1, 1) };
const stays = S.saturnStays(WINDOW);

assert.equal(stays[0].enterMs, WINDOW.fromMs);
assert.equal(stays[stays.length - 1].exitMs, WINDOW.toMs);
for (let i = 1; i < stays.length; i += 1) {
  assert.equal(stays[i].enterMs, stays[i - 1].exitMs, 'stays are contiguous');
  assert.notEqual(stays[i].rasiIndex, stays[i - 1].rasiIndex);
  const step = (stays[i].rasiIndex - stays[i - 1].rasiIndex + 12) % 12;
  assert.ok(step === 1 || step === 11, 'a sign change is to a neighbouring sign');
  assert.equal(stays[i].enteredBy, step === 1 ? 'DIRECT' : 'RETROGRADE');

  const at = stays[i].enterMs;
  const lon = S.saturnLongitude(at);
  const offBoundary = Math.min(lon % 30, 30 - (lon % 30));
  assert.ok(offBoundary < 1e-3, `Saturn is ${offBoundary.toFixed(6)}° from a sign boundary at ${new Date(at).toISOString()}`);
  assert.notEqual(S.saturnRasi(at - 60000), S.saturnRasi(at + 60000), 'the sign differs either side of the boundary');
  assert.equal(S.saturnRasi(at + 60000), stays[i].rasiIndex);
  assert.equal(S.saturnRasi(at - 60000), stays[i - 1].rasiIndex);
}

// Two step sizes find the same stays: the half-day step loses nothing.
const coarse = S.saturnStays({ fromMs: utc(1930, 1, 1), toMs: utc(1990, 1, 1), stepDays: 0.5 });
const fine = S.saturnStays({ fromMs: utc(1930, 1, 1), toMs: utc(1990, 1, 1), stepDays: 0.125 });
assert.equal(coarse.length, fine.length, 'a finer step finds no extra stay');
coarse.forEach((s, i) => {
  assert.equal(s.rasiIndex, fine[i].rasiIndex);
  assert.ok(Math.abs(s.enterMs - fine[i].enterMs) < 60000, 'boundary times agree to a minute');
});

// Saturn really does turn retrograde across boundaries: this is why a span can
// have more stays than signs.
assert.ok(stays.some((s) => s.enteredBy === 'RETROGRADE'), 'retrograde re-entries exist in 125 years');
const retroCount = stays.filter((s) => s.enteredBy === 'RETROGRADE').length;

// The ayanamsha argument is honoured. (solarReturns.js once passed a misspelt
// key to the ephemeris, so the choice was silently ignored and every crossing
// was found under Lahiri. That is asserted here for Saturn, and for the Sun in
// test-solar-returns.js.)
const lah = S.saturnLongitude(utc(2024, 1, 1), 'Lahiri');
const ram = S.saturnLongitude(utc(2024, 1, 1), 'Raman');
assert.ok(ram - lah > 1.0 && ram - lah < 2.0, `Raman is about 1.4° past Lahiri, got ${(ram - lah).toFixed(3)}`);
const raman = S.saturnStays({ fromMs: utc(2015, 1, 1), toMs: utc(2030, 1, 1), ayanamsha: 'Raman' });
const lahiri = S.saturnStays({ fromMs: utc(2015, 1, 1), toMs: utc(2030, 1, 1), ayanamsha: 'Lahiri' });
const shift = Math.abs(raman.find((s) => s.rasiIndex === 11 && s.enteredBy === 'DIRECT').enterMs
  - lahiri.find((s) => s.rasiIndex === 11 && s.enteredBy === 'DIRECT').enterMs) / DAY_MS;
assert.ok(shift > 7 && shift < 30, `1.4° at about 0.1° a day is about two weeks; the Pisces ingress moves by ${shift.toFixed(0)} days between ayanamshas`);
assert.throws(() => S.saturnLongitude(utc(2024, 1, 1), 'NotAnAyanamsha'), RangeError);

// ------------------------------------------------- what a real chart shows --
// Capricorn Moon (rasi 9): Saturn entered Sagittarius (the 12th) on 26 Jan 2017
// and left Aquarius (the 2nd) on 29 Mar 2025. These two dates are the widely
// reported Lahiri ingresses; they are NOT from a source we hold, so they are a
// sanity check on the ephemeris and not part of the sourcing. Within a day.
const capBirth = utc(2000, 1, 1);
const cap = S.computeSaturnTransits({ moonRasiIndex: 9, birthMs: capBirth, atMs: utc(2019, 6, 1), horizonYears: 100 });
const c1 = cap.sadeSati[0];
assert.equal(c1.ordinal, 1);
assert.equal(c1.inProgressAtBirth, false, 'born in 2000, Saturn was in Aries/Taurus');
assert.ok(Math.abs(Date.parse(c1.fromUtc) - utc(2017, 1, 26)) < 1.5 * DAY_MS, `starts ${c1.fromUtc}`);
assert.ok(Math.abs(Date.parse(c1.toUtc) - utc(2025, 3, 29)) < 1.5 * DAY_MS, `ends ${c1.toUtc}`);

// Mid-2019: Saturn was in Sagittarius, the 12th from a Capricorn Moon, so the
// first phase.
assert.equal(cap.now.houseFromMoon, 12);
assert.deepEqual(cap.now.conditions.map((c) => c.id), ['SADE_SATI']);
assert.equal(cap.now.conditions[0].phase, 'RISING');
assert.equal(cap.activeSadeSati.ordinal, 1);

// All twelve Moon signs, a century each. The span is not 7½ years: Saturn's
// orbit is eccentric and it is slowest through Scorpio-Sagittarius-Capricorn, so
// the measured range is 6.4 to 8.9 years depending on the Moon sign, and the next
// cycle starts 20.9 to 22.8 years after the last ends. Bounds below are that
// measurement with a margin, so a solver regression is caught but the real
// spread is not mistaken for one.
let spans = 0;
let maxRetro = 0;
const spanYears = [];
for (const moon of range(12)) {
  const r = S.computeSaturnTransits({ moonRasiIndex: moon, birthMs: utc(1950, 1, 1), atMs: utc(2026, 9, 30), horizonYears: 110 });
  assert.ok(r.sadeSati.length >= 3 && r.sadeSati.length <= 5, `sign ${moon}: ${r.sadeSati.length} cycles in a lifetime`);
  r.sadeSati.forEach((c, i) => {
    spans += 1;
    if (!c.openEnd) {
      assert.ok(c.years > 6.2 && c.years < 9.1, `sign ${moon} cycle ${c.ordinal}: ${c.years} years`);
      spanYears.push(c.years);
    }
    maxRetro = Math.max(maxRetro, c.retrogradeReturns);
    // Every day of a span is either in one of the three houses or in a
    // retrograde dip out of them, and the two add up to the span.
    if (!c.openEnd && !c.openStart) {
      const total = Object.values(c.daysByHouse).reduce((a, b) => a + b, 0);
      assert.ok(c.daysOutsideHouses >= 0 && c.daysOutsideHouses < 730, `sign ${moon}: ${c.daysOutsideHouses} dip days`);
      assert.ok(Math.abs((total + c.daysOutsideHouses) / 365.25 - c.years) < 0.02,
        `sign ${moon}: ${total} + ${c.daysOutsideHouses} dip days vs ${c.years} years`);
      assert.deepEqual(Object.keys(c.daysByHouse).map(Number).sort((a, b) => a - b), [1, 2, 12]);
    }
    if (i > 0) {
      const gap = (Date.parse(c.fromUtc) - Date.parse(r.sadeSati[i - 1].toUtc)) / YEAR_MS;
      assert.ok(gap > 20.5 && gap < 23, `sign ${moon}: ${gap.toFixed(1)} years between cycles`);
    }
  });
}
assert.ok(spans > 40);
const meanYears = spanYears.reduce((a, b) => a + b, 0) / spanYears.length;
assert.ok(meanYears > 7.3 && meanYears < 8.2, `mean ${meanYears.toFixed(2)} years`);
assert.ok(Math.max(...spanYears) - Math.min(...spanYears) > 1.5, 'the spread across Moon signs is real, not noise');
assert.ok(maxRetro >= 2, 'some cycles are crossed back over more than once');

// The stated 90 months is nominal; the sky gives about 98 — and the result
// carries both, so the difference is visible rather than silent.
assert.equal(cap.nominal.cycleMonths, 90);
assert.ok(c1.years * 12 > 90 && c1.years * 12 < 104, `actual ${(c1.years * 12).toFixed(0)} months`);

// ------------------------------------------------------ cycle numbering ----
// Born inside a cycle: that cycle is the first, flagged as in progress.
const inside = S.computeSaturnTransits({ moonRasiIndex: 9, birthMs: utc(1990, 5, 15, 5), atMs: utc(2026, 9, 30) });
assert.equal(inside.sadeSati[0].inProgressAtBirth, true);
assert.equal(inside.sadeSati[0].ordinal, 1);
assert.ok(Date.parse(inside.sadeSati[0].fromUtc) < utc(1990, 5, 15, 5));
assert.equal(inside.saturnAtBirth.houseFromMoon, 1);
assert.equal(inside.saturnAtBirth.conditions[0].phase, 'PEAK');
assert.equal(inside.sadeSati[1].ordinal, 2);
assert.equal(inside.sadeSati[1].inProgressAtBirth, false);
// A cycle that ended before birth is not the native's.
assert.ok(inside.sadeSati.every((c) => Date.parse(c.toUtc) > utc(1990, 5, 15, 5)));
// Ordinals run 1, 2, 3 and only 1-3 have the book's description.
assert.deepEqual(inside.sadeSati.map((c) => c.ordinal), range(inside.sadeSati.length).map((i) => i + 1));
assert.ok(inside.sadeSati[0].book && inside.sadeSati[1].book && inside.sadeSati[2].book);
assert.equal(inside.sadeSati[3].book, null, 'the book characterises three cycles, not four');
// Vishnu Bhaskar's arishta reading for this Moon sign is carried on each cycle.
assert.equal(inside.sadeSati[0].arishtaPhases.join(), T.ARISHTA_BY_MOON_SIGN[9].phases.join());
assert.deepEqual(inside.sadeSati[0].arishtaEspecially, ['RISING']);
assert.equal(inside.sadeSati[0].arishtaReadingUncertain, true);
assert.equal(inside.now.houseFromMoon, 3, 'Saturn is in Pisces now, the 3rd from Capricorn');
assert.deepEqual(inside.now.conditions, [], 'nothing active in the 3rd — favourable, in the books');
assert.equal(inside.activeSadeSati, null);
assert.equal(inside.nextSadeSati.ordinal, 3);

// ------------------------------------------------------------ named states --
// saturnStateAt reads Saturn from the sky; to test the naming we pick instants
// when Saturn is in a known sign, then check what each convention calls it.
const instantIn = (rasi) => stays.find((s) => s.rasiIndex === rasi && s.exitMs - s.enterMs > 300 * DAY_MS && s.enterMs > utc(1990, 1, 1)).enterMs + 200 * DAY_MS;
const names = (moonRasi, saturnRasiIdx, conv) => S.saturnStateAt({
  moonRasiIndex: moonRasi, atMs: instantIn(saturnRasiIdx), kantakaConvention: conv,
}).conditions.map((c) => (c.phase ? `${c.id}:${c.phase}` : c.id));

// Moon in Aries: house h from Moon = Saturn in rasi h-1.
assert.deepEqual(names(0, 11), ['SADE_SATI:RISING'], '12th');
assert.deepEqual(names(0, 0), ['SADE_SATI:PEAK'], '1st');
assert.deepEqual(names(0, 1), ['SADE_SATI:SETTING'], '2nd');
assert.deepEqual(names(0, 2), [], '3rd is neither');
assert.deepEqual(names(0, 3), ['ARDHASHTAMA', 'KANTAKA'], '4th is both, by default');
assert.deepEqual(names(0, 6), ['KANTAKA'], '7th');
assert.deepEqual(names(0, 7), ['ASHTAMA'], '8th is Ashtama, not Kantaka, by default');
assert.deepEqual(names(0, 9), [], '10th is not Kantaka by default');
// The conventions really do change the answer, and only where the books differ.
assert.deepEqual(names(0, 7, 'PULIPPANI'), ['ASHTAMA', 'KANTAKA'], 'Pulippani calls the 8th Kantaka too');
assert.deepEqual(names(0, 9, 'VISHNU_BHASKAR'), ['KANTAKA'], 'Vishnu Bhaskar adds the 10th');
assert.deepEqual(names(0, 0, 'RATH'), ['SADE_SATI:PEAK', 'KANTAKA'], 'Rath counts the 1st');
assert.deepEqual(names(0, 3, 'RATH'), ['ARDHASHTAMA'], 'Rath does not count the 4th');
assert.throws(() => names(0, 3, 'MADE_UP'), /unknown Kantaka convention/);

// Kantaka periods for a convention are exactly the union of their houses' stays.
const birth = utc(1985, 3, 3);
for (const id of Object.keys(T.KANTAKA_CONVENTIONS)) {
  const r = S.computeSaturnTransits({ moonRasiIndex: 4, birthMs: birth, atMs: utc(2026, 9, 30), kantakaConvention: id });
  assert.equal(r.kantaka.convention, id);
  assert.deepEqual(r.kantaka.houses, T.KANTAKA_CONVENTIONS[id].houses);
  const days = r.kantaka.periods.reduce((a, p) => a + p.stays.reduce((b, s) => b + s.days, 0), 0);
  const expected = S.saturnStays({ fromMs: birth - 10 * YEAR_MS, toMs: birth + 100 * YEAR_MS })
    .filter((s) => T.KANTAKA_CONVENTIONS[id].houses.includes(S.houseFromMoon(s.rasiIndex, 4)))
    .filter((s) => s.exitMs > birth)
    .reduce((a, s) => a + (s.exitMs - s.enterMs) / DAY_MS, 0);
  assert.ok(Math.abs(days - expected) < 1, `${id}: ${days.toFixed(1)} days vs ${expected.toFixed(1)}`);
}

// ----------------------------------------------------------------- evidence --
const ev = cap.evidence;
assert.equal(ev.length, 4);
for (const e of ev) {
  assertRuleEvidence(e);
  assert.equal(e.status, 'APPLIED');
  assert.ok(e.source.pageLocus && e.source.convention && e.source.file);
  assert.ok(resolveByTitle(e.source.title), `${e.ruleId} cites a registered source`);
}
assert.ok(ev.find((e) => e.ruleId === 'SATURN_TRANSIT_KANTAKA').name.includes('Parashara'));
const evVb = S.computeSaturnTransits({
  moonRasiIndex: 9, birthMs: capBirth, atMs: utc(2019, 6, 1), kantakaConvention: 'VISHNU_BHASKAR',
}).evidence.find((e) => e.ruleId === 'SATURN_TRANSIT_KANTAKA');
assert.ok(evVb.name.includes('Vishnu Bhaskar') && /4, 7, 10/.test(evVb.source.convention));
// The evidence says what is true *now*: Sade Sati is active in mid-2019 for Capricorn.
assert.equal(ev.find((e) => e.ruleId === 'SATURN_TRANSIT_SADE_SATI').outcome.active, true);
assert.equal(ev.find((e) => e.ruleId === 'SATURN_TRANSIT_ASHTAMA').outcome.active, false);

// The result discloses its own conventions, including the one it did not apply.
assert.equal(cap.conventions.kantakaUsed, 'PARASHARAS_LIGHT');
assert.equal(cap.conventions.kantakaAvailable.length, 4);
assert.ok(cap.conventions.kantakaAvailable.every((c) => c.sourcePage && c.note));
assert.equal(cap.conventions.notImplemented[0].id, 'SHUBHAKARAN_DEGREE_BASED');
assert.equal(cap.conventions.signBased, true);
assert.equal(cap.remedies.length, 3);
assert.ok(cap.remedies.every((r) => r.sourcePage && r.appliesTo.length));
// Remedies are recorded practices, not computed: none is derived from the chart.
assert.ok(!cap.remedies.some((r) => 'score' in r || 'recommended' in r));

// ------------------------------------------------------------- validation ---
assert.throws(() => S.computeSaturnTransits({ moonRasiIndex: 12, birthMs: birth }), /0-11/);
assert.throws(() => S.computeSaturnTransits({ moonRasiIndex: -1, birthMs: birth }), /0-11/);
assert.throws(() => S.computeSaturnTransits({ moonRasiIndex: 1.5, birthMs: birth }), /0-11/);
assert.throws(() => S.computeSaturnTransits({ moonRasiIndex: 3, birthMs: NaN }), /birthMs/);
assert.throws(() => S.computeSaturnTransits({ moonRasiIndex: 3, birthMs: birth, horizonYears: 500 }), /horizonYears/);
assert.throws(() => S.saturnStays({ fromMs: 5, toMs: 3 }), /toMs after fromMs/);
assert.throws(() => S.saturnStays({ fromMs: utc(1800, 1, 1), toMs: utc(2100, 1, 1) }), /130 years/);

// Deterministic: the same question twice gives the same answer.
const again = S.computeSaturnTransits({ moonRasiIndex: 9, birthMs: capBirth, atMs: utc(2019, 6, 1), horizonYears: 100 });
assert.deepEqual(JSON.parse(JSON.stringify(again)), JSON.parse(JSON.stringify(cap)));

console.log(JSON.stringify({
  pass: true,
  stays125y: stays.length,
  retrogradeReEntries125y: retroCount,
  capricornSadeSati: [c1.fromUtc.slice(0, 10), c1.toUtc.slice(0, 10), `${c1.years} years`],
  cyclesChecked: spans,
  kantakaDefault: T.DEFAULT_KANTAKA,
  housesNamedByThreeSources: byThree,
}, null, 2));
