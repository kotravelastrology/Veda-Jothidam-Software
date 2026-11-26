/**
 * Graphical ephemeris: the sidereal longitude of the slow and middle planets over a span of days, with the sign ingresses and the
 * retrograde and direct stations found on the way. Pure astronomy from the Swiss Ephemeris (no classical rule is involved), so the
 * only conventions are the ayanamsha and the node model the caller chooses.
 *
 * Samples are daily. An ingress or a station is located inside its day by bisection on the ephemeris, to about a minute.
 * The Moon is not offered: at 13 degrees a day a daily sample cannot follow it.
 */
const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');

const PLANETS = ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const norm = (x) => ((x % 360) + 360) % 360;
/** signed shortest difference b - a in degrees */
const delta = (a, b) => ((b - a + 540) % 360) - 180;

function longitudeAt(jd, planet, ayanamsha, nodeType) {
  if (planet === 'Rahu') return nodeLongitude(jd, ayanamsha, nodeType);
  if (planet === 'Ketu') return norm(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  return planetLongitude(jd, planet, ayanamsha);
}

/** Longitude speed in degrees per day by a symmetric difference of half a day. */
const speedAt = (jd, planet, ayanamsha, nodeType) => delta(longitudeAt(jd - 0.5, planet, ayanamsha, nodeType), longitudeAt(jd + 0.5, planet, ayanamsha, nodeType));

/** The instant in [a, b] where `f` changes sign, by bisection (f(a) and f(b) differ in sign). */
function bisect(f, a, b, steps = 22) {
  let lo = a;
  let hi = b;
  const flo = f(lo) > 0;
  for (let i = 0; i < steps; i += 1) {
    const mid = (lo + hi) / 2;
    if ((f(mid) > 0) === flo) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * @param startJd  Julian day (UT) of the first sample
 * @param days     number of days (samples = days + 1)
 * @returns { series: {planet: [[jd, longitude]]}, events: [{planet, kind: 'INGRESS'|'RETROGRADE'|'DIRECT', jd, longitude, sign, backward?}] }
 */
function graphicalEphemeris({ startJd, days, planets = PLANETS, ayanamsha = 'Lahiri', nodeType = 'mean' }) {
  const series = {};
  const events = [];
  for (const planet of planets) {
    if (!PLANETS.includes(planet)) throw new RangeError(`Unsupported planet: ${planet}`);
    const pts = [];
    for (let d = 0; d <= days; d += 1) {
      const jd = startJd + d;
      pts.push([jd, longitudeAt(jd, planet, ayanamsha, nodeType)]);
    }
    series[planet] = pts;
    for (let i = 1; i < pts.length; i += 1) {
      const [j0, l0] = pts[i - 1];
      const [j1, l1] = pts[i];
      // sign change (forward or backward): the boundary crossed lies between the two samples
      const s0 = Math.floor(l0 / 30);
      const s1 = Math.floor(l1 / 30);
      if (s0 !== s1) {
        const back = delta(l0, l1) < 0;
        const boundary = (back ? s0 : s1) * 30; // the 30-degree line that was crossed
        const jd = bisect((t) => delta(boundary, longitudeAt(t, planet, ayanamsha, nodeType)), j0, j1);
        events.push({ planet, kind: 'INGRESS', jd, longitude: norm(boundary), sign: s1, backward: back });
      }
      // station: the speed changes sign inside this day
      if (i >= 2 && planet !== 'Sun') {
        const spPrev = speedAt(j0, planet, ayanamsha, nodeType);
        const spNow = speedAt(j1, planet, ayanamsha, nodeType);
        if ((spPrev > 0) !== (spNow > 0) && planet !== 'Rahu' && planet !== 'Ketu') {
          const jd = bisect((t) => speedAt(t, planet, ayanamsha, nodeType), j0, j1);
          events.push({ planet, kind: spNow < 0 ? 'RETROGRADE' : 'DIRECT', jd, longitude: longitudeAt(jd, planet, ayanamsha, nodeType), sign: Math.floor(longitudeAt(jd, planet, ayanamsha, nodeType) / 30) });
        }
      }
    }
  }
  events.sort((a, b) => a.jd - b.jd);
  return { series, events };
}

/** Julian day (UT) to an ISO-like local string for a fixed offset in minutes. */
function jdToLocal(jd, utcOffsetMinutes = 0) {
  const ms = (jd - 2440587.5) * 86400000 + utcOffsetMinutes * 60000;
  return new Date(ms).toISOString().replace('T', ' ').slice(0, 16);
}

module.exports = { graphicalEphemeris, jdToLocal, PLANETS, longitudeAt, speedAt };
