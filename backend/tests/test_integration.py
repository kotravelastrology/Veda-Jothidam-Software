"""
Integration Tests for Veda Jothidam Calculation Components

Tests:
- Dasha calculator with various inputs
- Shadbala calculator with various inputs
- API endpoints with real requests
- Data serialization and deserialization
- Error handling and validation
- Complete workflows
"""

import pytest
import json
from datetime import datetime, timedelta
from calculations.dasha import (
    VimshottariDashaCalculator,
    DashaPeriod,
)
from calculations.planetary_strength import (
    ShadbalaCalculator,
    PlanetaryStrength,
)
from app import create_app


# ==================== FIXTURES ====================

@pytest.fixture
def app():
    """Create Flask test app"""
    app = create_app({'TESTING': True})
    return app


@pytest.fixture
def client(app):
    """Create Flask test client"""
    return app.test_client()


@pytest.fixture
def sample_birth_date():
    """Sample birth date for testing"""
    return datetime(1990, 5, 15, 10, 30, 0)


@pytest.fixture
def sample_planets_data():
    """Sample planetary positions"""
    return [
        {'planet': 'Sun', 'sign': 'Leo', 'longitude': 135.0, 'house': 1, 'retrograde': False},
        {'planet': 'Moon', 'sign': 'Taurus', 'longitude': 45.0, 'house': 3, 'retrograde': False},
        {'planet': 'Mars', 'sign': 'Aries', 'longitude': 15.0, 'house': 2, 'retrograde': False},
        {'planet': 'Mercury', 'sign': 'Virgo', 'longitude': 145.0, 'house': 4, 'retrograde': False},
        {'planet': 'Jupiter', 'sign': 'Sagittarius', 'longitude': 255.0, 'house': 8, 'retrograde': False},
        {'planet': 'Venus', 'sign': 'Libra', 'longitude': 195.0, 'house': 5, 'retrograde': False},
        {'planet': 'Saturn', 'sign': 'Aquarius', 'longitude': 315.0, 'house': 10, 'retrograde': False},
    ]


# ==================== DASHA CALCULATOR TESTS ====================

class TestDashaCalculator:
    """Test Dasha calculation engine"""

    def test_calculator_initialization(self, sample_birth_date):
        """Test calculator can be initialized"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        assert calc.birth_date == sample_birth_date
        assert calc.moon_nakshatra == 'Ashwini'
        assert calc.starting_planet == 'Ketu'

    def test_starting_planet_mapping(self):
        """Test nakshatra to planet mapping"""
        calc = VimshottariDashaCalculator(datetime.now(), 'Rohini')
        assert calc.get_starting_planet() == 'Venus'

        calc = VimshottariDashaCalculator(datetime.now(), 'Punarvasu')
        assert calc.get_starting_planet() == 'Sun'

    def test_calculate_current_dasha(self, sample_birth_date):
        """Test current Dasha calculation"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        dasha = calc.calculate_current_dasha()

        assert dasha is not None
        assert dasha.planet in calc.PLANET_ORDER
        assert dasha.start_date is not None
        assert dasha.end_date is not None
        assert dasha.duration_years > 0
        assert dasha.status == 'current'

    def test_calculate_all_dashas(self, sample_birth_date):
        """Test all 120-year cycle calculation"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        dashas = calc.calculate_all_dashas()

        assert len(dashas) == 9
        assert dashas[0].planet == 'Ketu'

        # Verify durations
        total_years = sum(d.duration_years for d in dashas)
        assert total_years == 120

        # Verify dates are sequential
        for i in range(len(dashas) - 1):
            assert dashas[i].end_date == dashas[i + 1].start_date

    def test_dasha_for_specific_date(self, sample_birth_date):
        """Test Dasha calculation for specific date"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')

        # Test date 5 years after birth
        test_date = sample_birth_date + timedelta(days=5*365)
        dasha = calc.calculate_dasha_for_date(test_date)

        assert dasha is not None
        assert dasha.start_date <= test_date <= dasha.end_date

    def test_bhukti_calculation(self, sample_birth_date):
        """Test Bhukti period calculation"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        dashas = calc.calculate_all_dashas()

        # Get first Dasha
        dasha = dashas[0]
        assert len(dasha.bhukti_periods) == 9

        # Verify Bhukti durations are correct
        for bhukti in dasha.bhukti_periods:
            assert bhukti.planet in calc.PLANET_ORDER
            assert bhukti.duration_years >= 0
            assert bhukti.duration_months >= 0

    def test_antara_calculation(self, sample_birth_date):
        """Test Antara period calculation"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        dashas = calc.calculate_all_dashas()

        # Get first Dasha's first Bhukti
        bhukti = dashas[0].bhukti_periods[0]
        assert len(bhukti.antara_periods) > 0

        # Verify Antara periods
        for antara in bhukti.antara_periods:
            assert antara.planet in calc.PLANET_ORDER
            assert antara.duration_months > 0

    def test_dasha_summary(self, sample_birth_date):
        """Test dasha summary generation"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        dasha = calc.calculate_current_dasha()
        summary = calc.get_dasha_summary(dasha)

        assert 'planet' in summary
        assert 'duration_years' in summary
        assert 'status' in summary
        assert summary['bhukti_count'] > 0

    def test_remaining_dasha_time(self, sample_birth_date):
        """Test remaining time calculation for current Dasha"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        dasha = calc.calculate_current_dasha()

        if dasha.status == 'current':
            remaining = calc.get_remaining_dasha_time(dasha)
            assert remaining is not None
            assert remaining['total_days'] > 0
            assert remaining['years'] >= 0
            assert remaining['months'] >= 0

    def test_different_nakshatras(self, sample_birth_date):
        """Test different nakshatra starting points"""
        nakshatras = ['Ashwini', 'Rohini', 'Kritika', 'Mula', 'Revati']

        for nakshatra in nakshatras:
            calc = VimshottariDashaCalculator(sample_birth_date, nakshatra)
            dashas = calc.calculate_all_dashas()

            assert len(dashas) == 9
            total_years = sum(d.duration_years for d in dashas)
            assert total_years == 120


