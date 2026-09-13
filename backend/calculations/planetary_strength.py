"""
Shadbala (6-fold Planetary Strength) Calculator

Calculates comprehensive planetary strength based on:
- Sthana Bala (positional strength)
- Dik Bala (directional strength)
- Kala Bala (temporal strength)
- Chesta Bala (motional strength)
- Naisargika Bala (natural strength)
- Drishti Bala (aspect strength)

Total of 6 different strength calculations combined for overall planetary power.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
from enum import Enum
from datetime import datetime
import math


class Planet(Enum):
    """The 9 planets"""
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
    """12 Zodiac signs"""
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


class StrengthComponent(Enum):
    """Components of Shadbala"""
    STHANA_BALA = "Sthana Bala"
    DIK_BALA = "Dik Bala"
    KALA_BALA = "Kala Bala"
    CHESTA_BALA = "Chesta Bala"
    NAISARGIKA_BALA = "Naisargika Bala"
    DRISHTI_BALA = "Drishti Bala"


@dataclass
class StrengthBreakdown:
    """Breakdown of all 6 strength components"""
    sthana_bala: float  # Positional strength (0-100)
    dik_bala: float  # Directional strength (0-100)
    kala_bala: float  # Temporal strength (0-100)
    chesta_bala: float  # Motional strength (0-100)
    naisargika_bala: float  # Natural strength (0-100)
    drishti_bala: float  # Aspect strength (0-100)


@dataclass
class PlanetaryStrength:
    """Complete planetary strength data"""
    planet: str
    sign: str
    longitude: float  # 0-360 degrees
    house: int  # 1-12
    retrograde: bool = False
    combust: bool = False
    exaltation: Optional[str] = None
    debilitation: Optional[str] = None
    moolatrikona: Optional[str] = None
    own_sign: Optional[str] = None

    # Strength components
    sthana_bala: float = 0.0  # 0-100
    dik_bala: float = 0.0  # 0-100
    kala_bala: float = 0.0  # 0-100
    chesta_bala: float = 0.0  # 0-100
    naisargika_bala: float = 0.0  # 0-100
    drishti_bala: float = 0.0  # 0-100

    # Overall
    total_strength: float = 0.0  # 0-100
    strength_status: str = "Weak"  # Very Weak, Weak, Moderate, Strong, Very Strong

    # Aspects
    aspects_from: List[str] = field(default_factory=list)
    aspects_to: List[str] = field(default_factory=list)

    dignity_status: str = "Neutral"  # Exalted, Own Sign, Neutral, Debilitated
    aspect_value: float = 0.0  # 0-100


class ShadbalaCalculator:
    """
    Calculates Shadbala (6-fold strength) for planets

    The 6 components:
    1. Sthana Bala - Positional strength based on house/sign
    2. Dik Bala - Directional strength based on planet position in day/night
    3. Kala Bala - Temporal strength based on time (year/month/day/hour)
    4. Chesta Bala - Motional strength based on retrograde/combust status
    5. Naisargika Bala - Natural strength of each planet
    6. Drishti Bala - Aspect strength from other planets
    """

    # Natural strength of planets (0-100)
    NATURAL_STRENGTH = {
        'Sun': 100,
        'Jupiter': 95,
        'Moon': 90,
        'Venus': 85,
        'Mercury': 80,
        'Mars': 75,
        'Saturn': 60,
        'Rahu': 50,
        'Ketu': 50,
    }

    # Exaltation signs and degrees
    EXALTATION = {
        'Sun': 'Aries',      # 10° Aries
        'Moon': 'Taurus',    # 3° Taurus
        'Mars': 'Capricorn', # 28° Capricorn
        'Mercury': 'Virgo',  # 15° Virgo
        'Jupiter': 'Cancer', # 5° Cancer
        'Venus': 'Pisces',   # 27° Pisces
        'Saturn': 'Libra',   # 20° Libra
    }

    # Debilitation signs
    DEBILITATION = {
        'Sun': 'Libra',      # 10° Libra
        'Moon': 'Scorpio',   # 3° Scorpio
        'Mars': 'Cancer',    # 28° Cancer
        'Mercury': 'Pisces', # 15° Pisces
        'Jupiter': 'Capricorn', # 5° Capricorn
        'Venus': 'Virgo',    # 27° Virgo
        'Saturn': 'Aries',   # 20° Aries
    }

    # Moolatrikona (primary divisional strength)
    MOOLATRIKONA = {
        'Sun': 'Leo',        # 0-20° Leo
        'Moon': 'Taurus',    # 0-3° Taurus
        'Mars': 'Aries',     # 0-12° Aries
        'Mercury': 'Virgo',  # 0-15° Virgo
        'Jupiter': 'Sagittarius', # 0-10° Sagittarius
        'Venus': 'Libra',    # 0-15° Libra
        'Saturn': 'Aquarius', # 0-20° Aquarius
    }

    # Own houses for planets
    HOUSE_STRENGTH = {
        'Sun': {1: 100, 5: 90, 9: 85, 10: 75, 4: 45, 7: 40},
        'Moon': {1: 100, 4: 100, 7: 80, 10: 75, 5: 70},
        'Mars': {1: 100, 10: 85, 5: 75, 6: 65, 3: 60},
        'Mercury': {1: 100, 6: 85, 3: 80, 10: 75},
        'Jupiter': {1: 100, 5: 95, 9: 90, 10: 80, 2: 75, 11: 70},
        'Venus': {1: 100, 5: 90, 7: 95, 4: 80, 2: 85},
        'Saturn': {1: 100, 7: 85, 10: 90, 6: 80, 8: 75},
        'Rahu': {1: 85, 6: 80, 3: 75, 5: 70},
        'Ketu': {1: 85, 12: 80, 8: 75, 6: 70},
    }

    # Direction strengths (day/night lords)
    DAY_LORD = 'Sun'
    NIGHT_LORD = 'Moon'

    def __init__(self, birth_date: datetime = None):
        """Initialize calculator with optional birth date for temporal calculations"""
        self.birth_date = birth_date or datetime.now()

    def calculate_planetary_strength(
        self,
        planet: str,
        sign: str,
        longitude: float,
        house: int,
        retrograde: bool = False,
        other_planets: List[Dict] = None
    ) -> PlanetaryStrength:
        """
        Calculate complete Shadbala for a planet

        Args:
            planet: Planet name
            sign: Zodiac sign
            longitude: Degree position (0-360)
            house: House number (1-12)
            retrograde: Is planet retrograde
            other_planets: List of other planets for aspect calculations
        """
        combust = self._is_combust(planet, sign)

        # Calculate each component
        sthana_bala = self._calculate_sthana_bala(planet, sign, house)
        dik_bala = self._calculate_dik_bala(planet)
        kala_bala = self._calculate_kala_bala(planet)
        chesta_bala = self._calculate_chesta_bala(planet, retrograde, combust)
        naisargika_bala = self._calculate_naisargika_bala(planet)
        drishti_bala = self._calculate_drishti_bala(planet, other_planets or [])

        # Calculate total (average of all 6 components)
        total_strength = (
            sthana_bala + dik_bala + kala_bala +
            chesta_bala + naisargika_bala + drishti_bala
        ) / 6

        # Determine strength status
        strength_status = self._get_strength_status(total_strength)

        # Determine dignity status
        dignity_status = self._get_dignity_status(planet, sign)

        # Aspect value
        aspect_value = drishti_bala

        return PlanetaryStrength(
            planet=planet,
            sign=sign,
            longitude=longitude,
            house=house,
            retrograde=retrograde,
            combust=combust,
            exaltation=self.EXALTATION.get(planet),
            debilitation=self.DEBILITATION.get(planet),
            moolatrikona=self.MOOLATRIKONA.get(planet),
            own_sign=self._get_own_sign(planet),
            sthana_bala=sthana_bala,
            dik_bala=dik_bala,
            kala_bala=kala_bala,
            chesta_bala=chesta_bala,
            naisargika_bala=naisargika_bala,
            drishti_bala=drishti_bala,
            total_strength=total_strength,
            strength_status=strength_status,
            dignity_status=dignity_status,
            aspect_value=aspect_value,
        )

    def _calculate_sthana_bala(self, planet: str, sign: str, house: int) -> float:
        """Calculate Sthana Bala (positional strength)"""
        # Base from exaltation/debilitation
        exalted_strength = 100 if sign == self.EXALTATION.get(planet) else 0
        debilitated_strength = -50 if sign == self.DEBILITATION.get(planet) else 0
        moolatrikona_strength = 75 if sign == self.MOOLATRIKONA.get(planet) else 0

        # House strength
        house_strength = self.HOUSE_STRENGTH.get(planet, {}).get(house, 40)

        # Combined
        strength = max(0, exalted_strength + debilitated_strength + house_strength)
        return min(100, strength)

    def _calculate_dik_bala(self, planet: str) -> float:
        """Calculate Dik Bala (directional strength)"""
        # Simplified: based on day/night preferences
        day_planets = ['Sun', 'Mars', 'Jupiter']
        night_planets = ['Moon', 'Venus', 'Saturn']

        is_day = self.birth_date.hour >= 6 and self.birth_date.hour < 18

        if planet in day_planets and is_day:
            return 80
        elif planet in night_planets and not is_day:
            return 80
        elif planet in ['Mercury', 'Rahu', 'Ketu']:
            return 70  # Neutral
        else:
            return 40

    def _calculate_kala_bala(self, planet: str) -> float:
        """Calculate Kala Bala (temporal strength)"""
        # Yearly cycle (each planet strong in certain months)
        month = self.birth_date.month
        day_of_week = self.birth_date.weekday()  # 0=Monday, 6=Sunday

        # Simplified month strengths
        planet_months = {
            'Sun': [1, 4, 7, 10],
            'Moon': [2, 5, 8, 11],
            'Mars': [1, 3, 5, 7, 9, 11],
            'Mercury': [3, 6, 9, 12],
            'Jupiter': [1, 6, 11],
            'Venus': [2, 4, 6, 8, 10, 12],
            'Saturn': [3, 8],
        }

        # Day strengths (0=Monday, 6=Sunday)
        planet_days = {
            'Sun': [6],  # Sunday
            'Moon': [0],  # Monday
            'Mars': [1],  # Tuesday
            'Mercury': [2],  # Wednesday
            'Jupiter': [4],  # Thursday
            'Venus': [4],  # Friday
            'Saturn': [5],  # Saturday
        }

        strength = 50  # Base

        if month in planet_months.get(planet, []):
            strength += 20

        if day_of_week in planet_days.get(planet, []):
            strength += 15

        return min(100, strength)

    def _calculate_chesta_bala(self, planet: str, retrograde: bool, combust: bool) -> float:
        """Calculate Chesta Bala (motional strength)"""
        strength = 70

        # Retrograde status
        if retrograde:
            strength -= 25

        # Combust status
        if combust:
            strength -= 40

        return max(0, strength)

    def _calculate_naisargika_bala(self, planet: str) -> float:
        """Calculate Naisargika Bala (natural strength)"""
        return self.NATURAL_STRENGTH.get(planet, 50)

    def _calculate_drishti_bala(self, planet: str, other_planets: List[Dict]) -> float:
        """Calculate Drishti Bala (aspect strength from other planets)"""
        # Simplified: count favorable aspects
        aspect_strength = 50  # Base

        for other in other_planets:
            if self._has_favorable_aspect(planet, other.get('planet'), other.get('sign')):
                aspect_strength += 10
            elif self._has_unfavorable_aspect(planet, other.get('planet'), other.get('sign')):
                aspect_strength -= 10

        return max(0, min(100, aspect_strength))

    def _has_favorable_aspect(self, planet1: str, planet2: str, sign2: str) -> bool:
        """Check if planet2 aspects planet1 favorably"""
        # Simplified: Jupiter and Venus aspects are generally favorable
        beneficial_planets = ['Jupiter', 'Venus', 'Moon']
        return planet2 in beneficial_planets

    def _has_unfavorable_aspect(self, planet1: str, planet2: str, sign2: str) -> bool:
        """Check if planet2 aspects planet1 unfavorably"""
        # Simplified: Mars and Saturn aspects are generally challenging
        challenging_planets = ['Mars', 'Saturn', 'Rahu', 'Ketu']
        return planet2 in challenging_planets

    def _is_combust(self, planet: str, sign: str) -> bool:
        """Check if planet is combust (too close to Sun)"""
        # Simplified: planets in Leo (Sun's sign) can be combust
        combust_planets = ['Mercury', 'Venus', 'Mars']
        return planet in combust_planets and sign == 'Leo'

    def _get_strength_status(self, strength: float) -> str:
        """Determine strength status level"""
        if strength >= 85:
            return "Very Strong"
        elif strength >= 70:
            return "Strong"
        elif strength >= 50:
            return "Moderate"
        elif strength >= 35:
            return "Weak"
        else:
            return "Very Weak"

    def _get_dignity_status(self, planet: str, sign: str) -> str:
        """Determine dignity status"""
        if sign == self.EXALTATION.get(planet):
            return "Exalted"
        elif sign == self.DEBILITATION.get(planet):
            return "Debilitated"
        elif sign == self.MOOLATRIKONA.get(planet):
            return "Moolatrikona"
        elif sign == self._get_own_sign(planet):
            return "Own Sign"
        else:
            return "Neutral"

    def _get_own_sign(self, planet: str) -> Optional[str]:
        """Get own sign for planet"""
        own_signs = {
            'Sun': 'Leo',
            'Moon': 'Cancer',
            'Mars': 'Aries',
            'Mercury': 'Gemini',
            'Jupiter': 'Sagittarius',
            'Venus': 'Libra',
            'Saturn': 'Capricorn',
        }
        return own_signs.get(planet)

    def calculate_all_planets_strength(
        self,
        planets_data: List[Dict]
    ) -> List[PlanetaryStrength]:
        """Calculate strength for all planets"""
        results = []

        for planet_data in planets_data:
            strength = self.calculate_planetary_strength(
                planet=planet_data.get('planet'),
                sign=planet_data.get('sign'),
                longitude=planet_data.get('longitude', 0),
                house=planet_data.get('house', 1),
                retrograde=planet_data.get('retrograde', False),
                other_planets=[p for p in planets_data if p.get('planet') != planet_data.get('planet')]
            )
            results.append(strength)

        return results

    def get_strength_breakdown(self, planetary_strength: PlanetaryStrength) -> StrengthBreakdown:
        """Get breakdown of all 6 components"""
        return StrengthBreakdown(
            sthana_bala=planetary_strength.sthana_bala,
            dik_bala=planetary_strength.dik_bala,
            kala_bala=planetary_strength.kala_bala,
            chesta_bala=planetary_strength.chesta_bala,
            naisargika_bala=planetary_strength.naisargika_bala,
            drishti_bala=planetary_strength.drishti_bala,
        )

    def rank_planets_by_strength(self, planetary_strengths: List[PlanetaryStrength]) -> List[PlanetaryStrength]:
        """Rank planets from strongest to weakest"""
        return sorted(planetary_strengths, key=lambda p: p.total_strength, reverse=True)

    def get_strength_interpretation(self, strength: float) -> dict:
        """Get interpretation text for a strength value"""
        if strength >= 85:
            return {
                'status': 'Very Strong',
                'color': 'green',
                'meaning': 'Excellent planetary strength. This planet will manifest its beneficial qualities powerfully.',
            }
        elif strength >= 70:
            return {
                'status': 'Strong',
                'color': 'light-green',
                'meaning': 'Good planetary strength. This planet functions well in the birth chart.',
            }
        elif strength >= 50:
            return {
                'status': 'Moderate',
                'color': 'yellow',
                'meaning': 'Moderate planetary strength. Results depend on other planetary influences.',
            }
        elif strength >= 35:
            return {
                'status': 'Weak',
                'color': 'orange',
                'meaning': 'Weak planetary strength. This planet may struggle to express its qualities.',
            }
        else:
            return {
                'status': 'Very Weak',
                'color': 'red',
                'meaning': 'Very weak planetary strength. Significant challenges in expressing this planet\'s nature.',
            }


def create_shadbala_calculator(birth_date: datetime = None) -> ShadbalaCalculator:
    """Factory function to create Shadbala calculator"""
    return ShadbalaCalculator(birth_date)
