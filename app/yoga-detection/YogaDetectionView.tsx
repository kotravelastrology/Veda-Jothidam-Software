'use client';

import { useState } from 'react';

interface Yoga {
  name: string;
  tamil: string;
  type: 'benefic' | 'malefic' | 'neutral';
  strength: number; // 0-100
  description: string;
  condition: string;
}

const YOGAS: Yoga[] = [
  {
    name: 'Raja Yoga',
    tamil: 'ராஜ யோகம்',
    type: 'benefic',
    strength: 85,
    description: 'Fortune, power, and leadership ability',
    condition: 'Planets in Kendra and Trikona houses with good strength',
  },
  {
    name: 'Lakshmi Yoga',
    tamil: 'லக்ஷ்மி யோகம்',
    type: 'benefic',
    strength: 78,
    description: 'Wealth and prosperity',
    condition: 'Jupiter in angle houses, strong and unaspected by malefics',
  },
  {
    name: 'Kuja Dosha',
    tamil: 'குஜ தோஷம்',
    type: 'malefic',
    strength: 45,
    description: 'Mars affliction affecting relationships',
    condition: 'Mars in 1, 4, 7, 8, or 12th house',
  },
  {
    name: 'Panchamahapurusha Yoga',
    tamil: 'பஞ்ச மஹாபுருஷ யோகம்',
    type: 'benefic',
    strength: 72,
    description: 'Five great personalities yoga',
    condition: 'Venus, Mercury, Jupiter, Saturn, or Mars in angle or triangle houses',
  },
  {
    name: 'Neecha Bhanga Yoga',
    tamil: 'நீச பங்க யோகம்',
    type: 'benefic',
    strength: 65,
    description: 'Cancellation of debilitation',
    condition: 'Debilitated planet aspected by its dispositor or in Kendra',
  },
  {
    name: 'Dhana Yoga',
    tamil: 'தன யோகம்',
    type: 'benefic',
    strength: 70,
    description: 'Acquisition of wealth',
    condition: 'Benefic planets in 2nd, 5th, 9th, or 11th houses',
  },
  {
    name: 'Kesari Yoga',
    tamil: 'கேசரி யோகம்',
    type: 'benefic',
    strength: 60,
    description: 'Lion-like courage and strength',
    condition: 'Jupiter in angle/trine from Moon',
  },
  {
    name: 'Gaja Kesari Yoga',
    tamil: 'கஜ கேசரி யோகம்',
    type: 'benefic',
    strength: 80,
    description: 'Elephant and lion combined - supreme strength',
    condition: 'Jupiter in angle/trine with strong Moon',
  },
];

