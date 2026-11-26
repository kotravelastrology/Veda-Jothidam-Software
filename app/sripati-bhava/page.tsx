import type { Metadata } from 'next';
import SripatiBhavaView from './SripatiBhavaView';

export const metadata: Metadata = {
  title: 'ஸ்ரீபதி பாவம் — Kotravel Vedic Astrology',
  description: 'Bhava points, Sandhis and the effect of each planet in its bhava, as Sripatipaddhati gives them.',
};

export default function SripatiBhavaPage() {
  return <SripatiBhavaView />;
}
