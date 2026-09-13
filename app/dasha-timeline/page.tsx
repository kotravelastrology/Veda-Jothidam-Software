import type { Metadata } from 'next';
import DashaTimelineView from './DashaTimelineView';

export const metadata: Metadata = {
  title: 'தசை கால நிர்ணயம் (Dasha Timeline) — Kotravel Vedic Astrology',
  description: 'Vimshottari Dasha timeline - planetary periods visualization showing past, current, and future dasha periods.',
};

export default function DashaTimelinePage() {
  return <DashaTimelineView />;
}
