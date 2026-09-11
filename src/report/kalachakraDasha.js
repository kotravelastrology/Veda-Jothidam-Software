/**
 * காலச்சக்கர தசை (Kalachakra Dasha) — the rāśi-based (not graha-based) dasha
 * keyed to nakṣatra pādas, ported from the actual classical source text:
 *
 *   காலச்சக்கரம் (தெளிவான உரையுடன்) — தில்லைநாயகப் புலவர் இயற்றியது,
 *   பதிப்பாசிரியர் வித்துவான் அடிகளாசிரியர், தஞ்சாவூர் சரசுவதி மகால் நூலகம்
 *   வெளியீடு எண். 125, 7th edn. 2007. Digitised: Tamil Digital Library /
 *   Internet Archive (TVA_BOK_0008536). Local copy:
 *   D:\AstrologicLab\sources\owner-curated-reference-library\
 *   kalachakram-thillainayaka-pulavar\raw-scans\{full-scan.pdf, fulltext.txt}.
 *   Citations below are to the editor's முன்னுரை (Introduction), pages 1-13,
 *   which states the method in plain prose (not the poetic verse chapters).
 *
 * WHAT IS IMPLEMENTED (visually/textually verified against the above):
 *  - Savya (வலவோட்டு) / Apasavya (இடவோட்டு) classification of the 27
 *    nakṣatras, in 9 repeating groups of 3 (p.2-3).
 *  - Muthal/Idai/Kadai (first/middle/last) role of a nakṣatra within its
 *    group of 3, and the 108-pāda → starting Mahā-daśā rāśi table built from
 *    it (p.3-4): each Savya group independently spans Meṣa→Mīna forward in
 *    three 4-pāda blocks; each Apasavya group spans Vṛścika→Dhanus backward.
 *  - Mahā-daśā rāśi years — Mangala(Meṣa,Vṛścika)=7, Śukra(Vṛṣabha,Tulā)=16,
 *    Budha(Mithuna,Kanyā)=9, Candra(Karka)=21, Sūrya(Siṃha)=5,
 *    Guru(Dhanus,Mīna)=10, Śani(Makara,Kumbha)=4 (p.4). Rāhu/Ketu take no
 *    part — rāśi lords only (p.4).
 *  - The Mahā-daśā SEQUENCE: a single savya/apasavya pass through the 12
 *    rāśis from the birth pāda's starting rāśi (p.4) — no leap at this
 *    level; leaps occur only inside a Mahā's own Bhukti walk (below).
 *  - The Bhukti (sub-period) walk inside each Mahā-daśā — DIRECTLY
 *    transcribed for the 8 savya Mahās Meṣa through Vṛścika (p.7-10,
 *    "முதலாவது" .. "எட்டாவது"), including every named gati (leap): Nadi
 *    (ஆற்றுநீர்க்கதி, normal flow), Thavalai/Mandūka (தவளைக்கதி, frog-leap),
 *    Pāmbu/Sarpa (பாம்புக்கதி, snake-roll) and Siṃhāvalokana
 *    (சிங்காவலோகனகதி, lion's-glance) — cross-verified twice (the worked
 *    Vṛścika example on p.11-12 reproduces the same 9-rāśi walk given on
 *    p.9-10). The source states explicitly (p.10-11) that Dhanus/Makara/
 *    Kumbha/Mīna's Bhukti walks follow "the SAME method" as Meṣa/Vṛṣabha/
 *    Mithuna/Karka respectively — implemented here as the identical
 *    relative walk re-rooted (rotated) at each, per that statement — and
 *    that every Apasavya Mahā's Bhukti walk is the exact REVERSE of its
 *    Savya counterpart (p.11-12) — implemented as a literal array reversal.
 *  - Deha (உடல்) rāśi = the FIRST Bhukti's rāśi; Jīva (உயிர்) rāśi = the
 *    LAST (9th) Bhukti's rāśi (p.11-12, explicit definition + worked
 *    example) — these swap between Savya and Apasavya for the same Mahā
 *    rāśi, which falls out automatically from the reversal.
 *  - Bhukti YEARS — the Paramāyuṣ (பரமாயுள்) formula (p.12-13):
 *    bhukti_years = mahā_years × bhukti_rāśi_years / paramāyuṣ, where
 *    paramāyuṣ is 100 for a Meṣa/Siṃha/Dhanus Mahā, 85 for Vṛṣabha/Kanyā/
 *    Makara, 83 for Mithuna/Tulā/Kumbha, 86 for Karka/Vṛścika/Mīna
 *    (the four trine groups) — NOT a uniform divisor.
 *
 * DISCLOSED SIMPLIFICATION: the Bhukti walks for Mahās 9-12 (Dhanus,
 * Makara, Kumbha, Mīna) are DERIVED by rotation per the source's own stated
 * rule above, not independently transcribed page-by-page; likewise every
 * Apasavya Mahā's walk is derived by reversal per the source's own stated
 * rule, not independently transcribed. Antardaśā (3rd level) is not
 * computed. The source additionally names three more gati types (Kukkuṭa,
 * Mayūra, Duraga) used elsewhere in its verse chapters (index, p.119-120)
 * that this port's transcribed range (Mahās 1-8) does not encounter, so
 * they are not implemented.
 */
