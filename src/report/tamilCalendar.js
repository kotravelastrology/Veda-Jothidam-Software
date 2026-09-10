/**
 * தமிழ் நாட்காட்டி — the Tamil solar calendar + festival resolver.
 *
 *  • Tamil solar month  — the sidereal sign the Sun occupies (Meṣa = Chittirai
 *    = 0). Sūrya Siddhānta / Tamil sauramāna. The month turns on the Tamil
 *    sankrānti-before-sunset rule (if the Sun's new sign is present at that
 *    day's sunset the month starts that day, else the next).
 *  • Samvatsara      — the 60-year Jovian cycle (Prabhava … Akshaya), indexed
 *    from Prabhava = the Tamil solar year beginning Chittirai 1987 CE.
 *  • Ayana / Ṛtu     — Uttarāyaṇa/Dakṣiṇāyana from Makara/Karka sankrānti; six
 *    ṛtus of two solar months.
 *  • Festivals       — each rule states its classical definition (Tamil solar
 *    month + tithi and/or nakṣatra prevailing at a named kāla, or a sankrānti).
 *    Dates are COMPUTED from that rule against Kotravel's Swiss Ephemeris
 *    (dṛk-siddhānta); two entries flagged `reference` ship one named reckoning
 *    of a festival the traditions reckon differently, and carry no doctrinal
 *    citation. Ported from the prior AstrologicLab festivalResolver.ts +
 *    kalaEngine.ts, rewritten natively.
 */
const { julianDay } = require('@swisseph/node');
const { sunMoonLongitudes, sunriseJulianDay, sunsetJulianDay } = require('../ephemeris/siderealPositions');

const norm360 = (d) => ((d % 360) + 360) % 360;
const NAK_SPAN = 360 / 27;
const NAZHIKAI_JD = 1 / 60;          // 1 nāḻikai = 24 min = 1/60 day
const MIN_JD = 1 / 1440;

// Tamil solar months, 0 = Chittirai (Sun in Meṣa).
const TAMIL_MONTHS = [
  { ta: 'சித்திரை', en: 'Chittirai' }, { ta: 'வைகாசி', en: 'Vaikasi' },
  { ta: 'ஆனி', en: 'Aani' }, { ta: 'ஆடி', en: 'Aadi' },
  { ta: 'ஆவணி', en: 'Aavani' }, { ta: 'புரட்டாசி', en: 'Purattasi' },
  { ta: 'ஐப்பசி', en: 'Aippasi' }, { ta: 'கார்த்திகை', en: 'Karthigai' },
  { ta: 'மார்கழி', en: 'Margazhi' }, { ta: 'தை', en: 'Thai' },
  { ta: 'மாசி', en: 'Maasi' }, { ta: 'பங்குனி', en: 'Panguni' },
];

const SAMVATSARA = [
  'Prabhava', 'Vibhava', 'Shukla', 'Pramoduta', 'Prajapati', 'Angirasa', 'Srimukha', 'Bhava',
  'Yuva', 'Dhatri', 'Ishvara', 'Bahudhanya', 'Pramadi', 'Vikrama', 'Vishu', 'Chitrabhanu',
  'Svabhanu', 'Tarana', 'Parthiva', 'Vyaya', 'Sarvajit', 'Sarvadhari', 'Virodhi', 'Vikruti',
  'Khara', 'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukhi', 'Hevilambi', 'Vilambi',
  'Vikari', 'Sharvari', 'Plava', 'Shubhakrit', 'Shobhakrit', 'Krodhi', 'Vishvavasu', 'Parabhava',
  'Plavanga', 'Kilaka', 'Saumya', 'Sadharana', 'Virodhikruti', 'Paridhavi', 'Pramadicha', 'Ananda',
  'Rakshasa', 'Nala', 'Pingala', 'Kalayukti', 'Siddharthi', 'Raudra', 'Durmati', 'Dundubhi',
  'Rudhirodgari', 'Raktakshi', 'Krodhana', 'Akshaya',
];
const SAMVATSARA_TA = {
  Vishvavasu: 'விசுவாவசு', Parabhava: 'பரபாவ', Plavanga: 'பிலவங்க', Kilaka: 'கீலக',
  Prabhava: 'பிரபவ', Vibhava: 'விபவ', Shukla: 'சுக்ல', Krodhi: 'குரோதி',
};

