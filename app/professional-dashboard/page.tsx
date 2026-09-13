import type { Metadata } from 'next';
import ProfessionalDashboardView from './ProfessionalDashboardView';

export const metadata: Metadata = {
  title: 'ஆஸ்திர பகுப்பாய்வு பலகை (Professional Dashboard) — Kotravel Vedic Astrology',
  description: 'Professional astrology dashboard - complete chart analysis with planetary strengths, house analysis, and key insights.',
};

export default function ProfessionalDashboardPage() {
  return <ProfessionalDashboardView />;
}
