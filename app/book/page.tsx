import type { Metadata } from 'next';
import { Suspense } from 'react';
import BookView from './BookView';

export const metadata: Metadata = {
  title: 'ஜாதக நூல் — Kotravel Vedic Astrology',
  description: 'The horoscope book: pick the pages, get one printable book.',
};

export default function BookPage() {
  return <Suspense fallback={null}><BookView /></Suspense>;
}
