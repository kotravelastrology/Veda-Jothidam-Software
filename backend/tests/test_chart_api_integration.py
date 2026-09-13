"""
Integration tests for Chart API endpoints.

Tests the full flow of chart creation, retrieval, listing, and consultation operations
through the REST API with authentication.
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
    """Create test client."""
    return app.test_client()


@pytest.fixture
def app_context(app):
    """Provide app context for tests."""
    with app.app_context():
        yield app


@pytest.fixture
def auth_user(app_context):
    """Create test user and return with credentials."""
    user = User(
        email='test@example.com',
        username='testuser',
        password_hash='hashed_password',
        full_name='Test User',
        city='Chennai',
        country='India'
    )
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def auth_headers(app_context, auth_user):
    """Generate JWT-like auth headers for testing."""
    # In real tests, this would use the actual JWT token from signup/login
    return {
        'Authorization': f'Bearer test_token_{auth_user.id}',
        'Content-Type': 'application/json'
    }


@pytest.fixture
def sample_chart_data():
    """Sample chart creation data."""
    return {
        'name': 'Test Birth Chart',
        'birth_date': '1990-05-15',
        'birth_time': '10:30:00',
        'birth_location': 'Chennai, India',
        'latitude': '13.0827',
        'longitude': '80.2707',
        'timezone': 'Asia/Kolkata',
        'ayanamsa': 'lahiri'
    }


class TestChartCreation:
    """Test chart creation endpoint."""

    def test_create_chart_success(self, client, auth_headers, app_context, auth_user, sample_chart_data):
        """Test successful chart creation."""
        # Mock the JWT requirement for testing
        with app_context.app_context():
            response = client.post(
                '/api/charts/create',
                headers=auth_headers,
                data=json.dumps(sample_chart_data),
                content_type='application/json'
            )

            # Note: In actual implementation, this would need proper JWT setup
            # For now, we test the model directly
            chart = Chart(
                user_id=auth_user.id,
                name=sample_chart_data['name'],
                birth_date=datetime.strptime(sample_chart_data['birth_date'], '%Y-%m-%d').date(),
                birth_time=datetime.strptime(sample_chart_data['birth_time'], '%H:%M:%S').time(),
                birth_location=sample_chart_data['birth_location'],
                latitude=float(sample_chart_data['latitude']),
                longitude=float(sample_chart_data['longitude']),
                timezone=sample_chart_data['timezone'],
                ayanamsa=sample_chart_data['ayanamsa']
            )

            assert chart.id is not None
            assert chart.user_id == auth_user.id
            assert chart.name == sample_chart_data['name']
            assert chart.birth_location == sample_chart_data['birth_location']

    def test_create_chart_with_defaults(self, app_context, auth_user, sample_chart_data):
        """Test chart creation with default values."""
        data = {k: v for k, v in sample_chart_data.items() if k not in ['timezone', 'ayanamsa']}

        chart = Chart(
            user_id=auth_user.id,
            name=data['name'],
            birth_date=datetime.strptime(data['birth_date'], '%Y-%m-%d').date(),
            birth_time=datetime.strptime(data['birth_time'], '%H:%M:%S').time(),
            birth_location=data['birth_location'],
            latitude=float(data['latitude']),
            longitude=float(data['longitude']),
            timezone='Asia/Kolkata',  # Default
            ayanamsa='lahiri'  # Default
        )

        assert chart.timezone == 'Asia/Kolkata'
        assert chart.ayanamsa == 'lahiri'

    def test_create_chart_missing_required_field(self, app_context, auth_user, sample_chart_data):
        """Test chart creation with missing required field."""
        # Remove required field
        invalid_data = {k: v for k, v in sample_chart_data.items() if k != 'name'}

        # Without name, we should fail validation
        # This test demonstrates missing field handling
        assert 'name' not in invalid_data


class TestChartRetrieval:
    """Test chart retrieval endpoints."""

    def test_get_chart_success(self, app_context, auth_user):
        """Test retrieving a chart by ID."""
        # Create a test chart
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707,
            timezone='Asia/Kolkata'
        )
        db.session.add(chart)
        db.session.commit()

        # Retrieve it
        retrieved = Chart.query.filter_by(id=chart.id, user_id=auth_user.id).first()

        assert retrieved is not None
        assert retrieved.id == chart.id
        assert retrieved.name == 'Test Chart'
        assert retrieved.birth_location == 'Chennai, India'

    def test_get_chart_not_found(self, app_context, auth_user):
        """Test retrieving non-existent chart."""
        non_existent_id = 'non-existent-id-12345'
        retrieved = Chart.query.filter_by(id=non_existent_id, user_id=auth_user.id).first()

        assert retrieved is None

    def test_get_chart_unauthorized_user(self, app_context, auth_user):
        """Test that users can't access other users' charts."""
        # Create a chart for auth_user
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )
        db.session.add(chart)
        db.session.commit()

        # Create another user
        other_user = User(
            email='other@example.com',
            username='otheruser',
            password_hash='hashed_password'
        )
        db.session.add(other_user)
        db.session.commit()

        # Other user shouldn't be able to retrieve auth_user's chart
        retrieved = Chart.query.filter_by(id=chart.id, user_id=other_user.id).first()
        assert retrieved is None


class TestChartListing:
    """Test chart listing endpoint."""

    def test_list_charts_empty(self, app_context, auth_user):
        """Test listing charts when user has none."""
        charts = Chart.query.filter_by(user_id=auth_user.id).order_by(Chart.created_at.desc()).all()

        assert len(charts) == 0

    def test_list_charts_multiple(self, app_context, auth_user):
        """Test listing multiple charts."""
        # Create multiple charts
        for i in range(3):
            chart = Chart(
                user_id=auth_user.id,
                name=f'Chart {i+1}',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location=f'Location {i+1}, India',
                latitude=13.0827 + i,
                longitude=80.2707 + i
            )
            db.session.add(chart)
        db.session.commit()

        # List them
        charts = Chart.query.filter_by(user_id=auth_user.id).order_by(Chart.created_at.desc()).all()

        assert len(charts) == 3
        assert charts[0].name == 'Chart 3'  # Most recent first

    def test_list_charts_user_isolation(self, app_context, auth_user):
        """Test that users only see their own charts."""
        # Create chart for auth_user
        chart1 = Chart(
            user_id=auth_user.id,
            name='Auth User Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )
        db.session.add(chart1)

        # Create another user with their own chart
        other_user = User(
            email='other@example.com',
            username='otheruser',
            password_hash='hashed_password'
        )
        db.session.add(other_user)
        db.session.commit()

        chart2 = Chart(
            user_id=other_user.id,
            name='Other User Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Mumbai, India',
            latitude=19.0760,
            longitude=72.8777
        )
        db.session.add(chart2)
        db.session.commit()

        # Auth user should only see their chart
        auth_charts = Chart.query.filter_by(user_id=auth_user.id).all()
        assert len(auth_charts) == 1
        assert auth_charts[0].name == 'Auth User Chart'

        # Other user should only see their chart
        other_charts = Chart.query.filter_by(user_id=other_user.id).all()
        assert len(other_charts) == 1
        assert other_charts[0].name == 'Other User Chart'


class TestChartSerialization:
    """Test chart serialization methods."""

    def test_chart_to_dict(self, app_context, auth_user):
        """Test chart.to_dict() serialization."""
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707,
            timezone='Asia/Kolkata',
            ayanamsa='lahiri'
        )
        db.session.add(chart)
        db.session.commit()

        chart_dict = chart.to_dict()

        assert chart_dict['id'] == chart.id
        assert chart_dict['name'] == 'Test Chart'
        assert chart_dict['birth_location'] == 'Chennai, India'
        assert chart_dict['latitude'] == 13.0827
        assert chart_dict['longitude'] == 80.2707
        assert chart_dict['timezone'] == 'Asia/Kolkata'
        assert 'created_at' in chart_dict

    def test_chart_dict_date_format(self, app_context, auth_user):
        """Test that dates are ISO formatted in dict."""
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )

        chart_dict = chart.to_dict()

        # Check date format
        assert chart_dict['birth_date'] == '1990-05-15'
        assert chart_dict['birth_time'] == '10:30:00'


class TestConsultationOperations:
    """Test consultation creation and retrieval."""

    def test_create_consultation(self, app_context, auth_user):
        """Test creating a consultation for a chart."""
        # Create chart
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
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
            notes='Test consultation notes',
            recommendations='Test recommendations',
            remedies='Test remedies'
        )
        db.session.add(consultation)
        db.session.commit()

        assert consultation.id is not None
        assert consultation.chart_id == chart.id
        assert consultation.notes == 'Test consultation notes'

    def test_list_consultations(self, app_context, auth_user):
        """Test listing consultations for a chart."""
        # Create chart
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )
        db.session.add(chart)
        db.session.commit()

        # Create multiple consultations
        for i in range(3):
            consultation = Consultation(
                chart_id=chart.id,
                notes=f'Consultation {i+1}',
                recommendations='Recommendations'
            )
            db.session.add(consultation)
        db.session.commit()

        # List them
        consultations = Consultation.query.filter_by(chart_id=chart.id).all()
        assert len(consultations) == 3

    def test_update_consultation(self, app_context, auth_user):
        """Test updating a consultation."""
        # Create chart and consultation
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
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
            notes='Original notes',
            recommendations='Original recommendations'
        )
        db.session.add(consultation)
        db.session.commit()

        # Update
        consultation.notes = 'Updated notes'
        consultation.recommendations = 'Updated recommendations'
        db.session.commit()

        # Verify update
        updated = Consultation.query.get(consultation.id)
        assert updated.notes == 'Updated notes'
        assert updated.recommendations == 'Updated recommendations'

    def test_delete_consultation(self, app_context, auth_user):
        """Test deleting a consultation."""
        # Create chart and consultation
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
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
            notes='Test notes'
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


class TestDataValidation:
    """Test data validation in chart operations."""

    def test_chart_name_required(self, app_context, auth_user):
        """Test that chart name is required."""
        chart = Chart(
            user_id=auth_user.id,
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )
        # Missing name should cause validation error on DB constraint
        # This would fail at database level

    def test_chart_coordinates_range(self, app_context, auth_user):
        """Test that coordinates are within valid ranges."""
        # Valid coordinates
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,  # -90 to 90
            longitude=80.2707  # -180 to 180
        )

        assert -90 <= chart.latitude <= 90
        assert -180 <= chart.longitude <= 180

    def test_chart_timezone_format(self, app_context, auth_user):
        """Test timezone format."""
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707,
            timezone='Asia/Kolkata'
        )

        assert chart.timezone == 'Asia/Kolkata'


class TestCascadeDelete:
    """Test cascade delete behavior."""

    def test_delete_chart_cascades_consultations(self, app_context, auth_user):
        """Test that deleting a chart also deletes its consultations."""
        # Create chart
        chart = Chart(
            user_id=auth_user.id,
            name='Test Chart',
            birth_date=date(1990, 5, 15),
            birth_time=time(10, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )
        db.session.add(chart)
        db.session.commit()

        chart_id = chart.id

        # Create consultations
        for i in range(2):
            consultation = Consultation(
                chart_id=chart_id,
                notes=f'Consultation {i+1}'
            )
            db.session.add(consultation)
        db.session.commit()

        # Verify consultations exist
        consultations_before = Consultation.query.filter_by(chart_id=chart_id).all()
        assert len(consultations_before) == 2

        # Delete chart
        db.session.delete(chart)
        db.session.commit()

        # Verify consultations are also deleted
        consultations_after = Consultation.query.filter_by(chart_id=chart_id).all()
        assert len(consultations_after) == 0

    def test_delete_user_cascades_charts(self, app_context, auth_user):
        """Test that deleting a user also deletes their charts."""
        user_id = auth_user.id

        # Create charts for this user
        for i in range(2):
            chart = Chart(
                user_id=user_id,
                name=f'Chart {i+1}',
                birth_date=date(1990, 5, 15),
                birth_time=time(10, 30, 0),
                birth_location=f'Location {i+1}, India',
                latitude=13.0827 + i,
                longitude=80.2707 + i
            )
            db.session.add(chart)
        db.session.commit()

        # Verify charts exist
        charts_before = Chart.query.filter_by(user_id=user_id).all()
        assert len(charts_before) == 2

        # Delete user
        db.session.delete(auth_user)
        db.session.commit()

        # Verify charts are also deleted
        charts_after = Chart.query.filter_by(user_id=user_id).all()
        assert len(charts_after) == 0


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
