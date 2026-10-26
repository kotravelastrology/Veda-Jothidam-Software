/**
 * Varshaphala interpretations from Tajika Bhushana (Ganesha Daivajna), over the annual chart that varshaphala.js builds. Each reading is a
 * verse of the book that applies to the chart's Muntha, Munthesha or year lord, with its printed page. Nothing is merged or ranked:
 * the book's own rule is that the strength of the Munthesha raises or lowers all of them (v.24), and it gives no numbers for that.
 *
 * Applied: Muntha in a bhava counted from the varsha lagna (v.11-22); planets in the Muntha's sign (v.5-9; Saturn's verse is not read);
 * the Munthesha's bhava from the varsha lagna (v.1-2); the Muntha's house from the janma lagna against the varsha lagna (v.23); the year
 * lord's three strength readings (v.4-24) beside the strength figure the engine computes.
 * Chapter 5 (printed pp.45-63) is added: each of the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn and Rahu in the bhava it holds from the varsha
 * lagna, one verse each (v.2-98, twelve per planet; Ketu is not given). The Moon's verse v.14 (the more of her light, the more auspicious) is carried
 * with her reading; the book gives no figure for it.
 * Not applied: conjunction by degree and aspects (the Tajika aspects of v.1, v.3), combustion and retrogression of the Munthesha (v.1),
 * Rahu-mukha and puccha (v.4: the Muntha is a sign here), and the grade of strength of the year lord (the verses give no thresholds).
 */
const T = require('./varshaInterpretationTables');

const SOURCE = {
  title: 'Tajika Bhushana',
  author: 'Ganesha Daivajna',
  tradition: 'Tajika (Varshaphala)',
  file: 'C28_Tajika_Bhushana_Ganesha.pdf',
  pageLocus: 'Chapters 2, 3 and 5, printed pp.10-21 and 45-63: Muntha-phala, Varshesha-phala and the planets in the twelve bhavas',
};

const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const TIER_TA = { STRONG: 'வலிமை', MIDDLE: 'நடுநிலை', WEAK: 'வலிமை குறைவு' };
const KENDRA = [1, 4, 7, 10];
const GOOD_MUNTHESHA = [9, 11, 3, ...KENDRA];
const BAD_MUNTHESHA = [8, 2, 6, 12];
const GOOD_HOUSES = [1, 2, 3, 5, 9, 10, 11];
const EVIL_HOUSES = [4, 6, 7, 8, 12];
const houseFrom = (sign, lagnaSign) => ((sign - lagnaSign + 12) % 12) + 1;

const reading = (id, titleTa, entry, extra = {}) => ({ id, titleTa, verse: entry.verse, printedPage: entry.printedPage, text: entry.text, ...extra });

/**
 * @param v  the object calculateVarshaphala returns
 * @returns { source, readings: [{id,titleTa,verse,printedPage,text,...}], yearLord: {planet, readings: [3], pvb}, facts, notApplied }
 */
