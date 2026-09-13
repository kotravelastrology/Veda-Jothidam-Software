"""
Security testing suite for backend API.
Tests input validation, JWT, rate limiting, and security headers.
"""

import pytest
import json
from backend.validators import (
    EmailValidator, PasswordValidator, DateValidator, TimeValidator,
    CoordinateValidator, StringValidator, ChartDataValidator, ValidationError
)
from backend.jwt_handler import JWTHandler
from backend.rate_limiter import RateLimiter


class TestInputValidation:
    """Test input validation framework."""

    def test_email_validation_valid(self):
        """Test valid email validation."""
        email = EmailValidator.validate("user@example.com")
        assert email == "user@example.com"

    def test_email_validation_normalized(self):
        """Test email normalization."""
        email = EmailValidator.validate("  USER@EXAMPLE.COM  ")
        assert email == "user@example.com"

    def test_email_validation_invalid_format(self):
        """Test invalid email format."""
        with pytest.raises(ValidationError):
            EmailValidator.validate("invalid-email")

    def test_email_validation_too_long(self):
        """Test email too long."""
        long_email = "a" * 200 + "@example.com"
        with pytest.raises(ValidationError):
            EmailValidator.validate(long_email)

    def test_password_validation_weak(self):
        """Test weak password rejection."""
        with pytest.raises(ValidationError):
            PasswordValidator.validate("weak")  # Too short, missing requirements

    def test_password_validation_strong(self):
        """Test strong password acceptance."""
        password = "StrongPass123!@#"
        result = PasswordValidator.validate(password)
        assert result == password

    def test_password_validation_no_uppercase(self):
        """Test password without uppercase."""
        with pytest.raises(ValidationError):
            PasswordValidator.validate("strongpass123!@#")

    def test_password_validation_no_special(self):
        """Test password without special characters."""
        with pytest.raises(ValidationError):
            PasswordValidator.validate("StrongPass123")

    def test_date_validation_valid(self):
        """Test valid date validation."""
        date = DateValidator.validate("1990-01-15")
        assert str(date) == "1990-01-15"

    def test_date_validation_invalid_format(self):
        """Test invalid date format."""
        with pytest.raises(ValidationError):
            DateValidator.validate("01/15/1990")

    def test_date_validation_future_year(self):
        """Test future year validation."""
        with pytest.raises(ValidationError):
            DateValidator.validate("2150-01-15")

    def test_time_validation_valid(self):
        """Test valid time validation."""
        time = TimeValidator.validate("14:30:45")
        assert time.hour == 14
        assert time.minute == 30
        assert time.second == 45

    def test_time_validation_short_format(self):
        """Test short time format."""
        time = TimeValidator.validate("14:30")
        assert time.hour == 14
        assert time.minute == 30

    def test_time_validation_invalid_hour(self):
        """Test invalid hour."""
        with pytest.raises(ValidationError):
            TimeValidator.validate("25:00:00")

    def test_coordinate_validation_valid(self):
        """Test valid coordinate validation."""
        lat = CoordinateValidator.validate_latitude(13.0827)
        lon = CoordinateValidator.validate_longitude(80.2707)
        assert lat == 13.0827
        assert lon == 80.2707

    def test_coordinate_validation_out_of_range(self):
        """Test coordinate out of range."""
        with pytest.raises(ValidationError):
            CoordinateValidator.validate_latitude(91.0)

    def test_string_validation_valid_name(self):
        """Test valid name validation."""
        name = StringValidator.validate_name("John Doe")
        assert name == "John Doe"

    def test_string_validation_xss_attempt(self):
        """Test XSS prevention in name validation."""
        with pytest.raises(ValidationError):
            StringValidator.validate_name("John <script>alert('xss')</script>")

    def test_chart_data_validation_complete(self):
        """Test complete chart data validation."""
        data = {
            'name': 'Test Chart',
            'birth_date': '1990-01-15',
            'birth_time': '14:30:00',
            'birth_place': 'Chennai',
            'latitude': 13.0827,
            'longitude': 80.2707,
            'timezone': 'Asia/Kolkata'
        }
        validated = ChartDataValidator.validate_chart_data(data)
        assert validated['name'] == 'Test Chart'
        assert str(validated['birth_date']) == '1990-01-15'


class TestJWTTokens:
    """Test JWT token creation and management."""

    def test_token_creation(self):
        """Test token creation."""
        access_token, refresh_token = JWTHandler.create_tokens("test-user-id")
        assert access_token is not None
        assert refresh_token is not None
        assert access_token != refresh_token

    def test_token_types(self):
        """Test that tokens have correct types."""
        access_token, refresh_token = JWTHandler.create_tokens("test-user-id")
        # Tokens should be non-empty strings
        assert isinstance(access_token, str)
        assert isinstance(refresh_token, str)
        assert len(access_token) > 20
        assert len(refresh_token) > 20


