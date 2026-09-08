// Transit Analysis and Interpretation Engine
// Provides detailed interpretation of planetary transit effects

import { TransitData, PlanetPosition } from './TransitCalculator';

export interface TransitInterpretation {
  planet: string;
  period: string;
  currentPosition: string;
  natalPosition: string;
  relationship: string;
  keyThemes: string[];
  opportunities: string[];
  challenges: string[];
  recommendations: string[];
  overallTone: 'very positive' | 'positive' | 'neutral' | 'challenging' | 'very challenging';
}

export interface TransitReport {
  date: string;
  summary: string;
  keyPlanets: string[];
  overallVibe: string;
  interpretations: TransitInterpretation[];
  weeklyGuidance: string;
  practicalAdvice: string[];
}

export class TransitAnalyzer {
  /**
   * Analyze transits and provide comprehensive interpretation
   */
  static analyzeTransits(
    transitData: TransitData,
    natalChart: Record<string, any>
  ): TransitReport {
    const interpretations: TransitInterpretation[] = [];
    const keyPlanets: string[] = [];

    // Analyze each planet's transit
    transitData.planets.forEach(planet => {
      const natalPosition = natalChart[planet.planet];
      if (!natalPosition) return;

      const interpretation = this.interpretPlanetaryTransit(
        planet,
        natalPosition,
        transitData
      );

      interpretations.push(interpretation);

      // Track important transits
      if (interpretation.overallTone.includes('positive') || interpretation.overallTone.includes('challenging')) {
        keyPlanets.push(planet.planet);
      }
    });

    // Generate overall report
    const summary = this.generateSummary(interpretations);
    const overallVibe = this.determineOverallVibe(interpretations);
    const weeklyGuidance = this.generateWeeklyGuidance(interpretations);
    const practicalAdvice = this.generatePracticalAdvice(interpretations);

    return {
      date: transitData.date,
      summary,
      keyPlanets: [...new Set(keyPlanets)],
      overallVibe,
      interpretations,
      weeklyGuidance,
      practicalAdvice,
    };
  }

  /**
   * Interpret individual planetary transit
   */
  private static interpretPlanetaryTransit(
    transitPlanet: PlanetPosition,
    natalPosition: any,
    transitData: TransitData
  ): TransitInterpretation {
    const planet = transitPlanet.planet;
    const natalSign = natalPosition.sign;
    const currentSign = transitPlanet.sign;
    const isRetrograde = transitPlanet.isRetrograde;

    // Determine if same sign (conjunction) or opposite
    const sameSign = natalSign === currentSign;
    const opposite = this.isOpposite(natalSign, currentSign);

    let overallTone: InterpretationOverallTone = 'neutral';
    let relationship = 'in transit';

    if (sameSign) {
      relationship = 'conjunct with natal position';
      overallTone = this.getConjunctionTone(planet);
    } else if (opposite) {
      relationship = 'in opposition to natal position';
      overallTone = this.getOppositionTone(planet);
    }

    if (isRetrograde) {
      overallTone = this.adjustToneForRetrogradeAsType(overallTone, planet);
    }

    const keyThemes = this.getKeyThemes(planet, relationship);
    const opportunities = this.getOpportunities(planet, currentSign, relationship);
    const challenges = this.getChallenges(planet, currentSign, relationship);
    const recommendations = this.getRecommendations(planet, overallTone);

    return {
      planet,
      period: this.estimatePeriod(planet),
      currentPosition: `${currentSign} ${transitPlanet.degree}°`,
      natalPosition: `${natalSign} ${natalPosition.degree}°`,
      relationship,
      keyThemes,
      opportunities,
      challenges,
      recommendations,
      overallTone,
    };
  }

  /**
   * Determine conjunction tone
   */
  private static getConjunctionTone(planet: string): InterpretationOverallTone {
    const benefics = ['Sun', 'Moon', 'Mercury', 'Venus', 'Jupiter'];
    const malefics = ['Mars', 'Saturn', 'Rahu', 'Ketu'];

    if (benefics.includes(planet)) return 'positive';
    if (malefics.includes(planet)) return 'challenging';
    return 'neutral';
  }

  /**
   * Determine opposition tone
   */
  private static getOppositionTone(planet: string): InterpretationOverallTone {
    const benefics = ['Sun', 'Moon', 'Mercury', 'Venus', 'Jupiter'];
    const malefics = ['Mars', 'Saturn', 'Rahu', 'Ketu'];

    if (benefics.includes(planet)) return 'neutral';
    if (malefics.includes(planet)) return 'very challenging';
    return 'challenging';
  }

