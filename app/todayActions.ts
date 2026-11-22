'use server';

import type { BirthFormInput } from './report/actions';
import { todayPanchangam, type TodayPlace } from '../src/panchangam/todayPanchangam';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { planetLongitude } = require('../src/ephemeris/siderealPositions');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { personalToday } = require('../src/report/personalToday');
/**
 * Today's panchangam for the home page (src/panchangam/todayPanchangam.ts, which the morning notification reads too): the five limbs
 * at sunrise with the time each ends (Tirukanita, Karanam Ramakumar, Panchangam Calculations, S1-B), and Rahu kalam, Yamagandam and
 * Gulika kalam (same source, file pages 22-23).
 */
export async function computeToday(place: TodayPlace) {
  return todayPanchangam(place);
}

/**
 * "Today for you" (src/report/personalToday.js): the running dasha, bhukti and antara of one chart, the Moon of the day against the birth
 * star (tara), and Saturn's and Jupiter's houses from the birth Moon with the Sade Sati phase, as of this moment. The chart is computed with
 * the settings it carries (ayanamsha, house system, nodes) and the dasha options of the Settings, like the dasha page.
 */
export async function computePersonalToday(input: BirthFormInput, dashaOptions?: { yearDays: number; balance: 'degree' | 'time' }) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart', 'vimshottari'],
  });
  const options = dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  return withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
    const chart = calculateParashariChart(request.chartContext);
    const dasha = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, input.utcOffsetMinutes, {
      depth: 1,
      yearDays: options.yearDays,
      balance: options.balance,
      moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', request.settings.ayanamsha),
    });
    const mahadashas = dasha.dashas.map((d: any) => ({
      lord: d.lord,
      startJd: d.startJulianDay,
      endJd: d.endJulianDay,
      ...(d.fullStartJulianDay !== undefined ? { fullStartJd: d.fullStartJulianDay } : {}),
    }));
    return JSON.parse(JSON.stringify(personalToday({
      natalMoonLongitude: chart.grahas.Moon.longitude,
      mahadashas,
      utcOffsetMinutes: input.utcOffsetMinutes,
      atMs: Date.now(),
      ayanamsha: request.settings.ayanamsha,
    })));
  });
}
