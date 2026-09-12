'use client';

import Link from 'next/link';
import { RasiChartRenderer } from './RasiChartRenderer';

interface RectificationChartRendererProps {
  report: any;
}

/**
 * This "chart type" previously showed a fabricated life-events list (Marriage,
 * Career Start, Major Health Event, etc. with fake "Known Time"/"Approximate"
 * labels) and minute-adjustment/"✓ Matches"/"⚠ Adjust" controls that never
 * called any real calculation. Real birth-time rectification (Prāṇa/Deha daśā,
 * Kunda Siddhānta ×81, Tattwa/Antar-Tattwa — three classically-sourced
 * cross-checks) already exists at /rectification. Rather than fabricate
 * events and matches, this now shows only this person's own D1 chart and
 * points to the real feature.
 */
export function RectificationChartRenderer({ report }: RectificationChartRendererProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-soft/30 to-amber-soft/30 rounded-lg p-6 border-l-4 border-orange">
        <h3 className="text-xl font-bold text-ink mb-2">ஜனன நேர திருத்தம் (Birth Time Rectification)</h3>
        <p className="text-sm text-ink-soft">
          பிராண/தேக தசை, குண்ட சித்தாந்த ×81, தத்வ/அந்தர தத்வ ஆகிய மூன்று சாஸ்திர அடிப்படையிலான
          சரிபார்ப்புகள் கொண்ட உண்மையான ஜனன நேர திருத்தத்திற்கு{' '}
          <Link href="/rectification" className="text-saffron font-semibold underline">
            ஜனன நேர திருத்தம் (/rectification)
          </Link>{' '}
          பக்கத்தைப் பயன்படுத்தவும்.
        </p>
      </div>

      <div className="bg-surface-soft rounded-lg p-6 border border-line">
        <h4 className="font-semibold text-ink mb-4">தற்போதைய ராசி கட்டம் (D1)</h4>
        {report?.chart ? (
          <RasiChartRenderer report={report} />
        ) : (
          <p className="text-ink-soft text-center">Loading chart...</p>
        )}
      </div>

      <div className="bg-blue-soft/20 rounded-lg p-4 border border-blue-soft text-sm text-ink-soft">
        இங்கு நேர திருத்த கணக்கீடு காட்டப்படவில்லை. உண்மையான கணக்கீட்டைப் பெற /rectification பக்கத்திற்குச் செல்லவும்.
      </div>
    </div>
  );
}
