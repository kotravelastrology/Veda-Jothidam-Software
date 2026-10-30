/**
 * Nakshatra gochara — what a planet's star, counted from the natal star, is
 * said to bring: the nine taras, Pulippani's good and bad stars for each
 * planet with his rules for combining them with the house from the Moon sign,
 * the limbs of the body (anga phala), and the weekday of the natal star.
 *
 * Four books give the anga table. Ramakrishna Bhat (897 words), Pulippani
 * (587, in two versions) and A.K. Gour (228) give one tradition — Bhat and
 * Gour agree row for row, Pulippani gives the same results per range except
 * for the Moon, under partly different limbs. Sudamani (254 Tamil words) gives
 * another, in verse, for Saturn, the Sun, Mars, and Mercury-Jupiter-Venus;
 * Pulippani renders it in English and departs from the Tamil in places, so the
 * Sudamani columns here are read from the Tamil verses themselves.
 *
 * Mantreswara's Phaladeepika XXVI.35-40 is the source of the first
 * tradition and was added on 2026-10-08 (Sastri's translation, 364 words): its
 * ranges and limbs are Bhat's, and its verses decide the rows where Pulippani
 * departs from Bhat and Gour (the Moon's 16th-27th stars, Mars's chest and
 * hands, Saturn's hands and feet) — against Pulippani.
 *
 * Bhat explains anga most and is shown first. The taras, the per-planet star
 * lists, the combination rules and the weekday rule are Pulippani's alone
 * (703 words on stellar occupation), with Bhat's tara names beside his.
 */

const { SOURCES: { PULIPPANI } } = require('./saturnTransitTables');
const { SUDAMANI } = require('./saturnTransitTamil');
const { BHAT, GOUR } = require('./saptashalakaTables');
const { PHALADEEPIKA_SASTRI, PHALADEEPIKA_KAPOOR } = require('./classicSources');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

// ---------------------------------------------------------------------------
// Taras
// ---------------------------------------------------------------------------

/** Pulippani p.212: the nine taras and their results; Bhat p.251: his names and meanings. */
const TARAS = deepFreeze([
  { n: 1, pulippaniTa: 'ஜன்ம', pulippaniResultTa: 'நடுத்தரம்', bhatTa: 'ஜன்ம', bhatMeaningTa: '—' },
  { n: 2, pulippaniTa: 'சம்பத்', pulippaniResultTa: 'மிக நல்லது', bhatTa: 'சம்பத்', bhatMeaningTa: 'செல்வம்' },
  { n: 3, pulippaniTa: 'விபத்', pulippaniResultTa: 'தீயது', bhatTa: 'விபத்', bhatMeaningTa: 'ஆபத்து' },
  { n: 4, pulippaniTa: 'க்ஷேம', pulippaniResultTa: 'நல்லது', bhatTa: 'க்ஷேம', bhatMeaningTa: 'மகிழ்ச்சி' },
  { n: 5, pulippaniTa: 'ப்ரத்யக்', pulippaniResultTa: 'தீயது', bhatTa: 'ப்ரத்யக்', bhatMeaningTa: 'தடை' },
  { n: 6, pulippaniTa: 'தெய்வானுகூல', pulippaniResultTa: 'நல்லது', bhatTa: 'சாதன', bhatMeaningTa: 'சாதனை' },
  { n: 7, pulippaniTa: 'வத', pulippaniResultTa: 'தீயது', bhatTa: 'நிதன', bhatMeaningTa: 'மரணம்' },
  { n: 8, pulippaniTa: 'மைத்ர', pulippaniResultTa: 'நல்லது', bhatTa: 'மைத்ர', bhatMeaningTa: 'நட்பு' },
  { n: 9, pulippaniTa: 'பரம மைத்ர', pulippaniResultTa: 'மிதமானது', bhatTa: 'பரம மைத்ர', bhatMeaningTa: 'மிகுந்த நட்பு' },
]);
const TARA_SOURCES = Object.freeze([
  Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed pp.212-213 (PDF 205-206): the nine Taras with "Result" (Janma Medium, Sampath Very Good, Vipath Bad, Kshema Good, Prathyak Bad, Deivanukula Good, Vadha Bad, Maithra Good, Parama Maitra Moderate) and Table 15' }),
  Object.freeze({ ...BHAT, pageLocus: 'Chapter XXI, printed p.251 (PDF 269): "the second one ... is Sampat or wealth, the 3rd is Vipat or danger, the 4th is Ksema or happiness, the 5th one is Pratyak ... or obstruction, the 6th one is Sadhana or achievement, the 7th one is Nidhana or death, the 8th is Maitra or friendly, the 9th is Parama maitra or very friendly"' }),
]);

