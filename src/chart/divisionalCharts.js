/**
 * Divisional Charts (Varga Chakras): D1-D60 planetary placement calculations
 *
 * Source: K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy,
 * 'Divisional Charts in Astrology', IJATET Vol.7 Issue.1, pp.95-104, 2022
 *
 * Divisional System:
 * - D1 (Rashi): 360° / 1 = 30° per sign (basic chart, life events)
 * - D2 (Hora): 360° / 2 = 15° per hora (wealth & resources)
 * - D3 (Drekkana): 360° / 3 = 10° per dekkana (siblings & courage)
 * - D4 (Chaturthamsha): 360° / 4 = 7.5° per bhaga (property & vehicles)
 * - D7 (Saptamsha): 360° / 7 ≈ 51.43° per saptamsha (children)
 * - D9 (Navamsha): 360° / 9 = 40° per navamsha (marriage & spouse)
 * - D10 (Dasamsha): 360° / 10 = 36° per dasamsha (career & status)
 * - D12 (Dwadashamsha): 360° / 12 = 30° per dwadashamsha (parents & ancestors)
 * - D16 (Shodashamsha): 360° / 16 = 22.5° per shodashamsha (auspicious/inauspicious)
 * - D20 (Vimsamsha): 360° / 20 = 18° per vimsamsha (spiritual practices)
 * - D27 (Saptavimsha): 360° / 27 ≈ 13.33° per part (fine details, nakshatras)
 * - D30 (Trimsamsha): 360° / 30 = 12° per trimsamsha (inauspicious events)
 * - D60 (Shastiamsha): 360° / 60 = 6° per shastiamsha (detailed analysis)
 *
 * Classical application:
 * - D1: Basic life events, rasi chart (already implemented as Rashi Chakra Phase 5)
 * - D9: Marriage, spouse, relationships (most important after D1)
 * - D10: Career, profession, public image
 * - D12: Parents, family inheritance
 * - D60: Most detailed, fine-tuned predictions
 * - Others: Specific life areas and refinements
 */

// 13 main divisional charts (D1-D60, selected key divisions)
const DIVISIONAL_CHARTS = [
  { division: 1, name: 'Rashi (D1)', degreesPerDivision: 30, focus: 'Life events' },
  { division: 2, name: 'Hora (D2)', degreesPerDivision: 15, focus: 'Wealth' },
  { division: 3, name: 'Drekkana (D3)', degreesPerDivision: 10, focus: 'Siblings' },
  { division: 4, name: 'Chaturthamsha (D4)', degreesPerDivision: 7.5, focus: 'Property' },
  { division: 7, name: 'Saptamsha (D7)', degreesPerDivision: 360/7, focus: 'Children' },
  { division: 9, name: 'Navamsha (D9)', degreesPerDivision: 40, focus: 'Marriage' },
  { division: 10, name: 'Dasamsha (D10)', degreesPerDivision: 36, focus: 'Career' },
  { division: 12, name: 'Dwadashamsha (D12)', degreesPerDivision: 30, focus: 'Parents' },
  { division: 16, name: 'Shodashamsha (D16)', degreesPerDivision: 22.5, focus: 'Auspiciousness' },
  { division: 20, name: 'Vimsamsha (D20)', degreesPerDivision: 18, focus: 'Spirituality' },
  { division: 27, name: 'Saptavimsha (D27)', degreesPerDivision: 360/27, focus: 'Fine details' },
  { division: 30, name: 'Trimsamsha (D30)', degreesPerDivision: 12, focus: 'Misfortunes' },
  { division: 60, name: 'Shastiamsha (D60)', degreesPerDivision: 6, focus: 'Detailed analysis' }
];

// Helper: Get D-chart name by division number
function getDChartName(division) {
  const chart = DIVISIONAL_CHARTS.find(d => d.division === division);
  return chart ? chart.name : `D${division}`;
}

// Helper: Calculate which D-chart division a graha falls into
// Formula: (longitude × division / 30) mod division
// Then map to actual division within that chart's range
function calculateDChart(longitude, division) {
  const normalized = ((longitude % 360) + 360) % 360;

  // Get the divisional chart definition
  const chart = DIVISIONAL_CHARTS.find(d => d.division === division);
  const degreesPerDivision = chart ? chart.degreesPerDivision : 360 / division;

  // Calculate which division/part the longitude falls into (0-based index)
  const divisionIndex = Math.floor(normalized / degreesPerDivision);

  // Calculate degrees within the division
  const degreesInDivision = normalized - (divisionIndex * degreesPerDivision);

  return {
    longitude: normalized,
    division: divisionIndex % division,
    degreesInDivision: degreesInDivision,
    degreesPerDivision: degreesPerDivision,
    dchartName: getDChartName(division)
  };
}

// Main: Calculate all D-chart placements for a graha
function calculateAllDCharts(longitude) {
  const placements = {};

  for (const chart of DIVISIONAL_CHARTS) {
    placements[chart.division] = calculateDChart(longitude, chart.division);
  }

  return placements;
}

// Helper: Format D-chart placement as readable string
function formatDChartPlacement(placement) {
  return `${placement.dchartName} Division ${placement.division + 1}`;
}

module.exports = {
  DIVISIONAL_CHARTS,
  calculateDChart,
  calculateAllDCharts,
  getDChartName,
  formatDChartPlacement
};
