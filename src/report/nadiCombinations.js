/**
 * பிருகு நந்தி நாடி — graha-pair ("A") and bhava ("B") combination engine.
 *
 * Ported near-verbatim from the prior "kottravel-Nadi-astrology-software"
 * (`nadi.mjs`, `b1579.mjs`, and `kpLords` from `brsss.mjs`), which is itself
 * built on `@swisseph/node` — the same engine Kotravel uses. The pair-scoring
 * ramps, the AP-mode Parivartana (mutual sign-lord exchange), the Mars 4/8 &
 * Saturn 3/10 special aspects, the B-mode 1/30 interval overlap and the
 * descending strength order were all cross-checked there against ten saved
 * reference charts (its docs/B1579-validation.md).
 *
 * R. G. Rao's Bhrigu Nandi Nadi method: patterns are trinal/seventh
 * ("1·5·7·9"), trinal-only ("1·5·9"), adjacent ("3·11", 6° window) and
 * tenth ("10", 6° window). Nodes are excluded from the 7th (180°) and 3·11
 * relations. KP-style Placidus cusps are used for the house intervals,
 * independent of the report's own house-system setting.
 */
const { calculateChart } = require('../ephemeris/swissEphemeris');
const { nodeLongitude } = require('../ephemeris/siderealPositions');

const norm = (n) => ((n % 360) + 360) % 360;
const NADI_IDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const SIGN_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const isNode = (id) => id === 'Rahu' || id === 'Ketu';

const roundEven = (n, digits = 0) => {
  const scale = 10 ** digits;
  const v = n * scale;
  const lo = Math.floor(v);
  return (Math.abs(v - lo - 0.5) < 1e-9 ? (lo % 2 === 0 ? lo : lo + 1) : Math.round(v)) / scale;
};
const round2 = (n) => roundEven(n, 2);

// ── A: graha-pair combination (nadi.mjs) ──────────────────────────────────
function calculateNadi(natal, bhava, { mode = 'AP', pattern = '1579', transit = null } = {}) {
  if (!['AP', 'BP'].includes(mode) || !['1579', '159', '311', '10'].includes(pattern)) {
    throw new RangeError('Invalid Nadi mode');
  }
  if (!bhava?.available || bhava.cusps?.length !== 12
    || NADI_IDS.some((id) => !natal.find((p) => p.id === id && Number.isFinite(p.longitude)))) {
    return { available: false, rows: [], mode, pattern };
  }
  const planets = NADI_IDS.map((id) => ({ ...natal.find((p) => p.id === id) }));
  if (mode === 'AP') {
    for (let i = 0; i < 7; i += 1) {
      for (let j = i + 1; j < 7; j += 1) {
        if (SIGN_LORDS[planets[i].sign] === planets[j].id && SIGN_LORDS[planets[j].sign] === planets[i].id) {
          [planets[i].longitude, planets[j].longitude] = [planets[j].longitude, planets[i].longitude];
        }
      }
    }
  }
  const sources = transit ? NADI_IDS.map((id) => ({ ...transit.find((p) => p.id === id) })) : planets;
  for (const p of new Set([...planets, ...sources])) {
    p.house = bhava.cusps.findIndex((c, i) => norm(p.longitude - c.longitude) < norm(bhava.cusps[(i + 1) % 12].longitude - c.longitude));
    const start = bhava.cusps[p.house].longitude;
    const span = norm(bhava.cusps[(p.house + 1) % 12].longitude - start);
    p.progress = round2(norm(p.longitude - start) / span * 100);
    p.remaining = round2(100 - norm(p.longitude - start) / span * 100);
  }
  const score = (from, to, offset, retro, limit = 32, compat = false) => {
    let delta = norm(to - from - offset);
    if (delta > 180) delta -= 360;
    const directed = retro ? -delta : delta;
    if (limit === 32) {
      if (directed < -1 || directed >= 31) return null;
      const edge = compat && !retro && norm(from) % 30 < 1 && directed > 29;
      return (edge ? directed + 1 : 31 - directed) / 32 * 100;
    }
    const degree = norm(from) % 30;
    const sector = Math.floor(norm(from + offset) / 30);
    const targetSector = Math.floor(norm(to) / 30);
    const reverse = (degree < 3 && targetSector === (sector + 11) % 12) || (degree > 27 && targetSector === sector);
    return Math.abs(delta) < 3 ? (3 + (reverse ? -delta : delta)) / 6 * 100 : null;
  };
  const rows = sources.map((p) => {
    const entries = [];
    for (const other of planets) {
      if ((!transit || ['311', '10'].includes(pattern)) && other.id === p.id) continue;
      const offsets = pattern === '1579' ? [0, 120, 180, 240]
        : pattern === '159' ? [0, 120, 240]
          : pattern === '311' ? [60, 300] : [270];
      for (const offset of offsets) {
        if ((offset === 180 || pattern === '311') && (isNode(p.id) || isNode(other.id))) continue;
        const value = score(p.longitude, other.longitude, offset, p.retrograde, pattern === '311' || pattern === '10' ? 6 : 32, true);
        if (value != null) entries.push({ id: other.id, retrograde: !isNode(other.id) && other.retrograde, aspect: null, percentage: roundEven(value, 1) });
      }
    }
    if (['1579', '159'].includes(pattern)) {
      for (const [id, aspects] of [['Mars', [4, 8]], ['Saturn', [3, 10]]]) {
        const other = planets.find((v) => v.id === id);
        if ((!transit || ['311', '10'].includes(pattern)) && other.id === p.id) continue;
        for (const aspect of aspects) {
          const target = p.house * 30 + p.progress * 0.3;
          const projected = ((other.house + aspect - 1) % 12) * 30 + other.progress * 0.3;
          const value = score(target, projected, 0, p.retrograde);
          if (value != null) entries.push({ id, retrograde: false, aspect, percentage: roundEven(value, 1) });
        }
      }
    }
    entries.sort((a, b) => b.percentage - a.percentage);
    const nextSource = planets.find((v) => v.id === p.id);
    const next = planets
      .filter((v) => v.id !== p.id)
      .sort((a, b) => norm((nextSource.retrograde ? -1 : 1) * (a.longitude - nextSource.longitude))
        - norm((nextSource.retrograde ? -1 : 1) * (b.longitude - nextSource.longitude)))[0];
    return { id: p.id, retrograde: !isNode(p.id) && p.retrograde, remaining: roundEven(p.remaining), next: next.id, planets: entries };
  });
  return { available: true, mode, pattern, rows };
}

