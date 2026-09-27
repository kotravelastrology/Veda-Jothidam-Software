'use client';

import { useEffect, useState } from 'react';
import { useSettings, toEngineOptions } from '@/src/ui/SettingsPanel';
import { useActiveBirthInput } from '@/src/workspace/useActiveBirthInput';
import { detectYogas } from './actions';

interface Formation {
  key: string;
  name: string;
  category: string;
  nature: 'benefic' | 'malefic';
  formationRule: string;
  effects: string;
  citation: string;
  /** Only where the calculator itself produces a graded severity. */
  severityLabel: string | null;
  severityScore: number | null;
  remedies: string | null;
  cancelled: boolean;
}

const CATEGORIES: Array<{
  field: string;
  listKey: 'yogas' | 'doshas';
  label: string;
  nature: 'benefic' | 'malefic';
}> = [
  { field: 'rajaYogas', listKey: 'yogas', label: 'ராஜ யோகங்கள் (Raja Yogas)', nature: 'benefic' },
  { field: 'nabhasaYogas', listKey: 'yogas', label: 'நாபச யோகங்கள் (Nabhasa)', nature: 'benefic' },
  { field: 'lunarSolarYogas', listKey: 'yogas', label: 'சந்திர / சூரிய யோகங்கள்', nature: 'benefic' },
  { field: 'wealthYogas', listKey: 'yogas', label: 'தன யோகங்கள் (Wealth)', nature: 'benefic' },
  { field: 'edgeCaseYogas', listKey: 'yogas', label: 'சிறப்பு யோகங்கள் (Special)', nature: 'benefic' },
  { field: 'doshas', listKey: 'doshas', label: 'தோஷங்கள் (Doshas)', nature: 'malefic' },
];

const MALEFIC_YOGA_KEYS = ['KEMADRUMA', 'ASHUBHA', 'DARIDRA', 'DURYOGA', 'ALPA'];

function citationOf(raw: any): string {
  if (raw.verse) return String(raw.verse).startsWith('BPHS') ? raw.verse : `BPHS ${raw.verse}`;
  if (raw.chapter && raw.verses) return `BPHS Ch.${raw.chapter} v.${raw.verses}`;
  if (raw.chapter) return `BPHS Ch.${raw.chapter}`;
  return raw.source?.convention ?? '';
}

function normalize(raw: any, category: string, defaultNature: 'benefic' | 'malefic'): Formation {
  const key = raw.yogaKey || raw.doshaKey || raw.id || raw.name;
  const severity = raw.severity;
  const graded = severity && typeof severity === 'object';
  const nature: 'benefic' | 'malefic' =
    defaultNature === 'malefic' || MALEFIC_YOGA_KEYS.some(m => String(key).includes(m))
      ? 'malefic'
      : 'benefic';

  return {
    key: String(key),
    name: raw.name,
    category,
    nature,
    formationRule: raw.formation_rule || raw.formation || '',
    effects: raw.effects || '',
    citation: citationOf(raw),
    severityLabel: graded ? severity.rating : (typeof severity === 'string' ? severity : null),
    severityScore: graded && typeof severity.score === 'number' ? severity.score : null,
    remedies: raw.remedies || null,
    cancelled: raw.cancelled === true,
  };
}

function flatten(result: any): Formation[] {
  const out: Formation[] = [];
  for (const { field, listKey, label, nature } of CATEGORIES) {
    const list = result?.[field]?.[listKey];
    if (!Array.isArray(list)) continue;
    for (const raw of list) out.push(normalize(raw, label, nature));
  }
  return out;
}

