'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pl9 = require('../../src/import/pl9Import');

function withLibrary<T>(fn: (lib: any) => T): T {
  const lib = openLibrary(resolveLibraryPath());
  try { return fn(lib); } finally { lib.close(); }
}

/**
 * Reads the file and returns what *would* happen. Writes nothing, so the
 * wizard can show the mapping, duplicates and loss report before anyone
 * commits to an import.
 */
export async function previewPl9Import(sourcePath: string) {
  const inspection = pl9.inspectPl9File(sourcePath);
  return withLibrary((lib) => {
    const plan = pl9.planImport(inspection, lib);
    return {
      sourcePath: plan.sourcePath,
      recordElement: plan.recordElement,
      found: plan.found,
      willImport: plan.toImport.map((r: any) => ({
        name: r.name,
        birthDate: `${r.input.year}-${String(r.input.month).padStart(2, '0')}-${String(r.input.day).padStart(2, '0')}`,
        placeName: r.input.placeName,
        utcOffsetMinutes: r.input.utcOffsetMinutes,
        provenance: r.provenance,
      })),
      duplicates: plan.duplicates.map((d: any) => ({ name: d.name, reason: d.reason })),
      rejected: plan.rejected,
      lossReport: plan.lossReport,
    };
  });
}

/** Re-reads the file and applies it, returning an importId for rollback. */
export async function runPl9Import(sourcePath: string) {
  const inspection = pl9.inspectPl9File(sourcePath);
  return withLibrary((lib) => pl9.applyImport(pl9.planImport(inspection, lib), lib));
}

export async function undoPl9Import(importId: string) {
  return withLibrary((lib) => pl9.rollbackImport(importId, lib));
}

export async function listPl9Imports() {
  return withLibrary((lib) => lib.listImports());
}
