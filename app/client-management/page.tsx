import type { Metadata } from 'next';
import ClientManagementView from './ClientManagementView';

export const metadata: Metadata = {
  title: 'வாடிக்கையாளர் நிர்வாகம் (Client Management) — Kotravel Vedic Astrology',
  description: 'Client management system - manage client information, consultation history, and birth chart data.',
};

export default function ClientManagementPage() {
  return <ClientManagementView />;
}
