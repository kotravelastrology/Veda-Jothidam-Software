import type { Metadata } from 'next';
import LearningResourcesView from './LearningResourcesView';

export const metadata: Metadata = {
  title: 'கற்றல் வளங்கள் (Learning Resources) — Kotravel Vedic Astrology',
  description: 'Learning resources - classical astrology knowledge, articles, and references for continuous education.',
};

export default function LearningResourcesPage() {
  return <LearningResourcesView />;
}
