import type { Metadata } from 'next';
import DeclinationView from './DeclinationView';

export const metadata: Metadata = {
  title: 'கிராந்தி (சாய்வு) — Kotravel Vedic Astrology',
  description: 'The declination (kranti) of the seven planets at birth, north or south of the celestial equator.',
};

export default function DeclinationPage() {
  return <DeclinationView />;
}
