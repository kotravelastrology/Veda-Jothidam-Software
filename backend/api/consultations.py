"""
Consultation Booking & Management API Endpoints

Endpoints:
- Book consultation (POST /consultations)
- Get consultations (GET /consultations)
- Get specific consultation (GET /consultations/<id>)
- Update consultation (PUT /consultations/<id>)
- Cancel consultation (POST /consultations/<id>/cancel)
- Get available astrologers (GET /astrologers/available)
- Get astrologer details (GET /astrologers/<id>)

Features:
- Consultation booking with validation
- Status tracking
- Astrologer assignment
- Payment processing support
- Confirmation emails
- Cancellation with refunds
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import uuid

from models.database import db, Consultation, Astrologer, User, BirthChart, Subscription
from services.email_service import EmailService

# Create blueprint
consultations_bp = Blueprint('consultations', __name__, url_prefix='/api/consultations')
astrologers_bp = Blueprint('astrologers', __name__, url_prefix='/api/astrologers')


# ==================== CONSULTATION BOOKING ====================

@consultations_bp.route('', methods=['POST'])
@jwt_required()
def book_consultation():
    """
    Book a new consultation

    Request:
    {
        "chart_id": "uuid",
        "title": "Career Guidance",
        "description": "Guidance for career change",
        "consultation_type": "online",
        "scheduled_date": "2026-09-20T15:00:00",
        "duration_minutes": 60,
        "timezone": "UTC",
        "astrologer_id": "uuid (optional)"
    }

    Response:
    {
        "success": true,
        "consultation_id": "uuid",
        "status": "pending",
        "confirmation_email_sent": true
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {'error': 'User not found'}, 404

        # Check consultation limit
        active_consultations = Consultation.query.filter_by(user_id=user_id).filter(
            Consultation.status.in_(['pending', 'confirmed'])
        ).count()

        max_consultations = 5  # Default for free users
        if user.is_premium:
            subscription = Subscription.query.filter_by(user_id=user_id).first()
            if subscription:
                max_consultations = subscription.max_consultations

        if active_consultations >= max_consultations:
            return {'error': f'Consultation limit reached ({max_consultations})'}, 403

        data = request.get_json()

        if not data:
            return {'error': 'Request body is required'}, 400

        # Validate required fields
        required_fields = ['title', 'consultation_type', 'scheduled_date']
        for field in required_fields:
            if field not in data or not data[field]:
                return {'error': f'{field.capitalize()} is required'}, 400

        # Validate consultation type
        valid_types = ['online', 'in-person', 'phone', 'email']
        if data['consultation_type'] not in valid_types:
            return {'error': f'Invalid type. Must be one of: {", ".join(valid_types)}'}, 400

        # Parse scheduled date
        try:
            scheduled_date = datetime.fromisoformat(data['scheduled_date'])
        except (ValueError, TypeError):
            return {'error': 'Invalid date format (use ISO format)'}, 400

        # Validate future date
        if scheduled_date <= datetime.utcnow():
            return {'error': 'Scheduled date must be in the future'}, 400

        # Validate chart if provided
        chart = None
        if data.get('chart_id'):
            chart = BirthChart.query.filter_by(id=data['chart_id'], user_id=user_id).first()
            if not chart:
                return {'error': 'Chart not found'}, 404

        # Create consultation
        consultation = Consultation(
            id=str(uuid.uuid4()),
            user_id=user_id,
            chart_id=chart.id if chart else None,
            title=data['title'].strip(),
            description=data.get('description', '').strip(),
            consultation_type=data['consultation_type'],
            scheduled_date=scheduled_date,
            duration_minutes=data.get('duration_minutes', 60),
            time_zone=data.get('timezone', 'UTC'),
            status='pending',
        )

        # Assign astrologer if provided
        if data.get('astrologer_id'):
            astrologer = Astrologer.query.get(data['astrologer_id'])
            if astrologer and astrologer.is_available:
                consultation.astrologer_id = astrologer.id

        # Set pricing if astrologer assigned
        if consultation.astrologer_id:
            astrologer = Astrologer.query.get(consultation.astrologer_id)
            duration_hours = consultation.duration_minutes / 60
            base_price = astrologer.rate_per_hour * duration_hours

            # Apply premium discount if applicable
            if user.is_premium:
                subscription = Subscription.query.filter_by(user_id=user_id).first()
                if subscription:
                    discount = subscription.consultation_discount
                    consultation.price = base_price * (1 - discount / 100)
                else:
                    consultation.price = base_price
            else:
                consultation.price = base_price

        db.session.add(consultation)
        db.session.commit()

        # Send confirmation email
        email_service = EmailService()
        email_service.send_consultation_confirmation(
            user.email,
            user.full_name,
            consultation.title,
            scheduled_date.strftime('%B %d, %Y at %H:%M'),
            consultation.consultation_type
        )

        return {
            'success': True,
            'message': 'Consultation booked successfully',
            'consultation_id': consultation.id,
            'status': consultation.status,
            'confirmation_email_sent': True,
        }, 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Consultation booking error: {str(e)}')
        return {'error': 'Failed to book consultation'}, 500


@consultations_bp.route('', methods=['GET'])
@jwt_required()
def get_consultations():
    """
    Get user's consultations with filtering

    Query parameters:
    - status: pending, confirmed, completed, cancelled
    - page: Page number
    - per_page: Items per page
    """
    try:
        user_id = get_jwt_identity()

        # Build query
        query = Consultation.query.filter_by(user_id=user_id)

        # Status filter
        status = request.args.get('status', '').strip()
        if status:
            valid_statuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']
            if status in valid_statuses:
                query = query.filter_by(status=status)

        # Pagination
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 50)

        # Sort by scheduled date (upcoming first)
        query = query.order_by(Consultation.scheduled_date.asc())

        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        return {
            'success': True,
            'consultations': [
                {
                    'id': c.id,
                    'title': c.title,
                    'type': c.consultation_type,
                    'status': c.status,
                    'scheduled_date': c.scheduled_date.isoformat(),
                    'duration_minutes': c.duration_minutes,
                    'astrologer': c.astrologer.name if c.astrologer else None,
                    'price': c.price,
                }
                for c in paginated.items
            ],
            'pagination': {
                'total': paginated.total,
                'page': page,
                'per_page': per_page,
                'pages': paginated.pages,
            }
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get consultations error: {str(e)}')
        return {'error': 'Failed to retrieve consultations'}, 500


@consultations_bp.route('/<consultation_id>', methods=['GET'])
@jwt_required()
def get_consultation(consultation_id):
    """Get specific consultation details"""
    try:
        user_id = get_jwt_identity()
        consultation = Consultation.query.filter_by(
            id=consultation_id, user_id=user_id
        ).first()

        if not consultation:
            return {'error': 'Consultation not found'}, 404

        return {
            'success': True,
            'consultation': {
                'id': consultation.id,
                'title': consultation.title,
                'description': consultation.description,
                'type': consultation.consultation_type,
                'status': consultation.status,
                'scheduled_date': consultation.scheduled_date.isoformat(),
                'duration_minutes': consultation.duration_minutes,
                'timezone': consultation.time_zone,
                'astrologer': consultation.astrologer.to_dict() if consultation.astrologer else None,
                'chart_id': consultation.chart_id,
                'price': consultation.price,
                'payment_status': consultation.payment_status,
                'meeting_link': consultation.meeting_link,
                'location': consultation.location,
                'notes': consultation.notes,
                'client_notes': consultation.client_notes,
                'created_at': consultation.created_at.isoformat(),
            }
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get consultation error: {str(e)}')
        return {'error': 'Failed to retrieve consultation'}, 500


@consultations_bp.route('/<consultation_id>', methods=['PUT'])
@jwt_required()
def update_consultation(consultation_id):
    """
    Update consultation details

    Request:
    {
        "title": "Updated title",
        "client_notes": "Updated notes"
    }
    """
    try:
        user_id = get_jwt_identity()
        consultation = Consultation.query.filter_by(
            id=consultation_id, user_id=user_id
        ).first()

        if not consultation:
            return {'error': 'Consultation not found'}, 404

        # Can only update if pending
        if consultation.status not in ['pending', 'confirmed']:
            return {'error': 'Can only update pending or confirmed consultations'}, 400

        data = request.get_json()

        if not data:
            return {'error': 'Request body is required'}, 400

        if 'title' in data and data['title']:
            consultation.title = data['title'].strip()

        if 'client_notes' in data:
            consultation.client_notes = data['client_notes'].strip() if data['client_notes'] else None

        consultation.updated_at = datetime.utcnow()
        db.session.commit()

        return {
            'success': True,
            'message': 'Consultation updated successfully',
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Update consultation error: {str(e)}')
        return {'error': 'Failed to update consultation'}, 500


@consultations_bp.route('/<consultation_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_consultation(consultation_id):
    """
    Cancel a consultation

    Request:
    {
        "reason": "Optional cancellation reason"
    }
    """
    try:
        user_id = get_jwt_identity()
        consultation = Consultation.query.filter_by(
            id=consultation_id, user_id=user_id
        ).first()

        if not consultation:
            return {'error': 'Consultation not found'}, 404

        if consultation.status == 'cancelled':
            return {'error': 'Consultation already cancelled'}, 400

        if consultation.status == 'completed':
            return {'error': 'Cannot cancel completed consultation'}, 400

        data = request.get_json() or {}

        # Update consultation
        consultation.status = 'cancelled'
        consultation.cancellation_reason = data.get('reason', '')
        consultation.cancelled_by = 'user'
        db.session.commit()

        # TODO: Process refund if payment_status is 'completed'

        return {
            'success': True,
            'message': 'Consultation cancelled successfully',
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Cancel consultation error: {str(e)}')
        return {'error': 'Failed to cancel consultation'}, 500


# ==================== ASTROLOGER ENDPOINTS ====================

@astrologers_bp.route('/available', methods=['GET'])
@jwt_required()
def get_available_astrologers():
    """
    Get available astrologers for booking

    Query parameters:
    - expertise: Filter by expertise area
    - min_rating: Minimum rating (0-5)
    - max_price: Maximum hourly rate
    """
    try:
        # Query active and available astrologers
        query = Astrologer.query.filter_by(is_active=True, is_available=True)

        # Filter by rating
        min_rating = request.args.get('min_rating', 0, type=float)
        if min_rating > 0:
            query = query.filter(Astrologer.rating >= min_rating)

        # Filter by price
        max_price = request.args.get('max_price', type=float)
        if max_price:
            query = query.filter(Astrologer.rate_per_hour <= max_price)

        # Sort by rating descending
        astrologers = query.order_by(Astrologer.rating.desc()).all()

        return {
            'success': True,
            'astrologers': [a.to_dict() for a in astrologers],
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get available astrologers error: {str(e)}')
        return {'error': 'Failed to retrieve astrologers'}, 500


@astrologers_bp.route('/<astrologer_id>', methods=['GET'])
def get_astrologer(astrologer_id):
    """Get astrologer details (no auth required)"""
    try:
        astrologer = Astrologer.query.get(astrologer_id)

        if not astrologer:
            return {'error': 'Astrologer not found'}, 404

        if not astrologer.is_active:
            return {'error': 'Astrologer profile not available'}, 404

        return {
            'success': True,
            'astrologer': astrologer.to_dict(),
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get astrologer error: {str(e)}')
        return {'error': 'Failed to retrieve astrologer'}, 500


# ==================== CONSULTATION STATISTICS ====================

@consultations_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_consultation_stats():
    """Get consultation statistics for user"""
    try:
        user_id = get_jwt_identity()

        total = Consultation.query.filter_by(user_id=user_id).count()
        pending = Consultation.query.filter_by(user_id=user_id, status='pending').count()
        confirmed = Consultation.query.filter_by(user_id=user_id, status='confirmed').count()
        completed = Consultation.query.filter_by(user_id=user_id, status='completed').count()
        cancelled = Consultation.query.filter_by(user_id=user_id, status='cancelled').count()

        # Get next consultation
        next_consultation = Consultation.query.filter_by(user_id=user_id).filter(
            Consultation.scheduled_date >= datetime.utcnow()
        ).order_by(Consultation.scheduled_date.asc()).first()

        return {
            'success': True,
            'stats': {
                'total': total,
                'pending': pending,
                'confirmed': confirmed,
                'completed': completed,
                'cancelled': cancelled,
                'next_consultation': {
                    'title': next_consultation.title,
                    'scheduled_date': next_consultation.scheduled_date.isoformat(),
                } if next_consultation else None,
            }
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get consultation stats error: {str(e)}')
        return {'error': 'Failed to retrieve statistics'}, 500
