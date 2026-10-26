'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { julianDay } = require('@swisseph/node');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateKpSystem } = require('../../src/report/kpSystem');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const K = require('../../src/report/kpTransit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { chainAtJulianDay } = require('../../src/dasha/timeline');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface KpTransitRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  on: { year: number; month: number; day: number; hour: number; minute: number };
  /** where the ascendant is taken; the birth place when absent (the book: not always the birth place) */
  place?: { latitude: number; longitude: number; utcOffsetMinutes: number; placeName?: string };
  days?: number;
}

const BODIES_FOR_WINDOWS = ['Sun', 'Moon'];

/** KP transit for a chart on a date (src/report/kpTransit.js, Reader V). */
export async function computeKpTransit(req: KpTransitRequest) {
  let input: BirthFormInput;
  let profile: any = null;
  if (req.profile) {
    const library = openLibrary(resolveLibraryPath());
    try {
      const p = library.getProfile(req.profile.profileId, req.profile.revision);
      if (!p) throw new Error(`சுயவிவரம் கிடைக்கவில்லை: ${req.profile.profileId}`);
      input = { ...p.input, ...p.settings };
      profile = p;
    } finally { library.close(); }
  } else if (req.form) {
    input = req.form;
  } else {
    throw new Error('ஒரு சுயவிவரம் அல்லது பிறப்பு விவரம் தேவை.');
  }
  const birth: any = input;
  const place = req.place ?? { latitude: birth.latitude, longitude: birth.longitude, utcOffsetMinutes: birth.utcOffsetMinutes ?? 0, placeName: birth.placeName };
  const days = Math.min(Math.max(req.days ?? 30, 1), 120);
  const jd = julianDay(req.on.year, req.on.month, req.on.day, req.on.hour + req.on.minute / 60 - (place.utcOffsetMinutes || 0) / 60);

  const kp = calculateKpSystem(birth);
  const ctx = createChartContext({ ...birth, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const vim = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, ctx.input.utcOffsetMinutes, { depth: 3 });
  const chain = chainAtJulianDay(vim, jd).slice(0, 3).map((c: any) => c.lord);
  if (chain.length < 3) throw new Error('இந்த தேதியில் விம்சோத்தரி தசை கிடைக்கவில்லை (ஆயுட்காலத்துக்கு வெளியே).');

  const lons = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((b) => [b, K.bodyLongitude(jd, b, 'Krishnamurti', 'mean')]));
  const reading = K.transitReading(kp, lons);
  const points = K.dbaPoints(chain[0], chain[1], chain[2]);
  const windows = BODIES_FOR_WINDOWS.map((body) => ({
    body,
    entries: K.entryWindows({ points: points.byLords, body, fromJd: jd, days: body === 'Sun' ? Math.max(days, 60) : days }).slice(0, 12),
  }));
  const asc = K.ascendantEntries({ points: points.byLords, latitude: place.latitude, longitude: place.longitude, fromJd: jd, hours: 24 });
  return JSON.parse(JSON.stringify({
    source: K.SOURCE, native: describeMatchParty(input, ctx, profile), place, onJd: jd, dba: chain,
    reckoner: K.starReadyReckoner(kp), reading, points: { lords: points.lords, byLords: points.byLords, byStarCount: points.byStar.length }, windows, ascendant: asc,
    positionsNote: 'கிருஷ்ணமூர்த்தி அயனாம்சம், சராசரி ராகு',
  }));
}