const norm360 = (d) => ((d % 360) + 360) % 360;
const MS_PER_YEAR = 365.25 * 86400000;

const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const RASI_EN = ['Mesha', 'Vrishabha', 'Mithuna', 'Kataka', 'Simha', 'Kanni', 'Thula', 'Vrischika', 'Dhanusu', 'Makara', 'Kumbha', 'Meena'];
const RASI_LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const RASI_LORD_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி' };
/** Mahā-daśā years per rāśi (p.4). */
const RASI_YEARS = [7, 16, 9, 21, 5, 9, 16, 7, 10, 4, 4, 10];
/** Paramāyuṣ divisor by trine group (rasi0 % 4): fire=100, earth=85, air=83, water=86 (p.12). */
const PARAMAYUSH_BY_TRINE = [100, 85, 83, 86];

// ── 27-nakshatra Savya/Apasavya + Muthal/Idai/Kadai classification (p.2-3) ──
const NAKSHATRA_TA = [
  'அசுவினி', 'பரணி', 'கிருத்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 'புனர்பூசம்',
  'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்', 'ஹஸ்தம்', 'சித்திரை', 'சுவாதி',
  'விசாகம்', 'அனுஷம்', 'கேட்டை', 'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்',
  'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
];
const ROLE_TA = { muthal: 'முதல்', idai: 'இடை', kadai: 'கடை' };
function nakshatraRole(nak0) {
  const group = Math.floor(nak0 / 3);       // 0-8, nine groups of 3
  const savya = group % 2 === 0;            // groups 0,2,4,6,8 = valavodu(savya); 1,3,5,7 = idavodu(apasavya)
  const position = nak0 % 3;                // 0 muthal, 1 idai, 2 kadai
  const role = position === 0 ? 'muthal' : position === 1 ? 'idai' : 'kadai';
  return { savya, role };
}

/** The 4-pada starting-rāśi block for each of the 6 (savya|apasavya × role) combinations (p.3-4). */
const PADA_START_RASI = {
  savya: { muthal: [0, 1, 2, 3], idai: [4, 5, 6, 7], kadai: [8, 9, 10, 11] },
  apasavya: { muthal: [7, 6, 5, 4], idai: [3, 2, 1, 0], kadai: [11, 10, 9, 8] },
};

