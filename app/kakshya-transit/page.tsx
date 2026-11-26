import type { Metadata } from 'next';
import KakshyaTransitView from './KakshyaTransitView';

export const metadata: Metadata = {
  title: 'கோசாரக் காக்ஷ்யா (Kakshya Transit) — Kotravel Vedic Astrology',
  description: 'Each of the seven planets\' transit by Kakshya: its bhava and Kakshya, the Kakshya lord, whether the lord gave a bindu '
    + 'in the planet\'s own Ashtakavarga, and Patel\'s rule for several planets together — with dated windows.',
};

export default function KakshyaTransitPage() {
  return <KakshyaTransitView />;
}
