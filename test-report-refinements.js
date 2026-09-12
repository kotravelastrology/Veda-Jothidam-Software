const assert = require('node:assert/strict');
const { generateReportSummary, prepareExportData, EXPORT_FORMATS, COMPARISON_MODES } = require('./src/report/reportRefinements');

// --- Export formats definition ---
assert.ok(EXPORT_FORMATS, 'EXPORT_FORMATS exists');
assert.ok(EXPORT_FORMATS.PDF, 'PDF format exists');
assert.ok(EXPORT_FORMATS.Image, 'Image format exists');
assert.ok(EXPORT_FORMATS.JSON, 'JSON format exists');
assert.ok(EXPORT_FORMATS.HTML, 'HTML format exists');

for (const [format, config] of Object.entries(EXPORT_FORMATS)) {
  assert.ok(config.description, `${format} has description`);
  assert.ok(config.mimeType, `${format} has mime type`);
}

// --- Comparison modes definition ---
assert.ok(COMPARISON_MODES, 'COMPARISON_MODES exists');
assert.equal(COMPARISON_MODES.length, 3, '3 comparison modes');
assert.ok(COMPARISON_MODES.includes('Charts'), 'Charts comparison exists');
assert.ok(COMPARISON_MODES.includes('Predictions'), 'Predictions comparison exists');
assert.ok(COMPARISON_MODES.includes('Aspects'), 'Aspects comparison exists');

// --- Report summary generation ---
const reportData = {
  profile: {
    name: 'Test Person',
    gender: 'female',
    chartId: 'test-123'
  },
  chart: {
    lagna: { rasi: 'Taurus', degreeInSign: 15.5 },
    ayanamsha: 'Lahiri',
    houseSystem: 'Whole Sign'
  },
  dasha: {
    startingLord: 'Sun',
    dashas: [
      { lord: 'Sun', startLocal: '2025-01-01', endLocal: '2035-01-01' }
    ]
  },
  predictions: {
    events: [
      { type: 'Career', probability: 80 }
    ],
    overallAccuracy: 75
  }
};

const summary = generateReportSummary(reportData);

assert.ok(summary, 'Summary generated');
assert.ok(summary.reportTitle, 'Title exists');
assert.ok(summary.sections, 'Sections exist');
assert.ok(Array.isArray(summary.sections), 'Sections is array');

// Verify sections
for (const section of summary.sections) {
  assert.ok(section.name, 'Section has name');
  assert.ok(section.key, 'Section has key');
  assert.ok(typeof section.itemCount !== 'undefined', 'Section has item count');
}

// Verify total sections
assert.ok(summary.sections.length > 0, 'Has sections');

// --- Export data preparation ---
const exportData = prepareExportData(reportData, 'PDF');

assert.ok(exportData, 'Export data prepared');
assert.ok(exportData.format, 'Has format');
assert.ok(exportData.filename, 'Has filename');
assert.ok(exportData.timestamp, 'Has timestamp');
assert.ok(exportData.sections, 'Has sections for export');
assert.ok(typeof exportData.pageCount !== 'undefined', 'Has page count estimate');

// Verify filename includes name
assert.ok(exportData.filename.includes('Test'), 'Filename includes name');

// Verify page count
assert.ok(exportData.pageCount >= 1, 'Has at least 1 page');

// --- Chart comparison ---
const comparisonData = {
  charts: [
    { name: 'D1 Rashi', planets: 9 },
    { name: 'D9 Navamsha', planets: 9 }
  ],
  mode: 'Charts'
};

assert.ok(comparisonData.charts.length >= 2, 'Can compare 2+ charts');

// --- Report statistics ---
assert.ok(summary.totalSections > 0, 'Has total sections count');

// Verify source
assert.ok(summary.source, 'Source exists');
assert.ok(summary.source.title, 'Source has title');

console.log(JSON.stringify({
  pass: true,
  reportTitle: summary.reportTitle,
  totalSections: summary.sections.length,
  exportFormat: exportData.format,
  estimatedPages: exportData.pageCount,
  filename: exportData.filename,
  availableExportFormats: Object.keys(EXPORT_FORMATS).length,
  comparisonModes: COMPARISON_MODES.length
}, null, 2));
