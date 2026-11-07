/**
 * The band of years (Lal Kitab's 35-year cycle of planets) — the books' rules
 * (added 2026-10-11). Each planet rules a band of years of a person's life,
 * the nine bands making 35 years and running three times over a life.
 *
 * Words on the cycle (default by the most explained, Raj Kumar):
 *   Raj Kumar 902 (Table No.3, para 10.1 with the progression and his
 *   example, section 6.5), Gosvami 444 (§§20-21), Mahajan 326 (§§XIV-XV).
 */

const RAJ_KUMAR_CHARISMA = Object.freeze({
  title: 'Charisma of Planets: Timing Events',
  author: 'Raj Kumar',
  file: 'charisma-of-planets-raj-kumar/raw-scans/full-scan.pdf',
  tradition: 'Modern English book on timing (Parashari)',
});
const GOSVAMI_LAL_KITAB = Object.freeze({
  title: 'Lal Kitab (B.M. Gosvami)',
  author: 'B.M. Gosvami',
  file: 'lal-kitab-gosvami/raw-scans/full-scan.pdf',
  tradition: 'Lal Kitab, English rendering',
});
const MAHAJAN_LAL_KITAB = Object.freeze({
  title: 'Lal Kitab (U.C. Mahajan)',
  author: 'U.C. Mahajan',
  file: 'lal-kitab-mahajan/raw-scans/full-scan.pdf',
  tradition: 'Lal Kitab, English rendering',
});

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object' && !Object.isFrozen(v)) deepFreeze(v); });
  return Object.freeze(o);
};

/** Years each planet rules in the 35 (all three books agree). */
const SPANS = deepFreeze({ Jupiter: 6, Sun: 2, Moon: 1, Venus: 3, Mars: 6, Mercury: 2, Saturn: 6, Rahu: 6, Ketu: 3 });
const CYCLE_YEARS = 35;
const CYCLES = 3;
/** Raj Kumar's arithmetic: a band of n years is n × 365.25 days. */
const YEAR_DAYS = 365.25;

/** Which planet's band starts at birth. */
const ORDERS = deepFreeze({
  default: 'SATURN_FIRST',
  order: ['SATURN_FIRST', 'JUPITER_FIRST'],
  SATURN_FIRST: {
    labelTa: 'சனி முதல் (1-6 ஆண்டு சனி)',
    textTa: 'சனி 1-6, ராகு 7-12, கேது 13-15, குரு 16-21, சூரியன் 22-23, சந்திரன் 24, சுக்கிரன் 25-27, செவ்வாய் 28-33, புதன் 34-35 ஆம் ஆண்டு; 36-ஆம் ஆண்டு முதல் இரண்டாம் சுற்று, 71 முதல் மூன்றாம் சுற்று.',
    booksTa: 'ராஜ் குமார் (அட்டவணை 3, பத்தி 10.1; அவரது 48-50 கேது எடுத்துக்காட்டும்)',
    sequence: ['Saturn', 'Rahu', 'Ketu', 'Jupiter', 'Sun', 'Moon', 'Venus', 'Mars', 'Mercury'],
  },
  JUPITER_FIRST: {
    labelTa: 'குரு முதல் (பிறந்த நாளிலிருந்து குரு)',
    textTa: '"பிறந்த நாளிலிருந்து குருவின் சுற்று தொடங்கியது என்று கொள்வோம்": குரு 1-6, சூரியன் 7-8, சந்திரன் 9, சுக்கிரன் 10-12, செவ்வாய் 13-18, புதன் 19-20, சனி 21-26, ராகு 27-32, கேது 33-35. "முதல் கிரகம் சனியாகவும் இருக்கலாம்" — எப்போது என்று சொல்லவில்லை.',
    booksTa: 'கோஸ்வாமி, மகாஜன் (எடுத்துக்காட்டாக)',
    sequence: ['Jupiter', 'Sun', 'Moon', 'Venus', 'Mars', 'Mercury', 'Saturn', 'Rahu', 'Ketu'],
  },
});

/**
 * Lal Kitab: each planet's period in three equal parts, each with an
 * intervening planet (Gosvami §21 = Mahajan §XV).
 */
const INTERVENING = deepFreeze({
  Jupiter: ['Ketu', 'Jupiter', 'Sun'], Sun: ['Sun', 'Moon', 'Mars'], Moon: ['Jupiter', 'Sun', 'Moon'],
  Venus: ['Mars', 'Venus', 'Mercury'], Mars: ['Mars', 'Saturn', 'Venus'], Mercury: ['Moon', 'Mars', 'Jupiter'],
  Saturn: ['Rahu', 'Mercury', 'Saturn'], Rahu: ['Mars', 'Ketu', 'Rahu'], Ketu: ['Saturn', 'Rahu', 'Ketu'],
});
const PART_TA = Object.freeze(['தொடக்கம்', 'நடு', 'கடைசி']);