// ---------------------------------------------------------------------------
// Pulippani's good and bad stars for each planet (Table 16)
// ---------------------------------------------------------------------------

const PULIPPANI_STAR_CLASS = deepFreeze({
  Sun: { good: [2, 4, 8, 9, 11, 13, 24], bad: [1, 14, 16, 19, 23] },
  Moon: { good: [4, 6, 8, 9, 11, 13, 16, 26, 27], bad: [1, 3, 5, 7, 12, 14, 19] },
  Mars: { good: [9, 11, 17, 22, 24], bad: [1, 3, 5, 7, 12, 14, 19, 21] },
  Mercury: { good: [4, 6, 13, 15, 17, 20, 22, 24, 26, 27], bad: [] },
  Jupiter: { good: [1, 3, 7, 10, 12, 19], bad: [] },
  Venus: { good: [1, 3, 7, 10, 12, 19], bad: [] },
  Saturn: { good: [2, 4, 6, 8, 13, 15, 17, 18, 20], bad: [] },
  Rahu: { good: [22, 24], bad: [1, 7, 10, 27] },
  Ketu: { good: [22, 24], bad: [1, 7, 10, 27] },
});
const STAR_CLASS_SOURCE = Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed p.213 (PDF 206), Table-16: "If the planet occupies the stars mentioned below from Janma Tara the result will be as follows", Remarks: "No results in remaining stars"' });

/**
 * Pulippani pp.213-214: the star's class combined with the house from the
 * Moon sign. Benefics: Venus, Jupiter, the waxing Moon, Mercury joined or
 * aspected by benefics; malefics: the Sun, the waning Moon, Mercury joined or
 * aspected by malefics, Mars, Saturn, Rahu, Ketu.
 */
const COMBINATION = deepFreeze({
  rules: [
    { id: 'BENEFIC_TRIKONA', nature: 'BENEFIC', houses: [5, 9], star: 'GOOD', textTa: 'மிகுந்த நற்பலன்' },
    { id: 'BENEFIC_KENDRA', nature: 'BENEFIC', houses: [1, 4, 7, 10], star: 'GOOD', textTa: 'மிதமான நற்பலன்' },
    { id: 'BENEFIC_ELSEWHERE', nature: 'BENEFIC', houses: [2, 3, 6, 8, 11, 12], star: 'GOOD', textTa: 'நடுநிலை — நற்பலன் இல்லை' },
    { id: 'MALEFIC_DUSTHANA', nature: 'MALEFIC', houses: [8, 12], star: 'BAD', textTa: 'வழக்கமான தீய பலன் தீவிரமாகும்' },
    { id: 'MALEFIC_TRIKONA_BAD', nature: 'MALEFIC', houses: [5, 9], star: 'BAD', textTa: 'நடுநிலை' },
    { id: 'MALEFIC_TRIKONA_GOOD', nature: 'MALEFIC', houses: [5, 9], star: 'GOOD', textTa: 'தீய பலன் குறையும் — கிட்டத்தட்ட தீமை இல்லை' },
  ],
  source: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed pp.213-214 (PDF 206-207): "The benefic planets (Venus, Jupiter and waxing Moon, Mercury if joined or aspected by the benefics) when passing through trikonas (5 and 9) from Janma Rasi and also posited in benefic stars stated above will give very much benefic results"' }),
  readingTa: 'கடைசி இரண்டு விதிகள் "planets" என்று பொதுவாகச் சொல்கின்றன; முதல் விதியுடன் முரண்படாமல் இருக்க பாபக் கிரகங்களுக்கு என்று எடுத்தோம். புதனின் தன்மை: அதே ராசியில் சுபர் (குரு, சுக்கிரன்) மட்டும் இருந்தால் சுபர், பாபர் (சூரியன், செவ்வாய், சனி, ராகு, கேது) மட்டும் இருந்தால் பாபர், இல்லையெனில் தீர்மானிக்கவில்லை — பார்வை கணக்கில் இல்லை (எங்கள் வாசிப்பு). சந்திரன்: வளர்பிறை சுபர், தேய்பிறை பாபர்.',
  alsoTa: 'புலிப்பாணி இன்னொரு வழியும் சொல்கிறார்: வழக்கமாக நல்ல பலன் தர வேண்டிய கிரகம் ஜன்ம, விபத், ப்ரத்யக், வத தாரைகளில் சென்றால் தீமை மிதமாக இருக்கும்; விபத், ப்ரத்யக், வத தாரைகளில் தீமை கூடிக்கொண்டே போகும்; க்ஷேம, சம்பத், தெய்வானுகூல, மைத்ர, பரம மைத்ர தாரைகளில் நன்மை மேலும் மேலும் கூடும் (ப.214).',
});

