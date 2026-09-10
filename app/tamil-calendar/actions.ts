'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildTamilCalendar } = require('../../src/report/tamilCalendar');

export interface TamilCalendarQuery {
  year: number;
  latitude: number;
  longitude: number;
  ayanamsha?: string;
}

export async function computeTamilCalendar(q: TamilCalendarQuery) {
  return JSON.parse(JSON.stringify(buildTamilCalendar({ ...q, todayMs: Date.now() })));
}
