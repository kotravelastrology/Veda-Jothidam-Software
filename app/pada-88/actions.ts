'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pada88 } = require('../../src/report/pada88');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface Pada88Request {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/**
 * The 88th pada from the natal Moon's, and when each planet stands in it. A
 * saved profile is read with its stored settings (the pada moves with the
 * ayanamsha).
 */
export async function computePada88(req: Pada88Request) {
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
  const result = pada88({
    natalMoonLongitude: chart.grahas.Moon.longitude,
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
