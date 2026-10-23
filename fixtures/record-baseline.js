/**
 * Records the current engine output for every fixture as its baseline.
 *
 *   node fixtures/record-baseline.js
 *
 * Only run this when a change to the engine is intended and the resulting
 * diff has been reviewed. `npm run test:fixtures` compares against whatever
 * this wrote, so re-recording to silence a failing test would defeat the
 * point: review the diff first, then re-record deliberately.
 */
const fs = require('node:fs');
const path = require('node:path');

const { computeFixture, hashResult } = require('./computeFixture');

// The package does not export package.json, so read it off disk.
const enginePkg = path.join(__dirname, '..', 'node_modules', '@swisseph', 'node', 'package.json');
const engineVersion = JSON.parse(fs.readFileSync(enginePkg, 'utf8')).version;

const chartsDir = path.join(__dirname, 'charts');
const baselineDir = path.join(__dirname, 'baseline');
fs.mkdirSync(baselineDir, { recursive: true });

const files = fs.readdirSync(chartsDir).filter((f) => f.endsWith('.json'));
const index = [];

for (const file of files) {
  const fixture = JSON.parse(fs.readFileSync(path.join(chartsDir, file), 'utf8'));
  const result = computeFixture(fixture);
  const hash = hashResult(result);

  fs.writeFileSync(
    path.join(baselineDir, file),
    `${JSON.stringify({
      fixtureId: fixture.fixtureId,
      fixtureVersion: fixture.fixtureVersion,
      recordedAt: new Date().toISOString().slice(0, 10),
      engine: engineVersion,
      settings: fixture.settings,
      hash,
      result,
    }, null, 2)}\n`,
  );

  index.push({ fixtureId: fixture.fixtureId, file, hash });
  console.log(`recorded ${fixture.fixtureId}  ${hash.slice(0, 16)}…`);
}

fs.writeFileSync(
  path.join(baselineDir, 'index.json'),
  `${JSON.stringify({ recordedAt: new Date().toISOString().slice(0, 10), fixtures: index }, null, 2)}\n`,
);
console.log(`\n${index.length} baselines written to fixtures/baseline/`);
