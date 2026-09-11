/**
 * Birth-Time Rectification — 3 classical cross-checks against a recorded
 * birth time. Adapted from the AstrologicLab birthRectification.ts methods,
 * rebuilt on Kotravel's own @swisseph/node + Vimshottari pipeline.
 *
 *  ① Prāṇa / Deha / Mūcchu daśā — the Vimshottari sub-periods running at the
 *     birth instant, taken 7 levels deep (Mahā→Bhukti→Antara→Sūkṣma→Prāṇa→
 *     Deha→Mūcchu) by following the first, birth-straddling child at each
 *     level. The Deha-daśā lord's intrinsic gender should agree with the
 *     stated birth gender; its indicative birth-condition (Siddhar/Nāḍī
 *     empirical tradition — REFERENCE ONLY) is surfaced when known.
 *
 *  ② Kunda Siddhānta (×81) — Praśna Mārga: Lagna's sidereal longitude in
 *     arc-minutes × 81, mod 21,600′ → the Kunda point. Its nakṣatra must
 *     share the janma-nakṣatra's lord (janma star or its trikoṇa, ±9).
 *
 *  ③ Tattwa / Antar-Tattwa (Śiva Svarodaya) — a 90-minute pañca-bhūta cycle
 *     counted from sunrise (odd rounds direct, even rounds reverse), with an
 *     antar sub-division. The antar-tattva's gender should match the stated
 *     birth gender; the tool suggests the smallest ± shift (to the second)
 *     that would make it match.
 */
const { calculateParashariChart } = require('../chart/parashariChart');
const { subPeriods, buildVimshottariDasha } = require('../dasha/vimshottariDasha');
const { sunriseJulianDay } = require('../ephemeris/siderealPositions');
const { julianDay } = require('@swisseph/node');

const VIMSHOTTARI_CYCLE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const VIMSHOTTARI_YEARS = { Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20 };
const LORD_TAMIL = { Ketu: 'கேது', Venus: 'சுக்கிரன்', Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Rahu: 'ராகு', Jupiter: 'குரு', Saturn: 'சனி', Mercury: 'புதன்' };
// BPHS graha gender: Sun/Mars/Jupiter male; Moon/Venus female; Mercury/Saturn/Rahu/Ketu neutral
const LORD_GENDER = { Sun: 'male', Mars: 'male', Jupiter: 'male', Moon: 'female', Venus: 'female', Mercury: 'neutral', Saturn: 'neutral', Rahu: 'neutral', Ketu: 'neutral' };
const DEHA_BIRTH_CONDITION = {
  Mars: 'அறுவை சிகிச்சை / கருவி தலையீடு சாத்தியம் (surgical / instrumental delivery)',
  Rahu: 'அறுவை சிகிச்சை / இரத்தப்போக்கு சாத்தியம் (surgical / bleeding)',
  Ketu: 'தொப்புள்கொடி கழுத்தில் சுற்றல் சாத்தியம் (cord around the neck)',
  Moon: 'சுகப்பிரசவம் (smooth delivery)',
  Venus: 'சுகப்பிரசவம் (smooth delivery)',
  Saturn: 'நீண்ட பிரசவ வலி / தாமதப் பிறப்பு (prolonged labour / delayed birth)',
};
const BTR_DISCLAIMER = 'சித்தர்/நாடி அனுபவ மரபு — reference மட்டும், authoritative அல்ல · Siddhar/Nāḍī empirical tradition — reference only';

const LEVEL_NAMES = ['மகாதசை (Mahā)', 'புக்தி (Bhukti)', 'அந்தரம் (Antara)', 'சூக்ஷ்மம் (Sūkṣma)', 'பிராணம் (Prāṇa)', 'தேகம் (Deha)', 'மூச்சு (Mūcchu)'];

function norm360(x) { return ((x % 360) + 360) % 360; }

