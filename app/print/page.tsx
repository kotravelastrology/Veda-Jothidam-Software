import type { Metadata } from 'next';
import { Suspense } from 'react';
import PrintView from './PrintView';

export const metadata: Metadata = {
  title: 'அச்சு மையம் — Kotravel Vedic Astrology',
  description: 'Printable ephemeris, panchang, KP chart, dasha levels 1-5, the compact lifetime dasha and the transit/dasha report, with birth-data and ephemeris exports.',
};

export default function PrintPage() {
  return <Suspense fallback={null}><PrintView /></Suspense>;
}
