'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { planetLongitude, nodeLongitude } = require('../../src/ephemeris/siderealPositions');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DE = require('../../src/report/dashaEffects');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const B = require('../../src/dasha/dashaBrowser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const T = require('../../src/report/nakshatraGocharaTables');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

export interface DashaBrowserRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  /** The settings' ayanamsha, house system and node type; a saved profile keeps its own. */
  engine?: { ayanamsha?: string; houseSystem?: string; nodeType?: 'mean' | 'true' };
  /** The settings' Dasha Year and Dasha Balance Method; the defaults are the engine's. */
  dashaOptions?: { yearDays: number; balance: 'degree' | 'time' };
}

/**
 * What the dasha browser starts from: the nine mahadashas (the browser divides them further itself, see dashaDrill.js), where
 * each planet is in the birth chart, and what BPHS chapters 47 and 48 say of each planet's dasha with the chart's placements
 * checked. A saved profile is read with its stored settings.
 */
export async function computeDashaBrowser(req: DashaBrowserRequest) {
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
    input = { ...req.form, ...(req.engine ?? {}) };
  } else {
    throw new Error('ஒரு சுயவிவரம் அல்லது பிறப்பு விவரம் தேவை.');
  }

  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const options = req.dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  const { chart, mahadashas } = await withEphemeris({ ayanamsha: ctx.ayanamsha }, async () => {
    const c = calculateParashariChart(ctx);
    const tree = buildVimshottariDasha(c.julianDay, c.grahas.Moon.longitude, input.utcOffsetMinutes ?? 0, {
      depth: 1,
      yearDays: options.yearDays,
      balance: options.balance,
      moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', ctx.ayanamsha),
    });
    return { chart: c, mahadashas: tree.dashas.map((d: any) => ({ lord: d.lord, startJd: d.startJulianDay, endJd: d.endJulianDay })) };
  });

  const signs = Object.fromEntries(B.GRAHAS.map((p: string) => [p, chart.grahas[p].rasiIndex]));
  const degrees = Object.fromEntries(B.GRAHAS.map((p: string) => [p, chart.grahas[p].longitude % 30]));
  const lagnaSign = Math.floor(chart.lagna.longitude / 30);
  const elongation = (((chart.grahas.Moon.longitude - chart.grahas.Sun.longitude) % 360) + 360) % 360;
  const effects = DE.allDashaEffects({ lagnaSign, signs, degrees, moonWaning: elongation >= 180 });

  return JSON.parse(JSON.stringify({
    native: describeMatchParty(input, ctx, profile),
    birth: {
      name: input.name, gender: input.gender, year: input.year, month: input.month, day: input.day, hour: input.hour,
      minute: input.minute, placeName: input.placeName, latitude: input.latitude, longitude: input.longitude,
      utcOffsetMinutes: input.utcOffsetMinutes,
    },
    engine: { ayanamsha: ctx.ayanamsha, nodeType: ctx.nodeType ?? input.nodeType ?? 'mean' },
    utcOffsetMinutes: input.utcOffsetMinutes ?? 0,
    mahadashas,
    dashaYearDays: options.yearDays,
    balance: options.balance,
    lagnaRasiIndex: chart.lagna.rasiIndex,
    natal: B.natalFacts(chart).map((f: any) => ({ ...f, planetTa: PLANET_TA[f.id], signTa: SIGN_TA[f.rasiIndex] })),
    effects: { ...effects, planets: effects.planets.map((p: any) => ({ ...p, planetTa: PLANET_TA[p.planet], signTa: SIGN_TA[p.sign] })) },
    taras: T.TARAS,
    taraSource: T.TARA_SOURCES[0],
    planetTa: PLANET_TA,
    signTa: SIGN_TA,
  }));
}

export interface DashaMomentRequest {
  engine: { ayanamsha: string; nodeType: string };
  jd: number;
  natalLagnaSign: number;
}

/** Where the nine planets stand at a Julian day (the start of the selected period): sign, degrees, house from the birth ascendant, dignity of the sign. */
export async function computeDashaMoment(req: DashaMomentRequest) {
  const positions = await withEphemeris({ ayanamsha: req.engine.ayanamsha }, async () => {
    const longitudes: Record<string, number> = {};
    for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) longitudes[p] = planetLongitude(req.jd, p, req.engine.ayanamsha);
    longitudes.Rahu = nodeLongitude(req.jd, req.engine.ayanamsha, req.engine.nodeType === 'true' ? 'true' : 'mean');
    longitudes.Ketu = (longitudes.Rahu + 180) % 360;
    return longitudes;
  });
  return JSON.parse(JSON.stringify(B.momentFacts(positions, req.natalLagnaSign).map((m: any) => ({ ...m, planetTa: PLANET_TA[m.id], signTa: SIGN_TA[m.rasiIndex] }))));
}
