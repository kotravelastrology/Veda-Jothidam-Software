'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gocharaVedha } = require('../../src/report/gocharaVedha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
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
  const result = gocharaVedha({
    moonRasiIndex: chart.grahas.Moon.rasiIndex,
    atMs: Date.now(),
    ayanamsha: ctx.ayanamsha,
    nodeType: ctx.nodeType ?? 'mean',
  });
  return JSON.parse(JSON.stringify({ ...result, native: describeMatchParty(input, ctx, profile) }));
}
