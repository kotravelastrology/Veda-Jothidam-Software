'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { kakshyaTransit } = require('../../src/report/kakshyaTransit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface KakshyaTransitRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  /** 'PATEL_BHAVA' (default) or 'SIGN'. */
  method?: string;
  /** The moment to read, as the person's local date and time; now when omitted. */
  date?: string;
  time?: string;
}

/**
 * Where each planet stands among the Kakshyas now (or at a chosen moment), by the birth chart's own Ashtakavarga,
 * and the dated windows around it. A saved profile is read with its stored settings.
 */
export async function computeKakshyaTransit(req: KakshyaTransitRequest) {
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
  if (req.method && !['PATEL_BHAVA', 'SIGN'].includes(req.method)) throw new Error(`தெரியாத காக்ஷ்யா முறை: ${req.method}`);
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const off = input.utcOffsetMinutes ?? 0;
  let atMs = Date.now();
  if (req.date && /^\d{4}-\d{2}-\d{2}$/.test(req.date)) {
    const t = /^\d{2}:\d{2}$/.test(req.time ?? '') ? req.time : '12:00';
    atMs = Date.parse(`${req.date}T${t}:00Z`) - off * 60000;
    if (!Number.isFinite(atMs)) throw new Error('தேதி சரியில்லை.');
  }
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const longitudes = Object.fromEntries(planets.map((p) => [p, chart.grahas[p].longitude]));
  const result = kakshyaTransit({
    natal: { lagnaLongitude: chart.lagna.longitude, mcLongitude: chart.mc, longitudes },
    atMs, ayanamsha: ctx.ayanamsha, method: req.method ?? 'PATEL_BHAVA',
  });
  return JSON.parse(JSON.stringify({
    ...result, displayOffsetMinutes: off, native: describeMatchParty(input, ctx, profile),
  }));
}
