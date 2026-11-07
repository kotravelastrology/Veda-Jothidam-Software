/**
 * The signs of the body of BPHS ch.81 (Santhanam, vol.2, printed pp.966-981: the woman's body from the soles of the feet to the hair) and ch.82 (printed pp.982-984: moles,
 * marks and hair-whorls), as a reference looked up by a feature on the person; fixture fixtures/samudrika/bphs-81-82.json. Nothing here is read from the birth chart.
 * Each part of the body has items { kind: 'good' | 'bad' | 'neutral', feature, effect } in the book's order, each part with its verses and printed pages.
 */
const DATA = require('../../fixtures/samudrika/bphs-81-82.json');

const BOOKS = Object.freeze({ women: DATA.women, marks: DATA.marks });

/** The sections of one chapter ('women' = ch.81, 'marks' = ch.82), each with its chapter number. */
function sections(which) {
  const b = BOOKS[which];
  if (!b) throw new RangeError(`unknown chapter ${which}`);
  return b.sections.map((s) => ({ ...s, chapter: b.chapter }));
}

/**
 * The items whose part, feature or effect contains every word of `query` (Tamil text, any case), with their section, optionally for one `kind`.
 * @returns {{ chapter: number, sectionId: string, part: string, verses: string, page: string, kind: string, feature: string, effect: string }[]}
 */
function search(which, query = '', kind = '') {
  const words = query.trim().split(/\s+/).filter(Boolean).map((w) => w.toLowerCase());
  const out = [];
  for (const s of sections(which)) {
    for (const it of s.items) {
      if (kind && it.kind !== kind) continue;
      const hay = `${s.part} ${it.feature} ${it.effect}`.toLowerCase();
      if (words.every((w) => hay.includes(w))) out.push({ chapter: s.chapter, sectionId: s.id, part: s.part, verses: s.verses, page: s.page, ...it });
    }
  }
  return out;
}

module.exports = { DATA, BOOKS, sections, search };
