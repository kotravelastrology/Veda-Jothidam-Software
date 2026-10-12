/**
 * An event's own muhurta rules for one moment, book by book (tables in
 * `eventMuhurtaTables.js`). Pure. A reading's result is a list of codes: the
 * ones ending in `_MID` mark a middling or preferred point and do not reject.
 *
 *   panchangaCodes(reading, { star, tithi, month, sunSign, sunStar, sunDeg, yoga, vishti, sankranti,
 *     taraCount, signs, navs, moonPada, natalMoon, vedha, bana })        for a piece of the period
 *   varaCodes(reading, vara, { combust, tithi })                         for a weekday
 *   lagnaCodes(reading, { lagna, nav, signs, natalLagna, natalMoon, combust, dayPart, pradosha,
 *     tithi, star, vara })                                               for a lagna stretch
 *   doorCodes(reading, door, { tithi, star, sunHouse })                 the door's own rules
 */

const E = require('./eventMuhurtaTables');
const { RASI_LORDS } = require('./lagnaShuddhiTables');

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

/** Harishayana: Ashadha Shukla 11 to Kartika Shukla 11 (amanta months; Joshi, Kalyanraman, Agarwal). */
const inHarishayana = (month, tithi) => (month === 3 && tithi >= 11) || (month > 3 && month < 7) || (month === 7 && tithi < 11);
/** The Vishti karana (Shridhar §6.3): the half-tithi k = elongation / 6° (0-59) is Vishti at 7, 14, … 56. */
const isVishti = (k) => k >= 1 && k <= 56 && (k - 1) % 7 === 6;

/**
 * Jupiter's transit from the birth Moon's sign (the books' Guru bala) under a reading: [] (good),
 * ['GURU_MID'] (with propitiation, or struck by vedha) or ['GURU']. `x.navs.Jupiter` is his navamsa.
 */
function guruCodes(g, x) {
  if (g.chaitra === 'ANY' && x.month === 0) return [];
  if (g.chaitra === 'PISCES' && x.month === 0 && x.sunSign === 11) return [];
  const sign = x.signs.Jupiter;
  const nav = x.navs.Jupiter;
  const varg = sign === nav;
  const ok = (g.okSigns ?? []).includes(sign) || (g.okNavs ?? []).includes(nav) || (g.vargottama && varg)
    || (g.okSignNav && g.okSignNav.signs.includes(sign) && (g.okSignNav.navs.includes(nav) || (g.okSignNav.vargottama && varg)));
  if (ok) return [];
  if ((g.badSigns ?? []).includes(sign) || (g.badNavs ?? []).includes(nav)) return ['GURU'];
  const h = houseOf(sign, x.natalMoon);
  if (g.good.includes(h)) {
    const v = g.vedha?.[h];
    return v && PLANETS.some((p) => p !== 'Jupiter' && houseOf(x.signs[p], x.natalMoon) === v) ? ['GURU_MID'] : [];
  }
  return g.mid.includes(h) ? ['GURU_MID'] : ['GURU'];
}

/** The Sun's transit from the birth Moon's sign under a reading (Shridhar §17.9.8, Kalyanraman's table). */
function raviCodes(r, x) {
  const sign = x.signs.Sun;
  const nav = x.navs.Sun;
  if ((r.okSigns ?? []).includes(sign) || (r.okNavs ?? []).includes(nav) || (r.vargottama && sign === nav)) return [];
  const h = houseOf(sign, x.natalMoon);
  let code = null;
  if (r.good.includes(h)) {
    const v = r.vedha?.[h];
    if (v && PLANETS.some((p) => p !== 'Sun' && !(r.vedhaFree ?? []).includes(p) && houseOf(x.signs[p], x.natalMoon) === v)) code = 'RAVI_MID';
  } else code = r.mid.includes(h) ? 'RAVI_MID' : 'RAVI';
  // After the 13th day of the Sun's month, if the next sign is a good place (our reading: the Sun's 13th degree).
  if (code && r.after13 && r.after13.includes(h) && x.sunDeg >= 13 && r.good.includes((h % 12) + 1)) code = null;
  return code ? [code] : [];
}

