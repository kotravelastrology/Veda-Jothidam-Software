import type { Metadata } from 'next';
import MuhurtaStarsView from './MuhurtaStarsView';

export const metadata: Metadata = {
  title: 'முகூர்த்த நட்சத்திரம் (Latta, Vainashika, 88/108 pada) — Kotravel Vedic Astrology',
  description: 'The muhurta star over a period: Latta for anyone, and the person\'s birth star, 88th and 108th padas and Vainashika — '
    + 'Muhurta Chintamani, Kalaprakasika and seven more books.',
};

export default function MuhurtaStarsPage() {
  return <MuhurtaStarsView />;
}
