'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { rogaArambha, rogaArambhaTable } = require('../../src/report/rogaArambha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface RogaArambhaRequest {
  /** The patient, for the birth-star rules (tara, tri-nadi); the table needs no one. */
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  /** When the illness began, as the local wall-clock date and time at `place`. */
  onset: { date: string; time: string; utcOffsetMinutes: number };
  place: { latitude: number; longitude: number };
  snakeBite?: boolean;
}

/** All 27 stars, book by book — nothing personal. */
export async function computeRogaArambhaTable() {
  return JSON.parse(JSON.stringify(rogaArambhaTable()));
}

/**
 * What each book says of an illness that began at this moment. A patient is optional: with a saved
 * profile or a birth form the birth-star rules are worked out too.
 */
export async function computeRogaArambha(req: RogaArambhaRequest) {
  const { date, time, utcOffsetMinutes } = req.onset;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) throw new Error('நோய் தொடங்கிய தேதி, நேரம் தேவை.');
  const off = Number.isFinite(utcOffsetMinutes) ? utcOffsetMinutes : 0;
  const atMs = Date.parse(`${date}T${time}:00Z`) - off * 60000;
  if (!Number.isFinite(atMs)) throw new Error('தேதி அல்லது நேரம் சரியில்லை.');
  const { latitude, longitude } = req.place;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) throw new Error('இடத்தின் அட்சரேகை, தீர்க்கரேகை சரியில்லை.');

  let input: BirthFormInput | null = null;
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
  }
  let natalMoonLongitude: number | null = null;
  let native: any = null;
  let ayanamsha = 'Lahiri';
  if (input) {
    const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
    natalMoonLongitude = calculateParashariChart(ctx).grahas.Moon.longitude;
    ayanamsha = ctx.ayanamsha;
    native = describeMatchParty(input, ctx, profile);
  }
  const result = rogaArambha({ atMs, latitude, longitude, utcOffsetMinutes: off, ayanamsha, natalMoonLongitude, snakeBite: Boolean(req.snakeBite) });
  return JSON.parse(JSON.stringify({ ...result, displayOffsetMinutes: off, native }));
}
