'use client';

import Link from 'next/link';
import { SouthIndianChart } from '../kattam/SouthIndianChart';
import { fromParashariChart } from '../kattam/rasiNames';

interface SynastryChartRendererProps {
  report: any;
}

/**
 * This "chart type" previously showed entirely fabricated synastry scores
 * (fixed 75/82/68% per planet, an invented "overall compatibility %", even
 * Pluto-based text — not used in Vedic astrology — with no real second
 * chart ever wired in: `report.partnerChart` was read but nothing in the
 * codebase ever populated it). Real two-chart compatibility (10 Dasakoot +
 * the 15-item extended porutham, both cited-source calculations) already
 * exists at /porutham. Rather than fabricate numbers, this now shows only
 * this person's own D1 chart and points to the real feature.
 */
export function SynastryChartRenderer({ report }: SynastryChartRendererProps) {
  const box = fromParashariChart(report.chart);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-soft/30 to-pink-soft/30 rounded-lg p-6 border-l-4 border-rose">
        <h3 className="text-xl font-bold text-ink mb-2">தம்பதி பொருந்தம் (Synastry)</h3>
        <p className="text-sm text-ink-soft">
          இரு ஜாதகங்களை ஒப்பிட்டு பொருந்தம் காண, உண்மையான 10 தச கூட பொருத்தம் + 15-உறுப்பு விரிவான பொருத்தம் —
          இரண்டு பிறப்பு விவரங்களையும் எடுத்து கணக்கிடும் <Link href="/porutham" className="text-saffron font-semibold underline">திருமணப் பொருத்தம் (/porutham)</Link> பக்கத்தைப் பயன்படுத்தவும்.
        </p>
      </div>

      <div className="flex justify-center">
        <SouthIndianChart lagnaRasiIndex={box.lagnaRasiIndex} grahas={box.grahas} title="இந்த ஜாதகர் ராசி கட்டம் (D1)" size={340} />
      </div>

      <div className="bg-surface-soft rounded-lg p-4 border border-line text-sm text-ink-soft">
        இங்கு ஒரே ஒரு ஜாதகம் மட்டுமே உள்ளது என்பதால் ஒப்பீடு காட்ட முடியாது. இரண்டாவது நபரின் பிறப்பு விவரத்தையும்
        சேர்த்து உண்மையான பொருத்த கணக்கீட்டைப் பெற /porutham பக்கத்திற்குச் செல்லவும்.
      </div>
    </div>
  );
}
