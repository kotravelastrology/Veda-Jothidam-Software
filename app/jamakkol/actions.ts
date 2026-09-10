'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateJamakkol } = require('../../src/report/jamakkol');

export interface JamakkolQuery {
  year: number; month: number; day: number;
  hour: number; minute: number; second?: number;
  latitude: number; longitude: number; utcOffsetMinutes: number;
}

export async function computeJamakkol(q: JamakkolQuery) {
  return JSON.parse(JSON.stringify(calculateJamakkol(q)));
}
