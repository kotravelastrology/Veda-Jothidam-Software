import type { Metadata } from 'next';
import SyncView from './SyncView';

export const metadata: Metadata = {
  title: 'சாதனங்களும் அனுப்பு வரிசையும் (Sync) — Kotravel Vedic Astrology',
  description: 'Devices granted sync access, what each may do, which have been revoked, '
    + 'and what is queued locally. Sync is optional (ADR-05).',
};

export default function SyncPage() {
  return <SyncView />;
}
