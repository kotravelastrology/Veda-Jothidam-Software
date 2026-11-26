import type { Metadata } from 'next';
import { Suspense } from 'react';
import AshtakavargaView from './AshtakavargaView';

export const metadata: Metadata = {
  title: 'அஷ்டகவர்க்கம் — Kotravel Vedic Astrology',
  description: 'Bhinnashtakavarga of each planet and the Lagna, the Sarvashtakavarga, the Chancha Chakra and the reductions, as in the horoscope book.',
};

export default function AshtakavargaPage() {
  return <Suspense fallback={null}><AshtakavargaView /></Suspense>;
}
