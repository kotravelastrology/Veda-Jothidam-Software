'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeMuhurtaStars } from './actions';

/**
 * The star of a muhurta over a period, for one person: Latta (a planet kicks
 * the Moon's star) for anyone, and the person's birth star, 88th and 108th
 * padas and Vainashika. Every reading the books give is computed; the switches
 * choose which one marks a time as rejected. The books are listed by how much
 * they explain, and the default is the first book's.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const cite = (s: any) => `${s.title} — ${String(s.pageLocus).split(/: "| — /)[0]}`;
const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);
const DIR_TA: Record<number, string> = { 1: 'முன்னோக்கி', [-1]: 'பின்னோக்கி' };
const PERSONAL_TA: Record<string, string> = { JANMA: 'ஜன்ம நட்சத்திரம்', PADA_88: '88-வது பாதம்', PADA_108: '108-வது பாதம்' };
const PLANET_NAME_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const DIGNITY_TA: Record<string, string> = { OWN: 'சொந்த ராசி', EXALTED: 'உச்சம்', FRIEND: 'நட்பு ராசி' };
const planetsTa = (list: string[]) => list.map((p) => PLANET_NAME_TA[p] ?? p).join(', ');
const LAGNA_LORD_TA = 'லக்னாதிபதி';
/** Each lagna check's table in `books.lagna`. */
const LAGNA_TABLE: Record<string, string> = {
  COMMON: 'common', PLACEMENTS: 'placements', ASHTAMA: 'ashtama', KARTARI: 'kartari', GANDANTA: 'gandanta', NAV_LAST: 'navLast',
  NAV_WHICH: 'navWhich', NAV_NATAL: 'navNatal', UDAYA: 'udaya', SHADVARGA: 'shadvarga', DREKKANA: 'drekkana', VISHANADI: 'vishanadi',
  ADVERSE: 'adverse',
};
/** Each lagna check's name. */
const CHECK_TA: Record<string, string> = {
  COMMON: 'பொது லக்ன சுத்தி', PLACEMENTS: 'கிரக நிலை', ASHTAMA: 'பிறப்பிலிருந்து', PDB: 'செவிடு, குருடு, முடம்', KARTARI: 'கர்த்தரி',
  GANDANTA: 'லக்ன கண்டாந்தம்', BANA: 'மிருத்யு பாணம்', NAV_LAST: 'கடைசி / சர நவாம்சம்', NAV_WHICH: 'எந்த நவாம்சம்', NAV_NATAL: 'பிறந்த 8, 12-ன் நவாம்சம்',
  UDAYA: 'உதய-அஸ்த சுத்தி', SHADVARGA: 'ஷட்வர்க்கம்', DREKKANA: 'திரேக்காணம்', VISHANADI: 'லக்ன விஷ நாடி', ADVERSE: 'பாதகச் சேர்க்கைகள்', EVENT: 'நிகழ்ச்சியின் லக்ன விதி',
};
type Show = 'ALL' | 'CLEAR' | 'GOOD_LAGNA' | 'BLOCKED';

function Switch({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-[11px] mr-3 mb-1">
      <span className="text-ink-soft">{label}:</span>
      {options.map(([id, ta]) => (
        <button key={id} type="button" onClick={() => onChange(id)}
          className={`px-2 py-0.5 rounded-full border ${value === id ? 'border-saffron bg-saffron/10 text-ink font-semibold' : 'border-line text-ink-soft'}`}>
          {ta}
        </button>
      ))}
    </span>
  );
}

