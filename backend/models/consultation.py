"""
Consultation Model - Session and Record Management

Stores consultation records linked to birth charts.
Tracks notes, recommendations, and follow-up dates.
"""

from backend.database import db
from datetime import datetime
import uuid

class Consultation(db.Model):
    """Consultation model for tracking professional consultations.

    Attributes:
        id (str): Unique consultation identifier (UUID)
        chart_id (str): Foreign key to chart
        consultation_date (datetime): Date and time of consultation
        notes (str): Session notes and observations
        recommendations (str): Professional recommendations
        remedies (str): Suggested remedies
        follow_up_date (date): Scheduled follow-up date
        created_at (datetime): Record creation timestamp
        updated_at (datetime): Last update timestamp

    Relationships:
        chart: The birth chart associated with this consultation
    """

    __tablename__ = 'consultations'

    # Primary Key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Foreign Key
    chart_id = db.Column(db.String(36), db.ForeignKey('charts.id'), nullable=False, index=True)

    # Consultation Data
    consultation_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    notes = db.Column(db.Text, nullable=True)
    recommendations = db.Column(db.Text, nullable=True)
    remedies = db.Column(db.Text, nullable=True)
    follow_up_date = db.Column(db.Date, nullable=True, index=True)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        """String representation of Consultation."""
        return f'<Consultation {self.id} ({self.consultation_date.date()})>'

    def to_dict(self):
        """Convert consultation to dictionary.

        Returns:
            dict: Consultation data as dictionary
        """
        return {
            'id': self.id,
            'chart_id': self.chart_id,
            'consultation_date': self.consultation_date.isoformat(),
            'notes': self.notes,
            'recommendations': self.recommendations,
            'remedies': self.remedies,
            'follow_up_date': self.follow_up_date.isoformat() if self.follow_up_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    def to_dict_summary(self):
        """Return summary of consultation (without detailed notes)."""
        return {
            'id': self.id,
            'chart_id': self.chart_id,
            'consultation_date': self.consultation_date.isoformat(),
            'follow_up_date': self.follow_up_date.isoformat() if self.follow_up_date else None,
            'created_at': self.created_at.isoformat()
        }

    def has_follow_up(self):
        """Check if consultation has a scheduled follow-up."""
        return self.follow_up_date is not None

    def is_overdue(self):
        """Check if follow-up date has passed."""
        if self.follow_up_date is None:
            return False
        return self.follow_up_date < datetime.now().date()

    def has_complete_notes(self):
        """Check if consultation has all note sections filled."""
        return bool(self.notes and self.recommendations and self.remedies)
