/**
 * Navamsha counts ("Navamsha Ages"): how many navamshas lie between the ascendant's navamsha and each planet's, the
 * navamshas being the 108 equal divisions of 3d20' round the zodiac from Aries. The count runs both ways, both ends
 * included. A navamsha is read as a year of life, so the count is the year in which the book says the planet's matter
 * falls due.
 *
 * What the books say (stated by their own words, no more):
 *  - Prasna Marga (B.V. Raman's translation) ch.10 stanza 50, printed p.140: "the number of Navamsas from Lagna Navamsa to the
 *    Navamsa occupied by the most evil planet" (Sun, Mars, Saturn, Rahu, Gulika, Thrisphuta, Mrityu) is days, months or years,
 *    as the affliction is great, less or least, within which the querist's death may take place — a horary use, death only.
 *  - Hora Sara ch.17, vv.88½-91½, as C. Patel gives it in "Navamsa in Astrology" ch.10 (printed pp.100-103): the number of
 *    Navamsas from the Navamsa of Saturn, of Rahu and of Mars up to the ascendant's, both inclusive, is a year of injury or
 *    calamity; from the Moon, Mercury, Jupiter and Venus, a year of progeny, wealth and happiness. The e-text of Hora Sara we hold
 *    (Bhagat's) words this as "add the Navamshas of Shani and Lagna", so the two readings differ and both are kept.
 *  - Patel: "one Navamsa equals one year of life"; for every navamsha the birth ascendant gains (about 13m20s of time) the
 *    year of each planet's event is one later.
 * PL9's "Navamsha ages" (the number set against each planet) is the count from the ascendant's navamsha, ascendant = 1.
 */

const NAVAMSHA = 360 / 108;
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const SOURCES = Object.freeze({
  prasnaMarga: {
    title: 'Prasna Marga', author: 'B.V. Raman (translation)', tradition: 'Prasna', file: 'prasna-marga-1.pdf',
    pageLocus: 'Chapter 10 stanza 50, printed p.140: "The number of Navamsas from Lagna Navamsa to the Navamsa occupied by the most evil planet amongst Mandi, etc., represents the number of days, months or years … within which the querist\'s death may take place"',
  },
  horaSaraPatel: {
    title: 'Navamsa in Astrology', author: 'C. Patel', tradition: 'Jataka (modern, citing Hora Sara)', file: 'Jyotish_Navamsa in astrology_C. Patel.pdf',
    pageLocus: 'Chapter 10 "Eventful years in one\'s life", printed pp.100-103, citing Hora Sara ch.17 vv.88½-91½: number of Navamsas from the Navamsa of Saturn (Rahu, Mars) up to the ascendant\'s, both inclusive, a year of injury; from the benefics, a year of progeny, wealth and happiness',
  },
});

/** Navamsha number 0-107 of a sidereal longitude, counted from the start of Aries. */
const indexOf = (longitude) => Math.floor((((longitude % 360) + 360) % 360) / NAVAMSHA);

/** The count from `from` to `to` along the zodiac, both included (1-108). */
const countBetween = (fromIdx, toIdx) => ((toIdx - fromIdx + 108) % 108) + 1;

/**
 * For each planet: the count from the ascendant's navamsha to the planet's (`fromLagna`, PL9's number and Prasna Marga's
 * direction) and from the planet's to the ascendant's (`toLagna`, Hora Sara's direction as Patel gives it). `longitudes`
 * maps planet names to sidereal longitudes.
 */
function navamshaCounts(lagnaLongitude, longitudes) {
  const lagna = indexOf(lagnaLongitude);
  return {
    lagnaIndex: lagna,
    planets: PLANETS.filter((p) => longitudes[p] !== undefined).map((planet) => {
      const idx = indexOf(longitudes[planet]);
      return {
        planet, index: idx, sign: Math.floor(idx / 9), place: (idx % 9) + 1,
        fromLagna: countBetween(lagna, idx), toLagna: countBetween(idx, lagna),
        group: ['Saturn', 'Rahu', 'Mars'].includes(planet) ? 'MALEFIC' : (['Moon', 'Mercury', 'Jupiter', 'Venus'].includes(planet) ? 'BENEFIC' : 'OTHER'),
      };
    }),
  };
}

module.exports = { NAVAMSHA, PLANETS, SOURCES, indexOf, countBetween, navamshaCounts };
