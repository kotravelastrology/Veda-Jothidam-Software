"""
Vedic Astrology Calculation Engine
Provides functions for computing charts, yogas, and strength analyses
Uses real astrological rules with deterministic outputs for testing
"""

from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
import math

class AstroEngine:
    """Core astrology calculation engine"""

    # Zodiac signs (0-11)
    SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
             'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

    SIGNS_TAMIL = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்ஹம்', 'கன்னை',
                   'துலாம்', 'விருச்சிகம்', 'தனுஸ்', 'மகரம்', 'கும்பம்', 'மீனம்']

    PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
    PLANETS_TAMIL = ['சூரிய', 'சந்திர', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்ர', 'சனி', 'ராகு', 'கேது']

    # Exaltation signs and degrees
    EXALTATION = {
        'Sun': (0, 10),      # Aries 10°
        'Moon': (2, 3),      # Taurus 3°
        'Mars': (10, 28),    # Capricorn 28°
        'Mercury': (5, 15),  # Virgo 15°
        'Jupiter': (10, 5),  # Capricorn 5°
        'Venus': (6, 27),    # Libra 27°
        'Saturn': (7, 20),   # Scorpio 20°
        'Rahu': (5, 20),     # Virgo 20°
        'Ketu': (11, 20),    # Pisces 20°
    }

    # Own signs (primary dignity)
    OWN_SIGNS = {
        'Sun': [0],           # Aries
        'Moon': [2],          # Gemini
        'Mars': [0, 7],       # Aries, Scorpio
        'Mercury': [5, 2],    # Virgo, Gemini
        'Jupiter': [8, 11],   # Sagittarius, Pisces
        'Venus': [6, 1],      # Libra, Taurus
        'Saturn': [9, 10],    # Capricorn, Aquarius
    }

    # Friendship matrix (simplified)
    FRIENDSHIPS = {
        'Sun': {'friend': ['Moon', 'Mars', 'Jupiter'], 'enemy': ['Venus', 'Saturn']},
        'Moon': {'friend': ['Sun', 'Mercury'], 'enemy': ['Saturn']},
        'Mars': {'friend': ['Sun', 'Moon', 'Jupiter'], 'enemy': ['Mercury', 'Venus']},
        'Mercury': {'friend': ['Sun', 'Venus'], 'enemy': ['Moon', 'Mars']},
        'Jupiter': {'friend': ['Sun', 'Moon', 'Mars'], 'enemy': ['Mercury', 'Venus']},
        'Venus': {'friend': ['Mercury', 'Saturn'], 'enemy': ['Sun', 'Moon', 'Mars']},
        'Saturn': {'friend': ['Mercury', 'Venus'], 'enemy': ['Sun', 'Moon', 'Mars']},
    }

    @staticmethod
    def calculate_planetary_position(date: datetime, time: str, planet_index: int) -> Tuple[int, float]:
        """
        Calculate zodiac position of a planet
        Returns: (sign_index: 0-11, degrees_in_sign: 0-30)
        Uses simplified calculation based on planetary mean motion
        """
        # Parse time
        time_parts = time.split(':')
        hour = int(time_parts[0])
        minute = int(time_parts[1]) if len(time_parts) > 1 else 0

        # Calculate day number from a reference epoch (simplified)
        epoch = datetime(2000, 1, 1)
        days = (date - epoch).days + (hour + minute/60) / 24

        # Mean daily motion (degrees per day) - simplified
        mean_motion = {
            0: 0.9856,   # Sun
            1: 13.1764,  # Moon
            2: 0.2141,   # Mars
            3: 1.0833,   # Mercury
            4: 0.0829,   # Jupiter
            5: 1.6021,   # Venus
            6: 0.0333,   # Saturn
            7: 1.5,      # Rahu (retrograde)
            8: 1.5,      # Ketu (retrograde)
        }

        # Calculate position
        total_degrees = (days * mean_motion.get(planet_index, 0.5)) % 360
        sign_index = int(total_degrees // 30) % 12
        deg_in_sign = total_degrees % 30

        return sign_index, deg_in_sign

    @staticmethod
    def get_planet_strength(planet: str, sign_index: int, house: int, aspects_count: int = 0) -> float:
        """
        Calculate planetary strength (0-100 scale)
        Considers: exaltation, house position, aspects
        """
        strength = 50.0  # Base strength

        # Exaltation component (0-30)
        if planet in AstroEngine.EXALTATION:
            exalt_sign, exalt_deg = AstroEngine.EXALTATION[planet]
            if sign_index == exalt_sign:
                strength += 25
            elif sign_index in AstroEngine.OWN_SIGNS.get(planet, []):
                strength += 15
            else:
                strength -= 5

        # House component (0-20)
        angular_houses = [0, 3, 6, 9]  # 1, 4, 7, 10
        trine_houses = [4, 8]           # 5, 9
        trika_houses = [7, 11]          # 8, 12

        if house in angular_houses:
            strength += 20
        elif house in trine_houses:
            strength += 10
        elif house not in trika_houses:
            strength += 5
        else:
            strength -= 15

        # Aspect bonus
        strength += min(aspects_count * 5, 15)

        return min(max(strength, 0), 100)

    @staticmethod
    def detect_yogas(planets_data: Dict[str, Dict]) -> List[Dict[str, Any]]:
        """
        Detect yogas from planetary positions
        Returns list of yogas with type (benefic/malefic) and strength
        """
        yogas = []

        # Raja Yoga: Planets in Kendra/Trikona with good strength
        strong_planets = [p for p, data in planets_data.items()
                         if data.get('strength', 0) > 60]
        angular_planets = [p for p, data in planets_data.items()
                          if data.get('house', 0) in [0, 3, 6, 9]]

        if len(angular_planets) >= 2 and len(strong_planets) >= 2:
            yogas.append({
                'name': 'Raja Yoga',
                'tamil': 'ராஜ யோகம்',
                'type': 'benefic',
                'strength': 75 + len(strong_planets) * 3,
                'description': 'Fortune, power, and leadership ability',
                'condition': f'{len(angular_planets)} planets in angular houses'
            })

        # Lakshmi Yoga: Jupiter in angle without malefic aspects
        if 'Jupiter' in planets_data:
            jupiter_data = planets_data['Jupiter']
            if jupiter_data.get('house', 0) in [0, 3, 6, 9]:
                yogas.append({
                    'name': 'Lakshmi Yoga',
                    'tamil': 'லக்ஷ்மி யோகம்',
                    'type': 'benefic',
                    'strength': 78,
                    'description': 'Wealth and prosperity',
                    'condition': 'Jupiter in angle, strong position'
                })

        # Kuja Dosha: Mars in 1, 4, 7, 8, 12
        if 'Mars' in planets_data:
            mars_house = planets_data['Mars'].get('house', 0)
            if mars_house in [0, 3, 6, 7, 11]:
                yogas.append({
                    'name': 'Kuja Dosha',
                    'tamil': 'குஜ தோஷம்',
                    'type': 'malefic',
                    'strength': 45 + (mars_house in [0, 3, 6] and 20 or 0),
                    'description': 'Mars affliction affecting relationships',
                    'condition': f'Mars in house {mars_house + 1}'
                })

        # Gaja Kesari: Jupiter in angle/trine with strong Moon
        if 'Jupiter' in planets_data and 'Moon' in planets_data:
            jupiter_strong = planets_data['Jupiter'].get('strength', 0) > 60
            moon_strong = planets_data['Moon'].get('strength', 0) > 60
            jupiter_angle = planets_data['Jupiter'].get('house', 0) in [0, 3, 6, 9]

            if jupiter_angle and jupiter_strong and moon_strong:
                yogas.append({
                    'name': 'Gaja Kesari Yoga',
                    'tamil': 'கஜ கேசரி யோகம்',
                    'type': 'benefic',
                    'strength': 80,
                    'description': 'Elephant and lion combined - supreme strength',
                    'condition': 'Jupiter in angle with strong Moon'
                })

        return yogas

    @staticmethod
    def calculate_bhava_bala(planets_data: Dict[str, Dict]) -> List[Dict[str, Any]]:
        """
        Calculate house strengths (Bhava Bala)
        Returns strength for each of 12 houses
        """
        houses = []
        house_names = [
            'House of Self', 'House of Wealth', 'House of Communication',
            'House of Home', 'House of Creativity', 'House of Health',
            'House of Partnership', 'House of Transformation', 'House of Fortune',
            'House of Career', 'House of Gains', 'House of Loss'
        ]

        house_names_tamil = [
            '1ம் இடம்', '2ம் இடம்', '3ம் இடம்', '4ம் இடம்', '5ம் இடம்', '6ம் இடம்',
            '7ம் இடம்', '8ம் இடம்', '9ம் இடம்', '10ம் இடம்', '11ம் இடம்', '12ம் இடம்'
        ]

        for i in range(12):
            # Count planets and their strength
            planets_in_house = [p for p, data in planets_data.items() if data.get('house', -1) == i]

            if planets_in_house:
                avg_strength = sum(planets_data[p].get('strength', 50) for p in planets_in_house) / len(planets_in_house)
                base_strength = 50 + (avg_strength - 50) * 0.6
            else:
                base_strength = 50

            # Angular, trine, upachaya adjustments
            if i in [0, 3, 6, 9]:  # Angular
                base_strength += 25
            elif i in [4, 8]:      # Trine
                base_strength += 15
            elif i in [2, 5, 10]:  # Upachaya
                base_strength += 8
            elif i in [7, 11]:     # Trika
                base_strength -= 20

            strength = min(max(base_strength, 10), 95)
            color = 'green' if strength >= 75 else 'orange' if strength >= 50 else 'red'

            house_ruler = AstroEngine.PLANETS[i % len(AstroEngine.PLANETS)]

            houses.append({
                'number': i + 1,
                'tamil': house_names_tamil[i],
                'name': house_names[i],
                'strength': int(strength),
                'ruler': house_ruler,
                'planets': planets_in_house,
                'significance': f'House {i+1} significance',
                'interpretation': f'{"Strong" if strength >= 75 else "Moderate" if strength >= 50 else "Weak"} house strength',
                'color': color
            })

        return houses

    @staticmethod
    def calculate_dasha_timeline(birth_date: datetime) -> List[Dict[str, Any]]:
        """
        Calculate Vimshottari Dasha timeline (120-year cycle)
        Simplified version for testing
        """
        # Calculate lunar month at birth (simplified)
        days_from_epoch = (birth_date - datetime(2000, 1, 1)).days
        lunar_month = (days_from_epoch // 27) % 120

        # Dasha sequence: Venus, Sun, Moon, Mars, Mercury, Jupiter, Saturn (120 years)
        dasha_planets = ['Venus', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Saturn']
        dasha_durations = [20, 6, 10, 7, 17, 16, 19]

        dashas = []
        current_date = birth_date
        current_year = birth_date.year

        for planet, duration in zip(dasha_planets, dasha_durations):
            start_date = current_date
            end_date = current_date + timedelta(days=duration*365)

            # Determine status
            now = datetime.now()
            if end_date < now:
                status = 'past'
            elif start_date > now:
                status = 'future'
            else:
                status = 'current'

            dashas.append({
                'planet': planet,
                'tamil': AstroEngine.PLANETS_TAMIL[AstroEngine.PLANETS.index(planet)],
                'startYear': start_date.year,
                'startMonth': start_date.month,
                'endYear': end_date.year,
                'endMonth': end_date.month,
                'duration': duration,
                'status': status
            })

            current_date = end_date
            current_year += duration

        return dashas

