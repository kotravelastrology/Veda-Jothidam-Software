/**
 * Horoscope book, page 1 (PL9 sample aniruddha_HC4, p.1): birth particulars, Hindu calendar,
 * family particulars, Avakhada chakra and Tamil calendar. Returns { title, subtitle, blocks } in the
 * printSets shape; each row is [Tamil label, English label, value]. A field with no identified source
 * is printed as not built, with the reason, and is never filled in by guesswork.
 */
const swe = require('@swisseph/node');
const { createChartContext } = require('../../contracts/chartContext');
const { calculateParashariChart } = require('../../chart/parashariChart');
const {
  calculateTirukanitaPanchangam, NAKSHATRA_NAMES, TITHI_NAMES, YOGA_NAMES, karanaName,
  findLimbWindow, tithiIndexAt, nakshatraIndexAt, yogaIndexAt, karanaSerialAt,
} = require('../../panchangam/tirukanitaPanchangam');
const { withEphemeris } = require('../../ephemeris/isolation');
const { trueAyanamsa } = require('../../ephemeris/swissEphemeris');
const { sunriseJulianDay, sunsetJulianDay, planetLongitude } = require('../../ephemeris/siderealPositions');
const { indianFromJd, LUNAR_MONTHS_TA } = require('../../panchangam/indianCalendar');
const { tamilDate, panchangaAtJd } = require('../tamilCalendar');
const { birthNakshatraAndBalance } = require('../../dasha/vimshottariDasha');
const { RASI_LORD } = require('../../chart/karaka');
const T = require('../ashtakootaTables');
const { avakhadaExtra } = require('../avakhadaExtra');
const { ymdText } = require('./calendarAge');

const JD_UNIX_EPOCH = 2440587.5;
const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const NOT_BUILT = 'கட்டப்படவில்லை';
const KARTIKA = 7; // index of Kartika among the lunar months: the Kartikadi year begins with it

const pad = (n) => String(n).padStart(2, '0');

/** Local clock time HH:MM:SS for a UT Julian day and a zone offset in minutes. */
function clock(jd, offsetMinutes) {
  const d = new Date(Math.round((jd - JD_UNIX_EPOCH) * 86400000 + offsetMinutes * 60000));
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

/** Local date and clock, e.g. "4 October 1990 16:31:24". */
function stamp(jd, offsetMinutes) {
  const d = new Date(Math.round((jd - JD_UNIX_EPOCH) * 86400000 + offsetMinutes * 60000));
  return `${d.getUTCDate()} ${MONTH_EN[d.getUTCMonth()]} ${d.getUTCFullYear()} ${clock(jd, offsetMinutes)}`;
}

/** Sexagesimal HH:MM:SS for a non-negative decimal value (hours, degrees or ghatis). */
function sexagesimal(x) {
  const total = Math.round(Math.abs(x) * 3600);
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

/** The offset of an IANA zone from UTC, in minutes, at an instant. */
function zoneOffsetMinutes(ianaTimeZone, utcMs) {
  const part = new Intl.DateTimeFormat('en-US', { timeZone: ianaTimeZone, timeZoneName: 'longOffset' }).formatToParts(new Date(utcMs)).find((x) => x.type === 'timeZoneName');
  const m = /GMT([+-])(\d\d):(\d\d)/.exec(part ? part.value : '');
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
}

/**
 * The zone's standard (winter, not war or summer time) offset and what the birth's total offset adds to it: the lowest offset the zone had in the birth
 * year and in 2000 (a war time of 1942-45 India is not its standard time), PL9's "Time zone" and "War/daylight Corr.".
 */
function standardAndDaylight(birth) {
  const total = birth.utcOffsetMinutes ?? 0;
  if (!birth.ianaTimeZone) return { standard: total, daylight: birth.dstMinutes ?? 0 };
  try {
    const samples = [[birth.year, 0], [birth.year, 6], [2000, 0], [2000, 6]].map(([y, m]) => zoneOffsetMinutes(birth.ianaTimeZone, Date.UTC(y, m, 1)));
    const standard = Math.min(total, ...samples);
    return { standard, daylight: total - standard };
  } catch (e) {
    return { standard: total, daylight: birth.dstMinutes ?? 0 };
  }
}

/** Signed UTC offset in PL9's hh:mm:ss form, e.g. +05:30:00. */
function signedOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  return `${sign}${sexagesimal(Math.abs(minutes) / 60)}`;
}

/** Latitude or longitude in PL9's form, e.g. 13N05'00. */
function geo(value, positive, negative) {
  const total = Math.round(Math.abs(value) * 3600);
  return `${Math.floor(total / 3600)}${value >= 0 ? positive : negative}${pad(Math.floor((total % 3600) / 60))}'${pad(total % 60)}`;
}

/** UT Julian day at midnight of a civil date. */
const utcMidnightJd = ([y, m, d]) => swe.julianDay(y, m, d, 0);

/** The civil date n days after [y, m, d] (negative n goes back). */
function addDays([y, m, d], n) {
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()];
}

