/**
 * The particulars of a birth, as the worksheet shows them the moment a chart is made: the name, the weekday, the sunrise and
 * sunset of the Hindu day, the five limbs of the panchangam (vara, tithi, nakshatra with its pada, yoga, karana) AT THE MOMENT
 * OF BIRTH with the time each ends, the Lagna, the Moon's and the Sun's signs, the dasha running at birth and its balance,
 * the Tamil calendar and the Avakhada points. Nothing here is a new calculation: it reads the same engines as the horoscope
 * book's first page (horoscopeBook/page1.js, checked against the Parashara's Light sample) and the Vimshottari engine
 * (BPHS ch.46 vv.12-16), and puts the results in Tamil.
 *
 * Differences from page 1 that are deliberate: the limb windows are found around the birth itself (a karana lasts about eleven
 * hours, so the windows at two sunrises do not always reach a birth between them), and the day's boundaries are the LOCAL
 * midnight of the birth place's zone.
 * Returns a Promise of plain data; every date-time is 'YYYY-MM-DD HH:MM' in the birth place's time.
 */
const swe = require('@swisseph/node');
const { createChartContext } = require('../contracts/chartContext');
const { calculateParashariChart } = require('../chart/parashariChart');
const {
  calculateTirukanitaPanchangam, findLimbWindow, tithiIndexAt, nakshatraIndexAt, yogaIndexAt, karanaSerialAt,
  formatLocalDateTime, karanaName,
} = require('../panchangam/tirukanitaPanchangam');
const { withEphemeris } = require('../ephemeris/isolation');
const { sunriseJulianDay, sunsetJulianDay, planetLongitude } = require('../ephemeris/siderealPositions');
const { buildVimshottariDasha, birthNakshatraAndBalance, VIMSHOTTARI_YEARS } = require('../dasha/vimshottariDasha');
const { tamilDate } = require('./tamilCalendar');
const { tamilDayOfMonth, addDays, weekdayOf, geo, signedOffset } = require('./horoscopeBook/page1');
const T = require('./ashtakootaTables');
const { RASI_LORD } = require('../chart/karaka');
const N = require('../sources/tamilNames');

const pad = (n) => String(n).padStart(2, '0');

