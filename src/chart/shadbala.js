const {
  julianDay, calculatePosition, Planet, CalculationFlag, getAyanamsa,
} = require('@swisseph/node');
const { sunriseJulianDay, sunsetJulianDay } = require('../ephemeris/siderealPositions');
const { attachSource, sourceRequired } = require('../contracts/chartContext');
const { rasiFromLongitude } = require('./parashariChart');
const {
  EQUAL_DIVISION_VARGAS, equalDivisionVarga, calculateHora, calculateTrimsamsa,
} = require('./vargaChart');
const { RASI_LORD } = require('./karaka');
const { compoundRelationship } = require('./planetaryRelationship');
const { aspectualValue } = require('./aspectStrength');
const { warWinner } = require('./planetaryWar');

const BPHS_SHADBALA_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Shadbala, Ch.27',
};

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/** Deep exaltation points, v.49-50 (file page 29, printed page 19-20). */
const EXALTATION = {
  Sun: { sign: 0, degree: 10 }, Moon: { sign: 1, degree: 3 }, Mars: { sign: 9, degree: 28 },
  Mercury: { sign: 5, degree: 15 }, Jupiter: { sign: 3, degree: 5 }, Venus: { sign: 11, degree: 27 },
  Saturn: { sign: 6, degree: 20 },
};
/** Deep debilitation = the 7th sign from exaltation, same degree (v.50). */
const DEBILITATION = Object.fromEntries(
  Object.entries(EXALTATION).map(([p, e]) => [p, { sign: (e.sign + 6) % 12, degree: e.degree }]),
);

/** Own signs (Swakshetra) per planet -- standard rasi rulership, `RASI_LORD` inverted. */
const OWN_SIGNS = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};
/**
 * Moolatrikona sign and exact degree range per planet, v.51-54 (file p.29-30,
 * printed p.19-20): reproduces the book's own worked splits exactly (e.g.
 * Jupiter "the first one third of Sagittarius" = 0-10 degrees; Venus
 * "divides Libra into two halves" = 0-15/15-30). The Moon's Moolatrikona
 * (Taurus) is the one case where it falls outside the planet's own sign
 * (Cancer) -- reproduced as the source states it, not "corrected" to align
 * with Cancer.
 */
const MOOLATRIKONA = {
  Sun: { sign: 4, from: 0, to: 20 }, // Leo
  Moon: { sign: 1, from: 4, to: 30 }, // Taurus (her exaltation sign, not her own)
  Mars: { sign: 0, from: 0, to: 12 }, // Aries
  Mercury: { sign: 5, from: 15, to: 20 }, // Virgo
  Jupiter: { sign: 8, from: 0, to: 10 }, // Sagittarius
  Venus: { sign: 6, from: 0, to: 15 }, // Libra
  Saturn: { sign: 10, from: 0, to: 20 }, // Aquarius
};
/** Saptavargaja Bala's own per-dignity point scale, v.2-4 of this chapter (file p.219, printed p.209). */
const SAPTAVARGAJA_POINTS = {
  moolatrikona: 45, own: 30, greatFriend: 20, friend: 15, neutral: 10, enemy: 4, greatEnemy: 2,
};
const SAPTAVARGA_KEYS = ['D1', 'D2', 'D3', 'D7', 'D9', 'D12', 'D30'];

/** Sign-level-only dignity (no degree info) -- used for D2-D30 and as the fallback for D1. */
function dignityOfSign(planet, signIndex, rasiPositions) {
  const mt = MOOLATRIKONA[planet];
  if (mt && signIndex === mt.sign) return 'moolatrikona';
  if (OWN_SIGNS[planet].includes(signIndex)) return 'own';
  return compoundRelationship(planet, RASI_LORD[signIndex], rasiPositions);
}
/** Rasi(D1)-specific dignity: the only division with fractional-degree resolution, so the Moolatrikona/exaltation-zone boundary from v.51-54 is applied here only. */
function d1Dignity(planet, rasiIndex, degreeInSign, rasiPositions) {
  const mt = MOOLATRIKONA[planet];
  const inExactMoolatrikonaBand = mt && rasiIndex === mt.sign && degreeInSign >= mt.from && degreeInSign < mt.to;
  if (mt && rasiIndex === mt.sign && !inExactMoolatrikonaBand) {
    if (OWN_SIGNS[planet].includes(rasiIndex)) return 'own';
    return compoundRelationship(planet, RASI_LORD[rasiIndex], rasiPositions);
  }
  return dignityOfSign(planet, rasiIndex, rasiPositions);
}
/**
 * Saptavargaja Bala (v.2-4, file p.219, printed p.209): sums the same
 * dignity-point scale across all 7 of the planet's "Saptavarga" placements
 * (Rasi, Hora, Drekkana, Saptamsa, Navamsha, Dvadasamsa, Trimsamsa). Per the
 * chapter's own instruction, the sign-lord relationship used for dignity is
 * always the natal-Rasi-chart compound relationship (`rasiPositions`), never
 * recomputed inside the divisional chart itself.
 */
function saptavargajaBala(planet, rasiIndex, degreeInSign, rasiPositions) {
  let total = SAPTAVARGAJA_POINTS[d1Dignity(planet, rasiIndex, degreeInSign, rasiPositions)];
  const horaLord = calculateHora(rasiIndex, degreeInSign);
  total += SAPTAVARGAJA_POINTS[horaLord === planet ? 'own' : compoundRelationship(planet, horaLord, rasiPositions)];
  const drekkanaSign = equalDivisionVarga(EQUAL_DIVISION_VARGAS.D3, rasiIndex, degreeInSign);
  total += SAPTAVARGAJA_POINTS[dignityOfSign(planet, drekkanaSign, rasiPositions)];
  const saptamsaSign = equalDivisionVarga(EQUAL_DIVISION_VARGAS.D7, rasiIndex, degreeInSign);
  total += SAPTAVARGAJA_POINTS[dignityOfSign(planet, saptamsaSign, rasiPositions)];
  const navamsaSign = equalDivisionVarga(EQUAL_DIVISION_VARGAS.D9, rasiIndex, degreeInSign);
  total += SAPTAVARGAJA_POINTS[dignityOfSign(planet, navamsaSign, rasiPositions)];
  const dvadasamsaSign = equalDivisionVarga(EQUAL_DIVISION_VARGAS.D12, rasiIndex, degreeInSign);
  total += SAPTAVARGAJA_POINTS[dignityOfSign(planet, dvadasamsaSign, rasiPositions)];
  const trimsamsaSign = calculateTrimsamsa(rasiIndex, degreeInSign);
  total += SAPTAVARGAJA_POINTS[dignityOfSign(planet, trimsamsaSign, rasiPositions)];
  return total;
}

