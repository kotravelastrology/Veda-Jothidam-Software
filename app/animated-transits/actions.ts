'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { eventChart } = require('../../src/report/eventChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { stepMoment, partsOf, UNITS } = require('../../src/report/animatedTransit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { speedAt } = require('../../src/chart/graphicalEphemeris');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NAKSHATRA_LORDS } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface TransitPlace { latitude: number; longitude: number; utcOffsetMinutes: number; placeName?: string }
export interface PartyRef { profile?: { profileId: string; revision?: number }; form?: BirthFormInput }

function loadParty(ref: PartyRef) {
  let input: BirthFormInput;
  let profile: any = null;
  if (ref.profile) {
    const library = openLibrary(resolveLibraryPath());
    try {
      const p = library.getProfile(ref.profile.profileId, ref.profile.revision);
      if (!p) throw new Error(`சுயவிவரம் கிடைக்கவில்லை: ${ref.profile.profileId}`);
      input = { ...p.input, ...p.settings };
      profile = p;
    } finally { library.close(); }
  } else if (ref.form) {
    input = ref.form;
  } else {
    throw new Error('ஒரு சுயவிவரம் அல்லது பிறப்பு விவரம் தேவை.');
  }
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  return { input, profile, ctx, chart: calculateParashariChart(ctx) };
}

const mapGrahas = (chart: any) => Object.fromEntries(Object.entries(chart.grahas).map(([k, g]: [string, any]) => [k, { rasiIndex: g.rasiIndex, degreeInSign: g.degreeInSign, longitude: g.longitude, house: g.house }]));

/** The moment at `atMs` against each party's birth chart. */
export async function computeTransitMoment(req: { parties: PartyRef[]; atMs: number; place: TransitPlace }) {
  const out = [];
  for (const ref of req.parties.slice(0, 2)) {
    const { input, profile, ctx, chart } = loadParty(ref);
    const p = partsOf(req.atMs, req.place.utcOffsetMinutes);
    const r = eventChart({ natal: { ctx, chart }, event: { ...p, latitude: req.place.latitude, longitude: req.place.longitude, utcOffsetMinutes: req.place.utcOffsetMinutes }, levels: 5 });
    const jd = r.event.julianDay;
    const planets = r.chart.planets.map((g: any) => {
      const star = Math.floor(g.longitude / (360 / 27));
      const pada = Math.floor((g.longitude % (360 / 27)) / (360 / 108)) + 1;
      const retro = g.planet === 'Rahu' || g.planet === 'Ketu' ? true : g.planet === 'Sun' || g.planet === 'Moon' ? false : speedAt(jd, g.planet, ctx.ayanamsha, ctx.nodeType ?? 'mean') < 0;
      return { planet: g.planet, sign: g.sign, degree: g.degree, longitude: g.longitude, nakshatraIndex: star, pada, nakshatraLord: NAKSHATRA_LORDS[star], retrograde: retro };
    });
    out.push({
      native: describeMatchParty(input, ctx, profile),
      natal: { lagnaLongitude: chart.lagna.longitude, lagnaSign: chart.lagna.rasiIndex, grahas: mapGrahas(chart) },
      transit: { lagnaLongitude: r.eventChart.lagna.longitude, lagnaSign: r.chart.lagnaSign, planets, grahas: mapGrahas(r.eventChart) },
      kakshas: r.kakshas, gochara: r.gochara, dashas: r.dashas,
    });
  }
  return JSON.parse(JSON.stringify({ atMs: req.atMs, parts: partsOf(req.atMs, req.place.utcOffsetMinutes), parties: out }));
}

/** The moment one step on: unit is PL9's (10 Years … Seconds), direction +1 or -1. */
export async function stepTransitMoment(req: { atMs: number; unit: string; direction: 1 | -1; place: TransitPlace; ayanamsha?: string }) {
  if (!UNITS.includes(req.unit)) throw new Error('தெரியாத அலகு');
  return stepMoment(req.atMs, req.unit, req.direction, { latitude: req.place.latitude, longitude: req.place.longitude, utcOffsetMinutes: req.place.utcOffsetMinutes, ayanamsha: req.ayanamsha ?? 'Lahiri' });
}
