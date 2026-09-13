import type { Metadata } from 'next';
import SettingsView from './SettingsView';

export const metadata: Metadata = {
  title: 'விருப்பங்கள் (Settings) — Kotravel Vedic Astrology',
  description: 'Settings and preferences - customize language, display, calculations, and notifications.',
};

export default function SettingsPage() {
  return <SettingsView />;
}
