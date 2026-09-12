// Report Refinements - Export, comparison, and formatting for final delivery
// Handles PDF/Image export, multi-chart analysis, and report polishing

const EXPORT_FORMATS = {
  PDF: {
    description: 'Portable Document Format - Best for printing and sharing',
    mimeType: 'application/pdf',
    extension: '.pdf',
    orientation: 'portrait',
    pageSize: 'A4'
  },
  Image: {
    description: 'PNG image - Best for web and social media',
    mimeType: 'image/png',
    extension: '.png',
    quality: 'high'
  },
  JSON: {
    description: 'JSON data - Best for integration and analysis',
    mimeType: 'application/json',
    extension: '.json',
    compressed: true
  },
  HTML: {
    description: 'HTML report - Best for interactive viewing',
    mimeType: 'text/html',
    extension: '.html',
    responsive: true
  }
};

const COMPARISON_MODES = ['Charts', 'Predictions', 'Aspects'];

const REPORT_SECTIONS = {
  Profile: { key: 'profile', title: 'Birth Information', position: 1 },
  Chart: { key: 'chart', title: 'Natal Chart (D1)', position: 2 },
  Dasha: { key: 'dasha', title: 'Vimshottari Dasha', position: 3 },
  Chakras: { key: 'chakras', title: 'Chakra Systems (8)', position: 4 },
  Transit: { key: 'transit', title: 'Transit Analysis', position: 5 },
  Muhurta: { key: 'muhurta', title: 'Muhurta & Remedies', position: 6 },
  Predictions: { key: 'predictions', title: 'Life Event Predictions', position: 7 },
  Analysis: { key: 'analysis', title: 'Yogas & Doshas', position: 8 },
  Karaka: { key: 'karaka', title: 'Significators', position: 9 },
  Appendix: { key: 'appendix', title: 'Technical Details', position: 10 }
};

function generateReportSummary(reportData) {
  const sections = [];
  let totalItems = 0;

  // Build sections based on available data
  if (reportData.profile) {
    sections.push({
      name: REPORT_SECTIONS.Profile.title,
      key: REPORT_SECTIONS.Profile.key,
      itemCount: 5,
      position: REPORT_SECTIONS.Profile.position
    });
    totalItems += 5;
  }

  if (reportData.chart) {
    sections.push({
      name: REPORT_SECTIONS.Chart.title,
      key: REPORT_SECTIONS.Chart.key,
      itemCount: 9,
      position: REPORT_SECTIONS.Chart.position
    });
    totalItems += 9;
  }

  if (reportData.dasha) {
    sections.push({
      name: REPORT_SECTIONS.Dasha.title,
      key: REPORT_SECTIONS.Dasha.key,
      itemCount: reportData.dasha.dashas?.length || 3,
      position: REPORT_SECTIONS.Dasha.position
    });
    totalItems += reportData.dasha.dashas?.length || 3;
  }

  // Chakra systems (8 total)
  if (reportData.sarvatobhadraChakra || reportData.nadiChakra || reportData.dashaChakra) {
    sections.push({
      name: REPORT_SECTIONS.Chakras.title,
      key: REPORT_SECTIONS.Chakras.key,
      itemCount: 8,
      position: REPORT_SECTIONS.Chakras.position
    });
    totalItems += 8;
  }

  if (reportData.transitChakra) {
    sections.push({
      name: REPORT_SECTIONS.Transit.title,
      key: REPORT_SECTIONS.Transit.key,
      itemCount: reportData.transitChakra.aspects?.length || 10,
      position: REPORT_SECTIONS.Transit.position
    });
    totalItems += reportData.transitChakra.aspects?.length || 10;
  }

  if (reportData.muhurtaEnhancements) {
    sections.push({
      name: REPORT_SECTIONS.Muhurta.title,
      key: REPORT_SECTIONS.Muhurta.key,
      itemCount: 3 + (reportData.muhurtaEnhancements.remedies?.length || 0),
      position: REPORT_SECTIONS.Muhurta.position
    });
    totalItems += 3 + (reportData.muhurtaEnhancements.remedies?.length || 0);
  }

  if (reportData.predictions) {
    sections.push({
      name: REPORT_SECTIONS.Predictions.title,
      key: REPORT_SECTIONS.Predictions.key,
      itemCount: reportData.predictions.events?.length || 6,
      position: REPORT_SECTIONS.Predictions.position
    });
    totalItems += reportData.predictions.events?.length || 6;
  }

  if (reportData.rajaYogas || reportData.doshas) {
    sections.push({
      name: REPORT_SECTIONS.Analysis.title,
      key: REPORT_SECTIONS.Analysis.key,
      itemCount: (reportData.rajaYogas?.length || 0) + (reportData.doshas?.length || 0),
      position: REPORT_SECTIONS.Analysis.position
    });
    totalItems += (reportData.rajaYogas?.length || 0) + (reportData.doshas?.length || 0);
  }

  if (reportData.karaka) {
    sections.push({
      name: REPORT_SECTIONS.Karaka.title,
      key: REPORT_SECTIONS.Karaka.key,
      itemCount: 3,
      position: REPORT_SECTIONS.Karaka.position
    });
    totalItems += 3;
  }

  // Sort by position
  sections.sort((a, b) => a.position - b.position);

  const profileName = reportData.profile?.name || 'Vedic Chart';
  const reportTitle = `${profileName} — Vedic Astrology Report`;

  return {
    reportTitle,
    profileName,
    sections,
    totalSections: sections.length,
    totalItems,
    generatedAt: new Date().toISOString(),
    source: {
      title: 'Kotravel Vedic Astrology',
      system: 'Integrated Analysis System',
      version: '1.0.0'
    }
  };
}

