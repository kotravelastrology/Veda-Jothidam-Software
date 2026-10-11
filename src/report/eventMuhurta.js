/**
 * An event's own muhurta rules for one moment, book by book (tables in
 * `eventMuhurtaTables.js`). Pure. A reading's result is a list of codes: the
 * ones ending in `_MID` mark a middling or preferred point and do not reject.
 *
 *   panchangaCodes(reading, { star, tithi, month, sunSign, sunStar })   for a piece of the period
 *   varaCodes(reading, vara)                                             for a weekday
 *   lagnaCodes(reading, { lagna, nav, signs, natalLagna, natalMoon, combust })   for a lagna stretch
 *   doorCodes(reading, door, { tithi, star, sunHouse })                 the door's own rules
 */

const E = require('./eventMuhurtaTables');

const BENEFICS = Object.freeze(['Mercury', 'Jupiter', 'Venus']);
const MALEFICS = Object.freeze(['Sun', 'Mars', 'Saturn']);
const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);
const BENEFIC_NAVS = Object.freeze([1, 2, 3, 5, 6, 8, 11]); // the signs of the Moon, Mercury, Jupiter and Venus
const MOVABLE = Object.freeze([0, 3, 6, 9]);
const UTTARAYANA = Object.freeze([9, 10, 11, 0, 1, 2]); // the Sun in Capricorn … Gemini
const houseOf = (sign, from) => ((sign - from + 12) % 12) + 1;
/** The Moon's star counted from the Sun's (the Sun's star is the 1st). */
const kumbhaCount = (sunStar, star) => ((star - sunStar + 27) % 27) + 1;
const inPaksha = (tithi) => ((tithi - 1) % 15) + 1;

function panchangaCodes(r, x) {
  const out = [];
  if (r.masa) {
    if (r.masa.mid.includes(x.month)) out.push('MASA_MID');
    else if (!r.masa.good.includes(x.month)) out.push(r.masa.strict ? 'MASA' : 'MASA_MID');
  }
  if (r.uttarayana && !UTTARAYANA.includes(x.sunSign)) out.push(r.uttarayana === 'REQUIRED' ? 'UTTARAYANA' : 'UTTARAYANA_MID');
  if (r.nak) {
    if (r.nak.mid.includes(x.star)) out.push('NAK_MID');
    else if (!r.nak.good.includes(x.star)) out.push('NAK');
  }
  if (r.tithi && !r.tithi.includes(x.tithi)) out.push('TITHI');
  if (r.kumbha && !r.kumbha.includes(kumbhaCount(x.sunStar, x.star))) out.push('KUMBHA');
  return out;
}

function varaCodes(r, vara) {
  if (!r.vara) return [];
  if (r.vara.mid.includes(vara)) return ['VARA_MID'];
  return r.vara.good.includes(vara) ? [] : ['VARA'];
}

function lagnaCodes(r, m) {
  const out = [];
  const H = Object.fromEntries(PLANETS.map((p) => [p, houseOf(m.signs[p], m.lagna)]));
  const L = r.lagna;
  if (L) {
    const fromNatal = [L.alt?.from === 'MOON' ? null : m.natalLagna, m.natalMoon].filter(Number.isInteger);
    const upachaya = L.alt && fromNatal.some((s) => L.alt.houses.includes(houseOf(m.lagna, s)));
    const movableOk = MOVABLE.includes(m.lagna) && (
      (L.movable === 'NAV_TAURUS' && m.nav === 1)
      || (L.movable === 'BENEFIC_NAV_AND_UPACHAYA' && BENEFIC_NAVS.includes(m.nav) && [m.natalLagna, m.natalMoon].filter(Number.isInteger).some((s) => [3, 6, 10, 11].includes(houseOf(m.lagna, s)))));
    if (L.mid.includes(m.lagna)) out.push('LAGNA_MID');
    else if (!L.good.includes(m.lagna) && !(upachaya && !(L.alt.notMovable && MOVABLE.includes(m.lagna))) && !movableOk) out.push('LAGNA');
  }
  if (r.nav === 'BENEFIC' && !BENEFIC_NAVS.includes(m.nav)) out.push('NAV');
  for (const h of r.empty ?? []) if (PLANETS.some((p) => H[p] === h)) out.push(`EMPTY_${h}`);
  for (const h of r.emptyPref ?? []) if (PLANETS.some((p) => H[p] === h)) out.push(`EMPTY_${h}_MID`);
  // The books' best places for every benefic and malefic: marked, not rejecting (our reading — all three
  // of each in them at once is rare; the owner decides).
  if (r.beneficIn && BENEFICS.some((p) => !r.beneficIn.includes(H[p]))) out.push('BENEFIC_PLACE_MID');
  if (r.maleficIn && MALEFICS.some((p) => !r.maleficIn.includes(H[p]))) out.push('MALEFIC_PLACE_MID');
  if (r.beneficKendra && !BENEFICS.some((p) => [1, 4, 7, 10].includes(H[p]))) out.push('BENEFIC_KENDRA');
  if (r.moonNot && r.moonNot.includes(H.Moon)) out.push('MOON_PLACE');
  if (r.jupVenNotSet && (m.combust.Jupiter || m.combust.Venus)) out.push('JUP_VEN_SET');
  return out;
}

function doorCodes(r, door, x) {
  if (!door) return [];
  const out = [];
  if (r.tithiDoor && !E.DOORS.tithi[door].includes(inPaksha(x.tithi))) out.push('TITHI_DOOR');
  if (r.sunLeft && !E.DOORS.sun[door].includes(x.sunHouse)) out.push('SUN_LEFT');
  return out;
}

/** With the door's stars good too (digdwar), the star code may fall away. */
function withDoorStars(r, door, codes, star) {
  if (!door || !r.digdwar || !E.DOORS.stars[door].includes(star)) return codes;
  return codes.filter((c) => c !== 'NAK' && c !== 'NAK_MID');
}

/** All readings of an event for a piece: { book: codes }. */
const piecesCodesOf = (event, x) => Object.fromEntries(E.EVENTS[event].order.map((b) => [b, panchangaCodes(E.EVENTS[event][b], x)]));
/** All readings for a lagna stretch, the weekday's codes with them. */
const stretchCodesOf = (event, m, vara) => Object.fromEntries(E.EVENTS[event].order.map((b) => [b, [...varaCodes(E.EVENTS[event][b], vara), ...lagnaCodes(E.EVENTS[event][b], m)]]));

const rejects = (codes) => codes.filter((c) => !c.endsWith('_MID'));

module.exports = {
  panchangaCodes, varaCodes, lagnaCodes, doorCodes, withDoorStars, piecesCodesOf, stretchCodesOf, rejects,
  kumbhaCount, inPaksha, houseOf, UTTARAYANA,
};
