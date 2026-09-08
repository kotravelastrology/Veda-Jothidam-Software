// Classical References Database for Vedic Astrology
// Complete collection of classical texts and definitions

export interface ClassicalText {
  id: string;
  title: string;
  titleTamil: string;
  author: string;
  century: string;
  category: 'text' | 'yoga' | 'nakshatra' | 'planet' | 'house' | 'rashi';
  content: string;
  contentTamil?: string;
  citations?: string[];
  tags: string[];
}

export interface YogaDefinition extends ClassicalText {
  type: 'auspicious' | 'inauspicious' | 'neutral';
  effects: string[];
  timing: string;
  remedies?: string[];
}

export interface NakshatraInfo extends ClassicalText {
  number: number;
  lord: string;
  symbol: string;
  traits: string[];
  profession: string[];
  remedyStone?: string;
  remedyMantra?: string;
}

// BPHS Excerpts
export const BPHS_REFERENCES: ClassicalText[] = [
  {
    id: 'bphs_001',
    title: 'On the Sun (Surya)',
    titleTamil: 'சூரியனைப் பற்றி',
    author: 'Parashara',
    century: '4th Century CE',
    category: 'planet',
    content: `The Sun represents the soul, consciousness, life force, and vital energy. It signifies authority, leadership,
self-confidence, and willpower. The Sun rules the sign Leo and is exalted in Aries. It governs the father, government positions,
and public life. The Sun's placement indicates one's ability to lead and their inherent vitality.`,
    contentTamil: `சூரியன் ஆத்மா, சேதனை, வாழ்வு சக்தி மற்றும் முக்கிய ஆற்றலைக் குறிக்கிறது. இது அதிகாரம், தலைமை,
சுய நம்பிக்கை மற்றும் இச்஛ை சக்தியை குறிக்கிறது.`,
    citations: ['BPHS 2.1-2.15'],
    tags: ['sun', 'atma', 'soul', 'authority', 'father'],
  },
  {
    id: 'bphs_002',
    title: 'On the Moon (Chandra)',
    titleTamil: 'சந்திரனைப் பற்றி',
    author: 'Parashara',
    century: '4th Century CE',
    category: 'planet',
    content: `The Moon represents the mind, emotions, inner peace, and psychological stability. It signifies the mother,
fertility, nurturing, and comfort. The Moon rules Cancer and is exalted in Taurus. It indicates one's emotional nature,
instincts, and capacity for imagination. A strong Moon ensures mental peace and family happiness.`,
    contentTamil: `சந்திரன் மனதை, உணர்ச்சிகளை, உள் சாந்தி மற்றும் உளவியல் நிலைத்தன்மையைக் குறிக்கிறது.`,
    citations: ['BPHS 3.1-3.20'],
    tags: ['moon', 'mind', 'emotions', 'mother', 'fertility'],
  },
];

// Yoga Definitions
export const YOGA_DEFINITIONS: YogaDefinition[] = [
  {
    id: 'yoga_001',
    title: 'Raj Yoga',
    titleTamil: 'ராஜ யோகம்',
    author: 'Parashara',
    century: '4th Century CE',
    category: 'yoga',
    type: 'auspicious',
    content: `Raj Yoga is formed when the lord of the lagna is in conjunction with or aspected by the lords of the
9th or 10th houses. This yoga indicates kingship, authority, and political power. Natives with Raj Yoga enjoy success,
respect, and material prosperity. They are known for their leadership qualities and ability to command respect.`,
    contentTamil: `ராஜ யோகம் உருவாகிறது உச்சக்கை குறிக்கும் கிரக தலைவன் 9 அல்லது 10 ஆம் வீட்டு தலைவனுடன்
இணைந்தோ அல்லது வலிமை பெற்றிருக்கும்போது.`,
    effects: ['Kingship and authority', 'Political power', 'Success and prosperity', 'Respect and honor'],
    timing: 'During the Dasha of the planets involved',
    citations: ['BPHS 45.1-45.10'],
    tags: ['yoga', 'auspicious', 'raja', 'authority', 'power'],
  },
  {
    id: 'yoga_002',
    title: 'Gajakesari Yoga',
    titleTamil: 'கஜகேசரி யோகம்',
    author: 'Parashara',
    century: '4th Century CE',
    category: 'yoga',
    type: 'auspicious',
    content: `Gajakesari Yoga is formed when Jupiter is in the center house (Kendra) from the Moon. This yoga grants
intelligence, wisdom, strong memory, and eloquence. Natives are respected for their knowledge and communication skills.
It brings prosperity, good health, and long life.`,
    effects: ['Intelligence and wisdom', 'Strong memory', 'Eloquence', 'Prosperity', 'Good health'],
    timing: 'Throughout life, strengthened during Jupiter Dasha',
    citations: ['BPHS 46.5-46.8'],
    tags: ['yoga', 'auspicious', 'gajakesari', 'wisdom', 'intelligence'],
  },
];

