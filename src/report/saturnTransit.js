/**
 * Saturn over the natal Moon — Sade Sati, Dhaiya (Ardhashtama / Ashtama) and
 * Kantaka Saturn.
 *
 * PL9 has a whole "Remedies" group for this (Sadhesati Calculations / Remedies
 * / Results, Dhayya Results, Kantaka Saturn Results). It is the first thing a
 * Tamil client asks about ("ஏழரைச் சனி நடக்கிறதா?"), and until now the software
 * could not answer.
 *
 * ## Astronomy and doctrine, kept apart
 *
 * **Astronomy** — *where Saturn is, and when it crosses into a sign* — has one
 * answer and is computed here from the ephemeris by bisection. Nothing to
 * source; `test-saturn-transit.js` checks it independently by asking the
 * ephemeris for Saturn's longitude at each boundary it reports.
 *
 * **Doctrine** — *which houses from the Moon are called what* — is a table read
 * from printed pages (`saturnTransitTables.js`), and it is not unanimous: the
 * books agree on Sade Sati (12th, 1st, 2nd), Ardhashtama (4th) and Ashtama
 * (8th), and disagree about Kantaka. So Kantaka is a *selectable, labelled
 * convention* and the result says which one it used.
 *
 * ## Conventions this file chooses, and says so
 *
 *  - **Sign-based.** Saturn's house is counted from the natal Moon's *sign*, as
 *    every source we hold does except one author's own degree-based variant
 *    (recorded in `NOT_IMPLEMENTED`, not applied).
 *  - **Retrograde returns are real.** Saturn crosses a sign boundary and can
 *    come back across it while retrograde. Every stay is reported as it
 *    happened, and a "span" runs from the first entry to the last exit of
 *    that run of stays.
 *  - **Two stays belong to one span if less than two years separate them.**
 *    Retrograde dips last months; the gap between one Sade Sati and the next is
 *    about twenty-two years, so any threshold between the two separates them.
 *  - **The stated timings (90 / 30 months) are nominal.** The sky gives the
 *    real ones, and they are what is reported; the book's figure is shown
 *    beside them.
 */

const { planetLongitude } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { createRuleEvidence, withheldEvidence } = require('../contracts/ruleEvidence');
const T = require('./saturnTransitTables');
const TM = require('./saturnTransitTamil');
const HR = require('./saturnHouseResults');

const DAY_MS = 86400000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const SPAN_GAP_MS = 2 * YEAR_MS;

const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const PHASE_ORDER = ['RISING', 'PEAK', 'SETTING'];

const norm360 = (d) => ((d % 360) + 360) % 360;
const toJd = (ms) => ms / DAY_MS + JD_UNIX_EPOCH;
const iso = (ms) => new Date(ms).toISOString();

/** Saturn's sidereal longitude at a UTC instant. */
function saturnLongitude(utcMs, ayanamsha = 'Lahiri') {
  return norm360(planetLongitude(toJd(utcMs), 'Saturn', ayanamsha));
}
const saturnRasi = (utcMs, ayanamsha) => Math.floor(saturnLongitude(utcMs, ayanamsha) / 30);
const NAKSHATRA_DEGREES = 360 / 27;
const saturnNakshatra = (utcMs, ayanamsha) => Math.floor(saturnLongitude(utcMs, ayanamsha) / NAKSHATRA_DEGREES) % 27;

/** 1 = the Moon's own sign, 2 = the next, … 12 = the sign before it. */
const houseFromMoon = (rasi, moonRasi) => ((rasi - moonRasi + 12) % 12) + 1;

/**
 * Where Saturn crosses from sign `a` to sign `b` between two instants.
 * Bisection on "is Saturn still in sign `a`", to about a second.
 */
