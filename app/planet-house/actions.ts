'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PH = require('../../src/report/planetHouse');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BH = require('../../src/report/bhaveshHouse');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JN = require('../../src/report/janmaNakshatra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DE = require('../../src/report/dashaEffects');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JR = require('../../src/report/janmaRasi');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LR = require('../../src/report/lagnaRasi');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NAKSHATRA_TA } = require('../../src/report/babyNames');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

export interface PlanetHouseRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/** Each planet's house from the lagna and what each book says of it. A saved profile is read with its stored settings. */
export async function computePlanetHouse(req: PlanetHouseRequest) {
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
  const signs = Object.fromEntries(Object.keys(PLANET_TA).map((p) => [p, chart.grahas[p].rasiIndex]));
  const lagnaSign = Math.floor(chart.lagna.longitude / 30);
  const degrees = Object.fromEntries(Object.keys(PLANET_TA).map((p) => [p, chart.grahas[p].longitude % 30]));
  const elongation = (((chart.grahas.Moon.longitude - chart.grahas.Sun.longitude) % 360) + 360) % 360;
  const dashaChart = { lagnaSign, signs, degrees, moonWaning: elongation >= 180 };
  const vim = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, input.utcOffsetMinutes ?? 0, { depth: 1 });
  const nowJd = Date.now() / 86400000 + 2440587.5;
  const currentDasha = vim.dashas.find((d: any) => d.startJulianDay <= nowJd && nowJd < d.endJulianDay)?.lord ?? null;
  const rows = PH.planetHouseReadings({ lagnaSign, signs }).map((r: any) => ({ ...r, planetTa: PLANET_TA[r.planet], signTa: SIGN_TA[r.sign] }));
  return JSON.parse(JSON.stringify({
    lagnaTa: SIGN_TA[lagnaSign],
    rows,
    dashaEffects: { ...DE.allDashaEffects(dashaChart), planets: DE.allDashaEffects(dashaChart).planets.map((p: any) => ({ ...p, planetTa: PLANET_TA[p.planet], signTa: SIGN_TA[p.sign] })), currentDasha },
    lagnaRasi: { readings: LR.readings(lagnaSign) },
    janmaRasi: { ...JR.janmaRasi(signs), signTa: SIGN_TA[signs.Moon], joinedTa: JR.janmaRasi(signs).joined.map((p: string) => PLANET_TA[p]) },
    janma: { ...JN.janmaNakshatra(chart.grahas.Moon.longitude), starTa: NAKSHATRA_TA[JN.starOf(chart.grahas.Moon.longitude) - 1] },
    bhavesh: BH.bhaveshReadings({ lagnaSign, signs }).map((r: any) => ({ ...r, signTa: SIGN_TA[r.sign], lordTa: PLANET_TA[r.lord], lordSignTa: SIGN_TA[r.lordSign] })),
    bhaveshBooks: BH.BOOKS.map((b: any) => ({ id: b.id, source: b.source, scope: b.scope })),
    books: PH.BOOKS.map((b: any) => ({ id: b.id, source: b.source, scope: b.scope })),
    native: describeMatchParty(input, ctx, profile),
  }));
}
