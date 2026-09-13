import type { Metadata } from 'next';
import ConsultationToolsView from './ConsultationToolsView';

export const metadata: Metadata = {
  title: 'ஆலோசனை கருவிகள் (Consultation Tools) — Kotravel Vedic Astrology',
  description: 'Consultation tools - record notes, recommendations, and remedies for client consultations.',
};

export default function ConsultationToolsPage() {
  return <ConsultationToolsView />;
}
