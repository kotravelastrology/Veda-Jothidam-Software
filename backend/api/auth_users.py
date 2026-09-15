"""
User Authentication & Management API Endpoints

Endpoints:
- User registration (POST /register)
- User login (POST /login)
- Token refresh (POST /refresh)
- User profile (GET /profile, PUT /profile)
- User settings (GET /settings, PUT /settings)
- Logout (POST /logout)
- Password change (POST /change-password)

Authentication:
- JWT bearer tokens (access + refresh)
- Password hashing with PBKDF2:SHA256
- Email verification support
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import uuid
import re
from functools import wraps

from models.database import db, User, Subscription

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
users_bp = Blueprint('users', __name__, url_prefix='/api/users')


# ==================== HELPER FUNCTIONS ====================

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password: str) -> tuple:
    """
    Validate password strength

    Returns:
        (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one digit"
    if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
        return False, "Password must contain at least one special character"
    return True, ""


def jwt_required_custom(f):
    """Custom JWT requirement decorator"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            user_id = get_jwt_identity()
            if not user_id:
                return {'error': 'Missing authorization token'}, 401
            return f(*args, **kwargs)
        except Exception as e:
            return {'error': 'Invalid authorization token'}, 401
    return decorated_function


# ==================== AUTHENTICATION ENDPOINTS ====================

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user

    Request:
    {
        "email": "user@example.com",
        "username": "username",
        "password": "SecurePass123!",
        "full_name": "Full Name",
        "language": "en"
    }

    Response:
    {
        "success": true,
        "user_id": "uuid",
        "email": "user@example.com",
        "token": "jwt_token",
        "refresh_token": "jwt_refresh_token"
    }
    """
    data = request.get_json()

    # Validate required fields
    if not data:
        return {'error': 'Request body is required'}, 400

    required_fields = ['email', 'username', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            return {'error': f'{field.capitalize()} is required'}, 400

    email = data['email'].lower().strip()
    username = data['username'].strip()
    password = data['password']
    full_name = data.get('full_name', '').strip()
    language = data.get('language', 'en')

    # Validate email format
    if not validate_email(email):
        return {'error': 'Invalid email format'}, 400

    # Validate username
    if len(username) < 3 or len(username) > 100:
        return {'error': 'Username must be 3-100 characters long'}, 400
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        return {'error': 'Username can only contain alphanumeric characters, hyphens, and underscores'}, 400

    # Validate password strength
    is_valid, error_msg = validate_password(password)
    if not is_valid:
        return {'error': error_msg}, 400

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return {'error': 'Email already registered'}, 409

    # Check if username already exists
    if User.query.filter_by(username=username).first():
        return {'error': 'Username already taken'}, 409

    try:
        # Create new user
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            username=username,
            full_name=full_name,
            language=language,
        )
        user.set_password(password)

        # Create default free subscription
        subscription = Subscription(
            id=str(uuid.uuid4()),
            user_id=user.id,
            plan='basic',
            status='active',
            price=0,
            max_charts=5,
            max_consultations=5,
        )

        db.session.add(user)
        db.session.add(subscription)
        db.session.commit()

        return {
            'success': True,
            'message': 'User registered successfully',
            'user_id': user.id,
            'email': user.email,
            'username': user.username,
            'token': user.generate_token(),
            'refresh_token': user.generate_refresh_token(),
        }, 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Registration error: {str(e)}')
        return {'error': 'Failed to register user'}, 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login

    Request:
    {
        "email": "user@example.com",
        "password": "SecurePass123!"
    }

    Response:
    {
        "success": true,
        "user_id": "uuid",
        "token": "jwt_token",
        "refresh_token": "jwt_refresh_token",
        "user": { ... }
    }
    """
    data = request.get_json()

    if not data:
        return {'error': 'Request body is required'}, 400

    email = data.get('email', '').lower().strip()
    password = data.get('password', '')

    if not email or not password:
        return {'error': 'Email and password are required'}, 400

    # Find user by email
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return {'error': 'Invalid email or password'}, 401

    if not user.is_active:
        return {'error': 'Account is disabled'}, 403

    try:
        # Update last login
        user.last_login = datetime.utcnow()
        user.last_login_ip = request.remote_addr
        db.session.commit()

        return {
            'success': True,
            'message': 'Login successful',
            'user_id': user.id,
            'token': user.generate_token(),
            'refresh_token': user.generate_refresh_token(),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'full_name': user.full_name,
                'is_premium': user.is_premium,
                'language': user.language,
            }
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Login error: {str(e)}')
        return {'error': 'Login failed'}, 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required()
def refresh_token():
    """
    Refresh access token using current JWT

    Response:
    {
        "success": true,
        "token": "new_jwt_token"
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or not user.is_active:
            return {'error': 'User not found or inactive'}, 401

        return {
            'success': True,
            'token': user.generate_token(),
        }, 200

    except Exception as e:
        current_app.logger.error(f'Token refresh error: {str(e)}')
        return {'error': 'Token refresh failed'}, 500


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    User logout

    Note: JWT tokens are stateless, so logout is mainly client-side
    This endpoint can be used for logging activity
    """
    try:
        user_id = get_jwt_identity()
        # Could log logout activity here

        return {
            'success': True,
            'message': 'Logout successful',
        }, 200

    except Exception as e:
        current_app.logger.error(f'Logout error: {str(e)}')
        return {'error': 'Logout failed'}, 500


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """
    Change user password

    Request:
    {
        "current_password": "OldPass123!",
        "new_password": "NewPass456!"
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {'error': 'User not found'}, 404

        data = request.get_json()

        if not data:
            return {'error': 'Request body is required'}, 400

        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return {'error': 'Current and new passwords are required'}, 400

        # Verify current password
        if not user.check_password(current_password):
            return {'error': 'Current password is incorrect'}, 401

        # Validate new password strength
        is_valid, error_msg = validate_password(new_password)
        if not is_valid:
            return {'error': error_msg}, 400

        # Set new password
        user.set_password(new_password)
        db.session.commit()

        return {
            'success': True,
            'message': 'Password changed successfully',
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Password change error: {str(e)}')
        return {'error': 'Failed to change password'}, 500


# ==================== USER PROFILE ENDPOINTS ====================

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """
    Get user profile

    Response:
    {
        "success": true,
        "user": { ... user data ... }
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {'error': 'User not found'}, 404

        return {
            'success': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'full_name': user.full_name,
                'phone': user.phone,
                'profile_image': user.profile_image,
                'bio': user.bio,
                'date_of_birth': user.date_of_birth.isoformat() if user.date_of_birth else None,
                'language': user.language,
                'timezone': user.timezone,
                'theme': user.theme,
                'is_premium': user.is_premium,
                'premium_until': user.premium_until.isoformat() if user.premium_until else None,
                'created_at': user.created_at.isoformat() if user.created_at else None,
            }
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get profile error: {str(e)}')
        return {'error': 'Failed to retrieve profile'}, 500


@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    Update user profile

    Request:
    {
        "full_name": "New Name",
        "phone": "+1234567890",
        "bio": "User bio",
        "date_of_birth": "1990-05-15"
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {'error': 'User not found'}, 404

        data = request.get_json()

        if not data:
            return {'error': 'Request body is required'}, 400

        # Update fields
        if 'full_name' in data and data['full_name']:
            user.full_name = data['full_name'].strip()

        if 'phone' in data and data['phone']:
            user.phone = data['phone'].strip()

        if 'bio' in data and data['bio']:
            user.bio = data['bio'].strip()

        if 'date_of_birth' in data and data['date_of_birth']:
            try:
                user.date_of_birth = datetime.fromisoformat(data['date_of_birth']).date()
            except ValueError:
                return {'error': 'Invalid date format (use YYYY-MM-DD)'}, 400

        user.updated_at = datetime.utcnow()
        db.session.commit()

        return {
            'success': True,
            'message': 'Profile updated successfully',
            'user': user.to_dict(include_email=True),
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Update profile error: {str(e)}')
        return {'error': 'Failed to update profile'}, 500


@users_bp.route('/settings', methods=['GET'])
@jwt_required()
def get_settings():
    """Get user settings"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {'error': 'User not found'}, 404

        return {
            'success': True,
            'settings': {
                'language': user.language,
                'timezone': user.timezone,
                'theme': user.theme,
                'email_notifications': True,  # Can be expanded
                'sms_notifications': False,   # Can be expanded
            }
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get settings error: {str(e)}')
        return {'error': 'Failed to retrieve settings'}, 500


@users_bp.route('/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    """
    Update user settings

    Request:
    {
        "language": "en",
        "timezone": "UTC",
        "theme": "dark"
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {'error': 'User not found'}, 404

        data = request.get_json()

        if not data:
            return {'error': 'Request body is required'}, 400

        # Update settings
        if 'language' in data:
            valid_languages = ['en', 'ta', 'hi', 'te', 'ka', 'ml']
            if data['language'] not in valid_languages:
                return {'error': f'Invalid language. Supported: {", ".join(valid_languages)}'}, 400
            user.language = data['language']

        if 'timezone' in data:
            user.timezone = data['timezone'].strip()

        if 'theme' in data:
            valid_themes = ['light', 'dark', 'auto']
            if data['theme'] not in valid_themes:
                return {'error': f'Invalid theme. Supported: {", ".join(valid_themes)}'}, 400
            user.theme = data['theme']

        user.updated_at = datetime.utcnow()
        db.session.commit()

        return {
            'success': True,
            'message': 'Settings updated successfully',
        }, 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Update settings error: {str(e)}')
        return {'error': 'Failed to update settings'}, 500


@users_bp.route('/subscription', methods=['GET'])
@jwt_required()
def get_subscription():
    """Get user's current subscription"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {'error': 'User not found'}, 404

        subscription = Subscription.query.filter_by(user_id=user_id).order_by(
            Subscription.created_at.desc()
        ).first()

        if not subscription:
            return {
                'success': True,
                'subscription': None,
                'message': 'No active subscription',
            }, 200

        return {
            'success': True,
            'subscription': subscription.to_dict(),
        }, 200

    except Exception as e:
        current_app.logger.error(f'Get subscription error: {str(e)}')
        return {'error': 'Failed to retrieve subscription'}, 500


@users_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint (no auth required)"""
    return {
        'success': True,
        'status': 'healthy',
        'service': 'User Authentication & Management API',
        'timestamp': datetime.utcnow().isoformat(),
    }, 200
