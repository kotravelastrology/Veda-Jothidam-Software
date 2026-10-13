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
 *
 * Travel adds, for a piece: dir (0 = east … 7 = north-east, clockwise; null without a direction),
 * starFrac (how far into its star the Moon is), yogaHalf (0-53), rahuCount (the Moon's star from
 * Rahu's, Abhijit counted, 1-28), venus { east, sign, star }, natalLagna; for a stretch: dir,
 * nightPart (1-3, 0 by day), ghatis (since sunrise), abhijitMuhurta, retro, abhijit (the Moon in it).
 */

const E = require('./eventMuhurtaTables');
const { RASI_LORDS } = require('./lagnaShuddhiTables');

const DIR8 = E.DIRECTIONS.order;
/** A four-direction rule over eight: the corner after each takes its rule (Shridhar p.613). */
const dir4Of = (d) => d - (d % 2);
/** Where something lies for one going in a direction: 0 in front, 2 on the right, 4 behind, 6 on the left. */
const relOf = (obj, dir) => (obj - dir + 8) % 8;
/** Two halves (ayana, Parigha): east, south-east, north, north-east against south, south-west, west, north-west. */
const halfOf = (d) => ([0, 1, 6, 7].includes(d) ? 0 : 1);
/** A sign's direction: fire east, earth south, air west, water north. */
const signDir = (s) => [0, 2, 4, 6][s % 4];
/** A star's quarter of the sky (MC XI.36-40): Krittika-Ashlesha east, Magha-Vishakha south, Anuradha-Shravana west, Dhanishtha-Bharani north. */
const starDir = (s) => (s >= 2 && s <= 8 ? 0 : s >= 9 && s <= 15 ? 2 : s >= 16 && s <= 21 ? 4 : 6);
/** The house's direction in the chart (Lalatika, Shridhar's method b): the lagna east, the 10th south, the 7th west, the 4th north. */
const HOUSE_DIR = Object.freeze([null, 0, 7, 7, 6, 5, 5, 4, 3, 3, 2, 1, 1]);
/** Kaala's direction by day, by weekday (Sunday north, then back round); Paasha opposite; at night they change places. */
const KAALA_DAY = Object.freeze([6, 5, 4, 3, 2, 1, 0]);
/** Vaar Rahu (Shridhar §23.13.5, Vashistha): by weekday. */
const VAAR_RAHU = Object.freeze([4, 1, 5, 6, 2, 3, 7]);
const VARA_LORDS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
/** The tithi as the direction tables write it: within the paksha, 15 the full Moon, 30 the new. */
const tithiKey = (t) => (t === 15 || t === 30 ? t : ((t - 1) % 15) + 1);
/** 0 Nanda, 1 Bhadra, 2 Jaya, 3 Rikta, 4 Poorna. */
const tithiClass = (t) => (((t - 1) % 15) % 5);
const inMap = (map, dir, v) => Boolean(map && map[DIR8[dir]] && map[DIR8[dir]].includes(v));
/** The Moon in Revati to Krittika's first quarter: Venus is blind (MC XI.42; Wilhelm "Revati or Aries"). */
const venusBlind = (moonPada) => moonPada >= 104 || moonPada <= 8;
const KENDRA_HOUSES = Object.freeze([1, 4, 7, 10]);

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
/** The fixed karanas: Kimstughna (k = 0, Shukla 1's first half), Shakuni, Chatushpada, Naga (57-59, Krishna 14's second half and the new Moon). */
const isSthiraKarana = (k) => k === 0 || k >= 57;

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
    // A cruel star after its first ghatis (of 60): middling, for need (MC XI.12). Abhijit counts where a book names it.
    else if (!r.nak.good.includes(x.star) && !(r.abhijitOk && x.moonAbhijit)) out.push(r.nakAfter?.[x.star] === undefined ? 'NAK' : x.starFrac < r.nakAfter[x.star] / 60 - 1e-9 ? 'NAK_GHATI' : 'NAK_LATE_MID');
  }
  if (r.pada1Mid && x.moonPada % 4 === 0) out.push('PADA1_MID');
  if (r.krishnaMid && x.tithi > 15) out.push('KRISHNA_MID');
  if (r.tithi) {
    if (r.tithiMid && r.tithiMid.includes(x.tithi)) out.push('TITHI_MID');
    else if (!r.tithi.includes(x.tithi)) out.push(r.tithiNot && !r.tithiNot.includes(x.tithi) ? 'TITHI_MID' : 'TITHI');
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
  if (r.karanaFixed && x.karanaFixed) out.push('STHIRA_KARANA');
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
  out.push(...travelPieceCodes(r, x));
  return out;
}

