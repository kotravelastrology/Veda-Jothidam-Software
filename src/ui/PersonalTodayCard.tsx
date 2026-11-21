'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { computePersonalToday } from '../../app/todayActions';
import { useActiveBirthInput } from '../workspace/useActiveBirthInput';
import { useSettings, toDashaOptions } from './SettingsPanel';
import { ShareButton } from './ShareButton';
import { personalShareText } from './personalShare';

/** What computePersonalToday returns (src/report/personalToday.js); the server action's result is plain JSON, so its shape is written out here. */
interface DashaRow { level: number; levelTa: string; lord: string; lordTa: string; start: string; end: string; progress: number; daysLeft: number }
interface PersonalToday {
  atUtc: string;
  janma: { starTa: string; rasiTa: string };
  dasha: DashaRow[];
  moon: { starTa: string; pada: number; count: number; tara: number; taraTa: string; taraResultTa: string; rasiTa: string; houseFromMoon: number };
  saturn: { rasiTa: string; houseFromMoon: number; sadeSati: { phase: string; nameTa: string } | null };
  jupiter: { rasiTa: string; houseFromMoon: number };
}

/** The chart colours of globals.css (--pl-Su ...) by Vimshottari lord. */
const PL: Record<string, string> = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };

/** '2031-06-26' -> '26-06-2031' */
const dmy = (iso: string) => iso.split('-').reverse().join('-');
const ordinal = (n: number) => `${n}-ஆம்`;

/** The device's date as 'YYYY-MM-DD' (the day the person is looking at). */
function localIsoDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * "Today for you" on the home page: for the open chart, the dasha, bhukti and antara running now with how much of each has passed, the
 * Moon of the day against the birth star (tara), and Saturn's and Jupiter's houses from the birth Moon with the Sade Sati phase.
 * Everything is a state the books define, with the book's own word where one is shown, and each line opens the page that gives the whole
 * reading with its sources (src/report/personalToday.js). No line says that the day is good or bad.
 */
export function PersonalTodayCard({ name }: { name: string }) {
  const { settings } = useSettings();
  const { input } = useActiveBirthInput();
  const [data, setData] = useState<PersonalToday | null>(null);
  const [failed, setFailed] = useState(false);

  const run = useCallback(() => {
    if (!input) return;
    computePersonalToday(input, toDashaOptions(settings))
      .then((r) => { setData(r as PersonalToday); setFailed(false); })
      .catch(() => setFailed(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, settings.dashaYearDays, settings.dashaBalance]);

  useEffect(() => { setData(null); setFailed(false); run(); }, [run]);

  // Back on the page after a while: the Moon changes its star in a day and a period can end, so it is read again
  useEffect(() => {
    let last = Date.now();
    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - last > 15 * 60000) { last = Date.now(); run(); }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [run]);

  const row = 'group flex items-start justify-between gap-3 rounded-xl border border-transparent px-2.5 py-2 hover:border-saffron/50 hover:bg-bg';

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 shadow-md" aria-labelledby="personal-today-title" data-testid="personal-today">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3">
        <h2 id="personal-today-title" className="font-[family-name:var(--font-tamil-serif)] text-lg font-bold text-ink">✨ இன்று உங்களுக்கு</h2>
        <span className="text-[11px] text-ink-soft">நூல்கள் கூறும் நிலைகள் மட்டும் · தீர்ப்பு இல்லை</span>
      </div>

      {!data && !failed && (
        <div aria-busy="true" className="space-y-2.5" data-testid="personal-today-skeleton">
          <span className="sr-only">கணக்கிடப்படுகிறது…</span>
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-9 w-full" />)}
          {[0, 1, 2].map((i) => <div key={`f${i}`} className="skeleton h-12 w-full" />)}
        </div>
      )}

      {failed && (
        <p className="py-3 text-sm text-rose" role="alert">
          இன்றைய நிலையைக் கணக்கிட முடியவில்லை.{' '}
          <button type="button" onClick={() => { setFailed(false); run(); }} className="font-semibold underline">மீண்டும் முயற்சி</button>
        </p>
      )}

      {data && (
        <>
          <div className="space-y-2.5">
            {data.dasha.map((d) => {
              const pct = Math.round(d.progress * 100);
              return (
                <div key={d.level} className="px-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span><span className="text-[11px] text-ink-soft">{d.levelTa}</span> <strong className="text-sm text-ink">{d.lordTa}</strong></span>
                    <span className="text-[11px] tabular-nums text-ink-soft">{dmy(d.start)} – {dmy(d.end)}</span>
                  </div>
                  <div
                    className="mt-1 h-1.5 overflow-hidden rounded-full bg-line"
                    role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}
                    aria-label={`${d.levelTa} ${d.lordTa}: ${pct}% கடந்தது`}
                  >
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `var(--pl-${PL[d.lord] ?? 'Su'})` }} />
                  </div>
                  <p className="mt-0.5 text-[10px] tabular-nums text-ink-soft">{pct}% கடந்தது · {d.daysLeft.toLocaleString('en-IN')} நாள் மீதம்</p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 space-y-0.5 border-t border-line/70 pt-2">
            <Link href="/nakshatra-gochara" className={row}>
              <span className="min-w-0">
                <span className="block text-[11px] text-ink-soft">சந்திரன் இன்று</span>
                <span className="block text-sm font-semibold text-ink">{data.moon.starTa} · {data.moon.pada}-ஆம் பாதம் <span className="font-normal text-ink-soft">({data.moon.rasiTa})</span></span>
                <span className="block text-[11px] leading-snug text-ink-soft">
                  {data.janma.starTa}-இலிருந்து {data.moon.count}-ஆவது நட்சத்திரம் · {ordinal(data.moon.tara)} தாரை: {data.moon.taraTa} <span className="whitespace-nowrap">(புளிப்பாணி: {data.moon.taraResultTa})</span> · ராசிக்கு {ordinal(data.moon.houseFromMoon)} வீடு
                </span>
              </span>
              <span aria-hidden className="mt-1 text-ink-soft group-hover:text-saffron">›</span>
            </Link>
            <Link href="/saturn-transit" className={row}>
              <span className="min-w-0">
                <span className="block text-[11px] text-ink-soft">சனி</span>
                <span className="block text-sm font-semibold text-ink">{data.saturn.rasiTa} <span className="font-normal text-ink-soft">· ராசிக்கு {ordinal(data.saturn.houseFromMoon)} வீடு</span></span>
                {data.saturn.sadeSati && <span className="block text-[11px] leading-snug text-rose">சாடே சாதி: {data.saturn.sadeSati.nameTa}</span>}
              </span>
              <span aria-hidden className="mt-1 text-ink-soft group-hover:text-saffron">›</span>
            </Link>
            <Link href="/gochara-vedha" className={row}>
              <span className="min-w-0">
                <span className="block text-[11px] text-ink-soft">குரு</span>
                <span className="block text-sm font-semibold text-ink">{data.jupiter.rasiTa} <span className="font-normal text-ink-soft">· ராசிக்கு {ordinal(data.jupiter.houseFromMoon)} வீடு</span></span>
              </span>
              <span aria-hidden className="mt-1 text-ink-soft group-hover:text-saffron">›</span>
            </Link>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] text-ink-soft">ஒவ்வொரு வரியின் முழு விளக்கமும் ஆதாரமும் அதன் பக்கத்தில்.</p>
            <ShareButton input={personalShareText(name, data, localIsoDate())} />
          </div>
        </>
      )}
    </section>
  );
}
