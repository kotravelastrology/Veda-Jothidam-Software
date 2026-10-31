'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSettings, toEngineOptions } from '@/src/ui/SettingsPanel';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { usePartyInput } from '@/src/ui/chartParty';
import { analyzeHouses } from './actions';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

const HOUSE_NAMES = [
  'Tanu (self, body)', 'Dhana (wealth, speech)', 'Sahaja (siblings, courage)',
  'Matru (mother, home)', 'Putra (children, intellect)', 'Roga (disease, enemies)',
  'Kalatra (spouse, partnership)', 'Ayu (longevity, transformation)', 'Bhagya (fortune, father)',
  'Karma (profession, status)', 'Labha (gains, friends)', 'Vyaya (loss, expenditure)',
];
const HOUSE_TAMIL = [
  '1ம் பாவம்', '2ம் பாவம்', '3ம் பாவம்', '4ம் பாவம்', '5ம் பாவம்', '6ம் பாவம்',
  '7ம் பாவம்', '8ம் பாவம்', '9ம் பாவம்', '10ம் பாவம்', '11ம் பாவம்', '12ம் பாவம்',
];

interface PlanetDetail {
  planet: string;
  rasi: string;
  degreeInSign: number;
}

interface House {
  number: number;
  rasi: string;
  sarvaBindus: number;
  planets: string[];
  planetDetails: PlanetDetail[];
}

