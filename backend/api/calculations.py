"""
Calculation API Endpoints

REST API for Dasha and Shadbala calculations
- Vimshottari Dasha periods
- Shadbala (6-fold planetary strength)
- Combined astrological calculations
- Batch processing support
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from typing import Dict, List, Any
import traceback

from backend.calculations.dasha import (
    VimshottariDashaCalculator,
    DashaPeriod,
    BhuktiPeriod,
    AntaraPeriod,
)
from backend.calculations.planetary_strength import (
    ShadbalaCalculator,
    PlanetaryStrength,
)


# Create Blueprint for calculations
calculations_bp = Blueprint('calculations', __name__, url_prefix='/api/calculations')


# Helper functions
def serialize_datetime(dt: datetime) -> str:
    """Serialize datetime to ISO format"""
    return dt.isoformat() if dt else None


def serialize_dasha_period(dasha: DashaPeriod) -> Dict[str, Any]:
    """Serialize DashaPeriod to JSON"""
    return {
        'planet': dasha.planet,
        'planet_tamil': dasha.planet_tamil,
        'start_date': serialize_datetime(dasha.start_date),
        'end_date': serialize_datetime(dasha.end_date),
        'duration_years': dasha.duration_years,
        'duration_months': dasha.duration_months,
        'duration_days': dasha.duration_days,
        'status': dasha.status,
        'bhukti_periods': [serialize_bhukti_period(b) for b in dasha.bhukti_periods],
    }


def serialize_bhukti_period(bhukti: BhuktiPeriod) -> Dict[str, Any]:
    """Serialize BhuktiPeriod to JSON"""
    return {
        'planet': bhukti.planet,
        'planet_tamil': bhukti.planet_tamil,
        'start_date': serialize_datetime(bhukti.start_date),
        'end_date': serialize_datetime(bhukti.end_date),
        'duration_years': bhukti.duration_years,
        'duration_months': bhukti.duration_months,
        'antara_periods': [serialize_antara_period(a) for a in bhukti.antara_periods],
    }


def serialize_antara_period(antara: AntaraPeriod) -> Dict[str, Any]:
    """Serialize AntaraPeriod to JSON"""
    return {
        'planet': antara.planet,
        'planet_tamil': antara.planet_tamil,
        'start_date': serialize_datetime(antara.start_date),
        'end_date': serialize_datetime(antara.end_date),
        'duration_months': antara.duration_months,
    }


def serialize_planetary_strength(strength: PlanetaryStrength) -> Dict[str, Any]:
    """Serialize PlanetaryStrength to JSON"""
    return {
        'planet': strength.planet,
        'sign': strength.sign,
        'longitude': strength.longitude,
        'house': strength.house,
        'retrograde': strength.retrograde,
        'combust': strength.combust,
        'exaltation': strength.exaltation,
        'debilitation': strength.debilitation,
        'moolatrikona': strength.moolatrikona,
        'own_sign': strength.own_sign,
        'components': {
            'sthana_bala': round(strength.sthana_bala, 2),
            'dik_bala': round(strength.dik_bala, 2),
            'kala_bala': round(strength.kala_bala, 2),
            'chesta_bala': round(strength.chesta_bala, 2),
            'naisargika_bala': round(strength.naisargika_bala, 2),
            'drishti_bala': round(strength.drishti_bala, 2),
        },
        'total_strength': round(strength.total_strength, 2),
        'strength_status': strength.strength_status,
        'dignity_status': strength.dignity_status,
        'aspect_value': round(strength.aspect_value, 2),
        'aspects_from': strength.aspects_from,
        'aspects_to': strength.aspects_to,
    }


def error_response(message: str, status_code: int = 400, details: str = None) -> tuple:
    """Generate error response"""
    response = {
        'success': False,
        'error': message,
    }
    if details:
        response['details'] = details
    return jsonify(response), status_code


def success_response(data: Any = None, message: str = 'Success') -> tuple:
    """Generate success response"""
    return jsonify({
        'success': True,
        'message': message,
        'data': data,
    }), 200


# ==================== DASHA ENDPOINTS ====================

@calculations_bp.route('/dasha/current', methods=['POST'])
def get_current_dasha():
    """
    Get current Dasha period

    Request body:
    {
        "birth_date": "1990-05-15T10:30:00",
        "moon_nakshatra": "Ashwini"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return error_response('Request body required')

        birth_date_str = data.get('birth_date')
        moon_nakshatra = data.get('moon_nakshatra', 'Ashwini')

        if not birth_date_str:
            return error_response('birth_date is required')

        # Parse birth date
        try:
            birth_date = datetime.fromisoformat(birth_date_str)
        except ValueError:
            return error_response('Invalid date format. Use ISO format: YYYY-MM-DDTHH:MM:SS')

        # Calculate current Dasha
        calculator = VimshottariDashaCalculator(birth_date, moon_nakshatra)
        current_dasha = calculator.calculate_current_dasha()

        if not current_dasha:
            return success_response(None, 'No current Dasha found')

        result = {
            'current_dasha': serialize_dasha_period(current_dasha),
            'summary': calculator.get_dasha_summary(current_dasha),
        }

        # Add remaining time if current
        if current_dasha.status == 'current':
            remaining = calculator.get_remaining_dasha_time(current_dasha)
            result['remaining_time'] = remaining

        return success_response(result, 'Current Dasha calculated successfully')

    except Exception as e:
        return error_response(
            'Error calculating current Dasha',
            500,
            str(e)
        )


@calculations_bp.route('/dasha/for-date', methods=['POST'])
def get_dasha_for_date():
    """
    Get Dasha period for a specific date

    Request body:
    {
        "birth_date": "1990-05-15T10:30:00",
        "moon_nakshatra": "Ashwini",
        "target_date": "2026-09-13T12:00:00"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return error_response('Request body required')

        birth_date_str = data.get('birth_date')
        target_date_str = data.get('target_date')
        moon_nakshatra = data.get('moon_nakshatra', 'Ashwini')

        if not birth_date_str or not target_date_str:
            return error_response('birth_date and target_date are required')

        # Parse dates
        try:
            birth_date = datetime.fromisoformat(birth_date_str)
            target_date = datetime.fromisoformat(target_date_str)
        except ValueError:
            return error_response('Invalid date format. Use ISO format: YYYY-MM-DDTHH:MM:SS')

        # Calculate Dasha for date
        calculator = VimshottariDashaCalculator(birth_date, moon_nakshatra)
        dasha = calculator.calculate_dasha_for_date(target_date)

        if not dasha:
            return success_response(None, 'No Dasha found for given date')

        result = {
            'dasha': serialize_dasha_period(dasha),
            'summary': calculator.get_dasha_summary(dasha),
            'target_date': target_date_str,
        }

        return success_response(result, 'Dasha for date calculated successfully')

    except Exception as e:
        return error_response(
            'Error calculating Dasha for date',
            500,
            str(e)
        )


@calculations_bp.route('/dasha/all-cycles', methods=['POST'])
def get_all_dasha_cycles():
    """
    Get all Dasha cycles (120-year cycle)

    Request body:
    {
        "birth_date": "1990-05-15T10:30:00",
        "moon_nakshatra": "Ashwini"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return error_response('Request body required')

        birth_date_str = data.get('birth_date')
        moon_nakshatra = data.get('moon_nakshatra', 'Ashwini')

        if not birth_date_str:
            return error_response('birth_date is required')

        # Parse birth date
        try:
            birth_date = datetime.fromisoformat(birth_date_str)
        except ValueError:
            return error_response('Invalid date format. Use ISO format: YYYY-MM-DDTHH:MM:SS')

        # Calculate all Dashas
        calculator = VimshottariDashaCalculator(birth_date, moon_nakshatra)
        all_dashas = calculator.calculate_all_dashas()

        result = {
            'total_cycles': 9,
            'birth_date': birth_date_str,
            'moon_nakshatra': moon_nakshatra,
            'starting_planet': calculator.get_starting_planet(),
            'dashas': [serialize_dasha_period(d) for d in all_dashas],
        }

        return success_response(result, 'All Dasha cycles calculated successfully')

    except Exception as e:
        return error_response(
            'Error calculating all Dasha cycles',
            500,
            str(e)
        )


@calculations_bp.route('/dasha/bhukti', methods=['POST'])
def get_bhukti_periods():
    """
    Get Bhukti periods for a specific Dasha

    Request body:
    {
        "birth_date": "1990-05-15T10:30:00",
        "moon_nakshatra": "Ashwini",
        "dasha_planet": "Mercury"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return error_response('Request body required')

        birth_date_str = data.get('birth_date')
        moon_nakshatra = data.get('moon_nakshatra', 'Ashwini')
        dasha_planet = data.get('dasha_planet')

        if not birth_date_str or not dasha_planet:
            return error_response('birth_date and dasha_planet are required')

        # Parse birth date
        try:
            birth_date = datetime.fromisoformat(birth_date_str)
        except ValueError:
            return error_response('Invalid date format. Use ISO format: YYYY-MM-DDTHH:MM:SS')

        # Calculate all Dashas and find the one we want
        calculator = VimshottariDashaCalculator(birth_date, moon_nakshatra)
        all_dashas = calculator.calculate_all_dashas()

        dasha = next((d for d in all_dashas if d.planet == dasha_planet), None)

        if not dasha:
            return error_response(f'Dasha planet "{dasha_planet}" not found')

        result = {
            'dasha_planet': dasha_planet,
            'bhukti_count': len(dasha.bhukti_periods),
            'bhukti_periods': [serialize_bhukti_period(b) for b in dasha.bhukti_periods],
        }

        return success_response(result, 'Bhukti periods calculated successfully')

    except Exception as e:
        return error_response(
            'Error calculating Bhukti periods',
            500,
            str(e)
        )


# ==================== SHADBALA ENDPOINTS ====================

@calculations_bp.route('/shadbala/single-planet', methods=['POST'])
def get_single_planet_strength():
    """
    Get Shadbala for a single planet

    Request body:
    {
        "planet": "Mercury",
        "sign": "Virgo",
        "longitude": 145.5,
        "house": 3,
        "retrograde": false,
        "birth_date": "1990-05-15T10:30:00"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return error_response('Request body required')

        planet = data.get('planet')
        sign = data.get('sign')
        longitude = data.get('longitude', 0)
        house = data.get('house', 1)
        retrograde = data.get('retrograde', False)
        birth_date_str = data.get('birth_date')

        if not planet or not sign:
            return error_response('planet and sign are required')

        # Parse birth date if provided
        birth_date = None
        if birth_date_str:
            try:
                birth_date = datetime.fromisoformat(birth_date_str)
            except ValueError:
                return error_response('Invalid date format. Use ISO format: YYYY-MM-DDTHH:MM:SS')

        # Calculate Shadbala
        calculator = ShadbalaCalculator(birth_date)
        strength = calculator.calculate_planetary_strength(
            planet=planet,
            sign=sign,
            longitude=longitude,
            house=house,
            retrograde=retrograde,
        )

        result = serialize_planetary_strength(strength)

        return success_response(result, 'Planetary strength calculated successfully')

    except Exception as e:
        return error_response(
            'Error calculating planetary strength',
            500,
            str(e)
        )


@calculations_bp.route('/shadbala/all-planets', methods=['POST'])
def get_all_planets_strength():
    """
    Get Shadbala for all planets

    Request body:
    {
        "planets": [
            {
                "planet": "Sun",
                "sign": "Leo",
                "longitude": 135.0,
                "house": 1,
                "retrograde": false
            },
            ...
        ],
        "birth_date": "1990-05-15T10:30:00"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return error_response('Request body required')

        planets_data = data.get('planets', [])
        birth_date_str = data.get('birth_date')

        if not planets_data:
            return error_response('planets array is required')

        # Parse birth date if provided
        birth_date = None
        if birth_date_str:
            try:
                birth_date = datetime.fromisoformat(birth_date_str)
            except ValueError:
                return error_response('Invalid date format. Use ISO format: YYYY-MM-DDTHH:MM:SS')

        # Validate planets data
        for planet_data in planets_data:
            if 'planet' not in planet_data or 'sign' not in planet_data:
                return error_response('Each planet must have planet and sign')

        # Calculate Shadbala for all planets
        calculator = ShadbalaCalculator(birth_date)
        strengths = calculator.calculate_all_planets_strength(planets_data)

        # Rank by strength
        ranked = calculator.rank_planets_by_strength(strengths)

        result = {
            'total_planets': len(strengths),
            'planets': [serialize_planetary_strength(s) for s in strengths],
            'ranked': [serialize_planetary_strength(s) for s in ranked],
        }

        return success_response(result, 'All planetary strengths calculated successfully')

    except Exception as e:
        return error_response(
            'Error calculating all planetary strengths',
            500,
            str(e)
        )


@calculations_bp.route('/shadbala/interpretation', methods=['POST'])
def get_strength_interpretation():
    """
    Get interpretation for a strength value

    Request body:
    {
        "strength": 78.5
    }
    """
    try:
        data = request.get_json()

        if not data:
            return error_response('Request body required')

        strength = data.get('strength')

        if strength is None:
            return error_response('strength is required')

        try:
            strength = float(strength)
        except (ValueError, TypeError):
            return error_response('strength must be a number')

        if not (0 <= strength <= 100):
            return error_response('strength must be between 0 and 100')

        # Get interpretation
        calculator = ShadbalaCalculator()
        interpretation = calculator.get_strength_interpretation(strength)

        return success_response(interpretation, 'Strength interpretation retrieved successfully')

    except Exception as e:
        return error_response(
            'Error retrieving strength interpretation',
            500,
            str(e)
        )


# ==================== COMBINED ENDPOINTS ====================

@calculations_bp.route('/complete-analysis', methods=['POST'])
def get_complete_analysis():
    """
    Get complete astrological analysis (Dasha + Shadbala)

    Request body:
    {
        "birth_date": "1990-05-15T10:30:00",
        "moon_nakshatra": "Ashwini",
        "planets": [
            {
                "planet": "Sun",
                "sign": "Leo",
                "longitude": 135.0,
                "house": 1,
                "retrograde": false
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()

        if not data:
            return error_response('Request body required')

        birth_date_str = data.get('birth_date')
        moon_nakshatra = data.get('moon_nakshatra', 'Ashwini')
        planets_data = data.get('planets', [])

        if not birth_date_str:
            return error_response('birth_date is required')

        # Parse birth date
        try:
            birth_date = datetime.fromisoformat(birth_date_str)
        except ValueError:
            return error_response('Invalid date format. Use ISO format: YYYY-MM-DDTHH:MM:SS')

        # Calculate Dasha
        dasha_calculator = VimshottariDashaCalculator(birth_date, moon_nakshatra)
        current_dasha = dasha_calculator.calculate_current_dasha()
        all_dashas = dasha_calculator.calculate_all_dashas()

        # Calculate Shadbala
        shadbala_calculator = ShadbalaCalculator(birth_date)
        planetary_strengths = shadbala_calculator.calculate_all_planets_strength(planets_data)
        ranked_strengths = shadbala_calculator.rank_planets_by_strength(planetary_strengths)

        result = {
            'birth_date': birth_date_str,
            'dasha': {
                'current_dasha': serialize_dasha_period(current_dasha) if current_dasha else None,
                'all_dashas': [serialize_dasha_period(d) for d in all_dashas],
            },
            'shadbala': {
                'planets': [serialize_planetary_strength(s) for s in planetary_strengths],
                'ranked': [serialize_planetary_strength(s) for s in ranked_strengths],
            },
        }

        return success_response(result, 'Complete analysis calculated successfully')

    except Exception as e:
        return error_response(
            'Error calculating complete analysis',
            500,
            str(e)
        )


# ==================== HEALTH CHECK ====================

@calculations_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return success_response({
        'status': 'healthy',
        'endpoints': {
            'dasha': {
                'current': 'POST /api/calculations/dasha/current',
                'for-date': 'POST /api/calculations/dasha/for-date',
                'all-cycles': 'POST /api/calculations/dasha/all-cycles',
                'bhukti': 'POST /api/calculations/dasha/bhukti',
            },
            'shadbala': {
                'single-planet': 'POST /api/calculations/shadbala/single-planet',
                'all-planets': 'POST /api/calculations/shadbala/all-planets',
                'interpretation': 'POST /api/calculations/shadbala/interpretation',
            },
            'combined': {
                'complete-analysis': 'POST /api/calculations/complete-analysis',
            },
        },
    }, 'API is operational')
