"""
Birth Chart Management API Endpoints

Endpoints:
- Get all charts (GET /charts)
- Create chart (POST /charts)
- Get specific chart (GET /charts/<id>)
- Update chart (PUT /charts/<id>)
- Delete chart (DELETE /charts/<id>)
- Save chart data (POST /charts/<id>/save)
- Share chart (POST /charts/<id>/share)
- Get shared charts (GET /shared)

Features:
- Chart CRUD operations
- Data persistence
- Public/private sharing
- Chart versioning
- Filtering and pagination
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import uuid
from sqlalchemy import or_

from models.database import db, BirthChart, User

# Create blueprint
charts_bp = Blueprint('charts', __name__, url_prefix='/api/charts')


# ==================== CHART LISTING & PAGINATION ====================

@charts_bp.route('', methods=['GET'])
@jwt_required()
def get_charts():
    """
    Get all charts for the user

    Query parameters:
    - page: Page number (default: 1)
    - per_page: Items per page (default: 10, max: 50)
    - search: Search by chart name
    - sort: Sort by (created_at, updated_at, name)
    - order: asc or desc (default: desc)

    Response:
    {
        "success": true,
        "charts": [ ... ],
        "pagination": {
            "total": 25,
            "page": 1,
            "per_page": 10,
            "pages": 3
        }
    }
    """
    try:
        user_id = get_jwt_identity()

        # Pagination
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 50)

        # Validation
        if page < 1:
            page = 1
        if per_page < 1:
            per_page = 10

        # Build query
        query = BirthChart.query.filter_by(user_id=user_id)

        # Search filter
        search = request.args.get('search', '').strip()
        if search:
            query = query.filter(BirthChart.name.ilike(f'%{search}%'))

        # Sorting
        sort_by = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'desc').lower()

        if sort_by == 'name':
            sort_column = BirthChart.name
        elif sort_by == 'updated_at':
            sort_column = BirthChart.updated_at
        else:
            sort_column = BirthChart.created_at

        if order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # Pagination
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        return {
            'success': True,
            'charts': [chart.to_dict() for chart in paginated.items],
            'pagination': {
                'total': paginated.total,
                'page': page,
                'per_page': per_page,
                'pages': paginated.pages,
            }
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get charts error: {str(e)}')
        return {'error': 'Failed to retrieve charts'}, 500


# ==================== CHART CREATION ====================

@charts_bp.route('', methods=['POST'])
@jwt_required()
def create_chart():
    """
    Create a new birth chart

    Request:
    {
        "name": "My Chart",
        "birth_date": "1990-05-15T10:30:00",
        "birth_time": "10:30:00",
        "birth_place": "New York, USA",
        "birth_latitude": 40.7128,
        "birth_longitude": -74.0060,
        "description": "Optional description"
    }

    Response:
    {
        "success": true,
        "chart_id": "uuid",
        "message": "Chart created successfully"
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {'error': 'User not found'}, 404

        # Check chart limit
        chart_count = BirthChart.query.filter_by(user_id=user_id).count()
        max_charts = 5  # Default for free users

        if user.is_premium:
            # Get from subscription
            from models.database import Subscription
            subscription = Subscription.query.filter_by(user_id=user_id).first()
            if subscription:
                max_charts = subscription.max_charts

        if chart_count >= max_charts:
            return {'error': f'Chart limit reached ({max_charts}). Upgrade to premium for more.'}, 403

        data = request.get_json()

        if not data:
            return {'error': 'Request body is required'}, 400

        # Validate required fields
        if 'name' not in data or not data['name']:
            return {'error': 'Chart name is required'}, 400

        if 'birth_date' not in data or not data['birth_date']:
            return {'error': 'Birth date is required'}, 400

        # Parse birth date
        try:
            birth_date = datetime.fromisoformat(data['birth_date'])
        except (ValueError, TypeError):
            return {'error': 'Invalid birth date format (use ISO format)'}, 400

        # Parse birth time if provided
        birth_time = None
        if 'birth_time' in data and data['birth_time']:
            try:
                time_obj = datetime.fromisoformat(f"2000-01-01T{data['birth_time']}")
                birth_time = time_obj.time()
            except (ValueError, TypeError):
                return {'error': 'Invalid birth time format'}, 400

        # Create chart
        chart = BirthChart(
            id=str(uuid.uuid4()),
            user_id=user_id,
            name=data['name'].strip(),
            birth_date=birth_date,
            birth_time=birth_time,
            birth_place=data.get('birth_place', '').strip(),
            birth_latitude=data.get('birth_latitude'),
            birth_longitude=data.get('birth_longitude'),
            description=data.get('description', '').strip(),
            is_public=False,
        )

        db.session.add(chart)
        db.session.commit()

        return {
            'success': True,
            'message': 'Chart created successfully',
            'chart_id': chart.id,
            'chart': chart.to_dict(),
        }, 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Create chart error: {str(e)}')
        return {'error': 'Failed to create chart'}, 500


# ==================== CHART RETRIEVAL & UPDATE ====================

@charts_bp.route('/<chart_id>', methods=['GET'])
@jwt_required()
def get_chart(chart_id):
    """
    Get specific chart with all data

    Response includes chart_data, strength_data, and dasha_data
    """
    try:
        user_id = get_jwt_identity()
        chart = BirthChart.query.filter_by(id=chart_id, user_id=user_id).first()

        if not chart:
            return {'error': 'Chart not found'}, 404

        return {
            'success': True,
            'chart': chart.to_dict(include_data=True),
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get chart error: {str(e)}')
        return {'error': 'Failed to retrieve chart'}, 500


@charts_bp.route('/<chart_id>', methods=['PUT'])
@jwt_required()
def update_chart(chart_id):
    """
    Update chart metadata

    Request:
    {
        "name": "Updated Name",
        "description": "Updated description"
    }
    """
    try:
        user_id = get_jwt_identity()
        chart = BirthChart.query.filter_by(id=chart_id, user_id=user_id).first()

        if not chart:
            return {'error': 'Chart not found'}, 404

        data = request.get_json()

        if not data:
            return {'error': 'Request body is required'}, 400

        # Update fields
        if 'name' in data and data['name']:
            chart.name = data['name'].strip()

        if 'description' in data:
            chart.description = data['description'].strip() if data['description'] else None

        if 'notes' in data:
            chart.notes = data['notes'].strip() if data['notes'] else None

        chart.updated_at = datetime.utcnow()
        db.session.commit()

        return {
            'success': True,
            'message': 'Chart updated successfully',
            'chart': chart.to_dict(),
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Update chart error: {str(e)}')
        return {'error': 'Failed to update chart'}, 500


@charts_bp.route('/<chart_id>', methods=['DELETE'])
@jwt_required()
def delete_chart(chart_id):
    """Delete a chart"""
    try:
        user_id = get_jwt_identity()
        chart = BirthChart.query.filter_by(id=chart_id, user_id=user_id).first()

        if not chart:
            return {'error': 'Chart not found'}, 404

        db.session.delete(chart)
        db.session.commit()

        return {
            'success': True,
            'message': 'Chart deleted successfully',
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Delete chart error: {str(e)}')
        return {'error': 'Failed to delete chart'}, 500


# ==================== CHART DATA PERSISTENCE ====================

@charts_bp.route('/<chart_id>/save', methods=['POST'])
@jwt_required()
def save_chart_data(chart_id):
    """
    Save calculated chart data

    Request:
    {
        "chart_data": { ... },
        "strength_data": { ... },
        "dasha_data": { ... }
    }
    """
    try:
        user_id = get_jwt_identity()
        chart = BirthChart.query.filter_by(id=chart_id, user_id=user_id).first()

        if not chart:
            return {'error': 'Chart not found'}, 404

        data = request.get_json()

        if not data:
            return {'error': 'Request body is required'}, 400

        # Save different data types
        if 'chart_data' in data:
            chart.chart_data = data['chart_data']

        if 'strength_data' in data:
            chart.strength_data = data['strength_data']

        if 'dasha_data' in data:
            chart.dasha_data = data['dasha_data']

        chart.last_analyzed_at = datetime.utcnow()
        chart.updated_at = datetime.utcnow()
        db.session.commit()

        return {
            'success': True,
            'message': 'Chart data saved successfully',
            'chart_id': chart_id,
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Save chart data error: {str(e)}')
        return {'error': 'Failed to save chart data'}, 500


# ==================== CHART SHARING ====================

@charts_bp.route('/<chart_id>/share', methods=['POST'])
@jwt_required()
def share_chart(chart_id):
    """
    Toggle chart sharing (public/private)

    Request:
    {
        "is_public": true
    }
    """
    try:
        user_id = get_jwt_identity()
        chart = BirthChart.query.filter_by(id=chart_id, user_id=user_id).first()

        if not chart:
            return {'error': 'Chart not found'}, 404

        data = request.get_json()

        if not data or 'is_public' not in data:
            return {'error': 'is_public field is required'}, 400

        chart.is_public = bool(data['is_public'])
        chart.updated_at = datetime.utcnow()
        db.session.commit()

        return {
            'success': True,
            'message': f'Chart is now {"public" if chart.is_public else "private"}',
            'is_public': chart.is_public,
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Share chart error: {str(e)}')
        return {'error': 'Failed to update chart sharing'}, 500


@charts_bp.route('/shared', methods=['GET'])
@jwt_required()
def get_shared_charts():
    """
    Get public charts shared by other users

    Query parameters:
    - page: Page number
    - per_page: Items per page
    - search: Search by chart name
    """
    try:
        user_id = get_jwt_identity()

        # Pagination
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 50)

        # Build query (public charts from other users)
        query = BirthChart.query.filter(
            BirthChart.is_public == True,
            BirthChart.user_id != user_id
        )

        # Search filter
        search = request.args.get('search', '').strip()
        if search:
            query = query.filter(BirthChart.name.ilike(f'%{search}%'))

        # Sort by latest
        query = query.order_by(BirthChart.created_at.desc())

        # Pagination
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        return {
            'success': True,
            'charts': [chart.to_dict() for chart in paginated.items],
            'pagination': {
                'total': paginated.total,
                'page': page,
                'per_page': per_page,
                'pages': paginated.pages,
            }
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get shared charts error: {str(e)}')
        return {'error': 'Failed to retrieve shared charts'}, 500


# ==================== CHART STATS ====================

@charts_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_chart_stats():
    """Get user's chart statistics"""
    try:
        user_id = get_jwt_identity()

        total_charts = BirthChart.query.filter_by(user_id=user_id).count()
        public_charts = BirthChart.query.filter_by(user_id=user_id, is_public=True).count()
        analyzed_charts = BirthChart.query.filter_by(user_id=user_id).filter(
            BirthChart.last_analyzed_at.isnot(None)
        ).count()

        return {
            'success': True,
            'stats': {
                'total_charts': total_charts,
                'public_charts': public_charts,
                'analyzed_charts': analyzed_charts,
                'private_charts': total_charts - public_charts,
            }
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get chart stats error: {str(e)}')
        return {'error': 'Failed to retrieve chart statistics'}, 500
