'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/src/navigation/navigationContext';
import { useWorkspace } from '@/src/workspace/workspaceContext';
import { HOME_SECTIONS, allHomeLinks } from '@/src/navigation/homeSections';
import { useOpenChart } from '@/src/ui/useScreenPrefs';
import { useRecentCharts, useRememberParty, inputFromSaved } from '@/src/ui/chartParty';
import { clearStash } from '@/src/ui/openChartStore';
import { computeToday } from './todayActions';
import { useSettings } from '@/src/ui/SettingsPanel';

/**
 * The home page: the open chart (or the way to open one), today's panchangam, and every page of the program under the task it
 * serves (src/navigation/homeSections.js), with a search over all of them.
 */

type Today = Awaited<ReturnType<typeof computeToday>>;

const TONE = {
  saffron: { chip: 'bg-saffron/15 text-saffron', bar: 'from-saffron/70', ring: 'hover:border-saffron/60' },
  indigo: { chip: 'bg-indigo/15 text-indigo', bar: 'from-indigo/70', ring: 'hover:border-indigo/60' },
  teal: { chip: 'bg-teal/15 text-teal', bar: 'from-teal/70', ring: 'hover:border-teal/60' },
  rose: { chip: 'bg-rose/15 text-rose', bar: 'from-rose/70', ring: 'hover:border-rose/60' },
} as const;

const MONTHS_TA = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];

/** A faint kolam of dots and petals behind the greeting. */
function Kolam({ className = '' }: { className?: string }) {
  const dots = [];
  for (let r = 0; r < 7; r += 1) for (let c = 0; c < 7; c += 1) dots.push(<circle key={`${r}-${c}`} cx={20 + c * 40} cy={20 + r * 40} r={2.2} />);
  return (
    <svg viewBox="0 0 280 280" className={className} aria-hidden fill="currentColor">
      {dots}
      <g fill="none" stroke="currentColor" strokeWidth={1.4}>
        {[60, 100, 140].map((r) => <circle key={r} cx={140} cy={140} r={r} />)}
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx={140} cy={80} rx={18} ry={58} transform={`rotate(${i * 45} 140 140)`} />
        ))}
      </g>
    </svg>
  );
}

