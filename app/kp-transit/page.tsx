import type { Metadata } from 'next';
import KpTransitView from './KpTransitView';

export const metadata: Metadata = {
  title: 'KP கோசாரம் (Reader V) — Kotravel Vedic Astrology',
  description: 'Krishnamurti Paddhati transit: the star ready reckoner of a chart, the reading of the transiting planets, and the sensitive points of the running dasa, bhukti and anthra with the instants the luminaries and the ascendant reach them.',
};

export default function KpTransitPage() {
  return <KpTransitView />;
}
