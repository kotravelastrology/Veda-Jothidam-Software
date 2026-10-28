/**
 * T.M. Rao's Bhrigu Samhita, "Predictions of <planet> in <sign> Ascendant": the 1st-house entry for every
 * planet in every lagna (9 planets x 12 signs = 108). Each entry is the book's prose as printed (`en`, joined
 * from the page extract; OCR slips are kept), its Tamil summary (`ta`, ours) and the printed page the entry
 * starts on. The printed page is the scan's page number plus five, checked against the printed page numbers
 * in the scan and against the page images for Libra (p.156) and Leo (p.104).
 *
 * Extracted by the scratch scripts in D:\claude-tmp (not kept in the repo); generated text is the book's.
 */

const FIRST_HOUSE = [
  {
    sign: "Aries", planet: "Sun", page: 21,
    en: "The native is learned, gets good education, self-knowledge, is of tall stature, happy with children, mentally shrewd, somewhat deficient in the house of wife, lacks sexual interest, and does not care for occupational pursuits",
    ta: "கற்றவர், நல்ல கல்வி, சுய அறிவு; உயரமானவர்; குழந்தைகளால் மகிழ்ச்சி; அறிவுக் கூர்மை; மனைவி வழியில் சிறு குறை; பாலியல் ஆர்வம் குறைவு; தொழிலில் அக்கறை குறைவு.",
  },
  {
    sign: "Aries", planet: "Moon", page: 23,
    en: "Gets happiness and enjoys all pleasures, gets mother's affection and enjoys land and house, good-looking, happiness from wife, sexual pleasure, gets success, respect in occupation, contact with good helpers and enjoys luxury",
    ta: "இன்பம் அனுபவிப்பவர்; தாயின் அன்பு; நிலம், வீடு வசதி; அழகானவர்; மனைவியால் மகிழ்ச்சி; தொழிலில் வெற்றியும் மரியாதையும்; நல்ல உதவியாளர்கள்; ஆடம்பர வாழ்வு.",
  },
  {
    sign: "Aries", planet: "Mars", page: 25,
    en: "Gets fame and physical greatness, has spiritual powers with mother not encouraging, lacking happiness from wife and family pleasures, is restless",
    ta: "புகழும் உடல் வலிமையும் பெறுவார்; தாயின் ஆதரவு குறைவு; மனைவி, குடும்ப இன்பம் குறைவு; அமைதியற்றவர்.",
  },
  {
    sign: "Aries", planet: "Mercury", page: 27,
    en: "Sisters and brothers are friendly, gets help from maternal grandfather's side, overcomes enemies, able to get over disputes and hindrances, gets his work done cleverly, support from wife and family, improves his working conditions with planning and industry",
    ta: "உடன்பிறப்புகள் நட்புடன்; தாய்வழி தாத்தாவிடம் உதவி; எதிரிகளை வெல்வார்; தடைகளைத் தாண்டுவார்; திட்டமிட்டு வேலை செய்வார்; மனைவி, குடும்ப ஆதரவு; உழைப்பால் வேலை நிலை மேம்படும்.",
  },
  {
    sign: "Aries", planet: "Jupiter", page: 29,
    en: "Handsome, fortunate and honoured, spending in a right way, maintains good health, religious, has children, well-educated, domestic happiness, successful in occupations, good forethought and kind-hearted",
    ta: "அழகும் அதிர்ஷ்டமும் மரியாதையும்; நல்ல வழியில் செலவு; நல்ல உடல்நலம்; தர்ம சிந்தனை; குழந்தைகள்; நல்ல கல்வி; குடும்ப மகிழ்ச்சி; தொழிலில் வெற்றி; இரக்க குணம்.",
  },
  {
    sign: "Aries", planet: "Venus", page: 31,
    en: "Has a good profession, earns wealth, possesses beautiful wife and enjoys good sexual pleasures, artistic and clever, good family, very able and successful in worldly affairs, enjoy the domestic life, skilful and honourable",
    ta: "நல்ல தொழில், செல்வம்; அழகான மனைவி; நல்ல பாலியல் இன்பம்; கலையிலும் அறிவிலும் திறமை; நல்ல குடும்பம்; உலக விவகாரங்களில் வெற்றி; மதிப்புக்குரியவர்.",
  },
  {
    sign: "Aries", planet: "Saturn", page: 33,
    en: "Not attractive in appearance, no happiness from father, is dependent, has to work hard for money, is very industrious and energetic, gives special importance to wife and is a bit lazy",
    ta: "அழகற்ற தோற்றம்; தந்தையால் மகிழ்ச்சி இல்லை; பிறரைச் சார்ந்திருப்பவர்; பணத்துக்கு கடின உழைப்பு; மிகுந்த முயற்சி; மனைவிக்கு முக்கியத்துவம்; சிறிது சோம்பல்.",
  },
  {
    sign: "Aries", planet: "Rahu", page: 35,
    en: "Feels sickly and has a diseased face, courageous, becomes popular, makes unauthorised efforts, secretive, faces the calamities bravely",
    ta: "உடல்நலக் குறைவு, முகத்தில் நோய் அடையாளம்; தைரியசாலி; பிரபலமாவார்; அனுமதியின்றி முயற்சிகள்; ரகசியமானவர்; ஆபத்துகளை தைரியமாக எதிர்கொள்வார்.",
  },
  {
    sign: "Aries", planet: "Ketu", page: 37,
    en: "Feels restless and is weak in body, may experience some fatal stroke of pain, has good patience, not under pressure from others, rash and obstinate, lacks self-confidence",
    ta: "உடல் பலவீனம், அமைதியின்மை; ஆபத்தான வலி ஏற்படலாம்; பொறுமை; பிறர் அழுத்தத்துக்கு உட்படாதவர்; முரட்டுத்தனமும் பிடிவாதமும்; தன்னம்பிக்கை குறைவு.",
  },
  {
    sign: "Taurus", planet: "Sun", page: 42,
    en: "Gets some landed property and also happiness through occupation, happiness through wife and family, and also sexual pleasures",
    ta: "சில நிலச் சொத்து; தொழிலில் மகிழ்ச்சி; மனைவி, குடும்ப இன்பம்; பாலியல் இன்பமும்.",
  },
  {
    sign: "Taurus", planet: "Moon", page: 44,
    en: "Help from brothers and sisters, courageous and ambitious, little unhappy with wife and also with profession and also in sexual pleasures, feels restless in domestic alfairs",
    ta: "சகோதர சகோதரிகளின் உதவி; தைரியமும் லட்சியமும்; மனைவி, தொழில், பாலியல் இன்பத்தில் சிறு அதிருப்தி; குடும்ப விவகாரங்களில் அமைதியின்மை.",
  },
  {
    sign: "Taurus", planet: "Mars", page: 46,
    en: "Blood gets impure, expenditure in daily life, gives importance to wife and not to mother, happiness through lands and buildings, wanders, toils hard and is somewhat restless in family",
    ta: "ரத்தம் கெட்டுப்போகும்; தினசரி செலவு; மனைவிக்கு முக்கியத்துவம், தாயிடம் குறைவு; நிலம், கட்டிடத்தால் மகிழ்ச்சி; அலைச்சல்; கடின உழைப்பு; குடும்பத்தில் சிறு அமைதியின்மை.",
  },
  {
    sign: "Taurus", planet: "Mercury", page: 48,
    en: "Gets wisdom and education, earns wealth with discriminations, looks handsome, respect in family and through wife, has the desires of sexual pleasure, becomes rich and clever",
    ta: "ஞானமும் கல்வியும்; விவேகத்துடன் பொருள் ஈட்டுவார்; அழகானவர்; குடும்பத்திலும் மனைவி வழியிலும் மரியாதை; பாலியல் ஆசை; பணக்காரர், திறமையானவர்.",
  },
  {
    sign: "Taurus", planet: "Jupiter", page: 50,
    en: "Clever, suffers from some health problems, gets importance and dignity in the daily routine, good education, sufferings of children",
    ta: "திறமையானவர்; சில உடல்நலப் பிரச்சினைகள்; அன்றாட வாழ்வில் முக்கியத்துவமும் கௌரவமும்; நல்ல கல்வி; குழந்தைகளால் துன்பம்.",
  },
  {
    sign: "Taurus", planet: "Venus", page: 52,
    en: "Proud, gains from wife, keeps huge influence in the house of enemies, success in daily occupation, gets some disease, is of firm determination, and is obstinate",
    ta: "பெருமைக்காரர்; மனைவியால் ஆதாயம்; எதிரிகள் இடத்தில் செல்வாக்கு; அன்றாட தொழிலில் வெற்றி; சில நோய்; உறுதியான மனம், பிடிவாதம்.",
  },
  {
    sign: "Taurus", planet: "Saturn", page: 54,
    en: "Influential, thought to be fortunate, gets the respect from father, government and society, interested in politics and tries hard for progress, not much help from brothers and sisters, enmity with wife, deficiency in sexual pleasures, does hard work, and is obstinate",
    ta: "செல்வாக்குள்ளவர்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; தந்தை, அரசு, சமூகத்தில் மரியாதை; அரசியலில் ஆர்வம்; சகோதரர் ஆதரவு குறைவு; மனைவியுடன் பகை; பாலியல் இன்பக் குறைவு; கடின உழைப்பு; பிடிவாதம்.",
  },
  {
    sign: "Taurus", planet: "Rahu", page: 56,
    en: "Weak constitution, gets worries and anxieties, secretive and clever, is courageous",
    ta: "பலவீனமான உடல்; கவலைகளும் பதற்றமும்; ரகசியமானவர், புத்திசாலி; தைரியசாலி.",
  },
  {
    sign: "Taurus", planet: "Ketu", page: 58,
    en: "Weakness in body and mentally backward, restlessness, secretive and brave, and becomes unfair",
    ta: "உடல் பலவீனம், மனத்தில் பின்தங்கல்; அமைதியின்மை; ரகசியமானவர், வீரம்; நியாயமற்ற செயல்.",
  },
  {
    sign: "Gemini", planet: "Sun", page: 62,
    en: "Does influential deeds, has the support of brothers and sisters, works with great strength and influence in the house of wife, increase in the strength of sexual pleasures",
    ta: "செல்வாக்குள்ள செயல்கள்; சகோதர சகோதரிகளின் ஆதரவு; மனைவி வழியில் வலிமையுடன் செயல்படுவார்; பாலியல் இன்பம் அதிகரிக்கும்.",
  },
  {
    sign: "Gemini", planet: "Moon", page: 64,
    en: "Gets wealth and looks handsome, beauty in the house of wife, success in daily occupation, wears costly things, more attention in the side of sexual pleasures, respect from father-in-law, is of stable mind",
    ta: "செல்வம், அழகான தோற்றம்; மனைவி வழியில் அழகு; தினசரி தொழிலில் வெற்றி; விலையுயர்ந்த பொருட்கள்; பாலியல் இன்பத்தில் அதிக கவனம்; மாமனாரிடம் மரியாதை; நிலையான மனம்.",
  },
  {
    sign: "Gemini", planet: "Mars", page: 66,
    en: "Gains through physical labour, gets huge gains, gets some diseases and weakness in the body, restlessness in the house of mother, some hindrance in peace and happiness, keeps influence in the house of enemies, some anxiety in the house of wife, somewhat rash",
    ta: "உடல் உழைப்பால் பெரும் ஆதாயம்; சில நோய்கள், உடல் பலவீனம்; தாய் வகையில் அமைதியின்மை; மகிழ்ச்சிக்கு தடைகள்; எதிரிகள் இடத்தில் செல்வாக்கு; மனைவி பற்றி சிறு கவலை; சிறிது அவசரம்.",
  },
  {
    sign: "Gemini", planet: "Mercury", page: 68,
    en: "Is very handsome and is of good body, has the strength of lands and buildings, strength from others, happy in the occupation, gets honour, self-knowledge, happiness from wife and happy",
    ta: "மிக அழகானவர், நல்ல உடல்; நிலம், கட்டிடத்தால் வலிமை; பிறரிடம் இருந்து பலம்; தொழிலில் மகிழ்ச்சி; மரியாதை; சுய அறிவு; மனைவியால் மகிழ்ச்சி.",
  },
  {
    sign: "Gemini", planet: "Jupiter", page: 70,
    en: "Gets importance in the house of wife, has an occupation which gives special importance, help from father, gains from government and society, gets strength of children, gains good education, gets good healthy body, works hard",
    ta: "மனைவி வழியில் முக்கியத்துவம்; சிறப்புப் பதவி தரும் தொழில்; தந்தையின் ஆதரவு; அரசு, சமூகத்தில் ஆதாயம்; குழந்தைகளின் பலம்; நல்ல கல்வி; ஆரோக்கியமான உடல்; கடின உழைப்பு.",
  },
  {
    sign: "Gemini", planet: "Venus", page: 72,
    en: "Healthy body, has strength of mind, clever, deficiency with regard to loss of children, speaks much on wife and sexual pleasures",
    ta: "ஆரோக்கியமான உடல்; மன வலிமை; திறமையானவர்; குழந்தைகளை இழக்கும் குறை; மனைவி, பாலியல் இன்பம் பற்றி அதிகம் பேசுவார்.",
  },
  {
    sign: "Gemini", planet: "Saturn", page: 74,
    en: "Fortunate, worries about progress, good longevity, worry in the house of brothers and sisters",
    ta: "அதிர்ஷ்டசாலி; முன்னேற்றம் பற்றிய கவலை; நீண்ட ஆயுள்; சகோதர சகோதரிகள் வகையில் கவலை.",
  },
  {
    sign: "Gemini", planet: "Rahu", page: 76,
    en: "Gets tall stature, follows deep and bitter policies in heart, has self- pride, succeeds in getting fame, moves his ideas more than necessary beyond limit, has spiritual knowledge",
    ta: "உயரமான உடல்; இதயத்தில் ஆழமான, கசப்பான கொள்கைகள்; தன்னம்பிக்கை மிகுதி; புகழ் பெறுவார்; எண்ணங்களை அளவுக்கு மீறி பரப்புவார்; ஆன்மிக அறிவு.",
  },
  {
    sign: "Gemini", planet: "Ketu", page: 78,
    en: "Great weakness and anxiety in the body, deficiency of beauty, sometimes gets some fatal stroke or danger to body, feels weakness in heart, has great sense of patience, secretive and obstinate fellow",
    ta: "உடலில் பெரும் பலவீனமும் கவலையும்; அழகில் குறை; சில நேரம் உயிருக்கு ஆபத்தான அடி; இதயத்தில் பலவீனம்; மிகுந்த பொறுமை; ரகசியமானவர், பிடிவாதம்.",
  },
  {
    sign: "Cancer", planet: "Sun", page: 82,
    en: "Is dignified and wealthy, glorious, some dullness in the gains from the side of wife and occupational pursuits and in addition feels some hindrances also, possesses family",
    ta: "செல்வமும் கௌரவமும்; மனைவி வழி வருமானத்தில் மந்தம், தொழிலிலும் தடைகள்; குடும்பம் அமையும்.",
  },
  {
    sign: "Cancer", planet: "Moon", page: 85,
    en: "Is of fair complexion and symmetrical body, can control the desires, is a stable person, has self-respect, pays final attention to the family circumstances, day-to-day affairs and occupation, wants and gets pleasures, is respected, acts according to his own will, lives independent, some problem in the house of wife, is famous and is of stable mind",
    ta: "நல்ல நிறம், சீரான உடல்; ஆசைகளைக் கட்டுப்படுத்துவார்; நிலையான குணம்; சுயமரியாதை; குடும்பம், தொழில் மீது கவனம்; மரியாதை பெறுவார்; சுதந்திரமானவர்; மனைவி வழியில் சில சிக்கல்; புகழ்; நிலையான மனம்.",
  },
  {
    sign: "Cancer", planet: "Mars", page: 87,
    en: "Is not influential, does not get good respect from parents, pays great attention to occupation, some respect in the house of wife, unhappy with children, lacks in education, dullness in life, wants some sexual pleasures",
    ta: "செல்வாக்கு குறைவு; பெற்றோரிடம் நல்ல மரியாதை இல்லை; தொழிலில் அதிக கவனம்; மனைவி வழியில் சில மரியாதை; குழந்தைகளால் அதிருப்தி; கல்வியில் குறை; வாழ்வில் சலிப்பு; சில பாலியல் ஆசை.",
  },
  {
    sign: "Cancer", planet: "Mercury", page: 89,
    en: "Has a good physique, spends majestically, is a businessman and courageous, much strength in occupation and domestic affairs, some deficiency in the house of brothers and sisters, is respectable, goes to foreign countries",
    ta: "நல்ல உடல்; பெருமையுடன் செலவு செய்வார்; வணிகர், தைரியசாலி; தொழிலிலும் குடும்பத்திலும் வலிமை; உடன்பிறப்பு வகையில் சிறு குறை; மரியாதைக்குரியவர்; வெளிநாடு செல்வார்.",
  },
  {
    sign: "Cancer", planet: "Jupiter", page: 91,
    en: "Is self-conscious, dignified, fortunate, virtuous, brave in heart, likes justice and truth, understands Dharma and vice very much, gets great respect, is of golden complexion and handsome, is very intelligent and has broad forehead, is of tall stature, has children, some deficiency in sexual pleasures, is a bit careless regarding family, has the power of influence, is learned and loves strongly, very clever, defeats his enemies",
    ta: "தன்னுணர்வும் கௌரவமும் அதிர்ஷ்டமும் நல்லொழுக்கமும்; இதயத்தில் தைரியம்; நீதியையும் உண்மையையும் விரும்புவார்; தர்மத்தையும் தீமையையும் நன்கு அறிவார்; மிகுந்த மரியாதை; அழகும் பொன்னிறமும்; அறிவாளி; குழந்தைகள்; பாலியல் இன்பத்தில் சிறு குறை; குடும்பத்தில் சிறிது அசட்டை; கற்றவர்; பகைவரை வெல்வார்.",
  },
  {
    sign: "Cancer", planet: "Venus", page: 93,
    en: "Gets power of mother, keeps the body handsome and in comfort, gets buildings and property, gets happiness in the house of wife, gains and happiness in the daily occupation, calm nature and success in family and worldly affairs",
    ta: "தாயின் ஆதரவு; அழகான உடல், வசதி; நிலம், சொத்து; மனைவி வழியில் மகிழ்ச்சி; தொழிலில் ஆதாயம்; அமைதியான குணம்; குடும்ப, உலக விவகாரங்களில் வெற்றி.",
  },
  {
    sign: "Cancer", planet: "Saturn", page: 95,
    en: "Pursues daily occupation diligently, good longevity, not satisfied with wife, works with high and obscure tactics in connection with sexual pleasures, hardships in connection with occupation, carelessness in the house of government and in the house of father, avaricious and careless",
    ta: "அன்றாட தொழிலில் கடின உழைப்பு; நீண்ட ஆயுள்; மனைவியிடம் திருப்தி குறைவு; பாலியல் விஷயத்தில் மறைமுக வழிகள்; தொழிலில் சிரமங்கள்; அரசு, தந்தை வகையில் அசட்டை; பேராசையும் அசட்டையும்.",
  },
  {
    sign: "Cancer", planet: "Rahu", page: 97,
    en: "Some deficiency and some calamity in the body, mental distress, anxiety in his thoughts, struggles for the rise in the happiness",
    ta: "உடலில் சில குறைகளும் ஆபத்தும்; மனத் துன்பம்; எண்ணங்களில் கவலை; மகிழ்ச்சி உயர போராட்டம்.",
  },
  {
    sign: "Cancer", planet: "Ketu", page: 99,
    en: "Weakness in the body, emaciation in physique, some fatal trouble, is courageous and obstinate",
    ta: "உடல் பலவீனம், மெலிந்த தோற்றம்; சில ஆபத்தான துன்பம்; தைரியமும் பிடிவாதமும்.",
  },
  {
    sign: "Leo", planet: "Sun", page: 104,
    en: "Great dignity, gets fame, majestic and of tall stature, is very much conceited and haughty, does not show interest in occupation and domestic affairs, opposition in sexual pleasures, and is brave",
    ta: "பெரும் கௌரவம், புகழ், கம்பீரமும் உயரமும்; கர்வமும் திமிரும்; தொழில், குடும்ப விஷயங்களில் ஆர்வம் குறைவு; பாலியல் இன்பத்தில் தடை; துணிச்சலானவர்.",
  },
  {
    sign: "Leo", planet: "Moon", page: 106,
    en: "Possesses the power to travel to various places, some weakness in the body, spends majestically and influentially, some weakness in the daily occupation and in the house of wife, is of weak heart and suspicious mind",
    ta: "பல இடங்களுக்கு பயணம் செய்யும் ஆற்றல்; உடலில் சில பலவீனம்; ஆடம்பரமாகவும் செல்வாக்குடனும் செலவு; தொழிலிலும் மனைவி வழியிலும் சிறு பலவீனம்; பலவீனமான இதயம், சந்தேக மனம்.",
  },
  {
    sign: "Leo", planet: "Mars", page: 108,
    en: "Gets land and property, gets an ideal mother, gets very high means and influence to acquire happiness, has a good physique, dullness in the house of wife, family and daily occupation",
    ta: "நிலம், சொத்து; இலட்சிய தாய்; மகிழ்ச்சி அடைய பெரும் வசதியும் செல்வாக்கும்; நல்ல உடல்; மனைவி, குடும்பம், தினசரி தொழிலில் மந்தம்.",
  },
  {
    sign: "Leo", planet: "Mercury", page: 110,
    en: "Gets heavy gains and much wealth, gets great success in daily occupation, great advantage in the house of wife, great success in worldly affairs and of sexual pleasures, is respectable and clever",
    ta: "பெரும் ஆதாயமும் செல்வமும்; தொழிலில் சிறந்த வெற்றி; மனைவி வழியில் பெரும் நன்மை; உலக விவகாரங்களிலும் பாலியல் இன்பத்திலும் வெற்றி; மரியாதைக்குரியவர், திறமையானவர்.",
  },
  {
    sign: "Leo", planet: "Jupiter", page: 112,
    en: "Gets good longevity and acquires much education, gets the strength of the children, spends the daily routine of his life with eminence, some deficiency in handsomeness, shows great scholarship, insipidness in family environment",
    ta: "நீண்ட ஆயுள்; நிறைய கல்வி; குழந்தைகளின் வலிமை; சிறப்புடன் தினசரி வாழ்க்கை; அழகில் சிறு குறை; சிறந்த புலமை; குடும்பச் சூழலில் சுவையின்மை.",
  },
  {
    sign: "Leo", planet: "Venus", page: 114,
    en: "Works much with his strength and energy, gets honour and progress in trade and occupation, honour and strength in the house of wife and special powers and sexual pleasures, exerts a bit hard for securing the rise of honour in government and society, gets his work done tactfully, and is very industrious",
    ta: "தன் பலத்தாலும் ஆற்றலாலும் அதிகம் உழைப்பார்; தொழிலிலும் வியாபாரத்திலும் மரியாதையும் முன்னேற்றமும்; மனைவி வழியில் மரியாதையும் வலிமையும்; சிறப்பு ஆற்றல், பாலியல் இன்பம்; அரசு, சமூகத்தில் மரியாதைக்கு சிறிது முயற்சி; தந்திரமாக வேலை முடிப்பார்; மிகுந்த உழைப்பாளி.",
  },
  {
    sign: "Leo", planet: "Saturn", page: 116,
    en: "Pursues some laborious daily occupation through his body, happiness in the house of family and wife, gets some diseases, special conjunction of sexual passions, great vigour in the way of progress and works with the power of hard labour and tactics",
    ta: "உடலால் கடின உழைப்பு; குடும்ப, மனைவி வகையில் மகிழ்ச்சி; சில நோய்கள்; பாலியல் ஆர்வம் மிகுதி; முன்னேற்றத்தில் பெரும் முயற்சி; கடின உழைப்பும் தந்திரமும்.",
  },
  {
    sign: "Leo", planet: "Rahu", page: 118,
    en: "Weakness in body, some anxiety and some stress in the brain, feels inner fear, selfish and keeps influence",
    ta: "உடல் பலவீனம்; மூளையில் சிறு கவலையும் அழுத்தமும்; உள்ளார்ந்த பயம்; சுயநலம்; செல்வாக்கு வைத்திருப்பார்.",
  },
  {
    sign: "Leo", planet: "Ketu", page: 120,
    en: "Some weakness in the body, death like danger in the body, does hard physical labour, is courageous, proud, possesses the great power of sexual pleasures, and labours very hard",
    ta: "உடல் பலவீனம், மரண ஆபத்து போன்ற நிலை; கடின உடல் உழைப்பு; தைரியம், பெருமை; பாலியல் இன்பத்தில் பெரும் ஆற்றல்; மிகக் கடினமாக உழைப்பார்.",
  },
  {
    sign: "Virgo", planet: "Sun", page: 125,
    en: "Spends much, is of weak and emaciated body, manages his expenditure by physical labour, conducts the daily occupation with the power of expenditure, gets weakness in the house of wife, gets some losses and weakness in occupation, is haughty",
    ta: "அதிகம் செலவழிப்பார்; உடல் பலவீனம், மெலிவு; உடல் உழைப்பால் செலவை சமாளிப்பார்; மனைவி வகையில் குறை; தொழிலில் இழப்பும் பலவீனமும்; பெருமை.",
  },
  {
    sign: "Virgo", planet: "Moon", page: 127,
    en: "Gets gains with physical and mental happiness, is handsome, is of calm nature, gets a beautiful wife, gains heavily in the occupation, gets all pleasures and enjoyments, is much respected, is of delightful nature, is interested in the house of wife, gains from the house of father-in-law, is very careful about income and daily occupation, wants special sexual pleasures",
    ta: "உடல், மன மகிழ்ச்சி; அழகானவர்; அமைதியான குணம்; அழகான மனைவி; தொழிலில் பெரும் ஆதாயம்; எல்லா இன்பங்களும்; மிகுந்த மரியாதை; இனிய குணம்; மனைவி வழியில் அக்கறை; மாமனாரிடம் ஆதாயம்; வருமானத்தில் கவனம்; சிறப்பு பாலியல் இன்பம்.",
  },
  {
    sign: "Virgo", planet: "Mars", page: 129,
    en: "Gets a long life, feels some distress the body, is very powerful, some loss in the house of mother, feels some distress in the side of wife, gets some efficiency and cooperation on the side of brothers and sisters",
    ta: "நீண்ட ஆயுள்; உடலில் சில துன்பம்; மிகுந்த வலிமை; தாய் வகையில் சிறு இழப்பு; மனைவி வகையில் சிறு துன்பம்; உடன்பிறப்புகளிடம் சிறு ஒத்துழைப்பு.",
  },
  {
    sign: "Virgo", planet: "Mercury", page: 131,
    en: "Is tall and of symmetrical nature, enjoys the royal grandeur, is very influential, progress from the house of father, conducts business, some deficiency in the side of wife, gets some deficiency on the side of sexual pleasures, is very clever, wise and skilful, is a great politician, is diligent and has good manners",
    ta: "உயரமும் சீரான அமைப்பும்; அரச வாழ்வு; மிகுந்த செல்வாக்கு; தந்தை வழியில் முன்னேற்றம்; வணிகம் செய்வார்; மனைவி, பாலியல் இன்பத்தில் சில குறைகள்; மிகத் திறமையானவர், அறிவாளி; சிறந்த அரசியல் அறிவு; கடின உழைப்பு; நல்ல பழக்கவழக்கம்.",
  },
  {
    sign: "Virgo", planet: "Jupiter", page: 133,
    en: "Gets domestic happiness, gets a very clever wife, gets the pleasant occupation, is thought to be fortunate, is careful about Dharma and also in family affairs, feels some deficiency in the side of children, some weakness in wisdom and education, intellectual worries due to the reasons of family regarding wife, is of fat body, is the owner of property, is very clever and happy",
    ta: "குடும்ப மகிழ்ச்சி; மிகத் திறமையான மனைவி; இனிய தொழில்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; தர்மத்திலும் குடும்ப விவகாரத்திலும் கவனம்; குழந்தைகள் வகையில் சிறு குறை; அறிவிலும் கல்வியிலும் சிறு பலவீனம்; மனைவி பற்றிய குடும்பக் கவலைகள்; பருத்த உடல்; சொத்துக்கு உரிமையாளர்; மிகத் திறமையானவர், மகிழ்ச்சியானவர்.",
  },
  {
    sign: "Virgo", planet: "Venus", page: 136,
    en: "Some weakness in body, gets some deficiency in wealth, gets a fortunate wife, pursues a big daily occupation, gets excess in enjoying the sexual pleasures, progress in occupation after marriage",
    ta: "உடலில் சிறு பலவீனம்; செல்வத்தில் சிறு குறை; அதிர்ஷ்டமான மனைவி; பெரிய தினசரி தொழில்; பாலியல் இன்பத்தில் மிகுதி; திருமணத்துக்குப் பின் தொழில் முன்னேற்றம்.",
  },
  {
    sign: "Virgo", planet: "Saturn", page: 138,
    en: "Is victorious, serious and is of deep intricate policies, gets able children and also the education, gets progress in connection with daily occupation, some enmity and some separation in the side of children, some illness in the body",
    ta: "வெற்றியாளர், தீவிரமானவர், ஆழமான தந்திர நெறிகள்; திறமையான குழந்தைகளும் கல்வியும்; தினசரி தொழிலில் முன்னேற்றம்; குழந்தைகள் வகையில் சில பகையும் பிரிவும்; உடலில் சில நோய்.",
  },
  {
    sign: "Virgo", planet: "Rahu", page: 140,
    en: "Talks very cunningly and cleverly, keeps his influence, gets much success due to occult power, bears some trouble in the body, keeps great care in the house of wife and occultism, and labours hard",
    ta: "மிகவும் தந்திரமாகவும் சாமர்த்தியமாகவும் பேசுவார்; செல்வாக்கு வைத்திருப்பார்; மறை ஞானத்தால் நிறைய வெற்றி; உடலில் சில தொல்லை; மனைவி, மறைக்கலை விஷயங்களில் அதிக கவனம்; கடினமாக உழைப்பார்.",
  },
  {
    sign: "Virgo", planet: "Ketu", page: 142,
    en: "Is much self-conceited, gets weakness in the body, experiences some weakness of a special kind in his body, keeps firmness in outward show, is very clever, respectable, works rashly",
    ta: "மிகுந்த தன்னம்பிக்கை; உடல் பலவீனம்; உடலில் சிறப்பு வகை பலவீனம்; வெளித்தோற்றத்தில் உறுதி; மிகவும் அறிவாளி, மரியாதைக்குரியவர்; அவசரமாக வேலை செய்வார்.",
  },
  {
    sign: "Libra", planet: "Sun", page: 146,
    en: "Gets the income through physical labour but gets some weakness in income and physique also, gets firmness in the daily occupation, special gains in the house of wife and family, gets special sexual pleasures, is of lean and thin body",
    ta: "உடல் உழைப்பால் வருமானம், வருமானத்தில் சிறு பலவீனம்; உடலிலும் குறை; தினசரி தொழிலில் உறுதி; மனைவி, குடும்ப வகையில் சிறப்பு ஆதாயம்; சிறப்பு பாலியல் இன்பம்; ஒல்லியான, மெலிந்த உடல்.",
  },
  {
    sign: "Libra", planet: "Moon", page: 148,
    en: "Dignified, majestic and respected, gets progress in the house of father, enjoys high class sexual pleasures, gets the happiness of wife, works very majestically in connection with occupation, gets honour in government and society",
    ta: "கம்பீரமும் மரியாதையும்; தந்தை வீட்டில் முன்னேற்றம்; உயர்தர பாலியல் இன்பம்; மனைவியால் மகிழ்ச்சி; தொழிலில் கம்பீரமாக செயல்படுவார்; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    sign: "Libra", planet: "Mars", page: 150,
    en: "Is very rich and respectable, gets emaciation in his physique, pursues valuable occupation, gets very able and beautiful wife, gets ideal pleasures, gets great happiness, gets the household profits, buildings, etc",
    ta: "மிகுந்த செல்வமும் மரியாதையும்; உடல் மெலிவு; மதிப்புமிக்க தொழில்; மிகத் திறமையான அழகான மனைவி; சிறந்த இன்பங்கள்; பெரும் மகிழ்ச்சி; வீடு, கட்டிடம் மூலம் ஆதாயம்.",
  },
  {
    sign: "Libra", planet: "Mercury", page: 152,
    en: "Fortunate, enjoys the happiness of physique, has a thin and lean body, enjoys domestic happiness in connection with wife, gets success in occupation, is very clever, is very wise and does justice, is influential, and is of tender nature",
    ta: "அதிர்ஷ்டசாலி; உடல் இன்பம்; மெலிந்த உடல்; மனைவியுடன் குடும்ப மகிழ்ச்சி; தொழிலில் வெற்றி; மிகுந்த அறிவாளி, ஞானி, நீதி செய்பவர்; செல்வாக்குள்ளவர்; மென்மையான குணம்.",
  },
  {
    sign: "Libra", planet: "Jupiter", page: 154,
    en: "Does very influential deeds, has great courage, does hard physical labour, is very wise and follows shrewd policies, follows occupation tactfully, is careful about religious behaviour, gets some enmity in the house of children, dignity in the side of wife",
    ta: "செல்வாக்குள்ள செயல்கள்; பெரும் தைரியம்; கடின உடல் உழைப்பு; மிகுந்த ஞானம், புத்திசாலித்தனமான வழிகள்; தொழிலை சாமர்த்தியமாகச் செய்வார்; மதக் கடமைகளில் கவனம்; குழந்தைகள் வகையில் சில பகை; மனைவி வழியில் மரியாதை.",
  },
  {
    sign: "Libra", planet: "Venus", page: 156,
    en: "Gets non-cooperation in his progress, gets a long life, is very respectable, gets fame, gets some weakness in the body, has very good knowledge of self, is farsighted, is a diplomat and is influential",
    ta: "முன்னேற்றத்தில் ஒத்துழைப்பின்மை; நீண்ட ஆயுள்; மிகுந்த மரியாதை; புகழ்; உடலில் சிறு பலவீனம்; சுய அறிவு மிக்கவர்; தூரநோக்குடையவர்; இராஜதந்திரி; செல்வாக்குள்ளவர்.",
  },
  {
    sign: "Libra", planet: "Saturn", page: 158,
    en: "Is of very handsome physique, enjoys pleasures very much, gets much education, is very wise, influential, diligent and pays attention towards a big business, faces troubles with wife in domestic affairs due to speech and intellect, some deficiency in the side of sexual pleasures and in the sphere of wife, gets much pleasure and happiness of property, possesses self-pride",
    ta: "அழகான உடல்; இன்பங்களை மிகவும் அனுபவிப்பார்; மிகுந்த கல்வி; ஞானி, செல்வாக்கு, உழைப்பாளி; பெரிய வியாபாரத்தில் கவனம்; பேச்சாலும் அறிவாலும் மனைவியுடன் சிக்கல்கள்; பாலியல், மனைவி துறையில் சில குறை; சொத்தால் மகிழ்ச்சி; தன்னம்பிக்கை மிக்கவர்.",
  },
  {
    sign: "Libra", planet: "Rahu", page: 160,
    en: "Gets the work done with great tactics and cleverness, is very cautious, physically and mentally worried, gets some fame, bears special blows on body, becomes nervous",
    ta: "திறமையான தந்திரத்தால் வேலை முடிப்பார்; மிகவும் எச்சரிக்கையானவர்; உடலும் மனமும் கவலையுற்றவர்; சிறு புகழ்; உடலில் சிறப்பான அடிகள்; பதற்றம்.",
  },
  {
    sign: "Libra", planet: "Ketu", page: 162,
    en: "Some weakness in body, some incompleteness in himself, lives in a manner of pride and bravery, works in hardships, stays permanently at his place and pursues his work, is obstinate",
    ta: "உடலில் சிறு பலவீனம்; தன்னிடம் சில குறைகள்; பெருமையும் தைரியமும்; கஷ்டங்களில் வேலை செய்வார்; நிலையாக தன் இடத்தில் தங்கி வேலை செய்வார்; பிடிவாதம்.",
  },
  {
    sign: "Scorpio", planet: "Sun", page: 167,
    en: "Gets royal grandeur, is very glorious and influential, gets much pride, gets his work done by order, some deficiency in the house of wife, gets sexual pleasures, gets the power in the house of father, conducts a very big business, wears beautiful garments and ornaments, does the occupation with grandeur and pride",
    ta: "அரச செல்வமும் பெருமையும்; மிகுந்த கர்வம்; ஆணையின்படி வேலை முடியும்; மனைவி வகையில் சிறு குறை; பாலியல் இன்பம்; தந்தை வழியில் அதிகாரம்; பெரிய வியாபாரம் நடத்துவார்; அழகான ஆடை, ஆபரணங்கள்.",
  },
  {
    sign: "Scorpio", planet: "Moon", page: 170,
    en: "Gets mental anxieties and some weakness of destiny, toils hard for the occupation, gets a lean body, takes lull care of the family, has special mental fascination in wife and in the side of sexual pleasures etc, progresses in connection with occupation by mental power and the power of destiny, rears Dharma incompletely",
    ta: "மன கவலைகளும் விதியின் சிறு பலவீனமும்; தொழிலுக்கு கடின உழைப்பு; மெலிந்த உடல்; குடும்பத்தை மிகவும் கவனிப்பார்; மனைவியிலும் பாலியல் விஷயங்களிலும் மன ஈர்ப்பு; மன வலிமையாலும் விதியாலும் தொழிலில் முன்னேற்றம்; தர்மத்தை முழுமையாகக் கடைப்பிடிக்க மாட்டார்.",
  },
  {
    sign: "Scorpio", planet: "Mars", page: 172,
    en: "Is influential and possesses a short body, is furious and proud, some disorder in the body due to heat in the shape of some diseases, faces loss of mother, gets difficulties about buildings and in peace and happiness, gets some restlessness and distress in the house of wife, bears some difficulties in occupation, is very courageous",
    ta: "செல்வாக்கு; குட்டையான உடல்; கோபமும் பெருமையும்; வெப்பத்தால் உடலில் கோளாறு; தாயை இழக்க நேரும்; கட்டிடம், அமைதி, மகிழ்ச்சியில் சிரமம்; மனைவி வழியில் தொந்தரவு; தொழிலில் சில சிரமம்; மிகத் துணிச்சலானவர்.",
  },
  {
    sign: "Scorpio", planet: "Mercury", page: 174,
    en: "Gets gains and income, is of gentle behaviour and gentle nature, has a long life, gains in occupation, takes full care of family through the power of income",
    ta: "ஆதாயமும் வருமானமும்; மென்மையான நடத்தையும் குணமும்; நீண்ட ஆயுள்; தொழிலில் ஆதாயம்; வருமான வலிமையால் குடும்பத்தை முழுமையாகக் கவனிப்பார்.",
  },
  {
    sign: "Scorpio", planet: "Jupiter", page: 176,
    en: "Is very wise, learned, religious and is a diplomat, gets the strength of wealth, gets children, gets progress through son, takes great care of family and occupation, loves justice, loves astrology, possesses spiritual knowledge, influential, keeps faith in God",
    ta: "மிகுந்த ஞானம், கல்வி, மதப்பற்று; இராஜதந்திரி; செல்வத்தின் வலிமை; குழந்தைகள்; மகன் வழியில் முன்னேற்றம்; குடும்பத்தையும் தொழிலையும் கவனிப்பார்; நீதியை விரும்புவார்; ஜோதிடத்தில் ஆர்வம்; ஆன்மிக அறிவு; கடவுள் நம்பிக்கை; செல்வாக்குள்ளவர்.",
  },
  {
    sign: "Scorpio", planet: "Venus", page: 178,
    en: "Gets a good occupation, spends majestically, works very carefully, acquires some happiness in the house of wife, spends much, gets some weakness on account of wife, goes from place to place due to occupation, gets honour, is clever and wants to enjoy pleasures of high standard, conducts the worldly affairs very ably, is skilful, careful and farsighted, likes beauty",
    ta: "நல்ல தொழில்; கம்பீரமாக செலவு; மிகக் கவனமாக வேலை; மனைவியால் சிறு மகிழ்ச்சி; நிறைய செலவு; மனைவி வகையில் சிறு பலவீனம்; தொழிலுக்காக ஊர்விட்டு ஊர் செல்வார்; மரியாதை; உயர்தர இன்பங்களை விரும்புவார்; உலக விவகாரங்களை திறமையாக நடத்துவார்; தூரநோக்குள்ளவர்; அழகை விரும்புவார்.",
  },
  {
    sign: "Scorpio", planet: "Saturn", page: 180,
    en: "Is very energetic and zealous, gets the power of brothers and sisters, acquires progress in occupation, some perplexity in the house of government and big business, possesses pungency, wants sexual pleasures, labours hard for progress, is industrious and courageous",
    ta: "மிகுந்த ஆற்றலும் ஆர்வமும்; சகோதர சகோதரிகளின் பலம்; தொழிலில் முன்னேற்றம்; அரசு, பெரிய வியாபாரத்தில் சில குழப்பம்; கூர்மையான பேச்சு; பாலியல் இன்பத்தை விரும்புவார்; முன்னேற்றத்துக்கு கடின உழைப்பு; உழைப்பாளி, தைரியசாலி.",
  },
  {
    sign: "Scorpio", planet: "Rahu", page: 182,
    en: "Gets emaciated physique, gets physical shocks many times, unable to maintain the gentle nature, undertakes very strong tactics to acquire some great power, is very courageous and clever",
    ta: "மெலிந்த உடல்; பல முறை உடல் அதிர்ச்சி; மென்மையான குணத்தைக் காக்க முடியாதவர்; பெரும் சக்தி பெற வலிமையான தந்திரங்கள்; மிகுந்த தைரியமும் சாமர்த்தியமும்.",
  },
  {
    sign: "Scorpio", planet: "Ketu", page: 184,
    en: "Gets weakness and wounds in the body, has great patience in his heart, does not care for anybody before his excessive strength, is of heroic nature, feels the deficiency of knowledge, possesses sensual power very much, bears more troubles, is anxious and solemn",
    ta: "உடலில் பலவீனமும் காயங்களும்; இதயத்தில் பெரும் பொறுமை; தன் பலத்தை முன்னிட்டு யாரையும் மதிக்காதவர்; வீர குணம்; அறிவு குறைவாக உணர்வார்; புலனின்பத்தில் மிகுந்த ஆற்றல்; மேலும் துன்பங்கள்; கவலையும் கம்பீரமும்.",
  },
  {
    sign: "Sagittarius", planet: "Sun", page: 189,
    en: "Is very fortunate and handsome, follows Dharma and benevolence, possesses faith in God, gets success in occupation, has influence in the matters connected with wife and family also, is very influential and illustrious",
    ta: "மிக அதிர்ஷ்டசாலி, அழகானவர்; தர்மத்தையும் கருணையையும் கடைப்பிடிப்பார்; கடவுள் நம்பிக்கை; தொழிலில் வெற்றி; மனைவி, குடும்ப விஷயங்களிலும் செல்வாக்கு; மிகுந்த செல்வாக்கும் புகழும்.",
  },
  {
    sign: "Sagittarius", planet: "Moon", page: 191,
    en: "Has a long life, experiences some weakness and deficiency in the handsomeness of the body, gets some worries in occupation, bears some perplexity in the house of wife",
    ta: "நீண்ட ஆயுள்; உடலின் அழகில் சிறு பலவீனம்; தொழிலில் சில கவலைகள்; மனைவி வீட்டில் சிறு குழப்பம்.",
  },
  {
    sign: "Sagittarius", planet: "Mars", page: 193,
    en: "Travels much, has a weak physique, does high standard tasks, gets work done by talking very cunningly and implicating others, experiences loss of mother, gets the conjunction of loss and distress in wife's house, laces great restlessness in the daily routine of life, spends much, has some deficiency in the children's side",
    ta: "நிறைய பயணம்; பலவீனமான உடல்; உயர்தர வேலைகள் செய்வார்; தந்திரமாகப் பேசி பிறரை சிக்க வைத்து வேலை முடிப்பார்; தாய் வகையில் இழப்பு; மனைவி வீட்டில் இழப்பும் துன்பமும்; தினசரி வாழ்வில் பெரும் அமைதியின்மை; அதிகம் செலவழிப்பார்; குழந்தைகள் வகையில் சிறு குறை.",
  },
  {
    sign: "Sagittarius", planet: "Mercury", page: 195,
    en: "Conducts an elegant and dexterous occupation, is very industrious and also sinful, possesses good knowledge of worldly affairs and gets satisfactory success in worldly affairs, achieves honour in domestic affairs, gets an influential wife, faces loss in sexual pleasure and respect, has deficiency in the house of father, is very clever, intelligent and a good manager",
    ta: "நேர்த்தியும் சாமர்த்தியமும் உள்ள தொழில்; மிகுந்த உழைப்பாளி, ஆனால் பாவச் செயலும் உண்டு; உலக விவகாரங்களில் நல்ல அறிவு; குடும்பத்தில் மரியாதை; செல்வாக்குள்ள மனைவி; பாலியல் இன்பத்திலும் மரியாதையிலும் இழப்பு; தந்தை வகையில் குறை; திறமையான, அறிவாளியான நிர்வாகி.",
  },
  {
    sign: "Sagittarius", planet: "Jupiter", page: 197,
    en: "Enjoys happiness and gets honour, possesses a bulky body, is respectable and loves peace, wants sweet and delicious food, gets happiness from wife, has a comfortable occupation, lives at his own place, gets the happiness of education and Dharma, gets children, is fortunate",
    ta: "மகிழ்ச்சியும் மரியாதையும்; பருமனான உடல்; மதிப்புக்குரியவர், அமைதியை விரும்புவார்; இனிப்பு உணவு விருப்பம்; மனைவியால் மகிழ்ச்சி; வசதியான தொழில்; சொந்த இடத்தில் வாழ்வு; கல்வி, தர்மத்தில் மகிழ்ச்சி; குழந்தைகள்; அதிர்ஷ்டசாலி.",
  },
  {
    sign: "Sagittarius", planet: "Venus", page: 199,
    en: "Gets income due to his physical labours, gets some disease in body, pays great attention to his occupation, faces some perplexity and also advantage in the wife's house, earns very much, suppresses the enemies, wants ornamentation and joy",
    ta: "உடல் உழைப்பால் வருமானம்; உடலில் சில நோய்; தொழிலில் பெரும் கவனம்; மனைவி வீட்டில் சிக்கலும் ஆதாயமும்; நிறைய சம்பாதிப்பார்; எதிரிகளை அடக்குவார்; அலங்காரத்தையும் மகிழ்ச்சியையும் விரும்புவார்.",
  },
  {
    sign: "Sagittarius", planet: "Saturn", page: 201,
    en: "Very energetic and industrious, increases wealth working diligently, gets the strength of brothers and sisters, some restlessness in his body, conducts a big business, gets the power of wife and father",
    ta: "மிகுந்த ஆற்றலும் உழைப்பும்; கடின உழைப்பால் செல்வம் பெருக்குவார்; சகோதர சகோதரிகளின் பலம்; உடலில் சில அமைதியின்மை; பெரிய வியாபாரம்; மனைவி, தந்தை வகையில் வலிமை.",
  },
  {
    sign: "Sagittarius", planet: "Rahu", page: 203,
    en: "Bears physical distress and worry, gets the deficiency in handsomeness of body and sometimes bears physical blows, faces risk of his body, gets the work done with tactics, undertakes very difficult deeds for his progress, sometimes has to depend on others",
    ta: "உடல் துன்பமும் கவலையும்; உடலின் அழகில் குறை; சில நேரம் உடல் அடிகள்; உடலுக்கு ஆபத்து; தந்திரத்தால் வேலை முடிப்பார்; முன்னேற்றத்துக்கு மிகக் கடினமான செயல்கள்; சில நேரம் பிறரைச் சார்ந்திருக்க வேண்டும்.",
  },
  {
    sign: "Sagittarius", planet: "Ketu", page: 205,
    en: "Is of tall stature, is brave, diligent and conceited, also superstitious and careless, gets deficiency in physical handsomeness, thinks himself to be great, has the power of concealment and bravery, is selfish",
    ta: "உயரமானவர், தைரியசாலி, கடின உழைப்பாளி; ஆனால் கர்வம், மூட நம்பிக்கை, கவனக்குறைவு; உடல் அழகில் குறை; தன்னை பெரியவராக நினைப்பார்; மறைக்கும் ஆற்றலும் வீரமும்; சுயநலம்.",
  },
  {
    sign: "Capricorn", planet: "Sun", page: 210,
    en: "Bears physical affliction and does difficult works, gets diseases like smallpox and syphilis, has a long life, has some restlessness in life, feces some calamity in the house of wife, bears some perplexity in the house of education, has some deficiency in charm and complexion, is haughty, and gets the power of concealment",
    ta: "உடல் துன்பமும் கடின வேலைகளும்; அம்மை, சிபிலிஸ் போன்ற நோய்கள்; நீண்ட ஆயுள்; வாழ்வில் சிறு அமைதியின்மை; மனைவி வீட்டில் சில ஆபத்து; கல்வியில் சிறு சிக்கல்; அழகிலும் நிறத்திலும் குறை; கர்வம்; மறைக்கும் ஆற்றல்.",
  },
  {
    sign: "Capricorn", planet: "Moon", page: 212,
    en: "Conducts the occupation through a high standard of concentration, has some deficiency in the beauty and happiness in wife's house, wants sexual pleasures very much and gets the same, is of white complexion, is very diligent",
    ta: "உயர்தர கவனத்துடன் தொழில் நடத்துவார்; மனைவி வீட்டில் அழகிலும் மகிழ்ச்சியிலும் குறை; பாலியல் இன்பத்தை மிகவும் விரும்பி அடைவார்; வெள்ளை நிறம்; மிகுந்த உழைப்பாளி.",
  },
  {
    sign: "Capricorn", planet: "Mars", page: 214,
    en: "Gets happiness very much, gets lot of property and gains, speciality in mother's house, gets deficiency in occupation and also from wife's house, deficiency in sexual pleasures, creates the means of happiness in the side of occupation and sexual pleasures Is self conceited and proud",
    ta: "மிகுந்த மகிழ்ச்சி, பெரும் சொத்து, ஆதாயம்; தாய் வீட்டில் சிறப்பு; தொழிலிலும் மனைவி வீட்டிலும் குறை; பாலியல் இன்பத்தில் குறை; தொழிலிலும் பாலியல் இன்பத்திலும் மகிழ்ச்சிக்கான வழி; தன்னம்பிக்கை மிக்கவர், பெருமை.",
  },
  {
    sign: "Capricorn", planet: "Mercury", page: 216,
    en: "Is clever, fortunate, gentle and influential, has faith in Dharma, gets victory over enemies, gets some ordinary diseases in physique, pursues the occupation, has ordinary liking for sexual pleasures",
    ta: "திறமையானவர், அதிர்ஷ்டசாலி, மென்மையானவர், செல்வாக்குள்ளவர்; தர்மத்தில் நம்பிக்கை; எதிரிகளை வெல்வார்; உடலில் சாதாரண நோய்கள்; தொழிலைக் கவனிப்பார்; பாலியல் இன்பத்தில் சாதாரண ஆர்வம்.",
  },
  {
    sign: "Capricorn", planet: "Jupiter", page: 218,
    en: "Bears physical troubles and has an emaciated body, has deficiency in expenditure, has weakness from the side of brothers and sisters, has deficiency in physical handsomeness, gets some elegance in the wife's house, acquires the progress of occupation, gains strength from children's side",
    ta: "உடல் துன்பமும் மெலிந்த உடலும்; செலவில் குறை; சகோதர சகோதரிகள் வகையில் பலவீனம்; உடல் அழகில் குறை; மனைவி வீட்டில் சிறு நயம்; தொழிலில் முன்னேற்றம்; குழந்தைகள் வகையில் பலம்.",
  },
  {
    sign: "Capricorn", planet: "Venus", page: 220,
    en: "Is very respectable, clever, wise and does very nice and high standard deeds, pursues big occupation, gets honour and advantage from father, gets advantage from the government, gets respect in public, does many occupations, enjoys the sexual pleasures and gets the happiness of children, likes beauty, and is very much a lover of astrology",
    ta: "மிகுந்த மரியாதை, திறமை, ஞானம்; மிக நல்ல, உயர்தரமான செயல்கள்; பெரிய தொழில்; தந்தை வழியில் மரியாதையும் ஆதாயமும்; அரசிடமிருந்து ஆதாயம்; பொதுவெளியில் மரியாதை; பல தொழில்கள்; பாலியல் இன்பமும் குழந்தைகளின் மகிழ்ச்சியும்; அழகை விரும்புவார்; ஜோதிடத்தில் பெரும் ஆர்வம்.",
  },
  {
    sign: "Capricorn", planet: "Saturn", page: 222,
    en: "Is very rich, lives aristocratically, wears costly dresses, gets progress from father's house, pursue a big business occupation, deficiency in brothers' house, gets name and honour in the society, gets some opposition in family and is honourable",
    ta: "மிகுந்த செல்வம், ஆடம்பர வாழ்வு, விலையுயர்ந்த ஆடை; தந்தை வீட்டு முன்னேற்றம்; பெரிய வணிகத் தொழில்; சகோதரர் வகையில் குறை; சமூகத்தில் பெயரும் மரியாதையும்; குடும்பத்தில் சில எதிர்ப்பு; மரியாதைக்குரியவர்.",
  },
  {
    sign: "Capricorn", planet: "Rahu", page: 224,
    en: "Bears some physical perplexity and feels a sort of intoxication, some deficiency in his body, finds the way of progress very cleverly and through the power of concealment, gets some firmness after bearing some worries, gets his work done through very gentle manner not caring for truth or falsehood",
    ta: "சில உடல் குழப்பமும் போதை போன்ற உணர்வும்; உடலில் சிறு குறை; மறைக்கும் ஆற்றலால் முன்னேற்றப் பாதையைத் தேடுவார்; கவலைகளுக்குப் பின் சிறு உறுதி; உண்மையையோ பொய்யையோ கருதாமல் மென்மையாக வேலை முடிப்பார்.",
  },
  {
    sign: "Capricorn", planet: "Ketu", page: 226,
    en: "Is very obstinate, gets wounds in the body, bears some physical worries, does not care about disrepute for acquiring the fame, does not care about the troubles, is physically passionate, gets his work done through secret means, is selfish",
    ta: "மிகவும் பிடிவாதமானவர்; உடலில் காயங்கள்; உடல் கவலைகள்; புகழுக்காக அவமானத்தைப் பொருட்படுத்தாதவர்; தொல்லைகளைக் கவனியாதவர்; உடல் ஆசை மிகுந்தவர்; மறைவான வழிகளில் வேலை முடிப்பார்; சுயநலம்.",
  },
  {
    sign: "Aquarius", planet: "Sun", page: 231,
    en: "Gets influential wife and pursues influential occupation, gets some weakness in the body, gets the power of enjoying sexual pleasures, gives much dignity to wife with some enmity, gets honour, possesses vigour, and feels unsatisfied even on accomplishing big tasks",
    ta: "செல்வாக்குள்ள மனைவியும் செல்வாக்குள்ள தொழிலும்; உடலில் சிறு பலவீனம்; பாலியல் இன்பம் அனுபவிக்கும் ஆற்றல்; மனைவிக்கு மிகுந்த கௌரவம், சிறு பகை; மரியாதை; வலிமை; பெரிய பணிகளை முடித்தாலும் திருப்தி இல்லாதவர்.",
  },
  {
    sign: "Aquarius", planet: "Moon", page: 234,
    en: "Gets honour through the power of concentration, suffers from physical perplexities and from cold, gets some mental disorder, faces struggle with wife, uses secret policies in the line of occupation",
    ta: "ஒருமுகப்பட்ட மனத்தால் மரியாதை; உடல் துன்பங்களும் குளிர் பாதிப்பும்; சில மன நோய்; மனைவியுடன் போராட்டம்; தொழிலில் மறைமுக வழிகள்.",
  },
  {
    sign: "Aquarius", planet: "Mars", page: 236,
    en: "Progresses due to the vigour of his body, uses good working power and courage, secures the association of father and brother in an ordinary way, faces uneasiness in the side of mother, acquires progress in occupation, achieves honour and good name with government and society, bears some perplexity in the wife's house, gets some seminal defects",
    ta: "உடல் வலிமையால் முன்னேற்றம்; நல்ல வேலைத் திறனும் தைரியமும்; தந்தை, சகோதரர் ஆதரவு சாதாரண அளவில்; தாய் வகையில் அசௌகரியம்; தொழிலில் முன்னேற்றம்; அரசு, சமூகத்தில் மரியாதையும் நல்ல பெயரும்; மனைவி வீட்டில் சிறு சிக்கல்; விந்து சம்பந்தமான குறைபாடு.",
  },
  {
    sign: "Aquarius", planet: "Mercury", page: 238,
    en: "Has a long life, spends the daily routine majestically, gets good education and wisdom, feces some perplexity in the side of children, has some friendship and some perplexity in the house of wife, uses shrewdness in business",
    ta: "நீண்ட ஆயுள்; நாள் வாழ்க்கை கம்பீரமாக; நல்ல கல்வியும் ஞானமும்; குழந்தைகள் வகையில் சில சிக்கல்; மனைவி வீட்டில் சில நட்பும் சிக்கலும்; வியாபாரத்தில் சாமர்த்தியம்.",
  },
  {
    sign: "Aquarius", planet: "Jupiter", page: 240,
    en: "Gets income and power of wealth by his diligence, gets the respect and honour of the body, gets advantage of children, education, utters good things, acquires the progress in destiny, gains from occupation, gets advantage in the house of wife, gets his wants satisfied, and is somewhat dependent",
    ta: "உழைப்பால் வருமானமும் செல்வ வலிமையும்; உடலில் மரியாதையும் கௌரவமும்; குழந்தைகள், கல்வியில் ஆதாயம்; நல்ல வார்த்தைகள் பேசுவார்; விதியில் முன்னேற்றம்; தொழிலில் ஆதாயம்; மனைவி வீட்டில் ஆதாயம்; ஆசைகள் நிறைவேறும்; சிறிது சார்ந்திருப்பவர்.",
  },
  {
    sign: "Aquarius", planet: "Venus", page: 242,
    en: "Enjoys happiness very much on account of his good luck, gets happiness from mother, gets lands and buildings, gets food, drink and clothes, rears the Dharma properly, gets the divine support and fame, gets the power of occupation and happiness of wife in connection with family with some enmity",
    ta: "நல்ல அதிர்ஷ்டத்தால் பெரும் மகிழ்ச்சி; தாயால் மகிழ்ச்சி; நிலமும் வீடும்; உணவு, பானம், உடை; தர்மத்தை சரியாகக் கடைப்பிடிப்பார்; தெய்வ ஆதரவும் புகழும்; தொழில் ஆற்றல்; மனைவி வகையில் மகிழ்ச்சி, சிறு பகை.",
  },
  {
    sign: "Aquarius", planet: "Saturn", page: 244,
    en: "Possesses will-power and self-respect, gets some fame, bears loss in the house of brother, faces affliction in the house of wife and father, gets weakness in occupation, business and prestige, gets weakness in the house of government and society",
    ta: "மன உறுதியும் சுயமரியாதையும்; சிறு புகழ்; சகோதரர் வகையில் இழப்பு; மனைவி, தந்தை வகையில் துன்பம்; தொழில், வியாபாரம், கௌரவத்தில் பலவீனம்; அரசு, சமூக வகையில் குறை.",
  },
  {
    sign: "Aquarius", planet: "Rahu", page: 246,
    en: "Gets some physical perplexity and faces some calamities, uses secret tactics, tries to work hard to acquire name and fame, is always busy in trying something to serve his selfishness",
    ta: "சில உடல் குழப்பமும் ஆபத்துகளும்; ரகசிய வழிகள்; பெயரும் புகழும் பெற கடினமாக உழைப்பார்; சுயநலத்துக்காக எதையாவது செய்வதில் எப்போதும் ஈடுபட்டிருப்பார்.",
  },
  {
    sign: "Aquarius", planet: "Ketu", page: 248,
    en: "Feels some deficiency in his body, does not care about the good or bad for others, is of firm determination",
    ta: "உடலில் குறை; பிறருக்கு நன்மையோ தீமையோ பற்றிக் கவலைப்படாதவர்; உறுதியான மனம்.",
  },
  {
    sign: "Pisces", planet: "Sun", page: 253,
    en: "Is very influential and gets victory over enemies, faces some distress in the physique, experiences some bondage, is very haughty, experiences troubles in wife's house and some deficiency in the side of sexual pleasures, feces some hindrances in occupation, and is very industrious",
    ta: "மிகுந்த செல்வாக்கு; எதிரிகளை வெல்வார்; உடலில் சில துன்பம்; சில கட்டுப்பாடுகள்; மிகுந்த கர்வம்; மனைவி வீட்டில் துன்பம்; பாலியல் இன்பத்தில் சிறு குறை; தொழிலில் சில தடைகள்; மிகுந்த உழைப்பாளி.",
  },
  {
    sign: "Pisces", planet: "Moon", page: 255,
    en: "Gets ideal strength of mind, has a peculiar splendour in education, has a dignity in speech, gets grandeur in children's side, gets beauty and satisfaction from wife, is attracted towards her, gets success in occupation, gets the strength of sexual pleasures, possesses hidden knowledge",
    ta: "சிறந்த மன வலிமை; கல்வியில் தனிச் சிறப்பு; பேச்சில் கௌரவம்; குழந்தைகள் வகையில் பெருமை; மனைவியால் அழகும் திருப்தியும்; அவரிடம் ஈர்ப்பு; தொழிலில் வெற்றி; பாலியல் இன்பத்தில் வலிமை; மறைந்த ஞானம்.",
  },
  {
    sign: "Pisces", planet: "Mars", page: 257,
    en: "Gets wealth due to destiny, follows Dharma, is thought to be fortunate, gets lands, buildings and happiness from mother, gets good fortune from wife's side, maintains an aristocratic standard in the daily life, gets the pleasures of the family",
    ta: "விதியால் செல்வம்; தர்மத்தைப் பின்பற்றுவார்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; நிலம், வீடு, தாய் வழியில் மகிழ்ச்சி; மனைவி வீட்டில் நல்ல அதிர்ஷ்டம்; அன்றாட வாழ்வில் கம்பீர தரம்; குடும்ப இன்பங்கள்.",
  },
  {
    sign: "Pisces", planet: "Mercury", page: 259,
    en: "Has a slim body, faces some deficiency in the happiness from mother, gets some weakness in buildings, lands and property, has some deficiency in wife's house, gets the progress in occupation after doing hard physical labour, enjoys more advantages in sexual affairs in an unjustified manner",
    ta: "மெலிந்த உடல்; தாய் வகையில் மகிழ்ச்சிக் குறை; நிலம், சொத்தில் சிறு பலவீனம்; மனைவி வீட்டில் சிறு குறை; கடின உடல் உழைப்புக்குப் பின் தொழில் முன்னேற்றம்; பாலியல் விஷயங்களில் நியாயமற்ற முறையில் அதிக ஆதாயம்.",
  },
  {
    sign: "Pisces", planet: "Jupiter", page: 261,
    en: "Gets dignity, does ideal deeds, possesses a host of worldly and divine qualities, has a good physique, gets support from the father, gets good education, gets the special power of the children, gets honour in government and society, gets honour in wife's side, lives majestically and possesses great self-respect",
    ta: "கௌரவம்; சிறந்த செயல்கள்; உலகியல், தெய்வீக குணங்கள்; நல்ல உடல்; தந்தை ஆதரவு; நல்ல கல்வி; குழந்தைகளால் சிறப்பு; அரசு, சமூகத்தில் மரியாதை; மனைவி வழியிலும் மரியாதை; கம்பீர வாழ்வு; மிகுந்த சுயமரியாதை.",
  },
  {
    sign: "Pisces", planet: "Venus", page: 264,
    en: "Is of tall stature, is very diligent and energetic, gets an increased age, spends life majestically, bears some deficiency in wife's house, faces some deficiency in diurnal occupation",
    ta: "உயரமானவர்; மிகுந்த உழைப்பாளி, ஆற்றல் மிக்கவர்; ஆயுள் அதிகரிக்கும்; கம்பீரமாக வாழ்வார்; மனைவி வீட்டில் சிறு குறை; அன்றாட தொழிலில் சில குறைகள்.",
  },
  {
    sign: "Pisces", planet: "Saturn", page: 266,
    en: "Is physically weak internally hut appears to be good from the outside, faces opposition from father, has some friendly and some weak relation with the brother, bears losses in the house of wife, labours hard in occupation, finds some hindrance in the government and society",
    ta: "உள்ளே உடல் பலவீனம், வெளியே நன்றாகத் தெரிவார்; தந்தைக்கு எதிர்ப்பு; சகோதரருடன் சில நட்பும் சில பலவீனமும்; மனைவி வீட்டில் இழப்புகள்; தொழிலில் கடின உழைப்பு; அரசு, சமூகத்தில் சில தடைகள்.",
  },
  {
    sign: "Pisces", planet: "Rahu", page: 268,
    en: "Feels physical anxieties and experiences some physical deficiency, sometimes experiences blows on the body, gets his work done very cleverly and cautiously, does very laborious deeds, follows secret tactics",
    ta: "உடலில் கவலைகளும் சில குறைகளும்; சில நேரம் உடலில் அடிகள்; வேலையை மிக சாமர்த்தியமாகவும் எச்சரிக்கையாகவும் முடிப்பார்; மிகக் கடினமான செயல்கள்; மறைமுக வழிகள்.",
  },
  {
    sign: "Pisces", planet: "Ketu", page: 270,
    en: "Bears fatal blows on his body and passes through some clangers, also faces some deficiency in the handsomeness of physique, experiences bondage and dependence, uses his strength secretly",
    ta: "உடலில் ஆபத்தான அடிகள்; சில ஆபத்துகளில் சிக்குவார்; உடல் அழகில் குறை; பந்தமும் சார்புநிலையும்; தன் பலத்தை மறைவாகப் பயன்படுத்துவார்.",
  },
];

module.exports = { FIRST_HOUSE };
