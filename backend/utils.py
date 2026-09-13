"""Utility functions for the backend."""
from flask import jsonify
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash, check_password_hash

def register_jwt_handlers(app):
    """Register JWT error handlers."""
    jwt = JWTManager(app)

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return identity

    @jwt.additional_claims_loader
    def add_claims_to_jwt(identity):
        return {}

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized - Invalid or missing token'}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden - Access denied'}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

def hash_password(password: str) -> str:
    """Hash a password."""
    return generate_password_hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash."""
    return check_password_hash(password_hash, password)
