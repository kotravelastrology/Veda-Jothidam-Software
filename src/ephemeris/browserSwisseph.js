'use strict';

/**
 * @swisseph/node's interface on @swisseph/browser: the same Swiss Ephemeris (libswe 2.10.03) compiled to WebAssembly, reading the same
 * .se1 files the server reads (public/ephe/, copied from @swisseph/node/ephemeris). In the browser build the engine's
 * `require('@swisseph/node')` resolves here (next.config.mjs), so the calculation engines run unchanged on the device when the server
 * cannot be reached (src/offline/localEngine.ts). test-offline-ephemeris.js holds every function here to the native one.
 *
 * Two things differ from the WebAssembly package as shipped, and are put right here:
 *  - when no flags are given it uses the Moshier ephemeris; @swisseph/node uses the Swiss Ephemeris files, so the defaults here are the
 *    native ones (calculatePosition: SwissEphemeris | Speed; eclipses and the extended ayanamsha: SwissEphemeris);
 *  - it has no swe_rise_trans. calculateRiseTransitSet below is Swiss Ephemeris's own fast method for risings and settings
 *    (rise_set_fast() in swecl.c, used by swe_rise_trans for the Sun up to 65° latitude and the Moon and planets up to 60°), line for
 *    line, on the same primitives (swe_calc_ut, swe_sidtime, swe_azalt, swe_set_topo) and with swe_refrac_extended's refraction
 *    formula. Beyond those latitudes swe_rise_trans uses a slower search that is not ported, and this throws.
 *
 * Swiss Ephemeris is licensed under the AGPL or Astrodienst's commercial licence (docs/VJ-007-ephemeris-license-inventory.md): a build
 * that sends this to browsers distributes it.
 */
const core = require('@swisseph/core');

const { CalculationFlag, CommonCalculationFlags, CalendarType, HouseSystem, DateTimeImpl } = core;

let swe = null;

function inst() {
  if (!swe) throw new Error('the offline ephemeris is not loaded (initBrowserSwisseph)');
  return swe;
}

/** For tests (and any caller that built the instance itself): use this @swisseph/browser SwissEphemeris instance. */
function useSwissEphemerisInstance(instance) {
  swe = instance;
}

function isBrowserSwissephReady() {
  return swe !== null;
}

/**
 * Loads the WebAssembly module and the ephemeris files into its file system (/ephemeris), once.
 * @param {{ files: { name: string, url: string }[], wasmUrl?: string }} options
 */
let loading = null;
function initBrowserSwisseph(options) {
  if (swe) return Promise.resolve();
  loading ??= (async () => {
    const { SwissEphemeris } = await import('@swisseph/browser');
    const s = new SwissEphemeris();
    await s.init(options.wasmUrl);
    await s.loadEphemerisFiles(options.files);
    swe = s;
  })().catch((e) => {
    loading = null;
    throw e;
  });
  return loading;
}

// ------------------------------------------------------------------ swe_rise_trans, fast method (swecl.c rise_set_fast)
const SE_SUN = 0;
const SE_MOON = 1;
const SE_TRUE_NODE = 11;
const SE_CALC_RISE = 1;
const SE_CALC_SET = 2;
const SE_BIT_DISC_CENTER = 256;
const SE_BIT_DISC_BOTTOM = 8192;
const SE_BIT_GEOCTR_NO_ECL_LAT = 128;
const SE_BIT_NO_REFRACTION = 512;
const SE_BIT_TWILIGHT = 1024 | 2048 | 4096;
const SE_BIT_FIXED_DISC_SIZE = 16384;
const SE_BIT_FORCE_SLOW_METHOD = 32768;
const SEFLG_EPHMASK = 1 | 2 | 4;
const SEFLG_EQUATORIAL = 2 * 1024;
const SEFLG_TOPOCTR = 32 * 1024;
const SE_EQU2HOR = 1;
const SE_ECL2HOR = 0;
const DEGTORAD = Math.PI / 180.0;
const RADTODEG = 180.0 / Math.PI;
const AUNIT = 1.49597870700e+11; /* au in meters, DE431 (sweph.h) */
const SUN_DIAM = 1392000000.0; /* pla_diam[SE_SUN] (sweph.h) */
const MOON_DIAM = 3475000.0; /* pla_diam[SE_MOON] */

function degnorm(x) {
  let y = x % 360.0;
  if (Math.abs(y) < 1e-13) y = 0; /* swe_degnorm: Alois fix */
  if (y < 0.0) y += 360.0;
  return y;
}

