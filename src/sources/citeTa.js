/**
 * One citation line for a source, the way the pages show it:
 *
 *   <book title>, <author> — §25.13, ப.687
 *
 * The owner's rule (2026-10-20): name the book and its author, and give the page in that book.
 * The PDF / scan page is kept in the data (we need it to find a passage again in the scans) but
 * is never shown. Where a book's scan carries no printed page numbers at all — Raman's does not —
 * the scan's own page is shown and marked, rather than passed off as a printed page.
 *
 * `pageLocus` is free text written per reading, so this reads what it can and degrades quietly:
 * it keeps the section reference before the page, drops the quoted passage, and never shows a
 * PDF number.
 */

/** 'Muhurta Chintamani (Girish Chand Sharma)' -> 'Muhurta Chintamani' */
const titleOf = (title) => String(title ?? '').replace(/\s*\([^)]*\)\s*$/, '').trim();

/** 'Daivagya Acharya Shriram; Girish Chand Sharma (translation and notes)' -> 'Daivagya Acharya Shriram' */
const authorOf = (author) => String(author ?? '').split(';')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();

/** The section reference a locus opens with (§25.13, Chapter XIII, "Religious - Agnihotra", …). */
function sectionOf(locus) {
  const head = String(locus ?? '').split(/,?\s*printed\s|:\s*"|,\s*PDF\s/)[0].trim();
  if (!head || /^\s*$/.test(head)) return '';
  // Drop a trailing quoted title's closing quote and any stray bracket.
  return head.replace(/\s*\(PDF[^)]*\)\s*$/i, '').replace(/[,;]\s*$/, '').trim();
}

/**
 * The page in the printed book: 'printed p.687 (PDF 722)' -> 'ப.687',
 * 'printed pp.250-251 (…)' -> 'ப.250-251'. Returns '' when the locus names no printed page.
 */
function printedPageOf(locus) {
  const m = /printed\s+pp?\.\s*([0-9]+(?:\s*-\s*[0-9]+)?)/i.exec(String(locus ?? ''));
  return m ? `ப.${m[1].replace(/\s*-\s*/, '-')}` : '';
}

/** The scan's own page, for the books whose scans have no printed numbers. */
function scanPageOf(locus) {
  const m = /PDF\s+pp?\.\s*([0-9]+(?:\s*-\s*[0-9]+)?)/i.exec(String(locus ?? ''));
  return m ? `ப.${m[1].replace(/\s*-\s*/, '-')} (ஸ்கேன்)` : '';
}

/** The book and author, without a page: 'Hindu Electional Astrology, V.K. Shridhar'. */
function bookTa(source) {
  const t = titleOf(source?.title);
  const a = authorOf(source?.author);
  return a && t ? `${t}, ${a}` : t || a || '';
}

/** The whole line: 'Hindu Electional Astrology, V.K. Shridhar — §25.13, ப.687'. */
function citeTa(source) {
  const book = bookTa(source);
  const locus = source?.pageLocus;
  const page = printedPageOf(locus) || scanPageOf(locus);
  const section = sectionOf(locus);
  const tail = [section, page].filter(Boolean).join(', ');
  return tail ? `${book} — ${tail}` : book;
}

/** Same line, but with the page's own name for the book (some pages keep Tamil book names). */
function citeWith(source, bookLabel) {
  const line = citeTa(source);
  const book = bookTa(source);
  return bookLabel && line.startsWith(book) ? bookLabel + line.slice(book.length) : line;
}

module.exports = { citeTa, bookTa, citeWith };
module.exports.default = citeTa;
