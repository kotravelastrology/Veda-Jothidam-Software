"""
Veda Jothidam Backend API

Flask application for Vedic astrology calculations
- Dasha (planetary period) calculations
- Shadbala (6-fold planetary strength) calculations
- Birth chart analysis
"""

from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime
import os

from backend.api.calculations import calculations_bp


def create_app(config=None):
    """Create and configure Flask application"""
    
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app)
    
    # Configuration
    app.config['JSON_SORT_KEYS'] = False
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
    
    if config:
        app.config.update(config)
    
    # Register blueprints
    app.register_blueprint(calculations_bp)
    
    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'Endpoint not found',
            'message': 'The requested endpoint does not exist',
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            'success': False,
            'error': 'Method not allowed',
            'message': 'The HTTP method is not allowed for this endpoint',
        }), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': 'An unexpected error occurred',
        }), 500
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            'name': 'Veda Jothidam Backend API',
            'version': '1.0.0',
            'description': 'Vedic astrology calculation engine',
            'status': 'running',
            'timestamp': datetime.now().isoformat(),
            'endpoints': {
                'health': 'GET /api/calculations/health',
                'documentation': 'GET /api/docs',
            },
        }), 200
    
    # API info endpoint
    @app.route('/api', methods=['GET'])
    def api_info():
        return jsonify({
            'name': 'Veda Jothidam API',
            'version': '1.0.0',
            'description': 'REST API for Vedic astrology calculations',
            'base_url': '/api',
            'modules': {
                'calculations': {
                    'base': '/calculations',
                    'description': 'Dasha and Shadbala calculations',
                },
            },
        }), 200
    
    return app


# Create app instance
app = create_app()


if __name__ == '__main__':
    # Run development server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"""
    ╔════════════════════════════════════════╗
    ║   Veda Jothidam Backend API            ║
    ║   Vedic Astrology Calculation Engine   ║
    ║                                        ║
    ║   Running on http://localhost:{port}  ║
    ║   Debug Mode: {debug}                  ║
    ║                                        ║
    ║   Health Check: /api/calculations/health │
    ║   API Info: /api                        ║
    ╚════════════════════════════════════════╝
    """)
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        use_reloader=debug,
    )
