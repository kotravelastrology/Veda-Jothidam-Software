'use client';

import { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  type: 'article' | 'video' | 'book' | 'reference';
  author?: string;
  source?: string;
  date?: string;
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Understanding Shadbala (Six-Fold Strength)',
    category: 'Planetary Strength',
    description: 'Complete guide to calculating and interpreting planetary strength using the classical Shadbala system.',
    type: 'article',
    author: 'Classical Vedic Astrology',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Divisional Charts (Vargas) Interpretation',
    category: 'Divisional Charts',
    description: 'Comprehensive explanation of 16 divisional charts and their significance in detailed chart analysis.',
    type: 'article',
    author: 'Dr. K.N. Rao',
    date: '2024-02-20',
  },
  {
    id: '3',
    title: 'Vimshottari Dasha System',
    category: 'Dasha Systems',
    description: 'Deep dive into the 120-year Vimshottari Dasha cycle and its application in predictive astrology.',
    type: 'article',
    author: 'Vedic Astrology Institute',
    date: '2024-03-10',
  },
  {
    id: '4',
    title: 'Yoga Detection & Interpretation',
    category: 'Yogas',
    description: 'Guide to identifying and interpreting beneficial and challenging yogas in birth charts.',
    type: 'article',
    author: 'Prof. V.K. Choudhry',
    date: '2024-04-05',
  },
  {
    id: '5',
    title: 'House Analysis (Bhava Bala)',
    category: 'House Analysis',
    description: 'Understanding house strength and its effects on different life areas.',
    type: 'article',
    author: 'Classical References',
    date: '2024-01-30',
  },
  {
    id: '6',
    title: 'Astrological Remedies & Rituals',
    category: 'Remedies',
    description: 'Classical remedies for planetary afflictions including mantras, gemstones, and rituals.',
    type: 'article',
    author: 'Vedic Texts',
    date: '2024-02-14',
  },
];