const RITU = [
  { ta: 'வசந்த', en: 'Vasanta (spring)' },   // Chittirai–Vaikasi
  { ta: 'கிரீஷ்ம', en: 'Grishma (summer)' },  // Aani–Aadi
  { ta: 'வர்ஷ', en: 'Varsha (monsoon)' },     // Aavani–Purattasi
  { ta: 'சரத்', en: 'Sharad (autumn)' },       // Aippasi–Karthigai
  { ta: 'ஹேமந்த', en: 'Hemanta (pre-winter)' }, // Margazhi–Thai
  { ta: 'சிசிர', en: 'Shishira (winter)' },     // Maasi–Panguni
];

const TITHI_TA = [
  'பிரதமை', 'துவிதியை', 'திருதியை', 'சதுர்த்தி', 'பஞ்சமி', 'சஷ்டி', 'சப்தமி', 'அஷ்டமி',
  'நவமி', 'தசமி', 'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்த்தசி', 'பௌர்ணமி',
];
const NAKSHATRA_TA = [
  'அசுவினி', 'பரணி', 'கிருத்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 'புனர்பூசம்',
  'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்', 'ஹஸ்தம்', 'சித்திரை', 'சுவாதி',
  'விசாகம்', 'அனுஷம்', 'கேட்டை', 'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்',
  'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
];
const VAARA_TA = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];

// ── kāla reference instants of a solar day (KL-005; midpoints) ────────────
function kalaReferenceJd(kala, sunriseJd, sunsetJd, nextSunriseJd) {
  const dayLen = sunsetJd - sunriseJd;
  const nightLen = nextSunriseJd - sunsetJd;
  switch (kala) {
    case 'arunodaya': return sunriseJd - 2 * NAZHIKAI_JD;            // mid of [sunrise-4nazhikai, sunrise]
    case 'brahma-muhurta': return sunriseJd - 72 * MIN_JD;
    case 'purvahna': return sunriseJd + dayLen * 0.2;               // first two fifths
    case 'madhyahna': return sunriseJd + dayLen * 0.5;
    case 'aparahna': return sunriseJd + dayLen * 0.7;
    case 'pradosha': return sunsetJd + 1 * NAZHIKAI_JD;             // mid of [sunset-1, sunset+3] nazhikai
    case 'nishita': return sunsetJd + nightLen / 2;                 // solar midnight
    default: return sunriseJd;
  }
}
const KALA_TA = {
  arunodaya: 'அருணோதயம்', 'brahma-muhurta': 'பிரம்ம முகூர்த்தம்', purvahna: 'பூர்வாஹ்னம்',
  madhyahna: 'மத்யாஹ்னம்', aparahna: 'அபராஹ்னம்', pradosha: 'பிரதோஷம்', nishita: 'நிசீதம்',
};

/** Pañcāṅga limbs at a Julian-Day instant. Elongation → tithi is
 *  ayanāṁśa-independent; nakṣatra / sign use the given ayanāṁśa. */
function panchangaAtJd(jd, ayanamsha) {
  const { sunLongitude, moonLongitude } = sunMoonLongitudes(jd, ayanamsha);
  const elong = norm360(moonLongitude - sunLongitude);
  return {
    tithiIndex: Math.floor(elong / 12) % 30,        // 0 = Śukla Prathamā, 29 = Amāvāsai
    nakshatraIndex: Math.floor(norm360(moonLongitude) / NAK_SPAN) % 27,
    sunSign: Math.floor(norm360(sunLongitude) / 30) % 12,
    moonSign: Math.floor(norm360(moonLongitude) / 30) % 12,
  };
}

