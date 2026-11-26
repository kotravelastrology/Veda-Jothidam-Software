import type { Metadata } from 'next';
import KotaChakraView from './KotaChakraView';

export const metadata: Metadata = {
  title: 'கோட்டா, சங்கட்ட சக்கரம் — Kotravel Vedic Astrology',
  description: 'Narapati Jayacharya Svarodaya: the Kota Chakra (fort) and the Nakshatra Sanghatta Chakra, with the planets of a chosen moment or of a birth chart placed in them.',
};

export default function KotaChakraPage() {
  return <KotaChakraView />;
}
