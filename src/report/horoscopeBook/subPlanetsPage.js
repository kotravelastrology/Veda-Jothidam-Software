/**
 * Horoscope book, page 7 (PL9 sample aniruddha_HC4, "Sub-Planets"): the Upagrahas.
 *
 *  - The Gulikaadi group: the day (or the night, for a birth after sunset) is divided into eight equal portions; seven of them are ruled by
 *    the Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn in the order of the weekdays, the first portion of the day being the weekday lord's and the
 *    first of the night the fifth lord from it (BPHS ch.3 vv.66-69). Each portion gives an upagraha (Kaalavela, Paridhi, Mrityu, Ardhaprahara,
 *    Yamakantaka, Kodanda, Gulika), whose sign is the ascendant rising at the beginning of its portion (the Parashara method) or at its ending (the
 *    Kalidasa method); Gulika as the book's own table gives it (upagraha.js) is the ending. Duration, sign, degree, nakshatra and pada are listed.
 *  - The Dhoomadi group, from the Sun's longitude (BPHS ch.3): Dhooma, Vyatipata, Parivesha, Inderchapa, Upaketu.
 *  - Two upagraha charts (beginning and ending) and the special lagnas (Bhava, Hora, Ghatika from the sunrise; specialLagnas.js, BPHS ch.5).
 * Times are in the birth place's time. The builder returns a Promise of { title, subtitle, blocks }.
 */
const { withBirth } = require('./charts');
const { calculateUpagrahas } = require('../upagraha');
const { sunriseJulianDay, sunsetJulianDay } = require('../../ephemeris/siderealPositions');
const { siderealAscendant } = require('../../ephemeris/swissEphemeris');
const { sunriseBefore } = require('../../chart/sunriseBefore');
const SL = require('../../chart/specialLagnas');
const { kpChain } = require('../kpSystem');
const N = require('../../sources/tamilNames');
const { julianDay } = require('@swisseph/node');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SIGN3 = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
/** The seven portion lords in weekday order, with the upagraha each gives and PL9's two-letter chart mark. */
const PORTIONS = [
  { lord: 'Sun', name: 'Kaalavela', mark: 'Ka' }, { lord: 'Moon', name: 'Paridhi', mark: 'Pr' }, { lord: 'Mars', name: 'Mrityu', mark: 'Mr' },
  { lord: 'Mercury', name: 'Ardhaprahara', mark: 'Ar' }, { lord: 'Jupiter', name: 'Yamakantaka', mark: 'Ym' }, { lord: 'Venus', name: 'Kodanda', mark: 'Ko' },
  { lord: 'Saturn', name: 'Gulika', mark: 'Gk' },
];
const DHOOMADI = [['Dhuma', 'Dhooma', 'Mars', 'Dh'], ['Vyatipata', 'Vyatipata', 'Rahu', 'Vy'], ['Parivesha', 'Parivesha', 'Moon', 'Pv'], ['Indrachapa', 'Inderchapa', 'Venus', 'In'], ['Upaketu', 'Upaketu', 'Ketu', 'Uk']];
const LORD_ABBR = { Sun: 'Sun', Moon: 'Mon', Mars: 'Mar', Mercury: 'Mer', Jupiter: 'Jup', Venus: 'Ven', Saturn: 'Sat', Rahu: 'Rah', Ketu: 'Ket' };

