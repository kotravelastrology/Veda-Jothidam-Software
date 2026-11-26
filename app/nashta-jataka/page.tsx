import type { Metadata } from 'next';
import NashtaJatakaView from './NashtaJatakaView';

export const metadata: Metadata = {
  title: 'நஷ்ட ஜாதகம் (Lost Horoscopy) — Kotravel Vedic Astrology',
  description: 'The birth moment of one who does not know it, from the chart of the moment of the question and the approximate age, step by step as Brihat Parashara Hora Shastra ch.78 gives it.',
};

export default function NashtaJatakaPage() {
  return <NashtaJatakaView />;
}