/** Travel's rules for a piece of the period (the direction rules only with a direction). */
function travelPieceCodes(r, x) {
  const out = [];
  // The middle third of Cancer and Leo (K.P., Wilhelm).
  if (r.sunMidThird && [3, 4].includes(x.sunSign) && x.sunDeg >= 10 && x.sunDeg < 20) out.push('SUN_MID_THIRD');
  if (r.sankranti && x.sankranti) out.push('SANKRANTI');
  if (r.yogaHalfNot && r.yogaHalfNot.includes(x.yogaHalf)) out.push('YOGA');
  if (r.holanta && x.month === 11 && x.tithi <= 15) out.push('HOLANTA');
  if (r.weakMoon && (x.tithi >= 25 || x.tithi <= 5)) out.push('WEAK_MOON');
  const G = r.ghata;
  if (G && Number.isInteger(x.natalMoon)) {
    const n = x.natalMoon;
    if (G.month && G.month[n] === x.month) out.push('GHATA_MONTH');
    if (G.tithi && E.GHATA.tithiClass[n] === tithiClass(x.tithi)) out.push('GHATA_TITHI');
    if (G.nak && G.nak[n] === x.star) out.push('GHATA_NAK');
    if (G.pada && G.pada[n] === x.moonPada) out.push('GHATA_PADA');
    if (G.moon && G.moon[n] === x.signs.Moon) out.push('GHATA_MOON');
  }
  // Rahu's halves: the Moon's star counted from Rahu's (Abhijit in the count): 1 Kartari, 2-14 Jeeva, 15 Grasta, 16-28 Mrita.
  if (r.rahuPaksha && Number.isInteger(x.rahuCount)) {
    if (x.rahuCount >= 16) out.push('RAHU_PAKSHA');
    else if (x.rahuCount === 1 || x.rahuCount === 15) out.push(r.rahuPaksha === 'REJECT' ? 'RAHU_PAKSHA' : 'RAHU_PAKSHA_MID');
  }
  // Mahadala and Bhrama (MC XI.25; Wilhelm): the Moon's star from the Sun's (the Sun's the 1st), by 7.
  if (r.mahadala && [0, 2, 3, 6].includes(kumbhaCount(x.sunStar, x.star) % 7)) out.push('MAHADALA');
  if (r.moonConj && PLANETS.some((p) => p !== 'Moon' && x.signs[p] === x.signs.Moon)) out.push('MOON_CONJ');
  if (r.moonNatal && [x.natalMoon, x.natalLagna].includes(x.signs.Moon)) out.push('MOON_NATAL');
  const d = x.dir;
  if (!Number.isInteger(d)) return out;
  const d4 = dir4Of(d);
  const vasanta = [11, 0].includes(x.sunSign) ? (r.vasanta ?? []) : [];
  const tk = tithiKey(x.tithi);
  if (r.tithiShoola && inMap(r.tithiShoola, d, tk)) out.push('TITHI_SHOOLA');
  // Nanda east, Bhadra south, Jaya west, Poorna north; Rikta and the new Moon any way (Kalaprakasika).
  if (r.tithiDir && (x.tithi === 30 || tithiClass(x.tithi) === 3 || [0, 2, 4, null, 6][tithiClass(x.tithi)] === d4)) out.push('TITHI_DIR');
  if (r.yogini) {
    const at = [];
    if (r.yogini.maps.includes('MC')) at.push(...DIR8.map((_, i) => i).filter((i) => inMap(E.TITHI_DIR8, i, tk)));
    if (r.yogini.maps.includes('KP')) at.push(...DIR8.map((_, i) => i).filter((i) => inMap(E.YOGINI_KP, i, x.tithi)));
    if (at.some((i) => r.yogini.avoid.includes(relOf(i, d)))) out.push('YOGINI');
  }
  if (r.nakShoola && inMap(r.nakShoola, d, x.star) && !vasanta.includes('NAK_SHOOLA')) out.push('NAK_SHOOLA');
  if (r.chandraDir && r.chandraDir.includes(relOf(signDir(x.signs.Moon), d4))) out.push('CHANDRA_DIR');
  if (r.parigha && halfOf(starDir(x.star)) !== halfOf(d) && !r.parigha.free.includes(x.star)) out.push('PARIGHA');
  if (r.venus && x.venus && !venusBlind(x.moonPada)) {
    const V = r.venus;
    const at = [];
    // Rising: east when her longitude is less than the Sun's (Wilhelm, Joshi); Shridhar's print has it the other way.
    if (V.rising) at.push((x.venus.east !== (V.rising === 'PRINTED')) ? 0 : 4);
    if (V.sphere) at.push(x.venus.sign < 6 ? 6 : 2);
    if (V.star) at.push(starDir(x.venus.star));
    if (at.includes(d4)) out.push('VENUS_FRONT');
  }
  if (r.panchakaSouth && [10, 11].includes(x.signs.Moon) && d4 === 2) out.push('PANCHAKA_SOUTH');
  return out;
}

