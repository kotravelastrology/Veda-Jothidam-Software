import type { Metadata } from 'next';
import HomeView from './HomeView';

export const metadata: Metadata = {
  title: 'முகப்பு — Kotravel Vedic Astrology',
  description: 'The open chart, today\'s panchangam and every page of the program by the task it serves.',
};

export default function HomePage() {
  return <HomeView />;
}
