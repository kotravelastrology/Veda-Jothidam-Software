/**
 * VJ-006 — CalculationRequest / ChartSnapshot / RuleEvidence.
 *
 * Checks the schemas reject what they must, and validates them against real
 * consumers rather than hand-made samples: the fixture pipeline, live engine
 * output, and the provenance the calculators actually stamp.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  createCalculationRequest, assertCalculationRequest, CALCULATION_REQUEST_VERSION,
} = require('./src/contracts/calculationRequest');
const { createChartSnapshot, assertChartSnapshot } = require('./src/contracts/chartSnapshot');
const {
  createRuleEvidence, withheldEvidence, assertRuleEvidence,
} = require('./src/contracts/ruleEvidence');
const { snapshotFixture } = require('./fixtures/computeFixture');
const { calculateNabhasaYogas } = require('./src/chart/nabhasaYoga');
const { calculateParashariChart } = require('./src/chart/parashariChart');

const sampleInput = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai',
};

// ---------------------------------------------------------------- request --

const request = createCalculationRequest({
  input: sampleInput,
  settings: { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean' },
  outputs: ['parashariChart', 'vargas'],
});
assertCalculationRequest(request);
assert.equal(request.requestVersion, CALCULATION_REQUEST_VERSION);

// Settings and version tags are mandatory by construction, not by convention:
// a request built without explicit settings still carries the full set.
const defaulted = createCalculationRequest({ input: sampleInput, outputs: ['parashariChart'] });
for (const key of ['ayanamsha', 'houseSystem', 'nodeType', 'calendarMode', 'dayBoundary']) {
  assert.ok(defaulted.settings[key], `settings.${key} must always be present`);
}
assert.ok(defaulted.requestVersion && defaulted.contextVersion, 'version tags must always be present');

// The request is frozen, so a consumer cannot mutate the settings a result
// was computed under after the fact. Asserted by effect rather than by a
// thrown TypeError, since a non-strict CJS caller fails the write silently.
assert.ok(Object.isFrozen(request) && Object.isFrozen(request.settings), 'request must be frozen');
try { request.settings.ayanamsha = 'Raman'; } catch { /* strict-mode callers throw */ }
assert.equal(request.settings.ayanamsha, 'Lahiri', 'settings must not be mutable after construction');

assert.throws(() => createCalculationRequest({ input: sampleInput, outputs: [] }),
  /non-empty array/, 'empty outputs rejected');
assert.throws(() => createCalculationRequest({ input: sampleInput, outputs: ['nonsense'] }),
  /Unsupported output/, 'unknown output rejected');
assert.throws(() => createCalculationRequest({ input: sampleInput, outputs: ['vargas'], settings: { ayanamsha: 'Bogus' } }),
  /Unsupported ayanamsha/, 'bad ayanamsha rejected at the request boundary');
assert.throws(() => assertCalculationRequest({ requestVersion: 'old' }),
  /required|!=/, 'stale request rejected');

// --------------------------------------------------------------- snapshot --

const chartsDir = path.join(__dirname, 'fixtures', 'charts');
const fixtureFiles = fs.readdirSync(chartsDir).filter((f) => f.endsWith('.json'));
assert.ok(fixtureFiles.length > 0, 'fixtures must exist to validate against');

const snapshotIds = new Set();
for (const file of fixtureFiles) {
  const fixture = JSON.parse(fs.readFileSync(path.join(chartsDir, file), 'utf8'));
  const snapshot = snapshotFixture(fixture);

  assertChartSnapshot(snapshot, fixture.fixtureId);
  assert.equal(snapshot.settings.ayanamsha, fixture.settings.ayanamsha,
    `${fixture.fixtureId}: snapshot must record the settings actually used`);
  assert.ok(snapshot.engineVersion && snapshot.engineVersion !== 'unknown',
    `${fixture.fixtureId}: engine version must be recorded`);

  // Same request, same id — the property a stored report depends on.
  assert.equal(snapshotFixture(fixture).snapshotId, snapshot.snapshotId,
    `${fixture.fixtureId}: snapshot id must be reproducible`);
  snapshotIds.add(snapshot.snapshotId);
}
assert.equal(snapshotIds.size, fixtureFiles.length, 'each fixture must yield a distinct snapshot id');

