'use server';

import type { BirthFormInput } from '../report/actions';
import { worksheetRun, type DashaOptions } from '../../src/calc/chartRuns';
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
  dashaOptions?: DashaOptions;
}

/**
 * Everything the birth-chart worksheet shows for one person: the Rasi and the divisional charts, the house strengths, the
 * planet and strength tables, the Shad Bala graph's figures and the dasha list (src/calc/chartRuns.ts worksheetRun, which the device
 * also runs when the server cannot be reached). A saved profile is read from the chart library with its stored settings.
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
  return worksheetRun(input, req.dashaOptions, profile);
}