export default function YogaDetectionView() {
  const [birthData, setBirthData] = useState({
    date: '1990-05-15',
    time: '10:30:00',
    latitude: '13.0827',
    longitude: '80.2707',
  });
  const { settings } = useSettings();
  const { profile, input: profileInput, fields: profileFields } = useActiveBirthInput();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [lagnaRasi, setLagnaRasi] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When the workspace has a profile open, fill this page's form from it
  // and compute straight away, so the details are not re-entered. The
  // stored input is passed through rather than re-derived from the form,
  // which would drop the ayanamsha the profile was saved with.
  useEffect(() => {
    if (!profileFields || !profileInput) return;
    setBirthData(profileFields);
    detect(profileInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileFields, profileInput]);

  const detect = async (override?: any) => {
    setLoading(true);
    setError(null);
    try {
      const [year, month, day] = birthData.date.split('-').map(Number);
      const timeParts = birthData.time.split(':').map(Number);


      const result = await detectYogas(override ?? {
        name: '',
        gender: 'male',
        year, month, day,
        hour: timeParts[0],
        minute: timeParts[1] || 0,
        ianaTimeZone: 'Asia/Kolkata',
        utcOffsetMinutes: 330,
        latitude: parseFloat(birthData.latitude),
        longitude: parseFloat(birthData.longitude),
        placeName: '',
        ...toEngineOptions(settings),
      });

      setFormations(flatten(result));
      setLagnaRasi(result.lagnaRasi || '');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const beneficCount = formations.filter(f => f.nature === 'benefic').length;
  const maleficCount = formations.filter(f => f.nature === 'malefic').length;
  const presentCategories = CATEGORIES
    .map(c => c.label)
    .filter(label => formations.some(f => f.category === label));

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Yoga Detection
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          யோக பகுப்பாய்வு (Yoga & Dosha)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Swiss Ephemeris கணக்கீடு — BPHS விதிகளின்படி அமைந்த யோக/தோஷ சேர்க்கைகள் மட்டும்.
          {lagnaRasi && <> லக்னம்: <strong>{lagnaRasi}</strong></>}
        </p>
      </header>

      {profile && (
        <div className="bg-saffron/10 border border-saffron/40 rounded-lg px-4 py-2 mb-4 text-xs text-ink-soft">
          <strong className="text-ink">{profile.name}</strong> (v{profile.revision}) இன் விவரங்கள்
          தானாக நிரப்பப்பட்டுள்ளன. கீழே மாற்றினால் அந்த ஒரு கணக்கீட்டுக்கு மட்டும் பொருந்தும்.
        </div>
      )}

      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த தேதி</span>
            <input type="date" value={birthData.date}
              onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded" />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">பிறந்த நேரம்</span>
            <input type="time" step="1" value={birthData.time}
              onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded" />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">அட்சரேகை</span>
            <input type="number" step="0.0001" value={birthData.latitude}
              onChange={(e) => setBirthData({ ...birthData, latitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded" />
          </label>
          <label>
            <span className="block text-sm font-medium text-ink-soft mb-2">தீர்க்கரேகை</span>
            <input type="number" step="0.0001" value={birthData.longitude}
              onChange={(e) => setBirthData({ ...birthData, longitude: e.target.value })}
              className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded" />
          </label>
        </div>
        <button onClick={detect} disabled={loading}
          className="w-full px-4 py-2 bg-saffron text-ink rounded font-medium disabled:opacity-50 hover:bg-saffron/90">
          {loading ? 'Swiss Ephemeris பகுப்பாய்வு…' : 'யோக பகுப்பாய்வு'}
        </button>
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">{error}</div>
      )}

      {formations.length > 0 && (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-green/10 border border-green rounded-lg p-4">
              <p className="text-xs font-semibold text-green uppercase mb-1">சுப சேர்க்கை</p>
              <p className="text-2xl font-bold text-green tabular-nums">{beneficCount}</p>
            </div>
            <div className="bg-rose/10 border border-rose rounded-lg p-4">
              <p className="text-xs font-semibold text-rose uppercase mb-1">அசுப / தோஷம்</p>
              <p className="text-2xl font-bold text-rose tabular-nums">{maleficCount}</p>
            </div>
            <div className="bg-info/10 border border-info rounded-lg p-4">
              <p className="text-xs font-semibold text-info uppercase mb-1">மொத்தம்</p>
              <p className="text-2xl font-bold text-info tabular-nums">{formations.length}</p>
            </div>
          </div>

          {presentCategories.map(category => {
            const items = formations.filter(f => f.category === category);
            return (
              <section key={category} className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-ink">
                  {category}
                  <span className="text-sm font-normal text-ink-soft">({items.length})</span>
                </h2>
                <div className="grid gap-3">
                  {items.map(item => (
                    <article key={`${category}-${item.key}`} className={`border rounded-lg p-4 ${
                      item.nature === 'malefic' ? 'bg-rose/5 border-rose/30' : 'bg-green/5 border-green/30'
                    }`}>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-ink">{item.name}</h3>
                          {item.citation && (
                            <p className="font-mono text-xs text-ink-soft mt-0.5">{item.citation}</p>
                          )}
                        </div>
                        <div className="text-right whitespace-nowrap">
                          {item.severityScore !== null && (
                            <div className={`text-lg font-bold tabular-nums ${
                              item.nature === 'malefic' ? 'text-rose' : 'text-green'
                            }`}>
                              {item.severityScore.toFixed(1)}
                            </div>
                          )}
                          {item.severityLabel && (
                            <div className="text-xs font-semibold uppercase text-ink-soft">{item.severityLabel}</div>
                          )}
                          {item.cancelled && (
                            <div className="text-xs font-semibold text-ink-soft">CANCELLED</div>
                          )}
                        </div>
                      </div>
                      {item.effects && <p className="text-sm text-ink-soft mb-2">{item.effects}</p>}
                      {item.formationRule && (
                        <p className="text-xs text-ink-soft/70 border-t border-line/20 pt-2">
                          <span className="font-semibold uppercase">அமைவு விதி: </span>{item.formationRule}
                        </p>
                      )}
                      {item.remedies && (
                        <p className="text-xs text-ink-soft/70 mt-1">
                          <span className="font-semibold uppercase">பரிகாரம்: </span>{item.remedies}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}

      {formations.length === 0 && !loading && (
        <div className="text-center py-12 text-ink-soft">
          <p className="text-sm">யோக பகுப்பாய்வு செய்ய மேலே பொத்தான் கிளிக் செய்யுங்கள்.</p>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          ஒவ்வொரு சேர்க்கையும் BPHS விதியின்படி அமைந்ததா என்பதை மட்டும் சரிபார்க்கிறது;
          கணக்கிடப்படாத வலிமை எண்கள் காட்டப்படுவதில்லை.
        </p>
      </footer>
    </main>
  );
}