// Changing a setting must change the identity, or a report could cite the
// wrong chart while looking correct.
const lahiri = snapshotFixture({
  fixtureId: 'ident-a', input: sampleInput,
  settings: { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean' },
});
const raman = snapshotFixture({
  fixtureId: 'ident-b', input: sampleInput,
  settings: { ayanamsha: 'Raman', houseSystem: 'Porphyrius', nodeType: 'mean' },
});
assert.notEqual(lahiri.snapshotId, raman.snapshotId,
  'a different ayanamsha must produce a different snapshot id');

assert.throws(() => createChartSnapshot({ request, values: null }), /values is required/);
assert.throws(() => createChartSnapshot({ request: { bogus: true }, values: {} }),
  /not a CalculationRequest|required/);

// ---------------------------------------------------------------- evidence --

// Validate against provenance the engine really produces, not an invented
// sample: nabhasaYoga stamps its own source via attachSource().
const chart = calculateParashariChart(request.chartContext);
const rasiPositions = {
  Sun: chart.grahas.Sun.rasiIndex, Moon: chart.grahas.Moon.rasiIndex,
  Mars: chart.grahas.Mars.rasiIndex, Mercury: chart.grahas.Mercury.rasiIndex,
  Jupiter: chart.grahas.Jupiter.rasiIndex, Venus: chart.grahas.Venus.rasiIndex,
  Saturn: chart.grahas.Saturn.rasiIndex, Lagna: chart.lagna.rasiIndex,
};
const nabhasa = calculateNabhasaYogas(rasiPositions, { isWaxingMoon: true });
assert.ok(nabhasa.source, 'engine result carries a source');

const evidence = createRuleEvidence({
  ruleId: 'NABHASA_YOGA',
  name: nabhasa.yogas[0] ? nabhasa.yogas[0].name : 'Nabhasa',
  outcome: nabhasa.yogas.map((y) => y.name),
  source: nabhasa.source,
  appliedTo: { lagnaRasi: chart.lagna.rasi },
});
assertRuleEvidence(evidence);
assert.equal(evidence.status, 'APPLIED');

// A rule with no verified source is withheld, never given a plausible value.
const withheld = withheldEvidence({
  ruleId: 'LIFE_EVENT_FORECAST',
  reason: 'Life-event forecasting has no verified classical source yet',
});
assertRuleEvidence(withheld);
assert.equal(withheld.status, 'SOURCE_REQUIRED');
assert.equal(withheld.outcome, null, 'withheld evidence must not carry an outcome');

// Evidence cannot be weaker than what attachSource() already demands.
assert.throws(() => createRuleEvidence({
  ruleId: 'X', name: 'X', outcome: 'something',
  source: { title: 'BPHS' },
}), /source\.(author|file|pageLocus|tradition|convention) is required/,
'incomplete provenance rejected');

assert.throws(() => withheldEvidence({ ruleId: 'X' }), /reason is required/);
assert.throws(() => assertRuleEvidence({ evidenceVersion: 'wrong' }), /evidenceVersion/);

// A snapshot carrying evidence validates end to end.
const withEvidence = createChartSnapshot({
  request, values: { note: 'evidence carrier' }, evidence: [evidence, withheld],
});
assertChartSnapshot(withEvidence);
withEvidence.evidence.forEach((e, i) => assertRuleEvidence(e, `evidence[${i}]`));

console.log(JSON.stringify({
  pass: true,
  fixturesValidated: fixtureFiles.length,
  requestVersion: request.requestVersion,
  snapshotVersion: withEvidence.snapshotVersion,
  evidenceVersion: evidence.evidenceVersion,
}, null, 2));
