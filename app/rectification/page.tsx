import type { Metadata } from 'next';
import RectificationView from './RectificationView';

export const metadata: Metadata = {
  title: 'ஜனன கால திருத்தம் (Birth-Time Rectification) — Kotravel Vedic Astrology',
};

export default function RectificationPage() {
  return <RectificationView />;
}
