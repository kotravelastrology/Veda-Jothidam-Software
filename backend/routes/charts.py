from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.database import db
from backend.models import Chart, Consultation, User
from backend.validators import ChartDataValidator, ConsultationValidator, ValidationError
from datetime import datetime, time
import uuid
import logging

bp = Blueprint('charts', __name__, url_prefix='/api/charts')
logger = logging.getLogger(__name__)

@bp.route('/create', methods=['POST'])
@jwt_required()
def create_chart():
    """Create a new birth chart with validation."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        # Validate all chart data
        try:
            validated_data = ChartDataValidator.validate_chart_data(data)
        except ValidationError as e:
            logger.warning(f"Chart validation failed for user {user_id}: {str(e)}")
            return jsonify({'error': str(e)}), 400

        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Create new chart
        chart = Chart(
            user_id=user_id,
            name=validated_data['name'],
            birth_date=validated_data['birth_date'],
            birth_time=validated_data['birth_time'],
            birth_location=validated_data['birth_place'],  # birth_place from validator -> birth_location in model
            latitude=validated_data['latitude'],
            longitude=validated_data['longitude'],
            timezone=validated_data['timezone'],
            ayanamsa=data.get('ayanamsa', 'lahiri'),
            node_type=data.get('node_type', 'mean')
        )

        db.session.add(chart)
        db.session.commit()

        logger.info(f"Chart created: {chart.id} for user {user_id}")

        return jsonify({
            'message': 'Chart created successfully',
            'chart': chart.to_dict()
        }), 201

    except ValueError as e:
        db.session.rollback()
        logger.warning(f"Chart creation value error for user {user_id}: {str(e)}")
        return jsonify({'error': 'Invalid data format'}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Chart creation error for user {user_id}: {str(e)}")
        return jsonify({'error': 'An error occurred while creating chart'}), 500

@bp.route('/<chart_id>', methods=['GET'])
@jwt_required()
def get_chart(chart_id):
    """Get a specific birth chart."""
    try:
        user_id = get_jwt_identity()

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Get consultation count for this chart
        consultation_count = chart.get_consultations_count()

        return jsonify({
            'chart': chart.to_dict(),
            'consultations_count': consultation_count
        }), 200

    except Exception as e:
        logger.error(f"Error retrieving chart {chart_id} for user {user_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('', methods=['GET'])
@jwt_required()
def list_charts():
    """List all birth charts for the current user."""
    try:
        user_id = get_jwt_identity()

        # Get all charts for user, ordered by creation date (newest first)
        charts = Chart.query.filter_by(user_id=user_id).order_by(Chart.created_at.desc()).all()

        chart_data = []
        for chart in charts:
            # Count consultations for each chart
            consultation_count = chart.get_consultations_count()
            chart_dict = chart.to_dict()
            chart_dict['consultations_count'] = consultation_count
            chart_data.append(chart_dict)

        return jsonify({
            'charts': chart_data,
            'total_count': len(chart_data)
        }), 200

    except Exception as e:
        logger.error(f"Error listing charts for user {user_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# CONSULTATION ENDPOINTS (Task 1.3 Extension - Consultation Management)
# ============================================================================

@bp.route('/<chart_id>/consultations', methods=['POST'])
@jwt_required()
def create_consultation(chart_id):
    """Create a consultation record for a chart."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Validate consultation data
        try:
            validated_data = ConsultationValidator.validate_consultation_data(data)
        except ValidationError as e:
            logger.warning(f"Consultation validation failed for chart {chart_id}: {str(e)}")
            return jsonify({'error': str(e)}), 400

        # Create consultation
        consultation = Consultation(
            chart_id=chart_id,
            consultation_date=validated_data.get('consultation_date', datetime.utcnow()),
            notes=validated_data.get('notes'),
            recommendations=validated_data.get('recommendations'),
            remedies=validated_data.get('remedies'),
            follow_up_date=validated_data.get('follow_up_date')
        )

        db.session.add(consultation)
        db.session.commit()

        logger.info(f"Consultation created: {consultation.id} for chart {chart_id}")

        return jsonify({
            'message': 'Consultation created successfully',
            'consultation': consultation.to_dict()
        }), 201

    except ValueError as e:
        db.session.rollback()
        logger.warning(f"Consultation creation value error: {str(e)}")
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Consultation creation error: {str(e)}")
        return jsonify({'error': 'An error occurred while creating consultation'}), 500

