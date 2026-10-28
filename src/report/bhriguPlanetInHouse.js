/**
 * T.M. Rao's Bhrigu Samhita, "Predictions of <planet> in <lagna> Ascendant": the entries for the planets in the 1st and
 * 2nd houses from each lagna (9 planets x 12 lagnas x 2 houses = 216). Each entry is the book's prose as printed (`en`, joined
 * from the page extract; OCR slips are kept), its Tamil summary (`ta`, ours) and the printed page the entry starts on.
 * `planetSign` is the sign the planet stands in (the lagna itself for house 1, the next sign for house 2).
 * The printed page is the scan's page number plus five, checked against the printed numbers in the scan and the page
 * images for Libra (p.156) and Leo (p.104). Extracted by scratch scripts; the text is the book's.
 */

const PLANET_IN_HOUSE = [
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Sun", page: 21,
    en: "The native is learned, gets good education, self-knowledge, is of tall stature, happy with children, mentally shrewd, somewhat deficient in the house of wife, lacks sexual interest, and does not care for occupational pursuits",
    ta: "கற்றவர், நல்ல கல்வி, சுய அறிவு; உயரமானவர்; குழந்தைகளால் மகிழ்ச்சி; அறிவுக் கூர்மை; மனைவி வழியில் சிறு குறை; பாலியல் ஆர்வம் குறைவு; தொழிலில் அக்கறை குறைவு.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Moon", page: 23,
    en: "Gets happiness and enjoys all pleasures, gets mother's affection and enjoys land and house, good-looking, happiness from wife, sexual pleasure, gets success, respect in occupation, contact with good helpers and enjoys luxury",
    ta: "இன்பம் அனுபவிப்பவர்; தாயின் அன்பு; நிலம், வீடு வசதி; அழகானவர்; மனைவியால் மகிழ்ச்சி; தொழிலில் வெற்றியும் மரியாதையும்; நல்ல உதவியாளர்கள்; ஆடம்பர வாழ்வு.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Mars", page: 25,
    en: "Gets fame and physical greatness, has spiritual powers with mother not encouraging, lacking happiness from wife and family pleasures, is restless",
    ta: "புகழும் உடல் வலிமையும் பெறுவார்; தாயின் ஆதரவு குறைவு; மனைவி, குடும்ப இன்பம் குறைவு; அமைதியற்றவர்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Mercury", page: 27,
    en: "Sisters and brothers are friendly, gets help from maternal grandfather's side, overcomes enemies, able to get over disputes and hindrances, gets his work done cleverly, support from wife and family, improves his working conditions with planning and industry",
    ta: "உடன்பிறப்புகள் நட்புடன்; தாய்வழி தாத்தாவிடம் உதவி; எதிரிகளை வெல்வார்; தடைகளைத் தாண்டுவார்; திட்டமிட்டு வேலை செய்வார்; மனைவி, குடும்ப ஆதரவு; உழைப்பால் வேலை நிலை மேம்படும்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Jupiter", page: 29,
    en: "Handsome, fortunate and honoured, spending in a right way, maintains good health, religious, has children, well-educated, domestic happiness, successful in occupations, good forethought and kind-hearted",
    ta: "அழகும் அதிர்ஷ்டமும் மரியாதையும்; நல்ல வழியில் செலவு; நல்ல உடல்நலம்; தர்ம சிந்தனை; குழந்தைகள்; நல்ல கல்வி; குடும்ப மகிழ்ச்சி; தொழிலில் வெற்றி; இரக்க குணம்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Venus", page: 31,
    en: "Has a good profession, earns wealth, possesses beautiful wife and enjoys good sexual pleasures, artistic and clever, good family, very able and successful in worldly affairs, enjoy the domestic life, skilful and honourable",
    ta: "நல்ல தொழில், செல்வம்; அழகான மனைவி; நல்ல பாலியல் இன்பம்; கலையிலும் அறிவிலும் திறமை; நல்ல குடும்பம்; உலக விவகாரங்களில் வெற்றி; மதிப்புக்குரியவர்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Saturn", page: 33,
    en: "Not attractive in appearance, no happiness from father, is dependent, has to work hard for money, is very industrious and energetic, gives special importance to wife and is a bit lazy",
    ta: "அழகற்ற தோற்றம்; தந்தையால் மகிழ்ச்சி இல்லை; பிறரைச் சார்ந்திருப்பவர்; பணத்துக்கு கடின உழைப்பு; மிகுந்த முயற்சி; மனைவிக்கு முக்கியத்துவம்; சிறிது சோம்பல்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Rahu", page: 35,
    en: "Feels sickly and has a diseased face, courageous, becomes popular, makes unauthorised efforts, secretive, faces the calamities bravely",
    ta: "உடல்நலக் குறைவு, முகத்தில் நோய் அடையாளம்; தைரியசாலி; பிரபலமாவார்; அனுமதியின்றி முயற்சிகள்; ரகசியமானவர்; ஆபத்துகளை தைரியமாக எதிர்கொள்வார்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Ketu", page: 37,
    en: "Feels restless and is weak in body, may experience some fatal stroke of pain, has good patience, not under pressure from others, rash and obstinate, lacks self-confidence",
    ta: "உடல் பலவீனம், அமைதியின்மை; ஆபத்தான வலி ஏற்படலாம்; பொறுமை; பிறர் அழுத்தத்துக்கு உட்படாதவர்; முரட்டுத்தனமும் பிடிவாதமும்; தன்னம்பிக்கை குறைவு.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Sun", page: 42,
    en: "Gets some landed property and also happiness through occupation, happiness through wife and family, and also sexual pleasures",
    ta: "சில நிலச் சொத்து; தொழிலில் மகிழ்ச்சி; மனைவி, குடும்ப இன்பம்; பாலியல் இன்பமும்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Moon", page: 44,
    en: "Help from brothers and sisters, courageous and ambitious, little unhappy with wife and also with profession and also in sexual pleasures, feels restless in domestic alfairs",
    ta: "சகோதர சகோதரிகளின் உதவி; தைரியமும் லட்சியமும்; மனைவி, தொழில், பாலியல் இன்பத்தில் சிறு அதிருப்தி; குடும்ப விவகாரங்களில் அமைதியின்மை.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Mars", page: 46,
    en: "Blood gets impure, expenditure in daily life, gives importance to wife and not to mother, happiness through lands and buildings, wanders, toils hard and is somewhat restless in family",
    ta: "ரத்தம் கெட்டுப்போகும்; தினசரி செலவு; மனைவிக்கு முக்கியத்துவம், தாயிடம் குறைவு; நிலம், கட்டிடத்தால் மகிழ்ச்சி; அலைச்சல்; கடின உழைப்பு; குடும்பத்தில் சிறு அமைதியின்மை.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Mercury", page: 48,
    en: "Gets wisdom and education, earns wealth with discriminations, looks handsome, respect in family and through wife, has the desires of sexual pleasure, becomes rich and clever",
    ta: "ஞானமும் கல்வியும்; விவேகத்துடன் பொருள் ஈட்டுவார்; அழகானவர்; குடும்பத்திலும் மனைவி வழியிலும் மரியாதை; பாலியல் ஆசை; பணக்காரர், திறமையானவர்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Jupiter", page: 50,
    en: "Clever, suffers from some health problems, gets importance and dignity in the daily routine, good education, sufferings of children",
    ta: "திறமையானவர்; சில உடல்நலப் பிரச்சினைகள்; அன்றாட வாழ்வில் முக்கியத்துவமும் கௌரவமும்; நல்ல கல்வி; குழந்தைகளால் துன்பம்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Venus", page: 52,
    en: "Proud, gains from wife, keeps huge influence in the house of enemies, success in daily occupation, gets some disease, is of firm determination, and is obstinate",
    ta: "பெருமைக்காரர்; மனைவியால் ஆதாயம்; எதிரிகள் இடத்தில் செல்வாக்கு; அன்றாட தொழிலில் வெற்றி; சில நோய்; உறுதியான மனம், பிடிவாதம்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Saturn", page: 54,
    en: "Influential, thought to be fortunate, gets the respect from father, government and society, interested in politics and tries hard for progress, not much help from brothers and sisters, enmity with wife, deficiency in sexual pleasures, does hard work, and is obstinate",
    ta: "செல்வாக்குள்ளவர்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; தந்தை, அரசு, சமூகத்தில் மரியாதை; அரசியலில் ஆர்வம்; சகோதரர் ஆதரவு குறைவு; மனைவியுடன் பகை; பாலியல் இன்பக் குறைவு; கடின உழைப்பு; பிடிவாதம்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Rahu", page: 56,
    en: "Weak constitution, gets worries and anxieties, secretive and clever, is courageous",
    ta: "பலவீனமான உடல்; கவலைகளும் பதற்றமும்; ரகசியமானவர், புத்திசாலி; தைரியசாலி.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Ketu", page: 58,
    en: "Weakness in body and mentally backward, restlessness, secretive and brave, and becomes unfair",
    ta: "உடல் பலவீனம், மனத்தில் பின்தங்கல்; அமைதியின்மை; ரகசியமானவர், வீரம்; நியாயமற்ற செயல்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Sun", page: 62,
    en: "Does influential deeds, has the support of brothers and sisters, works with great strength and influence in the house of wife, increase in the strength of sexual pleasures",
    ta: "செல்வாக்குள்ள செயல்கள்; சகோதர சகோதரிகளின் ஆதரவு; மனைவி வழியில் வலிமையுடன் செயல்படுவார்; பாலியல் இன்பம் அதிகரிக்கும்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Moon", page: 64,
    en: "Gets wealth and looks handsome, beauty in the house of wife, success in daily occupation, wears costly things, more attention in the side of sexual pleasures, respect from father-in-law, is of stable mind",
    ta: "செல்வம், அழகான தோற்றம்; மனைவி வழியில் அழகு; தினசரி தொழிலில் வெற்றி; விலையுயர்ந்த பொருட்கள்; பாலியல் இன்பத்தில் அதிக கவனம்; மாமனாரிடம் மரியாதை; நிலையான மனம்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Mars", page: 66,
    en: "Gains through physical labour, gets huge gains, gets some diseases and weakness in the body, restlessness in the house of mother, some hindrance in peace and happiness, keeps influence in the house of enemies, some anxiety in the house of wife, somewhat rash",
    ta: "உடல் உழைப்பால் பெரும் ஆதாயம்; சில நோய்கள், உடல் பலவீனம்; தாய் வகையில் அமைதியின்மை; மகிழ்ச்சிக்கு தடைகள்; எதிரிகள் இடத்தில் செல்வாக்கு; மனைவி பற்றி சிறு கவலை; சிறிது அவசரம்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Mercury", page: 68,
    en: "Is very handsome and is of good body, has the strength of lands and buildings, strength from others, happy in the occupation, gets honour, self-knowledge, happiness from wife and happy",
    ta: "மிக அழகானவர், நல்ல உடல்; நிலம், கட்டிடத்தால் வலிமை; பிறரிடம் இருந்து பலம்; தொழிலில் மகிழ்ச்சி; மரியாதை; சுய அறிவு; மனைவியால் மகிழ்ச்சி.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Jupiter", page: 70,
    en: "Gets importance in the house of wife, has an occupation which gives special importance, help from father, gains from government and society, gets strength of children, gains good education, gets good healthy body, works hard",
    ta: "மனைவி வழியில் முக்கியத்துவம்; சிறப்புப் பதவி தரும் தொழில்; தந்தையின் ஆதரவு; அரசு, சமூகத்தில் ஆதாயம்; குழந்தைகளின் பலம்; நல்ல கல்வி; ஆரோக்கியமான உடல்; கடின உழைப்பு.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Venus", page: 72,
    en: "Healthy body, has strength of mind, clever, deficiency with regard to loss of children, speaks much on wife and sexual pleasures",
    ta: "ஆரோக்கியமான உடல்; மன வலிமை; திறமையானவர்; குழந்தைகளை இழக்கும் குறை; மனைவி, பாலியல் இன்பம் பற்றி அதிகம் பேசுவார்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Saturn", page: 74,
    en: "Fortunate, worries about progress, good longevity, worry in the house of brothers and sisters",
    ta: "அதிர்ஷ்டசாலி; முன்னேற்றம் பற்றிய கவலை; நீண்ட ஆயுள்; சகோதர சகோதரிகள் வகையில் கவலை.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Rahu", page: 76,
    en: "Gets tall stature, follows deep and bitter policies in heart, has self- pride, succeeds in getting fame, moves his ideas more than necessary beyond limit, has spiritual knowledge",
    ta: "உயரமான உடல்; இதயத்தில் ஆழமான, கசப்பான கொள்கைகள்; தன்னம்பிக்கை மிகுதி; புகழ் பெறுவார்; எண்ணங்களை அளவுக்கு மீறி பரப்புவார்; ஆன்மிக அறிவு.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Ketu", page: 78,
    en: "Great weakness and anxiety in the body, deficiency of beauty, sometimes gets some fatal stroke or danger to body, feels weakness in heart, has great sense of patience, secretive and obstinate fellow",
    ta: "உடலில் பெரும் பலவீனமும் கவலையும்; அழகில் குறை; சில நேரம் உயிருக்கு ஆபத்தான அடி; இதயத்தில் பலவீனம்; மிகுந்த பொறுமை; ரகசியமானவர், பிடிவாதம்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Sun", page: 82,
    en: "Is dignified and wealthy, glorious, some dullness in the gains from the side of wife and occupational pursuits and in addition feels some hindrances also, possesses family",
    ta: "செல்வமும் கௌரவமும்; மனைவி வழி வருமானத்தில் மந்தம், தொழிலிலும் தடைகள்; குடும்பம் அமையும்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Moon", page: 85,
    en: "Is of fair complexion and symmetrical body, can control the desires, is a stable person, has self-respect, pays final attention to the family circumstances, day-to-day affairs and occupation, wants and gets pleasures, is respected, acts according to his own will, lives independent, some problem in the house of wife, is famous and is of stable mind",
    ta: "நல்ல நிறம், சீரான உடல்; ஆசைகளைக் கட்டுப்படுத்துவார்; நிலையான குணம்; சுயமரியாதை; குடும்பம், தொழில் மீது கவனம்; மரியாதை பெறுவார்; சுதந்திரமானவர்; மனைவி வழியில் சில சிக்கல்; புகழ்; நிலையான மனம்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Mars", page: 87,
    en: "Is not influential, does not get good respect from parents, pays great attention to occupation, some respect in the house of wife, unhappy with children, lacks in education, dullness in life, wants some sexual pleasures",
    ta: "செல்வாக்கு குறைவு; பெற்றோரிடம் நல்ல மரியாதை இல்லை; தொழிலில் அதிக கவனம்; மனைவி வழியில் சில மரியாதை; குழந்தைகளால் அதிருப்தி; கல்வியில் குறை; வாழ்வில் சலிப்பு; சில பாலியல் ஆசை.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Mercury", page: 89,
    en: "Has a good physique, spends majestically, is a businessman and courageous, much strength in occupation and domestic affairs, some deficiency in the house of brothers and sisters, is respectable, goes to foreign countries",
    ta: "நல்ல உடல்; பெருமையுடன் செலவு செய்வார்; வணிகர், தைரியசாலி; தொழிலிலும் குடும்பத்திலும் வலிமை; உடன்பிறப்பு வகையில் சிறு குறை; மரியாதைக்குரியவர்; வெளிநாடு செல்வார்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Jupiter", page: 91,
    en: "Is self-conscious, dignified, fortunate, virtuous, brave in heart, likes justice and truth, understands Dharma and vice very much, gets great respect, is of golden complexion and handsome, is very intelligent and has broad forehead, is of tall stature, has children, some deficiency in sexual pleasures, is a bit careless regarding family, has the power of influence, is learned and loves strongly, very clever, defeats his enemies",
    ta: "தன்னுணர்வும் கௌரவமும் அதிர்ஷ்டமும் நல்லொழுக்கமும்; இதயத்தில் தைரியம்; நீதியையும் உண்மையையும் விரும்புவார்; தர்மத்தையும் தீமையையும் நன்கு அறிவார்; மிகுந்த மரியாதை; அழகும் பொன்னிறமும்; அறிவாளி; குழந்தைகள்; பாலியல் இன்பத்தில் சிறு குறை; குடும்பத்தில் சிறிது அசட்டை; கற்றவர்; பகைவரை வெல்வார்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Venus", page: 93,
    en: "Gets power of mother, keeps the body handsome and in comfort, gets buildings and property, gets happiness in the house of wife, gains and happiness in the daily occupation, calm nature and success in family and worldly affairs",
    ta: "தாயின் ஆதரவு; அழகான உடல், வசதி; நிலம், சொத்து; மனைவி வழியில் மகிழ்ச்சி; தொழிலில் ஆதாயம்; அமைதியான குணம்; குடும்ப, உலக விவகாரங்களில் வெற்றி.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Saturn", page: 95,
    en: "Pursues daily occupation diligently, good longevity, not satisfied with wife, works with high and obscure tactics in connection with sexual pleasures, hardships in connection with occupation, carelessness in the house of government and in the house of father, avaricious and careless",
    ta: "அன்றாட தொழிலில் கடின உழைப்பு; நீண்ட ஆயுள்; மனைவியிடம் திருப்தி குறைவு; பாலியல் விஷயத்தில் மறைமுக வழிகள்; தொழிலில் சிரமங்கள்; அரசு, தந்தை வகையில் அசட்டை; பேராசையும் அசட்டையும்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Rahu", page: 97,
    en: "Some deficiency and some calamity in the body, mental distress, anxiety in his thoughts, struggles for the rise in the happiness",
    ta: "உடலில் சில குறைகளும் ஆபத்தும்; மனத் துன்பம்; எண்ணங்களில் கவலை; மகிழ்ச்சி உயர போராட்டம்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Ketu", page: 99,
    en: "Weakness in the body, emaciation in physique, some fatal trouble, is courageous and obstinate",
    ta: "உடல் பலவீனம், மெலிந்த தோற்றம்; சில ஆபத்தான துன்பம்; தைரியமும் பிடிவாதமும்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Sun", page: 104,
    en: "Great dignity, gets fame, majestic and of tall stature, is very much conceited and haughty, does not show interest in occupation and domestic affairs, opposition in sexual pleasures, and is brave",
    ta: "பெரும் கௌரவம், புகழ், கம்பீரமும் உயரமும்; கர்வமும் திமிரும்; தொழில், குடும்ப விஷயங்களில் ஆர்வம் குறைவு; பாலியல் இன்பத்தில் தடை; துணிச்சலானவர்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Moon", page: 106,
    en: "Possesses the power to travel to various places, some weakness in the body, spends majestically and influentially, some weakness in the daily occupation and in the house of wife, is of weak heart and suspicious mind",
    ta: "பல இடங்களுக்கு பயணம் செய்யும் ஆற்றல்; உடலில் சில பலவீனம்; ஆடம்பரமாகவும் செல்வாக்குடனும் செலவு; தொழிலிலும் மனைவி வழியிலும் சிறு பலவீனம்; பலவீனமான இதயம், சந்தேக மனம்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Mars", page: 108,
    en: "Gets land and property, gets an ideal mother, gets very high means and influence to acquire happiness, has a good physique, dullness in the house of wife, family and daily occupation",
    ta: "நிலம், சொத்து; இலட்சிய தாய்; மகிழ்ச்சி அடைய பெரும் வசதியும் செல்வாக்கும்; நல்ல உடல்; மனைவி, குடும்பம், தினசரி தொழிலில் மந்தம்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Mercury", page: 110,
    en: "Gets heavy gains and much wealth, gets great success in daily occupation, great advantage in the house of wife, great success in worldly affairs and of sexual pleasures, is respectable and clever",
    ta: "பெரும் ஆதாயமும் செல்வமும்; தொழிலில் சிறந்த வெற்றி; மனைவி வழியில் பெரும் நன்மை; உலக விவகாரங்களிலும் பாலியல் இன்பத்திலும் வெற்றி; மரியாதைக்குரியவர், திறமையானவர்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Jupiter", page: 112,
    en: "Gets good longevity and acquires much education, gets the strength of the children, spends the daily routine of his life with eminence, some deficiency in handsomeness, shows great scholarship, insipidness in family environment",
    ta: "நீண்ட ஆயுள்; நிறைய கல்வி; குழந்தைகளின் வலிமை; சிறப்புடன் தினசரி வாழ்க்கை; அழகில் சிறு குறை; சிறந்த புலமை; குடும்பச் சூழலில் சுவையின்மை.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Venus", page: 114,
    en: "Works much with his strength and energy, gets honour and progress in trade and occupation, honour and strength in the house of wife and special powers and sexual pleasures, exerts a bit hard for securing the rise of honour in government and society, gets his work done tactfully, and is very industrious",
    ta: "தன் பலத்தாலும் ஆற்றலாலும் அதிகம் உழைப்பார்; தொழிலிலும் வியாபாரத்திலும் மரியாதையும் முன்னேற்றமும்; மனைவி வழியில் மரியாதையும் வலிமையும்; சிறப்பு ஆற்றல், பாலியல் இன்பம்; அரசு, சமூகத்தில் மரியாதைக்கு சிறிது முயற்சி; தந்திரமாக வேலை முடிப்பார்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Saturn", page: 116,
    en: "Pursues some laborious daily occupation through his body, happiness in the house of family and wife, gets some diseases, special conjunction of sexual passions, great vigour in the way of progress and works with the power of hard labour and tactics",
    ta: "உடலால் கடின உழைப்பு; குடும்ப, மனைவி வகையில் மகிழ்ச்சி; சில நோய்கள்; பாலியல் ஆர்வம் மிகுதி; முன்னேற்றத்தில் பெரும் முயற்சி; கடின உழைப்பும் தந்திரமும்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Rahu", page: 118,
    en: "Weakness in body, some anxiety and some stress in the brain, feels inner fear, selfish and keeps influence",
    ta: "உடல் பலவீனம்; மூளையில் சிறு கவலையும் அழுத்தமும்; உள்ளார்ந்த பயம்; சுயநலம்; செல்வாக்கு வைத்திருப்பார்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Ketu", page: 120,
    en: "Some weakness in the body, death like danger in the body, does hard physical labour, is courageous, proud, possesses the great power of sexual pleasures, and labours very hard",
    ta: "உடல் பலவீனம், மரண ஆபத்து போன்ற நிலை; கடின உடல் உழைப்பு; தைரியம், பெருமை; பாலியல் இன்பத்தில் பெரும் ஆற்றல்; மிகக் கடினமாக உழைப்பார்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Sun", page: 125,
    en: "Spends much, is of weak and emaciated body, manages his expenditure by physical labour, conducts the daily occupation with the power of expenditure, gets weakness in the house of wife, gets some losses and weakness in occupation, is haughty",
    ta: "அதிகம் செலவழிப்பார்; உடல் பலவீனம், மெலிவு; உடல் உழைப்பால் செலவை சமாளிப்பார்; மனைவி வகையில் குறை; தொழிலில் இழப்பும் பலவீனமும்; பெருமை.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Moon", page: 127,
    en: "Gets gains with physical and mental happiness, is handsome, is of calm nature, gets a beautiful wife, gains heavily in the occupation, gets all pleasures and enjoyments, is much respected, is of delightful nature, is interested in the house of wife, gains from the house of father-in-law, is very careful about income and daily occupation, wants special sexual pleasures",
    ta: "உடல், மன மகிழ்ச்சி; அழகானவர்; அமைதியான குணம்; அழகான மனைவி; தொழிலில் பெரும் ஆதாயம்; எல்லா இன்பங்களும்; மிகுந்த மரியாதை; இனிய குணம்; மனைவி வழியில் அக்கறை; மாமனாரிடம் ஆதாயம்; வருமானத்தில் கவனம்; சிறப்பு பாலியல் இன்பம்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Mars", page: 129,
    en: "Gets a long life, feels some distress the body, is very powerful, some loss in the house of mother, feels some distress in the side of wife, gets some efficiency and cooperation on the side of brothers and sisters",
    ta: "நீண்ட ஆயுள்; உடலில் சில துன்பம்; மிகுந்த வலிமை; தாய் வகையில் சிறு இழப்பு; மனைவி வகையில் சிறு துன்பம்; உடன்பிறப்புகளிடம் சிறு ஒத்துழைப்பு.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Mercury", page: 131,
    en: "Is tall and of symmetrical nature, enjoys the royal grandeur, is very influential, progress from the house of father, conducts business, some deficiency in the side of wife, gets some deficiency on the side of sexual pleasures, is very clever, wise and skilful, is a great politician, is diligent and has good manners",
    ta: "உயரமும் சீரான அமைப்பும்; அரச வாழ்வு; மிகுந்த செல்வாக்கு; தந்தை வழியில் முன்னேற்றம்; வணிகம் செய்வார்; மனைவி, பாலியல் இன்பத்தில் சில குறைகள்; மிகத் திறமையானவர், அறிவாளி; சிறந்த அரசியல் அறிவு; கடின உழைப்பு; நல்ல பழக்கவழக்கம்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Jupiter", page: 133,
    en: "Gets domestic happiness, gets a very clever wife, gets the pleasant occupation, is thought to be fortunate, is careful about Dharma and also in family affairs, feels some deficiency in the side of children, some weakness in wisdom and education, intellectual worries due to the reasons of family regarding wife, is of fat body, is the owner of property, is very clever and happy",
    ta: "குடும்ப மகிழ்ச்சி; மிகத் திறமையான மனைவி; இனிய தொழில்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; தர்மத்திலும் குடும்ப விவகாரத்திலும் கவனம்; குழந்தைகள் வகையில் சிறு குறை; அறிவிலும் கல்வியிலும் சிறு பலவீனம்; மனைவி பற்றிய குடும்பக் கவலைகள்; பருத்த உடல்; சொத்துக்கு உரிமையாளர்; மிகத் திறமையானவர், மகிழ்ச்சியானவர்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Venus", page: 136,
    en: "Some weakness in body, gets some deficiency in wealth, gets a fortunate wife, pursues a big daily occupation, gets excess in enjoying the sexual pleasures, progress in occupation after marriage",
    ta: "உடலில் சிறு பலவீனம்; செல்வத்தில் சிறு குறை; அதிர்ஷ்டமான மனைவி; பெரிய தினசரி தொழில்; பாலியல் இன்பத்தில் மிகுதி; திருமணத்துக்குப் பின் தொழில் முன்னேற்றம்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Saturn", page: 138,
    en: "Is victorious, serious and is of deep intricate policies, gets able children and also the education, gets progress in connection with daily occupation, some enmity and some separation in the side of children, some illness in the body",
    ta: "வெற்றியாளர், தீவிரமானவர், ஆழமான தந்திர நெறிகள்; திறமையான குழந்தைகளும் கல்வியும்; தினசரி தொழிலில் முன்னேற்றம்; குழந்தைகள் வகையில் சில பகையும் பிரிவும்; உடலில் சில நோய்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Rahu", page: 140,
    en: "Talks very cunningly and cleverly, keeps his influence, gets much success due to occult power, bears some trouble in the body, keeps great care in the house of wife and occultism, and labours hard",
    ta: "மிகவும் தந்திரமாகவும் சாமர்த்தியமாகவும் பேசுவார்; செல்வாக்கு வைத்திருப்பார்; மறை ஞானத்தால் நிறைய வெற்றி; உடலில் சில தொல்லை; மனைவி, மறைக்கலை விஷயங்களில் அதிக கவனம்; கடினமாக உழைப்பார்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Ketu", page: 142,
    en: "Is much self-conceited, gets weakness in the body, experiences some weakness of a special kind in his body, keeps firmness in outward show, is very clever, respectable, works rashly",
    ta: "மிகுந்த தன்னம்பிக்கை; உடல் பலவீனம்; உடலில் சிறப்பு வகை பலவீனம்; வெளித்தோற்றத்தில் உறுதி; மிகவும் அறிவாளி, மரியாதைக்குரியவர்; அவசரமாக வேலை செய்வார்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Sun", page: 146,
    en: "Gets the income through physical labour but gets some weakness in income and physique also, gets firmness in the daily occupation, special gains in the house of wife and family, gets special sexual pleasures, is of lean and thin body",
    ta: "உடல் உழைப்பால் வருமானம், வருமானத்தில் சிறு பலவீனம்; உடலிலும் குறை; தினசரி தொழிலில் உறுதி; மனைவி, குடும்ப வகையில் சிறப்பு ஆதாயம்; சிறப்பு பாலியல் இன்பம்; ஒல்லியான, மெலிந்த உடல்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Moon", page: 148,
    en: "Dignified, majestic and respected, gets progress in the house of father, enjoys high class sexual pleasures, gets the happiness of wife, works very majestically in connection with occupation, gets honour in government and society",
    ta: "கம்பீரமும் மரியாதையும்; தந்தை வீட்டில் முன்னேற்றம்; உயர்தர பாலியல் இன்பம்; மனைவியால் மகிழ்ச்சி; தொழிலில் கம்பீரமாக செயல்படுவார்; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Mars", page: 150,
    en: "Is very rich and respectable, gets emaciation in his physique, pursues valuable occupation, gets very able and beautiful wife, gets ideal pleasures, gets great happiness, gets the household profits, buildings, etc",
    ta: "மிகுந்த செல்வமும் மரியாதையும்; உடல் மெலிவு; மதிப்புமிக்க தொழில்; மிகத் திறமையான அழகான மனைவி; சிறந்த இன்பங்கள்; பெரும் மகிழ்ச்சி; வீடு, கட்டிடம் மூலம் ஆதாயம்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Mercury", page: 152,
    en: "Fortunate, enjoys the happiness of physique, has a thin and lean body, enjoys domestic happiness in connection with wife, gets success in occupation, is very clever, is very wise and does justice, is influential, and is of tender nature",
    ta: "அதிர்ஷ்டசாலி; உடல் இன்பம்; மெலிந்த உடல்; மனைவியுடன் குடும்ப மகிழ்ச்சி; தொழிலில் வெற்றி; மிகுந்த அறிவாளி, ஞானி, நீதி செய்பவர்; செல்வாக்குள்ளவர்; மென்மையான குணம்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Jupiter", page: 154,
    en: "Does very influential deeds, has great courage, does hard physical labour, is very wise and follows shrewd policies, follows occupation tactfully, is careful about religious behaviour, gets some enmity in the house of children, dignity in the side of wife",
    ta: "செல்வாக்குள்ள செயல்கள்; பெரும் தைரியம்; கடின உடல் உழைப்பு; மிகுந்த ஞானம், புத்திசாலித்தனமான வழிகள்; தொழிலை சாமர்த்தியமாகச் செய்வார்; மதக் கடமைகளில் கவனம்; குழந்தைகள் வகையில் சில பகை; மனைவி வழியில் மரியாதை.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Venus", page: 156,
    en: "Gets non-cooperation in his progress, gets a long life, is very respectable, gets fame, gets some weakness in the body, has very good knowledge of self, is farsighted, is a diplomat and is influential",
    ta: "முன்னேற்றத்தில் ஒத்துழைப்பின்மை; நீண்ட ஆயுள்; மிகுந்த மரியாதை; புகழ்; உடலில் சிறு பலவீனம்; சுய அறிவு மிக்கவர்; தூரநோக்குடையவர்; இராஜதந்திரி; செல்வாக்குள்ளவர்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Saturn", page: 158,
    en: "Is of very handsome physique, enjoys pleasures very much, gets much education, is very wise, influential, diligent and pays attention towards a big business, faces troubles with wife in domestic affairs due to speech and intellect, some deficiency in the side of sexual pleasures and in the sphere of wife, gets much pleasure and happiness of property, possesses self-pride",
    ta: "அழகான உடல்; இன்பங்களை மிகவும் அனுபவிப்பார்; மிகுந்த கல்வி; ஞானி, செல்வாக்கு, உழைப்பாளி; பெரிய வியாபாரத்தில் கவனம்; பேச்சாலும் அறிவாலும் மனைவியுடன் சிக்கல்கள்; பாலியல், மனைவி துறையில் சில குறை; சொத்தால் மகிழ்ச்சி; தன்னம்பிக்கை மிக்கவர்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Rahu", page: 160,
    en: "Gets the work done with great tactics and cleverness, is very cautious, physically and mentally worried, gets some fame, bears special blows on body, becomes nervous",
    ta: "திறமையான தந்திரத்தால் வேலை முடிப்பார்; மிகவும் எச்சரிக்கையானவர்; உடலும் மனமும் கவலையுற்றவர்; சிறு புகழ்; உடலில் சிறப்பான அடிகள்; பதற்றம்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Ketu", page: 162,
    en: "Some weakness in body, some incompleteness in himself, lives in a manner of pride and bravery, works in hardships, stays permanently at his place and pursues his work, is obstinate",
    ta: "உடலில் சிறு பலவீனம்; தன்னிடம் சில குறைகள்; பெருமையும் தைரியமும்; கஷ்டங்களில் வேலை செய்வார்; நிலையாக தன் இடத்தில் தங்கி வேலை செய்வார்; பிடிவாதம்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Sun", page: 167,
    en: "Gets royal grandeur, is very glorious and influential, gets much pride, gets his work done by order, some deficiency in the house of wife, gets sexual pleasures, gets the power in the house of father, conducts a very big business, wears beautiful garments and ornaments, does the occupation with grandeur and pride",
    ta: "அரச செல்வமும் பெருமையும்; மிகுந்த கர்வம்; ஆணையின்படி வேலை முடியும்; மனைவி வகையில் சிறு குறை; பாலியல் இன்பம்; தந்தை வழியில் அதிகாரம்; பெரிய வியாபாரம் நடத்துவார்; அழகான ஆடை, ஆபரணங்கள்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Moon", page: 170,
    en: "Gets mental anxieties and some weakness of destiny, toils hard for the occupation, gets a lean body, takes lull care of the family, has special mental fascination in wife and in the side of sexual pleasures etc, progresses in connection with occupation by mental power and the power of destiny, rears Dharma incompletely",
    ta: "மன கவலைகளும் விதியின் சிறு பலவீனமும்; தொழிலுக்கு கடின உழைப்பு; மெலிந்த உடல்; குடும்பத்தை மிகவும் கவனிப்பார்; மனைவியிலும் பாலியல் விஷயங்களிலும் மன ஈர்ப்பு; மன வலிமையாலும் விதியாலும் தொழிலில் முன்னேற்றம்; தர்மத்தை முழுமையாகக் கடைப்பிடிக்க மாட்டார்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Mars", page: 172,
    en: "Is influential and possesses a short body, is furious and proud, some disorder in the body due to heat in the shape of some diseases, faces loss of mother, gets difficulties about buildings and in peace and happiness, gets some restlessness and distress in the house of wife, bears some difficulties in occupation, is very courageous",
    ta: "செல்வாக்கு; குட்டையான உடல்; கோபமும் பெருமையும்; வெப்பத்தால் உடலில் கோளாறு; தாயை இழக்க நேரும்; கட்டிடம், அமைதி, மகிழ்ச்சியில் சிரமம்; மனைவி வழியில் தொந்தரவு; தொழிலில் சில சிரமம்; மிகத் துணிச்சலானவர்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Mercury", page: 174,
    en: "Gets gains and income, is of gentle behaviour and gentle nature, has a long life, gains in occupation, takes full care of family through the power of income",
    ta: "ஆதாயமும் வருமானமும்; மென்மையான நடத்தையும் குணமும்; நீண்ட ஆயுள்; தொழிலில் ஆதாயம்; வருமான வலிமையால் குடும்பத்தை முழுமையாகக் கவனிப்பார்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Jupiter", page: 176,
    en: "Is very wise, learned, religious and is a diplomat, gets the strength of wealth, gets children, gets progress through son, takes great care of family and occupation, loves justice, loves astrology, possesses spiritual knowledge, influential, keeps faith in God",
    ta: "மிகுந்த ஞானம், கல்வி, மதப்பற்று; இராஜதந்திரி; செல்வத்தின் வலிமை; குழந்தைகள்; மகன் வழியில் முன்னேற்றம்; குடும்பத்தையும் தொழிலையும் கவனிப்பார்; நீதியை விரும்புவார்; ஜோதிடத்தில் ஆர்வம்; ஆன்மிக அறிவு; கடவுள் நம்பிக்கை; செல்வாக்குள்ளவர்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Venus", page: 178,
    en: "Gets a good occupation, spends majestically, works very carefully, acquires some happiness in the house of wife, spends much, gets some weakness on account of wife, goes from place to place due to occupation, gets honour, is clever and wants to enjoy pleasures of high standard, conducts the worldly affairs very ably, is skilful, careful and farsighted, likes beauty",
    ta: "நல்ல தொழில்; கம்பீரமாக செலவு; மிகக் கவனமாக வேலை; மனைவியால் சிறு மகிழ்ச்சி; நிறைய செலவு; மனைவி வகையில் சிறு பலவீனம்; தொழிலுக்காக ஊர்விட்டு ஊர் செல்வார்; மரியாதை; உயர்தர இன்பங்களை விரும்புவார்; உலக விவகாரங்களை திறமையாக நடத்துவார்; தூரநோக்குள்ளவர்; அழகை விரும்புவார்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Saturn", page: 180,
    en: "Is very energetic and zealous, gets the power of brothers and sisters, acquires progress in occupation, some perplexity in the house of government and big business, possesses pungency, wants sexual pleasures, labours hard for progress, is industrious and courageous",
    ta: "மிகுந்த ஆற்றலும் ஆர்வமும்; சகோதர சகோதரிகளின் பலம்; தொழிலில் முன்னேற்றம்; அரசு, பெரிய வியாபாரத்தில் சில குழப்பம்; கூர்மையான பேச்சு; பாலியல் இன்பத்தை விரும்புவார்; முன்னேற்றத்துக்கு கடின உழைப்பு; உழைப்பாளி, தைரியசாலி.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Rahu", page: 182,
    en: "Gets emaciated physique, gets physical shocks many times, unable to maintain the gentle nature, undertakes very strong tactics to acquire some great power, is very courageous and clever",
    ta: "மெலிந்த உடல்; பல முறை உடல் அதிர்ச்சி; மென்மையான குணத்தைக் காக்க முடியாதவர்; பெரும் சக்தி பெற வலிமையான தந்திரங்கள்; மிகுந்த தைரியமும் சாமர்த்தியமும்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Ketu", page: 184,
    en: "Gets weakness and wounds in the body, has great patience in his heart, does not care for anybody before his excessive strength, is of heroic nature, feels the deficiency of knowledge, possesses sensual power very much, bears more troubles, is anxious and solemn",
    ta: "உடலில் பலவீனமும் காயங்களும்; இதயத்தில் பெரும் பொறுமை; தன் பலத்தை முன்னிட்டு யாரையும் மதிக்காதவர்; வீர குணம்; அறிவு குறைவாக உணர்வார்; புலனின்பத்தில் மிகுந்த ஆற்றல்; மேலும் துன்பங்கள்; கவலையும் கம்பீரமும்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Sun", page: 189,
    en: "Is very fortunate and handsome, follows Dharma and benevolence, possesses faith in God, gets success in occupation, has influence in the matters connected with wife and family also, is very influential and illustrious",
    ta: "மிக அதிர்ஷ்டசாலி, அழகானவர்; தர்மத்தையும் கருணையையும் கடைப்பிடிப்பார்; கடவுள் நம்பிக்கை; தொழிலில் வெற்றி; மனைவி, குடும்ப விஷயங்களிலும் செல்வாக்கு; மிகுந்த செல்வாக்கும் புகழும்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Moon", page: 191,
    en: "Has a long life, experiences some weakness and deficiency in the handsomeness of the body, gets some worries in occupation, bears some perplexity in the house of wife",
    ta: "நீண்ட ஆயுள்; உடலின் அழகில் சிறு பலவீனம்; தொழிலில் சில கவலைகள்; மனைவி வீட்டில் சிறு குழப்பம்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Mars", page: 193,
    en: "Travels much, has a weak physique, does high standard tasks, gets work done by talking very cunningly and implicating others, experiences loss of mother, gets the conjunction of loss and distress in wife's house, laces great restlessness in the daily routine of life, spends much, has some deficiency in the children's side",
    ta: "நிறைய பயணம்; பலவீனமான உடல்; உயர்தர வேலைகள் செய்வார்; தந்திரமாகப் பேசி பிறரை சிக்க வைத்து வேலை முடிப்பார்; தாய் வகையில் இழப்பு; மனைவி வீட்டில் இழப்பும் துன்பமும்; தினசரி வாழ்வில் பெரும் அமைதியின்மை; அதிகம் செலவழிப்பார்; குழந்தைகள் வகையில் சிறு குறை.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Mercury", page: 195,
    en: "Conducts an elegant and dexterous occupation, is very industrious and also sinful, possesses good knowledge of worldly affairs and gets satisfactory success in worldly affairs, achieves honour in domestic affairs, gets an influential wife, faces loss in sexual pleasure and respect, has deficiency in the house of father, is very clever, intelligent and a good manager",
    ta: "நேர்த்தியும் சாமர்த்தியமும் உள்ள தொழில்; மிகுந்த உழைப்பாளி, ஆனால் பாவச் செயலும் உண்டு; உலக விவகாரங்களில் நல்ல அறிவு; குடும்பத்தில் மரியாதை; செல்வாக்குள்ள மனைவி; பாலியல் இன்பத்திலும் மரியாதையிலும் இழப்பு; தந்தை வகையில் குறை; திறமையான, அறிவாளியான நிர்வாகி.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Jupiter", page: 197,
    en: "Enjoys happiness and gets honour, possesses a bulky body, is respectable and loves peace, wants sweet and delicious food, gets happiness from wife, has a comfortable occupation, lives at his own place, gets the happiness of education and Dharma, gets children, is fortunate",
    ta: "மகிழ்ச்சியும் மரியாதையும்; பருமனான உடல்; மதிப்புக்குரியவர், அமைதியை விரும்புவார்; இனிப்பு உணவு விருப்பம்; மனைவியால் மகிழ்ச்சி; வசதியான தொழில்; சொந்த இடத்தில் வாழ்வு; கல்வி, தர்மத்தில் மகிழ்ச்சி; குழந்தைகள்; அதிர்ஷ்டசாலி.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Venus", page: 199,
    en: "Gets income due to his physical labours, gets some disease in body, pays great attention to his occupation, faces some perplexity and also advantage in the wife's house, earns very much, suppresses the enemies, wants ornamentation and joy",
    ta: "உடல் உழைப்பால் வருமானம்; உடலில் சில நோய்; தொழிலில் பெரும் கவனம்; மனைவி வீட்டில் சிக்கலும் ஆதாயமும்; நிறைய சம்பாதிப்பார்; எதிரிகளை அடக்குவார்; அலங்காரத்தையும் மகிழ்ச்சியையும் விரும்புவார்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Saturn", page: 201,
    en: "Very energetic and industrious, increases wealth working diligently, gets the strength of brothers and sisters, some restlessness in his body, conducts a big business, gets the power of wife and father",
    ta: "மிகுந்த ஆற்றலும் உழைப்பும்; கடின உழைப்பால் செல்வம் பெருக்குவார்; சகோதர சகோதரிகளின் பலம்; உடலில் சில அமைதியின்மை; பெரிய வியாபாரம்; மனைவி, தந்தை வகையில் வலிமை.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Rahu", page: 203,
    en: "Bears physical distress and worry, gets the deficiency in handsomeness of body and sometimes bears physical blows, faces risk of his body, gets the work done with tactics, undertakes very difficult deeds for his progress, sometimes has to depend on others",
    ta: "உடல் துன்பமும் கவலையும்; உடலின் அழகில் குறை; சில நேரம் உடல் அடிகள்; உடலுக்கு ஆபத்து; தந்திரத்தால் வேலை முடிப்பார்; முன்னேற்றத்துக்கு மிகக் கடினமான செயல்கள்; சில நேரம் பிறரைச் சார்ந்திருக்க வேண்டும்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Ketu", page: 205,
    en: "Is of tall stature, is brave, diligent and conceited, also superstitious and careless, gets deficiency in physical handsomeness, thinks himself to be great, has the power of concealment and bravery, is selfish",
    ta: "உயரமானவர், தைரியசாலி, கடின உழைப்பாளி; ஆனால் கர்வம், மூட நம்பிக்கை, கவனக்குறைவு; உடல் அழகில் குறை; தன்னை பெரியவராக நினைப்பார்; மறைக்கும் ஆற்றலும் வீரமும்; சுயநலம்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Sun", page: 210,
    en: "Bears physical affliction and does difficult works, gets diseases like smallpox and syphilis, has a long life, has some restlessness in life, feces some calamity in the house of wife, bears some perplexity in the house of education, has some deficiency in charm and complexion, is haughty, and gets the power of concealment",
    ta: "உடல் துன்பமும் கடின வேலைகளும்; அம்மை, சிபிலிஸ் போன்ற நோய்கள்; நீண்ட ஆயுள்; வாழ்வில் சிறு அமைதியின்மை; மனைவி வீட்டில் சில ஆபத்து; கல்வியில் சிறு சிக்கல்; அழகிலும் நிறத்திலும் குறை; கர்வம்; மறைக்கும் ஆற்றல்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Moon", page: 212,
    en: "Conducts the occupation through a high standard of concentration, has some deficiency in the beauty and happiness in wife's house, wants sexual pleasures very much and gets the same, is of white complexion, is very diligent",
    ta: "உயர்தர கவனத்துடன் தொழில் நடத்துவார்; மனைவி வீட்டில் அழகிலும் மகிழ்ச்சியிலும் குறை; பாலியல் இன்பத்தை மிகவும் விரும்பி அடைவார்; வெள்ளை நிறம்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Mars", page: 214,
    en: "Gets happiness very much, gets lot of property and gains, speciality in mother's house, gets deficiency in occupation and also from wife's house, deficiency in sexual pleasures, creates the means of happiness in the side of occupation and sexual pleasures Is self conceited and proud",
    ta: "மிகுந்த மகிழ்ச்சி, பெரும் சொத்து, ஆதாயம்; தாய் வீட்டில் சிறப்பு; தொழிலிலும் மனைவி வீட்டிலும் குறை; பாலியல் இன்பத்தில் குறை; தொழிலிலும் பாலியல் இன்பத்திலும் மகிழ்ச்சிக்கான வழி; தன்னம்பிக்கை மிக்கவர், பெருமை.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Mercury", page: 216,
    en: "Is clever, fortunate, gentle and influential, has faith in Dharma, gets victory over enemies, gets some ordinary diseases in physique, pursues the occupation, has ordinary liking for sexual pleasures",
    ta: "திறமையானவர், அதிர்ஷ்டசாலி, மென்மையானவர், செல்வாக்குள்ளவர்; தர்மத்தில் நம்பிக்கை; எதிரிகளை வெல்வார்; உடலில் சாதாரண நோய்கள்; தொழிலைக் கவனிப்பார்; பாலியல் இன்பத்தில் சாதாரண ஆர்வம்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Jupiter", page: 218,
    en: "Bears physical troubles and has an emaciated body, has deficiency in expenditure, has weakness from the side of brothers and sisters, has deficiency in physical handsomeness, gets some elegance in the wife's house, acquires the progress of occupation, gains strength from children's side",
    ta: "உடல் துன்பமும் மெலிந்த உடலும்; செலவில் குறை; சகோதர சகோதரிகள் வகையில் பலவீனம்; உடல் அழகில் குறை; மனைவி வீட்டில் சிறு நயம்; தொழிலில் முன்னேற்றம்; குழந்தைகள் வகையில் பலம்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Venus", page: 220,
    en: "Is very respectable, clever, wise and does very nice and high standard deeds, pursues big occupation, gets honour and advantage from father, gets advantage from the government, gets respect in public, does many occupations, enjoys the sexual pleasures and gets the happiness of children, likes beauty, and is very much a lover of astrology",
    ta: "மிகுந்த மரியாதை, திறமை, ஞானம்; மிக நல்ல, உயர்தரமான செயல்கள்; பெரிய தொழில்; தந்தை வழியில் மரியாதையும் ஆதாயமும்; அரசிடமிருந்து ஆதாயம்; பொதுவெளியில் மரியாதை; பல தொழில்கள்; பாலியல் இன்பமும் குழந்தைகளின் மகிழ்ச்சியும்; அழகை விரும்புவார்; ஜோதிடத்தில் பெரும் ஆர்வம்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Saturn", page: 222,
    en: "Is very rich, lives aristocratically, wears costly dresses, gets progress from father's house, pursue a big business occupation, deficiency in brothers' house, gets name and honour in the society, gets some opposition in family and is honourable",
    ta: "மிகுந்த செல்வம், ஆடம்பர வாழ்வு, விலையுயர்ந்த ஆடை; தந்தை வீட்டு முன்னேற்றம்; பெரிய வணிகத் தொழில்; சகோதரர் வகையில் குறை; சமூகத்தில் பெயரும் மரியாதையும்; குடும்பத்தில் சில எதிர்ப்பு; மரியாதைக்குரியவர்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Rahu", page: 224,
    en: "Bears some physical perplexity and feels a sort of intoxication, some deficiency in his body, finds the way of progress very cleverly and through the power of concealment, gets some firmness after bearing some worries, gets his work done through very gentle manner not caring for truth or falsehood",
    ta: "சில உடல் குழப்பமும் போதை போன்ற உணர்வும்; உடலில் சிறு குறை; மறைக்கும் ஆற்றலால் முன்னேற்றப் பாதையைத் தேடுவார்; கவலைகளுக்குப் பின் சிறு உறுதி; உண்மையையோ பொய்யையோ கருதாமல் மென்மையாக வேலை முடிப்பார்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Ketu", page: 226,
    en: "Is very obstinate, gets wounds in the body, bears some physical worries, does not care about disrepute for acquiring the fame, does not care about the troubles, is physically passionate, gets his work done through secret means, is selfish",
    ta: "மிகவும் பிடிவாதமானவர்; உடலில் காயங்கள்; உடல் கவலைகள்; புகழுக்காக அவமானத்தைப் பொருட்படுத்தாதவர்; தொல்லைகளைக் கவனியாதவர்; உடல் ஆசை மிகுந்தவர்; மறைவான வழிகளில் வேலை முடிப்பார்; சுயநலம்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Sun", page: 231,
    en: "Gets influential wife and pursues influential occupation, gets some weakness in the body, gets the power of enjoying sexual pleasures, gives much dignity to wife with some enmity, gets honour, possesses vigour, and feels unsatisfied even on accomplishing big tasks",
    ta: "செல்வாக்குள்ள மனைவியும் செல்வாக்குள்ள தொழிலும்; உடலில் சிறு பலவீனம்; பாலியல் இன்பம் அனுபவிக்கும் ஆற்றல்; மனைவிக்கு மிகுந்த கௌரவம், சிறு பகை; மரியாதை; வலிமை; பெரிய பணிகளை முடித்தாலும் திருப்தி இல்லாதவர்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Moon", page: 234,
    en: "Gets honour through the power of concentration, suffers from physical perplexities and from cold, gets some mental disorder, faces struggle with wife, uses secret policies in the line of occupation",
    ta: "ஒருமுகப்பட்ட மனத்தால் மரியாதை; உடல் துன்பங்களும் குளிர் பாதிப்பும்; சில மன நோய்; மனைவியுடன் போராட்டம்; தொழிலில் மறைமுக வழிகள்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Mars", page: 236,
    en: "Progresses due to the vigour of his body, uses good working power and courage, secures the association of father and brother in an ordinary way, faces uneasiness in the side of mother, acquires progress in occupation, achieves honour and good name with government and society, bears some perplexity in the wife's house, gets some seminal defects",
    ta: "உடல் வலிமையால் முன்னேற்றம்; நல்ல வேலைத் திறனும் தைரியமும்; தந்தை, சகோதரர் ஆதரவு சாதாரண அளவில்; தாய் வகையில் அசௌகரியம்; தொழிலில் முன்னேற்றம்; அரசு, சமூகத்தில் மரியாதையும் நல்ல பெயரும்; மனைவி வீட்டில் சிறு சிக்கல்; விந்து சம்பந்தமான குறைபாடு.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Mercury", page: 238,
    en: "Has a long life, spends the daily routine majestically, gets good education and wisdom, feces some perplexity in the side of children, has some friendship and some perplexity in the house of wife, uses shrewdness in business",
    ta: "நீண்ட ஆயுள்; நாள் வாழ்க்கை கம்பீரமாக; நல்ல கல்வியும் ஞானமும்; குழந்தைகள் வகையில் சில சிக்கல்; மனைவி வீட்டில் சில நட்பும் சிக்கலும்; வியாபாரத்தில் சாமர்த்தியம்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Jupiter", page: 240,
    en: "Gets income and power of wealth by his diligence, gets the respect and honour of the body, gets advantage of children, education, utters good things, acquires the progress in destiny, gains from occupation, gets advantage in the house of wife, gets his wants satisfied, and is somewhat dependent",
    ta: "உழைப்பால் வருமானமும் செல்வ வலிமையும்; உடலில் மரியாதையும் கௌரவமும்; குழந்தைகள், கல்வியில் ஆதாயம்; நல்ல வார்த்தைகள் பேசுவார்; விதியில் முன்னேற்றம்; தொழிலில் ஆதாயம்; மனைவி வீட்டில் ஆதாயம்; ஆசைகள் நிறைவேறும்; சிறிது சார்ந்திருப்பவர்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Venus", page: 242,
    en: "Enjoys happiness very much on account of his good luck, gets happiness from mother, gets lands and buildings, gets food, drink and clothes, rears the Dharma properly, gets the divine support and fame, gets the power of occupation and happiness of wife in connection with family with some enmity",
    ta: "நல்ல அதிர்ஷ்டத்தால் பெரும் மகிழ்ச்சி; தாயால் மகிழ்ச்சி; நிலமும் வீடும்; உணவு, பானம், உடை; தர்மத்தை சரியாகக் கடைப்பிடிப்பார்; தெய்வ ஆதரவும் புகழும்; தொழில் ஆற்றல்; மனைவி வகையில் மகிழ்ச்சி, சிறு பகை.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Saturn", page: 244,
    en: "Possesses will-power and self-respect, gets some fame, bears loss in the house of brother, faces affliction in the house of wife and father, gets weakness in occupation, business and prestige, gets weakness in the house of government and society",
    ta: "மன உறுதியும் சுயமரியாதையும்; சிறு புகழ்; சகோதரர் வகையில் இழப்பு; மனைவி, தந்தை வகையில் துன்பம்; தொழில், வியாபாரம், கௌரவத்தில் பலவீனம்; அரசு, சமூக வகையில் குறை.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Rahu", page: 246,
    en: "Gets some physical perplexity and faces some calamities, uses secret tactics, tries to work hard to acquire name and fame, is always busy in trying something to serve his selfishness",
    ta: "சில உடல் குழப்பமும் ஆபத்துகளும்; ரகசிய வழிகள்; பெயரும் புகழும் பெற கடினமாக உழைப்பார்; சுயநலத்துக்காக எதையாவது செய்வதில் எப்போதும் ஈடுபட்டிருப்பார்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Ketu", page: 248,
    en: "Feels some deficiency in his body, does not care about the good or bad for others, is of firm determination",
    ta: "உடலில் குறை; பிறருக்கு நன்மையோ தீமையோ பற்றிக் கவலைப்படாதவர்; உறுதியான மனம்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Sun", page: 253,
    en: "Is very influential and gets victory over enemies, faces some distress in the physique, experiences some bondage, is very haughty, experiences troubles in wife's house and some deficiency in the side of sexual pleasures, feces some hindrances in occupation, and is very industrious",
    ta: "மிகுந்த செல்வாக்கு; எதிரிகளை வெல்வார்; உடலில் சில துன்பம்; சில கட்டுப்பாடுகள்; மிகுந்த கர்வம்; மனைவி வீட்டில் துன்பம்; பாலியல் இன்பத்தில் சிறு குறை; தொழிலில் சில தடைகள்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Moon", page: 255,
    en: "Gets ideal strength of mind, has a peculiar splendour in education, has a dignity in speech, gets grandeur in children's side, gets beauty and satisfaction from wife, is attracted towards her, gets success in occupation, gets the strength of sexual pleasures, possesses hidden knowledge",
    ta: "சிறந்த மன வலிமை; கல்வியில் தனிச் சிறப்பு; பேச்சில் கௌரவம்; குழந்தைகள் வகையில் பெருமை; மனைவியால் அழகும் திருப்தியும்; அவரிடம் ஈர்ப்பு; தொழிலில் வெற்றி; பாலியல் இன்பத்தில் வலிமை; மறைந்த ஞானம்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Mars", page: 257,
    en: "Gets wealth due to destiny, follows Dharma, is thought to be fortunate, gets lands, buildings and happiness from mother, gets good fortune from wife's side, maintains an aristocratic standard in the daily life, gets the pleasures of the family",
    ta: "விதியால் செல்வம்; தர்மத்தைப் பின்பற்றுவார்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; நிலம், வீடு, தாய் வழியில் மகிழ்ச்சி; மனைவி வீட்டில் நல்ல அதிர்ஷ்டம்; அன்றாட வாழ்வில் கம்பீர தரம்; குடும்ப இன்பங்கள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Mercury", page: 259,
    en: "Has a slim body, faces some deficiency in the happiness from mother, gets some weakness in buildings, lands and property, has some deficiency in wife's house, gets the progress in occupation after doing hard physical labour, enjoys more advantages in sexual affairs in an unjustified manner",
    ta: "மெலிந்த உடல்; தாய் வகையில் மகிழ்ச்சிக் குறை; நிலம், சொத்தில் சிறு பலவீனம்; மனைவி வீட்டில் சிறு குறை; கடின உடல் உழைப்புக்குப் பின் தொழில் முன்னேற்றம்; பாலியல் விஷயங்களில் நியாயமற்ற முறையில் அதிக ஆதாயம்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Jupiter", page: 261,
    en: "Gets dignity, does ideal deeds, possesses a host of worldly and divine qualities, has a good physique, gets support from the father, gets good education, gets the special power of the children, gets honour in government and society, gets honour in wife's side, lives majestically and possesses great self-respect",
    ta: "கௌரவம்; சிறந்த செயல்கள்; உலகியல், தெய்வீக குணங்கள்; நல்ல உடல்; தந்தை ஆதரவு; நல்ல கல்வி; குழந்தைகளால் சிறப்பு; அரசு, சமூகத்தில் மரியாதை; மனைவி வழியிலும் மரியாதை; கம்பீர வாழ்வு; மிகுந்த சுயமரியாதை.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Venus", page: 264,
    en: "Is of tall stature, is very diligent and energetic, gets an increased age, spends life majestically, bears some deficiency in wife's house, faces some deficiency in diurnal occupation",
    ta: "உயரமானவர்; மிகுந்த உழைப்பாளி, ஆற்றல் மிக்கவர்; ஆயுள் அதிகரிக்கும்; கம்பீரமாக வாழ்வார்; மனைவி வீட்டில் சிறு குறை; அன்றாட தொழிலில் சில குறைகள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Saturn", page: 266,
    en: "Is physically weak internally hut appears to be good from the outside, faces opposition from father, has some friendly and some weak relation with the brother, bears losses in the house of wife, labours hard in occupation, finds some hindrance in the government and society",
    ta: "உள்ளே உடல் பலவீனம், வெளியே நன்றாகத் தெரிவார்; தந்தைக்கு எதிர்ப்பு; சகோதரருடன் சில நட்பும் சில பலவீனமும்; மனைவி வீட்டில் இழப்புகள்; தொழிலில் கடின உழைப்பு; அரசு, சமூகத்தில் சில தடைகள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Rahu", page: 268,
    en: "Feels physical anxieties and experiences some physical deficiency, sometimes experiences blows on the body, gets his work done very cleverly and cautiously, does very laborious deeds, follows secret tactics",
    ta: "உடலில் கவலைகளும் சில குறைகளும்; சில நேரம் உடலில் அடிகள்; வேலையை மிக சாமர்த்தியமாகவும் எச்சரிக்கையாகவும் முடிப்பார்; மிகக் கடினமான செயல்கள்; மறைமுக வழிகள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Ketu", page: 270,
    en: "Bears fatal blows on his body and passes through some clangers, also faces some deficiency in the handsomeness of physique, experiences bondage and dependence, uses his strength secretly",
    ta: "உடலில் ஆபத்தான அடிகள்; சில ஆபத்துகளில் சிக்குவார்; உடல் அழகில் குறை; பந்தமும் சார்புநிலையும்; தன் பலத்தை மறைவாகப் பயன்படுத்துவார்.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Sun", page: 21,
    en: "Feels difficulties in acquiring education, mentally worried, gains wealth by routine work, problems with children, weak finances",
    ta: "கல்வி பெறுவதில் சிரமம்; மன கவலை; வழக்கமான வேலையால் பொருள்; பிள்ளைகளால் பிரச்சினை; நிதி நிலை பலவீனம்.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Moon", page: 23,
    en: "Gets wealth, lands and house property, large family, gets wealth but cannot enjoy it, mentally happy, disturbance in daily routine, help from others",
    ta: "செல்வம், நிலம், வீடு; பெரிய குடும்பம்; செல்வம் இருந்தும் அனுபவிக்க முடியாது; மனத்தில் மகிழ்ச்சி; தினசரி வாழ்வில் குழப்பம்; பிறர் உதவி.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Mars", page: 25,
    en: "Always busy in earning money, but loses wealth, enjoys illegal gains, loses something from children, hindered by harsh speech, irreligious",
    ta: "பொருள் ஈட்டுவதில் எப்போதும் ஈடுபட்டிருப்பார்; ஆனால் பொருள் இழப்பு; சட்டவிரோத ஆதாயம்; பிள்ளைகள் வகையில் இழப்பு; கடுமையான பேச்சால் தடை; தர்மத்தில் நாட்டம் குறைவு.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Mercury", page: 27,
    en: "Earns wealth, is intelligent, has mixed relations with family, does not get good support from brothers and sisters, ambitious, wants to earn more",
    ta: "செல்வம் ஈட்டுவார்; அறிவாளி; குடும்பத்துடன் கலந்த உறவு; உடன்பிறப்புகளின் ஆதரவு குறைவு; லட்சியம் மிக்கவர்; மேலும் ஈட்ட விரும்புவார்.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Jupiter", page: 29,
    en: "Fortunate, earns good wealth, Divine help, slight loss in accumulated wealth, controls expenditure, sometimes spends more, religious in outlook, conquers enemies, feels happy with daily routine",
    ta: "அதிர்ஷ்டசாலி, நல்ல செல்வம்; தெய்வ உதவி; சேர்த்த செல்வத்தில் சிறு இழப்பு; செலவைக் கட்டுப்படுத்துவார்; சில நேரம் அதிகம் செலவிடுவார்; தர்ம நோக்கு; எதிரிகளை வெல்வார்; தினசரி வாழ்வில் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Venus", page: 31,
    en: "Gets good wealth, large family, undertakes different professions, accumulates good wealth, happy with wife and enjoys sexual pleasures, gets honour and respect",
    ta: "நல்ல செல்வம், பெரிய குடும்பம்; பல தொழில்கள்; நல்ல செல்வம் சேர்ப்பார்; மனைவியால் மகிழ்ச்சி; பாலியல் இன்பம்; மரியாதையும் கௌரவமும்.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Saturn", page: 33,
    en: "Earns well, gains from government and society, does not get affection fiom mother, is restless in daily life, works hard to increase wealth",
    ta: "நல்ல வருமானம்; அரசு, சமூகத்தில் ஆதாயம்; தாயின் அன்பு குறைவு; தினசரி வாழ்வில் அமைதியின்மை; செல்வம் பெருக்க கடின உழைப்பு.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Rahu", page: 35,
    en: "Loss of wealth and separation from family, clever in earning wealth, makes unauthorised efforts secretly to get wealth, faces domestic problems and family bickering, courageous, feels restlessness",
    ta: "செல்வ இழப்பும் குடும்பப் பிரிவும்; செல்வம் ஈட்டுவதில் சாமர்த்தியம்; ரகசியமாக அனுமதியற்ற முயற்சிகள்; குடும்பத்தில் பிரச்சினையும் சண்டையும்; தைரியம்; மனத்தில் அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Ketu", page: 37,
    en: "Loss in wealth and feels shortage of money, experiences family unhappiness",
    ta: "செல்வ இழப்பும் பணத் தட்டுப்பாடும்; குடும்பத்தில் மகிழ்ச்சியின்மை.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Sun", page: 42,
    en: "Enjoys wealth, land, some bondage in connection with mother, happiness of family and also through buildings",
    ta: "செல்வமும் நிலமும்; தாயின் வகையில் சில கட்டுப்பாடு; குடும்ப மகிழ்ச்சியும் கட்டிடங்களால் மகிழ்ச்சியும்.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Moon", page: 44,
    en: "Accumulates wealth, happy with brothers and sisters, feels weak in physical strength, gains in the daily life through career, puts lot of labour",
    ta: "செல்வம் சேர்ப்பார்; உடன்பிறப்புகளால் மகிழ்ச்சி; உடல் வலிமை குறைவு; தொழில் வழியில் தினசரி வாழ்வில் ஆதாயம்; மிகுந்த உழைப்பு.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Mars", page: 46,
    en: "Difficulties relating to monetary gains and family, distress in profession and in the house of wife, troubles in education and in the house of children",
    ta: "பொருள் ஆதாயத்திலும் குடும்பத்திலும் சிரமம்; தொழிலிலும் மனைவி வீட்டிலும் கவலை; கல்வியிலும் பிள்ளைகள் வீட்டிலும் தொல்லை.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Mercury", page: 48,
    en: "Accumulates huge wealth and much education, gets bondage of children, a good planner and always ambitious in life",
    ta: "பெரும் செல்வமும் நிறைய கல்வியும்; பிள்ளைகள் வகையில் கட்டுப்பாடு; நல்ல திட்டமிடுபவர்; வாழ்வில் எப்போதும் லட்சியம்.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Jupiter", page: 50,
    en: "Gains wealth, progress in the house of wealth, some unhappiness from father, worries in connection with government and society, tries to come out of worries",
    ta: "செல்வம் ஈட்டுவார், செல்வ வீட்டில் முன்னேற்றம்; தந்தை வகையில் சில மனவருத்தம்; அரசு, சமூகத்தில் கவலைகள்; கவலைகளிலிருந்து வெளிவர முயல்வார்.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Venus", page: 52,
    en: "Makes whole-hearted efforts for the increase of wealth, troubles in the house of wealth and family, and somewhat diseased",
    ta: "செல்வம் பெருக்க முழு முயற்சி; செல்வ, குடும்ப வீட்டில் தொல்லைகள்; சிறிது நோய்.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Saturn", page: 54,
    en: "Gets wealth with the help of Destiny, gets respect from government and society, some satisfaction through mother, deficiency in the management of lands and buildings, works hard for enjoying wealth, somewhat restless, bondage in the house of government and society and father",
    ta: "விதியின் உதவியால் செல்வம்; அரசு, சமூகத்தில் மரியாதை; தாய் வழியில் சிறு திருப்தி; நிலம், கட்டிடங்களை நிர்வகிப்பதில் குறை; செல்வத்தை அனுபவிக்க கடின உழைப்பு; சிறிது அமைதியின்மை; அரசு, தந்தை வகையில் கட்டுப்பாடு.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Rahu", page: 56,
    en: "Works hard for getting wealth, plans for wealth, sometimes faces troubles in getting wealth, makes great efforts to the house of wealth permanently",
    ta: "செல்வத்துக்காகக் கடின உழைப்பு; திட்டமிடுவார்; சில நேரம் செல்வம் பெறுவதில் தொல்லை; செல்வ வீட்டில் நிலையான பெரும் முயற்சி.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Ketu", page: 58,
    en: "Loss in wealth, bears pains and becomes restless, deep loss in wealth",
    ta: "செல்வ இழப்பு; வலியும் அமைதியின்மையும்; ஆழ்ந்த செல்வ இழப்பு.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Sun", page: 62,
    en: "Labours hard for increasing the wealth, separation in connection with brothers and sisters, influence in connection with wealth, success of his physical strength only in the monetary progress",
    ta: "செல்வம் பெருக்க கடினமாக உழைப்பார்; உடன்பிறப்புகளுடன் பிரிவு; செல்வத்தில் செல்வாக்கு; உடல் வலிமை பண முன்னேற்றத்தில் மட்டும் வெற்றி.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Moon", page: 64,
    en: "Gets huge wealth, follows Dharma, progress in the house of wealth and respectable",
    ta: "பெரும் செல்வம்; தர்மத்தைப் பின்பற்றுவார்; செல்வ வீட்டில் முன்னேற்றம்; மதிப்புக்குரியவர்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Mars", page: 66,
    en: "Heavy loss in wealth, also in family, weakness on the side of maternal and paternal house, works hard to get wealth, some secret gains by intricate policies, some distress in the house of children, obstacles in Dharma",
    ta: "செல்வத்தில் பெரும் இழப்பு; குடும்பத்திலும் இழப்பு; தாய், தந்தை வீட்டில் பலவீனம்; செல்வத்துக்காக கடின உழைப்பு; தந்திரமான வழிகளில் சில ரகசிய ஆதாயம்; பிள்ளைகள் வகையில் சிரமம்; தர்மத்தில் தடைகள்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Mercury", page: 68,
    en: "Accumulates huge wealth, gets lands and buildings, maternal happiness, increase in family and wealth, feels happy in the daily routine",
    ta: "பெரும் செல்வம்; நிலமும் கட்டிடமும்; தாய் வழி மகிழ்ச்சி; குடும்பமும் செல்வமும் பெருகும்; தினசரி வாழ்வில் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Jupiter", page: 70,
    en: "Increase in wealth by his efforts, help from father, some bondage and help from the house of wife, worry in the daily routine of life, keeps huge influence in the house of enemy, gets wealth due to work in the government and society, comes from a wealthy family",
    ta: "முயற்சியால் செல்வம் பெருகும்; தந்தையின் உதவி; மனைவி வீட்டில் சில கட்டுப்பாடும் உதவியும்; தினசரி வாழ்வில் கவலை; எதிரி வீட்டில் பெரும் செல்வாக்கு; அரசு, சமூக வேலையால் செல்வம்; செல்வந்தர் குடும்பம்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Venus", page: 72,
    en: "Some loss in wealth, earns wealth by planning, acquires education, feels some mental worries, works hard for wealth",
    ta: "செல்வத்தில் சிறு இழப்பு; திட்டமிட்டு செல்வம் ஈட்டுவார்; கல்வி பெறுவார்; மனத்தில் சில கவலைகள்; செல்வத்துக்காக கடினமாக உழைப்பார்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Saturn", page: 74,
    en: "Loss in accumulated wealth, spends the daily routine lazily, weakness in the house of family and also hindrances",
    ta: "சேர்த்த செல்வத்தில் இழப்பு; நாள் வாழ்க்கையை சோம்பலாகக் கழிப்பார்; குடும்பத்தில் பலவீனமும் தடைகளும்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Rahu", page: 76,
    en: "Gets losses in the house of wealth, highly worried on account of loss, great distress in the house of family, makes secret schemes for making wealth, takes the best of others",
    ta: "செல்வ வீட்டில் இழப்பு; இழப்பால் மிகுந்த கவலை; குடும்பத்தில் பெரும் துன்பம்; செல்வம் ஈட்ட ரகசியத் திட்டங்கள்; பிறரிடமிருந்து சிறந்ததைப் பறிப்பார்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Ketu", page: 78,
    en: "Great loss and frustrations in the house of wealth, distress in the family, works hard to get wealth, finally gets success",
    ta: "செல்வ வீட்டில் பெரும் இழப்பும் ஏமாற்றமும்; குடும்பத்தில் துன்பம்; செல்வம் ஈட்ட கடினமாக உழைப்பார்; இறுதியில் வெற்றி பெறுவார்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Sun", page: 82,
    en: "Is very rich and possesses a big family, anxiety in the daily routine of life, influence from the side of wealth, increases the wealth and is much respected",
    ta: "மிகுந்த செல்வந்தர்; பெரிய குடும்பம்; தினசரி வாழ்வில் கவலை; செல்வ வகையில் செல்வாக்கு; செல்வத்தைப் பெருக்குவார்; மிகுந்த மரியாதை.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Moon", page: 85,
    en: "Earns huge wealth, maintains aristocracy in the daily routine and keeps dignity, engages himself in worldly affairs, gets respect, selfish",
    ta: "பெரும் செல்வம் ஈட்டுவார்; தினசரி வாழ்வில் குலப் பெருமையைக் காப்பார்; உலக விவகாரங்களில் ஈடுபடுவார்; மரியாதை பெறுவார்; சுயநலம்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Mars", page: 87,
    en: "Does great and valuable deeds in his life through wisdom, earns huge wealth, rises, gets happy children, gets education, gets respect in the house of government and society and family, enjoys gains due to his cleverness, some restlessness in the daily life, is very witty",
    ta: "ஞானத்தால் பெரிய, மதிப்புமிக்க செயல்கள்; பெரும் செல்வம்; முன்னேற்றம்; மகிழ்ச்சியான பிள்ளைகள்; கல்வி; அரசு, சமூகத்திலும் குடும்பத்திலும் மரியாதை; தன் சாமர்த்தியத்தால் ஆதாயம்; தினசரி வாழ்வில் சிறு அமைதியின்மை; மிகுந்த நகைச்சுவை.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Mercury", page: 89,
    en: "Earns money, some incomplete happiness in the house of brothers and sisters, tries to control the expenditure, gets respect",
    ta: "பணம் ஈட்டுவார்; உடன்பிறப்புகள் வகையில் சில முழுமையற்ற மகிழ்ச்சி; செலவைக் கட்டுப்படுத்த முயல்வார்; மரியாதை பெறுவார்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Jupiter", page: 91,
    en: "Earns huge wealth, does influential deeds, puts hard labour, gets much honour, respect and honour with some ordinary difficulties from the house of government and society and father",
    ta: "பெரும் செல்வம் ஈட்டுவார்; செல்வாக்கான செயல்கள்; கடின உழைப்பு; பெரும் மரியாதையும் கௌரவமும்; அரசு, சமூகம், தந்தை வகையில் சாதாரண சிரமங்கள்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Venus", page: 93,
    en: "Straggles to gain wealth, some loss in the house of motherland and in the happiness of mother, aristocracy in the daily routine and is respectable",
    ta: "செல்வம் பெற போராடுவார்; தாய்நாடு, தாய் வகையில் சில இழப்பு; தினசரி வாழ்வில் கம்பீரம்; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Saturn", page: 95,
    en: "Good longevity, restlessness in connection with wife and family, aristocracy in the daily routine of life, gets the already accumulated wealth, is delightful",
    ta: "நல்ல ஆயுள்; மனைவி, குடும்ப வகையில் அமைதியின்மை; தினசரி வாழ்வில் கம்பீரம்; ஏற்கெனவே சேர்த்த செல்வம் கிடைக்கும்; மகிழ்ச்சியானவர்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Rahu", page: 97,
    en: "Loss of wealth, worries in the head due to loss of wealth, takes loans and is anxious",
    ta: "செல்வ இழப்பு; செல்வ இழப்பால் தலையில் கவலை; கடன் வாங்குவார்; பதற்றம்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Ketu", page: 99,
    en: "Gets great power of his physical and energetic strength and attains good success through great power of patience, gets success and courage due to power of hard labour",
    ta: "உடல், ஆற்றல் வலிமையால் பெரும் சாதனை; மிகுந்த பொறுமையால் நல்ல வெற்றி; கடின உழைப்பால் வெற்றியும் தைரியமும்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Sun", page: 104,
    en: "Earns wealth, is called very rich, maintains an aristocratic lifestyle, long-lived, has the influence on family",
    ta: "செல்வம் ஈட்டுவார்; மிகுந்த செல்வந்தர் என அழைக்கப்படுவார்; கம்பீர வாழ்வு; நீண்ட ஆயுள்; குடும்பத்தில் செல்வாக்கு.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Moon", page: 106,
    en: "Some loss and some weakness in the house of accumulation of wealth, some loss in the family, is fully engaged mentally to accumulate wealth, and is aristocratic",
    ta: "செல்வம் சேர்ப்பதில் சில இழப்பும் குறைவும்; குடும்ப இழப்பு; செல்வம் சேர்க்க மனத்தை முழுமையாக ஈடுபடுத்துவார்; கம்பீரமானவர்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Mars", page: 108,
    en: "Is very fortunate, gets increment in the natural wealth, gets land and property, makes some nuisance like in the house of domestic happiness and in the side of mother, gets the pleasures of children, bears gentleness in the house of education",
    ta: "மிகுந்த அதிர்ஷ்டசாலி; இயற்கைச் செல்வம் பெருகும்; நிலமும் சொத்தும்; வீட்டு மகிழ்ச்சியிலும் தாய் வகையிலும் சில தொல்லை; பிள்ளைகளின் இன்பம்; கல்வியில் மென்மை.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Mercury", page: 110,
    en: "Accumulates much wealth, gets high income, has a big family, carelessness in the daily routine of life, limited way in the house of income, acquires respect",
    ta: "பெரும் செல்வம்; அதிக வருமானம்; பெரிய குடும்பம்; தினசரி வாழ்வில் அசட்டை; வருமான வகையில் குறுகிய வழி; மரியாதை பெறுவார்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Jupiter", page: 112,
    en: "Spends life in a very aristocratic way and some weakness, experiences some perplexity with regard to children",
    ta: "மிகவும் கம்பீரமான வாழ்வு; சில பலவீனம்; பிள்ளைகள் வகையில் சில குழப்பம்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Venus", page: 114,
    en: "Some weakness in the house of wealth and family",
    ta: "செல்வ வீட்டிலும் குடும்பத்திலும் சில பலவீனம்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Saturn", page: 116,
    en: "Some success and also losses in the house of wealth, hindrances in the house of happiness and mother, some restlessness in the buildings and residential places, restlessness in the house of wife and daily occupation",
    ta: "செல்வ வீட்டில் சில வெற்றியும் இழப்பும்; மகிழ்ச்சி, தாய் வகையில் தடைகள்; கட்டிடங்கள், குடியிருப்புகளில் சிறு அமைதியின்மை; மனைவி வீட்டிலும் தினசரி தொழிலிலும் அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Rahu", page: 118,
    en: "Some loss in the house of wealth, experiences some weakness in the house of family, uses secret means to acquire wealth, and is somewhat restless",
    ta: "செல்வ வீட்டில் சில இழப்பு; குடும்ப வீட்டில் சில பலவீனம்; செல்வம் பெற ரகசிய வழிகள்; சிறிது அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Ketu", page: 120,
    en: "Some deficiency in the store of wealth, some weakness in the house of family, and works very patiently regarding his worldly wisdom",
    ta: "செல்வக் களஞ்சியத்தில் சில குறை; குடும்ப வீட்டில் சில பலவீனம்; உலக ஞானத்துடன் மிகப் பொறுமையாக வேலை செய்வார்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Sun", page: 125,
    en: "Great loss of wealth, spends money unnecessarily, faces the loss of family, gets some influence in the daily routine of life, serves his purpose through deep and intricate policies",
    ta: "பெரும் செல்வ இழப்பு; தேவையின்றி பணம் செலவழிப்பார்; குடும்ப இழப்பு; தினசரி வாழ்வில் சில செல்வாக்கு; ஆழமான, சிக்கலான வழிகளால் தன் நோக்கத்தை நிறைவேற்றுவார்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Moon", page: 127,
    en: "Earns huge wealth and accumulates it, has a big family, feels great happiness of gains during the period of life, lives long, remains busy in deep politics, is respectable",
    ta: "பெரும் செல்வம் ஈட்டி சேர்ப்பார்; பெரிய குடும்பம்; வாழ்வில் ஆதாய மகிழ்ச்சி; நீண்ட ஆயுள்; ஆழ்ந்த அரசியலில் ஈடுபடுவார்; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Mars", page: 129,
    en: "Spends his life rolling in wealth, gets a long life, feels some deficiency on the side of brother, some loss in accumulating wealth, some loss in family, and is very talkative",
    ta: "செல்வக் குவியலில் வாழ்வார்; நீண்ட ஆயுள்; சகோதரர் வகையில் சில குறை; செல்வம் சேர்ப்பதில் சில இழப்பு; குடும்பத்தில் சில இழப்பு; அதிகம் பேசுவார்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Mercury", page: 131,
    en: "Earns huge wealth, progresses through business, links the progress of family and wealth, is very rich, has a long life",
    ta: "பெரும் செல்வம்; வணிகத்தில் முன்னேற்றம்; குடும்ப முன்னேற்றத்தையும் செல்வத்தையும் இணைப்பார்; மிகுந்த செல்வந்தர்; நீண்ட ஆயுள்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Jupiter", page: 133,
    en: "Gets honour and power of wealth, gets the pleasure of property, some bondage in the pleasures in the house of mother and wife, gets wealth from the daily occupation, gets the help from the house of father, gets honour and happiness in government and society, some happiness in life, has a long life, has influence in the house of enemies, happiness in the side of maternal grandfather's family",
    ta: "மரியாதையும் செல்வ வலிமையும்; சொத்தின் இன்பம்; தாய், மனைவி வகையில் சில கட்டுப்பாடு; தினசரி தொழிலில் பொருள்; தந்தை வீட்டின் உதவி; அரசு, சமூகத்தில் மரியாதையும் மகிழ்ச்சியும்; சில மகிழ்ச்சி; நீண்ட ஆயுள்; எதிரி வீட்டில் செல்வாக்கு; தாய்வழி தாத்தா குடும்பத்தில் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Venus", page: 136,
    en: "Is very rich, is very fortunate and respectable, has a family, spends his life in an aristocratic way",
    ta: "மிகுந்த செல்வந்தர்; மிக அதிர்ஷ்டசாலி, மரியாதைக்குரியவர்; குடும்பம் உண்டு; கம்பீரமாக வாழ்வார்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Saturn", page: 138,
    en: "Earns huge wealth and does some grand deeds, injures the house of mother a bit, some carelessness with age, gets progress with some difficulties on the side of children, somewhat restlessness",
    ta: "பெரும் செல்வம் ஈட்டுவார்; சில பெரிய செயல்கள்; தாய் வீட்டுக்கு சிறு காயம்; வயதில் சில அசட்டை; பிள்ளைகள் வகையில் சில சிரமங்களுடன் முன்னேற்றம்; சிறிது அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Rahu", page: 140,
    en: "Some weakness in the side of wealth, gets some family troubles, manages his affairs for some time by taking loans, gets sudden loss in the matter of wealth",
    ta: "செல்வ வகையில் சில பலவீனம்; குடும்பத் தொல்லைகள்; கடன் வாங்கி சிலகாலம் காரியங்களை நடத்துவார்; செல்வ விஷயத்தில் திடீர் இழப்பு.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Ketu", page: 142,
    en: "Unable to hoard wealth, gets family distress also, feels internal weakness in comparison to outward firmness of wealth, manages to increase wealth with great efibrts",
    ta: "செல்வத்தைச் சேர்க்க முடியாது; குடும்பத்தில் துன்பம்; வெளித்தோற்றத்தின் உறுதிக்கு மாறாக உள்ளே பலவீனம்; பெரும் முயற்சியால் செல்வத்தை பெருக்குவார்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Sun", page: 146,
    en: "Accumulates much wealth, gets heavy income, gets the advantage of the family and wealth, apparently seems to be rich, is glorious and respectable",
    ta: "மிகுந்த செல்வம்; அதிக வருமானம்; குடும்பம், செல்வம் இரண்டிலும் ஆதாயம்; செல்வந்தர் போலத் தோன்றுவார்; கம்பீரமும் மரியாதையும்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Moon", page: 148,
    en: "Weakness in the house of wealth, loss of fortune through business, increase in longevity, works secretly to get wealth",
    ta: "செல்வ வீட்டில் பலவீனம்; வணிகத்தால் அதிர்ஷ்ட இழப்பு; ஆயுள் நீடிக்கும்; ரகசியமாக செல்வம் தேடுவார்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Mars", page: 150,
    en: "Gets increment in wealth through the house of business and occupation, gets much power, deficiency in the happiness from the house of wife, gets excess of sexual pleasures, some happiness from son",
    ta: "வணிகமும் தொழிலும் வழியாக செல்வம் பெருகும்; மிகுந்த வலிமை; மனைவி வீட்டில் மகிழ்ச்சி குறைவு; பாலியல் இன்பம் மிகுதி; மகனால் சில மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Mercury", page: 152,
    en: "Is wealthy and respectable, experiences pleasures in life due to power of expenditure and destiny, gets progress with some weakness in the house of family",
    ta: "செல்வந்தர், மரியாதைக்குரியவர்; செலவின் வலிமையாலும் விதியாலும் வாழ்வில் இன்பம்; குடும்பத்தில் சில பலவீனத்துடன் முன்னேற்றம்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Jupiter", page: 154,
    en: "Gets huge wealth, gets respect, keeps influence in the house of enemies, some progress with father and is wise",
    ta: "மிகுந்த செல்வம்; மரியாதை; எதிரி வீட்டில் செல்வாக்கு; தந்தை வகையில் சில முன்னேற்றம்; ஞானமுள்ளவர்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Venus", page: 156,
    en: "Gets advantage of wealth, gets long life, uses strength to increase wealth, sometimes gets losses in the house of wealth, some pleasures and some struggles in his family, is dependent",
    ta: "செல்வ நன்மை; நீண்ட ஆயுள்; செல்வம் பெருக்க வலிமையைப் பயன்படுத்துவார்; சில நேரம் செல்வ வீட்டில் இழப்பு; குடும்பத்தில் சில இன்பமும் போராட்டமும்; சார்ந்திருப்பவர்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Saturn", page: 158,
    en: "Gets powers of land and property, cares much about the accumulated cash deposit, feels great happiness due to power of intellect, people and wealth, improves the house of mother, gets the problems and bondage in the side of mother and children",
    ta: "நிலமும் சொத்தும் வலிமை; சேமிப்புப் பணத்தில் அதிக அக்கறை; அறிவால், மக்களால், செல்வத்தால் பெரும் மகிழ்ச்சி; தாய் வீட்டை மேம்படுத்துவார்; தாய், பிள்ளைகள் வகையில் சிக்கலும் கட்டுப்பாடும்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Rahu", page: 160,
    en: "Some unhappiness in the place of accumulating wealth, some distress in connection with family, bears severe blows on wealth and people",
    ta: "செல்வம் சேர்க்கும் இடத்தில் சில மனக்குறை; குடும்பத்தில் சில துன்பம்; செல்வத்திலும் மனிதர்களிலும் கடுமையான அடிகள்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Ketu", page: 162,
    en: "Some loss in the house of wealth, some loss of family, faces sudden losses, toils hard for accumulating wealth",
    ta: "செல்வ வீட்டில் சில இழப்பு; குடும்பத்தில் சில இழப்பு; திடீர் இழப்புகள்; செல்வம் சேர்க்க கடினமாக உழைப்பார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Sun", page: 167,
    en: "Earns a lot of wealth from his business and occupation, enjoys gains firm government and society, gets influence in family, gets hereditary gains, is very industrious and honourable",
    ta: "தொழிலிலும் வேலையிலும் பெரும் செல்வம்; அரசு, சமூகத்தில் ஆதாயம்; குடும்பத்தில் செல்வாக்கு; பரம்பரைச் சொத்து; மிகுந்த உழைப்பும் மரியாதையும்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Moon", page: 170,
    en: "Is very fortunate and wealthy, gets a lot of wealth by the pow* of destiny, gets pleasures of family, gets the success in worldly affairs, increases in age",
    ta: "மிக அதிர்ஷ்டசாலி, செல்வந்தர்; விதியின் வலிமையால் பெரும் செல்வம்; குடும்ப இன்பம்; உலக விவகாரங்களில் வெற்றி; ஆயுள் கூடும்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Mars", page: 172,
    en: "Rich due to his physique, always puts in special efforts for getting wealth, toils hard for accumulating wealth, acquires education, some enmity in the side of children, follows low Dharma",
    ta: "உடல் வலிமையால் செல்வந்தர்; செல்வம் பெற எப்போதும் சிறப்பு முயற்சி; செல்வம் சேர்க்க கடுமையாக உழைப்பார்; கல்வி பெறுவார்; பிள்ளைகள் வகையில் சில பகை; தாழ்ந்த தர்மத்தைப் பின்பற்றுவார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Mercury", page: 174,
    en: "Gets success in accumulating wealth, faces some losses also, gets some deficiency in accumulating wealth on account of rich standard of living in the daily routine of life, has a long life, is respectable and enjoys riches, gets heavy gains",
    ta: "செல்வம் சேர்ப்பதில் வெற்றி; சில இழப்பும் உண்டு; உயர்ந்த வாழ்க்கைத் தரத்தால் செல்வம் சேர்ப்பதில் சிறு குறை; நீண்ட ஆயுள்; மரியாதைக்குரியவர்; பெரும் ஆதாயம்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Jupiter", page: 176,
    en: "Accumulates wealth through the power of intellect and education, gets advantage from the government and society, gets children",
    ta: "அறிவாலும் கல்வியாலும் செல்வம் சேர்ப்பார்; அரசு, சமூகத்தில் ஆதாயம்; பிள்ளைகள் பெறுவார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Venus", page: 178,
    en: "Gets wealth from occupation, gets some weakness in the house of accumulating wealth and gets some monetary loss, wants more sexual pleasures, tries to check the expenditure",
    ta: "தொழிலில் செல்வம்; செல்வம் சேர்க்கும் இடத்தில் சில பலவீனம், பண இழப்பு; பாலியல் இன்பத்தை மிகவும் விரும்புவார்; செலவைக் கட்டுப்படுத்த முயல்வார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Saturn", page: 180,
    en: "Gets the income from land and property, feels pleasure in accumulating wealth, some bondage in the happiness of mother, gets good income, some happiness in longevity and daily routine, always attempts to increase the wealth, and is always happy",
    ta: "நிலம், சொத்தின் மூலம் வருமானம்; செல்வம் சேர்ப்பதில் மகிழ்ச்சி; தாய் மகிழ்ச்சியில் சில கட்டுப்பாடு; நல்ல வருமானம்; ஆயுளிலும் நாள் வாழ்விலும் சில மகிழ்ச்சி; செல்வத்தை எப்போதும் பெருக்க முயல்வார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Rahu", page: 182,
    en: "Distress of wealth, bears the loss and the shortage of wealth, loss and deficiency in family, is poor, and has devotion to do the work",
    ta: "செல்வத்தில் துன்பம்; இழப்பும் செல்வக் குறையும்; குடும்பத்தில் இழப்பும் குறையும்; ஏழ்மை; வேலையில் பக்தி.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Ketu", page: 184,
    en: "Tries to increase the wealth, great disorder about the progress of the family, gets a show of aristocracy, has to face great troubles in connection with acquiring wealth",
    ta: "செல்வத்தைப் பெருக்க முயல்வார்; குடும்ப முன்னேற்றத்தில் பெரும் குழப்பம்; கம்பீரத் தோற்றம்; செல்வம் பெறுவதில் பெரும் சிரமங்கள்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Sun", page: 189,
    en: "Gets wealth with great difficulty, faces problems in family matters, has difficulties in accumulating wealth, has a long life, faces some loss in the side of Dharma, gives more importance to wealth than to Dharma, spends life in a civilised way, and is fortunate",
    ta: "பெரும் சிரமத்துடன் செல்வம்; குடும்ப விவகாரங்களில் சிக்கல்; செல்வம் சேர்ப்பதில் கடினம்; நீண்ட ஆயுள்; தர்ம வகையில் சில இழப்பு; தர்மத்தைவிட செல்வத்துக்கு முக்கியத்துவம்; நாகரிகமான வாழ்வு; அதிர்ஷ்டசாலி.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Moon", page: 191,
    en: "Spends the daily routine or life in an aristocratic manner, experiences loss and deficiency in the accumulation of wealth, gets family loss, has a long life, works through difficulties",
    ta: "தினசரி வாழ்வை கம்பீரமாகக் கழிப்பார்; செல்வம் சேர்ப்பதில் இழப்பும் குறையும்; குடும்ப இழப்பு; நீண்ட ஆயுள்; கடின வழிகளில் வேலை செய்வார்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Mars", page: 193,
    en: "Loss and gain in the house of wealth, gets much wealth due to his wisdom, spends the existing wealth of very high and deep intellectual power",
    ta: "செல்வ வீட்டில் இழப்பும் ஆதாயமும்; தன் அறிவால் மிகுந்த செல்வம்; இருக்கும் செல்வத்தை மிக உயர்ந்த ஆழ்ந்த அறிவாற்றலுடன் செலவிடுவார்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Mercury", page: 195,
    en: "Earns much wealth through business and occupation, gets progress in business, gets lot of wealth from father, possesses a big family, faces some bondage in wife and family, wants more sexual pleasures, accumulates wealth, gets advantage from the government, is very wise and clever",
    ta: "வணிகத்தாலும் தொழிலாலும் பெரும் செல்வம்; வணிகத்தில் முன்னேற்றம்; தந்தை வழியில் பெரும் செல்வம்; பெரிய குடும்பம்; மனைவி, குடும்ப வகையில் சில கட்டுப்பாடு; பாலியல் இன்பத்தை மிகவும் விரும்புவார்; அரசு வகையில் ஆதாயம்; மிகுந்த அறிவாளி.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Jupiter", page: 197,
    en: "Takes even the risk of life for acquiring wealth, gives more importance to wealth than his life, remains unhappy in the side of wealth, bears loss in the house of mother, gets deficiency in land and buildings, gets weakness in physique, bears distress of family, is happy from business and occupation, and is respectable",
    ta: "செல்வம் பெற உயிரையும் பணயம் வைப்பார்; உயிரைவிட செல்வத்துக்கு முக்கியத்துவம்; செல்வ வகையில் மனவருத்தம்; தாய் வீட்டில் இழப்பு; நிலம், கட்டிடங்களில் குறை; உடல் பலவீனம்; குடும்ப வருத்தம்; தொழில், வணிகத்தால் மகிழ்ச்சி; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Venus", page: 199,
    en: "Earns much wealth and accumulates it, gets some loss, and is respectable",
    ta: "அதிக செல்வம் ஈட்டி சேர்ப்பார்; சில இழப்பு; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Saturn", page: 201,
    en: "Is very rich and gets the means to increase land and buildings, some loss in the house of mother, gets heavy income, some resdessness in the daily routine of life",
    ta: "மிகுந்த செல்வந்தர்; நிலமும் கட்டிடமும் பெருக்கும் வசதி; தாய் வகையில் சில இழப்பு; அதிக வருமானம்; தினசரி வாழ்வில் சில அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Rahu", page: 203,
    en: "Loss in the house of wealth, bears some affliction in the family, uses deep tactics for getting wealth, bears some unhappiness in wealth",
    ta: "செல்வ வீட்டில் இழப்பு; குடும்பத்தில் சில துன்பம்; செல்வம் பெற ஆழ்ந்த தந்திரங்கள்; செல்வத்தில் சில மனவருத்தம்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Ketu", page: 205,
    en: "Bears troubles in connection with wealth, gets loss in the house of family, always works for the accumulation of wealth and uses occult practices",
    ta: "செல்வ வகையில் தொல்லைகள்; குடும்ப வீட்டில் இழப்பு; எப்போதும் செல்வம் சேர்க்கவே வேலை செய்வார்; மாயவித்தைகளைப் பயன்படுத்துவார்.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Sun", page: 210,
    en: "Bears loss and deficiency in the house of wealth and separation from family members, spends the daily routine of life very aristocratically and with elegance, gets increased longevity and bears troubles in accumulating wealth",
    ta: "செல்வ வீட்டில் இழப்பும் குறையும், குடும்பத்தினரிடமிருந்து பிரிவும்; தினசரி வாழ்வில் கம்பீரமாகவும் நயத்துடனும் வாழ்வார்; ஆயுள் கூடும்; செல்வம் சேர்ப்பதில் துன்பம்.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Moon", page: 212,
    en: "Accumulates much wealth through the line of occupation, faces bondage and deficiency in the house of wife, bears some unpleasantness in family",
    ta: "தொழில் வழியில் பெரும் செல்வம்; மனைவி வீட்டில் கட்டுப்பாடும் குறையும்; குடும்பத்தில் சில அதிருப்தி.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Mars", page: 214,
    en: "Gets monetary gains, land and property, happiness with some deficiency in the house of children and education",
    ta: "பொருள் ஆதாயம், நிலமும் சொத்தும்; பிள்ளைகள், கல்வி வகையில் சில குறையுடன் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Mercury", page: 216,
    en: "Is very wealthy and fortunate, gets advantage from the family but also has a little deficiency in the family, has some restlessness in acquiring wealth",
    ta: "மிகுந்த செல்வந்தர், அதிர்ஷ்டசாலி; குடும்பத்தால் ஆதாயம், ஆனால் குடும்பத்தில் சிறு குறை; செல்வம் சேர்ப்பதில் சில அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Jupiter", page: 218,
    en: "Bears loss and deficiency in the house of wealth, has deficiency in brother's side, does not achieve the required success, some deficiency in the house of family",
    ta: "செல்வ வீட்டில் இழப்பும் குறையும்; சகோதரர் வகையில் குறை; எதிர்பார்த்த வெற்றி கிடைக்காது; குடும்பத்தில் சில குறை.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Venus", page: 220,
    en: "Accumulates much wealth, gets power from father's house, earns wealth cleverly through education and intellect, manages a big business, has good luck, faces bondage from the children's side, gets the advantage from the government and society, acquires honour and respect in the daily routine",
    ta: "மிகுந்த செல்வம்; தந்தை வீட்டிலிருந்து ஆற்றல்; கல்வியாலும் அறிவாலும் சாமர்த்தியமாகச் செல்வம் ஈட்டுவார்; பெரிய வியாபாரம்; நல்ல அதிர்ஷ்டம்; பிள்ளைகள் வகையில் கட்டுப்பாடு; அரசு, சமூகத்தில் ஆதாயம்; தினசரி வாழ்வில் மரியாதையும் கௌரவமும்.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Saturn", page: 222,
    en: "Is very rich and accumulates wealth, risks his life for wealth, acquires progress of the family, weakness from other's side, deficiency in landed property, deficiency in the house of happiness, restlessness in the daily routine of life",
    ta: "மிகுந்த செல்வந்தர், செல்வம் சேர்ப்பார்; செல்வத்துக்காக உயிரை பணயம் வைப்பார்; குடும்ப முன்னேற்றம்; பிறர் வகையில் பலவீனம்; நில சொத்தில் குறை; மகிழ்ச்சி வீட்டில் குறை; தினசரி வாழ்வில் அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Rahu", page: 224,
    en: "Gets loss in the house of wealth, is always worried for the increase in the wealth, does difficult deeds for increasing the wealth, sometimes faces great calamity for wealth, gets the separation of family",
    ta: "செல்வ வீட்டில் இழப்பு; செல்வம் பெருக்க எப்போதும் கவலை; செல்வத்துக்காக கடின செயல்கள்; சில நேரம் பெரும் ஆபத்து; குடும்பப் பிரிவு.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Ketu", page: 226,
    en: "Has deficiency in the side of wealth, works hard for acquiring wealth, feces severe calamities",
    ta: "செல்வ வகையில் குறை; செல்வம் சேர்க்க கடினமாக உழைப்பார்; கடுமையான ஆபத்துகளைச் சந்திப்பார்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Sun", page: 231,
    en: "Earns wealth through occupation, gets fascination in the house of wife, has some influence in the daily routine of life, does valuable deeds and possesses family",
    ta: "தொழிலால் செல்வம் ஈட்டுவார்; மனைவி வீட்டில் ஈர்ப்பு; தினசரி வாழ்வில் சில செல்வாக்கு; மதிப்புமிக்க செயல்கள்; குடும்பம் உண்டு.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Moon", page: 234,
    en: "Accumulates wealth, faces some separation in family, keeps the influence over the enemy, spends life majestically",
    ta: "செல்வம் சேர்ப்பார்; குடும்பத்தில் சில பிரிவு; எதிரியின் மீது செல்வாக்கு; கம்பீர வாழ்வு.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Mars", page: 236,
    en: "Acquires respect, gets the support of the father, faces some bondage ofbrother, puts good efforts for acquiring wealth, pays some attention to religious deeds, gets the power of education, gains some power of children, tries hard for the progress of the destiny",
    ta: "மரியாதை பெறுவார்; தந்தையின் ஆதரவு; சகோதரர் வகையில் சில கட்டுப்பாடு; செல்வம் சேர்க்க நல்ல முயற்சி; சிறிது தர்ம நாட்டம்; கல்வித் திறன்; பிள்ளைகளின் வலிமை; விதியின் முன்னேற்றத்துக்கு கடுமையான முயற்சி.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Mercury", page: 238,
    en: "Has deficiency in education and also in children, has some weakness in wealth, gets loss and distress in the family, causes loss to already accumulated wealth, gets wisdom, spends life through the narrow way of education and wisdom, and talks with obstinate power of intellect",
    ta: "கல்வியிலும் பிள்ளைகளிலும் குறை; செல்வத்தில் சிறு பலவீனம்; குடும்பத்தில் இழப்பும் துன்பமும்; ஏற்கெனவே சேர்த்த செல்வத்துக்கு இழப்பு; ஞானம் பெறுவார்; கல்வி, அறிவின் குறுகிய வழியில் வாழ்வார்; பிடிவாத அறிவுடன் பேசுவார்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Jupiter", page: 240,
    en: "Is very rich and gets heavy gains, tries whole-heartedly to accumulate income, possesses great influence in the house of enemies, labours hard, follows tricks and pursues big business occupation to get wealth, gets heavy gains from the house of father, gains respect from government and society, is respectable, and possesses an influential family",
    ta: "மிகுந்த செல்வந்தர், பெரும் ஆதாயம்; வருமானம் ஈட்ட முழு முயற்சி; எதிரி வீட்டில் பெரும் செல்வாக்கு; கடின உழைப்பு; தந்திரம்; செல்வத்துக்காக பெரிய வணிகத் தொழில்; தந்தை வீட்டில் பெரும் ஆதாயம்; அரசு, சமூகத்தில் மரியாதை; மரியாதைக்குரியவர்; செல்வாக்குள்ள குடும்பம்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Venus", page: 242,
    en: "Gets much wealth, experiences the happiness and prosperity in the increase of wealth, gets a big family, gets lands and buildings, accumulates virtue, increases the wealth with the help of destiny, experiences some deficiency in the daily routine of life, works very cleverly for the increase of wealth, faces some weakness in connection with age",
    ta: "மிகுந்த செல்வம்; செல்வ வளர்ச்சியால் மகிழ்ச்சியும் செழிப்பும்; பெரிய குடும்பம்; நிலமும் வீடும்; விதியின் உதவியால் செல்வம் பெருகும்; தினசரி வாழ்வில் சில குறை; வயதில் சில பலவீனம்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Saturn", page: 244,
    en: "Tries to increase wealth with the help of his physique, sometimes bears loss in wealth, tries to control expenditure, gets some advantage from mother and land",
    ta: "உடல் வலிமையால் செல்வம் பெருக்க முயல்வார்; சில நேரம் செல்வ இழப்பு; செலவைக் கட்டுப்படுத்த முயல்வார்; தாய், நிலத்தால் சில ஆதாயம்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Rahu", page: 246,
    en: "Has deficiency in wealth, bears loss in the family, manages the expenditure by taking loans and support from others, bears fatal blows in the house of wealth, and is restless",
    ta: "செல்வக் குறை; குடும்பத்தில் இழப்பு; கடன் வாங்கியும் பிறர் உதவியாலும் செலவை சமாளிப்பார்; செல்வ வீட்டில் கடுமையான அடிகள்; அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Ketu", page: 248,
    en: "Faces deficiency in accumulating wealth, bears loss in wealth, faces disturbance and separation in the family, labours very hard to get wealth",
    ta: "செல்வம் சேர்ப்பதில் குறை; செல்வ இழப்பு; குடும்பத்தில் தொந்தரவும் பிரிவும்; செல்வம் பெற மிகக் கடுமையாக உழைப்பார்.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Sun", page: 253,
    en: "Gets a lot of wealth after hard labour, gets some influence and some separation in the family, faces restlessness in the daily routine of life",
    ta: "கடின உழைப்புக்குப் பின் பெரும் செல்வம்; குடும்பத்தில் சில செல்வாக்கும் பிரிவும்; தினசரி வாழ்வில் அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Moon", page: 255,
    en: "Gets education, earns wealth through will-power, is happy with the progress in family and increase in wealth, faces some bondage regarding children, finds happiness in life, is said to be wealthy and is respectable",
    ta: "கல்வி பெறுவார்; மன உறுதியால் செல்வம் ஈட்டுவார்; குடும்ப முன்னேற்றத்திலும் செல்வ வளர்ச்சியிலும் மகிழ்ச்சி; பிள்ளைகள் வகையில் சில கட்டுப்பாடு; வாழ்வில் மகிழ்ச்சி; செல்வந்தர் என்று சொல்லப்படுவார்; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Mars", page: 257,
    en: "Is rich and fortunate, gets wealthier through destiny, experiences some deficiency and restlessness in the children's side, has deficiency in education and wisdom, maintains aristocracy in the daily life, has faith in God, and possesses fame",
    ta: "செல்வந்தர், அதிர்ஷ்டசாலி; விதியால் மேலும் செல்வம் பெறுவார்; பிள்ளைகள் வகையில் சில குறையும் அமைதியின்மையும்; கல்வி, அறிவில் குறை; தினசரி வாழ்வில் கம்பீரம்; இறைநம்பிக்கை; புகழ்.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Mercury", page: 259,
    en: "Earns wealth through a respectable occupation, gets the strength of property, faces some bondage in family happiness, deficiency in mother's house, faces some bondage from wife's side, has deficiency in sexual pleasures, finds happiness in the daily routine of life",
    ta: "மரியாதைக்குரிய தொழிலால் செல்வம்; சொத்தின் வலிமை; குடும்ப மகிழ்ச்சியில் சில கட்டுப்பாடு; தாய் வீட்டில் குறை; மனைவி வீட்டில் சில கட்டுப்பாடு; பாலியல் இன்பத்தில் குறை; தினசரி வாழ்வில் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Jupiter", page: 261,
    en: "Gets strength of wealth of his father, earns much wealth, manages a big occupation, gets great respect in government and society, gets great dignity in wealth and family, holds great influence in the house of enemies, gets victory over difficulties, and is very influential",
    ta: "தந்தையின் செல்வ வலிமை; அதிகம் சம்பாதிப்பார்; பெரிய தொழில்; அரசு, சமூகத்தில் பெரும் மரியாதை; செல்வத்திலும் குடும்பத்திலும் பெரும் கௌரவம்; எதிரி வீட்டில் பெரும் செல்வாக்கு; கஷ்டங்களில் வெற்றி; மிகுந்த செல்வாக்கு.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Venus", page: 264,
    en: "Faces some bondage in connection with brother, gets the aristocracy in the daily routine of life, gets a long age, bears some loss in existing wealth, acquires wealth through very diplomatic devices, bears some loss in wealth",
    ta: "சகோதரர் வகையில் சில கட்டுப்பாடு; தினசரி வாழ்வில் கம்பீரம்; நீண்ட வயது; இருக்கும் செல்வத்தில் சில இழப்பு; மிகத் தந்திரமான வழிகளில் செல்வம் ஈட்டுவார்; செல்வத்தில் சில இழப்பு.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Saturn", page: 266,
    en: "Experiences weakness in accumulation of wealth, bears heavy loss in the house of wealth, bears some loss in mother's house, finds joy in the diurnal occupation and routine of life, has some deficiency in the house of family",
    ta: "செல்வம் சேர்ப்பதில் பலவீனம்; செல்வ வீட்டில் பெரும் இழப்பு; தாய் வீட்டில் சில இழப்பு; தினசரி தொழிலிலும் வாழ்விலும் மகிழ்ச்சி; குடும்ப வீட்டில் சில குறை.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Rahu", page: 268,
    en: "Bears loss in wealth, faces loss and distress in the family, secures progress after struggling very hard and bearing risks, uses secret power for wealth and labours hard",
    ta: "செல்வ இழப்பு; குடும்பத்தில் இழப்பும் துன்பமும்; மிகுந்த போராட்டத்துக்கும் ஆபத்துக்கும் பின் முன்னேற்றம்; செல்வத்துக்காக ரகசிய சக்தி பயன்படுத்தி கடினமாக உழைப்பார்.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Ketu", page: 270,
    en: "Bears great difficulty in the side of wealth, bears severe pain due to the deficiency of the wealth, bears distress in the house of family, labours very hard and tries his best to get an increase the wealth, is somewhat restless",
    ta: "செல்வ வகையில் மிகுந்த சிரமம்; செல்வக் குறையால் கடும் வலி; குடும்பத்தில் துன்பம்; செல்வத்தை அதிகரிக்க மிகக் கடினமாக உழைப்பார்; சற்று அமைதியற்றவர்.",
  },
];

module.exports = { PLANET_IN_HOUSE };
