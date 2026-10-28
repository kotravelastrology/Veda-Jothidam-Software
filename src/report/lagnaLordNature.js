/**
 * Nature and temperament from the lagna lord (PL9 gap register, group 2, worksheet 039).
 *
 * The source is T.M. Rao's Bhrigu Samhita (ch. 1-12, "Predictions of <planet> in <lagna> Ascendant"), the
 * 1st-house entry for the lagna's own lord: `Venus in the 1st House (Libra)` is the lord of the Libra lagna
 * standing in the lagna. Each entry is the book's prose as printed (`en`, joined from the page extract), its
 * Tamil summary (`ta`), and the printed page the entry starts on. The scan's own page is not shown; the printed
 * page is five less than the scan's page number, which holds for every entry checked against the page images.
 *
 * Only the lagna-lord-in-lagna entries are here. The book's other planet-in-house entries are not in this file.
 */

const { citeTa } = require('../sources/citeTa');

/** The twelve rasis in order, 0 Aries .. 11 Pisces. */
const LAGNA_LORD_IN_LAGNA = [
  {
    sign: 'Aries', planet: 'Mars', page: 25,
    en: 'Gets fame and physical greatness, has spiritual powers with mother not encouraging, lacking happiness from wife and family pleasures, is restless',
    ta: 'புகழும் உடல் வலிமையும் பெறுவார்; தாயின் ஆதரவு குறைவு; மனைவி, குடும்ப இன்பம் குறைவு; அமைதியற்றவர்.',
  },
  {
    sign: 'Taurus', planet: 'Venus', page: 52,
    en: 'Proud, gains from wife, keeps huge influence in the house of enemies, success in daily occupation, gets some disease, is of firm determination, and is obstinate',
    ta: 'பெருமைக்காரர்; மனைவியால் ஆதாயம்; எதிரிகள் இடத்தில் செல்வாக்கு; அன்றாட தொழிலில் வெற்றி; சில நோய்; உறுதியான மனம், பிடிவாதம்.',
  },
  {
    sign: 'Gemini', planet: 'Mercury', page: 68,
    en: 'Is very handsome and is of good body, has the strength of lands and buildings, strength from others, happy in the occupation, gets honour, self-knowledge, happiness from wife and happy',
    ta: 'மிக அழகானவர், நல்ல உடல்; நிலம், கட்டிடத்தால் வலிமை; பிறரிடம் இருந்து பலம்; தொழிலில் மகிழ்ச்சி; மரியாதை; சுய அறிவு; மனைவியால் மகிழ்ச்சி.',
  },
  {
    sign: 'Cancer', planet: 'Moon', page: 85,
    en: 'Is of fair complexion and symmetrical body, can control the desires, is a stable person, has self-respect, pays final attention to the family circumstances, day-to-day affairs and occupation, wants and gets pleasures, is respected, acts according to his own will, lives independent, some problem in the house of wife, is famous and is of stable mind',
    ta: 'நல்ல நிறம், சீரான உடல்; ஆசைகளைக் கட்டுப்படுத்துவார்; நிலையான குணம்; சுயமரியாதை; குடும்பம், தொழில் மீது கவனம்; மரியாதை பெறுவார்; சுதந்திரமானவர்; மனைவி வழியில் சில சிக்கல்; புகழ்; நிலையான மனம்.',
  },
  {
    sign: 'Leo', planet: 'Sun', page: 104,
    en: 'Great dignity, gets fame, majestic and of tall stature, is very much conceited and haughty, does not show interest in occupation and domestic affairs, opposition in sexual pleasures, and is brave',
    ta: 'பெரும் கௌரவம், புகழ், கம்பீரமும் உயரமும்; கர்வமும் திமிரும்; தொழில், குடும்ப விஷயங்களில் ஆர்வம் குறைவு; பாலியல் இன்பத்தில் தடை; துணிச்சலானவர்.',
  },
  {
    sign: 'Virgo', planet: 'Mercury', page: 130,
    en: 'Is tall and of symmetrical nature, enjoys the royal grandeur, is very influential, progress from the house of father, conducts business, some deficiency in the side of wife, gets some deficiency on the side of sexual pleasures, is very clever, wise and skilful, is a great politician, is diligent and has good manners',
    ta: 'உயரமும் சீரான அமைப்பும்; அரச வாழ்வு; மிகுந்த செல்வாக்கு; தந்தை வழியில் முன்னேற்றம்; வணிகம் செய்வார்; மனைவி, பாலியல் இன்பத்தில் சில குறைகள்; மிகத் திறமையானவர், அறிவாளி; சிறந்த அரசியல் அறிவு; கடின உழைப்பு; நல்ல பழக்கவழக்கம்.',
  },
  {
    sign: 'Libra', planet: 'Venus', page: 156,
    en: 'Gets non-cooperation in his progress, gets a long life, is very respectable, gets fame, gets some weakness in the body, has very good knowledge of self, is farsighted, is a diplomat and is influential',
    ta: 'முன்னேற்றத்தில் ஒத்துழைப்பின்மை; நீண்ட ஆயுள்; மிகுந்த மரியாதை; புகழ்; உடலில் சிறு பலவீனம்; சுய அறிவு மிக்கவர்; தூரநோக்குடையவர்; இராஜதந்திரி; செல்வாக்குள்ளவர்.',
  },
  {
    sign: 'Scorpio', planet: 'Mars', page: 172,
    en: 'Is influential and possesses a short body, is furious and proud, some disorder in the body due to heat in the shape of some diseases, faces loss of mother, gets difficulties about buildings and in peace and happiness, gets some restlessness and distress in the house of wife, bears some difficulties in occupation, is very courageous',
    ta: 'செல்வாக்கு; குட்டையான உடல்; கோபமும் பெருமையும்; வெப்பத்தால் உடலில் கோளாறு; தாயை இழக்க நேரும்; கட்டிடம், அமைதி, மகிழ்ச்சியில் சிரமம்; மனைவி வழியில் தொந்தரவு; தொழிலில் சில சிரமம்; மிகத் துணிச்சலானவர்.',
  },
  {
    sign: 'Sagittarius', planet: 'Jupiter', page: 197,
    en: 'Enjoys happiness and gets honour, possesses a bulky body, is respectable and loves peace, wants sweet and delicious food, gets happiness from wife, has a comfortable occupation, lives at his own place, gets the happiness of education and Dharma, gets children, is fortunate',
    ta: 'மகிழ்ச்சியும் மரியாதையும்; பருமனான உடல்; மதிப்புக்குரியவர், அமைதியை விரும்புவார்; இனிப்பு உணவு விருப்பம்; மனைவியால் மகிழ்ச்சி; வசதியான தொழில்; சொந்த இடத்தில் வாழ்வு; கல்வி, தர்மத்தில் மகிழ்ச்சி; குழந்தைகள்; அதிர்ஷ்டசாலி.',
  },
  {
    sign: 'Capricorn', planet: 'Saturn', page: 222,
    en: 'Is very rich, lives aristocratically, wears costly dresses, gets progress from father\'s house, pursue a big business occupation, deficiency in brothers\' house, gets name and honour in the society, gets some opposition in family and is honourable',
    ta: 'மிகுந்த செல்வம், ஆடம்பர வாழ்வு, விலையுயர்ந்த ஆடை; தந்தை வீட்டு முன்னேற்றம்; பெரிய வணிகத் தொழில்; சகோதரர் வகையில் குறை; சமூகத்தில் பெயரும் மரியாதையும்; குடும்பத்தில் சில எதிர்ப்பு; மரியாதைக்குரியவர்.',
  },
  {
    sign: 'Aquarius', planet: 'Saturn', page: 244,
    en: 'Possesses will-power and self-respect, gets some fame, bears loss in the house of brother, faces affliction in the house of wife and father, gets weakness in occupation, business and prestige, gets weakness in the house of government and society',
    ta: 'மன உறுதியும் சுயமரியாதையும்; சிறு புகழ்; சகோதரர் வகையில் இழப்பு; மனைவி, தந்தை வகையில் துன்பம்; தொழில், வியாபாரம், கௌரவத்தில் பலவீனம்; அரசு, சமூக வகையில் குறை.',
  },
  {
    sign: 'Pisces', planet: 'Jupiter', page: 261,
    en: 'Gets dignity, does ideal deeds, possesses a host of worldly and divine qualities, has a good physique, gets support from the father, gets good education, gets the special power of the children, gets honour in government and society, gets honour in wife\'s side, lives majestically and possesses great self-respect',
    ta: 'கௌரவம்; சிறந்த செயல்கள்; உலகியல், தெய்வீக குணங்கள்; நல்ல உடல்; தந்தை ஆதரவு; நல்ல கல்வி; குழந்தைகளால் சிறப்பு; அரசு, சமூகத்தில் மரியாதை; மனைவி வழியிலும் மரியாதை; கம்பீர வாழ்வு; மிகுந்த சுயமரியாதை.',
  },
];

const RASI_ORDER = LAGNA_LORD_IN_LAGNA.map((e) => e.sign);

/**
 * The lagna lord's entry for a lagna rasi.
 * @param lagnaRasiIndex 0 Aries .. 11 Pisces
 * @returns {{ sign, planet, en, ta, page, citation }}
 */
function lagnaLordInLagna(lagnaRasiIndex) {
  const entry = LAGNA_LORD_IN_LAGNA[lagnaRasiIndex];
  if (!entry) throw new Error(`lagna rasi index out of range: ${lagnaRasiIndex}`);
  return {
    ...entry,
    citation: citeTa({ title: 'Bhrigu Samhita', author: 'T.M. Rao', pageLocus: `printed p.${entry.page}` }),
  };
}

module.exports = { lagnaLordInLagna, LAGNA_LORD_IN_LAGNA, RASI_ORDER };
