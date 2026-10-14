/**
 * முகூர்த்த தேடல் — a real electional search (replaces the Math.random mock
 * in src/analysis/MuhurtaFinder.tsx).
 *
 * For a date range + purpose + place it scans each day and scores it from
 * REAL panchanga (tithi / nakshatra / yoga / weekday at that day's sunrise,
 * via Kotravel's Swiss Ephemeris) against standard per-purpose favourable /
 * avoid tables, plus the Panchaka Rahitam lagna-shuddhi remainder. Each
 * qualifying day's auspicious Gowri windows are returned as the muhurta
 * candidates.
 *
 * Tables (rebuilt 2026-10-11): an event whose rules have been read from the
 * books (eventMuhurtaTables.js — entering a new house, nine books) is judged
 * by the chosen book's reading at sunrise: month, Uttarayana, star, tithi,
 * weekday, the Kumbha chakra. The other purposes' lists below were never
 * sourced: for them the days carry their panchanga but no verdict —
 * "ஆதாரம் தேவை / SOURCE REQUIRED". The lagna, tara and chandra bala are on
 * /muhurta-stars.
 */
const { julianDay } = require('@swisseph/node');
const { sunriseJulianDay, sunMoonLongitudes, siderealAscendant } = require('../ephemeris/siderealPositions');
const { calculateDailyMuhurta } = require('./dailyMuhurta');
const EV = require('./eventMuhurtaTables');
const { panchangaCodes, varaCodes, rejects, isVishti, isSthiraKarana, withSecondary, vijayadashamiOf } = require('./eventMuhurta');

/** Purposes with rules read from the books, and their event. */
const SOURCED = Object.freeze({ griha: 'GRIHA_PRAVESHA', upanayana: 'UPANAYANA', travel: 'TRAVEL', education: 'VIDYARAMBHA', study: 'EDUCATION', business: 'BUSINESS', medical: 'MEDICINE', surgery: 'SURGERY' });
/** The rules a sunrise can judge without the person, the direction or the planets (the rest are on /muhurta-stars). */
const SUNRISE_RULES = Object.freeze([
  'masa', 'uttarayana', 'sunSign', 'harishayana', 'nak', 'nakAfter', 'abhijitOk', 'tithi', 'tithiMid', 'tithiNot', 'anadhyaya', 'galagraha', 'yogaNot', 'yogaHalfNot',
  'vishti', 'karanaFixed', 'kumbha', 'matrika', 'vara', 'holanta', 'holi', 'krishnaMid', 'vijayadashami', 'secondary',
]);
const ABHIJIT = Object.freeze([276 + 40 / 60, 280 + 53 / 60 + 20 / 3600]);
const sunriseReading = (r) => Object.fromEntries(Object.entries(r).filter(([k]) => SUNRISE_RULES.includes(k)));
const SOURCE_REQUIRED_TA = 'ஆதாரம் தேவை / SOURCE REQUIRED — இந்தக் காரியத்தின் விதிகள் நூல்களிலிருந்து இன்னும் கட்டப்படவில்லை';

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];
const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
  'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * The purposes. Their old star / tithi / weekday lists ("classical convention")
 * had no page behind them and were removed 2026-10-11; a purpose's rules come
 * from eventMuhurtaTables.js once read from the books (SOURCED).
 */
const PURPOSES = {
  marriage: { label: 'திருமணம்' },
  business: { label: 'வியாபாரம் தொடங்குதல்' },
  travel: { label: 'பயணம்' },
  griha: { label: 'கிரகப்பிரவேசம்' },
  upanayana: { label: 'உபநயனம்' },
  education: { label: 'வித்யாரம்பம் (அக்ஷராப்யாசம்)' },
  study: { label: 'கல்வி தொடக்கம் (உபநயனத்துக்குப் பின்)' },
  ritual: { label: 'சடங்கு / பொதுச் சுப காரியம்' },
  medical: { label: 'மருந்து / சிகிச்சை தொடக்கம்' },
  surgery: { label: 'அறுவை சிகிச்சை' },
};

