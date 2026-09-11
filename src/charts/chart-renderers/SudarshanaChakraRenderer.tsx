'use client';

import { SouthIndianChart } from '../kattam/SouthIndianChart';
import { fromParashariChart } from '../kattam/rasiNames';
import { NAKSHATRA_NAMES } from './chartConstants';

interface SudarshanaChakraRendererProps {
  report: any;
}

const NAK_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const LORD_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
  Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};

/**
 * Sudarshana Chakra — the classical technique of uniting THREE kundalis for
 * a threefold-confirmed prediction: Lagna Kundli (from the Ascendant),
 * Chandra Kundli (the same D1 placements, re-viewed with the Moon's own
 * rāśi as the 1st house) and Surya Kundli (re-viewed from the Sun's rāśi).
 * All three carry the identical planetary positions — only which rāśi is
 * treated as "1st house" changes, so this is exactly `fromParashariChart`
 * three times with `lagnaRasiIndex` overridden to Lagna/Moon/Sun.
 */
export function SudarshanaChakraRenderer({ report }: SudarshanaChakraRendererProps) {
  const base = fromParashariChart(report.chart);
  const moonRasi = report.chart.grahas.Moon.rasiIndex;
  const sunRasi = report.chart.grahas.Sun.rasiIndex;

  const moonLongitude = report.chart.grahas.Moon.longitude as number;
  const nakSpan = 360 / 27;
  const nakIndex = Math.min(Math.floor(((moonLongitude % 360) + 360) % 360 / nakSpan), 26);
  const nakLord = NAK_LORDS[nakIndex % 9];

  const kundalis = [
    { title: 'லக்ன குண்டலி (Lagna Kundli)', lagnaRasiIndex: base.lagnaRasiIndex },
    { title: 'சந்திர குண்டலி (Chandra Kundli)', lagnaRasiIndex: moonRasi },
    { title: 'சூரிய குண்டலி (Surya Kundli)', lagnaRasiIndex: sunRasi },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-soft/30 to-indigo-soft/30 rounded-lg p-6 border-l-4 border-blue">
        <h3 className="text-xl font-bold text-ink mb-2">சுதர்சன சக்கரம் (Sudarshana Chakra)</h3>
        <p className="text-sm text-ink-soft">
          லக்னம், சந்திரன், சூரியன் — மூன்றையும் தனித்தனியே 1-ம் பாவமாகக் கொண்டு ஒரே D1 கிரக நிலைகளை மூன்று
          குண்டலிகளாக வைத்து முப்படி உறுதி செய்யும் பாரம்பரிய முறை.
        </p>
      </div>

      {/* Three real kundalis, side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kundalis.map((k) => (
          <div key={k.title} className="bg-surface-soft rounded-lg p-3 border border-line flex flex-col items-center">
            <div className="text-sm font-semibold text-ink mb-2 text-center">{k.title}</div>
            <SouthIndianChart lagnaRasiIndex={k.lagnaRasiIndex} grahas={base.grahas} size={260} />
          </div>
        ))}
      </div>

      {/* Moon's Nakshatra — real, computed from the actual Moon longitude */}
      <div className="bg-gradient-to-r from-blue/10 to-indigo/10 rounded-lg p-6 border-2 border-blue/30">
        <div className="text-sm text-ink-soft mb-1">சந்திரன் நட்சத்திரம் (Moon's Nakshatra)</div>
        <div className="text-2xl font-bold text-ink mb-3">{NAKSHATRA_NAMES[nakIndex + 1]}</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface rounded p-3">
            <div className="text-xs text-ink-soft mb-1">நட்சத்திர அதிபதி</div>
            <div className="font-semibold text-ink">{LORD_TA[nakLord]}</div>
          </div>
          <div className="bg-surface rounded p-3">
            <div className="text-xs text-ink-soft mb-1">எண்</div>
            <div className="font-semibold text-blue">{nakIndex + 1} / 27</div>
          </div>
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-gradient-to-r from-blue-soft/10 to-indigo-soft/10 rounded-lg p-4 border-l-4 border-blue">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">📖 Sudarshana Chakra பயன்படுத்தும் முறை</div>
          <div className="text-ink-soft space-y-1">
            <p>• ஒரு பாவத்தின் பலனை மூன்று குண்டலிகளிலும் ஒரே திசையில் கிரகங்கள் ஆதரித்தால் அந்த பலன் உறுதி.</p>
            <p>• லக்ன குண்டலியில் பலவீனமான ஒரு காரகத்துவம், சந்திர/சூரிய குண்டலியில் பலம் பெற்றால் மேலும் ஆராயவும்.</p>
            <p>• மூன்று குண்டலிகளும் முரண்பட்டால் — கலப்பு பலன் என எடுத்துக் கொள்ளவும்.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
