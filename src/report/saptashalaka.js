/**
 * Saptashalaka chakra transits as dated windows (rules in
 * `saptashalakaTables.js`):
 *
 *   1. the Sun in a star in vedha with the natal (Janma), 10th (Karma) or
 *      19th (Adhana) star;
 *   2. the other planets in such stars, malefic or benefic;
 *   3. planets occupying the 1st, 3rd, 5th, 7th, 10th, 19th or 23rd star from
 *      the natal star;
 *   4. a planet changing sign while the Moon is in the natal, 10th or 19th star.
 *
 * Both readings of the chakra (straight line; three lines) are computed. Each
 * planet's chakra star is scanned once and shared by every rule.
 */

const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { scanKey } = require('./saturnAshtakavarga');
const { signStays } = require('./saturnVedha');
const { NAKSHATRA_TA } = require('./babyNames');
const T = require('./saptashalakaTables');

const DAY_MS = 86400000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const STAR = 360 / 27;
const PLANETS = ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const STEP_DAYS = { Sun: 1, Mars: 1, Mercury: 1, Venus: 1, Jupiter: 2, Saturn: 2, Rahu: 2, Ketu: 2 };
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const TARGET_TA = { JANMA: 'ஜன்ம', KARMA: 'கர்ம (10)', ADHANA: 'ஆதான (19)' };
const iso = (ms) => new Date(ms).toISOString();
const days = (a, b) => Math.round(((b - a) / DAY_MS) * 10) / 10;
const norm360 = (d) => ((d % 360) + 360) % 360;

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  const jd = ms / DAY_MS + JD_UNIX_EPOCH;
  if (planet === 'Rahu') return norm360(nodeLongitude(jd, ayanamsha, nodeType));
  if (planet === 'Ketu') return norm360(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  return norm360(planetLongitude(jd, planet, ayanamsha));
}

/** 27-star index (0 = Ashwini) to the chakra's numbering (1 = Krittika … 28 = Bharani, 20 = Abhijit). */
const chakraOf27 = (k) => (k === 0 ? 27 : k === 1 ? 28 : k <= 20 ? k - 1 : k);
/** A longitude's star on the chakra, Abhijit carved out of Uttarashadha and Shravana. */
function chakraStarOf(lon) {
  const l = norm360(lon);
  if (l >= T.ABHIJIT.from && l < T.ABHIJIT.to) return 20;
  return chakraOf27(Math.floor(l / STAR) % 27);
}
const star27Of = (lon) => Math.floor(norm360(lon) / STAR) % 27;

/**
 * @param natalMoonLongitude sidereal
 * @param fromMs, toMs       window for rules 1-3; rule 4 runs from atMs for `roundsYears`
 */
