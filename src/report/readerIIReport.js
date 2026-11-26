/**
 * Reader II (C65) descriptions for one chart: the Lagna and Moon signs, the twelve houses and the grahas.
 * Built from the sign, house and planet descriptions; nothing is computed here beyond picking the entries.
 * The Rahu entry stands for Ketu too (the two nodes are one text in the book).
 */
const { SIGNS, SIGN_TA } = require('./readerIISigns');
const { SIGN_DESCRIPTIONS } = require('./readerIISignDescriptions');
const { HOUSE_DESCRIPTIONS } = require('./readerIIHouseDescriptions');
const { PLANET_DESCRIPTIONS } = require('./readerIIPlanetDescriptions');

const HOUSE_ORDER = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth'];
const HOUSE_NUMBER_TA = ['முதல்', 'இரண்டாம்', 'மூன்றாம்', 'நான்காம்', 'ஐந்தாம்', 'ஆறாம்', 'ஏழாம்', 'எட்டாம்', 'ஒன்பதாம்', 'பத்தாம்', 'பதினொன்றாம்', 'பன்னிரண்டாம்'];
// [label in Tamil, grahas key in the chart, key in the planet descriptions]
const GRAHA_ORDER = [
  ['சூரியன்', 'Sun', 'Sun'], ['சந்திரன்', 'Moon', 'Moon'], ['செவ்வாய்', 'Mars', 'Mars'], ['புதன்', 'Mercury', 'Mercury'],
  ['குரு', 'Jupiter', 'Jupiter'], ['சுக்கிரன்', 'Venus', 'Venus'], ['சனி', 'Saturn', 'Saturn'],
  ['ராகு', 'Rahu', 'Rahu'], ['கேது', 'Ketu', 'Rahu'],
];

function signEntry(rasiIndex) {
  const name = SIGNS[rasiIndex];
  const d = name ? SIGN_DESCRIPTIONS[name] : null;
  if (!d) return null;
  return {
    sign: name, signTa: SIGN_TA[rasiIndex], pageFrom: d.pageFrom, pageTo: d.pageTo,
    sections: d.sections.map((s) => ({ id: s.id, page: s.page, titleTa: s.titleTa, en: s.en, ta: s.ta })),
  };
}

function houseEntry(key, number) {
  const d = HOUSE_DESCRIPTIONS[key];
  return { house: number, houseTa: HOUSE_NUMBER_TA[number - 1], titleTa: d.titleTa, pageFrom: d.pageFrom, pageTo: d.pageTo, page: d.page, en: d.en, ta: d.ta };
}

function planetEntry(labelTa, grahaKey, descKey, rasiIndex) {
  const d = PLANET_DESCRIPTIONS[descKey];
  const signName = rasiIndex === undefined ? null : SIGNS[rasiIndex];
  return {
    graha: grahaKey, labelTa, sign: signName, signTa: rasiIndex === undefined ? null : SIGN_TA[rasiIndex],
    titleTa: d.titleTa, pageFrom: d.pageFrom, pageTo: d.pageTo, page: d.page, en: d.en, ta: d.ta,
  };
}

/** The Reader II entries for one chart. `chart` is the calculated chart (lagna.rasiIndex, grahas[name].rasiIndex). */
function buildReaderIIReport(chart) {
  const lagnaIndex = chart?.lagna?.rasiIndex;
  const moonIndex = chart?.grahas?.Moon?.rasiIndex;
  return {
    available: true,
    source: 'K.S. Krishnamurti, Reader II (C65), printed pp.97-492',
    lagna: lagnaIndex === undefined ? null : signEntry(lagnaIndex),
    moon: moonIndex === undefined ? null : signEntry(moonIndex),
    houses: HOUSE_ORDER.map((key, i) => houseEntry(key, i + 1)),
    planets: GRAHA_ORDER.map(([labelTa, grahaKey, descKey]) => planetEntry(labelTa, grahaKey, descKey, chart?.grahas?.[grahaKey]?.rasiIndex)),
  };
}

module.exports = { buildReaderIIReport, HOUSE_ORDER, GRAHA_ORDER };
