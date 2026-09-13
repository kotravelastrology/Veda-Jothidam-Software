"""
Vimshottari Dasha Calculation Engine

Calculates Vimshottari Dasha periods based on:
- Birth date and moon position (nakshatra)
- 120-year cycle
- 9 planetary periods
- Bhukti (sub-periods) and Antara (sub-sub-periods)

Vimshottari is the most commonly used dasha system in Vedic astrology.
"""

from datetime import datetime, timedelta
from dataclasses import dataclass, field
from typing import List, Optional, Tuple
from enum import Enum


class Planet(Enum):
    """The 9 planets in Vimshottari order"""
    KETU = "Ketu"
    VENUS = "Venus"
    SUN = "Sun"
    MOON = "Moon"
    MARS = "Mars"
    MERCURY = "Mercury"
    JUPITER = "Jupiter"
    SATURN = "Saturn"
    RAHU = "Rahu"


class Nakshatra(Enum):
    """27 Nakshatras (lunar mansions)"""
    ASHWINI = "Ashwini"
    BHARANI = "Bharani"
    KRITIKA = "Kritika"
    ROHINI = "Rohini"
    MRIGASHIRA = "Mrigashira"
    ARDRA = "Ardra"
    PUNARVASU = "Punarvasu"
    PUSHYA = "Pushya"
    ASHLESHA = "Ashlesha"
    MAGHA = "Magha"
    POORVAPHALGUNI = "Poorva Phalguni"
    UTTARAPHALGUNI = "Uttara Phalguni"
    HASTA = "Hasta"
    CHITRA = "Chitra"
    SWATI = "Swati"
    VISHAKHA = "Vishakha"
    ANURADHA = "Anuradha"
    JYESHTHA = "Jyeshtha"
    MULA = "Mula"
    POORVASHADHA = "Poorva Shadha"
    UTTARASHADHA = "Uttara Shadha"
    SHRAVAN = "Shravan"
    DHANISTHA = "Dhanistha"
    SHATABHISHA = "Shatabhisha"
    POORVABHADRA = "Poorva Bhadrapada"
    UTTARABHADRA = "Uttara Bhadrapada"
    REVATI = "Revati"


@dataclass
class SukshmaPeriod:
    """Suksma (finest) period within Antara"""
    planet: str
    start_date: datetime
    end_date: datetime
    duration_days: int


@dataclass
class AntaraPeriod:
    """Antara (sub-sub) period within Bhukti"""
    planet: str
    planet_tamil: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_months: int = 0
    suksma_periods: List[SukshmaPeriod] = field(default_factory=list)


@dataclass
class BhuktiPeriod:
    """Bhukti (sub) period within Mahadasha"""
    planet: str
    planet_tamil: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_years: int = 0
    duration_months: int = 0
    antara_periods: List[AntaraPeriod] = field(default_factory=list)


@dataclass
class DashaPeriod:
    """Mahadasha (major) period"""
    planet: str
    planet_tamil: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_years: int = 0
    duration_months: int = 0
    duration_days: int = 0
    status: str = 'future'  # past, current, future
    bhukti_periods: List[BhuktiPeriod] = field(default_factory=list)


