import type { Metadata } from 'next';
import AstronomyView from './AstronomyView';

export const metadata: Metadata = {
  title: 'வானியல் விவரம் (Astronomy) — Kotravel Vedic Astrology',
  description: 'The astronomy behind a chart: sidereal longitude, celestial latitude, '
    + 'distance and daily motion for each graha, with retrogression derived from the '
    + 'sign of the longitude speed.',
};

export default function AstronomyPage() {
  return <AstronomyView />;
}
