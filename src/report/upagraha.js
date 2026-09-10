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
// Daytime Gulika rising nāzhikā (out of 30) after sunrise, weekday 0 = Sun.
const GULIKA_DAY_NAZHIKA = [26, 22, 18, 14, 10, 6, 2];
// Night table: 10 − 4·weekday, out of 30 of the night arc (Phaladīpika Ch.25 "rātrau").
const GULIKA_NIGHT_NAZHIKA = [10, 6, 2, 26, 22, 18, 14];

/**
 * @param birthJd     Julian Day (UT) of the birth instant.
 * @param jdLocalMidnightUt  JD (UT) of 00:00 on the birth's *local* date.
 * @param weekday     0 = Sunday .. 6 = Saturday, of the local birth date.
 */
function gulikaMandi(birthJd, jdLocalMidnightUt, weekday, latitude, longitude, ayanamsha = 'Lahiri') {
  const wd = ((weekday % 7) + 7) % 7;
  const sunrise = sunriseJulianDay(jdLocalMidnightUt, latitude, longitude);
  const sunset = sunsetJulianDay(sunrise, latitude, longitude);
  const isDay = birthJd >= sunrise && birthJd < sunset;

  let gulikaStartJd;
  let mandiJd;
  if (isDay) {
    const dayLen = sunset - sunrise;
    const startFrac = GULIKA_DAY_NAZHIKA[wd] / 30;
    gulikaStartJd = sunrise + startFrac * dayLen;
    mandiJd = sunrise + (startFrac + 1 / 16) * dayLen; // + half of a 1/8 kāla
  } else {
    // Night arc = this sunset → next sunrise.
    const nextSunrise = sunriseJulianDay(sunset, latitude, longitude);
    const nightLen = nextSunrise - sunset;
    const startFrac = GULIKA_NIGHT_NAZHIKA[wd] / 30;
    gulikaStartJd = sunset + startFrac * nightLen;
    mandiJd = sunset + (startFrac + 1 / 16) * nightLen;
  }

  return {
    Gulika: { longitude: siderealAscendant(gulikaStartJd, latitude, longitude, ayanamsha), parent: 'Saturn' },
    Mandi: { longitude: siderealAscendant(mandiJd, latitude, longitude, ayanamsha), parent: 'Saturn' },
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
 */
function calculateUpagrahas(opts) {
  const {
    sunLongitude, birthJd, year, month, day, utcOffsetMinutes = 0,
    latitude, longitude, ayanamsha = 'Lahiri',
  } = opts;
  const jdLocalMidnightUt = julianDay(year, month, day, -utcOffsetMinutes / 60);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0 = Sunday, local date
  const a = sunDerivedUpagrahas(sunLongitude);
  const b = gulikaMandi(birthJd, jdLocalMidnightUt, weekday, latitude, longitude, ayanamsha);
  const out = {};
  for (const [name, v] of Object.entries(a)) out[name] = { ...placed(v.longitude), parent: v.parent };
  out.Gulika = { ...placed(b.Gulika.longitude), parent: b.Gulika.parent };
  out.Mandi = { ...placed(b.Mandi.longitude), parent: b.Mandi.parent };
  return { upagrahas: out, birthPeriod: b.birthPeriod };
}

module.exports = { calculateUpagrahas, sunDerivedUpagrahas, gulikaMandi };
