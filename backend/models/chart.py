"""
Chart Model - Birth Chart Storage and Calculation Data

Stores natal charts and all calculated astrological data.
Supports multiple ayanamsa systems and calculation methods.
"""

from database import db
from datetime import datetime
import uuid
import json

class Chart(db.Model):
    """Chart model for storing user's natal charts and calculations.

    Attributes:
        id (str): Unique chart identifier (UUID)
        user_id (str): Foreign key to user
        name (str): Chart name/title
        birth_date (date): Birth date
        birth_time (time): Birth time
        birth_location (str): Birth location name
        latitude (float): Birth location latitude (-90 to 90)
        longitude (float): Birth location longitude (-180 to 180)
        timezone (str): Birth timezone
        ayanamsa (str): Ayanamsa system (lahiri, raman, kp, true_citra)
        node_type (str): Node type (mean, true)
        d1_data (dict): D1 (Rasi) chart data (JSON)
        dasha_data (dict): Dasha period calculations (JSON)
        planetary_strength (dict): Planetary strength scores (JSON)
        house_strength (dict): House strength scores (JSON)
        created_at (datetime): Creation timestamp
        updated_at (datetime): Last update timestamp

    Relationships:
        consultations: List of consultations for this chart
    """

    __tablename__ = 'charts'

    # Primary Key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Foreign Key
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    # Birth Information
    name = db.Column(db.String(255), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    birth_time = db.Column(db.Time, nullable=False)
    birth_location = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)  # -90 to 90
    longitude = db.Column(db.Float, nullable=False)  # -180 to 180
    timezone = db.Column(db.String(50), default='Asia/Kolkata')

    # Chart System Settings
    ayanamsa = db.Column(db.String(50), default='lahiri')  # lahiri, raman, kp, true_citra
    node_type = db.Column(db.String(50), default='mean')  # mean, true

    # Calculated Data (stored as JSONB)
    d1_data = db.Column(db.JSON)                # D1 Rasi chart data
    dasha_data = db.Column(db.JSON)             # Vimshottari dasha periods
    planetary_strength = db.Column(db.JSON)     # Grahapalam (Shadbala)
    house_strength = db.Column(db.JSON)         # Bhavapalam

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    consultations = db.relationship('Consultation', backref='chart', lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        """String representation of Chart."""
        return f'<Chart {self.name} ({self.birth_date})>'

    def to_dict(self, include_calculations=False):
        """Convert chart to dictionary.

        Args:
            include_calculations (bool): Whether to include calculated data

        Returns:
            dict: Chart data as dictionary
        """
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'birth_date': self.birth_date.isoformat(),
            'birth_time': self.birth_time.isoformat(),
            'birth_location': self.birth_location,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'timezone': self.timezone,
            'ayanamsa': self.ayanamsa,
            'node_type': self.node_type,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

        if include_calculations:
            data['d1_data'] = self.d1_data
            data['dasha_data'] = self.dasha_data
            data['planetary_strength'] = self.planetary_strength
            data['house_strength'] = self.house_strength

        return data

    def to_dict_full(self):
        """Return full chart data including all calculations."""
        return self.to_dict(include_calculations=True)

    def get_lagna(self):
        """Get lagna (ascendant) from D1 data."""
        if self.d1_data and 'ascendant' in self.d1_data:
            return self.d1_data['ascendant']
        return None

    def get_dasha_periods(self):
        """Get dasha periods from calculated data."""
        if self.dasha_data and 'periods' in self.dasha_data:
            return self.dasha_data['periods']
        return []

    def get_consultations_count(self):
        """Get number of consultations for this chart."""
        return self.consultations.count()

    def is_calculated(self):
        """Check if chart has been calculated."""
        return bool(self.d1_data and self.dasha_data)
