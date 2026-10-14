'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { factsFromChart, analyseChart, analysePair, REMEDIES, GUIDANCE } = require('../../src/report/mangalaDosha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface MangalaSide {
  /** A saved profile, or details typed into the form. Exactly one. */
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
}

function sideInput(side: MangalaSide, library: any) {
  if (side.profile) {
    const p = library.getProfile(side.profile.profileId, side.profile.revision);
    if (!p) throw new Error(`சுயவிவரம் கிடைக்கவில்லை: ${side.profile.profileId}`);
    return { input: { ...p.input, ...p.settings } as BirthFormInput, profile: p };
  }
  if (side.form) return { input: side.form, profile: null };
  throw new Error('ஒரு சுயவிவரம் அல்லது பிறப்பு விவரம் தேவை.');
}

function facts(side: MangalaSide, gender: 'female' | 'male', library: any) {
  const { input, profile } = sideInput(side, library);
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  return {
    facts: factsFromChart(chart, { input, gender }),
    party: describeMatchParty(input, ctx, profile),
    moon: chart.grahas.Moon.rasiIndex,
  };
}

/**
 * Mangala (Kuja) dosha for a bride, a groom, or both.
 *
 * With one chart: the formation under every reading the books give, the
 * intensity and results, and every cancellation condition that can be judged
 * from that chart alone. With both: the partner-chart conditions and the unit
 * comparison join in. There is never a single verdict — the books disagree and
 * the page shows each source's reading with its page.
 *
 * A saved profile is read with its *stored* settings, not page defaults: the
 * Moon's and Venus's signs are points of count, and they move with the
 * ayanamsha.
 */
export async function computeMangala(req: { girl?: MangalaSide | null; boy?: MangalaSide | null }) {
  if (!req.girl && !req.boy) throw new Error('குறைந்தது ஒருவரின் விவரம் தேவை.');
  const library = openLibrary(resolveLibraryPath());
  try {
    const g = req.girl ? facts(req.girl, 'female', library) : null;
    const b = req.boy ? facts(req.boy, 'male', library) : null;
    const common = { remedies: REMEDIES, guidance: GUIDANCE };

    if (g && b) {
      const pair = analysePair(g.facts, b.facts);
      return JSON.parse(JSON.stringify({
        mode: 'PAIR', ...common, units: pair.units, pairGuidance: pair.guidance,
        girl: { party: g.party, analysis: pair.girl },
        boy: { party: b.party, analysis: pair.boy },
      }));
    }
    const only = (g ?? b)!;
    return JSON.parse(JSON.stringify({
      mode: 'SINGLE', ...common, side: g ? 'GIRL' : 'BOY',
      single: { party: only.party, analysis: analyseChart(only.facts, null) },
    }));
  } finally {
    library.close();
  }
}