export default function YogaDetectionView() {
  const [birthData, setBirthData] = useState({
    date: '1990-05-15',
    time: '10:30:00',
    latitude: '13.0827',
    longitude: '80.2707',
  });
  const [yogas, setYogas] = useState<Yoga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/charts/yogas/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: birthData.date,
          time: birthData.time,
          latitude: parseFloat(birthData.latitude),
          longitude: parseFloat(birthData.longitude),
        }),
      });

      if (!response.ok) throw new Error('Failed to detect yogas');

      const result = await response.json();
      setYogas(result.yogas || YOGAS);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const beneficYogasCount = yogas.filter(y => y.type === 'benefic').length;
  const maleficYogasCount = yogas.filter(y => y.type === 'malefic').length;
  const averageStrength = yogas.length > 0
    ? Math.round(yogas.reduce((sum, y) => sum + y.strength, 0) / yogas.length)
    : 0;

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Yoga Detection
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          யோக விশ్లేషణ (Yoga Analysis)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          ஜாதகத்தில் உள்ள சுபயோகம் மற்றும் பாപயோகம் பகுப்பாய்வு.
          Benefic and malefic yoga formations in your chart.
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
          onClick={detect}
          disabled={loading}
          className="w-full px-4 py-2 bg-saffron text-ink rounded font-medium disabled:opacity-50 hover:bg-saffron/90"
        >
          {loading ? 'பகுப்பாய்வு செய்கிறது…' : 'யோக பகுப்பாய்வு'}
        </button>
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">
          ⚠️ {error}
        </div>
      )}

      {yogas.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green/10 border border-green rounded-lg p-4">
              <p className="text-xs font-semibold text-green uppercase mb-1">சுபயோகம்</p>
              <p className="text-2xl font-bold text-green">{beneficYogasCount}</p>
              <p className="text-xs text-green/60 mt-1">Benefic Yogas</p>
            </div>
            <div className="bg-rose/10 border border-rose rounded-lg p-4">
              <p className="text-xs font-semibold text-rose uppercase mb-1">பாபயோகம்</p>
              <p className="text-2xl font-bold text-rose">{maleficYogasCount}</p>
              <p className="text-xs text-rose/60 mt-1">Malefic Yogas</p>
            </div>
            <div className="bg-info/10 border border-info rounded-lg p-4">
              <p className="text-xs font-semibold text-info uppercase mb-1">சராசரி பலம்</p>
              <p className="text-2xl font-bold text-info">{averageStrength}%</p>
              <p className="text-xs text-info/60 mt-1">Average Strength</p>
            </div>
          </div>

          {/* Benefic Yogas Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-green mb-4 flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-green rounded-full"></span>
              சுபயோகம் (Benefic Yogas)
            </h2>
            <div className="grid gap-3">
              {yogas
                .filter(y => y.type === 'benefic')
                .map((yoga) => (
                  <div key={yoga.name} className="bg-green/5 border border-green/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-ink">{yoga.name}</h3>
                        <p className="text-sm text-ink-soft">{yoga.tamil}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green">{yoga.strength}%</div>
                        <div className="h-1 w-24 bg-green/20 rounded-full mt-1">
                          <div
                            className="h-full bg-green rounded-full"
                            style={{ width: `${yoga.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-ink-soft mb-2">{yoga.description}</p>
                    <p className="text-xs text-ink-soft/60 border-t border-green/20 pt-2">
                      <span className="font-mono">📌</span> {yoga.condition}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Malefic Yogas Section */}
          {maleficYogasCount > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-rose mb-4 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-rose rounded-full"></span>
                பாபயோகம் (Malefic Yogas)
              </h2>
              <div className="grid gap-3">
                {yogas
                  .filter(y => y.type === 'malefic')
                  .map((yoga) => (
                    <div key={yoga.name} className="bg-rose/5 border border-rose/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-ink">{yoga.name}</h3>
                          <p className="text-sm text-ink-soft">{yoga.tamil}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-rose">{yoga.strength}%</div>
                          <div className="h-1 w-24 bg-rose/20 rounded-full mt-1">
                            <div
                              className="h-full bg-rose rounded-full"
                              style={{ width: `${yoga.strength}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-ink-soft mb-2">{yoga.description}</p>
                      <p className="text-xs text-ink-soft/60 border-t border-rose/20 pt-2">
                        <span className="font-mono">📌</span> {yoga.condition}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Interpretation Guide */}
          <div className="bg-info/10 border border-info rounded-lg p-4 mt-8">
            <h3 className="font-semibold text-info mb-2">📖 யோக விளக்கம்</h3>
            <ul className="text-sm text-ink-soft space-y-1 list-disc list-inside">
              <li>
                <strong>சுபயோகம்:</strong> Positive planetary combinations that enhance life areas
              </li>
              <li>
                <strong>பாபயோகம்:</strong> Challenging combinations requiring awareness and remedies
              </li>
              <li>
                <strong>பலம்:</strong> Strength percentage (0-100) indicates yoga intensity
              </li>
              <li>
                <strong>தீர்வை:</strong> Consult an astrologer for remedies to strengthen benefic yogas
              </li>
            </ul>
          </div>
        </>
      )}

      {yogas.length === 0 && !loading && (
        <div className="text-center py-12 text-ink-soft">
          <p className="text-sm">யோக பகுப்பாய்வு செய்ய மேலே 'யோக பகுப்பாய்வு' பொத்தான் கிளிக் செய்யுங்கள்.</p>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          யோகங்கள் — கிரகங்களின் சுபமான அல்லது பாபமான இணைப்பு. வாழ்க்கையின் பல்வேறு பகுதிகளை பாதிக்கும் சக்திமான கூட்டுப்பொதுவ
          சயோக நியమங்கள்.
        </p>
      </footer>
    </main>
  );
}
