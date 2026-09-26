'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateVargas } = require('../../src/chart/vargaChart');

const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export async function computeDivisionalCharts(input: BirthFormInput) {
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);

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
}
