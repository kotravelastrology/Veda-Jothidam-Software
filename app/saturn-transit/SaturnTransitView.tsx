'use client';

import { useEffect, useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { useWorkspace } from '@/src/workspace/workspaceContext';
import { listCharts, searchCharts, openChart } from '../library/actions';
import { computeSaturn } from './actions';
import type { BirthFormInput } from '../report/actions';

/**
 * Sade Sati, Ardhashtama, Ashtama and Kantaka Saturn.
 *
 * Two kinds of claim are on this page and it keeps them apart. The *dates* —
 * when Saturn is in which sign — are astronomy, computed from the ephemeris.
 * The *names* — which houses from the Moon are Sade Sati, Dhaiya or Kantaka —
 * are doctrine read from printed pages, and the books disagree about Kantaka,
 * so the convention is chosen on screen and stated on the result.
 *
 * The remedies at the foot are recorded practices with their pages. Nothing is
 * computed for them and no effect is claimed.
 */

interface LibraryRow {
  profileId: string; revision: number; name: string; birthDate: string; placeName: string | null;
}
type Party =
  | { kind: 'profile'; profileId: string; revision: number; label: string }
  | { kind: 'form'; input: BirthFormInput; label: string };

const YEAR_MS = 365.25 * 86400000;
const PHASE_COLOR: Record<string, string> = {
  RISING: 'var(--saffron)', PEAK: 'var(--rose)', SETTING: 'var(--indigo)',
};
const PHASE_TA: Record<string, string> = { RISING: 'முதல் கட்டம்', PEAK: 'நடுக் கட்டம்', SETTING: 'இறுதிக் கட்டம்' };
const COND_TA: Record<string, string> = {
  SADE_SATI: 'ஏழரைச் சனி', ARDHASHTAMA: 'அர்த்தாஷ்டமச் சனி', ASHTAMA: 'அஷ்டமச் சனி', KANTAKA: 'கண்டகச் சனி',
};

function toInput(bd: BirthData): BirthFormInput {
  return {
    name: bd.name, gender: bd.gender,
    year: parseInt(bd.dateOfBirth.split('-')[0]),
    month: parseInt(bd.dateOfBirth.split('-')[1]),
    day: parseInt(bd.dateOfBirth.split('-')[2]),
    hour: parseInt(bd.timeOfBirth.split(':')[0]),
    minute: parseInt(bd.timeOfBirth.split(':')[1]),
    placeName: bd.place, latitude: bd.latitude, longitude: bd.longitude,
    utcOffsetMinutes: bd.utcOffset, ianaTimeZone: 'Asia/Kolkata',
  };
}

const day = (iso: string) => iso.slice(0, 10);
const yrs = (n: number) => n.toFixed(1);

/** The life laid out as one strip per condition, with today marked. */
function Timeline({ r, showAll }: { r: any; showAll: boolean }) {
  const birth = Date.parse(r.window.fromUtc);
  const end = Date.parse(r.window.toUtc);
  const now = Date.parse(r.now.atUtc);
  const span = (end - birth) / YEAR_MS;
  const W = 900;
  const L = 172; // label gutter (Tamil labels are wide)
  const x = (ms: number) => L + ((ms - birth) / YEAR_MS / span) * (W - L - 8);
  const rows: { key: string; label: string; bands: { a: number; b: number; color: string; title: string }[] }[] = [
    {
      key: 'sade', label: 'ஏழரைச் சனி',
      bands: r.sadeSati.flatMap((c: any) => c.stays.map((s: any) => ({
        a: Date.parse(s.fromUtc), b: Date.parse(s.toUtc),
        color: PHASE_COLOR[({ 12: 'RISING', 1: 'PEAK', 2: 'SETTING' } as any)[s.house]],
        title: `ஏழரைச் சனி ${c.ordinal} · ${s.house}-ஆம் இடம் · ${day(s.fromUtc)} – ${day(s.toUtc)}`,
      }))),
    },
    {
      key: 'ardh', label: 'அர்த்தாஷ்டமம் (4)',
      bands: r.ardhashtama.flatMap((p: any) => p.stays.map((s: any) => ({
        a: Date.parse(s.fromUtc), b: Date.parse(s.toUtc), color: 'var(--teal)',
        title: `அர்த்தாஷ்டமச் சனி · ${day(s.fromUtc)} – ${day(s.toUtc)}`,
      }))),
    },
    {
      key: 'ash', label: 'அஷ்டமம் (8)',
      bands: r.ashtama.flatMap((p: any) => p.stays.map((s: any) => ({
        a: Date.parse(s.fromUtc), b: Date.parse(s.toUtc), color: 'var(--ink-soft)',
        title: `அஷ்டமச் சனி · ${day(s.fromUtc)} – ${day(s.toUtc)}`,
      }))),
    },
    // One strip for the chosen convention, or one for each of the books.
    ...(showAll ? r.kantakaAll : [{ id: r.kantaka.convention, houses: r.kantaka.houses, periods: r.kantaka.periods, labelTa: '' }]).map((c: any) => ({
      key: `kan-${c.id}`, label: `கண்டகம் ${c.houses.join(', ')}`,
      bands: c.periods.flatMap((p: any) => p.stays.map((s: any) => ({
        a: Date.parse(s.fromUtc), b: Date.parse(s.toUtc), color: 'var(--ink)',
        title: `கண்டகச் சனி — ${c.labelTa || ''} (${s.house}-ஆம் இடம்) · ${day(s.fromUtc)} – ${day(s.toUtc)}`,
      }))),
    })),
  ];
  const ROW = 30;
  const TOP = 16; // room above the strips for the "now" label
  const H = rows.length * ROW + 38 + TOP;
  const ticks: number[] = [];
  for (let a = 0; a <= span; a += 10) ticks.push(a);
  const birthYear = new Date(birth).getUTCFullYear();

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 820 }} role="img"
        aria-label="வாழ்நாள் முழுவதும் சனியின் கோசார நிலைகள்">
        <g transform={`translate(0 ${TOP})`}>
        {ticks.map((a) => (
          <g key={a}>
            <line x1={x(birth + a * YEAR_MS)} x2={x(birth + a * YEAR_MS)} y1={0} y2={rows.length * ROW}
              stroke="var(--line)" strokeWidth={1} />
            <text x={x(birth + a * YEAR_MS)} y={rows.length * ROW + 16} textAnchor="middle" fontSize={13}
              fill="var(--ink-soft)">{a}</text>
            <text x={x(birth + a * YEAR_MS)} y={rows.length * ROW + 31} textAnchor="middle" fontSize={11}
              fill="var(--ink-soft)">{birthYear + a}</text>
          </g>
        ))}
        {rows.map((row, i) => (
          <g key={row.key}>
            <text x={4} y={i * ROW + 20} textAnchor="start" fontSize={13} fill="var(--ink)">{row.label}</text>
            <rect x={L} y={i * ROW + 4} width={W - L - 8} height={ROW - 8} fill="var(--surface-2)" rx={2} />
            {row.bands.map((b, j) => (
              <rect key={j} x={x(b.a)} y={i * ROW + 4} width={Math.max(1.5, x(b.b) - x(b.a))} height={ROW - 8}
                fill={b.color} opacity={row.key === 'sade' ? 0.95 : 0.8}><title>{b.title}</title></rect>
            ))}
          </g>
        ))}
        {now >= birth && now <= end && (
          <g>
            <line x1={x(now)} x2={x(now)} y1={-4} y2={rows.length * ROW} stroke="var(--ink)" strokeWidth={1.5}
              strokeDasharray="3 2" />
            <text x={x(now)} y={-7} textAnchor="middle" fontSize={12} fontWeight={700}
              fill="var(--ink)">இப்போது</text>
          </g>
        )}
        </g>
      </svg>
      <p className="text-[11px] text-ink-soft mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(PHASE_COLOR).map(([p, c]) => (
          <span key={p}><span className="inline-block w-2.5 h-2.5 mr-1 align-middle" style={{ background: c }} />
            {PHASE_TA[p]}</span>
        ))}
        <span>கீழ் அச்சு: வயது (ஆண்டு) மற்றும் ஆண்டு. இடைவெளிகள் சனி வக்கிரமாகப் பின்செல்லும் காலங்கள்.</span>
      </p>
    </div>
  );
}

