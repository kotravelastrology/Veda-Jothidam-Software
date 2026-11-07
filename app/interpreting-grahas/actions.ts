'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart, RASI_NAMES } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateShadbala } = require('../../src/chart/shadbala');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildGrahaRows, NOT_BUILT, PLANETS } = require('../../src/report/grahaInterpretation');

export async function interpretGrahas(input: BirthFormInput) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart', 'shadbala'],
  });
  // VJ-014: the ayanamsha lives in Swiss Ephemeris's global state, so the
  // whole computation runs inside one isolated session.
  return withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
    const chart = calculateParashariChart(request.chartContext);
    const longitudes = Object.fromEntries(PLANETS.map((p: string) => [p, chart.grahas[p].longitude]));

    const shadbala = calculateShadbala({
      longitudes,
      lagnaRasiIndex: chart.lagna.rasiIndex,
      ascendant: chart.lagna.longitude,
      mc: chart.mc,
      birthJd: chart.julianDay,
      latitude: input.latitude,
      longitude: input.longitude,
      year: input.year,
      month: input.month,
      day: input.day,
      utcOffsetMinutes: input.utcOffsetMinutes,
    });

    return JSON.parse(JSON.stringify({
      lagnaRasi: RASI_NAMES[chart.lagna.rasiIndex],
      rows: buildGrahaRows({ lagnaRasiIndex: chart.lagna.rasiIndex, longitudes, shadbala }),
      notBuilt: NOT_BUILT,
    }));
  });
}
