'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateDailyMuhurta } = require('../../src/report/dailyMuhurta');

export interface DayQuery {
  year: number; month: number; day: number;
  latitude: number; longitude: number; utcOffsetMinutes: number;
}

export async function computeDailyMuhurta(q: DayQuery) {
  return JSON.parse(JSON.stringify(calculateDailyMuhurta(q)));
}