  /**
   * Adjust tone for retrograde motion
   */
  private static adjustToneForRetrogradeAsType(
    tone: InterpretationOverallTone,
    planet: string
  ): InterpretationOverallTone {
    // Retrograde often brings introspection and delays
    const delayPlanets = ['Mercury', 'Venus', 'Mars', 'Jupiter'];

    if (delayPlanets.includes(planet)) {
      if (tone === 'positive') return 'neutral';
      if (tone === 'neutral') return 'challenging';
      return tone;
    }

    return tone;
  }

  /**
   * Check if two signs are opposite
   */
  private static isOpposite(sign1: string, sign2: string): boolean {
    const opposites: Record<string, string> = {
      'Aries': 'Libra',
      'Taurus': 'Scorpio',
      'Gemini': 'Sagittarius',
      'Cancer': 'Capricorn',
      'Leo': 'Aquarius',
      'Virgo': 'Pisces',
      'Libra': 'Aries',
      'Scorpio': 'Taurus',
      'Sagittarius': 'Gemini',
      'Capricorn': 'Cancer',
      'Aquarius': 'Leo',
      'Pisces': 'Virgo',
    };

    return opposites[sign1] === sign2;
  }

  /**
   * Get key themes for planet transit
   */
  private static getKeyThemes(planet: string, relationship: string): string[] {
    const themes: Record<string, string[]> = {
      'Sun': ['Self-expression', 'Vitality', 'Life purpose', 'Authority'],
      'Moon': ['Emotions', 'Family', 'Inner world', 'Nurturing'],
      'Mercury': ['Communication', 'Intellect', 'Commerce', 'Siblings'],
      'Venus': ['Relationships', 'Beauty', 'Values', 'Creativity'],
      'Mars': ['Action', 'Courage', 'Passion', 'Competition'],
      'Jupiter': ['Growth', 'Opportunity', 'Expansion', 'Wisdom'],
      'Saturn': ['Responsibility', 'Restriction', 'Discipline', 'Maturity'],
      'Rahu': ['Desire', 'Ambition', 'Innovation', 'Unconventional'],
      'Ketu': ['Spirituality', 'Release', 'Detachment', 'Karmic'],
    };

    return themes[planet] || [];
  }

  /**
   * Get opportunities based on transit
   */
  private static getOpportunities(planet: string, sign: string, relationship: string): string[] {
    const baseOpportunities: Record<string, string[]> = {
      'Jupiter': [
        'Expansion in career or education',
        'Financial growth and opportunity',
        'Travel and cultural experiences',
        'Relationship deepening',
        'Spiritual awakening',
      ],
      'Venus': [
        'Enhanced relationships and beauty',
        'Business partnerships succeeding',
        'Artistic and creative endeavors',
        'Financial gains through trade',
        'Social popularity and charm',
      ],
      'Mercury': [
        'Communication breakthroughs',
        'Learning new skills',
        'Short journeys and travel',
        'Business and contracts',
        'Mental clarity and focus',
      ],
      'Sun': [
        'Personal recognition and success',
        'Leadership opportunities',
        'Increased confidence and charisma',
        'Health improvement',
        'Career advancement',
      ],
      'Moon': [
        'Emotional stability and peace',
        'Family harmony',
        'Intuitive insights',
        'Home improvements',
        'Nurturing connections',
      ],
    };

    return baseOpportunities[planet] || ['Enhanced focus on related life areas'];
  }

  /**
   * Get challenges based on transit
   */
  private static getChallenges(planet: string, sign: string, relationship: string): string[] {
    const baseChallenges: Record<string, string[]> = {
      'Saturn': [
        'Delays and restrictions',
        'Increased responsibilities',
        'Testing of foundations',
        'Necessary endings',
        'Discipline required',
      ],
      'Mars': [
        'Conflicts and arguments',
        'Impulsive actions',
        'Aggressive energy',
        'Physical accidents risk',
        'Waste of energy',
      ],
      'Rahu': [
        'Unfulfilled desires',
        'Confusion and uncertainty',
        'Unconventional situations',
        'Obsessive tendencies',
        'Material obsession',
      ],
      'Ketu': [
        'Loss and separation',
        'Spiritual confusion',
        'Isolation and withdrawal',
        'Lack of clarity',
        'Release of attachments',
      ],
    };

    return baseChallenges[planet] || ['Areas of life may require attention and focus'];
  }

