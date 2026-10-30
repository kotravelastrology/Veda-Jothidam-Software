import type { Metadata } from 'next';
import GrahaView from './GrahaView';

export const metadata: Metadata = {
  title: 'கிரக விளக்கம் (Interpreting Grahas) — Kotravel Vedic Astrology',
  description: 'Each graha in the open chart: place, dignity, avasthas and the parts of Shadbala.',
};

export default function InterpretingGrahasPage() {
  return <GrahaView />;
}