class VimshottariDashaCalculator:
    """
    Vimshottari Dasha calculator

    The Vimshottari system consists of:
    - 9 planets with specific durations (total 120 years)
    - Bhukti periods within each Mahadasha
    - Antara periods within each Bhukti
    - Suksma periods within each Antara
    """

    # Dasha durations in years
    DASHA_YEARS = {
        'Ketu': 7,
        'Venus': 20,
        'Sun': 6,
        'Moon': 10,
        'Mars': 7,
        'Mercury': 17,
        'Jupiter': 16,
        'Saturn': 19,
        'Rahu': 18,
    }

    # Planet order in Vimshottari cycle
    PLANET_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Saturn', 'Rahu']

    # Nakshatra to starting planet mapping
    NAKSHATRA_PLANETS = {
        'Ashwini': 'Ketu',
        'Bharani': 'Ketu',
        'Kritika': 'Ketu',
        'Rohini': 'Venus',
        'Mrigashira': 'Venus',
        'Ardra': 'Venus',
        'Punarvasu': 'Sun',
        'Pushya': 'Sun',
        'Ashlesha': 'Sun',
        'Magha': 'Moon',
        'Poorva Phalguni': 'Moon',
        'Uttara Phalguni': 'Moon',
        'Hasta': 'Mars',
        'Chitra': 'Mars',
        'Swati': 'Mars',
        'Vishakha': 'Mercury',
        'Anuradha': 'Mercury',
        'Jyeshtha': 'Mercury',
        'Mula': 'Jupiter',
        'Poorva Shadha': 'Jupiter',
        'Uttara Shadha': 'Jupiter',
        'Shravan': 'Saturn',
        'Dhanistha': 'Saturn',
        'Shatabhisha': 'Saturn',
        'Poorva Bhadrapada': 'Rahu',
        'Uttara Bhadrapada': 'Rahu',
        'Revati': 'Rahu',
    }

    # Tamil planet names
    TAMIL_PLANET_NAMES = {
        'Ketu': 'கேது',
        'Venus': 'சுக்கிரன்',
        'Sun': 'சூரியன்',
        'Moon': 'சந்திரன்',
        'Mars': 'செவ்வாய்',
        'Mercury': 'புதன்',
        'Jupiter': 'குரு',
        'Saturn': 'சனி',
        'Rahu': 'ராகு',
    }

    def __init__(self, birth_date: datetime, moon_nakshatra: str = 'Ashwini'):
        """
        Initialize calculator with birth date and moon nakshatra

        Args:
            birth_date: Birth date and time
            moon_nakshatra: Moon's nakshatra at birth (determines starting point)
        """
        self.birth_date = birth_date
        self.moon_nakshatra = moon_nakshatra
        self.starting_planet = self.NAKSHATRA_PLANETS.get(moon_nakshatra, 'Ketu')
        self.current_date = datetime.now()

    def get_starting_planet(self) -> str:
        """Get the starting planet for Dasha based on moon nakshatra"""
        return self.starting_planet

    def calculate_current_dasha(self) -> Optional[DashaPeriod]:
        """Calculate current Dasha based on birth date and current date"""
        all_dashas = self.calculate_all_dashas()

        for dasha in all_dashas:
            if dasha.start_date and dasha.end_date:
                if dasha.start_date <= self.current_date <= dasha.end_date:
                    dasha.status = 'current'
                    return dasha

        return None

    def calculate_dasha_for_date(self, target_date: datetime) -> Optional[DashaPeriod]:
        """Get Dasha period for a specific date"""
        all_dashas = self.calculate_all_dashas()

        for dasha in all_dashas:
            if dasha.start_date and dasha.end_date:
                if dasha.start_date <= target_date <= dasha.end_date:
                    return dasha

        return None

    def calculate_all_dashas(self) -> List[DashaPeriod]:
        """Calculate all Dasha periods for 120-year cycle"""
        dashas = []
        current_date = self.birth_date

        # Find starting position
        start_index = self.PLANET_ORDER.index(self.starting_planet)

        # Calculate 120-year cycle
        for i in range(9):
            planet_index = (start_index + i) % 9
            planet = self.PLANET_ORDER[planet_index]
            duration_years = self.DASHA_YEARS[planet]

            start_date = current_date
            end_date = current_date + timedelta(days=int(duration_years * 365.25))

            dasha = DashaPeriod(
                planet=planet,
                planet_tamil=self.TAMIL_PLANET_NAMES.get(planet),
                start_date=start_date,
                end_date=end_date,
                duration_years=duration_years,
                duration_months=0,
                duration_days=0,
                status=self._determine_status(start_date, end_date)
            )

            # Calculate Bhukti periods
            dasha.bhukti_periods = self.calculate_bhukti_periods(dasha)

            dashas.append(dasha)
            current_date = end_date

        return dashas

    def calculate_bhukti_periods(self, dasha: DashaPeriod) -> List[BhuktiPeriod]:
        """Calculate Bhukti (sub) periods within a Mahadasha"""
        bhukti_periods = []

        if not dasha.start_date or not dasha.end_date:
            return bhukti_periods

        dasha_duration_days = (dasha.end_date - dasha.start_date).days
        current_date = dasha.start_date

        # Find starting planet for Bhukti
        start_index = self.PLANET_ORDER.index(dasha.planet)

        for i in range(9):
            planet_index = (start_index + i) % 9
            planet = self.PLANET_ORDER[planet_index]

            # Bhukti duration = (Bhukti planet years / 120) * Mahadasha years
            bhukti_years = (self.DASHA_YEARS[planet] / 120) * dasha.duration_years
            bhukti_days = int(bhukti_years * 365.25)

            start_date = current_date
            end_date = current_date + timedelta(days=bhukti_days)

            # Ensure we don't exceed dasha end date
            if end_date > dasha.end_date:
                end_date = dasha.end_date

            bhukti_years_int = int(bhukti_years)
            bhukti_months = int((bhukti_years - bhukti_years_int) * 12)

            bhukti = BhuktiPeriod(
                planet=planet,
                planet_tamil=self.TAMIL_PLANET_NAMES.get(planet),
                start_date=start_date,
                end_date=end_date,
                duration_years=bhukti_years_int,
                duration_months=bhukti_months,
                antara_periods=[]
            )

            # Calculate Antara periods
            bhukti.antara_periods = self.calculate_antara_periods(bhukti)

            bhukti_periods.append(bhukti)
            current_date = end_date

            if current_date >= dasha.end_date:
                break

        return bhukti_periods

    def calculate_antara_periods(self, bhukti: BhuktiPeriod) -> List[AntaraPeriod]:
        """Calculate Antara (sub-sub) periods within a Bhukti"""
        antara_periods = []

        if not bhukti.start_date or not bhukti.end_date:
            return antara_periods

        current_date = bhukti.start_date
        bhukti_duration_days = (bhukti.end_date - bhukti.start_date).days

        # Find starting planet for Antara
        start_index = self.PLANET_ORDER.index(bhukti.planet)

        for i in range(9):
            planet_index = (start_index + i) % 9
            planet = self.PLANET_ORDER[planet_index]

            # Antara duration = (Antara planet years / 120) * Bhukti years
            bhukti_duration_years = bhukti.duration_years + (bhukti.duration_months / 12)
            antara_years = (self.DASHA_YEARS[planet] / 120) * bhukti_duration_years
            antara_days = int(antara_years * 365.25)

            start_date = current_date
            end_date = current_date + timedelta(days=antara_days)

            # Ensure we don't exceed bhukti end date
            if end_date > bhukti.end_date:
                end_date = bhukti.end_date

            antara_months = int(antara_years * 12)

            antara = AntaraPeriod(
                planet=planet,
                planet_tamil=self.TAMIL_PLANET_NAMES.get(planet),
                start_date=start_date,
                end_date=end_date,
                duration_months=antara_months,
                suksma_periods=[]
            )

            antara_periods.append(antara)
            current_date = end_date

            if current_date >= bhukti.end_date:
                break

        return antara_periods

    def get_dasha_summary(self, dasha: DashaPeriod) -> dict:
        """Get summary information about a Dasha period"""
        return {
            'planet': dasha.planet,
            'tamil': dasha.planet_tamil,
            'start_date': dasha.start_date.isoformat() if dasha.start_date else None,
            'end_date': dasha.end_date.isoformat() if dasha.end_date else None,
            'duration_years': dasha.duration_years,
            'status': dasha.status,
            'bhukti_count': len(dasha.bhukti_periods),
            'total_antara_count': sum(len(b.antara_periods) for b in dasha.bhukti_periods),
        }

    def _determine_status(self, start_date: datetime, end_date: datetime) -> str:
        """Determine if period is past, current, or future"""
        if end_date < self.current_date:
            return 'past'
        elif start_date <= self.current_date <= end_date:
            return 'current'
        else:
            return 'future'

    def get_remaining_dasha_time(self, dasha: DashaPeriod) -> Optional[dict]:
        """Get remaining time in current Dasha period"""
        if dasha.status != 'current' or not dasha.end_date:
            return None

        remaining = dasha.end_date - self.current_date
        days = remaining.days
        years = days // 365
        months = (days % 365) // 30
        remaining_days = days % 30

        return {
            'years': years,
            'months': months,
            'days': remaining_days,
            'total_days': days,
        }

    def get_next_dasha(self, current_dasha: DashaPeriod, all_dashas: List[DashaPeriod]) -> Optional[DashaPeriod]:
        """Get next Dasha period"""
        current_index = all_dashas.index(current_dasha)
        if current_index < len(all_dashas) - 1:
            return all_dashas[current_index + 1]
        return None


def create_dasha_calculator(birth_date: datetime, moon_nakshatra: str = 'Ashwini') -> VimshottariDashaCalculator:
    """Factory function to create Dasha calculator"""
    return VimshottariDashaCalculator(birth_date, moon_nakshatra)