function panchangaCodes(r, x) {
  const out = [];
  if (r.masa) {
    if (r.masa.mid.includes(x.month)) out.push('MASA_MID');
    else if (!r.masa.good.includes(x.month)) out.push(r.masa.strict ? 'MASA' : 'MASA_MID');
  }
  if (r.uttarayana && !UTTARAYANA.includes(x.sunSign)) out.push(r.uttarayana === 'REQUIRED' ? 'UTTARAYANA' : 'UTTARAYANA_MID');
  if (r.sunSign) {
    if (r.sunSign.mid.includes(x.sunSign)) out.push('SUN_SIGN_MID');
    else if (!r.sunSign.good.includes(x.sunSign)) out.push('SUN_SIGN');
  }
  if (r.harishayana && inHarishayana(x.month, x.tithi)) out.push('HARISHAYANA');
  if (r.nak) {
    if (r.nak.mid.includes(x.star)) out.push('NAK_MID');
    else if (!r.nak.good.includes(x.star)) out.push('NAK');
  }
  if (r.tithi) {
    if (r.tithiMid && r.tithiMid.includes(x.tithi)) out.push('TITHI_MID');
    else if (!r.tithi.includes(x.tithi)) out.push('TITHI');
  }
  if (r.anadhyaya) {
    const A = r.anadhyaya;
    if (A.tithis.includes(x.tithi) || A.months.some(([m, t]) => m === x.month && t === x.tithi)) out.push('ANADHYAYA');
    if (A.sankranti && x.sankranti) out.push('SANKRANTI');
  }
  if (r.galagraha && E.GALAGRAHA.includes(x.tithi)) out.push('GALAGRAHA');
  if (r.taraNot && r.taraNot.includes(x.taraCount)) out.push('TARA_NOT');
  else if (r.taraMid && r.taraMid.includes(x.taraCount)) out.push('TARA_MID');
  if (r.yogaNot && r.yogaNot.includes(x.yoga)) out.push('YOGA');
  if (r.vishti && x.vishti) out.push('VISHTI');
  if (r.vedha && x.vedha?.[r.vedha]) out.push('VEDHA');
  if (r.bana && x.bana) out.push('BANA');
  if (r.kumbha && !r.kumbha.includes(kumbhaCount(x.sunStar, x.star))) out.push('KUMBHA');
  if (r.guru) out.push(...guruCodes(r.guru, x));
  if (r.ravi) out.push(...raviCodes(r.ravi, x));
  if (r.chandra) {
    const h = houseOf(x.signs.Moon, x.natalMoon);
    if (r.chandra.mid.includes(h)) out.push('CHANDRA_MID');
    else if (!r.chandra.good.includes(h)) out.push('CHANDRA');
  }
  // The Moon's navamsa (a pada's navamsa sign); the 4th quarters of Punarvasu and Shravana (padas 27, 87) excepted.
  for (const [rule, code] of [[r.moonNav, 'MOON_NAV'], [r.moonNavMid, 'MOON_NAV_MID']]) {
    if (rule && rule.not.includes(x.navs.Moon) && !(rule.quarters && [27, 87].includes(x.moonPada))) out.push(code);
  }
  if (r.conj && r.conj.planets.some((p) => r.conj.with.some((q) => q !== p && x.signs[q] === x.signs[p]))) out.push('CONJ');
  // The 8th from the birth Moon's sign and from the Moon's: no planet but Venus.
  const others = PLANETS.filter((p) => p !== 'Venus');
  if (r.natal8 && others.some((p) => houseOf(x.signs[p], x.natalMoon) === 8)) out.push('NATAL_8');
  if (r.moon8 && others.some((p) => p !== 'Moon' && houseOf(x.signs[p], x.signs.Moon) === 8)) out.push('MOON_8');
  // Agarwal: Jupiter exalted, in own sign or navamsa, a friend's sign (the Sun's, the Moon's, Mars's), or vargottama.
  if (r.jupStrong) {
    const s = x.signs.Jupiter;
    const n = x.navs.Jupiter;
    if (![3, 8, 11, 0, 4, 7].includes(s) && ![8, 11].includes(n) && s !== n) out.push('JUP_WEAK');
  }
  return out;
}

