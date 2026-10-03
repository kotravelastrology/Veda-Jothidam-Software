/**
 * VJ-016 — evidence panels.
 *
 * Acceptance: shared snapshot; values agree in chart/table/report.
 *
 * "Agree" is tested at the source rather than by comparing rendered pixels:
 * every panel reads one snapshot, so the test asserts that the snapshot is
 * internally consistent and reproducible, and that each panel's numbers come
 * from the same object rather than a second computation.
 */
const assert = require('node:assert/strict');

const { createCalculationRequest } = require('./src/contracts/calculationRequest');
const { createChartSnapshot, assertChartSnapshot } = require('./src/contracts/chartSnapshot');
const { assertRuleEvidence } = require('./src/contracts/ruleEvidence');
const { createRuleEvidence } = require('./src/contracts/ruleEvidence');
const { calculateParashariChart, RASI_NAMES } = require('./src/chart/parashariChart');
const { calculateVargas } = require('./src/chart/vargaChart');
const { calculateAshtakavarga } = require('./src/chart/ashtakavarga');
const { calculateShadbala } = require('./src/chart/shadbala');

const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const ALL = [...CLASSICAL, 'Rahu', 'Ketu'];

const input = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai',
  ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean',
};

/** Mirrors app/evidence/actions.ts, which cannot be required from a 'use server' file. */
function build(birthInput) {
  const request = createCalculationRequest({
    input: birthInput,
    settings: {
      ayanamsha: birthInput.ayanamsha,
      houseSystem: birthInput.houseSystem,
      nodeType: birthInput.nodeType,
    },
    outputs: ['parashariChart', 'vargas', 'ashtakavarga', 'shadbala'],
  });
  const chart = calculateParashariChart(request.chartContext);

  const natal = ALL.map((id) => {
    const g = chart.grahas[id];
    return { id, longitude: g.longitude, rasi: g.rasi, rasiIndex: g.rasiIndex, degreeInSign: g.degreeInSign, house: g.house };
  });
  const vargas = Object.fromEntries(ALL.map((id) => {
    const g = chart.grahas[id];
    return [id, calculateVargas(g.rasiIndex, g.degreeInSign)];
  }));
  const lagnaVargas = calculateVargas(chart.lagna.rasiIndex, chart.lagna.degreeInSign);
  const rasiPositions = {
    ...Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  };
  const ashtakavarga = calculateAshtakavarga(rasiPositions);
  const shadbala = calculateShadbala({
    longitudes: Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].longitude])),
    lagnaRasiIndex: chart.lagna.rasiIndex,
    ascendant: chart.lagna.longitude,
    mc: chart.mc,
    birthJd: chart.julianDay,
    latitude: birthInput.latitude,
    longitude: birthInput.longitude,
    year: birthInput.year, month: birthInput.month, day: birthInput.day,
    utcOffsetMinutes: birthInput.utcOffsetMinutes,
  });

  const evidence = [
    createRuleEvidence({
      ruleId: 'VARGAS', name: 'Divisional charts',
      outcome: { divisions: Object.keys(lagnaVargas).filter((k) => k !== 'source') },
      source: lagnaVargas.source,
    }),
    createRuleEvidence({
      ruleId: 'ASHTAKAVARGA', name: 'Ashtakavarga',
      outcome: { total: ashtakavarga.sarva.reduce((a, b) => a + b, 0) },
      source: ashtakavarga.source,
    }),
    createRuleEvidence({
      ruleId: 'SHADBALA', name: 'Shadbala',
      outcome: { planets: CLASSICAL }, source: shadbala.source,
    }),
  ];

  return createChartSnapshot({
    request,
    values: {
      lagna: {
        longitude: chart.lagna.longitude, rasi: chart.lagna.rasi,
        rasiIndex: chart.lagna.rasiIndex, degreeInSign: chart.lagna.degreeInSign,
      },
      natal,
      vargaKeys: Object.keys(lagnaVargas).filter((k) => k !== 'source' && k !== 'D2'),
      vargas, lagnaVargas,
      ashtakavarga: {
        sarva: ashtakavarga.sarva, bhinna: ashtakavarga.bhinna,
        total: ashtakavarga.sarva.reduce((a, b) => a + b, 0),
      },
      shadbala: shadbala.perPlanet,
    },
    evidence,
  });
}