/** 'HH:MM:SS' of a UT Julian day in the zone of `offsetMinutes`. */
function clockText(jd, offsetMinutes) {
  const d = new Date(Math.round((jd - 2440587.5) * 86400000 + offsetMinutes * 60000));
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

/** 'dd:mm:ss' of a non-negative decimal (degrees, hours or ghatis), the seconds rounded. */
function sexagesimal(x) {
  const total = Math.round(Math.abs(x) * 3600);
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

/** Years as years, months and days (a month is a twelfth of the year, a day a thirtieth of a month: the way the sample prints a balance). */
function ymd(years) {
  let y = Math.floor(years);
  let months = Math.floor((years - y) * 12);
  let days = Math.round((((years - y) * 12) - months) * 30);
  if (days >= 30) { days -= 30; months += 1; }
  if (months >= 12) { months -= 12; y += 1; }
  return { years: y, months, days };
}

/** @param tamil  a calendar entry: a bare string or { ta, en } */
const tamilOnly = (v) => (typeof v === 'string' ? v : v.ta);

/**
 * @param {{ birth: object, engine?: object, dashaOptions?: { yearDays: number, balance: 'degree'|'time' }, gender?: string, name?: string }} q
 *   birth: { year, month, day, hour, minute, utcOffsetMinutes, ianaTimeZone, latitude, longitude, placeName }
 *   engine: { ayanamsha, houseSystem, nodeType } (the settings; the engine's defaults when absent)
 */
function buildBirthParticulars({ birth, engine = {}, dashaOptions = { yearDays: 365.25, balance: 'degree' }, gender = '', name = '' }) {
  const civil = [birth.year, birth.month, birth.day];
  const { latitude: lat, longitude: lon } = birth;
  const off = birth.utcOffsetMinutes ?? 0;
  const contextFor = (date, hour = 12, minute = 0) => createChartContext({
    year: date[0], month: date[1], day: date[2], hour, minute,
    ianaTimeZone: birth.ianaTimeZone ?? 'Asia/Kolkata', utcOffsetMinutes: off,
    latitude: lat, longitude: lon, placeName: birth.placeName, calendarMode: 'tirukanita',
    ayanamsha: engine.ayanamsha, houseSystem: engine.houseSystem, nodeType: engine.nodeType,
  });
  const ctx = contextFor(civil, birth.hour, birth.minute);

  return withEphemeris({ ayanamsha: ctx.ayanamsha }, () => {
    const ayan = ctx.ayanamsha;
    const chart = calculateParashariChart(ctx);
    const jdBirth = chart.julianDay;
    const moon = chart.grahas.Moon;
    const sun = chart.grahas.Sun;
    const localMidnight = (date) => swe.julianDay(date[0], date[1], date[2], -off / 60);

    // The Hindu day runs from sunrise to sunrise: a birth before sunrise belongs to the previous civil day
    const civilSunrise = sunriseJulianDay(localMidnight(civil), lat, lon);
    const hinduDate = jdBirth < civilSunrise ? addDays(civil, -1) : civil;
    const rise = sunriseJulianDay(localMidnight(hinduDate), lat, lon);
    const set = sunsetJulianDay(rise, lat, lon);
    const hinduPan = calculateTirukanitaPanchangam(contextFor(hinduDate));

    const limb = (indexAt) => findLimbWindow(indexAt, jdBirth, ayan);
    const tithi = limb(tithiIndexAt);
    const nak = limb(nakshatraIndexAt);
    const yoga = limb(yogaIndexAt);
    const karana = limb(karanaSerialAt);
    const tithiName = N.tithiTa(tithi.index);
    const pada = Math.floor((moon.longitude % (360 / 27)) / (360 / 108)) + 1;
    const star = birthNakshatraAndBalance(moon.longitude);
    const ends = (w) => formatLocalDateTime(w.endJulianDay, off);

    // The dasha running at birth: the Vimshottari engine, with the settings' dasha year and balance method
    const dasha = buildVimshottariDasha(jdBirth, moon.longitude, off, {
      depth: 1,
      yearDays: dashaOptions.yearDays,
      balance: dashaOptions.balance,
      moonLongitudeAt: (jd) => planetLongitude(jd, 'Moon', ayan),
    });
    const first = dasha.dashas[0];

    const tamil = tamilDate(Date.UTC(civil[0], civil[1] - 1, civil[2]), lat, lon, ayan);
    const rasi = moon.rasiIndex;
    const nakshatraIndex = nak.index;

    return JSON.parse(JSON.stringify({
      name: name || null,
      gender: gender || null,
      birth: {
        date: `${civil[0]}-${pad(civil[1])}-${pad(civil[2])}`,
        time: `${pad(birth.hour)}:${pad(birth.minute ?? 0)}`,
        civilWeekdayTa: N.WEEKDAY_TA[weekdayOf(civil)],
        place: birth.placeName ?? null,
        latitude: geo(lat, 'N', 'S'),
        longitude: geo(lon, 'E', 'W'),
        utcOffset: signedOffset(off),
      },
      // The Hindu weekday: the day of the sunrise before the birth
      weekdayTa: N.WEEKDAY_TA[weekdayOf(hinduDate)],
      sunrise: clockText(rise, off),
      sunset: clockText(set, off),
      sunriseDate: `${hinduDate[0]}-${pad(hinduDate[1])}-${pad(hinduDate[2])}`,
      ishta: sexagesimal((jdBirth - rise) * 60),
      tithi: { paksha: tithiName.paksha, name: tithiName.name, index: tithi.index, endLocal: ends(tithi) },
      nakshatra: { name: N.NAKSHATRA_TA[nakshatraIndex], index: nakshatraIndex, pada, lordTa: N.PLANET_TA[star.lord], endLocal: ends(nak) },
      yoga: { name: N.YOGA_TA[yoga.index], index: yoga.index, endLocal: ends(yoga) },
      karana: { name: N.KARANA_TA[karanaName(karana.index)] ?? karanaName(karana.index), endLocal: ends(karana) },
      // The limbs at the sunrise of the day, for those who read the panchangam of the day
      atSunrise: {
        tithi: `${N.tithiTa(hinduPan.tithi.index).paksha} ${N.tithiTa(hinduPan.tithi.index).name}`,
        nakshatra: N.NAKSHATRA_TA[hinduPan.nakshatra.index],
        yoga: N.YOGA_TA[hinduPan.yoga.index],
        karana: N.KARANA_TA[hinduPan.karana.name] ?? hinduPan.karana.name,
      },
      lagna: { rasiIndex: chart.lagna.rasiIndex, rasiTa: N.RASI_TA[chart.lagna.rasiIndex], degree: sexagesimal(chart.lagna.degreeInSign) },
      moon: { rasiIndex: rasi, rasiTa: N.RASI_TA[rasi], degree: sexagesimal(moon.degreeInSign), lordTa: N.PLANET_TA[RASI_LORD[rasi]] },
      sun: { rasiIndex: sun.rasiIndex, rasiTa: N.RASI_TA[sun.rasiIndex], degree: sexagesimal(sun.degreeInSign) },
      ayanamsha: { name: ayan, degrees: sexagesimal(swe.getAyanamsa(jdBirth)) },
      dasha: {
        lord: dasha.startingLord,
        lordTa: N.PLANET_TA[dasha.startingLord],
        fullYears: VIMSHOTTARI_YEARS[dasha.startingLord],
        balance: ymd(dasha.balanceYearsAtBirth),
        balanceYears: dasha.balanceYearsAtBirth,
        endsLocal: first.endLocal,
        yearDays: dashaOptions.yearDays,
        method: dashaOptions.balance,
      },
      tamilCalendar: {
        year: tamilOnly(tamil.samvatsara),
        month: tamilOnly(tamil.month),
        date: tamilDayOfMonth(civil, tamil.month.index, lat, lon, ayan),
      },
      avakhada: {
        varna: T.VARNA_TA[T.VARNA_OF_RASHI[rasi]],
        vashya: T.VASHYA_TA[T.vashyaGroup(rasi, moon.degreeInSign)],
        yoni: T.YONI_TA[T.YONI_OF_STAR[nakshatraIndex]],
        gana: T.GANA_TA[T.GANA_OF_STAR[nakshatraIndex]],
        nadi: T.NADI_TA[T.NADI_OF_STAR[nakshatraIndex]],
      },
    }));
  });
}

module.exports = { buildBirthParticulars, ymd };
