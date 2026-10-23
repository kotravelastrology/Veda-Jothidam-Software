import type { Metadata } from 'next';
import NakshatraDeedsView from './NakshatraDeedsView';

export const metadata: Metadata = {
  title: 'நட்சத்திரமும் காரியமும் (Nakshatras and Suitable Deeds) — Kotravel Vedic Astrology',
  description: 'The deeds each of the 27 nakshatras (and Abhijit) suits, from Kalyanraman\'s Muhoortha Sangraha vol. 1 chapter 9, '
    + 'with the seven kinds, the weekdays, the mukha groups, and a search from a deed to the stars.',
};

export default function NakshatraDeedsPage() {
  return <NakshatraDeedsView />;
}
