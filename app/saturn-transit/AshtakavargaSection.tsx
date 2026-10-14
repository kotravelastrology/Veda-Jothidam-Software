'use client';

import { useState, type ReactNode } from 'react';

/**
 * Saturn's transit refined by Ashtakavarga and Kakshya.
 *
 * Three blocks: the bindus of each house Saturn can transit (books ordered by
 * how much each explains), the Kakshya windows under a chosen method (Patel's
 * bhava method first, for the same reason), and Vinay Aditya's list of what to
 * watch while Saturn moves. Dates are astronomy; readings are the books'.
 */

const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const BOOK_TA: Record<string, string> = {
  'Ashtakavarga (with translation in English and explanatory notes)': 'படேல், அஷ்டகவர்க்கம்',
  'Practical Ashtakavarga': 'வினய் ஆதித்யா, Practical Ashtakavarga',
  'Advanced Techniques of Predictive Astrology: A Vedic Treatise in Modern Times': 'விஷ்ணு பாஸ்கர்',
  "Parashara's Light 6.1 manual": 'பராசரர் லைட் 6.1 கையேடு',
};
const RELATION_TA: Record<string, string> = { FRIEND: 'நண்பர்', ENEMY: 'பகைவர்', NEUTRAL: 'சமம்', SELF: 'சனியே' };
const DIGNITY_TA: Record<string, string> = {
  EXALTED: 'உச்சம்', DEBILITATED: 'நீசம்', OWN: 'சொந்த வீடு', MOOLATRIKONA_OR_OWN: 'மூலத்திரிகோணம் / சொந்த வீடு',
  FRIEND: 'நண்பர் வீடு', ENEMY: 'பகை வீடு', NEUTRAL: 'சம வீடு',
};
const VERDICT_CLS: Record<string, string> = { GOOD: 'text-teal', BAD: 'text-rose', MIXED: 'text-amber-700' };
const HOUSE_LABEL: Record<number, string> = {
  12: 'ஏழரை — தொடக்கம்', 1: 'ஏழரை — ஜன்மம்', 2: 'ஏழரை — இறுதி', 4: 'அர்த்தாஷ்டமம்', 8: 'அஷ்டமம்', 7: 'கண்டகம்',
};
const DAY_MS = 86400000;

const day = (iso: string) => iso.slice(0, 10);
const num = { fontVariantNumeric: 'tabular-nums' as const };
const cite = (s: any) => `${BOOK_TA[s.title] ?? s.title} — ${String(s.pageLocus).split(':')[0]}`;
function fmtLon(lon: number) {
  const x = ((lon % 360) + 360) % 360;
  const s = Math.floor(x / 30);
  const r = x - s * 30;
  let d = Math.floor(r);
  let m = Math.round((r - d) * 60);
  if (m === 60) { d += 1; m = 0; }
  return `${RASI_TA[s]} ${d}°${String(m).padStart(2, '0')}′`;
}

function Cites({ list }: { list: any[] }) {
  return (
    <span className="block text-[11px] text-ink-soft">
      {list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}
    </span>
  );
}

