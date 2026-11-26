/**
 * VJ-019 — ReportDocument and its printable rendering.
 *
 * Acceptance: valid bytes; Tamil fonts; long names; no clipped tables; export
 * preview.
 *
 * The bytes/fonts/layout half needs a browser engine and is verified by
 * `spikes/electron/export-pdf.js`; its results are recorded in
 * docs/VJ-019-report-export.md. This file covers everything checkable without
 * one, and asserts the document is reproducible and safe to render.
 */
const assert = require('node:assert/strict');

const { createCalculationRequest } = require('./src/contracts/calculationRequest');
const { createChartSnapshot } = require('./src/contracts/chartSnapshot');
const { createRuleEvidence, withheldEvidence } = require('./src/contracts/ruleEvidence');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const { calculateVargas } = require('./src/chart/vargaChart');
const { calculateAshtakavarga } = require('./src/chart/ashtakavarga');
const { buildReportDocument, REPORT_DOCUMENT_VERSION, formatDegree } = require('./src/reports/reportDocument');
const { renderReportHtml, escapeHtml } = require('./src/reports/renderReportHtml');
const { inspectPdf } = require('./src/reports/pdfBytes');

const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const ALL = [...CLASSICAL, 'Rahu', 'Ketu'];
const LONG_NAME = 'திருமதி இராஜேஸ்வரி சுப்பிரமணியன் வேங்கடாசலபதி அருணாசலம் பிள்ளை';

function makeSnapshot() {
  const input = {
    year: 1990, month: 5, day: 15, hour: 10, minute: 30,
    ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
    latitude: 13.0827, longitude: 80.2707, placeName: 'சென்னை',
  };
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean' },
    outputs: ['parashariChart', 'vargas', 'ashtakavarga'],
  });
  const chart = calculateParashariChart(request.chartContext);
  const natal = ALL.map((id) => {
    const g = chart.grahas[id];
    return { id, longitude: g.longitude, rasi: g.rasi, rasiIndex: g.rasiIndex, degreeInSign: g.degreeInSign, house: g.house };
  });
  const vargas = Object.fromEntries(ALL.map((id) => {
    const g = chart.grahas[id];
    return [id, calculateVargas(g.rasiIndex, g.degreeInSign)];
  }));
  const lagnaVargas = calculateVargas(chart.lagna.rasiIndex, chart.lagna.degreeInSign);
  const vargaKeys = Object.keys(lagnaVargas).filter((k) => k !== 'source' && k !== 'D2');
  const av = calculateAshtakavarga({
    ...Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  });
  return createChartSnapshot({
    request,
    values: {
      lagna: { longitude: chart.lagna.longitude, rasi: chart.lagna.rasi, rasiIndex: chart.lagna.rasiIndex, degreeInSign: chart.lagna.degreeInSign },
      natal, vargaKeys, vargas, lagnaVargas,
      ashtakavarga: { sarva: av.sarva, bhinna: av.bhinna, total: av.sarva.reduce((a, b) => a + b, 0) },
    },
    evidence: [
      createRuleEvidence({ ruleId: 'VARGAS', name: 'வர்கங்கள்', outcome: { divisions: vargaKeys }, source: lagnaVargas.source }),
      withheldEvidence({ ruleId: 'SHADBALA_TOTAL', name: 'ஷட்பல மொத்தம்', reason: 'BPHS Ayana Bala முரண்பாடு' }),
    ],
  });
}

const snapshot = makeSnapshot();
const doc = buildReportDocument({
  snapshot, subject: { name: LONG_NAME }, generatedAtMs: Date.UTC(2026, 8, 27, 12, 0, 0),
});

// ----------------------------------------------- document is a snapshot --

assert.equal(doc.documentVersion, REPORT_DOCUMENT_VERSION);
assert.equal(doc.snapshotId, snapshot.snapshotId,
  'a report must name the snapshot it renders (ADR-07), not just the person');
assert.equal(doc.engineVersion, snapshot.engineVersion);
assert.ok(Object.isFrozen(doc), 'a document must not be mutable after it is built');

// Reproducible: the same snapshot builds the same document, so "this PDF
// matches that reading" is checkable rather than a claim.
const again = buildReportDocument({
  snapshot, subject: { name: LONG_NAME }, generatedAtMs: Date.UTC(2026, 8, 27, 12, 0, 0),
});
assert.deepEqual(JSON.parse(JSON.stringify(again)), JSON.parse(JSON.stringify(doc)));