  /**
   * Get recommendations based on transit
   */
  private static getRecommendations(
    planet: string,
    tone: InterpretationOverallTone
  ): string[] {
    const recommendations: Record<string, string[]> = {
      'Sun': [
        'Focus on personal goals and self-improvement',
        'Take leadership roles when offered',
        'Practice yoga and meditation for vitality',
        'Spend time in sunlight and nature',
      ],
      'Moon': [
        'Honor your emotional needs',
        'Spend time with family and loved ones',
        'Engage in creative pursuits',
        'Establish healthy routines',
        'Trust your intuition',
      ],
      'Mercury': [
        'Communicate clearly and listen well',
        'Pursue learning and intellectual growth',
        'Review contracts and agreements',
        'Use technology wisely',
        'Write and journal regularly',
      ],
      'Venus': [
        'Cultivate self-love and appreciation',
        'Invest in relationships and connections',
        'Explore creative and artistic interests',
        'Practice gratitude and abundance mindset',
      ],
      'Mars': [
        'Channel energy into productive projects',
        'Exercise regularly and stay active',
        'Practice patience and restraint',
        'Avoid conflicts when possible',
        'Use assertiveness constructively',
      ],
      'Jupiter': [
        'Take calculated risks for growth',
        'Invest in education and expansion',
        'Help others generously',
        'Plan for future opportunities',
        'Trust in abundance',
      ],
      'Saturn': [
        'Build solid foundations',
        'Accept responsibilities gracefully',
        'Practice patience and perseverance',
        'Review and organize life areas',
        'Seek wisdom from mentors',
      ],
    };

    return recommendations[planet] || ['Embrace this transit as a learning opportunity'];
  }

  /**
   * Estimate transit period
   */
  private static estimatePeriod(planet: string): string {
    const periods: Record<string, string> = {
      'Sun': '30 days in sign',
      'Moon': '2-3 days in sign',
      'Mercury': '14-60 days in sign',
      'Venus': '23-60 days in sign',
      'Mars': '30-45 days in sign',
      'Jupiter': '1 year in sign',
      'Saturn': '2-3 years in sign',
      'Rahu': '18 months in sign',
      'Ketu': '18 months in sign',
    };

    return periods[planet] || 'Variable duration';
  }

  /**
   * Generate overall summary
   */
  private static generateSummary(interpretations: TransitInterpretation[]): string {
    const positiveCount = interpretations.filter(i => i.overallTone.includes('positive')).length;
    const negativeCount = interpretations.filter(i => i.overallTone.includes('challenging')).length;

    if (positiveCount > negativeCount + 1) {
      return 'A generally supportive period with many opportunities for growth and positive change. Focus on manifestation and taking action.';
    } else if (negativeCount > positiveCount + 1) {
      return 'A period of testing and transformation. Patience and inner work are required. Use this time for reflection and spiritual development.';
    } else {
      return 'A balanced period with both opportunities and challenges. The universe asks for conscious action and wise decision-making.';
    }
  }

  /**
   * Determine overall vibrational tone
   */
  private static determineOverallVibe(interpretations: TransitInterpretation[]): string {
    const tones = interpretations.map(i => i.overallTone);
    const positive = tones.filter(t => t.includes('positive')).length;
    const neutral = tones.filter(t => t === 'neutral').length;
    const challenging = tones.filter(t => t.includes('challenging')).length;

    if (positive >= interpretations.length / 2) {
      return '✨ Expansive & Supportive';
    } else if (challenging >= interpretations.length / 2) {
      return '⚡ Transformative & Testing';
    } else {
      return '🌀 Dynamic & Balancing';
    }
  }

  /**
   * Generate weekly guidance
   */
  private static generateWeeklyGuidance(interpretations: TransitInterpretation[]): string {
    const themes = interpretations
      .flatMap(i => i.keyThemes)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 3);

    if (themes.length === 0) return 'Focus on inner development and self-reflection.';

    return `This week emphasizes ${themes.join(', ')}. Pay attention to these areas and work consciously with the energies presenting themselves.`;
  }

  /**
   * Generate practical advice
   */
  private static generatePracticalAdvice(interpretations: TransitInterpretation[]): string[] {
    const advice: Set<string> = new Set();

    interpretations.forEach(i => {
      // Add recommendations
      i.recommendations.slice(0, 2).forEach(rec => advice.add(rec));

      // Add opportunity-based advice
      if (i.opportunities.length > 0) {
        advice.add(`Leverage ${i.planet} energy: ${i.opportunities[0]}`);
      }

      // Add challenge-based advice
      if (i.challenges.length > 0) {
        advice.add(`Navigate ${i.planet} challenges: Practice awareness during ${i.challenges[0].toLowerCase()}`);
      }
    });

    return Array.from(advice).slice(0, 5);
  }
}

type InterpretationOverallTone = 'very positive' | 'positive' | 'neutral' | 'challenging' | 'very challenging';
