/**
 * What the Tamil text held says about Saturn's transit, beside what the English
 * books say.
 *
 * ## What the Tamil corpus does and does not contain
 *
 * The owner asked for both traditions to be shown, so the Tamil texts were
 * searched (2026-10-02). *Sūḍāmaṇi Uḷḷamuḍaiyāṉ* has a chapter on transit
 * (கோசாரபலமும் திசாபுத்தி பலனும், verses 341-347) and its OCR text contains
 * **no mention of ஏழரைச் சனி, அஷ்டமச் சனி, அர்த்தாஷ்டமம் or கண்டகச் சனி**
 * (searched under the spellings ஏழரை, அட்டம, கண்டக, கோசர; an OCR search can
 * miss a garbled word, so this is "not found", not a proof of absence). The
 * Tamil Jathaka Alangaram and Kalachakram hold nothing on them either (the
 * "கண்டக" hits there are unrelated: a dasha term, yamagandaka, and a
 * description of a wife). So the Tamil text cannot say which houses are
 * Kantaka, and this module does not invent a Tamil answer to it.
 *
 * What it does hold, and what is encoded here:
 *
 *  1. **The favourable houses for Saturn** (verse 341) and the vedha house that
 *     obstructs each (verse 342). The verse reads "மூன்றே, இருமூன்றே,
 *     பத்தொன்றுமா" — 3, 6, and *பத்தொன்று* = ten-and-one = **11**. That
 *     agrees with Pulippani and Vishnu Bhaskar. The printed *commentary*,
 *     however, lists "மூன்றாம், ஆறாம், பத்தாம், பதினோராம்" — it adds the 10th,
 *     reading பத்தொன்று as "ten, one". The verse itself, and the three-entry
 *     vedha list (12, 9, 5), support 3-6-11, so that is what is applied; the
 *     commentary's 10th is recorded as a disagreement of the editor with the
 *     verse.
 *  2. **அங்க சனி** (verse 344, commentary on p.150): Saturn's stay is divided
 *     over the body, 27 portions in all, and "all of these are counted from the
 *     birth star to the star where the planet stands". The portions sum to 27
 *     for every planet's table, which is what makes the nakshatra count the
 *     right reading: Saturn crosses 27 nakshatras in about 29.5 years.
 *
 * ## What is not established, and is labelled so
 *
 * The text does not say in what order the portions are counted. For the Sun,
 * Mars and the three benefics the order printed runs head to foot, so reading
 * the printed order as the counting order is natural; for Saturn the printed
 * order (mouth, right hand, legs, left hand, stomach, eyes, shoulder, head) is
 * not anatomical. Counting is also taken as inclusive of the birth star
 * ("பிறந்தநாள் தொட்டு"). Both are readings, so Anga Sani carries the status
 * `ORDER_ASSUMED` and the page says so. It is shown as the Tamil text's method,
 * not as a finding.
 *
 * Tables are embedded here rather than read from JSON for the same reason as
 * `saturnTransitTables.js` (Next replaces `__dirname`); the transcription is
 * recorded in `fixtures/saturn-transit/definitions.json` and the test asserts
 * the two agree.
 */

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const SUDAMANI = Object.freeze({
  title: 'சூடாமணி உள்ளமுடையான் : உரையுடன் (சோதிட நூல்)',
  author: 'ஓலைச்சுவடி மூலம்; தஞ்சாவூர் சரசுவதி மகால் நூலகப் பதிப்பு',
  file: 'choodamani-ullamudaiyan/raw-scans/full-scan.pdf',
  tradition: 'Tamil classical — muhurta, omens, natal, transit and marriage matching',
});

/** Scan page = printed page + 25 for this edition. */
const SUD_CHAPTER = 'கோசாரபலமும் திசாபுத்தி பலனும்';

