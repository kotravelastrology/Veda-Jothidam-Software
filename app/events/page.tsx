import type { Metadata } from 'next';
import { Suspense } from 'react';
import EventsView from './EventsView';

export const metadata: Metadata = {
  title: 'நிகழ்வு ஜாதகங்கள் — Kotravel Vedic Astrology',
  description: 'A moment set against the birth chart: the event chart, its Kakshas over the birth Ashtakavarga, gochara facts, running dashas, Vimshopaka.',
};

export default function EventsPage() {
  return (
    <Suspense fallback={null}>
      <EventsView />
    </Suspense>
  );
}
