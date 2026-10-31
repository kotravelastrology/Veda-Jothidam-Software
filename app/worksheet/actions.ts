'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildReportData } = require('../../src/report/reportData');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { planetLongitude } = require('../../src/ephemeris/siderealPositions');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const W = require('../../src/worksheet/worksheetData');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateVargas } = require('../../src/chart/vargaChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface WorksheetRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  /** The settings' ayanamsha, house system and node type; a saved profile keeps its own. */
  engine?: { ayanamsha?: string; houseSystem?: string; nodeType?: 'mean' | 'true' };
  /** The settings' Dasha Year and Dasha Balance Method; the defaults are the engine's. */
  dashaOptions?: { yearDays: number; balance: 'degree' | 'time' };
}

/**
 * Everything the birth-chart worksheet shows for one person: the Rasi and the divisional charts, the house strengths, the
 * planet and strength tables, the Shad Bala graph's figures and the dasha list. One calculation, so every cell of the
 * worksheet reads the same chart. A saved profile is read with its stored settings.
 */
export async function computeWorksheet(req: WorksheetRequest) {
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

  const report = buildReportData(input);
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const options = req.dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  const periods = await withEphemeris({ ayanamsha: report.chart.ayanamsha }, async () => {
    const tree = buildVimshottariDasha(report.chart.julianDay, report.chart.grahas.Moon.longitude, input.utcOffsetMinutes ?? 0, {
      depth: 2,
      yearDays: options.yearDays,
      balance: options.balance,
      moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', report.chart.ayanamsha),
    });
    return W.flattenDasha(tree);
  });

  // The report's divisional charts cover the seven planets; PL9 draws Rahu, Ketu and Gulika in them too
  const gulika = W.gulikaRow(report.upagraha);
  const vargas = { ...report.vargas };
  for (const node of W.NODES) vargas[node] = calculateVargas(report.chart.grahas[node].rasiIndex, report.chart.grahas[node].degreeInSign);
  if (gulika) vargas.Gulika = calculateVargas(gulika.rasiIndex, gulika.degreeInSign);

  return JSON.parse(JSON.stringify({
    native: describeMatchParty(input, ctx, profile),
    birth: {
      name: input.name, gender: input.gender, year: input.year, month: input.month, day: input.day, hour: input.hour,
      minute: input.minute, placeName: input.placeName, latitude: input.latitude, longitude: input.longitude,
      utcOffsetMinutes: input.utcOffsetMinutes,
    },
    engine: { ayanamsha: report.chart.ayanamsha, houseSystem: report.chart.houseSystem, nodeType: report.chart.nodeType },
    lagnaRasiIndex: report.chart.lagna.rasiIndex,
    planets: W.planetRows(report.chart),
    strength: W.strengthRows(report),
    houses: W.houseRows(report),
    // The chart cells' own adapters read these (src/charts/kattam/rasiNames.ts)
    chart: { lagna: report.chart.lagna, grahas: report.chart.grahas },
    vargas,
    gulika,
    sarva: report.ashtakavarga.sarva,
    periods,
    dashaYearDays: options.yearDays,
    balance: options.balance,
  }));
}
