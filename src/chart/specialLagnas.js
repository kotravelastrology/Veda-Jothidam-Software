/**
 * Special ascendants of BPHS chapter 5 (R. Santhanam's translation, Vol.1 printed pp.62-67; file
 * `Jyotish_BPHS_Santhanam_Vol.1_2 chapters missing.pdf`, PDF page = printed page): Bhava Lagna, Hora Lagna and Ghatika Lagna
 * (verses 1-9) and Varnada Lagna (verses 10-24).
 *
 * From sunrise to birth: Bhava Lagna advances one sign for every 5 ghatis (120 minutes), Hora Lagna one sign for every 2½ ghatis
 * (60 minutes), Ghatika Lagna one sign for every ghati (24 minutes) and a vighati is half a degree; each is added to the Sun's
 * longitude at sunrise. Varnada: count the ascendant and the Hora Lagna from Aries if odd, from Pisces backward if even, add the
 * two counts if alike and take the difference if not, and count the result from Aries if odd, from Pisces backward if even.
 *
 * The book's worked example (birth at 12 ghatis 30 vighatis, Sun at sunrise 4s 12d = 132d): Bhava Lagna 207d (Libra 27),
 * Hora Lagna 282d (Capricorn 12), Ghatika Lagna 147d (Leo 27); and Varnada for a Libra ascendant with Hora Lagna in Scorpio is
 * Aries — both are the test.
 *
 * The book does not say what "sunrise" is. `sunriseKind` in `sunriseBefore` offers the app's visible sunrise (the Panchangam's)
 * and the geometric one (the Sun's centre on the horizon, no refraction), which reproduces the PL9 screen to a few hundredths of
 * a degree. A birth before sunrise takes the sunrise of the day before.
 */

const norm = (x) => ((x % 360) + 360) % 360;

const SOURCE = Object.freeze({
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  tradition: 'Parashari',
  file: 'Jyotish_BPHS_Santhanam_Vol.1_2 chapters missing.pdf',
  pageLocus: 'Chapter 5 "Special Ascendants" vv.1-24, printed pp.62-67: "From Sunrise to the time of birth every 5 ghatis (or 120 minutes) constitute one Bhava Lagna … Hora Lagna repeats itself every 2½ ghatis (60 minutes) … Ghatika Lagna changes along with every Ghatika (24 minutes)"',
});

/** Bhava Lagna: one sign per 5 ghatis from sunrise, added to the Sun's longitude at sunrise (v.2-3). */
const bhavaLagna = (sunAtSunrise, hoursSinceSunrise) => norm(sunAtSunrise + hoursSinceSunrise * 15);
/** Hora Lagna: one sign per 2½ ghatis (v.4-5). */
const horaLagna = (sunAtSunrise, hoursSinceSunrise) => norm(sunAtSunrise + hoursSinceSunrise * 30);
/** Ghatika Lagna: one sign per ghati, a vighati being half a degree (v.6-8). */
const ghatikaLagna = (sunAtSunrise, hoursSinceSunrise) => norm(sunAtSunrise + hoursSinceSunrise * 75);

/** The count of a sign (1 = Aries … 12 = Pisces) as v.10-11 take it: from Aries if odd, from Pisces backward if even. */
const countOf = (sign) => (sign % 2 === 1 ? sign : 13 - sign);

/** The sign (1-12) reached by counting `n` signs: from Aries if n is odd, from Pisces backward if even (v.12-13). */
function signFromCount(n) {
  if (n % 2 === 1) return ((n - 1) % 12) + 1;
  return ((((12 - n) % 12) + 12) % 12) + 1;
}

/** Varnada Lagna of a lagna and the Hora Lagna, as signs 1-12 (v.10-13). */
function varnadaLagna(lagnaSign, horaSign) {
  const a = countOf(lagnaSign);
  const b = countOf(horaSign);
  const n = (a % 2 === b % 2) ? a + b : Math.abs(a - b);
  return { counts: [a, b], total: n, sign: signFromCount(n) };
}

/**
 * All of them. `lagnaLongitude` and the Sun's longitude at sunrise are sidereal; `hoursSinceSunrise` is the time from the
 * sunrise that began the birth's day (a birth before sunrise: from the day before's).
 */
function specialLagnas({ lagnaLongitude, sunLongitudeAtSunrise, hoursSinceSunrise }) {
  const bhava = bhavaLagna(sunLongitudeAtSunrise, hoursSinceSunrise);
  const hora = horaLagna(sunLongitudeAtSunrise, hoursSinceSunrise);
  const ghatika = ghatikaLagna(sunLongitudeAtSunrise, hoursSinceSunrise);
  const lagnaSign = Math.floor(norm(lagnaLongitude) / 30) + 1;
  const horaSign = Math.floor(hora / 30) + 1;
  const varnada = varnadaLagna(lagnaSign, horaSign);
  return {
    source: SOURCE,
    ghatisSinceSunrise: (hoursSinceSunrise * 60) / 24,
    bhava, hora, ghatika,
    varnada: { ...varnada, longitude: null },
  };
}

module.exports = { SOURCE, bhavaLagna, horaLagna, ghatikaLagna, countOf, signFromCount, varnadaLagna, specialLagnas, norm };
