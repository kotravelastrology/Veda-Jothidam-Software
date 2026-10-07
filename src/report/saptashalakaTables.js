/**
 * Saptashalaka (seven-line) chakra — nakshatra gochara by vedha between the
 * 28 stars set on the ends of seven horizontal and seven vertical lines.
 *
 * Three books describe it for transits, and they read the chakra two ways:
 *
 *  - **Straight lines only** — the two stars at the ends of one line are in
 *    vedha. Ramakrishna Bhat says so in words ("some stars face one another",
 *    with examples) and draws a plain grid; Pulippani's text describes only the
 *    straight lines.
 *  - **Three lines** — each star meets the stars at the ends of the straight
 *    line and of the two diagonals through it. A.K. Gour says so in words, with
 *    worked examples, and Pulippani's diagram draws the same diamond lattice.
 *
 * Bhat explains the chakra most (808 words, against Pulippani 387 and Gour
 * 355), so his straight-line reading is the default; the three-line reading is
 * computed beside it.
 *
 * The 28th star is Abhijit; none of the three says where it lies. K.S.
 * Charak gives 276°40′–280°53′20″ (the last quarter of Uttarashadha and the
 * beginning of Shravana), which is used. Janma, Karma (10th) and Adhana (19th)
 * are counted in the ordinary 27 stars — Bhat's example counts the 19th from
 * Mrigashira as Dhanishta — and then set on the chakra.
 */

const { SOURCES: { PULIPPANI } } = require('./saturnTransitTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const BHAT = Object.freeze({
  title: 'Fundamentals of Astrology',
  author: 'M. Ramakrishna Bhat',
  file: 'fundamentals-of-astrology-ramakrishna-bhat/raw-scans/full-scan.pdf',
  tradition: 'Classical Indian astrology, modern English textbook',
});
const GOUR = Object.freeze({
  title: 'The Celestial Delivery Boy: Transit',
  author: 'A.K. Gour',
  file: 'celestial-delivery-boy-transit-gour/raw-scans/full-scan.pdf',
  tradition: 'Modern English book on transits',
});
const CHARAK = Object.freeze({
  title: 'Elements of Vedic Astrology',
  author: 'K.S. Charak',
  file: 'elements-of-vedic-astrology-charak/raw-scans/full-scan.pdf',
  tradition: 'Modern English textbook (Parashari)',
});

/** The 28 stars in chakra order from Krittika (1) to Bharani (28), Abhijit 20th. */
const CHAKRA_STARS_TA = Object.freeze([
  null,
  'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்',
  'மகம்', 'பூரம்', 'உத்திரம்', 'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்',
  'அனுஷம்', 'கேட்டை', 'மூலம்', 'பூராடம்', 'உத்திராடம்', 'அபிஜித்', 'திருவோணம்',
  'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி', 'அசுவினி', 'பரணி',
]);

/** Charak: Abhijit spans 276°40′0″ to 280°53′20″ (sidereal). */
const ABHIJIT = Object.freeze({ from: 276 + 40 / 60, to: 280 + 53 / 60 + 20 / 3600 });

/**
 * Where each star sits, as drawn by Pulippani and Gour: Krittika to Ashlesha
 * down the east side, Magha to Vishakha right to left along the south,
 * Anuradha to Shravana up the west side, Dhanishta to Bharani left to right
 * along the north. Lines run at x = 1..7 (north–south) and y = 1..7 (east–west);
 * the sides are x = 0, 8 and y = 0, 8.
 */
function pointOf(star) {
  if (star >= 1 && star <= 7) return { x: 8, y: star };
  if (star <= 14) return { x: 15 - star, y: 8 };
  if (star <= 21) return { x: 0, y: 22 - star };
  if (star <= 28) return { x: star - 21, y: 0 };
  throw new RangeError(`no chakra star ${star}`);
}
function starAt({ x, y }) {
  if (x === 8 && y >= 1 && y <= 7) return y;
  if (y === 8 && x >= 1 && x <= 7) return 15 - x;
  if (x === 0 && y >= 1 && y <= 7) return 22 - y;
  if (y === 0 && x >= 1 && x <= 7) return 21 + x;
  return null;
}
const onSide = ({ x, y }) => x === 0 || x === 8 || y === 0 || y === 8;

