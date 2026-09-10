import type { Metadata } from 'next';
import ClassicalMuhurtaView from './ClassicalMuhurtaView';

export const metadata: Metadata = {
  title: 'பாரம்பரிய முகூர்த்தம் (Classical muhurta) — Kotravel Vedic Astrology',
};

export default function ClassicalMuhurtaPage() {
  return <ClassicalMuhurtaView />;
}
