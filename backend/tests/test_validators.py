"""
Unit Tests for Input Validators

Tests for email, password, date, time, coordinate, and chart validation.
"""

import unittest
from validators import (
    EmailValidator, PasswordValidator, DateValidator, TimeValidator,
    CoordinateValidator, StringValidator, SelectiveFieldValidator,
    ChartDataValidator, ValidationError
)
from datetime import date, time


class TestEmailValidator(unittest.TestCase):
    """Test cases for EmailValidator."""

    def test_valid_email(self):
        """Test validation of valid email addresses."""
        valid_emails = [
            'user@example.com',
            'test.user@domain.co.uk',
            'user+tag@example.org',
            'contact123@mail.com'
        ]
        for email in valid_emails:
            result = EmailValidator.validate(email)
            self.assertEqual(result, email.lower())

    def test_email_normalization(self):
        """Test email normalization (lowercase, strip whitespace)."""
        email = '  USER@EXAMPLE.COM  '
        result = EmailValidator.validate(email)
        self.assertEqual(result, 'user@example.com')

    def test_invalid_email_format(self):
        """Test rejection of invalid email formats."""
        invalid_emails = [
            'invalid.email',
            '@example.com',
            'user@',
            'user @example.com',
            'user@example',
        ]
        for email in invalid_emails:
            with self.assertRaises(ValidationError):
                EmailValidator.validate(email)

    def test_email_too_long(self):
        """Test rejection of emails exceeding max length."""
        long_email = 'a' * 200 + '@example.com'
        with self.assertRaises(ValidationError):
            EmailValidator.validate(long_email)

    def test_email_required(self):
        """Test that empty email is rejected."""
        with self.assertRaises(ValidationError):
            EmailValidator.validate('')

        with self.assertRaises(ValidationError):
            EmailValidator.validate(None)


class TestPasswordValidator(unittest.TestCase):
    """Test cases for PasswordValidator."""

    def test_valid_password(self):
        """Test validation of strong passwords."""
        valid_passwords = [
            'SecurePass123!',
            'MyPassword@2024',
            'Complex!Pass789',
        ]
        for password in valid_passwords:
            result = PasswordValidator.validate(password)
            self.assertEqual(result, password)

    def test_password_too_short(self):
        """Test rejection of short passwords."""
        with self.assertRaises(ValidationError):
            PasswordValidator.validate('Short1!')

    def test_password_missing_uppercase(self):
        """Test rejection of passwords without uppercase."""
        with self.assertRaises(ValidationError):
            PasswordValidator.validate('lowercase123!')

    def test_password_missing_lowercase(self):
        """Test rejection of passwords without lowercase."""
        with self.assertRaises(ValidationError):
            PasswordValidator.validate('UPPERCASE123!')

    def test_password_missing_numbers(self):
        """Test rejection of passwords without numbers."""
        with self.assertRaises(ValidationError):
            PasswordValidator.validate('NoNumbers!')

    def test_password_missing_special(self):
        """Test rejection of passwords without special characters."""
        with self.assertRaises(ValidationError):
            PasswordValidator.validate('NoSpecial123')

    def test_password_required(self):
        """Test that empty password is rejected."""
        with self.assertRaises(ValidationError):
            PasswordValidator.validate('')


class TestDateValidator(unittest.TestCase):
    """Test cases for DateValidator."""

    def test_valid_date(self):
        """Test validation of valid dates."""
        valid_dates = [
            '2000-01-15',
            '1950-06-30',
            '2025-12-31',
        ]
        for date_str in valid_dates:
            result = DateValidator.validate(date_str)
            self.assertIsInstance(result, date)

    def test_invalid_date_format(self):
        """Test rejection of invalid date formats."""
        invalid_dates = [
            '15-01-2000',  # Wrong format
            '2000/01/15',  # Wrong separator
            '2000-1-15',   # Missing leading zero
        ]
        for date_str in invalid_dates:
            with self.assertRaises(ValidationError):
                DateValidator.validate(date_str)

    def test_date_out_of_range(self):
        """Test rejection of dates outside valid range (1800-2100)."""
        with self.assertRaises(ValidationError):
            DateValidator.validate('1799-12-31')

        with self.assertRaises(ValidationError):
            DateValidator.validate('2101-01-01')

    def test_date_required(self):
        """Test that empty date is rejected."""
        with self.assertRaises(ValidationError):
            DateValidator.validate('')


