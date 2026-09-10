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
 * Tables: classical muhurta convention (Muhurta Chintamani / B. V. Raman
 * "Muhurtha") — the favourable nakshatras/tithis/weekdays each activity is
 * commonly assigned. General guidance; a full election also weighs Tara/
 * Chandra bala and lagna purification, not modelled here.
 */
const { julianDay } = require('@swisseph/node');
const { sunriseJulianDay, sunMoonLongitudes, siderealAscendant } = require('../ephemeris/siderealPositions');
const { calculateDailyMuhurta } = require('./dailyMuhurta');

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

const PURPOSES = {
  marriage: {
    label: 'திருமணம்',
    goodNak: ['Rohini', 'Mrigashira', 'Magha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Mula', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    avoidNak: ['Bharani', 'Krittika', 'Ashlesha', 'Vishakha', 'Jyeshtha'],
    avoidTithi: ['Chaturthi', 'Shashthi', 'Ashtami', 'Navami', 'Dwadashi', 'Chaturdashi', 'Amavasya'],
    goodWeekday: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
  },
  business: {
    label: 'வியாபாரம் தொடங்குதல்',
    goodNak: ['Ashwini', 'Pushya', 'Punarvasu', 'Hasta', 'Chitra', 'Anuradha', 'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Shravana', 'Dhanishtha', 'Revati'],
    avoidNak: ['Bharani', 'Ashlesha', 'Magha', 'Mula', 'Jyeshtha'],
    avoidTithi: ['Chaturthi', 'Navami', 'Chaturdashi', 'Amavasya', 'Purnima'],
    goodWeekday: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
  },
  travel: {
    label: 'பயணம்',
    goodNak: ['Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Anuradha', 'Shravana', 'Dhanishtha', 'Revati'],
    avoidNak: ['Krittika', 'Ashlesha', 'Magha', 'Vishakha', 'Jyeshtha', 'Mula'],
    avoidTithi: ['Chaturthi', 'Navami', 'Chaturdashi', 'Amavasya'],
    goodWeekday: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
  },
  griha: {
    label: 'கிரகப்பிரவேசம்',
    goodNak: ['Rohini', 'Mrigashira', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Dhanishtha', 'Shatabhisha', 'Revati'],
    avoidNak: ['Bharani', 'Krittika', 'Ashlesha', 'Magha', 'Mula', 'Jyeshtha'],
    avoidTithi: ['Chaturthi', 'Navami', 'Chaturdashi', 'Amavasya', 'Purnima'],
    goodWeekday: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
  },
  education: {
    label: 'வித்யாரம்பம் / கல்வி',
    goodNak: ['Ashwini', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Shravana', 'Revati'],
    avoidNak: ['Bharani', 'Krittika', 'Ashlesha', 'Magha', 'Mula'],
    avoidTithi: ['Chaturthi', 'Shashthi', 'Ashtami', 'Navami', 'Chaturdashi', 'Amavasya'],
    goodWeekday: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
  },
  medical: {
    label: 'மருத்துவம் / அறுவை',
    goodNak: ['Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Anuradha', 'Revati'],
    avoidNak: ['Bharani', 'Krittika', 'Ashlesha', 'Magha', 'Vishakha', 'Jyeshtha', 'Mula', 'Purva Bhadrapada'],
    avoidTithi: ['Chaturthi', 'Shashthi', 'Ashtami', 'Navami', 'Chaturdashi', 'Amavasya', 'Purnima'],
    goodWeekday: ['Sunday', 'Tuesday'],
  },
};

const norm = (d) => ((d % 360) + 360) % 360;

/** @param q { startDate, endDate 'YYYY-MM-DD', purpose, latitude, longitude, utcOffsetMinutes } */
function searchMuhurta(q) {
  const purpose = PURPOSES[q.purpose] ? q.purpose : 'marriage';
  const P = PURPOSES[purpose];
  const off = q.utcOffsetMinutes || 0;

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

    // ── score ──
    let score = 50;
    const notes = [];
    if (P.goodNak.includes(nak)) { score += 25; notes.push(`${nak} சாதக நட்சத்திரம்`); }
    if (P.avoidNak.includes(nak)) { score -= 35; notes.push(`${nak} தவிர்க்கும் நட்சத்திரம்`); }
    if (P.avoidTithi.includes(tithi)) { score -= 25; notes.push(`${tithi} தவிர்க்கும் திதி`); }
    if (P.goodWeekday.includes(weekday)) { score += 10; }
    if (dm.panchaka.active && dm.panchaka.type && dm.panchaka.type.severity === 'bad') { score -= 20; notes.push(dm.panchaka.type.name); }
    if (dm.panchakaRahitam.ok) { score += 12; notes.push(dm.panchakaRahitam.ta); } else { score -= 15; notes.push(dm.panchakaRahitam.ta); }
    score = Math.max(0, Math.min(100, score));

    const goodGowri = dm.gowri.day.filter((g) => g.auspicious).map((g) => ({ from: g.from, to: g.to, gowri: g.nameTa }));

    days.push({
      date: `${Y}-${String(M).padStart(2, '0')}-${String(D).padStart(2, '0')}`,
      weekday,
      nakshatra: nak,
      tithi: `${paksha} ${tithi}`,
      score: Math.round(score),
      rating: score >= 80 ? 'உத்தமம்' : score >= 62 ? 'நல்லது' : score >= 45 ? 'சாதாரணம்' : 'தவிர்க்க',
      windows: goodGowri,
      notes,
    });
  }

  days.sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));
  return { available: true, purpose, purposeLabel: P.label, days };
}

module.exports = { searchMuhurta, PURPOSES };
