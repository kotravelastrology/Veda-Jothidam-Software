const crypto = require('node:crypto');

const { createCalculationRequest } = require('../src/contracts/calculationRequest');
const { createChartSnapshot } = require('../src/contracts/chartSnapshot');
const { calculateParashariChart } = require('../src/chart/parashariChart');
const { calculateVargas } = require('../src/chart/vargaChart');
const { calculateAshtakavarga } = require('../src/chart/ashtakavarga');
const { buildVimshottariDasha, NAKSHATRA_LORDS } = require('../src/dasha/vimshottariDasha');

const CLASSICAL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const ALL_GRAHAS = [...CLASSICAL_GRAHAS, 'Rahu', 'Ketu'];

/** Degrees are recorded to 6dp: far finer than any doctrinal boundary, still
 *  coarse enough that platform float formatting cannot flip the hash. */
const round6 = (n) => Number(n.toFixed(6));

/**
 * The observable surface a fixture pins: the values a user actually reads.
 * Deliberately excludes anything time-dependent (current dasha, transits), so
 * a fixture's hash is stable forever rather than until tomorrow.
 */
function computeFixture(fixture) {
  const request = createCalculationRequest({
    input: fixture.input,
    settings: fixture.settings,
    outputs: ['parashariChart', 'vargas', 'ashtakavarga', 'vimshottari'],
    requestedBy: `fixture:${fixture.fixtureId}`,
  });
  const chart = calculateParashariChart(request.chartContext);

  const grahas = {};
  for (const planet of ALL_GRAHAS) {
    const g = chart.grahas[planet];
    grahas[planet] = {
      longitude: round6(g.longitude),
      rasi: g.rasi,
      degreeInSign: round6(g.degreeInSign),
      house: g.house,
    };
  }

  const vargas = {};
  for (const planet of ALL_GRAHAS) {
    const g = chart.grahas[planet];
    const v = calculateVargas(g.rasiIndex, g.degreeInSign);
    vargas[planet] = Object.fromEntries(
      Object.keys(v)
        .filter((k) => k !== 'source')
        .map((k) => [k, v[k].sign ?? v[k].lord]),
    );
  }

  const rasiPositions = {
    ...Object.fromEntries(CLASSICAL_GRAHAS.map((p) => [p, chart.grahas[p].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  };
  const ashtakavarga = calculateAshtakavarga(rasiPositions);

  const dasha = buildVimshottariDasha(
    chart.julianDay,
    chart.grahas.Moon.longitude,
    fixture.input.utcOffsetMinutes,
    { depth: 2 },
  );

  return {
    lagna: {
      longitude: round6(chart.lagna.longitude),
      rasi: chart.lagna.rasi,
      degreeInSign: round6(chart.lagna.degreeInSign),
    },
    julianDay: round6(chart.julianDay),
    ayanamsha: chart.ayanamsha,
    houseSystem: chart.houseSystem,
    nodeType: chart.nodeType,
    grahas,
    vargas,
    ashtakavarga: {
      sarva: ashtakavarga.sarva,
      total: ashtakavarga.sarva.reduce((a, b) => a + b, 0),
      bhinna: ashtakavarga.bhinna,
    },
    vimshottari: {
      birthNakshatraIndex: dasha.birthNakshatraIndex,
      birthNakshatraLord: NAKSHATRA_LORDS[dasha.birthNakshatraIndex],
      startingLord: dasha.startingLord,
      balanceYearsAtBirth: round6(dasha.balanceYearsAtBirth),
      mahadashas: dasha.dashas.map((d) => ({
        lord: d.lord,
        durationYears: round6(d.durationYears),
        startLocal: d.startLocal,
        endLocal: d.endLocal,
        bhuktis: (d.Bhukti || []).map((b) => ({
          lord: b.lord,
          startLocal: b.startLocal,
          endLocal: b.endLocal,
        })),
      })),
    },
  };
}

/** Key-order-independent hash, so reordering a field in computeFixture does
 *  not masquerade as an astrological change. */
function hashResult(result) {
  const canonical = (value) => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') {
      return Object.keys(value).sort().reduce((acc, k) => {
        acc[k] = canonical(value[k]);
        return acc;
      }, {});
    }
    return value;
  };
  return crypto.createHash('sha256')
    .update(JSON.stringify(canonical(result)))
    .digest('hex');
}

/**
 * The same computation as a VJ-006 ChartSnapshot: values plus the request,
 * settings and engine version that produced them, identified by content hash.
 */
function snapshotFixture(fixture) {
  const request = createCalculationRequest({
    input: fixture.input,
    settings: fixture.settings,
    outputs: ['parashariChart', 'vargas', 'ashtakavarga', 'vimshottari'],
    requestedBy: `fixture:${fixture.fixtureId}`,
  });
  return createChartSnapshot({ request, values: computeFixture(fixture) });
}

module.exports = { computeFixture, hashResult, snapshotFixture };