# ==================== SHADBALA CALCULATOR TESTS ====================

class TestShadbalaCalculator:
    """Test Shadbala calculation engine"""

    def test_calculator_initialization(self, sample_birth_date):
        """Test calculator can be initialized"""
        calc = ShadbalaCalculator(sample_birth_date)
        assert calc.birth_date == sample_birth_date

    def test_single_planet_strength(self, sample_birth_date, sample_planets_data):
        """Test strength calculation for single planet"""
        calc = ShadbalaCalculator(sample_birth_date)
        planet_data = sample_planets_data[0]

        strength = calc.calculate_planetary_strength(
            planet=planet_data['planet'],
            sign=planet_data['sign'],
            longitude=planet_data['longitude'],
            house=planet_data['house'],
            retrograde=planet_data['retrograde'],
        )

        assert isinstance(strength, PlanetaryStrength)
        assert strength.planet == 'Sun'
        assert strength.sign == 'Leo'
        assert 0 <= strength.total_strength <= 100
        assert strength.strength_status in ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong']

    def test_all_shadbala_components(self, sample_birth_date, sample_planets_data):
        """Test all 6 Shadbala components"""
        calc = ShadbalaCalculator(sample_birth_date)
        planet_data = sample_planets_data[0]

        strength = calc.calculate_planetary_strength(
            planet=planet_data['planet'],
            sign=planet_data['sign'],
            longitude=planet_data['longitude'],
            house=planet_data['house'],
        )

        # Verify all 6 components exist and are valid
        assert 0 <= strength.sthana_bala <= 100
        assert 0 <= strength.dik_bala <= 100
        assert 0 <= strength.kala_bala <= 100
        assert 0 <= strength.chesta_bala <= 100
        assert 0 <= strength.naisargika_bala <= 100
        assert 0 <= strength.drishti_bala <= 100

    def test_all_planets_strength(self, sample_birth_date, sample_planets_data):
        """Test strength calculation for all planets"""
        calc = ShadbalaCalculator(sample_birth_date)
        strengths = calc.calculate_all_planets_strength(sample_planets_data)

        assert len(strengths) == len(sample_planets_data)
        for strength in strengths:
            assert isinstance(strength, PlanetaryStrength)
            assert 0 <= strength.total_strength <= 100

    def test_planet_ranking(self, sample_birth_date, sample_planets_data):
        """Test planet ranking by strength"""
        calc = ShadbalaCalculator(sample_birth_date)
        strengths = calc.calculate_all_planets_strength(sample_planets_data)
        ranked = calc.rank_planets_by_strength(strengths)

        # Verify ranking is sorted by strength (descending)
        for i in range(len(ranked) - 1):
            assert ranked[i].total_strength >= ranked[i + 1].total_strength

    def test_exaltation_detection(self, sample_birth_date):
        """Test exaltation sign detection"""
        calc = ShadbalaCalculator(sample_birth_date)

        # Sun is exalted in Aries
        strength = calc.calculate_planetary_strength(
            planet='Sun',
            sign='Aries',
            longitude=10.0,
            house=1,
        )

        assert strength.dignity_status == 'Exalted'

    def test_debilitation_detection(self, sample_birth_date):
        """Test debilitation sign detection"""
        calc = ShadbalaCalculator(sample_birth_date)

        # Sun is debilitated in Libra
        strength = calc.calculate_planetary_strength(
            planet='Sun',
            sign='Libra',
            longitude=180.0,
            house=7,
        )

        assert strength.dignity_status == 'Debilitated'

    def test_own_sign_detection(self, sample_birth_date):
        """Test own sign detection"""
        calc = ShadbalaCalculator(sample_birth_date)

        # Sun is own sign in Leo
        strength = calc.calculate_planetary_strength(
            planet='Sun',
            sign='Leo',
            longitude=135.0,
            house=1,
        )

        assert strength.dignity_status == 'Own Sign'

    def test_retrograde_effect(self, sample_birth_date):
        """Test retrograde status effect on strength"""
        calc = ShadbalaCalculator(sample_birth_date)

        # Non-retrograde
        strength_direct = calc.calculate_planetary_strength(
            planet='Mars',
            sign='Aries',
            longitude=15.0,
            house=2,
            retrograde=False,
        )

        # Retrograde
        strength_retrograde = calc.calculate_planetary_strength(
            planet='Mars',
            sign='Aries',
            longitude=15.0,
            house=2,
            retrograde=True,
        )

        # Retrograde should have lower Chesta Bala
        assert strength_retrograde.chesta_bala < strength_direct.chesta_bala

    def test_strength_interpretation(self, sample_birth_date):
        """Test strength interpretation"""
        calc = ShadbalaCalculator(sample_birth_date)

        # Very Strong
        interp = calc.get_strength_interpretation(90)
        assert interp['status'] == 'Very Strong'
        assert interp['color'] == 'green'

        # Moderate
        interp = calc.get_strength_interpretation(60)
        assert interp['status'] == 'Moderate'
        assert interp['color'] == 'yellow'

        # Very Weak
        interp = calc.get_strength_interpretation(20)
        assert interp['status'] == 'Very Weak'
        assert interp['color'] == 'red'

    def test_strength_breakdown(self, sample_birth_date, sample_planets_data):
        """Test strength component breakdown"""
        calc = ShadbalaCalculator(sample_birth_date)
        planet_data = sample_planets_data[0]

        strength = calc.calculate_planetary_strength(
            planet=planet_data['planet'],
            sign=planet_data['sign'],
            longitude=planet_data['longitude'],
            house=planet_data['house'],
        )

        breakdown = calc.get_strength_breakdown(strength)

        assert breakdown.sthana_bala == strength.sthana_bala
        assert breakdown.dik_bala == strength.dik_bala
        assert breakdown.kala_bala == strength.kala_bala
        assert breakdown.chesta_bala == strength.chesta_bala
        assert breakdown.naisargika_bala == strength.naisargika_bala
        assert breakdown.drishti_bala == strength.drishti_bala


