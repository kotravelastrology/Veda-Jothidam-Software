// Transit Calculator Service
// Calculates planetary positions and transit effects

export interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
  minute: number;
  second: number;
  nakshatra: string;
  nakshatraDegree: number;
  isRetrograde: boolean;
  speed: number; // degrees per day
}

export interface TransitData {
  date: string;
  time: string;
  planets: PlanetPosition[];
  lunarPhase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  lunarAge: number; // 0-29.5 days
  tithi: string;
  hora: string;
  vaara: string; // day of week
}

export interface TransitEffect {
  planet: string;
  natalSign: string;
  currentSign: string;
  house: string;
  aspectedPlanets: string[];
  strength: 'strong' | 'moderate' | 'weak';
  effect: 'beneficial' | 'neutral' | 'challenging';
  interpretation: string;
  duration: string;
}

export class TransitCalculator {
  // Zodiac signs in order
  private static readonly SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  // Nakshatras (27 lunar mansions)
  private static readonly NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Kritika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Abhijit', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  // Planets and their daily speeds (degrees per day - approximate)
  private static readonly PLANET_SPEEDS: Record<string, number> = {
    'Sun': 0.98,
    'Moon': 13.2,
    'Mercury': 1.02,
    'Venus': 1.19,
    'Mars': 0.52,
    'Jupiter': 0.08,
    'Saturn': 0.03,
    'Rahu': -0.05,
    'Ketu': -0.05,
  };

  /**
   * Calculate transit positions for a given date
   */
  static calculateTransits(date: Date, natalChart?: any): TransitData {
    const time = date.toISOString().split('T')[1].slice(0, 5);
    const planets = this.calculatePlanetPositions(date);
    const lunarData = this.calculateLunarData(date);
    const tithi = this.calculateTithi(date);
    const hora = this.calculateHora(date);
    const vaara = this.calculateVaara(date);

    return {
      date: date.toISOString().split('T')[0],
      time,
      planets,
      lunarPhase: lunarData.phase,
      lunarAge: lunarData.age,
      tithi,
      hora,
      vaara,
    };
  }

  /**
   * Calculate planetary positions for a given date (simplified ephemeris)
   */
  private static calculatePlanetPositions(date: Date): PlanetPosition[] {
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'];
    const positions: PlanetPosition[] = [];

    // Base positions (simplified - would use actual ephemeris data)
    const daysSinceEpoch = this.daysSinceEpoch(date);
    const basePositions: Record<string, number> = {
      'Sun': 280.46,
      'Moon': 218.32,
      'Mercury': 203.18,
      'Venus': 181.98,
      'Mars': 353.43,
      'Jupiter': 34.40,
      'Saturn': 50.08,
      'Rahu': 123.92,
      'Ketu': 303.92,
    };

    planets.forEach(planet => {
      const speed = this.PLANET_SPEEDS[planet] || 0;
      const degree = (basePositions[planet] + speed * daysSinceEpoch) % 360;

      const signIndex = Math.floor(degree / 30);
      const degreeInSign = degree % 30;
      const minute = (degreeInSign % 1) * 60;
      const second = (minute % 1) * 60;

      // Determine if retrograde (simplified)
      const isRetrograde = this.isRetrograde(planet, date);

      // Calculate nakshatra position
      const nakshatraIndex = Math.floor((degree % 360) / (360 / 27));
      const nakshatraDegree = ((degree % 360) / (360 / 27)) % 1;

      positions.push({
        planet,
        sign: this.SIGNS[signIndex],
        degree: Math.floor(degreeInSign),
        minute: Math.floor(minute),
        second: Math.floor(second),
        nakshatra: this.NAKSHATRAS[nakshatraIndex],
        nakshatraDegree: Math.round(nakshatraDegree * 100) / 100,
        isRetrograde,
        speed: Math.round(speed * 100) / 100,
      });
    });

    return positions;
  }

  /**
   * Calculate lunar phase and age
   */
  private static calculateLunarData(date: Date): { phase: TransitData['lunarPhase']; age: number } {
    // Using simplified lunar calculation
    const knownNewMoon = new Date('2000-01-06');
    const synodicMonth = 29.53;
    const daysSince = (date.getTime() - knownNewMoon.getTime()) / (24 * 60 * 60 * 1000);
    const age = daysSince % synodicMonth;

    let phase: TransitData['lunarPhase'] = 'new';
    if (age < 1.84) phase = 'new';
    else if (age < 7.38) phase = 'waxing-crescent';
    else if (age < 9.23) phase = 'first-quarter';
    else if (age < 14.77) phase = 'waxing-gibbous';
    else if (age < 16.61) phase = 'full';
    else if (age < 22.15) phase = 'waning-gibbous';
    else if (age < 23.99) phase = 'last-quarter';
    else phase = 'waning-crescent';

    return { phase, age: Math.round(age * 100) / 100 };
  }

  /**
   * Calculate tithi (lunar day)
   */
  private static calculateTithi(date: Date): string {
    const lunarAge = this.calculateLunarData(date).age;
    const tithi = Math.floor(lunarAge / (29.53 / 30)); // 30 tithis in a lunar month

    const tithiNames = [
      'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
      'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
    ];

    const phaseLabel = this.calculateLunarData(date).age > 14.76 ? 'Krishna' : 'Shukla';
    return `${phaseLabel} ${tithiNames[tithi]}`;
  }

  /**
   * Calculate hora (planetary hour)
   */
  private static calculateHora(date: Date): string {
    const vaara = this.calculateVaara(date);
    const hours = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];

    const varaIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(vaara);
    const hourOfDay = date.getHours();
    const horaIndex = (varaIndex + hourOfDay) % 7;

