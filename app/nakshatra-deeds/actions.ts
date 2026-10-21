'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { deedsTable, searchDeeds } = require('../../src/report/nakshatraDeeds');

/** The whole chapter: 28 entries, the seven kinds, the three mukha groups. Nothing personal. */
export async function computeNakshatraDeedsTable() {
  return JSON.parse(JSON.stringify(deedsTable()));
}

/** Which stars the book lists a deed under (Tamil or English words). */
export async function searchNakshatraDeeds(query: string) {
  return JSON.parse(JSON.stringify(searchDeeds(String(query ?? '').slice(0, 120))));
}
