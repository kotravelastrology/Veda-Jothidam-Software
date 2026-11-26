/**
 * Female horoscopy, BPHS ch.80 (Santhanam, vol.2, printed pp.953-965; fixture fixtures/female/bphs-80.json): what the chapter says of a woman's chart, read against the chart rule
 * by rule as the book words it. Aspects are BPHS ch.26's counted by signs (pravrajyaYoga.js); benefics are the Moon, Mercury, Jupiter and Venus and malefics the Sun, Mars, Saturn,
 * Rahu and Ketu. The book does not say which of the Ascendant and the Moon is stronger, so each is read; strength, retrogression and equal strength are not checked, and the
 * print's unclear v.40 and v.44 are given as facts. Every statement is the book's and none is a verdict.
 */
const { calculateTrimsamsa } = require('../chart/vargaChart');
const { NATURAL_ENEMIES } = require('../chart/planetaryRelationship');
const { navamshaSign } = require('./specialPoints');
const { aspects, aspectors, houseFrom, PLANETS } = require('./pravrajyaYoga');
const N = require('../sources/tamilNames');
const DATA = require('../../fixtures/female/bphs-80.json');

const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const BENEFICS = Object.freeze(['Moon', 'Mercury', 'Jupiter', 'Venus']);
const MALEFICS = Object.freeze(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);
const ALL = Object.freeze([...PLANETS, 'Rahu', 'Ketu']);
const MOVABLE = Object.freeze([0, 3, 6, 9]);
const ta = (p) => N.PLANET_TA[p] ?? p;
const list = (ps) => (ps.length ? ps.map(ta).join(', ') : 'இல்லை');
const isEven = (sign) => sign % 2 === 1; // Taurus (1) is the 2nd sign, an even one
const signTa = (s) => N.RASI_TA[s];

/**
 * @param f { signs: {Sun..Ketu: 0-11}, longitudes: {Sun..Saturn}, lagnaSign, lagnaLongitude, vara: 0-6 (0 = Sunday), nakshatra: 0-26, tithi: 1-30 }
 * @returns {{ id: string, status: 'held'|'not-held'|'unknown'|'not-checked', detail: string, effect?: string }[]}
 */