// ── Festival rules (ported from AstrologicLab festivalResolver FESTIVAL_RULES) ──
// tithiIndex: Śukla Chaturthī=3, Ṣaṣṭhī=5, Aṣṭamī=7, Navamī=8, Daśamī=9,
// Ekādaśī=10, Trayodaśī=12, Chaturdaśī=13, Pūrṇimā=14, Amāvāsai=29, Kṛṣṇa Chaturdaśī=28.
const FESTIVAL_RULES = [
  { key: 'thai-pongal', ta: 'தைப் பொங்கல்', en: 'Thai Pongal', kind: 'sankranti', month: 9, note: 'Makara Sankrānti', source: 'Tamil sauramāna — Makara sankrānti' },
  { key: 'puthandu', ta: 'தமிழ்ப் புத்தாண்டு', en: 'Tamil New Year', kind: 'sankranti', month: 0, note: 'Meṣa Sankrānti', source: 'Tamil sauramāna — Meṣa sankrānti' },
  { key: 'thaipusam', ta: 'தைப்பூசம்', en: 'Thaipusam', kind: 'tithi-at-kala', month: 9, tithiIndex: 14, kala: 'purvahna', nakshatraIndex: 7, note: 'Thai Pūrṇimā + Pūṣya', source: 'Thai + Pūrṇimā/Pūṣya at Pūrvāhna' },
  { key: 'maha-shivaratri', ta: 'மகா சிவராத்திரி', en: 'Mahā Śivarātri', kind: 'tithi-at-kala', month: 10, tithiIndex: 28, kala: 'nishita', note: 'Māsi Kṛṣṇa Chaturdaśī at Niśīta', source: 'Nirṇaya Sindhu — Kṛṣṇa Chaturdaśī pervading niśīta' },
  { key: 'maasi-magam', ta: 'மாசி மகம்', en: 'Maasi Magam', kind: 'tithi-at-kala', month: 10, kala: 'purvahna', nakshatraIndex: 9, note: 'Māsi + Magha nakṣatra', source: 'Māsi + Maghā nakṣatra (Pūrṇimā-adjacent)' },
  { key: 'panguni-uthiram', ta: 'பங்குனி உத்திரம்', en: 'Panguni Uthiram', kind: 'tithi-at-kala', month: 11, tithiIndex: 14, kala: 'purvahna', nakshatraIndex: 11, note: 'Panguni Pūrṇimā + Uttara-Phalgunī', source: 'Panguni + Pūrṇimā/Uttara-Phalgunī' },
  { key: 'vinayagar-chaturthi', ta: 'விநாயகர் சதுர்த்தி', en: 'Vinayagar Chaturthi', kind: 'tithi-at-kala', month: 4, tithiIndex: 3, kala: 'madhyahna', note: 'Āvaṇi Śukla Chaturthī at Madhyāhna', source: 'Dharmasindhu — Chaturthī pervading madhyāhna' },
  { key: 'deepavali', ta: 'தீபாவளி', en: 'Deepavali', kind: 'tithi-at-kala', month: 6, tithiIndex: 28, kala: 'arunodaya', note: 'Aippasi Kṛṣṇa Chaturdaśī at Aruṇodaya', source: 'Nirṇaya Sindhu — Kṛṣṇa Chaturdaśī at aruṇodaya (Naraka-caturdaśī)' },
  { key: 'vaikunta-ekadashi', ta: 'வைகுண்ட ஏகாதசி', en: 'Vaikuṇṭha Ekādaśī', kind: 'tithi-at-kala', month: 8, tithiIndex: 10, kala: 'arunodaya', note: 'Mārgaḻi Śukla Ekādaśī (sunrise-prevailing)', source: 'Mārgaḻi Śukla Ekādaśī, sunrise-prevailing' },
  { key: 'vaikasi-visakam', ta: 'வைகாசி விசாகம்', en: 'Vaikāsi Viśākam', kind: 'tithi-at-kala', month: 1, kala: 'purvahna', nakshatraIndex: 15, note: 'Vaikāsi + Viśākha nakṣatra', source: 'Vaikāsi + Viśākhā nakṣatra' },
  { key: 'aadi-amavasai', ta: 'ஆடி அமாவாசை', en: 'Āḍi Amāvāsai', kind: 'tithi-at-kala', month: 3, tithiIndex: 29, kala: 'aparahna', note: 'Āḍi Amāvāsai at Aparāhna', source: 'Āḍi Amāvāsai at aparāhna (tarpaṇa)' },
  { key: 'vijayadasami', ta: 'விஜயதசமி', en: 'Vijayadaśamī', kind: 'tithi-at-kala', month: 6, tithiIndex: 9, kala: 'aparahna', note: 'Śukla Daśamī at Aparāhna (falls in Aippasi solar month)', source: 'Śukla Daśamī pervading aparāhna' },
  { key: 'karthigai-deepam', ta: 'கார்த்திகை தீபம்', en: 'Kārttikai Deepam', kind: 'tithi-at-kala', month: 7, kala: 'pradosha', nakshatraIndex: 2, note: 'Kārttikai Pūrṇimā + Kṛttikā at Pradoṣa', source: 'Kārttikai + Kṛttikā at pradoṣa' },
  { key: 'akshaya-tritiya', ta: 'அட்சய திருதியை', en: 'Akṣaya Tṛtīyā', kind: 'tithi-at-kala', month: 0, tithiIndex: 2, kala: 'arunodaya', note: 'Chittirai Śukla Tṛtīyā, Aruṇodaya-prevailing', source: 'Śukla Tṛtīyā, aruṇodaya-prevailing' },
  { key: 'chitra-pournami', ta: 'சித்திரா பௌர்ணமி', en: 'Chitra Pournami', kind: 'tithi-at-kala', month: 0, tithiIndex: 14, kala: 'purvahna', note: 'Chittirai Pūrṇimā at Pūrvāhna', source: 'Chittirai + Pūrṇimā' },
  { key: 'narasimha-jayanti', ta: 'நரசிம்ம ஜயந்தி', en: 'Narasiṁha Jayanti', kind: 'tithi-at-kala', month: 0, tithiIndex: 13, kala: 'pradosha', note: 'Chittirai Śukla Chaturdaśī at Sāyaṁkāla', source: 'Śukla Chaturdaśī pervading sāyaṁkāla/pradoṣa' },
  { key: 'mahalaya-amavasai', ta: 'மகாளய அமாவாசை', en: 'Mahālaya Amāvāsai', kind: 'tithi-at-kala', month: 5, tithiIndex: 29, kala: 'aparahna', note: 'Puraṭṭāsi Amāvāsai at Aparāhna (Pitṛ-pakṣa end)', source: 'Amāvāsai pervading aparāhna (Pitṛ-pakṣa)' },
  { key: 'arudra-darshan', ta: 'ஆருத்ரா தரிசனம்', en: 'Ārudrā Darśanam', kind: 'tithi-at-kala', month: 8, nakshatraIndex: 5, kala: 'purvahna', note: 'Mārgaḻi + Tiruvādirai (Ārdrā), first Dhanur occurrence', source: 'Mārgaḻi + Ārdrā nakṣatra' },
  { key: 'aadi-pooram', ta: 'ஆடிப்பூரம்', en: 'Aadi Pūram', kind: 'tithi-at-kala', month: 3, nakshatraIndex: 10, kala: 'purvahna', occurrence: 'last', reference: true, note: 'Reference: Āḍi + Pūram (Pūrva-Phalgunī), last occurrence in Āḍi (Srivilliputhur Āṇḍāḷ Jayanti)' },
  { key: 'sri-jayanti', ta: 'ஸ்ரீ ஜயந்தி', en: 'Sri Jayanti', kind: 'nakshatra-nishita-vyapti', month: 4, nakshatraIndex: 3, reference: true, note: 'Reference (Vaiṣṇava niśīta-Rohiṇī): Āvaṇi, Rohiṇī pervading niśīta. Other reckonings differ.' },
];

