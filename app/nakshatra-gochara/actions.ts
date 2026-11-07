'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { nakshatraGochara } = require('../../src/report/nakshatraGochara');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface NakshatraGocharaRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/**
 * Every planet's star counted from the natal star — tara, Pulippani's good
 * and bad stars, the limbs of four books — and the weekdays of the natal star.
 * A saved profile is read with its stored settings (the natal star moves with
 * the ayanamsha).
 */
export async function computeNakshatraGochara(req: NakshatraGocharaRequest) {
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
  const result = nakshatraGochara({
    natalMoonLongitude: chart.grahas.Moon.longitude,
    birthPlace: { latitude: input.latitude, longitude: input.longitude, utcOffsetMinutes: input.utcOffsetMinutes ?? 0 },
    atMs: Date.now(),
    ayanamsha: ctx.ayanamsha,
    nodeType: ctx.nodeType ?? 'mean',
    years: 5,
  });
  return JSON.parse(JSON.stringify({ ...result, native: describeMatchParty(input, ctx, profile) }));
}
