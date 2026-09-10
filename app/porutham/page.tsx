import type { Metadata } from 'next';
import PoruthamView from './PoruthamView';

export const metadata: Metadata = {
  title: 'திருமணப் பொருத்தம் (Marriage Matching) — Kotravel Vedic Astrology',
};

export default function PoruthamPage() {
  return <PoruthamView />;
}
