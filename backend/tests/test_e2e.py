"""
End-to-End (E2E) Tests for Veda Jothidam

Tests complete user workflows from frontend to backend:
- Birth chart analysis workflow
- Dasha period prediction
- Planetary strength analysis
- API integration
- Data persistence and accuracy
- Performance under load
"""

import pytest
import json
import time
from datetime import datetime, timedelta
from calculations.dasha import VimshottariDashaCalculator
from calculations.planetary_strength import ShadbalaCalculator
from app import create_app


@pytest.fixture
def app():
    """Create Flask test app"""
    app = create_app({'TESTING': True})
    return app


@pytest.fixture
def client(app):
    """Create Flask test client"""
    return app.test_client()


# ==================== USER SCENARIO TESTS ====================

class TestUserScenarios:
    """Test complete user workflows"""

    def test_scenario_new_user_birth_chart_analysis(self, client):
        """
        Scenario: New user wants to analyze their birth chart
        Steps:
        1. Enter birth date and nakshatra
        2. Get current Dasha
        3. View all Dasha cycles
        4. Analyze planetary strengths
        5. Get complete analysis
        """
        birth_date = datetime(1990, 5, 15, 10, 30, 0)
        moon_nakshatra = 'Ashwini'

        planets = [
            {'planet': 'Sun', 'sign': 'Leo', 'longitude': 135.0, 'house': 1, 'retrograde': False},
            {'planet': 'Moon', 'sign': 'Taurus', 'longitude': 45.0, 'house': 3, 'retrograde': False},
            {'planet': 'Mars', 'sign': 'Aries', 'longitude': 15.0, 'house': 2, 'retrograde': False},
            {'planet': 'Mercury', 'sign': 'Virgo', 'longitude': 145.0, 'house': 4, 'retrograde': False},
            {'planet': 'Jupiter', 'sign': 'Sagittarius', 'longitude': 255.0, 'house': 8, 'retrograde': False},
            {'planet': 'Venus', 'sign': 'Libra', 'longitude': 195.0, 'house': 5, 'retrograde': False},
            {'planet': 'Saturn', 'sign': 'Aquarius', 'longitude': 315.0, 'house': 10, 'retrograde': False},
        ]

        # Step 1: Get current Dasha
        dasha_response = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps({
                'birth_date': birth_date.isoformat(),
                'moon_nakshatra': moon_nakshatra,
            }),
            content_type='application/json',
        )
        assert dasha_response.status_code == 200
        dasha_data = json.loads(dasha_response.data)
        assert dasha_data['success'] is True
        assert dasha_data['data']['current_dasha'] is not None

        # Step 2: Get all Dasha cycles
        all_dashas_response = client.post(
            '/api/calculations/dasha/all-cycles',
            data=json.dumps({
                'birth_date': birth_date.isoformat(),
                'moon_nakshatra': moon_nakshatra,
            }),
            content_type='application/json',
        )
        assert all_dashas_response.status_code == 200
        all_dashas_data = json.loads(all_dashas_response.data)
        assert len(all_dashas_data['data']['dashas']) == 9

        # Step 3: Analyze planetary strengths
        shadbala_response = client.post(
            '/api/calculations/shadbala/all-planets',
            data=json.dumps({
                'planets': planets,
                'birth_date': birth_date.isoformat(),
            }),
            content_type='application/json',
        )
        assert shadbala_response.status_code == 200
        shadbala_data = json.loads(shadbala_response.data)
        assert len(shadbala_data['data']['planets']) == len(planets)

        # Step 4: Get complete analysis
        analysis_response = client.post(
            '/api/calculations/complete-analysis',
            data=json.dumps({
                'birth_date': birth_date.isoformat(),
                'moon_nakshatra': moon_nakshatra,
                'planets': planets,
            }),
            content_type='application/json',
        )
        assert analysis_response.status_code == 200
        analysis_data = json.loads(analysis_response.data)
        assert analysis_data['data']['dasha'] is not None
        assert analysis_data['data']['shadbala'] is not None

    def test_scenario_dasha_prediction_for_life_event(self, client):
        """
        Scenario: User wants to know which Dasha is active on specific date
        (e.g., for planning purposes)
        """
        birth_date = datetime(1990, 5, 15, 10, 30, 0)

        # User's daughter is getting married next year
        event_date = datetime(2027, 6, 15, 0, 0, 0)

        response = client.post(
            '/api/calculations/dasha/for-date',
            data=json.dumps({
                'birth_date': birth_date.isoformat(),
                'moon_nakshatra': 'Ashwini',
                'target_date': event_date.isoformat(),
            }),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['data']['dasha'] is not None

        # Verify the date is within the Dasha period
        dasha = data['data']['dasha']
        start = datetime.fromisoformat(dasha['start_date'])
        end = datetime.fromisoformat(dasha['end_date'])
        assert start <= event_date <= end

    def test_scenario_planetary_strength_consultation(self, client):
        """
        Scenario: User wants to understand planetary strengths for consultation
        """
        planets = [
            {'planet': 'Jupiter', 'sign': 'Sagittarius', 'longitude': 255.0, 'house': 8, 'retrograde': False},
            {'planet': 'Saturn', 'sign': 'Aquarius', 'longitude': 315.0, 'house': 10, 'retrograde': False},
        ]

        response = client.post(
            '/api/calculations/shadbala/all-planets',
            data=json.dumps({
                'planets': planets,
                'birth_date': '1990-05-15T10:30:00',
            }),
            content_type='application/json',
        )

        assert response.status_code == 200
        data = json.loads(response.data)

        # Get rankings
        ranked = data['data']['ranked']
        assert len(ranked) == 2

        # Verify strongest planet is first
        assert ranked[0]['total_strength'] >= ranked[1]['total_strength']

        # Get interpretation for each
        for planet in ranked:
            interp_response = client.post(
                '/api/calculations/shadbala/interpretation',
                data=json.dumps({'strength': planet['total_strength']}),
                content_type='application/json',
            )
            assert interp_response.status_code == 200
            interp_data = json.loads(interp_response.data)
            assert 'status' in interp_data['data']


# ==================== DATA ACCURACY TESTS ====================

class TestDataAccuracy:
    """Test accuracy of calculations"""

    def test_dasha_cycle_totals_120_years(self):
        """Verify 120-year Dasha cycle"""
        calc = VimshottariDashaCalculator(datetime(1990, 5, 15), 'Ashwini')
        dashas = calc.calculate_all_dashas()

        total_years = sum(d.duration_years for d in dashas)
        assert total_years == 120

    def test_dasha_dates_sequential(self):
        """Verify Dasha dates are sequential with no gaps"""
        calc = VimshottariDashaCalculator(datetime(1990, 5, 15), 'Ashwini')
        dashas = calc.calculate_all_dashas()

        for i in range(len(dashas) - 1):
            assert dashas[i].end_date == dashas[i + 1].start_date

    def test_bhukti_periods_within_dasha(self):
        """Verify Bhukti periods are within Dasha"""
        calc = VimshottariDashaCalculator(datetime(1990, 5, 15), 'Ashwini')
        dashas = calc.calculate_all_dashas()
        dasha = dashas[0]

        for bhukti in dasha.bhukti_periods:
            assert dasha.start_date <= bhukti.start_date
            assert bhukti.end_date <= dasha.end_date

    def test_shadbala_components_valid_range(self):
        """Verify all Shadbala components are 0-100"""
        calc = ShadbalaCalculator(datetime(1990, 5, 15, 10, 30, 0))
        strength = calc.calculate_planetary_strength(
            planet='Mercury',
            sign='Virgo',
            longitude=145.5,
            house=3,
        )

        assert 0 <= strength.sthana_bala <= 100
        assert 0 <= strength.dik_bala <= 100
        assert 0 <= strength.kala_bala <= 100
        assert 0 <= strength.chesta_bala <= 100
        assert 0 <= strength.naisargika_bala <= 100
        assert 0 <= strength.drishti_bala <= 100
        assert 0 <= strength.total_strength <= 100

    def test_shadbala_total_is_average(self):
        """Verify total strength is average of 6 components"""
        calc = ShadbalaCalculator(datetime(1990, 5, 15, 10, 30, 0))
        strength = calc.calculate_planetary_strength(
            planet='Sun',
            sign='Leo',
            longitude=135.0,
            house=1,
        )

        expected_total = (
            strength.sthana_bala +
            strength.dik_bala +
            strength.kala_bala +
            strength.chesta_bala +
            strength.naisargika_bala +
            strength.drishti_bala
        ) / 6

        assert abs(strength.total_strength - expected_total) < 0.1

    def test_exaltation_debilitation_mapping(self):
        """Verify exaltation and debilitation mappings"""
        calc = ShadbalaCalculator(datetime.now())

        # Sun exalted in Aries
        strength = calc.calculate_planetary_strength('Sun', 'Aries', 10.0, 1)
        assert strength.dignity_status == 'Exalted'

        # Sun debilitated in Libra
        strength = calc.calculate_planetary_strength('Sun', 'Libra', 180.0, 7)
        assert strength.dignity_status == 'Debilitated'

        # Moon exalted in Taurus
        strength = calc.calculate_planetary_strength('Moon', 'Taurus', 3.0, 2)
        assert strength.dignity_status == 'Exalted'

    def test_retrograde_reduces_strength(self):
        """Verify retrograde reduces Chesta Bala"""
        calc = ShadbalaCalculator(datetime.now())

        strength_direct = calc.calculate_planetary_strength(
            'Mars', 'Aries', 15.0, 2, retrograde=False
        )
        strength_retrograde = calc.calculate_planetary_strength(
            'Mars', 'Aries', 15.0, 2, retrograde=True
        )

        assert strength_retrograde.chesta_bala < strength_direct.chesta_bala


# ==================== PERFORMANCE TESTS ====================

class TestPerformance:
    """Test performance and response times"""

    def test_dasha_calculation_performance(self):
        """Verify Dasha calculation completes in reasonable time"""
        start = time.time()
        calc = VimshottariDashaCalculator(datetime(1990, 5, 15), 'Ashwini')
        dashas = calc.calculate_all_dashas()
        elapsed = time.time() - start

        assert elapsed < 1.0  # Should complete in < 1 second
        assert len(dashas) == 9

    def test_shadbala_calculation_performance(self):
        """Verify Shadbala calculation completes in reasonable time"""
        calc = ShadbalaCalculator(datetime(1990, 5, 15, 10, 30, 0))

        planets = [
            {'planet': f'Planet{i}', 'sign': 'Leo', 'longitude': 135.0, 'house': 1}
            for i in range(9)
        ]
        planets[0]['planet'] = 'Sun'
        planets[1]['planet'] = 'Moon'
        planets[2]['planet'] = 'Mars'
        planets[3]['planet'] = 'Mercury'
        planets[4]['planet'] = 'Jupiter'
        planets[5]['planet'] = 'Venus'
        planets[6]['planet'] = 'Saturn'
        planets[7]['planet'] = 'Rahu'
        planets[8]['planet'] = 'Ketu'

        start = time.time()
        strengths = calc.calculate_all_planets_strength(planets)
        elapsed = time.time() - start

        assert elapsed < 1.0  # Should complete in < 1 second
        assert len(strengths) == 9

    def test_api_response_time(self, client):
        """Verify API endpoints respond in reasonable time"""
        payload = {
            'birth_date': '1990-05-15T10:30:00',
            'moon_nakshatra': 'Ashwini',
        }

        start = time.time()
        response = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps(payload),
            content_type='application/json',
        )
        elapsed = time.time() - start

        assert response.status_code == 200
        assert elapsed < 2.0  # API should respond in < 2 seconds

    def test_complete_analysis_performance(self, client):
        """Verify complete analysis completes in reasonable time"""
        planets = [
            {'planet': 'Sun', 'sign': 'Leo', 'longitude': 135.0, 'house': 1, 'retrograde': False},
            {'planet': 'Moon', 'sign': 'Taurus', 'longitude': 45.0, 'house': 3, 'retrograde': False},
            {'planet': 'Mars', 'sign': 'Aries', 'longitude': 15.0, 'house': 2, 'retrograde': False},
            {'planet': 'Mercury', 'sign': 'Virgo', 'longitude': 145.0, 'house': 4, 'retrograde': False},
            {'planet': 'Jupiter', 'sign': 'Sagittarius', 'longitude': 255.0, 'house': 8, 'retrograde': False},
            {'planet': 'Venus', 'sign': 'Libra', 'longitude': 195.0, 'house': 5, 'retrograde': False},
            {'planet': 'Saturn', 'sign': 'Aquarius', 'longitude': 315.0, 'house': 10, 'retrograde': False},
        ]

        payload = {
            'birth_date': '1990-05-15T10:30:00',
            'moon_nakshatra': 'Ashwini',
            'planets': planets,
        }

        start = time.time()
        response = client.post(
            '/api/calculations/complete-analysis',
            data=json.dumps(payload),
            content_type='application/json',
        )
        elapsed = time.time() - start

        assert response.status_code == 200
        assert elapsed < 3.0  # Complete analysis should complete in < 3 seconds


