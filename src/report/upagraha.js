/**
 * உபகிரகம் (Upagraha / sub-planets).
 *
 * Two families, both ported from the prior AstrologicLab engine (its
 * `src/lib/upagraha.ts` and the Gulika/Māndi block of `src/lib/ephemeris.ts`,
 * governance ref GOV-REG-V11-019):
 *
 *  A. Sun-derived (kāla-independent) — Dhūma, Vyatīpāta, Parivesha,
 *     Indrachāpa, Upaketu. Pure functions of the Sun's sidereal longitude
 *     (BPHS Ch.3; the +133°20′ / +16°40′ offsets are identical across every
 *     classical source).
 *
 *  B. Kāla-based — Gulika and Māndi. Gulika's daytime rising point is
 *     Phaladīpika Ch.25's table "26 | 22 | 18 | 14 | 10 | 6 | 2 divā"
 *     (nāzhikā out of 30 after sunrise, = 26 − 4·weekday, weekday 0 = Sun),
 *     corroborated by BPHS ("mandaputro gulikaḥ"). Its longitude is the
 *     sidereal Ascendant rising at that instant. Māndi is the MID-POINT of
 *     Gulika's kāla (Praśna Mārga: "gulikasya tu kālasya madhyaṁ
 *     māndir..."); Gulika's kāla = 1/8 of the day, so Māndi's instant =
 *     Gulika-start + 1/16 of the daytime arc.
 *
 * Night births: the classical night table is 10 − 4·weekday nāzhikā out of
 * 30 of the *night* arc. Handled below.
 */
const { julianDay } = require('@swisseph/node');
const { siderealAscendant } = require('../ephemeris/swissEphemeris');
const { sunriseJulianDay, sunsetJulianDay } = require('../ephemeris/siderealPositions');

const norm360 = (deg) => ((deg % 360) + 360) % 360;

// ── A. Sun-derived upagrahas ──────────────────────────────────────────────
function sunDerivedUpagrahas(sunLongitude) {
  const dhuma = norm360(sunLongitude + 133 + 20 / 60);
  const vyatipata = norm360(360 - dhuma);
  const parivesha = norm360(vyatipata + 180);
  const indrachapa = norm360(360 - parivesha);
  const upaketu = norm360(indrachapa + 16 + 40 / 60);
  return {
    Dhuma: { longitude: dhuma, parent: 'Mars' },
    Vyatipata: { longitude: vyatipata, parent: 'Rahu' },
    Parivesha: { longitude: parivesha, parent: 'Moon' },
    Indrachapa: { longitude: indrachapa, parent: 'Venus' },
    Upaketu: { longitude: upaketu, parent: 'Ketu' },
  };
}

// ── B. Gulika / Māndi ─────────────────────────────────────────────────────
// BPHS ch.3 vv.66-69 (Girish Chand, Vol.1, printed pp.44-47 = PDF pp.55-58): the day, and then the night, are each
// divided into eight equal portions, and the portion whose lord is Saturn is Gulika. The Dhruvanka is that portion's
// number (1-8), taken from the weekday by the table on p.57; Gulika's ascendant is the one rising at the end of that
// portion, counted from sunrise (day) or sunset (night). Mandi is Gulika (BPHS, notes to v.61: "Gulika is called Mandi
// also"). Weekday 0 = Sunday .. 6 = Saturday.
const DHRUVANKA_DAY = [7, 6, 5, 4, 3, 2, 1];
const DHRUVANKA_NIGHT = [3, 2, 1, 7, 6, 5, 4];

/**
 * @param birthJd     Julian Day (UT) of the birth instant.
 * @param jdLocalMidnightUt  JD (UT) of 00:00 on the Hindu day that holds the birth (see calculateUpagrahas).
 * @param weekday     0 = Sunday .. 6 = Saturday, of that Hindu day.
 */
function gulikaMandi(birthJd, jdLocalMidnightUt, weekday, latitude, longitude, ayanamsha = 'Lahiri', sunriseMode = 'upper-limb') {
  const wd = ((weekday % 7) + 7) % 7;
  const sunrise = sunriseJulianDay(jdLocalMidnightUt, latitude, longitude, 0, sunriseMode);
  const sunset = sunsetJulianDay(sunrise, latitude, longitude, 0, sunriseMode);
  const isDay = birthJd >= sunrise && birthJd < sunset;

  let gulikaJd;
  if (isDay) {
    gulikaJd = sunrise + (DHRUVANKA_DAY[wd] * (sunset - sunrise)) / 8;
  } else {
    // Night arc = this sunset → next sunrise.
    const nightLen = sunriseJulianDay(sunset, latitude, longitude, 0, sunriseMode) - sunset;
    gulikaJd = sunset + (DHRUVANKA_NIGHT[wd] * nightLen) / 8;
  }
  const longitudeOfGulika = siderealAscendant(gulikaJd, latitude, longitude, ayanamsha);

  return {
    Gulika: { longitude: longitudeOfGulika, parent: 'Saturn' },
    Mandi: { longitude: longitudeOfGulika, parent: 'Saturn' },
    birthPeriod: isDay ? 'day' : 'night',
  };
}

const RASI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
];
function placed(longitude) {
  const lon = norm360(longitude);
  const rasiIndex = Math.floor(lon / 30);
  return { longitude: lon, rasiIndex, rasi: RASI_NAMES[rasiIndex], degreeInSign: lon - rasiIndex * 30 };
}

/**
 * @param opts.sunLongitude   natal sidereal Sun longitude
 * @param opts.birthJd         Julian Day (UT) of the birth instant
 * @param opts.year/month/day  the LOCAL birth date
 * @param opts.utcOffsetMinutes  local offset from UTC (e.g. 330 for IST)
 * @param opts.latitude/longitude/ayanamsha
 * @param opts.sunrise       'upper-limb' (default) or 'disc-centre': which sunrise Gulika counts from
 */
function calculateUpagrahas(opts) {
  const {
    sunLongitude, birthJd, year, month, day, utcOffsetMinutes = 0,
    latitude, longitude, ayanamsha = 'Lahiri', sunrise = 'upper-limb',
  } = opts;
  // A birth before the civil day's sunrise belongs to the previous Hindu day, so its weekday and night are that day's.
  const civilSunrise = sunriseJulianDay(julianDay(year, month, day, -utcOffsetMinutes / 60), latitude, longitude, 0, sunrise);
  const hinduDay = new Date(Date.UTC(year, month - 1, birthJd < civilSunrise ? day - 1 : day));
  const jdLocalMidnightUt = julianDay(hinduDay.getUTCFullYear(), hinduDay.getUTCMonth() + 1, hinduDay.getUTCDate(), -utcOffsetMinutes / 60);
  const weekday = hinduDay.getUTCDay(); // 0 = Sunday, of the Hindu day
  const a = sunDerivedUpagrahas(sunLongitude);
  const b = gulikaMandi(birthJd, jdLocalMidnightUt, weekday, latitude, longitude, ayanamsha, sunrise);
  const out = {};
  for (const [name, v] of Object.entries(a)) out[name] = { ...placed(v.longitude), parent: v.parent };
  out.Gulika = { ...placed(b.Gulika.longitude), parent: b.Gulika.parent };
  out.Mandi = { ...placed(b.Mandi.longitude), parent: b.Mandi.parent };
  return { upagrahas: out, birthPeriod: b.birthPeriod };
}

module.exports = { calculateUpagrahas, sunDerivedUpagrahas, gulikaMandi };
