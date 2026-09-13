"""
Astrological Interpretation Engine

Generates text-based interpretations from birth chart data:
- Personality analysis (Ascendant + Moon)
- Career prospects (10th house)
- Relationship potential (7th house)
- Health assessment (6th house)
- Spiritual inclinations (9th house)
- Financial prospects (2nd & 11th house)
- Personalized remedies
- Key strengths
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from enum import Enum


class PlanetName(Enum):
    """Planet names"""
    SUN = "Sun"
    MOON = "Moon"
    MARS = "Mars"
    MERCURY = "Mercury"
    JUPITER = "Jupiter"
    VENUS = "Venus"
    SATURN = "Saturn"
    RAHU = "Rahu"
    KETU = "Ketu"


class Sign(Enum):
    """Zodiac signs with characteristics"""
    ARIES = "Aries"
    TAURUS = "Taurus"
    GEMINI = "Gemini"
    CANCER = "Cancer"
    LEO = "Leo"
    VIRGO = "Virgo"
    LIBRA = "Libra"
    SCORPIO = "Scorpio"
    SAGITTARIUS = "Sagittarius"
    CAPRICORN = "Capricorn"
    AQUARIUS = "Aquarius"
    PISCES = "Pisces"


@dataclass
class InterpretationResult:
    """Result of astrological interpretation"""
    section: str                    # personality, career, relationships, health, spiritual, financial
    title: str                      # Section title
    insights: List[str]             # Key insights (3-5 points)
    challenges: List[str]           # Challenges and obstacles
    recommendations: List[str]      # Actionable recommendations
    strength_level: str             # Weak, Moderate, Strong, Very Strong
    confidence_score: float         # 0-100 interpretation confidence
    tamil_insights: Optional[List[str]] = None
    tamil_challenges: Optional[List[str]] = None
    tamil_recommendations: Optional[List[str]] = None


@dataclass
class RemedyRecommendation:
    """Personalized remedy recommendation"""
    type: str                       # mantra, gemstone, yantra, ritual, charity
    name: str                       # Name of remedy
    planet: str                     # Associated planet
    description: str                # How it helps
    frequency: str                  # Daily, Weekly, Monthly, etc.
    tamil_name: Optional[str] = None


@dataclass
class StrengthAssessment:
    """Assessment of chart strengths"""
    title: str
    description: str
    impact: str                     # Life area impacted
    confidence: float               # 0-100


class AstrologicalInterpreter:
    """Generate interpretations from birth chart data"""

    # Sign characteristics
    SIGN_TRAITS = {
        'Aries': ('Leadership', 'Courage', 'Assertiveness'),
        'Taurus': ('Stability', 'Wealth', 'Practicality'),
        'Gemini': ('Communication', 'Intellect', 'Adaptability'),
        'Cancer': ('Emotional', 'Home', 'Nurturing'),
        'Leo': ('Confidence', 'Creativity', 'Authority'),
        'Virgo': ('Analysis', 'Service', 'Precision'),
        'Libra': ('Balance', 'Relationships', 'Harmony'),
        'Scorpio': ('Intensity', 'Transformation', 'Mystery'),
        'Sagittarius': ('Expansion', 'Philosophy', 'Adventure'),
        'Capricorn': ('Ambition', 'Discipline', 'Responsibility'),
        'Aquarius': ('Innovation', 'Idealism', 'Humanitarian'),
        'Pisces': ('Spirituality', 'Intuition', 'Compassion'),
    }

    # House significations
    HOUSE_MEANINGS = {
        1: 'Self, personality, physical appearance',
        2: 'Wealth, speech, family',
        3: 'Siblings, communication, courage',
        4: 'Mother, home, property, vehicles',
        5: 'Children, education, creativity, romance',
        6: 'Health, enemies, debts, service',
        7: 'Marriage, partnerships, public image',
        8: 'Longevity, inheritance, transformation',
        9: 'Luck, father, religion, higher learning',
        10: 'Career, reputation, authority, public standing',
        11: 'Gains, friendships, aspirations',
        12: 'Losses, expenses, isolation, moksha',
    }

    # Remedy database
    REMEDIES_DATABASE = {
        'Sun': {
            'weak': [
                RemedyRecommendation(
                    type='mantra',
                    name='Aditya Hridayam',
                    planet='Sun',
                    description='Chanting Aditya Hridayam strengthens Sun and enhances authority, confidence, and career success',
                    frequency='Daily at sunrise',
                    tamil_name='ஆதித்ய ஹ்ருதயம்'
                ),
                RemedyRecommendation(
                    type='gemstone',
                    name='Ruby (Manikya)',
                    planet='Sun',
                    description='Wearing a ruby gemstone strengthens Sun and brings success, power, and good health',
                    frequency='Lifelong',
                    tamil_name='மாணிக்கம்'
                ),
                RemedyRecommendation(
                    type='charity',
                    name='Donate wheat, jaggery, or gold',
                    planet='Sun',
                    description='Giving charity on Sundays enhances Sun\'s positive influence',
                    frequency='Weekly',
                    tamil_name='கோதுமை அல்லது வெல்லம் தானம் செய்யுங்கள்'
                ),
            ]
        },
        'Moon': {
            'weak': [
                RemedyRecommendation(
                    type='mantra',
                    name='Chandra Beej Mantra',
                    planet='Moon',
                    description='"Om Som Somaya Namaha" strengthens Moon and enhances emotional balance and mental peace',
                    frequency='Daily',
                    tamil_name='சந்திர பீஜ மந்திரம்'
                ),
                RemedyRecommendation(
                    type='gemstone',
                    name='Pearl (Moti)',
                    planet='Moon',
                    description='Wearing a pearl enhances emotional stability and brings peace of mind',
                    frequency='Lifelong',
                    tamil_name='முத்து'
                ),
            ]
        },
        'Mars': {
            'weak': [
                RemedyRecommendation(
                    type='mantra',
                    name='Mangal Beej Mantra',
                    planet='Mars',
                    description='"Om Ange Mangalaya Namaha" strengthens Mars and enhances courage and vitality',
                    frequency='Daily',
                    tamil_name='செவ்வாய் மந்திரம்'
                ),
                RemedyRecommendation(
                    type='gemstone',
                    name='Coral/Red Coral (Praval)',
                    planet='Mars',
                    description='Wearing coral strengthens Mars and brings confidence and physical strength',
                    frequency='Lifelong',
                    tamil_name='பவளம்'
                ),
            ]
        },
    }

    def __init__(self, chart_data: Dict, strength_data: Dict, dasha_data: Dict):
        """
        Initialize interpreter with chart data

        Args:
            chart_data: Planetary positions and houses
            strength_data: Shadbala calculations
            dasha_data: Dasha period information
        """
        self.chart_data = chart_data
        self.strength_data = strength_data
        self.dasha_data = dasha_data

    # ==================== PERSONALITY INTERPRETATION ====================

    def interpret_personality(self) -> InterpretationResult:
        """Interpret personality based on Ascendant and Moon"""
        ascendant_sign = self.chart_data.get('ascendant_sign', 'Aries')
        moon_sign = self.chart_data.get('moon_sign', 'Cancer')
        sun_sign = self.chart_data.get('sun_sign', 'Leo')

        ascendant_traits = self.SIGN_TRAITS.get(ascendant_sign, ())
        moon_traits = self.SIGN_TRAITS.get(moon_sign, ())
        sun_traits = self.SIGN_TRAITS.get(sun_sign, ())

        insights = [
            f"Ascendant in {ascendant_sign} gives you {', '.join(ascendant_traits[:2])} in your personality",
            f"Moon in {moon_sign} makes you naturally {', '.join(moon_traits[:2])}",
            f"Sun in {sun_sign} brings {', '.join(sun_traits[:2])} to your core identity",
            f"You are a blend of intellectual and emotional qualities with strong self-awareness",
            f"Your personality is naturally drawn to {ascendant_traits[0]} and {moon_traits[0]}"
        ]

        challenges = [
            f"Sometimes your {ascendant_traits[0]} nature may overshadow your emotional depth",
            f"You may experience internal conflict between your {ascendant_traits[0]} personality and {moon_traits[0]} emotional nature",
            f"Learning to balance assertiveness with sensitivity is key to personal growth"
        ]

        recommendations = [
            f"Embrace your natural {ascendant_traits[0]} qualities while honoring your {moon_traits[0]} side",
            "Regular meditation helps harmonize your personality traits",
            f"Pursue activities that leverage your {ascendant_traits[1]} nature",
            "Cultivate emotional intelligence alongside your natural strengths"
        ]

        strength_level = self._assess_strength(
            self.strength_data.get('personality_strength', 60)
        )

        return InterpretationResult(
            section='personality',
            title='Personality & Character Analysis',
            insights=insights,
            challenges=challenges,
            recommendations=recommendations,
            strength_level=strength_level,
            confidence_score=85.0,
        )

    # ==================== CAREER INTERPRETATION ====================

    def interpret_career(self) -> InterpretationResult:
        """Interpret career prospects based on 10th house"""
        tenth_lord = self.chart_data.get('tenth_lord', 'Mercury')
        tenth_sign = self.chart_data.get('tenth_sign', 'Capricorn')
        sun_position = self.chart_data.get('sun_house', 10)

        insights = [
            f"Your 10th house lord is {tenth_lord}, indicating potential in analytical and detail-oriented work",
            f"With {tenth_sign} in 10th house, you have natural ability for management and organization",
            f"Your career path will benefit from your natural {self.SIGN_TRAITS.get(tenth_sign, ('leadership',))[0]} qualities",
            f"You are drawn to positions of responsibility and would excel in leadership roles",
            f"Your professional growth is closely tied to your personal integrity and ethics"
        ]

        challenges = [
            f"You may face challenges in adapting to rapidly changing work environments",
            f"Building patience with slower-moving bureaucratic processes is necessary",
            f"Learning to delegate and trust others will enhance your professional effectiveness"
        ]

        recommendations = [
            f"Pursue careers in {tenth_sign.lower()} fields (government, banking, management, education)",
            "Invest in professional development and continuous learning",
            "Seek roles that align with your natural leadership abilities",
            "Build a strong professional network for career advancement",
            "Consider entrepreneurship if you have sufficient supporting factors"
        ]

        strength_level = self._assess_strength(
            self.strength_data.get('career_strength', 70)
        )

        return InterpretationResult(
            section='career',
            title='Career & Professional Prospects',
            insights=insights,
            challenges=challenges,
            recommendations=recommendations,
            strength_level=strength_level,
            confidence_score=80.0,
        )

    # ==================== RELATIONSHIP INTERPRETATION ====================

    def interpret_relationships(self) -> InterpretationResult:
        """Interpret relationship potential based on 7th house"""
        seventh_lord = self.chart_data.get('seventh_lord', 'Venus')
        seventh_sign = self.chart_data.get('seventh_sign', 'Libra')
        venus_position = self.chart_data.get('venus_house', 7)
        venus_strength = self.strength_data.get('Venus', 70)

        insights = [
            f"{seventh_sign} in 7th house indicates you seek harmony, balance, and intellectual connection in relationships",
            f"Venus in the chart shows you value beauty, romance, and emotional connection",
            f"You are naturally attracted to people who share your values and intellectual interests",
            f"Your ideal partnership involves both emotional and mental compatibility",
            f"You have the capacity for deep, meaningful long-term relationships"
        ]

        challenges = [
            f"You may be overly critical or have high expectations in relationships",
            f"Learning to accept imperfections in your partner is important for relationship success",
            f"Sometimes you prioritize independence, which can create distance in intimate relationships",
            f"Communication is key - express your feelings clearly and openly"
        ]

        recommendations = [
            f"Seek partners who appreciate your need for intellectual engagement",
            "Prioritize open, honest communication in all relationships",
            "Balance your independence with commitment to your partner",
            "Engage in activities together that strengthen emotional bonds",
            "Work on building trust and reducing critical tendencies",
            "Consider relationship counseling or therapy if facing challenges"
        ]

        strength_level = self._assess_strength(venus_strength)

        return InterpretationResult(
            section='relationships',
            title='Love & Relationship Analysis',
            insights=insights,
            challenges=challenges,
            recommendations=recommendations,
            strength_level=strength_level,
            confidence_score=75.0,
        )

    # ==================== HEALTH INTERPRETATION ====================

    def interpret_health(self) -> InterpretationResult:
        """Interpret health prospects based on 6th house"""
        sixth_lord = self.chart_data.get('sixth_lord', 'Mercury')
        moon_strength = self.strength_data.get('Moon', 70)
        mars_strength = self.strength_data.get('Mars', 65)

        insights = [
            f"Your overall constitution suggests you have a naturally resilient body",
            f"Mental and emotional health are closely connected to your physical wellbeing",
            f"You have good vitality and recovery capacity when health challenges arise",
            f"Regular exercise and stress management are important for maintaining optimal health",
            f"Your health is influenced by your mental state and emotional balance"
        ]

        challenges = [
            f"You may be prone to anxiety or stress-related health issues",
            f"Digestive health requires attention and proper nutrition",
            f"Sleep quality can be affected by mental activity and worry",
            f"You may ignore health issues until they become serious"
        ]

        recommendations = [
            "Practice daily meditation and yoga for physical and mental health",
            "Maintain a balanced, nutritious diet with regular meal times",
            "Ensure 7-8 hours of quality sleep every night",
            "Exercise regularly (30 minutes daily) for cardiovascular health",
            "Regular health check-ups to catch issues early",
            "Manage stress through relaxation techniques",
            "Avoid excessive caffeine, alcohol, and processed foods"
        ]

        strength_level = self._assess_strength((moon_strength + mars_strength) / 2)

        return InterpretationResult(
            section='health',
            title='Health & Wellbeing Assessment',
            insights=insights,
            challenges=challenges,
            recommendations=recommendations,
            strength_level=strength_level,
            confidence_score=70.0,
        )

    # ==================== SPIRITUAL INTERPRETATION ====================

    def interpret_spiritual(self) -> InterpretationResult:
        """Interpret spiritual potential based on 9th house"""
        ninth_lord = self.chart_data.get('ninth_lord', 'Jupiter')
        jupiter_strength = self.strength_data.get('Jupiter', 75)
        ketu_position = self.chart_data.get('ketu_house', 12)

        insights = [
            f"You have natural spiritual inclinations and are drawn to philosophical questions",
            f"Jupiter's influence suggests wisdom and deeper understanding of life's purpose",
            f"You are naturally inclined toward meditation, yoga, or spiritual practices",
            f"Your spiritual journey will bring you peace and inner fulfillment",
            f"Teaching and sharing spiritual knowledge with others is a natural gift"
        ]

        challenges = [
            f"You may seek perfection in your spiritual practice, which can be discouraging",
            f"Balancing spiritual pursuits with practical worldly responsibilities is important",
            f"Sometimes you may become too rigid in your spiritual beliefs",
            f"Learning from different spiritual traditions broadens your perspective"
        ]

        recommendations = [
            "Establish a daily spiritual practice (meditation, prayer, or yoga)",
            "Study scriptures or philosophical texts that resonate with you",
            "Seek a spiritual guide or mentor for deeper understanding",
            "Participate in spiritual communities that support your growth",
            "Balance spiritual pursuits with family and professional responsibilities",
            "Practice compassion and service to others",
            "Explore different spiritual traditions to find what resonates"
        ]

        strength_level = self._assess_strength(jupiter_strength)

        return InterpretationResult(
            section='spiritual',
            title='Spiritual Growth & Purpose',
            insights=insights,
            challenges=challenges,
            recommendations=recommendations,
            strength_level=strength_level,
            confidence_score=78.0,
        )

    # ==================== FINANCIAL INTERPRETATION ====================

    def interpret_financial(self) -> InterpretationResult:
        """Interpret financial prospects based on 2nd & 11th house"""
        second_lord = self.chart_data.get('second_lord', 'Taurus')
        eleventh_lord = self.chart_data.get('eleventh_lord', 'Aquarius')
        jupiter_strength = self.strength_data.get('Jupiter', 75)

        insights = [
            f"You have good financial potential with consistent income opportunities",
            f"Your wealth comes through multiple sources and sustained effort",
            f"Financial stability is achievable through disciplined saving and investment",
            f"You are naturally drawn to financial security and planning",
            f"Your financial success is tied to your professional achievements"
        ]

        challenges = [
            f"You may struggle with impulsive spending in certain areas",
            f"Learning to balance spending with saving is important",
            f"Financial opportunities may come and go - timing is important",
            f"Avoiding unnecessary debt is crucial for financial health"
        ]

        recommendations = [
            "Create a detailed financial plan and budget",
            "Invest regularly in long-term wealth building (stocks, mutual funds, real estate)",
            "Diversify your income sources for financial security",
            "Build an emergency fund covering 6 months of expenses",
            "Avoid risky investments without proper research",
            "Seek professional financial advice for major decisions",
            "Practice gratitude and generosity - share wealth with those in need",
            "Regular financial review and adjustment of strategies"
        ]

        strength_level = self._assess_strength(jupiter_strength)

        return InterpretationResult(
            section='financial',
            title='Financial Prospects & Wealth',
            insights=insights,
            challenges=challenges,
            recommendations=recommendations,
            strength_level=strength_level,
            confidence_score=76.0,
        )

    # ==================== GENERAL METHODS ====================

    def get_all_interpretations(self) -> Dict[str, InterpretationResult]:
        """Get all 6 interpretations"""
        return {
            'personality': self.interpret_personality(),
            'career': self.interpret_career(),
            'relationships': self.interpret_relationships(),
            'health': self.interpret_health(),
            'spiritual': self.interpret_spiritual(),
            'financial': self.interpret_financial(),
        }

    def generate_remedies(self) -> List[RemedyRecommendation]:
        """Generate personalized remedies based on chart"""
        remedies = []

        # Find weak planets
        weak_planets = [
            planet for planet, strength in self.strength_data.items()
            if strength < 40
        ]

        # Add remedies for weak planets
        for planet in weak_planets:
            if planet in self.REMEDIES_DATABASE:
                planet_remedies = self.REMEDIES_DATABASE[planet].get('weak', [])
                remedies.extend(planet_remedies)

        return remedies[:5]  # Return top 5 remedies

    def get_key_strengths(self) -> List[StrengthAssessment]:
        """Extract key strengths from chart"""
        strengths = []

        # Find exalted planets
        exalted_planets = self.chart_data.get('exalted_planets', [])
        for planet in exalted_planets:
            strengths.append(StrengthAssessment(
                title=f"{planet} in Exaltation",
                description=f"{planet} is in exalted sign, bringing enhanced positive influence",
                impact=self._get_planet_impact(planet),
                confidence=90.0
            ))

        # Find strong houses
        strong_houses = self.chart_data.get('strong_houses', [])
        for house in strong_houses:
            strengths.append(StrengthAssessment(
                title=f"Strong {self._get_house_name(house)}",
                description=f"House {house} is particularly strong in your chart",
                impact=self.HOUSE_MEANINGS.get(house, 'Life area'),
                confidence=85.0
            ))

        return strengths[:5]  # Return top 5 strengths

    def _assess_strength(self, strength_value: float) -> str:
        """Convert numeric strength to status"""
        if strength_value >= 75:
            return 'Very Strong'
        elif strength_value >= 60:
            return 'Strong'
        elif strength_value >= 40:
            return 'Moderate'
        else:
            return 'Weak'

    def _get_planet_impact(self, planet: str) -> str:
        """Get life area impacted by planet"""
        impacts = {
            'Sun': 'Career and Authority',
            'Moon': 'Emotions and Mind',
            'Mars': 'Energy and Courage',
            'Mercury': 'Communication and Intellect',
            'Jupiter': 'Wealth and Wisdom',
            'Venus': 'Relationships and Luxury',
            'Saturn': 'Discipline and Responsibility',
            'Rahu': 'Ambition and Material Gains',
            'Ketu': 'Spiritual Liberation',
        }
        return impacts.get(planet, 'Life')

    def _get_house_name(self, house: int) -> str:
        """Get name of house"""
        names = {
            1: '1st House (Self)',
            2: '2nd House (Wealth)',
            3: '3rd House (Communication)',
            4: '4th House (Home)',
            5: '5th House (Creativity)',
            6: '6th House (Health)',
            7: '7th House (Partnership)',
            8: '8th House (Transformation)',
            9: '9th House (Spirituality)',
            10: '10th House (Career)',
            11: '11th House (Gains)',
            12: '12th House (Liberation)',
        }
        return names.get(house, f'House {house}')


def create_interpreter(chart_data: Dict, strength_data: Dict, dasha_data: Dict) -> AstrologicalInterpreter:
    """Factory function to create interpreter"""
    return AstrologicalInterpreter(chart_data, strength_data, dasha_data)
