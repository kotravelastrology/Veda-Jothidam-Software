'use client';

import { useState } from 'react';

interface House {
  number: number;
  tamil: string;
  name: string;
  strength: number; // 0-100
  ruler: string;
  planets: string[];
  significance: string;
  interpretation: string;
  color: 'green' | 'orange' | 'red';
}

const HOUSES: House[] = [
  {
    number: 1,
    tamil: '1ம் இடம்',
    name: 'House of Self',
    strength: 82,
    ruler: 'Mars',
    planets: ['Sun', 'Mercury'],
    significance: 'Personality, appearance, health, life span',
    interpretation: 'Strong 1st house indicates good health, strong personality, leadership qualities, and overall life vitality.',
    color: 'green',
  },
  {
    number: 2,
    tamil: '2ம் இடம்',
    name: 'House of Wealth',
    strength: 68,
    ruler: 'Venus',
    planets: ['Jupiter'],
    significance: 'Money, wealth, family, speech, food',
    interpretation: 'Moderate 2nd house strength suggests reasonable financial status but requires prudent management for wealth growth.',
    color: 'orange',
  },
  {
    number: 3,
    tamil: '3ம் இடம்',
    name: 'House of Communication',
    strength: 75,
    ruler: 'Mercury',
    planets: ['Mercury', 'Venus'],
    significance: 'Communication, writing, siblings, courage, short journeys',
    interpretation: 'Good 3rd house strength indicates effective communication skills, close sibling relationships, and creative abilities.',
    color: 'green',
  },
  {
    number: 4,
    tamil: '4ம் இடம்',
    name: 'House of Home',
    strength: 55,
    ruler: 'Moon',
    planets: [],
    significance: 'Home, property, mother, vehicles, happiness, education',
    interpretation: 'Weak 4th house may indicate challenges with property, family relationships, or emotional security. Care needed.',
    color: 'red',
  },
  {
    number: 5,
    tamil: '5ம் இடம்',
    name: 'House of Creativity',
    strength: 78,
    ruler: 'Sun',
    planets: ['Sun', 'Jupiter'],
    significance: 'Children, creativity, education, intelligence, romance, speculation',
    interpretation: 'Strong 5th house indicates good intellect, creative abilities, fortunate in children matters, and educational success.',
    color: 'green',
  },
  {
    number: 6,
    tamil: '6ம் இடம்',
    name: 'House of Health',
    strength: 42,
    ruler: 'Mercury',
    planets: ['Mars'],
    significance: 'Health, enemies, debts, obstacles, pets, diseases',
    interpretation: 'Weak 6th house requires attention to health matters and suggests need for caution in legal disputes.',
    color: 'red',
  },
  {
    number: 7,
    tamil: '7ம் இடம்',
    name: 'House of Partnership',
    strength: 71,
    ruler: 'Venus',
    planets: ['Venus'],
    significance: 'Marriage, spouse, relationships, business partnerships, public relations',
    interpretation: 'Moderate 7th house strength suggests satisfactory partnership prospects but may need effort in relationships.',
    color: 'orange',
  },
  {
    number: 8,
    tamil: '8ம் இடம்',
    name: 'House of Transformation',
    strength: 38,
    ruler: 'Mars',
    planets: [],
    significance: 'Longevity, inheritance, occult, mysteries, transformation, hidden matters',
    interpretation: 'Weak 8th house indicates shorter lifespan indicators or limited inheritance benefits. Focus on health.',
    color: 'red',
  },
  {
    number: 9,
    tamil: '9ம் இடம்',
    name: 'House of Fortune',
    strength: 85,
    ruler: 'Jupiter',
    planets: ['Jupiter'],
    significance: 'Luck, fortune, father, travel, higher education, spirituality, religion',
    interpretation: 'Very strong 9th house indicates excellent fortune, good karma, success in higher pursuits, and paternal blessings.',
    color: 'green',
  },
  {
    number: 10,
    tamil: '10ம் இடம்',
    name: 'House of Career',
    strength: 79,
    ruler: 'Saturn',
    planets: ['Saturn'],
    significance: 'Career, profession, public image, reputation, social status, government',
    interpretation: 'Strong 10th house ensures good career growth, professional success, and respectable social position.',
    color: 'green',
  },
  {
    number: 11,
    tamil: '11ம் இடம்',
    name: 'House of Gains',
    strength: 73,
    ruler: 'Saturn',
    planets: ['Mercury'],
    significance: 'Income, gains, friendships, wishes, large group circles, fulfillment',
    interpretation: 'Good 11th house strength brings consistent income, large friend circles, and fulfillment of aspirations.',
    color: 'green',
  },
  {
    number: 12,
    tamil: '12ம் இடம்',
    name: 'House of Loss',
    strength: 48,
    ruler: 'Jupiter',
    planets: [],
    significance: 'Expenditure, foreign travel, spirituality, losses, isolation, moksha',
    interpretation: 'Moderate 12th house requires attention to expenses but can indicate spiritual inclinations and foreign connections.',
    color: 'orange',
  },
];

