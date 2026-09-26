'use server';

import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

/**
 * Each action opens and closes the library around its own work. SQLite
 * handles this cheaply, and it avoids holding a file handle open across a
 * Next.js hot reload, which would otherwise lock the database on Windows.
 */
function withLibrary<T>(fn: (lib: any) => T): T {
  const lib = openLibrary(resolveLibraryPath());
  try {
    return fn(lib);
  } finally {
    lib.close();
  }
}

const settingsOf = (input: BirthFormInput) => ({
  ayanamsha: input.ayanamsha ?? 'Lahiri',
  houseSystem: input.houseSystem ?? 'Porphyrius',
  nodeType: input.nodeType ?? 'mean',
  calendarMode: 'tirukanita',
});

export async function saveChart(params: {
  name: string;
  gender?: string;
  input: BirthFormInput;
  note?: string;
}) {
  return withLibrary((lib) => lib.saveProfile({
    name: params.name,
    gender: params.gender ?? null,
    input: params.input,
    settings: settingsOf(params.input),
    note: params.note ?? null,
  }));
}

/** Appends a revision; the previous reading stays reopenable. */
export async function updateChart(profileId: string, changes: {
  name?: string;
  gender?: string;
  input?: BirthFormInput;
  note?: string;
}) {
  return withLibrary((lib) => lib.updateProfile(profileId, {
    ...changes,
    settings: changes.input ? settingsOf(changes.input) : undefined,
  }));
}

export async function listCharts(limit = 50) {
  return withLibrary((lib) => lib.listProfiles({ limit }));
}

export async function searchCharts(query: string, limit = 25) {
  if (!query || !query.trim()) return [];
  return withLibrary((lib) => lib.search(query, { limit }));
}

export async function searchChartsByBirthDate(fromIso: string, toIso: string) {
  return withLibrary((lib) => lib.searchByBirthDate(fromIso, toIso));
}

/** Latest revision, or a specific earlier one. */
export async function openChart(profileId: string, revision?: number) {
  return withLibrary((lib) => lib.getProfile(profileId, revision ?? null));
}

export async function listChartRevisions(profileId: string) {
  return withLibrary((lib) => lib.listRevisions(profileId));
}

export async function deleteChart(profileId: string) {
  return withLibrary((lib) => lib.deleteProfile(profileId));
}
