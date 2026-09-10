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

// ─── Extended named yogas (AstrologicLab tajikaYogas.ts ch.29 p.342-349) ──────
const { panchaVargeeyaBala, isOwnHadda, exaltLon, d3Rashi, d9Rashi } = require('./panchaVargeeyaBala');
const { OWN_SIGNS } = require('../chart/shadbala');

const KENDRA = new Set([1, 4, 7, 10]);
const PANAPHARA = new Set([2, 5, 8, 11]);
const APOKLIMA = new Set([3, 6, 9, 12]);
const DUSTHANA = new Set([6, 8, 12]);
const houseFromLagna = (rasi0, lagnaRasi0) => (((rasi0 - lagnaRasi0) % 12) + 12) % 12 + 1;

function isExalted(planet, lon) { return Math.floor(lon / 30) === Math.floor(exaltLon(planet) / 30); }
function isDebilitated(planet, lon) { return Math.floor(lon / 30) % 12 === (Math.floor(exaltLon(planet) / 30) + 6) % 12; }
function isOwnSign(planet, lon) { return (OWN_SIGNS[planet] || []).includes(Math.floor(lon / 30) % 12); }
function isCombust(p, sun) {
  if (p.name === 'Sun') return false;
  return p.rasi0 === sun.rasi0 && Math.abs(angleDiff(p.lon, sun.lon)) <= 10;
}
function isWeak(p, sun) {
  return isDebilitated(p.name, p.lon) || p.retro || isCombust(p, sun) || panchaVargeeyaBala(p.name, p.lon) < 5;
}
function isStrong(p) {
  return isExalted(p.name, p.lon) || isOwnSign(p.name, p.lon) || panchaVargeeyaBala(p.name, p.lon) >= 10;
}

/**
 * @param {{ grahaLon:Record<string,number>, grahaRasi0:Record<string,number>,
 *           retro?:Record<string,boolean>, lagnaRasi0:number }} v
 */
