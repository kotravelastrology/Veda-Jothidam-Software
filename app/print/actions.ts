'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const P = require('../../src/report/printSets');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export type PrintKind = 'ephemeris' | 'panchang' | 'kp' | 'dashas' | 'compact' | 'transit' | 'birth-export' | 'ephemeris-csv';

export interface PrintRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  kind: PrintKind;
  year?: number; month?: number;
  levels?: number; fromYear?: number; toYear?: number;
  on?: { year: number; month: number; day: number };
  /** ephemeris at 0h of the person's local time (PL9's file) instead of 0h UT */
  local?: boolean;
}

/** A printable document (or a plain-text export) from the app's own engines; the page prints it. */
export async function buildPrintDocument(req: PrintRequest) {
  let input: BirthFormInput;
  let name = '';
  if (req.profile) {
    const library = openLibrary(resolveLibraryPath());
    try {
      const p = library.getProfile(req.profile.profileId, req.profile.revision);
      if (!p) throw new Error(`சுயவிவரம் கிடைக்கவில்லை: ${req.profile.profileId}`);
      input = { ...p.input, ...p.settings };
      name = p.name ?? '';
    } finally {
      library.close();
    }
  } else if (req.form) {
    input = req.form;
    name = (req.form as any).name ?? '';
  } else {
    throw new Error('ஒரு சுயவிவரம் அல்லது பிறப்பு விவரம் தேவை.');
  }
  const now = new Date();
  const year = Number.isFinite(req.year) ? (req.year as number) : now.getUTCFullYear();
  const month = Number.isFinite(req.month) ? (req.month as number) : now.getUTCMonth() + 1;
  if (year < 1800 || year > 2200 || month < 1 || month > 12) throw new Error('ஆண்டு (1800-2200) அல்லது மாதம் சரியில்லை.');
  const birth: any = input;
  const place = { latitude: birth.latitude, longitude: birth.longitude, utcOffsetMinutes: birth.utcOffsetMinutes ?? 0, placeName: birth.placeName, ianaTimeZone: birth.ianaTimeZone };
  switch (req.kind) {
    case 'ephemeris': return JSON.parse(JSON.stringify({ kind: 'document', doc: { ...P.ephemerisDocument({ year, month, offsetMinutes: req.local ? place.utcOffsetMinutes : 0 }), rows: undefined } }));
    case 'ephemeris-csv': return { kind: 'text', filename: `ephemeris-${year}-${String(month).padStart(2, '0')}.csv`, mime: 'text/csv', text: P.ephemerisCsv({ year, month, offsetMinutes: req.local ? place.utcOffsetMinutes : 0 }) };
    case 'panchang': return JSON.parse(JSON.stringify({ kind: 'document', doc: P.panchangDocument({ year, month, place }) }));
    case 'kp': return JSON.parse(JSON.stringify({ kind: 'document', doc: P.kpDocument({ birth, name }) }));
    case 'dashas': return JSON.parse(JSON.stringify({ kind: 'document', doc: P.dashaDocument({ birth, name, levels: req.levels ?? 3, fromYear: req.fromYear ?? null, toYear: req.toYear ?? null }) }));
    case 'compact': return JSON.parse(JSON.stringify({ kind: 'document', doc: P.compactLifetimeDocument({ birth, name }) }));
    case 'transit': {
      const on = req.on ?? { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1, day: now.getUTCDate() };
      return JSON.parse(JSON.stringify({ kind: 'document', doc: P.transitDocument({ birth, name, on }) }));
    }
    case 'birth-export': return { kind: 'text', filename: `birth-${(name || 'chart').replace(/[^\p{L}\p{N}]+/gu, '_')}.txt`, mime: 'text/tab-separated-values', text: P.birthExportText({ birth, name }) };
    default: throw new Error('தெரியாத வகை');
  }
}