const jdNoonUt = (y, m, d) => julianDay(y, m, d, 12);
const iso = (y, m1, d) => `${y}-${String(m1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const daysInMonth = (y, m1) => new Date(Date.UTC(y, m1, 0)).getUTCDate();

/** Per-day solar-day frame (all Julian Days). */
function solarFrame(y, m1, d, lat, lon) {
  const jn = jdNoonUt(y, m1, d);
  const sunrise = sunriseJulianDay(jn - 0.5, lat, lon);
  const sunset = sunsetJulianDay(sunrise, lat, lon);
  const nextSunrise = sunriseJulianDay(jn + 0.5, lat, lon);
  return { sunrise, sunset, nextSunrise };
}

/**
 * Resolve every festival for a Gregorian year in one calendar sweep.
 * @returns [{ dateStr, rule }] sorted by date.
 */
function resolveAllFestivals(gYear, lat, lon, ayanamsha = 'Lahiri') {
  const found = {};       // key -> { first, last }
  // seed prev-day sunset sign from Dec 31 of the previous year
  const seed = solarFrame(gYear - 1, 12, 31, lat, lon);
  let prevSunsetSign = panchangaAtJd(seed.sunset, ayanamsha).sunSign;

  for (let m1 = 1; m1 <= 12; m1 += 1) {
    const dim = daysInMonth(gYear, m1);
    for (let d = 1; d <= dim; d += 1) {
      const f = solarFrame(gYear, m1, d, lat, lon);
      const sunsetP = panchangaAtJd(f.sunset, ayanamsha);
      const sunriseP = panchangaAtJd(f.sunrise, ayanamsha);
      const dateStr = iso(gYear, m1, d);

      for (const rule of FESTIVAL_RULES) {
        if (found[rule.key] && rule.occurrence !== 'last') continue;

        if (rule.kind === 'sankranti') {
          if (sunsetP.sunSign === rule.month && prevSunsetSign !== rule.month) {
            found[rule.key] = found[rule.key] || dateStr;
          }
          continue;
        }
        // month must be present at sunrise OR sunset of this day
        if (sunriseP.sunSign !== rule.month && sunsetP.sunSign !== rule.month) continue;

        let match = false;
        if (rule.kind === 'nakshatra-nishita-vyapti') {
          const muh = (f.nextSunrise - f.sunset) / 15;
          const start = f.sunset + 7 * muh;
          const end = f.sunset + 8 * muh;
          for (let k = 0; k <= 6 && !match; k += 1) {
            if (panchangaAtJd(start + ((end - start) * k) / 6, ayanamsha).nakshatraIndex === rule.nakshatraIndex) match = true;
          }
        } else {
          const p = panchangaAtJd(kalaReferenceJd(rule.kala, f.sunrise, f.sunset, f.nextSunrise), ayanamsha);
          const tithiOk = rule.tithiIndex == null || p.tithiIndex === rule.tithiIndex;
          const nakOk = rule.nakshatraIndex == null || p.nakshatraIndex === rule.nakshatraIndex;
          match = tithiOk && nakOk;
        }
        if (match) {
          if (rule.occurrence === 'last') found[rule.key] = dateStr;   // keep the latest
          else found[rule.key] = found[rule.key] || dateStr;           // first
        }
      }
      prevSunsetSign = sunsetP.sunSign;
    }
  }

  return FESTIVAL_RULES
    .filter((r) => found[r.key])
    .map((r) => ({ dateStr: found[r.key], rule: r }))
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr));
}

/** The Tamil solar year (Samvatsara) whose Chittirai contains this Gregorian date. */
function samvatsaraFor(gYear, sunSignAtDate, gMonth) {
  // Tamil year turns at Meṣa sankrānti (~Apr 14). Before mid-April the running
  // Tamil year began the previous Gregorian year.
  const startYear = gMonth <= 3 ? gYear - 1 : gYear;
  const idx = ((startYear - 1987) % 60 + 60) % 60;
  return { name: SAMVATSARA[idx], ta: SAMVATSARA_TA[SAMVATSARA[idx]] || SAMVATSARA[idx], startYear, index: idx };
}

/** Full Tamil-calendar panel for an instant. `dateMs` = epoch ms. */
function tamilDate(dateMs, lat, lon, ayanamsha = 'Lahiri') {
  const dt = new Date(dateMs);
  const y = dt.getUTCFullYear();
  const m1 = dt.getUTCMonth() + 1;
  const d = dt.getUTCDate();
  const f = solarFrame(y, m1, d, lat, lon);
  const atSunrise = panchangaAtJd(f.sunrise, ayanamsha);
  const jd = jdNoonUt(y, m1, d);
  const weekday = ((Math.floor(jd + 0.5) % 7) + 7 + 1) % 7;  // JD 0 = Monday → +1 to make Sun=0
  const monthIdx = atSunrise.sunSign;
  const paksha = atSunrise.tithiIndex < 15 ? { ta: 'சுக்ல பக்ஷம்', en: 'Shukla' } : { ta: 'கிருஷ்ண பக்ஷம்', en: 'Krishna' };
  const tithiInPaksha = atSunrise.tithiIndex % 15;
  const tithiName = atSunrise.tithiIndex === 29 ? 'அமாவாசை' : atSunrise.tithiIndex === 14 ? 'பௌர்ணமி' : TITHI_TA[tithiInPaksha];

  return {
    gregorian: iso(y, m1, d),
    samvatsara: samvatsaraFor(y, monthIdx, m1),
    ayana: monthIdx >= 9 || monthIdx <= 2 ? { ta: 'உத்தராயணம்', en: 'Uttarāyaṇa' } : { ta: 'தட்சிணாயனம்', en: 'Dakṣiṇāyana' },
    ritu: RITU[Math.floor(monthIdx / 2)],
    month: { index: monthIdx, ...TAMIL_MONTHS[monthIdx] },
    paksha,
    tithi: { index: atSunrise.tithiIndex, name: tithiName },
    nakshatra: { index: atSunrise.nakshatraIndex, name: NAKSHATRA_TA[atSunrise.nakshatraIndex] },
    vaara: { index: weekday, name: VAARA_TA[weekday] },
    moonSign: atSunrise.moonSign,
  };
}

/**
 * @param q { year, latitude, longitude, ayanamsha?, todayMs? }
 * @returns { year, place, today, festivals:[{date, key, ta, en, note, source, reference}] }
 */
function buildTamilCalendar(q) {
  const ayan = q.ayanamsha || 'Lahiri';
  const lat = q.latitude;
  const lon = q.longitude;
  const festivals = resolveAllFestivals(q.year, lat, lon, ayan).map(({ dateStr, rule }) => ({
    date: dateStr,
    weekday: VAARA_TA[new Date(`${dateStr}T12:00:00Z`).getUTCDay()],
    key: rule.key,
    ta: rule.ta,
    en: rule.en,
    kala: rule.kala ? KALA_TA[rule.kala] : null,
    note: rule.note,
    source: rule.source || null,
    reference: !!rule.reference,
  }));
  return {
    available: true,
    year: q.year,
    place: { latitude: lat, longitude: lon },
    today: tamilDate(q.todayMs || Date.now(), lat, lon, ayan),
    festivals,
  };
}

module.exports = {
  buildTamilCalendar, resolveAllFestivals, tamilDate, panchangaAtJd, kalaReferenceJd,
  FESTIVAL_RULES, TAMIL_MONTHS, SAMVATSARA,
};
