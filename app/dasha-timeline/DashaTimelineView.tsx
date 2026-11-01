'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSettings, toEngineOptions, toDashaOptions } from '@/src/ui/SettingsPanel';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { usePartyInput } from '@/src/ui/chartParty';
import { PageEyebrow } from '@/src/ui/PageEyebrow';
import { citeTa } from '@/src/sources/citeTa';
import { chainAt, localText, MAX_LEVELS } from '@/src/dasha/dashaDrill';
import { DASHA_LEVEL_TA, NAKSHATRA_TA } from '@/src/sources/tamilNames';
import { ABBR } from '@/src/worksheet/dashaList';
import { PLANET_COLOR, PLANET_TA } from '../worksheet/worksheetStyle';
import { computeDashaTimeline } from './actions';
import { DashaTree, dmyHm, spanText, type TreePeriod } from './DashaTree';

type Timeline = Awaited<ReturnType<typeof computeDashaTimeline>>;

const JD_UNIX_EPOCH = 2440587.5;

/** 'YYYY-MM-DDTHH:mm' (the browser's date-time field) as a Julian day, the time being the birth place's. */
function fieldToJd(value: string, offsetMinutes: number): number | null {
  const [date, time] = value.split('T');
  const [y, m, d] = (date ?? '').split('-').map(Number);
  const [h, mi] = (time ?? '00:00').split(':').map(Number);
  if (![y, m, d, h, mi].every(Number.isFinite)) return null;
  return (Date.UTC(y, m - 1, d, h, mi) - offsetMinutes * 60000) / 86400000 + JD_UNIX_EPOCH;
}

