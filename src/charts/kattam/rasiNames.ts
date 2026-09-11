/**
 * Shared constants for the South Indian / North Indian chart-box renderers
 * (src/charts/kattam/*). Indexed 0-11 by rāśi (0 = Mesha) so callers never
 * need to match rāśi NAME strings — the codebase has two live spellings
 * ("Karkataka" in parashariChart.js vs "Kataka" in jamakkol.js/newer report
 * modules) and this sidesteps that entirely.
 */
export const RASI_TA_SHORT = ['மேஷ', 'ரிஷப', 'மிது', 'கட', 'சிம்', 'கன்னி', 'துலா', 'விரு', 'தனு', 'மக', 'கும்ப', 'மீன'];
export const RASI_TA_FULL = [
  'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி',
  'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்',
];

export const GRAHA_TA_SHORT: Record<string, string> = {
  Lagna: 'லக்', Sun: 'சூ', Moon: 'சந்', Mars: 'செவ்', Mercury: 'பு',
  Jupiter: 'குரு', Venus: 'சுக்', Saturn: 'சனி', Rahu: 'ரா', Ketu: 'கே',
};
export const GRAHA_TA_FULL: Record<string, string> = {
  Lagna: 'லக்னம்', Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
  Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};

/** '12.34' style degree-in-sign, degree.arcminute (NOT decimal). */
export function fmtDegMin(deg: number): string {
  const within = ((deg % 30) + 30) % 30;
  const whole = Math.floor(within);
  const min = Math.floor((within - whole) * 60);
  return `${whole}°${String(min).padStart(2, '0')}'`;
}

export interface ChartGraha {
  /** Stable id: 'Sun'..'Ketu', 'Lagna', or a custom key (e.g. Jamakkol's ref points). */
  id: string;
  /** Short label actually painted in the box (defaults to GRAHA_TA_SHORT[id]). */
  label?: string;
  rasiIndex: number;      // 0-11
  degreeInSign?: number;  // 0-30
  house?: number;         // 1-12 from lagna, if relevant
  retrograde?: boolean;
  /** Extra small caption under the label, e.g. a % or a sub-lord — chart-specific. */
  note?: string;
  /** Visually distinguish (e.g. Jamakkol's "currently active" jama graha). */
  emphasis?: boolean;
  /** Tailwind-ish color token override, e.g. for a natal/transit dual overlay. */
  colorClass?: string;
}

export const CHART_STYLE_STORAGE_KEY = 'kotravel-chart-style';
export type ChartStyle = 'south' | 'north';

export function loadChartStyle(): ChartStyle {
  if (typeof window === 'undefined') return 'south';
  try {
    const v = window.localStorage.getItem(CHART_STYLE_STORAGE_KEY);
    return v === 'north' ? 'north' : 'south';
  } catch { return 'south'; }
}
export function saveChartStyle(style: ChartStyle) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(CHART_STYLE_STORAGE_KEY, style); } catch { /* private mode etc. */ }
}

/**
 * Convert a Kotravel `chart` object ({ lagna, grahas }) — the shape
 * `calculateParashariChart` / `buildReportData` / `jamakkol.js` etc. all
 * return — into the ChartGraha[] the chart-box components expect.
 */
export function fromParashariChart(chart: {
  lagna: { rasiIndex: number };
  grahas: Record<string, { rasiIndex: number; degreeInSign: number; house?: number; retrograde?: boolean }>;
}): { lagnaRasiIndex: number; grahas: ChartGraha[] } {
  const grahas: ChartGraha[] = Object.entries(chart.grahas).map(([id, g]) => ({
    id,
    rasiIndex: g.rasiIndex,
    degreeInSign: g.degreeInSign,
    house: g.house,
    retrograde: g.retrograde,
  }));
  return { lagnaRasiIndex: chart.lagna.rasiIndex, grahas };
}
