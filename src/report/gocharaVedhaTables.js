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
 *     (printed 6↔11 and 3↔12; the gochara table pairs 11↔3 and 12↔6).
 *
 * Sudamani verse 343 (printed p.149) states the same reversal in Tamil — "even
 * cruel planets give good" when the planets stand the other way round — and its
 * commentary says to read every planet's pairs that way. For Saturn that gives
 * the same three pairs as Pulippani from verse 342. The two differ on what
 * happens: Pulippani says Saturn's evil "will not be felt"; Sudamani says even a
 * cruel planet "gives good". Both are shown.
 *
 * This stage computes Saturn only. The other planets' rows are here because the
 * book prints them as one table and the reversal check needs all of it.
 */

const { SOURCES } = require('./saturnTransitTables');
const { SUDAMANI } = require('./saturnTransitTamil');

const { PULIPPANI, VISHNU_BHASKAR } = SOURCES;

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

module.exports = {
  GOCHARA_VEDHA, GOCHARA_VEDHA_SOURCE, VIPAREETA_VEDHA, VIPAREETA_VEDHA_SOURCE,
  SATURN_VEDHA_TEXT, SATURN_VIPAREETA, SATURN_VEDHA,
};