/** Travel's rules for a lagna stretch; `H` the planets' houses from the lagna. */
function travelStretchCodes(r, m, H) {
  const out = [];
  const lord = RASI_LORDS[m.lagna];
  if (r.navNot && r.navNot.includes(m.nav)) out.push('NAV_NOT');
  if (r.lagnaNatal && m.lagna === m.natalLagna) out.push('LAGNA_NATAL');
  if (r.lagnaBirth) {
    const from = r.lagnaBirth.from === 'LAGNA' ? [m.natalLagna] : [m.natalLagna, m.natalMoon];
    if (from.filter(Number.isInteger).some((s) => r.lagnaBirth.houses.includes(houseOf(m.lagna, s)))) out.push('LAGNA_BIRTH');
  }
  if (r.lordsInLagna && r.lordsInLagna.some((h) => H[RASI_LORDS[(m.lagna + h - 1) % 12]] === 1)) out.push('LORD_IN_LAGNA');
  if (r.kendras) {
    const ben = BENEFICS.some((p) => KENDRA_HOUSES.includes(H[p]));
    const mal = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'].some((p) => KENDRA_HOUSES.includes(H[p]));
    if (!ben) out.push(mal ? 'KENDRA_MALEFIC' : 'KENDRA_NO_BENEFIC');
    else if (mal) out.push('KENDRA_MIXED_MID');
  }
  const retro = m.retro ?? {};
  const combust = m.combust ?? {};
  if (r.retroKendra && Object.keys(retro).some((p) => retro[p] && KENDRA_HOUSES.includes(H[p]))) out.push('RETRO_KENDRA');
  if (r.varaLordRetro && retro[VARA_LORDS[m.vara]]) out.push('VARA_LORD_RETRO');
  if (r.varaLordSet && combust[VARA_LORDS[m.vara]]) out.push('VARA_LORD_SET');
  if (r.lagnaLordRetro && retro[lord]) out.push('LAGNA_LORD_RETRO');
  if (r.venusWeak && (combust.Venus || retro.Venus || m.signs.Venus === 5 || (r.venusWeak.enemy && [3, 4].includes(m.signs.Venus)))) out.push('VENUS_WEAK');
  if (r.marsMercWeak && (retro.Mars || combust.Mars || retro.Mercury || combust.Mercury)) out.push('MARS_MERC_WEAK');
  if (r.nakVara && r.nakVara.some(([s, v]) => s === m.star && v === m.vara)) out.push('NAK_VARA');
  if (r.ghata && Number.isInteger(m.natalMoon)) {
    if (r.ghata.vara && r.ghata.vara[m.natalMoon] === m.vara) out.push('GHATA_VARA');
    if (r.ghata.lagna && r.ghata.lagna[m.natalMoon] === m.lagna) out.push('GHATA_LAGNA');
  }
  // The stars of each third of the day and of the night (MC XI.11); four are good at any time.
  if (r.kaalShoola) {
    const K = r.kaalShoola;
    const group = m.dayPart === 0 ? K.night[(m.nightPart || 1) - 1] : K.day[[0, 0, 1, 1, 2][m.dayPart]];
    if ((group.includes(m.star) && !K.always.includes(m.star)) || (m.abhijit && group.includes('ABHIJIT'))) out.push('KAAL_SHOOLA');
  }
  // The numbers: tithi (1-30), weekday (Sunday 1), star (Ashwini 1), lagna (Aries 1).
  const t = m.tithi; const v = m.vara + 1; const n = m.star + 1; const l = m.lagna + 1;
  if (r.sarvanka && [7, 8, 3].some((k) => (t + v + n) % k === 0)) out.push('SARVANKA');
  if (r.trianka && ((2 * t) % 6 === 0 || (3 * v) % 8 === 0 || (4 * n) % 6 === 0)) out.push('TRIANKA');
  if (r.panchaka9) {
    const rem = (t + v + n + l) % 9;
    if (r.panchaka9.reject.includes(rem)) out.push('YATRA_PANCHAKA');
    else if (r.panchaka9.mid.includes(rem)) out.push('YATRA_PANCHAKA_MID');
  }
  if (r.jupVenLagna && H.Jupiter !== 1 && H.Venus !== 1) out.push('JUP_VEN_LAGNA_MID');
  if (r.lagnaTithi && r.lagnaTithi[tithiClass(t)].includes(m.lagna)) out.push('LAGNA_TITHI');
  const d = m.dir;
  if (!Number.isInteger(d)) return out;
  const d4 = dir4Of(d);
  const vasanta = [11, 0].includes(m.signs.Sun) ? (r.vasanta ?? []) : [];
  if (r.vaarShoola && !vasanta.includes('VAAR_SHOOLA')
    && r.vaarShoola.some(({ map, release }) => inMap(map, d, m.vara) && !(release && release[m.vara] !== undefined && m.ghatis >= release[m.vara]))) out.push('VAAR_SHOOLA');
  if (r.kaalaPasha) {
    const kaala = m.dayPart === 0 ? (KAALA_DAY[m.vara] + 4) % 8 : KAALA_DAY[m.vara];
    if (d === kaala || d === (kaala + 4) % 8) out.push('KAALA_PASHA');
  }
  // Ayana (MC XI.39): both luminaries in the northern course, east and north; both in the southern, south and
  // west; otherwise the Sun's by day and the Moon's by night.
  if (r.ayana && !vasanta.includes('AYANA')) {
    const north = (s) => UTTARAYANA.includes(s);
    const sunN = north(m.signs.Sun);
    const goes = sunN === north(m.signs.Moon) || m.dayPart > 0 ? sunN : north(m.signs.Moon);
    if (halfOf(d) !== (goes ? 0 : 1)) out.push('AYANA');
  }
  if (r.abhijitSouth && m.abhijitMuhurta && d4 === 2) out.push('ABHIJIT_SOUTH');
  if (r.digdwarLagna) {
    const rel = relOf(signDir(m.lagna), d4);
    if (rel === 4) out.push('DIGDWAR_LAGNA');
    else if (rel === 6 && r.digdwarLagna.left) out.push(r.digdwarLagna.left === 'MID' ? 'DIGDWAR_LAGNA_MID' : 'DIGDWAR_LAGNA');
  }
  if (r.lalatika) {
    const [p, houses] = r.lalatika[DIR8[d]];
    if (houses.includes(H[p])) out.push('LALATIKA');
  }
  if (r.chandraKantaka && H.Moon === 1 && relOf(signDir(m.lagna), d4) === 4) out.push('CHANDRA_KANTAKA');
  if (r.planetFront && r.planetFront.some((p) => HOUSE_DIR[H[p]] === d)) out.push('PLANET_FRONT');
  if (r.vaarRahu && VAAR_RAHU[m.vara] === d) out.push('VAAR_RAHU');
  return out;
}