// ---------------------------------------------------------------------------
// Anga phala — four books
// ---------------------------------------------------------------------------

/** [from, to, limbTa, resultTa], counted from the natal star (1 = the natal star). */
const r = (from, to, limbTa, resultTa) => [from, to, limbTa, resultTa];
const BHAT_SATURN = [r(1, 1, 'முகம்', 'துக்கம்'), r(2, 5, 'வலக்கை', 'மகிழ்ச்சி'), r(6, 8, 'வலப் பாதம்', 'பயணம்'), r(9, 11, 'இடப் பாதம்', 'இழப்பு அல்லது அழிவு'), r(12, 15, 'இடக்கை', 'லாபம்'), r(16, 20, 'வயிறு', 'இன்பங்கள்'), r(21, 23, 'தலை', 'மகிழ்ச்சி'), r(24, 25, 'கண்கள்', 'மகிழ்ச்சி'), r(26, 27, 'முதுகு', 'மரணம்')];
const BHAT_MJV = [r(1, 3, 'தலை', 'துக்கம்'), r(4, 6, 'முகம்', 'லாபம்'), r(7, 12, 'கைகள்', 'பேரிடர்'), r(13, 17, 'வயிறு', 'மிகுந்த செல்வம்'), r(18, 19, 'மறைவிடம்', 'இழப்பு அல்லது அழிவு'), r(20, 27, 'பாதங்கள்', 'புகழ், பதவி')];

