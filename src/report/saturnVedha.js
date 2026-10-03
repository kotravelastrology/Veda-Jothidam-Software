/**
 * Saturn's gochara vedha and vipareetha vedha, as dated windows.
 *
 * For every stay of Saturn in a sign over a window, counted from the natal Moon:
 *
 *   3rd, 6th, 11th   Saturn's good houses. Any planet in the 12th, 9th or 5th
 *                    respectively obstructs the good (gochara vedha) — except
 *                    the Sun, which both Pulippani and Vishnu Bhaskar exclude.
 *   12th, 9th, 5th   Saturn's relievable bad houses. Any planet in the 3rd, 6th
 *                    or 11th respectively cancels the bad (vipareetha vedha).
 *                    The Sun is excluded here too. Pulippani's vipareetha list
 *                    names only "no vipareetha vedha to the Sun by Saturn"; but
 *                    Jataka Parijata (printed p.834) states the rule generally —
 *                    "the Sun and Saturn do not affect each other through
 *                    Vedha" — as do Vishnu Bhaskar and Pulippani's own gochara
 *                    table. The Sun's windows are still listed, marked excluded.
 *   12th, 1st, 2nd   Sade Sati. Pulippani: if Jupiter is not in the 3rd, the
 *                    short spells when the Sun, Moon, Mercury, Venus or Mars pass
 *                    through Saturn's own sign bring "more ordeal".
 *   other bad houses (1st, 2nd, 4th, 7th, 8th, 10th) have no vipareetha house in
 *                    the book: "evil effects of this will be felt".
 *
 * "Any other planet" is taken at its word, so Rahu and Ketu count (mean node,
 * the project default; Ketu is Rahu + 180°). The Moon passes a sign in about
 * two and a quarter days every month, so its windows are counted, not listed.
 *
 * Each planet's sign stays are found by stepping (one day for the fast planets,
 * two for Jupiter and the nodes) and bisecting each change to within an hour.
 * Saturn's stays come from saturnTransit.js, the same scan the rest of the page
 * uses.
 */

const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { saturnStays, houseFromMoon, RASI_TA } = require('./saturnTransit');
const V = require('./gocharaVedhaTables');

const DAY_MS = 86400000;
const HOUR_MS = 3600000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const OTHERS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Rahu', 'Ketu'];
const FAST = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
const STEP_DAYS = { Sun: 1, Moon: 1, Mars: 1, Mercury: 1, Venus: 1, Jupiter: 2, Rahu: 2, Ketu: 2 };
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const iso = (ms) => new Date(ms).toISOString();
const days = (a, b) => Math.round(((b - a) / DAY_MS) * 10) / 10;

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  const jd = ms / DAY_MS + JD_UNIX_EPOCH;
  if (planet === 'Rahu') return nodeLongitude(jd, ayanamsha, nodeType);
  if (planet === 'Ketu') return (nodeLongitude(jd, ayanamsha, nodeType) + 180) % 360;
  return planetLongitude(jd, planet, ayanamsha);
}
const signOf = (planet, ms, ayanamsha, nodeType) => Math.floor(longitudeOf(planet, ms, ayanamsha, nodeType) / 30) % 12;

/** Every stay of one planet in a sign over [fromMs, toMs). */
function signStays(planet, fromMs, toMs, ayanamsha = 'Lahiri', nodeType = 'mean') {
  const step = STEP_DAYS[planet] * DAY_MS;
  const out = [];
  let prevMs = fromMs;
  let prev = signOf(planet, fromMs, ayanamsha, nodeType);
  let cur = { sign: prev, fromMs };
  for (let t = fromMs + step; ; t += step) {
    const ms = Math.min(t, toMs);
    const s = signOf(planet, ms, ayanamsha, nodeType);
    if (s !== prev) {
      let lo = prevMs; let hi = ms;
      while (hi - lo > HOUR_MS) {
        const mid = (lo + hi) / 2;
        if (signOf(planet, mid, ayanamsha, nodeType) === prev) lo = mid; else hi = mid;
      }
      cur.toMs = hi;
      out.push(cur);
      cur = { sign: s, fromMs: hi };
      prev = s;
    }
    prevMs = ms;
    if (ms >= toMs) break;
  }
  cur.toMs = toMs;
  out.push(cur);
  return out;
}

/** The parts of `stays` in `sign` that overlap [fromMs, toMs). */
function overlaps(stays, sign, fromMs, toMs) {
  const out = [];
  for (const s of stays) {
    if (s.sign !== sign) continue;
    const a = Math.max(s.fromMs, fromMs);
    const b = Math.min(s.toMs, toMs);
    if (b > a) out.push([a, b]);
  }
  return out;
}

