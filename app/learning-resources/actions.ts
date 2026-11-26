'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildGlossary } = require('../../src/sources/glossary');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SOURCES } = require('../../src/sources/registry');

/**
 * VJ-026 — the glossary, resolved on the server.
 *
 * It reads the engines' own `attachSource` calls from disk, so it has to run
 * here rather than in the browser. That is also why it is worth trusting:
 * what the page shows is what the code cites, read at request time.
 */
export async function loadGlossary() {
  return JSON.parse(JSON.stringify({
    terms: buildGlossary(),
    sources: SOURCES,
  }));
}
