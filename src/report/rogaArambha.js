/**
 * The onset of an illness (tables in `rogaArambhaTables.js`): the books' lists laid side by side for all
 * 27 stars, and, for a given moment, what each book says of it — the length of the illness for the Moon's
 * star, then the combinations of weekday, tithi, karana and the patient's birth star that its rules name.
 * The moment's star, tithi and karana are astronomical; the weekday begins at sunrise.
 */

const { julianDay } = require('@swisseph/node');
const { sunMoonLongitudes, sunriseJulianDay } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { karanaName } = require('../panchangam/tirukanitaPanchangam');
const { NAKSHATRA_TA } = require('./babyNames');
const T = require('./rogaArambhaTables');
const { WEEKDAY_TA: VARA_TA } = require('../sources/tamilNames');

const DAY_MS = 86400000;
const JD_UNIX_EPOCH = 2440587.5;
const STAR_DEG = 360 / 27;
const norm360 = (d) => ((d % 360) + 360) % 360;
const iso = (ms) => new Date(ms).toISOString();
const jdOf = (ms) => ms / DAY_MS + JD_UNIX_EPOCH;

const TITHI_TA = ['பிரதமை', 'துவிதியை', 'திருதியை', 'சதுர்த்தி', 'பஞ்சமி', 'சஷ்டி', 'சப்தமி', 'அஷ்டமி', 'நவமி', 'தசமி', 'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்த்தசி'];
const KARANA_TA = {
  Bava: 'பவம்', Balava: 'பாலவம்', Kaulava: 'கௌலவம்', Taitila: 'தைதுலம்', Garaja: 'கரசை', Vanija: 'வணிசை', Vishti: 'விஷ்டி (பத்திரை)',
  Kimstughna: 'கிம்ஸ்துக்னம்', Shakuni: 'சகுனி', Chatushpada: 'சதுஷ்பாதம்', Naga: 'நாகவம்',
};
const NADI_TA = { ADI: 'ஆதி', MADHYA: 'மத்யம்', ANTYA: 'அந்த்யம்' };

/** The weekday (0 = Sunday) of the Hindu day the moment falls in: the day starts at sunrise. */
function varaAt(atMs, latitude, longitude, utcOffsetMinutes) {
  const local = new Date(atMs + utcOffsetMinutes * 60000);
  const [y, m, dd] = [local.getUTCFullYear(), local.getUTCMonth() + 1, local.getUTCDate()];
  const sunrise = sunriseJulianDay(julianDay(y, m, dd, -utcOffsetMinutes / 60), latitude, longitude);
  const civil = new Date(Date.UTC(y, m - 1, dd)).getUTCDay();
  return Number.isFinite(sunrise) && jdOf(atMs) < sunrise ? (civil + 6) % 7 : civil;
}

/** Star, quarter, tithi, karana, weekday and the Sun's star at a moment. */
function momentFacts({ atMs, latitude, longitude, utcOffsetMinutes, ayanamsha }) {
  const { sunLongitude, moonLongitude } = sunMoonLongitudes(jdOf(atMs), ayanamsha);
  const moon = norm360(moonLongitude);
  const elong = norm360(moonLongitude - sunLongitude);
  const tithi30 = Math.floor(elong / 12) + 1;
  const karana = karanaName(Math.floor(elong / 6));
  const star = Math.floor(moon / STAR_DEG);
  return {
    moonLongitude: moon,
    star, starTa: NAKSHATRA_TA[star], pada: Math.floor((moon % STAR_DEG) / (STAR_DEG / 4)) + 1,
    sunStar: Math.floor(norm360(sunLongitude) / STAR_DEG), sunStarTa: NAKSHATRA_TA[Math.floor(norm360(sunLongitude) / STAR_DEG)],
    tithi30, tithiNum: tithi30 % 15 || 15, amavasya: tithi30 === 30, purnima: tithi30 === 15,
    paksha: tithi30 <= 15 ? 'SHUKLA' : 'KRISHNA',
    tithiTa: tithi30 === 15 ? 'பௌர்ணமி' : tithi30 === 30 ? 'அமாவாசை' : TITHI_TA[(tithi30 - 1) % 15],
    karana, karanaTa: KARANA_TA[karana] ?? karana, karanaSthira: T.STHIRA_KARANAS.includes(karana) || karana === 'Vishti',
    vara: varaAt(atMs, latitude, longitude, utcOffsetMinutes),
  };
}

