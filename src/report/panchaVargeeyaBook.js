/**
 * Pancha-Vargeeya bala as Tajika Bhushana gives it (Ganesha edition, chapter 1 v.20-33, printed pp.5-9; PDF page = printed + 4):
 *  v.21-22  the five offices are own house (atma-sthana), exaltation, hadda, trairashika (drekkana) and mushallaha; own houses by the lords of the signs;
 *  v.23     exaltation signs: Sun Aries, Moon Taurus, Mars Capricorn, Mercury Virgo, Jupiter Cancer, Venus Pisces, Saturn Libra;
 *  v.24-29  hadda: the verses give the degrees in number-words and the table on printed p.8 in digits;
 *  v.30     drekkana lords by sign (table, printed p.8): the seven planets in the order Mars, Mercury, Jupiter, Venus, Saturn, Sun, Moon, counted along the twelve first drekkanas,
 *           then the twelve second, then the twelve third ("bhaumato ravi-śukrāt": from Mars, from the Sun, from Venus; the commentary says the Moon for the second, the table and verse the Sun);
 *  v.31     mushallaha lords by sign (table, printed p.9): three lords for each sign;
 *  v.32     the strength in own house, exaltation, hadda, drekkana, mushallaha is 30, 20, 15, 10, 5 ("triṃśad viṃśati tithayo diśaś ca pañca");
 *  v.33     in a friend's place three quarters of that, in a neutral's a half, in an enemy's a quarter (table printed p.9: own house 22.5/15/7.5, hadda 11.25/7.5/3.75,
 *           drekkana 7.5/5/2.5, mushallaha 3.75/2.5/1.25).
 *
 * Readings that are mine, kept visible in the output:
 *  - Hadda: the digits of the table on printed p.8 for Gemini (Venus), Scorpio (Jupiter) and Pisces (Mars) do not total 30 degrees as printed (8, 7 and 6 where the sign
 *    wants 6, 5 and 9); the verses give rasa-anga-indriya (6, 6, 5), ...-iṣu (5) and nava (9), which total 30 and are used. Virgo is Mercury 7, Venus 6, Jupiter 4, Mars 7, Saturn 6
 *    in both table and verse; the Egyptian terms in `panchaVargeeyaBala.js` (Venus 10, Saturn 2) differ there.
 *  - Mushallaha: the table lists three planets under each sign without degrees; they are taken top to bottom as the first, second and third ten degrees.
 *  - Exaltation: 20 when the planet is in its exaltation sign and nothing otherwise (the verses give no graded scale).
 *  - Friend, neutral, enemy: the book gives no list in this chapter; the natural friendship of `planetaryRelationship.js` is used. A planet in its own place is "own".
 *  - Rahu and Ketu have no place in the scheme.
 */
const { naturalRelation } = require('../chart/planetaryRelationship');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const WEIGHT = Object.freeze({ kshetra: 30, uchcha: 20, hadda: 15, drekkana: 10, mushallaha: 5 });
const FRACTION = Object.freeze({ own: 1, friend: 0.75, neutral: 0.5, enemy: 0.25 });

// v.22: Leo Sun, Cancer Moon, Aries/Scorpio Mars, Virgo/Gemini Mercury, Sagittarius/Pisces Jupiter, Libra/Taurus Venus, Capricorn/Aquarius Saturn
const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const EXALTATION_SIGN = Object.freeze({ Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 });

const JU = 'Jupiter', VE = 'Venus', ME = 'Mercury', MA = 'Mars', SA = 'Saturn';
/** Hadda: [planet, degrees] x5 for Aries to Pisces (printed p.8; see the note above for Gemini, Scorpio, Pisces). */
const HADDA = Object.freeze([
  [[JU, 6], [VE, 6], [ME, 8], [MA, 5], [SA, 5]],
  [[VE, 8], [ME, 6], [JU, 8], [SA, 5], [MA, 3]],
  [[ME, 6], [VE, 6], [JU, 5], [MA, 7], [SA, 6]],
  [[MA, 7], [VE, 6], [ME, 6], [JU, 7], [SA, 4]],
  [[JU, 6], [VE, 5], [SA, 7], [ME, 6], [MA, 6]],
  [[ME, 7], [VE, 6], [JU, 4], [MA, 7], [SA, 6]],
  [[SA, 6], [ME, 8], [JU, 7], [VE, 7], [MA, 2]],
  [[MA, 7], [VE, 4], [ME, 8], [JU, 5], [SA, 6]],
  [[JU, 12], [VE, 5], [ME, 4], [MA, 5], [SA, 4]],
  [[ME, 7], [JU, 7], [VE, 8], [SA, 4], [MA, 4]],
  [[ME, 7], [VE, 6], [JU, 7], [MA, 5], [SA, 5]],
  [[VE, 12], [JU, 4], [ME, 3], [MA, 9], [SA, 2]],
].map((s) => Object.freeze(s.map((b) => Object.freeze(b)))));

