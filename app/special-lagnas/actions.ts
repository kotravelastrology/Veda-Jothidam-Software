'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SL = require('../../src/chart/specialLagnas');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sunriseBefore } = require('../../src/chart/sunriseBefore');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

export interface SpecialLagnasRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  /** 'visible' (the Panchangam's sunrise) or 'geometric' (the Sun's centre on the horizon; PL9's). */
  sunriseKind?: 'visible' | 'geometric';
}

const dmsOf = (lon: number) => {
  const inSign = lon % 30;
  const d = Math.floor(inSign);
  let m = Math.floor((inSign - d) * 60);
  let s = Math.round(((inSign - d) * 60 - m) * 60);
  if (s === 60) { s = 0; m += 1; }
  return { d, m, s };
};

/** Bhava, Hora and Ghatika Lagna (BPHS ch.5) and Varnada Lagna of a birth, with the planets in each lagna's houses. */
export async function computeSpecialLagnas(req: SpecialLagnasRequest) {
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
  const kind = req.sunriseKind === 'geometric' ? 'geometric' : 'visible';
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const sr = sunriseBefore(chart.julianDay, input.latitude, input.longitude, chart.ayanamsha, kind);
  const sl = SL.specialLagnas({ lagnaLongitude: chart.lagna.longitude, sunLongitudeAtSunrise: sr.sunLongitudeAtSunrise, hoursSinceSunrise: sr.hoursSinceSunrise });
  const planetSigns = Object.fromEntries(PLANETS.map((p) => [p, chart.grahas[p].rasiIndex]));
  const housesFrom = (signIndex: number) => Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    signTa: SIGN_TA[(signIndex + i) % 12],
    planetsTa: PLANETS.filter((p) => planetSigns[p] === (signIndex + i) % 12).map((p) => PLANET_TA[p]),
  }));
  const entry = (key: string, nameTa: string, lon: number) => ({ key, nameTa, longitude: lon, signIndex: Math.floor(lon / 30), signTa: SIGN_TA[Math.floor(lon / 30)], dms: dmsOf(lon), houses: housesFrom(Math.floor(lon / 30)) });
  const varnadaSign = sl.varnada.sign - 1;
  return JSON.parse(JSON.stringify({
    sunriseKind: kind,
    hoursSinceSunrise: sr.hoursSinceSunrise,
    ghatis: sl.ghatisSinceSunrise,
    sunAtSunrise: sr.sunLongitudeAtSunrise,
    lagnas: [
      entry('janma', 'ஜென்ம லக்னம்', chart.lagna.longitude),
      entry('bhava', 'பாவ லக்னம்', sl.bhava),
      entry('hora', 'ஹோரா லக்னம்', sl.hora),
      entry('ghatika', 'கடிகா லக்னம்', sl.ghatika),
    ],
    varnada: { signIndex: varnadaSign, signTa: SIGN_TA[varnadaSign], counts: sl.varnada.counts, total: sl.varnada.total, houses: housesFrom(varnadaSign) },
    source: sl.source,
    native: describeMatchParty(input, ctx, profile),
  }));
}
