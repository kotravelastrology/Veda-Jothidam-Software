'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  CLASSICAL_REFERENCES_DB,
  searchReferences,
  ClassicalText,
  getNakshatraInfo,
  getYogaInfo,
} from './classicalReferencesData';

type CategoryFilter = 'all' | 'text' | 'yoga' | 'nakshatra' | 'planet' | 'house' | 'rashi';

const VALID_CATEGORIES: CategoryFilter[] = ['all', 'text', 'yoga', 'nakshatra', 'planet', 'house', 'rashi'];

export function ClassicalReferenceBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedReference, setSelectedReference] = useState<ClassicalText | null>(null);
  const [tabView, setTabView] = useState<'search' | 'browse'>('search');

  // Deep-link: /references?category=yoga jumps straight to that category in browse view
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('category');
    if (param && VALID_CATEGORIES.includes(param as CategoryFilter)) {
      setSelectedCategory(param as CategoryFilter);
      setTabView('browse');
    }
  }, []);

  const allReferences = useMemo(() => {
    return [
      ...CLASSICAL_REFERENCES_DB.bphs,
      ...CLASSICAL_REFERENCES_DB.yogas,
      ...CLASSICAL_REFERENCES_DB.nakshatras,
      ...CLASSICAL_REFERENCES_DB.planets,
      ...CLASSICAL_REFERENCES_DB.houses,
      ...CLASSICAL_REFERENCES_DB.rashis,
    ];
  }, []);

  const filteredResults = useMemo(() => {
    if (!searchQuery) return [];
    const results = searchReferences(searchQuery);
    return selectedCategory === 'all'
      ? results
      : results.filter(r => r.category === selectedCategory);
  }, [searchQuery, selectedCategory]);

  const categoryOptions: { value: CategoryFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: allReferences.length },
    { value: 'text', label: 'Texts', count: CLASSICAL_REFERENCES_DB.bphs.length },
    { value: 'yoga', label: 'Yogas', count: CLASSICAL_REFERENCES_DB.yogas.length },
    { value: 'nakshatra', label: 'Nakshatras', count: CLASSICAL_REFERENCES_DB.nakshatras.length },
    { value: 'planet', label: 'Planets', count: CLASSICAL_REFERENCES_DB.planets.length },
    { value: 'house', label: 'Houses', count: CLASSICAL_REFERENCES_DB.houses.length },
    { value: 'rashi', label: 'Rashis', count: CLASSICAL_REFERENCES_DB.rashis.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-soft/30 to-orange-soft/30 rounded-lg p-6 border-l-4 border-amber">
        <h3 className="text-xl font-bold text-ink mb-2">古典参考書 (Classical Reference Library)</h3>
        <p className="text-sm text-ink-soft">
          Access comprehensive classical texts, yoga definitions, nakshatra meanings, and planetary significations from
          ancient Vedic literature.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-line">
        <button
          onClick={() => setTabView('search')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            tabView === 'search'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          Search References
        </button>
        <button
          onClick={() => setTabView('browse')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            tabView === 'browse'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          Browse by Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Search/Browse */}
        <div className="lg:col-span-1 space-y-4">
          {tabView === 'search' ? (
            <>
              {/* Search Box */}
              <div className="bg-surface-soft rounded-lg p-4 border border-line space-y-3">
                <label className="block text-sm font-semibold text-ink">Search References</label>
                <input
                  type="text"
                  placeholder="Search yoga, nakshatra, planet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded border border-line bg-surface text-ink placeholder-ink-soft focus:outline-none focus:border-saffron"
                />
                {searchQuery && (
                  <p className="text-xs text-ink-soft">
                    Found <strong>{filteredResults.length}</strong> results
                  </p>
                )}
              </div>

              {/* Category Filter */}
              <div className="bg-surface-soft rounded-lg p-4 border border-line space-y-3">
                <label className="block text-sm font-semibold text-ink">Filter by Category</label>
                <div className="space-y-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left px-4 py-2 rounded transition-colors flex justify-between items-center ${
                        selectedCategory === cat.value
                          ? 'bg-saffron text-ink border border-saffron'
                          : 'bg-surface border border-line hover:border-saffron'
                      }`}
                    >
                      <span className="font-semibold">{cat.label}</span>
                      <span className="text-xs bg-ink/10 px-2 py-1 rounded">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Browse Categories */}
              <div className="bg-surface-soft rounded-lg p-4 border border-line space-y-2">
                {categoryOptions.map((cat) => (
                  cat.value !== 'all' && (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setTabView('search');
                        setSelectedCategory(cat.value);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 rounded border border-line hover:border-saffron hover:bg-saffron/10 transition-colors"
                    >
                      <div className="font-semibold text-ink">{cat.label}</div>
                      <div className="text-xs text-ink-soft">{cat.count} entries</div>
                    </button>
                  )
                ))}
              </div>
            </>
          )}
        </div>

        {/* Middle Panel: Results List */}
        <div className="lg:col-span-1 bg-surface-soft rounded-lg p-4 border border-line space-y-2 max-h-96 overflow-y-auto">
          {tabView === 'search' && searchQuery ? (
            filteredResults.length > 0 ? (
              filteredResults.map((ref) => (
                <button
                  key={ref.id}
                  onClick={() => setSelectedReference(ref)}
                  className={`w-full text-left p-3 rounded border transition-all ${
                    selectedReference?.id === ref.id
                      ? 'bg-saffron/20 border-saffron'
                      : 'bg-surface border-line hover:border-saffron'
                  }`}
                >
                  <div className="font-semibold text-ink text-sm">{ref.title}</div>
                  {ref.titleTamil && (
                    <div className="text-xs text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                      {ref.titleTamil}
                    </div>
                  )}
                  <div className="text-xs text-ink-soft mt-1">{ref.author}</div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-ink-soft">No results found</div>
            )
          ) : (
            <div className="text-center py-8 text-ink-soft">
              Enter a search term or select a category above
            </div>
          )}
        </div>

        {/* Right Panel: Detailed View */}
        <div className="lg:col-span-1 bg-surface-soft rounded-lg p-6 border border-line space-y-4 max-h-96 overflow-y-auto">
          {selectedReference ? (
            <>
              <div>
                <h4 className="text-lg font-bold text-ink">{selectedReference.title}</h4>
                {selectedReference.titleTamil && (
                  <p className="text-sm text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                    {selectedReference.titleTamil}
                  </p>
                )}
              </div>

              <div className="border-t border-line pt-4 space-y-3">
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Author</div>
                  <p className="text-sm text-ink">{selectedReference.author}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Period</div>
                  <p className="text-sm text-ink">{selectedReference.century}</p>
                </div>
                {selectedReference.citations && selectedReference.citations.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-ink-soft uppercase">Citations</div>
                    <p className="text-sm text-ink">{selectedReference.citations.join(', ')}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-line pt-4">
                <div className="text-xs font-semibold text-ink-soft uppercase mb-2">Content</div>
                <p className="text-sm text-ink leading-relaxed">{selectedReference.content}</p>
              </div>

              {selectedReference.contentTamil && (
                <div className="border-t border-line pt-4">
                  <div className="text-xs font-semibold text-ink-soft uppercase mb-2">Tamil</div>
                  <p className="text-sm text-ink leading-relaxed font-[family-name:var(--font-tamil-serif)]">
                    {selectedReference.contentTamil}
                  </p>
                </div>
              )}

              {selectedReference.tags && selectedReference.tags.length > 0 && (
                <div className="border-t border-line pt-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedReference.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-saffron/20 text-saffron border border-saffron/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-ink-soft">
              Select a reference to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