# ==================== API ENDPOINT TESTS ====================

class TestDashaAPIEndpoints:
    """Test Dasha API endpoints"""

    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get('/api/calculations/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'endpoints' in data['data']

    def test_current_dasha_endpoint(self, client, sample_birth_date):
        """Test current Dasha endpoint"""
        payload = {
            'birth_date': sample_birth_date.isoformat(),
            'moon_nakshatra': 'Ashwini',
        }

        response = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'data' in data
        assert data['data']['current_dasha'] is not None

    def test_current_dasha_invalid_date(self, client):
        """Test current Dasha with invalid date"""
        payload = {
            'birth_date': 'invalid-date',
            'moon_nakshatra': 'Ashwini',
        }

        response = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False

    def test_dasha_for_date_endpoint(self, client, sample_birth_date):
        """Test Dasha for specific date endpoint"""
        target_date = sample_birth_date + timedelta(days=365*5)
        payload = {
            'birth_date': sample_birth_date.isoformat(),
            'moon_nakshatra': 'Ashwini',
            'target_date': target_date.isoformat(),
        }

        response = client.post(
            '/api/calculations/dasha/for-date',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert data['data']['dasha'] is not None

    def test_all_dashas_endpoint(self, client, sample_birth_date):
        """Test all Dashas endpoint"""
        payload = {
            'birth_date': sample_birth_date.isoformat(),
            'moon_nakshatra': 'Ashwini',
        }

        response = client.post(
            '/api/calculations/dasha/all-cycles',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert len(data['data']['dashas']) == 9

    def test_bhukti_endpoint(self, client, sample_birth_date):
        """Test Bhukti periods endpoint"""
        payload = {
            'birth_date': sample_birth_date.isoformat(),
            'moon_nakshatra': 'Ashwini',
            'dasha_planet': 'Ketu',
        }

        response = client.post(
            '/api/calculations/dasha/bhukti',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert data['data']['bhukti_count'] == 9


class TestShadbalaAPIEndpoints:
    """Test Shadbala API endpoints"""

    def test_single_planet_endpoint(self, client, sample_birth_date):
        """Test single planet strength endpoint"""
        payload = {
            'planet': 'Mercury',
            'sign': 'Virgo',
            'longitude': 145.5,
            'house': 3,
            'retrograde': False,
            'birth_date': sample_birth_date.isoformat(),
        }

        response = client.post(
            '/api/calculations/shadbala/single-planet',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert data['data']['planet'] == 'Mercury'
        assert 'components' in data['data']

    def test_all_planets_endpoint(self, client, sample_birth_date, sample_planets_data):
        """Test all planets strength endpoint"""
        payload = {
            'planets': sample_planets_data,
            'birth_date': sample_birth_date.isoformat(),
        }

        response = client.post(
            '/api/calculations/shadbala/all-planets',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'planets' in data['data']
        assert 'ranked' in data['data']
        assert len(data['data']['planets']) == len(sample_planets_data)

    def test_interpretation_endpoint(self, client):
        """Test strength interpretation endpoint"""
        payload = {'strength': 78.5}

        response = client.post(
            '/api/calculations/shadbala/interpretation',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'status' in data['data']
        assert 'color' in data['data']


class TestCompleteAnalysisEndpoint:
    """Test combined analysis endpoint"""

    def test_complete_analysis(self, client, sample_birth_date, sample_planets_data):
        """Test complete analysis endpoint"""
        payload = {
            'birth_date': sample_birth_date.isoformat(),
            'moon_nakshatra': 'Ashwini',
            'planets': sample_planets_data,
        }

        response = client.post(
            '/api/calculations/complete-analysis',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'dasha' in data['data']
        assert 'shadbala' in data['data']
        assert data['data']['dasha']['all_dashas'] is not None
        assert data['data']['shadbala']['planets'] is not None


# ==================== DATA SERIALIZATION TESTS ====================

class TestDataSerialization:
    """Test data serialization and deserialization"""

    def test_dasha_serialization(self, sample_birth_date):
        """Test Dasha period serialization"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        dasha = calc.calculate_current_dasha()

        # Convert to dict
        data = {
            'planet': dasha.planet,
            'start_date': dasha.start_date.isoformat() if dasha.start_date else None,
            'end_date': dasha.end_date.isoformat() if dasha.end_date else None,
            'duration_years': dasha.duration_years,
        }

        # Verify serialization works
        json_str = json.dumps(data)
        parsed = json.loads(json_str)

        assert parsed['planet'] == dasha.planet
        assert parsed['duration_years'] == dasha.duration_years

    def test_planetary_strength_serialization(self, sample_birth_date):
        """Test planetary strength serialization"""
        calc = ShadbalaCalculator(sample_birth_date)
        strength = calc.calculate_planetary_strength(
            planet='Sun',
            sign='Leo',
            longitude=135.0,
            house=1,
        )

        # Convert to dict
        data = {
            'planet': strength.planet,
            'sign': strength.sign,
            'total_strength': round(strength.total_strength, 2),
            'components': {
                'sthana_bala': round(strength.sthana_bala, 2),
                'dik_bala': round(strength.dik_bala, 2),
            },
        }

        # Verify serialization works
        json_str = json.dumps(data)
        parsed = json.loads(json_str)

        assert parsed['planet'] == strength.planet
        assert parsed['total_strength'] > 0


# ==================== ERROR HANDLING TESTS ====================

class TestErrorHandling:
    """Test error handling and validation"""

    def test_missing_required_fields(self, client):
        """Test missing required fields"""
        payload = {'moon_nakshatra': 'Ashwini'}  # Missing birth_date

        response = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps(payload),
            content_type='application/json',
        )

        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False

    def test_invalid_endpoint(self, client):
        """Test invalid endpoint"""
        response = client.get('/api/calculations/invalid-endpoint')
        assert response.status_code == 404

    def test_method_not_allowed(self, client):
        """Test method not allowed"""
        response = client.get('/api/calculations/dasha/current')
        assert response.status_code == 405

    def test_malformed_json(self, client):
        """Test malformed JSON"""
        response = client.post(
            '/api/calculations/dasha/current',
            data='not valid json',
            content_type='application/json',
        )

        assert response.status_code >= 400


# ==================== WORKFLOW TESTS ====================

class TestCompleteWorkflows:
    """Test complete workflows"""

    def test_birth_chart_analysis_workflow(self, sample_birth_date, sample_planets_data):
        """Test complete birth chart analysis workflow"""
        # 1. Calculate current Dasha
        dasha_calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        current_dasha = dasha_calc.calculate_current_dasha()
        assert current_dasha is not None

        # 2. Calculate planetary strengths
        shadbala_calc = ShadbalaCalculator(sample_birth_date)
        strengths = shadbala_calc.calculate_all_planets_strength(sample_planets_data)
        assert len(strengths) > 0

        # 3. Rank planets
        ranked = shadbala_calc.rank_planets_by_strength(strengths)
        assert ranked[0].total_strength >= ranked[-1].total_strength

    def test_dasha_timeline_generation(self, sample_birth_date):
        """Test Dasha timeline generation"""
        calc = VimshottariDashaCalculator(sample_birth_date, 'Ashwini')
        dashas = calc.calculate_all_dashas()

        # Verify complete timeline
        assert dashas[0].start_date == sample_birth_date

        # Verify no gaps
        for i in range(len(dashas) - 1):
            gap = dashas[i + 1].start_date - dashas[i].end_date
            assert gap.total_seconds() == 0

    def test_api_workflow(self, client, sample_birth_date, sample_planets_data):
        """Test complete API workflow"""
        # 1. Get current Dasha via API
        dasha_payload = {
            'birth_date': sample_birth_date.isoformat(),
            'moon_nakshatra': 'Ashwini',
        }
        dasha_response = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps(dasha_payload),
            content_type='application/json',
        )
        assert dasha_response.status_code == 200

        # 2. Get all planet strengths via API
        shadbala_payload = {
            'planets': sample_planets_data,
            'birth_date': sample_birth_date.isoformat(),
        }
        shadbala_response = client.post(
            '/api/calculations/shadbala/all-planets',
            data=json.dumps(shadbala_payload),
            content_type='application/json',
        )
        assert shadbala_response.status_code == 200

        # 3. Get complete analysis
        analysis_payload = {
            'birth_date': sample_birth_date.isoformat(),
            'moon_nakshatra': 'Ashwini',
            'planets': sample_planets_data,
        }
        analysis_response = client.post(
            '/api/calculations/complete-analysis',
            data=json.dumps(analysis_payload),
            content_type='application/json',
        )
        assert analysis_response.status_code == 200
        analysis_data = json.loads(analysis_response.data)

        # Verify combined response
        assert analysis_data['data']['dasha']['current_dasha'] is not None
        assert len(analysis_data['data']['shadbala']['planets']) == len(sample_planets_data)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
