import type { Metadata } from 'next';
import ConflictsView from '../ConflictsView';

export const metadata: Metadata = {
  title: 'முரண்பாடுகள் (Conflicts) — Kotravel Vedic Astrology',
  description: 'When two devices edited the same chart differently, review both sides '
    + 'field by field and choose explicitly. Neither side is ever deleted.',
};

export default function ConflictsPage() {
  return <ConflictsView />;
}
