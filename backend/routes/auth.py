from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from models import User
from validators import (
    EmailValidator, PasswordValidator, StringValidator, ValidationError
)
from jwt_handler import JWTHandler
from security_headers import require_secure_headers
import uuid
import logging

bp = Blueprint('auth', __name__, url_prefix='/api/auth')
logger = logging.getLogger(__name__)

@bp.route('/signup', methods=['POST'])
@require_secure_headers
def signup():
    """User signup endpoint with validation."""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        # Validate required fields
        try:
            email = EmailValidator.validate(data.get('email', ''))
            password = PasswordValidator.validate(data.get('password', ''))
            full_name = StringValidator.validate_name(data.get('full_name', '')) if data.get('full_name') else 'User'
            language = data.get('language', 'tamil')
            timezone = data.get('timezone', 'Asia/Kolkata')
        except ValidationError as e:
            logger.warning(f"Signup validation failed: {str(e)}")
            return jsonify({'error': str(e)}), 400

        # Check if user already exists (by email or username)
        username = data.get('username') or email.split('@')[0]  # Use provided username or derive from email
        existing_user = User.query.filter((User.email == email) | (User.username == username)).first()
        if existing_user:
            logger.warning(f"Signup attempt with existing email/username: {email}")
            return jsonify({'error': 'Email or username already registered'}), 409

        # Create new user
        user = User(
            email=email,
            username=username,
            password_hash=generate_password_hash(password, method='pbkdf2:sha256', salt_length=32),
            full_name=full_name,
            language=language,
            timezone=timezone,
            is_active=True
        )

        db.session.add(user)
        db.session.commit()

        logger.info(f"New user created: {user.id}")

        # Generate tokens (short-lived access + refresh tokens)
        access_token, refresh_token = JWTHandler.create_tokens(user.id)

        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer'
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Signup error: {str(e)}")
        return jsonify({'error': 'An error occurred during signup'}), 500

@bp.route('/login', methods=['POST'])
@require_secure_headers
def login():
    """User login endpoint with validation."""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        # Validate inputs
        try:
            email = EmailValidator.validate(data.get('email', ''))
            password = data.get('password', '')

            if not password:
                raise ValidationError("Password is required")
        except ValidationError as e:
            logger.warning(f"Login validation failed: {str(e)}")
            return jsonify({'error': 'Invalid email or password'}), 401

        # Find user by email
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            logger.warning(f"Failed login attempt for: {email}")
            return jsonify({'error': 'Invalid email or password'}), 401

        logger.info(f"User logged in: {user.id}")

        # Generate tokens (short-lived access + refresh tokens)
        access_token, refresh_token = JWTHandler.create_tokens(user.id)

        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer'
        }), 200

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'An error occurred during login'}), 500

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@require_secure_headers
def refresh():
    """Refresh access token using refresh token."""
    try:
        user_id = get_jwt_identity()

        # Create new access token
        access_token = JWTHandler.create_access_token_from_refresh(user_id)

        logger.info(f"Token refreshed for user: {user_id}")

        return jsonify({
            'message': 'Token refreshed successfully',
            'access_token': access_token,
            'token_type': 'Bearer'
        }), 200

    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return jsonify({'error': 'Token refresh failed'}), 500

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'user': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()

        # Update allowed fields
        if 'name' in data:
            user.name = data['name']
        if 'language' in data:
            user.language = data['language']
        if 'timezone' in data:
            user.timezone = data['timezone']

        db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/change-password', methods=['POST'])
@jwt_required()
@require_secure_headers
def change_password():
    """Change user password with validation."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()

        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        # Validate inputs
        try:
            old_password = data.get('old_password', '')
            new_password = PasswordValidator.validate(data.get('new_password', ''))

            if not old_password:
                raise ValidationError("Old password is required")
        except ValidationError as e:
            return jsonify({'error': str(e)}), 400

        # Verify old password
        if not check_password_hash(user.password_hash, old_password):
            logger.warning(f"Invalid old password attempt for user: {user_id}")
            return jsonify({'error': 'Old password is incorrect'}), 401

        # Prevent reusing same password
        if check_password_hash(user.password_hash, new_password):
            return jsonify({'error': 'New password cannot be the same as old password'}), 400

        # Update password
        user.password_hash = generate_password_hash(new_password, method='pbkdf2:sha256', salt_length=32)
        db.session.commit()

        logger.info(f"Password changed for user: {user_id}")

        return jsonify({
            'message': 'Password changed successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Password change error: {str(e)}")
        return jsonify({'error': 'An error occurred while changing password'}), 500

@bp.route('/logout', methods=['POST'])
@jwt_required()
@require_secure_headers
def logout():
    """Logout endpoint (invalidate token)."""
    try:
        user_id = get_jwt_identity()
        from flask_jwt_extended import get_jwt

        claims = get_jwt()
        jti = claims.get('jti')

        if jti:
            # Add token to blacklist
            from datetime import datetime, timedelta
            expires_at = datetime.utcnow() + timedelta(minutes=15)  # Match access token expiry
            JWTHandler.add_token_to_blacklist(jti, user_id, expires_at)

        logger.info(f"User logged out: {user_id}")

        return jsonify({
            'message': 'Logout successful'
        }), 200

    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return jsonify({'error': 'Logout failed'}), 500
