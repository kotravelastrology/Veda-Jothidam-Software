'use server';

/* eslint-disable @typescript-eslint/no-var-requires */
const {
  calculatePanchaPakshi, calculateYatraMuhurta, upcomingEclipses,
} = require('../../src/report/classicalMuhurta');

export interface PanchaPakshiQuery {
  year: number; month: number; day: number;
  latitude: number; longitude: number; utcOffsetMinutes: number;
  /** birth Moon nakshatra (0-26) + paksha, to fix the birth bird */
  birthNakshatra?: number;
  birthPaksha?: 'shukla' | 'krishna';
}

const NAK_MID_LON = (n: number) => n * (360 / 27) + (360 / 54); // middle of nakshatra n

export async function computePanchaPakshi(q: PanchaPakshiQuery) {
  const extra: Record<string, number> = {};
  if (typeof q.birthNakshatra === 'number') {
    extra.moonLongitudeAtBirth = NAK_MID_LON(q.birthNakshatra);
    // put the Sun so that the requested paksha holds (Śukla: Moon ahead 0-180)
    extra.sunLongitudeAtBirth = (extra.moonLongitudeAtBirth - (q.birthPaksha === 'krishna' ? 200 : 40) + 360) % 360;
  }
  return JSON.parse(JSON.stringify(calculatePanchaPakshi({ ...q, ...extra })));
}

export interface YatraQuery {
  year: number; month: number; day: number; hour: number; minute: number;
  direction: 'east' | 'south' | 'west' | 'north';
  latitude: number; longitude: number; utcOffsetMinutes: number;
  janmaRasi?: number;
}
export async function computeYatra(q: YatraQuery) {
  return JSON.parse(JSON.stringify(calculateYatraMuhurta(q)));
}

export async function computeEclipses(fromMs: number, count: number) {
  return JSON.parse(JSON.stringify(upcomingEclipses({ fromMs, count })));
}