/** The star across the straight line. */
function straightPartner(star) {
  const p = pointOf(star);
  if (p.x === 8 || p.x === 0) return starAt({ x: 8 - p.x, y: p.y });
  return starAt({ x: p.x, y: 8 - p.y });
}

/** The stars at the far ends of the two diagonals through a star. */
function diagonalPartners(star) {
  const p = pointOf(star);
  const dirs = p.x === 8 ? [[-1, -1], [-1, 1]] : p.x === 0 ? [[1, -1], [1, 1]] : p.y === 0 ? [[1, 1], [-1, 1]] : [[1, -1], [-1, -1]];
  return dirs.map(([dx, dy]) => {
    let q = { x: p.x + dx, y: p.y + dy };
    while (!onSide(q)) q = { x: q.x + dx, y: q.y + dy };
    return starAt(q);
  });
}

const READINGS = deepFreeze({
  STRAIGHT: {
    id: 'STRAIGHT',
    labelTa: 'நேர் கோடு மட்டும் (பட், புலிப்பாணி உரை) — இயல்பு',
    partners: (star) => [straightPartner(star)],
    sources: [
      Object.freeze({ ...BHAT, pageLocus: 'Chapter XXI, printed p.251 (PDF 269): "some stars face one another. For example, Krttika and Sravana, Aslesa and Anuradha, Bharani and Magha, Dhanistha and Visakha This means there is mutual affliction or Vedha between these two stars"; diagram p.252' }),
      Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed p.209 (PDF 202): "Draw seven lines horizontally (from west to east) and over them draw seven lines vertical. The 28 extremities or points reckoned from the north east are to be allotted to the 28 stars (including Abhijit) counted from Krittika"' }),
    ],
  },
  THREE_LINES: {
    id: 'THREE_LINES',
    labelTa: 'மூன்று கோடுகள் (கௌர்; புலிப்பாணியின் வரைபடம்)',
    partners: (star) => [straightPartner(star), ...diagonalPartners(star)],
    sources: [
      Object.freeze({ ...GOUR, pageLocus: 'Chapter VIII, printed p.91 (PDF 94): "Each Nakshatra interacts with three other Nakshatras. These three are the Nakshatras located at the end of the three straight lines emanating from that Nakshatra. Take Ardara for example ... U. Bh.pda; P.Ashadha; Hasta"; diagram p.92' }),
      Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed p.210 (PDF 203): the chakra drawn as a lattice of crossing diagonals with the stars at the ends' }),
    ],
  },
});
const DEFAULT_READING = 'STRAIGHT';

const RANK = deepFreeze({
  order: ['BHAT', 'PULIPPANI', 'GOUR'],
  words: { BHAT: 808, PULIPPANI: 387, GOUR: 355 },
  measureTa: 'சப்தசலாகை பகுதியின் சொற்கள்: பட், ஜோதிட அடிப்படைகள் அத். XXI (பக்.251-253) 808; புலிப்பாணி அத். 24 (பக்.209-211) 387; கௌர் அத். VIII (பக்.91-93) 355.',
});

const ABHIJIT_SOURCE = Object.freeze({ ...CHARAK, pageLocus: 'Chapter 11, the note after Table 11-2 (PDF pp.25-26): "A segment of the zodiac extending from 276 40\'0" to 280 53\'20" ... is sometimes considered as a separate nakshatra by the name Abhijit"' });

/**
 * The rules, each with what every book says. Classification of malefics and
 * benefics is not given in this section of any of the three books: Mars,
 * Saturn, Rahu and Ketu are taken as malefics and Jupiter, Venus and Mercury as
 * benefics (natural nature — our reading); the Moon, who passes every star
 * monthly and whose nature turns with her phase, is left out.
 */
const MALEFICS = Object.freeze(['Mars', 'Saturn', 'Rahu', 'Ketu']);
const BENEFICS = Object.freeze(['Jupiter', 'Venus', 'Mercury']);

