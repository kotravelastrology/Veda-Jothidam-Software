/**
 * K.S. Krishnamurti, Reader V "Transit" (corpus C33), printed pp.40-110 "What each star signifies to each lagna or rasi borns": a planet that stands in (or transits) a star gives the results
 * of the houses the star's lord owns, counted from the lagna sign; the three stars of one lord are the same. For Aries to Pisces the book lists, lord by lord, the houses owned
 * (checked against all twelve lagnas: Aries Venus 2, 7 / Sun 5 / Moon 4 / Mars 1, 8 / Jupiter 9, 12 / Saturn 10, 11 / Mercury 3, 6; Taurus Venus 1, 6 ... Pisces Mercury 4, 7). Rahu and Ketu own no sign:
 * the book reads them from the planet conjoined with them, then the one aspecting them, then the lord of their sign and star (pp.42-43). The house lists here are derived from ownership; the
 * worked remarks of each lagna in the book (e.g. Saturn's Anuradha for Aries) are the author's observations and are not repeated.
 */
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const OWNER = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
// the star lords in the order of the nakshatras from Ashwini, with the three stars of each (Ashwini, Magha, Moola ...)
const STAR_GROUPS = [
  ['Ketu', ['Ashwini', 'Magha', 'Moola']], ['Venus', ['Bharani', 'Purva Phalguni', 'Purva Ashadha']], ['Sun', ['Krittika', 'Uttara Phalguni', 'Uttara Ashadha']],
  ['Moon', ['Rohini', 'Hasta', 'Shravana']], ['Mars', ['Mrigashira', 'Chitra', 'Dhanishta']], ['Rahu', ['Ardra', 'Swati', 'Shatabhisha']],
  ['Jupiter', ['Punarvasu', 'Vishakha', 'Purva Bhadrapada']], ['Saturn', ['Pushya', 'Anuradha', 'Uttara Bhadrapada']], ['Mercury', ['Ashlesha', 'Jyeshtha', 'Revati']],
];
const STAR_TA = {
  Ashwini: 'அசுவினி', Magha: 'மகம்', Moola: 'மூலம்', Bharani: 'பரணி', 'Purva Phalguni': 'பூரம்', 'Purva Ashadha': 'பூராடம்', Krittika: 'கிருத்திகை', 'Uttara Phalguni': 'உத்திரம்', 'Uttara Ashadha': 'உத்திராடம்',
  Rohini: 'ரோகிணி', Hasta: 'அஸ்தம்', Shravana: 'திருவோணம்', Mrigashira: 'மிருகசீரிடம்', Chitra: 'சித்திரை', Dhanishta: 'அவிட்டம்', Ardra: 'திருவாதிரை', Swati: 'சுவாதி', Shatabhisha: 'சதயம்',
  Punarvasu: 'புனர்பூசம்', Vishakha: 'விசாகம்', 'Purva Bhadrapada': 'பூரட்டாதி', Pushya: 'பூசம்', Anuradha: 'அனுஷம்', 'Uttara Bhadrapada': 'உத்திரட்டாதி', Ashlesha: 'ஆயில்யம்', Jyeshtha: 'கேட்டை', Revati: 'ரேவதி',
};
const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader V: Transit (Gochara Phala Nirnayam)',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C33_KP_Reader_V_Transit_KSK.pdf',
  pageLocus: 'What each star signifies to each lagna, printed pp.40-110',
};

/** Houses (1-12) owned by a planet counted from the lagna sign (an index 0-11 or a sign name). */
function housesOwned(lagnaSign, planet) {
  const lagna = typeof lagnaSign === 'number' ? lagnaSign : SIGNS.indexOf(lagnaSign);
  if (lagna < 0) throw new RangeError(`unknown sign: ${lagnaSign}`);
  const out = [];
  for (let i = 0; i < 12; i += 1) if (OWNER[(lagna + i) % 12] === planet) out.push(i + 1);
  return out;
}

/** @returns the nine star groups with the houses their lord owns from this lagna; nodes carry `agent: true` and no houses */
function lagnaStarTable(lagnaSign) {
  return STAR_GROUPS.map(([lord, stars]) => {
    const houses = ['Rahu', 'Ketu'].includes(lord) ? [] : housesOwned(lagnaSign, lord);
    return { lord, stars, starsTa: stars.map((s) => STAR_TA[s]), houses, agent: houses.length === 0 };
  });
}

module.exports = { SIGNS, OWNER, STAR_GROUPS, STAR_TA, SOURCE, housesOwned, lagnaStarTable };
