'use server';

import type { BirthFormInput } from './report/actions';
import { todayPanchangam, type TodayPlace } from '../src/panchangam/todayPanchangam';
import { personalTodayRun, type DashaOptions } from '../src/calc/chartRuns';

/**
 * Today's panchangam for the home page (src/panchangam/todayPanchangam.ts, which the morning notification and the device's own
 * calculation read too): the five limbs at sunrise with the time each ends (Tirukanita, Karanam Ramakumar, Panchangam Calculations,
 * S1-B), and Rahu kalam, Yamagandam and Gulika kalam (same source, file pages 22-23).
 */
export async function computeToday(place: TodayPlace) {
  return todayPanchangam(place);
}

/**
 * "Today for you" (src/report/personalToday.js, through src/calc/chartRuns.ts): the running dasha, bhukti and antara of one chart, the
 * Moon of the day against the birth star (tara), and Saturn's and Jupiter's houses from the birth Moon with the Sade Sati phase, as of
 * this moment. The chart is computed with the settings it carries (ayanamsha, house system, nodes) and the dasha options of the
 * Settings, like the dasha page.
 */
export async function computePersonalToday(input: BirthFormInput, dashaOptions?: DashaOptions) {
  return personalTodayRun(input, dashaOptions, Date.now());
}
