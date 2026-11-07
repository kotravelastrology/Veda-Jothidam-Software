import type { Metadata } from 'next';
import SamudrikaView from './SamudrikaView';

export const metadata: Metadata = {
  title: 'சாமுத்திரிகா — உடல் அடையாளங்கள், மச்சம் (BPHS 81–82) — Kotravel Vedic Astrology',
  description: 'The signs of the body of Brihat Parashara Hora Shastra ch.81 (the woman\'s body, from the soles of the feet to the hair) and ch.82 (moles, marks, whorls), looked up by feature.',
};

export default function SamudrikaPage() {
  return <SamudrikaView />;
}
