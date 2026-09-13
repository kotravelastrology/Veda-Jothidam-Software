"""
Input validation utilities for security hardening.
Validates all user inputs to prevent injection attacks and data corruption.
"""

import re
from datetime import datetime, time
from typing import Tuple, Any

class ValidationError(Exception):
    """Custom validation error."""
    pass


class EmailValidator:
    """Validates email addresses according to RFC 5322."""

    # Simplified RFC 5322 pattern (production should use email_validator library)
    EMAIL_PATTERN = re.compile(
        r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    )
    MAX_LENGTH = 254

    @staticmethod
    def validate(email: str) -> str:
        """
        Validate email format.

        Args:
            email: Email string to validate

        Returns:
            Normalized email (lowercased and stripped)

        Raises:
            ValidationError: If email is invalid
        """
        if not email or not isinstance(email, str):
            raise ValidationError("Email is required and must be a string")

        email = email.strip().lower()

        if len(email) > EmailValidator.MAX_LENGTH:
            raise ValidationError(f"Email is too long (max {EmailValidator.MAX_LENGTH} characters)")

        if not EmailValidator.EMAIL_PATTERN.match(email):
            raise ValidationError("Email format is invalid")

        return email


class PasswordValidator:
    """Validates password strength and format."""

    MIN_LENGTH = 12
    REQUIRE_UPPERCASE = True
    REQUIRE_LOWERCASE = True
    REQUIRE_NUMBERS = True
    REQUIRE_SPECIAL = True
    SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    @staticmethod
    def validate(password: str) -> str:
        """
        Validate password strength.

        Args:
            password: Password string to validate

        Returns:
            Password (unchanged if valid)

        Raises:
            ValidationError: If password doesn't meet requirements
        """
        if not password or not isinstance(password, str):
            raise ValidationError("Password is required and must be a string")

        if len(password) < PasswordValidator.MIN_LENGTH:
            raise ValidationError(
                f"Password must be at least {PasswordValidator.MIN_LENGTH} characters long"
            )

        if PasswordValidator.REQUIRE_UPPERCASE and not any(c.isupper() for c in password):
            raise ValidationError("Password must contain at least one uppercase letter")

        if PasswordValidator.REQUIRE_LOWERCASE and not any(c.islower() for c in password):
            raise ValidationError("Password must contain at least one lowercase letter")

        if PasswordValidator.REQUIRE_NUMBERS and not any(c.isdigit() for c in password):
            raise ValidationError("Password must contain at least one number")

        if PasswordValidator.REQUIRE_SPECIAL:
            if not any(c in PasswordValidator.SPECIAL_CHARS for c in password):
                raise ValidationError("Password must contain at least one special character (!@#$%...)")

        return password


class DateValidator:
    """Validates date formats (YYYY-MM-DD)."""

    @staticmethod
    def validate(date_str: str) -> datetime:
        """
        Validate date format.

        Args:
            date_str: Date string in YYYY-MM-DD format

        Returns:
            datetime.date object

        Raises:
            ValidationError: If date format is invalid
        """
        if not date_str or not isinstance(date_str, str):
            raise ValidationError("Date is required and must be a string")

        try:
            date_obj = datetime.fromisoformat(date_str).date()

            # Validate reasonable date range (1800-2100)
            if date_obj.year < 1800 or date_obj.year > 2100:
                raise ValidationError("Birth year must be between 1800 and 2100")

            return date_obj
        except ValueError:
            raise ValidationError("Date must be in YYYY-MM-DD format")


class TimeValidator:
    """Validates time formats (HH:MM:SS)."""

    @staticmethod
    def validate(time_str: str) -> time:
        """
        Validate time format.

        Args:
            time_str: Time string in HH:MM:SS or HH:MM format

        Returns:
            datetime.time object

        Raises:
            ValidationError: If time format is invalid
        """
        if not time_str or not isinstance(time_str, str):
            raise ValidationError("Time is required and must be a string")

        try:
            # Support both HH:MM:SS and HH:MM formats
            parts = time_str.split(':')

            if len(parts) not in (2, 3):
                raise ValueError("Invalid time format")

            hour = int(parts[0])
            minute = int(parts[1])
            second = int(parts[2]) if len(parts) == 3 else 0

            if not (0 <= hour <= 23):
                raise ValueError("Hour must be between 0 and 23")
            if not (0 <= minute <= 59):
                raise ValueError("Minute must be between 0 and 59")
            if not (0 <= second <= 59):
                raise ValueError("Second must be between 0 and 59")

            return time(hour, minute, second)
        except (ValueError, AttributeError):
            raise ValidationError("Time must be in HH:MM:SS or HH:MM format")


