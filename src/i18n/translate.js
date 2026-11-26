'use strict';

/**
 * The English interface: the program is written in Tamil, and in English mode the Tamil text on the screen is replaced, text by text,
 * from a catalogue (src/i18n/en.json, made by scripts/i18n/ from the source and from the books' own English where the data keeps it).
 * The pages are not changed; src/i18n/Translator.tsx applies this to the page as it is drawn and redrawn.
 *
 * A catalogue entry is the Tamil exactly as the source writes it (whitespace folded) with its English. Text built by the code from
 * parts (`${lord} தசை`, `${n} நாள் மீதம்`) is in the catalogue as a pattern with {0}, {1}... for the parts; a part that is Tamil is
 * itself looked up. What has no entry stays as it is: a book's statement whose English the data does not keep is shown in the Tamil the
 * program wrote it in, never put into English by guesswork.
 */
const TA = /[஀-௿]/;
const SEPARATORS = /( · | — | – |: |; |, | \| | \/ |\n)/;
const TA_RUN = /[஀-௿]+(?: [஀-௿]+)*/g;

const fold = (s) => String(s).replace(/\s+/g, ' ').trim();
const tamilCount = (s) => (s.match(/[஀-௿]/g) || []).length;
/** Of two partial translations (either may be null), the one with less Tamil left; the first when equal. */
const fewerTamil = (a, b) => (a == null ? b : b == null ? a : tamilCount(b) < tamilCount(a) ? b : a);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The English suffix of an ordinal number: 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st... */
function suffix(n) {
  const v = Number(n) % 100;
  if (v >= 11 && v <= 13) return 'th';
  return ['th', 'st', 'nd', 'rd'][Number(n) % 10] ?? 'th';
}

/** The catalogue writes every ordinal as "{0}th" (Tamil has one suffix, -ஆம்): put 1st, 2nd, 3rd right. */
const ordinals = (s) => s.replace(/(\d)-th\b/g, '$1th').replace(/(^|[^\d.])(\d+)th\b/g, (_, pre, n) => `${pre}${n}${suffix(n)}`);

/**
 * When the number and its suffix are separate texts on the page ("5" and "-ஆம் வீடு" -> "th house"), the suffix is put right from the
 * number before it.
 */
function fixLeadingOrdinal(previousText, translated) {
  const m = /(\d+)\s*$/.exec(String(previousText ?? ''));
  if (!m || !/^th\b/.test(translated)) return translated;
  return suffix(m[1]) + translated.slice(2);
}

/**
 * @param {{ exact: Record<string, string>, patterns?: [string, string][] }} catalogue
 */