const ANGA = deepFreeze({
  BHAT: {
    bookTa: 'பட் (ஜோதிட அடிப்படைகள்)',
    rows: {
      Sun: [r(1, 1, 'முகம்', 'அழிவு'), r(2, 5, 'தலை', 'பெரும் செழிப்பு'), r(6, 9, 'மார்பு', 'வெற்றி'), r(10, 13, 'வலக்கை', 'செல்வம்'), r(14, 19, 'பாதங்கள்', 'வறுமை'), r(20, 23, 'இடக்கை', 'உடல் நோய்கள்'), r(24, 25, 'கண்கள்', 'லாபம்'), r(26, 27, 'மறைவிடம்', 'உயிருக்கு ஆபத்து')],
      Moon: [r(1, 2, 'முகம்', 'பெரும் அச்சம்'), r(3, 6, 'தலை', 'மகிழ்ச்சி'), r(7, 8, 'முதுகு', 'பகைவர் மீது வெற்றி'), r(9, 10, 'கண்கள்', 'பண லாபம்'), r(11, 15, 'இதயம்', 'மகிழ்ச்சி'), r(16, 18, 'இடக்கை', 'பகைமை'), r(19, 24, 'பாதங்கள்', 'வெளிநாடு செல்லுதல்'), r(25, 27, 'வலக்கை', 'பண லாபம்')],
      Mars: [r(1, 2, 'முகம்', 'மரணம்'), r(3, 8, 'பாதங்கள்', 'சண்டை'), r(9, 11, 'மார்பு', 'வெற்றி'), r(12, 15, 'இடக்கை', 'வறுமை'), r(16, 17, 'தலை', 'லாபம்'), r(18, 21, 'முகம்', 'மிகுந்த அச்சம்'), r(22, 25, 'வலக்கை', 'மகிழ்ச்சி'), r(26, 27, 'கண்கள்', 'வீட்டை விட்டுச் செல்லுதல்')],
      Mercury: BHAT_MJV, Jupiter: BHAT_MJV, Venus: BHAT_MJV,
      Saturn: BHAT_SATURN, Rahu: BHAT_SATURN, Ketu: BHAT_SATURN,
    },
    source: Object.freeze({ ...BHAT, pageLocus: 'Chapter XXI, printed pp.254-255 (PDF 272-273): "I am tabulating below for your convenience the stars constituting the limbs and their effects in the case of the Sun and other planets separately"' }),
  },
  PULIPPANI: {
    bookTa: 'புலிப்பாணி ("பண்டைய மரபு")',
    rows: {
      Sun: [r(1, 1, 'முகம் (வாய்)', 'அழிவு'), r(2, 5, 'தலை', 'செழிப்பு'), r(6, 9, 'மார்பு', 'வெற்றி'), r(10, 13, 'வலக்கை', 'செல்வம்'), r(14, 19, 'இரு கால்கள்', 'வறுமை'), r(20, 23, 'இடக்கை', 'உடல் தொல்லை, நோய்'), r(24, 25, 'கண்கள்', 'லாபம்'), r(26, 27, 'குதம்', 'உடல் அழிவு (தீராத நோய்)')],
      Moon: [r(1, 2, 'முகம்', 'பெரும் அச்சம்'), r(3, 6, 'தலை', 'சுகம்'), r(7, 8, 'முதுகு', 'பகைவர் மீது வெற்றி'), r(9, 10, 'கண்கள்', 'பண லாபம்'), r(11, 15, 'மார்பு', 'மகிழ்ச்சி'), r(16, 17, 'வலக்கை', 'பகைமை'), r(18, 24, 'கால்கள்', 'சொந்த வீட்டில் வாழ்தல்'), r(24, 27, 'இடக்கை', 'பண லாபம்')],
      Mars: [r(1, 2, 'முகம் (வாய்)', 'மரணம் அல்லது மரணச் செய்தி'), r(3, 8, 'கால்', 'பகைமை, மோதல்'), r(9, 11, 'கழுத்து', 'வெற்றி'), r(12, 15, 'வலக்கை', 'பண இழப்பு'), r(16, 17, 'தலை', 'லாபம்'), r(18, 21, 'முகம்', 'பெரும் அச்சம்'), r(22, 25, 'இடக்கை', 'சுகம்'), r(26, 27, 'கண்கள்', 'பயணம்')],
      ...Object.fromEntries(['Mercury', 'Jupiter', 'Venus'].map((p) => [p, [r(1, 3, 'தலை', 'துக்கம்'), r(4, 6, 'முகம் (வாய்)', 'லாபம்'), r(7, 12, 'கைகள்', 'திடீர் தீய நிகழ்வுகள்'), r(13, 17, 'வயிறு', 'பண லாபம்'), r(18, 19, 'குதம்', 'இழப்பு'), r(20, 27, 'கால்', 'மதிப்பு')]])),
      ...Object.fromEntries(['Saturn', 'Rahu', 'Ketu'].map((p) => [p, [r(1, 1, 'முகம் (வாய்)', 'துக்கம்'), r(2, 5, 'வலக்கை', 'மகிழ்ச்சி'), r(6, 8, 'இடக்கை', 'பயணம்'), r(9, 11, 'வலக் கால்', 'இழப்பு'), r(12, 15, 'இடக் கால்', 'லாபம்'), r(16, 20, 'வயிறு', 'பலவகை இன்பங்கள்'), r(21, 23, 'தலை', 'மகிழ்ச்சி'), r(24, 25, 'கண்', 'சுகம்'), r(25, 27, 'முதுகு', 'மரணம்')]])),
    },
    source: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24 "II. Nakshatra anga phala", printed pp.214-216 (PDF 207-209): "These stars have been assigned various limbs of the body of a native and planets is imagined to be passing through those limbs"' }),
  },
  SUDAMANI: {
    bookTa: 'சூடாமணி (செய்யுள் 344-347, தமிழ் மூலம்)',
    rows: {
      Saturn: [r(1, 1, 'வாய்', 'தீமை'), r(2, 5, 'வலக்கை', 'இனிமை'), r(6, 11, 'கால்', 'யாத்திரை'), r(12, 15, 'இடக்கை', 'காரிய சேதம்'), r(16, 20, 'வயிறு', 'நல்ல ஊண்'), r(21, 22, 'கண்', 'அர்த்த லாபம்'), r(23, 24, 'புயம்', 'வியாதி'), r(25, 27, 'தலை', 'அபிஷேகம் (முடி கவிழ்க்கும்)')],
      Sun: [r(1, 3, 'தலை', 'அரசு (இராச்சியம்)'), r(4, 6, 'வாய்', 'கல்வி (வித்தை)'), r(7, 11, 'வயிறு', 'விருந்தோடு உண்ணுதல்'), r(12, 19, 'கை', 'செம்பொன் தேடும் (அர்த்த லாபம்)'), r(20, 27, 'கால்', 'யாத்திரை')],
      Mars: [r(1, 3, 'வாய்', 'துக்கம்'), r(4, 5, 'வலக் கண்', 'இன்பம் (இலாபம்)'), r(6, 7, 'இடக் கண்', 'அழிவு'), r(8, 10, 'கழுத்து', 'மேம்பாடு'), r(11, 13, 'கை', 'மேம்பாடு'), r(14, 16, 'இடக்கை', 'துயர்'), r(17, 17, 'வலப்பக்கம்', 'நலம்'), r(18, 18, 'இடப்பக்கம்', 'அழிவு'), r(19, 23, 'வயிறு', 'ஊண்'), r(24, 25, 'வலக் கால்', 'நலம்'), r(26, 27, 'இடக் கால்', 'யாத்திரை')],
      ...Object.fromEntries(['Mercury', 'Jupiter', 'Venus'].map((p) => [p, [r(1, 3, 'தலை', 'சேதம் (அழிவு)'), r(4, 6, 'கழுத்து', 'செல்வம்'), r(7, 9, 'வலக்கை', 'நன்மை'), r(10, 12, 'இடக்கை', 'துக்கம்'), r(13, 17, 'வயிறு', 'ஆக்கம்'), r(18, 19, 'அரை', 'அழிவு'), r(20, 27, 'பாதம்', 'நலம் (உரை: ஸ்திரி)')]])),
    },
    source: Object.freeze({ ...SUDAMANI, pageLocus: 'அங்க சனி, அங்க சூரியன் (செய். 345), அங்கச் செவ்வாய், அங்க புதன் வியாழன் வெள்ளி (செய். 347), அச்சுப் பக்கம் 150-151 (ஸ்கேன் 175-176); செவ்வாய், சனி செய்யுள்களுக்கு எண் அச்சாகவில்லை' }),
  },
  PHALADEEPIKA: {
    bookTa: 'பலதீபிகை (மந்த்ரேஸ்வரர் 26.35-40 — சாஸ்திரி)',
    rows: {
      Sun: [r(1, 1, 'முகம்', 'அழிவு'), r(2, 5, 'தலை', 'செல்வ வரவு'), r(6, 9, 'மார்பு', 'வெற்றி'), r(10, 13, 'வலக்கை', 'பண லாபம்'), r(14, 19, 'இரு பாதங்கள்', 'பண இழப்பு'), r(20, 23, 'இடக்கை', 'உடல் நோய்'), r(24, 25, 'இரு கண்கள்', 'லாபம்'), r(26, 27, 'பிறப்புறுப்பு', 'உயிருக்கு ஆபத்து')],
      Moon: [r(1, 2, 'முகம்', 'மிகுந்த அச்சம்'), r(3, 6, 'தலை', 'பாதுகாப்பு'), r(7, 8, 'முதுகு', 'பகைவரை அடக்குதல்'), r(9, 10, 'இரு கண்கள்', 'பண லாபம்'), r(11, 15, 'மார்பு', 'மன மகிழ்ச்சி'), r(16, 18, 'இடக்கை', 'சண்டை'), r(19, 24, 'இரு பாதங்கள்', 'வெளிநாடு செல்லுதல்'), r(25, 27, 'வலக்கை', 'பண லாபம்')],
      Mars: [r(1, 2, 'முகம்', 'மரணம் (உயிருக்கு ஆபத்து)'), r(3, 8, 'இரு பாதங்கள்', 'சண்டை'), r(9, 11, 'மார்பு', 'வெற்றி'), r(12, 15, 'இடக்கை', 'வறுமை'), r(16, 17, 'தலை', 'லாபம்'), r(18, 21, 'முகம்', 'மிகுந்த அச்சம்'), r(22, 25, 'வலக்கை', 'மகிழ்ச்சி'), r(26, 27, 'இரு கண்கள்', 'வெளிநாடு செல்லுதல்')],
      ...Object.fromEntries(['Mercury', 'Jupiter', 'Venus'].map((p) => [p, [r(1, 3, 'தலை', 'துக்கம்'), r(4, 6, 'முகம்', 'லாபம்'), r(7, 12, 'இரு கைகள்', 'தீய நிகழ்வு ("अनर्थ")'), r(13, 17, 'வயிறு', 'மிகுந்த பண வரவு'), r(18, 19, 'பிறப்புறுப்பு', 'இழப்பு'), r(20, 27, 'இரு பாதங்கள்', 'மதிப்பு, புகழ்')]])),
      ...Object.fromEntries(['Saturn', 'Rahu', 'Ketu'].map((p) => [p, [r(1, 1, 'முகம்', 'துக்கம்'), r(2, 5, 'வலக்கை', 'மகிழ்ச்சி'), r(6, 8, 'வலக் கால்', 'பயணம்'), r(9, 11, 'இடக் கால்', 'இழப்பு'), r(12, 15, 'இடக்கை', 'லாபம்'), r(16, 20, 'வயிறு', 'தாம்பத்திய இன்பம்'), r(21, 23, 'தலை', 'மகிழ்ச்சி'), r(24, 25, 'கண்கள்', 'மகிழ்ச்சி'), r(26, 27, 'முதுகு', 'உயிருக்கு ஆபத்து')]])),
    },
    source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, slokas 35-40, printed pp.300-303 (PDF 335-338): "In the following six slokas, the author describes how the 27 stars (reckoned from the Janmanakshatra) are distributed among the several limbs of the native concerned during transits of each of the planets from the Sun onwards"; sloka 40 "मन्दस्यैवं तमःखेचरयोर्वदन्तु" (the same for Saturn and the nodes)' }),
  },
  GOUR: {
    bookTa: 'கௌர்',
    rows: {
      Sun: [r(1, 1, 'முகம்', 'அழிவு'), r(2, 5, 'தலை', 'செல்வ வரவு'), r(6, 9, 'மார்பு', 'வெற்றி'), r(10, 13, 'வலக்கை', 'பண லாபம்'), r(14, 19, 'இரு பாதங்கள்', 'இழப்பு'), r(20, 23, 'இடக்கை', 'நோய்'), r(24, 25, 'இரு கண்கள்', 'லாபம்'), r(26, 27, 'மறைவிடம்', 'ஆபத்து')],
      Moon: [r(1, 2, 'முகம்', 'அச்சம்'), r(3, 6, 'தலை', 'பாதுகாப்பு'), r(7, 8, 'முதுகு', 'பகைவரை அடக்குதல்'), r(9, 10, 'இரு கண்கள்', 'பண லாபம்'), r(11, 15, 'மார்பு', 'மன மகிழ்ச்சி'), r(16, 18, 'இடக்கை', 'சண்டைகள்'), r(19, 24, 'இரு பாதங்கள்', 'வெளிநாட்டுப் பயணம்'), r(25, 27, 'வலக்கை', 'பண லாபம்')],
      Mars: [r(1, 2, 'முகம்', 'மரணம்'), r(3, 8, 'இரு பாதங்கள்', 'சண்டைகள்'), r(9, 11, 'மார்பு', 'வெற்றி'), r(12, 15, 'இடக்கை', 'வறுமை'), r(16, 17, 'தலை', 'லாபம்'), r(18, 21, 'முகம்', 'அச்சம்'), r(22, 25, 'வலக்கை', 'மகிழ்ச்சி'), r(26, 27, 'இரு கண்கள்', 'வெளிநாட்டுப் பயணம்')],
      ...Object.fromEntries(['Mercury', 'Jupiter', 'Venus'].map((p) => [p, [r(1, 3, 'தலை', 'துக்கம்'), r(4, 6, 'முகம்', 'லாபம்'), r(7, 12, 'இரு கைகள்', 'எதிர்பாராத நிகழ்வுகள்'), r(13, 17, 'வயிறு', 'செல்வ வரவு'), r(18, 19, 'மறைவிடம்', 'இழப்பு'), r(20, 27, 'இரு பாதங்கள்', 'மகிழ்ச்சி, லாபம்')]])),
      ...Object.fromEntries(['Saturn', 'Rahu', 'Ketu'].map((p) => [p, [r(1, 1, 'முகம்', 'துக்கம்'), r(2, 5, 'வலக்கை', 'மகிழ்ச்சி'), r(6, 8, 'வலக் கால்', 'பயணம்'), r(12, 15, 'இடக்கை', 'லாபம்'), r(16, 20, 'வயிறு', 'தாம்பத்திய இன்பம்'), r(21, 23, 'தலை', 'மகிழ்ச்சி'), r(24, 25, 'இரு கண்கள்', 'மகிழ்ச்சி'), r(26, 27, 'முதுகு', 'உயிருக்கு ஆபத்து')]])),
    },
    source: Object.freeze({ ...GOUR, pageLocus: 'Chapter VIII "Anga-Graha", printed pp.93-95 (PDF 96-98): "Transit of planets on the Nakshatras placed on various parts of the body"' }),
  },
});
const ANGA_RANK = deepFreeze({
  order: ['BHAT', 'PULIPPANI', 'PHALADEEPIKA', 'SUDAMANI', 'GOUR'],
  words: { BHAT: 897, PULIPPANI: 587, PHALADEEPIKA: 364, SUDAMANI: 254, GOUR: 228 },
  measureTa: 'அங்க பலன் பகுதியின் சொற்கள்: பட் (பக்.253-255) 897; புலிப்பாணி (பக்.214-218, இரு பதிப்புகளும்) 587; பலதீபிகை 26.35-40, சாஸ்திரி மொழிபெயர்ப்பு (பக்.300-303) 364 — மூல ஸ்லோகம்; சூடாமணி செய்யுள் 344-347 உரையுடன் 254 (தமிழ்ச் சொற்கள்); கௌர் (பக்.93-95) 228.',
});

