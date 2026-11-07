import type { Metadata } from 'next';
import VimshopakaView from './VimshopakaView';

export const metadata: Metadata = {
  title: 'விம்சோபக பலம் — Kotravel Vedic Astrology',
  description: 'The twenty-point Vimshopaka strength of each planet over the Shadvarga, Saptavarga, Dasavarga and Shodasavarga, as Parashara gives it in BPHS chapter 7.',
};

export default function VimshopakaPage() {
  return <VimshopakaView />;
}
