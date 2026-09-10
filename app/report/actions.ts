'use server';

import { buildReportData } from '../../src/report/reportData';

export interface BirthFormInput {
  name: string;
  gender: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  ianaTimeZone: string;
  utcOffsetMinutes: number;
  latitude: number;
  longitude: number;
  placeName: string;
  /** Optional calculation options from Settings; each defaults inside the
   * governed chart context (Lahiri / Porphyrius / mean node) when omitted. */
  ayanamsha?: string;
  houseSystem?: string;
  nodeType?: 'mean' | 'true';
}

export async function computeReport(input: BirthFormInput) {
  const report = buildReportData(input);
  // Server Actions must return plain JSON-serializable data — the
  // calculators already return frozen plain objects, so this is a
  // structural copy, not a reshaping.
  return JSON.parse(JSON.stringify(report));
}