/** Favourable houses for Saturn from the natal Moon, with the vedha house. */
const SATURN_GOOD_HOUSES = deepFreeze({
  houses: [3, 6, 11],
  /** Vedha house that obstructs each good house (the same in all three texts). */
  vedha: { 3: 12, 6: 9, 11: 5 },
  tamil: {
    houses: [3, 6, 11],
    commentaryAlsoLists: [10],
    note: 'செய்யுள் 341 "மூன்றே, இருமூன்றே, பத்தொன்றுமா" = 3, 6, 11; உரை 10-ஐயும் சேர்க்கிறது',
    source: { ...SUDAMANI, pageLocus: `${SUD_CHAPTER}, செய்யுள் 341-342, அச்சுப் பக்கம் 148 (ஸ்கேன் பக்கம் 173); உரை: அச்சுப் பக்கம் 148` },
  },
  english: [
    {
      houses: [3, 6, 11],
      note: 'Saturn "is good only in 3rd, 6th and 11th signs from one\'s birth Moon"',
      source: {
        title: 'Gochar Phaladeepika (Transit Results)',
        author: 'Dr. U.S. Pulippani',
        file: 'gochar-phaladeepika-pulippani/raw-scans/full-scan.pdf',
        tradition: 'Tamil / Sanskrit transit tradition (Phaladeepika commentary)',
        pageLocus: 'printed p.69 (PDF 80), Saturn',
      },
    },
    {
      houses: [3, 6, 11],
      vedha: { 3: 12, 6: 9, 11: 5 },
      note: 'Saturn 3, 6, 11 with vedha 12, 9, 5; Sun and Saturn (father and son) cause no vedha to each other',
      source: {
        title: 'Advanced Techniques of Predictive Astrology: A Vedic Treatise in Modern Times',
        author: 'Vishnu Bhaskar',
        file: 'advanced-techniques-of-predictive-astrology-vishnu-bhaskar/raw-scans/volume-1-part-02-pages-87-183.pdf',
        tradition: 'Parashari (modern compilation of classics)',
        pageLocus: 'Chapter 14 §II, printed p.139 (PDF page 53 of volume-1 part 02), the table of auspicious places and vedha places',
      },
    },
  ],
});

/**
 * Anga Sani — Saturn's body, verse 344. Counted in nakshatras from the birth
 * star to Saturn's star; the printed order is the order applied (ORDER_ASSUMED).
 */
const ANGA_SANI = deepFreeze({
  status: 'ORDER_ASSUMED',
  total: 27,
  bands: [
    { part: 'வாய்', portions: 1, result: 'தீமை செய்விக்கும்', tone: 'bad' },
    { part: 'வலக்கை', portions: 4, result: 'இனிமை உண்டாக்கும்', tone: 'good' },
    { part: 'கால்', portions: 6, result: 'யாத்திரை உண்டாக்கும்', tone: 'neutral' },
    { part: 'இடக்கை', portions: 4, result: 'காரியச் சேதம் உண்டாம்', tone: 'bad' },
    { part: 'வயிறு', portions: 5, result: 'ஊண் உண்டாம்', tone: 'good' },
    { part: 'கண்', portions: 2, result: 'அர்த்த இலாபம் உண்டாகும்', tone: 'good' },
    { part: 'புயம்', portions: 2, result: 'வியாதி உண்டாக்கும்', tone: 'bad' },
    { part: 'தலை', portions: 3, result: 'அபிஷேகம் உண்டாகும்', tone: 'good' },
  ],
  rule: 'இவையெல்லாம் பிறந்தநாள் தொட்டுக் கோள்நின்ற நாளளவும் எண்ணிப் பலன் சொல்வது '
    + '(இவை அனைத்தும் பிறந்த நட்சத்திரத்திலிருந்து கோள் நிற்கும் நட்சத்திரம் வரை எண்ணிப் பலன் சொல்லப்படும்)',
  assumptions: [
    'அங்கங்கள் அச்சிட்ட வரிசையிலேயே எண்ணப்படுகின்றன என்று கொள்ளப்பட்டது; நூல் வரிசையைச் சொல்லவில்லை.',
    'எண்ணிக்கை பிறந்த நட்சத்திரத்தையும் சேர்த்து (1 முதல்) எடுக்கப்பட்டது ("பிறந்தநாள் தொட்டு").',
    'நூலின் "ஆண்டு" என்பது நட்சத்திரங்களின் எண்ணிக்கையாகக் கொள்ளப்பட்டது (27 = சனியின் சுற்றில் 27 நட்சத்திரங்கள்).',
  ],
  source: { ...SUDAMANI, pageLocus: `${SUD_CHAPTER}, அங்க சனி — செய்யுள் 344, அச்சுப் பக்கம் 150 (ஸ்கேன் பக்கம் 175)` },
});

/** What the Tamil text does not name — stated, so its absence is on the page. */
const TAMIL_ABSENCES = deepFreeze({
  names: ['ஏழரைச் சனி', 'அஷ்டமச் சனி', 'அர்த்தாஷ்டமம்', 'கண்டகச் சனி'],
  searchedIn: [
    'சூடாமணி உள்ளமுடையான் (முழு OCR உரை)',
    'சாதக அலங்காரம் (சரசுவதி மகால் 2007; வேலுநாயகர் 1964)',
    'காலசக்கரம் (தில்லைநாயகப் புலவர்)',
  ],
  noteTa: 'நம்மிடம் உள்ள தமிழ் நூல்களின் OCR உரையில் இந்தப் பெயர்கள் காணப்படவில்லை. ஆகவே கண்டகச் சனியின் இடங்கள் தமிழ் நூலில் இருந்து தீர்மானிக்க முடியாது; ஆங்கில நூல்களின் முறைகள் மட்டுமே உள்ளன.',
});

module.exports = { SUDAMANI, SATURN_GOOD_HOUSES, ANGA_SANI, TAMIL_ABSENCES };
