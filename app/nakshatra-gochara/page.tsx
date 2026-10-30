import type { Metadata } from 'next';
import NakshatraGocharaView from './NakshatraGocharaView';

export const metadata: Metadata = {
  title: 'நட்சத்திரக் கோசாரம் (Nakshatra Gochara) — Kotravel Vedic Astrology',
  description: 'Every planet\'s star counted from the natal star: tara, Pulippani\'s good and bad stars, '
    + 'the limbs of the body in four books, and the weekdays of the natal star.',
};

export default function NakshatraGocharaPage() {
  return <NakshatraGocharaView />;
}
