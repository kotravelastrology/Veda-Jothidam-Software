/**
 * Gochara Vedha and Vipareetha Vedha — the tables, as the books print them.
 *
 * A transiting planet gives its good results in certain houses from the natal
 * Moon. **Gochara vedha**: if another planet stands at the same time in the
 * house paired with that good house, the good is obstructed. **Vipareetha
 * vedha** turns it round: if a planet is in a house where it gives bad results
 * and another planet stands in the paired house, the bad is cancelled.
 *
 * Pulippani, *Gochar Phaladeepika*, chapter 22 (printed pp.204-206) prints both
 * tables for all nine planets. They are encoded whole, as printed, because the
 * vipareetha table should be the gochara table read backwards and the test
 * checks it is: it is, except for two places where the print departs, and those
 * are recorded rather than corrected:
 *
 *   - Jupiter's malefic row prints "S" where the gochara table needs 8.
 *   - Venus's last two vipareetha pairs are swapped against the gochara table
 *     (printed 6↔11 and 3↔12; the gochara table pairs 11↔3 and 12↔6). Found
 *     later (2026-10-06): 6↔11 and 3↔12 are exactly Vishnu Bhaskar's gochara
 *     pairs, so this is the books' disagreement showing inside one book, not
 *     only a slip; Kalaprakasika and Sudamani side with Pulippani's gochara row.
 *
 * Sudamani verse 343 (printed p.149) states the same reversal in Tamil — "even
 * cruel planets give good" when the planets stand the other way round — and its
 * commentary says to read every planet's pairs that way. For Saturn that gives
 * the same three pairs as Pulippani from verse 342. The two differ on what
 * happens: Pulippani says Saturn's evil "will not be felt"; Sudamani says even a
 * cruel planet "gives good". Both are shown.
 *
 * The Saturn stage computed Saturn only; since 2026-10-06 every planet is
 * computed (`gocharaVedha.js`), and more books are compared below — since
 * 2026-10-08 including Mantreswara's Phaladeepika XXVI.2-8 itself, whose pairs
 * are Pulippani's.
 */

const { SOURCES } = require('./saturnTransitTables');
const { SUDAMANI } = require('./saturnTransitTamil');
const { SANTHANAM_JN } = require('./nakshatraVedhaTables');

const { PULIPPANI, VISHNU_BHASKAR } = SOURCES;
const { PHALADEEPIKA_SASTRI, PHALADEEPIKA_KAPOOR } = require('./classicSources');

const JATAKA_PARIJATA = Object.freeze({
  title: 'Jataka Parijata, Vol. III',
  author: 'Vaidyanatha Dikshita (original); V. Subrahmanya Sastri (English translation and notes)',
  file: 'jataka-parijata-vol3-subrahmanya-sastri/raw-scans/full-scan.pdf',
  tradition: 'Classical Sanskrit (medieval) with a modern English translation',
});

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

/** Pulippani printed pp.204-205: [good house, vedha house] pairs, and planets that cause no vedha. */
const GOCHARA_VEDHA = deepFreeze({
  Sun: { pairs: [[3, 9], [6, 12], [10, 4], [11, 5]], noVedhaBy: ['Saturn'] },
  Moon: { pairs: [[1, 5], [3, 9], [6, 12], [7, 2], [10, 4], [11, 8]], noVedhaBy: ['Mercury'] },
  Mars: { pairs: [[3, 12], [6, 9], [11, 5]], noVedhaBy: [] },
  Mercury: { pairs: [[2, 5], [4, 3], [6, 9], [8, 1], [10, 8], [11, 12]], noVedhaBy: ['Moon'] },
  Jupiter: { pairs: [[2, 12], [5, 4], [7, 3], [9, 10], [11, 8]], noVedhaBy: [] },
  Venus: { pairs: [[1, 8], [2, 7], [3, 1], [4, 10], [5, 9], [8, 5], [9, 11], [11, 3], [12, 6]], noVedhaBy: ['Sun'] },
  Saturn: { pairs: [[3, 12], [6, 9], [11, 5]], noVedhaBy: ['Sun'] },
  Rahu: { pairs: [[3, 12], [6, 9], [11, 5]], unpairedGood: [10], noVedhaBy: [] },
  Ketu: { pairs: [[3, 12], [6, 9], [11, 5]], unpairedGood: [10], noVedhaBy: [] },
});
const GOCHARA_VEDHA_SOURCE = Object.freeze({
  ...PULIPPANI,
  pageLocus: 'printed pp.204-205 (PDF 197-198), chapter 22 "Gochara Vedha and Vipareetha Vedha", table 1: "Benefic places" and "Gochara Vedha"',
});

/**
 * Pulippani printed pp.205-206: [bad house, vipareetha-vedha house] pairs, read
 * column by column as printed. `printed` records a cell that is not what it is
 * read as; `swappedAgainstGochara` records pairs that do not reverse the table above.
 */
const VIPAREETA_VEDHA = deepFreeze({
  Sun: { pairs: [[9, 3], [12, 6], [4, 10], [5, 11]], noneBy: ['Saturn'] },
  Moon: { pairs: [[2, 7], [5, 1], [12, 6], [8, 11], [4, 10], [9, 3]], noneBy: [] },
  Mars: { pairs: [[12, 3], [5, 11], [9, 6]], noneBy: [] },
  Mercury: { pairs: [[5, 2], [3, 4], [9, 6], [1, 8], [8, 10], [12, 11]], noneBy: ['Moon'] },
  Jupiter: { pairs: [[12, 2], [8, 11], [10, 9], [4, 5], [3, 7]], noneBy: [], printed: { '8': 'S' } },
  Venus: { pairs: [[8, 1], [7, 2], [1, 3], [10, 4], [9, 5], [5, 8], [11, 9], [6, 11], [3, 12]], noneBy: [], swappedAgainstGochara: [[6, 11], [3, 12]] },
  Saturn: { pairs: [[12, 3], [9, 6], [5, 11]], noneBy: [] },
  Rahu: { pairs: [[12, 3], [9, 6], [5, 11]], noneBy: [] },
  Ketu: { pairs: [[12, 3], [9, 6], [5, 11]], noneBy: [] },
});
const VIPAREETA_VEDHA_SOURCE = Object.freeze({
  ...PULIPPANI,
  pageLocus: 'printed pp.205-206 (PDF 198-199), "Vipareetha Vedha": "Places of malefic results" and "Vipareetha Vedha places"; "There is no Vipareetha Vedha to Sun by Saturn and similarly for Mercury by Moon"',
});

