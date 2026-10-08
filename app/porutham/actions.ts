'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateTamilPorutham, moonToStar } = require('../../src/report/tamilPorutham');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateExtendedPorutham } = require('../../src/report/extendedPorutham');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty, assertDistinctParties } = require('../../src/report/matchParties');

function moonStarAndSun(input: BirthFormInput) {
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  return {
    ...moonToStar(chart.grahas.Moon.longitude),
    moonLongitude: chart.grahas.Moon.longitude,
    sunLongitude: chart.grahas.Sun.longitude,
    chart,
    context: ctx,
  };
}

function match(girl: BirthFormInput, boy: BirthFormInput, parties: unknown) {
  const g = moonStarAndSun(girl);
  const b = moonStarAndSun(boy);
  return JSON.parse(JSON.stringify({
    ...calculateTamilPorutham(g, b),
    extended: calculateExtendedPorutham(g, b),
    girlChart: g.chart,
    boyChart: b.chart,
    // Which two people, from where, on what date, under which method — so a
    // match on screen can never be read without knowing whose it is (VJ-018).
    parties: parties ?? {
      girl: describeMatchParty(girl, g.context),
      boy: describeMatchParty(boy, b.context),
    },
  }));
}

/** `girl` = bride, `boy` = groom (the classical poruthams are asymmetric). */
export async function computePorutham(girl: BirthFormInput, boy: BirthFormInput) {
  assertDistinctParties(girl, boy);
  return match(girl, boy, null);
}

export interface PartyRef {
  profileId: string;
  revision?: number;
}

/**
 * Match two saved profiles from the VJ-011 library.
 *
 * Reads each party's *stored* settings rather than page defaults: two charts
 * saved under different ayanamshas can give different Moon nakshatras, and a
 * match computed under a setting neither profile was saved with belongs to
 * neither of them.
 */
export async function computePoruthamForProfiles(girl: PartyRef, boy: PartyRef) {
  const library = openLibrary(resolveLibraryPath());
  try {
    const g = library.getProfile(girl.profileId, girl.revision);
    const b = library.getProfile(boy.profileId, boy.revision);
    if (!g) throw new Error(`மணமகள் சுயவிவரம் கிடைக்கவில்லை: ${girl.profileId}`);
    if (!b) throw new Error(`மணமகன் சுயவிவரம் கிடைக்கவில்லை: ${boy.profileId}`);

    const gi = { ...g.input, ...g.settings };
    const bi = { ...b.input, ...b.settings };
    assertDistinctParties(gi, bi, {
      girlProfileId: g.profileId,
      boyProfileId: b.profileId,
      girlName: g.name,
      boyName: b.name,
    });

    const gCtx = createChartContext({ ...gi, calendarMode: 'tirukanita' });
    const bCtx = createChartContext({ ...bi, calendarMode: 'tirukanita' });
    return match(gi, bi, {
      girl: describeMatchParty(gi, gCtx, g),
      boy: describeMatchParty(bi, bCtx, b),
    });
  } finally {
    library.close();
  }
}
