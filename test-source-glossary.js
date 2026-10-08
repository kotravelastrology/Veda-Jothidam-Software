/**
 * VJ-026 — source-aware learning and glossary.
 *
 * Acceptance: Tamil term ↔ rule ↔ source locator; redistribution rights
 * documented.
 *
 * The glossary is only worth having if it cannot lie. Two ways it could:
 * by citing a source nothing in the engines uses, or by printing a page
 * number the engines have since changed. Both are closed here — the locator
 * is read from the code, and every citation in the code must resolve to a
 * registered source.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { SOURCES, RIGHTS_STATUSES, getSource, resolveByTitle, unresolvedRights } = require('./src/sources/registry');
const { scanCitations, resolveSrcRoot } = require('./src/sources/citationScan');
const { TERMS, buildGlossary, describeTerm, GlossaryError } = require('./src/sources/glossary');

// ------------------------------------------------ rights are documented --

assert.ok(SOURCES.length >= 4);
const ids = SOURCES.map((s) => s.id);
assert.equal(new Set(ids).size, ids.length, 'source ids are unique');

for (const source of SOURCES) {
  assert.ok(source.title, `${source.id}: a source must be nameable`);
  assert.ok(source.titleTa, `${source.id}: the Tamil name is what the glossary shows`);
  assert.ok(source.rights, `${source.id}: rights are not optional`);

  const r = source.rights;
  assert.ok(RIGHTS_STATUSES.includes(r.status), `${source.id}: unknown rights status ${r.status}`);
  assert.equal(typeof r.mayShip, 'boolean');
  assert.equal(typeof r.mayQuoteShort, 'boolean');
  assert.ok(r.note && r.note.length > 40, `${source.id}: the reasoning must be written down, not implied`);

  // The safe default is load-bearing: anything not positively cleared must not
  // be shippable, and must say what would clear it.
  if (r.status !== 'PERMITTED') {
    assert.equal(r.mayShip, false, `${source.id}: only a PERMITTED source may ship`);
    assert.ok(r.toConfirm, `${source.id}: say what would settle this`);
  }
  if (!r.verified) {
    assert.equal(r.mayShip, false, `${source.id}: unverified rights cannot permit shipping`);
  }
}

// A modern translation of an ancient text is still a modern work.
const bphs = getSource('BPHS_SANTHANAM');
assert.equal(bphs.rights.status, 'RESTRICTED');
assert.equal(bphs.rights.mayShip, false);

// At least one source is honestly marked unknown rather than assumed open.
assert.ok(SOURCES.some((s) => s.rights.status === 'UNVERIFIED'),
  'a licence nobody has read is UNVERIFIED, not PERMITTED');
assert.ok(unresolvedRights().length > 0);

// --------------------------------- the source tree is found, not assumed --

// Under the Next bundler `__dirname` is a placeholder, not the source tree —
// the same trap that made `engineVersion()` return "unknown". The first
// candidate must therefore be the working directory, which the server runs
// from; a page that scanned nothing would render an empty glossary rather
// than an error, so this is checked here.
const root = resolveSrcRoot();
assert.equal(root, path.join(process.cwd(), 'src'),
  'the working directory must be preferred over __dirname');
assert.ok(fs.existsSync(path.join(root, 'chart')));

// A wrong root must fail loudly instead of returning an empty scan that looks
// like "this project cites no sources".
assert.throws(() => scanCitations({ root: path.join(process.cwd(), 'no-such-dir') }));

// ------------------------------------- every citation has a known source --

const citations = scanCitations();
assert.ok(citations.length >= 25, `expected the engines to cite sources; found ${citations.length}`);

for (const c of citations) {
  assert.ok(c.title, `${c.module}:${c.line}: a citation with no title cannot be checked (or its spread constant's name is declared elsewhere with another title)`);
  assert.ok(resolveByTitle(c.title),
    `${c.module}:${c.line}: "${c.title}" is cited by the engines but is not in the registry`);
  assert.ok(c.pageLocus.length > 5);
}

// A spread constant's name is matched across all of src: if two modules declare
// it with different titles, the citation must come back untitled (and fail
// above) rather than be credited to whichever module was read last.
{
  const os = require('node:os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-'));
  try {
    fs.writeFileSync(path.join(tmp, 'a.js'), "const KAPOOR = Object.freeze({\n  title: 'Book A',\n});\nconst X = { ...KAPOOR, pageLocus: 'p.1 of A' };\n");
    fs.writeFileSync(path.join(tmp, 'b.js'), "const KAPOOR = Object.freeze({\n  title: 'Book B',\n});\n");
    assert.deepEqual(scanCitations({ root: tmp }).map((c) => c.title), [null], 'an ambiguous constant name resolves to no title');
    fs.writeFileSync(path.join(tmp, 'b.js'), "const KAPOOR = Object.freeze({\n  title: 'Book A',\n});\n");
    assert.deepEqual(scanCitations({ root: tmp }).map((c) => c.title), ['Book A'], 'the same title declared twice is fine');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// The scanner must not read its own documentation as a citation.
assert.ok(!citations.some((c) => c.module.startsWith('sources/')),
  'the sources/ directory describes this pattern and must be excluded');

// ------------------------------------------------ term ↔ rule ↔ locator --

const glossary = buildGlossary();
assert.equal(glossary.length, TERMS.length);
assert.equal(new Set(TERMS.map((t) => t.id)).size, TERMS.length, 'term ids are unique');

for (const entry of glossary) {
  assert.ok(/[஀-௿]/.test(entry.ta), `${entry.id}: the Tamil term is the entry point`);
  assert.ok(/[஀-௿]/.test(entry.meaning), `${entry.id}: explained in Tamil`);
  assert.ok(entry.translit && entry.en, `${entry.id}: transliteration and English aid search`);

  // The rule must exist. A glossary pointing at a deleted module is the
  // drift this design is meant to prevent.
  const modulePath = path.join(__dirname, 'src', entry.module);
  assert.ok(fs.existsSync(modulePath), `${entry.id}: ${entry.module} does not exist`);

  assert.ok(entry.source && entry.source.id, `${entry.id}: resolved to a registered source`);
  assert.ok(entry.source.rights, `${entry.id}: the rights travel with the term`);
  assert.ok(entry.pageLocus, `${entry.id}: a locator`);
  assert.equal(typeof entry.locatorComplete, 'boolean');
  assert.match(entry.citedAt, /^src\/.+:\d+$/);
}

// The locator must be the code's, not a copy. Change the code and the
// glossary changes with it — so no term may hardcode a page number.
const glossarySource = fs.readFileSync(path.join(__dirname, 'src/sources/glossary.js'), 'utf8');
assert.ok(!/pageLocus:\s*['"`]/.test(glossarySource),
  'the glossary must derive locators, never declare them');

for (const entry of glossary) {
  const live = citations.find((c) => `src/${c.module}:${c.line}` === entry.citedAt);
  assert.ok(live, `${entry.id}: citedAt must point at a real citation`);
  assert.equal(entry.pageLocus, live.pageLocus, `${entry.id}: locator must match the code exactly`);
}

// ------------------------------------------ ambiguity fails, not guesses --

// A module with several citations must be disambiguated, or lookup refuses.
const multi = TERMS.find((t) => t.module === 'chart/ashtakavargaVariations.js');
assert.ok(multi);
assert.throws(
  () => describeTerm({ ...multi, id: 'AMBIGUOUS', locusMatch: undefined }),
  GlossaryError,
  'a term matching several citations must fail rather than pick one',
);
assert.throws(
  () => describeTerm({ ...multi, id: 'NO_MATCH', locusMatch: 'not in any locator' }),
  GlossaryError,
);
assert.throws(
  () => describeTerm({ id: 'GONE', ta: 'x', module: 'chart/deleted.js' }),
  GlossaryError,
);

// --------------------------------------- unverified locators are visible --

// Eight rules name a chapter and verse but no page: the rule was transcribed
// from a chapter reference and never checked against the printed page. The
// count is asserted so a new one cannot be added quietly, and so this number
// can only come down deliberately.
const incomplete = citations.filter((c) => !c.complete);
assert.equal(incomplete.length, 8,
  `expected 8 unverified locators, found ${incomplete.length}: `
  + incomplete.map((c) => c.module).join(', '));

const incompleteTerms = glossary.filter((t) => !t.locatorComplete);
assert.equal(incompleteTerms.length, 8);
for (const t of incompleteTerms) {
  assert.match(t.pageLocus, /TBD/i, `${t.id}: an unverified locator says so`);
}

// And the rest really are verified, so the flag distinguishes something.
assert.ok(glossary.filter((t) => t.locatorComplete).length >= 15);

console.log(JSON.stringify({
  pass: true,
  sources: SOURCES.length,
  rightsUnresolved: unresolvedRights().map((s) => `${s.id}:${s.rights.status}`),
  citations: citations.length,
  terms: glossary.length,
  locatorsVerified: glossary.filter((t) => t.locatorComplete).length,
  locatorsTBD: incompleteTerms.map((t) => t.module),
}, null, 2));
