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

/** The lagna's verdict under the chosen readings (the page uses the same rule). */
function lagnaVerdict(l, chosen) {
  const reasons = [];
  const pl = l.placements[chosen.PLACEMENTS];
  if (!pl.pass) reasons.push('PLACEMENTS');
  if (l.ashtama[chosen.ASHTAMA].length) reasons.push('ASHTAMA');
  if (l.pdb.present) reasons.push('PDB');
  if (l.kartari[chosen.KARTARI]) reasons.push('KARTARI');
  if (l.gandanta[chosen.GANDANTA]) reasons.push('GANDANTA');
  if (chosen.banaByLagna && l.banaMrityu) reasons.push('BANA');
  return { ok: reasons.length === 0, reasons };
}

module.exports = { lagnaShuddhiOf, lagnaVerdict, placementsOf, pointsOf, ashtamaOf, pdbOf, kartariOf, houseOf, friendsOrSame };