const norm = (d) => ((d % 360) + 360) % 360;

/** The lunar month (amanta) at jd: back to the new moon (Moon − Sun = 0), the Sun's sign there, plus one (Chaitra = Sun in Pisces). */
function monthAt(jd) {
  let t = jd;
  for (let k = 0; k < 8; k += 1) {
    const { sunLongitude: s, moonLongitude: m } = sunMoonLongitudes(t, 'Lahiri');
    const e = norm(m - s);
    if (k > 0 && (e < 1e-4 || e > 360 - 1e-4)) break;
    t -= (k === 0 ? e : (e > 180 ? e - 360 : e)) / 12.19;
  }
  return (Math.floor(norm(sunMoonLongitudes(t, 'Lahiri').sunLongitude) / 30) + 1) % 12;
}

/** @param q { startDate, endDate 'YYYY-MM-DD', purpose, latitude, longitude, utcOffsetMinutes, book? } */
function searchMuhurta(q) {
  const purpose = PURPOSES[q.purpose] ? q.purpose : 'marriage';
  const P = PURPOSES[purpose];
  const off = q.utcOffsetMinutes || 0;
  const event = SOURCED[purpose] ?? null;
  const R = event ? EV.EVENTS[event] : null;
  const book = R ? (R.order.includes(q.book) ? q.book : R.default) : null;

  const start = new Date(`${q.startDate}T00:00:00Z`);
  const end = new Date(`${q.endDate}T00:00:00Z`);
  const days = [];
  const MAX_DAYS = 62;

  for (let d = new Date(start); d <= end && days.length < MAX_DAYS; d.setUTCDate(d.getUTCDate() + 1)) {
    const Y = d.getUTCFullYear();
    const M = d.getUTCMonth() + 1;
    const D = d.getUTCDate();
    const jdMid = julianDay(Y, M, D, -off / 60);
    const sunrise = sunriseJulianDay(jdMid, q.latitude, q.longitude);
    const { sunLongitude, moonLongitude } = sunMoonLongitudes(sunrise, 'Lahiri');
    const nakIdx = Math.floor(norm(moonLongitude) / (360 / 27)) % 27;
    const nak = NAKSHATRAS[nakIdx];
    const elong = norm(moonLongitude - sunLongitude);
    const tithiIdx = Math.floor(elong / 12); // 0-29
    const paksha = tithiIdx < 15 ? 'Shukla' : 'Krishna';
    const tithi = tithiIdx === 29 ? 'Amavasya' : tithiIdx === 14 ? 'Purnima' : TITHI_NAMES[tithiIdx % 15];
    const wd = new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
    const weekday = WEEKDAYS[wd];

    const dm = calculateDailyMuhurta({ year: Y, month: M, day: D, latitude: q.latitude, longitude: q.longitude, utcOffsetMinutes: off });

    const goodGowri = dm.gowri.day.filter((g) => g.auspicious).map((g) => ({ from: g.from, to: g.to, gowri: g.nameTa }));
    const date = `${Y}-${String(M).padStart(2, '0')}-${String(D).padStart(2, '0')}`;

    if (!R) {
      days.push({ date, weekday, nakshatra: nak, tithi: `${paksha} ${tithi}`, score: null, rating: 'ஆதாரம் தேவை', windows: goodGowri, notes: [SOURCE_REQUIRED_TA] });
      continue;
    }
    // The chosen book's rules at sunrise.
    const month = monthAt(sunrise);
    const reading = sunriseReading(R[book]);
    // Vijayadashami's day (Kalyanraman): Ashvin Shukla 10 six ghatis (0.1 day) after this sunrise; or at the next
    // sunrise but not six ghatis after it (it is then the day before); or wholly within this day.
    let vijaya = false;
    if (R[book].vijayadashami) {
      const s10 = (jd) => { const t = sunMoonLongitudes(jd, 'Lahiri'); return Math.floor(norm(t.moonLongitude - t.sunLongitude) / 12); };
      const next = sunriseJulianDay(jdMid + 1, q.latitude, q.longitude);
      const atSix = s10(sunrise + 0.1);
      vijaya = monthAt(sunrise + 0.1) === 6 && (atSix === 9 || (s10(next) === 9 && s10(next + 0.1) !== 9) || (atSix === 8 && s10(next) === 10));
    }
    const x = {
      vijaya,
      star: nakIdx, tithi: tithiIdx + 1, month, sunSign: Math.floor(norm(sunLongitude) / 30), sunStar: Math.floor(norm(sunLongitude) / (360 / 27)) % 27,
      yoga: Math.floor(norm(moonLongitude + sunLongitude) / (360 / 27)) % 27, vishti: isVishti(Math.floor(elong / 6)), sankranti: false,
      // How far into its star the Moon is (a cruel star's first ghatis), the yoga's half, the fixed karanas, the Moon in Abhijit.
      starFrac: (norm(moonLongitude) % (360 / 27)) / (360 / 27), yogaHalf: Math.floor(norm(moonLongitude + sunLongitude) / (180 / 27)) % 54,
      karanaFixed: isSthiraKarana(Math.floor(elong / 6)), moonAbhijit: norm(moonLongitude) >= ABHIJIT[0] && norm(moonLongitude) < ABHIJIT[1],
    };
    // Vijayadashami (Kalyanraman's vidyarambha): nothing else is considered.
    const codes = vijayadashamiOf(reading, x) ? [] : withSecondary(reading, [...panchangaCodes(reading, x), ...varaCodes(reading, wd)]);
    const bad = rejects(codes);
    days.push({
      date, weekday, nakshatra: nak, tithi: `${paksha} ${tithi}`, month: EV.MONTH_TA[month],
      score: bad.length ? 30 : codes.length ? 70 : 90,
      rating: bad.length ? 'தவிர்க்க' : codes.length ? 'நல்லது' : 'உத்தமம்',
      codes, windows: goodGowri,
      // A book's secondary rule is its code with _MID: the base name, marked.
      notes: codes.map((c) => EV.CODE_TA[c] ?? (c.endsWith('_MID') && EV.CODE_TA[c.slice(0, -4)] ? `${EV.CODE_TA[c.slice(0, -4)]} (குறிக்கப்படும்)` : c)),
    });
  }

  days.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.date.localeCompare(b.date));
  return {
    available: true, purpose, purposeLabel: P.label, days,
    sourced: Boolean(R),
    ...(R
      ? {
        event, book, books: R.order.map((id) => ({ id, labelTa: R[id].labelTa, isDefault: id === R.default })),
        rankTa: EV.RANK[event].measureTa, source: EV.SOURCES[event][book],
        noteTa: event === 'UPANAYANA'
          ? 'சூரிய உதயத்தின் பஞ்சாங்கம் மட்டும் (மாதம், சௌர மாதம், நட்சத்திரம், திதி, அனத்யாயம், கலக்ரஹம், யோகம், விஷ்டி, கிழமை). குரு / சூரிய / சந்திர பலம், லக்னம், பகலின் பகுதி, பிரதோஷம், சங்கிராந்தி, வயது: /muhurta-stars பக்கம், "உபநயனம்" தேர்வுடன் — குழந்தையின் ஜாதகத்துடன்.'
          : event === 'MEDICINE' || event === 'SURGERY'
            ? `${event === 'MEDICINE' ? 'மருந்து / சிகிச்சை தொடக்கம்' : 'அறுவை சிகிச்சை'}: சூரிய உதயத்தின் பஞ்சாங்கம் மட்டும் (நட்சத்திரம், திதி, கிழமை${event === 'SURGERY' ? ', தேய்பிறை' : ''}; வசிஷ்டாவுக்கு விஷ்டி). ஜன்ம நட்சத்திரம், சந்திரன் ஜன்ம ராசியிலிருந்து, லக்னம், 6 / 7 / 8 / 12-ல் கிரகம், லக்னத்தில் சுபர்${event === 'SURGERY' ? ', செவ்வாய்–சனி' : ''}, தாரா / சந்திர பலம்: /muhurta-stars பக்கம், "${event === 'MEDICINE' ? 'மருந்து / சிகிச்சை' : 'அறுவை சிகிச்சை'}" தேர்வுடன் — நோயாளியின் ஜாதகத்துடன்.`
          : event === 'BUSINESS'
            ? 'கடை திறப்பு / வியாபாரம் தொடங்குதல்: சூரிய உதயத்தின் பஞ்சாங்கம் மட்டும் (நட்சத்திரம், திதி, கிழமை; வசிஷ்டாவுக்கு மாதம், சாதுர்மாஸ்யம், யோகம், விஷ்டி, ஹோலி). லக்னம் (கும்பம் தவிர), 8 / 12-ல் பாவர், லக்னத்தில் சந்திரன் / சுக்கிரன், சுபர் 2 / 10 / 11-ல், குரு / சுக்கிரன் அஸ்தங்கம், தாரா / சந்திர பலம்: /muhurta-stars பக்கம், "வியாபாரம்" தேர்வுடன்.'
          : event === 'EDUCATION'
            ? 'கல்வி தொடக்கம் (உபநயனத்துக்குப் பின்): சூரிய உதயத்தின் பஞ்சாங்கம் மட்டும் (நட்சத்திரம், திதி, அனத்யாயம், கலக்ரஹம், மாதம், கிழமை). லக்னம், நவாம்சம், 8 / 4-ஆம் வீடு, குரு / சுக்கிரன் அஸ்தங்கம், பகலின் பகுதி, பிரதோஷம், தாரா / சந்திர பலம்: /muhurta-stars பக்கம், "கல்வி தொடக்கம்" தேர்வுடன்.'
            : event === 'VIDYARAMBHA'
            ? 'வித்யாரம்பம் (அக்ஷராப்யாசம் — குழந்தையின் முதல் எழுத்துகள்): சூரிய உதயத்தின் பஞ்சாங்கம் மட்டும் (நட்சத்திரம், திதி, சௌர / சந்திர மாதம், யோகம், கரணம், கிழமை; விஜயதசமி). லக்னம், 8-ஆம் வீடு, புதன் / குரு / சுக்கிரன் அஸ்தங்கம், பகலின் பகுதி, தாரா / சந்திர பலம், வயது: /muhurta-stars பக்கம், "வித்யாரம்பம்" தேர்வுடன் — குழந்தையின் ஜாதகத்துடன்.'
            : event === 'TRAVEL'
              ? 'சூரிய உதயத்தின் பஞ்சாங்கம் மட்டும் (நட்சத்திரம், அதன் நாழிகை, திதி, சௌர / சந்திர மாதம், யோகம், விஷ்டி, கிழமை). திசை விதிகள் (சூலம், யோகினி, சந்திரன், சுக்கிரன், பரிகம், காலம்-பாசம், அயனம்), ராகு, காதம், தாரா / சந்திர பலம், லக்னம்: /muhurta-stars பக்கம், "பயணம்" தேர்வுடன், திசையுடன் — பயணம் செய்பவரின் ஜாதகத்துடன்.'
              : 'சூரிய உதயத்தின் பஞ்சாங்கம் மட்டும் (மாதம், நட்சத்திரம், திதி, கிழமை, கும்ப சக்கரம்). லக்னம், தாரா / சந்திர பலம், வாசல் திசை: /muhurta-stars பக்கம், "கிரகப்பிரவேசம்" தேர்வுடன்.',
      }
      : { missingTa: SOURCE_REQUIRED_TA, noteTa: purpose === 'marriage' ? 'திருமணத்தின் தசதோஷம், லத்தை, தாரா / சந்திர பலம், லக்ன சுத்தி நூல்களுடன்: /muhurta-stars பக்கம்.' : null }),
  };
}

module.exports = { searchMuhurta, PURPOSES, SOURCED, monthAt };
