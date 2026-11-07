/**
 * Indian (luni-solar) calendar dates: a Vikram Samvat year, a lunar month, a tithi and a time after sunrise, turned into a civil date at a place
 * (PL9's "Indian Calendar" box on the event screen), and the reverse for any instant.
 *
 * Rules, as Sewell's "Indian Chronography" (1912) gives them (printed pp.28-31, sections 63-76; section 97 and the example on printed p.102):
 *  - the amanta lunar month begins at the new moon, the purnimanta at the preceding full moon; the civil first day of a lunar month is the day at whose sunrise its
 *    first tithi is current (sections 64, 72);
 *  - the Chaitradi luni-solar year begins with the new moon next after the Mina samkranti (section 65), so Chaitra is the amanta month whose new moon has the Sun in Pisces; the other
 *    months follow by the Sun's sign at their new moon (the naming used in `muhurtaSearch.js`);
 *  - a lunar month with no samkranti in it is intercalated, "Adhika", and the real month after it "Nija" (section 97, printed p.102); a month holding two samkrantis is suppressed (reported);
 *  - purnimanta: the dark half of amanta Phalguna belongs to Chaitra, and so on (sections 75-76); the bright half has the same name in both systems.
 * The Vikrama year of the Chaitradi reckoning is the A.D. year + 57 from Chaitra bright 1 (Panchanga Tantra, Akshay Regulagedda, p.19: Vikrama era zero year 57 B.C.).
 *
 * Moments are the true ones from the Swiss ephemeris with the Lahiri ayanamsha, not the Surya Siddhanta arithmetic of Sewell's tables, so a tithi that is close to a sunrise
 * can fall on the other day than in an almanac that uses the Siddhanta. Not built: the Kartikadi and Ashadhadi year beginnings, and PL9's "Krishnadi 1/2" method (its meaning is not known).
 */
const { julianDay } = require('@swisseph/node');
const { sunMoonLongitudes, sunriseJulianDay } = require('../ephemeris/siderealPositions');

const AYANAMSHA = 'Lahiri';
const norm = (x) => ((x % 360) + 360) % 360;
const wrap = (x) => ((x + 540) % 360) - 180;
const SYNODIC = 29.530588;

const MONTHS = ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'];
// the lunar (north Indian) names in Tamil letters, as the almanacs write them
const LUNAR_MONTHS_TA = ['சைத்ரம்', 'வைசாகம்', 'ஜ்யேஷ்டம்', 'ஆஷாடம்', 'ஸ்ராவணம்', 'பாத்ரபதம்', 'ஆஸ்வினம்', 'கார்த்திகம்', 'மார்கசீர்ஷம்', 'பௌஷம்', 'மாகம்', 'பால்குனம்'];

const sunLon = (jd) => sunMoonLongitudes(jd, AYANAMSHA).sunLongitude;
const elongation = (jd) => { const r = sunMoonLongitudes(jd, AYANAMSHA); return norm(r.moonLongitude - r.sunLongitude); };

/** The first instant after `after` (Julian day) at which the Moon is `target` degrees ahead of the Sun. */
function nextElongation(target, after) {
  let t = after + norm(target - elongation(after)) / 12.19;
  for (let i = 0; i < 12; i += 1) t += wrap(target - elongation(t)) / 12.19;
  while (t <= after) t += SYNODIC;
  return t;
}
/** The first instant after `after` at which the Sun is at `target` degrees (sidereal). */
function nextSunAt(target, after) {
  let t = after + norm(target - sunLon(after)) / 0.9856;
  for (let i = 0; i < 12; i += 1) t += wrap(target - sunLon(t)) / 0.9856;
  return t;
}

/** The new moon that begins the Chaitradi year of the given A.D. year: the first after the Mina samkranti. */
function yearStartNewMoon(adYear) {
  const minaSankranti = nextSunAt(330, julianDay(adYear, 1, 1, 0));
  return nextElongation(0, minaSankranti);
}

/**
 * The amanta months of the Chaitradi year that begins in A.D. `adYear`: each { startJd, endJd, sunSignStart, sunSignEnd, nameIndex, adhika, suppressed }.
 * `nameIndex` 0 is Chaitra; an intercalated month has the name of the month that follows it.
 */
function lunarYear(adYear) {
  const start = yearStartNewMoon(adYear);
  const end = yearStartNewMoon(adYear + 1);
  const moons = [start];
  for (;;) {
    const next = nextElongation(0, moons[moons.length - 1] + 20);
    if (next > end - 1) break;
    moons.push(next);
  }
  moons.push(end);
  const months = [];
  for (let i = 0; i + 1 < moons.length; i += 1) {
    const a = moons[i];
    const b = moons[i + 1];
    const signA = Math.floor(sunLon(a + 1e-4) / 30);
    const signB = Math.floor(sunLon(b - 1e-4) / 30);
    months.push({ startJd: a, endJd: b, sunSignStart: signA, sunSignEnd: signB, nameIndex: (signA + 1) % 12, adhika: signA === signB, suppressed: ((signB - signA + 12) % 12) >= 2 });
  }
  return { adYear, vikramSamvat: adYear + 57, startJd: start, endJd: end, months, hasAdhika: months.some((m) => m.adhika) };
}

