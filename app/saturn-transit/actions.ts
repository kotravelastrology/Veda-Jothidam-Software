'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { computeSaturnTransits, DEFAULT_KANTAKA, KANTAKA_CONVENTIONS } = require('../../src/report/saturnTransit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface SaturnRequest {
  /** A saved profile, or details typed into the form. Exactly one. */
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  kantakaConvention?: string;
  horizonYears?: number;
}

/** UTC milliseconds of the birth moment. */
function birthUtcMs(i: BirthFormInput) {
  return Date.UTC(i.year, i.month - 1, i.day, i.hour, i.minute ?? 0)
    - (i.utcOffsetMinutes ?? 0) * 60000;
}

function forNative(input: BirthFormInput, kantakaConvention: string | undefined, horizonYears: number | undefined,
  profile: any | null) {
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const moonRasiIndex: number = chart.grahas.Moon.rasiIndex;
  // The birth star, for the Tamil text's Anga Sani, which counts in nakshatras.
  const moonNakshatraIndex = Math.floor(chart.grahas.Moon.longitude / (360 / 27)) % 27;

  // Saturn is counted from the Moon's sign, so the *Moon's* sign is the one
  // input that matters — and it depends on the ayanamsha the chart was cast
  // under. The transit is scanned under that same ayanamsha, never the page's.
  const result = computeSaturnTransits({
    moonRasiIndex,
    moonNakshatraIndex,
    birthMs: birthUtcMs(input),
    horizonYears: horizonYears ?? 100,
    ayanamsha: ctx.ayanamsha,
    kantakaConvention: kantakaConvention ?? DEFAULT_KANTAKA,
  });

  return JSON.parse(JSON.stringify({
    ...result,
    native: describeMatchParty(input, ctx, profile),
    moonLongitude: chart.grahas.Moon.longitude,
  }));
}

/**
 * Sade Sati, Ardhashtama, Ashtama and Kantaka Saturn for one person.
 *
 * A saved profile is read with its *stored* settings, not page defaults: the
 * Moon's sign — and so every house Saturn is counted from — moves with the
 * ayanamsha, and a result computed under a setting the profile was not saved
 * with belongs to nobody.
 */
export async function computeSaturn(req: SaturnRequest) {
  if (req.kantakaConvention && !KANTAKA_CONVENTIONS[req.kantakaConvention]) {
    throw new Error(`தெரியாத கண்டகச் சனி முறை: ${req.kantakaConvention}`);
  }
  if (req.profile) {
    const library = openLibrary(resolveLibraryPath());
    try {
      const p = library.getProfile(req.profile.profileId, req.profile.revision);
      if (!p) throw new Error(`சுயவிவரம் கிடைக்கவில்லை: ${req.profile.profileId}`);
      return forNative({ ...p.input, ...p.settings }, req.kantakaConvention, req.horizonYears, p);
    } finally {
      library.close();
    }
  }
  if (req.form) return forNative(req.form, req.kantakaConvention, req.horizonYears, null);
  throw new Error('ஒரு சுயவிவரம் அல்லது பிறப்பு விவரம் தேவை.');
}
