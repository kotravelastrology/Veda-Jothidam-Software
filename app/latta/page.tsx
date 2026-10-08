import type { Metadata } from 'next';
import LattaView from './LattaView';

export const metadata: Metadata = {
  title: 'லத்தை (Latta) — Kotravel Vedic Astrology',
  description: 'The star each transiting planet kicks, and when one kicks the natal or lagna star: '
    + 'Phaladeepika XXVI.42-47 and six books.',
};

export default function LattaPage() {
  return <LattaView />;
}
