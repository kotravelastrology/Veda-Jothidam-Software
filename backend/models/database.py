"""
Database Models for Veda Jothidam Platform

Models:
- User: User authentication and profile
- BirthChart: Birth chart data storage
- Consultation: Consultation booking
- Astrologer: Expert/consultant profile
- Interpretation: Saved interpretations
- Subscription: Premium membership

Setup:
- SQLAlchemy ORM
- Flask-SQLAlchemy integration
- UUID primary keys
- Timestamps on all models
- Foreign key relationships
- Cascade delete policies
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
import uuid

# Initialize SQLAlchemy
db = SQLAlchemy()


# ==================== USER MODEL ====================

class User(db.Model):
    """User model for authentication and profile management"""

    __tablename__ = 'users'
    __table_args__ = (
        db.Index('idx_email', 'email'),
        db.Index('idx_username', 'username'),
        db.Index('idx_created_at', 'created_at'),
    )

    # Primary key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Authentication
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    username = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    # Profile information
    full_name = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    profile_image = db.Column(db.String(500))
    bio = db.Column(db.Text)
    date_of_birth = db.Column(db.Date)

    # Preferences
    language = db.Column(db.String(10), default='en')  # en, ta, hi, etc.
    timezone = db.Column(db.String(50), default='UTC')
    theme = db.Column(db.String(20), default='light')  # light, dark, auto

    # Account status
    is_active = db.Column(db.Boolean, default=True, index=True)
    is_email_verified = db.Column(db.Boolean, default=False)
    email_verified_at = db.Column(db.DateTime)

    # Premium subscription
    is_premium = db.Column(db.Boolean, default=False)
    premium_until = db.Column(db.DateTime)
    premium_plan = db.Column(db.String(50))  # basic, pro, expert

    # Activity tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    last_login_ip = db.Column(db.String(45))  # IPv4 or IPv6

    # Relationships
    charts = db.relationship('BirthChart', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    consultations = db.relationship('Consultation', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    saved_interpretations = db.relationship('Interpretation', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    subscriptions = db.relationship('Subscription', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password: str):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password: str) -> bool:
        """Verify password"""
        return check_password_hash(self.password_hash, password)

    def generate_token(self, expires_in: int = 86400) -> str:
        """
        Generate JWT authentication token

        Args:
            expires_in: Token expiration in seconds (default: 24 hours)

        Returns:
            JWT token string
        """
        return jwt.encode(
            {
                'user_id': self.id,
                'email': self.email,
                'exp': datetime.utcnow().timestamp() + expires_in,
                'iat': datetime.utcnow().timestamp(),
            },
            os.environ.get('JWT_SECRET', 'veda-jothidam-dev-secret-key'),
            algorithm='HS256'
        )

    def generate_refresh_token(self, expires_in: int = 604800) -> str:
        """
        Generate JWT refresh token (7 days)

        Args:
            expires_in: Token expiration in seconds (default: 7 days)

        Returns:
            JWT refresh token string
        """
        return jwt.encode(
            {
                'user_id': self.id,
                'type': 'refresh',
                'exp': datetime.utcnow().timestamp() + expires_in,
            },
            os.environ.get('JWT_SECRET', 'veda-jothidam-dev-secret-key'),
            algorithm='HS256'
        )

    @staticmethod
    def verify_token(token: str) -> dict:
        """
        Verify and decode JWT token

        Args:
            token: JWT token string

        Returns:
            Token payload dict or None if invalid
        """
        try:
            return jwt.decode(
                token,
                os.environ.get('JWT_SECRET', 'veda-jothidam-dev-secret-key'),
                algorithms=['HS256']
            )
        except jwt.ExpiredSignatureError:
            return None  # Token expired
        except jwt.InvalidTokenError:
            return None  # Invalid token

    def to_dict(self, include_email: bool = False) -> dict:
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'username': self.username,
            'full_name': self.full_name,
            'profile_image': self.profile_image,
            'is_premium': self.is_premium,
            'language': self.language,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if include_email:
            data['email'] = self.email
        return data


# ==================== BIRTH CHART MODEL ====================

class BirthChart(db.Model):
    """Birth chart data storage"""

    __tablename__ = 'birth_charts'
    __table_args__ = (
        db.Index('idx_user_id', 'user_id'),
        db.Index('idx_created_at', 'created_at'),
        db.Index('idx_is_public', 'is_public'),
    )

    # Primary key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    # Basic information
    name = db.Column(db.String(255), nullable=False)
    birth_date = db.Column(db.DateTime, nullable=False, index=True)
    birth_time = db.Column(db.Time)
    birth_place = db.Column(db.String(255))
    birth_latitude = db.Column(db.Float)
    birth_longitude = db.Column(db.Float)

    # Astrological data (stored as JSON)
    chart_data = db.Column(db.JSON)  # Planetary positions, houses, etc.
    strength_data = db.Column(db.JSON)  # Shadbala calculations
    dasha_data = db.Column(db.JSON)  # Dasha periods

    # Metadata
    is_public = db.Column(db.Boolean, default=False, index=True)
    description = db.Column(db.Text)
    notes = db.Column(db.Text)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_analyzed_at = db.Column(db.DateTime)

    # Relationships
    consultations = db.relationship('Consultation', backref='chart', lazy='dynamic', cascade='all, delete-orphan')
    interpretations = db.relationship('Interpretation', backref='chart', lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<BirthChart {self.name}>'

    def to_dict(self, include_data: bool = False) -> dict:
        """Convert chart to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'birth_place': self.birth_place,
            'is_public': self.is_public,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if include_data:
            data.update({
                'chart_data': self.chart_data,
                'strength_data': self.strength_data,
                'dasha_data': self.dasha_data,
            })
        return data