function PeriodList({ title, periods, note }: { title: string; periods: any[]; note?: string }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {note && <p className="text-[11px] text-ink-soft mb-2">{note}</p>}
      {periods.length === 0 ? <p className="text-xs text-ink-soft">இந்தக் காலத்தில் இல்லை.</p> : (
        <ul className="text-xs divide-y divide-line/40">
          {periods.map((p, i) => (
            <li key={i} className="py-1.5">
              <span className="font-mono text-ink" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {day(p.fromUtc)} – {day(p.toUtc)}
              </span>{' '}
              <span className="text-ink-soft">
                · {yrs(p.years)} ஆண்டு{p.openStart ? ' · (தொடக்கம் இதற்கு முன்)' : ''}
                {p.stays.length > 1 && ` · ${p.stays.map((s: any) => `${s.house}-ஆம்`).join(' → ')}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The four readings of Kantaka Saturn side by side, each with its page. */
function KantakaCompare({ r }: { r: any }) {
  const now = Date.parse(r.now.atUtc);
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-xs" style={{ minWidth: 640 }}>
        <thead>
          <tr className="text-ink-soft border-b border-line text-left">
            <th className="py-1 pr-3">நூல்</th><th className="py-1 pr-3">இடங்கள்</th>
            <th className="py-1 pr-3">இப்போது</th><th className="py-1 pr-3">அடுத்த / நடப்பு காலம்</th>
            <th className="py-1">பக்கம்</th>
          </tr>
        </thead>
        <tbody>
          {r.kantakaAll.map((c: any) => {
            const p = c.periods.find((x: any) => Date.parse(x.toUtc) > now);
            const running = p && Date.parse(p.fromUtc) <= now;
            return (
              <tr key={c.id} className="border-b border-line/40 align-top">
                <td className="py-1.5 pr-3 text-ink">{c.labelTa}{c.id === r.kantaka.convention && <span className="text-teal"> ✓</span>}</td>
                <td className="py-1.5 pr-3 font-mono text-ink">{c.houses.join(', ')}</td>
                <td className="py-1.5 pr-3">
                  <span className={`px-1.5 py-0.5 rounded ${c.activeNow ? 'bg-rose-soft text-rose font-semibold' : 'bg-teal-soft text-teal'}`}>
                    {c.activeNow ? 'ஆம்' : 'இல்லை'}
                  </span>
                </td>
                <td className="py-1.5 pr-3 font-mono text-ink" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {p ? `${running ? 'நடப்பு: ' : ''}${day(p.fromUtc)} – ${day(p.toUtc)}` : '—'}
                </td>
                <td className="py-1.5 text-ink-soft">{c.sourceTitle} — {c.sourcePage}<span className="block">{c.note}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const TONE_CLS: Record<string, string> = { good: 'text-teal', bad: 'text-rose', neutral: 'text-ink' };

/**
 * Saturn's transit as the Tamil text and the English books state it. Where they
 * agree it says so; where the Tamil text is silent it says that too, rather
 * than letting the English answer stand in for it.
 */
function TamilAndEnglish({ r }: { r: any }) {
  const t = r.tamil;
  if (!t) return null;
  const g = t.goodHouses;
  const a = t.anga;
  const yes = (b: boolean) => (
    <span className={`px-1.5 py-0.5 rounded ${b ? 'bg-teal-soft text-teal' : 'bg-rose-soft text-rose'}`}>{b ? 'நல்ல இடம்' : 'நல்ல இடம் அல்ல'}</span>
  );
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="text-sm font-semibold text-ink mb-1">தமிழ் நூல் · ஆங்கில நூல்கள் — சனி கோசாரம்</h2>
      <p className="text-[11px] text-ink-soft mb-3">
        இரு மரபுகளின் முறைகளும் ஒன்றாகக் காட்டப்படுகின்றன. தமிழ் நூல் (சூடாமணி உள்ளமுடையான்) சொல்லாததை
        ஆங்கில நூலின் பதிலால் நிரப்பவில்லை.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 640 }}>
          <thead>
            <tr className="text-ink-soft border-b border-line text-left">
              <th className="py-1 pr-3">விஷயம்</th><th className="py-1 pr-3">தமிழ் நூல்</th><th className="py-1">ஆங்கில நூல்கள்</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-line/40">
              <td className="py-2 pr-3 text-ink font-semibold">சந்திரனிலிருந்து நல்ல இடங்கள்<span className="block font-normal text-ink-soft">இப்போது சனி {t.houseFromMoon}-ஆம் இடத்தில்</span></td>
              <td className="py-2 pr-3">
                <span className="font-mono text-ink">{g.tamil.houses.join(', ')}</span> {yes(g.tamil.goodNow)}
                <span className="block text-ink-soft">{g.tamil.sourceTitle} — {g.tamil.sourcePage}</span>
                <span className="block text-amber-700">செய்யுள்: 3, 6, 11 ("பத்தொன்று" = 11). அச்சிட்ட உரை 10-ஐயும் சேர்க்கிறது; செய்யுளுடன் முரண்படுவதால் பின்பற்றப்படவில்லை.</span>
              </td>
              <td className="py-2">
                {g.english.map((e: any, i: number) => (
                  <div key={i} className="mb-1.5">
                    <span className="font-mono text-ink">{e.houses.join(', ')}</span> {yes(e.goodNow)}
                    <span className="block text-ink-soft">{e.sourceTitle} — {e.sourcePage}</span>
                  </div>
                ))}
              </td>
            </tr>
            <tr className="border-b border-line/40">
              <td className="py-2 pr-3 text-ink font-semibold">தடுக்கும் வேதை இடம்</td>
              <td className="py-2 pr-3 text-ink">
                3 ← 12 · 6 ← 9 · 11 ← 5 (செய்யுள் 342)
                {g.vedhaHouse !== null && <span className="block text-ink-soft">இப்போதைய இடத்துக்கு வேதை: {g.vedhaHouse}-ஆம் இடம்</span>}
              </td>
              <td className="py-2 text-ink">அதே — 12, 9, 5. சூரியன்–சனி தந்தை–மகன் என்பதால் ஒன்றுக்கொன்று வேதை செய்வதில்லை (விஷ்ணு பாஸ்கர்).</td>
            </tr>
            <tr className="border-b border-line/40">
              <td className="py-2 pr-3 text-ink font-semibold">ஏழரைச் சனி · அஷ்டமம் · அர்த்தாஷ்டமம் · கண்டகம்</td>
              <td className="py-2 pr-3">
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">நூலில் இல்லை</span>
                <span className="block text-ink-soft mt-1">{t.absences.noteTa}</span>
                <span className="block text-ink-soft">தேடப்பட்டவை: {t.absences.searchedIn.join(' · ')}</span>
              </td>
              <td className="py-2 text-ink">மேலே உள்ளபடி — நான்கு நூல்கள், பக்க எண்களுடன் (கண்டகம் ஒத்துப்போகவில்லை).</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 text-ink font-semibold">அங்க சனி<span className="block font-normal text-ink-soft">சனி உடலின் எந்தப் பகுதியில்</span></td>
              <td className="py-2 pr-3">
                <span className="text-ink">பிறந்த நட்சத்திரம் முதல் சனி நிற்கும் நட்சத்திரம் வரை எண்ணிக்கை <strong>{a.count}</strong> / {a.total} →{' '}
                  <strong className={TONE_CLS[a.band.tone]}>{a.band.part}</strong> ({a.band.from}–{a.band.to}): {a.band.result}</span>
                <span className="block mt-1"><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">வரிசை ஊகம்</span></span>
                <span className="block text-ink-soft mt-1">{a.sourceTitle} — {a.sourcePage}</span>
              </td>
              <td className="py-2 text-ink">நாம் படித்த ஆங்கில நூல்களில் இந்த முறை காணப்படவில்லை. (விஷ்ணு பாஸ்கரின் மாதக் கணக்குப் பட்டியல் வேறு அமைப்பு — ராசி அடிப்படையிலானது.)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <details className="mt-3 text-xs">
        <summary className="cursor-pointer font-semibold text-ink">அங்க சனி — அட்டவணை, வரிசை, அடுத்த காலங்கள்</summary>
        <div className="mt-2 grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-ink-soft mb-1">நூலில் அச்சிட்ட வரிசையில் (மொத்தம் {a.total}):</p>
            <ul className="space-y-0.5">
              {a.bands.map((b: any) => (
                <li key={b.part} className={b.part === a.band.part ? 'font-semibold' : ''}>
                  <span className="font-mono text-ink-soft">{b.portions}</span>{' '}
                  <span className={TONE_CLS[b.tone]}>{b.part}</span> — {b.result}
                </li>
              ))}
            </ul>
            <p className="text-amber-700 mt-2">வரிசை ஊகம் — இவை நூலில் சொல்லப்படாதவை:</p>
            <ul className="list-disc ml-5 text-ink-soft">
              {a.assumptions.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-ink-soft mb-1">அடுத்த 30 ஆண்டுகள் (வக்கிரப் பின்செல்லலும் சேர்த்து):</p>
            <ul className="space-y-0.5 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {a.periods.map((p: any, i: number) => (
                <li key={i}><span className={TONE_CLS[p.tone]}>{p.part}</span> {day(p.fromUtc)} – {day(p.toUtc)}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </section>
  );
}

const VEDHA_KIND: Record<string, { ta: string; cls: string }> = {
  GOOD: { ta: 'நல்ல இடம் — வேதை தடுக்கும்', cls: 'text-teal' },
  RELIEVABLE: { ta: 'தீய இடம் — விபரீத வேதை நீக்கும்', cls: 'text-amber-700' },
  NO_RELIEF: { ta: 'தீய இடம் — விபரீத வேதை இல்லை', cls: 'text-rose' },
};
const Windows = ({ list }: { list: any[] }) => (
  <>{list.map((w: any, i: number) => <span key={i} className="block font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{day(w.fromUtc)} – {day(w.toUtc)} ({Math.round(w.days)} நாள்)</span>)}</>
);

/**
 * Gochara vedha and vipareetha vedha for Saturn, as dated windows over the
 * coming years, with what each book says. The windows are astronomy; what they
 * mean is the books', and the books differ on it, so both are shown.
 */
function VedhaSection({ r }: { r: any }) {
  const v = r.vedha;
  if (!v) return null;
  const n = v.now;
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="text-sm font-semibold text-ink mb-1">வேதை, விபரீத வேதை — சனி</h2>
      <p className="text-[11px] text-ink-soft mb-2">
        சனி நல்ல இடத்தில் (3, 6, 11) இருக்கும்போது வேறொரு கிரகம் இணை இடத்தில் (12, 9, 5) இருந்தால் நல்ல பலன் தடைபடும் — வேதை.
        சனி தீய இடத்தில் (12, 9, 5) இருக்கும்போது வேறொரு கிரகம் இணை இடத்தில் (3, 6, 11) இருந்தால் தீமை நீங்கும் — விபரீத வேதை.
        காலங்கள் வானியல் கணக்கு; அவற்றின் பொருள் நூல்களுடையது. காலம்: {day(v.window.fromUtc)} – {day(v.window.toUtc)}.
      </p>
      {n && (
        <p className="text-sm text-ink mb-3">
          இப்போது சனி <strong>{n.house}-ஆம் இடத்தில்</strong> — <span className={VEDHA_KIND[n.kind]?.cls}>{VEDHA_KIND[n.kind]?.ta ?? '—'}</span>
          {n.pairedHouse && (n.planetsInPaired.length
            ? <>; {n.pairedHouse}-ஆம் இடத்தில் இப்போது {n.planetsInPaired.map((p: any) => p.planetTa).join(', ')}
              {' — '}<strong>{n.active ? (n.kind === 'GOOD' ? 'வேதை நடப்பில்' : 'விபரீத வேதை நடப்பில்') : (n.kind === 'GOOD' ? 'வேதை இல்லை' : 'விபரீத வேதை உறுதியில்லை')}</strong>
              {n.planetsInPaired.some((p: any) => p.status === 'EXCLUDED') && ' (சூரியனால் சனிக்கு வேதை இல்லை)'}
              {n.planetsInPaired.some((p: any) => p.status === 'UNCERTAIN') && ' (சூரியனால் விபரீத வேதை — நூல் தெளிவாக இல்லை)'}
              {n.planetsInPaired.some((p: any) => p.planet === 'Moon') && ' (சந்திரன் சுமார் 2 நாள் மட்டுமே)'}.</>
            : <>; {n.pairedHouse}-ஆம் இடத்தில் இப்போது எந்தக் கிரகமும் இல்லை.</>)}
        </p>
      )}
      <ul className="text-xs space-y-1.5 mb-3">
        {(['pulippaniVedha', 'pulippaniVipareeta', 'pulippaniOrdeal', 'vishnuBhaskar', 'sudamaniVipareeta', 'sudamaniTiming'] as const).map((k) => (
          <li key={k}>
            <span className="text-ink">{v.texts[k].textTa}</span>
            {k === 'sudamaniVipareeta' && <span className="block text-amber-800">{v.texts[k].differsTa}</span>}
            {k === 'sudamaniVipareeta' && <span className="block text-ink-soft">{v.texts[k].commentaryNoteTa}</span>}
            <span className="block text-[11px] text-ink-soft">{v.texts[k].title} — {v.texts[k].page}</span>
          </li>
        ))}
      </ul>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 760 }}>
          <thead>
            <tr className="text-ink-soft border-b border-line text-left">
              <th className="py-1 pr-2">சனி</th><th className="py-1 pr-2">இடம்</th><th className="py-1 pr-2">வகை</th>
              <th className="py-1 pr-2">இணை இடத்தில் கிரகங்கள்</th><th className="py-1 pr-2">மொத்தம்</th><th className="py-1">சந்திரன் · சூரியன்</th>
            </tr>
          </thead>
          <tbody className="align-top">
            {v.stays.map((s: any, i: number) => (
              <tr key={i} className="border-b border-line/40">
                <td className="py-1.5 pr-2 font-mono text-ink whitespace-nowrap" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {day(s.fromUtc)} – {day(s.toUtc)}{s.enteredBy === 'RETROGRADE' && <span className="block font-sans text-ink-soft">வக்கிரத் திரும்பல்</span>}
                </td>
                <td className="py-1.5 pr-2 text-ink">{s.house} · {s.rasi}</td>
                <td className={`py-1.5 pr-2 ${VEDHA_KIND[s.kind]?.cls ?? ''}`}>{VEDHA_KIND[s.kind]?.ta}{s.pairedHouse && <span className="block text-ink-soft">இணை: {s.pairedHouse}-ஆம் இடம்</span>}</td>
                <td className="py-1.5 pr-2 text-ink">
                  {s.pairedHouse ? (s.byPlanet.length ? s.byPlanet.map((b: any) => (
                    <div key={b.planet} className="mb-1"><strong>{b.planetTa}</strong><Windows list={b.windows} /></div>
                  )) : <span className="text-ink-soft">இல்லை</span>) : <span className="text-ink-soft">—</span>}
                </td>
                <td className="py-1.5 pr-2 font-mono text-ink">{s.pairedHouse ? `${Math.round(s.coveredDays)} / ${Math.round(s.days)} நாள்` : '—'}</td>
                <td className="py-1.5 text-ink-soft">
                  {s.moon && <span className="block">சந்திரன்: {s.moon.count} முறை, {Math.round(s.moon.days)} நாள்</span>}
                  {s.sun && s.sun.windows.length > 0 && (
                    <span className="block">சூரியன் ({s.sun.status === 'EXCLUDED' ? 'வேதை இல்லை' : 'உறுதியில்லை'}): <Windows list={s.sun.windows} /></span>
                  )}
                  {s.ordeal && (
                    <span className="block text-rose mt-1">
                      ஏழரைச் சனி — குரு 3-ல் {s.ordeal.jupiterInThird.length ? 'இருக்கும் காலம் தவிர' : 'இல்லை'}; சனியின் ராசியில் வேகக் கிரகங்கள்:{' '}
                      {s.ordeal.fast.filter((f: any) => (f.windows ? f.windows.length : f.count) > 0)
                        .map((f: any) => `${f.planetTa} ${f.windows ? f.windows.length : f.count} முறை / ${Math.round(f.days)} நாள்`).join(', ') || 'இல்லை'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="text-[11px] text-ink-soft mt-2 space-y-0.5 list-disc ml-5">
        <li>{v.notes.sunTa}</li>
        <li>{v.notes.moonTa}</li>
        <li>{v.notes.nodesTa}</li>
        <li>{v.notes.noReliefTa}</li>
        <li>"மொத்தம்" = இணை இடத்தில் சந்திரன், சூரியன் தவிர வேறு ஏதேனும் கிரகம் இருந்த நாட்கள் / சனி அந்த இடத்தில் இருந்த நாட்கள்.</li>
      </ul>
    </section>
  );
}

/** Pulippani's text for Saturn in the 4th, 7th and 8th, each lived period with its round. */
function HouseResults({ r }: { r: any }) {
  const hr = r.houseResults;
  if (!hr) return null;
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="text-sm font-semibold text-ink mb-1">அர்த்தாஷ்டமம் (4), கண்டகம் (7), அஷ்டமம் (8) — நூல் சொல்லும் பலன்</h2>
      <p className="text-[11px] text-ink-soft mb-3">
        புலிப்பாணியின் நூலில் மூன்று இடங்களில் உள்ளவை, சுருக்கமாகத் தமிழில். இவை நூலின் கூற்றுகள் — இந்த மென்பொருளின் கணிப்புகள் அல்ல.
        {' '}{hr.sourceTitle} — {hr.sourcePage}
      </p>
      <div className="space-y-4">
        {hr.houses.map((h: any) => (
          <article key={h.house} className="border border-line rounded-xl p-3 text-xs space-y-2">
            <h3 className="text-sm font-semibold text-ink">சனி {h.house}-ஆம் இடத்தில் <span className="font-normal text-ink-soft">— {h.namesTa}</span></h3>
            <p className="text-ink"><strong>முதன்மை உரை:</strong> {h.main.textTa} <span className="text-ink-soft">({h.main.page})</span></p>
            <p className="text-ink"><strong>சுந்தரானந்தர் — வளர்பிறை:</strong> {h.sundarananda.waxingTa}</p>
            <p className="text-ink"><strong>சுந்தரானந்தர் — தேய்பிறை (எனப் படித்தது):</strong> {h.sundarananda.waningTa} <span className="text-ink-soft">({h.sundarananda.page})</span></p>
            <div>
              <p className="font-semibold text-ink">இந்த ஜாதகத்தில் — ஒவ்வொரு முறையும், சுற்றுப் பலனுடன்</p>
              {h.periods.length === 0 && <p className="text-ink-soft">இந்தக் காலத்தில் இல்லை.</p>}
              <ul className="space-y-1 mt-1">
                {h.periods.map((p: any) => (
                  <li key={p.fromUtc}>
                    <span className="font-mono text-ink" style={{ fontVariantNumeric: 'tabular-nums' }}>{day(p.fromUtc)} – {day(p.toUtc)}</span>
                    <span className="text-ink-soft"> · {p.round}-ஆம் சுற்று</span>
                    <span className="block text-ink">{p.paryayaTa ?? 'நூல் மூன்று சுற்றுகளை மட்டுமே விவரிக்கிறது.'}{p.paryayaPage && <span className="text-ink-soft"> ({p.paryayaPage})</span>}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <ul className="text-[11px] text-amber-800 mt-3 space-y-0.5 list-disc ml-5">
        <li>{hr.notes.paryayaCountTa}</li>
        <li>{hr.notes.sundaranandaPrintTa}</li>
        <li>{hr.notes.disagreeTa}</li>
        <li>{hr.notes.missingPagesTa}</li>
      </ul>
    </section>
  );
}

function CyclesTable({ r }: { r: any }) {
  return (
    <div className="space-y-3">
      {r.sadeSati.map((c: any) => (
        <div key={c.ordinal} className="bg-surface border border-line rounded-2xl p-4 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-semibold text-ink">
              ஏழரைச் சனி — {c.ordinal}-ஆவது
              {c.inProgressAtBirth && <span className="text-xs font-normal text-ink-soft"> · பிறக்கும்போதே நடப்பில் இருந்தது</span>}
            </h3>
            <span className="font-mono text-xs text-ink" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {day(c.fromUtc)} – {day(c.toUtc)} · {yrs(c.years)} ஆண்டு
            </span>
          </div>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            {[12, 1, 2].map((h) => {
              const stays = c.stays.filter((s: any) => s.house === h);
              const phase = ({ 12: 'RISING', 1: 'PEAK', 2: 'SETTING' } as any)[h];
              return (
                <div key={h} className="contents">
                  <dt className="text-ink-soft whitespace-nowrap">
                    <span className="inline-block w-2.5 h-2.5 mr-1 align-middle" style={{ background: PHASE_COLOR[phase] }} />
                    {h}-ஆம் இடம்
                  </dt>
                  <dd className="text-ink font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {stays.map((s: any, i: number) => (
                      <span key={i}>{i > 0 && ' · '}{day(s.fromUtc)} – {day(s.toUtc)}
                        {s.enteredBy === 'RETROGRADE' ? ' (வக்கிரத் திரும்பல்)' : ''}</span>
                    ))}
                    <span className="text-ink-soft font-sans"> · {yrs((c.daysByHouse[h] ?? 0) / 365.25)} ஆண்டு</span>
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className="text-[11px] text-ink-soft mt-2">
            நூலின் கணக்கு: 90 மாதம் (7½ ஆண்டு). வானத்தின்படி உண்மை: {(c.years * 12).toFixed(0)} மாதம்
            {c.daysOutsideHouses > 1 && ` — இதில் சனி வக்கிரமாகப் பின்செல்லி இந்த மூன்று இடங்களுக்கு வெளியே இருந்தது ${Math.round(c.daysOutsideHouses)} நாட்கள்`}.
          </p>
          {c.book && (
            <p className="text-xs text-ink mt-2">{c.book.textTa}
              <span className="text-ink-soft"> ({c.book.citeTa})</span></p>
          )}
          <p className="text-xs text-ink mt-1">
            <span className="font-semibold">{r.moonRasi} ராசிக்கு நூலின் அரிஷ்ட அட்டவணை:</span>{' '}
            {c.arishtaPhases.map((p: string) => PHASE_TA[p]).join(' + ')}
            {c.arishtaEspecially.length > 0 && ` — குறிப்பாகக் கடுமை: ${c.arishtaEspecially.map((p: string) => PHASE_TA[p]).join(', ')}`}
            {c.arishtaReadingUncertain && (
              <span className="text-amber-700"> · அச்சிட்ட வாசகம் இருபொருள்படும்; இது எங்கள் வாசிப்பு</span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function SaturnTransitView() {
  const { activeProfile } = useWorkspace();
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [query, setQuery] = useState('');
  const [party, setParty] = useState<Party | null>(null);
  const [manual, setManual] = useState(false);
  const [kantaka, setKantaka] = useState('PARASHARAS_LIGHT');
  const [showAll, setShowAll] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (query.trim() ? searchCharts(query.trim(), 25) : listCharts(50))
      .then((r: any) => setRows(r)).catch(() => setRows([]));
  }, [query]);

  // The workspace's active profile seeds the person, confirmed against the
  // library first: it is remembered in browser storage and can outlive the
  // record it names.
  useEffect(() => {
    if (!activeProfile || party) return;
    let cancelled = false;
    openChart(activeProfile.profileId, activeProfile.revision)
      .then((p: any) => {
        if (cancelled || !p) return;
        setParty({
          kind: 'profile', profileId: p.profileId, revision: p.revision,
          label: `${p.name} · ${p.birthDate}${p.placeName ? ` · ${p.placeName}` : ''}`,
        });
      })
      .catch(() => { /* the picker below still works */ });
    return () => { cancelled = true; };
  }, [activeProfile, party]);

  const run = async (p: Party | null = party, conv: string = kantaka) => {
    if (!p) return;
    setLoading(true); setError(null);
    try {
      setResult(await computeSaturn(p.kind === 'profile'
        ? { profile: { profileId: p.profileId, revision: p.revision }, kantakaConvention: conv }
        : { form: p.input, kantakaConvention: conv }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const pick = (p: Party) => { setParty(p); setResult(null); setError(null); };

  // Whoever is chosen — by click, by form, or seeded from the workspace — is
  // computed at once, so a seeded profile never sits there with nothing shown.
  useEffect(() => {
    if (party) run(party, kantaka);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party]);
  const changeConvention = (conv: string) => { setKantaka(conv); if (party) run(party, conv); };

  const now = result?.now;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Saturn transit · Sade Sati</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          ஏழரைச் சனி · அஷ்டமச் சனி · கண்டகச் சனி
        </h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஜனன சந்திரன் இருக்கும் ராசியிலிருந்து கோசாரச் சனி எந்த இடத்தில் இருக்கிறது என்பதைக்
          கணக்கிடுகிறது. தேதிகள் கிரக நிலைப்படி கணிக்கப்பட்டவை; பெயர்கள் நூல்களின் பக்கங்களிலிருந்து
          எடுக்கப்பட்டவை. நூல்கள் கண்டகச் சனியில் ஒத்துப்போவதில்லை — அதனால் அந்த முறையை
          நீங்களே தேர்ந்தெடுக்கலாம்.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-semibold text-ink">யாருக்கு?</h2>
          {party && (
            <button type="button" onClick={() => { setParty(null); setResult(null); }}
              className="text-xs text-ink-soft hover:text-rose">மாற்று</button>
          )}
        </div>
        {party ? <p className="text-sm text-teal">✓ {party.label}</p> : manual ? (
          <>
            <BirthDataForm isLoading={loading}
              onSubmit={(bd) => pick({ kind: 'form', input: toInput(bd), label: bd.name || 'படிவ விவரம்' })} />
            <button type="button" onClick={() => setManual(false)} className="text-xs text-ink-soft mt-2 underline">
              சேமித்த சுயவிவரங்களிலிருந்து தேர்ந்தெடு
            </button>
          </>
        ) : (
          <>
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="சேமித்த சுயவிவரங்களில் தேடு (பெயர் / இடம்)"
              className="w-full mb-2 px-3 py-2 text-sm bg-surface-2 border border-line rounded-xl text-ink" />
            <ul className="max-h-48 overflow-y-auto divide-y divide-line/40 mb-2">
              {rows.length === 0 && <li className="text-xs text-ink-soft py-2">சேமித்த சுயவிவரம் இல்லை.</li>}
              {rows.map((r) => (
                <li key={r.profileId}>
                  <button type="button" className="w-full text-left py-1.5 text-sm text-ink hover:text-saffron"
                    onClick={() => pick({
                      kind: 'profile', profileId: r.profileId, revision: r.revision,
                      label: `${r.name} · ${r.birthDate}${r.placeName ? ` · ${r.placeName}` : ''}`,
                    })}>
                    {r.name}
                    <span className="text-xs text-ink-soft block">{r.birthDate}{r.placeName ? ` · ${r.placeName}` : ''}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setManual(true)} className="text-xs text-ink-soft underline">
              அல்லது பிறப்பு விவரத்தை நேரடியாக உள்ளிடு
            </button>
          </>
        )}
      </section>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold text-ink">
                {result.native.name ?? '(பெயர் இல்லை)'} · ஜனன சந்திரன் {result.moonRasi}
              </h2>
              <span className="text-xs text-ink-soft">
                {result.native.date} {result.native.time} (UTC{result.native.utcOffset}) · {result.native.placeName ?? '—'} ·{' '}
                {result.native.method.ayanamsha} அயனாம்சம்
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-soft">இப்போது ({day(now.atUtc)}):</span>
              <span className="text-sm text-ink">
                சனி {now.saturnRasi} — சந்திரனிலிருந்து <strong>{now.houseFromMoon}-ஆம் இடம்</strong>
              </span>
              {now.conditions.length === 0 ? (
                <span className="text-xs px-2 py-0.5 rounded bg-teal-soft text-teal">எந்தக் குறிப்பிட்ட சனிக் காலமும் இல்லை</span>
              ) : now.conditions.map((c: any) => (
                <span key={c.id} className="text-xs px-2 py-0.5 rounded bg-rose-soft text-rose font-semibold">
                  {COND_TA[c.id]}{c.phase ? ` — ${PHASE_TA[c.phase]}` : ''}
                </span>
              ))}
            </div>
            {result.activeSadeSati && (
              <p className="text-xs text-ink-soft mt-2">
                நடப்பில் உள்ள ஏழரைச் சனி {result.activeSadeSati.ordinal}-ஆவது: {day(result.activeSadeSati.fromUtc)} – {day(result.activeSadeSati.toUtc)}.
              </p>
            )}
            {!result.activeSadeSati && result.nextSadeSati && (
              <p className="text-xs text-ink-soft mt-2">
                அடுத்த ஏழரைச் சனி ({result.nextSadeSati.ordinal}-ஆவது): {day(result.nextSadeSati.fromUtc)} – {day(result.nextSadeSati.toUtc)}.
              </p>
            )}
            <p className="text-xs text-ink-soft mt-1">
              பிறக்கும்போது சனி {result.saturnAtBirth.saturnRasi} ({result.saturnAtBirth.houseFromMoon}-ஆம் இடம்).
            </p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
              <h2 className="text-sm font-semibold text-ink">வாழ்நாள் முழுவதும்</h2>
              <label className="text-xs text-ink-soft">
                கண்டகச் சனி — முறை
                <select value={kantaka} onChange={(e) => changeConvention(e.target.value)}
                  className="ml-2 px-2 py-1 text-xs bg-surface-2 border border-line rounded text-ink">
                  {result.conventions.kantakaAvailable.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.labelTa}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs text-ink-soft mb-2 cursor-pointer">
              <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
              கண்டகச் சனியின் எல்லா நூல் முறைகளையும் ஒரே நேரத்தில் காட்டு
            </label>
            <Timeline r={result} showAll={showAll} />
            <KantakaCompare r={result} />
          </section>

          <TamilAndEnglish r={result} />

          <VedhaSection r={result} />

          <section className="mb-4">
            <h2 className="text-sm font-semibold text-ink mb-2">ஏழரைச் சனி — ஒவ்வொரு சுற்றும்</h2>
            <CyclesTable r={result} />
          </section>

          <section className="grid md:grid-cols-3 gap-4 mb-4">
            <PeriodList title="அர்த்தாஷ்டமச் சனி (4-ஆம் இடம்)" periods={result.ardhashtama}
              note="விஷ்ணு பாஸ்கர், புலிப்பாணி" />
            <PeriodList title="அஷ்டமச் சனி (8-ஆம் இடம்)" periods={result.ashtama}
              note="விஷ்ணு பாஸ்கர், புலிப்பாணி, சுபகரன்" />
            <PeriodList title={`கண்டகச் சனி (${result.kantaka.houses.join(', ')}-ஆம் இடங்கள்)`}
              periods={result.kantaka.periods}
              note={result.conventions.kantakaAvailable.find((c: any) => c.id === result.kantaka.convention)?.labelTa} />
          </section>

          <HouseResults r={result} />

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
            <h2 className="text-sm font-semibold text-ink mb-2">ஏழரைச் சனியின் மூன்று கட்டங்கள் — நூல் என்ன சொல்கிறது</h2>
            <ul className="space-y-2 text-xs">
              {result.phases.map((p: any) => (
                <li key={p.phase}>
                  <span className="inline-block w-2.5 h-2.5 mr-1 align-middle" style={{ background: PHASE_COLOR[p.phase] }} />
                  <span className="font-semibold text-ink">{p.nameTa} — {p.bodyPart}</span>
                  <span className="text-ink"> · {p.resultTa}</span>
                  <span className="text-ink-soft block ml-4">{p.sourcePage}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-ink-soft mt-2">
              இவை நூலில் சொல்லப்பட்டவை; இந்த மென்பொருளின் கணிப்புகள் அல்ல.
            </p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
            <h2 className="text-sm font-semibold text-ink mb-1">பரிகாரம் — நூல்களில் பதிவானவை</h2>
            <p className="text-[11px] text-ink-soft mb-2">
              இவை இரு நூல்கள் குறிப்பிடும் வழக்கங்கள். இவை பலன் தரும் என்று இந்த மென்பொருள் கூறவில்லை;
              எதுவும் கணிக்கப்படவும் இல்லை. மந்திர வரிகள் இங்கு நகலெடுக்கப்படவில்லை — நூலைப் பார்க்கவும்.
            </p>
            <ul className="space-y-2 text-xs">
              {result.remedies.map((m: any) => (
                <li key={m.id}>
                  <span className="text-ink">{m.textTa}</span>
                  <span className="text-ink-soft block">
                    பொருந்தும்: {m.appliesTo.map((a: string) => COND_TA[a]).join(', ')} · {m.sourceTitle} — {m.sourcePage}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-4 text-xs space-y-2">
            <p className="font-semibold">இந்தக் கணிப்பு எப்படிச் செய்யப்பட்டது — எது உறுதி, எது இல்லை</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <strong>ராசி அடிப்படை.</strong> சனியின் இடம் ஜனன சந்திரனின் <em>ராசியிலிருந்து</em> எண்ணப்படுகிறது
                (பாகையிலிருந்து அல்ல). கே.டி. சுபகரன் தன் சொந்தக் கருத்தாகப் பாகை அடிப்படை ஒன்றைக் கூறுகிறார்;
                அது ஒரே ஆசிரியரின் கருத்து என்பதால் செயல்படுத்தப்படவில்லை.
              </li>
              <li>
                <strong>ஏழரைச் சனி (12, 1, 2), அர்த்தாஷ்டமம் (4), அஷ்டமம் (8)</strong> — நூல்கள் ஒத்துப்போகின்றன.
              </li>
              <li>
                <strong>கண்டகச் சனி — நூல்கள் ஒத்துப்போகவில்லை.</strong>{' '}
                {result.conventions.kantakaAvailable.map((c: any) => `${c.labelTa}`).join(' · ')}.
                4 மற்றும் 7 மூன்று நூல்களில் உள்ளன, அதனால் அதுவே இயல்புநிலை — இது எண்ணிக்கை மட்டுமே, எது சரி என்ற தீர்ப்பு அல்ல.
                புலிப்பாணி நூலே தன் முன்னுரையில் 8-ஐ மட்டும் சொல்கிறது.
              </li>
              <li>
                <strong>கால அளவு.</strong> நூல் 7½ ஆண்டு (90 மாதம்) என்கிறது. வானத்தில் சனியின் நீள்வட்டப் பாதையால் அது ராசிக்கு ராசி
                மாறுகிறது (இங்கு அளந்தபடி சுமார் 6.4 முதல் 8.9 ஆண்டு), வக்கிரப் பின்செல்லலும் சேர்ந்து.
              </li>
              <li>
                <strong>சுற்று எண்.</strong> பிறப்பிலிருந்து எண்ணப்படுகிறது; பிறக்கும்போது நடப்பில் இருந்தால் அதுவே முதலாவது. நூல்
                முதல் மூன்று சுற்றுகளை மட்டுமே விவரிக்கிறது.
              </li>
              <li>
                <strong>அரிஷ்ட அட்டவணை.</strong> விஷ்ணு பாஸ்கரின் அட்டவணையில் ஐந்து ராசிகளின் வரி இருபொருள்படும்; கட்டங்களுக்கான
                எங்கள் வாசிப்பு குறிக்கப்பட்டுள்ளது.
              </li>
            </ul>
            <details>
              <summary className="cursor-pointer font-semibold">ஒவ்வொரு வரையறையின் நூல் பக்கம்</summary>
              <ul className="mt-2 space-y-1.5">
                {Object.entries(result.definitions).map(([id, d]: [string, any]) => (
                  <li key={id}>
                    <span className="font-semibold">{d.nameTa} — {d.houses.join(', ')}-ஆம் இடம்</span>
                    {d.sources.map((s: any, i: number) => (
                      <span key={i} className="block ml-3 text-amber-800">{s.title}: {s.pageLocus}</span>
                    ))}
                  </li>
                ))}
                {result.conventions.kantakaAvailable.map((c: any) => (
                  <li key={c.id}>
                    <span className="font-semibold">கண்டகம் — {c.labelTa}</span>
                    <span className="block ml-3 text-amber-800">{c.sourceTitle}: {c.sourcePage}</span>
                    <span className="block ml-3 text-amber-800">{c.note}</span>
                  </li>
                ))}
              </ul>
            </details>
          </section>
        </>
      )}
    </main>
  );
}