function saptashalaka({ natalMoonLongitude, fromMs, toMs, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean', roundsYears = 5 }) {
  if (!Number.isFinite(natalMoonLongitude)) throw new UnsupportedInputError('natal Moon longitude required', 'natalMoonLongitude');
  if (!(Number.isFinite(fromMs) && Number.isFinite(toMs) && toMs > fromMs) || (toMs - fromMs) > 40 * YEAR_MS) {
    throw new UnsupportedInputError('the window must be a forward span of at most 40 years', 'window');
  }
  const janma27 = star27Of(natalMoonLongitude);
  const targets27 = { JANMA: janma27, KARMA: (janma27 + 9) % 27, ADHANA: (janma27 + 18) % 27 };
  const targets = Object.fromEntries(Object.entries(targets27).map(([k, v]) => [k, chakraOf27(v)]));

  // Each planet's chakra star and 27-star, scanned once on a combined key and
  // split into the two sequences afterwards.
  const merge = (segs, keyOf) => {
    const out = [];
    for (const s of segs) {
      const k = keyOf(s.key);
      const last = out[out.length - 1];
      if (last && last.key === k) { last.toMs = s.toMs; last.openEnd = s.openEnd; } else out.push({ ...s, key: k });
    }
    return out;
  };
  const chakraStays = {};
  const starStays = {};
  for (const p of PLANETS) {
    const both = scanKey(fromMs, toMs, (ms) => {
      const lon = longitudeOf(p, ms, ayanamsha, nodeType);
      return chakraStarOf(lon) * 27 + star27Of(lon);
    }, STEP_DAYS[p] * DAY_MS);
    chakraStays[p] = merge(both, (k) => Math.floor(k / 27));
    starStays[p] = merge(both, (k) => k % 27);
  }
  const win = (s, extra) => ({
    fromUtc: iso(s.fromMs), toUtc: iso(s.toMs), days: days(s.fromMs, s.toMs),
    openStart: Boolean(s.openStart), openEnd: Boolean(s.openEnd), current: s.fromMs <= atMs && atMs < s.toMs, ...extra,
  });
  const signAt = (p, ms) => Math.floor(longitudeOf(p, ms, ayanamsha, nodeType) / 30) % 12;

  const readings = {};
  for (const [rid, reading] of Object.entries(T.READINGS)) {
    // Which chakra star is in vedha with which target, and along which line.
    const vedhaStars = new Map();
    for (const [tid, star] of Object.entries(targets)) {
      reading.partners(star).forEach((v, i) => {
        const list = vedhaStars.get(v) ?? [];
        list.push({ target: tid, line: i === 0 ? 'STRAIGHT' : 'DIAGONAL' });
        vedhaStars.set(v, list);
      });
    }
    const vedhaWindows = (p) => chakraStays[p].filter((s) => vedhaStars.has(s.key)).map((s) => win(s, {
      planet: p, planetTa: PLANET_TA[p], star: s.key, starTa: T.CHAKRA_STARS_TA[s.key], hits: vedhaStars.get(s.key),
    }));

    // Rule 1: the Sun, with any malefic in his sign during the window.
    const sun = vedhaWindows('Sun').map((w) => {
      const a = Date.parse(w.fromUtc); const b = Date.parse(w.toUtc);
      const with_ = [];
      for (const m of T.MALEFICS) {
        let n = 0;
        for (let t = a + DAY_MS / 2; t < b; t += DAY_MS) if (signAt(m, t) === signAt('Sun', t)) n += 1;
        if (n) with_.push({ planet: m, planetTa: PLANET_TA[m], days: n });
      }
      return { ...w, maleficWithSun: with_ };
    });

    // Rule 2: malefics and benefics; for each malefic window, the days a benefic stands in vedha with the same target too.
    const others = [...T.MALEFICS, ...T.BENEFICS].flatMap((p) => vedhaWindows(p).map((w) => ({ ...w, nature: T.MALEFICS.includes(p) ? 'MALEFIC' : 'BENEFIC' })));
    const benefic = others.filter((w) => w.nature === 'BENEFIC');
    for (const w of others.filter((x) => x.nature === 'MALEFIC')) {
      const a = Date.parse(w.fromUtc); const b = Date.parse(w.toUtc);
      const tids = new Set(w.hits.map((h) => h.target));
      let both = 0;
      for (const bw of benefic) {
        if (!bw.hits.some((h) => tids.has(h.target))) continue;
        both += Math.max(0, Math.min(b, Date.parse(bw.toUtc)) - Math.max(a, Date.parse(bw.fromUtc)));
      }
      w.beneficAlsoDays = Math.round((both / DAY_MS) * 10) / 10;
    }
    others.sort((x, y) => Date.parse(x.fromUtc) - Date.parse(y.fromUtc));

    readings[rid] = {
      id: rid, labelTa: reading.labelTa, sources: reading.sources,
      vedhaStars: Object.fromEntries(Object.entries(targets).map(([tid, star]) => [tid, reading.partners(star).map((v, i) => ({
        star: v, starTa: T.CHAKRA_STARS_TA[v], line: i === 0 ? 'STRAIGHT' : 'DIAGONAL',
      }))])),
      sun, others,
    };
  }

  // Rule 3: occupation of the 1st, 3rd, 5th, 7th, 10th, 19th, 23rd stars (27 stars; the same under both readings),
  // and of the 22nd — Vainashika as Kalaprakasika and Gour count it — marked as the alternative.
  const rule3 = T.RULES.find((r) => r.id === 'OCCUPATION');
  const occStars = new Map([...rule3.counts, rule3.vainashika.alternative].map((c) => [(janma27 + c - 1) % 27, c]));
  const occupation = [...T.MALEFICS, ...T.BENEFICS]
    .flatMap((p) => starStays[p].filter((s) => occStars.has(s.key)).map((s) => win(s, {
      planet: p, planetTa: PLANET_TA[p], nature: T.MALEFICS.includes(p) ? 'MALEFIC' : 'BENEFIC',
      star27: s.key, starTa: NAKSHATRA_TA[s.key], count: occStars.get(s.key),
      vainashikaAlternative: occStars.get(s.key) === rule3.vainashika.alternative,
    })))
    .sort((x, y) => Date.parse(x.fromUtc) - Date.parse(y.fromUtc));

  // Rule 4: sign changes while the Moon is in the natal, 10th or 19th star.
  const roundsTo = atMs + roundsYears * YEAR_MS;
  const round27 = new Map([[targets27.JANMA, 'JANMA'], [targets27.KARMA, 'KARMA'], [targets27.ADHANA, 'ADHANA']]);
  const rounds = [];
  for (const p of PLANETS) {
    const stays = signStays(p, atMs, roundsTo, ayanamsha, nodeType);
    for (const s of stays.slice(1)) {
      const moonStar = star27Of(longitudeOf('Moon', s.fromMs, ayanamsha, nodeType));
      if (round27.has(moonStar)) {
        rounds.push({
          atUtc: iso(s.fromMs), planet: p, planetTa: PLANET_TA[p], toSign: s.sign,
          round: round27.get(moonStar), roundTa: TARGET_TA[round27.get(moonStar)], moonStarTa: NAKSHATRA_TA[moonStar],
        });
      }
    }
  }
  rounds.sort((x, y) => Date.parse(x.atUtc) - Date.parse(y.atUtc));

  return {
    window: { fromUtc: iso(fromMs), toUtc: iso(toMs) }, atUtc: iso(atMs),
    roundsWindow: { fromUtc: iso(atMs), toUtc: iso(roundsTo) },
    natal: Object.fromEntries(Object.entries(targets27).map(([tid, k]) => [tid, {
      star27: k, starTa: NAKSHATRA_TA[k], chakraStar: targets[tid], labelTa: TARGET_TA[tid],
    }])),
    defaultReading: T.DEFAULT_READING,
    readings, occupation, rounds,
    rank: T.RANK, rules: T.RULES, abhijitSource: T.ABHIJIT_SOURCE,
    notComputedTa: T.NOT_COMPUTED_TA, notes: T.NOTES_TA,
  };
}

module.exports = { saptashalaka, chakraOf27, chakraStarOf };