# ==================== CONSULTATION MODEL ====================

class Consultation(db.Model):
    """Consultation booking and management"""

    __tablename__ = 'consultations'
    __table_args__ = (
        db.Index('idx_user_id', 'user_id'),
        db.Index('idx_astrologer_id', 'astrologer_id'),
        db.Index('idx_status', 'status'),
        db.Index('idx_scheduled_date', 'scheduled_date'),
    )

    # Primary key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    chart_id = db.Column(db.String(36), db.ForeignKey('birth_charts.id'), nullable=True)
    astrologer_id = db.Column(db.String(36), db.ForeignKey('astrologers.id'), nullable=True)

    # Consultation details
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    consultation_type = db.Column(db.String(50), nullable=False)  # online, in-person, phone, email

    # Scheduling
    scheduled_date = db.Column(db.DateTime, nullable=False, index=True)
    duration_minutes = db.Column(db.Integer, default=60)
    time_zone = db.Column(db.String(50), default='UTC')

    # Status tracking
    status = db.Column(db.String(20), default='pending', index=True)  # pending, confirmed, in-progress, completed, cancelled
    cancellation_reason = db.Column(db.Text)
    cancelled_by = db.Column(db.String(50))  # user, astrologer, system

    # Details
    meeting_link = db.Column(db.String(500))  # For online consultations
    location = db.Column(db.String(255))  # For in-person consultations
    notes = db.Column(db.Text)  # Internal notes
    client_notes = db.Column(db.Text)  # Notes from client

    # Pricing
    price = db.Column(db.Float)
    currency = db.Column(db.String(10), default='USD')
    payment_status = db.Column(db.String(20), default='pending')  # pending, completed, refunded

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)

    def __repr__(self):
        return f'<Consultation {self.title}>'

    def to_dict(self) -> dict:
        """Convert consultation to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'consultation_type': self.consultation_type,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'duration_minutes': self.duration_minutes,
            'status': self.status,
            'price': self.price,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ==================== ASTROLOGER MODEL ====================

class Astrologer(db.Model):
    """Astrologer/expert profile"""

    __tablename__ = 'astrologers'
    __table_args__ = (
        db.Index('idx_email', 'email'),
        db.Index('idx_is_available', 'is_available'),
    )

    # Primary key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Basic information
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    profile_image = db.Column(db.String(500))

    # Professional details
    title = db.Column(db.String(100))  # Dr., Pandit, etc.
    bio = db.Column(db.Text)
    expertise = db.Column(db.JSON)  # List of expertise areas
    education = db.Column(db.JSON)  # Educational background

    # Availability and pricing
    is_available = db.Column(db.Boolean, default=True, index=True)
    availability_hours = db.Column(db.JSON)  # Working hours
    rate_per_hour = db.Column(db.Float, nullable=False)

    # Ratings and reviews
    rating = db.Column(db.Float, default=0.0)  # Average rating
    total_reviews = db.Column(db.Integer, default=0)
    total_consultations = db.Column(db.Integer, default=0)

    # Status
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    consultations = db.relationship('Consultation', backref='astrologer', lazy='dynamic')

    def __repr__(self):
        return f'<Astrologer {self.name}>'

    def to_dict(self) -> dict:
        """Convert astrologer to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'title': self.title,
            'profile_image': self.profile_image,
            'expertise': self.expertise,
            'rating': self.rating,
            'rate_per_hour': self.rate_per_hour,
            'total_consultations': self.total_consultations,
        }