function findBoundary(loMs, hiMs, indexAtLo, ayanamsha, divisionDegrees = 30) {
  let lo = loMs;
  let hi = hiMs;
  for (let i = 0; i < 40 && hi - lo > 500; i += 1) {
    const mid = (lo + hi) / 2;
    if (divisionAt(mid, ayanamsha, divisionDegrees) === indexAtLo) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Which division of the zodiac (sign: 30°, nakshatra: 13°20′) Saturn is in. */
function divisionAt(utcMs, ayanamsha, divisionDegrees) {
  const n = Math.round(360 / divisionDegrees);
  return Math.floor(saturnLongitude(utcMs, ayanamsha) / divisionDegrees) % n;
}

/**
 * Every stay of Saturn in a sign across a window, in order.
 *
 * Sampled at `stepDays` (half a day) and refined by bisection wherever the sign
 * changes. A crossing and an immediate re-crossing inside one step would be
 * missed; that needs a station within a fraction of a degree of a boundary and
 * an excursion shorter than the step, and the test compares two step sizes
 * across sixty years to show no stay is lost at this one.
 *
 * `enteredBy` says how each stay began: `DIRECT` (forward ingress from the
 * previous sign), `RETROGRADE` (Saturn came back from the next sign), or
 * `WINDOW_START` (the window opened with Saturn already there).
 */
function scanStays({ fromMs, toMs, ayanamsha = 'Lahiri', stepDays = 0.5, divisionDegrees = 30 }) {
  if (!(Number.isFinite(fromMs) && Number.isFinite(toMs) && toMs > fromMs)) {
    throw new UnsupportedInputError('fromMs and toMs must be numbers with toMs after fromMs', 'window');
  }
  if ((toMs - fromMs) / YEAR_MS > 130) {
    throw new UnsupportedInputError('the window may be at most 130 years', 'window');
  }
  const step = stepDays * DAY_MS;
  const n = Math.round(360 / divisionDegrees);
  const stays = [];
  let prevMs = fromMs;
  let prevIdx = divisionAt(fromMs, ayanamsha, divisionDegrees);
  let current = { index: prevIdx, enterMs: fromMs, enteredBy: 'WINDOW_START' };

  for (let t = fromMs + step; ; t += step) {
    const ms = Math.min(t, toMs);
    const idx = divisionAt(ms, ayanamsha, divisionDegrees);
    if (idx !== prevIdx) {
      const at = findBoundary(prevMs, ms, prevIdx, ayanamsha, divisionDegrees);
      current.exitMs = at;
      stays.push(current);
      const forward = ((idx - prevIdx + n) % n) === 1;
      current = { index: idx, enterMs: at, enteredBy: forward ? 'DIRECT' : 'RETROGRADE' };
      prevIdx = idx;
    }
    prevMs = ms;
    if (ms >= toMs) break;
  }
  current.exitMs = toMs;
  current.openEnd = true;
  stays.push(current);
  stays[0].openStart = stays[0].enteredBy === 'WINDOW_START';
  return stays;
}

/** Stays in signs. Each carries `rasiIndex`. */
function saturnStays(opts) {
  return scanStays({ ...opts, divisionDegrees: 30 }).map(({ index, ...rest }) => ({ rasiIndex: index, ...rest }));
}

/** Stays in nakshatras. Each carries `nakshatraIndex` (0 = Ashwini). */
function saturnNakshatraStays(opts) {
  return scanStays({ ...opts, divisionDegrees: NAKSHATRA_DEGREES }).map(({ index, ...rest }) => ({ nakshatraIndex: index, ...rest }));
}

/** Groups stays whose house is in `houses` into spans, breaking at gaps over two years. */
function groupSpans(stays, moonRasi, houses) {
  const wanted = new Set(houses);
  const spans = [];
  let cur = null;
  for (const s of stays) {
    const house = houseFromMoon(s.rasiIndex, moonRasi);
    if (!wanted.has(house)) continue;
    const entry = {
      house, rasiIndex: s.rasiIndex, enterMs: s.enterMs, exitMs: s.exitMs, enteredBy: s.enteredBy,
      openStart: Boolean(s.openStart), openEnd: Boolean(s.openEnd),
    };
    if (cur && s.enterMs - cur.endMs <= SPAN_GAP_MS) {
      cur.stays.push(entry);
      cur.endMs = s.exitMs;
      cur.openEnd = entry.openEnd;
    } else {
      cur = { startMs: s.enterMs, endMs: s.exitMs, openStart: entry.openStart, openEnd: entry.openEnd, stays: [entry] };
      spans.push(cur);
    }
  }
  return spans;
}

const daysBetween = (a, b) => (b - a) / DAY_MS;

function describeStay(st) {
  return {
    house: st.house,
    rasiIndex: st.rasiIndex,
    rasi: RASI_TA[st.rasiIndex],
    fromUtc: iso(st.enterMs),
    toUtc: iso(st.exitMs),
    days: Math.round(daysBetween(st.enterMs, st.exitMs) * 10) / 10,
    enteredBy: st.enteredBy,
    openStart: st.openStart,
    openEnd: st.openEnd,
  };
}

/** Totals of a span's stays by house, in days. */
function daysByHouse(span) {
  const out = {};
  for (const st of span.stays) out[st.house] = (out[st.house] ?? 0) + daysBetween(st.enterMs, st.exitMs);
  return out;
}

function describeSpan(span) {
  const byHouse = daysByHouse(span);
  const stays = span.stays.map(describeStay);
  // Every stay after the first in a given house, or a house entered by
  // retrograde motion, is Saturn coming back across a boundary.
  const retrogradeReturns = span.stays.filter((s) => s.enteredBy === 'RETROGRADE').length;
  // A span runs from the first entry to the last exit, so it also holds the
  // days Saturn stepped back out of the qualifying houses while retrograde.
  // They are not in any phase, and are reported rather than hidden.
  const inHouseDays = Object.values(byHouse).reduce((a, b) => a + b, 0);
  return {
    fromUtc: iso(span.startMs),
    toUtc: iso(span.endMs),
    years: Math.round((daysBetween(span.startMs, span.endMs) / 365.25) * 100) / 100,
    openStart: span.openStart,
    openEnd: span.openEnd,
    retrogradeReturns,
    daysOutsideHouses: Math.round((daysBetween(span.startMs, span.endMs) - inHouseDays) * 10) / 10,
    daysByHouse: Object.fromEntries(Object.entries(byHouse).map(([h, d]) => [h, Math.round(d * 10) / 10])),
    stays,
  };
}

function conventionFor(id) {
  const c = T.KANTAKA_CONVENTIONS[id ?? T.DEFAULT_KANTAKA];
  if (!c) {
    throw new UnsupportedInputError(
      `unknown Kantaka convention ${id}; expected one of ${Object.keys(T.KANTAKA_CONVENTIONS).join(', ')}`,
      'kantakaConvention',
    );
  }
  return c;
}

function assertMoonRasi(moonRasiIndex) {
  if (!Number.isInteger(moonRasiIndex) || moonRasiIndex < 0 || moonRasiIndex > 11) {
    throw new UnsupportedInputError('moonRasiIndex must be an integer 0-11', 'moonRasiIndex');
  }
}

/**
 * The state at one instant: which named conditions are active, and in which
 * Sade Sati phase. A house can carry several names at once — the 4th is both
 * Ardhashtama and, in every convention but Rath's, Kantaka.
 */
function saturnStateAt({ moonRasiIndex, atMs, ayanamsha = 'Lahiri', kantakaConvention }) {
  assertMoonRasi(moonRasiIndex);
  const conv = conventionFor(kantakaConvention);
  const rasi = saturnRasi(atMs, ayanamsha);
  const house = houseFromMoon(rasi, moonRasiIndex);
  const conditions = [];
  const phase = T.SADE_SATI_PHASES[house];
  if (phase) conditions.push({ id: 'SADE_SATI', phase: phase.phase, order: phase.order });
  if (T.DEFINITIONS.ARDHASHTAMA.houses.includes(house)) conditions.push({ id: 'ARDHASHTAMA' });
  if (T.DEFINITIONS.ASHTAMA.houses.includes(house)) conditions.push({ id: 'ASHTAMA' });
  if (conv.houses.includes(house)) conditions.push({ id: 'KANTAKA', convention: conv.id });
  return {
    atUtc: iso(atMs),
    saturnRasiIndex: rasi,
    saturnRasi: RASI_TA[rasi],
    saturnLongitude: saturnLongitude(atMs, ayanamsha),
    houseFromMoon: house,
    conditions,
  };
}

/** The Anga Sani band for a nakshatra count (1-27), in the printed order. */
function angaBandFor(count) {
  if (!Number.isInteger(count) || count < 1 || count > 27) {
    throw new UnsupportedInputError(`nakshatra count ${count} is outside 1-27`, 'count');
  }
  let upTo = 0;
  for (let i = 0; i < TM.ANGA_SANI.bands.length; i += 1) {
    upTo += TM.ANGA_SANI.bands[i].portions;
    if (count <= upTo) return { index: i, ...TM.ANGA_SANI.bands[i], from: upTo - TM.ANGA_SANI.bands[i].portions + 1, to: upTo };
  }
  throw new UnsupportedInputError(`nakshatra count ${count} is outside 1-27`, 'count');
}

/** Saturn's nakshatra counted from the birth star, birth star = 1. */
const nakshatraCount = (saturnNak, moonNak) => ((saturnNak - moonNak + 27) % 27) + 1;

/**
 * Anga Sani periods (Sūḍāmaṇi verse 344) over a window, from the nakshatra
 * stays. Adjacent stays in the same band are merged; a retrograde step back
 * across a band boundary shows up as its own short period, as it happened.
 */
function angaSaniPeriods({ moonNakshatraIndex, fromMs, toMs, ayanamsha = 'Lahiri' }) {
  const stays = saturnNakshatraStays({ fromMs, toMs, ayanamsha });
  const out = [];
  for (const s of stays) {
    const count = nakshatraCount(s.nakshatraIndex, moonNakshatraIndex);
    const band = angaBandFor(count);
    const last = out[out.length - 1];
    if (last && last.bandIndex === band.index) {
      last.exitMs = s.exitMs;
      last.countTo = count;
    } else {
      out.push({ bandIndex: band.index, enterMs: s.enterMs, exitMs: s.exitMs, countFrom: count, countTo: count });
    }
  }
  return out.map((p) => {
    const b = TM.ANGA_SANI.bands[p.bandIndex];
    return {
      part: b.part, result: b.result, tone: b.tone,
      fromUtc: iso(p.enterMs), toUtc: iso(p.exitMs),
      years: Math.round(((p.exitMs - p.enterMs) / YEAR_MS) * 100) / 100,
    };
  });
}

/**
 * The Tamil text's reading of Saturn's present transit, beside the English
 * texts' — the same facts, so the two can be compared on one screen.
 */
function tamilSaturnReading({ moonRasiIndex, moonNakshatraIndex, atMs, ayanamsha = 'Lahiri' }) {
  assertMoonRasi(moonRasiIndex);
  if (!Number.isInteger(moonNakshatraIndex) || moonNakshatraIndex < 0 || moonNakshatraIndex > 26) {
    throw new UnsupportedInputError('moonNakshatraIndex must be an integer 0-26', 'moonNakshatraIndex');
  }
  const house = houseFromMoon(saturnRasi(atMs, ayanamsha), moonRasiIndex);
  const G = TM.SATURN_GOOD_HOUSES;
  const satNak = saturnNakshatra(atMs, ayanamsha);
  const count = nakshatraCount(satNak, moonNakshatraIndex);
  const band = angaBandFor(count);

  return {
    houseFromMoon: house,
    goodHouses: {
      houses: G.houses,
      goodNow: G.houses.includes(house),
      vedhaHouse: G.houses.includes(house) ? G.vedha[house] : null,
      vedhaByHouse: G.vedha,
      tamil: {
        houses: G.tamil.houses, commentaryAlsoLists: G.tamil.commentaryAlsoLists, note: G.tamil.note,
        goodNow: G.tamil.houses.includes(house),
        commentaryWouldCallItGood: G.tamil.commentaryAlsoLists.includes(house),
        sourcePage: G.tamil.source.pageLocus, sourceTitle: G.tamil.source.title,
      },
      english: G.english.map((e) => ({
        houses: e.houses, note: e.note, goodNow: e.houses.includes(house),
        sourceTitle: e.source.title, sourcePage: e.source.pageLocus,
      })),
    },
    anga: {
      status: TM.ANGA_SANI.status,
      total: TM.ANGA_SANI.total,
      saturnNakshatraIndex: satNak,
      count,
      band: { part: band.part, result: band.result, tone: band.tone, from: band.from, to: band.to },
      bands: TM.ANGA_SANI.bands.map((b) => ({ part: b.part, portions: b.portions, result: b.result, tone: b.tone })),
      periods: angaSaniPeriods({
        moonNakshatraIndex, fromMs: atMs - YEAR_MS, toMs: atMs + 30 * YEAR_MS, ayanamsha,
      }),
      rule: TM.ANGA_SANI.rule,
      assumptions: TM.ANGA_SANI.assumptions,
      sourcePage: TM.ANGA_SANI.source.pageLocus,
      sourceTitle: TM.ANGA_SANI.source.title,
    },
    absences: TM.TAMIL_ABSENCES,
  };
}

/**
 * Sade Sati, Ardhashtama, Ashtama and Kantaka Saturn for a native, over a
 * window measured from birth.
 *
 * @param moonRasiIndex  0-11, the natal Moon's sidereal sign
 * @param birthMs        UTC ms of birth — Sade Sati is numbered from here
 * @param horizonYears   how far past birth to look (default 100)
 * @param atMs           "now", for the current state (default the present)
 */
function computeSaturnTransits({
  moonRasiIndex, moonNakshatraIndex = null, birthMs, horizonYears = 100, atMs = Date.now(),
  ayanamsha = 'Lahiri', kantakaConvention,
}) {
  assertMoonRasi(moonRasiIndex);
  if (!Number.isFinite(birthMs)) throw new UnsupportedInputError('birthMs must be a number', 'birthMs');
  if (!(horizonYears >= 1 && horizonYears <= 110)) {
    throw new UnsupportedInputError('horizonYears must be 1-110', 'horizonYears');
  }
  const conv = conventionFor(kantakaConvention);

  // Ten years before birth so a Sade Sati already under way at birth is caught
  // whole: one lasts under eight and a half.
  const fromMs = birthMs - 10 * YEAR_MS;
  const toMs = birthMs + horizonYears * YEAR_MS;
  const stays = saturnStays({ fromMs, toMs, ayanamsha });

  const sade = groupSpans(stays, moonRasiIndex, [12, 1, 2]);
  // A cycle that ended before birth is not the native's; numbering starts at
  // the first one still running at birth or beginning after it.
  const lived = sade.filter((s) => s.endMs > birthMs);
  const arishta = T.ARISHTA_BY_MOON_SIGN[moonRasiIndex];

  const cycles = lived.map((span, i) => {
    const ordinal = i + 1;
    const d = describeSpan(span);
    const phaseDays = Object.fromEntries(PHASE_ORDER.map((p) => {
      const house = Number(Object.keys(T.SADE_SATI_PHASES).find((h) => T.SADE_SATI_PHASES[h].phase === p));
      return [p, d.daysByHouse[house] ?? 0];
    }));
    return {
      ordinal,
      inProgressAtBirth: span.startMs < birthMs,
      ...d,
      phaseDays,
      arishtaPhases: arishta.phases,
      arishtaEspecially: arishta.especially,
      arishtaReadingUncertain: arishta.readingUncertain,
      book: T.SADE_SATI_CYCLES[ordinal] ?? null,
    };
  });

  const single = (houses) => groupSpans(stays, moonRasiIndex, houses)
    .filter((s) => s.endMs > birthMs).map(describeSpan);

  const saturnAtBirth = saturnStateAt({ moonRasiIndex, atMs: birthMs, ayanamsha, kantakaConvention: conv.id });
  const now = saturnStateAt({ moonRasiIndex, atMs, ayanamsha, kantakaConvention: conv.id });

  // Which cycle "now" falls in, if any.
  const active = cycles.find((c) => Date.parse(c.fromUtc) <= atMs && atMs < Date.parse(c.toUtc)) ?? null;
  const next = cycles.find((c) => Date.parse(c.fromUtc) > atMs) ?? null;

  const tamil = moonNakshatraIndex === null || moonNakshatraIndex === undefined
    ? null
    : tamilSaturnReading({ moonRasiIndex, moonNakshatraIndex, atMs, ayanamsha });
  const evidence = buildEvidence({ moonRasiIndex, conv, now, tamil });

  // Every convention at once, so the disagreement between the books is on the
  // page as data and not only as a choice in a menu.
  const kantakaAll = Object.values(T.KANTAKA_CONVENTIONS).map((c) => ({
    id: c.id, label: c.label, labelTa: c.labelTa, houses: c.houses, note: c.note,
    sourceTitle: c.source.title, sourcePage: c.source.pageLocus,
    activeNow: c.houses.includes(now.houseFromMoon),
    periods: single(c.houses),
  }));

  return {
    moonRasiIndex,
    moonRasi: RASI_TA[moonRasiIndex],
    ayanamsha,
    window: { fromUtc: iso(birthMs), toUtc: iso(toMs) },
    saturnAtBirth,
    now,
    activeSadeSati: active && { ordinal: active.ordinal, fromUtc: active.fromUtc, toUtc: active.toUtc },
    nextSadeSati: next && { ordinal: next.ordinal, fromUtc: next.fromUtc, toUtc: next.toUtc },
    sadeSati: cycles,
    ardhashtama: single(T.DEFINITIONS.ARDHASHTAMA.houses),
    ashtama: single(T.DEFINITIONS.ASHTAMA.houses),
    kantaka: { convention: conv.id, houses: conv.houses, periods: single(conv.houses) },
    kantakaAll,
    // What the book says for the 4th, 7th and 8th, each lived period with its round.
    houseResults: {
      houses: [4, 7, 8].map((h) => HR.houseResultsFor(h, single([h]))),
      // Sundarananda's two readings follow the fortnight running at the time (p.86).
      paksha: HR.pakshaAt(atMs),
      saturnHouseNow: now.houseFromMoon,
      sourceTitle: HR.HOUSE_RESULTS_SOURCE.title,
      sourcePage: HR.HOUSE_RESULTS_SOURCE.pageLocus,
      notes: HR.NOTES,
    },
    tamil,
    conventions: {
      kantakaUsed: conv.id,
      kantakaDefault: T.DEFAULT_KANTAKA,
      kantakaRank: T.KANTAKA_RANK,
      kantakaAvailable: Object.values(T.KANTAKA_CONVENTIONS).map((c) => ({
        id: c.id, label: c.label, labelTa: c.labelTa, houses: c.houses,
        note: c.note, sourcePage: c.source.pageLocus, sourceTitle: c.source.title,
      })),
      spanGapYears: SPAN_GAP_MS / YEAR_MS,
      signBased: true,
      notImplemented: T.NOT_IMPLEMENTED.map((n) => ({ id: n.id, reasonTa: n.reasonTa, sourcePage: n.source.pageLocus })),
    },
    nominal: {
      cycleMonths: T.NOMINAL_DURATION.cycleMonths,
      dhaiyaMonths: T.NOMINAL_DURATION.dhaiyaMonths,
      sourcePage: T.NOMINAL_DURATION.source.pageLocus,
    },
    phases: PHASE_ORDER.map((p) => {
      const house = Number(Object.keys(T.SADE_SATI_PHASES).find((h) => T.SADE_SATI_PHASES[h].phase === p));
      const ph = T.SADE_SATI_PHASES[house];
      return {
        phase: p, house, nameTa: ph.nameTa, bodyPart: ph.bodyPart, resultTa: ph.resultTa,
        sourcePage: ph.source.pageLocus,
      };
    }),
    remedies: T.REMEDIES.map((r) => ({
      id: r.id, appliesTo: r.appliesTo, textTa: r.textTa,
      sourceTitle: r.source.title, sourcePage: r.source.pageLocus,
    })),
    definitions: Object.fromEntries(Object.entries(T.DEFINITIONS).map(([id, d]) => [id, {
      nameTa: d.nameTa, name: d.name, houses: d.houses,
      sources: d.sources.map((s) => ({ title: s.title, pageLocus: s.pageLocus })),
    }])),
    evidence,
  };
}

/**
 * RuleEvidence for what the result states *now*: the named condition and the
 * page that names it. Each is `APPLIED` only for a definition actually used to
 * classify the present position, so the record carries exactly the citations
 * behind what the client was told.
 */
function buildEvidence({ moonRasiIndex, conv, now, tamil }) {
  const out = [];
  const appliedTo = { moonRasiIndex, houseFromMoon: now.houseFromMoon, saturnRasiIndex: now.saturnRasiIndex };
  const cite = (id, name, source, convention, notes) => createRuleEvidence({
    ruleId: `SATURN_TRANSIT_${id}`,
    name,
    outcome: { active: now.conditions.some((c) => c.id === id), houseFromMoon: now.houseFromMoon },
    source: { ...source, convention },
    appliedTo,
    notes,
  });
  const first = (id) => T.DEFINITIONS[id].sources[0];
  out.push(cite('SADE_SATI', 'Sade Sati — Saturn in the 12th, 1st or 2nd from the Moon', first('SADE_SATI'),
    'Sign-based: Saturn\'s sign counted from the natal Moon sign; houses 12, 1 and 2.',
    'Pulippani and Shubhakaran give the same houses.'));
  out.push(cite('ARDHASHTAMA', 'Ardhashtama Saturn — 4th from the Moon', first('ARDHASHTAMA'),
    'Sign-based; house 4.', 'Pulippani gives the same house.'));
  out.push(cite('ASHTAMA', 'Ashtama Saturn — 8th from the Moon', first('ASHTAMA'),
    'Sign-based; house 8.', 'Pulippani and Shubhakaran give the same house.'));
  out.push(cite('KANTAKA', `Kantaka Saturn — ${conv.label}`, conv.source,
    `Sign-based; houses ${conv.houses.join(', ')} (the books disagree; this is the ${conv.id} convention).`,
    conv.note));
  if (tamil) {
    out.push(createRuleEvidence({
      ruleId: 'SATURN_TRANSIT_TAMIL_GOOD_HOUSES',
      name: 'Saturn favourable in the 3rd, 6th and 11th from the Moon (Tamil text)',
      outcome: { good: tamil.goodHouses.tamil.goodNow, houseFromMoon: tamil.houseFromMoon },
      source: { ...TM.SATURN_GOOD_HOUSES.tamil.source, convention: 'Verse 341 read as 3, 6, 11 (பத்தொன்று = 11); the printed commentary also lists the 10th and is not followed.' },
      appliedTo: { moonRasiIndex, houseFromMoon: tamil.houseFromMoon },
      notes: 'Pulippani and Vishnu Bhaskar give the same three houses.',
    }));
    // Computed and shown, but the order of the body portions is not stated in
    // the text, so the rule cannot honestly be called applied: the same
    // posture as an unsourced porutham factor.
    out.push(withheldEvidence({
      ruleId: 'SATURN_TRANSIT_ANGA_SANI',
      name: 'Anga Sani — Saturn on the body (Tamil text)',
      reason: 'The text does not say in what order the 27 portions are counted; the printed order is applied and labelled ORDER_ASSUMED.',
      appliedTo: { moonRasiIndex, count: tamil.anga.count, part: tamil.anga.band.part },
    }));
  }
  return out;
}

module.exports = {
  saturnLongitude, saturnRasi, houseFromMoon, saturnStays, groupSpans,
  saturnStateAt, computeSaturnTransits, conventionFor,
  saturnNakshatra, saturnNakshatraStays, angaBandFor, angaSaniPeriods, tamilSaturnReading, nakshatraCount,
  RASI_TA, PHASE_ORDER, DAY_MS, YEAR_MS, SPAN_GAP_MS,
  ...{ KANTAKA_CONVENTIONS: T.KANTAKA_CONVENTIONS, DEFAULT_KANTAKA: T.DEFAULT_KANTAKA },
};