/** What each book says follows, for Saturn, in Tamil, with pages. */
const SATURN_VEDHA_TEXT = deepFreeze({
  pulippaniVedha: {
    textTa: 'சனி 3, 6, 11-ல் நல்ல பலன் தரும் நேரத்தில் வேறொரு கிரகம் முறையே 12, 9, 5-ல் இருந்தால் அந்த நல்ல பலன் தடைபடும் (கோசார வேதை). சூரியனால் சனிக்கு வேதை இல்லை.',
    source: GOCHARA_VEDHA_SOURCE,
  },
  pulippaniVipareeta: {
    textTa: 'சனி 12, 9, 5-ல் தீய பலன் தரும் நேரத்தில் வேறொரு கிரகம் முறையே 3, 6, 11-ல் இருந்தால் அந்தத் தீய பலன் நீங்கும் (விபரீத வேதை). உதாரணம்: ஏழரைச் சனியின் தொடக்கமாகச் சனி 12-ல் இருக்கும்போது குரு 3-ல் இருந்தால், குரு அங்கிருக்கும் சுமார் ஓராண்டு சனியின் தீமை உணரப்படாது. சனி 1, 2, 4, 7, 8 போன்ற மற்ற இடங்களுக்கு விபரீத வேதை இடம் இல்லை — அங்கு தீமை உணரப்படும்.',
    source: Object.freeze({ ...PULIPPANI, pageLocus: 'printed p.206 (PDF 199): "Suppose Saturn is 12th from Janma Rasi ... Jupiter is in 3rd ... The evil effects of Saturn\'s transit will not be felt ... during one year period"' }),
  },
  pulippaniOrdeal: {
    textTa: 'ஏழரைச் சனி நடக்கும்போது குரு 3-ல் இல்லாமல், வேகமாகச் செல்லும் சூரியன், சந்திரன், புதன், சுக்கிரன், செவ்வாய் சனி இருக்கும் அதே இடத்தைக் கடக்கும் குறுகிய காலங்களில் துன்பம் கூடும்.',
    source: Object.freeze({ ...PULIPPANI, pageLocus: 'printed p.206 (PDF 199): "If Sadhe Sati of Shani is running and Jupiter is not his 3rd, fast moving planets ... move through the same bhava, there will be more ordeal"' }),
  },
  santhanamSadeSati: {
    textTa: 'சந்தானம் (ஜோதிஷார்ணவ நவநீதம் உரை): ஏழரைச் சனியின் பலன், சனியுடன் அதே ராசியில் வேறு கிரகம் (சூரியன், ராகு முதலியவை தவிர) செல்லும்போது தடுக்கப்படும் — மேலே உள்ள புலிப்பாணியின் "மேலும் துன்பம்" என்பதற்கு நேர் எதிர். இரண்டும் காட்டப்படுகின்றன.',
    source: Object.freeze({ ...SANTHANAM_JN, pageLocus: 'Chapter 3 commentary, printed p.152 (PDF 159): "Sade Sathi effects are checked by another planet (except the Sun, Rahu etc.) in simultaneous transit with Saturn himself"' }),
  },
  jatakaParijata: {
    textTa: 'ஜாதக பாரிஜாதம் (13-ஆம் அத்தியாயம், 60-ஆம் ஸ்லோக உரை): தந்தைக்கும் மகனுக்கும் இடையே வேதை இல்லை — எனவே சந்திரனும் புதனும், சூரியனும் சனியும் வேதையால் ஒருவரை ஒருவர் பாதிப்பதில்லை. இது பொதுவான கூற்று (இரு திசையிலும்) — அதனால் சனியின் விபரீத வேதையிலும் சூரியன் கணக்கில் வராது.',
    source: Object.freeze({ ...JATAKA_PARIJATA, pageLocus: 'printed p.834 (PDF 128), Adhyaya XIII, notes to sloka 60: "There is no Vedha between the father and the son. Consequently, (1) the Moon and Mercury, (2) the Sun and Saturn do not affect each other through Vedha."' }),
  },
  vishnuBhaskar: {
    textTa: 'சனி 3, 6, 11 — வேதை 12, 9, 5; சூரியனும் சனியும் (தந்தை, மகன்) ஒருவருக்கொருவர் வேதை செய்வதில்லை.',
    source: Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 14 §II, printed p.139 (PDF page 53 of volume-1 part 02), the table of auspicious places and vedha places' }),
  },
  sudamaniVipareeta: {
    textTa: 'செய்யுள் 343: வேதைக் கோள் கோசார இடத்திலும் கோசாரக் கோள் வேதை இடத்திலும் "வேறாக" நின்றால், "கொடியவரும் நலங்கொடுப்பர்" — இது விபரீதம். உரை: தீதான கோள்களும் நன்மை தரும்; மற்றவற்றையும் இப்படி விபரீதமாகப் பார்க்க வேண்டும். சனிக்கு (செய்யுள் 342-ன் 3↔12, 6↔9, 11↔5 இணைகளைத் திருப்பினால்): சனி 12-ல், வேறு கோள் 3-ல்; சனி 9-ல், கோள் 6-ல்; சனி 5-ல், கோள் 11-ல்.',
    source: Object.freeze({ ...SUDAMANI, pageLocus: 'கோசாரபலமும் திசாபுத்தி பலனும், செய்யுள் 343, அச்சுப் பக்கம் 149 (ஸ்கேன் பக்கம் 174); உரை பக்கம் 149-150' }),
    differsTa: 'புலிப்பாணி: சனியின் தீமை "உணரப்படாது". சூடாமணி: கொடிய கோளும் "நலம் கொடுக்கும்". ஒன்று தீமை நீங்குவது, மற்றது நன்மை கிடைப்பது — இரண்டும் காட்டப்படுகின்றன.',
    commentaryNoteTa: 'உரையின் சூரிய உதாரணத்தில் முதல் இணைக்குச் சூரியன் நிற்கும் இடம் (5) விடுபட்டுள்ளது; மற்ற மூன்று இணைகள் (சூரியன் 9-ல் கோள்கள் 3-ல்; 4-ல், 10-ல்; 12-ல், 6-ல்) புலிப்பாணியின் அட்டவணையுடன் பொருந்துகின்றன.',
  },
  sudamaniTiming: {
    textTa: 'செய்யுள் 343 (பின் பாதி) மற்றும் உரை: சூரியனும் செவ்வாயும் ராசியின் தொடக்கத்தில் பலன் தருவர்; குருவும் சுக்கிரனும் நடுவில்; சனியும் சந்திரனும் "பின்னே" — ராசியின் இறுதியில்; புதனும் பாம்பும் (ராகு, கேது) போம்போது — முழுவதும். ராசியின் "இறுதி" எவ்வளவு என்று நூல் சொல்லவில்லை, அதனால் அந்தக் காலம் கணிக்கப்படவில்லை.',
    source: Object.freeze({ ...SUDAMANI, pageLocus: 'கோசாரபலமும் திசாபுத்தி பலனும், செய்யுள் 343, அச்சுப் பக்கம் 149; உரை அச்சுப் பக்கம் 150 (ஸ்கேன் பக்கம் 175)' }),
  },
});

/** Saturn's three relievable bad houses and the house that relieves each, per Pulippani and (by reversal) Sudamani. */
const SATURN_VIPAREETA = Object.freeze({ 12: 3, 9: 6, 5: 11 });
/** Saturn's three good houses and the house that obstructs each (Pulippani, Vishnu Bhaskar, Sudamani verse 342). */
const SATURN_VEDHA = Object.freeze({ 3: 12, 6: 9, 11: 5 });

// ===========================================================================
// All nine planets (added 2026-10-06): five books compared, two computed
// ===========================================================================
//
// Five books print a vedha table. They agree on most cells and differ on a
// few, listed in VEDHA_DIFFERENCES below. Two of them print a complete table
// that can be read unambiguously — Pulippani and Vishnu Bhaskar — and those two
// are the methods the engine computes. Pulippani was the default because his
// chapter explains the subject most (owner's rule, 2026-10-03). Since
// 2026-10-10 the default is Phaladeepika (Sastri) — the owner's decision, after
// its chapter 26 was read in full and found to be the text Pulippani follows;
// the books are still listed by words.

const KALAPRAKASIKA_BOOK = Object.freeze({
  title: 'Kalaprakasika',
  author: 'N.P. Subramania Iyer (translator)',
  file: 'kalaprakasika-nps-iyer-1982/raw-scans/full-scan.pdf',
  tradition: 'Tamil / Sanskrit classical (muhurta)',
});

const PLANETS_9 = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);