function prepareExportData(reportData, format = 'PDF') {
  const summary = generateReportSummary(reportData);
  const exportFormat = EXPORT_FORMATS[format] || EXPORT_FORMATS.PDF;

  // Estimate page count (rough: 5-10 items per page)
  const itemsPerPage = 8;
  const basePages = Math.ceil(summary.totalItems / itemsPerPage) + 2; // +2 for cover and TOC

  // Generate filename with timestamp
  const profileName = reportData.profile?.name?.replace(/\s+/g, '_') || 'Chart';
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${profileName}_VedicReport_${timestamp}${exportFormat.extension}`;

  return {
    format,
    exportFormat,
    filename,
    title: summary.reportTitle,
    profileName: summary.profileName,
    sections: summary.sections,
    pageCount: basePages,
    timestamp: summary.generatedAt,
    fileSize: basePages * 150, // Rough estimate in KB
    orientation: exportFormat.orientation || 'portrait',
    mimeType: exportFormat.mimeType
  };
}

function generateChartComparison(chart1, chart2, mode = 'Charts') {
  const comparison = {
    mode,
    chart1Name: chart1.name || 'Chart 1',
    chart2Name: chart2.name || 'Chart 2',
    similarities: [],
    differences: [],
    timestamp: new Date().toISOString()
  };

  if (mode === 'Charts') {
    // Compare planetary placements
    if (chart1.planets && chart2.planets) {
      for (const planet of Object.keys(chart1.planets)) {
        const pos1 = chart1.planets[planet];
        const pos2 = chart2.planets[planet];
        if (pos1 && pos2) {
          const diff = Math.abs(pos1 - pos2);
          if (diff < 5) {
            comparison.similarities.push(`${planet}: Similar (${diff.toFixed(1)}° apart)`);
          } else {
            comparison.differences.push(`${planet}: Different (${diff.toFixed(1)}° apart)`);
          }
        }
      }
    }
  }

  return comparison;
}

function enhanceReportFormatting(reportData) {
  return {
    cssTheme: 'vedic-dark',
    typography: {
      headerFont: 'Georgia',
      bodyFont: 'Garamond',
      accentColor: '#C41E3A' // Saffron/red
    },
    layout: {
      marginTop: '1in',
      marginBottom: '1in',
      marginLeft: '0.75in',
      marginRight: '0.75in'
    },
    headerFooter: {
      header: 'Vedic Astrology Report',
      footer: `Generated ${new Date().toLocaleDateString()}`,
      pageNumbers: true
    },
    pageBreakRules: {
      beforeCharts: true,
      beforePredictions: true,
      keepSectionsTogether: true
    }
  };
}

module.exports = {
  EXPORT_FORMATS,
  COMPARISON_MODES,
  REPORT_SECTIONS,
  generateReportSummary,
  prepareExportData,
  generateChartComparison,
  enhanceReportFormatting
};
