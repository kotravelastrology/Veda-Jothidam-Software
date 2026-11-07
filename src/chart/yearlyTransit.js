/**
 * The year's transit overview: for each sign, the stays of each planet in it during a calendar year (PL9 "Yearly transit overview").
 * Pure astronomy on top of graphicalEphemeris.js.
 *
 * One entry is one stay in a sign, so a stay is cut only at a sign ingress. This is how PL9 prints it, read from its 2026 screen: Mercury in
 * Aquarius "3 Feb to 10 Apr" is one entry although it turned retrograde on 26 Feb and direct on 21 Mar, and Venus in Libra "2 Sep to 5 Nov" likewise.
 * An entry is marked R when the planet is retrograde as the stay begins, and the marker (D) stands before the end date when that retrograde
 * planet turns direct inside the stay ("MeR: Jul 7 to (D) Aug 5" in Gemini, where the station itself is on 24 July). A stay that begins direct
 * carries no mark even if the planet turns retrograde in it. The stations inside each stay are kept in `stations`, so nothing is lost.
 *
 * PL9's dates are Universal Time days (its Mesha Sankranti-type ingresses match UT dates for a chart set in IST), so `utcOffsetMinutes` 0 reproduces
 * it; a local offset gives the local day. The Moon is not included, as in PL9: it crosses a sign every two days or so.
 */
const { julianDay } = require('@swisseph/node');
const { graphicalEphemeris, speedAt, longitudeAt } = require('./graphicalEphemeris');

const PLANETS = ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const SHORT = { Sun: 'Su', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };

/**
 * @returns { year, yearStartJd, yearEndJd,
 *   bySign: [12 x [{planet, startJd, endJd, startsAtYearStart, endsAtYearEnd, retrogradeAtStart, turnsDirect, stations: [{kind, jd}]}]] }
 * The year runs from 1 January 00:00 to 1 January of the next year at `utcOffsetMinutes` east of UT.
 */
function yearlyTransit({ year, utcOffsetMinutes = 0, ayanamsha = 'Lahiri', nodeType = 'mean' }) {
  const yearStartJd = julianDay(year, 1, 1, 0) - utcOffsetMinutes / 1440;
  const yearEndJd = julianDay(year + 1, 1, 1, 0) - utcOffsetMinutes / 1440;
  const days = Math.round(yearEndJd - yearStartJd);
  const margin = 3;
  const { events } = graphicalEphemeris({ startJd: yearStartJd - margin, days: days + 2 * margin, planets: PLANETS, ayanamsha, nodeType });
  const bySign = Array.from({ length: 12 }, () => []);
  for (const planet of PLANETS) {
    let sign = Math.floor(longitudeAt(yearStartJd, planet, ayanamsha, nodeType) / 30);
    let retro = speedAt(yearStartJd, planet, ayanamsha, nodeType) < 0;
    let stay = { planet, startJd: yearStartJd, startsAtYearStart: true, retrogradeAtStart: retro, turnsDirect: false, stations: [] };
    const close = (endJd, atYearEnd) => bySign[sign].push({ ...stay, endJd, endsAtYearEnd: atYearEnd });
    for (const e of events.filter((x) => x.planet === planet && x.jd > yearStartJd && x.jd < yearEndJd)) {
      if (e.kind === 'INGRESS') {
        close(e.jd, false);
        sign = e.sign;
        stay = { planet, startJd: e.jd, startsAtYearStart: false, retrogradeAtStart: retro, turnsDirect: false, stations: [] };
      } else {
        retro = e.kind === 'RETROGRADE';
        stay.stations.push({ kind: e.kind, jd: e.jd });
        if (e.kind === 'DIRECT' && stay.retrogradeAtStart) stay.turnsDirect = true;
      }
    }
    close(yearEndJd, true);
  }
  for (const list of bySign) list.sort((a, b) => PLANETS.indexOf(a.planet) - PLANETS.indexOf(b.planet) || a.startJd - b.startJd);
  return { year, yearStartJd, yearEndJd, bySign };
}

/**
 * Planets whose retrograde mark PL9 prints. Its 2026 screen marks Mercury, Venus and the nodes but prints Jupiter "Jan 1 to Jun 1" although
 * Jupiter was retrograde on 1 January (it turned direct in March) and Saturn "entire year" although it is retrograde from July. Whether PL9
 * leaves out the slow planets or only the first stay of the year is not decidable from one screen; both give the same lines there, so the
 * simpler (the slow planets are not marked) is used for the PL9 mode. Mars was direct throughout 2026 and is listed as marked.
 */
const PL9_MARKED = ['Mars', 'Mercury', 'Venus', 'Rahu', 'Ketu'];

/** The line a stay is printed as: `Su: Mar 14 to Apr 14`, `MeR: Jul 7 to (D) Aug 5`, `Sa entire year`. `fmt(jd)` gives the date text. */
function stayLine(stay, fmt, { marked = PLANETS, yearEnd = 'Dec 31', yearStart = 'Jan 1', entireYear = 'entire year', names = SHORT, to = ' to ' } = {}) {
  const r = marked.includes(stay.planet) && stay.retrogradeAtStart ? 'R' : '';
  const d = marked.includes(stay.planet) && stay.turnsDirect ? '(D) ' : '';
  if (stay.startsAtYearStart && stay.endsAtYearEnd) return `${names[stay.planet]}${r} ${entireYear}`;
  return `${names[stay.planet]}${r}: ${stay.startsAtYearStart ? yearStart : fmt(stay.startJd)}${to}${d}${stay.endsAtYearEnd ? yearEnd : fmt(stay.endJd)}`;
}

module.exports = { yearlyTransit, stayLine, PLANETS, SHORT, PL9_MARKED };