/** The digits printed in the table of printed p.8 where they differ from the verses: sign -> [planet, printed, used]. */
const HADDA_PRINT_DIFFERS = Object.freeze({ 2: [VE, 8, 6], 7: [JU, 7, 5], 11: [MA, 6, 9] });

/** Drekkana (v.30, table printed p.8): counted along the first drekkanas of Aries to Pisces, then the second drekkanas, then the third (12 + 12 + 12), the seven planets in this order one after another. */
const DREKKANA_ORDER = Object.freeze([MA, ME, JU, VE, SA, 'Sun', 'Moon']);
/** Mushallaha (v.31, table printed p.9): the three lords of each sign, first to third ten degrees (the same for the four signs of each triplicity). */
const MUSHALLAHA = Object.freeze([
  ['Sun', JU, SA], [VE, 'Moon', MA], [SA, ME, JU], [VE, MA, 'Moon'],
  ['Sun', JU, SA], [VE, 'Moon', MA], [SA, ME, JU], [VE, MA, 'Moon'],
  ['Sun', JU, SA], [VE, 'Moon', MA], [SA, ME, JU], [VE, MA, 'Moon'],
].map((r) => Object.freeze(r)));

const norm = (x) => ((x % 360) + 360) % 360;

function haddaLord(lon) {
  const sign = Math.floor(norm(lon) / 30);
  const deg = norm(lon) % 30;
  let end = 0;
  for (const [planet, width] of HADDA[sign]) {
    end += width;
    if (deg < end) return planet;
  }
  return HADDA[sign][4][0]; // a sign whose bands fall short of 30 closes with the last
}
const drekkanaLord = (lon) => DREKKANA_ORDER[(Math.floor((norm(lon) % 30) / 10) * 12 + Math.floor(norm(lon) / 30)) % 7];
const mushallahaLord = (lon) => MUSHALLAHA[Math.floor(norm(lon) / 30)][Math.floor((norm(lon) % 30) / 10)];

/** Own, friend, neutral or enemy of the planet in the place of `lord`. */
function standing(planet, lord) {
  if (lord === planet) return 'own';
  return naturalRelation(planet, lord);
}

/** @returns {{planet, total, parts: {kshetra, uchcha, hadda, drekkana, mushallaha}}} each part {lord, standing, points} */
function panchaVargeeyaBook(planet, lon) {
  if (!PLANETS.includes(planet)) throw new Error(`Pancha-Vargeeya covers the seven planets, not ${planet}`);
  const sign = Math.floor(norm(lon) / 30);
  const place = (key, lord) => {
    const st = standing(planet, lord);
    return { lord, standing: st, points: WEIGHT[key] * FRACTION[st] };
  };
  const ownSign = SIGN_LORD[sign] === planet;
  const parts = {
    kshetra: ownSign ? { lord: planet, standing: 'own', points: WEIGHT.kshetra } : place('kshetra', SIGN_LORD[sign]),
    uchcha: { lord: null, standing: EXALTATION_SIGN[planet] === sign ? 'exalted' : 'not exalted', points: EXALTATION_SIGN[planet] === sign ? WEIGHT.uchcha : 0 },
    hadda: place('hadda', haddaLord(lon)),
    drekkana: place('drekkana', drekkanaLord(lon)),
    mushallaha: place('mushallaha', mushallahaLord(lon)),
  };
  const total = Object.values(parts).reduce((s, p) => s + p.points, 0);
  return { planet, total, parts };
}

module.exports = { panchaVargeeyaBook, haddaLord, drekkanaLord, mushallahaLord, HADDA, HADDA_PRINT_DIFFERS, DREKKANA_ORDER, MUSHALLAHA, EXALTATION_SIGN, SIGN_LORD, WEIGHT, FRACTION, PLANETS };
