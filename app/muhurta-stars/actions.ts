'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { muhurtaStarChecks, MAX_DAYS } = require('../../src/report/muhurtaStars');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface MuhurtaStarsRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  /** First day (YYYY-MM-DD, the person's local date); today when omitted. */
  fromDate?: string;
  days?: number;
}

/**
 * The muhurta star over a period for one person: Latta for anyone, and the
 * person's birth star, 88th and 108th padas and Vainashika. A saved profile is
 * read with its stored settings; the lagna (for the 88th-pada remedy) is for the
 * birth place.
 */
export async function computeMuhurtaStars(req: MuhurtaStarsRequest) {
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
  const off = input.utcOffsetMinutes ?? 0;
  const days = Math.min(Math.max(Math.round(req.days ?? 30), 1), MAX_DAYS);
  const now = Date.now();
  // Local midnight of the first day, in the person's offset.
  const localToday = new Date(now + off * 60000).toISOString().slice(0, 10);
  const fromDate = /^\d{4}-\d{2}-\d{2}$/.test(req.fromDate ?? '') ? req.fromDate! : localToday;
  const fromMs = Date.parse(`${fromDate}T00:00:00Z`) - off * 60000;
  const result = muhurtaStarChecks({
    natalMoonLongitude: chart.grahas.Moon.longitude,
    fromMs, toMs: fromMs + days * 86400000, atMs: now,
    ayanamsha: ctx.ayanamsha, nodeType: ctx.nodeType ?? 'mean',
    latitude: input.latitude, longitude: input.longitude,
  });
  return JSON.parse(JSON.stringify({
    ...result, fromDate, days,
    displayOffsetMinutes: off,
    native: describeMatchParty(input, ctx, profile),
  }));
}
