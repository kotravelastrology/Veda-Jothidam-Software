'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateTamilPorutham, moonToStar } = require('../../src/report/tamilPorutham');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateExtendedPorutham } = require('../../src/report/extendedPorutham');

function moonStarAndSun(input: BirthFormInput) {
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  return {
    ...moonToStar(chart.grahas.Moon.longitude),
    moonLongitude: chart.grahas.Moon.longitude,
    sunLongitude: chart.grahas.Sun.longitude,
  };
}

/** `girl` = bride, `boy` = groom (the classical poruthams are asymmetric). */
export async function computePorutham(girl: BirthFormInput, boy: BirthFormInput) {
  const g = moonStarAndSun(girl);
  const b = moonStarAndSun(boy);
  const result = calculateTamilPorutham(g, b);
  const extended = calculateExtendedPorutham(g, b);
  return JSON.parse(JSON.stringify({ ...result, extended }));
}
