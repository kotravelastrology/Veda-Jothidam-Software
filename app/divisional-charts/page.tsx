import type { Metadata } from 'next';
import DivisionalChartsView from './DivisionalChartsView';

export const metadata: Metadata = {
  title: 'வர்கோத்தமம் (Divisional Charts) — Kotravel Vedic Astrology',
  description: 'Divisional charts (Vargas) including D1, D9, D10, D20 and more for detailed astrological analysis.',
};

export default function DivisionalChartsPage() {
  return <DivisionalChartsView />;
}
