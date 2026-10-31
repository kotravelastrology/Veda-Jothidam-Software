'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSettings, toEngineOptions } from '@/src/ui/SettingsPanel';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { usePartyInput } from '@/src/ui/chartParty';
import { computeDashaTimeline } from './actions';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

interface Bhukti {
  planet: string;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  duration: number;
  status: 'past' | 'current' | 'future';
}

interface DashaPeriod {
  planet: string;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  duration: number;
  status: 'past' | 'current' | 'future';
  bhuktis: Bhukti[];
}

const PLANETS_DATA: Record<string, { tamil: string; color: string }> = {
  Sun: { tamil: 'சூரியன்', color: '#FF6B35' },
  Moon: { tamil: 'சந்திரன்', color: '#F7B801' },
  Mars: { tamil: 'செவ்வாய்', color: '#E63946' },
  Mercury: { tamil: 'புதன்', color: '#457B9D' },
  Jupiter: { tamil: 'குரு', color: '#F4A261' },
  Venus: { tamil: 'சுக்ரன்', color: '#2A9D8F' },
  Saturn: { tamil: 'சனி', color: '#8B7355' },
  Rahu: { tamil: 'ராகு', color: '#6A4C93' },
  Ketu: { tamil: 'கேது', color: '#9B5DE5' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthName = (m: number) => MONTHS[m - 1] ?? '';
const tamilOf = (p: string) => PLANETS_DATA[p]?.tamil ?? p;
const colorOf = (p: string) => PLANETS_DATA[p]?.color ?? '#999999';

export default function DashaTimelineView() {
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
  const [dashas, setDashas] = useState<DashaPeriod[]>([]);
  const [meta, setMeta] = useState<{
    moonNakshatra: string | null;
    moonNakshatraLord: string;
    balanceYearsAtBirth: number;
  } | null>(null);
  const [activeChain, setActiveChain] = useState<any[]>([]);
  const [asOf, setAsOf] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

  // Calculated as soon as the chart is known, and again for the replay date
  useEffect(() => {
    if (!birthInput) { setDashas([]); setMeta(null); setActiveChain([]); return; }
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthInput]);

  const calculate = async () => {
    if (!birthInput) return;
    setLoading(true);
    setError(null);
    try {
      const asOfMs = Date.parse(`${asOf}T12:00:00.000Z`);
      const result = await computeDashaTimeline(birthInput, Number.isFinite(asOfMs) ? asOfMs : undefined);

      setDashas(result.dashas);
      setActiveChain(result.activeChain || []);
      setMeta({
        moonNakshatra: result.moonNakshatra,
        moonNakshatraLord: result.moonNakshatraLord,
        balanceYearsAtBirth: result.balanceYearsAtBirth,
      });
      const current = result.dashas.find((d: DashaPeriod) => d.status === 'current');
      setExpandedPlanet(current ? current.planet : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const currentDasha = dashas.find(d => d.status === 'current');
  const currentBhukti = currentDasha?.bhuktis.find(b => b.status === 'current');
  const totalDuration = dashas.reduce((sum, d) => sum + d.duration, 0) || 1;

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <PageEyebrow fallback="Dasha Timeline" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          விம்சோத்தரி தசை (Vimshottari Dasha)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Swiss Ephemeris சந்திர நிலை அடிப்படையில் BPHS Ch.46/Ch.51 தசை–புக்தி கணக்கு.
        </p>
      </header>

      <div className="mb-6">
        <PartyChooser party={party} setParty={setParty} loading={loading || partyLoading} />
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">{error}</div>
      )}

      {dashas.length > 0 && (
        <>
          {meta && (
            <div className="bg-surface border border-line rounded-lg p-4 mb-6 grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-ink-soft uppercase mb-1">ஜன்ம நட்சத்திரம்</p>
                <p className="text-ink font-medium">{meta.moonNakshatra ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-soft uppercase mb-1">நட்சத்திர அதிபதி</p>
                <p className="text-ink font-medium">{meta.moonNakshatraLord} ({tamilOf(meta.moonNakshatraLord)})</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-soft uppercase mb-1">பிறப்பில் தசா சேஷம்</p>
                <p className="text-ink font-medium tabular-nums">{meta.balanceYearsAtBirth} ஆண்டு</p>
              </div>
            </div>
          )}

          <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-3">
              <label className="flex-1">
                <span className="block text-xs font-medium text-ink-soft mb-1">
                  எந்த தேதியில் என்ன நடந்தது (replay)
                </span>
                <input type="date" value={asOf}
                  onChange={(e) => setAsOf(e.target.value)}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm" />
              </label>
              <button onClick={() => calculate()} disabled={loading}
                className="px-4 py-2 bg-info/10 text-info rounded font-medium text-sm disabled:opacity-50">
                அந்த தேதிக்கு மீண்டும் காட்டு
              </button>
            </div>
            {activeChain.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeChain.map((c: any, i: number) => (
                  <span key={c.level} className="flex items-center gap-2">
                    {i > 0 && <span className="text-ink-soft">›</span>}
                    <span className="px-2 py-1 rounded bg-ink-soft/10 text-xs">
                      <span className="text-ink-soft">{c.level}</span>{' '}
                      <strong className="text-ink">{c.planet ?? c.lord}</strong>
                      <span className="block text-[10px] text-ink-soft tabular-nums">
                        {String(c.startLocal).slice(0, 10)} → {String(c.endLocal).slice(0, 10)}
                      </span>
                    </span>
                  </span>
                ))}
              </div>
            )}
            <p className="text-[11px] text-ink-soft mt-2">
              ஒரே தேதி எப்போதும் ஒரே முடிவைத் தரும் — கணக்கீடு கடிகாரத்தைப் படிப்பதில்லை.
            </p>
          </div>

          {currentDasha && (
            <div className="bg-info/10 border-2 border-info rounded-lg p-5 mb-6">
              <p className="text-xs font-semibold text-info uppercase mb-2">நடப்பு தசை / Current Period</p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-ink">
                    {currentDasha.planet} Dasha
                    {currentBhukti && <span className="text-lg font-semibold text-ink-soft"> → {currentBhukti.planet} Bhukti</span>}
                  </h2>
                  <p className="text-sm text-ink-soft mt-1">
                    {monthName(currentDasha.startMonth)} {currentDasha.startYear} – {monthName(currentDasha.endMonth)} {currentDasha.endYear}
                  </p>
                  {currentBhukti && (
                    <p className="text-xs text-ink-soft/70 mt-1">
                      Bhukti: {monthName(currentBhukti.startMonth)} {currentBhukti.startYear} – {monthName(currentBhukti.endMonth)} {currentBhukti.endYear}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-info tabular-nums">{currentDasha.duration}</p>
                  <p className="text-xs text-info/60 mt-1">years</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-surface border border-line rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-ink mb-4">120-Year Life Timeline</h2>
            <div className="relative h-12 bg-line/20 rounded-lg overflow-hidden mb-4">
              {dashas.map((dasha, index) => {
                const widthPct = (dasha.duration / totalDuration) * 100;
                const leftPct = (dashas.slice(0, index).reduce((s, d) => s + d.duration, 0) / totalDuration) * 100;
                return (
                  <div key={index} className="absolute h-full transition-all hover:opacity-90"
                    style={{
                      backgroundColor: colorOf(dasha.planet),
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      opacity: dasha.status === 'current' ? 1 : 0.65,
                    }}
                    title={`${dasha.planet} — ${dasha.duration} years (${dasha.startYear}–${dasha.endYear})`}>
                    {widthPct > 8 && (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{Math.round(dasha.duration)}y</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {dashas.map((dasha, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colorOf(dasha.planet) }} />
                  <span className="text-ink-soft">{dasha.planet} ({dasha.duration}y)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {dashas.map((dasha, index) => (
              <div key={index}
                className={`rounded-lg border-2 transition ${
                  dasha.status === 'current' ? 'bg-info/10 border-info'
                    : dasha.status === 'past' ? 'bg-ink-soft/5 border-line/40'
                    : 'bg-surface border-line'
                }`}>
                <button
                  onClick={() => setExpandedPlanet(expandedPlanet === dasha.planet ? null : dasha.planet)}
                  className="w-full p-4 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: colorOf(dasha.planet) }} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-ink">{dasha.planet} Dasha</h3>
                          <span className="text-xs font-medium text-ink-soft">({tamilOf(dasha.planet)})</span>
                          {dasha.status === 'current' && (
                            <span className="px-2 py-0.5 bg-info text-white rounded text-xs font-semibold">CURRENT</span>
                          )}
                        </div>
                        <p className="text-sm text-ink-soft mt-1">
                          {monthName(dasha.startMonth)} {dasha.startYear} – {monthName(dasha.endMonth)} {dasha.endYear}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-ink tabular-nums">{dasha.duration}</div>
                      <div className="text-xs text-ink-soft">years</div>
                    </div>
                  </div>
                </button>

                {expandedPlanet === dasha.planet && dasha.bhuktis.length > 0 && (
                  <div className="px-4 pb-4">
                    <p className="text-xs font-semibold text-ink-soft uppercase mb-2 pt-3 border-t border-line/20">
                      புக்தி / Antardasha ({dasha.bhuktis.length})
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-ink-soft uppercase">
                            <th className="text-left py-1 pr-3 font-semibold">Bhukti</th>
                            <th className="text-left py-1 pr-3 font-semibold">From</th>
                            <th className="text-left py-1 pr-3 font-semibold">To</th>
                            <th className="text-right py-1 font-semibold">Years</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dasha.bhuktis.map((b, bi) => (
                            <tr key={bi} className={`border-t border-line/20 ${
                              b.status === 'current' ? 'bg-info/10 font-semibold' : b.status === 'past' ? 'text-ink-soft/60' : ''
                            }`}>
                              <td className="py-1.5 pr-3">
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorOf(b.planet) }} />
                                  {b.planet}
                                  <span className="text-xs text-ink-soft">({tamilOf(b.planet)})</span>
                                </span>
                              </td>
                              <td className="py-1.5 pr-3 tabular-nums">{monthName(b.startMonth)} {b.startYear}</td>
                              <td className="py-1.5 pr-3 tabular-nums">{monthName(b.endMonth)} {b.endYear}</td>
                              <td className="py-1.5 text-right tabular-nums">{b.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {dashas.length === 0 && !loading && (
        <div className="text-center py-12 text-ink-soft">
          <p className="text-sm">தசை கால கணக்கிடு பொத்தான் கிளிக் செய்து உங்கள் தசா வரிசையைப் பாருங்கள்.</p>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          BPHS Ch.46 vv.12-16 (order, durations, balance-at-birth) மற்றும் Ch.51 vv.1-2 (புக்தி சூத்திரம்) —
          Swiss Ephemeris சந்திர நிலை அடிப்படையிலான தீர்மானமான கணக்கு.
        </p>
      </footer>
    </main>
  );
}
