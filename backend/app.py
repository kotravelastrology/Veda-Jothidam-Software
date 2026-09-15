import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from database import db, init_db, get_db_path
from models import User, Chart, Consultation, PhaseData
from config import get_config
from security_headers import add_security_headers, token_blacklist_loader
from jwt_handler import JWTHandler

def create_app(config_name=None):
    """Factory function to create Flask app with security hardening."""
    app = Flask(__name__)

    # Load configuration
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    config = get_config(config_name)
    app.config.from_object(config)

    # Validate configuration
    try:
        config.validate()
    except ValueError as e:
        logging.error(f"Configuration error: {e}")
        raise

    # Set database URI
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        database_url = get_db_path()
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url

    # Initialize extensions
    db.init_app(app)

    # Initialize JWT Manager
    jwt = JWTManager(app)

    # Configure JWT blacklist checking
    token_blacklist_loader(jwt)

    # Configure CORS with security settings
    cors_options = {
        'origins': app.config['CORS_ORIGINS'],
        'allow_headers': app.config['CORS_ALLOW_HEADERS'],
        'expose_headers': app.config['CORS_EXPOSE_HEADERS'],
        'methods': app.config['CORS_METHODS'],
        'max_age': app.config['CORS_MAX_AGE'],
        'supports_credentials': app.config['CORS_ALLOW_CREDENTIALS'],
    }
    CORS(app, **cors_options)

    # Add security headers to all responses
    add_security_headers(app)

    # Initialize database
    with app.app_context():
        init_db(app)

    # Register blueprints
    from routes import auth, charts
    app.register_blueprint(auth.bp)
    app.register_blueprint(charts.bp)

    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        """Handle bad request errors."""
        return jsonify({'error': 'Bad request'}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        """Handle unauthorized errors."""
        return jsonify({'error': 'Unauthorized'}), 401

    @app.errorhandler(403)
    def forbidden(error):
        """Handle forbidden errors."""
        return jsonify({'error': 'Forbidden'}), 403

    @app.errorhandler(404)
    def not_found(error):
        """Handle not found errors."""
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(429)
    def rate_limited(error):
        """Handle rate limit errors."""
        return jsonify({'error': 'Too many requests'}), 429

    @app.errorhandler(500)
    def internal_error(error):
        """Handle internal server errors."""
        logging.error(f"Internal error: {error}")
        return jsonify({'error': 'Internal server error'}), 500

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        return {
            'status': 'OK',
            'message': 'Veda Jothidam Backend is running',
            'version': '1.0.0'
        }, 200

    # Configuration endpoint (development only)
    @app.route('/api/config', methods=['GET'])
    def get_app_config():
        if app.config['DEBUG']:
            return {
                'env': app.config['FLASK_ENV'],
                'debug': app.config['DEBUG'],
                'cors_origins': app.config['CORS_ORIGINS'],
            }, 200
        return {'error': 'Not available in production'}, 403

    return app

if __name__ == '__main__':
    app = create_app()
    print("[OK] Flask app created successfully!")
    print(f"[DB] Database: {os.getenv('DATABASE_URL', get_db_path())}")
    print(f"[ENV] Environment: {os.getenv('FLASK_ENV', 'development')}")
    print("[SECURITY] Security hardening: ENABLED")
    print("[START] To run: python -m backend.app")
