/**
 * T.M. Rao's Bhrigu Samhita, "Predictions of <planet> in <lagna> Ascendant": the entries for the planets in each of the twelve
 * houses from each lagna. Each entry is the book's prose as printed (`en`, joined from the page extract; OCR slips are kept),
 * its Tamil summary (`ta`, ours) and the printed page the entry starts on. `planetSign` is the sign the planet stands in
 * (the lagna for house 1, and the sign that many places on for houses 2 to 12). An entry runs on across a page break.
 * The book has no entry for two planets: Sun in Gemini's 5th house (its page goes from the 4th house to the 6th) and Sun in
 * Leo's 10th house (its page goes from the 9th house to the 11th); both checked on the page image, so neither is supplied.
 * 1294 entries in all.
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
    en: "Help from brothers and sisters, courageous and ambitious, little unhappy with wife and also with profession and also in sexual pleasures, feels restless in domestic affairs",
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
    en: "Is physically weak internally but appears to be good from the outside, faces opposition from father, has some friendly and some weak relation with the brother, bears losses in the house of wife, labours hard in occupation, finds some hindrance in the government and society",
    ta: "உள்ளே உடல் பலவீனம், வெளியே நன்றாகத் தெரிவார்; தந்தைக்கு எதிர்ப்பு; சகோதரருடன் சில நட்பும் சில பலவீனமும்; மனைவி வீட்டில் இழப்புகள்; தொழிலில் கடின உழைப்பு; அரசு, சமூகத்தில் சில தடைகள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Rahu", page: 268,
    en: "Feels physical anxieties and experiences some physical deficiency, sometimes experiences blows on the body, gets his work done very cleverly and cautiously, does very laborious deeds, follows secret tactics",
    ta: "உடலில் கவலைகளும் சில குறைகளும்; சில நேரம் உடலில் அடிகள்; வேலையை மிக சாமர்த்தியமாகவும் எச்சரிக்கையாகவும் முடிப்பார்; மிகக் கடினமான செயல்கள்; மறைமுக வழிகள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Ketu", page: 270,
    en: "Bears fatal blows on his body and passes through some dangers, also faces some deficiency in the handsomeness of physique, experiences bondage and dependence, uses his strength secretly",
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
    en: "Earns well, gains from government and society, does not get affection from mother, is restless in daily life, works hard to increase wealth",
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
    en: "Struggles to gain wealth, some loss in the house of motherland and in the happiness of mother, aristocracy in the daily routine and is respectable",
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
    en: "Unable to hoard wealth, gets family distress also, feels internal weakness in comparison to outward firmness of wealth, manages to increase wealth with great efforts",
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
    en: "Is very rich and gets the means to increase land and buildings, some loss in the house of mother, gets heavy income, some restlessness in the daily routine of life",
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
    en: "Acquires respect, gets the support of the father, faces some bondage of brother, puts good efforts for acquiring wealth, pays some attention to religious deeds, gets the power of education, gains some power of children, tries hard for the progress of the destiny",
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
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Sun", page: 21,
    en: "Powerful intellect, gets education, power of children, influence of speech, physically strong, hard-working, peace with brothers, believes in Dharma and has faith in God, very courageous and speaks bravely",
    ta: "வலிமையான அறிவு; கல்வி; குழந்தைகளின் ஆற்றல்; பேச்சில் செல்வாக்கு; உடல் வலிமை; கடின உழைப்பு; உடன்பிறப்புகளுடன் அமைதி; தர்மத்திலும் இறைநம்பிக்கையிலும் நம்பிக்கை; மிகுந்த தைரியம்; துணிச்சலாகப் பேசுவார்.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Moon", page: 23,
    en: "Happiness through brothers and sisters, gains from mother, gets fame, has faith in God, loves Dharma, enjoys landed property, help through brothers",
    ta: "உடன்பிறப்புகளால் மகிழ்ச்சி; தாயால் ஆதாயம்; புகழ்; இறைநம்பிக்கை; தர்மத்தில் பற்று; நிலச் சொத்து; உடன்பிறப்புகளின் உதவி.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Mars", page: 25,
    en: "Energetic, unhappy with brothers, recognised by government and society, comes up by his own merit, does good business, conquers the enemies, overcomes difficulties, gains happiness through father",
    ta: "சுறுசுறுப்பு; உடன்பிறப்புகளால் மனவருத்தம்; அரசு, சமூகத்தில் அங்கீகாரம்; தன் தகுதியால் உயர்வார்; நல்ல வணிகம்; எதிரிகளை வெல்வார்; தடைகளைக் கடப்பார்; தந்தை வழியில் மகிழ்ச்சி.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Mercury", page: 27,
    en: "Intelligent and perfectionist, not much support from brothers and sisters, improves wealth by hard work, is influential and conquers over enemies",
    ta: "அறிவாளி, முழுமை நாடுபவர்; உடன்பிறப்புகளின் ஆதரவு குறைவு; கடின உழைப்பால் செல்வம் பெருக்குவார்; செல்வாக்குள்ளவர்; எதிரிகளை வெல்வார்.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Jupiter", page: 29,
    en: "Fortunate, controls the expenditure, brothers and sisters are helpful, works hard, successful in occupation, enjoys family happiness",
    ta: "அதிர்ஷ்டசாலி; செலவைக் கட்டுப்படுத்துவார்; உடன்பிறப்புகள் உதவுவார்கள்; கடினமாக உழைப்பார்; தொழிலில் வெற்றி; குடும்ப மகிழ்ச்சி.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Venus", page: 31,
    en: "Earns huge wealth through his cleverness, occupies good position, has many helpful brothers and sisters, has influential and good- looking wife, religious, enjoys good sexual pleasures, careful about duty and religion, does different efforts to improve his lot, a man of prestige and is influential and handsome, enjoys domestic and worldly affairs",
    ta: "தன் சாமர்த்தியத்தால் பெரும் செல்வம் ஈட்டுவார்; நல்ல நிலை; உதவும் உடன்பிறப்புகள் பலர்; செல்வாக்கும் அழகும் உள்ள மனைவி; இறைப்பற்று; பாலியல் இன்பம்; கடமையிலும் மதத்திலும் கவனம்; முயற்சிகளால் நிலையை உயர்த்துவார்; மரியாதைக்குரியவர்.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Saturn", page: 33,
    en: "Is energetic and valorous, gets education and help from brothers and sisters, gets honour from government and society, spends much, unhappy with children, is insipid about religion and is proud",
    ta: "சுறுசுறுப்பும் வீரமும்; கல்வியும் உடன்பிறப்புகளின் உதவியும்; அரசு, சமூகத்தில் மரியாதை; அதிகம் செலவழிப்பார்; குழந்தைகள் வகையில் மனவருத்தம்; மதத்தில் ஆர்வம் குறைவு; பெருமை.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Rahu", page: 35,
    en: "Has courage and works hard to earn wealth, controls brothers and sisters, no fear of any kind, exerts pressure on others and is influential",
    ta: "தைரியமும் பொருள் ஈட்ட கடின உழைப்பும்; உடன்பிறப்புகளைக் கட்டுப்படுத்துவார்; எந்த பயமும் இல்லை; பிறர் மீது அழுத்தம் கொடுப்பார்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Ketu", page: 37,
    en: "Unhappiness and enmity with brothers and sisters, weak, follows improper methods, does not lose self-confidence, seems to serve his selfish motives",
    ta: "உடன்பிறப்புகளுடன் மனவருத்தமும் பகையும்; பலவீனம்; முறையற்ற வழிகள்; தன்னம்பிக்கை இழக்காதவர்; சுயநலத்துக்காகச் செயல்படுவது போலத் தோன்றும்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Sun", page: 42,
    en: "Gets the influential happiness from brothers and sisters, gets happiness of buildings and property, help from mother, but is irreligious",
    ta: "உடன்பிறப்புகளால் செல்வாக்கான மகிழ்ச்சி; கட்டிடம், சொத்தின் மகிழ்ச்சி; தாயின் உதவி; ஆனால் தர்ம நாட்டம் குறைவு.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Moon", page: 44,
    en: "Does industrious work, gets very good cooperation from brothers and sisters, hard-working, mental gains, believes in God, has patience",
    ta: "சுறுசுறுப்பான வேலை; உடன்பிறப்புகளின் நல்ல ஒத்துழைப்பு; கடின உழைப்பாளி; மன ஆதாயம்; இறைநம்பிக்கை; பொறுமை.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Mars", page: 46,
    en: "Feels distress and deficiency in the house of wife, separation from brothers, some weakness and wavering in the house of occupation, makes efforts to get influence in the house of enemies",
    ta: "மனைவி வீட்டில் கவலையும் குறையும்; உடன்பிறப்புகளைப் பிரிவு; தொழிலில் சிறு பலவீனமும் தடுமாற்றமும்; எதிரிகள் இடத்தில் செல்வாக்குக்கு முயல்வார்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Mercury", page: 48,
    en: "Gets good education and earnings and also power of children, has discretion power, gets fame and power of brothers and sisters, a good conversationalist",
    ta: "நல்ல கல்வியும் வருமானமும்; குழந்தைகளின் ஆற்றல்; விவேகம்; உடன்பிறப்புகளால் புகழும் ஆற்றலும்; நல்ல பேச்சாளர்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Jupiter", page: 50,
    en: "Gets huge gains, valorous, influential, great dignity on the daily routine of life, has influence on brothers and sisters, gains little importance to Dharma and God",
    ta: "பெரும் ஆதாயம்; வீரம்; செல்வாக்கு; தினசரி வாழ்வில் பெரும் கௌரவம்; உடன்பிறப்புகள் மீது செல்வாக்கு; தர்மத்தையும் இறையையும் சிறிது மதிப்பார்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Venus", page: 52,
    en: "Progress by laborious and daily hard work, enmity with brothers and sisters, has great cause, fortunate, help from maternal grandfather's house",
    ta: "கடின உழைப்பாலும் தினசரி வேலையாலும் முன்னேற்றம்; உடன்பிறப்புகளுடன் பகை; பெரிய காரணம்; அதிர்ஷ்டசாலி; தாய்வழி தாத்தாவின் வீட்டிலிருந்து உதவி.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Saturn", page: 54,
    en: "Makes huge progress by his hard labour, gets success and fame, dissatisfaction through brothers and sisters, a good conversationalist careless in expenditure, follows religious duties, is very influential, courageous and help from father",
    ta: "கடின உழைப்பால் பெரும் முன்னேற்றம்; வெற்றியும் புகழும்; உடன்பிறப்புகளால் அதிருப்தி; நல்ல பேச்சாளர், செலவில் அக்கறையற்றவர்; மதக் கடமைகளைப் பின்பற்றுவார்; மிகுந்த செல்வாக்கும் தைரியமும்; தந்தை வகையில் உதவி.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Rahu", page: 56,
    en: "Gets some loss or separation in the house of brothers and sisters, works secretly, and is selfish",
    ta: "உடன்பிறப்புகள் வகையில் சிறு இழப்பும் பிரிவும்; ரகசியமாக வேலை செய்வார்; சுயநலம்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Ketu", page: 58,
    en: "Does energetic deeds, toils hard for progress, separation from brothers and sisters and restless, brave, worried and diligent",
    ta: "ஆற்றலுடன் செயல்படுவார்; முன்னேற்றத்துக்காக கடுமையாக உழைப்பார்; உடன்பிறப்புகளைப் பிரிந்து அமைதியற்றவர்; தைரியம், கவலை, சுறுசுறுப்பு.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Sun", page: 62,
    en: "Has great physical strength, gets dignity in the house of brothers and sisters, has less faith in God",
    ta: "பெரும் உடல் வலிமை; உடன்பிறப்புகள் வீட்டில் கம்பீரம்; இறைநம்பிக்கை குறைவு.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Moon", page: 64,
    en: "Does very costly labour, earns huge wealth, hurdles and bondage in the house of brothers and sisters, does hard work to earn wealth, earns fame and courageous",
    ta: "மிகுந்த செலவுடன் கடின வேலை; பெரும் செல்வம் ஈட்டுவார்; உடன்பிறப்புகள் வீட்டில் தடைகளும் கட்டுப்பாடும்; செல்வத்துக்காகக் கடின உழைப்பு; புகழ்; தைரியம்.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Mars", page: 66,
    en: "Great influence on the house of enemy, heavy gains by his labour, works with great pride, enmity with brothers, gets much influence and gains in government and society, enmity with father, brave, courageous, and feels some enmity in Dharma",
    ta: "எதிரி வீட்டில் பெரும் செல்வாக்கு; உழைப்பால் பெரும் ஆதாயம்; பெருமையுடன் வேலை செய்வார்; சகோதரருடன் பகை; அரசு, சமூகத்தில் செல்வாக்கும் ஆதாயமும்; தந்தையுடன் பகை; தைரியம்; தர்மத்தில் சிறு பகை.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Mercury", page: 68,
    en: "Happiness with brothers and sisters, gets land, happy with mother, honours Dharma, gets fame, thinks fair, gets courage and enthusiasm",
    ta: "உடன்பிறப்புகளுடன் மகிழ்ச்சி; நிலம் கிடைக்கும்; தாயுடன் மகிழ்ச்சி; தர்மத்தை மதிப்பார்; புகழ்; நேர்மையாக சிந்திப்பார்; தைரியமும் உற்சாகமும்.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Jupiter", page: 70,
    en: "Gets special importance, strength and beauty in the house of wife, connected with government and society, enjoys huge strength of power of sexual pleasures, help from brothers and sisters, deficiency in Dharma, is very energetic and courageous",
    ta: "மனைவி வீட்டில் சிறப்பு, வலிமையும் அழகும்; அரசு, சமூகத்துடன் தொடர்பு; பாலியல் இன்பத்தில் பெரும் வலிமை; உடன்பிறப்புகளின் உதவி; தர்மத்தில் குறை; மிகுந்த சுறுசுறுப்பும் தைரியமும்.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Venus", page: 72,
    en: "Deficiency in the house of brothers and sisters, deficiency in education, unhappy with children, very clever and courageous",
    ta: "உடன்பிறப்புகள் வீட்டில் குறை; கல்வியில் குறை; பிள்ளைகளால் மனவருத்தம்; மிகவும் அறிவாளி, தைரியசாலி.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Saturn", page: 74,
    en: "Labours very hard, unhappy with brothers and sisters, good longevity, follows Tammasic Dharma, toils very hard and spends much",
    ta: "மிகக் கடினமாக உழைப்பார்; உடன்பிறப்புகளால் மனவருத்தம்; நல்ல ஆயுள்; தாமச தர்மத்தைப் பின்பற்றுவார்; மிகுந்த முயற்சி, அதிக செலவு.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Rahu", page: 76,
    en: "Loss and distress of brothers and sisters, does not lose courage, does hard labour, gets fatigued and is timid, selfish, very courageous",
    ta: "உடன்பிறப்புகள் வகையில் இழப்பும் துன்பமும்; தைரியம் இழக்காதவர்; கடின உழைப்பு; சோர்வும் கோழைத்தனமும்; சுயநலம்; மிகுந்த தைரியம்.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Ketu", page: 78,
    en: "Great worries and difficulties in the house of brothers and sisters, loses brotherly effect, does serious labour, toils hard",
    ta: "உடன்பிறப்புகள் வீட்டில் பெரும் கவலையும் தடைகளும்; சகோதர உணர்வு குறையும்; கடுமையான வேலை; மிகக் கடினமாக உழைப்பார்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Sun", page: 82,
    en: "Earns wealth and fame, progress of religion, supposed to be lucky, has brothers and sisters, works hard with high remuneration and is respected, strength of influencing others",
    ta: "செல்வமும் புகழும் ஈட்டுவார்; மதம் முன்னேறும்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; உடன்பிறப்புகள் உண்டு; கடினமாக உழைத்து அதிக ஊதியம் பெறுவார்; மரியாதைக்குரியவர்; பிறரைப் பாதிக்கும் ஆற்றல்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Moon", page: 85,
    en: "Is energetic and works whole-heartedly for the development, is always happy, is faith in Dharma, is lucky, loves brothers and sisters very much, gets handsome physique, gets the fame and does the work peacefully and has strong will-power",
    ta: "ஆற்றலுடன் வளர்ச்சிக்காக முழு முயற்சி; எப்போதும் மகிழ்ச்சி; தர்மத்தில் நம்பிக்கை; அதிர்ஷ்டசாலி; உடன்பிறப்புகளை மிகவும் நேசிப்பார்; அழகான உடல்; புகழ்; அமைதியாக வேலை செய்வார்; வலுவான மன உறுதி.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Mars", page: 87,
    en: "Is very dignified and gets much respect in government and society, respect in the house of father, keeps influence in the house of enemy, never feels nervous or loses courage, does not care for brothers, children, father or Dharma, successful and brave, is very skilful",
    ta: "அரசு, சமூகத்தில் பெரும் மதிப்பும் மரியாதையும்; தந்தை வீட்டில் மரியாதை; எதிரி வீட்டில் செல்வாக்கு; பதற்றமோ தைரியமிழப்போ இல்லை; உடன்பிறப்பு, பிள்ளைகள், தந்தை, தர்மம் பற்றி அக்கறையற்றவர்; வெற்றியும் தைரியமும்; மிகுந்த திறமை.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Mercury", page: 89,
    en: "Is very energetic, gets the advantage of brothers and sisters, has little faith in Dharma, is of good height, possesses the power of expenditure, has great courage, ambition and modesty",
    ta: "மிகுந்த சுறுசுறுப்பு; உடன்பிறப்புகளால் நன்மை; தர்மத்தில் சிறு நம்பிக்கை; நல்ல உயரம்; செலவு செய்யும் வலிமை; பெரும் தைரியம், லட்சியம், அடக்கம்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Jupiter", page: 91,
    en: "Rises due to his vigour and physical strength, thinks much of wife and merriments, small family, gets the power of brothers, gets success in the big way in the house of enemy, always busy, gets deficiency in sexual pleasures and anxiety in family",
    ta: "தன் வலிமையாலும் உடல் பலத்தாலும் உயர்வார்; மனைவி, மகிழ்ச்சி பற்றி அதிகம் நினைப்பார்; சிறிய குடும்பம்; சகோதரர் ஆற்றல்; எதிரி வீட்டில் பெரும் வெற்றி; எப்போதும் வேலையில்; பாலியல் இன்பத்தில் குறை; குடும்பத்தில் கவலை.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Venus", page: 93,
    en: "Weakness in wealth, deficiency in the side of brother, happiness in the house of Dharma, weakness from the house of mother, some weakness in the house of buildings and property and is somewhat lazy",
    ta: "செல்வ வகையில் குறை; சகோதரர் வகையில் பலவீனம்; தர்ம வீட்டில் மகிழ்ச்சி; தாய் வழியில் பலவீனம்; கட்டிடம், சொத்தில் சிறு குறை; சிறிது சோம்பல்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Saturn", page: 95,
    en: "Puts in great energy, follows the daily occupation with energetic deeds, experiences some hardship in the side of children, gets the power in the side of wife and sexual pleasures, perplexity in the house of brothers and sisters, selfish, speaks very bitterly, causes injury to Dharm a",
    ta: "பெரும் ஆற்றலுடன் தினசரி வேலையைச் செய்வார்; பிள்ளைகள் வகையில் சில கஷ்டம்; மனைவி, பாலியல் இன்பத்தில் ஆற்றல்; உடன்பிறப்புகள் வகையில் குழப்பம்; சுயநலம்; மிகக் கடுமையாகப் பேசுவார்; தர்மத்துக்குக் கேடு.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Rahu", page: 97,
    en: "Unhappiness with brothers and sisters, does not follow justice and takes to unjust courses, very clever, careful, patient and courageous",
    ta: "உடன்பிறப்புகளால் மகிழ்ச்சியின்மை; நீதியைப் பின்பற்றாமல் தவறான வழிகளில் செல்வார்; மிகுந்த சாமர்த்தியம், கவனம், பொறுமை, தைரியம்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Ketu", page: 99,
    en: "Gets heavy loss in the house of wealth, labours hard to increase the wealth, sometimes finds problems in earnings, unable to accumulate wealth",
    ta: "செல்வ வீட்டில் பெரும் இழப்பு; செல்வம் பெருக்க கடினமாக உழைப்பார்; சில நேரம் வருமானத்தில் சிக்கல்; செல்வம் சேர்க்க இயலாது.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Sun", page: 104,
    en: "Is supposed to be very lucky, has faith in God, gives importance to Dharma, dissatisfaction in the house of brothers and sisters, gets some weakness in the house of vigour, great hopelessness, and is courageous",
    ta: "மிகவும் அதிர்ஷ்டசாலி; இறைநம்பிக்கை; தர்மத்துக்கு முக்கியத்துவம்; உடன்பிறப்புகள் வீட்டில் அதிருப்தி; ஆற்றல் குறைவில் சில பலவீனம்; பெரும் நம்பிக்கையின்மை; தைரியசாலி.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Moon", page: 106,
    en: "Losses and weakness in the house of brothers and sisters, spends on brothers and sisters, expresses weakness in the vigour due to reasons of heavy expenditure, is calm and energetic",
    ta: "உடன்பிறப்புகள் வீட்டில் இழப்பும் பலவீனமும்; உடன்பிறப்புகளுக்காகச் செலவழிப்பார்; பெரும் செலவால் ஆற்றல் குறைவு; அமைதியும் சுறுசுறுப்பும்.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Mars", page: 108,
    en: "Is very fortunate, achieves great success through his physical strength and vigour, great influence in the house of enemy, does not care a bit for the diseases and difficulties, is very courageous, gets the power of brothers and sisters, and is very influential",
    ta: "மிக அதிர்ஷ்டசாலி; உடல் வலிமையாலும் ஆற்றலாலும் பெரும் வெற்றி; எதிரி வீட்டில் பெரும் செல்வாக்கு; நோய்களையும் கஷ்டங்களையும் பொருட்படுத்தாதவர்; மிகுந்த தைரியம்; உடன்பிறப்புகளின் ஆற்றல்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Mercury", page: 110,
    en: "Earns wealth and many ways of gains, gets the advantage of brothers and sisters, much confidence in God, is very clever",
    ta: "செல்வமும் பல வழி ஆதாயமும்; உடன்பிறப்புகளின் ஆதாயம்; இறைநம்பிக்கை மிகுதி; மிகுந்த அறிவாளி.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Jupiter", page: 112,
    en: "Good longevity, pain in the house of brothers and sisters, gets education",
    ta: "நல்ல ஆயுள்; உடன்பிறப்புகள் வீட்டில் வலி; கல்வி பெறுவார்.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Venus", page: 114,
    en: "Gets the power of brothers, sisters and father, honour in connection with government and society, gets fame, does religious deeds, gets progress from business, industrious, courageous and skilful",
    ta: "சகோதரர், சகோதரி, தந்தை ஆகியோரின் ஆற்றல்; அரசு, சமூகத்தில் மரியாதை; புகழ்; மதச் செயல்கள்; வணிகத்தில் முன்னேற்றம்; கடின உழைப்பு, தைரியம், திறமை.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Saturn", page: 116,
    en: "Gets victory in the house of enemies, great power in everyday occupation, works courageously, some restlessness in the house of children, some restless in the house of expenditure",
    ta: "எதிரி வீட்டில் வெற்றி; தினசரி தொழிலில் பெரும் ஆற்றல்; தைரியமாக வேலை செய்வார்; பிள்ளைகள் வகையில் சில அமைதியின்மை; செலவு வீட்டில் சில அமைதியின்மை.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Rahu", page: 118,
    en: "Gets power of great influence, some separation and some restlessness, possesses the great power of patience and diplomacy in acquiring the most difficult task, does not care for troubles and difficulties, is very clever and in the end seems the increase of wealth",
    ta: "பெரும் செல்வாக்கு; சில பிரிவும் அமைதியின்மையும்; மிகக் கடினமான செயலை சாதிக்க பொறுமையும் ராஜதந்திரமும்; துன்பங்களைப் பொருட்படுத்தாதவர்; மிகுந்த சாமர்த்தியம்; முடிவில் செல்வ வளர்ச்சி.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Ketu", page: 120,
    en: "Some restlessness in the house of brothers and sisters, great rise in influence, does not care for politeness and gentility, always keen to accomplish his selfishness, and is powerful",
    ta: "உடன்பிறப்புகள் வீட்டில் சில அமைதியின்மை; செல்வாக்கில் பெரும் உயர்வு; கண்ணியத்தையும் நாகரிகத்தையும் பொருட்படுத்தாதவர்; சுயநலத்தை நிறைவேற்ற எப்போதும் ஆர்வம்; ஆற்றல் மிக்கவர்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Sun", page: 125,
    en: "Manages the expenditure by his own power, injures brothers, experiences some anxieties, has a weak destiny, is very industrious",
    ta: "தன் சக்தியால் செலவை நிர்வகிப்பார்; உடன்பிறப்புகளுக்கு காயம்; சில கவலைகள்; விதி பலவீனம்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Moon", page: 127,
    en: "Gets ordinary gains through hard labour of brain, is thought to be fortunate due to laborious working, has faith in God and Dharma, distress in the side of brothers",
    ta: "மூளை உழைப்பால் சாதாரண ஆதாயம்; கடின உழைப்பால் அதிர்ஷ்டசாலி என்று கருதப்படுவார்; இறையிலும் தர்மத்திலும் நம்பிக்கை; உடன்பிறப்புகள் வகையில் மனவருத்தம்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Mars", page: 129,
    en: "Labours hard, injures the side of father, gets some weakness in the duty of keeping influence on the side of enemies",
    ta: "கடுமையாக உழைப்பார்; தந்தை வகையில் பாதிப்பு; எதிரிகள் இடத்தில் செல்வாக்கைக் காப்பதில் சிறு பலவீனம்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Mercury", page: 131,
    en: "Is handsome and energetic, gets the power of brothers and sisters, success due to his efficiency, lives with decency, has self-pride, and is a believer in God",
    ta: "அழகும் சுறுசுறுப்பும்; உடன்பிறப்புகளின் ஆற்றல்; திறமையால் வெற்றி; கண்ணியமாக வாழ்வார்; சுயபெருமை; இறைநம்பிக்கை.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Jupiter", page: 133,
    en: "Gains heavily by undertaking many pleasant occupations, gets a beautiful and influential wife, is of good stature, gets sufficient sexual pleasures, brings up the family well, has faith in Dharma, has brothers and sisters, gets the power from the house of mother, labours hard, gets some power from the father-in-law's house, rises after the marriage, gets the development of all these things after the age of sixteen, and is fortunate",
    ta: "பல இனிய தொழில்களால் பெரும் ஆதாயம்; அழகும் செல்வாக்கும் உள்ள மனைவி; நல்ல உயரம்; போதிய பாலியல் இன்பம்; குடும்பத்தை நன்கு வளர்ப்பார்; தர்மத்தில் நம்பிக்கை; உடன்பிறப்புகள்; தாய் வீட்டின் ஆற்றல்; கடுமையாக உழைப்பார்; மாமனார் வீட்டிலிருந்து சில ஆற்றல்; திருமணத்துக்குப் பின் உயர்வு; பதினாறு வயதுக்குப் பின் வளர்ச்சி; அதிர்ஷ்டசாலி.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Venus", page: 136,
    en: "Gets increase in wealth due to the power of destiny, gets much fame, is very religious, has brothers and sisters, honourable and influential",
    ta: "விதியின் வலிமையால் செல்வ வளர்ச்சி; பெரும் புகழ்; மிகுந்த மத நம்பிக்கை; உடன்பிறப்புகள்; மரியாதைக்குரியவர், செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Saturn", page: 138,
    en: "Does very energetic deeds through the wisdom, gets some bitterness in the plans of special expenditure, wins the enemies, keeps the influence on the side of brother, quarrelsome, is very courageous and influential",
    ta: "அறிவால் மிகச் சுறுசுறுப்பான செயல்கள்; சிறப்புச் செலவுத் திட்டங்களில் சில கசப்பு; எதிரிகளை வெல்வார்; சகோதரர் பக்கம் செல்வாக்கு; சண்டைக்காரர்; மிகுந்த தைரியமும் செல்வாக்கும்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Rahu", page: 140,
    en: "Is very industrious and full of valour, gets some distress in the side of brothers, is very courageous and selfish",
    ta: "மிகுந்த உழைப்பாளி, வீரம் நிறைந்தவர்; உடன்பிறப்புகள் வகையில் சில துன்பம்; மிகுந்த தைரியம்; சுயநலம்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Ketu", page: 142,
    en: "Works hard, gets some loss in the side of brothers and sisters and bears separation, works with great courage, is fearless",
    ta: "கடுமையாக உழைப்பார்; உடன்பிறப்புகள் வகையில் சில இழப்பும் பிரிவும்; மிகுந்த தைரியத்துடன் வேலை செய்வார்; அஞ்சாதவர்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Sun", page: 146,
    en: "Has great power and influence and is courageous, gets advantage of brothers, gets wealth and gains from the house of Dharma, is very energetic",
    ta: "பெரும் ஆற்றலும் செல்வாக்கும் தைரியமும்; உடன்பிறப்புகளின் ஆதாயம்; தர்ம வீட்டிலிருந்து செல்வமும் ஆதாயமும்; மிகுந்த சுறுசுறுப்பு.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Moon", page: 148,
    en: "Gets the conjunction of brothers and sisters, is very fortunate and successful, rears Dharma, has full faith in God, very clever and industrious",
    ta: "உடன்பிறப்புகளுடன் இணைப்பு; மிக அதிர்ஷ்டசாலி, வெற்றியாளர்; தர்மத்தைக் காப்பவர்; இறையில் முழு நம்பிக்கை; மிகுந்த அறிவாளி, உழைப்பாளி.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Mars", page: 150,
    en: "Does influential labour, influence and progress in connection with occupation, gets influential and beautiful wife, but gets some bondage in the side of wife and brother, some dissatisfaction in the house of father, some weakness on account of sexual pleasures, occupation, wealth and power, some deficiency in the house of government and society, perplexities in the house of enemies",
    ta: "தொழிலில் செல்வாக்கான உழைப்பும் முன்னேற்றமும்; செல்வாக்கும் அழகும் உள்ள மனைவி; ஆனால் மனைவி, சகோதரருடன் சில பிணைப்பு; தந்தையிடம் சில அதிருப்தி; பாலியல், தொழில், செல்வம், ஆற்றலில் சில பலவீனம்; அரசு, சமூகத்தில் சில குறை; எதிரிகள் வீட்டில் சிக்கல்கள்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Mercury", page: 152,
    en: "Thought to be very fortunate, is courageous, possesses tender physique, renews contact with brother and sister after some weakness, is respectable and reserved",
    ta: "மிக அதிர்ஷ்டசாலி என்று கருதப்படுவார்; தைரியம்; மென்மையான உடல்; சில பலவீனத்துக்குப் பின் சகோதர சகோதரியுடன் மீண்டும் தொடர்பு; மரியாதைக்குரியவர், அடக்கமானவர்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Jupiter", page: 154,
    en: "Does very good and influential energetic deeds, gets gains in occupation, thought to be very fortunate, gets the power and authority in the house of brother",
    ta: "மிகச் சிறந்த, செல்வாக்கான செயல்கள்; தொழிலில் ஆதாயம்; மிக அதிர்ஷ்டசாலி என்று கருதப்படுவார்; சகோதரர் வீட்டில் அதிகாரமும் ஆற்றலும்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Venus", page: 156,
    en: "Is very energetic, toils hard, some deficiency in the house of brother, and is very clever",
    ta: "மிகுந்த ஆற்றல், கடின உழைப்பு; சகோதரர் வீட்டில் சில குறை; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Saturn", page: 158,
    en: "Is very energetic and has the great power of intellect, is very talkative, is not gentle, talks very freely, has keen children, spends much, puts in labour, opposition in the house of mother",
    ta: "மிகுந்த ஆற்றலும் அறிவின் வலிமையும்; அதிகம் பேசுவார்; மென்மை இல்லாதவர்; வெளிப்படையாகப் பேசுவார்; பிள்ளைகள் மீது அதிக ஆர்வம்; அதிகம் செலவழிப்பார்; உழைப்பார்; தாய் வகையில் எதிர்ப்பு.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Rahu", page: 160,
    en: "Loss in the house of brothers, uses occult power, somewhat inactive and lazy, gets some weakness in physique",
    ta: "சகோதரர் வீட்டில் இழப்பு; மறை ஆற்றலைப் பயன்படுத்துவார்; சிறிது செயலற்றவர், சோம்பல்; உடலில் சில பலவீனம்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Ketu", page: 162,
    en: "Toils very hard, some special and incomplete importance in the house of brother, is very influential, hard worker and diligent, is cunning and violent",
    ta: "கடுமையாக உழைப்பார்; சகோதரர் வகையில் சிறப்பான ஆனால் முழுமையற்ற முக்கியத்துவம்; மிகுந்த செல்வாக்கு; கடின உழைப்பாளி, விடாமுயற்சி; தந்திரமும் வன்முறையும்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Sun", page: 167,
    en: "Very energetic and industrious, gets the power of the house of father and brother with some enmity, progresses through his diligence, gets respect and honour, is said to be fortunate, earns fame, unable to get M success",
    ta: "மிகுந்த சுறுசுறுப்பு; தந்தை, சகோதரர் வீட்டில் வலிமை, சில பகை; தன் முயற்சியால் முன்னேறுவார்; மரியாதையும் கௌரவமும்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; புகழ்; வெற்றி கிடைக்காது.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Moon", page: 170,
    en: "Very enthusiastic and fortunate, religious and a devotee to God, gets unforeseen joy of brothers and sisters, always works with lofty ideas for progress",
    ta: "மிகுந்த ஆர்வம், அதிர்ஷ்டம்; மத நம்பிக்கை, இறைபக்தி; உடன்பிறப்புகளின் எதிர்பாராத மகிழ்ச்சி; முன்னேற்றத்துக்காக உயர்ந்த எண்ணங்களுடன் எப்போதும் வேலை.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Mars", page: 172,
    en: "Is very influential, gets dignity by doing grand deeds, strength in maternal grandfather's house, gets victory over hindrances, acquires full influence over enemies, gets progress in business, weakness in the house of father, keeps his severity over on the house of brother and is lull of self-respect",
    ta: "மிகுந்த செல்வாக்கு; பெரிய செயல்களால் மதிப்பு; தாய்வழி தாத்தா வீட்டில் வலிமை; தடைகளை வெல்வார்; எதிரிகள் மீது முழு செல்வாக்கு; தொழிலில் முன்னேற்றம்; தந்தை வீட்டில் பலவீனம்; சகோதரர் வீட்டில் கண்டிப்பு; மிகுந்த சுயமரியாதை.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Mercury", page: 174,
    en: "Does energetic deeds in a gende manner, has a long life, intimacy in connection with brothers and sisters with some hardship, selfish tactics in connection with Dharma",
    ta: "சாந்தமான முறையில் ஆற்றல் மிக்க செயல்கள்; நீண்ட ஆயுள்; சகோதர சகோதரியுடன் சில கஷ்டங்களுடன் நெருக்கம்; தர்ம விஷயத்தில் சுயநல வழிகள்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Jupiter", page: 176,
    en: "Causes injury to his brothers, weakness in the house of kith and kin, gets weakness in education, is religious, has great faith in God, enjoys heavy gains from the house of occupation, gets cooperation from the wife, enjoys sexual pleasures, and is of weak heart",
    ta: "சகோதரர்களுக்குக் காயம்; உறவினர் வீட்டில் பலவீனம்; கல்வியில் சிறு குறை; மதப்பற்று; இறையில் மிகுந்த நம்பிக்கை; தொழில் வீட்டிலிருந்து பெரும் ஆதாயம்; மனைவியின் ஒத்துழைப்பு; பாலியல் இன்பம்; ஆனால் இதயம் பலவீனம்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Venus", page: 178,
    en: "Labours hard, puts energies in the occupation, gets enthusiasm and sexual pleasures from wife, gets some power of brothers and sisters, gets cooperation of wife and enjoys the expenditure through his own and wife's energies, pays attention towards justice also in occupation",
    ta: "கடுமையாக உழைப்பார்; தொழிலில் ஆற்றலைச் செலுத்துவார்; மனைவியிடமிருந்து ஆர்வமும் பாலியல் இன்பமும்; சகோதர சகோதரியிடமிருந்து சில ஆற்றல்; மனைவியின் ஒத்துழைப்பு; தன் மற்றும் மனைவியின் ஆற்றலால் செலவை அனுபவிப்பார்; தொழிலில் நீதியிலும் கவனம்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Saturn", page: 180,
    en: "Very energetic and does grand deeds, gets the happiness of brothers and sisters, spends too much, progress in the house of children a bit late, some strength of land and property, has a habit of saying cold and hot, happiness from other places",
    ta: "மிகுந்த சுறுசுறுப்பு, பெரிய செயல்கள்; சகோதர சகோதரியின் மகிழ்ச்சி; மிகுந்த செலவு; பிள்ளைகள் வீட்டில் முன்னேற்றம் சற்றுத் தாமதம்; நில, சொத்தில் சில வலிமை; குளிர், வெப்பம் பற்றி பேசும் பழக்கம்; வேறு இடங்களிலிருந்து மகிழ்ச்சி.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Rahu", page: 182,
    en: "Is full of valour, is very courageous and smart, moves on the path of progress, gets success with the help of strong devices, opposes the brother, maintains patience even when facing weaknesses, sometimes loses courage but emerges victorious",
    ta: "மிகுந்த வீரம், தைரியம், சாமர்த்தியம்; முன்னேற்றப் பாதையில் செல்வார்; வலுவான உபாயங்களால் வெற்றி; சகோதரரை எதிர்ப்பார்; பலவீனங்களின்போதும் பொறுமை; சில நேரம் தைரியமிழந்தாலும் வெற்றி பெறுவார்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Ketu", page: 184,
    en: "Is of heroic nature, has long arms, is diligent, faces separation, goes forward enthusiastically though there may be numerous failures, and in the end gets some strong power",
    ta: "வீர இயல்புடையவர்; நீண்ட கரங்கள்; சுறுசுறுப்பானவர்; பிரிவைச் சந்திப்பார்; பல தோல்விகள் இருந்தாலும் ஆர்வத்துடன் முன்னேறுவார்; இறுதியில் சில வலிமையான சக்தி பெறுவார்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Sun", page: 189,
    en: "Rears Dharma, works with great courage, but faces some weakness in his diligence, some deficiency from the brothers and sisters though gets their cooperation, is famous and fortunate",
    ta: "தர்மத்தைக் காப்பார்; மிகுந்த தைரியத்துடன் வேலை செய்வார்; சுறுசுறுப்பில் சில பலவீனம்; உடன்பிறப்புகளின் ஒத்துழைப்பு இருந்தாலும் சிலவற்றில் குறை; புகழ்பெற்றவர்; அதிர்ஷ்டசாலி.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Moon", page: 191,
    en: "Gets loss in the house of brothers and sisters, faces some loss in Dharma, is a man having numerous tactics, and is overjoyed",
    ta: "உடன்பிறப்புகள் வீட்டில் இழப்பு; தர்மத்தில் சில இழப்பு; பல தந்திரங்கள் உடையவர்; மிகவும் மகிழ்ச்சியானவர்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Mars", page: 193,
    en: "Loss in the brother's house, maintains the influence in the house of enemies, experiences deficiency in children, faces some loss in occupation, gets the work done with conceited intellect, is very courageous",
    ta: "சகோதரர் வீட்டில் இழப்பு; எதிரி வீட்டில் செல்வாக்கைப் பராமரிப்பார்; பிள்ளைகளில் குறை; தொழிலில் சில இழப்பு; செருக்கான அறிவுடன் வேலையைச் சாதிப்பார்; மிகுந்த தைரியம்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Mercury", page: 195,
    en: "Gets the power of brothers and sisters, gets progress in family and wife, gets remarkable success in business occupation, works cleverly and diligently, is self-conceited, fortunate and wise",
    ta: "உடன்பிறப்புகளின் ஆற்றல்; குடும்பத்திலும் மனைவியிலும் முன்னேற்றம்; வணிகத் தொழிலில் குறிப்பிடத்தக்க வெற்றி; சாமர்த்தியமாகவும் சுறுசுறுப்பாகவும் வேலை செய்வார்; தன்னம்பிக்கை மிக்கவர், அதிர்ஷ்டசாலி, அறிவாளி.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Jupiter", page: 197,
    en: "Gets monetary gains, gains happiness from wife's house, has deficiency in the side of mother and brother, gets family happiness, and is industrious",
    ta: "பண ஆதாயம்; மனைவி வீட்டில் மகிழ்ச்சி; தாய், சகோதரர் வகையில் குறை; குடும்ப மகிழ்ச்சி; சுறுசுறுப்பானவர்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Venus", page: 199,
    en: "Gets numerous advantages and a heavy income, gets some cooperation and antagonism in the house of brothers",
    ta: "பல ஆதாயங்களும் நல்ல வருமானமும்; சகோதரர் வீட்டில் சில ஒத்துழைப்பும் எதிர்ப்பும்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Saturn", page: 201,
    en: "Narrow wisdom in the affairs connected with wealth, speaks bitterly and rudely, gets deficiency in education also in children's side, spends much with uneasiness, some distress in Dharma, is very industrious and courageous",
    ta: "செல்வம் சம்பந்தமான விஷயங்களில் குறுகிய அறிவு; கடுமையாகவும் முரட்டுத்தனமாகவும் பேசுவார்; கல்வியிலும் பிள்ளைகள் பக்கம் குறை; அமைதியின்மையுடன் அதிகம் செலவழிப்பார்; தர்மத்தில் சில கஷ்டம்; மிகுந்த சுறுசுறுப்பும் தைரியமும்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Rahu", page: 203,
    en: "Is very energetic, works very courageously, achieves success by using great tactics, faces some wrangling in the house of brother",
    ta: "மிகுந்த சுறுசுறுப்பு, மிகத் தைரியமாக வேலை; பெரும் தந்திரத்தால் வெற்றி; சகோதரர் வீட்டில் சில சண்டை.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Ketu", page: 205,
    en: "Loss in the house of brother, labours very hard for his progress, lives with great influence",
    ta: "சகோதரர் வீட்டில் இழப்பு; முன்னேற்றத்துக்காக மிகக் கடினமாக உழைப்பார்; பெரும் செல்வாக்குடன் வாழ்வார்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Sun", page: 210,
    en: "Spends his life with influence, gets a long age, injures the house of fortune and Dharma, feces distress in the house of brother",
    ta: "செல்வாக்குடன் வாழ்வார்; நீண்ட வயது; தர்மம், அதிர்ஷ்டத்தின் வீட்டில் சேதம்; சகோதரர் வீட்டில் கஷ்டம்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Moon", page: 212,
    en: "Works very hard for occupation, gets an influential and beautiful wife, gets special sexual powers, pays attention to the rise of wealth, has conjunction of brothers and sisters",
    ta: "தொழிலுக்கு மிகுந்த உழைப்பு; செல்வாக்கும் அழகும் உள்ள மனைவி; சிறப்பான பாலியல் ஆற்றல்; செல்வ வளர்ச்சியில் கவனம்; உடன்பிறப்புகளின் இணைப்பு.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Mars", page: 214,
    en: "Gets the power of brothers, gets advantage of land and mother's house, advantage in business occupation, also happiness from government and society, gets honour and prestige and is carefree",
    ta: "சகோதரர் ஆற்றல்; நிலம், தாய் வீட்டின் ஆதாயம்; வணிகத் தொழிலில் ஆதாயம்; அரசு, சமூகத்தில் மகிழ்ச்சி; மரியாதையும் கௌரவமும்; கவலையற்றவர்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Mercury", page: 216,
    en: "Is idle, thinks destiny to be great, feels worried from enemy side but gets the protection from destiny, faces some delay in the rise of fate",
    ta: "சோம்பலானவர்; விதியைப் பெரிதாக நினைப்பார்; எதிரி பக்கம் கவலை; ஆனால் விதியின் பாதுகாப்பு கிடைக்கும்; விதியின் உயர்வில் சில தாமதம்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Jupiter", page: 218,
    en: "Spends much, gets advantage with family and profession, possesses a special desire for sexual pleasures, and gets weakness in brothers' house",
    ta: "அதிகம் செலவழிப்பார்; குடும்பத்தாலும் தொழிலாலும் ஆதாயம்; பாலியல் இன்பத்தில் சிறப்பு விருப்பம்; சகோதரர் வீட்டில் பலவீனம்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Venus", page: 220,
    en: "Is very influential and possesses a handsome stature, has brothers and sisters, gets much wisdom and education, gets advantage in government affairs, gets loss in Dharma, is a good manager",
    ta: "மிகுந்த செல்வாக்கும் அழகான தோற்றமும்; உடன்பிறப்புகள் உண்டு; மிகுந்த ஞானமும் கல்வியும்; அரசு விவகாரங்களில் ஆதாயம்; தர்மத்தில் இழப்பு; நல்ல நிர்வாகி.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Saturn", page: 222,
    en: "Is very influential, and energetic, works very hard, has deficiency in the house of brothers and sisters, deficiency in expenditure, believes in God",
    ta: "மிகுந்த செல்வாக்கும் சுறுசுறுப்பும்; மிகக் கடினமாக உழைப்பார்; உடன்பிறப்புகள் வீட்டில் குறை; செலவில் குறை; இறைநம்பிக்கை.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Rahu", page: 224,
    en: "Is very influential and works very courageously, faces some loss in the house of brother, uses very secret tactics to increase his influence, is very clever, cautious and haughty",
    ta: "சுறுசுறுப்பாகவும் தைரியமாகவும் வேலை செய்வார்; பெரிய தந்திரங்களால் வெற்றி; சகோதரர் வீட்டில் சில சண்டை.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Ketu", page: 226,
    en: "Is very energetic and works diligently, bears loss of brothers and sisters, feces severe failures, feels deficiency in the strength",
    ta: "மிகுந்த சுறுசுறுப்பும் கடின உழைப்பும்; சகோதர சகோதரி இழப்பு; கடுமையான தோல்விகளைச் சந்திப்பார்; ஆற்றலில் குறை.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Sun", page: 231,
    en: "Pursues a great business, accomplishes the daily task very influentially, gets very influential wife, gets the dignity of the power of brother and family, gets excess of sexual pleasures, labours very hard, weakness in destiny, deficiency in Dharma",
    ta: "பெரும் தொழில் நடத்துவார்; தினசரி வேலையை மிக செல்வாக்குடன் செய்வார்; செல்வாக்கான மனைவி; சகோதரர், குடும்பத்தின் வலிமை; பாலியல் இன்பம் மிகுதி; கடுமையாக உழைப்பார்; விதியில் பலவீனம்; தர்மத்தில் குறை.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Moon", page: 234,
    en: "Puts forward energetic deeds, gets influence due to the power of concentration, suppresses the enemy, faces opposition from the brother, takes great care about Dharma, toils hard and is powerful",
    ta: "சுறுசுறுப்பான செயல்கள்; ஒருமுகப்படுத்தும் ஆற்றலால் செல்வாக்கு; எதிரியை அடக்குவார்; சகோதரர் எதிர்ப்பு; தர்மத்தில் மிகுந்த அக்கறை; கடுமையாக உழைத்து வலிமையானவர்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Mars", page: 236,
    en: "Possesses great authority and influence in government and society, defeats the enemy, gets the power of brother, is very dignified and energetic",
    ta: "அரசு, சமூகத்தில் பெரும் அதிகாரமும் செல்வாக்கும்; எதிரியை வெல்வார்; சகோதரரின் ஆற்றல்; மிகுந்த கம்பீரமும் சுறுசுறுப்பும்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Mercury", page: 238,
    en: "Gets the power of education and intellect, gets children but feces some distress in the side of children, gains some power and also distress from brother and sisters, gets increased longevity, speaks authoritatively and forcibly on worldly affairs, uses intellect and courage in the matters of travelling, and is very carefree",
    ta: "கல்வியின் வலிமையும் அறிவும்; பிள்ளைகள் உண்டு, ஆனால் பிள்ளைகள் வகையில் சில துன்பம்; சகோதர சகோதரி வகையில் சில ஆற்றலும் துன்பமும்; நீண்ட ஆயுள்; உலக விவகாரங்களில் அதிகாரத்துடனும் வலுவாகவும் பேசுவார்; பயணத்தில் அறிவும் தைரியமும்; மிகவும் கவலையற்றவர்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Jupiter", page: 240,
    en: "Earns wealth through his vigour, pursues the occupation vigorously, makes much profit in business, gets a beautiful wife and secures her help, gets help from brother, rears Dharma also, gets many kinds of gains, clothes, ornaments, wealth etc, has fascination regarding sexual pleasures in his heart, and loves beauty",
    ta: "தன் வலிமையால் செல்வம் ஈட்டுவார்; தொழிலை சுறுசுறுப்பாக நடத்துவார்; வணிகத்தில் மிகுந்த ஆதாயம்; அழகான மனைவி, அவரது உதவி; சகோதரர் உதவி; தர்மத்தையும் காப்பார்; பல ஆதாயங்கள், உடை, அணிகலன், செல்வம்; பாலியல் இன்பத்தில் ஈடுபாடு; அழகை விரும்புவார்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Venus", page: 242,
    en: "Gets the progress of destiny comfortably, gets buildings and property, gets brothers and also a mother, possesses cleverness and farsightedness, gets fame, uses the strength of justice, loves peace",
    ta: "விதியின் முன்னேற்றம் சுலபமாக வரும்; நிலமும் சொத்தும்; சகோதரர் மற்றும் தாய் உண்டு; சாமர்த்தியமும் தொலைநோக்கும்; புகழ்; நீதியின் வலிமையைப் பயன்படுத்துவார்; அமைதியை விரும்புவார்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Saturn", page: 244,
    en: "Gets easily tired, labours secretly, has physical weakness, is of short stature, has deficiency in handsomeness, spends much, tries to curtail expenditure, bears loss of brothers, follows a narrow and wrong path and spends in a wrong way, faces some loss and some strength in the side of education and children",
    ta: "எளிதில் சோர்வடைவார்; ரகசியமாக உழைப்பார்; உடல் பலவீனம்; குறுகிய உயரம்; அழகில் குறை; அதிகம் செலவழிப்பார்; செலவைக் குறைக்க முயல்வார்; சகோதரர் இழப்பு; குறுகிய, தவறான வழியில் செல்வார்; கல்வி, பிள்ளைகள் வகையில் சில இழப்பும் சில வலிமையும்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Rahu", page: 246,
    en: "Faces troubles in brother's house, labours very hard to progress, uses secret devices to serve his selfishness, remains cautioned even when bearing severe blows on his power, is very influential and energetic",
    ta: "சகோதரர் வீட்டில் சிக்கல்; முன்னேற்றத்துக்காகக் கடினமாக உழைப்பார்; சுயநலத்துக்காக ரகசிய உபாயங்கள்; தன் வலிமைக்கு கடுமையான அடிகள் விழுந்தாலும் எச்சரிக்கையாக இருப்பார்; மிகுந்த செல்வாக்கும் ஆற்றலும்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Ketu", page: 248,
    en: "Is very energetic and works with great courage, faces distress in the house of brother, possesses secret plans, feels deficiency in his strength",
    ta: "மிகுந்த சுறுசுறுப்பு, பெரும் தைரியமாக வேலை; சகோதரர் வீட்டில் துன்பம்; ரகசியத் திட்டங்கள் உண்டு; வலிமையில் குறை.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Sun", page: 253,
    en: "Is very diligent, respects Dharma, feces opposition from brothers and sisters, feels some fatigue due to labour, is clever and illustrious",
    ta: "மிகுந்த உழைப்பாளி; தர்மத்தை மதிப்பார்; சகோதர சகோதரியின் எதிர்ப்பு; உழைப்பால் சில சோர்வு; புத்திசாலி, புகழ்பெற்றவர்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Moon", page: 255,
    en: "Has reliance on education and intellect, gets the power of children and strength of brothers and sisters, is unable to care for Dharma, has less faith in God, gets happiness from mother, gets buildings and property, gets rise in honour in government and society, develops business",
    ta: "கல்வியிலும் அறிவிலும் நம்பிக்கை; பிள்ளைகளின் ஆற்றல், சகோதர சகோதரியின் வலிமை; தர்மத்தைக் காக்க முடியாது; இறைநம்பிக்கை குறைவு; தாயால் மகிழ்ச்சி; நிலமும் சொத்தும்; அரசு, சமூகத்தில் மரியாதை உயரும்; தொழில் வளரும்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Mars", page: 257,
    en: "Rears Dharma, gets advantage from government and society, gains advantage from father's house, gets the strength from brother, gains influence in the side of enemies",
    ta: "தர்மத்தைக் காப்பார்; அரசு, சமூகத்தில் ஆதாயம்; தந்தை வீட்டில் ஆதாயம்; சகோதரரின் வலிமை; எதிரி வீட்டில் செல்வாக்கு.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Mercury", page: 259,
    en: "Gets success in occupation, gets power from mother, gets the strength of land, buildings, brothers and sisters and of wife, lives comfortably, gets sexual pleasures",
    ta: "தொழிலில் வெற்றி; தாயிடமிருந்து ஆற்றல்; நிலம், கட்டிடம், சகோதர சகோதரி, மனைவி ஆகியோரின் வலிமை; வசதியாக வாழ்வார்; பாலியல் இன்பம்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Jupiter", page: 261,
    en: "Acquires the progress after labouring very hard and through hereditary deeds, gets the support of government and society, faces some opposition from brother, feels deficiency in income, rears Dharma, gets dignity in the line of occupation, gets grandeur in wife, gets influence and pleasures of the family, is of obstinate nature, and is influential",
    ta: "மிகுந்த கடின உழைப்புக்கும் பரம்பரைச் செயல்களுக்கும் பின் முன்னேற்றம்; அரசு, சமூகத்தின் ஆதரவு; சகோதரரிடம் சில எதிர்ப்பு; வருமானக் குறை; தர்மத்தைக் காப்பார்; தொழிலில் கௌரவம்; மனைவி வீட்டில் சிறப்பு; குடும்பத்தின் செல்வாக்கும் இன்பமும்; பிடிவாத இயல்பு; செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Venus", page: 264,
    en: "Faces some troubles with brothers and sisters, possesses great pride in the daily routine of life, gets good age, injures Dharma, is fearless and influential",
    ta: "சகோதர சகோதரியுடன் சில தொல்லைகள்; தினசரி வாழ்வில் பெரும் பெருமை; நல்ல ஆயுள்; தர்மத்துக்கு கேடு; அஞ்சாதவர், செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Saturn", page: 266,
    en: "Is very energetic, spends more than he earns, bears some loss through brother, has some deficiency in education, bears loss in the side of children, bears some loss in the house of Dharma, has deficiency in fame, has some weakness in his physical strength",
    ta: "மிகுந்த சுறுசுறுப்பு; வருமானத்தை விட அதிகம் செலவழிப்பார்; சகோதரர் வகையில் சில இழப்பு; கல்வியில் குறை; பிள்ளைகள் வகையில் இழப்பு; தர்மத்தின் வீட்டில் சில இழப்பு; புகழ் குறைவு; உடல் வலிமையில் சில பலவீனம்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Rahu", page: 268,
    en: "Gets success in his energetic deeds, labours hard, gets somewhat worried in brothers' house, follows some unjust devices, is very clever and carefree",
    ta: "மிகுந்த உழைப்பால் வெற்றி; கடின உழைப்பு; சகோதரர் வீட்டில் சற்று கவலை; சில அநீதியான உபாயங்களைப் பின்பற்றுவார்; மிகவும் சாமர்த்தியமானவர், கவலையற்றவர்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Ketu", page: 270,
    en: "Is very bold and labours very hard, is restless in the house of brother, possesses great physical strength, possesses great courage, faces some severe calamities, works very patiently, does not consider anything impossible",
    ta: "மிகத் தைரியமும் கடின உழைப்பும்; சகோதரர் வீட்டில் அமைதியின்மை; மிகுந்த உடல் வலிமை; மிகுந்த தைரியம்; சில கடுமையான ஆபத்துகளைச் சந்திப்பார்; மிகப் பொறுமையாக வேலை செய்வார்; எதுவும் இயலாததாக நினைக்க மாட்டார்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Sun", page: 21,
    en: "Gets good education, gets the power of children and qualities of a mother, speaks sweetly, gets land and property, uninterested in the house of father, gets slack at times, malicious in respect of government and society, wise",
    ta: "நல்ல கல்வி; குழந்தைகளின் ஆற்றலும் தாயின் குணங்களும்; இனிமையாகப் பேசுவார்; நிலமும் சொத்தும்; தந்தை வீட்டில் ஆர்வம் குறைவு; சில நேரம் சோம்பல்; அரசு, சமூக வகையில் பொறாமை; அறிவாளி.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Moon", page: 23,
    en: "Gets good motherly affection and landed property through her, is carefree and mentally happy, considers mother as superior to father, undertakes works relating to government and society and enjoys pleasures and luxuries",
    ta: "தாயின் நல்ல அன்பும் நிலச் சொத்தும்; அக்கறையுடன் மனத்தில் மகிழ்ச்சி; தந்தையைவிட தாயை உயர்வாக நினைப்பார்; அரசு, சமூக வேலைகளைச் செய்வார்; இன்பமும் வசதியும் அனுபவிப்பார்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Mars", page: 25,
    en: "Short in stature, loses motherly affection, becomes restless, loses lands and buildings, not happy with wife, hard-working",
    ta: "உயரம் குறைவு; தாயின் அன்பை இழப்பார்; அமைதியின்மை; நிலமும் கட்டிடமும் இழப்பு; மனைவியுடன் மகிழ்ச்சியின்மை; கடின உழைப்பாளி; ஞானமும் அவசரமும்; குழந்தைகளுடன் அதிருப்தி; அதிகம் செலவழிப்பார்; லட்சியமானவர்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Mercury", page: 27,
    en: "Energetic and industrious, faces hindrances from brothers and sisters, happiness from maternal grandfather, dislikes mother, problems in the property, restless, wins over the enemies, gains from occupation, honour from state and society",
    ta: "சுறுசுறுப்பும் உழைப்பும்; உடன்பிறப்புகளால் தடைகள்; தாய்வழி தாத்தாவால் மகிழ்ச்சி; தாயிடம் விருப்பமின்மை; சொத்தில் சிக்கல்; அமைதியின்மை; எதிரிகளை வெல்வார்; தொழிலில் ஆதாயம்; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Jupiter", page: 29,
    en: "Happiness through houses and gains, has good luck, is showy and religious, pleasures from the side of mother, gets no happiness from father and is fortunate",
    ta: "வீடு, ஆதாயங்களால் மகிழ்ச்சி; நல்ல அதிர்ஷ்டம்; ஆடம்பரமும் தர்ம நாட்டமும்; தாய் வழியில் இன்பம்; தந்தையால் மகிழ்ச்சி இல்லை; அதிர்ஷ்டசாலி.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Venus", page: 31,
    en: "Happy and wealthy, gets a good wife, has affection from mother, occupies good position, gets honour in government and society, father helpful, enjoys worldly pleasures and is clever in approach",
    ta: "மகிழ்ச்சியும் செல்வமும்; நல்ல மனைவி; தாயின் அன்பு; நல்ல நிலை; அரசு, சமூகத்தில் மரியாதை; தந்தையின் உதவி; உலக இன்பங்களை அனுபவிப்பார்; சாமர்த்தியமானவர்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Saturn", page: 33,
    en: "Happiness from father, help from government and society, not much affection from mother, suffers from enemies, a bit careless and has to work very hard",
    ta: "தந்தையால் மகிழ்ச்சி; அரசு, சமூகத்தின் உதவி; தாயின் அன்பு குறைவு; எதிரிகளால் துன்பம்; சிறிது அசட்டை; மிகக் கடினமாக உழைக்க வேண்டும்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Rahu", page: 35,
    en: "Loses mother, unhappy and loses peace, loses property and lands, bears mental stress, makes others astonish",
    ta: "தாயை இழப்பார்; மகிழ்ச்சியின்றி அமைதியை இழப்பார்; சொத்தும் நிலமும் இழப்பார்; மன அழுத்தம்; மற்றவர்களை வியக்க வைப்பார்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Ketu", page: 37,
    en: "Lacks motherly affection, gets separated from family, finds losses in immovable properties, lands and buildings, feels restless and unhappy, has to bear grave calamities in his own place and finally succeeds in achieving gains and pleasures",
    ta: "தாயின் அன்பு குறைவு; குடும்பத்தைப் பிரிவார்; அசையாச் சொத்து, நிலம், கட்டிடங்களில் இழப்பு; அமைதியின்மை, மகிழ்ச்சியின்மை; சொந்த ஊரில் பெரும் ஆபத்துகளைத் தாங்குவார்; இறுதியில் ஆதாயமும் இன்பமும் பெறுவார்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Sun", page: 42,
    en: "Gets land and property, happiness from mother, not much help from father, contacts with government and feels happy in his own house",
    ta: "நிலமும் சொத்தும்; தாயால் மகிழ்ச்சி; தந்தையிடம் பெரிய உதவி இல்லை; அரசுடன் தொடர்பு; தன் வீட்டில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Moon", page: 44,
    en: "Happiness through brothers and sisters, gets lands and buildings, help from others, not cordial relations with father, enterprise and happiness",
    ta: "உடன்பிறப்புகளால் மகிழ்ச்சி; நிலமும் கட்டிடமும் பெறுவார்; பிறரின் உதவி; தந்தையுடன் நெருக்கமற்ற உறவு; முயற்சியும் மகிழ்ச்சியும்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Mars", page: 46,
    en: "Loss of mother, gets separated from motherland, happiness in occupation, strong happiness in the side of wife, works hard to earn more wealth, weakness in sexual pleasures, respect from government and society",
    ta: "தாயை இழப்பார்; தாய்நாட்டைப் பிரிவார்; தொழிலில் மகிழ்ச்சி; மனைவி வகையில் பெரும் மகிழ்ச்சி; செல்வம் பெருக்க கடினமாக உழைப்பார்; பாலியல் இன்பத்தில் பலவீனம்; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Mercury", page: 48,
    en: "Acquires good education, gets happiness of children and also gets wealth and also buildings and property, has decent ideas and happiness and comforts, does happy deeds and has good oratorical ability, progress in business",
    ta: "நல்ல கல்வி; பிள்ளைகளின் மகிழ்ச்சி; செல்வமும் கட்டிடமும் சொத்தும்; நல்ல எண்ணங்களும் மகிழ்ச்சியும் வசதியும்; மகிழ்ச்சியான செயல்கள்; நல்ல பேச்சுத் திறன்; வணிகத்தில் முன்னேற்றம்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Jupiter", page: 50,
    en: "Lives long, lame in life and career, separation in the house of mother, benefit from contact of foreign countries, mixed relations with father, opposition from government and society, has occult powers",
    ta: "நீண்ட ஆயுள்; தொழிலிலும் வாழ்விலும் நொண்டித்தன்மை; தாய் வீட்டில் பிரிவு; வெளிநாட்டுத் தொடர்பால் ஆதாயம்; தந்தையுடன் கலந்த உறவு; அரசு, சமூகத்தில் எதிர்ப்பு; மறை ஆற்றல்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Venus", page: 52,
    en: "Enmity with mother, gets some loss and disease in the physical happiness, some unhappiness in the house of father, honour through government and society, problem with regard to land and buildings, tries very hard for the progress of business and house, slight restlessness due to enemies",
    ta: "தாயுடன் பகை; உடல் மகிழ்ச்சியில் சிறு இழப்பும் நோயும்; தந்தை வீட்டில் சிறு அதிருப்தி; அரசு, சமூகத்தில் மரியாதை; நிலம், கட்டிடத்தில் சிக்கல்; தொழிலையும் வீட்டையும் முன்னேற்ற கடினமாக முயல்வார்; எதிரிகளால் சிறு அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Saturn", page: 54,
    en: "Dissatisfaction from parents, gets the influence and high power in the house of enemies, gets honour from government and society, feels a little unhappy, undertakes troublesome deeds and is religious",
    ta: "பெற்றோர் மீது அதிருப்தி; எதிரி வீட்டில் செல்வாக்கும் உயர் அதிகாரமும்; அரசு, சமூகத்தில் மரியாதை; சிறிது மனவருத்தம்; தொல்லை தரும் செயல்களைச் செய்வார்; தர்மத்தில் நாட்டம்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Rahu", page: 56,
    en: "Loss in house of mother, loses land and buildings, unhappy, leaves his birthplace, suffering in life, happiness through secret methods, fatal and deep plans in the place of living and happiness, feels restless",
    ta: "தாய் வீட்டில் இழப்பு; நிலமும் கட்டிடமும் இழப்பு; மகிழ்ச்சியின்மை; பிறந்த ஊரை விட்டு விலகுவார்; வாழ்வில் துன்பம்; ரகசிய வழிகளால் மகிழ்ச்சி; ஆபத்தான ஆழமான திட்டங்கள்; அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Ketu", page: 58,
    en: "Separation from motherland, troubles in buildings and property, many kinds of losses and unhappy, gets happiness after suffering a lot",
    ta: "தாய்நாட்டைப் பிரிவார்; வீடு, சொத்தில் தொல்லைகள்; பல வகை இழப்புகள்; மகிழ்ச்சியின்மை; மிகுந்த துன்பத்துக்குப் பின் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Sun", page: 62,
    en: "Gets happiness of brothers and sisters, gets the strength of buildings and property, gets progress by labour happily, gets influence in the house of mother, respect to father, gets honour and influence in connection with government and society, gets and influence in the house of business",
    ta: "உடன்பிறப்புகளால் மகிழ்ச்சி; கட்டிடம், சொத்தின் வலிமை; மகிழ்ச்சியுடன் உழைப்பால் முன்னேற்றம்; தாய் வீட்டில் செல்வாக்கு; தந்தைக்கு மரியாதை; அரசு, சமூகத்தில் மரியாதையும் செல்வாக்கும்; தொழில் வீட்டில் செல்வாக்கு.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Moon", page: 64,
    en: "Accumulates wealth, lands and buildings and bondage with mother, gets success in wealth and business, honour in the house of government and society, has great patience and peace of mind",
    ta: "செல்வம், நிலம், கட்டிடம் சேர்ப்பார்; தாயுடன் கட்டுப்பாடு; செல்வமும் தொழிலும் வெற்றி; அரசு, சமூகத்தில் மரியாதை; பெரும் பொறுமையும் மன அமைதியும்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Mars", page: 66,
    en: "Some gains and some loss in the house of mother, help from the side of maternal grandfather's house, gets gains from lands and buildings, mixed feeling with regard to happiness, does not care for enemies but gains from them, mixed relations from the side of wife, some industry in the house of father and the government and society",
    ta: "தாய் வீட்டில் சில இழப்பும் சில ஆதாயமும்; தாய்வழி தாத்தா வீட்டில் உதவி; நிலம், கட்டிடத்தால் ஆதாயம்; மகிழ்ச்சியில் கலந்த உணர்வுகள்; எதிரிகளைப் பொருட்படுத்தாவிட்டாலும் அவர்களால் ஆதாயம்; மனைவி வகையில் கலந்த உறவு; தந்தை, அரசு, சமூக வகையில் சில முயற்சி.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Mercury", page: 68,
    en: "Lives happily, has a good physique, deficiency in the house of father, does not care for government and society, gets buildings and property, happy with spiritual powers, careless",
    ta: "மகிழ்ச்சியாக வாழ்வார்; நல்ல உடல்; தந்தை வீட்டில் குறை; அரசு, சமூகத்தைப் பொருட்படுத்தார்; நிலமும் சொத்தும்; ஆன்மிக ஆற்றலில் மகிழ்ச்சி; அசட்டையானவர்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Jupiter", page: 70,
    en: "Gets happiness of business and occupation, gets honour from the house of mother, also happiness from the house of father, does the daily occupation with dignity and in a lofty manner, gets happiness from government and society, gets the strength of lands and buildings, is industrious and honourable",
    ta: "தொழிலிலும் வேலையிலும் மகிழ்ச்சி; தாய் வீட்டில் மரியாதை; தந்தை வீட்டிலும் மகிழ்ச்சி; தினசரி வேலையை கௌரவத்துடனும் உயர்வுடனும் செய்வார்; அரசு, சமூகத்தில் மகிழ்ச்சி; நிலம், கட்டிடங்களின் வலிமை; உழைப்பாளி, மரியாதைக்குரியவர்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Venus", page: 72,
    en: "Loss with mother and separation from motherland and birthplace progress in government and society, weak in education, unhappy with children, feels mental worry due to some domestic unhappiness",
    ta: "தாய் வகையில் இழப்பும், தாய்நாடு, பிறந்த ஊரைப் பிரிவும்; அரசு, சமூகத்தில் முன்னேற்றம்; கல்வியில் பலவீனம்; குழந்தைகளால் அதிருப்தி; குடும்பத்தில் சில கவலைகள்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Saturn", page: 74,
    en: "Some loss in the maternal affection, spends the daily routine of life with influence, some worry and some fortune, engaged in acquiring buildings",
    ta: "தாய்ப் பாசத்தில் சில இழப்பு; வாழ்க்கையை செல்வாக்குடன் கழிப்பார்; சிறு கவலையும் சில அதிர்ஷ்டமும்; கட்டிடங்களைச் சேர்ப்பதில் ஈடுபாடு.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Rahu", page: 76,
    en: "Deficiency in the happiness of mother, gets loss in connection with lands and buildings, unhappy in domestic life, very serious",
    ta: "தாயின் மகிழ்ச்சியில் குறை; நிலம், கட்டிடத்தில் இழப்பு; குடும்ப வாழ்வில் மகிழ்ச்சியின்மை; மிகவும் கடுமையானவர்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Ketu", page: 78,
    en: "Loss and deficiency in the house of mother, some hindrances in connection with lands and buildings, stable position in the house of happiness after many disturbances and difficulties",
    ta: "தாய் வீட்டில் இழப்பும் குறையும்; நிலம், கட்டிடத்தில் சில தடைகள்; பல குழப்பங்களுக்கும் கஷ்டங்களுக்கும் பின் நிலையான மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Sun", page: 82,
    en: "Feels troublesome on account of wealth, restlessness in the house of happiness, some deficiency in the house of father, some deficiency in the house of mother, honour in business, lacks in cash possessions, experiencing troubles regarding land and property, gets respect in government and society, restlessness in the house of family and wealth",
    ta: "வருமானத்தில் கவலை; மகிழ்ச்சியில் அமைதியின்மை; தந்தை வீட்டில் சில குறை; தாய் வீட்டில் சில குறை; தொழிலில் மரியாதை; பணம் குறைவு; நிலம், சொத்தில் சிக்கல்; அரசு, சமூகத்தில் மரியாதை; குடும்பத்திலும் செல்வத்திலும் அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Moon", page: 85,
    en: "Lives happily at his birthplace, is of handsome physique, gets the happiness of lands and property, does big works, makes others cheerful, respects parents, feels troublesome to go to foreign places, gets name and appreciation from government and society, lives peacefully and gets success",
    ta: "பிறந்த ஊரில் மகிழ்ச்சியாக வாழ்வார்; அழகான உடல்; நிலம், சொத்தின் மகிழ்ச்சி; பெரிய வேலைகளைச் செய்வார்; பிறரை மகிழ்விப்பார்; பெற்றோரை மதிப்பார்; வெளிநாடு செல்வது கடினம்; அரசு, சமூகத்தில் பெயரும் பாராட்டும்; அமைதியாக வாழ்ந்து வெற்றி பெறுவார்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Mars", page: 87,
    en: "Gains much intelligence, has a huge business and big undertakings, is an expert in conducting the domestic and worldly affairs, gains profit in the daily routine of life, gets much honour and influence in his own house and in the side of his wife, happiness from father, son and mother, gets land and property, wants to get more sexual pleasures, gets fame in government and society and gets special sexual pleasures",
    ta: "மிகுந்த அறிவு; பெரிய வியாபாரமும் பெரிய முயற்சிகளும்; வீட்டு, உலக விவகாரங்களை நடத்துவதில் நிபுணர்; தினசரி வாழ்வில் ஆதாயம்; தன் வீட்டில், மனைவி வகையில் மரியாதையும் செல்வாக்கும்; தந்தை, மகன், தாய் வகையில் மகிழ்ச்சி; நிலம், சொத்து; மேலும் பாலியல் இன்பம் விரும்புவார்; அரசு, சமூகத்தில் புகழ்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Mercury", page: 89,
    en: "Does his work and manages the expenditure with happiness, deficiency in the house of parents, loss of some land and property, some deficiency in the house of brothers and sisters, meets success and failures in relation to government and society",
    ta: "தன் வேலையைச் செய்து, மகிழ்ச்சியுடன் செலவை நிர்வகிப்பார்; பெற்றோர் வீட்டில் குறை; நிலம், சொத்தில் சிறு இழப்பு; உடன்பிறப்புகள் வீட்டில் சிறு குறை; அரசு, சமூக விவகாரங்களில் வெற்றியும் தோல்வியும்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Jupiter", page: 91,
    en: "Supposed to be lucky, spends much, mixed troubles in the house of mother",
    ta: "அதிர்ஷ்டசாலி; அதிகம் செலவழிப்பார்; தாய் வீட்டில் கலந்த துன்பங்கள்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Venus", page: 93,
    en: "Gets the great advantage of the house and land, gets income at ease, gets some decent things of pleasure, fear from the father, gets restless, is respectable and humble, enjoys happiness from government and society, does very decent deeds",
    ta: "வீட்டிலும் நிலத்திலும் பெரும் ஆதாயம்; எளிதாக வருமானம்; இன்பத்துக்குரிய சில நல்ல பொருட்கள்; தந்தையிடம் பயம்; அமைதியின்மை; மரியாதைக்குரியவர், பணிவானவர்; அரசு, சமூகத்தில் மகிழ்ச்சி; நல்ல செயல்கள்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Saturn", page: 95,
    en: "Great happiness and joyousness, good longevity, deficiency in the house of government and society, enjoys happiness with solemn delusion in the daily occupation, increment in the house of enemies, much happiness in connection with wife, sexual and family pleasures",
    ta: "பெரும் மகிழ்ச்சியும் ஆனந்தமும்; நல்ல ஆயுள்; அரசு, சமூக வகையில் குறை; தினசரி வேலையில் மாயையான அமைதியுடன் மகிழ்ச்சி; எதிரி வீட்டில் அதிகரிப்பு; மனைவியுடன் மிகுந்த மகிழ்ச்சி; பாலியல், குடும்ப இன்பங்கள்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Rahu", page: 97,
    en: "Hindrance in peace and happiness, no cordial relations with the mother, loss of land, buildings and property, unhappiness in the residence, some happiness at the end, is very clever",
    ta: "அமைதிக்கும் மகிழ்ச்சிக்கும் தடை; தாயுடன் நல்ல உறவின்மை; நிலம், கட்டிடம், சொத்து இழப்பு; வீட்டில் மகிழ்ச்சியின்மை; முடிவில் சில மகிழ்ச்சி; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Ketu", page: 99,
    en: "Loss and deficiency in the house of mother and happiness, loss of land and buildings, labours hard, hardship in the house of residence and hindrance in the happiness, yet in the end gets happiness",
    ta: "தாய் வீட்டிலும் மகிழ்ச்சியிலும் இழப்பும் குறையும்; நிலம், கட்டிட இழப்பு; கடுமையாக உழைப்பார்; வசிப்பிடத்தில் கஷ்டமும் மகிழ்ச்சிக்குத் தடையும்; இறுதியில் மகிழ்ச்சி கிடைக்கும்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Sun", page: 104,
    en: "Great power in the house of mother, earns happiness of land and property, lives happily in his own place, some problems in the house of father and business, unhappy in foreign travel, is fearless, wants peace, and is haughty",
    ta: "தாய் வீட்டில் பெரும் வலிமை; நிலமும் சொத்தும் மகிழ்ச்சி; தன் ஊரில் மகிழ்ச்சியாக வாழ்வார்; தந்தை, தொழில் வகையில் சில பிரச்சினைகள்; வெளிநாட்டுப் பயணத்தில் அதிருப்தி; அஞ்சாதவர்; அமைதி விரும்புவார்; கர்வமானவர்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Moon", page: 106,
    en: "Gets weakness and deficiency in the house of mother, gets many hindrances in peace and happiness, gets the loss and weakness of his own house and property, bears mental worries",
    ta: "தாய் வீட்டில் பலவீனமும் குறையும்; அமைதிக்கும் மகிழ்ச்சிக்கும் பல தடைகள்; சொந்த வீடு, சொத்தில் இழப்பும் பலவீனமும்; மன கவலைகள்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Mars", page: 108,
    en: "Gets the power of land and property and mother, enjoys good luck, peace and happiness, insipidness in the house of business and occupation, assumes some dissatisfaction in the house of government and society, worldly affairs, promotion of honour, some insipidness in the house of wife and father, is happy and joyous",
    ta: "நிலமும் சொத்தும் தாயும் கிடைக்கும் வலிமை; நல்ல அதிர்ஷ்டம், அமைதி, மகிழ்ச்சி; தொழிலிலும் வேலையிலும் சலிப்பு; அரசு, சமூகத்தில் சில அதிருப்தி; உலக விவகாரங்கள், மரியாதையின் உயர்வு; மனைவி, தந்தை வகையில் சில சலிப்பு; மகிழ்ச்சியும் உற்சாகமும்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Mercury", page: 110,
    en: "Accumulates wealth, gets the power of building and property, gets his every want satisfied happily sitting at his house, gets good garments and ornaments etc, conducts business through the power of wealth, gets respect in government and society, is a clever worker",
    ta: "செல்வம் சேர்ப்பார்; வீடு, சொத்தின் வலிமை; வீட்டில் அமர்ந்தே எல்லா விருப்பங்களும் மகிழ்ச்சியாக நிறைவேறும்; நல்ல ஆடை, அணிகலன்; செல்வ வலிமையால் வணிகம்; அரசு, சமூகத்தில் மரியாதை; திறமையான உழைப்பாளி.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Jupiter", page: 112,
    en: "Spends his daily routine of life with great happiness, some deficiency in the house of mother, gets the power of children with some deficiency, some difficulty in local pleasure",
    ta: "தினசரி வாழ்வை பெரும் மகிழ்ச்சியுடன் கழிப்பார்; தாய் வீட்டில் சில குறை; குழந்தைகளின் ஆற்றல், சில குறையுடன்; உள்ளூர் இன்பத்தில் சில சிரமம்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Venus", page: 114,
    en: "Embarks on a great business, gets the happiness from brothers, sisters and father, gets power from government and society, great strengths of buildings and property, acquires happiness, a skilled worker",
    ta: "பெரிய தொழிலைத் தொடங்குவார்; சகோதர சகோதரி, தந்தையிடமிருந்து மகிழ்ச்சி; அரசு, சமூகத்தில் ஆற்றல்; நிலமும் சொத்தும் பெரும் வலிமை; மகிழ்ச்சி; திறமையான உழைப்பாளி.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Saturn", page: 116,
    en: "Loss in the affection of house of mother, some dislike in the house of wife, labours hard, is very steady and obstinate on gaining victory over troubles of life and diseases, etc",
    ta: "தாய் வீட்டின் பாசத்தில் இழப்பு; மனைவி வகையில் சில வெறுப்பு; கடுமையாக உழைப்பார்; வாழ்வின் கஷ்டங்களையும் நோய்களையும் வெல்வதில் மிக நிலையானவர், பிடிவாதம்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Rahu", page: 118,
    en: "Gets the loss or separation of mother or in the house of mother, some loss in acquiring happiness, does secret deeds for acquiring happiness, distress in the domestic environment, acquires happiness after much time and many perplexities",
    ta: "தாய் அல்லது தாய் வீட்டில் இழப்பு அல்லது பிரிவு; மகிழ்ச்சி அடைவதில் சில இழப்பு; மகிழ்ச்சிக்காக ரகசியச் செயல்கள்; வீட்டுச் சூழலில் துன்பம்; நீண்ட காலத்துக்குப் பின் பல குழப்பங்களுக்குப் பின் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Ketu", page: 120,
    en: "Some deficiency in the house of mother, gets the separation from his motherland and birthplace, faces great obstacles getting happiness, deficiency in connection with residential place and buildings",
    ta: "தாய் வீட்டில் சில குறை; தாய்நாடு, பிறந்த ஊரிலிருந்து பிரிவு; மகிழ்ச்சி அடைவதில் பெரும் தடைகள்; வசிப்பிடம், கட்டிடங்களில் குறை.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Sun", page: 125,
    en: "Manages the expenditure with deficient in the means of happiness, separation in the house of mother, some weakness in the house of father and in big business occupation, deficiency in the case of honour and in connection with government and society affairs",
    ta: "வசதிக் குறையுடன் செலவை நிர்வகிப்பார்; தாயிடமிருந்து பிரிவு; தந்தை வீட்டிலும் பெரிய தொழிலிலும் சில பலவீனம்; மரியாதையில் குறை; அரசு, சமூக விவகாரங்களில் குறை.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Moon", page: 127,
    en: "Gets huge income comfortably, gets the gains of lands and buildings, gets the pleasure of parents, gains in business of occupation, gains from government and society, is mentally delighted, gets beautiful things, clothes and ornaments, gets happiness from the house of mother",
    ta: "வசதியாக பெரும் வருமானம்; நிலம், கட்டிடங்களின் ஆதாயம்; பெற்றோரின் மகிழ்ச்சி; தொழிலில் ஆதாயம்; அரசு, சமூக வகையில் ஆதாயம்; மன மகிழ்ச்சி; அழகான பொருட்கள், ஆடை, அணிகலன்; தாய் வீட்டில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Mars", page: 129,
    en: "Has a long life, enjoys the whole period of life, some loss in the house of mother, gets wealth and gains, injures the house of wife a little, some deficiency in the house of income, deficiency in the house of father",
    ta: "நீண்ட ஆயுள்; வாழ்நாள் முழுவதும் இன்பம்; தாய் வீட்டில் சில இழப்பு; செல்வமும் ஆதாயமும்; மனைவி வீட்டுக்கு சிறு காயம்; வருமானத்தில் குறை; தந்தை வீட்டில் குறை.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Mercury", page: 131,
    en: "Lives happily, possesses his own house, lives in a beautifully decorated house, gets the happiness of parents, does good business with peace and happiness, gets respect and honour, is a very clever worker, gets honour and happiness from government and society, is a jolly fellow",
    ta: "மகிழ்ச்சியாக வாழ்வார்; சொந்த வீடு; அழகாக அலங்கரிக்கப்பட்ட வீட்டில் வாழ்வார்; பெற்றோரின் மகிழ்ச்சி; அமைதியுடன் நல்ல வணிகம்; மரியாதையும் கௌரவமும்; மிகத் திறமையான உழைப்பாளி; அரசு, சமூகத்தில் மரியாதையும் மகிழ்ச்சியும்; இனிய மனிதர்.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Jupiter", page: 133,
    en: "Gets the happiness from the house of mother and wife, gets property, gets the happiness from the occupation, spends much, does the occupation with happiness, happiness from the house of father, enjoys the pleasures of the family",
    ta: "தாய், மனைவி வீட்டில் மகிழ்ச்சி; சொத்து கிடைக்கும்; தொழிலில் மகிழ்ச்சி; அதிகம் செலவழிப்பார்; மகிழ்ச்சியுடன் தொழில் செய்வார்; தந்தை வீட்டில் மகிழ்ச்சி; குடும்ப இன்பங்களை அனுபவிப்பார்.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Venus", page: 136,
    en: "Hoards wealth, is very fortunate and industrious, has land and buildings, gets the gain of parents",
    ta: "செல்வம் சேர்ப்பார்; அதிர்ஷ்டசாலி, உழைப்பாளி; நிலமும் கட்டிடமும்; பெற்றோரின் ஆதாயம்.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Saturn", page: 138,
    en: "Has huge influence due to his buildings, gets honour, spends deficiency and distress in the happiness of parents, gets the help of some other lady also in the house of mother, deficiency in connection with peace and happiness",
    ta: "கட்டிடங்களால் பெரும் செல்வாக்கு; மரியாதை; பெற்றோரின் மகிழ்ச்சியில் குறையும் துன்பமும்; தாய் வீட்டில் வேறு ஒரு பெண்ணின் உதவியும் கிடைக்கும்; அமைதி, மகிழ்ச்சியில் குறை.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Rahu", page: 140,
    en: "Gets great restlessness in the house of happiness, some loss in the house of mother, feels some sufferings of land, building and the residential place, enjoys the occult power",
    ta: "மகிழ்ச்சி வீட்டில் பெரும் அமைதியின்மை; தாய் வீட்டில் சில இழப்பு; நிலம், கட்டிடம், வசிப்பிடத்தில் சில துன்பம்; மறை ஆற்றலை அனுபவிப்பார்.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Ketu", page: 142,
    en: "Has buildings and property, gets some pleasures, gets some weakness in real peace, full of patience",
    ta: "கட்டிடங்களும் சொத்தும்; சில இன்பங்கள்; உண்மையான அமைதியில் சில பலவீனம்; பொறுமை நிறைந்தவர்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Sun", page: 146,
    en: "Feels some deficiency and uneasiness in the schemes of gains, gets the advantage of father and also of mother but with some deficiency, happiness of mother and buildings",
    ta: "ஆதாயத் திட்டங்களில் சில குறையும் கவலையும்; தந்தையின் ஆதாயமும் தாயின் ஆதாயமும் உண்டு, ஆனால் சில குறையுடன்; தாயின் மகிழ்ச்சியும் கட்டிடங்களும்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Moon", page: 148,
    en: "Has his own buildings, gets honour and respect, happiness from parents, pleasure of a big business, has very noble and mental ideas, respect and honour from government and society",
    ta: "சொந்த கட்டிடங்கள்; மரியாதையும் மதிப்பும்; பெற்றோரின் மகிழ்ச்சி; பெரிய வணிகத்தின் இன்பம்; உயர்ந்த, மன எண்ணங்கள்; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Mars", page: 150,
    en: "Gets happiness and huge wealth due to daily occupation, gets land and property, gets happiness of wife, increase of wealth after marriage, gets supremacy of wife in his house, gets the happiness of the mother, some weakness in the house of government, rise in position is somewhat weak, acquires sexual pleasures and is happy in the family",
    ta: "தினசரி வேலையால் மகிழ்ச்சியும் பெரும் செல்வமும்; நிலமும் சொத்தும்; மனைவியின் மகிழ்ச்சி; திருமணத்துக்குப் பின் செல்வ வளர்ச்சி; வீட்டில் மனைவியின் மேலாதிக்கம்; தாயின் மகிழ்ச்சி; அரசு வீட்டில் சில பலவீனம்; பதவி உயர்வில் சிறு பலவீனம்; பாலியல் இன்பம்; குடும்பத்தில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Mercury", page: 152,
    en: "Enjoys pleasures, spends comfortably, some deficiency in the house of mother, gets the pleasure of mother and land, rears Dharma practically",
    ta: "இன்பங்களை அனுபவிப்பார்; வசதியாகச் செலவழிப்பார்; தாய் வீட்டில் சில குறை; தாயின் மகிழ்ச்சியும் நிலமும்; தர்மத்தை நடைமுறையில் கடைப்பிடிப்பார்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Jupiter", page: 154,
    en: "Gets loss in the house of mother, does not get peace even at home, gets restlessness in the side of brother, spends much, defeats the opposition",
    ta: "தாய் வீட்டில் இழப்பு; வீட்டில் கூட அமைதி இல்லை; சகோதரர் வகையில் அமைதியின்மை; அதிகம் செலவழிப்பார்; எதிர்ப்பை வெல்வார்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Venus", page: 156,
    en: "Spends his life comfortably and happily at his own place, gets long life, some deficiency in the house of parents, performs the governmental, social and domestic tasks very cleverly, is solemn",
    ta: "தன் வீட்டில் வசதியாகவும் மகிழ்ச்சியாகவும் வாழ்வார்; நீண்ட ஆயுள்; பெற்றோர் வீட்டில் சில குறை; அரசு, சமூக, குடும்பப் பணிகளை சாமர்த்தியமாகச் செய்வார்; கம்பீரமானவர்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Saturn", page: 158,
    en: "Is very happy, pays more attention to get the happiness, keeps full influence in the house of enemies, gets the power of motherland and property, completeness in the side of children, is carefree",
    ta: "மிகுந்த மகிழ்ச்சி; மகிழ்ச்சியை அடைய அதிக கவனம்; எதிரி வீட்டில் முழு செல்வாக்கு; தாய்நாடு, சொத்தின் வலிமை; குழந்தைகள் வகையில் நிறைவு; கவலையற்றவர்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Rahu", page: 160,
    en: "Some deficiency in the means of happiness, some weakness in the house of mother, restlessness in the residential place, hindrance in buildings and the house of land",
    ta: "மகிழ்ச்சிக்கான வசதியில் சில குறை; தாய் வீட்டில் சில பலவீனம்; வசிப்பிடத்தில் அமைதியின்மை; கட்டிடம், நிலம் ஆகியவற்றில் தடை.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Ketu", page: 162,
    en: "Loss in the house of mother and happiness, somewhat restless and is clever",
    ta: "தாய் வீட்டிலும் மகிழ்ச்சியிலும் இழப்பு; சிறிது அமைதியின்மை; சாமர்த்தியமானவர்.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Sun", page: 167,
    en: "Conducts the occupation with some happiness, but bears some hindrances, gets the ordinary gains of lands, bears some hindrances in the happiness and grandeur, is respectable and loyal",
    ta: "சில மகிழ்ச்சியுடன் தொழில் நடத்துவார்; ஆனால் சில தடைகளைச் சந்திப்பார்; நிலத்தில் சாதாரண ஆதாயம்; மகிழ்ச்சியிலும் பெருமையிலும் சில தடைகள்; மரியாதைக்குரியவர், விசுவாசமானவர்.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Moon", page: 170,
    en: "Is very fortunate, enjoys much happiness, rears religious duties, enjoys the happiness of mother and the house of land, does a big business, believes in God and is diligent",
    ta: "மிக அதிர்ஷ்டசாலி; பெரும் மகிழ்ச்சி; மத கடமைகளைக் கடைப்பிடிப்பார்; தாயின் மகிழ்ச்சியும் நிலமும்; பெரிய வியாபாரம்; இறைநம்பிக்கை; கடின உழைப்பாளி.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Mars", page: 172,
    en: "Some loss in the side of mother, some loss in happiness, lives in his own place, does daily occupation, faces some opposition in the house of wife, acquires heavy gains and some honour in government and society and possesses some land",
    ta: "தாயால் சில இழப்பு; மகிழ்ச்சியில் சில இழப்பு; தன் ஊரில் வாழ்வார்; தினசரி தொழில்; மனைவி வீட்டில் சில எதிர்ப்பு; அரசு, சமூகத்தில் பெரும் ஆதாயமும் சில மரியாதையும்; சில நிலம் உண்டு.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Mercury", page: 174,
    en: "Acquires the income happily mixed with some hindrances, has a long life, gets happiness from mysterious devices",
    ta: "சில தடைகளுடன் மகிழ்ச்சியாக வருமானம் பெறுவார்; நீண்ட ஆயுள்; மர்மமான வழிகளால் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Jupiter", page: 176,
    en: "Is rich, intelligent and respectable, gets children, gets a long life, spends much, feels weakness in happiness, gets cooperation from mother, receives advantage from father, spends the daily routine of life in an aristocratic manner, experiences some difficulties in maintaining and accumulating wealth",
    ta: "பணக்காரர், அறிவாளி, மரியாதைக்குரியவர்; குழந்தைகள்; நீண்ட ஆயுள்; அதிகம் செலவழிப்பார்; மகிழ்ச்சியில் பலவீனம்; தாயின் ஒத்துழைப்பு; தந்தை வழியில் ஆதாயம்; கம்பீரமாக நாள் வாழ்க்கையைக் கழிப்பார்; செல்வத்தைப் பராமரிப்பதிலும் சேர்ப்பதிலும் சில சிரமம்.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Venus", page: 178,
    en: "Bears some loss and deficiency in occupation, gets some loss in the house of mother, gets happiness from the house of wife, enjoys expenditure and pleasures, enmity in the house of father, gets some ownership of land, is a jolly fellow",
    ta: "தொழிலில் சில இழப்பும் குறையும்; தாய் வீட்டில் சில இழப்பு; மனைவி வீட்டில் மகிழ்ச்சி; செலவும் இன்பமும் அனுபவிப்பார்; தந்தை வீட்டில் பகை; நிலத்தில் சில உரிமை; மகிழ்ச்சியான மனிதர்.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Saturn", page: 180,
    en: "Possesses large property and gets the happiness of land, property and buildings, happiness and strength from mother, gets happiness from brothers and sisters, feels restlessness in the side of enemies, some deficiency in his body, deficiency in the house of father",
    ta: "பெரும் சொத்துடையவர்; நிலம், சொத்து, கட்டிடங்களின் மகிழ்ச்சி; தாயால் மகிழ்ச்சியும் வலிமையும்; உடன்பிறப்புகள் வகையில் மகிழ்ச்சி; எதிரிகள் பக்கம் அமைதியின்மை; உடலில் சில குறை; தந்தை வீட்டில் குறை.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Rahu", page: 182,
    en: "Gets some weakness in the house of mother, gets some deficiency in the house of happiness, gets some hindrance in the land, is somewhat restless on account of quarrelsome family atmosphere",
    ta: "தாய் வீட்டில் சில பலவீனம்; மகிழ்ச்சியில் சில குறை; நிலத்தில் சில தடை; குடும்பச் சூழலில் சண்டையால் சிறிது அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Ketu", page: 184,
    en: "Gets some deficiency in the house of mother, gets deficiency in buildings and property also, deficiency in happiness also, separation from birthplace",
    ta: "தாய் வீட்டில் குறை; கட்டிடம், சொத்திலும் குறை; மகிழ்ச்சியிலும் குறை; பிறந்த ஊரிலிருந்து பிரிவு.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Sun", page: 189,
    en: "Is very fortunate and possesses land and property, gets happiness from other, gets the advantage of father, advantage from the government, gains in the business, does nice deeds",
    ta: "மிக அதிர்ஷ்டசாலி; நிலமும் சொத்தும்; பிறரால் மகிழ்ச்சி; தந்தையின் ஆதாயம்; அரசு வகையில் ஆதாயம்; வணிகத்தில் ஆதாயம்; நல்ல செயல்கள்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Moon", page: 191,
    en: "Some loss in the house of mother, good longevity, some loss in domestic happiness, troubles in progress, honour, business etc, is free from stomach troubles, spends the time carelessly",
    ta: "தாய் வீட்டில் சில இழப்பு; நல்ல ஆயுள்; குடும்ப மகிழ்ச்சியில் சில இழப்பு; முன்னேற்றம், மரியாதை, தொழில் ஆகியவற்றில் தொல்லை; வயிற்றுக் கோளாறு இல்லை; அசட்டையாக நேரம் கழிப்பார்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Mars", page: 193,
    en: "Experiences loss of mother, faces the loss of buildings and property, loss in the house of wife, has some deficiency in education, manages the expenditure with care, lives in foreign places",
    ta: "தாயை இழப்பார்; கட்டிடங்களும் சொத்தும் இழப்பு; மனைவி வீட்டில் இழப்பு; கல்வியில் சில குறை; செலவை கவனமாக நிர்வகிப்பார்; வெளிநாடுகளில் வாழ்வார்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Mercury", page: 195,
    en: "Bears loss and weakness in the house of honour, faces restlessness in family affairs, gets deficiency in the land and property, some deficiency in occupation, acquires some progress in big business, gets weaknesses from the wife's side, and is wise but not apparently",
    ta: "மரியாதையில் இழப்பும் பலவீனமும்; குடும்ப விவகாரங்களில் அமைதியின்மை; நிலமும் சொத்தும் குறையும்; தொழிலில் சில குறை; பெரிய வணிகத்தில் சில முன்னேற்றம்; மனைவி வீட்டில் பலவீனம்; ஞானமுள்ளவர், ஆனால் வெளிப்படையாகத் தெரியாது.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Jupiter", page: 197,
    en: "Gets happiness of mother, possesses lands and buildings, gets dignity and pleasures in the daily routine of life, gets a long life, lives in his own place, and is energetic",
    ta: "தாயின் மகிழ்ச்சி; நிலமும் கட்டிடங்களும்; தினசரி வாழ்வில் கௌரவமும் இன்பமும்; நீண்ட ஆயுள்; தன் ஊரில் வாழ்வார்; ஆற்றல் மிக்கவர்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Venus", page: 199,
    en: "Heavy income, gets land and buildings, gains advantage from mother, wants delicious food, has deficiency in the house of father",
    ta: "பெரும் வருமானம்; நிலமும் கட்டிடங்களும்; தாயால் ஆதாயம்; சுவையான உணவை விரும்புவார்; தந்தை வீட்டில் குறை.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Saturn", page: 201,
    en: "Achieves both happiness and unhappiness with regard to wealth, conjunction of stepmother, sweet influence in the house of enemies, gets his work done with regard to diseases, is somewhat physically restless",
    ta: "செல்வத்தில் மகிழ்ச்சியும் துன்பமும் இரண்டும்; மாற்றாந்தாயின் தொடர்பு; எதிரி வீட்டில் இனிய செல்வாக்கு; நோய்களைப் பற்றிய வேலையை முடிப்பார்; உடலில் சிறு அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Rahu", page: 203,
    en: "Gets loss in mother's house, faces many obstacles in happiness, has some deficiency in connection with land and buildings, faces separation from mother and motherland",
    ta: "தாய் வீட்டில் இழப்பு; மகிழ்ச்சியில் பல தடைகள்; நிலம், கட்டிடங்களில் சில குறை; தாயையும் தாய்நாட்டையும் பிரிவார்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Ketu", page: 205,
    en: "Gets troubles in the house of mother and faces separation from her. is restless in connection with happiness, gets deficiency of land and buildings, takes risk in getting happiness and in the end gets some happiness, is obstinate about achieving happiness, and is patient",
    ta: "தாய் வகையில் தொல்லைகளும் அவரிடமிருந்து பிரிவும்; மகிழ்ச்சி பற்றி அமைதியின்மை; நிலம், கட்டிடங்களில் குறை; மகிழ்ச்சி பெற ஆபத்து எடுப்பார்; இறுதியில் சில மகிழ்ச்சி; மகிழ்ச்சியை அடைவதில் பிடிவாதம்; பொறுமையானவர்.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Sun", page: 210,
    en: "Gets the hidden wealth, bears some loss in the mother's house, gets a long age, faces distress in father's house, gets weakness in government and society, spends the daily life with pleasure, is somewhat inactive, and is hasty",
    ta: "மறைந்த செல்வம் கிடைக்கும்; தாய் வீட்டில் சில இழப்பு; நீண்ட வயது; தந்தை வீட்டில் கவலை; அரசு, சமூகத்தில் பலவீனம்; தினசரி வாழ்வை மகிழ்ச்சியுடன் கழிப்பார்; சிறிது சோம்பல், அவசரம்.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Moon", page: 212,
    en: "Gets good happiness in family, gets a beautiful wife, gets property, gets sexual pleasures, gets happiness in occupation, gets honour in government and society, is a happy and jolly fellow",
    ta: "குடும்பத்தில் நல்ல மகிழ்ச்சி; அழகான மனைவி; சொத்து; பாலியல் இன்பம்; தொழிலில் மகிழ்ச்சி; அரசு, சமூகத்தில் மரியாதை; மகிழ்ச்சியான, கலகலப்பானவர்.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Mars", page: 214,
    en: "Gets income from land and property, idleness in connection with occupation, deficiency from wife, gets deficiency in sexual pleasure, gets happiness from government and society",
    ta: "நிலம், சொத்தில் வருமானம்; தொழிலில் சோம்பல்; மனைவி வகையில் குறை; பாலியல் இன்பத்தில் குறை; அரசு, சமூகத்தில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Mercury", page: 216,
    en: "Gets the happiness through the power of destiny, gets the happiness of some land and buildings, gets the victory in enemies house",
    ta: "விதியின் வலிமையால் மகிழ்ச்சி; சில நிலமும் கட்டிடமும் மகிழ்ச்சி; பகைவர் வீட்டில் வெற்றி.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Jupiter", page: 218,
    en: "Spends majestically, manages the expenditure comfortably and bears some loss and weakness in land and property, faces obstacles in acquiring peace and happiness, unable to control the excess of expenditure, is somewhat restless",
    ta: "கம்பீரமாகச் செலவழிப்பார்; செலவை சௌகரியமாக நிர்வகிப்பார், ஆனால் நிலம், சொத்தில் சில இழப்பும் பலவீனமும்; அமைதியும் மகிழ்ச்சியும் பெறுவதில் தடைகள்; அதிகச் செலவைக் கட்டுப்படுத்த முடியாது; சிறிது அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Venus", page: 220,
    en: "Gets numerous advantages, manages a big business, gains happiness from parents and children, gets education, owns building and property, gets the advantage from the government and society, wants beauty and art, is respectable",
    ta: "பல ஆதாயங்கள்; பெரிய வியாபாரம்; பெற்றோர், குழந்தைகளால் மகிழ்ச்சி; கல்வி; கட்டிடமும் சொத்தும்; அரசு, சமூகத்தில் ஆதாயம்; அழகையும் கலையையும் விரும்புவார்; மரியாதைக்குரியவர்.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Saturn", page: 222,
    en: "Restlessness and deficiency in the house of happiness, gets influence in the house of enemies, does a big business, deficiency in the land and property",
    ta: "மகிழ்ச்சியில் அமைதியின்மையும் குறையும்; பகைவர் வீட்டில் செல்வாக்கு; பெரிய வியாபாரம்; நிலம், சொத்தில் குறை.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Rahu", page: 224,
    en: "Causes affliction to mother, has some deficiency in the residential place, lacks pleasures and happiness, gets the support of hidden powers",
    ta: "தாய்க்குத் துன்பம்; வசிப்பிடத்தில் சில குறை; இன்பமும் மகிழ்ச்சியும் குறைவு; மறைந்த சக்திகளின் ஆதரவு.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Ketu", page: 226,
    en: "Deficiency of happiness from mother, bears separation from motherland and birthplace, feces obstacles in buildings and residential places, gains courage through secret policies",
    ta: "தாயிடமிருந்து மகிழ்ச்சி குறைவு; தாய்நாடு, பிறந்த ஊரிலிருந்து பிரிவு; வீடுகளிலும் வசிப்பிடங்களிலும் தடைகள்; மறைமுக கொள்கைகளால் தைரியம் பெறுவார்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Sun", page: 231,
    en: "Enjoys some happiness from the house of wife, also from the house of occupation, pays attention to work regularly for progress",
    ta: "மனைவி வீட்டில் சில மகிழ்ச்சி; தொழில் வீட்டிலிருந்தும் சில மகிழ்ச்சி; முன்னேற்றத்துக்காக வேலையை ஒழுங்காகக் கவனிப்பார்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Moon", page: 234,
    en: "Does not care for the enemies side, gets hindrance in peace and happiness, distress in the house of mother, some influence in the house of land, some weakness in business relations with government, is very careless",
    ta: "எதிரிகளைப் பொருட்படுத்தார்; மகிழ்ச்சியிலும் அமைதியிலும் தடை; தாய் வகையில் துன்பம்; நிலம் வீட்டில் சில செல்வாக்கு; அரசுடன் தொழில் உறவில் சிறு பலவீனம்; மிகவும் அசட்டையானவர்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Mars", page: 236,
    en: "Gets supporting power from father, acquires the usual happiness of mother and brother with some deficiency, gets great honour from the government and society, owns building and property, keeps influence in the side of wife, secures a good income through his deeds, and is very influential",
    ta: "தந்தையின் ஆதரவு; தாயும் சகோதரரும் வழக்கமான மகிழ்ச்சியுடன், சிறு குறையுடன்; அரசு, சமூகத்தில் பெரும் மரியாதை; கட்டிடமும் சொத்தும்; மனைவி பக்கம் செல்வாக்கு; தன் செயல்களால் நல்ல வருமானம்; மிகுந்த செல்வாக்குள்ளவர்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Mercury", page: 238,
    en: "Gets increased longevity, spends the period of life intelligently and comfortably, faces uneasiness in the house of mother, has some deficiency in children, gets some loss in the buildings and lands",
    ta: "நீண்ட ஆயுள்; வாழ்நாளை அறிவாகவும் வசதியாகவும் கழிப்பார்; தாய் வகையில் அமைதியின்மை; பிள்ளைகளில் சில குறை; கட்டிடங்கள், நிலங்களில் சில இழப்பு.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Jupiter", page: 240,
    en: "Accumulates wealth, enjoys the daily routine of life, tries to curtail expenditure very much, acquires gains and respect from government and society, gets happiness on account of wealth, gains buildings and property",
    ta: "செல்வம் சேர்ப்பார்; தினசரி வாழ்வை அனுபவிப்பார்; செலவைப் பெரிதும் குறைக்க முயல்வார்; அரசு, சமூகத்தில் ஆதாயமும் மரியாதையும்; செல்வ வகையில் மகிழ்ச்சி; கட்டிடமும் சொத்தும் கிடைக்கும்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Venus", page: 242,
    en: "Rears religious formalities, gets land and buildings, gets power from mother, gets happiness through destiny, pursues business, gains advantage from father, gets honour and prestige, gets happiness in government and society",
    ta: "இறைச் சடங்குகளைப் பின்பற்றுவார்; நிலமும் கட்டிடமும்; தாயின் வலிமை; விதியால் மகிழ்ச்சி; தொழில் நடத்துவார்; தந்தையின் ஆதாயம்; கௌரவமும் மதிப்பும்; அரசு, சமூகத்தில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Saturn", page: 244,
    en: "Is very influential, possesses the spiritual knowledge and a handsome physique, enjoys physical luxury, bears loss in mother's side but gets support from other ladies, has weakness in happiness, has deficiency in the land and buildings, maintains great influence over the enemies, safeguards self-pride, worries on account of excessive expenditure",
    ta: "மிகுந்த செல்வாக்குள்ளவர்; ஆன்மிக அறிவும் அழகான உடலும்; உடல் இன்பம் அனுபவிப்பார்; தாய் வகையில் இழப்பு, ஆனால் பிற பெண்களின் ஆதரவு; மகிழ்ச்சியில் பலவீனம்; நிலமும் கட்டிடங்களும் குறை; எதிரிகள் மீது பெரும் செல்வாக்கு; தன்மானத்தைக் காப்பார்; அதிகச் செலவால் கவலை.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Rahu", page: 246,
    en: "Bears some loss and separation in mother's house, has deficiency in happiness, uses secret tactics to get permanent happiness, has some weakness in the management of land and buildings",
    ta: "தாயின் வீட்டில் சில இழப்பும் பிரிவும்; மகிழ்ச்சியில் குறை; நிரந்தர மகிழ்ச்சிக்காக ரகசிய வழிகள்; நிலம், கட்டிட நிர்வாகத்தில் சில பலவீனம்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Ketu", page: 248,
    en: "Bears some loss in mother's house, gets weakness in lands and buildings, feels complexity in acquiring happiness, works patiently in the troubles",
    ta: "தாய் வீட்டில் சில இழப்பு; நிலம், கட்டிடங்களில் பலவீனம்; மகிழ்ச்சியைப் பெறுவதில் சிக்கல்; தொல்லைகளில் பொறுமையாக வேலை செய்வார்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Sun", page: 253,
    en: "Faces some distress in the house of parents, faces loss in lands, buildings and residential places, faces some deficiency in happiness, gets inspect and honour in society, does violent deeds, and is influential",
    ta: "தந்தை வீட்டில் சில துன்பம்; நிலம், கட்டிடம், வசிப்பிடங்களில் இழப்பு; மகிழ்ச்சியில் சில குறை; சமூகத்தில் மரியாதையும் கௌரவமும்; வன்முறைச் செயல்கள்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Moon", page: 255,
    en: "Gets the happiness of children, gets good education, gets the happiness from mother, gets the pleasure of land, buildings and property, maintains a decent contact with father, experiences a rise of honour in government and society, gets progress in business",
    ta: "குழந்தைகளின் மகிழ்ச்சி; நல்ல கல்வி; தாயால் மகிழ்ச்சி; நிலம், கட்டிடம், சொத்தின் இன்பம்; தந்தையுடன் நல்ல உறவு; அரசு, சமூகத்தில் மரியாதை உயர்வு; தொழிலில் முன்னேற்றம்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Mars", page: 257,
    en: "Owns buildings and property, accumulates wealth, gets heavy income, fulfils religious formalities, gets cooperation from mother, gets good luck from wife's house, gets success in business occupation, and is very fortunate",
    ta: "கட்டிடமும் சொத்தும்; செல்வ சேர்க்கை; அதிக வருமானம்; மத கடமைகளை நிறைவேற்றுவார்; தாயின் ஒத்துழைப்பு; மனைவி வீட்டில் நல்ல அதிர்ஷ்டம்; தொழிலில் வெற்றி; மிக அதிர்ஷ்டசாலி.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Mercury", page: 259,
    en: "Gains strength from lands and buildings, gets unprecedented happiness of the family, achieves great happiness from mother, gains strength in occupation, gets advantage from government and society",
    ta: "நிலம், கட்டிடங்களின் வலிமை; குடும்பத்தில் அளவற்ற மகிழ்ச்சி; தாயால் பெரும் மகிழ்ச்சி; தொழிலில் வலிமை; அரசு, சமூகத்தில் ஆதாயம்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Jupiter", page: 261,
    en: "Lives comfortably, possesses the strength of land and buildings, holds great influence in family, gets happiness of parents, pursues the occupation happily through his will-power, lives enjoying authority and sovereignty, gets a long age, gets some enmity in the house of expenditure",
    ta: "வசதியாக வாழ்வார்; நிலம், கட்டிடங்களின் வலிமை; குடும்பத்தில் பெரும் செல்வாக்கு; பெற்றோரின் மகிழ்ச்சி; தன் மனவலிமையால் தொழிலில் மகிழ்ச்சி; அதிகாரமும் இறையாண்மையும் அனுபவிப்பார்; நீண்ட வயது; செலவு வீட்டில் சில பகை.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Venus", page: 264,
    en: "Bears some loss in the house of mother, gets some happiness from brothers and sisters, gets a long life, gets the pleasure of daily routine of life, faces difficulties in finding happiness, remains unhappy with father, gets some happiness in foreign countries also, is very clever and honourable",
    ta: "தாய் வகையில் சில இழப்பு; சகோதர சகோதரியால் சில மகிழ்ச்சி; நல்ல ஆயுள்; தினசரி வாழ்வில் இன்பம்; மகிழ்ச்சி கண்டறிவதில் சிரமம்; தந்தை வகையில் அதிருப்தி; வெளிநாட்டிலும் சில மகிழ்ச்சி; மிகுந்த அறிவும் மரியாதையும்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Saturn", page: 266,
    en: "Gets both losses and gains, balances the expenditure, has some weakness in residence, holds influence in the enemies' house, bears loss of land, and is courageous",
    ta: "இழப்பும் ஆதாயமும் இரண்டும்; செலவைச் சமநிலைப்படுத்துவார்; வசிப்பிடத்தில் சில பலவீனம்; பகைவர் வீட்டில் செல்வாக்கு; நிலத்தில் இழப்பு; தைரியசாலி.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Rahu", page: 268,
    en: "Faces calamities to get happiness, owns buildings, experiences vanity in the house of mother, gets hindrance in the real place",
    ta: "மகிழ்ச்சிக்காக துன்பங்களைச் சந்திப்பார்; கட்டிடங்களுக்கு உரிமையாளர்; தாய் வீட்டில் அகங்காரம்; உண்மையான வீட்டில் தடை.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Ketu", page: 270,
    en: "Bears the loss of mother and separation from her, has severe deficiency in the place of happiness and home, lives in a small house, feels troubled by the neighbours and colleagues, gets the contact of low-class people, bears loss of buildings and property, uses secret powers to get happiness",
    ta: "தாயை இழந்து பிரிவார்; மகிழ்ச்சியிலும் வீட்டிலும் பெரும் குறை; சிறு வீட்டில் வாழ்வார்; அண்டை வீட்டாராலும் சகாக்களாலும் தொல்லை; கீழ்நிலை மனிதர்களின் தொடர்பு; கட்டிடங்கள், சொத்தின் இழப்பு; மறைந்த சக்திகளால் மகிழ்ச்சி பெற முயல்வார்.",
  },
  {
    house: 5, lagna: "Aries", planetSign: "Leo", planet: "Sun", page: 21,
    en: "Acquires good education, good speaker, intellectual, farsighted, influence from the side of children, shortage of income, feels superior with regard to others",
    ta: "நல்ல கல்வி; நல்ல பேச்சாளர்; அறிவாளி; தூரநோக்குடையவர்; குழந்தைகள் வழியில் செல்வாக்கு; வருமானக் குறை; மற்றவர்களைவிட தன்னை உயர்வாக நினைப்பார்.",
  },
  {
    house: 5, lagna: "Aries", planetSign: "Leo", planet: "Moon", page: 23,
    en: "Feels he is intelligent, happiness from children, acquires wealth, good speaker and does not hurt others, deep thinking and devoted to mother",
    ta: "தான் அறிவாளி என்ற உணர்வு; குழந்தைகளால் மகிழ்ச்சி; செல்வம் சேர்ப்பார்; நல்ல பேச்சாளர், பிறரை புண்படுத்தாதவர்; ஆழ்ந்த சிந்தனை; தாய்மீது பக்தி.",
  },
  {
    house: 5, lagna: "Aries", planetSign: "Leo", planet: "Mars", page: 25,
    en: "Wise and rash in approach, not happy with children, spends heavily, ambitious",
    ta: "விவேகமும் அவசரமும் உள்ள அணுகுமுறை; குழந்தைகளுடன் மகிழ்ச்சி குறைவு; அதிகம் செலவழிப்பார்; லட்சியமானவர்.",
  },
  {
    house: 5, lagna: "Aries", planetSign: "Leo", planet: "Mercury", page: 27,
    en: "Very careful and judicious, clever, happy with children, conquers enemies, earns good wealth",
    ta: "மிகவும் கவனமும் நிதானமும்; சாமர்த்தியம்; குழந்தைகளால் மகிழ்ச்சி; எதிரிகளை வெல்வார்; நல்ல செல்வம் ஈட்டுவார்.",
  },
  {
    house: 5, lagna: "Aries", planetSign: "Leo", planet: "Jupiter", page: 29,
    en: "Fortunate, intelligent and gets good education, has command over dharmashastra, good orator, happiness through children, gets honour",
    ta: "அதிர்ஷ்டசாலி, அறிவாளி, நல்ல கல்வி; தர்மசாஸ்திரத்தில் தேர்ச்சி; நல்ல பேச்சாளர்; குழந்தைகளால் மகிழ்ச்சி; மரியாதை.",
  },
  {
    house: 5, lagna: "Aries", planetSign: "Leo", planet: "Venus", page: 31,
    en: "Has good occupation, earns wealth, not much happiness from family and wife, indulges in sexual thoughts, mentally worried, tired with children, good conversationalist and educated",
    ta: "நல்ல தொழில்; செல்வம் ஈட்டுவார்; மனைவி, குடும்பத்தால் மகிழ்ச்சி குறைவு; பாலியல் எண்ணங்களில் ஈடுபாடு; மனக் கவலை; குழந்தைகளால் களைப்பு; நல்ல பேச்சாளர், கல்வியறிவு உள்ளவர்.",
  },
  {
    house: 5, lagna: "Aries", planetSign: "Leo", planet: "Saturn", page: 33,
    en: "Not much happiness from father, gains through education and intellect, works hard to progress in the occupation, works with joy to gain sexual pleasures, gives importance to wife, works hard for social activities, not happy with children",
    ta: "தந்தையால் மகிழ்ச்சி குறைவு; கல்வியும் அறிவும் மூலம் ஆதாயம்; தொழிலில் முன்னேற்றத்துக்காக கடுமையாக உழைப்பார்; பாலியல் இன்பத்தை மகிழ்ச்சியுடன் நாடுவார்; மனைவிக்கு முக்கியத்துவம்; சமூகப் பணிகளுக்குக் கடுமையாக உழைப்பார்; குழந்தைகளால் அதிருப்தி.",
  },
  {
    house: 5, lagna: "Aries", planetSign: "Leo", planet: "Rahu", page: 35,
    en: "Does not get good education, unhappy with children, is mentally worried, peevish and with harsh speech, cannot understand others",
    ta: "நல்ல கல்வி இல்லை; குழந்தைகளால் அதிருப்தி; மனக் கவலை; முரட்டுப் பேச்சும் கோபமும்; மற்றவர்களைப் புரிந்துகொள்ள முடியாது.",
  },
  {
    house: 5, lagna: "Aries", planetSign: "Leo", planet: "Ketu", page: 37,
    en: "Unhappy with children, deficient in education, unable to make others understand his ideas and words, is secretive",
    ta: "குழந்தைகளால் அதிருப்தி; கல்வியில் குறை; தன் கருத்துகளையும் சொற்களையும் மற்றவர்களுக்குப் புரியவைக்க முடியாது; ரகசியமானவர்.",
  },
  {
    house: 5, lagna: "Taurus", planetSign: "Virgo", planet: "Sun", page: 42,
    en: "Gets education and wisdom, happiness through children, is intelligent",
    ta: "கல்வியும் ஞானமும்; குழந்தைகளால் மகிழ்ச்சி; அறிவாளி.",
  },
  {
    house: 5, lagna: "Taurus", planetSign: "Virgo", planet: "Moon", page: 44,
    en: "Gets good education, help from brothers and sisters and children, a good conversationalist",
    ta: "நல்ல கல்வி; உடன்பிறப்புகள், குழந்தைகளின் உதவி; நல்ல பேச்சாளர்.",
  },
  {
    house: 5, lagna: "Taurus", planetSign: "Virgo", planet: "Mars", page: 46,
    en: "Spends too much, slightly weak in education, loss of children, makes others work hard, anxious about worldly affairs and sexual pleasures",
    ta: "அதிகம் செலவழிப்பார்; கல்வியில் சிறு பலவீனம்; குழந்தைகள் வகையில் இழப்பு; பிறரைக் கடுமையாக வேலை வாங்குவார்; உலக விவகாரங்களிலும் பாலியல் இன்பத்திலும் கவலை.",
  },
  {
    house: 5, lagna: "Taurus", planetSign: "Virgo", planet: "Mercury", page: 48,
    en: "Acquires good education and gets good wealth, clever and discriminate, happiness from children",
    ta: "நல்ல கல்வி, நல்ல செல்வம்; திறமையும் பகுத்தறிவும்; குழந்தைகளால் மகிழ்ச்சி.",
  },
  {
    house: 5, lagna: "Taurus", planetSign: "Virgo", planet: "Jupiter", page: 50,
    en: "Some deficiency in the house of education, works hard for gains, occult powers during conversation",
    ta: "கல்வியில் சில குறை; ஆதாயத்துக்காக கடினமாக உழைப்பார்; பேச்சின்போது மறை ஆற்றல்.",
  },
  {
    house: 5, lagna: "Taurus", planetSign: "Virgo", planet: "Venus", page: 52,
    en: "Troubles on the part of children, weak in education, has worries, feels some worry in the house of enemies, weakness in the body, unable to make his ideas understood to others due to nervous- mindedness",
    ta: "குழந்தைகள் வகையில் தொல்லை; கல்வியில் பலவீனம்; கவலைகள்; எதிரிகள் வீட்டில் சிறு கவலை; உடலில் பலவீனம்; நரம்புத் தளர்ச்சியால் தன் கருத்துகளை மற்றவர்களுக்குப் புரியவைக்க முடியாது.",
  },
  {
    house: 5, lagna: "Taurus", planetSign: "Virgo", planet: "Saturn", page: 54,
    en: "Gets gain from the house of father, gets gains and honour by wisdom and education, gets the knowledge of religious duties and education, some progress with regard to children, some dissatisfaction in the house of wife, progress with some labour in the daily occupation, works hard for gains, gets wealth",
    ta: "தந்தை வீட்டிலிருந்து ஆதாயம்; அறிவாலும் கல்வியாலும் ஆதாயமும் மரியாதையும்; மதக் கடமைகளையும் கல்வியையும் அறிவார்; குழந்தைகள் வகையில் சில முன்னேற்றம்; மனைவி வகையில் சில அதிருப்தி; தினசரி தொழிலில் சில உழைப்புடன் முன்னேற்றம்; செல்வம் ஈட்ட கடினமாக உழைப்பார்; செல்வம் பெறுவார்.",
  },
  {
    house: 5, lagna: "Taurus", planetSign: "Virgo", planet: "Rahu", page: 56,
    en: "Loss in education and loss of children, secretly clever",
    ta: "கல்வியில் இழப்பு; குழந்தைகள் இழப்பு; ரகசியமாக சாமர்த்தியம்.",
  },
  {
    house: 5, lagna: "Taurus", planetSign: "Virgo", planet: "Ketu", page: 58,
    en: "Great difficulty in studies and deficiency in education, feels some weakness in talking to others, loss in children, not bothered about hindrances and falsehood and works secretly",
    ta: "படிப்பில் பெரும் சிரமமும் கல்வியில் குறையும்; பேசுவதில் சில பலவீனம்; குழந்தைகளில் இழப்பு; தடைகளையும் பொய்யையும் பொருட்படுத்தாமல் ரகசியமாக வேலை செய்வார்.",
  },
  {
    house: 5, lagna: "Gemini", planetSign: "Libra", planet: "Moon", page: 64,
    en: "Gets education, progress in the side of children, makes efforts to gain wealth and is very clever",
    ta: "கல்வி பெறுவார்; குழந்தைகள் வழியில் முன்னேற்றம்; செல்வம் ஈட்ட முயல்வார்; மிகுந்த சாமர்த்தியம்.",
  },
  {
    house: 5, lagna: "Gemini", planetSign: "Libra", planet: "Mars", page: 66,
    en: "Gets income by labour of the intellect and education, defeats the enemy, faces obstacles from sons and daughters, some anxieties",
    ta: "அறிவாலும் கல்வியாலும் வருமானம்; எதிரியை வெல்வார்; மகன், மகள் வழியில் தடைகள்; சில கவலைகள்.",
  },
  {
    house: 5, lagna: "Gemini", planetSign: "Libra", planet: "Mercury", page: 68,
    en: "Gets deep educational intellect, gets happiness of children, gets support from the mother, wants peace and is worried in mind, ignores the children",
    ta: "ஆழ்ந்த கல்வி அறிவு; குழந்தைகளின் மகிழ்ச்சி; தாயின் ஆதரவு; அமைதியை விரும்புவார், மனத்தில் கவலை; குழந்தைகளைக் கவனிக்க மாட்டார்.",
  },
  {
    house: 5, lagna: "Gemini", planetSign: "Libra", planet: "Jupiter", page: 70,
    en: "Gets much education, has great skill and cleverness, gets the happiness of children, knowledge of business occupation on the house of business and the dignity of wife and sexual pleasures, honour from government and society, gets good luck",
    ta: "மிகுந்த கல்வி; பெரும் திறமையும் சாமர்த்தியமும்; குழந்தைகளின் மகிழ்ச்சி; வணிகத் தொழிலில் அறிவு; மனைவி, பாலியல் இன்பத்தில் கௌரவம்; அரசு, சமூகத்தில் மரியாதை; நல்ல அதிர்ஷ்டம்.",
  },
  {
    house: 5, lagna: "Gemini", planetSign: "Libra", planet: "Venus", page: 72,
    en: "Good education, unhappy with children, gains in expenditure",
    ta: "நல்ல கல்வி; குழந்தைகளால் அதிருப்தி; செலவில் ஆதாயம்.",
  },
  {
    house: 5, lagna: "Gemini", planetSign: "Libra", planet: "Saturn", page: 74,
    en: "Has great wisdom, gets the strength of children, acquires education, deficiency in the house of income, restless in the house of wife",
    ta: "மிகுந்த அறிவு; குழந்தைகளின் வலிமை; கல்வி; வருமானத்தில் குறை; மனைவி வீட்டில் அமைதியின்மை.",
  },
  {
    house: 5, lagna: "Gemini", planetSign: "Libra", planet: "Rahu", page: 76,
    en: "Deficiency in wisdom, deficiency in the house of education, some loss and worries in the side of children",
    ta: "அறிவில் குறை; கல்வியில் குறை; குழந்தைகள் வகையில் சில இழப்பும் கவலையும்.",
  },
  {
    house: 5, lagna: "Gemini", planetSign: "Libra", planet: "Ketu", page: 78,
    en: "Difficulties in acquiring education, bears some mental worries, some losses on the part of children, unable to make others understand the ideas, speaks somewhat bitterly, full of selfish intellect and lacks gentleness",
    ta: "கல்வி பெறுவதில் சிரமம்; மனக் கவலை; குழந்தைகள் வகையில் சில இழப்பு; மற்றவர்களுக்குத் தன் கருத்துகளைப் புரியவைக்க முடியாது; சற்று கடுமையாகப் பேசுவார்; சுயநல அறிவு நிறைந்தவர்; மென்மை இல்லாதவர்.",
  },
  {
    house: 5, lagna: "Cancer", planetSign: "Scorpio", planet: "Sun", page: 83,
    en: "Is very wise and earns wealth, gains enormously, becomes the father of a big family, is very farsighted, bondage in the side of children, influences in the house of education, uses his brain to perform heavy tasks and is of hot temper",
    ta: "மிகுந்த அறிவாளி, செல்வம் ஈட்டுவார்; பெரும் ஆதாயம்; பெரிய குடும்பத்தின் தந்தை; மிகுந்த தூரநோக்கு; குழந்தைகள் வகையில் கட்டுப்பாடு; கல்வியில் செல்வாக்கு; கடின வேலைகளுக்கு மூளையைப் பயன்படுத்துவார்; சூடான மனநிலை.",
  },
  {
    house: 5, lagna: "Cancer", planetSign: "Scorpio", planet: "Moon", page: 85,
    en: "Weak in education and intellect, experiences some hardships in the side of children, gets restless, is of narrow outlook, unable to make himself clear through his expression and speech, gains from telling lies, is of short stature",
    ta: "கல்வியிலும் அறிவிலும் பலவீனம்; குழந்தைகள் வகையில் சில துன்பம்; அமைதியின்மை; குறுகிய பார்வை; பேச்சில் தன்னைத் தெளிவாக வெளிப்படுத்த முடியாது; பொய் சொல்லி ஆதாயம்; குட்டையான உயரம்.",
  },
  {
    house: 5, lagna: "Cancer", planetSign: "Scorpio", planet: "Mars", page: 87,
    en: "Has the special knowledge of political science, mentally overjoyed due to son, spends more than securing gains, talks importantly, respectable businessman",
    ta: "அரசியல் அறிவில் சிறப்பு; மகனால் மனமகிழ்ச்சி; ஆதாயம் பெறுவதைவிட அதிகம் செலவழிப்பார்; முக்கியமாகப் பேசுவார்; மதிப்புக்குரிய வணிகர்.",
  },
  {
    house: 5, lagna: "Cancer", planetSign: "Scorpio", planet: "Mercury", page: 89,
    en: "Power in the house of education and intelligence, spends for education, some deficiency in the house of children and brothers and sisters, is very clever and wise, tries to win over people to his side",
    ta: "கல்வியிலும் அறிவிலும் செல்வாக்கு; கல்விக்காகச் செலவழிப்பார்; குழந்தைகள், உடன்பிறப்புகள் வகையில் சில குறை; மிகவும் சாமர்த்தியமும் ஞானமும்; மக்களை தன் பக்கம் வெல்ல முயல்வார்.",
  },
  {
    house: 5, lagna: "Cancer", planetSign: "Scorpio", planet: "Jupiter", page: 91,
    en: "Is very wise and virtuous, pays much attention to the religious side., has more knowledge of astrology, gets good luck, gets victory over the house of enemies, gives priority to truth, some enmity from the side of children, is a politician",
    ta: "மிகுந்த ஞானமும் நல்லொழுக்கமும்; மத விஷயங்களில் அதிக கவனம்; ஜோதிட அறிவு மிகுதி; நல்ல அதிர்ஷ்டம்; எதிரிகள் வீட்டில் வெற்றி; உண்மைக்கு முன்னுரிமை; குழந்தைகள் வகையில் சில பகை; அரசியல்வாதி.",
  },
  {
    house: 5, lagna: "Cancer", planetSign: "Scorpio", planet: "Venus", page: 93,
    en: "Possesses great intelligence, gains much from wisdom, enjoys the happiness of children, has property, respectable and honourable, acquires education, is very clever and peaceful",
    ta: "பெரும் அறிவு; ஞானத்தால் பெரும் ஆதாயம்; குழந்தைகளின் மகிழ்ச்சி; சொத்து; மரியாதைக்குரியவர், கௌரவமானவர்; கல்வி; மிகுந்த சாமர்த்தியம், அமைதி.",
  },
  {
    house: 5, lagna: "Cancer", planetSign: "Scorpio", planet: "Saturn", page: 95,
    en: "Mental perplexity on account of occupation, children, wife, acquires happiness in connection with wife and sexual pleasures, always careful, speaks somewhat bitterly and is very industrious",
    ta: "தொழில், குழந்தைகள், மனைவி பற்றிய மனக் குழப்பம்; மனைவி, பாலியல் இன்பத்தில் மகிழ்ச்சி; எப்போதும் கவனமாக இருப்பார்; சில நேரம் கடுமையாகப் பேசுவார்; மிகவும் கடின உழைப்பாளி.",
  },
  {
    house: 5, lagna: "Cancer", planetSign: "Scorpio", planet: "Rahu", page: 97,
    en: "Great hardships and losses in the house of children, gets success in the house of education, brave",
    ta: "குழந்தைகள் வீட்டில் பெரும் துன்பமும் இழப்பும்; கல்வி வீட்டில் வெற்றி; தைரியசாலி.",
  },
  {
    house: 5, lagna: "Cancer", planetSign: "Scorpio", planet: "Ketu", page: 99,
    en: "Loss and problems with children, great hardship in the house of education, harsh speech and words, mental anxiety",
    ta: "குழந்தைகளால் இழப்பும் தொல்லையும்; கல்வியில் பெரும் சிரமம்; கடுமையான பேச்சும் சொற்களும்; மனக் கவலை.",
  },
  {
    house: 5, lagna: "Leo", planetSign: "Sagittarius", planet: "Sun", page: 104,
    en: "Special power in the house of education, gets great respect, is learned and influential, great dignity in the house of children",
    ta: "கல்வியில் சிறப்பு ஆற்றல்; பெரும் மரியாதை; கற்றவர், செல்வாக்குள்ளவர்; குழந்தைகள் வீட்டில் பெரும் கௌரவம்.",
  },
  {
    house: 5, lagna: "Leo", planetSign: "Sagittarius", planet: "Moon", page: 106,
    en: "Gets knowledge and wisdom, manages the expenditure, loss and weakness in the side of children and loss of education",
    ta: "ஞானமும் அறிவும்; செலவை நிர்வகிப்பார்; குழந்தைகள் வகையில் இழப்பும் பலவீனமும்; கல்வியில் இழப்பு.",
  },
  {
    house: 5, lagna: "Leo", planetSign: "Sagittarius", planet: "Mars", page: 108,
    en: "Acquires education happily, gets happiness of children, some deficiency in the house of expenditure, has knowledge of secret service and science",
    ta: "மகிழ்ச்சியாகக் கல்வி பெறுவார்; குழந்தைகளின் மகிழ்ச்சி; செலவு வீட்டில் சிறு குறை; ரகசிய சேவை, அறிவியல் அறிவு உண்டு.",
  },
  {
    house: 5, lagna: "Leo", planetSign: "Sagittarius", planet: "Mercury", page: 110,
    en: "Acquires education and possesses great art in his intellect, earns much money, gets the great advantage of children, draws very valuable plans, gets respect and honour, serves his purpose with politeness, and is very clever",
    ta: "கல்வியும் அறிவில் பெரும் கலைத்திறனும்; பெரும் செல்வம்; குழந்தைகளால் பெரும் ஆதாயம்; மிகவும் மதிப்புமிக்க திட்டங்களை வரைவார்; மரியாதையும் கௌரவமும்; பணிவுடன் காரியம் சாதிப்பார்; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 5, lagna: "Leo", planetSign: "Sagittarius", planet: "Jupiter", page: 112,
    en: "Gets the happiness of children and getting education, supposed to be somewhat fortunate, gets honour for body, spends the life joyfully and always talks intricately in traditional manner",
    ta: "குழந்தைகளின் மகிழ்ச்சியும் கல்வியும்; ஓரளவு அதிர்ஷ்டசாலி; உடல் வகையில் மரியாதை; மகிழ்ச்சியாக வாழ்வார்; பாரம்பரிய முறையில் நுணுக்கமாகப் பேசுவார்.",
  },
  {
    house: 5, lagna: "Leo", planetSign: "Sagittarius", planet: "Venus", page: 114,
    en: "Gets grandeur in the house of education, gets the power of children and progress of father, brothers and sisters, gets the advantage and respect from government and society, is very tactful",
    ta: "கல்வி வீட்டில் கம்பீரம்; குழந்தைகளின் ஆற்றலும் தந்தை, உடன்பிறப்புகளின் முன்னேற்றமும்; அரசு, சமூகத்தில் ஆதாயமும் மரியாதையும்; மிகவும் தந்திரமானவர்.",
  },
  {
    house: 5, lagna: "Leo", planetSign: "Sagittarius", planet: "Saturn", page: 116,
    en: "Pursues the everyday occupation very diligently through his intelligence, gets power of sexual enjoyments, chalks out great schemes of sexual pleasures in the mind, dullness in the side of children, hidden policies in the house of education and wisdom, mentally worried, very skilful, and influences the enemy",
    ta: "தன் அறிவால் தினசரி தொழிலை மிகக் கடுமையாகச் செய்வார்; பாலியல் இன்பத்தின் ஆற்றல்; மனத்தில் பாலியல் இன்பத்துக்கான பெரும் திட்டங்கள்; குழந்தைகள் வகையில் மந்தம்; கல்வியிலும் அறிவிலும் மறைமுக வழிகள்; மனக் கவலை; மிகத் திறமையானவர்; எதிரிகளைப் பாதிப்பார்.",
  },
  {
    house: 5, lagna: "Leo", planetSign: "Sagittarius", planet: "Rahu", page: 118,
    en: "Gets his work done through power of great falsehood, bears great distress in the house of children, gets weakness in the house of acquiring education, is mentally perplexed, finds great hardship to express his views properly and in appropriate words, somewhat restless",
    ta: "மிகுந்த பொய்யால் காரியம் சாதிப்பார்; குழந்தைகள் வகையில் பெரும் துன்பம்; கல்வி பெறுவதில் பலவீனம்; மனக் குழப்பம்; தன் கருத்துகளை சரியான சொற்களில் வெளிப்படுத்துவது கடினம்; சில அமைதியின்மை.",
  },
  {
    house: 5, lagna: "Leo", planetSign: "Sagittarius", planet: "Ketu", page: 120,
    en: "Acquires education by hard intellectual labour, some distress on the side of children, feels some difficulty in explaining his real views or real opinion properly",
    ta: "கடின அறிவுழைப்பால் கல்வி பெறுவார்; குழந்தைகள் வகையில் சில துன்பம்; தன் உண்மையான கருத்தை சரியாக விளக்குவதில் சிரமம்.",
  },
  {
    house: 5, lagna: "Virgo", planetSign: "Capricorn", planet: "Sun", page: 125,
    en: "Is deficient in the house of education, feels troubles in respect of children, is mentally worried, some weakness in profits, is haughty, is unable to make his ideas properly understandable, and is clever",
    ta: "கல்வியில் குறை; குழந்தைகள் வகையில் சிரமம்; மனக் கவலை; ஆதாயத்தில் சில பலவீனம்; கர்வமானவர்; தன் கருத்துகளைப் புரியவைக்க முடியாது; சாமர்த்தியமானவர்.",
  },
  {
    house: 5, lagna: "Virgo", planetSign: "Capricorn", planet: "Moon", page: 127,
    en: "Gains due to his wisdom, gets children, gets education, gets the supremacy of mental ideas in intellect, gains from intellectual power and wisdom and is very sensible",
    ta: "தன் ஞானத்தால் ஆதாயம்; குழந்தைகள் பெறுவார்; கல்வி பெறுவார்; அறிவில் மனக் கருத்துகளில் மேலாண்மை; அறிவாற்றலாலும் ஞானத்தாலும் ஆதாயம்; மிகுந்த விவேகம்.",
  },
  {
    house: 5, lagna: "Virgo", planetSign: "Capricorn", planet: "Mars", page: 129,
    en: "Spends his life with grandeur, gets fame, is honourable and influential, uses diplomacy with wisdom, spends much, has an art in speech, experiences some strong mixture of happiness and unhappiness on the side of children, is haughty",
    ta: "பெருமையுடன் வாழ்வார்; புகழ்; மரியாதைக்குரியவர், செல்வாக்குள்ளவர்; ஞானத்துடன் தந்திரம்; அதிகம் செலவழிப்பார்; பேச்சில் ஒரு கலை; குழந்தைகள் வகையில் கலவையான மகிழ்ச்சியும் துன்பமும்; கர்வமானவர்.",
  },
  {
    house: 5, lagna: "Virgo", planetSign: "Capricorn", planet: "Mercury", page: 131,
    en: "Is very intelligent and highly educated gets the power of children, has self-pride and knows what is duty, lives in a beautiful and decorated manner, is self-conscious, understands the laws of government and society",
    ta: "மிக அறிவாளி, உயர் கல்வி; குழந்தைகளின் ஆற்றல்; சுயபெருமையும் கடமை அறிவும்; அழகாக அலங்கரிக்கப்பட்ட வாழ்க்கை; தன்னுணர்வுள்ளவர்; அரசு, சமூகச் சட்டங்களை அறிவார்.",
  },
  {
    house: 5, lagna: "Virgo", planetSign: "Capricorn", planet: "Jupiter", page: 133,
    en: "Feels unhappy in connection with the pleasures of the family, gets weakness and deficiency on all the side (from mother, wife, children), gets some worries in the daily occupation, gets some weakness in education and wisdom, hesitates a little while speaking, some hindrance in happiness and peace, has improper ideas about sexual pleasures and is distressed",
    ta: "குடும்ப இன்பங்களில் மகிழ்ச்சியின்மை; தாய், மனைவி, குழந்தைகள் ஆகிய அனைத்து வகையிலும் பலவீனமும் குறையும்; தினசரி தொழிலில் சில கவலைகள்; கல்வியிலும் ஞானத்திலும் சில பலவீனம்; பேசும்போது சற்று தயக்கம்.",
  },
  {
    house: 5, lagna: "Virgo", planetSign: "Capricorn", planet: "Venus", page: 136,
    en: "Is very clever and fortunate, undertakes the Dharma properly and is a good speaker on religious subjects, earns huge wealth, is a very learned artist, skilful lover of astrology and a politician, gets special power of children, enjoys the family pleasures, is respectable",
    ta: "மிகவும் அறிவாளியும் அதிர்ஷ்டசாலியும்; தர்மத்தைச் சரியாகக் கடைப்பிடிப்பார்; மத விஷயங்களில் நல்ல பேச்சாளர்; பெரும் செல்வம் ஈட்டுவார்; மிகக் கற்ற கலைஞர், ஜோதிட ஆர்வலர், அரசியல்வாதி; குழந்தைகள் வகையில் சிறப்பு ஆற்றல்; குடும்ப இன்பங்களை அனுபவிப்பார்; மரியாதைக்குரியவர்.",
  },
  {
    house: 5, lagna: "Virgo", planetSign: "Capricorn", planet: "Saturn", page: 138,
    en: "Is of sharp intelligence, progress in children with some hindrance, uses many policies in connection with wealth and occupation, wins the enemies, is not satisfied with one wife, bears some distress and toil on the side of daily occupation and wife",
    ta: "கூர்மையான அறிவு; குழந்தைகளின் முன்னேற்றத்தில் சில தடை; செல்வம், தொழில் பற்றி பல வழிகள்; எதிரிகளை வெல்வார்; ஒரு மனைவியில் திருப்தி இல்லாதவர்; தினசரி தொழிலிலும் மனைவி வகையிலும் சில துன்பம்.",
  },
  {
    house: 5, lagna: "Virgo", planetSign: "Capricorn", planet: "Rahu", page: 140,
    en: "Weakness in education, talks falsehood, uses hemp, tobacco and other stimulants, gets the work done with great anger and intuition, some distress of children",
    ta: "கல்வியில் பலவீனம்; பொய் பேசுவார்; கஞ்சா, புகையிலை போன்ற போதைப் பொருட்களைப் பயன்படுத்துவார்; பெரும் கோபத்தாலும் உள்ளுணர்வாலும் வேலையை முடிப்பார்; குழந்தைகள் வகையில் சில துன்பம்.",
  },
  {
    house: 5, lagna: "Virgo", planetSign: "Capricorn", planet: "Ketu", page: 142,
    en: "Gets many troubles during educational life, has harshness in mind, some distress in the house of children, is somewhat proud, is intellectually worried, sometimes does not obey modesty, and is a politician",
    ta: "கல்வி வாழ்வில் பல தொல்லைகள்; மனத்தில் கடுமை; குழந்தைகள் வீட்டில் சில துன்பம்; சற்று கர்வமானவர்; அறிவு ரீதியாகக் கவலை; சில நேரம் அடக்கத்துக்குக் கீழ்ப்படியாதவர்; அரசியல்வாதி.",
  },
  {
    house: 5, lagna: "Libra", planetSign: "Aquarius", planet: "Sun", page: 146,
    en: "Gains from education, gets the advantage from the house of children, feels some fatigue and selfishness in his mind due to acquiring wealth, is intelligent, speaks swiftly",
    ta: "கல்வியால் ஆதாயம்; குழந்தைகள் வீட்டில் ஆதாயம்; செல்வம் சேர்ப்பதால் மனத்தில் சோர்வும் சுயநலமும்; அறிவாளி; விரைவாகப் பேசுவார்.",
  },
  {
    house: 5, lagna: "Libra", planetSign: "Aquarius", planet: "Moon", page: 148,
    en: "Is educated, thinks of very high schemes in his mind for progress, has children, and progresses through them, has managerial duties",
    ta: "கற்றவர்; முன்னேற்றத்துக்கு மிக உயர்ந்த திட்டங்களை மனத்தில் வகுப்பார்; குழந்தைகளால் முன்னேறுவார்; நிர்வாகப் பொறுப்புகள் உண்டு.",
  },
  {
    house: 5, lagna: "Libra", planetSign: "Aquarius", planet: "Mars", page: 150,
    en: "Earns wealth, gets education, some opposition in the side of children, gets an intelligent wife, is selfish",
    ta: "செல்வம் ஈட்டுவார், கல்வி பெறுவார்; குழந்தைகள் வகையில் சில எதிர்ப்பு; அறிவாளி மனைவி; சுயநலம்.",
  },
  {
    house: 5, lagna: "Libra", planetSign: "Aquarius", planet: "Mercury", page: 152,
    en: "Has very deep and far reaching knowledge in connection with Dharma, secures rise though intellect and speech, happiness with some deficiency in the house of children, manages the expenditure wisely, is a good politician",
    ta: "தர்மம் பற்றிய மிக ஆழமான, தொலைநோக்குடைய அறிவு; அறிவாலும் பேச்சாலும் உயர்வு; குழந்தைகள் வீட்டில் சில குறையுடன் மகிழ்ச்சி; செலவை விவேகத்துடன் நிர்வகிப்பார்; நல்ல அரசியல்வாதி.",
  },
  {
    house: 5, lagna: "Libra", planetSign: "Aquarius", planet: "Jupiter", page: 154,
    en: "Gets strength from the power of intellect and children, feels some difficulties in getting the happiness of children, gets weakness while acquiring education, is of courageous disposition, has courageous children, is very clever, wise and skilful",
    ta: "அறிவின் வலிமையாலும் குழந்தைகளாலும் வலிமை; குழந்தைகளின் மகிழ்ச்சி பெறுவதில் சில சிரமம்; கல்வி பெறுவதில் பலவீனம்; தைரியமான இயல்பு; தைரியமான குழந்தைகள்; மிகுந்த சாமர்த்தியம், ஞானம், திறமை.",
  },
  {
    house: 5, lagna: "Libra", planetSign: "Aquarius", planet: "Venus", page: 156,
    en: "Gets the power of self-knowledge and possesses deep knowledge, gets some troublesome happiness in the house of children, has a long life, is very farsighted, is a politician and faces difficult problems",
    ta: "தன்னறிவும் ஆழ்ந்த அறிவும்; குழந்தைகள் வீட்டில் சில தொல்லையான மகிழ்ச்சி; நீண்ட ஆயுள்; மிகுந்த தூரநோக்கு; அரசியல்வாதி; கடினமான பிரச்சினைகளை எதிர்கொள்வார்.",
  },
  {
    house: 5, lagna: "Libra", planetSign: "Aquarius", planet: "Saturn", page: 158,
    en: "Gets education and is very intelligent, gets the happiness of children spontaneously, feels deficiency in the house of wife, gives sufferings through his speech, puts efforts to increase wealth, some deficiency in the house of wealth, some deficiency in the house of occupation and gains, happiness of mother",
    ta: "கல்வியும் மிகுந்த அறிவும்; குழந்தைகளின் மகிழ்ச்சி தானாக வரும்; மனைவி வீட்டில் குறை; பேச்சால் துன்பம்; செல்வம் பெருக்க முயற்சி; செல்வ வீட்டில் சில குறை; தொழில், ஆதாய வீட்டில் சில குறை; தாயின் மகிழ்ச்சி.",
  },
  {
    house: 5, lagna: "Libra", planetSign: "Aquarius", planet: "Rahu", page: 160,
    en: "Gets difficulties in getting education, some trouble in the side of children",
    ta: "கல்வி பெறுவதில் சிரமம்; குழந்தைகள் வகையில் சில தொல்லை.",
  },
  {
    house: 5, lagna: "Libra", planetSign: "Aquarius", planet: "Ketu", page: 162,
    en: "Faces great troubles to get education, gets distress in the side of children, has some anxieties in wisdom",
    ta: "கல்வி பெறுவதில் பெரும் சிரமம்; குழந்தைகள் வகையில் துன்பம்; அறிவில் சில கவலைகள்.",
  },
  {
    house: 5, lagna: "Scorpio", planetSign: "Pisces", planet: "Sun", page: 168,
    en: "Is very clever, possesses great knowledge about business, acquires and uses the education in practical and diplomatic ways, gets children, gains much from business, always engaged in his progress, always pays attention to his selfishness",
    ta: "மிகவும் சாமர்த்தியமானவர்; வணிக அறிவு மிகுதி; கல்வியை நடைமுறையிலும் ராஜதந்திரமாகவும் பயன்படுத்துவார்; குழந்தைகள் பெறுவார்; வணிகத்தில் பெரும் ஆதாயம்; தன் முன்னேற்றத்தில் எப்போதும் ஈடுபட்டிருப்பார்; சுயநலம் சார்ந்த கவனம்.",
  },
  {
    house: 5, lagna: "Scorpio", planetSign: "Pisces", planet: "Moon", page: 170,
    en: "Is very intelligent, educated, farsighted, is very fortunate from the side of children, speaks very sweetly and is virtuous",
    ta: "மிகுந்த அறிவு, கல்வி; தூரநோக்கு; குழந்தைகள் வழியில் மிக அதிர்ஷ்டம்; மிக இனிமையாகப் பேசுவார்; நல்லொழுக்கமுள்ளவர்.",
  },
  {
    house: 5, lagna: "Scorpio", planetSign: "Pisces", planet: "Mars", page: 172,
    en: "Is wise, clever, self-sighted and a diplomat of hot temperament, makes great efforts to get the income, spends much, faces opposition and worries in the side of son, some diseases in the body",
    ta: "ஞானமும் சாமர்த்தியமும்; தன்னைப் பார்ப்பவர்; சூடான மனநிலை கொண்ட ராஜதந்திரி; வருமானம் ஈட்ட பெரும் முயற்சி; அதிகம் செலவழிப்பார்; மகன் வகையில் எதிர்ப்பும் கவலையும்; உடலில் சில நோய்கள்.",
  },
  {
    house: 5, lagna: "Scorpio", planetSign: "Pisces", planet: "Mercury", page: 174,
    en: "Gets some weakness in intellect and education, possesses little education, some loss in the side of children, feels some weakness in age, finds some sufferings in his life, speaks bitterly and maintains secrecy",
    ta: "கல்வியிலும் அறிவிலும் சில பலவீனம்; சிறிதே கல்வி; குழந்தைகள் வகையில் சில இழப்பு; வயதில் சில பலவீனம்; வாழ்வில் சில துன்பம்; கசப்பாகப் பேசுவார்; ரகசியம் காப்பார்.",
  },
  {
    house: 5, lagna: "Scorpio", planetSign: "Pisces", planet: "Jupiter", page: 176,
    en: "Is very learned and educated, speaks with dignity, possesses authority and knowledge on religious and spiritual, gets children, gets heavy gains, gets rich through wisdom, possesses scientific knowledge, and is very fortunate",
    ta: "மிகவும் கற்றவர்; கம்பீரமாகப் பேசுவார்; ஆன்மிக, மத விஷயங்களில் அதிகாரமும் அறிவும்; குழந்தைகள் பெறுவார்; பெரும் ஆதாயம்; ஞானத்தால் செல்வம் பெறுவார்; அறிவியல் அறிவு; மிக அதிர்ஷ்டசாலி.",
  },
  {
    house: 5, lagna: "Scorpio", planetSign: "Pisces", planet: "Venus", page: 178,
    en: "Is very clever, educated, intelligent, spends much, some deficiency in income, has an influential wife, gets children, possesses a high degree of sexual instinct, gets some deficiency in the side of children, experiences some perplexity due to heavy expenditure, strives for occupation",
    ta: "மிகவும் சாமர்த்தியம், கல்வி, அறிவு; அதிகம் செலவழிப்பார்; வருமானத்தில் சில குறை; செல்வாக்குள்ள மனைவி; குழந்தைகள் பெறுவார்; மிக உயர்ந்த பாலியல் உணர்வு; குழந்தைகள் வகையில் சில குறை; அதிகச் செலவால் சில குழப்பம்; தொழிலுக்காக முயல்வார்.",
  },
  {
    house: 5, lagna: "Scorpio", planetSign: "Pisces", planet: "Saturn", page: 180,
    en: "Is of very sharp intellect, is highly educated, some insipidness from the side of children, acquires progress in occupation, has a special fascination for sexual pleasures",
    ta: "மிகக் கூர்மையான அறிவு; உயர்ந்த கல்வி; குழந்தைகள் வகையில் சில சுவையின்மை; தொழிலில் முன்னேற்றம்; பாலியல் இன்பத்தில் சிறப்பான ஈர்ப்பு.",
  },
  {
    house: 5, lagna: "Scorpio", planetSign: "Pisces", planet: "Rahu", page: 182,
    en: "Is very wise, puts forth his selfish ideas, does not care for truthfulness or falsehood, bears some trouble with children, deficiency in acquiring education, is not sweet in conversation, is careless, considers his views correct",
    ta: "மிகவும் ஞானமுள்ளவர்; தன் சுயநல எண்ணங்களை முன்வைப்பார்; உண்மை, பொய் பற்றிக் கவலைப்படாதவர்; குழந்தைகள் வகையில் சில தொல்லை; கல்வி பெறுவதில் குறை; இனிமையாகப் பேசாதவர்; அசட்டையானவர்; தன் கருத்தையே சரி என்று நினைப்பார்.",
  },
  {
    house: 5, lagna: "Scorpio", planetSign: "Pisces", planet: "Ketu", page: 184,
    en: "Is intellectually worried and gets weakness in education and gets many hurdles in studies, but works patiently to get education, distress in children's side, rude speech, is of obstinate nature",
    ta: "அறிவு ரீதியாகக் கவலைப்படுவார்; கல்வியில் பலவீனம்; படிப்பில் பல தடைகள், ஆனால் கல்வி பெற பொறுமையாக உழைப்பார்; குழந்தைகள் வகையில் துன்பம்; முரட்டுப் பேச்சு; பிடிவாத இயல்பு.",
  },
  {
    house: 5, lagna: "Sagittarius", planetSign: "Aries", planet: "Sun", page: 189,
    en: "Is very wise and learned, possesses knowledge about Dharma, gets good luck in the house of children, thinks weakness in the house of income, is farsighted, learned, clever and fortunate",
    ta: "மிகுந்த ஞானமும் கல்வியும்; தர்மம் பற்றிய அறிவு; குழந்தைகள் வீட்டில் நல்ல அதிர்ஷ்டம்; வருமானத்தில் சில பலவீனம்; தூரநோக்கு, கற்றவர், சாமர்த்தியம், அதிர்ஷ்டம்.",
  },
  {
    house: 5, lagna: "Sagittarius", planetSign: "Aries", planet: "Moon", page: 191,
    en: "Bears loss and distress in the house of children, faces troubles while acquiring education, spends the life with grandeur and dignity",
    ta: "குழந்தைகள் வகையில் இழப்பும் துன்பமும்; கல்வி பெறுவதில் சிரமம்; கம்பீரமாகவும் மரியாதையுடனும் வாழ்வார்.",
  },
  {
    house: 5, lagna: "Sagittarius", planetSign: "Aries", planet: "Mars", page: 193,
    en: "Spends much, bears agony of children, implicates others, gets little education, talks conceitedly",
    ta: "அதிகம் செலவழிப்பார்; குழந்தைகளின் வேதனை; பிறரை சிக்க வைப்பார்; சிறிது கல்வி; செருக்காகப் பேசுவார்.",
  },
  {
    house: 5, lagna: "Sagittarius", planetSign: "Aries", planet: "Mercury", page: 195,
    en: "Manages a big business, is very wise, gets children power, possesses a good knowledge of government and society, gains advantage from wife's side, desires sexual pleasures",
    ta: "பெரிய வணிகத்தை நடத்துவார்; மிகுந்த அறிவாளி; குழந்தைகளின் ஆற்றல்; அரசு, சமூக விவகாரங்களில் நல்ல அறிவு; மனைவி வீட்டில் ஆதாயம்; பாலியல் இன்பத்தை விரும்புவார்.",
  },
  {
    house: 5, lagna: "Sagittarius", planetSign: "Aries", planet: "Jupiter", page: 197,
    en: "Is very wise, self-conceited and dignified, gets a handsome physique, gets illustrious children and wisdom, possesses inner knowledge, is a diplomat, is very fortunate, and possesses property",
    ta: "மிகுந்த ஞானம், கர்வம், கம்பீரம்; அழகான உடல்; புகழ்பெற்ற குழந்தைகளும் ஞானமும்; உள் அறிவு; ராஜதந்திரி; மிக அதிர்ஷ்டசாலி; சொத்துடையவர்.",
  },
  {
    house: 5, lagna: "Sagittarius", planetSign: "Aries", planet: "Venus", page: 199,
    en: "Gains much due to intellectual cleverness, permanent means of acquiring wealth and income, cleverness in wisdom and education, some deficiency in children and defeats the enemies",
    ta: "அறிவுத் திறமையால் பெரும் ஆதாயம்; நிலையான செல்வ, வருமான வழிகள்; ஞானத்திலும் கல்வியிலும் சாமர்த்தியம்; குழந்தைகளில் சில குறை; எதிரிகளை வெல்வார்.",
  },
  {
    house: 5, lagna: "Sagittarius", planetSign: "Aries", planet: "Saturn", page: 201,
    en: "Gets increased wealth through his hard intellectual labour, anxieties about accumulation of wealth, speaks courtly due to increased wealth, deficiency in children's side, gets deficiency in education, improves the occupation, gets some special power in the wife's house, earns much",
    ta: "கடின அறிவுழைப்பால் செல்வம் பெருகும்; செல்வம் சேர்ப்பதில் கவலை; செல்வம் பெருகியதால் அரசவை போலப் பேசுவார்; குழந்தைகள் வகையில் குறை; கல்வியில் குறை; தொழிலை மேம்படுத்துவார்; மனைவி வீட்டில் சில சிறப்பு ஆற்றல்; மிகுந்த வருமானம்.",
  },
  {
    house: 5, lagna: "Sagittarius", planetSign: "Aries", planet: "Rahu", page: 203,
    en: "Gets deficiency in education and in children's side, uses bitterness and secrecy in the house of intellect, shows the truth but does not care for truth",
    ta: "கல்வியிலும் குழந்தைகள் வகையிலும் குறை; அறிவு வீட்டில் கசப்பும் ரகசியமும்; உண்மையைக் காட்டுவார், ஆனால் உண்மையைப் பொருட்படுத்தார்.",
  },
  {
    house: 5, lagna: "Sagittarius", planetSign: "Aries", planet: "Ketu", page: 205,
    en: "Bears intellectual worries, bears troubles in children, finds many difficulties in acquiring education, is unable to make others understand him, speaks somewhat bitterly, does not follow truth and modesty, is very selfish and obstinate",
    ta: "அறிவு ரீதியாகக் கவலை; குழந்தைகள் வகையில் துன்பம்; கல்வி பெறுவதில் பல சிரமங்கள்; பிறருக்குத் தன்னைப் புரியவைக்க முடியாது; சற்று கசப்பாகப் பேசுவார்; உண்மையையும் அடக்கத்தையும் பின்பற்றாதவர்; மிகவும் சுயநலமும் பிடிவாதமும் உள்ளவர்.",
  },
  {
    house: 5, lagna: "Capricorn", planetSign: "Taurus", planet: "Sun", page: 210,
    en: "Bears loss and distress in children's side, gets weakness in education, talks bitterly, uses numerous tactics to earn more wealth",
    ta: "குழந்தைகள் வகையில் இழப்பும் துன்பமும்; கல்வியில் பலவீனம்; கசப்பாகப் பேசுவார்; அதிக வருமானத்துக்கு பல தந்திரங்களைப் பயன்படுத்துவார்.",
  },
  {
    house: 5, lagna: "Capricorn", planetSign: "Taurus", planet: "Moon", page: 212,
    en: "Gets good knowledge in occupation, conducts the occupation in a determined way, gets a beautiful and wise wife, is very passionate, has some deficiency in the house of income, is skilful and passionate",
    ta: "தொழிலில் நல்ல அறிவு; தொழிலை உறுதியுடன் நடத்துவார்; அழகும் அறிவும் உள்ள மனைவி; மிகுந்த உணர்ச்சி; வருமான வீட்டில் சில குறை; திறமையும் உணர்ச்சியும்.",
  },
  {
    house: 5, lagna: "Capricorn", planetSign: "Taurus", planet: "Mars", page: 214,
    en: "Advantages through his intellect, gets education and children, always talks of profitable schemes",
    ta: "அறிவால் ஆதாயம்; கல்வியும் குழந்தைகளும் பெறுவார்; எப்போதும் லாபகரமான திட்டங்களைப் பேசுவார்.",
  },
  {
    house: 5, lagna: "Capricorn", planetSign: "Taurus", planet: "Mercury", page: 216,
    en: "Works very cleverly and intelligently, possess good knowledge of Dharma, gets very clever progeny, gets worldly education, acquires much wealth, gets influence over enemies",
    ta: "மிகச் சாமர்த்தியமாகவும் அறிவுடனும் வேலை செய்வார்; தர்ம அறிவு நிறைந்தவர்; மிகச் சாமர்த்தியமான சந்ததி; உலகக் கல்வி; மிகுந்த செல்வம்; எதிரிகள் மீது செல்வாக்கு.",
  },
  {
    house: 5, lagna: "Capricorn", planetSign: "Taurus", planet: "Jupiter", page: 218,
    en: "Manages the expenditure wisely, has deficiency in education, bears some loss in children's side, has deficiency in handsomeness of the body, feels restlessness, and is clever",
    ta: "செலவை விவேகத்துடன் நிர்வகிப்பார்; கல்வியில் குறை; குழந்தைகள் வகையில் சில இழப்பு; உடலின் அழகில் குறை; அமைதியின்மை; சாமர்த்தியமானவர்.",
  },
  {
    house: 5, lagna: "Capricorn", planetSign: "Taurus", planet: "Venus", page: 220,
    en: "Acquires knowledge on various things, gets more political knowledge, gets support from children, gains advantages from government and society, likes decoration, beauty and intoxication, and is witty",
    ta: "பல விஷயங்களில் அறிவு; அரசியல் அறிவு மிகுதி; குழந்தைகளின் ஆதரவு; அரசு, சமூகத்தில் ஆதாயம்; அலங்காரம், அழகு, போதை ஆகியவற்றை விரும்புவார்; நகைச்சுவை உணர்வு.",
  },
  {
    house: 5, lagna: "Capricorn", planetSign: "Taurus", planet: "Saturn", page: 222,
    en: "Is very handsome, wise, clever and learned, earns much wealth through his wisdom, faces some enmity in the house of wife, wants many sensual pleasures, pays attention to the progress of occupation and is a good manager",
    ta: "மிக அழகானவர், ஞானி, சாமர்த்தியமானவர், கற்றவர்; தன் அறிவால் மிகுந்த செல்வம் ஈட்டுவார்; மனைவி வீட்டில் சில பகை; பல பாலியல் இன்பங்களை விரும்புவார்; தொழில் முன்னேற்றத்தில் கவனம்; நல்ல நிர்வாகி.",
  },
  {
    house: 5, lagna: "Capricorn", planetSign: "Taurus", planet: "Rahu", page: 224,
    en: "Gets distress in children's side, gets deficiency in education, wants some intoxicants, shows clarity in conversation, does not care for truth or falsehood",
    ta: "குழந்தைகள் வகையில் துன்பம்; கல்வியில் குறை; சில போதைப் பொருட்களை விரும்புவார்; பேச்சில் தெளிவு; உண்மை, பொய் பற்றிக் கவலைப்படாதவர்.",
  },
  {
    house: 5, lagna: "Capricorn", planetSign: "Taurus", planet: "Ketu", page: 226,
    en: "Works with stable wisdom and inner knowledge, has difficulties in acquiring education, feces distress in the side of children, uses secret devices and does not care for truth and falsehood",
    ta: "உறுதியான அறிவும் உள் ஞானமும்; கல்வி பெறுவதில் சிரமங்கள்; குழந்தைகள் வகையில் துன்பம்; ரகசிய வழிகளைப் பயன்படுத்துவார்; உண்மை, பொய் பற்றிக் கவலைப்படாதவர்.",
  },
  {
    house: 5, lagna: "Aquarius", planetSign: "Gemini", planet: "Sun", page: 231,
    en: "Pursues business with power of intellect, gets a wise wife, gets influential and clever progeny, gets technical education, talks very influentially, secures intellectual advice from the wife, always careful in acquiring gains",
    ta: "அறிவாற்றலால் வணிகம் நடத்துவார்; ஞானமுள்ள மனைவி; செல்வாக்குள்ள, சாமர்த்தியமான குழந்தைகள்; தொழில் கல்வி பெறுவார்; மிகுந்த செல்வாக்குடன் பேசுவார்; மனைவியிடமிருந்து அறிவுரை; ஆதாயத்தில் எப்போதும் கவனம்.",
  },
  {
    house: 5, lagna: "Aquarius", planetSign: "Gemini", planet: "Moon", page: 234,
    en: "Faces some distress from children's side, has some deficiency in education, thinks of great devices to gain wealth, talks with vicissitudes",
    ta: "குழந்தைகள் வகையில் சில துன்பம்; கல்வியில் சில குறை; செல்வம் சேர்க்க பெரும் வழிகளை நினைப்பார்; மாறுபாடுகளுடன் பேசுவார்.",
  },
  {
    house: 5, lagna: "Aquarius", planetSign: "Gemini", planet: "Mars", page: 236,
    en: "Possesses knowledge of royal education, gets support of father and brother, spends much, is hasty, acquires good gains",
    ta: "அரச கல்வியின் அறிவு; தந்தை, சகோதரர் ஆதரவு; அதிகம் செலவழிப்பார்; அவசரக்காரர்; நல்ல ஆதாயம் பெறுவார்.",
  },
  {
    house: 5, lagna: "Aquarius", planetSign: "Gemini", planet: "Mercury", page: 238,
    en: "Possesses great wisdom and education, feces some uneasiness in the side of children, gets a long life, gains much wealth, hides things in formal affairs, bears some distress in his mind, and is somewhat perplexed",
    ta: "மிகுந்த ஞானமும் கல்வியும்; குழந்தைகள் வகையில் சில கவலை; நீண்ட ஆயுள்; அதிக செல்வம் ஈட்டுவார்; முறையான விவகாரங்களில் விஷயங்களை மறைப்பார்; மனத்தில் சில துன்பம்; சற்று குழப்பமானவர்.",
  },
  {
    house: 5, lagna: "Aquarius", planetSign: "Gemini", planet: "Jupiter", page: 240,
    en: "Is very wise and gets education, gets children, gets power of wealth through education, utters valuable things, gets heavy gains, maintains Dharma, maintains dignity",
    ta: "மிக அறிவாளி; கல்வி பெறுவார்; குழந்தைகள் உண்டு; கல்வியால் செல்வ வலிமை; மதிப்புமிக்க கருத்துகளைச் சொல்வார்; பெரிய ஆதாயம்; தர்மத்தைக் காப்பார்; கௌரவத்தைக் காப்பார்.",
  },
  {
    house: 5, lagna: "Aquarius", planetSign: "Gemini", planet: "Venus", page: 242,
    en: "Gets good children, gets good education and wisdom, achieves power from mother, gets happiness of buildings and property, publishes articles about divinity, is farsighted",
    ta: "நல்ல குழந்தைகள்; நல்ல கல்வியும் ஞானமும்; தாயால் ஆற்றல்; நிலமும் கட்டிடங்களும் மகிழ்ச்சி; தெய்வீகம் பற்றிக் கட்டுரைகள் எழுதுவார்; தூரநோக்குடையவர்.",
  },
  {
    house: 5, lagna: "Aquarius", planetSign: "Gemini", planet: "Saturn", page: 244,
    en: "Gets authority but some deficiency in education, has self-knowledge, faces some enmity in the side of wife, works indulgently in occupation though has to face some troubles",
    ta: "அதிகாரம் உண்டு, ஆனால் கல்வியில் சில குறை; தன்னறிவு உண்டு; மனைவி வீட்டில் சில பகை; தொழிலில் சில துன்பங்களைச் சந்தித்தாலும் இணக்கமாக வேலை செய்வார்.",
  },
  {
    house: 5, lagna: "Aquarius", planetSign: "Gemini", planet: "Rahu", page: 246,
    en: "Possesses cleverness and pungency in his mind, always tries to fool others, gets education, does not care for truth or falsehood, gets trouble from children's side",
    ta: "மனத்தில் சாமர்த்தியமும் கூர்மையும்; எப்போதும் பிறரை ஏமாற்ற முயல்வார்; கல்வி பெறுவார்; உண்மை, பொய் பற்றிக் கவலைப்படாதவர்; குழந்தைகள் வகையில் தொல்லை.",
  },
  {
    house: 5, lagna: "Aquarius", planetSign: "Gemini", planet: "Ketu", page: 248,
    en: "Gets his work done through the strength of falsehood, chalks out very secret schemes, gets weakness in education, faces affliction with children, has weak memory",
    ta: "தந்திரமான வழியில் வேலையைச் சாதிப்பார்; மிக ரகசியமான திட்டங்களை வகுப்பார்; கல்வியில் பலவீனம்; குழந்தைகளால் துன்பம்; நினைவாற்றல் குறைவு.",
  },
  {
    house: 5, lagna: "Pisces", planetSign: "Cancer", planet: "Sun", page: 253,
    en: "Gets some deficiency in education, experiences some worries and difficulties, works for income, gets victory over enemies' side, is rude",
    ta: "கல்வியில் சில குறை; சில கவலைகளும் சிரமங்களும்; வருமானத்துக்காக உழைப்பார்; எதிரிகள் பக்கம் வெற்றி; முரட்டுத்தனமானவர்.",
  },
  {
    house: 5, lagna: "Pisces", planetSign: "Cancer", planet: "Moon", page: 255,
    en: "Is very wise and learned, puts forth convincing ideas, gets the happiness of children, thinks of very balancing principles, has a stabilised mind, is of gentle nature",
    ta: "மிகுந்த அறிவும் கல்வியும்; நம்பும்படியான கருத்துகளை முன்வைப்பார்; குழந்தைகளின் மகிழ்ச்சி; மிகவும் சமநிலையான கொள்கைகளைச் சிந்திப்பார்; நிலையான மனம்; மென்மையான இயல்பு.",
  },
  {
    house: 5, lagna: "Pisces", planetSign: "Cancer", planet: "Mars", page: 257,
    en: "Bears distress from children, gets deficiency in education, faces deficiency in accumulating wealth, has weakness in connection with Dharma, spends much, acquires no enjoyment from the house of expenditure",
    ta: "குழந்தைகளால் துன்பம்; கல்வியில் குறை; செல்வம் சேர்ப்பதில் குறை; தர்மத்தில் பலவீனம்; அதிகம் செலவழிப்பார்; செலவு வீட்டிலிருந்து எந்த இன்பமும் பெறமாட்டார்.",
  },
  {
    house: 5, lagna: "Pisces", planetSign: "Cancer", planet: "Mercury", page: 259,
    en: "Pursues the occupation comfortably, manages the family affairs well, gains happiness of wife and children, gets excess of sexual pleasures, enjoys the lands and buildings, has some weakness in physique",
    ta: "தொழிலைச் சௌகரியமாகச் செய்வார்; குடும்ப விவகாரங்களை நன்கு நிர்வகிப்பார்; மனைவி, குழந்தைகளின் மகிழ்ச்சி; பாலியல் இன்பம் மிகுதி; நிலங்கள், கட்டிடங்களை அனுபவிப்பார்; உடலில் சில பலவீனம்.",
  },
  {
    house: 5, lagna: "Pisces", planetSign: "Cancer", planet: "Jupiter", page: 261,
    en: "Gets great strength in wisdom, is very learned, is an influential orator, gets the strength of father and son, has a handsome physique, rears Dharma very much, is very fortunate, feels the deficiency in income, self-conceited, is famous and farsighted",
    ta: "ஞானத்தில் பெரும் வலிமை; மிகவும் கற்றவர்; செல்வாக்குள்ள சொற்பொழிவாளர்; தந்தை, மகன் ஆகியோரின் வலிமை; அழகான உடல்; தர்மத்தை மிகவும் காப்பார்; மிக அதிர்ஷ்டசாலி; வருமானத்தில் குறை; கர்வமானவர்; புகழ்பெற்றவர்; தூரநோக்குடையவர்.",
  },
  {
    house: 5, lagna: "Pisces", planetSign: "Cancer", planet: "Venus", page: 264,
    en: "Faces distress in children's side, gets pleasure in the daily routine of life, gets a long age, loves brothers and sisters with some deficiency",
    ta: "குழந்தைகள் வகையில் துன்பம்; தினசரி வாழ்வில் மகிழ்ச்சி; நீண்ட வயது; சகோதர சகோதரிகளை நேசிப்பார், ஆனால் சில குறையுடன்.",
  },
  {
    house: 5, lagna: "Pisces", planetSign: "Cancer", planet: "Saturn", page: 266,
    en: "Loss in the side of children, gets some loss and some gain in the house of education, faces weakness in the house of accumulated wealth, bears separation in the family, gets some loss and gain in occupation, gets some loss and benefit in the house of wife, and talks selfishly",
    ta: "குழந்தைகள் வகையில் இழப்பு; கல்வி வீட்டில் சில இழப்பும் ஆதாயமும்; சேர்த்த செல்வத்தில் பலவீனம்; குடும்பத்தில் பிரிவு; தொழிலில் சில இழப்பும் ஆதாயமும்; மனைவி வீட்டில் சில இழப்பும் பயனும்; சுயநலமாகப் பேசுவார்.",
  },
  {
    house: 5, lagna: "Pisces", planetSign: "Cancer", planet: "Rahu", page: 268,
    en: "Faces calamities in the side of children, has deficiency in the house of education, is mentally and intellectually worried, solves very hard problems through his wisdom and will-power",
    ta: "குழந்தைகள் வகையில் சிக்கல்கள்; கல்வி வீட்டில் குறை; மனத்திலும் அறிவிலும் கவலை; மிகக் கடினமான பிரச்சினைகளை தன் ஞானத்தாலும் மன உறுதியாலும் தீர்ப்பார்.",
  },
  {
    house: 5, lagna: "Pisces", planetSign: "Cancer", planet: "Ketu", page: 270,
    en: "Bears severe calamity in the side of children, gets deficiency in education, faces mental anxieties from young age and in the end gets some stable power about education after going through great hindrances and obstacles, is unable to make others understand his ideas",
    ta: "குழந்தைகள் வகையில் கடுமையான துன்பம்; கல்வியில் குறை; இளம் வயதிலிருந்தே மனக் கவலைகள்; இறுதியில் பெரும் தடைகளைத் தாண்டி கல்வி பற்றி சில நிலையான வலிமை பெறுவார்; தன் கருத்துகளை மற்றவர்களுக்குப் புரியவைக்க முடியாது.",
  },
  {
    house: 6, lagna: "Aries", planetSign: "Virgo", planet: "Sun", page: 22,
    en: "Deficient in education, mentally worried, wins enemies, overcomes difficulties and hindrances, guides others to get over the problem, not happy with children, influence from maternal grandfather, spends much and gains due to intellectual pursuits",
    ta: "எதிரிகளை வெல்வார்; அதிகம் செலவழிப்பார்; புகழும் நற்பெயரும் பெறுவார்; தொழிலில் நல்ல திறமை; அமைதியாக சோதனைகளைக் கடப்பார்.",
  },
  {
    house: 6, lagna: "Aries", planetSign: "Virgo", planet: "Moon", page: 23,
    en: "Finds hindrances in happiness, lacks motherly affection, does not get family happiness, does not possess good landed properties, mentally unhappy, fear from enemies, spends much, gets help from maternal grandfather",
    ta: "மகிழ்ச்சியில் தடைகள்; தாயின் அன்பு குறைவு; குடும்ப மகிழ்ச்சி இல்லை; நல்ல நிலச் சொத்து இல்லை; மனத்தில் அதிருப்தி; எதிரிகளிடம் பயம்; அதிகம் செலவழிப்பார்; தாய்வழி தாத்தாவின் உதவி கிடைக்கும்.",
  },
  {
    house: 6, lagna: "Aries", planetSign: "Virgo", planet: "Mars", page: 25,
    en: "Influential, gets fame due to industry, wins enemies, gets losses, physically sick and feels troubles in body but gets over them, does not lose confidence, a bit irreligious, spends much, brave, has occult powers and is selfish",
    ta: "செல்வாக்குள்ளவர்; கடின உழைப்பால் புகழ்; எதிரிகளை வெல்வார்; இழப்புகள்; உடலில் நோய், சிரமம், ஆனால் அவற்றைக் கடப்பார்; தன்னம்பிக்கை இழக்காதவர்; சிறிது தர்மத்தில் நாட்டமின்மை; அதிகம் செலவழிப்பார்; தைரியமானவர்; மறைமுக சக்திகள் உண்டு; சுயநலம்.",
  },
  {
    house: 6, lagna: "Aries", planetSign: "Virgo", planet: "Mercury", page: 27,
    en: "Influential, enmity with brothers, help from maternal grandfather, wins over enemies, careless about expenditure, dignified due to intelligence, is very industrious, courageous and brave",
    ta: "செல்வாக்குள்ளவர்; உடன்பிறப்புகளுடன் பகை; தாய்வழி தாத்தாவின் உதவி; எதிரிகளை வெல்வார்; செலவில் கவனக்குறைவு; அறிவால் மதிப்பு; மிகுந்த உழைப்பாளி, தைரியசாலி.",
  },
  {
    house: 6, lagna: "Aries", planetSign: "Virgo", planet: "Jupiter", page: 29,
    en: "Not very fortunate, irreligious, loss of fame, manages expenditure, bears great disputes and wins, not a dutiful son, enmity with government and society, clever in controlling enemies, works with wisdom and is clever",
    ta: "அதிர்ஷ்டம் குறைவு; தர்மத்தில் நாட்டமின்மை; புகழ் இழப்பு; செலவை நிர்வகிப்பார்; பெரும் வாக்குவாதங்களைத் தாங்கி வெல்வார்; தந்தைக்கு கீழ்ப்படியாதவர்; அரசு, சமூகத்துடன் பகை; எதிரிகளைக் கட்டுப்படுத்துவதில் சாமர்த்தியம்; ஞானத்துடன் வேலை செய்வார்.",
  },
  {
    house: 6, lagna: "Aries", planetSign: "Virgo", planet: "Venus", page: 31,
    en: "Anxiety on the part of wealth, gets loss of family, unhappy with wife, sexually unhappy, has to work hard, not happy on the side of grandfather, spends much, does his own work politely, secretive in his policies and suffers from ill-health, does the business of borrowing and spending",
    ta: "செல்வ வகையில் கவலை; குடும்ப இழப்பு; மனைவியுடன் அதிருப்தி; பாலியல் வகையில் மகிழ்ச்சியின்மை; கடின உழைப்பு; தாத்தா வகையில் மகிழ்ச்சியின்மை; அதிகம் செலவழிப்பார்; தன் வேலையைப் பணிவுடன் செய்வார்; ரகசிய திட்டங்கள்; உடல்நலக் குறைவு; கடன் வாங்கி செலவழிப்பார்.",
  },
  {
    house: 6, lagna: "Aries", planetSign: "Virgo", planet: "Saturn", page: 33,
    en: "Not happy with father, worried about the daily routine of life, no problem with enemies, feels insecure in earnings, heavy expenditure due to reasons beyond control, some help from brothers and sisters",
    ta: "தந்தையால் மகிழ்ச்சியின்மை; தினசரி வாழ்வில் கவலை; எதிரிகளால் பிரச்சினை இல்லை; வருமானத்தில் பாதுகாப்பின்மை; கட்டுப்படுத்த முடியாத காரணங்களால் அதிக செலவு; உடன்பிறப்புகளிடமிருந்து சில உதவி.",
  },
  {
    house: 6, lagna: "Aries", planetSign: "Virgo", planet: "Rahu", page: 35,
    en: "Overcomes the earnings, has upper hand over all types of difficulties and troubles, selfish, faces hindrances from the side of maternal grandfather",
    ta: "வருமானத்தை வெல்வார்; எல்லா வகை சிரமங்களையும் துன்பங்களையும் மேற்கொள்வார்; சுயநலம்; தாய்வழி தாத்தாவிடமிருந்து தடைகள்.",
  },
  {
    house: 6, lagna: "Aries", planetSign: "Virgo", planet: "Ketu", page: 37,
    en: "Conquers enemies, is brave, gets less affection from the maternal grandfather, has to face sudden enemies and finally succeeds over them, commits sins",
    ta: "எதிரிகளை வெல்வார்; தைரியசாலி; தாய்வழி தாத்தாவின் அன்பு குறைவு; திடீர் எதிரிகளைச் சந்திப்பார், இறுதியில் அவர்களை வெல்வார்; பாவம் செய்யக்கூடியவர்.",
  },
  {
    house: 6, lagna: "Taurus", planetSign: "Libra", planet: "Sun", page: 42,
    en: "Faces opposition and also separation from mother, loses lands and property, worry from enemies, feels restless and loses courage",
    ta: "எதிர்ப்பும் தாயிடமிருந்து பிரிவும்; நிலமும் சொத்தும் இழப்பு; எதிரிகள் மூலம் கவலை; அமைதியின்மை; தைரியமிழப்பு.",
  },
  {
    house: 6, lagna: "Taurus", planetSign: "Libra", planet: "Moon", page: 44,
    en: "Differences with brothers and sisters, feels exhausted, gets strength in the house of enemies",
    ta: "உடன்பிறப்புகளுடன் வேறுபாடுகள்; களைப்பு; எதிரிகளின் வீட்டில் வலிமை.",
  },
  {
    house: 6, lagna: "Taurus", planetSign: "Libra", planet: "Mars", page: 46,
    en: "Worries in the occupation, mixed expenditure, worries about wife, likely to suffer from diabetes, enmity with maternal grandfather and his household",
    ta: "தொழிலில் கவலை; செலவில் கலவை; மனைவி பற்றிய கவலை; நீரிழிவு நோய் வாய்ப்பு; தாய்வழி தாத்தாவுடனும் அவர் குடும்பத்துடனும் பகை.",
  },
  {
    house: 6, lagna: "Taurus", planetSign: "Libra", planet: "Mercury", page: 48,
    en: "Deficiency in education and also in family, clever in getting along with enemies, worries as to how to get wealth",
    ta: "கல்வி, குடும்பம் இரண்டிலும் குறை; எதிரிகளுடன் சாமர்த்தியமாகப் பழகுவார்; செல்வம் ஈட்டுவது பற்றிய கவலை.",
  },
  {
    house: 6, lagna: "Taurus", planetSign: "Libra", planet: "Jupiter", page: 50,
    en: "Gains with difficulty, suffers in health, enmity with father, dislike in government and society, deficiency in income, spends much",
    ta: "சிரமத்துடன் ஆதாயம்; உடல்நலக் குறை; தந்தையுடன் பகை; அரசு, சமூகத்தில் வெறுப்பு; வருமானக் குறை; அதிகம் செலவழிப்பார்.",
  },
  {
    house: 6, lagna: "Taurus", planetSign: "Libra", planet: "Venus", page: 52,
    en: "Does independent influential deeds, gets some disease in the body, help from maternal grandfather's house, spends much, keeps great influence in the house of enemies, does hard work and wins over people in spite of opposition",
    ta: "சுயமான செல்வாக்குள்ள செயல்கள்; உடலில் சில நோய்; தாய்வழி தாத்தாவின் வீட்டிலிருந்து உதவி; அதிகம் செலவழிப்பார்; எதிரிகள் வீட்டில் பெரும் செல்வாக்கு; கடின உழைப்பு; எதிர்ப்பையும் மீறி மக்களை வெல்வார்.",
  },
  {
    house: 6, lagna: "Taurus", planetSign: "Libra", planet: "Saturn", page: 54,
    en: "Gets great strength from father, does business through influential deeds, gets respect and honour, keeps the influence in the house of enemies, ready to do the hardest work and maintains the progress of influence, works with some carelessness and also in expenditure, enmity with brothers and sisters",
    ta: "தந்தையிடமிருந்து பெரும் வலிமை; செல்வாக்குள்ள செயல்களால் தொழில்; மரியாதையும் கௌரவமும்; எதிரி வீட்டில் செல்வாக்கு.",
  },
  {
    house: 6, lagna: "Taurus", planetSign: "Libra", planet: "Rahu", page: 56,
    en: "Great influence in the house of enemies, loss through maternal grandfather, selfish and cautious",
    ta: "எதிரி வீட்டில் பெரும் செல்வாக்கு; தாய்வழி தாத்தா வகையில் இழப்பு; சுயநலம்; எச்சரிக்கை.",
  },
  {
    house: 6, lagna: "Taurus", planetSign: "Libra", planet: "Ketu", page: 58,
    en: "Faces enemies bravely, gets illness and troubles, enmity with maternal grandfather, a bit rash in approach",
    ta: "எதிரிகளைத் தைரியமாக எதிர்கொள்வார்; நோயும் தொல்லைகளும்; தாய்வழி தாத்தாவுடன் பகை; சற்று அவசரமானவர்.",
  },
  {
    house: 6, lagna: "Gemini", planetSign: "Scorpio", planet: "Sun", page: 62,
    en: "Labours through his strength and energy, gets huge influence and dignity in the house of enemies, huge influence in the side of maternal grandfather, uneasiness in the house of expenditure",
    ta: "தன் ஆற்றலாலும் வலிமையாலும் கடுமையாக உழைப்பார்; எதிரி வீட்டில் பெரும் செல்வாக்கும் கம்பீரமும்; தாய்வழி தாத்தா வகையில் பெரும் செல்வாக்கு; செலவு வீட்டில் அமைதியின்மை.",
  },
  {
    house: 6, lagna: "Gemini", planetSign: "Scorpio", planet: "Moon", page: 64,
    en: "Feels restless, loss in family (usually mother), feels worried from the side of enemy, loss of wealth, quarrels and gets some diseases, spends too much, gains through secret policies",
    ta: "அமைதியின்மை; குடும்ப இழப்பு (பொதுவாகத் தாய் வகையில்); எதிரி வகையில் கவலை; செல்வ இழப்பு; சண்டைகளும் சில நோய்களும்; அதிகம் செலவழிப்பார்; ரகசிய உபாயங்களால் ஆதாயம்.",
  },
  {
    house: 6, lagna: "Gemini", planetSign: "Scorpio", planet: "Mars", page: 66,
    en: "Strength in the mother's side and grandfather's house, some obstacles in the Dharma, suffers from diseases, keeps great strength in the house of gains, unhappy with expenditure and deficient income and is very courageous",
    ta: "தாய் வீட்டிலும் தாத்தா வீட்டிலும் வலிமை; தர்மத்தில் சில தடைகள்; நோய்களால் துன்பம்; ஆதாய வீட்டில் பெரும் வலிமை; செலவில் அதிருப்தி; வருமானக் குறை; மிகுந்த தைரியம்.",
  },
  {
    house: 6, lagna: "Gemini", planetSign: "Scorpio", planet: "Mercury", page: 68,
    en: "Unhappy, worried and dependent, loss of buildings and lands and residential affairs, spends much, gives happiness to others, and is wise",
    ta: "மகிழ்ச்சியின்மை, கவலை, சார்ந்திருத்தல்; கட்டிடங்கள், நிலம், வசிப்பிட விவகாரங்களில் இழப்பு; அதிகம் செலவழிப்பார்; மற்றவர்களுக்கு மகிழ்ச்சி தருவார்; அறிவாளி.",
  },
  {
    house: 6, lagna: "Gemini", planetSign: "Scorpio", planet: "Jupiter", page: 70,
    en: "Does dependent occupation, gets much influence and honour in the house of enmity, harsh from the house of wife, progress in the house of wealth, deficiency in the sexual pleasures",
    ta: "சார்ந்திருக்கும் தொழில்; எதிரி வீட்டில் பெரும் செல்வாக்கும் மரியாதையும்; மனைவி வகையில் கடுமை; செல்வ வீட்டில் முன்னேற்றம்; பாலியல் இன்பத்தில் குறை.",
  },
  {
    house: 6, lagna: "Gemini", planetSign: "Scorpio", planet: "Venus", page: 72,
    en: "Weak in education, faces suffering from children, expenditure, some suffering in the side of enemies, spends much, secretive",
    ta: "கல்வியில் பலவீனம்; குழந்தைகளால் துன்பம்; செலவு; எதிரிகள் வகையில் சில துன்பம்; அதிகம் செலவழிப்பார்; ரகசியமானவர்.",
  },
  {
    house: 6, lagna: "Gemini", planetSign: "Scorpio", planet: "Saturn", page: 74,
    en: "Gets work done with grand, intricate, laborious, religious devices to develop the life, not caring for religion, enmity with brothers and sisters, influence in the house of enemy, spends much, no faith in God and is somewhat famous",
    ta: "வாழ்க்கையை வளர்க்க பெரிய, சிக்கலான, கடின, மத வழிகளில் வேலை சாதிப்பார்; மதத்தைப் பொருட்படுத்தார்; உடன்பிறப்புகளுடன் பகை; எதிரி வீட்டில் செல்வாக்கு; அதிகம் செலவழிப்பார்; இறைநம்பிக்கை இல்லாதவர்; சிறிது புகழ் பெற்றவர்.",
  },
  {
    house: 6, lagna: "Gemini", planetSign: "Scorpio", planet: "Rahu", page: 76,
    en: "Keeps high influence in the house of enemies, loss in maternal grandfather house, does not care for worries like disease etc, does not care for Dharma, commits sins and crimes, selfish and brave",
    ta: "எதிரி வீட்டில் உயர் செல்வாக்கு; தாய்வழி தாத்தாவின் வீட்டில் இழப்பு; நோய் போன்ற கவலைகளைப் பொருட்படுத்தார்; தர்மத்தைக் கருதார்; பாவமும் குற்றமும் செய்வார்; சுயநலம், தைரியம்.",
  },
  {
    house: 6, lagna: "Gemini", planetSign: "Scorpio", planet: "Ketu", page: 78,
    en: "Keeps huge influence in the house of enemies, loss on the side of maternal grandfather, uses inner firmness and rash power to win difficulties and worries, selfish and fearless",
    ta: "எதிரி வீட்டில் பெரும் செல்வாக்கு; தாய்வழி தாத்தா வகையில் இழப்பு; சிரமங்களையும் கவலைகளையும் வெல்ல உள் உறுதியையும் அவசர ஆற்றலையும் பயன்படுத்துவார்; சுயநலம்; அஞ்சாதவர்.",
  },
  {
    house: 6, lagna: "Cancer", planetSign: "Sagittarius", planet: "Sun", page: 83,
    en: "Is very influential and earns wealth through his diligence and does not care for enemies and difficulties, gains from enemies and difficulties of wealth, spends much, feels deficiency in the house of wealth, some influence in the house of maternal grandfather, empowers illness, some deficiency in the house of family pleasures, respected",
    ta: "மிகுந்த செல்வாக்குள்ளவர்; தன் உழைப்பால் செல்வம் ஈட்டுவார்; எதிரிகளையும் சிரமங்களையும் பொருட்படுத்தார்; எதிரிகளாலும் சிரமங்களாலும் ஆதாயம்; அதிகம் செலவழிப்பார்; செல்வ வீட்டில் குறை; தாய்வழி தாத்தா வீட்டில் சில செல்வாக்கு; நோய் வாய்ப்பு; குடும்ப இன்பங்களில் சில குறை; மரியாதைக்குரியவர்.",
  },
  {
    house: 6, lagna: "Cancer", planetSign: "Sagittarius", planet: "Moon", page: 85,
    en: "Weakness and disease in the body, dependent on others, feels restless, likes to live with grandfather, spends much, afraid of enemies, is calm and courageous",
    ta: "உடலில் பலவீனமும் நோயும்; பிறரைச் சார்ந்திருப்பவர்; அமைதியின்மை; தாத்தாவுடன் வாழ விரும்புவார்; அதிகம் செலவழிப்பார்; எதிரிகளுக்கு அஞ்சுவார்; அமைதியானவர், தைரியசாலி.",
  },
  {
    house: 6, lagna: "Cancer", planetSign: "Sagittarius", planet: "Mars", page: 87,
    en: "Is brave and influential, maintains his dignity and glory, gets victory over enemies and diseases, some trouble in his body, spends much, some deficiency in education and children",
    ta: "தைரியமும் செல்வாக்கும் உள்ளவர்; தன் கௌரவத்தையும் பெருமையையும் காப்பார்; எதிரிகளையும் நோய்களையும் வெல்வார்; உடலில் சில தொல்லை; அதிகம் செலவழிப்பார்; கல்வி, பிள்ளைகள் வகையில் சில குறை.",
  },
  {
    house: 6, lagna: "Cancer", planetSign: "Sagittarius", planet: "Mercury", page: 89,
    en: "Some hindrance in expenditure, does some dependent work, spends much, faces troubles, tries to curtail expenditure, somewhat restless",
    ta: "செலவில் சில தடை; சார்ந்த வேலைகள் செய்வார்; அதிகம் செலவழிப்பார்; சிக்கல்கள்; செலவைக் குறைக்க முயல்வார்; சற்று அமைதியற்றவர்.",
  },
  {
    house: 6, lagna: "Cancer", planetSign: "Sagittarius", planet: "Jupiter", page: 91,
    en: "Unable to rear up Dharma properly, defeats the enemy, victory over enemies, gets influence in government and society, spends much, is very influential and tries hard to acquire progress",
    ta: "தர்மத்தை சரியாகக் காக்க முடியாது; எதிரியை வெல்வார்; அரசு, சமூகத்தில் செல்வாக்கு; அதிகம் செலவழிப்பார்; மிகுந்த செல்வாக்குள்ளவர்; முன்னேற்றத்துக்காகக் கடுமையாக முயல்வார்.",
  },
  {
    house: 6, lagna: "Cancer", planetSign: "Sagittarius", planet: "Venus", page: 93,
    en: "Spends much, deficiency in the house of mother, hindrance in peace and happiness of property, some diseases and straggle from enemies, secretly very clever",
    ta: "அதிகம் செலவழிப்பார்; தாய் வகையில் குறை; சொத்தின் அமைதியிலும் மகிழ்ச்சியிலும் தடை; சில நோய்கள், எதிரிகளுடன் போராட்டம்; ரகசியமாக மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 6, lagna: "Cancer", planetSign: "Sagittarius", planet: "Saturn", page: 95,
    en: "Good longevity, pursues the daily occupation diligently, experiences some distress in the house of wife, deficiency in the side of sexual pleasures and is very wrathful",
    ta: "நல்ல ஆயுள்; தினசரி தொழிலை கவனமாகச் செய்வார்; மனைவி வீட்டில் சில துன்பம்; பாலியல் இன்பத்தில் குறை; மிகவும் கோபக்காரர்.",
  },
  {
    house: 6, lagna: "Cancer", planetSign: "Sagittarius", planet: "Rahu", page: 97,
    en: "Uses secret devices, does not care for justice and injustice in the way of serving his selfishness, secret policy with enemies, loss in maternal grandfather's house, selfish and cautious",
    ta: "மறைமுக உபாயங்களைப் பயன்படுத்துவார்; தன் சுயநலத்துக்காக நீதி அநீதியைக் கருதார்; எதிரிகளுடன் ரகசிய திட்டம்; தாய்வழி தாத்தா வீட்டில் இழப்பு; சுயநலம், எச்சரிக்கை.",
  },
  {
    house: 6, lagna: "Cancer", planetSign: "Sagittarius", planet: "Ketu", page: 99,
    en: "Is very brave, splendid influence in the house of enemies, uses very extravagantly the secret devices for his advancement, violates modesty, does not care for all the virtues or sin before his selfishness, is very dangerous, fearless, dissatisfied and victorious",
    ta: "மிகுந்த தைரியம்; எதிரி வீட்டில் அற்புதமான செல்வாக்கு; தன் முன்னேற்றத்துக்காக ரகசிய உபாயங்களை மிகையாகப் பயன்படுத்துவார்; மரியாதையை மீறுவார்; சுயநலத்துக்கு முன் நல்லொழுக்கம், பாவம் எதையும் கருதார்; மிகவும் ஆபத்தானவர், அஞ்சாதவர், அதிருப்தியும் வெற்றியும் உள்ளவர்.",
  },
  {
    house: 6, lagna: "Leo", planetSign: "Capricorn", planet: "Sun", page: 105,
    en: "Victory over enemies, spends much, does not care for the hindrances and troubles",
    ta: "எதிரிகளை வெல்வார்; அதிகம் செலவழிப்பார்; தடைகளையும் சிரமங்களையும் பொருட்படுத்தார்.",
  },
  {
    house: 6, lagna: "Leo", planetSign: "Capricorn", planet: "Moon", page: 106,
    en: "Some dependence in the house of expenditure, gets mentally fatigued, gets his work done politely, careless in the house of enemy, spends on diseases",
    ta: "செலவு வீட்டில் சில சார்பு; மனச் சோர்வு; வேலையைப் பணிவுடன் முடிப்பார்; எதிரி வீட்டில் கவனக்குறைவு; நோய்களுக்குச் செலவழிப்பார்.",
  },
  {
    house: 6, lagna: "Leo", planetSign: "Capricorn", planet: "Mars", page: 108,
    en: "Defends the enemy, some weakness in the house of mother, gets hindrance in peace and happiness, possesses the power of buildings, deficiency in the house of expenditure",
    ta: "எதிரியைப் பாதுகாப்பார்; தாய் வீட்டில் சில பலவீனம்; மகிழ்ச்சிக்குத் தடை; கட்டிடங்களின் வலிமை; செலவு வீட்டில் குறை.",
  },
  {
    house: 6, lagna: "Leo", planetSign: "Capricorn", planet: "Mercury", page: 110,
    en: "Weakness in accumulating wealth, takes some advantage due to wealth in connection with enemies and diseases, spends much, is very clever",
    ta: "செல்வம் சேர்ப்பதில் பலவீனம்; எதிரிகள், நோய்கள் தொடர்பாக செல்வத்தால் சில ஆதாயம்; அதிகம் செலவழிப்பார்; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 6, lagna: "Leo", planetSign: "Capricorn", planet: "Jupiter", page: 112,
    en: "Experiences restlessness in the daily routine of life, spends much, uses great diplomacy in the house of enemy, puts great efforts in increasing the wealth",
    ta: "தினசரி வாழ்வில் அமைதியின்மை; அதிகம் செலவழிப்பார்; எதிரி வீட்டில் பெரும் ராஜதந்திரம்; செல்வத்தை அதிகரிக்க பெரும் முயற்சி.",
  },
  {
    house: 6, lagna: "Leo", planetSign: "Capricorn", planet: "Venus", page: 114,
    en: "Some enmity in the house of father, hindrances in the house of honour, some ordinary strength in government and society, spends much, faces difficulties in conducting the occupation, influence in the house of enemy, feels very hard to acquire progress",
    ta: "தந்தை வீட்டில் சில பகை; மரியாதை வகையில் தடைகள்; அரசு, சமூகத்தில் சாதாரண வலிமை; அதிகம் செலவழிப்பார்; தொழிலை நடத்துவதில் சிரமம்; எதிரி வீட்டில் செல்வாக்கு; முன்னேற்றம் பெறுவது மிகக் கடினம்.",
  },
  {
    house: 6, lagna: "Leo", planetSign: "Capricorn", planet: "Saturn", page: 116,
    en: "Perplexity from the side of wife, some deficiency in the advantages of sexual pleasures, gets influence in the house of enemy, gets influence in the daily occupation after going through great troubles",
    ta: "மனைவி வகையில் குழப்பம்; பாலியல் இன்பத்தின் வசதிகளில் சில குறை; எதிரி வீட்டில் செல்வாக்கு; பெரும் சிரமங்களுக்குப் பின் தினசரி தொழிலில் செல்வாக்கு பெறுவார்.",
  },
  {
    house: 6, lagna: "Leo", planetSign: "Capricorn", planet: "Rahu", page: 118,
    en: "Possesses the great power of influence in the house of enemy, violates politeness, gentility and satisfaction, influential and brave",
    ta: "எதிரி வீட்டில் பெரும் செல்வாக்கு; பணிவு, நாகரிகம், திருப்தி ஆகியவற்றை மீறுவார்; செல்வாக்குள்ளவர், தைரியசாலி.",
  },
  {
    house: 6, lagna: "Leo", planetSign: "Capricorn", planet: "Ketu", page: 120,
    en: "Great influence in the house of enemy, destroys the diseases and difficulties, violates modesty, gets the selfishness accomplished, is very brave and courageous",
    ta: "எதிரி வீட்டில் பெரும் செல்வாக்கு; நோய்களையும் சிரமங்களையும் அழிப்பார்; அடக்கத்தை மீறுவார்; சுயநலத்தை நிறைவேற்றுவார்; மிகவும் தைரியமும் வீரமும் உள்ளவர்.",
  },
  {
    house: 6, lagna: "Virgo", planetSign: "Aquarius", planet: "Sun", page: 126,
    en: "Manages his expenditure properly through some dependent actions, unable to check his expenditure even when he wishes to do so, has to spend in the matter of illness",
    ta: "சார்ந்த செயல்கள் மூலம் செலவை நிர்வகிப்பார்; விரும்பினாலும் செலவைக் கட்டுப்படுத்த முடியாது; நோய்க்காகச் செலவு செய்ய வேண்டிவரும்.",
  },
  {
    house: 6, lagna: "Virgo", planetSign: "Aquarius", planet: "Moon", page: 127,
    en: "Some weakness in connection with gains, gets mental anxieties, spends much, gets some sort of dependence for income or gains, gets a little from maternal grandfather, finds his mind somewhat occupied, and is of amiable disposition",
    ta: "ஆதாயத்தில் சில பலவீனம்; மனக் கவலைகள்; அதிகம் செலவழிப்பார்; வருமானத்துக்கு ஒரு வகை சார்பு; தாய்வழி தாத்தாவிடமிருந்து சிறிது ஆதாயம்; மனம் சற்று ஆக்கிரமிக்கப்பட்டிருக்கும்; இனிய குணமுள்ளவர்.",
  },
  {
    house: 6, lagna: "Virgo", planetSign: "Aquarius", planet: "Mars", page: 129,
    en: "Some losses on the side of his maternal grandfather, gets some enmity or separation on the side of brother, makes the enemies and opponents uneasy, lives in a sort of bondage",
    ta: "தாய்வழி தாத்தா வகையில் சில இழப்பு; சகோதரர் வகையில் சில பகையும் பிரிவும்; எதிரிகளையும் எதிர்ப்பாளர்களையும் கலங்க வைப்பார்; ஒரு வகை அடிமைத்தனத்தில் வாழ்வார்.",
  },
  {
    house: 6, lagna: "Virgo", planetSign: "Aquarius", planet: "Mercury", page: 131,
    en: "Lives dependently, some enmity in the house of father and gets some hindrances in his progress being overtaken by the perplexities of illness etc, power of discomfort from the side of enemies, spends much, has to suffer from some sins and is gende",
    ta: "சார்ந்து வாழ்வார்; தந்தை வீட்டில் சில பகை; நோய் போன்ற குழப்பங்களால் முன்னேற்றத்தில் தடை; எதிரிகளால் சில தொல்லை; அதிகம் செலவழிப்பார்; சில பாவங்களால் துன்பம்; மென்மையானவர்.",
  },
  {
    house: 6, lagna: "Virgo", planetSign: "Aquarius", planet: "Jupiter", page: 134,
    en: "Gets hindrance in the pleasure of the family, bears some distress on the side of mother and wife, gets deficiency in peace and happiness, hindrance in daily occupation, has family, spends much, gets work done with some politeness on the side of enemies, gets some hindrance in sexual affairs, some deficiency in residential places, and gets some help from the big business concerns",
    ta: "குடும்ப இன்பத்தில் தடை; தாய், மனைவி வகையில் சில துன்பம்; அமைதியும் மகிழ்ச்சியும் குறைவு; தினசரி தொழிலில் தடை; குடும்பம் உண்டு; அதிகம் செலவழிப்பார்; எதிரிகளிடம் சில பணிவுடன் வேலை சாதிப்பார்; பாலியல் விவகாரங்களில் சில தடை; வசிப்பிடங்களில் சில குறை; பெரிய வணிக நிறுவனங்களிலிருந்து சில உதவி.",
  },
  {
    house: 6, lagna: "Virgo", planetSign: "Aquarius", planet: "Venus", page: 136,
    en: "Is a successful politician, earns wealth, injures Dharma, wins the enemies with the power of Dharma, some worries in connection with destiny",
    ta: "வெற்றிகரமான அரசியல்வாதி; செல்வம் ஈட்டுவார்; தர்மத்தைக் காயப்படுத்துவார்; தர்ம ஆற்றலால் எதிரிகளை வெல்வார்; விதி பற்றிய சில கவலைகள்.",
  },
  {
    house: 6, lagna: "Virgo", planetSign: "Aquarius", planet: "Saturn", page: 138,
    en: "Defeats the side of enemies, does not care for quarrels and diseases, keeps bitter opposition with brothers, gets restlessness, some distress with expenditure, gets very much distresses on the side of children, some deficiency in educational ways, talks in a crooked way",
    ta: "எதிரிகளை வெல்வார்; சண்டைகளையும் நோய்களையும் பொருட்படுத்தார்; சகோதரருடன் கடும் எதிர்ப்பு; அமைதியின்மை; செலவில் சில சிரமம்; பிள்ளைகள் வகையில் பெரும் துன்பம்; கல்வி வழிகளில் சில குறை; வளைந்த முறையில் பேசுவார்.",
  },
  {
    house: 6, lagna: "Virgo", planetSign: "Aquarius", planet: "Rahu", page: 140,
    en: "Defeats the enemy, overcomes the diseases, gains through improper means, feels some internal weakness, selfish and clever",
    ta: "எதிரியை வெல்வார்; நோய்களை வெல்வார்; தவறான வழிகளில் ஆதாயம்; உள் பலவீனம்; சுயநலம், சாமர்த்தியம்.",
  },
  {
    house: 6, lagna: "Virgo", planetSign: "Aquarius", planet: "Ketu", page: 142,
    en: "Has great power and energy, thinks himself to be fearless, defeats the enemies, works with pride, overcomes the diseases, does not care for justice or injustice, selfish and influential",
    ta: "பெரும் வலிமையும் ஆற்றலும்; தன்னை அஞ்சாதவர் என நினைப்பார்; எதிரிகளை வெல்வார்; பெருமையுடன் வேலை செய்வார்; நோய்களை வெல்வார்; நியாயம் அநியாயம் பற்றிக் கவலைப்படார்; சுயநலம், செல்வாக்கு.",
  },
  {
    house: 6, lagna: "Libra", planetSign: "Pisces", planet: "Sun", page: 147,
    en: "Gets victory in the house of enemies, spends much, influential, of good manners, brilliant and fearless",
    ta: "எதிரி வீட்டில் வெற்றி; அதிகம் செலவழிப்பார்; செல்வாக்குள்ளவர்; நல்ல பழக்கவழக்கம்; அறிவும் துணிச்சலும் உள்ளவர், அஞ்சாதவர்.",
  },
  {
    house: 6, lagna: "Libra", planetSign: "Pisces", planet: "Moon", page: 148,
    en: "Some deficiency in the house of father, does splendid business, more expenditure than income, dignity in the house of worries and enemies, keeps contact with outside places",
    ta: "தந்தை வீட்டில் சில குறை; சிறந்த வணிகம் செய்வார்; செலவு வருமானத்தை விட அதிகம்; கவலைகளும் எதிரிகளும் உள்ள வீட்டில் கௌரவம்; வெளியூர் தொடர்புகள் உண்டு.",
  },
  {
    house: 6, lagna: "Libra", planetSign: "Pisces", planet: "Mars", page: 150,
    en: "Weakness in connection with wealth and occupation, some distress from his wife and family, spends much, keeps influence in the side of enemies, deficiency in the sexual pleasures",
    ta: "செல்வமும் தொழிலும் தொடர்பான பலவீனம்; மனைவி, குடும்பத்தால் சில துன்பம்; அதிகம் செலவழிப்பார்; எதிரி வீட்டில் செல்வாக்கு; பாலியல் இன்பத்தில் குறை.",
  },
  {
    house: 6, lagna: "Libra", planetSign: "Pisces", planet: "Mercury", page: 152,
    en: "Great weakness and dishonour in his destiny, gets loss in his fortune, restlessness in the house of enemies, gets worries in expenditure, and follows secret tactics",
    ta: "விதியில் பெரும் பலவீனமும் அவமானமும்; அதிர்ஷ்டத்தில் இழப்பு; எதிரி வீட்டில் அமைதியின்மை; செலவில் கவலை; இரகசிய உபாயங்களைப் பின்பற்றுவார்.",
  },
  {
    house: 6, lagna: "Libra", planetSign: "Pisces", planet: "Jupiter", page: 154,
    en: "Is of brave nature, gets dignity by his hard labour, defeats the opponents, spends much, gets bondage in his work and is careless",
    ta: "தைரியமான இயல்பு; கடின உழைப்பால் கௌரவம்; எதிரிகளை வெல்வார்; அதிகம் செலவழிப்பார்; தன் வேலையில் கட்டுப்பாடு; கவனக்குறைவானவர்.",
  },
  {
    house: 6, lagna: "Libra", planetSign: "Pisces", planet: "Venus", page: 156,
    en: "Solves the most difficult problems of his life, is careless, some deficiency in the house of expenditure",
    ta: "வாழ்வின் மிகக் கடினமான பிரச்சினைகளைத் தீர்ப்பார்; கவனக்குறைவானவர்; செலவு வீட்டில் சில குறை.",
  },
  {
    house: 6, lagna: "Libra", planetSign: "Pisces", planet: "Saturn", page: 158,
    en: "Unhappiness from the house of mother and children, gets deficiency in getting happiness and education, feels happiness in age and daily routine, speaks somewhat bitterly, some enmity with brother",
    ta: "தாய், பிள்ளைகள் வீட்டில் மகிழ்ச்சியின்மை; மகிழ்ச்சி, கல்வி பெறுவதில் குறை; வயதிலும் தினசரி வாழ்விலும் மகிழ்ச்சி; சிறிது கடுமையாகப் பேசுவார்; சகோதரருடன் சில பகை.",
  },
  {
    house: 6, lagna: "Libra", planetSign: "Pisces", planet: "Rahu", page: 160,
    en: "Gets victory over the difficulties like diseases etc, defeats the enemies, is careful, alert and selfish",
    ta: "நோய் போன்ற சிரமங்களை வெல்வார்; எதிரிகளைத் தோற்கடிப்பார்; எச்சரிக்கையானவர், விழிப்புடன் இருப்பவர், சுயநலம்.",
  },
  {
    house: 6, lagna: "Libra", planetSign: "Pisces", planet: "Ketu", page: 162,
    en: "Keeps huge influence on enemies, gets less in the house of grandfather, has patience and courage, makes efforts to free from diseases and is of fearless nature",
    ta: "எதிரிகள் மீது பெரும் செல்வாக்கு; தாத்தா வீட்டில் குறைவான ஆதாயம்; பொறுமை, தைரியம்; நோயிலிருந்து விடுபட முயல்வார்; அஞ்சாத இயல்பு.",
  },
  {
    house: 6, lagna: "Scorpio", planetSign: "Aries", planet: "Sun", page: 168,
    en: "Gets victory over the enemies, gets some weakness in the side of expenditure, gets the contact with other places, does not get perplexed due to worries and difficulties, earns his fame and reputation through great tactics",
    ta: "எதிரிகளை வெல்வார்; செலவில் சில பலவீனம்; பிற இடங்களுடன் தொடர்பு; கவலைகளாலும் சிரமங்களாலும் குழம்ப மாட்டார்; பெரும் உபாயங்களால் புகழும் நற்பெயரும் பெறுவார்.",
  },
  {
    house: 6, lagna: "Scorpio", planetSign: "Aries", planet: "Moon", page: 170,
    en: "Has less faith in Dharma and God, gets some weakness in the side of destiny, gets more means of expenditure, gets opposition in the side of enemies",
    ta: "தர்மத்திலும் இறையிலும் குறைந்த நம்பிக்கை; விதியில் சில பலவீனம்; செலவுக்கான வழிகள் அதிகம்; எதிரிகளிடமிருந்து எதிர்ப்பு.",
  },
  {
    house: 6, lagna: "Scorpio", planetSign: "Aries", planet: "Mars", page: 172,
    en: "Is very brave, has a stout body, does not care about the enemies, gets honour through will-power, some weakness in the house of Dharma, gets his work done through intricate means, feels fatigue in the body, and is caustic",
    ta: "மிகுந்த தைரியம்; வலிமையான உடல்; எதிரிகளைப் பொருட்படுத்தார்; மன உறுதியால் கௌரவம்; தர்மத்தில் சில பலவீனம்; சிக்கலான வழிகளால் வேலை சாதிப்பார்; உடலில் களைப்பு; கடுமையாகப் பேசுவார்.",
  },
  {
    house: 6, lagna: "Scorpio", planetSign: "Aries", planet: "Mercury", page: 174,
    en: "Gets worries and dependence in life for acquiring income, earns a little through some troublesome deeds, unable to make good use of the daily routine or his life, faces anxieties, uses secret schemes",
    ta: "வருமானம் ஈட்ட வாழ்வில் கவலையும் சார்பும்; சில தொல்லையான செயல்களால் சிறிது ஆதாயம்; தினசரி வாழ்வையும் வாழ்க்கையையும் நல்ல முறையில் பயன்படுத்த முடியாது; கவலைகள்; ரகசியத் திட்டங்கள்.",
  },
  {
    house: 6, lagna: "Scorpio", planetSign: "Aries", planet: "Jupiter", page: 176,
    en: "Earns wealth regularly with some dependence and difficulty, gets his work done cleverly in the house of enemies, puts in more and more efforts to accumulate wealth, gets weakness of children and education, spends much and is unable to put forward his views properly",
    ta: "ஒழுங்காக சார்புடனும் சிரமத்துடனும் வருமானம் ஈட்டுவார்; எதிரி வீட்டில் சாமர்த்தியமாக வேலை சாதிப்பார்; செல்வம் சேர்க்க மேலும் மேலும் முயற்சி; குழந்தைகள், கல்வியில் குறை; அதிகம் செலவழிப்பார்; தன் கருத்துகளை சரியாக முன்வைக்க முடியாது.",
  },
  {
    house: 6, lagna: "Scorpio", planetSign: "Aries", planet: "Venus", page: 178,
    en: "Gets the opposition from his wife, gets weaknesses in occupation spends much being entangled in worries, bears some domestic obstacles in the domestic happiness, gets deficiency in sexual pleasures, bears extraordinary expenditure in wife's side, is very clever and careful",
    ta: "மனைவியிடமிருந்து எதிர்ப்பு; தொழிலில் பலவீனம்; அதிகம் செலவழிப்பார்; கவலைகளில் சிக்கியிருப்பார்; குடும்ப மகிழ்ச்சியில் சில தடைகள்; பாலியல் இன்பத்தில் குறை.",
  },
  {
    house: 6, lagna: "Scorpio", planetSign: "Aries", planet: "Saturn", page: 180,
    en: "Loss in the happiness of mother, enmity from brothers, lack of power in some diseases, feels distressed in the house of enemies, adopts wrong schemes",
    ta: "தாயின் மகிழ்ச்சியில் இழப்பு; சகோதரர் வகையில் பகை; சில நோய்களில் சக்தி குறைவு; எதிரி வீட்டில் துன்பம்; தவறான திட்டங்களைக் கையாள்வார்.",
  },
  {
    house: 6, lagna: "Scorpio", planetSign: "Aries", planet: "Rahu", page: 182,
    en: "Is very influential and gets victory over the enemies, is unable to rear gentleness and satisfaction, gets his work done very patiently not caring for troubles or diseases, is a diplomat",
    ta: "எதிரிகள் மீது பெரும் செல்வாக்கும் வெற்றியும்; மென்மையையும் திருப்தியையும் காக்க முடியாது; சிரமங்களையும் நோய்களையும் பொருட்படுத்தாமல் பொறுமையாக வேலை செய்வார்; ராஜதந்திரி.",
  },
  {
    house: 6, lagna: "Scorpio", planetSign: "Aries", planet: "Ketu", page: 184,
    en: "Is very brave and has a heroic nature, gets victory over enemies, does not care about the troubles that he may have to face, gets rid of diseases and difficulties very carefully and alertly, pays attention towards serving his selfishness",
    ta: "மிகவும் தைரியமானவர், வீர இயல்புடையவர்; எதிரிகளை வெல்வார்; தன் முன் உள்ள சிரமங்களைப் பொருட்படுத்தார்; நோய்களையும் சிரமங்களையும் மிகக் கவனமாகவும் விழிப்புடனும் நீக்குவார்; தன் சுயநலத்தைக் கவனிப்பார்.",
  },
  {
    house: 6, lagna: "Sagittarius", planetSign: "Taurus", planet: "Sun", page: 190,
    en: "Gets conjunction of difficulties, distress about destiny, unable to rear Dharma, gets the influence in the house of opponents and enemies, suppresses the calamities, gets control over the diseases, spends much, is influential",
    ta: "சிரமங்களின் கூட்டு; விதியைப் பற்றிய கவலை; தர்மத்தைக் காக்க முடியாது; எதிரிகள், பகைவர் வீட்டில் செல்வாக்கு; இடர்களை அடக்குவார்; நோய்களை கட்டுப்படுத்துவார்; அதிகம் செலவழிப்பார்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 6, lagna: "Sagittarius", planetSign: "Taurus", planet: "Moon", page: 191,
    en: "Weakness in connection with expenditure, possesses influence in the house of enemies, gets his work done fearlessly and is not modest",
    ta: "செலவில் பலவீனம்; எதிரி வீட்டில் செல்வாக்கு; அஞ்சாமல் வேலை செய்வார்; அடக்கம் இல்லாதவர்.",
  },
  {
    house: 6, lagna: "Sagittarius", planetSign: "Taurus", planet: "Mars", page: 193,
    en: "Bears the agony of children, feces deficiency in education, experiences uneasiness in the house of expenditure, suppresses the enemies, is of hot temperament, does not follow modesty",
    ta: "குழந்தைகளின் வேதனையைத் தாங்குவார்; கல்வியில் குறை; செலவு வீட்டில் அமைதியின்மை; எதிரிகளை அடக்குவார்; சூடான மனநிலை; அடக்கத்தைப் பின்பற்றார்.",
  },
  {
    house: 6, lagna: "Sagittarius", planetSign: "Taurus", planet: "Mercury", page: 195,
    en: "Enmity and opposition from the father's house, bears great troubles in business occupation, has some politeness in the house of enemies, feces deficiency in sexual pleasures",
    ta: "தந்தை வீட்டில் பகையும் எதிர்ப்பும்; வணிகத் தொழிலில் பெரும் சிரமம்; எதிரி வீட்டில் சில பணிவு; பாலியல் இன்பத்தில் குறை.",
  },
  {
    house: 6, lagna: "Sagittarius", planetSign: "Taurus", planet: "Jupiter", page: 197,
    en: "Faces obstacles in peace and happiness, gets some cooperation, bears domestic distress, has weakness in wealth, is a clever enemy",
    ta: "அமைதியும் மகிழ்ச்சியும் பெறுவதில் தடைகள்; சில ஒத்துழைப்பு; குடும்பத்தில் துன்பம்; செல்வத்தில் பலவீனம்; சாமர்த்தியமான எதிரி.",
  },
  {
    house: 6, lagna: "Sagittarius", planetSign: "Taurus", planet: "Venus", page: 199,
    en: "Has to face some difficulties in getting income, spends much, is very clever and uses very intricate tactics, is very haughty and clever",
    ta: "வருமானம் பெறுவதில் சில சிரமம்; அதிகம் செலவழிப்பார்; மிகுந்த சாமர்த்தியம், மிக நுட்பமான உபாயங்கள்; மிகுந்த பெருமையும் சாமர்த்தியமும்.",
  },
  {
    house: 6, lagna: "Sagittarius", planetSign: "Taurus", planet: "Saturn", page: 201,
    en: "Weakness in the side of wealth, opposes the brothers and also gets the support of brothers, suppresses the enemies, suppresses diseases and difficulties, some perplexity in the daily routine of hfe, is very brave, self-conceited and restless",
    ta: "செல்வ வகையில் பலவீனம்; சகோதரர்களை எதிர்ப்பார், அதே நேரத்தில் அவர்களின் ஆதரவும் பெறுவார்; எதிரிகளை அடக்குவார்; நோய்களையும் சிரமங்களையும் அடக்குவார்; தினசரி வாழ்வில் சில குழப்பம்; மிகுந்த தைரியம், தன்னைப் பெரிதாக நினைப்பவர், அமைதியின்மை.",
  },
  {
    house: 6, lagna: "Sagittarius", planetSign: "Taurus", planet: "Rahu", page: 203,
    en: "Is very influential and suppresses the enemies, does not care for hindrances and troubles, serves his selfishness",
    ta: "மிகுந்த செல்வாக்குள்ளவர்; எதிரிகளை அடக்குவார்; தடைகளையும் சிரமங்களையும் பொருட்படுத்தார்; சுயநலத்துக்காகச் செயல்படுவார்.",
  },
  {
    house: 6, lagna: "Sagittarius", planetSign: "Taurus", planet: "Ketu", page: 205,
    en: "Is of brave nature, suppresses the enemies, is very self-conceited, labours hard to get victory over opponents, gets control over the opponent and diseases, chalks out secret schemes, does selfish deeds",
    ta: "தைரியமான இயல்பு; எதிரிகளை அடக்குவார்; மிகவும் தன்னம்பிக்கை உள்ளவர்; எதிரிகளை வெல்ல கடுமையாக உழைப்பார்; எதிரிகள், நோய்கள் மீது கட்டுப்பாடு; ரகசியத் திட்டங்கள் தீட்டுவார்; சுயநலச் செயல்கள்.",
  },
  {
    house: 6, lagna: "Capricorn", planetSign: "Gemini", planet: "Sun", page: 211,
    en: "Is very influential and haughty, is dignified in daily life, gets long age, defeats enemies, courageous and is patient",
    ta: "மிகுந்த செல்வாக்குள்ளவர், கர்வமானவர்; தினசரி வாழ்வில் கம்பீரம்; நீண்ட வயது; எதிரிகளை வெல்வார்; தைரியமும் பொறுமையும் உள்ளவர்.",
  },
  {
    house: 6, lagna: "Capricorn", planetSign: "Gemini", planet: "Moon", page: 212,
    en: "Gets hindrances in occupation, faces mental perplexity, bears worries in wife's house, has deficiency in sexual pleasures, spends much to escape the diseases and enemies",
    ta: "தொழிலில் தடைகள்; மனக் குழப்பம்; மனைவி வீட்டில் கவலைகள்; பாலியல் இன்பத்தில் குறை; நோய்களையும் எதிரிகளையும் தவிர்க்க அதிகம் செலவழிப்பார்.",
  },
  {
    house: 6, lagna: "Capricorn", planetSign: "Gemini", planet: "Mars", page: 214,
    en: "Gets the advantage and income through some influential deeds of dependence, unhappiness in mother's house, sets aside the diseases and difficulties, some faith in Dharma, gets the advantage in the side of enemies, spends much",
    ta: "சார்ந்த செல்வாக்கான செயல்களால் ஆதாயமும் வருமானமும்; தாய் வீட்டில் மகிழ்ச்சியின்மை; நோய்களையும் சிரமங்களையும் ஒதுக்குவார்; தர்மத்தில் சில நம்பிக்கை; எதிரிகள் பக்கம் ஆதாயம்; அதிகம் செலவழிப்பார்.",
  },
  {
    house: 6, lagna: "Capricorn", planetSign: "Gemini", planet: "Mercury", page: 216,
    en: "Gets weakness in destiny, always gets some worries and difficulties in the way of the progress of his destiny, gets control over diseases, enemies and troubles, spends much",
    ta: "விதியில் பலவீனம்; விதியின் முன்னேற்றத்தில் எப்போதும் சில கவலைகளும் சிரமங்களும்; நோய்கள், எதிரிகள், தொல்லைகள் மீது கட்டுப்பாடு; அதிகம் செலவழிப்பார்.",
  },
  {
    house: 6, lagna: "Capricorn", planetSign: "Gemini", planet: "Jupiter", page: 218,
    en: "Has worries and dependence in connection with expenditure, faces opposition from brothers, has deficiency in accumulating wealth, faces obstacles in his independence, causes enmity cleverly, works with hidden policies, is of idle nature",
    ta: "செலவு பற்றிய கவலைகளும் சார்பும்; சகோதரர் எதிர்ப்பு; செல்வம் சேர்ப்பதில் குறை; தன் சுதந்திரத்தில் தடைகள்; சாமர்த்தியமாகப் பகை உண்டாக்குவார்; ரகசிய கொள்கைகளுடன் வேலை செய்வார்; சோம்பல் இயல்பு.",
  },
  {
    house: 6, lagna: "Capricorn", planetSign: "Gemini", planet: "Venus", page: 220,
    en: "Enmity from father's house, faces some trouble from children, gets the influence of education, gets some dependence, spends much, defeats the enemies with secret tactics of wisdom, gets control over ] the diseases, faces some opposition from government and society, and is very clever",
    ta: "தந்தை வீட்டில் பகை; குழந்தைகளால் சில தொல்லை; கல்வியின் செல்வாக்கு; சில சார்பு; அதிகம் செலவழிப்பார்; ரகசிய சாமர்த்தியத்தால் எதிரிகளை வெல்வார்; கட்டுப்படுத்தும் ஆற்றல்.",
  },
  {
    house: 6, lagna: "Capricorn", planetSign: "Gemini", planet: "Saturn", page: 222,
    en: "Is very influential and gets victory over enemies, has some worry and uneasiness in the daily routine of life, experiences hindrances in expenditure, gets enmity in the house of brother, has deficiency in accumulating wealth, has deficiency in the handsomeness, is clever and cautious",
    ta: "மிகுந்த செல்வாக்குள்ளவர், எதிரிகளை வெல்வார்; தினசரி வாழ்வில் சில கவலையும் அமைதியின்மையும்; செலவில் தடைகள்; சகோதரர் வீட்டில் பகை; செல்வம் சேர்ப்பதில் குறை; அழகில் குறை; சாமர்த்தியமும் எச்சரிக்கையும்.",
  },
  {
    house: 6, lagna: "Capricorn", planetSign: "Gemini", planet: "Rahu", page: 224,
    en: "Is very influential, defeats the enemy, gets great victory, progresses through diplomacy, wisdom and cleverness, gets the work done very carelessly and with pride, gets control over diseases, is selfish, fearless and haughty",
    ta: "மிகுந்த செல்வாக்குள்ளவர்; எதிரியை வெல்வார்; பெரும் வெற்றி; ராஜதந்திரம், அறிவு, சாமர்த்தியம் மூலம் முன்னேறுவார்; வேலையை மிகக் கவனக்குறைவாகவும் கர்வத்துடனும் செய்வார்; நோய்களின் மீது கட்டுப்பாடு; சுயநலம், தைரியம், கர்வம்.",
  },
  {
    house: 6, lagna: "Capricorn", planetSign: "Gemini", planet: "Ketu", page: 226,
    en: "Causes injury to enemies, gets rid of the diseases and difficulties, is fearless",
    ta: "எதிரிக்குக் காயம் விளைவிப்பார்; நோய்களையும் சிரமங்களையும் நீக்குவார்; அஞ்சாதவர்.",
  },
  {
    house: 6, lagna: "Aquarius", planetSign: "Cancer", planet: "Sun", page: 232,
    en: "Gets influence from the house of wife and maintains it, feces some struggle with wife, bears some hardships in occupation, gains some influence from the line of occupation, manages a business, gets victory over the enemies, has some bitterness in spending",
    ta: "மனைவி வீட்டில் செல்வாக்கைப் பெற்று பராமரிப்பார்; மனைவியுடன் சில போராட்டம்; தொழிலில் சில கஷ்டம்; தொழில் வழியில் சில செல்வாக்கு; வணிகம் நடத்துவார்; எதிரிகளை வெல்வார்; செலவில் சில கசப்பு.",
  },
  {
    house: 6, lagna: "Aquarius", planetSign: "Cancer", planet: "Moon", page: 234,
    en: "Is very careful and cautious in the enemies' side and gets victory, does not care about calamities, spends much, remains happy and carefree, uses influence in expenditure, and is a fatal enemy",
    ta: "எதிரிகளின் பக்கம் மிகவும் கவனமும் எச்சரிக்கையும்; வெற்றி பெறுவார்; இடர்களைப் பொருட்படுத்தார்; அதிகம் செலவழிப்பார்; மகிழ்ச்சியாகவும் கவலையின்றியும் இருப்பார்; செலவில் செல்வாக்கு; ஆபத்தான எதிரி.",
  },
  {
    house: 6, lagna: "Aquarius", planetSign: "Cancer", planet: "Mars", page: 236,
    en: "Is restless and faces opposition with father and brother, possesses some hidden power, kills the enemy deceitfully, spends much, faces hindrances in position, gets respect in foreign places",
    ta: "தந்தை, சகோதரருடன் எதிர்ப்பும் அமைதியின்மையும்; மறைந்த சக்தி உண்டு; எதிரியை ஏமாற்றி அழிப்பார்; அதிகம் செலவழிப்பார்; பதவியில் தடைகள்; அயல்நாடுகளில் மரியாதை பெறுவார்.",
  },
  {
    house: 6, lagna: "Aquarius", planetSign: "Cancer", planet: "Mercury", page: 238,
    en: "Bears loss, feces affliction and distress in the side of children, has deficiency in education, is intellectually worried, uses modesty in the daily routine of life, bears blows on longevity, faces many hindrances and disturbances in life, gets the stomach complaints",
    ta: "இழப்பு, குழந்தைகள் வகையில் துன்பமும் வேதனையும்; கல்வியில் குறை; அறிவு ரீதியாகக் கவலை; அடக்கத்துடன் பேசுவார்.",
  },
  {
    house: 6, lagna: "Aquarius", planetSign: "Cancer", planet: "Jupiter", page: 240,
    en: "Gets huge power of wealth, misuses the wealth, gets gratis-like wealth suddenly, spends in a narrow and wrong manner",
    ta: "மிகுந்த செல்வ வலிமை; செல்வத்தைத் தவறாகப் பயன்படுத்துவார்; திடீரென இலவசம் போன்ற செல்வம் பெறுவார்; குறுகிய, தவறான முறையில் செலவழிப்பார்.",
  },
  {
    house: 6, lagna: "Aquarius", planetSign: "Cancer", planet: "Venus", page: 242,
    en: "Has weakness in destiny, faces opposition from others, finds obstacles in peace and happiness, spends much, suppresses the enemy, gives free medicines of some diseases, and helps to remove the worries of others",
    ta: "விதியில் பலவீனம்; பிறரின் எதிர்ப்பு; மகிழ்ச்சிக்கும் அமைதிக்கும் தடைகள்; அதிகம் செலவழிப்பார்; எதிரியை அடக்குவார்; சில நோய்களுக்கு இலவச மருந்து கொடுப்பார்; பிறரின் கவலைகளை நீக்க உதவுவார்.",
  },
  {
    house: 6, lagna: "Aquarius", planetSign: "Cancer", planet: "Saturn", page: 244,
    en: "Does very influential deeds, gets dignity with some dependence, works very courageously and patiently, faces weakness in brother's house, does not care for the enemies, maintains dignity in the daily routine of life, spends much through tries to control the expenditure, is selfish and not kind",
    ta: "மிகுந்த செல்வாக்குள்ள செயல்கள்; சார்புடன் கூடிய கௌரவம்; மிகுந்த தைரியமும் பொறுமையும்; சகோதரர் வீட்டில் பலவீனம்; எதிரிகளைப் பொருட்படுத்தார்; தினசரி வாழ்வில் கௌரவம்; அதிகம் செலவழிப்பார், ஆனால் செலவைக் கட்டுப்படுத்த முயல்வார்; சுயநலம், இரக்கமின்மை.",
  },
  {
    house: 6, lagna: "Aquarius", planetSign: "Cancer", planet: "Rahu", page: 246,
    en: "Gets influence in the house of enemies, defeats the enemies also, faces some anxiety from enemies' side, is very cautious and clever",
    ta: "எதிரி வீட்டில் செல்வாக்கு; எதிரிகளையும் வெல்வார்; எதிரிகள் பக்கம் சில கவலை; மிகவும் எச்சரிக்கையும் சாமர்த்தியமும்.",
  },
  {
    house: 6, lagna: "Aquarius", planetSign: "Cancer", planet: "Ketu", page: 248,
    en: "Gets victory in the house of enemies, is worried about some troubles, does not care for the enemies, uses secret schemes in suppressing the enemies",
    ta: "எதிரி வீட்டில் வெற்றி; சில தொல்லைகள் பற்றிக் கவலை; எதிரிகளைப் பொருட்படுத்தார்; எதிரிகளை அடக்க ரகசியத் திட்டங்களைப் பயன்படுத்துவார்.",
  },
  {
    house: 6, lagna: "Pisces", planetSign: "Leo", planet: "Sun", page: 254,
    en: "Defeats the enemies, gains great influence, gets grand power of removing troubles and calamities, always maintains pressure on enemies",
    ta: "எதிரிகளை வெல்வார்; பெரும் செல்வாக்கு; இடர்களையும் சிக்கல்களையும் நீக்கும் பெரும் ஆற்றல்; எதிரிகள் மீது எப்போதும் அழுத்தம்.",
  },
  {
    house: 6, lagna: "Pisces", planetSign: "Leo", planet: "Moon", page: 255,
    en: "Faces difficulties and deficiency in education, experiences distress in children's education, gets the work done by thinking very intricately, faces restlessness in enemies' house, spends much",
    ta: "கல்வியில் சிரமமும் குறையும்; குழந்தைகளின் கல்வியில் துன்பம்; மிகவும் சிக்கலாகச் சிந்தித்து வேலை சாதிப்பார்; எதிரி வீட்டில் அமைதியின்மை; அதிகம் செலவழிப்பார்.",
  },
  {
    house: 6, lagna: "Pisces", planetSign: "Leo", planet: "Mars", page: 257,
    en: "Gets good luck through some difficult means, gets success due to intricate tactics, gets victory in the house of enemies, has some enmity in the house of expenditure, being opposed by the family",
    ta: "சிக்கலான வழிகளால் நல்ல அதிர்ஷ்டம்; நுட்பமான உபாயங்களால் வெற்றி; எதிரி வீட்டில் வெற்றி; செலவு வீட்டில் சில பகை; குடும்பத்தால் எதிர்க்கப்படுவார்.",
  },
  {
    house: 6, lagna: "Pisces", planetSign: "Leo", planet: "Mercury", page: 259,
    en: "Faces separation in mother's house, gets some enmity in wife's side, gets some weakness in land and buildings, faces some troubles from the side of occupation, manages the enemy's house peacefully, spends much",
    ta: "தாய் வீட்டில் பிரிவு; மனைவி வீட்டில் சில பகை; நிலம், கட்டிடங்களில் சில பலவீனம்; தொழிலில் சில துன்பம்; எதிரி வீட்டை அமைதியாக நிர்வகிப்பார்; அதிகம் செலவழிப்பார்.",
  },
  {
    house: 6, lagna: "Pisces", planetSign: "Leo", planet: "Jupiter", page: 262,
    en: "Does somewhat dependent but influential deeds, faces some opposition from father's house, gets increased wealth, gets the advantage from government and society, gets the mixture of dependence and independence in a strange manner, tries to remove the wounds of others even when he is engulfed in perplexities himself",
    ta: "சார்புடனும் ஆனால் செல்வாக்குடனும் செயல்படுவார்; தந்தை வீட்டில் சில எதிர்ப்பு; செல்வம் அதிகரிக்கும்; அரசு, சமூகத்தில் ஆதாயம்; சார்பும் சுதந்திரமும் கலந்த நிலை; தானே குழப்பத்தில் இருந்தாலும் பிறரின் காயங்களை ஆற்ற முயல்வார்.",
  },
  {
    house: 6, lagna: "Pisces", planetSign: "Leo", planet: "Venus", page: 264,
    en: "Feels restlessness in his life, gets opposition from brothers, is somewhat dependent in life, gets stomach diseases",
    ta: "வாழ்வில் அமைதியின்மை; சகோதரர் எதிர்ப்பு; வாழ்வில் சிறிது சார்பு; வயிற்று நோய்கள்.",
  },
  {
    house: 6, lagna: "Pisces", planetSign: "Leo", planet: "Saturn", page: 266,
    en: "Gets the strength of expenses and gains, manages the affairs courageously, maintains influence in diurnal occupation and routine of life, creates influence on enemies, has a weak connection with brother Pisces ' 267",
    ta: "செலவிலும் ஆதாயத்திலும் வலிமை; தைரியமாகக் காரியங்களை நிர்வகிப்பார்; தினசரி தொழிலிலும் வாழ்விலும் செல்வாக்கு; எதிரிகள் மீது செல்வாக்கு; சகோதரருடன் பலவீனமான உறவு.",
  },
  {
    house: 6, lagna: "Pisces", planetSign: "Leo", planet: "Rahu", page: 268,
    en: "Gets perplexity from the house of enemies and ruins his foes, gets victory by working very hard, cleverly and patiently in the difficulties and calamities, does not care about diseases, is very selfish and courageous",
    ta: "எதிரி வீட்டில் குழப்பம்; எதிரிகளை அழிப்பார்; இடர்களிலும் சிரமங்களிலும் மிகக் கடினமாகவும் சாமர்த்தியமாகவும் பொறுமையாகவும் உழைத்து வெற்றி பெறுவார்; நோய்களைப் பொருட்படுத்தார்; மிகவும் சுயநலமும் தைரியமும் உள்ளவர்.",
  },
  {
    house: 6, lagna: "Pisces", planetSign: "Leo", planet: "Ketu", page: 270,
    en: "Ruins the house of enemies, labours very hard, works very patiently and courageously though is often disturbed by the enemies and opponents, gets victory over troubles and difficulties, possesses secret strength, is selfish and obstinate",
    ta: "எதிரி வீட்டை அழிப்பார்; மிகக் கடினமாக உழைப்பார்; பொறுமையாகவும் தைரியமாகவும் வேலை செய்வார்; ஆனால் அடிக்கடி எதிரிகளால் தொந்தரவு.",
  },
  {
    house: 7, lagna: "Aries", planetSign: "Libra", planet: "Sun", page: 22,
    en: "Not happy with wife and children, suffers in education, unwise, troubled family life, works to earn more and more, indulges in both right and wrong methods, not happy with sexual life, a man of secrets",
    ta: "மனைவி, குழந்தைகளுடன் மகிழ்ச்சியின்மை; கல்வியில் சிரமம்; அறிவற்றவர்; குடும்ப வாழ்வில் குழப்பம்; மேலும் மேலும் சம்பாதிக்க உழைப்பார்; நேர்மையான, நேர்மையற்ற இரு வழிகளிலும் ஈடுபடுவார்; பாலியல் வாழ்வில் மகிழ்ச்சியின்மை; ரகசியமானவர்.",
  },
  {
    house: 7, lagna: "Aries", planetSign: "Libra", planet: "Moon", page: 23,
    en: "Enjoys family pleasures, gets a good-looking wife, happy with mother, enjoys lands and houses, physically healthy and handsome, enjoys sexual pleasures, very skilful, expert in maintaining family relations and worldly affairs",
    ta: "குடும்ப இன்பங்களை அனுபவிப்பார்; அழகான மனைவி; தாயால் மகிழ்ச்சி; நிலமும் வீடும் அனுபவிப்பார்; உடல் ஆரோக்கியமும் அழகும் உள்ளவர்; இன்பம் அனுபவிப்பார்.",
  },
  {
    house: 7, lagna: "Aries", planetSign: "Libra", planet: "Mars", page: 25,
    en: "Carries duties with great difficulty, troubles with wife and constant clashes in married life, works for the betterment of business, honoured by government and society, gets reputation, cannot improve his wealth in spite of best efforts, deficient in enjoying the sexual life",
    ta: "மிகுந்த சிரமத்துடன் கடமைகளைச் செய்வார்; மனைவியுடன் சிக்கல்களும் தொடர் மோதல்களும்; தொழிலை மேம்படுத்த முயல்வார்; அரசு, சமூகத்தில் மரியாதையும் புகழும்; சிறந்த முயற்சிகளுக்குப் பின்னும் செல்வத்தை உயர்த்த முடியாது; பாலியல் இன்பத்தில் குறை.",
  },
  {
    house: 7, lagna: "Aries", planetSign: "Libra", planet: "Mercury", page: 27,
    en: "Has to work hard, problems in occupation, yet he progresses, not very happy with wife, enjoys sexual pleasures, advances in domestic and worldly affairs, receives help from maternal grandfather",
    ta: "கடினமாக உழைக்க வேண்டும்; தொழிலில் சிக்கல்கள், ஆனாலும் முன்னேறுவார்; மனைவியுடன் அதிக மகிழ்ச்சியில்லை; பாலியல் இன்பம் அனுபவிப்பார்; குடும்ப, உலக விவகாரங்களில் முன்னேறுவார்; தாய்வழி தாத்தாவின் உதவி.",
  },
  {
    house: 7, lagna: "Aries", planetSign: "Libra", planet: "Jupiter", page: 29,
    en: "Successful in daily life, happiness in domestic life, gets a dignified wife, spends humbly, has faith in God and is successful, works energetically, dharmic in outlook",
    ta: "அன்றாட வாழ்வில் வெற்றி; குடும்ப வாழ்வில் மகிழ்ச்சி; கௌரவமான மனைவி; அடக்கமாகச் செலவழிப்பார்; இறைநம்பிக்கை உள்ளவர், வெற்றி பெறுவார்; சுறுசுறுப்பாக வேலை செய்வார்; தர்ம நோக்கு.",
  },
  {
    house: 7, lagna: "Aries", planetSign: "Libra", planet: "Venus", page: 32,
    en: "Earns much wealth and occupies good position, gets a beautiful wife and a rich father-in-law, has good family bondage, enjoys sexual pleasures to the most, clever in earning, much respected and honoured, handsome in appearance",
    ta: "அதிக செல்வம் ஈட்டுவார், நல்ல நிலை; அழகான மனைவியும் செல்வந்தரான மாமனாரும்; குடும்ப உறவுகள் நல்லவை; பாலியல் இன்பத்தை மிகவும் அனுபவிப்பார்; சம்பாதிப்பதில் சாமர்த்தியம்; மிகுந்த மரியாதையும் கௌரவமும்; அழகான தோற்றம்.",
  },
  {
    house: 7, lagna: "Aries", planetSign: "Libra", planet: "Saturn", page: 33,
    en: "Does good business, has to work hard for earnings, feels restless, enjoys sexual pleasures, is proud",
    ta: "நல்ல தொழில்; வருமானத்துக்காக கடினமாக உழைக்க வேண்டும்; அமைதியின்மை; பாலியல் இன்பம் அனுபவிப்பார்; பெருமை.",
  },
  {
    house: 7, lagna: "Aries", planetSign: "Libra", planet: "Rahu", page: 35,
    en: "Problem with wife, manages the house with great difficulty, success in the occupation after undergoing difficulties and problems, sexual dissatisfaction, unauthorised gains from worldly affairs",
    ta: "மனைவியுடன் சிக்கல்; வீட்டை மிகுந்த சிரமத்துடன் நடத்துவார்; சிரமங்களுக்குப் பின் தொழிலில் வெற்றி; பாலியல் அதிருப்தி; உலக விவகாரங்களில் அனுமதியற்ற ஆதாயம்.",
  },
  {
    house: 7, lagna: "Aries", planetSign: "Libra", planet: "Ketu", page: 37,
    en: "Loses wife or is sensually and sexually unhappy with her, finds problems in occupation, however faces everything with care and finally gets success",
    ta: "மனைவியை இழப்பார் அல்லது அவருடன் பாலியல், உணர்வு ரீதியாக மகிழ்ச்சியின்மை; தொழிலில் சிக்கல்; ஆனாலும் கவனத்துடன் அனைத்தையும் சந்தித்து இறுதியில் வெற்றி பெறுவார்.",
  },
  {
    house: 7, lagna: "Taurus", planetSign: "Scorpio", planet: "Sun", page: 43,
    en: "Happiness from mother and from family and also wife, gets some bodily unhappiness",
    ta: "தாயாலும் குடும்பத்தாலும் மனைவியாலும் மகிழ்ச்சி; சில உடல் அசௌகரியம்.",
  },
  {
    house: 7, lagna: "Taurus", planetSign: "Scorpio", planet: "Moon", page: 44,
    en: "Not very happy with wife, not much help from brothers and sisters, not happy in occupation and also in sexual pleasure",
    ta: "மனைவியுடன் அதிக மகிழ்ச்சியில்லை; சகோதர சகோதரிகளின் உதவி குறைவு; தொழிலிலும் பாலியல் இன்பத்திலும் மகிழ்ச்சியில்லை.",
  },
  {
    house: 7, lagna: "Taurus", planetSign: "Scorpio", planet: "Mars", page: 46,
    en: "Dignified expenditure, weakness in the dignity of family, mixed relations with wife, weakness in sexual pleasures, loss in wealth, hard-working",
    ta: "கௌரவமான செலவு; குடும்ப மதிப்பில் குறை; மனைவியுடன் கலந்த உறவு; பாலியல் இன்பத்தில் குறை; பண இழப்பு; கடின உழைப்பாளி.",
  },
  {
    house: 7, lagna: "Taurus", planetSign: "Scorpio", planet: "Mercury", page: 48,
    en: "Clever in earning money, support from children, slight unhappiness with wife, more sexual pleasures, interested in getting more wealth",
    ta: "பணம் சம்பாதிப்பதில் சாமர்த்தியம்; பிள்ளைகளின் ஆதரவு; மனைவியுடன் சிறு அதிருப்தி; அதிக பாலியல் இன்பம்; மேலும் செல்வம் பெற ஆர்வம்.",
  },
  {
    house: 7, lagna: "Taurus", planetSign: "Scorpio", planet: "Jupiter", page: 50,
    en: "Keeps pride and nobleness, mixed relations with regard to wife, gets gains on the daily occupation, help from foreign countries, does energetic deeds, has support from brothers and sisters, uses better devices on the worldly deeds of getting gains",
    ta: "பெருமையும் உயர்குணமும் காப்பார்; மனைவி வகையில் கலந்த உறவு; தினசரி தொழிலில் ஆதாயம்; வெளிநாடுகளிலிருந்து உதவி; ஆற்றல் மிக்க செயல்கள்; உடன்பிறப்புகளின் ஆதரவு; ஆதாயத்துக்கான சிறந்த உபாயங்கள்.",
  },
  {
    house: 7, lagna: "Taurus", planetSign: "Scorpio", planet: "Venus", page: 53,
    en: "Has a handsome body, unauthorised gains in the house of wife, indulges in sexual pleasures, some problem with wife, works diligently in the house of occupation",
    ta: "அழகான உடல்; மனைவி வீட்டில் அனுமதியற்ற ஆதாயம்; பாலியல் இன்பத்தில் ஈடுபாடு; மனைவியுடன் சில சிக்கல்; தொழிலில் கடினமாக உழைப்பார்.",
  },
  {
    house: 7, lagna: "Taurus", planetSign: "Scorpio", planet: "Saturn", page: 55,
    en: "Fortunate, uneasiness in family in spite of being fortunate, not very religious, unhappy with mother, feels unhappy, gains from government and society",
    ta: "அதிர்ஷ்டசாலி, ஆனாலும் குடும்பத்தில் அமைதியின்மை; அதிகம் மத நாட்டமில்லை; தாயுடன் அதிருப்தி; மனத்தில் துன்பம்; அரசு, சமூகத்தில் ஆதாயம்.",
  },
  {
    house: 7, lagna: "Taurus", planetSign: "Scorpio", planet: "Rahu", page: 56,
    en: "Distress in the house of wife, distress and deficiency in the side of sexual pleasures, loss in father-in-law house, works with troubles in the place of occupation, many troubles in daily routine and in the family, has special advice to get some sexual pleasures, and is selfish",
    ta: "மனைவி வீட்டில் துன்பம்; பாலியல் இன்பத்தில் துன்பமும் குறையும்; மாமனார் வீட்டில் இழப்பு; தொழில் இடத்தில் சிரமத்துடன் வேலை; தினசரி வாழ்விலும் குடும்பத்திலும் பல தொல்லைகள்; பாலியல் இன்பத்துக்காக சிறப்பு ஆலோசனை; சுயநலம்.",
  },
  {
    house: 7, lagna: "Taurus", planetSign: "Scorpio", planet: "Ketu", page: 58,
    en: "Loss from wife and deficiency and troubles in the area of sexual pleasures, secret associations, final success in occupation after undergoing a lot of troubles and problems",
    ta: "மனைவியால் இழப்பு; பாலியல் இன்பத்தில் குறையும் தொல்லையும்; ரகசியத் தொடர்புகள்; பல சிரமங்களுக்குப் பின் தொழிலில் இறுதி வெற்றி.",
  },
  {
    house: 7, lagna: "Gemini", planetSign: "Sagittarius", planet: "Sun", page: 63,
    en: "Huge influence in the side of wife, gets progress after marriage, great power of sexual pleasures, gets the support of brothers and sisters",
    ta: "மனைவி வகையில் பெரும் செல்வாக்கு; திருமணத்துக்குப் பின் முன்னேற்றம்; பாலியல் இன்பத்தில் பெரும் ஆற்றல்; உடன்பிறப்புகளின் ஆதரவு.",
  },
  {
    house: 7, lagna: "Gemini", planetSign: "Sagittarius", planet: "Moon", page: 64,
    en: "Earns wealth from daily occupation, rich mind in the occupation, gets great honour and dignity, union in the house of wife, highly sexual, a happy fellow",
    ta: "தினசரி தொழிலில் செல்வம் ஈட்டுவார்; தொழிலில் வளமான மனம்; பெரும் மரியாதையும் கௌரவமும்; மனைவி வீட்டில் இணைப்பு; பாலியல் ஆர்வம் மிகுதி; மகிழ்ச்சியான மனிதர்.",
  },
  {
    house: 7, lagna: "Gemini", planetSign: "Sagittarius", planet: "Mars", page: 67,
    en: "Gain in wealth through very hard labour in daily occupation, gets some gains from the government and society, some enmity, gains the influence from the house of father, some deficiency in the family, gets some disease in connection with sexual pleasures",
    ta: "தினசரி தொழிலில் மிகுந்த உழைப்பால் வருமானம்; அரசு, சமூகத்தில் சில ஆதாயம்; சில பகை; தந்தை வீட்டில் செல்வாக்கு; குடும்பத்தில் சில குறை; பாலியல் இன்பம் தொடர்பாக சில நோய்.",
  },
  {
    house: 7, lagna: "Gemini", planetSign: "Sagittarius", planet: "Mercury", page: 68,
    en: "Happy with occupation, happy with wife, has great desires for spiritual progress, gets greatest happiness in sexual life and pleasures and has self-pride",
    ta: "தொழிலில் மகிழ்ச்சி; மனைவியுடன் மகிழ்ச்சி; ஆன்மிக முன்னேற்றத்தில் பெரும் விருப்பம்; பாலியல் வாழ்விலும் இன்பங்களிலும் மிகுந்த மகிழ்ச்சி; தன்மானமுள்ளவர்.",
  },
  {
    house: 7, lagna: "Gemini", planetSign: "Sagittarius", planet: "Jupiter", page: 71,
    en: "Daily occupation of the deeds relating to the general public, gets much respect and progress in the house of business occupation, gains from government and society, help from father and wife, also from brothers and sisters, is passionate, enthusiastic and very fortunate",
    ta: "பொது மக்களுடன் தொடர்புடைய தினசரி தொழில்; தொழில் வீட்டில் மிகுந்த மரியாதையும் முன்னேற்றமும்; அரசு, சமூகத்தில் ஆதாயம்; தந்தை, மனைவி, உடன்பிறப்புகளின் உதவி; ஆர்வமும் உற்சாகமும்; மிக அதிர்ஷ்டசாலி.",
  },
  {
    house: 7, lagna: "Gemini", planetSign: "Sagittarius", planet: "Venus", page: 72,
    en: "Gets good strength in daily occupation, some weakness in the side of children, some worries from wife side, gets sexual pleasures, spends heavily on family and wife",
    ta: "தினசரி தொழிலில் நல்ல வலிமை; குழந்தைகள் வகையில் சிறு குறை; மனைவி வகையில் சில கவலைகள்; பாலியல் இன்பம்; குடும்பத்துக்கும் மனைவிக்கும் அதிகம் செலவழிப்பார்.",
  },
  {
    house: 7, lagna: "Gemini", planetSign: "Sagittarius", planet: "Saturn", page: 74,
    en: "Progress in the daily life of occupation, gets fame in the progress of occupation, acquires more happiness and sexual pleasures, good longevity, and fortunate",
    ta: "தொழிலில் முன்னேற்றம்; தொழில் வளர்ச்சியில் புகழ்; அதிக மகிழ்ச்சியும் பாலியல் இன்பமும்; நல்ல ஆயுள்; அதிர்ஷ்டசாலி.",
  },
  {
    house: 7, lagna: "Gemini", planetSign: "Sagittarius", planet: "Rahu", page: 76,
    en: "Loss and difficulties in the house of wife, deep worries in daily occupation, deficiency and sorrows in the house of sexual pleasures though in a somewhat secret and improper way, lazy",
    ta: "மனைவி வீட்டில் இழப்பும் சிரமமும்; தினசரி தொழிலில் ஆழ்ந்த கவலைகள்; பாலியல் இன்பத்தில் குறையும் துயரமும், ஆனால் ரகசியமாகவும் தவறான வழியிலும்; சோம்பல்.",
  },
  {
    house: 7, lagna: "Gemini", planetSign: "Sagittarius", planet: "Ketu", page: 78,
    en: "Union of some special strength in wife, gets excess sexual pleasures, does great deeds in the house of daily occupation, gets some deficiency of peace in the management of domestic affairs",
    ta: "மனைவியில் சில சிறப்பு வலிமை; மிகுந்த பாலியல் இன்பம்; தினசரி தொழிலில் பெரும் செயல்கள்; குடும்ப நிர்வாகத்தில் சில அமைதிக் குறை.",
  },
  {
    house: 7, lagna: "Cancer", planetSign: "Capricorn", planet: "Sun", page: 83,
    en: "Pursues daily occupation with some difficulties of wealth, gets wealth with difficulty, experiences some hardships in the house of wife, is supposed to be rich, gets respectable job, gets some dullness and bondage in the sexual pleasures",
    ta: "மனைவி வகையில் சில சிரமங்கள்; தொழிலில் பொருள் சிரமத்துடன் தினசரி வேலை; பணம் கடினமாகக் கிடைக்கும்; செல்வந்தர் எனக் கருதப்படுவார்; மரியாதைக்குரிய வேலை கிடைக்கும்; பாலியல் இன்பத்தில் மந்தமும் கட்டுப்பாடும்.",
  },
  {
    house: 7, lagna: "Cancer", planetSign: "Capricorn", planet: "Moon", page: 86,
    en: "Gets some admiration, conducts the day-to-day affairs very interestedly, is passionate, wants and enjoys sexual pleasures, gets beautiful wife, gives more importance to wife, gets the work done under pressure, enjoys the pleasures of his occupation due to strong will-power, suffers great troubles, goes to the foreign countries, suffers in health of the body, always careful to get wealth",
    ta: "சிலரின் பாராட்டு; தினசரி வேலைகளை ஆர்வத்துடன் நடத்துவார்; ஆசைமிக்கவர்; பாலியல் இன்பத்தை விரும்பி அனுபவிப்பார்; அழகான மனைவி; மனைவிக்கு அதிக முக்கியத்துவம்; அழுத்தத்தின்கீழ் வேலையை முடிப்பார்; மன உறுதியால் தொழில் இன்பம்; பெரும் துன்பங்கள்; வெளிநாடு செல்வார்; உடல் நலக் குறை; செல்வம் சேர்ப்பதில் எப்போதும் கவனம்.",
  },
  {
    house: 7, lagna: "Cancer", planetSign: "Capricorn", planet: "Mars", page: 88,
    en: "Does splendid occupation, gets raise through his wisdom and gets good luck of wife, gets influential and majestic wife, gets respect of government and society, some weakness in his body, gets sexual pleasures, gets the help of father and son, respected and influential",
    ta: "சிறந்த தொழில்; தன் அறிவால் உயர்வு; மனைவியின் நல்ல அதிர்ஷ்டம்; செல்வாக்கும் கம்பீரமும் உள்ள மனைவி; அரசு, சமூகத்தில் மரியாதை; உடலில் சில பலவீனம்; பாலியல் இன்பம்; தந்தை, மகன் உதவி; மரியாதைக்குரியவர், செல்வாக்குள்ளவர்.",
  },
  {
    house: 7, lagna: "Cancer", planetSign: "Capricorn", planet: "Mercury", page: 89,
    en: "Gets power of expenditure due to his labour, gets the happiness of sister more than that of a brother, power and courage also in the house of wife, mixture of power and weakness in the occupation and gets success in the worldly affairs",
    ta: "உழைப்பால் செலவை நிர்வகிக்கும் ஆற்றல்; சகோதரியின் மகிழ்ச்சி சகோதரரைவிட அதிகம்; மனைவி வீட்டில் வலிமையும் தைரியமும்; தொழிலில் வலிமையும் பலவீனமும் கலந்து; உலக விவகாரங்களில் வெற்றி.",
  },
  {
    house: 7, lagna: "Cancer", planetSign: "Capricorn", planet: "Jupiter", page: 92,
    en: "Perplexity and hardship in connection with the rise of destiny and marriage, conducts the daily occupation calmly, has brothers and sisters, commits mistakes in rearing up Dharma, some restlessness and deficiency in the side of wife and sexual pleasures",
    ta: "திருமணம், விதியின் உயர்வு தொடர்பான குழப்பமும் சிரமமும்; தினசரி தொழிலை அமைதியாக நடத்துவார்; சகோதர சகோதரிகள் உண்டு; தர்மத்தை வளர்ப்பதில் தவறுகள்; மனைவி, பாலியல் இன்பத்தில் சில அமைதியின்மையும் குறையும்.",
  },
  {
    house: 7, lagna: "Cancer", planetSign: "Capricorn", planet: "Venus", page: 93,
    en: "Pursues daily occupation happily, happiness with wife, gets the grand advantage of sexual pleasures, gets success peacefully, and is very clever",
    ta: "தினசரி தொழிலை மகிழ்ச்சியுடன் நடத்துவார்; மனைவியுடன் மகிழ்ச்சி; பாலியல் இன்பத்தில் பெரும் வாய்ப்பு; அமைதியாக வெற்றி பெறுவார்; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 7, lagna: "Cancer", planetSign: "Capricorn", planet: "Saturn", page: 96,
    en: "Follows the very laborious occupation daily, gets the influence in the house of wife and occupation, good longevity, some changes in the side of sexual pleasures, gets some trouble in his physique, selfish, increases the land and property and happiness, injures Dharma and is passionate",
    ta: "தினசரி மிகக் கடினமான தொழில்; மனைவி, தொழில் வீட்டில் செல்வாக்கு; நல்ல ஆயுள்; பாலியல் இன்பத்தில் சில மாற்றங்கள்; உடலில் சில தொல்லை; சுயநலம்; நிலமும் சொத்தும் மகிழ்ச்சியும் அதிகரிக்கும்; தர்மத்துக்குக் கேடு; ஆர்வமிக்கவர்.",
  },
  {
    house: 7, lagna: "Cancer", planetSign: "Capricorn", planet: "Rahu", page: 97,
    en: "Some trouble in the house of wife, becomes nervous, fatal losses in the house of occupation, gets success through hard work, deficiency in the side of sexual pleasures and daily affairs, is selfish",
    ta: "மனைவி வீட்டில் சில தொல்லை; நரம்புத் தளர்ச்சி; தொழில் வீட்டில் பெரும் இழப்பு; கடின உழைப்பால் வெற்றி; பாலியல் இன்பத்திலும் தினசரி விவகாரங்களிலும் குறை; சுயநலம்.",
  },
  {
    house: 7, lagna: "Cancer", planetSign: "Capricorn", planet: "Ketu", page: 99,
    en: "Distress in the house of wife, difficulties in progress for his occupation, does not feel nervousness even on getting shocks, derives helplessness in his occupation but in the end gets permanent firmness, secret powers in the house of sexual pleasures, not satisfied with one wife",
    ta: "மனைவி வீட்டில் துன்பம்; தொழில் முன்னேற்றத்தில் சிரமங்கள்; அதிர்ச்சிகளிலும் பதற்றம் அடையார்; தொழிலில் சோர்வு, ஆனால் இறுதியில் நிலையான உறுதி; பாலியல் இன்பத்தில் மறை ஆற்றல்; ஒரு மனைவியில் திருப்தியில்லாதவர்.",
  },
  {
    house: 7, lagna: "Leo", planetSign: "Aquarius", planet: "Sun", page: 105,
    en: "A bit unhappy with wife, undertakes influential business, is dissatisfied in the side of sexual pleasures, and is restless",
    ta: "மனைவியுடன் சற்று அதிருப்தி; செல்வாக்கான தொழில் நடத்துவார்; பாலியல் இன்பத்தில் அதிருப்தி; அமைதியின்மை.",
  },
  {
    house: 7, lagna: "Leo", planetSign: "Aquarius", planet: "Moon", page: 106,
    en: "Loss and weakness in the house of wife and family, gets loss in the local occupation, gets weakness in the sexual and other pleasures, is somewhat anxious and commits sins, weakness in everyday tasks",
    ta: "மனைவி, குடும்ப வீட்டில் இழப்பும் பலவீனமும்; உள்ளூர் தொழிலில் இழப்பு; பாலியல் மற்றும் பிற இன்பங்களில் பலவீனம்; சிறிது கவலையும் பாவச் செயலும்; தினசரி பணிகளில் பலவீனம்.",
  },
  {
    house: 7, lagna: "Leo", planetSign: "Aquarius", planet: "Mars", page: 109,
    en: "Dullness in the side of mother and wife, some dissatisfaction in the house of domestic happiness, success in the house of daily occupation",
    ta: "தாய், மனைவி வகையில் மந்தம்; உள்நாட்டு மகிழ்ச்சியில் சில அதிருப்தி; தினசரி தொழிலில் வெற்றி.",
  },
  {
    house: 7, lagna: "Leo", planetSign: "Aquarius", planet: "Mercury", page: 110,
    en: "Great success and rise in daily occupation, earns much wealth and gains from the father-in-law's family, great pleasure in the house of wife and family, gets great advantage of sexual pleasures, pursues beautifully the decent occupation",
    ta: "தொழிலில் பெரும் வெற்றியும் உயர்வும்; பெரும் செல்வம் ஈட்டுவார்; மாமனார் குடும்பத்தால் ஆதாயம்; மனைவியுடன் பெரும் மகிழ்ச்சி; குடும்பத்தில் பெரும் மகிழ்ச்சி; பாலியல் இன்பத்தில் பெரும் ஆதாயம்; கண்ணியமான தொழிலை அழகாகச் செய்வார்.",
  },
  {
    house: 7, lagna: "Leo", planetSign: "Aquarius", planet: "Jupiter", page: 112,
    en: "Perplexity in the house of wife, bears great hardships and hindrances in acquiring power of managing business, some trouble in the house of education and children, some insipidness with regard to brothers and sisters, somewhat respectable",
    ta: "மனைவி வீட்டில் குழப்பம்; தொழில் நிர்வாக ஆற்றலைப் பெறுவதில் பெரும் சிரமமும் தடைகளும்; கல்வி, குழந்தைகள் வகையில் சில தொல்லை; உடன்பிறப்புகள் வகையில் சுவையின்மை; ஓரளவு மதிப்புக்குரியவர்.",
  },
  {
    house: 7, lagna: "Leo", planetSign: "Aquarius", planet: "Venus", page: 114,
    en: "Gets a great power of daily and permanent trade and occupation, gets the power of brothers and sisters and in the house of father, great respect and influence in connection with government and society, gets a great power and grandeur in the house of wife and family, gets great power of sexual pleasure, is very skilled, courageous, clever and gets the power of vigour",
    ta: "தினசரி, நிரந்தர வர்த்தகத்தில் பெரும் ஆற்றல்; சகோதர சகோதரிகள், தந்தை வீட்டில் ஆற்றல்; அரசு, சமூகத்தில் பெரும் மரியாதையும் செல்வாக்கும்.",
  },
  {
    house: 7, lagna: "Leo", planetSign: "Aquarius", planet: "Saturn", page: 117,
    en: "Gets the stable power of daily occupation through hard labour and tactics, gets the grand power of sexual passions, some enmity in the house of wife, injures Dharma, gets some diseases in the body, great hindrance in the house of mother and happiness",
    ta: "கடின உழைப்பாலும் தந்திரத்தாலும் நிலையான தொழில் வலிமை; பாலியல் ஆர்வத்தின் பெரும் வலிமை; மனைவி வகையில் சில பகை; தர்மத்துக்குக் கேடு; உடலில் சில நோய்; தாய், மகிழ்ச்சி வீட்டில் பெரும் தடை.",
  },
  {
    house: 7, lagna: "Leo", planetSign: "Aquarius", planet: "Rahu", page: 118,
    en: "Restless in the house of mother, bears great perplexity in the daily occupation, some defect relating to sexual organs, desires to satisfy his unsatisfied passions, uses secret schemes in sexual pleasure, secret devices in the line of occupation, gets some strength at the end",
    ta: "தாய் வீட்டில் அமைதியின்மை; தினசரி தொழிலில் பெரும் குழப்பம்; பாலியல் உறுப்புகளில் சில குறை; விரும்பியதை நிறைவேற்ற ஆசை.",
  },
  {
    house: 7, lagna: "Leo", planetSign: "Aquarius", planet: "Ketu", page: 120,
    en: "Loss in the house of wife, gets the special powers, enjoys sexual pleasures, puts in hard labour in the house of everyday occupation",
    ta: "மனைவி வீட்டில் இழப்பு; சிறப்பு ஆற்றல்கள்; பாலியல் இன்பம் அனுபவிப்பார்; தினசரி தொழிலில் கடின உழைப்பு.",
  },
  {
    house: 7, lagna: "Virgo", planetSign: "Pisces", planet: "Sun", page: 126,
    en: "Manages his expenditure from the daily occupation, gets some weakness in the house of occupation, gets some delay and restlessness in the family, happiness, restlessness due to expenditure, is of emaciated figure",
    ta: "தினசரி தொழிலிலிருந்து செலவை நிர்வகிப்பார்; தொழில் வீட்டில் சில பலவீனம்; குடும்பத்தில் சில தாமதமும் அமைதியின்மையும்; செலவால் அமைதியின்மை; உடல் மெலிந்தவர்.",
  },
  {
    house: 7, lagna: "Virgo", planetSign: "Pisces", planet: "Moon", page: 128,
    en: "Gains heavily in the daily occupation, gets a beautiful wife, enjoys sexual pleasures splendidly, is mutually engaged only in the presence of the relation of the family, is handsome, gains from father-in-law's house, gets success in every worldly affairs, and is clever",
    ta: "தினசரி தொழிலில் பெரும் ஆதாயம்; அழகான மனைவி; பாலியல் இன்பத்தை சிறப்பாக அனுபவிப்பார்; குடும்ப உறவினர்களின் முன்னிலையில் மட்டுமே இணக்கம்; அழகானவர்; மாமனார் வீட்டில் ஆதாயம்; எல்லா உலக விவகாரங்களிலும் வெற்றி; சாமர்த்தியமானவர்.",
  },
  {
    house: 7, lagna: "Virgo", planetSign: "Pisces", planet: "Mars", page: 129,
    en: "Bears distress in the house of wife, gets success in industry, worries on the side of occupation, plans secret policies for increase in the case of gains of occupation, some trouble and distress in the house of father, gets some deficiency in the house of brothers and sisters",
    ta: "மனைவி வீட்டில் துன்பம்; தொழிலில் வெற்றி; தொழில் வகையில் கவலைகள்; வருமானத்தை உயர்த்த மறைமுகக் கொள்கைகள் திட்டமிடுவார்.",
  },
  {
    house: 7, lagna: "Virgo", planetSign: "Pisces", planet: "Mercury", page: 132,
    en: "Gets some worries in the family, some deficiency in the house of father and wife, gets some weakness in the body, is able to safeguard the honour, some deficiency in his influence in matters relating to sexual pleasures, is very industrious on the side of occupation, is engulfed in worries",
    ta: "குடும்பத்தில் சில கவலைகள்; தந்தை, மனைவி வீட்டில் சில குறை; உடலில் சில பலவீனம்; மானத்தைக் காப்பார்; பாலியல் இன்பத்தில் செல்வாக்கில் சில குறை; தொழில் வகையில் மிகுந்த உழைப்பாளி; கவலைகளில் மூழ்கியிருப்பார்.",
  },
  {
    house: 7, lagna: "Virgo", planetSign: "Pisces", planet: "Jupiter", page: 134,
    en: "Gets great pleasures, does very dignified occupation, gets honour and happiness by the daily occupation deeds, pleasures increase after marriage, experiences peace in married life, has brothers and sisters, success due to good strength",
    ta: "பெரும் மகிழ்ச்சி; மிக கௌரவமான தொழில்; தினசரி தொழில் செயல்களால் மரியாதையும் மகிழ்ச்சியும்; திருமணத்துக்குப் பின் இன்பம் அதிகரிக்கும்; திருமண வாழ்வில் அமைதி; உடன்பிறப்புகள் உண்டு; நல்ல வலிமையால் வெற்றி.",
  },
  {
    house: 7, lagna: "Virgo", planetSign: "Pisces", planet: "Venus", page: 136,
    en: "Is quite fortunate, gets the power of enjoying sexual pleasure of very high standard, earns huge wealth, conducts a big daily occupation, has a beautiful wife, gets a rich father-in-law Virgo ' 137",
    ta: "மிக அதிர்ஷ்டசாலி; மிக உயர்தரமான பாலியல் இன்பம் அனுபவிப்பார்; பெரும் செல்வம் ஈட்டுவார்; பெரிய தினசரி தொழில்; அழகான மனைவி; செல்வந்தரான மாமனார்.",
  },
  {
    house: 7, lagna: "Virgo", planetSign: "Pisces", planet: "Saturn", page: 139,
    en: "Enjoys the sexual pleasures in many ways and distress on the side of wife and children, gets the mother like help from some other lady in connection with happiness, progress in occupation, gathers much education he needs and criticises Dharma",
    ta: "மனைவி, குழந்தைகள் வகையில் துன்பத்துடன் பல வழிகளில் பாலியல் இன்பம்; மனைவியைப் போன்ற வேறு பெண்ணின் உதவி மகிழ்ச்சி வகையில்; தொழிலில் முன்னேற்றம்; தேவையான கல்வியைப் பெறுவார்; தர்மத்தை விமர்சிப்பார்.",
  },
  {
    house: 7, lagna: "Virgo", planetSign: "Pisces", planet: "Rahu", page: 140,
    en: "Some distress on the side of wife, is worried in connection with family, bears great troubles and worries in occupation, uses intricate cleverness in managing the occupation, sometimes great troubles in occupation, uses hidden power in occupation",
    ta: "மனைவி வகையில் சில துன்பம்; குடும்பம் பற்றிய கவலை; தொழிலில் பெரும் துன்பமும் கவலையும்; தொழிலை நிர்வகிக்க நுட்பமான சாமர்த்தியம்; சில நேரம் தொழிலில் பெரும் சிரமங்கள்; தொழிலில் மறைந்த ஆற்றல்.",
  },
  {
    house: 7, lagna: "Virgo", planetSign: "Pisces", planet: "Ketu", page: 142,
    en: "Finds distress in the side of wife, gets difficulties in running the family, works with great difficulty and through hard labour in the side of occupation, gets some keenness in connection with sexual pleasures, but experiences some incomplete pleasures Virgo m 143",
    ta: "மனைவி வகையில் துன்பம்; குடும்பம் நடத்துவதில் சிரமங்கள்; தொழில் வகையில் பெரும் சிரமத்துடனும் கடின உழைப்புடனும் வேலை; பாலியல் இன்பத்தில் சில ஆர்வம், ஆனால் சில முழுமையற்ற இன்பங்கள்.",
  },
  {
    house: 7, lagna: "Libra", planetSign: "Aries", planet: "Sun", page: 147,
    en: "Pursues influential occupation, gets the gains from the wife, gets a beautiful wife, gets special sexual pleasures on the side of wife, gets huge influence in the house of wife, feels physically fatigued due to excess of work or due to peculiarity of income, feels some weakness due to excess sexual pleasures, is industrious",
    ta: "செல்வாக்கான தொழில்; மனைவியால் ஆதாயம்; அழகான மனைவி; மனைவி வகையில் சிறப்பு பாலியல் இன்பம்; மனைவி வீட்டில் பெரும் செல்வாக்கு; அதிக வேலை அல்லது வருமானத்தின் தனித்தன்மையால் உடல் சோர்வு; அதிக பாலியல் இன்பத்தால் சில பலவீனம்; உழைப்பாளி.",
  },
  {
    house: 7, lagna: "Libra", planetSign: "Aries", planet: "Moon", page: 148,
    en: "Gets a pretty wife and enjoys the sexual pleasures, gets the progress of honour alter the marriage, is clever and a skilful worker, gets the success in occupation, mentally busy in sexual affairs, does good business",
    ta: "அழகான மனைவியும் பாலியல் இன்பமும்; திருமணத்துக்குப் பின் மரியாதை முன்னேற்றம்; சாமர்த்தியமும் திறமையும் உள்ள வேலையாள்; தொழிலில் வெற்றி; பாலியல் விவகாரங்களில் மனம் ஈடுபட்டிருக்கும்; நல்ல வணிகம்.",
  },
  {
    house: 7, lagna: "Libra", planetSign: "Aries", planet: "Mars", page: 151,
    en: "Earns much wealth, supposed to be respectable, gets iron-minded wife, some deficiency in the house of father and government, weakness in occupation",
    ta: "மிகுந்த செல்வம் ஈட்டுவார்; மதிப்புக்குரியவர்; இரும்பு மனம் கொண்ட மனைவி; தந்தை, அரசு வகையில் சில குறை; தொழிலில் பலவீனம்.",
  },
  {
    house: 7, lagna: "Libra", planetSign: "Aries", planet: "Mercury", page: 152,
    en: "Is very fortunate and enjoys the pleasures of family, gets progress from occupation after marriage, gets control over the expenditure, gets good and decent pleasures with some deficiency in the house of wife, gets good means of sexual pleasures, gets decent progress in occupation with some success",
    ta: "மிக அதிர்ஷ்டசாலி; குடும்ப இன்பங்களை அனுபவிப்பார்; திருமணத்துக்குப் பின் தொழிலில் முன்னேற்றம்; செலவைக் கட்டுப்படுத்துவார்; வீட்டில் சில குறையுடன் நல்ல, அழகான இன்பங்கள்.",
  },
  {
    house: 7, lagna: "Libra", planetSign: "Aries", planet: "Jupiter", page: 154,
    en: "Gets the daily occupation, is a successful industrial man, great power through wife, gets the best cooperation of the brothers, defeats the enemies, gets victory due to will-power",
    ta: "தினசரி தொழில்; தொழிலில் வெற்றிகரமான மனிதர்; மனைவி மூலம் பெரும் ஆற்றல்; சகோதரர்களின் சிறந்த ஒத்துழைப்பு; எதிரிகளை வெல்வார்; மன உறுதியால் வெற்றி.",
  },
  {
    house: 7, lagna: "Libra", planetSign: "Aries", planet: "Venus", page: 156,
    en: "Manages his daily occupation through great special powers, is of good age and handsome, self-sighted, diplomatic, very clever in getting his work completed, some distress in the family connected with wife, self-centred, seeks sexual favours",
    ta: "தினசரி தொழிலை சிறப்பு ஆற்றல்களால் நடத்துவார்; நல்ல வயதும் அழகும்; தன்னைப் பார்ப்பவர், இராஜதந்திரி; தன் வேலையை மிகச் சாமர்த்தியமாக முடிப்பார்; மனைவி வகையில் குடும்பத்தில் சில துன்பம்; தன்னையே மையமாகக் கொண்டவர்; பாலியல் ஆதரவைத் தேடுவார்.",
  },
  {
    house: 7, lagna: "Libra", planetSign: "Aries", planet: "Saturn", page: 159,
    en: "Feels distress in the house of wife, loss in the house of father, loss in domestic peace, happiness from education after experiencing some troubles in acquiring it, distress in daily occupation",
    ta: "மனைவி வீட்டில் துன்பம்; தந்தை வீட்டில் இழப்பு; குடும்ப அமைதியில் இழப்பு; கல்வி பெறுவதில் சில துன்பங்களுக்குப் பின் மகிழ்ச்சி; தினசரி தொழிலில் துன்பம்.",
  },
  {
    house: 7, lagna: "Libra", planetSign: "Aries", planet: "Rahu", page: 160,
    en: "Some distress in the side of wife, bears worries in the side of daily occupation, gets some disorder in organs",
    ta: "மனைவி வகையில் சில துன்பம்; தினசரி தொழில் பற்றிய கவலைகள்; உறுப்புகளில் சில கோளாறு.",
  },
  {
    house: 7, lagna: "Libra", planetSign: "Aries", planet: "Ketu", page: 162,
    en: "Loss and distress in the house of wife, gets anxieties in family, gets loss and worries in daily occupation, feces hindrances and happiness in connection with occupation",
    ta: "மனைவி வீட்டில் இழப்பும் துன்பமும்; குடும்பத்தில் கவலைகள்; தினசரி தொழிலில் இழப்பும் கவலைகளும்; தொழிலில் தடைகளும் மகிழ்ச்சியும்.",
  },
  {
    house: 7, lagna: "Scorpio", planetSign: "Taurus", planet: "Sun", page: 168,
    en: "Does the occupation in a majestic way, gets some dignity in occupation even on having some difficulties, gets the honour with some enmity in the house of wife, gets a temperamental wife, some deficiency in the side of wife and sexual pleasures, is clever",
    ta: "தொழிலை கம்பீரமாக நடத்துவார்; சிரமங்களுக்கு நடுவிலும் தொழிலில் சில கௌரவம்; மனைவி வீட்டில் சில பகையுடன் மரியாதை; மனோபாவம் நிறைந்த மனைவி; மனைவி, பாலியல் இன்பத்தில் சில குறை; சாமர்த்தியமானவர்.",
  },
  {
    house: 7, lagna: "Scorpio", planetSign: "Taurus", planet: "Moon", page: 170,
    en: "Gets happiness and advantages of the house of wife, gets heavy gains in occupation",
    ta: "மனைவி வீட்டில் மகிழ்ச்சியும் நன்மைகளும்; தொழிலில் பெரும் ஆதாயம்.",
  },
  {
    house: 7, lagna: "Scorpio", planetSign: "Taurus", planet: "Mars", page: 173,
    en: "Some enmity, power, struggle and benefits in the house of wife, works diligently in the house of profession, passionate and gets sexual pleasures, is self-conceited, gets some troubles and diseases in the body and in the organs, takes particular care of wealth and honour, some power and influence in the side of government and society, and is respectable",
    ta: "மனைவி வீட்டில் சில பகை, வலிமை, போராட்டம், ஆதாயம்; தொழில் வீட்டில் கடுமையாக உழைப்பார்; ஆர்வமும் பாலியல் இன்பமும் உள்ளவர்; தன்னைப் பெரிதாக நினைப்பார்; உடலிலும் உறுப்புகளிலும் சில தொல்லை, நோய்; செல்வத்தையும் மானத்தையும் கவனமாகக் காப்பார்; அரசு, சமூகத்தில் சில வலிமை; மரியாதைக்குரியவர்.",
  },
  {
    house: 7, lagna: "Scorpio", planetSign: "Taurus", planet: "Mercury", page: 174,
    en: "Bears hidden distress in addition to happiness in the house of wife, happiness after marriage, gets more of indirect advantages than the existing ones in connection with sexual pleasures, gets gains in occupation, works hard",
    ta: "மனைவி வீட்டில் மகிழ்ச்சியுடன் மறைந்த துன்பமும் உண்டு; திருமணத்துக்குப் பின் மகிழ்ச்சி; பாலியல் இன்பத்தில் நேரடியற்ற ஆதாயங்கள்; தொழிலில் ஆதாயம்; கடினமாக உழைப்பார்.",
  },
  {
    house: 7, lagna: "Scorpio", planetSign: "Taurus", planet: "Jupiter", page: 177,
    en: "Earns wealth through daily occupation, does some respectable occupation, has some weakness in the house of brother, increased wealth firm wife after marriage, gets children and influence in wife and is cautious",
    ta: "தினசரி தொழிலில் வருமானம்; மரியாதைக்குரிய சில தொழில்; சகோதரர் வீட்டில் சில குறை; திருமணத்துக்குப் பின் செல்வம் அதிகரிக்கும், உறுதியான மனைவி; குழந்தைகளும் மனைவி மீது செல்வாக்கும்; எச்சரிக்கையானவர்.",
  },
  {
    house: 7, lagna: "Scorpio", planetSign: "Taurus", planet: "Venus", page: 179,
    en: "Pursues many occupations, labours hard, spends much on firmness of occupation, gets pleasure of wife and family, gets sexual pleasures very much, pays attention to beauty, charm and art in occupation and manages the occupation well, yet some weakness in the occupation, has a special relation with wife",
    ta: "பல தொழில்கள் செய்வார்; கடினமாக உழைப்பார்; தொழிலின் உறுதிக்காக அதிகம் செலவழிப்பார்; மனைவி, குடும்ப மகிழ்ச்சி; பாலியல் இன்பம் மிகுதி; தொழிலில் அழகு, வசீகரம், கலை பற்றிய கவனம்; தொழிலை நன்கு நிர்வகிப்பார்; ஆனாலும் தொழிலில் சில பலவீனம்; மனைவியுடன் சிறப்பு உறவு.",
  },
  {
    house: 7, lagna: "Scorpio", planetSign: "Taurus", planet: "Saturn", page: 181,
    en: "Gets happiness in domestic life, possesses his own buildings, some happiness from the house of wife and occupation, has a fascination for sexual pleasures, gets some physical tiredness, tries hard for the progress of occupation",
    ta: "குடும்ப வாழ்வில் மகிழ்ச்சி; சொந்த வீடுகள்; மனைவி, தொழில் வகையில் சில மகிழ்ச்சி; பாலியல் இன்பத்தில் ஈர்ப்பு; சில உடல் சோர்வு; தொழில் முன்னேற்றத்துக்காக கடுமையாக முயல்வார்.",
  },
  {
    house: 7, lagna: "Scorpio", planetSign: "Taurus", planet: "Rahu", page: 183,
    en: "Gets his work done very carefully and cleverly in connection with occupation, conducts the occupation through diligence and mysterious devices, bears affliction in the house of wife, does not want his weakness to be disclosed, somewhat worried",
    ta: "தொழில் சம்பந்தமான வேலைகளை மிகக் கவனமாகவும் சாமர்த்தியமாகவும் செய்வார்; கடின உழைப்பும் மறைமுக வழிகளும் கொண்டு தொழில் நடத்துவார்; மனைவி வீட்டில் துன்பம்; தன் பலவீனம் வெளியாவதை விரும்பார்; சற்று கவலையுள்ளவர்.",
  },
  {
    house: 7, lagna: "Scorpio", planetSign: "Taurus", planet: "Ketu", page: 185,
    en: "Bears agony in the house of wife, bears some worries in the occupation but works patiently and diligently, does not get nervous and inactive though has to face grave troubles in the occupation, sometimes faces troubles in connection with family and manages the affairs tactfully, acquires sexual pleasures very much",
    ta: "மனைவி வீட்டில் வேதனை; தொழிலில் சில கவலைகள், ஆனாலும் பொறுமையாகவும் கடின உழைப்புடனும் வேலை செய்வார்; கடுமையான தொழில் சிரமங்களிலும் பதறாமலும் செயலற்றுப் போகாமலும் இருப்பார்; சில நேரம் குடும்ப தொல்லைகளையும் சாமர்த்தியமாக நிர்வகிப்பார்; பாலியல் இன்பம் மிகுதி.",
  },
  {
    house: 7, lagna: "Sagittarius", planetSign: "Gemini", planet: "Sun", page: 190,
    en: "Gets a beautiful and influential wife, experiences progress in occupation, gains respect and fame from occupation, is honest in the sphere of profession, enjoys good luck, is very industrious",
    ta: "அழகும் செல்வாக்கும் உள்ள மனைவி; தொழிலில் முன்னேற்றம்; தொழிலால் மரியாதையும் புகழும்; தொழில் வகையில் நேர்மை; நல்ல அதிர்ஷ்டம்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 7, lagna: "Sagittarius", planetSign: "Gemini", planet: "Moon", page: 191,
    en: "Bears troubles with domestic life, gets a long age with some hidden trouble in the house of wife, some perplexities about occupation, somewhat mentally strict in the side of occupation and wife",
    ta: "குடும்ப வாழ்வில் தொல்லைகள்; மனைவி வீட்டில் மறைந்த சிரமத்துடன் நீண்ட வயது; தொழில் பற்றிய சில குழப்பங்கள்; தொழில், மனைவி வகையில் சற்று மன உறுதியுடன் கண்டிப்பு.",
  },
  {
    house: 7, lagna: "Sagittarius", planetSign: "Gemini", planet: "Mars", page: 194,
    en: "Experiences loss in wife's house, faces some loss in the house of occupation, creates special means for increasing wealth, gets loss in the house of government, has some deficiency in education and weakness in physique",
    ta: "மனைவி வீட்டில் இழப்பு; தொழில் வீட்டில் சில இழப்பு; செல்வம் பெருக்க சிறப்பு வழிகளை உருவாக்குவார்; அரசு வகையில் இழப்பு; கல்வியில் சில குறை; உடலில் பலவீனம்.",
  },
  {
    house: 7, lagna: "Sagittarius", planetSign: "Gemini", planet: "Mercury", page: 196,
    en: "Does a very dignified occupation, gets happy pleasures of family, gets beautiful, influential and clever wife, wears a nice dress, conducts business successfully, enjoys the sexual pleasures very much, gets a very good father-in-law",
    ta: "மிகவும் கௌரவமான தொழில்; குடும்ப மகிழ்ச்சி; அழகான, செல்வாக்குள்ள, சாமர்த்தியமான மனைவி; நல்ல உடை; வணிகத்தில் வெற்றி; பாலியல் இன்பத்தை மிகவும் அனுபவிப்பார்; மிக நல்ல மாமனார்.",
  },
  {
    house: 7, lagna: "Sagittarius", planetSign: "Gemini", planet: "Jupiter", page: 198,
    en: "Pursues the occupation comfortably, gets a beautiful and influential wife, enmity in the brothers, and sisters, house, gets some landed property, is self-conceited",
    ta: "தொழிலை வசதியாக நடத்துவார்; அழகான, செல்வாக்குள்ள மனைவி; சகோதர சகோதரி வீட்டில் பகை; சில நிலச் சொத்து; தன்னைப் பெரிதாக நினைப்பார்.",
  },
  {
    house: 7, lagna: "Sagittarius", planetSign: "Gemini", planet: "Venus", page: 199,
    en: "Gains in the occupation, gets good cooperation in wife's house, some enmity through wife side, wants much sexual pleasures, likes beauty, gets some diseases in wife, great advantage in occupation and domestic life, gets honour, very clever",
    ta: "தொழிலில் ஆதாயம்; மனைவி வீட்டில் நல்ல ஒத்துழைப்பு; மனைவி வழியில் சில பகை; பாலியல் இன்பத்தை அதிகம் விரும்புவார்; அழகை விரும்புவார்; மனைவியால் சில நோய்; தொழிலிலும் குடும்ப வாழ்விலும் பெரும் ஆதாயம்; மரியாதை; மிகுந்த சாமர்த்தியம்.",
  },
  {
    house: 7, lagna: "Sagittarius", planetSign: "Gemini", planet: "Saturn", page: 202,
    en: "Progress in occupation, earns wealth diligently, some weakness in his body, gets the power in wife's house, does not support Dharma, is passionate",
    ta: "தொழிலில் முன்னேற்றம்; உழைப்பால் செல்வம்; உடலில் சில பலவீனம்; மனைவி வீட்டில் வலிமை; தர்மத்தை ஆதரிக்கமாட்டார்; பாலியல் ஆர்வம் மிகுதி.",
  },
  {
    house: 7, lagna: "Sagittarius", planetSign: "Gemini", planet: "Rahu", page: 203,
    en: "Works very tactfully in the occupation, works very hard and chalks out complex plans for acquiring progress of occupation, gets an extraordinarily charming wife, gets more sexual pleasures, is clever and cunning",
    ta: "தொழிலில் மிகுந்த சாமர்த்தியம்; தொழில் முன்னேற்றத்துக்காக கடுமையாக உழைத்து சிக்கலான திட்டங்களை வகுப்பார்; அசாதாரண கவர்ச்சியுள்ள மனைவி; பாலியல் இன்பம் மிகுதி; அறிவாளியும் சூழ்ச்சியாளரும்.",
  },
  {
    house: 7, lagna: "Sagittarius", planetSign: "Gemini", planet: "Ketu", page: 205,
    en: "Bears great trouble in wife's house, is troubled by dependence in occupation, feels fatigued, earns livelihood with great difficulty and tactics, deficiency in the sexual pleasures",
    ta: "மனைவி வீட்டில் பெரும் துன்பம்; தொழிலில் சார்பு நிலையால் தொல்லை; சோர்வு; பெரும் சிரமத்தோடும் தந்திரங்களோடும் வாழ்வாதாரம் ஈட்டுவார்; பாலியல் இன்பத்தில் குறை.",
  },
  {
    house: 7, lagna: "Capricorn", planetSign: "Cancer", planet: "Sun", page: 211,
    en: "Gets some affliction in wife's side, feels worried over domestic life, worries in connection with occupation, some distress in sexual life, gets the contact of foreign countries in connection with occupation and does some strange and dreadful deeds",
    ta: "மனைவி வீட்டில் சில துன்பம்; குடும்ப வாழ்வில் கவலை; தொழில் வகையில் கவலைகள்; பாலியல் வாழ்வில் சில துன்பம்; தொழில் வகையில் வெளிநாட்டுத் தொடர்பு; சில வினோதமும் பயங்கரமுமான செயல்களைச் செய்வார்.",
  },
  {
    house: 7, lagna: "Capricorn", planetSign: "Cancer", planet: "Moon", page: 212,
    en: "Gets a very beautiful wife, gets sexual pleasures very much, pursues a firm and nice occupation",
    ta: "மிக அழகான மனைவி; பாலியல் இன்பம் மிகுதி; உறுதியான, நல்ல தொழில் நடத்துவார்.",
  },
  {
    house: 7, lagna: "Capricorn", planetSign: "Cancer", planet: "Mars", page: 214,
    en: "Gets loss in wife's house, deficiency in mother's house, weakness in connection with occupation, restless in the house of income and in domestic happiness, deficiency in sexual pleasures",
    ta: "மனைவி வீட்டில் இழப்பு; தாய் வீட்டில் குறை; தொழிலில் பலவீனம்; வருமானத்திலும் குடும்ப மகிழ்ச்சியிலும் அமைதியின்மை; பாலியல் இன்பத்தில் குறை.",
  },
  {
    house: 7, lagna: "Capricorn", planetSign: "Cancer", planet: "Mercury", page: 216,
    en: "Gets the progress in occupation through his powerful destiny, gets good fortune in the daily management of occupation, some ordinary affliction in the wife's side, does some religious duties on account of wife",
    ta: "தன் வலிமையான விதியால் தொழில் முன்னேற்றம்; தினசரி தொழில் நிர்வாகத்தில் நல்ல அதிர்ஷ்டம்; மனைவி வகையில் சாதாரண துன்பம்; மனைவியின் பொருட்டு சில மத கடமைகள்.",
  },
  {
    house: 7, lagna: "Capricorn", planetSign: "Cancer", planet: "Jupiter", page: 219,
    en: "Works energetically in the line of occupation, spends much, gets special sexual powers and happiness, has weakness in body, maintains contact with brothers and sisters",
    ta: "தொழில் துறையில் சுறுசுறுப்பாக வேலை; அதிகம் செலவழிப்பார்; சிறப்பு பாலியல் ஆற்றலும் மகிழ்ச்சியும்; உடலில் பலவீனம்; சகோதர சகோதரிகளுடன் தொடர்பு.",
  },
  {
    house: 7, lagna: "Capricorn", planetSign: "Cancer", planet: "Venus", page: 221,
    en: "Pursues a powerful occupation, gets the strength from children, gains happiness of the family, does honourable deeds for the government and society, has some deficiency in business, pays attention to increase the wealth, rears very diplomatic policies, and is mentally worried",
    ta: "வலிமையான தொழில்; பிள்ளைகளிடமிருந்து வலிமை; குடும்ப மகிழ்ச்சி; அரசு, சமூகத்துக்காக மரியாதைக்குரிய செயல்கள்; வணிகத்தில் சில குறை; செல்வம் பெருக்க கவனம்; மிகவும் இராஜதந்திரமான கொள்கைகள்; மன கவலை.",
  },
  {
    house: 7, lagna: "Capricorn", planetSign: "Cancer", planet: "Saturn", page: 223,
    en: "Labours hard in the line of occupation, has a great fascination for wife, develops some enmity in the family, gets uneasiness in occupation, tries very hard for the rise of destiny, deficiency of land and buildings",
    ta: "தொழில் துறையில் கடின உழைப்பு; மனைவியின் மீது பெரும் ஈர்ப்பு; குடும்பத்தில் சில பகை; தொழிலில் அமைதியின்மை; விதியை உயர்த்த கடுமையாக முயல்வார்; நிலமும் கட்டிடங்களும் குறை.",
  },
  {
    house: 7, lagna: "Capricorn", planetSign: "Cancer", planet: "Rahu", page: 225,
    en: "Bears great loss in wife's house, deficiency in sexual pleasures, finds obstacles in occupation, faces the mental worries in connection with family affairs, tries to reap the unauthorised advantages being indiscriminate in the side of sexual pleasures, and is of unstable mind",
    ta: "மனைவி வீட்டில் பெரும் இழப்பு; பாலியல் இன்பத்தில் குறை; தொழிலில் தடைகள்; குடும்ப விவகாரங்களில் மன கவலைகள்; பாலியல் இன்பத்தில் தகுதியற்ற ஆதாயம் தேடுவார்; மனம் நிலையற்றவர்.",
  },
  {
    house: 7, lagna: "Capricorn", planetSign: "Cancer", planet: "Ketu", page: 226,
    en: "Loss and obstacles in wife's house, experiences great worries in family life, faces many failures and loss in the occupation, longs for sexual pleasures",
    ta: "மனைவி வீட்டில் இழப்பும் தடைகளும்; குடும்ப வாழ்வில் பெரும் கவலை; தொழிலில் பல தோல்விகளும் இழப்பும்; பாலியல் இன்பத்துக்கான ஏக்கம்.",
  },
  {
    house: 7, lagna: "Aquarius", planetSign: "Leo", planet: "Sun", page: 232,
    en: "Gains influential power from occupation, experiences some distress in the body, maintains great influence on family, faces some disturbance due to sexual pleasures",
    ta: "தொழிலால் செல்வாக்கான வலிமை; உடலில் சில துன்பம்; குடும்பத்தில் பெரும் செல்வாக்கு; பாலியல் இன்பத்தால் சில குழப்பம்.",
  },
  {
    house: 7, lagna: "Aquarius", planetSign: "Leo", planet: "Moon", page: 234,
    en: "Pursues the occupation diligently and with perplexities of concentration, faces enmity in the house of wife and sexual pleasures, has some distress and bondage in body, gets the complaint of smallpox in the wife's side, uses diplomacy in occupation",
    ta: "மன ஒருமுகப்பாட்டில் சில குழப்பத்துடன் தொழிலை சுறுசுறுப்பாகச் செய்வார்; மனைவி வீட்டிலும் பாலியல் இன்பத்திலும் பகை; உடலில் சில துன்பமும் கட்டுப்பாடும்; மனைவி வீட்டில் அம்மை நோய் பற்றிய புகார்; தொழிலில் இராஜதந்திரம்.",
  },
  {
    house: 7, lagna: "Aquarius", planetSign: "Leo", planet: "Mars", page: 237,
    en: "Pursues the occupation with great respect and honour, gets brothers and sisters, manages the affairs nicely in the government and society, keeps influence in the house of wife, is a good administrator",
    ta: "மிகுந்த மரியாதையுடனும் கௌரவத்துடனும் தொழில்; சகோதர சகோதரிகள்; அரசு, சமூகத்தில் விவகாரங்களை நன்கு நிர்வகிப்பார்; மனைவி வீட்டில் செல்வாக்கு; நல்ல நிர்வாகி.",
  },
  {
    house: 7, lagna: "Aquarius", planetSign: "Leo", planet: "Mercury", page: 239,
    en: "Gets education and children, works with wisdom in the line of occupation, has some fascination and perplexity in the house of wife, gets good age, spends the daily routine of life in worldly and domestic affairs, gets honour, experiences some deficiency in the sexual pleasures",
    ta: "கல்வியும் குழந்தைகளும் பெறுவார்; தொழில் துறையில் அறிவுடன் வேலை; மனைவி வீட்டில் சில ஈர்ப்பும் குழப்பமும்; நல்ல வயது; உலக, குடும்ப விவகாரங்களில் தினசரி வாழ்க்கை; மரியாதை; பாலியல் இன்பத்தில் சில குறை.",
  },
  {
    house: 7, lagna: "Aquarius", planetSign: "Leo", planet: "Jupiter", page: 241,
    en: "Pursues big occupation by the power of wealth, earns much wealth by occupation, acquires wealth alter marriage, gets many kinds of advantages, gets the strength from brothers and sisters, gets sufficient fixed income, is clever in earning wealth",
    ta: "செல்வ வலிமையால் பெரும் தொழில் நடத்துவார்; தொழிலால் பெரும் செல்வம்; திருமணத்துக்குப் பின் செல்வம் பெறுவார்; பல ஆதாயங்கள்; சகோதர சகோதரிகளின் வலிமை; போதுமான நிலையான வருமானம்; செல்வம் ஈட்டுவதில் சாமர்த்தியம்.",
  },
  {
    house: 7, lagna: "Aquarius", planetSign: "Leo", planet: "Venus", page: 243,
    en: "Gets happiness and auspiciousness in family but some deficiency in mutual love in the family, gets unhappiness from others, gets the strength of lands and buildings, has a good physique, works satisfactorily and truthfully in the occupation",
    ta: "குடும்பத்தில் மகிழ்ச்சியும் நன்மையும், ஆனால் குடும்பத்தில் பரஸ்பர அன்பில் குறை; பிறரிடமிருந்து மனவருத்தம்; நிலமும் கட்டிடங்களும் வலிமை; நல்ல உடல்; தொழிலில் திருப்திகரமாகவும் உண்மையாகவும் வேலை செய்வார்.",
  },
  {
    house: 7, lagna: "Aquarius", planetSign: "Leo", planet: "Saturn", page: 245,
    en: "Faces perplexity in domestic life, has deficiency and enmity in the house of wife, gets worries and loss in occupation, pays proper attention to Dharma, is of short stature",
    ta: "வீட்டு வாழ்வில் சிக்கல்; மனைவி வீட்டில் குறையும் பகையும்; தொழிலில் கவலையும் இழப்பும்; தர்மத்தின்மீது நல்ல கவனம்; உயரம் குறைந்தவர்.",
  },
  {
    house: 7, lagna: "Aquarius", planetSign: "Leo", planet: "Rahu", page: 246,
    en: "Bears loss in wife's house, bears affliction from wife, has weakness in sexual pleasures, bears calamities in the line of profession, does laborious deeds, enjoys some unjustified advantage in family and occupation",
    ta: "மனைவி வீட்டில் இழப்பு; மனைவியால் துன்பம்; பாலியல் இன்பத்தில் பலவீனம்; தொழில் துறையில் துன்பங்கள்; உழைப்பை வேண்டும் செயல்கள்; குடும்பத்திலும் தொழிலிலும் நியாயமற்ற ஆதாயம்.",
  },
  {
    house: 7, lagna: "Aquarius", planetSign: "Leo", planet: "Ketu", page: 248,
    en: "Bears distress in wife's house, works with worries in the field of occupation and also faces a fatal loss in occupation, has uneasiness in connection with sexual pleasures, has strong power for sexual affairs",
    ta: "மனைவி வீட்டில் துன்பம்; தொழில் துறையில் கவலைகளுடன் வேலை, மேலும் தொழிலில் ஆபத்தான இழப்பு; பாலியல் வகையில் அமைதியின்மை; பாலியல் விவகாரங்களில் வலுவான ஆற்றல்.",
  },
  {
    house: 7, lagna: "Pisces", planetSign: "Virgo", planet: "Sun", page: 254,
    en: "Faces opposition in wife's house, bears some distress in family, gets hindrances and worries in the line of occupation, faces some deficiency in the side of sexual pleasures",
    ta: "மனைவி வீட்டில் எதிர்ப்பு; குடும்பத்தில் சில துன்பம்; தொழில் துறையில் தடைகளும் கவலைகளும்; பாலியல் இன்பத்தில் சில குறை.",
  },
  {
    house: 7, lagna: "Pisces", planetSign: "Virgo", planet: "Moon", page: 256,
    en: "Achieves success in occupation through his will-power, gets an educated and gentle wife, has a great fascination for sexual pleasures, is very clever and is of happy disposition",
    ta: "தன் மன உறுதியால் தொழிலில் வெற்றி; கல்வியறிவுள்ள, மென்மையான மனைவி; பாலியல் இன்பத்தில் பெரும் ஈர்ப்பு; மிகுந்த சாமர்த்தியம்; மகிழ்ச்சியான இயல்பு.",
  },
  {
    house: 7, lagna: "Pisces", planetSign: "Virgo", planet: "Mars", page: 258,
    en: "Experiences progress in occupation through his fortune, earns wealth, gains wealth due to the good luck of wife but causes unrest to wife, conducts a large scale business, gets advantage from government and society, gets some cooperation from father, enjoys the sexual pleasures, gives much importance to wealth and labours very hard for wealth",
    ta: "தன் அதிர்ஷ்டத்தால் தொழிலில் முன்னேற்றம்; செல்வம் ஈட்டுவார்; மனைவியின் நல்ல அதிர்ஷ்டத்தால் செல்வம், ஆனால் மனைவிக்கு மன அமைதியின்மை; பெரிய அளவில் வணிகம்; அரசு, சமூகத்தில் ஆதாயம்; தந்தையிடமிருந்து சில ஒத்துழைப்பு; பாலியல் இன்பம்; செல்வத்துக்கு பெரும் முக்கியத்துவம்; செல்வத்துக்காக கடுமையாக உழைப்பார்.",
  },
  {
    house: 7, lagna: "Pisces", planetSign: "Virgo", planet: "Mercury", page: 260,
    en: "Gets a very beautiful wife, pursues influential occupation and gets happiness and success, gets dignity in mother's house, gets excessive happiness and sexual pleasures, enjoys lands and buildings",
    ta: "மிக அழகான மனைவி; செல்வாக்குள்ள தொழில்; மகிழ்ச்சியும் வெற்றியும்; தாய் வீட்டில் கௌரவம்; அதிக மகிழ்ச்சியும் பாலியல் இன்பமும்; நிலமும் கட்டிடங்களும் அனுபவிப்பார்.",
  },
  {
    house: 7, lagna: "Pisces", planetSign: "Virgo", planet: "Jupiter", page: 262,
    en: "Gets a handsome physique, gets progress in the occupation through physical labour and the power of heart, gets respect in the line of occupation, gets happiness in wife's house, enjoys sexual pleasures, feels some deficiency in the house of income, some enmity with brothers",
    ta: "அழகான உடல்; தொழிலில் உடல் உழைப்பாலும் மனவலிமையாலும் முன்னேற்றம்; தொழில் துறையில் மரியாதை; மனைவி வீட்டில் மகிழ்ச்சி; பாலியல் இன்பம் அனுபவிப்பார்; வருமானக் குறை; சகோதரர்களுடன் சில பகை.",
  },
  {
    house: 7, lagna: "Pisces", planetSign: "Virgo", planet: "Venus", page: 264,
    en: "Gets worries in the daily routine of life on account of family and wife, bears some loss in wife's side, faces great calamities and worries in the house of occupation, bears the loss of brothers and sisters. acquires benefits in the house of longevity, is not very happy in the sexual pleasures, is secretly clever and courageous",
    ta: "குடும்பம், மனைவி காரணமாக தினசரி வாழ்வில் கவலைகள்; மனைவி வீட்டில் சில இழப்பு; தொழில் துறையில் பெரும் துன்பமும் கவலையும்; சகோதர சகோதரிகளின் இழப்பு.",
  },
  {
    house: 7, lagna: "Pisces", planetSign: "Virgo", planet: "Saturn", page: 267,
    en: "Bears some losses and gains in the house of expenditure, faces anxiety in the house of Dharma, has some deficiency in happiness on account of income and expenditure",
    ta: "செலவில் சில இழப்பும் ஆதாயமும்; தர்மத்தின் வீட்டில் கவலை; வருமானம், செலவால் மகிழ்ச்சியில் குறை.",
  },
  {
    house: 7, lagna: "Pisces", planetSign: "Virgo", planet: "Rahu", page: 268,
    en: "Labours very hard for the progress of occupation, faces some troubles in wife's house, gets stability in happiness after bearing some worries in the family, sometimes laces very deep calamities in the line of diurnal occupation, has a peculiar taste about sexual pleasures though finds some deficiency in this area",
    ta: "தொழில் முன்னேற்றத்துக்காக மிகக் கடினமாக உழைப்பார்; மனைவி வீட்டில் சில தொல்லைகள்; தொழிலில் கடுமையான சிரமங்கள்; சில கவலைகளைத் தாங்கிய பின் மகிழ்ச்சியில் நிலைத்தன்மை.",
  },
  {
    house: 7, lagna: "Pisces", planetSign: "Virgo", planet: "Ketu", page: 271,
    en: "Some restlessness in the house of wife, gets special sexual pleasures, labours very hard in diurnal occupation, gets an internal stability in the occupation",
    ta: "மனைவி வீட்டில் அமைதியின்மை; பாலியல் இன்பத்தில் சிறப்பு; தினசரி தொழிலில் மிகக் கடினமாக உழைப்பார்; தொழிலில் உள் நிலைத்தன்மை.",
  },
  {
    house: 8, lagna: "Aries", planetSign: "Scorpio", planet: "Sun", page: 22,
    en: "Miseries on account of children, education suffers, mentally worried, secretive, routine life, gains wealth from others, crooked in nature, harsh speech and rash",
    ta: "குழந்தைகளால் துன்பம்; கல்வி பாதிப்பு; மனக் கவலை; ரகசியமானவர்; வழக்கமான வாழ்க்கை; மற்றவர்களிடமிருந்து செல்வம் பெறுவார்; வளைந்த இயல்பு; கடுமையான பேச்சும் அவசரமும்.",
  },
  {
    house: 8, lagna: "Aries", planetSign: "Scorpio", planet: "Moon", page: 24,
    en: "Loses mother and unhappy with maternal relatives, disturbed and narrow-minded, suffers from stomach troubles, accident prone, does not accumulate wealth, feces penury and troubles",
    ta: "தாயை இழப்பார்; தாய்வழி உறவினர்களுடன் மகிழ்ச்சியின்மை; குழப்பமும் குறுகிய மனப்பான்மையும்; வயிற்றுக் கோளாறு; விபத்துக்கு ஆளாவார்; செல்வம் சேராது; வறுமையும் சிக்கலும்.",
  },
  {
    house: 8, lagna: "Aries", planetSign: "Scorpio", planet: "Mars", page: 26,
    en: "Lean body and deficient in size, feels restless, gains heavily by giving the power of life to others with pride, or even putting an end to self-identity, becomes prematurely aged, brotherly relations suffer, but becomes famous",
    ta: "மெலிந்த உடல், குறைந்த உயரம்; அமைதியின்மை; பெருமையுடன் பிறருக்கு வாழ்வளித்து பெரும் ஆதாயம், அல்லது தன் அடையாளத்தையே அழிப்பார்; முன்கூட்டியே முதுமை; சகோதர உறவுகள் பாதிப்பு; ஆனால் புகழ் பெறுவார்.",
  },
  {
    house: 8, lagna: "Aries", planetSign: "Scorpio", planet: "Mercury", page: 28,
    en: "Weakness in finances, energies from maternal grandfather, not very happy with brothers and sisters, clever in getting his work done, has faith in occult power, works hard for getting wealth, suffers from stomach problems, worried in daily routine, faces the enemy with courage",
    ta: "நிதியில் பலவீனம்; தாய்வழி தாத்தாவிடமிருந்து ஆற்றல்; உடன்பிறப்புகளுடன் மகிழ்ச்சியின்மை; சாமர்த்தியமாக வேலை சாதிப்பார்; மறைந்த சக்தியில் நம்பிக்கை; செல்வம் ஈட்ட கடினமாக உழைப்பார்; வயிற்றுத் தொல்லை; தைரியமாக எதிரியை எதிர்கொள்வார்.",
  },
  {
    house: 8, lagna: "Aries", planetSign: "Scorpio", planet: "Jupiter", page: 30,
    en: "Unlucky and irreligious, has a long life, unpleasantness from destiny",
    ta: "அதிர்ஷ்டமற்றவர், தர்மத்தில் நாட்டமில்லாதவர்; நீண்ட ஆயுள்; விதியால் சில தொல்லை.",
  },
  {
    house: 8, lagna: "Aries", planetSign: "Scorpio", planet: "Venus", page: 32,
    en: "Weak in health and loses wealth, gets success through foreign collaboration, unhappy with wife and also with family, deficient in sexual pleasures, secretly passionate",
    ta: "உடல்நலக் குறை, செல்வ இழப்பு; வெளிநாட்டு கூட்டுறவால் வெற்றி; மனைவி, குடும்பத்துடன் அதிருப்தி; பாலியல் இன்பத்தில் குறை; ரகசியமான ஆசை.",
  },
  {
    house: 8, lagna: "Aries", planetSign: "Scorpio", planet: "Saturn", page: 34,
    en: "Worried about father, lives alone, works hard to get gain from foreign collaboration, works with great obstinacy and ability, intellectually worried, no happiness from children and education, arrogant",
    ta: "தந்தையைப் பற்றிக் கவலை; தனியாக வாழ்வார்; வெளிநாட்டு கூட்டுறவால் ஆதாயம் பெற கடினமாக உழைப்பார்; பிடிவாதமும் திறமையும்; அறிவு ரீதியாகக் கவலை; குழந்தைகள், கல்வியில் மகிழ்ச்சியின்மை; கர்வம்.",
  },
  {
    house: 8, lagna: "Aries", planetSign: "Scorpio", planet: "Rahu", page: 35,
    en: "Gets worries in daily life, loss in livelihood, gets internal diseases in the abdomen, a man of bitter policies",
    ta: "தினசரி வாழ்வில் கவலைகள்; வாழ்வாதார இழப்பு; வயிற்றில் உள் நோய்கள்; கசப்பான உபாயங்களைக் கொண்டவர்.",
  },
  {
    house: 8, lagna: "Aries", planetSign: "Scorpio", planet: "Ketu", page: 38,
    en: "Feels weakness in the back and lower part of stomach, careless in daily routine, some problem due to age, has great pride and creates cooperation in the house of livelihood, has to work hard, at the end gets some fame and influence",
    ta: "முதுகு, அடிவயிற்றின் கீழ்ப்பகுதியில் பலவீனம்; தினசரி வாழ்வில் அசட்டை; வயது காரணமாக சில பிரச்சினை; பெரும் பெருமை; வாழ்வாதார வீட்டில் உதவி உருவாக்குவார்; கடின உழைப்பு; இறுதியில் சில புகழும் செல்வாக்கும்.",
  },
  {
    house: 8, lagna: "Taurus", planetSign: "Sagittarius", planet: "Sun", page: 43,
    en: "Restlessness and distress with mother, leaves the country, gets influential friends and also lands at foreign places, works for the increase of wealth",
    ta: "தாயுடன் அமைதியின்மையும் துன்பமும்; நாட்டை விட்டுச் செல்வார்; வெளிநாடுகளில் செல்வாக்குள்ள நண்பர்களும் நிலமும் கிடைக்கும்; செல்வம் பெருக்க முயல்வார்.",
  },
  {
    house: 8, lagna: "Taurus", planetSign: "Sagittarius", planet: "Moon", page: 44,
    en: "Separation from brothers and sisters, feels strong in daily routine of life, makes efforts to get wealth, contacts with foreign countries, shows interest in occult studies",
    ta: "உடன்பிறப்புகளைப் பிரிவார்; தினசரி வாழ்வில் வலிமை; செல்வம் ஈட்ட முயற்சி; வெளிநாட்டுத் தொடர்புகள்; மறை கல்வியில் ஆர்வம்.",
  },
  {
    house: 8, lagna: "Taurus", planetSign: "Sagittarius", planet: "Mars", page: 47,
    en: "Works hard, bears many troubles and disputes in occupation, loss through wife, bears many disputes in family, somewhat loss due to expenditure, not happy with brothers and sisters, gets diseases below navel, loss of accumulated wealth and property, gets some organic disorders and is short of life",
    ta: "கடின உழைப்பு; தொழிலில் பல தொல்லைகளும் சச்சரவுகளும்; மனைவி வகையில் இழப்பு; குடும்பத்தில் பல சச்சரவுகள்; செலவால் சில இழப்பு; உடன்பிறப்புகளுடன் மகிழ்ச்சியின்மை; தொப்புளுக்குக் கீழ் நோய்கள்; சேர்த்த செல்வமும் சொத்தும் இழப்பு; சில உறுப்புக் கோளாறுகள்; ஆயுள் குறைவு.",
  },
  {
    house: 8, lagna: "Taurus", planetSign: "Sagittarius", planet: "Mercury", page: 48,
    en: "Loss of children and not much of education, loses wealth, mentally worried, engages in foreign collaboration",
    ta: "குழந்தைகள் இழப்பும் கல்வி குறைவும்; செல்வ இழப்பு; மனக் கவலை; வெளிநாட்டு கூட்டுறவில் ஈடுபடுவார்.",
  },
  {
    house: 8, lagna: "Taurus", planetSign: "Sagittarius", planet: "Jupiter", page: 51,
    en: "Help from foreign countries, spends much, mixed relations with mother, makes efforts to accumulate wealth, dignity in the daily routine, mixed relations in the house of family",
    ta: "வெளிநாடுகளிலிருந்து உதவி; அதிகம் செலவழிப்பார்; தாயுடன் கலந்த உறவு; செல்வம் சேர்க்க முயற்சி; தினசரி வாழ்வில் மரியாதை; குடும்ப வீட்டில் கலந்த உறவுகள்.",
  },
  {
    house: 8, lagna: "Taurus", planetSign: "Sagittarius", planet: "Venus", page: 53,
    en: "Some troubles in the body, loss in the side of maternal grandfather's house, feels restless, does very troublesome deeds, works hard to improve the wealth, restlessness in the side of enemies",
    ta: "உடலில் சில தொல்லைகள்; தாய்வழி தாத்தா வீட்டில் இழப்பு; அமைதியின்மை; மிகத் தொல்லையான செயல்களைச் செய்வார்; செல்வத்தை உயர்த்த கடினமாக உழைப்பார்; எதிரிகள் பக்கம் அமைதியின்மை.",
  },
  {
    house: 8, lagna: "Taurus", planetSign: "Sagittarius", planet: "Saturn", page: 55,
    en: "Distress in the house of father, deficiency in fame, gets the union of progress through diligence with the cooperation of foreign countries, has Divine power and gains in education",
    ta: "தந்தை வீட்டில் துன்பம்; புகழில் குறை; வெளிநாட்டு உதவியுடன் உழைப்பால் முன்னேற்றம்; தெய்வீக ஆற்றலும் கல்வியில் ஆதாயமும்.",
  },
  {
    house: 8, lagna: "Taurus", planetSign: "Sagittarius", planet: "Rahu", page: 57,
    en: "Disturbance in the house of age, gets some abdominal troubles in stomach, feels quite restlessness, sometimes thinks of ending life and is a sufferer",
    ta: "வயது வீட்டில் குழப்பம்; வயிற்றில் சில நோய்; பெரும் அமைதியின்மை; சில நேரம் வாழ்வை முடிக்க நினைப்பார்; துன்பப்படுபவர்.",
  },
  {
    house: 8, lagna: "Taurus", planetSign: "Sagittarius", planet: "Ketu", page: 58,
    en: "Does many shady deeds, works hard for foreign collaboration, anxieties in life, some deficiency in lifespan",
    ta: "பல நிழலான செயல்களைச் செய்வார்; வெளிநாட்டு கூட்டுறவுக்காக கடினமாக உழைப்பார்; வாழ்வில் கவலைகள்; ஆயுளில் சில குறை.",
  },
  {
    house: 8, lagna: "Gemini", planetSign: "Capricorn", planet: "Sun", page: 63,
    en: "Feels some weakness in the part of energy and strength, some loss through brothers and sisters, uses the great effort and secret power of improving the loss of wealth, some worries in the daily routine",
    ta: "ஆற்றலிலும் வலிமையிலும் சில பலவீனம்; உடன்பிறப்புகள் வகையில் சில இழப்பு; செல்வ இழப்பை ஈடுசெய்ய பெரும் முயற்சியும் ரகசிய வலிமையும்; தினசரி வேலையில் சில கவலைகள்.",
  },
  {
    house: 8, lagna: "Gemini", planetSign: "Capricorn", planet: "Moon", page: 65,
    en: "Loss of wealth and weakness in the body, loss in family, gains by secret policies, progress in the house of age",
    ta: "செல்வ இழப்பும் உடல் பலவீனமும்; குடும்பத்தில் இழப்பு; ரகசிய உபாயங்களால் ஆதாயம்; ஆயுள் வீட்டில் முன்னேற்றம்.",
  },
  {
    house: 8, lagna: "Gemini", planetSign: "Capricorn", planet: "Mars", page: 67,
    en: "Progress in longevity, permanent gains by hard work in foreign countries, deficiency in the house of wealth, tries to maintain the income, mixed relations with brother",
    ta: "ஆயுளில் முன்னேற்றம்; வெளிநாடுகளில் கடின உழைப்பால் நிலையான ஆதாயம்; செல்வ வீட்டில் குறை; வருமானத்தைத் தக்கவைக்க முயல்வார்; சகோதரருடன் கலந்த உறவு.",
  },
  {
    house: 8, lagna: "Gemini", planetSign: "Capricorn", planet: "Mercury", page: 69,
    en: "Deficiency in physical powers, gets some progress in the house of wife, happiness in the daily routine of life, progress and success for accumulating wealth, deficiency of lands and buildings, feels happiness in foreign countries, disordered atmosphere, and has force",
    ta: "உடல் ஆற்றலில் குறை; மனைவி வீட்டில் சில முன்னேற்றம்; தினசரி வாழ்வில் மகிழ்ச்சி; செல்வம் சேர்ப்பதில் முன்னேற்றமும் வெற்றியும்; நிலம், கட்டிடங்களில் குறை; வெளிநாடுகளில் மகிழ்ச்சி; குழப்பமான சூழல்.",
  },
  {
    house: 8, lagna: "Gemini", planetSign: "Capricorn", planet: "Jupiter", page: 71,
    en: "Loss in the house of wife and father, does troublesome deeds for business occupation, difficulties from foreign countries, weakness in the house of government and society, feels restless, gets some maternal happiness",
    ta: "மனைவி, தந்தை வீட்டில் இழப்பு; தொழிலுக்காக சிக்கலான வேலைகள்; வெளிநாடுகளில் சிரமங்கள்; அரசு, சமூகத்தில் பலவீனம்; அமைதியின்மை; தாய் வகையில் சில மகிழ்ச்சி.",
  },
  {
    house: 8, lagna: "Gemini", planetSign: "Capricorn", planet: "Venus", page: 72,
    en: "Weakness in education, loss in the side of children, makes efforts in increasing the wealth, some deficiency of expenditure",
    ta: "கல்வியில் பலவீனம்; குழந்தைகள் வகையில் இழப்பு; செல்வம் பெருக்க முயல்வார்; செலவில் சில குறை.",
  },
  {
    house: 8, lagna: "Gemini", planetSign: "Capricorn", planet: "Saturn", page: 74,
    en: "Good longevity, hindrances in the house of progress and destiny through foreign countries, fame in the line of occupation, progress in the happiness of marriage, progress in occupation, special force in the house of intellect and education, deficiency in the house of children, progress in government and society",
    ta: "நல்ல ஆயுள்; வெளிநாடுகளால் முன்னேற்றம், விதியில் தடைகள்; தொழில் துறையில் புகழ்; திருமண மகிழ்ச்சியில் முன்னேற்றம்; தொழிலில் முன்னேற்றம்; சிறப்பு வலிமை.",
  },
  {
    house: 8, lagna: "Gemini", planetSign: "Capricorn", planet: "Rahu", page: 77,
    en: "Worries a lot, sometimes has to face fatal and nervous troubles, thinks very secret, feels deficiency in the daily routine of life, gets stomach troubles",
    ta: "பெரும் கவலைகள்; சில நேரம் உயிருக்கு ஆபத்தான, நரம்பு சம்பந்தமான தொல்லைகள்; மிக ரகசியமாக சிந்திப்பார்; தினசரி வாழ்வில் குறை; வயிற்றுக் கோளாறுகள்.",
  },
  {
    house: 8, lagna: "Gemini", planetSign: "Capricorn", planet: "Ketu", page: 79,
    en: "Bears some restlessness and worries in the daily routine of life, labours hard and faces difficulties helping the professional life, gets some stomach complaints",
    ta: "தினசரி வாழ்வில் அமைதியின்மையும் கவலைகளும்; கடின உழைப்பு; தொழில் வாழ்வுக்கு உதவுவதில் சிரமங்கள்; சில வயிற்றுக் குறைகள்.",
  },
  {
    house: 8, lagna: "Cancer", planetSign: "Aquarius", planet: "Sun", page: 83,
    en: "Earns wealth through painful means, feels deficiency of wealth, gets ancestral wealth or the wealth of a diseased person, sudden loss of wealth",
    ta: "வேதனையான வழிகளில் செல்வம் ஈட்டுவார்; செல்வக் குறை; முன்னோர் சொத்து அல்லது நோயாளியின் செல்வம் பெறுவார்; திடீர் செல்வ இழப்பு.",
  },
  {
    house: 8, lagna: "Cancer", planetSign: "Aquarius", planet: "Moon", page: 86,
    en: "Deficiency in beauty, faces hindrances in occupation, earns and progresses through hard physical labour",
    ta: "அழகில் குறை; தொழிலில் தடைகள்; கடின உடல் உழைப்பால் வருமானமும் முன்னேற்றமும்.",
  },
  {
    house: 8, lagna: "Cancer", planetSign: "Aquarius", planet: "Mars", page: 88,
    en: "Bears the losses of son and father, does big and difficult tasks, gets little education, tells lies, talks bitterly, follows unrighteous methods to get rise and wealth, feels dissatisfied with government and society, is a bit lazy",
    ta: "மகன், தந்தை ஆகியோரின் இழப்புகளைத் தாங்குவார்; பெரிய கடின செயல்களைச் செய்வார்; குறைந்த கல்வி; பொய் சொல்வார்; கடுமையாகப் பேசுவார்; உயர்வுக்கும் செல்வத்துக்கும் நேர்மையற்ற வழிகள்; அரசு, சமூகத்தில் அதிருப்தி; சற்று சோம்பல்.",
  },
  {
    house: 8, lagna: "Cancer", planetSign: "Aquarius", planet: "Mercury", page: 90,
    en: "Weakness in his energy and strength, devoid of foes, hidden power, manages the expenditure, does even the worst and difficult work to acquire money, experiences the separation of brothers and sisters, shows carelessness and gentleness",
    ta: "ஆற்றலிலும் வலிமையிலும் பலவீனம்; எதிரிகள் இல்லாதவர்; மறைந்த சக்தி; செலவை நிர்வகிப்பார்; பணம் ஈட்ட மிகக் கடினமான வேலைகளையும் செய்வார்; உடன்பிறப்புகளைப் பிரிவார்; அசட்டையும் மென்மையும் காட்டுவார்.",
  },
  {
    house: 8, lagna: "Cancer", planetSign: "Aquarius", planet: "Jupiter", page: 92,
    en: "Unable to rear Dharma, spends much, gentility in the house of enemies, deficiency of fame, follows obscure Dharma",
    ta: "தர்மத்தைக் காக்க முடியாது; அதிகம் செலவழிப்பார்; எதிரி வீட்டில் மென்மை; புகழில் குறை; தெளிவற்ற தர்மத்தைப் பின்பற்றுவார்.",
  },
  {
    house: 8, lagna: "Cancer", planetSign: "Aquarius", planet: "Venus", page: 94,
    en: "Gets advantage through tactics, dissatisfaction from the house of mother, good longevity, very clever",
    ta: "உபாயங்களால் ஆதாயம்; தாயின் வீட்டில் அதிருப்தி; நல்ல ஆயுள்; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 8, lagna: "Cancer", planetSign: "Aquarius", planet: "Saturn", page: 96,
    en: "Anxiety in life from the side of wife, father and sons, gets some deficiency in honour, weakness and perplexity in connection with his business and daily occupation, help from foreign countries, speaks somewhat bitterly, secretly very industrious",
    ta: "மனைவி, தந்தை, மகன்கள் வகையில் வாழ்வில் கவலை; மரியாதையில் சில குறை; தொழிலிலும் தினசரி வேலையிலும் பலவீனமும் குழப்பமும்; வெளிநாட்டு உதவி; சற்று கடுமையாகப் பேசுவார்; ரகசியமாக மிகவும் கடின உழைப்பாளி.",
  },
  {
    house: 8, lagna: "Cancer", planetSign: "Aquarius", planet: "Rahu", page: 97,
    en: "Gets power in the daily routine, works promptly, some problem in the stomach, anxiety in the daily routine",
    ta: "தினசரி வாழ்வில் ஆற்றல் பெறுவார்; விரைந்து வேலை செய்வார்; வயிற்றில் சில பிரச்சினை; தினசரி வாழ்வில் கவலை.",
  },
  {
    house: 8, lagna: "Cancer", planetSign: "Aquarius", planet: "Ketu", page: 100,
    en: "Some integral complaint in his stomach, spends life without anxiety, works hard",
    ta: "வயிற்றில் சில நிலையான குறைகள்; கவலையின்றி வாழ்வார்; கடினமாக உழைப்பார்.",
  },
  {
    house: 8, lagna: "Leo", planetSign: "Pisces", planet: "Sun", page: 105,
    en: "Lives in some other place, is very careful in earning wealth, some fatigue in the body, experiences some seclusion",
    ta: "வேறு ஊரில் வாழ்வார்; செல்வம் ஈட்டுவதில் மிகக் கவனம்; உடலில் சில சோர்வு; சில தனிமை.",
  },
  {
    house: 8, lagna: "Leo", planetSign: "Pisces", planet: "Moon", page: 107,
    en: "Manages expenditure, feels some deficiency in the house of the daily routine of life, weakness in the storage of wealth, some anxiety in the age",
    ta: "செலவை நிர்வகிப்பார்; தினசரி வாழ்வில் சில குறை; செல்வம் சேமிப்பதில் பலவீனம்; வயது பற்றி சில கவலை.",
  },
  {
    house: 8, lagna: "Leo", planetSign: "Pisces", planet: "Mars", page: 109,
    en: "Gets many hindrances in happiness and peace, troubles in the house of mother, weakness of residential building, deficiency in acquiring fame, knowledge of secret methods",
    ta: "மகிழ்ச்சிக்கும் அமைதிக்கும் பல தடைகள்; தாய் வீட்டில் தொல்லைகள்; குடியிருப்புக் கட்டிடத்தில் பலவீனம்; புகழ் பெறுவதில் குறை; ரகசிய வழிகள் தெரிந்தவர்.",
  },
  {
    house: 8, lagna: "Leo", planetSign: "Pisces", planet: "Mercury", page: 111,
    en: "Great loss in the house of wealth, accumulates wealth through very difficult deeds, restlessness in the house of longevity and in the daily routine of life, anxiety in life",
    ta: "செல்வ வீட்டில் பெரும் இழப்பு; மிகக் கடினமான செயல்களால் செல்வம் சேர்ப்பார்; ஆயுள் வீட்டிலும் தினசரி வாழ்விலும் அமைதியின்மை; வாழ்வில் கவலை.",
  },
  {
    house: 8, lagna: "Leo", planetSign: "Pisces", planet: "Jupiter", page: 113,
    en: "Increased longevity, bears troubles from children, some deficiency in the house of education, some loss in the house of mother, deficiency in the house of happiness",
    ta: "ஆயுள் அதிகரிக்கும்; குழந்தைகள் வகையில் துன்பம்; கல்வி வீட்டில் சில குறை; தாய் வீட்டில் சில இழப்பு; மகிழ்ச்சி வீட்டில் குறை.",
  },
  {
    house: 8, lagna: "Leo", planetSign: "Pisces", planet: "Venus", page: 115,
    en: "Conducts business in far-off foreign countries, gets a curious sort of happiness in connection with his brothers, sisters and father, deficiency in the house of wealth",
    ta: "தொலைதூர வெளிநாடுகளில் வணிகம் நடத்துவார்; சகோதர சகோதரிகள், தந்தை வகையில் ஒருவித விசித்திர மகிழ்ச்சி; செல்வ வீட்டில் குறை.",
  },
  {
    house: 8, lagna: "Leo", planetSign: "Pisces", planet: "Saturn", page: 117,
    en: "Sexual loss in the house of wife, faces hardships in the house of daily occupation, collaboration with foreign countries, distress in the side of children, some loss in the house of occupation, some despair in the house of longevity, puts in great efforts for use in government and society",
    ta: "மனைவி வீட்டில் பாலியல் இழப்பு; தொழில் வீட்டில் கடின சிரமங்கள்; வெளிநாட்டு கூட்டுறவு; குழந்தைகள் வகையில் துன்பம்; தொழில் வீட்டில் சில இழப்பு; ஆயுள் வீட்டில் சில நம்பிக்கையின்மை; அரசு, சமூகத்தில் பயன்படுத்த பெரும் முயற்சி.",
  },
  {
    house: 8, lagna: "Leo", planetSign: "Pisces", planet: "Rahu", page: 119,
    en: "Many perplexities in the house of daily routine of life, some inner trouble in the stomach, fatal losses in the house of longevity after bearing many hardships",
    ta: "தினசரி வாழ்வில் பல குழப்பங்கள்; வயிற்றில் சில உள் தொல்லை; ஆயுள் வீட்டில் பல சிரமங்களுக்குப் பின் ஆபத்தான இழப்புகள்.",
  },
  {
    house: 8, lagna: "Leo", planetSign: "Pisces", planet: "Ketu", page: 121,
    en: "Great perplexities in the house of daily routine of his life, some internal trouble in his stomach, fatal loss in the house of age",
    ta: "தினசரி வாழ்வில் பெரும் குழப்பம்; வயிற்றில் சில உள் தொல்லை; வயது வீட்டில் ஆபத்தான இழப்பு.",
  },
  {
    house: 8, lagna: "Virgo", planetSign: "Aries", planet: "Sun", page: 126,
    en: "Spends much, gets some weakness in the pursuits of accumulated wealth, gets some weakness in the house of family, gets the conjunction of foreign countries, etc",
    ta: "அதிகம் செலவழிப்பார்; சேர்த்த செல்வத்தை பின்தொடர்வதில் சில பலவீனம்; குடும்ப வீட்டில் சில பலவீனம்; வெளிநாட்டுத் தொடர்பு.",
  },
  {
    house: 8, lagna: "Virgo", planetSign: "Aries", planet: "Moon", page: 128,
    en: "Is worried of gains due to relation with tough centres, efforts to get wealth, bears mental distress, always likes the increase in wealth, family and destiny",
    ta: "கடின மையங்களுடனான தொடர்பால் ஆதாயம் பற்றிக் கவலை; செல்வம் ஈட்ட முயற்சி; மன வேதனை; செல்வம், குடும்பம், விதி ஆகியவற்றின் உயர்வை எப்போதும் விரும்புவார்.",
  },
  {
    house: 8, lagna: "Virgo", planetSign: "Aries", planet: "Mars", page: 130,
    en: "Has a long life, some deficiency in the side of gains, some loss in the side of brother, gets some deficiency in handling wealth and hard labour",
    ta: "நீண்ட ஆயுள்; ஆதாயத்தில் சில குறை; சகோதரர் வகையில் சில இழப்பு; செல்வத்தைக் கையாள்வதில் சில குறை; கடின உழைப்பு.",
  },
  {
    house: 8, lagna: "Virgo", planetSign: "Aries", planet: "Mercury", page: 132,
    en: "Some loss or distress in the happiness in his body and father, feels unhappy and weak in his heart in connection with progress, lives in foreign countries, engaged in the schemes of increasing wealth, bears troubles in business",
    ta: "உடலிலும் தந்தை வகையிலும் சில இழப்பு அல்லது துன்பம்; முன்னேற்றத்தில் மனச்சோர்வும் இதய பலவீனமும்; வெளிநாடுகளில் வாழ்வார்; செல்வம் பெருக்கும் திட்டங்களில் ஈடுபடுவார்; தொழிலில் தொல்லைகள்.",
  },
  {
    house: 8, lagna: "Virgo", planetSign: "Aries", planet: "Jupiter", page: 134,
    en: "Much suffering in the family life, some deficiency in the house of mother, bears distress and separation on the side of wife, gets success on the side of daily occupation bearing great hindrances, spends much, makes efforts to hoard wealth",
    ta: "குடும்ப வாழ்வில் பெரும் துன்பம்; தாய் வீட்டில் சில குறை; மனைவி வகையில் பிரிவும் துன்பமும்; பெரும் தடைகளுக்கிடையே தினசரி தொழிலில் வெற்றி; அதிகம் செலவழிப்பார்; செல்வம் சேமிக்க முயல்வார்.",
  },
  {
    house: 8, lagna: "Virgo", planetSign: "Aries", planet: "Venus", page: 137,
    en: "Gets weakness in family and destiny, some weakness in religion, gets success in foreign countries",
    ta: "குடும்பத்திலும் விதியிலும் பலவீனம்; தர்மத்தில் சில பலவீனம்; வெளிநாடுகளில் வெற்றி.",
  },
  {
    house: 8, lagna: "Virgo", planetSign: "Aries", planet: "Saturn", page: 139,
    en: "Great distress in the side of children, gets little education, is very skilful in business occupation, is talkative, takes tobacco etc, gets stomach troubles and the disease of anus",
    ta: "குழந்தைகள் வகையில் பெரும் துன்பம்; குறைந்த கல்வி; தொழிலில் மிகவும் திறமையானவர்; பேச்சாளர்; புகையிலை போன்றவற்றைப் பயன்படுத்துவார்; வயிற்றுத் தொல்லையும் ஆசனவாய் நோயும்.",
  },
  {
    house: 8, lagna: "Virgo", planetSign: "Aries", planet: "Rahu", page: 141,
    en: "Bears great troubles and feels unhappy during his life, great trouble in the house of age, gets diseases in the stomach and in the anus",
    ta: "வாழ்நாளில் பெரும் தொல்லைகளும் மகிழ்ச்சியின்மையும்; ஆயுள் வீட்டில் பெரும் சிரமம்; வயிறு, ஆசனவாயில் நோய்கள்.",
  },
  {
    house: 8, lagna: "Virgo", planetSign: "Aries", planet: "Ketu", page: 143,
    en: "Highly restless in his life, passes his days with great difficulties, gets some disease in the lower parts of stomach (below naval or in anus), meets with some major accident every time in life, full of anxieties, does some hard labour",
    ta: "வாழ்வில் பெரும் அமைதியின்மை; கடினங்களுடன் நாட்களைக் கடத்துவார்; அடிவயிற்றின் கீழ்ப்பகுதியிலும் ஆசனவாயிலும் சில நோய்; ஒவ்வொரு முறையும் பெரிய விபத்தைச் சந்திப்பார்; முழு கவலைகள்; சில கடின உழைப்பு.",
  },
  {
    house: 8, lagna: "Libra", planetSign: "Taurus", planet: "Sun", page: 147,
    en: "Bears worries about income, gains in foreign countries, is careful about accumulating wealth, gets the hereditary gains, spends a laborious life and develops the family",
    ta: "வருமானம் பற்றிய கவலை; வெளிநாட்டில் ஆதாயம்; செல்வம் சேர்ப்பதில் கவனம்; பரம்பரை ஆதாயம்; கடின வாழ்வு, குடும்பத்தை வளர்ப்பார்.",
  },
  {
    house: 8, lagna: "Libra", planetSign: "Taurus", planet: "Moon", page: 149,
    en: "Weakness in the house of father, weakness in the house of wealth, gets honour from foreign countries, dies a painful death, praised ate death",
    ta: "தந்தை வீட்டில் பலவீனம்; செல்வ வீட்டில் பலவீனம்; வெளிநாடுகளில் மரியாதை; வேதனையான மரணம், ஆனால் மரணத்துக்குப் பின் புகழப்படுவார்.",
  },
  {
    house: 8, lagna: "Libra", planetSign: "Taurus", planet: "Mars", page: 151,
    en: "Loss of the present wealth, perplexity in occupation, gets distress in wife and family, some bondage in the house of brothers and sisters",
    ta: "தற்போதைய செல்வ இழப்பு; தொழிலில் குழப்பம்; மனைவி, குடும்பத்தில் துன்பம்; சகோதர சகோதரிகள் வீட்டில் சில கட்டுப்பாடு.",
  },
  {
    house: 8, lagna: "Libra", planetSign: "Taurus", planet: "Mercury", page: 153,
    en: "Feels distress in destiny, weakness and restlessness in connection with expenditure, some firmness in age, dies a peaceful death",
    ta: "விதியில் துன்பம்; செலவில் பலவீனமும் அமைதியின்மையும்; வயதில் சில உறுதி; அமைதியான மரணம்.",
  },
  {
    house: 8, lagna: "Libra", planetSign: "Taurus", planet: "Jupiter", page: 155,
    en: "Experiences great weakness, works with great secret policies, spends much, feels weakness in the house of mother, land and happiness",
    ta: "பெரும் பலவீனம்; பெரும் ரகசிய உபாயங்களால் வேலை செய்வார்; அதிகம் செலவழிப்பார்; தாய், நிலம், மகிழ்ச்சி வீட்டில் பலவீனம்.",
  },
  {
    house: 8, lagna: "Libra", planetSign: "Taurus", planet: "Venus", page: 157,
    en: "Has a long life, some deficiency in the body, makes whole-hearted attempt to get wealth, wants family",
    ta: "நீண்ட ஆயுள்; உடலில் சில குறை; செல்வம் ஈட்ட முழு முயற்சி; குடும்பத்தை விரும்புவார்.",
  },
  {
    house: 8, lagna: "Libra", planetSign: "Taurus", planet: "Saturn", page: 159,
    en: "Is a diplomat, thinks about remote things, deficiency in the side of education and children, separation in the house of mother, deficiency in the house of wealth, possesses some mysterious knowledge",
    ta: "இராஜதந்திரி; தொலைதூர விஷயங்களைப் பற்றி சிந்திப்பார்; கல்வி, குழந்தைகள் வகையில் குறை; தாய் வீட்டில் பிரிவு; செல்வ வீட்டில் குறை; சில மர்ம அறிவு.",
  },
  {
    house: 8, lagna: "Libra", planetSign: "Taurus", planet: "Rahu", page: 160,
    en: "Some distress in life, spends the daily routine in an improper way, gets some disorders of stomach or constipation or disorder in anus or in the lower part of stomach, loss in hereditary wealth, fatal blows in the house of longevity",
    ta: "வாழ்வில் சில துன்பம்; தினசரி வாழ்வை முறையற்ற விதத்தில் நடத்துவார்; வயிற்றுக் கோளாறு, மலச்சிக்கல், அல்லது ஆசனவாய் அல்லது வயிற்றின் கீழ்ப்பகுதியில் கோளாறு; பரம்பரைச் செல்வத்தில் இழப்பு; ஆயுள் வீட்டில் ஆபத்தான அடிகள்.",
  },
  {
    house: 8, lagna: "Libra", planetSign: "Taurus", planet: "Ketu", page: 163,
    en: "Gets some restlessness in his life, some weakness and incompleteness in his daily routine, weakness in hereditary wealth, has some stomach disorder",
    ta: "வாழ்வில் சில அமைதியின்மை; தினசரி வாழ்வில் சில பலவீனமும் குறையும்; பரம்பரைச் செல்வத்தில் பலவீனம்; வயிற்றில் சில கோளாறு.",
  },
  {
    house: 8, lagna: "Scorpio", planetSign: "Gemini", planet: "Sun", page: 168,
    en: "Gets loss in the house of father, feels deficiency in respect and honour, tries hard in many foreign countries, bears troubles to achieve progress, puts in many efforts in getting wealth, gets progress in longevity and in the daily routine of life",
    ta: "தந்தை வீட்டில் இழப்பு; மரியாதையில் குறை; பல வெளிநாடுகளில் கடுமையாக முயல்வார்; முன்னேற்றத்துக்கு சிரமங்களைத் தாங்குவார்; செல்வம் ஈட்ட பல முயற்சிகள்; ஆயுளிலும் தினசரி வாழ்விலும் முன்னேற்றம்.",
  },
  {
    house: 8, lagna: "Scorpio", planetSign: "Gemini", planet: "Moon", page: 171,
    en: "Bears mental distress, feces many troubles, has many mental anxieties for the increase of wealth, injures Dharma, gets good age, does not care for justice or injustice for getting wealth",
    ta: "மன வேதனை; பல தொல்லைகளைச் சந்திப்பார்; செல்வம் பெருக்க பல மன கவலைகள்; தர்மத்தைக் காயப்படுத்துவார்; நல்ல வயது; செல்வம் பெற நீதி அநீதியைக் கருதார்.",
  },
  {
    house: 8, lagna: "Scorpio", planetSign: "Gemini", planet: "Mars", page: 173,
    en: "Gets diseases, gets inflammation of heart, lives in a foreign place, engulfed in troubles, gains wealth after putting in efforts, loves his brother very much, does not care about insult",
    ta: "நோய்கள்; இதய வீக்கம்; அயல் நாட்டில் வாழ்வார்; தொல்லைகளில் சிக்குவார்; முயற்சிக்குப் பின் செல்வம் பெறுவார்; சகோதரர் மீது மிகுந்த அன்பு; அவமானத்தைப் பொருட்படுத்தார்.",
  },
  {
    house: 8, lagna: "Scorpio", planetSign: "Gemini", planet: "Mercury", page: 175,
    en: "Gets a long life, gets glory and grandeur in the daily routine of life, is very careless and uses both strictness and tenderness in the daily routine of life",
    ta: "நீண்ட ஆயுள்; தினசரி வாழ்வில் பெருமையும் சிறப்பும்; மிகவும் அசட்டையானவர்; தினசரி வாழ்வில் கண்டிப்பும் மென்மையும் இரண்டையும் கையாள்வார்.",
  },
  {
    house: 8, lagna: "Scorpio", planetSign: "Gemini", planet: "Jupiter", page: 177,
    en: "Gets little education and little wealth, has distress in the side of children, restless in heart, spends much in order to earn more wealth, gets the work done through hard labour, contact with foreign countries and also for wealth, some insipidness in the means of happiness, about buildings and mother, gets a long life, fives like a rich man",
    ta: "குறைந்த கல்வியும் குறைந்த செல்வமும்; குழந்தைகள் வகையில் துன்பம்; மனத்தில் அமைதியின்மை; மேலும் செல்வம் பெற அதிகம் செலவழிப்பார்; கடின உழைப்பால் வேலை சாதிப்பார்; வெளிநாட்டுத் தொடர்பு; வாழ்வின் இன்ப வழிகளில் சில சுவையின்மை; கட்டிடங்கள், தாய் பற்றி; நீண்ட ஆயுள்; செல்வந்தர் போல வாழ்வார்.",
  },
  {
    house: 8, lagna: "Scorpio", planetSign: "Gemini", planet: "Venus", page: 179,
    en: "Some loss in the house of wife, manages the occupation through some difficulties, faces hindrances in the occupation and is able to manage the same very much for the increase of wealth, experiences heavy deficiency in the sexual pleasures, pursues secret policies",
    ta: "மனைவி வீட்டில் சில இழப்பு; சில சிரமங்களுடன் தொழிலை நடத்துவார்; தொழிலில் தடைகள், ஆனால் செல்வம் பெருக்குவதில் நன்கு நிர்வகிப்பார்; பாலியல் இன்பத்தில் பெரும் குறை; ரகசிய உபாயங்கள்.",
  },
  {
    house: 8, lagna: "Scorpio", planetSign: "Gemini", planet: "Saturn", page: 181,
    en: "Loss of happiness from others' side, restlessness from brothers and sisters, gets a long life, restlessness in the house of father, goes to foreign countries",
    ta: "பிறரிடமிருந்து இன்பம் இழப்பு; சகோதர சகோதரிகள் வகையில் அமைதியின்மை; நீண்ட ஆயுள்; தந்தை வீட்டில் அமைதியின்மை; வெளிநாடுகளுக்குச் செல்வார்.",
  },
  {
    house: 8, lagna: "Scorpio", planetSign: "Gemini", planet: "Rahu", page: 183,
    en: "Thinks of a great grandeur in his life, shows force and coquetry, thinks very deeply on the obscure and mysterious matters, gets a long life",
    ta: "வாழ்வில் பெரும் பெருமையை நினைப்பார்; வலிமையும் கவர்ச்சியும் காட்டுவார்; தெளிவற்ற, மர்மமான விஷயங்களை ஆழமாக சிந்திப்பார்; நீண்ட ஆயுள்.",
  },
  {
    house: 8, lagna: "Scorpio", planetSign: "Gemini", planet: "Ketu", page: 185,
    en: "Experiences great unhappiness, remains disturbed, some weakness in longevity, has a clumsy daily routine, gets some disease in anus or stomach",
    ta: "பெரும் துன்பம்; மனத்தில் கலக்கம்; ஆயுளில் சில பலவீனம்; தினசரி வாழ்வு ஒழுங்கற்றது; ஆசனவாயிலோ வயிற்றிலோ சில நோய்.",
  },
  {
    house: 8, lagna: "Sagittarius", planetSign: "Cancer", planet: "Sun", page: 190,
    en: "Loss in connection with destiny, gets rise of fortune from foreign countries a bit late with great difficulty, spends the life in a very decent and influential manner, gets the increase of age",
    ta: "விதி வகையில் இழப்பு; அயல்நாடுகளால் அதிர்ஷ்ட உயர்வு, ஆனால் சற்று தாமதமாகவும் பெரும் சிரமத்துடனும்; வாழ்வில் மிகவும் கண்ணியமாகவும் செல்வாக்குடனும் வாழ்வார்; வயது கூடும்.",
  },
  {
    house: 8, lagna: "Sagittarius", planetSign: "Cancer", planet: "Moon", page: 192,
    en: "Has a long life, possesses deep knowledge of the power of concentration, gets hereditary advantage, faces some loss in the house of wealth",
    ta: "நீண்ட ஆயுள்; ஒருமுக சிந்தனையின் ஆழ்ந்த அறிவு; பரம்பரை ஆதாயம்; செல்வ வீட்டில் சில இழப்பு.",
  },
  {
    house: 8, lagna: "Sagittarius", planetSign: "Cancer", planet: "Mars", page: 194,
    en: "Faces some special trouble in the children's side, gets deficiency in education, feels greatly troubled in matters of expenditure, has a short life, uses secrecies, bears loss in the house of brother, tries very hard for income and gains, gets some disease in anus",
    ta: "குழந்தைகள் வகையில் சிறப்புத் துன்பம்; கல்வியில் குறை; செலவு விஷயங்களில் பெரும் சிரமம்; குறுகிய ஆயுள்; ரகசியங்களைப் பயன்படுத்துவார்; சகோதரர் வீட்டில் இழப்பு; வருமானத்துக்கும் ஆதாயத்துக்கும் பெரும் முயற்சி; ஆசனவாயில் சில நோய்.",
  },
  {
    house: 8, lagna: "Sagittarius", planetSign: "Cancer", planet: "Mercury", page: 196,
    en: "Bears loss and perplexity in the business occupation, frees loss in the house of wife, gets the conjunction of work in foreign countries, tries hard for the increase of wealth, has some deficiency in sexual pleasures",
    ta: "தொழில் வணிகத்தில் இழப்பும் குழப்பமும்; மனைவி வீட்டில் இழப்பு; வெளிநாடுகளில் வேலை சேர்க்கை; செல்வம் பெருக்க பெரும் முயற்சி; பாலியல் இன்பத்தில் சில குறை.",
  },
  {
    house: 8, lagna: "Sagittarius", planetSign: "Cancer", planet: "Jupiter", page: 198,
    en: "Enjoys unique powers, elegance and splendour in his daily routine and in his life, faces some weakness in the side of wealth, spends much, lives in a majestic style but feels some weakness in his position gets land and property, gets the power of mother",
    ta: "தனித்துவமான ஆற்றல்கள், தினசரி வாழ்விலும் வாழ்விலும் நயமும் ஒளியும்; செல்வ வகையில் சில பலவீனம்; அதிகம் செலவழிப்பார்; கம்பீர வாழ்வு, ஆனால் நிலையில் சில பலவீனம்; நிலமும் சொத்தும் பெறுவார்; தாய் வழியில் ஆற்றல்.",
  },
  {
    house: 8, lagna: "Sagittarius", planetSign: "Cancer", planet: "Venus", page: 200,
    en: "Bears numerous worries for getting gains and income, some elegance in daily routine of life, deficiency in gains, suppresses the enemies",
    ta: "ஆதாயமும் வருமானமும் பெற பல கவலைகள்; தினசரி வாழ்வில் சில நயம்; ஆதாயத்தில் குறை; எதிரிகளை அடக்குவார்.",
  },
  {
    house: 8, lagna: "Sagittarius", planetSign: "Cancer", planet: "Saturn", page: 202,
    en: "Gets deficiency of wealth and manpower, is unhappy, gets loss in wealth, has a deficiency in education and intellect, has a long life, possesses secret wisdom",
    ta: "செல்வமும் ஆளும் பலமும் குறைவு; மகிழ்ச்சியற்றவர்; செல்வ இழப்பு; கல்வி, அறிவில் குறை; நீண்ட ஆயுள்; ரகசிய ஞானம் உண்டு.",
  },
  {
    house: 8, lagna: "Sagittarius", planetSign: "Cancer", planet: "Rahu", page: 204,
    en: "Bears perplexities in his life, complaints about stomach and anus, gets difficulty in the daily routine of life, faces the secret anxieties, and finds happiness in travelling in foreign countries",
    ta: "வாழ்வில் குழப்பங்கள்; வயிறு, ஆசனவாய் பற்றிய புகார்கள்; தினசரி வாழ்வில் சிரமம்; மறைமுக கவலைகள்; வெளிநாட்டுப் பயணத்தில் மகிழ்ச்சி.",
  },
  {
    house: 8, lagna: "Sagittarius", planetSign: "Cancer", planet: "Ketu", page: 206,
    en: "Great troubles in his life, gets complaints in stomach, lower part of the body or anus, bears many worries in the daily routine, is rude and works patiently",
    ta: "வாழ்வில் பெரும் தொல்லைகள்; வயிறு, அடிப்பகுதி அல்லது ஆசனவாயில் புகார்கள்; தினசரி வாழ்வில் பல கவலைகள்; முரட்டுத்தனமானவர்; பொறுமையாக வேலை செய்வார்.",
  },
  {
    house: 8, lagna: "Capricorn", planetSign: "Leo", planet: "Sun", page: 211,
    en: "Lives long, spends influential life, loss of money, gets family affliction, has a power of secrecy, feels dignified in his living, does not care at all about his future, is haughty, and is of grumbling nature",
    ta: "நீண்ட ஆயுள்; செல்வாக்கான வாழ்வு; பண இழப்பு; குடும்பத்தில் துன்பம்; ரகசியத் திறன்; வாழ்வில் கம்பீரம்; தன் எதிர்காலத்தைப் பற்றி சிறிதும் கவலைப்படார்; கர்வமும் முணுமுணுப்பும்.",
  },
  {
    house: 8, lagna: "Capricorn", planetSign: "Leo", planet: "Moon", page: 213,
    en: "Bears loss in wife's house, bears mental affliction on account of family affairs, gets deficiency in the side of sexual pleasures, bears difficulties in occupation, gets secret knowledge",
    ta: "மனைவி வீட்டில் இழப்பு; குடும்ப விவகாரங்களில் மன வேதனை; பாலியல் இன்பத்தில் குறை; தொழிலில் சிரமங்கள்; ரகசிய அறிவு.",
  },
  {
    house: 8, lagna: "Capricorn", planetSign: "Leo", planet: "Mars", page: 215,
    en: "Gains much, separation from mother, gets happiness in longevity, happiness in the daily routine of life, unhappiness in domestic pleasures, works courageously and diligently",
    ta: "பெரும் ஆதாயம்; தாயைப் பிரிவார்; நீண்ட ஆயுளில் மகிழ்ச்சி; தினசரி வாழ்வில் மகிழ்ச்சி; குடும்ப இன்பங்களில் அமைதியின்மை; தைரியமாகவும் கடினமாகவும் வேலை செய்வார்.",
  },
  {
    house: 8, lagna: "Capricorn", planetSign: "Leo", planet: "Mercury", page: 217,
    en: "Gets weak destiny, weakness in the side of Dharma, uses the tactics for the increased of wealth, gets a long age and is selfish",
    ta: "பலவீனமான விதி; தர்ம வகையில் பலவீனம்; செல்வம் பெருக்கத் தந்திரங்கள்; நீண்ட வயது; சுயநலம்.",
  },
  {
    house: 8, lagna: "Capricorn", planetSign: "Leo", planet: "Jupiter", page: 219,
    en: "Has weakness in his strength and energy, faces hindrances in connection with expenditure and spends much, gets gains from foreign countries, gets weakness in connection with brothers and sisters, has deficiency in the house of accumulating wealth, spends the daily routine of life influentially and with dignity",
    ta: "ஆற்றலிலும் வலிமையிலும் பலவீனம்; செலவில் தடைகள், அதிகம் செலவழிப்பார்; வெளிநாடுகளில் ஆதாயம்; சகோதர சகோதரிகள் வகையில் பலவீனம்; செல்வம் சேமிக்கும் வீட்டில் குறை; தினசரி வாழ்வை செல்வாக்குடனும் கம்பீரத்துடனும் நடத்துவார்.",
  },
  {
    house: 8, lagna: "Capricorn", planetSign: "Leo", planet: "Venus", page: 221,
    en: "Bears loss of father, has deficiency in education, talks by concealing things, tries to get honour in the government and society, has some deficiency in the progress of business, but pays attention to increase the wealth",
    ta: "தந்தை இழப்பு; கல்வியில் குறை; மறைத்துப் பேசுவார்; அரசு, சமூகத்தில் மரியாதை பெற முயல்வார்; வணிகத்தில் சில முன்னேற்றக் குறை; ஆனால் செல்வம் பெருக்குவதில் கவனம்.",
  },
  {
    house: 8, lagna: "Capricorn", planetSign: "Leo", planet: "Saturn", page: 223,
    en: "Lives in foreign countries and bears troubles in the body, bears the loss of wealth, gets education and children, gets a long age, faces hindrances in accumulating wealth, is very industrious",
    ta: "வெளிநாடுகளில் வாழ்வார், உடலில் சில துன்பம்; செல்வ இழப்பு; கல்வியும் குழந்தைகளும் பெறுவார்; நீண்ட வயது; செல்வம் சேர்ப்பதில் தடைகள்; மிகவும் உழைப்பாளி.",
  },
  {
    house: 8, lagna: "Capricorn", planetSign: "Leo", planet: "Rahu", page: 225,
    en: "Is worried, gets diseases in the stomach below navel, bears agony in daily routine of life, bears blows over longevity, injures the legacy, faces distress in travelling to foreign countries, wants to increase wealth",
    ta: "கவலையுடன் இருப்பார்; தொப்புளுக்குக் கீழ் நோய்கள்; தினசரி வாழ்வில் வேதனை; ஆயுளுக்கு அடிகள்; பரம்பரைச் சொத்துக்கு கேடு; வெளிநாட்டுப் பயணத்தில் துன்பம்; செல்வம் பெருக்க விருப்பம்.",
  },
  {
    house: 8, lagna: "Capricorn", planetSign: "Leo", planet: "Ketu", page: 227,
    en: "Bears troubles and disorder in the stomach below navel, bears worries in daily routine of life, gets blows on the age, gets distress in connection with travelling",
    ta: "தொப்புளுக்குக் கீழ் வயிற்றில் தொல்லையும் கோளாறும்; தினசரி வாழ்வில் கவலைகள்; வயதில் அடிகள்; பயணத்தில் துன்பம்.",
  },
  {
    house: 8, lagna: "Aquarius", planetSign: "Virgo", planet: "Sun", page: 232,
    en: "Faces restlessness and distress in the house of wife, has deficiency in the side of sexual pleasures, bears hardship in the line of occupation, gets the association from foreign countries in occupation, faces some troubles and separation in the house of family, has some defect in organs",
    ta: "மனைவி வீட்டில் அமைதியின்மையும் துன்பமும்; பாலியல் இன்பத்தில் குறை; தொழிலில் சிரமம்; வெளிநாடுகளிலிருந்து தொழில் தொடர்பு; குடும்பத்தில் சில தொல்லையும் பிரிவும்; உறுப்புகளில் சில குறை.",
  },
  {
    house: 8, lagna: "Aquarius", planetSign: "Virgo", planet: "Moon", page: 235,
    en: "Bears perplexities in the side of enemies, gets some stomach troubles, tries hard for the increase of wealth, and is of disturbed mind",
    ta: "எதிரிகள் வகையில் குழப்பம்; வயிற்றில் சில தொல்லை; செல்வம் பெருக்க கடினமாக முயல்வார்; மனம் அமைதியற்றது.",
  },
  {
    house: 8, lagna: "Aquarius", planetSign: "Virgo", planet: "Mars", page: 237,
    en: "Bears loss in the house of father, has debilitated powers from brothers and sisters, acquires the income by very hard labour, has deficiency in honour and respect, has deficiency in dress",
    ta: "தந்தை வீட்டில் இழப்பு; சகோதர சகோதரிகளிடமிருந்து பலவீனமான ஆற்றல்; மிகக் கடின உழைப்பால் வருமானம்; மரியாதையிலும் கௌரவத்திலும் குறை; உடையில் குறை.",
  },
  {
    house: 8, lagna: "Aquarius", planetSign: "Virgo", planet: "Mercury", page: 239,
    en: "Has some weakness in education, gets long age, some distress in the children side, neglects accumulated wealth, talks very cleverly",
    ta: "கல்வியில் சில பலவீனம்; நீண்ட வயது; குழந்தைகள் வகையில் சில துன்பம்; சேர்த்த செல்வத்தை அலட்சியம் செய்வார்; சாமர்த்தியமாகப் பேசுவார்.",
  },
  {
    house: 8, lagna: "Aquarius", planetSign: "Virgo", planet: "Jupiter", page: 241,
    en: "Bears loss of men and wealth, labours hard and travels to foreign countries for income, even then does not get sufficient income, secures wealth occasionally",
    ta: "ஆள், செல்வ இழப்பு; கடின உழைப்பு; வருமானத்துக்காக வெளிநாடு செல்வார், ஆனாலும் போதுமான வருமானம் கிடைக்காது; சில நேரம் செல்வம் கிடைக்கும்.",
  },
  {
    house: 8, lagna: "Aquarius", planetSign: "Virgo", planet: "Venus", page: 243,
    en: "Great weakness in connection with Dharma, bears loss in mother's house, has deficiency in happiness, has weakness in land and buildings and property, has weakness in destiny, gets success late, faces great restlessness in foreign countries, tries to get more money",
    ta: "தர்மத்தில் பெரும் பலவீனம்; தாய் வீட்டில் இழப்பு; மகிழ்ச்சியில் குறை; நிலம், கட்டிடம், சொத்தில் பலவீனம்; விதியில் பலவீனம்; தாமதமாக வெற்றி; வெளிநாடுகளில் பெரும் அமைதியின்மை; மேலும் பணம் தேடுவார்.",
  },
  {
    house: 8, lagna: "Aquarius", planetSign: "Virgo", planet: "Saturn", page: 245,
    en: "Gets hidden strength, does dangerous deeds, gets a long life, gets some physical worries, faces enmity in father's house, gains some strength in children's side, gets education",
    ta: "மறைந்த வலிமை; ஆபத்தான செயல்கள்; நீண்ட ஆயுள்; சில உடல் கவலைகள்; தந்தை வீட்டில் பகை; குழந்தைகள் வகையில் சில வலிமை; கல்வி பெறுவார்.",
  },
  {
    house: 8, lagna: "Aquarius", planetSign: "Virgo", planet: "Rahu", page: 247,
    en: "Gets some dignity along with troubles in his life, faces some uneasiness in the house of hereditary property, gets some complaint in stomach and in the lower part of the body",
    ta: "வாழ்வில் துன்பங்களுடன் சில மரியாதை; பரம்பரைச் சொத்தின் வீட்டில் சில அமைதியின்மை; வயிற்றிலும் உடலின் கீழ்ப்பகுதியிலும் சில புகார்.",
  },
  {
    house: 8, lagna: "Aquarius", planetSign: "Virgo", planet: "Ketu", page: 249,
    en: "Feels worried in the daily routine of life, pays attention to the most obscure affairs, faces blows in the house of longevity, works fearlessly even in the fearful circumstances, is influential",
    ta: "தினசரி வாழ்வில் கவலை; மிக ரகசிய விவகாரங்களில் கவனம்; ஆயுள் வீட்டில் அடிகள்; அச்சமூட்டும் சூழ்நிலையிலும் அஞ்சாமல் வேலை செய்வார்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 8, lagna: "Pisces", planetSign: "Libra", planet: "Sun", page: 254,
    en: "Bears great restlessness and hindrances, gets some complaints about the disorder in stomach below navel, gets the work done in the enemies' house through diplomatic tactics, faces very severe calamities sometimes",
    ta: "பெரும் அமைதியின்மையும் தடைகளும்; தொப்புளுக்குக் கீழ் வயிற்றுக் கோளாறு பற்றிய புகார்; எதிரி வீட்டில் வேலையை ராஜதந்திரத்தால் சாதிப்பார்; சில நேரம் மிகக் கடுமையான ஆபத்துகளைச் சந்திப்பார்.",
  },
  {
    house: 8, lagna: "Pisces", planetSign: "Libra", planet: "Moon", page: 256,
    en: "Gets the deficiency in education, bears disease and deficiency in children's side, gets wealth after great labour, has elegance in the daily routine of life, acquires the progress in family",
    ta: "கல்வியில் குறை; நோயும் குழந்தைகள் வகையில் குறையும்; மிகுந்த உழைப்பால் செல்வம்; வாழ்வில் நயம்; குடும்ப முன்னேற்றம்.",
  },
  {
    house: 8, lagna: "Pisces", planetSign: "Libra", planet: "Mars", page: 258,
    en: "Has some weakness in the house of destiny, feces some loss in wealth, faces many obstacles in accumulating wealth, gains heavy income from foreign countries, gets good fortune in the daily routine of life, develops some enmity with brother",
    ta: "விதி வீட்டில் சில பலவீனம்; செல்வத்தில் சில இழப்பு; செல்வம் சேர்ப்பதில் பல தடைகள்; வெளிநாடுகளிலிருந்து பெரும் வருமானம்; தினசரி வாழ்வில் நல்ல அதிர்ஷ்டம்; சகோதரருடன் சில பகை.",
  },
  {
    house: 8, lagna: "Pisces", planetSign: "Libra", planet: "Mercury", page: 260,
    en: "Bears loss in mother's and wife's house, has some deficiency in lands and buildings, feces deficiency in happiness, manages the affairs through occupation, gets support from foreign countries, gets happiness of a long age, finds happiness in the daily routine of life",
    ta: "தாய், மனைவி வீட்டில் இழப்பு; நிலம், கட்டிடங்களில் சில குறை; மகிழ்ச்சியில் குறை; தொழிலால் விவகாரங்களை நிர்வகிப்பார்; வெளிநாடுகளிலிருந்து ஆதரவு; நீண்ட வயதின் மகிழ்ச்சி; தினசரி வாழ்வில் மகிழ்ச்சி.",
  },
  {
    house: 8, lagna: "Pisces", planetSign: "Libra", planet: "Jupiter", page: 262,
    en: "Gets respect by working majestically, finds distress from father's house, gets an emaciated body, faces obstacles in the progress, finds some dissatisfaction from government and society, remains worried in the house of expenditure, maintains some dignity in the daily routine of life",
    ta: "கம்பீரமாக வேலை செய்து மரியாதை பெறுவார்; தந்தை வீட்டில் துன்பம்; மெலிந்த உடல்; முன்னேற்றத்தில் தடைகள்; அரசு, சமூகத்தில் சில அதிருப்தி; செலவு வீட்டில் கவலை; தினசரி வாழ்வில் சில கௌரவம்.",
  },
  {
    house: 8, lagna: "Pisces", planetSign: "Libra", planet: "Venus", page: 265,
    en: "Gets increased age, gets great happiness in daily routine of life, bears some loss of energy, bears loss of brothers and sisters, tries hard to acquire wealth, is somewhat farsighted",
    ta: "வயது அதிகரிக்கும்; தினசரி வாழ்வில் பெரும் மகிழ்ச்சி; சில ஆற்றல் இழப்பு; சகோதர சகோதரிகள் இழப்பு; செல்வம் ஈட்ட கடினமாக முயல்வார்; சற்று தூரநோக்குடையவர்.",
  },
  {
    house: 8, lagna: "Pisces", planetSign: "Libra", planet: "Saturn", page: 267,
    en: "Spends life happily, spends income in a dignified way, gets a long life, has some weakness in accumulating wealth, faces some enmity with father, bears some losses and gains from the side of children",
    ta: "மகிழ்ச்சியுடன் வாழ்வார்; வருமானத்தை கௌரவமாகச் செலவழிப்பார்; நீண்ட ஆயுள்; செல்வம் சேர்ப்பதில் சில பலவீனம்; தந்தையுடன் சில பகை; குழந்தைகள் வகையில் சில இழப்பும் ஆதாயமும்.",
  },
  {
    house: 8, lagna: "Pisces", planetSign: "Libra", planet: "Rahu", page: 269,
    en: "Worried in the daily routine of life, gets some diseases below the stomach, gains firmness in daily routine of life after bearing numerous difficulties, gets fatal blows in the house of longevity, finds hindrance in going to foreign countries",
    ta: "தினசரி வாழ்வில் கவலை; வயிற்றுக்குக் கீழே சில நோய்கள்; பல சிரமங்களுக்குப் பின் தினசரி வாழ்வில் உறுதி; ஆயுள் வீட்டில் ஆபத்தான அடிகள்; வெளிநாடு செல்வதில் தடை.",
  },
  {
    house: 8, lagna: "Pisces", planetSign: "Libra", planet: "Ketu", page: 271,
    en: "Some restlessness in the daily routine of life, gets stomach disorders, experiences blows in connection with age, follows stable principles, and is obstinate",
    ta: "தினசரி வாழ்வில் சில அமைதியின்மை; வயிற்றுக் கோளாறுகள்; வயது தொடர்பாக அடிகள்; நிலையான கொள்கைகளைப் பின்பற்றுவார்; பிடிவாதமானவர்.",
  },
  {
    house: 9, lagna: "Aries", planetSign: "Sagittarius", planet: "Sun", page: 22,
    en: "Gets good education, improves his destiny by his wisdom, religious, happiness from sons, happiness from brothers and sisters, energetic, gets windfall, speaks justly, influential and learned",
    ta: "நல்ல கல்வி; ஞானத்தால் விதியை மேம்படுத்துவார்; தர்மத்தில் நாட்டம்; பிள்ளைகளால் மகிழ்ச்சி; உடன்பிறப்புகளால் மகிழ்ச்சி; ஆற்றல் மிக்கவர்; எதிர்பாராத ஆதாயம்; நியாயமாகப் பேசுவார்; செல்வாக்கும் கற்ற அறிவும் உள்ளவர்.",
  },
  {
    house: 9, lagna: "Aries", planetSign: "Sagittarius", planet: "Moon", page: 24,
    en: "Has good luck from the house of mother, acquires lands and buildings, gets Divine help, happy and satisfied, believes in Dharma, gets support from brothers and sisters, gains in industry",
    ta: "தாய் வீட்டிலிருந்து நல்ல அதிர்ஷ்டம்; நிலமும் வீடும் பெறுவார்; தெய்வ உதவி; மகிழ்ச்சியும் திருப்தியும்; தர்மத்தில் நம்பிக்கை; உடன்பிறப்புகளின் ஆதரவு; தொழிலில் ஆதாயம்.",
  },
  {
    house: 9, lagna: "Aries", planetSign: "Sagittarius", planet: "Mars", page: 26,
    en: "Fortunate, faces hindrances in the advancement of luck, gains from others and distant relatives, spends much, unhappy with motherly relations, careless about lands, peace and happiness, not happy with brotherly relations, showy in nature",
    ta: "அதிர்ஷ்டசாலி; விதியின் முன்னேற்றத்தில் தடைகள்; பிறரிடமிருந்தும் தொலைதூர உறவினர்களிடமிருந்தும் ஆதாயம்; அதிகம் செலவழிப்பார்; தாய் உறவில் அதிருப்தி; நிலத்தில் அக்கறையின்மை; மகிழ்ச்சியும் அமைதியும் குறைவு; உடன்பிறப்பு உறவில் அதிருப்தி; ஆடம்பர இயல்பு.",
  },
  {
    house: 9, lagna: "Aries", planetSign: "Sagittarius", planet: "Mercury", page: 28,
    en: "Success through industry, gets fame and power, not a strong believer in Dharma, help from brothers and sisters, cannot decide about the right and wrong approach for his betterment",
    ta: "உழைப்பால் வெற்றி; புகழும் அதிகாரமும்; தர்மத்தில் உறுதியான நம்பிக்கை குறைவு; உடன்பிறப்புகளின் உதவி; தன் முன்னேற்றத்துக்கு சரியான வழியா தவறான வழியா என்று முடிவு செய்ய முடியாது.",
  },
  {
    house: 9, lagna: "Aries", planetSign: "Sagittarius", planet: "Jupiter", page: 30,
    en: "Fortunate and gets good success in his activities, has Divine help, good intellect and education, happy with children, gets the cooperation of brothers and sisters, religious in outlook",
    ta: "அதிர்ஷ்டசாலி, செயல்களில் நல்ல வெற்றி; தெய்வ உதவி; நல்ல அறிவும் கல்வியும்; பிள்ளைகளால் மகிழ்ச்சி; உடன்பிறப்புகளின் ஒத்துழைப்பு; மதப் பார்வை.",
  },
  {
    house: 9, lagna: "Aries", planetSign: "Sagittarius", planet: "Venus", page: 32,
    en: "Very fortunate and clever, gets happiness from wife and family, earns wealth, follows Dharma, is brave and courageous",
    ta: "மிக அதிர்ஷ்டசாலி, சாமர்த்தியமானவர்; மனைவி, குடும்பத்தால் மகிழ்ச்சி; செல்வம் ஈட்டுவார்; தர்மத்தைக் கடைப்பிடிப்பார்; தைரியமும் வீரமும் உள்ளவர்.",
  },
  {
    house: 9, lagna: "Aries", planetSign: "Sagittarius", planet: "Saturn", page: 34,
    en: "Gains heavily by the house of destiny, gets the regular fixed income, fortunate, religious, no enemies, wins over the troubles and hindrances",
    ta: "விதியின் வீட்டிலிருந்து பெரும் ஆதாயம்; நிலையான வருமானம்; அதிர்ஷ்டசாலி; மதப்பற்று; எதிரிகள் இல்லாதவர்; தொல்லைகளையும் தடைகளையும் வெல்வார்.",
  },
  {
    house: 9, lagna: "Aries", planetSign: "Sagittarius", planet: "Rahu", page: 36,
    en: "Feels unhappy, has to face great anxieties and nervousness in connection with the progress of destiny, uses many improper schemes secretly, meets heavy losses in Dharma, irreligious, defamed and restless",
    ta: "மகிழ்ச்சியின்மை; விதியின் முன்னேற்றம் பற்றி மிகுந்த கவலையும் பதற்றமும்; ரகசியமாகப் பல தவறான திட்டங்களைப் பயன்படுத்துவார்; தர்மத்தில் பெரும் இழப்பு; மதப்பற்றின்மை; அவதூறும் அமைதியின்மையும்.",
  },
  {
    house: 9, lagna: "Aries", planetSign: "Sagittarius", planet: "Ketu", page: 38,
    en: "Works hard for the progress of destiny, progress through experiments of some hidden places, irreligious but does not blame Dharma",
    ta: "விதியின் முன்னேற்றத்துக்காக கடுமையாக உழைப்பார்; மறைந்த இடங்களின் சோதனைகள் மூலம் முன்னேற்றம்; மதப்பற்று குறைவு, ஆனால் தர்மத்தைக் குறை கூறார்.",
  },
  {
    house: 9, lagna: "Taurus", planetSign: "Capricorn", planet: "Sun", page: 43,
    en: "Happiness from mother and gain of lands and buildings, becomes dharmic, some happiness from brothers and sisters, and is fortunate",
    ta: "தாயால் மகிழ்ச்சி; நிலமும் வீடும் பெறுவார்; தர்மவானாவார்; உடன்பிறப்புகளால் சில மகிழ்ச்சி; அதிர்ஷ்டசாலி.",
  },
  {
    house: 9, lagna: "Taurus", planetSign: "Capricorn", planet: "Moon", page: 45,
    en: "Gets favour through destiny, gets the good union of brothers and sisters, dharmic in nature, believes in God and is happy",
    ta: "விதியின் வலிமையால் அருள்; உடன்பிறப்புகளின் நல்ல ஒற்றுமை; தர்ம சிந்தனை; இறைநம்பிக்கை; மகிழ்ச்சி.",
  },
  {
    house: 9, lagna: "Taurus", planetSign: "Capricorn", planet: "Mars", page: 47,
    en: "Huge expenditure through profession, not dharmic, disputes with brothers and sisters, loss through mother and unhappy with regard to children, gets influence of wife, gets exhausted",
    ta: "தொழிலில் பெரும் செலவு; தர்மத்தில் நாட்டமில்லை; உடன்பிறப்புகளுடன் சச்சரவு; தாய் வகையில் இழப்பு; பிள்ளைகள் பற்றி அதிருப்தி; மனைவியின் செல்வாக்கு; சோர்வு.",
  },
  {
    house: 9, lagna: "Taurus", planetSign: "Capricorn", planet: "Mercury", page: 49,
    en: "Acquires good education and also gets wealth, fortunate in having children, has belief in God, help from brothers and sisters",
    ta: "நல்ல கல்வியும் செல்வமும்; பிள்ளைகளால் அதிர்ஷ்டம்; இறைநம்பிக்கை; உடன்பிறப்புகளின் உதவி.",
  },
  {
    house: 9, lagna: "Taurus", planetSign: "Capricorn", planet: "Jupiter", page: 51,
    en: "Heavy loss in the house of destiny and also Dharma, some health problem, feels restless in daily routine, injures Dharma a little to acquire gains, gets weakness in the house of income and great weakness in the house of God, uses cleverness in the house of children, some cooperation from brothers and sisters",
    ta: "விதி வீட்டிலும் தர்ம வீட்டிலும் பெரும் இழப்பு; உடல்நலக் குறை; தினசரி வாழ்வில் அமைதியின்மை; ஆதாயத்துக்காக தர்மத்தை சிறிது மீறுவார்; வருமான வீட்டில் பலவீனம்; இறை வீட்டில் பெரும் பலவீனம்; பிள்ளைகள் வீட்டில் சாமர்த்தியம்; உடன்பிறப்புகளின் சில ஒத்துழைப்பு.",
  },
  {
    house: 9, lagna: "Taurus", planetSign: "Capricorn", planet: "Venus", page: 53,
    en: "Fortunate, unable to progress in Dharma, some help from brothers and sisters, is very clever and gentleman, gets success in the house of enemies",
    ta: "அதிர்ஷ்டசாலி, ஆனால் தர்மத்தில் முன்னேற முடியாது; உடன்பிறப்புகளின் சிறு உதவி; மிகவும் சாமர்த்தியமும் பண்பும் உள்ளவர்; பகைவர் வீட்டில் வெற்றி.",
  },
  {
    house: 9, lagna: "Taurus", planetSign: "Capricorn", planet: "Saturn", page: 55,
    en: "Happiness from father, gains from government and society, gets the dignity in the house of enemies, gets insidiousness in the house of brothers and sisters, does energetic work, rears Dharma and gets honour",
    ta: "தந்தையால் மகிழ்ச்சி; அரசு, சமூகத்தில் ஆதாயம்; எதிரி வீட்டில் கம்பீரம்; உடன்பிறப்புகள் வீட்டில் வஞ்சகம்; உழைப்பால் பணி; தர்மத்தைக் காத்து மரியாதை பெறுவார்.",
  },
  {
    house: 9, lagna: "Taurus", planetSign: "Capricorn", planet: "Rahu", page: 57,
    en: "Gets loss in the house of destiny, mistakes in the house of Dharma, does not get fame, no belief in God",
    ta: "விதி வீட்டில் இழப்பு; தர்ம வீட்டில் தவறுகள்; புகழ் கிடைக்காது; இறைநம்பிக்கை இல்லாதவர்.",
  },
  {
    house: 9, lagna: "Taurus", planetSign: "Capricorn", planet: "Ketu", page: 59,
    en: "Loss and weakness in Dharma, deficiency of fame and deficiency of the house of and belief of God, works very hard for the progress of destiny and in getting the effects",
    ta: "தர்மத்தில் இழப்பும் பலவீனமும்; புகழ் குறைவு; இறைநம்பிக்கையில் குறை; விதியின் முன்னேற்றத்துக்காகக் கடுமையாக உழைத்து பலன்களைப் பெறுவார்.",
  },
  {
    house: 9, lagna: "Gemini", planetSign: "Aquarius", planet: "Sun", page: 63,
    en: "Increases the energy of taking support of destiny, feels some deficiency in getting the success of his industry, gets the strength of brothers and sisters, has huge courage, gets some influence due to success of industry, and is obstinate",
    ta: "விதியின் ஆதரவைப் பெறும் ஆற்றல்; தொழில் வெற்றியில் சில குறை; உடன்பிறப்புகளின் வலிமை; பெரும் தைரியம்; தொழில் வெற்றியால் சில செல்வாக்கு; பிடிவாதமானவர்.",
  },
  {
    house: 9, lagna: "Gemini", planetSign: "Aquarius", planet: "Moon", page: 65,
    en: "Gets wealth through power of destiny, rears Dharma, respects the brothers and sisters, fortunate, has belief in God, gets honour and family and is respectable",
    ta: "விதியின் வலிமையால் செல்வம்; தர்மத்தைக் காப்பார்; உடன்பிறப்புகளை மதிப்பார்; அதிர்ஷ்டசாலி; இறைநம்பிக்கை; மரியாதையும் குடும்பமும்; மதிப்புக்குரியவர்.",
  },
  {
    house: 9, lagna: "Gemini", planetSign: "Aquarius", planet: "Mars", page: 67,
    en: "Gains from destiny, spends somewhat more and gets some worries in the house of expenditure, careless, deficiency in the house of God",
    ta: "விதியால் ஆதாயம்; அதிகம் செலவழிப்பார்; செலவு வீட்டில் சில கவலைகள்; அசட்டை; இறை வீட்டில் குறை.",
  },
  {
    house: 9, lagna: "Gemini", planetSign: "Aquarius", planet: "Mercury", page: 69,
    en: "Is very fortunate, has good physique, happiness from mother, gets buildings and property, rears Dhanna, faith in God, rears greatness and satisfaction, happiness from the house of brother and sisters, has foresight",
    ta: "மிக அதிர்ஷ்டசாலி; நல்ல உடல்; தாயால் மகிழ்ச்சி; நிலமும் கட்டிடமும்; தர்மத்தைக் காப்பார்; இறைநம்பிக்கை; பெருமையும் திருப்தியும்; உடன்பிறப்புகளால் மகிழ்ச்சி; தொலைநோக்கு.",
  },
  {
    house: 9, lagna: "Gemini", planetSign: "Aquarius", planet: "Jupiter", page: 71,
    en: "Some unhappiness with father and wife, feels some dissatisfaction, gets power in the house of destiny, gets support from children, gets education",
    ta: "தந்தை, மனைவி வகையில் சில அதிருப்தி; திருப்தியின்மை; விதி வீட்டில் அதிகாரம்; பிள்ளைகளின் ஆதரவு; கல்வி.",
  },
  {
    house: 9, lagna: "Gemini", planetSign: "Aquarius", planet: "Venus", page: 73,
    en: "Deficiency in the house of education and having good strength to achieve it, decent cleverness in getting splendour of intellect in the house of progress of destiny, gains in the side of children, not much happiness from brothers and sisters",
    ta: "கல்வி வீட்டில் குறை, ஆனால் அதைப் பெற நல்ல வலிமை; விதியின் முன்னேற்ற வீட்டில் அறிவின் ஒளியைப் பெறும் சாமர்த்தியம்; பிள்ளைகள் வகையில் ஆதாயம்; உடன்பிறப்புகளின் மகிழ்ச்சி குறைவு.",
  },
  {
    house: 9, lagna: "Gemini", planetSign: "Aquarius", planet: "Saturn", page: 75,
    en: "Long life, fortunate and progress, weakness in the house of Dharma, deficiency in income, great influence in the house of enemy, unhappy with brothers and sisters, contact with foreign countries",
    ta: "நீண்ட ஆயுள்; அதிர்ஷ்டமும் முன்னேற்றமும்; தர்ம வீட்டில் பலவீனம்; வருமானக் குறை; எதிரி வீட்டில் பெரும் செல்வாக்கு; உடன்பிறப்புகளுடன் அதிருப்தி; வெளிநாட்டுத் தொடர்பு.",
  },
  {
    house: 9, lagna: "Gemini", planetSign: "Aquarius", planet: "Rahu", page: 77,
    en: "Weakness in the house of father, weakness in rearing Dharma, deficiency in the faith of God, finally gets some firmness of destiny",
    ta: "தந்தை வீட்டில் பலவீனம்; தர்மத்தைக் காப்பதில் பலவீனம்; இறைநம்பிக்கையில் குறை; இறுதியில் விதியில் சில உறுதி.",
  },
  {
    house: 9, lagna: "Gemini", planetSign: "Aquarius", planet: "Ketu", page: 79,
    en: "Bears some worries in the house of destiny, labours very hard for making progress, some loss in the house of Dharma, difficulties in getting fame, unsuccessful and selfish",
    ta: "விதி வீட்டில் சில கவலைகள்; முன்னேற்றத்துக்காகக் கடுமையாக உழைப்பார்; தர்ம வீட்டில் சில இழப்பு; புகழ் பெறுவதில் சிரமம்; வெற்றி பெறாதவர்; சுயநலம்.",
  },
  {
    house: 9, lagna: "Cancer", planetSign: "Pisces", planet: "Sun", page: 83,
    en: "Is very lucky, religious, and rich, gets wealth and luck, is very energetic and has brothers, secures advantages",
    ta: "மிக அதிர்ஷ்டசாலி, தர்மவான், செல்வந்தர்; செல்வமும் அதிர்ஷ்டமும்; மிகுந்த ஆற்றல்; உடன்பிறப்புகள் உண்டு; நன்மைகளைப் பெறுவார்.",
  },
  {
    house: 9, lagna: "Cancer", planetSign: "Pisces", planet: "Moon", page: 86,
    en: "Is very lucky and religious, believes in God, possesses a handsome body, is always happy, energetic, has brothers and sisters, gets fame and virtue",
    ta: "மிக அதிர்ஷ்டசாலி, தர்மவான்; இறைநம்பிக்கை; அழகான உடல்; எப்போதும் மகிழ்ச்சி; ஆற்றல்; உடன்பிறப்புகள் உண்டு; புகழும் நற்குணமும்.",
  },
  {
    house: 9, lagna: "Cancer", planetSign: "Pisces", planet: "Mars", page: 88,
    en: "Is very fortunate and enjoys the pleasures of son and father, has good knowledge of mathematics and accountancy, gets fame and respect from government and society, gets good education, is famous and farsighted",
    ta: "மிகவும் அதிர்ஷ்டசாலி; மகன், தந்தை இன்பங்களை அனுபவிப்பார்; கணிதம், கணக்கியலில் நல்ல அறிவு; அரசு, சமூகத்தில் புகழும் மரியாதையும்; நல்ல கல்வி; புகழ் பெற்றவர்; தொலைநோக்கு.",
  },
  {
    house: 9, lagna: "Cancer", planetSign: "Pisces", planet: "Mercury", page: 90,
    en: "Has some devotion to God, some incomplete happiness from brothers and sisters, some weakness in Dharma, deficiency in expenditure, gets the loss of fame and fortune and is of narrow discernment",
    ta: "இறைபக்தி சிறிது; உடன்பிறப்புகளால் முழுமையற்ற மகிழ்ச்சி; தர்மத்தில் சில பலவீனம்; செலவில் குறை; புகழையும் செல்வத்தையும் இழப்பார்; குறுகிய பகுத்தறிவு.",
  },
  {
    house: 9, lagna: "Cancer", planetSign: "Pisces", planet: "Jupiter", page: 92,
    en: "Is very fortunate, works with great intelligence, gets the power of children, gets the power of education, rears up good Dharma, gets victory over enemies",
    ta: "மிக அதிர்ஷ்டசாலி, பெரும் அறிவுடன் வேலை; பிள்ளைகளின் வலிமை; கல்வியின் வலிமை; நல்ல தர்மத்தை வளர்ப்பார்; பகைவரை வெல்வார்.",
  },
  {
    house: 9, lagna: "Cancer", planetSign: "Pisces", planet: "Venus", page: 94,
    en: "Is very fortunate, secures progress of gains, gets the power of land and property, weakness in energy, not dependent upon brothers, great reliance on God",
    ta: "மிக அதிர்ஷ்டசாலி; ஆதாய வளர்ச்சி; நிலம், சொத்தின் வலிமை; ஆற்றலில் சில பலவீனம்; சகோதரர்களைச் சார்ந்திருக்காதவர்; இறைவனிடம் பெரும் நம்பிக்கை.",
  },
  {
    house: 9, lagna: "Cancer", planetSign: "Pisces", planet: "Saturn", page: 96,
    en: "Spends the daily routine in a fortunate way, has a long life, dissatisfaction in the house of fate, careless",
    ta: "அதிர்ஷ்டமாக தினசரி வாழ்வைக் கழிப்பார்; நீண்ட ஆயுள்; விதி வீட்டில் அதிருப்தி; அசட்டை.",
  },
  {
    house: 9, lagna: "Cancer", planetSign: "Pisces", planet: "Rahu", page: 98,
    en: "Great loss in the house of destiny, can demonstrate outward show nicely, gets success after great nervousness, tactful",
    ta: "விதி வீட்டில் பெரும் இழப்பு; வெளித் தோற்றத்தை நேர்த்தியாகக் காட்டுவார்; பெரும் பதற்றத்துக்குப் பின் வெற்றி; சாமர்த்தியமானவர்.",
  },
  {
    house: 9, lagna: "Cancer", planetSign: "Pisces", planet: "Ketu", page: 100,
    en: "Great distress in the house of destiny, further bears the loss of Dharma for seeing the rise of destiny, uses the secret consultations and is a showy religious man",
    ta: "விதி வீட்டில் பெரும் துன்பம்; விதியின் உயர்வைக் காண தர்மத்தின் இழப்பையும் ஏற்பார்; ரகசிய ஆலோசனைகளைப் பயன்படுத்துவார்; ஆடம்பரமான மதவாதி.",
  },
  {
    house: 9, lagna: "Leo", planetSign: "Aries", planet: "Sun", page: 105,
    en: "Is very handsome, possesses a big forehead, does not care for brothers and sisters, possesses a special kind of Dharma, is much respected, earns fame, gets high position at religious places",
    ta: "மிக அழகானவர், பெரிய நெற்றி; உடன்பிறப்புகளைப் பொருட்படுத்தார்; சிறப்பான ஒரு வகை தர்மம்; பெரும் மரியாதை; புகழ் பெறுவார்; மத இடங்களில் உயர் பதவி.",
  },
  {
    house: 9, lagna: "Leo", planetSign: "Aries", planet: "Moon", page: 107,
    en: "Manages the expenditure, gets some weakness in the house of Dharma, restless in mind, some deficiency in the house of brothers and sisters, some weakness in the strength and energy",
    ta: "செலவை நிர்வகிப்பார்; தர்ம வீட்டில் சில பலவீனம்; மனத்தில் அமைதியின்மை; உடன்பிறப்புகள் வீட்டில் சில குறை; ஆற்றல், வலிமையில் சில பலவீனம்.",
  },
  {
    house: 9, lagna: "Leo", planetSign: "Aries", planet: "Mars", page: 109,
    en: "Very fortunate, gets lands and property, great happiness, deficiency in the house of expenditure, has faith in God, gets great respect",
    ta: "மிக அதிர்ஷ்டசாலி; நிலமும் சொத்தும்; பெரும் மகிழ்ச்சி; செலவு வீட்டில் குறை; இறைநம்பிக்கை; பெரும் மரியாதை.",
  },
  {
    house: 9, lagna: "Leo", planetSign: "Aries", planet: "Mercury", page: 111,
    en: "Gains wealth due to power of destiny, has great reliance in God, gets advantage from the brothers and sisters, is very respectable",
    ta: "விதியின் வலிமையால் செல்வம்; இறையில் பெரும் நம்பிக்கை; உடன்பிறப்புகளால் ஆதாயம்; மிகுந்த மரியாதை.",
  },
  {
    house: 9, lagna: "Leo", planetSign: "Aries", planet: "Jupiter", page: 113,
    en: "Acquires much education, gets the strength of children, gets respect, puts forward great religious ideas in some intricate manner, some deficiency in acquiring fame, spends the life fortunately and intelligently",
    ta: "மிகுந்த கல்வி; பிள்ளைகளின் வலிமை; மரியாதை; தர்மக் கருத்துகளை சிக்கலான முறையில் முன்வைப்பார்; புகழ் பெறுவதில் சில குறை; அதிர்ஷ்டமாகவும் அறிவாகவும் வாழ்வார்.",
  },
  {
    house: 9, lagna: "Leo", planetSign: "Aries", planet: "Venus", page: 115,
    en: "Gets grand success and progress through the progress of destiny, enjoys the house of brothers, sisters and father, performs religious functions, gets honour and success in government and society",
    ta: "விதியின் முன்னேற்றத்தால் பெரும் வெற்றியும் முன்னேற்றமும்; உடன்பிறப்புகள், தந்தை வீட்டில் மகிழ்ச்சி; மதச் சடங்குகள் செய்வார்; அரசு, சமூகத்தில் மரியாதையும் வெற்றியும்.",
  },
  {
    house: 9, lagna: "Leo", planetSign: "Aries", planet: "Saturn", page: 117,
    en: "Great weakness in the house of destiny, some weakness in the house of God, gets sufficient wealth",
    ta: "விதி வீட்டில் பெரும் பலவீனம்; இறை வீட்டில் சில பலவீனம்; போதுமான செல்வம் கிடைக்கும்.",
  },
  {
    house: 9, lagna: "Leo", planetSign: "Aries", planet: "Rahu", page: 119,
    en: "Loss in the house of fortune, deficiency in the faith and reliance on God, uses very intricate and secret devices for the rise, gets the power of success in the end after facing great hindrances, deficiency in fame",
    ta: "அதிர்ஷ்ட வீட்டில் இழப்பு; இறைநம்பிக்கையிலும் நம்பிக்கையிலும் குறை; முன்னேற்றத்துக்கு மிகச் சிக்கலான, ரகசிய உபாயங்கள்; பெரும் தடைகளுக்குப் பின் இறுதியில் வெற்றி பெறும் ஆற்றல்; புகழில் குறை.",
  },
  {
    house: 9, lagna: "Leo", planetSign: "Aries", planet: "Ketu", page: 121,
    en: "Great troubles in the house of destiny, hindrance in the house progress, deficiency in the house of Dharma and God, after some troubles gets firmness of destiny in the end",
    ta: "விதி வீட்டில் பெரும் தொல்லைகள்; முன்னேற்றத்தில் தடை; தர்ம, இறை வீட்டில் குறை; சில தொல்லைகளுக்குப் பின் இறுதியில் விதியில் உறுதி.",
  },
  {
    house: 9, lagna: "Virgo", planetSign: "Taurus", planet: "Sun", page: 126,
    en: "Gets weakness in destiny, feels anxious about the fate, gets some deficiency in the devotion to God, gets some loss in the house of brothers",
    ta: "விதியில் பலவீனம்; விதியைப் பற்றி கவலை; இறைபக்தியில் சில குறை; சகோதரர் வீட்டில் சில இழப்பு.",
  },
  {
    house: 9, lagna: "Virgo", planetSign: "Taurus", planet: "Moon", page: 128,
    en: "Very fortunate and gains heavily due to power of destiny, has special faith in God and Dharma, gets fame, deficiency in the side of brother, is farsighted and accepts truths, is influential, secures much increment in gains after the age of twenty-four",
    ta: "மிக அதிர்ஷ்டசாலி; விதியின் வலிமையால் பெரும் ஆதாயம்; இறையிலும் தர்மத்திலும் சிறப்பு நம்பிக்கை; புகழ்; சகோதரர் பக்கம் குறை; தொலைநோக்குள்ளவர், உண்மையை ஏற்பவர், செல்வாக்குள்ளவர்; இருபத்துநான்கு வயதுக்குப் பின் வருமானத்தில் பெரும் உயர்வு.",
  },
  {
    house: 9, lagna: "Virgo", planetSign: "Taurus", planet: "Mars", page: 130,
    en: "Has a long life, spends much, some loss in the house of mother, some deficiency in the house of happiness and some weakness in the house of Dharma and destiny, less faith in God",
    ta: "நீண்ட ஆயுள்; அதிகம் செலவழிப்பார்; தாய் வீட்டில் சில இழப்பு; மகிழ்ச்சியில் சில குறை; தர்ம வீட்டிலும் விதியிலும் சில பலவீனம்; இறைநம்பிக்கை குறைவு.",
  },
  {
    house: 9, lagna: "Virgo", planetSign: "Taurus", planet: "Mercury", page: 132,
    en: "Is very fortunate, help and honour from the house of father, gets honour in government and society, is of handsome and attractive body, has brothers and sisters, gets success in business, has faith in God, gets divine help",
    ta: "மிக அதிர்ஷ்டசாலி; தந்தை வீட்டிலிருந்து உதவியும் மரியாதையும்; அரசு, சமூகத்தில் மரியாதை; அழகும் கவர்ச்சியும் உள்ள உடல்; உடன்பிறப்புகள்; தொழிலில் வெற்றி; இறைநம்பிக்கை; தெய்வ உதவி.",
  },
  {
    house: 9, lagna: "Virgo", planetSign: "Taurus", planet: "Jupiter", page: 134,
    en: "Fortunate, pays some attention to God, gets the pleasures of the family with the power of destiny, gets some buildings and property, has brothers and sisters, some distress of children, gets some weakness in education and intellect, utters some faulty and weak words, is peaceful and farsighted",
    ta: "அதிர்ஷ்டசாலி; இறையில் சிறிது கவனம்; விதியின் வலிமையால் குடும்ப இன்பங்கள்; சில நிலமும் கட்டிடங்களும்; உடன்பிறப்புகள்; பிள்ளைகள் வகையில் சில துன்பம்; கல்வியிலும் அறிவிலும் சில பலவீனம்; சில தவறான, பலவீனமான சொற்களைப் பேசுவார்; அமைதியானவர், தொலைநோக்குள்ளவர்.",
  },
  {
    house: 9, lagna: "Virgo", planetSign: "Taurus", planet: "Venus", page: 137,
    en: "Is very fortunate, religious, gets wealth, enjoys family pleasures, gets fame, enjoys the pleasures of brothers and sisters and the family, believes in God",
    ta: "மிக அதிர்ஷ்டசாலி, தர்மவான், செல்வம் ஈட்டுவார்; குடும்ப இன்பங்களை அனுபவிப்பார்; புகழ்; உடன்பிறப்புகளும் குடும்பமும் தரும் இன்பங்கள்; இறைநம்பிக்கை.",
  },
  {
    house: 9, lagna: "Virgo", planetSign: "Taurus", planet: "Saturn", page: 139,
    en: "Very intelligent and clever, seems to be very influential and industrious, gets heavy gains, is an expert in quarrelsome affairs and matters of diseases, defeats the enemy by his intellectual power, deep interest in the house of Dharma, some enmity with the side of brothers, courageous and haughty",
    ta: "மிகவும் அறிவாளி, சாமர்த்தியமானவர்; செல்வாக்குள்ளவர், உழைப்பாளி போலத் தோன்றுவார்; பெரும் ஆதாயம்; சண்டைகளிலும் நோய் விஷயங்களிலும் நிபுணர்; அறிவு வலிமையால் எதிரியை வெல்வார்; தர்ம வீட்டில் ஆழ்ந்த ஈடுபாடு; சகோதரர் பக்கம் சில பகை; தைரியமும் கர்வமும்.",
  },
  {
    house: 9, lagna: "Virgo", planetSign: "Taurus", planet: "Rahu", page: 141,
    en: "Some weakness in destiny, gets something less in the house of Dharma but in the end gets firmness and is able to evaluate even a false thing to be true",
    ta: "விதியில் சில பலவீனம்; தர்ம வீட்டில் சற்று குறை, ஆனால் இறுதியில் உறுதி; பொய்யானதையும் உண்மையாக மதிப்பிடும் ஆற்றல்.",
  },
  {
    house: 9, lagna: "Virgo", planetSign: "Taurus", planet: "Ketu", page: 143,
    en: "Gets some weakness in the house of destiny, believes in Dharma in his own way, keenly engages in the rise of fortune",
    ta: "விதி வீட்டில் சில பலவீனம்; தனக்கேற்ற வழியில் தர்மத்தை நம்புவார்; விதியின் உயர்வில் ஆர்வமாக ஈடுபடுவார்.",
  },
  {
    house: 9, lagna: "Libra", planetSign: "Gemini", planet: "Sun", page: 147,
    en: "Is very fortunate, gets heavy gains due to the power of destiny, is brilliant, influential and carefree",
    ta: "மிக அதிர்ஷ்டசாலி; விதியின் வலிமையால் பெரும் ஆதாயம்; அறிவொளியும் செல்வாக்கும் உள்ளவர்; கவலையற்றவர்.",
  },
  {
    house: 9, lagna: "Libra", planetSign: "Gemini", planet: "Moon", page: 149,
    en: "Is very fortunate, rears the religion and duty, progress in the house of government and society, gets the brothers and sisters and is considered very fortunate, gets fame and believes in God",
    ta: "மிக அதிர்ஷ்டசாலி; தர்மத்தையும் கடமையையும் காப்பார்; அரசு, சமூக வீட்டில் முன்னேற்றம்; உடன்பிறப்புகள்; மிக அதிர்ஷ்டசாலி என்று கருதப்படுவார்; புகழ்; இறைநம்பிக்கை.",
  },
  {
    house: 9, lagna: "Libra", planetSign: "Gemini", planet: "Mars", page: 151,
    en: "Gets wealth due to his own and his wife's luck, progress through everyday occupation, spends much and enjoys great happiness of land and property, is fortunate and respectable",
    ta: "தனது, மனைவியின் அதிர்ஷ்டத்தால் செல்வம்; அன்றாட தொழிலால் முன்னேற்றம்; அதிகம் செலவழிப்பார், ஆனாலும் நிலம், சொத்தில் பெரும் மகிழ்ச்சி; அதிர்ஷ்டசாலி; மரியாதைக்குரியவர்.",
  },
  {
    house: 9, lagna: "Libra", planetSign: "Gemini", planet: "Mercury", page: 153,
    en: "Is very fortunate, gets fame, gets the progress of destiny, gets the power of expenditure, is courageous, and has brothers and sisters",
    ta: "மிக அதிர்ஷ்டசாலி; புகழ்; விதியின் முன்னேற்றம்; செலவை நிர்வகிக்கும் ஆற்றல்; தைரியசாலி; உடன்பிறப்புகள் உண்டு.",
  },
  {
    house: 9, lagna: "Libra", planetSign: "Gemini", planet: "Jupiter", page: 155,
    en: "Gets power horn the house of destiny, cooperation of brother but with some hindrances, does not care at all about quarrels and enemies, acknowledges the power of justice, has children",
    ta: "விதி வீட்டிலிருந்து ஆற்றல்; சகோதரரின் ஒத்துழைப்பு, ஆனால் சில தடைகளுடன்; சண்டைகளையும் எதிரிகளையும் பொருட்படுத்தார்; நீதியின் வலிமையை ஏற்பார்; பிள்ளைகள் உண்டு.",
  },
  {
    house: 9, lagna: "Libra", planetSign: "Gemini", planet: "Venus", page: 157,
    en: "Spends his life with good luck, no anxieties, is fatalistic and industrious, some deficiency in the affection of brothers and sisters, is very respectable and clever",
    ta: "நல்ல அதிர்ஷ்டத்துடன் வாழ்வார்; கவலையின்றி, விதியை நம்பி, உழைப்பாளியாக; உடன்பிறப்புகளின் அன்பில் சில குறை; மிகுந்த மரியாதையும் சாமர்த்தியமும்.",
  },
  {
    house: 9, lagna: "Libra", planetSign: "Gemini", planet: "Saturn", page: 159,
    en: "Is very wise, happiness from destiny, gets firm education, happiness of children, is fortunate, happy and just",
    ta: "மிக அறிவாளி; விதியால் மகிழ்ச்சி; உறுதியான கல்வி; பிள்ளைகளின் மகிழ்ச்சி; அதிர்ஷ்டசாலி, மகிழ்ச்சியானவர், நீதியுள்ளவர்.",
  },
  {
    house: 9, lagna: "Libra", planetSign: "Gemini", planet: "Rahu", page: 161,
    en: "Makes efforts to increase fortune, speaks too much about Dharma, gets weakness in the side of destiny",
    ta: "விதியை உயர்த்த முயல்வார்; தர்மத்தைப் பற்றி அதிகம் பேசுவார்; விதி வீட்டில் பலவீனம்.",
  },
  {
    house: 9, lagna: "Libra", planetSign: "Gemini", planet: "Ketu", page: 163,
    en: "Happiness in destiny, is defamed, gets weakness of Dharma, keeps less faith in God",
    ta: "விதியில் மகிழ்ச்சி; அவதூறுக்கு உள்ளாவார்; தர்மத்தில் பலவீனம்; இறைநம்பிக்கை குறைவு.",
  },
  {
    house: 9, lagna: "Scorpio", planetSign: "Cancer", planet: "Sun", page: 168,
    en: "Is very fortunate and performs religious duties, gets much pleasure in the wonders of the divine power, pursues big business, is thought to be influential",
    ta: "மிக அதிர்ஷ்டசாலி; மதக் கடமைகளைச் செய்வார்; தெய்வ சக்தியின் அதிசயங்களில் பெரும் மகிழ்ச்சி; பெரிய வணிகம் நடத்துவார்; செல்வாக்குள்ளவராகக் கருதப்படுவார்.",
  },
  {
    house: 9, lagna: "Scorpio", planetSign: "Cancer", planet: "Moon", page: 171,
    en: "Is very fortunate and gets fame, rears the Dharma very decently, gets the cooperation of the brother and is a jolly fellow",
    ta: "மிக அதிர்ஷ்டசாலி; புகழ் பெறுவார்; தர்மத்தை மிக நன்றாகக் காப்பார்; உடன்பிறப்பின் ஒத்துழைப்பு; மகிழ்ச்சியான மனிதர்.",
  },
  {
    house: 9, lagna: "Scorpio", planetSign: "Cancer", planet: "Mars", page: 173,
    en: "Feels the weakness of destiny, gets weakness in body and Dharma, gets worries due to labour, spends much, weakness in the side of mother, puts in efforts to get possession of land and means of happiness",
    ta: "விதியின் பலவீனம்; உடலிலும் தர்மத்திலும் பலவீனம்; உழைப்பால் கவலைகள்; அதிகம் செலவழிப்பார்; தாய் பக்கம் பலவீனம்; நிலமும் மகிழ்ச்சிக்கான வசதிகளும் பெற முயற்சி.",
  },
  {
    house: 9, lagna: "Scorpio", planetSign: "Cancer", planet: "Mercury", page: 175,
    en: "Income through power of destiny, gets hereditary gains, leaves the work incomplete, feels pleasure in the daily routine of life, gets a long life, some deficiency in fame",
    ta: "விதியின் வலிமையால் வருமானம்; பரம்பரை ஆதாயம்; வேலையை முழுமையாக முடிக்காதவர்; தினசரி வாழ்வில் மகிழ்ச்சி; நீண்ட ஆயுள்; புகழில் சில குறை.",
  },
  {
    house: 9, lagna: "Scorpio", planetSign: "Cancer", planet: "Jupiter", page: 177,
    en: "Is very fortunate, intelligent, does religious deeds, gets good and fortunate children, gets great honour, possess knowledge of astrology, is farsighted, gets much wealth, rears eternal Dharma, some deficiency from the side of brothers and sisters, possesses spiritual knowledge",
    ta: "மிக அதிர்ஷ்டசாலி, அறிவாளி, தர்ம காரியங்களைச் செய்வார்; நல்ல, அதிர்ஷ்டமான பிள்ளைகள்; பெரும் மரியாதை; ஜோதிட அறிவு; தொலைநோக்கு; மிகுந்த செல்வம்; நிலையான தர்மத்தைக் காப்பார்; உடன்பிறப்புகள் வகையில் சில குறை; ஆன்மிக அறிவு.",
  },
  {
    house: 9, lagna: "Scorpio", planetSign: "Cancer", planet: "Venus", page: 179,
    en: "Gets the power of occupation, gets power of expenditure due to destiny, gets some happiness of wife and family mixed with some weakness, gets the conjunction of brothers and sisters with some weakness",
    ta: "தொழிலின் ஆற்றல்; விதியால் செலவு செய்யும் ஆற்றல்; மனைவி, குடும்ப மகிழ்ச்சியில் சில பலவீனம்; உடன்பிறப்புகளுடன் சில பலவீனத்துடன் சேர்க்கை.",
  },
  {
    house: 9, lagna: "Scorpio", planetSign: "Cancer", planet: "Saturn", page: 181,
    en: "Is very energetic and does very nice deeds, supposed to be lucky and gets heavy gains, gets the cooperation of brothers, feels happy in devotion to God and in Dhanna, gets land and buildings",
    ta: "மிகுந்த ஆற்றலும் சிறந்த செயல்களும்; அதிர்ஷ்டசாலி, பெரும் ஆதாயம்; உடன்பிறப்புகளின் ஒத்துழைப்பு; இறைபக்தி, தர்மம் மகிழ்ச்சி; நிலமும் கட்டிடங்களும்.",
  },
  {
    house: 9, lagna: "Scorpio", planetSign: "Cancer", planet: "Rahu", page: 183,
    en: "Very much anxious about his destiny, feels sorry about his luck, gets real deficiency with regard to God and religion, bears mental agony",
    ta: "விதியைப் பற்றி மிகுந்த கவலை; தன் அதிர்ஷ்டத்தால் வருத்தம்; இறை, மதம் பற்றிய உண்மையான குறை; மன வேதனை.",
  },
  {
    house: 9, lagna: "Scorpio", planetSign: "Cancer", planet: "Ketu", page: 185,
    en: "Great restlessness in the destiny, feels weakness in Dharma, pursues a very strong advantageous tactics for the rise of his fate, rears some weak Dharma",
    ta: "விதியில் பெரும் அமைதியின்மை; தர்மத்தில் பலவீனம்; விதியின் உயர்வுக்காக மிக வலிமையான சாதகமான உபாயங்கள்; சில பலவீனமான தர்மத்தைப் பின்பற்றுவார்.",
  },
  {
    house: 9, lagna: "Sagittarius", planetSign: "Leo", planet: "Sun", page: 190,
    en: "Is very fortunate and illustrious, rears a very fiery Dharma, has less faith in brothers and sisters",
    ta: "மிக அதிர்ஷ்டசாலி, புகழ்பெற்றவர்; மிகுந்த வேகமான தர்மத்தைப் பின்பற்றுவார்; உடன்பிறப்புகளிடம் குறைந்த நம்பிக்கை.",
  },
  {
    house: 9, lagna: "Sagittarius", planetSign: "Leo", planet: "Moon", page: 192,
    en: "Bears loss in the house of Dharma, has a long life, gets a good means of livelihood, laces troubles and obstacles in the house of fortune, and some obstacles from brothers and sisters",
    ta: "தர்ம வீட்டில் இழப்பு; நீண்ட ஆயுள்; நல்ல வாழ்வாதாரம்; அதிர்ஷ்ட வீட்டில் தொல்லைகளும் தடைகளும்; உடன்பிறப்புகள் வகையில் சில தடைகள்.",
  },
  {
    house: 9, lagna: "Sagittarius", planetSign: "Leo", planet: "Mars", page: 194,
    en: "Spends much, faces some loss in the house of destiny, and some loss in the house of mother, has deficiency in education and in the house of brothers, experiences the rise in fortune a bit late and from remote sources",
    ta: "அதிகம் செலவழிப்பார்; விதி வீட்டில் சில இழப்பு; தாய் வீட்டில் சில இழப்பு; கல்வி, சகோதரர் வீட்டில் குறை; அதிர்ஷ்டம் சற்று தாமதமாகவும் தொலைதூர வழிகளிலும் உயரும்.",
  },
  {
    house: 9, lagna: "Sagittarius", planetSign: "Leo", planet: "Mercury", page: 196,
    en: "Takes good care of Dhanna in business and occupation, gets a dutiful and beautiful wife, gets nice cooperation from brothers and sisters, gets advantage from the government and society",
    ta: "தொழிலிலும் வணிகத்திலும் தர்மத்தை நன்கு காப்பார்; நல்ல கடமையுள்ள, அழகான மனைவி; உடன்பிறப்புகளின் நல்ல ஒத்துழைப்பு; அரசு, சமூகத்தில் ஆதாயம்.",
  },
  {
    house: 9, lagna: "Sagittarius", planetSign: "Leo", planet: "Jupiter", page: 198,
    en: "Is very fortunate, possesses scientific knowledge, performs religious formalities, has faith in God, possesses wisdom and authority in education, possesses handsome physique, gets land and property, gets the happiness of children, has some enmity in connection with brothers and sisters",
    ta: "மிக அதிர்ஷ்டசாலி; அறிவியல் அறிவு; மதச் சடங்குகளைச் செய்வார்; இறைநம்பிக்கை; கல்வியில் ஞானமும் அதிகாரமும்; அழகான உடல்; நிலம், சொத்து; பிள்ளைகளின் மகிழ்ச்சி; உடன்பிறப்புகளுடன் சில பகை.",
  },
  {
    house: 9, lagna: "Sagittarius", planetSign: "Leo", planet: "Venus", page: 200,
    en: "Gets gains but some uneasiness in connection with gains, some obstacles and troubles and uneasiness in the way of the progress of the destiny, some continuity in the side of brother, is very courageous and clever, gets the advantages in the garb of Dharma",
    ta: "ஆதாயம் பெறுவார், ஆனால் ஆதாயத்தில் சில அமைதியின்மை; சில தடைகளும் தொல்லைகளும்; விதியின் முன்னேற்றத்தில் சில அமைதியின்மை; சகோதரர் பக்கம் தொடர்ச்சி; மிகுந்த தைரியமும் சாமர்த்தியமும்; தர்மத்தின் போர்வையில் ஆதாயங்கள்.",
  },
  {
    house: 9, lagna: "Sagittarius", planetSign: "Leo", planet: "Saturn", page: 202,
    en: "Increases wealth, gets heavy income, acquires influence in the house of enemy",
    ta: "செல்வம் பெருக்கம்; அதிக வருமானம்; எதிரி வீட்டில் செல்வாக்கு.",
  },
  {
    house: 9, lagna: "Sagittarius", planetSign: "Leo", planet: "Rahu", page: 204,
    en: "Gets anxious about his destiny, gets hindrances, troubles and losses in connection with the rise of fate, weakness in connection with Dharma",
    ta: "தன் விதி பற்றி கவலை; விதியின் உயர்வில் தடைகள், தொல்லைகள், இழப்புகள்; தர்மத்தில் பலவீனம்.",
  },
  {
    house: 9, lagna: "Sagittarius", planetSign: "Leo", planet: "Ketu", page: 206,
    en: "Feels worried by his destiny, deficiency in fame, does not keep faith in Dharma",
    ta: "தன் விதி பற்றி கவலை; புகழில் குறை; தர்மத்தில் நம்பிக்கை இல்லாதவர்.",
  },
  {
    house: 9, lagna: "Capricorn", planetSign: "Virgo", planet: "Sun", page: 211,
    en: "Gets long age, gets loss in the house of destiny, spends the daily routine of life fortunately, finds problems in the brothers' house, rears selfish Dharma, and lives like a gentlemen",
    ta: "நீண்ட வயது; விதி வீட்டில் இழப்பு; தினசரி வாழ்வை அதிர்ஷ்டமாகக் கழிப்பார்; சகோதரர் வீட்டில் பிரச்சினைகள்; சுயநலமான தர்மம்; உயர்குடி மனிதராக வாழ்வார்.",
  },
  {
    house: 9, lagna: "Capricorn", planetSign: "Virgo", planet: "Moon", page: 213,
    en: "Gets a fortunate wife, gets the piety in sexual affairs, gets engaged in rehgious affairs, is thought to be fortunate in business, and gets brothers and sisters",
    ta: "அதிர்ஷ்டமான மனைவி; பாலியல் விஷயங்களில் தூய்மை; மத விவகாரங்களில் ஈடுபாடு; தொழிலில் அதிர்ஷ்டசாலி என்று கருதப்படுவார்; உடன்பிறப்புகள் உண்டு.",
  },
  {
    house: 9, lagna: "Capricorn", planetSign: "Virgo", planet: "Mars", page: 215,
    en: "Very fortunate and enjoys the fortune, gets land and property, acquires happiness from mother, is overjoyed, energetic and gets the support of brothers",
    ta: "மிக அதிர்ஷ்டசாலி, அதிர்ஷ்டத்தை அனுபவிப்பார்; நிலமும் சொத்தும்; தாயால் மகிழ்ச்சி; மகிழ்ச்சியானவர், ஆற்றல் மிக்கவர்; சகோதரர்களின் ஆதரவு.",
  },
  {
    house: 9, lagna: "Capricorn", planetSign: "Virgo", planet: "Mercury", page: 217,
    en: "Is fortunate and gets great advantage through wisdom, rears Dharma, gets the opposition from brother, and is very clever",
    ta: "அதிர்ஷ்டசாலி; அறிவால் பெரும் ஆதாயம்; தர்மத்தைக் காப்பார்; சகோதரரின் எதிர்ப்பு; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 9, lagna: "Capricorn", planetSign: "Virgo", planet: "Jupiter", page: 219,
    en: "Gets weakness in destiny and Dharma, gets the cooperation from the brother with some weakness, is not handsome, gets some loss in children's house",
    ta: "விதியிலும் தர்மத்திலும் பலவீனம்; சகோதரர் ஒத்துழைப்பு சில பலவீனத்துடன்; அழகில்லாதவர்; பிள்ளைகள் வீட்டில் சில இழப்பு.",
  },
  {
    house: 9, lagna: "Capricorn", planetSign: "Virgo", planet: "Venus", page: 221,
    en: "Has some weakness in the house of destiny, some weakness from the side of father, is supposed to be fortunate, gets honour in government and society, gets brothers and sisters, faces some weakness in business and occupation",
    ta: "விதி வீட்டில் சில பலவீனம்; தந்தை வகையில் சில பலவீனம்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; அரசு, சமூகத்தில் மரியாதை; சகோதர சகோதரிகள் உண்டு; தொழிலிலும் வணிகத்திலும் சில பலவீனம்.",
  },
  {
    house: 9, lagna: "Capricorn", planetSign: "Virgo", planet: "Saturn", page: 223,
    en: "Is very fortunate, religious, virtuous and possesses a handsome body, seems to be very lucky, has enmity in the house of income, has nice influence over enemies and opponents, controls the diseases, feces some sourness in the house of brothers and sisters",
    ta: "மிக அதிர்ஷ்டசாலி, தர்மவான், நல்லொழுக்கமுள்ளவர், அழகான உடல்; மிக அதிர்ஷ்டசாலி போலத் தோன்றுவார்; வருமான வீட்டில் பகை; எதிரிகள், எதிர்ப்பாளர்கள் மீது நல்ல செல்வாக்கு; நோய்களைக் கட்டுப்படுத்துவார்; சகோதர சகோதரிகள் வீட்டில் சில கசப்பு.",
  },
  {
    house: 9, lagna: "Capricorn", planetSign: "Virgo", planet: "Rahu", page: 225,
    en: "Has anxieties about his life, faces blows over destiny, has deficiency in Dharma, is very clever and cunning",
    ta: "தன் வாழ்வைப் பற்றி கவலைகள்; விதியில் அடிகள்; தர்மத்தில் பலவீனம்; மிகவும் சாமர்த்தியமும் தந்திரமும் உள்ளவர்.",
  },
  {
    house: 9, lagna: "Capricorn", planetSign: "Virgo", planet: "Ketu", page: 227,
    en: "Bears worries in the house of destiny, gets some internal weakness, laces delay in rise of fortune, uses secret powers, has deficiency in fame, does not rear Dharma",
    ta: "விதி வீட்டில் கவலைகள்; உள் பலவீனம்; அதிர்ஷ்டத்தின் உயர்வில் தாமதம்; ரகசிய ஆற்றலைப் பயன்படுத்துவார்; புகழில் குறை; தர்மத்தைக் காப்பதில்லை.",
  },
  {
    house: 9, lagna: "Aquarius", planetSign: "Libra", planet: "Sun", page: 232,
    en: "Experiences some weakness in luck and also in the side of occupation, weakness in rearing Dharma, gets the power of brothers and sisters, gets deficiency in the side of sexual pleasures",
    ta: "விதியிலும் தொழில் பகுதியிலும் சில பலவீனம்; தர்மத்தைக் காப்பதில் பலவீனம்; சகோதர சகோதரிகளின் ஆற்றல்; பாலியல் இன்பத்தில் குறை.",
  },
  {
    house: 9, lagna: "Aquarius", planetSign: "Libra", planet: "Moon", page: 235,
    en: "Some anxieties in the house of destiny, keeps influence on enemy, does laborious and energetic deeds, faces some enmity in the side of brothers and sisters, keeps friendly relations with enemies, is peaceful",
    ta: "விதி வீட்டில் சில கவலைகள்; எதிரிகள் மீது செல்வாக்கு; உழைப்பும் ஆற்றலும் உள்ள செயல்கள்; சகோதர சகோதரிகளுடன் சில பகை; எதிரிகளுடன் நட்புறவு; அமைதியானவர்.",
  },
  {
    house: 9, lagna: "Aquarius", planetSign: "Libra", planet: "Mars", page: 237,
    en: "Is very fortunate, secures progress of business or occupation through destiny and energy, performs religious formalities, spends much, gets strength of happiness and buildings, gets honour in the government and society",
    ta: "மிக அதிர்ஷ்டசாலி; விதியாலும் ஆற்றலாலும் தொழில் அல்லது வேலையில் முன்னேற்றம்; மத சடங்குகளைச் செய்வார்; அதிகம் செலவழிப்பார்; மகிழ்ச்சி, கட்டிடங்களின் வலிமை; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    house: 9, lagna: "Aquarius", planetSign: "Libra", planet: "Mercury", page: 239,
    en: "Gains advantage of already accumulated wealth, gets good age, gets good luck in the daily routine of life, has religious knowledge, gets some anxiety in connection with destiny, faces some perplexity in the contact with brothers and sisters, gets children, and is very clever",
    ta: "சேர்த்த செல்வத்தின் ஆதாயம்; நல்ல வயது; தினசரி வாழ்வில் நல்ல அதிர்ஷ்டம்; மத அறிவு; விதி பற்றிய சில கவலை; சகோதர சகோதரிகளுடன் தொடர்பில் சில குழப்பம்; பிள்ளைகள் உண்டு; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 9, lagna: "Aquarius", planetSign: "Libra", planet: "Jupiter", page: 241,
    en: "Gets wealth through power of destiny, gets wisdom, education and cleverness, gets children, and is self-conceited",
    ta: "விதியின் வலிமையால் செல்வம்; அறிவு, கல்வி, சாமர்த்தியம்; பிள்ளைகள்; சுயபெருமை.",
  },
  {
    house: 9, lagna: "Aquarius", planetSign: "Libra", planet: "Venus", page: 243,
    en: "Is very fortunate and rears Dharma, gets fame, gains strength from mother, gets the dignity of land, buildings and property, receives grand help of divine power, gets help from brothers and sisters, is farsighted, learned and clever",
    ta: "மிக அதிர்ஷ்டசாலி, தர்மத்தைக் காப்பார்; புகழ்; தாயிடமிருந்து வலிமை; நிலம், கட்டிடம், சொத்தின் மரியாதை; தெய்வ சக்தியின் பெரும் உதவி; சகோதர சகோதரிகளின் உதவி; தொலைநோக்குள்ளவர், கற்றவர், சாமர்த்தியமானவர்.",
  },
  {
    house: 9, lagna: "Aquarius", planetSign: "Libra", planet: "Saturn", page: 245,
    en: "Gets a handsome body, is fortunate, works very hard to get wealth, has great influence in the house of enemies, faces deficiency in the house of brother, spends much, is overjoyed and fearless",
    ta: "அழகான உடல், அதிர்ஷ்டசாலி; செல்வத்துக்காகக் கடுமையாக உழைப்பார்; எதிரி வீட்டில் பெரும் செல்வாக்கு; சகோதரர் வீட்டில் குறை; அதிகம் செலவழிப்பார்; மகிழ்ச்சியானவர், அஞ்சாதவர்.",
  },
  {
    house: 9, lagna: "Aquarius", planetSign: "Libra", planet: "Rahu", page: 247,
    en: "Faces trouble and hindrances in the side of destiny, feces deficiency in getting fame, is able to rear any kind of Dharma for serving his selfishness, always tries to get rid of the weakness of destiny",
    ta: "விதியின் பக்கம் தொல்லைகளும் தடைகளும்; புகழில் குறை; தன் சுயநலத்துக்காக எந்த தர்மத்தையும் காக்க முடியும்; விதியின் பலவீனத்தை நீக்க எப்போதும் முயல்வார்.",
  },
  {
    house: 9, lagna: "Aquarius", planetSign: "Libra", planet: "Ketu", page: 249,
    en: "Faces some deficiency in fame and house of destiny, uses the secret powers very cleverly, does not get rise in income or fortune, does not get the real shape of Dharma",
    ta: "விதி வீட்டிலும் புகழிலும் சில குறை; மறைந்த சக்திகளை மிகச் சாமர்த்தியமாகப் பயன்படுத்துவார்; வருமானத்திலும் அதிர்ஷ்டத்திலும் உயர்வு இல்லை; தர்மத்தின் உண்மையான வடிவத்தைப் பெறார்.",
  },
  {
    house: 9, lagna: "Pisces", planetSign: "Scorpio", planet: "Sun", page: 254,
    en: "Maintains influence in enemies' side, faces some hindrances in the house of destiny, has weakness in the house of Dharma, faces some opposition from the brothers and sisters",
    ta: "எதிரிகளின் பக்கம் செல்வாக்கு; விதி வீட்டில் சில தடைகள்; தர்ம வீட்டில் பலவீனம்; உடன்பிறப்புகளிடமிருந்து சில எதிர்ப்பு.",
  },
  {
    house: 9, lagna: "Pisces", planetSign: "Scorpio", planet: "Moon", page: 256,
    en: "Faces weakness in education and intellect, gets the loss of destiny and distress in children's side, possesses nice attitude about brothers and sisters, chalks out schemes to acquire progress through some wrong and improper means",
    ta: "கல்வியிலும் அறிவிலும் பலவீனம்; விதியின் இழப்பும் பிள்ளைகள் பக்கம் துன்பமும்; சகோதர சகோதரிகள் பற்றி நல்ல மனப்பான்மை; தவறான, முறையற்ற வழிகளால் முன்னேற்றத்துக்குத் திட்டமிடுவார்.",
  },
  {
    house: 9, lagna: "Pisces", planetSign: "Scorpio", planet: "Mars", page: 258,
    en: "Is very fortunate and religious, earns wealth through the power of destiny, gets the pleasures of the family, has some enmity with brother, gets land and buildings, receives help from mother, is influential",
    ta: "மிக அதிர்ஷ்டசாலி, தர்மவான்; விதியின் வலிமையால் செல்வம்; குடும்ப இன்பங்கள்; சகோதரருடன் சில பகை; நிலமும் கட்டிடங்களும்; தாயின் உதவி; செல்வாக்குள்ளவர்.",
  },
  {
    house: 9, lagna: "Pisces", planetSign: "Scorpio", planet: "Mercury", page: 260,
    en: "Gets good luck in connection with family, gets the affection of mother, gains increased fortune due to wife, gets success in diumal occupation, gets a religious wife, happiness of brothers and sisters, possesses buildings and property",
    ta: "குடும்ப வகையில் நல்ல அதிர்ஷ்டம்; தாயின் அன்பு; மனைவியால் அதிகரிக்கும் அதிர்ஷ்டம்; நாள் தொழிலில் வெற்றி; தர்மமுள்ள மனைவி; சகோதர சகோதரிகளின் மகிழ்ச்சி; நிலமும் சொத்தும்.",
  },
  {
    house: 9, lagna: "Pisces", planetSign: "Scorpio", planet: "Jupiter", page: 262,
    en: "Is very fortunate, religious and likes justice, gets advantage from government, society and father, has a handsome body, gets enhanced will-power and divine power, possesses purity in heart, gains advantage from children, speaks very nicely, pays much importance to self-respect, gives less importance to brother, and is influential and learned",
    ta: "மிக அதிர்ஷ்டசாலி, தர்மவான், நீதியை விரும்புவார்; அரசு, சமூகம், தந்தை வகையில் ஆதாயம்; அழகான உடல்; மேம்பட்ட ஆற்றலும் தெய்வ சக்தியும்; இதயத்தில் தூய்மை; பிள்ளைகளால் ஆதாயம்; மிக நன்றாகப் பேசுவார்; சுயமரியாதைக்கு அதிக முக்கியத்துவம்; சகோதரருக்கு குறைந்த முக்கியத்துவம்; செல்வாக்குள்ளவர், கற்றவர்.",
  },
  {
    house: 9, lagna: "Pisces", planetSign: "Scorpio", planet: "Venus", page: 265,
    en: "Attains great joy in the daily routine of life through the destiny, gets some deficiency in fame, works very cleverly",
    ta: "விதியின் மூலம் தினசரி வாழ்வில் பெரும் மகிழ்ச்சி; புகழில் சில குறை; மிகவும் சாமர்த்தியமாக வேலை செய்வார்.",
  },
  {
    house: 9, lagna: "Pisces", planetSign: "Scorpio", planet: "Saturn", page: 267,
    en: "Gets heavy income due to destiny, labours hard, holds great influence over enemies, and is selfish",
    ta: "விதியால் பெரும் வருமானம்; கடுமையாக உழைப்பார்; எதிரிகள் மீது பெரும் செல்வாக்கு; சுயநலமானவர்.",
  },
  {
    house: 9, lagna: "Pisces", planetSign: "Scorpio", planet: "Rahu", page: 269,
    en: "Bears hindrances in the house of destiny, incurs loss in the house of Dharma, feces sudden blows in the house of fate, has deficiency in fame",
    ta: "விதி வீட்டில் தடைகள்; தர்ம வீட்டில் இழப்பு; விதி வீட்டில் திடீர் அடிகள்; புகழில் குறை.",
  },
  {
    house: 9, lagna: "Pisces", planetSign: "Scorpio", planet: "Ketu", page: 271,
    en: "Faces severe anxiety in the house of destiny, bears loss in the house of Dharma, works very hard for the rise of income and fortune, progresses with secret devices, gets deficiency in fame, has deficiency in the reliance on God, and is somewhat restless",
    ta: "விதி வீட்டில் கடுமையான கவலை; தர்ம வீட்டில் இழப்பு; வருமானத்தையும் அதிர்ஷ்டத்தையும் உயர்த்த கடினமாக உழைப்பார்; மறைமுக வழிகளில் முன்னேறுவார்; புகழில் குறை; இறைநம்பிக்கையில் குறை; சற்று அமைதியற்றவர்.",
  },
  {
    house: 10, lagna: "Aries", planetSign: "Capricorn", planet: "Sun", page: 22,
    en: "Childish in behaviour, develops enmity with father, faces hindrances in the advancement of occupation side i.e. profession, gets opposition in society and government, his work lacks decency, respects mother, happiness in the matters concerning houses and landed property",
    ta: "குழந்தைத்தனமான நடத்தை; தந்தையுடன் பகை; தொழில் முன்னேற்றத்தில் தடைகள்; சமூகத்திலும் அரசிலும் எதிர்ப்பு; வேலையில் நேர்த்தி இல்லை; தாயை மதிப்பார்; வீடு, நிலம் சம்பந்தமான விஷயங்களில் மகிழ்ச்சி.",
  },
  {
    house: 10, lagna: "Aries", planetSign: "Capricorn", planet: "Moon", page: 24,
    en: "Gets affection from father, acquires landed property, help from government and society, gets favours, success in business, does good deeds, wears good dress, appreciates beauty and decoration, thinks high",
    ta: "தந்தையின் அன்பு; நிலச் சொத்து; அரசு, சமூகத்தின் உதவி; சலுகைகள்; தொழிலில் வெற்றி; நல்ல செயல்கள்; நல்ல உடை; அழகையும் அலங்காரத்தையும் ரசிப்பார்; உயர்ந்த எண்ணங்கள்.",
  },
  {
    house: 10, lagna: "Aries", planetSign: "Capricorn", planet: "Mars", page: 26,
    en: "Great physical strength, gets the dignity and supremacy in the daily routine of life, has self-respect and pride, becomes famous and is respected by the government and society, does grand deeds, has a good personality, gets his work done, is independent and orders, but careless about pleasures, good in education and intellect, not a dutiful son, naughty",
    ta: "பெரும் உடல் வலிமை; தினசரி வாழ்வில் மேன்மையும் ஆதிக்கமும்; தன்மானமும் பெருமையும்; புகழ் பெற்று அரசு, சமூகத்தால் மதிக்கப்படுவார்; பெரிய செயல்கள்; நல்ல ஆளுமை; தன் வேலையை முடிப்பார்; சுதந்திரமானவர், ஆணையிடுபவர்; இன்பங்களில் கவனக்குறைவு; கல்வியிலும் அறிவிலும் நல்லவர்; கீழ்ப்படியாத மகன்; குறும்பானவர்.",
  },
  {
    house: 10, lagna: "Aries", planetSign: "Capricorn", planet: "Mercury", page: 28,
    en: "Discriminative, help from brothers and sisters, help from father, gets honour and power in government and society due to his hard labour, improvement in industry",
    ta: "பகுத்தறிவுள்ளவர்; சகோதர சகோதரிகளின் உதவி; தந்தையின் உதவி; கடின உழைப்பால் அரசு, சமூகத்தில் மரியாதையும் அதிகாரமும்; தொழில் முன்னேற்றம்.",
  },
  {
    house: 10, lagna: "Aries", planetSign: "Capricorn", planet: "Jupiter", page: 30,
    en: "Successful in business but does not get special importance in society and government, honourable spending, gets peace and happiness. Divine help",
    ta: "தொழிலில் வெற்றி, ஆனால் அரசு, சமூகத்தில் சிறப்பு மதிப்பு இல்லை; மரியாதையான செலவு; அமைதியும் மகிழ்ச்சியும்; தெய்வ உதவி.",
  },
  {
    house: 10, lagna: "Aries", planetSign: "Capricorn", planet: "Venus", page: 32,
    en: "Gets advantage from father, happiness in the house of mother and landed property, is very rich, famous and wise",
    ta: "தந்தையின் ஆதாயம்; தாய் வீட்டிலும் நிலச் சொத்திலும் மகிழ்ச்சி; மிகுந்த செல்வந்தர்; புகழும் ஞானமும்.",
  },
  {
    house: 10, lagna: "Aries", planetSign: "Capricorn", planet: "Saturn", page: 34,
    en: "Conducts big business, good income, help from government and society spends lavishly, enjoys sexual pleasures, does industrious actions to progress and has self-pride",
    ta: "பெரிய வணிகம் நடத்துவார்; நல்ல வருமானம்; அரசு, சமூகத்தின் உதவி; ஆடம்பரமாகச் செலவழிப்பார்; இன்பங்களை அனுபவிப்பார்; முன்னேற்றத்துக்கு கடுமையாக உழைப்பார்; சுயபெருமை.",
  },
  {
    house: 10, lagna: "Aries", planetSign: "Capricorn", planet: "Rahu", page: 36,
    en: "Not happy with father, faces hindrances in the way of progress, business and occupation, has latent power to get his work done, gets success after great efforts",
    ta: "தந்தையுடன் மகிழ்ச்சியின்மை; தொழில், வாழ்வாதாரத்தில் முன்னேற்றத்துக்குத் தடைகள்; செயலை நிறைவேற்ற மறைந்த ஆற்றல்; பெரும் முயற்சிக்குப் பின் வெற்றி.",
  },
  {
    house: 10, lagna: "Aries", planetSign: "Capricorn", planet: "Ketu", page: 38,
    en: "Gets some distress, loss and deficiency from paternal sources, not happy in occupation, success after great hard work, loss of honour and respect, works bravely",
    ta: "தந்தை வழியில் சில துன்பம், இழப்பு, குறை; தொழிலில் மகிழ்ச்சியின்மை; பெரும் கடின உழைப்பால் வெற்றி; மரியாதையும் கௌரவமும் இழப்பு; தைரியமாக வேலை செய்வார்.",
  },
  {
    house: 10, lagna: "Taurus", planetSign: "Aquarius", planet: "Sun", page: 43,
    en: "Happiness from mother and enmity with father, gets the happiness of lands and buildings, some recognition from society and government, happiness in occupation, loss due to some laziness",
    ta: "தாயால் மகிழ்ச்சி; தந்தையுடன் பகை; நிலமும் வீடும் மகிழ்ச்சி; சில அரசு, சமூக அங்கீகாரம்; தொழிலில் மகிழ்ச்சி; சோம்பலால் சில இழப்பு.",
  },
  {
    house: 10, lagna: "Taurus", planetSign: "Aquarius", planet: "Moon", page: 45,
    en: "Help from brothers and sisters, progress of work in government and society, happiness from mother and has pleasing memories",
    ta: "சகோதர சகோதரிகளின் உதவி; அரசு, சமூகத்தில் வேலை முன்னேற்றம்; தாயால் மகிழ்ச்சி; இனிய நினைவுகள்.",
  },
  {
    house: 10, lagna: "Taurus", planetSign: "Aquarius", planet: "Mars", page: 47,
    en: "Does good work in professional area, disorder in the body, loss through children and weak in education, loss through father, mixed feelings in sexual pleasures",
    ta: "தொழில் துறையில் நல்ல பணி; உடலில் கோளாறு; பிள்ளைகளால் இழப்பு; கல்வியில் பலவீனம்; தந்தையால் இழப்பு; பாலியல் இன்பத்தில் கலவையான உணர்வுகள்.",
  },
  {
    house: 10, lagna: "Taurus", planetSign: "Aquarius", planet: "Mercury", page: 49,
    en: "Gets high education, gets government job, gains from father and also children, earns huge wealth and distinction in business, enjoys gain from government and society, respected, gains from buildings and lands and is clever",
    ta: "உயர் கல்வி; அரசு வேலை; தந்தை, பிள்ளைகள் வகையில் ஆதாயம்; வணிகத்தில் பெரும் செல்வமும் புகழும்; அரசு, சமூகத்தில் ஆதாயம்; மரியாதைக்குரியவர்; நிலம், கட்டிடங்களால் ஆதாயம்; சாமர்த்தியமானவர்.",
  },
  {
    house: 10, lagna: "Taurus", planetSign: "Aquarius", planet: "Jupiter", page: 51,
    en: "Gets connection with foreign countries and also some enmity loss with father, gains through much hard work, some weakness in the house of government and society, honourable spending, uses all devices to improve wealth and influence, little deficiency in the house of mother and tries to remove it",
    ta: "வெளிநாடுகளுடன் தொடர்பு; தந்தையுடன் சில பகையும் இழப்பும்; கடின உழைப்பால் ஆதாயம்; அரசு, சமூகத்தில் சில பலவீனம்; கம்பீரமான செலவு; செல்வத்தையும் செல்வாக்கையும் மேம்படுத்த எல்லா உபாயங்களையும் பயன்படுத்துவார்; தாய் வீட்டில் சிறு குறை, அதை நீக்க முயல்வார்.",
  },
  {
    house: 10, lagna: "Taurus", planetSign: "Aquarius", planet: "Venus", page: 53,
    en: "Gets progress in government and society, some problem with father, keeps his influence in the house of enemies, unhappy with mother, gets honour and progress in business, feels a little unhappy",
    ta: "அரசு, சமூகத்தில் முன்னேற்றம்; தந்தையுடன் சில பிரச்சினை; எதிரி வீட்டில் செல்வாக்கு; தாயுடன் அதிருப்தி; வணிகத்தில் மரியாதையும் முன்னேற்றமும்; சிறிது அதிருப்தி.",
  },
  {
    house: 10, lagna: "Taurus", planetSign: "Aquarius", planet: "Saturn", page: 55,
    en: "Gets great honour in government and society, carelessness and mistakes in the house of expenditure, unhappy with mother, enmity with wife, does a grand business and feels a bit unhappy",
    ta: "அரசு, சமூகத்தில் பெரும் மரியாதை; செலவு வீட்டில் கவனக்குறைவும் தவறுகளும்; தாயுடன் அதிருப்தி; மனைவியுடன் பகை; பெரிய வணிகம் நடத்துவார், ஆனாலும் சிறிது அதிருப்தி.",
  },
  {
    house: 10, lagna: "Taurus", planetSign: "Aquarius", planet: "Rahu", page: 57,
    en: "Dissatisfaction with father, does hard labour and puts in efforts for the progress of his position, works with anxiety in matters of government and society, works with anxiety in connection with business and occupation",
    ta: "தந்தையிடம் அதிருப்தி; கடின உழைப்பும் முயற்சியும்; அரசு, சமூக விவகாரங்களில் கவலை; வணிகம், தொழிலில் கவலை.",
  },
  {
    house: 10, lagna: "Taurus", planetSign: "Aquarius", planet: "Ketu", page: 59,
    en: "Unhappy with father and finds problems in government and society affairs, works hard in the business",
    ta: "தந்தையுடன் அதிருப்தி; அரசு, சமூக விவகாரங்களில் சிக்கல்; வணிகத்தில் கடினமாக உழைப்பார்.",
  },
  {
    house: 10, lagna: "Gemini", planetSign: "Pisces", planet: "Sun", page: 63,
    en: "Makes huge progress by energy and strength, gets the influence of father, gets cooperation from brothers, progress and influence in the house of government and society, gets success of labour, does some good and is very courageous",
    ta: "பெரும் முன்னேற்றம் ஆற்றலாலும் வலிமையாலும்; தந்தையின் செல்வாக்கு; சகோதரர்களின் ஒத்துழைப்பு; அரசு, சமூகத்தில் முன்னேற்றமும் செல்வாக்கும்; உழைப்பில் வெற்றி; சில நன்மைகள்; மிகுந்த தைரியம்.",
  },
  {
    house: 10, lagna: "Gemini", planetSign: "Pisces", planet: "Moon", page: 65,
    en: "Property through father, huge wealth through business, gets respect in government and society, desire to progress, some bondage in the house of wealth",
    ta: "தந்தை வழியில் சொத்து; வணிகத்தால் பெரும் செல்வம்; அரசு, சமூகத்தில் மரியாதை; முன்னேற்ற ஆசை; செல்வ வீட்டில் சில கட்டுப்பாடு.",
  },
  {
    house: 10, lagna: "Gemini", planetSign: "Pisces", planet: "Mars", page: 67,
    en: "Does influential and laborious deeds, gains from government and society, victory and gains from the house of enemy, difficulties with house of father, success with hard labour in the house of education, some gains with difficulty in the side of children, deficiency in the maternal happiness",
    ta: "செல்வாக்கான, கடின உழைப்பு; அரசு, சமூகத்தில் ஆதாயம்; எதிரி வீட்டில் வெற்றியும் ஆதாயமும்; தந்தை வீட்டில் சிரமங்கள்; கல்வி வீட்டில் கடின உழைப்பால் வெற்றி; பிள்ளைகள் வகையில் சில சிரமத்துடன் ஆதாயம்; தாய் வகையில் மகிழ்ச்சிக் குறை.",
  },
  {
    house: 10, lagna: "Gemini", planetSign: "Pisces", planet: "Mercury", page: 69,
    en: "Gets weakness in the house of father, gets honour, weakness in the body, gets some weakness in the social and government atmosphere, thought to be lazy, gets obstmctions in the house of progress",
    ta: "தந்தை வீட்டில் பலவீனம்; மரியாதை; உடலில் பலவீனம்; அரசு, சமூக சூழலில் சில பலவீனம்; சோம்பேறி என்று கருதப்படுவார்; முன்னேற்றத்துக்குத் தடைகள்.",
  },
  {
    house: 10, lagna: "Gemini", planetSign: "Pisces", planet: "Jupiter", page: 71,
    en: "Feels great respect and dignity in business, progress in the house of occupation, help from father, gets honour in government and society, help from wife, great authority in worldly affairs",
    ta: "வணிகத்தில் பெரும் மரியாதையும் கௌரவமும்; தொழில் வீட்டில் முன்னேற்றம்; தந்தையின் உதவி; அரசு, சமூகத்தில் மரியாதை; மனைவியின் உதவி; உலக விவகாரங்களில் பெரும் அதிகாரம்.",
  },
  {
    house: 10, lagna: "Gemini", planetSign: "Pisces", planet: "Venus", page: 73,
    en: "Gets education and strength of children, satisfaction from the house and strength of business, but gets weakness in every matter, spends much, enmity with mother, does not care for pleasures, is very clever and influential",
    ta: "கல்வியும் பிள்ளைகளின் வலிமையும்; வீட்டிலும் வணிகத்தின் வலிமையிலும் திருப்தி; ஆனால் ஒவ்வொரு விஷயத்திலும் சிறு பலவீனம்; அதிகம் செலவழிப்பார்; தாயுடன் பகை; இன்பங்களில் அக்கறையில்லாதவர்; மிகவும் சாமர்த்தியமும் செல்வாக்கும்.",
  },
  {
    house: 10, lagna: "Gemini", planetSign: "Pisces", planet: "Saturn", page: 75,
    en: "Loss in the house of father, rise in line of progress, does grand deeds to get respect in government and society, gets worries, spends much, progress in the daily occupation, some enmity with wife and family, influential",
    ta: "தந்தை வீட்டில் இழப்பு; முன்னேற்றப் பாதையில் உயர்வு; அரசு, சமூகத்தில் மரியாதை பெற பெரிய செயல்கள்; கவலைகள்; அதிகம் செலவழிப்பார்; தினசரி தொழிலில் முன்னேற்றம்; மனைவி, குடும்பத்துடன் சில பகை; செல்வாக்குள்ளவர்.",
  },
  {
    house: 10, lagna: "Gemini", planetSign: "Pisces", planet: "Rahu", page: 77,
    en: "Worry in the house of father, works through some troublesome devices for his progress, weakness and trouble in the house of government and society, controls the situation with great care and at last gets progress",
    ta: "தந்தை வீட்டில் கவலை; முன்னேற்றத்துக்காக சில தொல்லையான உபாயங்கள்; அரசு, சமூக வீட்டில் பலவீனமும் தொல்லையும்; மிகுந்த கவனத்துடன் நிலைமையைக் கட்டுப்படுத்துவார்; இறுதியில் முன்னேற்றம்.",
  },
  {
    house: 10, lagna: "Gemini", planetSign: "Pisces", planet: "Ketu", page: 79,
    en: "Some loss and some worry in the way of position, does hard work to get honour in the works of government and society, at the end gets some strong power",
    ta: "நிலையில் சில இழப்பும் கவலையும்; அரசு, சமூக வேலைகளில் மரியாதை பெற கடினமாக உழைப்பார்; இறுதியில் சில வலிமையான ஆற்றல்.",
  },
  {
    house: 10, lagna: "Cancer", planetSign: "Aries", planet: "Sun", page: 83,
    en: "Owner of the powerful influence, is a bit careless about land and property, gets wealth, respect in the house of father, earns wealth through trade or some other respectable job, some hindrance in the house of mother, gets obstacles in peace, respect from government and society, possesses high family, is dignified and influential",
    ta: "பெரும் செல்வாக்குள்ளவர்; நிலம், சொத்தில் சற்று அக்கறையின்மை; செல்வம்; தந்தை வீட்டில் மரியாதை; வணிகம் அல்லது வேறு மரியாதைக்குரிய வேலை மூலம் செல்வம்; தாய் வீட்டில் சில தடை; அமைதியில் தடைகள்; அரசு, சமூகத்தில் மரியாதை; உயர் குடும்பம்; கம்பீரமும் செல்வாக்கும்.",
  },
  {
    house: 10, lagna: "Cancer", planetSign: "Aries", planet: "Moon", page: 86,
    en: "Majestic, gains from parents, conducts big occupation, lives with great pomp and show, feels happy, wants land and property, does good deeds, gets the respect of government and society",
    ta: "கம்பீரமானவர்; பெற்றோரால் ஆதாயம்; பெரிய தொழில் நடத்துவார்; பெரும் ஆடம்பரமாக வாழ்வார்; மகிழ்ச்சி; நிலமும் சொத்தும் விரும்புவார்; நல்ல செயல்கள்; அரசு, சமூகத்தின் மரியாதை.",
  },
  {
    house: 10, lagna: "Cancer", planetSign: "Aries", planet: "Mars", page: 88,
    en: "Is of great managerial ability, works for government and society, is very wise, speaks intellectually, gets honour and respect, is very beautiful, weakness in the body, is very dignified and influential",
    ta: "மிகுந்த நிர்வாகத் திறன்; அரசு, சமூகத்துக்காக வேலை; மிகுந்த அறிவு; அறிவார்ந்த பேச்சு; மரியாதையும் கௌரவமும்; மிக அழகானவர்; உடலில் பலவீனம்; கம்பீரமும் செல்வாக்கும்.",
  },
  {
    house: 10, lagna: "Cancer", planetSign: "Aries", planet: "Mercury", page: 90,
    en: "Works in a big way through the power of discrimination, possesses some greatness and some weakness in the house of brother and father, spends much for happiness, some weakness in the house of mother, some deficiency of success in connection with the house of government and society",
    ta: "பகுத்தறிவின் வலிமையால் பெரிய அளவில் வேலை; சில பெருமையும் சகோதரர், தந்தை வீட்டில் சில பலவீனமும்; மகிழ்ச்சிக்காக அதிகம் செலவழிப்பார்; தாய் வீட்டில் சில பலவீனம்; அரசு, சமூக வீட்டில் வெற்றி குறைவு.",
  },
  {
    house: 10, lagna: "Cancer", planetSign: "Aries", planet: "Jupiter", page: 92,
    en: "Is very influential and fortunate and has great managerial ability and solves very knotty business problems, gets influence in the house of government and society and father, works very hard to rise in position, becomes head in his circle, is very clever",
    ta: "மிகுந்த செல்வாக்கும் அதிர்ஷ்டமும்; சிறந்த நிர்வாகத் திறன்; மிகச் சிக்கலான வணிகப் பிரச்சினைகளைத் தீர்ப்பார்; அரசு, சமூகம், தந்தை வீட்டில் செல்வாக்கு; பதவியில் உயர கடுமையாக உழைப்பார்; தன் வட்டத்தில் தலைவராவார்; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 10, lagna: "Cancer", planetSign: "Aries", planet: "Venus", page: 94,
    en: "Gain from parents and advantage and power from the government and society, does decent deeds, gains land and property, owns vehicles, skilful and clever",
    ta: "பெற்றோரால் ஆதாயம்; அரசு, சமூகத்தில் ஆதாயமும் ஆற்றலும்; நல்ல செயல்கள்; நிலமும் சொத்தும்; வாகனங்கள் உண்டு; திறமையானவர், சாமர்த்தியமானவர்.",
  },
  {
    house: 10, lagna: "Cancer", planetSign: "Aries", planet: "Saturn", page: 96,
    en: "Great trouble in the house of father, undertakes laborious and intricate deeds from the daily development of business and occupation, strange struggle in connection with the wife and family, gets happiness and some buildings and property, artificial happiness in the house of mother, spends much, enjoys the gains of daily business occupation through some secret devices in the house of government and society, some deficiency on having special desire of sexual pleasures, somewhat lazy",
    ta: "தந்தை வீட்டில் பெரும் துன்பம்; வணிகம், தொழிலின் தினசரி வளர்ச்சியில் கடின, சிக்கலான செயல்கள்; மனைவி, குடும்பத்துடன் விசித்திரமான போராட்டம்; மகிழ்ச்சியும் சில கட்டிடங்களும் சொத்தும்; தாய் வீட்டில் செயற்கையான மகிழ்ச்சி; அதிகம் செலவழிப்பார்; அரசு, சமூக வீட்டில் ரகசிய வழிகளால் தினசரி வணிக ஆதாயம்; பாலியல் இன்பத்தில் சிறப்பு ஆசை இல்லாமை; சற்று சோம்பல்.",
  },
  {
    house: 10, lagna: "Cancer", planetSign: "Aries", planet: "Rahu", page: 98,
    en: "Trouble in the house of father, bears great hardship in trade, gets respect from government and society after bearing great troubles, possesses great artistic schemes in his mind and is very industrious",
    ta: "தந்தை வீட்டில் தொல்லை; வணிகத்தில் பெரும் சிரமம்; பெரும் துன்பங்களுக்குப் பின் அரசு, சமூகத்தில் மரியாதை; மனத்தில் சிறந்த கலைத்திறன் திட்டங்கள்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 10, lagna: "Cancer", planetSign: "Aries", planet: "Ketu", page: 100,
    en: "Loss in the house of father, bears hardships and penalties in the house of trade, labours hard for the rise of trade, bears hardships and perplexity in the house of government and society, is very industrious",
    ta: "தந்தை வீட்டில் இழப்பு; வணிக வீட்டில் சிரமங்களும் தண்டனைகளும்; வணிக முன்னேற்றத்துக்குக் கடுமையாக உழைப்பார்; அரசு, சமூக வீட்டில் சிரமமும் குழப்பமும்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 10, lagna: "Leo", planetSign: "Taurus", planet: "Moon", page: 107,
    en: "Gets losses in local business, some weakness in the house of father or local position, some weakness in building and property, some weakness in the house of happiness and also spends too much in a royal manner, power of expenditure in the house of government and society and houses",
    ta: "உள்ளூர் வணிகத்தில் இழப்பு; தந்தை வீட்டில் அல்லது உள்ளூர் நிலையில் சில பலவீனம்; கட்டிடம், சொத்தில் சில பலவீனம்; மகிழ்ச்சி வீட்டில் சில பலவீனம்; அரச பாணியில் அதிகம் செலவழிப்பார்; அரசு, சமூக வீட்டிலும் வீடுகளிலும் செலவு செய்யும் ஆற்றல்.",
  },
  {
    house: 10, lagna: "Leo", planetSign: "Taurus", planet: "Mars", page: 109,
    en: "Gets progress and happiness through business, has good property and land, observes religious formalities, gets great respect in government and society, gets success in the line of education, peace and happiness from children, good health, is very influential",
    ta: "வணிகத்தில் முன்னேற்றமும் மகிழ்ச்சியும்; நல்ல சொத்தும் நிலமும்; மதச் சடங்குகளைக் கடைப்பிடிப்பார்; அரசு, சமூகத்தில் பெரும் மரியாதை; கல்வியில் வெற்றி; பிள்ளைகளால் அமைதியும் மகிழ்ச்சியும்; நல்ல உடல்நலம்; மிகுந்த செல்வாக்கு.",
  },
  {
    house: 10, lagna: "Leo", planetSign: "Taurus", planet: "Mercury", page: 111,
    en: "Secures progress in trade and business, gets power of wealth, gets great respect in government and society, increase of wealth and in the profession of father's house, acquires gains from the side of mother, gets strength of lands and buildings",
    ta: "வணிகத்திலும் தொழிலிலும் முன்னேற்றம்; செல்வ வலிமை; அரசு, சமூகத்தில் பெரும் மரியாதை; செல்வ வளர்ச்சியும் தந்தை வீட்டின் தொழிலும்; தாய் வீட்டில் ஆதாயம்; நிலம், கட்டிடங்களின் வலிமை.",
  },
  {
    house: 10, lagna: "Leo", planetSign: "Taurus", planet: "Jupiter", page: 113,
    en: "Deficiency in the house of father, gets the power of children, secret policy in the house of enemy, hard labour to acquire honour in government and society, is self-conceited and skilful",
    ta: "தந்தை வீட்டில் குறை; பிள்ளைகளின் ஆற்றல்; எதிரி வீட்டில் ரகசிய உபாயம்; அரசு, சமூகத்தில் மரியாதை பெற கடின உழைப்பு; தன்னைப் பெரிதாக நினைப்பவர், திறமையானவர்.",
  },
  {
    house: 10, lagna: "Leo", planetSign: "Taurus", planet: "Venus", page: 115,
    en: "Advantage from brothers, sisters and father, gets fame and appreciation for success and honour and success in government and society, great success in business, rise in prestige, power of buildings and property, gets success in business, ambitious, majestic, industrious and self-conceited",
    ta: "சகோதரர், சகோதரி, தந்தை வகையில் ஆதாயம்; வெற்றிக்கும் மரியாதைக்கும் புகழும் பாராட்டும்; அரசு, சமூகத்தில் மரியாதையும் வெற்றியும்; வணிகத்தில் பெரும் வெற்றி; கௌரவம் உயர்வு; கட்டிடங்கள், சொத்தின் வலிமை; வணிகத்தில் வெற்றி; லட்சியமானவர், கம்பீரமானவர், சுறுசுறுப்பானவர், தன்னைப் பெரிதாக நினைப்பவர்.",
  },
  {
    house: 10, lagna: "Leo", planetSign: "Taurus", planet: "Saturn", page: 117,
    en: "Gets the power of daily occupation, gets great respect through his ability of daily occupation, progress of honour in government and society, gets power of wife and sexual pleasures, spends much, faces some hindrance in achieving peace and happiness, skilful and industrious",
    ta: "தினசரி தொழில் வலிமை; தினசரி தொழிலின் திறமையால் பெரும் மரியாதை; அரசு, சமூகத்தில் மரியாதை உயர்வு; மனைவி, பாலியல் இன்பத்தின் வலிமை; அதிகம் செலவழிப்பார்; அமைதியையும் மகிழ்ச்சியையும் அடைவதில் சில தடை; திறமையும் உழைப்பும்.",
  },
  {
    house: 10, lagna: "Leo", planetSign: "Taurus", planet: "Rahu", page: 119,
    en: "Great difficulties in the house of father, some troubles in connection with government and society, working through secret devices for securing progress, gets hindrances in the respect and fortunes, gets the way to progress through great diplomatic tactics after facing many hardships",
    ta: "தந்தை வீட்டில் பெரும் சிரமங்கள்; அரசு, சமூக விவகாரங்களில் சில தொல்லைகள்; முன்னேற்றத்துக்காக மறைந்த உபாயங்கள்; மரியாதையிலும் அதிர்ஷ்டத்திலும் தடைகள்; பல சிரமங்களுக்குப் பின் பெரும் ராஜதந்திர உபாயங்களால் முன்னேற்றப் பாதை.",
  },
  {
    house: 10, lagna: "Leo", planetSign: "Taurus", planet: "Ketu", page: 121,
    en: "Some loss in the house of father, puts in hard labour and bears hardships in the house of business and occupation, bears great trouble to rise in government and society, is very industrious and possesses secret energy",
    ta: "தந்தை வீட்டில் சில இழப்பு; வணிக, தொழில் வீட்டில் கடின உழைப்பும் சிரமங்களும்; அரசு, சமூகத்தில் உயர கடுமையான துன்பம்; மிகுந்த உழைப்பாளி; மறைந்த சக்தி உண்டு.",
  },
  {
    house: 10, lagna: "Virgo", planetSign: "Gemini", planet: "Sun", page: 126,
    en: "Some losses in the house of father, spends from the house of income and business magnificently, some loss in the house of mother, some deficiency in the rise of respect, honour in the house of business",
    ta: "தந்தை வீட்டில் சில இழப்பு; வருமான வீட்டிலிருந்தும் வணிகத்திலிருந்தும் பெரும் செலவு; தாய் வீட்டில் சில இழப்பு; மரியாதை உயர்வில் சில குறை; வணிக வீட்டில் மரியாதை.",
  },
  {
    house: 10, lagna: "Virgo", planetSign: "Gemini", planet: "Moon", page: 128,
    en: "Gains majestically from the business, gains heavily from the house of father, government and society, lives with great pomp and show, gets costly things, enjoys the pleasures, gains from the house of mother, land and buildings, gets family enjoyments",
    ta: "வணிகத்தில் கம்பீரமாக ஆதாயம்; தந்தை, அரசு, சமூக வீடுகளிலிருந்து பெரும் ஆதாயம்; பெரும் ஆடம்பர வாழ்வு; விலையுயர்ந்த பொருட்கள்; இன்பங்கள்; தாய், நிலம், கட்டிடங்களின் ஆதாயம்; குடும்ப இன்பங்கள்.",
  },
  {
    house: 10, lagna: "Virgo", planetSign: "Gemini", planet: "Mars", page: 130,
    en: "Troubles in the house of father, some pleasures and sufferings in his social and professional progress, some special power on the side of children, speaks roughly, some deficiency in the house of mother and happiness",
    ta: "தந்தை வீட்டில் துன்பம்; சமூக, தொழில் முன்னேற்றத்தில் சில இன்பமும் துன்பமும்; பிள்ளைகளின் மீது சிறப்பு ஆற்றல்; கடுமையாகப் பேசுவார்; தாய் வீட்டிலும் மகிழ்ச்சியிலும் சில குறை.",
  },
  {
    house: 10, lagna: "Virgo", planetSign: "Gemini", planet: "Mercury", page: 132,
    en: "Handsome body, does his business, gets pleasure and progress from the government and house of father, enjoys the happiness of mother, buildings and property, is a good manager",
    ta: "அழகான உடல்; வணிகம் நடத்துவார்; தந்தை வீட்டில் அரசு வகையில் மகிழ்ச்சியும் முன்னேற்றமும்; தாயின் மகிழ்ச்சி; கட்டிடங்கள், சொத்து; நல்ல நிர்வாகி.",
  },
  {
    house: 10, lagna: "Virgo", planetSign: "Gemini", planet: "Jupiter", page: 134,
    en: "Is dignified, industrious and gets the royal sexual pleasures, does a big business, earns huge wealth, has landed property, gets the pleasure of parents, gets respect in government and society, happiness in the house of wife, gets respect from occupation",
    ta: "கம்பீரமும் கடின உழைப்பும்; அரசு, சமூகத்தில் ராஜ இன்பங்கள்; பெரிய வணிகம், பெரும் செல்வம்; நிலச் சொத்து; பெற்றோரின் மகிழ்ச்சி; அரசு, சமூகத்தில் மரியாதை; மனைவி வீட்டில் மகிழ்ச்சி; தொழிலில் மரியாதை.",
  },
  {
    house: 10, lagna: "Virgo", planetSign: "Gemini", planet: "Venus", page: 137,
    en: "Gets great respect, thought to be very fortunate, success from the house of father, cams wealth through cleverness from big business",
    ta: "மிகுந்த மரியாதை; மிக அதிர்ஷ்டசாலி என்று கருதப்படுவார்; தந்தை வீட்டில் வெற்றி; பெரிய வணிகத்தில் சாமர்த்தியத்தால் செல்வம்.",
  },
  {
    house: 10, lagna: "Virgo", planetSign: "Gemini", planet: "Saturn", page: 139,
    en: "Increases his influence by his ability, gets honour through the intellectual power, gets respect on the side of children with some difficulties, has great skill in political affairs, secures progress from the house of father with some difficulties, gets success in business, some bitterness with expenditure, is very skilful",
    ta: "அறிவால் தன் செல்வாக்கை உயர்த்துவார்; அறிவாற்றலால் மரியாதை; பிள்ளைகள் வகையில் சில சிரமங்களுடன் மரியாதை; அரசியல் விவகாரங்களில் பெரும் திறமை; தந்தை வீட்டில் சில சிரமங்களுடன் முன்னேற்றம்; வணிகத்தில் வெற்றி; செலவில் சில கசப்பு; மிகவும் திறமையானவர்.",
  },
  {
    house: 10, lagna: "Virgo", planetSign: "Gemini", planet: "Rahu", page: 141,
    en: "Gets dignity in business, worries and gets influence in the matters of government and society through deep tactics",
    ta: "வணிகத்தில் கௌரவம்; கவலைகள்; ஆழமான தந்திரங்களால் அரசு, சமூக விவகாரங்களில் செல்வாக்கு.",
  },
  {
    house: 10, lagna: "Virgo", planetSign: "Gemini", planet: "Ketu", page: 143,
    en: "Gets loss and distress in the house of father, gets some worries in the house of government, hindrance in progress of business",
    ta: "தந்தை வீட்டில் இழப்பும் துன்பமும்; அரசு வீட்டில் சில கவலைகள்; வணிக முன்னேற்றத்தில் தடை.",
  },
  {
    house: 10, lagna: "Libra", planetSign: "Cancer", planet: "Sun", page: 147,
    en: "Gets the income with respect, conducts a big business, gets heavy gains in the house of father, is respectable and gains from the house of government, insipid about gains in connection with land and buildings, uses farsightedness in connection with business and occupation",
    ta: "மரியாதையுடன் வருமானம்; பெரிய வணிகம்; தந்தை வீட்டில் பெரும் ஆதாயம்; மதிப்புக்குரியவர், அரசு வீட்டிலிருந்து ஆதாயம்; நிலம், கட்டிடங்களில் ஆர்வமின்மை; வணிகம், தொழிலில் தொலைநோக்கு.",
  },
  {
    house: 10, lagna: "Libra", planetSign: "Cancer", planet: "Moon", page: 149,
    en: "Is respected in government, gets help from father, does big business, gets much pleasure because of his respect and honour, is Ml of self- pride, gets happiness in the house of mother, has property, is very industrious",
    ta: "அரசு வகையில் மதிக்கப்படுவார்; தந்தையிடமிருந்து உதவி; பெரிய வணிகம்; மிகுந்த மகிழ்ச்சி, மரியாதையாலும் கௌரவத்தாலும்; சுயபெருமை நிறைந்தவர்; தாய் வீட்டில் மகிழ்ச்சி; சொத்து; மிகவும் உழைப்பாளி.",
  },
  {
    house: 10, lagna: "Libra", planetSign: "Cancer", planet: "Mars", page: 151,
    en: "Gets the weakness of wealth and occupation, gets deficiency in government and society, bears the insulting agony in the house of wife and father on account of deficiency of wealth, bears deficiency and trouble in father, wife with a low standard of occupation, deficiency in sexual pleasures, is respected in government, help from father, does big business, gets much pleasure because of his respect and honour, is full of self-pride, gets happiness in the house of mother, very industrious",
    ta: "செல்வமும் தொழிலும் பலவீனம்; அரசு, சமூகத்தில் குறை; செல்வக் குறையால் மனைவி, தந்தை வீட்டில் அவமானமும் வேதனையும்; தந்தை, மனைவி வகையில் குறையும் தொல்லையும்; குறைந்த தரமுள்ள தொழில்; பாலியல் இன்பத்தில் குறை; அரசில் மதிக்கப்படுவார், தந்தையின் உதவி; பெரிய வணிகம்; மிகுந்த மகிழ்ச்சியும் மரியாதையும்; சுயபெருமை நிறைந்தவர்; தாய் வீட்டில் மகிழ்ச்சி; மிகுந்த உழைப்பாளி. (இந்த உரையில் சந்திரனின் வாக்கியமும் கலந்துள்ளது; அசல் அச்சில் அப்படியே உள்ளது.)",
  },
  {
    house: 10, lagna: "Libra", planetSign: "Cancer", planet: "Mercury", page: 153,
    en: "Full of valour and grandeur, conducts a very splendid business, gets honour by his good deeds, spends majestically, is respectable and a man of prestige",
    ta: "வீரமும் பெருமையும்; மிகச் சிறந்த வணிகம்; நல்ல செயல்களால் மரியாதை; செலவில் கம்பீரம்; மரியாதைக்குரியவர், கௌரவமானவர்.",
  },
  {
    house: 10, lagna: "Libra", planetSign: "Cancer", planet: "Jupiter", page: 155,
    en: "Is very influential, experiences separation in the house of mother and progresses in the house of father, does very little business, is very brave and powerful, has brothers and sisters, expert in intricate policy",
    ta: "மிகுந்த செல்வாக்குள்ளவர்; தாய் வீட்டில் பிரிவு, தந்தை வீட்டில் முன்னேற்றம்; மிகச் சிறிய வணிகம்; மிகுந்த தைரியமும் வலிமையும்; சகோதர சகோதரிகள் உண்டு; சிக்கலான அரசியலில் வல்லவர்.",
  },
  {
    house: 10, lagna: "Libra", planetSign: "Cancer", planet: "Venus", page: 157,
    en: "Spends life royally, gets authority, likes comforts and pleasures very much, difficulties in the progress of honour, gets progress in the business with some difficulty, is obstinate",
    ta: "அரசவாழ்வு; அதிகாரம்; வசதிகளையும் இன்பங்களையும் மிகவும் விரும்புவார்; மரியாதையின் முன்னேற்றத்தில் சிரமங்கள்; வணிகத்தில் சிரமத்துடன் முன்னேற்றம்; பிடிவாதமானவர்.",
  },
  {
    house: 10, lagna: "Libra", planetSign: "Cancer", planet: "Saturn", page: 159,
    en: "Enmity in the house of father, gets happiness from mother, gets power in the side of children, feels deficiency and mistakes in the house of wife, hurts wife by speech, some weakness in occupation, possesses buildings and is happy",
    ta: "தந்தை வீட்டில் பகை; தாயால் மகிழ்ச்சி; பிள்ளைகள் வகையில் ஆற்றல்; மனைவி வீட்டில் குறையும் தவறுகளும்; பேச்சால் மனைவியை காயப்படுத்துவார்; தொழிலில் சில பலவீனம்; கட்டிடங்கள் உண்டு, மகிழ்ச்சியானவர்.",
  },
  {
    house: 10, lagna: "Libra", planetSign: "Cancer", planet: "Rahu", page: 161,
    en: "Some loss in the house of father, some distress in government and society and the house of business",
    ta: "தந்தை வீட்டில் சில இழப்பு; அரசு, சமூகத்திலும் வணிக வீட்டிலும் சில துன்பம்.",
  },
  {
    house: 10, lagna: "Libra", planetSign: "Cancer", planet: "Ketu", page: 163,
    en: "Loss in the house of father, bears losses in the business and occupation, bears mental anxieties, and opposes the government",
    ta: "தந்தை வீட்டில் இழப்பு; வணிகத்திலும் தொழிலிலும் இழப்பு; மனத்தில் கவலைகள்; அரசை எதிர்ப்பார்.",
  },
  {
    house: 10, lagna: "Scorpio", planetSign: "Leo", planet: "Sun", page: 168,
    en: "Gets the splendour of government and society, has great authority, does not care for father, some opposition in the house of mother, and is restless",
    ta: "அரசு, சமூகத்தின் கம்பீரம்; பெரும் அதிகாரம்; தந்தையை மதிக்கமாட்டார்; தாய் வீட்டில் சில எதிர்ப்பு; அமைதியற்றவர்.",
  },
  {
    house: 10, lagna: "Scorpio", planetSign: "Leo", planet: "Moon", page: 171,
    en: "Is very fortunate, gets the happiness from government, does many good deeds and business, gets the help of mother",
    ta: "மிக அதிர்ஷ்டசாலி; அரசு வகையில் மகிழ்ச்சி; பல நல்ல செயல்களும் வணிகமும் செய்வார்; தாயின் உதவி.",
  },
  {
    house: 10, lagna: "Scorpio", planetSign: "Leo", planet: "Mars", page: 173,
    en: "Is very powerful, enjoys the pleasure of physique, is lustful, clever, diligent, secures the progress of the house of father, gets honour in the government and society, opposition in mother, gets the power of children is very wise and learned, speaks firmly, gets commanding power and fame",
    ta: "மிகுந்த ஆற்றல்; உடல் இன்பம்; காமமுள்ளவர், புத்திசாலி, கடின உழைப்பாளி; தந்தை வீட்டில் முன்னேற்றம்; அரசு, சமூகத்தில் மரியாதை; தாய் வகையில் எதிர்ப்பு; பிள்ளைகளின் ஆற்றல்; மிகுந்த ஞானமும் கல்வியும்; உறுதியாகப் பேசுவார்; கட்டளையிடும் ஆற்றலும் புகழும்.",
  },
  {
    house: 10, lagna: "Scorpio", planetSign: "Leo", planet: "Mercury", page: 175,
    en: "Gains respect and honour, gets the hereditary gains, distress in the house of father, gets a long life, spends the life doing very influential deeds, hindrances in connection with respect and honour for the rise of position",
    ta: "மரியாதையும் கௌரவமும் பெறுவார்; பரம்பரை ஆதாயம்; தந்தை வீட்டில் துன்பம்; நீண்ட ஆயுள்; மிகுந்த செல்வாக்குள்ள செயல்களால் வாழ்வு; பதவி உயர்வுக்கு மரியாதையிலும் கௌரவத்திலும் தடைகள்.",
  },
  {
    house: 10, lagna: "Scorpio", planetSign: "Leo", planet: "Jupiter", page: 177,
    en: "Is very respectable, earns much wealth, gets the power of wealth from government and society through intellect, gets the strength of wealth through business and from the house of father, pursues a big occupation, and is zealous",
    ta: "மிகவும் மரியாதைக்குரியவர்; மிகுந்த செல்வம்; அறிவால் அரசு, சமூகத்திலிருந்து செல்வ வலிமை; வணிகத்திலிருந்தும் தந்தை வீட்டிலிருந்தும் செல்வ வலிமை; பெரிய தொழில்; ஆர்வமானவர்.",
  },
  {
    house: 10, lagna: "Scorpio", planetSign: "Leo", planet: "Venus", page: 179,
    en: "Some perplexities in occupation, some weakness in wife's side, satisfactory happiness in the side of mother, gets buildings, deficiency in happiness, good sexual pleasures, some restlessness in the house of father",
    ta: "தொழிலில் சில குழப்பங்கள்; மனைவி வீட்டில் சில பலவீனம்; தாய் வகையில் திருப்திகரமான மகிழ்ச்சி; கட்டிடங்கள்; மகிழ்ச்சிக் குறை; நல்ல பாலியல் இன்பம்; தந்தை வீட்டில் சில அமைதியின்மை.",
  },
  {
    house: 10, lagna: "Scorpio", planetSign: "Leo", planet: "Saturn", page: 181,
    en: "Respects brother and father after some difficulty, spends much, conducts the occupation with determination, possesses his own building and properties, acquires sensual pleasures from the house of wife",
    ta: "தந்தையையும் சகோதரரையும் சில கஷ்டங்களுக்குப் பின் மதிப்பார்; அதிகம் செலவழிப்பார்; உறுதியுடன் தொழில் நடத்துவார்; சொந்த கட்டிடங்களும் சொத்துகளும்; மனைவி வீட்டிலிருந்து புலனின்பங்கள்.",
  },
  {
    house: 10, lagna: "Scorpio", planetSign: "Leo", planet: "Rahu", page: 183,
    en: "Bears loss and distress in the house of father, faces obstacles in government and society, is not honoured, faces great botheration in business and occupation, faces obstacles in the progress",
    ta: "தந்தை வீட்டில் இழப்பும் துன்பமும்; அரசு, சமூகத்தில் தடைகள்; மரியாதை கிடைக்காது; தொழிலிலும் வேலையிலும் பெரும் தொல்லை; முன்னேற்றத்தில் தடைகள்.",
  },
  {
    house: 10, lagna: "Scorpio", planetSign: "Leo", planet: "Ketu", page: 185,
    en: "Some weakness and loss in the house of father and faces hindrances in government and society, faces obstacles in the rise of position or prestige, faces many complexities in business progress, gets success late, is courageous and works patiently",
    ta: "தந்தை வீட்டில் சில பலவீனமும் இழப்பும்; அரசு, சமூகத்தில் தடைகள்; பதவி அல்லது கௌரவ உயர்வில் தடைகள்; வணிக முன்னேற்றத்தில் பல சிக்கல்கள்; தாமதமாக வெற்றி; தைரியமானவர், பொறுமையுடன் வேலை செய்வார்.",
  },
  {
    house: 10, lagna: "Sagittarius", planetSign: "Virgo", planet: "Sun", page: 190,
    en: "Is very fortunate, gets great honour and respect due to the power of the destiny, gets fame and success in business, gains from the father, gets progress and advantage from the government and society, follows the religious formalities very much, gets success in the house of mother, is very influential, wants justice and is an officer",
    ta: "மிக அதிர்ஷ்டசாலி; விதியின் வலிமையால் பெரும் மரியாதையும் கௌரவமும்; வணிகத்தில் புகழும் வெற்றியும்; தந்தையால் ஆதாயம்; அரசு, சமூகத்தில் முன்னேற்றமும் ஆதாயமும்; மதச் சடங்குகளை மிகுந்த அளவில் கடைப்பிடிப்பார்; தாய் வீட்டில் வெற்றி; மிகுந்த செல்வாக்குள்ளவர்; நீதியை விரும்புவார்; அதிகாரியாவார்.",
  },
  {
    house: 10, lagna: "Sagittarius", planetSign: "Virgo", planet: "Moon", page: 192,
    en: "Faces obstacles in the house of father, has a long age, faces obstacles in the rise of position, bears numerous troubles in the house of government, society and occupation, follows very obscure tactics",
    ta: "தந்தை வீட்டில் தடைகள்; நீண்ட வயது; பதவி உயர்வில் தடைகள்; அரசு, சமூகம், தொழில் வீட்டில் பல துன்பங்கள்; மிகவும் தெளிவற்ற தந்திரங்களைப் பின்பற்றுவார்.",
  },
  {
    house: 10, lagna: "Sagittarius", planetSign: "Virgo", planet: "Mars", page: 194,
    en: "Is literate, wise and has a good knowledge about government, injures father, spends much majestically, has some weakness in the body",
    ta: "படித்தவர், அறிவாளி, அரசு பற்றிய நல்ல அறிவு; தந்தைக்குக் காயம் செய்வார்; கம்பீரமாகச் செலவழிப்பார்; உடலில் சில பலவீனம்.",
  },
  {
    house: 10, lagna: "Sagittarius", planetSign: "Virgo", planet: "Mercury", page: 196,
    en: "Conducts a big business, gets much respect from government and society, gets a beautiful and influential wife, feces weakness from mother's side, has deficiency in the house of land and property, gets sexual pleasures",
    ta: "பெரிய வணிகம் நடத்துவார்; அரசு, சமூகத்தில் பெரும் மரியாதை; அழகான, செல்வாக்குள்ள மனைவி; தாய் வீட்டில் பலவீனம்; நிலமும் சொத்தும் குறை; பாலியல் இன்பம் உண்டு.",
  },
  {
    house: 10, lagna: "Sagittarius", planetSign: "Virgo", planet: "Jupiter", page: 198,
    en: "Pursues a big business comfortably, gets progress in occupation, gets land and property, gets honour in government and society, has some deficiency in wealth, is industrious and arrogant",
    ta: "பெரிய வணிகத்தை வசதியாக நடத்துவார்; தொழில் முன்னேற்றம்; நிலமும் சொத்தும்; அரசு, சமூகத்தில் மரியாதை; செல்வத்தில் சில குறை; கடின உழைப்பாளி, ஆணவம் உள்ளவர்.",
  },
  {
    house: 10, lagna: "Sagittarius", planetSign: "Virgo", planet: "Venus", page: 200,
    en: "Distress in the father's house, gets the weakness in the side of business progress and income, advantage in the house of property",
    ta: "தந்தை வீட்டில் துன்பம்; வணிக முன்னேற்றத்திலும் வருமானத்திலும் பலவீனம்; சொத்து வீட்டில் ஆதாயம்.",
  },
  {
    house: 10, lagna: "Sagittarius", planetSign: "Virgo", planet: "Saturn", page: 202,
    en: "Gets dignity in government administration, progresses much, earns wealth, has an influential occupation, faces some bondage in the wife's house, uses his full strength for the progress of occupation, and is obstinate",
    ta: "அரசு நிர்வாகத்தில் கௌரவம்; பெரும் முன்னேற்றம்; செல்வம் ஈட்டுவார்; செல்வாக்கான தொழில்; மனைவி வீட்டில் சில கட்டுப்பாடு; தொழில் முன்னேற்றத்துக்கு முழு வலிமையையும் பயன்படுத்துவார்; பிடிவாதமானவர்.",
  },
  {
    house: 10, lagna: "Sagittarius", planetSign: "Virgo", planet: "Rahu", page: 204,
    en: "Uses great tactics for his progress, unhappiness with father, works very secretly in business occupation, gets the advantage in government affairs, gets worry in social affairs",
    ta: "தன் முன்னேற்றத்துக்கு மிகுந்த தந்திரங்களைப் பயன்படுத்துவார்; தந்தை வகையில் அதிருப்தி; வணிகத் தொழிலில் மிக ரகசியமாக வேலை செய்வார்; அரசு வேலைகளில் ஆதாயம்; சமூக விவகாரங்களில் கவலை.",
  },
  {
    house: 10, lagna: "Sagittarius", planetSign: "Virgo", planet: "Ketu", page: 206,
    en: "Has some deficiency in father's house, bears some worry in business, works patiently for progress of business and occupation",
    ta: "தந்தை வீட்டில் சில குறை; வணிகத்தில் சில கவலை; வணிக, தொழில் முன்னேற்றத்துக்குப் பொறுமையாக வேலை செய்வார்.",
  },
  {
    house: 10, lagna: "Capricorn", planetSign: "Libra", planet: "Sun", page: 211,
    en: "Bears loss in father's house, has some weakness in connection with longevity, labours hard and faces worries in business, has some restlessness in the government, gains some parental advantages of land and buildings",
    ta: "தந்தை வீட்டில் இழப்பு; ஆயுளில் சில பலவீனம்; வணிகத்தில் கடின உழைப்பும் கவலைகளும்; அரசில் சில அமைதியின்மை; தந்தை வழியில் நிலமும் கட்டிடங்களும் ஆதாயம்.",
  },
  {
    house: 10, lagna: "Capricorn", planetSign: "Libra", planet: "Moon", page: 213,
    en: "Pursues a very good occupation, gets honour in dealing with business, gets respect in government, society and family, gets the help from parents, gets dignity from wife's side, acquires happiness from wife",
    ta: "மிக நல்ல தொழில்; வணிகத்தில் மரியாதை; அரசு, சமூகம், குடும்பத்தில் மரியாதை; பெற்றோரின் உதவி; மனைவி வீட்டில் கௌரவம்; மனைவியால் மகிழ்ச்சி.",
  },
  {
    house: 10, lagna: "Capricorn", planetSign: "Libra", planet: "Mars", page: 215,
    en: "Gets income through business and occupation, gets the advantage from government, gets advantage from father, gets the advantage from education, does influential deeds",
    ta: "வணிகத்தாலும் தொழிலாலும் வருமானம்; அரசிலிருந்து ஆதாயம்; தந்தையிடமிருந்து ஆதாயம்; கல்வியில் ஆதாயம்; செல்வாக்குள்ள செயல்கள்.",
  },
  {
    house: 10, lagna: "Capricorn", planetSign: "Libra", planet: "Mercury", page: 217,
    en: "Gets influence, rears the Dharma selfishly, acquires the progress in business, gains some strength and some weakness in the father's house, gets the advantage from the government, is honourable and fortunate",
    ta: "செல்வாக்கு பெறுவார்; தன் நலனுக்காக தர்மத்தைக் காப்பார்; வணிக முன்னேற்றம்; தந்தை வீட்டில் சில வலிமையும் சில பலவீனமும்; அரசிலிருந்து ஆதாயம்; மரியாதைக்குரியவர், அதிர்ஷ்டசாலி.",
  },
  {
    house: 10, lagna: "Capricorn", planetSign: "Libra", planet: "Jupiter", page: 219,
    en: "Loss in father's house, bears some deficiency and loss in occupation, honour and prestige, does not get success in spite of putting special efforts, spends much, faces some monetary deficiency and some monetary loss",
    ta: "தந்தை வீட்டில் இழப்பு; தொழிலிலும் மரியாதையிலும் சில குறையும் இழப்பும்; சிறப்பான முயற்சிகள் செய்தாலும் வெற்றி கிடைக்காது; அதிகம் செலவழிப்பார்; சில பண குறையும் பண இழப்பும்.",
  },
  {
    house: 10, lagna: "Capricorn", planetSign: "Libra", planet: "Venus", page: 221,
    en: "Gets government and administrative power, is a judge, gets a very high standard education, gets power from father and happiness from mother, possesses property, follows a big occupation, likes beauty and art, talks with dignity and influence, is very self-conceited, respectable, learned and industrious",
    ta: "அரசு, நிர்வாக அதிகாரம்; நீதிபதியாவார்; மிக உயர் தரக் கல்வி; தந்தையிடமிருந்து ஆற்றல், தாயிடமிருந்து மகிழ்ச்சி; சொத்து; பெரிய தொழில்; அழகையும் கலையையும் விரும்புவார்; கம்பீரமாகவும் செல்வாக்குடனும் பேசுவார்; மிகுந்த சுயபெருமை; மரியாதைக்குரியவர், கற்றவர், சுறுசுறுப்பானவர்.",
  },
  {
    house: 10, lagna: "Capricorn", planetSign: "Libra", planet: "Saturn", page: 223,
    en: "Does a big business with the help of money, gets a splendid body, is very influential, gets honour in the house of government and progress in the house of father, has deficiency in mother's house, gets enmity in wife's side, gets worries in the line of occupation, gets the splendour of sexual pleasure",
    ta: "பணத்தின் உதவியால் பெரிய வணிகம் நடத்துவார்; அழகான உடல்; மிகுந்த செல்வாக்குள்ளவர்; அரசு வீட்டில் மரியாதை, தந்தை வீட்டில் முன்னேற்றம்; தாய் வீட்டில் குறை; மனைவி வீட்டில் பகை; தொழில் வகையில் கவலைகள்; பாலியல் இன்பத்தின் சிறப்பு.",
  },
  {
    house: 10, lagna: "Capricorn", planetSign: "Libra", planet: "Rahu", page: 225,
    en: "Has some unhappiness in father's house, gets some obstacles in business and progress, gets the work done connected with government after facing some worries",
    ta: "தந்தை வீட்டில் சில மகிழ்ச்சியின்மை; வணிகத்திலும் முன்னேற்றத்திலும் சில தடைகள்; அரசு தொடர்பான வேலையை சில கவலைகளுக்குப் பின் முடிப்பார்.",
  },
  {
    house: 10, lagna: "Capricorn", planetSign: "Libra", planet: "Ketu", page: 227,
    en: "Faces some obstacles in the father's house, bears worries in business, puts hard work for the progress of business, some perplexity in the government, is selfish and industrious",
    ta: "தந்தை வீட்டில் சில தடைகள்; வணிகத்தில் கவலை; வணிக முன்னேற்றத்துக்குக் கடுமையாக உழைப்பார்; அரசில் சில குழப்பம்; சுயநலமானவர், உழைப்பாளி.",
  },
  {
    house: 10, lagna: "Aquarius", planetSign: "Scorpio", planet: "Sun", page: 232,
    en: "Pursues the daily occupation with great influence and honour in the line of occupation, gets power through wife, gets influential wife and sexual pleasures, gets honour in government, is a good manager, has some deficiency in the house of mother",
    ta: "தொழில் வீட்டில் பெரும் செல்வாக்கும் மரியாதையும்; மனைவி மூலம் ஆற்றல்; செல்வாக்கான மனைவி, பாலியல் இன்பம்; அரசில் மரியாதை; நல்ல நிர்வாகி; தாய் வீட்டில் சில குறை.",
  },
  {
    house: 10, lagna: "Aquarius", planetSign: "Scorpio", planet: "Moon", page: 235,
    en: "Experiences restlessness in the house of father, faces some hardships, bears loss in the way of progress, feces some blows and shocks in the house of honour and respect from government, is somewhat restless in the house of enemy and repents over the already accumulated sins",
    ta: "தந்தை வீட்டில் அமைதியின்மை; சில கஷ்டங்கள்; முன்னேற்றத்தில் இழப்பு; அரசு வீட்டிலிருந்து மரியாதையிலும் அதிர்ச்சியிலும் சில அடி; எதிரி வீட்டில் சிறு அமைதியின்மை; சேர்த்த பாவங்களுக்காக வருந்துவார்.",
  },
  {
    house: 10, lagna: "Aquarius", planetSign: "Scorpio", planet: "Mars", page: 237,
    en: "Is very powerful and pursues independent occupation, gets great respect in government and society, gets land and buildings, does not care for brothers and sisters, wears rich dresses, acquires administrative education, and is a legal expert",
    ta: "மிக வலிமையானவர்; தனியாகத் தொழில் நடத்துவார்; அரசு, சமூகத்தில் பெரும் மரியாதை; நிலமும் கட்டிடங்களும்; சகோதர சகோதரிகளைப் பொருட்படுத்தார்; விலையுயர்ந்த ஆடை அணிவார்; நிர்வாகக் கல்வி பெறுவார்; சட்ட நிபுணர்.",
  },
  {
    house: 10, lagna: "Aquarius", planetSign: "Scorpio", planet: "Mercury", page: 239,
    en: "Gets worldly knowledge, gets children, gets good age, spends the daily routine or life with great influence, feces loss in father's house, bears some trouble in business and occupation, feces some worry in the house of government, has little perplexity in mother's house",
    ta: "உலக அறிவு; பிள்ளைகள்; நல்ல வயது; பெரும் செல்வாக்குடன் நாள் வாழ்க்கை; தந்தை வீட்டில் இழப்பு; தொழிலிலும் வேலையிலும் சில துன்பம்; அரசு வீட்டில் சில கவலை; தாய் வீட்டில் சிறு குழப்பம்.",
  },
  {
    house: 10, lagna: "Aquarius", planetSign: "Scorpio", planet: "Jupiter", page: 241,
    en: "Pursues a big business or occupation, earns wealth, gets much respect and honour from government and society, gets power from father and support from mother, has great influence in the house of enemy",
    ta: "பெரிய வணிகம் அல்லது தொழில் நடத்துவார்; செல்வம் ஈட்டுவார்; அரசு, சமூகத்தில் மிகுந்த மரியாதையும் கௌரவமும்; தந்தையிடமிருந்து ஆற்றல், தாயிடமிருந்து ஆதரவு; எதிரி வீட்டில் பெரும் செல்வாக்கு.",
  },
  {
    house: 10, lagna: "Aquarius", planetSign: "Scorpio", planet: "Venus", page: 243,
    en: "Gets very high position on account of destiny, gets the authority and advantage from government and society, gets help from parents, gets the strength of land and property, enjoys royal pleasures, works with ability in his business affairs, wants peace and justice",
    ta: "விதியின் வலிமையால் மிக உயர்ந்த பதவி; அரசு, சமூகத்தில் அதிகாரமும் ஆதாயமும்; பெற்றோரின் உதவி; நிலமும் சொத்தின் வலிமையும்; அரச இன்பங்கள்; தன் வணிக விவகாரங்களை திறமையுடன் நடத்துவார்; அமைதியையும் நீதியையும் விரும்புவார்.",
  },
  {
    house: 10, lagna: "Aquarius", planetSign: "Scorpio", planet: "Saturn", page: 245,
    en: "Does influential deeds, gets respect after many difficulties, spends much, loss in the house of father, some enmity in the house of wife some weakness in mother's house, and is very industrious",
    ta: "செல்வாக்கான செயல்கள்; பல கஷ்டங்களுக்குப் பின் மரியாதை; அதிகம் செலவழிப்பார்; தந்தை வீட்டில் இழப்பு; மனைவி வீட்டில் சில பகை; தாய் வீட்டில் சில பலவீனம்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 10, lagna: "Aquarius", planetSign: "Scorpio", planet: "Rahu", page: 247,
    en: "Bears affliction in father's house, bears many worries in business and occupation, faces many obstacles in the deeds connected with government and society, faces problems in rise of position, uses secret devices for acquiring all-round progress",
    ta: "தந்தை வீட்டில் துன்பம்; தொழிலிலும் வேலையிலும் பல கவலைகள்; அரசு, சமூக வேலைகளில் பல தடைகள்; பதவி உயர்வில் சிக்கல்; முழுமையான முன்னேற்றத்துக்கு ரகசிய உபாயங்கள்.",
  },
  {
    house: 10, lagna: "Aquarius", planetSign: "Scorpio", planet: "Ketu", page: 249,
    en: "Faces some calamities in father's house, bears troubles and distress in business, feels worried in government and society, works very patiently through the support of some secret power, is of hidden courage and is industrious",
    ta: "தந்தை வீட்டில் சில ஆபத்துகள்; வணிகத்தில் சிரமமும் வேதனையும்; அரசு, சமூகத்தில் கவலை; சில மறைந்த சக்தியின் ஆதரவுடன் பொறுமையாக வேலை செய்வார்; மறைந்த தைரியம்; உழைப்பாளி.",
  },
  {
    house: 10, lagna: "Pisces", planetSign: "Sagittarius", planet: "Sun", page: 254,
    en: "Gets the advantage from the government and the society through influence and diligence, does grand deeds in government and society, faces opposition in father's house, faces some distress from mother's side also, finds some obstacles in peace and happiness, finds some hindrances in connection with lands and buildings, wants sovereignty, and is diligent",
    ta: "அரசு, சமூகத்திலிருந்து செல்வாக்கு, உழைப்பால் ஆதாயம்; அரசு, சமூகத்தில் பெரும் செயல்கள்; தந்தை வீட்டில் எதிர்ப்பு; தாய் வழியில் சில சிரமமும்; அமைதியிலும் மகிழ்ச்சியிலும் சில தடைகள்; நிலம், கட்டிடங்களில் சில தடைகள்; அதிகாரத்தை விரும்புவார்; உழைப்பாளி.",
  },
  {
    house: 10, lagna: "Pisces", planetSign: "Sagittarius", planet: "Moon", page: 256,
    en: "Has a great ability in education, acquires progress from father's house, has great respect and honour in the deeds of government and society, gets the happiness from mother, gains some strength of lands and buildings, talks like an officer",
    ta: "கல்வியில் மிகுந்த ஆற்றல்; தந்தை வீட்டிலிருந்து முன்னேற்றம்; அரசு, சமூக வேலைகளில் பெரும் மரியாதையும் கௌரவமும்; தாயால் மகிழ்ச்சி; நிலம், கட்டிடங்களின் சிறு வலிமை; அதிகாரி போலப் பேசுவார்.",
  },
  {
    house: 10, lagna: "Pisces", planetSign: "Sagittarius", planet: "Mars", page: 258,
    en: "Is very influential, gets great honour and respect, enjoys the advantage from the government and society, pursues the occupation on a large scale, speaks somewhat bitterly, feces some deficiency in children's side, has some weakness in education, gets land and buildings, observes religious formalities",
    ta: "மிகுந்த செல்வாக்குள்ளவர்; பெரும் மரியாதையும் கௌரவமும்; அரசு, சமூகத்தில் ஆதாயம்; பெரிய அளவில் தொழில்; சற்று கடுமையாகப் பேசுவார்; பிள்ளைகள் வகையில் சில குறை; கல்வியில் சில பலவீனம்; நிலமும் கட்டிடங்களும்; மதச் சடங்குகளைக் கடைப்பிடிப்பார்.",
  },
  {
    house: 10, lagna: "Pisces", planetSign: "Sagittarius", planet: "Mercury", page: 260,
    en: "Gets royal pleasures and happiness, gets the grandeur of wife, gets domestic happiness, gets the power of buildings and property, pursues a big occupation, enjoys advantages from government and society, lives in a decorated house, and does gentle deeds",
    ta: "அரசவாழ்வும் மகிழ்ச்சியும்; மனைவியின் பெருமை; குடும்ப மகிழ்ச்சி; வீடும் சொத்தும் பெறுவார்; பெரிய தொழில்; அரசு, சமூகத்தில் ஆதாயம்; அலங்கரிக்கப்பட்ட வீட்டில் வாழ்வார்; மென்மையான செயல்கள்.",
  },
  {
    house: 10, lagna: "Pisces", planetSign: "Sagittarius", planet: "Jupiter", page: 262,
    en: "Pursues a big business, maintains the business equally with father, gets great honour and respect from government and society, gets increased wealth, gains happiness from mother and land, possesses influence in the house of enemies",
    ta: "பெரிய வணிகம் நடத்துவார்; தந்தையுடன் சமமாக வணிகத்தை நடத்துவார்; அரசு, சமூகத்தில் பெரும் மரியாதையும் கௌரவமும்; செல்வம் அதிகரிக்கும்; தாய், நிலத்தால் மகிழ்ச்சி; எதிரி வீட்டில் செல்வாக்கு.",
  },
  {
    house: 10, lagna: "Pisces", planetSign: "Sagittarius", planet: "Venus", page: 265,
    en: "Bears loss in the house of father, gets some strength of brother, gets elegance in age, spends daily routine of life influentially, tries hard for acquiring the progress of happiness and land, gets honour in government and society by doing very difficult tasks cleverly, is very courageous",
    ta: "தந்தை வீட்டில் இழப்பு; சகோதரரின் வலிமை சிறிது; வயதில் அழகு; தினசரி வாழ்வைச் செல்வாக்குடன் நடத்துவார்; மகிழ்ச்சியும் நிலமும் பெற கடுமையாக முயல்வார்; மிகக் கடின செயல்களைச் சாமர்த்தியமாகச் செய்து அரசு, சமூகத்தில் மரியாதை; மிகுந்த தைரியம்.",
  },
  {
    house: 10, lagna: "Pisces", planetSign: "Sagittarius", planet: "Saturn", page: 267,
    en: "Gets losses in the house of father, spends much, has to deal with excessive expenditure, gets weakness in connection with government and society, bears loss in business occupation, gets some losses and gains in the house of happiness, mother and wife, gets ordinary success in diurnal occupation",
    ta: "தந்தை வீட்டில் இழப்பு; அதிகம் செலவழிப்பார்; அதிகப்படியான செலவைச் சமாளிக்க வேண்டும்; அரசு, சமூக வகையில் பலவீனம்; தொழில் துறையில் இழப்பு; மகிழ்ச்சி, தாய், மனைவி வீடுகளில் சில இழப்பும் ஆதாயமும்; தினசரி தொழிலில் சாதாரண வெற்றி.",
  },
  {
    house: 10, lagna: "Pisces", planetSign: "Sagittarius", planet: "Rahu", page: 269,
    en: "Bears loss in the house of father, bears loss and restlessness in the affairs of society and government, follows the path of deterioration, faces blows in the house of honour and prestige",
    ta: "தந்தை வீட்டில் இழப்பு; சமூக, அரசு விவகாரங்களில் இழப்பும் அமைதியின்மையும்; சீரழிவின் பாதையில் செல்வார்; மரியாதை, கௌரவ வீட்டில் அடிகள்.",
  },
  {
    house: 10, lagna: "Pisces", planetSign: "Sagittarius", planet: "Ketu", page: 271,
    en: "Gets the progress in the affairs of government and society after labouring very hard, is not good in the father's house, works fearlessly and without reserve, does grand deeds through secret powers, labours very hard to acquire the progress in honour, prestige and occupation, opposes the father",
    ta: "அரசு, சமூக விவகாரங்களில் பெரும் உழைப்புக்குப் பின் முன்னேற்றம்; தந்தை வீட்டில் நல்லதல்ல; அஞ்சாமல், தயக்கமின்றி வேலை செய்வார்; மறைந்த சக்திகளால் பெரும் செயல்கள்; மரியாதை, கௌரவம், தொழில் முன்னேற்றத்துக்குப் பெரும் உழைப்பு; தந்தையை எதிர்ப்பார்.",
  },
  {
    house: 11, lagna: "Aries", planetSign: "Aquarius", planet: "Sun", page: 22,
    en: "Feels indifference in acquiring education, dissatisfied with children, goes for intellectual pursuits, selfish, harsh speech, ambitious",
    ta: "கல்வியில் ஆர்வமின்மை; பிள்ளைகளில் அதிருப்தி; அறிவுசார் நாட்டம்; சுயநலம்; கடுமையான பேச்சு; லட்சியமானவர்.",
  },
  {
    house: 11, lagna: "Aries", planetSign: "Aquarius", planet: "Moon", page: 24,
    en: "Gets good income, gains happiness with some difficulties, gains from lands and houses, gets good education, happiness through children, speaks sweetly, gets pleasures",
    ta: "நல்ல வருமானம்; சில கஷ்டங்களுடன் மகிழ்ச்சி; நிலம், வீடுகளால் ஆதாயம்; நல்ல கல்வி; பிள்ளைகளால் மகிழ்ச்சி; இனிமையாகப் பேசுவார்; இன்பங்களை அனுபவிப்பார்.",
  },
  {
    house: 11, lagna: "Aries", planetSign: "Aquarius", planet: "Mars", page: 26,
    en: "Hard-working and gains by hard work, bitter policies related to gains, loses wealth, worried over loss with regard to family, overcomes enemies, a bit careless, uses mysterious powers in knowledge and intelligence",
    ta: "கடின உழைப்பாளி, உழைப்பால் ஆதாயம்; ஆதாயம் தொடர்பான கடுமையான கொள்கைகள்; செல்வ இழப்பு; குடும்ப இழப்பு பற்றிக் கவலை; எதிரிகளை வெல்வார்; சற்று அசட்டை; அறிவிலும் ஞானத்திலும் மறைந்த சக்திகளைப் பயன்படுத்துவார்.",
  },
  {
    house: 11, lagna: "Aries", planetSign: "Aquarius", planet: "Mercury", page: 28,
    en: "Gains from brothers and sisters, earns wealth, works hard for more income, gains in education, good speaker and clever",
    ta: "உடன்பிறப்புகளால் ஆதாயம்; செல்வம் ஈட்டுவார்; மேலும் வருமானத்துக்காக கடினமாக உழைப்பார்; கல்வியில் ஆதாயம்; நல்ல பேச்சாளர், சாமர்த்தியமானவர்.",
  },
  {
    house: 11, lagna: "Aries", planetSign: "Aquarius", planet: "Jupiter", page: 30,
    en: "Gets gains with the help of destiny, gets help in his activities, cooperation from brothers and sisters, successful in occupation, enjoys sexual pleasures, success in education and speeches",
    ta: "விதியின் உதவியால் ஆதாயம்; தன் செயல்களில் உதவி; உடன்பிறப்புகளின் ஒத்துழைப்பு; தொழிலில் வெற்றி; பாலியல் இன்பம்; கல்வியிலும் பேச்சிலும் வெற்றி.",
  },
  {
    house: 11, lagna: "Aries", planetSign: "Aquarius", planet: "Venus", page: 32,
    en: "Earns much wealth and occupies a good position professionally, gains from wife, enjoys good sexual affairs, a little unhappy with regard to children and also in education",
    ta: "பெரும் செல்வம் ஈட்டுவார்; தொழிலில் நல்ல நிலை; மனைவியால் ஆதாயம்; நல்ல பாலியல் இன்பம்; பிள்ளைகள், கல்வி பற்றி சிறு அதிருப்தி.",
  },
  {
    house: 11, lagna: "Aries", planetSign: "Aquarius", planet: "Saturn", page: 34,
    en: "Gets firm income, does honourable deeds, gets help from government and society, works very hard even not caring for his comforts, intellectually worried in the daily routine of life",
    ta: "நிலையான வருமானம்; மரியாதைக்குரிய செயல்கள்; அரசு, சமூகத்தின் உதவி; தன் வசதிகளைப் பொருட்படுத்தாமல் கடுமையாக உழைப்பார்; தினசரி வாழ்வில் அறிவு ரீதியாகக் கவலை.",
  },
  {
    house: 11, lagna: "Aries", planetSign: "Aquarius", planet: "Rahu", page: 36,
    en: "Gains heavily, gets income and wealth, has secret (sometimes unauthorised) methods to achieve his ends",
    ta: "பெரும் ஆதாயம்; வருமானமும் செல்வமும்; தன் நோக்கங்களை அடைய ரகசியமான, சில நேரம் அனுமதியற்ற வழிகள்.",
  },
  {
    house: 11, lagna: "Aries", planetSign: "Aquarius", planet: "Ketu", page: 38,
    en: "Gains heavily and makes more efforts to gain more, always engaged in trying to get gains, a bit rash in earnings, selfish",
    ta: "பெரும் ஆதாயம்; அதிக ஆதாயம் பெற மேலும் முயற்சி; எப்போதும் ஆதாயம் பெறும் முயற்சியில்; வருமானத்தில் சற்று அவசரம்; சுயநலம்.",
  },
  {
    house: 11, lagna: "Taurus", planetSign: "Pisces", planet: "Sun", page: 43,
    en: "Gains from mother, gets lands and buildings, gets some income also, help from education and children, is very clever and has patience",
    ta: "தாயால் ஆதாயம்; நிலமும் வீடும்; சில வருமானம்; கல்வி, பிள்ளைகளால் உதவி; மிகவும் சாமர்த்தியமும் பொறுமையும்.",
  },
  {
    house: 11, lagna: "Taurus", planetSign: "Pisces", planet: "Moon", page: 45,
    en: "Gains wealth by his hard work, gains through brothers and sisters, progress in education and also happiness through children, is clever and intelligent",
    ta: "கடின உழைப்பால் செல்வம்; உடன்பிறப்புகளால் ஆதாயம்; கல்வியில் முன்னேற்றம்; பிள்ளைகளால் மகிழ்ச்சி; சாமர்த்தியமும் அறிவும்.",
  },
  {
    house: 11, lagna: "Taurus", planetSign: "Pisces", planet: "Mars", page: 47,
    en: "Earns wealth through profession, some loss in children side and also in education, keeps enemies under control, unhappy with wife and deficiency in sexual pleasures, controls the expenditure but still spends",
    ta: "தொழிலால் செல்வம்; பிள்ளைகள், கல்வி வகையில் சில இழப்பு; எதிரிகளைக் கட்டுப்படுத்துவார்; மனைவியுடன் அதிருப்தி; பாலியல் இன்பத்தில் குறை; செலவைக் கட்டுப்படுத்தினாலும் செலவழிப்பார்.",
  },
  {
    house: 11, lagna: "Taurus", planetSign: "Pisces", planet: "Mercury", page: 49,
    en: "Problems in getting wealth, some problems in education unhappy with children, discrimination in the house of income and is clever",
    ta: "வருமானம் பெறுவதில் சிக்கல்; கல்வியில் சில பிரச்சினை; பிள்ளைகளுடன் அதிருப்தி; வருமான வீட்டில் பாகுபாடு; சாமர்த்தியமானவர்.",
  },
  {
    house: 11, lagna: "Taurus", planetSign: "Pisces", planet: "Jupiter", page: 51,
    en: "Lives long, gets wealth by successful methods, some bitterness with brothers and sisters, tries to get some unauthorised gains in the house of wife and sexual pleasures, has occult strength",
    ta: "நீண்ட ஆயுள்; வெற்றிகரமான வழிகளால் செல்வம்; உடன்பிறப்புகளுடன் சில கசப்பு; மனைவி வீட்டிலும் பாலியல் இன்பத்திலும் அங்கீகரிக்கப்படாத ஆதாயம் தேடுவார்; மறைந்த ஆற்றல்.",
  },
  {
    house: 11, lagna: "Taurus", planetSign: "Pisces", planet: "Venus", page: 53,
    en: "Gets huge gains, somewhat weak in education, unhappy with children, looks handsome, works hard to increase wealth and is very clever",
    ta: "பெரும் ஆதாயம்; கல்வியில் சற்று பலவீனம்; பிள்ளைகளால் அதிருப்தி; அழகானவர்; செல்வம் பெருக்க கடினமாக உழைப்பார்; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 11, lagna: "Taurus", planetSign: "Pisces", planet: "Saturn", page: 55,
    en: "Gets huge income and gains, does religious duties, works very hard, some success in the house of children",
    ta: "பெரும் வருமானமும் ஆதாயமும்; மதக் கடமைகளைச் செய்வார்; மிகக் கடினமாக உழைப்பார்; பிள்ளைகள் வீட்டில் சில வெற்றி.",
  },
  {
    house: 11, lagna: "Taurus", planetSign: "Pisces", planet: "Rahu", page: 57,
    en: "Success in getting gains, makes more efforts to get gains more than required, selfish",
    ta: "ஆதாயம் பெறுவதில் வெற்றி; தேவைக்கு மேல் ஆதாயம் தேட அதிக முயற்சி; சுயநலம்.",
  },
  {
    house: 11, lagna: "Taurus", planetSign: "Pisces", planet: "Ketu", page: 59,
    en: "Earns huge wealth, works hard for the progress of getting wealth, follows unauthorised methods, some loss in the gains",
    ta: "பெரும் செல்வம் ஈட்டுவார்; செல்வம் சேர்க்க கடினமாக உழைப்பார்; அங்கீகரிக்கப்படாத வழிகளைப் பின்பற்றுவார்; ஆதாயத்தில் சில இழப்பு.",
  },
  {
    house: 11, lagna: "Gemini", planetSign: "Aries", planet: "Sun", page: 63,
    en: "Huge gains from brothers and sisters, some weakness in the house of education, some deficiency in the side of children, uses some improper and bitter words, is very careless and overjoyed",
    ta: "உடன்பிறப்புகளிடமிருந்து பெரும் ஆதாயம்; கல்வி வீட்டில் சில பலவீனம்; பிள்ளைகள் வகையில் சில குறை; முறையற்ற, கசப்பான வார்த்தைகள்; மிகவும் அசட்டையும் மகிழ்ச்சியும்.",
  },
  {
    house: 11, lagna: "Gemini", planetSign: "Aries", planet: "Moon", page: 65,
    en: "Earns huge wealth, progress regarding education, family gains and gains through children, gets happy progress",
    ta: "பெரும் செல்வம்; கல்வியில் முன்னேற்றம்; குடும்ப ஆதாயமும் பிள்ளைகள் வழியில் ஆதாயமும்; மகிழ்ச்சியான முன்னேற்றம்.",
  },
  {
    house: 11, lagna: "Gemini", planetSign: "Aries", planet: "Mars", page: 67,
    en: "Gets huge gains and income, gains from maternal grandfather's side, also get heavy gains and strength of influence from the house of enemy, gains through industry, weakness in the accumulated house of wealth, gets gains with great influence and authority, some worry in the side of children",
    ta: "பெரும் ஆதாயமும் வருமானமும்; தாய் வழி தாத்தாவிடமிருந்து ஆதாயம்; எதிரி வீட்டிலிருந்தும் பெரும் ஆதாயமும் செல்வாக்கும்; தொழில் முயற்சியால் ஆதாயம்; சேர்த்த செல்வத்தில் பலவீனம்; பெரும் செல்வாக்கும் அதிகாரமும் கொண்ட ஆதாயம்; பிள்ளைகள் பற்றி சில கவலை.",
  },
  {
    house: 11, lagna: "Gemini", planetSign: "Aries", planet: "Mercury", page: 69,
    en: "Gets huge gains by physical forces, gets much strength of happiness, gets many happy things, gets buildings and property, happiness from children, happiness in the house of education, is very clever",
    ta: "உடல் வலிமையால் பெரும் ஆதாயம்; மகிழ்ச்சியின் வலிமை; பல மகிழ்ச்சியான விஷயங்கள்; கட்டிடங்களும் சொத்தும்; பிள்ளைகளால் மகிழ்ச்சி; கல்வியில் மகிழ்ச்சி; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 11, lagna: "Gemini", planetSign: "Aries", planet: "Jupiter", page: 71,
    en: "Huge gains, dignity and healthy father, loss of wife, respect in the daily occupation, gains from father, gains in the government and society, help from brothers and sisters, very good means of sexual pleasures, ambitious, gets the happiness of wealth, children and education and is very clever",
    ta: "பெரும் ஆதாயம், கௌரவம், ஆரோக்கியமான தந்தை; மனைவியை இழக்கும் குறை; தினசரி தொழிலில் மரியாதை; தந்தையால் ஆதாயம்; அரசு, சமூகத்தில் ஆதாயம்; உடன்பிறப்புகளின் உதவி; பாலியல் இன்பத்துக்கான நல்ல வசதிகள்; லட்சியமானவர்; செல்வம், பிள்ளைகள், கல்வியின் மகிழ்ச்சி; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 11, lagna: "Gemini", planetSign: "Aries", planet: "Venus", page: 73,
    en: "Gains of acquiring much education, some deficiency in children, clever in acquiring gains, and intelligent",
    ta: "அதிகக் கல்வி பெறும் ஆதாயம்; பிள்ளைகள் வகையில் சில குறை; ஆதாயம் ஈட்டுவதில் சாமர்த்தியம்; அறிவாளி.",
  },
  {
    house: 11, lagna: "Gemini", planetSign: "Aries", planet: "Saturn", page: 75,
    en: "Some weakness in the house of income, gets some worry, special strength in the house of education and intellect, support from children, ambitious",
    ta: "வருமான வீட்டில் சில பலவீனம்; சில கவலைகள்; கல்வியிலும் அறிவிலும் சிறப்பு வலிமை; பிள்ளைகளின் ஆதரவு; லட்சியமானவர்.",
  },
  {
    house: 11, lagna: "Gemini", planetSign: "Aries", planet: "Rahu", page: 77,
    en: "Earns huge income and gets gains, selfishness in the house",
    ta: "பெரும் வருமானமும் ஆதாயமும்; வீட்டில் சுயநலம்.",
  },
  {
    house: 11, lagna: "Gemini", planetSign: "Aries", planet: "Ketu", page: 79,
    en: "Strength in the house of income, progress in the house of gains, gets some unauthorised gains, gets some success with some hidden strength",
    ta: "வருமான வீட்டில் வலிமை; ஆதாய வீட்டில் முன்னேற்றம்; அங்கீகரிக்கப்படாத சில ஆதாயம்; மறைந்த வலிமையால் சில வெற்றி.",
  },
  {
    house: 11, lagna: "Cancer", planetSign: "Taurus", planet: "Sun", page: 84,
    en: "Gets power of wealth and gains, makes money through money, gets jewels and ornaments, is very brilliant, gets advantages in the house of education and children, influential orator",
    ta: "செல்வத்தின் வலிமையும் ஆதாயமும்; பணத்தால் பணம் ஈட்டுவார்; நகைகளும் ஆபரணங்களும் பெறுவார்; மிகவும் பிரகாசமானவர்; கல்வி, பிள்ளைகள் வீட்டில் ஆதாயம்; செல்வாக்குள்ள சொற்பொழிவாளர்.",
  },
  {
    house: 11, lagna: "Cancer", planetSign: "Taurus", planet: "Moon", page: 86,
    en: "Has a fat physique, influential, earns wealth, gets huge gains, has sharp intelligence, lives with pomp and show, has children, deficiency in the house of education",
    ta: "கொழுத்த உடல்; செல்வாக்குள்ளவர்; செல்வம் ஈட்டுவார்; பெரும் ஆதாயம்; கூர்மையான அறிவு; ஆடம்பரமாக வாழ்வார்; பிள்ளைகள் உண்டு; கல்வி வீட்டில் சில குறை.",
  },
  {
    house: 11, lagna: "Cancer", planetSign: "Taurus", planet: "Mars", page: 88,
    en: "Gets huge gains due to wisdom and occupation, gets the advantage of son and father, great efforts to gain wealth through business, good education and good children, is very influential and selfish",
    ta: "அறிவாலும் தொழிலாலும் பெரும் ஆதாயம்; மகன், தந்தை வகையில் ஆதாயம்; வணிகத்தால் செல்வம் ஈட்ட பெரும் முயற்சி; நல்ல கல்வியும் நல்ல பிள்ளைகளும்; மிகவும் செல்வாக்குள்ளவர், சுயநலமானவர்.",
  },
  {
    house: 11, lagna: "Cancer", planetSign: "Taurus", planet: "Mercury", page: 90,
    en: "Gains much due to his physical strength, gets some advantage from the power of expenditure, feels some weakness in the house of gains, some loss and some gain in the side of children, has good discriminating powerful arguments, speaks majestically",
    ta: "உடல் வலிமையால் பெரும் ஆதாயம்; செலவை நிர்வகிக்கும் ஆற்றலால் சில ஆதாயம்; ஆதாய வீட்டில் சில பலவீனம்; பிள்ளைகள் வகையில் சில இழப்பும் ஆதாயமும்; நல்ல பகுத்தறிவும் வலிமையான வாதங்களும்; கம்பீரமாகப் பேசுவார்.",
  },
  {
    house: 11, lagna: "Cancer", planetSign: "Taurus", planet: "Jupiter", page: 92,
    en: "Is very energetic, somewhat careless, deficiency in the side of wife and sexual pleasures, gets education and children, help from brothers and sisters, some humiliation and obstacles in the daily occupation, is very clever and intelligent",
    ta: "மிகுந்த சுறுசுறுப்பு, சற்று அசட்டை; மனைவி, பாலியல் இன்பத்தில் குறை; கல்வியும் பிள்ளைகளும் பெறுவார்; உடன்பிறப்புகளின் உதவி; தினசரி தொழிலில் சில அவமானமும் தடைகளும்; மிகவும் சாமர்த்தியமும் அறிவும்.",
  },
  {
    house: 11, lagna: "Cancer", planetSign: "Taurus", planet: "Venus", page: 94,
    en: "Gets the income happily without anxiety, gets land and property, acquires education, enjoys the pleasure of children, gives the importance to fixed income",
    ta: "கவலையின்றி எளிதாக வருமானம்; நிலமும் சொத்தும்; கல்வி பெறுவார்; பிள்ளைகளின் இன்பம் அனுபவிப்பார்; நிலையான வருமானத்துக்கு முக்கியத்துவம் கொடுப்பார்.",
  },
  {
    house: 11, lagna: "Cancer", planetSign: "Taurus", planet: "Saturn", page: 96,
    en: "Great rise in the house of longevity, gets heavy gains in daily occupation, earns much wealth, some deficiency in some part of his body, gets sexual pleasures, takes undue profits, some bitterness in speech and children, gains from foreign countries",
    ta: "ஆயுளில் பெரும் உயர்வு; தினசரி தொழிலில் பெரும் ஆதாயம்; மிகுந்த செல்வம்; உடலின் ஒரு பகுதியில் சில குறை; பாலியல் இன்பம்; நியாயமற்ற லாபம்; பேச்சிலும் பிள்ளைகள் வகையிலும் சில கசப்பு; வெளிநாட்டிலிருந்து ஆதாயம்.",
  },
  {
    house: 11, lagna: "Cancer", planetSign: "Taurus", planet: "Rahu", page: 98,
    en: "Gains much money in the house of occupation, intelligent and cautious, takes more than authorised profits, is highly dignified",
    ta: "தொழில் வீட்டில் பெரும் பணம்; அறிவாளியும் எச்சரிக்கையும்; அனுமதிக்கப்பட்டதைவிட அதிக ஆதாயம் எடுப்பார்; மிகுந்த கௌரவம்.",
  },
  {
    house: 11, lagna: "Cancer", planetSign: "Taurus", planet: "Ketu", page: 100,
    en: "Acquires heavy income with profits, selfish, is very enterprising and energetic",
    ta: "லாபத்துடன் பெரும் வருமானம்; சுயநலம்; மிகுந்த முயற்சியும் சுறுசுறுப்பும்.",
  },
  {
    house: 11, lagna: "Leo", planetSign: "Gemini", planet: "Sun", page: 105,
    en: "Gets heavy gains and earns much, has a good body, rears the maximum profit, gets children and power, gets education, is very satisfied and is farsighted",
    ta: "பெரும் ஆதாயமும் அதிகச் சம்பாத்தியமும்; நல்ல உடல்; அதிகபட்ச லாபத்தை அடைவார்; பிள்ளைகளும் அதிகாரமும்; கல்வி; மிகுந்த திருப்தி, தொலைநோக்கு.",
  },
  {
    house: 11, lagna: "Leo", planetSign: "Gemini", planet: "Moon", page: 107,
    en: "Gains success through the concentration of mind, earns by the power of expenditure also, gets the strength of heavy expenditure, some weakness in the side of children, some weakness in acquiring education",
    ta: "மனத்தின் ஒருமுகப்பாட்டால் வெற்றி; செலவின் ஆற்றலாலும் சம்பாதிப்பார்; பெரும் செலவின் வலிமை; பிள்ளைகள் வகையில் சில பலவீனம்; கல்வி பெறுவதில் சில பலவீனம்.",
  },
  {
    house: 11, lagna: "Leo", planetSign: "Gemini", planet: "Mars", page: 109,
    en: "Accumulates wealth, advantage of mother, gets the gains of buildings and land, great influence in the house of enemy, can see the happiness of family, works very intelligently in the house of education, some adventures of children, is pious and selfish",
    ta: "செல்வம் சேர்ப்பார்; தாயின் உதவி; நிலமும் கட்டிடங்களும் ஆதாயம்; எதிரி வீட்டில் பெரும் செல்வாக்கு; குடும்ப மகிழ்ச்சியைக் காண்பார்; கல்வி வீட்டில் மிக சாமர்த்தியமாக வேலை செய்வார்; பிள்ளைகளின் சில சாகசங்கள்; தர்மமுள்ளவர், சுயநலமானவர்.",
  },
  {
    house: 11, lagna: "Leo", planetSign: "Gemini", planet: "Mercury", page: 111,
    en: "Gets huge gains aid earns much money, confined dignity in the house of income, advantage from the side of children, art and earns wealth in the house of education, gets the opportunity and appreciation of his cleverness",
    ta: "பெரும் ஆதாயமும் மிகுந்த செல்வமும்; வருமான வீட்டில் வரையறுக்கப்பட்ட கம்பீரம்; பிள்ளைகளால் ஆதாயம்; கல்வி வீட்டில் கலையும் செல்வமும்; தன் சாமர்த்தியத்துக்கு வாய்ப்பும் பாராட்டும்.",
  },
  {
    house: 11, lagna: "Leo", planetSign: "Gemini", planet: "Jupiter", page: 113,
    en: "Gets good longevity, acquires education, gets the strength of children, spends life in cheerful disposition, great inconvenience in the daily life, wife and family, some deficiency in the house of vigour and brothers and sisters also",
    ta: "நல்ல நீண்ட ஆயுள்; கல்வி; பிள்ளைகளின் வலிமை; மகிழ்ச்சியான மனப்பான்மையில் வாழ்வார்; தினசரி வாழ்விலும் மனைவி, குடும்பத்திலும் பெரும் சிரமம்; வலிமை வீட்டிலும் உடன்பிறப்புகள் வீட்டிலும் சில குறை.",
  },
  {
    house: 11, lagna: "Leo", planetSign: "Gemini", planet: "Venus", page: 115,
    en: "Earns much wealth, enjoys the advantage from government and society, success in the house of education, gets power from father and in the house of children, is a very zealous worker",
    ta: "பெரும் செல்வம் ஈட்டுவார்; அரசு, சமூகத்தின் ஆதாயம்; கல்வி வீட்டில் வெற்றி; தந்தை வழியிலும் பிள்ளைகள் வழியிலும் ஆற்றல்; மிகுந்த ஆர்வமுள்ள உழைப்பாளி.",
  },
  {
    house: 11, lagna: "Leo", planetSign: "Gemini", planet: "Saturn", page: 117,
    en: "Earns great wealth in daily affairs and in the house of occupation, catches some diseases, enjoys many advantages through hard labour, enjoys the great advantage of wife and sexual enjoyment, has great influence in the house of enemy",
    ta: "தினசரி வேலையிலும் தொழில் வீட்டிலும் பெரும் செல்வம்; சில நோய்கள்; கடின உழைப்பால் பல ஆதாயங்கள்; மனைவியின் பெரும் ஆதாயமும் பாலியல் இன்பமும்; எதிரி வீட்டில் பெரும் செல்வாக்கு.",
  },
  {
    house: 11, lagna: "Leo", planetSign: "Gemini", planet: "Rahu", page: 119,
    en: "Acquires large income, great courage, finds way to enjoy the maximum profits, is greedy, and is never satisfied in the house of acquiring wealth",
    ta: "பெரும் வருமானம்; பெரும் தைரியம்; அதிகபட்ச லாபத்தைப் பெற வழி காண்பார்; பேராசையுள்ளவர்; செல்வம் சேர்க்கும் வீட்டில் ஒருபோதும் திருப்தியடையார்.",
  },
  {
    house: 11, lagna: "Leo", planetSign: "Gemini", planet: "Ketu", page: 121,
    en: "Great strength of somewhat less labour in the house of income, some definite gains also, does not care about the profit or loss of others for raising the income of wealth, is secretly patient",
    ta: "வருமான வீட்டில் கடின உழைப்பின் சற்று குறைந்த வலிமை; சில நிச்சய ஆதாயங்களும்; செல்வத்தை உயர்த்த பிறரின் லாப நஷ்டம் பற்றிக் கவலைப்படார்; ரகசியமாகப் பொறுமையானவர்.",
  },
  {
    house: 11, lagna: "Virgo", planetSign: "Cancer", planet: "Sun", page: 126,
    en: "Spends due to his income, gets gains from the other houses, some losses on the side of children, some deficiency in education, some bitterness and roughness in speech",
    ta: "வருமானத்துக்கேற்ப செலவழிப்பார்; மற்ற வீடுகளிலிருந்து ஆதாயம்; பிள்ளைகள் வகையில் சில இழப்பு; கல்வியில் சில குறை; பேச்சில் சில கசப்பும் கடுமையும்.",
  },
  {
    house: 11, lagna: "Virgo", planetSign: "Cancer", planet: "Moon", page: 128,
    en: "Gets decent gains spontaneously and without making efforts, gets some happiness regarding children, gets the power of education and wisdom",
    ta: "நல்ல ஆதாயம் தன்னிச்சையாக, முயற்சி இல்லாமல் கிடைக்கும்; பிள்ளைகள் வகையில் சில மகிழ்ச்சி; கல்வி, அறிவின் வலிமை.",
  },
  {
    house: 11, lagna: "Virgo", planetSign: "Cancer", planet: "Mars", page: 130,
    en: "Some deficiency in the house of income and gains, feels some deficiency in the house of brother, progress in the side of education intelligence and children, some loss in the accumulation of wealth",
    ta: "வருமானம், ஆதாய வீட்டில் சில குறை; சகோதரர் வீட்டில் சில குறை; கல்வி, அறிவு, பிள்ளைகள் பக்கம் முன்னேற்றம்; செல்வம் சேர்ப்பதில் சில இழப்பு.",
  },
  {
    house: 11, lagna: "Virgo", planetSign: "Cancer", planet: "Mercury", page: 132,
    en: "Earns much wealth, gets huge gains from the house of father, gains much from business, gains connected with government, wears beautiful clothes and ornaments, does skilful deeds cleverly, acquires much education, gets the pleasures of children",
    ta: "பெரும் செல்வம் ஈட்டுவார்; தந்தை வீட்டிலிருந்து பெரும் ஆதாயம்; வணிகத்தில் பெரும் ஆதாயம்; அரசு தொடர்பான ஆதாயம்; அழகான உடைகளும் ஆபரணங்களும் அணிவார்; சாமர்த்தியமான செயல்களைச் செய்வார்; நிறைய கல்வி பெறுவார்; பிள்ளைகளின் இன்பங்கள்.",
  },
  {
    house: 11, lagna: "Virgo", planetSign: "Cancer", planet: "Jupiter", page: 135,
    en: "Gets heavy gains from daily occupation, gets the pleasure of having an extraordinarily beautiful wife, gets very decent sexual pleasure, gets heavy gains of mother, land and buildings, enjoys the happiness of brothers and sisters, feels some deficiency in the side of children, some weakness in the side of intellect and education",
    ta: "தினசரி தொழிலிலிருந்து பெரும் ஆதாயம்; மிக அழகான மனைவியின் மகிழ்ச்சி; மிக நல்ல பாலியல் இன்பம்; தாய், நிலம், கட்டிடங்களிலிருந்து பெரும் ஆதாயம்; உடன்பிறப்புகளின் மகிழ்ச்சி; பிள்ளைகள் வகையில் சில குறை; அறிவிலும் கல்வியிலும் சில பலவீனம்.",
  },
  {
    house: 11, lagna: "Virgo", planetSign: "Cancer", planet: "Venus", page: 137,
    en: "Earns huge wealth, is clever and intelligent, rears Dharma, enjoys the pleasure of children, gets the family gains, clothes, ornaments and other beautiful things, gets success from windfalls also",
    ta: "பெரும் செல்வம் ஈட்டுவார்; சாமர்த்தியமும் அறிவும்; தர்மத்தைக் காப்பார்; பிள்ளைகளின் இன்பம்; குடும்ப ஆதாயம், உடைகள், ஆபரணங்கள், மற்ற அழகான பொருட்கள்; திடீர் ஆதாயங்களாலும் வெற்றி.",
  },
  {
    house: 11, lagna: "Virgo", planetSign: "Cancer", planet: "Saturn", page: 139,
    en: "Gains much through intellectual tactics, always feels restless, intellectual and clever, knows the art of earning wealth, keeps influence on enemies",
    ta: "அறிவுசார் தந்திரங்களால் பெரும் ஆதாயம்; எப்போதும் அமைதியின்மை; அறிவாளியும் சாமர்த்தியமானவரும்; செல்வம் ஈட்டும் கலை அறிந்தவர்; எதிரிகள் மீது செல்வாக்கு.",
  },
  {
    house: 11, lagna: "Virgo", planetSign: "Cancer", planet: "Rahu", page: 141,
    en: "Gets gains, some worries in the house of gains, gets some deficiency of clothes and ornaments, feels some deficiency in his body",
    ta: "ஆதாயம்; ஆதாய வீட்டில் சில கவலைகள்; ஆடை, ஆபரணங்களில் சில குறை; உடலில் சில பலவீனம்.",
  },
  {
    house: 11, lagna: "Virgo", planetSign: "Cancer", planet: "Ketu", page: 143,
    en: "Makes heavy gains through some worries in the house of income, creates some firmness in the house of gains",
    ta: "வருமான வீட்டில் சில கவலைகளுடன் பெரும் ஆதாயம்; ஆதாய வீட்டில் சில உறுதி.",
  },
  {
    house: 11, lagna: "Libra", planetSign: "Leo", planet: "Sun", page: 147,
    en: "Gains much, gets the concrete income regularly, some deficiency in the house of children, gets education, acquires enmity, uses harshness and irritation in conversation",
    ta: "பெரும் ஆதாயம்; தொடர்ந்து உறுதியான வருமானம்; பிள்ளைகள் வீட்டில் சில குறை; கல்வி பெறுவார்; பகை உண்டாக்குவார்; பேச்சில் கடுமையும் எரிச்சலும்.",
  },
  {
    house: 11, lagna: "Libra", planetSign: "Leo", planet: "Moon", page: 149,
    en: "Gets very decent and influential gains, gains from father, has wisdom and education, pleasure of children, is a good worker, respect in government, conducts a big business, gains from society",
    ta: "மிகவும் கண்ணியமான, செல்வாக்குள்ள ஆதாயம்; தந்தையிடமிருந்து ஆதாயம்; அறிவும் கல்வியும்; பிள்ளைகளின் இன்பம்; நல்ல உழைப்பாளி; அரசில் மரியாதை; பெரிய தொழில் நடத்துவார்; சமூகத்திலிருந்து ஆதாயம்.",
  },
  {
    house: 11, lagna: "Libra", planetSign: "Leo", planet: "Mars", page: 151,
    en: "Gets very decent influential gains, gains from father, acquires wisdom and education, pleasure of children, is a good worker, respect in government, has a big business, gains from society, acquires heavy income due to occupation, gets the happiness of wife, is very courageous",
    ta: "கண்ணியமான செல்வாக்குள்ள ஆதாயம்; தந்தையிடமிருந்து ஆதாயம்; அறிவும் கல்வியும்; பிள்ளைகளின் இன்பம்; நல்ல உழைப்பாளி; அரசில் மரியாதை; பெரிய தொழில்; சமூகத்திலிருந்து ஆதாயம்; தொழிலால் பெரும் வருமானம்; மனைவியின் மகிழ்ச்சி; மிகுந்த தைரியம்.",
  },
  {
    house: 11, lagna: "Libra", planetSign: "Leo", planet: "Mercury", page: 153,
    en: "Gets heavy success through the power of destiny, increases the income by his wisdom, acquires education and wisdom, is very wise and farsighted, gets success with some weakness in the house of children, is fortunate and clever",
    ta: "விதியின் வலிமையால் பெரும் வெற்றி; தன் அறிவால் வருமானம் உயர்த்துவார்; கல்வியும் ஞானமும் பெறுவார்; மிகுந்த அறிவாளியும் தொலைநோக்குள்ளவரும்; பிள்ளைகள் வீட்டில் சில குறையுடன் வெற்றி; அதிர்ஷ்டசாலியும் சாமர்த்தியமானவரும்.",
  },
  {
    house: 11, lagna: "Libra", planetSign: "Leo", planet: "Jupiter", page: 155,
    en: "Is very energetic and earns large wealth, gets success in occupation, is a successful and industrious worker, is influential, gets the power of the brothers, enjoys the great power of the house of wife, deficiency in the side of children",
    ta: "மிகுந்த சுறுசுறுப்பு, பெரும் செல்வம் ஈட்டுவார்; தொழிலில் வெற்றி; வெற்றிகரமான, உழைப்பாளியான தொழிலாளி; செல்வாக்குள்ளவர்; சகோதரர்களின் வலிமை; மனைவி வீட்டில் பெரும் வலிமை; பிள்ளைகள் வகையில் குறை.",
  },
  {
    house: 11, lagna: "Libra", planetSign: "Leo", planet: "Venus", page: 157,
    en: "Gets many kinds of gains in his life, but feels some laziness in the house of personal gains, is very clever, gets children and good education",
    ta: "வாழ்நாளில் பல வகை ஆதாயங்கள்; தனது சொந்த ஆதாய வீட்டில் சில சோம்பல்; மிகவும் சாமர்த்தியமானவர்; பிள்ளைகளும் நல்ல கல்வியும் பெறுவார்.",
  },
  {
    house: 11, lagna: "Libra", planetSign: "Leo", planet: "Saturn", page: 159,
    en: "Gets heavy gains and happiness, some happiness from children, worried in the house of income",
    ta: "பெரும் ஆதாயமும் மகிழ்ச்சியும்; பிள்ளைகளால் சில மகிழ்ச்சி; வருமான வீட்டில் கவலை.",
  },
  {
    house: 11, lagna: "Libra", planetSign: "Leo", planet: "Rahu", page: 161,
    en: "Gains much, also some weakness in the gains",
    ta: "பெரும் ஆதாயம்; ஆனால் ஆதாயத்தில் சில பலவீனம்.",
  },
  {
    house: 11, lagna: "Libra", planetSign: "Leo", planet: "Ketu", page: 163,
    en: "Tries for the great strength of his income, gets huge gains, some hindrance in the house of income",
    ta: "வருமானத்தின் பெரும் வலிமைக்கு முயல்வார்; பெரும் ஆதாயம்; வருமான வீட்டில் சில தடை.",
  },
  {
    house: 11, lagna: "Scorpio", planetSign: "Virgo", planet: "Sun", page: 169,
    en: "Gets heavy gains, earns much wealth from business, gains from the house of father, gets decency in education, gets grandeur of children, can talk well in connection with politics, does good deeds and gets gains by working swiftly",
    ta: "வணிகத்தால் பெரும் ஆதாயம்; தந்தை வீட்டிலிருந்து ஆதாயம்; கல்வியில் ஒழுங்கு; பிள்ளைகளின் பெருமை; அரசியல் பற்றி நன்கு பேசுவார்; நல்ல செயல்களைச் செய்வார்; விரைவாக வேலை செய்து ஆதாயம் பெறுவார்.",
  },
  {
    house: 11, lagna: "Scorpio", planetSign: "Virgo", planet: "Moon", page: 171,
    en: "Gets splendid gains due to the power of destiny, gets carefulness from the side of income, uses the house of education properly, gets the happiness of children, is very fortunate and kind",
    ta: "விதியின் வலிமையால் அற்புதமான ஆதாயம்; வருமான வீட்டில் கவனம்; கல்வி வீட்டை சரியாகப் பயன்படுத்துவார்; பிள்ளைகளின் மகிழ்ச்சி; மிக அதிர்ஷ்டசாலியும் கருணையுள்ளவரும்.",
  },
  {
    house: 11, lagna: "Scorpio", planetSign: "Virgo", planet: "Mars", page: 173,
    en: "Acquires a heavy income through physical labour and is influential, undertakes very decent deeds, some trouble in the house of children, victors over enemies, gets some weakness in body, is furious and cautious",
    ta: "உடல் உழைப்பால் பெரும் வருமானம்; செல்வாக்குள்ளவர்; மிக ஒழுக்கமான செயல்களைச் செய்வார்; பிள்ளைகள் வீட்டில் சில தொல்லை; எதிரிகளை வெல்வார்; உடலில் சில பலவீனம்; கோபமும் எச்சரிக்கையும்.",
  },
  {
    house: 11, lagna: "Scorpio", planetSign: "Virgo", planet: "Mercury", page: 175,
    en: "Has a long life, gets some weakness in intellect and in education, some distress in the side of children, weakness while speaking, rude conversation",
    ta: "நீண்ட ஆயுள்; அறிவிலும் கல்வியிலும் சில பலவீனம்; பிள்ளைகள் வகையில் சில துன்பம்; பேசுவதில் பலவீனம்; கடுமையான பேச்சு.",
  },
  {
    house: 11, lagna: "Scorpio", planetSign: "Virgo", planet: "Jupiter", page: 177,
    en: "Earns wealth through wisdom and education, gets the happiness of children, weakness in the house of brother, gains much by pursuing the occupation with some uneasiness, possesses the influence of sex and wife, gets domestic gains, is wealthy and respectable",
    ta: "அறிவாலும் கல்வியாலும் செல்வம் ஈட்டுவார்; பிள்ளைகளின் மகிழ்ச்சி; சகோதரர் வீட்டில் பலவீனம்; சில கவலையுடன் தொழிலில் ஈடுபட்டு பெரும் ஆதாயம்; மனைவி வழி செல்வாக்கும் பாலியல் வலிமையும்; வீட்டு ஆதாயம்; செல்வந்தரும் மரியாதைக்குரியவரும்.",
  },
  {
    house: 11, lagna: "Scorpio", planetSign: "Virgo", planet: "Venus", page: 179,
    en: "Weak occupation, bears much weakness in income, weak advantage of wife and family, some deficiency in the sexual pleasures, some advantage in the house of expenditure, gets children",
    ta: "பலவீனமான தொழில்; வருமானத்தில் மிகுந்த பலவீனம்; மனைவி, குடும்பம் வகையில் சிறு ஆதாயம்; பாலியல் இன்பத்தில் சில குறை; செலவு வீட்டில் சில ஆதாயம்; பிள்ளைகள் பெறுவார்.",
  },
  {
    house: 11, lagna: "Scorpio", planetSign: "Virgo", planet: "Saturn", page: 181,
    en: "Bears heavy income comfortably, gets the advantage of brothers and sisters, gets increased longevity, gets the advantage of land and buildings, tries hard for increased income and gets happiness",
    ta: "பெரும் வருமானத்தை வசதியாகப் பெறுவார்; சகோதர சகோதரிகளின் ஆதாயம்; ஆயுள் கூடும்; நில, கட்டிட ஆதாயம்; அதிக வருமானத்துக்கு கடுமையாக முயன்று மகிழ்ச்சி பெறுவார்.",
  },
  {
    house: 11, lagna: "Scorpio", planetSign: "Virgo", planet: "Rahu", page: 183,
    en: "Earns a lot of wealth and gets a heavy income, does not care for justice of truthfulness or falsehood in connection acquiring wealth and is very cautious",
    ta: "பெரும் செல்வம் ஈட்டுவார்; பெரும் வருமானம்; செல்வம் பெறுவதில் நீதி, உண்மை, பொய்யைப் பற்றிக் கவலைப்படார்; மிகவும் எச்சரிக்கையானவர்.",
  },
  {
    house: 11, lagna: "Scorpio", planetSign: "Virgo", planet: "Ketu", page: 185,
    en: "Gets a heavy income, pays attention to serve his selfishness not caring about good or bad, sometimes bears some blow on income, but always gets the advantage due to courage",
    ta: "பெரும் வருமானம்; தன் சுயநலத்தை நிறைவேற்ற நல்லது கெட்டது பற்றி கவலைப்படாமல் கவனம்; சில நேரம் வருமானத்தில் அடி; ஆனால் தைரியத்தால் எப்போதும் ஆதாயம்.",
  },
  {
    house: 11, lagna: "Sagittarius", planetSign: "Libra", planet: "Sun", page: 190,
    en: "Experiences some deficiency in the house of gains, gets weakness in rearing Dharma, gets the power of children, faces some bondage and perplexity regard income",
    ta: "ஆதாய வீட்டில் சில குறை; தர்மத்தைக் காப்பதில் பலவீனம்; பிள்ளைகளின் வலிமை; வருமானத்தில் சில கட்டுப்பாடும் குழப்பமும்.",
  },
  {
    house: 11, lagna: "Sagittarius", planetSign: "Libra", planet: "Moon", page: 192,
    en: "Has a long life, feces some hindrances in the house of income and gains some distress in children's side, obstacles in the house of education",
    ta: "நீண்ட ஆயுள்; வருமான, ஆதாய வீட்டில் சில தடைகள்; பிள்ளைகள் வகையில் சில துன்பம்; கல்வி வீட்டில் தடைகள்.",
  },
  {
    house: 11, lagna: "Sagittarius", planetSign: "Libra", planet: "Mars", page: 194,
    en: "Tries hard for the increase of wealth, has deficiency in education, and some deficiency in the house of children, injures the enemies",
    ta: "செல்வம் பெருக்க கடினமாக முயல்வார்; கல்வியில் குறை; பிள்ளைகள் வீட்டில் சில குறை; எதிரிகளைத் தாக்குவார்.",
  },
  {
    house: 11, lagna: "Sagittarius", planetSign: "Libra", planet: "Mercury", page: 196,
    en: "Gets heavy gains from business occupation, gets a beautiful wife, achieves high education, gets sexual pleasures very much, gains advantage from the government and society",
    ta: "வணிகத் தொழிலில் பெரும் ஆதாயம்; அழகான மனைவி; உயர் கல்வி; பாலியல் இன்பம் மிகுதி; அரசு, சமூகத்தில் ஆதாயம்.",
  },
  {
    house: 11, lagna: "Sagittarius", planetSign: "Libra", planet: "Jupiter", page: 198,
    en: "Gets happiness but gets some enmity in the house of brothers and sisters, gets command in education, gets the happiness of the children, happiness with wife, income from occupation",
    ta: "மகிழ்ச்சி; ஆனால் சகோதர சகோதரி வீட்டில் சில பகை; கல்வியில் ஆதிக்கம்; பிள்ளைகளின் மகிழ்ச்சி; மனைவியுடன் மகிழ்ச்சி; தொழிலிலிருந்து வருமானம்.",
  },
  {
    house: 11, lagna: "Sagittarius", planetSign: "Libra", planet: "Venus", page: 200,
    en: "Gets a very heavy income, gains in intellect and education through great tactics, some advantage in the children side, gets the advantage from the enemies also",
    ta: "மிகுந்த வருமானம்; ஆனால் அதில் சில அமைதியின்மை; மிகுந்த தந்திரத்தால் அறிவிலும் கல்வியிலும் வெற்றி; பிள்ளைகள் வகையில் சில ஆதாயம்; எதிரிகளிடமிருந்தும் ஆதாயம்.",
  },
  {
    house: 11, lagna: "Sagittarius", planetSign: "Libra", planet: "Saturn", page: 202,
    en: "Earns much, gets the power of wealth, advantage in the house of family, deficiency in handsomeness",
    ta: "மிகுந்த வருமானம்; செல்வ வலிமை; குடும்ப வீட்டில் ஆதாயம்; அழகில் குறை.",
  },
  {
    house: 11, lagna: "Sagittarius", planetSign: "Libra", planet: "Rahu", page: 204,
    en: "Gets numerous advantages, works with determination in connection with income, uses secret and intricate policies to get advantage, does not care for truth or falsehood",
    ta: "பல ஆதாயங்கள்; வருமானத்தில் உறுதியுடன் வேலை செய்வார்; ஆதாயம் பெற ரகசிய, சிக்கலான உபாயங்கள்; உண்மை, பொய் பற்றிக் கவலைப்படார்.",
  },
  {
    house: 11, lagna: "Sagittarius", planetSign: "Libra", planet: "Ketu", page: 206,
    en: "Gets heavy gains, works very obstinately to get money, tries for huge advantages",
    ta: "பெரும் ஆதாயம்; பணம் பெற மிகப் பிடிவாதமாக உழைப்பார்; பெரும் ஆதாயங்களுக்கு முயல்வார்.",
  },
  {
    house: 11, lagna: "Capricorn", planetSign: "Scorpio", planet: "Sun", page: 211,
    en: "Good longevity, spends daily routine with influence and advantage, bears loss and calamity in children's side, has some worry in the house of education, uses some secrecy and bitterness in conversation",
    ta: "நீண்ட ஆயுள்; செல்வாக்குடனும் ஆதாயத்துடனும் நாள் வாழ்க்கை; பிள்ளைகள் வகையில் இழப்பும் ஆபத்தும்; கல்வியில் சில கவலை; பேச்சில் ரகசியமும் கசப்பும்.",
  },
  {
    house: 11, lagna: "Capricorn", planetSign: "Scorpio", planet: "Moon", page: 213,
    en: "Mental restlessness from wife's house, experiences happiness in family, gets ordinary sexual pleasures, has deficiency in income, gets pungency in education and intellect, shows anger in conversation, is happy with the progress of occupation",
    ta: "மனைவி வீட்டில் மன அமைதியின்மை; குடும்ப மகிழ்ச்சி; சாதாரண பாலியல் இன்பம்; வருமானக் குறை; கல்வியிலும் அறிவிலும் கூர்மை; பேச்சில் கோபம்; தொழில் முன்னேற்றத்தில் மகிழ்ச்சி.",
  },
  {
    house: 11, lagna: "Capricorn", planetSign: "Scorpio", planet: "Mars", page: 215,
    en: "Gets the increased income, gets advantage from mother's house, gets enmity in family, gets some education, gets children, creates influence over enemies, gets victory over diseases and calamities",
    ta: "வருமானம் அதிகரிக்கும்; தாய் வீட்டில் ஆதாயம்; குடும்பத்தில் பகை; சில கல்வி; பிள்ளைகள் பெறுவார்; எதிரிகள் மீது செல்வாக்கு; நோய்களிலும் ஆபத்துகளிலும் வெற்றி.",
  },
  {
    house: 11, lagna: "Capricorn", planetSign: "Scorpio", planet: "Mercury", page: 217,
    en: "Gets good fortune on account of cleverness, does not face difficulties in the house of income, gets good education and intelligence, gains advantage from enemies' house, and is influential",
    ta: "சாமர்த்தியத்தால் அதிர்ஷ்டம்; வருமான வீட்டில் சிரமம் இல்லை; நல்ல கல்வியும் அறிவும்; எதிரி வீட்டில் ஆதாயம்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 11, lagna: "Capricorn", planetSign: "Scorpio", planet: "Jupiter", page: 219,
    en: "Gets numerous advantages, gets the advantage of the brothers and sisters with some deficiency, gets a beautiful wife, acquires progress in occupation",
    ta: "பல ஆதாயங்கள்; உடன்பிறப்புகளின் ஆதாயம், சில குறையுடன்; அழகான மனைவி; தொழிலில் முன்னேற்றம்.",
  },
  {
    house: 11, lagna: "Capricorn", planetSign: "Scorpio", planet: "Venus", page: 221,
    en: "Gets great advantages from business, gets advantage from father and son, conversation, government and society, gets the easy means of sexual pleasures and grandeur, is clever and industrious",
    ta: "தொழிலிலிருந்து பெரும் ஆதாயங்கள்; தந்தை, மகன் வகையில் ஆதாயம்; பேச்சு, அரசு, சமூக வீட்டில் ஆதாயம்; பாலியல் இன்பத்தின் எளிய வசதிகளும் பெருமையும்; சாமர்த்தியமானவர், சுறுசுறுப்பானவர்.",
  },
  {
    house: 11, lagna: "Capricorn", planetSign: "Scorpio", planet: "Saturn", page: 223,
    en: "Earns much wealth, gets fame, is always busy in increasing money, gets progress in education and wisdom, gets the power from children, puts forward weighty ideas",
    ta: "மிகுந்த செல்வம் ஈட்டுவார்; புகழ்; பணம் பெருக்குவதில் எப்போதும் ஈடுபட்டிருப்பார்; கல்வியிலும் அறிவிலும் முன்னேற்றம்; பிள்ளைகளின் வலிமை; வலிமையான கருத்துகளை முன்வைப்பார்.",
  },
  {
    house: 11, lagna: "Capricorn", planetSign: "Scorpio", planet: "Rahu", page: 225,
    en: "Gains very much, tries hard to get more and more, wants gratuitous wealth and gets it likewise, worries in the house of income, selfish",
    ta: "பெரும் ஆதாயம்; தன் திறனுக்கு மேல் முயன்று மேலும் மேலும் செல்வம் பெறுவார்; இலவசச் செல்வம் விரும்பி அதைப் பெறுவார்; வருமான வீட்டில் கவலை; சுயநலம்.",
  },
  {
    house: 11, lagna: "Capricorn", planetSign: "Scorpio", planet: "Ketu", page: 227,
    en: "Gets many advantages, does difficult deeds for getting wealth, uses secret devices for getting more wealth, gets stability in income, and is selfish",
    ta: "பல ஆதாயங்கள்; செல்வம் பெற கடின செயல்களைச் செய்வார்; செல்வம் பெருக்க ரகசிய உபாயங்களைப் பயன்படுத்துவார்; வருமானத்தில் நிலைத்தன்மை; சுயநலம்.",
  },
  {
    house: 11, lagna: "Aquarius", planetSign: "Sagittarius", planet: "Sun", page: 232,
    en: "Earns much wealth through the daily occupation, gains influence in occupation, gets great honour from the wife and gains much wealth through her, gets the advantage of children and education, is highly intelligent",
    ta: "தினசரி தொழிலால் பெரும் செல்வம்; தொழிலில் செல்வாக்கு; மனைவியிடமிருந்து பெரும் மரியாதையும் அவள் மூலம் பெரும் செல்வமும்; பிள்ளைகள், கல்வியின் ஆதாயம்; மிகவும் அறிவாளி.",
  },
  {
    house: 11, lagna: "Aquarius", planetSign: "Sagittarius", planet: "Moon", page: 235,
    en: "Gains by suppressing the enemy, experiences some mental distress and perplexities in the house of receipts and gains, wants gratis-like wealth, faces some trouble in the progeny, has deficiency in the house of education, does not care for diseases and afflictions",
    ta: "எதிரிகளை அடக்கி ஆதாயம்; வருமானம், ஆதாய வீட்டில் சில மன வேதனையும் குழப்பமும்; இலவசம் போன்ற செல்வம் விரும்புவார்; சந்ததியில் சில தொல்லை; கல்வி வீட்டில் குறை; நோய்களையும் துன்பங்களையும் பொருட்படுத்தார்.",
  },
  {
    house: 11, lagna: "Aquarius", planetSign: "Sagittarius", planet: "Mars", page: 237,
    en: "Acquires huge income through business occupation, gains much from father, enjoys the gains from government and society, gets the strength of brother, uses full power to accumulate wealth, possesses keen wisdom, gets children, gets success in enemies' house, wears good clothes and ornaments, and is influential",
    ta: "வணிகத் தொழிலால் பெரும் வருமானம்; தந்தையால் பெரும் ஆதாயம்; அரசு, சமூகத்தின் ஆதாயம்; சகோதரரின் வலிமை; செல்வம் சேர்க்க முழு ஆற்றலையும் பயன்படுத்துவார்; கூர்மையான அறிவு; பிள்ளைகள் பெறுவார்; எதிரி வீட்டில் வெற்றி; நல்ல ஆடை, ஆபரணங்கள்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 11, lagna: "Aquarius", planetSign: "Sagittarius", planet: "Mercury", page: 239,
    en: "Gets education, gets advantage of children and already accumulated wealth, gains the advantage of longevity, gets advantage in the daily routine of life, and is honourable",
    ta: "கல்வி பெறுவார்; பிள்ளைகளின் ஆதாயம் மற்றும் ஏற்கெனவே சேர்த்த செல்வத்தின் ஆதாயம்; நீண்ட ஆயுள் பெறும் ஆதாயம்; தினசரி வாழ்வில் ஆதாயம்; மரியாதைக்குரியவர்.",
  },
  {
    house: 11, lagna: "Aquarius", planetSign: "Sagittarius", planet: "Jupiter", page: 241,
    en: "Gets heavy income, achieves success due to grand determination, gets the advantage of children, gets brothers and sisters, gets assisting power from wife and father-in-law, is respectable and jolly",
    ta: "பெரும் வருமானம்; பெரும் உறுதியால் வெற்றி; பிள்ளைகளின் ஆதாயம்; சகோதர சகோதரிகள் உண்டு; மனைவி, மாமனாரிடமிருந்து உதவி; மரியாதைக்குரியவர், மகிழ்ச்சியானவர்.",
  },
  {
    house: 11, lagna: "Aquarius", planetSign: "Sagittarius", planet: "Venus", page: 243,
    en: "Gains much through the power of destiny, gets help from mother's house, gets the advantage of land, performs some religious deeds, acquires food, clothes and ornaments, gets education, talks modestly and is farsighted, selfish and virtuous",
    ta: "விதியின் வலிமையால் பெரும் ஆதாயம்; தாய் வீட்டிலிருந்து உதவி; நிலச் சொத்தின் ஆதாயம்; சில மதச் செயல்கள்; உணவு, உடை, ஆபரணங்கள் பெறுவார்; கல்வி; அடக்கமாகப் பேசுவார், தொலைநோக்குள்ளவர்; சுயநலமும் நல்லொழுக்கமும் உள்ளவர்.",
  },
  {
    house: 11, lagna: "Aquarius", planetSign: "Sagittarius", planet: "Saturn", page: 245,
    en: "Earns much wealth, gets fame, spends much but tries to check the expenditure, deficiency in age and children, and some deficiency in physique",
    ta: "பெரும் செல்வம் ஈட்டுவார்; புகழ்; அதிகம் செலவழிப்பார், ஆனால் செலவைக் கட்டுப்படுத்த முயல்வார்; ஆயுளிலும் பிள்ளைகளிலும் குறை; உடலமைப்பில் சில குறை.",
  },
  {
    house: 11, lagna: "Aquarius", planetSign: "Sagittarius", planet: "Rahu", page: 247,
    en: "Gets little money through secret policies and plans, faces deficiency in the apparent income, does deeds to get rid of worry for income",
    ta: "மறைந்த உபாயங்கள், திட்டங்கள் மூலம் சிறிது பணம்; வெளித்தோற்ற வருமானத்தில் குறை; வருமானக் கவலையை நீக்கும் செயல்களைச் செய்வார்.",
  },
  {
    house: 11, lagna: "Aquarius", planetSign: "Sagittarius", planet: "Ketu", page: 249,
    en: "Gets heavy monetary advantages through his grand and secret powers, does not care for the right or wrong in the place of getting special benefits, gets heavy gratuitous gains, tries to get too many advantages",
    ta: "தன் பெரிய, ரகசிய ஆற்றலால் பெரும் பண ஆதாயம்; சிறப்பு நன்மைகளைப் பெறும் இடத்தில் நல்லது கெட்டது பற்றிக் கவலைப்படார்; இலவசமாகப் பெறும் பெரும் ஆதாயம்; அதிகமான ஆதாயங்களுக்கு முயல்வார்.",
  },
  {
    house: 11, lagna: "Pisces", planetSign: "Capricorn", planet: "Sun", page: 254,
    en: "Experiences some uneasiness in the house of gains, faces some worry and problem from children's side, has deficiency in acquiring education, gains advantage from enemies' side, and is very clever",
    ta: "வருமான வீட்டில் சில அமைதியின்மை; பிள்ளைகள் பக்கம் சில கவலையும் சிக்கலும்; கல்வியில் குறை; எதிரி பக்கம் ஆதாயம்; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 11, lagna: "Pisces", planetSign: "Capricorn", planet: "Moon", page: 256,
    en: "Gets good education, earns wealth, faces some hindrances in the house of income, gets children, always talks about gains",
    ta: "நல்ல கல்வி; செல்வம் ஈட்டுவார்; வருமான வீட்டில் சில தடைகள்; பிள்ளைகள் பெறுவார்; எப்போதும் ஆதாயத்தைப் பற்றியே பேசுவார்.",
  },
  {
    house: 11, lagna: "Pisces", planetSign: "Capricorn", planet: "Mars", page: 258,
    en: "Gets many monetary advantages, accumulates wealth accidentally, gets gracious and grand advantages, gets some deficiency in education, feels deficiency in children's side, gains influence in the house of enemies, escapes automatically from troubles, gets family happiness, pays attention to the increase of wealth",
    ta: "பல பண ஆதாயங்கள்; தற்செயலாக செல்வம் சேர்ப்பார்; அருள் நிறைந்த, பெரிய ஆதாயங்கள்; கல்வியில் சில குறை; பிள்ளைகள் பக்கம் குறை; எதிரி வீட்டில் செல்வாக்கு; தொல்லைகளிலிருந்து தானாக விடுபடுவார்; குடும்ப மகிழ்ச்சி; செல்வம் பெருக்குவதில் கவனம்.",
  },
  {
    house: 11, lagna: "Pisces", planetSign: "Capricorn", planet: "Mercury", page: 260,
    en: "Gets heavy gains and income comfortably through the occupation, gets the advantage of buildings and property, gets advantage from wife, enjoys sexual pleasures, gains advantage from mother, gets happiness from children, gets success in education, speaks sweetly",
    ta: "தொழிலால் பெரும் ஆதாயமும் வருமானமும் வசதியாகக் கிடைக்கும்; கட்டிடங்கள், சொத்தின் ஆதாயம்; மனைவியால் ஆதாயம்; பாலியல் இன்பம்; தாயால் ஆதாயம்; பிள்ளைகளால் மகிழ்ச்சி; கல்வியில் வெற்றி; இனிமையாகப் பேசுவார்.",
  },
  {
    house: 11, lagna: "Pisces", planetSign: "Capricorn", planet: "Jupiter", page: 262,
    en: "Is lazy and gets some deficiency and distress in the house of income, faces some weakness in the gains connected with father, acquires some strength of children, gets respect in diurnal occupation, is very talkative",
    ta: "சோம்பலானவர்; வருமான வீட்டில் சில குறையும் துன்பமும்; தந்தை வகையிலான ஆதாயத்தில் சில பலவீனம்; பெறுவார் (இந்த உரை அச்சில் முழுமையற்றதாகத் தொடங்கும்).",
  },
  {
    house: 11, lagna: "Pisces", planetSign: "Capricorn", planet: "Venus", page: 265,
    en: "Gets a long life, gets the advantage from brothers and sisters, gets pleasure of daily routine of life, bears some agony in the children's side, has some deficiency in education, bears some uneasiness in the line of income",
    ta: "நீண்ட ஆயுள்; உடன்பிறப்புகளின் ஆதாயம்; தினசரி வாழ்வின் இன்பம்; பிள்ளைகள் வகையில் சில வேதனை; கல்வியில் சில குறை; வருமானத்தில் சில தொல்லை.",
  },
  {
    house: 11, lagna: "Pisces", planetSign: "Capricorn", planet: "Saturn", page: 267,
    en: "Gets huge monetary gains, experiences great happiness in the house of daily routine of life, has some perplexity in income and expenditure, gets worries in the house of children, has some weakness in education, is selfish",
    ta: "பெரும் பண ஆதாயம்; தினசரி வாழ்வின் பெரும் மகிழ்ச்சி; வருமானத்திலும் செலவிலும் சில குழப்பம்; பிள்ளைகள் வீட்டில் கவலைகள்; கல்வியில் சில பலவீனம்; சுயநலம்.",
  },
  {
    house: 11, lagna: "Pisces", planetSign: "Capricorn", planet: "Rahu", page: 269,
    en: "Tries to get profits more than his capacity, always gets more wealth, wants to get gratuitous wealth, has some worry in the house of gains, does not care for the benefits",
    ta: "தன் திறனுக்கு மேல் லாபம் பெற முயல்வார்; எப்போதும் அதிக செல்வம் பெறுவார்; இலவச செல்வம் விரும்புவார்; ஆதாய வீட்டில் சில கவலை; நன்மைகளைக் கருதார்.",
  },
  {
    house: 11, lagna: "Pisces", planetSign: "Capricorn", planet: "Ketu", page: 271,
    en: "Tries very hard for getting wealth, gets more wealth, works courageously for acquiring wealth, gains much through secret strength, faces some troubles in getting income and feels deficiency in that direction",
    ta: "செல்வம் பெற மிகக் கடுமையாக முயல்வார்; மேலும் செல்வம் பெறுவார்; செல்வம் ஈட்ட தைரியமாக வேலை செய்வார்; மறைந்த வலிமையால் பெரும் ஆதாயம்; வருமானம் பெறுவதில் சில தொல்லைகள், அந்தத் திசையில் குறை.",
  },
  {
    house: 12, lagna: "Aries", planetSign: "Pisces", planet: "Sun", page: 22,
    en: "Lacks good education, has weak eyes, spends much, not happy with children, talks in a rounded about way, mentally worried, suffers from enemies, tries to control house of expenditure, good contact with outsiders",
    ta: "கல்வியில் குறை; கண் பலவீனம்; அதிகம் செலவழிப்பார்; பிள்ளைகளில் அதிருப்தி; சுற்றி வளைத்துப் பேசுவார்; மனத்தில் கவலை; எதிரிகளால் துன்பம்; செலவு வீட்டைக் கட்டுப்படுத்த முயல்வார்; வெளியார் தொடர்பு நல்லது.",
  },
  {
    house: 12, lagna: "Aries", planetSign: "Pisces", planet: "Moon", page: 24,
    en: "Spends much for pleasure, expenditure for good causes, loses mother, lacks landed properties, associates with enemies, plans the expenditure with ease, mental restlessness",
    ta: "இன்பத்துக்காக அதிகம் செலவழிப்பார்; நல்ல காரியங்களுக்காகச் செலவு; தாயை இழப்பார்; நிலச் சொத்து குறை; எதிரிகளுடன் தொடர்பு; செலவைச் சுலபமாகத் திட்டமிடுவார்; மன அமைதியின்மை.",
  },
  {
    house: 12, lagna: "Aries", planetSign: "Pisces", planet: "Mars", page: 26,
    en: "Feels restless, unhappy with brotherly relations, spends much, unhappy with wife, worries and distress in the daily occupation, overcomes enemies, gets his work done with great difficulty, unhappy in sexual life and domestic work, physically weak",
    ta: "அமைதியின்மை; சகோதர உறவில் அதிருப்தி; அதிகம் செலவழிப்பார்; மனைவியுடன் அதிருப்தி; தினசரி தொழிலில் கவலையும் சிரமமும்; எதிரிகளை வெல்வார்; வேலையை மிகுந்த சிரமத்துடன் சாதிப்பார்; பாலியல் வாழ்விலும் குடும்ப வேலையிலும் அதிருப்தி; உடல் பலவீனம்.",
  },
  {
    house: 12, lagna: "Aries", planetSign: "Pisces", planet: "Mercury", page: 28,
    en: "Lacks brotherly and sisterly affection, losses keep the expenditure under control, help through enemies, has occult power, worried about growing expenditure and is miserly Aries m 29",
    ta: "சகோதர பாசம் குறை; இழப்புகள் செலவைக் கட்டுப்படுத்தும்; எதிரிகள் வழியாக உதவி; மறைந்த சக்தி உண்டு; பெருகும் செலவைப் பற்றிக் கவலை; கஞ்சத்தனம்.",
  },
  {
    house: 12, lagna: "Aries", planetSign: "Pisces", planet: "Jupiter", page: 30,
    en: "Religious in outlook, but not very fortunate, spends much but at the same time controls the expenditure, some losses, spends for religious works, dignified, careful from enemies",
    ta: "தர்ம நோக்குடையவர், ஆனால் அதிர்ஷ்டசாலி அல்ல; அதிகம் செலவழித்தாலும் செலவைக் கட்டுப்படுத்துவார்; சில இழப்புகள்; தர்ம காரியங்களுக்குச் செலவு; கம்பீரமானவர்; எதிரிகளிடம் எச்சரிக்கை.",
  },
  {
    house: 12, lagna: "Aries", planetSign: "Pisces", planet: "Venus", page: 32,
    en: "Spends much and loses wealth, family and kinsmen, unhappy with wife, improves the occupation, spends much for sexual pleasures, fear from enemies, is quarrelsome and unhappy with maternal grandfather",
    ta: "அதிகம் செலவழித்து செல்வம், குடும்பம், உறவினர்களை இழப்பார்; மனைவியுடன் அதிருப்தி; தொழிலை மேம்படுத்துவார்; பாலியல் இன்பத்துக்கு அதிகம் செலவழிப்பார்; எதிரிகளைப் பற்றிப் பயம்; தாய்வழி தாத்தாவுடன் சண்டையும் அதிருப்தியும்.",
  },
  {
    house: 12, lagna: "Aries", planetSign: "Pisces", planet: "Saturn", page: 34,
    en: "Loss through father, spends much money in many ways, works hard to increase the wealth, does various kinds of deeds to rear Dharma and keep influence in the house of enemies",
    ta: "தந்தை வழியில் இழப்பு; பல வழிகளில் அதிகம் பணம் செலவழிப்பார்; செல்வம் பெருக்க கடினமாக உழைப்பார்; தர்மம் காக்க பல செயல்களைச் செய்வார்; எதிரி வீட்டில் செல்வாக்கு.",
  },
  {
    house: 12, lagna: "Aries", planetSign: "Pisces", planet: "Rahu", page: 36,
    en: "Unhappy in spending, enmity with outsiders, never feels nervous even when he has to face grave difficulties, finally succeeds in controlling expenditure",
    ta: "செலவில் அதிருப்தி; வெளியாருடன் பகை; பெரும் சிரமங்களை எதிர்கொண்டாலும் பதறமாட்டார்; இறுதியில் செலவைக் கட்டுப்படுத்துவார்.",
  },
  {
    house: 12, lagna: "Aries", planetSign: "Pisces", planet: "Ketu", page: 38,
    en: "Spends much and is worried over expenditure, works with determination, somehow manages the expenditure and at times finds difficulty",
    ta: "அதிகம் செலவழித்து செலவைப் பற்றி கவலைப்படுவார்; உறுதியுடன் வேலை செய்வார்; ஒருவாறு செலவை சமாளிப்பார், சில நேரம் கடினம்.",
  },
  {
    house: 12, lagna: "Taurus", planetSign: "Aries", planet: "Sun", page: 43,
    en: "Spends much, happiness from others, loss due to building and property, fear from enemies, restless due to heavy expenditure",
    ta: "அதிகம் செலவழிப்பார்; பிறரிடமிருந்து மகிழ்ச்சி; கட்டிடம், சொத்தால் இழப்பு; எதிரிகளைப் பற்றிப் பயம்; பெரும் செலவால் அமைதியின்மை.",
  },
  {
    house: 12, lagna: "Taurus", planetSign: "Aries", planet: "Moon", page: 45,
    en: "Enmity with brothers and sisters, lot of expenditure, no harm from enemies, mental unrest",
    ta: "சகோதர சகோதரிகளுடன் பகை; அதிகச் செலவு; எதிரிகளால் தீங்கில்லை; மன அமைதியின்மை.",
  },
  {
    house: 12, lagna: "Taurus", planetSign: "Aries", planet: "Mars", page: 47,
    en: "Loss through wife, but enjoys sexual pleasures due to extra-marital affairs, feels weak due to extra sexual connections",
    ta: "மனைவியால் இழப்பு; ஆனால் திருமணத்துக்கு புறம்பான உறவுகளால் பாலியல் இன்பம்; கூடுதல் பாலியல் தொடர்புகளால் உடல் பலவீனம்.",
  },
  {
    house: 12, lagna: "Taurus", planetSign: "Aries", planet: "Mercury", page: 49,
    en: "Gets loss through children, loss in wealth, poor in education, worries, spends much, help from the house of grandfather, worries from enemies, loss and deficiency in family",
    ta: "குழந்தைகளால் இழப்பு; செல்வ இழப்பு; கல்வியில் குறை; கவலைகள்; அதிகம் செலவழிப்பார்; தாத்தா வீட்டின் உதவி; எதிரிகளால் கவலை; குடும்பத்தில் இழப்பும் குறையும்.",
  },
  {
    house: 12, lagna: "Taurus", planetSign: "Aries", planet: "Jupiter", page: 51,
    en: "Spends much and judiciously, works hard to get gains and wealth, happy with mother, enmity with maternal grandfather, deficiency in the house of wealth",
    ta: "அதிகமும் சாமர்த்தியமாகவும் செலவழிப்பார்; ஆதாயத்துக்காகக் கடுமையாக உழைப்பார்; தாயுடன் மகிழ்ச்சி; தாய்வழி தாத்தாவுடன் பகை; செல்வ வீட்டில் குறை.",
  },
  {
    house: 12, lagna: "Taurus", planetSign: "Aries", planet: "Venus", page: 53,
    en: "Spends much, worried and suffers from some diseases, gets disrespect in honour, feels lonely",
    ta: "அதிகம் செலவழிப்பார்; கவலையும் சில நோய்களும்; மரியாதையில் அவமதிப்பு; தனிமையை உணர்வார்.",
  },
  {
    house: 12, lagna: "Taurus", planetSign: "Aries", planet: "Saturn", page: 55,
    en: "Loss in the house of father, does some mean and low deeds, weakness in the house of expenditure, influence in the house of enemies, unhappy in government and society",
    ta: "தந்தை வீட்டில் இழப்பு; சில கீழ்த்தரமான செயல்களைச் செய்வார்; செலவு வீட்டில் பலவீனம்; எதிரி வீட்டில் செல்வாக்கு; அரசு, சமூகத்தில் அதிருப்தி.",
  },
  {
    house: 12, lagna: "Taurus", planetSign: "Aries", planet: "Rahu", page: 57,
    en: "Loss and huge expenditure, worried, unable to manage the expenditure '",
    ta: "பெரும் இழப்பும் பெரும் செலவும்; கவலை; செலவை நிர்வகிக்க முடியாது.",
  },
  {
    house: 12, lagna: "Taurus", planetSign: "Aries", planet: "Ketu", page: 59,
    en: "Lot of expenditure, does not believe in Dharma, faces outside relations boldly",
    ta: "அதிகச் செலவு; தர்மத்தை நம்பார்; வெளியார் உறவுகளை தைரியமாக எதிர்கொள்வார்.",
  },
  {
    house: 12, lagna: "Gemini", planetSign: "Taurus", planet: "Sun", page: 63,
    en: "Gets loss and weakness in his face and enemy, faces some loss and separation of brothers and sisters, spends much and restless in the house of expenditure, huge influence in the house of enemies, feels lazy, does not care for ill-health",
    ta: "முகத்திலும் எதிரிகளிலும் இழப்பும் பலவீனமும்; உடன்பிறப்புகளைப் பிரிவும் இழப்பும்; அதிகம் செலவழித்து செலவு வீட்டில் அமைதியின்மை; எதிரி வீட்டில் பெரும் செல்வாக்கு; சோம்பல்; உடல்நலத்தைப் பொருட்படுத்தார்.",
  },
  {
    house: 12, lagna: "Gemini", planetSign: "Taurus", planet: "Moon", page: 65,
    en: "Gets wealth through union of mind and contact with others, great loss in the house of family, benefit likely through low persons, tries to check the expenditure",
    ta: "மன இணைப்பாலும் பிறர் தொடர்பாலும் செல்வம்; குடும்ப வீட்டில் பெரும் இழப்பு; தாழ்ந்தவர்கள் மூலம் ஆதாயம் கிடைக்கக்கூடும்; செலவைக் கட்டுப்படுத்த முயல்வார்.",
  },
  {
    house: 12, lagna: "Gemini", planetSign: "Taurus", planet: "Mars", page: 67,
    en: "Feels worry and weakness in the house of income, gets the work done in the house of enemy, some perplexity in the house of brothers and sisters, restlessness in the house of wife, spends much, gets some sexual disorder",
    ta: "வருமான வீட்டில் கவலையும் பலவீனமும்; எதிரி வீட்டில் வேலை சாதிப்பார்; சகோதர சகோதரிகள் வீட்டில் சில குழப்பம்; மனைவி வீட்டில் அமைதியின்மை; அதிகம் செலவழிப்பார்; பாலியல் குறைபாடு.",
  },
  {
    house: 12, lagna: "Gemini", planetSign: "Taurus", planet: "Mercury", page: 69,
    en: "Gets deficiency in physical pleasures, weakness in body, goes to other places, unhappy with mother, unhappy with motherland and buildings, spends much, gets his work done fully with everyone, is a wanderer",
    ta: "உடல் இன்பங்களில் குறை; உடல் பலவீனம்; வேறு இடங்களுக்குச் செல்வார்; தாயுடன் அதிருப்தி; தாய்நாடு, கட்டிடங்களில் அதிருப்தி; அதிகம் செலவழிப்பார்; எல்லோருடனும் வேலையை முழுமையாகச் சாதிப்பார்; அலைந்து திரிபவர்.",
  },
  {
    house: 12, lagna: "Gemini", planetSign: "Taurus", planet: "Jupiter", page: 71,
    en: "Weakness in the house of father, great loss in the house of wife, weakness in getting honour from government and society and also in the line of occupation, some strength in the house of land and buildings, feels restlessness in the daily routine of life, weakness in sexual pleasures",
    ta: "தந்தை வீட்டில் பலவீனம்; மனைவி வீட்டில் பெரும் இழப்பு; அரசு, சமூகத்திலும் தொழிலிலும் மரியாதை பெறுவதில் பலவீனம்; நிலமும் கட்டிடமும் சில வலிமை; தினசரி வாழ்வில் அமைதியின்மை; பாலியல் இன்பத்தில் பலவீனம்.",
  },
  {
    house: 12, lagna: "Gemini", planetSign: "Taurus", planet: "Venus", page: 73,
    en: "Much weakness in the house of education, has loss in the side of children, spends much, clever in getting the work done in the house of enemy, some suspicious intellect",
    ta: "கல்வியில் பெரும் பலவீனம்; பிள்ளைகள் வகையில் இழப்பு; அதிகம் செலவழிப்பார்; எதிரி வீட்டில் வேலையை சாமர்த்தியமாகச் சாதிப்பார்; சில சந்தேக அறிவு.",
  },
  {
    house: 12, lagna: "Gemini", planetSign: "Taurus", planet: "Saturn", page: 75,
    en: "Restless in life, weakness in Dharma, more expenditure, tries to increase the wealth, great influence in the side of enemy, some loss in wealth, deficiency in fame, and somewhat impersonal",
    ta: "வாழ்வில் அமைதியின்மை; தர்மத்தில் பலவீனம்; அதிகச் செலவு; செல்வத்தைப் பெருக்க முயல்வார்; எதிரி வீட்டில் பெரும் செல்வாக்கு; சில செல்வ இழப்பு; புகழில் குறை; சற்று பற்றற்றவர்.",
  },
  {
    house: 12, lagna: "Gemini", planetSign: "Taurus", planet: "Rahu", page: 77,
    en: "Sometimes bears troubles on account of high expenditure, careless in connection with other places, works with secret devices and thinks remotely",
    ta: "அதிக செலவால் சில நேரம் தொல்லைகள்; பிற இடங்களில் அசட்டை; ரகசிய உபாயங்களால் வேலை செய்வார்; தொலைவில் சிந்திப்பார்.",
  },
  {
    house: 12, lagna: "Gemini", planetSign: "Taurus", planet: "Ketu", page: 79,
    en: "Spends much, labours hard to face expenditure",
    ta: "அதிகம் செலவழிப்பார்; செலவைச் சமாளிக்கக் கடினமாக உழைப்பார்.",
  },
  {
    house: 12, lagna: "Cancer", planetSign: "Gemini", planet: "Sun", page: 84,
    en: "Spends too much wealth, unable to accumulate wealth, gets wealth from outside sources, keeps influence on the side of enemies by spending, escape from diseases and troubles, feels unhappy on account of wealth and family",
    ta: "பெரும் செல்வத்தைச் செலவழிப்பார்; செல்வம் சேர்க்க முடியாது; வெளி மூலங்களிலிருந்து பணம் பெறுவார்; செலவால் எதிரி வீட்டில் செல்வாக்கு வைத்திருப்பார்; நோய்களிலிருந்தும் துன்பங்களிலிருந்தும் தப்புவார்; செல்வம், குடும்பம் பற்றி அதிருப்தி.",
  },
  {
    house: 12, lagna: "Cancer", planetSign: "Gemini", planet: "Moon", page: 86,
    en: "Gets some deficiency and weakness in physique, lives in foreign places and gets honour there, feels some physical and mental distress, spends much, makes efforts to have influence in the house of enemies, suspicious nature",
    ta: "உடல் பலவீனமும் குறையும்; வெளிநாடுகளில் வாழ்ந்து அங்கு மரியாதை பெறுவார்; உடல், மனத் துன்பம்; அதிகம் செலவழிப்பார்; எதிரி வீட்டில் செல்வாக்கு பெற முயல்வார்; சந்தேக இயல்பு.",
  },
  {
    house: 12, lagna: "Cancer", planetSign: "Gemini", planet: "Mars", page: 88,
    en: "Gets some respect, experiences troubles from son, gets weakness in education and intelligence, spends much, gets sexual pleasures, losses in big occupation, is very courageous and energetic",
    ta: "சில மரியாதை; மகனால் துன்பம்; கல்வியிலும் அறிவிலும் பலவீனம்; அதிகம் செலவழிப்பார்; பாலியல் இன்பம் பெறுவார்; பெரிய தொழிலில் இழப்பு; மிக தைரியமும் சுறுசுறுப்பும்.",
  },
  {
    house: 12, lagna: "Cancer", planetSign: "Gemini", planet: "Mercury", page: 90,
    en: "Has the power of spending much, keeps distant relations with brothers and sisters, deficiency in strength, some influence in the house of enemy, spends for some disease and hardships, never puts any obstacles in the house of expenditure",
    ta: "அதிகம் செலவழிக்கும் ஆற்றல்; சகோதர சகோதரிகளுடன் தொலைதூர உறவு; வலிமைக் குறை; எதிரி வீட்டில் சில செல்வாக்கு; சில நோய்கள், கஷ்டங்களுக்காகச் செலவு; செலவு வீட்டில் எப்போதும் தடை வைக்கமாட்டார்.",
  },
  {
    house: 12, lagna: "Cancer", planetSign: "Gemini", planet: "Jupiter", page: 92,
    en: "Spends much, some weakness in the house of destiny, gets the support of labour and destiny in the power to manage expenditure, some deficiency to acquire fame, some obstacles in the happiness and in daily routine of life",
    ta: "அதிகம் செலவழிப்பார்; விதி வீட்டில் சில பலவீனம்; செலவை நிர்வகிக்கும் ஆற்றலுக்கு உழைப்பும் விதியும் ஆதரவு; புகழ் பெறுவதில் சிறு குறை; இன்பத்திலும் தினசரி வாழ்விலும் சில தடைகள்.",
  },
  {
    house: 12, lagna: "Cancer", planetSign: "Gemini", planet: "Venus", page: 94,
    en: "Gets some loss of the house of mother, spends much, feels the pleasure in spending the income, carelessness in the house of enemy and is somewhat restless",
    ta: "தாயின் வீட்டில் சில இழப்பு; அதிகம் செலவழிப்பார்; வருமானத்தைச் செலவழிப்பதில் மகிழ்ச்சி; எதிரி வீட்டில் அசட்டை; சற்று அமைதியற்றவர்.",
  },
  {
    house: 12, lagna: "Cancer", planetSign: "Gemini", planet: "Saturn", page: 96,
    en: "Spends much, progress of destiny through troublesome devices and secret tactics, some weakness with the happiness of wife and family, loss of wealth and deficiency in family",
    ta: "அதிகம் செலவழிப்பார்; விதியின் முன்னேற்றம் தந்திரமான வழிகளாலும் ரகசிய உபாயங்களாலும்; மனைவி, குடும்ப மகிழ்ச்சியில் சில பலவீனம்; செல்வ இழப்பும் குடும்பக் குறையும்.",
  },
  {
    house: 12, lagna: "Cancer", planetSign: "Gemini", planet: "Rahu", page: 98,
    en: "Spends aristocratically, high class schemes in the house of expenditure, manages the expenditure very easily, possesses great power",
    ta: "உயர்குடியினர் போல செலவழிப்பார்; செலவு வீட்டில் உயர்தர திட்டங்கள்; எளிதாகச் செலவை நிர்வகிப்பார்; பெரும் வலிமை.",
  },
  {
    house: 12, lagna: "Cancer", planetSign: "Gemini", planet: "Ketu", page: 100,
    en: "Great restlessness and difficulties in the house of expenditure, some calamities in the house of expenditure, is very impatient",
    ta: "செலவு வீட்டில் பெரும் அமைதியின்மையும் சிரமங்களும்; செலவு வீட்டில் சில ஆபத்துகள்; மிகவும் பொறுமையற்றவர்.",
  },
  {
    house: 12, lagna: "Leo", planetSign: "Cancer", planet: "Sun", page: 105,
    en: "Is of emaciated body, lives in foreign place, weakness in his heart, spends much, aspects the house of enemy very sharply, feels loneliness, possesses the power of touring, and feels weak",
    ta: "மெலிந்த உடல்; வெளிநாட்டில் வாழ்வார்; இதயத்தில் பலவீனம்; அதிகம் செலவழிப்பார்; எதிரி வீட்டை மிகக் கூர்மையாகக் கவனிப்பார்; தனிமை உணர்வார்; பயணம் செய்யும் ஆற்றல்; பலவீனம் உணர்வார்.",
  },
  {
    house: 12, lagna: "Leo", planetSign: "Cancer", planet: "Moon", page: 107,
    en: "Spends much, unable to control the expenditure, somewhat restless and of scrupulous mind",
    ta: "அதிகம் செலவழிப்பார்; செலவைக் கட்டுப்படுத்த முடியாது; சற்று அமைதியற்றவர், சந்தேக மனம்.",
  },
  {
    house: 12, lagna: "Leo", planetSign: "Cancer", planet: "Mars", page: 109,
    en: "Great weakness in the house of destiny, gets loss in the house of mother, loss of lands and buildings and residential places, restless in the house of expenditure, influence in the house of enemy",
    ta: "விதி வீட்டில் பெரும் பலவீனம்; தாய் வீட்டில் இழப்பு; நிலம், கட்டிடம், குடியிருப்பு இழப்பு; செலவு வீட்டில் அமைதியின்மை; எதிரி வீட்டில் செல்வாக்கு.",
  },
  {
    house: 12, lagna: "Leo", planetSign: "Cancer", planet: "Mercury", page: 111,
    en: "Spends a lot of money, not giving importance to accumulate wealth, takes the help of money to drive away enemies, diseases and difficulties, experiences some distress in the store of wealth",
    ta: "அதிகம் பணம் செலவழிப்பார்; செல்வம் சேர்ப்பதற்கு முக்கியத்துவம் கொடுக்கமாட்டார்; எதிரிகள், நோய்கள், துன்பங்களை விரட்ட பணத்தின் உதவியைப் பெறுவார்; செல்வக் களஞ்சியத்தில் சில கவலை.",
  },
  {
    house: 12, lagna: "Leo", planetSign: "Cancer", planet: "Jupiter", page: 113,
    en: "Spends much, gets a little education and a few children, gets good age, some loss in the house of happiness",
    ta: "அதிகம் செலவழிப்பார்; சிறிதளவு கல்வியும் சில பிள்ளைகளும்; நல்ல வயது; மகிழ்ச்சி வீட்டில் சில இழப்பு.",
  },
  {
    house: 12, lagna: "Leo", planetSign: "Cancer", planet: "Venus", page: 115,
    en: "Spends much, loss in the house of father and brothers, loss in business, gets some weakness in the house of government and society",
    ta: "அதிகம் செலவழிப்பார்; தந்தை, சகோதரர் வீட்டில் இழப்பு; வணிகத்தில் இழப்பு; அரசு, சமூக வீட்டில் சில பலவீனம்.",
  },
  {
    house: 12, lagna: "Leo", planetSign: "Cancer", planet: "Saturn", page: 117,
    en: "Spends much, some loss in the house of wife, keeps in the influence of in the house of enemy, has less faith in God and destiny, spends on diseases",
    ta: "அதிகம் செலவழிப்பார்; மனைவி வீட்டில் சில இழப்பு; எதிரி வீட்டில் செல்வாக்கு; கடவுள், விதி மீது குறைந்த நம்பிக்கை; நோய்களுக்காகச் செலவழிப்பார்.",
  },
  {
    house: 12, lagna: "Leo", planetSign: "Cancer", planet: "Rahu", page: 119,
    en: "Spends much, gets the power to manage expenditure with great hardships and anxieties, sometimes faces hostile calculations in the house of expenditure",
    ta: "அதிகம் செலவழிப்பார்; பெரும் சிரமங்களுடனும் கவலைகளுடனும் செலவை நிர்வகிக்கும் ஆற்றல்; சில நேரம் செலவு வீட்டில் பகையான கணக்குகள்.",
  },
  {
    house: 12, lagna: "Leo", planetSign: "Cancer", planet: "Ketu", page: 121,
    en: "Great restlessness in the house of expenditure, some restlessness in the labour connected with outside places, gets his work done with internal patience bearing great troubles and in the end gets some firmness of expenditure",
    ta: "செலவு வீட்டில் பெரும் அமைதியின்மை; வெளியூர் வேலையில் சில அமைதியின்மை; பெரும் துன்பங்களைத் தாங்கும் உள் பொறுமையால் வேலை சாதிப்பார்; இறுதியில் செலவில் சில உறுதி.",
  },
  {
    house: 12, lagna: "Virgo", planetSign: "Leo", planet: "Sun", page: 126,
    en: "Spends much, keeps influence on enemies, spends in matters of dispute and illness, gets the great power of influence in the house of expenditure",
    ta: "அதிகம் செலவழிப்பார்; எதிரிகள் மீது செல்வாக்கு; சச்சரவு, நோய் விஷயங்களில் செலவு; செலவு வீட்டில் பெரும் செல்வாக்கு.",
  },
  {
    house: 12, lagna: "Virgo", planetSign: "Leo", planet: "Moon", page: 128,
    en: "Spends much, is of fickle and restless mind, thinks of remote things, spends the whole income on things of securing gains, matters relating to illness or disputes, thinks with a cool mind in the side of enemies to get his work done, some weakness in gaining income, and is insipid",
    ta: "அதிகம் செலவழிப்பார்; நிலையற்ற, அலைபாயும் மனம்; தொலைதூர விஷயங்களைப் பற்றி சிந்திப்பார்; வருமானம் முழுவதையும் ஆதாயம் பெறும் விஷயங்களுக்குச் செலவழிப்பார்; நோய் அல்லது சச்சரவு விஷயங்கள்; எதிரிகளிடம் வேலை சாதிக்கக் குளிர்ந்த மனத்துடன் சிந்திப்பார்; வருமானம் பெறுவதில் சில பலவீனம்; சுவையற்றவர்.",
  },
  {
    house: 12, lagna: "Virgo", planetSign: "Leo", planet: "Mars", page: 130,
    en: "Gets some loss in the side of enemies and maternal grandfather, gets some loss of brother and wife, loss on the side of daily occupation Virgo ' 131",
    ta: "எதிரிகள், தாத்தா வீட்டின் வகையில் சில இழப்பு; சகோதரர், மனைவி வகையில் சில இழப்பு; தினசரி தொழிலில் இழப்பு.",
  },
  {
    house: 12, lagna: "Virgo", planetSign: "Leo", planet: "Mercury", page: 132,
    en: "Spends much, lives in foreign countries, some weakness in the house of father, gets some courage on the side of enemies, makes the expenditure through the power of discretion",
    ta: "அதிகம் செலவழிப்பார்; வெளிநாடுகளில் வாழ்வார்; தந்தை வீட்டில் சில பலவீனம்; எதிரிகள் வகையில் சில தைரியம்; விவேகத்தின் வலிமையால் செலவு செய்வார்.",
  },
  {
    house: 12, lagna: "Virgo", planetSign: "Leo", planet: "Jupiter", page: 135,
    en: "Spends much, gets the loss of wife, gets worries in the daily occupation, gets some weakness in the house of mother, gets the happiness of a long age, gets some loss of property",
    ta: "அதிகம் செலவழிப்பார்; மனைவியை இழப்பார்; தினசரி தொழிலில் கவலைகள்; தாய் வீட்டில் சில பலவீனம்; நீண்ட வயதின் மகிழ்ச்சி; சொத்தில் சில இழப்பு.",
  },
  {
    house: 12, lagna: "Virgo", planetSign: "Leo", planet: "Venus", page: 137,
    en: "Spends much, some weakness, is unable to accumulate money, gets family losses, makes the enemies somewhat friends, some loss of Dharma",
    ta: "அதிகம் செலவழிப்பார்; சில பலவீனம்; பணம் சேர்க்க முடியாது; குடும்ப இழப்புகள்; எதிரிகளைச் சிறிது நண்பராக்குவார்; தர்மத்தில் சில இழப்பு.",
  },
  {
    house: 12, lagna: "Virgo", planetSign: "Leo", planet: "Saturn", page: 139,
    en: "Worried due to tasteless expenditure, gets loss and distress in the side of children, deficiency in intellect and education, prepares a grand scheme for the increase of wealth, is always worried, speaks less",
    ta: "சுவையற்ற செலவைப் பற்றிக் கவலை; பிள்ளைகள் வகையில் இழப்பும் துன்பமும்; அறிவிலும் கல்வியிலும் குறை; செல்வம் பெருக்க பெரிய திட்டம்; எப்போதும் கவலை; குறைவாகப் பேசுவார்.",
  },
  {
    house: 12, lagna: "Virgo", planetSign: "Leo", planet: "Rahu", page: 141,
    en: "Great distress in connection with expenditure, faces worries, sometimes faces grave difficulties in the house of expenditure, and in the end achieves firmness in connection with expenditure",
    ta: "செலவில் பெரும் துன்பம்; கவலைகள்; சில நேரம் செலவு வீட்டில் பெரும் சிரமங்கள்; இறுதியில் செலவு விஷயத்தில் உறுதி அடைவார்.",
  },
  {
    house: 12, lagna: "Virgo", planetSign: "Leo", planet: "Ketu", page: 143,
    en: "Bears great difficulty in the house of expenditure, and in the end overpowers it",
    ta: "செலவு வீட்டில் பெரும் சிரமத்தைத் தாங்கி இறுதியில் அதை வெல்வார்.",
  },
  {
    house: 12, lagna: "Libra", planetSign: "Virgo", planet: "Sun", page: 147,
    en: "Spends much, spends the whole profit, has the idea of renunciation, gains from enemies",
    ta: "அதிகம் செலவழிப்பார்; ஆதாயம் முழுவதையும் செலவழிப்பார்; துறவு எண்ணம்; எதிரிகளிடமிருந்து ஆதாயம்.",
  },
  {
    house: 12, lagna: "Libra", planetSign: "Virgo", planet: "Moon", page: 149,
    en: "Loss in business occupation, loss in the house of government, rears weakness in the house of honour and respect, creates influence in the house of enemies, deficiency in mind",
    ta: "வணிகத் தொழிலில் இழப்பு; அரசு வீட்டில் இழப்பு; மரியாதையிலும் கௌரவத்திலும் பலவீனம்; எதிரி வீட்டில் செல்வாக்கு; மனத்தில் குறை.",
  },
  {
    house: 12, lagna: "Libra", planetSign: "Virgo", planet: "Mars", page: 151,
    en: "Heavy loss of men and wealth, gets restlessness in wife and family, loss in everyday occupation, some influence over opponents, feels loss of wealth and some speciality in occupation",
    ta: "ஆட்களிலும் செல்வத்திலும் பெரும் இழப்பு; மனைவி, குடும்பத்தில் அமைதியின்மை; தினசரி தொழிலில் இழப்பு; எதிரிகள் மீது சில செல்வாக்கு; செல்வ இழப்பும் தொழிலில் சில சிறப்பும்.",
  },
  {
    house: 12, lagna: "Libra", planetSign: "Virgo", planet: "Mercury", page: 153,
    en: "Spends much, losses in the house of destiny, spends much in pilgrimages and is religious, uses some policy of wisdom in relation with enemies",
    ta: "அதிகம் செலவழிப்பார்; விதி வீட்டில் இழப்பு; யாத்திரைகளுக்கு அதிகம் செலவழித்து மதப்பற்று; எதிரிகளுடன் விவேகமான உபாயம்.",
  },
  {
    house: 12, lagna: "Libra", planetSign: "Virgo", planet: "Jupiter", page: 155,
    en: "Gets weakness in his strength and energy, has enmity with brother, defeats the opponent, careless and gets weakness due to heavy expenditure",
    ta: "வலிமையிலும் ஆற்றலிலும் பலவீனம்; சகோதரருடன் பகை; எதிரியை வெல்வார்; அசட்டை; அதிக செலவால் பலவீனம்.",
  },
  {
    house: 12, lagna: "Libra", planetSign: "Virgo", planet: "Venus", page: 157,
    en: "Gets much weakness in his body, gets distress and deficiency in expenditure, feels sufferings in his daily routine of life",
    ta: "உடலில் பெரும் பலவீனம்; செலவு வீட்டில் துன்பமும் குறையும்; தினசரி வாழ்வில் வேதனை.",
  },
  {
    house: 12, lagna: "Libra", planetSign: "Virgo", planet: "Saturn", page: 159,
    en: "Spends much to get happiness, feels happiness only by expenditure, gets deficiency in his mother country, some weakness in intellect and education, gets loss in the side of children and gets little happiness, great enmity in connection with family and hoarding of wealth",
    ta: "இன்பம் பெற அதிகம் செலவழிப்பார்; செலவிலேயே மகிழ்ச்சி காண்பார்; தாய்நாட்டில் குறை; அறிவிலும் கல்வியிலும் சில பலவீனம்; பிள்ளைகள் வகையில் இழப்பு, சிறு மகிழ்ச்சி; குடும்பத்தில் பெரும் பகையும் செல்வம் பதுக்குதலும்.",
  },
  {
    house: 12, lagna: "Libra", planetSign: "Virgo", planet: "Rahu", page: 161,
    en: "Spends much, some incompleteness in the house of expenditure, bears deficiently in the house of expenditure",
    ta: "அதிகம் செலவழிப்பார்; செலவு வீட்டில் சில குறை; செலவு வீட்டில் பற்றாக்குறை.",
  },
  {
    house: 12, lagna: "Libra", planetSign: "Virgo", planet: "Ketu", page: 163,
    en: "Spends in a determined way, works very boldly even in having some weakness in the matters of expenditure",
    ta: "உறுதியுடன் செலவழிப்பார்; செலவு விஷயத்தில் சில பலவீனம் இருந்தாலும் மிகத் தைரியமாக வேலை செய்வார்.",
  },
  {
    house: 12, lagna: "Scorpio", planetSign: "Libra", planet: "Sun", page: 169,
    en: "Loss of the house of father, gets loss in business and occupation, gets loss of respect and honour, bears distress in the house of expenditure, some influence in the house of enemies, does not care for diseases, has occult power",
    ta: "தந்தை வீட்டில் இழப்பு; தொழிலிலும் வேலையிலும் இழப்பு; மரியாதையிலும் கௌரவத்திலும் இழப்பு; செலவு வீட்டில் துன்பம்; எதிரி வீட்டில் சில செல்வாக்கு; நோய்களைப் பொருட்படுத்தார்; மறைந்த சக்தி உண்டு.",
  },
  {
    house: 12, lagna: "Scorpio", planetSign: "Libra", planet: "Moon", page: 171,
    en: "Faces weakness in destiny, gets the support of destiny in managing the expenditure, gets some conciliation from the house of enemies and in the maternal grandfather's family",
    ta: "விதியில் பலவீனம்; செலவை நிர்வகிக்க விதியின் ஆதரவு; எதிரி வீட்டிலும் தாய் வழி தாத்தா குடும்பத்திலும் சில சமரசம்.",
  },
  {
    house: 12, lagna: "Scorpio", planetSign: "Libra", planet: "Mars", page: 173,
    en: "Experiences troubles in physique, has a weak body, worried about problems of expenditure, spends in matters relating to quarrels and diseases, lives in foreign places, loves brothers, maintains the influences and pursues his occupation even in the weak position, unhappiness with wife and family, wants sexual pleasures and puts special efforts in acquiring the same, is fickle-minded and wanders much",
    ta: "உடல் உபாதைகள்; பலவீனமான உடல்; செலவுப் பிரச்சினைகள் பற்றிக் கவலை; சச்சரவு, நோய் விஷயங்களில் செலவு; வெளிநாட்டில் வாழ்வார்; சகோதரரை நேசிப்பார்; வலிமையைக் காத்து பலவீனமான நிலையிலும் தொழிலைத் தொடர்வார்; மனைவி, குடும்பத்தில் அதிருப்தி; பாலியல் இன்பம் விரும்பி அதற்கு சிறப்பு முயற்சி; நிலையற்ற மனம்; அதிகம் அலைந்து திரிபவர்.",
  },
  {
    house: 12, lagna: "Scorpio", planetSign: "Libra", planet: "Mercury", page: 175,
    en: "Spends too much, gets the contact of other places, gets the gains through the later period of life, gains from expenditure, gets the weakness in the gains, nervous conjunction in the house of longevity, some struggles and diseases etc",
    ta: "அதிகம் செலவழிப்பார்; பிற இடங்களுடன் தொடர்பு; வாழ்வின் பிற்பகுதியில் ஆதாயம்; செலவிலிருந்து ஆதாயம்; ஆதாய வீட்டில் பலவீனம்; ஆயுள் வீட்டில் பதற்றமான சேர்க்கை; சில போராட்டங்களும் நோய்களும்.",
  },
  {
    house: 12, lagna: "Scorpio", planetSign: "Libra", planet: "Jupiter", page: 177,
    en: "Spends much, weakness in wealth, heavy losses in children's side, gets little education, feces many difficulties at the time of getting education, faces a wrong mode of conversation, is unable to make others understand the ideas properly, deficiency in the house of peace, happiness and mother, possesses the friendship on the side of enemies, spends the life aristocratically",
    ta: "அதிகம் செலவழிப்பார்; செல்வத்தில் பலவீனம்; குழந்தைகள் வீட்டில் பெரும் இழப்பு; சிறிது கல்வி; கல்வி பெறும்போது பல சிரமங்கள்; தவறான பேச்சு முறை; தன் கருத்துகளை மற்றவர்களுக்குச் சரியாகப் புரியவைக்க முடியாது; நிம்மதி, மகிழ்ச்சி, தாய் வீட்டில் குறை; எதிரிகளிடம் நட்பு; உயர்குடி வாழ்வு.",
  },
  {
    house: 12, lagna: "Scorpio", planetSign: "Libra", planet: "Venus", page: 179,
    en: "Loss of wife and family, gets the pleasures of wife and sex through conjunction of expenditure, gets the work done in the house of enemies",
    ta: "மனைவி, குடும்ப இழப்பு; செலவு சேர்க்கையால் மனைவியின் இன்பமும் பாலியல் இன்பமும்; எதிரி வீட்டில் வேலை சாதிப்பார்.",
  },
  {
    house: 12, lagna: "Scorpio", planetSign: "Libra", planet: "Saturn", page: 181,
    en: "Spends through his own power, feels more comfortable due to spending, has fascination for Dharma and God, estimates the side of enemy to be somewhat weak",
    ta: "தன் சொந்த ஆற்றலால் செலவழிப்பார்; செலவழிப்பதால் அதிக வசதியாக உணர்வார்; தர்மம், இறை மீது ஈடுபாடு; எதிரி வீட்டை சற்று பலவீனமாக மதிப்பிடுவார்.",
  },
  {
    house: 12, lagna: "Scorpio", planetSign: "Libra", planet: "Rahu", page: 183,
    en: "Spends much, gets the work done with great tactics, never worries in connection with expenditure, does not care for the troubles in acquiring wealth, always manages the expenditure",
    ta: "அதிகம் செலவழிப்பார்; பெரும் தந்திரத்தால் வேலை சாதிப்பார்; செலவு பற்றிக் கவலைப்படார்; செல்வம் ஈட்டும் சிரமங்களைப் பொருட்படுத்தார்; எப்போதும் செலவை நிர்வகிப்பார்.",
  },
  {
    house: 12, lagna: "Scorpio", planetSign: "Libra", planet: "Ketu", page: 185,
    en: "Spends much, works patiently and tactfully in connection with expenditure, sometimes finds himself unable to manage expenditure",
    ta: "அதிகம் செலவழிப்பார்; செலவை பொறுமையாகவும் சாமர்த்தியமாகவும் நிர்வகிப்பார்; சில நேரம் செலவை நிர்வகிக்க முடியாமல் போகும்.",
  },
  {
    house: 12, lagna: "Sagittarius", planetSign: "Scorpio", planet: "Sun", page: 190,
    en: "Loss in connection with destiny, faces delays in the rise of fortune, spends much, influence in the house of enemies, does not possess full faith in God, possesses worldly wisdom",
    ta: "விதி வீட்டில் இழப்பு; அதிர்ஷ்ட உயர்வில் தாமதம்; அதிகம் செலவழிப்பார்; எதிரி வீட்டில் செல்வாக்கு; கடவுளின் மீது முழு நம்பிக்கை இல்லை; உலக ஞானம் உண்டு.",
  },
  {
    house: 12, lagna: "Sagittarius", planetSign: "Scorpio", planet: "Moon", page: 192,
    en: "Confronts distress and restlessness in the house of life, weakness in longevity, perplexity in expenditure, gets influence in the side of enemies, wanders much, and is narrow-minded",
    ta: "வாழ்வு வீட்டில் துன்பமும் அமைதியின்மையும்; ஆயுளில் பலவீனம்; செலவில் குழப்பம்; எதிரி வீட்டில் செல்வாக்கு; அதிகம் அலைந்து திரிவார்; குறுகிய மனம்.",
  },
  {
    house: 12, lagna: "Sagittarius", planetSign: "Scorpio", planet: "Mars", page: 194,
    en: "Spends much, bears heavy losses in children, gets the loss in wife's side, loss of the brother also, bears loss in occupation, has weakness in wisdom and education, creates some influence over the enemies",
    ta: "அதிகம் செலவழிப்பார்; பிள்ளைகளால் பெரும் இழப்பு; மனைவி வகையில் இழப்பு; சகோதரர் இழப்பு; தொழிலில் இழப்பு; அறிவிலும் கல்வியிலும் பலவீனம்; எதிரிகள் மீது சில செல்வாக்கு.",
  },
  {
    house: 12, lagna: "Sagittarius", planetSign: "Scorpio", planet: "Mercury", page: 196,
    en: "Bears loss in business occupation and in father's house, spends much, bears loss in the house of wife, labours for occupation, feces weakness in government and society, finds obstacles in progress, is of lazy nature, feces troubles in family",
    ta: "வணிகத் தொழிலிலும் தந்தை வீட்டிலும் இழப்பு; அதிகம் செலவழிப்பார்; மனைவி வீட்டில் இழப்பு; தொழிலுக்காக உழைப்பார்; அரசு, சமூகத்தில் பலவீனம்; முன்னேற்றத்தில் தடைகள்; சோம்பல் இயல்பு; குடும்பத்தில் சிக்கல்கள்.",
  },
  {
    house: 12, lagna: "Sagittarius", planetSign: "Scorpio", planet: "Jupiter", page: 198,
    en: "Deficiency in the handsomeness of the body, spends much, gets splendour in the daily routine if life, uses peace and influence in the house of enemies, travels much",
    ta: "உடல் அழகில் குறை; அதிகம் செலவழிப்பார்; தினசரி வாழ்வில் நயம்; எதிரி வீட்டில் அமைதியும் செல்வாக்கும்; அதிகம் பயணம் செய்வார்.",
  },
  {
    house: 12, lagna: "Sagittarius", planetSign: "Scorpio", planet: "Venus", page: 200,
    en: "Spends much, gets the gains through diligence, gets deficiency of gains, spends much due to numerous worries, manages to work with great cleverness and with worries, solves the difficulties of expenditure through intricate tactics and is clever",
    ta: "அதிகம் செலவழிப்பார்; உழைப்பால் ஆதாயம் பெறுவார்; ஆதாயத்தில் குறை; பல கவலைகளால் அதிகம் செலவழிப்பார்; மிகுந்த சாமர்த்தியத்துடன் வேலை செய்வார்; செலவு சிக்கல்களை நுட்பமான உபாயங்களால் தீர்ப்பார்; சாமர்த்தியமானவர்.",
  },
  {
    house: 12, lagna: "Sagittarius", planetSign: "Scorpio", planet: "Saturn", page: 202,
    en: "Spends much, gets the power of wealth, maintains the show like a rich person, unable to rear Dharma, maintains influence in the house of enemy through secret tactics",
    ta: "அதிகம் செலவழிப்பார்; செல்வ ஆற்றல் பெறுவார்; பணக்காரர் போல வாழ்க்கை காட்டுவார்; தர்மத்தைக் காக்க முடியாது; ரகசிய உபாயங்களால் எதிரி வீட்டில் செல்வாக்கு.",
  },
  {
    house: 12, lagna: "Sagittarius", planetSign: "Scorpio", planet: "Rahu", page: 204,
    en: "Spends much, faces distress and troubles in the expenditure, uses many devices to escape from the worries in connection with expenditure, tries very hard to get firmness in managing the expenditure, is unable to think about truth and falsehood",
    ta: "அதிகம் செலவழிப்பார்; செலவில் சிரமமும் தொல்லையும்; செலவு பற்றிய கவலைகளிலிருந்து தப்ப பல உபாயங்கள்; செலவு நிர்வாகத்தில் உறுதி பெற மிகக் கடுமையாக முயல்வார்; உண்மை, பொய் பற்றிச் சிந்திக்க முடியாது.",
  },
  {
    house: 12, lagna: "Sagittarius", planetSign: "Scorpio", planet: "Ketu", page: 206,
    en: "Spends much, tries to work for stable power for expenditure, bears troubles with heavy expenditure, works courageously",
    ta: "அதிகம் செலவழிப்பார்; செலவு வீட்டில் நிலையான ஆற்றலுக்கு முயல்வார்; அதிகச் செலவால் சிரமங்களைத் தாங்குவார்; தைரியமாக வேலை செய்வார்.",
  },
  {
    house: 12, lagna: "Capricorn", planetSign: "Sagittarius", planet: "Sun", page: 211,
    en: "Has some deficiency in the influence of life, gets weakness in connection with age, spends much, keeps the influence on enemies, faces some difficulties in the house of expenditure, gets some complaints in the stomach below navel",
    ta: "வாழ்வின் செல்வாக்கில் சில குறை; வயதில் பலவீனம்; அதிகம் செலவழிப்பார்; எதிரிகள் மீது செல்வாக்கு; செலவு வீட்டில் சில சிரமங்கள்; தொப்புளுக்குக் கீழ் வயிற்றில் சில புகார்கள்.",
  },
  {
    house: 12, lagna: "Capricorn", planetSign: "Sagittarius", planet: "Moon", page: 213,
    en: "Bears loss in wife's house, deficiency in the side of sexual pleasures, weakness in line of occupation, spends much, bears perplexity about family, works calmly in the house of enemies, gets success in family occupation and expenditure",
    ta: "மனைவி வீட்டில் இழப்பு; பாலியல் இன்பத்தில் குறை; தொழில் வரிசையில் பலவீனம்; அதிகம் செலவழிப்பார்; குடும்பம் பற்றிய மன வேதனை; எதிரி வீட்டில் அமைதியாக வேலை செய்வார்; குடும்ப வேலையிலும் செலவிலும் வெற்றி.",
  },
  {
    house: 12, lagna: "Capricorn", planetSign: "Sagittarius", planet: "Mars", page: 215,
    en: "Bears loss of mother and motherland, gets weakness in income, has deficiency in happiness, gets wife's happiness, gets deficiency in brother's house, spends much, keeps influence in the enemies' house, has deficiency in sexual pleasures",
    ta: "தாயையும் தாய்நாட்டையும் இழப்பார்; வருமானத்தில் பலவீனம்; மகிழ்ச்சியில் குறை; மனைவியின் மகிழ்ச்சி; சகோதரர் வீட்டில் குறை; அதிகம் செலவழிப்பார்; எதிரி வீட்டில் செல்வாக்கு; பாலியல் இன்பத்தில் குறை.",
  },
  {
    house: 12, lagna: "Capricorn", planetSign: "Sagittarius", planet: "Mercury", page: 217,
    en: "Loss in the house of Dharma, spends much, finds delays and worries in the rise of fete",
    ta: "தர்ம வீட்டில் இழப்பு; அதிகம் செலவழிப்பார்; முன்னேற்றத்தில் தாமதமும் கவலையும்.",
  },
  {
    house: 12, lagna: "Capricorn", planetSign: "Sagittarius", planet: "Jupiter", page: 219,
    en: "Spends much, faces some weakness in mother's side, gets deficiency in brothers' house, fails to get grandeur in his daily routine of life, is unable to decrease the expenditure though tries hard for the same, wanders much, and is of restless disposition",
    ta: "அதிகம் செலவழிப்பார்; தாய் வகையில் சில பலவீனம்; சகோதரர் வீட்டில் குறை; தினசரி வாழ்வில் கம்பீரம் பெற முடியாது; செலவைக் குறைக்க முயன்றாலும் முடியாது; அலைந்து திரிபவர்; அமைதியற்ற இயல்பு.",
  },
  {
    house: 12, lagna: "Capricorn", planetSign: "Sagittarius", planet: "Venus", page: 221,
    en: "Spends much, bears the loss of father and son, has deficiency in education, bears loss in business, government and society, manages the expenditure cleverly, and is somewhat inactive and idle",
    ta: "அதிகம் செலவழிப்பார்; தந்தை, மகன் இழப்பு; கல்வியில் குறை; வணிகம், அரசு, சமூகத்தில் இழப்பு; செலவை சாமர்த்தியமாக நிர்வகிப்பார்; சற்று சோம்பலும் செயலின்மையும்.",
  },
  {
    house: 12, lagna: "Capricorn", planetSign: "Sagittarius", planet: "Saturn", page: 223,
    en: "Spends much and lives in other places, gets emaciated body gets wealth through other houses, difficulties for the increase of wealth due to excessive expenditure, and always unhappy",
    ta: "அதிகம் செலவழித்து வேறு இடங்களில் வாழ்வார்; உடல் மெலிவு; மற்ற வீடுகளிலிருந்து செல்வம்; அதிகச் செலவால் செல்வம் பெருக்குவதில் சிரமம்; எப்போதும் அதிருப்தி.",
  },
  {
    house: 12, lagna: "Capricorn", planetSign: "Sagittarius", planet: "Rahu", page: 225,
    en: "Bears some troubles regarding expenditure, manages the expenditure with some shortage, is greedy",
    ta: "செலவு பற்றிய சில சிரமங்கள்; சில குறைவுடன் செலவை நிர்வகிப்பார்; பேராசை.",
  },
  {
    house: 12, lagna: "Capricorn", planetSign: "Sagittarius", planet: "Ketu", page: 227,
    en: "Spends much extravagantly, manages the expenditure with great force, unable to control the expenditure, has blind faith on others",
    ta: "அதிகச் செலவு; பெரும் வீரியத்துடன் செலவை நிர்வகிப்பார்; செலவைக் கட்டுப்படுத்த முடியாது; பிறர் மீது குருட்டு நம்பிக்கை.",
  },
  {
    house: 12, lagna: "Aquarius", planetSign: "Capricorn", planet: "Sun", page: 233,
    en: "Bears loss in the house of wife, gets loss in occupation, has great deficiency in the side of sexual pleasures, gets loss and disturbance in family, has sourness in the house of expenditure, gets the support of some other place in the side of sexual pleasures, keeps influence in the house of enemy, has perplexities like diseases and deficiency of cleverness in the worldly affairs",
    ta: "மனைவி வீட்டில் இழப்பு; தொழிலில் இழப்பு; பாலியல் இன்பத்தில் பெரும் குறை; குடும்பத்தில் இழப்பும் குழப்பமும்; செலவு வீட்டில் கசப்பு; பாலியல் விஷயத்தில் வேறு இடத்தின் ஆதரவு; எதிரி வீட்டில் செல்வாக்கு; நோய்கள் போன்ற குழப்பங்களும் உலக விவகாரங்களில் அறிவுக் குறையும்.",
  },
  {
    house: 12, lagna: "Aquarius", planetSign: "Capricorn", planet: "Moon", page: 235,
    en: "Gets weakness in the house of enemies, gets weakness in influence, uses the secret policies in the enemies' side, faces perplexity due to heavy expenditure, spends over diseases",
    ta: "எதிரி வீட்டில் பலவீனம்; செல்வாக்கில் பலவீனம்; எதிரிகள் பக்கம் மறைமுக உபாயங்கள்; அதிகச் செலவால் குழப்பம்; நோய்களுக்காகச் செலவழிப்பார்.",
  },
  {
    house: 12, lagna: "Aquarius", planetSign: "Capricorn", planet: "Mars", page: 237,
    en: "Spends much, bears loss in the father's house, strange contact of brother, acquires loss in business occupation, uses secret power in the house of enemies, possesses influence in the house of wife, gets the strength in daily occupation and is influential",
    ta: "அதிகம் செலவழிப்பார்; தந்தை வீட்டில் இழப்பு; சகோதரருடன் விசித்திரமான தொடர்பு; தொழிலில் இழப்பு; எதிரி வீட்டில் ரகசிய சக்தி; மனைவி வீட்டில் செல்வாக்கு; தினசரி தொழிலில் வலிமை; செல்வாக்குள்ளவர்.",
  },
  {
    house: 12, lagna: "Aquarius", planetSign: "Capricorn", planet: "Mercury", page: 239,
    en: "Gets the loss of children, gets weakness of education, has weakness in longevity, spends much, feels restlessness in the daily routine of life, maintains equality in the side of enemies",
    ta: "பிள்ளைகளின் இழப்பு; கல்வியில் பலவீனம்; ஆயுளில் பலவீனம்; அதிகம் செலவழிப்பார்; தினசரி வாழ்வில் அமைதியின்மை; எதிரிகளிடம் சம நிலை.",
  },
  {
    house: 12, lagna: "Aquarius", planetSign: "Capricorn", planet: "Jupiter", page: 241,
    en: "Bears loss and deficiency in wealth, manages to curtail expenditure, gets wealth by giving bribe to others, attains influence in enemies' house, faces deficiency and distress in family, gets the gains of buildings and lands, gets the aristocracy in the daily routine of life, does not get good garments or ornaments",
    ta: "செல்வத்தில் இழப்பும் குறையும்; செலவைக் குறைக்க முயல்வார்; மற்றவர்களுக்கு லஞ்சம் கொடுத்துச் செல்வம் பெறுவார்; எதிரி வீட்டில் செல்வாக்கு; குடும்பத்தில் குறையும் துன்பமும்; கட்டிடங்கள், நிலங்களின் ஆதாயம்; தினசரி வாழ்வில் கம்பீரம்; நல்ல உடைகளும் ஆபரணங்களும் கிடைக்காது.",
  },
  {
    house: 12, lagna: "Aquarius", planetSign: "Capricorn", planet: "Venus", page: 243,
    en: "Spends much, gets weakness in destiny, bears loss of mother, has weakness in lands, buildings or residential place, has deficiency in happiness, works politely in the side of enemies",
    ta: "அதிகம் செலவழிப்பார்; விதியில் பலவீனம்; தாயை இழப்பார்; நிலம், கட்டிடம், குடியிருப்பில் பலவீனம்; மகிழ்ச்சியில் குறை; எதிரிகளிடம் பணிவாக வேலை செய்வார்.",
  },
  {
    house: 12, lagna: "Aquarius", planetSign: "Capricorn", planet: "Saturn", page: 245,
    en: "Spends much, gets an emaciated body, pays attention to and rears Dharma, gets honour in foreign places, gets influence in the house of enemies, bears some loss in wealth",
    ta: "அதிகம் செலவழிப்பார்; உடல் மெலிவு; தர்மத்தைக் கவனித்துக் காப்பார்; வெளிநாடுகளில் மரியாதை; எதிரி வீட்டில் செல்வாக்கு; செல்வத்தில் சில இழப்பு.",
  },
  {
    house: 12, lagna: "Aquarius", planetSign: "Capricorn", planet: "Rahu", page: 247,
    en: "Gets the schemes of extravagant expenditure, feces unhappiness on account of expenditure, thinks secretly",
    ta: "ஆடம்பரச் செலவுத் திட்டங்கள்; செலவால் மகிழ்ச்சியின்மை; ரகசியமாக யோசிப்பார்.",
  },
  {
    house: 12, lagna: "Aquarius", planetSign: "Capricorn", planet: "Ketu", page: 249,
    en: "Spends too much, experiences some distress and agony due to reasons of excessive expenditure, uses secret powers, is unable to check the expenditure",
    ta: "அதிகம் செலவழிப்பார்; அதிகச் செலவால் சில துன்பமும் வேதனையும்; ரகசிய சக்திகளைப் பயன்படுத்துவார்; செலவைக் கட்டுப்படுத்த முடியாது.",
  },
  {
    house: 12, lagna: "Pisces", planetSign: "Aquarius", planet: "Sun", page: 254,
    en: "Feels weakness in the house of influence, gets his work done secretly in the house of enemies, faces some trouble with brothers, finds hindrances in the house of managing expenditure, is haughty and full of anger",
    ta: "செல்வாக்கு வீட்டில் பலவீனம்; எதிரி வீட்டில் வேலையை ரகசியமாகச் சாதிப்பார்; சகோதரருடன் சில தொல்லை; செலவு நிர்வாகத்தில் தடைகள்; கர்வமும் கோபமும் நிறைந்தவர்.",
  },
  {
    house: 12, lagna: "Pisces", planetSign: "Aquarius", planet: "Moon", page: 256,
    en: "Bears loss in children's house, gets defects in eyes, faces weakness in the house of education, has a weak memory, is restless, spends much, has some worry in connection with expenditure, acquires influence in enemies' house, fears a little, and is of unstable mind Pisces in 257",
    ta: "பிள்ளைகள் வீட்டில் இழப்பு; கண்களில் குறை; கல்வி வீட்டில் பலவீனம்; நினைவாற்றல் குறைவு; அமைதியின்மை; அதிகம் செலவழிப்பார்; செலவு பற்றி சில கவலை; எதிரி வீட்டில் செல்வாக்கு; சிறிது அச்சம்; நிலையற்ற மனம்.",
  },
  {
    house: 12, lagna: "Pisces", planetSign: "Aquarius", planet: "Mars", page: 258,
    en: "Loses much wealth, feces weakness in destiny, spends much being helpless, has an ordinary relation with brother, gets progress in diumal occupation, gets good luck in wife's house, gets losses in the family, does not observe economy",
    ta: "அதிகம் செல்வம் இழப்பார்; விதியில் பலவீனம்; உதவியற்ற நிலையில் அதிகம் செலவழிப்பார்; சகோதரருடன் சாதாரண உறவு; தினசரி தொழிலில் முன்னேற்றம்; மனைவி வீட்டில் நல்ல அதிர்ஷ்டம்; குடும்பத்தில் இழப்புகள்; சிக்கனத்தைக் கடைப்பிடிக்கமாட்டார்.",
  },
  {
    house: 12, lagna: "Pisces", planetSign: "Aquarius", planet: "Mercury", page: 260,
    en: "Bears some loss in mother's house and in the house of wife, gets some loss in buildings and property, gets some loss in occupation and finds some deficiency in happiness and comforts, has some deficiency in the house of sexual pleasures, spends much pursuing the occupation through foreign contact, gets sexual pleasures through the power of expenditure, gets his work done politely in enemies' house",
    ta: "தாய் வீட்டிலும் மனைவி வீட்டிலும் சில இழப்பு; கட்டிடங்கள், சொத்தில் சில இழப்பு; தொழிலில் சில இழப்பு; இன்பமும் வசதியும் சில குறை; பாலியல் இன்பத்தில் குறை; வெளிநாட்டுத் தொடர்புடன் தொழிலைத் தொடர்ந்து அதிகம் செலவழிப்பார்; செலவின் ஆற்றலால் பாலியல் இன்பம் பெறுவார்; எதிரி வீட்டில் பணிவாக வேலை சாதிப்பார்.",
  },
  {
    house: 12, lagna: "Pisces", planetSign: "Aquarius", planet: "Jupiter", page: 263,
    en: "Bears loss in father's house, gets an emaciated body, is restless, manages the government and society after bearing heavy losses, gets weakness in honour and business, has deficiency in the house of expenditure, spends irreverently, holds influence in the house of enemies",
    ta: "தந்தை வீட்டில் இழப்பு; உடல் மெலிவு; அமைதியின்மை; பெரும் இழப்புகளுக்குப் பின் அரசு, சமூக விவகாரங்களை நிர்வகிப்பார்; மரியாதையிலும் தொழிலிலும் பலவீனம்; செலவு வீட்டில் குறை; கவனக்குறைவாகச் செலவழிப்பார்; எதிரி வீட்டில் செல்வாக்கு.",
  },
  {
    house: 12, lagna: "Pisces", planetSign: "Aquarius", planet: "Venus", page: 265,
    en: "Faces some restlessness in life, bears some losses in age, suffers some restlessness from brothers and sisters, spends much, gets the strength of livelihood, wins the enemies and calamities",
    ta: "வாழ்வில் சில அமைதியின்மை; வயதில் சில இழப்பு; சகோதர சகோதரிகளிடமிருந்து சில அமைதியின்மை; அதிகம் செலவழிப்பார்; வாழ்வாதார வலிமை பெறுவார்; எதிரிகளையும் துன்பங்களையும் வெல்வார்.",
  },
  {
    house: 12, lagna: "Pisces", planetSign: "Aquarius", planet: "Saturn", page: 267,
    en: "Spends much more than he earns, has weakness in connection with wealth, gets restless in family, remains anxious about destiny, maintains influence over the house of enemies, gets victory over difficulties, thinks good for others",
    ta: "வருமானத்தை விட அதிகம் செலவழிப்பார்; செல்வத்தில் பலவீனம்; குடும்பத்தில் அமைதியின்மை; விதியைப் பற்றிக் கவலை; எதிரி வீட்டில் செல்வாக்கு; துன்பங்களை வெல்வார்; மற்றவர்களுக்கு நல்லது நினைப்பார்.",
  },
  {
    house: 12, lagna: "Pisces", planetSign: "Aquarius", planet: "Rahu", page: 269,
    en: "Spends too much, finds perplexity in the house of expenditure, gets his work done very cleverly through secret devices with the help of other people in the line of occupation, feels nervousness in the house of expenditure",
    ta: "அதிகம் செலவழிப்பார்; செலவு வீட்டில் குழப்பம்; தொழில் துறையில் பிறர் உதவியுடன் ரகசிய உபாயங்களால் வேலையை சாமர்த்தியமாகச் சாதிப்பார்; செலவு வீட்டில் நடுக்கம்.",
  },
  {
    house: 12, lagna: "Pisces", planetSign: "Aquarius", planet: "Ketu", page: 271,
    en: "Faces some trouble in the house of expenditure, manages expenditure after labouring very hard and faces some severe troubles, succeeds due to secret strength",
    ta: "செலவு வீட்டில் சில சிரமம்; கடினமாக உழைத்து செலவை நிர்வகிப்பார், பெரும் துன்பங்களையும் சந்திப்பார்; ரகசிய வலிமையால் வெற்றி.",
  },
];

module.exports = { PLANET_IN_HOUSE };
