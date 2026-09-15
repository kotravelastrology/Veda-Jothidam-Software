"""
Flask App Integration - Task 3.5 - Consultation Booking & Dashboard

Integration instructions for wiring up all Week 3 blueprints to the Flask app.

Usage:
    app = Flask(__name__)
    # ... configure app ...
    integrate_week_3_blueprints(app)
"""

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Import blueprints
from api.auth_users import auth_bp, users_bp
from api.charts import charts_bp
from api.consultations import consultations_bp, astrologers_bp
from api.dashboard import dashboard_bp


def integrate_week_3_blueprints(app: Flask) -> None:
    """
    Register all Week 3 API blueprints with Flask app

    Blueprints registered:
    1. auth_bp: Authentication endpoints
    2. users_bp: User profile & settings
    3. charts_bp: Birth chart management
    4. consultations_bp: Consultation booking
    5. astrologers_bp: Astrologer directory
    6. dashboard_bp: User dashboard & analytics

    Route prefixes:
    - /api/auth/*
    - /api/users/*
    - /api/charts/*
    - /api/consultations/*
    - /api/astrologers/*
    - /api/dashboard/*
    """

    # Register authentication blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)

    # Register chart management blueprint
    app.register_blueprint(charts_bp)

    # Register consultation booking blueprints
    app.register_blueprint(consultations_bp)
    app.register_blueprint(astrologers_bp)

    # Register dashboard blueprint
    app.register_blueprint(dashboard_bp)

    print("✓ Week 3 blueprints registered successfully")


def create_app_with_week_3() -> Flask:
    """
    Create and configure Flask app with all Week 3 components

    Usage:
        app = create_app_with_week_3()
        app.run(debug=True)
    """
    from dotenv import load_dotenv
    import os
    from models.database import db, init_db

    # Load environment variables
    load_dotenv()

    # Create Flask app
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DATABASE_URL',
        'sqlite:///veda_jothidam.db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get(
        'JWT_SECRET_KEY',
        'your-secret-key-change-in-production'
    )

    # Enable CORS
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)

    # Register blueprints
    integrate_week_3_blueprints(app)

    # Create tables
    with app.app_context():
        init_db(app)

    return app


# ==================== API SUMMARY ====================

"""
WEEK 3 API ENDPOINTS SUMMARY

Authentication (Task 3.1 & 3.2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST   /api/auth/register              - Register new user
POST   /api/auth/login                 - User login
POST   /api/auth/refresh               - Refresh access token
POST   /api/auth/logout                - Logout (activity logging)
POST   /api/auth/change-password       - Change password
GET    /api/auth/health                - Health check

User Profile & Settings
POST   /api/users/profile              - Get profile
PUT    /api/users/profile              - Update profile
GET    /api/users/settings             - Get settings
PUT    /api/users/settings             - Update settings
GET    /api/users/subscription         - Get subscription

Birth Charts (Task 3.3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET    /api/charts                     - List charts (paginated)
POST   /api/charts                     - Create chart
GET    /api/charts/<id>                - Get specific chart
PUT    /api/charts/<id>                - Update chart metadata
DELETE /api/charts/<id>                - Delete chart
POST   /api/charts/<id>/save           - Save chart data
POST   /api/charts/<id>/share          - Share chart (toggle public)
GET    /api/charts/shared              - Get public charts
GET    /api/charts/stats               - Get chart statistics

Consultations (Task 3.5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST   /api/consultations              - Book consultation
GET    /api/consultations              - List consultations (filtered)
GET    /api/consultations/<id>         - Get specific consultation
PUT    /api/consultations/<id>         - Update consultation
POST   /api/consultations/<id>/cancel  - Cancel consultation
GET    /api/consultations/stats        - Get consultation statistics

Astrologers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET    /api/astrologers/available      - Get available astrologers
GET    /api/astrologers/<id>           - Get astrologer profile

Dashboard (Task 3.5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET    /api/dashboard                  - Get complete dashboard
GET    /api/dashboard/activity         - Get activity log
GET    /api/dashboard/stats            - Get comprehensive stats
GET    /api/dashboard/recommendations  - Get personalized recommendations

Export & Email (Task 3.4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service APIs (called from endpoints above):
- ChartExporter.export_to_pdf()
- ChartExporter.export_to_json()
- ChartExporter.export_interpretation_report()
- EmailService.send_consultation_confirmation()
- EmailService.send_welcome_email()
- EmailService.send_chart_report()


REQUEST/RESPONSE EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Book Consultation:
  POST /api/consultations
  Headers: Authorization: Bearer <token>
  Body: {
    "title": "Career Guidance",
    "description": "Guidance for career change",
    "consultation_type": "online",
    "scheduled_date": "2026-09-20T15:00:00",
    "duration_minutes": 60,
    "timezone": "UTC",
    "astrologer_id": "uuid"  // optional
  }
  Response: {
    "success": true,
    "consultation_id": "uuid",
    "status": "pending",
    "confirmation_email_sent": true
  }

Get Dashboard:
  GET /api/dashboard
  Headers: Authorization: Bearer <token>
  Response: {
    "success": true,
    "dashboard": {
      "user": { ... },
      "stats": {
        "total_charts": 5,
        "analyzed_charts": 3,
        "total_consultations": 2,
        ...
      },
      "recent_charts": [ ... ],
      "upcoming_consultations": [ ... ],
      "quick_actions": [ ... ]
    }
  }

Get Dashboard Recommendations:
  GET /api/dashboard/recommendations
  Headers: Authorization: Bearer <token>
  Response: {
    "success": true,
    "recommendations": [
      {
        "type": "action",
        "priority": "high",
        "title": "Create Your First Birth Chart",
        "description": "Get started with...",
        "action": "create_chart"
      }
    ]
  }


FEATURES IMPLEMENTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consultation Booking System:
  ✓ Book consultations with validation
  ✓ Support for 4 consultation types (online, in-person, phone, email)
  ✓ Astrologer assignment with pricing
  ✓ Status tracking (pending → confirmed → completed)
  ✓ Consultation cancellation with refunds (TODO)
  ✓ Automatic confirmation emails
  ✓ Consultation limit per subscription tier
  ✓ Premium discount application

Astrologer Directory:
  ✓ Get available astrologers
  ✓ Filter by rating, price
  ✓ Public astrologer profiles
  ✓ Rating and review tracking

User Dashboard:
  ✓ Complete dashboard overview
  ✓ Real-time statistics
  ✓ Recent charts listing
  ✓ Upcoming consultations
  ✓ Quick action buttons
  ✓ Activity log (7/30 day views)
  ✓ Personalized recommendations
  ✓ Usage statistics by plan

Dashboard Analytics:
  ✓ Chart analytics (total, public, analyzed)
  ✓ Consultation analytics (by status)
  ✓ Interpretation breakdown (6 types)
  ✓ Subscription usage tracking
  ✓ Remaining quota display
  ✓ Activity aggregation

Frontend Dashboard:
  ✓ Responsive design (mobile-friendly)
  ✓ Real-time data loading
  ✓ Statistics cards with color coding
  ✓ Recent charts widget
  ✓ Upcoming consultations widget
  ✓ Recommendations panel
  ✓ Activity feed
  ✓ Empty states with CTAs
  ✓ Error handling
  ✓ Loading indicators
"""
