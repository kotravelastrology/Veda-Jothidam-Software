'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { METHODS, coverageSummary } = require('../../src/dasha/rareDashas');

/** VJ-027 — the method register with its coverage labels. */
export async function loadDashaMethods() {
  return JSON.parse(JSON.stringify({ methods: METHODS, summary: coverageSummary() }));
}
