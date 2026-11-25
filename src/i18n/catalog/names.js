'use strict';

/**
 * The English of the names the program builds from src/sources/tamilNames.js, index by index, so that they can never drift apart:
 * signs in English (as Parashara's Light writes them), the stars, tithis, yogas and dasha levels in Sanskrit, the weekdays and the
 * Tamil months in English letters. A word with two senses gets its other sense under a context ('weekday::', 'month::'; see
 * src/i18n/translate.js): செவ்வாய் is Mars, and Tuesday where the page marks a weekday.
 */
const T = require('../../sources/tamilNames');

const RASI_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const RASI_EN_SHORT = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const NAKSHATRA_EN = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const WEEKDAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TITHI_EN = ['Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'];
const YOGA_EN = ['Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi',
  'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
  'Brahma', 'Indra', 'Vaidhriti'];
const KARANA_EN = { Bava: 'Bava', Balava: 'Balava', Kaulava: 'Kaulava', Taitila: 'Taitila', Garaja: 'Gara', Vanija: 'Vanija',
  Vishti: 'Vishti (Bhadra)', Kimstughna: 'Kimstughna', Shakuni: 'Shakuni', Chatushpada: 'Chatushpada', Naga: 'Naga' };
const DASHA_LEVEL_EN = ['Dasha', 'Bhukti', 'Antara', 'Sookshma', 'Prana'];
const MONTHS_GREGORIAN_TA = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
const MONTHS_GREGORIAN_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const TAMIL_MONTHS = [['சித்திரை', 'Chithirai'], ['வைகாசி', 'Vaikasi'], ['ஆனி', 'Aani'], ['ஆடி', 'Aadi'], ['ஆவணி', 'Aavani'], ['புரட்டாசி', 'Purattasi'],
  ['ஐப்பசி', 'Aippasi'], ['கார்த்திகை', 'Karthigai'], ['மார்கழி', 'Margazhi'], ['தை', 'Thai'], ['மாசி', 'Maasi'], ['பங்குனி', 'Panguni']];
const ABBR = { லக்: 'As', சூரி: 'Su', சந்: 'Mo', செவ்: 'Ma', புத: 'Me', குரு: 'Ju', சுக்: 'Ve', சனி: 'Sa', ராகு: 'Ra', கேது: 'Ke', குளி: 'Gk' };

function nameEntries() {
  const exact = {};
  const put = (ta, en) => { if (ta && !(ta in exact)) exact[ta] = en; };
  // planets first: a weekday that shares a planet's word (செவ்வாய், புதன், சனி) gets the planet by default
  for (const [k, ta] of Object.entries(T.PLANET_TA)) put(ta, k);
  T.RASI_TA.forEach((ta, i) => put(ta, RASI_EN[i]));
  T.RASI_TA_SHORT.forEach((ta, i) => put(ta, RASI_EN_SHORT[i]));
  // stars before months: சித்திரை, கார்த்திகை are the stars unless the page marks a month
  T.NAKSHATRA_TA.forEach((ta, i) => put(ta, NAKSHATRA_EN[i]));
  T.WEEKDAY_TA.forEach((ta, i) => {
    put(ta, WEEKDAY_EN[i]);
    exact[`weekday::${ta}`] = WEEKDAY_EN[i];
    // with its word for "day" the weekday is never the planet: செவ்வாய்க்கிழமை, செவ்வாய் கிழமை
    for (const day of [`${ta}கிழமை`, `${ta}க்கிழமை`, `${ta} கிழமை`]) put(day, WEEKDAY_EN[i]);
  });
  T.TITHI_TA.forEach((ta, i) => put(ta, TITHI_EN[i]));
  put('அமாவாசை', 'Amavasya');
  put('வளர்பிறை', 'Shukla paksha');
  put('தேய்பிறை', 'Krishna paksha');
  // the panchangam's "paksha name" (tithiTa): Shukla Trayodashi, Krishna Pratipada, Krishna Amavasya
  T.TITHI_TA.forEach((ta, i) => { put(`வளர்பிறை ${ta}`, `Shukla ${TITHI_EN[i]}`); put(`தேய்பிறை ${ta}`, `Krishna ${TITHI_EN[i]}`); });
  put('தேய்பிறை அமாவாசை', 'Krishna Amavasya');
  T.YOGA_TA.forEach((ta, i) => put(ta, YOGA_EN[i]));
  for (const [k, ta] of Object.entries(T.KARANA_TA)) put(ta, KARANA_EN[k] ?? k);
  T.DASHA_LEVEL_TA.forEach((ta, i) => put(ta, DASHA_LEVEL_EN[i]));
  MONTHS_GREGORIAN_TA.forEach((ta, i) => put(ta, MONTHS_GREGORIAN_EN[i]));
  for (const [ta, en] of TAMIL_MONTHS) { put(ta, en); exact[`month::${ta}`] = en; }
  // the worksheet chart writes the planets short (app/worksheet/WorksheetChart.tsx, under data-i18n-ctx="abbr"): PL9's two letters
  for (const [ta, en] of Object.entries(ABBR)) exact[`abbr::${ta}`] = en;
  return exact;
}

module.exports = { nameEntries, RASI_EN, NAKSHATRA_EN, WEEKDAY_EN, TITHI_EN, YOGA_EN, DASHA_LEVEL_EN };
