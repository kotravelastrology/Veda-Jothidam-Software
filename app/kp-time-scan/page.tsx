import type { Metadata } from 'next';
import KpTimeScanView from './KpTimeScanView';

export const metadata: Metadata = {
  title: 'KP முகூர்த்த நேரம் தேடல் (KP time scan) — Kotravel Vedic Astrology',
};

export default function KpTimeScanPage() {
  return <KpTimeScanView />;
}
