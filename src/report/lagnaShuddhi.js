/**
 * Lagna shuddhi for one moment (tables in `lagnaShuddhiTables.js`). Pure: the
 * engine in `muhurtaStars.js` scans the rising sign at the event's place and
 * calls `lagnaShuddhiOf` for every stretch with one lagna.
 *
 * A moment:
 *   lagna        the rising sign, 0 = Aries
 *   signs        { Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu: sign }
 *   retro        { Mars, Saturn: bool } (Rahu and Ketu are always retrograde; the Sun never)
 *   night        before sunrise or after sunset at the place
 *   gandanta     { MINUTES_12, DEGREES_3: bool }
 *   natalLagna, natalMoon   signs, for the 8th-sign rule
 *   tithi        1-30, for Bana by tithi and lagna
 */

const T = require('./lagnaShuddhiTables');
const { naturalRelation } = require('../chart/planetaryRelationship');

const houseOf = (sign, lagna) => ((sign - lagna + 12) % 12) + 1;
/**
 * One lord, friends, or one friendly and the other neutral (Wilhelm's words;
 * BPHS natural relations). This frees exactly the six 8th signs Muhurta
 * Chintamani names (Pisces, Taurus, Cancer, Scorpio, Capricorn, Virgo) — the
 * Moon and Jupiter, Mercury and Saturn are friends one way and neutral the other.
 */
const friendsOrSame = (a, b) => {
  if (a === b) return true;
  const r = [naturalRelation(a, b), naturalRelation(b, a)];
  return r.every((x) => x !== 'enemy') && r.includes('friend');
};

/** The planets (and the lagna lord) in a book's places to avoid. */
function avoidOf(houses, lagnaLordHouse, list) {
  const out = T.PLANETS.filter((p) => list[p].includes(houses[p])).map((p) => [p, houses[p]]);
  if (list.LAGNA_LORD.includes(lagnaLordHouse)) out.push(['LAGNA_LORD', lagnaLordHouse]);
  return out;
}

/** The twenty points, added only or added and taken away (Rangacharya). */
function pointsOf(houses, scoring) {
  let total = 0;
  for (const p of T.PLANETS) {
    if (T.POINTS[p].good.includes(houses[p])) total += T.POINTS[p].points;
    else if (scoring === 'PLUS_MINUS' && T.AVOID.RANGACHARYA[p].includes(houses[p])) total -= T.POINTS[p].points;
  }
  return total;
}

function placementsOf(houses, lagnaLordHouse) {
  return Object.fromEntries(T.PLACEMENTS.order.map((id) => {
    const r = T.PLACEMENTS[id];
    const avoid = avoidOf(houses, lagnaLordHouse, T.AVOID[id]);
    const points = r.scoring ? pointsOf(houses, r.scoring) : null;
    const grade = r.scoring ? (r.grades.find(([min]) => points >= min)?.[1] ?? 'REJECT') : null;
    const pass = (r.scoring ? r.pass.includes(grade) : true) && avoid.length <= r.maxAvoid;
    return [id, { avoid, points, grade, pass }];
  }));
}

/** The lagna counted from the birth lagna and the birth Moon: the 8th (and the 4th, 12th). */
function ashtamaOf(lagna, natalLagna, natalMoon) {
  const lord = T.RASI_LORDS;
  const from = [['LAGNA', natalLagna], ['MOON', natalMoon]].filter(([, s]) => Number.isInteger(s));
  const hits = from.map(([k, s]) => {
    const house = houseOf(lagna, s);
    return { from: k, house, relief: house === 8 && friendsOrSame(lord[s], lord[lagna]) };
  });
  return {
    EIGHTH: hits.filter((h) => h.house === 8 && !h.relief),
    FOUR_EIGHT_TWELVE: hits.filter((h) => (h.house === 8 && !h.relief) || h.house === 4 || h.house === 12),
    houses: hits,
  };
}

/** Deaf, blind or lame by day or night; removed when Jupiter aspects the lagna or its lord (5th, 7th, 9th). */
function pdbOf(lagna, night, signs) {
  const set = night ? T.PDB.NIGHT : T.PDB.DAY;
  const kind = Object.keys(set).find((k) => set[k].includes(lagna)) ?? null;
  const aspected = [4, 6, 8].map((d) => (signs.Jupiter + d) % 12);
  const relief = aspected.includes(lagna) || aspected.includes(signs[T.RASI_LORDS[lagna]]);
  return { kind, relief, present: Boolean(kind) && !relief };
}