// ── B: bhava (house) combination (b1579.mjs) ──────────────────────────────
const B_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

function calculateB1579(natal, bhava, { mode = 'AP', pattern = '1579' } = {}) {
  if (!['AP', 'BP'].includes(mode) || !['1579', '159'].includes(pattern)) throw new TypeError('Unknown Bhava combination mode');
  if (!bhava.available) return { available: false, mode, pattern, rows: [], exchanges: [] };
  const planets = B_ORDER.map((id) => ({ ...natal.find((p) => p.id === id) }));
  const exchanges = [];
  for (let i = 0; mode === 'AP' && i < 7; i += 1) {
    for (let j = i + 1; j < 7; j += 1) {
      if (SIGN_LORDS[planets[i].sign] === planets[j].id && SIGN_LORDS[planets[j].sign] === planets[i].id) {
        exchanges.push([planets[i].id, planets[j].id]);
        [planets[i].longitude, planets[j].longitude] = [planets[j].longitude, planets[i].longitude];
      }
    }
  }
  for (const p of planets) {
    p.house = bhava.cusps.findIndex((c, i) => norm(p.longitude - c.longitude) < norm(bhava.cusps[(i + 1) % 12].longitude - c.longitude));
    const start = bhava.cusps[p.house].longitude;
    const span = norm(bhava.cusps[(p.house + 1) % 12].longitude - start);
    const progress = norm(p.longitude - start) / span * 100;
    p.progress = round2(progress);
    p.remaining = round2(100 - progress);
  }
  const rows = Array.from({ length: 12 }, (_, house) => {
    const entries = [];
    const add = (p, sc, aspect = null, overlap = false) => entries.push({
      id: p.id, retrograde: !aspect && !isNode(p.id) && p.retrograde, aspect, sourceHouse: p.house + 1, overlap, score: sc,
    });
    for (const p of planets) {
      const distance = (p.house - house + 12) % 12;
      if ([0, 4, 8].includes(distance) || (pattern === '1579' && distance === 6 && !isNode(p.id))) {
        add(p, p.remaining + 100 / 30);
      } else if ((pattern === '1579' ? [11, 3, 7, 5] : [11, 3]).includes(distance) && p.remaining <= 100 / 30 && (distance !== 5 || !isNode(p.id))) {
        add(p, 200 - p.progress, null, true);
      }
    }
    for (const [id, aspects] of [['Mars', [4, 8]], ['Saturn', [3, 10]]]) {
      const p = planets.find((v) => v.id === id);
      for (const aspect of aspects) if ((p.house + aspect - 1) % 12 === house) add(p, p.remaining + 100 / 30, aspect);
    }
    entries.sort((a, b) => b.score - a.score);
    for (const entry of entries) entry.percentage = Math.round(entry.score * 30 / 31 * 10) / 10;
    return { house: house + 1, planets: entries };
  });
  return { available: true, mode, pattern, rows, exchanges };
}

