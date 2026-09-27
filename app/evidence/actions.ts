'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartSnapshot } = require('../../src/contracts/chartSnapshot');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createRuleEvidence } = require('../../src/contracts/ruleEvidence');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart, RASI_NAMES } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateVargas } = require('../../src/chart/vargaChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateAshtakavarga } = require('../../src/chart/ashtakavarga');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateShadbala } = require('../../src/chart/shadbala');

const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const ALL = [...CLASSICAL, 'Rahu', 'Ketu'];

/**
 * VJ-016 — one computation, every panel.
 *
 * The acceptance criterion is that values agree in chart, table and report.
 * The way to guarantee that is not to check three renderings against each
 * other but to give them nothing to disagree about: a single ChartSnapshot,
 * computed once, that all three read. Any panel that recomputed could drift
 * the moment settings or the clock differed.
 */
export async function computeEvidenceSnapshot(input: BirthFormInput) {
  const request = createCalculationRequest({
    input,
    settings: {
      ayanamsha: input.ayanamsha,
      houseSystem: input.houseSystem,
      nodeType: input.nodeType,
    },
    outputs: ['parashariChart', 'vargas', 'ashtakavarga', 'shadbala'],
  });
  const chart = calculateParashariChart(request.chartContext);

  const natal = ALL.map((id) => {
    const g = chart.grahas[id];
    return {
      id,
      longitude: g.longitude,
      rasi: g.rasi,
      rasiIndex: g.rasiIndex,
      degreeInSign: g.degreeInSign,
      house: g.house,
    };
  });

  const vargaBy: Record<string, any> = {};
  for (const id of ALL) {
    const g = chart.grahas[id];
    vargaBy[id] = calculateVargas(g.rasiIndex, g.degreeInSign);
  }
  const lagnaVargas = calculateVargas(chart.lagna.rasiIndex, chart.lagna.degreeInSign);
  const vargaKeys = Object.keys(lagnaVargas).filter((k) => k !== 'source' && k !== 'D2');

  const rasiPositions: Record<string, number> = {
    ...Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  };
  const ashtakavarga = calculateAshtakavarga(rasiPositions);

  const shadbala = calculateShadbala({
    longitudes: Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].longitude])),
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

  // Each panel's governing rule, carried as VJ-006 RuleEvidence so the UI can
  // show where a number comes from and a consultation can cite it.
  const evidence = [
    createRuleEvidence({
      ruleId: 'PARASHARI_CHART',
      name: 'Parashari natal chart',
      outcome: { lagna: chart.lagna.rasi, houseSystem: chart.houseSystem, ayanamsha: chart.ayanamsha },
      source: {
        title: 'Brihat Parashara Hora Shastra (BPHS)',
        author: 'R. Santhanam (translation)',
        file: 'C23_BPHS_Santhanam.pdf',
        tradition: 'Parashari',
        convention: 'Natal chart, Ch.3-4',
        pageLocus: 'Ch.3-4 — S6 (Lagna and the seven classical grahas)',
      },
    }),
    createRuleEvidence({
      ruleId: 'VARGAS',
      name: 'Divisional charts',
      outcome: { divisions: vargaKeys },
      source: lagnaVargas.source,
    }),
    createRuleEvidence({
      ruleId: 'ASHTAKAVARGA',
      name: 'Ashtakavarga',
      outcome: { sarva: ashtakavarga.sarva, total: ashtakavarga.sarva.reduce((a: number, b: number) => a + b, 0) },
      source: ashtakavarga.source,
    }),
    createRuleEvidence({
      ruleId: 'SHADBALA',
      name: 'Shadbala',
      outcome: { planets: CLASSICAL },
      source: shadbala.source,
    }),
  ];

  const snapshot = createChartSnapshot({
    request,
    values: {
      lagna: {
        longitude: chart.lagna.longitude,
        rasi: chart.lagna.rasi,
        rasiIndex: chart.lagna.rasiIndex,
        degreeInSign: chart.lagna.degreeInSign,
      },
      natal,
      vargaKeys,
      vargas: vargaBy,
      lagnaVargas,
      ashtakavarga: {
        sarva: ashtakavarga.sarva,
        bhinna: ashtakavarga.bhinna,
        total: ashtakavarga.sarva.reduce((a: number, b: number) => a + b, 0),
      },
      shadbala: shadbala.perPlanet,
    },
    evidence,
  });

  return JSON.parse(JSON.stringify(snapshot));
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

/**
 * Stores the snapshot against a profile revision and records a consultation
 * citing the chosen rules. This is the VJ-022 evidence picker its data layer
 * was waiting for: the note ends up bound to an immutable snapshot rather
 * than to "whatever that chart looks like now".
 */
export async function citeEvidenceInConsultation(params: {
  profileId: string;
  revision: number;
  snapshot: any;
  ruleIds: string[];
  summary: string;
  notes?: string;
}) {
  const lib = openLibrary(resolveLibraryPath());
  try {
    lib.saveSnapshot(params.profileId, params.revision, params.snapshot);
    const chosen = (params.snapshot.evidence || []).filter(
      (e: any) => params.ruleIds.includes(e.ruleId),
    );
    return lib.saveConsultation({
      profileId: params.profileId,
      snapshotId: params.snapshot.snapshotId,
      summary: params.summary,
      notes: params.notes ?? null,
      evidence: chosen,
    });
  } finally {
    lib.close();
  }
}