# ==================== REGRESSION TESTS ====================

class TestRegressions:
    """Test for known issues and regressions"""

    def test_no_date_parsing_errors(self, client):
        """Verify ISO date parsing works correctly"""
        test_dates = [
            '1990-05-15T10:30:00',
            '2000-01-01T00:00:00',
            '2025-12-31T23:59:59',
        ]

        for date_str in test_dates:
            response = client.post(
                '/api/calculations/dasha/current',
                data=json.dumps({
                    'birth_date': date_str,
                    'moon_nakshatra': 'Ashwini',
                }),
                content_type='application/json',
            )
            assert response.status_code == 200

    def test_all_9_planets_supported(self, client):
        """Verify all 9 planets are supported"""
        planets = [
            'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter',
            'Venus', 'Saturn', 'Rahu', 'Ketu'
        ]

        for planet in planets:
            response = client.post(
                '/api/calculations/shadbala/single-planet',
                data=json.dumps({
                    'planet': planet,
                    'sign': 'Leo',
                    'longitude': 135.0,
                    'house': 1,
                }),
                content_type='application/json',
            )
            assert response.status_code == 200

    def test_all_nakshatras_supported(self, client):
        """Verify all 27 nakshatras are supported"""
        nakshatras = [
            'Ashwini', 'Bharani', 'Kritika', 'Rohini', 'Mrigashira',
            'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
            'Poorva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
            'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula',
            'Poorva Shadha', 'Uttara Shadha', 'Shravan', 'Dhanistha',
            'Shatabhisha', 'Poorva Bhadrapada', 'Uttara Bhadrapada',
            'Revati'
        ]

        for nakshatra in nakshatras:
            calc = VimshottariDashaCalculator(datetime.now(), nakshatra)
            dashas = calc.calculate_all_dashas()
            assert len(dashas) == 9

    def test_json_response_serialization(self, client):
        """Verify all responses serialize to valid JSON"""
        payload = {
            'birth_date': '1990-05-15T10:30:00',
            'moon_nakshatra': 'Ashwini',
        }

        response = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps(payload),
            content_type='application/json',
        )

        # Should not raise exception
        data = json.loads(response.data)
        assert data is not None