function evaluate(f) {
  const out = [];
  const R = DATA.rules;
  const ruleFor = (id) => {
    if (R[id]) return { text: R[id].ta, verses: R[id].verses, page: R[id].page };
    if (id.startsWith('EIGHTH_')) {
      const p = ALL.find((x) => x.toUpperCase() === id.slice(7));
      return { text: `8-ஆம் வீட்டில் ${ta(p)}: ${DATA.eighth[p]}.`, verses: DATA.eighth.verses, page: DATA.eighth.page };
    }
    if (id === 'SIGN_NATURE') return { text: DATA.signNature.even.ta.split(' (')[0], verses: '5-7', page: '956' };
    if (id.startsWith('TRIMSAMSA')) return { text: DATA.trimsamsa.ta.split(' (')[0].replace('பெண்ணின் பலன்கள் ', 'பெண்ணின் பலன்கள் '), verses: DATA.trimsamsa.verses, page: DATA.trimsamsa.page };
    throw new Error(`no rule for ${id}`);
  };
  const put = (id, status, detail, effect) => out.push({ id, status, detail, ...(effect ? { effect } : {}), ...ruleFor(id) });
  const { signs } = f;
  const lagna = f.lagnaSign;
  const moon = signs.Moon;
  const occ = (sign) => ALL.filter((p) => signs[p] === sign);
  const hasBen = (ps) => ps.filter((p) => BENEFICS.includes(p));
  const hasMal = (ps) => ps.filter((p) => MALEFICS.includes(p));
  const seventh = (lagna + 6) % 12;
  const eighth = (lagna + 7) % 12;
  const fifth = (lagna + 4) % 12;
  const o7 = occ(seventh);
  const o8 = occ(eighth);
  const settingNavamsa = navamshaSign((f.lagnaLongitude + 180) % 360);

  // v.5-7: the signs of the Ascendant and the Moon
  const lagnaEven = isEven(lagna);
  const moonEven = isEven(moon);
  const nature = lagnaEven && moonEven ? 'even' : !lagnaEven && !moonEven ? 'odd' : 'mixed';
  const benOn = BENEFICS.filter((p) => (signs[p] === lagna || aspects(p, signs[p], lagna)) && p !== 'Moon');
  const malOn = (sign) => MALEFICS.filter((p) => signs[p] === sign || (PLANETS.includes(p) && aspects(p, signs[p], sign)));
  const natureFacts = `லக்னம் ${signTa(lagna)} (${lagnaEven ? 'இரட்டைப்படை' : 'ஒற்றைப்படை'}), சந்திரன் ${signTa(moon)} (${moonEven ? 'இரட்டைப்படை' : 'ஒற்றைப்படை'}).`;
  put('SIGN_NATURE', 'held', `${natureFacts}${nature === 'even' ? ` லக்னத்தில் சுபர் சேர்க்கை/பார்வை: ${list(benOn)}.` : nature === 'odd' ? ` பாவிகள் லக்னத்தில்/பார்வையில்: ${list(malOn(lagna))}; சந்திரனில்: ${list(malOn(moon))}.` : ''}`, DATA.signNature[nature].ta);

  // v.8-16: the sign owner and Trimsamsa lord of the Ascendant and of the Moon
  for (const [id, label, lon] of [['TRIMSAMSA_LAGNA', 'லக்னம்', f.lagnaLongitude], ['TRIMSAMSA_MOON', 'சந்திரன்', f.longitudes.Moon]]) {
    const sign = Math.floor(lon / 30);
    const tri = SIGN_LORD[calculateTrimsamsa(sign, lon % 30)];
    const owner = SIGN_LORD[sign];
    put(id, 'held', `${label}: ${signTa(sign)} (அதிபதி ${ta(owner)}), த்ரிம்சாம்சம் ${ta(tri)}.`, DATA.trimsamsa.table[owner][tri]);
  }

  // v.17-21: the 7th house
  const benAsp7 = aspectors(signs, seventh).filter((p) => BENEFICS.includes(p));
  const seventhFacts = `7-ஆம் வீடு ${signTa(seventh)}: ${list(o7)}.`;
  put('SEVENTH_EMPTY', !o7.length && !benAsp7.length ? 'held' : 'not-held', `${seventhFacts} சுபப் பார்வை: ${list(benAsp7)}.`, R.SEVENTH_EMPTY.ta);
  put('SEVENTH_MOVABLE', MOVABLE.includes(seventh) ? 'held' : 'not-held', `${signTa(seventh)} ${MOVABLE.includes(seventh) ? 'சர' : 'சர அல்லாத'} ராசி.`, R.SEVENTH_MOVABLE.ta);
  put('SEVENTH_MERCURY_SATURN', o7.includes('Mercury') && o7.includes('Saturn') ? 'held' : 'not-held', seventhFacts, R.SEVENTH_MERCURY_SATURN.ta);
  put('SEVENTH_SUN', o7.includes('Sun') ? 'held' : 'not-held', seventhFacts, R.SEVENTH_SUN.ta);
  put('SEVENTH_MARS', o7.includes('Mars') ? 'held' : 'not-held', seventhFacts, R.SEVENTH_MARS.ta);
  put('SEVENTH_SATURN', o7.includes('Saturn') ? 'held' : 'not-held', seventhFacts, R.SEVENTH_SATURN.ta);
  const mal7 = hasMal(o7);
  const ben7 = hasBen(o7);
  put('SEVENTH_MALEFIC', mal7.length ? 'held' : 'not-held', `${seventhFacts} பாவிகள்: ${list(mal7)}.`, R.SEVENTH_MALEFIC.ta);
  put('SEVENTH_BENEFIC', ben7.length ? 'held' : 'not-held', `${seventhFacts} சுபர்: ${list(ben7)}.`, R.SEVENTH_BENEFIC.ta);
  put('SEVENTH_MIXED', ben7.length && mal7.length ? 'held' : 'not-held', seventhFacts, R.SEVENTH_MIXED.ta);
  const marsNav = navamshaSign(f.longitudes.Mars);
  const venusNav = navamshaSign(f.longitudes.Venus);
  const swap = [1, 6].includes(marsNav) && [0, 7].includes(venusNav);
  put('MARS_VENUS_NAVAMSA', swap ? 'held' : 'not-held', `செவ்வாயின் நவாம்சம் ${signTa(marsNav)}, சுக்கிரனின் நவாம்சம் ${signTa(venusNav)}.${swap ? ` சந்திரன் 7-ஆம் வீட்டில்: ${o7.includes('Moon') ? 'ஆம்' : 'இல்லை'}.` : ''}`, R.MARS_VENUS_NAVAMSA.ta);

  // v.22-25 and v.35: the 7th house sign and the setting Navamsa
  const owner7 = SIGN_LORD[seventh];
  const ownerNav = SIGN_LORD[settingNavamsa];
  put('SEVENTH_SIGN', 'held', `7-ஆம் வீட்டு ராசி ${signTa(seventh)} (அதிபதி ${ta(owner7)}): ${DATA.seventhOwners[owner7]}. அஸ்தமன நவாம்சம் ${signTa(settingNavamsa)} (அதிபதி ${ta(ownerNav)}): ${DATA.seventhOwners[ownerNav]}.${owner7 === ownerNav ? '' : ' ராசியும் நவாம்சமும் வேறு: நூல் கலப்புப் பலன் என்கிறது.'}`);
  put('NAVAMSA7', ownerNav === 'Mars' || BENEFICS.includes(ownerNav) ? 'held' : 'not-held', `அஸ்தமன நவாம்சம் ${signTa(settingNavamsa)} (அதிபதி ${ta(ownerNav)}).`, ownerNav === 'Mars' ? 'பெண்ணுறுப்பில் நோய்' : BENEFICS.includes(ownerNav) ? 'நல்ல அமைப்பும் கணவனின் அன்பும்' : undefined);

  // v.26-33: planets in the 8th
  const eighthFacts = `8-ஆம் வீடு ${signTa(eighth)}: ${list(o8)}.`;
  for (const p of ALL.filter((x) => DATA.eighth[x])) put(`EIGHTH_${p.toUpperCase()}`, o8.includes(p) ? 'held' : 'not-held', eighthFacts, o8.includes(p) ? DATA.eighth[p] : undefined);

  // v.34, 38, 39, 41: childlessness and its causes
  const mv = signs.Moon === signs.Venus;
  const together = occ(signs.Moon);
  const mal5 = hasMal(occ(fifth)).concat(aspectors(signs, fifth).filter((p) => MALEFICS.includes(p) && !occ(fifth).includes(p)));
  put('BARREN_34', mv && (together.includes('Saturn') || together.includes('Mars')) && mal5.length ? 'held' : 'not-held',
    `சந்திரனும் சுக்கிரனும் ${mv ? 'ஒரே ராசியில்' : 'வெவ்வேறு ராசிகளில்'}; அவர்களுடன் சனி/செவ்வாய்: ${list(together.filter((p) => p === 'Saturn' || p === 'Mars'))}; 5-ஆம் வீட்டில் அல்லது பார்வையில் பாவிகள்: ${list(mal5)}.`, R.BARREN_34.ta);
  put('LAGNA_VENUS_MOON', [2, 5].includes(lagna) && signs.Venus === lagna && signs.Moon === lagna ? 'held' : 'not-held', `லக்னம் ${signTa(lagna)}: ${list(occ(lagna))}.`, R.LAGNA_VENUS_MOON.ta);
  const lagnaOcc = occ(lagna);
  put('LAGNA_MOON_MERCURY_VENUS', ['Moon', 'Mercury', 'Venus'].every((p) => lagnaOcc.includes(p)) ? 'held' : 'not-held', `லக்னத்தில்: ${list(lagnaOcc)}.`, R.LAGNA_MOON_MERCURY_VENUS.ta);
  put('LAGNA_JUPITER', lagnaOcc.includes('Jupiter') ? 'held' : 'not-held', `லக்னத்தில்: ${list(lagnaOcc)}.`, R.LAGNA_JUPITER.ta);
  put('EIGHTH_SUN_MOON', [4, 3].includes(eighth) && o8.includes('Sun') && o8.includes('Moon') ? 'held' : 'not-held', eighthFacts, R.EIGHTH_SUN_MOON.ta);
  put('EIGHTH_MERCURY_MOON', [2, 5, 3].includes(eighth) && o8.includes('Mercury') && o8.includes('Moon') ? 'held' : 'not-held', eighthFacts, R.EIGHTH_MERCURY_MOON.ta);
  const malLagna = aspectors(signs, lagna).filter((p) => MALEFICS.includes(p));
  put('BARREN_39', [0, 7, 9, 10].includes(lagna) && lagnaOcc.includes('Moon') && lagnaOcc.includes('Venus') && malLagna.length ? 'held' : 'not-held',
    `லக்னம் ${signTa(lagna)}: ${list(lagnaOcc)}; பாவிகளின் பார்வை: ${list(malLagna)}.`, R.BARREN_39.ta);
  put('DEAD_CHILD_40', 'not-checked', `நூலின் வரி தெளிவில்லை. 7-ஆம் வீட்டில்: ${list(o7)}; 5-ஆம் வீட்டில்: ${list(occ(fifth))}; 8-ஆம் வீட்டில்: ${list(o8)}.`);
  put('NO_CONCEPTION_41', (['Jupiter', 'Venus', 'Mars'].every((p) => o8.includes(p)) || (o8.includes('Mars') && o8.includes('Saturn'))) ? 'held' : 'not-held', eighthFacts, R.NO_CONCEPTION_41.ta);

  // v.42: Papa Kartari of the Ascendant and the Moon (whether the malefic before is direct and the one after retrograde is not checked)
  const kartari = (sign) => hasMal(occ((sign + 11) % 12)).length > 0 && hasMal(occ((sign + 1) % 12)).length > 0;
  const kl = kartari(lagna);
  const km = kartari(moon);
  put('PAPA_KARTARI', kl && km ? 'unknown' : 'not-held',
    `லக்னத்துக்கு 12-இல் பாவிகள்: ${list(hasMal(occ((lagna + 11) % 12)))}, 2-இல்: ${list(hasMal(occ((lagna + 1) % 12)))}; சந்திரனுக்கு 12-இல்: ${list(hasMal(occ((moon + 11) % 12)))}, 2-இல்: ${list(hasMal(occ((moon + 1) % 12)))}.${kl && km ? ' இரண்டும் சூழப்பட்டுள்ளன; நேர்கதி, வக்ரம் சோதிக்கப்படவில்லை.' : ''}`, kl && km ? R.PAPA_KARTARI.ta : undefined);

  // v.43-46: Visha Kanya
  const combos = [[0, 8, 2], [6, 2, 7], [2, 23, 12]];
  const tithiNo = ((f.tithi - 1) % 15) + 1;
  const visha = combos.some(([v, n, t]) => f.vara === v && f.nakshatra === n && tithiNo === t);
  const WEEKDAY = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
  put('VISHA_KANYA_43', visha ? 'held' : 'not-held', `பிறந்த கிழமை ${WEEKDAY[f.vara]}, நட்சத்திரம் ${N.NAKSHATRA_TA[f.nakshatra]}, திதி ${tithiNo}.`, visha ? `${R.VISHA_KANYA_43.ta} ${R.VISHA_KANYA_EFFECT.ta}` : undefined);
  const enemies = PLANETS.filter((p) => NATURAL_ENEMIES[p].includes(SIGN_LORD[signs[p]]));
  const lagnaBen = hasBen(lagnaOcc);
  const lagnaMal = hasMal(lagnaOcc);
  put('VISHA_KANYA_44', lagnaBen.length && lagnaMal.length && enemies.length >= 2 ? 'unknown' : 'not-held',
    `லக்னத்தில்: ${list(lagnaOcc)} (சுபர் ${lagnaBen.length ? 'உண்டு' : 'இல்லை'}, பாவி ${lagnaMal.length ? 'உண்டு' : 'இல்லை'}); இயல்பாகப் பகை ராசியில் உள்ள கிரகங்கள்: ${list(enemies)}.${lagnaBen.length && lagnaMal.length && enemies.length >= 2 ? ' நூலின் வரி இரு கிரகங்கள் எவை என்று சொல்லவில்லை.' : ''}`,
    lagnaBen.length && lagnaMal.length && enemies.length >= 2 ? `${R.VISHA_KANYA_44.ta} ${R.VISHA_KANYA_EFFECT.ta}` : undefined);
  const lord7 = SIGN_LORD[seventh];
  const seventhFromMoon = (moon + 6) % 12;
  const relief = [seventh, seventhFromMoon].some((s) => occ(s).some((p) => p === lord7 || BENEFICS.includes(p)) || signs[lord7] === s);
  put('VISHA_KANYA_RELIEF', relief ? 'held' : 'not-held', `7-ஆம் அதிபதி ${ta(lord7)} ${signTa(signs[lord7])} ராசியில்; லக்னத்திலிருந்து 7-ஆம் வீட்டில்: ${list(o7)}; சந்திரனிலிருந்து 7-ஆம் வீட்டில் (${signTa(seventhFromMoon)}): ${list(occ(seventhFromMoon))}. (விஷ கன்னி நிலை உள்ளபோது மட்டும் பொருள்.)`, relief ? R.VISHA_KANYA_RELIEF.ta : undefined);

  // v.47: Mars in the 12th, 4th, 7th or 8th from the Ascendant, unaspected by or associated with a benefic
  const marsHouse = houseFrom(lagna, signs.Mars);
  const benWithMars = occ(signs.Mars).filter((p) => BENEFICS.includes(p));
  const benAspMars = aspectors(signs, signs.Mars, 'Mars').filter((p) => BENEFICS.includes(p));
  put('WIDOW_47', [12, 4, 7, 8].includes(marsHouse) && !benWithMars.length && !benAspMars.length ? 'held' : 'not-held',
    `செவ்வாய் லக்னத்திலிருந்து ${marsHouse}-ஆம் வீட்டில்; சேர்ந்த சுபர்: ${list(benWithMars)}; பார்க்கும் சுபர்: ${list(benAspMars)}.`, R.WIDOW_47.ta);

  // v.50-51
  const mutualAspect = aspects('Venus', signs.Venus, signs.Saturn) && aspects('Saturn', signs.Saturn, signs.Venus);
  const mutualNav = [9, 10].includes(navamshaSign(f.longitudes.Venus)) && [1, 6].includes(navamshaSign(f.longitudes.Saturn));
  const risingNav = navamshaSign(f.lagnaLongitude);
  put('LUST_50', [1, 6].includes(lagna) && [9, 10].includes(risingNav) && (mutualAspect || mutualNav) ? 'held' : 'not-held',
    `லக்னம் ${signTa(lagna)}, உதய நவாம்சம் ${signTa(risingNav)}; சுக்கிர-சனி பரஸ்பரப் பார்வை: ${mutualAspect ? 'உண்டு' : 'இல்லை'}; பரஸ்பர நவாம்சம்: ${mutualNav ? 'உண்டு' : 'இல்லை'}.`, R.LUST_50.ta);
  put('LEARNED_52', lagnaEven ? 'unknown' : 'not-held', `லக்னம் ${signTa(lagna)} (${lagnaEven ? 'இரட்டைப்படை' : 'ஒற்றைப்படை'}); குரு, செவ்வாய், புதன், சுக்கிரன் பலமாக உள்ளனரா என்பது சோதிக்கப்படவில்லை.`, lagnaEven ? R.LEARNED_52.ta : undefined);
  put('ASCETIC_53', mal7.length && o8.length ? 'held' : 'not-held', `7-ஆம் வீட்டுப் பாவிகள்: ${list(mal7)}; 8-ஆம் வீட்டில்: ${list(o8)}.`, R.ASCETIC_53.ta);
  const ben8 = hasBen(o8);
  const mal8 = hasMal(o8).concat(aspectors(signs, eighth).filter((p) => MALEFICS.includes(p) && !o8.includes(p)));
  put('DIES_BEFORE_54', ben8.length && !mal8.length ? 'held' : 'not-held', `8-ஆம் வீட்டுச் சுபர்: ${list(ben8)}; அங்கு அல்லது பார்வையில் பாவிகள்: ${list(mal8)}.`, R.DIES_BEFORE_54.ta);
  put('EQUAL_55', 'not-checked', 'சுபர்-பாவிகளின் எண்ணிக்கையும் வலிமையும் சமம் என்பதன் அளவு நூலில் இல்லை.');
  return out;
}

module.exports = { DATA, SIGN_LORD, BENEFICS, MALEFICS, evaluate, isEven };