@bp.route('/<chart_id>/consultations', methods=['GET'])
@jwt_required()
def list_consultations(chart_id):
    """List all consultations for a chart."""
    try:
        user_id = get_jwt_identity()

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Get all consultations for this chart
        consultations = Consultation.query.filter_by(chart_id=chart_id).order_by(Consultation.consultation_date.desc()).all()

        return jsonify({
            'chart_id': chart_id,
            'consultations': [c.to_dict_summary() for c in consultations],
            'total_count': len(consultations)
        }), 200

    except Exception as e:
        logger.error(f"Error retrieving consultations for chart {chart_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/<chart_id>/consultations/<consultation_id>', methods=['GET'])
@jwt_required()
def get_consultation(chart_id, consultation_id):
    """Get a specific consultation."""
    try:
        user_id = get_jwt_identity()

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Get consultation
        consultation = Consultation.query.filter_by(id=consultation_id, chart_id=chart_id).first()
        if not consultation:
            return jsonify({'error': 'Consultation not found'}), 404

        return jsonify({
            'consultation': consultation.to_dict()
        }), 200

    except Exception as e:
        logger.error(f"Error retrieving consultation {consultation_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/<chart_id>/consultations/<consultation_id>', methods=['PUT'])
@jwt_required()
def update_consultation(chart_id, consultation_id):
    """Update a consultation record."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Get consultation
        consultation = Consultation.query.filter_by(id=consultation_id, chart_id=chart_id).first()
        if not consultation:
            return jsonify({'error': 'Consultation not found'}), 404

        # Validate consultation data
        try:
            validated_data = ConsultationValidator.validate_consultation_data(data)
        except ValidationError as e:
            logger.warning(f"Consultation validation failed for {consultation_id}: {str(e)}")
            return jsonify({'error': str(e)}), 400

        # Update fields
        if 'notes' in validated_data:
            consultation.notes = validated_data['notes']
        if 'recommendations' in validated_data:
            consultation.recommendations = validated_data['recommendations']
        if 'remedies' in validated_data:
            consultation.remedies = validated_data['remedies']
        if 'follow_up_date' in validated_data:
            consultation.follow_up_date = validated_data['follow_up_date']
        if 'consultation_date' in validated_data:
            consultation.consultation_date = validated_data['consultation_date']

        db.session.commit()

        logger.info(f"Consultation updated: {consultation_id}")

        return jsonify({
            'message': 'Consultation updated successfully',
            'consultation': consultation.to_dict()
        }), 200

    except ValueError as e:
        db.session.rollback()
        logger.warning(f"Consultation update value error: {str(e)}")
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Consultation update error: {str(e)}")
        return jsonify({'error': 'An error occurred while updating consultation'}), 500

@bp.route('/<chart_id>/consultations/<consultation_id>', methods=['DELETE'])
@jwt_required()
def delete_consultation(chart_id, consultation_id):
    """Delete a consultation record."""
    try:
        user_id = get_jwt_identity()

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Get and delete consultation
        consultation = Consultation.query.filter_by(id=consultation_id, chart_id=chart_id).first()
        if not consultation:
            return jsonify({'error': 'Consultation not found'}), 404

        db.session.delete(consultation)
        db.session.commit()

        logger.info(f"Consultation deleted: {consultation_id}")

        return jsonify({
            'message': 'Consultation deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Consultation deletion error: {str(e)}")
        return jsonify({'error': str(e)}), 500