// Nakshatra Information
export const NAKSHATRA_INFO: NakshatraInfo[] = [
  {
    id: 'nakshatra_001',
    title: 'Ashwini',
    titleTamil: 'அஸ்வினி',
    number: 1,
    author: 'Vedic Astronomy',
    century: 'Ancient',
    category: 'nakshatra',
    lord: 'Ketu',
    symbol: 'Horse',
    content: `Ashwini is the first nakshatra, located in Aries. It represents new beginnings, healing, and swift movement.
Natives are energetic, adventurous, and quick-witted. They make good physicians and healers. Ashwini Nakshatra is known
for its healing properties and quick action.`,
    contentTamil: `அஸ்வினி முதல் நட்சத்திரம் ஆரியம் (மேஷம்) ராசியில் உள்ளது. இது புதிய தொடக்கம்,
சுகவைத்தியம் மற்றும் வேகமான இயக்கத்தைக் குறிக்கிறது.`,
    traits: ['Adventurous', 'Quick-witted', 'Healing ability', 'Energetic'],
    profession: ['Physician', 'Healer', 'Surgeon', 'Veterinarian'],
    remedyStone: 'Ruby',
    remedyMantra: 'Om Aśvinībhyām Namaha',
    citations: ['Jyotish Classics'],
    tags: ['nakshatra', 'aries', 'ketu', 'healing'],
  },
  {
    id: 'nakshatra_002',
    title: 'Bharani',
    titleTamil: 'பரணி',
    number: 2,
    author: 'Vedic Astronomy',
    century: 'Ancient',
    category: 'nakshatra',
    lord: 'Venus',
    symbol: 'Womb',
    content: `Bharani is the second nakshatra, located in Aries. It represents responsibility, endurance, and fertility.
Natives are determined and creative. They have strong will power and can handle difficult situations. Bharani represents
the yoni of creation and transformation.`,
    contentTamil: `பரணி இரண்டாவது நட்சத்திரம், ஆரியம் ராசியில் உள்ளது.`,
    traits: ['Responsible', 'Determined', 'Creative', 'Enduring'],
    profession: ['Artist', 'Teacher', 'Counselor', 'Judge'],
    remedyStone: 'Diamond',
    remedyMantra: 'Om Bharaniyai Namaha',
    citations: ['Jyotish Classics'],
    tags: ['nakshatra', 'aries', 'venus', 'fertility'],
  },
];

// Planetary Significations
export const PLANETARY_SIGNIFICATIONS: ClassicalText[] = [
  {
    id: 'planet_sig_sun',
    title: 'Sun Significations',
    titleTamil: 'சூரிய பலன்கள்',
    author: 'Classical Texts',
    century: 'Ancient',
    category: 'planet',
    content: `Soul, life, consciousness, father, authority, government, Leo sign, health, vitality, golden, day,
summer season, directions: east, metals: gold, gems: ruby, diseases of the heart and eyes.`,
    citations: ['Multiple Classical Sources'],
    tags: ['sun', 'significations', 'soul', 'father'],
  },
  {
    id: 'planet_sig_moon',
    title: 'Moon Significations',
    titleTamil: 'சந்திர பலன்கள்',
    author: 'Classical Texts',
    century: 'Ancient',
    category: 'planet',
    content: `Mind, emotions, mother, milk, water, Cancer sign, fertility, fluids, night, lunar month, white color,
silver metal, pearl gem, tides, seasons, early childhood, travel, navigation, psychological stability.`,
    citations: ['Multiple Classical Sources'],
    tags: ['moon', 'significations', 'mind', 'mother'],
  },
];