function varaCodes(r, vara, m = {}) {
  if (!r.vara) return [];
  const out = [];
  if (r.vara.mid.includes(vara)) out.push('VARA_MID');
  else if (!r.vara.good.includes(vara)) out.push('VARA');
  if (r.wedCombust && vara === 3 && m.combust?.Mercury) out.push('WED_COMBUST');
  if (r.monKrishna && vara === 1 && m.tithi > 15) out.push('MON_KRISHNA');
  return out;
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
  // Upanayana and later events: the lagna's navamsa, the 8th but for Venus, planets kept out of houses.
  if (r.navGood && !r.navGood.includes(m.nav)) out.push('NAV');
  if (r.navMid && !r.navMid.includes(m.nav)) out.push('NAV_MID');
  for (const [h, allowed] of Object.entries(r.emptyBut ?? {})) {
    if (PLANETS.some((p) => H[p] === Number(h) && !allowed.includes(p))) out.push(`EMPTY_${h}`);
  }
  const lord = RASI_LORDS[m.lagna];
  // The Moon in the lagna excepted: in Taurus or Cancer (exalted, own), or in Cancer with Jupiter and the malefics in 3, 6, 11.
  const moonExcepted = (r.moonLagna === 'OWN_EXALTED' && [1, 3].includes(m.lagna))
    || (r.moonLagna === 'CANCER_JUPITER' && m.lagna === 3 && H.Jupiter === 1 && MALEFICS.every((p) => [3, 6, 11].includes(H[p])));
  const seen = new Set();
  for (const [planets, houses, mid] of r.notIn ?? []) {
    for (const p of planets) {
      const h = p === 'LAGNA_LORD' ? H[lord] : H[p];
      if (!houses.includes(h) || (p === 'Moon' && h === 1 && moonExcepted)) continue;
      const code = `IN_${p}_${h}${mid ? '_MID' : ''}`;
      if (!seen.has(code)) { seen.add(code); out.push(code); }
    }
  }
  if (r.dayParts) {
    if (m.dayPart === 0) out.push('NIGHT');
    else if (r.dayParts.mid.includes(m.dayPart)) out.push('DAY_PART_MID');
    else if (!r.dayParts.good.includes(m.dayPart)) out.push('DAY_PART');
  }
  if (r.pradosha && m.pradosha) out.push('PRADOSHA');
  // Rangacharya's vimsopaka: a planet in a good place adds its share, in an evil place takes it away.
  if (r.points) {
    const P = r.points;
    const pts = Object.keys(P.vimsi).reduce((s, p) => s + (P.good[p].includes(H[p]) ? P.vimsi[p] : P.bad[p].includes(H[p]) ? -P.vimsi[p] : 0), 0);
    if (pts < P.min) out.push('POINTS');
    else if (pts < P.mid) out.push('POINTS_MID');
  }
  // Agarwal's tithi panchaka: tithi (1-30) + weekday (Sunday 1) + star (Ashwini 1) + lagna (Aries 1), remainder 8 by 9.
  if (r.panchaka && (m.tithi + (m.vara + 1) + (m.star + 1) + (m.lagna + 1)) % 9 === 8) out.push('ROGA_PANCHAKA');
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
const stretchCodesOf = (event, m, vara) => Object.fromEntries(E.EVENTS[event].order.map((b) => [b, [...varaCodes(E.EVENTS[event][b], vara, m), ...lagnaCodes(E.EVENTS[event][b], { ...m, vara })]]));

const rejects = (codes) => codes.filter((c) => !c.endsWith('_MID'));

module.exports = {
  panchangaCodes, varaCodes, lagnaCodes, doorCodes, withDoorStars, piecesCodesOf, stretchCodesOf, rejects,
  guruCodes, raviCodes, inHarishayana, isVishti, kumbhaCount, inPaksha, houseOf, UTTARAYANA,
};
