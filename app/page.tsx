'use client';

import Link from 'next/link';

const DEFAULT_LOCATION = {
  placeName: 'சென்னை',
  latitude: 13.0827,
  longitude: 80.2707,
};

export default function HomePage() {

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="font-[family-name:var(--font-tamil-serif)] text-5xl font-bold text-ink mb-2">
            வேத-ஜோதிடம் வரவேற்கிறிர்கள்
          </h1>
          <p className="text-ink-soft text-lg">Complete Vedic Astrology Software — பஞ்சாங்கம் & முகூர்த்தம்</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-surface border border-line rounded-lg p-6">
            <div className="text-sm text-ink-soft mb-2">Location</div>
            <div className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-saffron">
              {DEFAULT_LOCATION.placeName}
            </div>
            <div className="text-sm text-ink-soft mt-2">Coordinates: {DEFAULT_LOCATION.latitude}°, {DEFAULT_LOCATION.longitude}°</div>
          </div>

          <div className="bg-surface border border-line rounded-lg p-6">
            <div className="text-sm text-ink-soft mb-2">System Status</div>
            <div className="text-2xl font-semibold text-teal">✓ Ready</div>
            <div className="text-sm text-ink-soft mt-2">All calculations online</div>
          </div>

          <div className="bg-surface border border-line rounded-lg p-6">
            <div className="text-sm text-ink-soft mb-2">Version</div>
            <div className="text-2xl font-semibold text-ink">v1.0.0</div>
            <div className="text-sm text-ink-soft mt-2">Production Ready</div>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link
            href="/report"
            className="group bg-gradient-to-br from-saffron to-saffron/80 text-ink rounded-lg p-6 hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-1">New Birth Chart</h3>
            <p className="text-sm opacity-90">Generate astrology report</p>
            <div className="mt-4 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Click to start →
            </div>
          </Link>

          <button className="group bg-gradient-to-br from-indigo to-indigo/80 text-surface rounded-lg p-6 hover:shadow-lg transition-all">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-lg mb-1">Find Chart</h3>
            <p className="text-sm opacity-90">Load saved chart</p>
            <div className="mt-4 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Browse files →
            </div>
          </button>

          <button className="group bg-gradient-to-br from-rose to-rose/80 text-surface rounded-lg p-6 hover:shadow-lg transition-all">
            <div className="text-3xl mb-3">💕</div>
            <h3 className="font-bold text-lg mb-1">Compatibility</h3>
            <p className="text-sm opacity-90">Check relationship</p>
            <div className="mt-4 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Compare charts →
            </div>
          </button>

          <button className="group bg-gradient-to-br from-teal to-teal/80 text-ink rounded-lg p-6 hover:shadow-lg transition-all">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-bold text-lg mb-1">Muhurtham</h3>
            <p className="text-sm opacity-90">Find auspicious time</p>
            <div className="mt-4 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              View times →
            </div>
          </button>
        </div>

        {/* Navigation Info */}
        <div className="bg-surface border border-line rounded-lg p-8 mb-12">
          <h2 className="font-[family-name:var(--font-tamil-serif)] text-2xl font-bold mb-4">✨ New Navigation System</h2>
          <p className="text-ink-soft mb-4">
            Phase 30.1 complete! The application now has a full navigation system with menu bar, sidebar, and breadcrumb trail.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border-l-4 border-saffron pl-3">
              <div className="text-xs text-ink-soft uppercase mb-1">Top Menu</div>
              <div className="font-bold text-ink">9 Menus</div>
            </div>
            <div className="border-l-4 border-indigo pl-3">
              <div className="text-xs text-ink-soft uppercase mb-1">Charts</div>
              <div className="font-bold text-ink">28+ Types</div>
            </div>
            <div className="border-l-4 border-rose pl-3">
              <div className="text-xs text-ink-soft uppercase mb-1">Reports</div>
              <div className="font-bold text-ink">60+ Views</div>
            </div>
            <div className="border-l-4 border-teal pl-3">
              <div className="text-xs text-ink-soft uppercase mb-1">Tools</div>
              <div className="font-bold text-ink">Full Set</div>
            </div>
          </div>
        </div>

        {/* Navigation Guide */}
        <div className="bg-gradient-to-r from-saffron/10 to-indigo/10 border border-line rounded-lg p-8">
          <h3 className="font-bold text-lg mb-4">Getting Started</h3>
          <p className="text-ink-soft mb-4">
            Use the menu bar above to navigate through the application:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <li className="flex gap-2">
              <span>📊</span>
              <span>
                <strong>Charts:</strong> View all 28+ chart types (Rasi, Navamsha, Vargas, Dashas, etc.)
              </span>
            </li>
            <li className="flex gap-2">
              <span>📈</span>
              <span>
                <strong>Reports:</strong> Generate detailed analysis reports (Shadbala, Ashtakavarga, etc.)
              </span>
            </li>
            <li className="flex gap-2">
              <span>🔧</span>
              <span>
                <strong>Tools:</strong> Use chart analysis tools (Location/Time changers, Rectification)
              </span>
            </li>
            <li className="flex gap-2">
              <span>📚</span>
              <span>
                <strong>References:</strong> Access classical Vedic texts and meanings
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