class TestTimeValidator(unittest.TestCase):
    """Test cases for TimeValidator."""

    def test_valid_time_hms(self):
        """Test validation of HH:MM:SS format."""
        valid_times = [
            '12:30:00',
            '00:00:00',
            '23:59:59',
        ]
        for time_str in valid_times:
            result = TimeValidator.validate(time_str)
            self.assertIsInstance(result, time)

    def test_valid_time_hm(self):
        """Test validation of HH:MM format."""
        result = TimeValidator.validate('12:30')
        self.assertEqual(result.hour, 12)
        self.assertEqual(result.minute, 30)

    def test_invalid_hour(self):
        """Test rejection of invalid hour values."""
        with self.assertRaises(ValidationError):
            TimeValidator.validate('25:30:00')

    def test_invalid_minute(self):
        """Test rejection of invalid minute values."""
        with self.assertRaises(ValidationError):
            TimeValidator.validate('12:60:00')

    def test_invalid_second(self):
        """Test rejection of invalid second values."""
        with self.assertRaises(ValidationError):
            TimeValidator.validate('12:30:60')

    def test_invalid_time_format(self):
        """Test rejection of invalid time formats."""
        with self.assertRaises(ValidationError):
            TimeValidator.validate('12-30-00')


class TestCoordinateValidator(unittest.TestCase):
    """Test cases for CoordinateValidator."""

    def test_valid_latitude(self):
        """Test validation of valid latitudes."""
        valid_lats = [0.0, 90.0, -90.0, 13.0827, -33.8688]
        for lat in valid_lats:
            result = CoordinateValidator.validate_latitude(lat)
            self.assertEqual(result, float(lat))

    def test_invalid_latitude_range(self):
        """Test rejection of latitudes outside range."""
        with self.assertRaises(ValidationError):
            CoordinateValidator.validate_latitude(91.0)

        with self.assertRaises(ValidationError):
            CoordinateValidator.validate_latitude(-91.0)

    def test_latitude_string_conversion(self):
        """Test latitude conversion from string."""
        result = CoordinateValidator.validate_latitude('13.0827')
        self.assertEqual(result, 13.0827)

    def test_valid_longitude(self):
        """Test validation of valid longitudes."""
        valid_lons = [0.0, 180.0, -180.0, 80.2707, -0.1278]
        for lon in valid_lons:
            result = CoordinateValidator.validate_longitude(lon)
            self.assertEqual(result, float(lon))

    def test_invalid_longitude_range(self):
        """Test rejection of longitudes outside range."""
        with self.assertRaises(ValidationError):
            CoordinateValidator.validate_longitude(181.0)

        with self.assertRaises(ValidationError):
            CoordinateValidator.validate_longitude(-181.0)

    def test_longitude_string_conversion(self):
        """Test longitude conversion from string."""
        result = CoordinateValidator.validate_longitude('80.2707')
        self.assertEqual(result, 80.2707)

    def test_invalid_coordinate_type(self):
        """Test rejection of invalid types."""
        with self.assertRaises(ValidationError):
            CoordinateValidator.validate_latitude('not_a_number')

        with self.assertRaises(ValidationError):
            CoordinateValidator.validate_longitude([80.2707])


class TestStringValidator(unittest.TestCase):
    """Test cases for StringValidator."""

    def test_valid_name(self):
        """Test validation of valid names."""
        valid_names = [
            'John Doe',
            'Maria Garcia',
            'Chen Wei',
        ]
        for name in valid_names:
            result = StringValidator.validate_name(name)
            self.assertEqual(result, name)

    def test_name_stripped(self):
        """Test that names are trimmed."""
        result = StringValidator.validate_name('  John Doe  ')
        self.assertEqual(result, 'John Doe')

    def test_name_min_length(self):
        """Test rejection of names below minimum length."""
        with self.assertRaises(ValidationError):
            StringValidator.validate_name('')

    def test_name_max_length(self):
        """Test rejection of names exceeding maximum length."""
        long_name = 'A' * 300
        with self.assertRaises(ValidationError):
            StringValidator.validate_name(long_name)

    def test_name_invalid_characters(self):
        """Test rejection of names with invalid characters."""
        invalid_names = [
            'John <Doe>',
            'John {Doe}',
            'John & Doe',
        ]
        for name in invalid_names:
            with self.assertRaises(ValidationError):
                StringValidator.validate_name(name)

    def test_valid_place_name(self):
        """Test validation of place names."""
        valid_places = [
            'Chennai',
            'New York',
            'São Paulo',
        ]
        for place in valid_places:
            result = StringValidator.validate_place_name(place)
            self.assertEqual(result, place)

    def test_place_name_too_short(self):
        """Test rejection of place names that are too short."""
        with self.assertRaises(ValidationError):
            StringValidator.validate_place_name('A')

    def test_place_name_too_long(self):
        """Test rejection of place names that are too long."""
        long_place = 'A' * 200
        with self.assertRaises(ValidationError):
            StringValidator.validate_place_name(long_place)