const RULES = deepFreeze([
  {
    id: 'SUN_VEDHA',
    titleTa: 'விதி 1 — சூரியன், ஜன்ம / கர்ம (10) / ஆதான (19) நட்சத்திரத்தின் வேதை நட்சத்திரத்தில்',
    books: [
      { book: 'BHAT', textTa: 'ஜன்ம நட்சத்திரத்தின் வேதையில் சூரியன் — உயிருக்கு ஆபத்து; ஆதானத்தின் வேதையில் — அச்சம், கவலை; கர்மத்தின் வேதையில் — பண இழப்பு. அதோடு சூரியனுடன் பாபக் கிரகம் சேர்ந்தால் — மரணம் என்கிறார்.', source: Object.freeze({ ...BHAT, pageLocus: 'Chapter XXI, printed pp.251-252 (PDF 269-270): "if on a particular day or period the Sun is transiting a star which happens to be the Vedha one for one\'s natal asterism, then it is to be inferred that there is danger to the native\'s life"' }) },
      { book: 'PULIPPANI', textTa: 'அதே மூன்று விளைவுகள்; சூரியனுடன் பாபக் கிரகம் சேர்ந்தால் மரணம் எதிர்பார்க்கலாம் என்கிறார்.', source: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed pp.209-210 (PDF 202-203): "If the star occupied by the Sun at the time happens to be the vedha asterism to the natal star, danger to life has to be foreseen, if to the Adhana Nakshatra, 19th from Janmanakshatra, there will be fear and anxiety; if the 10th ... loss of wealth"' }) },
      { book: 'GOUR', textTa: 'ஜன்ம நட்சத்திர வேதையில் சூரியன் தீயது — உயிருக்கு ஆபத்து; அனுஜன்ம, திரிஜன்ம வேதையில் முறையே பண இழப்பு, அச்சம்.', source: Object.freeze({ ...GOUR, pageLocus: 'Chapter VIII, printed p.92 (PDF 95): "the Sun transiting in a Vedha star to the Janma Nakshatra as evil. It entails danger to life. Sun in Vedha to Anujanma or Trijanma is also evil Transit entailing loss of wealth and fear respectively"' }) },
    ],
    readingTa: '"சூரியனுடன் பாபக் கிரகம்" — அதே ராசியில் பாபக் கிரகம் என்று எடுத்தோம் (எங்கள் வாசிப்பு).',
  },
  {
    id: 'OTHERS_VEDHA',
    titleTa: 'விதி 2 — மற்ற கிரகங்கள், அதே மூன்று நட்சத்திரங்களின் வேதையில்',
    books: [
      { book: 'BHAT', textTa: 'சூரியன் அல்லாத பாபக் கிரகங்கள் அந்த வேதை நட்சத்திரங்களில் இருந்தால் மரணம்; பாபர்களும் சுபர்களும் இருவரும் இருந்தால் உயிருக்கு ஆபத்து இல்லை.', source: Object.freeze({ ...BHAT, pageLocus: 'Chapter XXI, printed p.252 (PDF 270): "If both malefics and benefics transit such stars, there will be no danger to life"' }) },
      { book: 'PULIPPANI', textTa: 'சூரியன் அல்லாத பாபக் கிரகங்களால் — மரணம் நேரலாம்; சுபக் கிரகங்களால் — உயிருக்கு ஆபத்து இல்லை.', source: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed p.210 (PDF 203): "If any one of the three asterims referred to above be thus marred by the occupation of other malefics (other than the Sun), death may happen; if by benefics, there will be no danger to life"' }) },
      { book: 'GOUR', textTa: 'பாபக் கிரகத்தின் வேதை — தொல்லை; சுபக் கிரகத்தின் வேதை — நல்லது.', source: Object.freeze({ ...GOUR, pageLocus: 'Chapter VIII, printed p.92 (PDF 95): "Malefic in Vedha to these three stars causes trouble where as Vedha by benefics is good"' }) },
    ],
    readingTa: 'பாபர் = செவ்வாய், சனி, ராகு, கேது; சுபர் = குரு, சுக்கிரன், புதன்; சந்திரன் சேர்க்கப்படவில்லை (மாதந்தோறும் எல்லா நட்சத்திரங்களையும் கடப்பதால், பக்ஷத்தைப் பொறுத்து சுப/பாபம் மாறுவதால்) — இந்தப் பகுதியில் நூல்கள் வகைப்படுத்தவில்லை; எங்கள் வாசிப்பு.',
  },
  {
    id: 'OCCUPATION',
    titleTa: 'விதி 3 — ஜன்ம நட்சத்திரத்திலிருந்து 1, 3, 5, 7, 10, 19, 23-வது நட்சத்திரங்களில் பாப / சுபக் கிரகம்',
    counts: [1, 3, 5, 7, 10, 19, 23],
    books: [
      { book: 'BHAT', textTa: 'பாபக் கிரகங்கள் இவற்றில் சென்றால் உயிருக்கு ஆபத்து; சுபக் கிரகங்கள் என்றால் முயற்சிகள் தோல்வி மட்டும். இது சப்தசலாகை வேதையிலிருந்து வேறான இன்னொரு வகை என்கிறார் (இருப்பிடம், வேதை அல்ல).', source: Object.freeze({ ...BHAT, pageLocus: 'Chapter XXI, printed pp.252-253 (PDF 270-271): "If malefics should transit the natal star, the 3rd from it, the 5th, the 7th, 10th, 19th or the 23rd ... then too there will be danger to life. If these positions are occupied by benefics in transit, then there will be only failure of undertakings. Now you see that this is another kind of Vedha different from the one indicated by the Saptasalaka figure"' }) },
      { book: 'PULIPPANI', textTa: '19, 10, 3, 1, 23, 5, 7-வது நட்சத்திரங்கள் பாபக் கிரகங்களால் "பாதிக்கப்பட்டால்" உயிருக்கு ஆபத்து; சுபக் கிரகம் என்றால் வியாபாரத் தோல்வி மட்டும் ("afflicted" — இருப்பிடமா வேதையா என்று சொல்லவில்லை).', source: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed p.211 (PDF 204): "If the 19th, 10th, 3rd, 1st, 23rd, 5th or 7th (all reckoned from the Janmatara) are afflicted by malefics during their transit, there will be danger to life. But if the planet be benefic, failure in business will be the only result"' }) },
      { book: 'GOUR', textTa: '1, 3, 5, 7, 10, 19, 22-வது நட்சத்திரங்களின் "வேதை" பாபக் கிரகத்தால் — உயிருக்கு ஆபத்து; சுபக் கிரகத்தால் கூட வியாபார இழப்பு. (மற்ற இருவர் 23-வது என்கிறார்கள்; கௌர் 22-வது, வேதை.)', source: Object.freeze({ ...GOUR, pageLocus: 'Chapter VIII, printed p.92 (PDF 95): "Vedha by a malefic planet of the 1st, 3rd, 5th, 7th, 10th, 19th and 22nd Nakshatras, counted from the Natal star, are dangerous to life"' }) },
    ],
    readingTa: 'இருப்பிடம் (பட்) கணிக்கப்படுகிறது. கௌரின் "வேதை", "22-வது" வாசிப்பு காட்டப்படுகிறது, கணிக்கப்படவில்லை.',
  },
  {
    id: 'ROUNDS',
    titleTa: 'விதி 4 — ஜன்ம / அனுஜன்ம (10) / திரிஜன்ம (19) நட்சத்திரத்தில் சந்திரன் இருக்கும் நேரத்தில் கிரகம் ராசி மாறுதல்',
    books: [
      { book: 'BHAT', textTa: 'எந்தச் சுற்றிலும் ஜன்ம நட்சத்திரம் சூரியன் ராசி மாறும் நேரத்துடனோ, வேறு கிரகம் ராசி மாறுவதுடனோ, கிரகணம், கிரக யுத்தம், எரிநட்சத்திரம் போன்றவற்றுடனோ ஒத்துவந்தால் மிகத் தீயது — மரணம் அல்லது பெரும் ஆபத்து.', source: Object.freeze({ ...BHAT, pageLocus: 'Chapter XXI, printed p.253 (PDF 271): "See also if the natal star in any round synchronizes with the Sun\'s entry into another Sign of the zodiac. If it does, then the effect is very bad"' }) },
      { book: 'PULIPPANI', textTa: 'மூன்று நட்சத்திரங்களும் சூரிய சங்கிரமண நாளிலோ, வேறு கிரகம் ராசி மாறும்போதோ, கிரகணத்திலோ விழுந்தால் மரணம் அல்லது அதுபோன்ற தீய நிகழ்வு.', source: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed p.211 (PDF 204): "The three asterims (viz Janma Anujanma, Trijanma), 1st, 10th and 19th falling on a day identical with the Sun\'s Sankramana ... or at a time when any of the other planets transit from one Rasi to another or when there is an eclipse"' }) },
      { book: 'GOUR', textTa: 'சந்திரன் ஜன்ம, அனுஜன்ம, திரிஜன்ம நட்சத்திரத்தில் இருக்கும்போது ஏதேனும் கிரகம் புதிய ராசியில் நுழைந்தால் தீய நிகழ்வுகள்; சூரியன் ராசி மாறுவது குறிப்பாக.', source: Object.freeze({ ...GOUR, pageLocus: 'Chapter VIII, printed p.93 (PDF 96): "Should the Moon be transiting in the Janma, Anujanma or the Trijanma Nakshatras and a planet in the horoscope enters a new sign; untoward incidents are likely to take place"' }) },
    ],
    readingTa: 'ராசி மாறும் கணத்தில் சந்திரனின் நட்சத்திரம் பார்க்கப்படுகிறது (எங்கள் வாசிப்பு; புலிப்பாணி "நாள்" என்கிறார்). கிரகணம், கிரக யுத்தம், எரிநட்சத்திரம் கணிக்கப்படவில்லை.',
  },
]);

const NOT_COMPUTED_TA = Object.freeze([
  'உல்கா: சூரியனின் நட்சத்திரத்திலிருந்து 10-வது (காலப்பிரகாசிகை) அல்லது 21-வது (பலபத்ரர்) என்று புலிப்பாணி இரண்டையும் பதிவு செய்கிறார் (ப.211); அதன் விளைவு அங்கே சொல்லப்படவில்லை — கணிக்கவில்லை.',
  'பட் ப.253: சுபக் கிரகப் பார்வை தீமையைத் தணிக்கும்; சொந்த / உச்ச வீட்டில் இருந்தால் தீமை இல்லை; நீசம், பகை, அஸ்தங்கத்தில் நன்மை வராது — பொது கோசார விதிகள்; இங்கே கணிக்கவில்லை.',
]);

const NOTES_TA = Object.freeze({
  countingTa: 'ஜன்ம, கர்ம (10), ஆதான (19) நட்சத்திரங்கள் சாதாரண 27 நட்சத்திரங்களில் எண்ணப்படுகின்றன (பட்டின் உதாரணம்: மிருகசீரிடத்திலிருந்து 19-வது அவிட்டம்); பிறகு 28 நட்சத்திரச் சக்கரத்தில் வைக்கப்படுகின்றன. கோசாரக் கிரகம் அபிஜித் பகுதியில் இருந்தால் சக்கரத்தில் அபிஜித்.',
  abhijitTa: 'அபிஜித்: 276°40′ – 280°53′20″ (சாரக்). வேறு நூல்கள் உத்திராடத்தின் கடைசி பாதம் மட்டும் (276°40′ – 280°) என்கின்றன; இங்கே சாரக்கின் அளவு.',
  disclaimerTa: 'இவை நூல்களின் கூற்றுகள் — இந்த மென்பொருளின் முன்கணிப்பு அல்ல. காலங்கள் வானியல் கணக்கு.',
});

module.exports = {
  BHAT, GOUR, CHARAK, CHAKRA_STARS_TA, ABHIJIT, ABHIJIT_SOURCE,
  pointOf, starAt, straightPartner, diagonalPartners,
  READINGS, DEFAULT_READING, RANK, RULES, MALEFICS, BENEFICS, NOT_COMPUTED_TA, NOTES_TA,
};
