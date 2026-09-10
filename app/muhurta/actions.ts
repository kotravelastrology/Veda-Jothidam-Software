'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { searchMuhurta } = require('../../src/report/muhurtaSearch');

export interface MuhurtaSearchQuery {
  startDate: string;
  endDate: string;
  purpose: string;
  latitude: number;
  longitude: number;
  utcOffsetMinutes: number;
}

export async function computeMuhurtaSearch(q: MuhurtaSearchQuery) {
  return JSON.parse(JSON.stringify(searchMuhurta(q)));
}
