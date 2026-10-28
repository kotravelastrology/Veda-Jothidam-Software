import type { Metadata } from 'next';
import NatureView from './NatureView';

export const metadata: Metadata = {
  title: 'இயல்பும் குணமும் (Nature & Temperament) — Kotravel Vedic Astrology',
  description: 'The lagna lord in the lagna, as the Bhrigu Samhita describes it.',
};

export default function NaturePage() {
  return <NatureView />;
}