/** Full aspects (houses counted from the planet): the 7th for all; Mars 4, 8; Jupiter 5, 9; Saturn 3, 10. Rahu and Ketu none. */
const ASPECTS = deepFreeze({ Sun: [7], Moon: [7], Mars: [4, 7, 8], Mercury: [7], Jupiter: [5, 7, 9], Venus: [7], Saturn: [3, 7, 10], Rahu: [], Ketu: [] });

const RANK = deepFreeze({
  order: ['RAJ_KUMAR', 'GOSVAMI', 'MAHAJAN'],
  words: { RAJ_KUMAR: 902, GOSVAMI: 444, MAHAJAN: 326 },
  measureTa: '35 ஆண்டுச் சுற்று பற்றிய சொற்கள்: ராஜ் குமார் 902 (அட்டவணை 3; பத்தி 10.1 — முன்னேற்றம், எடுத்துக்காட்டுடன் 688; பகுதி 6.5 — கோசாரம் 214); கோஸ்வாமி 444 (§20-21, பக்.77-78); மகாஜன் 326 (§XIV-XV, பக்.25-26). யு.சி. மகாஜனின் "Horoscope Reading", டி.பி. சக்சேனா, ஷ்ரீமாலி ஆண்டுகளின் எண்ணிக்கையை மட்டும் சொல்கிறார்கள் (மகாஜன்: செவ்வாய் 3 + 3, தீய / நல்ல).',
});

const SOURCES = deepFreeze({
  RAJ_KUMAR: [
    { ...RAJ_KUMAR_CHARISMA, pageLocus: 'Chapter 1 §6.5, Table No.3 "Deities and most effective Periods of planets", PDF p.39: band of years — Sun 22nd-23rd, Moon 24th, Mars 28-33rd, Mercury 34-35th, Jupiter 16-21st, Venus 25-27th, Saturn 1-6th, Rahu 7-12th, Ketu 13-15th year' },
    { ...RAJ_KUMAR_CHARISMA, pageLocus: 'Chapter 3 para 10.1, PDF pp.171-174: "band of years allotted to various planets as per Lal Kitab ... After 35th year the second cycle begins and after 70 year the 3rd cycle"; "Each planet, while its band is operating, begins its progression from the place (house/ sign) at birth and returns to the original position within the years of band ... In each sign it spends 1/12th of the total length of the band. However it covers the sign it occupied at birth in two stages"; the example born 16 Oct 1946 (Venus 6° Scorpio): "365.25X3/12=91.3 days ... 91.3x24/30=73.04 days ... married on 12 Feb1973 ... while progressed Venus was traversing Libra"' },
    { ...RAJ_KUMAR_CHARISMA, pageLocus: 'Chapter 13 §6.5 "Ruler of band of years", PDF pp.267-269: "If the ruler is a karaka factor for an event in the birth chart as well as in transit, it will cause the event to occur during its transit over the relevant house"; "a ruler of band of years shall give a particular result in transit only when it is capable of giving that result in the birth"; the example: "Ketu is also ruler of 48-50th year of human life"' },
  ],
  GOSVAMI: [
    { ...GOSVAMI_LAL_KITAB, pageLocus: '§20 "35 (Thirtyfive) Year Circulation", printed p.77 (PDF 96): "All planets complete one round of transit in 35 years circulation. Those planets, which give malefic effect in the first round, would not do so in their second period of round"; Jupiter 6, Sun 2, Moon 1, Venus 3, Mars 6, Mercury 2, Saturn 6, Rahu 6, Ketu 3; "Supposing Jupiter\'s circulation started from the birthday of the person ... it is also possible that the first planet could be say Saturn (instead of Jupiter)"' },
    { ...GOSVAMI_LAL_KITAB, pageLocus: '§21 "Period of Each Planet during 35 Year Cycle", printed p.78 (PDF 97): the beginning, middle and last parts — Jupiter: Ketu, Jupiter, Sun (2 years each); Sun: Sun, Moon, Mars (8 months); Moon: Jupiter, Sun, Moon (4 months); Venus: Mars, Venus, Mercury (1 year); Mars: Mars, Saturn, Venus; Mercury: Moon, Mars, Jupiter; Saturn: Rahu, Mercury, Saturn; Rahu: Mars, Ketu, Rahu; Ketu: Saturn, Rahu, Ketu' },
  ],
  MAHAJAN: [
    { ...MAHAJAN_LAL_KITAB, pageLocus: '§XIII "Life Span of Planets", printed pp.24-25 (PDF 22-23): span in the 35-year period and "total years" Jupiter 16, Sun 22, Moon 24, Venus 25, Mercury 34, Saturn 36, Mars 13 + 15 = 28, Rahu 42, Ketu 48' },
    { ...MAHAJAN_LAL_KITAB, pageLocus: '§XIV "Thirty-five Year Cycle of Planets", printed p.25 (PDF 23): "if Jupiter starts with one\'s birth the whole cycle will be completed in 35 years ... It is possible that man\'s first planet is Saturn instead of Jupiter"; §XV, p.26 (PDF 24): the intervening planets, as Gosvami §21' },
  ],
});

