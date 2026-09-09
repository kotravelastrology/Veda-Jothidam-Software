import type { Metadata } from 'next';
import LaunchChecklistView from './LaunchChecklistView';

export const metadata: Metadata = {
  title: 'Launch Readiness Checklist — Kotravel Vedic Astrology',
};

export default function LaunchChecklistPage() {
  return <LaunchChecklistView />;
}
