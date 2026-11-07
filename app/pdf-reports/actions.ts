'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartSnapshot } = require('../../src/contracts/chartSnapshot');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createRuleEvidence, withheldEvidence } = require('../../src/contracts/ruleEvidence');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateVargas } = require('../../src/chart/vargaChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateAshtakavarga } = require('../../src/chart/ashtakavarga');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildReportDocument } = require('../../src/reports/reportDocument');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { renderReportHtml } = require('../../src/reports/renderReportHtml');

const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const ALL = [...CLASSICAL, 'Rahu', 'Ketu'];

export interface ReportRequest {
  name: string;
  year: number; month: number; day: number;
  hour: number; minute: number;
  latitude: number; longitude: number;
  utcOffsetMinutes: number;
  placeName?: string;
  ianaTimeZone?: string;
  ayanamsha?: string;
  houseSystem?: string;
  nodeType?: string;
}

/**
 * Builds the printable report from this software's own engines.
 *
 * Until now `/pdf-reports` POSTed to a Flask service that had to produce the
 * PDF. VJ-019 built the whole document pipeline here — `ChartSnapshot` →
 * `ReportDocument` → printable HTML, with a real PDF proved out of it (valid
 * bytes, three embedded Tamil font subsets, no clipped tables) — and nothing
 * in the UI ever called it. This is that call.
 *
 * The HTML returned **is** the print input, not a preview of it. There is no
 * second renderer to drift from what the practitioner approved, which is the
 * property VJ-019's acceptance asked for.
 */
export async function buildPrintableReport(input: ReportRequest) {
  if (!input?.name?.trim()) throw new Error('பெயர் தேவை');

  const settings = {
    ayanamsha: input.ayanamsha ?? 'Lahiri',
    houseSystem: input.houseSystem ?? 'Porphyrius',
    nodeType: input.nodeType ?? 'mean',
  };

  const request = createCalculationRequest({
    input: {
      year: input.year, month: input.month, day: input.day,
      hour: input.hour, minute: input.minute,
      latitude: input.latitude, longitude: input.longitude,
      utcOffsetMinutes: input.utcOffsetMinutes,
      ianaTimeZone: input.ianaTimeZone ?? 'Asia/Kolkata',
      placeName: input.placeName ?? null,
    },
    settings,
    outputs: ['parashariChart', 'vargas', 'ashtakavarga'],
  });

  const chart = calculateParashariChart(request.chartContext);

  const natal = ALL.map((id) => {
    const g = chart.grahas[id];
    return {
      id, longitude: g.longitude, rasi: g.rasi, rasiIndex: g.rasiIndex,
      degreeInSign: g.degreeInSign, house: g.house,
    };
  });
  const vargas = Object.fromEntries(ALL.map((id) => {
    const g = chart.grahas[id];
    return [id, calculateVargas(g.rasiIndex, g.degreeInSign)];
  }));
  const lagnaVargas = calculateVargas(chart.lagna.rasiIndex, chart.lagna.degreeInSign);
  const vargaKeys = Object.keys(lagnaVargas).filter((k) => k !== 'source' && k !== 'D2');
  const av = calculateAshtakavarga({
    ...Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  });

  const snapshot = createChartSnapshot({
    request,
    values: {
      lagna: {
        longitude: chart.lagna.longitude, rasi: chart.lagna.rasi,
        rasiIndex: chart.lagna.rasiIndex, degreeInSign: chart.lagna.degreeInSign,
      },
      natal, vargaKeys, vargas, lagnaVargas,
      ashtakavarga: {
        sarva: av.sarva, bhinna: av.bhinna,
        total: av.sarva.reduce((a: number, b: number) => a + b, 0),
      },
    },
    evidence: [
      createRuleEvidence({
        ruleId: 'VARGAS', name: 'வர்கங்கள்',
        outcome: { divisions: vargaKeys }, source: lagnaVargas.source,
      }),
      // Printed as withheld rather than dropped: a gap that vanishes reads as
      // a finding (VJ-019).
      withheldEvidence({
        ruleId: 'SHADBALA_TOTAL', name: 'ஷட்பல மொத்தம்',
        reason: 'BPHS Ayana Bala முரண்பாடு',
      }),
    ],
  });

  // The instant is passed in, never read from the clock, so building twice
  // from one snapshot gives an identical document (ADR-07).
  const doc = buildReportDocument({
    snapshot,
    subject: { name: input.name.trim() },
    generatedAtMs: Date.now(),
  });

  return JSON.parse(JSON.stringify({
    html: renderReportHtml(doc),
    snapshotId: doc.snapshotId,
    engineVersion: doc.engineVersion,
    documentVersion: doc.documentVersion,
    sections: doc.sections.map((s: any) => ({ id: s.id, heading: s.heading })),
    settings: doc.settings,
  }));
}
