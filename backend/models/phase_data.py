from database import db
from datetime import datetime
import uuid
import json

class PhaseData(db.Model):
    """PhaseData model for storing calculation results from Phase 1-13."""
    __tablename__ = 'phase_data'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chart_id = db.Column(db.String(36), db.ForeignKey('charts.id'), nullable=False, index=True)

    # Phase information (1-13)
    phase_number = db.Column(db.Integer, nullable=False, index=True)
    phase_name = db.Column(db.String(100), nullable=False)

    # Calculation data (stored as JSON)
    data = db.Column(db.JSON, nullable=True)

    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Index for efficient querying
    __table_args__ = (
        db.Index('idx_chart_phase', 'chart_id', 'phase_number'),
    )

    def to_dict(self):
        """Convert phase data to dictionary."""
        return {
            'id': self.id,
            'chart_id': self.chart_id,
            'phase_number': self.phase_number,
            'phase_name': self.phase_name,
            'data': self.data,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    @staticmethod
    def get_phases_for_chart(chart_id):
        """Get all phase data for a chart."""
        return PhaseData.query.filter_by(chart_id=chart_id).order_by(PhaseData.phase_number).all()
