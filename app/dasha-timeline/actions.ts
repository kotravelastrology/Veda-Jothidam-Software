'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { planetLongitude } = require('../../src/ephemeris/siderealPositions');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ymd } = require('../../src/report/birthParticulars');

/**
 * The nine mahadashas of a chart, as Julian days: the page divides them down to five levels itself (src/dasha/dashaDrill.js),
 * so the same dates serve any depth and any "as of" date without another call. The first mahadasha is the balance at birth;
 * `fullStartJd` says where the whole of it began (before birth), which the division of its sub-periods needs.
 * `dashaOptions` are the settings' Dasha Year and Dasha Balance Method.
 */
export async function computeDashaTimeline(input: BirthFormInput, dashaOptions?: { yearDays: number; balance: 'degree' | 'time' }) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart', 'vimshottari'],
  });
  const options = dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  // VJ-014: the ayanamsha lives in Swiss Ephemeris's global state, so the
  // whole computation runs inside one isolated session.
  return withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
    const chart = calculateParashariChart(request.chartContext);

    const dasha = buildVimshottariDasha(
      chart.julianDay,
      chart.grahas.Moon.longitude,
      input.utcOffsetMinutes,
      {
        depth: 1,
        yearDays: options.yearDays,
        balance: options.balance,
        moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', request.settings.ayanamsha),
      },
    );

    return JSON.parse(JSON.stringify({
      mahadashas: dasha.dashas.map((d: any) => ({
        lord: d.lord,
        startJd: d.startJulianDay,
        endJd: d.endJulianDay,
        ...(d.fullStartJulianDay !== undefined ? { fullStartJd: d.fullStartJulianDay } : {}),
      })),
      utcOffsetMinutes: input.utcOffsetMinutes,
      birthJd: chart.julianDay,
      moonNakshatraIndex: dasha.birthNakshatraIndex,
      startingLord: dasha.startingLord,
      balance: ymd(dasha.balanceYearsAtBirth),
      dashaYearDays: options.yearDays,
      balanceMethod: options.balance,
      source: dasha.source,
    }));
  });
}
