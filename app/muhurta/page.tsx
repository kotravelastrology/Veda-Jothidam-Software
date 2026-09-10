import type { Metadata } from 'next';
import { MuhurtaFinder } from '@/src/analysis/MuhurtaFinder';

export const metadata: Metadata = {
  title: 'முகூர்த்தம் தேடுதல் — Kotravel Vedic Astrology',
};

export default function MuhurtaPage() {
  return (
    <main className="min-h-screen p-6">
      <MuhurtaFinder />
    </main>
  );
}