function calculateExtendedTajikaYogas(v) {
  const pts = PLANETS.map((name) => ({
    name, lon: v.grahaLon[name], rasi0: v.grahaRasi0[name],
    retro: !!(v.retro && v.retro[name]),
  }));
  const sun = pts.find((p) => p.name === 'Sun');
  const moon = pts.find((p) => p.name === 'Moon');
  const houseOf = (p) => houseFromLagna(p.rasi0, v.lagnaRasi0);
  const out = [];
  const add = (name, planets, nature, note) => out.push({ name, planets, nature, note });

  // Ishkavala / Induvara — positional
  const houses = pts.map(houseOf);
  if (houses.every((h) => KENDRA.has(h) || PANAPHARA.has(h)) && houses.some((h) => KENDRA.has(h))) {
    add('Ishkavala', [], 'benefic', 'All grahas in kendras/panapharas, apoklimas empty — wealth, ease, good fortune.');
  }
  if (houses.every((h) => APOKLIMA.has(h))) {
    add('Induvara', [], 'malefic', 'All grahas only in apoklimas — disappointment, worry, poor health.');
  }

  const ph = (p1, p2) => judgePhase(p1, p2, nearestAspect(p1.lon, p1.name, p2.lon, p2.name));

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const p1 = pts[i], p2 = pts[j];
      if (ph(p1, p2) !== 'ithasala') continue;
      const faster = speedRank(p1.name) < speedRank(p2.name) ? p1 : p2;
      const slower = faster === p1 ? p2 : p1;
      const pair = `${faster.name}-${slower.name}`;

      if (isWeak(p1, sun) || isWeak(p2, sun)) {
        add('Radda', [p1.name, p2.name], 'malefic', `${pair} Ithāsāla with a weak planet (debilitated/retrograde/combust/low PVB) — the Ithāsāla is cancelled, bad result.`);
      }
      if (isStrong(slower) && isWeak(faster, sun)) {
        add('Duhphali-Kutta', [p1.name, p2.name], 'benefic', `Slower ${slower.name} strong, faster ${faster.name} weak — desires/plans are fulfilled (per the source's worked example).`);
      }
      if (DUSTHANA.has(houseOf(p1)) && DUSTHANA.has(houseOf(p2)) && isWeak(p1, sun) && isWeak(p2, sun)) {
        add('Durupha', [p1.name, p2.name], 'malefic', `${pair} both in 6/8/12 and weak — an Ithāsāla that cannot deliver.`);
      }
      if (isWeak(p1, sun) && isWeak(p2, sun)) {
        for (const third of pts) {
          if (third === p1 || third === p2 || !isStrong(third)) continue;
          for (const weak of [p1, p2]) {
            if (ph(weak, third) === 'ithasala') {
              add('Duttota', [p1.name, p2.name, third.name], 'benefic', `${pair} weak, but ${weak.name} has a separate Ithāsāla with strong ${third.name} — ultimately a good result.`);
              break;
            }
          }
        }
      }
      if (p1.name !== 'Moon' && p2.name !== 'Moon') {
        for (const member of [p1, p2]) {
          if (ph(moon, member) === 'ithasala') {
            add('Kamboola (3rd-party)', [p1.name, p2.name, 'Moon'], 'benefic', `Moon has its own Ithāsāla with ${member.name} of the ${pair} pair — strengthens ${pair}.`);
            break;
          }
        }
      }
    }
  }

  // Nakta / Yamaya — third planet bridges a pair with no direct aspect
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const p1 = pts[i], p2 = pts[j];
      if (nearestAspect(p1.lon, p1.name, p2.lon, p2.name).inOrb) continue;
      for (const third of pts) {
        if (third === p1 || third === p2) continue;
        if (ph(third, p1) !== 'ithasala' || ph(third, p2) !== 'ithasala') continue;
        const faster = speedRank(third.name) < speedRank(p1.name) && speedRank(third.name) < speedRank(p2.name);
        const slower = speedRank(third.name) > speedRank(p1.name) && speedRank(third.name) > speedRank(p2.name);
        if (faster) add('Nakta', [p1.name, p2.name, third.name], 'benefic', `No direct aspect between ${p1.name}-${p2.name}; faster ${third.name} bridges both — fulfilled with help.`);
        else if (slower) add('Yamaya', [p1.name, p2.name, third.name], 'benefic', `No direct aspect between ${p1.name}-${p2.name}; slower ${third.name} bridges both — fulfilled after delay.`);
      }
    }
  }

  // Khallasara — lagna lord sits (rasi-order) between Moon and X, no Ithāsāla to either
  const lagnaLordName = pts.find((p) => (OWN_SIGNS[p.name] || []).includes(v.lagnaRasi0))?.name;
  const lagnaLord = pts.find((p) => p.name === lagnaLordName);
  if (lagnaLord && lagnaLord.name !== 'Moon') {
    const moonSign0 = Math.floor(moon.lon / 30) % 12;
    for (const x of pts) {
      if (x.name === 'Moon' || x.name === lagnaLord.name) continue;
      const span = (Math.floor(x.lon / 30) % 12 - moonSign0 + 12) % 12;
      const off = (Math.floor(lagnaLord.lon / 30) % 12 - moonSign0 + 12) % 12;
      if (!(off > 0 && off < span)) continue;
      if (ph(lagnaLord, moon) !== 'ithasala' && ph(lagnaLord, x) !== 'ithasala') {
        add('Khallasara', [lagnaLord.name, 'Moon', x.name], 'malefic', `Lagna lord ${lagnaLord.name} lies between Moon and ${x.name} with no Ithāsāla to either — destroys ${x.name}'s significations.`);
      }
    }
  }

  // Kutta — a planet in lagna aspected by an exalted/own-sign planet in kendra/panaphara
  for (const inLagna of pts) {
    if (houseOf(inLagna) !== 1) continue;
    for (const other of pts) {
      if (other === inLagna) continue;
      const h = houseOf(other);
      if (!KENDRA.has(h) && !PANAPHARA.has(h)) continue;
      if (!isExalted(other.name, other.lon) && !isOwnSign(other.name, other.lon)) continue;
      if (!nearestAspect(inLagna.lon, inLagna.name, other.lon, other.name).inOrb) continue;
      add('Kutta', [inLagna.name, other.name], 'benefic', `${inLagna.name} in lagna aspected by strong ${other.name} — its significations are fulfilled. (Source footnote: scholars differ.)`);
    }
  }

  // Thambira / Gairi-Kamboola — planet in last degree of a sign, gains an Ithāsāla only after ingress
  for (const p of pts) {
    if (p.lon % 30 < 29) continue;
    const nextLon = norm360((Math.floor(p.lon / 30) + 1) * 30 + 0.05);
    const vp = { name: p.name, lon: nextLon, retro: p.retro };
    for (const target of pts) {
      if (target === p) continue;
      if (ph(p, target) === 'ithasala') continue;
      if (!nearestAspect(nextLon, p.name, target.lon, target.name).inOrb) continue;
      if (p.name === 'Moon') {
        const excl = isExalted('Moon', p.lon) || isDebilitated('Moon', p.lon)
          || (OWN_SIGNS.Moon || []).includes(d9Rashi(p.lon))
          || (OWN_SIGNS.Moon || []).includes(d3Rashi(p.lon))
          || isOwnHadda('Moon', p.lon);
        if (!excl && isStrong(target)) {
          add('Gairi-Kamboola', ['Moon', target.name], 'neutral', `Moon in the last degree — after ingress it gains an Ithāsāla with strong ${target.name} — fulfilled late, with others' help.`);
        }
      } else if (target.name !== 'Moon' && speedRank(target.name) > speedRank(p.name)) {
        add('Thambira', [p.name, target.name], 'neutral', `${p.name} in its sign's last degree — after ingress it gains an Ithāsāla with slower ${target.name} — fulfilled after delay.`);
      }
    }
  }

  return out;
}

module.exports = { calculateTajikaYogas, calculateExtendedTajikaYogas };
