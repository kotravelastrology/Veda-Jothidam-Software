import type { Metadata } from 'next';
import KelviView from './KelviView';

export const metadata: Metadata = {
  title: 'கேள்வி–விடை (Prashna reading) — Kotravel Vedic Astrology',
};

export default function KelviPage() {
  return <KelviView />;
}