/** Raman's Saptavargaja points (Graha and Bhava Balas ch.3 v.30, PDF p.22-23): moolatrikona 45 (Rasi only), own 30, adhi-mitra 22.5, mitra 15, sama 7.5, satru 3.75, adhi-satru 1.875. */
const RAMAN_SAPTAVARGAJA_POINTS = Object.freeze({ own: 30, greatFriend: 22.5, friend: 15, neutral: 7.5, enemy: 3.75, greatEnemy: 1.875 });

/**
 * Saptavargaja Bala by Raman (Graha and Bhava Balas, ch.3 vv.30, Example 9): the seven vargas (Rasi, Hora, Drekkana,
 * Saptamsa, Navamsa, Dvadasamsa, Trimsamsa), each scored by the planet's relation to the varga's lord. Moolatrikona
 * counts 45 in the Rasi only; in another varga the moolatrikona sign counts as own.
 */
function saptavargajaBalaRaman(planet, rasiIndex, degreeInSign, rasiPositions) {
  const mt = MOOLATRIKONA[planet];
  const score = (sign, lord, isRasi) => {
    if (mt && sign === mt.sign) return isRasi ? 45 : RAMAN_SAPTAVARGAJA_POINTS.own;
    if (lord === planet || OWN_SIGNS[planet].includes(sign)) return RAMAN_SAPTAVARGAJA_POINTS.own;
    return RAMAN_SAPTAVARGAJA_POINTS[compoundRelationship(planet, lord, rasiPositions)];
  };
  let total = score(rasiIndex, RASI_LORD[rasiIndex], true);
  const horaLord = calculateHora(rasiIndex, degreeInSign);
  total += lord(horaLord, planet);
  const sign = (key) => equalDivisionVarga(EQUAL_DIVISION_VARGAS[key], rasiIndex, degreeInSign);
  for (const key of ['D3', 'D7', 'D9', 'D12']) {
    const s = sign(key);
    total += score(s, RASI_LORD[s], false);
  }
  const trimsamsa = calculateTrimsamsa(rasiIndex, degreeInSign);
  total += score(trimsamsa, RASI_LORD[trimsamsa], false);
  return total;
  function lord(horaPlanet, self) {
    return horaPlanet === self ? RAMAN_SAPTAVARGAJA_POINTS.own : RAMAN_SAPTAVARGAJA_POINTS[compoundRelationship(self, horaPlanet, rasiPositions)];
  }
}

/** Natural malefics for Drig Bala's benefic/malefic classification (v.19). Mercury/Jupiter are handled separately (see below), and the Moon's nature is Paksha-dependent, not fixed. */
const NATURAL_MALEFICS = new Set(['Sun', 'Mars', 'Saturn']);
/** v.19: "Super add the entire aspect of Mercury and Jupiter" -- their aspects count in full, not reduced to a quarter like other benefics. */
const FULL_ADD_ASPECTORS = new Set(['Mercury', 'Jupiter']);
/**
 * Drig Bala (v.19, file p.233): for every other classical planet that
 * aspects this one (Ch.26's Drishti Pinda), add a quarter of the aspectual
 * value if the aspector is benefic, subtract a quarter if malefic, or add
 * the full value if the aspector is Mercury or Jupiter (the verse's own
 * named exception). The Moon's benefic/malefic status here follows the same
 * Paksha (waxing/waning) rule already used for her Paksha Bala, not a fixed
 * classification.
 */
function drikBala(planet, longitudes, isWaxingMoon) {
  let net = 0;
  for (const other of PLANETS) {
    if (other === planet) continue;
    const value = aspectualValue(other, longitudes[other], longitudes[planet]);
    if (value === 0) continue;
    if (FULL_ADD_ASPECTORS.has(other)) {
      net += value;
    } else if (other === 'Moon') {
      net += isWaxingMoon ? value / 4 : -(value / 4);
    } else if (NATURAL_MALEFICS.has(other)) {
      net -= value / 4;
    } else {
      net += value / 4; // Venus
    }
  }
  return net;
}

/**
 * Raman's drishti value in shashtiamsas for an aspect angle (drusya minus drishta, degrees): Graha and Bhava Balas
 * ch.8 vv.110-114 (1996 ed., printed pp.83-86 = PDF pp.88-90): 0 to 30°, nil; 30-60° (dk-30)/2; 60-90° dk-45; 90-120°
 * (120-dk)/2+30; 120-150° 150-dk; 150-180° (dk-150)x2; 180-300° (300-dk)/2; 300° onwards nil.
 */
function ramanDrishtiValue(dk) {
  if (dk < 30) return 0;
  if (dk < 60) return (dk - 30) / 2;
  if (dk < 90) return dk - 45;
  if (dk < 120) return (120 - dk) / 2 + 30;
  if (dk < 150) return 150 - dk;
  if (dk < 180) return (dk - 150) * 2;
  if (dk <= 300) return (300 - dk) / 2;
  return 0;
}

/** Raman's visesha drishti (ch.8 v.115): Kuja on the 4th and 8th (+15), Guru on the 5th and 9th (+30), Sani on the 3rd and 10th (+45). */
const RAMAN_VISESHA = { Mars: [[90, 120], [210, 240], 15], Jupiter: [[120, 150], [240, 270], 30], Saturn: [[60, 90], [270, 300], 45] };

/**
 * Raman's classification (ch.8 vv.117-118): Ravi, Kuja, Sani and the waning Moon are papa (malefic); Guru, Sukra and the
 * waxing Moon are subha (benefic); Budha is malefic when badly associated (here: within 12° of Sun, Mars or Saturn; the
 * orb is an assumption, checked against the Standard Horoscope where Budha is 0.6° from Ravi).
 */
function ramanIsMalefic(planet, longitudes, isWaxingMoon) {
  if (planet === 'Sun' || planet === 'Mars' || planet === 'Saturn') return true;
  if (planet === 'Moon') return !isWaxingMoon;
  if (planet === 'Mercury') {
    return ['Sun', 'Mars', 'Saturn'].some((other) => angularDiff180(longitudes[other], longitudes.Mercury) < 12);
  }
  return false;
}

/**
 * Drik Bala by Raman (Graha and Bhava Balas ch.8, vv.119-121): the subha drishti pinda (received from benefics) less the
 * papa drishti pinda (received from malefics) is the nett, and Drik Bala is the nett divided by four. Verified against
 * Raman's Standard Horoscope (Example 56): Ravi +15.86, Chandra -21.73, Kuja +0.95, Budha +15.64, Guru -16.03, Sukra +18.47.
 */
function drikBalaRaman(planet, longitudes, isWaxingMoon) {
  let nett = 0;
  for (const other of PLANETS) {
    if (other === planet) continue;
    const dk = normalizeDegrees(longitudes[planet] - longitudes[other]);
    let value = ramanDrishtiValue(dk);
    const visesha = RAMAN_VISESHA[other];
    if (visesha && ((dk >= visesha[0][0] && dk < visesha[0][1]) || (dk >= visesha[1][0] && dk < visesha[1][1]))) value += visesha[2];
    nett += ramanIsMalefic(other, longitudes, isWaxingMoon) ? -value : value;
  }
  return nett / 4;
}

