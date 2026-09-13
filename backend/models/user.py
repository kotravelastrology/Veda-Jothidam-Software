"""
User Model - Authentication and Profile Management

Handles user accounts, authentication, and profile information.
Each user can have multiple birth charts and consultations.
"""

from backend.database import db
from datetime import datetime
import uuid

class User(db.Model):
    """User model for authentication and profile storage.

    Attributes:
        id (str): Unique user identifier (UUID)
        email (str): User email address (unique)
        username (str): Username (unique)
        password_hash (str): Hashed password using bcrypt
        full_name (str): Full name
        phone (str): Contact phone number
        city (str): City
        state (str): State/Province
        country (str): Country
        is_active (bool): Account active status
        created_at (datetime): Account creation timestamp
        updated_at (datetime): Last update timestamp

    Relationships:
        charts: List of birth charts belonging to this user
        consultations: List of consultations for this user's charts
    """

    __tablename__ = 'users'

    # Primary Key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Authentication
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    username = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    # Profile Information
    full_name = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)

    # Settings
    language = db.Column(db.String(20), default='tamil')  # tamil, english
    timezone = db.Column(db.String(50), default='Asia/Kolkata')

    # Account Status
    is_active = db.Column(db.Boolean, default=True)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    charts = db.relationship('Chart', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        """String representation of User."""
        return f'<User {self.username} ({self.email})>'

    def to_dict(self, include_email=True):
        """Convert user to dictionary.

        Args:
            include_email (bool): Whether to include email in output

        Returns:
            dict: User data as dictionary
        """
        data = {
            'id': self.id,
            'username': self.username,
            'full_name': self.full_name,
            'phone': self.phone,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'language': self.language,
            'timezone': self.timezone,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

        if include_email:
            data['email'] = self.email

        return data

    def to_dict_public(self):
        """Return public user information (no sensitive data)."""
        return {
            'id': self.id,
            'username': self.username,
            'full_name': self.full_name,
            'city': self.city,
            'country': self.country
        }

    def get_charts_count(self):
        """Get number of charts for this user."""
        return self.charts.count()

    def is_verified(self):
        """Check if user account is verified and active."""
        return self.is_active