/** Each condition of a combination as met / not met / unknown (null: needs the birth star). */
function conditionsOf(cond, f, natalStar) {
  const out = [];
  if (cond.stars) out.push({ key: 'STAR', ok: cond.stars.includes(f.star) });
  if (cond.varas) out.push({ key: 'VARA', ok: cond.varas.includes(f.vara) });
  if (cond.tithis || cond.amavasya) out.push({ key: 'TITHI', ok: Boolean(cond.tithis?.includes(f.tithiNum) && !f.amavasya && !f.purnima) || Boolean(cond.amavasya && f.amavasya) });
  if (cond.karanas) out.push({ key: 'KARANA', ok: f.karanaSthira });
  if (cond.tara) out.push({ key: 'TARA', ok: natalStar == null ? null : cond.tara.includes(((f.star - natalStar + 27) % 27) + 1) });
  if (cond.nadi) {
    out.push({ key: 'NADI', ok: natalStar == null ? null : T.nadiOf(natalStar) === T.nadiOf(f.star) && T.nadiOf(f.star) === T.nadiOf(f.sunStar) });
  }
  return out;
}
const metOf = (conds) => (conds.some((c) => c.ok === false) ? false : conds.some((c) => c.ok === null) ? null : true);

function evaluateRule(rule, f, natalStar) {
  const alts = rule.any ?? [rule.when];
  const tried = alts.map((a) => conditionsOf(a, f, natalStar));
  const verdicts = tried.map(metOf);
  const met = verdicts.includes(true) ? true : verdicts.includes(null) ? null : false;
  // The alternative that came closest, for the page to show which parts held.
  const score = (cs) => cs.filter((c) => c.ok).length;
  const best = tried.reduce((b, cs, i) => (score(cs) > score(tried[b]) ? i : b), 0);
  return { id: rule.id, book: rule.book, severity: rule.severity, textTa: rule.textTa, met, parts: tried[best], alternative: alts.length > 1 ? best : null, daysAssumed: Boolean(rule.daysAssumed) };
}

/** The Moon opposite the place it held at the onset — Raman's "14th day" — after `atMs`. */
function moonOpposition(atMs, moonLongitude, ayanamsha) {
  const g = (ms) => ((norm360(sunMoonLongitudes(jdOf(ms), ayanamsha).moonLongitude) - moonLongitude - 180 + 540) % 360) - 180;
  let lo = atMs + 10 * DAY_MS;
  const stepMs = DAY_MS / 8;
  let hi = lo;
  while (hi < atMs + 22 * DAY_MS && g(hi) < 0) { lo = hi; hi += stepMs; }
  if (g(hi) < 0) return null;
  for (let i = 0; i < 30; i += 1) { const mid = (lo + hi) / 2; if (g(mid) < 0) lo = mid; else hi = mid; }
  return Math.round((lo + hi) / 2);
}

const cellOut = (c, atMs) => (c ? {
  kind: c.kind, textTa: T.cellTa(c), noteTa: c.noteTa,
  days: T.approxDays(c),
  expectedUtc: c.kind === 'CURE' || c.kind === 'DANGER' || c.kind === 'DEVELOP' ? T.approxDays(c).map((n) => iso(atMs + n * DAY_MS)) : null,
} : { kind: 'NONE', textTa: T.cellTa(null), noteTa: null, days: null, expectedUtc: null });

const CELLS_OF = {
  WILHELM: T.WILHELM_CELLS, SHRIDHAR: T.SHRIDHAR_CELLS, KALAPRAKASIKA: T.KALAPRAKASIKA_CELLS, MC: T.MC_CELLS,
  KR: T.KR_CELLS, JOSHI: T.JOSHI_CELLS, RANGACHARYA: T.RANGACHARYA_CELLS, RAMAN: new Array(T.STAR_COUNT).fill(null),
};