# ==================== INTEGRATION VALIDATION ====================

class TestIntegrationValidation:
    """Validate integration between components"""

    def test_frontend_backend_data_flow(self, client):
        """
        Test: Data flows correctly from frontend to backend and back
        """
        # Frontend sends birth data
        request_data = {
            'birth_date': '1990-05-15T10:30:00',
            'moon_nakshatra': 'Ashwini',
            'planets': [
                {'planet': 'Sun', 'sign': 'Leo', 'longitude': 135.0, 'house': 1, 'retrograde': False},
                {'planet': 'Moon', 'sign': 'Taurus', 'longitude': 45.0, 'house': 3, 'retrograde': False},
            ]
        }

        # Backend processes and returns analysis
        response = client.post(
            '/api/calculations/complete-analysis',
            data=json.dumps(request_data),
            content_type='application/json',
        )

        assert response.status_code == 200
        response_data = json.loads(response.data)

        # Verify response structure matches frontend expectations
        assert 'success' in response_data
        assert 'data' in response_data
        assert 'dasha' in response_data['data']
        assert 'shadbala' in response_data['data']

    def test_api_components_work_together(self):
        """Test Dasha and Shadbala calculators work together"""
        birth_date = datetime(1990, 5, 15, 10, 30, 0)

        # Get Dasha
        dasha_calc = VimshottariDashaCalculator(birth_date, 'Ashwini')
        dasha = dasha_calc.calculate_current_dasha()

        # Get Shadbala
        shadbala_calc = ShadbalaCalculator(birth_date)
        strength = shadbala_calc.calculate_planetary_strength(
            'Mercury', 'Virgo', 145.5, 3
        )

        # Both should work together
        assert dasha is not None
        assert strength is not None
        assert dasha.planet in ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Saturn', 'Rahu']
        assert strength.total_strength > 0

    def test_api_endpoints_consistency(self, client):
        """Test API endpoints return consistent data"""
        birth_date = '1990-05-15T10:30:00'

        # Get current Dasha
        response1 = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps({'birth_date': birth_date, 'moon_nakshatra': 'Ashwini'}),
            content_type='application/json',
        )
        current_dasha_name = json.loads(response1.data)['data']['current_dasha']['planet']

        # Get all dashas
        response2 = client.post(
            '/api/calculations/dasha/all-cycles',
            data=json.dumps({'birth_date': birth_date, 'moon_nakshatra': 'Ashwini'}),
            content_type='application/json',
        )
        all_dashas = json.loads(response2.data)['data']['dashas']

        # Current Dasha should be in all Dashas
        dasha_names = [d['planet'] for d in all_dashas]
        assert current_dasha_name in dasha_names


# ==================== ERROR RECOVERY TESTS ====================

class TestErrorRecovery:
    """Test error handling and recovery"""

    def test_invalid_nakshatra_handled(self, client):
        """Test invalid nakshatra is handled gracefully"""
        response = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps({
                'birth_date': '1990-05-15T10:30:00',
                'moon_nakshatra': 'InvalidNakshatra',
            }),
            content_type='application/json',
        )

        # Should use default or handle gracefully
        assert response.status_code in [200, 400]

    def test_missing_fields_error_message(self, client):
        """Test error message for missing fields"""
        response = client.post(
            '/api/calculations/dasha/current',
            data=json.dumps({}),
            content_type='application/json',
        )

        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'error' in data

    def test_out_of_range_values_handled(self, client):
        """Test out-of-range values are handled"""
        response = client.post(
            '/api/calculations/shadbala/interpretation',
            data=json.dumps({'strength': 150}),  # > 100
            content_type='application/json',
        )

        assert response.status_code == 400


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
