import type { Metadata } from 'next';
import SettingsPageView from './SettingsPageView';

export const metadata: Metadata = {
  title: 'அமைப்புகள் (Settings) — Kotravel Vedic Astrology',
  description: 'The settings of the program: display, calculations and dasha options. The same form as the ⚙️ panel.',
};

export default function SettingsPage() {
  return <SettingsPageView />;
}
