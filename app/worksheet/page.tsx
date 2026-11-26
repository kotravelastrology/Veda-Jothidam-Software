import type { Metadata } from 'next';
import { Suspense } from 'react';
import WorksheetView from './WorksheetView';

export const metadata: Metadata = {
  title: 'ஜாதக மேசை (Worksheet) — Kotravel Vedic Astrology',
  description: 'The birth chart, house strengths, planet strengths, avasthas, dasha and navamsha of one chart on one screen.',
};

export default function WorksheetPage() {
  return (
    <Suspense fallback={null}>
      <WorksheetView />
    </Suspense>
  );
}
