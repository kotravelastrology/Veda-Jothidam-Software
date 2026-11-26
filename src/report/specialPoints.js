/**
 * The special points of the horoscope book's page 7 (PL9 "Special Lagnas and Points"): Indu Lagna, Beeja / Kshetra Sphuta, the Yogi point with
 * the Yogi, Avayogi and Duplicate Yogi, the 64th Navamsha, the 22nd Drekkana and the Sarpa Dreshkana.
 *
 *  - Indu Lagna: kalas Sun 30, Moon 16, Mars 6, Mercury 8, Jupiter 10, Venus 12, Saturn 1; the kalas of the lords of the 9th from the Lagna and of
 *    the 9th from the Moon are added, the sum is reduced by 12 (a remainder of 0 is 12) and counted from the Moon's sign, which is the first
 *    (K.N. Rao and Metha, Ashtakvarga ch.17, pp.58-59). PL9 prints its degree as 15:00:00.
 *  - Beeja Sphuta (a man) = Sun + Venus + Jupiter; Kshetra Sphuta (a woman) = Moon + Mars + Jupiter, each reduced by 360 degrees. Its sign and
 *    its Navamsha, odd or even, are judged (K.N. Rao, Analysing Horoscope through modern techniques, pp.86-87).
 *  - Yogi point = Sun + Moon + 93 degrees 20 minutes; its Nakshatra's Vimshottari lord is the Yogi, its sign's lord the Duplicate Yogi, and the
 *    lord of the 6th Nakshatra from the Yogi's (that one counted as the 1st) the Avayogi (Seshadri Iyer, New Techniques of Predictions vol.2;
 *    K. Sutton, Personal Panchanga p.142).
 *  - 64th Navamsha: the 4th sign from the sign of the Navamsha of the Moon (and of the Lagna) (Raj Kumar, Charisma of Navamsha 4.7; BPHS ch.20 v.99).
 *  - 22nd Drekkana: the Drekkana of the 8th sign that has the same number as the Lagna's (or the Moon's) own (K.N. Rao, Pataki Rishta Chakra p.104).
 *  - Sarpa Dreshkana: the planets in the 2nd and 3rd Drekkana of Cancer, the 1st and 2nd of Scorpio and the 3rd of Pisces (same page; PL9 leaves Taurus out).
 * Against PL9 these reproduce the printed values on Arjun (12 May 1983) and Kotravel (15 Nov 1973), the Beeja Sphuta of Arjun to one second.
 */
const { NAKSHATRA_LORDS } = require('../dasha/vimshottariDasha');

const SIGN_LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const INDU_KALA = { Sun: 30, Moon: 16, Mars: 6, Mercury: 8, Jupiter: 10, Venus: 12, Saturn: 1 };
const SARPA = [[3, [1, 2]], [7, [0, 1]], [11, [2]]]; // sign index, the Drekkanas (0-based) that are Sarpa
const YOGI_CONSTANT = 93 + 20 / 60;
const NAKSHATRA_SPAN = 360 / 27;

const norm360 = (d) => ((d % 360) + 360) % 360;
/** PL9 adds the planets' longitudes as printed, to the second (on two charts this is the only way to its last second). */
const toSecond = (deg) => Math.round(deg * 3600) / 3600;
const signOf = (lon) => Math.floor(norm360(lon) / 30);
/** The Navamsha sign of a longitude (the nine parts of a sign counted from Aries, Capricorn, Libra, Cancer for the fire, earth, air, water signs). */
function navamshaSign(lon) {
  const s = signOf(lon);
  return ([0, 9, 6, 3][s % 4] + Math.floor((norm360(lon) % 30) / (30 / 9))) % 12;
}
const drekkanaNumber = (lon) => Math.floor((norm360(lon) % 30) / 10); // 0, 1, 2
const isOdd = (sign) => sign % 2 === 0; // Aries (0) is the first, an odd sign

function indu({ lagnaLongitude, moonLongitude }) {
  const ninthLord = (sign) => SIGN_LORD[(sign + 8) % 12];
  const sum = INDU_KALA[ninthLord(signOf(lagnaLongitude))] + INDU_KALA[ninthLord(signOf(moonLongitude))];
  const remainder = sum % 12 || 12;
  return { sign: (signOf(moonLongitude) + remainder - 1) % 12, degree: 15, kalas: sum };
}

/**
 * Beeja Sphuta for a man, Kshetra Sphuta for a woman, and the odd/even verdict of its sign and Navamsha.
 * `outcome` is the book's: 'certain' (odd and odd for a man, even and even for a woman), 'none' (the reverse) or 'delayed' (mixed).
 */
function beeja({ longitudes, female = false }) {
  const parts = female ? ['Moon', 'Mars', 'Jupiter'] : ['Sun', 'Venus', 'Jupiter'];
  const longitude = norm360(parts.reduce((sum, p) => sum + toSecond(longitudes[p]), 0));
  const sign = signOf(longitude);
  const navamsha = navamshaSign(longitude);
  const wanted = female ? (s) => !isOdd(s) : isOdd;
  const good = [sign, navamsha].filter(wanted).length;
  return {
    name: female ? 'Kshetra Sphuta' : 'Beeja Sphuta', parts, longitude, sign, navamsha,
    signOdd: isOdd(sign), navamshaOdd: isOdd(navamsha),
    outcome: good === 2 ? 'certain' : good === 0 ? 'none' : 'delayed',
  };
}

function yogi({ sunLongitude, moonLongitude }) {
  const longitude = norm360(toSecond(sunLongitude) + toSecond(moonLongitude) + YOGI_CONSTANT);
  const nakshatra = Math.floor(longitude / NAKSHATRA_SPAN);
  return {
    longitude,
    yogi: NAKSHATRA_LORDS[nakshatra],
    duplicateYogi: SIGN_LORD[signOf(longitude)],
    avayogi: NAKSHATRA_LORDS[(nakshatra + 5) % 27],
  };
}

/** The 4th sign from the Navamsha sign of each longitude. */
const navamsha64 = (longitude) => (navamshaSign(longitude) + 3) % 12;

/** The sign of the 22nd Drekkana: the same-numbered Drekkana of the 8th sign, which falls in the sign (8th + 4 x its number from 0). */
const drekkana22 = (longitude) => (signOf(longitude) + 7 + 4 * drekkanaNumber(longitude)) % 12;

/** The planets (from `longitudes`, name -> longitude) that stand in a Sarpa Dreshkana. */
function sarpaDreshkana(longitudes) {
  return Object.entries(longitudes)
    .filter(([, lon]) => SARPA.some(([sign, parts]) => signOf(lon) === sign && parts.includes(drekkanaNumber(lon))))
    .map(([planet]) => planet);
}

module.exports = { indu, beeja, yogi, navamsha64, drekkana22, sarpaDreshkana, navamshaSign, signOf, SIGN_LORD };
