import type { Metadata } from 'next';
import BphsDashasView from './BphsDashasView';

export const metadata: Metadata = {
  title: 'தசைகள் (BPHS அத்.46) — Kotravel Vedic Astrology',
  description: 'Ashtottari, Shodashottari, Dwadashottari, Panchottari, Shatabdika, Chaturashiti-sama, Dwisaptati-sama and Shat-trimshat-sama '
    + 'as Parashara gives them in BPHS chapter 46 — with the condition each is said to suit, checked against the chart.',
};

export default function BphsDashasPage() {
  return <BphsDashasView />;
}