function TodayCard() {
  const { uiActions } = useNavigation();
  const { settings, loaded } = useSettings();
  const place = settings.astrologerPlace;
  const [today, setToday] = useState<Today | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!loaded) return;
    setToday(null); setFailed(false);
    computeToday({ latitude: place.latitude, longitude: place.longitude, timeZone: place.timeZone, placeName: place.name })
      .then(setToday).catch(() => setFailed(true));
  }, [loaded, place.latitude, place.longitude, place.timeZone, place.name]);
  const row = (label: string, value: string, until?: string, tone = 'text-ink') => (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/60 py-1.5 last:border-0">
      <span className="text-xs text-ink-soft">{label}</span>
      <span className={`text-sm font-semibold ${tone} text-right`}>{value}{until && <span className="ml-1 text-[11px] font-normal text-ink-soft">({until} வரை)</span>}</span>
    </div>
  );
  return (
    <div className="rounded-2xl border border-line bg-surface/90 p-4 shadow-sm backdrop-blur" data-testid="today-card">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-tamil-serif)] text-lg font-bold text-ink">🗓️ இன்றைய பஞ்சாங்கம்</h2>
        <button type="button" onClick={() => uiActions.openSettings()} className="text-[11px] text-ink-soft hover:text-saffron" title="ஜோதிடர் இருப்பிடம் — அமைப்புகள்">📍 {place.name}</button>
      </div>
      {!today && !failed && <p className="py-6 text-center text-sm text-ink-soft">கணக்கிடப்படுகிறது…</p>}
      {failed && <p className="py-6 text-center text-sm text-rose">இன்றைய பஞ்சாங்கத்தைக் கணக்கிட முடியவில்லை.</p>}
      {today && (
        <>
          <p className="mb-2 text-sm text-ink">
            <strong>{today.weekdayTa}</strong> · {Number(today.date.slice(8, 10))} {MONTHS_TA[Number(today.date.slice(5, 7)) - 1]} {today.date.slice(0, 4)}
            <span className="ml-2 text-xs text-ink-soft">உதயம் {today.sunrise}</span>
          </p>
          {row('திதி', `${today.tithi.paksha} ${today.tithi.name}`, today.tithi.until)}
          {row('நட்சத்திரம்', today.nakshatra.name, today.nakshatra.until)}
          {row('யோகம்', today.yoga.name, today.yoga.until)}
          {row('கரணம்', today.karana.name, today.karana.until)}
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
            {([['ராகு காலம்', today.rahuKalam], ['எமகண்டம்', today.yamagandam], ['குளிகை', today.gulikaKalam]] as const).map(([k, v]) => (
              <div key={k} className="rounded-lg bg-rose/10 px-1 py-1.5">
                <p className="text-[10px] text-ink-soft">{k}</p>
                <p className="text-xs font-semibold tabular-nums text-ink">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
            <Link href="/nallaneram" className="rounded-full border border-line px-2.5 py-1 hover:border-saffron">🕰️ நல்ல நேரம்</Link>
            <Link href="/tamil-calendar" className="rounded-full border border-line px-2.5 py-1 hover:border-saffron">📆 நாட்காட்டி</Link>
            <Link href="/muhurta" className="rounded-full border border-line px-2.5 py-1 hover:border-saffron">🔎 முகூர்த்தம்</Link>
          </div>
          <p className="mt-2 text-[10px] text-ink-soft">திருக்கணிதம் · Karanam Ramakumar, Panchangam Calculations</p>
        </>
      )}
    </div>
  );
}

function ChartCard() {
  const router = useRouter();
  const chart = useOpenChart();
  const { uiActions } = useNavigation();
  const { setActiveProfile } = useWorkspace();
  const recent = useRecentCharts(6);
  const remember = useRememberParty();

  if (chart) {
    return (
      <div className="rounded-2xl border border-saffron/40 bg-surface/90 p-4 shadow-sm backdrop-blur" data-testid="open-chart-card">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-saffron">திறந்துள்ள ஜாதகம்</p>
        <div className="mt-1 flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-saffron/25 font-[family-name:var(--font-tamil-serif)] text-xl font-bold text-ink">
            {chart.name.trim().charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-[family-name:var(--font-tamil-serif)] text-xl font-bold text-ink">{chart.name}</p>
            <p className="text-xs text-ink-soft">{chart.line}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/worksheet" className="rounded-xl bg-saffron px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:brightness-105">🪔 ஜாதக மேசை</Link>
          <Link href="/report" className="rounded-xl border border-line bg-surface px-3 py-2 text-sm hover:border-saffron">📖 முழு அறிக்கை</Link>
          <Link href="/dasha-timeline" className="rounded-xl border border-line bg-surface px-3 py-2 text-sm hover:border-saffron">⏳ தசை</Link>
          <Link href="/animated-transits" className="rounded-xl border border-line bg-surface px-3 py-2 text-sm hover:border-saffron">🪐 கோசாரம்</Link>
          <button
            type="button"
            onClick={() => { clearStash(); setActiveProfile(null); }}
            className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink-soft hover:border-rose hover:text-rose"
          >✕ மூடு</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface/90 p-4 shadow-sm backdrop-blur" data-testid="start-card">
      <p className="text-sm text-ink">ஒரு ஜாதகத்தைத் திறந்தால் பிறப்புக் கட்டம், பலங்கள், தசை, நவாம்சம் அனைத்தும் ஒரே திரையில்.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/worksheet?new=1" className="rounded-xl bg-saffron px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:brightness-105">➕ புதிய ஜாதகம்</Link>
        <button type="button" onClick={() => uiActions.openChartDialog('all')} className="rounded-xl border border-line bg-surface px-4 py-2 text-sm hover:border-saffron">📂 சேமித்த ஜாதகங்கள்</button>
      </div>
      {recent.length > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">சமீபத்தியவை</p>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {recent.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { remember({ kind: 'form', input: inputFromSaved(c.birthData), label: c.name }); router.push('/worksheet'); }}
                className="rounded-xl border border-line bg-bg px-3 py-2 text-left hover:border-saffron"
              >
                <span className="block truncate text-sm font-semibold text-ink">{c.name}</span>
                <span className="block truncate text-[11px] text-ink-soft">{c.birthData.dateOfBirth} · {c.birthData.timeOfBirth} · {c.birthData.place}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomeView() {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const hits = useMemo(
    () => (needle ? allHomeLinks().filter((l) => l.ta.toLowerCase().includes(needle) || l.en.toLowerCase().includes(needle)) : []),
    [needle],
  );

  return (
    <main className="min-h-screen pb-10">
      {/* Greeting, the open chart, today */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-saffron/20 via-bg to-indigo/10">
        <Kolam className="pointer-events-none absolute -right-16 -top-16 size-[26rem] text-saffron/15" />
        <Kolam className="pointer-events-none absolute -bottom-24 -left-24 hidden size-80 text-indigo/10 md:block" />
        <div className="relative mx-auto grid max-w-7xl gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-ink-soft">🕉️ வணக்கம்</p>
              <h1 className="font-[family-name:var(--font-tamil-serif)] text-4xl font-bold leading-tight text-ink sm:text-5xl">வேத ஜோதிடம்</h1>
              <p className="mt-1 text-sm text-ink-soft">ஒவ்வொரு கணக்கும் நூல் ஆதாரத்துடன் · Kotravel Vedic Astrology</p>
            </div>
            <ChartCard />
          </div>
          <TodayCard />
        </div>
      </section>

      {/* Every page, by the task it serves */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-tamil-serif)] text-2xl font-bold text-ink">அனைத்துப் பக்கங்களும்</h2>
            <p className="text-xs text-ink-soft">வேலையின் வரிசைப்படி · {allHomeLinks().length} பக்கங்கள்</p>
          </div>
          <label className="flex w-full items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 shadow-sm sm:w-80">
            <span aria-hidden>🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="பக்கத்தைத் தேடு… (தசை, Saturn, KP)"
              className="w-full bg-transparent text-sm focus:outline-none"
              aria-label="பக்கத்தைத் தேடு"
            />
          </label>
        </div>

        {needle ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" data-testid="home-search-results">
            {hits.length === 0 && <p className="text-sm text-ink-soft">“{query}” — பக்கம் இல்லை.</p>}
            {hits.map((l) => (
              <Link key={l.route} href={l.route} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 hover:border-saffron">
                <span className="text-xl" aria-hidden>{l.icon}</span>
                <span className="min-w-0"><span className="block truncate text-sm font-semibold text-ink">{l.ta}</span><span className="block truncate text-[11px] text-ink-soft">{l.en}</span></span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="columns-1 gap-4 lg:columns-2 [&>*]:mb-4">
            {HOME_SECTIONS.map((s) => {
              const tone = TONE[s.tone];
              return (
                <div key={s.key} id={s.key} className="break-inside-avoid scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm" data-section={s.key}>
                  <div className={`h-1 bg-gradient-to-r ${tone.bar} to-transparent`} />
                  <div className="flex items-center gap-3 px-4 pb-2 pt-3">
                    <span className={`grid size-10 place-items-center rounded-xl text-lg font-bold ${tone.chip}`} aria-hidden>{s.icon}</span>
                    <div>
                      <h3 className="font-[family-name:var(--font-tamil-serif)] text-lg font-bold text-ink">{s.ta}</h3>
                      <p className="text-[11px] text-ink-soft">{s.en} · {s.links.length}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 gap-1 px-3 pb-3 sm:grid-cols-2">
                    {s.links.map((l) => (
                      <li key={l.route}>
                        <Link href={l.route} className={`flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 transition hover:bg-bg ${tone.ring}`}>
                          <span className="w-6 shrink-0 text-center text-base" aria-hidden>{l.icon}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-ink">{l.ta}</span>
                            <span className="block truncate text-[10px] text-ink-soft">{l.en}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
