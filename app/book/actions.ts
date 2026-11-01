'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const B = require('../../src/report/horoscopeBook/bookSections');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { bookCatalogue: catalogue } = require('../../src/report/horoscopeBook/bookCatalogue');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildBirthParticulars } = require('../../src/report/birthParticulars');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface BookRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  /** the page ids to put in the book, as the catalogue lists them */
  sections: string[];
  engine?: { ayanamsha?: string; houseSystem?: string; nodeType?: 'mean' | 'true' };
  dashaOptions?: { yearDays: number; balance: 'degree' | 'time' };
}

/** Every page of PL9's horoscope book by family, with whether this software builds it yet. */
export async function bookCatalogue() {
  return JSON.parse(JSON.stringify(catalogue()));
}

/**
 * The book for one person: the cover's particulars and each chosen page's tables and charts, in the book's order. A saved profile is
 * read with the settings it was saved with.
 */
export async function computeBook(req: BookRequest) {
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
    input = { ...req.form, ...(req.engine ?? {}) };
    name = (req.form as any).name ?? '';
  } else {
    throw new Error('ஒரு சுயவிவரம் அல்லது பிறப்பு விவரம் தேவை.');
  }
  const options = req.dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  const built = await B.buildBookSections({ name, birth: input, ids: req.sections, dashaOptions: options });
  if (built.length === 0) throw new Error('குறைந்தது ஒரு பக்கத்தைத் தேர்வு செய்யுங்கள்.');
  const byId = new Map<string, any>();
  for (const family of catalogue()) for (const item of family.items) byId.set(item.id, { ...item, family: family.ta });
  const particulars = await buildBirthParticulars({
    birth: input,
    engine: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    dashaOptions: options,
    gender: input.gender,
    name,
  });
  return JSON.parse(JSON.stringify({
    name,
    particulars,
    sections: built.map((s: any) => ({ ...byId.get(s.id), doc: s.doc })),
  }));
}