/** calc_astronomical_refr (swecl.c, Sinclair's formula) */
function astronomicalRefraction(inalt, atpress, attemp) {
  let r;
  if (inalt > 17.904104638432) {
    r = 0.97 / Math.tan(inalt * DEGTORAD);
  } else {
    r = (34.46 + 4.23 * inalt + 0.004 * inalt * inalt) / (1 + 0.505 * inalt + 0.0845 * inalt * inalt);
  }
  r = ((atpress - 80) / 930 / (1 + 0.00008 * (r + 39) * (attemp - 10)) * r) / 60.0;
  return r;
}

/**
 * The refraction rise_set_fast takes from swe_refrac_extended(0.000001, 0, atpress, attemp, lapse, SE_APP_TO_TRUE): at geoalt 0 the
 * dip is 0 and the apparent altitude 0.000001 is above it, so dret[1] - dret[0] is the refraction at that altitude.
 */
function horizonRefraction(atpress, attemp) {
  const inalt = 0.000001;
  const refr = astronomicalRefraction(inalt, atpress, attemp);
  const trualt = inalt - refr;
  return inalt - trualt;
}

/** get_sun_rad_plus_refr (swecl.c) */
function radiusPlusRefraction(ipl, dd, rsmi, refr) {
  let rdi = 0;
  if (rsmi & SE_BIT_FIXED_DISC_SIZE) {
    if (ipl === SE_SUN) dd = 1.0;
    else if (ipl === SE_MOON) dd = 0.00257;
  }
  if (!(rsmi & SE_BIT_DISC_CENTER)) {
    const diam = ipl === SE_SUN ? SUN_DIAM : ipl === SE_MOON ? MOON_DIAM : 0;
    rdi = Math.asin(diam / 2.0 / AUNIT / dd) * RADTODEG;
  }
  if (rsmi & SE_BIT_DISC_BOTTOM) rdi = -rdi;
  if (!(rsmi & SE_BIT_NO_REFRACTION)) rdi += refr;
  return rdi;
}

function calcUt(jd, ipl, iflag) {
  const p = inst().calculatePosition(jd, ipl, iflag);
  return [p.longitude, p.latitude, p.distance, p.longitudeSpeed, p.latitudeSpeed, p.distanceSpeed];
}

function trueAltitude(jd, tohor, dgeo, atpress, attemp, xx) {
  return inst().horizontalCoordinates(jd, { longitude: dgeo[0], latitude: dgeo[1], altitude: dgeo[2] }, [xx[0], xx[1], xx[2]], tohor === SE_EQU2HOR, atpress, attemp).altitude;
}

function riseSetFast(tjdUt, ipl, epheflag, rsmi, dgeo, atpress, attemp) {
  const s = inst();
  let tjd = tjdUt;
  const tjd0 = tjdUt;
  const iflag = epheflag & SEFLG_EPHMASK;
  let iflagtopo = iflag | SEFLG_EQUATORIAL;
  const nloop = ipl === SE_MOON ? 4 : 2;
  const facrise = (rsmi & SE_CALC_SET) ? -1 : 1;
  let isSecondRun = false;
  if (!(rsmi & SE_BIT_GEOCTR_NO_ECL_LAT)) {
    iflagtopo |= SEFLG_TOPOCTR;
    s.setTopocentric(dgeo[0], dgeo[1], dgeo[2]);
  }
  for (;;) { /* run_rise_again */
    let xx = calcUt(tjd, ipl, iflagtopo);
    const decl = xx[1];
    let sda = -Math.tan(dgeo[1] * DEGTORAD) * Math.tan(decl * DEGTORAD);
    if (sda >= 1) sda = 10;
    else if (sda <= -1) sda = 180;
    else sda = Math.acos(sda) * RADTODEG;
    const armc = degnorm(s.siderealTime(tjd) * 15 + dgeo[0]);
    const md = degnorm(xx[0] - armc);
    const mdrise = degnorm(sda * facrise);
    let dmd = degnorm(md - mdrise);
    if (dmd > 358) dmd -= 360;
    let tr = tjd + dmd / 360;
    if (atpress === 0) atpress = 1013.25 * Math.pow(1 - 0.0065 * dgeo[2] / 288, 5.255);
    const refr = horizonRefraction(atpress, attemp);
    let tohor;
    if (rsmi & SE_BIT_GEOCTR_NO_ECL_LAT) {
      tohor = SE_ECL2HOR;
      iflagtopo = iflag;
    } else {
      tohor = SE_EQU2HOR;
      iflagtopo = iflag | SEFLG_EQUATORIAL | SEFLG_TOPOCTR;
      s.setTopocentric(dgeo[0], dgeo[1], dgeo[2]);
    }
    for (let i = 0; i < nloop; i += 1) {
      xx = calcUt(tr, ipl, iflagtopo);
      if (rsmi & SE_BIT_GEOCTR_NO_ECL_LAT) xx[1] = 0;
      const rdi = radiusPlusRefraction(ipl, xx[2], rsmi, refr);
      const alt1 = trueAltitude(tr, tohor, dgeo, atpress, attemp, xx);
      const alt2 = trueAltitude(tr + 0.001, tohor, dgeo, atpress, attemp, xx);
      const dd = alt2 - alt1;
      const dalt = alt1 + rdi;
      let dt = dalt / dd / 1000.0;
      if (dt > 0.1) dt = 0.1;
      else if (dt < -0.1) dt = -0.1;
      tr -= dt;
    }
    /* if the event found is before input time, we search next event. */
    if (tr < tjd0 && !isSecondRun) {
      tjd += 0.5;
      isSecondRun = true;
      continue;
    }
    return tr;
  }
}