// ── KP 5-level lord chain (brsss.mjs) ─────────────────────────────────────
const KP_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const KP_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];

function kpLords(longitude) {
  if (!Number.isFinite(longitude)) throw new TypeError('Finite longitude required');
  const lon = norm(longitude);
  let width = 360 / 27;
  const star = Math.floor(lon / width);
  let start = star * width;
  let index = star % 9;
  const lords = [SIGN_LORDS[Math.floor(lon / 30)], KP_ORDER[index]];
  for (let depth = 0; depth < 3; depth += 1) {
    for (let step = 0; step < 9; step += 1) {
      const next = (index + step) % 9;
      const part = width * KP_YEARS[next] / 120;
      if (lon < start + part || step === 8) { index = next; width = part; lords.push(KP_ORDER[next]); break; }
      start += part;
    }
  }
  return lords;
}

// ── Assembly ─────────────────────────────────────────────────────────────
/** Build the {id, longitude, sign, retrograde} rows + KP-Placidus bhava the
 *  Nadi functions expect, from a fresh Placidus sidereal chart. */
function buildNadiInputs(birthInput, { ayanamsha = 'Lahiri', nodeType = 'mean' } = {}) {
  const chart = calculateChart({ ...birthInput, ayanamsa: ayanamsha, houseSystem: 'Placidus' });
  const natal = [];
  for (const id of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
    const p = chart.positions[id];
    natal.push({ id, longitude: norm(p.longitude), sign: Math.floor(norm(p.longitude) / 30), retrograde: p.longitudeSpeed < 0 });
  }
  const rahuLon = nodeLongitude(chart.julianDay, ayanamsha, nodeType);
  natal.push({ id: 'Rahu', longitude: norm(rahuLon), sign: Math.floor(norm(rahuLon) / 30), retrograde: true });
  natal.push({ id: 'Ketu', longitude: norm(rahuLon + 180), sign: Math.floor(norm(rahuLon + 180) / 30), retrograde: true });

  const cuspsRaw = chart.houses.cusps; // 1-indexed, already sidereal
  const cusps = Array.from({ length: 12 }, (_, i) => ({ house: i + 1, longitude: norm(cuspsRaw[i + 1]) }));
  const bhava = cusps.every((c) => Number.isFinite(c.longitude))
    ? { available: true, system: 'Placidus', cusps }
    : { available: false, system: 'Placidus', cusps: [] };
  return { natal, bhava, ascendant: norm(chart.houses.ascendant) };
}

function calculateNadiCombinations(birthInput, opts = {}) {
  const { natal, bhava, ascendant } = buildNadiInputs(birthInput, opts);
  if (!bhava.available) return { available: false };

  const PATTERNS_A = ['1579', '159', '311', '10'];
  const PATTERNS_B = ['1579', '159'];
  const MODES = ['AP', 'BP'];

  const nadiCombinations = {};
  for (const pattern of PATTERNS_A) {
    nadiCombinations[pattern] = {};
    for (const mode of MODES) nadiCombinations[pattern][mode] = calculateNadi(natal, bhava, { pattern, mode });
  }
  const bhavaCombinations = {};
  for (const pattern of PATTERNS_B) {
    bhavaCombinations[pattern] = {};
    for (const mode of MODES) bhavaCombinations[pattern][mode] = calculateB1579(natal, bhava, { pattern, mode });
  }
  const prsss = natal.map((p) => ({ id: p.id, lords: kpLords(p.longitude) }));

  return {
    available: true,
    ascendant,
    natal: natal.map((p) => ({ id: p.id, longitude: p.longitude, sign: p.sign, retrograde: p.retrograde })),
    cusps: bhava.cusps,
    nadiCombinations,
    bhavaCombinations,
    prsss,
  };
}

module.exports = { calculateNadiCombinations, calculateNadi, calculateB1579, kpLords, buildNadiInputs };
