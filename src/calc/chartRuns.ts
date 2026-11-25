import type { BirthFormInput } from '../../app/report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { planetLongitude } = require('../ephemeris/siderealPositions');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { personalToday } = require('../report/personalToday');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildReportData } = require('../report/reportData');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ymd, buildBirthParticulars } = require('../report/birthParticulars');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const W = require('../worksheet/worksheetData');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateVargas } = require('../chart/vargaChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../report/matchParties');

/**
 * The calculations behind three pages, kept out of their server actions so that the same code can run in two places: on the server
 * (app/todayActions.ts, app/dasha-timeline/actions.ts, app/worksheet/actions.ts) and, when the server cannot be reached, on the device
 * (src/offline/localEngine.ts, where @swisseph/node is the WebAssembly build of the same library: src/ephemeris/browserSwisseph.js).
 * Nothing here reads files, the chart library or the clock but through its arguments.
 */

export type DashaOptions = { yearDays: number; balance: 'degree' | 'time' };

function mahadashaList(dasha: any) {
  return dasha.dashas.map((d: any) => ({
    lord: d.lord,
    startJd: d.startJulianDay,
    endJd: d.endJulianDay,
    ...(d.fullStartJulianDay !== undefined ? { fullStartJd: d.fullStartJulianDay } : {}),
  }));
}

/** "Today for you" (src/report/personalToday.js) for one chart at `atMs`. */
export async function personalTodayRun(input: BirthFormInput, dashaOptions: DashaOptions | undefined, atMs: number) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart', 'vimshottari'],
  });
  const options = dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  return withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
    const chart = calculateParashariChart(request.chartContext);
    const dasha = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, input.utcOffsetMinutes, {
      depth: 1,
      yearDays: options.yearDays,
      balance: options.balance,
      moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', request.settings.ayanamsha),
    });
    return JSON.parse(JSON.stringify(personalToday({
      natalMoonLongitude: chart.grahas.Moon.longitude,
      mahadashas: mahadashaList(dasha),
      utcOffsetMinutes: input.utcOffsetMinutes,
      atMs,
      ayanamsha: request.settings.ayanamsha,
    })));
  });
}

/**
 * The nine mahadashas of a chart, as Julian days: the dasha page divides them down to five levels itself (src/dasha/dashaDrill.js).
 * The first mahadasha is the balance at birth; `fullStartJd` says where the whole of it began (before birth).
 */
export async function dashaTimelineRun(input: BirthFormInput, dashaOptions?: DashaOptions) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart', 'vimshottari'],
  });
  const options = dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  // VJ-014: the ayanamsha lives in Swiss Ephemeris's global state, so the whole computation runs inside one isolated session.
  return withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
    const chart = calculateParashariChart(request.chartContext);
    const dasha = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, input.utcOffsetMinutes, {
      depth: 1,
      yearDays: options.yearDays,
      balance: options.balance,
      moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', request.settings.ayanamsha),
    });
    return JSON.parse(JSON.stringify({
      mahadashas: mahadashaList(dasha),
      utcOffsetMinutes: input.utcOffsetMinutes,
      birthJd: chart.julianDay,
      moonNakshatraIndex: dasha.birthNakshatraIndex,
      startingLord: dasha.startingLord,
      balance: ymd(dasha.balanceYearsAtBirth),
      dashaYearDays: options.yearDays,
      balanceMethod: options.balance,
      source: dasha.source,
    }));
  });
}

/**
 * Everything the birth-chart worksheet shows for one person (input already resolved: a form, or a saved profile's stored input and
 * settings): the Rasi and the divisional charts, the house strengths, the planet and strength tables, the Shad Bala graph's figures and
 * the dasha list. One calculation, so every cell of the worksheet reads the same chart.
 */
export async function worksheetRun(input: BirthFormInput, dashaOptions: DashaOptions | undefined, profile: any = null) {
  const report = buildReportData(input);
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const options = dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  const periods = await withEphemeris({ ayanamsha: report.chart.ayanamsha }, async () => {
    const tree = buildVimshottariDasha(report.chart.julianDay, report.chart.grahas.Moon.longitude, input.utcOffsetMinutes ?? 0, {
      depth: 2,
      yearDays: options.yearDays,
      balance: options.balance,
      moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', report.chart.ayanamsha),
    });
    return W.flattenDasha(tree);
  });

  // What the top of the worksheet says of the birth: the weekday, sunrise, the limbs of the panchangam, the dasha balance...
  const particulars = await buildBirthParticulars({
    birth: input,
    engine: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    dashaOptions: options,
    gender: input.gender,
    name: profile?.name ?? input.name,
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
    particulars,
    periods,
    dashaYearDays: options.yearDays,
    balance: options.balance,
  }));
}
