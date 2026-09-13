from backend.database import db
from datetime import datetime
import uuid
import json

class Chart(db.Model):
    """Chart model for storing user's natal charts."""
    __tablename__ = 'charts'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    # Birth Information
    name = db.Column(db.String(120), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    birth_time = db.Column(db.Time, nullable=False)
    birth_place = db.Column(db.String(150), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    timezone = db.Column(db.String(50), default='Asia/Kolkata')

    # Chart metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    phase_data = db.relationship('PhaseData', backref='chart', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        """Convert chart to dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'birth_date': self.birth_date.isoformat(),
            'birth_time': self.birth_time.isoformat(),
            'birth_place': self.birth_place,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'timezone': self.timezone,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
