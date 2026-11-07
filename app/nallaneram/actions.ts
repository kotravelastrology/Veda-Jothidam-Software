'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateDailyMuhurta } = require('../../src/report/dailyMuhurta');

export interface DayQuery {
  year: number; month: number; day: number;
  latitude: number; longitude: number; utcOffsetMinutes: number;
  placeName?: string;
}

export async function computeDailyMuhurta(q: DayQuery) {
  if (!Number.isFinite(q.utcOffsetMinutes)) {
    // Every slot returned is a clock time cut from local sunrise. Defaulting
    // the offset would give a whole day of plausible-looking wrong times, so
    // it is required rather than guessed.
    throw new Error('நேர மண்டல வித்தியாசம் (UTC offset) தேவை.');
  }
  return JSON.parse(JSON.stringify(calculateDailyMuhurta(q)));
}
