import type { Metadata } from 'next';
import LordshipsView from './LordshipsView';

export const metadata: Metadata = {
  title: 'பாவாதிபதிகள் (Lordships) — Kotravel Vedic Astrology',
  description: 'For each house, the sign it holds, that sign\'s lord and the house the lord sits in, with exchanges marked. Birth chart, Navamsha and Dashamsha.',
};

export default function LordshipsPage() {
  return <LordshipsView />;
}