/** All 27 stars, book by book, with the sources and the books' differences. */
function rogaArambhaTable() {
  return {
    stars: NAKSHATRA_TA.map((nameTa, index) => ({ index, nameTa })),
    order: T.ORDER,
    books: T.ORDER.map((key) => ({
      key, bookTa: T.BOOK_TA[key], words: T.WORDS[key], source: T.SOURCES[key],
      cells: CELLS_OF[key].map((c) => (c ? { kind: c.kind, textTa: T.cellTa(c) } : null)),
      flags: T.FLAGS[key] ?? {},
    })),
    flagTa: T.FLAG_TA,
    wilhelmMc: T.WILHELM_MC_REMARKS.map((c) => (c ? { kind: c.kind, textTa: T.cellTa(c) } : null)),
    shridharTable: T.SHRIDHAR_QUARTERS,
    shridharTableSource: T.SOURCES.SHRIDHAR_TABLE,
    rank: { order: T.ORDER, words: T.WORDS, measureTa: `நோய்த் தொடக்கம் பற்றிய சொற்கள்: ${T.ORDER.map((k) => `${T.BOOK_TA[k].split(' (')[0]} ${T.WORDS[k]}`).join(', ')}.` },
    differences: T.DIFFERENCES, ourReadingsTa: T.OUR_READINGS_TA,
  };
}

/**
 * @param atMs the moment the illness began (UTC ms)
 * @param natalMoonLongitude sidereal, optional — the patient's birth Moon (tara, tri-nadi)
 * @param snakeBite the illness is a snake / insect bite (the bite rules apply only then)
 */
function rogaArambha({ atMs, latitude, longitude, utcOffsetMinutes = 0, ayanamsha = 'Lahiri', natalMoonLongitude = null, snakeBite = false }) {
  if (!Number.isFinite(atMs)) throw new UnsupportedInputError('the moment the illness began is required', 'atMs');
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new UnsupportedInputError('the place (latitude, longitude) is required', 'latitude');
  const f = momentFacts({ atMs, latitude, longitude, utcOffsetMinutes, ayanamsha });
  const natalStar = Number.isFinite(natalMoonLongitude) ? Math.floor(norm360(natalMoonLongitude) / STAR_DEG) : null;

  const books = T.ORDER.map((key) => {
    const flags = T.FLAGS[key] ?? {};
    const cell = key === 'RAMAN' ? null : CELLS_OF[key][f.star];
    return {
      key, bookTa: T.BOOK_TA[key], words: T.WORDS[key], source: T.SOURCES[key],
      cell: key === 'RAMAN' ? null : cellOut(cell, atMs),
      flagsHere: Object.keys(flags).filter((k) => flags[k].includes(f.star)).map((k) => ({ key: k, textTa: T.FLAG_TA[k] })),
      listsStars: Boolean(flags.NEEDS_TREATMENT || flags.FATAL),
      quarter: key === 'SHRIDHAR' && T.SHRIDHAR_QUARTERS[f.star] ? { pada: f.pada, days: T.SHRIDHAR_QUARTERS[f.star].quarters[f.pada - 1], all: T.SHRIDHAR_QUARTERS[f.star].quarters, donationTa: T.SHRIDHAR_QUARTERS[f.star].donationTa } : null,
      wilhelmMc: key === 'WILHELM' && T.WILHELM_MC_REMARKS[f.star] ? { kind: T.WILHELM_MC_REMARKS[f.star].kind, textTa: T.cellTa(T.WILHELM_MC_REMARKS[f.star]) } : null,
    };
  });

  const rules = T.RULES
    .filter((r) => (r.needs === 'BITE' ? snakeBite : true))
    .map((r) => (r.needs === 'NATAL' && natalStar == null
      ? { id: r.id, book: r.book, severity: r.severity, textTa: r.textTa, met: null, parts: [], alternative: null, daysAssumed: false }
      : evaluateRule(r, f, natalStar)));

  const crisisMs = moonOpposition(atMs, f.moonLongitude, ayanamsha);
  return {
    atUtc: iso(atMs), facts: f, natal: natalStar == null ? null : { star: natalStar, starTa: NAKSHATRA_TA[natalStar], tara: ((f.star - natalStar + 27) % 27) + 1, nadiTa: NADI_TA[T.nadiOf(natalStar)] },
    nadiNowTa: { moon: NADI_TA[T.nadiOf(f.star)], sun: NADI_TA[T.nadiOf(f.sunStar)] },
    varaTa: VARA_TA[f.vara], snakeBite,
    books, rules, crisisUtc: crisisMs == null ? null : iso(crisisMs),
    rank: rogaArambhaTable().rank,
  };
}

module.exports = { rogaArambha, rogaArambhaTable, momentFacts, varaAt, evaluateRule, VARA_TA };
