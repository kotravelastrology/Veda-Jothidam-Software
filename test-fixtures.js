/**
 * VJ-002 — fixture baseline regression.
 *
 * Recomputes every fixture in fixtures/charts/ and compares it against the
 * recorded baseline. Any change to a planetary position, varga placement,
 * ashtakavarga bindu or dasha boundary fails here with the exact field named,
 * rather than surfacing later as a quietly different chart.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { computeFixture, hashResult } = require('./fixtures/computeFixture');

const chartsDir = path.join(__dirname, 'fixtures', 'charts');
const baselineDir = path.join(__dirname, 'fixtures', 'baseline');

const files = fs.readdirSync(chartsDir).filter((f) => f.endsWith('.json'));
assert.ok(files.length > 0, 'at least one fixture must exist');

/** Report the first differing leaf, so a failure says which value moved. */
function firstDifference(expected, actual, trail = '') {
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) return `${trail}: length ${expected.length} -> ${actual.length}`;
    for (let i = 0; i < expected.length; i += 1) {
      const d = firstDifference(expected[i], actual[i], `${trail}[${i}]`);
      if (d) return d;
    }
    return null;
  }
  if (expected && actual && typeof expected === 'object' && typeof actual === 'object') {
    for (const key of Object.keys(expected)) {
      const d = firstDifference(expected[key], actual[key], trail ? `${trail}.${key}` : key);
      if (d) return d;
    }
    return null;
  }
  return expected === actual ? null : `${trail}: ${JSON.stringify(expected)} -> ${JSON.stringify(actual)}`;
}

let checked = 0;
for (const file of files) {
  const fixture = JSON.parse(fs.readFileSync(path.join(chartsDir, file), 'utf8'));
  const baselinePath = path.join(baselineDir, file);

  assert.ok(
    fs.existsSync(baselinePath),
    `no baseline for ${fixture.fixtureId}; run: node fixtures/record-baseline.js`,
  );
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

  assert.equal(
    baseline.fixtureVersion, fixture.fixtureVersion,
    `${fixture.fixtureId}: fixture edited (v${fixture.fixtureVersion}) but baseline is v${baseline.fixtureVersion} — re-record deliberately`,
  );

  const result = computeFixture(fixture);
  const diff = firstDifference(baseline.result, result);
  assert.equal(diff, null, `${fixture.fixtureId} drifted -> ${diff}`);
  assert.equal(hashResult(result), baseline.hash, `${fixture.fixtureId}: hash mismatch`);

  // The settings a fixture declares must be the settings the engine used;
  // otherwise a plumbing regression could silently fall back to defaults and
  // still match a baseline recorded under the same fallback.
  assert.equal(result.ayanamsha, fixture.settings.ayanamsha, `${fixture.fixtureId}: ayanamsha not honoured`);
  assert.equal(result.houseSystem, fixture.settings.houseSystem, `${fixture.fixtureId}: house system not honoured`);
  assert.equal(result.nodeType, fixture.settings.nodeType, `${fixture.fixtureId}: node type not honoured`);

  checked += 1;
}

// Sarvashtakavarga must total the classical 337 for every chart (BPHS
// Ashtakavarga table): an independent check on the recorded numbers.
for (const file of files) {
  const fixture = JSON.parse(fs.readFileSync(path.join(chartsDir, file), 'utf8'));
  const { ashtakavarga } = computeFixture(fixture);
  assert.equal(ashtakavarga.total, 337, `${fixture.fixtureId}: sarva total ${ashtakavarga.total}, expected 337`);
}

// Vimshottari must span 120 years, with the first period shortened by the
// portion of the birth nakshatra already elapsed.
for (const file of files) {
  const fixture = JSON.parse(fs.readFileSync(path.join(chartsDir, file), 'utf8'));
  const { vimshottari } = computeFixture(fixture);
  const elapsed = 120 - vimshottari.mahadashas.reduce((sum, d) => sum + d.durationYears, 0);
  assert.ok(elapsed >= 0 && elapsed < 20, `${fixture.fixtureId}: implied elapsed balance ${elapsed} out of range`);
  assert.ok(
    vimshottari.balanceYearsAtBirth > 0,
    `${fixture.fixtureId}: balance at birth must be positive`,
  );
  assert.equal(vimshottari.mahadashas.length, 9, `${fixture.fixtureId}: expected 9 mahadashas`);
  assert.equal(vimshottari.mahadashas[0].lord, vimshottari.startingLord);
}

console.log(JSON.stringify({ pass: true, fixturesChecked: checked }, null, 2));