/** Vishnu Bhaskar printed p.139: auspicious place → vedha place. Rahu and Ketu share one row. */
const VB_GOCHARA_VEDHA = deepFreeze({
  Sun: { pairs: [[3, 9], [6, 12], [10, 4], [11, 5]] },
  Moon: { pairs: [[1, 5], [3, 9], [6, 12], [7, 2], [10, 4], [11, 8]] },
  Mars: { pairs: [[3, 12], [6, 9], [11, 5]] },
  Mercury: { pairs: [[2, 5], [4, 3], [6, 9], [8, 1], [10, 7], [11, 12]] },
  Jupiter: { pairs: [[2, 12], [5, 4], [7, 3], [9, 10], [11, 8]] },
  Venus: { pairs: [[1, 8], [2, 7], [3, 1], [4, 10], [5, 9], [8, 5], [9, 11], [11, 6], [12, 3]] },
  Saturn: { pairs: [[3, 12], [6, 9], [11, 5]] },
  Rahu: { pairs: [[3, 12], [6, 9], [11, 5]] },
  Ketu: { pairs: [[3, 12], [6, 9], [11, 5]] },
});
const VB_VEDHA_SOURCE = Object.freeze({
  ...VISHNU_BHASKAR,
  pageLocus: 'Chapter 14 §II, printed p.139 (PDF page 53 of volume-1 part 02): "Auspicious Places from Moon & their corresponding Vedha Places"; note 2 "Father son duo i.e. Su-Sa or Mo-Me don\'t cause Vedha"; note 4 "Vipreet Vedha: When there is a planet at any of its Vedha place it is inauspicious & if there is any other planet in corresponding good house then its evil effect is obstructed"',
});

/** The father-and-son exemption, stated generally (both directions, both kinds) by three books. */
const FATHER_SON = deepFreeze([['Sun', 'Saturn'], ['Moon', 'Mercury']]);
const FATHER_SON_SOURCES = Object.freeze([
  Object.freeze({ ...JATAKA_PARIJATA, pageLocus: 'printed p.834 (PDF 128), Adhyaya XIII, notes to sloka 60: "There is no Vedha between the father and the son. Consequently, (1) the Moon and Mercury, (2) the Sun and Saturn do not affect each other through Vedha."' }),
  Object.freeze({ ...KALAPRAKASIKA_BOOK, pageLocus: 'printed p.209 (PDF 239), "Planetary Vedhai (Perturbation)": "The Moon and Mercury, the Sun and Saturn do not affect each other through Vedhai."' }),
  VB_VEDHA_SOURCE,
]);

/** Reverses a good→vedha table into bad→relieving pairs, keeping only houses that are not themselves good. */
function reverseOnBadHouses(pairs, goodHouses) {
  const good = new Set(goodHouses);
  return pairs.filter(([, v]) => !good.has(v)).map(([g, v]) => [v, g]);
}
const goodOf = (row) => [...row.pairs.map(([g]) => g), ...(row.unpairedGood ?? [])];

/**
 * The computable methods. For each planet: good houses (each with its vedha
 * house, or none), and bad houses that a planet elsewhere relieves
 * (vipareetha) — a list, since one book gives two tables that can both
 * relieve the same bad house. A house that the book calls good is read as good
 * even where a vipareetha row also lists it — Pulippani's malefic rows for
 * Mercury (8) and Venus (1, 3, 5, 8, 9, 11) name houses his own benefic rows
 * call good. A planet the book has no row for is marked `notCovered`.
 */
function methodFrom(gocharaTable, vipareetaFor) {
  const out = {};
  for (const p of PLANETS_9) {
    const row = gocharaTable[p];
    if (!row) {
      out[p] = { notCovered: true, good: [], vedhaOf: {}, unpairedGood: [], relievedBy: {} };
      continue;
    }
    const good = goodOf(row);
    const relievedBy = {};
    for (const [b, r] of vipareetaFor(p, row, good)) {
      if (good.includes(b)) continue;
      relievedBy[b] = relievedBy[b] ?? [];
      if (!relievedBy[b].includes(r)) relievedBy[b].push(r);
    }
    out[p] = {
      good,
      vedhaOf: Object.fromEntries(row.pairs.map(([g, v]) => [g, v])),
      unpairedGood: [...(row.unpairedGood ?? [])],
      relievedBy,
    };
  }
  return deepFreeze(out);
}

// ---------------------------------------------------------------------------
// R. Santhanam, Jyotisharnava Navanitam, ch.3 commentary (added 2026-10-06)
// ---------------------------------------------------------------------------

/** Santhanam printed p.147: good place → vedha place. No rows for Rahu and Ketu. */
const SANTHANAM_GOCHARA_VEDHA = deepFreeze({
  Sun: { pairs: [[3, 9], [6, 12], [10, 4], [11, 5]] },
  Moon: { pairs: [[1, 5], [3, 9], [6, 12], [7, 2], [10, 4], [11, 8]] },
  Mars: { pairs: [[3, 12], [6, 9], [11, 5]] },
  Mercury: { pairs: [[2, 5], [4, 3], [6, 9], [8, 1], [10, 8], [11, 12]] },
  Jupiter: { pairs: [[2, 12], [5, 4], [7, 3], [9, 10], [11, 8]] },
  Venus: { pairs: [[1, 8], [2, 7], [3, 1], [4, 10], [5, 9], [8, 5], [9, 11], [11, 6], [12, 3]] },
  Saturn: { pairs: [[3, 12], [6, 9], [11, 5]] },
});

/**
 * Santhanam printed p.151, "Vedha for bad places only": a planet in one of its
 * bad houses is checked by another planet in the house given. Where the house
 * given is the same house, the checking planet transits with it — his p.152
 * says so for Saturn's Sade Sati ("checked by another planet ... in
 * simultaneous transit with Saturn himself").
 */
const SANTHANAM_BAD_PLACES = deepFreeze({
  Sun: { 1: 1, 2: 2, 4: 3, 5: 6, 7: 7, 8: 8, 9: 10, 12: 11 },
  Moon: { 2: 1, 4: 3, 5: 6, 8: 7, 9: 10, 12: 11 },
  Mars: { 1: 1, 2: 2, 4: 4, 5: 4, 7: 6, 8: 7, 9: 8, 10: 10, 12: 12 },
  Mercury: { 1: 2, 3: 4, 5: 7, 7: 6, 9: 8, 12: 11 },
  Jupiter: { 1: 1, 3: 2, 4: 5, 6: 6, 8: 8, 10: 9, 12: 12 },
  Venus: { 6: 12, 7: 2, 10: 4 },
  Saturn: { 1: 1, 2: 2, 4: 4, 5: 4, 7: 6, 8: 7, 9: 8, 10: 10, 12: 12 },
});

const SANTHANAM_SOURCES = Object.freeze({
  vedha: Object.freeze({ ...SANTHANAM_JN, pageLocus: 'Chapter 3 commentary, printed p.147 (PDF 154), "Table of Vedha (Places of Obstacles)"; p.148: "the Sun and Saturn do not cause Vedha to each other. So also there is no Vedha between the Moon and Mercury"' }),
  vipareeta: Object.freeze({ ...SANTHANAM_JN, pageLocus: 'Chapter 3 commentary, printed pp.148-149 (PDF 155-156): "reverse the figures noted up and down in the Table of Vedhas" and the "Table of Viparita Vedha"' }),
  badPlaces: Object.freeze({ ...SANTHANAM_JN, pageLocus: 'Chapter 3 commentary, printed pp.150-151 (PDF 157-158): "The last of the Vedhas ... somewhat akin to Viparita Vedha but it covers other evil houses" and the table "Vedha for bad places only"' }),
  sadeSati: Object.freeze({ ...SANTHANAM_JN, pageLocus: 'Chapter 3 commentary, printed p.152 (PDF 159): "Sade Sathi effects are checked by another planet (except the Sun, Rahu etc.) in simultaneous transit with Saturn himself. Jupiter in the 10th is checked by another planet in transit in the 9th"' }),
});

// ---------------------------------------------------------------------------
// Mantreswara, Phaladeepika XXVI.2-8 (added 2026-10-08)
// ---------------------------------------------------------------------------

