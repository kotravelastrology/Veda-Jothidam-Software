'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateTamilPorutham, moonToStar } = require('../../src/report/tamilPorutham');

function moonStar(input: BirthFormInput) {
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  return moonToStar(chart.grahas.Moon.longitude);
}

/** `girl` = bride, `boy` = groom (the classical poruthams are asymmetric). */
export async function computePorutham(girl: BirthFormInput, boy: BirthFormInput) {
  const result = calculateTamilPorutham(moonStar(girl), moonStar(boy));
  return JSON.parse(JSON.stringify(result));
}
