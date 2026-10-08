'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { lattaNirnaya } = require('../../src/report/latta');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface LattaRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/**
 * The star each planet kicks today, and the periods when one kicks the natal
 * star (and, for Narasimha Rao's reading, the lagna star). A saved profile is
 * read with its stored settings.
 */
export async function computeLatta(req: LattaRequest) {
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
  const natalLongitudes = Object.fromEntries(Object.entries(chart.grahas).map(([k, g]: [string, any]) => [k, g.longitude]));
  const result = lattaNirnaya({
    natalMoonLongitude: chart.grahas.Moon.longitude,
    lagnaLongitude: chart.lagna.longitude,
    natalLongitudes,
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