/**
 * Phaladeepika XXVI.2-8, as V. Subrahmanya Sastri prints and translates it
 * (1950, printed pp.286-288). Verse 2 gives the good houses — Rahu and Ketu
 * "similar to the Sun" (3, 6, 10, 11) — and verses 3-8 the vedha house for
 * each good house of the seven planets, with Saturn not obstructing the Sun,
 * Mercury not the Moon, the Sun not Saturn and the Moon not Mercury. The pairs
 * are Pulippani's, cell for cell, including the two the books dispute: in the
 * Sanskrit, Mercury's 10th pairs with "नैधन" (8th) and Venus's 11th and 12th
 * with "सहज" (3rd) and "वैरि" (6th). It differs from Pulippani in three
 * things: no vedha house for the nodes, no Venus–Sun exemption, and no
 * vipareetha vedha anywhere in the chapter.
 *
 * This is also what the code carried until 2026-10-06 under the unchecked
 * label "Phaladeepika 26.3-8" (ported from the prior AstrologicLab code): the
 * seven planets and both exemptions match the verses; its nodes — good in 3,
 * 6, 11 with Saturn's pairs — do not.
 */
const PHALADEEPIKA_GOCHARA_VEDHA = deepFreeze({
  Sun: { pairs: [[3, 9], [6, 12], [10, 4], [11, 5]] },
  Moon: { pairs: [[1, 5], [3, 9], [6, 12], [7, 2], [10, 4], [11, 8]] },
  Mars: { pairs: [[3, 12], [6, 9], [11, 5]] },
  Mercury: { pairs: [[2, 5], [4, 3], [6, 9], [8, 1], [10, 8], [11, 12]] },
  Jupiter: { pairs: [[2, 12], [5, 4], [7, 3], [9, 10], [11, 8]] },
  Venus: { pairs: [[1, 8], [2, 7], [3, 1], [4, 10], [5, 9], [8, 5], [9, 11], [11, 3], [12, 6]] },
  Saturn: { pairs: [[3, 12], [6, 9], [11, 5]] },
  Rahu: { pairs: [], unpairedGood: [3, 6, 10, 11] },
  Ketu: { pairs: [], unpairedGood: [3, 6, 10, 11] },
});

/**
 * G.S. Kapoor's translation (e-text pp.246-247) gives the same verse 2 and
 * pairs with two lists short: Mercury's vedha places "5th, 3rd, 9th, 8th and
 * 12th" (five for six houses — Sastri's "1st" is missing) and Venus's houses
 * "2nd, 3rd, 4th, 5th, 8th, 12th, and 11th" (seven for nine vedha places — the
 * 1st and 9th are missing; his own verse 2 lists both).
 */
const PHALADEEPIKA_KAPOOR_PRINTED = deepFreeze({
  Mercury: { houses: [2, 4, 6, 8, 10, 11], vedha: [5, 3, 9, 8, 12] },
  Venus: { houses: [2, 3, 4, 5, 8, 12, 11], vedha: [8, 7, 1, 10, 9, 5, 11, 6, 3] },
});

const PHALADEEPIKA_SOURCES = Object.freeze({
  sastri: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, slokas 2-8, printed pp.286-288 (PDF 321-323) — sloka 2 "Rahu and Ketu are similar to the Sun"; sloka 3 "not marred by the transit of any of the planets other than Saturn"; sloka 6 "5th, 3rd, 9th, 1st, 8th and 12th"; sloka 8 "8th, 7th, 1st, 10th, 9th, 5th, 11th, 6th and 3rd respectively"' }),
  kapoor: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, slokas 2-8, e-text pp.246-247 — sloka 2 "Rahu - 3rd, 6th, 10th and 11th. Ketu - 3rd, 6th, 10th and 11th"' }),
});

const VEDHA_METHODS = deepFreeze({
  PULIPPANI: {
    id: 'PULIPPANI',
    labelTa: 'புலிப்பாணி (கோசார பலதீபிகை, அத். 22)',
    table: methodFrom(GOCHARA_VEDHA, (p) => VIPAREETA_VEDHA[p].pairs),
    // Pulippani's own lists, plus the general father-and-son rule both ways.
    exempt: {
      gochara: { Sun: ['Saturn'], Saturn: ['Sun'], Moon: ['Mercury'], Mercury: ['Moon'], Venus: ['Sun'] },
      vipareeta: { Sun: ['Saturn'], Saturn: ['Sun'], Moon: ['Mercury'], Mercury: ['Moon'] },
    },
    exemptNoteTa: 'புலிப்பாணியின் பட்டியல்: சூரியனுக்குச் சனியால், சந்திரனுக்குப் புதனால், புதனுக்குச் சந்திரனால், சுக்கிரனுக்குச் சூரியனால், சனிக்குச் சூரியனால் வேதை இல்லை. "தந்தை-மகன்" விதியை (சூரியன்-சனி, சந்திரன்-புதன்) ஜாதக பாரிஜாதம், காலப்பிரகாசிகை, விஷ்ணு பாஸ்கர் மூவரும் இரு திசையிலும் பொதுவாகச் சொல்வதால் விபரீத வேதைக்கும் பொருத்துகிறோம். சுக்கிரன்-சூரியன் விலக்கு புலிப்பாணியில் மட்டும், கோசார வேதைக்கு மட்டும்.',
    sources: [GOCHARA_VEDHA_SOURCE, VIPAREETA_VEDHA_SOURCE],
  },
  VISHNU_BHASKAR: {
    id: 'VISHNU_BHASKAR',
    labelTa: 'விஷ்ணு பாஸ்கர் (அத். 14 §II)',
    table: methodFrom(VB_GOCHARA_VEDHA, (p, row, good) => reverseOnBadHouses(row.pairs, good)),
    exempt: {
      gochara: { Sun: ['Saturn'], Saturn: ['Sun'], Moon: ['Mercury'], Mercury: ['Moon'] },
      vipareeta: { Sun: ['Saturn'], Saturn: ['Sun'], Moon: ['Mercury'], Mercury: ['Moon'] },
    },
    exemptNoteTa: 'விஷ்ணு பாஸ்கர்: சூரியன்-சனி, சந்திரன்-புதன் ("தந்தை-மகன்") வேதை செய்வதில்லை. விபரீத வேதை = வேதை இடத்தில் கிரகம், இணையான நல்ல இடத்தில் வேறு கிரகம் — அவரது அட்டவணையைத் திருப்பிப் படிப்பது.',
    sources: [VB_VEDHA_SOURCE],
  },
  SANTHANAM: {
    id: 'SANTHANAM',
    labelTa: 'சந்தானம் (ஜோதிஷார்ணவ நவநீதம், அத். 3 உரை)',
    table: methodFrom(SANTHANAM_GOCHARA_VEDHA, (p, row, good) => [
      ...reverseOnBadHouses(row.pairs, good),
      ...Object.entries(SANTHANAM_BAD_PLACES[p]).map(([b, r]) => [Number(b), r]),
    ]),
    exempt: {
      gochara: { Sun: ['Saturn'], Saturn: ['Sun'], Moon: ['Mercury'], Mercury: ['Moon'] },
      vipareeta: { Sun: ['Saturn'], Saturn: ['Sun'], Moon: ['Mercury'], Mercury: ['Moon'] },
    },
    exemptNoteTa: 'சந்தானம்: சூரியன்-சனி, சந்திரன்-புதன் வேதை செய்வதில்லை. தீய இடத்துக்கு இரண்டு அட்டவணைகள்: வேதை அட்டவணையைத் திருப்பியது (ப.149), "தீய இடங்களுக்கு மட்டும் வேதை" (ப.151). இரண்டில் எதன்படி கிரகம் இருந்தாலும் தீமை தடுக்கப்படுவதாக எடுத்தோம் (எங்கள் வாசிப்பு). அதே இடம் என்றால் உடன் செல்லும் கிரகம் (ப.152). ராகு, கேதுவுக்கு அவரது அட்டவணையில் வரிசை இல்லை. ப.152 ஏழரைக்கு "சூரியன், ராகு முதலியவை தவிர" என்கிறது: சூரியன் தந்தை-மகன் விதியால் ஏற்கனவே விலக்கு; ராகுவும் "முதலியவையும்" ஏழரைக்கு மட்டும் சொல்லப்பட்டதால், "முதலியவை" யார் என்று தெரியாததால், கணக்கில் விலக்கப்படவில்லை.',
    sources: [SANTHANAM_SOURCES.vedha, SANTHANAM_SOURCES.vipareeta, SANTHANAM_SOURCES.badPlaces, SANTHANAM_SOURCES.sadeSati],
  },
  PHALADEEPIKA_SASTRI: {
    id: 'PHALADEEPIKA_SASTRI',
    labelTa: 'பலதீபிகை (மந்த்ரேஸ்வரர், அத். 26.2-8 — சாஸ்திரி)',
    table: methodFrom(PHALADEEPIKA_GOCHARA_VEDHA, () => []),
    exempt: {
      gochara: { Sun: ['Saturn'], Saturn: ['Sun'], Moon: ['Mercury'], Mercury: ['Moon'] },
      vipareeta: {},
    },
    exemptNoteTa: 'பலதீபிகை: சூரியனுக்குச் சனியால் (ஸ்லோ. 3), சந்திரனுக்குப் புதனால் (4), சனிக்குச் சூரியனால் (5), புதனுக்குச் சந்திரனால் (6) வேதை இல்லை; சுக்கிரன்-சூரியன் விலக்கு இல்லை. ராகு, கேது "சூரியனைப் போல" 3, 6, 10, 11-ல் நல்லவர்கள் (ஸ்லோ. 2); அவற்றுக்கு வேதை இடம் சொல்லப்படவில்லை — அதனால் வேதை இல்லாத நல்ல இடங்களாகக் காட்டப்படுகின்றன (எங்கள் வாசிப்பு; "சூரியனைப் போல" என்பதை வேதைக்கும் நீட்டினால் 3→9, 6→12, 10→4, 11→5). விபரீத வேதை இந்த அத்தியாயத்தில் இல்லை.',
    sources: [PHALADEEPIKA_SOURCES.sastri, PHALADEEPIKA_SOURCES.kapoor],
  },
});
/** Owner's decision, 2026-10-10: Phaladeepika, the classical text the others follow, over the most-explained book. */
const DEFAULT_VEDHA_METHOD = 'PHALADEEPIKA_SASTRI';

