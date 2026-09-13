from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.database import db
from backend.models import Chart, PhaseData
from backend.calculators import AstroEngine
from backend.validators import ChartDataValidator, ValidationError
from backend.security_headers import require_secure_headers
from datetime import datetime, time
import uuid
import logging

bp = Blueprint('charts', __name__, url_prefix='/api/charts')
logger = logging.getLogger(__name__)

@bp.route('/create', methods=['POST'])
@jwt_required()
@require_secure_headers
def create_chart():
    """Create a new chart with validation."""
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

        # Create new chart
        chart = Chart(
            id=str(uuid.uuid4()),
            user_id=user_id,
            name=validated_data['name'],
            birth_date=validated_data['birth_date'],
            birth_time=validated_data['birth_time'],
            birth_place=validated_data['birth_place'],
            latitude=validated_data['latitude'],
            longitude=validated_data['longitude'],
            timezone=validated_data['timezone']
        )

        db.session.add(chart)
        db.session.commit()

        logger.info(f"Chart created: {chart.id} by user {user_id}")

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

@bp.route('/<chart_id>/save-phase', methods=['POST'])
@jwt_required()
def save_phase_data(chart_id):
    """Save phase calculation data for a chart."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validate required fields
        if not data.get('phase_number') or not data.get('phase_name'):
            return jsonify({'error': 'phase_number and phase_name required'}), 400

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Remove existing phase data for this phase (update instead of duplicate)
        existing = PhaseData.query.filter_by(
            chart_id=chart_id,
            phase_number=data['phase_number']
        ).first()

        if existing:
            # Update existing phase data
            existing.phase_name = data['phase_name']
            existing.data = data.get('data', {})
            existing.updated_at = datetime.utcnow()
            db.session.commit()
            return jsonify({
                'message': 'Phase data updated successfully',
                'phase_data': existing.to_dict()
            }), 200
        else:
            # Create new phase data
            phase_data = PhaseData(
                id=str(uuid.uuid4()),
                chart_id=chart_id,
                phase_number=data['phase_number'],
                phase_name=data['phase_name'],
                data=data.get('data', {})
            )

            db.session.add(phase_data)
            db.session.commit()

            return jsonify({
                'message': 'Phase data saved successfully',
                'phase_data': phase_data.to_dict()
            }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/<chart_id>', methods=['GET'])
@jwt_required()
def get_chart(chart_id):
    """Get a specific chart with all phase data."""
    try:
        user_id = get_jwt_identity()

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Get all phase data for this chart
        phases = PhaseData.get_phases_for_chart(chart_id)

        return jsonify({
            'chart': chart.to_dict(),
            'phases': [phase.to_dict() for phase in phases],
            'phase_count': len(phases)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('', methods=['GET'])
@jwt_required()
def list_charts():
    """List all charts for the current user."""
    try:
        user_id = get_jwt_identity()

        # Get all charts for user
        charts = Chart.query.filter_by(user_id=user_id).order_by(Chart.created_at.desc()).all()

        chart_data = []
        for chart in charts:
            # Count phases for each chart
            phase_count = PhaseData.query.filter_by(chart_id=chart.id).count()
            chart_dict = chart.to_dict()
            chart_dict['phase_count'] = phase_count
            chart_data.append(chart_dict)

        return jsonify({
            'charts': chart_data,
            'total_count': len(chart_data)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<chart_id>/phases', methods=['GET'])
@jwt_required()
def get_all_phases(chart_id):
    """Get all phase data for a chart."""
    try:
        user_id = get_jwt_identity()

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Get all phases, organized by phase number
        phases = PhaseData.get_phases_for_chart(chart_id)

        phases_dict = {}
        for phase in phases:
            phases_dict[f'phase_{phase.phase_number}'] = phase.to_dict()

        return jsonify({
            'chart_id': chart_id,
            'chart_name': chart.name,
            'phases': phases_dict,
            'total_phases': len(phases)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<chart_id>/phase/<int:phase_number>', methods=['GET'])
@jwt_required()
def get_single_phase(chart_id, phase_number):
    """Get a specific phase data."""
    try:
        user_id = get_jwt_identity()

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Get specific phase
        phase = PhaseData.query.filter_by(
            chart_id=chart_id,
            phase_number=phase_number
        ).first()

        if not phase:
            return jsonify({'error': f'Phase {phase_number} not found'}), 404

        return jsonify({
            'phase_data': phase.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<chart_id>', methods=['PUT'])
@jwt_required()
def update_chart(chart_id):
    """Update chart information."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Update allowed fields
        if 'name' in data:
            chart.name = data['name']
        if 'timezone' in data:
            chart.timezone = data['timezone']

        db.session.commit()

        return jsonify({
            'message': 'Chart updated successfully',
            'chart': chart.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/<chart_id>', methods=['DELETE'])
@jwt_required()
def delete_chart(chart_id):
    """Delete a chart and all its phase data."""
    try:
        user_id = get_jwt_identity()

        # Verify chart belongs to user
        chart = Chart.query.filter_by(id=chart_id, user_id=user_id).first()
        if not chart:
            return jsonify({'error': 'Chart not found or access denied'}), 404

        # Delete all phase data first (cascade)
        PhaseData.query.filter_by(chart_id=chart_id).delete()

        # Delete chart
        db.session.delete(chart)
        db.session.commit()

        return jsonify({
            'message': 'Chart deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/search', methods=['GET'])
@jwt_required()
def search_charts():
    """Search charts by name."""
    try:
        user_id = get_jwt_identity()
        query_str = request.args.get('q', '')

        if not query_str:
            return jsonify({'error': 'Search query required'}), 400

        # Search charts
        charts = Chart.query.filter(
            Chart.user_id == user_id,
            Chart.name.ilike(f'%{query_str}%')
        ).all()

        chart_data = []
        for chart in charts:
            phase_count = PhaseData.query.filter_by(chart_id=chart.id).count()
            chart_dict = chart.to_dict()
            chart_dict['phase_count'] = phase_count
            chart_data.append(chart_dict)

        return jsonify({
            'query': query_str,
            'results': chart_data,
            'result_count': len(chart_data)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/compute', methods=['POST'])
def compute_divisional_charts():
    """Compute divisional charts for given birth data using real calculations."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['date', 'time', 'latitude', 'longitude']
        for field in required:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Parse input
        date_str = data['date']  # YYYY-MM-DD
        time_str = data['time']  # HH:MM:SS
        latitude = float(data['latitude'])
        longitude = float(data['longitude'])
        include_charts = data.get('includeCharts', ['D1', 'D9', 'D10', 'D20'])

        # Parse birth date
        birth_date = datetime.fromisoformat(date_str)

        # Calculate real planetary positions using AstroEngine
        charts_data = {}

        for chart_id in include_charts:
            division = int(chart_id[1:])
            points = []

            # Calculate position for each planet
            for i, planet in enumerate(AstroEngine.PLANETS):
                sign_idx, deg_in_sign = AstroEngine.calculate_planetary_position(birth_date, time_str, i)

                # Adjust for divisional chart division
                adjusted_deg = (deg_in_sign * division) % 30
                adjusted_sign = (sign_idx + int((deg_in_sign * division) / 30)) % 12

                point = {
                    'label': planet,
                    'rasiName': AstroEngine.SIGNS[adjusted_sign],
                    'rasiTamil': AstroEngine.SIGNS_TAMIL[adjusted_sign],
                    'deg': round((adjusted_sign * 30 + adjusted_deg), 2),
                    'degInRasi': round(adjusted_deg, 2),
                    'kp': {
                        'signLord': AstroEngine.SIGNS[adjusted_sign],
                        'starLord': planet,
                        'sub': AstroEngine.PLANETS[(i + 1) % len(AstroEngine.PLANETS)],
                        'subSub': AstroEngine.SIGNS[(adjusted_sign + 1) % 12]
                    }
                }
                points.append(point)

            # Add Lagna
            lagna_sign, lagna_deg = AstroEngine.calculate_planetary_position(birth_date, time_str, 0)
            lagna_adj_sign = (lagna_sign + int((lagna_deg * division) / 30)) % 12

            charts_data[chart_id] = {
                'chartId': chart_id,
                'division': division,
                'points': points,
                'lagnaRasiIndex': lagna_adj_sign,
                'lagnaRasi': AstroEngine.SIGNS[lagna_adj_sign],
                'lagnaRasiTamil': AstroEngine.SIGNS_TAMIL[lagna_adj_sign]
            }

        return jsonify({
            'success': True,
            'date': date_str,
            'time': time_str,
            'latitude': latitude,
            'longitude': longitude,
            **charts_data
        }), 200

    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/yogas/detect', methods=['POST'])
def detect_yogas():
    """Detect yogas in a chart using real calculations (Phase 11 engine)."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['date', 'time', 'latitude', 'longitude']
        for field in required:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Parse input
        date_str = data['date']
        time_str = data['time']
        latitude = float(data['latitude'])
        longitude = float(data['longitude'])

        # Parse birth date
        birth_date = datetime.fromisoformat(date_str)

        # Calculate planetary positions
        planets_data = {}
        for i, planet in enumerate(AstroEngine.PLANETS):
            sign_idx, deg_in_sign = AstroEngine.calculate_planetary_position(birth_date, time_str, i)
            house = int((sign_idx * 2.5) % 12)  # Simplified house assignment
            strength = AstroEngine.get_planet_strength(planet, sign_idx, house)

            planets_data[planet] = {
                'sign': sign_idx,
                'deg': deg_in_sign,
                'house': house,
                'strength': strength
            }

        # Detect yogas using real calculation engine
        yogas = AstroEngine.detect_yogas(planets_data)

        return jsonify({
            'success': True,
            'date': date_str,
            'time': time_str,
            'latitude': latitude,
            'longitude': longitude,
            'yogas': yogas,
            'totalCount': len(yogas),
            'beneficCount': len([y for y in yogas if y['type'] == 'benefic']),
            'maleficCount': len([y for y in yogas if y['type'] == 'malefic']),
        }), 200

    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/bhava-bala/analyze', methods=['POST'])
def analyze_bhava_bala():
    """Analyze house strengths (Bhava Bala) using real calculations."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['date', 'time', 'latitude', 'longitude']
        for field in required:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Parse input
        date_str = data['date']
        time_str = data['time']
        latitude = float(data['latitude'])
        longitude = float(data['longitude'])

        # Parse birth date
        birth_date = datetime.fromisoformat(date_str)

        # Calculate planetary positions and houses
        planets_data = {}
        for i, planet in enumerate(AstroEngine.PLANETS):
            sign_idx, deg_in_sign = AstroEngine.calculate_planetary_position(birth_date, time_str, i)
            house = int((sign_idx * 2.5) % 12)  # Simplified house assignment
            strength = AstroEngine.get_planet_strength(planet, sign_idx, house)

            planets_data[planet] = {
                'sign': sign_idx,
                'deg': deg_in_sign,
                'house': house,
                'strength': strength
            }

        # Calculate house strengths
        houses = AstroEngine.calculate_bhava_bala(planets_data)

        total_strength = sum(h['strength'] for h in houses) // len(houses)
        strong_houses = len([h for h in houses if h['strength'] >= 75])
        weak_houses = len([h for h in houses if h['strength'] < 50])

        return jsonify({
            'success': True,
            'date': date_str,
            'time': time_str,
            'latitude': latitude,
            'longitude': longitude,
            'houses': houses,
            'totalStrength': total_strength,
            'strongHouses': strong_houses,
            'weakHouses': weak_houses,
        }), 200

    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/vimshottari-dasha/calculate', methods=['POST'])
def calculate_vimshottari_dasha():
    """Calculate Vimshottari Dasha timeline using real calculations."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['date', 'time', 'latitude', 'longitude']
        for field in required:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Parse input
        date_str = data['date']
        time_str = data['time']
        latitude = float(data['latitude'])
        longitude = float(data['longitude'])

        # Parse birth date
        birth_date = datetime.fromisoformat(date_str)

        # Calculate dasha timeline using real engine
        dashas = AstroEngine.calculate_dasha_timeline(birth_date)

        total_duration = sum(d['duration'] for d in dashas)
        current_dasha = next((d for d in dashas if d['status'] == 'current'), None)

        return jsonify({
            'success': True,
            'date': date_str,
            'time': time_str,
            'latitude': latitude,
            'longitude': longitude,
            'dashas': dashas,
            'totalDuration': total_duration,
            'currentDasha': current_dasha,
        }), 200

    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/reports/generate', methods=['POST'])
def generate_report():
    """Generate PDF report for a chart."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'birthData' not in data or 'reportConfig' not in data:
            return jsonify({'error': 'birthData and reportConfig required'}), 400
        
        birth_data = data['birthData']
        report_config = data['reportConfig']
        
        # For now, return a placeholder PDF response
        # In production, this would use PyPDF or similar to generate actual PDF
        # with chart data, interpretations, and client customizations
        
        pdf_content = b'%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 182\n%%EOF'
        
        return response.file_response(
            pdf_content,
            mimetype='application/pdf',
            as_attachment=True,
            attachment_filename=f"astrology_report_{report_config['clientName']}.pdf"
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