// Nothing reads the clock: omitting the instant leaves it null rather than
// stamping "now", which would make two builds differ.
const undated = buildReportDocument({ snapshot, subject: { name: 'X' } });
assert.equal(undated.generatedAtMs, null);

assert.throws(() => buildReportDocument({ snapshot, subject: {} }), /subject\.name is required/);
assert.throws(() => buildReportDocument({ snapshot: { bogus: 1 }, subject: { name: 'X' } }), /required/);

// ------------------------------------------------------------ sections --

const byId = Object.fromEntries(doc.sections.map((s) => [s.id, s]));
assert.ok(byId.birth && byId.natal && byId.vargas && byId.ashtakavarga && byId.evidence);

assert.equal(byId.natal.rows.length, 9, 'all nine grahas are reported');
assert.equal(byId.vargas.columns.length, snapshot.values.vargaKeys.length + 1);
assert.equal(byId.vargas.wide, true,
  'the varga table is marked wide so the renderer scales it instead of clipping');

// Every table row must have exactly as many cells as there are columns, or a
// PDF would silently drop or shift values.
for (const section of doc.sections.filter((s) => s.kind === 'table')) {
  for (const row of section.rows) {
    assert.equal(row.length, section.columns.length,
      `${section.id}: a row has ${row.length} cells for ${section.columns.length} columns`);
  }
}

// The ashtakavarga section must foot to the classical total.
const bindus = byId.ashtakavarga.rows.slice(0, 12).map((r) => Number(r[1]));
assert.equal(bindus.reduce((a, b) => a + b, 0), 337);

// Withheld evidence must appear as withheld, not be quietly dropped.
const withheld = byId.evidence.entries.find((e) => e.status === 'SOURCE_REQUIRED');
assert.ok(withheld, 'a rule with no verified source still appears in the report');
assert.match(withheld.locator, /Ayana Bala/);

assert.equal(formatDegree(0.389071), '0°23\'21"');

// ----------------------------------------------- printable rendering --

const html = renderReportHtml(doc);
assert.equal(renderReportHtml(doc), html, 'rendering is deterministic');
assert.match(html, /^<!DOCTYPE html>/);
assert.ok(html.includes(LONG_NAME), 'the long name appears in full, not truncated');

// The preview and the PDF come from this same HTML, so what is approved is
// what is sent.
assert.match(html, /@page \{ size: A4/);
assert.match(html, /Noto Sans Tamil/, 'a Tamil-capable family is requested first');

// Long names: the heading must be allowed to wrap rather than overflow.
assert.match(html, /h1 \{[^}]*overflow-wrap: anywhere/s);
// No clipped tables: no overflow:hidden anywhere, and cells wrap.
assert.ok(!/overflow:\s*hidden/.test(html), 'nothing may clip content');
assert.match(html, /th, td \{[^}]*overflow-wrap: anywhere/s);
assert.match(html, /table\.wide \{ font-size/, 'wide tables scale down instead of being cut');
assert.match(html, /thead \{ display: table-header-group/, 'headers repeat across pages');
assert.match(html, /tr \{ break-inside: avoid/, 'rows are not split across pages');

// The snapshot id is printed, so a PDF in hand can be traced to its chart.
assert.ok(html.includes(doc.snapshotId), 'the full snapshot id appears in the footer');

// A name is user input and must be escaped, or a report could inject markup.
const nasty = buildReportDocument({
  snapshot, subject: { name: '<script>alert(1)</script> & "quoted"' },
});
const nastyHtml = renderReportHtml(nasty);
assert.ok(!nastyHtml.includes('<script>alert(1)</script>'), 'markup in a name must be escaped');
assert.ok(nastyHtml.includes('&lt;script&gt;'));
assert.equal(escapeHtml('<&>"\''), '&lt;&amp;&gt;&quot;&#39;');

assert.throws(() => renderReportHtml(null), /ReportDocument is required/);

// --------------------------------------------------- byte validation --

// The F05 defect was HTML served as a PDF. The inspector must reject that.
assert.deepEqual(inspectPdf(Buffer.from('<html><body>not a pdf</body></html>')),
  { valid: false, reason: 'missing %PDF- header — this is not a PDF' });
assert.equal(inspectPdf(Buffer.from('%PDF-1.4\nbroken')).valid, false);
assert.equal(inspectPdf('not a buffer').valid, false);

console.log(JSON.stringify({
  pass: true,
  snapshotId: doc.snapshotId.slice(0, 16),
  sections: doc.sections.map((s) => s.id),
  vargaColumns: byId.vargas.columns.length,
  htmlBytes: Buffer.byteLength(html, 'utf8'),
}, null, 2));
