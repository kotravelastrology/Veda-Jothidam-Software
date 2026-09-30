import type { Metadata } from 'next';
import SaturnTransitView from './SaturnTransitView';

export const metadata: Metadata = {
  title: 'ஏழரைச் சனி · அஷ்டமச் சனி · கண்டகச் சனி (Saturn Transit) — Kotravel Vedic Astrology',
  description: 'Sade Sati, Ardhashtama, Ashtama and Kantaka Saturn from the natal Moon, with the '
    + 'dates computed from the ephemeris and the definitions cited to the pages they were read from. '
    + 'The books disagree about Kantaka Saturn, so the convention is stated and selectable.',
};

export default function SaturnTransitPage() {
  return <SaturnTransitView />;
}
