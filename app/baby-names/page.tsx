import type { Metadata } from 'next';
import BabyNamesView from './BabyNamesView';

export const metadata: Metadata = {
  title: 'குழந்தை பெயர் (Baby names) — Kotravel Vedic Astrology',
};

export default function BabyNamesPage() {
  return <BabyNamesView />;
}
