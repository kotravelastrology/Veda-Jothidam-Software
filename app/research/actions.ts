'use server';

import { randomUUID } from 'node:crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { runCohort, predicateHash } = require('../../src/research/cohort');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { assertPredicate, describePredicate } = require('../../src/research/predicates');

function withLibrary<T>(fn: (lib: any) => T): T {
  const lib = openLibrary(resolveLibraryPath());
  try {
    return fn(lib);
  } finally {
    lib.close();
  }
}

export interface CohortSettings {
  ayanamsha: string;
  houseSystem: string;
  nodeType: string;
}

/**
 * VJ-028 — runs a predicate over the library.
 *
 * The engine accepts an AbortSignal and honours it between profiles, which is
 * what the acceptance asks of the query. A *server action* cannot carry the
 * browser's abort across the request boundary, so the page's cancel button
 * stops the client waiting rather than the server working. That distinction
 * is stated on the page rather than papered over.
 */
export async function runResearchCohort(predicate: unknown, settings: CohortSettings) {
  assertPredicate(predicate);
  const lib = openLibrary(resolveLibraryPath());
  try {
    return JSON.parse(JSON.stringify(await runCohort({ library: lib, predicate, settings })));
  } finally {
    lib.close();
  }
}

export async function saveResearchCohort(params: {
  cohortId?: string;
  name: string;
  predicate: unknown;
  settings: CohortSettings;
  signature?: string | null;
  counts?: unknown;
}) {
  assertPredicate(params.predicate);
  const cohortId = params.cohortId ?? randomUUID();
  return withLibrary((lib) => {
    lib.saveCohort(cohortId, {
      name: params.name,
      predicate: params.predicate,
      predicateHash: predicateHash(params.predicate),
      settings: params.settings,
    });
    if (params.signature) {
      lib.recordCohortRun(cohortId, { signature: params.signature, counts: params.counts ?? {} });
    }
    return JSON.parse(JSON.stringify(lib.getCohort(cohortId)));
  });
}

export async function listResearchCohorts() {
  return withLibrary((lib) => JSON.parse(JSON.stringify(
    lib.listCohorts().map((c: any) => ({ ...c, description: describePredicate(c.predicate) })),
  )));
}

export async function deleteResearchCohort(cohortId: string) {
  return withLibrary((lib) => lib.deleteCohort(cohortId));
}

/** Runs a saved cohort again and reports whether its membership moved. */
export async function replayResearchCohort(cohortId: string) {
  const lib = openLibrary(resolveLibraryPath());
  try {
    const cohort = lib.getCohort(cohortId);
    if (!cohort) throw new Error(`no cohort ${cohortId}`);
    const result = await runCohort({
      library: lib, predicate: cohort.predicate, settings: cohort.settings,
    });
    const previous = cohort.lastSignature;
    lib.recordCohortRun(cohortId, { signature: result.signature, counts: result.counts });
    return JSON.parse(JSON.stringify({
      ...result,
      cohortId,
      name: cohort.name,
      previousSignature: previous,
      // null on a first run — "unchanged" would be a claim about a comparison
      // that never happened.
      unchanged: previous === null ? null : previous === result.signature,
    }));
  } finally {
    lib.close();
  }
}
