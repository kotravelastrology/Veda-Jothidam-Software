/**
 * VJ-026 — reads every source citation out of the engines themselves.
 *
 * The glossary must not be a second, hand-maintained copy of what the
 * calculators cite. A hand-written list drifts the first time a locator is
 * corrected, and then the page shows a user a page number the engine no longer
 * uses — which is worse than showing none, because it looks checked.
 *
 * So the list is derived: this scans the source tree for `pageLocus:` and
 * reports what it finds. `test-source-glossary.js` then asserts that every
 * citation resolves to a registered source, and that the glossary points only
 * at citations that exist.
 *
 * A locator containing "TBD" is reported as `complete: false`. Those name a
 * chapter and verse but no page, so the rule was transcribed from a chapter
 * reference and never checked against the printed page — a real distinction in
 * a project whose rule is that a source must be *visually* verified.
 */

const fs = require('node:fs');
const path = require('node:path');

/**
 * Where the engine source tree is on disk.
 *
 * Next.js bundles this module, and inside the bundle `__dirname` is a
 * placeholder (`D:\ROOT\src`) rather than the real path — the same trap that
 * made `engineVersion()` return "unknown" and gave one chart two snapshot ids.
 * The server process runs from the project root, so that is the reliable
 * candidate; `__dirname` is kept for plain Node, where it is correct.
 *
 * A candidate only counts if it actually looks like the engine tree, so a
 * wrong guess fails loudly at startup instead of silently scanning nothing and
 * reporting a glossary with no citations.
 */
function resolveSrcRoot() {
  const candidates = [
    path.join(process.cwd(), 'src'),
    path.join(__dirname, '..'),
    path.join(process.cwd(), '..', 'src'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(path.join(candidate, 'chart')) && fs.existsSync(path.join(candidate, 'contracts'))) {
        return candidate;
      }
    } catch { /* try the next candidate */ }
  }
  throw new Error(
    'cannot locate the engine source tree; tried: ' + candidates.join(', '),
  );
}

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // `sources/` is skipped: this file documents the very pattern it looks
      // for, and a scanner that reads its own prose reports a phantom citation.
      if (!/node_modules|\.next|^sources$/.test(entry.name)) out.push(...listFiles(full));
    } else if (/\.(js|ts|tsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * The slice of text from the start of the object literal that encloses
 * `index`, so a field is read from its own object rather than from a fixed
 * window. A source object with long `file` and `tradition` strings can put
 * more than 500 characters between its `title` and its `pageLocus`.
 */
function enclosingObject(text, index) {
  let depth = 0;
  for (let i = index; i >= 0; i -= 1) {
    if (text[i] === '}') depth += 1;
    else if (text[i] === '{') {
      if (depth === 0) return text.slice(i, index);
      depth -= 1;
    }
  }
  return text.slice(Math.max(0, index - 800), index);
}

const quoted = (text, key) => {
  const m = text.match(new RegExp(`\\b${key}:\\s*(['"\`])([\\s\\S]*?)\\1`));
  return m ? m[2].replace(/\s+/g, ' ').trim() : null;
};

/**
 * Titles are declared once per module as a named constant and then spread at
 * the `attachSource` call site, where the locator is added. So a citation's
 * title is found either just above it, or on the constant it spreads.
 *
 * Names are matched across all of src, so a name declared in two modules with
 * two different titles cannot be resolved: it maps to null, and the citation
 * fails as untitled instead of being credited to whichever module was read
 * last (two `KAPOOR` constants did exactly that, 2026-10-08).
 */
function collectTitles(files) {
  const titles = new Map();
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    // A source constant may be a bare literal or wrapped in Object.freeze(),
    // which is the better habit — a citation that can be mutated at runtime is
    // not much of a citation. The scanner used to understand only the bare
    // form, so freezing a source made its citations unresolvable and failed the
    // build for the wrong reason.
    for (const m of text.matchAll(/(?:const|let|var)\s+([A-Z][A-Z_0-9]*)\s*=\s*(?:Object\.freeze\(\s*)?\{([\s\S]{0,800}?)\n\}/g)) {
      const title = quoted(m[2], 'title');
      if (!title) continue;
      titles.set(m[1], titles.has(m[1]) && titles.get(m[1]) !== title ? null : title);
    }
  }
  return titles;
}

function scanCitations({ root = null } = {}) {
  const base = root ?? resolveSrcRoot();
  const files = listFiles(base);
  const titles = collectTitles(files);
  const citations = [];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(base, file).split(path.sep).join('/');
    for (const m of text.matchAll(/pageLocus:\s*(['"`])([\s\S]*?)\1/g)) {
      const before = enclosingObject(text, m.index);
      const inline = [...before.matchAll(/title:\s*(['"`])([\s\S]*?)\1/g)].pop();
      const spread = [...before.matchAll(/\.\.\.\s*([A-Z][A-Z_0-9]*)/g)].pop();
      const title = (inline && inline[2].replace(/\s+/g, ' ').trim())
        || (spread && titles.get(spread[1]))
        || null;
      const locus = m[2].replace(/\s+/g, ' ').trim();
      citations.push({
        module: rel,
        line: text.slice(0, m.index).split('\n').length,
        title,
        pageLocus: locus,
        complete: !/TBD/i.test(locus),
      });
    }
  }
  citations.sort((a, b) => a.module.localeCompare(b.module) || a.line - b.line);
  return citations;
}

module.exports = { scanCitations, listFiles, resolveSrcRoot };
