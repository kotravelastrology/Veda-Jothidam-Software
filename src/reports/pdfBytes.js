/**
 * VJ-019 — structural validation of produced PDF bytes.
 *
 * F05 in the Phase 30 audit was HTML served under a PDF MIME type. The
 * acceptance criterion here is "valid bytes", so this checks the file really
 * is a PDF rather than trusting the extension — deliberately without a PDF
 * parsing dependency, since the point is an independent check.
 */

function inspectPdf(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    return { valid: false, reason: 'not a buffer' };
  }
  const head = buffer.subarray(0, 1024).toString('latin1');
  const tail = buffer.subarray(Math.max(0, buffer.length - 2048)).toString('latin1');
  const whole = buffer.toString('latin1');

  const versionMatch = head.match(/^%PDF-(\d\.\d)/);
  if (!versionMatch) {
    return { valid: false, reason: 'missing %PDF- header — this is not a PDF' };
  }
  if (!tail.includes('%%EOF')) {
    return { valid: false, reason: 'missing %%EOF trailer — the file is truncated' };
  }
  if (!/\/Type\s*\/Catalog/.test(whole)) {
    return { valid: false, reason: 'no document catalog' };
  }

  const pageCount = (whole.match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pageCount === 0) {
    return { valid: false, reason: 'no pages' };
  }

  // An embedded font proves the text will render on a machine that does not
  // have the typeface installed, which is the whole point for Tamil.
  const embeddedFonts = (whole.match(/\/FontFile2|\/FontFile3|\/FontFile\b/g) || []).length;
  const fontNames = [...new Set(
    (whole.match(/\/BaseFont\s*\/([A-Za-z0-9+\-,_]+)/g) || [])
      .map((m) => m.replace(/.*\//, '')),
  )];

  return {
    valid: true,
    version: versionMatch[1],
    bytes: buffer.length,
    pageCount,
    embeddedFonts,
    fontNames,
    hasToUnicode: /\/ToUnicode/.test(whole),
  };
}

module.exports = { inspectPdf };
