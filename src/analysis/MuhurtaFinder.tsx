'use client';

import { useState, useEffect } from 'react';
import { computeMuhurtaSearch } from '@/app/muhurta/actions';

interface AuspiciousTime {
  date: string;
  startTime: string;
  endTime: string;
  muhurtaType: 'abhijit' | 'brahma' | 'auspicious' | 'neutral';
  yogaQuality: number | null; // 0-100; null where the purpose's rules are not yet from the books
  tithi: string;
  nakshatra: string;
  dayOfWeek: string;
  notes: string;
}

interface MuhurtaFilters {
  purpose: 'marriage' | 'business' | 'travel' | 'surgery' | 'ritual' | 'houseWarming' | 'upanayana' | 'vidyarambha' | 'study';
  duration: number; // in hours
  startDate: string;
  endDate: string;
  preferredDayOfWeek?: string;
}

export function MuhurtaFinder() {
  const [filters, setFilters] = useState<MuhurtaFilters>({
    purpose: 'marriage',
    duration: 1,
    startDate: '',
    endDate: '',
  });

  const [selectedMuhurta, setSelectedMuhurta] = useState<AuspiciousTime | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Set the default 90-day date range on the client only — computing it during
  // render would produce a server/client hydration mismatch.
  useEffect(() => {
    setFilters((f) => (f.startDate ? f : {
      ...f,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }));
  }, []);

  // The unsourced per-purpose lists that stood here were removed (2026-10-11); the
  // rules come from the books through the engine, or the purpose shows SOURCE REQUIRED.
  const DURATION_HOURS: Record<MuhurtaFilters['purpose'], number> = { marriage: 1.5, business: 2, travel: 1, surgery: 4, ritual: 2, houseWarming: 2, upanayana: 2, vidyarambha: 1, study: 1 };

  // Real electional results (from the src/report/muhurtaSearch engine via a
  // server action). No mock — computed on demand from the Swiss Ephemeris.
  const [auspiciousTimes, setAuspiciousTimes] = useState<AuspiciousTime[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [book, setBook] = useState<string>('');

  const PURPOSE_TO_ENGINE: Record<string, string> = {
    marriage: 'marriage', business: 'business', travel: 'travel',
    // "Ritual" is no event read from the books yet (it used to borrow education's old unsourced list).
    surgery: 'medical', ritual: 'ritual', houseWarming: 'griha', upanayana: 'upanayana', vidyarambha: 'education', study: 'study',
  };

  const handleSearch = async (bookId: string = book) => {
    if (!filters.startDate || !filters.endDate) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const res: any = await computeMuhurtaSearch({
        startDate: filters.startDate,
        endDate: filters.endDate,
        purpose: PURPOSE_TO_ENGINE[filters.purpose] ?? 'marriage',
        latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330,
        book: bookId || undefined,
      });
      const { days, ...rest } = res;
      setMeta(rest);
      if (res.book) setBook(res.book);
      const dur = DURATION_HOURS[filters.purpose];
      const mapped: AuspiciousTime[] = (days || []).flatMap((d: any) => {
        const dayOfWeek = d.weekday.slice(0, 3);
        if (filters.preferredDayOfWeek && dayOfWeek !== filters.preferredDayOfWeek) return [];
        const w = d.windows[0];
        return [{
          date: d.date,
          startTime: w ? w.from : '06:00',
          endTime: w ? w.to : '07:30',
          muhurtaType: d.score === null ? 'neutral' : d.score >= 80 ? 'abhijit' : d.score >= 62 ? 'auspicious' : 'neutral',
          yogaQuality: d.score,
          tithi: d.month ? `${d.tithi} · ${d.month} மாதம்` : d.tithi,
          nakshatra: d.nakshatra,
          dayOfWeek,
          notes: `${d.rating}${d.notes?.length ? ' · ' + d.notes.join('; ') : ''} · ${dur}h`,
        }];
      });
      setAuspiciousTimes(mapped);
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : String(e));
      setAuspiciousTimes([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-saffron/30 to-amber-soft/30 rounded-lg p-6 border-l-4 border-saffron">
        <h3 className="text-xl font-bold text-ink mb-2">मुहूर्त खोजक (Muhurta Finder)</h3>
        <p className="text-sm text-ink-soft">
          Find auspicious times (muhurtas) for important events using classical Vedic astrology principles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-4">
            <h4 className="font-semibold text-ink">Filters</h4>

            {/* Purpose Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">Purpose</label>
              <select
                value={filters.purpose}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, purpose: e.target.value as any }));
                  setBook('');
                }}
                className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
              >
                <option value="marriage">💒 Marriage</option>
                <option value="business">💼 Business</option>
                <option value="travel">✈️ Travel</option>
                <option value="surgery">⚕️ Surgery</option>
                <option value="ritual">🙏 Ritual</option>
                <option value="houseWarming">🏠 House Warming</option>
                <option value="upanayana">🧵 உபநயனம் (Upanayana)</option>
                <option value="vidyarambha">📚 வித்யாரம்பம் (Aksharabhyasa)</option>
                <option value="study">🎓 கல்வி தொடக்கம் (Vidya)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">Duration (hours)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={filters.duration}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, duration: parseInt(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
              />
            </div>

            {/* Preferred Day */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">Preferred Day</label>
              <select
                value={filters.preferredDayOfWeek || ''}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, preferredDayOfWeek: e.target.value || undefined }))
                }
                className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
              >
                <option value="">Any</option>
                <option value="Mon">Monday</option>
                <option value="Tue">Tuesday</option>
                <option value="Wed">Wednesday</option>
                <option value="Thu">Thursday</option>
                <option value="Fri">Friday</option>
                <option value="Sat">Saturday</option>
                <option value="Sun">Sunday</option>
              </select>
            </div>

            {['houseWarming', 'upanayana', 'travel', 'vidyarambha', 'study'].includes(filters.purpose) && meta?.books && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">நூல் (விதிகள்)</label>
                <select value={book} onChange={(e) => { setBook(e.target.value); handleSearch(e.target.value); }}
                  className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm">
                  {meta.books.map((b: any) => <option key={b.id} value={b.id}>{b.labelTa}{b.isDefault ? ' (இயல்பு)' : ''}</option>)}
                </select>
              </div>
            )}

            <button
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="w-full px-4 py-2 bg-saffron text-ink font-semibold rounded hover:bg-saffron/90 disabled:opacity-50 transition-colors"
            >
              {isSearching ? 'Searching...' : '🔍 Find Muhurtas'}
            </button>
          </div>
        </div>

        {/* Middle-Right: Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results List */}
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-3">
            <h4 className="font-semibold text-ink mb-4">
              {isSearching ? 'கணக்கிடுகிறது…'
                : searchError ? `⚠️ ${searchError}`
                : auspiciousTimes.length > 0 ? `${auspiciousTimes.length} நாட்கள் — சிறந்தது முதலில்`
                : 'தேதி வரம்பு + நோக்கம் தேர்ந்து "Find Muhurtas" அழுத்தவும் (சூரிய உதயத்தின் உண்மையான பஞ்சாங்கம்)'}
            </h4>
            {meta && !isSearching && (
              <div className={`text-xs rounded p-3 ${meta.sourced ? 'bg-surface border border-line text-ink' : 'bg-rose-soft text-rose'}`}>
                {meta.sourced ? (
                  <>
                    <p><strong>{meta.purposeLabel}</strong> — நூல்: {meta.books.find((b: any) => b.id === meta.book)?.labelTa}. {meta.source?.title} — {String(meta.source?.pageLocus ?? '').split(': ')[0]}</p>
                    <p className="text-ink-soft mt-1">{meta.rankTa}</p>
                  </>
                ) : <p>{meta.missingTa}</p>}
                {meta.noteTa && <p className="mt-1">{meta.noteTa}</p>}
              </div>
            )}

            <div className="max-h-96 overflow-y-auto space-y-3">
              {auspiciousTimes.slice(0, 10).map((muhurta, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMuhurta(muhurta)}
                  className={`w-full text-left p-4 rounded border-2 transition-all ${
                    selectedMuhurta?.date === muhurta.date &&
                    selectedMuhurta?.startTime === muhurta.startTime
                      ? 'bg-saffron/20 border-saffron'
                      : 'bg-surface border-line hover:border-saffron'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-ink">{muhurta.date}</div>
                      <div className="text-sm text-ink-soft">{muhurta.dayOfWeek}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-saffron">{muhurta.yogaQuality === null ? '—' : `${muhurta.yogaQuality}%`}</div>
                      <div className="text-xs text-ink-soft">{muhurta.muhurtaType}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-ink-soft">
                    <div>⏰ {muhurta.startTime} - {muhurta.endTime}</div>
                    <div>🌟 {muhurta.nakshatra}</div>
                    <div>📅 {muhurta.tithi}</div>
                    <div>🔮 {muhurta.notes}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          {selectedMuhurta && (
            <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-4">
              <h4 className="font-semibold text-ink">📋 Muhurta Details</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Date</div>
                  <p className="text-ink font-semibold">{selectedMuhurta.date}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Time</div>
                  <p className="text-ink font-semibold">{selectedMuhurta.startTime} - {selectedMuhurta.endTime}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Nakshatra</div>
                  <p className="text-ink">{selectedMuhurta.nakshatra}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Tithi</div>
                  <p className="text-ink">{selectedMuhurta.tithi}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Yoga Quality</div>
                  <p className="text-ink font-semibold">{selectedMuhurta.yogaQuality === null ? '—' : `${selectedMuhurta.yogaQuality}%`}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Type</div>
                  <p className="text-ink capitalize">{selectedMuhurta.muhurtaType}</p>
                </div>
              </div>

              <div className="border-t border-line pt-4">
                <div className="text-xs font-semibold text-ink-soft uppercase mb-2">Notes</div>
                <p className="text-sm text-ink">{selectedMuhurta.notes}</p>
              </div>

              <button className="w-full px-4 py-2 bg-saffron text-ink font-semibold rounded hover:bg-saffron/90 transition-colors">
                ✅ Confirm Muhurta
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-amber/10 rounded-lg p-4 border border-amber/30">
        <p className="text-xs text-amber-900 leading-relaxed">
          💡 <strong>About Muhurtas:</strong> Muhurta means "an auspicious moment." The classical texts recommend selecting
          auspicious times for important ceremonies and events. Factors include tithi (lunar day), nakshatra (constellation),
          hora (planetary hour), and various yogas to ensure favorable outcomes.
        </p>
      </div>
    </div>
  );
}
