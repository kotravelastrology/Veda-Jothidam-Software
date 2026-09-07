import type { Metadata } from 'next';
import ReportBuilder from './ReportBuilder';

export const metadata: Metadata = {
  title: 'ஜாதக அறிக்கை உருவாக்கி — Kotravel Vedic Astrology',
};

export default function ReportPage() {
  return <ReportBuilder />;
}
