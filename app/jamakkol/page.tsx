import type { Metadata } from 'next';
import JamakkolView from './JamakkolView';

export const metadata: Metadata = {
  title: 'ஜாமக்கோள் ப்ரசன்னம் (Jamakkol Prasnam) — Kotravel Vedic Astrology',
};

export default function JamakkolPage() {
  return <JamakkolView />;
}