/**
 * @swisseph/node's calculateRiseTransitSet (swe_rise_trans) for the cases its fast method covers; returns { time, eventType }
 * (eventType 0 = OK, as the native binding returns it).
 */
function calculateRiseTransitSet(startJulianDay, body, eventType, longitude, latitude, altitude, flags = CalculationFlag.SwissEphemeris,
  atmosphericPressure = 0, atmosphericTemperature = 0) {
  const rsmi = eventType;
  const epheflag = core.normalizeFlags(flags);
  const fast = (rsmi & (SE_CALC_RISE | SE_CALC_SET))
    && !(rsmi & SE_BIT_FORCE_SLOW_METHOD)
    && !(rsmi & SE_BIT_TWILIGHT)
    && body >= SE_SUN && body <= SE_TRUE_NODE
    && (Math.abs(latitude) <= 60 || (body === SE_SUN && Math.abs(latitude) <= 65));
  if (!fast) throw new RangeError('this rising or setting needs the slow method of swe_rise_trans, which is not computed on the device');
  const time = riseSetFast(startJulianDay, body, epheflag, rsmi, [longitude, latitude, altitude], atmosphericPressure, atmosphericTemperature);
  return { time, eventType: 0 };
}

// ------------------------------------------------------------------ the rest of the interface, with the native defaults
module.exports = {
  ...core,
  initBrowserSwisseph,
  isBrowserSwissephReady,
  useSwissEphemerisInstance,
  julianDay: (year, month, day, hour = 0, calendarType = CalendarType.Gregorian) => inst().julianDay(year, month, day, hour, calendarType),
  dateToJulianDay: (date, calendarType = CalendarType.Gregorian) => inst().dateToJulianDay(date, calendarType),
  julianDayToDate: (jd, calendarType = CalendarType.Gregorian) => {
    const d = inst().julianDayToDate(jd, calendarType);
    return new DateTimeImpl(d.year, d.month, d.day, d.hour, calendarType);
  },
  calculatePosition: (jd, body, flags = CommonCalculationFlags.DefaultSwissEphemeris) => {
    const p = inst().calculatePosition(jd, body, flags);
    return {
      longitude: p.longitude, latitude: p.latitude, distance: p.distance,
      longitudeSpeed: p.longitudeSpeed, latitudeSpeed: p.latitudeSpeed, distanceSpeed: p.distanceSpeed, flags: p.flags,
    };
  },
  calculateHouses: (jd, latitude, longitude, houseSystem = HouseSystem.Placidus) => inst().calculateHouses(jd, latitude, longitude, houseSystem),
  setSiderealMode: (mode, t0 = 0, ayanT0 = 0) => inst().setSiderealMode(mode, t0, ayanT0),
  getAyanamsa: (jd) => inst().getAyanamsa(jd),
  getAyanamsaExUt: (jd, flags = CalculationFlag.SwissEphemeris) => inst().getAyanamsaExUt(jd, flags),
  // The files are in the module's own file system; setting the path again resets the library's caches as the native call does.
  setEphemerisPath: () => inst().setEphemerisPath('/ephemeris'),
  findNextLunarEclipse: (jd, flags = CalculationFlag.SwissEphemeris, eclipseType = 0, backward = false) => inst().findNextLunarEclipse(jd, flags, eclipseType, backward),
  findNextSolarEclipse: (jd, flags = CalculationFlag.SwissEphemeris, eclipseType = 0, backward = false) => inst().findNextSolarEclipse(jd, flags, eclipseType, backward),
  getCelestialBodyName: (body) => inst().getCelestialBodyName(body),
  setTopocentric: (longitude, latitude, altitude = 0) => inst().setTopocentric(longitude, latitude, altitude),
  calculateRiseTransitSet,
  close: () => inst().close(),
};
