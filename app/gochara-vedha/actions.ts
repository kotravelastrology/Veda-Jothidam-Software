'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gocharaVedha } = require('../../src/report/gocharaVedha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { nakshatraVedha } = require('../../src/report/nakshatraVedha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { saptashalaka } = require('../../src/report/saptashalaka');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');

const YEAR_MS = 365.25 * 86400000;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface VedhaRequest {
  /** A saved profile, or details typed into the form. Exactly one. */
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

/**
 * Gochara vedha and vipareetha vedha for all nine planets, counted from the
 * natal Moon's sign, under both computable books.
 *
 * A saved profile is read with its stored settings: the Moon's sign — the one
 * natal input — moves with the ayanamsha, and the transits are scanned under
 * that same ayanamsha and node type.
 */
export async function computeVedha(req: VedhaRequest) {
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
  const now = Date.now();
  const nodeType = ctx.nodeType ?? 'mean';
  const result = gocharaVedha({
    moonRasiIndex: chart.grahas.Moon.rasiIndex,
    atMs: now,
    ayanamsha: ctx.ayanamsha,
    nodeType,
    // Phaladeepika XXVI.41 counts in the natal Ashtakavarga.
    natalRasi: {
      ...Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => [p, chart.grahas[p].rasiIndex])),
      Lagna: chart.lagna.rasiIndex,
    },
  });
  // Nakshatra vedha counts from every planet's natal star, not only the Moon's.
  const natalLongitudes = Object.fromEntries(Object.entries(chart.grahas).map(([k, v]: [string, any]) => [k, v.longitude]));
  const nakshatra = nakshatraVedha({
    natalLongitudes, fromMs: now - 2 * YEAR_MS, toMs: now + 30 * YEAR_MS, atMs: now, ayanamsha: ctx.ayanamsha, nodeType,
  });
  // Saptashalaka: counted from the natal Moon's star; a shorter window than the
  // rest (one year back, twelve ahead) because every planet's star changes are listed.
  const sapta = saptashalaka({
    natalMoonLongitude: chart.grahas.Moon.longitude,
    fromMs: now - YEAR_MS, toMs: now + 12 * YEAR_MS, atMs: now, ayanamsha: ctx.ayanamsha, nodeType,
  });
  return JSON.parse(JSON.stringify({ ...result, nakshatra, sapta, native: describeMatchParty(input, ctx, profile) }));
}