// ── ① Prāṇa / Deha / Mūcchu ────────────────────────────────────────────────
function pranaDehaChain(birthInput) {
  const natal = calculateParashariChart({ input: birthInput, ayanamsha: 'Lahiri', houseSystem: 'Placidus' });
  const moonLon = natal.grahas.Moon.longitude;
  const birthJd = julianDay(
    birthInput.year, birthInput.month, birthInput.day,
    birthInput.hour + (birthInput.minute || 0) / 60 - (birthInput.utcOffsetMinutes || 0) / 60,
  );
  // The balance Mahadasha straddling birth: at birth only `balanceYears` remain,
  // so its TRUE start is `elapsed` years before birth. Model birth as year 0 and
  // follow the child period that contains year 0 down 7 levels.
  const d1 = buildVimshottariDasha(birthJd, moonLon, birthInput.utcOffsetMinutes || 0, { depth: 1 });
  const mahaLord = d1.startingLord;
  const fullDur = VIMSHOTTARI_YEARS[mahaLord];
  const elapsed = fullDur - d1.balanceYearsAtBirth;

  let cur = { lord: mahaLord, durationYears: fullDur, startYears: -elapsed };
  const chain = [{ level: LEVEL_NAMES[0], lord: cur.lord, lordTamil: LORD_TAMIL[cur.lord] }];
  for (let i = 1; i < 7; i++) {
    const subs = subPeriods(cur.lord, cur.durationYears, cur.startYears);
    cur = subs.find((s) => s.startYears <= 0 && 0 < s.endYears) || subs[0];
    chain.push({ level: LEVEL_NAMES[i], lord: cur.lord, lordTamil: LORD_TAMIL[cur.lord] });
  }
  const deha = chain[5], prana = chain[4];
  const genderChar = (birthInput.gender === 'female') ? 'F' : 'M';
  const g = (lord) => LORD_GENDER[lord];
  const matches = (lord) => (genderChar === 'M' && g(lord) === 'male') || (genderChar === 'F' && g(lord) === 'female');
  return {
    chain,
    prana, deha, mucchu: chain[6],
    genderStated: genderChar,
    dehaGender: { gender: g(deha.lord), matches: matches(deha.lord) },
    pranaGender: { gender: g(prana.lord), matches: matches(prana.lord) },
    dehaConditionIndicative: DEHA_BIRTH_CONDITION[deha.lord] || null,
    disclaimer: BTR_DISCLAIMER,
  };
}