/** Where the anga tables differ, and print slips. */
const ANGA_DIFFERENCES = deepFreeze([
  { id: 'MOON_FEET', textTa: 'சந்திரன்: பட், கௌர், பலதீபிகை — 16-18 இடக்கை (பகைமை), 19-24 பாதங்கள் "வெளிநாடு செல்லுதல்", 25-27 வலக்கை (பண லாபம்); புலிப்பாணி — 16-17 வலக்கை (பகைமை), 18-24 கால்கள் "சொந்த வீட்டில் வாழ்தல்", 24-27 இடக்கை (பண லாபம்). 19-24-க்கு இரண்டும் எதிர்ப் பொருள். பலதீபிகை ஸ்லோகம் 36 இதைத் தீர்க்கிறது: "त्रिषु करे वामे विरोधं" (இடக்கை 3), "पादौ षट्सु विदेशतां" (பாதம் 6 — வெளிநாட்டு வாசம்), "त्रिष्वर्थलाभं करे" (கை 3) — புலிப்பாணிக்கு எதிராக.' },
  { id: 'LIMBS', textTa: 'மற்ற கிரகங்களில் ஒவ்வொரு வரம்புக்கும் பலன் ஒன்றே; உறுப்புகள் மட்டும் மாறுகின்றன — செவ்வாய் 9-11: பட் மார்பு / புலிப்பாணி கழுத்து; செவ்வாய் 12-15, 22-25 கைகள் இடம்-வலம் மாறியுள்ளன; சனி 6-8, 9-11, 12-15 உறுப்புகள் மாறியுள்ளன. பலதீபிகை ஸ்லோகங்கள்: செவ்வாய் (37) — 9-11 "क्रोड" (மார்பு), 12-15 "वामे करे" (இடக்கை), 22-25 "करे दक्षिणे" (வலக்கை) — பட்டுடன்; சனி (39) — "वक्त्र, कर, पाद, पद, हस्त" — 2-5 கை, 6-8 கால், 9-11 கால், 12-15 கை, இடம்-வலம் சொல்லாமல்; சாஸ்திரியும் பட்டும் வலம்-இடம் சேர்க்கிறார்கள்; புலிப்பாணியின் 6-8 கை, 12-15 கால் ஸ்லோகத்துடன் பொருந்தவில்லை.' },
  { id: 'PHALADEEPIKA_SOURCE', textTa: 'பட், கௌர் அட்டவணைகளின் வரம்புகளும் உறுப்புகளும் பலதீபிகை 26.35-40-னுடையவையே; கௌரின் சொற்கள் ("Influx of wealth", "Subduing enemies", "Penury") சாஸ்திரியின் மொழிபெயர்ப்புச் சொற்கள். ஸ்லோகம் 40 சனியின் அட்டவணையை ராகு, கேதுவுக்கும் தருகிறது ("मन्दस्यैवं तमःखेचरयोः").' },
  { id: 'KAPOOR_MJV', textTa: 'புதன்-குரு-சுக்கிரன் 7-12 (இரு கைகள்): சாஸ்திரி "something untoward", பட் "disaster", கௌர் "untoward happenings" — ஸ்லோகம் 38 "अनर्थ"; கபூரின் மொழிபெயர்ப்பு மட்டும் "success" — ஸ்லோகத்துடன் பொருந்தவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, sloka 38, e-text p.255: "(c) 7th. 8th. 9th, 10th, 11th, 12th - two hands success"' }) },
  { id: 'PULIPPANI_SLIPS', textTa: 'புலிப்பாணியின் அச்சு: சந்திரனில் 24 இரு வரம்புகளிலும் (18-24, 24-27); புதன்-குரு-சுக்கிரனில் "20th, 27th" (20 முதல் 27 என்று படித்தோம்); சனி-ராகு-கேதுவில் 25 இரு வரம்புகளிலும் (24-25, 25-27). இரண்டு வரம்பிலும் உள்ள நட்சத்திரத்துக்கு இரண்டும் காட்டப்படும்.' },
  { id: 'GOUR_OMISSION', textTa: 'கௌர் சனி-ராகு-கேது அட்டவணையில் 9-11 வரி இல்லை (6-8-க்குப் பின் நேரடியாக 12-15) — அச்சில் விடுபட்டது போல.' },
  { id: 'SUDAMANI_SUN', textTa: 'சூடாமணி சூரியன் (செய். 345): தலை 3 அரசு, வாய் 3 கல்வி, வயிறு 5 விருந்துண்ணல், கை 8 செம்பொன், கால் 8 யாத்திரை. புலிப்பாணியின் ஆங்கில மொழிபெயர்ப்பு பலன்களை ஒரு இடம் தள்ளித் தருகிறது (தலை "அரசு வேலை, கல்வி", வாய் "இனிய உணவு", வயிறு "நல்ல சம்பாத்தியம்", கால் "நல்ல அந்தஸ்து") — தமிழ் மூலம் பின்பற்றப்படுகிறது.' },
  { id: 'SUDAMANI_MARS_SIDE', textTa: 'சூடாமணி செவ்வாய்: "வலப்பால் ஒன்று நலம், இடம் என்று அழிவு" — புலிப்பாணி இரண்டையும் "தீயது" என்கிறார். உரை வலக்கை மூன்றை விட்டுவிடுகிறது; செய்யுளில் "கைமூன்று மேம்பாடு" உண்டு.' },
  { id: 'SUDAMANI_SATURN', textTa: 'சூடாமணியின் செய்யுள் சனியை ("காரி") மட்டும் சொல்கிறது; புலிப்பாணி அதை ராகு, கேதுவுக்கும் தருகிறார். இங்கே சூடாமணி நெடுவரிசை சனிக்கு மட்டும். சந்திரனுக்குச் சூடாமணியில் அங்கச் செய்யுள் இல்லை.' },
  { id: 'SUDAMANI_FEET', textTa: 'சூடாமணி புதன்-குரு-வெள்ளி: பாதம் 8 — செய்யுள் "நலம் உண்டாம்", உரை "திரி (ஸ்திரி) உண்டாம்".' },
]);

