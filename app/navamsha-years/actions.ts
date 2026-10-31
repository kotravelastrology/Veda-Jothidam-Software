'use server';

import type { BirthFormInput } from '../report/actions';
import { RASI_TA as SIGN_TA } from '@/src/sources/tamilNames';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const N = require('../../src/chart/navamshaCount');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };

export interface NavamshaYearsRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/** The navamsha counts between the ascendant and each planet. A saved profile is read with its stored settings. */
export async function computeNavamshaYears(req: NavamshaYearsRequest) {
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
  const longitudes = Object.fromEntries(N.PLANETS.map((p: string) => [p, chart.grahas[p].longitude]));
  const counts = N.navamshaCounts(chart.lagna.longitude, longitudes);
  return JSON.parse(JSON.stringify({
    lagna: { index: counts.lagnaIndex, signTa: SIGN_TA[Math.floor(counts.lagnaIndex / 9)], place: (counts.lagnaIndex % 9) + 1 },
    planets: counts.planets.map((p: any) => ({ ...p, planetTa: PLANET_TA[p.planet], signTa: SIGN_TA[p.sign] })),
    sources: N.SOURCES,
    native: describeMatchParty(input, ctx, profile),
  }));
}
