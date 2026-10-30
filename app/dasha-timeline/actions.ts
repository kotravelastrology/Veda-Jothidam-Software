'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha, NAKSHATRA_LORDS } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NAKSHATRA_NAMES } = require('../../src/panchangam/tirukanitaPanchangam');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { julianDayFromMs, statusAt, chainAtJulianDay } = require('../../src/dasha/timeline');

type Status = 'past' | 'current' | 'future';

/** [Y, M] from a "YYYY-MM-DD HH:mm" local string as vimshottariDasha emits it. */
function yearMonth(local: string): { year: number; month: number } {
  const [datePart] = local.split(' ');
  const [year, month] = datePart.split('-').map(Number);
  return { year, month };
}

/**
 * `asOfMs` is the instant the timeline is reported against. It is a parameter,
 * not a clock read: VJ-017 requires the same request to produce the same
 * result, and this function used to call Date.now() mid-computation so its
 * output changed every day.
 */
export async function computeDashaTimeline(input: BirthFormInput, asOfMs?: number) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart', 'vimshottari'],
  });
  // VJ-014: the ayanamsha lives in Swiss Ephemeris's global state, so the
  // whole computation runs inside one isolated session.
  return withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
    const chart = calculateParashariChart(request.chartContext);

    const dasha = buildVimshottariDasha(
      chart.julianDay,
      chart.grahas.Moon.longitude,
      input.utcOffsetMinutes,
      { depth: 2 },
    );

    const referenceMs = asOfMs ?? Date.now();
    const nowJd = julianDayFromMs(referenceMs);

    const dashas = dasha.dashas.map((d: any) => {
      const start = yearMonth(d.startLocal);
      const end = yearMonth(d.endLocal);
      return {
        planet: d.lord,
        startYear: start.year,
        startMonth: start.month,
        endYear: end.year,
        endMonth: end.month,
        duration: Number(d.durationYears.toFixed(2)),
        status: statusAt(nowJd, d.startJulianDay, d.endJulianDay),
        bhuktis: (d.Bhukti || []).map((b: any) => {
          const bStart = yearMonth(b.startLocal);
          const bEnd = yearMonth(b.endLocal);
          return {
            planet: b.lord,
            startYear: bStart.year,
            startMonth: bStart.month,
            endYear: bEnd.year,
            endMonth: bEnd.month,
            duration: Number(b.durationYears.toFixed(2)),
            status: statusAt(nowJd, b.startJulianDay, b.endJulianDay),
          };
        }),
      };
    });

    return JSON.parse(JSON.stringify({
      dashas,
      moonNakshatra: NAKSHATRA_NAMES?.[dasha.birthNakshatraIndex] ?? null,
      moonNakshatraIndex: dasha.birthNakshatraIndex,
      moonNakshatraLord: NAKSHATRA_LORDS[dasha.birthNakshatraIndex],
      startingLord: dasha.startingLord,
      asOfMs: referenceMs,
      activeChain: chainAtJulianDay(dasha, nowJd),
      balanceYearsAtBirth: Number(dasha.balanceYearsAtBirth.toFixed(3)),
      source: dasha.source,
    }));
  });
}
