import type { Metadata } from 'next';
import { Suspense } from 'react';
import DashaBrowserView from './DashaBrowserView';

export const metadata: Metadata = {
  title: 'தசா பலன் உலாவி (Dasha Effects Browser) — Kotravel Vedic Astrology',
  description: 'Pick a dasha period level by level; see the sky when it begins beside the birth chart and what BPHS says of the lords of that period.',
};

export default function DashaEffectsPage() {
  return (
    <Suspense fallback={null}>
      <DashaBrowserView />
    </Suspense>
  );
}
