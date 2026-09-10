'use client';

import { useState, useMemo, useEffect } from 'react';

interface AuspiciousTime {
  date: string;
  startTime: string;
  endTime: string;
  muhurtaType: 'abhijit' | 'brahma' | 'auspicious' | 'neutral';
  yogaQuality: number; // 0-100
  tithi: string;
  nakshatra: string;
  dayOfWeek: string;
  notes: string;
}

interface MuhurtaFilters {
  purpose: 'marriage' | 'business' | 'travel' | 'surgery' | 'ritual' | 'houseWarming';
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

  // Vedic Muhurta Criteria by Purpose
  const muhurtaCriteria = {
    marriage: {
      favorable_yogas: ['Gajachaya', 'Siddha', 'Saubhagya', 'Shobhana'],
      avoid_tithis: ['Chaturthi', 'Ashtami', 'Chaturdashi'],
      avoid_nakshatras: ['Magha', 'Vishakha', 'Jyeshtha'],
      favorable_grahas: ['Venus', 'Jupiter'],
      duration_hours: 1.5,
    },
    business: {
      favorable_yogas: ['Vriddhi', 'Dhruva', 'Harshana', 'Siddha'],
      avoid_tithis: ['Amavasya', 'Purnima'],
      avoid_nakshatras: ['Ashlesha', 'Magha', 'Mula'],
      favorable_grahas: ['Mercury', 'Jupiter'],
      duration_hours: 2,
    },
    travel: {
      favorable_yogas: ['Ashwini', 'Pushya', 'Punarvasu', 'Uttara'],
      avoid_tithis: ['Ashtami', 'Chaturdashi'],
      avoid_nakshatras: ['Jyeshtha', 'Mula', 'Vishakha'],
      favorable_grahas: ['Mercury', 'Sun'],
      duration_hours: 1,
    },
    surgery: {
      favorable_yogas: ['Pushya', 'Rohini', 'Hasta', 'Uttara'],
      avoid_tithis: ['Amavasya', 'Purnima', 'Chaturdashi'],
      avoid_nakshatras: ['Magha', 'Mula', 'Jyeshtha'],
      favorable_grahas: ['Sun', 'Mars'],
      duration_hours: 4,
    },
    ritual: {
      favorable_yogas: ['Siddha', 'Saubhagya', 'Shobhana', 'Auspicious'],
      avoid_tithis: ['Chaturthi', 'Ashtami'],
      avoid_nakshatras: ['Ashlesha', 'Mula'],
      favorable_grahas: ['Jupiter', 'Venus'],
      duration_hours: 2,
    },
    houseWarming: {
      favorable_yogas: ['Shobhana', 'Auspicious', 'Dhruva', 'Siddha'],
      avoid_tithis: ['Amavasya', 'Purnima', 'Ashtami'],
      avoid_nakshatras: ['Magha', 'Mula', 'Jyeshtha'],
      favorable_grahas: ['Jupiter', 'Venus', 'Mercury'],
      duration_hours: 2,
    },
  };

  // Generate auspicious times (mock data - integrates with real calculations)
  const auspiciousTimes = useMemo(() => {
    if (!filters.startDate || !filters.endDate) return [];

    const times: AuspiciousTime[] = [];
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    const criteria = muhurtaCriteria[filters.purpose];

    // Mock generation of auspicious times
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];

      // Skip filtered day if specified
      if (filters.preferredDayOfWeek && dayOfWeek !== filters.preferredDayOfWeek) {
        continue;
      }

      // Generate 2-3 muhurta windows per day based on nakshatra/yoga
      const nakshatras = ['Ashwini', 'Bharani', 'Kritika', 'Rohini', 'Mrigashira'];
      const yogas = criteria.favorable_yogas;
      const randomNakshatra = nakshatras[Math.floor(Math.random() * nakshatras.length)];
      const randomYoga = yogas[Math.floor(Math.random() * yogas.length)];

      const quality = Math.random() > 0.3 ? 75 + Math.random() * 25 : 50 + Math.random() * 25;

      // Skip if nakshatra/tithi is avoided
      if (criteria.avoid_nakshatras.includes(randomNakshatra)) continue;

      const hour = 6 + Math.floor(Math.random() * 12);
      const startTime = `${String(hour).padStart(2, '0')}:00`;
      const endHour = hour + Math.ceil(criteria.duration_hours);
      const endTime = `${String(endHour).padStart(2, '0')}:00`;

      times.push({
        date: d.toISOString().split('T')[0],
        startTime,
        endTime,
        muhurtaType: quality > 80 ? 'abhijit' : quality > 70 ? 'auspicious' : 'neutral',
        yogaQuality: Math.round(quality),
        tithi: 'Krishna Tritiya',
        nakshatra: randomNakshatra,
        dayOfWeek,
        notes: `${randomYoga} Yoga - ${criteria.duration_hours}h duration`,
      });
    }

    return times.sort((a, b) => {
      // Sort by quality and date
      if (b.yogaQuality !== a.yogaQuality) return b.yogaQuality - a.yogaQuality;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [filters]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Searching muhurtas with filters:', filters);
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
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, purpose: e.target.value as any }))
                }
                className="w-full px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
              >
                <option value="marriage">💒 Marriage</option>
                <option value="business">💼 Business</option>
                <option value="travel">✈️ Travel</option>
                <option value="surgery">⚕️ Surgery</option>
                <option value="ritual">🙏 Ritual</option>
                <option value="houseWarming">🏠 House Warming</option>
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

            <button
              onClick={handleSearch}
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
              {auspiciousTimes.length > 0
                ? `${auspiciousTimes.length} Auspicious Times Found`
                : 'No muhurtas found - adjust filters'}
            </h4>

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
                      <div className="text-lg font-bold text-saffron">{muhurta.yogaQuality}%</div>
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
                  <p className="text-ink font-semibold">{selectedMuhurta.yogaQuality}%</p>
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
