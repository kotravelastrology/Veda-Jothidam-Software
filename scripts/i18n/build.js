'use strict';

/**
 * Builds the English interface's catalogue, src/i18n/en.json ({ exact, patterns }), from three sources, later ones winning:
 *  1. the names (src/i18n/catalog/names.js, index by index from src/sources/tamilNames.js);
 *  2. the books' own English, where a data object keeps it beside the Tamil (scripts/i18n/extract.js pairs);
 *  3. the hand translations, src/i18n/catalog/*.json ({ "Tamil as the source writes it": "English" }; a key with {0}, {1}... is a pattern).
 * Usage: node scripts/i18n/build.js [--missing]   (--missing lists the interface's Tamil that has no English yet)
 */
const fs = require('node:fs');
const path = require('node:path');
const { extractTamil, fold, TA } = require('./extract');

const REPO = path.join(__dirname, '..', '..');
const CATALOG_DIR = path.join(REPO, 'src/i18n/catalog');
const OUT = path.join(REPO, 'src/i18n/en.json');

function handTranslations() {
  const out = [];
  for (const f of fs.readdirSync(CATALOG_DIR).filter((x) => x.endsWith('.json')).sort()) {
    const j = JSON.parse(fs.readFileSync(path.join(CATALOG_DIR, f), 'utf8'));
    for (const [ta, en] of Object.entries(j)) out.push([fold(ta), String(en), f]);
  }
  return out;
}

function buildCatalogue(repo = REPO) {
  const { nameEntries } = require(path.join(repo, 'src/i18n/catalog/names.js'));
  const extracted = extractTamil(repo);
  const exact = { ...nameEntries() };
  for (const [ta, en] of extracted.pairs) if (!(ta in exact)) exact[ta] = en;
  const patterns = new Map();
  for (const [ta, en] of handTranslations()) {
    if (/\{\d+\}/.test(ta)) patterns.set(ta, en);
    else exact[ta] = en;
  }
  const sortedExact = Object.fromEntries(Object.entries(exact).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  const sortedPatterns = [...patterns.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return { catalogue: { exact: sortedExact, patterns: sortedPatterns }, extracted };
}

/** The extracted Tamil the catalogue cannot put wholly into English (a text only partly put into English counts as missing). */
function missing(catalogue, extracted) {
  const { buildTranslator } = require(path.join(REPO, 'src/i18n/translate.js'));
  const tr = buildTranslator(catalogue);
  const patternKeys = new Set(catalogue.patterns.map(([k]) => k));
  return extracted.keys.filter((e) => {
    if (/\{\d+\}/.test(e.k)) return !patternKeys.has(e.k);
    const t = tr.translate(e.k);
    return t == null || TA.test(t);
  });
}

if (require.main === module) {
  const { catalogue, extracted } = buildCatalogue();
  fs.writeFileSync(OUT, `${JSON.stringify(catalogue, null, 0)}\n`);
  const miss = missing(catalogue, extracted);
  const ui = extracted.keys.filter((e) => e.kind === 'ui');
  const uiMiss = miss.filter((e) => e.kind === 'ui');
  console.log(`en.json: ${Object.keys(catalogue.exact).length} entries, ${catalogue.patterns.length} patterns`);
  console.log(`interface strings: ${ui.length - uiMiss.length}/${ui.length} have English`);
  console.log(`all strings: ${extracted.keys.length - miss.length}/${extracted.keys.length} have English`);
  if (process.argv.includes('--missing')) {
    const outFile = process.argv[process.argv.indexOf('--missing') + 1];
    if (outFile && !outFile.startsWith('--')) fs.writeFileSync(outFile, JSON.stringify(miss.map((e) => ({ k: e.k, kind: e.kind, f: e.files[0] })), null, 0));
  }
}

module.exports = { buildCatalogue, missing, TA };
