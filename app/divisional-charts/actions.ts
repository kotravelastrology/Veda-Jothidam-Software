'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateVargas } = require('../../src/chart/vargaChart');

const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export async function computeDivisionalCharts(input: BirthFormInput) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart', 'vargas'],
  });
  // VJ-014: the ayanamsha lives in Swiss Ephemeris's global state, so the
  // whole computation runs inside one isolated session.
  return withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
    const chart = calculateParashariChart(request.chartContext);

    const vargas: Record<string, ReturnType<typeof calculateVargas>> = {
      Lagna: calculateVargas(chart.lagna.rasiIndex, chart.lagna.degreeInSign),
    };
    for (const planet of ALL_GRAHAS) {
      if (chart.grahas[planet]) {
        vargas[planet] = calculateVargas(
          chart.grahas[planet].rasiIndex,
          chart.grahas[planet].degreeInSign,
        );
      }
    }

    return JSON.parse(JSON.stringify({
      vargas,
      lagnaRasiIndex: chart.lagna.rasiIndex,
      lagnaLongitude: chart.lagna.longitude,
      grahas: Object.fromEntries(
        ALL_GRAHAS.filter(p => chart.grahas[p]).map(p => [p, {
          rasiIndex: chart.grahas[p].rasiIndex,
          rasi: chart.grahas[p].rasi,
          longitude: chart.grahas[p].longitude,
          degreeInSign: chart.grahas[p].degreeInSign,
        }]),
      ),
    }));
  });
}