/** Words in each book's vedha section (English text layer; Sudamani in Tamil words). */
const VEDHA_RANK = deepFreeze({
  order: ['PULIPPANI', 'SANTHANAM', 'JATAKA_PARIJATA', 'PHALADEEPIKA_SASTRI', 'PHALADEEPIKA_KAPOOR', 'SUDAMANI', 'KALAPRAKASIKA', 'VISHNU_BHASKAR'],
  words: { PULIPPANI: 614, SANTHANAM: 575, JATAKA_PARIJATA: 465, PHALADEEPIKA_SASTRI: 396, PHALADEEPIKA_KAPOOR: 350, SUDAMANI: 251, KALAPRAKASIKA: 248, VISHNU_BHASKAR: 185 },
  computable: ['PULIPPANI', 'SANTHANAM', 'PHALADEEPIKA_SASTRI', 'VISHNU_BHASKAR'],
  measureTa: 'கோசார வேதை, விபரீத வேதை பற்றிய பகுதியின் சொற்கள்: புலிப்பாணி அத்தியாயம் 22 (பக்.204-206) 614; சந்தானம், ஜோதிஷார்ணவ நவநீதம் அத்.3 உரை (பக்.146-149) 575; ஜாதக பாரிஜாதம் உரை (பக்.833-834) 465; பலதீபிகை 26.2-8 — சாஸ்திரி மொழிபெயர்ப்பு, குறிப்புடன் (பக்.286-288) 396, கபூர் மொழிபெயர்ப்பு (பக்.246-247) 350; சூடாமணி செய்யுள் 341-343 உரையுடன் 251 (தமிழ்ச் சொற்கள்); காலப்பிரகாசிகை (பக்.209-210) 248; விஷ்ணு பாஸ்கர் §II (ப.139) 185.',
  alternativeTa: 'மாற்று அளவு: சந்தானத்தின் "தீய இடங்களுக்கு மட்டும் வேதை" பகுதியையும் (185 சொற்கள்) சேர்த்தால் அவர் 760 — புலிப்பாணியை முந்துவார். புலிப்பாணியிடம் அந்த வகை இல்லாததால் ஒரே தலைப்புகளை மட்டும் ஒப்பிட்டோம். நூல்கள் இந்தச் சொல் எண்ணிக்கை வரிசையிலேயே காட்டப்படுகின்றன.',
  defaultTa: 'இயல்பு: பலதீபிகை (சாஸ்திரி) — உரிமையாளரின் முடிவு (2026-10-10). மந்த்ரேஸ்வரரின் அத்தியாயம் 26 முழுமையாகப் படிக்கப்பட்டது: புலிப்பாணியின் வேதை இணைகள் அதன் ஸ்லோகங்களே (2-8). அதனால் "அதிகம் விளக்கும் நூல் முதலில்" என்ற விதிக்குப் பதிலாக மூல நூல் இயல்பு. பலதீபிகையோடு வேறுபடுபவை: சுக்கிரன்-சூரியன் விலக்கு இல்லை, விபரீத வேதை இல்லை, ராகு-கேதுவுக்கு வேதை இடம் இல்லை.',
  computableTa: 'கணிக்கக்கூடியவை நான்கு — முழு அட்டவணையையும் தெளிவாகப் படிக்கக்கூடிய புலிப்பாணி, சந்தானம் (ராகு, கேது இல்லாமல்), பலதீபிகை (சாஸ்திரி — இயல்பு; விபரீத வேதை இல்லை, ராகு-கேதுவுக்கு வேதை இடம் இல்லை), விஷ்ணு பாஸ்கர். கபூரின் பலதீபிகை மொழிபெயர்ப்பில் இரண்டு பட்டியல்களில் எண்கள் விடுபட்டுள்ளதால் அது ஒப்பீட்டில் மட்டும். ஜாதக பாரிஜாதம் காலப்பிரகாசிகையின் அட்டவணையையே மறுபதிப்பு செய்கிறது; காலப்பிரகாசிகை நல்ல/தீய இடப் பட்டியல் தராமல் ஒவ்வொரு இடத்தின் பலனை மட்டும் சொல்வதால் (பக்.207-208) அதைக் கணிக்க எங்கள் தீர்ப்பு வேண்டும். சூடாமணியின் சுக்கிரன் வரியின் நடுப்பகுதி மீட்டமைப்பு மட்டுமே (கீழே), செய்யுள் 341 சுக்கிரனின் 8-ஆம் இடத்தைச் சொல்லவில்லை. இவை மூன்றும் ஒப்பீட்டில் மட்டும்.',
});

/**
 * Kalaprakasika's table, as Jataka Parijata reprints it (printed p.834): one
 * row of twelve numbers per planet under columns I-XII. Read as "a planet in
 * house N is obstructed by a planet in the house printed under N", every
 * auspicious-house cell of all six rows matches Pulippani except Mercury's
 * 10th, which prints 10. The columns for the other houses do not reverse the
 * auspicious pairs (except Venus's). They are, in 35 of 39 cells, Santhanam's
 * "Vedha for bad places only" (`SANTHANAM_BAD_PLACES`), whose text states the
 * rule Kalaprakasika's prose implies; a number equal to its own column means a
 * planet in the same sign (Santhanam p.152). Kalaprakasika is still not
 * computed: it gives each house's result, not a list of good and bad houses,
 * so which columns obstruct and which relieve would be our judgement. The
 * reading of the layout is ours.
 */