class TestRateLimiting:
    """Test rate limiting functionality."""

    def test_rate_limit_parsing_minutes(self):
        """Test rate limit parsing with minutes."""
        count, seconds = RateLimiter._parse_limit("5/15 minutes")
        assert count == 5
        assert seconds == 15 * 60

    def test_rate_limit_parsing_hours(self):
        """Test rate limit parsing with hours."""
        count, seconds = RateLimiter._parse_limit("10/1 hour")
        assert count == 10
        assert seconds == 3600

    def test_rate_limit_parsing_invalid(self):
        """Test invalid rate limit parsing."""
        count, seconds = RateLimiter._parse_limit("invalid")
        assert count == 100  # Default
        assert seconds == 3600  # Default


class TestSecurityHeaders:
    """Test security header generation."""

    def test_csp_header_generation(self):
        """Test CSP header generation."""
        from backend.security_headers import SecurityHeaderConfig

        csp = SecurityHeaderConfig.get_csp_header()
        assert "default-src 'self'" in csp
        assert "script-src 'self'" in csp
        assert "frame-ancestors 'none'" in csp

    def test_hsts_header_generation(self):
        """Test HSTS header generation."""
        from backend.security_headers import SecurityHeaderConfig

        hsts = SecurityHeaderConfig.get_hsts_header()
        assert "max-age=31536000" in hsts
        assert "includeSubDomains" in hsts
        assert "preload" in hsts


class TestPasswordPolicy:
    """Test password policy enforcement."""

    def test_password_length_minimum(self):
        """Test minimum password length."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordValidator.validate("Short1!")
        assert "12 characters" in str(exc_info.value)

    def test_password_requires_uppercase(self):
        """Test uppercase requirement."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordValidator.validate("lowercase123!@#")
        assert "uppercase" in str(exc_info.value)

    def test_password_requires_lowercase(self):
        """Test lowercase requirement."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordValidator.validate("UPPERCASE123!@#")
        assert "lowercase" in str(exc_info.value)

    def test_password_requires_numbers(self):
        """Test number requirement."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordValidator.validate("NoNumbers!@#abc")
        assert "number" in str(exc_info.value)

    def test_password_requires_special(self):
        """Test special character requirement."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordValidator.validate("NoSpecial123abc")
        assert "special" in str(exc_info.value)


class TestCoordinateValidation:
    """Test geographic coordinate validation."""

    def test_latitude_boundaries(self):
        """Test latitude boundary values."""
        # Valid boundaries
        assert CoordinateValidator.validate_latitude(-90.0) == -90.0
        assert CoordinateValidator.validate_latitude(90.0) == 90.0

        # Invalid boundaries
        with pytest.raises(ValidationError):
            CoordinateValidator.validate_latitude(-90.1)
        with pytest.raises(ValidationError):
            CoordinateValidator.validate_latitude(90.1)

    def test_longitude_boundaries(self):
        """Test longitude boundary values."""
        # Valid boundaries
        assert CoordinateValidator.validate_longitude(-180.0) == -180.0
        assert CoordinateValidator.validate_longitude(180.0) == 180.0

        # Invalid boundaries
        with pytest.raises(ValidationError):
            CoordinateValidator.validate_longitude(-180.1)
        with pytest.raises(ValidationError):
            CoordinateValidator.validate_longitude(180.1)

    def test_valid_coordinates(self):
        """Test valid real-world coordinates."""
        # Chennai, India
        lat = CoordinateValidator.validate_latitude(13.0827)
        lon = CoordinateValidator.validate_longitude(80.2707)
        assert lat == 13.0827
        assert lon == 80.2707

        # New York, USA
        lat = CoordinateValidator.validate_latitude(40.7128)
        lon = CoordinateValidator.validate_longitude(-74.0060)
        assert lat == 40.7128
        assert lon == -74.0060


# Integration test fixtures
@pytest.fixture
def client():
    """Provide Flask test client."""
    from backend.app import create_app
    app = create_app('testing')
    with app.test_client() as client:
        yield client


class TestIntegrationSecurity:
    """Integration tests for security."""

    def test_signup_weak_password(self, client):
        """Test signup with weak password."""
        response = client.post('/api/auth/signup',
            json={
                'email': 'test@example.com',
                'password': 'weak',
                'name': 'Test User'
            }
        )
        assert response.status_code == 400
        assert 'error' in response.get_json()

    def test_signup_invalid_email(self, client):
        """Test signup with invalid email."""
        response = client.post('/api/auth/signup',
            json={
                'email': 'invalid-email',
                'password': 'StrongPass123!@#',
                'name': 'Test User'
            }
        )
        assert response.status_code == 400

    def test_chart_invalid_coordinates(self, client):
        """Test chart creation with invalid coordinates."""
        # First, create a user and get token
        client.post('/api/auth/signup',
            json={
                'email': 'test@example.com',
                'password': 'StrongPass123!@#',
                'name': 'Test User'
            }
        )

        login_response = client.post('/api/auth/login',
            json={
                'email': 'test@example.com',
                'password': 'StrongPass123!@#'
            }
        )
        token = login_response.get_json()['access_token']

        # Try to create chart with invalid coordinates
        response = client.post('/api/charts/create',
            headers={'Authorization': f'Bearer {token}'},
            json={
                'name': 'Test Chart',
                'birth_date': '1990-01-15',
                'birth_time': '14:30:00',
                'birth_place': 'Chennai',
                'latitude': 91.0,  # Invalid
                'longitude': 80.2707
            }
        )
        assert response.status_code == 400


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
