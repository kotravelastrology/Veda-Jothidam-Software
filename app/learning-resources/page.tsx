import type { Metadata } from 'next';
import LearningResourcesView from './LearningResourcesView';

export const metadata: Metadata = {
  title: 'சொல் · விதி · ஆதாரம் (Glossary) — Kotravel Vedic Astrology',
  description: 'Tamil astrological terms linked to the rule that implements them and the '
    + 'classical source that rule cites, with redistribution rights for each source.',
};

export default function LearningResourcesPage() {
  return <LearningResourcesView />;
}