export default function MuhurtaStarsView() {
  const [party, setParty] = useState<Party | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [days, setDays] = useState(30);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rahu, setRahu] = useState('BACKWARD');
  const [padaRule, setPadaRule] = useState('WHOLE');
  const [vainashika, setVainashika] = useState('STAR_23');
  const [taraBad, setTaraBad] = useState('T1357');
  const [taraCycle, setTaraCycle] = useState('QUARTERS');
  const [chandraReading, setChandraReading] = useState('GOOD_LIST');
  const [chandraRelief, setChandraRelief] = useState('KINDS_FRIENDS');
  const [dashaReading, setDashaReading] = useState<Record<string, string>>({});
  const [dashaRule, setDashaRule] = useState('SIX_OF_TEN');
  const [lagnaReading, setLagnaReading] = useState<Record<string, string>>({});
  const [lagnaEvent, setLagnaEvent] = useState('MARRIAGE');
  const [eventBook, setEventBook] = useState<Record<string, string>>({});
  const [tierReading, setTierReading] = useState<Record<string, string>>({});
  const [door, setDoor] = useState<string>('');
  // A journey's direction: the engine computes travel's direction rules for it, so a change recomputes.
  const [direction, setDirection] = useState<string>('');
  const isMarriage = lagnaEvent === 'MARRIAGE';
  // The ten evils are marriage's: for another act they are shown, not judged (the owner, 2026-10-11).
  const ruleNow = isMarriage ? dashaRule : 'NONE';
  const [place, setPlace] = useState<{ name: string; latitude: string; longitude: string }>({ name: '', latitude: '', longitude: '' });
  const [eventPlace, setEventPlace] = useState<{ name?: string; latitude: number; longitude: number } | null>(null);
  const [show, setShow] = useState<Show>('ALL');

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    const who = party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input };
    computeMuhurtaStars({ ...who, fromDate: fromDate || undefined, days, place: eventPlace ?? undefined, direction: direction || undefined })
      .then((r) => {
        if (cancelled) return;
        setResult(r);
        setPlace({ name: r.eventPlace.name ?? '', latitude: String(r.eventPlace.latitude), longitude: String(r.eventPlace.longitude) });
        setLagnaReading({});
        setRahu(r.books.rahu.default); setPadaRule(r.books.padaRules.default); setVainashika(r.books.vainashika.default);
        setTaraBad(r.books.taraBad.default); setTaraCycle(r.books.taraCycles.default); setChandraReading(r.books.chandraReadings.default); setChandraRelief(r.books.chandraRelief.default);
        setDashaReading(Object.fromEntries(r.books.dasha.doshas.map((d: string) => [d, r.books.dasha.readings[d].default])));
        setDashaRule(r.books.dasha.rules.default);
        if (!fromDate) setFromDate(r.fromDate);
      })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party, fromDate, days, eventPlace, direction]);
  // A new person starts at their birth place.
  useEffect(() => { setEventPlace(null); }, [party]);

  const off = result?.displayOffsetMinutes ?? 0;
  const zone = `UTC${off < 0 ? '−' : '+'}${Math.floor(Math.abs(off) / 60)}:${String(Math.abs(off) % 60).padStart(2, '0')}`;
  const local = (iso: string) => new Date(Date.parse(iso) + off * 60000).toISOString().slice(0, 16).replace('T', ' ');
  const hm = (iso: string) => local(iso).slice(11);
  const B = result?.books;

  /** What rejects a segment under the chosen readings. */
  const judge = (s: any) => {
    const kicks = s.latta.filter((h: any) => h.rahu === null || h.rahu === rahu);
    const counted = kicks.filter((h: any) => padaRule === 'WHOLE' || (padaRule === 'SAME_QUARTER' ? h.sameQuarter : h.jvQuarter));
    const personal = [
      s.personal.JANMA && 'JANMA', s.personal.PADA_88 && 'PADA_88', s.personal.PADA_108 && 'PADA_108',
    ].filter(Boolean) as string[];
    const vain = s.personal.VAINASHIKA[vainashika];
    const tara = s.taraVerdicts[taraBad][taraCycle] as 'REJECT' | 'CAUTION' | null;
    const chandra = s.chandraBala[chandraReading][chandraRelief] as boolean;
    const dasha = dashaJudge(s, counted.length > 0);
    // The lagna, one line per rising sign: its good navamsa stretches (joined where they touch),
    // or, if none, why it is left (the sign's own reasons; the navamsas' in short).
    const lagnas: any[] = [];
    for (const raw of s.lagnas ?? []) {
      const x = stretchOf(raw);
      const v = lagnaJudge(x);
      let g = lagnas[lagnas.length - 1];
      if (!g || g.l.lagna !== x.l.lagna) { g = { l: x.l, fromMs: x.fromMs, toMs: x.toMs, items: [], good: [] }; lagnas.push(g); }
      g.toMs = x.toMs;
      g.items.push({ x, v });
      if (v.ok) {
        const lastGood = g.good[g.good.length - 1];
        if (lastGood && lastGood.toMs === x.fromMs) { lastGood.toMs = x.toMs; if (!lastGood.navs.includes(x.nv.nav)) lastGood.navs.push(x.nv.nav); lastGood.its.push({ x, v }); } else g.good.push({ fromMs: x.fromMs, toMs: x.toMs, navs: [x.nv.nav], x, v, its: [{ x, v }] });
      }
    }
    const evStar = eventStarCodes(s);
    const clear = counted.length === 0 && personal.length === 0 && !vain && tara !== 'REJECT' && chandra && !dasha.reject && !evStar.some(isReject);
    return { kicks, counted, personal, vain, tara, chandra, dasha, lagnas, evStar, clear, goodLagnas: clear ? lagnas.flatMap((g: any) => g.good.map((ok: any) => ({ ...ok, l: g.l }))) : [] };
  };

  // An event with its own rules (eventMuhurtaTables.js): the chosen book's codes, with the door's rules.
  const isReject = (c: string) => !c.endsWith('_MID');
  const evName: string | undefined = B?.lagna.events[lagnaEvent]?.event;
  const evRule = evName ? B.lagna.eventRules[evName][eventBook[evName] ?? B.lagna.eventRules[evName].default] : null;
  const evBookId = evName ? (eventBook[evName] ?? B.lagna.eventRules[evName].default) : null;
  // The door's direction matters only where a book of the event gives door rules (house entry).
  const evHasDoor = evName ? B.lagna.eventRules[evName].order.some((id: string) => {
    const r = B.lagna.eventRules[evName][id];
    return r.digdwar || r.tithiDoor || r.sunLeft;
  }) : false;
  /** An event code in Tamil: `IN_<planet>_<house>[_MID]` is a planet the book keeps out of that house. */
  const evCodeTa = (c: string): string => {
    const m = /^IN_(\w+?)_(\d+)(_MID)?$/.exec(c);
    if (m) return `${m[1] === 'LAGNA_LORD' ? LAGNA_LORD_TA : PLANET_NAME_TA[m[1]] ?? m[1]} ${m[2]}-ல்${m[3] ? ' (குறிக்கப்படும்)' : ''}`;
    const T: Record<string, string> = B.lagna.eventCodeTa;
    // A book's secondary rule (travel) is its code with _MID: the base name, marked.
    const base = c.endsWith('_MID') ? c.slice(0, -4) : null;
    return T[c] ?? (base && T[base] ? `${T[base]} (குறிக்கப்படும்)` : null) ?? T[c.replace(/_\d+$/, '')] ?? c;
  };
  const inPaksha = (t: number) => ((t - 1) % 15) + 1;
  /** The same rules as `withDoorStars` and `doorCodes` (eventMuhurta.js). */
  function eventStarCodes(s: any): string[] {
    if (!evName) return [];
    let codes: string[] = s.ev[evName][evBookId!];
    if (door && evRule.digdwar && B.lagna.doors.stars[door].includes(s.star)) codes = codes.filter((c) => c !== 'NAK' && c !== 'NAK_MID');
    if (door && evRule.tithiDoor && !B.lagna.doors.tithi[door].includes(inPaksha(s.tithi))) codes = [...codes, 'TITHI_DOOR'];
    return codes;
  }
  function eventLagnaCodes(x: any): string[] {
    if (!evName) return [];
    const codes: string[] = x.ev[evName][evBookId!];
    return door && evRule.sunLeft && !B.lagna.doors.sun[door].includes(x.ev.sunHouse) ? [...codes, 'SUN_LEFT'] : codes;
  }

  /** A stretch with its two table entries and its times. */
  function stretchOf(raw: number[]) {
    const [f, t, r, n, v, g, b, w, d, a] = raw;
    const base = Date.parse(result.fromUtc);
    return {
      fromMs: base + f * 1000, toMs: base + t * 1000,
      l: result.lagnaTable[r], nv: result.navamsaTable[n], va: result.vargaTable[v],
      gandanta: { MINUTES_12: Boolean(g & 1), DEGREES_3: Boolean(g & 2) }, banaMrityu: Boolean(b),
      visha: { WILHELM: Boolean(w & 1), DEGREES: Boolean(w & 2), AGARWAL_DAYS: Boolean(w & 4), HALF_GHATI: Boolean(w & 8) },
      vara: d, adverse: result.adverseTable[a] as string[], ev: result.eventTable[raw[10]],
    };
  }
  const isoOf = (ms: number) => new Date(ms).toISOString();

  /** A lagna stretch under the chosen event and readings — the same rule as the engine's `lagnaVerdict` (lagnaShuddhi.js). */
  function lagnaJudge(x: any) {
    const { l, nv } = x;
    const R = lagnaChosen();
    const on = (k: string) => B.lagna.events[lagnaEvent].checks.includes(k);
    const reasons: string[] = [];
    const pl = l.placements[R.PLACEMENTS];
    if (on('PLACEMENTS') && !pl.pass) reasons.push('PLACEMENTS');
    if (on('COMMON') && l.common[R.COMMON].length) reasons.push('COMMON');
    if (l.ashtama[R.ASHTAMA].length) reasons.push('ASHTAMA');
    if (l.pdb.present) reasons.push('PDB');
    if (l.kartari[R.KARTARI]) reasons.push('KARTARI');
    if (x.gandanta[R.GANDANTA]) reasons.push('GANDANTA');
    if ((dashaReading.BANA ?? B.dasha.readings.BANA.default) === 'TITHI_LAGNA' && x.banaMrityu) reasons.push('BANA');
    if (on('NAV_LAST') && nv.last[R.NAV_LAST].length) reasons.push('NAV_LAST');
    if (!nv.which[R.NAV_WHICH]) reasons.push('NAV_WHICH');
    if (on('NAV_NATAL') && nv.natal[R.NAV_NATAL].length) reasons.push('NAV_NATAL');
    if (!nv.udaya[R.UDAYA].udaya || !nv.udaya[R.UDAYA].asta) reasons.push('UDAYA');
    if (!x.va.readings[R.SHADVARGA]) reasons.push('SHADVARGA');
    if (x.va.drekkana.readings[R.DREKKANA]) reasons.push('DREKKANA');
    if (x.visha[R.VISHANADI]) reasons.push('VISHANADI');
    if (on('ADVERSE') && adverseShown(x).length) reasons.push('ADVERSE');
    if (on('EVENT') && eventLagnaCodes(x).some(isReject)) reasons.push('EVENT');
    // கட்டாயம் rejects; விரும்பத்தக்கது is a caution — the same rule as the engine's `lagnaVerdict`.
    const cautions = reasons.filter((k) => tierOf(k) === 'PREFER');
    const must = reasons.filter((k) => tierOf(k) !== 'PREFER');
    if (on('PLACEMENTS') && pl.pass && (B.lagna.placements[R.PLACEMENTS].caution ?? []).includes(pl.grade)) cautions.push('PLACEMENTS_EMERGENCY');
    if (on('ADVERSE') && x.adverse.some((c: string) => (B.lagna.adverse[R.ADVERSE].caution ?? []).includes(c))) cautions.push('ADVERSE_CAUTION');
    if (on('EVENT') && eventLagnaCodes(x).some((c) => !isReject(c))) cautions.push('EVENT_MARK');
    return { ok: must.length === 0, reasons: must, cautions, pl };
  }
  /** A check's tier: the owner's choice on the page, else the default for the event. */
  const tierOf = (k: string): string => tierReading[k] ?? B.lagna.tiers[lagnaEvent]?.[k] ?? 'MUST';
  /** Shridhar's §13.10 combinations present under the chosen reading. */
  function adverseShown(x: any): string[] {
    const a = B.lagna.adverse[lagnaChosen().ADVERSE];
    const skip: string[] = [...(a.skip ?? []), ...(a.caution ?? [])];
    return x.adverse.filter((c: string) => !skip.includes(c));
  }

  /** The books' defaults; for another act, a check limited to some readings takes the first. */
  function lagnaDefaults(): Record<string, string> {
    const L = B.lagna;
    const only = L.events[lagnaEvent].only;
    const d: Record<string, string> = {
      PLACEMENTS: L.placements.default, ASHTAMA: L.ashtama.default, KARTARI: L.kartari.default, GANDANTA: L.gandanta.default,
      NAV_LAST: L.navLast.default, NAV_WHICH: L.navWhich.default, NAV_NATAL: L.navNatal.default, UDAYA: L.udaya.default,
      SHADVARGA: L.shadvarga.default, DREKKANA: L.drekkana.default, VISHANADI: L.vishanadi.default, COMMON: L.common.default,
      ADVERSE: L.adverse.default,
    };
    for (const k of Object.keys(only)) d[k] = only[k][0];
    return d;
  }
  /** The chosen readings, keeping a check to the readings the event takes. */
  function lagnaChosen(): Record<string, string> {
    const only = B.lagna.events[lagnaEvent].only;
    const R = { ...lagnaDefaults(), ...lagnaReading };
    for (const k of Object.keys(only)) if (!only[k].includes(R[k])) R[k] = only[k][0];
    return R;
  }
  const NAV_REASON_TA: Record<string, string> = {
    LAST: 'கடைசி நவாம்சம்', MOVABLE: 'சர லக்னத்தில் சர நவாம்சம்', VARG_LIB_CAP: 'துலா/மகர வர்கோத்தமம்', FIRST_CARDINAL: 'சர ராசியின் முதல் நவாம்சம்',
    NAV8: 'பிறந்த 8-ன் நவாம்ச ராசி', NAV12: 'பிறந்த 12-ன் நவாம்ச ராசி', LORD8: 'பிறந்த 8-ஆம் அதிபதி லக்னத்தில்', LORD12: 'பிறந்த 12-ஆம் அதிபதி லக்னத்தில்',
  };

  /** Reasons that change within a sign (navamsa, vargas, poison portions) rather than with the sign. */
  const isPartReason = (r: string) => r.startsWith('NAV_') || ['UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE', 'EVENT'].includes(r);

  /** Why a lagna stretch is left, in a few words; `signOnly` leaves out the reasons that change within the sign. */
  const lagnaWhy = (x: any, v: any, signOnly = false) => {
    const { l, nv } = x;
    const R = lagnaChosen();
    return v.reasons.filter((r: string) => !signOnly || !isPartReason(r)).map((r: string) => {
      if (r === 'PLACEMENTS_EMERGENCY') return `புள்ளி ${v.pl.points} (அவசரத்தில் மட்டும்)`;
      if (r === 'ADVERSE_CAUTION') return x.adverse.filter((c: string) => (B.lagna.adverse[R.ADVERSE].caution ?? []).includes(c)).map((c: string) => B.lagna.adverseTa[c]).join(', ');
      if (r === 'COMMON') return l.common[R.COMMON].map((c: string) => B.lagna.commonWhyTa[c]).join(', ');
      if (r === 'ADVERSE') return adverseShown(x).map((c: string) => B.lagna.adverseTa[c]).join(', ');
      if (r === 'EVENT') return eventLagnaCodes(x).filter(isReject).map(evCodeTa).join(', ');
      if (r === 'EVENT_MARK') return eventLagnaCodes(x).filter((c) => !isReject(c)).map(evCodeTa).join(', ');
      if (r === 'NAV_LAST') return nv.last[R.NAV_LAST].map((k: string) => NAV_REASON_TA[k]).join(', ');
      if (r === 'NAV_WHICH') return `${RASI_TA[nv.nav]} நவாம்சம்`;
      if (r === 'NAV_NATAL') return nv.natal[R.NAV_NATAL].map((k: any) => (typeof k === 'string' ? NAV_REASON_TA[k] : `நவாம்சம் ${k.from === 'LAGNA' ? 'பிறந்த லக்னத்துக்கு' : 'ஜன்ம ராசிக்கு'} ${k.house}`)).join(', ');
      if (r === 'SHADVARGA') return `ஷட்வர்க்கத்தில் சுபர் ${x.va.benefic}/6`;
      if (r === 'DREKKANA') return x.va.drekkana.malefic ? B.lagna.drekkanaTa[x.va.drekkana.malefic] : `${x.va.drekkana.num}-ஆம் திரேக்காணம் (${B.lagna.drekkanaTa[x.va.drekkana.nature]})`;
      if (r === 'VISHANADI') return `விஷ நாடி (${B.lagna.varaTa[x.vara]})`;
      if (r === 'UDAYA') return `${nv.udaya[R.UDAYA].udaya ? '' : 'உதய'}${!nv.udaya[R.UDAYA].udaya && !nv.udaya[R.UDAYA].asta ? '-' : ''}${nv.udaya[R.UDAYA].asta ? '' : 'அஸ்த'} சுத்தி இல்லை`;
      if (r === 'PLACEMENTS') {
        const bad = v.pl.avoid.map(([p, h]: [string, number]) => `${p === 'LAGNA_LORD' ? LAGNA_LORD_TA : PLANET_NAME_TA[p]} ${h}-ல்`);
        const pts = v.pl.points !== null && !B.lagna.placements[R.PLACEMENTS].pass.includes(v.pl.grade) ? [`புள்ளி ${v.pl.points}`] : [];
        return [...bad, ...pts].join(', ');
      }
      if (r === 'ASHTAMA') return l.ashtama[R.ASHTAMA].map((h: any) => `${h.from === 'LAGNA' ? 'பிறந்த லக்னத்துக்கு' : 'ஜன்ம ராசிக்கு'} ${h.house}-ஆம் ராசி`).join(', ');
      if (r === 'PDB') return `${B.lagna.pdbTa[l.pdb.kind]} (${l.night ? 'இரவு' : 'பகல்'})`;
      if (r === 'KARTARI') return 'கர்த்தரி';
      if (r === 'GANDANTA') return 'லக்ன கண்டாந்தம்';
      if (r === 'BANA') return 'மிருத்யு பாணம்';
      return r;
    }).join(' · ');
  };

  /** The cautions (விரும்பத்தக்கது checks that fail) over a joined good stretch, each once; §13.10's apart. */
  const cautionWhy = (its: any[]): { other: string[]; adverse: string[] } => {
    const other = new Set<string>();
    const adverse = new Set<string>();
    for (const { x, v } of its) {
      for (const r of v.cautions) {
        if (r === 'ADVERSE') adverseShown(x).forEach((c: string) => adverse.add(B.lagna.adverseTa[c]));
        else if (r === 'ADVERSE_CAUTION') x.adverse.filter((c: string) => (B.lagna.adverse[lagnaChosen().ADVERSE].caution ?? []).includes(c)).forEach((c: string) => adverse.add(B.lagna.adverseTa[c]));
        else if (r === 'EVENT_MARK') eventLagnaCodes(x).filter((c) => !isReject(c)).forEach((c) => other.add(evCodeTa(c)));
        else other.add(lagnaWhy(x, { ...v, reasons: [r] }));
      }
    }
    return { other: [...other].filter(Boolean), adverse: [...adverse] };
  };
  /** The cautions in short: §13.10 as a count, its combinations on opening (the owner, 2026-10-12). */
  const cautionLine = (its: any[], cls: string) => {
    const c = cautionWhy(its);
    if (!c.other.length && !c.adverse.length) return null;
    const head = [...c.other, ...(c.adverse.length ? [`§13.10 — ${c.adverse.length} சேர்க்கை`] : [])].join(', ');
    return (
      <span className={`${cls} text-amber-700`}> · கவனம்: {head}
        {c.adverse.length > 0 && (
          <details className="inline-block align-top ml-1">
            <summary className="cursor-pointer underline">விவரம்</summary>
            <span className="block">{c.adverse.join(', ')}</span>
          </details>
        )}
      </span>
    );
  };

  /** The ten evils under the chosen readings and rule — the same rule as the engine's `dashaVerdict` (marriageDoshas.js). */
  function dashaJudge(s: any, lattaOn: boolean) {
    const D = B.dasha;
    const present: string[] = D.doshas.filter((d: string) => {
      const v = s.doshas[d].readings[dashaReading[d] ?? D.readings[d].default];
      return v && v !== 'LAGNA';
    });
    const all = lattaOn ? ['LATTA', ...present] : present;
    const serious = present.filter((d) => D.serious.includes(d));
    const reject = ruleNow === 'NONE' ? false
      : ruleNow === 'ALL_TEN' ? all.length > 0
        : ruleNow === 'FIVE' ? serious.length > 0
          : ruleNow === 'FIVE_AND_SIX' ? serious.length > 0 || all.length > 4
            : all.length > 4;
    return { present, all, serious, reject };
  }

  /** What a present evil is, in a few words. */
  const doshaDetail = (s: any, d: string) => {
    const x = s.doshas[d];
    const v = x.readings[dashaReading[d] ?? B.dasha.readings[d].default];
    if (d === 'PAATA') return Array.isArray(v) ? `${v.map((y: number) => B.dasha.yogaTa[y]).join(', ')} முடிவு` : 'சூரியனிலிருந்து (நாரதர்)';
    if (d === 'YUTI') return `சந்திரனுடன் ${planetsTa(v)}${x.moonDignity ? ` · சந்திரன் ${DIGNITY_TA[x.moonDignity]} — நூல்களின்படி விலக்கு` : ''}`;
    if (d === 'VEDHA' || d === 'JAMITRA') return planetsTa(v);
    if (d === 'BANA') return `சூரியன் ${x.sunDeg}°`;
    if (d === 'EKARGALA') return `${B.dasha.yogaTa[x.yoga]}${x.exempt ? ' · காலப்பிரகாசிகை, வில்ஹெல்ம்: இந்த நட்சத்திரத்தில் இல்லை' : ''}`;
    if (d === 'UPAGRAHA') return `சூரியனிலிருந்து ${v}-வது`;
    if (d === 'KRANTI') return `${RASI_TA[v[0]]} – ${RASI_TA[v[1]]}`;
    if (d === 'DAGDHA') return `${s.tithi <= 15 ? 'வளர்பிறை' : 'தேய்பிறை'} ${v}-ஆம் திதி`;
    return '';
  };
  /** The lagnas to leave at this time (Jamitra from the lagna; Bana by tithi and lagna) — shown, not judged. */
  const lagnaNotes = (s: any) => {
    const out: string[] = [];
    const J = dashaReading.JAMITRA ?? B.dasha.readings.JAMITRA.default;
    const [signs, navs] = result.jamitraLagnas[s.doshas.JAMITRA.lagnaRef];
    if (J === 'NAVAMSA_55') out.push(`ஜாமித்ரம் — லக்ன நவாம்சம்: ${Object.keys(navs).map((n) => `${RASI_TA[Math.floor(Number(n) / 9)]} ${(Number(n) % 9) + 1}`).join(', ')}`);
    else out.push(`ஜாமித்ரம் — 7-ல் கிரகம் உள்ள லக்னம்: ${Object.keys(signs).map((n) => RASI_TA[Number(n)]).join(', ')}`);
    if ((dashaReading.BANA ?? B.dasha.readings.BANA.default) === 'TITHI_LAGNA') {
      out.push(`மிருத்யு பாணம் — லக்னம்: ${B.dasha.banaLagnas[s.tithi - 1].MRITYU.map((l: number) => RASI_TA[l - 1]).join(', ')}`);
    }
    return out;
  };
  const PAKSHA_TA: Record<string, string> = { SHUKLA: 'வளர்பிறை', KRISHNA: 'தேய்பிறை' };

  const judged = (result?.segments ?? []).map((s: any) => ({ s, j: judge(s) }));
  const rows = judged.filter(({ j }: any) => show === 'ALL' || (show === 'CLEAR' ? j.clear : show === 'GOOD_LAGNA' ? j.goodLagnas.length > 0 : !j.clear));
  const best = judged.flatMap(({ s, j }: any) => j.goodLagnas.map((g: any) => ({ s, g })));
  const byDay: [string, any[]][] = [];
  for (const r of rows) {
    const d = local(r.s.fromUtc).slice(0, 10);
    if (!byDay.length || byDay[byDay.length - 1][0] !== d) byDay.push([d, []]);
    byDay[byDay.length - 1][1].push(r);
  }

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Muhurta star</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">முகூர்த்த நட்சத்திரம் — லத்தை, திருமணத்தின் பத்து தோஷங்கள், தாரா பலம், சந்திர பலம், வைநாசிகம், 88/108-வது பாதம்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          முகூர்த்த நட்சத்திரம் என்பது அந்த நேரத்தில் சந்திரன் நிற்கும் நட்சத்திரம். ஒரு கிரகம் அதை "உதைத்தால்" (லத்தை) யாருக்கும் விலக்கு;
          திருமணத்துக்கு லத்தையோடு மேலும் ஒன்பது தோஷங்கள் (பாதம், யுதி, வேதை, ஜாமித்ரம், பாணம், ஏகார்கலம், உபக்கிரகம், க்ராந்தி சாம்யம், தக்த திதி);
          இவருக்கு — தாரா பலம் (ஜன்ம நட்சத்திரத்திலிருந்து), சந்திர பலம் (ஜன்ம ராசியிலிருந்து), ஜன்ம நட்சத்திரம், 88-வது, 108-வது பாதம், வைநாசிகம்.
          நூல்கள் வேறுபடும் இடங்களில் எல்லா வாசிப்புகளும் கணிக்கப்படுகின்றன; அதிகம் விளக்கும் நூலின் வாசிப்பு இயல்பு.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-ink mb-2">யாருக்கு?</h2>
        <PartyChooser party={party} setParty={setParty} loading={loading} />
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
          <label className="text-ink-soft">முதல் நாள் <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="ml-1 px-2 py-1 bg-surface-2 border border-line rounded text-ink" /></label>
          <label className="text-ink-soft">நாட்கள்
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="ml-1 px-2 py-1 bg-surface-2 border border-line rounded text-ink">
              {[7, 15, 30, 60, 90].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>
        {result && (
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            <span className="text-ink-soft">நிகழ்ச்சி நடக்கும் இடம் (லக்னம், சூரிய உதயம்){result.eventPlace.isBirthPlace ? ' — இப்போது பிறந்த ஊர்' : ''}:</span>
            <input value={place.name} onChange={(e) => setPlace({ ...place, name: e.target.value })} placeholder="ஊர்" className="w-28 px-2 py-1 bg-surface-2 border border-line rounded text-ink" />
            <label className="text-ink-soft">அட்சரேகை <input type="number" step="0.001" value={place.latitude} onChange={(e) => setPlace({ ...place, latitude: e.target.value })} className="w-20 px-1 py-1 bg-surface-2 border border-line rounded text-ink" /></label>
            <label className="text-ink-soft">தீர்க்கரேகை <input type="number" step="0.001" value={place.longitude} onChange={(e) => setPlace({ ...place, longitude: e.target.value })} className="w-20 px-1 py-1 bg-surface-2 border border-line rounded text-ink" /></label>
            <button type="button" className="px-2 py-0.5 rounded-full border border-saffron text-ink"
              onClick={() => { const lat = Number(place.latitude); const lon = Number(place.longitude); if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) setEventPlace({ name: place.name, latitude: lat, longitude: lon }); }}>
              இந்த இடம்
            </button>
            {eventPlace && <button type="button" className="px-2 py-0.5 rounded-full border border-line text-ink-soft" onClick={() => setEventPlace(null)}>பிறந்த ஊர்</button>}
          </div>
        )}
      </section>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · ஜன்ம நட்சத்திரம் {result.janma.starTa} {result.janma.pada}-ஆம் பாதம்</h2>
            <p className="text-xs text-ink-soft">{result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம் · நேரங்கள் {zone}</p>
            <ul className="text-xs text-ink mt-2 space-y-0.5">
              <li>88-வது பாதம்: <strong>{result.janma.pada88.starTa} {result.janma.pada88.pada}</strong> · 108-வது பாதம்: <strong>{result.janma.pada108.starTa} {result.janma.pada108.pada}</strong></li>
              <li>வைநாசிகம்: {B.vainashika.order.map((id: string) => `${B.vainashika[id].labelTa} — ${result.janma.vainashika[id].starTa}`).join(' · ')}
                {result.janma.vainashika.STAR_22.wilhelmExempt && <span className="text-ink-soft"> (வில்ஹெல்ம்: இந்த ஜன்ம நட்சத்திரத்துக்கு 22-வது கேடில்லை)</span>}
              </li>
            </ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">சிறந்த நேரங்கள் — நட்சத்திரத்தில் தடை இல்லை, லக்னமும் சுத்தம் ({best.length})</h2>
            <p className="text-[11px] text-ink-soft mb-2">கீழே உள்ள எல்லா விதிகளும் தேர்ந்த வாசிப்புகளின்படி; லக்னம் {result.eventPlace.name || `${result.eventPlace.latitude}, ${result.eventPlace.longitude}`}-க்கு, {B.lagna.events[lagnaEvent].labelTa} லக்ன சுத்தியுடன்.{isMarriage && ' புள்ளி = திருமண லக்னத்தின் விஸ்வ பலம் / விம்சோபகம் (20-ல்).'}</p>
            {best.length === 0 && <p className="text-xs text-ink-soft">இந்த வாசிப்புகளில் இந்தக் காலத்தில் இல்லை.</p>}
            <ul className="text-xs space-y-0.5" style={num}>
              {best.slice(0, 40).map(({ s, g }: any) => (
                <li key={g.fromMs}>
                  <span className="font-mono">{local(isoOf(g.fromMs)).slice(0, 16)} – {hm(isoOf(g.toMs))}</span> · {s.starTa} {s.pada} · {RASI_TA[g.l.lagna]} லக்னம் ({g.navs.map((n: number) => RASI_TA[n]).join(', ')} நவாம்சம்)
                  {isMarriage && g.v.pl.points !== null && <> · புள்ளி {g.v.pl.points} ({B.lagna.gradeTa[g.v.pl.grade]})</>}
                  {isMarriage && g.v.pl.avoid.length > 0 && <span className="text-amber-700"> · {g.v.pl.avoid.map(([p, h]: [string, number]) => `${p === 'LAGNA_LORD' ? LAGNA_LORD_TA : PLANET_NAME_TA[p]} ${h}-ல்`).join(', ')} (ஒன்று — பரிகாரத்துடன்)</span>}
                  {cautionLine(g.its, '')}
                </li>
              ))}
            </ul>
            {best.length > 40 && <p className="text-[11px] text-ink-soft mt-1">மேலும் {best.length - 40} — "நல்ல லக்னத்துடன்" என்று காட்டி அட்டவணையில் பார்க்கலாம்.</p>}
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">நேரங்கள் — {local(result.fromUtc).slice(0, 10)} முதல் {result.days} நாள்</h2>
            <div className="mb-2">
              <Switch label="ராகுவின் உதை" value={rahu} onChange={setRahu}
                options={B.rahu.order.map((id: string) => [id, `${B.rahu[id].labelTa}${id === B.rahu.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="லத்தை — எந்தப் பாதம்" value={padaRule} onChange={setPadaRule}
                options={B.padaRules.order.map((id: string) => [id, `${B.padaRules[id].labelTa}${id === B.padaRules.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="வைநாசிகம்" value={vainashika} onChange={setVainashika}
                options={B.vainashika.order.map((id: string) => [id, `${B.vainashika[id].labelTa}${id === B.vainashika.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="தீய தாரைகள்" value={taraBad} onChange={setTaraBad}
                options={B.taraBad.order.map((id: string) => [id, `${B.taraBad[id].labelTa}${id === B.taraBad.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="தாரை — சுற்று விதி" value={taraCycle} onChange={setTaraCycle}
                options={B.taraCycles.order.map((id: string) => [id, `${B.taraCycles[id].labelTa}${id === B.taraCycles.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="சந்திர பலம்" value={chandraReading} onChange={setChandraReading}
                options={B.chandraReadings.order.map((id: string) => [id, `${B.chandraReadings[id].labelTa}${id === B.chandraReadings.default ? ' (இயல்பு)' : ''}`])} />
              <Switch label="சந்திராஷ்டம விடுப்பு" value={chandraRelief} onChange={setChandraRelief}
                options={B.chandraRelief.order.map((id: string) => [id, `${B.chandraRelief[id].labelTa}${id === B.chandraRelief.default ? ' (இயல்பு)' : ''}`])} />
              {isMarriage
                ? <Switch label="தச தோஷம் — விதி" value={dashaRule} onChange={setDashaRule}
                  options={B.dasha.rules.order.map((id: string) => [id, `${B.dasha.rules[id].labelTa}${id === B.dasha.rules.default ? ' (இயல்பு)' : ''}`])} />
                : <span className="inline-block text-[11px] text-ink-soft mr-3 mb-1">தச தோஷம்: திருமணத்துக்கானவை — {B.lagna.events[lagnaEvent].labelTa}-க்குக் காட்டப்படும், தீர்ப்பில் இல்லை (லத்தை எல்லோருக்கும் தீர்ப்பில் உண்டு).</span>}
              <details className="mb-1">
                <summary className="cursor-pointer text-[11px] text-ink-soft">தச தோஷம் — ஒவ்வொன்றின் வாசிப்பு</summary>
                <div className="mt-1">
                  {B.dasha.doshas.filter((d: string) => B.dasha.readings[d].order.length > 1).map((d: string) => (
                    <Switch key={d} label={B.dasha.nameTa[d]} value={dashaReading[d] ?? B.dasha.readings[d].default}
                      onChange={(v) => setDashaReading({ ...dashaReading, [d]: v })}
                      options={B.dasha.readings[d].order.map((id: string) => [id, `${B.dasha.readings[d][id].labelTa}${id === B.dasha.readings[d].default ? ' (இயல்பு)' : ''}`])} />
                  ))}
                </div>
              </details>
              <Switch label="லக்ன சுத்தி — நிகழ்ச்சி" value={lagnaEvent} onChange={(v) => { setLagnaEvent(v); setTierReading({}); }}
                options={B.lagna.events.order.map((id: string) => [id, `${B.lagna.events[id].labelTa}${id === B.lagna.events.default ? ' (இயல்பு)' : ''}`])} />
              {evName && (
                <>
                  <Switch label={`${B.lagna.eventRules[evName].labelTa} — நூல்`} value={evBookId!} onChange={(v) => setEventBook({ ...eventBook, [evName]: v })}
                    options={B.lagna.eventRules[evName].order.map((id: string) => [id, `${B.lagna.eventRules[evName][id].labelTa}${id === B.lagna.eventRules[evName].default ? ' (இயல்பு)' : ''}`])} />
                  {evHasDoor && (
                    <Switch label="வாசல் திசை" value={door} onChange={setDoor}
                      options={[['', 'தேர்வு இல்லை'], ...B.lagna.doors.order.map((d: string) => [d, B.lagna.doors.ta[d]])] as [string, string][]} />
                  )}
                  {evName === 'TRAVEL' && (
                    <>
                      <Switch label="பயணத் திசை" value={direction} onChange={setDirection}
                        options={[['', 'தேர்வு இல்லை'], ...B.lagna.directions.order.map((d: string) => [d, B.lagna.directions.ta[d]])] as [string, string][]} />
                      {!result.direction && <span className="inline-block text-[11px] text-amber-700 mr-3 mb-1">திசை தேர்ந்தால் மட்டும் திசை விதிகள் (சூலங்கள், யோகினி, சந்திரன், சுக்கிரன், பரிகம் …) கணிக்கப்படும்.</span>}
                    </>
                  )}
                </>
              )}
              <details className="mb-1">
                <summary className="cursor-pointer text-[11px] text-ink-soft">லக்ன சுத்தி — வாசிப்புகள்</summary>
                <div className="mt-1">
                  {(['COMMON', 'PLACEMENTS', 'ASHTAMA', 'KARTARI', 'GANDANTA', 'NAV_LAST', 'NAV_WHICH', 'NAV_NATAL', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'] as const).filter((k) => B.lagna.events[lagnaEvent].checks.includes(k)).map((k) => {
                    const t = B.lagna[LAGNA_TABLE[k]];
                    const ids: string[] = B.lagna.events[lagnaEvent].only[k] ?? t.order;
                    return (
                      <Switch key={k} label={CHECK_TA[k]} value={lagnaChosen()[k]} onChange={(v) => setLagnaReading({ ...lagnaReading, [k]: v })}
                        options={ids.map((id: string) => [id, `${t[id].labelTa}${id === t.default ? ' (இயல்பு)' : ''}`])} />
                    );
                  })}
                </div>
              </details>
              <details className="mb-1">
                <summary className="cursor-pointer text-[11px] text-ink-soft">லக்ன சுத்தி — {B.lagna.tierTa.MUST} / {B.lagna.tierTa.PREFER}</summary>
                <p className="text-[11px] text-ink-soft mt-1">{B.lagna.tierNoteTa}</p>
                <div className="mt-1">
                  {Object.keys(B.lagna.tiers[lagnaEvent]).map((k) => (
                    <Switch key={k} label={CHECK_TA[k] ?? k} value={tierOf(k)} onChange={(v) => setTierReading((t) => ({ ...t, [k]: v }))}
                      options={(['MUST', 'PREFER'] as const).map((id) => [id, `${B.lagna.tierTa[id]}${id === B.lagna.tiers[lagnaEvent][k] ? ' (இயல்பு)' : ''}`])} />
                  ))}
                </div>
              </details>
              <Switch label="காட்டு" value={show} onChange={(v) => setShow(v as Show)}
                options={[['ALL', 'எல்லாம்'], ['CLEAR', 'தடை இல்லாதவை'], ['GOOD_LAGNA', 'நல்ல லக்னத்துடன்'], ['BLOCKED', 'தடை உள்ளவை']]} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 1180 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left">
                  <th className="py-1 pr-2">நேரம்</th><th className="py-1 pr-2">நட்சத்திரம் · பாதம்</th><th className="py-1 pr-2">லத்தை</th><th className="py-1 pr-2">தச தோஷம்</th><th className="py-1 pr-2">தாரை · சந்திரன்</th><th className="py-1 pr-2">இவருக்கு</th><th className="py-1">லக்னம் ({result.eventPlace.name || `${result.eventPlace.latitude}, ${result.eventPlace.longitude}`})</th>
                </tr></thead>
                {byDay.map(([d, list]) => (
                  <tbody key={d} className="align-top">
                    <tr><td colSpan={7} className="pt-2 pb-0.5 font-semibold text-ink">{d}</td></tr>
                    {list.map(({ s, j }: any) => (
                      <tr key={s.fromUtc} className={`border-b border-line/40 ${s.current ? 'bg-amber-50' : ''}`}>
                        <td className="py-1 pr-2 font-mono whitespace-nowrap" style={num}>
                          {hm(s.fromUtc)} – {local(s.toUtc).slice(0, 10) === d ? hm(s.toUtc) : local(s.toUtc).slice(5)}
                          {s.current && <span className="block font-sans text-amber-800">இப்போது</span>}
                        </td>
                        <td className={`py-1 pr-2 ${j.clear ? 'text-teal' : 'text-ink'}`}>{s.starTa} {s.pada}{j.clear && <span className="block text-[11px]">தடை இல்லை</span>}
                          {evName && (
                            <span className="block text-[11px] text-ink-soft">{B.lagna.monthTa[s.month] ?? '—'} மாதம்
                              {j.evStar.length > 0 && <span className={j.evStar.some(isReject) ? 'text-rose' : 'text-amber-700'}> · {j.evStar.map(evCodeTa).join(', ')}</span>}
                            </span>
                          )}
                        </td>
                        <td className="py-1 pr-2">
                          {j.kicks.length === 0 && <span className="text-ink-soft">—</span>}
                          {j.kicks.map((h: any) => {
                            const on = j.counted.includes(h);
                            const dir = h.rahu ? B.rahu[h.rahu].dir : B.kicks[h.planet].dir;
                            return (
                              <span key={`${h.planet}${h.rahu}`} className={`block ${on ? 'text-rose' : 'text-ink-soft'}`}>
                                {h.planetTa} ({h.kickerStarTa} {h.kickerPada}, {DIR_TA[dir]} {B.kicks[h.planet].count})
                                {h.sameQuarter && ' · அதே பாதம்'}{h.jvQuarter && ` · ${dir > 0 ? 'முதல்' : 'கடைசி'} பாதம்`}
                                {!on && ' — இந்தப் பாத விதியில் தடை இல்லை'}
                              </span>
                            );
                          })}
                        </td>
                        <td className="py-1 pr-2">
                          {j.dasha.present.length === 0 && <span className="text-ink-soft">—</span>}
                          {j.dasha.present.map((d: string) => (
                            <span key={d} className={`block ${ruleNow === 'NONE' ? 'text-ink-soft' : B.dasha.serious.includes(d) ? 'text-rose' : 'text-amber-700'}`}>
                              {B.dasha.nameTa[d]} — {doshaDetail(s, d)}
                            </span>
                          ))}
                          {j.dasha.all.length > 0 && ruleNow !== 'NONE' && (
                            <span className={`block text-[11px] ${j.dasha.reject ? 'text-rose' : 'text-ink-soft'}`}>
                              பத்தில் {j.dasha.all.length}{j.counted.length > 0 ? ' (லத்தை உட்பட)' : ''}{j.dasha.serious.length > 0 ? `, கடுமையானவை ${j.dasha.serious.length}` : ''} — {j.dasha.reject ? 'இந்த விதியில் விலக்கு' : 'இந்த விதியில் ஏற்கலாம்'}
                            </span>
                          )}
                          {lagnaNotes(s).map((t) => <span key={t} className="block text-[11px] text-ink-soft">{t}</span>)}
                        </td>
                        <td className="py-1 pr-2">
                          <span className={`block ${j.tara === 'REJECT' ? 'text-rose' : j.tara === 'CAUTION' ? 'text-amber-700' : 'text-ink'}`}>
                            {B.taraNamesTa[s.tara.n - 1]} ({s.tara.count}, {s.tara.cycle}-ஆம் சுற்று){j.tara === 'REJECT' ? ' — தாரா பலம் இல்லை' : j.tara === 'CAUTION' ? ' — கவனம்' : ''}
                          </span>
                          <span className={`block ${j.chandra ? 'text-ink' : 'text-rose'}`}>
                            சந்திரன் {s.chandra.house}-ல் · {PAKSHA_TA[s.chandra.paksha]}{j.chandra ? '' : ' — சந்திர பலம் இல்லை'}
                            {s.chandra.vedhaBy.length > 0 && <span className="text-ink-soft"> (வேதை: {s.chandra.vedhaHouse}-ல் {s.chandra.vedhaBy.map((p: string) => PLANET_NAME_TA[p] ?? p).join(', ')})</span>}
                          </span>
                          {s.chandra.chandrashtama && (
                            <span className={`block text-[11px] ${j.chandra ? 'text-teal' : 'text-rose'}`}>
                              சந்திராஷ்டமம்{B.chandrashtamaKinds[s.chandra.chandrashtama] ? ` — ${B.chandrashtamaKinds[s.chandra.chandrashtama].ta} (வில்ஹெல்ம்)` : ''}
                              {j.chandra && ` · விடுப்பு — ${B.chandraRelief[chandraRelief].kinds && B.chandrashtamaKinds[s.chandra.chandrashtama]?.harmless ? 'தீமையற்ற வகை' : 'அதிபதிகள் நண்பர்கள்'}`}
                            </span>
                          )}
                        </td>
                        <td className="py-1">
                          {j.personal.map((k: string) => <span key={k} className="block text-rose">{PERSONAL_TA[k]}{k === 'JANMA' && s.personal.JANMA_PADA ? ' — ஜன்ம பாதமும்' : ''}</span>)}
                          {j.vain && <span className="block text-rose">வைநாசிகம் ({B.vainashika[vainashika].labelTa})</span>}
                          {!j.vain && B.vainashika.order.filter((id: string) => id !== vainashika && s.personal.VAINASHIKA[id]).map((id: string) => (
                            <span key={id} className="block text-ink-soft">வைநாசிகம் — {B.vainashika[id].labelTa} வாசிப்பில் மட்டும்</span>
                          ))}
                          {s.remedy88 && (
                            <span className="block text-[11px] text-ink-soft">
                              லக்னாதிபதி / 10-ஆம் அதிபதி நண்பர்கள் (தீமை நீங்கும்): {s.remedy88.filter((x: any) => x.friends).map((x: any) => `${hm(x.fromUtc)}–${hm(x.toUtc)} ${x.lagnaTa}`).join(', ') || 'இந்த நேரத்தில் இல்லை'}
                            </span>
                          )}
                          {j.personal.length === 0 && !j.vain && <span className="text-ink-soft">—</span>}
                        </td>
                        <td className="py-1">
                          {j.lagnas.map((g: any) => {
                            const mid = g.items[Math.floor(g.items.length / 2)];
                            const signWhy = lagnaWhy(mid.x, mid.v, true);
                            const left = g.items.filter((it: any) => !it.v.ok);
                            // The shadvarga counts in one entry (lowest–highest) rather than one per count.
                            const shad = [...new Set<number>(left.filter((it: any) => it.v.reasons.includes('SHADVARGA')).map((it: any) => it.x.va.benefic))].sort((a, b) => a - b);
                            const navWhy = [
                              ...(shad.length ? [`ஷட்வர்க்கத்தில் சுபர் ${shad.length > 1 ? `${shad[0]}–${shad[shad.length - 1]}` : shad[0]}/6`] : []),
                              ...new Set(left.flatMap((it: any) => lagnaWhy(it.x, { ...it.v, reasons: it.v.reasons.filter((r: string) => isPartReason(r) && r !== 'SHADVARGA') }).split(' · ')).filter(Boolean)),
                            ];
                            return (
                              <span key={g.fromMs} className={`block ${g.good.length ? (j.clear ? 'text-teal font-semibold' : 'text-ink') : 'text-ink-soft'}`} style={num}>
                                {hm(isoOf(g.fromMs))}–{hm(isoOf(g.toMs))} {RASI_TA[g.l.lagna]}
                                {isMarriage && mid.v.pl.points !== null && <span className="font-normal"> · {mid.v.pl.points}</span>}
                                {g.good.length > 0
                                  ? <> ✓ {g.good.map((ok: any, i: number) => (
                                    <span key={ok.fromMs}>{i > 0 && ', '}{hm(isoOf(ok.fromMs))}–{hm(isoOf(ok.toMs))} ({ok.navs.map((n: number) => RASI_TA[n]).join(', ')} நவாம்சம்)
                                      {cautionLine(ok.its, 'font-normal text-[11px]')}
                                    </span>
                                  ))}</>
                                  : <> ✗ <span className="font-normal text-[11px]">({[signWhy, navWhy.length ? `பகுதிகளில்: ${navWhy.slice(0, 5).join(', ')}${navWhy.length > 5 ? '…' : ''}` : ''].filter(Boolean).join(' · ')})</span></>}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
            <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-3 space-y-0.5">{B.notesTa.map((t: string) => <li key={t}>{t}</li>)}</ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">லத்தை — நூல்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">வரிசை: அதிக விளக்கம் உள்ள நூல் முதலில் — {B.lattaRank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.</p>
            <p className="text-xs text-ink">
              உதைகள்: {Object.entries(B.kicks).map(([p, k]: [string, any]) => `${k.planetTa} ${k.count}-வது ${DIR_TA[k.dir]}`).join(', ')} (உதைக்கும் கிரகம் நிற்கும் நட்சத்திரம் 1). எல்லா நூல்களிலும் இதே எண்ணிக்கை.
            </p>
            <p className="text-xs font-semibold text-ink mt-2">ராகுவின் திசை</p>
            <ul className="text-xs space-y-0.5">{B.rahu.order.map((id: string) => <li key={id}><strong>{B.rahu[id].labelTa}{id === B.rahu.default ? ' (இயல்பு)' : ''}:</strong> {B.rahu[id].booksTa}</li>)}</ul>
            <p className="text-xs font-semibold text-ink mt-2">எந்தப் பாதம்</p>
            <ul className="text-xs space-y-0.5">{B.padaRules.order.map((id: string) => <li key={id}><strong>{B.padaRules[id].labelTa}{id === B.padaRules.default ? ' (இயல்பு)' : ''}:</strong> {B.padaRules[id].textTa}</li>)}</ul>
            <Cites list={B.lattaRank.order.map((b: string) => B.lattaSources[b]).concat([B.lattaSources.SHRIDHAR_PADAS, B.lattaSources.MUHURTA_CHINTAMANI_64])} />
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer text-ink-soft">உதைக்கு நூல்கள் சொல்லும் பலன் (நூல்களின் கூற்று — இந்த மென்பொருளின் முன்கணிப்பு அல்ல)</summary>
              <table className="w-full mt-1" style={{ minWidth: 560 }}>
                <thead><tr className="text-ink-soft text-left"><th className="pr-2">நூல்</th>{Object.keys(B.kicks).map((p) => <th key={p} className="pr-2">{B.kicks[p].planetTa}</th>)}</tr></thead>
                <tbody>
                  {Object.entries(B.lattaEffects).map(([id, e]: [string, any]) => (
                    <tr key={id} className="border-t border-line/40 align-top">
                      <td className="pr-2 text-ink">{e.labelTa}</td>
                      {Object.keys(B.kicks).map((p) => <td key={p} className="pr-2 text-ink-soft">{e.byPlanet[p]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Cites list={Object.values(B.lattaEffects).map((e: any) => e.source)} />
            </details>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">திருமணத்தின் பத்து தோஷங்கள் — நூல்கள்</h2>
            <p className="text-xs text-ink">
              லத்தை, பாதம், யுதி, வேதை, ஜாமித்ரம், மிருத்யு பஞ்சகம் (பாணம்), ஏகார்கலம், உபக்கிரகம், க்ராந்தி சாம்யம், தக்த திதி — ஜோஷி, வசிஷ்டா, அகர்வால், ஸ்ரீதர், கல்யாணராமன் (சீக்ரபோதம்) அனைவரும் இதே பத்து.
              ஒவ்வொன்றுக்கும் நூல்கள் சொல் எண்ணிக்கை வரிசையில்; நூல்கள் வேறுபடும் இடங்களில் எல்லா வாசிப்பும் கணிக்கப்படுகிறது, அதிகம் விளக்கும் நூலின் வாசிப்பு இயல்பு.
              லக்னத்தைப் பொறுத்தவை (லக்னத்திலிருந்து ஜாமித்ரம், திதி + லக்ன பாணம்) ஒவ்வொரு நேரத்துக்கும் தவிர்க்க வேண்டிய லக்னங்களாகக் காட்டப்படுகின்றன — தீர்ப்பில் சேர்க்கப்படவில்லை.
            </p>
            <p className="text-xs font-semibold text-ink mt-2">எத்தனை இருக்கலாம்</p>
            <p className="text-[11px] text-ink-soft">{B.dasha.rank.RULE.measureTa}</p>
            <ul className="text-xs space-y-1">{B.dasha.rules.order.map((id: string) => (
              <li key={id}><strong>{B.dasha.rules[id].labelTa}{id === B.dasha.rules.default ? ' (இயல்பு)' : ''}:</strong> {B.dasha.rules[id].textTa}{B.dasha.rules[id].booksTa && <span className="text-ink-soft"> ({B.dasha.rules[id].booksTa})</span>}</li>
            ))}</ul>
            <Cites list={B.dasha.rank.RULE.order.map((b: string) => B.dasha.sources.RULE[b])} />
            {B.dasha.doshas.map((d: string) => (
              <details key={d} className="mt-2 text-xs">
                <summary className="cursor-pointer font-semibold text-ink">{B.dasha.nameTa[d]}{B.dasha.serious.includes(d) ? ' — கடுமையான ஐந்தில் ஒன்று' : ''}</summary>
                <p className="text-[11px] text-ink-soft mt-1">வரிசை: {B.dasha.rank[d].measureTa}</p>
                <ul className="space-y-1 mt-1">{B.dasha.readings[d].order.map((id: string) => (
                  <li key={id}><strong>{B.dasha.readings[d][id].labelTa}{id === B.dasha.readings[d].default ? ' (இயல்பு)' : ''}:</strong> {B.dasha.readings[d][id].textTa} <span className="text-ink-soft">({B.dasha.readings[d][id].booksTa})</span></li>
                ))}</ul>
                <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-1 space-y-0.5">{B.dasha.notesTa[d].map((t: string) => <li key={t}>{t}</li>)}</ul>
                <Cites list={B.dasha.rank[d].order.map((b: string) => B.dasha.sources[d][b]).concat(d === 'VEDHA' ? [B.dasha.abhijitSource] : [])} />
              </details>
            ))}
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">லக்ன சுத்தி ({B.lagna.events[lagnaEvent].labelTa}) — நூல்கள்</h2>
            <p className="text-xs text-ink">
              முகூர்த்த லக்னம் = நிகழ்ச்சி நடக்கும் இடத்தில் அந்த நேரத்தில் உதிக்கும் ராசி. இந்த நபரின் பிறந்த லக்னம்: {result.books.lagna.natalLagna !== null ? RASI_TA[result.books.lagna.natalLagna] : '—'}, ஜன்ம ராசி: {result.janma.signTa}.
              ஒவ்வொரு சோதனைக்கும் நூல்கள் சொல் எண்ணிக்கை வரிசையில்.
              {!isMarriage && ' மற்ற சுப காரியங்களுக்கு: "எல்லாச் சுப காரியங்களுக்கும்" என்று ஒரு நூல் சொல்லும் சோதனைகள் மட்டும் — ஒவ்வொன்றின் கீழும் அந்த நூல்கள்.'}
            </p>
            {([
              ['COMMON', 'பொது லக்ன சுத்தி — எல்லாச் சுப காரியங்களுக்கும்', B.lagna.common],
              ['PLACEMENTS', 'லக்னத்திலிருந்து கிரகங்களின் இடம், புள்ளிகள்', B.lagna.placements],
              ['ASHTAMA', 'பிறந்த லக்னம் / ஜன்ம ராசியிலிருந்து 8-ஆம் ராசி', B.lagna.ashtama],
              ['PDB', 'செவிடு, குருடு, முட லக்னங்கள் (பகல் / இரவு)', null],
              ['KARTARI', 'கர்த்தரி', B.lagna.kartari],
              ['GANDANTA', 'லக்ன கண்டாந்தம்', B.lagna.gandanta],
              ['NAV_LAST', 'நவாம்சம்: கடைசி நவாம்சம், வர்கோத்தமம், சர நவாம்சம்', B.lagna.navLast],
              ['NAV_WHICH', 'நவாம்சம்: எந்த நவாம்சங்கள் நல்லவை', B.lagna.navWhich],
              ['NAV_NATAL', 'நவாம்சம்: பிறந்த 8, 12-ன் நவாம்சமும் அதிபதியும்', B.lagna.navNatal],
              ['UDAYA', 'உதய-அஸ்த சுத்தி (லக்ன, நவாம்ச, 7-ஆம் அதிபதிகளின் பார்வை)', B.lagna.udaya],
              ['SHADVARGA', 'ஷட்வர்க்கம் — லக்னத்தின் ஆறு வர்க்க அதிபதிகள்', B.lagna.shadvarga],
              ['DREKKANA', 'லக்னத்தின் திரேக்காணம்', B.lagna.drekkana],
              ['VISHANADI', 'லக்ன விஷ நாடி (புஜங்க, க்ருத்ர, வராக / ராகு பகுதிகள்)', B.lagna.vishanadi],
              ['ADVERSE', 'பாதகச் சேர்க்கைகள் — ஸ்ரீதர் §13.10 (லக்னாதிபதி, 8-ஆம் இடம், சித்ர கிரகங்கள் …)', B.lagna.adverse],
            ] as [string, string, any][]).filter(([k]) => B.lagna.events[lagnaEvent].checks.includes(k)).map(([k, title, t]) => (
              <details key={k} className="mt-2 text-xs">
                <summary className="cursor-pointer font-semibold text-ink">{title}</summary>
                <p className="text-[11px] text-ink-soft mt-1">வரிசை: {B.lagna.rank[k].measureTa}</p>
                {!isMarriage && B.lagna.scope[k] && (
                  <div className="mt-1">
                    <p className="text-[11px] text-ink">எல்லாச் சுப காரியங்களுக்கும்:{B.lagna.events.OTHER.only[k] && ` (${B.lagna.events.OTHER.only[k].map((id: string) => t[id].labelTa).join(', ')} வாசிப்பு மட்டும்)`}</p>
                    <Cites list={B.lagna.scope[k]} />
                  </div>
                )}
                {t && <ul className="space-y-1 mt-1">{(B.lagna.events[lagnaEvent].only[k] ?? t.order).map((id: string) => (
                  <li key={id}><strong>{t[id].labelTa}{id === t.default ? ' (இயல்பு)' : ''}:</strong> {t[id].textTa} <span className="text-ink-soft">({t[id].booksTa})</span></li>
                ))}</ul>}
                {k === 'PLACEMENTS' && (
                  <table className="mt-1" style={num}>
                    <thead><tr className="text-ink-soft text-left"><th className="pr-2">கிரகம்</th><th className="pr-2">நல்ல இடம் (புள்ளி)</th>{B.lagna.placements.order.map((id: string) => <th key={id} className="pr-2">{id === 'MUHURTA_CHINTAMANI' ? 'மு.சி.' : B.bookTa[id]?.split(' ')[0] ?? id} — தவிர்</th>)}</tr></thead>
                    <tbody>{[...Object.keys(B.lagna.points), 'LAGNA_LORD'].map((p) => (
                      <tr key={p} className="border-t border-line/40">
                        <td className="pr-2">{p === 'LAGNA_LORD' ? LAGNA_LORD_TA : PLANET_NAME_TA[p]}</td>
                        <td className="pr-2">{B.lagna.points[p] ? `${B.lagna.points[p].good.join(', ')} (${B.lagna.points[p].points})` : '—'}</td>
                        {B.lagna.placements.order.map((id: string) => <td key={id} className="pr-2">{(B.lagna.avoid[id][p] ?? []).join(', ') || '—'}</td>)}
                      </tr>
                    ))}</tbody>
                  </table>
                )}
                {k === 'PDB' && (
                  <p className="mt-1">பகல்: {Object.entries(B.lagna.pdb.DAY).map(([kind, ss]: [string, any]) => `${B.lagna.pdbTa[kind]} — ${ss.map((x: number) => RASI_TA[x]).join(', ')}`).join('; ')}. இரவு: {Object.entries(B.lagna.pdb.NIGHT).map(([kind, ss]: [string, any]) => `${B.lagna.pdbTa[kind]} — ${ss.map((x: number) => RASI_TA[x]).join(', ')}`).join('; ')}.</p>
                )}
                <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-1 space-y-0.5">{B.lagna.notesTa[k].map((n: string) => <li key={n}>{n}</li>)}</ul>
                <Cites list={B.lagna.rank[k].order.map((b: string) => B.lagna.sources[k][b]).filter(Boolean)} />
              </details>
            ))}
            {!isMarriage && (
              <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-2 space-y-0.5">
                {Object.entries(B.lagna.scopeOutTa).map(([k, n]: [string, any]) => <li key={k}>இங்கே இல்லை — {n}</li>)}
              </ul>
            )}
            <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-2 space-y-0.5">{B.lagna.notesTa.GENERAL.map((n: string) => <li key={n}>{n}</li>)}</ul>
          </section>

          {evName && (() => {
            const ER = B.lagna.eventRules[evName];
            const stars = (xs: number[]) => xs.map((i) => B.lagna.starTa[i]).join(', ');
            const tithiTa = (t: number) => (t === 15 ? 'பௌர்ணமி' : t === 30 ? 'அமாவாசை' : t < 15 ? `வளர் ${t}` : `தேய் ${t - 15}`);
            const rasis = (xs: number[]) => xs.map((i) => RASI_TA[i]).join(', ');
            const days = (xs: number[]) => xs.map((i) => B.lagna.varaTa[i]).join(', ');
            const months = (xs: number[]) => xs.map((i) => B.lagna.monthTa[i]).join(', ');
            return (
              <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
                <h2 className="text-sm font-semibold text-ink mb-1">{ER.labelTa} — நூல்களின் தனி விதிகள்</h2>
                <p className="text-[11px] text-ink-soft">வரிசை: {B.lagna.eventRank[evName].measureTa}</p>
                {(evName === 'UPANAYANA' || ER.ageTa) && (() => {
                  // The running year from birth (a Saura year — the sidereal year, our reading), shown, not judged.
                  const birth = Date.parse(`${result.native.date}T00:00:00Z`);
                  const year = Math.floor((Date.parse(result.fromUtc) - birth) / (365.2564 * 86400000)) + 1;
                  return (
                    <p className="text-xs text-ink mt-1">
                      {Number.isFinite(year) && <>வயது: {local(result.fromUtc).slice(0, 10)} அன்று பிறப்பிலிருந்து <strong>{year}-ஆம் ஆண்டு</strong> (சௌர ஆண்டு). </>}
                      {evName === 'UPANAYANA'
                        ? <>நூல்களின் ஆண்டுகள்: {Object.values(B.lagna.eventYears).map((v: any) => `${v.ta} ${v.years.join(' அல்லது ')} (எல்லை ${v.limit})`).join('; ')} — காட்டப்படும், தீர்ப்பில் இல்லை.</>
                        : ER.ageTa}
                    </p>
                  );
                })()}
                {ER.order.map((id: string) => {
                  const r = ER[id];
                  return (
                    <details key={id} className="mt-2 text-xs" open={id === evBookId}>
                      <summary className="cursor-pointer font-semibold text-ink">{r.labelTa}{id === ER.default ? ' (இயல்பு)' : ''}{id === evBookId ? ' ← தேர்ந்தது' : ''}</summary>
                      {r.linesTa && <ul className="mt-1 space-y-0.5 text-ink list-disc ml-5">{r.linesTa.map((t: string) => <li key={t}>{t}</li>)}</ul>}
                      {!r.linesTa && <ul className="mt-1 space-y-0.5 text-ink">
                        {r.masa && <li>மாதம்: {months(r.masa.good)}{r.masa.mid.length > 0 && <> · நடுத்தரம் {months(r.masa.mid)}</>}{!r.masa.strict && ' (விருப்பம்)'}</li>}
                        {r.uttarayana && <li>உத்தராயணம்: {r.uttarayana === 'REQUIRED' ? 'வேண்டும்' : 'விருப்பம்'}</li>}
                        {r.nak && <li>நட்சத்திரம்: {stars(r.nak.good)}{r.nak.mid.length > 0 && <> · நடுத்தரம் {stars(r.nak.mid)}</>}{r.digdwar && ' · வாசலை நோக்கியவையும்'}</li>}
                        {r.tithi && <li>திதி: {r.tithi.length >= 23 ? `${30 - r.tithi.length} தவிர மற்றவை (${[...Array(30).keys()].map((i) => i + 1).filter((t) => !r.tithi.includes(t)).map(tithiTa).join(', ')} இல்லை)` : r.tithi.map(tithiTa).join(', ')}{r.tithiDoor && ' · வாசல் திசைக்கு உரிய வகை'}</li>}
                        {r.vara && <li>கிழமை: {days(r.vara.good)}{r.vara.mid.length > 0 && <> · நடுத்தரம் {days(r.vara.mid)}</>}</li>}
                        {r.lagna && <li>லக்னம்: {rasis(r.lagna.good)}{r.lagna.mid.length > 0 && <> · நடுத்தரம் {rasis(r.lagna.mid)}</>}
                          {r.lagna.alt && <> · அல்லது {r.lagna.alt.from === 'MOON' ? 'ஜன்ம ராசியிலிருந்து' : 'பிறந்த லக்னம் / ஜன்ம ராசியிலிருந்து'} {r.lagna.alt.houses.join(', ')}-ஆம் ராசி{r.lagna.alt.notMovable && ' (சர ராசி அல்லாமல்)'}</>}
                          {r.lagna.movable === 'NAV_TAURUS' && ' · சர ராசி ரிஷப நவாம்சத்துடன் மட்டும்'}
                          {r.lagna.movable === 'BENEFIC_NAV_AND_UPACHAYA' && ' · சர ராசி சுப நவாம்சத்துடன், பிறப்பிலிருந்து 3, 6, 10, 11 எனில்'}</li>}
                        {r.nav && <li>நவாம்சம்: சுபருடையது</li>}
                        {(r.empty || r.emptyPref) && <li>காலி வீடுகள்: {(r.empty ?? []).join(', ')}{r.emptyPref && <> · விருப்பம் {r.emptyPref.join(', ')}</>}</li>}
                        {r.beneficIn && <li>சுபர் (புதன், குரு, சுக்கிரன்): {r.beneficIn.join(', ')}-ல்</li>}
                        {r.maleficIn && <li>பாவர் (சூரியன், செவ்வாய், சனி): {r.maleficIn.join(', ')}-ல்</li>}
                        {r.beneficKendra && <li>கேந்திரத்தில் ஒரு சுபர்</li>}
                        {r.moonNot && <li>சந்திரன் {r.moonNot.join(', ')}-ல் கூடாது</li>}
                        {r.jupVenNotSet && <li>குரு, சுக்கிரன் அஸ்தங்கம் கூடாது</li>}
                        {r.kumbha && <li>கும்ப சக்கரம்: சூரியனின் நட்சத்திரம் முதலாக எண்ணி {r.kumbha.join(', ')}-ஆவது நல்லவை</li>}
                        {r.sunLeft && <li>சூரியன் "இடப்புறம்" (வாசல் திசைப்படி)</li>}
                      </ul>}
                      <Cites list={[B.lagna.eventSources[evName][id]]} />
                    </details>
                  );
                })}
                <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-2 space-y-0.5">{B.lagna.eventNotesTa[evName].map((n: string) => <li key={n}>{n}</li>)}</ul>
                <Cites list={[...B.lagna.eventSources.MONTHS, ...(['UPANAYANA', 'TRAVEL', 'VIDYARAMBHA', 'BUSINESS', 'MEDICINE', 'SURGERY'].includes(evName) ? [B.lagna.eventSources.VISHTI] : [])]} />
              </section>
            );
          })()}

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">இவருக்கு மட்டும் — நூல்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">வரிசை: {B.personalRank.measureTa}</p>
            <ul className="text-xs space-y-2">
              {Object.entries(B.personal).map(([id, c]: [string, any]) => (
                <li key={id}><strong>{c.labelTa}:</strong> {c.textTa}<Cites list={c.sources} /></li>
              ))}
              {B.vainashika.order.map((id: string) => (
                <li key={id}><strong>வைநாசிகம் — {B.vainashika[id].labelTa}{id === B.vainashika.default ? ' (இயல்பு)' : ''}:</strong> {B.vainashika[id].textTa}<Cites list={B.vainashika[id].sources} /></li>
              ))}
              <li><strong>88-வது பாதத்துக்குப் பரிகாரம்:</strong> {B.remedy88.textTa} <span className="text-ink-soft">{B.remedy88.readingTa}</span><Cites list={B.remedy88.sources} /></li>
            </ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">தாரா பலம் — நூல்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">வரிசை: {B.taraRank.measureTa} இது விளக்கத்தின் அளவு மட்டுமே; எது சரி என்ற தீர்ப்பு அல்ல.</p>
            <p className="text-xs text-ink">
              ஜன்ம நட்சத்திரத்திலிருந்து (அது 1) முகூர்த்த நட்சத்திரம் வரை எண்ணி 9-ஆல் வகுத்த மீதி தாரை (0 = 9): {B.taraNamesTa.map((t: string, i: number) => `${i + 1} ${t}`).join(', ')}. 27 நட்சத்திரங்கள் மூன்று சுற்று (பர்யாயம்).
            </p>
            <p className="text-xs font-semibold text-ink mt-2">தீய தாரைகள்</p>
            <ul className="text-xs space-y-0.5">{B.taraBad.order.map((id: string) => <li key={id}><strong>{B.taraBad[id].labelTa}{id === B.taraBad.default ? ' (இயல்பு)' : ''}:</strong> {B.taraBad[id].booksTa}</li>)}</ul>
            <p className="text-xs font-semibold text-ink mt-2">சுற்று விதி</p>
            <ul className="text-xs space-y-0.5">{B.taraCycles.order.map((id: string) => <li key={id}><strong>{B.taraCycles[id].labelTa}{id === B.taraCycles.default ? ' (இயல்பு)' : ''}:</strong> {B.taraCycles[id].textTa}</li>)}</ul>
            <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-2 space-y-0.5">{B.taraNotesTa.map((t: string) => <li key={t}>{t}</li>)}</ul>
            <Cites list={B.taraRank.order.map((b: string) => B.taraSources[b]).concat([B.taraSources.KALYANRAMAN_2])} />
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-1">சந்திர பலம் — நூல்கள்</h2>
            <p className="text-[11px] text-ink-soft mb-2">வரிசை: {B.chandraRank.measureTa}</p>
            <p className="text-xs text-ink">
              சந்திரன் நிற்கும் ராசி ஜன்ம ராசியிலிருந்து (இவருக்கு {result.janma.signTa}) எத்தனையாவது. 8-ஆம் இடம் (சந்திராஷ்டமம்) எல்லா நூலிலும் தீயது;
              வில்ஹெல்ம் அதைத் தாரையைக் கொண்டு ஆறு வகையாக்குகிறார் — சோபன, அமல, சித்த தீமையற்றவை.
              இவருக்கு ஜன்ம ராசி அதிபதி {PLANET_NAME_TA[result.janma.chandrashtamaLords.natalLord]}, 8-ஆம் அதிபதி {PLANET_NAME_TA[result.janma.chandrashtamaLords.eighthLord]} —
              {result.janma.chandrashtamaLords.friends ? ' நண்பர்கள்: வில்ஹெல்மின்படி சந்திராஷ்டமம் தீமை செய்யாது.' : ' நண்பர்கள் அல்ல.'}
            </p>
            <p className="text-xs font-semibold text-ink mt-2">சந்திராஷ்டம விடுப்பு</p>
            <ul className="text-xs space-y-1">{B.chandraRelief.order.map((id: string) => (
              <li key={id}><strong>{B.chandraRelief[id].labelTa}{id === B.chandraRelief.default ? ' (இயல்பு)' : ''}:</strong> {B.chandraRelief[id].textTa} <span className="text-ink-soft">({B.chandraRelief[id].booksTa})</span></li>
            ))}</ul>
            <ul className="text-xs space-y-1 mt-2">{B.chandraReadings.order.map((id: string) => (
              <li key={id}><strong>{B.chandraReadings[id].labelTa}{id === B.chandraReadings.default ? ' (இயல்பு)' : ''}:</strong> {B.chandraReadings[id].textTa} <span className="text-ink-soft">({B.chandraReadings[id].booksTa})</span></li>
            ))}</ul>
            <ul className="text-[11px] text-ink-soft list-disc ml-5 mt-2 space-y-0.5">{B.chandraNotesTa.map((t: string) => <li key={t}>{t}</li>)}</ul>
            <Cites list={B.chandraRank.order.map((b: string) => B.chandraSources[b])} />
          </section>
        </>
      )}
    </main>
  );
}