/** Pulippani p.218: the weekday on which the natal star falls, and the month's result. */
const WEEKDAY = deepFreeze({
  results: ['பயணம்', 'நல்லது, வேளைக்கு இனிய உணவு', 'சோம்பல்; நெருப்பு, மின்சாரத்தால் விபத்து நேரலாம்', 'தேர்வில் அச்சம், குழப்பம்', 'வேளைக்கு இனிய உணவு, சுகம், மகிழ்ச்சி, சுதந்திரம்', 'மகிழ்ச்சி, சுதந்திரம்', 'மாதத்தில் சில தொல்லைகள்'],
  source: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 24, printed p.218 (PDF 211): "Find out in what week day your janma nakshatra falls. According to that the results of the month will either be good or bad"' }),
  readingTa: '"ஜன்ம நட்சத்திரம் விழும் கிழமை" — பிறந்த ஊரின் சூரிய உதயத்தில் ஜன்ம நட்சத்திரம் நடக்கும் நாள் (பஞ்சாங்க வழக்கு) என்று எடுத்தோம்; நூல் விளக்கவில்லை.',
});
const WEEKDAY_TA = Object.freeze(['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி']);

const COMBINED_TA = 'புலிப்பாணி (ப.218): வழக்கமான கோசாரப் பலனும் அங்க பலனும் இரண்டும் நல்லதெனில் மிக நல்ல காலம்; ஒன்று நல்லது ஒன்று தீயது எனில் மிதமானது; இரண்டும் தீயதெனில் மிகத் தீயது.';

module.exports = {
  TARAS, TARA_SOURCES, PULIPPANI_STAR_CLASS, STAR_CLASS_SOURCE, COMBINATION,
  ANGA, ANGA_RANK, ANGA_DIFFERENCES, WEEKDAY, WEEKDAY_TA, COMBINED_TA,
};
