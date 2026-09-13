# Week 3 Implementation - Backend Integration & Advanced Features
## வேத ஜோதிடம் - Week 3 (September 13-20, 2026)

**Status:** 🚀 READY TO START  
**Phase:** User System & Interpretation Engine  
**Goal:** Build user authentication, interpretation engine, and advanced features

---

## Overview

Week 3 focuses on backend integration, user system setup, and building the interpretation engine to provide detailed astrological insights. This phase transforms calculated data into actionable insights and enables user management.

**Key Deliverables:**
- Interpretation Engine (personality, career, relationships, etc.)
- User Authentication System (JWT + Database)
- Database Models and ORM Setup
- Chart Storage and Retrieval
- Export/Print Functionality
- Email Notification System
- Consultation Booking Module
- Analytics Dashboard

**Target Completion:** Friday, September 20, 2026

---

## Daily Schedule

### Monday Sept 13 - Interpretation Engine

#### Task 3.1: Astrological Interpretation Engine
**Time:** 3 hours | **Priority:** CRITICAL

**Objective:** Create interpretation engine that generates text-based insights from calculated data

```python
# File: backend/calculations/interpretation.py

from dataclasses import dataclass
from typing import Dict, List
from datetime import datetime

@dataclass
class InterpretationResult:
    """Astrological interpretation result"""
    section: str                    # personality, career, relationships, etc.
    title: str                      # Section title
    insights: List[str]             # Key insights (3-5 points)
    challenges: List[str]           # Challenges and obstacles
    recommendations: List[str]      # Actionable recommendations
    tamil_text: Optional[str] = None  # Tamil translation
    confidence_score: float = 0.0   # 0-100 interpretation confidence


class AstrologicalInterpreter:
    """Generate interpretations from chart data"""
    
    def __init__(self, birth_date: datetime, chart_data: Dict):
        self.birth_date = birth_date
        self.chart_data = chart_data
        
    def interpret_personality(self) -> InterpretationResult:
        """Interpret personality based on Ascendant and Moon"""
        # Analyze Ascendant sign
        # Analyze Moon position
        # Check 1st house planets
        # Generate personality insights
        
    def interpret_career(self) -> InterpretationResult:
        """Interpret career prospects"""
        # Analyze 10th house (career)
        # Check Sun position (authority)
        # Check Mercury (communication)
        # Generate career insights
        
    def interpret_relationships(self) -> InterpretationResult:
        """Interpret relationship potential"""
        # Analyze 7th house (marriage)
        # Check Venus position (love)
        # Check 5th house (romance)
        # Generate relationship insights
        
    def interpret_health(self) -> InterpretationResult:
        """Interpret health prospects"""
        # Analyze 6th house (health)
        # Check Mars position (vitality)
        # Check Moon position (mind)
        # Generate health insights
        
    def interpret_spiritual(self) -> InterpretationResult:
        """Interpret spiritual potential"""
        # Analyze 9th house (spirituality)
        # Check Jupiter position (wisdom)
        # Check 12th house (liberation)
        # Generate spiritual insights
        
    def interpret_financial(self) -> InterpretationResult:
        """Interpret financial prospects"""
        # Analyze 2nd house (wealth)
        # Check 11th house (gains)
        # Check Jupiter (fortune)
        # Generate financial insights
        
    def get_all_interpretations(self) -> Dict[str, InterpretationResult]:
        """Get all 6 interpretations at once"""
        return {
            'personality': self.interpret_personality(),
            'career': self.interpret_career(),
            'relationships': self.interpret_relationships(),
            'health': self.interpret_health(),
            'spiritual': self.interpret_spiritual(),
            'financial': self.interpret_financial(),
        }
    
    def generate_remedies(self) -> List[str]:
        """Generate personalized remedies based on chart"""
        # Analyze weak planets
        # Recommend mantras
        # Suggest gemstones
        # Recommend yantras
        # Suggest rituals
        
    def get_key_strengths(self) -> List[str]:
        """Extract 3-5 key strengths from chart"""
        # Find exalted planets
        # Find strong houses
        # Find beneficial yogas
        # Return list of strengths
```

**Implementation Details:**
- Analyze all 9 planets for personality traits
- Extract career potential from 10th house
- Evaluate relationship prospects from 7th house
- Assess health from 6th house
- Check spiritual inclinations from 9th house
- Calculate financial potential from 2nd & 11th
- Generate 5-10 personalized remedies
- Provide strength assessment
- Support bilingual output (English/Tamil)

---

### Tuesday Sept 14 - Database & Authentication

#### Task 3.2: User Authentication & Database Models
**Time:** 3 hours | **Priority:** CRITICAL