/** Weekday index (Sunday = 0) of a civil date. */
const weekdayOf = ([y, m, d]) => new Date(Date.UTC(y, m - 1, d)).getUTCDay();

/** The panchangam window, with startJulianDay and endJulianDay, that holds a Julian day. */
function windowAt(jd, ...windows) {
  return windows.find((w) => w.startJulianDay <= jd && jd < w.endJulianDay);
}

/** Tithi with its paksha, e.g. "Shukla Purnima" (tithi index 0-14 is Shukla, 15-29 Krishna). */
const tithiLabel = (t) => `${t.index < 15 ? 'Shukla' : 'Krishna'} ${t.name}`;

/** Tamil label from a table entry: a bare string, or { ta, en }. */
const bilingual = (v) => {
  if (typeof v === 'string') return v;
  return v.en ? `${v.ta} (${v.en})` : v.ta;
};

/** Day of the Tamil month for a civil date: the count of days since the sun entered this sign (sunrise sign). */
function tamilDayOfMonth(civil, monthIndex, lat, lon, ayanamsha) {
  const signOn = (date) => panchangaAtJd(sunriseJulianDay(utcMidnightJd(date), lat, lon), ayanamsha).sunSign;
  let day = 1;
  let cursor = civil;
  for (;;) {
    const previous = addDays(cursor, -1);
    if (day >= 40 || signOn(previous) !== monthIndex) break;
    day += 1;
    cursor = previous;
  }
  return day;
}

/**
 * @param input { name, sex, country, family: { grandFather, father, mother, caste, gotra },
 *   birth: { year, month, day, hour, minute, utcOffsetMinutes, ianaTimeZone, latitude, longitude,
 *            placeName, dstMinutes } }
 * @returns Promise of { title, subtitle, blocks } — the page-1 document (withEphemeris is async).
 */
