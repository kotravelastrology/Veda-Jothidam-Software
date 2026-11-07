/**
 * Solar returns — annual, monthly and daily — and the place a return is cast
 * for.
 *
 * PL9 devotes about 25 worksheets to this: Annual, Monthly and Daily Solar,
 * each at the natal place and at the local place. `varshaphala.js` covered
 * exactly one of them — the annual return at the birthplace — with the
 * return-finding solver written inline and hardcoded to a whole number of
 * years.
 *
 * ## What is astronomy and what is doctrine
 *
 * These are not the same kind of claim and are not treated the same way here.
 *
 * **Astronomy.** "When does the Sun next reach sidereal longitude L?" has one
 * answer, computed from the ephemeris by bisection. Nothing to source: the
 * test checks the solver by asking the ephemeris where the Sun actually was at
 * the instant returned, which is an independent check rather than a restatement.
 *
 * **Doctrine.** *Which* longitude defines a month or a day is a convention, and
 * a convention has to come from a text. The annual return is unambiguous — the
 * Sun back at its natal longitude — but the monthly and daily steps are not,
 * so each convention is declared explicitly, labelled, and gated. This follows
 * VJ-027: a method that cannot be sourced is named and held back rather than
 * quietly shipped.
 *
 * **Place.** Casting the same instant for the birthplace or for where the
 * native lives now is purely mechanical — the same moment, different
 * coordinates, so a different Lagna and different houses. No doctrine, so no
 * label needed; the pair is simply offered and both are shown for what they
 * are.
 */

const { calculateChart } = require('../ephemeris/swissEphemeris');
const { calculateParashariChart } = require('../chart/parashariChart');
const { UnsupportedInputError } = require('../contracts/chartContext');

const DAY_MS = 86400000;
const SIDEREAL_YEAR_DAYS = 365.25636;
const norm360 = (d) => ((d % 360) + 360) % 360;
const wrappedDiff = (a, b) => (((a - b + 180) % 360) + 360) % 360 - 180;

/** The Sun's sidereal longitude at a UTC instant. Geocentric, so place is irrelevant. */
function sunSiderealLongitude(utcMs, ayanamsha = 'Lahiri') {
  const d = new Date(utcMs);
  const chart = calculateChart({
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds(),
    latitude: 0, longitude: 0, utcOffsetMinutes: 0, ayanamsa: ayanamsha,
  });
  return norm360(chart.positions.Sun.longitude);
}

/**
 * The instant the Sun reaches `targetLongitude`, searching outward from
 * `nearUtcMs`.
 *
 * Bisection on the wrapped difference. The bracket is widened rather than
 * assumed, because the Sun's daily motion varies by about 3% between perihelion
 * and aphelion and a fixed window sized for the average can miss the crossing
 * near the extremes.
 */