export default function HouseAnalysisView() {
  const { settings } = useSettings();
  // The chart: the open chart by itself, or one chosen here (src/ui/PartyChooser.tsx); a hand-entered chart takes the settings'
  // ayanamsha, house system and nodes, a saved profile the ones it was saved with.
  const [party, setParty] = useState<Party | null>(null);
  const { input: partyInput, loading: partyLoading } = usePartyInput(party);
  const birthInput = useMemo(
    () => (partyInput && party?.kind === 'form' ? { ...partyInput, ...toEngineOptions(settings) } : partyInput),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [partyInput, party?.kind, settings.ayanamsha, settings.houseSystem, settings.nodeType],
  );
  const [houses, setHouses] = useState<House[]>([]);
  const [total, setTotal] = useState(0);
  const [lagnaRasi, setLagnaRasi] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  // Calculated as soon as the chart is known
  useEffect(() => {
    if (!birthInput) return;
    analyze(birthInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthInput]);

  const analyze = async (override: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeHouses(override);

      setHouses(result.houses);
      setTotal(result.ashtakavarga.total);
      setLagnaRasi(result.lagnaRasi);
      setSelectedHouse(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  // The classical Sarvashtakavarga grand total is 337 bindus over 12 rasis, so
  // the per-rasi average is the only non-invented line to read one house's
  // bindu count against — hence no percentage scale here.
  const average = houses.length > 0 ? total / houses.length : 0;
  const aboveAverage = houses.filter(h => h.sarvaBindus > average).length;
  const belowAverage = houses.filter(h => h.sarvaBindus < average).length;
  const selected = selectedHouse ? houses.find(h => h.number === selectedHouse) : null;

  const toneOf = (bindus: number) => {
    const delta = bindus - average;
    if (delta >= 2) return { text: 'text-green', bar: 'bg-green', bg: 'bg-green/5', border: 'border-green/30', selected: 'border-green bg-green/10' };
    if (delta <= -2) return { text: 'text-rose', bar: 'bg-rose', bg: 'bg-rose/5', border: 'border-rose/30', selected: 'border-rose bg-rose/10' };
    return { text: 'text-orange', bar: 'bg-orange', bg: 'bg-orange/5', border: 'border-orange/30', selected: 'border-orange bg-orange/10' };
  };
  const deltaLabel = (bindus: number) => {
    const delta = bindus - average;
    return `${delta > 0 ? '+' : ''}${delta.toFixed(1)} vs சராசரி`;
  };

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <PageEyebrow fallback="House Analysis" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          பாவ பலம் (Sarvashtakavarga)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Swiss Ephemeris + Sarvashtakavarga பிந்துகள் — 12 பாவங்களின் ஒப்பீட்டு வலிமை.
          {lagnaRasi && <> லக்னம்: <strong>{lagnaRasi}</strong></>}
        </p>
      </header>

      <div className="mb-6">
        <PartyChooser party={party} setParty={setParty} loading={loading || partyLoading} />
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">{error}</div>
      )}

      {houses.length > 0 && (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-info/10 border border-info rounded-lg p-4">
              <p className="text-xs font-semibold text-info uppercase mb-1">மொத்த பிந்து</p>
              <p className="text-2xl font-bold text-info tabular-nums">{total}</p>
              <p className="text-xs text-info/60 mt-1">சராசரி {average.toFixed(1)} / பாவம்</p>
            </div>
            <div className="bg-green/10 border border-green rounded-lg p-4">
              <p className="text-xs font-semibold text-green uppercase mb-1">சராசரிக்கு மேல்</p>
              <p className="text-2xl font-bold text-green tabular-nums">{aboveAverage}</p>
              <p className="text-xs text-green/60 mt-1">பாவங்கள்</p>
            </div>
            <div className="bg-rose/10 border border-rose rounded-lg p-4">
              <p className="text-xs font-semibold text-rose uppercase mb-1">சராசரிக்கு கீழ்</p>
              <p className="text-2xl font-bold text-rose tabular-nums">{belowAverage}</p>
              <p className="text-xs text-rose/60 mt-1">பாவங்கள்</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-ink mb-4">Sarvashtakavarga பிந்துகள்</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {houses.map((house) => {
                  const tone = toneOf(house.sarvaBindus);
                  return (
                    <button key={house.number} onClick={() => setSelectedHouse(house.number)}
                      className={`p-3 rounded-lg border-2 transition text-center ${
                        selectedHouse === house.number ? tone.selected : 'border-line hover:border-line/60'
                      }`}>
                      <div className="text-xs font-semibold text-ink-soft mb-1">{HOUSE_TAMIL[house.number - 1]}</div>
                      <div className={`text-xl font-bold tabular-nums ${tone.text}`}>{house.sarvaBindus}</div>
                      <div className="text-xs text-ink-soft mt-1">{house.rasi}</div>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-3">
                {houses.map((house) => {
                  const tone = toneOf(house.sarvaBindus);
                  const barWidth = Math.min(100, (house.sarvaBindus / 56) * 100);
                  return (
                    <div key={house.number} className={`p-4 rounded-lg border ${tone.bg} ${tone.border}`}>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <div className="text-sm font-semibold text-ink">
                            {house.number}. {HOUSE_NAMES[house.number - 1]}
                          </div>
                          <div className="text-xs text-ink-soft">
                            {HOUSE_TAMIL[house.number - 1]} · {house.rasi}
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <div className={`text-lg font-bold tabular-nums ${tone.text}`}>{house.sarvaBindus}</div>
                          <div className="text-xs text-ink-soft">{deltaLabel(house.sarvaBindus)}</div>
                        </div>
                      </div>
                      <div className="h-2 bg-line/20 rounded-full overflow-hidden mb-2">
                        <div className={`h-full ${tone.bar}`} style={{ width: `${barWidth}%` }} />
                      </div>
                      {house.planetDetails.length > 0 && (
                        <p className="text-xs text-ink-soft">
                          {house.planetDetails.map(p => `${p.planet} ${p.degreeInSign.toFixed(1)}° ${p.rasi}`).join(' · ')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {selected && (
              <div className="bg-surface border border-line rounded-2xl p-6 h-fit sticky top-6">
                <h3 className="text-lg font-semibold text-ink mb-1">{HOUSE_TAMIL[selected.number - 1]}</h3>
                <p className="text-sm text-ink-soft mb-4">{HOUSE_NAMES[selected.number - 1]}</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase mb-1">ராசி</p>
                    <p className="text-sm font-medium text-ink">{selected.rasi}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase mb-1">Sarva பிந்து</p>
                    <p className="text-2xl font-bold text-ink tabular-nums">{selected.sarvaBindus}</p>
                    <p className="text-xs text-ink-soft">{deltaLabel(selected.sarvaBindus)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase mb-2">கிரகங்கள்</p>
                    {selected.planetDetails.length > 0 ? (
                      <ul className="space-y-1">
                        {selected.planetDetails.map(p => (
                          <li key={p.planet} className="text-sm text-ink flex justify-between gap-3">
                            <span>{p.planet}</span>
                            <span className="text-ink-soft tabular-nums">{p.degreeInSign.toFixed(2)}° {p.rasi}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-ink-soft">கிரகம் இல்லை</p>
                    )}
                  </div>
                </div>
              </div>
            )}
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
          Sarvashtakavarga பிந்துகள் — classical grand total 337 across 12 rasis; பாவ ஒப்பீடு
          அந்த சராசரியை அடிப்படையாகக் கொண்டது, கண்டுபிடிக்கப்பட்ட சதவீதம் அல்ல.
        </p>
      </footer>
    </main>
  );
}
