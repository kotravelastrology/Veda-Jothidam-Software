import type { Metadata } from 'next';
import HealthView from './HealthView';

export const metadata: Metadata = {
  title: 'ஆரோக்கியம் (BPHS) — Kotravel Vedic Astrology',
  description: 'Health in Brihat Parashara Hora Shastra: the dhatus, the limbs of Kalapurusha (sthoola and sookshma), and the diseases, timing of illness and unfortunate years of the Sixth House chapter, as conditions over the chart.',
};

export default function HealthPage() {
  return <HealthView />;
}