function buildTranslator(catalogue) {
  const exact = new Map(Object.entries(catalogue.exact || {}).map(([k, v]) => [fold(k), v]));
  // A pattern '{0} தசை' -> /^(.+?) தசை$/, indexed by its longest Tamil literal so that only likely patterns are tried
  const byFragment = new Map();
  for (const [ta, en] of catalogue.patterns || []) {
    const key = fold(ta);
    const literals = key.split(/\{\d+\}/);
    if (!literals.some((l) => TA.test(l))) continue;
    const order = [...key.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));
    const re = new RegExp(`^${literals.map(escapeRe).join('(.+?)')}$`);
    const fragment = literals.filter((l) => TA.test(l)).sort((a, b) => b.length - a.length)[0].trim();
    // the word after a part can fix its sense: "{1}கிழமை" is a weekday (Tuesday, not Mars), "{1} மாதம்" a month
    const ctx = literals.slice(1, order.length + 1).map((l) => (/^\s?(க்)?கிழமை/.test(l) ? 'weekday' : /^\s?மாத/.test(l) ? 'month' : null));
    const list = byFragment.get(fragment) ?? [];
    list.push({ re, en, order, ctx, literal: literals.join('').length });
    byFragment.set(fragment, list);
  }
  const fragments = [...byFragment.keys()];

  const cache = new Map();
  const inContext = (core, context) => (context ? exact.get(`${context}::${core}`) : undefined);

  function viaPattern(core, depth, context) {
    // every pattern that may fit, the one with the most words of its own first ("ராசிக்கு {0} வீடு" before "{0}-ஆம் வீடு"); the first
    // that puts the whole text into English wins, else the one that leaves the least Tamil
    const candidates = [];
    for (const fragment of fragments) if (core.includes(fragment)) candidates.push(...byFragment.get(fragment));
    candidates.sort((a, b) => b.literal - a.literal);
    let best = null;
    for (const p of candidates) {
      const m = p.re.exec(core);
      if (!m) continue;
      const parts = m.slice(1).map((x, j) => {
        if (!TA.test(x)) return x;
        const part = fold(x);
        return inContext(part, p.ctx[j] ?? context) ?? translateCore(part, depth + 1, context) ?? x;
      });
      const out = p.en.replace(/\{(\d+)\}/g, (_, i) => parts[p.order.indexOf(Number(i))] ?? '');
      if (!TA.test(out)) return out;
      best = fewerTamil(best, out);
    }
    return best;
  }

  function viaSegments(core, depth, context) {
    const pieces = core.split(SEPARATORS);
    if (pieces.length < 3) return null;
    let changed = false;
    const out = pieces.map((piece, i) => {
      if (i % 2 === 1 || !TA.test(piece)) return piece;
      const t = translateCore(piece.trim(), depth + 1, context);
      if (t == null) return piece;
      changed = true;
      return piece.replace(piece.trim(), t);
    });
    return changed ? out.join('') : null;
  }

  /**
   * A short Tamil label followed by the program's own English ("கோசாரம், நிகழ்வுகள் — Transits and events", "பெயர் (Name)"): the
   * English. Not when the "English" is a code, a number or a citation (digits, "_"), nor after a long Tamil text (a sentence, not a label).
   */
  function viaBilingual(core) {
    for (const sep of [' — ', ' · ', ' (']) {
      const i = core.lastIndexOf(sep);
      if (i <= 0) continue;
      const head = core.slice(0, i);
      let tail = core.slice(i + sep.length);
      if (sep === ' (') { if (!tail.endsWith(')')) continue; tail = tail.slice(0, -1); }
      if (head.length <= 40 && TA.test(head) && !/[A-Za-z0-9]/.test(head) && !TA.test(tail) && /[a-z]{3,}/.test(tail) && !/[\d_()]/.test(tail)) return tail.trim();
    }
    return null;
  }

  /** Last: Tamil words inside other text ("10:30 (செவ்வாய்)"), when every run of them is a catalogue entry. */
  function viaWords(core, context) {
    const runs = core.match(TA_RUN);
    if (!runs) return null;
    let out = core;
    for (const r of runs) {
      const t = inContext(r, context) ?? exact.get(r);
      if (t == null) return null;
      out = out.replace(r, t);
    }
    return out;
  }

  /** English for one Tamil text (folded), or null; `context` is the page's data-i18n-ctx around it. */
  function translateCore(core, depth = 0, context = undefined) {
    if (!TA.test(core) || depth > 4) return null;
    const own = inContext(core, context) ?? exact.get(core);
    if (own != null) return own;
    const key = `${context ?? ''}|${core}`;
    if (cache.has(key)) return cache.get(key);
    // the program's own English beside a label; else whole English from a pattern, the segments or the words, in that order; else
    // the reading that leaves the least Tamil
    const bilingual = viaBilingual(core);
    if (bilingual != null) { cache.set(key, bilingual); return bilingual; }
    let r = viaPattern(core, depth, context);
    if (r == null || TA.test(r)) {
      const bySegments = viaSegments(core, depth, context);
      r = bySegments != null && !TA.test(bySegments) ? bySegments : (viaWords(core, context) ?? fewerTamil(r, bySegments));
    }
    cache.set(key, r);
    return r;
  }

  /**
   * The text with its own leading and trailing spaces kept, translated, or null when there is no translation. `context` (the nearest
   * data-i18n-ctx of the page, e.g. 'weekday' or 'month') picks the sense of a word with two: செவ்வாய் is Mars, but Tuesday under
   * 'weekday::செவ்வாய்'.
   */
  function translate(text, context) {
    const s = String(text);
    if (!TA.test(s)) return null;
    const core = fold(s);
    const t = translateCore(core, 0, context);
    if (t == null) return null;
    let lead = /^\s/.test(s) ? ' ' : '';
    // a Tamil suffix written onto the text before it ("{star}-இலிருந்து") is a word of its own in English (" from"); an ordinal
    // suffix stays on its number ("5" + "th house")
    if (!lead && core.startsWith('-') && /^[A-Za-z(]/.test(t) && !/^(st|nd|rd|th)\b/.test(t)) lead = ' ';
    const trail = /\s$/.test(s) ? ' ' : '';
    return lead + ordinals(t) + trail;
  }

  /**
   * The texts of one element, read together (an element drawn from "({until} வரை)" has the texts "(", "06:57", " வரை)"): when the
   * whole reads as one catalogue sentence, the English goes in the first text and the others are emptied; else null.
   */
  function translateParts(parts, context) {
    const whole = parts.join('');
    if (!TA.test(whole)) return null;
    const t = translate(whole, context);
    if (t == null) return null;
    return parts.map((_, i) => (i === 0 ? t : ''));
  }

  return { translate, translateParts, size: exact.size, patterns: fragments.length };
}

module.exports = { buildTranslator, fold, TA, ordinals, fixLeadingOrdinal, suffix };