# ==================== INTERPRETATION MODEL ====================

class Interpretation(db.Model):
    """Saved interpretations and analysis"""

    __tablename__ = 'interpretations'
    __table_args__ = (
        db.Index('idx_user_id', 'user_id'),
        db.Index('idx_chart_id', 'chart_id'),
        db.Index('idx_created_at', 'created_at'),
    )

    # Primary key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    chart_id = db.Column(db.String(36), db.ForeignKey('birth_charts.id'), nullable=False)

    # Interpretation details
    interpretation_type = db.Column(db.String(50), nullable=False)  # personality, career, relationships, etc.
    title = db.Column(db.String(255))
    data = db.Column(db.JSON)  # Complete interpretation data

    # Metadata
    language = db.Column(db.String(10), default='en')
    is_shared = db.Column(db.Boolean, default=False)
    shared_with = db.Column(db.JSON)  # List of user IDs interpretation is shared with

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Interpretation {self.interpretation_type}>'


# ==================== SUBSCRIPTION MODEL ====================

class Subscription(db.Model):
    """Premium subscription management"""

    __tablename__ = 'subscriptions'
    __table_args__ = (
        db.Index('idx_user_id', 'user_id'),
        db.Index('idx_status', 'status'),
    )

    # Primary key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    # Subscription details
    plan = db.Column(db.String(50), nullable=False)  # basic, pro, expert
    status = db.Column(db.String(20), default='active', index=True)  # active, cancelled, expired, suspended

    # Billing
    price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default='USD')
    billing_cycle = db.Column(db.String(50), default='monthly')  # monthly, yearly

    # Payment tracking
    stripe_subscription_id = db.Column(db.String(255))
    next_billing_date = db.Column(db.DateTime)
    last_payment_date = db.Column(db.DateTime)

    # Features
    max_charts = db.Column(db.Integer, default=5)
    max_consultations = db.Column(db.Integer, default=5)
    consultation_discount = db.Column(db.Float, default=0)  # Percentage discount
    has_priority_support = db.Column(db.Boolean, default=False)
    has_export_feature = db.Column(db.Boolean, default=False)

    # Dates
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    cancellation_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Subscription {self.user_id} - {self.plan}>'

    def is_active(self) -> bool:
        """Check if subscription is currently active"""
        if self.status != 'active':
            return False
        if self.end_date and self.end_date < datetime.utcnow():
            return False
        return True

    def to_dict(self) -> dict:
        """Convert subscription to dictionary"""
        return {
            'id': self.id,
            'plan': self.plan,
            'status': self.status,
            'price': self.price,
            'billing_cycle': self.billing_cycle,
            'is_active': self.is_active(),
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
        }


# ==================== DATABASE INITIALIZATION ====================

def init_db(app):
    """
    Initialize database with Flask app

    Args:
        app: Flask application instance
    """
    db.init_app(app)

    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully")


def reset_db(app):
    """
    Reset database (drop all tables and recreate)
    WARNING: This will delete all data!

    Args:
        app: Flask application instance
    """
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("✅ Database reset successfully")
