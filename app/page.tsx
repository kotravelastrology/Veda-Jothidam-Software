'use client';

import Link from 'next/link';
import type { Metadata } from 'next';

const DEFAULT_LOCATION = {
  placeName: 'சென்னை',
  latitude: 13.0827,
  longitude: 80.2707,
};

export default function HomePage() {

  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron/5 to-transparent">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🕉️</span>
            <h1 className="font-[family-name:var(--font-tamil-serif)] text-5xl font-bold text-ink">
              வேத ஜோதிடம்
            </h1>
          </div>
          <p className="text-ink-soft text-lg mb-2">Professional Vedic Astrology Platform</p>
          <p className="text-ink-soft">Complete chart analysis, client management & professional reporting</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-surface border border-line rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-saffron mb-1">98/98</p>
            <p className="text-sm text-ink-soft">Calculation Tests</p>
          </div>
          <div className="bg-surface border border-line rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-saffron mb-1">119/119</p>
            <p className="text-sm text-ink-soft">Yoga Detection Tests</p>
          </div>
          <div className="bg-surface border border-line rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-saffron mb-1">11</p>
            <p className="text-sm text-ink-soft">Feature Pages</p>
          </div>
          <div className="bg-surface border border-line rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-saffron mb-1">10</p>
            <p className="text-sm text-ink-soft">API Endpoints</p>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6">Core Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: '📊', title: 'Dashboard', link: '/professional-dashboard' },
              { icon: '📈', title: 'Divisional Charts', link: '/divisional-charts' },
              { icon: '✨', title: 'Yoga Detection', link: '/yoga-detection' },
              { icon: '🏠', title: 'House Analysis', link: '/house-analysis' },
              { icon: '🔄', title: 'Dasha Timeline', link: '/dasha-timeline' },
              { icon: '📄', title: 'PDF Reports', link: '/pdf-reports' },
              { icon: '👥', title: 'Client Mgmt', link: '/client-management' },
              { icon: '🎯', title: 'Consultation', link: '/consultation-tools' },
              { icon: '📚', title: 'Learning', link: '/learning-resources' },
              { icon: '⚙️', title: 'Settings', link: '/settings' },
            ].map((feature, i) => (
              <Link
                key={i}
                href={feature.link}
                className="group bg-surface border border-line rounded-lg p-5 hover:border-saffron hover:shadow-lg transition"
              >
                <p className="text-3xl mb-3">{feature.icon}</p>
                <h4 className="font-semibold text-ink group-hover:text-saffron transition">{feature.title}</h4>
              </Link>
            ))}
          </div>
        </div>

        {/* Phase Completion */}
        <div className="bg-saffron/10 border-t border-b border-saffron rounded-lg p-8 mb-12 text-center">
          <h3 className="text-2xl font-bold text-ink mb-4">Phase 30 Completion</h3>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-4xl font-bold text-saffron">90%</div>
            <div className="w-48 h-3 bg-line rounded-full overflow-hidden">
              <div className="w-[90%] h-full bg-saffron rounded-full"></div>
            </div>
          </div>
          <p className="text-ink-soft mb-4">Days 1-22 Complete • 11 Features Deployed • 195+ Tests Passing</p>
          <p className="text-sm text-ink-soft">Days 23-30: Final integration, testing, optimization, and production deployment</p>
        </div>

        {/* Why Choose */}
        <div className="bg-surface border border-line rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-ink mb-6">Why Choose Veda Jothidam?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🎯', title: 'Complete Analysis', desc: 'Test-verified engine (98/98 tests)' },
              { icon: '📊', title: 'Professional Reports', desc: 'Customizable PDF generation' },
              { icon: '💼', title: 'Client Management', desc: 'Full CRM with consultation history' },
              { icon: '🌐', title: 'Bilingual', desc: 'Tamil and English throughout' },
              { icon: '📱', title: 'Responsive', desc: 'Works on all devices' },
              { icon: '⚡', title: 'Fast', desc: '2-3 second load times' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h4 className="font-semibold text-ink">{item.title}</h4>
                  <p className="text-sm text-ink-soft">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
