import type { Metadata } from 'next';
import { ClassicalReferenceBrowser } from '@/src/references/ClassicalReferenceBrowser';

export const metadata: Metadata = {
  title: 'சாஸ்திர நூல்கள் — Kotravel Vedic Astrology',
};

export default function ReferencesPage() {
  return (
    <main className="min-h-screen p-6">
      <ClassicalReferenceBrowser />
    </main>
  );
}