/** The Drik Bala readings: 'bphs' is the Chapter 26 quarter rule (the default); 'raman' is Raman's ch.8 rule. */
const DRIK_METHODS = Object.freeze({ bphs: drikBala, raman: drikBalaRaman });

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}
function angularDiff180(a, b) {
  const diff = normalizeDegrees(a - b);
  return diff > 180 ? 360 - diff : diff;
}
function toLongitude(sign, degree) {
  return sign * 30 + degree;
}

/**
 * Uchcha Bala (v.1-1.5, file p.218-219): reproduces the book's own worked
 * example exactly (Sun at Pisces 12d15', debilitation Libra 10d -> 50.75).
 */
function uchchaBala(planet, longitude) {
  const deb = DEBILITATION[planet];
  return angularDiff180(longitude, toLongitude(deb.sign, deb.degree)) / 3;
}

/**
 * Ojhayugmarasyamsa Bala (v.4.5, file p.219): 15 Virupas each for a rasi-
 * parity match and a navamsa-parity match. The printed English translation
 * says "quarter of Rupa (i.e. 5 Virupas)" but its own Notes give 15 Virupas
 * per match -- and 1/4 x 60 = 15, not 5, so the "(i.e. 5 Virupas)"
 * parenthetical is treated as a transcription slip in this PDF, not a second
 * convention (see S10 stage record).
 */
const OJHA_FAVOURS_EVEN = new Set(['Venus', 'Moon']);
function isOddSign(rasiIndex) {
  return rasiIndex % 2 === 0;
}
function ojhayugmarasyamsaBala(planet, rasiIndex, navamsaIndex) {
  const favoursEven = OJHA_FAVOURS_EVEN.has(planet);
  const rasiMatch = favoursEven ? !isOddSign(rasiIndex) : isOddSign(rasiIndex);
  const navamsaMatch = favoursEven ? !isOddSign(navamsaIndex) : isOddSign(navamsaIndex);
  return (rasiMatch ? 15 : 0) + (navamsaMatch ? 15 : 0);
}

/**
 * Kendradi Bala (v.5, file p.219): whole-sign house distance from Lagna's
 * rasi -- angle=60, succedent=30, cadent=15 Virupas. BPHS's own verse gives
 * no fractional-degree cusp scaling here (unlike Dig-Bala), so this uses the
 * planet's own rasi relative to Lagna's rasi, not an exact Sripati cusp --
 * S6's Bhava placement (still SOURCE_REQUIRED) is not needed for this.
 */