// House Meanings
export const HOUSE_MEANINGS: ClassicalText[] = [
  {
    id: 'house_01',
    title: '1st House - Lagna',
    titleTamil: '1வது வீடு - லக்னம்',
    author: 'Classical Texts',
    century: 'Ancient',
    category: 'house',
    content: `The Lagna or 1st house represents the self, body, physical appearance, personality, and life span.
It shows the native's nature, disposition, and general health. Strong lagna indicates good life and success.
The lagna lord's position determines major life themes.`,
    citations: ['BPHS', 'Saravali'],
    tags: ['house', 'lagna', '1st', 'self', 'personality'],
  },
  {
    id: 'house_07',
    title: '7th House - Maraka',
    titleTamil: '7வது வீடு - பത்தாம் நிலை',
    author: 'Classical Texts',
    century: 'Ancient',
    category: 'house',
    content: `The 7th house represents marriage, spouse, partnerships, relationships, and sexual life.
It indicates business partnerships and legal contracts. The 7th house lord's condition shows marriage prospects.
Benefics here bring harmony in marriage and good spouse.`,
    citations: ['BPHS', 'Saravali'],
    tags: ['house', '7th', 'marriage', 'spouse', 'partnership'],
  },
];

// Rashi Descriptions
export const RASHI_DESCRIPTIONS: ClassicalText[] = [
  {
    id: 'rashi_01',
    title: 'Aries (Mesha)',
    titleTamil: 'மேஷம்',
    author: 'Classical Texts',
    century: 'Ancient',
    category: 'rashi',
    content: `Aries is the first fire sign, ruled by Mars. It represents courage, leadership, independence, and initiative.
Aries natives are bold, competitive, and pioneering. They love challenges and new adventures. Mesha is ruled by Mars,
making natives passionate, energetic, and sometimes aggressive. Good for leadership and military positions.`,
    citations: ['Classical Astrology'],
    tags: ['rashi', 'aries', 'mesha', 'fire', 'mars'],
  },
  {
    id: 'rashi_07',
    title: 'Libra (Tula)',
    titleTamil: 'துலாம்',
    author: 'Classical Texts',
    century: 'Ancient',
    category: 'rashi',
    content: `Libra is the first air sign, ruled by Venus. It represents balance, harmony, justice, and relationship.
Libra natives are diplomatic, artistic, and social. They value peace and fairness. Tula is known for weighing both sides,
making natives excellent judges, counselors, and arbitrators. Good for arts, law, and business.`,
    citations: ['Classical Astrology'],
    tags: ['rashi', 'libra', 'tula', 'air', 'venus'],
  },
];

// Complete Reference Database
export const CLASSICAL_REFERENCES_DB = {
  bphs: BPHS_REFERENCES,
  yogas: YOGA_DEFINITIONS,
  nakshatras: NAKSHATRA_INFO,
  planets: PLANETARY_SIGNIFICATIONS,
  houses: HOUSE_MEANINGS,
  rashis: RASHI_DESCRIPTIONS,
};

// Search Index for Full-Text Search
export function searchReferences(query: string, category?: string): ClassicalText[] {
  const allReferences = [
    ...BPHS_REFERENCES,
    ...YOGA_DEFINITIONS,
    ...NAKSHATRA_INFO,
    ...PLANETARY_SIGNIFICATIONS,
    ...HOUSE_MEANINGS,
    ...RASHI_DESCRIPTIONS,
  ];

  const lowerQuery = query.toLowerCase();
  return allReferences.filter((ref) => {
    const matchesQuery =
      ref.title.toLowerCase().includes(lowerQuery) ||
      ref.titleTamil?.toLowerCase().includes(lowerQuery) ||
      ref.content.toLowerCase().includes(lowerQuery) ||
      ref.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

    const matchesCategory = !category || ref.category === category;
    return matchesQuery && matchesCategory;
  });
}

// Export functions for accessing specific references
export function getNakshatraInfo(number: number): NakshatraInfo | undefined {
  return NAKSHATRA_INFO.find(n => n.number === number);
}

export function getYogaInfo(yogaName: string): YogaDefinition | undefined {
  return YOGA_DEFINITIONS.find(y =>
    y.title.toLowerCase().includes(yogaName.toLowerCase())
  );
}
