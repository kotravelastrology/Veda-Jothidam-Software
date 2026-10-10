'use client';

import { useEffect, useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { listCharts, searchCharts } from '../library/actions';
import { computeVedha } from './actions';
import type { BirthFormInput } from '../report/actions';
import { PLANET_TA, NATURE_TA, REASON_TA, cite, Cites, verdictTa, aspectTa, dignityTa, PhaladeepikaNowCell, Verse41Lines, BinduTablePicker } from './PhaladeepikaNow';

/**
 * Gochara vedha for all nine planets.
 *
 * Eight books print a vedha table; they agree on most cells and differ on a
 * few. Four print a complete table that reads without guessing, and those four
 * are computed — Phaladeepika (Sastri) by default, the classical text the
 * others follow (the owner's decision, 2026-10-10); the books are listed by how
 * much they explain. The differences are listed on the page with their pages,
 * and the dates are astronomy.
 */

interface LibraryRow {
  profileId: string; revision: number; name: string; birthDate: string; placeName: string | null;
}
type Party =
  | { kind: 'profile'; profileId: string; revision: number; label: string }
  | { kind: 'form'; input: BirthFormInput; label: string };

const KIND: Record<string, { ta: string; cls: string }> = {
  GOOD: { ta: 'நல்ல இடம்', cls: 'text-teal' },
  GOOD_UNPAIRED: { ta: 'நல்ல இடம் — வேதை இடம் இல்லை', cls: 'text-teal' },
  RELIEVABLE: { ta: 'தீய இடம் — விபரீத வேதை இடம் உண்டு', cls: 'text-amber-700' },
  NO_RELIEF: { ta: 'தீய இடம் — விபரீத வேதை இடம் இல்லை', cls: 'text-rose' },
  NOT_COVERED: { ta: 'இந்த நூலின் அட்டவணையில் இந்தக் கிரகம் இல்லை', cls: 'text-ink-soft' },
};
const STATUS_TA: Record<string, string> = { COUNTS: '', EXEMPT: ' (விலக்கு — கணக்கில் இல்லை)', NODE_PAIR: ' (எதிர்க் கணு — கணக்கில் இல்லை)' };
const BOOK_TA: Record<string, string> = {
  PULIPPANI: 'புலிப்பாணி', SANTHANAM: 'சந்தானம்', JATAKA_PARIJATA: 'ஜாதக பாரிஜாதம்', SUDAMANI: 'சூடாமணி', KALAPRAKASIKA: 'காலப்பிரகாசிகை', VISHNU_BHASKAR: 'விஷ்ணு பாஸ்கர்',
  PHALADEEPIKA_SASTRI: 'பலதீபிகை (சாஸ்திரி)', PHALADEEPIKA_KAPOOR: 'பலதீபிகை (கபூர்)',
};
const houses = (hs: number[]) => hs.join(' / ');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

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
const num = { fontVariantNumeric: 'tabular-nums' as const };

function verdict(now: any) {
  if (now.kind === 'GOOD') return now.active ? { ta: 'வேதை நடப்பில் — நல்ல பலன் தடைபடும்', cls: 'text-rose' } : { ta: 'நல்ல பலன் — தடை இல்லை', cls: 'text-teal' };
  if (now.kind === 'GOOD_UNPAIRED') return { ta: 'நல்ல பலன்', cls: 'text-teal' };
  if (now.kind === 'RELIEVABLE') return now.active ? { ta: 'விபரீத வேதை நடப்பில் — தீமை நீங்கும்', cls: 'text-teal' } : { ta: 'தீய பலன் — விடுவிக்கும் கிரகம் இப்போது இல்லை', cls: 'text-amber-700' };
  if (now.kind === 'NOT_COVERED') return { ta: '—', cls: 'text-ink-soft' };
  return { ta: 'தீய பலன்', cls: 'text-rose' };
}

function NowTable({ r, method, table }: { r: any; method: string; table: string }) {
  const m = r.methods[method];
  const others = Object.keys(r.methods).filter((k) => k !== method);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ minWidth: 980 }}>
        <thead><tr className="text-ink-soft border-b border-line text-left">
          <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">ராசி · இடம்</th><th className="py-1 pr-2">வகை</th>
          <th className="py-1 pr-2">இணை இடம் · அங்கே இப்போது</th><th className="py-1 pr-2">இப்போது</th><th className="py-1">பலதீபிகை (26.9-41)</th>
        </tr></thead>
        <tbody className="align-top">
          {Object.values(m.planets).map((p: any) => {
            const n = p.now;
            const v = verdict(n);
            const differing = others.map((k) => ({ k, o: r.methods[k].planets[p.planet].now }))
              .filter(({ o }) => o.kind !== n.kind || houses(o.pairedHouses) !== houses(n.pairedHouses) || o.active !== n.active);
            return (
              <tr key={p.planet} className="border-b border-line/40">
                <td className="py-1.5 pr-2 font-semibold text-ink">{p.planetTa}</td>
                <td className="py-1.5 pr-2 text-ink">{n.rasi} · {n.house}</td>
                <td className={`py-1.5 pr-2 ${KIND[n.kind].cls}`}>{KIND[n.kind].ta}</td>
                <td className="py-1.5 pr-2 text-ink">
                  {n.pairedHouses.length ? <>{houses(n.pairedHouses)}-ஆம் இடம் · {n.planetsInPaired.length ? n.planetsInPaired.map((x: any) => `${x.planetTa}${STATUS_TA[x.status]}`).join(', ') : 'யாரும் இல்லை'}</> : '—'}
                </td>
                <td className={`py-1.5 pr-2 ${v.cls}`}>
                  {v.ta}
                  {differing.map(({ k, o }) => (
                    <span key={k} className="block text-amber-800">
                      {BOOK_TA[k]} படி: {o.kind === 'NOT_COVERED' ? KIND.NOT_COVERED.ta : verdict(o).ta}{o.pairedHouses.length && houses(o.pairedHouses) !== houses(n.pairedHouses) ? ` (இணை ${houses(o.pairedHouses)})` : ''}
                    </span>
                  ))}
                </td>
                <td className="py-1.5 text-ink">
                  <PhaladeepikaNowCell pd={r.phaladeepika} n={r.phaladeepika.planets[p.planet].now} table={table} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Timeline({ p, pd, table }: { p: any; pd: any; table: string }) {
  if (p.notCovered) return <p className="text-xs text-ink-soft">{KIND.NOT_COVERED.ta}.</p>;
  const third = pd.decanate[p.planet];
  return (
    <div className="overflow-x-auto">
      <p className="text-[11px] text-ink-soft mb-1">
        காலம் {day(p.span.fromUtc)} – {day(p.span.toUtc)} · நல்ல இடங்கள் {p.good.join(', ')}
        {Object.keys(p.relievedBy).length > 0 && <> · விபரீத வேதை: {Object.entries(p.relievedBy).map(([b, g]) => `${b}→${houses(g as number[])}`).join(', ')}</>}
        {' '}· பலதீபிகை ஸ்லோ. 25: {third === undefined ? 'கேது சொல்லப்படவில்லை' : third === null ? 'ராசி முழுவதும் பலன்' : `பலன் தரும் பகுதி ${pd.decanateTa[third]}`}
      </p>
      <table className="w-full text-xs" style={{ minWidth: 980 }}>
        <thead><tr className="text-ink-soft border-b border-line text-left">
          <th className="py-1 pr-2">காலம்</th><th className="py-1 pr-2">ராசி · இடம்</th><th className="py-1 pr-2">வகை</th>
          <th className="py-1 pr-2">இணை இடத்தில் கிரகங்கள்</th><th className="py-1 pr-2">மொத்தம் · சந்திரன்</th><th className="py-1">பலதீபிகை (26.9-25, 30-33, 41)</th>
        </tr></thead>
        <tbody className="align-top">
          {p.stays.map((s: any, i: number) => (
            <tr key={s.fromUtc} className={`border-b border-line/40 ${s.current ? 'bg-amber-50' : ''}`}>
              <td className="py-1.5 pr-2 font-mono text-ink whitespace-nowrap" style={num}>
                {day(s.fromUtc)} – {day(s.toUtc)}{s.current && <span className="block font-sans text-amber-800">இப்போது</span>}
              </td>
              <td className="py-1.5 pr-2 text-ink">{s.rasi} · {s.house}</td>
              <td className={`py-1.5 pr-2 ${KIND[s.kind].cls}`}>{KIND[s.kind].ta}{s.pairedHouses.length > 0 && <span className="block text-ink-soft">இணை: {houses(s.pairedHouses)}{s.pairedHouses.includes(s.house) ? ' (அதே இடம் = உடன் செல்லும் கிரகம்)' : ''}</span>}</td>
              <td className="py-1.5 pr-2 text-ink">
                {s.pairedHouses.length ? (
                  <>
                    {s.byPlanet.length === 0 && <span className="text-ink-soft">இல்லை</span>}
                    {s.byPlanet.map((b: any) => (
                      <span key={b.planet} className="block"><strong>{b.planetTa}</strong>{' '}
                        <span className="font-mono" style={num}>{b.windows.map((w: any) => `${day(w.fromUtc)}–${day(w.toUtc)}`).join(', ')}</span>
                      </span>
                    ))}
                    {s.exempt.map((b: any) => <span key={b.planet} className="block text-ink-soft">{b.planetTa} — விலக்கு, கணக்கில் இல்லை</span>)}
                    {s.nodePair && <span className="block text-ink-soft">{s.nodePair.planetTa} — எதிர்க் கணு, கணக்கில் இல்லை</span>}
                  </>
                ) : <span className="text-ink-soft">—</span>}
              </td>
              <td className="py-1.5 pr-2 font-mono text-ink" style={num}>
                {s.pairedHouses.length ? `${Math.round(s.coveredDays)} / ${Math.round(s.days)} நாள்` : `${Math.round(s.days)} நாள்`}
                {s.moon && <span className="block font-sans text-ink-soft">சந்திரன் {s.moon.count} முறை</span>}
              </td>
              <td className="py-1.5 text-ink">
                {(() => {
                  const ps = pd.planets[p.planet].stays[i];
                  const dt = dignityTa(ps.dignity);
                  const combustVerdict = ps.combust?.length ? (ps.goodHouse ? 'நல்ல பலன் இல்லாமல் போகும்' : 'மிகுந்த கஷ்டம்') : null;
                  return (
                    <>
                      {ps.resultTa ?? <span className="text-ink-soft">—</span>}
                      {Array.isArray(ps.effective) && (
                        <span className="block text-[11px] text-ink-soft font-mono" style={num}>
                          பலன் தரும் பகுதி: {ps.effective.length ? ps.effective.map((w: any) => `${day(w.fromUtc)}–${day(w.toUtc)}`).join(', ') : 'இந்தக் காலத்தில் இல்லை'}
                        </span>
                      )}
                      {dt && <span className="block text-[11px] text-ink-soft">{dt}</span>}
                      {verdictTa(ps.bySign).map((x) => <span key={x.ta} className={`block text-[11px] ${x.cls}`}>{x.ta}</span>)}
                      {combustVerdict && (
                        <span className={`block text-[11px] ${ps.goodHouse ? 'text-amber-700' : 'text-rose'}`}>
                          ஸ்லோ. 32 அஸ்தங்கம்: <span className="font-mono" style={num}>{ps.combust.map((w: any) => `${day(w.fromUtc)}–${day(w.toUtc)}`).join(', ')}</span> — {combustVerdict}
                        </span>
                      )}
                      {ps.dangerVerse33 && <span className="block text-[11px] text-rose">ஸ்லோ. 33: 12/8/1-ல் — உயிருக்கு ஐயம், பதவி வீழ்ச்சி, பண இழப்பு (நூலின் கூற்று)</span>}
                      {ps.bindus && <Verse41Lines b={ps.bindus[table]} goodHouse={ps.goodHouse} />}
                      {ps.aspects.by.length > 0 && (
                        <details className="text-[11px] mt-0.5">
                          <summary className="cursor-pointer text-ink-soft">ஸ்லோ. 30 பார்வைகள் ({ps.aspects.by.length}{ps.aspects.moonPasses ? `, சந்திரன் ${ps.aspects.moonPasses} முறை` : ''})</summary>
                          {ps.aspects.by.map((x: any) => {
                            const t = aspectTa(x);
                            return (
                              <span key={`${x.planet}${x.nature}`} className={`block ${t.effects.length ? 'text-amber-700' : 'text-ink-soft'}`}>
                                {t.label} <span className="font-mono" style={num}>{x.windows.map((w: any) => `${day(w.fromUtc)}–${day(w.toUtc)}`).join(', ')}</span>{t.effects.length ? ` — ${t.effects.join('; ')}` : ''}
                              </span>
                            );
                          })}
                        </details>
                      )}
                    </>
                  );
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SURVEY_TA: Record<string, string> = { SAV_28: 'சர்வாஷ்டகம் 28-க்கு மேல்', BAV_5: 'சொந்தம் 5 அல்லது மேல்', BAV_4: 'சொந்தம் 4 அல்லது மேல்' };

/** Verse 41: the two readings and who meets each now, the table in use, XXIII.11, and what each book says. */
function Verse41Rule({ pd, table, setTable, noteTa }: { pd: any; table: string; setTable: (id: string) => void; noteTa: string }) {
  const b = pd.bindu;
  const hits = (id: string) => Object.entries(pd.planets)
    .filter(([, x]: [string, any]) => x.now.bindus?.[table]?.[id === 'SAV_28' ? 'bySav' : 'byBav'])
    .map(([p, x]: [string, any]) => `${PLANET_TA[p]} (${x.now.house}-ல், ${id === 'SAV_28' ? x.now.bindus[table].sav : `${x.now.bindus[table].bav}/8`}${x.now.goodHouse ? '' : ' — தீய இடம்'})`);
  return (
    <>
      <span className="block text-ink-soft">{noteTa}</span>
      <span className="block mt-1"><BinduTablePicker meta={b} value={table} onChange={setTable} /></span>
      <span className="block text-ink-soft">{b.tables[table].noteTa}</span>
      <Cites list={b.tableSources[table]} />
      {Object.keys(b.readings).map((id) => (
        <span key={id} className="block mt-1.5">
          <strong>{b.readings[id].labelTa}{id === b.defaultReading ? ' (இயல்பு)' : ''}</strong> — இப்போது: {hits(id).join(', ') || 'எந்தக் கிரகமும் இல்லை'}.
          <span className="block text-ink-soft">{b.readingTexts[id].textTa}</span>
          <Cites list={b.readingTexts[id].sources} />
        </span>
      ))}
      <span className="block text-ink-soft mt-1.5">
        சர்வாஷ்டகம் ({b.tables[table].labelTa}), மேஷம் முதல் மீனம் வரை: <span className="font-mono" style={num}>{b.sav[table].join(', ')}</span> — மொத்தம் {b.sav[table].reduce((a: number, x: number) => a + x, 0)}
      </span>
      <details className="mt-1">
        <summary className="cursor-pointer text-ink-soft">XXIII.11 — சொந்த அஷ்டகவர்க்கப் பரல் எண்ணிக்கைக்குப் பலன்</summary>
        <span className="block text-ink-soft">{b.resultsTa.map((t: string, i: number) => `${i}: ${t}`).join(' · ')} (நூலின் கூற்று)</span>
        <Cites list={[b.resultsSource]} />
      </details>
      <details className="mt-1">
        <summary className="cursor-pointer text-ink-soft">"அதிக பரல்" எத்தனை — நூல்கள் சொல்வது ({b.survey.length})</summary>
        <ul className="list-disc ml-5 mt-1 space-y-0.5 text-ink-soft">
          {b.survey.map((s: any) => <li key={s.bookTa}><span className="text-ink">{s.bookTa}</span> [{SURVEY_TA[s.reading]}]: {s.saysTa}</li>)}
        </ul>
        <p className="text-ink-soft mt-1">{b.fourNote.textTa}</p>
        <ul className="list-disc ml-5 mt-1 space-y-0.5 text-ink-soft">{b.notesTa.map((t: string) => <li key={t}>{t}</li>)}</ul>
        <Cites list={[...b.fourNote.sources, ...b.surveySources]} />
      </details>
    </>
  );
}

/** Phaladeepika XXVI: the house results' sources, verse 25, and the rules of verses 30-34 and 41. */
function PhaladeepikaRules({ r, m, table, setTable }: { r: any; m: any; table: string; setTable: (id: string) => void }) {
  const pd = r.phaladeepika;
  const v33 = pd.rules.find((x: any) => x.id === 'DANGER_12_8_1');
  const now33 = v33.planets.filter((p: string) => v33.houses.includes(m.planets[p].now.house));
  const v34 = pd.verse34Now;
  const nowBy = (key: 'v31' | 'v32') => Object.entries(pd.planets).filter(([, x]: [string, any]) => x.now.verdict[key])
    .map(([p, x]: [string, any]) => `${PLANET_TA[p]} (${x.now.house}-ல் ${key === 'v31' ? dignityTa(x.now.dignity) : x.now.verdict.reasons.map((r: string) => REASON_TA[r]).join(', ')}: ${verdictTa(x.now.verdict).filter((v) => v.ta.startsWith(key === 'v31' ? 'ஸ்லோ. 31' : 'ஸ்லோ. 32')).map((v) => v.ta.split(' — ')[1]).join('')})`);
  const now31 = nowBy('v31');
  const now32 = nowBy('v32');
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="text-sm font-semibold text-ink mb-1">பலதீபிகை அத். 26 — ராசிவாரிப் பலன், பலன் தரும் பகுதி, பொது விதிகள்</h2>
      <p className="text-[11px] text-ink-soft mb-2">
        மேலே உள்ள அட்டவணைகளின் "பலதீபிகை" நெடுவரிசை — ஒவ்வொரு கிரகமும் சந்திரனிலிருந்து ஒவ்வொரு இடத்திலும் தரும் பலன் (ஸ்லோ. {Object.entries(pd.verseOf).map(([p, v]) => `${PLANET_TA[p]} ${v}`).join(', ')}). {pd.ketuNoteTa} இவை நூலின் கூற்றுகள் — இந்த மென்பொருளின் முன்கணிப்பு அல்ல.
      </p>
      <Cites list={pd.houseResultsSources} />
      <p className="text-xs font-semibold text-ink mt-3">ஸ்லோகம் 25 — பலன் தரும் பகுதி</p>
      <p className="text-xs text-ink">
        செவ்வாய், சூரியன் — {pd.decanateTa[0]}; குரு, சுக்கிரன் — {pd.decanateTa[1]}; சந்திரன், சனி — {pd.decanateTa[2]}; புதன், ராகு — ராசி முழுவதும். விஷ்ணு பாஸ்கரும் அதையே சொல்கிறார். கிரகம் அந்தப் பகுதியில் இருக்கும் நாட்கள் மேலே ஒவ்வொரு காலத்துக்கும் காட்டப்படுகின்றன.
      </p>
      <Cites list={pd.decanateSources} />
      <p className="text-xs font-semibold text-ink mt-3">ஸ்லோகம் 30-34, 41</p>
      <ul className="text-xs space-y-1.5 mt-1">
        {pd.rules.map((ru: any) => (
          <li key={ru.id} className="text-ink">
            <strong>ஸ்லோ. {ru.verse}:</strong> {ru.textTa}
            {ru.id === 'DANGER_12_8_1' && (
              <span className={`block ${now33.length ? 'text-rose' : 'text-ink-soft'}`}>
                இப்போது: {now33.length ? now33.map((p: string) => `${PLANET_TA[p]} (${m.planets[p].now.house})`).join(', ') : 'இந்த நான்கில் எதுவும் 12, 8, 1-ல் இல்லை'}. {ru.noteTa}
              </span>
            )}
            {ru.id === 'ALL_EIGHT' && (
              <span className="block text-ink-soft">
                இப்போது எட்டில் {v34.met} நிலைகள் பொருந்துகின்றன{v34.all ? ' — எல்லாம்' : ''} ({v34.positions.map((x: any) => `${x.planetTa} ${x.nowHouse}${x.nowHouse === x.house ? '✓' : `/${x.house}`}`).join(', ')}).
              </span>
            )}
            {ru.id === 'ASPECT' && (
              <>
                <span className="block text-ink-soft">
                  இப்போது: {(() => {
                    const hits = Object.entries(pd.planets).flatMap(([p, x]: [string, any]) => x.now.aspects.filter((a: any) => a.full && (a.voids || a.enemy))
                      .map((a: any) => `${PLANET_TA[p]} ← ${aspectTa(a).label}: ${aspectTa(a).effects.join('; ')}`));
                    return hits.length ? hits.join(' · ') : 'ஸ்லோ. 30 பொருந்தும் பார்வை இல்லை';
                  })()}. சந்திரன் இப்போது {NATURE_TA[pd.moonNow.nature]} (சூரியனிலிருந்து {pd.moonNow.elongation}°), புதன் {NATURE_TA[pd.mercuryNow.nature]}. {ru.noteTa}
                </span>
                <details className="mt-1">
                  <summary className="cursor-pointer text-ink-soft">வரையறைகள் — பார்வை, சுப / பாபர்</summary>
                  <ul className="list-disc ml-5 mt-1 space-y-0.5 text-ink-soft">{pd.aspectReadingsTa.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
                  <Cites list={Object.values(pd.aspectSources)} />
                </details>
              </>
            )}
            {ru.id === 'OWN_EXALTED' && <span className="block text-ink-soft">இப்போது: {now31.length ? now31.join('; ') : 'எந்தக் கிரகமும் உச்சத்திலோ சொந்த வீட்டிலோ இல்லை'}. {ru.noteTa}</span>}
            {ru.id === 'DEBILITATED' && <span className="block text-ink-soft">இப்போது: {now32.length ? now32.join('; ') : 'எந்தக் கிரகமும் நீசம், பகை வீடு, அஸ்தங்கத்தில் இல்லை'}. {ru.noteTa}</span>}
            {!ru.computed && <span className="block text-ink-soft">{ru.whyNotTa}</span>}
            {ru.id === 'BINDUS' && pd.bindu && <Verse41Rule pd={pd} table={table} setTable={setTable} noteTa={ru.noteTa} />}
            <Cites list={[ru.source, ...(ru.kapoor ? [ru.kapoor] : [])]} />
            {ru.id === 'DEBILITATED' && (
              <details className="mt-1">
                <summary className="cursor-pointer text-ink-soft">வரையறைகள் — உச்சம், சொந்த வீடு, நீசம், பகை வீடு, அஸ்தங்கப் பாகைகள்</summary>
                <ul className="list-disc ml-5 mt-1 space-y-0.5 text-ink-soft">{pd.dignityReadingsTa.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
                <p className="text-ink-soft mt-1">அஸ்தங்கம், சூரியனிலிருந்து: {Object.entries(pd.combustionDegrees).map(([p, d]: [string, any]) => `${PLANET_TA[p]} ${Array.isArray(d) ? `${d[0]}° (வக்கிரம் ${d[1]}°)` : `${d}°`}`).join(', ')}.</p>
                <Cites list={Object.values(pd.dignitySources)} />
              </details>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function NakshatraSection({ n }: { n: any }) {
  const [all, setAll] = useState(false);
  const at = Date.parse(n.atUtc);
  const horizon = at + 5 * 365.25 * 86400000;
  const shown = (ws: any[]) => (all ? ws : ws.filter((w) => Date.parse(w.toUtc) > at && Date.parse(w.fromUtc) < horizon));
  const upcoming = n.rows.flatMap((r: any) => r.windows.filter((w: any) => Date.parse(w.fromUtc) > at && w.planet !== 'Moon').map((w: any) => ({ ...w, row: r })))
    .sort((a: any, b: any) => Date.parse(a.fromUtc) - Date.parse(b.fromUtc)).slice(0, 6);
  const active = n.rows.filter((r: any) => r.activeNow.length);
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="text-sm font-semibold text-ink mb-1">நட்சத்திர வேதை — பிறப்பு நட்சத்திரங்களிலிருந்து (16 நிலைகள்)</h2>
      <p className="text-[11px] text-ink-soft mb-2">
        ராசி வேதை சந்திர ராசியிலிருந்து வீடுகளை எண்ணுகிறது; நட்சத்திர வேதை ஒவ்வொரு கிரகமும் பிறப்பில் நின்ற நட்சத்திரத்திலிருந்து நட்சத்திரங்களை எண்ணுகிறது.
        வரிசை: {n.rank.measureTa} {n.notes.countingTa}
      </p>
      <div className="border border-saffron rounded-xl p-3 mb-3 text-xs">
        {active.length
          ? active.map((r: any) => (
            <p key={r.id} className="text-rose">இப்போது: {r.activeNow.map((p: string) => PLANET_TA[p]).join(', ')} → {r.targetTa} நட்சத்திரம் (பிறப்பு {r.natalTa} நின்ற {r.natalNakshatraTa}விலிருந்து {r.count}-வது)</p>
          ))
          : <p className="text-ink">இப்போது ({day(n.atUtc)}) எந்த நட்சத்திர வேதையும் நடப்பில் இல்லை.</p>}
        {upcoming.length > 0 && (
          <p className="text-ink-soft mt-1">அடுத்து (சந்திரன் தவிர): {upcoming.map((u: any) => `${day(u.fromUtc)} ${u.planetTa} → ${u.row.targetTa} (பிறப்பு ${u.row.natalTa} நட்சத்திரத்திலிருந்து ${u.row.count}-வது)`).join(' · ')}</p>
        )}
      </div>
      <label className="flex items-center gap-2 text-xs text-ink-soft mb-2 cursor-pointer">
        <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />
        முழுக் காலமும் காட்டு ({day(n.window.fromUtc)} – {day(n.window.toUtc)}); இல்லையெனில் இன்றிலிருந்து 5 ஆண்டுகள்
      </label>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 760 }}>
          <thead><tr className="text-ink-soft border-b border-line text-left">
            <th className="py-1 pr-2">பிறப்பு கிரகம் · நட்சத்திரம்</th><th className="py-1 pr-2">எண்ணி · வேதை நட்சத்திரம்</th>
            <th className="py-1 pr-2">வேதை செய்யும் கிரகம்</th><th className="py-1">காலங்கள்</th>
          </tr></thead>
          <tbody className="align-top">
            {n.rows.map((r: any) => {
              const ws = shown(r.windows);
              return (
                <tr key={r.id} className={`border-b border-line/40 ${r.activeNow.length ? 'bg-amber-50' : ''}`}>
                  <td className="py-1.5 pr-2 text-ink">{r.natalTa}{r.countedFrom && <span className="text-ink-soft"> (ராகு/கேது வரி)</span>} · {r.natalNakshatraTa}</td>
                  <td className="py-1.5 pr-2 text-ink">{r.count}-வது · {r.targetTa}</td>
                  <td className="py-1.5 pr-2 text-ink">{r.byTa.join(' / ')}</td>
                  <td className="py-1.5 font-mono text-ink" style={num}>
                    {ws.length === 0 && <span className="font-sans text-ink-soft">இந்தக் காலத்தில் இல்லை</span>}
                    {ws.map((w: any) => (
                      <span key={`${w.planet}${w.fromUtc}`} className={`block ${w.current ? 'text-rose' : ''}`}>
                        {r.by.length > 1 && <span className="font-sans">{w.planetTa} </span>}{day(w.fromUtc)} – {day(w.toUtc)}{w.current ? ' · இப்போது' : ''}
                      </span>
                    ))}
                    {r.spanOfMoon && <span className="block font-sans text-ink-soft">சந்திரன்: {day(r.spanOfMoon.fromUtc)} – {day(r.spanOfMoon.toUtc)} மட்டும்</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 space-y-2 text-xs">
        <p className="font-semibold text-ink">நூல்கள் சொல்வது (அதிக விளக்கம் உள்ளது முதலில்)</p>
        {n.readings.map((b: any) => (
          <div key={b.book} className="border border-line rounded-lg p-2">
            <p className="font-semibold text-ink">{b.bookTa}</p>
            <ul className="list-disc ml-5 space-y-0.5">{b.items.map((it: any) => <li key={it.id} className="text-ink">{it.textTa}</li>)}</ul>
            <Cites list={[...new Map(b.items.map((it: any) => [it.source.pageLocus, it.source])).values()]} />
          </div>
        ))}
        <ul className="text-[11px] text-ink-soft list-disc ml-5 space-y-0.5">
          <li className="text-amber-800">{n.notes.readingsDifferTa}</li>
          <li>{n.notes.nodesNatalTa}</li>
          <li>{n.notes.nodesByTa}</li>
          <li>{n.notes.moonTa}</li>
          <li>{n.notes.directionalTa}</li>
        </ul>
      </div>
    </section>
  );
}

const BOOK_NAME_TA: Record<string, string> = { BHAT: 'பட் (ஜோதிட அடிப்படைகள்)', PULIPPANI: 'புலிப்பாணி', GOUR: 'கௌர்', PHALADEEPIKA: 'பலதீபிகை (மந்த்ரேஸ்வரர் — சாஸ்திரி)' };

function SaptashalakaSection({ s }: { s: any }) {
  const [reading, setReading] = useState<string>(s.defaultReading);
  const [all, setAll] = useState(false);
  const at = Date.parse(s.atUtc);
  const horizon = at + 5 * 365.25 * 86400000;
  const keep = (ws: any[]) => (all ? ws : ws.filter((w) => Date.parse(w.toUtc) > at && Date.parse(w.fromUtc) < horizon));
  const r = s.readings[reading];
  const hitTa = (h: any) => `${s.natal[h.target].labelTa}${h.line === 'DIAGONAL' ? ' (மூலைவிட்டம்)' : ''}`;
  const rule = (id: string) => s.rules.find((x: any) => x.id === id);
  const Books = ({ id }: { id: string }) => {
    const ru = rule(id);
    return (
      <details className="mt-1 text-xs">
        <summary className="cursor-pointer text-ink-soft">நூல்கள் சொல்வது (அதிக விளக்கம் உள்ளது முதலில்)</summary>
        <ul className="mt-1 space-y-1">
          {ru.books.map((b: any) => (
            <li key={b.book} className="text-ink"><strong>{BOOK_NAME_TA[b.book]}:</strong> {b.textTa}<Cites list={[b.source]} /></li>
          ))}
        </ul>
        <p className="text-ink-soft mt-1">{ru.readingTa}</p>
        {ru.vainashika && <p className="text-ink-soft mt-1">{ru.vainashika.textTa}<Cites list={ru.vainashika.sources} /></p>}
        {id === 'SUN_VEDHA' && <p className="text-ink-soft mt-1">{s.notes.pulippaniQuotesTa}</p>}
      </details>
    );
  };
  const Win = ({ w }: { w: any }) => (
    <span className="font-mono" style={num}>{day(w.fromUtc)} – {day(w.toUtc)}{w.current ? ' · இப்போது' : ''}</span>
  );
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="text-sm font-semibold text-ink mb-1">சப்தசலாகைச் சக்கரம் — நட்சத்திரக் கோசாரம்</h2>
      <p className="text-[11px] text-ink-soft mb-2">
        ஏழு நெடுக்குக் கோடு, ஏழு குறுக்குக் கோடுகளின் 28 முனைகளில் கார்த்திகை முதல் 28 நட்சத்திரங்கள் (அபிஜித் உட்பட). ஒரே கோட்டின் இரு முனை நட்சத்திரங்கள் ஒன்றுக்கொன்று வேதை.
        வரிசை: {s.rank.measureTa} {s.notes.countingTa} {s.notes.abhijitTa}
      </p>
      <p className="text-[11px] text-amber-800 mb-2">{s.notes.disclaimerTa}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {Object.keys(s.readings).map((id) => (
          <button key={id} type="button" onClick={() => setReading(id)}
            className={`text-xs px-2 py-1 rounded border ${id === reading ? 'border-saffron bg-amber-50 text-ink font-semibold' : 'border-line text-ink-soft'}`}>
            {s.readings[id].labelTa}
          </button>
        ))}
      </div>
      <Cites list={[...r.sources, s.abhijitSource]} />
      <div className="text-xs text-ink my-2 space-y-0.5">
        {Object.entries(s.natal).map(([tid, n]: [string, any]) => (
          <p key={tid}><strong>{n.labelTa}</strong>: {n.starTa} → வேதை நட்சத்திரம் {r.vedhaStars[tid].map((v: any) => `${v.starTa}${v.line === 'DIAGONAL' ? ' (மூலைவிட்டம்)' : ''}`).join(', ')}</p>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs text-ink-soft mb-2 cursor-pointer">
        <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />
        முழுக் காலமும் காட்டு ({day(s.window.fromUtc)} – {day(s.window.toUtc)}); இல்லையெனில் இன்றிலிருந்து 5 ஆண்டுகள்
      </label>

      <h3 className="text-xs font-semibold text-ink mt-3">{rule('SUN_VEDHA').titleTa}</h3>
      <ul className="text-xs space-y-0.5 mt-1">
        {keep(r.sun).length === 0 && <li className="text-ink-soft">இந்தக் காலத்தில் இல்லை.</li>}
        {keep(r.sun).map((w: any) => (
          <li key={w.fromUtc} className={w.current ? 'text-rose' : 'text-ink'}>
            <Win w={w} /> · {w.starTa} · {w.hits.map(hitTa).join(', ')}
            {w.maleficWithSun.length > 0 && <span className="text-amber-800"> · அதே ராசியில் {w.maleficWithSun.map((m: any) => `${m.planetTa} (${m.days} நாள்)`).join(', ')}</span>}
          </li>
        ))}
      </ul>
      <Books id="SUN_VEDHA" />

      <h3 className="text-xs font-semibold text-ink mt-3">{rule('OTHERS_VEDHA').titleTa}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 640 }}>
          <thead><tr className="text-ink-soft border-b border-line text-left">
            <th className="py-1 pr-2">காலம்</th><th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">நட்சத்திரம்</th><th className="py-1">எதற்கு வேதை</th>
          </tr></thead>
          <tbody>
            {keep(r.others).map((w: any) => (
              <tr key={`${w.planet}${w.fromUtc}`} className={`border-b border-line/40 ${w.current ? 'bg-amber-50' : ''}`}>
                <td className="py-1 pr-2 whitespace-nowrap"><Win w={w} /></td>
                <td className={`py-1 pr-2 ${w.nature === 'MALEFIC' ? 'text-rose' : 'text-teal'}`}>{w.planetTa} ({NATURE_TA[w.nature]})</td>
                <td className="py-1 pr-2 text-ink">{w.starTa}</td>
                <td className="py-1 text-ink">{w.hits.map(hitTa).join(', ')}{w.nature === 'MALEFIC' && w.beneficAlsoDays > 0 && <span className="text-ink-soft"> · சுபக் கிரகமும் {Math.round(w.beneficAlsoDays)} நாள்</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Books id="OTHERS_VEDHA" />

      <h3 className="text-xs font-semibold text-ink mt-3">{rule('OCCUPATION').titleTa}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 560 }}>
          <thead><tr className="text-ink-soft border-b border-line text-left">
            <th className="py-1 pr-2">காலம்</th><th className="py-1 pr-2">கிரகம்</th><th className="py-1">நட்சத்திரம் · ஜன்மத்திலிருந்து</th>
          </tr></thead>
          <tbody>
            {keep(s.occupation).map((w: any) => (
              <tr key={`${w.planet}${w.fromUtc}`} className={`border-b border-line/40 ${w.current ? 'bg-amber-50' : ''}`}>
                <td className="py-1 pr-2 whitespace-nowrap"><Win w={w} /></td>
                <td className={`py-1 pr-2 ${w.nature === 'MALEFIC' ? 'text-rose' : 'text-teal'}`}>{w.planetTa} ({NATURE_TA[w.nature]})</td>
                <td className="py-1 text-ink">{w.starTa} · {w.count}-வது{w.vainashikaAlternative && <span className="text-ink-soft"> (வைநாசிகம் — காலப்பிரகாசிகை, கௌர் வாசிப்பு)</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Books id="OCCUPATION" />

      <h3 className="text-xs font-semibold text-ink mt-3">{rule('ROUNDS').titleTa}</h3>
      <p className="text-[11px] text-ink-soft">காலம்: {day(s.roundsWindow.fromUtc)} – {day(s.roundsWindow.toUtc)}</p>
      <ul className="text-xs space-y-0.5 mt-1">
        {s.rounds.length === 0 && <li className="text-ink-soft">இந்தக் காலத்தில் இல்லை.</li>}
        {s.rounds.map((x: any) => (
          <li key={`${x.planet}${x.atUtc}`} className="text-ink">
            <span className="font-mono" style={num}>{x.atUtc.slice(0, 16).replace('T', ' ')} UTC</span> · {x.planetTa} ராசி மாற்றம் · சந்திரன் {x.moonStarTa} ({x.roundTa})
          </li>
        ))}
      </ul>
      <Books id="ROUNDS" />

      <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-3 space-y-0.5">
        {s.notComputedTa.map((t: string) => <li key={t}>{t}</li>)}
      </ul>
    </section>
  );
}

export default function GocharaVedhaView() {
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [query, setQuery] = useState('');
  const [party, setParty] = useState<Party | null>(null);
  const [manual, setManual] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState('PHALADEEPIKA_SASTRI');
  const [planet, setPlanet] = useState('Jupiter');
  const [binduTable, setBinduTable] = useState('PHALADEEPIKA');

  useEffect(() => {
    (query.trim() ? searchCharts(query.trim(), 25) : listCharts(50))
      .then((r: any) => setRows(r)).catch(() => setRows([]));
  }, [query]);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeVedha(party.kind === 'profile'
      ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) { setResult(r); setMethod(r.defaultMethod); if (r.phaladeepika.bindu) setBinduTable(r.phaladeepika.bindu.defaultTable); } })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  const m = result?.methods[method];

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Gochara Vedha</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">கோசார வேதை — ஒன்பது கிரகங்களும்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஜன்ம சந்திரனிலிருந்து ஒரு கிரகம் நல்ல இடத்தில் இருக்கும்போது வேறொரு கிரகம் அதன் இணை இடத்தில் இருந்தால் நல்ல பலன் தடைபடும் (வேதை);
          தீய இடத்தில் இருக்கும்போது இணை இடத்தில் கிரகம் இருந்தால் தீமை நீங்கும் (விபரீத வேதை). காலங்கள் வானியல் கணக்கு; இணை இடங்கள் நூல்களுடையவை —
          எட்டு நூல்கள் ஒப்பிடப்படுகின்றன; மூல நூலான பலதீபிகை இயல்பு.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-semibold text-ink">யாருக்கு?</h2>
          {party && <button type="button" onClick={() => { setParty(null); setResult(null); }} className="text-xs text-ink-soft hover:text-rose">மாற்று</button>}
        </div>
        {party ? <p className="text-sm text-teal">✓ {party.label}</p> : manual ? (
          <>
            <BirthDataForm isLoading={loading}
              onSubmit={(bd) => setParty({ kind: 'form', input: toInput(bd), label: bd.name || 'படிவ விவரம்' })} />
            <button type="button" onClick={() => setManual(false)} className="text-xs text-ink-soft mt-2 underline">சேமித்த சுயவிவரங்களிலிருந்து தேர்ந்தெடு</button>
          </>
        ) : (
          <>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="சேமித்த சுயவிவரங்களில் தேடு (பெயர் / இடம்)"
              className="w-full mb-2 px-3 py-2 text-sm bg-surface-2 border border-line rounded-xl text-ink" />
            <ul className="max-h-44 overflow-y-auto divide-y divide-line/40 mb-2">
              {rows.length === 0 && <li className="text-xs text-ink-soft py-2">சேமித்த சுயவிவரம் இல்லை.</li>}
              {rows.map((r) => (
                <li key={r.profileId}>
                  <button type="button" className="w-full text-left py-1.5 text-sm text-ink hover:text-saffron"
                    onClick={() => setParty({ kind: 'profile', profileId: r.profileId, revision: r.revision, label: `${r.name} · ${r.birthDate}${r.placeName ? ` · ${r.placeName}` : ''}` })}>
                    {r.name}<span className="text-xs text-ink-soft block">{r.birthDate}{r.placeName ? ` · ${r.placeName}` : ''}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setManual(true)} className="text-xs text-ink-soft underline">அல்லது பிறப்பு விவரத்தை நேரடியாக உள்ளிடு</button>
          </>
        )}
      </section>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && m && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · ஜன்ம சந்திரன் {result.moonRasi}</h2>
            <p className="text-xs text-ink-soft">
              {result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · இப்போது {day(result.atUtc)}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {result.rank.computable.map((id: string) => (
                <button key={id} type="button" onClick={() => setMethod(id)}
                  className={`text-xs px-2 py-1 rounded border ${id === method ? 'border-saffron bg-amber-50 text-ink font-semibold' : 'border-line text-ink-soft'}`}>
                  {result.methods[id].labelTa}{id === result.defaultMethod ? ' (இயல்பு)' : ''}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink-soft mt-2">
              வரிசை: அதிக விளக்கம் உள்ள நூல் முதலில் — {result.rank.measureTa} {result.rank.computableTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.
            </p>
            <p className="text-[11px] text-ink mt-1">{result.rank.defaultTa}</p>
            <p className="text-[11px] text-ink-soft mt-1">{m.exemptNoteTa}</p>
            <Cites list={m.sources} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-ink">இப்போது — ஒன்பது கிரகங்களும்</h2>
              {result.phaladeepika.bindu && <BinduTablePicker meta={result.phaladeepika.bindu} value={binduTable} onChange={setBinduTable} />}
            </div>
            <NowTable r={result} method={method} table={binduTable} />
            <ul className="text-[11px] text-ink-soft mt-2 list-disc ml-5 space-y-0.5">
              <li>{result.notes.moonTa}</li>
              <li>{result.notes.nodePairTa}</li>
            </ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">ஒவ்வொரு கிரகமும் — காலங்கள்</h2>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Object.values(m.planets).map((p: any) => (
                <button key={p.planet} type="button" onClick={() => setPlanet(p.planet)}
                  className={`text-xs px-2 py-1 rounded border ${p.planet === planet ? 'border-saffron bg-amber-50 text-ink font-semibold' : 'border-line text-ink-soft'}`}>
                  {p.planetTa}
                </button>
              ))}
            </div>
            {result.phaladeepika.bindu && <p className="mb-2"><BinduTablePicker meta={result.phaladeepika.bindu} value={binduTable} onChange={setBinduTable} /></p>}
            <Timeline p={m.planets[planet]} pd={result.phaladeepika} table={binduTable} />
            {planet === 'Saturn' && <p className="text-xs text-ink-soft mt-2">சனியின் ஏழரை, அஷ்டமம், அதன் வேதை விவரம் முழுவதும்: <a className="underline" href="/saturn-transit">/saturn-transit</a>.</p>}
          </section>

          <PhaladeepikaRules r={result} m={m} table={binduTable} setTable={setBinduTable} />

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">நூல்கள் வேறுபடும் இடங்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">இவை தவிர மற்ற எல்லா இணைகளிலும் எல்லா நூல்களும் ஒத்துப்போகின்றன.</p>
            <div className="space-y-2 text-xs">
              {result.comparison.differences.map((d: any) => (
                <div key={d.id} className="border border-line rounded-lg p-2">
                  <p className="text-ink">{d.textTa}</p>
                  <p className="text-ink-soft mt-1">
                    {result.rank.order.filter((b: string) => d.byBook[b] !== undefined).map((b: string) => `${BOOK_TA[b]}: ${d.byBook[b]}`).join(' · ')}
                  </p>
                </div>
              ))}
            </div>
            <details className="mt-3 text-xs">
              <summary className="cursor-pointer text-ink">காலப்பிரகாசிகையின் அட்டவணை (ஜாதக பாரிஜாதம் மறுபதிப்பு) — அச்சில் உள்ளபடி</summary>
              <div className="overflow-x-auto mt-2">
                <table className="text-xs" style={num}>
                  <thead><tr className="text-ink-soft"><th className="pr-2 text-left">கிரகம்</th>{ROMAN.map((x) => <th key={x} className="px-1">{x}</th>)}</tr></thead>
                  <tbody>
                    {Object.entries(result.comparison.kalaprakasikaTable).map(([pl, row]: [string, any]) => (
                      <tr key={pl}>
                        <td className="pr-2 text-ink">{PLANET_TA[pl]}</td>
                        {row.map((v: number, i: number) => {
                          const k1982 = (result.comparison.kalaprakasika1982Cells[pl] ?? []).find((c: any) => c[0] === i + 1);
                          return <td key={i} className={`px-1 text-center ${k1982 ? 'text-amber-800' : 'text-ink'}`} title={k1982 ? `1982 அச்சில் ${k1982[1]}` : ''}>{v}{k1982 ? '*' : ''}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-ink-soft mt-1">
                நெடுவரிசை = கிரகம் இருக்கும் இடம், எண் = வேதை இடம் என்று படித்தால், நல்ல இடங்களின் எல்லா இணைகளும் புலிப்பாணியுடன் பொருந்துகின்றன (புதன் X தவிர). இந்த வாசிப்பு எங்களுடையது.
                மற்ற நெடுவரிசைகளுக்கு நூலில் விதி இல்லை — பயன்படுத்தவில்லை. * = 1982 அச்சில் வேறு எழுத்து (மறுதட்டச்சுப் பிழை போல்: a, S, 6, 8).
              </p>
              <Cites list={result.comparison.kalaprakasikaSources} />
            </details>
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer text-ink">சூடாமணி — செய்யுள் 341-342 (தொகுப்புகள்)</summary>
              <ul className="mt-1 space-y-0.5">
                {Object.keys(result.comparison.sudamaniSets.good).map((pl) => (
                  <li key={pl} className="text-ink">
                    {PLANET_TA[pl]}: நல்ல இடம் {result.comparison.sudamaniSets.good[pl].join(', ')} · வேதை {pl === 'Venus'
                      ? result.comparison.sudamaniSets.vedha[pl].map((v: number, i: number) => (result.comparison.sudamaniVenus.read[i] === null ? `${v}*` : `${v}`)).join(', ')
                      : result.comparison.sudamaniSets.vedha[pl]?.join(', ') ?? 'பிரிக்க முடியவில்லை'}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-ink-soft mt-1">* மீட்டமைப்பு. {result.comparison.sudamaniVenus.textTa}</p>
              <Cites list={[...result.comparison.sudamaniSources, result.comparison.sudamaniVenus.source]} />
            </details>
            <p className="text-xs font-semibold text-ink mt-3">"தந்தை-மகன்" விலக்கு — மூன்று நூல்கள்</p>
            <Cites list={result.comparison.fatherSonSources} />
            <p className="text-[11px] text-ink-soft mt-2">{result.notes.sudamaniTimingTa}</p>
          </section>

          {result.nakshatra && <NakshatraSection n={result.nakshatra} />}

          {result.sapta && <SaptashalakaSection s={result.sapta} />}
        </>
      )}
    </main>
  );
}
