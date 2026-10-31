'use server';

import type { BirthFormInput } from '../report/actions';
import { RASI_TA as SIGN_TA } from '@/src/sources/tamilNames';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { lordshipTable } = require('../../src/chart/lordships');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி' };

/** The seven planets that own signs: the ones whose lordships PL9's worksheet lists. */
const LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

export interface LordshipsRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/**
 * House lordships of the birth chart (D1), the Navamsha (D9) and the Dashamsha (D10): the three tables PL9's Lordships
 * worksheet shows. A saved profile is read with its stored settings.
 */
export async function computeLordships(req: LordshipsRequest) {
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
  const longitudes = Object.fromEntries(LORDS.map((p: string) => [p, chart.grahas[p].longitude]));
  const table = (key: 'D1' | 'D9' | 'D10') => lordshipTable(chart.lagna.longitude, longitudes, key).map((row: any) => ({
    ...row,
    signTa: SIGN_TA[row.sign],
    lordTa: PLANET_TA[row.lord],
  }));
  return JSON.parse(JSON.stringify({
    rasi: table('D1'),
    navamsha: table('D9'),
    dashamsha: table('D10'),
    lordTa: PLANET_TA,
    native: describeMatchParty(input, ctx, profile),
  }));
}
