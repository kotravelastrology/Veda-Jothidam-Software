'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart, RASI_NAMES } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { lagnaLordInLagna } = require('../../src/report/lagnaLordNature');

export async function natureFromLagnaLord(input: BirthFormInput) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart'],
  });
  // VJ-014: the ayanamsha lives in Swiss Ephemeris's global state, so the
  // whole computation runs inside one isolated session.
  return withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
    const chart = calculateParashariChart(request.chartContext);
    const entry = lagnaLordInLagna(chart.lagna.rasiIndex);
    return JSON.parse(JSON.stringify({
      lagnaRasi: RASI_NAMES[chart.lagna.rasiIndex],
      entry,
    }));
  });
}
