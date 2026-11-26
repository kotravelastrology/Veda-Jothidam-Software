/**
 * The rest of BPHS ch.70 (Santhanam, vol.2, printed pp.884-886 and 893; fixture fixtures/ashtakavarga/bphs-70-rest.json) that ashtakavargaEffects.js does not read:
 *  - v.37-40: the years of distress from Saturn's Ashtakavarga: the rekhas from the Ascendant to Saturn, from Saturn to the Ascendant and their sum, each counted with both signs, give a year of life;
 *  - v.16-18: the father's good yogas that the birth chart alone can show (the 4th lord's dasha; the 4th lord in the Ascendant, the 11th or the 11th or 10th from the Moon; the 10th lord in the Ascendant);
 *  - v.19-23: the signs with the most and the fewest rekhas in the Sun's and the Moon's Ashtakavarga, between which the book chooses the times for auspicious acts.
 */
const DATA = require('../../fixtures/ashtakavarga/bphs-70-rest.json');

const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);

/** The rekhas from sign `from` forward to sign `to`, both signs counted. */
function sumForward(rekhas, from, to) {
  let sum = 0;
  for (let i = from; ; i = (i + 1) % 12) {
    sum += rekhas[i];
    if (i === to) break;
  }
  return sum;
}

/**
 * The years of v.37-40 from Saturn's Bhinnashtakavarga `rekhas` (index 0 = Aries).
 * @returns {{ toSaturn: number, fromSaturn: number, total: number }} each a year of life (the 30th year is from the 29th to the 30th birthday)
 */
function saturnYears(rekhas, lagnaSign, saturnSign) {
  const toSaturn = sumForward(rekhas, lagnaSign, saturnSign);
  const fromSaturn = sumForward(rekhas, saturnSign, lagnaSign);
  return { toSaturn, fromSaturn, total: toSaturn + fromSaturn };
}

/** The signs with the most and with the fewest rekhas in a Bhinnashtakavarga (all that tie are listed). */
function extremes(rekhas) {
  const top = Math.max(...rekhas);
  const low = Math.min(...rekhas);
  return { most: rekhas.flatMap((r, s) => (r === top ? [s] : [])), fewest: rekhas.flatMap((r, s) => (r === low ? [s] : [])), top, low };
}

/** The house (1-12) of sign `sign` from sign `base`. */
const houseFrom = (sign, base) => ((sign - base + 12) % 12) + 1;

/**
 * The father's yogas of v.16-18 that the birth chart shows.
 * @param signs { Sun..Saturn: 0-11 }
 * @returns {{ lord4: string, lord10: string, lord4House: number, lord4HouseFromMoon: number, obedient: boolean, tenthLordInLagna: boolean }}
 */
function fatherYogas({ signs, lagnaSign }) {
  const lord4 = SIGN_LORD[(lagnaSign + 3) % 12];
  const lord10 = SIGN_LORD[(lagnaSign + 9) % 12];
  const lord4House = houseFrom(signs[lord4], lagnaSign);
  const lord4HouseFromMoon = houseFrom(signs[lord4], signs.Moon);
  return {
    lord4, lord10, lord4House, lord4HouseFromMoon,
    obedient: [1, 11].includes(lord4House) || [11, 10].includes(lord4HouseFromMoon),
    tenthLordInLagna: signs[lord10] === lagnaSign,
  };
}

/**
 * What v.15 and v.17 (3), (4) ask of the father's chart, from the signs of the father's Ascendant and Moon (0-11) and the native's chart. The book says 'the birth' is in the 3rd or the
 * 10th rasi from the father's Ascendant or Moon without saying whether the native's Ascendant or Moon sign is meant, so all four houses are given and 'third' and 'tenth' are true
 * when any of them is the 3rd or the 10th.
 * @returns {{ nativeLagna: {fromFatherLagna: number, fromFatherMoon: number}, nativeMoon: {fromFatherLagna: number, fromFatherMoon: number}, third: boolean, tenth: boolean,
 *   succession: { lagnaIsEighth: boolean, lord8: string, lord8InNativeLagna: boolean, held: boolean } }}
 */
function fatherLink({ signs, lagnaSign, father }) {
  const nativeLagna = { fromFatherLagna: houseFrom(lagnaSign, father.lagnaSign), fromFatherMoon: houseFrom(lagnaSign, father.moonSign) };
  const nativeMoon = { fromFatherLagna: houseFrom(signs.Moon, father.lagnaSign), fromFatherMoon: houseFrom(signs.Moon, father.moonSign) };
  const houses = [nativeLagna.fromFatherLagna, nativeLagna.fromFatherMoon, nativeMoon.fromFatherLagna, nativeMoon.fromFatherMoon];
  const lord8 = SIGN_LORD[(father.lagnaSign + 7) % 12];
  const lagnaIsEighth = nativeLagna.fromFatherLagna === 8;
  const lord8InNativeLagna = signs[lord8] === lagnaSign;
  return { nativeLagna, nativeMoon, third: houses.includes(3), tenth: houses.includes(10), succession: { lagnaIsEighth, lord8, lord8InNativeLagna, held: lagnaIsEighth || lord8InNativeLagna } };
}

module.exports = { DATA, SIGN_LORD, sumForward, saturnYears, extremes, fatherYogas, fatherLink };