function kartariOf(houses, retro) {
  const isRetro = (p) => p === 'Rahu' || p === 'Ketu' || Boolean(retro[p]);
  const in2 = T.MALEFICS.filter((p) => houses[p] === 2);
  const in12 = T.MALEFICS.filter((p) => houses[p] === 12);
  return {
    SCISSORS: in12.some((p) => !isRetro(p)) && in2.some(isRetro),
    RETRO_SECOND: in2.some(isRetro) && in12.length > 0,
    HEMMED: in2.length > 0 && in12.length > 0,
    in2, in12,
  };
}

function lagnaShuddhiOf(m) {
  const houses = Object.fromEntries(T.PLANETS.map((p) => [p, houseOf(m.signs[p], m.lagna)]));
  const lagnaLordHouse = houses[T.RASI_LORDS[m.lagna]];
  return {
    lagna: m.lagna,
    houses,
    placements: placementsOf(houses, lagnaLordHouse),
    ashtama: ashtamaOf(m.lagna, m.natalLagna, m.natalMoon),
    pdb: pdbOf(m.lagna, m.night, m.signs),
    kartari: kartariOf(houses, m.retro),
    gandanta: { ...m.gandanta },
    // Bana by tithi and lagna (1 = Aries): Mrityu when the sum leaves 1 over nines.
    banaMrityu: (m.tithi + m.lagna + 1) % 9 === 1,
  };
}

// ---------------------------------------------------------------------------
// The lagna's navamsa
// ---------------------------------------------------------------------------

const isMovable = (s) => T.MOVABLE.includes(s);
const norm360 = (d) => ((d % 360) + 360) % 360;
/** A planet in `from` occupies `to`, or aspects it fully (the 7th; Mars 4, 8; Jupiter 5, 9; Saturn 3, 10). */
const sees = (planet, from, to, occupy = true) => (occupy && from === to) || T.ASPECTS[planet].some((h) => (from + h - 1) % 12 === to);

/**
 * The navamsa checks for one lagna navamsa.
 *   n108   the lagna's navamsa index (0 = Aries's first); its sign is n108 mod 12
 *   half   0 in the first half of the navamsa, 1 in the second (for Sagittarius's)
 *   signs  the planets' signs (as for lagnaShuddhiOf)
 *   natalLagnaLongitude, natalLagna, natalMoon
 */
