/**
 * The last six lines of the Avakhada chakra (Parashara's Light page 1): Varga, Yunja, Hansak (Tatwa), Naamakshar and the two Payas.
 *
 *  - Yunja: Purva is the six nakshatras from Revati (Revati to Mrigashira), Madhya the twelve from Ardra (to Anuradha), Para the nine from Jyeshtha (to Uttara Bhadrapada);
 *    Vishnu Bhaskar, Advanced Techniques of Predictive Astrology vol.1, ch.9, "Yunja Priti" (printed p.102).
 *  - Paya by the birth nakshatra: silver the twelve from Ardra, copper the nine from Jyeshtha, gold the three from Revati, iron the three from Krittika;
 *    Shanker Adawal, Know About Astrology, ch.11, "Birth Nakshatra and Paya" (printed p.263).
 *  - Hansak (Tatwa): the element of the Moon's sign (fire Aries, Leo, Sagittarius; earth Taurus, Virgo, Capricorn; air Gemini, Libra, Aquarius; water Cancer, Scorpio, Pisces).
 *  - Varga: the first letter of the Naamakshar belongs to one of the eight vargas (Vishnu Bhaskar, "Varga Priti": A, Ka, Cha, Tta, Ta, Pa, Ya, Sha), named for the animal of Parashara's Light:
 *    Garuda, Marjara, Simha, Shwana, Sarpa, Mushaka, Mriga, Mesha. The order of the animals is the traditional one; PL9's four printouts (Simha, Mriga, Mesha) agree with it.
 *  - Naamakshar: the syllable of the nakshatra's pada, the traditional 108, in PL9's spelling (Le is "Lay", Hi is "Hee"). Not yet read from a printed table of the library (the four printouts agree).
 *  - Paya by the Moon's house from the Lagna: gold 1, 6, 11; silver 2, 5, 9; copper 3, 7, 10; iron 4, 8, 12. The rule is the one that reproduces all four printouts; its book has not been found.
 */
const VARGA_ANIMALS = ['Garuda', 'Marjara', 'Simha', 'Shwana', 'Sarpa', 'Mushaka', 'Mriga', 'Mesha'];
// [syllable, varga] for the four padas of each of the 27 nakshatras, Ashwini to Revati
const PADAS = [
  [['Chu', 2], ['Che', 2], ['Cho', 2], ['La', 6]], [['Li', 6], ['Lu', 6], ['Le', 6], ['Lo', 6]], [['A', 0], ['I', 0], ['U', 0], ['E', 0]],
  [['O', 0], ['Va', 6], ['Vi', 6], ['Vu', 6]], [['Ve', 6], ['Vo', 6], ['Ka', 1], ['Ki', 1]], [['Ku', 1], ['Gha', 1], ['Ng', 1], ['Chha', 2]],
  [['Ke', 1], ['Ko', 1], ['Ha', 7], ['Hi', 7]], [['Hu', 7], ['He', 7], ['Ho', 7], ['Da', 3]], [['Di', 3], ['Du', 3], ['De', 3], ['Do', 3]],
  [['Ma', 5], ['Mi', 5], ['Mu', 5], ['Me', 5]], [['Mo', 5], ['Ta', 3], ['Ti', 3], ['Tu', 3]], [['Te', 3], ['To', 3], ['Pa', 5], ['Pi', 5]],
  [['Pu', 5], ['Sha', 7], ['Na', 3], ['Tha', 3]], [['Pe', 5], ['Po', 5], ['Ra', 6], ['Ri', 6]], [['Ru', 6], ['Re', 6], ['Ro', 6], ['Ta', 4]],
  [['Ti', 4], ['Tu', 4], ['Te', 4], ['To', 4]], [['Na', 4], ['Ni', 4], ['Nu', 4], ['Ne', 4]], [['No', 4], ['Ya', 6], ['Yi', 6], ['Yu', 6]],
  [['Ye', 6], ['Yo', 6], ['Bha', 5], ['Bhi', 5]], [['Bhu', 5], ['Dha', 4], ['Pha', 5], ['Dha', 3]], [['Bhe', 5], ['Bho', 5], ['Ja', 2], ['Ji', 2]],
  [['Ju', 2], ['Je', 2], ['Jo', 2], ['Gha', 1]], [['Ga', 1], ['Gi', 1], ['Gu', 1], ['Ge', 1]], [['Go', 1], ['Sa', 7], ['Si', 7], ['Su', 7]],
  [['Se', 7], ['So', 7], ['Da', 4], ['Di', 4]], [['Du', 4], ['Tha', 4], ['Jha', 2], ['Na', 2]], [['De', 4], ['Do', 4], ['Cha', 2], ['Chi', 2]],
];
const ELEMENTS = ['Agni', 'Prithvi', 'Vayu', 'Jala']; // Aries, Taurus, Gemini, Cancer, then round again

/** PL9's spelling: a final e is "ay", a final i "ee" (Le, Lay; Hi, Hee). */
const spell = (s) => (s.length === 1 ? { A: 'A', I: 'Ee', U: 'U', E: 'Ay', O: 'O' }[s] : s.replace(/e$/, 'ay').replace(/i$/, 'ee'));

/** star: 0 (Ashwini) to 26; pada 1-4; moonSign and lagnaSign 0 (Aries) to 11. */
function avakhadaExtra({ star, pada, moonSign, lagnaSign }) {
  const [syllable, varga] = PADAS[star][pada - 1];
  const fromRevati = (star + 1) % 27; // Revati 0, Ashwini 1 ... Uttara Bhadrapada 26
  const yunja = fromRevati < 6 ? 'Poorva' : (star >= 5 && star < 17 ? 'Madhya' : 'Para');
  const fromArdra = (star - 5 + 27) % 27;
  const fromJyeshtha = (star - 17 + 27) % 27;
  const payaNakshatra = fromArdra < 12 ? 'Silver' : (fromJyeshtha < 9 ? 'Copper' : (fromRevati < 3 ? 'Gold' : 'Iron'));
  const house = ((moonSign - lagnaSign + 12) % 12) + 1;
  const payaRashi = [1, 6, 11].includes(house) ? 'Gold' : ([2, 5, 9].includes(house) ? 'Silver' : ([3, 7, 10].includes(house) ? 'Copper' : 'Iron'));
  return { varga: VARGA_ANIMALS[varga], yunja, hansak: ELEMENTS[moonSign % 4], naamakshar: spell(syllable), payaRashi, payaNakshatra };
}

module.exports = { avakhadaExtra, PADAS, VARGA_ANIMALS };
