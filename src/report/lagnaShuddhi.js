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
 *   tithi        1-30, for Bana by tithi and lagna and the Moon's nature (Wilhelm)
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

/**
 * The lagna for any auspicious act: for each book's reading, the conditions that fail
 * (none = it passes). Benefics Mercury, Jupiter, Venus; aspects full, in the rasi chart.
 */
function commonOf(m, houses) {
  const H = houses;
  const lord = T.RASI_LORDS;
  const occupied = (h) => T.PLANETS.some((p) => H[p] === h);
  const seesLagna = (p) => H[p] === 1 || sees(p, m.signs[p], m.lagna, false);
  const upFrom = [m.natalLagna, m.natalMoon].filter(Number.isInteger).map((s) => T.UPACHAYA.includes(houseOf(m.lagna, s)));
  const empty812 = [occupied(8) && 'OCC_8', occupied(12) && 'OCC_12'];
  const mc = (both) => [
    !(both ? upFrom.length > 0 && upFrom.every(Boolean) : upFrom.some(Boolean)) && 'NOT_UPACHAYA',
    ...empty812,
    !T.BENEFICS.some(seesLagna) && 'NO_BENEFIC',
    !T.UPACHAYA.includes(H.Moon) && 'MOON_NOT_UPACHAYA',
  ].filter(Boolean);

  // Wilhelm: the Moon is a malefic within 60° of the Sun (tithis 1-5 and 26-30).
  const moonMalefic = m.tithi <= 5 || m.tithi >= 26;
  const goodSign = T.BENEFIC_SIGNS.includes(m.lagna) && !(m.lagna === 3 && moonMalefic);
  const jupVen = ['Jupiter', 'Venus'].some((p) => m.signs[p] !== T.DEBILITATED[p] && seesLagna(p));
  const jupSign = m.signs.Jupiter;
  const jupDignified = jupSign === 3 || lord[jupSign] === 'Jupiter' || naturalRelation('Jupiter', lord[jupSign]) === 'friend';
  const jupAngle = T.KENDRA.includes(H.Jupiter) && jupDignified;
  const moonUp = [3, 10, 11].includes(H.Moon);
  const maleficIn1 = T.MALEFICS.some((p) => H[p] === 1) && !((H.Venus === 10 || H.Moon === 10) && T.KENDRA.includes(H.Jupiter));
  const wilhelm = [
    !(goodSign || jupVen || jupAngle || moonUp) && (T.BENEFIC_SIGNS.includes(m.lagna) ? 'CANCER_MOON' : 'MALEFIC_SIGN'),
    maleficIn1 && 'MALEFIC_IN_LAGNA',
    ...empty812,
  ].filter(Boolean);

  const varahamihira = [
    T.BENEFICS.some((p) => ![1, 4, 7, 8, 10, 12].includes(H[p])) && 'BENEFIC_PLACE',
    T.MALEFICS_SEVEN.some((p) => ![3, 6, 11].includes(H[p])) && 'MALEFIC_PLACE',
    !['Jupiter', 'Venus'].some((p) => [1, 4, 7, 10, 5, 9].includes(H[p])) && 'NO_JUP_VEN',
  ].filter(Boolean);

  // Agarwal: the lagna, or failing it the transiting Moon, in an upachaya from the birth lagna or Moon.
  const moonFrom = [m.natalLagna, m.natalMoon].filter(Number.isInteger).some((s) => T.UPACHAYA.includes(houseOf(m.signs.Moon, s)));
  const h8 = (m.lagna + 7) % 12; const h12 = (m.lagna + 11) % 12;
  const agarwal = [
    ...empty812,
    T.MALEFICS_SEVEN.some((p) => sees(p, m.signs[p], h8, false) || sees(p, m.signs[p], h12, false)) && 'AFFLICT_8_12',
    T.BENEFICS.some((p) => [6, 8, 12].includes(H[p])) && 'BENEFIC_DUSTHANA',
    T.MALEFICS_SEVEN.some((p) => !T.UPACHAYA.includes(H[p])) && 'MALEFIC_NOT_UPACHAYA',
    !(upFrom.some(Boolean) || moonFrom) && 'NOT_UPACHAYA',
  ].filter(Boolean);

  const raman = [
    [6, 8, 12].includes(H.Moon) && 'MOON_6_8_12',
    T.PLANETS.some((p) => p !== 'Moon' && H[p] === H.Moon) && 'MOON_WITH',
    H.Venus === 6 && 'VENUS_6',
    H.Mars === 8 && 'MARS_8',
  ].filter(Boolean);

  return { WILHELM: wilhelm, SHRIDHAR: mc(false), MUHURTA_CHINTAMANI: mc(true), VARAHAMIHIRA: varahamihira, AGARWAL: agarwal, RAMAN: raman };
}

