const { UnsupportedInputError } = require('../contracts/chartContext');

/**
 * VJ-019 — the printable rendering of a ReportDocument.
 *
 * This HTML is both the **export preview** and the input to PDF generation,
 * so what the practitioner approves is what the client receives. Rendering
 * twice from the same document gives byte-identical output.
 *
 * Tamil is a complex script: vowel signs reorder and consonants form
 * ligatures, which needs real text shaping. Chromium does that through
 * HarfBuzz, which is why the PDF is produced by printing this page rather
 * than by a JavaScript PDF library — those generally place glyphs without
 * shaping and would render Tamil as disconnected marks.
 */

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/**
 * Print CSS, carrying the two layout guarantees the acceptance names.
 *
 * Long names: headings and cells wrap and break rather than running past the
 * page edge, so a very long name cannot push the layout sideways.
 *
 * No clipped tables: nothing uses `overflow: hidden`, wide tables shrink their
 * type instead of being cut, and rows are kept off page breaks.
 */
const PRINT_CSS = `
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: 'Noto Sans Tamil', 'Nirmala UI', 'Latha', 'Noto Sans', sans-serif;
    font-size: 10.5pt; color: #1a1a1a; line-height: 1.45;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  h1 {
    font-size: 16pt; margin: 0 0 2mm;
    /* A long name must wrap, never extend past the page. */
    overflow-wrap: anywhere; word-break: break-word; hyphens: auto;
  }
  .meta { font-size: 8.5pt; color: #555; margin-bottom: 6mm; overflow-wrap: anywhere; }
  section { margin-bottom: 7mm; break-inside: auto; }
  h2 {
    font-size: 12pt; margin: 0 0 2mm; padding-bottom: 1mm;
    border-bottom: 0.4mm solid #d8d2c4; break-after: avoid;
  }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td {
    border: 0.25mm solid #ddd8cc; padding: 1.2mm 1.6mm; text-align: left;
    vertical-align: top;
    /* Content wraps inside the cell instead of being clipped or overflowing. */
    overflow-wrap: anywhere; word-break: break-word; white-space: normal;
  }
  th { background: #f4f1e9; font-weight: 600; }
  /* A wide table scales its type down rather than losing columns. */
  table.wide { font-size: 7pt; }
  table.wide th, table.wide td { padding: 0.8mm 0.9mm; }
  tr { break-inside: avoid; }
  thead { display: table-header-group; }
  dl { display: grid; grid-template-columns: 38mm 1fr; gap: 1mm 3mm; margin: 0; }
  dt { color: #555; }
  dd { margin: 0; overflow-wrap: anywhere; }
  .evidence { font-size: 9pt; }
  .evidence li { margin-bottom: 1.5mm; overflow-wrap: anywhere; }
  .withheld { color: #8a5a00; }
  footer { margin-top: 8mm; font-size: 7.5pt; color: #777; overflow-wrap: anywhere; }
`;

function renderSection(section) {
  const heading = `<h2>${escapeHtml(section.heading)}</h2>`;

  if (section.kind === 'keyValue') {
    const rows = section.rows
      .map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join('');
    return `<section id="${escapeHtml(section.id)}">${heading}<dl>${rows}</dl></section>`;
  }

  if (section.kind === 'table') {
    const head = section.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join('');
    const body = section.rows
      .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
    const cls = section.wide ? ' class="wide"' : '';
    return `<section id="${escapeHtml(section.id)}">${heading}`
      + `<table${cls}><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></section>`;
  }

  if (section.kind === 'evidence') {
    const items = section.entries.map((e) => {
      const cls = e.status === 'SOURCE_REQUIRED' ? ' class="withheld"' : '';
      return `<li${cls}><strong>${escapeHtml(e.name)}</strong> — ${escapeHtml(e.locator)}</li>`;
    }).join('');
    return `<section id="${escapeHtml(section.id)}">${heading}`
      + `<ul class="evidence">${items}</ul></section>`;
  }

  return `<section id="${escapeHtml(section.id)}">${heading}`
    + `<p>${escapeHtml(section.text ?? '')}</p></section>`;
}

function renderReportHtml(document) {
  if (!document || document.documentVersion === undefined) {
    throw new UnsupportedInputError('a ReportDocument is required', 'document');
  }
  const generated = document.generatedAtMs === null || document.generatedAtMs === undefined
    ? null
    : new Date(document.generatedAtMs).toISOString().slice(0, 16).replace('T', ' ');

  return `<!DOCTYPE html>
<html lang="ta"><head><meta charset="utf-8">
<title>${escapeHtml(document.title)}</title>
<style>${PRINT_CSS}</style>
</head><body>
<h1>${escapeHtml(document.title)}</h1>
<p class="meta">${escapeHtml(document.settings.ayanamsha)} · ${escapeHtml(document.settings.houseSystem)}
 · snapshot ${escapeHtml(document.snapshotId.slice(0, 16))}
 · engine ${escapeHtml(document.engineVersion)}${generated ? ` · ${escapeHtml(generated)}` : ''}</p>
${document.sections.map(renderSection).join('\n')}
<footer>இந்த அறிக்கை snapshot ${escapeHtml(document.snapshotId)} இன் நகல்.
பிறகு பிறந்த நேரம் திருத்தப்பட்டாலும் இந்த அறிக்கை மாறாது.</footer>
</body></html>`;
}

module.exports = { renderReportHtml, PRINT_CSS, escapeHtml };
