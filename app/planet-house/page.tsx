import type { Metadata } from 'next';
import PlanetHouseView from './PlanetHouseView';

export const metadata: Metadata = {
  title: 'கிரகம் பாவத்தில் (நூல்கள்) — Kotravel Vedic Astrology',
  description: 'What the classical books say of each planet in its house from the lagna, one book at a time with the printed page.',
};

export default function PlanetHousePage() {
  return <PlanetHouseView />;
}
