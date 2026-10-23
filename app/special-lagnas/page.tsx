import type { Metadata } from 'next';
import SpecialLagnasView from './SpecialLagnasView';

export const metadata: Metadata = {
  title: 'சிறப்பு லக்னங்கள் (BPHS அத்.5) — Kotravel Vedic Astrology',
  description: 'Bhava Lagna, Hora Lagna, Ghatika Lagna and Varnada Lagna as Parashara gives them in BPHS chapter 5, with the planets in the houses of each.',
};

export default function SpecialLagnasPage() {
  return <SpecialLagnasView />;
}