const KALAPRAKASIKA_TABLE = deepFreeze({
  Sun: [1, 2, 9, 3, 6, 12, 7, 8, 10, 4, 5, 11],
  Moon: [5, 1, 9, 3, 6, 12, 2, 7, 10, 4, 8, 11],
  Mars: [1, 2, 12, 3, 4, 9, 6, 7, 8, 10, 5, 11],
  Mercury: [2, 5, 4, 3, 7, 9, 6, 1, 8, 10, 12, 11],
  Jupiter: [1, 12, 2, 5, 4, 6, 3, 7, 10, 9, 8, 11],
  Venus: [8, 7, 1, 10, 9, 12, 2, 5, 11, 4, 3, 6],
});
/** Cells where the 1982 Kalaprakasika print (p.210) differs from Jataka Parijata's reprint: [column, printed]. */
const KALAPRAKASIKA_1982_CELLS = deepFreeze({
  Moon: [[1, '6'], [7, 'a']], Mars: [[7, 'S'], [11, '6']], Mercury: [[4, '8']], Venus: [[8, '6']],
});
const KALAPRAKASIKA_SOURCES = Object.freeze([
  Object.freeze({ ...JATAKA_PARIJATA, pageLocus: 'printed pp.833-834 (PDF 127-128), Adhyaya XIII notes to sloka 60: the Kalaprakasika verses ("yugmagaih") and "the Vedha positions have been indicated in the table subjoined: Vedah signs reckoned from the house of the Moon"' }),
  Object.freeze({ ...KALAPRAKASIKA_BOOK, pageLocus: 'printed p.210 (PDF 240), "Vedhai Signs from the House of the Moon"; p.209: "Vedhai places of Rahu, Kethu, and Saturn are the same as those of Mars"; a badly located planet "loses its power for evil and produces good" through planets "holding their Vedhai signs"' }),
]);

/**
 * Sudamani: verse 341 good houses and verse 342 vedha places, as sets, in
 * verse order. Venus's vedha line was decoded on 2026-10-08 — see
 * SUDAMANI_VENUS: five of its eight numbers are read from the print, three
 * are our reconstruction.
 */
const SUDAMANI_SETS = deepFreeze({
  good: { Sun: [11, 3, 10, 6], Moon: [1, 3, 6, 7, 10, 11], Mars: [3, 6, 10, 11], Saturn: [3, 6, 10, 11], Rahu: [3, 6, 10, 11], Mercury: [2, 6, 4, 8, 10, 11], Jupiter: [11, 9, 7, 5, 2], Venus: [11, 12, 2, 1, 4, 3, 5, 9] },
  vedha: { Sun: [5, 9, 4, 12], Moon: [5, 9, 12, 2, 4, 8], Mars: [12, 9, 5], Saturn: [12, 9, 5], Rahu: [12, 9, 5], Mercury: [5, 3, 9, 1, 8, 12], Jupiter: [12, 8, 10, 3, 4], Venus: [3, 6, 7, 8, 10, 1, 9, 11] },
});

/**
 * Sudamani's Venus, verses 341-342 (printed p.148, scan 173), read from the
 * page image on 2026-10-08.
 *
 * Verse 341 gives Venus ("புகழ்") eight good houses — "பன்னொன்று ஈராறு இரண்டு
 * ஒன்று வருநான்கு மூன்று ஐந்து ஒன்பான்": 11, 12, 2, 1, 4, 3, 5, 9. The 8th
 * is not in the verse; the commentary's list (p.148) has nine, with the 8th
 * after the 2nd. (Before 2026-10-08 this table carried the commentary's nine
 * under the verse's name.)
 *
 * Verse 342's Venus ("புகர்") line is printed "புகர் மூன்றோன் விட்டீராறு
 * சேட்டீரம் சொன்றோடொன்பான் வியன்ற பதினொன்றில்". Read with certainty: the
 * first number, மூன்று (3), and the last four — ஈரஞ்சு (10; printed "ஈரம்"
 * before "சொன்று", the ம் standing for ஞ், as ஐஞ்சு stands for 5 in verse 341),
 * ஒன்று (1), ஒன்பான் (9), பதினொன்று (11). These five are Pulippani's (and
 * Kalaprakasika's) vedha places for Venus's 11th, 4th, 3rd, 5th and 9th, and
 * they come in the very order verse 341 lists those good houses. The middle,
 * "ஓன் விட்டீராறு சேட்டு", is not read with certainty; on the same order it
 * must hold the vedha of the 12th, 2nd and 1st — 6, 7, 8 in those books —
 * and "ஆறு" and "...ட்டு" are visible in it, "ஏழ்" is not. With the 8th good
 * house absent from verse 341, eight vedha places are what the verse needs.
 */
const SUDAMANI_VENUS = deepFreeze({
  verse341Good: [11, 12, 2, 1, 4, 3, 5, 9],
  commentaryGood341: [11, 12, 2, 8, 1, 4, 3, 5, 9],
  verse342Printed: 'புகர்மூன்றோன் விட்டீ ராறு சேட்டீரம் சொன்றோ டொன்பான் வியன்ற பதினொன்றில்',
  verse342Read: [3, null, null, null, 10, 1, 9, 11],
  verse342Reading: [3, 6, 7, 8, 10, 1, 9, 11],
  commentary342: { good: [11, 12, 8, 9, 4, 3, 5], clean: [3, 6, 7, 5, 8, 11, 9] },
  textTa: 'சூடாமணி — சுக்கிரன் (செய்யுள் 341-342): செய்யுள் 341 சுக்கிரனுக்கு எட்டு நல்ல இடங்கள் — 11, 12, 2, 1, 4, 3, 5, 9 (8-ஆம் இடம் செய்யுளில் இல்லை; உரை அதைச் சேர்க்கிறது). செய்யுள் 342-ன் சுக்கிரன் வரி அச்சில் "புகர்மூன்றோன் விட்டீராறு சேட்டீரம் சொன்றோடொன்பான் வியன்ற பதினொன்றில்". உறுதியாகப் படிப்பவை: முதல் எண் மூன்று (3); கடைசி நான்கு — ஈரஞ்சு (10; அச்சில் "ஈரம்"), ஒன்று (1), ஒன்பான் (9), பதினொன்று (11). இந்த ஐந்தும் புலிப்பாணி, காலப்பிரகாசிகையின் சுக்கிர வேதை இடங்களே (11→3, 4→10, 3→1, 5→9, 9→11), செய்யுள் 341 அந்த நல்ல இடங்களைச் சொல்லும் அதே வரிசையில். நடுப்பகுதி "ஓன் விட்டீராறு சேட்டு" உறுதியாகப் படிக்க முடியவில்லை; அதே வரிசைப்படி அது 12, 2, 1-ன் வேதை இடங்களாக — அந்த நூல்களில் 6, 7, 8 — இருக்க வேண்டும்; அதில் "ஆறு", "...ட்டு" தெரிகின்றன, "ஏழ்" தெரியவில்லை. ஆகவே 6, 7, 8 எங்கள் மீட்டமைப்பு. முடிவு: சூடாமணியின் சுக்கிர வேதை புலிப்பாணி / காலப்பிரகாசிகையுடன் ஒன்றுகிறது — 11→3 (6 அல்ல). உரை (ப.149) ஏழு நல்ல இடங்களையும் ஏழு வேதை இடங்களையும் தருகிறது; அவை வரிசையாக இணையவில்லை (முதல் இரண்டு 11→3, 12→6 மட்டும் பொருந்துகின்றன), ஆனால் தொகுப்பாக அவை புலிப்பாணியின் வேதை இடங்களுக்குள்ளேயே.',
  source: Object.freeze({ ...SUDAMANI, pageLocus: 'கோசாரபலமும் திசாபுத்தி பலனும், செய்யுள் 341-342, அச்சுப் பக்கம் 148 (ஸ்கேன் பக்கம் 173); உரை பக்கம் 148-149 (ஸ்கேன் 173-174)' }),
});
const SUDAMANI_SOURCES = Object.freeze([
  Object.freeze({ ...SUDAMANI, pageLocus: 'கோசாரபலமும் திசாபுத்தி பலனும், செய்யுள் 341-342, அச்சுப் பக்கம் 148 (ஸ்கேன் பக்கம் 173); உரை பக்கம் 148-149 (ஸ்கேன் 173-174)' }),
]);