const NOTES_TA = deepFreeze([
  'ஆண்டு = பிறந்த நேரத்திலிருந்து 365.25 நாள் (ராஜ் குமாரின் கணக்கு); n-ஆம் ஆண்டு = n−1 முடிந்த பின். பிறந்த நாள் அன்று தொடங்குவதிலிருந்து ஒரு நாளுக்குள் வேறுபடும்.',
  'முன்னேற்றம் (ராஜ் குமார்): ஆளும் கிரகம் தன் காலத்தில் பிறப்பு நிலையிலிருந்து ராசிச் சக்கரத்தை ஒரே வேகத்தில் ஒரு சுற்று வருகிறது — ஒவ்வொரு ராசியிலும் காலத்தின் 1/12. அவரது ஒரே எடுத்துக்காட்டு (சுக்கிரன்) முன்னோக்கிச் செல்கிறது; ராகு, கேதுவும் முன்னோக்கி என்பது எங்கள் வாசிப்பு.',
  'தொடர்பு (ராஜ் குமார்: "ராசி, நட்சத்திரம், நவாம்சம் அல்லது பாராசரப் பார்வை"): முன்னேறும் கிரகம் பிறப்புக் கிரகத்தின் ராசியில், அதன் நட்சத்திரத்தில், அல்லது அதன் ராசியைப் பார்க்கும் காலங்கள் காட்டப்படுகின்றன. நவாம்சத் தொடர்பு கணிக்கப்படவில்லை — எப்படி என்று சொல்லவில்லை.',
  'கண்டுபிடிப்பு: ராஜ் குமாரின் எடுத்துக்காட்டில் (16 அக். 1946, சுக்கிரன் விருச்சிகம் 6°) 12 பிப். 1973 திருமணம் "முன்னேறும் சுக்கிரன் துலாத்தில்" என்கிறார்; ஆனால் அவரது கணக்கின்படியே (25-ஆம் ஆண்டு 16 அக். 1970 தொடக்கம், 73.04 நாள், பின் ராசிக்கு 91.3 நாள்) அன்று சுக்கிரன் சிம்மத்தில்; துலாம் 28 ஜூன் – 27 செப். 1973.',
  'மகாஜனின் "மொத்த ஆண்டுகள்" (குரு 16, சூரியன் 22, சந்திரன் 24, சுக்கிரன் 25, செவ்வாய் 28, புதன் 34, சனி 36, ராகு 42, கேது 48) சனி-முதல் வரிசையில் ஒவ்வொரு கிரகத்தின் காலம் தொடங்கும் ஆண்டே (சனி, ராகு, கேது இரண்டாம் சுற்றில்) — எங்கள் கவனிப்பு; அவர் அப்படிச் சொல்லவில்லை.',
  'கோஸ்வாமி, மகாஜன்: "முதல் கிரகம் சனியாக இருந்தால் குரு 7-ஆம் ஆண்டிலிருந்து; 41 ஆண்டு முடிந்ததும் இரண்டாம் சுற்று" — இது இரண்டு வரிசைகளுக்கும் பொருந்தவில்லை; கணிக்கப்படவில்லை.',
  'கோசாரம் (ராஜ் குமார் §6.5): ஆளும் கிரகம் பிறப்பிலும் கோசாரத்திலும் நிகழ்வின் காரகராக இருந்தால், தொடர்புடைய வீட்டைக் கடக்கும்போது நிகழ்வு. காரகம், ஆரூடம், பிரத்யந்தர தசை தொடர்பு நூலின் தீர்ப்பு — இங்கே ஆளும் கிரகத்தின் இன்றைய கோசார நிலையும் பிறப்புக் கிரகங்களுடனான சேர்க்கை / பார்வையும் மட்டும்.',
  '"மிக பலவீனமான அல்லது பாதிக்கப்பட்ட கிரகம் தன் ஆண்டுகளில் தான் நிற்கும் / ஆளும் வீட்டின் தீய பலனைத் தரும்; பலமான கிரகம் நல்ல பலன்" (ராஜ் குமார்) — பிறப்பில் அது நிற்கும், ஆளும் வீடுகள் காட்டப்படுகின்றன; பலம் இங்கே கணிக்கப்படவில்லை.',
  '"முதல் சுற்றில் தீமை தந்த கிரகம் இரண்டாம் சுற்றில் தீமை தராது" (கோஸ்வாமி, மகாஜன்).',
]);

module.exports = {
  SPANS, CYCLE_YEARS, CYCLES, YEAR_DAYS, ORDERS, INTERVENING, PART_TA, ASPECTS, RANK, SOURCES, NOTES_TA,
  RAJ_KUMAR_CHARISMA, GOSVAMI_LAL_KITAB, MAHAJAN_LAL_KITAB,
};
