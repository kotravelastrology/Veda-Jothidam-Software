'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha, NAKSHATRA_LORDS } = require('../../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NAKSHATRA_NAMES } = require('../../src/panchangam/tirukanitaPanchangam');

type Status = 'past' | 'current' | 'future';

function statusOf(nowJd: number, startJd: number, endJd: number): Status {
  if (nowJd >= endJd) return 'past';
  if (nowJd >= startJd) return 'current';
  return 'future';
}

/** [Y, M] from a "YYYY-MM-DD HH:mm" local string as vimshottariDasha emits it. */
function yearMonth(local: string): { year: number; month: number } {
  const [datePart] = local.split(' ');
  const [year, month] = datePart.split('-').map(Number);
  return { year, month };
}

export async function computeDashaTimeline(input: BirthFormInput) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart', 'vimshottari'],
  });
  const chart = calculateParashariChart(request.chartContext);

  const dasha = buildVimshottariDasha(
    chart.julianDay,
    chart.grahas.Moon.longitude,
    input.utcOffsetMinutes,
    { depth: 2 },
  );

  const nowJd = Date.now() / 86400000 + 2440587.5;

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
      status: statusOf(nowJd, d.startJulianDay, d.endJulianDay),
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
          status: statusOf(nowJd, b.startJulianDay, b.endJulianDay),
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
    balanceYearsAtBirth: Number(dasha.balanceYearsAtBirth.toFixed(3)),
    source: dasha.source,
  }));
}