/** The codes a book puts after its main rules, marked rather than rejecting. */
const withSecondary = (r, codes) => (r.secondary ? codes.map((c) => (!c.endsWith('_MID') && r.secondary.includes(c) ? `${c}_MID` : c)) : codes);

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
    // The birth Moon's sign rising is good for a journey (Wilhelm "generally favorable"; Raman "highly favoured").
    const natalMoonOk = L.natalMoonOk && m.lagna === m.natalMoon;
    if (L.mid.includes(m.lagna) && !natalMoonOk) out.push('LAGNA_MID');
    else if (!L.good.includes(m.lagna) && !(upachaya && !(L.alt.notMovable && MOVABLE.includes(m.lagna))) && !movableOk && !natalMoonOk) out.push('LAGNA');
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
  // Vidyarambha: Mercury (vidya karaka) not set; the Sun or Mars not in the lagna's navamsa sign; the
  // books' best places for Mercury, Jupiter, Venus (marked when none is there).
  if (r.mercNotSet && m.combust?.Mercury) out.push('MERC_SET');
  if (r.sunMarsNav && m.navSigns && (m.navSigns.Sun === m.nav || m.navSigns.Mars === m.nav)) out.push('SUN_MARS_NAV');
  if (r.benHouse && !r.benHouse.planets.some((p) => r.benHouse.houses.includes(H[p]))) out.push('BEN_HOUSE_MID');
  if (r.dayParts) {
    if (m.dayPart === 0) { if (!(r.dayParts.nightOk ?? []).includes(m.nightPart)) out.push('NIGHT'); }
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
  out.push(...travelStretchCodes(r, m, H));
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

/** Vijayadashami's day (`x.vijaya`, Ashvin Shukla 10 by Kalyanraman's day rule): "nothing need be considered further". */
const vijayadashamiOf = (r, x) => Boolean(r.vijayadashami) && Boolean(x.vijaya);
/** A reading's codes for a piece, its secondary rules marked. */
const pieceCodes = (r, x) => (vijayadashamiOf(r, x) ? [] : withSecondary(r, panchangaCodes(r, x)));
/**
 * A reading's codes for a lagna stretch, the weekday's with them. A weekday (and its Shoola, where the
 * book says so) is good with its lord in the given houses from the lagna (Wilhelm, Rangacharya).
 */
function stretchCodes(r, m, vara) {
  const mm = { ...m, vara };
  if (vijayadashamiOf(r, mm)) return [];
  let codes = [...varaCodes(r, vara, mm), ...lagnaCodes(r, mm)];
  if (r.varaUpachaya && r.varaUpachaya.houses.includes(houseOf(mm.signs[VARA_LORDS[vara]], mm.lagna))) {
    codes = codes.filter((c) => !r.varaUpachaya.codes.includes(c));
  }
  return withSecondary(r, codes);
}
/** All readings of an event for a piece: { book: codes }. */
const piecesCodesOf = (event, x) => Object.fromEntries(E.EVENTS[event].order.map((b) => [b, pieceCodes(E.EVENTS[event][b], x)]));
/** All readings for a lagna stretch, the weekday's codes with them. */
const stretchCodesOf = (event, m, vara) => Object.fromEntries(E.EVENTS[event].order.map((b) => [b, stretchCodes(E.EVENTS[event][b], m, vara)]));

const rejects = (codes) => codes.filter((c) => !c.endsWith('_MID'));

module.exports = {
  panchangaCodes, varaCodes, lagnaCodes, doorCodes, withDoorStars, piecesCodesOf, stretchCodesOf, rejects,
  pieceCodes, stretchCodes, withSecondary, travelPieceCodes, travelStretchCodes, vijayadashamiOf, isSthiraKarana,
  guruCodes, raviCodes, inHarishayana, isVishti, kumbhaCount, inPaksha, houseOf, UTTARAYANA,
  dir4Of, relOf, halfOf, signDir, starDir, tithiKey, tithiClass, venusBlind, HOUSE_DIR, KAALA_DAY, VAAR_RAHU, VARA_LORDS,
};
