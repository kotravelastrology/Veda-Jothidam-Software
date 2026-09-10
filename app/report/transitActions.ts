'use server';

import { computeTransitPositions } from '../../src/report/transitPositions';

export interface TransitOptions {
  latitude?: number;
  longitude?: number;
  ayanamsha?: string;
  nodeType?: 'mean' | 'true';
}

/** Real Swiss Ephemeris transit positions for one instant. */
export async function computeTransit(dateISO: string, opts: TransitOptions = {}) {
  const data = computeTransitPositions(new Date(dateISO), opts);
  return JSON.parse(JSON.stringify(data));
}

/**
 * A run of ephemeris rows: `count` instants spaced `intervalDays` apart from
 * `startISO` (noon UTC on the start date), each with real sidereal positions.
 * One round trip instead of `count` calls.
 */
export async function computeEphemerisRange(
  startISO: string,
  intervalDays: number,
  count: number,
  opts: TransitOptions = {},
) {
  const base = new Date(`${startISO}T12:00:00Z`);
  if (Number.isNaN(base.getTime())) return [];
  const rows = Array.from({ length: Math.max(0, Math.min(count, 60)) }, (_, i) => {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + i * intervalDays);
    return computeTransitPositions(d, opts);
  });
  return JSON.parse(JSON.stringify(rows));
}
