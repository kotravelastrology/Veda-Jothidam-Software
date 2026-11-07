import type { Metadata } from 'next';
import YogaDetectionView from './YogaDetectionView';

export const metadata: Metadata = {
  title: 'யோகங்கள் (Yoga Detection) — Kotravel Vedic Astrology',
  description: 'Yoga detection and analysis - benefic and malefic planetary combinations in your chart.',
};

export default function YogaDetectionPage() {
  return <YogaDetectionView />;
}
