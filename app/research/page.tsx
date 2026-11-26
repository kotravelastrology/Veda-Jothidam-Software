import type { Metadata } from 'next';
import ResearchView from './ResearchView';

export const metadata: Metadata = {
  title: 'ஆராய்ச்சி — சேமித்த குழுக்கள் (Research) — Kotravel Vedic Astrology',
  description: 'Find the charts in the library that match an astrological predicate, '
    + 'and save the question so its membership can be replayed and compared.',
};

export default function ResearchPage() {
  return <ResearchView />;
}
