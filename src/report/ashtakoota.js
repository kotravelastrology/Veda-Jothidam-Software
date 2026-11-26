/**
 * Ashtakoota for a bride and a bridegroom (tables in `ashtakootaTables.js`, Shridhar §18.7): the eight kootas read
 * from the two Moons, the total in 36, the doshas, and the book's verdict band. Pure functions of the two Moons'
 * sidereal longitudes; nothing here guesses a missing value.
 */

const { UnsupportedInputError } = require('../contracts/chartContext');
const { NAKSHATRA_TA } = require('./babyNames');
const T = require('./ashtakootaTables');
const { RASI_TA } = require('../sources/tamilNames');

const norm360 = (d) => ((d % 360) + 360) % 360;
const STAR_DEG = 360 / 27;

/** A person's Moon: star, pada, sign, degrees in the sign. */
function moonOf(longitude) {
  if (!Number.isFinite(longitude)) throw new UnsupportedInputError('the Moon\'s longitude is required', 'moonLongitude');
  const lon = norm360(longitude);
  const star = Math.floor(lon / STAR_DEG);
  return {
    longitude: lon, star, starTa: NAKSHATRA_TA[star], pada: Math.floor((lon % STAR_DEG) / (STAR_DEG / 4)) + 1,
    rashi: Math.floor(lon / 30), rashiTa: RASI_TA[Math.floor(lon / 30)], degree: lon % 30,
  };
}

/** Tara: the two countings (each bride-from-groom and groom-from-bride) divided by nine. */
function taraOf(bride, groom) {
  const fromGroom = ((((bride.star - groom.star) % 27) + 27) % 27) + 1;
  const fromBride = ((((groom.star - bride.star) % 27) + 27) % 27) + 1;
  const rem = (n) => (n % 9 === 0 ? 9 : n % 9);
  const rBride = rem(fromGroom); // the bride's star counted from the bridegroom's
  const rGroom = rem(fromBride);
  const badBride = T.TARA_BAD.includes(rBride); // death to the bride (-G)
  const badGroom = T.TARA_BAD.includes(rGroom); // death to the bridegroom (-B)
  const points = badBride && badGroom ? 0 : badBride || badGroom ? 1.5 : 3;
  return { points, brideCount: fromGroom, groomCount: fromBride, brideRemainder: rBride, groomRemainder: rGroom, deathToBride: badBride, deathToGroom: badGroom };
}

function kootas(bride, groom) {
  const varnaB = T.VARNA_OF_RASHI[bride.rashi];
  const varnaG = T.VARNA_OF_RASHI[groom.rashi];
  const vB = T.vashyaGroup(bride.rashi, bride.degree);
  const vG = T.vashyaGroup(groom.rashi, groom.degree);
  const yB = T.YONI_OF_STAR[bride.star];
  const yG = T.YONI_OF_STAR[groom.star];
  const mB = T.MAITRI_GROUP_OF_RASHI[bride.rashi];
  const mG = T.MAITRI_GROUP_OF_RASHI[groom.rashi];
  const gB = T.GANA_OF_STAR[bride.star];
  const gG = T.GANA_OF_STAR[groom.star];
  const distance = ((groom.rashi - bride.rashi + 12) % 12) + 1;
  const nB = T.NADI_OF_STAR[bride.star];
  const nG = T.NADI_OF_STAR[groom.star];
  const tara = taraOf(bride, groom);
  return {
    VARNA: { points: varnaG <= varnaB ? 1 : 0, bride: T.VARNA_TA[varnaB], groom: T.VARNA_TA[varnaG], noteTa: 'மணமகன் வர்ணம் மணமகளுக்குச் சமமாகவோ உயர்வாகவோ இருந்தால் 1' },
    VASHYA: { points: T.VASHYA[vB][vG], bride: T.VASHYA_TA[vB], groom: T.VASHYA_TA[vG] },
    TARA: { points: tara.points, bride: `${tara.brideCount} → ${tara.brideRemainder}`, groom: `${tara.groomCount} → ${tara.groomRemainder}`, detail: tara },
    YONI: { points: T.YONI[yB][yG], bride: T.YONI_TA[yB], groom: T.YONI_TA[yG] },
    GRAHA_MAITRI: { points: T.GRAHA_MAITRI[mB][mG], bride: T.MAITRI_LORD_TA[mB], groom: T.MAITRI_LORD_TA[mG] },
    GANA: { points: T.GANA[gB][gG], bride: T.GANA_TA[gB], groom: T.GANA_TA[gG] },
    BHAKUTA: { points: T.BHAKUTA_GOOD_DISTANCES.includes(distance) ? 7 : 0, bride: bride.rashiTa, groom: groom.rashiTa, distance, sameSign: distance === 1 },
    NADI: { points: nB === nG ? 0 : 8, bride: T.NADI_TA[nB], groom: T.NADI_TA[nG] },
  };
}

function bandOf(total, bhakutaPoints) {
  const bands = bhakutaPoints > 0 ? T.BANDS.NORMAL : T.BANDS.BHAKUTA_ABSENT;
  const b = bands.find((x) => total >= x.from);
  return { code: b.code, textTa: b.textTa, bhakutaAbsent: bhakutaPoints === 0 };
}

/**
 * @param bride, groom { moonLongitude } sidereal
 */
function ashtakoota({ bride, groom }) {
  const b = moonOf(bride.moonLongitude);
  const g = moonOf(groom.moonLongitude);
  const k = kootas(b, g);
  const rows = T.KOOTAS.map((id) => ({
    id, nameTa: T.KOOTA_TA[id], areaTa: T.AREA_TA[id], max: T.MAX[id], points: k[id].points, bride: k[id].bride, groom: k[id].groom,
    dosha: k[id].points < T.MAX[id],
    major: (id === 'NADI' || id === 'BHAKUTA') ? k[id].points === 0 : id === 'GANA' ? k[id].points <= 1 : false,
    sources: T.SOURCES[id], noteTa: k[id].noteTa ?? null,
  }));
  const total = rows.reduce((s, r) => s + r.points, 0);
  return {
    bride: b, groom: g, rows, total, maximum: 36, band: bandOf(total, k.BHAKUTA.points),
    nadiDosha: k.NADI.points === 0, bhakutaDosha: k.BHAKUTA.points === 0, tara: k.TARA.detail, bhakuta: { distance: k.BHAKUTA.distance, sameSign: k.BHAKUTA.sameSign },
    nadiRejectTa: k.NADI.points === 0 ? T.NADI_REJECT_TA : null,
    sources: { overview: T.SOURCES.OVERVIEW, totals: T.SOURCES.TOTALS }, ourReadingsTa: T.OUR_READINGS_TA,
  };
}

module.exports = { ashtakoota, moonOf, taraOf, kootas };
