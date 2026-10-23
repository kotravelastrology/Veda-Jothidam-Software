'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SB = require('../../src/chart/sripatiBhava');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

export interface SripatiBhavaRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

const pos = (lon: number) => {
  const l = ((lon % 360) + 360) % 360;
  const sign = Math.floor(l / 30);
  const inSign = l - sign * 30;
  const d = Math.floor(inSign);
  let m = Math.floor((inSign - d) * 60);
  let s = Math.round(((inSign - d) * 60 - m) * 60);
  if (s === 60) { s = 0; m += 1; }
  return { signTa: SIGN_TA[sign], d, m, s };
};

/** The twelve bhava points (the trisected points of Lagna, 4th, 7th, 10th), their Sandhis and each planet's bhava and effect (Sripatipaddhati I.6-11). */
export async function computeSripatiBhava(req: SripatiBhavaRequest) {
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
  // the trisection of the four angles is the book's method, whatever house system the profile was saved with
  const ctx = createChartContext({ ...input, houseSystem: 'Porphyrius', calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const points: number[] = Array.from({ length: 12 }, (_, i) => chart.cusps[i + 1]);
  const sandhis: number[] = SB.sandhis(points);
  const rows = Array.from({ length: 12 }, (_, i) => ({
    bhava: i + 1,
    point: pos(points[i]),
    start: pos(sandhis[(i + 11) % 12]),
    end: pos(sandhis[i]),
  }));
  const planets = PLANETS.map((name) => {
    const lon = chart.grahas[name].longitude;
    const e = SB.bhavaEffect(lon, points);
    return {
      name,
      nameTa: PLANET_TA[name],
      position: pos(lon),
      cuspHouse: chart.grahas[name].house,
      bhava: e.bhava,
      fraction: e.fraction,
      phase: e.phase,
      toSandhi: e.distance,
    };
  });
  return JSON.parse(JSON.stringify({ rows, planets, source: SB.SOURCE, native: describeMatchParty(input, ctx, profile) }));
}
