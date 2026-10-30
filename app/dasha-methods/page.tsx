import type { Metadata } from 'next';
import DashaMethodsView from './DashaMethodsView';

export const metadata: Metadata = {
  title: 'தசை முறைகள் — சரிபார்ப்பு நிலை — Kotravel Vedic Astrology',
  description: 'Every dasha method this software knows about, with its coverage label: '
    + 'whether it has a source locator, an independent worked example, and whether it is '
    + 'promoted for use in a report.',
};

export default function DashaMethodsPage() {
  return <DashaMethodsView />;
}