function kendradiBala(planetRasiIndex, lagnaRasiIndex) {
  const houseFromLagna = ((planetRasiIndex - lagnaRasiIndex + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(houseFromLagna)) return 60;
  if ([2, 5, 8, 11].includes(houseFromLagna)) return 30;
  return 15;
}

const MALE_PLANETS = new Set(['Sun', 'Mars', 'Jupiter']);
const FEMALE_PLANETS = new Set(['Moon', 'Venus']);
// Mercury and Saturn are the neuter ("eunuch") pair.
/** Drekkana Bala (v.6, file p.219-220): 15 Virupas for male planets in the 1st decanate, female in the 2nd, neuter in the 3rd. */
function drekkanaBala(planet, degreeInSign) {
  const decanateIndex = Math.min(2, Math.floor(degreeInSign / 10));
  const requiredDecanate = MALE_PLANETS.has(planet) ? 0 : FEMALE_PLANETS.has(planet) ? 1 : 2;
  return decanateIndex === requiredDecanate ? 15 : 0;
}

/**
 * Drekkana Bala by Raman (Graha and Bhava Balas Example 12, PDF p.33; the table gives each planet's sex and the decanate
 * that scores): male planets in the 1st decanate, neuter (Budha, Sani) in the 2nd, female (Chandra, Sukra) in the 3rd.
 * Rule derived from that table, which is the only place Raman states it.
 */
const RAMAN_DREKKANA_INDEX = Object.freeze({ Sun: 0, Mars: 0, Jupiter: 0, Mercury: 1, Saturn: 1, Moon: 2, Venus: 2 });
function drekkanaBalaRaman(planet, degreeInSign) {
  return Math.min(2, Math.floor(degreeInSign / 10)) === RAMAN_DREKKANA_INDEX[planet] ? 15 : 0;
}

const DIG_BALA_ZERO_POINT = {
  Sun: 'IC', Mars: 'IC', Jupiter: 'Descendant', Mercury: 'Descendant', Venus: 'MC', Moon: 'MC', Saturn: 'Ascendant',
};
/** Dig Bala (v.7-7.5, file p.220-221): full 60 Virupas at the planet's own strong angle, 0 at the diametrically opposite one. */
function digBala(planet, longitude, { ascendant, mc }) {
  const zeroPoints = {
    IC: normalizeDegrees(mc + 180), MC: mc, Ascendant: ascendant, Descendant: normalizeDegrees(ascendant + 180),
  };
  return angularDiff180(longitude, zeroPoints[DIG_BALA_ZERO_POINT[planet]]) / 3;
}

const NAISARGIKA_RANK = { Saturn: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Moon: 6, Sun: 7 };
/** Naisargika Bala (v.14, file p.227-228): fixed constants, (60/7) x rank -- reproduces the book's own printed 1.000/0.857/... Rupa figures exactly. */
function naisargikaBala(planet) {
  return (60 / 7) * NAISARGIKA_RANK[planet];
}

const PAKSHA_BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury']);
/**
 * Paksha Bala (v.10-11, file p.221-222). Benefics: Jupiter, Venus, Mercury;
 * malefics: Sun, Mars, Saturn. The Moon's own value is always doubled per
 * the source's own note ("her Paksha Bala is always doubled"), so it can
 * exceed the usual 60-Virupa ceiling -- reproduced literally, not capped.
 */
function pakshaBala(planet, sunLongitude, moonLongitude) {
  const rawDiff = normalizeDegrees(moonLongitude - sunLongitude);
  const isWaxing = rawDiff <= 180;
  const reduced = isWaxing ? rawDiff : 360 - rawDiff;
  const beneficPB = reduced / 3;
  const maleficPB = 60 - beneficPB;
  if (planet === 'Moon') return 2 * (isWaxing ? beneficPB : maleficPB);
  return PAKSHA_BENEFICS.has(planet) ? beneficPB : maleficPB;
}

/**
 * Paksha Bala by Raman (Graha and Bhava Balas Art.52-55, pp.37-39): the same one-third share of the Moon-Sun
 * elongation, but the classification is Raman's own. Ravi, Kuja, Sani and the waning Moon are papa; Guru and Sukra are
 * subha; Budha is papa when afflicted (the ramanIsMalefic orb). Papa planets get 60 less the subha share, and Chandra's
 * value is doubled. Verified against the Standard Horoscope (Example 18): Ravi, Kuja, Budha, Sani 16.54; Chandra 86.92;
 * Guru, Sukra 43.46.
 */
function pakshaBalaRaman(planet, longitudes, isWaxingMoon) {
  const rawDiff = normalizeDegrees(longitudes.Moon - longitudes.Sun);
  const subha = (rawDiff <= 180 ? rawDiff : 360 - rawDiff) / 3;
  const value = ramanIsMalefic(planet, longitudes, isWaxingMoon) ? 60 - subha : subha;
  return planet === 'Moon' ? 2 * value : value;
}

/** Tribhaga Bala (v.12, file p.222-223): 60 Virupas to the lord of the day/night third the birth falls in, plus Jupiter always gets 60. */
const TRIBHAGA_DAY_LORDS = ['Mercury', 'Sun', 'Saturn'];
const TRIBHAGA_NIGHT_LORDS = ['Moon', 'Venus', 'Mars'];
function tribhagaLord(isDaytime, thirdIndex) {
  return (isDaytime ? TRIBHAGA_DAY_LORDS : TRIBHAGA_NIGHT_LORDS)[thirdIndex];
}
function tribhagaBala(planet, isDaytime, thirdIndex) {
  if (planet === 'Jupiter') return 60;
  return planet === tribhagaLord(isDaytime, thirdIndex) ? 60 : 0;
}

/**
 * Kranti (declination) of a planet at a given moment -- an equatorial
 * quantity, independent of ayanamsha, so no sidereal mode is set here.
 * Positive = Northern, negative = Southern, matching v.15-17's own
 * Notes' "Northern/Southern Kranti" language directly.
 */
function kranti(planet, jd) {
  const flags = CalculationFlag.SwissEphemeris | CalculationFlag.Equatorial;
  return calculatePosition(jd, Planet[planet], flags).latitude;
}

/**
 * Equation of time in days (apparent solar time minus mean solar time; positive when the sundial is ahead): the Sun's
 * mean longitude less its right ascension, both from Swiss Ephemeris (the RA is the `longitude` of an equatorial
 * position). Raman's Standard Horoscope needs 14 minutes here (Example 17: 2-6 p.m. LMT becomes 2-20 p.m. LAT).
 */
function equationOfTimeDays(jd) {
  const flags = CalculationFlag.SwissEphemeris | CalculationFlag.Equatorial;
  const centuries = (jd - 2451545.0) / 36525;
  const meanLongitude = 280.46646 + 36000.76983 * centuries + 0.0003032 * centuries * centuries;
  const rightAscension = calculatePosition(jd, Planet.Sun, flags).longitude;
  let minutesOfDegree = meanLongitude - 0.0057183 - rightAscension;
  minutesOfDegree = ((minutesOfDegree % 360) + 540) % 360 - 180; // wrapped to -180..180 degrees
  return (4 * minutesOfDegree) / 1440;
}

/** v.15-17 Notes: Moon/Saturn take Southern Kranti as positive (contrary of Sun/Mars/Jupiter/Venus); Mercury is always positive regardless of hemisphere. */
const AYANA_SOUTHERN_IS_POSITIVE = new Set(['Moon', 'Saturn']);
/** Ayana Bala's own conversion constant, v.15-17 Notes: 60 Virupas / (2 x 23d27') = 60/46d54'. */
const AYANA_BALA_FACTOR = 60 / (46 + 54 / 60);
/**
 * Ayana Bala (v.15-17, file p.218-219, printed p.218-219): resolved.
 * The verse's own Khanda-based procedure is intricate and has no worked
 * example to check an implementation against; its translator's "simple
 * formula" note reads "((23d27' + Kranti) x 60) / 46d54'", which does NOT
 * reproduce the very same note's own printed "Speculum of Ayana Bala"
 * table. Rendering the actual PDF pages (file p.218-219) resolved this: the
 * table's column header is a two-line "Kranti" / "+23d27'" label spanning
 * the page break (the second line simply annotating the column's maximum
 * possible value, the obliquity of the ecliptic) -- not an operand. The
 * formula prose mistakenly folded that header annotation into the
 * arithmetic. Hand-verified against many table rows with the header
 * removed (Ayana Bala = Kranti x 60/46d54' alone): e.g. 0d47' -> 1.00,
 * 1d34' -> 2.00, 5d10' -> 6.6, 7d30' -> 9.6, all matching exactly. Southern
 * Kranti counts as positive for the Moon and Saturn (contrary for the other
 * four); Mercury's is always positive regardless of hemisphere; the Sun's
 * final result is doubled (the only mechanism giving the Sun the same
 * 60-Virupa ceiling other components reach, since Kranti alone is bounded
 * by the ~23.45-degree obliquity of the ecliptic).
 */
function ayanaBala(planet, planetKranti) {
  const signedKranti = planet === 'Mercury'
    ? Math.abs(planetKranti)
    : (AYANA_SOUTHERN_IS_POSITIVE.has(planet) ? -planetKranti : planetKranti);
  const bala = signedKranti * AYANA_BALA_FACTOR;
  return planet === 'Sun' ? bala * 2 : bala;
}

/** Raman's Kranti table (Art.73-74, pp.53-57): cumulative arc-minutes at the end of each 15-degree division from the equinox. */
const RAMAN_KRANTI_ARCMIN = [0, 362, 703, 1002, 1238, 1388, 1440];
/**
 * Raman's declination from a sayana (tropical) longitude: the bhuja is the distance from the nearest equinox, and the
 * declination is read off his six-division table, linearly within the division. North is positive. This is Raman's own
 * approximation; it reproduces his printed Standard Horoscope krantis (Ravi 8d45' S, Kuja 22d26' S, Guru 23d30' N).
 */
function ramanKranti(sayanaLongitude) {
  const sayana = normalizeDegrees(sayanaLongitude);
  const halfTurn = sayana % 180;
  const bhuja = Math.min(halfTurn, 180 - halfTurn);
  const division = Math.min(5, Math.floor(bhuja / 15));
  const step = RAMAN_KRANTI_ARCMIN[division + 1] - RAMAN_KRANTI_ARCMIN[division];
  const arcMinutes = RAMAN_KRANTI_ARCMIN[division] + (step * (bhuja - 15 * division)) / 15;
  return (sayana < 180 ? 1 : -1) * arcMinutes / 60;
}

/**
 * Ayana Bala by Raman (Art.75, pp.59-60, after Kesava Daivagna): (24 degrees + Kranti) / 48 x 60, where Ravi, Kuja, Guru
 * and Sukra count a northern declination as additive and a southern one as subtractive; Chandra and Sani the reverse;
 * Budha is always additive; the Sun's result is doubled. The sayana longitude is the sidereal one plus the ayanamsha.
 */
const RAMAN_AYANA_SOUTH_ADDITIVE = new Set(['Moon', 'Saturn']);
function ayanaBalaRaman(planet, sayanaLongitude) {
  const kranti = ramanKranti(sayanaLongitude);
  let term;
  if (planet === 'Mercury') term = 24 + Math.abs(kranti);
  else if (RAMAN_AYANA_SOUTH_ADDITIVE.has(planet)) term = 24 - kranti;
  else term = 24 + kranti;
  const bala = (term / 48) * 60;
  return planet === 'Sun' ? 2 * bala : bala;
}

/**
 * Nathonnata Bala (v.8-9, file p.221, plus the "simple method" note in the
 * same passage): the two methods (Ghati-based; direct degrees-from-midnight)
 * describe the same elapsed-time fraction in different units, not
 * conflicting conventions -- S10's first pass was overcautious calling this
 * unresolved. Unnata = elapsed time from the NEAREST local midnight (0 to
 * 30 ghatis, i.e. 0 to 12 hours either side); Nata = 30 ghatis - Unnata.
 * Moon/Mars/Saturn get 2 x Nata; Sun/Jupiter/Venus get 60 - that (= 2 x
 * Unnata); Mercury always gets the full 60 regardless of birth time.
 * `eotDays` moves the midnight from the local mean to the apparent one (Raman, Art.48: midnight is the Sun's lower
 * meridian passage, so the equation of time applies). 0 keeps the mean midnight, which is the BPHS reading.
 */
function nathonnataBala(planet, birthJd, jdLocalMidnight, eotDays = 0) {
  if (planet === 'Mercury') return 60;
  const midnight = jdLocalMidnight - eotDays;
  const elapsedFromBefore = birthJd - midnight;
  const elapsedFromAfter = (midnight + 1) - birthJd;
  const unnataGhatis = Math.min(elapsedFromBefore, elapsedFromAfter) * 60;
  const nataGhatis = 30 - unnataGhatis;
  const nathaBala = 2 * nataGhatis;
  if (['Moon', 'Mars', 'Saturn'].includes(planet)) return nathaBala;
  return 60 - nathaBala; // Sun, Jupiter, Venus
}

/**
 * Seeghrocha (apogee/epicycle center) positions in degrees, from Surya Siddhanta.
 * These are the mean apogee positions of each planet's epicycle in the Siddhantic model.
 * v.24-25 (file p.235-236, printed p.225-226): Cheshta Bala requires Seeghrocha.
 */
const SEEGHROCHA = {
  Mars: 131.5, // Mesha 11°30'
  Mercury: 55.5, // Mithuna 25°30'
  Jupiter: 157.5, // Simha 7°30'
  Venus: 92.5, // Mithuna 2°30'
  Saturn: 230.5, // Vrischika 20°30'
};

/**
 * Daily mean-motion rates (degrees per Julian day) from Surya Siddhanta,
 * used to compute mean longitude from a standard epoch (J2000).
 */
const MEAN_MOTION_DAILY = {
  Mars: 0.524068, Mercury: 4.092324, Jupiter: 0.083091, Venus: 1.602130, Saturn: 0.033463,
};

/**
 * Mean longitude at J2000 (Julian Day 2451545.0), computed from Surya Siddhanta
 * mean-motion tables and precession-adjusted for Lahiri sidereal zodiac.
 */
const MEAN_LONGITUDE_J2000 = {
  Mars: 205.326, Mercury: 221.328, Jupiter: 165.361, Venus: 181.980, Saturn: 242.214,
};

/**
 * Cheshta Bala (v.24-25, file p.235-236): motional strength for Mars, Mercury,
 * Jupiter, Venus, Saturn. Formula per the Notes (lines 21174-21177 of BPHS text):
 * (1) Average of mean and true longitude: avg = (mean + true) / 2
 * (2) Chesta Kendra = Seeghrocha - avg
 * (3) If Chesta Kendra > 180°, normalize: Chesta Kendra = 360° - Chesta Kendra
 * (4) Cheshta Bala = Chesta Kendra / 3
 */
function chestaBalaFivePlanets(planet, trueLongitude, birthJd) {
  const daysFromJ2000 = birthJd - 2451545.0;
  const meanMotion = MEAN_MOTION_DAILY[planet] * daysFromJ2000;
  const meanLongitude = normalizeDegrees(MEAN_LONGITUDE_J2000[planet] + meanMotion);
  const avg = (meanLongitude + trueLongitude) / 2;
  let chestaKendra = SEEGHROCHA[planet] - avg;
  chestaKendra = normalizeDegrees(chestaKendra);
  if (chestaKendra > 180) {
    chestaKendra = 360 - chestaKendra;
  }
  return chestaKendra / 3;
}

/**
 * Raman's Chesta Bala (Graha and Bhava Balas Art.79-107, pp.64-79): the same Chesta kendra and one-third rule, but the
 * mean longitudes and the Seeghrochchas come from his own epoch and motion constants (Art.88-104): the interval runs
 * from 1 January 1900, midnight at Ujjain (76d E), to the birth. Raman's Standard Horoscope (Examples 39-51) gives the
 * mean longitudes Kuja 266.34, Guru 66.91, Sani 111.23, Budha and Sukra 181.23; the Seeghrochchas Kuja, Guru, Sani
 * 181.23, Budha 174.49, Sukra 158.35; and the Chesta Bala Kuja 22.23, Budha 2.30, Guru 35.26, Sukra 5.95, Sani 21.14.
 * The Sun and the Moon have no Chesta Bala (Art.79).
 */
function ramanChestaInterval(birthJd) {
  return birthJd - julianDay(1900, 1, 1, -76 / 15);
}

/** Raman's mean longitude (Art.94-98) of the planet, from the Sun's: Budha and Sukra share the Sun's (Art.95). */
function ramanMeanLongitude(planet, interval, birthYear) {
  const t = birthYear - 1900;
  switch (planet) {
    case 'Mars': return normalizeDegrees(270.22 + 0.52402 * interval);
    case 'Jupiter': return normalizeDegrees(220.04 + 0.0830967 * interval - (3.33 + 0.0067 * t));
    case 'Saturn': return normalizeDegrees(236.74 + 0.03344 * interval + (5 + 0.001 * t));
    default: return normalizeDegrees(257.4568 + 0.9856039 * interval); // Sun, Budha, Sukra
  }
}

/** Raman's Seeghrochcha (Art.100-104): the Sun's mean longitude for Kuja, Guru and Sani; Budha and Sukra have their own. */
function ramanSeeghrochcha(planet, interval, birthYear) {
  const t = birthYear - 1900;
  if (planet === 'Mercury') return normalizeDegrees(164 + 4.092324 * interval + (6.67 - 0.00133 * t));
  // 1.602147 a day is the motion his Table IX rows imply (6,000 days 252.88, 800 days 201.72, 60 days 96.13).
  if (planet === 'Venus') return normalizeDegrees(328.51 + 1.602147 * interval - (5 + 0.001 * t));
  return ramanMeanLongitude('Sun', interval, birthYear);
}

/**
 * Raman's Chesta kendra and Chesta Bala for one of the five planets (Art.105-107): the Seeghrochcha less the mean of the
 * mean and true longitudes, reduced to at most 180 degrees, then a third of it in Virupas.
 */
function ramanChesta(planet, trueLongitude, birthJd, birthYear) {
  const interval = ramanChestaInterval(birthJd);
  const mean = ramanMeanLongitude(planet, interval, birthYear);
  const seeghra = ramanSeeghrochcha(planet, interval, birthYear);
  let kendra = normalizeDegrees(seeghra - (mean + trueLongitude) / 2);
  if (kendra > 180) kendra = 360 - kendra;
  return {
    mean, seeghra, kendra, bala: kendra / 3,
  };
}

/**
 * Which day/night third (0,1,2) a birth Julian Day falls into, and whether
 * that third is in daytime or nighttime -- using the same sunrise/sunset
 * primitives already trusted from S3/S5.
 */
function findDayNightThird({ birthJd, latitude, longitude, jdLocalMidnight }) {
  const todaySunrise = sunriseJulianDay(jdLocalMidnight, latitude, longitude);
  const todaySunset = sunsetJulianDay(todaySunrise, latitude, longitude);

  let windowStart;
  let windowEnd;
  let isDaytime;
  if (birthJd >= todaySunrise && birthJd <= todaySunset) {
    windowStart = todaySunrise; windowEnd = todaySunset; isDaytime = true;
  } else if (birthJd < todaySunrise) {
    const previousSunrise = sunriseJulianDay(jdLocalMidnight - 1, latitude, longitude);
    const previousSunset = sunsetJulianDay(previousSunrise, latitude, longitude);
    windowStart = previousSunset; windowEnd = todaySunrise; isDaytime = false;
  } else {
    const nextSunrise = sunriseJulianDay(todaySunset, latitude, longitude);
    windowStart = todaySunset; windowEnd = nextSunrise; isDaytime = false;
  }
  const fraction = (birthJd - windowStart) / (windowEnd - windowStart);
  return { isDaytime, thirdIndex: Math.min(2, Math.floor(fraction * 3)) };
}

/**
 * The sunrise that anchors a birth's classical (Vara) day, and the sunrise
 * immediately after it -- the same "sunrise to sunrise" day boundary v.13's
 * own Notes require for Dina Bala, and the natural boundary for Hora Bala's
 * 24-part division of that same span.
 */
function sunriseAnchoredWindow(birthJd, latitude, longitude, jdLocalMidnight) {
  const todaySunrise = sunriseJulianDay(jdLocalMidnight, latitude, longitude);
  if (birthJd >= todaySunrise) {
    return { sunrise: todaySunrise, nextSunrise: sunriseJulianDay(jdLocalMidnight + 1, latitude, longitude) };
  }
  return { sunrise: sunriseJulianDay(jdLocalMidnight - 1, latitude, longitude), nextSunrise: todaySunrise };
}

/**
 * Weekday-lord lookup keyed directly by (value mod 7), matching BPHS's own
 * "remainder 1=Sunday...remainder 0(as 7)=Saturday" convention (v.13 Notes,
 * file p.223-224). Reproduces both of the chapter's own worked sub-results
 * exactly: remainder 5 -> Jupiter (Thursday) for Varsha lord, remainder 6 ->
 * Venus (Friday) for both Masa and Dina lord, in the same June 1, 1984
 * worked example.
 */
const REMAINDER_TO_WEEKDAY_LORD = {
  0: 'Saturn', 1: 'Sun', 2: 'Moon', 3: 'Mars', 4: 'Mercury', 5: 'Jupiter', 6: 'Venus',
};
/**
 * "Abbreviated Ahargana" epoch offset (v.13 Notes' "Speculum of Abbreviated
 * Ahargana for January 0", file p.224-225): derived from the chapter's own
 * fully worked example -- "for January 0 date 1984 [it] is 65142" -- rather
 * than hand-transcribing the multi-page printed lookup table (which spans a
 * limited year range and risks silent OCR error on a purely numeric table).
 * "January 0" of a year is the day before January 1 (Dec 31, 0h UT of the
 * previous year), the 19th-century astronomical-almanac convention this
 * translation itself uses (Ebenezer Burgess's Surya Siddhanta translation is
 * cited by name two paragraphs earlier). Cross-verified against a second,
 * independently-read row of the same printed table 124 years apart (1860 ->
 * 19852) using this exact constant with no adjustment: JD(Jan 0, 1860) -
 * 2380557.5 = 19852.0 precisely.
 */
const ABBREVIATED_AHARGANA_EPOCH_JD = 2380557.5;

/**
 * Varsha (year) lord, v.13 (file p.222-223): the rule's own prose says
 * "divide...by 60", but that contradicts the very same passage's own fully
 * worked example, which only reproduces its own stated final answer
 * (remainder 5 -> Thursday -> Jupiter) when the divisor is 360 -- confirmed
 * by reproducing every intermediate step of the worked example exactly
 * (65295/360 -> quotient 181; 181*3+1 -> 544; 544 mod 7 -> 5). Treated as a
 * transcription slip in the rule's prose (a dropped "3"), not a second
 * convention -- the same kind of resolution already used for
 * Ojhayugmarasyamsa Bala's "5 Virupas" parenthetical in S10.
 */
function varshaLord(ahargana) {
  const quotient = Math.floor(ahargana / 360);
  return REMAINDER_TO_WEEKDAY_LORD[(quotient * 3 + 1) % 7];
}
/** Masa (month) lord, v.13 Notes: divide by 30, double the quotient, add 1, mod 7. */
function masaLord(ahargana) {
  const quotient = Math.floor(ahargana / 30);
  return REMAINDER_TO_WEEKDAY_LORD[(quotient * 2 + 1) % 7];
}
/** Dina (day) lord, v.13 Notes: the Ahargana's own remainder mod 7 -- the weekday of birth, sunrise to sunrise. */
function dinaLord(ahargana) {
  return REMAINDER_TO_WEEKDAY_LORD[((ahargana % 7) + 7) % 7];
}

const NATURAL_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
/**
 * Hora (planetary-hour) lord, v.13 Notes (file p.224): sunrise-to-next-
 * sunrise is divided into 24 equal Horas. The 1st Hora is ruled by the
 * day's own weekday lord; each subsequent Hora's lord is the one "6
 * weekdays counted from" the previous Hora lord's own weekday, using
 * inclusive counting (the previous lord's own weekday counts as "1st"), so
 * the step is +5 positions in the Sun..Saturn weekday cyclic order, not +6.
 * Verified against the universally-known Sunday Chaldean-hour sequence:
 * starting from Sun (index 0), +5 gives Venus (2nd hora), then +5 again
 * gives Mercury (3rd hora) -- exactly Sun, Venus, Mercury, Moon, Saturn,
 * Jupiter, Mars, matching the standard Chaldean order for Sunday.
 */
function horaLord(dayLordPlanet, horaIndex) {
  const startIndex = NATURAL_ORDER.indexOf(dayLordPlanet);
  return NATURAL_ORDER[(((startIndex + 5 * (horaIndex - 1)) % 7) + 7) % 7];
}

/** Fixed Virupa scale per v.13: Varsha 15, Masa 30, Dina 45, Hora 60. */
const VARSHA_MASA_DINA_HORA_VIRUPAS = {
  varsha: 15, masa: 30, dina: 45, hora: 60,
};
/** Determines the four lords once per chart (they don't depend on which planet's Bala is being scored). */
function computeVarshaMasaDinaHoraLords(birthJd, latitude, longitude, jdLocalMidnight) {
  const { sunrise, nextSunrise } = sunriseAnchoredWindow(birthJd, latitude, longitude, jdLocalMidnight);
  const ahargana = Math.floor(sunrise - ABBREVIATED_AHARGANA_EPOCH_JD);
  const dina = dinaLord(ahargana);
  const horaLength = (nextSunrise - sunrise) / 24;
  const horaIndex = Math.min(24, Math.floor((birthJd - sunrise) / horaLength) + 1);
  return {
    varsha: varshaLord(ahargana), masa: masaLord(ahargana), dina, hora: horaLord(dina, horaIndex),
  };
}
/** Sums whichever of the 4 lordships (v.13) belong to this planet, per the fixed Virupa scale above. */
function varshaMasaDinaHoraBala(planet, lords) {
  return (['varsha', 'masa', 'dina', 'hora'])
    .reduce((total, key) => total + (lords[key] === planet ? VARSHA_MASA_DINA_HORA_VIRUPAS[key] : 0), 0);
}

/** Minimum Shad-bala Pinda per planet to be considered strong, v.32-33 (file p.237-238). */
const SHADBALA_MINIMUM_VIRUPAS = {
  Sun: 390, Moon: 360, Mars: 300, Mercury: 420, Jupiter: 390, Venus: 330, Saturn: 300,
};
/** Minimum per-component requirements by planet group, v.34-36 (file p.238). */
const SHADBALA_COMPONENT_MINIMUMS = {
  A: {
    planets: ['Sun', 'Mercury', 'Jupiter'], sthanaBala: 165, digBala: 35, kaalaBala: 50, cheshtaBala: 112, ayanaBala: 30,
  },
  B: {
    planets: ['Moon', 'Venus'], sthanaBala: 133, digBala: 50, kaalaBala: 30, cheshtaBala: 100, ayanaBala: 40,
  },
  C: {
    planets: ['Mars', 'Saturn'], sthanaBala: 96, digBala: 30, kaalaBala: 40, cheshtaBala: 67, ayanaBala: 20,
  },
};

/**
 * S10 — Shadbala (WORKFLOW-REGISTER-001 S10; PLAN-001 item 10), BPHS Ch.27.
 * **Sthana, Dig, Kaala, Naisargika, Drik and Yuddha Bala are all now fully
 * resolved** -- only Cheshta Bala remains (given only for the Moon, who
 * needs nothing beyond her own Paksha Bala; the other 6 planets need the
 * classical Seeghrocha/mean-motion apogee model, a Siddhantic sub-system
 * this project has not implemented). Ayana Bala (within Kaala Bala) and
 * Drik Bala and Yuddha Bala's sourcing are recorded in the S10-B/S10-D/
 * S10-F stage records; Ayana Bala's own resolution (S10-G) turned out to be
 * the translator's own printed table mis-transcribed into its own formula
 * prose (see `ayanaBala`'s comment below) -- not a genuine content gap.
 * Every remaining incomplete category is returned as `sourceRequired(...)`,
 * never a partial number presented as final — see the S10 through S10-G
 * stage records for the exact reasons.
 *
 * `longitudes` is a `{ Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn }`
 * map of sidereal longitudes (as produced by `calculateParashariChart`),
 * `ascendant`/`mc` come from the same chart's house calculation.
 */
function calculateShadbala({
  longitudes, lagnaRasiIndex, ascendant, mc,
  birthJd, latitude, longitude, year, month, day, utcOffsetMinutes, drikMethod = 'bphs', sthanaMethod = 'bphs',
  kalaMethod = 'bphs', ayanamsaDegrees, chestaMethod = 'bphs',
}) {
  if (chestaMethod !== 'bphs' && chestaMethod !== 'raman') throw new Error(`unknown chesta method ${chestaMethod}`);
  const drikOf = DRIK_METHODS[drikMethod];
  if (!drikOf) throw new Error(`unknown drik method ${drikMethod}`);
  if (sthanaMethod !== 'bphs' && sthanaMethod !== 'raman') throw new Error(`unknown sthana method ${sthanaMethod}`);
  if (kalaMethod !== 'bphs' && kalaMethod !== 'raman') throw new Error(`unknown kala method ${kalaMethod}`);
  const isRamanKala = kalaMethod === 'raman';
  // Raman's Ayana uses sayana longitudes (Art.72: add the ayanamsha of the birth year). Default: the chart's own ayanamsha.
  const ayanamsa = isRamanKala ? (ayanamsaDegrees ?? getAyanamsa(birthJd)) : 0;
  const eotDays = isRamanKala ? equationOfTimeDays(birthJd) : 0;
  const jdLocalMidnight = julianDay(year, month, day, -utcOffsetMinutes / 60);
  const { isDaytime, thirdIndex } = findDayNightThird({
    birthJd, latitude, longitude, jdLocalMidnight,
  });
  const rasiPositions = Object.fromEntries(
    PLANETS.map((planet) => [planet, rasiFromLongitude(longitudes[planet]).rasiIndex]),
  );
  const isWaxingMoon = normalizeDegrees(longitudes.Moon - longitudes.Sun) <= 180;
  const varshaMasaDinaHoraLords = computeVarshaMasaDinaHoraLords(birthJd, latitude, longitude, jdLocalMidnight);

  const perPlanet = {};
  for (const planet of PLANETS) {
    const planetLongitude = longitudes[planet];
    const { rasiIndex, degreeInSign } = rasiFromLongitude(planetLongitude);
    const navamsaIndex = equalDivisionVarga(EQUAL_DIVISION_VARGAS.D9, rasiIndex, degreeInSign);

    const sthana = {
      uchchaBala: uchchaBala(planet, planetLongitude),
      ojhayugmarasyamsaBala: ojhayugmarasyamsaBala(planet, rasiIndex, navamsaIndex),
      kendradiBala: kendradiBala(rasiIndex, lagnaRasiIndex),
      drekkanaBala: sthanaMethod === 'raman' ? drekkanaBalaRaman(planet, degreeInSign) : drekkanaBala(planet, degreeInSign),
      saptavargajaBala: sthanaMethod === 'raman'
        ? saptavargajaBalaRaman(planet, rasiIndex, degreeInSign, rasiPositions)
        : saptavargajaBala(planet, rasiIndex, degreeInSign, rasiPositions),
    };
    const sthanaBala = sthana.uchchaBala + sthana.ojhayugmarasyamsaBala
      + sthana.kendradiBala + sthana.drekkanaBala + sthana.saptavargajaBala;

    const bphsAyanaBala = ayanaBala(planet, kranti(planet, birthJd));
    const kaala = {
      pakshaBala: isRamanKala ? pakshaBalaRaman(planet, longitudes, isWaxingMoon) : pakshaBala(planet, longitudes.Sun, longitudes.Moon),
      tribhagaBala: tribhagaBala(planet, isDaytime, thirdIndex),
      nathonnataBala: nathonnataBala(planet, birthJd, jdLocalMidnight, eotDays),
      ayanaBala: isRamanKala ? ayanaBalaRaman(planet, planetLongitude + ayanamsa) : bphsAyanaBala,
      varshaMasaDinaHoraBala: varshaMasaDinaHoraBala(planet, varshaMasaDinaHoraLords),
    };
    const kaalaBala = kaala.pakshaBala + kaala.tribhagaBala + kaala.nathonnataBala
      + kaala.varshaMasaDinaHoraBala + kaala.ayanaBala;

    let cheshtaBala;
    if (chestaMethod === 'raman') {
      cheshtaBala = planet === 'Sun' || planet === 'Moon' ? 0 : ramanChesta(planet, planetLongitude, birthJd, year).bala;
    } else if (planet === 'Moon') {
      cheshtaBala = kaala.pakshaBala;
    } else if (planet === 'Sun') {
      cheshtaBala = bphsAyanaBala;
    } else {
      cheshtaBala = chestaBalaFivePlanets(planet, planetLongitude, birthJd);
    }

    perPlanet[planet] = {
      sthana,
      sthanaBala,
      digBala: digBala(planet, planetLongitude, { ascendant, mc }),
      kaala,
      kaalaBala,
      naisargikaBala: naisargikaBala(planet),
      cheshtaBala,
      drikBala: drikOf(planet, longitudes, isWaxingMoon),
      shadbalaTotal: sourceRequired(
        'Cannot be honestly totalled while Ayana Bala remains a source-internal contradiction '
        + '(BPHS v.15-17 formula and table do not reconcile; Sthana, Dig, Kaala-except-Ayana, Naisargika, Cheshta and Drik Bala are all now fully resolved, Yuddha uses partial totals)',
      ),
    };
  }

  // Yuddha Bala (v.20, file p.233-234): a post-hoc delta between two warring
  // planets' Shadbala totals (winner: v.20 itself, plus the war-detection
  // and winner-determination rule from planetaryWar.js's v.9). The
  // *mechanism* (detect war, find the winner, transfer the difference) is
  // now fully sourced and implemented; its magnitude is honestly computed
  // from each planet's own *partial* total so far (Ayana and most Cheshta
  // Bala are still missing from that total), so this value will shift once
  // those remaining gaps are closed -- not presented as final in
  // `shadbalaTotal`, which still refuses to sum everything together.
  const partialTotalSoFar = Object.fromEntries(PLANETS.map((planet) => {
    const p = perPlanet[planet];
    return [planet, p.sthanaBala + p.digBala + p.kaalaBala + p.naisargikaBala + p.drikBala
      + (typeof p.cheshtaBala === 'number' ? p.cheshtaBala : 0)];
  }));
  for (const planet of PLANETS) {
    let delta = 0;
    for (const other of PLANETS) {
      if (other === planet) continue;
      const winner = warWinner(planet, other, longitudes, birthJd);
      if (!winner) continue;
      const diff = Math.abs(partialTotalSoFar[planet] - partialTotalSoFar[other]);
      delta += winner === planet ? diff : -diff;
    }
    perPlanet[planet].yuddhaBala = delta;
  }

  return attachSource({ perPlanet }, {
    ...BPHS_SHADBALA_SOURCE,
    pageLocus: 'file pages 218-236 (Ch.27 vv.1-25: Sthana/Dig/Kaala/Naisargika/Paksha/Tribhaga/Nathonnata/Saptavargaja/Varsha-Masa-Dina-Hora/Ayana/Drig/Yuddha Bala) — S10/S10-B/S10-D/S10-E/S10-F/S10-G, plus Ch.26 (Drishti Pinda, file p.209-211) for Drig Bala and Ch.79 v.9 (file p.776-777) for the Yuddha Bala winner rule',
  });
}

/**
 * Shadbala Pinda by Raman (Graha and Bhava Balas Art.121, Example 56): Sthana, Dik, Kala, Chesta and Naisargika Bala,
 * with Drik Bala added or subtracted as it is positive or negative. In Shashtiamsas; divide by 60 for rupas. Takes one
 * planet's entry from `calculateShadbala(...).perPlanet`. The BPHS reading does not total Shadbala (see shadbalaTotal).
 */
function ramanShadbalaPinda(entry) {
  return entry.sthanaBala + entry.digBala + entry.kaalaBala + entry.cheshtaBala + entry.naisargikaBala + entry.drikBala;
}

module.exports = {
  calculateShadbala,
  ramanShadbalaPinda,
  d1Dignity,
  dignityOfSign,
  DRIK_METHODS,
  drikBalaRaman,
  saptavargajaBalaRaman,
  drekkanaBalaRaman,
  pakshaBalaRaman,
  ramanKranti,
  ayanaBalaRaman,
  equationOfTimeDays,
  ramanChestaInterval,
  ramanChesta,
  uchchaBala,
  ojhayugmarasyamsaBala,
  kendradiBala,
  drekkanaBala,
  nathonnataBala,
  saptavargajaBala,
  drikBala,
  kranti,
  ayanaBala,
  chestaBalaFivePlanets,
  digBala,
  naisargikaBala,
  pakshaBala,
  tribhagaBala,
  findDayNightThird,
  varshaLord,
  masaLord,
  dinaLord,
  horaLord,
  computeVarshaMasaDinaHoraLords,
  varshaMasaDinaHoraBala,
  SEEGHROCHA,
  MEAN_MOTION_DAILY,
  MEAN_LONGITUDE_J2000,
  ABBREVIATED_AHARGANA_EPOCH_JD,
  EXALTATION,
  DEBILITATION,
  OWN_SIGNS,
  MOOLATRIKONA,
  SAPTAVARGAJA_POINTS,
  NAISARGIKA_RANK,
  VARSHA_MASA_DINA_HORA_VIRUPAS,
  SHADBALA_MINIMUM_VIRUPAS,
  SHADBALA_COMPONENT_MINIMUMS,
};
