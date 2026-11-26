import type { Metadata } from 'next';
import RogaArambhaView from './RogaArambhaView';

export const metadata: Metadata = {
  title: 'நோய்த் தொடக்கம் (Onset of Illness) — Kotravel Vedic Astrology',
  description: 'How long an illness lasts, or whether it is grave, by the Moon\'s star, tithi, weekday and karana at its onset: '
    + 'eight books side by side for all 27 stars (Kalaprakasika, Wilhelm, Shridhar, Muhurta Chintamani, Kalyanraman, Joshi, Raman, Rangacharya).',
};

export default function RogaArambhaPage() {
  return <RogaArambhaView />;
}