function buildPage1({ name = '', sex = '', country = '', family = {}, birth, dashaOptions }) {
  const civil = [birth.year, birth.month, birth.day];
  const { latitude: lat, longitude: lon, utcOffsetMinutes: off } = birth;
  const { standard, daylight } = standardAndDaylight(birth);
  const contextFor = (date, hour = 12, minute = 0, second = 0) => createChartContext({
    year: date[0], month: date[1], day: date[2], hour, minute, second,
    ianaTimeZone: birth.ianaTimeZone ?? 'Asia/Kolkata', utcOffsetMinutes: off,
    latitude: lat, longitude: lon, placeName: birth.placeName, calendarMode: 'tirukanita', ayanamsha: birth.ayanamsha, houseSystem: birth.houseSystem, nodeType: birth.nodeType, sunrise: birth.sunrise,
  });
  const ctx = contextFor(civil, birth.hour, birth.minute, birth.second ?? 0);

  return withEphemeris({ ayanamsha: ctx.ayanamsha }, () => {
    const ayan = ctx.ayanamsha;
    const chart = calculateParashariChart(ctx);
    const jdBirth = chart.julianDay;
    const moon = chart.grahas.Moon;
    const lagna = chart.lagna;

    // The Hindu day: a birth before sunrise belongs to the previous civil day.
    // Sunrise is the settings' (PL9's: the centre of the disc on the horizon), the same one the tirukanita panchangam below counts its sunrise limbs from.
    const riseOn = (date) => sunriseJulianDay(utcMidnightJd(date), lat, lon, 0, ctx.sunrise);
    const civilSunrise = riseOn(civil);
    const hinduDate = jdBirth < civilSunrise ? addDays(civil, -1) : civil;
    const hRise = riseOn(hinduDate);
    const hSet = sunsetJulianDay(hRise, lat, lon, 0, ctx.sunrise);
    const nextRise = riseOn(addDays(hinduDate, 1));
    const hinduPan = calculateTirukanitaPanchangam(contextFor(hinduDate));
    const nextPan = calculateTirukanitaPanchangam(contextFor(addDays(hinduDate, 1)));

    // Ghatis: 60 per day, counted from the Hindu day's sunrise.
    const ghatisFromSunrise = (jd) => (jd - hRise) * 60;
    const ghatisBetween = (from, to) => (to - from) * 60;
    // The window of a limb that holds the birth: one of the two sunrise windows, or, for a birth between them (a karana lasts about
    // eleven hours, so half the day's births are), the window found around the birth itself
    const LIMBS = {
      tithi: [tithiIndexAt, (i) => TITHI_NAMES[i]],
      nakshatra: [nakshatraIndexAt, (i) => NAKSHATRA_NAMES[i]],
      yoga: [yogaIndexAt, (i) => YOGA_NAMES[i]],
      karana: [karanaSerialAt, karanaName],
    };
    const at = (key) => windowAt(jdBirth, hinduPan[key], nextPan[key]) ?? (() => {
      const [indexAt, nameOf] = LIMBS[key];
      const w = findLimbWindow(indexAt, jdBirth, ayan);
      return { name: nameOf(w.index), index: w.index, startJulianDay: w.startJulianDay, endJulianDay: w.endJulianDay };
    })();

    const nak = birthNakshatraAndBalance(moon.longitude);
    const star = nak.nakshatraIndex;
    const pada = Math.floor((moon.longitude % (360 / 27)) / (360 / 108)) + 1;

    // Sidereal (Lahiri) Sun at birth, tropical sign = sidereal + ayanamsha.
    // The ayanamsha PL9 prints is the true one (with the nutation in longitude, swe_get_ayanamsa_ex_ut), as the ascendant is reckoned from it.
    const ayanDeg = trueAyanamsa(jdBirth);
    const tropicalSun = (planetLongitude(jdBirth, 'Sun', ayan) + ayanDeg) % 360;

    // Local sidereal time: Meeus, Astronomical Algorithms, eq. 12.4 (GMST), plus the equation of the equinoxes (the nutation in longitude, ayanamsha
    // true less mean, by the cosine of the obliquity: Meeus ch.12, "apparent sidereal time", as PL9 prints it) and the east longitude.
    const days = jdBirth - 2451545.0;
    const centuries = days / 36525;
    const gmst = 280.46061837 + 360.98564736629 * days + 0.000387933 * centuries * centuries;
    const obliquity = (23.4392911 - 0.0130042 * centuries) * Math.PI / 180;
    const equinoxes = (ayanDeg - swe.getAyanamsa(jdBirth)) * Math.cos(obliquity);
    // PL9 counts the sidereal time on from the Hindu day's sunrise: a birth before sunrise prints it with the day's 24 hours added (29:14:37 for the sample)
    const lst = ((((gmst + equinoxes + lon) % 360) + 360) % 360) / 15 + (jdBirth < civilSunrise ? 24 : 0);

    // Local mean time: 4 minutes per degree from the zone's standard meridian (IST 82°30′E).
    const lmtMinutes = (lon - (off / 60) * 15) * 4;
    const sunAt = (jd) => planetLongitude(jd, 'Sun', ayan);
    const sunDegree = (jd) => {
      const l = sunAt(jd);
      return `${T.RASI_TA[Math.floor(l / 30)]} ${sexagesimal(l % 30)}`;
    };
    const balanceYears = nak.totalYears * (1 - nak.elapsedFraction);
    // PL9 prints the balance as the calendar time from the birth date to the date the birth dasha ends, the dasha year being the settings' (calendarAge.js)
    const birthMs = (jdBirth - JD_UNIX_EPOCH) * 86400000;
    const balance = ymdText(birthMs, birthMs + balanceYears * (dashaOptions?.yearDays ?? 365.25) * 86400000, off);

    // Hindu and Tamil calendars.
    const tamil = tamilDate(Date.UTC(civil[0], civil[1] - 1, civil[2]), lat, lon, ayan);
    // the lunar month and the year are those of the Hindu day's sunrise (a birth after the full moon but before the next sunrise is still in the bright half's month: the sample's Ashvina)
    const indian = indianFromJd(hRise, { latitude: lat, longitude: lon, utcOffsetMinutes: off });
    const tamilDay = tamilDayOfMonth(civil, tamil.month.index, lat, lon, ayan);

    // Avakhada, from the Moon's rasi and nakshatra.
    const rashi = moon.rasiIndex;
    const extra = avakhadaExtra({ star, pada, moonSign: rashi, lagnaSign: lagna.rasiIndex });

    const birthRows = [
      ['பாலினம்', 'Sex', sex],
      ['பிறந்த தேதி', 'Date of birth', `${civil[2]} ${MONTH_EN[civil[1] - 1]} ${civil[0]}`],
      ['பிறந்த கிழமை', 'Day of birth', DAY_EN[weekdayOf(civil)]],
      ['பிறந்த நேரம்', 'Time of birth', `${pad(birth.hour)}:${pad(birth.minute)}:${pad(birth.second ?? 0)} hrs`],
      ['இஷ்டகாலம்', 'Ishtkaal', `${sexagesimal(ghatisFromSunrise(jdBirth))} ghatis`],
      ['பிறந்த ஊர்', 'Place of birth', birth.placeName],
      ['நாடு', 'Country', country],
      ['அட்சரேகை', 'Latitude', geo(lat, 'N', 'S')],
      ['தீர்க்கரேகை', 'Longitude', geo(lon, 'E', 'W')],
      ['நேர மண்டலம்', 'Time zone', `${signedOffset(-standard)} hrs`],
      ['பகல் சேமிப்பு திருத்தம்', 'War/daylight Corr.', `${sexagesimal(daylight / 60)} hrs`],
      ['GMT நேரம்', 'GMT at birth', `${clock(jdBirth, 0)} hrs`],
      ['LMT திருத்தம்', 'LMT Corr.', `${signedOffset(lmtMinutes)} hrs`],
      ['உள்ளூர் சராசரி நேரம்', 'Local Mean Time', `${clock(jdBirth, off + lmtMinutes)} hrs`],
      ['நட்சத்திர நேரம்', 'Sidereal Time', `${sexagesimal(lst)} hrs`],
      ['சூரிய ராசி (மேற்கத்திய)', 'Sunsign (Western)', T.RASI_TA[Math.floor(tropicalSun / 30)]],
      ['லக்னம்', 'Lagna', `${T.RASI_TA[lagna.rasiIndex]} ${sexagesimal(lagna.degreeInSign)}`],
      ['அயனாம்சம்', 'Ayanamsha', `-${sexagesimal(ayanDeg)} ${ayan}`],
    ];

    const hinduRows = [
      ['இந்து கிழமை', 'Hindu weekday', DAY_EN[weekdayOf(hinduDate)]],
      ['சூரியனின் அயனம்', "Sun's Ayana", bilingual(tamil.ayana)],
      ['ருது (தமிழ் சூரிய மாதம்)', 'Season (solar month)', bilingual(tamil.ritu)],
      ['பக்ஷம் (பிறந்த நேரம்)', 'Paksha', at('tithi').index < 15 ? 'Shukla' : 'Krishna'],
      ['சாகா சம்வத்', 'Saka Samvat', String(civil[0] - 78)],
      ['சைத்ராதி — விக்ரம சம்வத்', 'Chaitradi System: Vikram Samvat', String(indian.vikramSamvat)],
      ['சைத்ராதி — சந்திர மாதம்', 'Chaitradi System: Lunar Month', LUNAR_MONTHS_TA[indian.purnimantaMonth]],
      ['கார்த்திகாதி — விக்ரம சம்வத்', 'Kartikadi System: Vikram Samvat', String(indian.amantaMonth >= KARTIKA ? indian.vikramSamvat : indian.vikramSamvat - 1)],
      ['கார்த்திகாதி — சந்திர மாதம்', 'Kartikadi System: Lunar Month', LUNAR_MONTHS_TA[indian.amantaMonth]],
      ['திதி (சூரிய உதயம்)', 'Tithi at sunrise', tithiLabel(hinduPan.tithi)],
      ['திதி முடிவு நேரம்', 'Tithi ending time', `${clock(hinduPan.tithi.endJulianDay, off)} hrs (${sexagesimal(ghatisFromSunrise(hinduPan.tithi.endJulianDay))} ghatis)`],
      ['திதி (பிறந்த நேரம்)', 'Tithi at birth', tithiLabel(at('tithi'))],
      ['நட்சத்திரம் (சூரிய உதயம்)', 'Nak. at sunrise', hinduPan.nakshatra.name],
      ['நட்சத்திர முடிவு நேரம்', 'Nak. ending time', `${clock(hinduPan.nakshatra.endJulianDay, off)} hrs (${sexagesimal(ghatisFromSunrise(hinduPan.nakshatra.endJulianDay))} ghatis)`],
      ['நட்சத்திரம் (பிறந்த நேரம்)', 'Nak. at birth', at('nakshatra').name],
      ['யோகம் (சூரிய உதயம்)', 'Yoga at sunrise', hinduPan.yoga.name],
      ['யோக முடிவு நேரம்', 'Yoga ending time', `${clock(hinduPan.yoga.endJulianDay, off)} hrs (${sexagesimal(ghatisFromSunrise(hinduPan.yoga.endJulianDay))} ghatis)`],
      ['யோகம் (பிறந்த நேரம்)', 'Yoga at birth', at('yoga').name],
      ['கரணம் (சூரிய உதயம்)', 'Karana at sunrise', hinduPan.karana.name],
      ['கரண முடிவு நேரம்', 'Karana ending time', `${clock(hinduPan.karana.endJulianDay, off)} hrs (${sexagesimal(ghatisFromSunrise(hinduPan.karana.endJulianDay))} ghatis)`],
      ['கரணம் (பிறந்த நேரம்)', 'Karana at birth', at('karana').name],
      ['உதய நேரம்', 'Sunrise', `${clock(hRise, off)} hrs`],
      ['உதய பாகை', 'Degree (sunrise)', sunDegree(hRise)],
      ['அஸ்தமன நேரம்', 'Sunset', `${clock(hSet, off)} hrs`],
      ['அஸ்தமன பாகை', 'Degree (sunset)', sunDegree(hSet)],
      ['அடுத்த நாள் உதயம்', 'Next-day sunrise', `${DAY_EN[weekdayOf(addDays(hinduDate, 1))].slice(0, 3)} ${clock(nextRise, off)} hrs`],
      ['சந்திர நட்சத்திர தொடக்கம்', 'Moon Nak entry', stamp(at('nakshatra').startJulianDay, off)],
      ['சந்திர நட்சத்திர முடிவு', 'Moon Nak exit', stamp(at('nakshatra').endJulianDay, off)],
      ['பயாத்', 'Bhayat', `${sexagesimal(ghatisBetween(at('nakshatra').startJulianDay, jdBirth))} ghatis`],
      ['போகம்', 'Bhabhog', `${sexagesimal(ghatisBetween(at('nakshatra').startJulianDay, at('nakshatra').endJulianDay))} ghatis`],
      ['பிறந்த தசை (மகா தசை)', 'Dasha at birth', nak.lord],
      ['தசை மீதம்', 'Balance of Dasha', balance],
    ];

    const familyRows = [
      ['தாத்தா', 'Grand Father', family.grandFather || '—'],
      ['தந்தை', 'Father', family.father || '—'],
      ['தாய்', 'Mother', family.mother || '—'],
      ['சாதி', 'Caste', family.caste || '—'],
      ['கோத்திரம்', 'Gotra', family.gotra || '—'],
    ];

    const avakhadaRows = [
      ['வர்ணம்', 'Varna', T.VARNA_TA[T.VARNA_OF_RASHI[rashi]]],
      ['வஸ்ய', 'Vashya', T.VASHYA_TA[T.vashyaGroup(rashi, moon.degreeInSign)]],
      ['நட்சத்திரம் — பாதம்', 'Nakshatra - Pada', `${NAKSHATRA_NAMES[star]} - ${pada}`],
      ['யோனி', 'Yoni', T.YONI_TA[T.YONI_OF_STAR[star]]],
      ['ராசீசன் (ராசி அதிபதி)', 'Rashish', RASI_LORD[rashi]],
      ['கணம்', 'Gana', T.GANA_TA[T.GANA_OF_STAR[star]]],
      ['ராசி', 'Rashi', T.RASI_TA[rashi]],
      ['நாடி', 'Nadi', T.NADI_TA[T.NADI_OF_STAR[star]]],
      ['வர்க்கம்', 'Varga', extra.varga],
      ['யுஞ்ஜா', 'Yunja', extra.yunja],
      ['ஹன்சக் (தத்துவம்)', 'Hansak (Tatwa)', extra.hansak],
      ['நாமாக்ஷரம்', 'Naamakshar', extra.naamakshar],
      ['பாயா (ராசி)', 'Paya (Rashi)', extra.payaRashi],
      ['பாயா (நட்சத்திரம்)', 'Paya (Nakshatra)', extra.payaNakshatra],
    ];

    const tamilRows = [
      ['தமிழ் ஆண்டு', 'Tamil Year', bilingual(tamil.samvatsara)],
      ['தமிழ் மாதம்', 'Tamil Month', bilingual(tamil.month)],
      ['தமிழ் கிழமை', 'Tamil Weekday', tamil.vaara.name],
      ['தமிழ் தேதி', 'Tamil Date', String(tamilDay)],
    ];

    const dateText = `${civil[2]} ${MONTH_EN[civil[1] - 1]} ${civil[0]}`;
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${country} · ${dateText}`,
      blocks: [
        { kind: 'table', heading: 'பிறப்பு விவரங்கள்', columns: ['தமிழ்', 'English', 'மதிப்பு'], rows: birthRows },
        { kind: 'table', heading: 'இந்து நாட்காட்டி', columns: ['தமிழ்', 'English', 'மதிப்பு'], rows: hinduRows },
        { kind: 'table', heading: 'குடும்ப விவரங்கள்', columns: ['தமிழ்', 'English', 'மதிப்பு'], rows: familyRows },
        { kind: 'table', heading: 'அவகடா சக்கரம்', columns: ['தமிழ்', 'English', 'மதிப்பு'], rows: avakhadaRows },
        { kind: 'table', heading: 'தமிழ் நாட்காட்டி', columns: ['தமிழ்', 'English', 'மதிப்பு'], rows: tamilRows },
      ],
    };
  });
}

module.exports = {
  buildPage1,
  // the helpers the birth-particulars summary (src/report/birthParticulars.js) shares with this page
  utcMidnightJd, addDays, weekdayOf, windowAt, tamilDayOfMonth, sexagesimal, clock, geo, signedOffset, standardAndDaylight, DAY_EN, MONTH_EN,
};
