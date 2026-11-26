/**
 * The times at which Saturn passes through the signs and the nakshatras that BPHS ch.70 marks as harming each matter (ashtakavargaEffects.js reads which they are for a chart; the
 * book says the harm comes when Saturn passes in transit through the sign or nakshatra the remainder gives, or the two trinal to it). This finds those passages from the ephemeris:
 * each time Saturn's sidereal longitude is in one of the signs (or nakshatras) given, from the instant it enters to the instant it leaves, retrograde returns included.
 */
const { planetLongitude } = require('../ephemeris/siderealPositions');

const NAKSHATRA_SPAN = 360 / 27;
const norm = (x) => ((x % 360) + 360) % 360;

/** Saturn's sidereal sign (0-11) at a Julian Day. */
const signAt = (jd, ayanamsha) => Math.floor(norm(planetLongitude(jd, 'Saturn', ayanamsha)) / 30);
/** Saturn's nakshatra (1-27) at a Julian Day. */
const nakshatraAt = (jd, ayanamsha) => Math.floor(norm(planetLongitude(jd, 'Saturn', ayanamsha)) / NAKSHATRA_SPAN) + 1;

/**
 * The runs of days on which `classify(jd)` returns the same non-null key, between `fromJd` and `toJd`, with their ends found to about a second by bisection.
 * @param classify (jd) => key | null
 * @returns {{ key: *, fromJd: number, toJd: number, continuesBefore: boolean, continuesAfter: boolean }[]}
 */
function runs(classify, fromJd, toJd, stepDays = 2) {
  const boundary = (a, b, keyA) => { // the instant between a (key keyA) and b (another key) at which the key changes
    let lo = a;
    let hi = b;
    for (let i = 0; i < 30; i += 1) {
      const mid = (lo + hi) / 2;
      if (classify(mid) === keyA) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  };
  const out = [];
  let prevJd = fromJd;
  let prevKey = classify(fromJd);
  let open = prevKey === null ? null : { key: prevKey, fromJd, continuesBefore: true };
  for (let jd = fromJd + stepDays; ; jd += stepDays) {
    const at = Math.min(jd, toJd);
    const key = classify(at);
    if (key !== prevKey) {
      const edge = boundary(prevJd, at, prevKey);
      if (open) { out.push({ ...open, toJd: edge, continuesAfter: false }); open = null; }
      if (key !== null) open = { key, fromJd: edge, continuesBefore: false };
    }
    prevJd = at;
    prevKey = key;
    if (at >= toJd) break;
  }
  if (open) out.push({ ...open, toJd, continuesAfter: true });
  return out;
}

/** Saturn's passages through any of `signs` (0-11), each a run with the sign it was in. */
const signPassages = (signs, fromJd, toJd, ayanamsha) => runs((jd) => { const s = signAt(jd, ayanamsha); return signs.includes(s) ? s : null; }, fromJd, toJd);
/** Saturn's passages through any of `nakshatras` (1-27). */
const nakshatraPassages = (nakshatras, fromJd, toJd, ayanamsha) => runs((jd) => { const n = nakshatraAt(jd, ayanamsha); return nakshatras.includes(n) ? n : null; }, fromJd, toJd);

module.exports = { signAt, nakshatraAt, runs, signPassages, nakshatraPassages };
