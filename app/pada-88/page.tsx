import type { Metadata } from 'next';
import Pada88View from './Pada88View';

export const metadata: Metadata = {
  title: '88-வது பாதம் (88th Nakshatra Pada) — Kotravel Vedic Astrology',
  description: 'The 88th nakshatra quarter from the natal Moon\'s: when each planet transits it (Raj Kumar, '
    + 'Vishnu Bhaskar), and the Moon\'s passages as a time to avoid (Kalaprakasika, Shubhakaran).',
};

export default function Pada88Page() {
  return <Pada88View />;
}
