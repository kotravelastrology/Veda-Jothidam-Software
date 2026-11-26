'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildDasha } = require('../../src/dasha/nakshatraDashaEngine');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const R = require('../../src/dasha/rareDashas');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const B = require('../../src/dasha/bphsDashas');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NAKSHATRA_TA } = require('../../src/report/babyNames');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const SYSTEM_IDS = ['ashtottari', 'shodashottari', 'dwadashottari', 'panchottari', 'shatabdika', 'chaturashiti-sama', 'dwisaptati-sama', 'shattrimshat-sama'];
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };

export interface BphsDashaRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  system: string;
}

/** The systems and what the register says of each (no person needed). */
export async function loadBphsDashaSystems() {
  return JSON.parse(JSON.stringify(SYSTEM_IDS.map((id) => {
    const m = R.getMethod(id);
    return { id, name: m.name, nameTa: m.nameTa, level: m.level, levelTa: m.levelTa, notes: m.notes, source: m.source, totalYears: R.getTable(id).totalYears, cycle: R.getTable(id).cycle, years: R.getTable(id).years, whenTa: id === 'ashtottari' ? B.ASHTOTTARI_WHEN_TA : B.SYSTEMS[id].whenTa };
  })));
}

/**
 * One system's mahadashas and antardashas from birth, with the condition the verse names checked against the chart.
 * A saved profile is read with its stored settings.
 */
export async function computeBphsDasha(req: BphsDashaRequest) {
  if (!SYSTEM_IDS.includes(req.system)) throw new Error(`தெரியாத தசை முறை: ${req.system}`);
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
  const moon = chart.grahas.Moon.longitude;
  const sun = chart.grahas.Sun.longitude;
  const birthMs = (chart.julianDay - 2440587.5) * 86400000;
  const signs = Object.fromEntries(Object.keys(PLANET_TA).map((p) => [p, chart.grahas[p].rasiIndex]));
  const lagnaSign = Math.floor(chart.lagna.longitude / 30);
  const sunHouse = ((signs.Sun - lagnaSign + 12) % 12) + 1;
  const elong = (((moon - sun) % 360) + 360) % 360;
  const facts = { lagnaLongitude: chart.lagna.longitude, signs, paksha: elong < 180 ? 'SHUKLA' : 'KRISHNA', day: sunHouse >= 7 };
  const table = R.getTable(req.system);
  const cycles = Math.min(Math.ceil(120 / table.totalYears), 4);
  const d = buildDasha(table, { birthMs, moonLongitude: moon, depth: 2, cycles });
  const method = R.getMethod(req.system);
  const conv = (p: any) => ({
    lord: p.lord, lordTa: PLANET_TA[p.lord], years: p.durationYears, startDate: p.startDate, endDate: p.endDate,
    children: (p.children ?? []).map((c: any) => ({ lord: c.lord, lordTa: PLANET_TA[c.lord], years: c.durationYears, startDate: c.startDate, endDate: c.endDate })),
  });
  const applies = B.applicability(req.system, facts);
  return JSON.parse(JSON.stringify({
    system: { id: req.system, nameTa: method.nameTa, level: method.level, levelTa: method.levelTa, levelNoteTa: method.levelNoteTa, notes: method.notes, source: method.source, totalYears: table.totalYears },
    birth: { starTa: NAKSHATRA_TA[d.birthNakshatraIndex], lord: d.startLord, lordTa: PLANET_TA[d.startLord], balanceYears: d.balanceYears, elapsedFraction: d.elapsedFraction },
    facts: { paksha: facts.paksha, day: facts.day, lagnaSign },
    applies,
    periods: d.periods.map(conv),
    displayOffsetMinutes: input.utcOffsetMinutes ?? 0,
    native: describeMatchParty(input, ctx, profile),
  }));
}
