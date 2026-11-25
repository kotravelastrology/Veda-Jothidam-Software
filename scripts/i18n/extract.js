'use strict';

/**
 * Every Tamil text the program can show, read from its source (the TypeScript parser, not regular expressions): string literals,
 * template literals with {0}, {1}... for their expressions, and JSX text, in app/ and src/; the short strings of fixtures/*.json; and the
 * pairs where a data object keeps the Tamil beside the book's own English (ta/en, xTa/x), which the English interface shows as the
 * book printed it. Used by scripts/i18n/build.js and test-i18n.js.
 */
const fs = require('node:fs');
const path = require('node:path');

const TA = /[஀-௿]/;
const fold = (s) => String(s).replace(/\s+/g, ' ').trim();

/** JSX text is shown with its HTML entities decoded (&ldquo; is “ on the page). */
const ENTITIES = { ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', quot: '"', apos: "'", amp: '&', lt: '<', gt: '>', nbsp: ' ', middot: '·', mdash: '—', ndash: '–', hellip: '…', rarr: '→', larr: '←', times: '×', deg: '°' };
const decodeEntities = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENTITIES[e] ?? m;
});

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, list);
    else list.push(p);
  }
  return list;
}

function pairsFrom(obj, pairs) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach((o) => pairsFrom(o, pairs)); return; }
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && TA.test(v)) {
      const enKey = k === 'ta' ? 'en' : k.endsWith('Ta') ? k.slice(0, -2) : null;
      const en = enKey ? obj[enKey] : null;
      if (typeof en === 'string' && en.trim() && !TA.test(en)) pairs.set(fold(v), fold(en));
    } else if (v && typeof v === 'object') pairsFrom(v, pairs);
  }
}

/**
 * @param {string} repo
 * @returns {{ keys: { k: string, kind: 'ui'|'engine', n: number, files: string[] }[], pairs: Map<string, string> }}
 */
function extractTamil(repo) {
  const ts = require(path.join(repo, 'node_modules/typescript'));
  const keys = new Map();
  const pairs = new Map();
  const add = (raw, file, kind) => {
    const k = fold(raw);
    if (!k || !TA.test(k)) return;
    const e = keys.get(k) ?? { k, kind, n: 0, files: [] };
    e.n += 1;
    if (e.files.length < 3 && !e.files.includes(file)) e.files.push(file);
    if (kind === 'ui') e.kind = 'ui';
    keys.set(k, e);
  };
  const sources = [...walk(path.join(repo, 'app')), ...walk(path.join(repo, 'src'))]
    .filter((f) => /\.(tsx?|js)$/.test(f) && !/\.d\.ts$/.test(f) && !f.includes(`${path.sep}i18n${path.sep}`));
  for (const f of sources) {
    const text = fs.readFileSync(f, 'utf8');
    if (!TA.test(text)) continue;
    const rel = path.relative(repo, f).split(path.sep).join('/');
    const kind = /\.tsx$/.test(f) || rel.startsWith('app/') ? 'ui' : 'engine';
    const scriptKind = f.endsWith('.tsx') ? ts.ScriptKind.TSX : f.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS;
    const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, scriptKind);
    const hasJsx = (n) => {
      let found = false;
      (function look(x) {
        if (found) return;
        if (ts.isJsxElement(x) || ts.isJsxSelfClosingElement(x) || ts.isJsxFragment(x)) { found = true; return; }
        ts.forEachChild(x, look);
      })(n);
      return found;
    };
    const isPlus = (n) => ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.PlusToken;
    const isLiteral = (n) => ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n);
    const plusParts = (n, out) => {
      if (ts.isParenthesizedExpression(n) && isPlus(n.expression)) return plusParts(n.expression, out);
      if (isPlus(n)) { plusParts(n.left, out); plusParts(n.right, out); } else out.push(n);
      return out;
    };
    (function visit(node) {
      // 'அ ' + 'ஆ' (a long text split over lines) is shown as one text, and 'அ ' + x + ' ஆ' as a pattern "அ {0} ஆ": not its pieces
      if (isPlus(node) && !isPlus(node.parent)) {
        const parts = plusParts(node, []);
        const literals = parts.filter(isLiteral);
        if (literals.some((l) => TA.test(l.text)) && (literals.length > 1 || parts.length > 1)) {
          let i = 0;
          add(parts.map((p) => (isLiteral(p) ? p.text : `{${i++}}`)).join(''), rel, kind);
          parts.filter((p) => !isLiteral(p)).forEach(visit);
          return;
        }
      }
      if (isLiteral(node)) add(node.text, rel, kind);
      else if (ts.isTemplateExpression(node)) {
        let s = node.head.text;
        node.templateSpans.forEach((sp, i) => { s += `{${i}}${sp.literal.text}`; });
        add(s, rel, kind);
      } else if (ts.isJsxText(node)) add(decodeEntities(node.text), rel, 'ui');
      if (ts.isJsxElement(node)) {
        // An element whose children are text and {expressions} only is drawn as text nodes the translator reads together:
        // its whole sentence becomes one pattern ("({0} வரை)"), so English can order the words its own way
        const kids = node.children.filter((c) => !(ts.isJsxText(c) && c.containsOnlyTriviaWhiteSpaces));
        if (kids.length > 1 && kids.some((c) => ts.isJsxExpression(c) && c.expression) && kids.every((c) => ts.isJsxText(c) || (ts.isJsxExpression(c) && c.expression && !hasJsx(c)))) {
          let i = 0;
          const s = kids.map((c) => (ts.isJsxText(c) ? decodeEntities(c.text) : `{${i++}}`)).join('');
          if (TA.test(s)) add(s, rel, 'ui');
        }
      }
      ts.forEachChild(node, visit);
    })(sf);
    if (f.endsWith('.js') && /\b(en|[a-z]+Ta)["']?\s*:/.test(text)) {
      try { pairsFrom(require(f), pairs); } catch { /* a module that needs the server */ }
    }
  }
  for (const f of walk(path.join(repo, 'fixtures')).filter((x) => x.endsWith('.json'))) {
    let j;
    try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { continue; }
    pairsFrom(j, pairs);
    const rel = path.relative(repo, f).split(path.sep).join('/');
    (function strings(v) {
      if (typeof v === 'string') { if (v.length <= 120) add(v, rel, 'engine'); } else if (Array.isArray(v)) v.forEach(strings);
      else if (v && typeof v === 'object') Object.values(v).forEach(strings);
    })(j);
  }
  return { keys: [...keys.values()], pairs };
}

module.exports = { extractTamil, fold, TA, decodeEntities };
