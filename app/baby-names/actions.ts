'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { suggestNames, nakshatraPada, NAKSHATRA_TA, PADA_SYLLABLES_TA } = require('../../src/report/babyNames');

export interface BabyNameQuery {
  nakshatraIndex: number;
  pada: number;
  gender: 'boy' | 'girl' | 'both';
  search?: string;
}

export async function computeBabyNames(q: BabyNameQuery) {
  return JSON.parse(JSON.stringify(suggestNames(q)));
}

/** The full 27×4 syllable grid + nakshatra names, for the picker UI. */
export async function babyNameTables() {
  return JSON.parse(JSON.stringify({ nakshatras: NAKSHATRA_TA, syllables: PADA_SYLLABLES_TA }));
}

/** Derive nakshatra + pada from a Moon sidereal longitude (0-359). */
export async function nakshatraPadaFromMoon(moonLongitude: number) {
  return JSON.parse(JSON.stringify(nakshatraPada(moonLongitude)));
}
