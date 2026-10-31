'use server';

import type { BirthFormInput } from '../report/actions';
import { RASI_TA as SIGN_TA } from '@/src/sources/tamilNames';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RS = require('../../src/dasha/bphsRashiDashas');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };

export interface BphsRashiDashaRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  system: string;
}

export async function loadBphsRashiSystems() {
  return JSON.parse(JSON.stringify(Object.keys(RS.SYSTEMS).map((id) => ({ id, nameTa: RS.NAMES_TA[id], source: RS.SOURCES[id] }))));
}

export async function loadBphsRashiDeclared() {
  return JSON.parse(JSON.stringify(RS.DECLARED_TA));
}

/** One sign dasha from birth (two rounds, as the book repeats the order), with the chart facts it was built from. */
export async function computeBphsRashiDasha(req: BphsRashiDashaRequest) {
  if (!RS.SYSTEMS[req.system]) throw new Error(`தெரியாத தசை முறை: ${req.system}`);
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
  const degrees = Object.fromEntries(Object.keys(PLANET_TA).map((p) => [p, chart.grahas[p].longitude % 30]));
  const lagnaSign = Math.floor(chart.lagna.longitude / 30);
  const birthMs = (chart.julianDay - 2440587.5) * 86400000;
  const result = RS.SYSTEMS[req.system]({ signs, degrees, lagnaSign, lagnaLongitude: chart.lagna.longitude, moonFraction: (chart.grahas.Moon.longitude % (360 / 27)) / (360 / 27) });
  const rows = RS.schedule(result, birthMs, 2).map((p: any) => ({
    cycle: p.cycle, sign: p.sign, signTa: SIGN_TA[p.sign], years: p.years,
    targetTa: p.target == null ? null : SIGN_TA[p.target],
    startDate: new Date(p.startMs).toISOString().slice(0, 10), endDate: new Date(p.endMs).toISOString().slice(0, 10),
  }));
  return JSON.parse(JSON.stringify({
    system: { id: req.system, nameTa: RS.NAMES_TA[req.system], source: RS.SOURCES[req.system] },
    start: result.start, startTa: result.start == null ? null : SIGN_TA[result.start], forward: result.forward ?? null,
    reasonTa: result.reasonTa ?? null,
    brahma: req.system === 'sthira' ? { planet: result.detail.planet, planetTa: result.detail.planet ? PLANET_TA[result.detail.planet] : null, signTa: result.detail.sign == null ? null : SIGN_TA[result.detail.sign], baseTa: SIGN_TA[result.detail.base] }
      : (req.system === 'jaimini-sthira' || req.system === 'jaimini-sthira-zodiacal') ? { planet: result.detail.brahma, planetTa: result.detail.brahma ? PLANET_TA[result.detail.brahma] : null, signTa: result.detail.sign == null ? null : SIGN_TA[result.detail.sign], baseTa: SIGN_TA[result.detail.reference], replacedFromTa: result.detail.replacedFrom ? PLANET_TA[result.detail.replacedFrom] : null }
      : null,
    lagnaTa: SIGN_TA[lagnaSign],
    periods: rows,
    native: describeMatchParty(input, ctx, profile),
  }));
}
