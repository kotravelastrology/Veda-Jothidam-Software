'use client';

import { useState } from 'react';

interface PlanetaryStrength {
  planet: string;
  tamil: string;
  strength: number;
  status: 'excellent' | 'good' | 'moderate' | 'weak';
}

interface ChartInfo {
  name: string;
  date: string;
  time: string;
  location: string;
  lagna: string;
  currentDasha: string;
}

const PLANETS_STRENGTH: PlanetaryStrength[] = [
  { planet: 'Sun', tamil: 'சூரியன்', strength: 78, status: 'good' },
  { planet: 'Moon', tamil: 'சந்திரன்', strength: 85, status: 'excellent' },
  { planet: 'Mars', tamil: 'செவ்வாய்', strength: 62, status: 'moderate' },
  { planet: 'Mercury', tamil: 'புதன்', strength: 88, status: 'excellent' },
  { planet: 'Jupiter', tamil: 'குரு', strength: 92, status: 'excellent' },
  { planet: 'Venus', tamil: 'சுக்ரன்', strength: 75, status: 'good' },
  { planet: 'Saturn', tamil: 'சனி', strength: 45, status: 'weak' },
  { planet: 'Rahu', tamil: 'ராகு', strength: 58, status: 'moderate' },
  { planet: 'Ketu', tamil: 'கேது', strength: 55, status: 'moderate' },
];

const HOUSE_STRENGTHS = [
  { house: 1, strength: 82, significance: 'Self' },
  { house: 2, strength: 68, significance: 'Wealth' },
  { house: 3, strength: 75, significance: 'Communication' },
  { house: 4, strength: 55, significance: 'Home' },
  { house: 5, strength: 78, significance: 'Creativity' },
  { house: 6, strength: 42, significance: 'Health' },
  { house: 7, strength: 71, significance: 'Partnership' },
  { house: 8, strength: 38, significance: 'Transformation' },
  { house: 9, strength: 85, significance: 'Fortune' },
  { house: 10, strength: 79, significance: 'Career' },
  { house: 11, strength: 73, significance: 'Gains' },
  { house: 12, strength: 48, significance: 'Loss' },
];

