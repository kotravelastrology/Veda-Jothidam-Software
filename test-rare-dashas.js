/**
 * VJ-027 — rare dasha / Tajika method expansion.
 *
 * Acceptance: *independent worked examples; coverage labels before promotion*.
 *
 * Read literally, this criterion is a verification discipline rather than an
 * instruction to write nineteen tables. Both halves are asserted here: the
 * worked example must be independent of the engine, and no method may be
 * promoted without one.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { createCoverage, assertPromotable, LEVELS, PROMOTED_LEVEL } = require('./src/dasha/coverage');
const { createDashaTable, buildDasha, birthBalance } = require('./src/dasha/nakshatraDashaEngine');
const {
  METHODS, getMethod, getTable, promotedMethods, implementedMethods, coverageSummary,
  TRIBHAGI_TABLE, TRIBHAGI_SCALE, VIMSHOTTARI_YEARS,
} = require('./src/dasha/rareDashas');
const { buildVimshottariDasha } = require('./src/dasha/vimshottariDasha');

// ------------------------------------------------- coverage invariants --

const ok = { id: 'x', name: 'X', nameTa: 'எக்ஸ்', family: 'nakshatra' };
const src = { title: 'T', pageLocus: 'p.1' };

// VERIFIED needs both halves of the acceptance. Intending it is not enough.
assert.throws(() => createCoverage({ ...ok, level: 'VERIFIED', implemented: true, source: src }),
  /VERIFIED needs both/);
assert.throws(() => createCoverage({ ...ok, level: 'VERIFIED', implemented: true, workedExample: 'w' }),
  /VERIFIED needs both/);
assert.ok(createCoverage({ ...ok, level: 'VERIFIED', implemented: true, source: src, workedExample: 'w' }).promoted);

assert.throws(() => createCoverage({ ...ok, level: 'SOURCED', implemented: true }), /SOURCED needs a source/);
// A "source" with nothing to look up locates nothing.
assert.throws(() => createCoverage({ ...ok, level: 'SOURCED', implemented: true, source: { title: 'T' } }),
  /locates nothing/);
// STRUCTURE_ONLY carrying a source would understate what is known and hide a
// promotion that should have happened.
assert.throws(() => createCoverage({ ...ok, level: 'STRUCTURE_ONLY', implemented: true, source: src }),
  /must not carry a source/);
assert.throws(() => createCoverage({ ...ok, level: 'DECLARED', implemented: true }), /deliberately not implemented/);
assert.throws(() => createCoverage({ ...ok, level: 'STRUCTURE_ONLY', implemented: false }), /must be implemented/);
assert.throws(() => createCoverage({ ...ok, level: 'GOOD_ENOUGH', implemented: true }), /unknown coverage level/);

// The gate: below VERIFIED is refused unless the caller says otherwise, so the
// default path cannot emit an unverified method by omission.
const structureOnly = createCoverage({ ...ok, level: 'STRUCTURE_ONLY', implemented: true });
assert.throws(() => assertPromotable(structureOnly), /not VERIFIED/);
assert.doesNotThrow(() => assertPromotable(structureOnly, { allowUnverified: true }));

const declaredOnly = createCoverage({ ...ok, level: 'DECLARED', implemented: false });
assert.throws(() => assertPromotable(declaredOnly), /not VERIFIED/);
// Even with the override there is nothing to compute.
assert.throws(() => assertPromotable(declaredOnly, { allowUnverified: true }), /nothing to compute/);

assert.equal(PROMOTED_LEVEL, 'VERIFIED');
assert.deepEqual(LEVELS, ['VERIFIED', 'SOURCED', 'STRUCTURE_ONLY', 'DECLARED']);

// ------------------------------------------------- the table invariant --

// A years table that does not sum to its stated total is a transcription
// error, and this is the only automatic check available for a table nobody
// has read against a text.
assert.throws(() => createDashaTable({
  id: 'bad', cycle: ['Sun', 'Moon'], years: { Sun: 6, Moon: 10 }, totalYears: 20,
  lordOfNakshatra: () => 'Sun',
}), /sum to 16, but the system's total is 20/);

assert.throws(() => createDashaTable({
  id: 'dup', cycle: ['Sun', 'Sun'], years: { Sun: 6 }, totalYears: 12, lordOfNakshatra: () => 'Sun',
}), /appears twice/);

assert.throws(() => createDashaTable({
  id: 'stray', cycle: ['Sun'], years: { Sun: 6, Moon: 10 }, totalYears: 6, lordOfNakshatra: () => 'Sun',
}), /Moon not in the cycle/);

// A start rule that names a lord outside the cycle would silently produce a
// dasha for a planet the system does not use.
assert.throws(() => createDashaTable({
  id: 'badstart', cycle: ['Sun', 'Moon'], years: { Sun: 6, Moon: 10 }, totalYears: 16,
  lordOfNakshatra: (n) => (n === 13 ? 'Mars' : 'Sun'),
}), /nakshatra 13 maps to Mars/);

// ------------------------------- the worked example is truly independent --

const fixturePath = path.join(__dirname, 'fixtures/dashas/vimshottari-chennai-1990.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
assert.equal(fixture.status, 'INDEPENDENT_WORKED_EXAMPLE');
assert.ok(Array.isArray(fixture.derivation) && fixture.derivation.length >= 6,
  'a worked example must show its working, or it is just recorded output');
assert.ok(fixture.source.pageLocus);

const tol = fixture.tolerance.years;
const near = (actual, expected, what) => assert.ok(
  Math.abs(actual - expected) < tol,
  `${what}: engine ${actual} vs worked example ${expected} (diff ${Math.abs(actual - expected)})`,
);

const built = buildVimshottariDasha(
  2448000.5, fixture.input.moonLongitude, 330, { depth: 2 },
);
const e = fixture.expected;

assert.equal(built.birthNakshatraIndex, e.nakshatraIndex);
assert.equal(built.startingLord, e.startLord);
near(built.balanceYearsAtBirth, e.balanceYears, 'balance at birth');
// The elapsed fraction is implied by the balance: balance = years x (1 - f).
near(1 - built.balanceYearsAtBirth / 6, e.elapsedFraction, 'elapsed fraction');

assert.deepEqual(built.dashas.map((p) => p.lord), e.mahadashaOrder);
built.dashas.forEach((p, i) => near(p.endYears, e.endYears[i], `mahadasha ${p.lord} end`));

// Sub-periods are pro-rated against the *shortened* first mahadasha, not the
// lord's full span — otherwise the bhuktis would overrun their own parent.
const firstBhuktis = built.dashas[0][built.levelNames[1]];
assert.ok(firstBhuktis, 'depth 2 must produce sub-periods');
assert.deepEqual(firstBhuktis.map((p) => p.lord), e.firstBhuktiOfSun.order);
firstBhuktis.forEach((p, i) => near(
  p.durationYears, e.firstBhuktiOfSun.durationsYears[i], `bhukti ${p.lord} duration`,
));
near(
  firstBhuktis.reduce((a, p) => a + p.durationYears, 0),
  e.firstBhuktiOfSun.parentDurationYears,
  'the bhuktis must sum to their parent',
);

// ----------------------------------------------------- the register ----

const summary = coverageSummary();
assert.equal(summary.total, METHODS.length);
assert.ok(summary.total >= 20, 'the register names the methods PL9 offers, implemented or not');
assert.equal(summary.promoted, promotedMethods().length);
assert.equal(summary.implemented, implementedMethods().length);

// Exactly one method is promoted, and it is the one with the worked example.
assert.equal(summary.promoted, 1);
assert.equal(promotedMethods()[0].id, 'vimshottari');
assert.equal(getMethod('vimshottari').workedExample, fixture.id);

// Every registered method is labelled, and every label is honest about
// whether a table exists.
const ids = METHODS.map((m) => m.id);
assert.equal(new Set(ids).size, ids.length, 'method ids are unique');
for (const m of METHODS) {
  assert.ok(LEVELS.includes(m.level));
  assert.ok(m.nameTa && /[஀-௿]/.test(m.nameTa), `${m.id}: a Tamil name`);
  assert.ok(m.levelTa && m.levelNoteTa, `${m.id}: the label explains itself on screen`);
  assert.equal(m.promoted, m.level === 'VERIFIED');
  if (m.level === 'DECLARED') {
    assert.equal(m.implemented, false);
    assert.equal(getTable(m.id), null, `${m.id}: DECLARED must have no table`);
    assert.ok(m.notes, `${m.id}: say what is missing`);
  }
}

// The two dashas ported without an attachSource stamp are labelled as such
// rather than sitting silently beside the verified one.
for (const id of ['ashtottari', 'yogini']) {
  const m = getMethod(id);
  assert.equal(m.level, 'STRUCTURE_ONLY', `${id} carries no source stamp`);
  assert.equal(m.source, null);
  assert.equal(m.promoted, false);
}

// ------------------------------------------------------- Tribhagi -----

// Tribhagi needs no start rule of its own: it reuses Vimshottari's nakshatra
// lords, so nothing about it is guessed. Only the durations are scaled.
assert.equal(TRIBHAGI_TABLE.totalYears, 80);
assert.equal(TRIBHAGI_SCALE, 2 / 3);
for (const [lord, years] of Object.entries(VIMSHOTTARI_YEARS)) {
  near(TRIBHAGI_TABLE.years[lord], years * (2 / 3), `tribhagi ${lord}`);
}

const tri = buildDasha(TRIBHAGI_TABLE, {
  birthMs: Date.UTC(1990, 4, 15, 5, 0), moonLongitude: fixture.input.moonLongitude, depth: 2,
});
// Same birth nakshatra and same starting lord as Vimshottari, by construction.
assert.equal(tri.birthNakshatraIndex, e.nakshatraIndex);
assert.equal(tri.startLord, e.startLord);
// ...and the balance is exactly two-thirds of Vimshottari's.
near(tri.balanceYears, e.balanceYears * (2 / 3), 'tribhagi balance');
assert.equal(tri.periods.length, 9);
near(tri.periods.at(-1).endYears, (e.endYears.at(-1)) * (2 / 3), 'tribhagi cycle end');

// Sub-periods sum to their parent at every level.
for (const p of tri.periods) {
  const kids = p.children ?? [];
  if (kids.length) near(kids.reduce((a, k) => a + k.durationYears, 0), p.durationYears, `${p.lord} children`);
}

// Tribhagi is SOURCED, not VERIFIED — the derivation rests on a cited table
// but no published Tribhagi result has been reproduced.
assert.equal(getMethod('tribhagi').level, 'SOURCED');
assert.equal(getMethod('tribhagi').promoted, false);
assert.throws(() => assertPromotable(getMethod('tribhagi')), /not VERIFIED/);

// ---------------------------------------------- engine edge behaviour --

const table = TRIBHAGI_TABLE;
assert.throws(() => buildDasha(table, { birthMs: NaN, moonLongitude: 0 }), /birthMs is required/);
assert.throws(() => buildDasha(table, { birthMs: 0, moonLongitude: 0, depth: 9 }), /depth must be 1-4/);
assert.throws(() => birthBalance(table, 'x'), /must be a number/);

// A longitude at a nakshatra boundary belongs to the nakshatra it starts, and
// wrapping past 360 does not fall off the table.
assert.equal(birthBalance(table, 0).nakshatraIndex, 0);
assert.equal(birthBalance(table, 360).nakshatraIndex, 0);
assert.equal(birthBalance(table, -0.0001).nakshatraIndex, 26);
assert.equal(birthBalance(table, 359.9999).nakshatraIndex, 26);

console.log(JSON.stringify({
  pass: true,
  workedExample: fixture.id,
  coverage: summary.byLevel,
  promoted: promotedMethods().map((m) => m.id),
  implemented: implementedMethods().map((m) => `${m.id}:${m.level}`),
}, null, 2));
