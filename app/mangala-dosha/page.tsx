import type { Metadata } from 'next';
import MangalaDoshaView from './MangalaDoshaView';

export const metadata: Metadata = {
  title: 'மங்கள (செவ்வாய்) தோஷம் (Mangala Dosha) — Kotravel Vedic Astrology',
  description: 'Mangala (Kuja) dosha for a bride, a groom or both: the formation under each book\'s '
    + 'reading, intensity, and every cancellation the books list, each with its page. The books '
    + 'disagree, so no single verdict is given.',
};

export default function MangalaDoshaPage() {
  return <MangalaDoshaView />;
}
