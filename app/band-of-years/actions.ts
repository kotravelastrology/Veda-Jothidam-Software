'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { bandOfYears } = require('../../src/report/bandOfYears');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface BandOfYearsRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/**
 * The band of years (the 35-year cycle) for one person: the ruling planet of
 * each year, its progression and transit now. A saved profile is read with its
 * stored settings.
 */
export async function computeBandOfYears(req: BandOfYearsRequest) {
  let input: BirthFormInput;
  let profile: any = null;
  if (req.profile) {
    const library = openLibrary(resolveLibraryPath());
    try {
      const p = library.getProfile(req.profile.profileId, req.profile.revision);
      if (!p) throw new Error(`சுயவிவரம் கிடைக்கவில்லை: ${req.profile.profileId}`);
      input = { ...p.input, ...p.settings };
      profile = p;
    } finally {
      library.close();
    }
  } else if (req.form) {
    input = req.form;
  } else {
    throw new Error('ஒரு சுயவிவரம் அல்லது பிறப்பு விவரம் தேவை.');
  }
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const i = ctx.input;
  const birthMs = Date.UTC(i.year, i.month - 1, i.day, i.hour, i.minute, i.second ?? 0) - (i.utcOffsetMinutes ?? 0) * 60000;
  const result = bandOfYears({
    birthMs,
    natalLongitudes: Object.fromEntries(Object.entries(chart.grahas).map(([p, g]: [string, any]) => [p, g.longitude])),
    natalLagnaLongitude: chart.lagna.longitude,
    atMs: Date.now(),
    ayanamsha: ctx.ayanamsha,
    nodeType: ctx.nodeType ?? 'mean',
  });
  return JSON.parse(JSON.stringify({
    ...result,
    displayOffsetMinutes: input.utcOffsetMinutes ?? 0,
    native: describeMatchParty(input, ctx, profile),
  }));
}
