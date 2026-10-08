import type { Metadata } from 'next';
import GemstonesView from './GemstonesView';

export const metadata: Metadata = {
  title: 'ரத்தினங்கள் (Gemstones) — Kotravel Vedic Astrology',
  description: 'What three books say to wear for an Ascendant, side by side with their pages, and '
    + 'where they agree or disagree. No gem is recommended: the books give different methods.',
};

export default function GemstonesPage() {
  return <GemstonesView />;
}
