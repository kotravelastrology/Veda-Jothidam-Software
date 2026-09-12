// Bhava Chakra (House System) - 12 houses with strength analysis
// Each house represents life areas; strength comes from planets, aspects, and rulers

const BHAVA_HOUSES = [
  { number: 1, name: 'Lagna (Self)', domainEn: 'Self, personality, body', domainTa: 'சுய, ஆளுமை, உடல்' },
  { number: 2, name: 'Dhana (Wealth)', domainEn: 'Wealth, family, speech', domainTa: 'செல்வம், குடும்பம், பேச்சு' },
  { number: 3, name: 'Sahaja (Siblings)', domainEn: 'Siblings, courage, communication', domainTa: 'சகோதரர், தைரியம், தொடர்பு' },
  { number: 4, name: 'Sukha (Mother)', domainEn: 'Mother, home, property, peace', domainTa: 'தாய், வீடு, சொத்து, அமைதி' },
  { number: 5, name: 'Putra (Children)', domainEn: 'Children, creativity, speculation', domainTa: 'குழந்தைகள், படைப்பு, சூது' },
  { number: 6, name: 'Ari (Enemies)', domainEn: 'Enemies, health, debts, service', domainTa: 'எதிரிகள், உடல்நலம், கடன், சேவை' },
  { number: 7, name: 'Yati (Partner)', domainEn: 'Spouse, business partner, public image', domainTa: 'மணைவி, ব্যবসায় பার্টনার, பொது' },
  { number: 8, name: 'Randhra (Death)', domainEn: 'Longevity, transformation, occult', domainTa: 'ஆயுள், மாற்றம், மர்மமான' },
  { number: 9, name: 'Dharma (Fortune)', domainEn: 'Luck, religion, father, travel', domainTa: 'அதிர்ஷ்ட, மதம், தந்தை, பயணம்' },
  { number: 10, name: 'Karma (Profession)', domainEn: 'Career, status, authority', domainTa: 'கரணம், நிலை, ஆணை' },
  { number: 11, name: 'Labha (Gains)', domainEn: 'Gains, friendships, wishes', domainTa: 'ஆதாயம், நட்பு, விருப்பம்' },
  { number: 12, name: 'Vyaya (Loss)', domainEn: 'Loss, expenses, foreign lands, liberation', domainTa: 'இழப்பு, செலவு, வெளிநாடு' }
];

const HOUSE_SIGN_MAPPING = [
  { house: 1, sign: 0, signName: 'Aries', rashiEn: 'Mesha' },
  { house: 2, sign: 1, signName: 'Taurus', rashiEn: 'Vrishabha' },
  { house: 3, sign: 2, signName: 'Gemini', rashiEn: 'Mithuna' },
  { house: 4, sign: 3, signName: 'Cancer', rashiEn: 'Kataka' },
  { house: 5, sign: 4, signName: 'Leo', rashiEn: 'Simha' },
  { house: 6, sign: 5, signName: 'Virgo', rashiEn: 'Kanya' },
  { house: 7, sign: 6, signName: 'Libra', rashiEn: 'Tula' },
  { house: 8, sign: 7, signName: 'Scorpio', rashiEn: 'Vrischika' },
  { house: 9, sign: 8, signName: 'Sagittarius', rashiEn: 'Dhanu' },
  { house: 10, sign: 9, signName: 'Capricorn', rashiEn: 'Makara' },
  { house: 11, sign: 10, signName: 'Aquarius', rashiEn: 'Kumbha' },
  { house: 12, sign: 11, signName: 'Pisces', rashiEn: 'Meena' }
];

function calculateHouseStrength(house, grahas, houseRuler) {
  let strength = 30; // Base strength

  // Planets in house add strength
  const planetsInHouse = Object.values(grahas).filter(g => g.house === house.number);
  strength += planetsInHouse.length * 15;

  // Beneficial planets add more
  const benefics = ['Sun', 'Mercury', 'Jupiter', 'Venus'];
  const malefics = ['Mars', 'Saturn', 'Rahu', 'Ketu'];

  for (const graha of planetsInHouse) {
    if (benefics.includes(graha.name)) strength += 10;
    if (malefics.includes(graha.name)) strength -= 8;
  }

  // House ruler strength (if in good placement)
  if (houseRuler && houseRuler.house <= 5) {
    strength += 15;
  } else if (houseRuler && houseRuler.house >= 8 && houseRuler.house <= 12) {
    strength -= 10;
  }

  // Cap at 100
  return Math.min(100, Math.max(0, strength));
}

function calculateBhavaChakra(grahas) {
  // Calculate house placement for each graha (simplified: based on longitude)
  const grahaCopy = {};
  for (const [name, data] of Object.entries(grahas)) {
    const houseNum = Math.floor(data.longitude / 30) + 1;
    grahaCopy[name] = {
      name,
      longitude: data.longitude,
      house: houseNum > 12 ? 12 : houseNum,
      degreesInHouse: data.longitude % 30
    };
  }

  // Calculate strength for each house
  const houses = [];
  for (const bhava of BHAVA_HOUSES) {
    const planetsHere = Object.values(grahaCopy).filter(g => g.house === bhava.number);
    const houseRuler = Object.values(grahaCopy).find(g => g.house === bhava.number && ['Sun', 'Jupiter', 'Mars'].includes(g.name));

    const strength = calculateHouseStrength(bhava, grahaCopy, houseRuler);

    houses.push({
      number: bhava.number,
      name: bhava.name,
      domainEn: bhava.domainEn,
      domainTa: bhava.domainTa,
      strength,
      planetsHere: planetsHere.map(p => p.name)
    });
  }

  // Planetary placements by graha
  const planetaryPlacements = {};
  for (const [name, data] of Object.entries(grahaCopy)) {
    planetaryPlacements[name] = {
      name,
      house: data.house,
      longitude: data.longitude,
      degreesInHouse: data.degreesInHouse,
      houseSignName: HOUSE_SIGN_MAPPING[data.house - 1].signName
    };
  }

  // House relationships (trine, square, opposition)
  const houseRelationships = [];
  for (let h = 1; h <= 12; h++) {
    const trine1 = h + 4 > 12 ? h + 4 - 12 : h + 4; // 5th house aspect
    const trine2 = h + 8 > 12 ? h + 8 - 12 : h + 8; // 9th house aspect
    const opposition = h + 6 > 12 ? h + 6 - 12 : h + 6; // 7th house aspect
    const square1 = h + 3 > 12 ? h + 3 - 12 : h + 3; // 4th house
    const square2 = h + 10 > 12 ? h + 10 - 12 : h + 10; // 11th house

    houseRelationships.push(
      { from: h, to: trine1, type: 'trine' },
      { from: h, to: trine2, type: 'trine' },
      { from: h, to: opposition, type: 'opposition' },
      { from: h, to: square1, type: 'square' },
      { from: h, to: square2, type: 'square' }
    );
  }

  return {
    houses,
    planetaryPlacements,
    houseRelationships,
    source: {
      title: 'Brihat Parashara Hora Shastra',
      author: 'Sage Parashara',
      chapter: 'Bhava Chakra Analysis'
    }
  };
}

module.exports = {
  BHAVA_HOUSES,
  HOUSE_SIGN_MAPPING,
  calculateBhavaChakra
};
