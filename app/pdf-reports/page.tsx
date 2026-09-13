import type { Metadata } from 'next';
import PdfReportsView from './PdfReportsView';

export const metadata: Metadata = {
  title: 'அறிக்கை உருவாக்கம் (PDF Reports) — Kotravel Vedic Astrology',
  description: 'PDF report generator - create customizable astrology reports for clients with detailed analysis.',
};

export default function PdfReportsPage() {
  return <PdfReportsView />;
}