/** A Julian day as the date-time field's text, in the birth place's time. */
const jdToField = (jd: number, offsetMinutes: number) => localText(jd, offsetMinutes).replace(' ', 'T');

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
  const [data, setData] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The moment the running periods are read at: now, until a date is picked
  const [asOf, setAsOf] = useState<string>('');
  const [nowJd, setNowJd] = useState<number | null>(null);

  useEffect(() => { setNowJd(Date.now() / 86400000 + JD_UNIX_EPOCH); }, []);

  // Calculated as soon as the chart is known, and again when the settings' dasha year or balance method change
  useEffect(() => {
    if (!birthInput) { setData(null); return undefined; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeDashaTimeline(birthInput, toDashaOptions(settings))
      .then((r) => { if (!cancelled) setData(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setData(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [birthInput, settings.dashaYearDays, settings.dashaBalance]); // eslint-disable-line react-hooks/exhaustive-deps

  const offset = data?.utcOffsetMinutes ?? 330;
  const asOfJd = (asOf ? fieldToJd(asOf, offset) : null) ?? nowJd;
  const mahadashas: TreePeriod[] = data?.mahadashas ?? [];
  const chain = useMemo(
    () => (data && asOfJd != null ? chainAt(mahadashas, asOfJd, MAX_LEVELS) : []),
    [data, asOfJd], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const totalDays = mahadashas.reduce((sum, m) => sum + (m.endJd - m.startJd), 0) || 1;

  return (
    <main className="min-h-screen p-3 sm:p-6 max-w-5xl mx-auto">
      <header className="mb-4">
        <PageEyebrow fallback="Dasha Timeline" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-2xl sm:text-3xl font-bold text-ink">
          தசா புக்தி — ஐந்து நிலைகள்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          விம்சோத்தரி: தசை › புக்தி (அந்தர்தசை) › அந்தரம் › சூட்சமம் › பிராணன். ஒன்றைத் தொட்டால் அதற்குள் உள்ள அடுத்த நிலை திறக்கும்; ஒவ்வொன்றும் எந்தத் தேதி, நேரம் முதல் எந்தத் தேதி, நேரம் வரை என்று காட்டும்.
        </p>
      </header>

      <div className="mb-4">
        <PartyChooser party={party} setParty={setParty} loading={loading || partyLoading} />
      </div>

      {error && <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-4 text-sm text-rose">{error}</div>}

      {data && asOfJd != null && (
        <>
          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-surface px-3 py-2">
              <p className="text-[11px] font-semibold text-ink-soft">ஜன்ம நட்சத்திரம்</p>
              <p className="text-[15px] font-bold text-ink">{NAKSHATRA_TA[data.moonNakshatraIndex]}</p>
            </div>
            <div className="rounded-xl border border-line bg-surface px-3 py-2">
              <p className="text-[11px] font-semibold text-ink-soft">பிறந்த தசை</p>
              <p className="text-[15px] font-bold" style={{ color: PLANET_COLOR[ABBR[data.startingLord]] }}>{PLANET_TA[data.startingLord]}</p>
            </div>
            <div className="rounded-xl border border-line bg-surface px-3 py-2">
              <p className="text-[11px] font-semibold text-ink-soft">பிறப்பில் தசா இருப்பு</p>
              <p className="text-[15px] font-bold text-ink tabular-nums">{data.balance.years} ஆண்டு {data.balance.months} மாதம் {data.balance.days} நாள்</p>
            </div>
          </div>

          <section className="mb-4 rounded-2xl border border-line bg-surface p-3 sm:p-4 shadow-sm" aria-label="நடப்புக் காலங்கள்">
            <div className="mb-2 flex flex-wrap items-end gap-x-4 gap-y-2">
              <h2 className="font-[family-name:var(--font-tamil-serif)] text-base font-bold text-ink">
                {asOf ? 'அந்த நேரத்தில் நடக்கும் காலங்கள்' : 'இப்போது நடக்கும் காலங்கள்'}
              </h2>
              <label className="ml-auto flex items-center gap-2 text-xs text-ink-soft">
                <span>வேறு நேரம்</span>
                <input
                  type="datetime-local"
                  value={asOf || (nowJd != null ? jdToField(nowJd, offset) : '')}
                  onChange={(e) => setAsOf(e.target.value)}
                  className="rounded border border-line bg-surface px-2 py-1 text-xs text-ink tabular-nums"
                  aria-label="தசா காலங்களைப் பார்க்கும் தேதி, நேரம்"
                />
              </label>
              {asOf && <button type="button" className="text-xs text-saffron hover:underline" onClick={() => setAsOf('')}>இப்போது</button>}
            </div>
            <ol className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-5">
              {chain.map((p, i) => (
                <li key={i} className="min-w-0 rounded-xl border border-line bg-surface-2/40 px-2.5 py-1.5">
                  <p className="text-[10px] font-semibold text-ink-soft">{DASHA_LEVEL_TA[i]}</p>
                  <p className="text-sm font-bold" style={{ color: PLANET_COLOR[ABBR[p.lord]] }}>{PLANET_TA[p.lord]}</p>
                  <p className="text-[11px] leading-snug tabular-nums text-ink">{dmyHm(localText(p.startJd, offset))}</p>
                  <p className="text-[11px] leading-snug tabular-nums text-ink">→ {dmyHm(localText(p.endJd, offset))}</p>
                  <p className="text-[10px] text-ink-soft">{spanText(p.endJd - p.startJd)}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="mb-4 rounded-2xl border border-line bg-surface p-3 sm:p-4">
            <h2 className="mb-2 text-sm font-bold text-ink">வாழ்க்கை வரிசை — 120 ஆண்டு</h2>
            <div className="flex h-9 overflow-hidden rounded-lg bg-line/20">
              {mahadashas.map((m) => {
                const days = m.endJd - m.startJd;
                const widthPct = (days / totalDays) * 100;
                const here = m.startJd <= asOfJd && asOfJd < m.endJd;
                return (
                  <div
                    key={`${m.lord}-${m.startJd}`}
                    className="flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ width: `${widthPct}%`, backgroundColor: PLANET_COLOR[ABBR[m.lord]], opacity: here ? 1 : 0.6 }}
                    title={`${PLANET_TA[m.lord]} — ${dmyHm(localText(m.startJd, offset))} → ${dmyHm(localText(m.endJd, offset))}`}
                  >
                    {widthPct > 7 ? ABBR[m.lord] : ''}
                  </div>
                );
              })}
            </div>
          </div>

          <DashaTree mahadashas={mahadashas} nowJd={asOfJd} offset={offset} />
        </>
      )}

      {!data && !loading && !error && (
        <div className="py-10 text-center text-sm text-ink-soft">ஒரு ஜாதகத்தைத் தேர்ந்தெடுத்தால் தசா புக்தி காலங்கள் தெரியும்.</div>
      )}

      <footer className="mt-10 pt-4 border-t border-line text-[11px] text-ink-soft">
        {data && <p>{citeTa(data.source)}. தசை ஆண்டு {data.dashaYearDays} நாள்; இருப்பு {data.balanceMethod === 'time' ? 'நேரப்படி' : 'பாகைப்படி'} (அமைப்புகளில் மாற்றலாம்).</p>}
        <p className="mt-1">
          ஒவ்வொரு காலமும் அடுத்த நிலைக்குள் ஒன்பது கிரகங்களுக்கும் பிரிக்கப்படுகிறது: தன் அதிபதியிலிருந்து தொடங்கி, ஒவ்வொருவரும் தம் ஆண்டுகளை 120-ல் பங்காக எடுப்பர் (BPHS அத். 51). பிறப்பில் நடக்கும் தசையின் புக்தி முதலியவை முழுத் தசையின் வரிசையில் இன்னும் நடக்காத பகுதி மட்டுமே; பிறப்புக்கு முன் முடிந்தவை இல்லை.
          நேரங்கள் பிறந்த ஊர் நேரத்தில், நிமிடம் வரை.
        </p>
      </footer>
    </main>
  );
}
