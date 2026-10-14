import type { Metadata } from 'next';
import EvidenceView from './EvidenceView';

export const metadata: Metadata = {
  title: 'ஆதாரப் பலகைகள் (Evidence Panels) — Kotravel Vedic Astrology',
  description: 'ஜனன நிலை, வர்கம், பலம் — ஒரே snapshot-இலிருந்து, ஆதாரத்துடன்',
};

export default function Page() {
  return <EvidenceView />;
}