export default function HouseAnalysisView() {
  const [birthData, setBirthData] = useState({
    date: '1990-05-15',
    time: '10:30:00',
    latitude: '13.0827',
    longitude: '80.2707',
  });
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/charts/bhava-bala/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: birthData.date,
          time: birthData.time,
          latitude: parseFloat(birthData.latitude),
          longitude: parseFloat(birthData.longitude),
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze houses');

      const result = await response.json();
      setHouses(result.houses || HOUSES);
      setSelectedHouse(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const totalStrength = houses.length > 0
    ? Math.round(houses.reduce((sum, h) => sum + h.strength, 0) / houses.length)
    : 0;

  const strongHouses = houses.filter(h => h.strength >= 75).length;
  const weakHouses = houses.filter(h => h.strength < 50).length;

  const selectedHouseData = selectedHouse ? houses.find(h => h.number === selectedHouse) : null;

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          House Analysis
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          பாவ பலம் (Bhava Bala)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          வீட்டின் பலம் மற்றும் விளக்கம். Analysis of all 12 houses with their strength and significance.
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
            <span className="block text-sm font-medium text-ink-soft mb-2">அட்சரேகை</span>
            <input
              type="number"
              step="0.0001"
              value={birthData.latitude}
              onChange={(e) => setBirthData({ ...birthData, latitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">தீர்க்கரேகை</span>
            <input
              type="number"
              step="0.0001"
              value={birthData.longitude}
              onChange={(e) => setBirthData({ ...birthData, longitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
            />
          </label>
        </div>
        <button
          onClick={analyze}
          disabled={loading}
          className="w-full px-4 py-2 bg-saffron text-ink rounded font-medium disabled:opacity-50 hover:bg-saffron/90"
        >
          {loading ? 'பகுப்பாய்வு செய்கிறது…' : 'பாவ பலம் பகுப்பாய்வு'}
        </button>
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">
          ⚠️ {error}
        </div>
      )}

      {houses.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-info/10 border border-info rounded-lg p-4">
              <p className="text-xs font-semibold text-info uppercase mb-1">மொத்த பலம்</p>
              <p className="text-2xl font-bold text-info">{totalStrength}%</p>
              <p className="text-xs text-info/60 mt-1">Average Strength</p>
            </div>
            <div className="bg-green/10 border border-green rounded-lg p-4">
              <p className="text-xs font-semibold text-green uppercase mb-1">வலிமையான வீடுகள்</p>
              <p className="text-2xl font-bold text-green">{strongHouses}</p>
              <p className="text-xs text-green/60 mt-1">Strong Houses (75%+)</p>
            </div>
            <div className="bg-rose/10 border border-rose rounded-lg p-4">
              <p className="text-xs font-semibold text-rose uppercase mb-1">பலவீனமான வீடுகள்</p>
              <p className="text-2xl font-bold text-rose">{weakHouses}</p>
              <p className="text-xs text-rose/60 mt-1">Weak Houses (&lt;50%)</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* House Grid */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-ink mb-4">12 வீடுகளின் பலம்</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {houses.map((house) => (
                  <button
                    key={house.number}
                    onClick={() => setSelectedHouse(house.number)}
                    className={`p-3 rounded-lg border-2 transition text-center ${
                      selectedHouse === house.number
                        ? house.color === 'green'
                          ? 'border-green bg-green/10'
                          : house.color === 'orange'
                            ? 'border-orange bg-orange/10'
                            : 'border-rose bg-rose/10'
                        : 'border-line hover:border-line/60'
                    }`}
                  >
                    <div className="text-xs font-semibold text-ink-soft mb-1">{house.tamil}</div>
                    <div className="text-sm font-bold text-ink mb-1">{house.number}</div>
                    <div
                      className={`text-xs font-semibold ${
                        house.color === 'green'
                          ? 'text-green'
                          : house.color === 'orange'
                            ? 'text-orange'
                            : 'text-rose'
                      }`}
                    >
                      {house.strength}%
                    </div>
                  </button>
                ))}
              </div>

              {/* House Details Grid */}
              <div className="mt-6 grid gap-4">
                {houses.map((house) => (
                  <div
                    key={house.number}
                    className={`p-4 rounded-lg border transition ${
                      house.color === 'green'
                        ? 'bg-green/5 border-green/30'
                        : house.color === 'orange'
                          ? 'bg-orange/5 border-orange/30'
                          : 'bg-rose/5 border-rose/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-semibold text-ink">{house.name}</div>
                        <div className="text-xs text-ink-soft">{house.tamil}</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            house.color === 'green'
                              ? 'text-green'
                              : house.color === 'orange'
                                ? 'text-orange'
                                : 'text-rose'
                          }`}
                        >
                          {house.strength}%
                        </div>
                        <div className="h-1 w-20 bg-line rounded-full mt-1">
                          <div
                            className={`h-full rounded-full ${
                              house.color === 'green'
                                ? 'bg-green'
                                : house.color === 'orange'
                                  ? 'bg-orange'
                                  : 'bg-rose'
                            }`}
                            style={{ width: `${house.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-ink-soft mb-2">{house.significance}</p>
                    {house.planets.length > 0 && (
                      <p className="text-xs text-ink-soft/60">
                        <span className="font-mono">🪐</span> Planets: {house.planets.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Side Panel - Selected House Detail */}
            {selectedHouseData && (
              <div className="bg-surface border border-line rounded-2xl p-6 h-fit sticky top-6">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  {selectedHouseData.tamil}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase mb-1">House Name</p>
                    <p className="text-sm font-medium text-ink">{selectedHouseData.name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase mb-1">Strength</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="h-2 bg-line rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              selectedHouseData.color === 'green'
                                ? 'bg-green'
                                : selectedHouseData.color === 'orange'
                                  ? 'bg-orange'
                                  : 'bg-rose'
                            }`}
                            style={{ width: `${selectedHouseData.strength}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-ink w-10 text-right">
                        {selectedHouseData.strength}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase mb-1">Ruler</p>
                    <p className="text-sm font-medium text-ink">{selectedHouseData.ruler}</p>
                  </div>

                  {selectedHouseData.planets.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-ink-soft uppercase mb-1">Planets</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedHouseData.planets.map((planet) => (
                          <span
                            key={planet}
                            className="px-2 py-1 bg-info/10 border border-info rounded text-xs font-medium text-info"
                          >
                            {planet}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-line pt-4">
                    <p className="text-xs font-semibold text-ink-soft uppercase mb-2">Significance</p>
                    <p className="text-sm text-ink-soft">{selectedHouseData.significance}</p>
                  </div>

                  <div className="bg-info/5 border border-info/30 rounded p-3">
                    <p className="text-xs font-semibold text-info uppercase mb-2">Interpretation</p>
                    <p className="text-xs text-ink-soft leading-relaxed">{selectedHouseData.interpretation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Strength Guide */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="bg-green/10 border border-green rounded-lg p-4">
              <p className="text-sm font-semibold text-green mb-1">💪 Strong (75%+)</p>
              <p className="text-xs text-ink-soft">
                Positive outcomes, no major obstacles, favorable results expected
              </p>
            </div>
            <div className="bg-orange/10 border border-orange rounded-lg p-4">
              <p className="text-sm font-semibold text-orange mb-1">⚖️ Moderate (50-74%)</p>
              <p className="text-xs text-ink-soft">
                Mixed results possible, requires careful planning and effort
              </p>
            </div>
            <div className="bg-rose/10 border border-rose rounded-lg p-4">
              <p className="text-sm font-semibold text-rose mb-1">⚠️ Weak (&lt;50%)</p>
              <p className="text-xs text-ink-soft">
                Challenges ahead, need remedies or caution in this area
              </p>
            </div>
          </div>
        </>
      )}

      {houses.length === 0 && !loading && (
        <div className="text-center py-12 text-ink-soft">
          <p className="text-sm">பாவ பலம் பகுப்பாய்வு செய்ய மேலே பொத்தான் கிளிக் செய்யுங்கள்.</p>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          பாவ பலம் — வீடுகளின் பலம் நிர்ணயிக்கும் அறிய நூல்கள் ஜோதிடப் பண்ணுறுப்பு பகுப்பாய்வுக்கு அவசியமான நிகழ்வு.
        </p>
      </footer>
    </main>
  );
}