/**
 * Where the books differ — each a cell or rule, with every book's reading.
 * `planet`/`house` say where it bites in a computation.
 */
const VEDHA_DIFFERENCES = deepFreeze([
  {
    id: 'MERCURY_10',
    planet: 'Mercury', house: 10,
    textTa: 'புதன் 10-ல் — வேதை இடம்: புலிப்பாணி, சந்தானம் 8; பலதீபிகை 8 (ஸ்லோகம் 6 — சமஸ்கிருதத்தில் "नैधन", சாஸ்திரி "8th"; கபூரின் பட்டியலில் ஓர் எண் விடுபட்டுள்ளது); சூடாமணியின் புதன் வேதைத் தொகுப்பில் 8 உண்டு, 7 இல்லை; ஜாதக பாரிஜாதம் / காலப்பிரகாசிகை அட்டவணை X-ன் கீழ் 10 (அதே இடம் — சந்தானத்தின் வாசிப்புப்படி உடன் செல்லும் கிரகம்); விஷ்ணு பாஸ்கர் 7.',
    byBook: { PULIPPANI: 8, SANTHANAM: 8, PHALADEEPIKA_SASTRI: '8 ("नैधन")', PHALADEEPIKA_KAPOOR: 'பட்டியலில் "1st" விடுபட்டுள்ளது', SUDAMANI: '8 (தொகுப்பில்)', JATAKA_PARIJATA: '10', KALAPRAKASIKA: '10', VISHNU_BHASKAR: 7 },
  },
  {
    id: 'VENUS_11_12',
    planet: 'Venus', house: [11, 12],
    textTa: 'சுக்கிரன் 11, 12-ல் — வேதை இடங்கள்: புலிப்பாணி, ஜாதக பாரிஜாதம், காலப்பிரகாசிகை 3, 6; பலதீபிகை ஸ்லோகம் 8 அதே — சமஸ்கிருதத்தில் 12→"वैरि" (6), 11→"सहज" (3), சாஸ்திரி, கபூர் இருவரும்; சூடாமணி — செய்யுள் 342-ன் சுக்கிரன் வரி 3-ல் தொடங்கி 10, 1, 9, 11 என்று செய்யுள் 341-ன் வரிசையைப் பின்பற்றுகிறது (11→3), உரையும் முதல் இரண்டு இணையாக 11-3, 12-6; சந்தானம், விஷ்ணு பாஸ்கர் 6, 3. புலிப்பாணியின் சொந்த விபரீத வேதை அட்டவணையும் 6↔11, 3↔12 என்றே அச்சாகியுள்ளது.',
    byBook: { PULIPPANI: '11→3, 12→6', SANTHANAM: '11→6, 12→3', JATAKA_PARIJATA: '11→3, 12→6', PHALADEEPIKA_SASTRI: '11→3, 12→6 ("सहज", "वैरि")', PHALADEEPIKA_KAPOOR: '11→3, 12→6 (இடப் பட்டியலில் 1, 9 விடுபட்டுள்ளன)', KALAPRAKASIKA: '11→3, 12→6', SUDAMANI: '11→3 (செய்யுள்), 12→6 (உரை; செய்யுளில் மீட்டமைப்பு)', VISHNU_BHASKAR: '11→6, 12→3' },
  },
  {
    id: 'TENTH_GOOD',
    planet: ['Mars', 'Saturn', 'Rahu', 'Ketu'], house: 10,
    textTa: '10-ஆம் இடம்: புலிப்பாணி ராகு, கேதுவுக்கு நல்ல இடம் (வேதை இடம் இல்லை); பலதீபிகை ஸ்லோகம் 2-ம் அப்படியே — ராகு, கேது "சூரியனைப் போல" (3, 6, 10, 11; கபூர் வெளிப்படையாக), செவ்வாய், சனிக்கு 10 இல்லை; சூடாமணி செவ்வாய், சனி, ராகுவுக்கு நல்ல இடம் (வேதை இடம் இல்லை); காலப்பிரகாசிகை, சந்தானம் — செவ்வாய், சனி 10-ல் இருக்கும்போது உடன் செல்லும் கிரகம் தீமையைத் தடுக்கும் (அட்டவணையில் 10-ன் கீழ் 10); சந்தானத்திடம் ராகு, கேது வரிசை இல்லை; விஷ்ணு பாஸ்கர் 10-ஐ நல்ல இடமாகச் சொல்லவில்லை.',
    byBook: { PULIPPANI: 'ராகு, கேது', SANTHANAM: 'தீய இடம்; உடன் செல்லும் கிரகம் தடுக்கும்', PHALADEEPIKA_SASTRI: 'ராகு, கேது ("சூரியனைப் போல")', PHALADEEPIKA_KAPOOR: 'ராகு, கேது', SUDAMANI: 'செவ்வாய், சனி, ராகு', KALAPRAKASIKA: '10 (அதே இடம்)', JATAKA_PARIJATA: '10 (அதே இடம்)', VISHNU_BHASKAR: '—' },
  },
  {
    id: 'VENUS_SUN',
    planet: 'Venus',
    textTa: 'சுக்கிரனுக்குச் சூரியனால் வேதை இல்லை — புலிப்பாணி மட்டும். மற்ற நூல்களின் விலக்கு "தந்தை-மகன்" (சூரியன்-சனி, சந்திரன்-புதன்) மட்டுமே; பலதீபிகை ஸ்லோகம் 3-8 ஒவ்வொரு கிரகத்துக்கும் விலக்கைத் தனியாகச் சொல்கிறது — சுக்கிரனுக்கு (ஸ்லோ. 8) எதுவும் இல்லை.',
    byBook: { PULIPPANI: 'விலக்கு', SANTHANAM: '—', PHALADEEPIKA_SASTRI: '— (ஸ்லோ. 8)', PHALADEEPIKA_KAPOOR: '—', JATAKA_PARIJATA: '—', KALAPRAKASIKA: '—', SUDAMANI: '—', VISHNU_BHASKAR: '—' },
  },
  {
    id: 'VIPAREETA',
    textTa: 'விபரீத வேதை: புலிப்பாணி அட்டவணை தருகிறார் (குருவின் "S" = 8; சுக்கிரனின் இரண்டு இணைகள் சந்தானம், விஷ்ணு பாஸ்கர் போல); விஷ்ணு பாஸ்கர், சூடாமணி (செய். 343) அட்டவணையைத் திருப்பிப் படிக்கச் சொல்கின்றனர்; சந்தானம் திருப்பிய அட்டவணையுடன் "தீய இடங்களுக்கு மட்டும் வேதை" என்ற இரண்டாம் அட்டவணையும் தருகிறார்; காலப்பிரகாசிகை அட்டவணையின் தீய இடப் பகுதி அந்த இரண்டாம் அட்டவணையே (39-ல் 35 இடங்கள்).',
    byBook: { PULIPPANI: 'அட்டவணை', SANTHANAM: 'திருப்பல் + தீய இட அட்டவணை', PHALADEEPIKA_SASTRI: 'இல்லை (அத். 26)', PHALADEEPIKA_KAPOOR: 'இல்லை', VISHNU_BHASKAR: 'திருப்பல்', SUDAMANI: 'திருப்பல் (செய். 343)', KALAPRAKASIKA: 'தீய இட அட்டவணை (உரைநடை)', JATAKA_PARIJATA: 'காலப்பிரகாசிகை அட்டவணை மறுபதிப்பு' },
  },
  {
    id: 'BAD_PLACES',
    textTa: 'காலப்பிரகாசிகை அட்டவணையின் தீய இட நெடுவரிசைகள் = சந்தானத்தின் "தீய இடங்களுக்கு மட்டும் வேதை" (ப.151): சூரியன் 8/8, சந்திரன் 6/6, புதன் 6/6, சுக்கிரன் 3/3 இடங்களும் ஒன்றே; செவ்வாய் (= சனி) 9-ல் 7, குரு 7-ல் 5. வேறுபடும் நான்கு: செவ்வாய்/சனி 4-ல் காலப்பிரகாசிகை 3 / சந்தானம் 4, 12-ல் 11 / 12; குரு 8-ல் 7 / 8, 12-ல் 11 / 12 — சந்தானம் "அதே இடம்" (உடன் செல்லும் கிரகம்) தரும் இடங்களில் காலப்பிரகாசிகை அடுத்த இடத்தைத் தருகிறது.',
    byBook: { SANTHANAM: 'ப.151', KALAPRAKASIKA: 'ப.210 (39-ல் 35)', JATAKA_PARIJATA: 'ப.834 (காலப்பிரகாசிகை மறுபதிப்பு)' },
  },
  {
    id: 'SADE_SATI_COMPANION',
    planet: 'Saturn',
    textTa: 'ஏழரைச் சனியில் சனியுடன் வேறு கிரகம் செல்லும்போது: சந்தானம் (ப.152) — ஏழரையின் பலன் தடுக்கப்படும் (சூரியன், ராகு முதலியவை தவிர); புலிப்பாணி (ப.206) — குரு 3-ல் இல்லையெனில் வேகக் கிரகங்கள் சனியின் இடத்தைக் கடக்கும் காலம் "மேலும் துன்பம்". இரண்டும் நேர் எதிர்.',
    byBook: { SANTHANAM: 'தீமை தடுக்கப்படும்', PULIPPANI: 'துன்பம் கூடும்' },
  },
  {
    id: 'SANTHANAM_MARS_EXAMPLE',
    planet: 'Mars',
    textTa: 'சந்தானம் ப.148 உரையில் செவ்வாய்க்கு வேதை இடங்கள் "12, 2, 5" என்று அச்சாகியுள்ளது; அவரது அட்டவணைகள் (ப.147, 149) 12, 9, 5 — உரையில் 9-க்குப் பதில் 2 அச்சுப் பிழை போல். அட்டவணையே பின்பற்றப்படுகிறது.',
    byBook: { SANTHANAM: 'உரை 12, 2, 5; அட்டவணை 12, 9, 5' },
  },
  {
    id: 'NODE_VEDHA',
    planet: ['Rahu', 'Ketu'],
    textTa: 'ராகு, கேதுவின் வேதை இடங்கள்: புலிப்பாணி, விஷ்ணு பாஸ்கர் — சனியினுடையவை (3→12, 6→9, 11→5); பலதீபிகை — நல்ல இடங்களை மட்டும் "சூரியனைப் போல" என்கிறது, வேதை இடம் சொல்லவில்லை; சந்தானத்திடம் ராகு, கேது வரிசையே இல்லை.',
    byBook: { PULIPPANI: '3→12, 6→9, 11→5', PHALADEEPIKA_SASTRI: 'சொல்லவில்லை', PHALADEEPIKA_KAPOOR: 'சொல்லவில்லை', SANTHANAM: 'வரிசை இல்லை', VISHNU_BHASKAR: '3→12, 6→9, 11→5' },
  },
  {
    id: 'KAPOOR_OMISSIONS',
    textTa: 'கபூரின் பலதீபிகை மொழிபெயர்ப்பு (பக்.246-247) இரண்டு பட்டியல்களில் எண்களை விடுகிறது: புதனின் வேதை இடங்கள் ஆறு வீடுகளுக்கு ஐந்து மட்டும் ("1st" இல்லை); சுக்கிரனின் நல்ல இடங்கள் ஒன்பது வேதை இடங்களுக்கு ஏழு மட்டும் (1, 9 இல்லை — அவரது ஸ்லோகம் 2 இரண்டையும் சொல்கிறது). சாஸ்திரியின் பதிப்பிலிருந்து அவற்றைச் சேர்த்தால் இணைகள் ஒன்றே. லத்தையில் ராகுவுக்கு "8-வது" என்பதும் அவருடையதே.',
    byBook: { PHALADEEPIKA_KAPOOR: 'புதன் 5/6, சுக்கிரன் 7/9', PHALADEEPIKA_SASTRI: 'முழுமையாக' },
  },
  {
    id: 'MOON_COMMENTARY',
    planet: 'Moon',
    textTa: 'சூடாமணி உரை சந்திரனின் வேதை இடங்களை 8, 10, 3, 4, 12 என்று (ஐந்து மட்டும்) தருகிறது — செய்யுள் 342-ன் தொகுப்போ (5, 9, 12, 2, 4, 8) மற்ற நூல்களோ இதனுடன் பொருந்தவில்லை. செய்யுளே பின்பற்றப்படுகிறது; உரை பதிவாக மட்டும்.',
    byBook: { SUDAMANI: 'செய்யுள் 5, 9, 12, 2, 4, 8; உரை 8, 10, 3, 4, 12' },
  },
]);

