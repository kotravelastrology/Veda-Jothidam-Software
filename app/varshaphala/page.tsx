import type { Metadata } from 'next';
import VarshaphalaView from './VarshaphalaView';

export const metadata: Metadata = {
  title: 'வருஷபலன் (Varshaphala) — Kotravel Vedic Astrology',
};

export default function VarshaphalaPage() {
  return <VarshaphalaView />;
}
