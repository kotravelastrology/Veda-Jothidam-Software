"""
User Dashboard API Endpoints

Provides analytics, activity summaries, and quick stats for user dashboard

Endpoints:
- Dashboard overview (GET /dashboard)
- Dashboard activity (GET /dashboard/activity)
- Quick stats (GET /dashboard/stats)
- Remedies recommendations (GET /dashboard/remedies)
"""

from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

from models.database import db, BirthChart, Consultation, Interpretation, User, Subscription

# Create blueprint
dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')


@dashboard_bp.route('', methods=['GET'])
@jwt_required()
def get_dashboard():
    """
    Get complete dashboard data

    Response:
    {
        "success": true,
        "dashboard": {
            "user": { ... },
            "stats": { ... },
            "recent_charts": [ ... ],
            "upcoming_consultations": [ ... ],
            "quick_actions": [ ... ]
        }
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {'error': 'User not found'}, 404

        # Get subscription
        subscription = Subscription.query.filter_by(user_id=user_id).first()

        # Get stats
        total_charts = BirthChart.query.filter_by(user_id=user_id).count()
        analyzed_charts = BirthChart.query.filter_by(user_id=user_id).filter(
            BirthChart.last_analyzed_at.isnot(None)
        ).count()

        # Get consultations
        total_consultations = Consultation.query.filter_by(user_id=user_id).count()
        pending_consultations = Consultation.query.filter_by(
            user_id=user_id, status='pending'
        ).count()

        # Get upcoming consultations
        upcoming_consultations = Consultation.query.filter_by(user_id=user_id).filter(
            Consultation.scheduled_date >= datetime.utcnow()
        ).order_by(Consultation.scheduled_date.asc()).limit(5).all()

        # Get recent charts
        recent_charts = BirthChart.query.filter_by(user_id=user_id).order_by(
            BirthChart.created_at.desc()
        ).limit(5).all()

        # Get interpretations count
        interpretations_count = Interpretation.query.filter_by(user_id=user_id).count()

        dashboard = {
            'user': {
                'id': user.id,
                'full_name': user.full_name,
                'email': user.email,
                'username': user.username,
                'profile_image': user.profile_image,
                'language': user.language,
                'timezone': user.timezone,
                'is_premium': user.is_premium,
            },
            'subscription': subscription.to_dict() if subscription else None,
            'stats': {
                'total_charts': total_charts,
                'analyzed_charts': analyzed_charts,
                'total_consultations': total_consultations,
                'pending_consultations': pending_consultations,
                'interpretations': interpretations_count,
            },
            'recent_charts': [
                {
                    'id': c.id,
                    'name': c.name,
                    'birth_date': c.birth_date.isoformat(),
                    'is_public': c.is_public,
                    'created_at': c.created_at.isoformat(),
                    'last_analyzed_at': c.last_analyzed_at.isoformat() if c.last_analyzed_at else None,
                }
                for c in recent_charts
            ],
            'upcoming_consultations': [
                {
                    'id': c.id,
                    'title': c.title,
                    'type': c.consultation_type,
                    'scheduled_date': c.scheduled_date.isoformat(),
                    'duration_minutes': c.duration_minutes,
                    'astrologer': c.astrologer.name if c.astrologer else None,
                    'status': c.status,
                }
                for c in upcoming_consultations
            ],
            'quick_actions': [
                {'label': 'Create Birth Chart', 'action': 'create_chart', 'icon': 'chart'},
                {'label': 'View Charts', 'action': 'view_charts', 'icon': 'list'},
                {'label': 'Book Consultation', 'action': 'book_consultation', 'icon': 'calendar'},
                {'label': 'Export Report', 'action': 'export_report', 'icon': 'download'},
            ],
        }

        return {
            'success': True,
            'dashboard': dashboard,
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get dashboard error: {str(e)}')
        return {'error': 'Failed to retrieve dashboard'}, 500


@dashboard_bp.route('/activity', methods=['GET'])
@jwt_required()
def get_activity():
    """
    Get user activity log

    Query parameters:
    - days: Number of days to retrieve (default: 30)
    - limit: Max activities to return (default: 50)
    """
    try:
        user_id = get_jwt_identity()

        days = request.args.get('days', 30, type=int)
        limit = min(request.args.get('limit', 50, type=int), 100)

        since = datetime.utcnow() - timedelta(days=days)

        # Get activity from different sources
        chart_activity = BirthChart.query.filter_by(user_id=user_id).filter(
            BirthChart.created_at >= since
        ).order_by(BirthChart.created_at.desc()).limit(limit).all()

        consultation_activity = Consultation.query.filter_by(user_id=user_id).filter(
            Consultation.created_at >= since
        ).order_by(Consultation.created_at.desc()).limit(limit).all()

        interpretation_activity = Interpretation.query.filter_by(user_id=user_id).filter(
            Interpretation.created_at >= since
        ).order_by(Interpretation.created_at.desc()).limit(limit).all()

        # Combine and sort
        activities = []

        for chart in chart_activity:
            activities.append({
                'type': 'chart_created',
                'title': f'Created chart: {chart.name}',
                'timestamp': chart.created_at.isoformat(),
                'icon': 'chart',
            })

        for consultation in consultation_activity:
            activities.append({
                'type': 'consultation_booked',
                'title': f'Booked consultation: {consultation.title}',
                'timestamp': consultation.created_at.isoformat(),
                'icon': 'calendar',
            })

        for interpretation in interpretation_activity:
            activities.append({
                'type': 'interpretation_generated',
                'title': f'Generated {interpretation.interpretation_type} interpretation',
                'timestamp': interpretation.created_at.isoformat(),
                'icon': 'sparkles',
            })

        # Sort by timestamp
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        activities = activities[:limit]

        return {
            'success': True,
            'activities': activities,
            'total': len(activities),
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get activity error: {str(e)}')
        return {'error': 'Failed to retrieve activity'}, 500


@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """
    Get comprehensive dashboard statistics

    Response:
    {
        "success": true,
        "stats": {
            "charts": { ... },
            "consultations": { ... },
            "interpretations": { ... },
            "usage": { ... }
        }
    }
    """
    try:
        user_id = get_jwt_identity()

        # Chart statistics
        total_charts = BirthChart.query.filter_by(user_id=user_id).count()
        public_charts = BirthChart.query.filter_by(user_id=user_id, is_public=True).count()
        analyzed_charts = BirthChart.query.filter_by(user_id=user_id).filter(
            BirthChart.last_analyzed_at.isnot(None)
        ).count()

        # Consultation statistics
        total_consultations = Consultation.query.filter_by(user_id=user_id).count()
        completed_consultations = Consultation.query.filter_by(
            user_id=user_id, status='completed'
        ).count()
        pending_consultations = Consultation.query.filter_by(
            user_id=user_id, status='pending'
        ).count()
        confirmed_consultations = Consultation.query.filter_by(
            user_id=user_id, status='confirmed'
        ).count()

        # Interpretation statistics
        personality_count = Interpretation.query.filter_by(
            user_id=user_id, interpretation_type='personality'
        ).count()
        career_count = Interpretation.query.filter_by(
            user_id=user_id, interpretation_type='career'
        ).count()
        relationships_count = Interpretation.query.filter_by(
            user_id=user_id, interpretation_type='relationships'
        ).count()
        health_count = Interpretation.query.filter_by(
            user_id=user_id, interpretation_type='health'
        ).count()
        spiritual_count = Interpretation.query.filter_by(
            user_id=user_id, interpretation_type='spiritual'
        ).count()
        financial_count = Interpretation.query.filter_by(
            user_id=user_id, interpretation_type='financial'
        ).count()

        # Subscription info
        subscription = Subscription.query.filter_by(user_id=user_id).first()

        stats = {
            'charts': {
                'total': total_charts,
                'public': public_charts,
                'private': total_charts - public_charts,
                'analyzed': analyzed_charts,
                'unanalyzed': total_charts - analyzed_charts,
            },
            'consultations': {
                'total': total_consultations,
                'completed': completed_consultations,
                'confirmed': confirmed_consultations,
                'pending': pending_consultations,
                'cancelled': total_consultations - (completed_consultations + confirmed_consultations + pending_consultations),
            },
            'interpretations': {
                'total': personality_count + career_count + relationships_count + health_count + spiritual_count + financial_count,
                'personality': personality_count,
                'career': career_count,
                'relationships': relationships_count,
                'health': health_count,
                'spiritual': spiritual_count,
                'financial': financial_count,
            },
            'subscription': {
                'plan': subscription.plan if subscription else 'basic',
                'status': subscription.status if subscription else 'active',
                'max_charts': subscription.max_charts if subscription else 5,
                'max_consultations': subscription.max_consultations if subscription else 5,
                'charts_remaining': (subscription.max_charts - total_charts) if subscription else (5 - total_charts),
                'consultations_remaining': (subscription.max_consultations - total_consultations) if subscription else (5 - total_consultations),
            },
            'usage': {
                'charts_used': f'{(total_charts / (subscription.max_charts if subscription else 5)) * 100:.0f}%' if subscription or total_charts > 0 else '0%',
                'consultations_used': f'{(total_consultations / (subscription.max_consultations if subscription else 5)) * 100:.0f}%' if subscription or total_consultations > 0 else '0%',
            }
        }

        return {
            'success': True,
            'stats': stats,
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get stats error: {str(e)}')
        return {'error': 'Failed to retrieve statistics'}, 500


@dashboard_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """
    Get personalized dashboard recommendations

    Response:
    {
        "success": true,
        "recommendations": [
            {
                "type": "action",
                "priority": "high",
                "title": "Create Your First Chart",
                "description": "...",
                "action": "create_chart"
            }
        ]
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        recommendations = []

        # Check if user has any charts
        chart_count = BirthChart.query.filter_by(user_id=user_id).count()
        if chart_count == 0:
            recommendations.append({
                'type': 'action',
                'priority': 'high',
                'title': 'Create Your First Birth Chart',
                'description': 'Get started with your personal astrological analysis',
                'action': 'create_chart',
            })

        # Check if user has consultations
        consultation_count = Consultation.query.filter_by(user_id=user_id).count()
        if consultation_count == 0 and chart_count > 0:
            recommendations.append({
                'type': 'action',
                'priority': 'medium',
                'title': 'Book Your First Consultation',
                'description': 'Connect with expert astrologers for deeper insights',
                'action': 'book_consultation',
            })

        # Check if user has any unanalyzed charts
        unanalyzed_count = BirthChart.query.filter_by(user_id=user_id).filter(
            BirthChart.last_analyzed_at.is_(None)
        ).count()
        if unanalyzed_count > 0:
            recommendations.append({
                'type': 'analysis',
                'priority': 'medium',
                'title': f'Analyze {unanalyzed_count} Unanalyzed Chart{"s" if unanalyzed_count > 1 else ""}',
                'description': 'Run astrological calculations on your charts',
                'action': 'analyze_charts',
            })

        # Check subscription
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        if subscription and subscription.plan == 'basic':
            recommendations.append({
                'type': 'upgrade',
                'priority': 'low',
                'title': 'Upgrade to Premium',
                'description': 'Unlock unlimited charts, consultations, and export features',
                'action': 'upgrade_subscription',
            })

        # Check if user has recent activity
        last_action = BirthChart.query.filter_by(user_id=user_id).order_by(
            BirthChart.updated_at.desc()
        ).first()

        if last_action:
            days_inactive = (datetime.utcnow() - last_action.updated_at).days
            if days_inactive > 7:
                recommendations.append({
                    'type': 'engagement',
                    'priority': 'low',
                    'title': f'You Haven\'t Used Veda Jothidam in {days_inactive} Days',
                    'description': 'Check your charts and get fresh insights',
                    'action': 'view_charts',
                })

        return {
            'success': True,
            'recommendations': recommendations,
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get recommendations error: {str(e)}')
        return {'error': 'Failed to retrieve recommendations'}, 500