**Objective:** Set up user authentication system with database persistence

```python
# File: backend/models/user.py

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication"""
    
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    username = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255))
    
    # Profile
    profile_image = db.Column(db.String(500))
    bio = db.Column(db.Text)
    language = db.Column(db.String(10), default='en')  # en or ta
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_premium = db.Column(db.Boolean, default=False)
    premium_until = db.Column(db.DateTime)
    
    # Relationships
    charts = db.relationship('BirthChart', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    consultations = db.relationship('Consultation', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password: str):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password: str) -> bool:
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def generate_token(self, expires_in: int = 86400) -> str:
        """Generate JWT token (24 hour default)"""
        return jwt.encode(
            {'user_id': self.id, 'exp': datetime.utcnow().timestamp() + expires_in},
            os.environ.get('JWT_SECRET', 'dev-secret'),
            algorithm='HS256'
        )
    
    @staticmethod
    def verify_token(token: str) -> dict:
        """Verify and decode JWT token"""
        try:
            return jwt.decode(
                token,
                os.environ.get('JWT_SECRET', 'dev-secret'),
                algorithms=['HS256']
            )
        except:
            return None


class BirthChart(db.Model):
    """Birth chart model for storing charts"""
    
    __tablename__ = 'birth_charts'
    
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Basic info
    name = db.Column(db.String(255))
    birth_date = db.Column(db.DateTime, nullable=False)
    birth_time = db.Column(db.Time)
    birth_place = db.Column(db.String(255))
    birth_latitude = db.Column(db.Float)
    birth_longitude = db.Column(db.Float)
    
    # Astrological data
    chart_data = db.Column(db.JSON)  # Planetary positions, houses, etc.
    strength_data = db.Column(db.JSON)  # Shadbala calculations
    dasha_data = db.Column(db.JSON)  # Dasha periods
    interpretation_data = db.Column(db.JSON)  # Interpretations
    
    # Metadata
    is_public = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    consultations = db.relationship('Consultation', backref='chart', lazy='dynamic', cascade='all, delete-orphan')


class Consultation(db.Model):
    """Consultation booking model"""
    
    __tablename__ = 'consultations'
    
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    chart_id = db.Column(db.String(36), db.ForeignKey('birth_charts.id'), nullable=True)
    
    # Consultation details
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    consultation_type = db.Column(db.String(50))  # online, in-person, phone
    
    # Scheduling
    scheduled_date = db.Column(db.DateTime)
    duration_minutes = db.Column(db.Integer, default=60)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, completed, cancelled
    
    # Astrologer assignment
    astrologer_id = db.Column(db.String(36), db.ForeignKey('astrologers.id'))
    notes = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Astrologer(db.Model):
    """Astrologer/expert model"""
    
    __tablename__ = 'astrologers'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True)
    expertise = db.Column(db.JSON)  # Areas of expertise
    bio = db.Column(db.Text)
    profile_image = db.Column(db.String(500))
    rate_per_hour = db.Column(db.Float)
    rating = db.Column(db.Float, default=0.0)
    is_available = db.Column(db.Boolean, default=True)
    
    consultations = db.relationship('Consultation', backref='astrologer', lazy='dynamic')
```

**Database Setup:**
```bash
# Initialize database
python backend/init_database.py

# Migrations
python -m flask db init
python -m flask db migrate
python -m flask db upgrade
```

---

### Wednesday Sept 15 - API Endpoints & Storage

#### Task 3.3: User & Chart API Endpoints
**Time:** 3 hours | **Priority:** CRITICAL

**Objective:** Create REST endpoints for user management and chart storage

