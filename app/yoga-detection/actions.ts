'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildYogasDoshasChart, CLASSICAL_GRAHAS } = require('../../src/report/reportData');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateRajaYogas } = require('../../src/chart/rajaYogas');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateNabhasaYogas } = require('../../src/chart/nabhasaYoga');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateLunarSolarYogas } = require('../../src/chart/lunarSolarYogas');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateWealthYogas } = require('../../src/chart/wealthYogas');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateEdgeCaseYogas } = require('../../src/chart/edgeCaseYogas');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateDoshas } = require('../../src/chart/doshas');

export async function detectYogas(input: BirthFormInput) {
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);

  const rasiPositions: Record<string, number> = {
    ...Object.fromEntries(
      CLASSICAL_GRAHAS.map((p: string) => [p, chart.grahas[p].rasiIndex]),
    ),
    Lagna: chart.lagna.rasiIndex,
  };
  const sunLongitude = chart.grahas.Sun.longitude;
  const moonLongitude = chart.grahas.Moon.longitude;
  const isWaxingMoon = ((moonLongitude - sunLongitude) % 360 + 360) % 360 <= 180;

  const yogaChart = buildYogasDoshasChart(chart, rasiPositions);

  return JSON.parse(JSON.stringify({
    rajaYogas: calculateRajaYogas(yogaChart),
    nabhasaYogas: calculateNabhasaYogas(rasiPositions, { isWaxingMoon }),
    lunarSolarYogas: calculateLunarSolarYogas(yogaChart),
    wealthYogas: calculateWealthYogas(yogaChart),
    edgeCaseYogas: calculateEdgeCaseYogas(yogaChart),
    doshas: calculateDoshas(yogaChart),
    lagnaRasi: chart.lagna.rasi,
    lagnaRasiIndex: chart.lagna.rasiIndex,
  }));
}
