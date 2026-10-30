import type { Metadata } from 'next';
import MoorthiView from './MoorthiView';

export const metadata: Metadata = {
  title: 'மூர்த்தி நிர்ணயம் (Moorthi Nirnaya) — Kotravel Vedic Astrology',
  description: 'The form — gold, silver, copper or iron — a planet takes when it enters a sign, from the '
    + 'transit Moon\'s house from the natal Moon: six books, Pulippani\'s grades and quanta.',
};

export default function MoorthiPage() {
  return <MoorthiView />;
}