export default function ProfessionalDashboardView() {
  const [birthData, setBirthData] = useState({
    date: '1990-05-15',
    time: '10:30:00',
    location: 'Chennai, India',
    latitude: '13.0827',
    longitude: '80.2707',
  });
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (strength: number): string => {
    if (strength >= 75) return 'text-green';
    if (strength >= 50) return 'text-orange';
    return 'text-rose';
  };

  const getStatusBg = (strength: number): string => {
    if (strength >= 75) return 'bg-green/10';
    if (strength >= 50) return 'bg-orange/10';
    return 'bg-rose/10';
  };

  const avgPlanetaryStrength = Math.round(
    PLANETS_STRENGTH.reduce((sum, p) => sum + p.strength, 0) / PLANETS_STRENGTH.length
  );

  const avgHouseStrength = Math.round(
    HOUSE_STRENGTHS.reduce((sum, h) => sum + h.strength, 0) / HOUSE_STRENGTHS.length
  );

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Professional Dashboard
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          ஆஸ்திர பகுப்பாய்வு பலகை (Astrology Dashboard)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          সম্পূর্ণ ব্যক্তিত্ব বিশ্লেষণ এক পৃষ্ঠায়। Complete personality analysis at a glance.
        </p>
      </header>

      {/* Input Section */}
      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த தேதி</span>
            <input
              type="date"
              value={birthData.date}
              onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த நேரம்</span>
            <input
              type="time"
              step="1"
              value={birthData.time}
              onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">இடம்</span>
            <input
              type="text"
              value={birthData.location}
              onChange={(e) => setBirthData({ ...birthData, location: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
              placeholder="City, Country"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">அட்சரேகை / தீர்க்கரேகை</span>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.0001"
                value={birthData.latitude}
                onChange={(e) => setBirthData({ ...birthData, latitude: e.target.value })}
                className="flex-1 px-3 py-2 bg-ink-soft/10 border border-line rounded"
                placeholder="Lat"
              />
              <input
                type="number"
                step="0.0001"
                value={birthData.longitude}
                onChange={(e) => setBirthData({ ...birthData, longitude: e.target.value })}
                className="flex-1 px-3 py-2 bg-ink-soft/10 border border-line rounded"
                placeholder="Long"
              />
            </div>
          </label>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="w-full px-4 py-2 bg-saffron text-ink rounded font-medium disabled:opacity-50 hover:bg-saffron/90"
        >
          {loading ? 'ஆய்வு செய்கிறது…' : 'பலகை வெளிப்படுத்து'}
        </button>
      </div>

      {loaded && (
        <>
          {/* Birth Info & Current Status */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Birth Info */}
            <div className="bg-surface border border-line rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-ink-soft uppercase mb-4">Birth Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-ink-soft mb-1">Date & Time</p>
                  <p className="font-medium text-ink">{birthData.date} {birthData.time}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-1">Location</p>
                  <p className="font-medium text-ink">{birthData.location}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-1">Coordinates</p>
                  <p className="font-medium text-ink text-xs">{birthData.latitude}°, {birthData.longitude}°</p>
                </div>
              </div>
            </div>

            {/* Chart Summary */}
            <div className="bg-info/10 border border-info rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-info uppercase mb-4">Chart Summary</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-info/60 mb-1">Lagna (Ascendant)</p>
                  <p className="font-bold text-ink text-lg">Virgo</p>
                </div>
                <div>
                  <p className="text-xs text-info/60 mb-1">Current Dasha</p>
                  <p className="font-bold text-ink">Moon Dasha</p>
                </div>
                <div>
                  <p className="text-xs text-info/60 mb-1">Dasha Ruler</p>
                  <p className="font-bold text-ink">Excellent</p>
                </div>
              </div>
            </div>

            {/* Overall Health */}
            <div className="bg-surface border border-line rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-ink-soft uppercase mb-4">Overall Score</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-ink-soft">Planetary Strength</span>
                    <span className={`font-bold ${getStatusColor(avgPlanetaryStrength)}`}>{avgPlanetaryStrength}%</span>
                  </div>
                  <div className="h-2 bg-line rounded-full overflow-hidden">
                    <div
                      className={`h-full ${avgPlanetaryStrength >= 75 ? 'bg-green' : avgPlanetaryStrength >= 50 ? 'bg-orange' : 'bg-rose'}`}
                      style={{ width: `${avgPlanetaryStrength}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-ink-soft">House Strength</span>
                    <span className={`font-bold ${getStatusColor(avgHouseStrength)}`}>{avgHouseStrength}%</span>
                  </div>
                  <div className="h-2 bg-line rounded-full overflow-hidden">
                    <div
                      className={`h-full ${avgHouseStrength >= 75 ? 'bg-green' : avgHouseStrength >= 50 ? 'bg-orange' : 'bg-rose'}`}
                      style={{ width: `${avgHouseStrength}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Planetary Strengths */}
          <div className="bg-surface border border-line rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-ink mb-4">🪐 Planetary Strength (Shadbala)</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {PLANETS_STRENGTH.map((planet) => (
                <div
                  key={planet.planet}
                  className={`p-4 rounded-lg border transition ${getStatusBg(planet.strength)} border-line`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-ink">{planet.planet}</p>
                      <p className="text-xs text-ink-soft">{planet.tamil}</p>
                    </div>
                    <p className={`font-bold text-lg ${getStatusColor(planet.strength)}`}>{planet.strength}%</p>
                  </div>
                  <div className="h-1.5 bg-line/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${planet.strength >= 75 ? 'bg-green' : planet.strength >= 50 ? 'bg-orange' : 'bg-rose'}`}
                      style={{ width: `${planet.strength}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-ink-soft/60 mt-2 capitalize">{planet.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* House Strengths */}
          <div className="bg-surface border border-line rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-ink mb-4">🏠 House Strength (Bhava Bala)</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {HOUSE_STRENGTHS.map((house) => (
                <div key={house.house} className={`p-3 rounded-lg border ${getStatusBg(house.strength)}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-ink">{house.significance}</span>
                    <span className={`font-bold text-sm ${getStatusColor(house.strength)}`}>{house.strength}%</span>
                  </div>
                  <div className="text-xs text-ink-soft mb-2">House {house.house}</div>
                  <div className="h-1 bg-line/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${house.strength >= 75 ? 'bg-green' : house.strength >= 50 ? 'bg-orange' : 'bg-rose'}`}
                      style={{ width: `${house.strength}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <div className="bg-green/10 border border-green rounded-2xl p-6">
              <h3 className="font-semibold text-green mb-4 flex items-center gap-2">
                <span className="text-xl">✨</span> Key Strengths
              </h3>
              <ul className="space-y-2 text-sm text-ink-soft">
                <li className="flex gap-2">
                  <span className="text-green font-bold">•</span>
                  <span>Excellent Mercury strength indicates sharp intellect and communication skills</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green font-bold">•</span>
                  <span>Strong 9th house brings luck and success in higher pursuits</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green font-bold">•</span>
                  <span>Good Moon placement supports emotional stability and creativity</span>
                </li>
              </ul>
            </div>

            {/* Challenges */}
            <div className="bg-rose/10 border border-rose rounded-2xl p-6">
              <h3 className="font-semibold text-rose mb-4 flex items-center gap-2">
                <span className="text-xl">⚠️</span> Areas of Caution
              </h3>
              <ul className="space-y-2 text-sm text-ink-soft">
                <li className="flex gap-2">
                  <span className="text-rose font-bold">•</span>
                  <span>Weak Saturn requires discipline and delayed gratification in endeavors</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose font-bold">•</span>
                  <span>Weak 6th house suggests attention to health and legal matters</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose font-bold">•</span>
                  <span>Rahu/Ketu positions indicate karmic lessons to learn</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-saffron/10 border border-saffron rounded-2xl p-6">
            <h3 className="font-semibold text-saffron mb-4">📋 Quick Navigation</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <a href="/divisional-charts" className="p-3 bg-surface border border-line rounded-lg hover:border-saffron transition text-center text-sm font-medium text-ink">
                Divisional Charts
              </a>
              <a href="/yoga-detection" className="p-3 bg-surface border border-line rounded-lg hover:border-saffron transition text-center text-sm font-medium text-ink">
                Yoga Analysis
              </a>
              <a href="/house-analysis" className="p-3 bg-surface border border-line rounded-lg hover:border-saffron transition text-center text-sm font-medium text-ink">
                House Analysis
              </a>
              <a href="/dasha-timeline" className="p-3 bg-surface border border-line rounded-lg hover:border-saffron transition text-center text-sm font-medium text-ink">
                Dasha Timeline
              </a>
            </div>
          </div>
        </>
      )}

      {!loaded && !loading && (
        <div className="text-center py-12 text-ink-soft">
          <p className="text-sm">பலகை வெளிப்படுத்த மேலே பொத்தான் கிளிக் செய்யுங்கள்.</p>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          ஆஸ்திர பகுப்பாய்வு பலகை — அனைத்து முக்கிய தகவல்களை ஒரே பார்வையில் பெறுங்கள்.
          Professional astrology tool for complete chart analysis.
        </p>
      </footer>
    </main>
  );
}
