import type { Metadata } from 'next';
import YearlyTransitView from './YearlyTransitView';

export const metadata: Metadata = {
  title: 'ஆண்டு கோசாரம் (தென்னிந்திய) — Kotravel Vedic Astrology',
  description: 'For each sign, the stays of the planets in it through a calendar year, around the South Indian birth chart.',
};

export default function YearlyTransitPage() {
  return <YearlyTransitView />;
}