const pad = (n) => String(n).padStart(2, '0');
/** 'HH:MM' of a UT Julian day in the zone of `offsetMinutes`. */
function clock(jd, offsetMinutes) {
  const d = new Date(Math.round((jd - 2440587.5) * 86400000 + offsetMinutes * 60000));
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}
const dms = (deg) => {
  const t = Math.min(Math.round(deg * 3600), 30 * 3600 - 1);
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`;
};

function where(longitude) {
  const k = kpChain(longitude);
  return { sign: SIGN3[Math.floor(k.longitude / 30)], degree: dms(k.degreeInSign), nakshatra: k.nakshatra, pada: String(k.pada), rasiIndex: Math.floor(k.longitude / 30) };
}

async function buildSubPlanets({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const off = birth.utcOffsetMinutes ?? 0;
    const ayanamsha = chart.ayanamsha;
    // the Hindu day of the birth: a birth before the civil day's sunrise belongs to the day before
    // the sunrise is the settings' (PL9's: the Sun's centre on the horizon, as the Gulika and special lagna calculations below count it)
    const mode = birth.sunrise ?? 'disc-centre';
    const civilSunrise = sunriseJulianDay(julianDay(birth.year, birth.month, birth.day, -off / 60), birth.latitude, birth.longitude, 0, mode);
    const hinduDate = new Date(Date.UTC(birth.year, birth.month - 1, chart.julianDay < civilSunrise ? birth.day - 1 : birth.day));
    const weekday = hinduDate.getUTCDay();
    const midnight = julianDay(hinduDate.getUTCFullYear(), hinduDate.getUTCMonth() + 1, hinduDate.getUTCDate(), -off / 60);
    const rise = sunriseJulianDay(midnight, birth.latitude, birth.longitude, 0, mode);
    const set = sunsetJulianDay(rise, birth.latitude, birth.longitude, 0, mode);
    const nextRise = sunriseJulianDay(set, birth.latitude, birth.longitude, 0, mode);
    const isDay = chart.julianDay >= rise && chart.julianDay < set;
    const from = isDay ? rise : set;
    const length = (isDay ? set - rise : nextRise - set) / 8;
    // the first portion's lord: the weekday lord by day, the fifth from it by night
    const firstLord = isDay ? weekday : (weekday + 4) % 7;

    const gulikaRows = PORTIONS.map((p, i) => {
      const k = ((i - firstLord) % 7 + 7) % 7; // 0-based portion index of this lord
      const start = from + k * length;
      const end = start + length;
      const b = where(siderealAscendant(start, birth.latitude, birth.longitude, ayanamsha));
      const e = where(siderealAscendant(end, birth.latitude, birth.longitude, ayanamsha));
      return { p, start, end, b, e };
    });

    const upa = calculateUpagrahas({
      sunLongitude: chart.grahas.Sun.longitude, birthJd: chart.julianDay, year: birth.year, month: birth.month, day: birth.day,
      utcOffsetMinutes: off, latitude: birth.latitude, longitude: birth.longitude, ayanamsha,
    }).upagrahas;

    const sr = sunriseBefore(chart.julianDay, birth.latitude, birth.longitude, ayanamsha, 'geometric');
    const sl = SL.specialLagnas({ lagnaLongitude: chart.lagna.longitude, sunLongitudeAtSunrise: sr.sunLongitudeAtSunrise, hoursSinceSunrise: sr.hoursSinceSunrise });
    const lagnaRows = [['Bhava Lagna', sl.bhava], ['Hora Lagna', sl.hora], ['Ghatika Lagna', sl.ghatika]].map(([label, lon]) => {
      const w = where(lon);
      return [label, w.sign, dms(Number(lon) % 30)];
    });

    const chartOf = (pick) => {
      const cells = Array.from({ length: 12 }, () => []);
      cells[Math.floor(chart.lagna.longitude / 30)].push('As');
      for (const r of gulikaRows) cells[pick(r).rasiIndex].push(r.p.mark);
      for (const [key, , , mark] of DHOOMADI) cells[Math.floor(upa[key].longitude / 30)].push(mark);
      return cells;
    };

    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks: [
        {
          kind: 'text',
          heading: 'Upagrahas or Sub-planets — Gulikaadi Group',
          text: `Birth ${isDay ? (chart.julianDay < (rise + set) / 2 ? 'between sun-rise and mid-day' : 'between mid-day and sun-set') : (chart.julianDay < rise ? 'between midnight and sun-rise' : 'between sun-set and midnight')} • Sunrise-Sunset: ${clock(rise, off)}-${clock(set, off)} • Astrological weekday: ${WEEKDAY_EN[weekday]}`,
        },
        {
          kind: 'table',
          heading: 'Gulikaadi group — beginning (Parashara method) and ending (Kalidasa method)',
          columns: ['Upagraha', 'Lord', 'Duration of upagraha', 'Begin sign', 'Degree', 'Nakshatra', 'P', 'End sign', 'Degree', 'Nakshatra', 'P'],
          rows: gulikaRows.map(({ p, start, end, b, e }) => [p.name, LORD_ABBR[p.lord], `${clock(start, off)}-${clock(end, off)}`, b.sign, b.degree, b.nakshatra, b.pada, e.sign, e.degree, e.nakshatra, e.pada]),
        },
        {
          kind: 'table',
          heading: 'Dhoomadi Group',
          columns: ['Upagraha', 'Lord', 'Sign', 'Degree', 'Nakshatra', 'Pd.'],
          rows: DHOOMADI.map(([key, label, lord]) => {
            const w = where(upa[key].longitude);
            return [label, LORD_ABBR[lord], w.sign, w.degree, w.nakshatra, w.pada];
          }),
        },
        { kind: 'signGrid', heading: 'Upagraha Chart (Beginning Time)', cells: chartOf((r) => r.b) },
        { kind: 'signGrid', heading: 'Upagraha Chart (Ending Time)', cells: chartOf((r) => r.e) },
        { kind: 'table', heading: 'Special Lagnas and Points', columns: ['Lagna', 'Sign', 'Degree'], rows: lagnaRows, note: 'The special lagnas count from the sunrise that began the birth\'s day (the Sun\'s centre on the horizon): BPHS ch.5.' },
      ],
    };
  });
}

module.exports = { buildSubPlanets };