class CoordinateValidator:
    """Validates geographic coordinates."""

    LATITUDE_MIN = -90.0
    LATITUDE_MAX = 90.0
    LONGITUDE_MIN = -180.0
    LONGITUDE_MAX = 180.0

    @staticmethod
    def validate_latitude(lat: Any) -> float:
        """
        Validate latitude coordinate.

        Args:
            lat: Latitude value

        Returns:
            Latitude as float

        Raises:
            ValidationError: If latitude is invalid
        """
        try:
            lat_float = float(lat)

            if not (CoordinateValidator.LATITUDE_MIN <= lat_float <= CoordinateValidator.LATITUDE_MAX):
                raise ValidationError(
                    f"Latitude must be between {CoordinateValidator.LATITUDE_MIN} and {CoordinateValidator.LATITUDE_MAX}"
                )

            return lat_float
        except (ValueError, TypeError):
            raise ValidationError("Latitude must be a valid number")

    @staticmethod
    def validate_longitude(lon: Any) -> float:
        """
        Validate longitude coordinate.

        Args:
            lon: Longitude value

        Returns:
            Longitude as float

        Raises:
            ValidationError: If longitude is invalid
        """
        try:
            lon_float = float(lon)

            if not (CoordinateValidator.LONGITUDE_MIN <= lon_float <= CoordinateValidator.LONGITUDE_MAX):
                raise ValidationError(
                    f"Longitude must be between {CoordinateValidator.LONGITUDE_MIN} and {CoordinateValidator.LONGITUDE_MAX}"
                )

            return lon_float
        except (ValueError, TypeError):
            raise ValidationError("Longitude must be a valid number")


class StringValidator:
    """Validates string inputs for length and content."""

    @staticmethod
    def validate_name(name: str, min_length: int = 1, max_length: int = 255) -> str:
        """
        Validate name string.

        Args:
            name: Name to validate
            min_length: Minimum allowed length
            max_length: Maximum allowed length

        Returns:
            Validated and stripped name

        Raises:
            ValidationError: If name is invalid
        """
        if not name or not isinstance(name, str):
            raise ValidationError("Name is required and must be a string")

        name = name.strip()

        if len(name) < min_length:
            raise ValidationError(f"Name must be at least {min_length} character(s) long")

        if len(name) > max_length:
            raise ValidationError(f"Name must not exceed {max_length} characters")

        # Check for invalid characters
        if any(c in name for c in ['<', '>', '{', '}', '&', '"', "'"]):
            raise ValidationError("Name contains invalid characters")

        return name

    @staticmethod
    def validate_place_name(place: str) -> str:
        """
        Validate birth place name.

        Args:
            place: Place name to validate

        Returns:
            Validated place name

        Raises:
            ValidationError: If place name is invalid
        """
        return StringValidator.validate_name(place, min_length=2, max_length=100)


class SelectiveFieldValidator:
    """Validates specific field updates."""

    ALLOWED_UPDATE_FIELDS = ['name', 'language', 'timezone']
    ALLOWED_LANGUAGES = ['Tamil', 'English']
    ALLOWED_TIMEZONES = [
        'Asia/Kolkata', 'Asia/Singapore', 'UTC', 'Asia/Dubai',
        'America/New_York', 'Europe/London', 'Australia/Sydney'
    ]

    @staticmethod
    def validate_update_fields(data: dict) -> dict:
        """
        Validate profile update fields.

        Args:
            data: Dictionary of fields to update

        Returns:
            Validated data dictionary

        Raises:
            ValidationError: If any field is invalid
        """
        if not isinstance(data, dict):
            raise ValidationError("Update data must be a dictionary")

        validated = {}

        for key, value in data.items():
            if key not in SelectiveFieldValidator.ALLOWED_UPDATE_FIELDS:
                raise ValidationError(f"Field '{key}' cannot be updated")

            if key == 'name':
                validated[key] = StringValidator.validate_name(value)

            elif key == 'language':
                if value not in SelectiveFieldValidator.ALLOWED_LANGUAGES:
                    raise ValidationError(
                        f"Language must be one of {SelectiveFieldValidator.ALLOWED_LANGUAGES}"
                    )
                validated[key] = value

            elif key == 'timezone':
                if value not in SelectiveFieldValidator.ALLOWED_TIMEZONES:
                    raise ValidationError(
                        f"Timezone must be one of {SelectiveFieldValidator.ALLOWED_TIMEZONES}"
                    )
                validated[key] = value

        return validated


class ChartDataValidator:
    """Validates chart creation data."""

    REQUIRED_FIELDS = ['name', 'birth_date', 'birth_time', 'birth_place', 'latitude', 'longitude']

    @staticmethod
    def validate_chart_data(data: dict) -> dict:
        """
        Validate complete chart data.

        Args:
            data: Chart data dictionary

        Returns:
            Validated and normalized chart data

        Raises:
            ValidationError: If any field is invalid
        """
        if not isinstance(data, dict):
            raise ValidationError("Chart data must be a dictionary")

        # Check required fields
        for field in ChartDataValidator.REQUIRED_FIELDS:
            if field not in data:
                raise ValidationError(f"Field '{field}' is required")

        validated = {}

        # Validate each field
        validated['name'] = StringValidator.validate_name(data['name'], max_length=100)
        validated['birth_date'] = DateValidator.validate(data['birth_date'])
        validated['birth_time'] = TimeValidator.validate(data['birth_time'])
        validated['birth_place'] = StringValidator.validate_place_name(data['birth_place'])
        validated['latitude'] = CoordinateValidator.validate_latitude(data['latitude'])
        validated['longitude'] = CoordinateValidator.validate_longitude(data['longitude'])
        validated['timezone'] = data.get('timezone', 'Asia/Kolkata')

        if validated['timezone'] not in SelectiveFieldValidator.ALLOWED_TIMEZONES:
            raise ValidationError("Invalid timezone")

        return validated