/** Rahu and Ketu always stand opposite; whether they obstruct each other no book says. */
const NODE_PAIR_NOTE_TA = 'ராகுவும் கேதுவும் எப்போதும் எதிரெதிரே (7-ஆம் இடத்தில்) இருப்பவை. அவை ஒன்றுக்கொன்று வேதை செய்கின்றனவா என்று எந்த நூலும் சொல்லவில்லை; எண்ணினால் ராகுவின் 11-ஆம் இடம் எப்போதும் தடைபடும், 5-ஆம் இடம் எப்போதும் விடுபடும். அதனால் காட்டப்படுகிறது, மொத்தக் கணக்கில் இல்லை (எங்கள் வாசிப்பு).';

module.exports = {
  GOCHARA_VEDHA, GOCHARA_VEDHA_SOURCE, VIPAREETA_VEDHA, VIPAREETA_VEDHA_SOURCE,
  SATURN_VEDHA_TEXT, SATURN_VIPAREETA, SATURN_VEDHA,
  PLANETS_9, VB_GOCHARA_VEDHA, VB_VEDHA_SOURCE, FATHER_SON, FATHER_SON_SOURCES,
  VEDHA_METHODS, DEFAULT_VEDHA_METHOD, VEDHA_RANK, KALAPRAKASIKA_TABLE, KALAPRAKASIKA_1982_CELLS,
  KALAPRAKASIKA_SOURCES, SUDAMANI_SETS, SUDAMANI_VENUS, SUDAMANI_SOURCES, VEDHA_DIFFERENCES, NODE_PAIR_NOTE_TA,
  SANTHANAM_GOCHARA_VEDHA, SANTHANAM_BAD_PLACES, SANTHANAM_SOURCES,
  PHALADEEPIKA_GOCHARA_VEDHA, PHALADEEPIKA_KAPOOR_PRINTED, PHALADEEPIKA_SOURCES,
  reverseOnBadHouses,
};
