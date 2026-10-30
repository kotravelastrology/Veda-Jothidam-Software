/**
 * Horoscope book, page 20 (PL9 sample aniruddha_HC4, "Vimshottari MD and AD"): the nine mahadashas, each with its antardashas
 * and their beginning and ending dates, and the dasha balance at birth.
 *
 * The two Dasha Options (the settings, see SettingsPanel.tsx) are passed in: the dasha year (360, 365.25 or 327.85 days) and
 * the balance method (by degree, or by time). The balance at birth is the Vimshottari engine's (buildVimshottariDasha,
 * balanceYearsAtBirth). An antardasha is the mahadasha's full length times the antardasha's years over 120, so the first
 * mahadasha's antardashas run from its full start, and the ones that ended before birth are left out, as the sample leaves
 * them out.
 *
 * Against PL9 on this birth: with the 360-day year the antardasha lengths match the sample exactly (Ketu in Ketu 147 days;
 * Venus in Ketu 420 days). The balance by degree is 7y 8m 20d and by time 7y 8m 10d; the sample's is 7y 7m 1d, and neither
 * method gives it. The Moon's longitude is the one the sample prints (353:57), so the difference is not the Moon's position.
 * The later dates shift with the balance; the mahadasha boundary falls about ten days from the sample's, and the lengths agree.
 * Returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const swe = require('@swisseph/node');
const { withBirth } = require('./charts');
const { createChartContext } = require('../../contracts/chartContext');
const { buildVimshottariDasha } = require('../../dasha/vimshottariDasha');
const { planetLongitude } = require('../../ephemeris/siderealPositions');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// The Vimshottari cycle in its order, with each lord's years.
const CYCLE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

/** The sequence of lords from `first` on, through the cycle. */
function orderFrom(first) {
  const i = CYCLE.indexOf(first);
  return [...CYCLE.slice(i), ...CYCLE.slice(0, i)];
}

/** Years as the sample prints them: 7y 8m 20d (a month is 30 days of the dasha year). */
function yearsText(years) {
  const y = Math.floor(years);
  const monthsFloat = (years - y) * 12;
  const m = Math.floor(monthsFloat);
  const d = Math.round((monthsFloat - m) * 30);
  return `${y}y ${m}m ${d}d`;
}

/** A Julian day as dd-mm-yyyy in the birth place's time zone. */
function dateText(jd, utcOffsetMinutes) {
  const local = swe.julianDayToDate(jd + utcOffsetMinutes / 1440);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(local.day)}-${pad(local.month)}-${local.year}`;
}

/**
 * Page 20: the Vimshottari mahadashas and antardashas from the birth, with the dasha balance at birth.
 * `dashaOptions` is { yearDays, balance } (the settings' Dasha Year and Dasha Balance Method).
 */
function buildPage20({ name = '', birth, dashaOptions = { yearDays: 365.25, balance: 'degree' } }) {
  const ayanamsha = createChartContext({
    year: birth.year, month: birth.month, day: birth.day, hour: birth.hour, minute: birth.minute,
    ianaTimeZone: birth.ianaTimeZone ?? 'Asia/Kolkata', utcOffsetMinutes: birth.utcOffsetMinutes,
    latitude: birth.latitude, longitude: birth.longitude, placeName: birth.placeName, calendarMode: 'tirukanita',
  }).ayanamsha;
  return withBirth(birth, ({ chart }) => {
    const offset = birth.utcOffsetMinutes ?? 0;
    const yearDays = dashaOptions.yearDays;
    const tree = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, offset, {
      depth: 1,
      yearDays,
      balance: dashaOptions.balance,
      moonLongitudeAt: (jd) => planetLongitude(jd, 'Moon', ayanamsha),
    });
    const balance = tree.balanceYearsAtBirth;
    const birthJd = chart.julianDay;
    const lords = orderFrom(tree.startingLord);

    // Each mahadasha's start in years from birth (the first one is already running at birth).
    let elapsedBeforeThis = 0;
    const blocks = [{ kind: 'text', heading: 'Dasha balance at birth', text: `${tree.startingLord} ${yearsText(balance)}` }];
    lords.forEach((lord, i) => {
      const years = YEARS[lord];
      const startYears = i === 0 ? 0 : elapsedBeforeThis;
      const endYears = i === 0 ? balance : elapsedBeforeThis + years;
      // The mahadasha's full start, in days from birth (the first one began before birth by the part already run).
      const fullStartDays = i === 0 ? -(years - balance) * yearDays : elapsedBeforeThis * yearDays;
      let cum = 0;
      const rows = orderFrom(lord).map((antarLord) => {
        const length = (years * YEARS[antarLord]) / 120;
        const start = birthJd + fullStartDays + cum * yearDays;
        cum += length;
        const end = birthJd + fullStartDays + cum * yearDays;
        return { antarLord, start, end };
      }).filter((r) => r.end > birthJd);
      blocks.push({
        kind: 'table',
        heading: `${lord} (${years}y)`,
        columns: ['Antar', 'Beginning', 'Ending'],
        rows: rows.map((r) => [
          r.antarLord,
          dateText(Math.max(r.start, birthJd), offset),
          dateText(r.end, offset),
        ]),
        note: `From ${startYears === 0 ? '0 yrs' : yearsText(startYears)} to ${yearsText(endYears)}`,
      });
      elapsedBeforeThis = endYears;
    });

    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks,
    };
  });
}

module.exports = { buildPage20, orderFrom, yearsText };