function RankLine({ rank }: { rank: any }) {
  return (
    <p className="text-[11px] text-ink-soft mb-2">
      வரிசை: அதிக விளக்கம் உள்ள நூல் முதலில் — {rank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.
      <span className="block">{rank.alternativeTa}</span>
    </p>
  );
}

// ---------------------------------------------------------------------------

function NowCard({ a, method }: { a: any; method: string }) {
  const m = a.kakshya.methods[method];
  const w = m.now;
  const i = m.windows.indexOf(w);
  const next = i >= 0 ? m.windows[i + 1] : null;
  const n = a.watch.now;
  const nak = a.watch.nakshatras.find((x: any) => x.current);
  const nav = a.watch.navamshas.find((x: any) => x.current);
  const inMoonNav = a.watch.moonNavamsha?.stays.find((x: any) => x.current);
  const rahuNow = a.watch.rahuDashas.find((x: any) => x.current);
  return (
    <div className="border border-saffron rounded-xl p-3 mb-4 text-xs space-y-1">
      <p className="text-sm text-ink">
        இப்போது ({day(a.window.atUtc)}) சனி {fmtLon(n.longitude)} —{' '}
        {w ? (
          <>
            <strong>{w.unitTa}</strong>, {w.kakshya}-ஆம் கக்ஷ்யை ({w.lordTa}){' '}
            <span className={w.bindu ? 'text-teal font-semibold' : 'text-rose font-semibold'}>
              {w.bindu ? 'பரல் உண்டு' : 'பரல் இல்லை'}
            </span>
            <span className="text-ink-soft"> · {m.labelTa}</span>
          </>
        ) : '—'}
      </p>
      {w && (
        <p className="text-ink-soft" style={num}>
          இந்தக் கக்ஷ்யை {day(w.fromUtc)} – {day(w.toUtc)}
          {next && <> · அடுத்தது {next.unitTa} {next.kakshya}-ஆம் கக்ஷ்யை ({next.lordTa}) — {next.bindu ? 'பரல் உண்டு' : 'பரல் இல்லை'}</>}
          {w.afflictedInBindu && <span className="block text-rose">பரல் உள்ள கக்ஷ்யை, ஆனால் நீசம் / பகை வீடு / அஸ்தங்கம் — படேல் ஸ்லோகம் 5 (ப.71) இதைப் பெரும் துன்பம் என்கிறது.</span>}
        </p>
      )}
      <p className="text-ink">
        {n.retrograde ? <span className="text-rose">வக்கிரம்</span> : 'நேர்கதி'}
        {n.station && <span className="text-rose"> · நிலை (திரும்பும் நாளின் ±5 நாள்)</span>}
        {' · '}{n.combust ? <span className="text-rose">அஸ்தங்கம்</span> : 'அஸ்தங்கம் இல்லை'} (சூரியனிலிருந்து {n.elongation}°)
        {' · '}{DIGNITY_TA[n.dignity]}
      </p>
      {nak && (
        <p className="text-ink">
          நட்சத்திரம்: {nak.nakshatraTa} (அதிபதி {nak.lordTa}{nak.lordRelation ? ` — சனிக்கு ${RELATION_TA[nak.lordRelation]}` : ''})
          {nak.count && <> · ஜன்ம நட்சத்திரத்திலிருந்து {nak.count}-ஆவது, {nak.tara}-ஆம் தாரை{nak.adverseTara && <span className="text-rose"> (3/5/7 — வினய் ஆதித்யா பாதகம் என்கிறார்)</span>}</>}
        </p>
      )}
      {nav && <p className="text-ink">நவாம்சம்: {nav.navamshaSignTa} (அதிபதி {nav.lordTa} — சனிக்கு {RELATION_TA[nav.lordRelation] ?? '—'})</p>}
      {a.watch.moonNavamsha && (
        <p className="text-ink">
          சந்திர நவாம்ச ராசி {RASI_TA[a.watch.moonNavamsha.rasiIndex]}: {inMoonNav ? <span className="text-rose">சனி இப்போது அங்கே</span> : 'சனி இப்போது அங்கே இல்லை'}
          {' · '}ராகு தசை {rahuNow ? <span className="text-rose">நடப்பில்</span> : 'இப்போது இல்லை'}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function HouseBlocks({ a }: { a: any }) {
  const hr = a.houseReadings;
  const moonRasi = a.watch.moonRasi.rasiIndex;
  const saturnRasiNow = Math.floor(a.watch.now.longitude / 30);
  const houseNow = ((saturnRasiNow - moonRasi + 12) % 12) + 1;
  const bhavaNow = a.kakshya.methods.PATEL_BHAVA.now ? a.kakshya.methods.PATEL_BHAVA.now.unit + 1 : null;

  const blocks: Record<string, ReactNode> = {
    VINAY_ADITYA: (
      <div key="va" className="mb-4">
        <h4 className="text-xs font-semibold text-ink mb-1">வினய் ஆதித்யா — ராசி வாரியாக, சந்திரனிலிருந்து</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: 520 }}>
            <thead><tr className="text-ink-soft border-b border-line text-left">
              <th className="py-1 pr-2">இடம்</th><th className="py-1 pr-2">ராசி</th><th className="py-1 pr-2">சனி பரல்</th>
              <th className="py-1 pr-2">சர்வாஷ்டகம்</th><th className="py-1">நூல்</th>
            </tr></thead>
            <tbody>
              {hr.VINAY_ADITYA.rows.map((row: any) => (
                <tr key={row.house} className={`border-b border-line/40 ${row.house === houseNow ? 'bg-amber-50' : ''}`}>
                  <td className="py-1 pr-2 text-ink">{row.house}{HOUSE_LABEL[row.house] && <span className="text-ink-soft"> · {HOUSE_LABEL[row.house]}</span>}{row.house === houseNow && <span className="text-amber-800"> · இப்போது</span>}</td>
                  <td className="py-1 pr-2 text-ink">{row.rasiTa}</td>
                  <td className="py-1 pr-2 font-mono text-ink" style={num}>{row.bav}</td>
                  <td className="py-1 pr-2 font-mono text-ink" style={num}>{row.sav}</td>
                  <td className={`py-1 ${VERDICT_CLS[row.verdict] ?? 'text-ink-soft'}`}>{row.verdictTa ?? hr.VINAY_ADITYA.unplacedTa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="text-[11px] text-ink-soft mt-1 list-disc ml-5 space-y-0.5">
          {hr.VINAY_ADITYA.notesTa.map((t: string) => <li key={t}>{t}</li>)}
        </ul>
        <Cites list={hr.VINAY_ADITYA.sources} />
      </div>
    ),
    PATEL: (
      <div key="patel" className="mb-4">
        <h4 className="text-xs font-semibold text-ink mb-1">படேல் — பாவ வாரியாக (ஸ்ரீபதி பாவம், பாவ அஷ்டகவர்க்கம்)</h4>
        <p className="text-[11px] text-ink-soft mb-1">{hr.PATEL.noteTa}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: 680 }}>
            <thead><tr className="text-ink-soft border-b border-line text-left">
              <th className="py-1 pr-2">பாவம்</th><th className="py-1 pr-2">ஆரம்பச் சந்தி – முடிவுச் சந்தி (மத்தி)</th>
              <th className="py-1 pr-2">சனி பரல்</th><th className="py-1 pr-2">சர்வாஷ்டகம்</th><th className="py-1">ஸ்லோகம் 1</th>
            </tr></thead>
            <tbody>
              {hr.PATEL.rows.map((row: any) => {
                const b = a.bhavas[row.bhava - 1];
                return (
                  <tr key={row.bhava} className={`border-b border-line/40 align-top ${row.bhava === bhavaNow ? 'bg-amber-50' : ''}`}>
                    <td className="py-1 pr-2 text-ink">{row.bhava}{row.bhava === bhavaNow && <span className="text-amber-800"> · இப்போது</span>}</td>
                    <td className="py-1 pr-2 text-ink-soft whitespace-nowrap" style={num}>{fmtLon(b.start)} – {fmtLon(b.end)} <span className="block">({fmtLon(b.cusp)})</span></td>
                    <td className="py-1 pr-2 font-mono text-ink" style={num}>{row.bav}</td>
                    <td className="py-1 pr-2 font-mono text-ink" style={num}>{row.sav}</td>
                    <td className="py-1 text-ink">
                      {row.textTa}
                      {row.otherAuthorsTa && <span className="block text-ink-soft">பிற ஆசிரியர்கள்: {row.otherAuthorsTa}</span>}
                      {row.highest && <span className="block text-teal">அதிக பரல் உள்ள பாவம் — {hr.PATEL.highestTa}</span>}
                      {row.zero && <span className="block text-rose">பரல் இல்லாத பாவம் — {hr.PATEL.zeroTa}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-ink-soft mt-1">{hr.PATEL.zeroRestTa}</p>
        <p className="text-[11px] text-amber-800 mt-1">
          {a.sav.tableNote.textTa}
          {' '}{a.sav.bhavaTableDiffers.length
            ? <>இந்த ஜாதகத்தில் சர்வாஷ்டகம் மாறும் பாவங்கள்: {a.sav.bhavaTableDiffers.map((d: any) => `${d.bhava} (படேல் ${d.patel} / வினய் ஆதித்யா ${d.vinayAditya})`).join(', ')}.</>
            : 'இந்த ஜாதகத்தில் இரண்டு அட்டவணையும் ஒரே சர்வாஷ்டகம் தருகின்றன.'}
        </p>
        <Cites list={[...hr.PATEL.sources, ...a.sav.tableNote.sources]} />
      </div>
    ),
    VISHNU_BHASKAR: (
      <div key="vb" className="mb-2">
        <h4 className="text-xs font-semibold text-ink mb-1">விஷ்ணு பாஸ்கர் — ஏழரைச் சனியின் மூன்று ராசிகள்</h4>
        <p className="text-xs text-ink">{hr.VISHNU_BHASKAR.sadeSati.savTa} <span className="text-ink-soft">{hr.VISHNU_BHASKAR.sadeSati.savReadingTa}</span></p>
        <p className="text-xs text-ink">{hr.VISHNU_BHASKAR.sadeSati.bavTa} <span className="text-ink-soft">{hr.VISHNU_BHASKAR.sadeSati.bavReadingTa}</span></p>
        <div className="overflow-x-auto mt-1">
          <table className="w-full text-xs" style={{ minWidth: 460 }}>
            <thead><tr className="text-ink-soft border-b border-line text-left">
              <th className="py-1 pr-2">இடம்</th><th className="py-1 pr-2">ராசி</th><th className="py-1 pr-2">சர்வாஷ்டகம் &gt; 30?</th>
              <th className="py-1 pr-2">சனி பரல்</th><th className="py-1 pr-2">&gt; 5?</th><th className="py-1">&gt; 6?</th>
            </tr></thead>
            <tbody style={num}>
              {hr.VISHNU_BHASKAR.sadeSatiRows.map((h: any) => (
                <tr key={h.house} className="border-b border-line/40">
                  <td className="py-1 pr-2 text-ink">{h.house}</td><td className="py-1 pr-2 text-ink">{h.rasiTa}</td>
                  <td className={`py-1 pr-2 ${h.savAbove ? 'text-teal' : 'text-ink-soft'}`}>{h.sav} {h.savAbove ? 'ஆம்' : 'இல்லை'}</td>
                  <td className="py-1 pr-2 text-ink">{h.bav}</td>
                  <td className={`py-1 pr-2 ${h.bavAbove5 ? 'text-teal' : 'text-ink-soft'}`}>{h.bavAbove5 ? 'ஆம்' : 'இல்லை'}</td>
                  <td className={`py-1 ${h.bavAbove6 ? 'text-teal' : 'text-ink-soft'}`}>{h.bavAbove6 ? 'ஆம்' : 'இல்லை'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink mt-1">
          மூன்று ராசிகளும் 30-க்கு மேல்: <strong className={hr.VISHNU_BHASKAR.allSavAbove ? 'text-teal' : 'text-ink'}>{hr.VISHNU_BHASKAR.allSavAbove ? 'ஆம்' : 'இல்லை'}</strong>
        </p>
        <details className="mt-2 text-xs">
          <summary className="cursor-pointer text-ink">பரல் எண்ணிக்கைக்கு நூலின் பொது அட்டவணை (எல்லா ராசிகளும்)</summary>
          <p className="text-[11px] text-ink-soft mt-1">{hr.VISHNU_BHASKAR.byBindusNoteTa}</p>
          <ul className="mt-1 space-y-0.5" style={num}>
            {hr.VISHNU_BHASKAR.byHouse.map((h: any) => (
              <li key={h.house} className={h.house === houseNow ? 'bg-amber-50' : ''}>
                {h.house}-ஆம் இடம் ({h.rasiTa}) · {h.bav} பரல் — {h.textTa}
              </li>
            ))}
          </ul>
        </details>
        <Cites list={hr.VISHNU_BHASKAR.sources} />
      </div>
    ),
  };

  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-ink mb-1">பரல்கள் — சனி செல்லும் ஒவ்வொரு வீட்டிலும்</h3>
      <RankLine rank={hr.rank} />
      {hr.order.map((id: string) => blocks[id])}
    </div>
  );
}

// ---------------------------------------------------------------------------

function KakshyaBlock({ a, method, setMethod }: { a: any; method: string; setMethod: (m: string) => void }) {
  const [all, setAll] = useState(false);
  const k = a.kakshya;
  const m = k.methods[method];
  const at = Date.parse(a.window.atUtc);
  const shown = all ? m.windows : m.windows.filter((w: any) => Date.parse(w.toUtc) > at - 90 * DAY_MS && Date.parse(w.fromUtc) < at + 4 * 365.25 * DAY_MS);
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-ink mb-1">கக்ஷ்யை — ஒவ்வொரு 3¾ மாதமும்</h3>
      <RankLine rank={k.rank} />
      <div className="flex flex-wrap gap-2 mb-2">
        {k.order.map((id: string) => (
          <button key={id} type="button" onClick={() => setMethod(id)}
            className={`text-xs px-2 py-1 rounded border ${id === method ? 'border-saffron bg-amber-50 text-ink font-semibold' : 'border-line text-ink-soft'}`}>
            {k.methods[id].labelTa}{id === k.defaultMethod ? ' (இயல்பு)' : ''}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-ink-soft mb-1">{m.explainTa}</p>
      <p className="text-[11px] text-ink-soft mb-2">அதிபதி வரிசை: {m.lords.map((l: string) => ({ Saturn: 'சனி', Jupiter: 'குரு', Mars: 'செவ்வாய்', Sun: 'சூரியன்', Venus: 'சுக்கிரன்', Mercury: 'புதன்', Moon: 'சந்திரன்', Lagna: 'லக்னம்' } as Record<string, string>)[l]).join(', ')}.</p>
      <Cites list={m.sources} />
      <label className="flex items-center gap-2 text-xs text-ink-soft my-2 cursor-pointer">
        <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />
        முழுக் காலமும் காட்டு ({day(a.window.fromUtc)} – {day(a.window.toUtc)}, {m.windows.length} கக்ஷ்யைகள்); இல்லையெனில் இன்றிலிருந்து 4 ஆண்டுகள்
      </label>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 760 }}>
          <thead><tr className="text-ink-soft border-b border-line text-left">
            <th className="py-1 pr-2">காலம்</th><th className="py-1 pr-2">{m.division === 'SIGN' ? 'ராசி' : 'பாவம்'} · சந்திரனிலிருந்து</th>
            <th className="py-1 pr-2">கக்ஷ்யை · அதிபதி</th><th className="py-1 pr-2">பரல்</th><th className="py-1">குறிப்பு</th>
          </tr></thead>
          <tbody className="align-top">
            {shown.map((w: any) => (
              <tr key={w.fromUtc} className={`border-b border-line/40 ${w.current ? 'bg-amber-50' : ''}`}>
                <td className="py-1 pr-2 font-mono text-ink whitespace-nowrap" style={num}>{day(w.fromUtc)} – {day(w.toUtc)}{w.current && <span className="block font-sans text-amber-800">இப்போது</span>}</td>
                <td className="py-1 pr-2 text-ink">{w.unitTa}<span className="block text-ink-soft">{w.rasisTa.map((r: string, i: number) => `${r} (${w.housesFromMoon[i]})`).join(' / ')}</span></td>
                <td className="py-1 pr-2 text-ink">{w.kakshya} · {w.lordTa}{w.lordRelation && <span className="text-ink-soft"> ({RELATION_TA[w.lordRelation]})</span>}</td>
                <td className={`py-1 pr-2 ${w.bindu ? 'text-teal' : 'text-rose'}`} style={num}>{w.bindu ? 'உண்டு' : 'இல்லை'}<span className="block text-ink-soft">{m.division === 'SIGN' ? 'ராசியில்' : 'பாவத்தில்'} {w.bav}</span></td>
                <td className="py-1 text-ink-soft">
                  {w.retroDays > 0 && <span className="block">வக்கிரம் {Math.round(w.retroDays)} நாள்</span>}
                  {w.combustDays > 0 && <span className="block">அஸ்தங்கம் {Math.round(w.combustDays)} நாள்</span>}
                  {w.dignities.filter((d: any) => ['DEBILITATED', 'ENEMY', 'EXALTED', 'OWN', 'MOOLATRIKONA_OR_OWN'].includes(d.dignity)).map((d: any) => (
                    <span key={d.rasiIndex} className="block">{RASI_TA[d.rasiIndex]}: {DIGNITY_TA[d.dignity]}</span>
                  ))}
                  {w.afflictedInBindu && <span className="block text-rose">படேல் ஸ்லோகம் 5</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 space-y-2 text-xs">
        <p className="font-semibold text-ink">நூல்கள் சொல்வது (அதிக விளக்கம் உள்ளது முதலில்)</p>
        {k.readings.map((r: any) => (
          <div key={r.book} className="min-w-0 border border-line rounded-lg p-2">
            <p className="font-semibold text-ink">{r.bookTa}</p>
            {r.book === 'PATEL' && (
              <>
                <p className="text-teal">{r.bindu.textTa}</p>
                <p className="text-rose">{r.void.textTa}</p>
                <p className="text-ink">{r.afflicted.textTa} <span className="text-ink-soft">{r.afflicted.readingTa}</span></p>
                <p className="text-ink-soft">{r.timing.textTa}</p>
                <Cites list={[r.bindu.source, r.void.source, r.afflicted.source, r.timing.source]} />
              </>
            )}
            {r.items && (
              <>
                <ul className="list-disc ml-5 space-y-0.5">
                  {r.items.map((it: any) => (
                    <li key={it.id} className="text-ink">{it.textTa}{!it.applied && <span className="block text-ink-soft">இங்கே கணிக்கப்படவில்லை: {it.whyNotTa}</span>}</li>
                  ))}
                </ul>
                <Cites list={[r.source]} />
              </>
            )}
            {r.textTa && <><p className="text-ink">{r.textTa}</p><Cites list={[r.source]} /></>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Spells({ list, at }: { list: any[]; at: number }) {
  const upcoming = list.filter((s) => Date.parse(s.toUtc) > at).slice(0, 8);
  return (
    <ul className="mt-1 space-y-0.5 font-mono" style={num}>
      {upcoming.map((s) => (
        <li key={s.fromUtc} className={s.current ? 'text-amber-800' : 'text-ink'}>
          {day(s.fromUtc)} – {day(s.toUtc)} ({Math.round(s.days)} நாள்){s.current ? ' — இப்போது' : ''}
        </li>
      ))}
    </ul>
  );
}

function WatchBlock({ a }: { a: any }) {
  const w = a.watch;
  const t = w.texts;
  const at = Date.parse(a.window.atUtc);
  const nextStations = w.stations.filter((s: any) => Date.parse(s.toUtc) > at).slice(0, 6);
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink mb-1">கவனிக்க வேண்டியவை — வினய் ஆதித்யாவின் பட்டியல் (ப.166)</h3>
      <div className="grid md:grid-cols-2 gap-3 text-xs">
        <div className="min-w-0 border border-line rounded-lg p-2">
          <p className="font-semibold text-ink">1. வக்கிரம்</p>
          <p className="text-ink">{t.retrograde.textTa}</p>
          <Spells list={w.retrograde} at={at} />
          <p className="text-ink mt-1">{t.retrograde.stationTa}</p>
          <ul className="font-mono" style={num}>
            {nextStations.map((s: any) => (
              <li key={s.atUtc} className={s.current ? 'text-amber-800' : 'text-ink'}>{day(s.atUtc)} {s.turns === 'RETROGRADE' ? 'வக்கிரம் தொடங்கும்' : 'நேர்கதி தொடங்கும்'} (நிலை {day(s.fromUtc)} – {day(s.toUtc)})</li>
            ))}
          </ul>
          <Cites list={[t.retrograde.source, t.retrograde.stationSource]} />
        </div>
        <div className="min-w-0 border border-line rounded-lg p-2">
          <p className="font-semibold text-ink">2. அஸ்தங்கம்</p>
          <p className="text-ink">{t.combustion.textTa}</p>
          <p className="text-ink-soft">{t.combustion.orbTa}</p>
          <Spells list={w.combust} at={at} />
          <p className="text-amber-800 mt-1">{t.combustion.contrastTa}</p>
          <Cites list={[t.combustion.source, t.combustion.orbSource, t.combustion.contrastSource]} />
        </div>
        <div className="min-w-0 border border-line rounded-lg p-2 md:col-span-2">
          <p className="font-semibold text-ink">3–4. நட்சத்திரம், தாரை</p>
          <p className="text-ink">{t.nakshatra.textTa}</p>
          <p className="text-ink">{t.tara.textTa}</p>
          <p className="text-ink-soft">{t.nakshatra.relationTa} {t.nakshatra.notAppliedTa} {t.tara.readingTa}</p>
          <div className="overflow-x-auto mt-1">
            <table className="w-full" style={{ minWidth: 560 }}>
              <thead><tr className="text-ink-soft border-b border-line text-left">
                <th className="py-1 pr-2">காலம்</th><th className="py-1 pr-2">நட்சத்திரம்</th><th className="py-1 pr-2">அதிபதி</th><th className="py-1">ஜன்மத்திலிருந்து · தாரை</th>
              </tr></thead>
              <tbody style={num}>
                {w.nakshatras.map((n: any) => (
                  <tr key={n.fromUtc} className={`border-b border-line/40 ${n.current ? 'bg-amber-50' : ''}`}>
                    <td className="py-1 pr-2 font-mono whitespace-nowrap text-ink">{day(n.fromUtc)} – {day(n.toUtc)}</td>
                    <td className="py-1 pr-2 text-ink">{n.nakshatraTa}{n.retroDays > 0 && <span className="text-ink-soft"> (வக்கிரம் {Math.round(n.retroDays)} நாள்)</span>}</td>
                    <td className="py-1 pr-2 text-ink">{n.lordTa}{n.lordRelation ? <span className="text-ink-soft"> — {RELATION_TA[n.lordRelation]}</span> : <span className="text-ink-soft"> — அட்டவணையில் இல்லை</span>}</td>
                    <td className={`py-1 ${n.adverseTara ? 'text-rose' : 'text-ink'}`}>
                      {n.count ?? '—'} · {n.tara ?? '—'}-ஆம் தாரை{n.adverseExact && ' (நேரடியாக 3/5/7-ஆம் நட்சத்திரம்)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Cites list={[t.nakshatra.source, t.tara.source]} />
        </div>
        <div className="min-w-0 border border-line rounded-lg p-2 md:col-span-2">
          <p className="font-semibold text-ink">5. நவாம்சம்</p>
          <p className="text-ink">{t.navamsha.textTa}</p>
          <details className="mt-1">
            <summary className="cursor-pointer text-ink">நவாம்ச மாற்றங்கள் ({w.navamshas.length})</summary>
            <ul className="mt-1 space-y-0.5" style={num}>
              {w.navamshas.map((n: any) => (
                <li key={n.fromUtc} className={n.current ? 'bg-amber-50' : ''}>
                  <span className="font-mono">{day(n.fromUtc)} – {day(n.toUtc)}</span> · {n.rasiTa}-ல் {n.navamshaSignTa} நவாம்சம் · {n.lordTa} — {RELATION_TA[n.lordRelation] ?? '—'}
                </li>
              ))}
            </ul>
          </details>
          <Cites list={[t.navamsha.source]} />
        </div>
        <div className="min-w-0 border border-line rounded-lg p-2 md:col-span-2">
          <p className="font-semibold text-ink">சந்திர நவாம்ச ராசி (சந்திர கலா நாடி, வினய் ஆதித்யா வழியாக)</p>
          <p className="text-ink">{t.chandraNavamsha.textTa}</p>
          <p className="text-ink">{t.chandraNavamsha.rahuTa}</p>
          {w.moonNavamsha && (
            <ul className="mt-1 space-y-0.5" style={num}>
              <li className="text-ink-soft">
                ஜன்ம ராசி {RASI_TA[w.moonRasi.rasiIndex]} — சனி அங்கே: {w.moonRasi.stays.map((s: any) => `${day(s.fromUtc)} – ${day(s.toUtc)}`).join(', ') || 'இந்தக் காலத்தில் இல்லை'}
              </li>
              <li className="text-ink-soft">சந்திர நவாம்ச ராசி: {RASI_TA[w.moonNavamsha.rasiIndex]}; ராகு தசை: {w.rahuDashas.map((d: any) => `${day(d.fromUtc)} – ${day(d.toUtc)}`).join(', ') || '—'}</li>
              {w.moonNavamsha.stays.map((s: any) => (
                <li key={s.fromUtc} className={s.rahuDashaDays > 0 ? 'text-rose' : 'text-ink'}>
                  <span className="font-mono">{day(s.fromUtc)} – {day(s.toUtc)}</span> ({Math.round(s.days)} நாள்)
                  {s.rahuDashaDays > 0 ? ` — ராகு தசையுடன் ${Math.round(s.rahuDashaDays)} நாள்` : ' — ராகு தசை இல்லை'}{s.current ? ' · இப்போது' : ''}
                </li>
              ))}
            </ul>
          )}
          <Cites list={[t.chandraNavamsha.source, t.chandraNavamsha.rahuSource]} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function AshtakavargaSection({ r }: { r: any }) {
  const a = r.ashtakavarga;
  const [method, setMethod] = useState<string>(a?.kakshya.defaultMethod ?? 'PATEL_BHAVA');
  if (!a) return null;
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className="text-sm font-semibold text-ink mb-1">அஷ்டகவர்க்கம், கக்ஷ்யை — சனி கோசார நுணுக்கம்</h2>
      <p className="text-[11px] text-ink-soft mb-3">
        பரல்கள் பிறப்பு ஜாதகத்திலிருந்து; காலங்கள் வானியல் கணக்கு ({day(a.window.fromUtc)} – {day(a.window.toUtc)}); அவற்றின் பொருள் நூல்களுடையது.
        நூல்கள் சொல்லும் பலன்கள் சுருக்கமாகத் தமிழில் — இந்த மென்பொருளின் முன்கணிப்பு அல்ல.
      </p>
      <NowCard a={a} method={method} />
      <HouseBlocks a={a} />
      <KakshyaBlock a={a} method={method} setMethod={setMethod} />
      <WatchBlock a={a} />
    </section>
  );
}
