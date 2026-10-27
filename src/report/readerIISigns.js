/**
 * K.S. Krishnamurti, Reader II "Fundamental Principles of Astrology" (corpus C65), printed pp.97-116: the thirteen groups into which the twelve signs fall, and the text the book gives for
 * each group. The text itself is in readerIISignTables.js (English as printed, with a Tamil rendering). This file holds the sign-to-group table (checked against every list the book prints,
 * test-reader-ii-signs.js) and the reading of a chart: the group of each house cusp's sign and of each planet's sign, and how many planets stand in each element, quality and polarity.
 * Nothing here is a verdict: the book says the classes "modify" the results; it does not give a conclusion for a chart.
 */
const SECTIONS = require('./readerIISignTables');

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

const SOURCE = {
  title: 'Fundamental Principles of Astrology (Hindu - Western & Stellar), Reader No. II',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C65_KP_Reader_II_Fundamental_Principles_KSK.pdf',
  pageLocus: 'Twelve signs: their classification and their influence, printed pp.97-116 (PDF page = printed + 10)',
};

const idx = (names) => names.map((n) => SIGNS.indexOf(n));
const ELEMENT = { fire: idx(['Aries', 'Leo', 'Sagittarius']), earth: idx(['Taurus', 'Virgo', 'Capricorn']), air: idx(['Gemini', 'Libra', 'Aquarius']), water: idx(['Cancer', 'Scorpio', 'Pisces']) };
const QUALITY = { movable: idx(['Aries', 'Cancer', 'Libra', 'Capricorn']), fixed: idx(['Taurus', 'Leo', 'Scorpio', 'Aquarius']), common: idx(['Gemini', 'Virgo', 'Sagittarius', 'Pisces']) };
const POSITIVE = idx(['Aries', 'Gemini', 'Leo', 'Libra', 'Sagittarius', 'Aquarius']);
const FRUITFUL = idx(['Cancer', 'Scorpio', 'Pisces']);
const SEMI_FRUITFUL = idx(['Taurus', 'Libra', 'Capricorn', 'Sagittarius']);
const BARREN = idx(['Aries', 'Gemini', 'Leo', 'Virgo']);
const MUTE = FRUITFUL;
const VIOLENT = idx(['Aries', 'Scorpio']);
const HUMAN = idx(['Gemini', 'Virgo', 'Aquarius']);
const VOICE = idx(['Gemini', 'Libra', 'Aquarius']);
const BESTIAL = idx(['Aries', 'Taurus', 'Leo', 'Capricorn']);
const DUAL = idx(['Gemini', 'Sagittarius', 'Pisces']);
const BICORPOREAL = idx(['Gemini', 'Pisces']);
const SHORT_ASC = idx(['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini']);

/**
 * The groups of one sign. `degree` (0 <= degree < 30, optional) decides the two halves of Sagittarius: the first half is human and bicorporal, the second bestial.
 * Libra is "humane" to some authors only (printed p.115) and is not listed as human here; `humaneByAuthors` says so.
 */
function classesOf(sign, degree = null) {
  const i = typeof sign === 'number' ? sign : SIGNS.indexOf(sign);
  if (i < 0) throw new RangeError(`unknown sign: ${sign}`);
  const sagHalf = i === 8 && degree !== null ? (degree < 15 ? 1 : 2) : null;
  const element = Object.keys(ELEMENT).find((k) => ELEMENT[k].includes(i));
  const quality = Object.keys(QUALITY).find((k) => QUALITY[k].includes(i));
  const out = {
    sign: SIGNS[i], polarity: POSITIVE.includes(i) ? 'positive' : 'negative',
    hemisphere: i < 6 ? 'northern' : 'southern',
    equinoctial: i === 0 || i === 6 ? (i === 0 ? 'vernal' : 'autumnal') : null,
    tropical: i === 3 || i === 9 ? (i === 3 ? 'summer solstitial' : 'winter solstitial') : null,
    element, quality,
    fruitfulness: FRUITFUL.includes(i) ? 'fruitful' : SEMI_FRUITFUL.includes(i) ? 'semi-fruitful' : BARREN.includes(i) ? 'barren' : null,
    mute: MUTE.includes(i), violent: VIOLENT.includes(i),
    human: HUMAN.includes(i) || sagHalf === 1,
    humaneByAuthors: i === 6,
    voice: VOICE.includes(i),
    bestial: BESTIAL.includes(i) || sagHalf === 2,
    dual: DUAL.includes(i), bicorporal: BICORPOREAL.includes(i) || sagHalf === 1,
    ascension: SHORT_ASC.includes(i) ? 'short' : 'long',
  };
  if (sagHalf !== null) out.sagittariusHalf = sagHalf;
  return out;
}

/** The classes of every sign, for a table or a test. */
function signClassTable() {
  return SIGNS.map((s) => classesOf(s));
}