// ── Bhukti walk, transcribed for the 8 savya Mahās Meṣa..Vṛścika (p.7-10) ──
// Each is a length-9 array of rāśi indices (0=Meṣa..11=Mīna) — the walk of
// that Mahā's own 9 Bhuktis, including every gati (leap) exactly as narrated.
const TRANSCRIBED_SAVYA_BHUKTI = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],       // 1 Meṣa-Mars (p.7): straight run, no gati
  [9, 10, 11, 7, 6, 5, 3, 4, 2],     // 2 Vṛṣabha-Venus (p.7-8): 4 gati (Siṃhāvalokana, Mandūka, Pāmbu, leap)
  [1, 0, 11, 10, 9, 8, 0, 1, 2],     // 3 Mithuna-Mercury (p.8): 1 gati (Dhanus→Meṣa, Siṃhāvalokana)
  [3, 4, 5, 6, 7, 8, 9, 10, 11],     // 4 Karka-Moon (p.8): straight run, no gati
  [7, 6, 5, 3, 4, 2, 1, 0, 11],      // 5 Siṃha-Sun (p.8-9): Mandūka + Pāmbu + Siṃhāvalokana leaps
  [10, 9, 8, 0, 1, 2, 3, 4, 5],      // 6 Kanyā-Mercury (p.9): 1 gati (Dhanus→Meṣa, Siṃhāvalokana)
  [6, 7, 8, 9, 10, 11, 7, 6, 5],     // 7 Tulā-Venus (p.9): 1 gati (Mīna→Vṛścika, Siṃhāvalokana)
  [3, 4, 2, 1, 0, 11, 10, 9, 8],     // 8 Vṛścika-Mars (p.9-10, cross-verified p.11-12): Pāmbu + Mandūka + Siṃhāvalokana
];

/**
 * All 12 savya Bhukti walks: 0-7 transcribed; 8-11 (Dhanus,Makara,Kumbha,
 * Mīna) REUSE the SAME literal rāśi-list as Meṣa/Vṛṣabha/Mithuna/Karka
 * respectively — per the source's own stated rule (p.10-11: "Meṣa's method
 * belongs to Dhanus too", "Vṛṣabha's to Makara", "Mithuna's to Kumbha",
 * "Karka's to Mīna"), taken literally, NOT rotated. This is the only
 * reading that keeps the Paramāyuṣ identity (p.12-13) exact: each trine
 * partner's own Paramāyuṣ equals Σ(rāśi-years) over its Bhukti walk, and a
 * literal reuse preserves that sum (a rotation does not — verified for all
 * four pairs: Dhanus/Meṣa both sum to 100, Makara/Vṛṣabha to 85, Kumbha/
 * Mithuna to 83, Mīna/Karka to 86 — the four trine Paramāyuṣ values). This
 * also matches the source's description of ONE continuous 108-step walk
 * across the whole daśā (Mahā 8 ends exactly where Mahā 9 must begin via
 * the same named Dhanus→Meṣa Siṃhāvalokana leap used mid-Mahā at p.8-9). */
const SAVYA_BHUKTI = (() => {
  const out = TRANSCRIBED_SAVYA_BHUKTI.slice(0, 8).map((seq) => seq.slice());
  const reusePairs = [[0, 8], [1, 9], [2, 10], [3, 11]]; // [source rasi, target rasi]
  for (const [from, to] of reusePairs) out[to] = TRANSCRIBED_SAVYA_BHUKTI[from].slice();
  return out;
})();

/** Every Apasavya Mahā's Bhukti walk = the exact reverse of its Savya
 *  counterpart, for the SAME rāśi (p.11-12, explicit general statement +
 *  worked example). Deha/Jīva swap falls out of this automatically. */
const APASAVYA_BHUKTI = SAVYA_BHUKTI.map((seq) => seq.slice().reverse());

function bhuktiWalk(rasi0, savya) {
  return (savya ? SAVYA_BHUKTI : APASAVYA_BHUKTI)[rasi0];
}

const norm27 = (n) => ((n % 27) + 27) % 27;
const NAK_SPAN = 360 / 27;

/** Moon sidereal longitude -> { nakshatraIndex (0-26), pada (1-4) }. */
function nakshatraPada(moonLongitude) {
  const pos = norm360(moonLongitude);
  const nakshatraIndex = Math.floor(pos / NAK_SPAN) % 27;
  const pada = Math.floor((pos % NAK_SPAN) / (NAK_SPAN / 4)) + 1;
  return { nakshatraIndex, pada };
}

function fmtDate(ms) { return new Date(ms).toISOString().slice(0, 10); }

