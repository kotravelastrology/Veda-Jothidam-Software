'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { useSettings, toEngineOptions, toDashaOptions } from '@/src/ui/SettingsPanel';
import { useWorkspace } from '@/src/workspace/workspaceContext';
import { getChartLibrary, type SavedChart } from '@/src/portal/ChartLibraryManager';
import type { BirthFormInput } from '../report/actions';
import { computeWorksheet } from './actions';
import {
  CellFrame, ChartCell, DashaCell, GraphCell, PlanetsCell, StrengthCell,
  DEFAULT_CHOICES, type CellChoices, type CellId, type WorksheetData,
} from './cells';

/**
 * The birth-chart worksheet: the screen PL9 opens on when a chart is opened ("1. Birth chart I"). One calculation feeds six
 * cells: the Rasi chart with the house strengths, the Navamsha (or any other divisional chart), the Vimshottari list, the
 * planet table, the strength table and the Shad Bala graph. A cell's drop-down changes what it shows, and the choice is
 * remembered. The date the dasha list is read at moves with the arrows, or with a click on a dasha period.
 */

const CHOICES_KEY = 'kotravel-worksheet-cells';
const STASH_KEY = 'kotravel_current_chart';

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function todayText(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** A date 'YYYY-MM-DD' moved by whole months, the day held within the new month's length. */
function addMonths(date: string, delta: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const target = new Date(Date.UTC(y, m - 1 + delta, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${target.getUTCFullYear()}-${pad(target.getUTCMonth() + 1)}-${pad(Math.min(d, last))}`;
}

/** A chart saved in the browser (File > Save, Open) as the form input the calculation takes. */
function inputFromSaved(bd: SavedChart['birthData'], gender = 'male'): BirthFormInput {
  const [year, month, day] = bd.dateOfBirth.split('-').map(Number);
  const [hour, minute] = bd.timeOfBirth.split(':').map(Number);
  return {
    name: bd.name, gender, year, month, day, hour, minute: minute ?? 0, placeName: bd.place,
    latitude: Number(bd.latitude), longitude: Number(bd.longitude), utcOffsetMinutes: Number(bd.utcOffset), ianaTimeZone: 'Asia/Kolkata',
  };
}

function readStash(): { birthData?: SavedChart['birthData'] } & Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(STASH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function WorksheetView() {
  const params = useSearchParams();
  const { settings } = useSettings();
  const { activeProfile, restored } = useWorkspace();
  const [party, setParty] = useState<Party | null>(null);
  const [resolved, setResolved] = useState(false);
  const [data, setData] = useState<WorksheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asOf, setAsOf] = useState('');
  const [choices, setChoices] = useState<CellChoices>(DEFAULT_CHOICES);
  const [recent, setRecent] = useState<SavedChart[]>([]);

  // Remembered cell choices, and today's date (read on the client so it never differs from the server's render)
  useEffect(() => {
    setAsOf(todayText());
    try {
      const saved = JSON.parse(localStorage.getItem(CHOICES_KEY) || 'null');
      if (saved) setChoices({ ...DEFAULT_CHOICES, ...saved });
    } catch { /* storage unavailable or damaged: the defaults stand */ }
    try { setRecent(getChartLibrary().getAllCharts().slice(0, 6)); } catch { /* no saved charts */ }
  }, []);

  const choose = useCallback((cell: CellId, value: string) => {
    setChoices((prev) => {
      const next = { ...prev, [cell]: value };
      try { localStorage.setItem(CHOICES_KEY, JSON.stringify(next)); } catch { /* not saved, still applied */ }
      return next;
    });
  }, []);

  // Whose chart: a chart opened from the menu (?load=), the workspace's active profile, or the last chart worked on.
  const loadId = params.get('load');
  const isNew = params.get('new') === '1';
  useEffect(() => {
    if (resolved || !restored) return;
    setResolved(true);
    if (isNew) return; // File > New: a blank birth-details form, not the last chart
    if (loadId) {
      const saved = getChartLibrary().getChart(loadId);
      if (saved) { setParty({ kind: 'form', input: inputFromSaved(saved.birthData), label: saved.name }); return; }
    }
    if (activeProfile) {
      setParty({ kind: 'profile', profileId: activeProfile.profileId, revision: activeProfile.revision, label: activeProfile.name });
      return;
    }
    const stash = readStash();
    if (stash?.birthData) setParty({ kind: 'form', input: inputFromSaved(stash.birthData), label: stash.birthData.name });
  }, [resolved, restored, loadId, isNew, activeProfile]);

  // One calculation for the whole worksheet
  useEffect(() => {
    if (!party) { setData(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    const base = party.kind === 'profile'
      ? { profile: { profileId: party.profileId, revision: party.revision } }
      : { form: party.input, engine: toEngineOptions(settings) };
    computeWorksheet({ ...base, dashaOptions: toDashaOptions(settings) })
      .then((r) => { if (!cancelled) setData(r as WorksheetData); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setData(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party, settings.ayanamsha, settings.houseSystem, settings.nodeType, settings.dashaYearDays, settings.dashaBalance]); // eslint-disable-line react-hooks/exhaustive-deps

  // The menus (Save, Print, Notes, Events) act on the chart in the stash, so the worksheet's person goes there
  useEffect(() => {
    if (!data) return;
    const b = data.birth;
    const pad = (n: number) => String(n).padStart(2, '0');
    const birthData = {
      name: b.name, gender: b.gender, dateOfBirth: `${b.year}-${pad(b.month)}-${pad(b.day)}`, timeOfBirth: `${pad(b.hour)}:${pad(b.minute)}`,
      place: b.placeName, latitude: b.latitude, longitude: b.longitude, utcOffset: b.utcOffsetMinutes,
    };
    try {
      const prior = readStash();
      const same = prior?.birthData && prior.birthData.name === birthData.name && prior.birthData.dateOfBirth === birthData.dateOfBirth
        && prior.birthData.timeOfBirth === birthData.timeOfBirth;
      localStorage.setItem(STASH_KEY, JSON.stringify({ ...(same ? prior : {}), birthData, selectedChartId: 'D1-rasi' }));
    } catch { /* the menus then ask for a chart, as before */ }
  }, [data]);

  const asOfLabel = useMemo(() => {
    if (!asOf) return '';
    const [y, m, d] = asOf.split('-').map(Number);
    return `${d} ${MONTHS_EN[m - 1]} ${y}`;
  }, [asOf]);

  // -------------------------------------------------------------------- no chart yet
  if (!party) {
    return (
      <main className="min-h-screen p-6 max-w-3xl mx-auto">
        <header className="text-center mb-6 pt-4">
          <p className="text-4xl mb-2" aria-hidden>🪔</p>
          <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஜாதக மேசை</h1>
          <p className="text-sm text-ink-soft mt-2 max-w-xl mx-auto">
            ஒரு ஜாதகத்தைத் திறந்தால் பிறப்பு ஜாதகம், பாவ பலம், கிரக பலம், கிரக அவஸ்தை, தசா புக்தி, நவாம்சம் அனைத்தும் ஒரே திரையில். ஒவ்வொரு பெட்டியின் தலைப்பில் உள்ள பட்டியலில் வேறு கட்டத்தையோ அட்டவணையையோ தேர்ந்தெடுக்கலாம்.
          </p>
        </header>
        {recent.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">சமீபத்திய ஜாதகங்கள்</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recent.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setParty({ kind: 'form', input: inputFromSaved(c.birthData), label: c.name })}
                  className="text-left bg-surface border border-line rounded-xl px-3 py-2 hover:border-saffron hover:shadow-sm transition"
                >
                  <span className="block text-sm font-semibold text-ink">{c.name}</span>
                  <span className="block text-xs text-ink-soft">{c.birthData.dateOfBirth} · {c.birthData.timeOfBirth} · {c.birthData.place}</span>
                </button>
              ))}
            </div>
          </section>
        )}
        <PartyChooser party={party} setParty={setParty} loading={loading} startManual={isNew} />
        {error && <p className="text-rose text-sm bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}
      </main>
    );
  }

  // -------------------------------------------------------------------- the worksheet
  const pill = 'px-3 py-1 rounded-full border border-line bg-surface text-xs text-ink hover:border-saffron hover:bg-saffron/10 transition';
  return (
    <main className="min-h-screen p-3 sm:p-5 max-w-[88rem] mx-auto">
      <header className="mb-3 rounded-2xl border border-line bg-surface p-3 sm:p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid place-items-center size-11 rounded-full bg-saffron/25 font-[family-name:var(--font-tamil-serif)] text-lg font-bold text-ink shrink-0" aria-hidden>
              {(data?.native.name ?? party.label).trim().charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-tamil-serif)] text-lg font-bold text-ink truncate">{data?.native.name ?? party.label}</p>
              <p className="text-xs text-ink-soft tabular-nums">
                {data ? `${data.native.date} · ${data.native.time} · ${data.native.placeName ?? '—'}` : 'கணக்கிடப்படுகிறது…'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-ink-soft">
            {data && (
              <>
                <span className="rounded-full bg-ink/5 px-2 py-0.5">{data.engine.ayanamsha}</span>
                <span className="rounded-full bg-ink/5 px-2 py-0.5">{data.engine.houseSystem}</span>
                <span className="rounded-full bg-ink/5 px-2 py-0.5">{data.engine.nodeType === 'true' ? 'true node' : 'mean node'}</span>
              </>
            )}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-line bg-surface px-1.5 py-0.5" title="தசா பட்டியல் எந்தத் தேதிக்கு">
              <button type="button" className="px-1.5 text-ink-soft hover:text-ink" onClick={() => asOf && setAsOf(addMonths(asOf, -1))} aria-label="ஒரு மாதம் முன்">◀</button>
              <label className="flex items-center gap-1 text-xs text-ink">
                <span className="text-ink-soft">தேதி</span>
                <input
                  type="date"
                  value={asOf}
                  onChange={(e) => e.target.value && setAsOf(e.target.value)}
                  className="bg-transparent text-xs tabular-nums focus:outline-none"
                  aria-label={`தசா பட்டியல் தேதி: ${asOfLabel}`}
                />
              </label>
              <button type="button" className="px-1.5 text-ink-soft hover:text-ink" onClick={() => asOf && setAsOf(addMonths(asOf, 1))} aria-label="ஒரு மாதம் பின்">▶</button>
              <button type="button" className="px-1.5 text-xs text-saffron hover:underline" onClick={() => setAsOf(todayText())}>இன்று</button>
            </div>
            <button type="button" className={pill} onClick={() => setParty(null)}>↻ மாற்று</button>
          </div>
        </div>
        <nav className="mt-3 flex flex-wrap gap-1.5" aria-label="இந்த ஜாதகத்துக்கான பக்கங்கள்">
          <Link href="/report" className={pill}>📖 முழு அறிக்கை</Link>
          <Link href="/divisional-charts" className={pill}>🔷 வர்க்கங்கள்</Link>
          <Link href="/dasha-timeline" className={pill}>⏱ தசை வரிசை</Link>
          <Link href="/dasha-calendar" className={pill}>📅 தசா நாட்காட்டி</Link>
          <Link href="/animated-transits" className={pill}>🪐 கோசாரம்</Link>
          <Link href="/varshaphala" className={pill}>🎂 வர்ஷபலன்</Link>
          <Link href="/print?kind=book" className={pill}>🖨 புத்தகம் அச்சிடு</Link>
        </nav>
      </header>

      {loading && !data && <p className="text-sm text-ink-soft p-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-3 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {data && (
        <div className="grid gap-3 lg:grid-cols-12">
          <CellFrame id="main" choice={choices.main} onChoice={(v) => choose('main', v)} className="lg:col-span-7">
            <ChartCell data={data} which={choices.main} variant="main" />
          </CellFrame>

          <div className="lg:col-span-5 grid gap-3 content-start">
            <CellFrame id="side" choice={choices.side} onChoice={(v) => choose('side', v)}>
              <ChartCell data={data} which={choices.side} variant="side" />
            </CellFrame>
            <CellFrame id="dasha" choice={choices.dasha} onChoice={(v) => choose('dasha', v)}>
              <DashaCell data={data} asOf={asOf || todayText()} onPick={setAsOf} />
            </CellFrame>
          </div>

          <CellFrame id="planets" choice={choices.planets} onChoice={(v) => choose('planets', v)} className="lg:col-span-4">
            <PlanetsCell data={data} />
          </CellFrame>
          <CellFrame id="strength" choice={choices.strength} onChoice={(v) => choose('strength', v)} className="lg:col-span-5">
            <StrengthCell data={data} />
          </CellFrame>
          <CellFrame id="graph" choice={choices.graph} onChoice={(v) => choose('graph', v)} className="lg:col-span-3">
            <GraphCell data={data} which={choices.graph} />
          </CellFrame>
        </div>
      )}
    </main>
  );
}

