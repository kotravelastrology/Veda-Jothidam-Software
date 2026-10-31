'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { planetLongitude } = require('../../src/ephemeris/siderealPositions');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dashaChangesInMonth, daysInMonth, firstWeekday } = require('../../src/dasha/dashaCalendar');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };

export interface DashaCalendarRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  year: number;
  month: number;
  /** The settings' Dasha Year and Dasha Balance Method; the defaults are the engine's. */
  dashaOptions?: { yearDays: number; balance: 'degree' | 'time' };
}

/**
 * The Vimshottari dashas in calendar form for one month (PL9 "Calendar"): the days on which a new mahadasha-antardasha
 * combination begins. A saved profile is read with its stored settings.
 */
export async function computeDashaCalendar(req: DashaCalendarRequest) {
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
  if (!Number.isInteger(req.month) || req.month < 1 || req.month > 12) throw new RangeError('month must be 1-12');

  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const options = req.dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  const { days } = await withEphemeris({ ayanamsha: ctx.ayanamsha }, async () => {
    const chart = calculateParashariChart(ctx);
    const tree = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, input.utcOffsetMinutes ?? 0, {
      depth: 2,
      yearDays: options.yearDays,
      balance: options.balance,
      moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', ctx.ayanamsha),
    });
    return { days: dashaChangesInMonth(tree, req.year, req.month) };
  });

  return JSON.parse(JSON.stringify({
    year: req.year,
    month: req.month,
    daysInMonth: daysInMonth(req.year, req.month),
    firstWeekday: firstWeekday(req.year, req.month),
    days: days.map((d: any) => ({
      ...d,
      changes: d.changes.map((c: any) => ({ ...c, mahadashaTa: PLANET_TA[c.mahadasha], antardashaTa: PLANET_TA[c.antardasha] })),
    })),
    dashaYearDays: options.yearDays,
    balance: options.balance,
    native: describeMatchParty(input, ctx, profile),
  }));
}