// ── ② Kunda Siddhānta ×81 ─────────────────────────────────────────────────
function kunda(birthInput) {
  const natal = calculateParashariChart({ input: birthInput, ayanamsha: 'Lahiri', houseSystem: 'Placidus' });
  const lagnaLon = natal.lagna.longitude;
  const moonLon = natal.grahas.Moon.longitude;
  const NAK = 360 / 27;
  const janmaNak = Math.floor(norm360(moonLon) / NAK) % 27;

  const lagnaMin = norm360(lagnaLon) * 60;
  const kundaMin = (lagnaMin * 81) % 21600;
  const NAK_MIN = 21600 / 27; // 800'
  const kundaNak = Math.floor(kundaMin / NAK_MIN) % 27;
  const kundaPada = Math.min(4, Math.floor((kundaMin % NAK_MIN) / (NAK_MIN / 4)) + 1);
  const sameLord = (((kundaNak % 9) + 9) % 9) === (((janmaNak % 9) + 9) % 9);

  const NAK_NAMES = ['Ashwini', 'Bharani', 'Kritika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
  return {
    lagnaLongitude: Math.round(lagnaLon * 100) / 100,
    janmaNakshatra: NAK_NAMES[janmaNak],
    kundaLongitude: Math.round((kundaMin / 60) * 100) / 100,
    kundaNakshatra: NAK_NAMES[kundaNak],
    kundaPada,
    kundaLord: LORD_TAMIL[VIMSHOTTARI_CYCLE[kundaNak % 9]],
    janmaLord: LORD_TAMIL[VIMSHOTTARI_CYCLE[janmaNak % 9]],
    matches: sameLord,
  };
}

// ── ③ Tattwa / Antar-Tattwa ──────────────────────────────────────────────
const TATTWA_CYCLE = [
  { key: 'prithvi', tamil: 'பிருத்வி (Earth)', durMin: 6, gender: 'M' },
  { key: 'jala', tamil: 'ஜலம் (Water)', durMin: 12, gender: 'F' },
  { key: 'agni', tamil: 'அக்னி (Fire)', durMin: 18, gender: 'M' },
  { key: 'vayu', tamil: 'வாயு (Air)', durMin: 24, gender: 'F' },
  { key: 'akasha', tamil: 'ஆகாசம் (Ether)', durMin: 30, gender: 'M' },
];
// weekday 0=Sun..6=Sat → start index into TATTWA_CYCLE (Śiva Svarodaya śloka 151)
const WEEKDAY_TATTWA_START = [2, 1, 2, 0, 4, 1, 3];
const SEC = TATTWA_CYCLE.map((t) => t.durMin * 60); // [360,720,1080,1440,1800]

function tattwaAt(secSinceSunrise, weekday) {
  const round = Math.floor(secSinceSunrise / 5400);
  const direct = round % 2 === 0;
  const pos = ((secSinceSunrise % 5400) + 5400) % 5400;
  const start = WEEKDAY_TATTWA_START[((weekday % 7) + 7) % 7];
  let cum = 0, mainIdx = start, mainStart = 0;
  for (let i = 0; i < 5; i++) {
    const idx = direct ? (start + i) % 5 : (((start - i) % 5) + 5) % 5;
    if (pos < cum + SEC[idx]) { mainIdx = idx; mainStart = cum; break; }
    cum += SEC[idx];
  }
  const into = pos - mainStart;
  let acum = 0, subIdx = mainIdx;
  for (let i = 0; i < 5; i++) {
    const idx = (mainIdx + i) % 5;
    const sd = Math.round((SEC[mainIdx] * SEC[idx]) / 5400);
    if (into < acum + sd) { subIdx = idx; break; }
    acum += sd;
  }
  return { round, direct, main: TATTWA_CYCLE[mainIdx], antar: TATTWA_CYCLE[subIdx] };
}

function tattwa(birthInput) {
  const genderChar = (birthInput.gender === 'female') ? 'F' : 'M';
  const jdLocalMidnight = julianDay(birthInput.year, birthInput.month, birthInput.day, -(birthInput.utcOffsetMinutes || 0) / 60);
  const sunriseJd = sunriseJulianDay(jdLocalMidnight, birthInput.latitude, birthInput.longitude);
  const birthJdUt = julianDay(
    birthInput.year, birthInput.month, birthInput.day,
    birthInput.hour + (birthInput.minute || 0) / 60 - (birthInput.utcOffsetMinutes || 0) / 60,
  );
  let secSinceSunrise = Math.round((birthJdUt - sunriseJd) * 86400);
  // born before sunrise → belongs to the previous Vedic day; wrap by a full day
  const sunriseWeekday = new Date((sunriseJd - 2440587.5) * 86400000).getUTCDay();
  let weekday = sunriseWeekday;
  if (secSinceSunrise < 0) { secSinceSunrise += 86400; weekday = (sunriseWeekday + 6) % 7; }

  const cur = tattwaAt(secSinceSunrise, weekday);
  let shiftSeconds = 0, adjusted = false;
  let out = cur;
  if (cur.antar.gender !== genderChar) {
    let fwd = 0, bwd = 0;
    for (let s = 1; s <= 3600; s++) { if (tattwaAt(secSinceSunrise + s, weekday).antar.gender === genderChar) { fwd = s; break; } }
    for (let s = 1; s <= 3600 && secSinceSunrise - s >= 0; s++) { if (tattwaAt(secSinceSunrise - s, weekday).antar.gender === genderChar) { bwd = s; break; } }
    if (fwd || bwd) {
      shiftSeconds = (fwd && bwd) ? (fwd <= bwd ? fwd : -bwd) : (fwd || -bwd);
      adjusted = true;
      out = tattwaAt(secSinceSunrise + shiftSeconds, weekday);
    }
  }
  const sr = new Date((sunriseJd + (birthInput.utcOffsetMinutes || 0) / 1440 - 2440587.5) * 86400000);
  return {
    sunriseLocal: `${String(sr.getUTCHours()).padStart(2, '0')}:${String(sr.getUTCMinutes()).padStart(2, '0')}`,
    minutesSinceSunrise: Math.round(secSinceSunrise / 60),
    round: cur.round + 1,
    direction: cur.direct ? 'direct (நேர்)' : 'reverse (எதிர்)',
    mainTattwa: cur.main.tamil,
    antarTattwa: cur.antar.tamil,
    antarGender: cur.antar.gender,
    genderStated: genderChar,
    matches: cur.antar.gender === genderChar,
    suggestedShiftSeconds: shiftSeconds,
    adjustedAntarTattwa: adjusted ? out.antar.tamil : null,
    disclaimer: BTR_DISCLAIMER,
  };
}

function calculateRectification(birthInput) {
  return {
    chart: calculateParashariChart({ input: birthInput, ayanamsha: 'Lahiri', houseSystem: 'Placidus' }),
    pranaDeha: pranaDehaChain(birthInput),
    kunda: kunda(birthInput),
    tattwa: tattwa(birthInput),
  };
}

module.exports = { calculateRectification };
