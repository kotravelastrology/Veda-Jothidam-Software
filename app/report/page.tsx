import type { Metadata } from 'next';
import { Suspense } from 'react';
import ReportBuilder from './ReportBuilder';

export const metadata: Metadata = {
  title: 'ஜாதக அறிக்கை உருவாக்கி — Kotravel Vedic Astrology',
};

export default function ReportPage() {
  return (
    <Suspense fallback={null}>
      <ReportBuilder />
    </Suspense>
  );
}
