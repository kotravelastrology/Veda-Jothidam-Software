import type { Metadata } from 'next';
import KpHoraryView from './KpHoraryView';

export const metadata: Metadata = {
  title: 'KP பிரச்னம் (எண் 1-249) — Kotravel Vedic Astrology',
  description: 'Krishnamurti Paddhati horary: the number 1-249 as the ascendant, the chart of the time of judgment, the ruling planets and the houses the book names for a question.',
};

export default function KpHoraryPage() {
  return <KpHoraryView />;
}
