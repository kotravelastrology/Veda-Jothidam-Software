import type { Metadata } from 'next';
import KpRulingView from './KpRulingView';

export const metadata: Metadata = {
  title: 'ஆளும் கிரகங்கள் — நேரம் (KP) — Kotravel Vedic Astrology',
  description: 'Krishnamurti Paddhati ruling planets: the zodiac positions ruled by them and when the ascendant, Moon, Sun or Jupiter reaches them; the birth time within a window.',
};

export default function KpRulingPage() {
  return <KpRulingView />;
}