const snapshot = build(input);
assertChartSnapshot(snapshot);

// ------------------------------------------------------ shared snapshot --

// Recomputing the same request must produce the same identity, or panels that
// re-render at different moments could disagree.
assert.equal(build(input).snapshotId, snapshot.snapshotId,
  'the same request must yield the same snapshot id');

// A different setting must be a different snapshot, so a panel cannot show
// Lahiri numbers under a Raman heading.
assert.notEqual(build({ ...input, ayanamsha: 'Raman' }).snapshotId, snapshot.snapshotId,
  'changing the ayanamsha must change the snapshot identity');

// ------------------------------------- values agree across renderings --

const v = snapshot.values;

// The chart panel places a graha by rasiIndex; the table prints its rasi name.
// Both must describe the same placement.
for (const g of v.natal) {
  assert.equal(RASI_NAMES[g.rasiIndex], g.rasi,
    `${g.id}: chart position (index ${g.rasiIndex}) disagrees with table label ${g.rasi}`);
  assert.ok(g.degreeInSign >= 0 && g.degreeInSign < 30, `${g.id}: degree out of range`);
  assert.ok(g.house >= 1 && g.house <= 12, `${g.id}: house out of range`);
  // The longitude a report would print must reconstruct the same rasi.
  assert.equal(Math.floor(((g.longitude % 360) + 360) % 360 / 30), g.rasiIndex,
    `${g.id}: longitude and rasiIndex disagree`);
}

// The varga panel renders from signIndex, the table prints sign.
for (const key of v.vargaKeys) {
  for (const g of v.natal) {
    const cell = v.vargas[g.id][key];
    assert.equal(RASI_NAMES[cell.signIndex], cell.sign,
      `${g.id} ${key}: chart index and table sign disagree`);
  }
  const l = v.lagnaVargas[key];
  assert.equal(RASI_NAMES[l.signIndex], l.sign, `Lagna ${key}: index and sign disagree`);
}

// The bala panel's per-rasi bindus must sum to the total a report prints.
assert.equal(v.ashtakavarga.sarva.reduce((a, b) => a + b, 0), v.ashtakavarga.total,
  'sarva rows do not sum to the total shown');
assert.equal(v.ashtakavarga.total, 337, 'Sarvashtakavarga must total the classical 337');

// Bhinna columns must reconcile with sarva, or two bala views would disagree.
for (let rasi = 0; rasi < 12; rasi += 1) {
  const summed = CLASSICAL.reduce((acc, p) => acc + v.ashtakavarga.bhinna[p][rasi], 0);
  assert.equal(summed, v.ashtakavarga.sarva[rasi],
    `rasi ${rasi}: bhinna columns sum to ${summed} but sarva says ${v.ashtakavarga.sarva[rasi]}`);
}

// Shadbala must not present a total: BPHS's Ayana Bala is unresolved, and the
// engine withholds it. A panel inventing one would be the F01 defect again.
for (const planet of CLASSICAL) {
  const b = v.shadbala[planet];
  assert.ok(typeof b.sthanaBala === 'number', `${planet}: sthanaBala missing`);
  assert.equal(b.shadbalaTotal.status, 'SOURCE_REQUIRED',
    `${planet}: Shadbala total must stay withheld, not be fabricated`);
}

// ---------------------------------------------------------- evidence --

assert.ok(snapshot.evidence.length >= 3, 'each panel contributes evidence');
for (const e of snapshot.evidence) {
  assertRuleEvidence(e, e.ruleId);
  if (e.status === 'APPLIED') {
    assert.ok(e.source.pageLocus, `${e.ruleId}: evidence must carry a page locator`);
  }
}
const ruleIds = snapshot.evidence.map((e) => e.ruleId);
for (const expected of ['VARGAS', 'ASHTAKAVARGA', 'SHADBALA']) {
  assert.ok(ruleIds.includes(expected), `missing evidence for ${expected}`);
}

console.log(JSON.stringify({
  pass: true,
  snapshotId: snapshot.snapshotId.slice(0, 16),
  grahas: v.natal.length,
  vargas: v.vargaKeys.length,
  sarvaTotal: v.ashtakavarga.total,
  evidence: ruleIds,
}, null, 2));