function navamsaOf(m) {
  const lagna = Math.floor(m.n108 / 9);
  const num = (m.n108 % 9) + 1;
  const nav = m.n108 % 12;
  const varg = nav === lagna;
  const moon = m.signs.Moon;
  const moonLibCap = moon === 6 || moon === 9;

  const last = {
    MUHURTA_CHINTAMANI: [num === 9 && !varg && 'LAST', moonLibCap && isMovable(lagna) && isMovable(nav) && 'MOVABLE'].filter(Boolean),
    SHRIDHAR: [
      num === 9 && !(T.DUAL.includes(lagna) && lagna !== 11) && 'LAST',
      varg && (lagna === 6 || lagna === 9) && 'VARG_LIB_CAP',
      moonLibCap && isMovable(lagna) && isMovable(nav) && !(varg && (lagna === 0 || lagna === 3)) && 'MOVABLE',
    ].filter(Boolean),
    RANGACHARYA: [num === 9 && !varg && 'LAST', isMovable(lagna) && num === 1 && 'FIRST_CARDINAL'].filter(Boolean),
  };

  const which = Object.fromEntries(T.NAV_WHICH.order.map((id) => {
    const r = T.NAV_WHICH[id];
    return [id, r.signs.includes(nav) && !(nav === 8 && r.firstHalf && m.half === 1)];
  }));

  const lord = T.RASI_LORDS;
  const natal = { MUHURTA_CHINTAMANI: [], JOSHI: [] };
  if (Number.isFinite(m.natalLagnaLongitude)) {
    const navOf = (lon) => Math.floor(norm360(lon) / (10 / 3)) % 12;
    const nl = Math.floor(norm360(m.natalLagnaLongitude) / 30);
    if (lagna === navOf(m.natalLagnaLongitude + 210)) natal.MUHURTA_CHINTAMANI.push('NAV8');
    if (lagna === navOf(m.natalLagnaLongitude + 330)) natal.MUHURTA_CHINTAMANI.push('NAV12');
    if (m.signs[lord[(nl + 7) % 12]] === lagna) natal.MUHURTA_CHINTAMANI.push('LORD8');
    if (m.signs[lord[(nl + 11) % 12]] === lagna) natal.MUHURTA_CHINTAMANI.push('LORD12');
  }
  for (const [from, s] of [['LAGNA', m.natalLagna], ['MOON', m.natalMoon]]) {
    if (!Number.isInteger(s)) continue;
    const house = houseOf(nav, s);
    if ((house === 8 || house === 12) && !friendsOrSame(lord[s], lord[nav])) natal.JOSHI.push({ from, house });
  }

  // Udaya and asta, in the rasi chart (Muhurta Chintamani's own example).
  const seventh = (lagna + 6) % 12;
  const nav7 = (nav + 6) % 12;
  const L1 = lord[lagna]; const LN = lord[nav]; const L7 = lord[seventh]; const LN7 = lord[nav7];
  const at = (p) => m.signs[p];
  const see = (p, t, occupy = true) => sees(p, at(p), t, occupy);
  const friendsOf = (L) => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].filter((p) => p !== L && naturalRelation(L, p) === 'friend');
  const beneficFriends = (lords) => T.BENEFICS.filter((p) => lords.some((L) => p !== L && naturalRelation(L, p) === 'friend'));
  const anyOf = (ps, ts) => ps.some((p) => ts.some((t) => see(p, t)));
  const udaya = {
    SHRIDHAR: {
      udaya: see(L1, lagna) || see(LN, lagna) || see(L7, seventh, false)
        || beneficFriends([L1, LN, L7]).some((p) => see(p, lagna, false) || see(p, nav, false))
        || [LN, ...friendsOf(LN), ...T.BENEFICS].some((p) => at(p) === nav) || T.BENEFICS.some((p) => see(p, nav, false)),
      asta: see(LN7, nav7) || see(LN7, seventh) || see(L1, lagna, false)
        || beneficFriends([L7, LN7, L1]).some((p) => see(p, seventh, false) || see(p, nav7, false)),
    },
    MUHURTA_CHINTAMANI: { udaya: see(LN, nav) || see(LN, lagna), asta: see(LN7, nav7) || see(LN7, seventh, false) },
    ANY_OF_FOUR: { udaya: anyOf([L1, LN], [lagna, nav]), asta: anyOf([L7, LN7], [seventh, nav7]) },
  };

  return { n108: m.n108, nav, num, varg, half: m.half, last, which, natal, udaya };
}

/** The lagna's verdict under the chosen readings (the page uses the same rule). `nv` is the navamsa's, when given. */
function lagnaVerdict(l, chosen, nv = null) {
  const reasons = [];
  const pl = l.placements[chosen.PLACEMENTS];
  if (!pl.pass) reasons.push('PLACEMENTS');
  if (l.ashtama[chosen.ASHTAMA].length) reasons.push('ASHTAMA');
  if (l.pdb.present) reasons.push('PDB');
  if (l.kartari[chosen.KARTARI]) reasons.push('KARTARI');
  if (l.gandanta[chosen.GANDANTA]) reasons.push('GANDANTA');
  if (chosen.banaByLagna && l.banaMrityu) reasons.push('BANA');
  if (nv) {
    if (nv.last[chosen.NAV_LAST].length) reasons.push('NAV_LAST');
    if (!nv.which[chosen.NAV_WHICH]) reasons.push('NAV_WHICH');
    if (nv.natal[chosen.NAV_NATAL].length) reasons.push('NAV_NATAL');
    const u = nv.udaya[chosen.UDAYA];
    if (!u.udaya || !u.asta) reasons.push('UDAYA');
  }
  return { ok: reasons.length === 0, reasons };
}

module.exports = { lagnaShuddhiOf, lagnaVerdict, navamsaOf, placementsOf, pointsOf, ashtamaOf, pdbOf, kartariOf, houseOf, friendsOrSame, sees };