/** `intervals` with every part covered by `cut` removed. */
function subtract(intervals, cut) {
  let out = intervals;
  for (const [ca, cb] of cut) {
    const next = [];
    for (const [a, b] of out) {
      if (cb <= a || ca >= b) { next.push([a, b]); continue; }
      if (ca > a) next.push([a, ca]);
      if (cb < b) next.push([cb, b]);
    }
    out = next;
  }
  return out;
}

/** Total days covered by a set of intervals, overlaps counted once. */
function unionDays(intervals) {
  const sorted = [...intervals].sort((x, y) => x[0] - y[0]);
  let total = 0; let end = -Infinity;
  for (const [a, b] of sorted) {
    if (b <= end) continue;
    total += b - Math.max(a, end);
    end = b;
  }
  return Math.round((total / DAY_MS) * 10) / 10;
}

const describe = (ivs) => ivs.map(([a, b]) => ({ fromUtc: iso(a), toUtc: iso(b), days: days(a, b) }));

/**
 * @param moonRasiIndex natal Moon sign 0-11
 * @param fromMs, toMs  the window (at most 40 years)
 * @param atMs          "now", for the present state
 */
function saturnVedhaWindows({ moonRasiIndex, fromMs, toMs, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean' }) {
  if (!Number.isInteger(moonRasiIndex) || moonRasiIndex < 0 || moonRasiIndex > 11) {
    throw new UnsupportedInputError('moonRasiIndex must be an integer 0-11', 'moonRasiIndex');
  }
  if (!(Number.isFinite(fromMs) && Number.isFinite(toMs) && toMs > fromMs) || (toMs - fromMs) > 40 * YEAR_MS) {
    throw new UnsupportedInputError('the window must be a forward span of at most 40 years', 'window');
  }
  const signOfHouse = (h) => (moonRasiIndex + h - 1) % 12;
  const sat = saturnStays({ fromMs, toMs, ayanamsha });
  const others = Object.fromEntries(OTHERS.map((p) => [p, signStays(p, fromMs, toMs, ayanamsha, nodeType)]));

  const stays = sat.map((s) => {
    const house = houseFromMoon(s.rasiIndex, moonRasiIndex);
    const a = s.enterMs; const b = s.exitMs;
    const base = {
      house, rasi: RASI_TA[s.rasiIndex], fromUtc: iso(a), toUtc: iso(b), days: days(a, b),
      enteredBy: s.enteredBy, clippedStart: Boolean(s.openStart), clippedEnd: Boolean(s.openEnd),
    };
    let kind; let paired = null;
    if (V.SATURN_VEDHA[house]) { kind = 'GOOD'; paired = V.SATURN_VEDHA[house]; } else if (V.SATURN_VIPAREETA[house]) { kind = 'RELIEVABLE'; paired = V.SATURN_VIPAREETA[house]; } else if ([1, 2, 4, 7, 8, 10].includes(house)) kind = 'NO_RELIEF';
    const out = { ...base, kind, pairedHouse: paired, byPlanet: [], moon: null, sun: null, coveredDays: 0, ordeal: null };

    if (paired) {
      const target = signOfHouse(paired);
      const certain = [];
      for (const p of OTHERS) {
        const iv = overlaps(others[p], target, a, b);
        if (p === 'Moon') { out.moon = { count: iv.length, days: unionDays(iv) }; continue; }
        if (p === 'Sun') {
          // Gochara vedha: the Sun is excluded by both books. Vipareetha: unsettled.
          // Excluded both ways: Jataka Parijata p.834, Vishnu Bhaskar p.139, Pulippani's gochara table.
          out.sun = { windows: describe(iv), status: 'EXCLUDED' };
          continue;
        }
        if (iv.length) out.byPlanet.push({ planet: p, planetTa: PLANET_TA[p], windows: describe(iv), days: unionDays(iv) });
        certain.push(...iv);
      }
      out.coveredDays = unionDays(certain);
    }

    if ([12, 1, 2].includes(house)) {
      // Pulippani: during Sade Sati, with Jupiter not in the 3rd, fast planets in Saturn's own sign.
      const jupiter3 = overlaps(others.Jupiter, signOfHouse(3), a, b);
      const fast = FAST.map((p) => {
        const iv = subtract(overlaps(others[p], s.rasiIndex, a, b), jupiter3);
        return p === 'Moon'
          ? { planet: p, planetTa: PLANET_TA[p], count: iv.length, days: unionDays(iv) }
          : { planet: p, planetTa: PLANET_TA[p], windows: describe(iv), days: unionDays(iv) };
      });
      out.ordeal = { jupiterInThird: describe(jupiter3), fast };
    }
    return out;
  });

  // The present.
  let now = null;
  if (atMs >= fromMs && atMs < toMs) {
    const house = houseFromMoon(Math.floor(longitudeOf('Saturn', atMs, ayanamsha, nodeType) / 30) % 12, moonRasiIndex);
    const kind = V.SATURN_VEDHA[house] ? 'GOOD' : V.SATURN_VIPAREETA[house] ? 'RELIEVABLE' : [1, 2, 4, 7, 8, 10].includes(house) ? 'NO_RELIEF' : null;
    const pairedNow = V.SATURN_VEDHA[house] ?? V.SATURN_VIPAREETA[house] ?? null;
    const inPaired = pairedNow
      ? OTHERS.filter((p) => signOf(p, atMs, ayanamsha, nodeType) === signOfHouse(pairedNow))
      : [];
    // The same rules as the windows: the Sun causes Saturn no gochara vedha, and
    // its vipareetha is unsettled; everything else counts.
    const statusOf = (p) => (p !== 'Sun' ? 'COUNTS' : 'EXCLUDED');
    const planetsInPaired = inPaired.map((p) => ({ planet: p, planetTa: PLANET_TA[p], status: statusOf(p) }));
    now = {
      atUtc: iso(atMs), house, kind, pairedHouse: pairedNow, planetsInPaired,
      active: planetsInPaired.some((p) => p.status === 'COUNTS'),
    };
  }

  const T = V.SATURN_VEDHA_TEXT;
  const pack = (x) => ({ textTa: x.textTa, title: x.source.title, page: x.source.pageLocus });
  return {
    window: { fromUtc: iso(fromMs), toUtc: iso(toMs) },
    nodeType,
    pairs: { vedha: V.SATURN_VEDHA, vipareeta: V.SATURN_VIPAREETA },
    stays, now,
    texts: {
      pulippaniVedha: pack(T.pulippaniVedha),
      pulippaniVipareeta: pack(T.pulippaniVipareeta),
      pulippaniOrdeal: pack(T.pulippaniOrdeal),
      jatakaParijata: pack(T.jatakaParijata),
      vishnuBhaskar: pack(T.vishnuBhaskar),
      sudamaniVipareeta: { ...pack(T.sudamaniVipareeta), differsTa: T.sudamaniVipareeta.differsTa, commentaryNoteTa: T.sudamaniVipareeta.commentaryNoteTa },
      sudamaniTiming: pack(T.sudamaniTiming),
    },
    notes: {
      sunTa: 'சூரியன் சனிக்கு வேதையும் செய்யாது, விபரீத வேதையும் செய்யாது: ஜாதக பாரிஜாதம் (ப.834) "சூரியனும் சனியும் வேதையால் ஒருவரை ஒருவர் பாதிப்பதில்லை" என்று பொதுவாகச் சொல்கிறது; விஷ்ணு பாஸ்கரும் புலிப்பாணியின் கோசார அட்டவணையும் அதையே சொல்கின்றன. (புலிப்பாணியின் விபரீத வேதைப் பட்டியல் "சனியால் சூரியனுக்கு" என்ற ஒரு திசையை மட்டுமே குறிப்பிடுகிறது.) சூரியனின் காலங்கள் தகவலுக்காக மட்டும் காட்டப்படுகின்றன; மொத்தக் கணக்கில் இல்லை.',
      moonTa: 'சந்திரன் மாதந்தோறும் சுமார் 2¼ நாள் ஒரு ராசியில் இருக்கும் — அதனால் அதன் காலங்கள் எண்ணப்படுகின்றன, பட்டியலிடப்படவில்லை; மொத்தக் கணக்கிலும் சேர்க்கப்படவில்லை.',
      nodesTa: 'நூல் "வேறொரு கிரகம்" என்கிறது; ராகு, கேது சேர்க்கப்படுகின்றன (சராசரி கணு — திட்டத்தின் இயல்புநிலை; கேது = ராகு + 180°).',
      noReliefTa: 'சனி 1, 2, 4, 7, 8, 10-ல் இருக்கும்போது நூல் விபரீத வேதை இடம் எதையும் தரவில்லை — "தீமை உணரப்படும்".',
    },
  };
}

module.exports = { saturnVedhaWindows, signStays, overlaps, subtract, unionDays };