class TestChartDataValidator(unittest.TestCase):
    """Test cases for ChartDataValidator."""

    def setUp(self):
        """Set up test data."""
        self.valid_chart_data = {
            'name': 'Birth Chart',
            'birth_date': '2000-01-15',
            'birth_time': '12:30:00',
            'birth_place': 'Chennai, India',
            'latitude': 13.0827,
            'longitude': 80.2707,
            'timezone': 'Asia/Kolkata'
        }

    def test_valid_chart_data(self):
        """Test validation of complete valid chart data."""
        result = ChartDataValidator.validate_chart_data(self.valid_chart_data)
        self.assertIn('name', result)
        self.assertIn('birth_date', result)
        self.assertIn('birth_time', result)
        self.assertIn('birth_place', result)
        self.assertIn('latitude', result)
        self.assertIn('longitude', result)

    def test_missing_required_field(self):
        """Test rejection when required field is missing."""
        incomplete_data = self.valid_chart_data.copy()
        del incomplete_data['name']

        with self.assertRaises(ValidationError):
            ChartDataValidator.validate_chart_data(incomplete_data)

    def test_invalid_birth_date(self):
        """Test rejection of invalid birth date."""
        invalid_data = self.valid_chart_data.copy()
        invalid_data['birth_date'] = 'invalid-date'

        with self.assertRaises(ValidationError):
            ChartDataValidator.validate_chart_data(invalid_data)

    def test_invalid_coordinates(self):
        """Test rejection of invalid coordinates."""
        invalid_data = self.valid_chart_data.copy()
        invalid_data['latitude'] = 95.0  # Out of range

        with self.assertRaises(ValidationError):
            ChartDataValidator.validate_chart_data(invalid_data)

    def test_invalid_timezone(self):
        """Test rejection of invalid timezone."""
        invalid_data = self.valid_chart_data.copy()
        invalid_data['timezone'] = 'Invalid/Timezone'

        with self.assertRaises(ValidationError):
            ChartDataValidator.validate_chart_data(invalid_data)

    def test_default_timezone(self):
        """Test that default timezone is applied."""
        data = self.valid_chart_data.copy()
        del data['timezone']

        result = ChartDataValidator.validate_chart_data(data)
        self.assertEqual(result['timezone'], 'Asia/Kolkata')

    def test_non_dict_input(self):
        """Test rejection of non-dictionary input."""
        with self.assertRaises(ValidationError):
            ChartDataValidator.validate_chart_data([])

        with self.assertRaises(ValidationError):
            ChartDataValidator.validate_chart_data('not a dict')

    def test_name_length_validation(self):
        """Test chart name length validation."""
        invalid_data = self.valid_chart_data.copy()
        invalid_data['name'] = 'A' * 300  # Too long

        with self.assertRaises(ValidationError):
            ChartDataValidator.validate_chart_data(invalid_data)

    def test_place_name_length_validation(self):
        """Test birth place name length validation."""
        invalid_data = self.valid_chart_data.copy()
        invalid_data['birth_place'] = 'A'  # Too short

        with self.assertRaises(ValidationError):
            ChartDataValidator.validate_chart_data(invalid_data)


class TestSelectiveFieldValidator(unittest.TestCase):
    """Test cases for SelectiveFieldValidator."""

    def test_valid_update_fields(self):
        """Test validation of valid update fields."""
        data = {
            'name': 'New Chart Name',
            'language': 'Tamil',
            'timezone': 'Asia/Singapore'
        }
        result = SelectiveFieldValidator.validate_update_fields(data)
        self.assertEqual(result['name'], 'New Chart Name')

    def test_invalid_update_field(self):
        """Test rejection of invalid update fields."""
        data = {'email': 'new@example.com'}  # email cannot be updated

        with self.assertRaises(ValidationError):
            SelectiveFieldValidator.validate_update_fields(data)

    def test_invalid_language(self):
        """Test rejection of invalid language."""
        data = {'language': 'Unsupported'}

        with self.assertRaises(ValidationError):
            SelectiveFieldValidator.validate_update_fields(data)

    def test_invalid_timezone(self):
        """Test rejection of invalid timezone."""
        data = {'timezone': 'Invalid/Zone'}

        with self.assertRaises(ValidationError):
            SelectiveFieldValidator.validate_update_fields(data)

    def test_non_dict_input(self):
        """Test rejection of non-dictionary input."""
        with self.assertRaises(ValidationError):
            SelectiveFieldValidator.validate_update_fields('not a dict')


class TestValidationErrorHandling(unittest.TestCase):
    """Test validation error handling."""

    def test_validation_error_message(self):
        """Test that validation errors contain descriptive messages."""
        try:
            EmailValidator.validate('invalid-email')
            self.fail("Should have raised ValidationError")
        except ValidationError as e:
            self.assertIn('Email format is invalid', str(e))

    def test_validation_error_contains_context(self):
        """Test that validation errors provide context."""
        try:
            DateValidator.validate('1700-01-01')  # Year out of range
            self.fail("Should have raised ValidationError")
        except ValidationError as e:
            self.assertIn('1800 and 2100', str(e))


if __name__ == '__main__':
    unittest.main()
