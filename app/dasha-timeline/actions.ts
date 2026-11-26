'use server';

import type { BirthFormInput } from '../report/actions';
import { dashaTimelineRun, type DashaOptions } from '../../src/calc/chartRuns';

/**
 * The nine mahadashas of a chart, as Julian days: the page divides them down to five levels itself (src/dasha/dashaDrill.js),
 * so the same dates serve any depth and any "as of" date without another call. The first mahadasha is the balance at birth;
 * `fullStartJd` says where the whole of it began (before birth), which the division of its sub-periods needs.
 * `dashaOptions` are the settings' Dasha Year and Dasha Balance Method. The calculation is src/calc/chartRuns.ts, which the device
 * also runs when the server cannot be reached.
 */
export async function computeDashaTimeline(input: BirthFormInput, dashaOptions?: DashaOptions) {
  return dashaTimelineRun(input, dashaOptions);
}