    return `${hours[horaIndex]} Hora`;
  }

  /**
   * Calculate day of week (Vaara)
   */
  private static calculateVaara(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  /**
   * Check if planet is retrograde
   */
  private static isRetrograde(planet: string, date: Date): boolean {
    // Simplified retrograde calculation
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

    const retrogradeRanges: Record<string, [number, number][]> = {
      'Mercury': [[77, 109], [229, 260]],
      'Venus': [[130, 160]],
      'Mars': [[15, 78]],
      'Jupiter': [[245, 290]],
      'Saturn': [[120, 170]],
    };

    const ranges = retrogradeRanges[planet];
    if (!ranges) return false;

    return ranges.some(([start, end]) => dayOfYear >= start && dayOfYear <= end);
  }

  /**
   * Calculate days since epoch
   */
  private static daysSinceEpoch(date: Date): number {
    const epoch = new Date('2000-01-01');
    return Math.floor((date.getTime() - epoch.getTime()) / (24 * 60 * 60 * 1000));
  }

  /**
   * Analyze transit effects on natal chart
   */
  static analyzeTransitEffects(transitData: TransitData, natalPlanets: Record<string, any>): TransitEffect[] {
    const effects: TransitEffect[] = [];

    transitData.planets.forEach(transitPlanet => {
      const natalSign = natalPlanets[transitPlanet.planet]?.sign;
      if (!natalSign) return;

      // Calculate house based on lagna
      const lagna = natalPlanets['Lagna']?.sign;
      const signDifference = this.SIGNS.indexOf(transitPlanet.sign) - this.SIGNS.indexOf(lagna);
      const house = ((signDifference + 12) % 12) + 1;

      // Determine strength
      let strength: 'strong' | 'moderate' | 'weak' = 'moderate';
      if (transitPlanet.nakshatra === 'Pushya' || transitPlanet.nakshatra === 'Hasta') strength = 'strong';
      if (transitPlanet.nakshatra === 'Ashlesha' || transitPlanet.nakshatra === 'Mula') strength = 'weak';

      // Determine effect
      let effect: 'beneficial' | 'neutral' | 'challenging' = 'neutral';
      if (['Jupiter', 'Venus', 'Mercury'].includes(transitPlanet.planet)) effect = 'beneficial';
      if (['Saturn', 'Mars'].includes(transitPlanet.planet)) effect = 'challenging';

      effects.push({
        planet: transitPlanet.planet,
        natalSign,
        currentSign: transitPlanet.sign,
        house: `${house}${this.getHouseName(house)}`,
        aspectedPlanets: this.findAspectedPlanets(transitPlanet, natalPlanets),
        strength,
        effect,
        interpretation: this.getTransitInterpretation(transitPlanet, natalSign),
        duration: this.estimateTransitDuration(transitPlanet.planet),
      });
    });

    return effects;
  }

  /**
   * Find planets aspected by the transit planet
   */
  private static findAspectedPlanets(transitPlanet: PlanetPosition, natalPlanets: Record<string, any>): string[] {
    const aspectedPlanets: string[] = [];
    const orb = 8; // degrees

    const transitDegree = transitPlanet.degree + (transitPlanet.minute / 60);
    const aspects: Record<string, number[]> = {
      'Sun': [0, 180],
      'Moon': [0, 180],
      'Mercury': [0, 90, 180],
      'Venus': [0, 90, 180],
      'Mars': [0, 90, 180],
      'Jupiter': [0, 60, 120, 180],
      'Saturn': [0, 90, 120, 180],
    };

    Object.entries(natalPlanets).forEach(([planet, data]) => {
      if (!aspects[transitPlanet.planet]) return;

      const natalDegree = data.degree + (data.minute / 60);
      const aspectAngles = aspects[transitPlanet.planet];

      aspectAngles.forEach(angle => {
        const difference = Math.abs(transitDegree - natalDegree);
        if (Math.abs(difference - angle) <= orb) {
          aspectedPlanets.push(planet);
        }
      });
    });

    return aspectedPlanets;
  }

  /**
   * Get house name suffix
   */
  private static getHouseName(house: number): string {
    const names = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
    return names[house - 1] || 'th';
  }

  /**
   * Generate transit interpretation
   */
  private static getTransitInterpretation(planet: PlanetPosition, natalSign: string): string {
    const interpretations: Record<string, string> = {
      'Sun': 'Energizes personality and vitality. Time for new initiatives and self-assertion.',
      'Moon': 'Influences emotions and daily experiences. Sensitive period for personal matters.',
      'Mercury': 'Enhances communication and intellectual pursuits. Good for learning and writing.',
      'Venus': 'Brings harmony in relationships. Favorable for social activities and creativity.',
      'Mars': 'Increases energy and courage. Good for starting projects but avoid impulsiveness.',
      'Jupiter': 'Expands opportunities and brings luck. Favorable for growth and long-term projects.',
      'Saturn': 'Tests discipline and teaches lessons. Focus on responsibilities and long-term gains.',
      'Rahu': 'Brings excitement and unconventional experiences. Follow intuition and inner growth.',
      'Ketu': 'Spiritual focus and detachment. Time for introspection and spiritual practices.',
    };

    return interpretations[planet.planet] || 'Transit influence pending detailed analysis.';
  }

  /**
   * Estimate transit duration
   */
  private static estimateTransitDuration(planet: string): string {
    const durations: Record<string, string> = {
      'Sun': '30 days',
      'Moon': '2-3 days',
      'Mercury': '14-60 days',
      'Venus': '23-60 days',
      'Mars': '30-45 days',
      'Jupiter': '1 year',
      'Saturn': '2-3 years',
      'Rahu': '18 months',
      'Ketu': '18 months',
    };

    return durations[planet] || 'Variable';
  }
}