function interpretVarsha(v) {
  const lagnaSign = v.varshaChart.lagna.rasiIndex;
  const munthaSign = v.muntha.rasiIndex;
  const natalLagnaSign = (((munthaSign - v.yearsElapsed) % 12) + 12) % 12;
  const munthaHouse = houseFrom(munthaSign, lagnaSign);
  const munthaHouseFromJanma = houseFrom(munthaSign, natalLagnaSign);
  const munthesha = v.muntha.lord;
  const munthesheaSign = v.varshaChart.grahas[munthesha].rasiIndex;
  const munthesheaHouse = houseFrom(munthesheaSign, lagnaSign);
  const readings = [];

  readings.push(reading('MUNTHA_HOUSE', `முந்தா வர்ஷ லக்னத்திலிருந்து ${munthaHouse}-ஆம் வீட்டில்`, T.munthaHouse[String(munthaHouse)], { house: munthaHouse }));
  const withMuntha = Object.keys(T.munthaWithPlanet).filter((p) => v.varshaChart.grahas[p].rasiIndex === munthaSign);
  for (const p of withMuntha) readings.push(reading(`MUNTHA_WITH_${p.toUpperCase()}`, `முந்தாவுடன் ${PLANET_TA[p]} (ஒரே ராசி)`, T.munthaWithPlanet[p], { planet: p }));
  if (BAD_MUNTHESHA.includes(munthesheaHouse)) readings.push(reading('MUNTHESHA_BAD', `முந்தேசன் (${PLANET_TA[munthesha]}) ${munthesheaHouse}-ஆம் வீட்டில்`, T.munthaLord.bad_houses, { house: munthesheaHouse, planet: munthesha }));
  if (GOOD_MUNTHESHA.includes(munthesheaHouse)) readings.push(reading('MUNTHESHA_GOOD', `முந்தேசன் (${PLANET_TA[munthesha]}) ${munthesheaHouse}-ஆம் வீட்டில்`, T.munthaLord.good_houses, { house: munthesheaHouse, planet: munthesha }));
  // v.23 does not list the good and bad places; the tenor of the twelve verses is used: good 1, 2, 3, 5, 9, 10, 11; bad 4, 6, 7, 8, 12
  const goodHouse = (h) => GOOD_HOUSES.includes(h);
  const evilHouse = (h) => EVIL_HOUSES.includes(h);
  const mixed = (goodHouse(munthaHouse) && evilHouse(munthaHouseFromJanma)) || (evilHouse(munthaHouse) && goodHouse(munthaHouseFromJanma));
  if (mixed) readings.push(reading('MUNTHA_MIXED', `முந்தா வர்ஷ லக்னத்திலிருந்து ${munthaHouse}-ஆம், ஜன்ம லக்னத்திலிருந்து ${munthaHouseFromJanma}-ஆம் வீட்டில்`, T.mixed, { houseFromVarshaLagna: munthaHouse, houseFromJanmaLagna: munthaHouseFromJanma }));
  readings.push(reading('BY_STRENGTH', 'முந்தேசனின் பலத்தால் கூடுதல் குறைவு', T.byStrength, { planet: munthesha }));

  const lord = v.varshesha;
  const cand = (v.varsheshaSelection.candidates || []).find((c) => c.planet === lord);
  const yearLord = {
    planet: lord, planetTa: PLANET_TA[lord], pvb: cand ? cand.pvb : null, roles: cand ? cand.roles : [],
    readings: T.yearLord[lord] ? T.yearLord[lord].map((e) => reading(`YEAR_LORD_${e.tier}`, `வர்ஷபதி ${PLANET_TA[lord]} — ${TIER_TA[e.tier]}`, e, { tier: e.tier, tierTa: TIER_TA[e.tier] })) : [],
  };
  const BHAVA_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'];
  const bhavaPhala = BHAVA_PLANETS.map((planet) => {
    const house = houseFrom(v.varshaChart.grahas[planet].rasiIndex, lagnaSign);
    const e = T.bhavaPhala[planet][String(house)];
    return { planet, planetTa: PLANET_TA[planet], house, sign: v.varshaChart.grahas[planet].rasiIndex, verse: e.verse, printedPage: e.printedPage, text: e.text,
      note: planet === 'Moon' ? { verse: T.moonGeneral.verse, printedPage: T.moonGeneral.printedPage, text: T.moonGeneral.text } : null };
  });
  return {
    source: SOURCE,
    readings,
    bhavaPhala,
    yearLord,
    facts: { munthaSign, munthaHouse, munthaHouseFromJanmaLagna: munthaHouseFromJanma, munthesha, munthesheaHouse, planetsWithMuntha: withMuntha },
    notApplied: T.notRead.concat(['Tajika aspects, combustion and retrogression (v.1, v.3)', 'Year lord strength grade: no thresholds in the verses']),
  };
}

module.exports = { interpretVarsha, SOURCE, BAD_MUNTHESHA, GOOD_MUNTHESHA, GOOD_HOUSES, EVIL_HOUSES };