function lagnaShuddhiOf(m) {
  const houses = Object.fromEntries(T.PLANETS.map((p) => [p, houseOf(m.signs[p], m.lagna)]));
  const lagnaLordHouse = houses[T.RASI_LORDS[m.lagna]];
  return {
    lagna: m.lagna,
    houses,
    placements: placementsOf(houses, lagnaLordHouse),
    common: commonOf(m, houses),
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

// ---------------------------------------------------------------------------
// Shadvarga, decanate, the poison portions
// ---------------------------------------------------------------------------

/**
 * Where a lagna longitude falls in the six vargas and the portions the rules
 * use: sign, hora (0-1), drekkana (0-2), navamsa (n108), dwadasamsa (0-11),
 * trimsamsa (0-4), the half of Sagittarius's navamsa, and the degree zone
 * (0 the first 3°, 2 13°30′-16°30′, 4 the last 3°; 1, 3 between).
 */
function vargaIndices(lon) {
  const l = norm360(lon);
  const sign = Math.floor(l / 30) % 12;
  const deg = l - sign * 30;
  const n108 = Math.floor(l / (10 / 3)) % 108;
  const odd = sign % 2 === 0;
  const ends = (odd ? T.TRIMSAMSA.ODD : T.TRIMSAMSA.EVEN).ends;
  return {
    sign, n108,
    d2: deg < 15 ? 0 : 1,
    d3: Math.min(2, Math.floor(deg / 10)),
    d12: Math.min(11, Math.floor(deg / 2.5)),
    d30: ends.findIndex((e) => deg < e),
    half: n108 % 12 === 8 && l - n108 * (10 / 3) >= 5 / 3 ? 1 : 0,
    zone: deg < 3 ? 0 : deg < 13.5 ? 1 : deg < 16.5 ? 2 : deg < 27 ? 3 : 4,
  };
}

/** The six vargas' lords and the readings on how many must be benefic. */
function shadvargaOf(v) {
  const lord = T.RASI_LORDS;
  const odd = v.sign % 2 === 0;
  const lords = {
    D1: lord[v.sign],
    D2: (v.d2 === 0) === odd ? 'Sun' : 'Moon',
    D3: lord[(v.sign + [0, 4, 8][v.d3]) % 12],
    D9: lord[v.n108 % 12],
    D12: lord[(v.sign + v.d12) % 12],
    D30: (odd ? T.TRIMSAMSA.ODD : T.TRIMSAMSA.EVEN).lords[v.d30],
  };
  const benefic = T.VARGAS.filter((k) => T.VARGA_BENEFICS.includes(lords[k])).length;
  const navBenefic = T.VARGA_BENEFICS.includes(lords.D9);
  const readings = Object.fromEntries(T.SHADVARGA.order.map((id) => {
    const r = T.SHADVARGA[id];
    const pass = r.tieNavamsa ? benefic >= 4 || (benefic === 3 && navBenefic) : benefic >= r.min;
    return [id, pass];
  }));
  return { lords, benefic, readings };
}

/** The lagna's decanate: Shridhar's malefic ones and its nature. */
function drekkanaOf(v) {
  const malefic = T.DREKKANA_MALEFIC[`${v.sign}:${v.d3}`] ?? null;
  const kind = T.MOVABLE.includes(v.sign) ? 'MOVABLE' : T.DUAL.includes(v.sign) ? 'DUAL' : 'FIXED';
  const nature = T.DREKKANA_NATURE[kind][v.d3];
  return {
    num: v.d3 + 1, malefic, nature,
    readings: { MALEFIC: Boolean(malefic), MALEFIC_INAUSPICIOUS: Boolean(malefic) || nature === 'INAUSPICIOUS', AUSPICIOUS_ONLY: Boolean(malefic) || nature !== 'AUSPICIOUS' },
  };
}

/**
 * The poison portions: true where the lagna is in one under each reading.
 *   v       vargaIndices of the lagna
 *   vara    weekday at the place (sunrise to sunrise), 0 = Sunday
 *   ghati   { first, middle, last }: within the first, middle or last 12 minutes of the sign's rising
 */
function vishanadiOf(v, vara, ghati) {
  const num = (v.n108 % 9) + 1;
  const [A, B, C] = T.VISHANADI.WILHELM.groups;
  return {
    WILHELM: T.VISHANADI.WILHELM.groups.some((g) => g.signs.includes(v.sign) && g.nav === num && g.days.includes(vara)),
    DEGREES: (A.signs.includes(v.sign) && v.zone === 0) || (B.signs.includes(v.sign) && v.zone === 2) || (C.signs.includes(v.sign) && v.zone === 4),
    AGARWAL_DAYS: T.VISHANADI.WILHELM.groups.some((g) => g.nav === num && g.days.includes(vara)),
    HALF_GHATI: (A.signs.includes(v.sign) && ghati.first) || (B.signs.includes(v.sign) && ghati.middle) || (C.signs.includes(v.sign) && ghati.last),
  };
}

/**
 * The lagna's verdict under the chosen readings (the page uses the same rule). `nv` is the navamsa's,
 * `va` the shadvarga with its decanate ({ ...shadvargaOf, drekkana: drekkanaOf }), `visha` vishanadiOf — each when given.
 */
function lagnaVerdict(l, chosen, nv = null, va = null, visha = null) {
  const event = T.EVENTS[chosen.EVENT ?? T.EVENTS.default];
  const on = (k) => event.checks.includes(k);
  // A reading the event does not take falls back to the first it does.
  const r = (k) => (event.only[k] && !event.only[k].includes(chosen[k]) ? event.only[k][0] : chosen[k]);
  const reasons = [];
  if (on('PLACEMENTS') && !l.placements[r('PLACEMENTS')].pass) reasons.push('PLACEMENTS');
  if (on('COMMON') && l.common[r('COMMON')].length) reasons.push('COMMON');
  if (l.ashtama[r('ASHTAMA')].length) reasons.push('ASHTAMA');
  if (l.pdb.present) reasons.push('PDB');
  if (l.kartari[r('KARTARI')]) reasons.push('KARTARI');
  if (l.gandanta[r('GANDANTA')]) reasons.push('GANDANTA');
  if (chosen.banaByLagna && l.banaMrityu) reasons.push('BANA');
  if (nv) {
    if (on('NAV_LAST') && nv.last[r('NAV_LAST')].length) reasons.push('NAV_LAST');
    if (!nv.which[r('NAV_WHICH')]) reasons.push('NAV_WHICH');
    if (on('NAV_NATAL') && nv.natal[r('NAV_NATAL')].length) reasons.push('NAV_NATAL');
    const u = nv.udaya[r('UDAYA')];
    if (!u.udaya || !u.asta) reasons.push('UDAYA');
  }
  if (va) {
    if (!va.readings[r('SHADVARGA')]) reasons.push('SHADVARGA');
    if (va.drekkana.readings[r('DREKKANA')]) reasons.push('DREKKANA');
  }
  if (visha && visha[r('VISHANADI')]) reasons.push('VISHANADI');
  return { ok: reasons.length === 0, reasons };
}

module.exports = {
  lagnaShuddhiOf, lagnaVerdict, navamsaOf, vargaIndices, shadvargaOf, drekkanaOf, vishanadiOf,
  placementsOf, pointsOf, ashtamaOf, pdbOf, kartariOf, commonOf, houseOf, friendsOrSame, sees,
};