class ConsultationValidator:
    """Validates consultation data."""

    MAX_NOTES_LENGTH = 5000
    MAX_RECOMMENDATIONS_LENGTH = 5000
    MAX_REMEDIES_LENGTH = 5000

    @staticmethod
    def validate_consultation_date(date_str: str) -> datetime:
        """
        Validate consultation date/time.

        Args:
            date_str: ISO format datetime string

        Returns:
            datetime object

        Raises:
            ValidationError: If invalid
        """
        if not date_str or not isinstance(date_str, str):
            raise ValidationError("Consultation date is required")

        try:
            return datetime.fromisoformat(date_str)
        except ValueError:
            raise ValidationError("Consultation date must be in ISO format (YYYY-MM-DDTHH:MM:SS)")

    @staticmethod
    def validate_follow_up_date(date_str: str) -> 'date':
        """
        Validate follow-up date.

        Args:
            date_str: ISO format date string

        Returns:
            date object

        Raises:
            ValidationError: If invalid
        """
        if date_str is None:
            return None

        if not isinstance(date_str, str):
            raise ValidationError("Follow-up date must be a string")

        try:
            return datetime.fromisoformat(date_str).date()
        except ValueError:
            raise ValidationError("Follow-up date must be in ISO format (YYYY-MM-DD)")

    @staticmethod
    def validate_notes(notes: str) -> str:
        """
        Validate consultation notes.

        Args:
            notes: Notes text

        Returns:
            Validated notes

        Raises:
            ValidationError: If invalid
        """
        if notes is None:
            return None

        if not isinstance(notes, str):
            raise ValidationError("Notes must be a string")

        notes = notes.strip()

        if len(notes) > ConsultationValidator.MAX_NOTES_LENGTH:
            raise ValidationError(
                f"Notes too long (max {ConsultationValidator.MAX_NOTES_LENGTH} characters)"
            )

        return notes

    @staticmethod
    def validate_recommendations(recommendations: str) -> str:
        """
        Validate recommendations.

        Args:
            recommendations: Recommendations text

        Returns:
            Validated recommendations

        Raises:
            ValidationError: If invalid
        """
        if recommendations is None:
            return None

        if not isinstance(recommendations, str):
            raise ValidationError("Recommendations must be a string")

        recommendations = recommendations.strip()

        if len(recommendations) > ConsultationValidator.MAX_RECOMMENDATIONS_LENGTH:
            raise ValidationError(
                f"Recommendations too long (max {ConsultationValidator.MAX_RECOMMENDATIONS_LENGTH} characters)"
            )

        return recommendations

    @staticmethod
    def validate_remedies(remedies: str) -> str:
        """
        Validate remedies.

        Args:
            remedies: Remedies text

        Returns:
            Validated remedies

        Raises:
            ValidationError: If invalid
        """
        if remedies is None:
            return None

        if not isinstance(remedies, str):
            raise ValidationError("Remedies must be a string")

        remedies = remedies.strip()

        if len(remedies) > ConsultationValidator.MAX_REMEDIES_LENGTH:
            raise ValidationError(
                f"Remedies too long (max {ConsultationValidator.MAX_REMEDIES_LENGTH} characters)"
            )

        return remedies

    @staticmethod
    def validate_consultation_data(data: dict) -> dict:
        """
        Validate complete consultation data.

        Args:
            data: Consultation data dictionary

        Returns:
            Validated consultation data

        Raises:
            ValidationError: If any field is invalid
        """
        if not isinstance(data, dict):
            raise ValidationError("Consultation data must be a dictionary")

        validated = {}

        # Optional fields
        if 'consultation_date' in data:
            validated['consultation_date'] = ConsultationValidator.validate_consultation_date(
                data['consultation_date']
            )

        if 'follow_up_date' in data:
            validated['follow_up_date'] = ConsultationValidator.validate_follow_up_date(
                data['follow_up_date']
            )

        if 'notes' in data:
            validated['notes'] = ConsultationValidator.validate_notes(data['notes'])

        if 'recommendations' in data:
            validated['recommendations'] = ConsultationValidator.validate_recommendations(
                data['recommendations']
            )

        if 'remedies' in data:
            validated['remedies'] = ConsultationValidator.validate_remedies(data['remedies'])

        return validated