/** The printed section ids that describe a sign's groups (the element, quality and polarity text, and the group texts of the sign's own special groups). */
function sectionsFor(cls) {
  const ids = [];
  ids.push('POSITIVE_NEGATIVE');
  ids.push({ fire: 'FIERY', earth: 'EARTHY', air: 'AIRY', water: 'WATERY' }[cls.element]);
  ids.push({ movable: 'MOVABLE', fixed: 'FIXED', common: 'COMMON' }[cls.quality]);
  if (cls.fruitfulness) ids.push('FRUITFUL_BARREN');
  if (cls.mute) ids.push('MUTE');
  if (cls.violent) ids.push('VIOLENT');
  if (cls.human) ids.push('HUMAN');
  if (cls.voice) ids.push('VOICE');
  if (cls.bestial) ids.push('BESTIAL');
  if (cls.dual) ids.push('DUAL');
  if (cls.bicorporal) ids.push('BICORPOREAL');
  ids.push(cls.ascension === 'short' ? 'SHORT_LONG' : 'LONG');
  return [...new Set(ids)];
}

/**
 * A chart read through the classes: the group of each house cusp's sign (and of its degree, for Sagittarius), and the planets of the seven classical planets by element, quality, polarity.
 * Our reading of the book's "majority of planets" is four or more of the seven (Sun to Saturn); this is stated in `majorityRule`.
 * @param kp calculateKpSystem result
 */
function classifyChart(kp) {
  if (!kp?.available || !Array.isArray(kp.cusps)) return { available: false };
  const cusps = kp.cusps.map((c) => {
    const degree = c.longitude % 30;
    const cls = classesOf(c.sign, degree);
    return { house: c.number, degree, sign: cls.sign, signTa: SIGN_TA[SIGNS.indexOf(cls.sign)], cls, labelsTa: labelsTa(cls), sections: sectionsFor(cls).map((id) => SECTIONS.find((s) => s.id === id)) };
  });
  const classical = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const planets = kp.positions.filter((p) => classical.includes(p.name));
  const placed = planets.map((p) => classesOf(p.sign, p.degreeInSign ?? null));
  const count = (key) => {
    const tally = {};
    for (const cls of placed) {
      if (!cls[key]) continue;
      tally[cls[key]] = (tally[cls[key]] ?? 0) + 1;
    }
    return tally;
  };
  const byElement = count('element');
  const byQuality = count('quality');
  const byPolarity = count('polarity');
  const majority = (tally) => Object.entries(tally).filter(([, n]) => n >= 4).map(([k]) => k);
  return {
    available: true, source: SOURCE, cusps,
    planets: planets.map((p, i) => ({ planet: p.name, sign: p.sign, degree: p.degreeInSign ?? null, ...placed[i] })),
    counts: { element: byElement, quality: byQuality, polarity: byPolarity },
    countsTa: { element: taTally(byElement), quality: taTally(byQuality), polarity: taTally(byPolarity) },
    majority: { element: majority(byElement), quality: majority(byQuality), polarity: majority(byPolarity) },
    majorityRule: 'நூல் "பெரும்பான்மை கிரகங்கள்" என்கிறது; இங்கு ஏழு பாரம்பரிய கிரகங்களில் நான்கு அல்லது அதற்கு மேல் (நம் வாசிப்பு).',
  };
}

const TA_LABEL = {
  positive: 'நேர்', negative: 'எதிர்', northern: 'வட', southern: 'தென்', vernal: 'வசந்த சமபகல்', autumnal: 'இலையுதிர் சமபகல்', 'summer solstitial': 'கோடை அயனம்', 'winter solstitial': 'மார்கழி அயனம்',
  fire: 'அக்கினி', earth: 'நிலம்', air: 'காற்று', water: 'நீர்', movable: 'சர', fixed: 'ஸ்திர', common: 'உபய',
  fruitful: 'பலன் தரும்', 'semi-fruitful': 'அரை பலன்', barren: 'மலட்டு', short: 'குறுகிய உதயம்', long: 'நீண்ட உதயம்',
};

/** A tally keyed by the Tamil label of each class (for display). */
function taTally(tally) {
  return Object.fromEntries(Object.entries(tally).map(([k, n]) => [TA_LABEL[k] ?? k, n]));
}

/** The Tamil words of a sign's classes, in the order the book takes them (polarity, hemisphere, element, quality, then the special groups that apply). */
function labelsTa(cls) {
  const out = [TA_LABEL[cls.polarity], TA_LABEL[cls.hemisphere], TA_LABEL[cls.element], TA_LABEL[cls.quality]];
  if (cls.equinoctial) out.push(TA_LABEL[cls.equinoctial]);
  if (cls.tropical) out.push(TA_LABEL[cls.tropical]);
  if (cls.fruitfulness) out.push(TA_LABEL[cls.fruitfulness]);
  if (cls.mute) out.push('ஊமை');
  if (cls.violent) out.push('கொடூர');
  if (cls.human) out.push('மனித');
  if (cls.voice) out.push('குரல்');
  if (cls.bestial) out.push('நாற்கால்');
  if (cls.dual) out.push('இரட்டை');
  if (cls.bicorporal) out.push('இரு உடல்');
  out.push(TA_LABEL[cls.ascension]);
  return out;
}

module.exports = { SIGNS, SIGN_TA, SOURCE, SECTIONS, labelsTa, classesOf, signClassTable, sectionsFor, classifyChart, ELEMENT, QUALITY, POSITIVE, FRUITFUL, SEMI_FRUITFUL, BARREN, MUTE, VIOLENT, HUMAN, VOICE, BESTIAL, DUAL, BICORPOREAL, SHORT_ASC };
