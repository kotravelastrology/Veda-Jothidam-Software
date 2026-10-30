import type { Metadata } from 'next';
import BphsRashiDashasView from './BphsRashiDashasView';

export const metadata: Metadata = {
  title: 'ராசி தசைகள் (BPHS அத்.46) — Kotravel Vedic Astrology',
  description: 'Chara, Sthira, Yogardha and Mandooka sign dashas as Parashara gives them in BPHS chapter 46, with the Brahma Graha for Sthira.',
};

export default function BphsRashiDashasPage() {
  return <BphsRashiDashasView />;
}
