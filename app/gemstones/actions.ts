'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gemReading } = require('../../src/report/gemstones');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface GemRequest {
  /** A saved profile, or details typed into the form. Exactly one. */
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

/**
 * What each book says to wear for this person's Ascendant (and Moon sign).
 *
 * It does not choose a gem. The books give three different methods and differ
 * on particular gems for the same Ascendant, so each is shown with its page and
 * the places they agree and disagree are marked.
 *
 * A saved profile is read with its stored settings, not page defaults: the
 * Ascendant and Moon sign — the only inputs — move with the ayanamsha.
 */
export async function computeGems(req: GemRequest) {
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
  const rasi: Record<string, number> = {};
  for (const g of GRAHAS) rasi[g] = chart.grahas[g].rasiIndex;
  return JSON.parse(JSON.stringify({
    ...gemReading({ lagna: chart.lagna.rasiIndex, moon: rasi.Moon, rasi }),
    native: describeMatchParty(input, ctx, profile),
  }));
}
