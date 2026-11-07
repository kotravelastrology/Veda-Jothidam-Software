'use server';

import type { BirthFormInput } from '../report/actions';
import { RASI_TA as SIGN_TA } from '@/src/sources/tamilNames';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const V = require('../../src/chart/vimshopaka');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி' };
const RELATION_TA: Record<string, string> = { own: 'சொந்தம்', greatFriend: 'அதிமித்ரன்', friend: 'மித்ரன்', neutral: 'சமன்', enemy: 'சத்ரு', greatEnemy: 'அதிசத்ரு' };

export interface VimshopakaRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/** The four schemes' Vimshopaka for the seven planets. A saved profile is read with its stored settings. */
export async function computeVimshopaka(req: VimshopakaRequest) {
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
  const signs = Object.fromEntries(V.PLANETS.map((p: string) => [p, chart.grahas[p].rasiIndex]));
  const degrees = Object.fromEntries(V.PLANETS.map((p: string) => [p, chart.grahas[p].longitude % 30]));
  const schemes = Object.keys(V.SCHEMES).map((scheme) => ({
    scheme,
    nameTa: V.SCHEMES[scheme].nameTa,
    planets: V.allVimshopaka({ signs, degrees }, scheme).map((r: any) => ({
      planet: r.planet, planetTa: PLANET_TA[r.planet], total: r.total, reading: r.reading, translatorGrade: r.translatorGrade,
      rows: r.rows.map((x: any) => ({ ...x, signTa: x.sign === null ? null : SIGN_TA[x.sign], lordTa: PLANET_TA[x.lord], relationTa: RELATION_TA[x.relation] })),
    })),
  }));
  return JSON.parse(JSON.stringify({
    schemes,
    source: V.SOURCE,
    tableDiscrepancy: V.TABLE_DISCREPANCY,
    native: describeMatchParty(input, ctx, profile),
  }));
}
