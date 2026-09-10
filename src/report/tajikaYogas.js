/**
 * Tajika Yogas (தாஜிக யோகங்கள்) — pair-level Ithāsāla / Īsarpha analysis for
 * the annual (Varshaphala) chart, with Kambool and Manau riders.
 *
 * Pair-level core adapted from AstrologicLab tajikaYogas.ts (cross-checked
 * there against "Vedic Astrology: An Integrated Approach" ch.29 and the
 * classical Nīlakaṇṭhī reading — only the 5 Ptolemaic aspects 0/60/90/120/180
 * are Tājika aspects; 2-12 & 6-8 are aspectless).
 *   - Ithāsāla  = the faster planet is APPLYING toward the slower's aspect.
 *   - Īsarpha   = the faster planet is SEPARATING from it.
 *   - Kambool   = Moon is one of the two planets in an Ithāsāla pair.
 *   - Manau     = Mars or Saturn in CONJUNCTION with the faster planet of an
 *                 Ithāsāla (obstructs it).
 * The extended named yogas (Radda, Duttota, Nakta, Khallasara, …) need
 * Pañca-Vargeeya-Bala and varga engines — not ported yet.
 */
const DEEPTAMSA = { Sun: 15, Moon: 12, Mars: 8, Mercury: 7, Jupiter: 9, Venus: 7, Saturn: 9 };
// average-speed order, fastest → slowest
const SPEED_ORDER = ['Moon', 'Mercury', 'Venus', 'Sun', 'Mars', 'Jupiter', 'Saturn'];
const ASPECT_ANGLES = [0, 60, 90, 120, 180];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

function norm360(x) { return ((x % 360) + 360) % 360; }
function angleDiff(a, b) { let d = norm360(a - b); if (d > 180) d -= 360; return d; }
const speedRank = (n) => SPEED_ORDER.indexOf(n);

function nearestAspect(l1, n1, l2, n2) {
  const sep = Math.abs(angleDiff(l1, l2));
  let best = { angle: 0, diff: Infinity };
  for (const a of ASPECT_ANGLES) {
    const diff = Math.abs(sep - a);
    if (diff < best.diff) best = { angle: a, diff };
  }
  const combinedOrb = (DEEPTAMSA[n1] + DEEPTAMSA[n2]) / 2;
  return { angle: best.angle, orb: best.diff, inOrb: best.diff <= combinedOrb };
}

/** 'ithasala' (applying), 'isarpha' (separating), or null. */
function judgePhase(p1, p2, aspect) {
  if (!aspect.inOrb) return null;
  const faster = speedRank(p1.name) < speedRank(p2.name) ? p1 : p2;
  const slower = faster === p1 ? p2 : p1;
  const targetA = norm360(slower.lon + aspect.angle);
  const targetB = norm360(slower.lon - aspect.angle);
  const target = Math.abs(angleDiff(targetA, faster.lon)) <= Math.abs(angleDiff(targetB, faster.lon)) ? targetA : targetB;
  const gap = angleDiff(target, faster.lon);
  const closing = faster.retro ? gap < 0 : gap > 0;
  if (closing) return 'ithasala';
  if (Math.abs(gap) >= 1) return 'isarpha';
  return null;
}

/**
 * @param {{ grahaLon:Record<string,number>, retro?:Record<string,boolean> }} v
 */
function calculateTajikaYogas(v) {
  const pts = PLANETS.map((name) => ({ name, lon: v.grahaLon[name], retro: !!(v.retro && v.retro[name]) }));
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const p1 = pts[i], p2 = pts[j];
      const aspect = nearestAspect(p1.lon, p1.name, p2.lon, p2.name);
      const phase = judgePhase(p1, p2, aspect);
      if (!phase) continue;
      const isIthasala = phase === 'ithasala';
      const faster = speedRank(p1.name) < speedRank(p2.name) ? p1 : p2;

      let manau = null;
      if (isIthasala) {
        for (const ob of pts) {
          if (ob.name === p1.name || ob.name === p2.name) continue;
          if (ob.name !== 'Mars' && ob.name !== 'Saturn') continue;
          const conj = nearestAspect(faster.lon, faster.name, ob.lon, ob.name);
          if (conj.angle === 0 && conj.inOrb) { manau = ob.name; break; }
        }
      }
      out.push({
        planetA: p1.name,
        planetB: p2.name,
        aspectAngle: aspect.angle,
        phase: isIthasala ? 'Ithāsāla (applying)' : 'Īsarpha (separating)',
        orb: Math.round(aspect.orb * 100) / 100,
        kambool: isIthasala && (p1.name === 'Moon' || p2.name === 'Moon'),
        manau,
      });
    }
  }
  return out;
}

module.exports = { calculateTajikaYogas };
