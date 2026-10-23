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
  email?: string;
  phone?: string;
}) {
  return withLibrary((lib) => lib.saveProfile({
    name: params.name,
    gender: params.gender ?? null,
    input: params.input,
    settings: settingsOf(params.input),
    note: params.note ?? null,
    email: params.email ?? null,
    phone: params.phone ?? null,
  }));
}

/** Appends a revision; the previous reading stays reopenable. */
export async function updateChart(profileId: string, changes: {
  name?: string;
  gender?: string;
  input?: BirthFormInput;
  note?: string;
  email?: string;
  phone?: string;
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createArchive, verifyArchive, restoreArchive } = require('../../src/library/archive');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodePath = require('node:path');

/** Default backup location, beside the library rather than inside the repo. */
function defaultArchivePath() {
  const stamp = new Date().toISOString().slice(0, 10);
  return nodePath.join(
    nodePath.dirname(resolveLibraryPath()),
    'backups',
    `veda-library-${stamp}.json`,
  );
}

export async function backupLibrary(archivePath?: string) {
  return createArchive(resolveLibraryPath(), archivePath ?? defaultArchivePath());
}

/** Validates an archive without writing anything, for a restore preview. */
export async function inspectBackup(archivePath: string) {
  return verifyArchive(archivePath);
}

export async function restoreLibrary(archivePath: string, overwrite = false) {
  return restoreArchive(archivePath, resolveLibraryPath(), { overwrite });
}

// ---------------------------------------------------------- VJ-022 ----------

export async function recordConsultation(params: {
  profileId: string;
  snapshotId?: string;
  occurredAt?: string;
  summary?: string;
  notes?: string;
  recommendations?: string;
  remedies?: string;
  evidence?: any[];
}) {
  return withLibrary((lib) => lib.saveConsultation(params));
}

export async function editConsultationNotes(consultationId: string, changes: {
  summary?: string; notes?: string; recommendations?: string; remedies?: string;
}) {
  return withLibrary((lib) => lib.updateConsultationNotes(consultationId, changes));
}

export async function listConsultations(profileId: string) {
  return withLibrary((lib) => lib.listConsultations(profileId));
}

export async function getConsultation(consultationId: string) {
  return withLibrary((lib) => lib.getConsultation(consultationId));
}

export async function addJournalEvent(params: {
  profileId: string; eventDate: string; category?: string; description: string;
}) {
  return withLibrary((lib) => lib.addJournalEvent(params));
}

export async function listJournalEvents(profileId: string) {
  return withLibrary((lib) => lib.listJournalEvents(profileId));
}

export async function deleteJournalEvent(eventId: string) {
  return withLibrary((lib) => lib.deleteJournalEvent(eventId));
}

/** Autosave for an unsent consultation note. */
export async function saveDraft(draftKey: string, payload: unknown, profileId?: string) {
  return withLibrary((lib) => lib.saveDraft(draftKey, payload, profileId ?? null));
}

export async function getDraft(draftKey: string) {
  return withLibrary((lib) => lib.getDraft(draftKey));
}

export async function discardDraft(draftKey: string) {
  return withLibrary((lib) => lib.discardDraft(draftKey));
}
