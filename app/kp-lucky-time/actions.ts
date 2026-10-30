'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { julianDay } = require('@swisseph/node');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateKpSystem } = require('../../src/report/kpSystem');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const L = require('../../src/report/kpLuckyTime');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clockOf } = require('../../src/report/kpRulingTime');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface KpLuckyTimeRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  topicId: string;
  /** the day the Moon and the ascendant are taken from, and the start of the span of periods */
  on: { year: number; month: number; day: number };
  /** where the ascendant is taken; the birth place when absent */
  place?: { latitude: number; longitude: number; utcOffsetMinutes: number };
  /** span of dasa-bhukti-anthra periods, in days */
  periodDays?: number;
}

export async function loadKpLuckyTopics() {
  return JSON.parse(JSON.stringify({ topics: L.TOPICS, source: L.SOURCE }));
}

/** Lucky timings of Reader V for a matter and a chart (src/report/kpLuckyTime.js). */
export async function computeKpLuckyTime(req: KpLuckyTimeRequest) {
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
  const place = req.place ?? { latitude: birth.latitude, longitude: birth.longitude, utcOffsetMinutes: birth.utcOffsetMinutes ?? 0 };
  const fromJd = julianDay(req.on.year, req.on.month, req.on.day, 0 - (place.utcOffsetMinutes || 0) / 60);
  const days = Math.min(Math.max(req.periodDays ?? 365, 1), 365 * 40);

  const kp = calculateKpSystem(birth);
  const ctx = createChartContext({ ...birth, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const vim = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, ctx.input.utcOffsetMinutes, { depth: 3 });
  const r = L.luckyTime(kp, vim, { topicId: req.topicId, fromJd, days, ascHours: 24, latitude: place.latitude, longitude: place.longitude });

  const off = place.utcOffsetMinutes || 0;
  const date = (jd: number) => {
    const d = new Date((jd - 2440587.5) * 86400000 + off * 60000);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  };
  return JSON.parse(JSON.stringify({
    source: L.SOURCE, native: describeMatchParty(input, ctx, profile), place, topic: r.topic, eligible: r.eligible,
    periods: r.periods?.map((p: any) => ({ lords: p.lords, from: date(p.startJd), to: date(p.endJd) })) ?? null,
    moon: r.moon?.map((m: any) => ({ starLord: m.starLord, subLord: m.subLord, start: clockOf(m.enterJd, off, fromJd), end: m.leaveJd === null ? null : clockOf(m.leaveJd, off, fromJd) })) ?? null,
    ascendant: r.ascendant?.map((a: any) => ({ signLord: a.signLord, starLord: a.starLord, subLord: a.subLord, from: a.from, start: clockOf(a.startJd, off, fromJd), end: clockOf(a.endJd, off, fromJd), withinMoonWindow: a.withinMoonWindow })) ?? null,
  }));
}
