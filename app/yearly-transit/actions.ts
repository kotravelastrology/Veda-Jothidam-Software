'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Y = require('../../src/chart/yearlyTransit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { jdToLocal } = require('../../src/chart/graphicalEphemeris');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const MONTH_TA = ['ஜன', 'பிப்', 'மார்', 'ஏப்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக', 'செப்', 'அக்', 'நவ', 'டிச'];
const SHORT_TA: Record<string, string> = { Sun: 'சூ', Mars: 'செ', Mercury: 'பு', Jupiter: 'கு', Venus: 'சு', Saturn: 'சனி', Rahu: 'ரா', Ketu: 'கே' };
const STATION_TA: Record<string, string> = { RETROGRADE: 'வக்ரம் தொடக்கம்', DIRECT: 'நேர்கதி' };

export interface YearlyTransitRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  year: number;
  /** 'UT' (the day PL9 prints) or 'LOCAL' (the birth place's time zone). */
  dateBasis: 'UT' | 'LOCAL';
  /** true: mark retrograde only for the planets PL9 marks; false: mark every planet. */
  pl9Marks: boolean;
}

export async function computeYearlyTransit(req: YearlyTransitRequest) {
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
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const offset = req.dateBasis === 'LOCAL' ? (input.utcOffsetMinutes ?? 0) : 0;
  const year = Math.min(Math.max(Math.round(req.year), 1900), 2100);
  const t = Y.yearlyTransit({ year, utcOffsetMinutes: offset, ayanamsha: chart.ayanamsha, nodeType: chart.nodeType ?? 'mean' });
  const fmt = (jd: number) => { const s = jdToLocal(jd, offset); return `${MONTH_TA[Number(s.slice(5, 7)) - 1]} ${Number(s.slice(8, 10))}`; };
  const opts = { marked: req.pl9Marks ? Y.PL9_MARKED : Y.PLANETS, yearStart: 'ஜன 1', yearEnd: 'டிச 31', entireYear: 'முழு ஆண்டு', names: SHORT_TA, to: ' – ' };
  const cells = t.bySign.map((stays: any[]) => stays.map((s) => ({
    text: Y.stayLine(s, fmt, opts),
    retrograde: s.retrogradeAtStart,
    stations: s.stations.map((x: any) => `${STATION_TA[x.kind]} ${fmt(x.jd)}`),
  })));
  return JSON.parse(JSON.stringify({
    year, dateBasis: req.dateBasis, cells, chart,
    native: describeMatchParty(input, ctx, profile),
  }));
}