/** Sunrise (Julian day) of the local civil day y-m-d at a place. */
function sunriseOf(y, m, d, place) {
  return sunriseJulianDay(julianDay(y, m, d, -(place.utcOffsetMinutes || 0) / 60), place.latitude, place.longitude);
}
const localParts = (jd, offsetMinutes) => {
  const ms = Math.round(((jd - 2440587.5) * 86400000 + offsetMinutes * 60000) / 1000) * 1000;
  const d = new Date(ms);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds() };
};

/**
 * @param q { vikramSamvat, month 0-11 (0 Chaitra), tithi 1-30 (1-15 bright, 16-30 dark), method 'AMANTA'|'PURNIMANTA', adhika?: boolean, vriddhi?: boolean,
 *            ghatis?: { ghati, pala, vipala }, place: { latitude, longitude, utcOffsetMinutes } }
 * @returns { ok: true, date, sunrise, ... } or { ok: false, reasonTa, kshaya? }
 */
function civilFromIndian(q) {
  const place = q.place;
  const off = place.utcOffsetMinutes || 0;
  const year = lunarYear(q.vikramSamvat - 57);
  const dark = q.tithi > 15;
  // purnimanta: the dark half of month M is the dark half of amanta month M-1
  const amantaName = q.method === 'PURNIMANTA' && dark ? (q.month + 11) % 12 : q.month;
  const candidates = year.months.filter((m) => m.nameIndex === amantaName);
  if (!candidates.length) return { ok: false, reasonTa: 'இந்த ஆண்டில் அந்த மாதம் இல்லை (மாதம் குறைவு).' };
  const wantAdhika = Boolean(q.adhika);
  const month = candidates.find((m) => m.adhika === wantAdhika);
  if (!month) return { ok: false, reasonTa: wantAdhika ? 'அந்த மாதம் இந்த ஆண்டில் அதிக மாதமாக வரவில்லை.' : 'அந்த மாதம் இந்த ஆண்டில் நிஜ மாதமாக வரவில்லை.' };
  // the tithi's interval: the Moon (tithi-1)*12 to tithi*12 degrees ahead of the Sun, inside the amanta month
  const from = nextElongation(((q.tithi - 1) * 12) % 360, month.startJd + (q.tithi === 1 ? -0.5 : (q.tithi - 1) * 0.5));
  const to = nextElongation((q.tithi * 12) % 360, from);
  // the civil days whose sunrise falls inside it
  const first = localParts(from, off);
  const days = [];
  for (let k = -1; k <= 2; k += 1) {
    const base = new Date(Date.UTC(first.year, first.month - 1, first.day + k));
    const sr = sunriseOf(base.getUTCFullYear(), base.getUTCMonth() + 1, base.getUTCDate(), place);
    if (sr >= from && sr < to) days.push({ sunriseJd: sr });
  }
  const pad = (n) => String(n).padStart(2, '0');
  if (!days.length) {
    return { ok: false, kshaya: true, tithiFromJd: from, tithiToJd: to, reasonTa: `இந்த திதி எந்த நாளின் சூரிய உதயத்திலும் இல்லை (திதி க்ஷயம்); அது ${first.year}-${pad(first.month)}-${pad(first.day)} அன்று நடக்கிறது.` };
  }
  if (q.vriddhi && days.length < 2) return { ok: false, vriddhiMissing: true, reasonTa: 'இந்த திதி இரண்டு நாட்களின் சூரிய உதயத்தில் இல்லை (விருத்தி திதி அல்ல).' };
  const day = q.vriddhi ? days[1] : days[0];
  const g = q.ghatis || {};
  // a ghati is 24 minutes, a pala 24 seconds, a vipala 0.4 seconds
  const afterDays = ((g.ghati || 0) * 24 + (g.pala || 0) * 0.4 + (g.vipala || 0) * (0.4 / 60)) / 1440;
  const when = day.sunriseJd + afterDays;
  return {
    ok: true, vriddhiDays: days.length, adhika: month.adhika, date: localParts(when, off), sunrise: localParts(day.sunriseJd, off),
    tithiFromJd: from, tithiToJd: to, vikramSamvat: q.vikramSamvat, amantaMonth: month.nameIndex, jd: when,
  };
}

/** The Indian calendar date of an instant (Julian day UT) at a place: Vikram Samvat, amanta and purnimanta month, adhika, paksha and tithi at that instant and at that day's sunrise. */
function indianFromJd(jd, place) {
  const local = localParts(jd, place.utcOffsetMinutes || 0);
  const sunrise = sunriseOf(local.year, local.month, local.day, place);
  const at = (t) => {
    const tithi = Math.floor(elongation(t) / 12) + 1;
    return { tithi, paksha: tithi <= 15 ? 'SHUKLA' : 'KRISHNA', tithiInPaksha: tithi <= 15 ? tithi : tithi - 15 };
  };
  const year = lunarYear(jd < yearStartNewMoon(local.year) ? local.year - 1 : local.year);
  const month = year.months.find((m) => m.startJd <= jd && jd < m.endJd);
  const now = at(jd);
  return {
    ...now, atSunrise: at(sunrise), vikramSamvat: year.vikramSamvat, amantaMonth: month.nameIndex, adhika: month.adhika, suppressed: month.suppressed,
    purnimantaMonth: now.paksha === 'KRISHNA' ? (month.nameIndex + 1) % 12 : month.nameIndex,
  };
}

module.exports = { civilFromIndian, indianFromJd, lunarYear, yearStartNewMoon, MONTHS, LUNAR_MONTHS_TA, nextElongation, nextSunAt };