```python
# File: backend/api/users.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.user import User, BirthChart, db
import uuid

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

# Authentication endpoints
@users_bp.route('/register', methods=['POST'])
def register():
    """Register new user"""
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return {'error': 'Email already registered'}, 400
    
    user = User(
        id=str(uuid.uuid4()),
        email=data['email'],
        username=data['username'],
        full_name=data.get('full_name', ''),
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return {
        'user_id': user.id,
        'email': user.email,
        'token': user.generate_token(),
    }, 201

@users_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return {'error': 'Invalid credentials'}, 401
    
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    return {
        'user_id': user.id,
        'token': user.generate_token(),
        'user': {
            'email': user.email,
            'username': user.username,
            'full_name': user.full_name,
            'is_premium': user.is_premium,
        }
    }, 200

# Chart endpoints
@users_bp.route('/charts', methods=['GET'])
@jwt_required()
def get_user_charts():
    """Get all charts for user"""
    user_id = get_jwt_identity()
    charts = BirthChart.query.filter_by(user_id=user_id).all()
    
    return {
        'charts': [{
            'id': c.id,
            'name': c.name,
            'birth_date': c.birth_date.isoformat(),
            'birth_place': c.birth_place,
            'created_at': c.created_at.isoformat(),
        } for c in charts]
    }, 200

@users_bp.route('/charts', methods=['POST'])
@jwt_required()
def create_chart():
    """Create new birth chart"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    chart = BirthChart(
        id=str(uuid.uuid4()),
        user_id=user_id,
        name=data.get('name', 'Unnamed Chart'),
        birth_date=datetime.fromisoformat(data['birth_date']),
        birth_time=datetime.fromisoformat(data['birth_time']).time() if data.get('birth_time') else None,
        birth_place=data.get('birth_place'),
        birth_latitude=data.get('birth_latitude'),
        birth_longitude=data.get('birth_longitude'),
    )
    
    db.session.add(chart)
    db.session.commit()
    
    return {'chart_id': chart.id}, 201

@users_bp.route('/charts/<chart_id>', methods=['GET'])
@jwt_required()
def get_chart(chart_id):
    """Get specific chart with all data"""
    user_id = get_jwt_identity()
    chart = BirthChart.query.filter_by(id=chart_id, user_id=user_id).first_or_404()
    
    return {
        'chart': {
            'id': chart.id,
            'name': chart.name,
            'birth_date': chart.birth_date.isoformat(),
            'birth_place': chart.birth_place,
            'chart_data': chart.chart_data,
            'strength_data': chart.strength_data,
            'dasha_data': chart.dasha_data,
            'interpretation_data': chart.interpretation_data,
        }
    }, 200

@users_bp.route('/charts/<chart_id>/save', methods=['POST'])
@jwt_required()
def save_chart_data(chart_id):
    """Save calculated data to chart"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    chart = BirthChart.query.filter_by(id=chart_id, user_id=user_id).first_or_404()
    
    if 'chart_data' in data:
        chart.chart_data = data['chart_data']
    if 'strength_data' in data:
        chart.strength_data = data['strength_data']
    if 'dasha_data' in data:
        chart.dasha_data = data['dasha_data']
    if 'interpretation_data' in data:
        chart.interpretation_data = data['interpretation_data']
    
    db.session.commit()
    
    return {'success': True, 'chart_id': chart_id}, 200
```

---

### Thursday Sept 16 - Advanced Features

#### Task 3.4: Export, Email & Notifications
**Time:** 3 hours | **Priority:** HIGH

**Objective:** Add chart export (PDF), email reports, and notification system

```python
# File: backend/services/export_service.py

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class ChartExporter:
    """Export charts to PDF and other formats"""
    
    def export_to_pdf(self, chart, interpretations):
        """Export chart with interpretations to PDF"""
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        
        # Add birth info
        pdf.drawString(50, 750, f"Birth Chart: {chart.name}")
        pdf.drawString(50, 730, f"Date: {chart.birth_date.strftime('%Y-%m-%d %H:%M')}")
        pdf.drawString(50, 710, f"Place: {chart.birth_place}")
        
        # Add chart data
        y_pos = 680
        for section, content in interpretations.items():
            pdf.drawString(50, y_pos, f"{section.title()}")
            y_pos -= 20
            for insight in content['insights']:
                pdf.drawString(70, y_pos, f"• {insight}")
                y_pos -= 15
            y_pos -= 10
        
        pdf.save()
        buffer.seek(0)
        return buffer.getvalue()
    
    def export_to_json(self, chart):
        """Export chart as JSON"""
        return json.dumps({
            'name': chart.name,
            'birth_date': chart.birth_date.isoformat(),
            'birth_place': chart.birth_place,
            'chart_data': chart.chart_data,
            'strength_data': chart.strength_data,
            'dasha_data': chart.dasha_data,
            'interpretation_data': chart.interpretation_data,
        }, indent=2)


class EmailService:
    """Handle email notifications"""
    
    def __init__(self):
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', 587))
        self.sender_email = os.environ.get('SENDER_EMAIL')
        self.sender_password = os.environ.get('SENDER_PASSWORD')
    
    def send_chart_report(self, user_email, chart, interpretations):
        """Send chart report via email"""
        msg = MIMEMultipart()
        msg['From'] = self.sender_email
        msg['To'] = user_email
        msg['Subject'] = f'Your Birth Chart Analysis - {chart.name}'
        
        # Build email body
        body = f"""
        <h2>Birth Chart Analysis: {chart.name}</h2>
        <p>Birth Date: {chart.birth_date.strftime('%Y-%m-%d %H:%M')}</p>
        <p>Birth Place: {chart.birth_place}</p>
        
        <h3>Interpretations</h3>
        """
        
        for section, content in interpretations.items():
            body += f"<h4>{section.title()}</h4><ul>"
            for insight in content['insights']:
                body += f"<li>{insight}</li>"
            body += "</ul>"
        
        msg.attach(MIMEText(body, 'html'))
        
        # Send email
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            server.send_message(msg)
    
    def send_consultation_confirmation(self, consultation):
        """Send consultation booking confirmation"""
        # Similar implementation for consultation emails
        pass
```

