import type { Metadata } from 'next';
import { getConsultationConfig } from '../../src/report/consultationConfig';
import ConsultationFlow from './ConsultationFlow';

export const metadata: Metadata = {
  title: 'ஆலோசனை கோரிக்கை — Kotravel Vedic Astrology',
};

export default function ConsultationPage() {
  const config = getConsultationConfig();
  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-br from-teal-soft via-bg to-saffron-soft px-6 py-8 border-b border-line">
        <div className="max-w-xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">S13 · Consultation</p>
          <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஆலோசனை கோரிக்கை</h1>
        </div>
      </header>
      <ConsultationFlow config={config} />
    </main>
  );
}
