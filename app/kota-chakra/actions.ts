'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { computeTransitPositions } = require('../../src/report/transitPositions');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const KC = require('../../src/report/kotaChakra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SC = require('../../src/report/sanghattaChakra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NAKSHATRA_TA } = require('../../src/report/babyNames');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const ZONE_TA: Record<string, string> = { BAHYA: 'வெளிப்புறம் (பாஹ்ய)', PRAKARA: 'சுவர் (பிராகார)', MADHYA: 'உட்புறம் (மத்ய)' };
const GATE_TA: Record<string, string> = { PRAVESHA: 'நுழைவு', NIRGAMA: 'வெளிப்போக்கு', STAMBHA: 'தூண்' };

const starTa = (name: string) => {
  if (name === 'Abhijit') return 'அபிஜித்';
  const i = KC.STAR_NAMES.indexOf(name);
  return i >= 0 ? NAKSHATRA_TA[i] : name;
};

export interface KotaRequest {
  mode: 'transit' | 'birth';
  /** ISO date-time for the transit mode (UTC); defaults to now. */
  whenIso?: string;
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  /** A star name (as in `KC.STAR_NAMES`) whose striking is asked about in the Sanghatta chakra. */
  focusStar?: string | null;
}

/** The planets of a moment or of a birth chart placed in the Kota Chakra and the Sanghatta Chakra of Narapati's Svarodaya. */
export async function computeKotaSanghatta(req: KotaRequest) {
  let longitudes: Record<string, number> = {};
  let native: any = null;
  let when: string | null = null;
  if (req.mode === 'transit') {
    const d = req.whenIso ? new Date(req.whenIso) : new Date();
    if (Number.isNaN(d.getTime())) throw new Error('தேதி சரியாக இல்லை.');
    const t = computeTransitPositions(d);
    for (const p of t.planets) longitudes[p.planet] = p.longitude;
    when = `${t.date} ${t.time} UTC`;
  } else {
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
    for (const p of KC.PLANETS) longitudes[p] = chart.grahas[p].longitude;
    native = describeMatchParty(input, ctx, profile);
  }
  const focusStar = req.focusStar && KC.STAR_NAMES.includes(req.focusStar) ? req.focusStar : null;
  const kota = KC.kotaChakra(longitudes);
  const sang = SC.sanghatta(longitudes, focusStar);
  return JSON.parse(JSON.stringify({
    mode: req.mode,
    when,
    native,
    focusStar,
    focusStarTa: focusStar ? starTa(focusStar) : null,
    stars: KC.STAR_NAMES.map((s: string) => ({ id: s, ta: starTa(s) })),
    kota: {
      placed: kota.placed.map((p: any) => ({ ...p, planetTa: PLANET_TA[p.planet], starTa: starTa(p.star), zoneTa: ZONE_TA[p.zone], gateTa: GATE_TA[p.gate] })),
      matches: kota.matches,
      source: kota.source, scope: kota.scope, notNeeded: kota.notNeeded,
    },
    sanghatta: {
      placed: sang.placed.map((p: any) => ({ ...p, planetTa: PLANET_TA[p.planet], starTa: starTa(p.star) })),
      vedha: sang.vedha.map((v: any) => ({ aTa: starTa(v.a), bTa: starTa(v.b), planetsATa: v.planetsA.map((p: string) => PLANET_TA[p]), planetsBTa: v.planetsB.map((p: string) => PLANET_TA[p]) })),
      strikers: sang.strikers.map((p: any) => ({ planetTa: PLANET_TA[p.planet], starTa: starTa(p.star) })),
      matches: sang.matches,
      source: sang.source, scope: sang.scope, notBuilt: sang.notBuilt,
    },
  }));
}
