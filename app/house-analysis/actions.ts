'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart, RASI_NAMES } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateAshtakavarga } = require('../../src/chart/ashtakavarga');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateShadbala } = require('../../src/chart/shadbala');

const CLASSICAL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

export async function analyzeHouses(input: BirthFormInput) {
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);

  const longitudes = Object.fromEntries(
    CLASSICAL_GRAHAS.map(p => [p, chart.grahas[p].longitude]),
  );
  const rasiPositions: Record<string, number> = {
    ...Object.fromEntries(CLASSICAL_GRAHAS.map(p => [p, chart.grahas[p].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  };

  const ashtakavarga = calculateAshtakavarga(rasiPositions);

  const shadbala = calculateShadbala({
    longitudes,
    lagnaRasiIndex: chart.lagna.rasiIndex,
    ascendant: chart.lagna.longitude,
    mc: chart.mc,
    birthJd: chart.julianDay,
    latitude: input.latitude,
    longitude: input.longitude,
    year: input.year,
    month: input.month,
    day: input.day,
    utcOffsetMinutes: input.utcOffsetMinutes,
  });

  const houses = [];
  for (let i = 0; i < 12; i++) {
    const houseRasiIndex = (chart.lagna.rasiIndex + i) % 12;
    // Whole-sign grouping: Sarvashtakavarga bindus are counted per rasi, so
    // grouping by Porphyry cusp would list a planet under a rasi it is not in.
    const planetsInHouse = CLASSICAL_GRAHAS.filter(
      p => chart.grahas[p].rasiIndex === houseRasiIndex,
    );
    const sarvaBindus = ashtakavarga.sarva[houseRasiIndex];
    houses.push({
      number: i + 1,
      rasiIndex: houseRasiIndex,
      rasi: RASI_NAMES[houseRasiIndex],
      sarvaBindus,
      planets: planetsInHouse,
      planetDetails: planetsInHouse.map(p => ({
        planet: p,
        longitude: chart.grahas[p].longitude,
        rasiIndex: chart.grahas[p].rasiIndex,
        rasi: chart.grahas[p].rasi,
        degreeInSign: chart.grahas[p].degreeInSign,
      })),
    });
  }

  return JSON.parse(JSON.stringify({
    houses,
    shadbala,
    ashtakavarga: {
      sarva: ashtakavarga.sarva,
      bhinna: ashtakavarga.bhinna,
      total: ashtakavarga.sarva.reduce((a: number, b: number) => a + b, 0),
      source: ashtakavarga.source,
    },
    lagnaRasi: chart.lagna.rasi,
    lagnaRasiIndex: chart.lagna.rasiIndex,
  }));
}
