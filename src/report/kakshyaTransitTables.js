/**
 * Kakshya in every planet's transit — what C.S. Patel and Subramania Aiyar's *Ashtakavarga* (chapter V) says.
 *
 * Each planet in transit passes through the eight Kakshyas of every bhava; a Kakshya "has a bindu" when its
 * lord gave a bindu in that bhava in the *planet's own* Prastarashtakavarga. Saturn's page
 * (`saturnAshtakavarga.js`) already reads this for Saturn; this is the same reading for the seven planets
 * together, with Patel's rule for what several planets in bindu (or void) Kakshyas at once bring.
 * Doctrine here; the computation is `kakshyaTransit.js`. The Kakshya lords' order and the two ways of cutting the
 * zodiac are `saturnAshtakavargaTables.js` (KAKSHYA_METHODS), not repeated.
 */

const { PATEL, KAKSHYA_LORDS, KAKSHYA_METHODS, DEFAULT_KAKSHYA_METHOD } = require('./saturnAshtakavargaTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const PLANET_TA = Object.freeze({ Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Lagna: 'லக்னம்' });

/** Patel p.71 (PDF 106): "Average time taken by planets to transit a Kakshya of 3°45′" — in days. */
const AVERAGE_DAYS = deepFreeze({ Sun: 3.75, Moon: 6.75 / 24, Mars: 5, Mercury: 2.5, Jupiter: 45, Venus: 3, Saturn: 112.5 });
const AVERAGE_TA = deepFreeze({
  Sun: '3¾ நாள்', Moon: '6¾ மணி', Mars: '5 நாள்', Mercury: '2½ நாள்', Jupiter: '1½ மாதம்', Venus: '3 நாள்', Saturn: '3¾ மாதம்',
});

const SOURCES = deepFreeze({
  AVERAGE: { ...PATEL, pageLocus: 'Chapter V, printed p.71 (PDF 106): "Average time taken by planets to transit a Kakshya of 3°-45′ — the Sun 3¾ days; the Moon 6¾ hrs.; Jupiter 1½ months; Venus 3 days; Mars 5 days; Mercury 2½ days; Saturn 3¾ months; Rahu (Ketu) 2¼ months"' },
  SLOKA_5: { ...PATEL, pageLocus: 'Chapter V sloka 5, printed p.71 (PDF 106): "When a planet passes through a Kakshya which has a bindu in his ashtakavarga (in any bhava) he produces beneficial effects: if he is passing through a Kakshya void of a bindu, there is no benefit. But, if at the time of passing through a Kakshya having a bindu, the planet is in his debilitation, inimical house or in combust, he causes great sorrow"' },
  SLOKAS_6_10: { ...PATEL, pageLocus: 'Chapter V slokas 6-10, printed p.72 (PDF 107): "When any four planets in transit occupy Kakshyas having bindus there is acquisition of wealth; with any 5 planets honour, good health and gain of apparels; with any 6 planets coronation and with 7 planets ... acquisition of kingdom. Similarly, when any four planets ... occupy Kakshyas having no bindus there is loss of wealth; with any 5 planets sickness; with any 6 planets all sorts of misfortunes and with 7 planets possible death. Death is a certainty if ... one of the planets occupies a bhava which in his Ashtakavarga contains no bindu at all"' },
  SLOKA_11: { ...PATEL, pageLocus: 'Chapter V sloka 11, printed pp.72-73 (PDF 107-108): "Planets passing through houses having no bindus are inauspicious for the entire period of the transit, and when passing through houses having 8 bindus the entire period of transit produces good results. When there are 7 bindus and 1 rekha, find out which planet has contributed the rekha. When that planet ... transits this Kakshya, he produces evil effects. Similarly, if there is only 1 bindu and 7 rekhas in a bhava, the Kakshya represented by the planet giving the bindu alone is productive of good results"' },
  SLOKA_14: { ...PATEL, pageLocus: 'Chapter V sloka 14, printed pp.74-75 (PDF 109-110): "if the planet and the lord of the Kakshya which he is transiting are both powerful, then the good effects ... will occur in abundance. If the planet is in his exaltation, in own house, friendly house or in an Upachaya house, the effects will be complete. If the planet concerned is weak and is in debilitation, in inimical house or in an Anupachaya house, the effects will be very little"' },
  STRENGTH_ORDER: { ...PATEL, pageLocus: 'Chapter V slokas 6-10, printed p.72 (PDF 107): "The capacity of planets to give good or bad effects are according to their natural (Naisargika) strength, the order of which is the Sun, the Moon, Jupiter, Venus, Mars, Mercury and Saturn"' },
});

/** The natural order of strength (slokas 6-10): the maximum of the 35 fours is the Sun, Moon, Jupiter, Venus. */
const STRENGTH_ORDER = Object.freeze(['Sun', 'Moon', 'Jupiter', 'Venus', 'Mars', 'Mercury', 'Saturn']);

/** Slokas 6-10: what several planets in bindu Kakshyas (or in void ones) bring, by how many of the seven. */
const TOGETHER = deepFreeze({
  BINDU: {
    4: 'செல்வம் சேரும்', 5: 'மதிப்பு, நல்ல உடல்நலம், ஆடை லாபம்', 6: 'முடிசூட்டு', 7: 'அரசாட்சி பெறுதல்',
  },
  VOID: {
    4: 'செல்வ இழப்பு', 5: 'நோய்', 6: 'எல்லா வகைத் துரதிர்ஷ்டம்', 7: 'மரணம் வரை நேரலாம்',
  },
  MORE_THAN_THREE_TA: 'நாலுக்கு மேற்பட்ட கிரகங்கள் பிந்து உள்ள காக்ஷ்யையில் இருந்தால் அவை நல்லவை; அவை நிற்கும் பாவங்கள், ராசிகளின் இயல்புக்கேற்ப நற்பலன் தரும்.',
  DEATH_CERTAIN_TA: 'ஏழும் பிந்து இல்லாத காக்ஷ்யையில் இருக்கையில், அவற்றில் ஒன்று தன் சொந்த அஷ்டகவர்க்கத்தில் ஒரு பிந்துவும் இல்லாத பாவத்தில் இருந்தால் மரணம் உறுதி; அந்தப் பாவத்தில் வேறு கிரகம் இருந்தால் மரணத்துக்கு நிகரான துன்பம்.',
});

/** Sloka 11: the bhava's own bindu count in the planet's Ashtakavarga, at the extremes. */
const BHAVA_EXTREMES = deepFreeze({
  0: 'பிந்து இல்லாத பாவத்தில் கிரகம் செல்லும் காலம் முழுதும் தீது',
  8: 'எட்டு பிந்துவுள்ள பாவத்தில் செல்லும் காலம் முழுதும் நன்மை',
  7: 'ஏழு பிந்து, ஒரு ரேகை: ரேகை தந்த கிரகத்தின் காக்ஷ்யையில் கிரகம் செல்லும்போது தீய பலன்',
  1: 'ஒரு பிந்து, ஏழு ரேகை: பிந்து தந்த கிரகத்தின் காக்ஷ்யையில் மட்டும் நன்மை',
});

const SLOKA_5_TA = Object.freeze({
  BINDU: 'பிந்து உள்ள காக்ஷ்யையில் கிரகம் செல்லும்போது நன்மை தரும்.',
  VOID: 'பிந்து இல்லாத காக்ஷ்யையில் செல்லும்போது பயன் இல்லை.',
  SORROW: 'பிந்து உள்ள காக்ஷ்யையில் இருந்தாலும், கிரகம் நீசம், பகை வீடு அல்லது அஸ்தங்கத்தில் இருந்தால் பெரும் துன்பம் தரும்.',
});

const SLOKA_14_TA = 'கிரகமும் அவர் செல்லும் காக்ஷ்யையின் அதிபதியும் வலுவாக இருந்தால் நற்பலன் நிறைவாக நடக்கும்; உச்சம், சொந்த வீடு, நட்பு வீடு அல்லது உபசய வீட்டில் இருந்தால் பலன் முழுமை; பலவீனம், நீசம், பகை வீடு அல்லது அநுபசய வீட்டில் இருந்தால் மிகக் குறைவு. (இங்கே நீசம், பகை வீடு, அஸ்தங்கம் மட்டும் கணிக்கப்படுகின்றன; உபசய, அநுபசயம் கணிக்கப்படவில்லை.)';

const OUR_READINGS_TA = Object.freeze([
  'ஏழு கிரகங்களும் (சூரியன் முதல் சனி வரை) ஒவ்வொன்றும் தன் சொந்த பிரஸ்தாராஷ்டகவர்க்கத்தின்படி. ராகு, கேதுவுக்கு அஷ்டகவர்க்கம் இல்லை; அவை இங்கே இல்லை.',
  'முறை படேலின் பாவ முறை (இயல்பு); ராசி முறையும் தேர்ந்தெடுக்கலாம். பாவங்கள் லக்னத்தையும் MC ஐயும் வைத்து ஸ்ரீபதி முறையில் (படேல் பக்.69) — ஜாதகம் எந்த பாவ முறையில் சேமிக்கப்பட்டிருந்தாலும்.',
  '"நீசம், பகை வீடு" பலதீபிகையின் (அத்.I ஸ்லோ.6, II ஸ்லோ.21-22) வரையறை; அஸ்தங்கத்தின் பாகைகள் கபூர் குறிப்பு, விஷ்ணு பாஸ்கர் (வக்ரத்தில் புதன் 12, சுக்கிரன் 8). படேல் இவற்றை வரையறுக்கவில்லை.',
  '"பாவத்தில் பிந்து உள்ள கிரகம்" என்பது அந்த கிரகத்தின் பாவ பிந்து எண்ணிக்கை (0-8) ; "காக்ஷ்யையில் பிந்து" என்பது அந்தக் காக்ஷ்யையின் அதிபதி அந்தப் பாவத்தில் பிந்து தந்தாரா என்பது.',
  'சுமார் எண்ணிக்கை ("ஏழில் எத்தனை") ஏழு கிரகங்களின் நிகழ்-கணத்து நிலை; சமூக நிகழ்வுகளுக்குப் பொருந்தாது — நூலின் கூற்று, இந்த மென்பொருளின் முன்கணிப்பு அல்ல.',
]);

module.exports = {
  KAKSHYA_LORDS, KAKSHYA_METHODS, DEFAULT_KAKSHYA_METHOD, PLANETS, PLANET_TA, AVERAGE_DAYS, AVERAGE_TA, SOURCES, STRENGTH_ORDER, TOGETHER, BHAVA_EXTREMES, SLOKA_5_TA, SLOKA_14_TA, OUR_READINGS_TA,
};