/**
 * @param opts.moonLongitude  natal Moon sidereal longitude (0-359)
 * @param opts.birthMs        epoch ms of birth
 */
function calculateKalachakraDasha(opts) {
  const { nakshatraIndex, pada } = nakshatraPada(opts.moonLongitude);
  const { savya, role } = nakshatraRole(nakshatraIndex);
  const startRasi = PADA_START_RASI[savya ? 'savya' : 'apasavya'][role][pada - 1];
  const step = savya ? 1 : -1;

  let cursor = opts.birthMs;
  const mahas = [];
  for (let i = 0; i < 12; i += 1) {
    const rasi0 = ((startRasi + i * step) % 12 + 12) % 12;
    const mahaYears = RASI_YEARS[rasi0];
    const mahaStart = cursor;
    const mahaEnd = cursor + mahaYears * MS_PER_YEAR;

    const walk = bhuktiWalk(rasi0, savya);
    const paramayush = PARAMAYUSH_BY_TRINE[rasi0 % 4];
    let bhuktiCursor = mahaStart;
    const bhuktis = walk.map((bRasi0) => {
      const years = (mahaYears * RASI_YEARS[bRasi0]) / paramayush;
      const startMs = bhuktiCursor;
      const endMs = startMs + years * MS_PER_YEAR;
      bhuktiCursor = endMs;
      return {
        rasiIndex: bRasi0, rasi: RASI_TA[bRasi0], rasiEn: RASI_EN[bRasi0],
        lord: RASI_LORD[bRasi0], lordTa: RASI_LORD_TA[RASI_LORD[bRasi0]],
        years: Math.round(years * 1000) / 1000,
        start: fmtDate(startMs), end: fmtDate(endMs), startMs, endMs,
      };
    });

    mahas.push({
      rasiIndex: rasi0, rasi: RASI_TA[rasi0], rasiEn: RASI_EN[rasi0],
      lord: RASI_LORD[rasi0], lordTa: RASI_LORD_TA[RASI_LORD[rasi0]],
      years: mahaYears, start: fmtDate(mahaStart), end: fmtDate(mahaEnd),
      startMs: mahaStart, endMs: mahaEnd,
      dehaRasiIndex: walk[0], dehaRasi: RASI_TA[walk[0]],
      jeevaRasiIndex: walk[8], jeevaRasi: RASI_TA[walk[8]],
      paramayush,
      Bhukti: bhuktis,
    });
    cursor = mahaEnd;
  }

  const totalYears = Math.round(mahas.reduce((s, m) => s + m.years, 0) * 100) / 100;

  return {
    available: true,
    nakshatra: NAKSHATRA_TA[nakshatraIndex],
    nakshatraIndex,
    pada,
    direction: savya ? 'savya' : 'apasavya',
    directionTa: savya ? 'சவ்யம் (வலவோட்டு)' : 'அபசவ்யம் (இடவோட்டு)',
    role, roleTa: ROLE_TA[role],
    startRasi: RASI_TA[startRasi],
    totalYears,
    mahas,
    source: 'காலச்சக்கரம் (தெளிவான உரையுடன்) — தில்லைநாயகப் புலவர், தஞ்சாவூர் சரசுவதி மகால் நூலக வெளியீடு எண்.125 (2007), முன்னுரை ப.1-13',
  };
}

/** The running Mahā (and its running Bhukti) at an instant. */
function runningKalachakraPeriod(kalachakra, nowMs) {
  const maha = kalachakra.mahas.find((m) => nowMs >= m.startMs && nowMs < m.endMs);
  if (!maha) return null;
  const bhukti = maha.Bhukti.find((b) => nowMs >= b.startMs && nowMs < b.endMs) || null;
  return { maha, bhukti };
}

module.exports = {
  calculateKalachakraDasha, runningKalachakraPeriod, nakshatraPada, nakshatraRole,
  RASI_TA, RASI_EN, RASI_LORD, RASI_YEARS, SAVYA_BHUKTI, APASAVYA_BHUKTI, PARAMAYUSH_BY_TRINE,
};
