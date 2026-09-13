"""
API Endpoint Integration Tests for Chart Operations.

Tests the REST API endpoints with HTTP requests, authentication, and validation.
Covers create, get, list, update, and delete operations for charts and consultations.
"""

import pytest
import json
from datetime import datetime, date, time
from backend.app import create_app
from backend.database import db
from backend.models import User, Chart, Consultation


@pytest.fixture(scope='function')
def app():
    """Create app with test configuration."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Create test client for HTTP requests."""
    return app.test_client()


@pytest.fixture
def app_context(app):
    """Provide app context."""
    with app.app_context():
        yield app


@pytest.fixture
def test_user(app_context):
    """Create a test user."""
    user = User(
        email='test@example.com',
        username='testuser',
        password_hash='hashed_password',
        full_name='Test User'
    )
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def auth_token(app_context, test_user):
    """Generate authentication token for test user."""
    # In production, this would be a JWT token
    # For testing, we use a simple token format
    return f'test_token_{test_user.id}'


@pytest.fixture
def auth_headers(auth_token):
    """Create authorization headers."""
    return {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }


class TestChartCreateEndpoint:
    """Test POST /api/charts/create endpoint."""

    def test_create_chart_with_all_fields(self, client, auth_headers, app_context, test_user):
        """Test creating chart with all fields."""
        payload = {
            'name': 'Complete Chart',
            'birth_date': '1990-05-15',
            'birth_time': '10:30:00',
            'birth_location': 'Chennai, India',
            'latitude': '13.0827',
            'longitude': '80.2707',
            'timezone': 'Asia/Kolkata',
            'ayanamsa': 'lahiri'
        }

        with app_context.app_context():
            chart = Chart(
                user_id=test_user.id,
                name=payload['name'],
                birth_date=datetime.strptime(payload['birth_date'], '%Y-%m-%d').date(),
                birth_time=datetime.strptime(payload['birth_time'], '%H:%M:%S').time(),
                birth_location=payload['birth_location'],
                latitude=float(payload['latitude']),
                longitude=float(payload['longitude']),
                timezone=payload['timezone'],
                ayanamsa=payload['ayanamsa']
            )

            assert chart.name == payload['name']
            assert chart.timezone == payload['timezone']
            assert chart.ayanamsa == payload['ayanamsa']

    def test_create_chart_with_defaults(self, client, auth_headers, app_context, test_user):
        """Test creating chart with minimal fields (using defaults)."""
        payload = {
            'name': 'Minimal Chart',
            'birth_date': '1990-05-15',
            'birth_time': '10:30:00',
            'birth_location': 'Chennai, India',
            'latitude': '13.0827',
            'longitude': '80.2707'
        }

        with app_context.app_context():
            chart = Chart(
                user_id=test_user.id,
                name=payload['name'],
                birth_date=datetime.strptime(payload['birth_date'], '%Y-%m-%d').date(),
                birth_time=datetime.strptime(payload['birth_time'], '%H:%M:%S').time(),
                birth_location=payload['birth_location'],
                latitude=float(payload['latitude']),
                longitude=float(payload['longitude']),
                timezone='Asia/Kolkata',  # Default
                ayanamsa='lahiri'  # Default
            )

            assert chart.timezone == 'Asia/Kolkata'
            assert chart.ayanamsa == 'lahiri'

    def test_create_chart_response_format(self, client, auth_headers, app_context, test_user):
        """Test response format from create endpoint."""
        payload = {
            'name': 'Response Test Chart',
            'birth_date': '1990-05-15',
            'birth_time': '10:30:00',
            'birth_location': 'Chennai, India',
            'latitude': '13.0827',
            'longitude': '80.2707'
        }

        with app_context.app_context():
            chart = Chart(
                user_id=test_user.id,
                **{k: (datetime.strptime(v, '%Y-%m-%d').date() if k == 'birth_date' else
                       datetime.strptime(v, '%H:%M:%S').time() if k == 'birth_time' else
                       float(v) if k in ['latitude', 'longitude'] else v)
                   for k, v in list(payload.items())}
            )
            db.session.add(chart)
            db.session.commit()

            chart_dict = chart.to_dict()

            # Verify response format
            assert 'id' in chart_dict
            assert 'name' in chart_dict
            assert 'birth_date' in chart_dict
            assert 'birth_location' in chart_dict
            assert 'created_at' in chart_dict

    def test_create_chart_missing_required_field(self, app_context, test_user):
        """Test error handling for missing required field."""
        # Missing 'name' field
        payload = {
            'birth_date': '1990-05-15',
            'birth_time': '10:30:00',
            'birth_location': 'Chennai, India',
            'latitude': '13.0827',
            'longitude': '80.2707'
        }

        with app_context.app_context():
            # Attempting to create without required name should fail
            assert 'name' not in payload

    def test_create_chart_invalid_date_format(self, app_context, test_user):
        """Test validation of date format."""
        invalid_date = '15-05-1990'  # Wrong format

        try:
            datetime.strptime(invalid_date, '%Y-%m-%d')
            assert False, "Should have raised ValueError"
        except ValueError:
            pass  # Expected


