'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const conflicts = require('../../src/sync/conflicts');

function withLibrary<T>(fn: (lib: any) => T): T {
  const lib = openLibrary(resolveLibraryPath());
  try {
    return fn(lib);
  } finally {
    lib.close();
  }
}

/** VJ-025 — conflicts awaiting a decision, newest activity last. */
export async function loadConflicts() {
  return withLibrary((lib) => {
    const open = lib.openConflicts();
    return JSON.parse(JSON.stringify({
      open: open.map((c: any) => conflicts.reviewConflict(lib, c.conflictId)),
      resolved: lib.listConflicts({ limit: 20 }).filter((c: any) => c.state === 'resolved'),
    }));
  });
}

export async function applyConflictResolution(conflictId: string, resolution: string) {
  return withLibrary((lib) =>
    JSON.parse(JSON.stringify(conflicts.resolveConflict(lib, conflictId, resolution))));
}
