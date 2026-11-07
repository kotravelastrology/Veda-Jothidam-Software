'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { evaluateHealth } = require('../../src/report/healthBphs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { d9Rashi } = require('../../src/report/panchaVargeeyaBala');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateUpagrahas } = require('../../src/report/upagraha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export interface HealthRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/** Health as BPHS gives it (src/report/healthBphs.js): dhatus, limbs by the sthoola and sookshma schemes, and the Sixth House chapter's conditions. */
export async function computeHealth(req: HealthRequest) {
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
  let mandiLongitude: number | null = null;
  try {
    const up = calculateUpagrahas({
      sunLongitude: chart.grahas.Sun.longitude, birthJd: chart.julianDay, year: ctx.input.year, month: ctx.input.month, day: ctx.input.day,
      utcOffsetMinutes: ctx.input.utcOffsetMinutes, latitude: ctx.input.latitude, longitude: ctx.input.longitude, ayanamsha: ctx.ayanamsha, sunrise: ctx.sunrise,
    });
    mandiLongitude = up.upagrahas?.Mandi?.longitude ?? null;
  } catch { /* Mandi stays unknown and the rule that needs it says so */ }
  const planets = Object.fromEntries(PLANETS.map((p) => [p, { longitude: chart.grahas[p].longitude }]));
  const result = evaluateHealth({
    lagnaSign: chart.lagna.rasiIndex, lagnaLongitude: chart.lagna.longitude, planets, mandiLongitude,
    navamshaSign: (p: string) => d9Rashi(planets[p].longitude), navamshaLagnaSign: d9Rashi(chart.lagna.longitude),
  });
  return JSON.parse(JSON.stringify({ ...result, native: describeMatchParty(input, ctx, profile) }));
}