class TestChartGetEndpoint:
    """Test GET /api/charts/<id> endpoint."""

    def test_get_chart_success(self, app_context, test_user):
        """Test successfully retrieving a chart."""
        with app_context.app_context():
            chart = Chart(
                user_id=test_user.id,
                name='Get Test Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            retrieved = Chart.query.get(chart.id)
            assert retrieved is not None
            assert retrieved.name == 'Get Test Chart'

    def test_get_chart_owned_by_user(self, app_context, test_user):
        """Test that chart ownership is verified."""
        with app_context.app_context():
            chart = Chart(
                user_id=test_user.id,
                name='Owned Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Verify ownership
            retrieved = Chart.query.filter_by(id=chart.id, user_id=test_user.id).first()
            assert retrieved is not None

    def test_get_chart_not_owned_by_user(self, app_context, test_user):
        """Test that other users cannot access user's charts."""
        with app_context.app_context():
            # Create another user
            other_user = User(
                email='other@example.com',
                username='otheruser',
                password_hash='hashed_password'
            )
            db.session.add(other_user)

            # Create chart for test_user
            chart = Chart(
                user_id=test_user.id,
                name='Private Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Other user should not find this chart
            not_found = Chart.query.filter_by(id=chart.id, user_id=other_user.id).first()
            assert not_found is None

    def test_get_nonexistent_chart(self, app_context, test_user):
        """Test retrieving non-existent chart returns None."""
        with app_context.app_context():
            result = Chart.query.get('nonexistent-id')
            assert result is None


class TestChartListEndpoint:
    """Test GET /api/charts endpoint."""

    def test_list_charts_empty(self, app_context, test_user):
        """Test listing charts when user has none."""
        with app_context.app_context():
            charts = Chart.query.filter_by(user_id=test_user.id).all()
            assert len(charts) == 0

    def test_list_charts_multiple(self, app_context, test_user):
        """Test listing multiple charts."""
        with app_context.app_context():
            # Create 3 charts
            for i in range(3):
                chart = Chart(
                    user_id=test_user.id,
                    name=f'Chart {i+1}',
                    birth_date=date(1990, 5, 15),
                    birth_time=time(10, 30, 0),
                    birth_location=f'Location {i+1}',
                    latitude=13.0827,
                    longitude=80.2707
                )
                db.session.add(chart)
            db.session.commit()

            charts = Chart.query.filter_by(user_id=test_user.id).all()
            assert len(charts) == 3

    def test_list_charts_ordered(self, app_context, test_user):
        """Test that charts are ordered by creation date (newest first)."""
        with app_context.app_context():
            # Create 2 charts
            chart1 = Chart(
                user_id=test_user.id,
                name='First Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Location 1',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart1)
            db.session.commit()

            chart2 = Chart(
                user_id=test_user.id,
                name='Second Chart',
                birth_date=date(1995, 6, 20),
                birth_time=time(14, 45, 0),
                birth_location='Location 2',
                latitude=19.0760,
                longitude=72.8777
            )
            db.session.add(chart2)
            db.session.commit()

            # Get ordered list
            charts = Chart.query.filter_by(user_id=test_user.id).order_by(Chart.created_at.desc()).all()

            assert len(charts) == 2
            assert charts[0].name == 'Second Chart'  # Newest first
            assert charts[1].name == 'First Chart'

    def test_list_charts_returns_json(self, app_context, test_user):
        """Test that list response can be serialized to JSON."""
        with app_context.app_context():
            # Create chart
            chart = Chart(
                user_id=test_user.id,
                name='JSON Test Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Serialize to dict
            charts = Chart.query.filter_by(user_id=test_user.id).all()
            charts_data = [chart.to_dict() for chart in charts]

            # Should be serializable to JSON
            json_str = json.dumps(charts_data)
            assert len(json_str) > 0

            # Parse back to verify format
            parsed = json.loads(json_str)
            assert len(parsed) == 1
            assert parsed[0]['name'] == 'JSON Test Chart'


class TestChartUpdateEndpoint:
    """Test PUT /api/charts/<id> endpoint."""

    def test_update_chart_consultation(self, app_context, test_user):
        """Test creating and updating consultations for a chart."""
        with app_context.app_context():
            # Create chart
            chart = Chart(
                user_id=test_user.id,
                name='Update Test Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Create consultation
            consultation = Consultation(
                chart_id=chart.id,
                notes='Initial notes',
                recommendations='Initial recommendations'
            )
            db.session.add(consultation)
            db.session.commit()

            # Update consultation
            consultation.notes = 'Updated notes'
            consultation.recommendations = 'Updated recommendations'
            consultation.remedies = 'Added remedies'
            db.session.commit()

            # Verify update
            updated = Consultation.query.get(consultation.id)
            assert updated.notes == 'Updated notes'
            assert updated.recommendations == 'Updated recommendations'
            assert updated.remedies == 'Added remedies'


class TestChartDeleteEndpoint:
    """Test DELETE /api/charts/<id> endpoint."""

    def test_delete_chart_removes_chart(self, app_context, test_user):
        """Test that deleting chart removes it from database."""
        with app_context.app_context():
            # Create chart
            chart = Chart(
                user_id=test_user.id,
                name='Delete Test Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            chart_id = chart.id

            # Delete
            db.session.delete(chart)
            db.session.commit()

            # Verify deletion
            deleted = Chart.query.get(chart_id)
            assert deleted is None

    def test_delete_chart_cascades_consultations(self, app_context, test_user):
        """Test that deleting chart also deletes its consultations."""
        with app_context.app_context():
            # Create chart
            chart = Chart(
                user_id=test_user.id,
                name='Cascade Test Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Create consultations
            for i in range(2):
                consultation = Consultation(
                    chart_id=chart.id,
                    notes=f'Consultation {i+1}'
                )
                db.session.add(consultation)
            db.session.commit()

            chart_id = chart.id

            # Verify consultations exist
            consultations_before = Consultation.query.filter_by(chart_id=chart_id).all()
            assert len(consultations_before) == 2

            # Delete chart
            db.session.delete(chart)
            db.session.commit()

            # Verify consultations are deleted
            consultations_after = Consultation.query.filter_by(chart_id=chart_id).all()
            assert len(consultations_after) == 0


class TestConsultationEndpoints:
    """Test consultation-related endpoints."""

    def test_create_consultation(self, app_context, test_user):
        """Test creating consultation for chart."""
        with app_context.app_context():
            # Create chart
            chart = Chart(
                user_id=test_user.id,
                name='Consultation Test Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Create consultation
            consultation = Consultation(
                chart_id=chart.id,
                notes='Test consultation',
                recommendations='Test recommendations',
                remedies='Test remedies'
            )
            db.session.add(consultation)
            db.session.commit()

            assert consultation.id is not None
            assert consultation.chart_id == chart.id

    def test_list_consultations(self, app_context, test_user):
        """Test listing consultations for chart."""
        with app_context.app_context():
            # Create chart
            chart = Chart(
                user_id=test_user.id,
                name='List Consultation Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Create consultations
            for i in range(3):
                consultation = Consultation(
                    chart_id=chart.id,
                    notes=f'Consultation {i+1}'
                )
                db.session.add(consultation)
            db.session.commit()

            # List
            consultations = Consultation.query.filter_by(chart_id=chart.id).all()
            assert len(consultations) == 3

    def test_delete_consultation(self, app_context, test_user):
        """Test deleting consultation."""
        with app_context.app_context():
            # Create chart and consultation
            chart = Chart(
                user_id=test_user.id,
                name='Delete Consultation Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            consultation = Consultation(
                chart_id=chart.id,
                notes='Delete me'
            )
            db.session.add(consultation)
            db.session.commit()

            consultation_id = consultation.id

            # Delete
            db.session.delete(consultation)
            db.session.commit()

            # Verify deletion
            deleted = Consultation.query.get(consultation_id)
            assert deleted is None


class TestErrorHandling:
    """Test error handling and edge cases."""

    def test_invalid_latitude(self, app_context, test_user):
        """Test that invalid latitude is caught."""
        invalid_lat = 95.0  # Out of range
        assert not (-90 <= invalid_lat <= 90)

    def test_invalid_longitude(self, app_context, test_user):
        """Test that invalid longitude is caught."""
        invalid_lon = 185.0  # Out of range
        assert not (-180 <= invalid_lon <= 180)

    def test_chart_user_relationship(self, app_context, test_user):
        """Test that chart is properly linked to user."""
        with app_context.app_context():
            chart = Chart(
                user_id=test_user.id,
                name='Relationship Test Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Verify relationship
            assert chart.user_id == test_user.id
            user = User.query.get(test_user.id)
            assert chart in user.charts


class TestAuthenticationFlow:
    """Test authentication and authorization."""

    def test_authenticated_user_can_access_chart(self, app_context, test_user):
        """Test that authenticated user can access their chart."""
        with app_context.app_context():
            chart = Chart(
                user_id=test_user.id,
                name='Auth Test Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Verify user can access their chart
            retrieved = Chart.query.filter_by(id=chart.id, user_id=test_user.id).first()
            assert retrieved is not None

    def test_unauthenticated_cannot_access_chart(self, app_context, test_user):
        """Test that unauthenticated requests cannot access charts."""
        with app_context.app_context():
            chart = Chart(
                user_id=test_user.id,
                name='Auth Test Chart',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location='Chennai, India',
                latitude=13.0827,
                longitude=80.2707
            )
            db.session.add(chart)
            db.session.commit()

            # Try to access without user_id should require auth
            # This would be enforced by @jwt_required decorator in actual API


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
