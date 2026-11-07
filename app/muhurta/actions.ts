'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { searchMuhurta, actPurposes } = require('../../src/report/muhurtaSearch');

export interface MuhurtaSearchQuery {
  startDate: string;
  endDate: string;
  purpose: string;
  latitude: number;
  longitude: number;
  utcOffsetMinutes: number;
  /** For a purpose with rules from the books: which book's reading (the most explaining one when omitted). */
  book?: string;
}

export async function computeMuhurtaSearch(q: MuhurtaSearchQuery) {
  return JSON.parse(JSON.stringify(searchMuhurta(q)));
}

/** The other acts read from the books ('act:<EVENT>'), by family, for the purpose chooser. */
export async function muhurtaActs(): Promise<{ key: string; label: string; groupTa: string }[]> {
  return JSON.parse(JSON.stringify(actPurposes()));
}
