const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');

const { UnsupportedInputError } = require('./chartContext');
const { assertCalculationRequest } = require('./calculationRequest');

const CHART_SNAPSHOT_VERSION = 'VJ006-SNAP-001';

/**
 * The package does not export its package.json, so resolve the module and
 * walk up to it. Resolving beats a path relative to __dirname, which does not
 * survive bundling — under Next.js that returned 'unknown', and since the
 * engine version is part of the snapshot id, the same chart would otherwise
 * get different identities in the app and in tests.
 */
function engineVersion() {
  const candidates = [];
  try {
    const entry = require.resolve('@swisseph/node');
    let dir = path.dirname(entry);
    for (let i = 0; i < 4; i += 1) {
      candidates.push(path.join(dir, 'package.json'));
      dir = path.dirname(dir);
    }
  } catch { /* fall through to the path guesses */ }
  // Next.js bundles this module, so __dirname is not the source tree and
  // require.resolve may not reach the external package. The server process
  // runs from the project root, where node_modules is.
  candidates.push(path.join(process.cwd(), 'node_modules', '@swisseph', 'node', 'package.json'));
  candidates.push(path.join(__dirname, '..', '..', 'node_modules', '@swisseph', 'node', 'package.json'));

  for (const candidate of candidates) {
    try {
      const pkg = JSON.parse(fs.readFileSync(candidate, 'utf8'));
      if (pkg.name === '@swisseph/node' && pkg.version) return pkg.version;
    } catch { /* try the next candidate */ }
  }
  return 'unknown';
}

/** Key-order-independent, so reordering fields is not mistaken for a change. */
function canonicalise(value) {
  if (Array.isArray(value)) return value.map(canonicalise);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((acc, k) => {
      acc[k] = canonicalise(value[k]);
      return acc;
    }, {});
  }
  return value;
}

function hashOf(value) {
  return crypto.createHash('sha256').update(JSON.stringify(canonicalise(value))).digest('hex');
}

/**
 * VJ-006 — ChartSnapshot.
 *
 * An immutable, identified result: the values, plus the request that produced
 * them and the versions in force at the time. ADR-07 requires a report to be a
 * snapshot rendering rather than a live recompute, and this is the object that
 * makes that possible — a report stores a snapshot id and can prove later
 * exactly what it was rendering.
 *
 * `snapshotId` is a content hash, so two runs of the same request over the
 * same engine produce the same id, and any drift changes it.
 */
function createChartSnapshot({ request, values, evidence = [] }) {
  assertCalculationRequest(request, 'request');
  if (!values || typeof values !== 'object') {
    throw new UnsupportedInputError('values is required to build a chart snapshot', 'values');
  }
  if (!Array.isArray(evidence)) {
    throw new UnsupportedInputError('evidence must be an array', 'evidence');
  }

  const computed = {
    snapshotVersion: CHART_SNAPSHOT_VERSION,
    requestVersion: request.requestVersion,
    contextVersion: request.contextVersion,
    engine: '@swisseph/node',
    engineVersion: engineVersion(),
    settings: request.settings,
    input: request.chartContext.input,
    outputs: request.outputs,
    values,
    evidence,
  };

  // The id covers the values and the settings that produced them, so the same
  // chart computed under a different ayanamsha is a different snapshot.
  return Object.freeze({
    ...computed,
    snapshotId: hashOf({
      settings: computed.settings,
      input: computed.input,
      values: computed.values,
      engineVersion: computed.engineVersion,
    }),
  });
}

function assertChartSnapshot(value, label = 'value') {
  if (!value || typeof value !== 'object') {
    throw new UnsupportedInputError(`${label} is not a ChartSnapshot`, label);
  }
  const required = [
    'snapshotVersion', 'snapshotId', 'requestVersion', 'contextVersion',
    'engine', 'engineVersion', 'settings', 'input', 'outputs', 'values',
  ];
  for (const field of required) {
    if (value[field] === undefined) {
      throw new UnsupportedInputError(`${label}.${field} is required`, field);
    }
  }
  if (value.snapshotVersion !== CHART_SNAPSHOT_VERSION) {
    throw new UnsupportedInputError(
      `${label}.snapshotVersion ${value.snapshotVersion} != ${CHART_SNAPSHOT_VERSION}`,
      'snapshotVersion',
    );
  }
  for (const setting of ['ayanamsha', 'houseSystem', 'nodeType', 'calendarMode']) {
    if (!value.settings[setting]) {
      throw new UnsupportedInputError(`${label}.settings.${setting} is required`, setting);
    }
  }
  return value;
}

module.exports = {
  createChartSnapshot,
  assertChartSnapshot,
  hashOf,
  CHART_SNAPSHOT_VERSION,
};
