import type { Metadata } from 'next';
import HouseAnalysisView from './HouseAnalysisView';

export const metadata: Metadata = {
  title: 'பாவ பலம் (House Analysis) — Kotravel Vedic Astrology',
  description: 'Bhava Bala analysis - strength analysis of all 12 houses in your birth chart.',
};

export default function HouseAnalysisPage() {
  return <HouseAnalysisView />;
}