export default function LearningResourcesView() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const categories = ['Planetary Strength', 'Divisional Charts', 'Dasha Systems', 'Yogas', 'House Analysis', 'Remedies'];

  const filteredResources = RESOURCES.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Learning Resources
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          கற்றல் வளங்கள் (Learning Resources)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          வேதாங்க ஜ்ஞானம் மற்றும் ஆஸ்திர குறிப்புக்கள். Classical astrology knowledge and references.
        </p>
      </header>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="bg-surface border border-line rounded-2xl p-5 h-fit">
          <h3 className="font-semibold text-ink mb-4">📚 Categories</h3>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-2 rounded mb-2 transition ${
              selectedCategory === null
                ? 'bg-saffron text-ink font-medium'
                : 'hover:bg-info/10 text-ink-soft'
            }`}
          >
            All Topics ({RESOURCES.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded mb-2 transition ${
                selectedCategory === cat
                  ? 'bg-saffron text-ink font-medium'
                  : 'hover:bg-info/10 text-ink-soft'
              }`}
            >
              {cat} ({RESOURCES.filter(r => r.category === cat).length})
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="bg-surface border border-line rounded-2xl p-5">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-ink-soft/10 border border-line rounded-lg"
            />
          </div>

          {/* Resources Grid */}
          <div className="space-y-4">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => setSelectedResource(resource)}
                  className={`w-full text-left p-5 rounded-lg border-2 transition ${
                    selectedResource?.id === resource.id
                      ? 'bg-info/10 border-info'
                      : 'bg-surface border-line hover:border-info/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {resource.type === 'article' && '📄'}
                          {resource.type === 'video' && '🎥'}
                          {resource.type === 'book' && '📖'}
                          {resource.type === 'reference' && '📚'}
                        </span>
                        <h3 className="font-semibold text-ink text-lg">{resource.title}</h3>
                      </div>
                      <p className="text-sm text-ink-soft mb-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-info/10 text-info rounded text-xs font-medium">
                          {resource.category}
                        </span>
                        {resource.author && (
                          <span className="px-2 py-1 bg-orange/10 text-orange rounded text-xs">
                            By {resource.author}
                          </span>
                        )}
                        {resource.date && (
                          <span className="px-2 py-1 bg-gray/10 text-ink-soft rounded text-xs">
                            {resource.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12 text-ink-soft">
                <p className="text-sm">No resources found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Resource Detail */}
      {selectedResource && (
        <div className="mt-8 bg-info/10 border border-info rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-2">{selectedResource.title}</h2>
              <div className="flex flex-wrap gap-3 text-sm">
                {selectedResource.author && (
                  <span className="flex items-center gap-1">
                    <span className="text-info">👤</span> {selectedResource.author}
                  </span>
                )}
                {selectedResource.source && (
                  <span className="flex items-center gap-1">
                    <span className="text-info">🔗</span> {selectedResource.source}
                  </span>
                )}
                {selectedResource.date && (
                  <span className="flex items-center gap-1">
                    <span className="text-info">📅</span> {selectedResource.date}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedResource(null)}
              className="text-info hover:text-info/60 text-2xl"
            >
              ✕
            </button>
          </div>

          <p className="text-ink-soft mb-4 leading-relaxed">{selectedResource.description}</p>

          <div className="space-y-4">
            <div className="bg-white/50 rounded p-4">
              <h3 className="font-semibold text-ink mb-2">Key Topics</h3>
              <ul className="text-sm text-ink-soft space-y-1">
                <li>• Understanding the fundamental concepts</li>
                <li>• Classical interpretations and rules</li>
                <li>• Practical application in chart analysis</li>
                <li>• Common mistakes and how to avoid them</li>
              </ul>
            </div>

            <div className="bg-white/50 rounded p-4">
              <h3 className="font-semibold text-ink mb-2">Learning Path</h3>
              <ol className="text-sm text-ink-soft space-y-1 list-decimal list-inside">
                <li>Start with foundational concepts</li>
                <li>Study classical texts and references</li>
                <li>Analyze practical chart examples</li>
                <li>Practice interpretation exercises</li>
                <li>Review advanced techniques</li>
              </ol>
            </div>

            <button className="w-full px-4 py-2 bg-info text-white rounded-lg font-medium hover:bg-info/90 transition">
              📖 Read Full Content
            </button>
          </div>
        </div>
      )}

      {/* Reference Guides */}
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green/10 border border-green rounded-lg p-4">
          <p className="font-semibold text-green mb-2">♡ Benefic Yogas</p>
          <p className="text-xs text-ink-soft">Raja, Lakshmi, Gaja Kesari, Dhana yogas</p>
        </div>
        <div className="bg-rose/10 border border-rose rounded-lg p-4">
          <p className="font-semibold text-rose mb-2">✗ Malefic Yogas</p>
          <p className="text-xs text-ink-soft">Kuja Dosha, Papakartas, difficult combinations</p>
        </div>
        <div className="bg-orange/10 border border-orange rounded-lg p-4">
          <p className="font-semibold text-orange mb-2">⭐ Planetary Strengths</p>
          <p className="text-xs text-ink-soft">Exaltation, Moolatrikona, own houses</p>
        </div>
        <div className="bg-info/10 border border-info rounded-lg p-4">
          <p className="font-semibold text-info mb-2">🔄 Dasha Periods</p>
          <p className="text-xs text-ink-soft">120-year Vimshottari cycle and effects</p>
        </div>
      </div>

      {/* Recommended Reading Order */}
      <div className="mt-8 bg-saffron/10 border border-saffron rounded-2xl p-6">
        <h3 className="font-semibold text-saffron mb-4">📋 Recommended Reading Order</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { num: 1, title: 'Fundamentals', desc: 'Start here' },
            { num: 2, title: 'Planetary Strengths', desc: 'Build foundation' },
            { num: 3, title: 'Divisional Charts', desc: 'Deepen analysis' },
            { num: 4, title: 'Dasha Systems', desc: 'Learn prediction' },
            { num: 5, title: 'Yoga Detection', desc: 'Identify patterns' },
            { num: 6, title: 'Remedies', desc: 'Advanced practice' },
          ].map((item) => (
            <div key={item.num} className="bg-white/50 rounded-lg p-4 border border-saffron/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center font-bold text-sm">
                  {item.num}
                </div>
                <span className="font-medium text-ink">{item.title}</span>
              </div>
              <p className="text-xs text-ink-soft">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          கற்றல் வளங்கள் — வேத ஜ்ஞানம் மற்றும் ঐতிহ্যமிக்க பாட்ய வேளை குறிப்பு.
          Classical astrology knowledge repository and learning resources.
        </p>
      </footer>
    </main>
  );
}