---

### Friday Sept 17 - Consultation Booking & Dashboard

#### Task 3.5: Consultation Booking System & Analytics Dashboard
**Time:** 3 hours | **Priority:** HIGH

**Objective:** Build consultation booking and user dashboard

```python
# File: backend/api/consultations.py

@consultations_bp.route('/book', methods=['POST'])
@jwt_required()
def book_consultation():
    """Book a consultation"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    consultation = Consultation(
        id=str(uuid.uuid4()),
        user_id=user_id,
        chart_id=data.get('chart_id'),
        title=data['title'],
        description=data.get('description'),
        consultation_type=data['type'],  # online, in-person, phone
        scheduled_date=datetime.fromisoformat(data['scheduled_date']),
        duration_minutes=data.get('duration', 60),
    )
    
    db.session.add(consultation)
    db.session.commit()
    
    # Send confirmation email
    user = User.query.get(user_id)
    email_service.send_consultation_confirmation(consultation, user)
    
    return {'consultation_id': consultation.id}, 201

# Dashboard endpoints
@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_dashboard_summary():
    """Get user dashboard summary"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    return {
        'user': {
            'name': user.full_name,
            'email': user.email,
            'is_premium': user.is_premium,
        },
        'charts': {
            'total': BirthChart.query.filter_by(user_id=user_id).count(),
            'recent': BirthChart.query.filter_by(user_id=user_id)
                .order_by(BirthChart.created_at.desc()).limit(5).all(),
        },
        'consultations': {
            'upcoming': Consultation.query.filter_by(user_id=user_id)
                .filter(Consultation.status == 'confirmed')
                .filter(Consultation.scheduled_date > datetime.utcnow())
                .count(),
            'completed': Consultation.query.filter_by(user_id=user_id)
                .filter(Consultation.status == 'completed').count(),
        }
    }, 200
```

---

## Summary of Week 3 Tasks

| Task | Component | Hours | Status |
|------|-----------|-------|--------|
| 3.1 | Interpretation Engine | 3 | Planning |
| 3.2 | Auth & Database | 3 | Planning |
| 3.3 | User/Chart APIs | 3 | Planning |
| 3.4 | Export & Email | 3 | Planning |
| 3.5 | Booking & Dashboard | 3 | Planning |

**Total:** 15 hours

---

## Deliverables Summary

### Frontend
- User dashboard with charts overview
- Interpretation cards (personality, career, relationships, health, spiritual, financial)
- Consultation booking interface
- Chart export UI (PDF, JSON)
- Profile management page

### Backend
- Interpretation engine (6 modules)
- User authentication (JWT + database)
- Database models (User, Chart, Consultation, Astrologer)
- 15+ API endpoints
- Email notification system
- PDF export service
- Consultation booking system

### Testing
- Authentication tests
- Database tests
- API endpoint tests
- Export functionality tests
- Email service tests

### Documentation
- API documentation
- Database schema documentation
- Authentication flow documentation
- User guide for platform

---

## Technology Stack

**Frontend:**
- React with TypeScript
- Next.js for SSR
- Tailwind CSS for styling
- React Query for API calls

**Backend:**
- Python 3.11+
- Flask web framework
- SQLAlchemy ORM
- PostgreSQL database
- JWT for authentication
- ReportLab for PDF generation
- Sendgrid/SMTP for email

**DevOps:**
- Docker for containerization
- PostgreSQL for production DB
- Redis for caching
- GitHub Actions for CI/CD

---

## Success Criteria

✅ All 5 tasks completed  
✅ 15+ API endpoints working  
✅ User authentication functional  
✅ Database with proper relationships  
✅ Interpretation engine generating insights  
✅ Export/PDF functionality working  
✅ Email notifications sending  
✅ Consultation booking system live  
✅ Dashboard displaying user data  
✅ All tests passing (90%+ coverage)  

---

**Week 3 Target:** Friday, September 20, 2026 (11:59 PM UTC)

Generated: September 13, 2026  
Project: Veda Jothidam - Vedic Astrology Platform