function findSunAtLongitude(targetLongitude, nearUtcMs, { windowDays = 4, ayanamsha = 'Lahiri' } = {}) {
  if (!Number.isFinite(targetLongitude)) {
    throw new UnsupportedInputError('targetLongitude must be a number', 'targetLongitude');
  }
  if (!Number.isFinite(nearUtcMs)) {
    throw new UnsupportedInputError('nearUtcMs must be a number', 'nearUtcMs');
  }
  const target = norm360(targetLongitude);
  const f = (ms) => wrappedDiff(sunSiderealLongitude(ms, ayanamsha), target);

  // Step to where the mean Sun would reach the target, rather than widening a
  // window outwards from `nearUtcMs`. The Sun passes a given longitude once a
  // year, so a target can be up to half a year away — widening a few days at a
  // time would either fail or take hundreds of ephemeris calls to get there.
  // `wrappedDiff` gives the signed shortest angular distance, so this lands on
  // the crossing *nearest* the requested instant, before or after it.
  const meanRatePerDay = 360 / SIDEREAL_YEAR_DAYS;
  const guess = nearUtcMs - (f(nearUtcMs) / meanRatePerDay) * DAY_MS;

  // The Sun's actual rate varies about 3% between perihelion and aphelion, so
  // the guess can be a day or so out; the bracket absorbs that.
  let lo = guess - windowDays * DAY_MS;
  let hi = guess + windowDays * DAY_MS;
  for (let widen = 0; widen < 6 && !(f(lo) <= 0 && f(hi) >= 0); widen += 1) {
    if (f(lo) > 0) lo -= windowDays * DAY_MS;
    if (f(hi) < 0) hi += windowDays * DAY_MS;
  }
  if (!(f(lo) <= 0 && f(hi) >= 0)) {
    throw new UnsupportedInputError(
      `could not bracket the Sun at ${target.toFixed(4)}° near ${new Date(nearUtcMs).toISOString()}`,
      'targetLongitude',
    );
  }
  for (let i = 0; i < 44; i += 1) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * The conventions, declared rather than assumed.
 *
 * `sourceStatus` carries the same meaning as VJ-027's coverage labels:
 * `VERIFIED` is unambiguous and needs no text, `CONVENTION_UNVERIFIED` means
 * the step is stated here but nobody has read it against a source.
 */
const RETURN_KINDS = {
  annual: {
    id: 'annual',
    nameTa: 'வருஷ பிரவேசம்',
    name: 'Annual solar return (Varsha Pravesha)',
    /** Sun back at exactly its natal longitude. */
    stepDegrees: 360,
    approxDays: SIDEREAL_YEAR_DAYS,
    sourceStatus: 'VERIFIED',
    convention: 'சூரியன் ஜனன நீள்கோட்டுக்கே திரும்பும் தருணம் — இதில் '
      + 'ஐயமில்லை; ஒரே ஒரு விளக்கமே உள்ளது.',
  },
  monthly: {
    id: 'monthly',
    nameTa: 'மாத பிரவேசம்',
    name: 'Monthly solar return (Masa Pravesha)',
    /** Natal longitude + 30° per month, so twelve steps close the circle. */
    stepDegrees: 30,
    approxDays: SIDEREAL_YEAR_DAYS / 12,
    sourceStatus: 'CONVENTION_UNVERIFIED',
    convention: 'ஜனன நீள்கோட்டிலிருந்து 30° இடைவெளியில் — பன்னிரு படிகள் '
      + 'வட்டத்தை நிறைவு செய்கின்றன. இந்தப் படி அளவு இங்கே வெளிப்படையாகக் '
      + 'கூறப்படுகிறது; ஆனால் இது ஒரு நூலுடன் ஒப்பிட்டுச் சரிபார்க்கப்படவில்லை.',
  },
  daily: {
    id: 'daily',
    nameTa: 'தின பிரவேசம்',
    name: 'Daily solar return (Dina Pravesha)',
    /** One sidereal year divided by its own length in days. */
    stepDegrees: 360 / SIDEREAL_YEAR_DAYS,
    approxDays: 1,
    sourceStatus: 'CONVENTION_UNVERIFIED',
    convention: `ஜனன நீள்கோட்டிலிருந்து ${(360 / SIDEREAL_YEAR_DAYS).toFixed(6)}° `
      + 'இடைவெளியில் (360° ÷ நட்சத்திர ஆண்டின் நாட்கள்). இதற்கு ஒன்றுக்கு '
      + 'மேற்பட்ட மரபு வழக்குகள் உள்ளன; இங்கே பயன்படுத்தப்படுவது இதுவே என்பது '
      + 'வெளிப்படையாகக் கூறப்படுகிறது, சரிபார்க்கப்படவில்லை.',
  },
};

const KIND_IDS = Object.keys(RETURN_KINDS);

/** Only an unambiguous convention may reach a client report without asking. */
function assertReturnPromotable(kindId, { allowUnverified = false } = {}) {
  const kind = RETURN_KINDS[kindId];
  if (!kind) throw new UnsupportedInputError(`unknown return kind ${kindId}`, 'kind');
  if (kind.sourceStatus !== 'VERIFIED' && !allowUnverified) {
    throw new UnsupportedInputError(
      `${kindId}: the step convention is not source-verified — ${kind.convention} `
      + '(pass allowUnverified to use it anyway)',
      'sourceStatus',
    );
  }
  return kind;
}

/**
 * A series of return instants.
 *
 * @param natalSunLongitude  the Sun's sidereal longitude at birth
 * @param fromUtcMs          the annual return this series hangs off
 * @param kindId             annual | monthly | daily
 * @param count              how many steps, starting at step 0 (= `fromUtcMs`)
 */
function returnSeries({ natalSunLongitude, fromUtcMs, kindId, count = 12, ayanamsha = 'Lahiri' }) {
  const kind = RETURN_KINDS[kindId];
  if (!kind) throw new UnsupportedInputError(`unknown return kind ${kindId}`, 'kind');
  if (!(count >= 1 && count <= 400)) {
    throw new UnsupportedInputError('count must be 1-400', 'count');
  }

  const out = [];
  for (let step = 0; step < count; step += 1) {
    const target = norm360(natalSunLongitude + kind.stepDegrees * step);
    // Each step is sought near where the mean rate puts it, then solved
    // exactly. Chaining from the previous *solved* instant would accumulate
    // the solver's error across a year of daily steps.
    const near = fromUtcMs + step * kind.approxDays * DAY_MS;
    const utcMs = findSunAtLongitude(target, near, {
      windowDays: Math.max(2, kind.approxDays / 2 + 2), ayanamsha,
    });
    out.push({
      step,
      targetLongitude: target,
      utcMs,
      utcIso: new Date(utcMs).toISOString(),
    });
  }
  return { kind: kindId, sourceStatus: kind.sourceStatus, convention: kind.convention, instants: out };
}

/**
 * Casts a chart for a return instant, at whichever place is asked for.
 *
 * The natal-place and local-place charts are the same moment: the grahas sit
 * at identical longitudes and only the Lagna, the houses and therefore every
 * house-based reading differ. That is the whole point of the pair, so both are
 * returned together rather than as separate calls a caller might mix up.
 */
function castReturnChart({ utcMs, place, ayanamsha = 'Lahiri', houseSystem = 'Placidus' }) {
  if (!place || !Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) {
    throw new UnsupportedInputError('place needs latitude and longitude', 'place');
  }
  const offset = place.utcOffsetMinutes ?? 0;
  const local = new Date(utcMs + offset * 60000);
  const input = {
    year: local.getUTCFullYear(), month: local.getUTCMonth() + 1, day: local.getUTCDate(),
    hour: local.getUTCHours(), minute: local.getUTCMinutes(),
    latitude: place.latitude, longitude: place.longitude,
    utcOffsetMinutes: offset,
    ianaTimeZone: place.ianaTimeZone ?? 'Asia/Kolkata',
    placeName: place.name ?? null,
  };
  const chart = calculateParashariChart({ input, ayanamsha, houseSystem });
  return {
    place: { ...place },
    localDate: `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')}`,
    localTime: `${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}`,
    lagna: {
      longitude: chart.lagna.longitude, rasi: chart.lagna.rasi,
      rasiIndex: chart.lagna.rasiIndex, degreeInSign: chart.lagna.degreeInSign,
    },
    grahas: Object.fromEntries(Object.entries(chart.grahas).map(([id, g]) => [id, {
      longitude: g.longitude, rasi: g.rasi, rasiIndex: g.rasiIndex, house: g.house,
    }])),
  };
}

/** The same instant at both places, for the natal/local worksheet pair. */
function castAtBothPlaces({ utcMs, natalPlace, localPlace, ayanamsha, houseSystem }) {
  return {
    utcMs,
    natal: castReturnChart({ utcMs, place: natalPlace, ayanamsha, houseSystem }),
    local: localPlace
      ? castReturnChart({ utcMs, place: localPlace, ayanamsha, houseSystem })
      : null,
  };
}

module.exports = {
  RETURN_KINDS, KIND_IDS, SIDEREAL_YEAR_DAYS,
  sunSiderealLongitude, findSunAtLongitude, returnSeries,
  castReturnChart, castAtBothPlaces, assertReturnPromotable,
};
